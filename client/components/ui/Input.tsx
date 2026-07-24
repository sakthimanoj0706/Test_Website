"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, Props>(({ className,label,error,icon,...p },ref) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-sm font-medium text-white/60">{label}</label>}
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">{icon}</span>}
      <input ref={ref} className={cn("w-full rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/25 px-4 py-3 text-sm outline-none transition-all focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 focus:bg-white/[0.06]",icon&&"pl-10",error&&"border-red-500/50",className)} {...p}/>
    </div>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
));
Input.displayName="Input";
export default Input;
