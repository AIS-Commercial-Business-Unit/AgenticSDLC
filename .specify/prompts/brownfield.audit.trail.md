# Brownfield Audit Trail Setup
<!-- AIS Agentic Engineering Framework | AIS Specify Step: Intake → Learn -->
<!-- Autonomy Level: L2 — Prepare. All proposed files require explicit human approval before writing. -->

## Purpose

You are setting up the **audit trail infrastructure** in a brownfield repository.

The audit trail is the append-only, tamper-evident record of all agent actions, governance decisions, approvals, and policy evaluations. It is required before any L2 or L3 agent activity is approved.

---

## Pre-Flight Checks

1. Does `audit/` directory exist? If yes, show current structure.
2. Does `config/aispec.config.yaml` exist? If yes, load `audit` section.
3. Does `.github/workflows/` exist? List any existing audit-related workflows.
4. Check `.gitignore` — is `audit/` excluded? (It must NOT be gitignored.)

Report pre-flight results before proceeding.

---

## Discovery

Load context:
- `config/aispec.config.yaml` (for `audit.enabled`, `audit.directory`, `audit.retention_days`, `audit.auditable_events`)
- Existing `.github/workflows/` to understand current workflow patterns

---

## Proposed Artifacts

Generate and present the following artifacts for review:

### File 1: `audit/README.md`

```markdown
# Audit Trail

This directory contains append-only audit records for all governed agent activities
in this repository.

## Structure

audit/
  README.md           — This file
  records/            — Audit records (one file per event or session)
  schema/             — Audit record schema definitions

## Record Naming Convention

Records are named: YYYY-MM-DD_HH-MM-SS_[agent]_[activity].json
Example: 2026-06-01_14-30-00_architecture-agent_design-review.json

## Audit Policy

- Records are APPEND-ONLY. Existing records must never be modified or deleted.
- Records are stored in plain JSON for readability and tooling compatibility.
- Retention: [from config.yaml audit.retention_days] days.
- Tamper-evident: [from config.yaml audit.tamper_evident]

## What Constitutes an Auditable Event

See schema/auditable-events.md for the complete list.

Key event categories:
- agent_action: Any agent-initiated action (file write, issue creation, PR)
- approval_request: Agent requesting human or policy approval
- approval_granted: Approval confirmed
- approval_denied: Approval refused (reason required)
- governance_check: Agent evaluating a governance rule before acting
- policy_violation: Agent attempted a prohibited action (blocked)
- experiment_started: New experiment charter activated
- experiment_completed: Experiment reached review gate
- phase_gate_passed: AIS Specify lifecycle step advanced
- phase_gate_failed: Lifecycle step advancement blocked
```

### File 2: `audit/schema/audit-record.schema.json`

Generate a JSON Schema 2020-12 for the audit record with these fields:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "...",
  "title": "AIS Agent Audit Record",
  "type": "object",
  "required": ["id", "timestamp", "agent", "activity", "process_step", "action_summary", "outcome", "autonomy_level"],
  "properties": {
    "id": { "type": "string", "description": "Unique record ID (UUID or timestamp-based)." },
    "timestamp": { "type": "string", "format": "date-time" },
    "agent": { "type": "string", "description": "Agent name from agent-catalog." },
    "activity": { "type": "string", "description": "Governance registry activity ID." },
    "process_step": {
      "type": "string",
      "enum": ["Intake","Specify","Design","Plan","Implement","Verify","Deploy","Report","Learn"]
    },
    "autonomy_level": { "type": "string", "enum": ["L0","L1","L2","L3"] },
    "action_summary": { "type": "string", "description": "Concise description of what the agent did." },
    "inputs": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Artifacts or data consumed."
    },
    "outputs": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Artifacts or data produced."
    },
    "tools_called": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Tool IDs invoked during this activity."
    },
    "policies_evaluated": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Governance registry entry IDs evaluated."
    },
    "confidence": {
      "type": ["number", "null"],
      "minimum": 0.0,
      "maximum": 1.0
    },
    "risk_level": { "type": "string", "enum": ["low","medium","high","critical"] },
    "approval": {
      "type": "object",
      "properties": {
        "required": { "type": "boolean" },
        "requested_from": { "type": ["string","null"] },
        "result": { "type": "string", "enum": ["granted","denied","not_required","pending"] },
        "approved_by": { "type": ["string","null"] },
        "approved_at": { "type": ["string","null"], "format": "date-time" }
      }
    },
    "outcome": {
      "type": "string",
      "enum": ["success","failure","blocked","escalated","partial"]
    },
    "failure_reason": { "type": ["string","null"] },
    "evidence": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Links or paths to evidence artifacts."
    },
    "session_id": { "type": ["string","null"] },
    "correlation_id": { "type": ["string","null"] }
  }
}
```

### File 3: `audit/schema/auditable-events.md`

Document all auditable event types with:
- Event name
- When it fires
- Who/what produces it
- What fields are required
- Example record

Include all event types from `config.yaml audit.auditable_events`.

### File 4: `.github/workflows/audit-retention.yml`

Generate a GitHub Actions workflow that:
- Runs on schedule (monthly)
- Reads `audit/records/` directory
- Reports the total count of audit records
- Flags records older than `retention_days` for archival (does NOT delete — only reports)
- Outputs a summary to the workflow run log

```yaml
name: Audit Trail Retention Check
on:
  schedule:
    - cron: '0 8 1 * *'  # Monthly on the 1st
  workflow_dispatch:

jobs:
  audit-retention:
    runs-on: ubuntu-latest
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@v4
      - name: Count audit records
        run: |
          COUNT=$(find audit/records -name "*.json" 2>/dev/null | wc -l)
          echo "Total audit records: $COUNT"
      - name: Flag aged records
        run: |
          RETENTION_DAYS=365  # Override from aispec.config.yaml
          CUTOFF=$(date -d "-${RETENTION_DAYS} days" +%Y-%m-%d 2>/dev/null || date -v-${RETENTION_DAYS}d +%Y-%m-%d)
          echo "Records older than $CUTOFF (retention: ${RETENTION_DAYS} days):"
          find audit/records -name "*.json" -not -newer "audit/records" | head -20 || echo "None found or feature not supported"
          echo "Note: Records are NEVER deleted automatically. Review and archive manually."
```

---

## Approval Gate

Present summary of all proposed files:

```
Proposed audit trail infrastructure:
  ✅ audit/README.md
  ✅ audit/records/.gitkeep
  ✅ audit/schema/audit-record.schema.json
  ✅ audit/schema/auditable-events.md
  ✅ .github/workflows/audit-retention.yml

→ Type CONFIRM to write all files, or CANCEL to abort.
  Type SKIP [filename] to exclude a specific file.
```

Do not write any file until `CONFIRM` is received.

---

## Post-Setup

After writing:

1. Verify `audit/` is NOT in `.gitignore`.
2. Confirm `audit/records/` is committed (with `.gitkeep`).
3. Advise the user: "Audit records should be committed after each governed agent session."
4. Provide next-step guidance:
   - Update `config/aispec.config.yaml` to set `audit.enabled: true`.
   - Reference the schema in agent prompts that produce audit records.
