# Tests — Agentic Engineering Framework

## Overview

This directory contains the Phase 1 test suite for the Agentic Engineering Framework. Tests are written with **vitest** and cover JSON Schema validity and YAML config contract compliance. No Docker or running services are required.

---

## What Exists

### `schema-validation.test.js`

| Suite | What it covers |
|---|---|
| **Schema existence** | Verifies `framework/schemas/config.schema.json`, `governance-registry.schema.json`, and `agent-catalog.schema.json` are present on disk |
| **Schema validity** | Each schema file parses as valid JSON, declares `$schema: "https://json-schema.org/draft/2020-12/schema"`, and compiles cleanly with `ajv` 2020-12 |
| **Example config validation** | `config/aispec.config.example.yaml` exists, parses as valid YAML, and validates against `config.schema.json` |
| **Governance registry schema structure** | `governance-registry.schema.json` includes all five required governance fields in its property definitions: `agent`, `step`, `activity`, `max_autonomy`, `risk_level` |

---

## Running Tests

### Run the full test suite (one-shot)

```bash
npm test
```

### Run in watch mode (re-runs on file change)

```bash
npm run test:watch
```

### Run schema validation script only

```bash
npm run validate-schemas
```

This script independently:
1. Reads every `.json` file in `framework/schemas/`
2. Confirms each is a valid JSON Schema 2020-12 document
3. Validates `config/aispec.config.example.yaml` against `config.schema.json`
4. Exits with code `1` if any check fails — safe to use in CI pipelines

---

## First-Time Setup

```bash
npm install
npm test
```

Node.js 18+ is required (`type: "module"` in `package.json`).

---

## Phase 1 — Passing Criteria

A Phase 1 test run is considered **green** when all of the following are true:

1. `npm test` exits with code `0`
2. All 12 vitest tests pass (existence × 3, validity × 6, example config × 3, governance structure × 2)
3. `npm run validate-schemas` exits with code `0` and reports `Failed: 0`
4. No `SKIP` or `TODO` items remain in test output

> **Note:** Tests intentionally fail until AIArchitect delivers the schema files and example config. Failing tests at that point are expected and not a QA defect — the infrastructure is ready, waiting for schema authors.

---

## Test Evidence Requirements

Per QA charter: *test evidence is not optional*. A passing run must include:

- Full vitest `--reporter=verbose` output (captured in CI artifact or pasted in PR comment)
- `npm run validate-schemas` console output showing `✅` lines and `Failed: 0`
- Node.js version used (`node --version`)
- Timestamp of the run

---

---

## Phase 2 — Brownfield Discovery Tests

Phase 2 adds brownfield repository discovery: a scanner that assesses an existing repo, a questionnaire-driven initializer, and a gap report generator.

### New Test Files

#### `phase2-schemas.test.js`

| Suite | What it covers |
|---|---|
| **Phase 2 schema existence** | Verifies all 4 Phase 2 schema files exist in `framework/schemas/` |
| **Phase 2 schema validity** | Each schema is valid JSON, declares the correct `$schema` URI, and compiles with ajv 2020-12 |
| **readiness-assessment.schema.json contract** | Minimal valid assessment (with `overall_score`, `maturity_tier`, `generated_at`, `target_repo`, and a `high`-severity gap) passes; object missing `overall_score` fails |
| **gap-report.schema.json contract** | Minimal valid report (with `generated_at`, `target_repo`, `overall_score`, `maturity_tier`) passes; object missing `generated_at` fails |
| **questionnaire.schema.json contract** | Minimal valid questionnaire (with `version` and one `questions` entry) passes; object missing `questions` fails |
| **initialization-state.schema.json contract** | Minimal valid state `{ phase: "assessing" }` passes; object missing `phase` fails |

#### `scanner.test.js`

