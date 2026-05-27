"use client";

import { useState } from "react";
import { Terminal, Check } from "lucide-react";

export function EditPrompt({
  commands,
}: {
  commands: { label: string; command: string }[];
}) {
  const [copied, setCopied] = useState<string | null>(null);

  function copy(command: string) {
    navigator.clipboard.writeText(command);
    setCopied(command);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {commands.map((cmd) => (
        <button
          key={cmd.command}
          onClick={() => copy(cmd.command)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
        >
          {copied === cmd.command ? (
            <Check className="h-3 w-3 text-emerald-500" />
          ) : (
            <Terminal className="h-3 w-3" />
          )}
          {cmd.label}
        </button>
      ))}
    </div>
  );
}
