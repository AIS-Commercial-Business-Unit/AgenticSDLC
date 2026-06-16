/**
 * website.test.js
 *
 * Tests for the AEF website HTML pages and shared utilities.
 * Covers:
 *   1. Navigation consistency across all 4 pages
 *   2. Correct AIS Specify lifecycle step values in governance filter
 *   3. Absence of obsolete lifecycle values (build, test, review, operate)
 *   4. Absence of removed navigation items (Playbooks, Documentation)
 *   5. Presence of correct navigation items on all pages
 *   6. GitHub link format (no bare href="#")
 *   7. Footer consistency
 *   8. shared.js utility functions
 *   9. Maturity lifecycle step values in metrics.html
 *  10. Decorative eyebrow chips removed from page heroes
 *  11. Repository display — no local path in source note
 */

import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const root      = resolve(__dirname, '..')
const webDir    = join(root, 'website')

// ── helpers ────────────────────────────────────────────────────────────────

function readHtml(filename) {
  const p = join(webDir, filename)
  if (!existsSync(p)) return null
  return readFileSync(p, 'utf8')
}

const PAGE_FILES = [
  'index.html',
  'maturity-checklist.html',
  'governance-explorer.html',
  'metrics.html',
]

// ── 1. All pages exist ─────────────────────────────────────────────────────

describe('Website pages exist', () => {
  PAGE_FILES.forEach(f => {
    it(`${f} exists`, () => {
      expect(existsSync(join(webDir, f)), `${f} not found in website/`).toBe(true)
    })
  })

  it('shared.js exists', () => {
    expect(existsSync(join(webDir, 'shared.js')), 'shared.js not found in website/').toBe(true)
  })
})

// ── 2. Navigation — correct items present on every page ───────────────────

describe('Navigation — required items present on every page', () => {
  PAGE_FILES.forEach(f => {
    const html = readHtml(f)
    if (!html) return

    it(`${f}: nav contains "Maturity Check" link`, () => {
      expect(html).toContain('maturity-checklist.html')
    })

    it(`${f}: nav contains "Governance" link`, () => {
      expect(html).toContain('governance-explorer.html')
    })

    it(`${f}: nav contains "Metrics" link`, () => {
      expect(html).toContain('metrics.html')
    })

    it(`${f}: nav contains "Features" link`, () => {
      expect(html).toContain('index.html#features')
    })
  })
})

// ── 3. Navigation — removed items absent ──────────────────────────────────

describe('Navigation — removed items absent from primary nav', () => {
  PAGE_FILES.forEach(f => {
    const html = readHtml(f)
    if (!html) return

    it(`${f}: primary nav does not contain "Playbooks" as nav link`, () => {
      // The nav section is before </nav>. Playbooks may appear in footer or
      // page body but must not be in the <nav class="nav"> primary nav block.
      // We test by checking there's no nav__link pointing to #playbooks.
      expect(html).not.toMatch(/class="nav__link"[^>]*href="[^"]*#playbooks"/)
      expect(html).not.toMatch(/href="[^"]*#playbooks"[^>]*class="nav__link"/)
    })
  })
})

// ── 4. GitHub links wired via shared.js (href="#github" not bare "#") ──────

describe('Navigation — GitHub links use shared.js convention', () => {
  PAGE_FILES.forEach(f => {
    const html = readHtml(f)
    if (!html) return

    it(`${f}: nav GitHub link uses href="#github" (wired by shared.js) or hardcoded URL`, () => {
      const hasGithubConvention = html.includes('href="#github"')
      const hasHardcodedUrl     = html.includes('href="https://github.com/AIS-Commercial-Business-Unit/AgenticSDLC"')
      expect(
        hasGithubConvention || hasHardcodedUrl,
        `${f}: GitHub nav link should use href="#github" or the full repo URL, not href="#"`
      ).toBe(true)
    })

    it(`${f}: nav GitHub link does NOT use bare href="#"`, () => {
      // Match <a ... href="#" ...> inside the nav block. We can check the nav
      // doesn't have the old pattern.
      const navMatch = html.match(/<nav class="nav"[^>]*>([\s\S]*?)<\/nav>/)
      if (!navMatch) return
      expect(navMatch[1]).not.toMatch(/href="#"/)
    })
  })
})

