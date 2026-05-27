"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Inbox,
  Zap,
  Clock,
  Map,
  Lock,
  Settings,
  GitBranch,
} from "lucide-react";
import type { DaemonStatusColor } from "@/types";

const navItems = [
  { id: "inbox", name: "Inbox", href: "/inbox", icon: Inbox },
  { id: "skills", name: "Skills", href: "/skills", icon: Zap },
  { id: "routines", name: "Routines", href: "/routines", icon: Clock },
  { id: "map", name: "Map", href: "/map", icon: Map },
  { id: "vault", name: "Vault", href: "/vault", icon: Lock },
];

const daemonDot: Record<DaemonStatusColor, string> = {
  green: "bg-emerald-400",
  yellow: "bg-yellow-400",
  orange: "bg-orange-400",
  grey: "bg-zinc-500",
  purple: "bg-violet-400",
};

export function Sidebar({
  unreadCount = 0,
  daemonStatus,
  hiddenPages = [],
}: {
  unreadCount?: number;
  daemonStatus: { color: DaemonStatusColor; label: string };
  hiddenPages?: string[];
}) {
  const pathname = usePathname();
  const visibleItems = navItems.filter((item) => !hiddenPages.includes(item.id));

  return (
    <aside className="flex h-full w-52 shrink-0 flex-col border-r bg-zinc-950 text-zinc-300">
      <div className="px-4 py-4">
        <span className="text-sm font-semibold tracking-tight text-white font-mono">
          differnet
        </span>
      </div>

      <nav className="flex-1 px-2 space-y-0.5">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.name}</span>
              {item.name === "Inbox" && unreadCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded bg-zinc-700 px-1 text-[10px] font-medium text-zinc-200">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 pb-2 space-y-0.5">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
            pathname === "/settings"
              ? "bg-zinc-800 text-white"
              : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span>Settings</span>
        </Link>

        <button
          onClick={() => {
            window.open("vscode://file/.claude/skills/sync-to-github/skill.md", "_blank");
          }}
          className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors w-full"
        >
          <GitBranch className="h-4 w-4 shrink-0" />
          <span>Sync to GitHub</span>
        </button>
      </div>

      <div className="border-t border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", daemonDot[daemonStatus.color])} />
          <span className="text-[11px] text-zinc-500">
            Daemon: {daemonStatus.label}
          </span>
        </div>
      </div>
    </aside>
  );
}
