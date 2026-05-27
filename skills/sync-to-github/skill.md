---
name: Sync to GitHub
description: Commits and pushes all changes to the remote repository, dispatches inbox message on failure
type: skill
automation: full
owner: system
visibility: [all]
created: 2026-05-27
modified: 2026-05-27
triggers:
  - schedule: "every 30 minutes"
secrets: []
managed: true
---

# Sync to GitHub

Commit all changes in the content directory and push to the remote
repository. If anything goes wrong, dispatch an inbox message.

## Process

1. Check `git status` for changes
2. If no changes, exit silently
3. Stage all changes: `git add -A`
4. Generate a commit message summarizing what changed:
   - Count of modified files by directory (map/, memory/, routines/, etc.)
   - Example: "sync: 2 memory pages, 1 routine updated"
5. Commit: `git commit -m "{message}"`
6. Push: `git push`

## On failure

If any git operation fails, write to `inbox/{date}-sync-failed.md`:

```markdown
---
status: unread
subject: "GitHub sync failed"
created: {timestamp}
---

The automatic sync to GitHub failed.

Error: {error message}

This usually means:
- No remote configured (`git remote add origin <url>`)
- Authentication expired (re-run `git credential approve`)
- Merge conflict (resolve manually, then run `/sync-to-github`)
```

## Notes

This skill runs via the daemon every 30 minutes. The daemon uses the
bundled local LLM for the commit message generation.

It can also be triggered manually from the dashboard sync button or
by running `/sync-to-github` in Claude Code.
