# Step 6: Break Down into Tasks

## Command

| Tool | Invocation | Input |
|------|------------|-------|
| Claude Code | `/ais.spec.tasks` | Optional |
| GitHub Copilot | `@ais-spec-tasks` | Optional |
| Cursor | `/ais.spec.tasks` | Optional |

No additional input needed. Reads all design artifacts.

## What It Produces

`specs/YYMM-NNN-name/tasks.md` — a dependency-ordered checklist organized
into phases:

- **Phase 1: Setup** — project scaffolding, config, dependencies
- **Phase 2: Foundation** — core logic and data layer
- **Phase 3+: User Stories** — one phase per story, with goals
- **Final Phase: Polish** — accessibility, edge cases, hardening

Each task follows the format: `- [ ] T001 [P] [US1] Description`

For larger or riskier specs, this step may also create
`specs/YYMM-NNN-name/implementation-plan.md` — a living implementation guide
with milestones, validation steps, and recovery notes.

## Why It Matters

The task list is the bridge between design and code. Every task traces
back to a user story, which traces back to the spec, which traces back
to the brief. This traceability means nothing gets built that wasn't
asked for, and nothing that was asked for gets forgotten. The dependency
ordering means the implementation command knows what to build first.

## What to Look For

- Tasks should be in dependency order — foundation before features
- `[P]` marks tasks that can run in parallel within a phase
- `[US#]` links every feature task to a user story from the spec
- Each task names the exact file path where code goes
- The consistency check at the bottom shows spec-to-task coverage —
  every requirement should map to at least one task
