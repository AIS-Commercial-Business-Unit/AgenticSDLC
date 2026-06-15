/**
 * generate-governance-grid.mjs
 *
 * Reads framework/templates/governance-registry.yaml (or a custom path via --registry)
 * and generates:
 *   1. docs/governance/summary-grid.md  — human-readable markdown table
 *   2. docs/governance/summary-grid.json — machine-readable JSON for the website
 *
 * Flags overdue entries (review_due_at in the past) with ⚠️
 * Flags entries due within 30 days with 🔔
 *
 * Usage:
 *   node scripts/generate-governance-grid.mjs [--registry path] [--output docs/governance/]
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parseArgs } from 'util';
import yaml from 'js-yaml';

// ── CLI args ──────────────────────────────────────────────────────────────
const { values: args } = parseArgs({
  options: {
    registry: { type: 'string', default: 'framework/templates/governance-registry.yaml' },
    output:   { type: 'string', default: 'docs/governance' },
    help:     { type: 'boolean', default: false },
  },
  strict: false,
});

if (args.help) {
  console.log(`
Usage: node scripts/generate-governance-grid.mjs [options]

Options:
  --registry <path>   Path to governance-registry.yaml (default: framework/templates/governance-registry.yaml)
  --output <dir>      Output directory for generated files (default: docs/governance)
  --help              Show this help message
`);
  process.exit(0);
}

// ── Resolve paths relative to repo root ───────────────────────────────────
const __dir   = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dir, '..');
const registryPath = resolve(repoRoot, args.registry);
const outputDir    = resolve(repoRoot, args.output);

// ── Load registry ─────────────────────────────────────────────────────────
let registry;
try {
  const raw = readFileSync(registryPath, 'utf8');
  const parsed = yaml.load(raw);
  registry = parsed.registry;
  if (!Array.isArray(registry)) {
    throw new Error('registry field is not an array');
  }
} catch (err) {
  console.error(`ERROR: Could not load governance registry from ${registryPath}`);
  console.error(err.message);
  process.exit(1);
}

// ── Date helpers ──────────────────────────────────────────────────────────
const today = new Date();
today.setHours(0, 0, 0, 0);
const thirtyDaysFromNow = new Date(today);
thirtyDaysFromNow.setDate(today.getDate() + 30);

/**
 * @param {string|null} reviewDateStr ISO-8601 date string or null
 * @returns {{ overdue: boolean, dueSoon: boolean, indicator: string }}
 */
function reviewStatus(reviewDateStr) {
  if (!reviewDateStr) {
    return { overdue: false, dueSoon: false, indicator: '' };
  }
  const reviewDate = new Date(reviewDateStr);
  reviewDate.setHours(0, 0, 0, 0);
  if (reviewDate < today) {
    return { overdue: true,  dueSoon: false, indicator: '⚠️' };
  }
  if (reviewDate <= thirtyDaysFromNow) {
    return { overdue: false, dueSoon: true,  indicator: '🔔' };
  }
  return { overdue: false, dueSoon: false, indicator: '' };
}

// ── Build enriched entries ─────────────────────────────────────────────────
const enriched = registry.map(entry => {
  const rs = reviewStatus(entry.review_due_at ?? entry.review_date ?? null);
  const approvalRequired = Array.isArray(entry.approval_requirements) && entry.approval_requirements.length > 0
    ? entry.approval_requirements
        .filter(a => a.required !== false)
        .map(a => a.approver_role)
        .join(', ') || 'none'
    : 'none';

  return {
    id:               entry.id,
    agent:            entry.agent,
    ais_step:         entry.step,
    activity:         entry.activity,
    autonomy_level:   entry.max_autonomy,
    max_autonomy:     entry.max_autonomy,
    current_autonomy: entry.current_autonomy ?? entry.max_autonomy,
    risk_level:       entry.risk_level,
    status:           entry.status,
    approval_required: approvalRequired,
    review_due_at:    entry.review_due_at ?? entry.review_date ?? null,
    overdue:          rs.overdue,
    due_soon:         rs.dueSoon,
    indicator:        rs.indicator,
    owner:            entry.owner ?? null,
    notes:            entry.notes ?? null,
  };
});

// ── Sort by step order, then agent ────────────────────────────────────────
const STEP_ORDER = ['Intake','Specify','Design','Plan','Implement','Verify','Deploy','Report','Learn'];
enriched.sort((a, b) => {
  const stepDiff = STEP_ORDER.indexOf(a.ais_step) - STEP_ORDER.indexOf(b.ais_step);
  if (stepDiff !== 0) return stepDiff;
  return a.agent.localeCompare(b.agent);
});

// ── Governance health summary ─────────────────────────────────────────────
const healthSummary = {
  total_registry_entries: enriched.length,
  overdue_count:          enriched.filter(e => e.overdue).length,
  due_soon_count:         enriched.filter(e => e.due_soon).length,
  healthy_count:          enriched.filter(e => !e.overdue && !e.due_soon).length,
};

