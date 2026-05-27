---
name: Alert Configurator
description: Sets up monitoring alerts with conditions, thresholds, and notification channels
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

# Alert Configurator

Help the user set up a monitoring alert that watches for specific conditions and
notifies the right people.

## Flow

### 1. What to watch
Ask: "What do you want to be alerted about?"

Common patterns from `map/`:
- Inventory below reorder threshold (read `map/supply-chain.yml` reorder_rules)
- Vendor contract approaching renewal (read `map/counterparties.yml` contract_renewal)
- Data flow failures (read `map/systems.yml` data_flows)
- Metric anomalies (custom thresholds)

### 2. Define conditions
For each alert:
- Data source: which system or file provides the signal?
- Threshold: what value triggers the alert?
- Comparison: above, below, equals, changes, missing?
- Lookback window: check last hour? Last day?

### 3. Define response
- Who gets notified? (Slack channel, specific person, email)
- What severity? (info, warning, critical)
- What action should be taken? (escalate, auto-remediate, just log)

### 4. Generate the skill
Create a monitoring skill in `.claude/skills/`:
- Frontmatter with `triggers: [schedule: "every N hours"]`
- Instructions for checking the condition
- Notification logic using available integrations
- Escalation path if the condition persists

### 5. Connect to routine
Create or update a routine in `routines/` for the check interval.
Suggest grouping related alerts into a single routine that runs them
sequentially (e.g., all inventory alerts in one sweep).
