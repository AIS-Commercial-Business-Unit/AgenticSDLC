# docs/input — Brownfield Context Drop Zone

This directory is a **drop zone for user-supplied documentation** that provides additional context when running brownfield assessment and governance playbooks.

Files placed here are read by framework agents as supplemental context. They are **not committed to the repository by default** (see `.gitignore`).

---

## Purpose

When running brownfield playbooks, you may have existing documentation that the framework doesn't know about — architecture diagrams, existing agent catalogs, runbooks, process documents, or meeting notes. Dropping those files here makes them available to framework agents without requiring you to restructure your documentation.

---

## Supported Formats

| Format | Extension(s) | Notes |
|---|---|---|
| Markdown | `.md` | Full text search supported |
| Plain text | `.txt` | Full text search supported |
| Word documents | `.docx` | Text extracted by supporting agents |
| Excel workbooks | `.xlsx` | Sheet data extracted by supporting agents |
| PDF documents | `.pdf` | Text extracted by supporting agents |

---

## How to Use

1. **Copy your documents here:**
   ```
   docs/input/
     my-architecture-overview.docx
     existing-agent-catalog.xlsx
     runbook-deploy-process.md
   ```

2. **Run a brownfield playbook.** The playbook will check this directory and incorporate relevant files as supplemental context.

3. **The agent will list what it found** in its output, so you can confirm it picked up the right files.

### Example (GitHub Copilot)

```
@workspace I've added architecture docs to docs/input/. Run the brownfield assessment:
.specify/prompts/brownfield.assess.md
```

---

## What Types of Documents Work Well

| Document Type | Why It's Useful |
|---|---|
| Architecture overview docs | Helps agents understand system structure without reading all the code |
| Existing agent/automation catalogs | Pre-existing inventories that speed up `brownfield.agent.catalog` |
| Runbooks and process docs | Provides process context the governance initializer needs |
| ADR exports | Existing architectural decisions that inform governance policy |
| Meeting notes or decision logs | Captures context that isn't in code or config |
| Security or compliance requirements | Informs governance control risk levels |
| Team onboarding guides | Describes team conventions and workflows |

---

## Privacy and Security

⚠️ **Files in this directory are gitignored by default.** They are local only and will not be committed or pushed to the remote repository.

Do not place files here that contain:
- Secrets, credentials, or API keys
- Personal data covered by privacy regulations (GDPR, HIPAA, etc.)
- Files marked confidential that should not leave your local machine

---

## Processing Source Files into Markdown

Source files (Word, Excel, PDF) stay local and are never committed. To share context with your team, convert them to markdown first:

```bash
# Convert all files in docs/input/ to markdown in docs/input/processed/
./scripts/process-input-docs.sh
```

Processed `.md` files in `docs/input/processed/` **are committed** and tracked in git. They are not authoritative truth sources — they are working context, converted for readability and referenceability.

### What the script does
1. Detects each file type in `docs/input/`
2. Converts to markdown using [pandoc](https://pandoc.org/)
3. Saves as `docs/input/processed/{filename}.md`
4. Reports what was converted and any failures

### Prerequisites
- [pandoc](https://pandoc.org/installing.html) — `brew install pandoc` or `choco install pandoc`

---

## .gitignore

Source binary files are gitignored by extension:

```gitignore
docs/input/*.docx
docs/input/*.xlsx
docs/input/*.pdf
# ... (images, pptx, etc.)
# docs/input/processed/*.md IS committed
```

---

## How Framework Agents Use These Files

When a brownfield playbook runs, it:

1. Checks for files in `docs/input/` using `list_directory`.
2. For each file found, loads the text content (with format-appropriate extraction for `.docx`, `.xlsx`, `.pdf`).
3. Summarizes what was found at the start of its output.
4. Incorporates the content as additional evidence when scoring AI readiness, building agent catalogs, or generating governance config.

---

*Part of the AIS Agentic Engineering Framework.*
