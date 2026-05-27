import { readMapFile } from "@/lib/readers";
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

interface Member {
  name: string;
  id: string;
  role: string;
  reports_to: string | null;
}

interface Team {
  name: string;
  lead: string;
  owns?: string[];
  tools?: string[];
  members?: Member[];
}

export default async function OrgMapPage() {
  const data = await readMapFile("org");
  const company = data.company as Record<string, unknown> | undefined;
  const teams = (data.teams as Team[]) ?? [];

  return (
    <div className="p-4 md:p-6 max-w-5xl space-y-8">
      {company && (
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold">{company.name as string}</h1>
            <EditPrompt commands={[{ label: "Edit org", command: "/edit-org" }]} />
          </div>
          <p className="text-sm text-muted-foreground">
            {[company.industry, company.stage, company.headcount ? `${company.headcount} people` : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {typeof company.mission === "string" && (
            <p className="text-sm mt-1">{company.mission}</p>
          )}
        </div>
      )}

      {teams.map((team) => (
        <section key={team.name}>
          <h2 className="text-sm font-medium mb-1">{team.name}</h2>
          <p className="text-xs text-muted-foreground mb-2">
            Lead: {team.lead}
            {team.owns && team.owns.length > 0 && ` · Owns: ${team.owns.join(", ")}`}
            {team.tools && team.tools.length > 0 && ` · Tools: ${team.tools.join(", ")}`}
          </p>
          {team.members && (
            <>
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Reports To</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {team.members.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.name}</TableCell>
                        <TableCell className="text-muted-foreground">{m.role}</TableCell>
                        <TableCell className="text-muted-foreground">{m.reports_to ?? "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-1.5">
                {team.members.map((m) => (
                  <div key={m.id} className="border rounded-md p-3">
                    <div className="font-medium text-sm">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.role}</div>
                    {m.reports_to && (
                      <div className="text-xs text-muted-foreground">Reports to: {m.reports_to}</div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      ))}
    </div>
  );
}