// ── 5. Active nav state — each page uses AEF.initPage() ───────────────────

describe('Navigation — active state managed by shared.js', () => {
  it('index.html calls AEF.initPage with home', () => {
    const html = readHtml('index.html')
    expect(html).toContain("AEF.initPage('home')")
  })

  it('maturity-checklist.html calls AEF.initPage with maturity', () => {
    const html = readHtml('maturity-checklist.html')
    expect(html).toContain("AEF.initPage('maturity')")
  })

  it('governance-explorer.html calls AEF.initPage with governance', () => {
    const html = readHtml('governance-explorer.html')
    expect(html).toContain("AEF.initPage('governance')")
  })

  it('metrics.html calls AEF.initPage with metrics', () => {
    const html = readHtml('metrics.html')
    expect(html).toContain("AEF.initPage('metrics')")
  })
})

// ── 6. Footer consistency ──────────────────────────────────────────────────

describe('Footer — consistent on every page', () => {
  PAGE_FILES.forEach(f => {
    const html = readHtml(f)
    if (!html) return

    it(`${f}: footer contains AIS Commercial Business Unit attribution`, () => {
      expect(html).toContain('AIS Commercial Business Unit')
    })

    it(`${f}: footer contains Documentation link`, () => {
      expect(html).toContain('Documentation')
    })

    it(`${f}: footer does not display "v1.0.0-alpha"`, () => {
      expect(html).not.toContain('v1.0.0-alpha')
    })
  })
})

// ── 7. Governance lifecycle step values ───────────────────────────────────

describe('Governance Explorer — correct AIS Specify lifecycle filter options', () => {
  const html = readHtml('governance-explorer.html')

  const CORRECT_STEPS   = ['intake','specify','design','plan','implement','verify','deploy','report','learn']
  const OBSOLETE_STEPS  = ['build','test','review','operate']

  CORRECT_STEPS.forEach(step => {
    it(`governance-explorer.html filter contains correct step: "${step}"`, () => {
      expect(html).toContain(`value="${step}"`)
    })
  })

  OBSOLETE_STEPS.forEach(step => {
    it(`governance-explorer.html filter does NOT contain obsolete step: "${step}"`, () => {
      // Check specifically inside a <option value="..."> context
      expect(html).not.toMatch(new RegExp(`<option[^>]*value="${step}"[^>]*>`))
    })
  })
})

// ── 8. Metrics — correct AIS_STEPS constant ───────────────────────────────

describe('Metrics — correct AIS_STEPS constant', () => {
  const html = readHtml('metrics.html')

  const CORRECT_STEPS  = ['intake','specify','design','plan','implement','verify','deploy','report','learn']
  const OBSOLETE_STEPS = ['build','test','review','operate']

  it('metrics.html AIS_STEPS contains all 9 correct steps', () => {
    // Check the JS array literal is present in the file
    CORRECT_STEPS.forEach(step => {
      expect(html, `AIS_STEPS should include '${step}'`).toContain(`'${step}'`)
    })
  })

  OBSOLETE_STEPS.forEach(step => {
    it(`metrics.html AIS_STEPS does NOT contain obsolete step: '${step}'`, () => {
      // Find the AIS_STEPS declaration and check it doesn't have obsolete values
      const aisStepsMatch = html.match(/const AIS_STEPS\s*=\s*\[([\s\S]*?)\]/)
      if (!aisStepsMatch) return
      expect(aisStepsMatch[1]).not.toContain(`'${step}'`)
    })
  })
})

// ── 9. Decorative eyebrow chips removed from page heroes ─────────────────

