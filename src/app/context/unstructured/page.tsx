"use client";

import { useState } from "react";
import { useProject } from "@/data/projects";
import { contextFiles } from "@/data/context-unstructured";
import { SplitPanel } from "@/components/layout/split-panel";
import { FileTree } from "@/components/context/file-tree";
import { DocumentViewer } from "@/components/context/document-viewer";
import type { ContextFile } from "@/types";

export default function UnstructuredPage() {
  const { activeProject } = useProject();
  const files = contextFiles[activeProject] ?? [];
  const [selected, setSelected] = useState<ContextFile | null>(null);

  return (
    <SplitPanel
      left={
        <div className="p-3">
          <FileTree
            files={files}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
          />
        </div>
      }
      right={<DocumentViewer file={selected} />}
    />
  );
}
