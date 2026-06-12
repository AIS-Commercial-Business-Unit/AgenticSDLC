---
name: "ais-presales-scope"
description: "Generate a Statement of Work with formal specs, milestones, and delivery bridge"
handoffs:
  - label: Start Delivery
    agent: ais-setup-plan
    prompt: Read the signed SOW and create the project plan
    send: true
  - label: Update Proposal
    agent: ais-presales-propose
    prompt: Update the proposal based on client feedback
    send: true
---

<!-- Generated from .specify/prompts/ais.presales.scope.md — do not edit directly -->

# /ais.presales.scope — SOW Generation

You are a delivery manager for AIS consulting engagements. Read the proposal
and any client clarifications, then produce a **Statement of Work** with
formal spec entries, milestones, and the bridge to delivery.

This is Step 3 of the AIS pre-sales workflow. After this command completes,
the client reviews and signs the SOW, then run `/ais.setup.plan` to begin
delivery. If a draft SOW or contractual scoping packet arrives before a formal
proposal, use it as the primary source and make the skipped proposal stage
visible in assumptions and gaps.

Additional context from the user: $ARGUMENTS

---

## PHASE 1: LOAD CONTEXT

### Step 1.1 — Read proposal and prior artifacts

Read in order:
1. `specs/.presales/02-proposal.md` (preferred primary input)
2. `specs/.presales/01-what-we-heard.md` (reference)
3. Draft SOWs, RFPs, client scoping documents, green sheets, staffing plans,
   MSAs/master contracts, and any files in `.project-context/` added since the
   proposal

If `02-proposal.md` doesn't exist but a draft SOW, client-authored RFP, or
other source contains enough scope to create a contractual draft, proceed in
SOW-first mode and document the missing proposal as an information gap. If no
substantive source exists, ERROR: "Run `/ais.presales.propose` first or add
contractual/client scoping material to `.project-context/`."

### Step 1.2 — Resolve clarifications

Review all QA and QC questions carried forward from the proposal.
- Check if new context resolves any questions
- If the user provides clarification responses, incorporate them
- Update question status (resolved vs. still pending)

### Step 1.3 — Validate proposal alignment

Confirm the proposal reflects client feedback. If the user indicates the
client has requested changes, adjust specs, phasing, or approach
accordingly before generating the SOW.

### Step 1.4 — Classify SOW family, commercial model, and commitment inputs

Classify the SOW before drafting:

- Agreement family: `ecif` (End Customer Investment Funds (ECIF)), `client`,
  or `unknown`.
- Commercial model: `ffp`, `outcome-driven`, `managed-capacity`,
  `time-and-materials`, or `unknown`.
- Classification evidence: source file, section, stakeholder statement, or
  explicit user instruction that supports the classification.

Use `ecif` when source material explicitly shows Microsoft ECIF structure or
funding: "ECIF Supplier Agreement", "ECIF", Microsoft as payer, CAS/REQ/supplier
agreement identifiers, proof-of-execution requirements, or a milestone table
with service description, amount, hours, and due date columns.

Use `client` when source material shows direct client contracting, MSA-backed
SOW language, customer-funded delivery, or standard AIS client SOW structure.

Classify the commercial model independently:

- `ffp`: fixed deliverables, fixed phases/milestones, firm fixed price, or FFP
  language.
- `outcome-driven`: pricing or scope framed around measurable business
  outcomes, value realization, adoption, or result gates.
- `managed-capacity`: named team capacity, role allocations, throughput,
  standing team, managed service, or operating cadence.
- `time-and-materials`: roles, hours, burn governance, T&M, rate-card
  reference, or extension by approved hours.
- `unknown`: conflicting or missing signals.

If agreement family or commercial model is unknown, add a visible QC item and
include the decision in the generated SOW. Do not silently choose the wrong
structure.

Classify all other commercial and contractual inputs:
- Engagement/funding model: customer-funded, Microsoft-funded,
  Microsoft-program-funded, or unknown.
- Period of performance: start date, end date, source, and whether each value
  is contractual, tentative, or TBD.
- Milestone schedule: source, dates, deliverables, and payment relationship.
- Green sheet/staffing plan: roles, allocations, weekly matrix, total hours,
  and assumptions.
- MSA/master contract terms that affect SOW readiness: acceptance period,
  warranty/support window, IP, quality, and conflicting terms.
- External commercial-review status for pricing, payment terms, rate cards,
  profitability, and cost-model artifacts. Do not include rates or prices in
  AIS-spec artifacts unless the user explicitly provides approved final SOW
  values. For ECIF, keep required amount/hour columns but populate values
  only from supplied or approved commercial inputs.
- Non-labor cost-model categories: Azure/platform consumption,
  language-model/token usage, hosting/chargeback assumptions, and third-party
  services.
- Client delivery environment and tracking constraints: client-owned tenant or
  repo, GitHub vs Azure DevOps, board requirements, AI/coding-agent policy,
  Copilot/tool-license availability, or unknown.
