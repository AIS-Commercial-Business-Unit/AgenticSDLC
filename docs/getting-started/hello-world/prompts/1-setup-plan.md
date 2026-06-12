# Step 1: Generate the Project Plan

## Command

| Tool | Invocation | Input |
|------|------------|-------|
| Claude Code | `/ais.setup.plan` | Optional |
| GitHub Copilot | `@ais-setup-plan` | Optional |
| Cursor | `/ais.setup.plan` | Optional |

No additional input needed. The command reads everything in
`.project-context/` automatically.

## What It Produces

`specs/.project-plan/` with several files:

- **01-charter.md** — project overview, goals, and success criteria
- **02-risks-and-decisions.md** — risk register: what could go wrong, what's undecided
- **03-context-sources.md** — traceability back to the raw inputs that informed each decision

Plus `specs/YYMM-NNN-name/spec.md` directories — one per spec, each with
initial scope, dependencies, and effort in YAML frontmatter.

## Why It Matters

The spec directories are the backbone of everything that follows. They take raw
requirements and decompose them into named, scoped, dependency-ordered
components — each of which becomes a spec you can independently design,
task, and implement.

## What to Look For

- The spec directories should decompose the brief into logical components,
  each with a clear scope boundary
- Dependencies between specs (in frontmatter) should make sense — foundation
  components have no dependencies, higher-level features depend on them
- Effort estimates should be proportional to scope
- The risk register should flag genuine unknowns, not boilerplate

Open a few `spec.md` files and look at the frontmatter dependencies.
One page of requirements just became a structured delivery plan.
