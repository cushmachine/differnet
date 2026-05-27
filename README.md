# Differnet

**A shared mind for your company.**

Differnet is an open-source toolkit that turns your company's operations into AI workflows. You describe how your business works, and the system helps you automate it — one process at a time.

Most AI tools ask you to learn a new platform. Differnet works inside the tools you already use: Claude Code for building, and plain files for storage. There's no app to deploy. No database to manage. No cloud account to create.

One person can set it up in an afternoon. A team can join the next day. The whole company can be running on it by the end of the quarter.

## How it works

Differnet gives your AI assistant a model of your company — who works here, what tools you use, who your suppliers are, how your supply chain flows. Then it gives you a library of skills that know how to read that model and do useful work: generate reports, triage inboxes, reconcile data across systems, document processes.

The magic is in the **meta-skills** — skills that help you build new skills. Instead of writing code, you have a conversation:

> "I spend four hours every Monday building this report. Here's what it looks like."

The system asks you where the data comes from, how often you need it, and who should see it. Then it builds the skill and schedules it. Next Monday, it's done for you.

Your company brain gets smarter over time. Every interaction, every meeting note, every decision gets captured in a simple wiki format that compounds — raw observations at the bottom, synthesized knowledge at the top, always up to date.

## What you get

- **Free.** The whole thing. No trial, no feature gates, no "contact sales."
- **Open source.** Don't like how we built something? Fork it and take over. MIT license.
- **Low dependency.** No Docker. No Postgres. No Kubernetes. Just Node.js and Claude Desktop, which you probably already have.
- **Your data stays yours.** Everything lives as plain files on your machine. Markdown, YAML, SQLite. No data ever leaves your computer unless you tell it to.
- **Git-native.** Every change is diffable, auditable, and version-controlled. You can see exactly what changed, when, and why.
- **Updatable without pain.** New skills and bug fixes ship through npm. Your content is never touched. No merge conflicts.
- **Progressive automation.** Every process starts as documentation. Over time, steps get automated. You always see exactly which parts are human and which are machine.
- **One setup, many users.** Push your company brain to a shared repo. Anyone on your team can clone it and start building.

## Trade-offs we've made on purpose

Every tool makes choices. Here are ours, stated plainly so you can decide if they're right for you.

- **Transparent by default.** Your skills are visible to everyone in your org. We believe shared knowledge beats siloed knowledge. If you need access control, it starts with secrets scoping — who can use which API keys — not who can see which files.
- **Opinionated over flexible.** We ship a specific way to model your company: org chart, counterparties, systems, supply chain. You can change it, but we think this structure works for most teams. Rails over raw metal.
- **Claude-first.** The system works best with Claude. You can swap in other models, but we optimize for one. Depth over breadth.
- **Local-first.** Your brain runs on your machine, not in the cloud. This means someone needs a machine that stays on (or the daemon needs to be running). We'll offer a managed cloud version eventually, but the open-source version is proudly local.
- **Files over databases.** We chose markdown and YAML over a proper database. This makes everything readable and portable, but it means no real-time collaboration. Git is the sync layer, not WebSockets.
- **Composition over integration.** We don't try to replace your tools. We connect to them. This means you need API keys and integrations set up, but it also means Differnet never becomes a single point of failure.

## Getting started

```bash
npx differnet init my-company-brain
cd my-company-brain
```

Open Claude Code in that directory and run `/onboarding`. It'll walk you through mapping your company — your team, your tools, your suppliers, your processes. Takes about 30 minutes.

When you're ready to see it all visualized:

```bash
npx differnet dev
```

Open http://localhost:3000 and you'll see your company brain: an interactive dashboard, your skills library, an inbox of agent messages, routine schedules, and a vault for your secrets.

## What's inside

| Directory | What's in it | Who edits it |
|-----------|-------------|--------------|
| `.claude/skills/` | AI skills — the things your brain can do | You + us (managed skills update automatically) |
| `map/` | Your company model — org, systems, vendors, supply chain | You |
| `memory/` | Knowledge wiki — what your brain has learned over time | Your skills (automatically) |
| `inbox/` | Messages from your agent — alerts, completions, questions | Your daemon (automatically) |
| `routines/` | Scheduled automations | You |
| `vault/` | API keys and integration configs | You |

## Updating

```bash
npx differnet update
```

This pulls the latest managed skills and schemas from the package. Your content — your map, memory, routines, vault, and any skills you've created — is never touched.
