import { supabase } from "@/integrations/supabase/client";
import type { Notification, NotificationType } from "@/types";

export const notificationsApi = {
  async getMyNotifications(limit = 15): Promise<Notification[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as unknown as Notification[];
  },

  async unreadCount(): Promise<number> {
    const { count, error } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("read", false);
    if (error) throw error;
    return count ?? 0;
  },

  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true } as any)
      .eq("id", id);
    if (error) throw error;
  },

  async markAllRead(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from("notifications")
      .update({ read: true } as any)
      .eq("user_id", user.id)
      .eq("read", false);
    if (error) throw error;
  },

  // Admin: send to one user
  async adminSend(
    userId: string,
    title: string,
    body: string,
    type: NotificationType = "info"
  ): Promise<void> {
    const { error } = await supabase.from("notifications").insert({
      user_id: userId,
      title,
      body,
      type,
    } as any);
    if (error) throw error;
  },

  // Admin: broadcast to all active users
  async adminBroadcast(
    title: string,
    body: string,
    type: NotificationType = "info"
  ): Promise<void> {
    const { data: profiles, error: pErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("status", "active");
    if (pErr) throw pErr;
    if (!profiles?.length) return;

    const rows = profiles.map((p: any) => ({
      user_id: p.id,
      title,
      body,
      type,
    }));
    const { error } = await supabase.from("notifications").insert(rows as any);
    if (error) throw error;
  },

  // Admin: list all sent notifications
  async adminListAll(limit = 50): Promise<(Notification & { user_name?: string })[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*, profiles(name)")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map((n: any) => ({
      ...n,
      user_name: n.profiles?.name ?? "Usuário",
    })) as any;
  },
};

// Pre-built notification templates
export const NOTIFICATION_TEMPLATES = [
  {
    key: "risk_alert",
    label: "🚨 Alerta de banca de risco",
    title: "Atenção: banca em zona de risco",
    body: "Sua banca está em uma zona delicada. Recomendamos pausa e revisão da sua gestão de risco antes de continuar operando.",
    type: "risk" as NotificationType,
  },
  {
    key: "streak_congrats",
    label: "🎉 Parabéns pela frequência",
    title: "Mandou bem na disciplina!",
    body: "Você está mantendo uma sequência incrível de dias operando com disciplina. Continue assim, consistência é a chave.",
    type: "streak" as NotificationType,
  },
  {
    key: "level_up",
    label: "🏆 Subiu de nível",
    title: "Parabéns! Novo nível desbloqueado",
    body: "Seu desempenho te levou a um novo patamar. Continue assim e alcance o topo do ranking.",
    type: "level_up" as NotificationType,
  },
  {
    key: "gold_invite",
    label: "✦ Convite Gold",
    title: "Você é TOP 2 da quinzena!",
    body: "Parabéns! Seu desempenho te colocou no Top 2 do ranking quinzenal. Bem-vindo às sessões Gold — acesso exclusivo e restrito.",
    type: "gold" as NotificationType,
  },
  {
    key: "tip",
    label: "💡 Dica do dia",
    title: "Dica para melhorar sua operação",
    body: "",
    type: "tip" as NotificationType,
  },
  {
    key: "custom",
    label: "📢 Aviso personalizado",
    title: "",
    body: "",
    type: "info" as NotificationType,
  },
] as const;
