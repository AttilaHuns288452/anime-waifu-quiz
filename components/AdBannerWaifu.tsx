"use client";
import { useEffect } from "react";

export default function AdBannerWaifu({ className = "" }: { className?: string }) {
  useEffect(() => {
    const id = "adsterra-native-waifu";
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.dataset.cfasync = "false";
    s.src = "https://pl30918943.effectivecpmnetwork.com/1b1c22db2a226a762f62ea2118b574f7/invoke.js";
    document.body.appendChild(s);
  }, []);

  return (
    <div className={`my-6 rounded-xl border border-gray-200 bg-white p-2 shadow-sm overflow-hidden min-h-[140px] ${className}`} aria-label="Sponsored">
      <p className="text-[10px] tracking-widest uppercase text-gray-400 text-center mb-1">Sponsored</p>
      <div id="container-1b1c22db2a226a762f62ea2118b574f7" className="min-h-[100px] flex items-center justify-center" />
    </div>
  );
}
