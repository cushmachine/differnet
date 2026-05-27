# Differnet — Company Brain

This workspace is your company brain, powered by the `differnet` package.

## Quick start

- Run `/onboarding` to set up your company map, vault, and first memory pages
- Run `/report-builder` to create your first automated report
- Run `npx differnet dev` to view the dashboard at http://localhost:3000

## Directory structure

| Directory | Purpose | You edit? |
|-----------|---------|-----------|
| `.claude/skills/` | All skills — managed + your own | Yes (create new skills here) |
| `map/` | Company map — org, systems, counterparties, supply chain | Yes |
| `map/schemas/` | Validation schemas for map files | No (updated by `npx differnet update`) |
| `memory/` | Knowledge wiki — compiled truth + timeline | Yes |
| `routines/` | Scheduled automations | Yes |
| `vault/` | Secrets and integration configs | Yes |
| `data/` | SQLite database (daemon logs, activity) | No (managed by daemon) |

## Skills

Skills live in `.claude/skills/` for native `/skill-name` invocation.

Skills with `managed: true` in their frontmatter are maintained by the differnet
package. Don't edit these — your changes will be overwritten by `npx differnet update`.
Create your own skills alongside them.

### Skill frontmatter

```yaml
---
name: Skill Name
description: What this skill does
type: meta | skill
automation: full | assisted | documented
managed: true | false
owner: username
team: team-name
created: YYYY-MM-DD
modified: YYYY-MM-DD
triggers:
  - schedule: "cron or natural language"
secrets:
  - SECRET_NAME
tags: [tag1, tag2]
---
```

### Automation levels

Every process in the company should be a skill:
- **full** — Runs end-to-end without human intervention
- **assisted** — Agent guides, human acts on key steps
- **documented** — Runbook only; no automation yet

## Memory

Memory pages use two zones separated by `---`:
- **Above**: Compiled truth — synthesized summary (rewritten by `/memory-sync`)
- **Below**: Append-only timeline — raw observations with dates and sources

## Company map

YAML files in `map/` validated against `map/schemas/`. Edit the YAML, the
dashboard renders it. Run `/onboarding` to populate interactively.

## Updating

Run `npx differnet update` to get the latest managed skills and schemas
without touching your content.
