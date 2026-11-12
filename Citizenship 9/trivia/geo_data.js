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
    'eswatini': 'SZ'
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
      title: 'Bronze Scout',
      subtitle: 'Field Recruit',
      minXp: 0,
      art: 'assets/art/rank_1_scout.jpg',
      accent: '#f59e0b'
    },
    {
      id: 'navigator',
      level: 2,
      title: 'Silver Navigator',
      subtitle: 'Wayfinder Class',
      minXp: 2000,
      art: 'assets/art/rank_2_navigator.jpg',
      accent: '#38bdf8'
    },
    {
      id: 'cartographer',
      level: 3,
      title: 'Gold Cartographer',
      subtitle: 'Master Mapper',
      minXp: 5000,
      art: 'assets/art/rank_3_cartographer.jpg',
      accent: '#fbbf24'
    },
    {
      id: 'legend',
      level: 4,
      title: 'Atlas Legend',
      subtitle: 'Global Sovereign',
      minXp: 10000,
      art: 'assets/art/rank_4_legend.jpg',
      accent: '#22d3ee'
    }
  ];

  var countriesByIso = {};
  var isoByName = {};
  var continentGroups = {};

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

  // Build 4 plausible country options on the same continent sorted by proximity + randomized
  function buildHighlightOptions(iso, displayAnswerName) {
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

    // 1. Maps (60)
    var mapsSrc = window.GEO_MAPS || {};
    tiers.forEach(function (diff) {
      var list = mapsSrc[diff] || [];
      list.forEach(function (item) {
        var c = getCountry(item.iso || item.name);
        masterPool.push({
          id: item.id,
          type: 'map',
          diff: diff,
          pts: TIER_PTS[diff],
          timeLimit: TIER_TIME[diff],
          iso: item.iso,
          name: item.name,
          mode: item.mode || 'click',
          maxZoom: item.maxZoom || (diff === 'easy' ? 6 : diff === 'medium' ? 4 : 3),
          a: item.name,
          o: item.mode === 'highlight' ? buildHighlightOptions(item.iso, item.name) : null,
          continent: c ? c.continent : 'World',
          subregion: c ? c.subregion : 'World',
          pop: c ? c.pop : 0,
          flagUrl: 'assets/flags/' + String(item.iso).toLowerCase() + '.svg'
        });
      });
    });

    // 2. Flags (60)
    var flagsSrc = window.GEO_FLAGS || {};
    tiers.forEach(function (diff) {
      var list = flagsSrc[diff] || [];
      list.forEach(function (item) {
        var c = getCountry(item.iso || item.a);
        masterPool.push({
          id: item.id,
          type: 'flag',
          diff: diff,
          pts: TIER_PTS[diff],
          timeLimit: TIER_TIME[diff],
          iso: item.iso,
          name: item.name,
          a: item.a,
          o: item.o.slice(),
          continent: c ? c.continent : 'World',
          subregion: c ? c.subregion : 'World',
          pop: c ? c.pop : 0,
          flagUrl: 'assets/flags/' + String(item.iso).toLowerCase() + '.svg'
        });
      });
    });

    // 3. Trivia (90)
    var triviaSrc = window.GEO_TRIVIA || {};
    tiers.forEach(function (diff) {
      var list = triviaSrc[diff] || [];
      list.forEach(function (item) {
        var iso = resolveIso(item.a);
        var c = iso ? getCountry(iso) : null;
        masterPool.push({
          id: item.id,
          type: 'trivia',
          diff: diff,
          pts: TIER_PTS[diff],
          timeLimit: TIER_TIME[diff],
          iso: iso,
          name: c ? c.name : item.a,
          q: item.q,
          a: item.a,
          o: item.o.slice(),
          continent: c ? c.continent : 'World',
          subregion: c ? c.subregion : 'World',
          pop: c ? c.pop : 0,
          flagUrl: iso ? ('assets/flags/' + iso.toLowerCase() + '.svg') : ''
        });
      });
    });
  }

  function cloneForRound(item, allowCombo, comboBudgetRef) {
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

    if (canCombo && Math.random() < 0.32) {
      comboBudgetRef.left--;
      q.isCombo = true;
      q.comboBonus = 50;
      q.maxZoom = 3;
      q.renderMode = item.type === 'flag' ? 'flag-map' : 'trivia-map';
      q.o = null;
      return q;
    }

    q.o = item.o ? shuffle(item.o) : null;
    return q;
  }

  function pickFresh(candidates, needed, seenMap, pickedIds) {
    var unseen = [];
    var seen = [];
    for (var i = 0; i < candidates.length; i++) {
      var it = candidates[i];
      if (pickedIds[it.id]) continue;
      if (seenMap && seenMap[it.id]) seen.push(it);
      else unseen.push(it);
    }
    var ordered = shuffle(unseen).concat(shuffle(seen));
    var out = ordered.slice(0, needed);
    for (var j = 0; j < out.length; j++) pickedIds[out[j].id] = true;
    return out;
  }

  function buildRound(opts) {
    opts = opts || {};
    var mode = opts.mode || 'mixed';   // 'mixed' | 'map' | 'flag' | 'trivia'
    var diff = opts.diff || 'all';     // 'all' | 'easy' | 'medium' | 'hard'
    var count = opts.count || 10;
    var seenIds = opts.seenIds || [];
    var seenMap = {};
    for (var s = 0; s < seenIds.length; s++) seenMap[seenIds[s]] = true;

    var pool = masterPool.filter(function (item) {
      if (diff !== 'all' && item.diff !== diff) return false;
      if (mode !== 'mixed' && item.type !== mode) return false;
      return true;
    });

    var pickedIds = {};
    var chosen = [];

    if (mode === 'mixed') {
      var maps = pool.filter(function (x) { return x.type === 'map'; });
      var flags = pool.filter(function (x) { return x.type === 'flag'; });
      var trivs = pool.filter(function (x) { return x.type === 'trivia'; });

      // PLAN.md balance rule: >= 2 map, >= 2 flag, >= 1 trivia in a 10-item round
      chosen = chosen
        .concat(pickFresh(maps, Math.min(3, maps.length), seenMap, pickedIds))
        .concat(pickFresh(flags, Math.min(3, flags.length), seenMap, pickedIds))
        .concat(pickFresh(trivs, Math.min(2, trivs.length), seenMap, pickedIds));

      var remNeeded = count - chosen.length;
      if (remNeeded > 0) {
        chosen = chosen.concat(pickFresh(pool, remNeeded, seenMap, pickedIds));
      }
    } else {
      chosen = pickFresh(pool, count, seenMap, pickedIds);
    }

    // If diff === 'all', gently progress round from accessible warmup toward harder items
    chosen = shuffle(chosen);
    if (diff === 'all' && chosen.length >= 6) {
      var easyFirst = chosen.findIndex(function (x) { return x.diff === 'easy'; });
      if (easyFirst > 0) {
        var tmp = chosen[0];
        chosen[0] = chosen[easyFirst];
        chosen[easyFirst] = tmp;
      }
    }

    var comboBudget = { left: mode === 'mixed' ? 2 : 0 };
    return chosen.map(function (item) {
      return cloneForRound(item, mode === 'mixed', comboBudget);
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
    TIER_PTS: TIER_PTS,
    countriesByIso: countriesByIso,
    isoByName: isoByName,
    getCountry: getCountry,
    resolveIso: resolveIso,
    formatPop: formatPop,
    formatDisplayName: formatDisplayName,
    getRank: getRank,
    getAllItems: function () { return masterPool.slice(); },
    buildHighlightOptions: buildHighlightOptions,
    buildRound: buildRound
  };
})();
