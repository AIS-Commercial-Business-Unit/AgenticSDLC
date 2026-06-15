# Enterprise SDLC Maturity Self-Assessment

This checklist helps engineering organizations assess their readiness to adopt
the Agentic Engineering Framework safely. Each item is rated **Yes**, **Partial**,
or **No** with guidance on how to achieve it.

Complete this assessment before enabling L2 or L3 autonomy levels. Revisit it
quarterly or after significant process changes.

---

## How to Use This Checklist

For each item:

- **Yes** — The control is in place and operating consistently.
- **Partial** — The control exists but is inconsistently applied, not enforced
  by tooling, or covers only some teams or repositories.
- **No** — The control does not exist.

A score of **Yes** on all items in a section is not required before adopting
the framework. The checklist identifies gaps that increase risk at higher
autonomy levels.

**Minimum recommended before enabling L2:**
- Branch Management: 4/5 Yes
- PR Process: 3/4 Yes
- Code Review: 2/3 Yes
- CI/CD: 3/4 Yes

**Minimum recommended before enabling L3:**
- All sections: 4/5+ Yes
- Governance: 4/5 Yes
- Security: 3/4 Yes

---

## 1. Branch Management

| # | Practice | Status | Guidance |
|---|----------|--------|---------|
| 1.1 | Direct commits to the primary integration branch (`main` or `trunk`) are blocked by a branch protection rule | ☐ Yes ☐ Partial ☐ No | Configure a GitHub Ruleset or branch protection rule requiring a PR for all pushes to `main`. See [branch-protection-ruleset.json](branch-protection-ruleset.json). |
| 1.2 | Branch naming conventions are documented and followed consistently | ☐ Yes ☐ Partial ☐ No | Document the convention in CONTRIBUTING.md. Consider a CI lint check on branch names for automated enforcement. See [branching-strategy.md](branching-strategy.md). |
| 1.3 | Feature branches are short-lived (typically merged within 3–5 business days) | ☐ Yes ☐ Partial ☐ No | Track branch age using a GitHub Action or repo insights. Treat long-lived branches as a process smell requiring investigation. |
| 1.4 | Force pushes to protected branches are blocked | ☐ Yes ☐ Partial ☐ No | Enable "Block force pushes" in branch protection or the GitHub Ruleset. |
| 1.5 | Stale branches are cleaned up regularly (within 30 days of merge) | ☐ Yes ☐ Partial ☐ No | Configure a branch auto-deletion policy after merge. Use a cleanup workflow for unmerged branches older than 30 days. |

---

## 2. Pull Request Process

| # | Practice | Status | Guidance |
|---|----------|--------|---------|
| 2.1 | A PR template is in use and contributors complete it before requesting review | ☐ Yes ☐ Partial ☐ No | Add `.github/pull_request_template.md` to the repository. See [pr-template.md](pr-template.md) for the recommended template. |
| 2.2 | PRs are linked to issues or specs before merge | ☐ Yes ☐ Partial ☐ No | Require linked issues in the PR template. Consider a CI check that fails if no issue reference is present. |
| 2.3 | PRs are reviewed within the team's defined SLA | ☐ Yes ☐ Partial ☐ No | Define a review SLA (recommended: 1 business day). Track SLA compliance via GitHub Insights or a reporting workflow. See [pull-request-standards.md](pull-request-standards.md). |
| 2.4 | Draft PRs are used for work in progress; Ready state indicates review-ready | ☐ Yes ☐ Partial ☐ No | Document the Draft/Ready convention in CONTRIBUTING.md. Ensure contributors do not request review on Draft PRs. |

---

## 3. Code Review

| # | Practice | Status | Guidance |
|---|----------|--------|---------|
| 3.1 | At least 1 approving review is required before merge (2 for governance/security changes) | ☐ Yes ☐ Partial ☐ No | Configure required reviewers in branch protection. Use CODEOWNERS to require additional reviewers for sensitive paths. See [branch-protection-ruleset.json](branch-protection-ruleset.json). |
| 3.2 | Stale reviews are dismissed when new commits are pushed | ☐ Yes ☐ Partial ☐ No | Enable "Dismiss stale reviews" in branch protection settings. |
| 3.3 | Review conversations must be resolved before merge | ☐ Yes ☐ Partial ☐ No | Enable "Require conversation resolution" in branch protection. |
| 3.4 | CODEOWNERS is configured to route governance-sensitive changes to appropriate reviewers | ☐ Yes ☐ Partial ☐ No | Create a CODEOWNERS file using [CODEOWNERS.template](CODEOWNERS.template). Enable it in branch protection settings. |

---

## 4. CI/CD

| # | Practice | Status | Guidance |
|---|----------|--------|---------|
| 4.1 | CI runs on every PR and every push to the primary integration branch | ☐ Yes ☐ Partial ☐ No | Configure a GitHub Actions workflow triggered on `pull_request` and `push` to `main`. |
| 4.2 | Required CI status checks must pass before a PR can merge | ☐ Yes ☐ Partial ☐ No | Add required status checks to branch protection. All core CI jobs (lint, test, build) should be required. |
| 4.3 | Deployment to production is gated by an approval step (not automatic on merge) | ☐ Yes ☐ Partial ☐ No | Use GitHub Actions environments with required reviewers for production deployments. Automatic deployment to production without approval is a governance violation. |
| 4.4 | CI failures block merge — bypass is not routinely used | ☐ Yes ☐ Partial ☐ No | Ensure the "bypass" list on branch protection is limited to emergency access only. Document the bypass procedure and require a follow-up issue when bypass is used. |
| 4.5 | Build and test times are monitored and kept within a reasonable threshold (target: <10 minutes for PR checks) | ☐ Yes ☐ Partial ☐ No | Track CI duration trends. Split slow tests into a separate workflow that runs post-merge rather than blocking PRs. |

