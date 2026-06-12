# Pre-Sales Demo: FocusFlow

Scope a team productivity tool from an RFP to a signed SOW.

---

## The Scenario

A client has sent an RFP for a **team focus timer** — a Pomodoro-style
app for their engineering team. They want to structure deep work sessions,
tag time to projects, and understand focus patterns. This is the same
product as the [Hello World demo](../hello-world/), so you can run
pre-sales first and then continue into delivery as a single end-to-end
flow.

---

## Setup

1. Clone this repo
2. Copy the sample context into your context folder — paste this into your
   agent, or just copy the files from `docs/getting-started/pre-sales-demo/context/`
   to `.project-context/` yourself:
   ```
   cp docs/getting-started/pre-sales-demo/context/sample-rfp.md .project-context/
   cp docs/getting-started/pre-sales-demo/context/discovery-transcript.md .project-context/
   ```
3. Open your AI coding tool in the repo root

---

## Run It

Three commands take you from raw inputs to a delivery-ready SOW.

| Step | Command | What it does | Details |
|------|---------|-------------|---------|
| 1 | `/ais.presales.synthesize` | Synthesize client needs | [details](prompts/1-presales-synthesize.md) |
| 2 | `/ais.presales.propose` | Generate proposal with proposed specs | [details](prompts/2-presales-propose.md) |
| 3 | `/ais.presales.scope` | Produce the SOW | [details](prompts/3-presales-scope.md) |

All three steps run with no required input. Each reads the output of the
previous step automatically. See the linked prompt files for what to
expect and what to look for at each step.

---

## What You End Up With

```
specs/
  .presales/
    01-what-we-heard.md   Client needs synthesis
    02-proposal.md        Solution proposal with proposed specs
    03-sow.md             Statement of work
```

---

## Transition to Delivery

Once the SOW is "signed" (for the demo, just confirm when prompted), run
`/ais.setup.plan`. It reads the SOW as a T1 source and maps each delivery spec to a delivery spec (YYMM-NNN). From there, the delivery workflow
takes over — see the [Hello World demo](../hello-world/) for that path.

---

## Files

```
docs/getting-started/pre-sales-demo/
  README.md                     This file — the demo walkthrough
  context/
    sample-rfp.md               RFP for a team focus timer
    discovery-transcript.md     Discovery call transcript
  prompts/
    1-presales-synthesize.md    Step 1: what to expect
    2-presales-propose.md       Step 2: what to expect
    3-presales-scope.md         Step 3: what to expect
```
