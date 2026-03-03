"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ContextFile } from "@/types";

interface FileTreeProps {
  files: ContextFile[];
  selectedId: string | null;
  onSelect: (file: ContextFile) => void;
  depth?: number;
}

export function FileTree({ files, selectedId, onSelect, depth = 0 }: FileTreeProps) {
  return (
    <div>
      {files.map((file) => (
        <FileTreeNode
          key={file.id}
          file={file}
          selectedId={selectedId}
          onSelect={onSelect}
          depth={depth}
        />
      ))}
    </div>
  );
}

function FileTreeNode({
  file,
  selectedId,
  onSelect,
  depth,
}: {
  file: ContextFile;
  selectedId: string | null;
  onSelect: (file: ContextFile) => void;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const isFolder = file.type === "folder";
  const isSelected = file.id === selectedId;

  return (
    <div>
      <button
        onClick={() => {
          if (isFolder) setExpanded(!expanded);
          onSelect(file);
        }}
        className={cn(
          "flex w-full items-center gap-1.5 px-2 py-1 text-sm text-left hover:bg-muted rounded-sm transition-colors",
          isSelected && "bg-muted font-medium"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <span className="text-muted-foreground shrink-0 w-4 text-center">
          {isFolder ? (expanded ? "▾" : "▸") : "·"}
        </span>
        <span className="truncate">{file.name}</span>
      </button>
      {isFolder && expanded && file.children && (
        <FileTree
          files={file.children}
          selectedId={selectedId}
          onSelect={onSelect}
          depth={depth + 1}
        />
      )}
    </div>
  );
}
