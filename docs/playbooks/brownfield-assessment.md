# Brownfield Repository Assessment

## Purpose

The **Brownfield Assessment** playbook performs a structured, read-only analysis of an existing repository to determine its AI readiness against the AIS Agentic Engineering Framework.

Use this playbook as the first step whenever you are introducing the framework to a team that already has a repository in production or active development.

---

## When to Use

- You are onboarding an existing repository to the framework.
- A team wants to understand their current maturity level before committing to governance initialization.
- You need an inventory of existing agents, skills, docs, and automation before deciding what to add.
- A client or stakeholder wants a baseline report on AI readiness.

---

## Inputs

| Input | Required | Description |
|---|---|---|
| Target repository path | ✅ Required | The repository to assess. |
| `docs/input/` documents | Optional | Word/Excel/PDF/Markdown files providing additional context (architecture docs, runbooks, existing agent catalogs). See `docs/input/README.md`. |

---

## Outputs

The assessment produces a Markdown report containing:

1. **Repository Structure Inventory** — all agents, skills, CI/CD, docs, ADRs, and governance files found.
2. **Technology Stack Detection** — languages, frameworks, build tools, deployment targets.
3. **AI Readiness Scorecard** — each framework criterion scored ✅/⚠️/❌/❓.
4. **Maturity Level Assignment** — 0–4 with rationale.
5. **Gap Summary** — prioritized list of missing or incomplete framework elements.
6. **Recommended Next Steps** — sequenced initialization recommendations.
7. **Assessment Metadata** — timestamp, assessor, maturity level, evidence summary.

---

## How to Run

### In GitHub Copilot (Recommended)

1. Open GitHub Copilot Chat in your IDE or on github.com.
2. Type `@workspace` or open the repository context.
3. Reference the prompt:
   ```
   @workspace Run the brownfield assessment using .specify/prompts/brownfield.assess.md
   ```
4. Optionally, copy any supplemental docs into `docs/input/` before running.

### In Claude Code

```bash
claude --allowedTools "read_file,list_directory,search_files,grep,glob" \
  < .specify/prompts/brownfield.assess.md
```

The `.claude.yaml` frontmatter in `.specify/prompts/brownfield.assess.claude.yaml` configures allowed tools and output type.

---

## Constraints

- **Read-only (L0).** This playbook must never create, modify, or delete files in the target repository.
- The report is an observation, not a commitment. No governance records are created by this playbook.
- If the agent cannot determine a fact from evidence, it must mark it as `❓ Unknown` rather than guessing.

---

## Example Output Structure

```
# Brownfield Assessment Report — my-app
Generated: 2026-06-01T10:00:00Z | Maturity Level: 2 (Structured)

## Repository Structure Inventory
- .github/agents/: 3 agent files found
- .github/copilot-instructions.md: Present
- Governance config: ABSENT
...

## AI Readiness Scorecard
| Criterion | Score |
| Governance config | ❌ Missing |
| Agent definitions | ✅ Present |
...

## Maturity Level: 2 — Structured
Rationale: Agent definitions and instructions are present but no governance registry
or config file exists.

## Top Gaps
1. No governance config — blocks all governed activity tracking.
2. No governance registry — cannot define or audit agent activities.
...

## Recommended Next Steps
1. Immediate: Run brownfield.governance.init to create governance config.
2. Short-term: Run brownfield.agent.catalog to inventory and catalog agents.
```

---

## After the Assessment

Once the assessment is complete:

1. Save the output as `docs/assessments/initial-assessment-YYYY-MM-DD.md`.
2. Review the Gap Summary with the team.
3. Select the appropriate initialization playbook from the recommendations.
4. Proceed to `brownfield.governance.init` if governance config is absent.

---

*Part of the AIS Agentic Engineering Framework — Brownfield Governance Playbooks.*
