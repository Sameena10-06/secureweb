import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
  className?: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Contains uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "Contains lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "Contains number", test: (p) => /[0-9]/.test(p) },
  { label: "Contains special character", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const analysis = useMemo(() => {
    const passed = requirements.filter((req) => req.test(password));
    const score = passed.length;
    
    let strength: "none" | "weak" | "fair" | "good" | "strong" = "none";
    let color = "bg-muted";
    
    if (password.length === 0) {
      strength = "none";
      color = "bg-muted";
    } else if (score <= 1) {
      strength = "weak";
      color = "bg-destructive";
    } else if (score <= 2) {
      strength = "fair";
      color = "bg-warning";
    } else if (score <= 4) {
      strength = "good";
      color = "bg-primary";
    } else {
      strength = "strong";
      color = "bg-success";
    }

    return { score, strength, color, requirements: requirements.map((req) => ({
      ...req,
      passed: req.test(password),
    })) };
  }, [password]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Password strength</span>
          <span className={cn(
            "font-medium capitalize",
            analysis.strength === "weak" && "text-destructive",
            analysis.strength === "fair" && "text-warning",
            analysis.strength === "good" && "text-primary",
            analysis.strength === "strong" && "text-success",
          )}>
            {analysis.strength}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-300",
                i <= analysis.score ? analysis.color : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-1.5">
        {analysis.requirements.map((req, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center gap-2 text-xs transition-colors duration-200",
              req.passed ? "text-success" : "text-muted-foreground"
            )}
          >
            {req.passed ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <X className="w-3.5 h-3.5" />
            )}
            {req.label}
          </div>
        ))}
      </div>
    </div>
  );
}
