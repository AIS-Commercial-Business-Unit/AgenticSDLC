# Agentic Engineering Framework

[![Version](https://img.shields.io/badge/version-0.23.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![CI](https://github.com/AIS-Commercial-Business-Unit/AgenticSDLC/actions/workflows/ci.yml/badge.svg)](https://github.com/AIS-Commercial-Business-Unit/AgenticSDLC/actions/workflows/ci.yml)

A framework that installs into any repository to add governed AI agent workflows, a maturity assessment, and metrics to your software delivery process.

**For:** Engineering teams and IT organizations adopting GitHub Copilot or AI agents who need governance controls, audit trails, and measurable outcomes — on existing repositories without a rewrite.

---

## Features

- Scans an existing repository and produces a JSON assessment and HTML maturity dashboard
- 6-dimension maturity model scored 0–100 with five tiers (Ad Hoc → Optimizing)
- Governance configuration: autonomy levels (L0–L3), approval gates, escalation paths, audit trail
- 23 pre-built Copilot agent definitions covering the full SDLC
- 9-step Specify lifecycle: Intake → Specify → Design → Plan → Implement → Verify → Deploy → Report → Learn
- Agentic scanner runs as a Copilot coding agent via GitHub Actions and opens a PR with results
- Metrics collection: adoption tracking, velocity data, before/after baselines per repository
- Interactive browser-based maturity self-assessment with live scoring

---

## Prerequisites

| Tool | Install | GitHub | Azure DevOps |
|------|---------|:------:|:------------:|
| **Git** | [git-scm.com](https://git-scm.com) | ✅ | ✅ |
| **Node.js 20+** | [nodejs.org](https://nodejs.org) | ✅ | ✅ |
| **GitHub CLI (`gh`)** | [cli.github.com](https://cli.github.com) → `gh auth login` | ✅ | ❌ |
| **gh-aw extension** | `gh extension install github/gh-aw` | ✅ | ❌ |
| **GitHub Copilot** | Enable in your GitHub organization | ✅ | ❌ |
| **Push access to target repo** | — | ✅ | ✅ |

> **Azure DevOps users:** The local Node.js scanner works without GitHub CLI or Copilot. The agentic workflow (GitHub Actions + Copilot agent) requires GitHub.

Verify your setup:
```bash
node --version && gh --version && gh aw --version
```

---

## Quick Start

```bash
# 1. Clone the framework
git clone https://github.com/AIS-Commercial-Business-Unit/AgenticSDLC.git
cd AgenticSDLC && npm install

# 2. Branch your target repo
cd /path/to/your-repo
git checkout -b aef/framework-install

# 3. Install the framework
node /path/to/AgenticSDLC/scripts/install.mjs --target .

# 4. Commit and push
git add . && git commit -m "feat: install Agentic Engineering Framework" && git push

# 5a. Agentic scan (GitHub only — recommended)
#     GitHub → Actions → "AEF Maturity Scanner" → Run workflow
#     The agent opens a draft PR with results. Merge when ready.

# 5b. Local scan (GitHub or Azure DevOps)
node scripts/aef-scan.mjs --target .

# 6. Open your dashboard
open docs/assessment/maturity-report.html    # macOS / Linux
start docs/assessment/maturity-report.html   # Windows
```

Full setup guide: **[docs/getting-started/](docs/getting-started/)**

---

## Maturity Model

Six dimensions, each weighted by governance impact:

| Dimension | Weight | Measures |
|-----------|:------:|---------|
| 🔧 Engineering Baseline | 10% | Branch protection, CI/CD, PR gates, test automation |
| 🛡️ AI Governance & Controls | 22% | Autonomy levels, audit trails, approval gates, security scanning |
| 📐 Spec-Driven Context Architecture | 18% | Decision logs, structured requirements, version-controlled prompts |
| 🤖 Agent & Skill Lifecycle | 20% | Agent catalog, skill library, MCP config, coordinator+specialist patterns |
| ⚡ Agentic Workflow Integration | 18% | Agent-driven PRs, code review, security checks, test generation |
| 📊 Metrics, Observability & Learning | 12% | Adoption tracking, velocity data, retrospectives, dashboards |

**Tiers:** Ad Hoc (0–20) · Foundation (21–40) · Governed (41–60) · Integrated (61–80) · Optimizing (81–100)

Interactive self-assessment: **[website/maturity-checklist.html](website/maturity-checklist.html)**

---

## What Gets Installed

Running `install.mjs --target <repo>` adds the following to your repository:

```
your-repo/
├── .github/
│   ├── agents/                   # Agent definitions directory
│   └── workflows/
│       ├── aef-scan.md           # gh-aw workflow definition
│       └── aef-scan.lock.yml     # Compiled GitHub Actions workflow
├── scripts/
│   ├── aef-scan.mjs              # Local scanner
│   └── aef-report.mjs            # HTML report generator
├── config/
│   └── aispec.config.yaml        # Governance configuration
└── docs/assessment/              # Scanner output directory
```

`package.json` is updated with `aef:scan` and `aef:report` scripts.

---

## Playbooks

Step-by-step guides for common adoption scenarios:

| Playbook | Description |
|----------|-------------|
| [Brownfield Assessment](docs/playbooks/brownfield-assessment.md) | Inspect a repository, identify gaps, produce a readiness report |
| [Governance Initialization](docs/playbooks/governance-init.md) | Install governance registry, configure autonomy levels, set approval rules |
| [Agent Catalog](docs/playbooks/agent-catalog.md) | Register and configure agents for a repository |
| [Audit Trail](docs/playbooks/audit-trail.md) | Establish traceability from requirements through deployed changes |
| [Experiment Charter](docs/playbooks/experiment-charter.md) | Frame a time-boxed agentic engineering experiment with defined success criteria |

---

## Future Enhancements

| Enhancement | Description | Issue |
|-------------|-------------|-------|
| Enterprise roll-up dashboard | Aggregates `readiness-assessment.json` from all repos across an org into a single GitHub Pages dashboard. Each repo pushes its assessment to a central aggregator. Shows all teams with scores and drill-down. | [#9](https://github.com/AIS-Commercial-Business-Unit/AgenticSDLC/issues/9) |

---

## Contributing

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for branching conventions, PR standards, and how to extend the framework.

## License

License terms to be determined. See [LICENSE](LICENSE) for current status.
