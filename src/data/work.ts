import type {
  WorkItem,
  RoadmapSection,
  WorkerStatus,
  CalendarEvent,
} from "@/types";

export const workItems: Record<string, WorkItem[]> = {
  startups: [
    {
      id: "w1",
      agentName: "Taskmaster Dave",
      type: "taskmaster",
      subject: "Subject",
      context: "Context",
      urgency: "warning",
      detail: {
        heading: "Taskmaster Dave",
        blocks: [
          { kind: "text", value: "You got this email from Georgia:" },
          { kind: "italic", value: "Hey ___, how are you?" },
          { kind: "italic", value: "Need to talk today, what time's good?" },
          { kind: "text", value: "Here's my pre-drafted response:" },
          { kind: "italic", value: "Hey Georgia how about 2 PM PT?" },
        ],
        draftResponse: "Hey Georgia how about 2 PM PT?",
        sendLabel: "Send this",
      },
    },
    {
      id: "w2",
      agentName: "Worker Connie",
      type: "worker",
      subject: "New feature",
      urgency: "none",
      status: "Ready for merge",
      detail: {
        heading: "Worker Connie",
        blocks: [
          { kind: "text", value: "Feature branch feature/onboarding-flow is ready for review." },
          { kind: "text", value: "Changes: 12 files modified, 340 lines added, 28 removed." },
          { kind: "text", value: "All CI checks passing. No conflicts with main." },
        ],
        sendLabel: "Approve & merge",
      },
    },
  ],
  collider: [
    {
      id: "w10",
      agentName: "Monitor Agent",
      type: "taskmaster",
      subject: "Anomaly detected",
      context: "Sector 7",
      urgency: "warning",
      detail: {
        heading: "Monitor Agent",
        blocks: [
          { kind: "text", value: "Unusual signal detected in Run 2848 at T+4:32:15:" },
          { kind: "italic", value: "Calorimeter cluster energy 2.4σ above expected background in η=1.2, φ=3.1 region." },
          { kind: "text", value: "Recommend manual review. Want me to flag for the Higgs Group?" },
        ],
        sendLabel: "Flag for review",
      },
    },
    {
      id: "w11",
      agentName: "Data Pipeline",
      type: "worker",
      subject: "Run 2848 processing",
      urgency: "none",
      status: "In progress",
      detail: {
        heading: "Data Pipeline",
        blocks: [
          { kind: "text", value: "Processing Run 2848 data — 72% complete." },
          { kind: "text", value: "Estimated completion: 45 minutes." },
          { kind: "text", value: "No errors so far. Output writing to s3://collider-data/run-2848/." },
        ],
      },
    },
  ],
};

export const roadmap: Record<string, RoadmapSection[]> = {
  startups: [
    { label: "Goals", count: 3 },
    { label: "Projects", count: 12 },
    { label: "Plans", count: 14 },
    {
      label: "Todos",
      count: 14,
      items: [
        { text: "Hire Sandy", done: false, tag: "Delegate" },
        { text: "Research RS.com", done: false },
      ],
    },
  ],
  collider: [
    { label: "Goals", count: 2 },
    { label: "Experiments", count: 8 },
    { label: "Plans", count: 6 },
    {
      label: "Todos",
      count: 9,
      items: [
        { text: "Review Run 2847 results", done: false },
        { text: "Submit SUSY paper draft", done: false, tag: "Overdue" },
      ],
    },
  ],
};

export const workers: Record<string, WorkerStatus[]> = {
  startups: [
    { name: "Taskmaster Dave", status: "Paused – waiting for response", historyLink: true },
    { name: "Worker Connie", detail: 'Working on "Research RS.com"', status: "" },
  ],
  collider: [
    { name: "Monitor Agent", status: "Active – watching beam conditions", historyLink: true },
    { name: "Data Pipeline", detail: "Processing Run 2848 (72%)", status: "" },
    { name: "Analysis Agent", status: "Idle", historyLink: true },
  ],
};

export const calendarEvents: Record<string, CalendarEvent[]> = {
  startups: [
    { id: "c1", title: "Standup", tag: "Prep", startSlot: 2, span: 1 },
    { id: "c2", title: "Charles <> Mark", tag: "Prep", startSlot: 5, span: 1 },
  ],
  collider: [
    { id: "c10", title: "Beam status review", tag: "Prep", startSlot: 1, span: 1 },
    { id: "c11", title: "Higgs Group sync", tag: "Notes", startSlot: 4, span: 2 },
  ],
};
