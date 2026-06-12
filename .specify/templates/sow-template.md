# Statement of Work Template Router

Use this router before generating `specs/.presales/03-sow.md`. Do not output
this router as the SOW. Classify the opportunity, load the selected templates,
and generate one coherent Markdown SOW from the applicable sections.

---

## Classification Summary

| Field | Value |
|-------|-------|
| **Agreement Family** | End Customer Investment Funds (ECIF) / Client / Unknown |
| **Commercial Model** | FFP / Outcome-driven / Managed capacity / Time and materials / Unknown |
| **Engagement Funding** | Customer-funded / Microsoft-funded / Microsoft-program-funded / Unknown |
| **Ops Continuity Signal** | None / Base / Standard / Premium / Decision needed |
| **Classification Evidence** | [Files, sections, or stakeholder statements used] |
| **Open Decision** | [None or QC item required before final SOW] |

If agreement family or commercial model is unknown, carry the uncertainty into
the SOW as a visible QC item. Do not silently choose the wrong structure.

When post-delivery support, managed operations, advisory reachback, onboarding,
bug fixes, or enhancements are in scope, load
`.specify/playbooks/ops-continuity.md` and use
`.specify/templates/ops-service-offering-template.md` or
`.specify/templates/ops-playbook-template.md` as supporting structure. Keep the
generated SOW connector-neutral unless a connector implementation is separately
scoped.

---

## Agreement Family Selection

### Microsoft ECIF

Use `.specify/templates/sow/ecif-template.md` when the sources explicitly show
Microsoft ECIF structure or funding, including any of these signals:

- "ECIF Supplier Agreement", "ECIF", or Microsoft-funded supplier agreement
  language
- Microsoft as payer, funder, or agreement counterparty for services delivered
  to a named customer
- CAS, REQ, supplier agreement, proof-of-execution, or Microsoft milestone
  payment language
- A required milestone table with service description, amount, hours, and due
  date columns

Do not add a separate client commercial stub unless source material also asks
for a client-facing scope exhibit.

### Client SOW

Use `.specify/templates/sow/client-template.md` when the sources show direct
client contracting, MSA-backed SOW language, customer-funded delivery, or a
standard AIS client SOW pattern.

After loading the client SOW template, load exactly one commercial-model stub:

| Commercial Model | Use When | Template |
|------------------|----------|----------|
| FFP | Scope is fixed around named deliverables, phases, milestones, or a fixed fee | `.specify/templates/sow/commercial-ffp-template.md` |
| Outcome-driven | Commercial terms or delivery framing emphasize measurable business outcomes over effort | `.specify/templates/sow/commercial-outcome-template.md` |
| Managed capacity | Client is buying a named team, role capacity, throughput, or operating cadence | `.specify/templates/sow/commercial-managed-capacity-template.md` |
| Time and materials | Work is governed by roles, hours, burn, and rate-card reference | `.specify/templates/sow/commercial-time-and-materials-template.md` |
| Unknown | Signals conflict or are absent | Add a QC item and include a short "Commercial Model Decision Needed" section |

---

## Approved-Only Commercial Policy

- Do not invent rates, prices, payment terms, profitability, or customer cost
  values.
- For ECIF, keep the required milestone amount and hours columns, but
  populate values only from supplied or approved commercial inputs. Use
  `TBD - commercial approval required` when values are missing.
- For client SOWs, reference external pricing, green-sheet, rate-card,
  profitability, and payment artifacts by owner/status. Include amounts only
  when the user explicitly provides approved final SOW values.
- Staffing hours are planning inputs. They are not elapsed duration and they
  are not pricing by themselves.

---

## Output Rules

- Generate one SOW in the tone of delivered AIS SOWs: direct, contractual,
  delivery-focused, and specific about outcomes, responsibilities, acceptance,
  and exclusions.
- Include only core scope content. Do not generate legal boilerplate,
  signature blocks, Microsoft terms, audit terms, limitation of liability, or
  master agreement text.
- Preserve source-stated milestone dates, period-of-performance dates,
  acceptance periods, warranty/support windows, and funding dates. Mark missing
  values `TBD`.
- Make all classification uncertainty, commercial gaps, and SOW-readiness gaps
  visible as QC items.
