# AIS Workflow

```mermaid
flowchart TD
    %% ── Styling ──
    classDef input fill:#f9f0ff,stroke:#7c3aed,stroke-width:2px,color:#1e1e1e
    classDef setup fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#1e1e1e
    classDef spec fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#1e1e1e
    classDef maintain fill:#fef9c3,stroke:#ca8a04,stroke-width:2px,color:#1e1e1e
    classDef status fill:#f1f5f9,stroke:#64748b,stroke-width:1px,color:#475569
    classDef sync fill:#ffe4e6,stroke:#e11d48,stroke-width:2px,color:#1e1e1e

    %% ── Input ──
    CTX["📁 .project-context/<br/><i>RFPs, SOWs, transcripts, requirements</i>"]:::input

    %% ── Setup Phase ──
    subgraph SETUP ["🏗️ Project Setup — run once"]
        direction TB
        PLAN["/ais.setup.plan<br/><b>Project Plan</b><br/>Decompose into YYMM-NNN catalog"]:::setup
        ARCH["/ais.setup.architecture<br/><b>Solution Architecture</b><br/>C4 diagrams, tech stack, ADRs"]:::setup
        CONST["/ais.setup.constitution<br/><b>Constitution</b><br/>Governance, standards, quality gates"]:::setup
        PLAN --> ARCH --> CONST
    end

    CTX --> PLAN

    %% ── Spec Lifecycle ──
    subgraph LIFECYCLE ["🔄 Spec Lifecycle — per component"]
        direction TB
        SPECIFY["/ais.spec.specify<br/><b>Feature Spec</b><br/>Create spec + branch (YYMM-NNN)"]:::spec
        DESIGN["/ais.spec.design<br/><b>Technical Design</b><br/>Research, data model, contracts"]:::spec
        TASKS["/ais.spec.tasks<br/><b>Task Breakdown</b><br/>Dependency-ordered + consistency check"]:::spec
        IMPL["/ais.spec.implement<br/><b>Implementation</b><br/>Execute tasks phase-by-phase"]:::spec
        SPECIFY --> DESIGN --> TASKS --> IMPL
    end

    CONST --> SPECIFY

    %% ── Status Tracking ──
    SPECIFY -. "🟡 Defining" .-> TRACKER
    DESIGN -. "🔵 Planning" .-> TRACKER
    TASKS -. "🟢 Ready for Dev" .-> TRACKER
    IMPL -. "🚀 In Development → ✅ Complete" .-> TRACKER
    TRACKER["📊 Auto Status Update<br/><i>spec.md frontmatter</i>"]:::status

    %% ── GitHub Sync ──
    GHSYNC["/ais.github.sync<br/><b>GitHub Sync</b><br/>Milestones ↔ Issues ↔ Labels"]:::sync
    IMPL --> GHSYNC

    %% ── Maintain ──
    CLARIFY["/ais.maintain.clarify<br/><b>Smart Clarify</b><br/>Ingest new context or resolve ambiguities"]:::maintain
    CLARIFY -. "new context" .-> CTX
    CLARIFY -. "spec refinement" .-> SPECIFY

    %% ── Artifacts ──
    subgraph ARTIFACTS ["📦 Output Artifacts"]
        direction LR
        PP["specs/.project-plan/"]
        AR["specs/.architecture/"]
        SP["specs/YYMM-NNN-feature/<br/>spec.md · design.md · tasks.md"]
    end

    PLAN --> PP
    ARCH --> AR
    IMPL --> SP
```

## Phases at a Glance

| Phase | Commands | Key Output |
|-------|----------|------------|
| **Setup** | `plan` → `architecture` → `constitution` | Project plan, C4 architecture, governance standards |
| **Spec Lifecycle** | `specify` → `design` → `tasks` → `implement` | Feature spec, technical design, task list, working code |
| **Sync** | `github.sync` | GitHub milestones, issues, and labels |
| **Maintain** | `clarify` | Updated context or refined specs |

## Status Progression

Each spec lifecycle command automatically updates the project plan status tracker:

```
🟡 Defining  →  🔵 Planning  →  🟢 Ready for Dev  →  🚀 In Development  →  ✅ Complete
```
