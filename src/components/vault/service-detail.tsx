import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { VaultService } from "@/types";

interface ServiceDetailProps {
  service: VaultService | null;
}

export function ServiceDetail({ service }: ServiceDetailProps) {
  if (!service) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
        Select a service to view
      </div>
    );
  }

  const fields = [
    { label: "Project", value: service.project },
    { label: "API Key", value: service.apiKey },
    { label: "Secret", value: service.secret },
  ];

  return (
    <div className="p-6">
      <h2 className="text-base font-semibold mb-4">{service.name}</h2>
      <Separator className="mb-4" />
      <dl className="space-y-3">
        {fields.map((f) => (
          <div key={f.label} className="flex items-start gap-4">
            <dt className="w-28 shrink-0 text-sm text-muted-foreground">
              {f.label}
            </dt>
            <dd className="text-sm font-mono">{f.value}</dd>
          </div>
        ))}
        <div className="flex items-start gap-4">
          <dt className="w-28 shrink-0 text-sm text-muted-foreground">
            Worker permissions
          </dt>
          <dd className="flex flex-wrap gap-1.5">
            {service.workerPermissions.map((wp) => (
              <Badge key={wp} variant="secondary" className="text-xs">
                {wp}
              </Badge>
            ))}
          </dd>
        </div>
      </dl>
    </div>
  );
}
