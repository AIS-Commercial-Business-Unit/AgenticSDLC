# How to Add a Governance Control

This guide walks through the process of adding a new governance control entry to `config/governance-registry.yaml`.

A governance control defines the rules under which a specific agent activity is permitted to operate — including its autonomy level, risk classification, tool allowlist, approval requirements, and evidence requirements.

---

## Prerequisites

- You have a specific agent activity you need to govern.
- The agent performing the activity exists in `config/agent-catalog.yaml`.
- You understand the autonomy level appropriate for the activity (see below).
- You have identified any approval requirements.

---

## Autonomy Level Reference

| Level | Name | What the Agent May Do |
|---|---|---|
| L0 | Observe | Read, inspect, analyze, classify, report findings only. No mutations. |
| L1 | Recommend | Produce recommendations and proposals. Agent does NOT perform the action. |
| L2 | Prepare | Draft artifacts, prepare PRs/issues. Requires human approval before authoritative. |
| L3 | Execute | Perform explicitly authorized actions within hard constraints. Never unrestricted. |

**Default rule:** Start at L1. Increase autonomy only after an experiment validates the activity.

---

## Risk Level Reference

| Risk | Description | Examples |
|---|---|---|
| low | Read-only or clearly reversible | Repository scan, report generation, context loading |
| medium | Mutating but recoverable | Draft file creation, issue preparation, branch creation |
| high | Hard to reverse or business-impacting | PR merging, configuration changes, deployment preparation |
| critical | Potentially irreversible or regulated | Production deployment, secret changes, data deletion, compliance |

---

## Step 1: Draft the Entry

Add a new entry to `config/governance-registry.yaml`:

```yaml
- id: [kebab-case-unique-id]            # Unique identifier. Pattern: [agent-short-name]-[activity-slug]
  agent: [agent-name]                   # Must match name in agent-catalog.yaml
  step: [AIS Specify step]              # Intake|Specify|Design|Plan|Implement|Verify|Deploy|Report|Learn
  activity: "[Activity description]"    # Human-readable activity name
  summary: "[What the agent does]"      # 1–2 sentences describing the activity
  max_autonomy: [L0|L1|L2|L3]          # Maximum permitted autonomy level
  current_autonomy: [L0|L1|L2|L3]      # Currently active level (start lower, increase via experiment)
  risk_level: [low|medium|high|critical]
  allowed_tools:
    - [tool-id-1]
    - [tool-id-2]
  prohibited_actions:
    - "[Action the agent must never perform in this activity]"
  required_inputs:
    - "[Artifact that must exist before this activity starts]"
  required_evidence:
    - "[Evidence artifact that must be produced and stored]"
  approval_requirements:
    - type: [human|policy|automated]
      approver_role: "[github-username or team slug]"
      required: [true|false]
      timeout_hours: null               # null = no timeout; set integer for timeout
  confidence_threshold:
    recommend: 0.60                     # Override global default if needed
    prepare: 0.75
    execute: 0.90
  policy_source: "[path/to/policy/or/specification]"
  status: Draft                         # Always start as Draft. Promote to Approved after review.
  completeness_pct: 0                   # Update as you fill in fields
  approved_by: null
  approved_at: null
  last_assessed_at: null
  review_interval_days: 180
  review_due_at: null
  review_state: current
  owner: "[github-username]"
  notes: "[Any outstanding assumptions or open questions]"
```

---

## Step 2: Set the Approval Requirements

For each activity, determine whether human approval is required before the activity's outputs become authoritative.

**Require human approval when:**
- The activity produces artifacts that affect other people's work (code, issues, deployments).
- The risk level is high or critical.
- The autonomy level is L2 or L3.
- The activity is in a regulated or sensitive area (security, compliance, production).

**Do not require approval when:**
- The activity is purely read-only (L0).
- The activity produces only recommendations that the human will evaluate separately (L1).

---

## Step 3: Set Evidence Requirements

Evidence requirements ensure the agent produced verifiable proof of its work.

For each activity, define at least one evidence item:
- L0: Report file or observation summary
- L1: Recommendation document
- L2: Draft artifact file path
- L3: Execution log with inputs, outputs, and approval record

---

## Step 4: Validate the Entry

Validate the entry against `framework/schemas/governance-registry.schema.json`:

```bash
# Using AJV (Node.js)
node scripts/validate-config.js --schema framework/schemas/governance-registry.schema.json \
  --file config/governance-registry.yaml
```

Or use a YAML/JSON Schema validator in your IDE.

---

## Step 5: Review and Promote

New entries start with `status: Draft`. Before promoting to `Approved`:

1. Have the designated `owner` review all fields for accuracy.
2. Verify that `allowed_tools` are actually needed (principle of least privilege).
3. Verify `prohibited_actions` cover all high-risk actions the agent could theoretically take.
4. Confirm approval requirements match actual team expectations.
5. Set `approved_by`, `approved_at`, and `last_assessed_at` when promoting.
6. Set `review_due_at` to `approved_at + review_interval_days`.

Only entries with `status: Approved` are considered active governance controls.

---

## Step 6: Schedule Reassessment

All approved entries must be reassessed on their `review_interval_days` schedule.

The framework's governance reassessment workflow (`.github/workflows/`) reads `review_due_at` and creates review issues when entries are due.

Ensure:
- `review_interval_days` is set (default: 180).
- `review_due_at` is calculated and set when the entry is approved.

---

## Checklist

- [ ] New entry added to `config/governance-registry.yaml`
- [ ] `id` is unique and follows kebab-case pattern
- [ ] `agent` matches an entry in `config/agent-catalog.yaml`
- [ ] `step` is a valid AIS Specify lifecycle step
- [ ] `max_autonomy` and `current_autonomy` are set appropriately
- [ ] `allowed_tools` lists only tools actually needed
- [ ] `prohibited_actions` covers high-risk agent capabilities
- [ ] `required_evidence` lists at least one evidence artifact
- [ ] `approval_requirements` match team expectations
- [ ] Schema validation passes
- [ ] Entry reviewed and set to `Approved` after review

---

*Part of the AIS Agentic Engineering Framework — Extension Guides.*
