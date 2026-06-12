# AIS-spec Improvement Loop

How to turn lessons from an implemented project repo into small, reusable
improvements to `ais-internal/AIS-spec`.

## What This Is

The AIS-spec Improvement Loop is the practice of reviewing delivered work in a
project repo, extracting reusable lessons, and upstreaming them into AIS-spec.

This guide is about improving **AIS-spec itself**:

- prompts
- templates
- playbooks
- docs
- command behavior
- scripts and checks
- generated agent files

It is **not** about copying project deliverables or client-specific code into
AIS-spec.

## When To Run It

Run the loop when a project has taught the team something future AIS-spec users
should get by default.

Typical triggers:

- a spec shipped and exposed a reusable pattern
- the team repeated the same fix across multiple PRs
- an agent missed something because the prompt or template was weak
- a playbook recommendation proved incomplete or wrong
- manual cleanup should really become a default template, prompt, or check
- a bug, incident, or rollback exposed missing guidance

Do not wait for a large cleanup. Small, evidence-backed improvements are easier
to review and more likely to stick.

## Inputs

To run the loop well, the agent or reviewer should inspect:

- the implemented project repo
- `spec.md`, `design.md`, and `tasks.md` for the relevant specs
- merged PRs and review comments
- defects, incidents, or operational learnings if available
- the current AIS-spec repo so changes can be routed to the right source files

Evidence preference order:

1. running code, tests, logs, validated behavior
2. spec artifacts and project docs
3. PR diffs and review threads
4. meeting notes or chat summaries

If a lesson only exists in someone's memory, it is not strong enough to
upstream yet.

## Reusability Test

Before changing AIS-spec, ask:

- Is this specific to one client, codebase, or integration?
- Would the same lesson help another project using AIS-spec?
- Is the problem really a one-off workaround, or does it repeat?
- Should this become guidance, structure, or enforcement?

If the answer is project-specific, keep it in the project repo.

If the answer is reusable, route it into AIS-spec.

## Where Improvements Belong

Use the narrowest AIS-spec target that will improve future behavior:

| If the lesson is about... | Put it here |
|---|---|
| Reusable domain patterns, common failure modes, estimation or architecture choices | `.specify/playbooks/` |
| Repeated agent omissions or weak workflow behavior | `.specify/prompts/` |
| Missing default structure in generated artifacts | `.specify/templates/` |
| Human guidance for how to run AIS-spec | `docs/guides/` or `docs/reference/` |
| Something that should be prevented mechanically | `.specify/scripts/` or CI checks |
| Repo-wide standing rules and generated agent instructions | `.specify/repo-instructions.md` and regenerated outputs |

Prefer editing source-of-truth files, then regenerate derived files if needed.

## The Loop

### 1. Inspect the implemented project

Review the delivered work and capture:

- what went well because AIS-spec guided it correctly
- what went wrong because AIS-spec was silent, vague, or misleading
- what had to be rediscovered manually
- what repeated across multiple specs or PRs

### 2. Extract reusable lessons

Summarize only the lessons that should help future teams. Good candidates are:

- repeatable implementation patterns
- anti-patterns that caused bugs or rework
- missing decision prompts
- missing template sections
- quality checks that should become standard

### 3. Route each lesson

Decide whether the lesson belongs in:

- a playbook
- a prompt
- a template
- a doc
- a script or check

Avoid broad edits when a smaller targeted change will do.

### 4. Make the smallest useful AIS-spec change

Prefer small upstream improvements:

- add one prompt instruction
- add one template section
- tighten one guide
- add one playbook pattern
- add one validation rule

Do not turn one project's entire delivery history into AIS-spec content.

### 5. Preserve evidence

When raising the AIS-spec change, capture:

- source repo name
- spec ID or feature name
- relevant PRs, incidents, or examples
- why the change is reusable

The AIS-spec PR should explain the lesson and where it came from without
bringing client-specific internals into this repo.

### 6. Re-run when new lessons appear

This is a loop, not a one-time migration. Run it again after future specs,
milestones, incidents, or major refactors.

## How To Use This With Agents

The guide is intentionally written so you can point a coding agent at it.

Recommended setup:

1. Open the implemented project repo and the AIS-spec repo.
2. Tell the agent to read this guide.
3. Ask it to inspect the project repo for reusable lessons.
4. Ask it to propose or implement the upstream AIS-spec changes.

Example prompt:

```text
Read docs/guides/improvement-loop.md in AIS-spec.

Inspect this implemented project repo for reusable lessons that should improve
AIS-spec itself. Focus only on changes that belong upstream in AIS-spec:
playbooks, prompts, templates, docs, scripts, checks, or generated agent
instructions.

Do not copy project-specific code or client-specific deliverables. For each
proposed change, explain the source evidence, why it is reusable, and where it
belongs in AIS-spec. Then make the smallest useful upstream change.
```

## Expected Output

A good Improvement Loop run should produce one or more of:

- a small AIS-spec docs PR
- a prompt or template improvement
- a playbook update
- a new check or script refinement
- a concise list of proposed upstream changes if implementation is deferred

The result should be understandable without reopening the original project repo
to reconstruct the reasoning.

## Non-Goals

- copying client code into AIS-spec
- turning every project preference into a global default
- upstreaming speculative ideas without evidence
- rewriting large parts of AIS-spec when one small change would solve the problem
- preserving stale guidance next to new guidance instead of replacing it

## Quality Bar

Only upstream changes that are:

- **evidence-backed**
- **reusable across projects**
- **small enough to review clearly**
- **targeted at the correct AIS-spec source file**
- **safe to promote without client-specific context**

If a lesson does not clear that bar yet, keep it in the project repo until it
does.
