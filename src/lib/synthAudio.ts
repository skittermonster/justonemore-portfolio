/**
 * Web Audio API Synth Engine for JustOneMore Studio Portfolio
 * Zero external audio dependencies needed for local testing & interactive verification.
 * Provides authentic one-shot SFX, real-time procedural track previews,
 * and genuine A/B DSP processing (Dry vs. Overdriven / Filtered / Spatialized).
 */

class SynthAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.85;

  // Track playback state
  private activeTrackId: string | null = null;
  private activeTrackType: string | null = null;
  private activeStreamMode: 'A' | 'B' = 'B';
  private trackTimer: number | null = null;
  private trackBpm: number = 120;
  private trackStartTime: number = 0;
  private trackPauseTime: number = 0;

  // DSP nodes for A/B processing
  private dspInputGain: GainNode | null = null;
  private dspDryGain: GainNode | null = null;
  private dspProcessedGain: GainNode | null = null;
  private dspFilter: BiquadFilterNode | null = null;
  private dspWaveshaper: WaveShaperNode | null = null;
  private dspDelay: DelayNode | null = null;
  private dspDelayFeedback: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

      // Analyser for 8-bar real-time LED meters
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // Build real-time DSP A/B chain
      this.setupDspChain();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    return this.ctx;
  }

  private setupDspChain() {
    if (!this.ctx || !this.masterGain) return;

    this.dspInputGain = this.ctx.createGain();
    this.dspDryGain = this.ctx.createGain();
    this.dspProcessedGain = this.ctx.createGain();

    // Waveshaper for tube saturation & wavefolding
    this.dspWaveshaper = this.ctx.createWaveShaper();
    this.dspWaveshaper.curve = this.makeDistortionCurve(16) as unknown as Float32Array<ArrayBuffer>;
    this.dspWaveshaper.oversample = '4x';

    // Resonant Filter
    this.dspFilter = this.ctx.createBiquadFilter();
    this.dspFilter.type = 'lowpass';
    this.dspFilter.frequency.value = 3200;
    this.dspFilter.Q.value = 4.5;

    // Stereo-like Haas Delay
    this.dspDelay = this.ctx.createDelay();
    this.dspDelay.delayTime.value = 0.035; // 35ms slapback
    this.dspDelayFeedback = this.ctx.createGain();
    this.dspDelayFeedback.gain.value = 0.25;

    // Dry path: Input -> Dry Gain -> Master
    this.dspInputGain.connect(this.dspDryGain);
    this.dspDryGain.connect(this.masterGain);

    // Processed path: Input -> Waveshaper -> Filter -> Delay -> Processed Gain -> Master
    this.dspInputGain.connect(this.dspWaveshaper);
    this.dspWaveshaper.connect(this.dspFilter);
    this.dspFilter.connect(this.dspProcessedGain);

    this.dspFilter.connect(this.dspDelay);
    this.dspDelay.connect(this.dspDelayFeedback);
    this.dspDelayFeedback.connect(this.dspDelay);
    this.dspDelay.connect(this.dspProcessedGain);

    this.dspProcessedGain.connect(this.masterGain);

    // Initial state: Processed active (B)
    this.setAbMode('B');
  }

  private makeDistortionCurve(amount: number): Float32Array {
    const k = typeof amount === 'number' ? amount : 20;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      // Soft saturation with asymmetric wavefolding
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.02);
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.02);
    }
  }

  public setAbMode(mode: 'A' | 'B') {
    this.activeStreamMode = mode;
    if (!this.ctx || !this.dspDryGain || !this.dspProcessedGain) return;

    const t = this.ctx.currentTime;
    if (mode === 'A') {
      // Dry mode engaged (Bypass)
      this.dspDryGain.gain.setTargetAtTime(0.9, t, 0.015);
      this.dspProcessedGain.gain.setTargetAtTime(0.0, t, 0.015);
    } else {
      // Processed mode engaged (Active FX)
      this.dspDryGain.gain.setTargetAtTime(0.0, t, 0.015);
      this.dspProcessedGain.gain.setTargetAtTime(0.9, t, 0.015);
    }
  }

  // Real-time 8-Band Meter
  public getMeterLevels(): number[] {
    if (!this.analyser) {
      return [0, 0, 0, 0, 0, 0, 0, 0];
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    const bands: number[] = [];
    const step = Math.floor(dataArray.length / 8);
    for (let i = 0; i < 8; i++) {
      let sum = 0;
      const start = i * step;
      const end = start + step;
      for (let j = start; j < end; j++) {
        sum += dataArray[j];
      }
      const avg = sum / (step * 255);
      bands.push(Math.min(1, avg * 1.4));
    }
    return bands;
  }

  // Trigger tactile 3x3 Soundboard Pads
  public playPad(synthType: string) {
    const ctx = this.initContext();
    const now = ctx.currentTime;
    const dest = this.masterGain || ctx.destination;

    switch (synthType) {
      case 'chime': {
        // Shimmering digital UI chime (Dual sine E6 + B6)
        [1318.51, 1975.53].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.25 - idx * 0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(now);
          osc.stop(now + 0.45);
        });
        break;
      }

      case 'sub_drop': {
        // 808-style pitch glide
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(32, now + 0.7);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.7);
        break;
      }

      case 'impact': {
        // Heavy cinematic transient slam
        const bufferSize = ctx.sampleRate * 0.3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(60, now + 0.3);

        const kick = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kick.frequency.setValueAtTime(140, now);
        kick.frequency.exponentialRampToValueAtTime(40, now + 0.35);
        kickGain.gain.setValueAtTime(0.6, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        noise.connect(filter);
        filter.connect(dest);
        kick.connect(kickGain);
        kickGain.connect(dest);

        noise.start(now);
        kick.start(now);
        kick.stop(now + 0.35);
        break;
      }

      case 'laser': {
        // Retro-futuristic blaster
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(2200, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.22);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.22);
        break;
      }

      case 'footstep': {
        // Mechanical servo foley click & thud
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(95, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        // Click transient
        const click = ctx.createOscillator();
        const clickGain = ctx.createGain();
        click.type = 'square';
        click.frequency.setValueAtTime(1400, now);
        clickGain.gain.setValueAtTime(0.15, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(dest);
        click.connect(clickGain);
        clickGain.connect(dest);

        osc.start(now);
        click.start(now);
        osc.stop(now + 0.12);
        click.stop(now + 0.03);
        break;
      }

      case 'riser': {
        // Sweeping noise/saw riser
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.7);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(3200, now + 0.7);
        filter.Q.value = 6;
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.6);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(dest);

        osc.start(now);
        osc.stop(now + 0.75);
        break;
      }

      case 'glitch': {
        // Cybernetic glitch burst
        const count = 4;
        for (let i = 0; i < count; i++) {
          const t = now + i * 0.03;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = i % 2 === 0 ? 'square' : 'sawtooth';
          osc.frequency.setValueAtTime(300 + Math.random() * 2400, t);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.028);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(t);
          osc.stop(t + 0.03);
        }
        break;
      }

      case 'clang': {
        // Metallic inharmonic bell
        const freqs = [320, 680, 1140, 2280];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.2 / (idx + 1), now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);
          osc.connect(gain);
          gain.connect(dest);
          osc.start(now);
          osc.stop(now + 0.65);
        });
        break;
      }

      case 'beep':
      default: {
        // Clean digital HUD telemetry beep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, now);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }
    }
  }

  // Start continuous rhythmic / procedural audition for items
  public startTrackAudition(
    trackId: string,
    trackType: string,
    bpm: number = 128,
    startOffsetSec: number = 0,
    onTick?: (currentTime: number) => void
  ) {
    this.stopTrackAudition();

    const ctx = this.initContext();
    this.activeTrackId = trackId;
    this.activeTrackType = trackType;
    this.trackBpm = bpm || 128;
    this.trackStartTime = ctx.currentTime - startOffsetSec;

    const beatIntervalMs = (60 / this.trackBpm) * 500; // 8th notes
    let step = Math.floor(startOffsetSec / ((60 / this.trackBpm) * 0.5));

    const destination = trackType === 'vst_dsp' ? (this.dspInputGain || this.masterGain!) : (this.masterGain!);

    const triggerStep = () => {
      if (!this.activeTrackId || !this.ctx) return;
      const now = this.ctx.currentTime;
      const currentTrackSec = Math.max(0, now - this.trackStartTime);

      if (onTick) {
        onTick(currentTrackSec);
      }

      // Procedural audio generation based on category
      if (this.activeTrackType === 'vst_dsp') {
        // Melodic synth riff (ideal for testing Dry vs Processed DSP saturation)
        const chordRoots = [220, 261.63, 293.66, 349.23]; // A minor progression
        const chordIndex = Math.floor(step / 8) % chordRoots.length;
        const root = chordRoots[chordIndex];
        const octave = step % 4 === 0 ? 1 : step % 2 === 0 ? 1.5 : 2;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(root * octave, now);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(destination);

        osc.start(now);
        osc.stop(now + 0.22);
      } else if (this.activeTrackType === 'sound_design') {
        // Mechanical sci-fi soundscape / rhythmic foley pulses
        const isImpact = step % 8 === 0;
        const isServo = step % 4 === 2;

        if (isImpact) {
          this.playPad('impact');
        } else if (isServo) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(260 + (step % 3) * 60, now);
          osc.frequency.exponentialRampToValueAtTime(140, now + 0.15);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
          osc.connect(gain);
          gain.connect(this.masterGain || this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.15);
        }
      } else {
        // Music Production: Kick, Bass & synth arps
        const isKick = step % 4 === 0;
        const isSnare = step % 4 === 2;
        const bassFreqs = [55, 55, 65.41, 48.99]; // A1, A1, C2, G1
        const bassNote = bassFreqs[Math.floor(step / 8) % bassFreqs.length];

        if (isKick) {
          const kick = this.ctx.createOscillator();
          const kickGain = this.ctx.createGain();
          kick.frequency.setValueAtTime(130, now);
          kick.frequency.exponentialRampToValueAtTime(45, now + 0.18);
          kickGain.gain.setValueAtTime(0.45, now);
          kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
          kick.connect(kickGain);
          kickGain.connect(this.masterGain || this.ctx.destination);
          kick.start(now);
          kick.stop(now + 0.18);
        }

        if (isSnare) {
          const bufferSize = this.ctx.sampleRate * 0.12;
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.03));
          }
          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.value = 800;
          noise.connect(filter);
          filter.connect(this.masterGain || this.ctx.destination);
          noise.start(now);
        }

        // Bass synth
        if (step % 2 === 0) {
          const bass = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          bass.type = 'sawtooth';
          bass.frequency.setValueAtTime(bassNote, now);
          bassGain.gain.setValueAtTime(0.2, now);
          bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          bass.connect(bassGain);
          bassGain.connect(this.masterGain || this.ctx.destination);
          bass.start(now);
          bass.stop(now + 0.2);
        }
      }

      step++;
    };

    // Run first step immediately
    triggerStep();
    this.trackTimer = window.setInterval(triggerStep, beatIntervalMs);
  }

  public stopTrackAudition() {
    if (this.trackTimer !== null) {
      clearInterval(this.trackTimer);
      this.trackTimer = null;
    }
    this.activeTrackId = null;
    this.activeTrackType = null;
  }

  public seekTrack(newTimeSec: number) {
    if (this.ctx) {
      this.trackStartTime = this.ctx.currentTime - newTimeSec;
    }
  }
}

// Singleton audio engine instance
export const synthEngine = typeof window !== 'undefined' ? new SynthAudioEngine() : (null as unknown as SynthAudioEngine);
