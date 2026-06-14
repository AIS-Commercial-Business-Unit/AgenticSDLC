/**
 * phase3-schemas.test.js
 *
 * Phase 3 schema existence, validity, and contract tests.
 * These tests are intentionally forward-looking: they will fail until
 * AIArchitect delivers the Phase 3 schema files. That is expected.
 * Green suite = Phase 3 schemas fully assembled and compliant.
 *
 * Phase 3 schemas:
 *   - metrics-event.schema.json      — individual agent activity event
 *   - metrics-report.schema.json     — aggregated metrics report
 *   - framework-adoption.schema.json — repo-level adoption measurement output
 */

import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dirname, '..')
const schemasDir = join(root, 'framework', 'schemas')
const DRAFT_2020_12 = 'https://json-schema.org/draft/2020-12/schema'

const PHASE3_SCHEMAS = [
  'metrics-event.schema.json',
  'metrics-report.schema.json',
  'framework-adoption.schema.json',
]

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

// ── 1. Schema existence ────────────────────────────────────────────────────

describe('Phase 3 schema existence', () => {
  for (const schemaFile of PHASE3_SCHEMAS) {
    it(`framework/schemas/${schemaFile} exists`, () => {
      const filePath = join(schemasDir, schemaFile)
      expect(
        existsSync(filePath),
        `Expected ${filePath} to exist — has AIArchitect delivered the Phase 3 schema files?`
      ).toBe(true)
    })
  }
})

// ── 2. Schema validity ─────────────────────────────────────────────────────

describe('Phase 3 schema validity', () => {
  for (const schemaFile of PHASE3_SCHEMAS) {
    it(`framework/schemas/${schemaFile} is valid JSON with correct $schema`, () => {
      const filePath = join(schemasDir, schemaFile)
      expect(existsSync(filePath), `${filePath} does not exist`).toBe(true)

      const schema = readJson(filePath)
      expect(schema, `${schemaFile} is not valid JSON`).not.toBeNull()
      expect(
        schema.$schema,
        `${schemaFile} must declare $schema = "${DRAFT_2020_12}"`
      ).toBe(DRAFT_2020_12)
    })

    it(`framework/schemas/${schemaFile} compiles with ajv 2020-12`, async () => {
      const filePath = join(schemasDir, schemaFile)
      expect(existsSync(filePath), `${filePath} does not exist`).toBe(true)

      const schema = readJson(filePath)
      expect(schema, `${schemaFile} is not valid JSON`).not.toBeNull()

      const ajv = await loadAjv()
      expect(
        () => ajv.compile(schema),
        `${schemaFile} failed ajv 2020-12 compilation`
      ).not.toThrow()
    })
  }
})

// ── 3. metrics-event.schema.json contract ─────────────────────────────────

describe('metrics-event.schema.json contract', () => {
  const schemaPath = join(schemasDir, 'metrics-event.schema.json')

  it('validates a minimal valid metrics event', async () => {
    expect(existsSync(schemaPath), `${schemaPath} does not exist`).toBe(true)

    const schema = readJson(schemaPath)
    expect(schema, 'metrics-event.schema.json is not valid JSON').not.toBeNull()

    const ajv = await loadAjv()
    const validate = ajv.compile(schema)

    const validEvent = {
      event_id: 'test-001',
      timestamp: '2026-06-14T15:00:00Z',
      agent: 'qa-tester',
      activity: 'write-tests',
      ais_step: 'Verify',
      autonomy_level: 'L2',
      outcome: 'success',
      repo: 'test/repo',
      evidence: [],
    }

    const result = validate(validEvent)
    expect(
      result,
      `Minimal valid metrics event failed schema validation:\n${ajv.errorsText(validate.errors)}`
    ).toBe(true)
  })

  it('rejects metrics event missing required event_id', async () => {
    expect(existsSync(schemaPath), `${schemaPath} does not exist`).toBe(true)

    const schema = readJson(schemaPath)
    expect(schema, 'metrics-event.schema.json is not valid JSON').not.toBeNull()

    const ajv = await loadAjv()
    const validate = ajv.compile(schema)

    const invalidEvent = {
      timestamp: '2026-06-14T15:00:00Z',
      agent: 'qa-tester',
      activity: 'write-tests',
      ais_step: 'Verify',
      autonomy_level: 'L2',
      outcome: 'success',
      repo: 'test/repo',
      // missing required 'event_id'
    }

    expect(
      validate(invalidEvent),
      'Metrics event missing event_id must fail validation'
    ).toBe(false)
  })
})

// ── 4. metrics-report.schema.json contract ────────────────────────────────

describe('metrics-report.schema.json contract', () => {
  const schemaPath = join(schemasDir, 'metrics-report.schema.json')

  it('validates a minimal valid metrics report', async () => {
    expect(existsSync(schemaPath), `${schemaPath} does not exist`).toBe(true)

    const schema = readJson(schemaPath)
    expect(schema, 'metrics-report.schema.json is not valid JSON').not.toBeNull()

    const ajv = await loadAjv()
    const validate = ajv.compile(schema)

    const validReport = {
      generated_at: '2026-06-14T15:00:00Z',
      repo: 'test/repo',
      period_start: '2026-06-01T00:00:00Z',
      period_end: '2026-06-14T15:00:00Z',
      events: [],
    }

    const result = validate(validReport)
    expect(
      result,
      `Minimal valid metrics report failed schema validation:\n${ajv.errorsText(validate.errors)}`
    ).toBe(true)
  })

  it('rejects metrics report missing required generated_at', async () => {
    expect(existsSync(schemaPath), `${schemaPath} does not exist`).toBe(true)

    const schema = readJson(schemaPath)
    expect(schema, 'metrics-report.schema.json is not valid JSON').not.toBeNull()

    const ajv = await loadAjv()
    const validate = ajv.compile(schema)

    const invalidReport = {
      repo: 'test/repo',
      events: [],
      // missing required 'generated_at'
    }

    expect(
      validate(invalidReport),
      'Metrics report missing generated_at must fail validation'
    ).toBe(false)
  })
})

// ── 5. framework-adoption.schema.json contract ────────────────────────────

describe('framework-adoption.schema.json contract', () => {
  const schemaPath = join(schemasDir, 'framework-adoption.schema.json')

  it('validates a minimal valid framework adoption document', async () => {
    expect(existsSync(schemaPath), `${schemaPath} does not exist`).toBe(true)

    const schema = readJson(schemaPath)
    expect(schema, 'framework-adoption.schema.json is not valid JSON').not.toBeNull()

    const ajv = await loadAjv()
    const validate = ajv.compile(schema)

    const validAdoption = {
      generated_at: '2026-06-14T15:00:00Z',
      repo: 'test/repo',
      overall_percentage: 45,
      categories: {},
    }

    const result = validate(validAdoption)
    expect(
      result,
      `Minimal valid framework adoption document failed schema validation:\n${ajv.errorsText(validate.errors)}`
    ).toBe(true)
  })

  it('rejects framework adoption document missing required overall_percentage', async () => {
    expect(existsSync(schemaPath), `${schemaPath} does not exist`).toBe(true)

    const schema = readJson(schemaPath)
    expect(schema, 'framework-adoption.schema.json is not valid JSON').not.toBeNull()

    const ajv = await loadAjv()
    const validate = ajv.compile(schema)

    const invalidAdoption = {
      generated_at: '2026-06-14T15:00:00Z',
      repo: 'test/repo',
      categories: {},
      // missing required 'overall_percentage'
    }

    expect(
      validate(invalidAdoption),
      'Framework adoption document missing overall_percentage must fail validation'
    ).toBe(false)
  })
})
