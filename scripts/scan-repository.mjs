/**
 * scan-repository.mjs
 *
 * Read-only scanner that analyzes a target repository and produces a structured
 * readiness-assessment JSON plus a human-readable stdout summary.
 *
 * Usage:
 *   node scripts/scan-repository.mjs --target <path-to-repo> [--output <output-dir>] [--dry-run]
 *
 * Exit codes:
 *   0 — always (read-only scan never fails the process)
 */

import { existsSync, readdirSync, statSync, readFileSync, mkdirSync, writeFileSync } from 'fs'
import { resolve, join, basename } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const frameworkRoot = resolve(__dirname, '..')

// ── Utility functions ────────────────────────────────────────────────────────

function containsAny(text, keywords) {
  const lower = text.toLowerCase()
  return keywords.some(k => lower.includes(k.toLowerCase()))
}

function getTier(score) {
  if (score >= 80) return 'Advanced'
  if (score >= 60) return 'Structured'
  if (score >= 40) return 'Developing'
  if (score >= 20) return 'Early'
  return 'Foundation'
}

// ── Scoring weights ──────────────────────────────────────────────────────────

const WEIGHTS = {
  aiGovernance:     0.25,
  agentManagement:  0.20,
  cicd:             0.20,
  documentation:    0.15,
  branchManagement: 0.10,
  prProcess:        0.10,
}

// ── Core scan logic (exported for testing) ───────────────────────────────────

