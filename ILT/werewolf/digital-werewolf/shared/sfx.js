/**
 * Digital Werewolf - shared WebAudio cue synth (no external audio files).
 * Cues: night, dawn, vote, howl, heartbeat, bell, gavel, clang, sting, tick.
 */
(function (root) {
  'use strict';

  var audioCtx = null;
  var enabled = true;

  function ctx() {
    if (!enabled) return null;
    try {
      var Cls = root.AudioContext || root.webkitAudioContext;
      if (!Cls) return null;
      if (!audioCtx) audioCtx = new Cls();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    } catch (e) { return null; }
  }

  function env(g, t0, peak, decay) {
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + decay);
  }

  function tone(freqStart, freqEnd, dur, type, peak) {
    var ac = ctx(); if (!ac) return;
    var t0 = ac.currentTime;
    var o = ac.createOscillator();
    var g = ac.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freqStart, t0);
    if (freqEnd && freqEnd !== freqStart) o.frequency.exponentialRampToValueAtTime(freqEnd, t0 + dur);
    env(g, t0, peak || 0.08, dur);
    o.connect(g); g.connect(ac.destination);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }

  function noise(dur, filterFreq, peak, sweepTo) {
    var ac = ctx(); if (!ac) return;
    var t0 = ac.currentTime;
    var len = Math.max(1, Math.floor(ac.sampleRate * dur));
    var buf = ac.createBuffer(1, len, ac.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    var src = ac.createBufferSource();
    src.buffer = buf;
    var f = ac.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.setValueAtTime(filterFreq, t0);
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t0 + dur);
    f.Q.value = 1.2;
    var g = ac.createGain();
    env(g, t0, peak || 0.12, dur);
    src.connect(f); f.connect(g); g.connect(ac.destination);
    src.start(t0); src.stop(t0 + dur + 0.05);
  }

  var CUES = {
    night: function () { tone(196, 130, 1.4, 'sine', 0.07); tone(261.6, 220, 1.3, 'sine', 0.05); },
    dawn: function () { [523.25, 659.25, 783.99].forEach(function (fr, i) { setTimeout(function () { tone(fr, fr, 0.9, 'triangle', 0.09); }, i * 120); }); },
    vote: function () { tone(440, 587.33, 0.4, 'sine', 0.08); },
    howl: function () { tone(620, 980, 1.6, 'sawtooth', 0.05); noise(1.6, 900, 0.05, 1800); },
    heartbeat: function () { tone(70, 55, 0.18, 'sine', 0.22); setTimeout(function () { tone(65, 50, 0.22, 'sine', 0.18); }, 260); },
    bell: function () { tone(392, 392, 1.6, 'sine', 0.1); tone(784, 784, 1.1, 'sine', 0.05); tone(587, 587, 1.3, 'triangle', 0.05); },
    gavel: function () { noise(0.12, 1400, 0.2); tone(180, 120, 0.15, 'square', 0.08); },
    clang: function () { tone(220, 180, 0.7, 'square', 0.09); noise(0.5, 2400, 0.12, 900); },
    sting: function () { tone(311, 311, 0.5, 'sawtooth', 0.06); tone(330, 330, 0.5, 'sawtooth', 0.06); },
    tick: function () { noise(0.05, 2000, 0.1); },
    save: function () { tone(523.25, 659.25, 0.5, 'triangle', 0.09); tone(783.99, 1046.5, 0.6, 'sine', 0.07); }
  };

  root.WWSfx = {
    play: function (kind) {
      if (!enabled) return;
      try { if (CUES[kind]) CUES[kind](); } catch (e) {}
    },
    setEnabled: function (v) { enabled = Boolean(v); },
    isEnabled: function () { return enabled; }
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
