# audit/

This directory contains the **immutable audit trail** for all governed agent activities
in the AIS Agentic Engineering Framework. It is the primary evidence store for governance,
metrics, and compliance purposes.

---

## Structure

```
audit/
└── events/           ← one YAML file per governed activity execution
    └── .keep         ← placeholder; real events live alongside this file
```

---

## What Gets Written Here?

An audit event is written for every governed agent activity — that is, any activity
with an entry in `framework/templates/governance-registry.yaml`. The event captures:

- **Who acted**: the agent name
- **What they did**: activity name and AIS Specify step
- **At what autonomy level**: L0 / L1 / L2 / L3
- **The outcome**: success, failure, pending-approval, approved, rejected, or skipped
- **Evidence**: paths to artifacts produced
- **Human approval**: GitHub username if human approval was given
- **Duration**: how long the activity took
- **Session**: framework workflow session ID for traceability

Each event conforms to [`framework/schemas/metrics-event.schema.json`](../framework/schemas/metrics-event.schema.json).

---

## Who Writes Events?

The **scribe-governance-agent** writes audit events autonomously at L3 (logging only).
This is the only L3 activity approved for that agent. See:
- [`framework/agents/scribe-governance.yaml`](../framework/agents/scribe-governance.yaml)
- [`framework/skills/audit-logger.yaml`](../framework/skills/audit-logger.yaml)
- Governance entry: `scribe-log-audit-event`

---

## File Naming Convention

```
{YYYY-MM-DDTHH-MM-SSZ}-{first-8-chars-of-event-id}.yaml
```

Example: `2026-06-14T150000Z-550e8400.yaml`

The timestamp is when the event was emitted (UTC). The event ID prefix ensures
uniqueness when multiple events are emitted in the same second.

---

## Append-Only Constraint

Audit events **must never be modified or deleted** after they are created. This is a
hard governance requirement. The `.gitattributes` file uses `merge=union` on
`audit/events/` to prevent merge conflicts on concurrent writes:

```gitattributes
audit/events/** merge=union
```

Any PR that modifies (not adds) files under `audit/events/` must be rejected.

---

## How to Read Events

### Manual inspection

```bash
cat audit/events/2026-06-14T150000Z-550e8400.yaml
```

### Using the metrics-collector skill

```yaml
skill: metrics-collector
inputs:
  period_start: "2026-06-01T00:00:00Z"
  period_end:   "2026-06-30T23:59:59Z"
```

### Generating a governance report

```bash
npm run governance-grid
```

This reads all events via the summary grid script and produces
`docs/governance/summary-grid.md` and `docs/governance/summary-grid.json`.

---

## Retention

Audit events are committed to the repository permanently. There is no automated
deletion. If storage becomes a concern, archive older events to Azure Blob Storage
using the archive playbook at `docs/playbooks/audit-archive.md` (to be created).

---

## Example Event

```yaml
$schema: https://ais.com/agentic-sdlc/framework/schemas/metrics-event.schema.json
event_id: 550e8400-e29b-41d4-a716-446655440000
timestamp: "2026-06-14T15:00:00Z"
agent: backend-developer-agent
activity: Implement REST API Endpoint
ais_step: Implement
autonomy_level: L2
duration_seconds: 142
outcome: pending-approval
evidence:
  - src/main/java/com/ais/api/OrderController.java
  - src/test/java/com/ais/api/OrderControllerTest.java
human_approved_by: null
repo: AIS-Commercial-Business-Unit/Middleware
session_id: session-2026-06-14-001
governance_entry_id: backend-implement-api
metadata:
  pr_number: "42"
  branch: squad/101-order-api
```
