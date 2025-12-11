import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import type { TablesInsert } from "@/integrations/supabase/types";

interface LogActionParams {
  action: string;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
}

export function useAuditLog() {
  const { user } = useAuth();

  const logAction = async ({ action, resourceType, resourceId, details = {} }: LogActionParams) => {
    if (!user) return;

    try {
      const logEntry: TablesInsert<"audit_logs"> = {
        user_id: user.id,
        action,
        resource_type: resourceType ?? null,
        resource_id: resourceId ?? null,
        details: details as TablesInsert<"audit_logs">["details"],
      };
      
      const { error } = await supabase.from("audit_logs").insert(logEntry);
      
      if (error) {
        console.error("Failed to log audit action:", error);
      }
    } catch (error) {
      console.error("Failed to log audit action:", error);
    }
  };

  return { logAction };
}
