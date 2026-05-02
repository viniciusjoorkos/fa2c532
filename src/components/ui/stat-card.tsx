import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  label, value, icon, trend, accent, className,
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  trend?: { value: string; positive?: boolean };
  accent?: "primary" | "danger" | "neutral";
  className?: string;
}) {
  return (
    <div className={cn("glass-card relative overflow-hidden rounded-xl p-3 sm:p-5", className)}>
      {accent === "primary" && (
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
      )}
      <div className="relative flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">{label}</p>
          <p className="mt-1.5 text-lg font-bold tracking-tight sm:mt-2 sm:text-2xl">{value}</p>
          {trend && (
            <p
              className={cn(
                "mt-1 text-[10px] font-semibold sm:mt-1.5 sm:text-xs",
                trend.positive ? "text-primary" : "text-destructive"
              )}
            >
              {trend.positive ? "▲" : "▼"} {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className="hidden rounded-lg border border-border/60 bg-background/40 p-2 text-muted-foreground sm:block">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
