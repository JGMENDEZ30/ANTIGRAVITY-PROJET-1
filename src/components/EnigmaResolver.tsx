import React, { useState, useEffect } from "react";
import { Enigma } from "../types";
import { INITIAL_ENIGMAS } from "../data";
import {
  Sparkles,
  Lightbulb,
  Check,
  ChevronRight,
  PenTool,
  BookOpen,
  Volume2,
  RefreshCw,
  Award,
  Loader2,
  Lock,
  ArrowRight
} from "lucide-react";

interface EnigmaResolverProps {
  onAddLog: (title: string, description: string, icon: string) => void;
  onUnlockBadge: (id: string) => void;
}

export default function EnigmaResolver({ onAddLog, onUnlockBadge }: EnigmaResolverProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedEnigma, setSelectedEnigma] = useState<Enigma>(INITIAL_ENIGMAS[0]);
  const [workspaceText, setWorkspaceText] = useState("");
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [errorAnalysis, setErrorAnalysis] = useState("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Initialize workspace text when enigma changes
  useEffect(() => {
    setWorkspaceText(selectedEnigma.sampleText);
  }, [selectedEnigma]);

  const handleNextStep = (step: 1 | 2 | 3) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectEnigma = (enigma: Enigma) => {
    setSelectedEnigma(enigma);
    handleNextStep(2);
  };

  const handleRunAnalysis = async () => {
    setLoadingAnalysis(true);
    setErrorAnalysis("");

    try {
      const response = await fetch("/api/gemini/analyze-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: workspaceText,
          context: selectedEnigma.title,
        }),
      });

      if (!response.ok) {
        throw new Error("El Oráculo está meditando y no pudo responder.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysisResult(data);
      
      // Add achievement logs and unlock badges
      onAddLog(
        `Análisis: ${selectedEnigma.title}`,
        `Descifraste la evolución histórica de: "${workspaceText.split("\n")[0]}"`,
        "check-circle"
      );

      // Unlock a badge if completing specific analysis
      if (selectedEnigma.id === "enigma-yers") {
        onUnlockBadge("badge-1"); // Descifrador de Manuscritos
      } else if (selectedEnigma.id === "enigma-reformas") {
        onUnlockBadge("badge-2"); // Escribano Imperial
      }

      handleNextStep(3);
    } catch (err: any) {
      console.error(err);
      setErrorAnalysis(err.message || "No se pudo completar el análisis filológico.");
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const playPronunciation = () => {
    if (!analysisResult?.equivalentModern) return;
    setIsPlayingAudio(true);

    // Extract the actual cyrillic text or phrase from the standard equivalent text
    const textToSpeak = analysisResult.equivalentModern;

    const synth = window.speechSynthesis;
    if (synth) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "ru-RU"; // Russian pronunciation
      utterance.rate = 0.85; // Slightly slower for clear educational delivery
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      synth.speak(utterance);
    } else {
      // Fallback timer if SpeechSynthesis is not supported
      setTimeout(() => {
        setIsPlayingAudio(false);
      }, 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome header exactly like Resolución de Conflictos */}
      <section className="px-4 pt-4 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold font-sans text-teal-950 tracking-tight mb-2">Resolución de Enigmas</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          Tómate un momento para procesar la evolución de la lengua. Estamos aquí para ayudarte a transformar los enigmas del cirílico medieval en una oportunidad de sabiduría.
        </p>
      </section>

      {/* Modern custom stepper indicator exactly matching the MindfulShift screenshot */}
      <div className="flex items-center justify-between mb-6 max-w-sm mx-auto px-4">
        {/* Step 1 Indicator */}
        <div className="flex flex-col items-center gap-1.5" id="step-indicator-1">
          <button
            onClick={() => currentStep > 1 && handleNextStep(1)}
            disabled={currentStep === 1}
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
              currentStep === 1
                ? "bg-teal-800 text-white"
                : "bg-emerald-600 text-white"
            }`}
          >
            {currentStep > 1 ? <Check className="w-4 h-4" /> : "1"}
          </button>
          <span className={`text-[11px] font-semibold ${currentStep === 1 ? "text-teal-800" : "text-emerald-700"}`}>
            Situación
          </span>
        </div>
        <div className="flex-grow h-[2px] bg-teal-100 mx-3 mb-5" />

        {/* Step 2 Indicator */}
        <div className="flex flex-col items-center gap-1.5" id="step-indicator-2">
          <button
            onClick={() => currentStep > 2 && handleNextStep(2)}
            disabled={currentStep <= 2}
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
              currentStep === 2
                ? "bg-teal-800 text-white"
                : currentStep > 2
                ? "bg-emerald-600 text-white"
                : "bg-teal-50 text-teal-800 border border-teal-100"
            }`}
          >
            {currentStep > 2 ? <Check className="w-4 h-4" /> : "2"}
          </button>
          <span className={`text-[11px] font-semibold ${currentStep === 2 ? "text-teal-800" : "text-gray-400"}`}>
            Análisis
          </span>
        </div>
        <div className="flex-grow h-[2px] bg-teal-100 mx-3 mb-5" />

        {/* Step 3 Indicator */}
        <div className="flex flex-col items-center gap-1.5" id="step-indicator-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
              currentStep === 3
                ? "bg-teal-800 text-white"
                : "bg-teal-50 text-teal-800 border border-teal-100"
            }`}
          >
            "3"
          </div>
          <span className={`text-[11px] font-semibold ${currentStep === 3 ? "text-teal-800" : "text-gray-400"}`}>
            Sabiduría
          </span>
        </div>
      </div>

      {/* STEP 1: Elige tu enigma (Situación) */}
      {currentStep === 1 && (
        <div className="px-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl soft-card-shadow border border-teal-100">
            <h3 className="font-sans font-bold text-lg text-teal-900 mb-4">¿Qué enigma filológico activa tu curiosidad?</h3>
            
            <div className="space-y-4">
              {INITIAL_ENIGMAS.map((enigma) => (
                <button
                  key={enigma.id}
                  onClick={() => handleSelectEnigma(enigma)}
                  className="w-full flex flex-col gap-3 p-4 rounded-xl bg-[#fff8f4] hover:bg-emerald-50 transition-all text-left border border-teal-600/5 hover:border-emerald-500/30 group"
                >
                  <div className="flex items-start gap-3 w-full">
                    <span className="p-2 rounded-lg bg-teal-50 text-teal-800 font-bold group-hover:scale-105 transition-transform mt-0.5">
                      {enigma.id === "enigma-yers" ? "Y" : enigma.id === "enigma-pleofonia" ? "P" : "R"}
                    </span>
                    <div>
                      <p className="font-sans font-bold text-teal-950 text-sm group-hover:text-emerald-900 transition-colors">
                        {enigma.title}
                      </p>
                      <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                        {enigma.description}
                      </p>
                    </div>
                  </div>

                  {/* Inside card lightbulb psychological insight box from mockup */}
                  <div className="p-3 bg-white/70 rounded-lg border border-teal-600/5 w-full">
                    <p className="text-[10px] font-bold text-emerald-800 flex items-center gap-1 mb-1">
                      <Lightbulb className="w-3.5 h-3.5 fill-emerald-800/10" />
                      {enigma.insightTitle}
                    </p>
                    <p className="text-[11px] text-gray-500 italic leading-normal">
                      "{enigma.insightText}"
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Abstract calm flowing water image from mockup */}
          <div className="w-full h-44 rounded-2xl overflow-hidden relative shadow-inner opacity-90 border border-teal-100">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDJhgGW_t8UTb2otXa_M2ZCL2BagNlPpgop9uPKnxvoa0ZzF7zxPUl2rAaOEoCTuvvGADUP_uO7KKKsKbvW-iMvk-iF6Zz-JlWY5V5VTywFuEEM2PWchLfdfWaVQFwQ-eSdSnrPistG4mSF1jPDVeZaXW81zjPQ8Wv8veAN8rnWqCFh9TiOD6Bu0R34aIrVg_0E7M6qEW5GABDO2ZjPFKGv6XBAMY2CZuPYMFtcqOoqN622yMQPIJHP5GVRKy5TSw4hfRfNjvi9qd_R')",
              }}
            />
          </div>
        </div>
      )}

      {/* STEP 2: Laboratorio de Análisis (Descarga) */}
      {currentStep === 2 && (
        <div className="px-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl soft-card-shadow border border-teal-100">
            <h3 className="font-sans font-bold text-lg text-teal-900 mb-2">Espacio de Análisis</h3>
            <p className="text-gray-500 text-xs mb-4 italic leading-relaxed">
              Escribe sin filtros las palabras, manuscritos o raíces. Analizar su estructura gramatical ayuda a regular la confusión y a comprender las leyes lingüísticas.
            </p>

            <textarea
              className="w-full h-48 p-4 bg-[#fff8f4] border-0 rounded-2xl focus:ring-2 focus:ring-teal-700/30 font-mono text-xs text-teal-950 placeholder:text-gray-400 focus:outline-none"
              placeholder="Escribe aquí tu texto en ruso, letras cirílicas o conceptos..."
              value={workspaceText}
              onChange={(e) => setWorkspaceText(e.target.value)}
              disabled={loadingAnalysis}
            />

            {errorAnalysis && (
              <p className="text-red-600 text-xs bg-red-50 p-3 rounded-xl border border-red-100 mt-2">
                ⚠️ {errorAnalysis}
              </p>
            )}

            <div className="mt-4 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => handleNextStep(1)}
                disabled={loadingAnalysis}
                className="px-5 py-3 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors hover:bg-gray-50"
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={loadingAnalysis || !workspaceText.trim()}
                className="flex-grow bg-teal-800 hover:bg-teal-900 text-white font-bold py-3 px-6 rounded-xl text-xs transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
              >
                {loadingAnalysis ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    El Oráculo está traduciendo...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Continuar al Reenfoque
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-teal-50 border border-teal-100/50 rounded-xl">
            <BookOpen className="w-5 h-5 text-teal-800 shrink-0" />
            <p className="text-xs text-teal-950 font-medium">
              Tus transcripciones están protegidas con inteligencia artificial y se borrarán al reiniciar el laboratorio por seguridad intelectual.
            </p>
          </div>
        </div>
      )}

      {/* STEP 3: Sabiduría Revelada (Reenfoque) */}
      {currentStep === 3 && analysisResult && (
        <div className="px-4 space-y-6">
          {/* Main Results Card */}
          <div className="bg-white p-5 rounded-2xl soft-card-shadow border-l-4 border-teal-800 space-y-5">
            <div>
              <span className="text-[10px] bg-teal-100 text-teal-900 px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                {analysisResult.era || "Evolución Filológica"}
              </span>
              <h3 className="font-sans font-bold text-lg text-teal-950 mt-1">Análisis Lingüístico</h3>
            </div>

            {/* Meanings */}
            <div className="p-3 bg-[#fff8f4] rounded-xl">
              <h4 className="text-[10px] font-bold text-teal-900 uppercase tracking-widest mb-1">
                Significado del Término
              </h4>
              <p className="text-sm font-semibold text-teal-950">{analysisResult.meaning}</p>
            </div>

            {/* Phonetics and Grammars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-teal-900 uppercase tracking-widest">
                  Evolución Fonética
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                  {analysisResult.phoneticBreakdown}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="text-[10px] font-bold text-teal-900 uppercase tracking-widest">
                  Evolución Gramatical
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                  {analysisResult.grammarEvolution}
                </p>
              </div>
            </div>
          </div>

          {/* Comparisons and pronunciation side column */}
          <div className="space-y-4">
            {/* Old vs New comparison block matching the "Evita / Prueba" card */}
            <div className="bg-white p-5 rounded-2xl soft-card-shadow border border-teal-100">
              <h3 className="font-sans font-bold text-teal-950 text-sm mb-3">Comparador Temporal</h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-red-50/50 border border-red-100 rounded-lg">
                  <span className="text-[9px] font-bold text-red-700 uppercase tracking-wider block mb-1">
                    Ancestral (Ruso Antiguo / Eclesiástico):
                  </span>
                  <p className="font-mono text-sm font-semibold text-red-900 italic">
                    {analysisResult.equivalentOld || "сьнь"}
                  </p>
                </div>

                <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg">
                  <span className="text-[9px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                    Equivalente Moderno (Ruso Estándar):
                  </span>
                  <p className="font-mono text-sm font-semibold text-emerald-950">
                    {analysisResult.equivalentModern || "сон"}
                  </p>
                </div>
              </div>
            </div>

            {/* Playback Voice and interactive widget */}
            <div className="bg-white p-5 rounded-2xl soft-card-shadow border border-teal-100 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-800 mb-3">
                <Volume2 className={`w-6 h-6 ${isPlayingAudio ? "animate-pulse" : ""}`} />
              </div>
              <h4 className="font-sans font-bold text-teal-950 text-sm">Escuchar Pronunciación</h4>
              <p className="text-gray-500 text-xs mt-1 mb-4">
                Escucha la entonación y acentuación estándar reconstruida por tu navegador.
              </p>
              <button
                onClick={playPronunciation}
                className="w-full py-2.5 border-2 border-teal-800 text-teal-800 hover:bg-teal-800 hover:text-white rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                {isPlayingAudio ? "Reproduciendo..." : "Iniciar Audio"}
              </button>
            </div>

            {/* Philologist Pro advice */}
            <div className="bg-teal-900 p-5 rounded-2xl text-[#fff8f4] space-y-2 shadow-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-emerald-400">
                  Consejo del Filólogo
                </h4>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {analysisResult.vocabularyTrivia || "Evita resolver enigmas por intuición moderna. Las lenguas eslavas operaban con armonías de yers y vocales que determinaban la contracción actual."}
              </p>
            </div>
          </div>

          {/* Terminate wizard button */}
          <div className="pt-4 pb-8 flex justify-center">
            <button
              onClick={() => handleNextStep(1)}
              className="px-8 py-3.5 bg-teal-800 hover:bg-teal-950 text-[#fff8f4] text-xs font-bold rounded-full transition-all active:scale-95 hover:shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              He terminado por ahora
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
