# Contributing to the Agentic Engineering Framework

This document covers how to contribute to and extend the Agentic Engineering
Framework — whether you are maintaining the framework itself or building on top
of it within your organization.

---

## Who This Is For

- **Framework maintainers** — engineers and architects contributing to the core
  framework, governance schemas, agent definitions, and tooling.
- **Adopting teams** — engineering teams integrating the framework into their
  repositories and extending it with organization-specific configuration,
  playbooks, or agents.

Both audiences follow the same branching, PR, and governance standards
described here.

---

## Development Setup

### Prerequisites

- **Git** 2.40 or later
- **Node.js** 20 LTS or later (for schema validation tooling)
- **GitHub CLI** (`gh`) 2.x or later — used for PR creation and workflow
  management
- An AI coding tool: GitHub Copilot, Claude Code, Cursor, or Codex

### Clone and Install

```bash
git clone https://github.com/your-org/AgenticSDLC.git
cd AgenticSDLC

# Install tooling dependencies (once package.json is present)
npm install

# Copy and configure
cp config/aispec.config.example.yaml config/aispec.config.yaml
```

### Verify Setup

```bash
# Validate governance registry schema
npm run validate:governance

# Run framework tests
npm test

# Lint markdown
npm run lint:md
```

---

## Branching Strategy

### Branch Naming

All branches follow `type/brief-description`:

| Prefix | Use for |
|--------|---------|
| `feat/` | New framework capabilities, agents, or commands |
| `fix/` | Bug fixes in tooling, schemas, or generated output |
| `docs/` | Documentation-only changes |
| `chore/` | Maintenance, dependency updates, CI configuration |
| `test/` | Test additions or corrections |

Examples:
- `feat/brownfield-assessment-command`
- `fix/governance-registry-schema-validation`
- `docs/autonomy-levels-reference`
- `chore/update-node-dependencies`

### Protected Branches

| Branch | Protection |
|--------|-----------|
| `main` | Direct commits prohibited. PRs required. Minimum 2 reviewers for governance and security changes. CI must pass. |
| `dev` | Direct commits prohibited. PRs required. Minimum 1 reviewer. CI must pass. |

See [docs/sdlc/branch-protection-ruleset.json](docs/sdlc/branch-protection-ruleset.json)
for the GitHub ruleset definition and how to apply it.

### Branch Discipline

- **Branch from `main`** for framework work. If your organization uses a `dev`
  integration branch, branch from and target `dev`.
- **One concern per branch.** A branch that fixes a schema bug and adds a new
  command will be asked to split.
- **Short-lived branches.** Branches should be open for days, not weeks. Split
  large work into independent increments.
- **Keep branches current.** Rebase or merge from the target branch before
  requesting review if your branch is more than a few days old.

### Merge Strategy

| Target | Strategy | Notes |
|--------|----------|-------|
| `main` / `dev` feature work | Squash and merge | One commit per feature for a clean history |
| Release commits | Merge commit | Preserves release tagging context |

---

## Pull Request Standards

### PR Title Format

