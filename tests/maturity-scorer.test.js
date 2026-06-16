/**
 * maturity-scorer.test.js
 *
 * Tests for scripts/maturity-scorer.mjs.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import { resolve, join } from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root = resolve(__dirname, '..')
const scratchRoot = join(root, 'tests', '__scratch__')

let scoreMaturity = null
let maturityLabel = null
let DIMENSION_IDS = null
let MATURITY_LABELS = null
let DIMENSIONS_META = null
let importError = null

try {
  const mod = await import('../scripts/maturity-scorer.mjs')
  scoreMaturity = mod.scoreMaturity
  maturityLabel = mod.maturityLabel
  DIMENSION_IDS = mod.DIMENSION_IDS
  MATURITY_LABELS = mod.MATURITY_LABELS
  DIMENSIONS_META = mod.DIMENSIONS_META
} catch (error) {
  importError = error
}

function requireScorer() {
  if (!scoreMaturity) {
    throw new Error(`maturity-scorer.mjs not delivered. Import error: ${importError?.message}`)
  }
}

function makeScratchDir(prefix = 'aef-maturity-test') {
  const dir = join(scratchRoot, `${prefix}-${crypto.randomBytes(6).toString('hex')}`)
  mkdirSync(dir, { recursive: true })
  return dir
}

function cleanScratchDir(dir) {
  if (dir && existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true })
  }
}

describe('maturityLabel', () => {
  it('is exported', () => { requireScorer(); expect(typeof maturityLabel).toBe('function') })
  it('returns Absent for 0', () => { expect(maturityLabel(0)).toBe('Absent') })
  it('returns Ad Hoc for 1', () => { expect(maturityLabel(1)).toBe('Ad Hoc') })
  it('returns Emerging for 2', () => { expect(maturityLabel(2)).toBe('Emerging') })
  it('returns Defined for 3', () => { expect(maturityLabel(3)).toBe('Defined') })
  it('returns Enforced for 4', () => { expect(maturityLabel(4)).toBe('Enforced') })
  it('returns Measured for 5', () => { expect(maturityLabel(5)).toBe('Measured') })
  it('handles decimal 3.7 as Enforced', () => { expect(maturityLabel(3.7)).toBe('Enforced') })
  it('handles decimal 1.2 as Ad Hoc', () => { expect(maturityLabel(1.2)).toBe('Ad Hoc') })
})

describe('exported metadata', () => {
  it('exports MATURITY_LABELS', () => {
    requireScorer()
    expect(Array.isArray(MATURITY_LABELS)).toBe(true)
    expect(MATURITY_LABELS).toContain('Measured')
  })

  it('exports DIMENSIONS_META', () => {
    requireScorer()
    expect(Array.isArray(DIMENSIONS_META)).toBe(true)
    expect(DIMENSIONS_META).toHaveLength(7)
  })
})

describe('DIMENSION_IDS', () => {
  it('is exported as an array', () => { requireScorer(); expect(Array.isArray(DIMENSION_IDS)).toBe(true) })
  it('has 7 dimensions', () => { expect(DIMENSION_IDS.length).toBe(7) })
  it('includes governance', () => { expect(DIMENSION_IDS).toContain('governance') })
  it('includes agent-coverage', () => { expect(DIMENSION_IDS).toContain('agent-coverage') })
  it('includes skill-coverage', () => { expect(DIMENSION_IDS).toContain('skill-coverage') })
  it('includes context-configuration', () => { expect(DIMENSION_IDS).toContain('context-configuration') })
  it('includes quality-verification', () => { expect(DIMENSION_IDS).toContain('quality-verification') })
  it('includes delivery-automation', () => { expect(DIMENSION_IDS).toContain('delivery-automation') })
  it('includes documentation-enablement', () => { expect(DIMENSION_IDS).toContain('documentation-enablement') })
})

describe('scoreMaturity — empty directory', () => {
  let tempDir

  beforeAll(() => { tempDir = makeScratchDir('empty') })
  afterAll(() => cleanScratchDir(tempDir))

  it('returns defined result', async () => {
    requireScorer()
    const result = await scoreMaturity(tempDir)
    expect(result).toBeDefined()
    expect(typeof result).toBe('object')
  })

  it('returns 7 dimensions', async () => {
    requireScorer()
    const result = await scoreMaturity(tempDir)
    expect(Array.isArray(result.dimensions)).toBe(true)
    expect(result.dimensions).toHaveLength(7)
  })

  it('all scores are 0 for empty dir', async () => {
    requireScorer()
    const result = await scoreMaturity(tempDir)
    for (const dim of result.dimensions) {
      expect(dim.score, `${dim.id} should be 0`).toBe(0)
    }
  })

  it('overall_score is 0 for empty dir', async () => {
    requireScorer()
    const result = await scoreMaturity(tempDir)
    expect(result.overall_score).toBe(0)
  })

  it('all maturity_levels are Absent for empty dir', async () => {
    requireScorer()
    const result = await scoreMaturity(tempDir)
    for (const dim of result.dimensions) {
      expect(dim.maturity_level, `${dim.id} should be Absent`).toBe('Absent')
    }
  })
})

describe('scoreMaturity — score range (framework repo)', () => {
  it('all scores are between 0 and 5', async () => {
    requireScorer()
    const result = await scoreMaturity(root)
    for (const dim of result.dimensions) {
      expect(dim.score, `${dim.id} score must be >= 0`).toBeGreaterThanOrEqual(0)
      expect(dim.score, `${dim.id} score must be <= 5`).toBeLessThanOrEqual(5)
    }
  })

  it('overall_score is between 0 and 5', async () => {
    requireScorer()
    const result = await scoreMaturity(root)
    expect(result.overall_score).toBeGreaterThanOrEqual(0)
    expect(result.overall_score).toBeLessThanOrEqual(5)
  })

  it('framework repo scores higher than empty dir', async () => {
    requireScorer()
    const tempDir = makeScratchDir('compare')
    try {
      const emptyResult = await scoreMaturity(tempDir)
      const frameworkResult = await scoreMaturity(root)
      expect(frameworkResult.overall_score).toBeGreaterThan(emptyResult.overall_score)
    } finally {
      cleanScratchDir(tempDir)
    }
  })
})

describe('scoreMaturity — dimension structure', () => {
  it('each dimension has required fields', async () => {
    requireScorer()
    const result = await scoreMaturity(root)
    const required = ['id', 'label', 'description', 'score', 'max_score', 'maturity_level', 'evidence', 'gaps', 'next_action', 'previous_categories', 'score_breakdown']
    for (const dim of result.dimensions) {
      for (const field of required) {
        expect(dim, `${dim.id} missing field: ${field}`).toHaveProperty(field)
      }
    }
  })

  it('max_score is 5 for all dimensions', async () => {
    requireScorer()
    const result = await scoreMaturity(root)
    for (const dim of result.dimensions) {
      expect(dim.max_score).toBe(5)
    }
  })

  it('evidence is an array', async () => {
    requireScorer()
    const result = await scoreMaturity(root)
    for (const dim of result.dimensions) {
      expect(Array.isArray(dim.evidence), `${dim.id}.evidence must be array`).toBe(true)
    }
  })

  it('gaps is an array', async () => {
    requireScorer()
    const result = await scoreMaturity(root)
    for (const dim of result.dimensions) {
      expect(Array.isArray(dim.gaps), `${dim.id}.gaps must be array`).toBe(true)
    }
  })

  it('previous_categories is non-empty array', async () => {
    requireScorer()
    const result = await scoreMaturity(root)
    for (const dim of result.dimensions) {
      expect(Array.isArray(dim.previous_categories), `${dim.id}.previous_categories must be array`).toBe(true)
      expect(dim.previous_categories.length, `${dim.id}.previous_categories must not be empty`).toBeGreaterThan(0)
    }
  })

  it('score_breakdown exposes the expected number of criteria per dimension', async () => {
    requireScorer()
    const result = await scoreMaturity(root)
    const expectedCriteriaCounts = {
      governance: 10,
      'agent-coverage': 10,
      'skill-coverage': 10,
      'context-configuration': 8,
      'quality-verification': 10,
      'delivery-automation': 10,
      'documentation-enablement': 10,
    }
    for (const dim of result.dimensions) {
      expect(Array.isArray(dim.score_breakdown?.criteria), `${dim.id}.score_breakdown.criteria must be array`).toBe(true)
      expect(dim.score_breakdown.criteria).toHaveLength(expectedCriteriaCounts[dim.id])
    }
  })

  it('maturity_level matches score', async () => {
    requireScorer()
    const result = await scoreMaturity(root)
    for (const dim of result.dimensions) {
      const expectedLabel = maturityLabel(dim.score)
      expect(dim.maturity_level, `${dim.id} maturity_level should match maturityLabel(${dim.score})`).toBe(expectedLabel)
    }
  })
})

describe('scoreMaturity — previous category mapping', () => {
  const OLD_CATEGORIES = ['config', 'agents', 'skills', 'governance', 'docs', 'tests', 'ci', 'playbooks']

  it('all old categories are mapped to at least one dimension', async () => {
    requireScorer()
    const result = await scoreMaturity(root)
    const allMapped = new Set(result.dimensions.flatMap(d => d.previous_categories))
    for (const cat of OLD_CATEGORIES) {
      expect(allMapped.has(cat), `Old category '${cat}' must be mapped to at least one dimension`).toBe(true)
    }
  })
})

describe('scoreMaturity — radar chart data', () => {
  it('result has correct shape for Chart.js radar', async () => {
    requireScorer()
    const result = await scoreMaturity(root)
    const labels = result.dimensions.map(d => d.label)
    const scores = result.dimensions.map(d => d.score)
    expect(labels).toHaveLength(7)
    expect(scores).toHaveLength(7)
    expect(scores.every(s => typeof s === 'number')).toBe(true)
  })
})

describe('scoreMaturity — zero score dimensions', () => {
  let tempDir

  beforeAll(() => {
    tempDir = makeScratchDir('minimal')
    writeFileSync(join(tempDir, 'README.md'), '# Test\n')
  })

  afterAll(() => cleanScratchDir(tempDir))

  it('governance is 0 when no registry exists', async () => {
    requireScorer()
    const result = await scoreMaturity(tempDir)
    const gov = result.dimensions.find(d => d.id === 'governance')
    expect(gov.score).toBe(0)
  })

  it('agent-coverage is 0 when no agents exist', async () => {
    requireScorer()
    const result = await scoreMaturity(tempDir)
    const agents = result.dimensions.find(d => d.id === 'agent-coverage')
    expect(agents.score).toBe(0)
  })

  it('gaps array is non-empty when score is 0', async () => {
    requireScorer()
    const result = await scoreMaturity(tempDir)
    for (const dim of result.dimensions) {
      if (dim.score === 0) {
        expect(dim.gaps.length, `${dim.id} with score=0 should have gaps`).toBeGreaterThan(0)
      }
    }
  })
})

describe('scoreMaturity — metadata', () => {
  it('generated_at is a valid ISO string', async () => {
    requireScorer()
    const result = await scoreMaturity(root)
    expect(typeof result.generated_at).toBe('string')
    expect(new Date(result.generated_at).toISOString()).toBe(result.generated_at)
  })

  it('overall_label matches maturityLabel(overall_score)', async () => {
    requireScorer()
    const result = await scoreMaturity(root)
    const expected = maturityLabel(result.overall_score)
    expect(result.overall_label).toBe(expected)
  })
})
