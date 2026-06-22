# Governance Summary Grid

> Generated: 2026-06-22 07:58:10 UTC  
> Registry: `framework/templates/governance-registry.yaml`  
> Total entries: **29** | ⚠️ Overdue: **0** | 🔔 Due soon: **0** | ✅ Healthy: **29**

## Legend

| Indicator | Meaning |
|---|---|
| ⚠️ | Review is **overdue** — `review_due_at` is in the past |
| 🔔 | Review is **due within 30 days** |
| _(none)_ | Review is current |

## Activity Grid

| Agent | AIS Step | Activity | Max Autonomy | Risk | Approval Required | Review Date |
|---|---|---|---|---|---|---|
| `brownfield-assessor-agent` | Intake | Assess Repository Readiness | **L0** | 🟢 low | none | 2026-09-12 |
| `modernization-agent` | Intake | Analyze Legacy Codebase | **L0** | 🟢 low | none | 2026-09-12 |
| `specification-agent` | Intake | Parse Requirements Document | **L2** | 🟢 low | product-owner | 2026-09-12 |
| `architecture-agent` | Specify | Author Architecture Decision Record | **L1** | 🟡 medium | solution-architect | 2026-09-12 |
| `specification-agent` | Specify | Generate Structured Specification | **L2** | 🟡 medium | product-owner | 2026-09-12 |
| `architecture-agent` | Design | Define Service Boundaries | **L1** | 🟠 high | solution-architect | 2026-09-12 |
| `architecture-agent` | Design | Review API Contracts | **L1** | 🟡 medium | tech-lead | 2026-09-12 |
| `integration-developer-agent` | Design | Define Integration Contract | **L1** | 🟠 high | solution-architect, tech-lead | 2026-09-12 |
| `modernization-agent` | Design | Produce Migration Plan | **L1** | 🟠 high | solution-architect | 2026-09-12 |
| `planning-agent` | Plan | Decompose Specification into Work Items | **L2** | 🟢 low | tech-lead | 2026-09-12 |
| `planning-agent` | Plan | Estimate Effort for Work Items | **L1** | 🟢 low | tech-lead | 2026-09-12 |
| `workflow-coordinator-agent` | Plan | Route Work Item to Agent | **L2** | 🟢 low | none | 2026-09-12 |
| `backend-developer-agent` | Implement | Implement REST API Endpoint | **L2** | 🟡 medium | tech-lead | 2026-09-12 |
| `backend-developer-agent` | Implement | Implement Data Model | **L2** | 🟡 medium | tech-lead | 2026-09-12 |
| `backend-developer-agent` | Implement | Routine Code Refactor | **L3** | 🟢 low | tech-lead | 2026-09-12 |
| `frontend-developer-agent` | Implement | Implement React Component | **L2** | 🟢 low | tech-lead | 2026-09-12 |
| `integration-developer-agent` | Implement | Build Integration Adapter | **L2** | 🟠 high | tech-lead, schema-validation-check | 2026-09-12 |
| `scribe-governance-agent` | Implement | Write Audit Event to Trail | **L3** | 🟢 low | none | 2026-09-12 |
| `code-reviewer-agent` | Verify | Review PR for Framework Patterns | **L1** | 🟢 low | tech-lead | 2026-09-12 |
| `qa-tester-agent` | Verify | Author Test Plan | **L2** | 🟢 low | tech-lead | 2026-09-12 |
| `qa-tester-agent` | Verify | Execute Integration Test Suite | **L3** | 🟡 medium | tech-lead | 2026-09-12 |
| `security-agent` | Verify | Scan for Vulnerabilities | **L1** | 🔴 critical | security-team | 2026-09-12 |
| `devops-platform-agent` | Deploy | Generate Kubernetes Manifests | **L2** | 🟠 high | devops-lead | 2026-09-12 |
| `devops-platform-agent` | Deploy | Deploy to Non-Production Environment | **L3** | 🟠 high | devops-lead | 2026-09-12 |
| `security-agent` | Deploy | Assess Deployment Secrets and Configuration | **L1** | 🔴 critical | security-team, devops-lead | 2026-09-12 |
| `finops-agent` | Report | Collect AI Token Usage Metrics | **L0** | 🟢 low | none | 2026-09-12 |
| `scribe-governance-agent` | Report | Merge Governance Decision Inbox | **L3** | 🟡 medium | tech-lead | 2026-09-12 |
| `experiment-runner-agent` | Learn | Execute Experiment Charter | **L2** | 🟡 medium | tech-lead | 2026-09-12 |
| `finops-agent` | Learn | Generate Cost Optimization Report | **L1** | 🟢 low | none | 2026-09-12 |

