import { useEffect, useState, useCallback } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { notificationsApi } from "@/services/notificationsApi";
import type { Notification } from "@/types";
import { cn } from "@/lib/utils";

const typeIcon: Record<string, string> = {
  info: "📢", alert: "⚠️", success: "✅", gold: "✦",
  level_up: "🏆", streak: "🔥", risk: "🚨", tip: "💡",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `${days}d`;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const [list, count] = await Promise.all([
        notificationsApi.getMyNotifications(10),
        notificationsApi.unreadCount(),
      ]);
      setNotifications(list);
      setUnread(count);
    } catch {}
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => { if (open) refresh(); }, [open, refresh]);

  async function markRead(id: string) {
    await notificationsApi.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnread((c) => Math.max(0, c - 1));
  }

  async function markAllRead() {
    await notificationsApi.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnread(0);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card transition hover:border-primary/40">
          <Bell className="h-4 w-4 text-muted-foreground" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h4 className="text-sm font-semibold">Notificações</h4>
          {unread > 0 && (
            <Button size="sm" variant="ghost" className="h-7 text-xs text-primary" onClick={markAllRead}>
              <CheckCheck className="mr-1 h-3 w-3" /> Ler tudo
            </Button>
          )}
        </div>
        <div className="max-h-[320px] overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">Nenhuma notificação</p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => !n.read && markRead(n.id)}
                className={cn(
                  "flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-muted/40",
                  !n.read && "bg-primary/[0.04]"
                )}
              >
                <span className="mt-0.5 text-base leading-none">
                  {typeIcon[n.type] ?? "📢"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-xs font-medium leading-tight", !n.read && "text-foreground")}>
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="mt-0.5 text-[11px] text-muted-foreground line-clamp-2">{n.body}</p>
                  )}
                  <p className="mt-1 text-[10px] text-muted-foreground">{timeAgo(n.created_at)}</p>
                </div>
                {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
