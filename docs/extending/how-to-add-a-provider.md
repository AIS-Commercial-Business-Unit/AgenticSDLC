# How to Add a New Work Management Provider

This guide walks through the process of adding a new work management provider to the AIS Agentic Engineering Framework.

The framework uses a **provider abstraction** so agents and playbooks work the same way regardless of whether the team uses GitHub Issues, Jira, Azure DevOps, or a custom system.

---

## Prerequisites

- You have reviewed the existing providers in `config/aispec.config.example.yaml` to understand the current provider interface.
- You have access to the target system's API documentation.
- You have determined the authentication mechanism (API token, OAuth, PAT, etc.).

---

## Step 1: Define the Provider Configuration Schema

Add your new provider's configuration block to `config/aispec.config.example.yaml` under `work_management`:

```yaml
work_management:
  provider: [your-provider-name]   # Add your provider as a valid value

  [your_provider_name]:             # snake_case of the provider name
    base_url: ""                    # API base URL
    [auth_field]: ""               # Authentication reference (secret name, not value)
    [provider_specific_field]: ""  # Any other required fields
```

Then update `framework/schemas/config.schema.json` to add your provider to:
1. The `provider` enum field (under `work_management.properties.provider`)
2. A new `[provider_name]` object under `work_management.properties`

---

## Step 2: Define the Provider Interface

All work management providers must support the same logical operations. Create a provider specification document at `docs/guides/providers/[provider-name].md` that maps these operations to the target system's API:

| Framework Operation | Description | Target API Endpoint |
|---|---|---|
| `create_work_item` | Create a task/issue/story | [API endpoint] |
| `update_work_item` | Update status, fields | [API endpoint] |
| `get_work_item` | Read a work item by ID | [API endpoint] |
| `list_work_items` | Query work items | [API endpoint] |
| `add_comment` | Add a comment to a work item | [API endpoint] |
| `close_work_item` | Mark as done/resolved | [API endpoint] |
| `link_work_items` | Create parent-child or dependency link | [API endpoint] |

Document the request/response shapes, authentication headers, and error handling for each operation.

---

## Step 3: Create the Provider Adapter Specification

Create `.specify/prompts/provider.[name].md` — a prompt that defines how an agent should interact with this provider.

The adapter specification should include:

```markdown
# [Provider Name] Work Management Adapter
<!-- Autonomy Level: L1 (Recommend) by default — writing work items requires L2+ approval -->

## Authentication

How to authenticate with [provider]:
[Authentication instructions — reference secret names, never actual values]

## Operation: Create Work Item

Input fields required:
- title: string
- description: string
- type: [epic|story|task|bug]
- labels: array
- assignee: string

API call:
[HTTP method, endpoint, request body shape]

Response handling:
[How to extract the created item ID from the response]

## Operation: Update Work Item

[Same pattern for each operation]

## Error Handling

| Error Code | Meaning | Handling |
|---|---|---|
| 401 | Authentication failed | Report config error, do not retry |
| 429 | Rate limited | Wait and retry (max 3 times) |
| 404 | Item not found | Report and stop |
```

---

## Step 4: Update the Config Validation

Extend `config/aispec.config.example.yaml` with a commented example for the new provider:

```yaml
# [Provider Name] provider — populate if provider = [provider-name]
[provider_name]:
  [field]: ""    # [description of field]
```

Update `framework/schemas/config.schema.json` to:
1. Add `"[provider-name]"` to the `provider` enum.
2. Add a `"[provider_name]"` object schema under `work_management.properties`.

---

## Step 5: Add Governance Controls

Creating work items is a mutating activity and must be governed.

Add a governance entry to `config/governance-registry.yaml`:

```yaml
- id: [provider-name]-create-work-item
  agent: workflow-coordinator
  step: Plan
  activity: "Create work item via [Provider Name]"
  max_autonomy: L2
  current_autonomy: L1
  risk_level: medium
  allowed_tools:
    - "[provider-api-tool]"
  prohibited_actions:
    - "create-work-items-without-approval"
    - "delete-work-items"
  required_inputs:
    - "approved-specification"
  required_evidence:
    - "work-item-creation-record"
  approval_requirements:
    - type: human
      approver_role: "[project-lead]"
      required: true
  status: Draft
```

---

## Step 6: Test the Provider

Test all required operations with a test project/board in the target system:

- [ ] Authentication works.
- [ ] `create_work_item` creates an item with the correct fields.
- [ ] `update_work_item` updates status correctly.
- [ ] `get_work_item` retrieves by ID.
- [ ] `list_work_items` returns filtered results.
- [ ] Error handling works for 401, 404, 429.
- [ ] Rate limiting is handled gracefully.

---

## Step 7: Document the Provider

Update `docs/extending/README.md` to reference the new provider guide.

Update `config/aispec.config.example.yaml` with a complete commented example for the new provider.

---

## Checklist

- [ ] Provider config schema extended in `config/aispec.config.example.yaml`
- [ ] Provider config schema added to `framework/schemas/config.schema.json`
- [ ] Provider adapter spec created at `.specify/prompts/provider.[name].md`
- [ ] Provider guide created at `docs/guides/providers/[name].md`
- [ ] Governance entries added to `config/governance-registry.yaml`
- [ ] Provider tested against target system
- [ ] `docs/extending/README.md` updated

---

*Part of the AIS Agentic Engineering Framework — Extension Guides.*
