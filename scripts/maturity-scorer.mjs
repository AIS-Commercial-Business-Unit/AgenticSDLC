/**
 * maturity-scorer.mjs
 *
 * Scores a repository against the Framework Maturity Profile.
 *
 * Usage:
 *   node scripts/maturity-scorer.mjs
 *
 * Exports:
 *   scoreMaturity(repoPath)
 *   maturityLabel(score)
 *   MATURITY_LABELS
 *   DIMENSIONS_META
 *   DIMENSION_IDS
 */

import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync } from 'fs'
import { resolve, join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import yaml from 'js-yaml'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const frameworkRoot = resolve(__dirname, '..')

const AIS_STEPS = ['Intake', 'Specify', 'Design', 'Plan', 'Implement', 'Verify', 'Deploy', 'Report', 'Learn']

export const MATURITY_LABELS = ['Absent', 'Ad Hoc', 'Emerging', 'Defined', 'Enforced', 'Measured']

export const DIMENSIONS_META = [
  {
    id: 'governance',
    label: 'Governance',
    description: 'Degree to which agent activities are defined, approved, and reviewed in a governance registry.',
    previous_categories: ['governance'],
  },
  {
    id: 'agent-coverage',
    label: 'Agent Coverage',
    description: 'Coverage of the AIS SDLC lifecycle steps by properly defined and governed agents.',
    previous_categories: ['agents'],
  },
  {
    id: 'skill-coverage',
    label: 'Skill Coverage',
    description: 'Quality and completeness of reusable skills implementing SDLC activities.',
    previous_categories: ['skills'],
  },
  {
    id: 'context-configuration',
    label: 'Context & Configuration',
    description: 'Whether agents have reliable, scoped context and the framework is properly configured.',
    previous_categories: ['config'],
  },
  {
    id: 'quality-verification',
    label: 'Quality & Verification',
    description: 'Whether agent-produced artifacts are validated by automated tests and schema checks.',
    previous_categories: ['tests'],
  },
  {
    id: 'delivery-automation',
    label: 'Delivery Automation',
    description: 'Degree to which delivery, deployment, and quality checks are automated in CI/CD.',
    previous_categories: ['ci'],
  },
  {
    id: 'documentation-enablement',
    label: 'Documentation & Enablement',
    description: 'Whether teams can understand, adopt, and extend the framework through documentation and playbooks.',
    previous_categories: ['docs', 'playbooks'],
  },
]

export const DIMENSION_IDS = DIMENSIONS_META.map(d => d.id)

export function maturityLabel(score) {
  if (score === 0) return 'Absent'
  if (score < 1.5) return 'Ad Hoc'
  if (score < 2.5) return 'Emerging'
  if (score < 3.5) return 'Defined'
  if (score < 4.5) return 'Enforced'
  return 'Measured'
}

function round1(value) {
  return Math.round((value + Number.EPSILON) * 10) / 10
}

function asArray(value) {
  return Array.isArray(value) ? value : []
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function hasArray(value) {
  return Array.isArray(value) && value.length > 0
}

function safeReadJson(filePath) {
  if (!existsSync(filePath)) return { data: null, error: null }
  try {
    return { data: JSON.parse(readFileSync(filePath, 'utf8')), error: null }
  } catch (error) {
    return { data: null, error }
  }
}

function safeReadYaml(filePath) {
  if (!existsSync(filePath)) return { data: null, error: null }
  try {
    return { data: yaml.load(readFileSync(filePath, 'utf8')), error: null }
  } catch (error) {
    return { data: null, error }
  }
}

function listFiles(dirPath, predicate = null) {
  if (!existsSync(dirPath)) return []
  try {
    return readdirSync(dirPath, { withFileTypes: true })
      .filter(entry => entry.isFile() && (!predicate || predicate(entry.name, join(dirPath, entry.name))))
      .map(entry => join(dirPath, entry.name))
  } catch {
    return []
  }
}

function listFilesRecursive(dirPath, predicate = null) {
  if (!existsSync(dirPath)) return []
  const files = []
  try {
    for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
      const fullPath = join(dirPath, entry.name)
      if (entry.isDirectory()) {
        files.push(...listFilesRecursive(fullPath, predicate))
      } else if (!predicate || predicate(entry.name, fullPath)) {
        files.push(fullPath)
      }
    }
  } catch {
    return files
  }
  return files
}

function relativePath(root, fullPath) {
  return fullPath.slice(root.length + 1).replace(/\\/g, '/')
}

function findFirstExisting(root, relativePaths) {
  for (const relPath of relativePaths) {
    const fullPath = join(root, relPath)
    if (existsSync(fullPath)) return fullPath
  }
  return null
}

function createCriterion(label, met, points, gap, action) {
  return { label, met, points, gap, action }
}

function buildDimension(meta, criteria, evidence) {
  const score = round1(criteria.reduce((sum, criterion) => sum + (criterion.met ? criterion.points : 0), 0))
  const unmet = criteria.filter(criterion => !criterion.met)
  const next = [...unmet].sort((a, b) => b.points - a.points)[0]

  return {
    id: meta.id,
    label: meta.label,
    description: meta.description,
    score,
    max_score: 5,
    maturity_level: maturityLabel(score),
    evidence: evidence.filter(Boolean),
    gaps: unmet.map(criterion => criterion.gap),
    next_action: next?.action ?? 'Maintain current controls and keep evidence current.',
    previous_categories: meta.previous_categories,
    score_breakdown: {
      criteria: criteria.map(({ label, met, points }) => ({ label, met, points })),
    },
  }
}

function inferSkillActivities(skills) {
  const activities = new Set()
  for (const skill of skills) {
    const name = String(skill.name ?? skill.fileName ?? '').toLowerCase()
    if (/repo|scan|audit/.test(name)) activities.add('intake')
    if (/config|governance/.test(name)) activities.add('specify')
    if (/gap|work-item/.test(name)) activities.add('plan')
    if (/schema|validat/.test(name)) activities.add('verify')
    if (/metrics|report/.test(name)) activities.add('report')
  }
  return activities
}

function scoreGovernance(root) {
  const meta = DIMENSIONS_META.find(d => d.id === 'governance')
  const registryPath = findFirstExisting(root, [
    join('framework', 'templates', 'governance-registry.yaml'),
    'governance-registry.yaml',
    join('config', 'governance-registry.yaml'),
  ])
  const summaryGridPath = join(root, 'docs', 'governance', 'summary-grid.json')
  const { data: registryDoc, error: registryError } = registryPath ? safeReadYaml(registryPath) : { data: null, error: null }
  const entries = asArray(registryDoc?.registry)
  const overdueEntries = entries.filter(entry => String(entry?.review_state ?? '').toLowerCase() === 'overdue')

  const hasApprovalRequirements = entries.length > 0 && entries.every(entry => hasArray(entry?.approval_requirements))
  const hasRequiredEvidence = entries.length > 0 && entries.every(entry => hasArray(entry?.required_evidence))
  const hasReviewDueAt = entries.length > 0 && entries.every(entry => hasText(entry?.review_due_at))
  const hasPolicySource = entries.length > 0 && entries.every(entry => hasText(entry?.policy_source))
  const hasCompletenessPct = entries.length > 0 && entries.every(entry => typeof entry?.completeness_pct === 'number')
  const hasMaxAutonomy = entries.length > 0 && entries.every(entry => hasText(entry?.max_autonomy))

  const criteria = [
    createCriterion('Registry file exists', !!registryPath, 1, 'Governance registry file not found', 'Create and maintain a governance registry file.'),
    createCriterion('Registry has at least 5 entries', entries.length >= 5, 0.5, 'Governance registry has fewer than 5 entries', 'Expand the governance registry to cover at least five activities.'),
    createCriterion('All entries define approval_requirements', hasApprovalRequirements, 0.5, 'Some governance entries are missing approval_requirements', 'Add approval_requirements to every governance registry entry.'),
    createCriterion('All entries define required_evidence', hasRequiredEvidence, 0.5, 'Some governance entries are missing required_evidence', 'Add required_evidence to every governance registry entry.'),
    createCriterion('summary-grid.json exists', existsSync(summaryGridPath), 0.5, 'docs/governance/summary-grid.json not found', 'Generate docs/governance/summary-grid.json from the registry.'),
    createCriterion('All entries schedule review_due_at', hasReviewDueAt, 0.5, 'Some governance entries are missing review_due_at', 'Schedule review_due_at for every governance registry entry.'),
    createCriterion('All entries reference policy_source', hasPolicySource, 0.5, 'Some governance entries are missing policy_source references', 'Add policy_source references to every governance registry entry.'),
    createCriterion('No entries are overdue', entries.length > 0 && overdueEntries.length === 0, 0.5, 'One or more governance entries are overdue for review', 'Review and refresh overdue governance entries.'),
    createCriterion('All entries track completeness_pct', hasCompletenessPct, 0.5, 'Some governance entries are missing completeness_pct', 'Track completeness_pct on every governance registry entry.'),
    createCriterion('All entries set max_autonomy', hasMaxAutonomy, 0.5, 'Some governance entries are missing max_autonomy', 'Set max_autonomy explicitly on every governance registry entry.'),
  ]

  const evidence = []
  if (registryPath) evidence.push(relativePath(root, registryPath))
  if (registryError) evidence.push(`Failed to parse ${relativePath(root, registryPath)}: ${registryError.message}`)
  if (entries.length > 0) evidence.push(`${entries.length} registry entries`)
  if (existsSync(summaryGridPath)) evidence.push('docs/governance/summary-grid.json')
  if (entries.length > 0 && overdueEntries.length === 0) evidence.push('0 overdue registry entries')
  if (overdueEntries.length > 0) evidence.push(`${overdueEntries.length} overdue registry entries`)

  return buildDimension(meta, criteria, evidence)
}

function scoreAgentCoverage(root) {
  const meta = DIMENSIONS_META.find(d => d.id === 'agent-coverage')
  const agentsDir = join(root, 'framework', 'agents')
  const agentFiles = listFiles(agentsDir, name => ['.yaml', '.yml'].includes(extname(name).toLowerCase()))
  const agentDocsDir = join(root, '.github', 'agents')
  const agentPromptFiles = listFiles(agentDocsDir, name => extname(name).toLowerCase() === '.md')
  const parsedAgents = agentFiles
    .map(filePath => {
      const { data } = safeReadYaml(filePath)
      return data ? { ...data, fileName: basename(filePath, extname(filePath)) } : null
    })
    .filter(Boolean)

  const coveredSteps = new Set(parsedAgents.flatMap(agent => asArray(agent.process_steps).filter(step => AIS_STEPS.includes(step))))
  const allProhibited = parsedAgents.length === agentFiles.length && parsedAgents.length > 0 && parsedAgents.every(agent => hasArray(agent.prohibited_actions))
  const allGovernanceEntries = parsedAgents.length === agentFiles.length && parsedAgents.length > 0 && parsedAgents.every(agent => hasArray(agent.governance_entries))
  const allSourcePaths = parsedAgents.length === agentFiles.length && parsedAgents.length > 0 && parsedAgents.every(agent => hasText(agent.source_prompt) && hasText(agent.agent_file))

  const criteria = [
    createCriterion('At least 1 agent is defined', agentFiles.length >= 1, 0.5, 'No agent YAML files found under framework/agents', 'Define at least one governed agent in framework/agents.'),
    createCriterion('At least 5 agents are defined', agentFiles.length >= 5, 0.5, 'Fewer than 5 agents are defined', 'Add governed agents until at least five are defined.'),
    createCriterion('At least 10 agents are defined', agentFiles.length >= 10, 0.5, 'Fewer than 10 agents are defined', 'Expand the agent catalog to at least ten agents.'),
    createCriterion('Agents cover at least 4 lifecycle steps', coveredSteps.size >= 4, 0.5, 'Agents cover fewer than 4 AIS lifecycle steps', 'Add process_steps coverage for at least four AIS lifecycle steps.'),
    createCriterion('Agents cover at least 7 lifecycle steps', coveredSteps.size >= 7, 0.5, 'Agents cover fewer than 7 AIS lifecycle steps', 'Extend agents to cover at least seven AIS lifecycle steps.'),
    createCriterion('Agents cover all 9 lifecycle steps', coveredSteps.size === AIS_STEPS.length, 0.5, 'Not all 9 AIS lifecycle steps are covered by agents', 'Add or update agents so all nine AIS lifecycle steps are covered.'),
    createCriterion('All agents define prohibited_actions', allProhibited, 0.5, 'Some agents are missing prohibited_actions', 'Add prohibited_actions to every agent definition.'),
    createCriterion('All agents define governance_entries', allGovernanceEntries, 0.5, 'Some agents are missing governance_entries', 'Add governance_entries to every agent definition.'),
    createCriterion('.github/agents has at least 3 markdown prompt files', agentPromptFiles.length >= 3, 0.5, '.github/agents has fewer than 3 markdown agent prompt files', 'Add markdown agent prompt files under .github/agents.'),
    createCriterion('All agents define source_prompt and agent_file', allSourcePaths, 0.5, 'Some agents are missing source_prompt or agent_file', 'Add source_prompt and agent_file paths to every agent definition.'),
  ]

  const evidence = []
  if (agentFiles.length > 0) evidence.push(`${agentFiles.length} agent YAML files under framework/agents`)
  if (coveredSteps.size > 0) evidence.push(`${coveredSteps.size}/9 AIS lifecycle steps covered`)
  if (agentPromptFiles.length > 0) evidence.push(`${agentPromptFiles.length} markdown prompt files under .github/agents`)

  return buildDimension(meta, criteria, evidence)
}

function scoreSkillCoverage(root) {
  const meta = DIMENSIONS_META.find(d => d.id === 'skill-coverage')
  const skillsDir = join(root, 'framework', 'skills')
  const skillFiles = listFiles(skillsDir, name => ['.yaml', '.yml'].includes(extname(name).toLowerCase()))
  const parsedSkills = skillFiles
    .map(filePath => {
      const { data } = safeReadYaml(filePath)
      return data ? { ...data, fileName: basename(filePath, extname(filePath)) } : null
    })
    .filter(Boolean)

  const allInputs = parsedSkills.length === skillFiles.length && parsedSkills.length > 0 && parsedSkills.every(skill => hasArray(skill.inputs))
  const allOutputs = parsedSkills.length === skillFiles.length && parsedSkills.length > 0 && parsedSkills.every(skill => hasArray(skill.outputs))
  const allExamples = parsedSkills.length === skillFiles.length && parsedSkills.length > 0 && parsedSkills.every(skill => hasText(skill.example_usage))
  const allVersions = parsedSkills.length === skillFiles.length && parsedSkills.length > 0 && parsedSkills.every(skill => hasText(skill.version))
  const allDescriptions = parsedSkills.length === skillFiles.length && parsedSkills.length > 0 && parsedSkills.every(skill => hasText(skill.description))
  const allToolRestrictions = parsedSkills.length === skillFiles.length && parsedSkills.length > 0 && parsedSkills.every(skill => hasArray(skill.allowed_tools) || hasArray(skill.prohibited) || hasText(skill.prohibited))
  const distinctActivities = inferSkillActivities(parsedSkills)

  const criteria = [
    createCriterion('At least 1 skill is defined', skillFiles.length >= 1, 0.5, 'No skill YAML files found under framework/skills', 'Define at least one reusable skill in framework/skills.'),
    createCriterion('At least 5 skills are defined', skillFiles.length >= 5, 0.5, 'Fewer than 5 skills are defined', 'Add skills until at least five are defined.'),
    createCriterion('At least 8 skills are defined', skillFiles.length >= 8, 0.5, 'Fewer than 8 skills are defined', 'Expand the skill catalog to at least eight skills.'),
    createCriterion('All skills define inputs', allInputs, 0.5, 'Some skills are missing inputs', 'Add inputs to every skill definition.'),
    createCriterion('All skills define outputs', allOutputs, 0.5, 'Some skills are missing outputs', 'Add outputs to every skill definition.'),
    createCriterion('All skills define example_usage', allExamples, 0.5, 'Some skills are missing example_usage', 'Add example_usage to every skill definition.'),
    createCriterion('All skills define version', allVersions, 0.5, 'Some skills are missing version', 'Add a version field to every skill definition.'),
    createCriterion('All skills define description', allDescriptions, 0.5, 'Some skills are missing description', 'Add a description field to every skill definition.'),
    createCriterion('Skills cover at least 4 inferred SDLC activities', distinctActivities.size >= 4, 0.5, 'Skills cover fewer than 4 inferred SDLC activities', 'Add skills that cover additional SDLC activities.'),
    createCriterion('All skills define tool restrictions', allToolRestrictions, 0.5, 'Some skills are missing allowed_tools or prohibited tool restrictions', 'Define allowed_tools or prohibited tool restrictions for every skill.'),
  ]

  const evidence = []
  if (skillFiles.length > 0) evidence.push(`${skillFiles.length} skill YAML files under framework/skills`)
  if (distinctActivities.size > 0) evidence.push(`${distinctActivities.size} inferred SDLC activity groups covered by skills`)

  return buildDimension(meta, criteria, evidence)
}

function scoreContextConfiguration(root) {
  const meta = DIMENSIONS_META.find(d => d.id === 'context-configuration')
  const configPath = join(root, 'config', 'aispec.config.yaml')
  const agentsMdPath = join(root, 'AGENTS.md')
  const githubAgentsDir = join(root, '.github', 'agents')
  const promptsDir = join(root, '.specify', 'prompts')
  const prompts = listFiles(promptsDir, name => extname(name).toLowerCase() === '.md')
  const templatesDir = join(root, 'framework', 'templates')
  const schemasDir = join(root, 'framework', 'schemas')
  const schemaFiles = listFiles(schemasDir, name => extname(name).toLowerCase() === '.json')
  const specifyDir = join(root, '.specify')
  const governanceTemplatePath = join(root, 'framework', 'templates', 'governance-registry.yaml')

  const criteria = [
    createCriterion('config/aispec.config.yaml exists', existsSync(configPath), 1, 'config/aispec.config.yaml not found', 'Create config/aispec.config.yaml for scoped framework configuration.'),
    createCriterion('AGENTS.md exists', existsSync(agentsMdPath), 0.5, 'AGENTS.md not found', 'Add AGENTS.md to document agent context and operating constraints.'),
    createCriterion('.github/agents directory exists', existsSync(githubAgentsDir), 0.5, '.github/agents directory not found', 'Create .github/agents with agent prompt files.'),
    createCriterion('.specify/prompts has at least 3 markdown prompts', prompts.length >= 3, 0.5, '.specify/prompts has fewer than 3 markdown prompt files', 'Add at least three prompt files under .specify/prompts.'),
    createCriterion('framework/templates directory exists', existsSync(templatesDir), 0.5, 'framework/templates directory not found', 'Add framework/templates with reusable framework templates.'),
    createCriterion('framework/schemas has at least 3 JSON schema files', schemaFiles.length >= 3, 0.5, 'framework/schemas has fewer than 3 JSON schema files', 'Add at least three JSON schema files under framework/schemas.'),
    createCriterion('.specify/prompts has at least 10 prompt files', prompts.length >= 10, 0.5, '.specify/prompts has fewer than 10 prompt files', 'Expand .specify/prompts to at least ten prompt files.'),
    createCriterion('framework/templates/governance-registry.yaml exists', existsSync(governanceTemplatePath), 0.5, 'framework/templates/governance-registry.yaml not found', 'Add the governance registry template under framework/templates.'),
  ]

  const evidence = []
  if (existsSync(specifyDir)) evidence.push('.specify/')
  if (existsSync(githubAgentsDir)) evidence.push('.github/agents/')
  if (prompts.length > 0) evidence.push(`${prompts.length} markdown prompt files under .specify/prompts`)
  if (schemaFiles.length > 0) evidence.push(`${schemaFiles.length} schema files under framework/schemas`)
  if (existsSync(templatesDir)) evidence.push('framework/templates/')

  return buildDimension(meta, criteria, evidence)
}

function scoreQualityVerification(root) {
  const meta = DIMENSIONS_META.find(d => d.id === 'quality-verification')
  const testsDir = join(root, 'tests')
  const testFiles = listFilesRecursive(testsDir, name => name.endsWith('.test.js'))
  const schemasDir = join(root, 'framework', 'schemas')
  const schemaFiles = listFiles(schemasDir, name => name.endsWith('.schema.json'))
  const testWorkflowPath = join(root, '.github', 'workflows', 'test.yml')
  const validateWorkflowPath = join(root, '.github', 'workflows', 'validate-schemas.yml')
  const fixturesDir = join(root, 'tests', 'fixtures')
  const { data: packageJson } = safeReadJson(join(root, 'package.json'))
  const pretestScript = packageJson?.scripts?.pretest ?? ''
  const hasSchemaPretest = hasText(pretestScript) && /validate-schemas/.test(pretestScript)

  const criteria = [
    createCriterion('At least 1 test file exists', testFiles.length >= 1, 0.5, 'No test files were found', 'Add at least one automated test file.'),
    createCriterion('At least 5 test files exist', testFiles.length >= 5, 0.5, 'Fewer than 5 test files were found', 'Grow automated test coverage to at least five test files.'),
    createCriterion('At least 8 test files exist', testFiles.length >= 8, 0.5, 'Fewer than 8 test files were found', 'Expand the automated test suite to at least eight files.'),
    createCriterion('.github/workflows/test.yml exists', existsSync(testWorkflowPath), 0.5, '.github/workflows/test.yml not found', 'Add a GitHub Actions test workflow.'),
    createCriterion('.github/workflows/validate-schemas.yml exists', existsSync(validateWorkflowPath), 0.5, '.github/workflows/validate-schemas.yml not found', 'Add a schema validation workflow.'),
    createCriterion('At least 3 schema files exist', schemaFiles.length >= 3, 0.5, 'Fewer than 3 schema files were found', 'Add at least three JSON schema files.'),
    createCriterion('At least 6 schema files exist', schemaFiles.length >= 6, 0.5, 'Fewer than 6 schema files were found', 'Expand schema coverage to at least six files.'),
    createCriterion('tests/fixtures directory exists', existsSync(fixturesDir), 0.5, 'tests/fixtures directory not found', 'Add tests/fixtures for repeatable validation inputs.'),
    createCriterion('package.json pretest runs schema validation', hasSchemaPretest, 0.5, 'package.json pretest does not run schema validation', 'Update package.json pretest to run validate-schemas.'),
    createCriterion('At least 10 test files exist', testFiles.length >= 10, 0.5, 'Fewer than 10 test files were found', 'Expand the automated test suite to at least ten files.'),
  ]

  const evidence = []
  if (testFiles.length > 0) evidence.push(`${testFiles.length} test files under tests/`)
  if (schemaFiles.length > 0) evidence.push(`${schemaFiles.length} schema files under framework/schemas`)
  if (existsSync(testWorkflowPath)) evidence.push('.github/workflows/test.yml')
  if (existsSync(validateWorkflowPath)) evidence.push('.github/workflows/validate-schemas.yml')
  if (hasSchemaPretest) evidence.push('package.json pretest runs validate-schemas')

  return buildDimension(meta, criteria, evidence)
}

function scoreDeliveryAutomation(root) {
  const meta = DIMENSIONS_META.find(d => d.id === 'delivery-automation')
  const workflowsDir = join(root, '.github', 'workflows')
  const workflowFiles = listFiles(workflowsDir, name => extname(name).toLowerCase() === '.yml')
  const workflowNames = workflowFiles.map(filePath => basename(filePath).toLowerCase())

  const hasCiWorkflow = workflowNames.includes('ci.yml') || workflowNames.includes('test.yml')
  const hasDeployWorkflow = workflowNames.some(name => /deploy|pages/.test(name))
  const hasSchemaWorkflow = workflowNames.includes('validate-schemas.yml')
  const hasMetricsWorkflow = workflowNames.some(name => /collect-metrics/.test(name))
  const hasReleaseWorkflow = workflowNames.includes('release.yml')
  const hasAgenticScan = workflowNames.some(name => /^aef-scan/.test(name) || name.endsWith('.lock.yml'))

  const criteria = [
    createCriterion('At least 1 workflow file exists', workflowFiles.length >= 1, 0.5, 'No workflow files were found under .github/workflows', 'Add at least one CI/CD workflow under .github/workflows.'),
    createCriterion('At least 3 workflow files exist', workflowFiles.length >= 3, 0.5, 'Fewer than 3 workflow files were found', 'Add more CI/CD workflows until at least three exist.'),
    createCriterion('At least 5 workflow files exist', workflowFiles.length >= 5, 0.5, 'Fewer than 5 workflow files were found', 'Expand CI/CD automation to at least five workflows.'),
    createCriterion('CI workflow exists', hasCiWorkflow, 0.5, 'No CI workflow (ci.yml or test.yml) was found', 'Add a CI workflow such as ci.yml or test.yml.'),
    createCriterion('Deploy workflow exists', hasDeployWorkflow, 0.5, 'No deploy workflow was found', 'Add a deployment workflow such as deploy-pages.yml.'),
    createCriterion('Schema validation workflow exists', hasSchemaWorkflow, 0.5, 'No schema validation workflow was found', 'Add validate-schemas.yml to CI.'),
    createCriterion('Metrics collection workflow exists', hasMetricsWorkflow, 0.5, 'No metrics collection workflow was found', 'Add a collect-metrics workflow to automate report generation.'),
    createCriterion('Release automation workflow exists', hasReleaseWorkflow, 0.5, 'No release automation workflow was found', 'Add release.yml for release automation.'),
    createCriterion('Agentic scan workflow exists', hasAgenticScan, 0.5, 'No agentic scan workflow was found', 'Add an aef-scan workflow or lock workflow.'),
    createCriterion('At least 8 workflow files exist', workflowFiles.length >= 8, 0.5, 'Fewer than 8 workflow files were found', 'Expand delivery automation to at least eight workflows.'),
  ]

  const evidence = []
  if (workflowFiles.length > 0) evidence.push(`${workflowFiles.length} workflow files under .github/workflows`)
  if (hasCiWorkflow) evidence.push('CI workflow present')
  if (hasDeployWorkflow) evidence.push('Deploy workflow present')
  if (hasMetricsWorkflow) evidence.push('Metrics collection workflow present')
  if (hasAgenticScan) evidence.push('Agentic scan workflow present')

  return buildDimension(meta, criteria, evidence)
}

function scoreDocumentationEnablement(root) {
  const meta = DIMENSIONS_META.find(d => d.id === 'documentation-enablement')
  const readmePath = join(root, 'README.md')
  const contributingPath = join(root, 'CONTRIBUTING.md')
  const docsDir = join(root, 'docs')
  const docsSubdirs = existsSync(docsDir)
    ? readdirSync(docsDir, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name)
    : []
  const playbooksDir = join(root, 'docs', 'playbooks')
  const playbookFiles = listFilesRecursive(playbooksDir, name => extname(name).toLowerCase() === '.md')
  const featuresDir = join(root, 'docs', 'features')
  const featureFiles = listFiles(featuresDir, name => extname(name).toLowerCase() === '.md')
  const brownfieldPromptFiles = listFiles(join(root, '.specify', 'prompts'), name => /^brownfield\..+\.md$/i.test(name))

  const criteria = [
    createCriterion('README.md exists', existsSync(readmePath), 0.5, 'README.md not found', 'Add a top-level README.md.'),
    createCriterion('CONTRIBUTING.md exists', existsSync(contributingPath), 0.5, 'CONTRIBUTING.md not found', 'Add CONTRIBUTING.md to document contribution flow.'),
    createCriterion('docs/getting-started exists', existsSync(join(root, 'docs', 'getting-started')), 0.5, 'docs/getting-started directory not found', 'Add docs/getting-started for onboarding guidance.'),
    createCriterion('docs/playbooks exists with at least 1 file', playbookFiles.length >= 1, 0.5, 'docs/playbooks has no markdown files', 'Add at least one playbook under docs/playbooks.'),
    createCriterion('docs/sdlc exists', existsSync(join(root, 'docs', 'sdlc')), 0.5, 'docs/sdlc directory not found', 'Add docs/sdlc to explain lifecycle alignment.'),
    createCriterion('docs/extending exists', existsSync(join(root, 'docs', 'extending')), 0.5, 'docs/extending directory not found', 'Add docs/extending for framework extension guidance.'),
    createCriterion('docs/features has at least 2 markdown files', featureFiles.length >= 2, 0.5, 'docs/features has fewer than 2 markdown files', 'Add more feature documentation under docs/features.'),
    createCriterion('.specify/prompts has brownfield prompt files', brownfieldPromptFiles.length >= 1, 0.5, 'No brownfield prompt files were found under .specify/prompts', 'Add brownfield prompt files under .specify/prompts.'),
    createCriterion('docs/assessment exists', existsSync(join(root, 'docs', 'assessment')), 0.5, 'docs/assessment directory not found', 'Add docs/assessment for readiness outputs.'),
    createCriterion('docs has at least 5 subdirectories', docsSubdirs.length >= 5, 0.5, 'docs has fewer than 5 subdirectories', 'Expand docs to cover at least five topic areas.'),
  ]

  const evidence = []
  if (existsSync(readmePath)) evidence.push('README.md')
  if (existsSync(contributingPath)) evidence.push('CONTRIBUTING.md')
  if (docsSubdirs.length > 0) evidence.push(`${docsSubdirs.length} docs subdirectories`)
  if (playbookFiles.length > 0) evidence.push(`${playbookFiles.length} playbook markdown files`)
  if (brownfieldPromptFiles.length > 0) evidence.push(`${brownfieldPromptFiles.length} brownfield prompt files`)

  return buildDimension(meta, criteria, evidence)
}

export async function scoreMaturity(repoPath) {
  const root = resolve(repoPath)
  const dimensions = [
    scoreGovernance(root),
    scoreAgentCoverage(root),
    scoreSkillCoverage(root),
    scoreContextConfiguration(root),
    scoreQualityVerification(root),
    scoreDeliveryAutomation(root),
    scoreDocumentationEnablement(root),
  ]
  const overallScore = round1(dimensions.reduce((sum, dimension) => sum + dimension.score, 0) / dimensions.length)

  return {
    generated_at: new Date().toISOString(),
    overall_score: overallScore,
    overall_label: maturityLabel(overallScore),
    dimensions,
  }
}

async function runCli() {
  const report = await scoreMaturity(frameworkRoot)
  const date = new Date().toISOString().slice(0, 10)
  const outputDir = join(frameworkRoot, 'metrics')
  const outputPath = join(outputDir, `maturity-${date}.json`)

  mkdirSync(outputDir, { recursive: true })
  writeFileSync(outputPath, JSON.stringify(report, null, 2) + '\n', 'utf8')

  console.log('\n══════════════════════════════════════════════════════════')
  console.log('  Framework Maturity Profile')
  console.log('══════════════════════════════════════════════════════════')
  console.log(`  Overall:  ${report.overall_score.toFixed(1)} / 5  (${report.overall_label})`)
  for (const dimension of report.dimensions) {
    console.log(`  ${dimension.id.padEnd(28)} ${dimension.score.toFixed(1)} / 5`)
  }
  console.log('──────────────────────────────────────────────────────────')
  console.log(`  Written: ${outputPath}`)
  console.log('══════════════════════════════════════════════════════════\n')
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await runCli()
}

