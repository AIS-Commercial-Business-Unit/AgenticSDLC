# Step 1: Synthesize Client Needs

## Command

| Tool | Invocation | Input |
|------|------------|-------|
| Claude Code | `/ais.presales.synthesize` | Optional |
| GitHub Copilot | `@ais-presales-synthesize` | Optional |
| Cursor | `/ais.presales.synthesize` | Optional |

No additional input needed. The command reads everything in
`.project-context/` automatically — the RFP and the discovery transcript.

## What It Produces

`specs/.presales/01-what-we-heard.md` — a structured mirror of the client's
needs, written for the client to review and confirm.

## Why It Matters

The what-we-heard document forces alignment before any solution work
begins. It mirrors back what the client said — in their language, with
source citations — so both sides can confirm understanding. Misalignment
caught here costs nothing to fix. Misalignment caught during
implementation costs weeks.

## What to Look For

- **Source classification** — Each input should be classified by authority
  tier (T1 = contractual, T2 = client-authored, T4 = transcription, etc.).
  Authority tiers determine how much weight each source carries in
  downstream decisions.

- **Business problem** — Should capture both the stated problem and any
  implied gaps the framework inferred from context. The implied gaps are
  where the value is — things the client may not have articulated.

- **Desired outcomes** — Measurable outcomes with priority and source
  attribution. Every outcome should trace to something the client said.

- **Capability areas** — Requirements grouped into logical clusters, not
  just listed. This grouping previews how proposed specs will be decomposed
  in the proposal.

- **Constraints** — Timeline, technology, budget, security, users. These
  constrain the solution space and directly inform phasing and ROM.

- **QA vs. QC questions** — QA questions (AIS-answerable) should have
  reasonable assumptions with confidence levels. QC questions (need
  client input) should be genuine blockers, not things AIS can assume.

- **Proposal Gate** — Reports PASS or WARN. Must-pass items: business
  problem understood, outcomes identified, capabilities described,
  client contact known.

## After This Step

In a real engagement, share `01-what-we-heard.md` with the client to confirm
understanding before proceeding. Any corrections go back into
`.project-context/` and you re-run the command.
