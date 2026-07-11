import React, { useState, useEffect } from "react";
import TopAppBar from "./components/TopAppBar";
import BottomNavBar from "./components/BottomNavBar";
import CalmInvocator from "./components/CalmInvocator";
import EraExplorer from "./components/EraExplorer";
import EnigmaResolver from "./components/EnigmaResolver";
import ProgressDashboard from "./components/ProgressDashboard";

import { INITIAL_ERAS, INITIAL_LOGS, INITIAL_BADGES } from "./data";
import { EraItem, LogEntry, BadgeItem } from "./types";

type TabId = "calm" | "scenarios" | "resolve" | "progress";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("calm");
  const [eras, setEras] = useState<EraItem[]>(INITIAL_ERAS);
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS);
  const [badges, setBadges] = useState<BadgeItem[]>(INITIAL_BADGES);
  const [userPlan, setUserPlan] = useState<"free" | "pro" | "lifetime">(() => {
    return (localStorage.getItem("user_plan") as any) || "free";
  });

  // Detect Stripe redirect success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment_success") === "true") {
      const plan = params.get("plan");
      if (plan === "pro" || plan === "lifetime") {
        setUserPlan(plan);
        localStorage.setItem("user_plan", plan);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Helper to add custom eras generated with Gemini AI
  const handleAddCustomEra = (newEra: EraItem) => {
    setEras((prev) => [newEra, ...prev]);
    handleAddLog(
      `Investigación: ${newEra.title}`,
      `Se agregó la era "${newEra.era}" generada con Gemini.`,
      "sparkles"
    );
  };

  // Helper to append log entries
  const handleAddLog = (title: string, description: string, icon: string) => {
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      title,
      resolved: true,
      time: "Justo ahora",
      description,
      icon,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Helper to unlock badges
  const handleUnlockBadge = (id: string) => {
    setBadges((prev) =>
      prev.map((badge) =>
        badge.id === id ? { ...badge, unlocked: true } : badge
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f4]">
      {/* Centered responsive container layout */}
      <div className="w-full max-w-lg mx-auto bg-[#fff8f4] flex flex-col min-h-screen border-x border-teal-100/30 shadow-xs pb-24">
        {/* Header navigation bar */}
        <TopAppBar />

        {/* Main active view flow container */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === "calm" && (
            <CalmInvocator
              onAddLog={handleAddLog}
              onUnlockBadge={handleUnlockBadge}
            />
          )}

          {activeTab === "scenarios" && (
            <EraExplorer
              eras={eras}
              onAddCustomEra={handleAddCustomEra}
              userPlan={userPlan}
            />
          )}

          {activeTab === "resolve" && (
            <EnigmaResolver
              onAddLog={handleAddLog}
              onUnlockBadge={handleUnlockBadge}
            />
          )}

          {activeTab === "progress" && (
            <ProgressDashboard
              logs={logs}
              badges={badges}
              userPlan={userPlan}
              onSelectPlan={(plan) => {
                setUserPlan(plan);
                localStorage.setItem("user_plan", plan);
              }}
            />
          )}
        </main>

        {/* Bottom tab menu bar */}
        <BottomNavBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
