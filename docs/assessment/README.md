# Assessment Output Directory

This directory contains the brownfield discovery and initialization output for this repository.

---

## What Is Written Here

| File | When Created | Description |
|------|-------------|-------------|
| `readiness-assessment.yaml` | After running `brownfield.assess` | Full scored assessment of the repository across 6 dimensions. Conforms to `readiness-assessment.schema.json`. |
| `gap-report.md` | Generated from assessment | Human-readable gap report, organized by severity (critical → low). Includes remediation steps and estimated hours. |
| `initialization-state.yaml` | After running `brownfield.initialize` | Tracks the overall initialization lifecycle phase and which steps have been completed. Conforms to `initialization-state.schema.json`. |

---

## How to Run the Assessment

The assessment uses the `brownfield.assess` prompt. It is a **read-only operation** (L0 autonomy) — it never writes to the target repository.

### In GitHub Copilot Chat (VS Code or github.com)

```
@workspace /brownfield.assess

Target repository: [path or owner/repo]
```

### In Claude Code

```bash
claude -p .specify/prompts/brownfield.assess.md
```

When prompted, provide the target repository path.

### What happens

1. The assessor reads the target repo's structure across 6 dimensions
2. It checks `docs/input/` for any supplemental context documents you've uploaded
3. It produces `readiness-assessment.yaml` in this directory
4. It prints a human-readable summary

---

## How to Interpret the Score

### Overall Score (0–100)

The overall score is a weighted aggregate of six dimension scores:

| Dimension | Weight |
|-----------|--------|
| AI Governance | 25% |
| Agent Management | 20% |
| CI/CD | 20% |
| Documentation | 15% |
| Branch Management | 10% |
| PR Process | 10% |

### Maturity Tiers

| Score | Tier | What It Means |
|-------|------|---------------|
| 0–24 | **Foundation** | Little or no agentic infrastructure. The framework can be adopted, but the starting point requires significant setup. Focus on: governance config, Copilot instructions, CI enforcement. |
| 25–49 | **Developing** | Basic infrastructure exists. Some CI/CD and documentation in place, but AI governance and agent management are underdeveloped. Focus on: governance registry, agent catalog, PR process. |
| 50–74 | **Established** | Solid CI/CD, documentation, and some governance. AI tooling is in use with partial structure. Focus on: audit trail, agent autonomy tuning, experiments. |
| 75–100 | **Advanced** | Full framework infrastructure in place. Agents are governed, audited, and evidence-driven. Focus on: optimization, FinOps tuning, experiment-driven improvement. |

### Dimension Scores

Each dimension score reflects specific evidence:
- **0–19:** Critical gap — foundational item missing
- **20–49:** Partial — something exists but incomplete
- **50–74:** Adequate — baseline met
- **75–100:** Strong — full implementation with evidence of maintenance

### Completeness (0.0–1.0)

Reflects how confident the assessor is in the score. A completeness of 0.7 means approximately 30% of evidence sources were inaccessible (e.g. GitHub UI settings, private configuration). Treat low-completeness assessments as conservative estimates.

---

## The Gap Report

After reviewing `readiness-assessment.yaml`, the `brownfield.governance.init` prompt can produce a structured gap report. The gap report:
- Groups gaps by severity (critical → low)
- Provides remediation steps with effort estimates
- Recommends a phased plan
- Identifies MCP server opportunities

---

## Adding Supplemental Context

The assessor reads `docs/input/` in this repository for user-uploaded context documents. You can add:
- Team surveys (PDF, Word, Markdown)
- Architecture documents
- Existing runbooks or process docs
- Any other reference material

Files in `docs/input/` are `.gitignore`d by default to avoid committing customer-specific content.

---

*Part of the AIS Agentic Engineering Framework — Assessment and Gap Analysis.*
