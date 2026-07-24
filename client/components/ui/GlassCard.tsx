"use client";
import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> { glow?: boolean; }

export default function GlassCard({ className, glow, children, ...p }: Props) {
  return (
    <div className={cn("rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.07] transition-all duration-300",glow&&"shadow-[0_0_50px_rgba(139,92,246,0.12)]",className)} {...p}>
      {children}
    </div>
  );
}
