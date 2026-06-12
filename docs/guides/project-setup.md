# Setting Up a Project

How to use the AIS framework on your project. The setup script works for both
**new repos** (greenfield) and **existing repos** (brownfield). The framework
lives in `ais-internal/AIS-spec` — client and project work goes in a
**separate repo** in the appropriate GitHub organization.

## Why a Separate Repo?

- Client work should never live in the AIS internal org
- Each project gets its own commit history, CI/CD, and access controls
- The framework repo stays clean — only framework improvements go here

## Quick Start

### 1. Prepare the Destination

**Greenfield** — create a new repo in the client or project GitHub org and
clone it locally. No other setup is needed; the script handles git init,
README, and `.gitignore`.

**Brownfield** — use your existing repo as-is. The script never overwrites
files that already exist, so your code, configuration, and history are safe. It
will append `.project-context` rules to your existing `.gitignore` if they are
missing. When run interactively (without `--ai`), the script auto-detects
existing AI tool artifacts (e.g. `.claude/`, `.github/agents/`, `.cursorrules`)
and offers them as the default selection.

### 2. Run the Setup Script

From a local clone of `ais-internal/AIS-spec`, run the bootstrap script
pointing at the destination repo:

```bash
bash /absolute/path/to/ais-spec/scripts/setup-project.sh \
  --folder /absolute/path/to/your-project-repo \
  --ai copilot
```

Use `--ai` with one or more tools (`claude,copilot,codex,cursor`) or `all`.
Use `--no-ci` if you do not want to copy CI workflow files.

Examples:

```bash
# Greenfield: Copilot-only setup
bash /absolute/path/to/ais-spec/scripts/setup-project.sh \
  --folder ~/dev/acme-app \
  --ai copilot

# Brownfield: add framework to an existing Node.js project
bash /absolute/path/to/ais-spec/scripts/setup-project.sh \
  --folder ~/dev/existing-service \
  --ai all

# Mixed-tool team, skip CI (project already has its own workflows)
bash /absolute/path/to/ais-spec/scripts/setup-project.sh \
  --folder ~/dev/acme-app \
  --ai claude,copilot \
  --no-ci
```

The script:

- Initializes git if no `.git/` directory exists (greenfield only)
- Creates a `README.md` if one is missing (greenfield only)
- Copies core framework files (`.specify/`, `PLANS.md`, `Skills/`, etc.)
- Copies only the AI tool surfaces you selected
- Appends `.project-context` gitignore rules if not already present
- Creates `.project-context/` and an empty project-owned `specs/` directory
- **Never overwrites existing files** — safe to run on a brownfield repo

The setup script does not copy `specs/` from `ais-internal/AIS-spec`. Specs in
the framework source repo are used to manage AIS Spec's own development and are
not reusable project artifacts.

### 3. Add Raw Inputs

Drop your raw inputs (SOWs, RFPs, transcripts, requirements) into
`.project-context/`, then run the workflow:

```
/ais.setup.plan
/ais.setup.architecture
/ais.setup.constitution
```

For brownfield projects, include any existing documentation (architecture
diagrams, runbooks, API contracts) so the plan and architecture steps account
for what already exists.

### 4. Start Building

Pick the first unblocked spec from the project plan and run the spec lifecycle:

```
/ais.spec.specify
/ais.spec.design
/ais.spec.tasks
/ais.spec.implement
```

## Keeping the Framework Updated

When the framework gets improvements (new prompts, better templates, updated
scripts), pull them into your project:

1. Keep a local clone of `ais-internal/AIS-spec` up to date
2. Diff the framework files against your project
3. Apply updates using the upgrade workflow in [upgrade.md](upgrade.md), being
  careful not to overwrite project-specific customizations (for example,
  `constitution.md` and project-specific `.gitignore` rules)

Use the [upgrade guide](upgrade.md) when updating an existing project. It
compares the copied framework version against AIS Spec, summarizes the
changelog, identifies local drift, and separates safe updates from files that
need manual review.

The files most likely to change are in `.specify/prompts/`,
`.specify/templates/`, and `Skills/`. Command files (`.claude/commands/`,
`.github/agents/`, `.agents/skills/`, `.cursor/skills/`) are generated from
prompts. If you update prompts, regenerate command surfaces for the AI tools
your team uses (see
[multi-tool-commands.md](../reference/multi-tool-commands.md)).

## AIS Spec Source Repo Specs

The AIS Spec source repository may contain its own `specs/` directory for
framework-development work. Those specs are intentionally excluded from project
setup. A newly bootstrapped project starts with an empty `specs/` directory and
creates project-specific specs through `/ais.setup.*` and `/ais.spec.*`.

## Project-Specific Customization

After running the setup script, you'll typically customize:

- **`specs/constitution.md`** — created by `/ais.setup.constitution`,
  defines your project's standards
- **`.specify/playbooks/`** — add or select domain-specific playbooks
- **`CONTRIBUTING.md`** — adjust team roles, review requirements, and CI checks
- **`.github/workflows/`** — add project-specific build, test, and deploy pipelines

For brownfield projects you may also need to:

- Update `CONTRIBUTING.md` to reconcile existing team conventions with the
  framework's workflow
- Add `--no-ci` during setup if the repo already has CI workflows, then
  selectively adopt framework CI jobs later
- Reference existing architecture docs in `.project-context/` so generated
  specs stay consistent with the current system

## Repo Structure After Setup

```
your-project-repo/
  .project-context/          # Raw inputs (gitignored)
  PLANS.md                   # Implementation-plan rules
  Skills/                    # Portable Agent Skills
  .specify/                  # Framework engine
    VERSION                  # Copied framework version
    prompts/                 # Command prompts
    templates/               # Output templates
    scripts/                 # Automation
    playbooks/               # Domain playbooks
  .claude/commands/          # Claude Code (if used)
  .agents/skills/            # Codex (if used)
  .github/
    agents/                  # Copilot (if used)
    workflows/               # CI/CD
  .cursor/skills/            # Cursor (if used)
  specs/
    constitution.md          # From /ais.setup.constitution
    .project-plan/           # From /ais.setup.plan
    .architecture/           # From /ais.setup.architecture
    YYMM-NNN-feature/        # From spec lifecycle
  source/                    # Application code
  tests/                     # Tests
  infra/                     # Infrastructure as code
  CONTRIBUTING.md
  README.md                  # Your project README
```
