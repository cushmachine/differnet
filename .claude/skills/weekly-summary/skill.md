---
name: Weekly Summary
description: Aggregates data from connected systems into a weekly ops digest
type: skill
automation: full
owner: system
visibility: [operations]
created: 2026-05-27
modified: 2026-05-27
triggers:
  - schedule: "every Monday at 9am"
secrets:
  - SLACK_WEBHOOK_URL
managed: true
---

# Weekly Summary

Generate a comprehensive weekly operations summary by pulling from all
available sources in the company brain.

## Data sources

Read from these locations (skip any that don't exist yet):

1. **Memory pages** (`memory/`) — scan for timeline entries from the past 7 days
2. **Routine run history** (`data/differnet.db`) — count successful/failed runs
3. **Org context** (`map/org.yml`) — team names for attribution
4. **Systems** (`map/systems.yml`) — check for any noted issues or data flow failures
5. **Supply chain** (`map/supply-chain.yml`) — flag any SKUs approaching reorder threshold
6. **Counterparties** (`map/counterparties.yml`) — flag contracts renewing within 30 days

## Output

Write to `output/weekly-summary-YYYY-MM-DD.md`:

```markdown
# Weekly Summary — {start_date} to {end_date}

## Highlights
- Top 3-5 things that happened this week (from memory timeline entries)

## By Team
### {Team Name}
- Key activities and outcomes from memory entries tagged to this team

## System Health
- Routine runs: X successful, Y failed
- Data flows: any noted issues from map/systems.yml
- Daemon uptime: based on heartbeat history

## Supply Chain
- Inventory alerts: SKUs approaching min_stock
- Upcoming reorders based on lead times

## Upcoming
- Vendor contract renewals in the next 30 days
- Scheduled routines for next week

## Action Items
- Items requiring attention, prioritized by urgency
```

## Distribution

If `SLACK_WEBHOOK_URL` is configured in `vault/.env`:
- Post a condensed version (highlights + action items only) to Slack
- Include a note that the full report is in `output/`

If Slack is not configured, just write the file and note this in the console.
