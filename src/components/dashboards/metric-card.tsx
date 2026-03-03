import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardMetric } from "@/types";

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {metric.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {metric.value ? (
          <div className="text-2xl font-bold">{metric.value}</div>
        ) : (
          <div className="h-20 rounded-md border-2 border-dashed border-muted" />
        )}
        {metric.description && (
          <p className="text-xs text-muted-foreground mt-1">
            {metric.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
