---
name: Data Reconciler
description: Cross-references data across systems and the company map to find inconsistencies
type: skill
automation: full
owner: system
visibility: [operations]
created: 2026-05-27
modified: 2026-05-27
triggers:
  - schedule: "daily at 6am"
secrets: []
managed: true
---

# Data Reconciler

Cross-reference data across the company brain's various sources to find
inconsistencies, stale information, and data quality issues.

## What it checks

### Map consistency
- Do all team members in `map/org.yml` have valid `reports_to` references?
- Do all systems in `map/systems.yml` have an owner that exists in `map/org.yml`?
- Do all suppliers in `map/counterparties.yml` that are referenced in
  `map/supply-chain.yml` BOM entries actually exist?
- Are `integrates_with` references in `map/systems.yml` bidirectional?

### Memory freshness
- Are there memory pages with no timeline entries in the last 90 days? (stale)
- Are there counterparties in the map with no corresponding memory page? (gap)
- Do wikilinks in memory pages point to pages that exist?

### Vault health
- Are there secrets in `vault/.env.example` with no corresponding value in
  `vault/.env`? (unconfigured)
- Are there integration configs in `vault/integrations/` referencing secrets
  that don't exist in `.env`?
- Are there contract renewals in `map/counterparties.yml` within 30 days?

### Skill integrity
- Do all skills in `.claude/skills/` have valid YAML frontmatter?
- Do skills reference secrets that exist in `vault/.env.example`?
- Are there skills with `triggers:` that have no corresponding routine?

## Output

Write to `output/reconciliation-YYYY-MM-DD.md`:

```markdown
# Data Reconciliation — {date}

## Issues Found: {count}

### Critical (data integrity)
- {description} — {file}:{field}

### Warnings (stale or incomplete)
- {description}

### Info (suggestions)
- {description}
```

## Resolution

For each issue, suggest a fix:
- Map inconsistencies: propose the edit
- Missing memory pages: offer to create stubs
- Stale data: flag for human review
- Vault gaps: suggest running `/integration-connector`
