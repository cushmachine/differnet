import type { Agent } from "@/types";

export const agents: Record<string, Agent[]> = {
  startups: [
    {
      id: "a1", name: "Deal Analyst", role: "Screens inbound deals and generates summaries", status: "Online",
      costs: [
        { model: "Claude 3.5 Sonnet", tokens: "1.2M", cost: "$18.00" },
        { model: "GPT-4o", tokens: "450K", cost: "$6.75" },
      ],
      server: "us-east-1 · t3.medium",
      vaultAccess: ["OpenAI", "Anthropic", "Pinecone"],
    },
    {
      id: "a2", name: "Memo Writer", role: "Drafts investment memos from DD materials", status: "Online",
      costs: [
        { model: "Claude 3.5 Sonnet", tokens: "890K", cost: "$13.35" },
      ],
      server: "us-east-1 · t3.medium",
      vaultAccess: ["OpenAI", "Anthropic"],
    },
    {
      id: "a3", name: "LP Reporter", role: "Generates quarterly LP updates and reports", status: "Offline",
      costs: [
        { model: "Claude 3.5 Sonnet", tokens: "340K", cost: "$5.10" },
        { model: "GPT-4o", tokens: "120K", cost: "$1.80" },
      ],
      server: "us-west-2 · t3.small",
      vaultAccess: ["Anthropic", "SendGrid"],
    },
    {
      id: "a4", name: "Outreach Agent", role: "Sends intro emails and follow-ups", status: "Busy",
      costs: [
        { model: "GPT-4o-mini", tokens: "2.1M", cost: "$3.15" },
      ],
      server: "us-east-1 · t3.micro",
      vaultAccess: ["SendGrid"],
    },
    {
      id: "a5", name: "CRM Sync", role: "Keeps Airtable CRM updated from email/calendar", status: "Online",
      costs: [
        { model: "GPT-4o-mini", tokens: "890K", cost: "$1.34" },
      ],
      server: "us-east-1 · t3.micro",
      vaultAccess: ["Airtable"],
    },
  ],
  collider: [
    {
      id: "a10", name: "Data Pipeline", role: "Processes raw detector data into analysis-ready formats", status: "Busy",
      costs: [
        { model: "Claude 3.5 Sonnet", tokens: "5.4M", cost: "$81.00" },
      ],
      server: "eu-west-1 · c5.4xlarge",
      vaultAccess: ["AWS S3"],
    },
    {
      id: "a11", name: "Analysis Agent", role: "Runs statistical analysis on processed collision data", status: "Online",
      costs: [
        { model: "Claude 3.5 Sonnet", tokens: "3.2M", cost: "$48.00" },
        { model: "GPT-4o", tokens: "1.1M", cost: "$16.50" },
      ],
      server: "eu-west-1 · c5.2xlarge",
      vaultAccess: ["Anthropic", "AWS S3"],
    },
    {
      id: "a12", name: "Monitor Agent", role: "Tracks detector health and beam conditions", status: "Online",
      costs: [
        { model: "GPT-4o-mini", tokens: "8.9M", cost: "$13.35" },
      ],
      server: "eu-west-1 · t3.small",
      vaultAccess: ["Grafana"],
    },
    {
      id: "a13", name: "Alert Agent", role: "Sends real-time alerts on anomalies and system issues", status: "Online",
      costs: [
        { model: "GPT-4o-mini", tokens: "1.5M", cost: "$2.25" },
      ],
      server: "eu-west-1 · t3.micro",
      vaultAccess: ["Slack", "Grafana"],
    },
  ],
};
