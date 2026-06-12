# Step 3: Produce the SOW

## Command

| Tool | Invocation | Input |
|------|------------|-------|
| Claude Code | `/ais.presales.scope` | Optional |
| GitHub Copilot | `@ais-presales-scope` | Optional |
| Cursor | `/ais.presales.scope` | Optional |

No additional input needed. The command reads the 02-proposal and
01-what-we-heard documents.

If the client provided feedback on the proposal, add it to
`.project-context/` before running this step — the command picks up
new context files automatically.

## What It Produces

`specs/.presales/03-sow.md` — a formal Statement of Work with deliverables,
acceptance criteria, formal proposed spec catalog, milestones, and the
delivery bridge.

## Why It Matters

The SOW is the contractual bridge between pre-sales and delivery. It
formalizes the proposed specs from the proposal into a catalog with explicit
scope, out-of-scope, dependencies, and effort. It also defines the
delivery bridge — the mechanism that turns proposed specs into
YYMM-NNN delivery specs at project kickoff. When `/ais.setup.plan`
runs, it reads the SOW as a T1 (contractual) source and creates spec
directories automatically.

## What to Look For

- **Deliverables table** — Each deliverable should have a clear
  description, acceptance criteria (how the client validates it's done),
  and mapping to proposed spec(s).

- **Spec catalog** — Each entry should now be formal:
  purpose, scope, out-of-scope, dependencies, effort, and deliverable
  mapping.

- **Out of scope** — Should explicitly exclude things the client might
  assume are included. Clear out-of-scope items prevent scope creep
  and set expectations.

- **Responsibilities** — AIS responsibilities vs. client responsibilities.
  The client should have concrete obligations (access, reviewers, test
  users) — not just "provide feedback."

- **Milestones** — Should align with the timeline from the RFP. Each
  milestone maps to specific deliverables and proposed specs.

- **Delivery bridge** — The "Delivery Methodology" section explains how
  proposed specs become YYMM-NNN delivery specs when
  `/ais.setup.plan` runs at kickoff.

- **Delivery Gate** — The command will ask you to confirm whether the SOW
  is "signed." For the demo, confirm yes to see a PASS result. In real
  engagements, this happens after client approval.

## After This Step

### Transition to Delivery

Once the SOW is signed, the pre-sales pipeline is complete. To continue
into delivery:

1. Run `/ais.setup.plan` — it reads `03-sow.md` as a T1 (contractual) source
   and creates YYMM-NNN delivery spec directories.

2. Run `/ais.setup.architecture` and `/ais.setup.constitution` as normal.

3. Start the spec lifecycle on the first unblocked delivery spec.

See the [Hello World demo](../../hello-world/) for a walkthrough of the
delivery workflow from this point forward.

### The Full Pipeline

Across both demos, the complete flow looks like:

```
Pre-Sales:  synthesize → propose → scope
Setup:      plan → architecture → constitution
Per-Spec:   specify → design → tasks → implement
Reporting:  standup · status · project
```

Ten commands cover the entire engagement lifecycle — from raw client
signals to working code to status reports.
