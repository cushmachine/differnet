---
name: Inbox Triage
description: Reviews incoming items from connected sources and categorizes by urgency and action required
type: skill
automation: assisted
owner: system
visibility: [operations]
created: 2026-05-27
modified: 2026-05-27
triggers:
  - schedule: "every 2 hours during business hours"
secrets:
  - SLACK_BOT_TOKEN
managed: true
---

# Inbox Triage

Review incoming messages, notifications, and requests from connected systems.
Categorize by urgency, draft responses for routine items, and flag items
needing human attention.

## Prerequisites

At least one communication integration must be configured in `vault/integrations/`
(e.g., Slack, email). Run `/integration-connector` to set one up.

## Process

### 1. Collect incoming items
Pull unprocessed items from connected sources:
- Slack mentions and DMs (if SLACK_BOT_TOKEN configured)
- Email threads (if email integration configured)
- Notifications from other integrations

### 2. Classify each item
For each item, determine:

**Urgency:**
- `critical` — Requires immediate action (outage, angry customer, deadline today)
- `high` — Needs attention today (decision needed, blocking someone)
- `normal` — Can be handled this week (routine request, FYI)
- `low` — Informational only (newsletter, automated notification)

**Action type:**
- `respond` — Needs a reply drafted
- `decide` — Requires a decision from someone in `map/org.yml`
- `delegate` — Should be forwarded to the right team/person
- `file` — Should be captured in memory or map, no reply needed
- `ignore` — No action needed

### 3. Process by category
- **respond**: Draft a response for human review. Don't send automatically.
- **decide**: Summarize the decision needed and who should make it (reference `map/org.yml`).
- **delegate**: Identify the right person/team and draft a forwarding note.
- **file**: Create or update memory pages with relevant information.
- **ignore**: Log but take no action.

### 4. Output
Write triage results to `output/triage-YYYY-MM-DD-HHMM.md`:
- Items grouped by urgency
- Draft responses for review
- Decisions needed with context
- Items filed to memory (with links)

### 5. Notify
If Slack is connected, post a summary to the configured channel:
- Count of items by urgency
- Any critical items requiring immediate attention
