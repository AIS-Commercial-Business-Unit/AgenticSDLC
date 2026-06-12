# Step 4: Specify the First Feature

## Command

| Tool | Invocation | Input |
|------|------------|-------|
| Claude Code | `/ais.spec.specify` | `{feature description}` |
| GitHub Copilot | `@ais-spec-specify` | `{feature description}` |
| Cursor | `/ais.spec.specify` | `{feature description}` |

Unlike the setup commands, `/ais.spec.specify` does not auto-detect what
to build. You must pass it either:

- A **spec name or ID from the catalog** (e.g., `Focus Timer` or
  `2603-001`) — it looks up the scope from the project plan
- An **ad-hoc feature description** in your own words

For this demo, we're building the **Timer Engine** — the first spec on
the critical path. Use the catalog name or the prompt below as input.

## Input Prompt

> The core Pomodoro timer for FocusFlow. Start, pause, resume, and
> cancel focus sessions. 25-minute work intervals with 5-minute short
> breaks and 15-minute long breaks after 4 sessions. Visual countdown
> display. Audio/visual notification on completion. Auto-start options
> for breaks and next work sessions. This is the first spec from the
> project plan — the foundation that everything else builds on.

## What It Produces

> **Spec IDs are date-derived.** The `YYMM` prefix reflects the current
> year-month when you run the command (e.g., `2603` for March 2026). Your
> actual directory name will vary.

`specs/YYMM-NNN-name/` with:

- **spec.md** — user stories, functional requirements, success criteria,
  and YAML frontmatter tracking status/owner/priority
- **checklists/requirements.md** — quality checklist

## Why It Matters

The spec translates a feature description into testable requirements. User
stories define behavior from the user's perspective. Functional requirements
make each behavior concrete and verifiable. The framework also surfaces
edge cases and ambiguities — things you'd normally discover during
implementation when they're expensive to fix.

## What to Look For

- User stories should cover the core behaviors described in the input
- Functional requirements should be specific and testable, not vague
- Edge cases the framework catches — these are where the value is. Look
  for scenarios you hadn't considered.
- Clarification questions (if any) should be genuinely useful — they're
  the framework catching ambiguities before they become bugs

## Beyond the Demo

### Where specs come from

The spec lifecycle is designed for iterative development. You don't need
to specify every feature upfront — run it again for each new piece of
work as the project progresses.

- **From the project plan.** `/ais.setup.plan` creates spec directories under
  `specs/` — each with an initial `spec.md` containing scope, dependencies,
  and effort estimates. Pick the next spec and hand its name to `/ais.spec.specify`.

- **From scratch.** Describe the feature yourself. The framework doesn't
  require a catalog entry — you can specify anything that fits the project.

### Sub-specs

When a spec grows too large or you need to break off a distinct concern
from an existing spec, use the `--parent` flag:

```
/ais.spec.specify --parent YYMM-NNN {description of the sub-concern}
```

This creates a child spec (e.g., `2603-001.1`) linked to the
parent. The framework checks whether the parent has been implemented:

- **Parent not yet built** — it asks whether you'd rather update the
  parent spec instead of creating a sub-spec.
- **Parent partially or fully built** — proceeds with the sub-spec,
  which gets its own branch, directory, and full lifecycle
  (`design` -> `tasks` -> `implement`).

Sub-specs are useful when a feature is already implemented but needs
an extension, or when the project plan flags a large spec with
potential sub-spec candidates.

### When things change

- **`/ais.maintain.clarify` (project level)** — Feed it new context
  (a revised SOW, meeting transcript, or deferred decision) and it
  surgically updates the project plan and architecture without
  regenerating them.

- **`/ais.maintain.clarify` (spec level)** — Run it on a feature branch
  to resolve ambiguities through targeted questions, integrating answers
  directly into the spec.
