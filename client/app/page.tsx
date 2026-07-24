"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Shield, Clock, Key, ChevronDown, ChevronRight, Mail, MapPin, Phone, ArrowRight, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import Particles from "@/components/layout/Particles";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const up = { hidden:{opacity:0,y:30}, visible:(i=0)=>({ opacity:1,y:0, transition:{duration:.6,delay:i*.09,ease:"easeOut"} }) };

const FAQS = [
  { q:"Who can participate?",            a:"Any student with a valid access code." },
  { q:"How do I get an access code?",    a:"Access codes are provided by the organizers." },
  { q:"Is the challenge read-only?",     a:"Yes. You only read the assigned scenario. There is nothing to type or upload." },
];

export default function Home() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnterCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Please enter an access code");
      return;
    }
    
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${API_URL}/questions/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() })
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success("Code accepted!");
        // Store participant name for later use
        if (name.trim()) sessionStorage.setItem('participant_name', name.trim());
        router.push(`/challenge/${code.trim()}`);
      } else {
        toast.error(data.message || "Invalid access code");
      }
    } catch (err) {
      toast.error("Failed to verify code. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050509] overflow-x-hidden">
      <Particles />

      {/* ── NAV ── */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Zap size={16} className="text-white"/>
          </div>
          <span className="font-bold text-white tracking-tight">WEB <span className="text-purple-400">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-1">
          {["#about","#faq"].map((h,i)=>( <a key={i} href={h} className="px-4 py-2 text-sm text-white/50 hover:text-white rounded-lg hover:bg-white/5 transition-all capitalize">{h.replace("#","")}</a> ))}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-[90vh] flex items-center justify-center text-center px-4">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/8 blur-[140px] pointer-events-none"/>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-blue-600/8 blur-[120px] pointer-events-none"/>

        <div className="max-w-4xl">
          <motion.div initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}} transition={{duration:.6}}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-medium mb-8">
            <Zap size={13}/> WEB AI Engineering Club
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>Live
          </motion.div>

          <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.1}}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Code<br/>
            <span className="gradient-text">Challenge</span>
          </motion.h1>

          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.2}}
            className="text-lg text-white/45 max-w-xl mx-auto mb-10 leading-relaxed">
            Enter your secret access code to reveal your challenge question.
          </motion.p>

          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.3}}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <form onSubmit={handleEnterCode} className="w-full flex flex-col gap-2">
              <div className="flex gap-2">
                <Input 
                  icon={<User size={16} />}
                  placeholder="Enter Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1"
                  required
                />
                <Input 
                  icon={<Key size={16} />}
                  placeholder="Enter Access Code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1"
                  required
                />
              </div>
              <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Enter"}
              </Button>
            </form>
          </motion.div>
        </div>

        <motion.div animate={{y:[0,8,0]}} transition={{repeat:Infinity,duration:2}} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20">
          <ChevronDown size={22}/>
        </motion.div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="section-padding relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={up as any} initial="hidden" whileInView="visible" viewport={{once:true}} className="text-center mb-14">
            <span className="badge badge-purple mb-4">About</span>
            <h2 className="text-4xl font-bold text-white mb-4">What is this <span className="gradient-text">Challenge?</span></h2>
            <p className="text-white/45 max-w-2xl mx-auto">A secure platform where you use a code to get a unique challenge scenario.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {[
              {icon:Shield,t:"Fully Secure",d:"Fast, reliable, and straightforward code access.",c:"text-green-400",bg:"bg-green-400/10"},
              {icon:Clock,t:"Timed Event",d:"Complete the challenge within the specified timeframe.",c:"text-blue-400",bg:"bg-blue-400/10"},
            ].map((x,i)=>(
              <motion.div key={x.t} variants={up as any} initial="hidden" whileInView="visible" custom={i} viewport={{once:true}}>
                <GlassCard className="p-6 text-center hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10">
                  <div className={`w-11 h-11 rounded-xl ${x.bg} flex items-center justify-center mx-auto mb-4`}><x.icon size={22} className={x.c}/></div>
                  <h3 className="font-semibold text-white mb-2">{x.t}</h3>
                  <p className="text-sm text-white/45 leading-relaxed">{x.d}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="section-padding relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div variants={up as any} initial="hidden" whileInView="visible" viewport={{once:true}} className="text-center mb-14">
            <span className="badge badge-purple mb-4">FAQ</span>
            <h2 className="text-4xl font-bold text-white mb-4">Common <span className="gradient-text">Questions</span></h2>
          </motion.div>
          <div className="space-y-3">
            {FAQS.map((f,i)=>(
              <motion.div key={i} variants={up as any} initial="hidden" whileInView="visible" custom={i*.06} viewport={{once:true}}>
                <GlassCard className="p-5 hover:-translate-y-0.5 hover:border-purple-500/20">
                  <div className="flex gap-3">
                    <ChevronRight size={15} className="text-purple-400 mt-0.5 flex-shrink-0"/>
                    <div><p className="font-medium text-white mb-1.5">{f.q}</p><p className="text-sm text-white/45">{f.a}</p></div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/[0.05] py-6 px-4 text-center">
        <p className="text-xs text-white/25">© 2024 WEB AI Engineering Club. All rights reserved.</p>
        <Link href="/admin/login" className="text-xs text-white/10 hover:text-white/30 mt-2 inline-block">Admin Login</Link>
      </footer>
    </div>
  );
}
