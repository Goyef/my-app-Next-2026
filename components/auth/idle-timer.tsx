"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

const IDLE_TIME = 60 * 1000 * 15; // 15 minutes en millisecondes

export function IdleTimer() {
  const router = useRouter();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback(() => {
    fetch("/api/auth/logout", { method: "POST" }).then(() => {
      router.push("/login");
      router.refresh();
    });
  }, [router]);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(logout, IDLE_TIME);
  }, [logout]);

  useEffect(() => {
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];

    resetTimer();
    events.forEach((event) => document.addEventListener(event, resetTimer));

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => document.removeEventListener(event, resetTimer));
    };
  }, [resetTimer]);

  return null;
}