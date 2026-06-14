# framework/agents/

This directory contains the canonical YAML definition files for every standard agent in
the AIS Agentic Engineering Framework. One file per agent.

## What Is an Agent Definition?

An agent definition describes **what an agent is authorised to do**, not how it is
implemented. Each file is a `AgentEntry` object conforming to
[`framework/schemas/agent-catalog.schema.json`](../schemas/agent-catalog.schema.json).

Key fields in every definition:

| Field | Purpose |
|---|---|
| `name` | Unique kebab-case identifier referenced by governance registry entries |
| `role` | Functional role from the framework role enum |
| `autonomy_level` | Default operating autonomy level (L0–L3) |
| `max_autonomy_level` | Hard ceiling — the agent may never exceed this |
| `allowed_tools` | Explicit allowlist; agents must not invoke tools not listed |
| `prohibited_actions` | Things the agent must never do, regardless of instruction |
| `requires_approval` | Whether outputs require human sign-off before becoming authoritative |
| `governance_entries` | IDs of governance-registry.yaml entries that govern this agent |

## Autonomy Levels

| Level | Meaning |
|---|---|
| L0 | Observe and report only. No writes. |
| L1 | Recommend. Produces drafts for human review. |
| L2 | Prepare. Produces ready-to-approve artifacts; human approves before action. |
| L3 | Execute. May act autonomously within a narrowly defined, pre-approved scope. |

## Standard Agents (16)

| File | Display Name | Role | Max Autonomy |
|---|---|---|---|
| `architect.yaml` | Architecture Agent | architecture | L1 |
| `specification.yaml` | Specification Agent | specification | L2 |
| `planning.yaml` | Planning Agent | planning | L2 |
| `backend-developer.yaml` | Backend Developer Agent | backend-engineering | L3 |
| `frontend-developer.yaml` | Frontend Developer Agent | frontend-engineering | L2 |
| `integration-developer.yaml` | Integration Developer Agent | integration | L2 |
| `qa-tester.yaml` | QA and Test Agent | qa-testing | L3 |
| `code-reviewer.yaml` | Code Review Agent | code-review | L1 |
| `security.yaml` | Security Agent | security | L2 |
| `devops-platform.yaml` | DevOps and Platform Agent | devops-platform | L3 |
| `modernization.yaml` | Modernization Agent | modernization | L1 |
| `finops.yaml` | FinOps Agent | finops | L1 |
| `scribe-governance.yaml` | Scribe and Governance Agent | scribe-governance | L3 (logging only) |
| `workflow-coordinator.yaml` | Workflow Coordinator Agent | coordination | L2 |
| `brownfield-assessor.yaml` | Brownfield Assessor Agent | intake | L0 |
| `experiment-runner.yaml` | Experiment Runner Agent | discovery | L3 |

## How to Add a New Agent

See [`docs/guides/how-to-add-an-agent.md`](../../docs/guides/how-to-add-an-agent.md) for
the full guide. Summary:

1. Create a new YAML file in this directory named `{agent-name}.yaml`.
2. Populate all required fields from the schema (validate with `npm run validate-schemas`).
3. Add governance registry entries in `framework/templates/governance-registry.yaml`.
4. Reference the governance entry IDs in the agent's `governance_entries` field.
5. Add a source prompt in `.specify/prompts/`.
6. Open a PR targeting `dev` with label `squad:scribe-governance` for audit trail.

## Validation

```bash
npm run validate-schemas
```

This validates all YAML files in this directory against `agent-catalog.schema.json`.