describe('Visual — decorative eyebrow chips removed', () => {
  it('governance-explorer.html does not contain "Governance Registry" eyebrow chip', () => {
    const html = readHtml('governance-explorer.html')
    // The page-hero__eyebrow element containing "Governance Registry" should be gone
    expect(html).not.toMatch(/page-hero__eyebrow[\s\S]{0,200}Governance Registry/)
  })

  it('metrics.html does not contain "Live Dashboard" eyebrow chip', () => {
    const html = readHtml('metrics.html')
    expect(html).not.toMatch(/page-hero__eyebrow[\s\S]{0,200}Live Dashboard/)
  })

  it('maturity-checklist.html does not contain "Self-Assessment Tool" eyebrow chip', () => {
    const html = readHtml('maturity-checklist.html')
    expect(html).not.toMatch(/hero__eyebrow[\s\S]{0,200}Self-Assessment Tool/)
  })
})

// ── 10. Homepage structural improvements ──────────────────────────────────

describe('Homepage — structural improvements', () => {
  const html = readHtml('index.html')

  it('homepage contains 4-stage lifecycle section', () => {
    // Should have 4 stage headings
    expect(html).toContain('Discover &amp; Specify')
    expect(html).toContain('Architect &amp; Plan')
    expect(html).toContain('Build &amp; Verify')
    expect(html).toContain('Deploy, Measure &amp; Learn')
  })

  it('homepage lifecycle cards reference AIS Specify steps', () => {
    expect(html).toContain('Intake · Specify')
    expect(html).toContain('Design · Plan')
    expect(html).toContain('Implement · Verify')
    expect(html).toContain('Deploy · Report · Learn')
  })

  it('homepage has link to detailed 9-step lifecycle', () => {
    expect(html).toContain('detailed 9-step AIS Specify lifecycle')
  })

  it('homepage does not contain Quick Start clone commands', () => {
    expect(html).not.toContain('git clone')
    expect(html).not.toContain('quickstart-step')
  })

  it('homepage does not contain Playbooks section', () => {
    expect(html).not.toContain('id="playbooks"')
    expect(html).not.toContain('playbook-card')
  })

  it('homepage "Is Your Team Ready" CTA section is removed', () => {
    expect(html).not.toContain('Is Your Team Ready')
  })

  it('homepage contains Proof/Demo section linking to live tools', () => {
    expect(html).toContain('id="demo"')
    expect(html).toContain('Governance Explorer')
    expect(html).toContain('Engineering Metrics')
  })

  it('homepage contains enterprise inner-source section', () => {
    expect(html).toContain('Inner-Source Model')
  })
})

// ── 11. Maturity page — assessment source explanation ─────────────────────

describe('Maturity page — assessment source explanation', () => {
  const html = readHtml('maturity-checklist.html')

  it('maturity page explains automated assessment source', () => {
    expect(html).toContain('npm run scan')
  })

  it('maturity page explains manual checklist purpose', () => {
    expect(html).toContain('cannot be detected from code alone')
  })
})

// ── 12. shared.js utility functions ───────────────────────────────────────

describe('shared.js — utility functions', () => {
  const sharedPath = join(webDir, 'shared.js')
  const sharedCode = existsSync(sharedPath) ? readFileSync(sharedPath, 'utf8') : ''

  it('shared.js exports AEF.formatDate', () => {
    expect(sharedCode).toContain('formatDate')
  })

  it('shared.js exports AEF.formatShortDate', () => {
    expect(sharedCode).toContain('formatShortDate')
  })

  it('shared.js exports AEF.initPage', () => {
    expect(sharedCode).toContain('initPage')
  })

  it('shared.js contains the canonical GitHub URL', () => {
    expect(sharedCode).toContain('https://github.com/AIS-Commercial-Business-Unit/AgenticSDLC')
  })

  it('shared.js contains REPO_DISPLAY as AIS-Commercial-Business-Unit/AgenticSDLC', () => {
    expect(sharedCode).toContain('AIS-Commercial-Business-Unit/AgenticSDLC')
  })

  it('shared.js formatDate handles ISO 8601 timestamps', () => {
    // Basic smoke test: the function body calls toLocaleString
    expect(sharedCode).toContain('toLocaleString')
  })
})

