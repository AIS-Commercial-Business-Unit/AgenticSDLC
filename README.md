# Agentic Engineering Framework

[![Version](https://img.shields.io/badge/version-0.22.3-blue.svg)](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![CI](https://github.com/ais-internal/AgenticSDLC/actions/workflows/ci.yml/badge.svg)](https://github.com/ais-internal/AgenticSDLC/actions/workflows/ci.yml)

**Governance-first agentic engineering for large enterprise software organizations.**

Enterprise teams adopting GitHub Copilot and AI agents need more than a better
autocomplete. They need structure: a defined lifecycle, explicit human/agent
boundaries, audit trails, and controls that scale across thousands of
developers. The Agentic Engineering Framework provides that structure.

## What It Is

The Agentic Engineering Framework maps AI agent activities to a structured
9-step lifecycle, defines explicit human/agent boundaries through configurable
autonomy levels, and provides the governance controls enterprises need to adopt
agentic engineering safely. It is GitHub-native, works with the AI tools your
teams already use, and is designed to be installed into existing brownfield
repositories — not just greenfield projects.

## Why It Exists

Enterprise engineering organizations are adopting GitHub Copilot and AI agents
faster than governance frameworks can keep up. The result is:

- **No audit trail.** AI-generated changes land in `main` with no traceability
  back to requirements.
- **No defined boundaries.** Agents act with whatever permissions they happen
  to have, with no policy enforcement.
- **No onboarding path.** Brownfield repositories have no structured way to
  discover their current state and begin governed AI-assisted development.
- **No lifecycle structure.** AI tools are used ad hoc — accelerating individual
  tasks but not the end-to-end delivery process.

This framework provides the structure that those tools lack: a defined
lifecycle, explicit governance, and a brownfield onboarding path that works
without requiring a rewrite.

## Core Concepts

| Concept | Description | Docs |
|---------|-------------|------|
| **AIS Specify Lifecycle** | 9-step AI-centric SDLC: Intake → Specify → Design → Plan → Implement → Verify → Deploy → Report → Learn | [docs/reference/workflow.md](docs/reference/workflow.md) |
| **Autonomy Levels (L0–L3)** | Configurable per-activity agent permissions from Observe-only to Execute | [docs/reference/autonomy-levels.md](docs/reference/autonomy-levels.md) |
| **Governance Registry** | Machine-readable YAML registry of all governed activities, policies, confidence thresholds, and approval requirements | [framework/schemas/](framework/schemas/) |
| **Brownfield Onboarding** | Read-only discovery phase that inspects a repository, detects its stack, identifies gaps, and proposes a governed initialization plan | [docs/getting-started/brownfield.md](docs/getting-started/brownfield.md) |
| **Agent Catalog** | Reusable agent definitions covering coordination, architecture, engineering, and assurance roles | [docs/reference/agent-catalog.md](docs/reference/agent-catalog.md) |

## Quick Start

```bash
# 1. Clone the framework
git clone https://github.com/your-org/AgenticSDLC.git
cd AgenticSDLC

# 2. Copy and configure
cp config/aispec.config.example.yaml config/aispec.config.yaml
# Edit config/aispec.config.yaml — set your repository, autonomy levels, and integrations

# 3. Run the brownfield assessment
# In your AI tool (Copilot, Claude Code, Cursor, or Codex):
/ais.brownfield.assess
```

Full setup instructions: **[docs/getting-started/](docs/getting-started/)**

## Brownfield Playbooks

Structured guides for adopting the framework in existing repositories.

| Playbook | Description |
|----------|-------------|
| [Discovery & Assessment](docs/playbooks/01-discovery-assessment.md) | Read-only repository inspection: detect stack, identify gaps, produce a readiness report |
| [Governance Initialization](docs/playbooks/02-governance-init.md) | Install the governance registry, configure autonomy levels, and establish approval rules |
| [Spec Lifecycle Adoption](docs/playbooks/03-spec-lifecycle.md) | Introduce the 9-step SDLC into an active delivery team without disrupting in-flight work |
| [Agent Onboarding](docs/playbooks/04-agent-onboarding.md) | Register and configure agents against the governance registry for a specific repository |
| [Metrics & Continuous Improvement](docs/playbooks/05-metrics-improvement.md) | Instrument the SDLC, collect evidence, and run the Learn step to improve over time |

Full playbook reference: **[docs/playbooks/](docs/playbooks/)**

## Repository Structure

```
AgenticSDLC/
├── .specify/                     # Framework engine — prompts, templates, scripts
│   ├── prompts/                  # Shared command prompts (source of truth)
│   ├── playbooks/                # Domain-specific engagement playbooks
│   ├── templates/                # Spec, design, task, and report templates
│   └── scripts/                  # Automation scripts
├── .github/
│   ├── agents/                   # Copilot custom agent definitions
│   └── workflows/                # GitHub Actions: CI, reports, governance checks
├── config/
│   ├── aispec.config.example.yaml  # Configuration template
│   └── governance-registry.yaml    # Governed activity registry (source of truth)
├── docs/
│   ├── getting-started/          # Quick-start guides, brownfield onboarding
│   ├── guides/                   # Deep-dive guides (setup, upgrade, roles, process)
│   ├── playbooks/                # Brownfield adoption playbooks (5)
│   ├── reference/                # Commands, workflow, autonomy levels, agent catalog
│   └── sdlc/                     # Enterprise SDLC standards: branching, PRs, maturity
├── framework/
│   └── schemas/                  # JSON schemas for governance registry and config
├── Skills/                       # Reusable agent Skills (agentskills.io format)
├── specs/                        # Spec-driven development artifacts
│   ├── .project-plan/            # Project plan and SPEC catalog
│   └── YYMM-NNN-feature/         # Per-component spec working areas
├── tests/                        # Framework validation tests
├── scripts/                      # Developer and CI utility scripts
└── website/                      # Product website source
```

## Enterprise SDLC

The framework enforces engineering discipline at the process level, not just
the tooling level. Every change flows through a structured lifecycle:
requirements in, evidence-backed delivery out.

Recommended practices are documented in **[docs/sdlc/](docs/sdlc/)**:

- **[Branching Strategy](docs/sdlc/branching-strategy.md)** — trunk-based
  development with feature flags, branch protection rules, and naming
  conventions for enterprise scale
- **[Pull Request Standards](docs/sdlc/pull-request-standards.md)** — PR size
  guidelines, review SLAs, draft/ready states, and auto-merge conditions
- **[Maturity Checklist](docs/sdlc/maturity-checklist.md)** — self-assessment
  across branch management, PR process, code review, CI/CD, documentation,
  governance, and security
- **[PR Template](docs/sdlc/pr-template.md)** — standard PR description
  template with governance checklist
- **[CODEOWNERS Template](docs/sdlc/CODEOWNERS.template)** — ownership
  patterns for framework core, docs, and CI

## Contributing

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for branching conventions, PR
standards, governance controls, and how to extend the framework.

## License

License terms to be determined. See [LICENSE](LICENSE) for current status.
