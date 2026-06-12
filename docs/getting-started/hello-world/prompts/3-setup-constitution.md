# Step 3: Ratify the Constitution

## Command

| Tool | Invocation | Input |
|------|------------|-------|
| Claude Code | `/ais.setup.constitution` | Optional |
| GitHub Copilot | `@ais-setup-constitution` | Optional |
| Cursor | `/ais.setup.constitution` | Optional |

No additional input needed. Reads the architecture seed.

## What It Produces

`specs/constitution.md` containing:

- **Principles** — non-negotiable standards derived from the project's
  requirements and constraints
- **Technology Standards** — the chosen stack, locked in
- **Quality Gates** — testable thresholds that every implementation must pass
- **Integration Patterns** — how components communicate, persist data,
  manage state

## Why It Matters

The constitution is the project's "immune system." Every future spec design
gets checked against these standards. If a design violates a principle, it
must either comply or explicitly justify the exception. This prevents drift
as the project grows — the standards you set now hold across all specs.

## What to Look For

- Principles should trace back to requirements and constraints from the
  brief — not generic best practices, but standards specific to this project
- Quality gates should be testable, not aspirational (e.g., a measurable
  threshold, not "be fast")
- The constitution should feel proportional to the project — small projects
  get lean governance, complex projects get more structure
- Technology standards should match the architecture decisions from Step 2
