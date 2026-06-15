# Enterprise SDLC Standards

The Agentic Engineering Framework recommends a set of SDLC practices that
complement AI-assisted development. These standards are not arbitrary — each
addresses a failure mode that becomes more consequential when agents are
involved in the delivery process.

This directory contains the reference documentation for those practices.

---

## Contents

| Document | Description |
|----------|-------------|
| [branching-strategy.md](branching-strategy.md) | Recommended branching model, branch protection rules, naming conventions, and merge strategies for enterprise teams |
| [pull-request-standards.md](pull-request-standards.md) | PR size guidelines, review SLAs, draft/ready lifecycle, and auto-merge conditions |
| [maturity-checklist.md](maturity-checklist.md) | Self-assessment checklist across branch management, PR process, code review, CI/CD, documentation, governance, and security |
| [branch-protection-ruleset.json](branch-protection-ruleset.json) | GitHub branch protection ruleset in the GitHub API format, ready to apply via `gh` CLI or the GitHub UI |
| [pr-template.md](pr-template.md) | Standard PR description template with governance checklist |
| [CODEOWNERS.template](CODEOWNERS.template) | CODEOWNERS file template with ownership patterns for framework core, docs, CI, and playbooks |

---

## Why SDLC Discipline Matters for Agentic Engineering

When agents are involved in code generation, review, and deployment, SDLC
discipline is not optional — it is the primary control surface.

Without it:

- Agents merge changes without human review, because there is no required
  review process to enforce.
- AI-generated code reaches production without traceability, because there is
  no branch or PR audit trail.
- Governance rules are bypassed, because there is no CODEOWNERS file or ruleset
  to route changes to the right reviewers.
- Teams cannot measure improvement, because there is no baseline process to
  instrument.

With it:

- Every AI-generated change goes through the same review gates as human-authored
  changes.
- Governance-sensitive files (registry, schemas, CI configuration) are routed
  to designated reviewers automatically.
- The audit trail in PR history satisfies compliance requirements.
- Maturity self-assessment identifies the gaps that block safe adoption of
  higher autonomy levels.

---

## Relationship to the Governance Registry

The SDLC standards in this directory describe process-level controls. The
governance registry (`config/governance-registry.yaml`) describes agent-level
controls: what each agent is permitted to do, at what autonomy level, with what
approval requirements.

The two are complementary. SDLC controls gate the delivery process. Governance
controls gate agent behavior within that process.

An organization should complete the [maturity checklist](maturity-checklist.md)
before enabling L2 or L3 autonomy levels in the governance registry.

---

## Applying These Standards

These standards are recommendations, not hard requirements imposed by the
framework. Enterprise teams should adopt them in the order that delivers the
most value:

1. **Branch protection and CODEOWNERS** — Zero-cost controls with immediate
   governance value. Apply first.
2. **PR template** — Increases review quality and traceability with minimal
   process overhead.
3. **Maturity checklist** — Run before enabling higher autonomy levels.
4. **Branching and PR standards** — Operationalize the recommendations into
   team working agreements.

See the [Governance Initialization playbook](../playbooks/02-governance-init.md)
for a guided workflow.
