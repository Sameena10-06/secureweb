import { Shield, ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { cn } from "@/lib/utils";

type SecurityLevel = "high" | "medium" | "low" | "critical";

interface SecurityBadgeProps {
  level: SecurityLevel;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

const levelConfig = {
  high: {
    icon: ShieldCheck,
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    label: "Secure",
  },
  medium: {
    icon: Shield,
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    label: "Moderate",
  },
  low: {
    icon: ShieldAlert,
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    label: "Weak",
  },
  critical: {
    icon: ShieldX,
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    label: "Critical",
  },
};

export function SecurityBadge({
  level,
  label,
  showIcon = true,
  className,
}: SecurityBadgeProps) {
  const config = levelConfig[level];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        config.color,
        config.bg,
        config.border,
        className
      )}
    >
      {showIcon && <Icon className="w-3.5 h-3.5" />}
      {label || config.label}
    </span>
  );
}
