# Hello World: FocusFlow Demo

Build a personal Pomodoro timer from a one-page brief to working code.

---

## The Idea

**FocusFlow** — a personal focus timer. Start a pomodoro, tag it to a
project, and see where your focus time goes. Simple enough that the
framework takes it from requirements to running code in 7 commands.

---

## Setup

1. Clone this repo
2. Copy the project brief into your context folder — paste this into your
   agent, or just copy the files from `docs/getting-started/hello-world/context/`
   to `.project-context/` yourself:
   ```
   cp docs/getting-started/hello-world/context/project-brief.md .project-context/
   cp docs/getting-started/hello-world/context/tech-stack-starter.md .project-context/
   ```
3. Open your AI coding tool in the repo root

### Pick Your Stack

The brief is **tech-agnostic** — it describes what the app does, not how
to build it. The tech stack is a separate file you drop into
`.project-context/`.

The included [tech-stack-starter.md](context/tech-stack-starter.md)
recommends **React + Vite + TypeScript + localStorage** — one `npm run dev`
and you're running, no database or backend to set up.

Want something different? Replace the tech stack file with your own
preferences. The starter file includes examples for Python/Flask,
Go/HTMX, vanilla HTML/JS, and C#/Blazor. Or write your own — the
framework designs around whatever you specify.

---

## Run It

Seven commands, in order. Each one reads the output of the previous
steps automatically.

| Step | Command | What it does | Details |
|------|---------|-------------|---------|
| 1 | `/ais.setup.plan` | Decompose into specs | [details](prompts/1-setup-plan.md) |
| 2 | `/ais.setup.architecture` | C4 diagrams + tech stack | [details](prompts/2-setup-architecture.md) |
| 3 | `/ais.setup.constitution` | Quality gates + standards | [details](prompts/3-setup-constitution.md) |
| 4 | `/ais.spec.specify` | User stories + requirements | [details](prompts/4-spec-specify.md) |
| 5 | `/ais.spec.design` | Data model + project structure | [details](prompts/5-spec-design.md) |
| 6 | `/ais.spec.tasks` | Ordered task checklist | [details](prompts/6-spec-tasks.md) |
| 7 | `/ais.spec.implement` | Working code + tests | [details](prompts/7-spec-implement.md) |

Steps 1-3 run with no input. Step 4 requires input — you must tell it
what to specify (a spec name from the catalog or a feature description).
See the [prompt file](prompts/4-spec-specify.md) for what to provide.
Steps 5-7 run automatically from there.

### Where specs come from

The spec lifecycle is designed for iterative development. You don't need
to specify every feature upfront — run it again for each new piece of
work as development progresses and requirements evolve. The catalog gives
you a roadmap; the lifecycle lets you build incrementally.

Step 4 (`/ais.spec.specify`) is where you pick what to build. You have
two starting points:

1. **From the project plan.** Steps 1-3 produce spec directories under
   `specs/` — each with an initial `spec.md` containing scope, dependencies,
   and effort estimates. Pick the next spec and hand its description to the
   specify command.

2. **From a new idea.** Describe the feature yourself. The framework
   doesn't require a catalog entry — you can specify anything that fits
   the project.

When things change, `/ais.maintain.clarify` keeps the project current.
At the **project level**, feed it new context (a revised SOW, meeting
transcript, or a decision resolution) and it surgically updates the
project plan and architecture. At the **spec level**, run it on a feature
branch to resolve ambiguities and refine the spec through targeted
questions. See the [Step 4 prompt file](prompts/4-spec-specify.md) for
details.

Review the artifacts at each step before moving to the next. The prompt
files explain what to look for.

---

## What You End Up With

> **Spec IDs are date-derived.** The `YYMM` prefix reflects the current
> year-month when you run the command (e.g., `2603` for March 2026). Examples
> below use `YYMM` as a placeholder — your actual directories will have a
> concrete prefix like `2603-001-timer/`.

```
specs/
  .project-plan/          Charter, risks, context sources
  .architecture/          C4 diagrams, tech stack, ADRs
  YYMM-001-timer/
    spec.md               User stories + requirements
    design.md             Technical decisions
    implementation-plan.md Living plan for larger/riskier specs (optional)
    data-model.md         Persistence schema
    tasks.md              Every task checked off [x]
    research.md           Browser timer trade-offs
    contracts/            API contracts (if applicable)

source/                   Working Pomodoro timer app
tests/                    Tests that pass

specs/
  constitution.md         Project standards + quality gates
```

One brief in. Working app out. Full traceability at every layer.

---

## After the Demo

**Build the next spec.** Session Tagging depends on the Timer you just
built. Run the spec lifecycle again (`specify` → `design` → `tasks` →
`implement`) and watch it build on top of the existing code.

**Try a different stack.** Replace `tech-stack-starter.md` with Python
or Go preferences and start fresh. Same requirements, different
implementation. Compare the design decisions and output.

**Handle change at the project level.** Add a new requirement to the
brief ("add a daily goal — target number of sessions") and run
`/ais.maintain.clarify` with the updated file. It surgically updates the
project plan and architecture — adding catalog entries, resolving open
decisions, adjusting dependencies — without regenerating anything from
scratch.

**Refine a spec.** Switch to a feature branch and run
`/ais.maintain.clarify` to resolve ambiguities in that spec. It walks
through targeted clarification questions and integrates the answers
directly into the spec before you move to design.

---

## Files

```
docs/hello-world/
  README.md                     This file — the demo walkthrough
  context/
    project-brief.md            Requirements (tech-agnostic)
    tech-stack-starter.md       Default stack + alternatives
  prompts/
    1-setup-plan.md             Step 1: what to expect
    2-setup-architecture.md     Step 2: what to expect
    3-setup-constitution.md     Step 3: what to expect
    4-spec-specify.md           Step 4: what to expect + input prompt
    5-spec-design.md            Step 5: what to expect
    6-spec-tasks.md             Step 6: what to expect
    7-spec-implement.md         Step 7: what to expect
```
