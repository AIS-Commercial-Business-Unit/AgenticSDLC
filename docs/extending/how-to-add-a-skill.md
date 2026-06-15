# How to Add a New Skill

This guide walks through the process of adding a new reusable skill to the AIS Agentic Engineering Framework's `Skills/` directory.

Skills are self-contained, reusable capabilities that agents can invoke. Each skill lives in its own directory and includes documentation, scripts, and examples.

---

## Prerequisites

- You have confirmed the skill doesn't duplicate an existing one in `Skills/`.
- The skill has a clear, single-purpose capability that is reusable across multiple agent workflows.
- You have identified which AIS Specify lifecycle step(s) the skill supports.

---

## Step 1: Create the Skill Directory

```
Skills/
  [skill-name]/
    SKILL.md          # Required: skill documentation
    scripts/          # Required: implementation scripts
    examples/         # Required: usage examples
    tests/            # Recommended: validation tests
```

Skill directory names must be:
- Lowercase kebab-case
- Descriptive of the capability (not a technology name)
- Unique within `Skills/`

---

## Step 2: Write SKILL.md

`SKILL.md` is the primary documentation for the skill. It is also loaded by agents when invoking the skill.

Required sections:

```markdown
# [Skill Name]

## Purpose

[1–2 sentences describing what this skill does.]

## AIS Specify Step(s)

[Which lifecycle steps this skill supports.]

## Inputs

| Input | Type | Required | Description |
|---|---|---|---|
| [input name] | [string/file/json] | ✅/Optional | [description] |

## Outputs

| Output | Type | Description |
|---|---|---|
| [output name] | [string/file/json] | [description] |

## Usage

### From a Copilot Agent Prompt

\```
Use the [skill-name] skill from Skills/[skill-name]/scripts/[main-script]
with the following inputs: [...]
\```

### From the Command Line

\```bash
[command to run the skill directly]
\```

## Implementation Notes

[Any technical notes about how the skill works, dependencies, or limitations.]

## Examples

See `examples/` for usage examples.

## Constraints

[What the skill must NOT do. Any hard limits on its behavior.]
```

---

## Step 3: Implement Scripts

Place all skill logic in `Skills/[skill-name]/scripts/`.

Script requirements:
- Scripts must be executable and documented with a header comment.
- Scripts must accept inputs via arguments or stdin (not hardcoded paths).
- Scripts must produce deterministic, idempotent outputs.
- Scripts must handle errors gracefully and report failures clearly.
- Scripts must not require elevated permissions unless documented.
- Scripts must not read files outside the repository root unless explicitly configured.

Supported script languages:
- Shell (`*.sh`) — portable, minimal dependencies
- Python (`*.py`) — when richer logic is needed
- Node.js (`*.js`, `*.ts`) — when JSON processing is central
- PowerShell (`*.ps1`) — for Windows environments

---

## Step 4: Create Examples

Place representative usage examples in `Skills/[skill-name]/examples/`.

Each example should:
- Include a `README.md` explaining what the example demonstrates.
- Include sample input files (if applicable).
- Include the expected output.
- Be runnable with a single command from the examples directory.

---

## Step 5: Add Tests

Place validation tests in `Skills/[skill-name]/tests/`.

Tests should verify:
- Happy-path: skill produces correct output for valid inputs.
- Edge cases: empty input, malformed input, missing files.
- Constraint enforcement: skill does not perform prohibited actions.

---

## Step 6: Update Skills/README.md

Add the new skill to the inventory table in `Skills/README.md`:

```markdown
| [skill-name] | [one-line description] | [AIS Specify step(s)] |
```

---

## Step 7: Reference from Agent Catalog (If Applicable)

If the skill is invoked by a specific agent, add it to the agent's `allowed_tools` in `config/agent-catalog.yaml`:

```yaml
allowed_tools:
  - "skills/[skill-name]"
```

---

## Checklist

- [ ] `Skills/[skill-name]/` directory created
- [ ] `Skills/[skill-name]/SKILL.md` written
- [ ] `Skills/[skill-name]/scripts/` populated
- [ ] `Skills/[skill-name]/examples/` populated
- [ ] `Skills/[skill-name]/tests/` populated (recommended)
- [ ] `Skills/README.md` updated
- [ ] Agent catalog updated if skill is agent-invoked
- [ ] Skill tested end-to-end

---

*Part of the AIS Agentic Engineering Framework — Extension Guides.*
