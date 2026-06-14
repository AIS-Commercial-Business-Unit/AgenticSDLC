/**
 * metrics.test.js
 *
 * Phase 3 metrics infrastructure tests.
 * Covers:
 *   1. metrics-event fixture validates against metrics-event.schema.json
 *   2. generate-governance-grid.mjs produces valid output (or docs/governance/summary-grid.json exists)
 *   3. summary-grid.json structure — entries array, each with agent, activity,
 *      autonomy_level, and risk_level fields
 *
 * Tests are forward-looking: they will fail until AIArchitect delivers
 * metrics-event.schema.json and runs generate-governance-grid.mjs.
 * That is expected — infrastructure ready, assets pending delivery.
 */

import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dirname, '..')
const schemasDir = join(root, 'framework', 'schemas')
const fixturesDir = join(root, 'tests', 'fixtures')
const summaryGridPath = join(root, 'docs', 'governance', 'summary-grid.json')

// ── helpers ────────────────────────────────────────────────────────────────

function readJson(filePath) {
  if (!existsSync(filePath)) return null
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'))
  } catch {
    return null
  }
}

async function loadAjv() {
  const Ajv = (await import('ajv/dist/2020.js')).default
  const addFormats = (await import('ajv-formats')).default
  const ajv = new Ajv({ strict: false, allErrors: true })
  addFormats(ajv)
  return ajv
}

// ── Lazy import — fails gracefully until generate-governance-grid.mjs is delivered ──

let generateGovernanceGrid = null
let importError = null

try {
  const mod = await import('../scripts/generate-governance-grid.mjs')
  generateGovernanceGrid = mod.generateGovernanceGrid ?? mod.default
} catch (e) {
  importError = e
}

function requireGridGenerator() {
  if (!generateGovernanceGrid) {
    throw new Error(
      `generate-governance-grid.mjs not yet delivered, or does not export generateGovernanceGrid.\n` +
        `Import error: ${importError?.message ?? 'module not found'}\n` +
        `Expected: scripts/generate-governance-grid.mjs exporting a function or default export`
    )
  }
}

// ── 1. Fixture file existence ──────────────────────────────────────────────

describe('Metrics fixtures', () => {
  it('tests/fixtures/sample-metrics-event.json exists', () => {
    const fixturePath = join(fixturesDir, 'sample-metrics-event.json')
    expect(
      existsSync(fixturePath),
      `Expected ${fixturePath} to exist`
    ).toBe(true)
  })

  it('tests/fixtures/sample-metrics-event.json is valid JSON', () => {
    const fixturePath = join(fixturesDir, 'sample-metrics-event.json')
    expect(existsSync(fixturePath), `${fixturePath} does not exist`).toBe(true)

    const parsed = readJson(fixturePath)
    expect(parsed, 'sample-metrics-event.json is not valid JSON').not.toBeNull()
    expect(typeof parsed).toBe('object')
  })
})

// ── 2. Fixture validates against metrics-event.schema.json ────────────────

describe('Metrics event fixture — schema validation', () => {
  const schemaPath = join(schemasDir, 'metrics-event.schema.json')
  const fixturePath = join(fixturesDir, 'sample-metrics-event.json')

  it('metrics-event.schema.json exists', () => {
    expect(
      existsSync(schemaPath),
      `Expected ${schemaPath} to exist — has AIArchitect delivered the Phase 3 schema files?`
    ).toBe(true)
  })

  it('sample-metrics-event.json validates against metrics-event.schema.json', async () => {
    expect(existsSync(schemaPath), `${schemaPath} does not exist`).toBe(true)
    expect(existsSync(fixturePath), `${fixturePath} does not exist`).toBe(true)

    const schema = readJson(schemaPath)
    expect(schema, 'metrics-event.schema.json is not valid JSON').not.toBeNull()

    const fixture = readJson(fixturePath)
    expect(fixture, 'sample-metrics-event.json is not valid JSON').not.toBeNull()

    const ajv = await loadAjv()
    const validate = ajv.compile(schema)
    const result = validate(fixture)
    expect(
      result,
      `sample-metrics-event.json failed schema validation:\n${ajv.errorsText(validate.errors)}`
    ).toBe(true)
  })
})

// ── 3. generate-governance-grid produces JSON output ─────────────────────

describe('generate-governance-grid — output', () => {
  it('generate-governance-grid.mjs is importable', () => {
    // If the script is delivered but summary-grid.json does not exist yet,
    // this test verifies the module loads without error.
    if (importError) {
      throw new Error(
        `generate-governance-grid.mjs not yet delivered.\n` +
          `Import error: ${importError.message}\n` +
          `Expected: scripts/generate-governance-grid.mjs to exist`
      )
    }
    expect(generateGovernanceGrid).toBeDefined()
  })

  it('docs/governance/summary-grid.json exists after grid generation', () => {
    // This test verifies the output artifact is present.
    // It passes once AIArchitect runs generate-governance-grid.mjs.
    // If it doesn't exist yet, the test fails with a descriptive message.
    expect(
      existsSync(summaryGridPath),
      `Expected ${summaryGridPath} to exist. ` +
        `Run 'node scripts/generate-governance-grid.mjs' to generate it, ` +
        `or check that AIArchitect has run the grid generation step.`
    ).toBe(true)
  })
})

// ── 4. summary-grid.json structure ────────────────────────────────────────

describe('docs/governance/summary-grid.json structure', () => {
  it('summary-grid.json is valid JSON', () => {
    expect(
      existsSync(summaryGridPath),
      `${summaryGridPath} does not exist — run generate-governance-grid.mjs first`
    ).toBe(true)

    const parsed = readJson(summaryGridPath)
    expect(parsed, 'summary-grid.json is not valid JSON').not.toBeNull()
  })

  it('summary-grid.json has an entries array', () => {
    expect(
      existsSync(summaryGridPath),
      `${summaryGridPath} does not exist`
    ).toBe(true)

    const parsed = readJson(summaryGridPath)
    expect(parsed, 'summary-grid.json is not valid JSON').not.toBeNull()
    expect(
      Array.isArray(parsed.entries),
      `summary-grid.json must have an 'entries' array, got: ${typeof parsed.entries}`
    ).toBe(true)
  })

  it('summary-grid.json entries array is non-empty', () => {
    expect(existsSync(summaryGridPath), `${summaryGridPath} does not exist`).toBe(true)

    const parsed = readJson(summaryGridPath)
    expect(parsed, 'summary-grid.json is not valid JSON').not.toBeNull()
    expect(Array.isArray(parsed.entries), 'entries must be an array').toBe(true)
    expect(
      parsed.entries.length,
      'summary-grid.json entries array must not be empty'
    ).toBeGreaterThan(0)
  })

  it('each entry in summary-grid.json has required fields: agent, activity, autonomy_level, risk_level', () => {
    expect(existsSync(summaryGridPath), `${summaryGridPath} does not exist`).toBe(true)

    const parsed = readJson(summaryGridPath)
    expect(parsed, 'summary-grid.json is not valid JSON').not.toBeNull()
    expect(Array.isArray(parsed.entries), 'entries must be an array').toBe(true)

    const requiredFields = ['agent', 'activity', 'autonomy_level', 'risk_level']
    for (const [index, entry] of parsed.entries.entries()) {
      for (const field of requiredFields) {
        expect(
          entry[field],
          `entries[${index}] is missing required field '${field}'`
        ).toBeDefined()
      }
    }
  })
})
