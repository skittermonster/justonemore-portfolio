'use client';

import React, { useState } from 'react';
import { VstDspProject } from '@/types/portfolio';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { Sliders, ChevronDown, ChevronUp, Sparkles, CheckCircle2, Play, Volume2 } from 'lucide-react';
import { GithubIcon } from '@/components/Icons';

interface VstDspSectionProps {
  projects: VstDspProject[];
}

export function VstDspSection({ projects }: VstDspSectionProps) {
  const { activeTrack, isPlaying, abMode, playVstAb, toggleAbMode } = useAudioPlayer();
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({});

  const toggleSpec = (id: string) => {
    setExpandedSpecs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="section-vst-dsp" className="py-12 border-b border-[#26262E]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF9F1C] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 bg-[#FF9F1C] inline-block" />
            <span>RACK SECTION 01 // DSP ARCHITECTURE</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F3F4F6]">
            [01 // TOOLS & DSP]
          </h2>
          <p className="text-sm text-[#8E929F] mt-1">
            Audio Plugins, Real-time Voice Pipelines & Digital Signal Processing Algorithms
          </p>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[11px] font-mono text-[#8E929F] bg-[#14141C] border border-[#26262E] px-2.5 py-1 rounded">
            A/B HARDWARE BYPASS COMPLIANT
          </span>
        </div>
      </div>

      {/* 2-Column Responsive Hardware Rack Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((item) => {
          const isThisTrackActive = activeTrack?.id === item.id;
          const isSpecsOpen = !!expandedSpecs[item.id];

          return (
            <div
              key={item.id}
              className={`relative bg-[#121216] border rounded transition-all flex flex-col justify-between ${
                isThisTrackActive
                  ? 'border-[#FF9F1C] shadow-[0_0_20px_rgba(255,159,28,0.15)] bg-[#14141A]'
                  : 'border-[#26262E] hover:border-[#383844]'
              }`}
            >
              {/* Rack corner screws */}
              <div className="absolute top-2.5 left-2.5 rack-screw" />
              <div className="absolute top-2.5 right-2.5 rack-screw" />
              <div className="absolute bottom-2.5 left-2.5 rack-screw" />
              <div className="absolute bottom-2.5 right-2.5 rack-screw" />

              {/* Module Header Bar */}
              <div className="px-6 pt-6 pb-4 border-b border-[#1E1E26]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF9F1C] bg-[#FF9F1C]/10 border border-[#FF9F1C]/30 px-1.5 py-0.5 rounded">
                        DSP MODULE
                      </span>
                      {item.version && (
                        <span className="text-[10px] font-mono text-[#8E929F]">
                          {item.version}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#F3F4F6] tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#8E929F] font-mono mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Active Status Diode */}
                  <div className="flex items-center gap-1.5 shrink-0 pt-1">
                    <span
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        isThisTrackActive && isPlaying
                          ? 'bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse'
                          : isThisTrackActive
                          ? 'bg-[#FF9F1C]'
                          : 'bg-[#2A2A38]'
                      }`}
                    />
                    <span className="text-[10px] font-mono text-[#8E929F] uppercase">
                      {isThisTrackActive ? (isPlaying ? 'ACTIVE' : 'READY') : 'STANDBY'}
                    </span>
                  </div>
                </div>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-[#181822] border border-[#2E2E3C] text-[11px] font-mono text-[#C5C8D4]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Module Body Content */}
              <div className="p-6 space-y-4 flex-1">
                <p className="text-xs sm:text-sm text-[#C5C8D4] leading-relaxed">
                  {item.description}
                </p>

                {item.architecture && (
                  <div className="text-[11px] font-mono text-[#8E929F] bg-[#0E0E12] p-2 rounded border border-[#1E1E26] flex items-center justify-between">
                    <span>FORMAT:</span>
                    <span className="text-[#F3F4F6] font-medium">{item.architecture}</span>
                  </div>
                )}

                {/* Collapsible [SPECS] */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => toggleSpec(item.id)}
                    className="w-full flex items-center justify-between py-1.5 px-3 rounded bg-[#16161E] hover:bg-[#1E1E28] border border-[#2A2A36] text-xs font-mono text-[#8E929F] hover:text-[#F3F4F6] transition-all"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-[#FF9F1C]" />
                      <span>{isSpecsOpen ? 'HIDE [SPECS]' : 'VIEW [SPECS] DETAILS'}</span>
                    </span>
                    {isSpecsOpen ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isSpecsOpen && (
                    <div className="mt-2.5 p-3 rounded bg-[#0A0A0E] border border-[#22222E] space-y-2 text-xs font-mono text-[#8E929F]">
                      {item.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2">
                          <span className="text-[#10B981] mt-0.5">▸</span>
                          <span className="leading-snug text-[#C5C8D4]">{spec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: A/B LOAD + GitHub */}
              <div className="px-6 pb-6 pt-3 border-t border-[#1E1E26] flex flex-wrap items-center justify-between gap-3 bg-[#0F0F14]/60">
                <button
                  type="button"
                  onClick={() => playVstAb(item)}
                  className={`flex-1 min-w-[200px] py-2 px-4 rounded text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all border ${
                    isThisTrackActive && isPlaying
                      ? 'bg-[#10B981] text-[#0A0A0C] border-[#34D399] shadow-[0_0_14px_rgba(16,185,129,0.4)]'
                      : 'bg-[#FF9F1C] hover:bg-[#FFAE3B] text-[#0A0A0C] border-[#FFAF38] shadow-[0_0_12px_rgba(255,159,28,0.25)]'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span>
                    {isThisTrackActive && isPlaying
                      ? `AUDITIONING (${abMode === 'A' ? 'A: DRY' : 'B: PROCESSED'})`
                      : 'LOAD A/B COMPARISON'}
                  </span>
                </button>

                {item.repoOrDownloadUrl && (
                  <a
                    href={item.repoOrDownloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded bg-[#16161E] hover:bg-[#1E1E28] border border-[#2E2E3A] hover:border-[#444458] text-xs font-mono text-[#F3F4F6] flex items-center gap-1.5 transition-all"
                  >
                    <GithubIcon className="w-3.5 h-3.5 text-[#8E929F]" />
                    <span>SOURCE</span>
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
