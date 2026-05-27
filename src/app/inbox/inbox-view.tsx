"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { updateMessageStatus } from "./actions";
import type { InboxMessage } from "@/types";
import ReactMarkdown from "react-markdown";

const statusTabs = ["unread", "read", "archived"] as const;

export function InboxView({
  messages,
  activeStatus,
}: {
  messages: InboxMessage[];
  activeStatus: string;
}) {
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const filtered = messages.filter((m) => m.status === activeStatus);
  const counts: Record<string, number> = {
    unread: messages.filter((m) => m.status === "unread").length,
    read: messages.filter((m) => m.status === "read").length,
    archived: messages.filter((m) => m.status === "archived").length,
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl">
      <h1 className="text-lg font-semibold mb-4">Inbox</h1>

      <div className="flex gap-1 mb-4">
        {statusTabs.map((tab) => (
          <a
            key={tab}
            href={`/inbox?status=${tab}`}
            className={cn(
              "px-2.5 py-1 text-xs rounded transition-colors",
              activeStatus === tab
                ? "bg-zinc-100 font-medium dark:bg-zinc-800"
                : "text-muted-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900"
            )}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {counts[tab] > 0 && ` (${counts[tab]})`}
          </a>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            {activeStatus === "unread"
              ? "No unread messages."
              : `No ${activeStatus} messages.`}
          </p>
          {activeStatus === "unread" && (
            <p className="text-xs text-muted-foreground">
              Messages appear here when routines complete, alerts trigger, or the daemon needs your attention.
            </p>
          )}
        </div>
      ) : (
        <div className="border rounded-md divide-y">
          {filtered.map((msg) => {
            const isExpanded = expandedSlug === msg.slug;
            return (
              <div key={msg.slug}>
                <button
                  onClick={() => setExpandedSlug(isExpanded ? null : msg.slug)}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                >
                  <span
                    className={cn(
                      "flex-1 text-sm truncate",
                      msg.status === "unread" && "font-medium"
                    )}
                  >
                    {msg.subject}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {msg.created}
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t bg-zinc-50/50 dark:bg-zinc-900/50">
                    <div className="pt-3 prose prose-sm prose-zinc dark:prose-invert max-w-none prose-p:my-2 prose-li:my-0.5">
                      <ReactMarkdown>{msg.body}</ReactMarkdown>
                    </div>
                    <div className="flex gap-2 mt-4 pt-3 border-t">
                      {msg.status === "unread" && (
                        <button
                          onClick={() => updateMessageStatus(msg.slug, "read")}
                          className="text-xs px-2.5 py-2 md:py-1 rounded border hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          Mark read
                        </button>
                      )}
                      {msg.status === "read" && (
                        <button
                          onClick={() => updateMessageStatus(msg.slug, "unread")}
                          className="text-xs px-2.5 py-2 md:py-1 rounded border hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          Mark unread
                        </button>
                      )}
                      {msg.status !== "archived" && (
                        <button
                          onClick={() => updateMessageStatus(msg.slug, "archived")}
                          className="text-xs px-2.5 py-2 md:py-1 rounded border hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          Archive
                        </button>
                      )}
                      {msg.status === "archived" && (
                        <button
                          onClick={() => updateMessageStatus(msg.slug, "unread")}
                          className="text-xs px-2.5 py-2 md:py-1 rounded border hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          Move to inbox
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
