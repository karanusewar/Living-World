// Procedural Web Audio API soundscape generator
// Completely standalone, zero external assets required

class WorldAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private isRunning: boolean = false;

  // Audio nodes
  private masterGain: GainNode | null = null;
  private waterGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private cricketGain: GainNode | null = null;
  private birdTimer: number | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupWaterStream();
      this.setupWindAmbience();
      this.setupCrickets();
      this.startBirds();
    } catch {
      // AudioContext unavailable or blocked
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (!this.ctx) {
      if (!muted) {
        this.init();
      } else {
        return;
      }
    }

    if (this.ctx && this.ctx.state === 'suspended' && !muted) {
      this.ctx.resume();
    }

    if (this.masterGain && this.ctx) {
      const target = muted ? 0.0001 : 0.45;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.4);
    }
    this.isRunning = !muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public updateTimeOfDay(timeOfDay: string) {
    if (!this.ctx || !this.cricketGain || !this.waterGain) return;
    const isNight = timeOfDay === 'night' || timeOfDay === 'golden_hour';
    const cricketTarget = isNight ? 0.25 : 0.0;
    this.cricketGain.gain.setTargetAtTime(cricketTarget, this.ctx.currentTime, 1.0);
  }

  private setupWaterStream() {
    if (!this.ctx || !this.masterGain) return;

    // Buffer for brownian/pink noise
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Low pass filter to mimic river water
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

    this.waterGain = this.ctx.createGain();
    this.waterGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.waterGain);
    this.waterGain.connect(this.masterGain);
    whiteNoise.start();
  }

  private setupWindAmbience() {
    if (!this.ctx || !this.masterGain) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(280, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    // Subtle gentle modulation LFO
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(80, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.windGain);
    this.windGain.connect(this.masterGain);
    noise.start();
  }

  private setupCrickets() {
    if (!this.ctx || !this.masterGain) return;

    // Oscillator high pitch with tremolo
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(4600, this.ctx.currentTime);

    const tremolo = this.ctx.createOscillator();
    tremolo.type = 'square';
    tremolo.frequency.setValueAtTime(14, this.ctx.currentTime);

    const tremoloGain = this.ctx.createGain();
    tremoloGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    tremolo.connect(tremoloGain);

    this.cricketGain = this.ctx.createGain();
    this.cricketGain.gain.setValueAtTime(0, this.ctx.currentTime);

    osc.connect(this.cricketGain);
    this.cricketGain.connect(this.masterGain);

    osc.start();
    tremolo.start();
  }

  private startBirds() {
    const scheduleNextBird = () => {
      const delay = 3500 + Math.random() * 5000;
      this.birdTimer = window.setTimeout(() => {
        if (!this.isMuted && this.ctx && this.masterGain) {
          this.playBirdChirp();
        }
        scheduleNextBird();
      }, delay);
    };
    scheduleNextBird();
  }

  private playBirdChirp() {
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const chirpGain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 2400 + Math.random() * 800;

    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 700, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 200, now + 0.16);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 900, now + 0.22);

    chirpGain.gain.setValueAtTime(0, now);
    chirpGain.gain.linearRampToValueAtTime(0.06, now + 0.04);
    chirpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(chirpGain);
    chirpGain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  public playSelectSound() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // Ignore
    }
  }

  public playChime() {
    if (!this.ctx || this.isMuted) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
      const now = this.ctx.currentTime;
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteOsc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();
        const startTime = now + idx * 0.08;

        noteOsc.type = 'triangle';
        noteOsc.frequency.setValueAtTime(freq, startTime);

        noteGain.gain.setValueAtTime(0, startTime);
        noteGain.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

        noteOsc.connect(noteGain);
        noteGain.connect(this.ctx.destination);

        noteOsc.start(startTime);
        noteOsc.stop(startTime + 0.65);
      });
    } catch {
      // Ignore
    }
  }

  public cleanup() {
    if (this.birdTimer) clearTimeout(this.birdTimer);
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

export const audioManager = new WorldAudioEngine();
