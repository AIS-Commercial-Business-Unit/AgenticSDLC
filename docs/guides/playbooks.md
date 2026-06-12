# Playbooks Guide

How to use and create domain-specific playbooks for different engagement types.

## What Playbooks Are

Playbooks capture reusable domain knowledge for specific project types.
They inform pre-sales proposals, delivery planning, and architecture
decisions with proven patterns, estimation heuristics, and risk profiles.

Playbooks own the project-type-specific parts of sizing: scoping questions,
effort drivers, complexity indicators, typical team shape, common phases, and
cost-model drivers. Framework-wide pre-sales docs own artifact boundaries,
confidence levels, green-sheet integration, compliance checks, external
commercial-review boundaries, and commitment rules.

Ops continuity is a cross-project playbook rather than a delivery technology
playbook. Use it alongside a domain playbook when a delivered solution needs
post-delivery support, enhancement governance, advisory reachback, or
project-to-operations handoff.

## Available Playbooks

See [`.specify/playbooks/README.md`](../../.specify/playbooks/README.md)
for the current list.

## How Playbooks Are Used

### During Pre-Sales

| Command | How Playbooks Help |
|---------|-------------------|
| `/ais.presales.synthesize` | Discovery questions inform what to extract from client materials |
| `/ais.presales.propose` | Proposed spec decomposition, tech approach, ROM estimation, engagement shape, staffing inputs, risk patterns |
| `/ais.presales.scope` | Deliverable structure, milestone patterns, staffing assumptions, quality gates |

### During Delivery

| Command | How Playbooks Help |
|---------|-------------------|
| `/ais.setup.plan` | Spec decomposition patterns, phasing guidance |
| `/ais.setup.architecture` | Architecture patterns, tech stack recommendations |
| `/ais.setup.constitution` | Domain-specific quality gates seed the constitution |

### Specifying a Playbook

Explicitly name the playbook when running a command:

```
/ais.presales.synthesize Use the agent-ai-builds playbook
/ais.setup.plan Reference data-platforms playbook for architecture patterns
```

If not specified, commands auto-detect the project type and load relevant
playbooks.

## Playbook Sections

Each playbook follows the template at `.specify/playbooks/_playbook-template.md`:

| Section | Purpose |
|---------|---------|
| **Overview** | What this project type involves, typical client, success definition |
| **Discovery Questions** | By theme (Business, Technical, Data, Operations) with phase tags |
| **Architecture Patterns** | Named patterns with diagrams, components, trade-offs |
| **Spec Decomposition** | Common specs with effort ranges and frequency |
| **Estimation Patterns** | Effort drivers, engagement shape, ROM ranges by complexity, multipliers, staffing guidance, role library, non-labor cost-model drivers |
| **Risk Patterns** | Domain-specific risks with mitigations |
| **Tech Stack** | Default and alternative recommendations by layer |
| **Quality Gates** | Domain-specific gates for the constitution |
| **Deliverable Checklist** | By phase: pre-sales, kickoff, per-spec, closeout |
| **Anti-Patterns** | Things to watch for and avoid |

Ops continuity playbooks may also include tier models, ticket taxonomy,
enhancement routing, offshore eligibility, HubSpot-ready summary text, and
handoff checklists because those are the reusable outputs for support
engagements.

## Creating a New Playbook

1. **Copy the template**:
   ```
   cp .specify/playbooks/_playbook-template.md .specify/playbooks/your-type.md
   ```

2. **Fill in every section** with domain-specific knowledge. Use concrete
   examples, real patterns, and honest trade-offs.

3. **Add Mermaid diagrams** for architecture patterns — these help proposals
   and architecture documents.

4. **Test it**: Run a pre-sales flow referencing your playbook. Does it
   produce better proposed specs, more realistic ROM, and relevant risks?

5. **Register it**: Add the playbook to the table in
   `.specify/playbooks/README.md`.

## Conventions

- **Advisory, not prescriptive**: Playbooks inform recommendations. They
  don't mandate specific choices.
- **Concrete over abstract**: Include specific technology names, hour ranges,
  and pattern names. Vague guidance isn't useful.
- **Honest trade-offs**: Every pattern has downsides. Document them.
- **T-shirt sizing**: Use S/M/L/XL consistent with spec effort fields.
- **Sizing traceability**: Tie estimates back to governing questions, scope
  drivers, complexity indicators, and assumptions.
- **Staffing guidance**: Describe typical role needs and allocation drivers,
  but leave rates, pricing, and profitability to external business review.
- **Tooling assumptions**: Capture when AI/coding-agent access, client tenant
  restrictions, or delivery-board choices materially change staffing.
- **Versioned**: Include version and last-updated date. Update when patterns
  change significantly.
