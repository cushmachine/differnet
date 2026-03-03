"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SplitPanelProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultSize?: number;
}

export function SplitPanel({ left, right, defaultSize = 30 }: SplitPanelProps) {
  return (
    <ResizablePanelGroup orientation="horizontal" className="h-full">
      <ResizablePanel defaultSize={defaultSize} minSize={20}>
        <ScrollArea className="h-full">{left}</ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={100 - defaultSize} minSize={30}>
        <ScrollArea className="h-full">{right}</ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
