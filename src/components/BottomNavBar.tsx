import React from "react";
import { Sparkles, History, Compass, Award } from "lucide-react";

type TabId = "calm" | "scenarios" | "resolve" | "progress";

interface BottomNavBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function BottomNavBar({ activeTab, onTabChange }: BottomNavBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-40 flex justify-around items-center px-4 py-3 pb-safe bg-[#fff8f4] border-t border-teal-100 shadow-[0_-4px_16px_rgba(12,82,82,0.08)] rounded-t-2xl max-w-lg mx-auto">
      <button
        onClick={() => onTabChange("calm")}
        className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-90 ${
          activeTab === "calm"
            ? "bg-emerald-50 text-emerald-900 rounded-full px-5 py-1.5 font-bold"
            : "text-gray-500 hover:text-emerald-800"
        }`}
      >
        <Sparkles className={`w-5 h-5 ${activeTab === "calm" ? "fill-emerald-800" : ""}`} />
        <span className="text-[10px] font-semibold tracking-wider uppercase">Oráculo</span>
      </button>

      <button
        onClick={() => onTabChange("scenarios")}
        className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-90 ${
          activeTab === "scenarios"
            ? "bg-emerald-50 text-emerald-900 rounded-full px-5 py-1.5 font-bold"
            : "text-gray-500 hover:text-emerald-800"
        }`}
      >
        <History className="w-5 h-5" />
        <span className="text-[10px] font-semibold tracking-wider uppercase">Eras</span>
      </button>

      <button
        onClick={() => onTabChange("resolve")}
        className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-90 ${
          activeTab === "resolve"
            ? "bg-emerald-50 text-emerald-900 rounded-full px-5 py-1.5 font-bold"
            : "text-gray-500 hover:text-emerald-800"
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] font-semibold tracking-wider uppercase">Enigmas</span>
      </button>

      <button
        onClick={() => onTabChange("progress")}
        className={`flex flex-col items-center justify-center gap-1 transition-all active:scale-90 ${
          activeTab === "progress"
            ? "bg-emerald-50 text-emerald-900 rounded-full px-5 py-1.5 font-bold"
            : "text-gray-500 hover:text-emerald-800"
        }`}
      >
        <Award className="w-5 h-5" />
        <span className="text-[10px] font-semibold tracking-wider uppercase">Progreso</span>
      </button>
    </nav>
  );
}
