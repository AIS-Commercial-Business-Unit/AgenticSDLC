# Delivery Workflow Guide

How to take a project from plan through architecture, specification, design,
task generation, and implementation using the AIS spec-driven framework.

## Pipeline Overview

```
PROJECT SETUP (once):
  /ais.setup.plan          → specs/.project-plan/
  /ais.setup.architecture  → specs/.architecture/
  /ais.setup.constitution  → specs/constitution.md

SPEC LIFECYCLE (per feature):
  /ais.spec.brainstorm → Spec Seed Brief (optional pre-spec discovery)
  /ais.spec.specify   → specs/YYMM-NNN-name/spec.md     (defining)
  /ais.spec.design    → design.md, data-model, contracts  (planning)
  /ais.spec.tasks     → tasks.md, implementation-plan.md* (ready)
  /ais.spec.implement → execute tasks with review/evidence gates (in-dev → complete)

REPORTING (anytime):
  /ais.report.standup  → specs/.project-plan/reports/YYYY-MM-DD-HHMM-standup.md
  /ais.report.status   → specs/.project-plan/reports/YYYY-MM-DD-HHMM-status.md
  /ais.report.project  → specs/.project-plan/reports/YYYY-MM-DD-HHMM-project.md
  /ais.report.metrics  → specs/.project-plan/reports/YYYY-MM-DD-HHMM-metrics.md
```

## Step 1: Project Setup

### Plan (`/ais.setup.plan`)

Reads `.project-context/` (and `specs/.presales/` if pre-sales was done)
to produce the project plan:

- Classifies sources by authority tier (T1-T6)
- Decomposes into YYMM-NNN catalog entries
- Maps dependencies and phases
- Identifies risks and open decisions
- If a signed SOW exists, maps proposed specs to delivery specs

### Architecture (`/ais.setup.architecture`)

Reads the project plan and produces the solution architecture:

- Wardley map, C4 diagrams, bounded context map
- Tech stack decisions with ADRs
- Data flow and critical path sequences
- Constitution seed for quality gates

### Constitution (`/ais.setup.constitution`)

Establishes non-negotiable project standards:

- Principles (MUST and SHOULD rules)
- Technology standards
- Quality gates
- Integration patterns

## Step 2: Spec Lifecycle

Run for each component spec, in order.

### Brainstorm (`/ais.spec.brainstorm`) — optional

Use this only when an idea is too rough for `/ais.spec.specify` and needs
discovery, scope shaping, or decomposition first. It produces a Spec Seed Brief
and recommended `/ais.spec.specify` input.

- Does not create `specs/YYMM-NNN-*` feature specs
- Does not change `/ais.spec.specify`
- Saves to `specs/.discovery/brainstorms/` only when explicitly requested
- Can run before project setup, with missing context marked as unknown

### Specify (`/ais.spec.specify`)

Creates user stories, functional requirements, and success criteria.
Handles new specs, sub-specs, and re-specification.

- Creates branch and directory: `YYMM-NNN-short-name`
- YAML frontmatter tracks status, owner, priority, effort
- Captures lightweight QA/UAT readiness: acceptance owner, UAT scenarios,
  test data assumptions, traceability, and manual/exploratory focus
- Max 3 clarification questions
- Quality validation checklist

### Design (`/ais.spec.design`)

Creates technical design with research, data model, and API contracts.

- Phase 0: Research unknowns
- Phase 1: Data model, contracts, quickstart
- Adds Verification Strategy covering automated checks, manual/UAT scope, data,
  environments, observability, QA judgment, and deferred tests
- Decides whether the spec needs `implementation-plan.md`
- Constitution compliance check

### Tasks (`/ais.spec.tasks`)

Generates dependency-ordered task list with consistency validation.

- Strict checklist format: `- [ ] T001 [P] [US1] Description`
- Organized by user story for independent implementation
- Generates verification tasks when required by the spec, risk profile,
  acceptance criteria, Verification Strategy, or constitution gates
- Creates `implementation-plan.md` when the spec is large or risky enough to need a living implementation guide
- Cross-artifact consistency check

### Implement (`/ais.spec.implement`)

Executes tasks phase-by-phase, writing code and tests.

- Phase-by-phase execution with dependency respect
- Marks tasks complete as it goes
- Keeps `implementation-plan.md` current when present
- Constitution enforcement throughout
- Optional per-spec worktree isolation when requested or required by the plan
- Spec compliance and code quality review gates after each phase or story
- QA/UAT review gate when manual, acceptance, or deployment readiness evidence
  is required
- Evidence-before-completion validation before status becomes `complete`
- Root-cause debugging flow for failed tests, builds, integrations, or runtime checks

`*` `implementation-plan.md` is optional. Use it for larger specs, migrations,
multi-PR efforts, or work that needs explicit milestone, validation, and
recovery guidance.

## Optional UX Track

Use this when a spec has meaningful end-user interaction (web, mobile, portal,
dashboard, form-heavy workflows).

### Where UX Fits in the Existing Commands

- **Specify** (`/ais.spec.specify`): Add explicit UX requirements and
  accessibility acceptance criteria in `spec.md`.
- **Design** (`/ais.spec.design`): Capture UX decisions (interaction model,
  responsive behavior, states, design tokens) in `design.md`.
