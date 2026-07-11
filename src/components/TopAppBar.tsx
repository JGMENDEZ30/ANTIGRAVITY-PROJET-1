import React, { useState } from "react";
import { Sparkles, X, HelpCircle, GraduationCap } from "lucide-react";

interface TopAppBarProps {
  onSuggestClick?: () => void;
}

export default function TopAppBar({ onSuggestClick }: TopAppBarProps) {
  const [showRescueModal, setShowRescueModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 w-full z-40 flex items-center justify-between px-6 h-16 bg-white border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-50 border-2 border-teal-600/20 overflow-hidden flex items-center justify-center">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA36GhIp0w5TLQu2G3Xw8QvGvKFmydIkNSlQxEzceaMX2P32jXAO2J4LybZwiSI2SarPo8L8SOI-7GqPK6dkyE2nkXVyWsLhVtHsA66RmcMM--HiI5xmH58vGG8f78jSEq-olYnYC9HcbGLSsWOL-34hspmIvJB3qxmaXXKbkY7kmo8wb4esxr8zCso_vo6aO_VDmSBYSGudT-dwnwTDrGGPhBth3aIgGkECkMXG0hwbdWYHIz85QfpNpAizEMLvoUgVnd4e1lzqkbF"
              alt="Avatar de Filólogo"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-sans font-bold text-lg text-teal-900 tracking-tight leading-none flex items-center gap-1.5">
              SlovoShift
              <span className="text-[10px] bg-teal-100 text-teal-800 font-semibold px-1.5 py-0.5 rounded">HISTORIA</span>
            </span>
            <span className="text-[11px] text-gray-500 font-medium">Desarrollo del Ruso</span>
          </div>
        </div>

        <button
          onClick={() => setShowRescueModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2 rounded-full transition-all active:scale-95 flex items-center gap-1.5 shadow-sm uppercase tracking-wider"
        >
          <HelpCircle className="w-4 h-4" />
          SOS Filólogo
        </button>
      </header>

      {/* SOS Rescue Modal */}
      {showRescueModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#fff8f4] max-w-md w-full rounded-2xl overflow-hidden p-6 shadow-2xl border border-teal-600/10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-red-600">
                <GraduationCap className="w-6 h-6" />
                <h3 className="font-bold text-lg font-sans">Guía de Emergencia Gramatical</h3>
              </div>
              <button
                onClick={() => setShowRescueModal(false)}
                className="p-1 rounded-full hover:bg-gray-200/50 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
              ¿Te encuentras en una discusión filológica apasionada o abrumado por los casos rusos? Respira hondo y recuerda estos principios estabilizadores:
            </p>

            <div className="space-y-3 mb-6">
              <div className="p-3 bg-white rounded-xl border border-gray-100 flex gap-3">
                <span className="text-lg font-bold text-teal-700 shrink-0">1</span>
                <div>
                  <h4 className="font-semibold text-xs text-teal-900 uppercase tracking-wider">La Regla de Oro de los Dobletes</h4>
                  <p className="text-xs text-gray-600">Si una palabra suena formal u poética, suele provenir del <strong>Eslavo Eclesiástico</strong>. Si suena común o práctica, es nativa de las estepas.</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gray-100 flex gap-3">
                <span className="text-lg font-bold text-teal-700 shrink-0">2</span>
                <div>
                  <h4 className="font-semibold text-xs text-teal-900 uppercase tracking-wider">El Secreto de los Casos</h4>
                  <p className="text-xs text-gray-600">El ruso moderno simplificó los tontos pasados complejos pero conservó los 6 casos gramaticales clásicos. ¡Cada desinencia cuenta una historia de 1500 años!</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-gray-100 flex gap-3">
                <span className="text-lg font-bold text-teal-700 shrink-0">3</span>
                <div>
                  <h4 className="font-semibold text-xs text-teal-900 uppercase tracking-wider">La Reforma Impresa</h4>
                  <p className="text-xs text-gray-600">Pedro el Grande eliminó letras ornamentales de un plumazo en 1708. Menos símbolos extraños significa más velocidad para imprimir ciencia civil.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowRescueModal(false)}
                className="flex-1 bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold py-3 rounded-xl transition-colors text-center"
              >
                Entendido, Mantener la Calma
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
