import { supabase } from "@/integrations/supabase/client";
import type { Carteira, Convite, Depoimento, Live, Sessao, Profile } from "@/types";

// ============= Carteira =============
export const carteiraApi = {
  async byUser(userId: string): Promise<Carteira | null> {
    const { data, error } = await supabase
      .from("carteiras")
      .select("user_id, banca_inicial, saldo_atual")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
      user_id: data.user_id,
      banca_inicial: Number(data.banca_inicial),
      saldo_atual: Number(data.saldo_atual),
    };
  },
  async setBancaInicial(userId: string, banca: number): Promise<void> {
    const { error } = await supabase
      .from("carteiras")
      .upsert({ user_id: userId, banca_inicial: banca, saldo_atual: banca });
    if (error) throw error;
  },
};

// ============= Sessões =============
export const sessoesApi = {
  async byUser(userId: string): Promise<Sessao[]> {
    const { data, error } = await supabase
      .from("sessoes")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((s) => ({
      ...s,
      ganhos: Number(s.ganhos),
      perdas: Number(s.perdas),
      resultado: Number(s.resultado),
    })) as Sessao[];
  },
  async add(userId: string, payload: { entradas: number; ganhos: number; perdas: number; duracao: number }): Promise<void> {
    const { error } = await supabase.from("sessoes").insert({
      user_id: userId,
      entradas: payload.entradas,
      ganhos: payload.ganhos,
      perdas: payload.perdas,
      duracao: payload.duracao,
      resultado: 0, // trigger recalcula
    });
    if (error) throw error;
  },
  async count(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from("sessoes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);
    if (error) throw error;
    return count ?? 0;
  },
};

// ============= Lives =============
export const livesApi = {
  async list(): Promise<Live[]> {
    const { data, error } = await supabase
      .from("lives")
      .select("*")
      .order("data", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapLive);
  },
  async upcoming(includePremium: boolean): Promise<Live[]> {
    let q = supabase
      .from("lives")
      .select("*")
      .neq("status", "finalizada")
      .order("data", { ascending: true });
    if (!includePremium) q = q.eq("is_premium", false);
    const { data, error } = await q;
    if (error) throw error;
    return (data ?? []).map(mapLive);
  },
  async finalizadas(): Promise<Live[]> {
    const { data, error } = await supabase
      .from("lives")
      .select("*")
      .eq("status", "finalizada")
      .order("data", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapLive);
  },
  async premiumUpcoming(): Promise<Live[]> {
    const { data, error } = await supabase
      .from("lives")
      .select("*")
      .eq("is_premium", true)
      .neq("status", "finalizada")
      .order("data", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(mapLive);
  },
  async create(payload: Omit<Live, "id">): Promise<void> {
    const { error } = await supabase.from("lives").insert({
      titulo: payload.titulo,
      descricao: payload.descricao ?? null,
      link: payload.link,
      data: payload.data,
      status: payload.status,
      is_premium: payload.is_premium,
    });
    if (error) throw error;
  },
  async update(id: string, patch: Partial<Live>): Promise<void> {
    const { error } = await supabase.from("lives").update(patch as any).eq("id", id);
    if (error) throw error;
  },
  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("lives").delete().eq("id", id);
    if (error) throw error;
  },
};

function mapLive(d: any): Live {
  return {
    id: d.id,
    titulo: d.titulo,
    descricao: d.descricao,
    link: d.link,
    data: d.data,
    status: d.status,
    is_premium: !!d.is_premium,
    ganhos: d.ganhos !== null ? Number(d.ganhos) : null,
    perdas: d.perdas !== null ? Number(d.perdas) : null,
    caixa_final: d.caixa_final !== null ? Number(d.caixa_final) : null,
  };
}

// ============= Convites =============
export const convitesApi = {
  async byUser(userId: string): Promise<Convite> {
    const { data, error } = await supabase
      .from("convites")
      .select("user_id, quantidade")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return data ?? { user_id: userId, quantidade: 0 };
  },
  async listAll(): Promise<Convite[]> {
    const { data, error } = await supabase.from("convites").select("user_id, quantidade");
    if (error) throw error;
    return data ?? [];
  },
  async setQuantidade(userId: string, quantidade: number): Promise<void> {
    const { error } = await supabase.from("convites").upsert({ user_id: userId, quantidade });
    if (error) throw error;
  },
};

// ============= Depoimentos =============
export const depoimentosApi = {
  async list(): Promise<Depoimento[]> {
    const { data, error } = await supabase
      .from("depoimentos")
      .select("*, profiles(name)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((d: any) => ({
      id: d.id,
      user_id: d.user_id,
      tipo: d.tipo,
      conteudo: d.conteudo,
      created_at: d.created_at,
      user_name: d.profiles?.name ?? "Usuário",
    }));
  },
  async add(userId: string, conteudo: string): Promise<void> {
    const { error } = await supabase
      .from("depoimentos")
      .insert({ user_id: userId, tipo: "texto", conteudo });
    if (error) throw error;
  },
};

