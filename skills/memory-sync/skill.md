---
name: Memory Sync
description: Synthesizes timeline entries in memory pages into compiled truth sections
type: meta
automation: full
owner: system
visibility: [all]
created: 2026-05-27
modified: 2026-05-27
triggers:
  - schedule: "daily at midnight"
secrets: []
managed: true
---

# Memory Sync

Scan all memory pages and rewrite their compiled truth sections from timeline
evidence. This is the mechanism that makes the company brain compound over time.

## How it works

Memory pages in `memory/` have two zones separated by a standalone `---`:

- **Above**: Compiled truth — a synthesized, opinionated summary
- **Below**: Append-only timeline — raw observations with dates and sources

This skill rewrites the compiled truth from ALL timeline entries, not just new
ones. The synthesis should be:

- **Opinionated**: State what's true, not "some sources say X"
- **Actionable**: Highlight what matters for decision-making
- **Traceable**: Every claim should be supportable by a timeline entry

## Process

### 1. Find pages needing synthesis
Scan `memory/**/*.md`. For each page:
- Parse the YAML frontmatter for `last_synthesized` date
- Parse the timeline entries below `---`
- If any timeline entry is dated after `last_synthesized`, the page needs synthesis

### 2. Synthesize each page
For each page needing synthesis:
- Read all timeline entries (oldest to newest for narrative flow)
- Write a new compiled truth section that:
  - Summarizes who/what this entity is
  - States the current relationship or status
  - Highlights key facts, risks, or open items
  - Notes any contradictions or changes over time
- Preserve the timeline section unchanged (append-only)
- Update `last_synthesized` in frontmatter to today's date

### 3. Rebuild the graph
After synthesis, scan all memory pages for wikilinks (`[[path/slug]]`).
Build a JSON adjacency list at `memory/graph.json`:

```json
{
  "people/wei-zhang": {
    "links_to": ["companies/shenzhen-components", "meetings/2026-05-14-vendor-review"],
    "linked_from": ["companies/shenzhen-components"]
  }
}
```

Use simple regex to extract wikilinks — no LLM needed for this step.

### 4. Report
After sync, output a summary:
- How many pages were synthesized
- How many wikilinks were found
- Any pages with contradictory timeline entries (flag for human review)

## Running manually
Users can run `/memory-sync` at any time to force a synthesis pass.

## Running via daemon
The daemon evaluates this skill's trigger (`daily at midnight`) and executes
it automatically using the bundled local LLM.
