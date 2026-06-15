# Framework Explainer — Explain This Framework Component
<!-- AIS Agentic Engineering Framework | All Steps -->
<!-- Autonomy Level: L0 — Read-only explanation. No mutations. -->

## Purpose

You are explaining a specific component of the AIS Agentic Engineering Framework to a user.

Your goal is to give a clear, accurate, reference-grounded explanation of what the component is, what it does, what its inputs and outputs are, and how it relates to other components.

---

## Input

The user has specified a framework component they want explained. It may be provided as:
- A file name or path (e.g., `brownfield.assess.md`, `config/aispec.config.yaml`)
- A concept name (e.g., "governance registry", "autonomy levels", "agent catalog", "experiment charter")
- A directory name (e.g., `.specify/prompts/`, `framework/schemas/`)
- An agent name (e.g., "architecture-agent", "finops-agent")

**Component to explain:** [User provides this — ask if not provided]

---

## Instructions

### Step 1: Locate the Component

Search the repository for the component:

- If it is a file path: read the file directly.
- If it is a concept: search `README.md`, `.project-context/framework.md`, and relevant config/schema files.
- If it is a directory: list the contents and read the README if present.
- If it is an agent name: find it in `.github/agents/` and `config/agent-catalog.yaml`.

### Step 2: Load Cross-References

For the located component, identify and load any files it references or is referenced by:

- Schema files (`framework/schemas/*.json`)
- Config files (`config/aispec.config.yaml`, `config/governance-registry.yaml`)
- Related prompts (`.specify/prompts/`)
- Companion docs (`docs/playbooks/`, `docs/extending/`)

### Step 3: Produce the Explanation

Generate a structured explanation using this template:

```markdown
# [Component Name]

## What It Is

[2–4 sentences describing the component's identity and role in the framework.]

## Why It Exists

[1–3 sentences explaining the problem this component solves or the requirement it fulfills.]

## AIS Specify Step(s)

[Which lifecycle step(s) this component participates in: Intake | Specify | Design | Plan | Implement | Verify | Deploy | Report | Learn]

## Autonomy Level

[L0/L1/L2/L3 — explain what that means for this component specifically.]

## Inputs

| Input | Required | Source |
|---|---|---|
| [Input name] | ✅/Optional | [Where it comes from] |

## Outputs

| Output | Type | Destination |
|---|---|---|
| [Output name] | [file/report/artifact] | [Where it goes] |

## Key Fields / Structure

[If this is a config or schema, describe the most important fields.
 If this is a prompt, describe its phases.
 If this is an agent, describe its capabilities and constraints.]

## Relationships

- **Depends on:** [other components this needs]
- **Feeds into:** [other components that consume this component's output]
- **Governed by:** [governance registry entries, if applicable]

## How to Use

[Step-by-step instructions for using this component, specific to its type.]

## Extension Point

[How to extend or customize this component. Link to docs/extending/ if applicable.]

## Source Location

- Primary file: `[path]`
- Schema: `[path to schema if applicable]`
- Companion guide: `[path if applicable]`

## Example

[Minimal example showing the component in use, if applicable.]
```

---

## Output Constraints

- Base your explanation **only on what you find in the repository**. Do not fabricate details.
- If a component is partially implemented (stub, placeholder), say so clearly.
- If a component references something that does not exist yet, note it as "not yet created."
- Produce the explanation as a clean Markdown document.
- Do not write any files.
