"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import type { SkillMeta, SkillDetail } from "@/types";
import ReactMarkdown from "react-markdown";
import { ExternalLink } from "lucide-react";
import { EditPrompt } from "@/components/layout/edit-prompt";

export function SkillsView({
  skills,
  selectedSkill,
}: {
  skills: SkillMeta[];
  selectedSkill: SkillDetail | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("skill");
  const [visFilter, setVisFilter] = useState<string>("all");

  const visibilityOptions = useMemo(() => {
    const set = new Set<string>();
    skills.forEach((s) => s.visibility.forEach((v) => set.add(v)));
    return ["all", ...Array.from(set).filter((v) => v !== "all").sort()];
  }, [skills]);

  const filtered = visFilter === "all"
    ? skills
    : skills.filter((s) => s.visibility.includes(visFilter) || s.visibility.includes("all"));

  return (
    <ResizablePanelGroup orientation="horizontal" className="h-full">
      <ResizablePanel defaultSize={28} minSize={20}>
        <div className="p-2 pb-0 space-y-2">
          <EditPrompt commands={[
            { label: "New skill", command: "/process-documenter" },
          ]} />
          <div className="flex gap-1 flex-wrap">
            {visibilityOptions.map((v) => (
              <button
                key={v}
                onClick={() => setVisFilter(v)}
                className={cn(
                  "px-2 py-0.5 text-[11px] rounded transition-colors",
                  visFilter === v
                    ? "bg-zinc-200 dark:bg-zinc-700 font-medium"
                    : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
                )}
              >
                {v === "all" ? "All" : v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <ScrollArea className="h-[calc(100%-36px)]">
          <div className="px-2 pb-2 space-y-0.5">
            {filtered.length === 0 ? (
              <div className="px-2.5 py-8 text-center">
                <p className="text-xs text-muted-foreground mb-2">No skills yet.</p>
                <p className="text-xs text-muted-foreground">Paste this into Claude Code:</p>
                <code className="text-[11px] block mt-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">
                  Help me create my first skill
                </code>
              </div>
            ) : (
              filtered.map((skill) => (
                <button
                  key={skill.slug}
                  onClick={() => router.push(`/skills?skill=${skill.slug}`)}
                  className={cn(
                    "w-full text-left px-2.5 py-2 text-[13px] rounded transition-colors",
                    activeSlug === skill.slug
                      ? "bg-zinc-100 dark:bg-zinc-800"
                      : "text-muted-foreground hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  )}
                >
                  <div className="font-medium text-foreground truncate">
                    {skill.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {skill.owner} · {skill.visibility.join(", ")}
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel defaultSize={72} minSize={30}>
        <ScrollArea className="h-full">
          {selectedSkill ? (
            <div className="p-6 max-w-3xl">
              <div className="flex items-start justify-between mb-1">
                <h1 className="text-lg font-semibold">{selectedSkill.name}</h1>
                <button
                  onClick={() => {
                    const path = `.claude/skills/${selectedSkill.slug}/skill.md`;
                    window.open(`vscode://file/${path}`, "_blank");
                  }}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open file
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-3">
                {selectedSkill.description}
              </p>

              <div className="flex gap-6 text-xs text-muted-foreground mb-6">
                <span>Owner: {selectedSkill.owner}</span>
                <span>Visibility: {(selectedSkill.visibility ?? []).join(", ")}</span>
                <span>Modified: {selectedSkill.modified}</span>
              </div>

              {selectedSkill.secrets.length > 0 && (
                <div className="text-xs text-muted-foreground mb-6">
                  Requires:{" "}
                  {selectedSkill.secrets.map((s, i) => (
                    <span key={s}>
                      {i > 0 && ", "}
                      <code className="px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[11px]">
                        {s}
                      </code>
                    </span>
                  ))}
                </div>
              )}

              <div className="border-t pt-6">
                <article className="prose prose-sm prose-zinc dark:prose-invert max-w-none prose-headings:text-base prose-headings:font-semibold prose-headings:mt-8 prose-headings:mb-3 prose-h2:text-[15px] prose-h3:text-[14px] prose-p:my-3 prose-p:leading-relaxed prose-ul:my-3 prose-ol:my-3 prose-li:my-1 prose-li:leading-relaxed prose-pre:bg-zinc-50 prose-pre:dark:bg-zinc-900 prose-pre:my-4 prose-code:text-[12px] prose-code:before:content-none prose-code:after:content-none prose-hr:my-6">
                  <ReactMarkdown>{selectedSkill.content}</ReactMarkdown>
                </article>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <p className="text-sm text-muted-foreground mb-3">
                Select a skill to view details
              </p>
              <p className="text-xs text-muted-foreground">
                To create a new skill, paste this into Claude Code:
              </p>
              <code className="text-[11px] mt-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">
                Help me create a new skill for [describe what you need]
              </code>
            </div>
          )}
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
