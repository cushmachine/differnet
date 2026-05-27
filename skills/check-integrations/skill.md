---
name: Check Integrations
description: Pings integration health endpoints and updates connection status, scoped to the user's teams
owner: system
visibility: [all]
created: 2026-05-27
modified: 2026-05-27
triggers:
  - schedule: "every 6 hours"
secrets: []
managed: true
---

# Check Integrations

Verify connectivity for each integration in `vault/integrations/`, scoped
to the current user's teams so we don't make unnecessary API calls.

## Process

### 1. Read user context
Read `settings.yml` for the user's teams. If no teams are set, check
all integrations.

### 2. Filter integrations
Read all `vault/integrations/*.yml` files. Only check integrations
where the `teams` field overlaps with the user's teams (or where
`teams` is empty, meaning it's shared).

Skip integrations that belong exclusively to other teams. For example,
if the user is on `operations`, don't ping the Linear API (engineering only).

### 3. Check each integration

For each relevant integration:

1. Read the `auth_secret` field to get the env var name
2. Read the secret value from `vault/.env`
3. If no secret value exists, set `status: unconfigured` and skip
4. If `health_endpoint` is defined, make a GET request with the
   appropriate auth header:
   - For Bearer tokens: `Authorization: Bearer {secret}`
   - For API keys: check if the service expects a header or query param
5. Evaluate the response:
   - 2xx → `status: connected`
   - 401/403 → `status: error` (credentials expired or invalid)
   - Timeout/network error → `status: error`

### 4. Write results back

For each checked integration, update the YAML file:
- Set `status:` to the result
- Set `last_checked:` to the current timestamp

Do NOT modify any other fields in the YAML.

### 5. Report

If any integration changed from `connected` to `error`, create an
inbox message at `inbox/{date}-integration-error.md`:

```markdown
---
status: unread
subject: "Integration error: {name}"
created: {timestamp}
---

{name} health check failed.

Endpoint: {health_endpoint}
Error: {error details}

To reconfigure, run `/integration-connector` in Claude Code.
```

## Notes

This skill is designed to run via the daemon every 6 hours. It can
also be run manually via `/check-integrations`.

The team scoping prevents unnecessary API calls — a supply chain
analyst's daemon won't ping engineering-only tools like Linear or
GitHub.
