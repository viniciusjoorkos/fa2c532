import { NavLink, useLocation } from "react-router-dom";
import { Home, Wallet, Radio, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { livesApi } from "@/services/api";
import { notificationsApi } from "@/services/notificationsApi";

const tabs = [
  { to: "/app", icon: Home, label: "Home", end: true },
  { to: "/app/carteira", icon: Wallet, label: "Carteira" },
  { to: "/app/agenda", icon: Radio, label: "Lives" },
  { to: "/app/chat", icon: MessageSquare, label: "Chat" },
  { to: "/app/perfil", icon: User, label: "Perfil" },
];

export default function BottomNav() {
  const location = useLocation();
  const [hasLiveNow, setHasLiveNow] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    livesApi.upcoming(true).then((lives) => {
      setHasLiveNow(lives.some((l) => l.status === "ao_vivo"));
    }).catch(() => {});
    notificationsApi.unreadCount().then(setUnread).catch(() => {});
  }, [location.pathname]);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 flex h-[68px] items-end border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
      <div className="flex w-full items-center justify-around pb-1">
        {tabs.map((tab) => {
          const isActive = tab.end
            ? location.pathname === tab.to || location.pathname === tab.to + "/"
            : location.pathname.startsWith(tab.to);

          const isLives = tab.to === "/app/agenda";
          const isHome = tab.to === "/app" && tab.end;

          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className="relative flex flex-col items-center gap-0.5 px-3 py-2"
            >
              <div className="relative">
                <tab.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                {/* Live pulsante */}
                {isLives && hasLiveNow && (
                  <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary animate-pulse" />
                )}
                {/* Notification badge */}
                {isHome && unread > 0 && (
                  <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold text-white">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {tab.label}
              </span>
              {/* Active indicator line */}
              {isActive && (
                <span className="absolute -top-px left-1/2 h-[2px] w-8 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
