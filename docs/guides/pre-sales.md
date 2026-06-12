# Pre-Sales Workflow Guide

How to take raw client signals through the AIS pre-sales pipeline to produce
structured proposals and SOWs that feed directly into delivery specs.

## Pipeline Overview

```
/ais.presales.synthesize  →  specs/.presales/01-what-we-heard.md   (Proposal Gate)
/ais.presales.propose     →  specs/.presales/02-proposal.md        (SOW Gate)
/ais.presales.scope       →  specs/.presales/03-sow.md             (Delivery Gate)
/ais.setup.plan           →  specs/.project-plan/               (Delivery begins)
```

The full pipeline is recommended for formal opportunities, but engagements can
enter at different points. An RFP can arrive without an RFI. A draft or signed
SOW can arrive without a proposal. Informal scoping documents and transcripts
can be enough to start discovery. Commands should use the highest-authority
source available and make missing earlier artifacts visible as assumptions or
information gaps rather than blocking by default.

## Artifact Boundaries

| Artifact / Stage | Planning Content | Confidence / Commitment |
|------------------|------------------|-------------------------|
| RFI | Eligibility, fit, response requirements, high-level capabilities, early compliance gaps | Informational. Do not invent solution scope. |
| RFP | Requested scope, evaluation criteria, response format, compliance requirements, pricing/staffing requests | Client request. Not an AIS commitment. |
| What We Heard | Client problem, outcomes, constraints, QA/QC questions, funding model, compliance signals | Shared understanding. Not a proposal. |
| Proposal | Recommended approach, proposed specs, phasing, ROM, assumptions, staffing inputs, compliance response | Indicative until accepted into a SOW. |
| SOW | Contractual deliverables, acceptance criteria, responsibilities, period of performance, MSA alignment, commercial-review references, compliance commitments | Commitment only after signature. |
| Setup Plan | Delivery spec catalog, source-traced milestones, risks, open decisions | Delivery planning from source material. Must not fabricate timelines or pricing. |
| Execution Replan | Changes from revised source material, change orders, transcripts, decisions, or constraints | Route commercial changes to SOW/change order; route delivery changes through `/ais.maintain.clarify`. |

## Engagement Classification

Classify the funding model during synthesis and carry it forward:

- **Customer-funded**: pricing, staffing, SOW, and acceptance terms are direct
  client-facing commitments.
- **Microsoft-funded**: approval path, eligible activities, and evidence needs
  may affect assumptions and artifact shape.
- **Microsoft-program-funded**: program lifecycle, required evidence, and
  funding windows may affect response and delivery obligations.
- **Unknown**: carry as a QC question before pricing or SOW commitment.

Do not invent End Customer Investment Funds (ECIF) or program-specific rules
from the classification alone. Capture the classification, source, and open
program details.

## SOW Families and Commercial Models

`/ais.presales.scope` classifies two things before it generates
`specs/.presales/03-sow.md`:

- **Agreement family**: `ecif`, `client`, or `unknown`.
- **Commercial model**: `ffp`, `outcome-driven`, `managed-capacity`,
  `time-and-materials`, or `unknown`.

Use the ECIF SOW family only when source material explicitly shows Microsoft
ECIF structure: ECIF language, Microsoft as payer, CAS/REQ or supplier-agreement
identifiers, proof-of-execution requirements, or a milestone table with service
description, amount, hours, and due date columns. Use the client SOW family for
direct client SOWs, MSA-backed scopes, customer-funded work, and standard AIS
client SOW patterns.

Commercial model affects scope and acceptance even when pricing values are not
included:

| Model | Scope Pattern |
|-------|---------------|
| FFP | Fixed deliverables, phase/milestone acceptance, and change-order guardrails |
| Outcome-driven | Measurable outcomes, success evidence, client dependency guardrails, and outcome gates |
| Managed capacity | Roles, allocation windows, throughput expectations, governance cadence, and capacity boundaries |
| Time and materials | Roles, hours, burn governance, rate-card reference, and extension controls |

If agreement family or commercial model is unclear, carry it as a QC item. Do
not silently choose a final SOW structure.

## Operations Continuity and Enhancements

