/**
 * adoption.test.js
 *
 * Tests for scripts/check-adoption.mjs.
 * Anticipates the script exporting: checkAdoption(repoPath: string) => Promise<AdoptionResult>
 *
 * Where AdoptionResult = {
 *   generated_at: string,
 *   repo: string,
 *   overall_percentage: number (0-100),
 *   categories: {
 *     [key: string]: { total: number, adopted: number, percentage: number }
 *   }
 * }
 *
 * These tests will fail until AIArchitect delivers scripts/check-adoption.mjs.
 * That is expected — the test infrastructure is ready, waiting for implementation.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { existsSync, mkdirSync, rmSync } from 'fs'
import { resolve, join } from 'path'
import { fileURLToPath } from 'url'
import os from 'os'
import crypto from 'crypto'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dirname, '..')

const EXPECTED_CATEGORY_KEYS = [
  'config',
  'agents',
  'skills',
  'governance',
  'docs',
  'tests',
  'ci',
  'playbooks',
]

// ── Lazy import — fails gracefully until check-adoption.mjs is delivered ──

let checkAdoption = null
let importError = null

try {
  const mod = await import('../scripts/check-adoption.mjs')
  checkAdoption = mod.checkAdoption ?? mod.default
} catch (e) {
  importError = e
}

function requireCheckAdoption() {
  if (!checkAdoption) {
    throw new Error(
      `check-adoption.mjs not yet delivered, or does not export checkAdoption.\n` +
        `Import error: ${importError?.message ?? 'module not found'}\n` +
        `Expected: scripts/check-adoption.mjs exporting async function checkAdoption(repoPath)`
    )
  }
}

// ── Temp directory helpers ─────────────────────────────────────────────────

function makeTempDir(prefix = 'agentic-adoption-test-') {
  const dir = join(os.tmpdir(), `${prefix}${crypto.randomBytes(6).toString('hex')}`)
  mkdirSync(dir, { recursive: true })
  return dir
}

function cleanTempDir(dir) {
  if (dir && existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true })
  }
}

// ── 1. Run against framework repo itself ──────────────────────────────────

describe('checkAdoption — framework repo (process.cwd())', () => {
  it('returns a defined object', async () => {
    requireCheckAdoption()
    const result = await checkAdoption(process.cwd())
    expect(result).toBeDefined()
    expect(typeof result).toBe('object')
    expect(result).not.toBeNull()
  })

  it('overall_percentage is a number between 0 and 100', async () => {
    requireCheckAdoption()
    const result = await checkAdoption(process.cwd())
    expect(typeof result.overall_percentage).toBe('number')
    expect(result.overall_percentage).toBeGreaterThanOrEqual(0)
    expect(result.overall_percentage).toBeLessThanOrEqual(100)
  })

  it('result has a categories object', async () => {
    requireCheckAdoption()
    const result = await checkAdoption(process.cwd())
    expect(result).toHaveProperty('categories')
    expect(typeof result.categories).toBe('object')
    expect(result.categories).not.toBeNull()
  })

  for (const key of EXPECTED_CATEGORY_KEYS) {
    it(`categories has key: ${key}`, async () => {
      requireCheckAdoption()
      const result = await checkAdoption(process.cwd())
      expect(
        result.categories,
        'categories is not defined'
      ).toBeDefined()
      expect(
        result.categories[key],
        `categories is missing expected key '${key}'`
      ).toBeDefined()
    })

    it(`categories.${key} has total, adopted, and percentage fields`, async () => {
      requireCheckAdoption()
      const result = await checkAdoption(process.cwd())
      const cat = result.categories?.[key]
      expect(cat, `categories.${key} is not defined`).toBeDefined()
      expect(
        typeof cat.total,
        `categories.${key}.total must be a number`
      ).toBe('number')
      expect(
        typeof cat.adopted,
        `categories.${key}.adopted must be a number`
      ).toBe('number')
      expect(
        typeof cat.percentage,
        `categories.${key}.percentage must be a number`
      ).toBe('number')
    })
  }
})

// ── 2. Run against brownfield-sample ─────────────────────────────────────

describe('checkAdoption — brownfield-sample (lower adoption expected)', () => {
  const brownfieldPath = join(root, 'samples', 'brownfield-sample')

  it('brownfield-sample directory exists', () => {
    expect(
      existsSync(brownfieldPath),
      `Expected ${brownfieldPath} to exist — has Integration delivered samples/brownfield-sample/?`
    ).toBe(true)
  })

  it('returns overall_percentage for brownfield-sample', async () => {
    requireCheckAdoption()
    expect(existsSync(brownfieldPath), `${brownfieldPath} does not exist`).toBe(true)

    const result = await checkAdoption(brownfieldPath)
    expect(typeof result.overall_percentage).toBe('number')
    expect(result.overall_percentage).toBeGreaterThanOrEqual(0)
    expect(result.overall_percentage).toBeLessThanOrEqual(100)
  })

  it('brownfield-sample adoption is lower than the framework repo', async () => {
    requireCheckAdoption()
    expect(existsSync(brownfieldPath), `${brownfieldPath} does not exist`).toBe(true)

    const frameworkResult = await checkAdoption(process.cwd())
    const brownfieldResult = await checkAdoption(brownfieldPath)

    expect(
      brownfieldResult.overall_percentage,
      `brownfield-sample (${brownfieldResult.overall_percentage}%) should have lower adoption ` +
        `than the framework repo (${frameworkResult.overall_percentage}%)`
    ).toBeLessThan(frameworkResult.overall_percentage)
  })
})

// ── 3. Run against empty temp directory ──────────────────────────────────

describe('checkAdoption — empty directory (zero adoption)', () => {
  let tempDir

  beforeAll(() => {
    tempDir = makeTempDir()
  })

  afterAll(() => {
    cleanTempDir(tempDir)
  })

  it('returns overall_percentage of 0 for an empty directory', async () => {
    requireCheckAdoption()
    const result = await checkAdoption(tempDir)
    expect(typeof result.overall_percentage).toBe('number')
    expect(
      result.overall_percentage,
      `Expected overall_percentage to be 0 for an empty directory, got ${result.overall_percentage}`
    ).toBe(0)
  })

  it('returns a defined categories object for an empty directory', async () => {
    requireCheckAdoption()
    const result = await checkAdoption(tempDir)
    expect(result).toHaveProperty('categories')
    expect(typeof result.categories).toBe('object')
  })
})
