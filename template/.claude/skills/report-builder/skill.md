---
name: Report Builder
description: Creates a new reporting skill from an example report — generates the skill, template, and schedule
owner: system
visibility: [all]
created: 2026-05-27
modified: 2026-05-27
triggers: []
secrets: []
---

# Report Builder

Help the user create a new reporting skill by starting from what they already have.

## Flow

### 1. Get an example
Ask: "Show me an example of the report you want to automate — paste it, link it,
or describe what it looks like."

If they paste a report, analyze its structure: sections, data points, formatting,
who it's for, how often it's produced.

### 2. Identify data sources
For each data point in the report, ask where it currently comes from:
- A system in `map/systems.yml`? Which one?
- Manual calculation? What's the formula?
- Someone's knowledge? This might need a memory page.

Check `vault/integrations/` to see what's already connected. If a needed
integration is missing, suggest running `/integration-connector` first.

### 3. Define the schedule
Ask:
- How often? (daily, weekly, monthly, ad-hoc)
- What day/time?
- Who receives it? (Slack channel, email, just saved as a file)

### 4. Generate the skill
Create a new skill directory in `.claude/skills/`:

```
.claude/skills/{report-name}/
  skill.md          # Instructions for generating the report
  context/
    template.md     # Report template based on their example
  output/
    .gitkeep        # Reports land here
```

The `skill.md` should include:
- YAML frontmatter with owner, team, schedule trigger, required secrets
- Step-by-step instructions for pulling each data point
- Reference to the template in `context/template.md`
- Output format and destination

### 5. Test run
Offer to do a dry run: execute the new skill once and show the output.
Let the user adjust the template or data sources before finalizing.

### 6. Set up the routine (optional)
If the report should run on a schedule, create or update a routine in
`routines/` that references the new skill.
