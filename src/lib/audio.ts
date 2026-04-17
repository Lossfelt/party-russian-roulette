class AudioEngine {
  private ctx: AudioContext | null = null;
  enabled = true;

  private getCtx(): AudioContext | null {
    if (!this.enabled) return null;
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  setEnabled(v: boolean) {
    this.enabled = v;
  }

  unlock() {
    this.getCtx();
  }

  private noiseClick(ctx: AudioContext, when: number, volume = 0.3, highpass = 1500) {
    const bufferSize = Math.floor(ctx.sampleRate * 0.025);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.12));
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = highpass;
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(when);
  }

  playSpin(durationMs = 900) {
    const ctx = this.getCtx();
    if (!ctx) return;
    const duration = durationMs / 1000;
    const clicks = 10;
    for (let i = 0; i < clicks; i++) {
      const progress = i / clicks;
      const t = ctx.currentTime + progress * duration * 0.9;
      const vol = 0.35 * (1 - progress * 0.5);
      this.noiseClick(ctx, t, vol, 1800 - progress * 800);
    }
  }

  playClick() {
    const ctx = this.getCtx();
    if (!ctx) return;
    this.noiseClick(ctx, ctx.currentTime, 0.5, 2000);
  }

  playBang() {
    const ctx = this.getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    const bufferSize = Math.floor(ctx.sampleRate * 0.5);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize;
      data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 6);
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3500, now);
    filter.frequency.exponentialRampToValueAtTime(120, now + 0.35);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.9, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(now);

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.2);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.6, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(oscGain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playWin() {
    const ctx = this.getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const gain = ctx.createGain();
      const start = now + i * 0.09;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.55);
    });
  }

  playTick() {
    const ctx = this.getCtx();
    if (!ctx) return;
    this.noiseClick(ctx, ctx.currentTime, 0.2, 3000);
  }
}

export const audio = new AudioEngine();