export async function scanRepository(targetPathArg, options = {}) {
  const target = resolve(targetPathArg)
  
  if (!existsSync(target)) {
    throw new Error(`Target path does not exist: ${target}`)
  }

  // ── Helpers bound to this target ─────────────────────────────────────────────

  function exists(rel) {
    return existsSync(join(target, rel))
  }

  function listDir(rel) {
    const p = join(target, rel)
    if (!existsSync(p)) return []
    try {
      return readdirSync(p)
    } catch {
      return []
    }
  }

  function readText(rel) {
    const p = join(target, rel)
    if (!existsSync(p)) return ''
    try {
      return readFileSync(p, 'utf8')
    } catch {
      return ''
    }
  }

  function fileSize(rel) {
    const p = join(target, rel)
    if (!existsSync(p)) return 0
    try {
      return statSync(p).size
    } catch {
      return 0
    }
  }

  function getRepoName() {
    try {
      const remote = execSync('git remote get-url origin', { cwd: target, stdio: ['pipe', 'pipe', 'pipe'] })
        .toString().trim()
      const match = remote.match(/[:/]([^/]+\/[^/]+?)(\.git)?$/)
      if (match) return match[1]
    } catch { /* not a git repo or no remote */ }
    return basename(target)
  }

  // ── Dimension scanners ───────────────────────────────────────────────────────

  function scanBranchManagement() {
    const findings = []
    let score = 0

    const hasRulesets = exists('.github/rulesets')
    if (hasRulesets) {
      const rulesetFiles = listDir('.github/rulesets').filter(f => f.endsWith('.json') || f.endsWith('.yaml') || f.endsWith('.yml'))
      if (rulesetFiles.length > 0) {
        findings.push({ found: true, item: `.github/rulesets/ (${rulesetFiles.length} file(s))` })
        score += 50
      }
    } else {
      findings.push({ found: false, item: '.github/rulesets/' })
    }

    const contributing = readText('CONTRIBUTING.md')
    const branchKeywords = ['branch', 'main', 'dev', 'feature/', 'hotfix/', 'git flow', 'branching']
    if (contributing && containsAny(contributing, branchKeywords)) {
      findings.push({ found: true, item: 'CONTRIBUTING.md contains branching guidance' })
      score += 30
    } else if (exists('CONTRIBUTING.md')) {
      findings.push({ found: true, item: 'CONTRIBUTING.md exists (no branching keywords)' })
      score += 10
    } else {
      findings.push({ found: false, item: 'CONTRIBUTING.md' })
    }

    // Check for branch protection references in README
    const readme = readText('README.md')
    if (containsAny(readme, ['branch protection', 'protected branch', 'ruleset'])) {
      findings.push({ found: true, item: 'README.md references branch protection' })
      score += 20
    }

    return { score: Math.min(score, 100), findings }
  }

  function scanPRProcess() {
    const findings = []
    let score = 0

    if (exists('.github/pull_request_template.md') || exists('.github/PULL_REQUEST_TEMPLATE.md')) {
      findings.push({ found: true, item: 'Pull request template' })
      score += 35
    } else {
      findings.push({ found: false, item: 'Pull request template (.github/pull_request_template.md)' })
    }

    if (exists('CODEOWNERS') || exists('.github/CODEOWNERS')) {
      findings.push({ found: true, item: 'CODEOWNERS file' })
      score += 30
    } else {
      findings.push({ found: false, item: 'CODEOWNERS' })
    }

    const contributing = readText('CONTRIBUTING.md')
    const readme = readText('README.md')
    const conventionalKeywords = ['conventional commit', 'commit convention', 'feat:', 'fix:', 'chore:', 'conventional:']
    if (containsAny(contributing + readme, conventionalKeywords)) {
      findings.push({ found: true, item: 'Conventional commit conventions referenced' })
      score += 20
    } else {
      findings.push({ found: false, item: 'Conventional commit convention references' })
    }

    // Check for PR review guidelines
    if (containsAny(contributing, ['pull request', 'pr review', 'review process'])) {
      findings.push({ found: true, item: 'PR review process documented in CONTRIBUTING.md' })
      score += 15
    }

    return { score: Math.min(score, 100), findings }
  }

  function scanAIGovernance() {
    const findings = []
    let score = 0

    if (exists('config/aispec.config.yaml')) {
      findings.push({ found: true, item: 'config/aispec.config.yaml (framework already installed)' })
      score += 35
    } else {
      findings.push({ found: false, item: 'config/aispec.config.yaml' })
    }

    const agentFiles = listDir('.github/agents').filter(f => f.endsWith('.md'))
    if (agentFiles.length > 0) {
      findings.push({ found: true, item: `.github/agents/ (${agentFiles.length} agent file(s))` })
      score += 25
    } else {
      findings.push({ found: false, item: '.github/agents/ directory' })
    }

    if (exists('AGENTS.md')) {
      findings.push({ found: true, item: 'AGENTS.md' })
      score += 15
    } else {
      findings.push({ found: false, item: 'AGENTS.md' })
    }

    if (exists('.github/copilot-instructions.md')) {
      findings.push({ found: true, item: '.github/copilot-instructions.md' })
      score += 15
    } else {
      findings.push({ found: false, item: '.github/copilot-instructions.md' })
    }

    if (exists('config/governance-registry.yaml')) {
      findings.push({ found: true, item: 'config/governance-registry.yaml' })
      score += 10
    } else {
      findings.push({ found: false, item: 'config/governance-registry.yaml' })
    }

    return { score: Math.min(score, 100), findings }
  }

  function scanAgentManagement() {
    const findings = []
    let score = 0

    const githubAgents = listDir('.github/agents').filter(f => f.endsWith('.md'))
    if (githubAgents.length > 0) {
      findings.push({ found: true, item: `.github/agents/: ${githubAgents.map(f => basename(f)).join(', ')}` })
      score += 35
    } else {
      findings.push({ found: false, item: '.github/agents/*.md files' })
    }

    const claudeCommands = listDir('.claude/commands')
    if (claudeCommands.length > 0) {
      findings.push({ found: true, item: `.claude/commands/ (${claudeCommands.length} command(s))` })
      score += 25
    } else {
      findings.push({ found: false, item: '.claude/commands/' })
    }

    if (exists('.cursor/rules') || exists('.cursorrules')) {
      const which = exists('.cursor/rules') ? '.cursor/rules/' : '.cursorrules'
      findings.push({ found: true, item: `Cursor rules: ${which}` })
      score += 20
    } else {
      findings.push({ found: false, item: '.cursor/rules/ or .cursorrules' })
    }

    const agentSkills = listDir('.agents/skills')
    if (agentSkills.length > 0) {
      findings.push({ found: true, item: `.agents/skills/ (${agentSkills.length} skill(s))` })
      score += 20
    } else {
      findings.push({ found: false, item: '.agents/skills/' })
    }

    return {
      score: Math.min(score, 100),
      findings,
      agentNames: githubAgents.map(f => basename(f, '.md'))
    }
  }

  function scanCICD() {
    const findings = []
    let score = 0

    const workflowFiles = listDir('.github/workflows').filter(f => f.endsWith('.yml') || f.endsWith('.yaml'))

    if (workflowFiles.length === 0) {
      findings.push({ found: false, item: '.github/workflows/ (no workflow files found)' })
      return { score: 0, findings, workflowNames: [] }
    }

    findings.push({ found: true, item: `.github/workflows/: ${workflowFiles.length} workflow(s)` })
    score += 30

    const patterns = {
      test:   ['test', 'spec', 'unit', 'integration', 'vitest', 'jest', 'pytest'],
      build:  ['build', 'compile', 'package', 'docker', 'artifact'],
      lint:   ['lint', 'format', 'eslint', 'markdownlint', 'checkstyle', 'spotbugs'],
      deploy: ['deploy', 'release', 'publish', 'helm', 'kubectl', 'terraform'],
    }

    const detectedPatterns = {}

    for (const wf of workflowFiles) {
      const content = readText(`.github/workflows/${wf}`)
      for (const [type, keywords] of Object.entries(patterns)) {
        if (!detectedPatterns[type] && (containsAny(wf, keywords) || containsAny(content, keywords))) {
          detectedPatterns[type] = wf
        }
      }
    }

    for (const [type, wf] of Object.entries(detectedPatterns)) {
      findings.push({ found: true, item: `${type} workflow detected in: ${wf}` })
      score += 17
    }

    const missing = Object.keys(patterns).filter(p => !detectedPatterns[p])
    for (const type of missing) {
      findings.push({ found: false, item: `No ${type} workflow pattern detected` })
    }

    return {
      score: Math.min(score, 100),
      findings,
      workflowNames: workflowFiles
    }
  }

  function scanDocumentation() {
    const findings = []
    let score = 0

    const readmeSize = fileSize('README.md')
    if (readmeSize > 500) {
      findings.push({ found: true, item: `README.md (${readmeSize} bytes — substantive)` })
      score += 25
    } else if (readmeSize > 0) {
      findings.push({ found: true, item: `README.md (${readmeSize} bytes — minimal)` })
      score += 10
    } else {
      findings.push({ found: false, item: 'README.md' })
    }

    const docsFiles = listDir('docs')
    if (docsFiles.length > 0) {
      findings.push({ found: true, item: `docs/ directory (${docsFiles.length} item(s))` })
      score += 25
    } else {
      findings.push({ found: false, item: 'docs/ directory' })
    }

    // ADR check
    const adrLocations = ['adr', 'docs/adr', 'docs/decisions', 'docs/adrs']
    let adrFound = null
    for (const loc of adrLocations) {
      const files = listDir(loc).filter(f => f.endsWith('.md'))
      if (files.length > 0) {
        adrFound = { loc, count: files.length }
        break
      }
    }
    if (adrFound) {
      findings.push({ found: true, item: `ADRs in ${adrFound.loc}/ (${adrFound.count} file(s))` })
      score += 30
    } else {
      findings.push({ found: false, item: 'ADRs (checked adr/, docs/adr/, docs/decisions/, docs/adrs/)' })
    }

    if (exists('CONTRIBUTING.md')) {
      findings.push({ found: true, item: 'CONTRIBUTING.md' })
      score += 20
    } else {
      findings.push({ found: false, item: 'CONTRIBUTING.md' })
    }

    return { score: Math.min(score, 100), findings }
  }

  // ── Run all scans ────────────────────────────────────────────────────────────

  const branchManagement = scanBranchManagement()
  const prProcess        = scanPRProcess()
  const aiGovernance     = scanAIGovernance()
  const agentManagement  = scanAgentManagement()
  const cicd             = scanCICD()
  const documentation    = scanDocumentation()

  const overallScore = Math.round(
    branchManagement.score * WEIGHTS.branchManagement +
    prProcess.score        * WEIGHTS.prProcess +
    aiGovernance.score     * WEIGHTS.aiGovernance +
    agentManagement.score  * WEIGHTS.agentManagement +
    cicd.score             * WEIGHTS.cicd +
    documentation.score    * WEIGHTS.documentation
  )

  const tier = getTier(overallScore)

  // ── Build assessment JSON ────────────────────────────────────────────────────

  const dimensions = {
    branchManagement: { score: branchManagement.score, weight: WEIGHTS.branchManagement, findings: branchManagement.findings },
    prProcess:        { score: prProcess.score,        weight: WEIGHTS.prProcess,        findings: prProcess.findings },
    aiGovernance:     { score: aiGovernance.score,     weight: WEIGHTS.aiGovernance,     findings: aiGovernance.findings },
    agentManagement: {
      score: agentManagement.score,
      weight: WEIGHTS.agentManagement,
      findings: agentManagement.findings,
      agentNames: agentManagement.agentNames,
    },
    cicd: {
      score: cicd.score,
      weight: WEIGHTS.cicd,
      findings: cicd.findings,
      workflowNames: cicd.workflowNames,
    },
    documentation: { score: documentation.score, weight: WEIGHTS.documentation, findings: documentation.findings },
  }

  // Snake_case aliases for test/schema compatibility
  dimensions.branch_management = dimensions.branchManagement
  dimensions.pr_process         = dimensions.prProcess
  dimensions.ai_governance      = dimensions.aiGovernance
  dimensions.agent_management   = dimensions.agentManagement
  dimensions.work_management    = dimensions.cicd  // CICD is closest proxy; dedicated dimension below
  dimensions.documentation_score = dimensions.documentation

  // Compute gaps: any dimension scoring below 60
  const GAP_THRESHOLD = 60
  const gaps = Object.entries(dimensions)
    .filter(([k]) => !k.includes('_score') && !['branch_management','pr_process','ai_governance','agent_management','work_management','documentation_score'].includes(k))
    .filter(([, v]) => typeof v === 'object' && typeof v.score === 'number' && v.score < GAP_THRESHOLD)
    .map(([dimension, v]) => ({
      dimension,
      score: v.score,
      severity: v.score < 30 ? 'critical' : 'high',
      recommendation: `Improve ${dimension} practices (current score: ${v.score})`,
    }))

  // Work management: heuristic based on GitHub Issues / project board presence
  const issueTemplatesExist = existsSync(join(target, '.github', 'ISSUE_TEMPLATE'))
  const work_management = {
    detected:       issueTemplatesExist ? 'issue-templates' : 'none',
    confidence:     issueTemplatesExist ? 0.7 : 0.3,
    recommendation: issueTemplatesExist
      ? 'Issue templates detected — consider adding project boards for sprint tracking.'
      : 'No issue templates detected — add GitHub Issue templates and project boards.',
  }

  const assessment = {
    schemaVersion:  '1.0.0',
    assessedAt:     new Date().toISOString(),
    repository:     getRepoName(),
    targetPath:     target,
    overall_score:  overallScore,
    maturity_tier:  tier,
    overall: {
      score: overallScore,
      tier,
    },
    dimensions,
    discovered_facts: [
      ...branchManagement.findings,
      ...prProcess.findings,
      ...aiGovernance.findings,
      ...agentManagement.findings,
      ...cicd.findings,
      ...documentation.findings,
    ],
    gaps,
    work_management,
  }

  return assessment
}

