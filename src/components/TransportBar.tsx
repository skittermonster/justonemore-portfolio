'use client';

import React from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { Play, Pause, Volume2, VolumeX, Sliders, Activity, Disc, Radio } from 'lucide-react';

export function TransportBar() {
  const {
    activeTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    abMode,
    meterLevels,
    togglePlayPause,
    seek,
    toggleAbMode,
    setVolume,
    toggleMute,
  } = useAudioPlayer();

  const formatTime = (secs: number) => {
    if (isNaN(secs) || !isFinite(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-[#0E0E13] border-t border-[#26262E] shadow-[0_-8px_24px_rgba(0,0,0,0.85)]">
      {/* Top 1px Accent Highlight Line */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#FF9F1C]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
          
          {/* LEFT: Track Info / Monitor Status */}
          <div className="flex items-center gap-3 w-full lg:w-1/4 min-w-0">
            {/* Vinyl / Rack Disc icon */}
            <div className={`w-10 h-10 rounded border flex items-center justify-center shrink-0 transition-colors ${
              isPlaying 
                ? 'bg-[#181822] border-[#FF9F1C] text-[#FF9F1C] shadow-[0_0_10px_rgba(255,159,28,0.25)]' 
                : 'bg-[#121216] border-[#26262E] text-[#8E929F]'
            }`}>
              <Disc className={`w-5 h-5 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            </div>

            <div className="min-w-0 flex-1">
              {activeTrack ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-wider px-1.5 py-0.5 rounded uppercase border bg-[#1A1A24] text-[#FF9F1C] border-[#FF9F1C]/40">
                      {activeTrack.type === 'vst_dsp' ? 'DSP // VST' : activeTrack.type === 'sound_design' ? 'SFX // REEL' : 'TRACK // MIX'}
                    </span>
                    {activeTrack.bpm && (
                      <span className="text-[10px] font-mono text-[#8E929F]">
                        {activeTrack.bpm} BPM
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-semibold text-[#F3F4F6] truncate mt-0.5" title={activeTrack.title}>
                    {activeTrack.title}
                  </h4>
                  {activeTrack.subtitle && (
                    <p className="text-[11px] text-[#8E929F] truncate">
                      {activeTrack.subtitle}
                    </p>
                  )}
                </>
              ) : (
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#8E929F]">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    MASTER MONITOR IDLE
                  </div>
                  <p className="text-xs text-[#8E929F] font-mono truncate mt-0.5">
                    Click any module or pad to audition
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CENTER: Transport Controls & Seek Timeline */}
          <div className="flex flex-col items-center gap-1.5 w-full lg:w-2/4">
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Play / Pause Primary Button */}
              <button
                type="button"
                onClick={togglePlayPause}
                disabled={!activeTrack}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className={`relative px-4 py-1.5 rounded flex items-center gap-2 text-xs font-mono font-medium border transition-all active:translate-y-0.5 ${
                  !activeTrack
                    ? 'opacity-40 cursor-not-allowed bg-[#15151C] border-[#26262E] text-[#8E929F]'
                    : isPlaying
                    ? 'bg-[#FF9F1C] border-[#FFAF38] text-[#0A0A0C] shadow-[0_0_14px_rgba(255,159,28,0.4)]'
                    : 'bg-[#1A1A24] hover:bg-[#222230] border-[#363644] text-[#F3F4F6]'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              {/* Conditional A/B Bypass Switch (Only for VST / Sound Design tracks) */}
              {activeTrack?.hasAbSwitch && (
                <div className="flex items-center bg-[#14141C] border border-[#2E2E3A] rounded p-0.5 shadow-inner">
                  <button
                    type="button"
                    onClick={toggleAbMode}
                    className={`px-2.5 py-1 text-[11px] font-mono flex items-center gap-1.5 rounded transition-all ${
                      abMode === 'A'
                        ? 'bg-[#282836] text-[#F3F4F6] border border-[#3E3E50] shadow-sm font-semibold'
                        : 'text-[#8E929F] hover:text-[#C5C8D4]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${abMode === 'A' ? 'bg-[#FF9F1C] shadow-[0_0_6px_#FF9F1C]' : 'bg-[#3A3A4A]'}`} />
                    <span>{activeTrack.streamALabel || 'A: DRY'}</span>
                  </button>

                  <div className="w-[1px] h-4 bg-[#26262E] mx-0.5" />

                  <button
                    type="button"
                    onClick={toggleAbMode}
                    className={`px-2.5 py-1 text-[11px] font-mono flex items-center gap-1.5 rounded transition-all ${
                      abMode === 'B'
                        ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50 shadow-[0_0_8px_rgba(16,185,129,0.25)] font-semibold'
                        : 'text-[#8E929F] hover:text-[#C5C8D4]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${abMode === 'B' ? 'bg-[#10B981] shadow-[0_0_6px_#10B981]' : 'bg-[#3A3A4A]'}`} />
                    <span>{activeTrack.streamBLabel || 'B: PROCESSED'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Seek Bar + Monospace Timestamps */}
            <div className="w-full flex items-center gap-2.5">
              <span className="text-[10px] font-mono text-[#8E929F] w-10 text-right tabular-nums">
                {formatTime(currentTime)}
              </span>

              <div className="relative flex-1 flex items-center group">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeekChange}
                  disabled={!activeTrack}
                  aria-label="Seek timeline"
                  className="w-full h-1.5 bg-[#1C1C24] rounded-sm appearance-none cursor-pointer border border-[#2E2E3C] focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #FF9F1C ${
                      duration ? (currentTime / duration) * 100 : 0
                    }%, #1C1C24 ${duration ? (currentTime / duration) * 100 : 0}%)`,
                  }}
                />
              </div>

              <span className="text-[10px] font-mono text-[#8E929F] w-10 tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* RIGHT: Real-time 8-Bar LED Meter + Master Volume */}
          <div className="flex items-center justify-end gap-4 w-full lg:w-1/4">
            
            {/* 8-Bar Hardware LED VU Meter */}
            <div className="flex flex-col items-center">
              <div className="flex items-end gap-1 h-5 px-2 py-0.5 bg-[#08080A] border border-[#26262E] rounded">
                {meterLevels.map((lvl, idx) => {
                  const heightPercent = Math.min(100, Math.round(lvl * 100));
                  const isHot = heightPercent > 75;
                  const isMid = heightPercent > 45;
                  
                  return (
                    <div
                      key={idx}
                      className="w-1.5 h-full bg-[#181820] rounded-2xs relative flex flex-col justify-end overflow-hidden"
                    >
                      <div
                        className={`w-full transition-all duration-75 ${
                          isHot
                            ? 'bg-[#EF4444]'
                            : isMid
                            ? 'bg-[#FF9F1C]'
                            : 'bg-[#10B981]'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <span className="text-[9px] font-mono text-[#8E929F] mt-0.5 tracking-tighter">
                VU PEAK
              </span>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="p-1 rounded text-[#8E929F] hover:text-[#F3F4F6] transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-[#EF4444]" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Master volume"
                className="w-16 sm:w-20 h-1 bg-[#1C1C24] rounded-sm appearance-none cursor-pointer border border-[#2E2E3C] focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #FF9F1C ${
                    (isMuted ? 0 : volume) * 100
                  }%, #1C1C24 ${(isMuted ? 0 : volume) * 100}%)`,
                }}
              />
            </div>

          </div>

        </div>
      </div>
    </footer>
  );
}
