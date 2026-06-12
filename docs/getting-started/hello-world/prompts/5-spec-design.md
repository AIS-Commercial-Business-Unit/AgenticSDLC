# Step 5: Design the Technical Solution

## Command

| Tool | Invocation | Input |
|------|------------|-------|
| Claude Code | `/ais.spec.design` | Optional |
| GitHub Copilot | `@ais-spec-design` | Optional |
| Cursor | `/ais.spec.design` | Optional |

No additional input needed. Reads the spec, architecture, and
constitution automatically.

## What It Produces

Additions to the spec directory (`specs/YYMM-NNN-name/`):

- **design.md** — technical decisions, project structure, and a
  constitution compliance check
- **data-model.md** — entities, relationships, and persistence schema
- **research.md** — investigation of technical unknowns and trade-offs
  relevant to the spec's domain

Depending on the spec, it may also produce:
- **contracts/** — API contracts (if the spec exposes or consumes APIs)
- **quickstart.md** — developer setup instructions

The design also decides whether the spec needs `implementation-plan.md` later.
For the hello-world demo it usually will not, but larger or riskier specs can
carry that extra execution artifact through tasks and implementation.

## Why It Matters

The design bridges the gap between "what to build" (spec) and "how to
build it" (code). It forces technical decisions to be made explicitly —
not discovered during implementation. The research file investigates
real trade-offs specific to your domain, so you're not guessing at
implementation time. The constitution compliance check ensures every
design decision stays within the project's agreed standards.

## What to Look For

- The design should address technical challenges specific to the feature
  being built — check that it didn't skip the hard parts
- The data model should define concrete schemas, not abstract descriptions
- The research file should investigate genuine unknowns — this is where
  the framework digs into trade-offs you'd otherwise discover mid-build
- The constitution compliance table should show PASS for all principles;
  any FAIL needs justification
- Project structure should be simple and match your tech stack