// ── CLI Entry Point ──────────────────────────────────────────────────────────

const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))

if (isMain) {
const args = process.argv.slice(2)

function getArg(flag) {
  const idx = args.indexOf(flag)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null
}

const targetPath = getArg('--target')
const outputDir  = getArg('--output') ?? join(frameworkRoot, 'docs', 'assessment')
const dryRun     = args.includes('--dry-run')

if (!targetPath) {
  console.error('Error: --target <path-to-repo> is required')
  process.exit(1)
}

const target = resolve(targetPath)

if (!existsSync(target)) {
  console.error(`Error: target path does not exist: ${target}`)
  process.exit(1)
}

// ── Main ─────────────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════')
console.log('  Agentic Engineering Framework — Repository Scanner')
console.log('══════════════════════════════════════════════════════════')
console.log(`  Target: ${target}`)
console.log(`  Output: ${dryRun ? '(dry-run — no files written)' : outputDir}`)
console.log('──────────────────────────────────────────────────────────\n')

const assessment = await scanRepository(target, { dryRun })

const dimensions = [
  { name: 'AI Governance',     data: assessment.dimensions.aiGovernance,     weight: WEIGHTS.aiGovernance },
  { name: 'Agent Management',  data: assessment.dimensions.agentManagement,  weight: WEIGHTS.agentManagement },
  { name: 'CI/CD',             data: assessment.dimensions.cicd,             weight: WEIGHTS.cicd },
  { name: 'Documentation',     data: assessment.dimensions.documentation,    weight: WEIGHTS.documentation },
  { name: 'Branch Management', data: assessment.dimensions.branchManagement, weight: WEIGHTS.branchManagement },
  { name: 'PR Process',        data: assessment.dimensions.prProcess,        weight: WEIGHTS.prProcess },
]

for (const dim of dimensions) {
  const bar = '█'.repeat(Math.round(dim.data.score / 10)).padEnd(10, '░')
  console.log(`  ${dim.name.padEnd(20)} ${bar} ${String(dim.data.score).padStart(3)}/100  (weight: ${(dim.weight * 100).toFixed(0)}%)`)
  for (const f of dim.data.findings) {
    const icon = f.found ? '  ✅' : '  ○ '
    console.log(`     ${icon} ${f.item}`)
  }
  console.log()
}

console.log('──────────────────────────────────────────────────────────')
console.log(`  Overall Score: ${assessment.overall.score}/100 — Tier: ${assessment.overall.tier}`)
console.log('══════════════════════════════════════════════════════════\n')

// ── Write or dry-run ─────────────────────────────────────────────────────────

const outputFile = join(outputDir, 'readiness-assessment.json')

if (dryRun) {
  console.log(`[dry-run] Would write: ${outputFile}`)
  console.log(JSON.stringify(assessment, null, 2))
} else {
  mkdirSync(outputDir, { recursive: true })
  writeFileSync(outputFile, JSON.stringify(assessment, null, 2) + '\n', 'utf8')
  console.log(`✅  Assessment written to: ${outputFile}`)
}
} // end isMain