| Suite | What it covers |
|---|---|
| **Empty directory** | `scanRepository()` returns an object; `overall_score` ≤ 10; `maturity_tier` is `"Foundation"` |
| **brownfield-sample** | Returns all required fields (`overall_score`, `maturity_tier`, `dimensions`, `discovered_facts`, `gaps`, `work_management`); score is 0–100; has ≥ 1 gap |
| **CONTRIBUTING.md** | `documentation` dimension score > 0 when a `CONTRIBUTING.md` file is present |
| **.github/agents/** | `agent_management` dimension score > 0 when `.github/agents/test.agent.md` is present |

Temp directories are created per suite in `os.tmpdir()` and cleaned up in `afterAll`.

#### `gap-report.test.js`

| Suite | What it covers |
|---|---|
| **Output structure** | Output is a non-empty string starting with `# `; contains `overall_score`, `target_repo`, and `maturity_tier` values |
| **Gap section** | Output matches `/gap\|critical\|improvement/i`; at least one high-severity gap title from the assessment appears |
| **Zero gaps** | An assessment with `gaps: []` produces output matching `/no critical gaps\|no gaps\|all clear\|✅/i`; still starts with `# ` |

Uses `tests/fixtures/sample-assessment.json` as the primary test fixture.

### Fixture File

**`tests/fixtures/sample-assessment.json`** — A realistic readiness assessment representing the expected scanner output for `samples/brownfield-sample/`:
- `overall_score`: 22 (low — expected for a bare brownfield sample)
- `maturity_tier`: `"Foundation"`
- 5 gaps: no governance config, no PR template, no agents, no ADRs, no CI/CD pipeline
- `work_management.recommendation`: `"github-issues"`
- 2 MCP opportunities
- 9 discovered facts

---

## Running Phase 2 Tests

### Run all Phase 2 tests

```bash
npx vitest run tests/phase2-schemas.test.js tests/scanner.test.js tests/gap-report.test.js
```

### Run a specific Phase 2 suite

```bash
# Schema contract tests only
npx vitest run tests/phase2-schemas.test.js

# Scanner unit tests only
npx vitest run tests/scanner.test.js

# Gap report generation tests only
npx vitest run tests/gap-report.test.js
```

### Run the full suite (Phase 1 + Phase 2)

```bash
npm test
```

---

## Phase 2 — Known Limitations

| Limitation | Reason |
|---|---|
| `initialize.mjs` interactive tests are **not automated** | `initialize.mjs` uses `readline` for interactive prompts and cannot be driven programmatically without a full TTY mock. Manual verification is required for the initialization wizard flow. |
| Scanner tests fail until `scan-repository.mjs` is delivered | `scanner.test.js` uses a lazy dynamic import and throws a descriptive error rather than crashing the whole suite. Tests show `FAIL` with "not yet delivered" message. |
| Gap report tests fail until `generate-gap-report.mjs` is delivered | Same lazy import pattern — fails cleanly with a descriptive error. |
| Phase 2 schema tests fail until schemas are delivered | Same forward-looking pattern as Phase 1 — the test infrastructure is ready, the schema files are pending Integration delivery. |
| `brownfield-sample` scanner tests fail until sample is delivered | The `samples/brownfield-sample/` directory is created as part of Phase 2. Tests check for existence and emit a helpful message if absent. |

---

## Phase 2 — Acceptance Criteria and Test Evidence

A Phase 2 test run is considered **green** when all of the following are true:

1. `npm test` exits with code `0`
2. All Phase 2 vitest tests pass (24 additional tests across 3 files)
3. `samples/brownfield-sample/` exists and the scanner returns `overall_score` between 0 and 40 for it
4. `generateGapReport` produces valid Markdown with a `# ` heading for the sample assessment fixture
5. No `SKIP` or `TODO` items remain in test output

Per QA charter — test evidence must include:

- Full `npx vitest run --reporter=verbose` output for all Phase 2 test files
- Node.js version (`node --version`)
- Timestamp of the run
- `overall_score` and `maturity_tier` values from the brownfield-sample scan result (pasted in PR comment)

---

---

## Phase 3 — Agent Catalog, Metrics, and Governance

Phase 3 adds agent and skill catalog validation, framework adoption measurement, and metrics infrastructure tests.

### New Test Files

#### `phase3-schemas.test.js`

| Suite | What it covers |
|---|---|
| **Phase 3 schema existence** | Verifies all 3 Phase 3 schema files exist in `framework/schemas/` |
| **Phase 3 schema validity** | Each schema is valid JSON, declares the correct `$schema` URI, and compiles with ajv 2020-12 |
| **metrics-event.schema.json contract** | Minimal valid event (event_id, timestamp, agent, activity, ais_step, autonomy_level, outcome, repo, evidence) passes; event missing `event_id` fails |
| **metrics-report.schema.json contract** | Minimal valid report (generated_at, repo, period_start, period_end, events) passes; report missing `generated_at` fails |
| **framework-adoption.schema.json contract** | Minimal valid adoption doc (generated_at, repo, overall_percentage, categories) passes; doc missing `overall_percentage` fails |

#### `phase3-agents.test.js`

| Suite | What it covers |
|---|---|
| **Agent catalog — directory and count** | `framework/agents/` exists and contains at least 16 YAML files |
| **Agent catalog — each file is valid YAML** | Every YAML in `framework/agents/` parses without error via js-yaml |
| **Agent catalog — required fields** | Each agent file has: `role`, `description`, `autonomy_level`, `capabilities`, `outputs`; `name` is required (may be derived from filename) |
| **Agent catalog — autonomy_level values** | Every agent's `autonomy_level` is one of: `L0`, `L1`, `L2`, `L3` |
| **Skill catalog — directory and count** | `framework/skills/` exists and contains at least 9 YAML files |
| **Skill catalog — required fields** | Each skill file has: `name`, `description`, `inputs`, `outputs` |

#### `adoption.test.js`

| Suite | What it covers |
|---|---|
| **Framework repo adoption** | `checkAdoption(process.cwd())` returns an object; `overall_percentage` is 0–100; `categories` has all 8 expected keys (`config`, `agents`, `skills`, `governance`, `docs`, `tests`, `ci`, `playbooks`); each category has `total`, `adopted`, and `percentage` fields |
| **Brownfield-sample adoption** | `checkAdoption('samples/brownfield-sample')` returns a lower `overall_percentage` than the framework repo |
| **Empty directory adoption** | `checkAdoption(emptyTempDir)` returns `overall_percentage` of 0 |

#### `metrics.test.js`

| Suite | What it covers |
|---|---|
| **Metrics fixtures** | `tests/fixtures/sample-metrics-event.json` exists and is valid JSON |
| **Fixture schema validation** | `sample-metrics-event.json` validates against `metrics-event.schema.json` |
| **generate-governance-grid — output** | `generate-governance-grid.mjs` is importable; `docs/governance/summary-grid.json` exists after grid generation |
| **summary-grid.json structure** | File is valid JSON; has an `entries` array; array is non-empty; each entry has `agent`, `activity`, `autonomy_level`, `risk_level` fields |

### Fixture Files

**`tests/fixtures/sample-metrics-event.json`** — A valid metrics event representing QA activity during Phase 3 test scaffolding:
- `event_id`: `fixture-001`
- `agent`: `qa-tester`, `activity`: `write-tests`, `ais_step`: `Verify`
- `autonomy_level`: `L2`, `outcome`: `success`
- `evidence`: array listing the 4 test files created

---

## Running Phase 3 Tests

### Run all Phase 3 tests

```bash
npx vitest run tests/phase3-schemas.test.js tests/phase3-agents.test.js tests/adoption.test.js tests/metrics.test.js
```

### Run a specific Phase 3 suite

```bash
# Schema contract tests
npx vitest run tests/phase3-schemas.test.js

# Agent/skill catalog tests
npx vitest run tests/phase3-agents.test.js

# Adoption script tests
npx vitest run tests/adoption.test.js

# Metrics infrastructure tests
npx vitest run tests/metrics.test.js
```

### Run the full suite (all phases)

```bash
npm test
```

---

## Phase 3 — Known Limitations

| Limitation | Reason |
|---|---|
| Phase 3 schema tests fail until schemas are delivered | `metrics-event.schema.json`, `metrics-report.schema.json`, and `framework-adoption.schema.json` must be authored by AIArchitect. Forward-looking pattern — not a QA defect. |
| Agent/skill catalog tests fail until YAML files are delivered | `framework/agents/` and `framework/skills/` do not exist until AIArchitect delivers the catalog. Tests check for directory existence and emit helpful messages if absent. |
| `adoption.test.js` fails until `check-adoption.mjs` is delivered | Uses the same lazy dynamic import + `requireCheckAdoption()` guard pattern as Phase 2 scanner tests. Fails cleanly with a descriptive error per test. |
| `metrics.test.js` grid tests fail until `generate-governance-grid.mjs` is run | `docs/governance/summary-grid.json` must be generated as a one-time step. Tests verify the file's structure once it exists. |

---

## Phase 3 — Acceptance Criteria and Test Evidence

A Phase 3 test run is considered **green** when all of the following are true:

1. `npm test` exits with code `0`
2. All Phase 3 vitest tests pass across all 4 new test files
3. `framework/agents/` has ≥ 16 YAML files; all parse and have required fields
4. `framework/skills/` has ≥ 9 YAML files; all parse and have required fields
5. `checkAdoption(process.cwd())` returns `overall_percentage` > 0 for the framework repo
6. `docs/governance/summary-grid.json` exists and has a non-empty `entries` array
7. `tests/fixtures/sample-metrics-event.json` validates against `metrics-event.schema.json`

Per QA charter — test evidence must include:

- Full `npx vitest run --reporter=verbose` output for all Phase 3 test files
- Node.js version (`node --version`)
- Timestamp of the run
- `overall_percentage` from `checkAdoption(process.cwd())` and `checkAdoption('samples/brownfield-sample')` (pasted in PR comment)

---

## Future Phases

| Phase | Planned tests |
|---|---|
| **Phase 4** | Agent behavior tests — stub agents exercise the governance guardrails; assertions verify autonomy caps are enforced |
| **Phase 5** | Integration tests — end-to-end agent pipeline with mock LLM responses; log output verified for structured event fields |

Integration tests (Phase 5) will require a running environment and will be gated behind a separate `npm run test:integration` script so they never block local `npm test`.