When a source asks AIS to stay involved after delivery, load the
`ops-continuity` playbook in addition to the delivery-domain playbook. This
applies to Tier 2 app support, L2 production support, hypercare extension,
managed support retainers, onboarding support, advisory reachback, platform
governance, bug fixes, and governed enhancements.

Use the ops continuity model to produce:

- Base, Standard, and Premium support option sets
- a recommended tier with source-backed rationale
- incident, service request, advisory, enhancement, and new-engagement
  taxonomy
- support channel, response posture, staffing approach, offshore eligibility,
  and reporting cadence guidance
- enhancement backlog and change-threshold rules
- HubSpot-ready follow-on summary text
- project-to-ops handoff checklist and ops playbook artifact structure

The tier names describe posture and boundaries, not prices. Keep rates,
margins, profitability, and final commercial terms outside AIS-spec artifacts.
Do not promise ServiceNow, Jira, HubSpot, Teams, Azure DevOps, monitoring, or
automation connector implementation unless separately scoped.

### Support Taxonomy

| Category | Definition | Route |
|----------|------------|-------|
| Incident | Production-impacting interruption, degradation, failed job, security event, or data issue | Restore, escalate, document root cause |
| Service request | Access, configuration, deployment help, data refresh, onboarding, or documented runbook task | Fulfill through approved request flow |
| Advisory question | SME reachback, architecture guidance, governance question, or operational decision support | Answer within tier cadence; document recommendation |
| Enhancement request | New or changed behavior, workflow, report, integration, model/prompt, automation, or UX improvement | Triage into backlog, estimate, and route |
| New engagement candidate | Work that changes outcomes, users, systems, compliance posture, operating model, or delivery team shape | Discovery, proposal/SOW, new spec, or change order |

Enhancement work remains in support capacity only when it is small,
source-aligned, low-risk, and inside the selected tier's capacity guardrails.
Move it to a new spec, change order, or new engagement when it adds new users,
integrations, data domains, compliance obligations, environments, production
dependencies, or material delivery effort.

## Step 1: Gather Raw Inputs

Place all client materials in `.project-context/`:

- RFIs and response instructions
- RFPs and requirements documents
- SOWs or contract drafts
- Meeting recordings, call transcripts
- Client emails and communications
- Technical documentation, data schemas
- Existing proposals or ROM estimates
- Green sheets, staffing plans, MSA/master contracts, milestone schedules

The framework processes all file types — PDFs, Word docs, spreadsheets,
images, code files, transcripts (VTT, SRT, JSON).

## Step 2: Synthesize (`/ais.presales.synthesize`)

Reads `.project-context/` and produces `specs/.presales/01-what-we-heard.md`:

- Classifies sources by authority tier (T1-T6)
- Extracts business problems, outcomes, capabilities
- Maps users and stakeholders
- Identifies constraints (timeline, period of performance, budget, technical,
  compliance, funding/program, staffing, contract-readiness, delivery
  environment, organizational)
- Classifies engagement/funding model when known
- Captures SOW agreement-family and commercial-model signals when present
- Extracts MSA, acceptance-period, warranty/support, client-environment, and
  AI/coding-agent policy signals when present
- Extracts mandatory compliance, eligibility, and response-format requirements
- Extracts evaluation factors from solicitations with structured IDs, weights,
  classifications, and source references (when the source contains evaluation
  criteria)
- Splits questions into QA (we can answer) and QC (need client input)

**Gate**: Proposal Gate must PASS before proceeding.

**Client review**: Share what-we-heard with the client to confirm understanding
before proposing solutions.

## Step 3: Propose (`/ais.presales.propose`)

Reads 01-what-we-heard + relevant playbooks and produces
`specs/.presales/02-proposal.md` and, when staffing inputs are sufficient,
`specs/.presales/green-sheet.csv`:

- Generates a draft proposal outline mapped to evaluation criteria and presents
  it for human review before content generation (when evaluation factors exist)
- Allocates per-section page budgets when a page limit is stated
- Prompts for optional win themes (customer need, AIS benefit, differentiator)
  that are threaded through the proposal
- Defines solution approach informed by playbook patterns
- Decomposes into proposed specs — lightweight scope markers
- Maps dependencies and phases
- Recommends technology approach
- Provides ROM estimates using playbook estimation patterns
- Builds green-sheet/staffing CSV inputs from proposed scope, playbook sizing,
  role responsibilities, weekly hours, total hours, source/status, and delivery
  calendar