// ── Generate markdown ─────────────────────────────────────────────────────
function pad(s, len) {
  const str = String(s ?? '');
  return str.length >= len ? str : str + ' '.repeat(len - str.length);
}

function buildMarkdown() {
  const generatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';

  const lines = [
    '# Governance Summary Grid',
    '',
    `> Generated: ${generatedAt}  `,
    `> Registry: \`${args.registry}\`  `,
    `> Total entries: **${healthSummary.total_registry_entries}** | ⚠️ Overdue: **${healthSummary.overdue_count}** | 🔔 Due soon: **${healthSummary.due_soon_count}** | ✅ Healthy: **${healthSummary.healthy_count}**`,
    '',
    '## Legend',
    '',
    '| Indicator | Meaning |',
    '|---|---|',
    '| ⚠️ | Review is **overdue** — `review_due_at` is in the past |',
    '| 🔔 | Review is **due within 30 days** |',
    '| _(none)_ | Review is current |',
    '',
    '## Activity Grid',
    '',
    '| Agent | AIS Step | Activity | Max Autonomy | Risk | Approval Required | Review Date |',
    '|---|---|---|---|---|---|---|',
  ];

  for (const e of enriched) {
    const indicator  = e.indicator ? `${e.indicator} ` : '';
    const reviewDate = e.review_due_at ? `${indicator}${e.review_due_at}` : `${indicator}—`;
    const risk       = riskEmoji(e.risk_level) + ' ' + e.risk_level;

    lines.push(
      `| \`${e.agent}\` | ${e.ais_step} | ${e.activity} | **${e.max_autonomy}** | ${risk} | ${e.approval_required} | ${reviewDate} |`
    );
  }

  lines.push('');
  lines.push('## Entries by AIS Step');
  lines.push('');

  const byStep = {};
  for (const e of enriched) {
    (byStep[e.ais_step] = byStep[e.ais_step] ?? []).push(e);
  }
  for (const step of STEP_ORDER) {
    const entries = byStep[step];
    if (!entries || entries.length === 0) continue;
    lines.push(`### ${step} (${entries.length} ${entries.length === 1 ? 'entry' : 'entries'})`);
    lines.push('');
    lines.push('| Agent | Activity | Max Autonomy | Risk | Status |');
    lines.push('|---|---|---|---|---|');
    for (const e of entries) {
      const statusEmoji = e.status === 'Approved' ? '✅' : e.status === 'Draft' ? '📝' : '❓';
      lines.push(`| \`${e.agent}\` | ${e.activity} | **${e.max_autonomy}** | ${riskEmoji(e.risk_level)} ${e.risk_level} | ${statusEmoji} ${e.status} |`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('_This file is auto-generated by `node scripts/generate-governance-grid.mjs`. Do not edit manually._');
  lines.push('');

  return lines.join('\n');
}

function riskEmoji(risk) {
  switch (risk) {
    case 'low':      return '🟢';
    case 'medium':   return '🟡';
    case 'high':     return '🟠';
    case 'critical': return '🔴';
    default:         return '⬜';
  }
}

// ── Generate JSON ─────────────────────────────────────────────────────────
function buildJson() {
  return {
    generated_at:     new Date().toISOString(),
    registry_path:    args.registry,
    governance_health: healthSummary,
    entries:          enriched,
  };
}

// ── Named export for testing ──────────────────────────────────────────────
export async function generateGovernanceGrid() {
  return { entries: enriched, health: healthSummary };
}

// ── Write output files (CLI only) ────────────────────────────────────────
const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))
if (isMain) {
mkdirSync(outputDir, { recursive: true });

const mdPath   = join(outputDir, 'summary-grid.md');
const jsonPath = join(outputDir, 'summary-grid.json');

const md   = buildMarkdown();
const json = buildJson();

writeFileSync(mdPath,   md,                      'utf8');
writeFileSync(jsonPath, JSON.stringify(json, null, 2) + '\n', 'utf8');

// ── Summary ───────────────────────────────────────────────────────────────
console.log('');
console.log('✅ Governance grid generated successfully');
console.log(`   Registry:     ${registryPath}`);
console.log(`   Markdown:     ${mdPath}`);
console.log(`   JSON:         ${jsonPath}`);
console.log('');
console.log(`   Total entries : ${healthSummary.total_registry_entries}`);
console.log(`   ⚠️  Overdue   : ${healthSummary.overdue_count}`);
console.log(`   🔔 Due soon  : ${healthSummary.due_soon_count}`);
console.log(`   ✅ Healthy   : ${healthSummary.healthy_count}`);
console.log('');

if (healthSummary.overdue_count > 0) {
  console.log('⚠️  Overdue entries:');
  enriched.filter(e => e.overdue).forEach(e => {
    console.log(`   - ${e.id}  (due: ${e.review_due_at})`);
  });
  console.log('');
}

if (healthSummary.due_soon_count > 0) {
  console.log('🔔 Due-soon entries:');
  enriched.filter(e => e.due_soon).forEach(e => {
    console.log(`   - ${e.id}  (due: ${e.review_due_at})`);
  });
  console.log('');
}
} // end isMain