---

## 5. Documentation

| # | Practice | Status | Guidance |
|---|----------|--------|---------|
| 5.1 | A CONTRIBUTING.md exists and is kept current | ☐ Yes ☐ Partial ☐ No | Review and update CONTRIBUTING.md at least quarterly. It should reflect current branching, PR, and review standards. See the root [CONTRIBUTING.md](../../CONTRIBUTING.md). |
| 5.2 | Architecture decisions are recorded in ADRs or equivalent artifacts | ☐ Yes ☐ Partial ☐ No | Create an `docs/adr/` directory. Record decisions that affect architecture, technology selection, or governance in numbered ADR files. |
| 5.3 | User-facing changes include documentation updates in the same PR | ☐ Yes ☐ Partial ☐ No | Add "docs updated" to the PR checklist. Consider a CI lint check that fails if code changes touch user-facing paths without a corresponding docs change. |
| 5.4 | API and configuration contracts are versioned and documented | ☐ Yes ☐ Partial ☐ No | Use semantic versioning for any public API or configuration schema. Maintain a changelog or migration guide for breaking changes. |

---

## 6. Governance

| # | Practice | Status | Guidance |
|---|----------|--------|---------|
| 6.1 | The governance registry (`governance-registry.yaml`) is present and populated with at least Draft entries for all agent activities in use | ☐ Yes ☐ Partial ☐ No | Run the governance initialization playbook. See [docs/playbooks/02-governance-init.md](../playbooks/02-governance-init.md). |
| 6.2 | Autonomy levels are explicitly configured for each agent activity (not left at default) | ☐ Yes ☐ Partial ☐ No | Review each entry in the governance registry. Entries without an explicit `autonomyLevel` should be defaulted to L1 (Recommend). |
| 6.3 | Governance registry changes require 2 reviewers and are CODEOWNERS-gated | ☐ Yes ☐ Partial ☐ No | Add `config/governance-registry.yaml` to CODEOWNERS with 2 designated owners. Verify the branch protection ruleset enforces required reviewers from CODEOWNERS. |
| 6.4 | A governance reassessment schedule is defined and tracked | ☐ Yes ☐ Partial ☐ No | Configure `reviewIntervalDays` in the governance registry. Enable the reassessment workflow in `.github/workflows/` to create issues when reviews are due. |
| 6.5 | Audit logs of agent actions are retained and accessible | ☐ Yes ☐ Partial ☐ No | Configure the audit logging targets in `config/aispec.config.yaml`. Verify that agent action logs are written to an append-only artifact store (PR comments, GitHub Issues, or a separate log repository). |

---

## 7. Security

| # | Practice | Status | Guidance |
|---|----------|--------|---------|
| 7.1 | GitHub secret scanning and push protection are enabled | ☐ Yes ☐ Partial ☐ No | Enable in repository Settings > Security. Secrets committed to any branch are flagged and push protection prevents new secrets from landing. |
| 7.2 | Dependency scanning is active and critical vulnerabilities block merge | ☐ Yes ☐ Partial ☐ No | Enable Dependabot alerts and security updates. Add a CI check that fails on critical CVEs using `npm audit --audit-level=critical` or equivalent. |
| 7.3 | Production secrets and credentials are managed in a secret manager (not in `.env` files or code) | ☐ Yes ☐ Partial ☐ No | Use GitHub Secrets for CI/CD credentials. Use Azure Key Vault, AWS Secrets Manager, or equivalent for application runtime secrets. Verify `.env` files are in `.gitignore`. |
| 7.4 | Agents are prohibited from reading, logging, or committing secrets — enforced in the governance registry | ☐ Yes ☐ Partial ☐ No | Add `prohibitedActions: [read-secrets, log-credentials, commit-credentials]` to all agent definitions in the governance registry. |

---

## Scoring Summary

After completing the assessment, count your scores:

| Section | Yes | Partial | No | Risk Implication |
|---------|-----|---------|-----|-----------------|
| Branch Management | /5 | /5 | /5 | Long-lived branches and unprotected main increase merge risk |
| PR Process | /4 | /4 | /4 | Missing traceability and incomplete reviews reduce audit value |
| Code Review | /4 | /4 | /4 | Inadequate review gates allow ungoverned changes to reach main |
| CI/CD | /5 | /5 | /5 | Bypassed CI and ungated production deploys are high-risk |
| Documentation | /4 | /4 | /4 | Undocumented decisions accumulate as technical debt |
| Governance | /5 | /5 | /5 | Missing registry entries mean agent activities are ungoverned |
| Security | /4 | /4 | /4 | Secret exposure and ungoverned credentials are critical risks |

**Score interpretation:**
- All Yes in a section → safe to enable L3 for activities in that domain
- Majority Partial → L2 is appropriate; resolve Partials before L3
- Any No in Governance or Security → do not enable L2 or L3 until resolved

---

## Next Steps

After completing this assessment:

1. Prioritize items rated **No** in Governance and Security sections.
2. Convert **Partial** items to **Yes** for the sections relevant to your planned
   autonomy level.
3. Record the results as an artifact in your governance registry or project specs.
4. Schedule a reassessment for 90 days from this date.
5. Reference this assessment in PR descriptions when enabling higher autonomy
   levels — it is the evidence that the process foundation is in place.
