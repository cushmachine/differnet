"use client";

import { cn } from "@/lib/utils";
import { togglePageVisibility } from "./actions";
import type { AppSettings } from "@/lib/readers";

const allPages = [
  { id: "inbox", name: "Inbox", description: "Messages from your agent" },
  { id: "skills", name: "Skills", description: "Browse and manage skills" },
  { id: "routines", name: "Routines", description: "Scheduled automations and run history" },
  { id: "map", name: "Map", description: "Org chart, directory, RACI matrix" },
  { id: "vault", name: "Vault", description: "Secrets and integration configs" },
];

export function SettingsView({ settings }: { settings: AppSettings }) {
  return (
    <div className="p-6 max-w-2xl space-y-8">
      <h1 className="text-lg font-semibold">Settings</h1>

      <section>
        <h2 className="text-sm font-medium mb-2">User</h2>
        <p className="text-xs text-muted-foreground mb-3">
          Edit <code className="px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[11px]">settings.yml</code> to
          set your name and teams. This scopes integration health checks to your team&apos;s tools.
        </p>
        <div className="border rounded-md px-4 py-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Name</span>
            <span>{settings.user.name || "Not set"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Teams</span>
            <span>{settings.user.teams.length > 0 ? settings.user.teams.join(", ") : "Not set"}</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium mb-3">Sidebar pages</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Toggle which pages appear in the sidebar. Hidden pages are still accessible by URL.
        </p>
        <div className="border rounded-md divide-y">
          {allPages.map((page) => {
            const isHidden = settings.hidden_pages.includes(page.id);
            return (
              <div
                key={page.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <div className="text-sm font-medium">{page.name}</div>
                  <div className="text-xs text-muted-foreground">{page.description}</div>
                </div>
                <button
                  onClick={() => togglePageVisibility(page.id)}
                  className={cn(
                    "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
                    !isHidden ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform",
                      !isHidden ? "translate-x-[18px]" : "translate-x-[3px]"
                    )}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