// ============= Expert status =============
export const expertApi = {
  async isOnline(): Promise<boolean> {
    const { data, error } = await supabase
      .from("expert_status")
      .select("online")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw error;
    return !!data?.online;
  },
  async set(online: boolean): Promise<void> {
    const { error } = await supabase
      .from("expert_status")
      .update({ online, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) throw error;
  },
};

// ============= Admin: usuários =============
export const adminApi = {
  async listUsers(): Promise<(Profile & { role: "admin" | "user" })[]> {
    const [{ data: profiles, error: pErr }, { data: roles, error: rErr }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    if (pErr) throw pErr;
    if (rErr) throw rErr;
    const adminSet = new Set((roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id));
    return (profiles ?? []).map((p: any) => ({
      ...p,
      role: adminSet.has(p.id) ? "admin" : "user",
    }));
  },
  async updatePlan(userId: string, plan: "free" | "premium"): Promise<void> {
    const { error } = await supabase.from("profiles").update({ plan }).eq("id", userId);
    if (error) throw error;
  },
  async updateStatus(userId: string, status: "active" | "inactive"): Promise<void> {
    const { error } = await supabase.from("profiles").update({ status }).eq("id", userId);
    if (error) throw error;
  },
  async createUser(payload: { email: string; name?: string; plan?: "free" | "premium"; password?: string }): Promise<{ password?: string }> {
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action: "create", ...payload },
    });
    if (error) throw new Error(error.message);
    if ((data as any)?.error) throw new Error((data as any).error);
    return { password: (data as any)?.password };
  },
  async deleteUser(userId: string): Promise<void> {
    const { data, error } = await supabase.functions.invoke("admin-users", {
      body: { action: "delete", user_id: userId },
    });
    if (error) throw new Error(error.message);
    if ((data as any)?.error) throw new Error((data as any).error);
  },
  async updateGold(userId: string, isGold: boolean): Promise<void> {
    const { error } = await supabase.from("profiles").update({ is_gold: isGold } as any).eq("id", userId);
    if (error) throw error;
  },
  async getUserScores(): Promise<any[]> {
    const { data, error } = await supabase
      .from("user_scores")
      .select("*")
      .order("score", { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
};

// ============= Ranking =============
export const rankingApi = {
  async topLucro(limit = 10): Promise<import("@/types").RankingEntry[]> {
    // Get all profiles with their sessoes aggregated
    const [{ data: profiles, error: pErr }, { data: sessoes, error: sErr }] = await Promise.all([
      supabase.from("profiles").select("id, name, avatar_url, plan, is_gold").eq("status", "active"),
      supabase.from("sessoes").select("user_id, resultado"),
    ]);
    if (pErr) throw pErr;
    if (sErr) throw sErr;

    // Aggregate lucro per user
    const lucroMap = new Map<string, { total: number; count: number }>();
    for (const s of sessoes ?? []) {
      const prev = lucroMap.get(s.user_id) ?? { total: 0, count: 0 };
      lucroMap.set(s.user_id, {
        total: prev.total + Number(s.resultado),
        count: prev.count + 1,
      });
    }

    return (profiles ?? [])
      .map((p: any) => ({
        user_id: p.id,
        name: p.name,
        avatar_url: p.avatar_url,
        total_lucro: lucroMap.get(p.id)?.total ?? 0,
        total_sessoes: lucroMap.get(p.id)?.count ?? 0,
        is_gold: !!p.is_gold,
        plan: p.plan,
      }))
      .filter((r) => r.total_sessoes > 0)
      .sort((a, b) => b.total_lucro - a.total_lucro)
      .slice(0, limit);
  },
};
