import { readDirectory } from "@/lib/readers";
import { EditPrompt } from "@/components/layout/edit-prompt";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function ConnectionsPage() {
  const { entries, connections } = await readDirectory();

  const slugToName: Record<string, string> = {};
  entries.forEach((e) => { slugToName[e.slug] = e.name; });

  return (
    <div className="p-4 md:p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium">Connections</h2>
        <EditPrompt commands={[{ label: "Edit connections", command: "/edit-connections" }]} />
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        How entities in the directory relate to each other. Documented in the{" "}
        <code className="px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[11px]">connections:</code>{" "}
        section of <code className="px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[11px]">map/directory.yml</code>.
      </p>

      {connections.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground mb-3">No connections documented yet.</p>
          <p className="text-xs text-muted-foreground mb-1">Paste into Claude Code:</p>
          <code className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">
            Help me map out how my company&apos;s systems and vendors connect to each other
          </code>
        </div>
      ) : (
        <>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>From</TableHead>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connections.map((conn, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="font-medium">{slugToName[conn.from] ?? conn.from}</div>
                      <code className="text-[10px] text-zinc-400">{conn.from}</code>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {conn.bidirectional ? "↔" : "→"}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{slugToName[conn.to] ?? conn.to}</div>
                      <code className="text-[10px] text-zinc-400">{conn.to}</code>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {conn.description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-2">
            {connections.map((conn, i) => (
              <div key={i} className="border rounded-md p-3 space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{slugToName[conn.from] ?? conn.from}</span>
                  <span className="text-muted-foreground">{conn.bidirectional ? "↔" : "→"}</span>
                  <span className="font-medium">{slugToName[conn.to] ?? conn.to}</span>
                </div>
                <div className="text-xs text-muted-foreground">{conn.description}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
