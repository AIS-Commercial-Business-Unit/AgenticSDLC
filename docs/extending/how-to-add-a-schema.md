# How to Add a New JSON Schema

This guide walks through the process of adding a new JSON Schema to `framework/schemas/`.

Schemas in this directory validate YAML and JSON configuration files used by the framework. Adding a schema makes a new configuration artifact machine-validatable and self-documenting.

---

## Prerequisites

- You have a clear definition of the data structure you need to validate.
- The structure is not already covered by an existing schema in `framework/schemas/`.
- You have reviewed the existing schemas to understand conventions and reuse `$defs` where possible.

---

## Step 1: Identify the Schema

Determine:
- **What file(s) does this schema validate?** (e.g., `config/governance-registry.yaml`)
- **What is the top-level structure?** (object, array, etc.)
- **What are the required fields?**
- **What are the valid values for enumerated fields?**

---

## Step 2: Create the Schema File

Create `framework/schemas/[name].schema.json`.

Naming convention: `[what-it-validates].schema.json`

Examples:
- `config.schema.json` — validates `aispec.config.yaml`
- `governance-registry.schema.json` — validates `governance-registry.yaml`
- `agent-catalog.schema.json` — validates `agent-catalog.yaml`

---

## Step 3: Write the Schema

All schemas must use **JSON Schema 2020-12** (`$schema: "https://json-schema.org/draft/2020-12/schema"`).

Required top-level fields:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://ais.com/agentic-sdlc/framework/schemas/[name].schema.json",
  "title": "[Human-readable title]",
  "description": "[What this schema validates and where it is used.]",
  "type": "object",
  "required": ["[required-field-1]", "[required-field-2]"],
  "additionalProperties": false,
  "properties": {
    ...
  },
  "$defs": {
    ...
  }
}
```

Schema authoring guidelines:
- Use `"additionalProperties": false` on every object to prevent silent misconfiguration.
- Add a `"description"` to every property explaining its purpose and valid values.
- Use `"enum"` for fields with a fixed set of valid values.
- Use `"$defs"` for reusable sub-schemas (e.g., a `GovernanceEntry` reused in an array).
- Use `"format": "date-time"` or `"format": "date"` for timestamp fields.
- Use `["string", "null"]` for nullable string fields.
- Avoid `anyOf`/`oneOf` unless the structure genuinely requires polymorphism.

---

## Step 4: Set Up AJV Validation (If Using Node.js)

If the project uses AJV for validation, add the schema to the validation setup:

```javascript
// scripts/validate-config.js
const Ajv = require("ajv/dist/2020");
const ajv = new Ajv({ allErrors: true });

const schema = require("../framework/schemas/[name].schema.json");
const validate = ajv.compile(schema);

const data = /* load your YAML/JSON here */;
const valid = validate(data);
if (!valid) {
  console.error("Validation errors:", validate.errors);
  process.exit(1);
}
```

Install AJV if not already present:
```bash
npm install ajv
```

---

## Step 5: Write Schema Tests

Create `framework/schemas/tests/[name].schema.test.js` (or `.test.ts`).

Test cases must cover:

```javascript
describe("[name].schema.json", () => {
  it("validates a correct minimal document", () => {
    // Test with only required fields
  });

  it("validates a fully-populated document", () => {
    // Test with all fields
  });

  it("rejects a document missing a required field", () => {
    // Expect validation failure
  });

  it("rejects invalid enum values", () => {
    // Test each enum field with an invalid value
  });

  it("rejects additional properties", () => {
    // Test with an unknown field — should fail with additionalProperties: false
  });
});
```

---

## Step 6: Reference the Schema

Add a `$schema` reference in the YAML files this schema validates:

```yaml
# config/aispec.config.yaml
# $schema: framework/schemas/config.schema.json
framework:
  version: "1.0.0"
  ...
```

YAML files don't natively support `$schema`, so use a comment. Tools and IDE plugins can still use the reference for validation and autocomplete.

---

## Step 7: Document the Schema

Add a row to `docs/extending/README.md` if this is a new schema type.

Update any relevant configuration guides (e.g., `config/aispec.config.example.yaml`) to reference the schema.

---

## Checklist

- [ ] `framework/schemas/[name].schema.json` created
- [ ] Schema uses JSON Schema 2020-12
- [ ] All properties have `description` fields
- [ ] `additionalProperties: false` set on all objects
- [ ] Schema tests written and passing
- [ ] `$schema` comment added to validated YAML files
- [ ] `docs/extending/README.md` updated

---

*Part of the AIS Agentic Engineering Framework — Extension Guides.*
