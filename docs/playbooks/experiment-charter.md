# Experiment Charter

## Purpose

The **Experiment Charter** playbook designs a structured, hypothesis-driven agentic engineering experiment for a brownfield team. Experiments validate new agent activities before they are enrolled in the governance registry as approved practices.

This playbook ensures experiments are time-bounded, have clear success and failure criteria, and produce evidence that can be reviewed at a defined gate date.

---

## When to Use

- When your team wants to try a new agent activity but it is not yet in the governance registry.
- When increasing the autonomy level of an existing activity and you want evidence before approving the change.
- When a previous experiment succeeded and you want to design the next increment.
- When the governance registry has entries in "Not Assessed" or "Draft" status that need validation evidence.

---

## Inputs

| Input | Required | Description |
|---|---|---|
| `config/aispec.config.yaml` | ✅ Required | Governance settings and experiment configuration. |
| `config/governance-registry.yaml` | Recommended | Existing governed activities to avoid duplication. |
| `config/agent-catalog.yaml` | Recommended | Available agents and current autonomy levels. |
| User answers to scoping questions | ✅ Required | Objective, hypothesis, success/failure criteria. |

---

## Outputs

| Output | Path | Description |
|---|---|---|
| Experiment charter | `experiments/[slug]-charter.md` | Structured charter with all required fields. |

---

## Charter Structure

Each charter includes:
- **Metadata** — ID, status, dates, assigned agent, autonomy level
- **Objective** — What the experiment validates
- **Hypothesis** — Testable if/then/because statement
- **Scope** — In-scope and out-of-scope boundaries
- **Success Criteria** — Measurable pass conditions (all must be true)
- **Failure Criteria** — Stop conditions (any triggers experiment halt)
- **Required Tools** — Explicit tool allowlist for the experiment
- **Required Evidence** — What must be collected to evaluate the hypothesis
- **Metrics** — Cycle time, rework rate, approval rate, token usage
- **Duration and Review Gate** — Start, end, and review date
- **Governance Implications** — What happens to the registry if success or failure

---

## How to Run

### In GitHub Copilot

```
@workspace Design an experiment charter using .specify/prompts/brownfield.experiment.charter.md
```

### In Claude Code

```bash
claude --allowedTools "read_file,list_directory,search_files" \
  < .specify/prompts/brownfield.experiment.charter.md
```

---

## After the Charter

1. Save the charter to `experiments/[slug]-charter.md`.
2. Get sign-off from the designated reviewer before starting.
3. Collect evidence during the experiment window into `experiments/[slug]/runs/`.
4. At the review gate date, assess against success/failure criteria.
5. If successful: promote the activity to the governance registry.
6. If failed: write lessons learned and update the registry with "Not Assessed" status.

---

*Part of the AIS Agentic Engineering Framework — Brownfield Governance Playbooks.*
