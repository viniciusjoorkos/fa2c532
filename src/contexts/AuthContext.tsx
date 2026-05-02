import { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import type { AuthUser, UserPlan, UserStatus, UserRole } from "@/types";

interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (patch: { name?: string; avatar_url?: string | null }) => Promise<{ ok: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ ok: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
  isAdmin: boolean;
  isPremium: boolean;
  isPro: boolean;
  isGold: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function loadAuthUser(userId: string, email: string): Promise<AuthUser | null> {
  const [{ data: profile }, { data: roleRows }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", userId),
  ]);
  if (!profile) return null;
  const isAdmin = (roleRows ?? []).some((r) => r.role === "admin");
  return {
    id: profile.id,
    email: profile.email ?? email,
    name: profile.name,
    avatar_url: profile.avatar_url,
    plan: profile.plan as UserPlan,
    status: profile.status as UserStatus,
    is_gold: !!(profile as any).is_gold,
    created_at: profile.created_at,
    role: (isAdmin ? "admin" : "user") as UserRole,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const hydrate = useCallback(async (s: Session | null) => {
    setSession(s);
    if (s?.user) {
      const u = await loadAuthUser(s.user.id, s.user.email ?? "");
      setUser(u);
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let initialized = false;
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, s) => {
      // After initial load, hydrate on every change
      if (initialized) hydrate(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      hydrate(data.session).finally(() => {
        initialized = true;
        setLoading(false);
      });
    });
    return () => sub.subscription.unsubscribe();
  }, [hydrate]);

  const refreshUser = async () => {
    if (session?.user) {
      const u = await loadAuthUser(session.user.id, session.user.email ?? "");
      setUser(u);
    }
  };

  const login: AuthContextValue["login"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  };

  const signup: AuthContextValue["signup"] = async (name, email, password) => {
    if (password.length < 6) return { ok: false, error: "Senha deve ter ao menos 6 caracteres." };
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/app`,
        data: { name: name.trim() },
      },
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateProfile: AuthContextValue["updateProfile"] = async (patch) => {
    if (!user) return { ok: false, error: "Não autenticado." };
    const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
    if (error) return { ok: false, error: error.message };
    setUser({ ...user, ...patch });
    return { ok: true };
  };

  const updatePassword: AuthContextValue["updatePassword"] = async (newPassword) => {
    if (newPassword.length < 6) return { ok: false, error: "Senha deve ter ao menos 6 caracteres." };
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      login,
      signup,
      logout,
      updateProfile,
      updatePassword,
      refreshUser,
      isAdmin: user?.role === "admin",
      isPremium: user?.plan === "premium" || user?.plan === "pro" || user?.plan === "gold" || user?.role === "admin",
      isPro: user?.plan === "pro" || user?.plan === "gold" || user?.role === "admin",
      isGold: user?.plan === "gold" || !!(user?.is_gold) || user?.role === "admin",
    }),
    [user, session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
