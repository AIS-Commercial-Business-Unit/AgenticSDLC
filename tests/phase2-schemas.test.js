/**
 * phase2-schemas.test.js
 *
 * Phase 2 schema existence, validity, and contract tests.
 * These tests are intentionally forward-looking: they will fail until
 * Integration delivers the Phase 2 schema files. That is expected.
 * Green suite = Phase 2 schemas fully assembled and compliant.
 *
 * Phase 2 schemas:
 *   - readiness-assessment.schema.json  — scanner output structure
 *   - gap-report.schema.json            — structured gap report document
 *   - questionnaire.schema.json         — brownfield discovery questionnaire
 *   - initialization-state.schema.json  — tracks initialize.mjs progress
 */

import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dirname, '..')
const schemasDir = join(root, 'framework', 'schemas')
const DRAFT_2020_12 = 'https://json-schema.org/draft/2020-12/schema'

const PHASE2_SCHEMAS = [
  'readiness-assessment.schema.json',
  'gap-report.schema.json',
  'questionnaire.schema.json',
  'initialization-state.schema.json',
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

describe('Phase 2 schema existence', () => {
  for (const schemaFile of PHASE2_SCHEMAS) {
    it(`framework/schemas/${schemaFile} exists`, () => {
      const filePath = join(schemasDir, schemaFile)
      expect(
        existsSync(filePath),
        `Expected ${filePath} to exist — has Integration delivered the Phase 2 schema files?`
      ).toBe(true)
    })
  }
})

// ── 2. Schema validity ─────────────────────────────────────────────────────

describe('Phase 2 schema validity', () => {
  for (const schemaFile of PHASE2_SCHEMAS) {
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

// ── 3. readiness-assessment.schema.json contract ──────────────────────────

describe('readiness-assessment.schema.json contract', () => {
  const schemaPath = join(schemasDir, 'readiness-assessment.schema.json')

  it('validates a minimal valid readiness assessment', async () => {
    expect(existsSync(schemaPath), `${schemaPath} does not exist`).toBe(true)

    const schema = readJson(schemaPath)
    expect(schema, 'readiness-assessment.schema.json is not valid JSON').not.toBeNull()

    const ajv = await loadAjv()
    const validate = ajv.compile(schema)

    const validAssessment = {
      $schema: 'https://ais.com/agentic-sdlc/framework/schemas/readiness-assessment.schema.json',
      version: '1.0.0',
      overall_score: 45,
      maturity_tier: 'Developing',
      generated_at: '2026-06-13T16:25:00Z',
      target_repo: 'test-repo',
      dimensions: {
        branch_management: { score: 0, findings: [] },
        pr_process: { score: 0, findings: [] },
        ai_governance: { score: 0, findings: [] },
        agent_management: { score: 0, findings: [] },
        ci_cd: { score: 0, findings: [] },
        documentation: { score: 0, findings: [] },
      },
      discovered_facts: [
        { category: 'ai_governance', fact: 'No governance registry found.', source: '.github/' },
      ],
      assumptions: [],
      gaps: [
        {
          area: 'ai_governance',
          description: 'No governance configuration detected.',
          severity: 'high',
          recommendation: 'Run initialize.mjs to scaffold governance-registry.yaml',
        },
      ],
      work_management: {
        detected_tools: [],
        recommended: 'github-issues',
        reason: 'No work management tools detected; GitHub Issues is the simplest default.',
      },
      next_steps: ['Run initialize.mjs to scaffold governance configuration'],
      completeness: 0.8,
    }

    const result = validate(validAssessment)
    expect(
      result,
      `Minimal valid assessment failed schema validation:\n${ajv.errorsText(validate.errors)}`
    ).toBe(true)
  })

  it('rejects assessment missing required overall_score', async () => {
    expect(existsSync(schemaPath), `${schemaPath} does not exist`).toBe(true)

    const schema = readJson(schemaPath)
    expect(schema, 'readiness-assessment.schema.json is not valid JSON').not.toBeNull()

    const ajv = await loadAjv()
    const validate = ajv.compile(schema)

    const invalidAssessment = {
      maturity_tier: 'Developing',
      generated_at: '2026-06-13T16:25:00Z',
      target_repo: 'test-repo',
    }

    expect(
      validate(invalidAssessment),
      'Assessment missing overall_score must fail validation'
    ).toBe(false)
  })
})

// ── 4. gap-report.schema.json contract ────────────────────────────────────

describe('gap-report.schema.json contract', () => {
  const schemaPath = join(schemasDir, 'gap-report.schema.json')

  it('validates a minimal valid gap report', async () => {
    expect(existsSync(schemaPath), `${schemaPath} does not exist`).toBe(true)

    const schema = readJson(schemaPath)
    expect(schema, 'gap-report.schema.json is not valid JSON').not.toBeNull()

    const ajv = await loadAjv()
    const validate = ajv.compile(schema)

    const validReport = {
      $schema: 'https://ais.com/agentic-sdlc/framework/schemas/gap-report.schema.json',
      version: '1.0.0',
      generated_at: '2026-06-13T16:25:00Z',
      repo: 'test-repo',
      assessment_ref: 'docs/assessment/readiness-assessment.yaml',
      summary: 'The repository has no governance configuration. Immediate initialization is recommended.',
      critical_gaps: [],
      high_gaps: [],
      medium_gaps: [],
      low_gaps: [],
      estimated_initialization_hours: 4,
      phase_plan: [
        {
          phase: 1,
          description: 'Scaffold governance configuration and agent catalog.',
          deliverables: ['aispec.config.yaml', 'governance-registry.yaml'],
          hours: 4,
        },
      ],
    }

    const result = validate(validReport)
    expect(
      result,
      `Minimal valid gap report failed schema validation:\n${ajv.errorsText(validate.errors)}`
    ).toBe(true)
  })

  it('rejects gap report missing required generated_at', async () => {
    expect(existsSync(schemaPath), `${schemaPath} does not exist`).toBe(true)

    const schema = readJson(schemaPath)
    expect(schema, 'gap-report.schema.json is not valid JSON').not.toBeNull()

    const ajv = await loadAjv()
    const validate = ajv.compile(schema)

    const invalidReport = {
      target_repo: 'test-repo',
      overall_score: 22,
    }

    expect(
      validate(invalidReport),
      'Gap report missing generated_at must fail validation'
    ).toBe(false)
  })
})

// ── 5. questionnaire.schema.json contract ─────────────────────────────────

describe('questionnaire.schema.json contract', () => {
  const schemaPath = join(schemasDir, 'questionnaire.schema.json')

  it('validates a minimal valid questionnaire', async () => {
    expect(existsSync(schemaPath), `${schemaPath} does not exist`).toBe(true)

    const schema = readJson(schemaPath)
    expect(schema, 'questionnaire.schema.json is not valid JSON').not.toBeNull()

    const ajv = await loadAjv()
    const validate = ajv.compile(schema)

    const validQuestionnaire = {
      $schema: 'https://ais.com/agentic-sdlc/framework/schemas/questionnaire.schema.json',
      version: '1.0.0',
      started_at: '2026-06-13T16:25:00Z',
      repo: 'test-repo',
      status: 'in_progress',
      answers: {},
      pending_questions: ['q01_repo_name', 'q02_work_management'],
    }

    const result = validate(validQuestionnaire)
    expect(
      result,
      `Minimal valid questionnaire failed schema validation:\n${ajv.errorsText(validate.errors)}`
    ).toBe(true)
  })

  it('rejects questionnaire missing required answers object', async () => {
    expect(existsSync(schemaPath), `${schemaPath} does not exist`).toBe(true)

    const schema = readJson(schemaPath)
    expect(schema, 'questionnaire.schema.json is not valid JSON').not.toBeNull()

    const ajv = await loadAjv()
    const validate = ajv.compile(schema)

    const invalidQuestionnaire = {
      $schema: 'https://ais.com/agentic-sdlc/framework/schemas/questionnaire.schema.json',
      version: '1.0.0',
      started_at: '2026-06-13T16:25:00Z',
      repo: 'test-repo',
      status: 'in_progress',
      pending_questions: [],
      // missing required 'answers'
    }

    expect(
      validate(invalidQuestionnaire),
      'Questionnaire missing answers must fail validation'
    ).toBe(false)
  })
})

// ── 6. initialization-state.schema.json contract ──────────────────────────

describe('initialization-state.schema.json contract', () => {
  const schemaPath = join(schemasDir, 'initialization-state.schema.json')

  it('validates a minimal valid initialization state with phase: "assessing"', async () => {
    expect(existsSync(schemaPath), `${schemaPath} does not exist`).toBe(true)

    const schema = readJson(schemaPath)
    expect(schema, 'initialization-state.schema.json is not valid JSON').not.toBeNull()

    const ajv = await loadAjv()
    const validate = ajv.compile(schema)

    const validState = {
      $schema: 'https://ais.com/agentic-sdlc/framework/schemas/initialization-state.schema.json',
      version: '1.0.0',
      initialized_at: '2026-06-13T16:25:00Z',
      last_updated: '2026-06-13T16:25:00Z',
      repo: 'test-repo',
      framework_version: '1.0.0',
      phase: 'assessing',
      completed_steps: [],
      pending_steps: ['assessment', 'questionnaire', 'config'],
    }

    const result = validate(validState)
    expect(
      result,
      `Minimal valid initialization state failed schema validation:\n${ajv.errorsText(validate.errors)}`
    ).toBe(true)
  })

  it('rejects initialization state missing required phase', async () => {
    expect(existsSync(schemaPath), `${schemaPath} does not exist`).toBe(true)

    const schema = readJson(schemaPath)
    expect(schema, 'initialization-state.schema.json is not valid JSON').not.toBeNull()

    const ajv = await loadAjv()
    const validate = ajv.compile(schema)

    const invalidState = {
      $schema: 'https://ais.com/agentic-sdlc/framework/schemas/initialization-state.schema.json',
      version: '1.0.0',
      initialized_at: '2026-06-13T16:25:00Z',
      last_updated: '2026-06-13T16:25:00Z',
      repo: 'test-repo',
      framework_version: '1.0.0',
      // missing required 'phase'
      completed_steps: [],
      pending_steps: [],
    }

    expect(
      validate(invalidState),
      'Initialization state missing phase must fail validation'
    ).toBe(false)
  })
})
