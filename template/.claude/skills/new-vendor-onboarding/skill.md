---
name: New Vendor Onboarding
description: Step-by-step process for onboarding a new vendor — from initial assessment to first PO
owner: system
visibility: [operations]
created: 2026-05-27
modified: 2026-05-27
triggers: []
secrets: []
---

# New Vendor Onboarding

Guided process for bringing a new vendor into the company's operations.
The agent handles documentation and system updates; the human handles
negotiations and legal review.

## Prerequisites
- Vendor name and primary contact
- Scope of services or goods
- Budget approval from relevant team lead

## Steps

### 1. Initial assessment (assisted)
Gather basic vendor information:
- Company name, primary contact, type of service/goods
- Estimated monthly spend
- Whether this is a new category or replacing an existing vendor

Check `map/counterparties.yml` for existing vendors of the same type.
Flag if this creates a single-source risk or resolves one.

### 2. Add to company map (full)
Add the vendor to `map/counterparties.yml` with:
- Name, type, contact, estimated costs
- Payment terms (once negotiated)
- Risk notes

### 3. Create memory page (full)
Create `memory/companies/{vendor-slug}.md` with:
- Compiled truth: what they do, why we're onboarding them
- First timeline entry noting the onboarding date and reason

### 4. Legal review (documented)
- [ ] Send NDA (human action)
- [ ] Receive signed NDA (human action)
- [ ] Review vendor's terms of service (human action)
- [ ] Execute master service agreement (human action)

Update the memory page timeline with each completed step.

### 5. Technical integration (assisted)
If the vendor has an API or system integration:
- Run `/integration-connector` to set up credentials
- Update `map/systems.yml` with the new system
- Test connectivity

### 6. Operational setup (assisted)
- [ ] Add vendor contacts to relevant Slack channels
- [ ] Set up monitoring/alerting if applicable (suggest `/alert-configurator`)
- [ ] Schedule kickoff meeting
- [ ] Create recurring check-in routine if needed

### 7. Completion (full)
Update the vendor's memory page with a compiled truth summary of the
relationship: what they provide, key contacts, terms, integration status.

Append a timeline entry marking onboarding as complete.
