# Governance Documentation

This directory contains generated and authored governance documentation for the
AIS Agentic Engineering Framework.

## Contents

| File | Description |
|---|---|
| [`summary-grid.md`](./summary-grid.md) | Auto-generated governance activity grid — all agents × AIS steps |
| [`summary-grid.json`](./summary-grid.json) | Machine-readable version for the governance explorer website |
| [`reassessment-model.md`](./reassessment-model.md) | How review dates work and the reassessment workflow |

## Regenerating the Grid

```bash
node scripts/generate-governance-grid.mjs
# or
npm run governance-grid
```

To use a custom registry path:

```bash
node scripts/generate-governance-grid.mjs --registry path/to/governance-registry.yaml
```

## Source of Truth

The governance registry lives at:
**`framework/templates/governance-registry.yaml`**

Edit the registry there, then regenerate. Do not manually edit `summary-grid.md` or
`summary-grid.json` — they are overwritten on every run.

## Review Date Indicators

| Indicator | Meaning |
|---|---|
| ⚠️ | Entry is **overdue** for review |
| 🔔 | Entry is due for review **within 30 days** |
| _(none)_ | Entry review is current |

See [`reassessment-model.md`](./reassessment-model.md) for the full workflow.