- **Tasks** (`/ais.spec.tasks`): Include UX implementation and verification
  tasks (keyboard navigation, focus order, contrast, reduced motion,
  breakpoints).
- **Implement** (`/ais.spec.implement`): Deliver UX tasks with evidence
  (screenshots/video, checklist results, test output).

### Suggested UX Artifacts (per spec)

Optional files inside each feature spec directory:

- `ux/design-system.md` — colors, typography, spacing, elevation, motion,
  component usage rules.
- `ux/journeys.md` — key user flows, entry points, expected outcomes,
  error/empty/loading states.
- `ux/accessibility.md` — WCAG targets, keyboard behavior, focus model,
  screen reader naming strategy.

### UX Quality Gate Suggestions

Add project-specific gates in `specs/constitution.md`, such as:

- All P1 user journeys include desktop and mobile behavior.
- Interactive elements are keyboard operable with visible focus.
- Text and control contrast meets defined accessibility threshold.
- Motion respects reduced-motion preference.
- Empty, loading, and error states exist for critical screens.

## QA/UAT Track

Use this when a spec has business-critical behavior, acceptance-owner review,
manual judgment, regulated evidence needs, release gates, or meaningful risk.

### Where QA/UAT Fits in the Existing Commands

- **Specify** (`/ais.spec.specify`): Capture acceptance owner/reviewer, UAT
  scenario inventory, test data assumptions, traceability notes, and known
  manual/exploratory focus.
- **Design** (`/ais.spec.design`): Define Verification Strategy across
  automation, manual/UAT, data, environment, observability, QA judgment, and
  deferred or retired tests.
- **Tasks** (`/ais.spec.tasks`): Add verification tasks only when required by
  the spec, acceptance criteria, risk profile, Verification Strategy, or
  constitution gates.
- **Implement** (`/ais.spec.implement`): Record fresh automated evidence,
  manual/UAT scenario results, QA status, deferred test disposition, and
  deployment readiness before completion.

### Suggested QA/UAT Artifacts (per spec)

Most specs should use the built-in `spec.md`, `design.md`, `tasks.md`, and
`implementation-plan.md` sections. Add a companion test artifact only when the
workflow has enough complexity to justify it, such as multiple UAT owners,
regulated evidence, migration rehearsal, or detailed exploratory charters.

### QA/UAT Quality Gate Suggestions

Add project-specific gates in `specs/constitution.md`, such as:

- P1/P2 requirements have objective acceptance criteria or a documented
  exception.
- Business-critical workflows identify acceptance owner, UAT scope, and test
  data assumptions before implementation.
- Required checks and manual/UAT evidence map back to requirements or user
  stories.
- Required QA review is passed, blocked with owner, or explicitly not
  applicable before completion.
- Release-blocking smoke, rollback, observability, and approval gates are
  satisfied or deferred with owner.

## Status Tracking

Status is tracked in two layers:

1. **Frontmatter** (canonical): Each spec.md has a `status` field in YAML
   frontmatter. Lifecycle commands update this automatically.

2. **Git state** (verification): Report commands derive pipeline status from
   git signals (branches, commits, PRs, task completion).

Reports flag discrepancies between frontmatter status and git-derived state.

## Implementation Plans

For straightforward specs, `tasks.md` is enough. For larger or riskier specs,
AIS can add `implementation-plan.md` as a living execution artifact.

Use it when the work involves:

- migrations or cutovers
- rollback or recovery risk
- multiple systems or contributors
- long-running implementation with discoveries expected mid-flight

The file should stay current during implementation. It is where milestone
progress, surprises, decision changes, validation steps, evidence ledger,
review plan, worktree decision, recovery guidance, and retrospective notes live.

## Reporting

Five report commands, all derived from repo state:

| Command | Audience | Content |
|---------|----------|---------|
| `/ais.report.standup` | Internal team | Active work, blockers, stale specs, warnings |
| `/ais.report.status` | Client | Progress, pipeline, decisions, risks |
| `/ais.report.project` | Project leads | Full pipeline, team activity, dependency graph, health |
| `/ais.report.metrics` | Engineering leaders | Outcome metrics, confidence, evidence, data gaps |
| `/ais.report.retrospective` | Internal team | Start/stop/continue recommendations, adoption signals, drift, process improvements |

## Sub-specs

Use `--parent YYMM-NNN` to create child specs:

```
/ais.spec.specify --parent 2603-001 Add OAuth2 flow
```

Sub-specs are independent — they get their own branch, directory, and full
lifecycle. Parent progress includes sub-spec rollup in reports.

## Maintenance

- `/ais.maintain.clarify` — Ingest new context or resolve spec ambiguities
- `/ais.maintain.debug` — Diagnose implementation failures before fixing
- `/ais.github.sync` — Bidirectional sync with GitHub issues and milestones

## Operations Handoff

When delivery transitions into support, use the
`.specify/playbooks/ops-continuity.md` playbook and
`.specify/templates/ops-playbook-template.md` to create an account-specific
ops handoff artifact.

The handoff should identify supported components, operational signals,
baseline alerts, ticket taxonomy, triage and escalation path, selected support
tier, enhancement backlog workflow, reporting cadence, and open readiness
gaps. If the client only needs a small retainer, produce the minimum viable ops
mode instead of implying a full managed service.
