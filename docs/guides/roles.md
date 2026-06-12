# Role Mapping

Who does what at each stage of the AIS framework.

## Role × Phase Matrix

| Role | Pre-Sales | Setup | Specify | Design | Tasks | Implement | Reporting |
|------|-----------|-------|---------|--------|-------|-----------|-----------|
| **Account Exec / Sales** | Primary | Reviews plan | Reviews scope | — | — | — | Shares status with client |
| **Solutions Architect** | Technical discovery, ROM | Runs plan + arch | Complex specs | Reviews | — | — | Reviews technical status |
| **Project Manager** | Participates | Reviews plan, phases | Manages pipeline | Reviews estimates | Reviews | Tracks progress | Primary consumer, runs sync |
| **Business Analyst** | Gathers requirements | Validates plan | Primary driver of specify + UAT readiness | Reviews data model | Reviews coverage | Validates acceptance | Reviews completeness |
| **Technical Lead** | Supports SA | Runs architecture | Reviews feasibility | Runs design | Reviews sequencing | Code reviews | Reviews debt/risk |
| **Developers** | — | — | Reviews assigned spec | May research | Runs tasks | Runs implement | Updates via task completion |
| **QA / Test Lead** | — | — | Reviews testability + UAT scope | Reviews Verification Strategy | Validates verification coverage | Runs tests + reviews evidence | Reports QA/UAT status |
| **Client Stakeholders** | Provides requirements | Approves plan | Reviews specs at demos | Informed | Reviews UAT scenarios when needed | Reviews demos + UAT | Consumes status reports |

## Role Details

### Account Executive / Sales

**Primary in**: Pre-Sales
**Key commands**: Reviews output of `/ais.presales.synthesize`, `/ais.presales.propose`, `/ais.presales.scope`

The AE owns the client relationship. They drive discovery conversations,
validate that the what-we-heard document captures the client's intent, and
manage the proposal-to-SOW process. They don't run the commands directly
but review and refine the outputs.

### Solutions Architect

**Primary in**: Pre-Sales, Setup
**Key commands**: `/ais.presales.synthesize`, `/ais.presales.propose`, `/ais.setup.plan`, `/ais.setup.architecture`

The SA bridges business requirements and technical solutions. They lead
technical discovery, validate ROM estimates, and ensure the architecture
supports the proposed approach. They select and customize playbooks.

### Project Manager

**Primary in**: Setup, Reporting
**Key commands**: `/ais.report.standup`, `/ais.report.status`, `/ais.report.project`, `/ais.report.metrics`

The PM manages the spec pipeline — ensuring specs progress through the
lifecycle, dependencies are unblocked, and stakeholders have visibility.
They are the primary consumer of reporting commands and share status
reports with clients.

### Business Analyst

**Primary in**: Specify
**Key commands**: `/ais.spec.specify`, `/ais.maintain.clarify`

The BA translates business needs into structured specifications. They are
the primary driver of the specify phase, ensuring user stories are clear,
requirements are testable, and early QA/UAT readiness is captured without
turning the spec into a full test script. They validate that acceptance
criteria match business intent and can be traced to later evidence.

### Technical Lead

**Primary in**: Design, Architecture
**Key commands**: `/ais.spec.design`, `/ais.setup.architecture`, `/ais.setup.constitution`

The tech lead owns technical decisions. They run the design phase, establish
the constitution, and review task sequencing for technical correctness.
During implementation, they review code and ensure architectural alignment.

### Developers

**Primary in**: Tasks, Implement
**Key commands**: `/ais.spec.tasks`, `/ais.spec.implement`

Developers own individual specs through tasks and implementation. They
generate task breakdowns and execute them. Status updates happen
automatically as tasks are checked off.

### QA / Test Lead

**Primary in**: Specify, Design, Implement
**Key commands**: Reviews outputs of `/ais.spec.specify`, `/ais.spec.design`, `/ais.spec.tasks`

QA validates that specs are testable, UAT scope is explicit where needed,
designs include Verification Strategy, and task breakdowns have adequate
risk-based verification coverage. During implementation, they run or review
automated checks, perform manual/exploratory validation when applicable, confirm
QA status, and make sure deferred or retired test items have owner and rationale.

### Client Stakeholders

**Primary in**: Pre-Sales, Setup (approval)
**Key commands**: Consumes `/ais.report.status`

Clients provide requirements, review proposals, approve plans, and consume
status reports. They participate in spec review demos, own UAT acceptance for
business-critical workflows when assigned, and validate that deliverables meet
acceptance criteria.
