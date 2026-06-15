#!/usr/bin/env node
/**
 * AEF Framework Installer
 * Scaffolds the Agentic Engineering Framework into a target repository.
 *
 * Usage:
 *   node scripts/install.mjs --target <path-to-repo>
 *
 * What it installs:
 *   .github/workflows/aef-scan.md     — gh-aw workflow definition
 *   .github/workflows/aef-scan.yml    — compiled GitHub Actions workflow (if gh aw compile runs ok)
 *   scripts/aef-scan.mjs              — Node.js fallback scanner
 *   scripts/aef-report.mjs            — HTML report generator
 *   config/aispec.config.yaml         — governance config template
 *   docs/assessment/                  — output directory placeholder
 *   package.json                      — adds aef:scan and aef:report scripts
 */

import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const frameworkRoot = resolve(__dirname, '..')

const args = process.argv.slice(2)
function getArg(flag) {
  const idx = args.indexOf(flag)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null
}

const targetPath = getArg('--target')
if (!targetPath) {
  console.error('Error: --target <path-to-repo> is required')
  console.error('Usage: node scripts/install.mjs --target <path>')
  process.exit(1)
}

const target = resolve(targetPath)
if (!existsSync(target)) {
  console.error(`Error: target path does not exist: ${target}`)
  process.exit(1)
}

console.log('\n══════════════════════════════════════════════════════════')
console.log('  Agentic Engineering Framework — Installer v0.23.0')
console.log('══════════════════════════════════════════════════════════')
console.log(`  Source:    ${frameworkRoot}`)
console.log(`  Target:    ${target}`)
console.log('──────────────────────────────────────────────────────────\n')

// ── Create directory structure ─────────────────────────────────────────────────

const dirs = [
  join(target, '.github', 'workflows'),
  join(target, '.github', 'agents'),
  join(target, 'scripts'),
  join(target, 'config'),
  join(target, 'docs', 'assessment'),
]

for (const dir of dirs) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
    console.log(`  📁 Created: ${dir.replace(target, '.')}`)
  } else {
    console.log(`  ✓  Exists:  ${dir.replace(target, '.')}`)
  }
}

// ── Copy scanner scripts ──────────────────────────────────────────────────────

const scriptsToCopy = [
  { src: 'scripts/scan-repository.mjs', dest: 'scripts/aef-scan.mjs' },
  { src: 'scripts/generate-report.mjs', dest: 'scripts/generate-report.mjs' }, // required import by aef-scan.mjs
  { src: 'scripts/generate-report.mjs', dest: 'scripts/aef-report.mjs' },       // named entry for npm script
  { src: 'scripts/check-adoption.mjs', dest: 'scripts/aef-check-adoption.mjs' },
  { src: 'scripts/collect-metrics.mjs', dest: 'scripts/aef-collect-metrics.mjs' },
]

for (const { src, dest } of scriptsToCopy) {
  const srcPath  = join(frameworkRoot, src)
  const destPath = join(target, dest)
  if (!existsSync(srcPath)) {
    console.warn(`  ⚠️  Source not found, skipping: ${src}`)
    continue
  }
  copyFileSync(srcPath, destPath)
  if (dest === 'scripts/aef-collect-metrics.mjs') {
    const content = readFileSync(destPath, 'utf8').replace("'./check-adoption.mjs'", "'./aef-check-adoption.mjs'")
    writeFileSync(destPath, content, 'utf8')
  }
  console.log(`  📄 Copied: ${dest}`)
}

// ── Copy gh-aw workflow ──────────────────────────────────────────────────────

const ghawFiles = [
  '.github/workflows/aef-scan.md',
  '.github/workflows/aef-scan.lock.yml',
]

for (const file of ghawFiles) {
  const srcPath  = join(frameworkRoot, file)
  const destPath = join(target, file)
  if (existsSync(srcPath)) {
    copyFileSync(srcPath, destPath)
    console.log(`  📄 Copied: ${file}`)
  }
}

const metricsWorkflow = join(frameworkRoot, '.github', 'workflows', 'collect-metrics.yml')
const metricsWorkflowDest = join(target, '.github', 'workflows', 'aef-collect-metrics.yml')
if (existsSync(metricsWorkflow) && !existsSync(metricsWorkflowDest)) {
  copyFileSync(metricsWorkflow, metricsWorkflowDest)
  console.log(`  📄 Copied: .github/workflows/aef-collect-metrics.yml`)
}

