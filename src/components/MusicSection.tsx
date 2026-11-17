'use client';

import React from 'react';
import { MusicProject } from '@/types/portfolio';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { Play, Pause, Disc, Clock, Music2, Tag, ChevronRight } from 'lucide-react';

interface MusicSectionProps {
  tracks: MusicProject[];
}

export function MusicSection({ tracks }: MusicSectionProps) {
  const { activeTrack, isPlaying, currentTime, playMusicTrack, togglePlayPause, seek } = useAudioPlayer();

  const handleJump = (track: MusicProject, timeSec: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeTrack?.id !== track.id) {
      playMusicTrack(track);
      // slight delay to seek once loaded
      setTimeout(() => {
        seek(timeSec);
      }, 50);
    } else {
      seek(timeSec);
      if (!isPlaying) {
        togglePlayPause();
      }
    }
  };

  const formatSeconds = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <section id="section-music" className="py-12 border-b border-[#26262E]">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#FF9F1C] uppercase tracking-wider mb-1">
            <span className="w-2 h-2 bg-[#FF9F1C] inline-block" />
            <span>RACK SECTION 03 // MASTER AUDIO BUS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F3F4F6]">
            [03 // PRODUCTION & MIXES]
          </h2>
          <p className="text-sm text-[#8E929F] mt-1">
            Original Compositions, Vocaloid / Synthesizer V Tuning & Studio Mastering Showcase
          </p>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[11px] font-mono text-[#8E929F] bg-[#14141C] border border-[#26262E] px-2.5 py-1 rounded">
            EBU R128 NORMALIZED // HIGH INTEGRITY STEMS
          </span>
        </div>
      </div>

      {/* High-Density Studio Tracklist Table */}
      <div className="bg-[#121216] border border-[#26262E] rounded overflow-hidden">
        
        {/* Table Column Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-[#0A0A0E] border-b border-[#26262E] text-[11px] font-mono text-[#8E929F] uppercase tracking-wider">
          <div className="col-span-1"># // ACT</div>
          <div className="col-span-4">TRACK TITLE & ROLE</div>
          <div className="col-span-2">TECHNICAL SPECS</div>
          <div className="col-span-4">TIMESTAMP JUMP MARKERS</div>
          <div className="col-span-1 text-right">LENGTH</div>
        </div>

        {/* Track Rows */}
        <div className="divide-y divide-[#1C1C24]">
          {tracks.map((trk, index) => {
            const isThisTrackActive = activeTrack?.id === trk.id;
            const isThisPlaying = isThisTrackActive && isPlaying;
            const trackNum = (index + 1).toString().padStart(2, '0');

            return (
              <div
                key={trk.id}
                onClick={() => playMusicTrack(trk)}
                className={`grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-4 sm:px-6 py-4 cursor-pointer transition-all items-center ${
                  isThisTrackActive
                    ? 'bg-[#181822] border-l-4 border-l-[#FF9F1C]'
                    : 'hover:bg-[#16161D] border-l-4 border-l-transparent'
                }`}
              >
                {/* 1. Track Number & Play/Pause Trigger */}
                <div className="md:col-span-1 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isThisTrackActive) {
                        togglePlayPause();
                      } else {
                        playMusicTrack(trk);
                      }
                    }}
                    aria-label={isThisPlaying ? 'Pause track' : 'Play track'}
                    className={`w-8 h-8 rounded border flex items-center justify-center transition-all ${
                      isThisPlaying
                        ? 'bg-[#FF9F1C] border-[#FFAF38] text-[#0A0A0C] shadow-[0_0_12px_rgba(255,159,28,0.5)]'
                        : isThisTrackActive
                        ? 'bg-[#2A2A38] border-[#FF9F1C] text-[#FF9F1C]'
                        : 'bg-[#1A1A24] border-[#2A2A38] text-[#8E929F] hover:text-[#F3F4F6] hover:border-[#3E3E50]'
                    }`}
                  >
                    {isThisPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    )}
                  </button>

                  <span className="text-xs font-mono text-[#8E929F]">
                    {trackNum}
                  </span>
                </div>

                {/* 2. Track Title & Credits & Tags */}
                <div className="md:col-span-4 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-bold truncate ${
                      isThisTrackActive ? 'text-[#FF9F1C]' : 'text-[#F3F4F6]'
                    }`}>
                      {trk.title}
                    </h4>
                  </div>
                  
                  <p className="text-xs text-[#8E929F] truncate mt-0.5 font-mono">
                    {trk.role}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {trk.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0F0F14] border border-[#22222E] text-[#8E929F]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3. Technical Specs (BPM, LUFS) */}
                <div className="md:col-span-2">
                  <div className="flex md:flex-col gap-2 md:gap-0.5 text-xs font-mono">
                    <span className="text-[#F3F4F6] font-semibold">
                      {trk.bpm} <span className="text-[10px] text-[#8E929F] font-normal">BPM</span>
                    </span>
                    <span className="text-[#10B981] font-medium text-[11px]">
                      {trk.lufs}
                    </span>
                  </div>
                </div>

                {/* 4. Clickable Timestamp Jump Pills */}
                <div className="md:col-span-4">
                  <div className="text-[10px] font-mono text-[#8E929F] mb-1 md:hidden">
                    JUMP TO SECTION:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {trk.markers.map((marker, mIdx) => {
                      const isCurrentMarker =
                        isThisTrackActive &&
                        currentTime >= marker.time &&
                        (mIdx === trk.markers.length - 1 || currentTime < trk.markers[mIdx + 1].time);

                      return (
                        <button
                          key={mIdx}
                          type="button"
                          onClick={(e) => handleJump(trk, marker.time, e)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all border flex items-center gap-1 ${
                            isCurrentMarker
                              ? 'bg-[#FF9F1C]/20 border-[#FF9F1C] text-[#FF9F1C] font-bold shadow-[0_0_8px_rgba(255,159,28,0.3)]'
                              : 'bg-[#181822] hover:bg-[#222230] text-[#C5C8D4] border-[#2E2E3C] hover:border-[#424254]'
                          }`}
                        >
                          <span className="text-[#8E929F]">{formatSeconds(marker.time)}</span>
                          <span>{marker.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Duration */}
                <div className="md:col-span-1 text-right">
                  <span className="text-xs font-mono text-[#8E929F]">
                    {trk.duration}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Master Bus Footer Bar */}
        <div className="px-6 py-2.5 bg-[#0D0D12] border-t border-[#1E1E26] flex items-center justify-between text-[11px] font-mono text-[#8E929F]">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF9F1C]" />
            <span>MIX BUS ARCHITECTURE: 32-BIT FLOAT INTERNAL PROCESSING</span>
          </span>
          <span className="hidden sm:inline">PEAK CEILING: -0.3 dBFS TRUE PEAK</span>
        </div>

      </div>
    </section>
  );
}
