# Framework Navigator — What Is This Framework and How Do I Use It?
<!-- AIS Agentic Engineering Framework | All Steps -->
<!-- Autonomy Level: L0 — Read-only orientation. No mutations. -->

## Purpose

You are helping a new user get oriented in the **AIS Agentic Engineering Framework** repository.

Your goal is to produce a **navigable summary** of the framework — what it is, what it contains, and how a user gets started — based on the actual contents of the repository.

---

## Instructions

### Step 1: Load Framework Context

Read the following files in order:

1. `README.md` — Overall framework purpose and scope
2. `.project-context/framework.md` — Detailed architecture and design principles
3. `config/aispec.config.example.yaml` — Configuration model
4. `.specify/playbooks/README.md` — Available playbooks
5. `.github/agents/` — List all agent files
6. `Skills/README.md` — Skills overview
7. `docs/extending/README.md` — Extension guide index
8. `AGENTS.md` — If present at root

If any of these files do not exist, note them as absent.

### Step 2: Inventory the Repository

Produce a complete inventory table:

```markdown
## Framework Inventory

### Agents (.github/agents/)
| Agent File | Purpose |
|---|---|
| [filename] | [one-line summary from frontmatter or first heading] |

### Brownfield Playbook Prompts (.specify/prompts/brownfield.*)
| Prompt | Autonomy | Purpose |
|---|---|---|
| [filename] | [L0/L1/L2/L3] | [one-line summary] |

### All Specify Prompts (.specify/prompts/)
| Prompt | Purpose |
|---|---|
| [filename] | [one-line summary] |

### Skills (Skills/)
| Skill | Purpose |
|---|---|
| [skill dir] | [one-line summary] |

### Schemas (framework/schemas/)
| Schema | Validates |
|---|---|
| [filename] | [what it validates] |

### Docs (docs/)
| Path | Description |
|---|---|
| docs/playbooks/ | Companion guides for brownfield playbooks |
| docs/extending/ | How to extend the framework |
| docs/guides/ | General usage guides |
| docs/input/ | Drop zone for brownfield context docs |
```

### Step 3: Produce a Getting Started Guide

Based on what you found, produce this guide:

```markdown
## Getting Started

### What Is This Framework?
[2–3 sentence summary derived from README.md and framework.md]

### Who Is It For?
- Teams adopting GitHub Copilot who want structured, governed workflows
- Engineers onboarding an existing (brownfield) repository
- Platform teams building enterprise AI standards

### The Core Model

This framework uses the **AIS Specify lifecycle**:
Intake → Specify → Design → Plan → Implement → Verify → Deploy → Report → Learn

Every agent, playbook, and governance rule maps to one or more of these steps.

### Quick Start: New to the Framework?

1. Read `README.md` for the full overview.
2. Copy `config/aispec.config.example.yaml` → `config/aispec.config.yaml`.
3. Run the brownfield assessment: `.specify/prompts/brownfield.assess.md`
4. Review the gap report and follow the recommended next steps.

### Quick Start: Adding Framework to an Existing Repository?

1. Run `brownfield.assess.md` — read-only assessment.
2. Run `brownfield.agent.catalog.md` — inventory what you have.
3. Run `brownfield.governance.init.md` — create governance config.
4. Run `brownfield.audit.trail.md` — set up audit infrastructure.
5. Run `brownfield.experiment.charter.md` — design your first experiment.

### Key Directories

| Directory | Purpose |
|---|---|
| `.specify/prompts/` | Source prompts (run these in Copilot or Claude) |
| `.specify/playbooks/` | Playbook index and template |
| `.github/agents/` | GitHub Copilot agent definitions |
| `config/` | Governance configuration |
| `framework/schemas/` | JSON Schemas for validation |
| `Skills/` | Reusable skills |
| `docs/playbooks/` | Human-readable playbook guides |
| `docs/extending/` | How to extend the framework |
| `docs/input/` | Drop zone for your team's docs |
| `audit/` | Append-only audit records |
| `experiments/` | Experiment charters and results |

### How to Ask for Help

Run `.specify/prompts/framework.explain.md` to get an explanation of any specific framework component.
Run `.specify/prompts/framework.extend.md` to get a step-by-step guide for adding something new.
```

---

## Output Format

Produce the inventory table and getting started guide in a single Markdown response.

Do not write any files. This is a read-only orientation.
