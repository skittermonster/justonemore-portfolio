'use client';

import React, { useEffect } from 'react';
import { SoundDesignProject, SoundboardPad } from '@/types/portfolio';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { Volume2, Play, Radio, Sparkles, Layers, Sliders, Film } from 'lucide-react';

interface SoundDesignSectionProps {
  projects: SoundDesignProject[];
  pads: SoundboardPad[];
}

export function SoundDesignSection({ projects, pads }: SoundDesignSectionProps) {
  const {
    activeTrack,
    isPlaying,
    abMode,
    activePadId,
    playSoundDesign,
    triggerPad,
  } = useAudioPlayer();

  // Keyboard shortcut listener for pads 1-9
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const key = e.key;
      const matchedPad = pads.find((p) => p.hotkey === key);
      if (matchedPad) {
        e.preventDefault();
        triggerPad(matchedPad);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pads, triggerPad]);

  return (
    <section id="section-sound-design" className="py-12 border-b border-[#26262E]">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF9F1C] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 bg-[#FF9F1C] inline-block" />
            <span>RACK SECTION 02 // AUDIO POST & PROCEDURAL SFX</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F3F4F6]">
            [02 // SOUND DESIGN & SFX]
          </h2>
          <p className="text-sm text-[#8E929F] mt-1">
            Sound Redesign Reels, 3D Foley Stems & Zero-Latency Interactive Hardware Sampler
          </p>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[11px] font-mono text-[#8E929F] bg-[#14141C] border border-[#26262E] px-2.5 py-1 rounded">
            HOTKEYS: PRESS KEYS [1] - [9] TO TRIGGER PADS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Redesign Reels (7 cols) */}
        <div className="xl:col-span-7 space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E1E26]">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#C5C8D4] flex items-center gap-2">
              <Film className="w-4 h-4 text-[#FF9F1C]" />
              <span>REELS & CINEMATIC SOUNDSCAPES</span>
            </h3>
            <span className="text-[11px] font-mono text-[#8E929F]">
              {projects.length} PROJECTS LOADED
            </span>
          </div>

          <div className="space-y-6">
            {projects.map((proj) => {
              const isThisTrackActive = activeTrack?.id === proj.id;

              return (
                <div
                  key={proj.id}
                  className={`bg-[#121216] border rounded transition-all p-5 relative ${
                    isThisTrackActive
                      ? 'border-[#FF9F1C] shadow-[0_0_18px_rgba(255,159,28,0.12)] bg-[#14141A]'
                      : 'border-[#26262E] hover:border-[#383844]'
                  }`}
                >
                  {/* Decorative rack screw */}
                  <div className="absolute top-2.5 right-2.5 rack-screw" />

                  {/* Header / Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF9F1C] bg-[#FF9F1C]/10 border border-[#FF9F1C]/30 px-1.5 py-0.5 rounded">
                        {proj.clientOrContext || 'SOUND DESIGN'}
                      </span>
                      {proj.year && (
                        <span className="text-[10px] font-mono text-[#8E929F]">
                          {proj.year}
                        </span>
                      )}
                    </div>

                    {isThisTrackActive && (
                      <span className="text-[10px] font-mono text-[#10B981] flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                        AUDITIONING ({abMode === 'A' ? 'SFX ONLY' : 'FULL MIX'})
                      </span>
                    )}
                  </div>

                  <h4 className="text-base font-bold text-[#F3F4F6] mb-2">
                    {proj.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-[#C5C8D4] leading-relaxed mb-4">
                    {proj.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-[#181822] border border-[#2E2E3C] text-[11px] font-mono text-[#8E929F]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Audition Action Buttons */}
                  <div className="pt-3 border-t border-[#1E1E26] flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => playSoundDesign(proj, 'B')}
                      className={`flex-1 py-1.5 px-3 rounded text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all border ${
                        isThisTrackActive && isPlaying && abMode === 'B'
                          ? 'bg-[#10B981] text-[#0A0A0C] border-[#34D399] shadow-[0_0_12px_rgba(16,185,129,0.35)]'
                          : 'bg-[#181822] hover:bg-[#20202E] text-[#F3F4F6] border-[#323242]'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>AUDITION FULL MIX</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => playSoundDesign(proj, 'A')}
                      className={`flex-1 py-1.5 px-3 rounded text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all border ${
                        isThisTrackActive && isPlaying && abMode === 'A'
                          ? 'bg-[#FF9F1C] text-[#0A0A0C] border-[#FFAF38] shadow-[0_0_12px_rgba(255,159,28,0.35)]'
                          : 'bg-[#181822] hover:bg-[#20202E] text-[#F3F4F6] border-[#323242]'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 text-[#FF9F1C]" />
                      <span>ISOLATE SFX STEMS</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: 3x3 Interactive SFX Sampler Rack (5 cols) */}
        <div className="xl:col-span-5">
          <div className="bg-[#121216] border border-[#26262E] rounded p-5 relative">
            {/* Rack Screws */}
            <div className="absolute top-2.5 left-2.5 rack-screw" />
            <div className="absolute top-2.5 right-2.5 rack-screw" />
            <div className="absolute bottom-2.5 left-2.5 rack-screw" />
            <div className="absolute bottom-2.5 right-2.5 rack-screw" />

            {/* Hardware Module Header */}
            <div className="pb-4 mb-4 border-b border-[#1E1E26] px-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FF9F1C] animate-pulse" />
                    <span className="text-[10px] font-mono text-[#FF9F1C] uppercase tracking-wider">
                      HARDWARE SAMPLER RACK // MPC-9
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#F3F4F6] mt-0.5">
                    Tactile One-Shot Matrix
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-2 py-0.5 rounded">
                  0-LATENCY DSP
                </span>
              </div>
              <p className="text-xs text-[#8E929F] mt-1.5">
                Click any velocity-sensitive pad or use keyboard keys [1]-[9] to fire instant procedural SFX stems.
              </p>
            </div>

            {/* 3x3 Pad Grid */}
            <div className="grid grid-cols-3 gap-3 p-1">
              {pads.map((pad) => {
                const isActive = activePadId === pad.id;

                return (
                  <button
                    key={pad.id}
                    type="button"
                    onClick={() => triggerPad(pad)}
                    className={`relative aspect-square rounded-md p-2 flex flex-col justify-between text-left transition-all cursor-pointer select-none active:scale-95 ${
                      isActive
                        ? 'bg-[#2A2318] border-2 border-[#FF9F1C] shadow-[0_0_18px_rgba(255,159,28,0.7)] translate-y-0.5'
                        : 'bg-[#181820] hover:bg-[#1E1E28] border border-[#2E2E3C] hover:border-[#444458]'
                    }`}
                  >
                    {/* Top Row: Hotkey Pill + Category */}
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border font-bold ${
                        isActive 
                          ? 'bg-[#FF9F1C] text-[#0A0A0C] border-[#FF9F1C]' 
                          : 'bg-[#101015] text-[#8E929F] border-[#26262E]'
                      }`}>
                        [{pad.hotkey || '#'}]
                      </span>

                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-[#FF9F1C] shadow-[0_0_6px_#FF9F1C]' : 'bg-[#2A2A38]'
                      }`} />
                    </div>

                    {/* Center / Bottom: Label & Category */}
                    <div>
                      <div className="text-[9px] font-mono text-[#8E929F] uppercase tracking-tighter">
                        {pad.category}
                      </div>
                      <div className="text-xs font-mono font-bold text-[#F3F4F6] leading-tight mt-0.5">
                        {pad.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Status / Instructions */}
            <div className="mt-4 pt-3 border-t border-[#1E1E26] px-1 flex items-center justify-between text-[11px] font-mono text-[#8E929F]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                POLYPHONIC ENGINE
              </span>
              <span>BUFFER: 0ms // ASYNC WEB AUDIO</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
