# Skills

This directory contains **reusable skills** for the AIS Agentic Engineering Framework. Skills are self-contained, invokable capabilities that agents and prompts can reference when performing governed activities.

---

## Purpose

Skills provide bounded, reusable functionality that:
- Can be invoked from multiple agent prompts without duplication.
- Have a defined input/output contract documented in `SKILL.md`.
- Are testable in isolation.
- Map to one or more AIS Specify lifecycle steps.

Skills are **not pre-sales or client-specific tools.** The AIS branding, proposal, and pre-sales skills have been removed from this repository. This directory now contains only framework-relevant capabilities.

---

## Structure

Each skill follows this structure:

```
Skills/
  [skill-name]/
    SKILL.md       # Required: documents the skill's purpose, inputs, outputs, and usage
    scripts/       # Required: implementation scripts
    examples/      # Required: usage examples with expected outputs
    tests/         # Recommended: validation tests
```

---

## Available Skills

| Skill | Purpose | AIS Specify Step(s) |
|---|---|---|
| *(No framework skills defined yet — add skills as the framework evolves)* | | |

Skills are added incrementally as the framework matures. See the extension guide for how to add one.

---

## Adding a New Skill

See [`docs/extending/how-to-add-a-skill.md`](../docs/extending/how-to-add-a-skill.md) for the complete process.

In summary:
1. Create `Skills/[name]/` with the required structure above.
2. Write `SKILL.md` with purpose, inputs, outputs, and usage examples.
3. Implement scripts in `Skills/[name]/scripts/`.
4. Add usage examples to `Skills/[name]/examples/`.
5. Update this README with the new entry.
6. If the skill is agent-invoked, update `config/agent-catalog.yaml`.

---

## Framework-Compatible Skill Requirements

To be included in this directory, a skill must:

- ✅ Have a `SKILL.md` that clearly documents its purpose, inputs, and outputs.
- ✅ Accept inputs via arguments or stdin — never hardcoded paths or values.
- ✅ Produce deterministic, idempotent outputs.
- ✅ Not require elevated permissions unless explicitly documented.
- ✅ Not read files outside the repository root unless configured.
- ✅ Map to at least one AIS Specify lifecycle step.
- ❌ Must NOT embed client-specific logic, branding, or pre-sales workflows.
- ❌ Must NOT contain secrets, credentials, or hardcoded environment values.

---

*Part of the AIS Agentic Engineering Framework.*
