# AIS Workflow

```mermaid
flowchart TD
    %% ── Styling ──
    classDef input fill:#f9f0ff,stroke:#7c3aed,stroke-width:2px,color:#1e1e1e
    classDef presales fill:#fff7ed,stroke:#ea580c,stroke-width:2px,color:#1e1e1e
    classDef setup fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#1e1e1e
    classDef spec fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#1e1e1e
    classDef maintain fill:#fef9c3,stroke:#ca8a04,stroke-width:2px,color:#1e1e1e
    classDef status fill:#f1f5f9,stroke:#64748b,stroke-width:1px,color:#475569
    classDef sync fill:#ffe4e6,stroke:#e11d48,stroke-width:2px,color:#1e1e1e
    classDef report fill:#fce7f3,stroke:#db2777,stroke-width:2px,color:#1e1e1e

    %% ── Input ──
    CTX["📁 .project-context/<br/><i>RFIs, RFPs, SOWs, MSAs, transcripts, green sheets</i>"]:::input

    %% ── Pre-Sales Phase ──
    subgraph PRESALES ["💼 Pre-Sales — scope and estimate"]
        direction TB
        SYNTH["/ais.presales.synthesize<br/><b>What We Heard</b><br/>Synthesize client needs"]:::presales
        PROPOSE["/ais.presales.propose<br/><b>Proposal</b><br/>Specs, ROM, staffing inputs, cost-model needs"]:::presales
        SCOPE["/ais.presales.scope<br/><b>SOW</b><br/>Family, model, deliverables, bridge"]:::presales
        SYNTH --> PROPOSE --> SCOPE
    end

    CTX --> SYNTH

    %% ── Setup Phase ──
    subgraph SETUP ["🏗️ Project Setup — run once"]
        direction TB
        PLAN["/ais.setup.plan<br/><b>Project Plan</b><br/>Create YYMM-NNN directories"]:::setup
        ARCH["/ais.setup.architecture<br/><b>Solution Architecture</b><br/>C4 diagrams, tech stack, ADRs"]:::setup
        CONST["/ais.setup.constitution<br/><b>Constitution</b><br/>Governance, standards, quality gates"]:::setup
        PLAN --> ARCH --> CONST
    end

    CTX --> PLAN
    SCOPE -. "SOW as T1 source" .-> PLAN

    %% ── Spec Lifecycle ──
    subgraph LIFECYCLE ["🔄 Spec Lifecycle — per component"]
        direction TB
        BRAIN["/ais.spec.brainstorm<br/><b>Spec Seed Brief</b><br/>Optional idea shaping"]:::spec
        SPECIFY["/ais.spec.specify<br/><b>Feature Spec</b><br/>Create spec + branch (YYMM-NNN)"]:::spec
        DESIGN["/ais.spec.design<br/><b>Technical Design</b><br/>Research, data model, contracts"]:::spec
        TASKS["/ais.spec.tasks<br/><b>Task Breakdown</b><br/>Dependency-ordered + consistency check"]:::spec
        IMPLPLAN["implementation-plan.md<br/><b>Living Implementation Plan</b><br/>Optional for larger/riskier work"]:::spec
        IMPL["/ais.spec.implement<br/><b>Implementation</b><br/>Execute tasks + review/evidence gates"]:::spec
        BRAIN -. "optional handoff" .-> SPECIFY
        SPECIFY --> DESIGN --> TASKS --> IMPL
        TASKS -. "creates when needed" .-> IMPLPLAN
        IMPLPLAN -. "kept current during delivery" .-> IMPL
    end

    CONST --> BRAIN
    CONST --> SPECIFY

    %% ── Status Tracking ──
    SPECIFY -. "defining" .-> TRACKER
    DESIGN -. "planning" .-> TRACKER
    TASKS -. "ready" .-> TRACKER
    IMPL -. "in-dev → complete" .-> TRACKER
    TRACKER["📊 Frontmatter Status<br/><i>spec.md YAML</i>"]:::status

    %% ── Reporting ──
    subgraph REPORTS ["📈 Reporting — derived from repo state"]
        direction LR
        STANDUP["/ais.report.standup<br/><b>Internal Daily</b>"]:::report
        STATUSRPT["/ais.report.status<br/><b>Client-Facing</b>"]:::report
        PROJECT["/ais.report.project<br/><b>Comprehensive</b>"]:::report
        METRICS["/ais.report.metrics<br/><b>Outcome Metrics</b>"]:::report
        RETRO["/ais.report.retrospective<br/><b>Internal Retro</b>"]:::report
    end

    TRACKER --> STANDUP
    TRACKER --> STATUSRPT
    TRACKER --> PROJECT
    TRACKER --> METRICS
    TRACKER --> RETRO

    %% ── GitHub Sync ──
    GHSYNC["/ais.github.sync<br/><b>GitHub Sync</b><br/>Milestones ↔ Issues ↔ Labels"]:::sync
    IMPL --> GHSYNC

    %% ── Maintain ──
    CLARIFY["/ais.maintain.clarify<br/><b>Smart Clarify</b><br/>Replan from new context or resolve ambiguities"]:::maintain
    DEBUG["/ais.maintain.debug<br/><b>Root-Cause Debug</b><br/>Diagnose failures before fixing"]:::maintain
    CLARIFY -. "new context" .-> CTX
    CLARIFY -. "spec refinement" .-> SPECIFY
    IMPL -. "blocking failure" .-> DEBUG
    DEBUG -. "recovery task" .-> IMPL

    %% ── Artifacts ──
    subgraph ARTIFACTS ["📦 Output Artifacts"]
        direction LR
        PS["specs/.presales/"]
        PP["specs/.project-plan/"]
        AR["specs/.architecture/"]
        SP["specs/YYMM-NNN-feature/<br/>spec.md · design.md · implementation-plan.md · tasks.md"]
    end

    SCOPE --> PS
    PLAN --> PP
    ARCH --> AR
    IMPL --> SP

    %% ── Reports persist to files ──
    STANDUP -. "writes file" .-> PP
    STATUSRPT -. "writes file" .-> PP
    PROJECT -. "writes file" .-> PP
    METRICS -. "writes file" .-> PP
    RETRO -. "writes file" .-> PP
```

## Phases at a Glance

| Phase | Commands | Key Output |
|-------|----------|------------|
| **Pre-Sales** | `synthesize` -> `propose` -> `scope` | 01-what-we-heard, 02-proposal with proposed specs/ROM/staffing inputs, 03-sow with SOW family/model and readiness |
| **Setup** | `plan` → `architecture` → `constitution` | Project plan, C4 architecture, governance standards |
| **Spec Lifecycle** | optional `brainstorm` → `specify` → `design` → `tasks` → `implement` | Optional seed brief, feature spec, technical design, optional implementation plan, task list, working code |
| **Reporting** | `standup` · `status` · `project` · `metrics` · `retrospective` | Persisted reports in `specs/.project-plan/reports/` |
| **Sync** | `github.sync` | GitHub milestones, issues, and labels |
| **Maintain** | `clarify` · `debug` | Replanned context, refined specs, or failure diagnosis |

## Status Progression

Each spec lifecycle command updates the `status` field in spec.md frontmatter:

```
defining  →  planning  →  ready  →  in-dev  →  complete
```

Report commands derive live pipeline status from both frontmatter and git state.
