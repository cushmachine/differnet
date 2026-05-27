---
name: RACI
description: Create or update the RACI matrix — define who is responsible, accountable, consulted, and informed for each decision type
owner: system
visibility: [all]
created: 2026-05-27
modified: 2026-05-27
triggers: []
secrets: []
managed: true
---

# RACI

Help the user define or update their RACI matrix in `map/raci.yml`.

## Context

Read `map/org.yml` to get the list of team members and their IDs. All
RACI assignments should use member IDs from org.yml so the dashboard
can resolve names.

## Flow

### Creating a new decision

Ask the user:
1. What's the decision? (e.g., "Hiring", "Vendor selection", "Budget approval")
2. Brief description of what this decision covers
3. Who is **Responsible**? (the person who does the work)
4. Who is **Accountable**? (the person who makes the final call — only one)
5. Who should be **Consulted**? (people whose input is sought before the decision)
6. Who should be **Informed**? (people who need to know after the decision is made)

Present the member list from `map/org.yml` and let the user pick by name.
Store the member ID in the YAML.

### Updating an existing decision

Read `map/raci.yml` and show the current matrix. Ask what the user wants
to change. Update the relevant fields.

### Validation

- Exactly one person should be Accountable per decision
- Responsible and Accountable can be the same person
- A person should not appear in both Consulted and Informed for the same decision
- All member IDs must exist in `map/org.yml`

### Output

Write the updated decision to `map/raci.yml`. The dashboard will render
it at /map/raci.