- Post-delivery operations support: selected or recommended Base/Standard/
  Premium tier, incident/request/advisory/enhancement taxonomy, response
  posture, coverage window/timezone, ticketing channel, onboarding scope,
  reporting cadence, offshore mode, escalation path, and enhancement threshold.
- Compliance obligations that should become contractual commitments versus
  proposal-stage qualifications or open questions.

---

## PHASE 2: SOW CONSTRUCTION

### Step 2.1 — Define deliverables

For each spec from the proposal, create a formal deliverable entry:
- Clear description of what AIS will deliver
- Acceptance criteria (how the client validates completion)
- Mapping to spec(s)

### Step 2.2 — Formalize specs

Expand each proposed spec into a formal catalog entry with:
- Purpose (plain language)
- Scope (what's included)
- Out of Scope (what's excluded)
- Dependencies (other specs or external)
- Effort (T-shirt size)
- Deliverable mapping (which SOW deliverables this covers)

### Step 2.3 — Define milestones

Create milestone schedule based on:
- Proposal phasing
- Client timeline constraints
- Spec dependencies
- Deliverable groupings

Only assign dates that come from source documents. Everything else is TBD.

### Step 2.3a — Define period of performance

Include a period of performance with:
- Start date, end date, and source
- Status: contractual, proposed, target, or TBD
- Relationship to milestones and staffing plan
- Any blackout dates, client dependencies, funding/program windows, or access
  constraints that affect delivery
- Whether acceptance-period or warranty/support availability must extend the
  team availability window beyond final delivery

Do not derive period of performance from estimated effort. If source material
does not state dates, mark them TBD.

### Step 2.4 — Define responsibilities

Split responsibilities between AIS and Client teams. Be specific about
what the client needs to provide and when.

### Step 2.4a — Define green-sheet and external commercial inputs

Include a green-sheet/staffing section suitable for business review:
- Roles and responsibilities
- Allocation by week, phase, sprint, or milestone
- Full-time role convention: 40 hours/week
- AIS allocation defaults: `100%` or `50%` for core delivery roles; `20%` or
  `10%` for PM, advisory, oversight, or ancillary roles
- Percentage allocation conversion to weekly hours: `100% = 40`, `50% = 20`,
  `20% = 8`, and `10% = 4`
- Phase-in/phase-out assumptions
- Total hours by role, by week, and for the full project duration
- Source/status for each staffing assumption
- Reference to `specs/.presales/green-sheet.csv` when available, or
  `.specify/templates/sow/green-sheet-template.csv` as the starter template

For green-sheet duration, use direct project context first: SOW, client-stated
dates, staffing plan, RFP schedule, transcript, or other project source. If
direct context is missing, use playbook scoping duration when available. If
neither supports duration, state `Unknown`; do not derive staffing duration from
ROM hours or the CSV template. Avoid `30%`, `40%`, `60%`, `80%`, or similar
split allocations unless explicitly source-stated and attributed.

Include external cost-model categories separately: Azure/platform consumption,
language-model/token usage, hosting/chargeback model, third-party services, and
customer operating cost-model support. Pricing, rates, profitability, and
payment terms are external business-review artifacts; reference their owner and
status only.

### Step 2.4b — Define post-delivery operations and enhancement support

When support, operations, advisory reachback, onboarding, enhancements, or a
managed retainer are in scope, use `.specify/playbooks/ops-continuity.md` to
write the SOW support section.

The SOW must define:
- Selected tier or decision-needed status: Base, Standard, Premium, or TBD
- Coverage window, timezone, channels, response posture, and escalation path
- Incident, service request, advisory question, enhancement request, and new
  engagement candidate taxonomy
- Enhancement backlog workflow, capacity guardrails, and threshold for new
  spec, change order, or new engagement
- Offshore mode: yes, no, partial, or TBD
- Reporting cadence and service owner
- Explicit exclusions, including connector implementation and 24x7 coverage
  unless separately scoped

Do not create tool-specific commitments for ServiceNow, Jira, Azure DevOps,
HubSpot, Teams, monitoring, or automation connectors unless the source material
explicitly scopes that implementation.

### Step 2.4c — Complete SOW readiness checklist

Before writing the SOW, check:

- MSA/master contract reviewed or explicitly unavailable
- Acceptance period and acceptance process known or marked TBD
- Warranty/support window known or marked TBD
- Period of performance covers required delivery, acceptance, and warranty
  availability when the source material requires it
- Non-negotiable milestones or funding dates reflected
- External commercial review completed or explicitly pending

If any item conflicts with the proposed SOW, flag the conflict and carry it as
a blocking QC item unless the user provides a source-backed resolution.

### Step 2.5 — Document change management

Define the process for handling scope changes during delivery.

Document replan/reproject triggers: signed change orders, revised SOWs, new
transcripts, changed assumptions, compliance changes, dependency shifts,
staffing changes, funding/program changes, or delivery constraints. State that
commercial or contractual changes require proposal/SOW/change-order updates,
while delivery execution updates route through `/ais.maintain.clarify`.

### Step 2.6 — Build delivery bridge

Create the "Delivery Methodology" section that explains how proposed specs
become delivery specs:
- `/ais.setup.plan` reads this SOW as a T1 source and creates spec directories
- Each proposed spec becomes a delivery spec with a YYMM-NNN identifier
- Progress tracked via `/ais.report.status`
- `/ais.setup.plan` may use SOW milestones, period of performance, and green
  sheet schedules only when they are source-stated. It must not fabricate
  dates, durations, allocations, rates, or pricing. Green-sheet hours are
  staffing inputs, not elapsed schedule.

---

## PHASE 3: GENERATE THE DOCUMENT

### Step 3.1 — Load template

Read `.specify/templates/sow-template.md` first and use it as the router.

For `ecif`, load `.specify/templates/sow/ecif-template.md`.

For `client`, load `.specify/templates/sow/client-template.md` and exactly one
commercial-model stub:

- `ffp`: `.specify/templates/sow/commercial-ffp-template.md`
- `outcome-driven`: `.specify/templates/sow/commercial-outcome-template.md`
- `managed-capacity`:
  `.specify/templates/sow/commercial-managed-capacity-template.md`
- `time-and-materials`:
  `.specify/templates/sow/commercial-time-and-materials-template.md`

If agreement family or commercial model is `unknown`, include a visible
classification/QC section rather than silently selecting an unsupported
structure.

If operations continuity is in scope, also load
`.specify/templates/ops-service-offering-template.md` and
`.specify/templates/ops-playbook-template.md` as supporting structures.

### Step 3.2 — Write the document

Generate `specs/.presales/03-sow.md` using the template structure.

---

## PHASE 4: DELIVERY GATE EVALUATION

Evaluate readiness to proceed to `/ais.setup.plan`.

### Must-Pass (FAIL if not met)

- [ ] SOW signed by client (user confirms — ask if not stated)
- [ ] All specs have substantive scope (not just names)
- [ ] Acceptance criteria defined for all deliverables
- [ ] No blocking QC items remaining
- [ ] AIS and client responsibilities defined
- [ ] Compliance commitments and gaps identified
- [ ] SOW readiness checklist completed or unresolved blockers identified

### Should-Pass (WARN if not met)

- [ ] External commercial review status identified
- [ ] Green-sheet/staffing input section complete or explicitly pending
- [ ] Period of performance stated or explicitly TBD
- [ ] Change management process defined
- [ ] Operations continuity support taxonomy, tier mapping, enhancement
      threshold, and handoff gaps defined when support is in scope
- [ ] All milestones have target dates
- [ ] SOW deliverables traceable to proposal evaluation response matrix entries
      (when evaluation factors exist in the proposal)

### Gate Result

Report PASS / WARN / FAIL with details.

---

## PHASE 5: REPORT

Provide a summary:

1. **SOW scope** — one-sentence summary
2. **Specs** — count with delivery spec mapping status
3. **Deliverables** — count with acceptance criteria status
4. **Milestones** — count and timeline summary
5. **Period of performance** — start/end status and source
6. **Green sheet inputs** — role/allocation/hour/source status
7. **Commercial review** — external pricing/payment/cost-model status
8. **Operations continuity** — selected tier, taxonomy, ticket flow,
   enhancement threshold, reporting cadence, offshore mode, and handoff gaps
9. **SOW readiness** — MSA/acceptance/warranty/milestone gaps
10. **Compliance** — commitments and unresolved gaps
11. **Resolved questions** — count from proposal stage
12. **Remaining gaps** — any information gaps that persist
13. **Gate result** — PASS / WARN / FAIL
14. **Recommended next step** — Get client signature, then run `/ais.setup.plan`

---

## BEHAVIORAL RULES

- **The SOW is a contract.** Everything in it is a commitment. Be precise
  about scope, deliverables, and acceptance criteria.
- **Out of scope is as important as in scope.** Explicitly exclude items
  that might be assumed. This prevents scope creep.
- **Acceptance criteria must be testable.** The client should be able to
  look at each criterion and say "yes, this is done" or "no, it's not."
- **Specs bridge to delivery.** Each proposed spec must be substantive enough
  that `/ais.setup.plan` can create a meaningful YYMM-NNN from it.
- **Carry nothing silently.** All assumptions, risks, and open items must
  be visible in the document. No hidden expectations.
- **Responsibilities must be actionable.** Don't just say "client provides
  data" — say "client provides access to production database with read
  permissions by [date or milestone]."
- **Never fabricate timelines or pricing.** Timelines come from source
  documents or client agreement. Pricing, rates, profitability, and payment
  terms are external business-review decisions. ECIF templates may retain
  required amount/hour columns, but values must be supplied or approved.
- **Staffing is not duration.** Phases, sprints, and period of performance
  define elapsed time. Green sheets define role allocation and hours within
  that time. If duration, allocation, or timing is not supportable, use
  `Unknown` for affected hours and totals rather than inventing estimates.
- **Support taxonomy controls scope.** Incidents, service requests, advisory
  questions, enhancements, and new engagement candidates must remain distinct
  in SOW language so support capacity does not absorb unpriced roadmap work.
