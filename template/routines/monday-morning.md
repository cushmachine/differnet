---
name: Monday Morning
description: Start-of-week automation chain — triage, summarize, and post
schedule: "30 8 * * 1"
status: draft
skills:
  - inbox-triage
  - weekly-summary
created: 2026-05-27
modified: 2026-05-27
---

# Monday Morning Routine

Runs three skills in sequence every Monday morning to prepare the team
for the week ahead.

## Chain

1. **inbox-triage** — Process any messages and notifications that came in
   over the weekend. Categorize by urgency.

2. **weekly-summary** — Aggregate the past week's activity from memory,
   routine logs, and connected systems into a digest.

3. Post the weekly summary to Slack (handled by the weekly-summary skill
   if SLACK_WEBHOOK_URL is configured).

## Prerequisites

- Daemon must be running (check dashboard for green status light)
- At least one communication integration configured in `vault/`
- Status must be changed from `draft` to `active` to enable execution
