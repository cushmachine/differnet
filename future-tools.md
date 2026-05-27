# Future Tools

Tools and integrations worth revisiting as the project matures.

---

## Executor

**URL:** https://executor.sh
**Category:** Agent tool integration / unified gateway

Normalizes MCP, OpenAPI, and GraphQL tools into a single callable interface
with sandboxing, team credential sharing, and read-vs-destructive action hints.
MIT-licensed desktop app available (fully local, no data transmitted).

**Why it matters for Differnet:**
When the daemon needs to call external tools (Slack, Gmail, Linear, etc.)
independently of a Claude Code session, Executor could provide the normalized
tool interface and sandboxing — avoiding custom plumbing for each integration.

**When to revisit:**
When the daemon matures to the point where it executes tool calls on its own
rather than queuing them for Claude Code to run.

**Discovered:** 2026-05-27

---

## ActiveGraph

**URL:** https://activegraph.ai/
**Category:** Event-sourced state layer for long-running agents

Open-source (MIT, Python) framework by the BabyAGI creator. Treats an
append-only event log as the core substrate, projected into a live graph of
beliefs, tasks, evidence, and decisions. Supports fork/replay, reactive
behaviors that subscribe to graph events, and full lineage tracking.

**Why it matters for Differnet:**
Strong conceptual overlap — the daemon's sweep loop + activity log is a
simpler version of what ActiveGraph formalizes. The "behaviors subscribe to
graph events" pattern could inform how the sweep loop evolves. The lineage
model (trace every decision to its origin) is exactly what a company brain
needs for auditability.

**When to revisit:**
If a TypeScript port appears, or when the daemon's state management outgrows
flat-file activity logs and needs event-sourcing, diffing, or forking.

**Discovered:** 2026-05-27
