import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Lock, Key, Eye, Activity, AlertTriangle, CheckCircle2, Clock, Users, FileKey, LogIn, LogOut, UserPlus, Database } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SecurityBadge } from "@/components/SecurityBadge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAuditLog } from "@/hooks/useAuditLog";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface AuditLogEntry {
  id: string;
  action: string;
  resource_type: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

const securityTips = [
  "Enable two-factor authentication for extra security",
  "Use unique passwords for each account",
  "Regularly review active sessions",
  "Keep your recovery codes in a safe place",
];

const getActionIcon = (action: string) => {
  switch (action) {
    case "login":
      return LogIn;
    case "logout":
      return LogOut;
    case "signup":
      return UserPlus;
    case "data_access":
      return Database;
    default:
      return Activity;
  }
};

const getActionType = (action: string) => {
  switch (action) {
    case "login":
    case "signup":
      return "success";
    case "logout":
      return "info";
    default:
      return "warning";
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { logAction } = useAuditLog();
  const { role, isAdmin } = useRole();
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Fetch audit logs
  useEffect(() => {
    const fetchAuditLogs = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (!error && data) {
        setAuditLogs(data as AuditLogEntry[]);
      }
      setLogsLoading(false);
    };

    if (user) {
      fetchAuditLogs();
      // Log dashboard access
      logAction({
        action: "data_access",
        resourceType: "dashboard",
        details: { page: "dashboard" },
      });
    }
  }, [user]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const securityMetrics = [
    { label: "Security Score", value: "94%", icon: Shield, status: "high" as const },
    { label: "Active Sessions", value: "1", icon: Users, status: "high" as const },
    { label: "Audit Events", value: String(auditLogs.length), icon: FileKey, status: "high" as const },
    { label: "Last Login", value: auditLogs.find(l => l.action === "login") 
      ? formatDistanceToNow(new Date(auditLogs.find(l => l.action === "login")!.created_at), { addSuffix: true })
      : "Just now", icon: Clock, status: "high" as const },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Security Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {user.email}
                  {role && (
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      role === "admin" ? "bg-destructive/10 text-destructive" :
                      role === "moderator" ? "bg-warning/10 text-warning" :
                      "bg-muted text-muted-foreground"
                    }`}>
                      {role}
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin">
                      <Users className="w-4 h-4 mr-2" />
                      Admin Panel
                    </Link>
                  </Button>
                )}
                <SecurityBadge level="high" label="System Secure" />
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {securityMetrics.map((metric, i) => (
              <Card key={metric.label} className="opacity-0 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{metric.value}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${
                      metric.status === "high" ? "bg-success/10 text-success" :
                      metric.status === "medium" ? "bg-warning/10 text-warning" :
                      "bg-destructive/10 text-destructive"
                    }`}>
                      <metric.icon className="w-5 h-5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Audit Log */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Security Audit Log
                </CardTitle>
                <CardDescription>Real-time security events in your account</CardDescription>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                ) : auditLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No audit events yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {auditLogs.map((log) => {
                      const ActionIcon = getActionIcon(log.action);
                      const actionType = getActionType(log.action);
                      
                      return (
                        <div
                          key={log.id}
                          className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className={`p-2 rounded-full ${
                            actionType === "success" ? "bg-success/10 text-success" :
                            actionType === "warning" ? "bg-warning/10 text-warning" :
                            "bg-primary/10 text-primary"
                          }`}>
                            {actionType === "success" ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : actionType === "warning" ? (
                              <AlertTriangle className="w-4 h-4" />
                            ) : (
                              <ActionIcon className="w-4 h-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground capitalize">
                              {log.action.replace(/_/g, " ")}
                              {log.resource_type && (
                                <span className="text-muted-foreground font-normal"> • {log.resource_type}</span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Security Tips
                </CardTitle>
                <CardDescription>Best practices for staying secure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {securityTips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                      <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground">{tip}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link to="/demos">View Security Demos</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="cyber" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/demos">
                  <Lock className="w-6 h-6" />
                  <span>Encryption Demo</span>
                </Link>
              </Button>
              <Button variant="cyber" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/demos">
                  <Key className="w-6 h-6" />
                  <span>Password Tools</span>
                </Link>
              </Button>
              <Button variant="cyber" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/demos">
                  <Shield className="w-6 h-6" />
                  <span>XSS Protection</span>
                </Link>
              </Button>
              <Button variant="cyber" className="h-auto py-4 flex-col gap-2" asChild>
                <Link to="/demos">
                  <Eye className="w-6 h-6" />
                  <span>SQL Injection</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
