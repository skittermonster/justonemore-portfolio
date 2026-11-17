export type ProjectCategory = 'vst_dsp' | 'sound_design' | 'music';

export interface VstDspProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  specs: string[];
  audioDryUrl: string;
  audioProcessedUrl: string;
  repoOrDownloadUrl: string;
  architecture?: string;
  version?: string;
  synthPreset?: string;
}

export interface SoundboardPad {
  id: string;
  label: string;
  category: string;
  audioUrl: string;
  synthType: 'chime' | 'sub_drop' | 'impact' | 'riser' | 'footstep' | 'laser' | 'glitch' | 'clang' | 'beep';
  hotkey?: string;
}

export interface SoundDesignProject {
  id: string;
  title: string;
  description: string;
  tags: string[];
  videoUrl?: string;
  thumbnailPlaceholder?: string;
  audioFullMixUrl: string;
  audioSfxOnlyUrl: string;
  clientOrContext?: string;
  year?: string;
}

export interface MusicMarker {
  label: string;
  time: number; // in seconds
}

export interface MusicProject {
  id: string;
  title: string;
  role: string;
  tags: string[];
  bpm: number;
  lufs: string;
  duration: string;
  durationSeconds: number;
  audioUrl: string;
  markers: MusicMarker[];
}

export interface PortfolioData {
  metadata: {
    brand: string;
    engineer: string;
    role: string;
    bio: string;
    sampleRate: string;
    dspStatus: string;
    location: string;
    links: {
      github: string;
      email: string;
      youtube?: string;
      soundcloud?: string;
    };
  };
  vst_dsp: VstDspProject[];
  sound_design: {
    projects: SoundDesignProject[];
    soundboardPads: SoundboardPad[];
  };
  music: MusicProject[];
}

export type PlayableItemType = 'vst_dsp' | 'sound_design' | 'music';

export interface ActiveTrack {
  id: string;
  title: string;
  subtitle?: string;
  type: PlayableItemType;
  tags: string[];
  // For A/B switching (VST or Sound Design)
  hasAbSwitch: boolean;
  streamALabel: string; // e.g. "DRY BYPASS" or "SFX ONLY"
  streamBLabel: string; // e.g. "PROCESSED ENGAGED" or "FULL MIX"
  streamAUrl?: string;
  streamBUrl?: string;
  activeStream: 'A' | 'B';
  // Music specifics
  bpm?: number;
  lufs?: string;
  markers?: MusicMarker[];
  duration: number; // in seconds
}
