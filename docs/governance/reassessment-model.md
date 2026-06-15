# Governance Reassessment Date Model

This document explains how review dates work in `framework/templates/governance-registry.yaml`,
what overdue and due-soon mean, and the workflow for conducting a reassessment.

---

## Overview

Every entry in `governance-registry.yaml` has a **review date** — the date by which the
entry must be re-examined by a human to confirm it is still accurate, safe, and appropriate
for the current risk environment. The review date is not a suggestion; it is a governance
control.

---

## Fields

| Field | Purpose |
|---|---|
| `review_due_at` | ISO-8601 date (`YYYY-MM-DD`) when the next review must be completed. **Preferred field.** |
| `review_date` | Alias for `review_due_at`. Accepted for compatibility; prefer `review_due_at` in new entries. |
| `review_interval_days` | How many days between reviews for this entry. Default cadence is 90 days. High-risk entries (e.g., `security-scan-vulnerabilities`) use 30 days. |
| `last_assessed_at` | ISO-8601 date-time of the last completed review. Updated after each reassessment. |
| `review_state` | Computed state: `current` \| `due-soon` \| `review-due` \| `overdue`. |

---

## Status Definitions

### ✅ Current

`review_due_at` is **more than 30 days** in the future.

The governance entry has been reviewed within its required interval and no action is needed.

### 🔔 Due Soon

`review_due_at` is **within the next 30 days** (inclusive of today).

The entry will require review soon. The governance team should schedule the reassessment
before the date passes.

**Script indicator:** `🔔` marker appears next to the date in `summary-grid.md`.

### ⚠️ Overdue

`review_due_at` is **in the past** (before today's date).

The entry has not been reviewed within its required interval. This is a governance gap.
The agent activities governed by this entry should not be treated as fully authoritative
until the entry is reassessed and `review_due_at` is updated.

**Script indicator:** `⚠️` marker appears next to the date in `summary-grid.md`.

---

## Reassessment Workflow

### Who Triggers a Reassessment?

The **owner** field in each governance entry identifies the responsible person or team.
The `workflow-coordinator-agent` checks for overdue and due-soon entries during the
Report step and raises escalation notices when entries fall into those states.

The `generate-governance-grid.mjs` script is also run as part of CI and will surface
overdue/due-soon counts in the output.

### What Does a Reassessment Involve?

1. **Read the entry.** Review all fields: `max_autonomy`, `risk_level`, `allowed_tools`,
   `prohibited_actions`, `approval_requirements`, `confidence_threshold`, `required_evidence`.

2. **Check for incidents.** Review the audit trail (`audit/events/`) for any failures,
   rejections, or anomalies involving this entry's agent and activity since the last
   assessment.

3. **Validate the risk level.** Has the risk environment changed? New CVEs, architecture
   changes, or regulatory updates may warrant a risk level upgrade.

4. **Confirm or adjust the autonomy level.** Has the agent demonstrated enough successful
   executions to warrant a higher `current_autonomy`? Or have failures suggested it should
   be reduced?

5. **Update the entry.** Edit `governance-registry.yaml`:
   - Update `last_assessed_at` to today's ISO-8601 date-time.
   - Update `review_due_at` to today + `review_interval_days`.
   - Update `review_state` to `current`.
   - Change `status` to `Approved` if previously `Draft` and review passes.
   - Change `approved_by` and `approved_at` if the approver changes.

6. **Regenerate the grid.**
   ```bash
   npm run governance-grid
   ```

7. **Commit and PR.** Open a PR to `dev` with the updated registry and regenerated grid.
   Label it `governance` and `squad:scribe-governance`. The scribe-governance-agent
   logs the reassessment as an audit event.

### Escalation

If an overdue entry cannot be reassessed within **14 days** of its `review_due_at`:

- The `workflow-coordinator-agent` must notify the engineering manager.
- The entry's `review_state` should be updated to `overdue` if not already.
- The agent's activities governed by the entry must operate at the next-lower autonomy level
  until reassessment is complete (e.g., if `max_autonomy` is L3, operate at L2).

---

## Script Indicators

The `generate-governance-grid.mjs` script applies the following indicators in
`docs/governance/summary-grid.md`:

| Indicator | Condition | Meaning |
|---|---|---|
| `⚠️` | `review_due_at` < today | **Overdue** — must be reassessed immediately |
| `🔔` | `review_due_at` ≤ today + 30 days | **Due soon** — reassess before the date |
| _(none)_ | `review_due_at` > today + 30 days | **Current** — no action needed |

The JSON output at `docs/governance/summary-grid.json` includes `overdue` and `due_soon`
boolean flags per entry, plus the `governance_health` summary object for dashboard use.

---

## Setting the Initial Review Date

For new entries, set `review_due_at` to:

```
today + review_interval_days
```

Standard intervals by risk level:

| Risk Level | Default Interval |
|---|---|
| low | 90 days |
| medium | 90 days |
| high | 90 days |
| critical | 30 days |

High-frequency or security-sensitive entries should use shorter intervals regardless
of the default.
