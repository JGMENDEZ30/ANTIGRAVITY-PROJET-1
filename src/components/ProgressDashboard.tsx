import React, { useState, useEffect } from "react";
import { LogEntry, BadgeItem } from "../types";
import {
  Award,
  Lock,
  Compass,
  CheckCircle,
  TrendingUp,
  Edit3,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  Waves
} from "lucide-react";

interface ProgressDashboardProps {
  logs: LogEntry[];
  badges: BadgeItem[];
  userPlan?: "free" | "pro" | "lifetime";
  onSelectPlan?: (plan: "free" | "pro" | "lifetime") => void;
}

export default function ProgressDashboard({
  logs,
  badges,
  userPlan = "free",
  onSelectPlan,
}: ProgressDashboardProps) {
  const [diaryNote, setDiaryNote] = useState("");
  const [isEditingDiary, setIsEditingDiary] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (plan: "pro" | "lifetime") => {
    setLoadingPlan(plan);
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planType: plan }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error al iniciar el pago con Stripe.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de red al conectar con Stripe.");
    } finally {
      setLoadingPlan(null);
    }
  };

  // Load diary note from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("slovo_diary_note");
    if (saved) {
      setDiaryNote(saved);
    } else {
      setDiaryNote("La evolución filológica del ruso revela que detrás del desorden aparente residen leyes fonéticas estables e inmutables.");
    }
  }, []);

  const handleSaveDiary = () => {
    localStorage.setItem("slovo_diary_note", diaryNote);
    setIsEditingDiary(false);
  };

  // Ring calculations for SVG circle
  const radius = 60;
  const circumference = radius * 2 * Math.PI; // 376.99
  const progressPercent = 0.75; // 75% complete
  const strokeDashoffset = circumference - progressPercent * circumference;

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <section className="px-4 pt-4">
        <h2 className="text-2xl font-bold font-sans text-gray-900 tracking-tight mb-2">Mi Progreso</h2>
        
        {/* Core Hero card: Calma Acumulada */}
        <div className="bg-white rounded-2xl p-5 border border-teal-100 pillowy-shadow relative overflow-hidden group">
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado Actual</p>
              <h3 className="font-sans font-bold text-xl text-teal-800">Sabiduría Acumulada</h3>
              <p className="text-gray-500 text-xs max-w-xs leading-relaxed pt-1">
                Has mantenido tu equilibrio filológico durante <strong>12 turnos</strong> de estudio consecutivos. ¡Excelente manejo intelectual!
              </p>
            </div>

            {/* SVG Progress Ring matching the mockup */}
            <div className="relative flex items-center justify-center">
              <svg className="w-28 h-28">
                {/* Background Ring */}
                <circle
                  className="text-teal-50"
                  cx="50%"
                  cy="50%"
                  fill="transparent"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                />
                {/* Active Ring */}
                <circle
                  className="text-teal-800 transition-all duration-1000 ease-out"
                  cx="50%"
                  cy="50%"
                  fill="transparent"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{
                    transform: "rotate(-90deg)",
                    transformOrigin: "50% 50%",
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-sans font-extrabold text-2xl text-teal-900 leading-none">12</span>
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Hitos</span>
              </div>
            </div>
          </div>
          {/* Subtle background blur decoration */}
          <div className="absolute -right-12 -top-12 w-40 h-40 bg-teal-50 rounded-full blur-2xl group-hover:scale-105 transition-transform duration-700" />
        </div>
      </section>

      {/* Bento Grid: Weekly Chart and Achievements */}
      <section className="px-4 grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Weekly Chart card - Ondas de Serenidad */}
        <div className="md:col-span-8 bg-white rounded-2xl p-5 border border-teal-100 soft-card-shadow flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="font-sans font-bold text-teal-950 text-sm">Ondas de Serenidad</h4>
              <p className="text-gray-500 text-xs mt-0.5">Tu equilibrio emocional e intelectual esta semana</p>
            </div>
            <Waves className="w-5 h-5 text-teal-800" />
          </div>

          {/* Bar charts simulated nicely exactly like the mockup */}
          <div className="flex-grow min-h-[140px] flex items-end justify-between gap-3 px-1 relative">
            <div className="flex-1 bg-teal-50 hover:bg-teal-100 rounded-t-full h-[40%] transition-all" title="Lunes: 40%" />
            <div className="flex-1 bg-teal-50 hover:bg-teal-100 rounded-t-full h-[65%] transition-all" title="Martes: 65%" />
            <div className="flex-1 bg-teal-50 hover:bg-teal-100 rounded-t-full h-[55%] transition-all" title="Miércoles: 55%" />
            
            {/* Thursday Zen Column */}
            <div className="flex-1 bg-teal-200 hover:bg-teal-300 rounded-t-full h-[85%] transition-all relative" title="Jueves: 85%">
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-teal-800 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                Zen
              </div>
            </div>
            
            <div className="flex-1 bg-teal-50 hover:bg-teal-100 rounded-t-full h-[45%] transition-all" title="Viernes: 45%" />
            <div className="flex-1 bg-teal-50 hover:bg-teal-100 rounded-t-full h-[30%] transition-all" title="Sábado: 30%" />
            <div className="flex-1 bg-teal-50 hover:bg-teal-100 rounded-t-full h-[70%] transition-all" title="Domingo: 70%" />
          </div>

          <div className="flex justify-between mt-4 px-1 font-sans font-semibold text-[10px] text-gray-400">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mie</span>
            <span>Jue</span>
            <span>Vie</span>
            <span>Sab</span>
            <span>Dom</span>
          </div>
        </div>

        {/* Badges card */}
        <div className="md:col-span-4 bg-white rounded-2xl p-5 border border-teal-100 soft-card-shadow flex flex-col justify-between">
          <h4 className="font-sans font-bold text-teal-950 text-sm mb-4">Tus Logros</h4>
          
          <div className="grid grid-cols-2 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="flex flex-col items-center text-center gap-1.5 group cursor-pointer"
                title={badge.description}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-inner transition-all duration-300 ${
                    badge.unlocked
                      ? "bg-teal-50 text-teal-800 scale-100 hover:scale-105"
                      : "bg-gray-100 text-gray-400 opacity-60"
                  }`}
                >
                  {badge.unlocked ? (
                    <Award className="w-6 h-6" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <span className="text-[10px] font-bold text-gray-600 leading-tight">
                  {badge.title}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-gray-400 text-center mt-4">
            Pasa el cursor sobre los logros para ver cómo desbloquearlos.
          </p>
        </div>
      </section>

      {/* Supered Challenges Logs section */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-sans font-bold text-teal-950 text-sm">Desafíos Superados</h4>
          <span className="bg-teal-100 text-teal-900 font-bold text-[9px] px-2 py-0.5 rounded-full">
            {logs.length} hoy
          </span>
        </div>

        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-white rounded-xl p-4 border border-teal-100 soft-card-shadow flex items-start gap-3.5 transition-all hover:border-teal-300 cursor-default"
            >
              <div className="w-10 h-10 rounded-lg bg-teal-50/70 flex items-center justify-center shrink-0 text-teal-800">
                <Compass className="w-5 h-5" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <h5 className="font-sans font-bold text-teal-950 text-xs">
                    {log.title}
                  </h5>
                  <span className="text-emerald-700 font-bold text-[9px] flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 fill-emerald-100" />
                    Resuelto
                  </span>
                </div>
                <p className="text-gray-500 text-[11px] leading-relaxed mt-0.5">
                  {log.description}
                </p>
                <span className="text-[9px] font-semibold text-gray-400 block mt-1">
                  {log.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección de Planes de Pago */}
      <section className="px-4">
        <div className="bg-white rounded-2xl p-5 border border-teal-100 soft-card-shadow space-y-4">
          <div className="text-center space-y-1">
            <h4 className="font-sans font-extrabold text-teal-950 text-base">Planes de Aprendizaje</h4>
            <p className="text-gray-500 text-[11px]">Impulsa tu conocimiento filológico del ruso</p>
          </div>

          <div className="space-y-3">
            {/* Plan Gratis */}
            <div className={`p-4 rounded-xl border transition-all ${userPlan === "free" ? "border-teal-600 bg-teal-50/20" : "border-gray-100 bg-white"}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-sans font-bold text-teal-950 text-xs flex items-center gap-1.5">
                    Plan Eslavo (Gratis)
                    {userPlan === "free" && <span className="bg-teal-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">Activo</span>}
                  </h5>
                  <p className="text-gray-500 text-[10px] mt-0.5">Acceso a la era básica e interactividad inicial.</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-teal-950 text-xs">$0</span>
                </div>
              </div>
            </div>

            {/* Plan Pro */}
            <div className={`p-4 rounded-xl border transition-all relative overflow-hidden ${userPlan === "pro" ? "border-teal-600 bg-teal-50/20" : "border-gray-100 bg-white hover:border-teal-200"}`}>
              {userPlan !== "pro" && userPlan !== "lifetime" && (
                <div className="absolute top-0 right-0 bg-teal-800 text-white text-[8px] font-bold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider">
                  Recomendado
                </div>
              )}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h5 className="font-sans font-bold text-teal-950 text-xs flex items-center gap-1.5">
                    Plan Zar (Mensual Pro)
                    {userPlan === "pro" && <span className="bg-teal-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">Activo</span>}
                  </h5>
                  <p className="text-gray-500 text-[10px] mt-0.5">Acceso completo a todas las eras y explicaciones ilimitadas con Gemini.</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-teal-950 text-xs">$4.99</span>
                  <span className="text-gray-400 text-[9px] block">/ mes</span>
                </div>
              </div>
              {userPlan !== "pro" && userPlan !== "lifetime" && (
                <button
                  disabled={loadingPlan !== null}
                  onClick={() => handleCheckout("pro")}
                  className="w-full mt-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white text-[11px] font-bold rounded-lg transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {loadingPlan === "pro" ? "Cargando..." : "Suscribirse"}
                </button>
              )}
            </div>

            {/* Plan Lifetime */}
            <div className={`p-4 rounded-xl border transition-all ${userPlan === "lifetime" ? "border-teal-600 bg-teal-50/20" : "border-gray-155 bg-white hover:border-teal-200"}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h5 className="font-sans font-bold text-teal-950 text-xs flex items-center gap-1.5">
                    Plan Dinastía (De por vida)
                    {userPlan === "lifetime" && <span className="bg-teal-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase">Activo</span>}
                  </h5>
                  <p className="text-gray-500 text-[10px] mt-0.5">Acceso ilimitado de por vida, sin suscripciones y una insignia exclusiva.</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-teal-950 text-xs">$19.99</span>
                  <span className="text-gray-400 text-[9px] block">pago único</span>
                </div>
              </div>
              {userPlan !== "lifetime" && (
                <button
                  disabled={loadingPlan !== null}
                  onClick={() => handleCheckout("lifetime")}
                  className="w-full mt-3 py-1.5 bg-teal-950 hover:bg-black text-[#fff8f4] text-[11px] font-bold rounded-lg transition-all shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  {loadingPlan === "lifetime" ? "Cargando..." : "Comprar Acceso de por Vida"}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Philological diary card persisted in localStorage */}
      <section className="px-4 pb-20">
        <div className="bg-teal-950 text-[#fff8f4] rounded-2xl p-5 shadow-md space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-emerald-400">
                Tu diario de sabiduría
              </h4>
            </div>
            {!isEditingDiary ? (
              <button
                onClick={() => setIsEditingDiary(true)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all active:scale-90"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            ) : null}
          </div>

          {isEditingDiary ? (
            <div className="space-y-2">
              <textarea
                value={diaryNote}
                onChange={(e) => setDiaryNote(e.target.value)}
                className="w-full bg-white/10 text-white border-0 rounded-lg p-3 text-xs focus:ring-1 focus:ring-emerald-400 focus:outline-none focus:bg-white/15 h-24"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setIsEditingDiary(false)}
                  className="px-3 py-1.5 rounded bg-white/10 text-white text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveDiary}
                  className="px-3 py-1.5 rounded bg-emerald-600 text-white text-xs font-semibold"
                >
                  Guardar
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs italic leading-relaxed opacity-90 font-medium">
              "{diaryNote}"
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
