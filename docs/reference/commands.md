# Command Reference

Detailed guide to every AIS command — modes, input, flags, and behavior.

For the quick-reference table, see the [README](../../README.md#commands).
For the visual workflow, see [workflow.md](workflow.md).

---

## Pre-Sales

Pre-sales commands take raw client inputs through synthesis, proposal, and
SOW generation. Each evaluates a gate before proceeding to the next step.
Engagements may enter from an RFI, RFP, informal scoping packet, draft SOW, or
signed SOW; commands use the highest-authority source available and make
missing earlier artifacts visible as assumptions or information gaps.

### `/ais.presales.synthesize`

Reads everything in `.project-context/` and produces a structured **What We
Heard** document — a mirror of the client's needs, not a proposal.

| | |
|---|---|
| **Input** | Optional. Additional context or playbook selection. |
| **Reads** | `.project-context/*`, `.specify/playbooks/*` |
| **Produces** | `specs/.presales/01-what-we-heard.md` |
| **Prerequisites** | At least one file in `.project-context/` |

**Key behaviors:**

- Classifies sources by authority tier (T1-T6) with a pre-sales lens
- Identifies the artifact entry point and engagement/funding model
- Captures SOW agreement-family and commercial-model signals when present
- Extracts period-of-performance, staffing, green-sheet, platform,
  language-model/token, chargeback, MSA/readiness, client-environment, and
  cost-model signals
- Extracts mandatory compliance, eligibility, and response-format requirements
- Splits questions into QA (AIS-answerable with assumptions) and QC (need client input)
- Loads relevant playbooks for discovery question guidance
- Evaluates Proposal Gate (PASS / WARN / FAIL)

**Proposal Gate (must-pass):** Business problem understood, at least 1 outcome,
at least 1 capability, client contact identified, no blocking high-impact QC items.
Should-pass items include known-or-explicitly-unknown timeline, budget,
engagement/funding model, and mandatory compliance requirements.

---

### `/ais.presales.propose`

Reads the What We Heard document and playbooks to generate a **Proposal**
with proposed specs, phasing, technology approach, and ROM.

| | |
|---|---|
| **Input** | Optional. Additional context or guidance. |
| **Reads** | `specs/.presales/01-what-we-heard.md`, `.specify/playbooks/*`, `.project-context/*` |
| **Produces** | `specs/.presales/02-proposal.md`; `specs/.presales/green-sheet.csv` when staffing inputs are sufficient |
| **Prerequisites** | `specs/.presales/01-what-we-heard.md` must exist |

**Key behaviors:**

- Decomposes solution into proposed specs informed by playbook patterns
- Maps dependencies and defines phasing
- Provides ROM estimates using playbook estimation patterns and confidence levels
- Builds green-sheet/staffing CSV inputs: role descriptions, project
  responsibilities, assumption source/status, weekly hours, role totals, weekly
  totals, and grand total hours
- Uses direct project duration first, playbook scoping duration second, and
  `Unknown` when staffing duration or totals are not supportable
- Captures external cost-model inputs such as Azure/platform consumption,
  language-model/token usage, hosting/chargeback, and third-party services,
  without embedding rates or prices
- Tracks SOW-readiness inputs: MSA, acceptance period, warranty/support window,
  non-negotiable milestones, SOW family/model, and external commercial-review
  status
- Includes compliance response/check sections for formal or regulated requests
- Carries forward unresolved QA/QC questions
- Evaluates SOW Gate (PASS / WARN / FAIL)

**SOW Gate (must-pass):** Client alignment on approach, at least 2 proposed specs,
phasing defined, technology approach identified, critical-path QC resolved,
mandatory compliance blockers and SOW-readiness blockers identified for formal
RFI/RFP/SOW sources.

---

### `/ais.presales.scope`

Reads the proposal and client clarifications to produce a **Statement of Work**
with formal deliverables, acceptance criteria, and the delivery bridge.

| | |
|---|---|
| **Input** | Optional. Client feedback or clarification responses. |
| **Reads** | `specs/.presales/02-proposal.md`, `specs/.presales/01-what-we-heard.md`, `.project-context/*` |
| **Produces** | `specs/.presales/03-sow.md` |
| **Prerequisites** | `specs/.presales/02-proposal.md` must exist |

**Key behaviors:**

- Classifies agreement family (`ecif`, `client`, or `unknown`) and commercial
  model (`ffp`, `outcome-driven`, `managed-capacity`, `time-and-materials`, or
  `unknown`) before drafting
- Formalizes deliverables with acceptance criteria mapped to proposed specs
- Expands proposed specs into detailed catalog entries (purpose, scope, out of scope)
- Defines period of performance from source-stated or agreed dates, including
  acceptance/warranty availability when source material requires it
- Carries green-sheet/staffing summary and external commercial-review status
- Separates tentative proposal phasing from contractual milestones, external
  commercial terms, and staffing allocation
- Uses End Customer Investment Funds (ECIF) structure only for Microsoft
  ECIF-style sources and uses client SOW structure plus the selected
  commercial-model stub for direct client SOWs
- Completes SOW readiness checks for MSA alignment, acceptance, warranty,
  non-negotiable milestones, and commercial-review status
- Converts compliance responses into contractual commitments only when supported
  by source material or approved assumptions
- Creates delivery bridge: `/ais.setup.plan` reads the SOW and creates spec directories
- Defines AIS and client responsibilities
- Evaluates Delivery Gate (PASS / WARN / FAIL)

**Delivery Gate (must-pass):** SOW signed (user confirms), all specs
substantive, acceptance criteria defined, no blocking QC items, responsibilities
defined, compliance commitments and gaps identified.

---

## Project Setup

Setup commands run once at the start of a project. They read raw context
and produce the foundational artifacts that the spec lifecycle builds on.

### `/ais.setup.plan`

Reads everything in `.project-context/` and produces the **project plan**
— a spec catalog that decomposes the project into individually-assignable
component specs.

| | |
|---|---|
| **Input** | Optional. Additional context or guidance passed after the command. |
| **Reads** | `.project-context/*` (all files — SOWs, RFPs, transcripts, briefs, schemas, images) |
| **Produces** | `specs/.project-plan/` (4 files: index, charter, risks, context sources) + `specs/YYMM-NNN-name/spec.md` directories |
| **Prerequisites** | At least one file in `.project-context/` |

**Key behaviors:**

- Classifies every source file by authority tier (T1 contractual through
  T6 AI-generated). Higher tiers override lower tiers on conflicts.
- Identifies speakers in transcripts and weights their statements by
  party (client vs. AIS vs. third party).
- Assigns YYMM-NNN spec IDs based on the current date (e.g., `2603-001`
  for March 2026, first spec) and creates `specs/YYMM-NNN-name/` directories
  with initial `spec.md` files via `create-spec-batch.sh`.
- `create-spec-batch.sh` auto-detects a runnable Python command in this order:
  `python3`, `python`, `py -3`, then `py` (important for Windows Git Bash where
  `python3` may resolve to a Microsoft Store shim).
- Never fabricates timelines — only uses dates explicitly stated in source
  documents. Everything else is TBD.
- Never fabricates staffing allocations, Azure/platform cost-model signals,
  language-model/token cost-model signals, chargeback assumptions, rates,
  labor costs, or pricing. Rates, prices, and profitability stay external.
- Flags large specs with potential sub-spec candidates.
- Does not create scaffold-only specs — project setup belongs as Phase 1
  tasks within the first feature spec.
- Writes an **Alignment Brief** at the top of the charter and each initial
  spec draft: objective, users/stakeholders, key scenarios, and guiding
  principles.

---

### `/ais.setup.architecture`

Reads the project plan and context files, then synthesizes the **solution
architecture** — a layered visual blueprint with diagrams targeting
different audiences.

| | |
|---|---|
| **Input** | Optional. Additional context or guidance. |
| **Reads** | `specs/.project-plan/*`, `.project-context/*` |
| **Produces** | `specs/.architecture/` (10 files: index, strategic context, system design, domain model, critical flows, data lineage, tech stack, decisions, constitution seed, context sources) |
| **Prerequisites** | `specs/.project-plan/` must exist (run `/ais.setup.plan` first) |

**Key behaviors:**

- Generates Mermaid diagrams: Wardley Map (quadrant chart), C4 Context,
  C4 Container, Bounded Context Map, sequence diagrams, data flow.
- Maps every component to YYMM-NNN entries from the project plan.
- Creates ADRs (Architectural Decision Records) for every technology and
  design decision found in context.
- Lists architectural questions (AQ-NNN) for ambiguities that need
  resolution.
- Produces a **constitution seed** — suggested principles and standards
  for `/ais.setup.constitution`.
- **Re-run safe:** If `specs/.architecture/` already exists, writes to
  `specs/.architecture-refresh/` instead and produces a comparison summary.
  Never overwrites existing architecture files.

---

### `/ais.setup.constitution`

Creates or updates the project constitution — the non-negotiable standards,
quality gates, and integration patterns that all specs must comply with.

| | |
|---|---|
| **Input** | Depends on mode (see below). |
| **Reads** | `.specify/templates/constitution-template.md`, `specs/.architecture/08-constitution-seed.md`, `specs/.project-plan/*`, `CONTRIBUTING.md` |
| **Produces** | `specs/constitution.md` |
| **Prerequisites** | For initial creation: `specs/.architecture/` should exist. Can also run standalone at any time. |

**Modes:**

| Mode | Trigger | Input | What happens |
|------|---------|-------|-------------|
| **CREATE** | Constitution doesn't exist | Optional (fills from context) | Copies template, fills placeholders from project context and architecture seed, writes initial v1.0.0 |
| **AMEND** | Constitution exists + source material provided | File path, directory, or pasted content | Reads source, classifies by authority tier, proposes amendments, asks for approval, version bump |
| **UPDATE** | Constitution exists + interactive input | Principles to add, standards to change, TODOs to resolve | Applies direct edits, version bump |

**Key behaviors:**

- Always reads `CONTRIBUTING.md` as a standing governance source and
  ensures the constitution stays consistent with it.
- Seeds example QA/UAT gates for requirement testability, UAT readiness,
  evidence traceability, QA review status, and deployment readiness.
- Presents all proposed changes for user approval before writing.
- Uses semantic versioning: MAJOR (principle removed/redefined), MINOR
  (principle added/expanded), PATCH (wording/typo fixes).
- Propagates changes to templates (`design-template.md`, `spec-template.md`,
  `tasks-template.md`) if they reference outdated constitutional items.
- Checks downstream artifacts (`specs/.project-plan/`, `specs/.architecture/`)
  for impacts and proposes updates per artifact folder.
- Never auto-resolves contradictions at the same authority tier — asks
  the user to decide.

---

## Spec Lifecycle

These commands run per component spec, in order. Each one reads the output
of the previous step automatically. `/ais.spec.brainstorm` is optional and can
run before `/ais.spec.specify` when an idea needs discovery or scope shaping.

### `/ais.spec.brainstorm`

Optionally turns an early idea into a **Spec Seed Brief** that can be handed to
`/ais.spec.specify`. It does not create a feature spec, branch, design, tasks, or
implementation plan.

| | |
|---|---|
| **Input** | Optional. Early feature idea, problem statement, rough scope, or `--save` to persist the brief. |
| **Reads** | Lightweight project context when present: `specs/.project-plan/`, `specs/.architecture/`, `specs/constitution.md`, relevant existing specs, and discovery playbook files |
| **Produces** | Conversation-only Spec Seed Brief by default; optionally `specs/.discovery/brainstorms/YYYY-MM-DD-HHMM-short-name.md` when explicitly saved |
| **Prerequisites** | None. Can run before project setup, but missing context is marked as unknown. |

**Key behaviors:**

- Keeps brainstorming opt-in; normal `/ais.spec.specify` use is unchanged.
- Frames the problem, users/actors, desired outcomes, scope boundaries,
  assumptions, risks, and open questions.
- Asks only scope-changing clarification questions, one at a time, with a maximum
  of 5.
- Presents 2-3 approaches with trade-offs when there is a real product choice.
- Recommends exact `/ais.spec.specify ...` input when the idea is ready.
- Never creates or edits `specs/YYMM-NNN-*` feature spec artifacts and never
  runs `create-new-feature.sh`.

---

### `/ais.spec.specify`

Creates a feature specification — user stories, functional requirements,
success criteria, and edge cases.

| | |
|---|---|
| **Input** | **Required.** A feature description — either a spec name/ID from the catalog or an ad-hoc description. |
| **Reads** | `specs/YYMM-NNN-*/spec.md` (if referencing existing spec), `specs/constitution.md`, `.specify/templates/spec-template.md` |
| **Produces** | `specs/YYMM-NNN-short-name/spec.md`, `specs/YYMM-NNN-short-name/checklists/requirements.md` |
| **Prerequisites** | None (though setup commands should have run first) |

**Input options:**

- **Spec reference** — Pass a spec name or ID (e.g., `Focus Timer` or
  `2603-001`). The command looks up the existing spec directory.
- **Ad-hoc description** — Describe the feature in your own words. No
  catalog entry required.
- **Empty** — The command will ask what you want to specify.

**Modes:**

| Mode | Trigger | What happens |
|------|---------|-------------|
| **New spec** | Default — no `--parent` flag, not on an existing spec branch | Creates branch `YYMM-NNN-short-name`, directory, and spec file |
| **Sub-spec** | `--parent YYMM-NNN` flag provided | Creates child spec `YYMM-NNN.N` linked to parent (see Sub-specs below) |
| **Re-specify** | Run on an existing spec branch or spec named explicitly | Updates the existing spec in place (if unimplemented) |

**Sub-specs:**

Use `--parent YYMM-NNN` to create a child spec under an existing parent:

```
/ais.spec.specify --parent 2603-001 Add OAuth2 flow for third-party login
```

This creates `2603-001.1` with its own branch and directory. The
framework checks parent implementation status first:

- **Parent not built yet** — asks whether you'd rather update the parent
  instead of creating a sub-spec.
- **Parent partially or fully built** — proceeds with the sub-spec. It
  gets its own full lifecycle (design, tasks, implement).

Sub-specs are useful when:
- A feature is already implemented but needs an extension
- The project plan flags a large spec with sub-spec candidates
- Different parts of a spec need different technical disciplines

**Re-specify:**

When run on a branch that already has a spec:

- **Unimplemented** (0 tasks done) — updates the spec in place. Warns
  if design.md or tasks.md exist (they'll need regeneration).
- **Partially or fully implemented** — warns and suggests creating a new
  spec or sub-spec instead.

**Key behaviors:**

- Assigns YYMM-NNN IDs based on the current date. The YYMM prefix will
  differ from any examples in docs or the catalog.
- Creates a git branch and directory via the `create-new-feature.sh` script.
- Writes a compact **Alignment Brief** near the top of the spec so reviewers
  can quickly re-anchor on the objective, actors, scenarios, and guiding
  principles before diving into requirements.
- Captures lightweight **QA/UAT Readiness**: acceptance owner/reviewer, UAT
  scenario inventory, test data assumptions, manual/exploratory focus, and
  requirement-to-acceptance traceability.
- Limits clarification questions to a maximum of 3, prioritized by
  scope impact. Makes informed guesses for everything else and documents
  assumptions.
- Validates the spec against a quality checklist (content quality,
  requirement completeness, constitution alignment, feature readiness).
- Focuses on **what** and **why**, never **how**. No tech stack, APIs,
  or code structure in specs.
- Updates spec.md frontmatter status to "defining".

---

### `/ais.spec.design`

Creates the technical design — researches unknowns, defines the data model,
generates API contracts, decides whether `implementation-plan.md` is needed,
and validates against the constitution.

| | |
|---|---|
| **Input** | Optional. Additional tech context or guidance (e.g., "Use Tailwind for CSS"). |
| **Reads** | `spec.md`, `specs/constitution.md`, `specs/.architecture/06-tech-stack.md`, `specs/.architecture/07-decisions.md`, `.specify/templates/design-template.md`, `PLANS.md` |
| **Produces** | `design.md`, `research.md`, `data-model.md`, `contracts/*`, `quickstart.md` |
| **Prerequisites** | Must be on a feature branch with `spec.md` |

**Phases:**

1. **Phase 0 — Research.** Identifies unknowns from the technical context
   (marked "NEEDS CLARIFICATION"), dispatches research tasks, and
   consolidates findings into `research.md` with decisions, rationale,
   and rejected alternatives.

2. **Phase 1 — Design & Contracts.** Extracts entities from the spec into
   `data-model.md`, generates API contracts from functional requirements
   into `contracts/`, and creates `quickstart.md` with integration
   scenarios.

**Key behaviors:**

- Fills a Constitution Compliance table — every constitutional principle
  gets a Pass/Justified status. MUST violations without justification
  halt the command.
- Fills a **Verification Strategy** covering automated checks, manual/UAT scope,
  test data, environments, observability evidence, QA judgment areas, and
  deferred or retired tests.
- Fills an **Implementation Planning** section that decides whether the spec
  needs `implementation-plan.md` and, if so, why and what the milestone
  shape should be.
- Reads project-wide tech stack and architectural decisions to maintain
  consistency across specs.
- Sub-specs are fully independent — they inherit no parent design state.
- Updates spec.md frontmatter status to "planning".

---

### `/ais.spec.tasks`

Generates a dependency-ordered task list, optionally creates
`implementation-plan.md` for larger or riskier work, and runs a consistency
check across all spec artifacts.

| | |
|---|---|
| **Input** | Optional. Additional context for task generation. |
| **Reads** | `design.md`, `spec.md`, `data-model.md`, `contracts/*`, `research.md`, `quickstart.md`, `implementation-plan.md` (if it already exists), `specs/constitution.md`, `specs/.architecture/06-tech-stack.md`, `PLANS.md` |
| **Produces** | `tasks.md`, `implementation-plan.md` (when required) |
| **Prerequisites** | Must be on a feature branch with `design.md` and `spec.md` |

**Task format:**

Every task follows a strict checklist format:

```
- [ ] T001 [P] [US1] Description with file path
```

- `T001` — sequential ID in execution order
- `[P]` — present only if the task can run in parallel
- `[US1]` — user story reference (required in story phases, omitted in
  setup/polish)

**Phase structure:**

| Phase | Contains |
|-------|---------|
| Phase 1: Setup | Project initialization, dependencies, configuration |
| Phase 2: Foundation | Blocking prerequisites for all stories |
| Phase 3+: Stories | One phase per user story in priority order (P1, P2, P3...) |
| Final: Polish | Cross-cutting concerns, cleanup, documentation |

**Pre-flight check:**

If `tasks.md` or `implementation-plan.md` already contain live execution
progress, the command warns and offers three options:
- **(A) Overwrite** — replace the existing execution artifacts
- **(B) Create as `tasks-v2.md` / `implementation-plan-v2.md`** — preserve the originals
- **(C) Abort**

**Consistency check:**

After generating tasks, automatically validates across all artifacts:

- **Coverage gaps** — requirements with no tasks, tasks with no requirements
- **Duplication** — near-duplicate requirements
- **Ambiguity** — vague terms lacking measurable criteria
- **Constitution alignment** — violations of MUST principles
- **Inconsistency** — terminology drift, conflicting requirements

Findings are severity-rated (Critical, High, Medium, Low). Critical issues
produce a warning recommending resolution before implementation.

**Key behaviors:**

- Tasks are organized by user story to enable independent implementation
  and testing.
- Adds verification work when required by the spec, acceptance criteria,
  Verification Strategy, risk profile, or constitution gates.
- Creates `implementation-plan.md` only when the design says it is required
  or the user explicitly asks for a deeper implementation plan.
- Uses `implementation-plan.md` for milestone narrative, validation, and
  recovery guidance rather than duplicating the full task list.
- When an implementation plan is created, includes validation success/failure
  signals, an evidence ledger, QA/UAT and deployment-readiness evidence,
  review plan, worktree decision, and debugging recovery guidance.
- Tests are conditional, not blind: generated when requested or required by
  spec risk, acceptance criteria, Verification Strategy, or constitution gates.
- Sub-specs go through task generation independently.
- Updates spec.md frontmatter status to "ready".

---

### `/ais.spec.implement`

Executes the task plan phase-by-phase, writing code and tests, marking
tasks complete as it goes, and maintaining `implementation-plan.md` when it
exists. Completion is gated by review and fresh validation evidence.

| | |
|---|---|
| **Input** | Optional. Additional implementation guidance. |
| **Reads** | `tasks.md`, `implementation-plan.md` (if present), `design.md`, `spec.md`, `data-model.md`, `contracts/*`, `research.md`, `quickstart.md`, `specs/constitution.md`, `PLANS.md` |
| **Produces** | Application code in `source/`, tests in `tests/`, updated `tasks.md` with checked-off tasks, updated `implementation-plan.md` when present |
| **Prerequisites** | Must be on a feature branch with `tasks.md` and `design.md` |

**Checklist gate:**

Before starting, scans `checklists/` for any incomplete items. If found,
displays the status table and asks whether to proceed or wait.

**Execution rules:**

- Executes phases in order (Setup → Foundation → Stories → Polish)
- Respects task dependencies — sequential tasks run in order, `[P]` tasks
  can run in parallel
- Can use opt-in per-spec worktree isolation when requested or required by
  `implementation-plan.md`
- Marks each task `[X]` in `tasks.md` as it completes
- If `implementation-plan.md` exists, updates progress, discoveries,
  decisions, outcomes, review results, and validation evidence as the work
  proceeds
- Halts on non-parallel task failure; for parallel tasks, continues with
  successful ones and reports failures
- Creates/verifies ignore files (`.gitignore`, `.dockerignore`, etc.)
  based on the detected tech stack
- Runs spec compliance and code quality review gates after each phase or
  user story before moving on
- Runs QA/UAT review gates when required, including automated evidence,
  manual/UAT scenario results, QA status, deferred test disposition, and
  deployment readiness
- Uses root-cause debugging for unexpected failures before applying fixes; if
  repeated fix attempts fail, routes to `/ais.maintain.debug`

**Constitution enforcement:**

- Enforces MUST rules throughout all phases (e.g., strict mode, typed
  abstractions, integration patterns)
- Runs a constitution gate check at completion — lists each applicable
  quality gate with pass/fail status
- Flags blocking issues if any MUST gate fails

**Key behaviors:**

- Reports progress after each completed task.
- Keeps `implementation-plan.md` restartable from repo state alone when the
  file exists.
- Requires fresh evidence for applicable automated checks, manual/UAT
  scenarios, QA status, deferred or retired test items, and deployment
  readiness before completion.
- Auto-updates spec frontmatter status: "in-dev" when the first task
  completes, "complete" only when tasks are done and review, evidence, and
  constitution gates pass.

---

## Reporting

Report commands derive live status and measurement context from repo state.
They all call `gather-repo-state.sh` internally and format the output for
different audiences.

### `/ais.report.metrics`

Generates an **internal outcome metrics report** with delivery speed,
predictability, review quality, rework, traceability, methodology adoption,
and economics.

| | |
|---|---|
| **Input** | Optional. Reporting period or focus area. |
| **Reads** | All `specs/*/spec.md` frontmatter, task files, git history, previous metrics reports, `gh` CLI metadata when available |
| **Produces** | `specs/.project-plan/reports/YYYY-MM-DD-HHMM-metrics.md` + console output |
| **Prerequisites** | At least one spec directory exists |

**Sections:** Executive Metrics Summary, Board-Level Outcome View, Operating
Metrics View, Adoption and Governance Indicators, Per-Metric Calculations,
Evidence Sources and Limitations, Data Gaps, Instrumentation Backlog, Trend
Notes.

**Evidence-first** — every metric is marked measured, estimated, unavailable,
or not applicable, with confidence, formula, evidence sources, data gaps, and
recommended instrumentation.

---

### `/ais.report.standup`

Generates an **internal daily standup report** with active work, blockers,
stale specs, and warnings.

| | |
|---|---|
| **Input** | Optional. Time range or spec filter. |
| **Reads** | All `specs/*/spec.md` frontmatter, git history, `gh` CLI (if available) |
| **Produces** | `specs/.project-plan/reports/YYYY-MM-DD-HHMM-standup.md` + console output |
| **Prerequisites** | At least one spec directory exists |

**Sections:** Active Work, Status Changes, Blocked, Stale (14+ days no
activity), Warnings (unapproved implementations, unassigned specs), Summary.

**For internal team only** — includes git usernames, branch names, and
implementation details.

---

### `/ais.report.status`

Generates a **client-facing status report** with progress summary, pipeline
status, and pending decisions.

| | |
|---|---|
| **Input** | Optional. Additional context for the executive summary. |
| **Reads** | All `specs/*/spec.md` frontmatter, `specs/.project-plan/*`, git history |
| **Produces** | `specs/.project-plan/reports/YYYY-MM-DD-HHMM-status.md` + console output |
| **Prerequisites** | At least one spec directory exists |

**Sections:** Executive Summary, Overall Progress, Pipeline Status (Complete /
In Progress / Upcoming), Pending Decisions, Risks, Next Steps.

**Client-safe** — no git usernames, stale warnings, or implementation details.

---

### `/ais.report.project`

Generates a **comprehensive internal project report** with full pipeline
status, team activity, dependency graph, and health indicators.

| | |
|---|---|
| **Input** | Optional. Filters or focus areas. |
| **Reads** | All `specs/*/spec.md` frontmatter, `specs/.project-plan/*`, `specs/.architecture/*`, git history, `gh` CLI |
| **Produces** | `specs/.project-plan/reports/YYYY-MM-DD-HHMM-project.md` + console output |
| **Prerequisites** | At least one spec directory exists |

**Sections:** Project Overview, Architecture Summary, Spec Pipeline by Status,
Detailed Spec Status (per-spec cards with sub-spec rollup), Team Activity,
Unassigned Specs, Dependency Graph (Mermaid), Health Indicators.

---

### `/ais.report.retrospective`

Generates an **internal project retrospective report** focused on spec-driven
delivery adoption, process improvement, delegation, and qualitative on-spec
drift.

| | |
|---|---|
| **Input** | Optional. Lookback, date range, milestone, phase, or focus area. |
| **Reads** | All report inputs plus recent reports, spec lifecycle artifacts, git history, `gh` CLI when available, and latest `*-metrics.md` when present |
| **Produces** | `specs/.project-plan/reports/YYYY-MM-DD-HHMM-retrospective.md` + console output |
| **Prerequisites** | At least one spec directory exists |

**Sections:** Evidence Reviewed, Retrospective Summary, Start, Stop, Continue,
On-Spec Drift, Team Adoption and Delegation, Optional Metrics Signals, AIS
Specify Improvement Candidates, Project Follow-Up Actions, Next Retrospective.

**For internal team only** - includes candid process findings, branch/spec
workflow details, and reusable AIS Specify improvement candidates.

**Cadence:** Run monthly on active projects, at major milestones or phase
boundaries, and after meaningful process friction, rework, incidents, or
adoption changes. By default, the lookback is since the latest previous
retrospective report, or the previous 30 days when none exists.

---

## Maintenance

### `/ais.maintain.clarify`

Smart router that operates in two modes depending on context. Handles
both new project-level context and spec-level ambiguity resolution.

| | |
|---|---|
| **Input** | Depends on mode (see below). |
| **Reads** | Varies by mode — project plan, architecture, constitution, feature specs |
| **Produces** | Incremental updates to existing artifacts (never regenerates from scratch) |
| **Prerequisites** | For project-level: `specs/.project-plan/` must exist. For spec-level: must be on a feature branch with `spec.md`. |

**Routing:**

| Context | Mode | What happens |
|---------|------|-------------|
| File path, directory, or pasted content provided | **Project-level** | Ingests new context, applies surgical updates to project plan and architecture |
| On a feature branch (`YYMM-NNN-*`) with no source material | **Spec-level** | Scans the spec for ambiguities, asks targeted clarification questions |
| Neither | **Ask** | Prompts the user for direction |

**Project-level mode:**

Reads new source material (revised SOW, transcript, decision resolution,
etc.), classifies it by authority tier, triages changes across artifacts,
and applies incremental updates.

- Presents all proposed changes for approval before modifying anything.
- Flags commercial or contractual changes separately: deliverables, acceptance
  criteria, period of performance, pricing/payment terms, funding/program
  commitments, and contractual compliance commitments require proposal/SOW or
  change-order review.
- Updates specific files within `specs/.project-plan/` and
  `specs/.architecture/` — never rewrites entire documents.
- Routes staffing, green-sheet, timeline, funding, and compliance updates to
  the project plan only for delivery impacts; contractual commitments remain
  governed by signed source material.
- Keeps `01-charter.md`'s Alignment Brief in sync when project objective,
  audience, scenarios, or guiding principles change.
- Delegates governance content to `/ais.setup.constitution`.
- Flags spec-specific detail for spec owners — does not modify feature
  spec directories.
- Archives processed files to `.project-context/.archive/`.
- Cross-checks project plan and architecture for consistency after updates.

**Spec-level mode:**

Scans the active feature spec for ambiguities across a structured
taxonomy (scope, data model, UX flows, non-functional requirements,
integrations, edge cases, constraints, terminology).

- Checks implementation status first:
  - **Unimplemented** — updates spec in place
  - **Partially implemented** — warns about potential rework, offers
    options (update in place or create new spec)
  - **Fully implemented** — recommends creating a new spec instead
- Keeps the spec's Alignment Brief synced with clarified objective, actors,
  scenarios, and guiding principles.
- Asks a maximum of 5 questions, one at a time, with recommended answers
- Integrates each answer into the spec immediately after acceptance
- Appends a Clarifications log with session date and Q&A pairs

---

### `/ais.maintain.debug`

Diagnoses implementation, test, build, integration, or runtime failures using a
root-cause workflow before any fix is proposed.

| | |
|---|---|
| **Input** | Failure description, command output, logs, test name, or symptom. |
| **Reads** | Active feature artifacts when available (`spec.md`, `design.md`, `tasks.md`, `implementation-plan.md`, research/quickstart/contracts), `specs/constitution.md`, relevant source/tests/logs |
| **Produces** | Root-cause diagnosis, evidence, minimal fix plan, regression proof, and optional recovery task/plan updates when preparing handoff |
| **Prerequisites** | None for repository-level diagnosis. Active feature branch required for AIS implementation handoff. |

**Debug flow:**

1. Capture the exact symptom, failing command, logs, assertions, and exit status.
2. Reproduce with the smallest reliable command or scenario.
3. Check recent changes and compare against the nearest working pattern.
4. Trace bad data, state, request, or control flow back to its source.
5. Test one root-cause hypothesis at a time.
6. Identify the regression test or focused validation that should fail before
   the fix and pass afterward.

**Handoff contract:**

- Default mode is diagnosis; it does not edit production code unless explicitly
  asked.
- If implementation should resume through `/ais.spec.implement`, the command
  ensures there is a concrete recovery task in `tasks.md` when the user asks it
  to prepare the handoff.
- When `implementation-plan.md` exists, failure evidence goes into
  `Surprises & Discoveries` and the selected fix path goes into `Decision Log`.
- If no task plan exists, it recommends `/ais.spec.tasks` or a new spec/sub-spec
  instead of handing off directly.

---

### `/ais.github.sync`

Bidirectional sync between local spec artifacts and GitHub milestones,
issues, and labels.

| | |
|---|---|
| **Input** | Optional. `push`, `pull`, `status`, or empty for full sync. |
| **Reads** | `spec.md`, `tasks.md` |
| **Produces** | GitHub milestones + issues, local `.github-sync.json` metadata |
| **Prerequisites** | Must be on a feature branch with `spec.md` and `tasks.md`. GitHub remote must be configured. |

**Modes:**

| Argument | What happens |
|----------|-------------|
| *(empty)* | Full sync — push local to GitHub, then pull GitHub state back |
| `push` | Create/update GitHub milestones, issues, and labels from local artifacts |
| `pull` | Read GitHub issue states and apply to local task checkboxes and status tracker |
| `status` | Dry-run — show sync state without making any changes |

**Key behaviors:**

- Only user stories become GitHub issues. Tasks are embedded as checkboxes
  within their parent story's issue body.
- Setup, foundation, and polish tasks (no story reference) are tracked
  only in `tasks.md` locally.
- Creates a per-feature `.github-sync.json` to track the mapping between
  local spec IDs and GitHub issue/milestone numbers.
- Bootstraps labels on first run (`P1`, `P2`, `P3`, `spec`, `story`,
  phase labels).

---

## Spec Versioning

All spec IDs use the **YYMM-NNN** format derived from the current date:

```
YYMM-NNN          Top-level spec     (e.g., 2603-001)
YYMM-NNN.N        Sub-spec           (e.g., 2603-001.1)
```

- **YYMM** — two-digit year + two-digit month when the spec is created
- **NNN** — sequential number within that month, zero-padded to 3 digits
- **Branches** match the spec ID: `2603-001-focus-timer`
- **Directories** match the branch: `specs/2603-001-focus-timer/`

The YYMM prefix changes with the calendar. Spec IDs in documentation,
the catalog, and examples reflect the date they were generated — your
IDs will differ when you run the commands.

---

## Status Tracking

Status is tracked in two layers:

**Frontmatter (canonical):** Each spec lifecycle command updates the `status`
field in the spec.md YAML frontmatter:

```
/ais.spec.specify    →  status: "defining"
/ais.spec.design     →  status: "planning"
/ais.spec.tasks      →  status: "ready"
/ais.spec.implement  →  status: "in-dev"  →  status: "complete" after tasks, review gates, constitution gates, and validation evidence pass
```

**Git state (verification):** Report commands (`/ais.report.*`) derive
pipeline status from git signals (branches, commits, PRs, task completion)
and flag discrepancies with frontmatter status.

Spec.md YAML frontmatter is the canonical source of truth for status.
Use `/ais.report.*` commands for current state derived from the repo.
