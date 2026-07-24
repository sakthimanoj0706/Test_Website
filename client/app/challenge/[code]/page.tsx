"use client";

import { use, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getHeroByCode, HeroData, Scenario } from "@/lib/challengeData";
import SecurityEnforcer from "@/components/SecurityEnforcer";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";

type Phase = "VALIDATING" | "BRIEFING" | "RULES" | "COUNTDOWN" | "ACTIVE" | "TIME_UP" | "ERROR";

export default function ChallengePage({ params }: { params: Promise<{ code: string }> }) {
  const router = useRouter();
  const { code } = use(params);

  const [phase, setPhase] = useState<Phase>("VALIDATING");
  const [hero, setHero] = useState<HeroData | null>(null);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [selectedRequirements, setSelectedRequirements] = useState<any[]>([]);
  
  // Timers
  const [countdown, setCountdown] = useState(5);
  const [timeLeft, setTimeLeft] = useState(120);
  
  // Security state
  const [violationCount, setViolationCount] = useState(0);

  const handleViolation = async (reason: string) => {
    setViolationCount(prev => prev + 1);
    try {
      const participant_name = sessionStorage.getItem('participant_name') || 'Anonymous';
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      await fetch(`${API_URL}/violations/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participant_name, hero_code: code, reason })
      });
    } catch (err) {
      console.error('Failed to log violation', err);
    }
  };

  // Initialize and select scenario
  useEffect(() => {
    const foundHero = getHeroByCode(code);
    if (!foundHero) {
      setPhase("ERROR");
      return;
    }
    setHero(foundHero);

    // Get or set random scenario from sessionStorage to persist across reloads (even though reload is a violation)
    const storageKey = `challenge_scenario_${foundHero.id}`;
    const savedIndex = sessionStorage.getItem(storageKey);
    let index = 0;
    if (savedIndex !== null) {
      index = parseInt(savedIndex);
    } else {
      index = Math.floor(Math.random() * foundHero.scenarios.length);
      sessionStorage.setItem(storageKey, index.toString());
    }
    const chosenScenario = foundHero.scenarios[index];
    setScenario(chosenScenario);
    
    // Pick 5 random requirements
    const reqKey = `challenge_reqs_${foundHero.id}_${index}`;
    const savedReqs = sessionStorage.getItem(reqKey);
    if (savedReqs) {
      try {
        setSelectedRequirements(JSON.parse(savedReqs));
      } catch(e) {
        setSelectedRequirements(chosenScenario.requirements.slice(0, 5));
      }
    } else {
      const shuffled = [...chosenScenario.requirements].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 5);
      sessionStorage.setItem(reqKey, JSON.stringify(selected));
      setSelectedRequirements(selected);
    }
    
    // Simulate loading for sleek feel
    setTimeout(() => setPhase("BRIEFING"), 1000);
  }, [code]);

  // Handle Fullscreen Request
  const enterFullScreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      setPhase("COUNTDOWN");
    } catch (e) {
      alert("Full screen is required to continue.");
    }
  };

  // Countdown Logic
  useEffect(() => {
    if (phase === "COUNTDOWN") {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setPhase("ACTIVE");
      }
    }
  }, [phase, countdown]);

  // Beep sound
  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.1;
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  };

  // Active Timer Logic
  useEffect(() => {
    if (phase === "ACTIVE") {
      if (timeLeft > 0) {
        const timer = setTimeout(() => {
          setTimeLeft(t => t - 1);
          if (timeLeft <= 11) playBeep(); // beep for last 10 seconds (10 down to 1)
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        setPhase("TIME_UP");
      }
    }
  }, [phase, timeLeft]);

  // Time's Up Redirect
  useEffect(() => {
    if (phase === "TIME_UP") {
      setTimeout(() => {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(()=>{});
        }
        router.push("/");
      }, 5000);
    }
  }, [phase, router]);

  // Determine Timer Color
  let timerColor = "text-green-400";
  let strokeColor = "stroke-green-400";
  if (timeLeft < 60 && timeLeft >= 30) {
    timerColor = "text-yellow-400";
    strokeColor = "stroke-yellow-400";
  } else if (timeLeft < 30 && timeLeft >= 10) {
    timerColor = "text-orange-400";
    strokeColor = "stroke-orange-400";
  } else if (timeLeft < 10) {
    timerColor = "text-red-500";
    strokeColor = "stroke-red-500";
  }

  // Format time MM:SS
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");

  const progress = (timeLeft / 120) * 100;

  if (phase === "VALIDATING") {
    return (
      <div className="min-h-screen bg-[#050509] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"/>
      </div>
    );
  }

  if (phase === "ERROR") {
    return (
      <div className="min-h-screen bg-[#050509] flex items-center justify-center flex-col text-white">
        <h1 className="text-3xl font-bold mb-2 text-red-400">Invalid Code</h1>
        <p className="text-white/50 mb-6">The access code provided does not match any hero.</p>
        <Button onClick={() => router.push("/")}>Return to Login</Button>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050509] overflow-hidden text-white font-sans flex flex-col items-center justify-center selection:bg-transparent">
      
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* PHASE 1: BRIEFING */}
        {phase === "BRIEFING" && (
          <motion.div key="briefing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }} className="relative z-10 text-center max-w-md w-full px-4">
            <h4 className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-6">Web AI Engineering Club</h4>
            <h2 className="text-xl text-white/50 mb-8">Mission Assigned</h2>
            <div className="w-32 h-32 mx-auto rounded-3xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-6xl shadow-[0_0_50px_rgba(168,85,247,0.15)] mb-6">
              {hero?.icon}
            </div>
            <h1 className="text-4xl font-extrabold mb-2">{hero?.name}</h1>
            <p className="text-lg text-purple-300 font-medium mb-8">{hero?.domain}</p>
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl mb-8">
              <p className="text-sm text-purple-100">You have been assigned this mission.</p>
            </div>
            <Button size="lg" className="w-full" onClick={() => setPhase("RULES")}>View Rules</Button>
          </motion.div>
        )}

        {/* PHASE 2: RULES */}
        {phase === "RULES" && (
          <motion.div key="rules" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} className="relative z-10 text-center max-w-lg w-full px-4">
            <h2 className="text-3xl font-bold mb-6">Assessment Rules</h2>
            <GlassCard className="p-6 text-left space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="text-red-400 mt-0.5">⚠️</span>
                <p className="text-sm text-white/70">Right-clicking, copying, pasting, and all keyboard shortcuts are strictly disabled.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-400 mt-0.5">⚠️</span>
                <p className="text-sm text-white/70">Switching tabs, minimizing the window, or exiting full-screen mode will instantly lock the assessment.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-400 mt-0.5">⏱️</span>
                <p className="text-sm text-white/70">You will have exactly 2 minutes to read and memorize your scenario once it begins.</p>
              </div>
            </GlassCard>
            <Button size="lg" className="w-full" onClick={enterFullScreen}>I Understand</Button>
          </motion.div>
        )}

        {/* PHASE 3: COUNTDOWN */}
        {phase === "COUNTDOWN" && (
          <motion.div key="countdown" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.5 }} className="relative z-10 text-center">
            <h2 className="text-2xl text-white/50 mb-8 tracking-widest uppercase">Mission Starts In</h2>
            <div className="text-[150px] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
              {countdown}
            </div>
          </motion.div>
        )}

        {/* PHASE 4: ACTIVE CHALLENGE */}
        {phase === "ACTIVE" && (
          <SecurityEnforcer isActive={true} onViolation={handleViolation}>
            <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 w-full h-screen flex flex-col items-center justify-center p-8 max-w-5xl mx-auto">
              
              {/* Floating Violation Counter */}
              {violationCount > 0 && (
                <div className="absolute top-6 right-6 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse">
                  <span>⚠️</span>
                  <span>Violations: {violationCount}</span>
                </div>
              )}

              {/* Header */}
              <div className="flex flex-col items-center mb-8">
                <h4 className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-4">Web AI Engineering Club</h4>
                <div className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.05] p-3 pr-6 rounded-full">
                  <div className="w-12 h-12 bg-white/[0.05] rounded-full flex items-center justify-center text-2xl">{hero?.icon}</div>
                  <div className="text-left">
                    <p className="font-bold text-sm leading-tight">{hero?.name}</p>
                    <p className="text-xs text-purple-400">{hero?.domain}</p>
                  </div>
                </div>
              </div>

              {/* Timer */}
              <div className="mb-10 relative flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="none" className="text-white/[0.05]" />
                  <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="4" fill="none"
                    strokeDasharray="276" strokeDashoffset={276 - (276 * progress) / 100}
                    className={`${strokeColor} transition-all duration-1000 ease-linear`}
                  />
                </svg>
                <div className={`absolute inset-0 flex items-center justify-center text-2xl font-mono font-bold ${timerColor} ${timeLeft < 10 ? 'animate-pulse' : ''}`}>
                  {mins}:{secs}
                </div>
              </div>

              {/* Content */}
              <div className="w-full text-center max-w-3xl">
                <h2 className="text-2xl font-bold text-white mb-4">{scenario?.title}</h2>
                <p className="text-white/60 mb-8 leading-relaxed">{scenario?.question}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-left">
                  {selectedRequirements.map((req, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/[0.06] p-3 rounded-xl flex items-center gap-3">
                      <span className="text-xl">{req.icon}</span>
                      <span className="text-sm font-medium text-white/80">{req.text}</span>
                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          </SecurityEnforcer>
        )}

        {/* PHASE 5: TIME UP */}
        {phase === "TIME_UP" && (
          <motion.div key="timeup" initial={{ opacity: 0, backdropFilter: "blur(0px)" }} animate={{ opacity: 1, backdropFilter: "blur(20px)" }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="text-center">
              <h2 className="text-sm uppercase tracking-[0.5em] text-purple-400 font-bold mb-4">Mission Complete</h2>
              <div className="text-6xl font-black text-white mb-6">⏰ Time's Up</div>
              <p className="text-white/40">Redirecting to Login...</p>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