## Entries by AIS Step

### Intake (3 entries)

| Agent | Activity | Max Autonomy | Risk | Status |
|---|---|---|---|---|
| `brownfield-assessor-agent` | Assess Repository Readiness | **L0** | 🟢 low | ✅ Approved |
| `modernization-agent` | Analyze Legacy Codebase | **L0** | 🟢 low | ✅ Approved |
| `specification-agent` | Parse Requirements Document | **L2** | 🟢 low | ✅ Approved |

### Specify (2 entries)

| Agent | Activity | Max Autonomy | Risk | Status |
|---|---|---|---|---|
| `architecture-agent` | Author Architecture Decision Record | **L1** | 🟡 medium | ✅ Approved |
| `specification-agent` | Generate Structured Specification | **L2** | 🟡 medium | ✅ Approved |

### Design (4 entries)

| Agent | Activity | Max Autonomy | Risk | Status |
|---|---|---|---|---|
| `architecture-agent` | Define Service Boundaries | **L1** | 🟠 high | ✅ Approved |
| `architecture-agent` | Review API Contracts | **L1** | 🟡 medium | ✅ Approved |
| `integration-developer-agent` | Define Integration Contract | **L1** | 🟠 high | ✅ Approved |
| `modernization-agent` | Produce Migration Plan | **L1** | 🟠 high | ✅ Approved |

### Plan (3 entries)

| Agent | Activity | Max Autonomy | Risk | Status |
|---|---|---|---|---|
| `planning-agent` | Decompose Specification into Work Items | **L2** | 🟢 low | ✅ Approved |
| `planning-agent` | Estimate Effort for Work Items | **L1** | 🟢 low | ✅ Approved |
| `workflow-coordinator-agent` | Route Work Item to Agent | **L2** | 🟢 low | ✅ Approved |

### Implement (6 entries)

| Agent | Activity | Max Autonomy | Risk | Status |
|---|---|---|---|---|
| `backend-developer-agent` | Implement REST API Endpoint | **L2** | 🟡 medium | ✅ Approved |
| `backend-developer-agent` | Implement Data Model | **L2** | 🟡 medium | ✅ Approved |
| `backend-developer-agent` | Routine Code Refactor | **L3** | 🟢 low | 📝 Draft |
| `frontend-developer-agent` | Implement React Component | **L2** | 🟢 low | ✅ Approved |
| `integration-developer-agent` | Build Integration Adapter | **L2** | 🟠 high | ✅ Approved |
| `scribe-governance-agent` | Write Audit Event to Trail | **L3** | 🟢 low | ✅ Approved |

### Verify (4 entries)

| Agent | Activity | Max Autonomy | Risk | Status |
|---|---|---|---|---|
| `code-reviewer-agent` | Review PR for Framework Patterns | **L1** | 🟢 low | ✅ Approved |
| `qa-tester-agent` | Author Test Plan | **L2** | 🟢 low | ✅ Approved |
| `qa-tester-agent` | Execute Integration Test Suite | **L3** | 🟡 medium | ✅ Approved |
| `security-agent` | Scan for Vulnerabilities | **L1** | 🔴 critical | ✅ Approved |

### Deploy (3 entries)

| Agent | Activity | Max Autonomy | Risk | Status |
|---|---|---|---|---|
| `devops-platform-agent` | Generate Kubernetes Manifests | **L2** | 🟠 high | ✅ Approved |
| `devops-platform-agent` | Deploy to Non-Production Environment | **L3** | 🟠 high | 📝 Draft |
| `security-agent` | Assess Deployment Secrets and Configuration | **L1** | 🔴 critical | ✅ Approved |

### Report (2 entries)

| Agent | Activity | Max Autonomy | Risk | Status |
|---|---|---|---|---|
| `finops-agent` | Collect AI Token Usage Metrics | **L0** | 🟢 low | ✅ Approved |
| `scribe-governance-agent` | Merge Governance Decision Inbox | **L3** | 🟡 medium | 📝 Draft |

### Learn (2 entries)

| Agent | Activity | Max Autonomy | Risk | Status |
|---|---|---|---|---|
| `experiment-runner-agent` | Execute Experiment Charter | **L2** | 🟡 medium | ✅ Approved |
| `finops-agent` | Generate Cost Optimization Report | **L1** | 🟢 low | ✅ Approved |

---

_This file is auto-generated by `node scripts/generate-governance-grid.mjs`. Do not edit manually._
