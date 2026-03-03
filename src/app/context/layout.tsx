"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const subTabs = [
  { name: "Unstructured", href: "/context/unstructured" },
  { name: "Structured", href: "/context/structured" },
];

export default function ContextLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b px-6 py-2">
        {subTabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "px-3 py-1 text-sm rounded-md transition-colors",
                isActive
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {tab.name}
            </Link>
          );
        })}
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
