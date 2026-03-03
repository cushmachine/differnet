import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { ContextFile } from "@/types";

interface DocumentViewerProps {
  file: ContextFile | null;
}

export function DocumentViewer({ file }: DocumentViewerProps) {
  if (!file) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
        Select a document to view
      </div>
    );
  }

  if (file.type === "folder") {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
        Select a file to view its content
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">{file.name}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Edit templates
          </Button>
          <Button size="sm">New</Button>
        </div>
      </div>
      <Separator className="mb-4" />
      <div className="prose prose-sm max-w-none text-sm leading-relaxed whitespace-pre-wrap">
        {file.content}
      </div>
    </div>
  );
}
