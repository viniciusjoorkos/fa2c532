import { useState, useEffect } from "react";

/**
 * Hook that returns a countdown string and whether the link should be active.
 * Rules:
 * - If live is "ao_vivo" → always active
 * - If live is "agendada" and time until start ≤ 10 min → active (if link exists)
 * - Otherwise → show countdown HH:MM:SS
 */
export function useLiveCountdown(liveDate: string, status: string, link?: string | null) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(liveDate);
  const diffMs = target.getTime() - now.getTime();
  const diffMin = diffMs / 60000;

  const isLive = status === "ao_vivo";
  const isFinished = status === "finalizada";
  const canEnter = isLive || (diffMin <= 10 && diffMin > -120 && !!link);

  // Format countdown
  let countdown = "";
  if (!isLive && !isFinished && diffMs > 0) {
    const totalSec = Math.floor(diffMs / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    countdown = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  // Within 10 min but no link
  const waitingLink = diffMin <= 10 && diffMin > -120 && !link && !isLive && !isFinished;

  return {
    countdown,
    canEnter,
    isLive,
    isFinished,
    waitingLink,
    minutesLeft: Math.max(0, Math.ceil(diffMin)),
  };
}
