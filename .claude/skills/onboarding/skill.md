---
name: Onboarding
description: Walks a new user through setting up their company brain — populates map, vault, and first memory pages
type: meta
automation: assisted
owner: system
visibility: [all]
created: 2026-05-27
modified: 2026-05-27
triggers: []
secrets: []
managed: true
---

# Onboarding

Guide a new user through setting up their Differnet company brain. This is the
first skill most users will run. Aim for a conversational, low-pressure flow —
not a questionnaire.

## Philosophy

Prefer ingestion over interrogation. If the user has Gmail, calendar, or other
data sources connected, pull information from them rather than asking the user
to type everything manually. Ask clarifying questions about what you find, not
open-ended "tell me about your company" prompts.

## Steps

### 1. Company basics
Read `map/org.yml`. If it still has example data, ask the user:
- Company name and what they do (1-2 sentences)
- Rough headcount and team structure
- Who's running this setup (their name and role)

Update `map/org.yml` with their answers.

### 2. Team structure
Walk through each team:
- Team name, lead, and members
- What the team owns (areas of responsibility)
- What tools the team uses daily

Update `map/org.yml` with each team as you go. Validate against
`map/schemas/org.schema.json`.

### 3. Systems and tools
Ask what software and services the company uses. For each:
- Name, type (CRM, ERP, comms, etc.), who owns it
- What data lives there
- What it connects to

Update `map/systems.yml`. Note any fragile integrations in `note:` fields —
these are high-value automation targets.

### 4. Counterparties
Ask about key suppliers, vendors, customers, and partners:
- Names, types, primary contacts
- For suppliers: what they supply, lead times, payment terms, single-source risks
- For customers: segments and channels
- For vendors: contract renewal dates, monthly costs

Update `map/counterparties.yml`.

### 5. Supply chain (if applicable)
If the company sells physical products or has a supply chain:
- Key products/SKUs, bill of materials, margins
- Sales channels and fulfillment methods
- Inventory locations and reorder rules

Update `map/supply-chain.yml`. Skip this step for pure-software companies.

### 6. Vault setup
Ask which integrations they want to connect first. For each:
- Guide them to find their API key or set up an OAuth connection
- Store the credential in `vault/.env`
- Create an integration config in `vault/integrations/`

Suggest starting with Slack (for notifications) and one data source (email,
CRM, or project management).

### 7. First memory page
Create `memory/company-overview.md` from everything gathered:
- Compiled truth section above `---` summarizing the company
- Timeline entry below `---` noting the onboarding date and source

### 8. First routine
Suggest a weekly summary routine. If they agree:
- Create `routines/weekly-summary.md`
- Explain how the daemon will execute it once installed

### 9. Daemon installation
Check if Node.js is available. Guide through:
- `cd daemon && npm install`
- `npm run install:macos` (or Linux equivalent)
- Verify the dashboard shows a green status dot

## Validation checklist
After onboarding, verify:
- `map/org.yml` has real company data and validates against schema
- At least one memory page exists in `memory/`
- `vault/.env` has at least one secret configured
- Dashboard runs without errors (`npm run dev`)

## Tips
- Don't try to capture everything in one session. The brain compounds over time.
- If the user seems overwhelmed, stop after steps 1-3 and suggest they come back.
- Point out which meta-skills they can use next (e.g., `/report-builder` for their
  first custom report, `/process-documenter` to capture a workflow).
