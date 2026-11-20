// geo_data.js - Unified bank loader, country metadata index, distractor builder,
// round generator, and progression tiers for CIT9 World Atlas Arena.
(function () {
  'use strict';

  var TIER_PTS = { easy: 100, medium: 200, hard: 300 };
  var TIER_TIME = { easy: 18, medium: 20, hard: 22 };

  var NAME_ALIASES = {
    'usa': 'US',
    'united states': 'US',
    'united states of america': 'US',
    'uk': 'GB',
    'united kingdom': 'GB',
    'great britain': 'GB',
    'england': 'GB',
    'czech republic': 'CZ',
    'czechia': 'CZ',
    'ivory coast': 'CI',
    'cote d\'ivoire': 'CI',
    'cote divoire': 'CI',
    'uae': 'AE',
    'united arab emirates': 'AE',
    'vatican': 'VA',
    'vatican city': 'VA',
    'russia': 'RU',
    'south korea': 'KR',
    'north korea': 'KP',
    'laos': 'LA',
    'vietnam': 'VN',
    'bolivia': 'BO',
    'venezuela': 'VE',
    'tanzania': 'TZ',
    'iran': 'IR',
    'syria': 'SY',
    'moldova': 'MD',
    'eswatini': 'SZ',
    'brunei': 'BN',
    'bahamas': 'BS',
    'bhutan': 'BT',
    'costa rica': 'CR',
    'greenland': 'GL',
    'liberia': 'LR',
    'nicaragua': 'NI',
    'panama': 'PA',
    'puerto rico': 'PR',
    'palau': 'PW',
    'paraguay': 'PY',
    'senegal': 'SN',
    'uzbekistan': 'UZ'
  };

  // Microstates or tiny island territories that need a click-target halo marker
  // if ever shown in click mode, and should not be auto-upgraded into combo-map clicks.
  var TINY_ISOS = {
    VA: true, MC: true, SM: true, LI: true, MT: true, AD: true, SG: true,
    BH: true, QA: true, LU: true, KM: true, MU: true, SC: true, BB: true, TT: true
  };

  var RANKS = [
    {
      id: 'scout',
      level: 1,
      title: 'Traveller',
      subtitle: 'Tier 1',
      minXp: 0,
      accent: '#cd7f32'
    },
    {
      id: 'navigator',
      level: 2,
      title: 'Navigator',
      subtitle: 'Tier 2',
      minXp: 2000,
      accent: '#94a3b8'
    },
    {
      id: 'cartographer',
      level: 3,
      title: 'Cartographer',
      subtitle: 'Tier 3',
      minXp: 5000,
      accent: '#f59e0b'
    },
    {
      id: 'legend',
      level: 4,
      title: 'World Fellow',
      subtitle: 'Tier 4',
      minXp: 10000,
      accent: '#22c55e'
    }
  ];

  var countriesByIso = {};
  var isoByName = {};
  var continentGroups = {};
  var provincesByIso = {};
  var provIsoByName = {};
  var provinceList = [];

  function computeCentroid(geom) {
    if (!geom || !geom.coordinates) return [0, 0];
    var sumX = 0, sumY = 0, count = 0;
    function walk(coords) {
      if (!coords || !coords.length) return;
      if (typeof coords[0] === 'number') {
        sumX += coords[0];
        sumY += coords[1];
        count++;
      } else {
        for (var i = 0; i < coords.length; i++) walk(coords[i]);
      }
    }
    walk(geom.coordinates);
    return count ? [sumY / count, sumX / count] : [0, 0];
  }

  function initCountryIndex() {
    var gj = window.WORLD_GEOJSON;
    if (!gj || !Array.isArray(gj.features)) return;

    for (var i = 0; i < gj.features.length; i++) {
      var f = gj.features[i];
      var p = f.properties || {};
      var iso = String(p.iso || '').toUpperCase();
      if (!iso || iso === '-99') continue;

      var center = computeCentroid(f.geometry);
      var entry = {
        iso: iso,
        name: p.name || iso,
        continent: p.continent || 'World',
        subregion: p.subregion || p.continent || 'World',
        pop: Number(p.pop) || 0,
        center: center,
        feature: f,
        flagUrl: 'assets/flags/' + iso.toLowerCase() + '.svg',
        isTiny: !!TINY_ISOS[iso]
      };
      countriesByIso[iso] = entry;
      isoByName[entry.name.toLowerCase()] = iso;

      var cont = entry.continent;
      if (!continentGroups[cont]) continentGroups[cont] = [];
      continentGroups[cont].push(entry);
    }

    var aliasKeys = Object.keys(NAME_ALIASES);
    for (var k = 0; k < aliasKeys.length; k++) {
      var key = aliasKeys[k];
      var targetIso = NAME_ALIASES[key];
      if (countriesByIso[targetIso]) {
        isoByName[key] = targetIso;
      }
    }

    var cgj = window.CANADA_GEOJSON;
    if (cgj && Array.isArray(cgj.features)) {
      for (var pIdx = 0; pIdx < cgj.features.length; pIdx++) {
        var pf = cgj.features[pIdx];
        var pp = pf.properties || {};
        var pIso = String(pp.iso || '').toUpperCase();
        if (!pIso) continue;
        var pEntry = {
          iso: pIso,
          name: pp.name || pIso,
          continent: 'Canada',
          subregion: pp.subregion || 'Province',
          capital: pp.capital || '',
          pop: Number(pp.pop) || 0,
          prov: true,
          center: computeCentroid(pf.geometry),
          feature: pf,
          flagUrl: 'assets/flags/' + pIso.toLowerCase() + '.svg',
          isTiny: false
        };
        provincesByIso[pIso] = pEntry;
        provIsoByName[pEntry.name.toLowerCase()] = pIso;
        provinceList.push(pEntry);
      }
      provIsoByName['newfoundland'] = 'CA-NL';
      provIsoByName['the northwest territories'] = 'CA-NT';
      provIsoByName['yukon territory'] = 'CA-YT';
    }
  }

  function resolveProvinceIso(isoOrName) {
    if (!isoOrName) return '';
    var raw = String(isoOrName).trim();
    var upper = raw.toUpperCase();
    if (provincesByIso[upper]) return upper;
    var lower = raw.toLowerCase();
    return provIsoByName[lower] || '';
  }

  function getProvince(isoOrName) {
    var iso = resolveProvinceIso(isoOrName);
    return (iso && provincesByIso[iso]) ? provincesByIso[iso] : null;
  }

  function getPlace(isoOrName) {
    return getCountry(isoOrName) || getProvince(isoOrName);
  }

  function resolveIso(isoOrName) {
    if (!isoOrName) return '';
    var raw = String(isoOrName).trim();
    var upper = raw.toUpperCase();
    if (raw.length === 2 && countriesByIso[upper]) return upper;
    var lower = raw.toLowerCase();
    if (isoByName[lower]) return isoByName[lower];
    if (NAME_ALIASES[lower]) return NAME_ALIASES[lower];
    return '';
  }

  function getCountry(isoOrName) {
    var iso = resolveIso(isoOrName);
    if (iso && countriesByIso[iso]) return countriesByIso[iso];
    if (iso) {
      return {
        iso: iso,
        name: String(isoOrName),
        continent: 'World',
        subregion: 'World',
        pop: 0,
        center: [20, 0],
        feature: null,
        flagUrl: 'assets/flags/' + iso.toLowerCase() + '.svg',
        isTiny: !!TINY_ISOS[iso]
      };
    }
    return null;
  }

  function formatPop(pop) {
    var n = Number(pop) || 0;
    if (!n) return 'N/A';
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
    if (n >= 1e3) return Math.round(n / 1e3) + 'K';
    return String(n);
  }

  function shuffle(arr) {
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  // Build 4 plausible country (or province/territory) options sorted by proximity + randomized
  function buildHighlightOptions(iso, displayAnswerName) {
    var provTarget = provincesByIso[iso];
    if (provTarget) {
      var peers = provinceList.filter(function (p) {
        return p.iso !== iso && p.name !== displayAnswerName;
      });
      peers.sort(function (a, b) {
        var da = Math.hypot(a.center[0] - provTarget.center[0], a.center[1] - provTarget.center[1]);
        var db = Math.hypot(b.center[0] - provTarget.center[0], b.center[1] - provTarget.center[1]);
        return da - db;
      });
      var nearProvs = peers.slice(0, Math.min(6, peers.length));
      var pickedProvs = shuffle(nearProvs).slice(0, 3).map(function (p) { return p.name; });
      pickedProvs.push(displayAnswerName);
      return shuffle(pickedProvs);
    }

    var target = countriesByIso[iso];
    if (!target) return shuffle([displayAnswerName, 'France', 'Brazil', 'Japan']);

    var sameCont = (continentGroups[target.continent] || []).filter(function (c) {
      return c.iso !== iso && c.pop >= 350000 && c.name !== displayAnswerName;
    });

    // Sort by rough angular distance so neighbours and regional peers are prioritized
    sameCont.sort(function (a, b) {
      var da = Math.hypot(a.center[0] - target.center[0], a.center[1] - target.center[1]);
      var db = Math.hypot(b.center[0] - target.center[0], b.center[1] - target.center[1]);
      return da - db;
    });

    var nearPool = sameCont.slice(0, Math.min(9, sameCont.length));
    var picked = shuffle(nearPool).slice(0, 3).map(function (c) { return c.name; });

    if (picked.length < 3) {
      var fallback = ['Canada', 'Brazil', 'France', 'Egypt', 'Japan', 'Australia'];
      for (var i = 0; i < fallback.length && picked.length < 3; i++) {
        if (fallback[i] !== displayAnswerName && picked.indexOf(fallback[i]) === -1) {
          picked.push(fallback[i]);
        }
      }
    }

    picked.push(displayAnswerName);
    return shuffle(picked);
  }

  var masterPool = [];

  function buildMasterPool() {
    masterPool = [];
    var tiers = ['easy', 'medium', 'hard'];

    // 1. Maps (80 world + 13 Canada provinces/territories)
    var mapsSrc = window.GEO_MAPS || {};
    tiers.forEach(function (diff) {
      var list = mapsSrc[diff] || [];
      list.forEach(function (item) {
        var isProv = !!item.prov;
        var c = isProv ? getProvince(item.iso || item.name) : getCountry(item.iso || item.name);
        masterPool.push({
          id: item.id,
          type: 'map',
          topic: item.topic === 'canada' ? 'canada' : 'map',
          diff: diff,
          pts: TIER_PTS[diff],
          timeLimit: TIER_TIME[diff],
          iso: item.iso,
          name: item.name,
          prov: isProv,
          region: isProv && c ? c.subregion : '',
          capital: isProv && c ? c.capital : '',
          mode: item.mode || 'click',
          maxZoom: item.maxZoom || (diff === 'easy' ? 6 : diff === 'medium' ? 4 : 3),
          a: item.name,
          o: item.mode === 'highlight' ? buildHighlightOptions(item.iso, item.name) : null,
          continent: isProv ? 'Canada' : (c ? c.continent : 'World'),
          subregion: isProv ? (c ? c.subregion : 'Province') : (c ? c.subregion : 'World'),
          pop: c ? c.pop : 0,
          flagUrl: 'assets/flags/' + String(item.iso).toLowerCase() + '.svg'
        });
      });
    });

    // 2. Flags (80 world + 13 Canada provinces/territories)
    var flagsSrc = window.GEO_FLAGS || {};
    tiers.forEach(function (diff) {
      var list = flagsSrc[diff] || [];
      list.forEach(function (item) {
        var p = item.prov ? getProvince(item.iso || item.a) : null;
        var c = item.prov ? null : getCountry(item.iso || item.a);
        masterPool.push({
          id: item.id,
          type: 'flag',
          topic: item.topic === 'canada' ? 'canada' : 'flag',
          diff: diff,
          pts: TIER_PTS[diff],
          timeLimit: TIER_TIME[diff],
          iso: item.iso,
          name: item.name,
          prov: !!item.prov,
          region: item.region || (p ? p.subregion : ''),
          capital: p ? p.capital : '',
          a: item.a,
          o: item.o.slice(),
          continent: item.prov ? 'Canada' : (c ? c.continent : 'World'),
          subregion: item.prov ? (item.region || 'Province') : (c ? c.subregion : 'World'),
          pop: (typeof item.pop === 'number' && item.pop) ? item.pop : (p ? p.pop : (c ? c.pop : 0)),
          flagUrl: 'assets/flags/' + String(item.iso).toLowerCase() + '.svg'
        });
      });
    });

    // 3. Trivia
    var triviaSrc = window.GEO_TRIVIA || {};
    tiers.forEach(function (diff) {
      var list = triviaSrc[diff] || [];
      list.forEach(function (item) {
        var iso = resolveIso(item.a);
        var c = iso ? getCountry(iso) : null;
        var p = (!c && item.topic === 'canada') ? getProvince(item.a) : null;
        var resolvedIso = iso || (p ? p.iso : '');
        masterPool.push({
          id: item.id,
          type: 'trivia',
          topic: item.topic === 'culture' ? 'culture' : (item.topic === 'canada' ? 'canada' : 'facts'),
          diff: diff,
          pts: TIER_PTS[diff],
          timeLimit: TIER_TIME[diff],
          iso: resolvedIso,
          name: c ? c.name : (p ? p.name : item.a),
          prov: !!p,
          region: p ? p.subregion : '',
          capital: p ? p.capital : '',
          q: item.q,
          a: item.a,
          o: item.o.slice(),
          continent: c ? c.continent : (p ? 'Canada' : 'World'),
          subregion: c ? c.subregion : (p ? p.subregion : 'World'),
          pop: c ? c.pop : (p ? p.pop : 0),
          flagUrl: resolvedIso ? ('assets/flags/' + resolvedIso.toLowerCase() + '.svg') : ''
        });
      });
    });

    // 4. World Landmarks (22 GeoGuessr-style borderless map pinpoints)
    var landmarksSrc = window.GEO_LANDMARKS || [];
    var hardLandmarks = { lm02: true, lm03: true, lm06: true, lm12: true, lm17: true, lm19: true, lm20: true, lm21: true, lm22: true };
    landmarksSrc.forEach(function (lm) {
      var c = getCountry(lm.iso);
      var diff = hardLandmarks[lm.id] ? 'hard' : 'medium';
      masterPool.push({
        id: lm.id,
        type: 'landmark',
        topic: 'facts',
        diff: diff,
        pts: 500,
        timeLimit: 25,
        iso: lm.iso,
        name: lm.name,
        city: lm.city,
        lat: lm.lat,
        lng: lm.lng,
        img: lm.img,
        hint: lm.hint || '',
        clue: lm.clue || '',
        a: lm.name,
        q: lm.name,
        continent: c ? c.continent : 'World',
        subregion: c ? c.subregion : 'World',
        pop: c ? c.pop : 0,
        flagUrl: c ? c.flagUrl : ('assets/flags/' + String(lm.iso).toLowerCase() + '.svg')
      });
    });
  }

  function cloneForRound(item, allowCombo, comboBudgetRef, rng) {
    if (item.type === 'landmark') {
      return {
        id: item.id,
        type: 'landmark',
        renderMode: 'landmark-pin',
        diff: item.diff,
        pts: item.pts,
        timeLimit: item.timeLimit,
        iso: item.iso,
        name: item.name,
        city: item.city,
        lat: item.lat,
        lng: item.lng,
        img: item.img,
        hint: item.hint || '',
        clue: item.clue || '',
        a: item.a,
        q: item.q,
        continent: item.continent,
        subregion: item.subregion,
        pop: item.pop,
        flagUrl: item.flagUrl
      };
    }
    var q = {
      id: item.id,
      type: item.type,
      diff: item.diff,
      pts: item.pts,
      timeLimit: item.timeLimit,
      iso: item.iso,
      name: item.name,
      q: item.q || '',
      a: item.a,
      mode: item.mode || 'choice',
      renderMode: item.type,
      maxZoom: item.maxZoom || 4,
      isCombo: false,
      comboBonus: 0,
      prov: item.prov || false,
      region: item.region || '',
      capital: item.capital || '',
      continent: item.continent,
      subregion: item.subregion,
      pop: item.pop,
      flagUrl: item.flagUrl
    };

    if (item.type === 'map') {
      q.renderMode = item.mode === 'highlight' ? 'map-highlight' : 'map-click';
      if (item.mode === 'highlight') {
        q.o = buildHighlightOptions(item.iso, item.name);
      } else {
        q.o = null;
      }
      return q;
    }

    // Optional Hard-tier Combo Strike (flag-map or trivia-map) per PLAN.md
    var canCombo = allowCombo &&
      comboBudgetRef &&
      comboBudgetRef.left > 0 &&
      item.diff === 'hard' &&
      item.iso &&
      countriesByIso[item.iso] &&
      !TINY_ISOS[item.iso] &&
      countriesByIso[item.iso].pop >= 1500000;

    if (canCombo && (rng ? rng() : Math.random()) < 0.32) {
      comboBudgetRef.left--;
      q.isCombo = true;
      q.comboBonus = 50;
      q.maxZoom = 3;
      q.renderMode = item.type === 'flag' ? 'flag-map' : 'trivia-map';
      q.o = null;
      return q;
    }

    q.o = item.o ? (rng ? seededShuffle(item.o, rng) : shuffle(item.o)) : null;
    return q;
  }

  // Deterministic RNG so a whole class can play the same seeded Daily Challenge.
  function hashSeed(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function seededShuffle(arr, rng) {
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function pickFresh(candidates, needed, seenMap, pickedIds, shuf) {
    var unseen = [];
    var seen = [];
    for (var i = 0; i < candidates.length; i++) {
      var it = candidates[i];
      if (pickedIds[it.id]) continue;
      if (seenMap && seenMap[it.id]) seen.push(it);
      else unseen.push(it);
    }
    var ordered = shuf(unseen).concat(shuf(seen));
    var out = ordered.slice(0, needed);
    for (var j = 0; j < out.length; j++) pickedIds[out[j].id] = true;
    return out;
  }

  var TOPICS = {
    mixed: { id: 'mixed', label: 'Mixed (Standard)', short: 'Mixed' },
    culture: { id: 'culture', label: 'Culture & Modern Era', short: 'Culture Pass' },
    flag: { id: 'flag', label: 'World Flags', short: 'Flags Pass' },
    map: { id: 'map', label: 'Maps & Borders', short: 'Maps Pass' },
    facts: { id: 'facts', label: 'Landmarks & Facts', short: 'Facts Pass' },
    canada: { id: 'canada', label: 'Canada', short: 'Canada Pass' }
  };

  function buildRound(opts) {
    opts = opts || {};
    var topic = TOPICS[opts.topic] ? opts.topic : 'mixed';
    var seenIds = opts.seenIds || [];
    var seenMap = {};
    for (var s = 0; s < seenIds.length; s++) seenMap[seenIds[s]] = true;

    var pickedIds = {};
    var rng = opts.rng || null;
    var shuf = rng ? function (a) { return seededShuffle(a, rng); } : shuffle;

    function pickMixedBlock(diff, totalWanted) {
      var tierPool = masterPool.filter(function (x) { return x.diff === diff; });
      var maps = tierPool.filter(function (x) { return x.type === 'map'; });
      var flags = tierPool.filter(function (x) { return x.type === 'flag'; });
      var landmarks = tierPool.filter(function (x) { return x.type === 'landmark'; });
      var trivs = tierPool.filter(function (x) { return x.type === 'trivia'; });

      var block = []
        .concat(pickFresh(maps, 1, seenMap, pickedIds, shuf))
        .concat(pickFresh(flags, 1, seenMap, pickedIds, shuf));

      if (totalWanted >= 4) {
        var culture = trivs.filter(function (x) { return x.topic === 'culture'; });
        // Canada items ride along with facts so Canadian content shows up in mixed rounds too.
        var facts = trivs.filter(function (x) { return x.topic === 'facts' || x.topic === 'canada'; });
        if (landmarks.length && totalWanted === 4) {
          block = block
            .concat(pickFresh(landmarks, 1, seenMap, pickedIds, shuf))
            .concat(pickFresh(trivs, 1, seenMap, pickedIds, shuf));
        } else {
          block = block
            .concat(pickFresh(culture, 1, seenMap, pickedIds, shuf))
            .concat(pickFresh(facts, 1, seenMap, pickedIds, shuf));
        }
      } else {
        block = block.concat(pickFresh(trivs, 1, seenMap, pickedIds, shuf));
      }

      if (block.length < totalWanted) {
        block = block.concat(pickFresh(tierPool, totalWanted - block.length, seenMap, pickedIds, shuf));
      }
      return shuf(block);
    }

    function pickTierBlock(diff, totalWanted) {
      var tierPool = masterPool.filter(function (x) { return x.diff === diff; });
      if (topic !== 'mixed') {
        var focused = tierPool.filter(function (x) { return x.topic === topic; });
        return shuf(pickFresh(focused, totalWanted, seenMap, pickedIds, shuf));
      }
      return pickMixedBlock(diff, totalWanted);
    }

    // Challenge mode: ten hard items with the same type balance, no Combo upgrade.
    var chosen;
    if (opts.allHard) {
      chosen = pickMixedBlock('hard', 10);
    } else {
      // Common escalating progression: 3 Easy -> 4 Medium -> 3 Hard
      chosen = pickTierBlock('easy', 3)
        .concat(pickTierBlock('medium', 4))
        .concat(pickTierBlock('hard', 3));
    }

    var allowCombo = topic !== 'map' && !opts.allHard && !opts.noCombo;
    var comboBudget = { left: 2 };

    return chosen.map(function (item) {
      return cloneForRound(item, allowCombo, comboBudget, rng);
    });
  }

  // Same ten items for everyone on a given date, with a fixed presentation.
  function buildDailyRound(dateStr) {
    var rng = mulberry32(hashSeed('CIT9-DAILY:' + dateStr));
    return buildRound({ topic: 'mixed', rng: rng, noCombo: true });
  }

  // Endless runs draw one item per call. Difficulty follows the question
  // number: Q1-3 easy, Q4-7 medium, Q8+ hard. Repeats are allowed only when
  // the current tier is exhausted (pickFresh prefers unseen first).
  function nextEndlessItem(opts) {
    opts = opts || {};
    var count = Number(opts.count) || 0;
    var seenIds = opts.seenIds || [];
    var seenMap = {};
    for (var s = 0; s < seenIds.length; s++) seenMap[seenIds[s]] = true;
    var pickedIds = {};
    var tier = count < 3 ? 'easy' : (count < 7 ? 'medium' : 'hard');
    var tierPool = masterPool.filter(function (x) { return x.diff === tier; });
    var picked = pickFresh(tierPool, 1, seenMap, pickedIds, shuffle);
    if (!picked.length) picked = pickFresh(masterPool, 1, seenMap, pickedIds, shuffle);
    if (!picked.length) return null;
    return cloneForRound(picked[0], true, { left: 1 }, null);
  }

  function buildLandmarkRound() {
    var list = shuffle(window.GEO_LANDMARKS || []);
    return list.map(function (lm) {
      var c = getCountry(lm.iso);
      return {
        id: lm.id,
        type: 'landmark',
        renderMode: 'landmark-pin',
        diff: 'medium',
        pts: 500,
        timeLimit: 25,
        iso: lm.iso,
        name: lm.name,
        city: lm.city,
        lat: lm.lat,
        lng: lm.lng,
        img: lm.img,
        hint: lm.hint || '',
        clue: lm.clue || '',
        a: lm.name,
        q: lm.name,
        continent: c ? c.continent : 'World',
        subregion: c ? c.subregion : 'World',
        pop: c ? c.pop : 0,
        flagUrl: c ? c.flagUrl : ('assets/flags/' + lm.iso.toLowerCase() + '.svg')
      };
    });
  }

  function getRank(xp) {
    var val = Math.max(0, Number(xp) || 0);
    var current = RANKS[0];
    var next = null;
    for (var i = 0; i < RANKS.length; i++) {
      if (val >= RANKS[i].minXp) {
        current = RANKS[i];
        next = RANKS[i + 1] || null;
      }
    }
    var pct = 100;
    var intoTier = val - current.minXp;
    var span = 0;
    if (next) {
      span = next.minXp - current.minXp;
      pct = Math.max(0, Math.min(100, Math.round((intoTier / span) * 100)));
    }
    return {
      current: current,
      next: next,
      xp: val,
      pct: pct,
      xpToNext: next ? Math.max(0, next.minXp - val) : 0
    };
  }

  // Enforce strict Room 8 display rule: First name + first TWO letters of surname ("First Ls.")
  function formatDisplayName(raw) {
    if (!raw) return 'Explorer';
    var s = String(raw).trim();
    if (s.indexOf('@') !== -1) {
      s = s.split('@')[0];
    }
    s = s.replace(/[0-9_]+/g, ' ').replace(/[.\-]+/g, ' ').trim();
    if (!s) return 'Explorer';
    var parts = s.split(/\s+/).filter(Boolean);
    var cap = function (w) {
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    };
    var first = cap(parts[0]);
    if (parts.length === 1) return first;
    var last = parts[parts.length - 1].replace(/[^a-zA-Z]/g, '');
    if (!last) return first;
    var two = last.slice(0, 2);
    two = two.charAt(0).toUpperCase() + (two.charAt(1) ? two.charAt(1).toLowerCase() : '');
    return first + ' ' + two + '.';
  }

  initCountryIndex();
  buildMasterPool();

  window.GEO_ENGINE = {
    RANKS: RANKS,
    TOPICS: TOPICS,
    TIER_PTS: TIER_PTS,
    countriesByIso: countriesByIso,
    provincesByIso: provincesByIso,
    isoByName: isoByName,
    getCountry: getCountry,
    getProvince: getProvince,
    getPlace: getPlace,
    resolveIso: resolveIso,
    formatPop: formatPop,
    formatDisplayName: formatDisplayName,
    getRank: getRank,
    getAllItems: function () { return masterPool.slice(); },
    buildHighlightOptions: buildHighlightOptions,
    buildRound: buildRound,
    buildDailyRound: buildDailyRound,
    buildLandmarkRound: buildLandmarkRound,
    nextEndlessItem: nextEndlessItem,
    hashSeed: hashSeed,
    mulberry32: mulberry32
  };
})();