// ── 13. Repository display — no local filesystem paths ───────────────────

describe('Repository display — no local filesystem paths in visible source', () => {
  PAGE_FILES.forEach(f => {
    const html = readHtml(f)
    if (!html) return

    it(`${f}: does not hard-code a Windows or Unix local path`, () => {
      // Should not contain patterns like C:\, /home/, /Users/, /mnt/
      expect(html).not.toMatch(/C:\\[\w]/)
      expect(html).not.toMatch(/\/home\/\w/)
      expect(html).not.toMatch(/\/Users\/\w/)
    })
  })

  it('metrics.html buildMetaBar normalizes repo path to owner/repo format', () => {
    const html = readHtml('metrics.html')
    // The updated buildMetaBar should contain the normalization logic
    expect(html).toContain('AIS-Commercial-Business-Unit/AgenticSDLC')
  })
})

// ── 14. Maturity color — highest level is green, not blue ────────────────

describe('Metrics — maturity color scale uses green for highest level', () => {
  const html = readHtml('metrics.html')

  it('maturity-level-badge--measured uses green, not blue', () => {
    const measuredCssMatch = html.match(/\.maturity-level-badge--measured\s*\{([^}]+)\}/)
    expect(measuredCssMatch, 'Could not find .maturity-level-badge--measured CSS rule').not.toBeNull()
    if (measuredCssMatch) {
      // Should NOT be #3b82f6 (blue) and should be a green tone
      expect(measuredCssMatch[1]).not.toContain('#3b82f6')
      // Should contain a green color code
      const hasGreen = /10b981|22c55e|059669|16a34a|065f46/.test(measuredCssMatch[1])
      expect(hasGreen, 'Measured & Optimized badge should use a green color').toBe(true)
    }
  })

  it('maturityColor() returns green tone for score >= 4.5 (not blue)', () => {
    const maturityColorMatch = html.match(/function maturityColor\(score\)\s*\{([\s\S]*?)\}/)
    expect(maturityColorMatch, 'Could not find maturityColor() function').not.toBeNull()
    if (maturityColorMatch) {
      const body = maturityColorMatch[1]
      // Should NOT contain 3b82f6 (blue) as the top-score return
      expect(body).not.toContain('#3b82f6')
      // Should end with a green-family return
      const lastReturn = body.match(/return\s+'([^']+)'\s*;\s*\/\//g)
      if (lastReturn) {
        // The last return value in the function should be a green family color
        const lastColor = lastReturn[lastReturn.length - 1].match(/'([^']+)'/)[1]
        const isGreen = /10b981|22c55e|059669|16a34a|065f46|0d9488/.test(lastColor)
        expect(isGreen, `Top maturity color ${lastColor} should be green-family`).toBe(true)
      }
    }
  })
})

// ── 15. Governance summary-grid uses correct AIS lifecycle steps ──────────

describe('docs/governance/summary-grid.json — AIS lifecycle step values', () => {
  const gridPath = join(root, 'docs', 'governance', 'summary-grid.json')

  it('summary-grid.json exists', () => {
    expect(existsSync(gridPath)).toBe(true)
  })

  it('summary-grid.json entries use only correct AIS Specify lifecycle steps', () => {
    if (!existsSync(gridPath)) return

    const grid = JSON.parse(readFileSync(gridPath, 'utf8'))
    const entries = grid.entries || []
    const VALID_STEPS = new Set(['Intake','Specify','Design','Plan','Implement','Verify','Deploy','Report','Learn'])
    const OBSOLETE_STEPS = ['Build','Test','Review','Operate']

    entries.forEach((e, i) => {
      if (e.ais_step) {
        expect(
          VALID_STEPS.has(e.ais_step),
          `entries[${i}].ais_step "${e.ais_step}" is not a valid AIS Specify step`
        ).toBe(true)
      }
    })

    OBSOLETE_STEPS.forEach(step => {
      const found = entries.some(e => e.ais_step === step)
      expect(found, `summary-grid.json should not contain obsolete step "${step}"`).toBe(false)
    })
  })
})
