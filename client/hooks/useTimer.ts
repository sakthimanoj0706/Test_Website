"use client";
import { useState, useEffect, useRef } from "react";

export function useTimer(studentId: string, durationSeconds: number) {
  const startKey = `waec_ts_start_${studentId}`;
  const durKey   = `waec_ts_dur_${studentId}`;

  const getRem = () => {
    if (typeof window === "undefined") return durationSeconds;
    const st = localStorage.getItem(startKey);
    const du = localStorage.getItem(durKey);
    if (!st || !du) return durationSeconds;
    const elapsed = Math.floor((Date.now() - parseInt(st)) / 1000);
    return Math.max(parseInt(du) - elapsed, 0);
  };

  const [rem, setRem] = useState<number>(durationSeconds);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!studentId) return;
    if (!localStorage.getItem(startKey)) {
      localStorage.setItem(startKey, Date.now().toString());
      localStorage.setItem(durKey,   durationSeconds.toString());
    }
    setRem(getRem());
    ref.current = setInterval(() => setRem(getRem()), 500);
    return () => clearInterval(ref.current!);
  }, [studentId, durationSeconds]);

  const pct = Math.min(100, Math.floor(((durationSeconds - rem) / durationSeconds) * 100));

  const color = rem > durationSeconds * 0.5
    ? "text-green-400"
    : rem > durationSeconds * 0.25
    ? "text-yellow-400"
    : rem > 10
    ? "text-orange-400"
    : "text-red-400";

  const ringColor = rem > durationSeconds * 0.5
    ? "#22c55e"
    : rem > durationSeconds * 0.25
    ? "#eab308"
    : rem > 10
    ? "#f97316"
    : "#ef4444";

  return { rem, expired: rem === 0, pct, color, ringColor };
}
