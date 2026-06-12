# Step 2: Generate the Proposal

## Command

| Tool | Invocation | Input |
|------|------------|-------|
| Claude Code | `/ais.presales.propose` | Optional |
| GitHub Copilot | `@ais-presales-propose` | Optional |
| Cursor | `/ais.presales.propose` | Optional |

No additional input needed. The command reads `01-what-we-heard.md` and
automatically selects a playbook based on the engagement type. You can
also specify one explicitly (e.g., `/ais.presales.propose Use the custom-applications playbook`).

## What It Produces

`specs/.presales/02-proposal.md` — a solution proposal with proposed specs,
phasing, technology approach, and ROM.

## Why It Matters

The proposal turns understanding (01-what-we-heard) into a solution approach.
Proposed specs are preliminary scope components — each one becomes a
delivery spec (YYMM-NNN) at kickoff. The proposal also introduces
phasing, so the client sees not just what you'll build but in what order
and why. The ROM gives them a cost frame before committing to a SOW.

## What to Look For

- **Playbook influence** — The proposal should draw from the selected
  playbook's patterns: typical spec decomposition, architecture patterns,
  estimation heuristics, and domain-specific risks. If the playbook doesn't
  match, the proposal may feel generic.

- **Proposed specs** — Each proposed spec should have a clear scope
  boundary. They should decompose the project logically — not too granular
  (one per feature) or too coarse (one giant spec). Look for natural
  boundaries.

- **Dependency sketch** — Mermaid diagram showing which proposed specs depend
  on which. Foundation components should have no dependencies; higher-level
  features should depend on them.

- **Phasing** — Should align with the client's timeline constraints.
  Phase 1 delivers the foundation, later phases build on it. Phasing
  should make sense given the dependencies.

- **Technology approach** — Should reflect the client's stated preferences
  and constraints, informed by the playbook's recommendations.

- **ROM** — Should align with the client's budget expectations. If it
  doesn't, the proposal should flag the gap explicitly.

- **Risks** — Should include both domain-specific risks (from the playbook)
  and client-specific risks (from the discovery). Generic risks are a
  sign the framework didn't engage with the actual project.

- **SOW Gate** — Reports PASS or WARN. Key: at least 2 proposed specs,
  phasing defined, technology identified.

## After This Step

In a real engagement, share the proposal with the client for alignment.
Their feedback may resolve open questions and refine the approach before
moving to SOW.
