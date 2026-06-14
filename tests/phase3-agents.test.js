/**
 * phase3-agents.test.js
 *
 * Phase 3 agent catalog and skill catalog tests.
 * Tests are forward-looking: they will fail until AIArchitect delivers
 * the YAML files under framework/agents/ and framework/skills/.
 * Green suite = agent and skill catalogs fully assembled and valid.
 *
 * Agent required fields: name (or derivable from filename), role,
 *   description, autonomy_level, capabilities, outputs
 * Valid autonomy_level values: L0, L1, L2, L3
 *
 * Skill required fields: name, description, inputs, outputs
 */

import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync, readdirSync } from 'fs'
import { resolve, join, basename, extname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dirname, '..')
const agentsDir = join(root, 'framework', 'agents')
const skillsDir = join(root, 'framework', 'skills')

const VALID_AUTONOMY_LEVELS = new Set(['L0', 'L1', 'L2', 'L3'])
const REQUIRED_AGENT_FIELDS = ['role', 'description', 'autonomy_level', 'capabilities', 'outputs']
const REQUIRED_SKILL_FIELDS = ['name', 'description', 'inputs', 'outputs']

// ── helpers ────────────────────────────────────────────────────────────────

function getYamlFiles(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).filter(
    (f) => extname(f) === '.yaml' || extname(f) === '.yml'
  )
}

async function loadYaml(filePath) {
  const yaml = (await import('js-yaml')).default
  try {
    return yaml.load(readFileSync(filePath, 'utf8'))
  } catch {
    return null
  }
}

// ── 1. framework/agents/ directory and count ──────────────────────────────

describe('Agent catalog — directory and count', () => {
  it('framework/agents/ directory exists', () => {
    expect(
      existsSync(agentsDir),
      `Expected ${agentsDir} to exist — has AIArchitect delivered the agent YAML files?`
    ).toBe(true)
  })

  it('framework/agents/ has at least 16 YAML files', () => {
    expect(existsSync(agentsDir), `${agentsDir} does not exist`).toBe(true)

    const files = getYamlFiles(agentsDir)
    expect(
      files.length,
      `Expected at least 16 agent YAML files, found ${files.length}. ` +
        `Files: ${files.join(', ') || '(none)'}`
    ).toBeGreaterThanOrEqual(16)
  })
})

// ── 2. Each agent YAML is valid YAML ──────────────────────────────────────

describe('Agent catalog — each file is valid YAML', () => {
  const files = getYamlFiles(agentsDir)

  if (files.length === 0) {
    it('framework/agents/ has YAML files to validate', () => {
      expect(
        existsSync(agentsDir) && files.length > 0,
        `No YAML files found in ${agentsDir} — has AIArchitect delivered the agent catalog?`
      ).toBe(true)
    })
  } else {
    for (const file of files) {
      it(`framework/agents/${file} is valid YAML`, async () => {
        const filePath = join(agentsDir, file)
        const parsed = await loadYaml(filePath)
        expect(
          parsed,
          `${file} failed YAML parsing — check for syntax errors`
        ).not.toBeNull()
        expect(typeof parsed, `${file} must parse to an object`).toBe('object')
      })
    }
  }
})

// ── 3. Each agent YAML has required fields ────────────────────────────────

describe('Agent catalog — each file has required fields', () => {
  const files = getYamlFiles(agentsDir)

  if (files.length === 0) {
    it('framework/agents/ has YAML files to check for required fields', () => {
      expect(
        existsSync(agentsDir) && files.length > 0,
        `No YAML files found in ${agentsDir} — has AIArchitect delivered the agent catalog?`
      ).toBe(true)
    })
  } else {
    for (const file of files) {
      for (const field of REQUIRED_AGENT_FIELDS) {
        it(`framework/agents/${file} has required field: ${field}`, async () => {
          const filePath = join(agentsDir, file)
          const parsed = await loadYaml(filePath)
          expect(parsed, `${file} is not valid YAML`).not.toBeNull()

          // 'name' may be derived from the filename if absent in YAML body
          if (field === 'name') {
            const hasName =
              parsed.name !== undefined ||
              basename(file, extname(file)).length > 0
            expect(
              hasName,
              `${file} must have a 'name' field or a valid filename to derive name from`
            ).toBe(true)
          } else {
            expect(
              parsed[field],
              `${file} is missing required field '${field}'`
            ).toBeDefined()
          }
        })
      }
    }
  }
})

// ── 4. All autonomy_level values are valid ────────────────────────────────

describe('Agent catalog — autonomy_level values are L0–L3', () => {
  const files = getYamlFiles(agentsDir)

  if (files.length === 0) {
    it('framework/agents/ has YAML files to check autonomy_level', () => {
      expect(
        existsSync(agentsDir) && files.length > 0,
        `No YAML files found in ${agentsDir}`
      ).toBe(true)
    })
  } else {
    for (const file of files) {
      it(`framework/agents/${file} has a valid autonomy_level (L0|L1|L2|L3)`, async () => {
        const filePath = join(agentsDir, file)
        const parsed = await loadYaml(filePath)
        expect(parsed, `${file} is not valid YAML`).not.toBeNull()
        expect(
          parsed.autonomy_level,
          `${file} is missing 'autonomy_level'`
        ).toBeDefined()
        expect(
          VALID_AUTONOMY_LEVELS.has(String(parsed.autonomy_level)),
          `${file} autonomy_level "${parsed.autonomy_level}" must be one of: L0, L1, L2, L3`
        ).toBe(true)
      })
    }
  }
})

// ── 5. framework/skills/ directory and count ──────────────────────────────

describe('Skill catalog — directory and count', () => {
  it('framework/skills/ directory exists', () => {
    expect(
      existsSync(skillsDir),
      `Expected ${skillsDir} to exist — has AIArchitect delivered the skill YAML files?`
    ).toBe(true)
  })

  it('framework/skills/ has at least 9 YAML files', () => {
    expect(existsSync(skillsDir), `${skillsDir} does not exist`).toBe(true)

    const files = getYamlFiles(skillsDir)
    expect(
      files.length,
      `Expected at least 9 skill YAML files, found ${files.length}. ` +
        `Files: ${files.join(', ') || '(none)'}`
    ).toBeGreaterThanOrEqual(9)
  })
})

// ── 6. Each skill YAML has required fields ────────────────────────────────

describe('Skill catalog — each file has required fields', () => {
  const files = getYamlFiles(skillsDir)

  if (files.length === 0) {
    it('framework/skills/ has YAML files to validate', () => {
      expect(
        existsSync(skillsDir) && files.length > 0,
        `No YAML files found in ${skillsDir} — has AIArchitect delivered the skill catalog?`
      ).toBe(true)
    })
  } else {
    for (const file of files) {
      it(`framework/skills/${file} is valid YAML`, async () => {
        const filePath = join(skillsDir, file)
        const parsed = await loadYaml(filePath)
        expect(
          parsed,
          `${file} failed YAML parsing — check for syntax errors`
        ).not.toBeNull()
        expect(typeof parsed, `${file} must parse to an object`).toBe('object')
      })

      for (const field of REQUIRED_SKILL_FIELDS) {
        it(`framework/skills/${file} has required field: ${field}`, async () => {
          const filePath = join(skillsDir, file)
          const parsed = await loadYaml(filePath)
          expect(parsed, `${file} is not valid YAML`).not.toBeNull()
          expect(
            parsed[field],
            `${file} is missing required field '${field}'`
          ).toBeDefined()
        })
      }
    }
  }
})
