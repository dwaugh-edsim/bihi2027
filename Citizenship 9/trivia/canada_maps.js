// canada_maps.js - 13 provincial and territorial map items.
// One item per line (for trivia_bank_lint.py). Uses ISO 3166-2 codes (CA-NS etc.)
// backed by assets/canada_provinces.js (window.CANADA_GEOJSON).
// Merged into window.GEO_MAPS after maps_60.js.
window.GEO_PROV_MAPS = {

  easy: [
    { id:'cme01', iso:'CA-NS', name:'Nova Scotia',      mode:'click',     maxZoom:5, prov:true, topic:'canada' },
    { id:'cme02', iso:'CA-QC', name:'Quebec',           mode:'click',     maxZoom:4, prov:true, topic:'canada' },
    { id:'cme03', iso:'CA-ON', name:'Ontario',          mode:'click',     maxZoom:4, prov:true, topic:'canada' },
    { id:'cme04', iso:'CA-BC', name:'British Columbia', mode:'click',     maxZoom:4, prov:true, topic:'canada' }
  ],

  medium: [
    { id:'cmm01', iso:'CA-AB', name:'Alberta',          mode:'click',     maxZoom:4, prov:true, topic:'canada' },
    { id:'cmm02', iso:'CA-MB', name:'Manitoba',         mode:'highlight', maxZoom:4, prov:true, topic:'canada' },
    { id:'cmm03', iso:'CA-SK', name:'Saskatchewan',     mode:'click',     maxZoom:4, prov:true, topic:'canada' },
    { id:'cmm04', iso:'CA-NU', name:'Nunavut',          mode:'click',     maxZoom:3, prov:true, topic:'canada' },
    { id:'cmm05', iso:'CA-NB', name:'New Brunswick',    mode:'highlight', maxZoom:5, prov:true, topic:'canada' }
  ],

  hard: [
    { id:'cmh01', iso:'CA-PE', name:'Prince Edward Island',      mode:'highlight', maxZoom:5, prov:true, topic:'canada' },
    { id:'cmh02', iso:'CA-NL', name:'Newfoundland and Labrador', mode:'click',     maxZoom:4, prov:true, topic:'canada' },
    { id:'cmh03', iso:'CA-YT', name:'Yukon',                     mode:'click',     maxZoom:4, prov:true, topic:'canada' },
    { id:'cmh04', iso:'CA-NT', name:'Northwest Territories',     mode:'highlight', maxZoom:4, prov:true, topic:'canada' }
  ]
};

(function () {
  'use strict';
  var tiers = ['easy', 'medium', 'hard'];
  window.GEO_MAPS = window.GEO_MAPS || { easy: [], medium: [], hard: [] };
  tiers.forEach(function (tier) {
    var list = window.GEO_PROV_MAPS[tier] || [];
    for (var i = 0; i < list.length; i++) window.GEO_MAPS[tier].push(list[i]);
  });
})();
