/**
 * generate-gap-report.mjs
 *
 * Reads a readiness-assessment.json produced by scan-repository.mjs and generates
 * a human-readable gap-report.md in Markdown.
 *
 * Usage:
 *   node scripts/generate-gap-report.mjs --assessment <path-to-assessment.json> [--output <output-path>] [--dry-run]
 *
 * Exit codes:
 *   0 — report written (or dry-run preview shown)
 *   1 — fatal error (assessment file missing or invalid)
 */

import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs'
import { resolve, join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// ── Gap definition library ───────────────────────────────────────────────────
//
// For each dimension, defines what gaps look like at each maturity band and
// the recommended remediation steps with effort estimates.

const GAP_LIBRARY = {
  aiGovernance: {
    label: 'AI Governance',
    gaps: [
      {
        threshold: 35,
        priority: 'critical',
        title: 'No framework configuration found',
        impact: 'Agents operate without policy constraints — no autonomy limits, no approval gates, no audit trail.',
        effort: 2,
        steps: [
          'Run `node scripts/initialize.mjs --target <repo>` to create `config/aispec.config.yaml`',
          'Set `governance.default_autonomy_level` to L1 (Recommend) to start conservatively',
          'Configure at least one approver in `governance.approval.default_approver`',
        ],
      },
      {
        threshold: 60,
        priority: 'high',
        title: 'Governance registry and agent catalog missing',
        impact: 'Individual agents are not formally catalogued or assigned activities — drift risk.',
        effort: 4,
        steps: [
          'Create `config/governance-registry.yaml` listing all governed agent activities',
          'Create `config/agent-catalog.yaml` with entries for each active agent',
          'Wire `governance.registry` and `agents.catalog` in aispec.config.yaml',
        ],
      },
      {
        threshold: 80,
        priority: 'medium',
        title: 'Confidence thresholds not tuned for this team',
        impact: 'Default thresholds may allow premature agent actions or block useful automation.',
        effort: 1,
        steps: [
          'Review `governance.confidence_thresholds` against your team\'s risk tolerance',
          'Lower `execute` threshold only after establishing audit trail and rollback procedures',
        ],
      },
    ],
  },
  agentManagement: {
    label: 'Agent Management',
    gaps: [
      {
        threshold: 20,
        priority: 'critical',
        title: 'No agents defined',
        impact: 'No AI-assisted workflows in place — maximum manual toil, zero leverage from AI tooling.',
        effort: 8,
        steps: [
          'Create `.github/agents/` directory',
          'Add at least one agent file (e.g., `code-reviewer.md`, `pr-description.md`)',
          'Reference agents from `.github/copilot-instructions.md`',
        ],
      },
      {
        threshold: 50,
        priority: 'high',
        title: 'Agents exist but no skill library',
        impact: 'Agents cannot reuse shared capabilities — duplicated prompt logic across agent files.',
        effort: 4,
        steps: [
          'Create `.agents/skills/` directory',
          'Extract reusable capabilities (e.g., structured logging, error handling) into skill files',
          'Reference skills from agent definitions',
        ],
      },
      {
        threshold: 70,
        priority: 'medium',
        title: 'No IDE-native agent commands (.claude/commands or .cursor/rules)',
        impact: 'Developers must manually copy agent instructions — higher friction, lower adoption.',
        effort: 2,
        steps: [
          'Create `.claude/commands/` with slash-command definitions for common agent workflows',
          'Or create `.cursor/rules/` to inject agent context into Cursor IDE automatically',
        ],
      },
    ],
  },
  cicd: {
    label: 'CI/CD',
    gaps: [
      {
        threshold: 20,
        priority: 'critical',
        title: 'No CI/CD pipelines found',
        impact: 'No automated quality gates — all validation is manual, release risk is high.',
        effort: 16,
        steps: [
          'Create `.github/workflows/ci.yml` with at minimum a test job',
          'Add a build job that produces a deployable artifact',
          'Gate PRs on passing CI (configure branch protection rules)',
        ],
      },
      {
        threshold: 50,
        priority: 'high',
        title: 'CI present but no lint or security scan',
        impact: 'Code quality and security vulnerabilities are not caught automatically.',
        effort: 4,
        steps: [
          'Add a lint step to the CI workflow (e.g., markdownlint, ESLint, Checkstyle)',
          'Add dependency vulnerability scanning (e.g., `npm audit`, OWASP Dependency-Check)',
          'Fail the workflow on lint errors or high-severity vulnerabilities',
        ],
      },
      {
        threshold: 70,
        priority: 'medium',
        title: 'No deployment workflow found',
        impact: 'Deployments are manual and undocumented — deployment frequency and reliability suffer.',
        effort: 8,
        steps: [
          'Create `.github/workflows/deploy.yml` triggered on merge to main/release branch',
          'Require a named approver for production deployments',
          'Emit a deployment event or tag for audit trail',
        ],
      },
    ],
  },
  documentation: {
    label: 'Documentation',
    gaps: [
      {
        threshold: 25,
        priority: 'critical',
        title: 'Minimal or no project documentation',
        impact: 'New developers (human or AI) cannot understand the codebase — onboarding time is high.',
        effort: 8,
        steps: [
          'Create a substantive README.md (purpose, stack, local setup, contributing)',
          'Create CONTRIBUTING.md with branching model, PR guidelines, and coding standards',
          'Add a `docs/` directory for deeper documentation',
        ],
      },
      {
        threshold: 60,
        priority: 'high',
        title: 'No Architecture Decision Records (ADRs)',
        impact: 'Key architectural decisions are undocumented — future developers reverse-engineer intent.',
        effort: 4,
        steps: [
          'Create `docs/adr/` directory',
          'Write ADR-001 documenting the most significant recent architectural decision',
          'Adopt a lightweight template (e.g., Michael Nygard\'s ADR format)',
        ],
      },
    ],
  },
  branchManagement: {
    label: 'Branch Management',
    gaps: [
      {
        threshold: 30,
        priority: 'high',
        title: 'No branch protection or ruleset configuration',
        impact: 'Direct pushes to main or dev are possible — accidental or malicious changes bypass review.',
        effort: 1,
        steps: [
          'Enable branch protection rules on `main` and `dev` in GitHub repository settings',
          'Require at least 1 approving review for PRs targeting protected branches',
          'Or add `.github/rulesets/*.json` files for version-controlled ruleset definitions',
        ],
      },
      {
        threshold: 60,
        priority: 'medium',
        title: 'Branching strategy not documented',
        impact: 'Teams develop inconsistent branch naming and merge practices — merge conflicts and confusion.',
        effort: 1,
        steps: [
          'Document the branch model in CONTRIBUTING.md (e.g., feature/, hotfix/, release/ prefixes)',
          'Consider conventional branch naming enforced by a GitHub Action or ruleset pattern',
        ],
      },
    ],
  },
  prProcess: {
    label: 'PR Process',
    gaps: [
      {
        threshold: 35,
        priority: 'high',
        title: 'No pull request template',
        impact: 'PRs lack consistent context — reviewers miss intent, testing notes, and linked issues.',
        effort: 1,
        steps: [
          'Create `.github/pull_request_template.md`',
          'Include sections: Summary, Motivation, Testing Evidence, Checklist',
          'Reference the linked issue with "Closes #NNN"',
        ],
      },
      {
        threshold: 60,
        priority: 'medium',
        title: 'No CODEOWNERS file',
        impact: 'Critical files have no automatic reviewer assignment — important changes may go unreviewed.',
        effort: 1,
        steps: [
          'Create `CODEOWNERS` or `.github/CODEOWNERS`',
          'Assign owning teams or individuals to critical paths (e.g., `config/` `framework/`)',
          'Enable "Require review from code owners" in branch protection settings',
        ],
      },
      {
        threshold: 70,
        priority: 'low',
        title: 'Conventional commit conventions not documented',
        impact: 'Commit history is inconsistent — changelog generation and semantic versioning cannot be automated.',
        effort: 1,
        steps: [
          'Document conventional commit format (feat/fix/chore/docs/test) in CONTRIBUTING.md',
          'Optionally add a commitlint GitHub Action to enforce format on PRs',
        ],
      },
    ],
  },
}

// ── Gap analysis ─────────────────────────────────────────────────────────────

function analyzeGaps(assessment) {
  const critical = []
  const high     = []
  const medium   = []
  const low      = []

  for (const [dimKey, dimLib] of Object.entries(GAP_LIBRARY)) {
    const dimData = assessment.dimensions[dimKey]
    if (!dimData) continue

    const score = dimData.score

    for (const gap of dimLib.gaps) {
      if (score < gap.threshold) {
        const entry = { area: dimLib.label, ...gap }
        if      (gap.priority === 'critical') critical.push(entry)
        else if (gap.priority === 'high')     high.push(entry)
        else if (gap.priority === 'medium')   medium.push(entry)
        else                                  low.push(entry)
      }
    }
  }

  return { critical, high, medium, low }
}

// ── Work management recommendation ───────────────────────────────────────────

function workManagementRec(assessment) {
  const score = assessment.overall.score
  const hasCI  = (assessment.dimensions.cicd?.score ?? 0) > 30
  const hasGov = (assessment.dimensions.aiGovernance?.score ?? 0) > 35

  if (score >= 60 || (hasCI && hasGov)) {
    return {
      provider: 'GitHub Issues + Projects',
      rationale: 'Repository already has structured processes. GitHub Issues with Milestones and the AIS label system (ais: prefix) will integrate cleanly with existing workflows.',
    }
  }
  if (score >= 30) {
    return {
      provider: 'GitHub Issues',
      rationale: 'Lightweight issue tracking is sufficient at this maturity level. Evolve to GitHub Projects once CI and governance baselines are established.',
    }
  }
  return {
    provider: 'GitHub Issues (start minimal)',
    rationale: 'Focus on establishing CI and documentation first. Begin with simple issues and milestones. Avoid complex project boards until core engineering practices are in place.',
  }
}

// ── MCP opportunities ─────────────────────────────────────────────────────────

function mcpOpportunities(assessment) {
  const ops = []
  const dims = assessment.dimensions

  if ((dims.cicd?.score ?? 0) > 30) {
    ops.push({ tool: 'GitHub MCP', use: 'Automate issue creation from failing CI runs and link PRs to work items' })
  }
  if ((dims.aiGovernance?.score ?? 0) > 35) {
    ops.push({ tool: 'Filesystem MCP', use: 'Allow agents to read aispec.config.yaml and governance-registry.yaml for context' })
  }
  if ((dims.documentation?.score ?? 0) > 40) {
    ops.push({ tool: 'GitHub MCP (search)', use: 'Query ADRs and docs during agent conversations for context-aware recommendations' })
  }
  if ((dims.agentManagement?.agentNames?.length ?? 0) > 0) {
    ops.push({ tool: 'Sequential Thinking MCP', use: 'Enable multi-step reasoning chains for complex agent workflows' })
  }
  if (ops.length === 0) {
    ops.push({ tool: 'GitHub MCP', use: 'Start with GitHub MCP to connect agents to issues and PRs — highest ROI at this maturity level' })
  }
  return ops
}

// ── Effort estimate ───────────────────────────────────────────────────────────

function estimateEffort(gaps) {
  const totalHours = [...gaps.critical, ...gaps.high, ...gaps.medium, ...gaps.low]
    .reduce((sum, g) => sum + g.effort, 0)
  // Rough phase breakdown
  const phases = Math.max(1, Math.ceil(totalHours / 16))
  return { totalHours, phases }
}

// ── Executive summary ─────────────────────────────────────────────────────────

function executiveSummary(assessment, gaps) {
  const score = assessment.overall.score
  const tier  = assessment.overall.tier
  const critCount = gaps.critical.length
  const highCount  = gaps.high.length

  let summary = `The repository scored **${score}/100** (${tier} tier) on the Agentic Engineering readiness assessment. `

  if (critCount > 0) {
    const areas = gaps.critical.map(g => g.area).join(', ')
    summary += `There ${critCount === 1 ? 'is' : 'are'} **${critCount} critical gap${critCount !== 1 ? 's' : ''}** in: ${areas} — these must be addressed before autonomous agent workflows can be safely enabled. `
  }

  if (highCount > 0) {
    summary += `**${highCount} high-priority gap${highCount !== 1 ? 's' : ''}** represent meaningful risk that should be resolved within the first sprint. `
  }

  if (critCount === 0 && highCount === 0) {
    summary += 'No critical or high-priority gaps were found. The repository is ready for structured AI-assisted workflows at the assessed autonomy level.'
  }

  return summary
}

// ── Next steps ────────────────────────────────────────────────────────────────

function nextSteps(gaps, tier) {
  const steps = []
  let idx = 1

  if (gaps.critical.length > 0) {
    steps.push(`**Address all ${gaps.critical.length} critical gap(s)** immediately — these block safe agent enablement`)
    idx++
  }

  if (tier === 'Minimal' || tier === 'Early') {
    steps.push('Run `node scripts/initialize.mjs --target <repo>` to create the base governance config')
    idx++
    steps.push('Establish CI/CD with at minimum a test + lint workflow before adding any L2/L3 agent capabilities')
    idx++
  }

  if (gaps.high.length > 0) {
    steps.push(`Resolve ${gaps.high.length} high-priority gap(s) in Sprint 1`)
    idx++
  }

  steps.push('Re-run `node scripts/scan-repository.mjs` after each phase to track score improvement')
  steps.push('Set `governance.default_autonomy_level: L1` as the starting point and promote to L2 after first CI gate is verified')

  return steps
}

// ── Gap section renderer ──────────────────────────────────────────────────────

function renderGapSection(gaps, label) {
  if (gaps.length === 0) return ''

  let md = `## ${label}\n\n`

  for (const gap of gaps) {
    md += `### ${gap.area ?? gap.dimension ?? 'Gap'} — ${gap.title ?? gap.recommendation ?? 'See details'}\n\n`
    if (gap.impact) md += `- **Impact:** ${gap.impact}\n`
    if (gap.effort != null) md += `- **Estimated effort:** ~${gap.effort}h\n`
    if (gap.steps?.length) {
      md += `- **Remediation steps:**\n`
      for (const step of gap.steps) {
        md += `  1. ${step}\n`
      }
    }
    md += '\n'
  }

  return md
}

// ── Dimension score table ──────────────────────────────────────────────────────

function renderScoreTable(assessment) {
  const rows = Object.entries(assessment.dimensions).map(([key, dim]) => {
    const lib = GAP_LIBRARY[key]
    const label = lib?.label ?? key
    const weight = ((dim.weight ?? 0) * 100).toFixed(0)
    const bar = '█'.repeat(Math.round(dim.score / 10)).padEnd(10, '░')
    return `| ${label.padEnd(22)} | ${bar} | ${String(dim.score).padStart(3)}/100 | ${weight}% |`
  })

  return [
    '| Dimension              | Progress   | Score    | Weight |',
    '|------------------------|------------|----------|--------|',
    ...rows,
  ].join('\n')
}

// ── Core export: Generate gap report from assessment ─────────────────────────

export async function generateGapReport(assessment) {
  // Normalize flat-shape input (from tests/scanner output) to the full shape
  if (assessment.overall_score !== undefined && assessment.overall === undefined) {
    assessment = {
      repository:    assessment.target_repo ?? assessment.repository ?? 'unknown',
      assessedAt:    assessment.generated_at ?? assessment.assessedAt ?? new Date().toISOString(),
      targetPath:    assessment.targetPath ?? '.',
      overall: {
        score: assessment.overall_score,
        tier:  assessment.maturity_tier ?? 'Unknown',
      },
      dimensions: assessment.dimensions ?? {
        aiGovernance:    { score: 0, findings: [] },
        agentManagement: { score: 0, findings: [] },
        cicd:            { score: 0, findings: [] },
        branchManagement:{ score: 0, findings: [] },
        prProcess:       { score: 0, findings: [] },
        documentation:   { score: 0, findings: [] },
      },
      _precomputedGaps: assessment.gaps ?? [],
    }
  }
  const _precomputed = assessment._precomputedGaps
  // Normalize pre-computed flat gap array into { critical, high, medium, low }
  const gaps = _precomputed
    ? {
        critical: _precomputed.filter(g => g.severity === 'critical' || g.priority === 'critical'),
        high:     _precomputed.filter(g => g.severity === 'high'     || g.priority === 'high'),
        medium:   _precomputed.filter(g => g.severity === 'medium'   || g.priority === 'medium'),
        low:      _precomputed.filter(g => g.severity === 'low'      || g.priority === 'low'),
      }
    : analyzeGaps(assessment)
  const workRec   = workManagementRec(assessment)
  const mcpOps    = mcpOpportunities(assessment)
  const effort    = estimateEffort(gaps)
  const summary   = executiveSummary(assessment, gaps)
  const steps     = nextSteps(gaps, assessment.overall.tier)
  const dateStr   = new Date(assessment.assessedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  // ── Build markdown ────────────────────────────────────────────────────────────

  let md = `# Agentic Engineering Gap Report

**Repository:** ${assessment.repository}
**Assessment Date:** ${dateStr}
**Overall Score:** ${assessment.overall.score}/100 — ${assessment.overall.tier}

---

## Score Summary

${renderScoreTable(assessment)}

---

## Executive Summary

${summary}

---

${renderGapSection(gaps.critical, 'Critical Gaps')}
${renderGapSection(gaps.high, 'High Priority Gaps')}
${renderGapSection(gaps.medium, 'Medium Priority Gaps')}
${renderGapSection(gaps.low, 'Low Priority / Improvements')}
${(gaps.critical.length + gaps.high.length + gaps.medium.length + gaps.low.length) === 0 ? '✅ No critical gaps — this repository is in good agentic engineering shape.\n' : ''}
## Recommended Next Steps

${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}

---

## Work Management Recommendation

**${workRec.provider}**

${workRec.rationale}

---

## MCP Opportunities

${mcpOps.map(op => `- **${op.tool}** — ${op.use}`).join('\n')}

---

## Estimated Initialization Time

Approximately **${effort.totalHours} hours** of engineering effort across **${effort.phases} phase${effort.phases !== 1 ? 's' : ''}**.

> This estimate covers gap remediation only (CI/CD setup, governance config, documentation, branch protection).
> It does not include agent development or ongoing iteration.

---

*Generated by [agentic-engineering-framework](https://github.com) scan-repository + generate-gap-report toolchain.*
*Assessment source: \`${assessment.targetPath}\`*
`

  // Remove runs of more than two blank lines
  md = md.replace(/\n{3,}/g, '\n\n')

  return md
}

// ── CLI Entry Point ──────────────────────────────────────────────────────────

const _isMainGap = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop())

if (_isMainGap) {
const args = process.argv.slice(2)

function getArg(flag) {
  const idx = args.indexOf(flag)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null
}

const assessmentArg = getArg('--assessment')
const outputArg     = getArg('--output')
const dryRun        = args.includes('--dry-run')

if (!assessmentArg) {
  console.error('Error: --assessment <path-to-assessment.json> is required')
  process.exit(1)
}

const assessmentPath = resolve(assessmentArg)

if (!existsSync(assessmentPath)) {
  console.error(`Error: assessment file not found: ${assessmentPath}`)
  process.exit(1)
}

// ── Load assessment ──────────────────────────────────────────────────────────

let assessment
try {
  assessment = JSON.parse(readFileSync(assessmentPath, 'utf8'))
} catch (err) {
  console.error(`Error: could not parse assessment JSON: ${err.message}`)
  process.exit(1)
}

const defaultOutputPath = join(dirname(assessmentPath), 'gap-report.md')
const outputPath = outputArg ? resolve(outputArg) : defaultOutputPath

// ── Main ─────────────────────────────────────────────────────────────────────

const md = await generateGapReport(assessment)

// ── Write or dry-run ─────────────────────────────────────────────────────────

if (dryRun) {
  console.log(`\n[dry-run] Would write: ${outputPath}`)
  console.log('────── report preview (first 1000 chars) ──────')
  console.log(md.slice(0, 1000))
  console.log('──────────────────────────────────────────────')
} else {
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, md, 'utf8')
  console.log(`✅  Gap report written to: ${outputPath}`)
}
} // end _isMainGap
