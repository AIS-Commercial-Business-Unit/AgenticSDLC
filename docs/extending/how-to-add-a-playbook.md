# How to Add a New Brownfield Playbook

This guide walks through the complete process of adding a new brownfield governance playbook to the AIS Agentic Engineering Framework.

A playbook exists in two places: a **source prompt** in `.specify/prompts/` and a **companion guide** in `docs/playbooks/`.

---

## Prerequisites

- `config/aispec.config.yaml` exists and is configured.
- You have reviewed the existing playbooks in `.specify/prompts/` to ensure your new playbook doesn't duplicate an existing one.
- You have identified the AIS Specify lifecycle step(s) the playbook targets.
- You have determined the appropriate autonomy level (L0–L3).

---

## Step 1: Choose a Name

Playbook names follow the pattern: `brownfield.[name]`

Examples: `brownfield.assess`, `brownfield.governance.init`, `brownfield.agent.catalog`

Choose a name that:
- Is lowercase kebab-case.
- Describes the operation, not the technology.
- Is unique within `.specify/prompts/`.

---

## Step 2: Create the Source Prompt

Create `.specify/prompts/brownfield.[name].md`.

Use the template at `.specify/playbooks/_playbook-template.md` as your starting point.

Your prompt must include:
- A comment header specifying the AIS Specify step and autonomy level.
- A `## Purpose` section.
- A `## Pre-Flight Checklist` section.
- A `## Context Loading` section specifying which config files to load.
- A discovery phase (read-only inspection).
- An action phase appropriate to the autonomy level.
- An `## Approval Gate` section (required for L2 and L3).
- A `## Post-Completion Summary` section.
- A `## Constraints and Guardrails` section listing hard constraints.

**Autonomy level checklist:**
- L0: Only read operations. No proposals. No approval gate needed.
- L1: Produces recommendations. Agent does not write. No approval gate needed.
- L2: Proposes file changes. Requires `CONFIRM` before writing. Approval gate required.
- L3: Executes within configured hard constraints. Full approval gate required.

---

## Step 3: Create the Claude Config

Create `.specify/prompts/brownfield.[name].claude.yaml`.

Required fields:
```yaml
---
description: >
  [One-line description of the playbook.]
allowed_tools:
  - read_file
  - list_directory
  # Add write_file, create_directory only if L2/L3
output_type: [markdown_report | governance_artifacts | agent_catalog_yaml | experiment_charter_markdown | audit_infrastructure]
---
```

Set `allowed_tools` conservatively:
- L0: `read_file`, `list_directory`, `search_files`, `grep`, `glob`
- L1: same as L0
- L2: add `write_file`, `create_directory`
- L3: add `execute_command` only if absolutely required and approved

---

## Step 4: Create the Companion Guide

Create `docs/playbooks/[name].md`.

The companion guide is a human-readable reference. It must include:

```markdown
# [Playbook Name]

## Purpose
[What the playbook does and why it exists.]

## When to Use
[Conditions or triggers that indicate this playbook should be run.]

## Inputs
| Input | Required | Description |

## Outputs
| Output | Path | Description |

## How to Run
[Instructions for running in GitHub Copilot and Claude Code.]

## Autonomy Level
[L0/L1/L2/L3 — explain what that means for this playbook.]

## After [Playbook Name]
[What to do next after the playbook completes.]
```

---

## Step 5: Update the Playbooks README

Add a row to the inventory table in `.specify/playbooks/README.md`:

```markdown
| [Playbook Name] | `brownfield.[name].md` | [L0/L1/L2/L3] | [Step] | [One-line description] |
```

---

## Step 6: Add a Governance Entry (If Needed)

If your playbook introduces a new governed agent activity, add an entry to `config/governance-registry.yaml`:

```yaml
- id: [kebab-case-id]
  agent: [agent-name]
  step: [Intake|Specify|Design|Plan|Implement|Verify|Deploy|Report|Learn]
  activity: [activity description]
  max_autonomy: [L0|L1|L2|L3]
  risk_level: [low|medium|high|critical]
  status: Draft
```

---

## Step 7: Test the Prompt

Test your prompt in the target surface:

### GitHub Copilot
```
@workspace Run the [name] playbook using .specify/prompts/brownfield.[name].md
```

Verify:
- [ ] The prompt loads context correctly.
- [ ] The autonomy level is respected (L0 never writes, L2 requires CONFIRM).
- [ ] The output matches the expected format.
- [ ] Approval gates work as documented.

---

## Checklist

- [ ] `.specify/prompts/brownfield.[name].md` created
- [ ] `.specify/prompts/brownfield.[name].claude.yaml` created
- [ ] `docs/playbooks/[name].md` created
- [ ] `.specify/playbooks/README.md` updated
- [ ] `config/governance-registry.yaml` updated (if applicable)
- [ ] Prompt tested in GitHub Copilot
- [ ] Output format verified

---

*Part of the AIS Agentic Engineering Framework — Extension Guides.*
