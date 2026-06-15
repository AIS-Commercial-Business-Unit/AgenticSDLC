# [Playbook Name]
<!-- AIS Agentic Engineering Framework | AIS Specify Step: [Step] -->
<!-- Autonomy Level: [L0/L1/L2/L3] — [Brief description of what the agent does/doesn't do] -->
<!-- Source Prompt: .specify/prompts/brownfield.[name].md -->
<!-- Claude Config: .specify/prompts/brownfield.[name].claude.yaml -->
<!-- Companion Guide: docs/playbooks/[name].md -->

## Purpose

[One paragraph explaining what this playbook does and why it exists in the context of brownfield governance.]

---

## Pre-Flight Checklist

Before proceeding, verify:

1. [Check 1 — e.g., required config files exist]
2. [Check 2 — e.g., required permissions]
3. [Check 3 — e.g., supplemental docs loaded]

Report pre-flight results before proceeding. Stop if any required check fails.

---

## Context Loading

Load the following context before acting:

- `config/aispec.config.yaml` — [which sections are relevant]
- `config/governance-registry.yaml` — [why needed]
- `config/agent-catalog.yaml` — [why needed]
- `docs/input/` — check for supplemental user-supplied context

---

## Discovery Phase (Read-Only)

[Describe what the agent reads and inventories before doing anything. This section should always be read-only.]

---

## [Action Phase Name]

[Describe what the agent proposes or does. If L2, this section proposes — does not write.]

---

## Approval Gate

<!-- Required for L2 and L3 playbooks. Remove for L0 and L1. -->

Present a summary of all proposed changes:

```
Proposed actions:
  ✅ [Action 1]
  ✅ [Action 2]

→ Type CONFIRM to proceed, or CANCEL to abort.
  Type SKIP [item] to exclude a specific action.
```

**Do not execute any mutating action until the user types CONFIRM.**

---

## Execution Phase (Post-Approval Only)

<!-- For L2/L3 only. Remove for L0/L1. -->

After `CONFIRM`:

1. [Step 1]
2. [Step 2]
3. Verify each output and report completion.

---

## Post-Completion Summary

Provide a summary:

```
[Playbook name] complete.

Files written: N
Next steps:
1. [Recommended follow-on action]
2. [Link to next playbook if applicable]
```

---

## Constraints and Guardrails

- [Hard constraint 1 — things this playbook must NEVER do]
- [Hard constraint 2]
- [When in doubt, describe the escalation behavior]
