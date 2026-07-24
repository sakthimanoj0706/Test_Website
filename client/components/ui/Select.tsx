"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string; error?: string; options: {value:string;label:string}[];
}

const Select = forwardRef<HTMLSelectElement, Props>(({ className,label,error,options,...p },ref) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-sm font-medium text-white/60">{label}</label>}
    <select ref={ref} className={cn("w-full rounded-xl bg-white/[0.04] border border-white/[0.08] text-white px-4 py-3 text-sm outline-none transition-all focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/10 [&>option]:bg-[#0f0f18] [&>option]:text-white",error&&"border-red-500/50",className)} {...p}>
      <option value="">Select…</option>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
));
Select.displayName="Select";
export default Select;
