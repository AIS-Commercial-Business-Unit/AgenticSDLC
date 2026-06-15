## Summary

<!-- Describe what changed and why. Not what the diff shows — explain the intent, the context, and the tradeoff. -->

## Type of Change

<!-- Check all that apply -->

- [ ] `feat` — New feature or capability
- [ ] `fix` — Bug fix
- [ ] `docs` — Documentation only
- [ ] `chore` — Maintenance, dependency update, configuration
- [ ] `test` — Test additions or corrections
- [ ] `refactor` — Refactoring without behavior change
- [ ] `break` — Breaking change (fill in the Breaking Changes section below)

## Linked Issues

<!-- Link issues this PR resolves. Use closing keywords where applicable. -->

Closes #

## Testing Done

<!-- What did you run to validate this change? Provide commands, output excerpts, or screenshots. -->
<!-- "It works on my machine" requires evidence. -->

- [ ] Unit tests pass (`npm test` or equivalent)
- [ ] Schema validation passes (`npm run validate:governance` if governance files changed)
- [ ] Markdown lint passes (`npm run lint:md`)
- [ ] Manual validation completed (describe below)

**Manual validation:**

<!-- Describe any manual steps taken and what you observed. -->

## Screenshots / Evidence

<!-- Attach screenshots, terminal output, or log excerpts if the change has a visible output or behavior. -->
<!-- Remove this section if not applicable. -->

## Breaking Changes

<!-- If this is a breaking change, describe what downstream teams must change. -->
<!-- Format: BREAKING CHANGE: <description of what changed and how to migrate> -->
<!-- Remove this section if not applicable. -->

## Governance Checklist

<!-- Complete this section if any of the following files were changed:
     - config/governance-registry.yaml
     - framework/schemas/
     - .github/workflows/
     - .github/agents/
     - Skills/ (agent definitions)
     Remove this section if none of the above apply. -->

- [ ] Governance registry changes have 2 reviewers assigned (required)
- [ ] The governance registry entry `status` field reflects the change (Draft / Approved)
- [ ] Schema changes include a corresponding test update in `tests/`
- [ ] Agent definition changes include documentation updates
- [ ] CODEOWNERS-required reviewers are assigned for this PR

## Reviewer Notes

<!-- Specific areas where you want focused attention. Known tradeoffs. Decisions you made that reviewers should evaluate. Questions you want answered. -->

## Release Note

<!-- Content for CHANGELOG.md. Describe the change from the perspective of someone adopting this framework. -->
<!-- Required if your organization uses automated changelog generation from PR descriptions. -->
