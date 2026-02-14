"use client";

import { useState } from "react";

const sampleTexts = [
  { label: "Saludo", text: "Hola, soy Camila. Soy una voz neural peruana, lista para ayudar a tu agente de inteligencia artificial." },
  { label: "Noticias", text: "Hoy en Lima, el gobierno anunció nuevas medidas para impulsar la economía digital del país, enfocándose en startups de inteligencia artificial." },
  { label: "Cuento", text: "En las alturas de los Andes, donde el cóndor vuela libre, una antigua leyenda cuenta sobre los quipus — los nudos que guardaban la memoria de todo un imperio." },
  { label: "Técnico", text: "El modelo de lenguaje procesa tokens utilizando mecanismos de atención multi-cabeza, generando respuestas contextualmente relevantes en tiempo real." },
];

export default function VoiceDemo() {
  const [selectedText, setSelectedText] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("es-PE-CamilaNeural");

  const voices = [
    { id: "es-PE-CamilaNeural", name: "Camila", region: "🇵🇪 Perú", gender: "Femenino" },
    { id: "es-PE-AlexNeural", name: "Alex", region: "🇵🇪 Perú", gender: "Masculino" },
    { id: "es-MX-DaliaNeural", name: "Dalia", region: "🇲🇽 México", gender: "Femenino" },
    { id: "es-ES-ElviraNeural", name: "Elvira", region: "🇪🇸 España", gender: "Femenino" },
  ];

  const handlePlay = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Voice selector */}
      <div>
        <label className="text-xs font-medium text-text-muted block mb-2">Selecciona una voz</label>
        <div className="grid grid-cols-2 gap-2">
          {voices.map((voice) => (
            <button
              key={voice.id}
              onClick={() => setSelectedVoice(voice.id)}
              className={`p-3 rounded-xl text-left transition-all duration-200 ${
                selectedVoice === voice.id
                  ? "bg-primary-light border-2 border-primary text-primary"
                  : "bg-gray-50 border border-border text-text-secondary hover:border-gray-300"
              }`}
            >
              <div className="text-sm font-medium">{voice.region} {voice.name}</div>
              <div className="text-[11px] opacity-60">{voice.gender} · Neural</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sample text selector */}
      <div>
        <label className="text-xs font-medium text-text-muted block mb-2">Texto de ejemplo</label>
        <div className="flex flex-wrap gap-2">
          {sampleTexts.map((sample, i) => (
            <button
              key={i}
              onClick={() => setSelectedText(i)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedText === i
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text-muted hover:bg-gray-200"
              }`}
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text preview */}
      <div className="p-4 rounded-xl bg-gray-50 border border-border">
        <p className="text-sm text-text-secondary leading-relaxed italic">
          &ldquo;{sampleTexts[selectedText].text}&rdquo;
        </p>
      </div>

      {/* Play controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 shadow-sm ${
            isPlaying
              ? "bg-primary/20 text-primary cursor-wait"
              : "bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/20"
          }`}
        >
          {isPlaying ? (
            <>
              <span className="flex gap-0.5">
                <span className="w-1 h-4 bg-primary rounded-full animate-pulse"></span>
                <span className="w-1 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.1s" }}></span>
                <span className="w-1 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></span>
              </span>
              Reproduciendo...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Reproducir demo
            </>
          )}
        </button>
        <span className="text-[11px] text-text-muted">
          Edge TTS · {voices.find(v => v.id === selectedVoice)?.name} Neural
        </span>
      </div>

      {/* Note */}
      <p className="text-[11px] text-text-muted bg-amber-50 border border-amber-200 p-3 rounded-lg">
        💡 Esto es un demo. En producción, el audio se genera en el servidor usando Microsoft Edge TTS 
        y se transmite al navegador. El skill completo soporta TTS en tiempo real con velocidad, tono y SSML ajustables.
      </p>
    </div>
  );
}
