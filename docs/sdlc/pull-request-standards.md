# Pull Request Standards for Enterprise Teams

Pull requests are the primary governance control point in a GitHub-native
workflow. Every AI-assisted change, every agent-prepared patch, and every
human-authored feature goes through this gate. The standards here apply
uniformly — the origin of a change (human or agent) does not change the
requirements.

---

## PR Size Guidelines

### Target: Under 400 Lines Changed

PRs under 400 lines of changed code receive meaningfully better reviews. Above
that threshold, reviewers shift from detailed analysis to pattern-matching.

This is not a hard limit, but it is a strong signal. If a PR consistently
exceeds 400 lines:

- Split the work into independent increments, each behind a feature flag if
  the feature is not ready.
- Separate refactoring changes from behavior changes — they should rarely share
  a PR.
- For framework changes affecting many files through a consistent pattern
  (e.g., a rename across 50 files), a large PR is acceptable if the change is
  purely mechanical and a tool generated it. Document this in the PR description.

### What to Count

Count meaningful lines: application code, configuration, tests, and
documentation. Do not count generated lock files, minified assets, or
auto-formatted output unless you authored the generator change.

### Agent-Generated PRs

Agents operating at L2 will prepare PRs for human approval. Instruct agents
via the governance registry to split work that exceeds the size threshold:

```yaml
id: agent-pr-preparation
activity: Prepare pull request
autonomyLevel: L2
requiredEvidence:
  - pr-size-within-threshold-or-justified
```

---

## Review SLAs

| PR Type | Target review SLA |
|---------|------------------|
| Standard feature | 1 business day |
| Bug fix (non-critical) | 1 business day |
| Security or governance change | 2 business days (2 reviewers required) |
| Hotfix | 4 hours |
| Documentation only | 2 business days |

SLAs measure time to first substantive review response — approve, request
changes, or comment with a specific question. Silence is not a review.

If a PR sits without review beyond its SLA:

1. The author pings the reviewer directly.
2. If still unreviewed after 1 additional business day, the author escalates
   to the team lead or a designated backup reviewer.

Do not merge without a review. SLA pressure is not a bypass.

---

## What Makes a Good PR Description

A PR description is the permanent record of why a change was made. After
merge, the PR is the audit trail — write it as if the reader has no prior
context.

A complete PR description includes:

- **Summary** — What changed and why. Not what the diff shows — that is already
  visible. Explain the intent and the tradeoff.
- **Linked issues** — Every PR should trace to at least one issue or spec.
  Use GitHub's closing keywords (`Closes #42`) when the PR fully resolves the
  issue.
- **Type of change** — feat / fix / docs / breaking / chore. Breaking changes
  must document the migration path.
- **Testing done** — What was run, what passed, what was validated manually.
  "It works on my machine" requires evidence: test output, screenshot, or log.
- **Governance checklist** — For governance-sensitive changes, confirm the
  required reviewers are assigned and the registry is updated.
- **Reviewer notes** — Specific areas where you want focused review. Questions
  you want answered. Known tradeoffs the reviewer should evaluate.

Use the [PR template](pr-template.md) to ensure nothing is missed.

---

## Draft vs. Ready States

### Draft PRs

Use Draft when:

- Work is in progress and you want visibility or early async feedback.
- CI is failing and you are actively fixing it.
- You want architecture feedback before implementation is complete.

Rules for Draft PRs:

- Do not request formal review on a Draft PR.
- CI still runs — do not use Draft to avoid CI.
- Convert to Ready only when CI passes and the description is complete.

### Ready PRs

A Ready PR signals that:

- The author believes the work is correct and complete.
- CI passes.
- The description is complete per the template.
- The correct reviewers are assigned.
- The author is prepared to respond to review within 1 business day.

Do not convert Draft to Ready as a way to escalate — complete the work first.

---

## Handling Stale PRs

A PR is stale when it has had no activity for 5 or more business days.

**Author responsibility:**
- Respond to review comments within 1 business day.
- Keep the branch current with the target branch.
- Close the PR if the work is no longer relevant.

**Reviewer responsibility:**
- If you are assigned and cannot review within the SLA, say so — unassign
  yourself or nominate an alternative.

**Automated handling:**
Configure a stale PR action in `.github/workflows/` to:
1. Label PRs as `stale` after 5 days of inactivity.
2. Add a comment explaining the stale policy.
3. Close the PR after 10 additional days of inactivity with a `wont-merge`
   label.

Stale PRs are not automatically merged. They are closed. Merging stale changes
without review is a governance violation.

---

## Auto-Merge Conditions

Auto-merge is appropriate only when all of the following are true:

1. All required reviewers have approved.
2. All CI checks pass.
3. All review conversations are resolved.
4. The branch is up-to-date with the target branch.
5. The PR is not labeled `hold` or `do-not-merge`.
6. The change is not to a governance-sensitive path (CODEOWNERS-gated paths
   require human merge confirmation).

Configure auto-merge in the repository settings. Enable it per-PR (not
globally) — the author enables auto-merge after receiving approval, not before.

Agents at L3 may enable auto-merge on PRs they prepared, but only if the
governance registry explicitly authorizes it for that activity type:

```yaml
id: agent-auto-merge-authorization
activity: Enable auto-merge on prepared PR
autonomyLevel: L3
prohibitedActions:
  - enable-auto-merge-on-governance-sensitive-paths
  - enable-auto-merge-without-required-approvals
```

---

## PR Lifecycle Summary

```
Draft PR → (CI passing, description complete) → Ready for Review
    → (reviewer assigned, SLA starts) → Review in Progress
    → (approved, all checks pass, conversations resolved) → Merge Eligible
    → (squash and merge) → Closed / Merged
```

**Abandoned:**
```
Ready for Review → (5 days no activity) → Stale
    → (10 more days no activity) → Closed (wont-merge)
```

---

## Checklist Reference

Before converting Draft to Ready:

- [ ] CI passes (all required checks green)
- [ ] PR description complete (summary, linked issues, testing evidence)
- [ ] Correct reviewers assigned (check CODEOWNERS for auto-assignment)
- [ ] Release label applied if required
- [ ] Branch is up-to-date with target branch
- [ ] No unresolved TODO comments in changed files
- [ ] Governance checklist completed (if applicable)
