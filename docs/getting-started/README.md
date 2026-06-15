# Getting Started with AEF

The Agentic Engineering Framework installs directly into your repository and gives you a maturity dashboard, governance config, and AI-powered scanner in under 5 minutes.

---

## Prerequisites

You need these tools installed before you begin.

### 1. Git
Download from [git-scm.com](https://git-scm.com) or install via your package manager.
```bash
git --version   # should print git version 2.x or higher
```

### 2. Node.js 20 or higher
Download from [nodejs.org](https://nodejs.org) (LTS recommended).
```bash
node --version  # should print v20.x or higher
npm --version   # should print 10.x or higher
```

### 3. GitHub CLI
Download from [cli.github.com](https://cli.github.com), install, then authenticate.
```bash
gh --version    # should print gh version 2.x or higher
gh auth login   # follow the prompts to sign in
```

### 4. gh-aw Extension (GitHub Agentic Workflows)
This is what compiles and runs the AI scanner workflow.
```bash
gh extension install github/gh-aw
gh aw --version   # should print v0.x
```

### 5. GitHub Copilot
The agentic scanner (`AEF Maturity Scanner` workflow) runs as a GitHub Copilot coding agent. Copilot must be enabled on your GitHub organization.

**Verify everything works:**
```bash
node --version && gh --version && gh aw --version
```

---

## Choose Your Path

| I want to… | Go to |
|------------|-------|
| Install AEF into an **existing repo** (brownfield) | [Brownfield Install](#brownfield-install) |
| Start a **new project** with AEF from day one | [Greenfield Setup](#greenfield-setup) |
| Understand what the maturity score means | [Reading Your Dashboard](#reading-your-dashboard) |
| Run the interactive self-assessment tool | [Self-Assessment](#interactive-self-assessment) |

---

## Brownfield Install

Install AEF into a repository that already exists. This is the most common path.

### Step 1 — Get the framework

Clone the AgenticSDLC repo to your local machine (this is your framework source).

```bash
git clone https://github.com/AIS-Commercial-Business-Unit/AgenticSDLC.git
cd AgenticSDLC
npm install
```

### Step 2 — Branch your target repository

Switch to the repo you want to assess. Create an `aef/` branch so nothing goes directly to main.

```bash
cd /path/to/your-repo
git checkout main
git pull origin main
git checkout -b aef/framework-install
```

### Step 3 — Install AEF

Run the installer. It scaffolds all framework files into your repo — no manual copying needed.

```bash
node /path/to/AgenticSDLC/scripts/install.mjs --target .
```

**What gets created in your repo:**

```
your-repo/
├── .github/
│   ├── agents/                     # Agent placeholder directory
│   └── workflows/
│       ├── aef-scan.md             # gh-aw workflow definition
│       └── aef-scan.lock.yml       # Compiled GitHub Actions workflow
├── scripts/
│   ├── aef-scan.mjs                # Local scanner (Node.js fallback)
│   ├── aef-report.mjs              # HTML report generator
│   └── generate-report.mjs         # Report module (required by scanner)
├── config/
│   └── aispec.config.yaml          # Governance configuration template
└── docs/
    └── assessment/                 # Assessment output directory
```

### Step 4 — Review the config

Open `config/aispec.config.yaml` and set your governance preferences. The defaults are safe — you don't need to change anything for the first scan.

```yaml
# The key setting is your default autonomy level:
governance:
  default_level: L1   # L1 = AI suggests, human decides (recommended starting point)
```

### Step 5 — Commit and push

```bash
git add .
git commit -m "feat: install AEF framework (baseline assessment)"
git push -u origin aef/framework-install
```

### Step 6 — Run your first scan

**Option A — Agentic scan via GitHub Actions (recommended)**

This runs the Copilot coding agent against your repo and opens a draft PR with results.

1. Go to your repository on GitHub
2. Click **Actions** → **AEF Maturity Scanner**
3. Click **Run workflow** → select your `aef/framework-install` branch → **Run workflow**
4. Wait ~2–3 minutes for the agent to complete
5. The agent opens a draft PR titled `[aef] Maturity Assessment — <repo name>`
6. Open the PR → find `docs/assessment/maturity-report.html` in the files changed
7. Merge the PR when you're ready to save the results

**Option B — Local scan (Node.js)**

Runs immediately without GitHub Actions. Output goes directly into your repo.

```bash
# From inside your target repo:
node scripts/aef-scan.mjs --target .
```

### Step 7 — View your dashboard

```bash
# macOS / Linux
open docs/assessment/maturity-report.html

# Windows
start docs/assessment/maturity-report.html
```

Or just open the file in any browser. The report is fully self-contained HTML — no server needed.

---

## Greenfield Setup

Starting a new project? Install AEF before your first commit.

```bash
# Create and initialize your repo
mkdir my-new-project
cd my-new-project
git init
echo "# My Project" > README.md
git add . && git commit -m "initial commit"

# Install AEF
node /path/to/AgenticSDLC/scripts/install.mjs --target .

# Set up your project plan with the Specify lifecycle
# (In GitHub Copilot chat):
#   @ais.setup.plan  — generate a project plan
#   @ais.setup.architecture  — define your architecture
#   @ais.setup.constitution  — configure agent governance rules
```

---

## Reading Your Dashboard

Your maturity report shows a score from 0–100 across 6 dimensions.

### Maturity Tiers

| Score | Tier | What It Means |
|-------|------|---------------|
| 0–20 | 🔴 **Ad Hoc** | No structured agentic practices in place |
| 21–40 | 🟡 **Foundation** | Basic CI/CD and some governance artifacts exist |
| 41–60 | 🔵 **Governed** | Structured requirements, decision logs, and agent definitions present |
| 61–80 | 🟢 **Integrated** | Agents are integrated into the full delivery lifecycle |
| 81–100 | 🟣 **Optimizing** | Full agentic lifecycle with metrics, feedback loops, and continuous improvement |

### Dimension Breakdown

- **Engineering Baseline (10%)** — Is your CI/CD and branching solid? Agents can't help a team with broken fundamentals.
- **AI Governance & Controls (22%)** — Do you have defined autonomy levels, audit trails, and approval gates? This is the highest-weight dimension because it's the hardest to retrofit.
- **Spec-Driven Context Architecture (18%)** — Are your requirements structured so agents can act on them? Decision logs, EARS-format specs, and version-controlled prompts all count.
- **Agent & Skill Lifecycle (20%)** — Do you have a catalog of agents, a skills library, and MCP configuration? Undefined agents can't be governed.
- **Agentic Workflow Integration (18%)** — Are agents actually wired into your PR, review, and security workflows? Or are they only used in the editor?
- **Metrics, Observability & Learning (12%)** — Can you show that agentic engineering is working? Velocity data, before/after baselines, and dashboards prove the value.

### What to Do With a Low Score

A low score on day 1 is expected and correct — it means the scanner is working. The report's **Gaps** section lists the 3 highest-priority items with concrete recommendations. Start there.

---

## Interactive Self-Assessment

For a team workshop or stakeholder conversation, use the interactive maturity checklist tool. It lets you manually check off items and see a live score — no installation required.

Open the website: **[AEF Maturity Checklist](../../website/maturity-checklist.html)**

Or visit the deployed site if your organization has published it to GitHub Pages.

---

## Next Steps

| Goal | Resource |
|------|---------|
| Understand the 9-step Specify lifecycle | [docs/reference/workflow.md](../reference/workflow.md) |
| Configure autonomy levels for your team | [config/aispec.config.yaml](../../config/aispec.config.yaml) |
| Set up agent definitions for your repo | [docs/guides/brownfield-onboarding.md](../guides/brownfield-onboarding.md) |
| Run the governance initialization playbook | [docs/playbooks/governance-init.md](../playbooks/governance-init.md) |
| Add AEF to multiple repos (enterprise rollout) | Coming soon |

---

## Troubleshooting

**`gh aw: command not found`**
Run `gh extension install github/gh-aw` and try again.

**`node: command not found`**
Node.js is not installed or not in your PATH. Install from [nodejs.org](https://nodejs.org).

**`Error: target path does not exist`**
The `--target` path is wrong. Use `.` if you're already in the target repo, or a full absolute path.

**The GitHub Actions workflow doesn't appear**
Make sure you pushed the `aef-scan.lock.yml` file (the compiled workflow). The `.md` file alone won't trigger Actions — the compiled `.lock.yml` is the actual workflow.

**The scan score seems too low / too high**
The scanner reads file and directory structure — it doesn't read file contents. A directory named `adr/` scores for decision logs even if it's empty. A first scan is a baseline, not a verdict.

---

> **Questions?** Open an issue on [GitHub](https://github.com/AIS-Commercial-Business-Unit/AgenticSDLC/issues) or reach the team through your normal channels.
