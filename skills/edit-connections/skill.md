---
name: Edit Connections
description: Map how your systems and counterparties connect to each other — add, update, or remove pairwise relationships
owner: system
visibility: [all]
created: 2026-05-27
modified: 2026-05-27
triggers: []
secrets: []
managed: true
---

# Edit Connections

Help the user document how entities in their directory connect to each other
by editing the `connections:` section of `map/directory.yml`.

## Context

Read `map/directory.yml` to get:
1. The list of entries (available slugs to reference)
2. The current connections

Show the user what's already documented and ask what they want to change.

## Adding a connection

Ask for:
1. **From** — which entity? Show the slug list and let them pick.
2. **To** — which entity does it connect to?
3. **Bidirectional?** — does data/material flow both ways? (e.g., Shopify ↔ ReturnBear)
   Set `bidirectional: true` if yes.
4. **Description** — what flows between them? Be specific:
   - What data or materials move
   - How often (real-time, hourly, daily, on-demand)
   - What method (API, native integration, manual, Zapier, etc.)
   - Any known issues

## Removing a connection

Show the current connections list. Let the user pick which to remove.

## Updating a connection

Show the current connection details. Ask what changed.
Common updates: frequency changed, method changed, added a note about
reliability issues.

## Validation

- Both `from` and `to` must be valid slugs from the `entries` section
- `from` and `to` must be different
- Don't create duplicate connections (same from/to pair)

## Suggestions

After editing, suggest related actions:
- If a new entity was referenced that doesn't exist in the directory,
  offer to add it (`/integration-connector`)
- If a connection was marked as fragile or unreliable, suggest creating
  an alert (`/alert-configurator`)
