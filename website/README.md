# Agentic Engineering Framework — Product Website

Static HTML/CSS product website for the Agentic Engineering Framework. Served via GitHub Pages. No build step required.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Main product homepage |
| `maturity-checklist.html` | Interactive self-assessment checklist |
| `governance-explorer.html` | Dynamic governance registry explorer — loads `docs/governance/summary-grid.json`, renders filterable/sortable table of all agent activities with autonomy, risk, approval, and review status |
| `metrics.html` | Engineering metrics dashboard — loads `metrics/reports/latest.json`, renders KPI cards, CSS bar charts, SVG maturity timeline, autonomy distribution, framework adoption breakdown, and governance health |
| `styles.css` | Shared stylesheet for all pages |

## View Locally

Open `index.html` directly in any modern browser:

```
# macOS
open website/index.html

# Windows
start website\index.html

# Or just double-click index.html in your file explorer
```

No local server required. Both pages are fully self-contained.

## Deploy to GitHub Pages

**Option A — `/docs` folder:**
1. Copy (or symlink) the `website/` contents into a `/docs` folder at the repo root
2. In repo Settings → Pages → Source: `main` branch, `/docs` folder
3. Save — GitHub will serve the site within minutes

**Option B — Dedicated branch:**
1. Create a `gh-pages` branch
2. Copy the contents of `website/` to the root of that branch
3. In Settings → Pages → Source: `gh-pages` branch, `/ (root)`

**Option C — From `/website` directly:**
Some GitHub Pages setups support a custom publish directory via a GitHub Actions workflow. Use the `actions/upload-pages-artifact` action pointing at `./website`.

## Updating Content

All content is inline in the HTML files — no templating engine, no CMS.

- **Homepage sections:** Edit `index.html` — each section is clearly commented
- **Checklist items:** Add or remove `<label class="checklist-item">` blocks in `maturity-checklist.html`; update the `total` count in the inline `<script>` and the `TOTAL` constant if the total item count changes
- **Colors/design tokens:** Change CSS custom properties at the top of `styles.css`
- **Navigation links:** Shared nav is duplicated in both HTML files — update both

## Color System

All colors are defined as CSS custom properties in `styles.css`:

```css
:root {
  --color-bg:           #0f1117;   /* Page background (near-black) */
  --color-surface:      #1c1f2e;   /* Card and panel backgrounds (dark navy) */
  --color-surface-alt:  #22263a;   /* Elevated surface variant */
  --color-accent:       #4f7ef5;   /* Primary accent (professional blue) */
  --color-secondary:    #7c5cbf;   /* Secondary accent (muted purple) */
  --color-text:         #e8eaf0;   /* Primary text (light gray) */
  --color-text-muted:   #8b91a8;   /* Secondary text (muted gray) */
  --color-border:       #2a2d3e;   /* Subtle borders */
  --color-success:      #3d9970;   /* Success / positive states */
  --color-warning:      #e8b44b;   /* Warning / caution states */
  --color-error:        #e85b5b;   /* Error / problem states */
}
```

To change the entire color scheme, update only these variables — everything on both pages will update automatically.

## Maturity Checklist Scoring

The checklist script is inline in `maturity-checklist.html` (under 50 lines). It:

- Counts checked items per section and updates each section's progress bar
- Computes an overall percentage and updates the sidebar score in real time
- Maps the score to a maturity tier:

| Score | Tier |
|-------|------|
| 0–40% | Foundation |
| 41–65% | Developing |
| 66–85% | Established |
| 86–100% | Advanced |

If you add or remove checklist items, update both the `total` value for that section's key in the `sections` object and the `TOTAL` constant at the top of the script.
