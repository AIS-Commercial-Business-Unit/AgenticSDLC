# Governance Initializer

## Purpose

The **Governance Initializer** playbook sets up the complete AIS Agentic Engineering Framework governance foundation in a brownfield repository. It creates the configuration files, governance registry, agent catalog, and audit directory structure that all subsequent framework activities depend on.

This playbook operates at **L2 (Prepare)** — it proposes all changes and requires explicit human approval before writing any file.

---

## When to Use

- After completing a brownfield assessment (`brownfield.assess.md`) that shows missing governance config.
- When onboarding a new repository to the framework for the first time.
- When resetting or rebuilding governance configuration after a major change.

---

## Inputs

| Input | Required | Description |
|---|---|---|
| Completed brownfield assessment | Recommended | Provides maturity level and gap context. |
| `config/aispec.config.example.yaml` | ✅ Required | Template used to generate the live config. |
| User answers to initialization questions | ✅ Required | Owner, autonomy level, approvers, provider, etc. |
| `docs/input/` supplemental docs | Optional | Architecture docs, existing process docs. |

---

## Outputs

| Output | Path | Description |
|---|---|---|
| Framework config | `config/aispec.config.yaml` | Populated governance config for this repository. |
| Governance registry | `config/governance-registry.yaml` | Initial set of governed agent activities. |
| Agent catalog | `config/agent-catalog.yaml` | Catalog of all agents with capabilities and tool grants. |
| Audit directory | `audit/records/` | Append-only audit record storage. |

---

## How to Run

### In GitHub Copilot

```
@workspace Run the governance initializer using .specify/prompts/brownfield.governance.init.md
```

The agent will ask you a series of configuration questions, present the proposed files for review, and wait for your `CONFIRM` before writing anything.

### In Claude Code

```bash
claude --allowedTools "read_file,list_directory,write_file,create_directory" \
  < .specify/prompts/brownfield.governance.init.md
```

---

## Approval Gate

This playbook **will not write any file without your explicit confirmation.**

When the agent has generated all proposals, it will display a summary and ask you to type `CONFIRM` to proceed or `CANCEL` to abort.

You may also type `EDIT [filename]` to review and change any proposed file before writing.

---

## Autonomy Level

**L2 — Prepare.** The agent drafts artifacts and prepares proposed file changes, but requires human approval before any file becomes authoritative.

---

## After Initialization

Once initialization is complete:

1. **Review the governance registry.** Open `config/governance-registry.yaml` and promote entries from `Draft` to `Approved` as your team validates them.
2. **Run `brownfield.agent.catalog`** to inventory all existing agents in detail.
3. **Commit** the `config/` and `audit/` directories to your repository.
4. **Run `brownfield.experiment.charter`** to design your first improvement experiment.

---

*Part of the AIS Agentic Engineering Framework — Brownfield Governance Playbooks.*
