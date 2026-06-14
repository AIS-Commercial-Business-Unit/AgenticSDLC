# Metrics

This directory holds durable, time-series metrics about framework usage and adoption.
All files here are **committed to source control** — they form the historical record.

## What's Collected

| File pattern | Source | Cadence |
|---|---|---|
| `reports/YYYY-MM-DD.json` | GitHub Actions — `collect-metrics.yml` | Weekly (Monday 06:00 UTC) + every `main` push |
| `reports/latest.json` | Same run, copied (not symlinked — Windows compat) | Same |
| `adoption-YYYY-MM-DD.json` | `check-adoption.mjs` | Same workflow |

## How Metrics Are Collected

The collection pipeline has three sources:

1. **Audit events** — `audit/events/**/*.json` files conforming to `metrics-event.schema.json`.
   Each file is one agent activity event. Scripts aggregate counts by agent, step, autonomy level,
   and outcome; compute average durations; and derive a manual-to-governed ratio.

2. **GitHub API** — When `GITHUB_TOKEN` is available, the workflow fetches:
   - Issues closed in the period (average close time)
   - PRs merged in the period (average merge time)
   - Workflow run success rate

3. **Framework adoption** — `check-adoption.mjs` walks the repo and scores eight categories
   (config, agents, skills, governance, docs, tests, ci, playbooks) against expected maximums.

## How to Read a Report

Every `reports/YYYY-MM-DD.json` (and `latest.json`) contains:

```jsonc
{
  "schemaVersion": "1.0.0",
  "generatedAt": "...",
  "period": { "days": 30, "from": "...", "to": "..." },
  "auditEvents": {
    "totalEvents": 42,
    "byAgent": { "architect": 10, "developer": 32 },
    "byAutonomyLevel": { "L1": 5, "L2": 30, "L3": 7 },
    "byOutcome": { "approved": 38, "rejected": 4 },
    "manualToGovernedRatio": 0.12,
    "topAgents": [...]
  },
  "github": {
    "issueCloseTimesAvgHours": 18.4,
    "prMergeTimesAvgHours": 6.2,
    "workflowSuccessRate": 94.7
  },
  "adoption": {
    "adoptionPercent": 72,
    "categories": { ... }
  },
  "governanceHealth": { "score": 68, "status": "amber" }
}
```

## How the Dashboard Uses These Files

The website dashboard (if enabled) reads `reports/latest.json` to render trend charts and
adoption gauges. Historical `YYYY-MM-DD.json` files provide the time-series data.

## Running Locally

```bash
# Check adoption only
node scripts/check-adoption.mjs

# Full metrics collection (no GitHub data)
node scripts/collect-metrics.mjs --period 30

# Full collection with GitHub data
node scripts/collect-metrics.mjs --repo owner/repo --token ghp_xxx --period 30
```

## Important

> **Do not add `metrics/` to `.gitignore`.** These files are the audit trail.
> The workflow commits them automatically. Keeping them in source control enables
> trend analysis and makes governance health visible across the team.
