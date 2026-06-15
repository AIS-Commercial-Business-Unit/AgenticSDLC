# Phase 2 Demo: Brownfield Discovery and Initialization

## What This Demo Shows

Phase 2 of the Agentic Engineering Framework equips teams with a **repository scanner** that audits an existing codebase against the framework's readiness model — producing a scored gap report and a proposed initialization config. This demo walks through running those tools against a realistic brownfield Node.js service so you can see exactly what a team would discover on day one.

---

## Prerequisites

- Node.js 20+
- From the AgenticSDLC root: `npm install`
- The demo target: `samples/brownfield-sample/` (pre-populated brownfield repo)

---

## Step 1: Run the Repository Scanner

The scanner inspects the target directory and scores it against the framework's readiness dimensions.

```bash
node scripts/scan-repository.mjs samples/brownfield-sample
```

### Expected Output

```
──────────────────────────────────────────────────
  Agentic Engineering Framework — Repository Scan
  Target: samples/brownfield-sample
──────────────────────────────────────────────────

Scanning...

  ✔  README.md                found
  ✔  package.json             found
  ✔  .gitignore               found
  ✔  CONTRIBUTING.md          found
  ✔  .github/workflows/ci.yml found
  ✗  AGENTS.md                not found
  ✗  .github/agents/          not found
  ✗  copilot-instructions.md  not found
  ✗  config/aispec.config.*   not found
  ✗  docs/adr/                not found
  ✗  .github/CODEOWNERS       not found
  ✗  .github/pull_request_template.md  not found
  ✗  docs/runbooks/           not found

Score: 31 / 100   Tier: UNINITIALIZED

Gaps detected: 9
  — AI governance layer missing (no AGENTS.md, no agent configs)
  — Framework not installed (no aispec.config.yaml)
  — No ADR directory or decision records found
  — CI pipeline exists but has no schema validation or deployment stage
  — CONTRIBUTING.md missing branching strategy, commit format, reviewer requirements
  — No CODEOWNERS file
  — No PR template
  — No runbooks directory
  — No docs/decisions/ or docs/adr/
```

**What to point out:**
- **Score (31/100)** — "Uninitialized" tier: the team has basic repo hygiene but zero AI governance infrastructure.
- **Tier label** — the framework classifies repos so teams know what phase of adoption they're in.
- **Gap list** — each gap maps to a specific framework artifact. Nothing is vague.

> 📸 _[Screenshot placeholder: scanner terminal output showing score and gap list]_

---

## Step 2: Generate the Gap Report

The scanner can emit a structured JSON report for CI integration or further tooling:

```bash
node scripts/scan-repository.mjs samples/brownfield-sample --output report.json
```

Open `report.json` to inspect the machine-readable findings:

```json
{
  "target": "samples/brownfield-sample",
  "scannedAt": "2026-06-13T16:25:00Z",
  "score": 31,
  "tier": "UNINITIALIZED",
  "gaps": [
    {
      "id": "missing-agents-md",
      "severity": "critical",
      "description": "No AGENTS.md found — AI agents have no behavioral contract for this repo.",
      "remediation": "Run initializer to generate AGENTS.md from aispec.config.yaml"
    },
    {
      "id": "missing-framework-config",
      "severity": "critical",
      "description": "config/aispec.config.yaml not found — framework is not installed.",
      "remediation": "Run: node scripts/initialize-repository.mjs"
    }
  ],
  "presentArtifacts": ["README.md", "package.json", "CONTRIBUTING.md", ".gitignore", ".github/workflows/ci.yml"]
}
```

**What to point out:**
- Each gap has a `severity` and a concrete `remediation` step.
- The report is designed to feed into the initializer — the two tools form a pipeline.

> 📸 _[Screenshot placeholder: report.json open in editor showing gap objects]_

---

## Step 3: Run the Initializer

The initializer reads the gap report, asks a short questionnaire, and proposes a config before writing anything.

```bash
node scripts/initialize-repository.mjs samples/brownfield-sample
```

### Questionnaire Walkthrough

