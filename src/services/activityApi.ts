import { supabase } from "@/integrations/supabase/client";
import type { ActivityLog } from "@/types";

export const activityApi = {
  async log(action: string, metadata: Record<string, unknown> = {}): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("activity_logs").insert({
      user_id: user.id,
      action,
      metadata,
    } as any);
  },

  async getMyLogs(limit = 20): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as ActivityLog[];
  },

  async adminGetAll(filters?: {
    userId?: string;
    action?: string;
    limit?: number;
  }): Promise<ActivityLog[]> {
    let q = supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(filters?.limit ?? 100);
    if (filters?.userId) q = q.eq("user_id", filters.userId);
    if (filters?.action) q = q.eq("action", filters.action);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []) as unknown as ActivityLog[];
  },
};