- Captures Azure/platform, language-model/token, hosting, chargeback, and other
  cost-model inputs without embedding rates or prices
- Tracks SOW-readiness inputs: MSA, acceptance process, warranty/support
  window, non-negotiable milestones, SOW family/model, and external
  commercial-review owner
- Generates an evaluation response matrix mapping each evaluation factor to
  proposal coverage and compliance status (when evaluation factors exist)
- Checks win-theme consistency across sections (when win themes are defined)
- Includes a compliance response/check when required by RFI, RFP, SOW, or
  regulated context
- Identifies risks with mitigations

**Gate**: SOW Gate must PASS before proceeding.

**Client review**: Share proposal to validate approach and get alignment.

## Step 4: Scope (`/ais.presales.scope`)

Reads proposal + client feedback and produces `specs/.presales/03-sow.md`:

- Classifies agreement family and commercial model before drafting
- Formalizes deliverables with acceptance criteria
- Expands proposed specs into detailed catalog entries
- Defines milestones and timeline
- Defines period of performance from source-stated or agreed dates
- Carries green-sheet/staffing summary and external commercial-review status
- Separates tentative proposal phasing from contractual milestones and payment
  terms
- Completes an SOW readiness checklist for MSA alignment, acceptance period,
  warranty/support window, and non-negotiable milestones
- Converts compliance responses into commitments only when supported by source
  material or approved assumptions
- Splits AIS and client responsibilities
- Creates delivery bridge (`/ais.setup.plan` reads the SOW and creates spec directories)

**Gate**: Delivery Gate must PASS (including client signature).

## Step 5: Transition to Delivery

Once the SOW is signed, run `/ais.setup.plan`. It reads `sow.md` as a T1
source and:

- Creates `specs/YYMM-NNN-name/` directories with initial `spec.md` files
- May split, merge, or add specs beyond those in the SOW
- Ensures every SOW deliverable maps to at least one delivery spec
- Uses SOW milestones, period of performance, and green-sheet schedules only
  when they are explicitly source-stated
- Does not fabricate dates, durations, allocations, rates, or pricing

## Green Sheets and Staffing

Green sheets convert scope into staffing and effort inputs. They do not define
scope by themselves, and they are not the schedule.

Required inputs:

- Proposed specs and playbook sizing drivers
- Roles and responsibilities
- Period of performance or delivery calendar
- Phase, sprint, wave, or milestone plan
- Allocation by role and week
- Source/status for staffing assumptions

Allocation rules:

- Full-time equals 40 hours/week.
- Use AIS staffing defaults: `100%` or `50%` for core delivery roles, and `20%`
  or `10%` for project management, advisory, oversight, or ancillary roles.
- Percentage allocation converts to weekly hours: `100% = 40`, `50% = 20`,
  `20% = 8`, and `10% = 4`.
- Avoid `30%`, `40%`, `60%`, `80%`, or similar split percentages unless they
  are explicitly source-stated and attributed.
- Staffing can phase in or out by week, phase, sprint, or milestone.
- Duration and staffing are separate. A six-week phase does not imply every
  role is staffed full-time for six weeks.
- Determine duration from direct project context first: SOW, client-stated
  dates, staffing plan, RFP schedule, transcript, or other project source. If
  direct context is missing, use playbook scoping duration when available. If
  neither supports duration, use `Unknown`.
- Never infer duration from the CSV template, ROM hours, or an arbitrary
  default.
- If duration, timing, or allocation is unknown, keep likely role rows but mark
  affected weekly hours, role totals, and grand totals as `Unknown`.
- The green-sheet CSV should include role description, project responsibility,
  assumption source/status, weekly role hours, role totals, weekly totals, and a
  grand total for the full project duration.

Use `.specify/templates/sow/green-sheet-template.csv` as the starter shape and
generate `specs/.presales/green-sheet.csv` when enough staffing data exists.
Rates, prices, profitability, and payment terms stay in external
business-review artifacts.

## Cost-Model Inputs

Proposal and SOW artifacts should distinguish:

- Staffing hours from pricing
- Azure/platform consumption model needs
- Language-model/token usage model needs for spec-driven development and
  AI-enabled delivery
