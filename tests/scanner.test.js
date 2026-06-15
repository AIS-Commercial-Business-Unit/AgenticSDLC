/**
 * scanner.test.js
 *
 * Unit tests for scripts/scan-repository.mjs.
 * Anticipates the scanner exporting: scanRepository(targetPath: string) => Promise<Assessment>
 *
 * Where Assessment = {
 *   overall_score: number,
 *   maturity_tier: string,
 *   dimensions: Record<string, { score: number, max: number, details: string }>,
 *   discovered_facts: string[],
 *   gaps: Gap[],
 *   work_management: { recommendation: string, detected: string, confidence: number }
 * }
 *
 * These tests will fail until Integration delivers scan-repository.mjs and
 * samples/brownfield-sample/. That is expected — the test infrastructure is
 * ready, waiting for implementation.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs'
import { resolve, join } from 'path'
import { fileURLToPath } from 'url'
import os from 'os'
import crypto from 'crypto'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dirname, '..')

// ── Lazy import — fails gracefully until scan-repository.mjs is delivered ──

let scanRepository = null
let importError = null

try {
  const mod = await import('../scripts/scan-repository.mjs')
  scanRepository = mod.scanRepository ?? mod.default
} catch (e) {
  importError = e
}

function requireScanner() {
  if (!scanRepository) {
    throw new Error(
      `scan-repository.mjs not yet delivered, or does not export scanRepository.\n` +
        `Import error: ${importError?.message ?? 'module not found'}\n` +
        `Expected: scripts/scan-repository.mjs exporting async function scanRepository(targetPath)`
    )
  }
}

// ── Temp directory helpers ─────────────────────────────────────────────────

function makeTempDir(prefix = 'agentic-scanner-test-') {
  const dir = join(os.tmpdir(), `${prefix}${crypto.randomBytes(6).toString('hex')}`)
  mkdirSync(dir, { recursive: true })
  return dir
}

function cleanTempDir(dir) {
  if (dir && existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true })
  }
}

// ── 1. Scan of empty directory ─────────────────────────────────────────────

describe('scanRepository — empty directory', () => {
  let tempDir

  beforeAll(() => {
    tempDir = makeTempDir()
  })

  afterAll(() => {
    cleanTempDir(tempDir)
  })

  it('returns a defined object for an empty directory', async () => {
    requireScanner()
    const result = await scanRepository(tempDir)
    expect(result).toBeDefined()
    expect(typeof result).toBe('object')
    expect(result).not.toBeNull()
  })

  it('overall_score is 0 or very low (≤10) for an empty directory', async () => {
    requireScanner()
    const result = await scanRepository(tempDir)
    expect(result.overall_score).toBeGreaterThanOrEqual(0)
    expect(result.overall_score).toBeLessThanOrEqual(10)
  })

  it('maturity_tier is "Foundation" for an empty directory', async () => {
    requireScanner()
    const result = await scanRepository(tempDir)
    expect(result.maturity_tier).toBe('Foundation')
  })
})

// ── 2. Scan of brownfield-sample ───────────────────────────────────────────

describe('scanRepository — brownfield-sample', () => {
  const brownfieldPath = join(root, 'samples', 'brownfield-sample')

  it('brownfield-sample directory exists', () => {
    expect(
      existsSync(brownfieldPath),
      `Expected ${brownfieldPath} to exist — has Integration delivered samples/brownfield-sample/?`
    ).toBe(true)
  })

  it('returns all required top-level fields', async () => {
    requireScanner()
    expect(existsSync(brownfieldPath), `${brownfieldPath} not found`).toBe(true)

    const result = await scanRepository(brownfieldPath)
    expect(result).toHaveProperty('overall_score')
    expect(result).toHaveProperty('maturity_tier')
    expect(result).toHaveProperty('dimensions')
    expect(result).toHaveProperty('discovered_facts')
    expect(result).toHaveProperty('gaps')
  })

  it('overall_score is between 0 and 100', async () => {
    requireScanner()
    expect(existsSync(brownfieldPath), `${brownfieldPath} not found`).toBe(true)

    const result = await scanRepository(brownfieldPath)
    expect(typeof result.overall_score).toBe('number')
    expect(result.overall_score).toBeGreaterThanOrEqual(0)
    expect(result.overall_score).toBeLessThanOrEqual(100)
  })

  it('has at least 1 gap (no governance config expected in brownfield-sample)', async () => {
    requireScanner()
    expect(existsSync(brownfieldPath), `${brownfieldPath} not found`).toBe(true)

    const result = await scanRepository(brownfieldPath)
    expect(Array.isArray(result.gaps)).toBe(true)
    expect(result.gaps.length).toBeGreaterThanOrEqual(1)
  })

  it('work_management field exists on the result', async () => {
    requireScanner()
    expect(existsSync(brownfieldPath), `${brownfieldPath} not found`).toBe(true)

    const result = await scanRepository(brownfieldPath)
    expect(result).toHaveProperty('work_management')
  })
})

// ── 3. CONTRIBUTING.md boosts documentation score ─────────────────────────

describe('scanRepository — CONTRIBUTING.md raises documentation score', () => {
  let tempDir

  beforeAll(() => {
    tempDir = makeTempDir()
    writeFileSync(
      join(tempDir, 'CONTRIBUTING.md'),
      '# Contributing\n\nThank you for contributing to this project!\n'
    )
  })

  afterAll(() => {
    cleanTempDir(tempDir)
  })

  it('documentation dimension score > 0 when CONTRIBUTING.md is present', async () => {
    requireScanner()
    const result = await scanRepository(tempDir)

    // Handle both { score: number } and bare number dimension shapes
    const docDim = result.dimensions?.documentation
    const docScore = typeof docDim === 'object' ? docDim.score : (docDim ?? 0)
    expect(docScore).toBeGreaterThan(0)
  })
})

// ── 4. .github/agents/ boosts agent_management score ──────────────────────

describe('scanRepository — .github/agents/ raises agent_management score', () => {
  let tempDir

  beforeAll(() => {
    tempDir = makeTempDir()
    mkdirSync(join(tempDir, '.github', 'agents'), { recursive: true })
    writeFileSync(
      join(tempDir, '.github', 'agents', 'test.agent.md'),
      '# Test Agent\n\nYou are a test agent. Assist with testing.\n'
    )
  })

  afterAll(() => {
    cleanTempDir(tempDir)
  })

  it('agent_management dimension score > 0 when .github/agents/ has agent files', async () => {
    requireScanner()
    const result = await scanRepository(tempDir)

    const agentDim = result.dimensions?.agent_management
    const agentScore = typeof agentDim === 'object' ? agentDim.score : (agentDim ?? 0)
    expect(agentScore).toBeGreaterThan(0)
  })
})
