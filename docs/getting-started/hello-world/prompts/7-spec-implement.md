# Step 7: Implement

## Command

| Tool | Invocation | Input |
|------|------------|-------|
| Claude Code | `/ais.spec.implement` | Optional |
| GitHub Copilot | `@ais-spec-implement` | Optional |
| Cursor | `/ais.spec.implement` | Optional |

No additional input needed. Reads tasks, design, data model, and
constitution.

## What It Produces

- Working source code in `source/`
- Tests in `tests/`
- Every task in `tasks.md` marked `[x]`
- Spec status updated to Complete only after tasks, review gates, constitution
  gates, and fresh validation evidence pass

## Why It Matters

This is where everything comes together. The implementation command
executes tasks phase-by-phase, respecting the dependency order from the
task list. It writes code that matches the project structure from the
design, uses the data model as defined, and enforces constitution
standards throughout. The result is code that traces all the way back
to the original requirements — nothing invented, nothing forgotten.
If implementation hits a repeated or unclear failure, route through
`/ais.maintain.debug` to diagnose root cause before applying more fixes.

## What to Look For

- The code should match the project structure from `design.md`
- File paths should match what the task list specified
- Tests should pass when you run them
- The app should actually work — open it and try the core features
- Review/evidence gates should show what was checked before completion
- If `implementation-plan.md` exists, its progress and retrospective sections
  should match what actually happened during implementation

## After Implementation

Run the app and verify it works end-to-end. The specific commands depend
on your tech stack (check the design or quickstart docs), but the key
test is: does it do what the spec said it should do?

That's a working app built from a one-page brief, with full traceability
at every layer.
