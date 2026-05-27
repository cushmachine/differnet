---
name: Integration Connector
description: Guides setup of a new integration — API keys, OAuth, webhooks — and stores config in vault
owner: system
visibility: [all]
created: 2026-05-27
modified: 2026-05-27
triggers: []
secrets: []
managed: true
---

# Integration Connector

Help the user connect a new external system to their company brain.

## Flow

### 1. Identify the system
Ask what they want to connect. Check `map/systems.yml` to see if it's already
documented. If not, add it.

Common integrations:
- **Slack** — notifications, chatbot interaction
- **Gmail/Google Workspace** — email ingestion, calendar sync
- **Linear** — project/issue tracking
- **HubSpot** — CRM data
- **GitHub** — repository activity
- **Stripe** — payment data
- **Custom API** — any REST/GraphQL endpoint

### 2. Determine auth method
- **API key**: simplest. User provides a key, we store it.
- **OAuth**: guide through the flow (redirect URL, scopes, token storage).
- **Webhook**: provide a URL for the external system to post to.

### 3. Store credentials
- Add the secret to `vault/.env` with a descriptive name
- Add the name to `vault/.env.example` (without the value)
- Create `vault/integrations/{system-name}.yml`:

```yaml
name: System Name
auth_secret: SECRET_NAME_IN_ENV
base_url: https://api.example.com
scopes: [read, write]
rate_limit: 100/minute
owner: team-name
connected_at: 2026-05-27
```

### 4. Test the connection
Make a simple read request to verify the credentials work.
Report what data is accessible.

### 5. Update the map
Add or update the system entry in `map/systems.yml` with:
- Integration status
- Available data types
- Connections to other systems

### 6. Suggest skills
Based on what data the integration exposes, suggest skills that could use it:
- Email integration → inbox-triage skill
- CRM integration → deal-update reporting
- Project management → sprint/cycle summaries

Point the user to `/report-builder` or `/alert-configurator` to create
skills that use the new integration.
