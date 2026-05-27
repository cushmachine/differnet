import { readRaci } from "@/lib/readers";
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

export default async function RaciPage() {
  const decisions = await readRaci();

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium">RACI Matrix</h2>
        <EditPrompt commands={[{ label: "Edit RACI", command: "/raci" }]} />
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Who is Responsible, Accountable, Consulted, and Informed for each decision type.
      </p>

      {decisions.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground mb-3">No decisions defined yet.</p>
          <p className="text-xs text-muted-foreground mb-1">Paste into Claude Code:</p>
          <code className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">
            /raci
          </code>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Decision</TableHead>
              <TableHead>Responsible</TableHead>
              <TableHead>Accountable</TableHead>
              <TableHead>Consulted</TableHead>
              <TableHead>Informed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {decisions.map((d) => (
              <TableRow key={d.name}>
                <TableCell>
                  <div className="font-medium">{d.name}</div>
                  {d.description && (
                    <div className="text-[11px] text-muted-foreground">{d.description}</div>
                  )}
                </TableCell>
                <TableCell className="text-sm">{d.responsible}</TableCell>
                <TableCell className="text-sm">{d.accountable}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {d.consulted.length > 0 ? d.consulted.join(", ") : "—"}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {d.informed.length > 0 ? d.informed.join(", ") : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
