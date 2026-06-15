/**
 * initialize.mjs
 *
 * Interactive CLI that walks a user through the configuration questionnaire and
 * writes config/aispec.config.yaml (and initialization-state.json) to a TARGET
 * repository.
 *
 * Usage:
 *   node scripts/initialize.mjs --target <path-to-repo> [--assessment <path-to-assessment.json>] [--dry-run]
 *
 * Exit codes:
 *   0 — completed (including user-initiated exit)
 *   1 — fatal error (target path does not exist, etc.)
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import { fileURLToPath } from 'url'
import { createInterface } from 'readline'

const __dirname  = fileURLToPath(new URL('.', import.meta.url))
const pkgPath    = resolve(__dirname, '..', 'package.json')
const pkg        = JSON.parse(readFileSync(pkgPath, 'utf8'))

// ── Argument parsing ─────────────────────────────────────────────────────────

const args = process.argv.slice(2)

function getArg(flag) {
  const idx = args.indexOf(flag)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null
}

const targetArg     = getArg('--target')
const assessmentArg = getArg('--assessment')
const dryRun        = args.includes('--dry-run')

if (!targetArg) {
  console.error('Error: --target <path-to-repo> is required')
  process.exit(1)
}

const target = resolve(targetArg)

if (!existsSync(target)) {
  console.error(`Error: target path does not exist: ${target}`)
  process.exit(1)
}

// ── Lazy-load js-yaml ────────────────────────────────────────────────────────

const yaml = (await import('js-yaml')).default

// ── Readline helper ──────────────────────────────────────────────────────────

const rl = createInterface({ input: process.stdin, output: process.stdout })

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve))
}

function askWithDefault(question, defaultVal) {
  return new Promise(resolve => {
    rl.question(`${question} [${defaultVal}]: `, answer => {
      resolve(answer.trim() || defaultVal)
    })
  })
}

async function askEnum(question, options) {
  const optList = options.map((o, i) => `  ${i + 1}. ${o.label ?? o.value}  ${o.hint ? `— ${o.hint}` : ''}`).join('\n')
  while (true) {
    console.log(`\n${question}`)
    console.log(optList)
    const answer = await ask('Choice (number or value): ')
    const idx = parseInt(answer, 10)
    if (!isNaN(idx) && idx >= 1 && idx <= options.length) return options[idx - 1].value
    const match = options.find(o => o.value.toLowerCase() === answer.toLowerCase())
    if (match) return match.value
    console.log('  ⚠  Please enter a number from the list.')
  }
}

async function askMultiSelect(question, options) {
  console.log(`\n${question}`)
  options.forEach((o, i) => console.log(`  ${i + 1}. ${o.label ?? o.value}`))
  const raw = await ask('Enter comma-separated numbers (or "all"): ')
  if (raw.trim().toLowerCase() === 'all') return options.map(o => o.value)
  return raw.split(',')
    .map(s => s.trim())
    .map(s => {
      const n = parseInt(s, 10)
      if (!isNaN(n) && n >= 1 && n <= options.length) return options[n - 1].value
      const m = options.find(o => o.value.toLowerCase() === s.toLowerCase())
      return m ? m.value : null
    })
    .filter(Boolean)
}

// ── Write-guard ──────────────────────────────────────────────────────────────

function guardedWrite(filePath, content, label) {
  if (dryRun) {
    console.log(`\n[dry-run] Would write: ${filePath}`)
    console.log('────── content preview ──────')
    console.log(typeof content === 'string' ? content.slice(0, 400) : JSON.stringify(content, null, 2).slice(0, 400))
    console.log('─────────────────────────────')
    return
  }
  mkdirSync(resolve(filePath, '..'), { recursive: true })
  const text = typeof content === 'string' ? content : JSON.stringify(content, null, 2) + '\n'
  writeFileSync(filePath, text, 'utf8')
  console.log(`  ✅  Written: ${filePath}  (${label})`)
}

// ── Banner ───────────────────────────────────────────────────────────────────

console.log('\n╔══════════════════════════════════════════════════════════╗')
console.log(`║  ${pkg.name}  v${pkg.version}`)
console.log('║  Brownfield Initializer')
console.log('╚══════════════════════════════════════════════════════════╝')
console.log(`\n  Target repository: ${target}`)
if (dryRun) console.log('  ⚠  DRY-RUN mode — no files will be written\n')

// ── Load assessment (optional) ───────────────────────────────────────────────

let assessment = null
const autoAssessmentPath = join(target, 'docs', 'assessment', 'readiness-assessment.json')
const assessmentPath = assessmentArg
  ? resolve(assessmentArg)
  : (existsSync(autoAssessmentPath) ? autoAssessmentPath : null)

if (assessmentPath && existsSync(assessmentPath)) {
  try {
    assessment = JSON.parse(readFileSync(assessmentPath, 'utf8'))
    console.log('  📊  Assessment loaded:')
    console.log(`       Score: ${assessment.overall.score}/100 — ${assessment.overall.tier}`)
    const gaps = Object.entries(assessment.dimensions)
      .filter(([, d]) => d.score < 50)
      .map(([k]) => k)
    if (gaps.length > 0) console.log(`       Top gaps: ${gaps.join(', ')}`)
  } catch {
    console.log('  ⚠  Could not parse assessment file — continuing without it.')
  }
} else {
  console.log('  ℹ  No readiness assessment found. Run scan-repository.mjs first for pre-populated suggestions.')
}

console.log('\n──────────────────────────────────────────────────────────')
console.log('  Let\'s configure your repository. Answer each question.')
console.log('──────────────────────────────────────────────────────────\n')

// ── Questionnaire ────────────────────────────────────────────────────────────

const description = await ask('1. What is this repository for? (description)\n   > ')

const stack = await ask('\n2. What is the primary language/stack? (e.g., "Java 21 / Spring Boot / Kafka")\n   > ')

const teamSizeValue = await askEnum('\n3. How large is the engineering team?', [
  { value: 'small',      label: 'small',      hint: '< 10 people' },
  { value: 'medium',     label: 'medium',     hint: '10–50 people' },
  { value: 'large',      label: 'large',      hint: '50–200 people' },
  { value: 'enterprise', label: 'enterprise', hint: '200+ people' },
])

const workProvider = await askEnum('\n4. Which work management system do you use?', [
  { value: 'github-issues', label: 'GitHub Issues' },
  { value: 'jira',          label: 'Jira' },
  { value: 'azure-devops',  label: 'Azure DevOps' },
  { value: 'other',         label: 'Other / none' },
])

let githubOwner = ''
let githubRepo  = ''
if (workProvider === 'github-issues') {
  const ownerRepo = await ask('\n   Owner and repo name? (org/repo)\n   > ')
  const parts = ownerRepo.split('/')
  githubOwner = parts[0]?.trim() ?? ''
  githubRepo  = parts[1]?.trim() ?? ''
}

const aiTools = await askMultiSelect('\n5. Which AI tools are you using?', [
  { value: 'github-copilot',  label: 'GitHub Copilot' },
  { value: 'claude',          label: 'Claude / Anthropic' },
  { value: 'cursor',          label: 'Cursor IDE' },
  { value: 'codeium',         label: 'Codeium / Windsurf' },
  { value: 'tabnine',         label: 'Tabnine' },
  { value: 'chatgpt',         label: 'ChatGPT / OpenAI' },
  { value: 'other',           label: 'Other' },
])

const autonomyLevel = await askEnum('\n6. Maximum autonomy level you are comfortable with?', [
  { value: 'L0', label: 'L0 — Observe only',             hint: 'Read, inspect, analyze, report. No mutations.' },
  { value: 'L1', label: 'L1 — Recommend',                hint: 'Produce recommendations. Agent does NOT act.' },
  { value: 'L2', label: 'L2 — Prepare (with approval)',  hint: 'Draft artifacts, prepare PRs. Human approves.' },
  { value: 'L3', label: 'L3 — Execute (within limits)',  hint: 'Execute authorized actions in hard constraints.' },
])

const featureOptions = [
  { value: 'experiments',  label: 'Experiment tracking (A/B validation loops)' },
  { value: 'audit',        label: 'Audit trail (append-only agent action log)' },
  { value: 'phase_gates',  label: 'Phase gates (lifecycle step sign-offs)' },
  { value: 'finops',       label: 'FinOps / token budget controls' },
  { value: 'governance',   label: 'Governance registry (activity registry YAML)' },
]

const enabledFeatures = await askMultiSelect('\n7. Which framework features do you want to enable now?', featureOptions)

// ── Build config object ──────────────────────────────────────────────────────

const now = new Date().toISOString()

const config = {
  framework: {
    version: '1.0.0',
    schema: 'framework/schemas/config.schema.json',
    initialized_at: now,
    initialized_by: process.env.USER ?? process.env.USERNAME ?? '',
  },
  repository: {
    name: githubRepo || '',
    owner: githubOwner || '',
    type: 'brownfield',
    description: description.trim(),
    stack: {
      languages: stack.trim() ? [stack.trim()] : [],
      frameworks: [],
      build_tools: [],
      deployment_targets: [],
      ci_cd: [],
    },
    maturity: {
      level: assessment ? Math.round(assessment.overall.score / 25) : 0,
      assessed_at: assessment ? assessment.assessedAt : null,
      assessed_by: '',
    },
  },
  specify: {
    lifecycle_steps: ['Intake', 'Specify', 'Design', 'Plan', 'Implement', 'Verify', 'Deploy', 'Report', 'Learn'],
    current_step: 'Intake',
    artifact_root: '.specify',
  },
  governance: {
    registry: 'config/governance-registry.yaml',
    default_autonomy_level: autonomyLevel,
    confidence_thresholds: { recommend: 0.60, prepare: 0.75, execute: 0.90, escalation: 0.50, block: 0.30 },
    hard_constraints: {
      protected_branches_require_approval: true,
      secrets_cannot_be_committed: true,
      agents_cannot_modify_own_permissions: true,
      destructive_operations_require_approval: true,
      production_deployment_requires_pipeline: true,
    },
    approval: {
      architecture_approver: '',
      issue_creation_approver: '',
      pull_request_approver: '',
      deployment_approver: '',
      default_approver: '',
    },
    review: { default_interval_days: 180, notify_days_before: 14 },
  },
  work_management: {
    provider: workProvider,
    github_issues: {
      owner: githubOwner,
      repo: githubRepo,
      label_prefix: 'ais:',
      default_assignee: '',
      milestone: null,
    },
    jira:         { base_url: '', project_key: '', auth_secret: '' },
    azure_devops: { organization: '', project: '', auth_secret: '' },
  },
  agents: {
    catalog: 'config/agent-catalog.yaml',
    default_instructions: '.github/copilot-instructions.md',
    ai_tools: aiTools,
    team_size: teamSizeValue,
  },
  experiments: {
    enabled: enabledFeatures.includes('experiments'),
    directory: 'experiments/',
    metrics_collection: enabledFeatures.includes('experiments'),
    metrics_backend: null,
    max_concurrent_experiments: 3,
    require_charter: true,
    require_hypothesis: true,
    min_duration_days: 3,
  },
  audit: {
    enabled: enabledFeatures.includes('audit'),
    directory: 'audit/',
    retention_days: 365,
    tamper_evident: true,
    auditable_events: [
      'agent_action', 'approval_request', 'approval_granted', 'approval_denied',
      'governance_check', 'policy_violation', 'experiment_started', 'experiment_completed',
      'phase_gate_passed', 'phase_gate_failed',
    ],
  },
  phase_gates: {
    enabled: enabledFeatures.includes('phase_gates'),
    require_human_sign_off: true,
    require_evidence: true,
    allow_override: false,
    override_approver: '',
  },
  finops: {
    enabled: enabledFeatures.includes('finops'),
    token_budget_per_session: 200000,
    token_budget_hard_limit: 500000,
    model_budget_escalation_owner: '',
    flag_redundant_context_loading: true,
    flag_unbounded_retry_loops: true,
  },
  context: {
    input_docs_dir: 'docs/input',
    project_context_dir: '.project-context',
    max_context_files: 10,
    prefer_recent_artifacts: true,
  },
}

// ── Show proposed config ─────────────────────────────────────────────────────

const configYaml = yaml.dump(config, { lineWidth: 100, noRefs: true })

console.log('\n══════════════════════════════════════════════════════════')
console.log('  Proposed config/aispec.config.yaml')
console.log('══════════════════════════════════════════════════════════')
console.log(configYaml)
console.log('══════════════════════════════════════════════════════════')

const configFilePath = join(target, 'config', 'aispec.config.yaml')
const stateFilePath  = join(target, 'initialization-state.json')

console.log(`\n  Files to write:`)
console.log(`    • ${configFilePath}`)
console.log(`    • ${stateFilePath}`)

// ── Ask for approval ─────────────────────────────────────────────────────────

let decision = ''
while (!['yes', 'no', 'edit'].includes(decision.toLowerCase().trim())) {
  decision = await ask(`\nWrite these files to ${target}? (yes / no / edit): `)
}
decision = decision.toLowerCase().trim()

if (decision === 'no') {
  console.log('\n  Exiting without writing files.')
  rl.close()
  process.exit(0)
}

if (decision === 'edit') {
  const editor = process.env.EDITOR ?? process.env.VISUAL
  if (!editor) {
    console.log('\n  ⚠  $EDITOR is not set — cannot open editor. Proceeding with the config as-is.')
  } else {
    // Write a temp file in the output dir for editing
    const editPath = join(target, 'config', '_aispec.config.yaml.tmp')
    mkdirSync(join(target, 'config'), { recursive: true })
    writeFileSync(editPath, configYaml, 'utf8')
    console.log(`\n  Opening ${editPath} in ${editor}…`)
    try {
      const { spawnSync } = await import('child_process')
      spawnSync(editor, [editPath], { stdio: 'inherit' })
      const edited = readFileSync(editPath, 'utf8')
      const reloaded = yaml.load(edited)
      Object.assign(config, reloaded)
      // Remove temp file
      const { unlinkSync } = await import('fs')
      try { unlinkSync(editPath) } catch { /* ignore */ }
      console.log('  ✅  Config reloaded from editor.')
    } catch (err) {
      console.log(`  ⚠  Editor failed: ${err.message} — using original config.`)
    }
  }
}

// ── Write files ───────────────────────────────────────────────────────────────

const finalYaml = yaml.dump(config, { lineWidth: 100, noRefs: true })

const state = {
  initializedAt: now,
  initializedBy: config.framework.initialized_by,
  frameworkVersion: pkg.version,
  target: target,
  assessment: assessmentPath ?? null,
  autonomyLevel,
  enabledFeatures,
  aiTools,
  teamSize: teamSizeValue,
  workProvider,
}

guardedWrite(configFilePath, finalYaml, 'aispec.config.yaml')
guardedWrite(stateFilePath, state, 'initialization-state.json')

console.log('\n══════════════════════════════════════════════════════════')
console.log('  Initialization complete.')
console.log('  Next steps:')
console.log('  1. Review config/aispec.config.yaml and fill in approval fields')
console.log('  2. Run: node scripts/generate-gap-report.mjs --assessment docs/assessment/readiness-assessment.json')
console.log('  3. Commit and push')
console.log('══════════════════════════════════════════════════════════\n')

rl.close()
