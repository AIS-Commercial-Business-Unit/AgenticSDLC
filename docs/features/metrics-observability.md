# Feature: Metrics & Observability

> **Pillar 2 of the Agentic Engineering Framework**
> "Prove the investment is working."

---

## The Problem

Enterprise IT organizations adopting GitHub Copilot and AI agents have no way to measure:

- Which agents are being used and how often
- How long agent-assisted workflows take vs. manual processes
- Whether the team is becoming more governed over time or staying ad-hoc
- What percentage of the framework a team has actually adopted
- Whether governance controls are staying current (reassessment overdue?)
- The ROI of AI tooling investment

This is a critical gap. Without metrics, AI adoption stays a bet, not a strategy.

---

## What the Framework Provides

### Agent Activity Tracking

Every governed agent activity emits a structured audit event to `audit/events/`:

```yaml
event_id: evt-2026-0614-001
timestamp: 2026-06-14T15:30:00Z
agent: qa-tester
activity: write-integration-tests
ais_step: Verify
autonomy_level: L2
duration_seconds: 847
outcome: success
evidence:
  - tests/orders.test.js
  - tests/fixtures/sample-order.json
repo: acme-corp/order-service
```

### Maturity Score Over Time

Every time the brownfield assessor runs, it records a dated score. The metrics dashboard plots these as a time series — showing the team's journey from Foundation to Advanced tier.

### Manual → Governed Ratio

The framework tracks how many activities were performed manually (no agent involvement) vs. governed (agent with logged activity). As adoption grows, this ratio shifts — and the shift is visible on the dashboard.

### Framework Adoption Percentage

`scripts/check-adoption.mjs` scans the repo and calculates what % of framework components are in place across 8 categories: config, agents, skills, governance, docs, tests, CI, playbooks.

### GitHub-Native Collection

A weekly GitHub Actions workflow (`collect-metrics.yml`) runs automatically:
1. Reads all `audit/events/*.json` files
2. Queries the GitHub API for issue close times, PR merge times, workflow durations
3. Aggregates into a `metrics/reports/{date}.json`
4. Commits the report — durable, versionable, no external service required

### Dashboard

`website/metrics.html` — a static page that loads the latest report JSON and renders:
- KPI cards
- Agent activity bar chart
- AIS lifecycle coverage
- Autonomy distribution
- Maturity score timeline (SVG line chart)
- Framework adoption breakdown
- Governance health status

---

## How to Use It

### Collect metrics manually
```bash
npm run check-adoption
npm run collect-metrics
```

### View the dashboard
Open `website/metrics.html` in a browser after running collection.

### Automatic collection
Enable the `collect-metrics.yml` GitHub Actions workflow — it runs every Monday and on every push to main.

---

## Data Model

| File | Schema | Description |
|------|--------|-------------|
| `audit/events/*.json` | `metrics-event.schema.json` | One event per governed agent action |
| `metrics/reports/{date}.json` | `metrics-report.schema.json` | Aggregated weekly/monthly report |
| `metrics/adoption-{date}.json` | `framework-adoption.schema.json` | Adoption snapshot per date |

---

## Roadmap

| Capability | Status |
|-----------|--------|
| Audit event schema | ✅ Phase 3 |
| check-adoption.mjs | ✅ Phase 3 |
| collect-metrics.mjs | ✅ Phase 3 |
| Metrics dashboard (website) | ✅ Phase 3 |
| GitHub Actions collection workflow | ✅ Phase 3 |
| Executive PDF report export | 🔜 Phase 7 |
| Multi-repo aggregation | 🔜 Future |
| Real-time event streaming | 🔜 Future |
