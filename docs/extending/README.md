# Extending the AIS Agentic Engineering Framework

This directory contains step-by-step guides for adding new components to the framework.

---

## Extension Guides

| Guide | Component Type | When to Use |
|---|---|---|
| [how-to-add-a-playbook.md](how-to-add-a-playbook.md) | Brownfield Playbook | Adding a new governed brownfield procedure |
| [how-to-add-an-agent.md](how-to-add-an-agent.md) | GitHub Copilot Agent | Adding a new `.github/agents/` agent definition |
| [how-to-add-a-skill.md](how-to-add-a-skill.md) | Skill | Adding a new `Skills/` reusable capability |
| [how-to-add-a-schema.md](how-to-add-a-schema.md) | JSON Schema | Adding a new schema to `framework/schemas/` |
| [how-to-add-a-governance-control.md](how-to-add-a-governance-control.md) | Governance Control | Adding an entry to `governance-registry.yaml` |
| [how-to-add-a-provider.md](how-to-add-a-provider.md) | Work Management Provider | Adding Jira, ADO, or a custom provider |
| [regenerating-multi-surface-outputs.md](regenerating-multi-surface-outputs.md) | Multi-Surface Generation | Regenerating `.github/agents/`, `.claude/`, `.cursor/` from source prompts |

---

## Quick Reference

### Where Do New Components Live?

| Component | Source of Truth | Generated/Derived Locations |
|---|---|---|
| Playbook prompts | `.specify/prompts/brownfield.*.md` | — (prompts are the source) |
| Agent definitions | `.specify/prompts/` (source) | `.github/agents/*.md` (generated) |
| Skills | `Skills/[name]/` | — |
| Schemas | `framework/schemas/*.json` | — |
| Governance controls | `config/governance-registry.yaml` | `docs/governance/` (generated docs) |
| Config | `config/aispec.config.yaml` | — |

### The Extension Workflow

Every extension follows the same pattern:
1. **Create the source artifact** (prompt, schema, config entry, skill directory).
2. **Validate the artifact** (schema validation, manual review).
3. **Update the relevant index** (README, catalog, registry).
4. **Document it** (companion guide in `docs/`).
5. **Test it** (run the prompt or validate the schema).

### Using the AI-Assisted Extension Prompt

For any extension type, you can ask the framework to guide you:

```
@workspace I want to add a new [agent/playbook/skill/schema/governance control/provider].
Run .specify/prompts/framework.extend.md
```

The framework will load the relevant extension guide and produce a personalized plan for your specific component.

---

*Part of the AIS Agentic Engineering Framework.*
