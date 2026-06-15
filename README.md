# Agentic Engineering Framework

[![Version](https://img.shields.io/badge/version-0.23.0-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![CI](https://github.com/AIS-Commercial-Business-Unit/AgenticSDLC/actions/workflows/ci.yml/badge.svg)](https://github.com/AIS-Commercial-Business-Unit/AgenticSDLC/actions/workflows/ci.yml)

**Governance-first agentic engineering for enterprise software organizations.**

Enterprise teams adopting GitHub Copilot and AI agents need more than a better autocomplete. They need structure: a defined lifecycle, explicit human/agent boundaries, audit trails, and controls that scale across thousands of developers. The Agentic Engineering Framework (AEF) provides that structure.

---

## Prerequisites

Before you install the framework, make sure you have the following:

| Tool | Required | Notes |
|------|----------|-------|
| **Git** | ✅ Yes | [git-scm.com](https://git-scm.com) |
| **Node.js 20+** | ✅ Yes | [nodejs.org](https://nodejs.org) — needed for local scanner |
| **GitHub CLI (`gh`)** | ✅ Yes | [cli.github.com](https://cli.github.com) — install, then `gh auth login` |
| **gh-aw extension** | ✅ Yes | `gh extension install github/gh-aw` — agentic workflow compiler |
| **GitHub Copilot** | ✅ Yes | Must be enabled on the target organization |
| **Repository access** | ✅ Yes | Push access to the repo you want to install AEF into |

> **Verify your setup in one command:**
> ```bash
> node --version && gh --version && gh aw --version
> ```

---

## Quick Start — Brownfield Install (5 minutes)

Install AEF into an existing repository and get your first maturity dashboard.

```bash
# 1. Get the framework
git clone https://github.com/AIS-Commercial-Business-Unit/AgenticSDLC.git
cd AgenticSDLC
npm install

# 2. Branch your target repo
cd /path/to/your-repo
git checkout -b aef/framework-install

# 3. Install AEF into your repo
node /path/to/AgenticSDLC/scripts/install.mjs --target .

# 4. Commit and push the framework files
git add .
git commit -m "feat: install AEF framework (baseline assessment)"
git push

# 5. Run your first maturity scan (two options)
#    Option A — Agentic via GitHub Actions (recommended):
#      Go to: GitHub → Actions → "AEF Maturity Scanner" → Run workflow
#      The agent opens a draft PR with your assessment results.
#
#    Option B — Local Node.js runner:
node scripts/aef-scan.mjs --target .

# 6. Open your maturity dashboard
#    (Option A): Merge the PR, then open the file
#    (Option B): File is written directly — open it now
open docs/assessment/maturity-report.html   # macOS
start docs/assessment/maturity-report.html  # Windows
```

Full setup guide: **[docs/getting-started/](docs/getting-started/)**

---

## What It Is

AEF maps AI agent activities to a structured 9-step lifecycle, defines explicit human/agent boundaries through configurable autonomy levels, and provides the governance controls enterprises need to adopt agentic engineering safely. It is GitHub-native, works with the AI tools your teams already use, and installs into existing brownfield repositories — not just greenfield projects.

## Why It Exists

Enterprise engineering organizations are adopting GitHub Copilot and AI agents faster than governance frameworks can keep up. The result is:

- **No audit trail.** AI-generated changes land in `main` with no traceability back to requirements.
- **No defined boundaries.** Agents act with whatever permissions they happen to have, with no policy enforcement.
- **No onboarding path.** Brownfield repositories have no structured way to discover their current state and begin governed AI-assisted development.
- **No lifecycle structure.** AI tools are used ad hoc — accelerating individual tasks but not the end-to-end delivery process.
- **No metrics.** There's no way to measure whether agentic engineering is improving velocity, quality, or governance compliance.

AEF provides the structure those tools lack: a defined lifecycle, explicit governance, a brownfield onboarding path, and built-in metrics from day one.

---

## Core Concepts

| Concept | Description | Docs |
|---------|-------------|------|
| **Maturity Model** | 6-dimension agentic engineering maturity scoring (Ad Hoc → Optimizing) with auto-generated HTML dashboard | [website/maturity-checklist.html](website/maturity-checklist.html) |
| **AEF Scanner** | Brownfield repository scanner that produces a readiness-assessment.json and visual maturity-report.html | [scripts/scan-repository.mjs](scripts/scan-repository.mjs) |
| **AIS Specify Lifecycle** | 9-step AI-centric SDLC: Intake → Specify → Design → Plan → Implement → Verify → Deploy → Report → Learn | [docs/reference/workflow.md](docs/reference/workflow.md) |
| **Autonomy Levels (L0–L3)** | Configurable per-activity agent permissions from Observe-only to Execute | [config/aispec.config.yaml](config/aispec.config.yaml) |
| **Governance Registry** | Machine-readable YAML registry of all governed activities, policies, and approval requirements | [framework/schemas/](framework/schemas/) |
| **Agent Catalog** | Reusable agent definitions covering coordination, architecture, engineering, and assurance roles | [.github/agents/](.github/agents/) |
| **gh-aw Workflow** | Agentic GitHub Actions workflow — the scanner runs as an AI agent and opens a PR with results | [.github/workflows/aef-scan.md](.github/workflows/aef-scan.md) |

---

## Maturity Model

AEF measures agentic engineering maturity across **6 dimensions**:

| Dimension | Weight | What It Measures |
|-----------|--------|-----------------|
| 🔧 Engineering Baseline | 10% | Branch protection, CI/CD, PR gates, test automation |
| 🛡️ AI Governance & Controls | 22% | Autonomy levels, audit trails, approval gates, security scanning |
| 📐 Spec-Driven Context Architecture | 18% | Decision logs, structured requirements, version-controlled prompts |
| 🤖 Agent & Skill Lifecycle | 20% | Agent catalog, skill library, MCP config, coordinator+specialist patterns |
| ⚡ Agentic Workflow Integration | 18% | Agent-driven PRs, code review, security checks, test generation |
| 📊 Metrics, Observability & Learning | 12% | Adoption tracking, velocity data, retrospectives, dashboards |

**Tiers:** Ad Hoc (0–20) · Foundation (21–40) · Governed (41–60) · Integrated (61–80) · Optimizing (81–100)

Try the interactive self-assessment: **[website/maturity-checklist.html](website/maturity-checklist.html)**

---

## Brownfield Playbooks

Structured guides for adopting the framework in existing repositories.

| Playbook | Description |
|----------|-------------|
| [Discovery & Assessment](docs/playbooks/brownfield-assessment.md) | Read-only repository inspection: detect stack, identify gaps, produce a readiness report |
| [Governance Initialization](docs/playbooks/governance-init.md) | Install the governance registry, configure autonomy levels, and establish approval rules |
| [Agent Catalog](docs/playbooks/agent-catalog.md) | Register and configure agents for a specific repository |
| [Audit Trail](docs/playbooks/audit-trail.md) | Establish traceability from requirements through to deployed changes |
| [Experiment Charter](docs/playbooks/experiment-charter.md) | Frame a time-boxed agentic engineering experiment with clear success criteria |

---

## Repository Structure

```
AgenticSDLC/
├── .github/
│   ├── agents/                   # Copilot custom agent definitions (23 agents)
│   └── workflows/
│       ├── aef-scan.md           # gh-aw workflow definition (agentic scanner)
│       ├── aef-scan.lock.yml     # Compiled GitHub Actions workflow
│       ├── ci.yml                # Test and validate the framework
│       └── deploy-pages.yml      # Publish website to GitHub Pages
├── .specify/                     # Framework engine — prompts, templates, scripts
│   ├── prompts/                  # Shared command prompts (source of truth)
│   ├── playbooks/                # Domain-specific engagement playbooks
│   └── templates/                # Spec, design, task, and report templates
├── config/
│   └── aispec.config.yaml        # Governance configuration (autonomy, gates, context)
├── docs/
│   ├── getting-started/          # Prerequisites and install guides
│   ├── guides/                   # Deep-dive guides (setup, upgrade, roles, process)
│   ├── playbooks/                # Brownfield adoption playbooks
│   ├── reference/                # Commands, workflow, autonomy levels, agent catalog
│   └── sdlc/                     # Enterprise SDLC standards: branching, PRs, maturity
├── framework/
│   └── schemas/                  # JSON schemas for governance registry and config
├── samples/
│   └── brownfield-sample/        # Reference brownfield repository for testing
├── scripts/
│   ├── install.mjs               # Scaffolds AEF into a target repository
│   ├── scan-repository.mjs       # Brownfield maturity scanner
│   ├── generate-report.mjs       # HTML dashboard generator
│   └── ...                       # Additional framework scripts
├── tests/                        # Framework validation tests (262 tests)
├── website/                      # Product website source
│   └── maturity-checklist.html   # Interactive maturity self-assessment
└── Skills/                       # Reusable agent Skills
```

---

## Contributing

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for branching conventions, PR standards, governance controls, and how to extend the framework.

## License

License terms to be determined. See [LICENSE](LICENSE) for current status.
