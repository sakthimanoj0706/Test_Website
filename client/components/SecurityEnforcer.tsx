"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isActive: boolean; // only enforce strictly when the challenge is active
  onViolation: (reason: string) => void;
  children: React.ReactNode;
}

export default function SecurityEnforcer({ isActive, onViolation, children }: Props) {
  const [violationReason, setViolationReason] = useState<string | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const handleViolation = (reason: string) => {
      setViolationReason(reason);
      onViolation(reason);
    };

    // 1. Disable Context Menu
    const onContextMenu = (e: Event) => {
      e.preventDefault();
      handleViolation("Right-click is disabled during the assessment.");
    };

    // 2. Disable Copy/Paste/Cut/Drag
    const onCopyPaste = (e: Event) => {
      e.preventDefault();
      handleViolation("Copying, pasting, and dragging are strictly prohibited.");
    };

    // 3. Prevent specific keystrokes
    const onKeyDown = (e: KeyboardEvent) => {
      const forbiddenKeys = ["F1", "F3", "F5", "F6", "F7", "F11", "F12"];
      const ctrlRestricted = ["c", "v", "x", "a", "s", "p", "u", "f", "+", "-", "="];
      
      // Ctrl/Cmd + Shift combos (DevTools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c", "k"].includes(e.key.toLowerCase())) {
        e.preventDefault();
        handleViolation("Developer tools are disabled.");
        return;
      }

      // Ctrl/Cmd combos
      if ((e.ctrlKey || e.metaKey) && ctrlRestricted.includes(e.key.toLowerCase())) {
        e.preventDefault();
        handleViolation("Keyboard shortcuts are disabled.");
        return;
      }

      // Function keys
      if (forbiddenKeys.includes(e.key)) {
        e.preventDefault();
        handleViolation(`The ${e.key} key is disabled.`);
        return;
      }
    };

    // 4. Mouse wheel zoom (Ctrl + scroll)
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    // 5. Visibility and Blur
    const onVisibilityChange = () => {
      if (document.hidden) {
        handleViolation("You switched tabs or minimized the window.");
      }
    };

    const onBlur = () => {
      handleViolation("The window lost focus. Ensure you remain on this screen.");
    };

    // 6. Fullscreen exit detection
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleViolation("Full screen mode was exited.");
      }
    };

    // 7. Page unload / refresh attempt
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      handleViolation("Refreshing the page is not allowed.");
    };

    // Attach events
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("copy", onCopyPaste);
    document.addEventListener("cut", onCopyPaste);
    document.addEventListener("paste", onCopyPaste);
    document.addEventListener("dragstart", onCopyPaste);
    document.addEventListener("keydown", onKeyDown, { capture: true });
    document.addEventListener("wheel", onWheel, { passive: false });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("copy", onCopyPaste);
      document.removeEventListener("cut", onCopyPaste);
      document.removeEventListener("paste", onCopyPaste);
      document.removeEventListener("dragstart", onCopyPaste);
      document.removeEventListener("keydown", onKeyDown, { capture: true });
      document.removeEventListener("wheel", onWheel);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      window.removeEventListener("beforeunload", onBeforeUnload);
    };
  }, [isActive, onViolation]);

  return (
    <div className="select-none h-full w-full">
      {children}
    </div>
  );
}
