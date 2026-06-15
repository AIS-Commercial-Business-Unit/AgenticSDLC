# Agent Catalog Builder

## Purpose

The **Agent Catalog Builder** inventories all agents, skills, and AI-assisted automation in an existing repository across every supported surface (GitHub Copilot, Claude Code, Cursor, GitHub Actions, custom scripts, MCP servers, and Skills).

It produces a structured `config/agent-catalog.yaml` and a human-readable inventory report.

---

## When to Use

- After completing governance initialization to document what agents exist.
- When auditing a repository for AI coverage before a governance review.
- When onboarding a team that has existing agents and you need to bring them under the framework.
- Periodically to detect new automation that has been added without governance enrollment.

---

## Surfaces Covered

| Surface | Path Pattern | What's Captured |
|---|---|---|
| GitHub Copilot Agents | `.github/agents/*.md` | Agent definitions |
| Copilot Instructions | `.github/copilot-instructions.md` | Global instructions |
| Claude Code Commands | `.claude/commands/` | Command files |
| Cursor Rules | `.cursor/rules/` | Rule files |
| GitHub Actions (AI) | `.github/workflows/*.yml` | Workflows invoking LLMs |
| Custom Scripts | `scripts/`, `tools/` | Scripts with AI involvement |
| MCP Servers | `.mcp.json`, `mcp.json` | MCP server configs |
| Skills | `Skills/` | Skill directories |
| Supplemental Docs | `docs/input/` | User-supplied context |

---

## Inputs

| Input | Required | Description |
|---|---|---|
| Target repository | ✅ Required | Repository to inventory. |
| `docs/input/` docs | Optional | Existing automation docs, runbooks. |

---

## Outputs

| Output | Path | Description |
|---|---|---|
| Agent catalog | `config/agent-catalog.yaml` | Structured catalog (optional write). |
| Inventory report | Displayed in chat | Markdown summary by surface. |

---

## How to Run

### In GitHub Copilot

```
@workspace Run the agent catalog builder using .specify/prompts/brownfield.agent.catalog.md
```

### In Claude Code

```bash
claude --allowedTools "read_file,list_directory,search_files,grep,glob" \
  < .specify/prompts/brownfield.agent.catalog.md
```

---

## After the Catalog

1. Review the generated `config/agent-catalog.yaml` and correct any misclassified autonomy levels.
2. Note any **unmapped agents** — automation found that doesn't map to a standard framework role.
3. Note any **recommended additions** — standard framework roles with no coverage.
4. Use the catalog as input for `brownfield.governance.init` if governance registration is next.

---

*Part of the AIS Agentic Engineering Framework — Brownfield Governance Playbooks.*
