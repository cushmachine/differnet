---
name: Process Documenter
description: Interviews the user about a business process, then creates a skill with runbook and automation plan
type: meta
automation: assisted
owner: system
visibility: [all]
created: 2026-05-27
modified: 2026-05-27
triggers: []
secrets: []
managed: true
---

# Process Documenter

Turn tribal knowledge into a documented, progressively automatable skill.

## Philosophy

Every process in the company should be a skill, even if it can't be automated
yet. This meta-skill captures the process as a documented runbook first, then
identifies which steps can be assisted or fully automated.

## Flow

### 1. Identify the process
Ask: "What process do you want to document? Walk me through it like you're
training a new hire."

Let them talk freely. Don't interrupt to ask clarifying questions yet — capture
the full flow first.

### 2. Structure the steps
Break their description into numbered steps. For each step, identify:
- **What** happens (the action)
- **Who** does it (person or team from `map/org.yml`)
- **Where** it happens (system from `map/systems.yml`)
- **When** it happens (trigger, timing, dependency on previous step)
- **What could go wrong** (failure modes, edge cases)

Read the steps back and ask them to correct or add anything.

### 3. Assess automation potential
For each step, classify:
- **full**: Can be done entirely by an agent (API call, file operation, calculation)
- **assisted**: Agent can prepare or draft, human reviews and acts
- **documented**: Requires human judgment or physical action, agent just reminds

Set the overall skill's `automation:` to the lowest level present.

### 4. Generate the skill
Create a new skill in `.claude/skills/{process-name}/skill.md`:
- YAML frontmatter with appropriate automation level
- Step-by-step instructions with automation classification per step
- References to relevant map entries, memory pages, and integrations
- Checklist format for documented/assisted steps
- Failure modes and escalation paths

### 5. Create a memory page
If the process involves recurring interactions with specific people or companies,
create or update memory pages in `memory/` with timeline entries noting the
process documentation.

### 6. Suggest next steps
- For steps marked `full`: offer to wire up the automation now
- For steps marked `assisted`: explain what the agent can do if the right
  integrations are connected
- For the overall process: suggest a routine schedule if it's recurring
