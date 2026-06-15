---
name: "brownfield-agent-catalog"
---
description: >
  Agent catalog builder. Inventories all agents, skills, and AI automation in an
  existing repository across all surfaces (Copilot, Claude, Cursor, GitHub Actions,
  scripts). Produces a structured agent-catalog.yaml and inventory report.
allowed_tools:
  - read_file
  - list_directory
  - search_files
  - grep
  - glob
output_type: agent_catalog_yaml
---
---

<!-- Generated from .specify/prompts/brownfield.agent.catalog.md — do not edit directly -->

# Brownfield Agent Catalog Builder
<!-- AIS Agentic Engineering Framework | AIS Specify Step: Intake -->
<!-- Autonomy Level: L0 — Read-only inventory. No files written unless explicitly confirmed. -->

## Purpose

You are inventorying all agents, skills, and AI-assisted automation in an existing repository.

Your output is a structured **agent catalog** that records every AI-involved automation surface found, plus a human-readable inventory report.

---

## Discovery Instructions

Search the repository for AI and automation across the following surfaces. For each surface, list every item found with its file path, a one-line summary of its purpose, and your assessment of whether it maps to a standard framework agent role.

Do not invent entries. Only report what you observe.

### Surface 1: GitHub Copilot Agents

**`.github/agents/`** — Scan all `.md` and `.yaml` files:
- File name
- Title / display name (from frontmatter or first heading)
- Description (from frontmatter or first paragraph)
- Tools referenced or mentioned
- AIS Specify step(s) it participates in (infer from content)
- Estimated autonomy level (L0/L1/L2/L3 — infer from whether it reads, recommends, prepares, or executes)

**`.github/copilot-instructions.md`** (or `copilot-instructions.md` at root):
- Present or absent
- If present: Is it structured (sections, headings) or freeform?
- Key rules or constraints mentioned

### Surface 2: Claude Code Commands

**`.claude/commands/`** — Scan all `.md` and `.yaml` files:
- Command name
- Description
- Allowed tools listed
- Action type (read-only / mutating)

If `.claude/` does not exist, note: "No Claude Code commands found."

### Surface 3: Cursor Rules

**`.cursor/rules/`** — Scan all rule files:
- Rule name
- Scope (file pattern or global)
- Summary of what the rule instructs

If `.cursor/` does not exist, note: "No Cursor rules found."

### Surface 4: GitHub Actions with AI/Automation

**`.github/workflows/`** — For each workflow file:
- Workflow name
- Trigger events
- Flag if it calls: GitHub Copilot, Claude, OpenAI, Azure AI, or any LLM API
- Flag if it calls custom scripts that appear AI-assisted
- Flag if it manages issues, PRs, or deployments programmatically

### Surface 5: Custom Scripts with AI Involvement

**`scripts/`**, **`tools/`**, or similar directories:
- Script name and path
- Language
- Signs of AI involvement (LLM API calls, prompt templates, AI SDK imports)

### Surface 6: MCP Server Configuration

Search for:
- `.mcp.json` files
- `mcp.json` in `.github/`, `config/`, or root
- References to `@modelcontextprotocol` in `package.json`
- MCP server entries in VS Code settings or Copilot config

For each MCP server found: name, transport type, tools exposed.

### Surface 7: Skills Directory

**`Skills/`** — For each skill:
- Skill name and directory
- `SKILL.md` present or absent
- Scripts present (list files)
- Examples present

### Surface 8: Supplemental Context from docs/input/

Check `docs/input/` for user-supplied documentation. If files are present:
- List each file
- Note any agent definitions, automation specs, or runbooks mentioned in the files
- Incorporate into the catalog as additional evidence

---

## Catalog Generation

Based on your inventory, generate a `config/agent-catalog.yaml` file conforming to `framework/schemas/agent-catalog.schema.json`.

Rules for catalog generation:
- Only include entries for agents or automation you actually found evidence of.
- Set `enabled: true` only for agents that appear to be in active use.
- Set `experimental: false` by default unless the agent file or context indicates otherwise.
- Infer `autonomy_level` conservatively: if you are unsure, choose one level lower than what the agent appears to do.
- Set `requires_approval: true` for any agent that creates issues, writes files, submits PRs, or deploys.
- Do not fabricate tools — only list tools mentioned or clearly implied by the agent's code.

Present the complete proposed `agent-catalog.yaml` before writing.

---

## Inventory Report

Produce a Markdown inventory report with:

```markdown
# Agent Catalog Report — [Repository Name]
Generated: [timestamp]

## Summary
- Total agents/automations found: N
- Surfaces covered: [list]
- Coverage gaps: [list surfaces with no automation found]

## By Surface
### GitHub Copilot Agents (N found)
...
### Claude Code Commands (N found)
...
### Cursor Rules (N found)
...
### GitHub Actions with AI (N found)
...
### MCP Servers (N found)
...
### Skills (N found)
...

## Unmapped Agents
[Agents found that do not map to a standard framework agent role]

## Recommended Additions
[Standard framework agent roles not yet represented in this repository]
```

---

## Approval Gate

Present the proposed `agent-catalog.yaml` and inventory report.

Ask:
```
→ Type WRITE to save config/agent-catalog.yaml, or SKIP to only keep the report.
  The inventory report will be displayed but not written unless you ask.
```

Write files only after explicit confirmation.