```
? What is this service's primary purpose?
  › REST API for managing customer orders

? What AI agents will work in this repo? (select all that apply)
  ◉ GitHub Copilot (code suggestions)
  ◉ Copilot Chat / CLI (task automation)
  ◯ Custom agents

? Select your branching strategy:
  › trunk-based  /  gitflow  /  github-flow
  ❯ github-flow

? Who is the primary code owner? (GitHub username)
  › @fulfillment-team

? Enable ADR tracking?
  ❯ Yes
```

### Proposed Config Preview

After the questionnaire, the initializer shows what it will write **before** touching any files:

```
──────────────────────────────────────────────
  Proposed changes (review before confirming)
──────────────────────────────────────────────

  NEW  config/aispec.config.yaml
  NEW  AGENTS.md
  NEW  .github/agents/copilot.md
  NEW  .github/CODEOWNERS
  NEW  .github/pull_request_template.md
  NEW  docs/adr/0001-record-architecture-decisions.md

? Apply these changes?  › Yes / No / Show diff
```

**What to point out:**
- The initializer is **non-destructive by default** — it only creates new files, never overwrites existing ones without explicit confirmation.
- The "Show diff" option lets reviewers see exact content before approving.
- Human approval is required before any file is written.

> 📸 _[Screenshot placeholder: initializer questionnaire and proposed changes list]_

---

## Step 4: Verify the Results

After confirming, re-run the scanner to see the improved score:

```bash
node scripts/scan-repository.mjs samples/brownfield-sample
```

```
Score: 74 / 100   Tier: INITIALIZED

Remaining gaps: 2
  — No runbooks directory
  — CI pipeline missing deployment stage
```

**Files written by the initializer:**

| File | Purpose |
|------|---------|
| `config/aispec.config.yaml` | Framework configuration — registers this repo with the framework |
| `AGENTS.md` | AI behavioral contract — scope, permissions, escalation rules |
| `.github/agents/copilot.md` | Copilot-specific instructions for this repo |
| `.github/CODEOWNERS` | Code ownership for automated review routing |
| `.github/pull_request_template.md` | Standardized PR checklist |
| `docs/adr/0001-record-architecture-decisions.md` | Seed ADR establishing the ADR practice |

> 📸 _[Screenshot placeholder: re-scan output showing 74/100 and INITIALIZED tier]_

---

## Step 5 (Copilot): Run the Assessment Prompt

With the brownfield sample in place, you can run the framework's brownfield assessment prompt directly in GitHub Copilot Chat or the CLI:

1. Open Copilot Chat (VS Code or github.com)
2. Attach or reference `samples/brownfield-sample/` as context
3. Run the prompt:

```
@workspace /prompt framework:brownfield.assess
```

Or using the Copilot CLI:

```bash
gh copilot prompt --file framework/prompts/brownfield.assess.md \
  --context samples/brownfield-sample/
```

**What Copilot returns:**
- A narrative gap analysis written in plain English
- Prioritized remediation recommendations
- A proposed adoption roadmap (2–4 sprint plan)

**What to point out:**
- The AI assessment complements the scanner — scanner gives machine-readable facts, Copilot gives human-readable narrative and prioritization.
- The two outputs can be combined into a stakeholder-facing onboarding report.

> 📸 _[Screenshot placeholder: Copilot Chat response with gap analysis and roadmap]_

---

## What the Demo Proves

This demo validates the following Phase 2 acceptance criteria:

- [x] **Scanner runs against an arbitrary repo** — no framework pre-installation required on the target
- [x] **Scoring is deterministic** — same repo always produces the same score
- [x] **Gaps are specific and actionable** — each gap names the missing artifact and links to a remediation
- [x] **Tier classification is meaningful** — UNINITIALIZED / INITIALIZED / GOVERNED / OPTIMIZED
- [x] **Initializer is non-destructive** — requires human approval, shows diff before writing
- [x] **Initializer raises the score** — post-initialization re-scan shows measurable improvement
- [x] **Copilot prompt layer works** — brownfield.assess.md produces a usable narrative output
- [x] **End-to-end pipeline is < 10 minutes** — from first scan to initialized repo in a single demo session
