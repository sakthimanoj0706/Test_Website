"use client";
import { useEffect } from "react";
import { challengeApi } from "@/lib/api";

const log = (e: string) => { try { challengeApi.logEvent(e); } catch {} };

export function useSecurity(enabled: boolean) {
  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const noCtx   = (e: MouseEvent)    => e.preventDefault();
    const noCopy  = (e: ClipboardEvent)=> { e.preventDefault(); log("copy"); };
    const noPaste = (e: ClipboardEvent)=> { e.preventDefault(); log("paste"); };
    const noCut   = (e: ClipboardEvent)=> { e.preventDefault(); };
    const noDrag  = (e: DragEvent)     => e.preventDefault();
    const noBlur  = ()                 => log("blur");
    const noVis   = ()                 => { if (document.hidden) log("tab"); };

    const noKey = (e: KeyboardEvent) => {
      const c = e.ctrlKey || e.metaKey, s = e.shiftKey, k = e.key.toLowerCase();
      if (c && ["c","v","x","a","s","p","u"].includes(k))  { e.preventDefault(); if(k==="c") log("copy"); if(k==="v") log("paste"); return; }
      if (c && s && ["i","j","c","k"].includes(k))          { e.preventDefault(); log("devtools"); return; }
      if (["F5","F11","F12","F1","F3","F6","F7"].includes(e.key)) { e.preventDefault(); if(e.key==="F12") log("devtools"); return; }
    };

    document.addEventListener("contextmenu", noCtx);
    document.addEventListener("copy",  noCopy);
    document.addEventListener("paste", noPaste);
    document.addEventListener("cut",   noCut);
    document.addEventListener("dragstart", noDrag);
    document.addEventListener("drop",      noDrag);
    document.addEventListener("keydown",   noKey);
    window.addEventListener("blur",        noBlur);
    document.addEventListener("visibilitychange", noVis);

    document.body.style.userSelect = "none";
    document.documentElement.setAttribute("translate","no");

    const dtTimer = setInterval(() => {
      if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160)
        log("devtools");
    }, 2000);

    return () => {
      document.removeEventListener("contextmenu", noCtx);
      document.removeEventListener("copy",  noCopy);
      document.removeEventListener("paste", noPaste);
      document.removeEventListener("cut",   noCut);
      document.removeEventListener("dragstart", noDrag);
      document.removeEventListener("drop",      noDrag);
      document.removeEventListener("keydown",   noKey);
      window.removeEventListener("blur",        noBlur);
      document.removeEventListener("visibilitychange", noVis);
      document.body.style.userSelect = "";
      clearInterval(dtTimer);
    };
  }, [enabled]);
}
