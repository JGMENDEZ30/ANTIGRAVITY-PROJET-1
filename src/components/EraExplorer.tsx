import React, { useState } from "react";
import { EraCategory, EraItem } from "../types";
import {
  BookOpen,
  GitBranch,
  Crown,
  Feather,
  PlusCircle,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Loader2,
  X,
  FileText,
  Lock
} from "lucide-react";

interface EraExplorerProps {
  eras: EraItem[];
  onAddCustomEra: (newEra: EraItem) => void;
  userPlan?: "free" | "pro" | "lifetime";
}

const CATEGORIES: EraCategory[] = [
  "Todo",
  "Proto-Eslavo",
  "Eslavo Oriental",
  "Eslavo Eclesiástico",
  "Ruso Medio",
  "Dialecto de Moscú",
  "Ruso Moderno",
];

export default function EraExplorer({
  eras,
  onAddCustomEra,
  userPlan = "free",
}: EraExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<EraCategory>("Todo");
  const [activeDetailEra, setActiveDetailEra] = useState<EraItem | null>(null);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [suggestInput, setSuggestInput] = useState("");
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [errorSuggestion, setErrorSuggestion] = useState("");

  const filteredEras = selectedCategory === "Todo"
    ? eras
    : eras.filter((era) => era.category === selectedCategory);

  const handleSuggestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestInput.trim()) return;

    setLoadingSuggestion(true);
    setErrorSuggestion("");

    try {
      const response = await fetch("/api/gemini/suggest-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: suggestInput }),
      });

      if (!response.ok) {
        throw new Error("No se pudo conectar con el Oráculo.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      const generatedEra: EraItem = {
        id: `custom-${Date.now()}`,
        title: data.title || suggestInput,
        era: data.era || "Época desconocida",
        category: data.category || "Ruso Moderno",
        description: data.description || "Nueva investigación generada por IA.",
        duration: data.duration || "4 MINUTOS",
        badge: data.badge || "AI Generada",
        insightTitle: data.insightTitle || "Perspectiva Lingüística",
        insightText: data.insightText || "Análisis dinámico del desarrollo filológico.",
        detailText: data.detailText || "Descripción ampliada de la investigación.",
        isCustom: true,
      };

      onAddCustomEra(generatedEra);
      setShowSuggestModal(false);
      setSuggestInput("");
      // Automatically open the new era detail
      setActiveDetailEra(generatedEra);
    } catch (err: any) {
      console.error(err);
      setErrorSuggestion(err.message || "Ocurrió un error al contactar al Oráculo.");
    } finally {
      setLoadingSuggestion(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Proto-Eslavo":
        return <GitBranch className="w-5 h-5 text-teal-700" />;
      case "Eslavo Oriental":
        return <BookOpen className="w-5 h-5 text-teal-700" />;
      case "Eslavo Eclesiástico":
        return <FileText className="w-5 h-5 text-teal-700" />;
      case "Ruso Medio":
        return <Feather className="w-5 h-5 text-teal-700" />;
      case "Dialecto de Moscú":
        return <Crown className="w-5 h-5 text-teal-700" />;
      default:
        return <Sparkles className="w-5 h-5 text-teal-700" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro section resembling MindfulShift */}
      <section className="px-4 pt-4">
        <h2 className="text-2xl font-bold font-sans text-gray-900 tracking-tight mb-2">Escenarios de la Lengua</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Elige una era histórica para sumergirte en un viaje lingüístico guiado de corta lectura adaptado al desarrollo filológico del ruso.
        </p>
      </section>

      {/* Horizontal categories scrollable selection */}
      <section className="px-4 overflow-x-auto flex gap-2 pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
              selectedCategory === cat
                ? "bg-teal-800 text-white shadow-sm"
                : "bg-teal-50 text-teal-900 hover:bg-teal-100/70"
            }`}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Eras Card Timeline Layout */}
      <section className="px-4 space-y-4">
        {filteredEras.map((era) => {
          const isLocked = userPlan === "free" && era.id === "modern-russian";
          return (
            <div
              key={era.id}
              onClick={() => {
                if (isLocked) {
                  alert("🔒 Esta era ('El Ruso Moderno') es parte del contenido Premium. Por favor, desbloquea el Plan Zar o Plan Dinastía en la pestaña 'Mi Progreso'.");
                } else {
                  setActiveDetailEra(era);
                }
              }}
              className={`bg-white p-5 rounded-2xl soft-card-shadow border transition-all active:scale-[0.99] group flex flex-col justify-between min-h-[170px] ${
                isLocked
                  ? "opacity-80 border-amber-200/50 hover:border-amber-300 cursor-pointer"
                  : "border-teal-600/5 hover:border-teal-600/20 hover:shadow-md cursor-pointer"
              }`}
            >
              <div>
                {/* Card top bar */}
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(era.category)}
                    <span className="text-[10px] uppercase tracking-widest text-teal-800 font-bold">
                      {era.category}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                    {era.era}
                  </span>
                </div>

                {/* Title & short description */}
                <h3 className="font-sans font-bold text-lg text-teal-900 group-hover:text-teal-700 transition-colors">
                  {era.title}
                </h3>
                <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                  {era.description}
                </p>

                {/* Optional Sunlit Office/Manuscrito Image exactly like Reunión Difícil card */}
                {era.image && (
                  <div className="my-4 h-36 w-full rounded-xl overflow-hidden relative shadow-sm">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${era.image}')` }}
                    />
                    <div className="absolute inset-0 bg-teal-900/10" />
                  </div>
                )}

                {/* Inside psychological/linguistic perspective quote box */}
                {era.insightText && (
                  <div className="mt-4 p-3.5 bg-teal-50/50 rounded-xl border-l-4 border-teal-800">
                    <div className="flex items-center gap-2 mb-1">
                      <Lightbulb className="w-4 h-4 text-teal-800" />
                      <span className="font-bold text-[10px] text-teal-800 uppercase tracking-wider">
                        {era.insightTitle || "Perspectiva Lingüística"}
                      </span>
                    </div>
                    <p className="text-xs text-teal-900 italic leading-relaxed">
                      "{era.insightText}"
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom bar of cards */}
              <div className="flex items-center justify-between mt-4 pt-2 border-t border-gray-100/60">
                <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md uppercase">
                  {era.duration}
                </span>
                {isLocked ? (
                  <div className="flex items-center gap-1.5 text-amber-700 text-xs font-bold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Desbloquear Premium</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-teal-800 text-xs font-bold group-hover:translate-x-1 transition-transform">
                    <span>Comenzar lectura</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Suggest a Custom Era Button matching bottom of MindfulShift */}
      <section className="px-4 py-6 text-center">
        <button
          onClick={() => {
            if (userPlan === "free") {
              alert("✨ Esta es una función Premium. Por favor, adquiere el Plan Zar o Plan Dinastía en tu pestaña 'Mi Progreso' para desbloquear la generación con IA.");
            } else {
              setShowSuggestModal(true);
            }
          }}
          className="text-teal-800 hover:text-teal-900 font-bold text-sm flex items-center justify-center gap-2 mx-auto hover:underline active:scale-95 transition-all cursor-pointer"
        >
          {userPlan === "free" ? <Lock className="w-4 h-4 text-amber-600" /> : <PlusCircle className="w-5 h-5" />}
          Sugerir nuevo tema de investigación {userPlan === "free" && "(Premium)"}
        </button>
      </section>

      {/* Dialog slide-up for reading Era Detail */}
      {activeDetailEra && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-end justify-center p-0">
          <div className="bg-[#fff8f4] w-full max-w-lg rounded-t-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300">
            {/* Header image / banner of modal */}
            <div className="bg-teal-950 p-6 text-white relative">
              <button
                onClick={() => setActiveDetailEra(null)}
                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 p-1.5 rounded-full text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold bg-white/20 px-2.5 py-0.5 rounded text-white/95 uppercase tracking-widest">
                  {activeDetailEra.category}
                </span>
                <span className="text-[10px] font-bold bg-teal-800 px-2 py-0.5 rounded text-white/95 uppercase">
                  {activeDetailEra.era}
                </span>
              </div>
              <h3 className="text-xl font-bold font-sans">{activeDetailEra.title}</h3>
            </div>

            {/* Content box of modal */}
            <div className="p-6 overflow-y-auto space-y-5">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-teal-900/60">Resumen</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{activeDetailEra.description}</p>
              </div>

              {activeDetailEra.insightText && (
                <div className="p-4 bg-teal-50 rounded-xl border-l-4 border-teal-800">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="w-4 h-4 text-teal-800" />
                    <span className="font-bold text-[10px] text-teal-800 uppercase tracking-wider">
                      {activeDetailEra.insightTitle || "Perspectiva Lingüística"}
                    </span>
                  </div>
                  <p className="text-xs text-teal-900 italic leading-relaxed">"{activeDetailEra.insightText}"</p>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest text-teal-900/60">Análisis Filológico Profundo</h4>
                <div className="bg-white p-4 rounded-xl border border-teal-100 shadow-xs">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line font-medium">
                    {activeDetailEra.detailText}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center text-xs text-gray-500">
                <span>Tiempo de lectura: {activeDetailEra.duration}</span>
                {activeDetailEra.isCustom && <span className="text-emerald-700 font-bold flex items-center gap-1">✨ Generado con Gemini</span>}
              </div>
            </div>

            {/* Modal Bottom buttons */}
            <div className="p-4 bg-white border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setActiveDetailEra(null)}
                className="flex-1 bg-teal-800 hover:bg-teal-900 text-white font-bold py-3.5 rounded-xl text-center text-sm transition-colors"
              >
                He terminado de leer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suggest Theme Modal with Gemini AI Generation */}
      {showSuggestModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSuggestSubmit}
            className="bg-[#fff8f4] max-w-md w-full rounded-2xl overflow-hidden p-6 shadow-2xl border border-teal-600/10 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-teal-900">
                <Sparkles className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-base font-sans">Sugerir Nuevo Tema al Oráculo</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSuggestModal(false)}
                className="p-1 rounded-full hover:bg-gray-200/50 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 text-xs mb-4 leading-relaxed">
              Introduce cualquier tema, manuscrito, reforma o pregunta lingüística relacionada con la historia del ruso (ej. "Las reformas ortográficas de la URSS de 1918"). El Oráculo creará una nueva ficha interactiva con insights filológicos mediante inteligencia artificial.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Escribe tu sugerencia</label>
                <input
                  type="text"
                  required
                  value={suggestInput}
                  onChange={(e) => setSuggestInput(e.target.value)}
                  disabled={loadingSuggestion}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-700/50"
                  placeholder="Ej. El alfabeto glagolítico original..."
                />
              </div>

              {errorSuggestion && (
                <p className="text-red-600 text-xs font-semibold bg-red-50 p-2.5 rounded-lg border border-red-100">
                  ⚠️ {errorSuggestion}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowSuggestModal(false)}
                disabled={loadingSuggestion}
                className="flex-1 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs font-bold rounded-xl transition-colors text-center"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loadingSuggestion}
                className="flex-1 py-3 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold rounded-xl transition-colors text-center flex items-center justify-center gap-1.5"
              >
                {loadingSuggestion ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analizando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Consultar Oráculo
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
