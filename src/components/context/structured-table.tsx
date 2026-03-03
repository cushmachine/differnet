"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StructuredItem, ContextCategory } from "@/types";

interface StructuredTableProps {
  items: StructuredItem[];
  category: ContextCategory | null;
}

export function StructuredTable({ items, category }: StructuredTableProps) {
  if (!category) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
        Select a category to view
      </div>
    );
  }

  const filtered = items.filter((i) => i.category === category.id);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">{category.name}</h2>
        <Button size="sm">Edit</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-primary/10">
            <TableHead className="text-primary font-semibold">Field</TableHead>
            <TableHead className="text-primary font-semibold">Value</TableHead>
            <TableHead className="text-primary font-semibold">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.field}</TableCell>
              <TableCell>{item.value}</TableCell>
              <TableCell className="text-muted-foreground">{item.updatedAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
