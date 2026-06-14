# Framework Features

The Agentic Engineering Framework is built around three headline features. Every phase of implementation traces back to one or more of these pillars.

---

## Pillar 1 — Governance

**"AI does exactly what you say, nothing more."**

Configurable autonomy levels (L0 Observe → L3 Execute), approval gates, governance registry, audit trail, and hard-constraint enforcement. Enterprises know they need governance but don't know how to implement it — this framework makes it concrete and operational.

→ [Governance Architecture](../governance/README.md)
→ [Governance Explorer](../../website/governance-explorer.html)

---

## Pillar 2 — Metrics & Observability

**"Prove the investment is working."**

There are no metrics in the IT world today for AI agent usage. This framework provides:

- **Agent activity tracking** — what agents ran, how often, how long
- **Workflow timing** — duration per activity, per AIS Specify step
- **Maturity progression** — baseline score → current score over time (was 22/100, now 61/100)
- **Manual → Governed ratio** — show the transition from ad-hoc to regulated
- **Framework adoption %** — how much of the framework a team has implemented
- **Governance health** — overdue reviews, upcoming reassessments
- **GitHub-native collection** — periodic workflow agents + GitHub API, committed as JSON, no external infrastructure

This is a major differentiator: IT leadership gets the metrics they've never had. Engineering teams can prove AI is delivering value.

→ [Metrics Dashboard](../../website/metrics.html)
→ [Metrics Collection](../guides/metrics-collection.md)
→ [Audit Trail](../../audit/README.md)

---

## Pillar 3 — Velocity & Traceability

**"Ship faster. Trace everything."**

Every deliverable linked to a requirement. Every agent action traceable to a human decision. Developers feel the speed gain. Leaders see the lineage. This is the end-to-end connected SDLC story — what makes the framework sticky once adopted.

- Artifact-based handoffs across the 9-step AIS Specify lifecycle
- Requirement → Spec → Design → Code → Test → Deploy lineage
- Human approval records at every high-risk boundary
- PR and issue traceability to governance events

→ [AIS Specify Lifecycle](../guides/ais-specify-lifecycle.md)
→ [Traceability Model](../guides/traceability.md)

---

## Feature Documentation

| Feature | Status | Phase |
|---------|--------|-------|
| [Governance](governance.md) | ✅ Active | Phase 1–3 |
| [Metrics & Observability](metrics-observability.md) | ✅ Active | Phase 3 |
| [Velocity & Traceability](velocity-traceability.md) | 🔄 In progress | Phase 4 |
| [Brownfield Onboarding](brownfield-onboarding.md) | ✅ Active | Phase 2 |
| [Agent Catalog](agent-catalog.md) | ✅ Active | Phase 3 |
| [Work Management Integration](work-management.md) | 🔜 Planned | Phase 6 |
| [Experiment Framework](experiments.md) | 🔜 Planned | Phase 7 |
