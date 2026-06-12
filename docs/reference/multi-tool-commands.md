# Multi-Tool Command Generation

The AIS commands (`/ais.setup.*`, `/ais.spec.*`, etc.) are written once and
generated for four AI coding tools: **Claude Code**, **GitHub Copilot**,
**Cursor**, and **Codex**.

## How It Works

Shared prompt files in `.specify/prompts/` are the single source of truth.
A Bash script assembles them with tool-specific metadata into each tool's
native format.

```
Source of truth                           Generated output
─────────────────                         ──────────────────
.specify/repo-instructions.md       ───►  CLAUDE.md
                                    ───►  AGENTS.md (Copilot Coding Agent + Codex)

.specify/prompts/{name}.md          ─┬►  .claude/commands/{name}.md
.specify/prompts/{name}.claude.yaml  │    (YAML frontmatter: description, handoffs)
                                     ├►  .github/agents/{name}.agent.md
                                     │    (agent frontmatter: name, description)
                                     ├►  .cursor/skills/{name}/SKILL.md
                                     │    (plain markdown, invoked as /name skill)
                                     └►  .agents/skills/{name}/SKILL.md
                                          (skill frontmatter + markdown, invoked via $skill or /skills)
```

Every generated file has a "do not edit directly" comment at the top.

### How Each Tool Uses the Output

| Tool | Repo instructions | Per-command format | Activation |
|------|------------------|--------------------|------------|
| **Claude Code** | `CLAUDE.md` | `.claude/commands/*.md` with YAML frontmatter | `/ais.*` slash commands |
| **GitHub Copilot** | `AGENTS.md` | `.github/agents/*.agent.md` with name/description/handoffs frontmatter | Agent dropdown in Copilot Chat; handoffs enable agent-to-agent flow |
| **Codex** | `AGENTS.md` | `.agents/skills/{name}/SKILL.md` with skill frontmatter (`name`, `description`) | `$ais.*` skill mention, `/skills`, or implicit skill matching |
| **Cursor** | `.cursor/skills/` | `.cursor/skills/{name}/SKILL.md` | `/ais.*` slash commands (Skills) |

## Editing a Command

1. Edit the prompt body in `.specify/prompts/{name}.md`.
2. If tool-specific metadata needs changing, edit the sidecar:
   - `.claude.yaml` — description, handoffs, allowed-tools
   - `.copilot.yaml` — agent name, description, tools, handoffs (optional; defaults derived from `.claude.yaml`)
3. Regenerate:

   ```bash
   bash .specify/scripts/bash/generate-commands.sh
   ```

4. Commit all changed files (source + generated).

## Editing Repo-Level Instructions

1. Edit `.specify/repo-instructions.md`.
2. Regenerate (same command as above).
3. Commit `CLAUDE.md`, `AGENTS.md`, and the source file.

## Adding a New Command

1. Create the prompt body:

   ```
   .specify/prompts/ais.new.command.md
   ```

2. Create the Claude frontmatter sidecar:

   ```yaml
   # .specify/prompts/ais.new.command.claude.yaml
   description: "One-line description of what it does."
   ```

   Optional fields: `allowed-tools`, `handoffs` (see existing files for
   examples).

3. Optionally create a Copilot sidecar to override agent defaults:

   ```yaml
   # .specify/prompts/ais.new.command.copilot.yaml
   name: "custom-agent-name"
   description: "Custom description for Copilot."
   tools: ["read", "edit", "search"]
   ```

   If no `.copilot.yaml` exists, the agent name is derived from the filename
   (dots → hyphens), and `description` and `handoffs` are carried over from
   the Claude sidecar (with agent names converted to hyphens). Tools default
   to all available.

4. Regenerate and commit.

## CI Validation

Run with `--check` to verify generated files are up to date without
modifying anything:

```bash
bash .specify/scripts/bash/generate-commands.sh --check
```

Exits `0` if everything is current, `1` if any file is stale or missing.
Add this to your CI pipeline or pre-commit hook to prevent direct edits
to generated files from going unnoticed.

## File Reference

### Source files (edit these)

| Path | Role |
|------|------|
| `.specify/repo-instructions.md` | Shared repo-level instructions |
| `.specify/prompts/*.md` | Shared command prompt bodies |
| `.specify/prompts/*.claude.yaml` | Claude frontmatter and shared description source (description, handoffs, allowed-tools) |
| `.specify/prompts/*.copilot.yaml` | Copilot agent overrides — optional (name, description, tools) |
| `.specify/scripts/bash/generate-commands.sh` | The generator script |

### Generated files (do not edit directly)

| Path | Tool | Format reference |
|------|------|-----------------|
| `CLAUDE.md` | Claude Code | [CLAUDE.md docs](https://www.anthropic.com/engineering/claude-code-best-practices) |
| `AGENTS.md` | Copilot Coding Agent, Codex | [Codex AGENTS.md docs](https://developers.openai.com/codex/guides/agents-md) |

| `.claude/commands/*.md` | Claude Code slash commands | [Slash commands docs](https://docs.anthropic.com/en/docs/claude-code/slash-commands) |
| `.github/agents/*.agent.md` | Copilot custom agents | [Custom agents docs](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/coding-agent/create-custom-agents) |
| `.agents/skills/{name}/SKILL.md` | Codex Skills | [Codex skills docs](https://developers.openai.com/codex/skills) |
| `.cursor/skills/{name}/SKILL.md` | Cursor Skills (slash commands) | [Cursor Skills docs](https://docs.cursor.com/context/skills) |
