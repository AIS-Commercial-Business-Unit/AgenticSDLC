# Audit Trail Setup

## Purpose

The **Audit Trail Setup** playbook creates the audit infrastructure required before any L2 or L3 agent activity can be approved in the governance registry. It establishes an append-only, tamper-evident record of all agent actions, governance decisions, approvals, and policy evaluations.

The audit trail is a hard requirement of the AIS Agentic Engineering Framework's G4 governance layer.

---

## When to Use

- During initial governance setup (run after or alongside `brownfield.governance.init`).
- When upgrading an existing repository to L3 (Execute) governance.
- When a compliance review requires documented evidence of agent activities.
- When setting up a new experiment that requires evidence collection.

---

## What Gets Created

| Artifact | Path | Description |
|---|---|---|
| Audit directory README | `audit/README.md` | Documents structure, policy, and usage. |
| Audit records directory | `audit/records/` | Append-only storage for audit records. |
| Audit record schema | `audit/schema/audit-record.schema.json` | JSON Schema for audit records. |
| Auditable events guide | `audit/schema/auditable-events.md` | Documents all event types. |
| Retention workflow | `.github/workflows/audit-retention.yml` | Monthly check, flags aged records. |

---

## Audit Record Schema

Each audit record captures:

| Field | Type | Required |
|---|---|---|
| `id` | string | ✅ |
| `timestamp` | ISO-8601 datetime | ✅ |
| `agent` | string (catalog name) | ✅ |
| `activity` | string (registry ID) | ✅ |
| `process_step` | AIS Specify step | ✅ |
| `autonomy_level` | L0/L1/L2/L3 | ✅ |
| `action_summary` | string | ✅ |
| `outcome` | success/failure/blocked/escalated/partial | ✅ |
| `inputs` | array | — |
| `outputs` | array | — |
| `tools_called` | array | — |
| `policies_evaluated` | array | — |
| `confidence` | 0.0–1.0 | — |
| `approval` | object | — |
| `evidence` | array of paths | — |

---

## Auditable Events

The following events always produce an audit record:

| Event | Trigger |
|---|---|
| `agent_action` | Any agent-initiated mutation |
| `approval_request` | Agent requests human approval |
| `approval_granted` | Approval confirmed |
| `approval_denied` | Approval refused |
| `governance_check` | Agent evaluates a governance rule |
| `policy_violation` | Agent attempted a prohibited action |
| `experiment_started` | Experiment charter activated |
| `experiment_completed` | Experiment reached review gate |
| `phase_gate_passed` | Lifecycle step advanced |
| `phase_gate_failed` | Lifecycle step blocked |

---

## How to Run

### In GitHub Copilot

```
@workspace Set up the audit trail using .specify/prompts/brownfield.audit.trail.md
```

### In Claude Code

```bash
claude --allowedTools "read_file,list_directory,write_file,create_directory" \
  < .specify/prompts/brownfield.audit.trail.md
```

---

## Constraints

- **L2 (Prepare).** All proposed files require explicit `CONFIRM` before writing.
- `audit/records/` is **append-only**. Records must never be deleted or modified after creation.
- `audit/` must NOT be gitignored. Audit records are committed as part of the repository history.
- The retention workflow reports aged records but never deletes them automatically.

---

## After Setup

1. Update `config/aispec.config.yaml` to set `audit.enabled: true`.
2. Ensure `audit/records/.gitkeep` is committed to track the directory.
3. Reference `audit/schema/audit-record.schema.json` in agent prompts that produce records.
4. When running governed agent activities, write an audit record to `audit/records/` for each session.

---

*Part of the AIS Agentic Engineering Framework — Brownfield Governance Playbooks.*
