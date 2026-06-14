# framework/skills/

This directory contains the **reusable skill definitions** for the AIS Agentic Engineering
Framework. Skills are lightweight, single-purpose tools that agents invoke to accomplish
discrete tasks. They differ from agents in scope and ownership.

## Skills vs Agents

| Dimension | Skill | Agent |
|---|---|---|
| **Scope** | Single, focused capability | End-to-end workflow participant |
| **Identity** | Stateless function | Stateful, governed actor |
| **Governance** | Inherited from calling agent | Own governance registry entries |
| **Autonomy level** | Set by calling agent | Own autonomy level |
| **Example** | `schema-validator`, `audit-logger` | `backend-developer-agent` |

A skill is analogous to a library function. An agent is analogous to a team member.
Agents invoke skills; skills do not invoke agents.

## How to Use a Skill

Skill definitions specify their `inputs` and `outputs`. In a workflow or agent prompt,
invoke a skill by name with the required inputs:

```yaml
skill: schema-validator
inputs:
  document_path: framework/templates/governance-registry.yaml
  schema_path: framework/schemas/governance-registry.schema.json
  format: yaml
```

The runtime resolves the skill definition, executes it, and returns the declared outputs.

## Standard Skills (9)

| File | Display Name | Purpose | Primary Users |
|---|---|---|---|
| `repo-scanner.yaml` | Repository Scanner | Scan repo structure → structured metadata | brownfield-assessor, modernization |
| `schema-validator.yaml` | Schema Validator | Validate YAML/JSON against JSON Schema | specification, scribe-governance |
| `governance-checker.yaml` | Governance Checker | Check activity against governance registry | code-reviewer, workflow-coordinator |
| `audit-logger.yaml` | Audit Logger | Write structured audit event to audit/events/ | scribe-governance (all steps) |
| `gap-analyzer.yaml` | Gap Analyzer | Compare current state vs readiness baseline | brownfield-assessor, modernization |
| `metrics-collector.yaml` | Metrics Collector | Aggregate audit events into metrics report | finops, experiment-runner |
| `report-generator.yaml` | Report Generator | Render structured data → markdown report | finops, modernization, experiment-runner |
| `config-builder.yaml` | Config Builder | Build aispec.config.yaml from questionnaire | workflow-coordinator, specification |
| `work-item-creator.yaml` | Work Item Creator | Create issue/task in configured provider | planning, workflow-coordinator |

## Skill Definition Schema

Each skill YAML file contains:

```yaml
name: skill-name                # kebab-case, unique
display_name: Human Name        # for UI display
description: >                  # what it does
  ...
version: "1.0.0"                # semver
inputs:                         # array of input definitions
  - name: input_name
    type: string|integer|boolean|array|object
    required: true|false
    default: ...                # optional default
    description: ...
outputs:                        # array of output definitions
  - name: output_name
    type: ...
    description: ...
example_usage: |                # YAML code block showing invocation
  skill: skill-name
  inputs: ...
```

## Adding a New Skill

1. Create `framework/skills/{skill-name}.yaml` following the schema above.
2. Document the skill in the table in this README.
3. Reference the skill in the `allowed_tools` field of any agent that will use it.
4. Open a PR to `dev` — the code-reviewer-agent will validate the definition format.
