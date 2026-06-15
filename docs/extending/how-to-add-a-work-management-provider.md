# How to Add a Work Management Provider (Phase 6+)

This guide focuses specifically on implementing a **live API adapter** for a new or stubbed work management provider in the AIS Agentic Engineering Framework.

> **Context:** The framework ships with GitHub Issues (fully implemented), Jira (config stub), and Azure DevOps (config stub). The config schemas and mock fallbacks for Jira and ADO already exist. This guide walks through activating live API calls for a stubbed provider, or adding a brand-new provider from scratch.

For the general provider extension process (schema, governance, prompts), see [how-to-add-a-provider.md](how-to-add-a-provider.md).

---

## Understanding the Current Provider Architecture

```
aispec.config.yaml
    └── work_management.provider: [github-issues | jira | azure-devops | mock]

Agent calls abstract operation:
    create_work_item(title, description, type, labels)

Provider router (Phase 6 implementation) checks config.provider:
    → github-issues:  calls GitHub Issues API (LIVE — implemented)
    → jira:           calls Jira REST API     (STUB → falls back to mock)
    → azure-devops:   calls ADO REST API      (STUB → falls back to mock)
    → mock:           writes to docs/mock-work-items.yaml
```

The abstraction means agents never call a provider API directly — they call a named operation, and the router dispatches to the correct adapter.

---

## Part A: Activating a Stubbed Provider (Jira or ADO)

If you are implementing the live API adapter for the existing Jira or Azure DevOps stubs:

### Step 1: Locate the Stub Configuration

The configuration schema already exists in `framework/schemas/config.schema.json`:
- `work_management.jira` — base_url, project_key, issue_type, auth_secret
- `work_management.azure_devops` — org, project, area_path, auth_secret

The example config is in `config/aispec.config.example.yaml`.

### Step 2: Define the Operation Mapping

Create `docs/guides/providers/[provider-name].md` documenting how each framework operation maps to the provider's API:

| Framework Operation | Jira REST API | ADO REST API |
|---------------------|---------------|--------------|
| `create_work_item` | `POST /rest/api/3/issue` | `POST /{org}/{project}/_apis/wit/workitems/${type}` |
| `update_work_item` | `PUT /rest/api/3/issue/{issueIdOrKey}` | `PATCH /{org}/{project}/_apis/wit/workitems/{id}` |
| `get_work_item` | `GET /rest/api/3/issue/{issueIdOrKey}` | `GET /{org}/{project}/_apis/wit/workitems/{id}` |
| `list_work_items` | `POST /rest/api/3/issue/picker` | `POST /{org}/{project}/_apis/wit/wiql/wiql` |
| `add_comment` | `POST /rest/api/3/issue/{issueIdOrKey}/comment` | `POST /{org}/{project}/_apis/wit/workitems/{id}/comments` |
| `close_work_item` | `PUT /rest/api/3/issue/{issueIdOrKey}/transitions` | `PATCH status field` |
| `link_work_items` | `POST /rest/api/3/issueLink` | `PATCH relations field` |

### Step 3: Create the Adapter Prompt

Create `.specify/prompts/provider.[name].md` defining how an agent should call this provider:

```markdown
# [Provider] Work Management Adapter
<!-- Autonomy Level: L2 — write operations require approval -->
<!-- AIS Specify Step: Plan -->

## Authentication

Retrieve the API token from the secret named in `config.work_management.[provider].auth_secret`.
Never log or display the token value.

## create_work_item

Input: { title, description, type, labels, assignee }

Request:
  Method: POST
  URL: [base_url]/[endpoint]
  Headers: Authorization: Bearer {token}, Content-Type: application/json
  Body: { [provider-specific field mapping] }

Response: Extract created item ID from response.[id_field].

## [... remaining operations ...]

## Error Handling
| Code | Action |
|------|--------|
| 401 | Log auth failure; do not retry; prompt for config check |
| 429 | Wait [provider retry-after header] seconds; retry max 3 times |
| 404 | Log "item not found"; stop; report to user |
```

### Step 4: Remove the Stub Fallback

In the provider router (Phase 6 implementation file), replace the mock fallback for this provider with the live adapter call.

### Step 5: Update the Claude YAML

Create `.specify/prompts/provider.[name].claude.yaml`:

```yaml
---
description: >
  [Provider] work management adapter. Implements create_work_item, update_work_item,
  get_work_item, list_work_items, add_comment, close_work_item, link_work_items.
  Reads auth secret from config — never commits secret values.
allowed_tools:
  - read_file
  - http_request
autonomy_level: L2
specify_step: Plan
---
```

---

## Part B: Adding a Brand-New Provider

For a provider not yet in the framework (e.g. Linear, Shortcut, ServiceNow):

### Step 1: Add to the Config Schema

In `framework/schemas/config.schema.json`, under `work_management.properties`:

1. Add the provider name to the `provider` enum
2. Add a new config block:

```json
"[provider_name]": {
  "type": "object",
  "description": "[Provider] configuration. STUB — requires Phase 6 implementation.",
  "additionalProperties": false,
  "properties": {
    "base_url": { "type": "string", "format": "uri" },
    "[key_fields]": { "type": "string" },
    "auth_secret": { "type": "string", "description": "Secret name, not value." }
  }
}
```

### Step 2: Add to the Work Management Selection Prompt

Update `.specify/prompts/brownfield.workmanagement.select.md`:
- Add a new provider section with status, what works, and config block
- Add to the decision questionnaire options
- Add to the recommendation logic

### Step 3–7: Follow the general provider guide

Continue from Step 2 in [how-to-add-a-provider.md](how-to-add-a-provider.md).

---

## Governance Entry for New Providers

All new live provider adapters must have a governance registry entry. Add to `config/governance-registry.yaml`:

```yaml
- id: [provider-name]-create-work-item
  agent: workflow-coordinator
  step: Plan
  activity: "Create work item via [Provider]"
  max_autonomy: L2
  current_autonomy: L1
  risk_level: medium
  allowed_tools:
    - http_request
  prohibited_actions:
    - "delete-work-items"
    - "bulk-delete-without-approval"
  required_inputs:
    - "approved-specification"
  approval_requirements:
    - type: human
      approver_role: project-lead
      required: true
  status: Active
```

---

## Checklist

### For activating a stub (Jira/ADO)
- [ ] Operation mapping documented in `docs/guides/providers/[name].md`
- [ ] Adapter prompt created at `.specify/prompts/provider.[name].md`
- [ ] Claude YAML created at `.specify/prompts/provider.[name].claude.yaml`
- [ ] Stub fallback removed from provider router
- [ ] Authentication tested against live sandbox
- [ ] All 7 operations tested (create, update, get, list, comment, close, link)
- [ ] Error handling verified for 401, 404, 429

### For adding a new provider
- [ ] All stub checklist items above
- [ ] Provider enum added to `framework/schemas/config.schema.json`
- [ ] Config block added to schema
- [ ] Config example added to `config/aispec.config.example.yaml`
- [ ] Work management selection prompt updated
- [ ] Governance registry entries added
- [ ] `docs/extending/README.md` updated
- [ ] Brownfield onboarding guide updated

---

*Part of the AIS Agentic Engineering Framework — Extension Guides.*
