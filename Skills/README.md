# Skills

This directory contains [Agent Skills](https://agentskills.io) — portable, version-controlled folders that give AI agents specialized capabilities. Each skill bundles instructions, scripts, reference materials, and assets that an agent loads on demand to perform a specific task.

## Format

Skills follow the open [Agent Skills specification](https://agentskills.io/specification):

```text
skill-name/
├── SKILL.md          # Required: metadata (name, description) + instructions
├── scripts/          # Optional: executable code
├── references/       # Optional: documentation
├── assets/           # Optional: templates, schemas, resources
└── ...               # Any additional files
```

Agents discover skills by reading the `name` and `description` from each `SKILL.md` frontmatter at startup. When a task matches, the agent loads the full instructions and executes the skill's workflow — scripts, file reads, and all.

## Available Skills

| Skill | Description |
|-------|-------------|
| [`ais-branding-docx`](ais-branding-docx/SKILL.md) | Generate AIS-branded Word documents (.docx) from structured JSON input. Supports 13 content types including TOC, tables, code blocks, and nested lists. |
| [`ais-branding-pptx`](ais-branding-pptx/SKILL.md) | *Implicit* — Always active when creating presentations or documents. Enforces AIS brand identity: color palette, typography, logo placement, layout system, and premium design standards. |
| [`ais-proposal-docx`](ais-proposal-docx/SKILL.md) | Generate AIS-branded proposal Word documents (.docx) from structured JSON input. Fills a branded template preserving exact formatting and built-in styles. |
| [`ais-proposal-redline-docx`](ais-proposal-redline-docx/SKILL.md) | Modify existing proposal Word drafts by merging red-draft content into pink DOCX forms while preserving formatting, reviewer comments, tracked changes, and comment-response traceability. |
| [`ais-spec-upgrade`](ais-spec-upgrade/SKILL.md) | Upgrade copied AIS Spec framework files in an existing project repo by comparing versions, reading the changelog, detecting drift, prompting for a decision, and applying safe updates. |

## Creating a New Skill

1. Create a directory under `Skills/` matching the skill name (lowercase, hyphens only).
2. Add a `SKILL.md` with required frontmatter (`name`, `description`) and instructions.
3. Bundle any scripts, references, or assets the skill needs.
4. Test with a compatible agent (e.g., Claude Code, GitHub Copilot, Cursor).
5. Update the table above.

See the [Agent Skills quickstart](https://agentskills.io/skill-creation/quickstart) and [best practices](https://agentskills.io/skill-creation/best-practices) for guidance.
