---
name: Edit Org
description: Update the org chart — add or remove team members, change roles, restructure teams
owner: system
visibility: [all]
created: 2026-05-27
modified: 2026-05-27
triggers: []
secrets: []
managed: true
---

# Edit Org

Help the user update the org chart in `map/org.yml`.

## Context

Read the current state of `map/org.yml` before making any changes.
Show the user what's there and ask what they want to change.

## Supported changes

### Add a team member
Ask for:
- Name
- ID (slug format, e.g., `jane-doe`)
- Role
- Which team they belong to
- Who they report to (must be an existing member ID)

Add them to the appropriate team's `members` array.

### Remove a team member
Show the current roster, let the user pick who to remove.
Check if anyone else `reports_to` this person — if so, ask who
should take over before removing.

Also check:
- `map/raci.yml` — reassign any RACI entries referencing this person
- `map/directory.yml` — no impact (directory uses team names, not individuals)

### Change a role or reporting line
Update the `role` or `reports_to` field for an existing member.

### Add a new team
Ask for:
- Team name
- Team lead (must be an existing member, or create one)
- What the team owns
- What tools they use

### Rename or restructure a team
Update the team's name, lead, `owns`, or `tools` fields.

## Validation

After changes:
- Every member must have a unique `id`
- Every `reports_to` value must reference an existing member ID or be null
- Every team must have a `lead` that exists in its `members` array
- Validate against `map/schemas/org.schema.json`

## Notes

After updating the org, suggest the user also review:
- RACI matrix (`/raci`) if responsibilities shifted
- Directory entries if team assignments changed
