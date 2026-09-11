// Noir Audio Manager Utility using Web Audio API Synthesizer
// Synthesizes procedural noir ambient audio (rain, distant city rumble) and interactive UI SFX (typewriter clicks, paper rustle, tab transitions)

export class AudioManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private isAmbientPlaying: boolean = false;
  
  // Ambient nodes
  private rainNode: AudioBufferSourceNode | null = null;
  private cityRumbleNode: AudioBufferSourceNode | null = null;
  private cityOscNode: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized lazily upon first user interaction
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setEnabled(enabled: boolean): boolean {
    this.soundEnabled = enabled;
    if (!this.soundEnabled && this.isAmbientPlaying) {
      this.stopAmbientNoir();
    }
    return this.soundEnabled;
  }

  public toggleSound(): boolean {
    return this.setEnabled(!this.soundEnabled);
  }

  // Typewriter Mechanical Click
  public playTypewriterClick() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.025; // 25ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400 + (Math.random() * 400 - 200), now);
      filter.Q.setValueAtTime(3.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.025);
    } catch (e) {
      // Audio context suppressed
    }
  }

  // Paper Dossier Rustle
  public playPaperRustle() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = 0.14;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.4);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(350, now + duration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch (e) {
      // Audio error
    }
  }

  // Heavy Detective Footstep
  public playFootstep() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.12);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      // Audio error
    }
  }

  // Tab Transition Sound Effect
  public playTabTransition(tabName: string) {
    if (!this.soundEnabled) return;
    
    switch (tabName) {
      case 'scene':
        this.playFootstep();
        break;
      case 'interrogation':
      case 'journal':
      case 'briefing':
        this.playPaperRustle();
        break;
      case 'board':
        this.playTypewriterClick();
        break;
      default:
        this.playPaperRustle();
        break;
    }
  }

  // Clue Discovery Noir Chord Sting
  public playClueDiscovered() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Minor mystery chord (noir diminished triad)
      const freqs = [220, 261.63, 311.13, 440];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        const startTime = now + idx * 0.04;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.09, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.85);
      });
    } catch (e) {
      // Audio error
    }
  }

  public playClueDiscoveredSting() {
    this.playClueDiscovered();
  }

  // Gavel Impact (Accusation / Verdict)
  public playGavelImpact() {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(18, now + 0.28);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      // Audio error
    }
  }

  // Ambient Noir Atmosphere (Loopable Rain + Low Distant City Noise)
  public startAmbientNoir() {
    if (!this.soundEnabled || this.isAmbientPlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Master ambient gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.gain.linearRampToValueAtTime(0.05, now + 2); // Fade in over 2s
      masterGain.connect(ctx.destination);
      this.ambientGain = masterGain;

      // 1. Rain noise synthesis (pink noise filter)
      const rainBufferSize = ctx.sampleRate * 2;
      const rainBuffer = ctx.createBuffer(1, rainBufferSize, ctx.sampleRate);
      const rainOutput = rainBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < rainBufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        rainOutput[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      }

      const rainSource = ctx.createBufferSource();
      rainSource.buffer = rainBuffer;
      rainSource.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.setValueAtTime(850, now);

      rainSource.connect(rainFilter);
      rainFilter.connect(masterGain);
      rainSource.start(now);
      this.rainNode = rainSource;

      // 2. Distant City Traffic Noise / Low Frequency Rumble
      const cityOsc = ctx.createOscillator();
      const cityGain = ctx.createGain();

      cityOsc.type = 'sine';
      cityOsc.frequency.setValueAtTime(42, now); // Low 42Hz urban drone

      cityGain.gain.setValueAtTime(0.015, now);
      cityOsc.connect(cityGain);
      cityGain.connect(masterGain);
      cityOsc.start(now);
      this.cityOscNode = cityOsc;

      this.isAmbientPlaying = true;
    } catch (e) {
      this.isAmbientPlaying = false;
    }
  }

  public stopAmbientNoir() {
    if (!this.isAmbientPlaying) return;
    try {
      if (this.ambientGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
        setTimeout(() => {
          try {
            this.rainNode?.stop();
            this.cityOscNode?.stop();
          } catch (e) {}
          this.rainNode = null;
          this.cityOscNode = null;
          this.ambientGain = null;
          this.isAmbientPlaying = false;
        }, 850);
      } else {
        this.rainNode?.stop();
        this.cityOscNode?.stop();
        this.isAmbientPlaying = false;
      }
    } catch (e) {
      this.isAmbientPlaying = false;
    }
  }

  public toggleAmbientNoir(): boolean {
    if (this.isAmbientPlaying) {
      this.stopAmbientNoir();
      return false;
    } else {
      this.startAmbientNoir();
      return true;
    }
  }

  public toggleRainAtmosphere(): boolean {
    return this.toggleAmbientNoir();
  }

  public isAmbientActive(): boolean {
    return this.isAmbientPlaying;
  }

  public isRainActive(): boolean {
    return this.isAmbientActive();
  }
}

export const audioManager = new AudioManager();