- Hosting/chargeback model: AIS/Azure-hosted, customer-hosted, or unknown
- Third-party services such as data, monitoring, evals, licenses, or APIs
- Whether AIS should help the client create an operating cost model

Pricing remains a business decision outside AIS-spec. Generated artifacts
provide structured staffing and cost-model inputs, but do not include rates,
prices, profitability, or payment amounts unless the user explicitly supplies
approved final SOW values. ECIF outputs may keep required amount/hour
columns, but missing values must stay TBD and commercial-review owned.

## SOW Readiness

Before issuing an SOW, confirm:

- MSA/master contract availability and any conflict with SOW terms
- Acceptance period and acceptance process
- Warranty/support window and required team availability after delivery
- Period of performance covers delivery plus required acceptance/warranty
  availability when source material requires it
- Non-negotiable milestones or funding dates are reflected
- External commercial review is complete or explicitly pending

Missing or conflicting readiness items become QC questions. Do not invent
acceptance, warranty, quality, IP, pricing, or payment terms.

## Compliance Checks

For RFIs, RFPs, government procurements, regulated clients, and SOWs, the
pre-sales flow should extract and carry mandatory compliance requirements.

Compliance checks should include:

- Requirement or clause summary
- Source and authority tier
- Proposed response or evidence
- Owner
- Status: compliant, partially addressed, gap, not applicable, or needs
  confirmation
- Impact on eligibility, scope, staffing, timeline, cost, or acceptance

Only SOW-supported or explicitly approved compliance items become contractual
commitments. Proposal-stage compliance responses remain recommendations,
qualifications, or open questions.

## Clarification Loop

Questions flow through the pipeline:

1. `/ais.presales.synthesize` identifies QA and QC questions
2. Client answers go back into `.project-context/`
3. Re-run the command — questions get resolved, gates re-evaluated
4. Unresolved questions carry forward to proposal and SOW
5. Each stage can add new questions based on deeper analysis

**QA questions** reduce client burden — we propose answers with confidence
levels. The client confirms or corrects.

**QC questions** are genuine blockers — we can't assume the answer.

## Playbook Integration

Pre-sales commands automatically load relevant playbooks from
`.specify/playbooks/` to inform:

- Discovery questions (what to ask early)
- Proposed spec decomposition (common components)
- Technology approach (stack recommendations)
- ROM estimation (effort patterns, effort drivers, complexity indicators)
- Engagement shape (team composition, sprint/wave/milestone patterns)
- Staffing guidance, role libraries, AI/coding-agent assumptions, and cost-model
  drivers
- Ops continuity tiering, support taxonomy, enhancement governance, and
  handoff guidance when post-delivery support is in scope
- Risk register (domain-specific risks)

Specify a playbook explicitly: `/ais.presales.synthesize Use the agent-ai-builds playbook`

Playbooks own project-type-specific sizing guidance. The framework owns the
universal rules: artifact boundaries, confidence levels, green-sheet
integration, contractual commitment boundaries, compliance checks, and
replanning behavior.

## Execution Replanning

Use `/ais.maintain.clarify` when new context arrives after setup:

- Revised SOW or signed change order
- New meeting transcript or stakeholder decision
- Changed assumption, dependency, staffing model, funding/program condition, or
  delivery constraint
- New compliance requirement or security constraint
- Scope, milestone, period-of-performance, or cost change

Route updates by impact:

| Change Type | Target |
|-------------|--------|
| Contractual deliverables, pricing, payment, period of performance, or compliance commitments | Proposal/SOW update, amendment, or signed change order |
| Scope decomposition, milestones, risks, open decisions, stakeholder alignment | `specs/.project-plan/` via `/ais.maintain.clarify` |
| Technical stack, integration, data flow, architecture decision | `specs/.architecture/` via `/ais.maintain.clarify` |
| Governance, quality gates, compliance standards | `/ais.setup.constitution` |
| Single-feature detail | Feature spec owner or spec-level clarification |

## Gate System

Each command evaluates gate criteria and reports PASS / WARN / FAIL:

- **PASS** — All must-pass criteria met. Ready for next step.
- **WARN** — Must-pass met, but some should-pass items missing. Can proceed with noted gaps.
- **FAIL** — Must-pass criteria not met. Lists what's needed.

See the [command reference](../reference/commands.md) for full gate criteria.
