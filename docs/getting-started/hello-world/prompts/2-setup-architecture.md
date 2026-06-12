# Step 2: Synthesize the Architecture

## Command

| Tool | Invocation | Input |
|------|------------|-------|
| Claude Code | `/ais.setup.architecture` | Optional |
| GitHub Copilot | `@ais-setup-architecture` | Optional |
| Cursor | `/ais.setup.architecture` | Optional |

No additional input needed. Reads the project plan and context files.

## What It Produces

`specs/.architecture/` with several files including:

- **02-system-design.md** — C4 diagrams (Mermaid) showing system containers and components
- **03-domain-model.md** — bounded contexts and how they relate
- **06-tech-stack.md** — decided vs. proposed technology choices
- **07-decisions.md** — Architecture Decision Records (ADRs)
- **08-constitution-seed.md** — governance recommendations for the next step

## Why It Matters

The architecture translates the project plan into technical decisions. It
locks in the system shape (what containers exist, how they communicate)
and records the trade-offs behind each choice as ADRs. Every spec design
later must be consistent with these decisions.

## What to Look For

- The system design should match the complexity of the project — a simple
  project should produce a simple architecture, not an over-engineered one
- Tech stack should reflect the preferences from your `.project-context/` files
- ADRs should document real trade-offs, not rubber-stamp obvious choices
- The architecture should be proportional — if it looks like it was designed
  for a different scale of project, the framework is doing too much

The Mermaid diagrams render in any Markdown preview. The C4 container
diagram makes the architecture tangible at a glance.
