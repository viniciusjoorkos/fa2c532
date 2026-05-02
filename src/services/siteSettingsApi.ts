import { supabase } from "@/integrations/supabase/client";

export const siteSettingsApi = {
  async get(key: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("site_settings" as any)
      .select("value")
      .eq("key", key)
      .maybeSingle();
    if (error) return null;
    return (data as any)?.value ?? null;
  },

  async set(key: string, value: string): Promise<void> {
    const { error } = await supabase
      .from("site_settings" as any)
      .upsert({ key, value }, { onConflict: "key" });
    if (error) throw error;
  },

  async getAll(): Promise<{ key: string; value: string; description: string }[]> {
    const { data, error } = await supabase
      .from("site_settings" as any)
      .select("*")
      .order("key");
    if (error) throw error;
    return (data ?? []) as any[];
  },

  async isFreePlanOpen(): Promise<boolean> {
    const val = await siteSettingsApi.get("free_plan_open");
    return val !== "false";
  },
};
