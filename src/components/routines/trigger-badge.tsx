import { Badge } from "@/components/ui/badge";
import type { TriggerType } from "@/types";

const triggerStyles: Record<TriggerType, string> = {
  User: "bg-primary text-primary-foreground hover:bg-primary/90",
  Cron: "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200",
  Webhook: "bg-transparent text-slate-600 border-slate-300 hover:bg-slate-50",
};

export function TriggerBadge({ trigger }: { trigger: TriggerType }) {
  return (
    <Badge variant="outline" className={triggerStyles[trigger]}>
      {trigger}
    </Badge>
  );
}
