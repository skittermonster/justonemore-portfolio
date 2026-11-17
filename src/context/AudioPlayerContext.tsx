'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { ActiveTrack, VstDspProject, SoundDesignProject, MusicProject, SoundboardPad } from '@/types/portfolio';
import { synthEngine } from '@/lib/synthAudio';

interface AudioPlayerContextType {
  activeTrack: ActiveTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  abMode: 'A' | 'B';
  meterLevels: number[];
  activePadId: string | null;

  // Actions
  playVstAb: (vst: VstDspProject) => void;
  playSoundDesign: (sd: SoundDesignProject, defaultStream?: 'A' | 'B') => void;
  playMusicTrack: (music: MusicProject) => void;
  togglePlayPause: () => void;
  seek: (seconds: number) => void;
  toggleAbMode: () => void;
  setAbMode: (mode: 'A' | 'B') => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  triggerPad: (pad: SoundboardPad) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [activeTrack, setActiveTrack] = useState<ActiveTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(180);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [abMode, setAbModeState] = useState<'A' | 'B'>('B');
  const [meterLevels, setMeterLevels] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [activePadId, setActivePadId] = useState<string | null>(null);

  // Hidden HTML5 audio element for actual external URLs (if provided)
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const padTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize HTML5 Audio element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio();
      audio.preload = 'metadata';
      audioRef.current = audio;

      const handleTimeUpdate = () => {
        if (!audio.paused) {
          setCurrentTime(audio.currentTime);
        }
      };

