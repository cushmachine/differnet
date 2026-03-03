"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { projects, useProject } from "@/data/projects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const tabs = [
  { name: "Work", href: "/work" },
  { name: "Routines", href: "/routines" },
  { name: "Context", href: "/context" },
  { name: "Vault", href: "/vault" },
  { name: "Dashboards", href: "/dashboards" },
  { name: "Team", href: "/team" },
];

export function TopNav() {
  const pathname = usePathname();
  const { activeProject, setActiveProject } = useProject();

  return (
    <nav className="flex h-12 items-center border-b px-4 gap-6">
      <Select value={activeProject} onValueChange={setActiveProject}>
        <SelectTrigger className="w-[160px] h-8 text-sm font-semibold">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
