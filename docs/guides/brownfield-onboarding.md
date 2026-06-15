# Brownfield Repository Onboarding Guide

End-to-end guide for onboarding an existing (brownfield) repository into the AIS Agentic Engineering Framework.

This guide takes you from zero to a configured, governed repository ready for structured agentic engineering workflows.

**Estimated time:** 2–6 hours depending on repository maturity and team size.

---

## Overview

```
Step 1: Run Assessment    →  Understand the current state
Step 2: Review Gap Report →  Prioritise what to fix
Step 3: Run Initializer   →  Generate configuration
Step 4: Commit Config     →  Make it durable and reviewable
Step 5: Run Governance    →  Activate governance playbooks
```

---

## Prerequisites

Before starting, ensure:
- [ ] You have read access to the target repository
- [ ] You have write access (for Steps 3–5)
- [ ] GitHub Copilot or Claude Code is available in your environment
- [ ] You know your work management system (GitHub Issues / Jira / ADO)
- [ ] You have 2–6 hours of focused time

---

## Step 1: Run the Assessment

The assessment is a **read-only scan** of your repository. It produces a scored readiness report across 6 dimensions and identifies gaps.

### Run it

In GitHub Copilot Chat or Claude Code:
```
Use: .specify/prompts/brownfield.assess.md
Target: [your-repo-path-or-owner/repo]
```

### What you get

- `docs/assessment/readiness-assessment.yaml` — structured assessment data
- A human-readable summary printed to chat showing:
  - Overall score (0–100) and maturity tier
  - Top critical gaps
  - Recommended next steps

### Optional: Add supplemental context

If you have team surveys, architecture documents, or process docs, copy them to `docs/input/` before running the assessment. The assessor will incorporate them.

### Interpreting results

See [docs/assessment/README.md](../assessment/README.md) for score interpretation and maturity tier descriptions.

**Good starting points:**
- Score 0–24 (Foundation): Plan 4–8 hours of initialization work
- Score 25–49 (Developing): Plan 2–4 hours
- Score 50+ (Established/Advanced): Plan 1–2 hours for targeted gaps

---

## Step 2: Review the Gap Report

Read the assessment output carefully before running the initializer.

### Key sections to review

1. **Critical gaps** — These block safe agentic adoption. Address these in Step 5.
2. **overall_score and maturity_tier** — Sets expectations for the team.
3. **work_management.recommended** — Pre-selects your provider in Step 3.
4. **next_steps** — Ordered list of what to do; feed this into your work management system.

### Questions to answer before Step 3

- [ ] Which governance level (L1/L2/L3) is appropriate for your team's current trust level?
- [ ] Who is the human approver for agent actions?
- [ ] Which branches require protection?
- [ ] Which agent types will you enable first?

---

## Step 3: Run the Initializer

The initializer runs an interactive questionnaire and proposes configuration files. It requires explicit approval before writing anything.

### Run it

```
Use: .specify/prompts/brownfield.initialize.md
```

### What happens

1. The initializer reads `docs/assessment/readiness-assessment.yaml` as starting context
2. You answer a questionnaire (~15 questions, grouped by topic)
3. The initializer proposes `config/aispec.config.yaml` and `docs/assessment/initialization-state.yaml`
4. You review the proposed files
5. Type `APPROVE` to write them

### Work management configuration

If you want to configure work management separately or change it later, use the dedicated prompt:
```
Use: .specify/prompts/brownfield.workmanagement.select.md
```

This prompt asks 4 focused questions and explains the difference between fully-implemented (GitHub Issues) and stub providers (Jira, ADO — Phase 6).

---

## Step 4: Commit the Config

The configuration files written in Step 3 are the framework's source of truth. Commit them immediately.

```bash
git add config/aispec.config.yaml
git add docs/assessment/readiness-assessment.yaml
git add docs/assessment/initialization-state.yaml
git commit -m "chore: initialize AIS Agentic Engineering Framework

- Add aispec.config.yaml with governance defaults
- Add readiness assessment (score: [X]/100, tier: [tier])
- Add initialization state tracking

Maturity tier: [Foundation|Developing|Established|Advanced]
Next steps: see docs/assessment/README.md"
git push
```

**Branch note:** If your team uses PRs, create a branch and submit a PR. This gives stakeholders visibility into the framework's initial configuration decisions.

---

## Step 5: Run Governance Playbooks

With configuration committed, activate the governance infrastructure using these playbooks in order:

### 5a. Initialize Governance Registry

```
Use: .specify/prompts/brownfield.governance.init.md
```

Creates `config/governance-registry.yaml` with appropriate autonomy levels based on your assessment and answers from Step 3.

### 5b. Initialize Agent Catalog

```
Use: .specify/prompts/brownfield.agent.catalog.md
```

Creates `config/agent-catalog.yaml` with starter agent definitions based on your priority areas.

### 5c. Enable Audit Trail

```
Use: .specify/prompts/brownfield.audit.trail.md
```

Creates `config/audit-trail.yaml` and the `audit/` directory structure for append-only agent activity logging.

### 5d. Address Critical Gaps (if any)

For each critical gap identified in the assessment:

| Gap Area | Remediation Prompt or Action |
|----------|------------------------------|
| No Copilot instructions | Create `.github/copilot-instructions.md` from `config/aispec.config.example.yaml` guidance |
| No PR template | Create `.github/pull_request_template.md` |
| No CODEOWNERS | Create `CODEOWNERS` with key directory ownership |
| No branch protection | Create `.github/rulesets/main-protection.json` |
| No CI enforcement | Update `.github/workflows/ci.yml` to require tests |

---

## After Onboarding

### Verify everything is in place

```bash
# Run the assessment again — score should be higher
# Use: .specify/prompts/brownfield.assess.md

# Check initialization state
cat docs/assessment/initialization-state.yaml
```

### Schedule a governance review

The framework recommends a 30-day review after initial adoption. Add this to your calendar and track it in your work management system:
- Review agent autonomy levels — are L1 defaults still appropriate or can some be elevated to L2?
- Review audit trail — are agents behaving as expected?
- Run the assessment again — score should have improved

### What comes next

Once the framework is initialized, the following SDLC workflows are available:

| AIS Specify Step | Available Prompts |
|-----------------|-------------------|
| Intake | `brownfield.assess`, `brownfield.initialize` |
| Specify | `ais.spec.specify`, `ais.spec.brainstorm` |
| Design | `ais.spec.design`, `ais.setup.architecture` |
| Plan | `ais.spec.tasks`, `ais.spec.plan` |
| Implement | `ais.spec.implement` |
| Verify | `ais.maintain.debug` |
| Deploy | Available in later phases |
| Report | `ais.report.status`, `ais.report.metrics` |
| Learn | `ais.report.retrospective` |

---

## Reference

| Resource | Path |
|----------|------|
| Assessment output | `docs/assessment/` |
| Assessment schema | `framework/schemas/readiness-assessment.schema.json` |
| Config schema | `framework/schemas/config.schema.json` |
| Config example | `config/aispec.config.example.yaml` |
| Reference assessment | `framework/templates/readiness-assessment.yaml` |
| All prompts | `.specify/prompts/brownfield.*` |
| Extending guides | `docs/extending/` |
| Getting started | `docs/getting-started/` |

---

*Part of the AIS Agentic Engineering Framework — Guides.*