// If the compiled .yml wasn't available, try to compile fresh in the target
if (!existsSync(join(target, '.github', 'workflows', 'aef-scan.lock.yml'))) {
  try {
    execSync('gh aw compile aef-scan', { cwd: target, stdio: 'pipe' })
    console.log(`  ✅ Compiled: .github/workflows/aef-scan.lock.yml`)
  } catch {
    console.warn(`  ⚠️  Could not auto-compile gh-aw workflow.`)
    console.warn(`      Run manually: cd "${target}" && gh aw compile aef-scan`)
  }
}

// ── Write config template ─────────────────────────────────────────────────────

const configPath = join(target, 'config', 'aispec.config.yaml')
if (!existsSync(configPath)) {
  const configTemplate = `# AEF Configuration
# Generated by: node scripts/install.mjs
# Docs: https://github.com/AIS-Commercial-Business-Unit/AgenticSDLC

governance:
  autonomy_levels:
    L0: "Fully manual — no AI assistance"
    L1: "AI suggests, human decides"
    L2: "AI acts, human reviews before merge"
    L3: "AI acts autonomously within approved scope"
  default_level: L1
  audit_trail: true
  approval_gates:
    - name: "SEP Gate"
      description: "Strategic Engagement Plan sign-off before major features"
      required_approvers: ["lead", "solution-architect"]
    - name: "Security Gate"
      description: "Automated security scan must pass"
      required_approvers: []
  escalation_path:
    - level: "team-lead"
      triggers: ["L3 action on critical system", "governance exception request"]
    - level: "architecture-board"
      triggers: ["new agent type", "new data access pattern"]

context:
  decision_log: docs/decisions/
  spec_directory: specs/
  agent_prompts: .github/agents/

finops:
  track_estimation: false
  estimation_model: "fibonacci"

metrics:
  output_directory: docs/assessment/
  collect_on: ["pr_merged", "deployment"]
`
  writeFileSync(configPath, configTemplate, 'utf8')
  console.log(`  📄 Created: config/aispec.config.yaml`)
} else {
  console.log(`  ✓  Exists:  config/aispec.config.yaml`)
}

// ── Update target package.json ────────────────────────────────────────────────

const pkgPath = join(target, 'package.json')
const aefScripts = {
  'aef:scan':   'node scripts/aef-scan.mjs --target .',
  'aef:report': 'node scripts/aef-report.mjs --assessment docs/assessment/readiness-assessment.json',
  'aef:metrics': 'node scripts/aef-collect-metrics.mjs',
  'aef:adoption': 'node scripts/aef-check-adoption.mjs',
}

if (existsSync(pkgPath)) {
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
    pkg.scripts = pkg.scripts ?? {}
    let added = 0
    for (const [k, v] of Object.entries(aefScripts)) {
      if (!pkg.scripts[k]) {
        pkg.scripts[k] = v
        added++
      }
    }
    if (added > 0) {
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8')
      console.log(`  📄 Updated: package.json (added ${added} aef:* script(s))`)
    } else {
      console.log(`  ✓  Exists:  package.json aef:* scripts`)
    }
  } catch (e) {
    console.warn(`  ⚠️  Could not update package.json: ${e.message}`)
  }
} else {
  const minPkg = {
    name:    target.split(/[\\/]/).at(-1)?.toLowerCase().replace(/[^a-z0-9-]/g, '-') ?? 'repo',
    version: '0.1.0',
    private: true,
    type:    'module',
    scripts: aefScripts,
  }
  writeFileSync(pkgPath, JSON.stringify(minPkg, null, 2) + '\n', 'utf8')
  console.log(`  📄 Created: package.json`)
}

// ── Print next steps ──────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════════')
console.log('  ✅ AEF Framework installed successfully!')
console.log('══════════════════════════════════════════════════════════')
console.log(`
Next steps:

  1. Review and customize your governance config:
       config/aispec.config.yaml

  2. Commit the framework files:
       git add .
       git commit -m "feat: install AEF framework (baseline assessment)"
       git push

  3a. Run the scanner via GitHub Actions (agentic — recommended):
       Go to: GitHub → Actions → AEF Maturity Scanner → Run workflow
       The agent will analyze the repo and open a PR with results.

  3b. Run the scanner locally (Node.js fallback):
       node scripts/aef-scan.mjs --target .

  4. View your maturity dashboard:
       Open docs/assessment/maturity-report.html in a browser
       (after step 3a: merge the PR and open the file)
       (after step 3b: the file is written directly)
`)
