"use client";

import { useState } from "react";

const sampleTexts = [
  { label: "Greeting", text: "Hola, soy Camila. Soy una voz neural peruana, lista para ayudar a tu agente de inteligencia artificial." },
  { label: "News Reading", text: "Hoy en Lima, el gobierno anunció nuevas medidas para impulsar la economía digital del país, enfocándose en startups de inteligencia artificial." },
  { label: "Story", text: "En las alturas de los Andes, donde el cóndor vuela libre, una antigua leyenda cuenta sobre los quipus — los nudos que guardaban la memoria de todo un imperio." },
  { label: "Technical", text: "El modelo de lenguaje procesa tokens utilizando mecanismos de atención multi-cabeza, generando respuestas contextualmente relevantes en tiempo real." },
];

export default function VoiceDemo() {
  const [selectedText, setSelectedText] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("es-PE-CamilaNeural");

  const voices = [
    { id: "es-PE-CamilaNeural", name: "Camila", region: "🇵🇪 Peru", gender: "Female" },
    { id: "es-PE-AlexNeural", name: "Alex", region: "🇵🇪 Peru", gender: "Male" },
    { id: "es-MX-DaliaNeural", name: "Dalia", region: "🇲🇽 Mexico", gender: "Female" },
    { id: "es-ES-ElviraNeural", name: "Elvira", region: "🇪🇸 Spain", gender: "Female" },
  ];

  const handlePlay = () => {
    setIsPlaying(true);
    // In production, this would call the Edge TTS API
    // For demo, simulate playback
    setTimeout(() => setIsPlaying(false), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Voice selector */}
      <div>
        <label className="text-sm text-text-muted block mb-2">Select Voice</label>
        <div className="grid grid-cols-2 gap-2">
          {voices.map((voice) => (
            <button
              key={voice.id}
              onClick={() => setSelectedVoice(voice.id)}
              className={`p-3 rounded-xl text-left transition-all duration-200 ${
                selectedVoice === voice.id
                  ? "bg-primary/10 border border-primary/30 text-primary"
                  : "bg-background border border-border text-text-secondary hover:border-border-hover"
              }`}
            >
              <div className="text-sm font-medium">{voice.region} {voice.name}</div>
              <div className="text-xs opacity-60">{voice.gender} · Neural</div>
            </button>
          ))}
        </div>
      </div>

      {/* Sample text selector */}
      <div>
        <label className="text-sm text-text-muted block mb-2">Sample Text</label>
        <div className="flex flex-wrap gap-2">
          {sampleTexts.map((sample, i) => (
            <button
              key={i}
              onClick={() => setSelectedText(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedText === i
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "bg-background border border-border text-text-muted hover:text-text-secondary"
              }`}
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text preview */}
      <div className="p-4 rounded-xl bg-background border border-border">
        <p className="text-sm text-text-secondary leading-relaxed italic">
          &ldquo;{sampleTexts[selectedText].text}&rdquo;
        </p>
      </div>

      {/* Play controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
            isPlaying
              ? "bg-primary/20 text-primary cursor-wait"
              : "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/25"
          }`}
        >
          {isPlaying ? (
            <>
              <span className="flex gap-0.5">
                <span className="w-1 h-4 bg-primary rounded-full animate-pulse"></span>
                <span className="w-1 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.1s" }}></span>
                <span className="w-1 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></span>
              </span>
              Playing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Play Demo
            </>
          )}
        </button>
        <span className="text-xs text-text-muted">
          Powered by Edge TTS · {voices.find(v => v.id === selectedVoice)?.name} Neural
        </span>
      </div>

      {/* Note */}
      <p className="text-xs text-text-muted bg-background/50 p-3 rounded-lg border border-border">
        💡 This is a demo placeholder. In production, audio is generated server-side using Microsoft Edge TTS 
        and streamed to the browser. The full skill supports real-time TTS with adjustable speed, pitch, and SSML.
      </p>
    </div>
  );
}
