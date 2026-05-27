"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const subtabs = [
  { name: "Org", href: "/map" },
  { name: "Directory", href: "/map/directory" },
  { name: "Connections", href: "/map/connections" },
  { name: "RACI", href: "/map/raci" },
];

export default function MapLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 px-6 pt-4 pb-2">
        {subtabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "px-2.5 py-1 text-xs rounded transition-colors",
              pathname === tab.href
                ? "bg-zinc-100 font-medium dark:bg-zinc-800"
                : "text-muted-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900"
            )}
          >
            {tab.name}
          </Link>
        ))}
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
