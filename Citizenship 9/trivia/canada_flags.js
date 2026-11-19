// canada_flags.js - 13 provincial and territorial flag items (added 2026-11-19).
// One item per line (the bank lint parses line by line), same model as flags_60.js
// with extra fields: prov:true marks a province/territory flag (no map combos, no
// map clicks), region = 'Province' | 'Territory', pop = approx population (both
// shown on the Intel reveal card), topic:'canada' joins the Canada Pass topic and
// stays out of the World Flags pass. `iso` uses ISO 3166-2 codes (CA-NS etc.), so
// the loader's flag URL builder serves the local official SVGs vendored at
// assets/flags/ca-*.svg (Wikimedia Commons, public-domain official symbols).
// Provincial flags are NOT emoji - same reason as world flags: Windows Chrome
// renders flag emoji as letter pairs, so SVG keeps screens identical.
window.GEO_PROV_FLAGS = {

  easy: [
    { id:'cfe01', iso:'CA-NS', name:'Nova Scotia', prov:true, region:'Province', pop:1100000, o:['Nova Scotia','Newfoundland and Labrador','New Brunswick','Prince Edward Island'], topic:'canada', a:'Nova Scotia' },
    { id:'cfe02', iso:'CA-QC', name:'Quebec', prov:true, region:'Province', pop:9100000, o:['Quebec','Ontario','Manitoba','Alberta'], topic:'canada', a:'Quebec' },
    { id:'cfe03', iso:'CA-ON', name:'Ontario', prov:true, region:'Province', pop:15900000, o:['Ontario','Manitoba','Quebec','British Columbia'], topic:'canada', a:'Ontario' },
    { id:'cfe04', iso:'CA-BC', name:'British Columbia', prov:true, region:'Province', pop:5800000, o:['British Columbia','Alberta','Saskatchewan','Ontario'], topic:'canada', a:'British Columbia' }
  ],

  medium: [
    { id:'cfm01', iso:'CA-AB', name:'Alberta', prov:true, region:'Province', pop:5000000, o:['Alberta','British Columbia','Saskatchewan','Manitoba'], topic:'canada', a:'Alberta' },
    { id:'cfm02', iso:'CA-MB', name:'Manitoba', prov:true, region:'Province', pop:1500000, o:['Manitoba','Ontario','Saskatchewan','Quebec'], topic:'canada', a:'Manitoba' },
    { id:'cfm03', iso:'CA-SK', name:'Saskatchewan', prov:true, region:'Province', pop:1250000, o:['Saskatchewan','Alberta','Manitoba','Quebec'], topic:'canada', a:'Saskatchewan' },
    { id:'cfm04', iso:'CA-NU', name:'Nunavut', prov:true, region:'Territory', pop:42000, o:['Nunavut','Northwest Territories','Yukon','Newfoundland and Labrador'], topic:'canada', a:'Nunavut' },
    { id:'cfm05', iso:'CA-NB', name:'New Brunswick', prov:true, region:'Province', pop:900000, o:['New Brunswick','Nova Scotia','Prince Edward Island','Quebec'], topic:'canada', a:'New Brunswick' }
  ],

  hard: [
    { id:'cfh01', iso:'CA-PE', name:'Prince Edward Island', prov:true, region:'Province', pop:180000, o:['Prince Edward Island','Nova Scotia','New Brunswick','Newfoundland and Labrador'], topic:'canada', a:'Prince Edward Island' },
    { id:'cfh02', iso:'CA-NL', name:'Newfoundland and Labrador', prov:true, region:'Province', pop:550000, o:['Newfoundland and Labrador','Nova Scotia','British Columbia','Prince Edward Island'], topic:'canada', a:'Newfoundland and Labrador' },
    { id:'cfh03', iso:'CA-YT', name:'Yukon', prov:true, region:'Territory', pop:47000, o:['Yukon','Northwest Territories','Nunavut','Alberta'], topic:'canada', a:'Yukon' },
    { id:'cfh04', iso:'CA-NT', name:'Northwest Territories', prov:true, region:'Territory', pop:45000, o:['Northwest Territories','Nunavut','Yukon','Manitoba'], topic:'canada', a:'Northwest Territories' }
  ]
};

// Merge into the flag bank the same way trivia_extra.js merges trivia.
(function () {
  'use strict';
  var tiers = ['easy', 'medium', 'hard'];
  window.GEO_FLAGS = window.GEO_FLAGS || { easy: [], medium: [], hard: [] };
  tiers.forEach(function (tier) {
    var list = window.GEO_PROV_FLAGS[tier] || [];
    for (var i = 0; i < list.length; i++) window.GEO_FLAGS[tier].push(list[i]);
  });
})();
