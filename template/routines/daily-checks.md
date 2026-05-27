---
name: Daily Checks
description: Checks for package updates and runs memory sync
schedule: "daily at 8am"
status: active
skills:
  - check-for-updates
  - check-integrations
  - memory-sync
created: 2026-05-27
modified: 2026-05-27
---

# Daily Checks

Runs every morning to keep the brain fresh:

1. **check-for-updates** — checks if a new version of differnet is available
2. **check-integrations** — pings integration health endpoints, scoped to your teams
3. **memory-sync** — synthesizes any new timeline entries in memory pages
