import React, { useState, useRef, useEffect } from "react";
import { Message } from "../types";
import {
  Sparkles,
  Volume2,
  VolumeX,
  Send,
  Loader2,
  X,
  Play,
  Pause,
  Award,
  Lightbulb,
  CornerDownRight,
  ShieldAlert,
  ChevronRight
} from "lucide-react";

interface CalmInvocatorProps {
  onAddLog: (title: string, description: string, icon: string) => void;
  onUnlockBadge: (id: string) => void;
}

export default function CalmInvocator({ onAddLog, onUnlockBadge }: CalmInvocatorProps) {
  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [character, setCharacter] = useState<"monk" | "reformer" | "pushkin" | "general">("monk");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loadingChat, setLoadingChat] = useState(false);
  
  // Media Playback Simulation (Ambient medieval monastic chants)
  const [isChanting, setIsChanting] = useState(false);
  const [currentQuickAccess, setCurrentQuickAccess] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Initialize preloaded messages when changing character
  useEffect(() => {
    let initialGreeting = "";
    if (character === "monk") {
      initialGreeting = "Pax vobiscum, viajero. Soy Néstor, humilde copista del Monasterio de las Cuevas en Kiev. Es el año de gracia 1074. ¿Deseas descifrar el eslavo antiguo o conocer la historia de nuestra amada Rus?";
    } else if (character === "reformer") {
      initialGreeting = "¡Saludos! Pedro I, nuestro gran emperador, me ha encomendado secularizar el alfabeto. ¡Basta de tipos góticos medievales, es hora del progreso mecánico de las Letras Civiles! ¿Qué reforma quieres discutir hoy?";
    } else if (character === "pushkin") {
      initialGreeting = "¡Ah, bienvenido! Soy un estudioso de la lírica de Aleksandr Pushkin. Hemos unificado por fin el lenguaje de los salmos bíblicos con el murmullo de los mercados campesinos. ¿Deseas experimentar la sinfonía poética del ruso literario?";
    } else {
      initialGreeting = "Saludos, soy el Filólogo del Oráculo. Puedo responder cualquier duda teórica, fonética o morfológica de las lenguas eslavas. ¿Por dónde empezamos?";
    }
    setMessages([{ role: "assistant", content: initialGreeting }]);
  }, [character]);

  // Audio simulation: Produces a beautiful, low-frequency meditative drone that sounds like a Gregorian chant / monastic choir!
  const startMonasticDrone = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Create main oscillator for a warm low bass drone (approx 65Hz - C2)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const osc3 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = "triangle"; // Warm organ-like tone
      osc1.frequency.setValueAtTime(65.41, ctx.currentTime); // C2

      osc2.type = "sawtooth"; // Gives that rich monastic vocal "reed" texture
      osc2.frequency.setValueAtTime(130.81, ctx.currentTime); // C3
      
      osc3.type = "sine";
      osc3.frequency.setValueAtTime(196.00, ctx.currentTime); // G3 (perfect fifth harmonizer!)

      // Filter to cut high sizzles for deep warm cathedral reverberation
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(150, ctx.currentTime);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 1.5); // Smooth fade in

      // Connect nodes
      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc3.start();

      // Store references to stop later
      oscillatorRef.current = osc1; // Will stop root oscillator (others tied conceptually for demo)
      gainNodeRef.current = gainNode;

      // Keep tracking of other oscillators to close safely
      (oscillatorRef as any).currentOscillators = [osc1, osc2, osc3];
    } catch (err) {
      console.error("Audio Context not supported or allowed by browser:", err);
    }
  };

  const stopMonasticDrone = () => {
    if (gainNodeRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current;
      const gain = gainNodeRef.current;
      
      try {
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1); // Meditative smooth fade out
        
        setTimeout(() => {
          const oscs = (oscillatorRef as any).currentOscillators || [];
          oscs.forEach((o: OscillatorNode) => {
            try { o.stop(); } catch(e){}
          });
          audioContextRef.current?.close();
          audioContextRef.current = null;
        }, 1100);
      } catch (e) {}
    }
  };

  const handleToggleChant = () => {
    if (isChanting) {
      stopMonasticDrone();
      setIsChanting(false);
      setCurrentQuickAccess(null);
    } else {
      startMonasticDrone();
      setIsChanting(true);
      setCurrentQuickAccess("music");
      onAddLog(
        "Meditación Monástica",
        "Escuchaste los cantos corales de la catedral medieval para serenar el intelecto.",
        "music"
      );
    }
  };

  // Submit chat to Gemini API
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loadingChat) return;

    const userMsg: Message = { role: "user", content: inputText };
    const updatedMessages = [...messages, userMsg];
    
    setMessages(updatedMessages);
    setInputText("");
    setLoadingChat(true);

    try {
      const response = await fetch("/api/gemini/interactive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          character,
        }),
      });

      if (!response.ok) {
        throw new Error("El oráculo se encuentra meditando en este momento.");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.text }]);
      
      // Unlock badge for chat interaction
      onUnlockBadge("badge-1");
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Disculpa, hermano. El murmullo de la historia interrumpió mi transmisión. (Asegúrate de configurar la clave GEMINI_API_KEY en los secretos del proyecto).",
        },
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section: Calmarme Ahora */}
      <section className="flex flex-col items-center justify-center text-center py-6 px-4">
        <div className="max-w-xs mx-auto mb-4 bg-teal-50/50 p-3.5 rounded-xl border border-teal-600/10 shadow-xs">
          <p className="text-[11px] text-teal-950 font-medium leading-relaxed">
            🌿 <strong>SlovoShift</strong> es un espacio de meditación filológica. Aprende los secretos históricos y la evolución del idioma ruso a través de lecturas pausadas y diálogos zen.
          </p>
        </div>
        <div className="relative mb-6">
          {/* Decorative pulsing halo ring */}
          <div className="absolute -inset-4 rounded-full bg-emerald-500/5 pulse-ring" />
          
          <button
            onClick={() => setShowChat(true)}
            className="relative z-10 w-48 h-48 rounded-full bg-teal-800 hover:bg-teal-900 text-[#fff8f4] flex flex-col items-center justify-center gap-2 shadow-xl active:scale-95 transition-all duration-300 group"
          >
            <Sparkles className="w-12 h-12 text-emerald-300 group-hover:rotate-12 transition-transform duration-300 fill-emerald-300/10" />
            <span className="font-sans font-extrabold text-sm uppercase tracking-widest text-[#fff8f4] px-4">
              Invocar Oráculo
            </span>
          </button>
        </div>
        
        <p className="text-gray-600 text-xs max-w-[280px] mx-auto leading-relaxed">
          Presiona para invocar el Oráculo y hablar directamente en tiempo real con sabios del pasado.
        </p>
      </section>

      {/* Acceso Rápido Grid */}
      <section className="px-4">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="font-sans font-bold text-teal-950 text-sm">Acceso Rápido</h3>
          <span className="text-xs font-bold text-teal-800">Ver todo</span>
        </div>

        <div className="space-y-3">
          {/* Monastic Chants Audio Card with dancing bars */}
          <div
            onClick={handleToggleChant}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
              isChanting
                ? "bg-emerald-50/50 border-emerald-300 shadow-sm"
                : "bg-white border-teal-100 hover:border-teal-300 soft-card-shadow"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                isChanting ? "bg-emerald-100 text-emerald-950" : "bg-teal-50 text-teal-800"
              }`}>
                {isChanting ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="font-sans font-bold text-teal-950 text-xs">Canto Monástico</h4>
                <p className="text-gray-500 text-[10px]">Catedral de Kiev • Audio Zen ambientador</p>
              </div>
            </div>

            {/* Dancing music visualizer bars if playing */}
            {isChanting ? (
              <div className="flex gap-0.5 items-end h-5">
                <span className="w-1 bg-emerald-700 animate-[pulse_1.2s_infinite] h-4" />
                <span className="w-1 bg-emerald-700 animate-[pulse_0.8s_infinite] h-5" />
                <span className="w-1 bg-emerald-700 animate-[pulse_1s_infinite] h-3" />
                <span className="w-1 bg-emerald-700 animate-[pulse_0.7s_infinite] h-5" />
              </div>
            ) : (
              <Play className="w-4 h-4 text-gray-400" />
            )}
          </div>

          {/* Quick Study Card 2 */}
          <div
            onClick={() => {
              setCurrentQuickAccess("cases");
              onAddLog(
                "Estudio de Casos",
                "Analizaste la declinación dual perdida en el nominativo antiguo.",
                "book"
              );
            }}
            className="p-4 rounded-2xl bg-white border border-teal-100 hover:border-teal-300 soft-card-shadow transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center">
                <CornerDownRight className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-teal-950 text-xs">Anclaje 5-4-3-2-1</h4>
                <p className="text-gray-500 text-[10px]">Análisis rápido de casos perdidos</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>

          {/* Quick Study Card 3 */}
          <div
            onClick={() => {
              setCurrentQuickAccess("alphabet");
            }}
            className="p-4 rounded-2xl bg-white border border-teal-100 hover:border-teal-300 soft-card-shadow transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-teal-50 text-teal-800 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-teal-950 text-xs">Simbolismo Glagolítico</h4>
                <p className="text-gray-500 text-[10px]">Análisis del primer alfabeto eslavo</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Dynamic Context Suggestion Section matching the "Sugerencia del momento" box */}
      <section className="px-4 pb-20">
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-950 border-l-4 border-emerald-800 shadow-xs space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-900">
            <Lightbulb className="w-4 h-4 text-emerald-800 fill-emerald-800/10" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-800">
              Sugerencia del momento
            </span>
          </div>
          <p className="text-[11px] italic leading-relaxed text-emerald-950 font-medium">
            "Hoy has resuelto enigmas gramaticales complejos. Tómate un momento en silencio para contemplar cómo el desorden fonético de hace mil años rige la armonía literaria de hoy."
          </p>
        </div>
      </section>

      {/* Conversational Floating Chat Dialog powered by Gemini */}
      {showChat && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-end justify-center p-0">
          <div className="bg-[#fff8f4] w-full max-w-lg rounded-t-3xl overflow-hidden shadow-2xl flex flex-col h-[90vh] animate-in slide-in-from-bottom duration-300">
            
            {/* Chat header containing character selectors */}
            <div className="bg-teal-950 p-4 text-white">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-sans font-bold text-sm">Oráculo Histórico</h3>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="p-1 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Character selection tab pill inside header */}
              <div className="flex gap-1 bg-black/20 p-1 rounded-lg">
                <button
                  onClick={() => setCharacter("monk")}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                    character === "monk" ? "bg-teal-800 text-white" : "text-teal-200 hover:text-white"
                  }`}
                >
                  Néstor
                </button>
                <button
                  onClick={() => setCharacter("reformer")}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                    character === "reformer" ? "bg-teal-800 text-white" : "text-teal-200 hover:text-white"
                  }`}
                >
                  Reforma
                </button>
                <button
                  onClick={() => setCharacter("pushkin")}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                    character === "pushkin" ? "bg-teal-800 text-white" : "text-teal-200 hover:text-white"
                  }`}
                >
                  Pushkin
                </button>
                <button
                  onClick={() => setCharacter("general")}
                  className={`flex-1 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                    character === "general" ? "bg-teal-800 text-white" : "text-teal-200 hover:text-white"
                  }`}
                >
                  Filólogo
                </button>
              </div>
            </div>

            {/* Chat Messages flow area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start animate-in fade-in zoom-in-95 duration-200"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-teal-800 text-white rounded-br-none shadow-sm"
                        : "bg-white text-teal-950 border border-teal-100 rounded-bl-none shadow-xs"
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.content}</p>
                  </div>
                </div>
              ))}

              {loadingChat && (
                <div className="flex justify-start items-center gap-2 text-gray-400 p-2 text-xs">
                  <Loader2 className="w-4 h-4 animate-spin text-teal-800" />
                  <span>El sabio está consultando los manuscritos...</span>
                </div>
              )}
            </div>

            {/* Chat bottom typing bar */}
            <form onSubmit={handleSendChat} className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                disabled={loadingChat}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Pregunta a ${
                  character === "monk"
                    ? "Néstor..."
                    : character === "reformer"
                    ? "el reformador..."
                    : character === "pushkin"
                    ? "el poeta..."
                    : "al filólogo..."
                }`}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-teal-700 focus:bg-white"
              />
              <button
                type="submit"
                disabled={loadingChat || !inputText.trim()}
                className="bg-teal-800 hover:bg-teal-900 disabled:bg-gray-200 text-white p-3 rounded-xl transition-colors active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Anclaje de Casos Perdidos */}
      {currentQuickAccess === "cases" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#fff8f4] max-w-md w-full rounded-2xl overflow-hidden p-6 shadow-2xl border border-teal-600/10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-teal-900">
                <Lightbulb className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-base font-sans">El Misterio del Número Dual</h3>
              </div>
              <button
                onClick={() => setCurrentQuickAccess(null)}
                className="p-1 rounded-full hover:bg-gray-200/50 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
              <p>
                En el eslavo oriental antiguo, además del <strong>singular</strong> (uno) y del <strong>plural</strong> (muchos), existía una tercera categoría gramatical: el <strong>Número Dual</strong>, utilizado estrictamente para parejas naturales o conjuntos de dos cosas (como dos ojos, dos manos o dos personas).
              </p>
              
              <div className="p-3 bg-white rounded-xl border border-teal-100 space-y-2">
                <h4 className="font-bold text-teal-900 uppercase tracking-wide text-[10px]">¿Cómo sobrevive hoy?</h4>
                <p>
                  Aunque el dual desapareció formalmente, dejó una huella oculta en el ruso moderno. Cuando dices:
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>1 книга</strong> (1 libro - nominativo singular)</li>
                  <li><strong>2, 3, 4 книги</strong> (2, 3, 4 libros - ¡usa genitivo singular en lugar de plural!)</li>
                  <li><strong>5 книг</strong> (5 libros - genitivo plural)</li>
                </ul>
                <p className="text-[10px] text-gray-500 italic">
                  Ese cambio extraño tras los números 2, 3 y 4 es en realidad la antigua forma del número dual que se congeló en el tiempo.
                </p>
              </div>

              <div className="bg-teal-50 p-3 rounded-xl border-l-4 border-teal-800 text-teal-900">
                <strong>💡 Ejercicio de calma:</strong> Cierra los ojos y piensa en cómo las simetrías de la naturaleza (dos ojos, dos manos) dieron forma a las reglas del lenguaje que hoy sobreviven miles de años después.
              </div>
            </div>

            <button
              onClick={() => setCurrentQuickAccess(null)}
              className="w-full mt-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Entendido, volver
            </button>
          </div>
        </div>
      )}

      {/* Modal para Simbolismo Glagolítico */}
      {currentQuickAccess === "alphabet" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#fff8f4] max-w-md w-full rounded-2xl overflow-hidden p-6 shadow-2xl border border-teal-600/10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-teal-900">
                <Sparkles className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-base font-sans">Simbolismo Glagolítico</h3>
              </div>
              <button
                onClick={() => setCurrentQuickAccess(null)}
                className="p-1 rounded-full hover:bg-gray-200/50 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-gray-700 leading-relaxed overflow-y-auto max-h-[60vh] pr-1">
              <p>
                El **alfabeto glagolítico** es el más antiguo alfabeto eslavo que se conoce. Fue creado en el siglo IX (año 863 d.C.) por el misionero bizantino **San Cirilo** para traducir textos sagrados.
              </p>

              <p>
                Cada grafía del glagolítico no era un simple sonido, sino una representación artística construida a partir de tres símbolos sagrados cristianos:
              </p>
              
              <div className="flex gap-3 justify-center my-2">
                <div className="flex-1 p-2 bg-white rounded-xl border border-teal-50 shadow-xs text-center">
                  <span className="text-lg font-bold text-teal-800 block">◯</span>
                  <span className="text-[9px] font-bold text-gray-500 uppercase">Círculo</span>
                  <p className="text-[8px] text-gray-400 leading-tight">Eternidad Divina</p>
                </div>
                <div className="flex-1 p-2 bg-white rounded-xl border border-teal-50 shadow-xs text-center">
                  <span className="text-lg font-bold text-teal-800 block">△</span>
                  <span className="text-[9px] font-bold text-gray-500 uppercase">Triángulo</span>
                  <p className="text-[8px] text-gray-400 leading-tight">Trinidad</p>
                </div>
                <div className="flex-1 p-2 bg-white rounded-xl border border-teal-50 shadow-xs text-center">
                  <span className="text-lg font-bold text-teal-800 block">┼</span>
                  <span className="text-[9px] font-bold text-gray-500 uppercase">Cruz</span>
                  <p className="text-[8px] text-gray-400 leading-tight">Salvación</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-teal-100 space-y-2">
                <h4 className="font-bold text-teal-900 uppercase tracking-wide text-[10px]">Ejemplos de Letras Glagolíticas:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl text-teal-950 font-serif">Ⰰ</span>
                    <div>
                      <strong className="text-teal-950 text-[11px]">Az (Letra A / Sonido 'a')</strong>
                      <p className="text-gray-500 text-[10px] leading-tight">Representa una cruz inclinada. Significa 'Yo' y simboliza el principio y el ser humano ante Dios.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-t border-gray-50 pt-2">
                    <span className="text-xl text-teal-950 font-serif">Ⰱ</span>
                    <div>
                      <strong className="text-teal-950 text-[11px]">Buky (Letra B / Sonido 'b')</strong>
                      <p className="text-gray-500 text-[10px] leading-tight">Significa 'Letras' o 'Palabras', simbolizando la revelación divina de la escritura.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 border-t border-gray-50 pt-2">
                    <span className="text-xl text-teal-950 font-serif">Ⰲ</span>
                    <div>
                      <strong className="text-teal-950 text-[11px]">Vede (Letra V / Sonido 'v')</strong>
                      <p className="text-gray-500 text-[10px] leading-tight">Significa 'Saber' o 'Conocer', conectando la lectura directa con la sabiduría.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentQuickAccess(null)}
              className="w-full mt-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Entendido, volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
