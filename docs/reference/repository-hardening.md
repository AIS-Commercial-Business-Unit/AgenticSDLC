# Repository Hardening

This page records repository controls that protect `main` and keep the
framework release process predictable.

## Branch Protection

`main` is protected by the `main release-protected` repository ruleset.
The ruleset should require:

- Pull requests for all changes.
- One approving review before merge.
- Linear history.
- No branch deletions.
- No non-fast-forward updates.
- Required status checks for every job in `.github/workflows/ci.yml`.

The AIS release GitHub App is the only bypass actor. It can commit release
metadata after a PR merge without weakening the human PR path.

## CI Checks

The CI workflow is the merge gate for pull requests and pushes to `main`.
It validates:

- Release label and release note metadata.
- Markdown formatting.
- Spec frontmatter.
- Generated command file drift.
- Bash syntax and ShellCheck error-level findings.
- GitHub Actions workflow syntax.

Generated command files must be refreshed with:

```bash
bash .specify/scripts/bash/generate-commands.sh
```

## Release App Configuration

Release automation uses `actions/create-github-app-token` with the GitHub App
client ID. The repository must have:

- Repo variable `AIS_RELEASE_APP_CLIENT_ID`.
- Repo secret `AIS_RELEASE_APP_PRIVATE_KEY`.

The legacy `AIS_RELEASE_APP_ID` variable is not used by the workflow.

## Dependency Updates

Dependabot is configured in `.github/dependabot.yml` to open weekly GitHub
Actions update PRs with the `dependencies` and `release:patch` labels. The
release scripts synthesize a patch release note from Dependabot's title when
the generated Dependabot PR body is intact. These PRs still need the normal
CI and review path before merge.

## Secret Scanning

GitHub secret scanning and push protection should be enabled when available.
On 2026-04-28, the GitHub API returned `Secret scanning is not available for
this repository` when enablement was attempted for `ais-internal/ais-spec`.