      const handleLoadedMetadata = () => {
        if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration)) {
          setDuration(audio.duration);
        }
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (synthEngine) {
          synthEngine.stopTrackAudition();
        }
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
      };
    }
  }, []);

  // Real-time meter animation loop
  useEffect(() => {
    let active = true;

    const updateMeters = () => {
      if (!active) return;

      if (isPlaying && synthEngine) {
        const liveLevels = synthEngine.getMeterLevels();
        // Add subtle natural jitter if playing
        const boosted = liveLevels.map((val) => Math.min(1, Math.max(0.08, val)));
        setMeterLevels(boosted);
      } else {
        // Smooth decay to zero
        setMeterLevels((prev) =>
          prev.map((val) => (val > 0.02 ? val * 0.78 : 0))
        );
      }

      animFrameRef.current = requestAnimationFrame(updateMeters);
    };

    animFrameRef.current = requestAnimationFrame(updateMeters);

    return () => {
      active = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying]);

  // Volume & Mute sync
  const setVolume = useCallback((val: number) => {
    setVolumeState(val);
    if (synthEngine) {
      synthEngine.setVolume(val);
    }
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : val;
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (synthEngine) {
        synthEngine.setMute(next);
      }
      if (audioRef.current) {
        audioRef.current.volume = next ? 0 : volume;
      }
      return next;
    });
  }, [volume]);

  // A/B mode toggle
  const setAbMode = useCallback((mode: 'A' | 'B') => {
    setAbModeState(mode);
    if (synthEngine) {
      synthEngine.setAbMode(mode);
    }

    setActiveTrack((prev) => {
      if (!prev) return null;
      const targetUrl = mode === 'A' ? prev.streamAUrl : prev.streamBUrl;
      if (audioRef.current && targetUrl) {
        const currentPos = audioRef.current.currentTime;
        audioRef.current.src = targetUrl;
        audioRef.current.currentTime = currentPos;
        if (isPlaying) {
          audioRef.current.play().catch(() => {});
        }
      }
      return {
        ...prev,
        activeStream: mode,
      };
    });
  }, [isPlaying]);

  const toggleAbMode = useCallback(() => {
    setAbMode(abMode === 'A' ? 'B' : 'A');
  }, [abMode, setAbMode]);

  // Seek
  const seek = useCallback((seconds: number) => {
    const clamped = Math.max(0, Math.min(duration, seconds));
    setCurrentTime(clamped);

    if (synthEngine) {
      synthEngine.seekTrack(clamped);
    }

    if (audioRef.current && audioRef.current.src) {
      audioRef.current.currentTime = clamped;
    }
  }, [duration]);

  // Play VST Project with A/B dry/processed
  const playVstAb = useCallback((vst: VstDspProject) => {
    const newTrack: ActiveTrack = {
      id: vst.id,
      title: vst.title,
      subtitle: vst.subtitle,
      type: 'vst_dsp',
      tags: vst.tags,
      hasAbSwitch: true,
      streamALabel: 'DRY BYPASS',
      streamBLabel: 'PROCESSED ENGAGED',
      streamAUrl: vst.audioDryUrl,
      streamBUrl: vst.audioProcessedUrl,
      activeStream: 'B',
      duration: 120, // default loop length
    };

    setActiveTrack(newTrack);
    setAbModeState('B');
    setCurrentTime(0);
    setDuration(120);
    setIsPlaying(true);

    if (synthEngine) {
      synthEngine.setAbMode('B');
      synthEngine.startTrackAudition(vst.id, 'vst_dsp', 120, 0, (time) => {
        setCurrentTime(time % 120);
      });
    }

    // If external URL exists
    if (audioRef.current && vst.audioProcessedUrl) {
      audioRef.current.src = vst.audioProcessedUrl;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  // Play Sound Design Reel
  const playSoundDesign = useCallback((sd: SoundDesignProject, defaultStream: 'A' | 'B' = 'B') => {
    const newTrack: ActiveTrack = {
      id: sd.id,
      title: sd.title,
      subtitle: sd.clientOrContext,
      type: 'sound_design',
      tags: sd.tags,
      hasAbSwitch: true,
      streamALabel: 'SFX ONLY',
      streamBLabel: 'FULL MIX',
      streamAUrl: sd.audioSfxOnlyUrl,
      streamBUrl: sd.audioFullMixUrl,
      activeStream: defaultStream,
      duration: 90,
    };

    setActiveTrack(newTrack);
    setAbModeState(defaultStream);
    setCurrentTime(0);
    setDuration(90);
    setIsPlaying(true);

    if (synthEngine) {
      synthEngine.setAbMode(defaultStream);
      synthEngine.startTrackAudition(sd.id, 'sound_design', 110, 0, (time) => {
        setCurrentTime(time % 90);
      });
    }

    const url = defaultStream === 'A' ? sd.audioSfxOnlyUrl : sd.audioFullMixUrl;
    if (audioRef.current && url) {
      audioRef.current.src = url;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

  // Play Music Production Track
  const playMusicTrack = useCallback((music: MusicProject) => {
    // If clicking same music track, toggle play/pause
    if (activeTrack?.id === music.id) {
      togglePlayPause();
      return;
    }

    const newTrack: ActiveTrack = {
      id: music.id,
      title: music.title,
      subtitle: music.role,
      type: 'music',
      tags: music.tags,
      hasAbSwitch: false,
      streamALabel: '',
      streamBLabel: '',
      streamAUrl: music.audioUrl,
      streamBUrl: '',
      activeStream: 'A',
      bpm: music.bpm,
      lufs: music.lufs,
      markers: music.markers,
      duration: music.durationSeconds,
    };

    setActiveTrack(newTrack);
    setCurrentTime(0);
    setDuration(music.durationSeconds);
    setIsPlaying(true);

    if (synthEngine) {
      synthEngine.startTrackAudition(music.id, 'music', music.bpm, 0, (time) => {
        setCurrentTime(Math.min(music.durationSeconds, time));
      });
    }

    if (audioRef.current && music.audioUrl) {
      audioRef.current.src = music.audioUrl;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [activeTrack]);

  // Toggle Play / Pause
  const togglePlayPause = useCallback(() => {
    if (!activeTrack) return;

    if (isPlaying) {
      setIsPlaying(false);
      if (synthEngine) {
        synthEngine.stopTrackAudition();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setIsPlaying(true);
      if (synthEngine) {
        synthEngine.startTrackAudition(
          activeTrack.id,
          activeTrack.type,
          activeTrack.bpm || 120,
          currentTime,
          (time) => {
            setCurrentTime(Math.min(duration, time));
          }
        );
      }
      if (audioRef.current && audioRef.current.src) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [activeTrack, isPlaying, currentTime, duration]);

  // Trigger tactile 3x3 Soundboard Pad
  const triggerPad = useCallback((pad: SoundboardPad) => {
    setActivePadId(pad.id);

    if (padTimeoutRef.current) {
      clearTimeout(padTimeoutRef.current);
    }
    padTimeoutRef.current = setTimeout(() => {
      setActivePadId(null);
    }, 280);

    if (synthEngine) {
      synthEngine.playPad(pad.synthType);
    }
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        activeTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        abMode,
        meterLevels,
        activePadId,
        playVstAb,
        playSoundDesign,
        playMusicTrack,
        togglePlayPause,
        seek,
        toggleAbMode,
        setAbMode,
        setVolume,
        toggleMute,
        triggerPad,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
}
