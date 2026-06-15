class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = false;

  public init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) this.init();
    return this.enabled;
  }

  public playTick() {
    const ctx = this.ctx;
    if (!this.enabled || !ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch(e) {}
  }

  public playTada() {
    const ctx = this.ctx;
    if (!this.enabled || !ctx) return;
    try {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        const delay = i * 0.05;
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 1.5);
      });
    } catch(e) {}
  }

  public playBingo() {
    const ctx = this.ctx;
    if (!this.enabled || !ctx) return;
    try {
      const notes = [
        { freq: 523.25, time: 0, dur: 0.2 },
        { freq: 523.25, time: 0.2, dur: 0.2 },
        { freq: 523.25, time: 0.4, dur: 0.2 },
        { freq: 1046.50, time: 0.6, dur: 1.0 },
        { freq: 783.99, time: 0.8, dur: 0.8 },
        { freq: 1046.50, time: 1.6, dur: 1.5 }
      ];
      notes.forEach(note => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = note.freq;
        gain.gain.setValueAtTime(0.1, ctx.currentTime + note.time);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + note.time + note.dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + note.time);
        osc.stop(ctx.currentTime + note.time + note.dur);
      });
    } catch(e) {}
  }
}

export const sounds = new SoundManager();
