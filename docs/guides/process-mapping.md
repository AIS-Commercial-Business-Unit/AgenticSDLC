# Process Mapping: Agile to Spec-Driven

How traditional Agile ceremonies and concepts translate to the AIS
spec-driven framework.

## Concept Mapping

| Traditional Agile | Spec-Driven Equivalent | Notes |
|---|---|---|
| **Product backlog** | Spec pipeline (catalog + branches) | Specs in the catalog are the backlog. Pipeline status replaces backlog ordering. |
| **Sprint planning** | Spec review with client (approve scope before design) | Instead of pulling stories into a sprint, you approve specs for design and implementation. |
| **Daily standup** | `/ais.report.standup` | Auto-generated from repo state. No manual status updates needed. |
| **Sprint review / demo** | Demo against approved specs | Each spec has defined acceptance criteria. Demo validates them. |
| **Sprint retrospective** | `/ais.report.retrospective` plus per-spec lessons learned | Generates start/stop/continue adoption findings from repo evidence; per-spec notes still live in spec artifacts or `implementation-plan.md` when present. |
| **Status reports** | `/ais.report.status` | Auto-generated for client consumption. |
| **Outcome metrics** | `/ais.report.metrics` | Measures speed, quality, traceability, and economics from repo evidence. |
| **Definition of Done** | Constitution + quality gates | The constitution defines MUST and SHOULD rules. Quality gates are checked at each phase. |
| **Story points** | Spec effort sizing (S/M/L/XL) + playbook ROM | T-shirt sizing at spec level. Playbooks provide ROM ranges by complexity. |
| **Epic / Feature** | Spec (YYMM-NNN) | Each spec is a coherent deliverable with its own lifecycle. |
| **User Story** | User story within spec.md | Stories live inside specs, organized by priority (P1, P2, P3). |
| **Task** | Task in tasks.md | Checklist items with IDs, parallel markers, and story references. |
| **Sprint** | Spec lifecycle iteration | One spec through specify → design → tasks → implement. |
| **Release** | Phase completion | Project phases group specs into deliverable milestones. |
| **Product Owner** | Client stakeholder + Business Analyst | BA drives spec creation; client validates scope. |
| **Scrum Master** | Project Manager | PM manages pipeline flow, removes blockers, drives reporting. |
| **Velocity** | Tasks completed per period | Tracked in `/ais.report.standup` and `/ais.report.project`. |

## Key Differences

### Scope is locked per spec, not per sprint

In Agile, sprint scope can flex. In spec-driven development, each spec has
defined scope (user stories, requirements, acceptance criteria) that is
locked before design begins. Changes during implementation create new specs
or sub-specs rather than modifying the current one.

### Design happens before tasks, not during sprint

The spec lifecycle separates design from implementation. Research, data
modeling, and API contracts are resolved before tasks are generated. This
front-loads decisions and reduces implementation surprises.

### Status is derived, not reported

Teams don't update status manually. Frontmatter status in spec.md is
updated by lifecycle commands. Report commands derive live status from
git state. This eliminates stale status tracking and "what did you do
yesterday?" overhead.

### Quality gates are automated

The constitution defines quality standards that are checked at each phase.
MUST violations halt the pipeline. This replaces manual "definition of
done" checks with enforcement built into the workflow.

## Running a "Sprint" in Spec-Driven

1. **Planning**: Review spec catalog. Pick specs for the iteration based on
   dependencies and priority.
2. **Alignment readout**: Re-read the project charter or active spec's
   Alignment Brief before planning, review, or clarification conversations.
3. **Daily sync**: Run `/ais.report.standup` instead of standing up.
4. **Work**: Each developer runs spec lifecycle on their assigned spec.
5. **Review**: Demo completed specs against acceptance criteria.
6. **Report**: Run `/ais.report.status` for client visibility.
7. **Retrospective**: Run `/ais.report.retrospective` monthly, at milestone
   boundaries, or after meaningful process friction. Use the start/stop/continue
   findings to identify team adoption improvements, drift follow-up, and
   reusable AIS Specify improvements.
