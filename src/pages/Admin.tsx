import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Users, UserCog, Crown, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useRole, AppRole } from "@/hooks/useRole";
import { useAuditLog } from "@/hooks/useAuditLog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface UserWithRole {
  user_id: string;
  role: AppRole;
  created_at: string;
  email: string | null;
  full_name: string | null;
}

export default function Admin() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useRole();
  const { logAction } = useAuditLog();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/dashboard");
      }
    }
  }, [user, isAdmin, authLoading, roleLoading, navigate]);

  // Fetch all users with roles
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return;

      // Fetch user_roles with profile data
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role, created_at");

      if (rolesError) {
        console.error("Error fetching roles:", rolesError);
        setUsersLoading(false);
        return;
      }

      // Fetch profiles for user details
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, email, full_name");

      // Combine data
      const combinedUsers = rolesData.map((roleData) => {
        const profile = profilesData?.find((p) => p.user_id === roleData.user_id);
        return {
          ...roleData,
          role: roleData.role as AppRole,
          email: profile?.email || null,
          full_name: profile?.full_name || null,
        };
      });

      setUsers(combinedUsers);
      setUsersLoading(false);

      // Log admin access
      logAction({
        action: "admin_access",
        resourceType: "admin_panel",
        details: { users_count: combinedUsers.length },
      });
    };

    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const updateUserRole = async (userId: string, newRole: AppRole) => {
    const { error } = await supabase
      .from("user_roles")
      .update({ role: newRole })
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to update role");
      console.error("Error updating role:", error);
      return;
    }

    // Update local state
    setUsers(users.map((u) => (u.user_id === userId ? { ...u, role: newRole } : u)));
    
    // Log the action
    logAction({
      action: "role_change",
      resourceType: "user_roles",
      resourceId: userId,
      details: { new_role: newRole },
    });

    toast.success(`Role updated to ${newRole}`);
  };

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case "admin":
        return Crown;
      case "moderator":
        return Shield;
      default:
        return Users;
    }
  };

  const getRoleColor = (role: AppRole) => {
    switch (role) {
      case "admin":
        return "text-destructive";
      case "moderator":
        return "text-warning";
      default:
        return "text-muted-foreground";
    }
  };

  // Show loading
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-destructive/10">
                <UserCog className="w-6 h-6 text-destructive" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            </div>
            <p className="text-muted-foreground">Manage users and their roles</p>
          </div>

          {/* Warning Card */}
          <Card className="mb-6 border-warning/50 bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-warning">Admin Access</p>
                  <p className="text-sm text-muted-foreground">
                    Changes made here affect user permissions across the entire application.
                    All actions are logged for security purposes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                User Management
              </CardTitle>
              <CardDescription>
                {users.length} registered user{users.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No users found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((userItem) => {
                    const RoleIcon = getRoleIcon(userItem.role);
                    const isCurrentUser = userItem.user_id === user.id;

                    return (
                      <div
                        key={userItem.user_id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          isCurrentUser ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full bg-muted ${getRoleColor(userItem.role)}`}>
                            <RoleIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {userItem.full_name || userItem.email || "Unknown User"}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs text-primary">(You)</span>
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {userItem.email || "No email"}
                              {" • "}
                              Joined {formatDistanceToNow(new Date(userItem.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>

                        <Select
                          value={userItem.role}
                          onValueChange={(value: AppRole) => updateUserRole(userItem.user_id, value)}
                          disabled={isCurrentUser}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
