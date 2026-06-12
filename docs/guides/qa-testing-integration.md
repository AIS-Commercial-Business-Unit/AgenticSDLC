# QA And Testing Integration Guide

How to add QA/UAT readiness to AIS without changing the command surface.

## Why This Works

AIS already has the right lifecycle for testing work:

- `/ais.spec.specify` defines what must be proven
- `/ais.spec.design` decides how proof will be gathered
- `/ais.spec.tasks` converts proof needs into executable work
- `/ais.spec.implement` delivers code, evidence, review status, and readiness

Instead of introducing `/ais.qa.*` commands, treat QA, testing, and UAT as a
first-class concern in each existing phase.

## Recommended QA/UAT Workflow

### 1. Specify: Capture Readiness Early

In `spec.md`, add a lightweight QA/UAT planning skeleton:

- Acceptance owner or reviewer
- UAT scenario inventory mapped to user stories or acceptance criteria
- Test data assumptions
- Requirement-to-acceptance traceability notes
- Known areas needing manual or exploratory validation

Keep this lightweight. The spec should identify what must be proven; it should
not become a full manual test script or implementation-specific test plan.

### 2. Design: Define The Verification Strategy

In `design.md`, add a `Verification Strategy` section covering:

- Automated checks: unit, integration, contract, accessibility, security,
  performance, smoke, or regression
- Manual/UAT scope: business-critical journeys, acceptance owner, exploratory
  focus, and out-of-scope items
- Test data and environment needs
- Observability evidence: logs, metrics, traces, audit records, screenshots,
  exports, or reports
- QA judgment areas that automation cannot fully replace
- Deferred or retired tests with rationale

Use automation for repeatable and deterministic behavior. Use manual QA/UAT for
business workflow confidence, exploratory judgment, and release readiness.

### 3. Tasks: Generate Verification Work When Required

In `tasks.md`, verification tasks are conditional. Do not generate tests for
every requirement by default. Generate automated, manual, UAT, data,
observability, or deployment-readiness tasks when required by:

- The spec or acceptance criteria
- The design Verification Strategy
- The risk profile
- Constitution quality gates
- An explicit user request such as TDD

Task descriptions should map back to user stories, requirements, acceptance
criteria, or gates where practical.

### 4. Implement: Ship Evidence And Readiness

During `/ais.spec.implement`, completion requires evidence for applicable
checks:

- Automated test, lint, build, smoke, or CI output
- Manual/UAT scenario results
- QA review status
- Deferred or retired test items with owner and rationale
- Deployment readiness gates such as rollback, smoke checks, observability,
  approvals, or release notes

For larger or riskier specs, put this evidence in `implementation-plan.md`.
For smaller specs, include the same evidence in the implementation report.

## Constitution Updates

Add project-specific QA/UAT quality gates to `specs/constitution.md` so they
are enforced during design, tasks, implementation, and PR review.

Suggested gates:

- QG-QA-001: P1/P2 requirements have objective acceptance criteria or a
  documented exception.
- QG-QA-002: Business-critical workflows identify acceptance owner, UAT scope,
  and test data assumptions before implementation.
- QG-QA-003: Required checks and manual/UAT evidence map back to requirements
  or user stories.
- QG-QA-004: Required QA review is passed, blocked with owner, or explicitly
  not applicable before completion.
- QG-QA-005: Release-blocking smoke, rollback, observability, and approval
  gates are satisfied or deferred with owner.

## Role Alignment

- Business analysts ensure requirements, acceptance criteria, and UAT scenarios
  are testable from day 1.
- QA/test leads review testability, Verification Strategy, task coverage,
  manual scope, and evidence quality.
- Technical leads ensure automation, observability, and deployment gates match
  the design and constitution.
- Project managers track readiness signals, blockers, deferred tests, and UAT
  acceptance status.
- Client or business stakeholders own UAT acceptance when the workflow requires
  explicit business approval.

## When To Keep QA Lightweight

Keep QA/UAT scope minimal when the spec is small, low-risk, internal, or
already covered by existing repeatable checks. Mark non-applicable categories as
`N/A` with rationale instead of inventing process.

Escalate to a deeper test plan or companion artifact only when the spec has
material business-critical workflows, regulated evidence needs, migration or
cutover risk, multiple acceptance owners, or complex manual scenarios.
