# UX Integration Guide

How to add a UX layer to AIS without changing the command surface.

## Why This Works

AIS already has the right lifecycle for UX work:

- `/ais.spec.specify` defines user intent and acceptance criteria
- `/ais.spec.design` captures design decisions and constraints
- `/ais.spec.tasks` converts decisions into executable work
- `/ais.spec.implement` delivers and verifies outcomes

Instead of introducing a separate UX command, treat UX as a first-class
concern in each existing phase.

## Recommended UX Workflow

### 1. Specify: Add UX and Accessibility Requirements

In `spec.md`, ensure each P1 user story includes:

- Primary user goal and success path
- Empty, loading, and error expectations
- Accessibility acceptance statements (keyboard, focus, semantics)
- Responsive expectations for key breakpoints

Example requirement style:

- FR-UX-001: The checkout form is fully keyboard operable.
- FR-UX-002: The dashboard supports mobile and desktop layouts.
- FR-UX-003: Critical actions expose clear loading and error feedback.

### 2. Design: Capture Interaction Decisions

In `design.md`, add a UX subsection with:

- Information architecture (screen and navigation structure)
- Interaction states (default, hover, focus, disabled, loading, error)
- Design tokens (color, type, spacing, radius, motion)
- Accessibility targets (for example WCAG level chosen by project)

Optional per-spec artifacts:

- `ux/design-system.md`
- `ux/journeys.md`
- `ux/accessibility.md`

### 3. Tasks: Convert UX Into Verifiable Work

In `tasks.md`, include both build tasks and verification tasks.

Sample task patterns:

- Build responsive layout for US1 screen set
- Implement focus management for modal/dialog flows
- Add semantic labels and announcements for assistive technology
- Validate contrast, keyboard traversal, and reduced motion behavior

### 4. Implement: Ship Evidence, Not Only Code

For each UX-related task, attach evidence in PRs:

- Before/after screenshots or short recordings
- Accessibility check output
- Notes for unresolved UX debt and planned follow-up

## Constitution Updates (Project-Level)

Add UX quality gates to `specs/constitution.md` so they are enforced during
`/ais.spec.design` and implementation review.

Suggested gates:

- QG-UX-001: P1 journeys defined for desktop and mobile
- QG-UX-002: Keyboard access and visible focus for interactive controls
- QG-UX-003: Contrast and readability targets satisfied
- QG-UX-004: Loading, empty, and error states defined on critical screens

## Mapping UI UX Pro Max Ideas to AIS

Useful concepts to adopt from UI UX Pro Max:

- Design-system-first output for consistent implementation
- Domain-aware style guidance (industry/context specific)
- Pre-delivery UX checklist as an explicit quality gate
- Persisted UX guidance as reusable per-spec artifacts

Concepts to avoid importing directly:

- Tool-specific installation and assistant-specific wrappers
- Repository-specific scripts that add runtime dependencies unless needed

## Adoption Plan

1. Start with one feature spec that has visible UI complexity.
2. Add the optional `ux/` artifacts under that spec.
3. Add 2-4 UX quality gates to `specs/constitution.md`.
4. Measure cycle impact for one sprint and adjust templates if useful.

## When to Keep UX Lightweight

Keep UX scope minimal when the spec is API-only, infrastructure-only, or
internal automation with no meaningful end-user interface.
