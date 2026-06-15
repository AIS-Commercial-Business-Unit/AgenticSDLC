/**
 * schema-validation.test.js
 *
 * Phase 1 schema existence, validity, and contract tests.
 * These tests are intentionally forward-looking: they will fail until
 * AIArchitect delivers the schema files and example config. That is expected.
 * Green suite = Phase 1 fully assembled.
 */

import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dirname, '..')
const schemasDir = join(root, 'framework', 'schemas')
const DRAFT_2020_12 = 'https://json-schema.org/draft/2020-12/schema'

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

describe('Schema existence', () => {
  const requiredSchemas = [
    'config.schema.json',
    'governance-registry.schema.json',
    'agent-catalog.schema.json',
  ]

  for (const schemaFile of requiredSchemas) {
    it(`framework/schemas/${schemaFile} exists`, () => {
      const filePath = join(schemasDir, schemaFile)
      expect(
        existsSync(filePath),
        `Expected ${filePath} to exist — has AIArchitect delivered the schema files?`
      ).toBe(true)
    })
  }
})

// ── 2. Schema validity ─────────────────────────────────────────────────────

describe('Schema validity', () => {
  const requiredSchemas = [
    'config.schema.json',
    'governance-registry.schema.json',
    'agent-catalog.schema.json',
  ]

  for (const schemaFile of requiredSchemas) {
    it(`framework/schemas/${schemaFile} is valid JSON with correct $schema`, () => {
      const filePath = join(schemasDir, schemaFile)
      expect(
        existsSync(filePath),
        `${filePath} does not exist — cannot validate`
      ).toBe(true)

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

// ── 3. Example config validation ───────────────────────────────────────────

describe('Example config validation', () => {
  const exampleConfigPath = join(root, 'config', 'aispec.config.example.yaml')
  const configSchemaPath = join(schemasDir, 'config.schema.json')

  it('config/aispec.config.example.yaml exists', () => {
    expect(
      existsSync(exampleConfigPath),
      `Expected ${exampleConfigPath} to exist — has AIArchitect delivered the example config?`
    ).toBe(true)
  })

  it('config/aispec.config.example.yaml is valid YAML', async () => {
    expect(
      existsSync(exampleConfigPath),
      `${exampleConfigPath} does not exist`
    ).toBe(true)

    const yaml = (await import('js-yaml')).default
    let parsed
    expect(
      () => { parsed = yaml.load(readFileSync(exampleConfigPath, 'utf8')) },
      'aispec.config.example.yaml must be valid YAML'
    ).not.toThrow()
    expect(parsed, 'aispec.config.example.yaml must not be empty').not.toBeNull()
  })

  it('config/aispec.config.example.yaml validates against config.schema.json', async () => {
    expect(existsSync(configSchemaPath), `${configSchemaPath} does not exist`).toBe(true)
    expect(existsSync(exampleConfigPath), `${exampleConfigPath} does not exist`).toBe(true)

    const yaml = (await import('js-yaml')).default
    const schema = readJson(configSchemaPath)
    expect(schema, 'config.schema.json is not valid JSON').not.toBeNull()

    const exampleDoc = yaml.load(readFileSync(exampleConfigPath, 'utf8'))
    expect(exampleDoc, 'aispec.config.example.yaml is empty').not.toBeNull()

    const ajv = await loadAjv()
    const validate = ajv.compile(schema)
    const valid = validate(exampleDoc)
    expect(
      valid,
      `aispec.config.example.yaml failed schema validation:\n${ajv.errorsText(validate.errors)}`
    ).toBe(true)
  })
})

// ── 4. Governance registry schema structure ────────────────────────────────

describe('Governance registry schema structure', () => {
  const govSchemaPath = join(schemasDir, 'governance-registry.schema.json')

  it('governance-registry.schema.json exists', () => {
    expect(
      existsSync(govSchemaPath),
      `${govSchemaPath} does not exist`
    ).toBe(true)
  })

  it('governance-registry.schema.json defines required governance fields in properties', () => {
    expect(existsSync(govSchemaPath), `${govSchemaPath} does not exist`).toBe(true)

    const schema = readJson(govSchemaPath)
    expect(schema, 'governance-registry.schema.json is not valid JSON').not.toBeNull()

    // The schema must define properties (directly or via $defs / items) that include
    // the five governance fields: agent, step, activity, max_autonomy, risk_level.
    const schemaStr = JSON.stringify(schema)
    const requiredFields = ['agent', 'step', 'activity', 'max_autonomy', 'risk_level']

    for (const field of requiredFields) {
      expect(
        schemaStr,
        `governance-registry.schema.json must define a property named "${field}"`
      ).toContain(`"${field}"`)
    }
  })
})
