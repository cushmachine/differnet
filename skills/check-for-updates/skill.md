---
name: Check for Updates
description: Checks if a new version of the differnet package is available and notifies via inbox
owner: system
visibility: [all]
created: 2026-05-27
modified: 2026-05-27
triggers:
  - schedule: "daily at 8am"
secrets: []
managed: true
---

# Check for Updates

Check if a newer version of the `differnet` package is available and
dispatch an inbox message if so.

## Process

1. Run `npm outdated differnet --json` in the content directory
2. If the current version differs from the latest, create an inbox message

## Inbox message

Write to `inbox/{date}-update-available.md`:

```markdown
---
status: unread
subject: "Differnet update available: v{current} → v{latest}"
created: {timestamp}
---

A new version of differnet is available.

Current: v{current}
Latest: v{latest}

To update, run:

```
npx differnet update
```

This will sync managed skills and schemas. Your content is never touched.
```

3. If already on the latest version, do nothing (no inbox message).

## Notes

This skill is designed to be run by the daemon on a daily schedule.
It can also be run manually via `/check-for-updates`.
