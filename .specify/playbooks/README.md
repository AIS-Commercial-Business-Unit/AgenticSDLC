# Brownfield Governance Playbooks

Playbooks in this directory are **operational runbooks for brownfield repository governance**. Each playbook is a source document used to generate or run agent prompts in supported AI surfaces (GitHub Copilot, Claude Code).

These are NOT the runnable prompts themselves — those live in `.specify/prompts/`. Playbooks here document the operational intent, pre-conditions, and usage context for each prompt.

---

## What Is a Playbook?

In the AIS Agentic Engineering Framework, a **playbook** is a governed, repeatable procedure for applying the framework to a brownfield repository. Every playbook:

- Maps to one or more AIS Specify lifecycle steps.
- Operates at a defined autonomy level (L0–L3).
- Has a source prompt in `.specify/prompts/`.
- Has a companion human-readable guide in `docs/playbooks/`.
- Never exceeds its defined autonomy level without explicit configuration change.

---

## Playbook Inventory

| Playbook | Prompt | Autonomy | Step | Description |
|---|---|---|---|---|
| Repository Assessment | `brownfield.assess.md` | L0 | Intake | Read-only AI readiness inventory and maturity scoring |
| Governance Initializer | `brownfield.governance.init.md` | L2 | Intake→Specify | Creates config, registry, catalog, audit structure |
| Agent Catalog Builder | `brownfield.agent.catalog.md` | L0 | Intake | Inventories all agents, skills, and AI automation |
| Experiment Charter | `brownfield.experiment.charter.md` | L1 | Learn→Intake | Designs hypothesis-driven experiments |
| Audit Trail Setup | `brownfield.audit.trail.md` | L2 | Intake→Learn | Creates audit infrastructure and schema |

---

## Recommended Sequence for New Repositories

1. **Start with Assessment** — Run `brownfield.assess.md` to understand where you are.
2. **Build the Agent Catalog** — Run `brownfield.agent.catalog.md` to inventory what exists.
3. **Initialize Governance** — Run `brownfield.governance.init.md` to create the config foundation.
4. **Set Up Audit Trail** — Run `brownfield.audit.trail.md` to enable auditable activity.
5. **Design Your First Experiment** — Run `brownfield.experiment.charter.md` to validate a new agent activity.

---

## Adding a New Playbook

See `docs/extending/how-to-add-a-playbook.md` for the complete process.

In summary:
1. Create the source prompt in `.specify/prompts/brownfield.[name].md`.
2. Create the Claude config in `.specify/prompts/brownfield.[name].claude.yaml`.
3. Create the companion guide in `docs/playbooks/[name].md`.
4. Update this README.
5. Add an entry to `config/aispec.config.yaml` if the playbook introduces new config fields.

---

## Template

Use `_playbook-template.md` as the starting point for new playbook source prompts.

---

*Part of the AIS Agentic Engineering Framework.*
