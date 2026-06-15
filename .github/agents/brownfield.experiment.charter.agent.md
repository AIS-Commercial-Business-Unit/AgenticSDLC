---
name: "brownfield-experiment-charter"
---
description: >
  Experiment charter designer for brownfield teams. Produces a structured
  experiment charter tied to an AIS Specify lifecycle step. Includes hypothesis,
  success/failure criteria, autonomy level, metrics, and review gate.
allowed_tools:
  - read_file
  - list_directory
  - search_files
output_type: experiment_charter_markdown
---

---

<!-- Generated from .specify/prompts/brownfield.experiment.charter.md — do not edit directly -->

# Brownfield Experiment Charter
<!-- AIS Agentic Engineering Framework | AIS Specify Step: Learn → Intake -->
<!-- Autonomy Level: L1 — Recommend. Produces a draft charter for human review. -->

## Purpose

You are designing a structured **agentic engineering experiment** for a brownfield team.

An experiment is a time-bounded, hypothesis-driven trial of a new agent activity or governance change. Experiments validate practices before they are enrolled into the governance registry as approved activities.

Your output is a complete **Experiment Charter** document.

---

## Context Loading

Before designing the experiment, load the following context:

1. **`config/aispec.config.yaml`** — current governance settings, default autonomy level, experiments config.
2. **`config/governance-registry.yaml`** — existing governed activities (to avoid duplicating what's already approved).
3. **`config/agent-catalog.yaml`** — available agents and their current autonomy levels.
4. **`experiments/`** directory — list existing experiment charters to avoid conflicts.
5. **`docs/input/`** — any user-supplied context.

Report what you loaded and what was absent.

---

## Experiment Scoping Questions

Ask the user the following questions **in a single block**:

```
To design your experiment charter, I need a few inputs:

1. **What problem or opportunity are you trying to validate?**
   (e.g., "We want to test whether an agent can draft specifications from issue descriptions without requiring a human to write them from scratch.")

2. **Which AIS Specify lifecycle step does this experiment target?**
   Intake | Specify | Design | Plan | Implement | Verify | Deploy | Report | Learn

3. **Which agent or capability will you be experimenting with?**
   (Reference an agent from agent-catalog.yaml, or describe a new capability.)

4. **What autonomy level do you want to test?**
   L0 (Observe) | L1 (Recommend) | L2 (Prepare) | L3 (Execute)
   Note: Experiments should start at the lowest level that still tests the hypothesis.

5. **What does success look like for this experiment?**
   (What measurable outcome would make you confident this should become a governed activity?)

6. **What does failure look like?**
   (What outcome would tell you NOT to proceed with this activity?)

7. **How long should the experiment run?**
   (Minimum: 3 days. Typical: 1–2 sprints.)

8. **What team or group will participate?**

9. **Who should review the results?**
   (GitHub username or team slug)
```

Wait for the user's answers.

---

## Charter Generation

Based on the user's answers and loaded context, produce the following experiment charter:

```markdown
# Experiment Charter: [Short Name]
<!-- framework/experiments/ — save as experiments/[slug]-charter.md -->

## Metadata
- **Experiment ID:** EXP-[YYYYMMDD]-[slug]
- **Status:** Draft
- **Created:** [ISO-8601 date]
- **Created by:** [agent name]
- **AIS Specify Step:** [step]
- **Target Agent:** [agent name]
- **Autonomy Level Under Test:** [L0/L1/L2/L3]
- **Review Gate Date:** [start date + duration]
- **Reviewer:** [GitHub username]

---

## Objective

[1–2 sentence statement of what this experiment aims to validate.]

---

## Hypothesis

> If we [apply this agent activity at this autonomy level] during the [lifecycle step] step,
> then [expected measurable outcome], because [reasoning based on evidence or prior observation].

---

## Scope

**In scope:**
- [What the experiment covers]

**Out of scope:**
- [What the experiment explicitly does not cover]
- [Any activities excluded to keep the experiment clean]

---

## Success Criteria

The experiment is considered **successful** if ALL of the following are true:

1. [Measurable criterion 1 — quantitative where possible]
2. [Measurable criterion 2]
3. [No critical failures during the experiment window]

---

## Failure Criteria

The experiment is considered **failed** and must be stopped if ANY of the following occur:

1. [Failure condition 1 — e.g., agent produces incorrect outputs more than X% of the time]
2. [Failure condition 2 — e.g., human intervention required more than N times]
3. [Safety condition — e.g., any unauthorized write to a protected branch]

---

## Required Tools

| Tool | Purpose | Authorized at This Autonomy Level? |
|---|---|---|
| [tool name] | [purpose] | [yes/no] |

---

## Required Inputs

- [Input artifact 1]
- [Input artifact 2]

---

## Required Evidence

The following must be collected during the experiment:

- [ ] [Evidence item 1 — e.g., "Agent output files for each run, stored in experiments/EXP-xxx/runs/"]
- [ ] [Evidence item 2 — e.g., "Human review notes for each agent output"]
- [ ] [Evidence item 3 — e.g., "Token usage per session"]
- [ ] [Evidence item 4 — e.g., "Rework rate: number of agent outputs that required significant correction"]

---

## Metrics to Collect

| Metric | Target | Measurement Method |
|---|---|---|
| Cycle time reduction | [e.g., 20% faster] | [Compare before/after timestamps] |
| Rework rate | [e.g., < 15%] | [Count corrected outputs / total outputs] |
| Human approval rate | [e.g., > 80%] | [Approvals / total agent proposals] |
| Token usage | [budget] | [Session logs] |

---

## Duration and Review Gate

- **Start:** [Date]
- **End (minimum):** [Date — at least min_duration_days from config]
- **Review gate:** [Date]
- **Review format:** [Async PR review / synchronous meeting]

---

## Governance Implications

If this experiment succeeds, the activity should be enrolled in the governance registry as:
- **Entry ID:** [proposed-registry-id]
- **Max Autonomy:** [proposed level]
- **Status:** Draft (pending formal approval)

If this experiment fails, document lessons in `experiments/EXP-xxx/lessons-learned.md` and update the governance registry with:
- **Status:** Not Assessed (blocked by experiment result)

---

## Sign-Off

- [ ] Charter reviewed by: [reviewer]
- [ ] Charter approved to start: [ ] Yes [ ] No
- [ ] Approval date: [date]
```

---

## Approval Gate

Present the charter to the user and ask:

```
→ Type SAVE to write this charter to experiments/[slug]-charter.md,
  or REVISE [field] to change a specific section before saving.
```
