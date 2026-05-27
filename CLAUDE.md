# Differnet — Company Brain Package

Open-source toolkit for building an AI-powered company brain. This repo is
the `differnet` npm package — the dashboard, daemon, CLI, managed skills,
and schemas.

## Repo structure

| Directory | Purpose |
|-----------|---------|
| `src/` | Dashboard (Next.js) — reads from user's content directory |
| `skills/` | Managed meta-skills (source of truth, synced to user's `.claude/skills/`) |
| `schemas/` | JSON Schema for map YAML validation |
| `template/` | Starter content scaffolded by `npx differnet init` |
| `bin/cli.js` | CLI — init, update, dev |
| `daemon/` | Local sweep daemon (WIP) |

## How it works

Users create their own content repo via `npx differnet init`. This copies:
- `template/` → their repo root (map YAMLs, memory, routines, vault)
- `skills/` → their `.claude/skills/` (with `managed: true` in frontmatter)
- `schemas/` → their `map/schemas/`

Users work from their content repo. `npx differnet dev` starts the dashboard
from this package, reading content from the user's directory via `DIFFERNET_ROOT`.

## Development

```bash
npm run dev                    # run dashboard locally (reads from CWD)
DIFFERNET_ROOT=/path/to/content npm run dev   # point at a content dir
```

## Updating user repos

`npx differnet update` re-syncs managed skills (those with `managed: true`)
and schemas. User-created skills (without `managed: true`) are never touched.
