"use client";

import { useState } from "react";
import { useProject } from "@/data/projects";
import { categories, structuredItems } from "@/data/context-structured";
import { SplitPanel } from "@/components/layout/split-panel";
import { CategoryList } from "@/components/context/category-list";
import { StructuredTable } from "@/components/context/structured-table";

export default function StructuredPage() {
  const { activeProject } = useProject();
  const cats = categories[activeProject] ?? [];
  const items = structuredItems[activeProject] ?? [];
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  const activeCat = cats.find((c) => c.id === selectedCat) ?? null;

  return (
    <SplitPanel
      left={
        <CategoryList
          categories={cats}
          selectedId={selectedCat}
          onSelect={setSelectedCat}
        />
      }
      right={<StructuredTable items={items} category={activeCat} />}
    />
  );
}
