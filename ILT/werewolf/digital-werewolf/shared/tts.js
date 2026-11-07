/**
 * Digital Werewolf - shared read-aloud (speechSynthesis voice selection,
 * remembered per device). Captions always stay visible regardless.
 */
(function (root) {
  'use strict';

  var VOICE_KEY = 'ww_tts_voice';
  var enabled = false;

  function store() {
    try { return root.localStorage || null; } catch (e) { return null; }
  }

  function pickVoice() {
    if (!root.speechSynthesis) return null;
    var voices = root.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;
    var ls = store();
    var remembered = ls ? ls.getItem(VOICE_KEY) : null;
    if (remembered) {
      var found = voices.find(function (v) { return v.name === remembered; });
      if (found) return found;
    }
    var preferred = ['Google UK English Female', 'Google US English', 'Samantha', 'Daniel', 'Karen', 'Moira'];
    for (var i = 0; i < preferred.length; i++) {
      var v = voices.find(function (x) { return x.name.indexOf(preferred[i]) !== -1; });
      if (v) { remember(v); return v; }
    }
    var en = voices.find(function (v) { return /^en([-_]|$)/i.test(v.lang); });
    var chosen = en || voices[0];
    remember(chosen);
    return chosen;
  }

  function remember(v) {
    var ls = store();
    if (ls && v) { try { ls.setItem(VOICE_KEY, v.name); } catch (e) {} }
  }

  root.WWTts = {
    speak: function (text) {
      if (!enabled || !root.speechSynthesis || !text) return;
      try {
        root.speechSynthesis.cancel();
        var u = new root.SpeechSynthesisUtterance(String(text));
        var v = pickVoice();
        if (v) u.voice = v;
        u.rate = 0.92;
        u.pitch = 0.95;
        root.speechSynthesis.speak(u);
      } catch (e) {}
    },
    cancel: function () {
      try { if (root.speechSynthesis) root.speechSynthesis.cancel(); } catch (e) {}
    },
    setEnabled: function (v) { enabled = Boolean(v); if (!enabled) root.WWTts.cancel(); },
    isEnabled: function () { return enabled; },
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
