/**
 * gap-report.test.js
 *
 * Tests for scripts/generate-gap-report.mjs.
 * Anticipates the script exporting: generateGapReport(assessment: Assessment) => Promise<string>
 * where the returned string is a Markdown document.
 *
 * Uses tests/fixtures/sample-assessment.json as the primary test fixture.
 *
 * These tests will fail until Integration delivers generate-gap-report.mjs.
 * That is expected — the test infrastructure is ready, waiting for implementation.
 */

import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dirname, '..')
const fixturesDir = join(__dirname, 'fixtures')
const sampleAssessmentPath = join(fixturesDir, 'sample-assessment.json')

// ── Lazy import — fails gracefully until generate-gap-report.mjs is delivered ──

let generateGapReport = null
let importError = null

try {
  const mod = await import('../scripts/generate-gap-report.mjs')
  generateGapReport = mod.generateGapReport ?? mod.default
} catch (e) {
  importError = e
}

function requireGenerator() {
  if (!generateGapReport) {
    throw new Error(
      `generate-gap-report.mjs not yet delivered, or does not export generateGapReport.\n` +
        `Import error: ${importError?.message ?? 'module not found'}\n` +
        `Expected: scripts/generate-gap-report.mjs exporting async function generateGapReport(assessment)`
    )
  }
}

function loadFixture() {
  expect(
    existsSync(sampleAssessmentPath),
    `Fixture not found: ${sampleAssessmentPath}`
  ).toBe(true)
  return JSON.parse(readFileSync(sampleAssessmentPath, 'utf8'))
}

// ── 1. Output structure ────────────────────────────────────────────────────

describe('generateGapReport — output structure', () => {
  it('produces a non-empty string starting with "# "', async () => {
    requireGenerator()
    const assessment = loadFixture()
    const output = await generateGapReport(assessment)

    expect(typeof output).toBe('string')
    expect(output.trim().length).toBeGreaterThan(0)
    expect(output.trim()).toMatch(/^# /)
  })

  it('output contains the overall_score value', async () => {
    requireGenerator()
    const assessment = loadFixture()
    const output = await generateGapReport(assessment)

    expect(output).toContain(String(assessment.overall_score))
  })

  it('output contains the target repository name', async () => {
    requireGenerator()
    const assessment = loadFixture()
    const output = await generateGapReport(assessment)

    expect(output).toContain(assessment.target_repo)
  })

  it('output includes the maturity tier', async () => {
    requireGenerator()
    const assessment = loadFixture()
    const output = await generateGapReport(assessment)

    expect(output).toContain(assessment.maturity_tier)
  })
})

// ── 2. Gap section ─────────────────────────────────────────────────────────

describe('generateGapReport — gap section', () => {
  it('output contains a Gap or Critical section heading', async () => {
    requireGenerator()
    const assessment = loadFixture()
    const output = await generateGapReport(assessment)

    expect(output).toMatch(/gap|critical|improvement/i)
  })

  it('output references high-severity gaps from the assessment', async () => {
    requireGenerator()
    const assessment = loadFixture()
    const highGaps = assessment.gaps.filter((g) => g.severity === 'high')

    expect(highGaps.length).toBeGreaterThan(0)

    const output = await generateGapReport(assessment)
    // At least one high-severity gap area or description must appear in the report
    const mentioned = highGaps.some(
      (g) => output.includes(g.area) || output.includes(g.description)
    )
    expect(
      mentioned,
      `Expected at least one high-severity gap area or description to appear in the report.\n` +
        `High gaps: ${highGaps.map((g) => g.area).join(', ')}`
    ).toBe(true)
  })
})

// ── 3. Zero-gap edge case ──────────────────────────────────────────────────

describe('generateGapReport — zero gaps', () => {
  it('handles an assessment with no gaps gracefully', async () => {
    requireGenerator()

    const noGapAssessment = {
      overall_score: 90,
      maturity_tier: 'Optimizing',
      generated_at: '2026-06-13T16:25:00Z',
      target_repo: 'greenfield-repo',
      gaps: [],
    }

    const output = await generateGapReport(noGapAssessment)

    expect(typeof output).toBe('string')
    expect(output.trim().length).toBeGreaterThan(0)
    expect(output).toMatch(/no critical gaps|no gaps|all clear|nothing to address|✅/i)
  })

  it('zero-gap report still starts with "# "', async () => {
    requireGenerator()

    const noGapAssessment = {
      overall_score: 90,
      maturity_tier: 'Optimizing',
      generated_at: '2026-06-13T16:25:00Z',
      target_repo: 'greenfield-repo',
      gaps: [],
    }

    const output = await generateGapReport(noGapAssessment)
    expect(output.trim()).toMatch(/^# /)
  })
})
