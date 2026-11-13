/**
 * Digital Werewolf - shared read-aloud.
 * Supports Xiaomi MiMo TTS (api.xiaomimimo.com) with a Vincent Price style
 * "Voice of God" prompt (key stored locally in browser localStorage only),
 * and falls back cleanly to browser speechSynthesis when no key is set.
 * Captions always stay visible regardless.
 */
(function (root) {
  'use strict';

  var VOICE_KEY = 'ww_tts_voice';
  var ENABLED_KEY = 'ww_tts_enabled';
  var MIMO_KEY_STORAGE = 'ww_xiaomi_tts_key';
  var MIMO_MODEL_STORAGE = 'ww_xiaomi_tts_model';
  var MIMO_VOICE_STORAGE = 'ww_xiaomi_tts_voice';
  var MIMO_STYLE_STORAGE = 'ww_xiaomi_tts_style';
  var MIMO_ENDPOINT = 'https://api.xiaomimimo.com/v1/chat/completions';

  var DEFAULT_MODEL = 'mimo-v2.5-tts';
  var DEFAULT_VOICE = 'mimo_default';
  var DEFAULT_STYLE = 'Speak in the theatrical, sinister, velvety baritone of a classic 1960s Vincent Price horror narrator: deliberate, resonant, ominous, with dramatic pauses and a chilling, cultured cadence.';

  var audioCache = {};
  var currentAudio = null;
  var speakSeq = 0;

  function store() {
    try { return root.localStorage || null; } catch (e) { return null; }
  }
  function lsGet(k, d) {
    var ls = store();
    if (!ls) return d;
    var v = ls.getItem(k);
    return (v !== null && v !== '') ? v : d;
  }
  function lsSet(k, v) {
    var ls = store();
    if (!ls) return;
    try {
      if (v === null || v === undefined || v === '') ls.removeItem(k);
      else ls.setItem(k, String(v));
    } catch (e) {}
  }

  var enabled = lsGet(ENABLED_KEY, '') === '1' || Boolean(lsGet(MIMO_KEY_STORAGE, ''));

  function getConfig() {
    return {
      apiKey: lsGet(MIMO_KEY_STORAGE, ''),
      model: lsGet(MIMO_MODEL_STORAGE, DEFAULT_MODEL),
      voice: lsGet(MIMO_VOICE_STORAGE, DEFAULT_VOICE),
      style: lsGet(MIMO_STYLE_STORAGE, DEFAULT_STYLE)
    };
  }

  function setConfig(cfg) {
    if (!cfg) return;
    if (cfg.apiKey !== undefined) lsSet(MIMO_KEY_STORAGE, String(cfg.apiKey).trim());
    if (cfg.model !== undefined) lsSet(MIMO_MODEL_STORAGE, String(cfg.model).trim() || DEFAULT_MODEL);
    if (cfg.voice !== undefined) lsSet(MIMO_VOICE_STORAGE, String(cfg.voice).trim() || DEFAULT_VOICE);
    if (cfg.style !== undefined) lsSet(MIMO_STYLE_STORAGE, String(cfg.style).trim() || DEFAULT_STYLE);
    if (cfg.apiKey && String(cfg.apiKey).trim()) {
      enabled = true;
      lsSet(ENABLED_KEY, '1');
    }
  }

  function stopAudio() {
    if (currentAudio) {
      try { currentAudio.pause(); currentAudio.currentTime = 0; } catch (e) {}
      currentAudio = null;
    }
    try { if (root.speechSynthesis) root.speechSynthesis.cancel(); } catch (e) {}
  }

  function pickVoice() {
    if (!root.speechSynthesis) return null;
    var voices = root.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;
    var remembered = lsGet(VOICE_KEY, null);
    if (remembered) {
      var found = voices.find(function (v) { return v.name === remembered; });
      if (found) return found;
    }
    var preferred = ['Google UK English Male', 'Daniel', 'Google UK English Female', 'Google US English', 'Samantha', 'Karen', 'Moira'];
    for (var i = 0; i < preferred.length; i++) {
      var v = voices.find(function (x) { return x.name.indexOf(preferred[i]) !== -1; });
      if (v) { lsSet(VOICE_KEY, v.name); return v; }
    }
    var en = voices.find(function (v) { return /^en([-_]|$)/i.test(v.lang); });
    var chosen = en || voices[0];
    if (chosen) lsSet(VOICE_KEY, chosen.name);
    return chosen;
  }

  function speakBrowser(text) {
    if (!root.speechSynthesis || !text) return;
    try {
      root.speechSynthesis.cancel();
      var u = new root.SpeechSynthesisUtterance(String(text));
      var v = pickVoice();
      if (v) u.voice = v;
      u.rate = 0.86;
      u.pitch = 0.78;
      root.speechSynthesis.speak(u);
    } catch (e) {}
  }

  function base64ToBlobUrl(b64, mime) {
    var bin = root.atob(b64);
    var len = bin.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
    var blob = new Blob([bytes], { type: mime || 'audio/mpeg' });
    return root.URL.createObjectURL(blob);
  }

  function playUrl(url) {
    stopAudio();
    var a = new root.Audio(url);
    currentAudio = a;
    a.play().catch(function () {});
    return a;
  }

  function fetchXiaomiTts(text, cfg) {
    var cacheKey = [cfg.model, cfg.voice, cfg.style, text].join('|');
    if (audioCache[cacheKey]) {
      return Promise.resolve(audioCache[cacheKey]);
    }
    var body = {
      model: cfg.model || DEFAULT_MODEL,
      messages: [
        { role: 'user', content: cfg.style || DEFAULT_STYLE },
        { role: 'assistant', content: String(text) }
      ],
      audio: {
        format: 'mp3',
        voice: cfg.voice || DEFAULT_VOICE
      },
      stream: false
    };
    return root.fetch(MIMO_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cfg.apiKey
      },
      body: JSON.stringify(body)
    }).then(function (resp) {
      if (!resp.ok) {
        return resp.text().then(function (t) {
          throw new Error('MiMo TTS HTTP ' + resp.status + ': ' + (t || '').slice(0, 140));
        });
      }
      return resp.json();
    }).then(function (data) {
      var msg = data && data.choices && data.choices[0] && data.choices[0].message;
      var audio = msg && msg.audio;
      if (!audio || !audio.data) throw new Error('No audio.data returned from MiMo TTS');
      var fmt = (audio.format || 'mp3').toLowerCase();
      var mime = fmt === 'wav' ? 'audio/wav' : 'audio/mpeg';
      var url = base64ToBlobUrl(audio.data, mime);
      audioCache[cacheKey] = url;
      return url;
    });
  }

  function speakText(text, force) {
    if ((!enabled && !force) || !text) return Promise.resolve();
    var seq = ++speakSeq;
    stopAudio();
    var cfg = getConfig();
    if (cfg.apiKey && root.fetch) {
      return fetchXiaomiTts(String(text), cfg).then(function (url) {
        if (seq !== speakSeq) return;
        playUrl(url);
      }).catch(function (err) {
        if (seq !== speakSeq) return;
        if (root.console && root.console.warn) root.console.warn('MiMo TTS fallback:', err);
        speakBrowser(text);
        if (force) throw err;
      });
    }
    speakBrowser(text);
    return Promise.resolve();
  }

  root.WWTts = {
    speak: function (text) { return speakText(text, false); },
    testVoice: function (text) {
      return speakText(text || 'Night falls over Moonhollow Harbour. Lock your doors, and pray the pack passes you by.', true);
    },
    cancel: function () { speakSeq++; stopAudio(); },
    setEnabled: function (v) {
      enabled = Boolean(v);
      lsSet(ENABLED_KEY, enabled ? '1' : '0');
      if (!enabled) root.WWTts.cancel();
    },
    isEnabled: function () { return enabled; },
    hasXiaomiKey: function () { return Boolean(getConfig().apiKey); },
    getConfig: getConfig,
    setConfig: setConfig,
    DEFAULT_STYLE: DEFAULT_STYLE,
    DEFAULT_MODEL: DEFAULT_MODEL,
    DEFAULT_VOICE: DEFAULT_VOICE,
    refreshVoices: function () {
      if (root.speechSynthesis) {
        try { root.speechSynthesis.getVoices(); } catch (e) {}
      }
    }
  };
  if (root.speechSynthesis && root.speechSynthesis.onvoiceschanged !== undefined) {
    try { root.speechSynthesis.onvoiceschanged = function () { pickVoice(); }; } catch (e) {}
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
