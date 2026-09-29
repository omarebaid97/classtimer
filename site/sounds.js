// ============================================================================
// SOUND — synthesized Mario-style chiptune cues via the Web Audio API.
// No audio files, no network requests. Reads SOUND_VOLUME and
// SOUND_ON_BY_DEFAULT from config.js. Everything here is wrapped so a
// failure (e.g. no AudioContext support) degrades to silence and never
// throws — the timer's rendering must keep working no matter what.
// ============================================================================

const Sound = (() => {
  const STORAGE_KEY = "classtimerSound";

  let ctx = null;
  let masterGain = null;
  let on = true;

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "1") on = true;
    else if (saved === "0") on = false;
    else on = typeof SOUND_ON_BY_DEFAULT === "boolean" ? SOUND_ON_BY_DEFAULT : true;
  } catch (e) {
    on = typeof SOUND_ON_BY_DEFAULT === "boolean" ? SOUND_ON_BY_DEFAULT : true;
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, on ? "1" : "0");
    } catch (e) {
      // localStorage unavailable (private mode, etc) — just don't persist.
    }
  }

  function ensureContext() {
    if (ctx) return ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      masterGain = ctx.createGain();
      const vol = typeof SOUND_VOLUME === "number" ? SOUND_VOLUME : 0.25;
      masterGain.gain.value = vol;
      masterGain.connect(ctx.destination);
    } catch (e) {
      ctx = null;
      masterGain = null;
    }
    return ctx;
  }

  // Plays one short tone. { freq, slideTo, type, delay, dur, gain }
  //   freq    - starting frequency in Hz
  //   slideTo - optional ending frequency; if set, glides freq -> slideTo
  //   type    - oscillator waveform ("square" | "triangle" | ...)
  //   delay   - seconds from now before this note starts
  //   dur     - seconds this note lasts
  //   gain    - peak volume for this note (0-1), relative to master volume
  function blip({ freq, slideTo, type = "square", delay = 0, dur = 0.08, gain = 0.9 }) {
    if (!ctx || !masterGain) return;
    try {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;

      const t0 = ctx.currentTime + delay;
      const t1 = t0 + dur;

      osc.frequency.setValueAtTime(freq, t0);
      if (slideTo) {
        osc.frequency.exponentialRampToValueAtTime(slideTo, t1);
      }

      // Short attack/decay envelope. Never ramp exponentially to exactly 0
      // (Web Audio throws) — ramp to a tiny near-zero value instead.
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain, t0 + Math.min(0.015, dur / 4));
      g.gain.exponentialRampToValueAtTime(0.0001, t1);

      osc.connect(g);
      g.connect(masterGain);

      osc.start(t0);
      osc.stop(t1 + 0.02);
    } catch (e) {
      // Swallow — a single bad note should never break the page.
    }
  }

  // ---- cues ----------------------------------------------------------

  function cueCoin() {
    blip({ freq: 987.77, type: "square", delay: 0, dur: 0.07, gain: 0.8 });
    blip({ freq: 1318.51, type: "square", delay: 0.07, dur: 0.4, gain: 0.8 });
  }

  // Rises in pitch as secondsLeft counts down to 1 (10s ~440Hz -> 1s ~880Hz).
  function cueTick(secondsLeft) {
    const s = typeof secondsLeft === "number" && secondsLeft > 0 ? secondsLeft : 10;
    const clamped = Math.min(10, Math.max(1, s));
    const freq = 440 + (880 - 440) * ((10 - clamped) / 9);
    blip({ freq, type: "square", delay: 0, dur: 0.06, gain: 0.6 });
  }

  function cueStart() {
    const notes = [659.25, 783.99, 1318.51, 1046.5]; // E5 G5 E6 C6
    notes.forEach((freq, i) => {
      blip({ freq, type: "square", delay: i * 0.09, dur: 0.09, gain: 0.85 });
    });
  }

  function cueFanfare() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093.0]; // C5..C7
    notes.forEach((freq, i) => {
      blip({ freq, type: "square", delay: i * 0.08, dur: 0.08, gain: 0.85 });
    });
    // Sustained bass note under the run.
    blip({ freq: 130.81, type: "triangle", delay: 0, dur: notes.length * 0.08 + 0.2, gain: 0.5 });
  }

  function play(name, opts) {
    if (!on || !isArmed()) return;
    try {
      switch (name) {
        case "coin":
          cueCoin();
          break;
        case "tick":
          cueTick(opts && opts.secondsLeft);
          break;
        case "start":
          cueStart();
          break;
        case "fanfare":
          cueFanfare();
          break;
        default:
          break;
      }
    } catch (e) {
      // Never let a sound cue throw into the caller.
    }
  }

  function isOn() {
    return on;
  }

  function isArmed() {
    return !!(ctx && ctx.state === "running");
  }

  function toggle() {
    on = !on;
    persist();
    return on;
  }

  // Must be called from inside a real user gesture (click/keydown/pointerdown)
  // for ctx.resume() to succeed — that's a browser security requirement.
  function arm() {
    try {
      const c = ensureContext();
      if (!c) return;
      if (c.state !== "running") {
        c.resume().catch(() => {});
      }
    } catch (e) {
      // Ignore — isArmed() will just keep reporting false.
    }
  }

  return { play, isOn, isArmed, toggle, arm };
})();
