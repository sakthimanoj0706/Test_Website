"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, getToken, AuthUser } from "@/lib/auth";

export function useAuth(role?: "student" | "admin") {
  const router = useRouter();
  const [user,    setUser]    = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser(), t = getToken();
    if (!u || !t) { router.replace("/admin/login"); return; }
    if (role && u.role !== role) { router.replace("/admin/login"); return; }
    setUser(u);
    setLoading(false);
  }, []);

  return { user, loading };
}
