"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Settings, LogOut, Database, Zap, FileText, Plus, Trash2, Key, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/lib/api";
import { clearAuth } from "@/lib/auth";
import Particles from "@/components/layout/Particles";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type Tab = "questions" | "settings" | "violations";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading } = useAuth("admin");
  const [tab, setTab] = useState<Tab>("questions");
  
  // State
  const [questions, setQuestions] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [violations, setViolations] = useState<any[]>([]);
  const [fetchingViolations, setFetchingViolations] = useState(true);
  
  // New Question Form
  const [newCode, setNewCode] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setFetching(true);
    setFetchingViolations(true);
    try {
      const token = localStorage.getItem("waec_token");
      // Load questions
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const qRes = await fetch(`${API_URL}/admin/questions`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const qData = await qRes.json();
      if (qData.success) {
        setQuestions(qData.data);
      }
      // Load violations
      const vRes = await fetch(`${API_URL}/admin/violations`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const vData = await vRes.json();
      if (vData.success) {
        setViolations(vData.data);
      }
    } catch (err) {
      toast.error("Failed to load admin data");
    } finally {
      setFetching(false);
      setFetchingViolations(false);
    }
  }, []);

  useEffect(() => { 
    if (!loading) load(); 
  }, [loading, load]);

  const logout = () => { clearAuth(); router.push("/admin/login"); };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newTitle || !newContent) return toast.error("All fields required");
    
    setCreating(true);
    try {
      const token = localStorage.getItem("waec_token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${API_URL}/admin/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ code: newCode, title: newTitle, content: newContent })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Question created!");
        setNewCode("");
        setNewTitle("");
        setNewContent("");
        load();
      } else {
        toast.error(data.message || "Failed to create question");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setCreating(false);
    }
  };

  const deleteQuestion = async (id: string, code: string) => {
    if (!confirm(`Delete question with code ${code}?`)) return;
    try {
      const token = localStorage.getItem("waec_token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${API_URL}/admin/questions/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Question deleted");
        load();
      } else {
        toast.error(data.message);
      }
    } catch { 
      toast.error("Delete failed"); 
    }
  };

  const downloadDb = async () => {
    try {
      const token = localStorage.getItem("waec_token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${API_URL}/admin/download/database`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "web_ai_engineering.db"; a.click();
      URL.revokeObjectURL(url);
      toast.success("Database downloaded!");
    } catch { toast.error("Download failed"); }
  };

  const backup = async () => {
    try { 
      const token = localStorage.getItem("waec_token");
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      await fetch(`${API_URL}/admin/backup`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
      toast.success("Backup created!"); 
    } catch { toast.error("Backup failed"); }
  };

  if (loading) return <Loader/>;

  const TABS: { id: Tab; icon: any; label: string }[] = [
    { id:"questions", icon:FileText, label:"Questions & Codes" },
    { id:"settings",  icon:Settings, label:"Settings" },
    { id:"violations", icon:LogOut, label:"Violations" },
  ];

  return (
    <div className="relative min-h-screen bg-[#050509]">
      <Particles count={30}/>

      {/* ── Sidebar ── */}
      <div className="fixed left-0 top-0 bottom-0 w-56 z-30 border-r border-white/[0.05] bg-black/40 backdrop-blur-xl hidden lg:flex flex-col">
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-white/[0.05]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"><Zap size={14} className="text-white"/></div>
          <div><p className="text-sm font-bold text-white">Admin Panel</p><p className="text-xs text-white/35">Code Challenge</p></div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${tab===t.id?"bg-purple-500/15 text-white border border-purple-500/25":"text-white/45 hover:text-white hover:bg-white/5"}`}>
              <t.icon size={16}/>{t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/[0.05]">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"><LogOut size={15}/>Logout</button>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="lg:pl-56 relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white capitalize">{tab}</h1>
              <p className="text-sm text-white/40">Manage your challenge content</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={load} className="gap-1.5"><RefreshCw size={13}/>Refresh</Button>
            </div>
          </div>

          {/* ── QUESTIONS ── */}
          {tab === "questions" && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-6">
              
              <GlassCard className="p-6 border border-purple-500/20">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Plus size={16} className="text-purple-400"/>Create New Code & Question</h3>
                <form onSubmit={handleCreateQuestion} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">Access Code</label>
                      <Input placeholder="e.g. SECRET123" value={newCode} onChange={e=>setNewCode(e.target.value)} required icon={<Key size={14}/>}/>
                    </div>
                    <div>
                      <label className="text-xs text-white/50 mb-1 block">Question Title</label>
                      <Input placeholder="e.g. React Hooks Challenge" value={newTitle} onChange={e=>setNewTitle(e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Question Content (Markdown allowed)</label>
                    <textarea 
                      className="w-full h-32 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white p-3 text-sm focus:border-purple-500/50 outline-none resize-y"
                      placeholder="Write your question scenario here..."
                      value={newContent}
                      onChange={e=>setNewContent(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={creating}>{creating ? "Creating..." : "Create Question"}</Button>
                </form>
              </GlassCard>

              <GlassCard className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.07] bg-white/[0.02]">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase">Code</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase">Created</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {fetching ? (
                        <tr><td colSpan={4} className="px-4 py-8 text-center text-white/30">Loading…</td></tr>
                      ) : questions.length === 0 ? (
                        <tr><td colSpan={4} className="px-4 py-8 text-center text-white/30">No questions found</td></tr>
                      ) : questions.map(q=>(
                        <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-3"><span className="badge badge-purple">{q.code}</span></td>
                          <td className="px-4 py-3 text-white font-medium">{q.title}</td>
                          <td className="px-4 py-3 text-white/40 text-xs">{new Date(q.created_at).toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <button onClick={()=>deleteQuestion(q.id, q.code)} title="Delete" className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={15}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* ── SETTINGS ── */}
          {tab === "settings" && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-5 max-w-xl">
              <GlassCard className="p-6">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Database size={16} className="text-blue-400"/>Data Management</h3>
                <div className="space-y-3">
                  <button onClick={downloadDb} className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 hover:bg-white/[0.05] transition-all text-left">
                    <Database size={18} className="text-blue-400"/><div><p className="text-sm font-medium text-white">Download SQLite DB</p><p className="text-xs text-white/35">Download the raw database file</p></div>
                  </button>
                  <button onClick={backup} className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 hover:bg-white/[0.05] transition-all text-left">
                    <Database size={18} className="text-purple-400"/><div><p className="text-sm font-medium text-white">Create Backup</p><p className="text-xs text-white/35">Save a timestamped backup on server</p></div>
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* ── VIOLATIONS ── */}
          {tab === "violations" && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-6">
              <GlassCard className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
<tr className="border-b border-white/[0.07] bg-white/[0.02]">
  <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase">Participant</th>
  <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase">Hero Code</th>
  <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase">Reason</th>
  <th className="px-4 py-3 text-left text-xs font-semibold text-white/40 uppercase">Timestamp</th>
</tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {fetchingViolations ? (
                        <tr><td colSpan={3} className="px-4 py-8 text-center text-white/30">Loading…</td></tr>
                      ) : violations.length === 0 ? (
                        <tr><td colSpan={3} className="px-4 py-8 text-center text-white/30">No violations recorded</td></tr>
                      ) : violations.map(v => (
                        <tr key={v.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-3 text-white font-medium">{v.participant_name || "Anonymous"}</td>
                          <td className="px-4 py-3 text-white/70">{v.hero_code}</td>
                          <td className="px-4 py-3 text-white/70">{v.reason}</td>
                          <td className="px-4 py-3 text-white/40 text-xs">{new Date(v.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="min-h-screen bg-[#050509] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin mx-auto mb-4"/>
        <p className="text-white/40 text-sm">Loading admin panel…</p>
      </div>
    </div>
  );
}
