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
import { useIsMobile } from "@/hooks/use-mobile";
import type { SkillMeta, SkillDetail } from "@/types";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { EditPrompt } from "@/components/layout/edit-prompt";

function SkillList({
  skills,
  activeSlug,
  onSelect,
}: {
  skills: SkillMeta[];
  activeSlug: string | null;
  onSelect: (slug: string) => void;
}) {
  return (
    <div className="px-2 md:px-2 pb-2 space-y-0.5">
      {skills.length === 0 ? (
        <div className="px-2.5 py-8 text-center">
          <p className="text-xs text-muted-foreground mb-2">No skills yet.</p>
          <p className="text-xs text-muted-foreground">Paste this into Claude Code:</p>
          <code className="text-[11px] block mt-1 px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">
            Help me create my first skill
          </code>
        </div>
      ) : (
        skills.map((skill) => (
          <button
            key={skill.slug}
            onClick={() => onSelect(skill.slug)}
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
  );
}

function SkillDetailPanel({ skill }: { skill: SkillDetail }) {
  return (
    <div className="p-4 md:p-6 max-w-3xl">
      <div className="flex items-start justify-between mb-1">
        <h1 className="text-lg font-semibold">{skill.name}</h1>
        <button
          onClick={() => {
            const path = `.claude/skills/${skill.slug}/skill.md`;
            window.open(`vscode://file/${path}`, "_blank");
          }}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          <ExternalLink className="h-3 w-3" />
          Open file
        </button>
      </div>

      <p className="text-sm text-muted-foreground mb-3">
        {skill.description}
      </p>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground mb-6">
        <span>Owner: {skill.owner}</span>
        <span>Visibility: {(skill.visibility ?? []).join(", ")}</span>
        <span>Modified: {skill.modified}</span>
      </div>

      {skill.secrets.length > 0 && (
        <div className="text-xs text-muted-foreground mb-6">
          Requires:{" "}
          {skill.secrets.map((s, i) => (
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
          <ReactMarkdown>{skill.content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
}

function EmptyDetail() {
  return (
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
  );
}

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
  const isMobile = useIsMobile();

  const visibilityOptions = useMemo(() => {
    const set = new Set<string>();
    skills.forEach((s) => s.visibility.forEach((v) => set.add(v)));
    return ["all", ...Array.from(set).filter((v) => v !== "all").sort()];
  }, [skills]);

  const filtered = visFilter === "all"
    ? skills
    : skills.filter((s) => s.visibility.includes(visFilter) || s.visibility.includes("all"));

  const selectSkill = (slug: string) => router.push(`/skills?skill=${slug}`);

  const filterChips = (
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
  );

  if (isMobile) {
    if (activeSlug && selectedSkill) {
      return (
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-2 p-3 border-b">
            <button
              onClick={() => router.push("/skills")}
              className="p-1 -ml-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium truncate">{selectedSkill.name}</span>
          </div>
          <ScrollArea className="flex-1">
            <SkillDetailPanel skill={selectedSkill} />
          </ScrollArea>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        <div className="p-3 pb-0 space-y-2">
          <EditPrompt commands={[
            { label: "New skill", command: "/process-documenter" },
          ]} />
          {filterChips}
        </div>
        <ScrollArea className="flex-1">
          <SkillList skills={filtered} activeSlug={activeSlug} onSelect={selectSkill} />
        </ScrollArea>
      </div>
    );
  }

  return (
    <ResizablePanelGroup orientation="horizontal" className="h-full">
      <ResizablePanel defaultSize={28} minSize={20}>
        <div className="p-2 pb-0 space-y-2">
          <EditPrompt commands={[
            { label: "New skill", command: "/process-documenter" },
          ]} />
          {filterChips}
        </div>
        <ScrollArea className="h-[calc(100%-36px)]">
          <SkillList skills={filtered} activeSlug={activeSlug} onSelect={selectSkill} />
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel defaultSize={72} minSize={30}>
        <ScrollArea className="h-full">
          {selectedSkill ? (
            <SkillDetailPanel skill={selectedSkill} />
          ) : (
            <EmptyDetail />
          )}
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
