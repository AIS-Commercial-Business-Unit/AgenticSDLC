# How to Add a New Agent

This guide walks through the process of adding a new agent definition to the AIS Agentic Engineering Framework.

Agents live in `.github/agents/` as GitHub Copilot custom agent definitions. The canonical **source prompt** lives in `.specify/prompts/`, and the agent file is generated or hand-crafted from it.

---

## Prerequisites

- You have reviewed `config/agent-catalog.yaml` to confirm the new agent doesn't duplicate an existing one.
- You have a clear single-responsibility statement for the agent.
- The agent's role maps to the AIS Specify lifecycle (it participates in at least one step).
- You have determined the appropriate default autonomy level (L0–L3).

---

## Step 1: Define the Agent in the Catalog

Before creating any files, add the agent to `config/agent-catalog.yaml`:

```yaml
- name: [kebab-case-agent-name]
  display_name: "[Human Readable Name]"
  role: [coordination|discovery|specification|architecture|planning|backend-engineering|frontend-engineering|integration|devops-platform|qa-testing|code-review|security|finops|modernization|scribe-governance|intake]
  description: "[1–3 sentences: what it does, what it owns, what it must NOT do.]"
  autonomy_level: [L0|L1|L2|L3]
  max_autonomy_level: [L0|L1|L2|L3]
  capabilities:
    - "[Capability 1]"
    - "[Capability 2]"
  allowed_tools:
    - "[tool-id-1]"
    - "[tool-id-2]"
  prohibited_actions:
    - "[action the agent must never do]"
  requires_approval: [true|false]
  approval_role: "[github-team-or-username]"
  outputs:
    - "[artifact type 1]"
    - "[artifact type 2]"
  process_steps:
    - [Intake|Specify|Design|Plan|Implement|Verify|Deploy|Report|Learn]
  enabled: false      # Start disabled. Enable after testing.
  experimental: true  # Mark as experimental until validated.
  source_prompt: ".specify/prompts/[prompt-file].md"
  agent_file: ".github/agents/[agent-file].agent.md"
```

Validate the catalog against `framework/schemas/agent-catalog.schema.json`.

---

## Step 2: Create the Source Prompt

Create `.specify/prompts/[name].md` containing the agent's instructions.

The source prompt is the canonical definition. It contains:

```markdown
# [Agent Display Name]
<!-- AIS Agentic Engineering Framework | Step: [step(s)] -->
<!-- Autonomy Level: [L0/L1/L2/L3] — [brief description] -->

## Role

[1–2 sentences describing the agent's single responsibility.]

## Context Loading

[Which files this agent reads on start.]

## Capabilities

[What the agent can do — be specific.]

## Hard Constraints

[What the agent must NEVER do — be specific.]

## Process

[Step-by-step instructions for the agent to follow.]

## Output Format

[What the agent produces and where it goes.]
```

---

## Step 3: Create the GitHub Copilot Agent File

Create `.github/agents/[name].agent.md`.

Follow the GitHub Copilot custom agent format:

```markdown
---
name: "[Agent Display Name]"
description: "[One-line description]"
---

[Agent instructions — typically derived from the source prompt, adapted for the Copilot agent format.]
```

Reference the source prompt in the agent file header:
```markdown
<!-- Source: .specify/prompts/[name].md -->
<!-- Catalog entry: config/agent-catalog.yaml#[name] -->
```

---

## Step 4: Add Governance Entries

For each activity the agent performs, add an entry to `config/governance-registry.yaml`.

See `docs/extending/how-to-add-a-governance-control.md` for the complete field guide.

At minimum, add one entry for the agent's primary activity with:
- `status: Draft`
- `max_autonomy` set to the agent's max autonomy level
- `risk_level` set conservatively

---

## Step 5: Test the Agent

Enable the agent in `config/agent-catalog.yaml`: `enabled: true`

Test in GitHub Copilot:
1. In the repository, open Copilot Chat.
2. Reference the agent by name: `@[agent-name]`
3. Ask it to perform its primary activity.

Verify:
- [ ] Agent loads context correctly.
- [ ] Agent respects its autonomy level (L0 never writes, L2 requires approval).
- [ ] Prohibited actions are not performed.
- [ ] Output matches the format defined in the source prompt.

---

## Step 6: Document the Agent

Create or update `docs/guides/agents/[name].md` with:
- Agent purpose and role
- AIS Specify steps it participates in
- Inputs and outputs
- Autonomy level and approval requirements
- Example usage

---

## Step 7: Update the Agent Catalog Status

After successful testing:
```yaml
enabled: true
experimental: false  # Only after governance entry is Approved
```

---

## Checklist

- [ ] Agent added to `config/agent-catalog.yaml`
- [ ] Source prompt created: `.specify/prompts/[name].md`
- [ ] Agent file created: `.github/agents/[name].agent.md`
- [ ] Governance entries added to `config/governance-registry.yaml`
- [ ] Agent tested in GitHub Copilot
- [ ] `enabled: true` set after testing
- [ ] Documentation created

---

*Part of the AIS Agentic Engineering Framework — Extension Guides.*
