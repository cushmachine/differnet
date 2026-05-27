import { readVaultIntegrations, readSettings } from "@/lib/readers";
import { EditPrompt } from "@/components/layout/edit-prompt";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

const statusDot: Record<string, string> = {
  connected: "bg-emerald-400",
  disconnected: "bg-zinc-400",
  error: "bg-red-400",
  unconfigured: "bg-yellow-400",
};

const statusLabel: Record<string, string> = {
  connected: "Connected",
  disconnected: "Not checked",
  error: "Error",
  unconfigured: "No API key",
};

export default async function VaultPage() {
  const [integrations, settings] = await Promise.all([
    readVaultIntegrations(),
    readSettings(),
  ]);

  const userTeams = settings.user.teams;
  const hasTeamFilter = userTeams.length > 0;

  const relevant = hasTeamFilter
    ? integrations.filter(
        (i) => i.teams.length === 0 || i.teams.some((t) => userTeams.includes(t))
      )
    : integrations;

  const other = hasTeamFilter
    ? integrations.filter(
        (i) => i.teams.length > 0 && !i.teams.some((t) => userTeams.includes(t))
      )
    : [];

  return (
    <div className="p-4 md:p-6 max-w-5xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Vault</h1>
        <EditPrompt commands={[
          { label: "Add integration", command: "/integration-connector" },
        ]} />
      </div>

      {integrations.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground mb-3">No integrations configured.</p>
          <p className="text-xs text-muted-foreground mb-1">Run this in Claude Code:</p>
          <code className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">
            /integration-connector
          </code>
        </div>
      ) : (
        <>
          <section>
            <h2 className="text-sm font-medium mb-2">
              {hasTeamFilter ? "Your integrations" : "All integrations"}
            </h2>
            {hasTeamFilter && !settings.user.name && (
              <p className="text-xs text-muted-foreground mb-3">
                Set your name and teams in{" "}
                <code className="px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-[11px]">settings.yml</code>{" "}
                to filter integrations by team.
              </p>
            )}
            <IntegrationTable integrations={relevant} />
          </section>

          {other.length > 0 && (
            <section>
              <h2 className="text-sm font-medium mb-2 text-muted-foreground">
                Other teams
              </h2>
              <IntegrationTable integrations={other} dimmed />
            </section>
          )}
        </>
      )}

      <section>
        <h2 className="text-sm font-medium mb-2">Secrets</h2>
        <p className="text-sm text-muted-foreground">
          Stored in{" "}
          <code className="px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs">vault/.env</code>{" "}
          (gitignored). Skills declare required secrets in their frontmatter.
        </p>
      </section>
    </div>
  );
}

function IntegrationTable({
  integrations,
  dimmed = false,
}: {
  integrations: Awaited<ReturnType<typeof readVaultIntegrations>>;
  dimmed?: boolean;
}) {
  return (
    <>
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Teams</TableHead>
              <TableHead>Secret</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Checked</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {integrations.map((int) => (
              <TableRow key={int.slug} className={cn(dimmed && "opacity-50")}>
                <TableCell>
                  <span className={cn("inline-block h-2 w-2 rounded-full", statusDot[int.status])} />
                </TableCell>
                <TableCell className="font-medium">{int.name}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {int.teams.length > 0 ? int.teams.join(", ") : "—"}
                </TableCell>
                <TableCell>
                  <code className="text-xs">{int.auth_secret || "—"}</code>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {statusLabel[int.status] ?? int.status}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {int.last_checked ?? "Never"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-2">
        {integrations.map((int) => (
          <div key={int.slug} className={cn("border rounded-md p-3 space-y-1.5", dimmed && "opacity-50")}>
            <div className="flex items-center gap-2">
              <span className={cn("h-2 w-2 rounded-full", statusDot[int.status])} />
              <span className="font-medium text-sm">{int.name}</span>
              <span className="text-xs text-muted-foreground ml-auto">
                {statusLabel[int.status] ?? int.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {int.teams.length > 0 && <span>Teams: {int.teams.join(", ")}</span>}
              <span>Secret: <code className="text-[11px]">{int.auth_secret || "—"}</code></span>
              <span>Checked: {int.last_checked ?? "Never"}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
