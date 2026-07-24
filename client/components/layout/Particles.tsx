"use client";
import { useEffect, useRef } from "react";

export default function Particles({ count=70 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d")!;
    let raf: number;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = ["rgba(139,92,246,","rgba(59,130,246,","rgba(168,85,247,"];
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random()-.5)*.35, vy: (Math.random()-.5)*.35,
      r: Math.random()*1.8+.4, o: Math.random()*.45+.1,
      col: COLORS[Math.floor(Math.random()*COLORS.length)],
    }));

    const draw = () => {
      ctx.clearRect(0,0,c.width,c.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x<0) p.x=c.width; if (p.x>c.width) p.x=0;
        if (p.y<0) p.y=c.height; if (p.y>c.height) p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle = `${p.col}${p.o})`; ctx.fill();
      });
      // connections
      for (let i=0;i<pts.length;i++) for (let j=i+1;j<pts.length;j++) {
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.hypot(dx,dy);
        if (d<100) { ctx.beginPath(); ctx.strokeStyle=`rgba(139,92,246,${.04*(1-d/100)})`; ctx.lineWidth=.5; ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.stroke(); }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize",resize); };
  }, [count]);

  return <canvas ref={ref} className="fixed inset-0 pointer-events-none z-0" aria-hidden />;
}
