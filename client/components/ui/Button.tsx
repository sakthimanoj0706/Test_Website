"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary"|"ghost"|"outline"|"danger";
  size?: "sm"|"md"|"lg";
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, BtnProps>(
  ({ className, variant="primary", size="md", loading, children, disabled, ...p }, ref) => {
    const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 relative overflow-hidden select-none cursor-pointer";
    const v = {
      primary: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 hover:-translate-y-0.5 shadow-lg shadow-purple-500/20",
      ghost:   "text-white/60 hover:text-white hover:bg-white/5",
      outline: "border border-white/10 text-white/70 hover:text-white hover:border-purple-500/50 hover:bg-white/5",
      danger:  "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20",
    };
    const s = { sm:"px-4 py-2 text-sm gap-1.5", md:"px-5 py-2.5 text-sm gap-2", lg:"px-7 py-3.5 text-base gap-2" };
    return (
      <button ref={ref} disabled={disabled||loading} className={cn(base,v[variant],s[size],(disabled||loading)&&"opacity-50 cursor-not-allowed",className)} {...p}>
        <span className="absolute inset-0 -translate-x-full hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"/>
        {loading ? (<><svg className="animate-spin h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>Loading…</>) : children}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
