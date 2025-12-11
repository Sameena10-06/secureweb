import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SecurityFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  status?: "active" | "warning" | "critical";
  delay?: number;
}

export function SecurityFeatureCard({
  icon: Icon,
  title,
  description,
  status = "active",
  delay = 0,
}: SecurityFeatureCardProps) {
  return (
    <div
      className={cn(
        "security-card group opacity-0 animate-fade-in",
        status === "active" && "hover:glow-success",
        status === "warning" && "hover:glow-warning",
        status === "critical" && "hover:glow-destructive"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn(
        "inline-flex p-3 rounded-lg mb-4 transition-all duration-300",
        status === "active" && "bg-success/10 text-success group-hover:bg-success/20",
        status === "warning" && "bg-warning/10 text-warning group-hover:bg-warning/20",
        status === "critical" && "bg-destructive/10 text-destructive group-hover:bg-destructive/20"
      )}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
