# Upgrading AIS Spec in a Project Repo

Use this guide when a project repo already contains copied AIS Spec framework
files and needs to move to a newer AIS Spec release.

The upgrade flow is intentionally conservative:

- report what changed before editing files
- read `CHANGELOG.md` so the upgrade has a human explanation
- protect project-specific customizations
- copy root `Skills/` as part of the versioned framework payload
- leave project-owned files alone by default

## Recommended Path

1. Open the project repo in your AI coding tool.
2. Ensure the working tree is clean or create an upgrade branch.
3. Run the `ais-spec-upgrade` skill.
4. Review the version, changelog, payload, and drift report.
5. Choose one of the presented options:
   - report only
   - apply non-conflicting updates
   - choose file groups to apply
   - cancel
6. Review the post-upgrade summary and validation commands.
7. Commit the upgrade in the project repo.

The skill uses `Skills/ais-spec-upgrade/scripts/upgrade_framework.py` to build
the report and apply safe file copies when requested.

## Managed Framework Payload

These files are copied from AIS Spec into project repos and should be considered
versioned framework payload:

```text
.specify/
  VERSION
  prompts/
  templates/
  scripts/
  playbooks/
  repo-instructions.md
PLANS.md
CONTRIBUTING.md
.gitignore
.markdownlint.jsonc
Skills/
```

Copy only the AI tool surfaces your team uses:

| Tool | Managed paths |
| --- | --- |
| Claude Code | `.claude/commands/`, `CLAUDE.md` |
| GitHub Copilot | `.github/agents/`, `AGENTS.md` |
| Codex | `AGENTS.md`, `.agents/skills/` |
| Cursor | `.cursor/skills/` |

Optional GitHub files may be copied when the project wants AIS Spec defaults:

```text
.github/workflows/ci.yml
.github/pull_request_template.md
```

## Project-Owned Files

Do not copy these from AIS Spec into a project repo during upgrade by default:

```text
docs/
specs/
README.md
.project-context/
```

Project repos own their own docs, specs, README, raw context, application code,
tests, infrastructure, and deployment pipelines beyond the optional AIS Spec
defaults.

`specs/` is especially important: AIS Spec may use tracked specs to manage
framework changes in its own source repo, but those source-repo specs must not
be copied into downstream projects. Project repos create and own their own
`specs/` content.

## Version Detection

The copied framework version is `.specify/VERSION`. Use root `VERSION` only as a
fallback when `.specify/VERSION` does not exist.

The AIS Spec source version should be read from both `.specify/VERSION` and
`VERSION`. If those values disagree, stop and resolve the source repo before
copying files.

## Drift Detection

When possible, compare three states for every managed file:

1. The project file.
2. The same file from the project's recorded AIS Spec release tag.
3. The same file from the selected target AIS Spec source.

Classify files this way:

| Classification | Meaning |
| --- | --- |
| `unchanged` | Project file already matches the target source. |
| `source-updated` | Project file matches its recorded baseline and can be safely copied from target source. |
| `added` | Target source added a managed file missing from the project. |
| `missing` | Target source still has a baseline file that the project deleted or never copied. |
| `project-customized` | Project changed a file that the source did not change. Usually leave this alone. |
| `manual-review` | Project and source both changed the same baseline file. Merge deliberately. |
| `removed-or-obsolete` | Project has a managed file that no longer exists in target source. Do not delete automatically. |
| `not-applicable` | File group is not selected for this project. |

If the recorded release tag is unavailable, treat changed existing files as
manual review unless the user explicitly chooses to replace them.

## Manual Upgrade

If you are upgrading without the skill:

1. Fetch AIS Spec and choose the target release or branch.
2. Read `.specify/VERSION` in the project repo and AIS Spec source.
3. Review `CHANGELOG.md` entries between the two versions.
4. Diff the managed payload against the project repo.
5. Copy safe updates first.
6. Merge drifted files manually.
7. Copy root `Skills/` if it is missing or behind.
8. Copy or regenerate the AI tool surfaces the project uses.
9. Run relevant validation for the project.
10. Commit the upgrade.

## Validation

At minimum, review:

```bash
git status --short
git diff --stat
bash .specify/scripts/bash/generate-commands.sh --check
bash .specify/scripts/bash/validate-frontmatter.sh
```

Run project-specific tests and CI checks before merging the upgrade.
