# Branching Strategy for Enterprise Teams

Branching discipline is the foundation of safe agentic engineering. When AI
agents can create branches, open pull requests, and propose merges, the
branching model must be explicit enough that every automated action lands in a
predictable, auditable place.

---

## Why Branching Discipline Matters at Scale

At scale, branching failures compound:

- Hundreds of developers on a shared main branch means merge conflicts multiply
  faster than teams can resolve them.
- Agents creating branches without naming conventions produce repositories that
  no human or tool can navigate.
- Long-lived branches accumulate divergence that leads to integration failures
  at the worst possible moment — release time.
- Without protected branches, CI bypasses accumulate until one bad merge
  reaches production.

A consistent, enforced branching model removes these failure modes.

---

## Recommended Model: Trunk-Based Development

The framework recommends **trunk-based development** with feature flags for
enterprise scale.

### Core Principles

- **One integration branch** (`main` or `trunk`) — the always-deployable,
  always-releasable branch.
- **Short-lived feature branches** — typically open for 1–3 days. Longer than
  a week is a smell.
- **Feature flags** for incomplete features — code ships to `main` behind a
  flag before the feature is ready. This keeps branches short and integration
  frequent.
- **No long-lived environment branches** — `dev`, `staging`, `production`
  branches that track environments create merge debt. Use deployment pipelines
  and environment configuration instead.

### Why Not GitFlow?

GitFlow (with `develop`, `release/x.y.z`, and `hotfix/` branches) made sense
for infrequent batch releases. For teams deploying continuously or weekly:

- The double-trunk (`main` + `develop`) creates a merge synchronization problem
  that grows with team size.
- Release branches become long-lived quickly, defeating the purpose.
- Hotfix workflows are complex and error-prone under pressure.

If your organization is locked into GitFlow for compliance or tooling reasons,
the PR and governance standards in this framework still apply. Adapt the branch
protection rules to your `develop` branch as the primary integration target.

---

## Branch Protection Rules

Apply these rules to your primary integration branch (`main`).

### Minimum Required (GitHub Ruleset)

The ruleset JSON in [branch-protection-ruleset.json](branch-protection-ruleset.json)
encodes these rules in the GitHub API format.

| Rule | Setting | Rationale |
|------|---------|-----------|
| Require pull request | Yes | No direct commits to `main` |
| Required reviewers | 1 minimum (2 for governance/security) | Human review gate |
| Dismiss stale reviews | Yes | Re-review required after new pushes |
| Require status checks | All CI jobs | Code must pass before merge |
| Require branches up-to-date | Yes | Prevents integration surprises |
| Block force pushes | Yes | Preserves audit trail |
| Require conversation resolution | Yes | Reviewers confirm all comments addressed |
| Restrict deletions | Yes | `main` cannot be deleted |

### CODEOWNERS for Governance-Sensitive Paths

Configure CODEOWNERS (see [CODEOWNERS.template](CODEOWNERS.template)) to route
changes in governance-sensitive directories to designated reviewers
automatically. This applies regardless of who opens the PR — including agents.

### Recommended: Require Signed Commits

For organizations with compliance requirements, enabling required signed commits
provides a cryptographic audit trail of who authored each change.

---

## Branch Naming Conventions

### Standard Format

```
type/brief-description
```

| Type | Use for |
|------|---------|
| `feat/` | New features or capabilities |
| `fix/` | Bug fixes |
| `docs/` | Documentation changes |
| `chore/` | Maintenance, dependency updates, configuration |
| `test/` | Test additions or corrections |
| `refactor/` | Refactoring without behavior change |
| `release/` | Release preparation (if using GitFlow) |

### Examples

```
feat/brownfield-repository-assessment
fix/governance-registry-missing-processStep-validation
docs/autonomy-levels-l3-constraints
chore/upgrade-actionlint-1.7.1
test/governance-schema-required-fields
```

### For Spec-Driven Work (AIS Specify Lifecycle)

When work is tracked as a spec (`YYMM-NNN`), the branch name matches the spec
ID:

```
2602-001-core-api-data-model
2603-005-brownfield-assessment-command
2603-005.1-repository-detection-heuristics
```

### Agent-Created Branches

Agents operating at L2 or L3 autonomy may create branches automatically.
Configure the agent's branch naming template in `config/aispec.config.yaml` to
match your convention:

```yaml
agents:
  branchTemplate: "agent/{agentName}/{specId}-{brief}"
```

Agent-created branches are distinguishable by the `agent/` prefix and are
subject to the same branch protection rules as human-created branches.

---

## When to Use Long-Lived Branches

Short answer: rarely, and always with a plan to eliminate them.

| Scenario | Approach |
|----------|---------|
| Large feature too big for one branch | Split into independent sub-specs, each with its own short-lived branch |
| Feature needing integration testing before merge | Merge behind a feature flag; test with the flag enabled in a non-production environment |
| Compliance-required release freeze | Use a tag, not a branch. Branch from that tag for hotfixes only |
| Parallel team working on conflicting areas | Coordinate via the specification artifacts; serialize conflicting changes |

If a branch exceeds 2 weeks, treat it as a process problem, not a branching
problem.

---

## Merge Strategies and Their Tradeoffs

| Strategy | When to use | Tradeoffs |
|----------|-------------|-----------|
| **Squash and merge** | Feature branches into `main` | Clean linear history; loses individual commit granularity; PR description becomes the permanent record — write it well |
| **Merge commit** | Release tags, hotfix back-merges | Preserves full history and merge point; produces noisier history on `main` |
| **Rebase and merge** | Only for solo contributors with clean, atomic commits | Rewrites commit SHAs; dangerous in shared branches; do not use for PRs from forks |

**Recommendation:** Squash and merge for all feature work. Merge commits for
release tagging only. Never rebase-merge on a shared branch.

---

## Protecting Your Branch Strategy from Agent Drift

Agents operating at L3 may propose branch operations. Add the following to your
governance registry to constrain agent branching behavior:

```yaml
id: agent-branch-creation
activity: Create feature branch
autonomyLevel: L2
maximumAutonomyLevel: L3
prohibitedActions:
  - create-branch-targeting-main-directly
  - delete-protected-branch
  - force-push-to-any-branch
requiredInputs:
  - approved-specification-or-issue
```

This ensures that even at L3, agents cannot delete protected branches or bypass
the PR requirement.
