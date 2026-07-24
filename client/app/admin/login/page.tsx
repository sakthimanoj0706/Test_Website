"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, EyeOff, ChevronLeft, Zap } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/lib/api";
import { setAuth } from "@/lib/auth";
import Particles from "@/components/layout/Particles";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import GlassCard from "@/components/ui/GlassCard";

export default function AdminLoginPage() {
  const router = useRouter();
  const [user, setUser]     = useState("");
  const [pass, setPass]     = useState("");
  const [show, setShow]     = useState(false);
  const [loading, setLoad]  = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.trim() || !pass) { toast.error("Fill in all fields"); return; }
    setLoad(true);
    try {
      const res = await authApi.adminLogin(user.trim(), pass);
      setAuth(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.username}!`);
      setTimeout(() => router.push("/admin"), 400);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally { setLoad(false); }
  };

  return (
    <div className="relative min-h-screen bg-[#050509] flex items-center justify-center px-4">
      <Particles count={50}/>
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-purple-600/8 blur-[120px] pointer-events-none"/>

      <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.6}} className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 mb-8 transition-colors">
          <ChevronLeft size={15}/>Back to home
        </Link>

        <GlassCard className="p-8" glow>
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl shadow-purple-500/30 mb-4">
              <Zap size={22} className="text-white"/>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Access</h1>
            <p className="text-sm text-white/40 mt-1">Sign in to manage questions</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <Input label="Username" placeholder="admin" value={user} onChange={e=>setUser(e.target.value)} icon={<Shield size={15}/>} autoComplete="username"/>
            <div className="relative">
              <Input label="Password" type={show?"text":"password"} placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)} icon={<Lock size={15}/>} autoComplete="current-password"/>
              <button type="button" onClick={()=>setShow(!show)} className="absolute right-3 bottom-3 text-white/30 hover:text-white/60 transition-colors">{show?<EyeOff size={15}/>:<Eye size={15}/>}</button>
            </div>
            <Button type="submit" className="w-full mt-2" size="lg" loading={loading}>Enter Admin Panel</Button>
          </form>

          <p className="text-center text-xs text-yellow-400/60 mt-6">Default: admin / Admin@2024</p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
