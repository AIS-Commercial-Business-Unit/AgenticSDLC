/**
 * validate-schemas.mjs
 *
 * Validates all JSON Schema 2020-12 documents in framework/schemas/ and
 * validates config/aispec.config.example.yaml against config.schema.json.
 *
 * Exit codes:
 *   0 — all validations passed
 *   1 — one or more validations failed
 */

import { readFileSync, readdirSync, existsSync } from 'fs'
import { resolve, join, basename } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dirname, '..')

// Dynamically import ESM-compatible packages
const Ajv = (await import('ajv/dist/2020.js')).default
const addFormats = (await import('ajv-formats')).default
const yaml = (await import('js-yaml')).default

const ajv = new Ajv({ strict: false, allErrors: true })
addFormats(ajv)

let passed = 0
let failed = 0

function pass(msg) {
  console.log(`  ✅  ${msg}`)
  passed++
}

function fail(msg, detail) {
  console.error(`  ❌  ${msg}`)
  if (detail) console.error(`       ${detail}`)
  failed++
}

// ── 1. Validate all schemas in framework/schemas/ ──────────────────────────

const schemasDir = join(root, 'framework', 'schemas')
console.log('\n── Schema file validation ──────────────────────────────────────')

if (!existsSync(schemasDir)) {
  fail('framework/schemas/ directory does not exist')
} else {
  const files = readdirSync(schemasDir).filter(f => f.endsWith('.json'))

  if (files.length === 0) {
    fail('No JSON schema files found in framework/schemas/')
  }

  for (const file of files) {
    const filePath = join(schemasDir, file)
    let schema

    try {
      schema = JSON.parse(readFileSync(filePath, 'utf8'))
    } catch (err) {
      fail(`${file} — invalid JSON`, err.message)
      continue
    }

    const expectedDraft = 'https://json-schema.org/draft/2020-12/schema'
    if (schema.$schema !== expectedDraft) {
      fail(
        `${file} — $schema must be "${expectedDraft}"`,
        `Found: ${schema.$schema ?? '(missing)'}`
      )
      continue
    }

    try {
      ajv.compile(schema)
      pass(`${file} — valid JSON Schema 2020-12`)
    } catch (err) {
      fail(`${file} — schema compilation failed`, err.message)
    }
  }
}

// ── 2. Validate example config against config.schema.json ─────────────────

console.log('\n── Example config validation ───────────────────────────────────')

const configSchemaPath = join(schemasDir, 'config.schema.json')
const exampleConfigPath = join(root, 'config', 'aispec.config.example.yaml')

if (!existsSync(configSchemaPath)) {
  fail('framework/schemas/config.schema.json does not exist — skipping config validation')
} else if (!existsSync(exampleConfigPath)) {
  fail('config/aispec.config.example.yaml does not exist — skipping config validation')
} else {
  let schema, exampleDoc

  try {
    schema = JSON.parse(readFileSync(configSchemaPath, 'utf8'))
  } catch (err) {
    fail('config.schema.json — invalid JSON', err.message)
    schema = null
  }

  try {
    exampleDoc = yaml.load(readFileSync(exampleConfigPath, 'utf8'))
  } catch (err) {
    fail('aispec.config.example.yaml — invalid YAML', err.message)
    exampleDoc = null
  }

  if (schema && exampleDoc !== null && exampleDoc !== undefined) {
    try {
      // Schema was already compiled in step 1 — reuse rather than re-add
      const validate = ajv.getSchema(schema.$id) ?? ajv.compile(schema)
      const valid = validate(exampleDoc)
      if (valid) {
        pass('aispec.config.example.yaml validates against config.schema.json')
      } else {
        fail(
          'aispec.config.example.yaml failed schema validation',
          ajv.errorsText(validate.errors)
        )
      }
    } catch (err) {
      fail('Could not compile config.schema.json for validation', err.message)
    }
  }
}

// ── Summary ────────────────────────────────────────────────────────────────

console.log('\n────────────────────────────────────────────────────────────────')
console.log(`  Passed: ${passed}   Failed: ${failed}`)
console.log('────────────────────────────────────────────────────────────────\n')

if (failed > 0) {
  process.exit(1)
}
