import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home, Calendar, Video, Wallet, Gift, ExternalLink, User as UserIcon,
  Shield, LogOut, Menu, MessageSquare, Crown,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import BottomNav from "@/components/layout/BottomNav";
import NotificationBell from "@/components/layout/NotificationBell";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { to: "/app", label: "Home", icon: Home, end: true },
  { to: "/app/agenda", label: "Agenda de Lives", icon: Calendar },
  { to: "/app/gravadas", label: "Lives Gravadas", icon: Video },
  { to: "/app/carteira", label: "Minha Carteira", icon: Wallet },
  { to: "/app/indique", label: "Indique e Ganhe", icon: Gift },
  { to: "/app/depoimentos", label: "Depoimentos", icon: MessageSquare },
];

export default function DashboardLayout() {
  const { user, logout, isAdmin, isPremium } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const initials =
    user?.name?.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() ?? "U";

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar — hidden on mobile, BottomNav replaces it */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 z-40 h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar transition-transform",
          isMobile ? "-translate-x-full" : (open ? "translate-x-0" : "-translate-x-full lg:translate-x-0")
        )}
      >
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <Logo className="h-5" />
          <p className="text-[9px] uppercase tracking-widest text-muted-foreground">Premium</p>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-foreground shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}

          {isPremium && (
            <NavLink
              to="/app/premium"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary shadow-soft"
                    : "text-primary hover:bg-primary/10"
                )
              }
            >
              <Crown className="h-4 w-4" />
              Lives Premium
            </NavLink>
          )}

          <a
            href="https://members.example.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            Área de Membros
          </a>

          <NavLink
            to="/app/perfil"
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-foreground shadow-soft"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
              )
            }
          >
            <UserIcon className="h-4 w-4" />
            Perfil
          </NavLink>

          {isAdmin && (
            <>
              <div className="my-3 h-px bg-sidebar-border" />
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Admin
              </p>
              <NavLink
                to="/app/admin"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-foreground"
                  )
                }
              >
                <Shield className="h-4 w-4" />
                Painel Admin
              </NavLink>
            </>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-3">
          <div className="rounded-lg bg-sidebar-accent/50 p-3 text-xs text-muted-foreground">
            <p className="flex items-center gap-1.5 font-medium text-foreground">
              {user?.plan === "premium" && <Crown className="h-3 w-3 text-primary" />}
              {user?.is_gold && <span className="text-amber-400">✦</span>}
              Plano {user?.plan === "premium" ? "Premium" : "Free"}
              {user?.is_gold && " · Gold"}
            </p>
            <p className="mt-0.5">{user?.plan === "free" ? "Limite de 5 sessões" : "Acesso ilimitado"}</p>
          </div>
        </div>
      </aside>

      {/* Sidebar overlay — only for non-mobile when sidebar is manually opened */}
      {open && !isMobile && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-border bg-background/80 px-4 backdrop-blur lg:h-16 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Hamburger only on desktop when sidebar is hidden (edge case) — mobile uses BottomNav */}
            {!isMobile && (
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((v) => !v)}>
                <Menu className="h-5 w-5" />
              </Button>
            )}
            {isMobile && (
              <Logo className="h-4" />
            )}
            <h1 className="text-sm font-semibold tracking-tight lg:text-lg">
              {currentTitle(location.pathname)}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border border-border bg-card px-1.5 py-1 transition hover:border-primary/40 sm:gap-3 sm:px-2 sm:py-1.5">
                  <span className="hidden text-right sm:block">
                    <span className="block text-xs font-medium leading-tight">{user?.name}</span>
                    <span className="block text-[10px] text-muted-foreground">{user?.email}</span>
                  </span>
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                    <AvatarImage src={user?.avatar_url ?? undefined} alt={user?.name} />
                    <AvatarFallback className="bg-primary text-[10px] font-bold text-primary-foreground sm:text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/app/perfil")}>
                  <UserIcon className="mr-2 h-4 w-4" /> Perfil
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/app/admin")}>
                    <Shield className="mr-2 h-4 w-4" /> Painel Admin
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className={cn("flex-1 px-4 py-5 lg:px-8 lg:py-8", isMobile && "pb-[80px]")}>
          <div className="mx-auto max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Bottom Nav — mobile only */}
      {isMobile && <BottomNav />}
    </div>
  );
}

function currentTitle(path: string): string {
  if (path === "/app" || path === "/app/") return "Dashboard";
  if (path.startsWith("/app/agenda")) return "Agenda de Lives";
  if (path.startsWith("/app/gravadas")) return "Lives Gravadas";
  if (path.startsWith("/app/carteira")) return "Minha Carteira";
  if (path.startsWith("/app/indique")) return "Indique e Ganhe";
  if (path.startsWith("/app/depoimentos")) return "Depoimentos";
  if (path.startsWith("/app/perfil")) return "Perfil";
  if (path.startsWith("/app/premium")) return "Lives Premium";
  if (path.startsWith("/app/admin")) return "Painel Administrativo";
  return "RZ TRADER STUDIO";
}