Titles follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description
```

| Type | Use for |
|------|---------|
| `feat` | New capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `chore` | Maintenance |
| `test` | Test changes |
| `refactor` | Refactoring without behavior change |
| `break` | Breaking change (also add `BREAKING CHANGE:` in body) |

Examples:
- `feat(governance): add confidence-threshold validation to registry schema`
- `fix(ci): correct markdown lint path exclusion for specs directory`
- `docs(sdlc): add trunk-based branching guide`

### Reviewers

| Change type | Minimum reviewers |
|-------------|------------------|
| Standard changes | 1 |
| Governance registry (`governance-registry.yaml`) | 2 |
| Security-related changes | 2 |
| Schema changes that affect generated output | 2 |
| `main` branch releases | 2 |

### CI Requirements

All CI checks must pass before merge:

- Markdown lint
- Schema validation (governance registry and config)
- Framework tests
- Generated command drift check (if applicable)
- Workflow lint

### What a Complete PR Looks Like

Before opening a PR for review:

- [ ] PR title follows `type(scope): description` format
- [ ] Description uses the [PR template](docs/sdlc/pr-template.md)
- [ ] Linked issues referenced in the description
- [ ] Testing section documents what was validated and how
- [ ] If docs were affected, they are updated in the same PR
- [ ] If the governance registry was changed, the governance checklist is completed
- [ ] One release label applied: `release:patch`, `release:minor`, or `release:major`
- [ ] Release note section filled in (content used in `CHANGELOG.md`)

### Draft vs. Ready

Use **Draft PRs** for work-in-progress that needs early visibility or
async feedback. Convert to ready only when CI passes and the PR is complete.
Do not request formal review on a Draft PR.

---

## Code Review Standards

### What Reviewers Check

- **Correctness** — Does the change do what the PR description claims?
- **Governance compliance** — Does the change comply with the governance
  registry? If it changes governance rules, are 2 approvals obtained?
- **Schema validity** — Are YAML/JSON files valid against their schemas?
- **Test coverage** — Are new behaviors covered by tests?
- **Documentation** — Are user-facing changes reflected in docs?
- **Breaking changes** — Is the impact on existing adopters documented?

### Approve vs. Request Changes

- **Approve** when the change is correct, complete, and safe to merge.
- **Request changes** when there is a correctness issue, a governance concern,
  missing evidence, or a breaking change not documented.
- **Comment only** (not blocking) for suggestions that do not affect
  correctness or safety.

### Handling Disagreement

When reviewers disagree, the PR author and reviewers resolve the disagreement
in the PR thread. If consensus cannot be reached within 2 business days, a
framework maintainer (or designated architect) makes the call and documents
the decision in the PR thread.

---

## Governance Controls

### Governance Registry Changes

Any change to `config/governance-registry.yaml` requires:

1. **2 reviewers** — one of whom must be a framework maintainer or designated
   architect.
2. **Justification** in the PR description explaining what policy changed and
   why.
3. **Updated documentation** if the change affects user-facing behavior or
   approved autonomy levels.

### Schema Changes

Changes to files in `framework/schemas/` require:

- A corresponding schema validation test update in `tests/`.
- Documentation update if the schema change affects configuration or registry
  structure.

### Agent Definition Changes

Changes to agent definitions (in `.github/agents/`, `Skills/`, or agent
catalog docs) require:

- Updated agent documentation reflecting the change.
- Review by someone familiar with the governance registry to confirm the agent
  still operates within its configured bounds.

---

## Extending the Framework

The framework is designed to be extended:

- **Custom playbooks** — Add organization-specific playbooks in
  `docs/playbooks/` following the existing format.
- **Custom agents** — Add agent definitions in `.github/agents/` and register
  governed activities in the governance registry.
- **Custom Skills** — Add reusable Skills in `Skills/` following the
  agentskills.io format.
- **Configuration overrides** — Adjust autonomy levels and approval requirements
  in `config/aispec.config.yaml` without modifying the framework core.

See **[docs/extending/](docs/extending/)** for detailed extension guides.

---

## Commit Message Format

Commits use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description

Optional body explaining why, not what. The what is in the diff.

Optional footer:
BREAKING CHANGE: description of breaking change and migration path
Refs: #123
Co-authored-by: Name <email>
```

**Examples:**

```
feat(brownfield): add repository language detection to assessment command

fix(governance): reject registry entries with missing requiredEvidence field

docs(sdlc): add PR size guidelines and review SLA recommendations

chore(ci): upgrade actionlint to 1.7.1

BREAKING CHANGE: governance-registry.yaml now requires `processStep` on all
entries. Existing registries without this field will fail schema validation.
```

Since we squash-merge, the **PR title and description become the commit on
`main`**. Write them to stand alone as the permanent record of the change.

---

## Project Structure

```
AgenticSDLC/
├── .specify/                     # Framework engine — prompts, templates, scripts
├── .github/
│   ├── agents/                   # Copilot custom agent definitions
│   └── workflows/                # GitHub Actions: CI, reports, governance checks
├── config/
│   ├── aispec.config.example.yaml
│   └── governance-registry.yaml
├── docs/
│   ├── getting-started/
│   ├── guides/
│   ├── playbooks/
│   ├── reference/
│   └── sdlc/                     # Enterprise SDLC standards
├── framework/
│   └── schemas/                  # JSON schemas for governance registry and config
├── Skills/                       # Reusable agent Skills
├── specs/                        # Spec-driven artifacts
├── tests/                        # Framework validation tests
├── scripts/                      # Developer and CI utility scripts
└── website/                      # Product website source
```
