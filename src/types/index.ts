export type UserRole = "user" | "admin";
export type UserPlan = "free" | "premium" | "pro" | "gold";
export type UserStatus = "active" | "inactive";

export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar_url?: string | null;
  plan: UserPlan;
  status: UserStatus;
  is_gold?: boolean;
  created_at: string;
}

export interface AuthUser extends Profile {
  role: UserRole;
}

export interface Carteira {
  user_id: string;
  banca_inicial: number;
  saldo_atual: number;
}

export interface Sessao {
  id: string;
  user_id: string;
  entradas: number;
  ganhos: number;
  perdas: number;
  duracao: number;
  resultado: number;
  created_at: string;
}

export type LiveStatus = "agendada" | "ao_vivo" | "finalizada";

export interface Live {
  id: string;
  titulo: string;
  descricao?: string | null;
  link: string;
  data: string;
  status: LiveStatus;
  is_premium: boolean;
  plan_access?: string[];
  ganhos?: number | null;
  perdas?: number | null;
  caixa_final?: number | null;
}

export interface Convite {
  user_id: string;
  quantidade: number;
}

export type DepoimentoTipo = "texto" | "video";

export interface Depoimento {
  id: string;
  user_id: string;
  tipo: DepoimentoTipo;
  conteudo: string;
  created_at: string;
  user_name?: string;
}

export type Nivel = "Iniciante" | "Bronze" | "Prata" | "Ouro";

// ===== v2.0 additions =====

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type NotificationType =
  | "info"
  | "alert"
  | "success"
  | "gold"
  | "level_up"
  | "streak"
  | "risk"
  | "tip";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  type: NotificationType;
  read: boolean;
  created_at: string;
}

export interface UserScore {
  user_id: string;
  score: number;
  last_login: string | null;
  login_streak: number;
  updated_at: string;
}

export interface RankingEntry {
  user_id: string;
  name: string;
  avatar_url?: string | null;
  total_lucro: number;
  total_sessoes: number;
  is_gold: boolean;
  plan: UserPlan;
}
