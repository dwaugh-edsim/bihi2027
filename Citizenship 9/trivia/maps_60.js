// maps_60.js - 60 map items: 20 easy / 20 medium / 20 hard.
// Each item: { id, iso, name, mode, maxZoom }
//   iso     -> ISO 3166-1 alpha-2 code; geometry comes from the local world GeoJSON layer
//   mode    -> 'click' (student clicks the country on the context map)
//              'highlight' (target is filled; student picks its name - loader builds
//               4 options from same-continent countries and shuffles)
//   maxZoom -> Leaflet cap when framing the item with fitBounds(bounds.pad(0.6)):
//              easy 6 (country is big on screen), medium 4, hard 3 (small shape in a
//              crowded region). Neighbouring countries are always visible = context.
// Loader tags type:'map', diff from tier, pts by tier (easy 100 / medium 200 / hard 300).
window.GEO_MAPS = {

  easy: [
    { id:'me01', iso:'CA', name:'Canada',          mode:'click',     maxZoom:6 },
    { id:'me02', iso:'US', name:'United States',   mode:'click',     maxZoom:6 },
    { id:'me03', iso:'MX', name:'Mexico',          mode:'click',     maxZoom:6 },
    { id:'me04', iso:'BR', name:'Brazil',          mode:'click',     maxZoom:6 },
    { id:'me05', iso:'AR', name:'Argentina',       mode:'click',     maxZoom:6 },
    { id:'me06', iso:'CL', name:'Chile',           mode:'click',     maxZoom:6 },
    { id:'me07', iso:'PE', name:'Peru',            mode:'highlight', maxZoom:6 },
    { id:'me08', iso:'CO', name:'Colombia',        mode:'click',     maxZoom:6 },
    { id:'me09', iso:'VE', name:'Venezuela',       mode:'highlight', maxZoom:6 },
    { id:'me10', iso:'GB', name:'United Kingdom',  mode:'click',     maxZoom:6 },
    { id:'me11', iso:'IE', name:'Ireland',         mode:'highlight', maxZoom:6 },
    { id:'me12', iso:'FR', name:'France',          mode:'click',     maxZoom:6 },
    { id:'me13', iso:'ES', name:'Spain',           mode:'click',     maxZoom:6 },
    { id:'me14', iso:'PT', name:'Portugal',        mode:'highlight', maxZoom:6 },
    { id:'me15', iso:'IT', name:'Italy',           mode:'click',     maxZoom:6 },
    { id:'me16', iso:'DE', name:'Germany',         mode:'click',     maxZoom:6 },
    { id:'me17', iso:'NO', name:'Norway',          mode:'click',     maxZoom:6 },
    { id:'me18', iso:'SE', name:'Sweden',          mode:'highlight', maxZoom:6 },
    { id:'me19', iso:'FI', name:'Finland',         mode:'click',     maxZoom:6 },
    { id:'me20', iso:'PL', name:'Poland',          mode:'click',     maxZoom:6 }
  ],

  medium: [
    { id:'mm01', iso:'AU', name:'Australia',       mode:'click',     maxZoom:4 },
    { id:'mm02', iso:'NZ', name:'New Zealand',     mode:'highlight', maxZoom:4 },
    { id:'mm03', iso:'JP', name:'Japan',           mode:'click',     maxZoom:4 },
    { id:'mm04', iso:'CN', name:'China',           mode:'click',     maxZoom:4 },
    { id:'mm05', iso:'IN', name:'India',           mode:'click',     maxZoom:4 },
    { id:'mm06', iso:'RU', name:'Russia',          mode:'click',     maxZoom:4 },
    { id:'mm07', iso:'EG', name:'Egypt',           mode:'click',     maxZoom:4 },
    { id:'mm08', iso:'ZA', name:'South Africa',    mode:'click',     maxZoom:4 },
    { id:'mm09', iso:'NG', name:'Nigeria',         mode:'click',     maxZoom:4 },
    { id:'mm10', iso:'KE', name:'Kenya',           mode:'highlight', maxZoom:4 },
    { id:'mm11', iso:'MA', name:'Morocco',         mode:'click',     maxZoom:4 },
    { id:'mm12', iso:'DZ', name:'Algeria',         mode:'click',     maxZoom:4 },
    { id:'mm13', iso:'ET', name:'Ethiopia',        mode:'highlight', maxZoom:4 },
    { id:'mm14', iso:'UA', name:'Ukraine',         mode:'click',     maxZoom:4 },
    { id:'mm15', iso:'GR', name:'Greece',          mode:'click',     maxZoom:4 },
    { id:'mm16', iso:'TR', name:'Turkey',          mode:'click',     maxZoom:4 },
    { id:'mm17', iso:'TH', name:'Thailand',        mode:'highlight', maxZoom:4 },
    { id:'mm18', iso:'VN', name:'Vietnam',         mode:'click',     maxZoom:4 },
    { id:'mm19', iso:'ID', name:'Indonesia',       mode:'click',     maxZoom:4 },
    { id:'mm20', iso:'SA', name:'Saudi Arabia',    mode:'click',     maxZoom:4 }
  ],

  hard: [
    { id:'mh01', iso:'EE', name:'Estonia',         mode:'click', maxZoom:3 },
    { id:'mh02', iso:'LV', name:'Latvia',          mode:'click', maxZoom:3 },
    { id:'mh03', iso:'LT', name:'Lithuania',       mode:'click', maxZoom:3 },
    { id:'mh04', iso:'RO', name:'Romania',         mode:'click', maxZoom:3 },
    { id:'mh05', iso:'BG', name:'Bulgaria',        mode:'click', maxZoom:3 },
    { id:'mh06', iso:'AL', name:'Albania',         mode:'click', maxZoom:3 },
    { id:'mh07', iso:'HR', name:'Croatia',         mode:'click', maxZoom:3 },
    { id:'mh08', iso:'SI', name:'Slovenia',        mode:'click', maxZoom:3 },
    { id:'mh09', iso:'SK', name:'Slovakia',        mode:'click', maxZoom:3 },
    { id:'mh10', iso:'CZ', name:'Czechia',         mode:'click', maxZoom:3 },
    { id:'mh11', iso:'HU', name:'Hungary',         mode:'click', maxZoom:3 },
    { id:'mh12', iso:'AT', name:'Austria',         mode:'click', maxZoom:3 },
    { id:'mh13', iso:'CH', name:'Switzerland',     mode:'click', maxZoom:3 },
    { id:'mh14', iso:'NL', name:'Netherlands',     mode:'click', maxZoom:3 },
    { id:'mh15', iso:'BE', name:'Belgium',         mode:'click', maxZoom:3 },
    { id:'mh16', iso:'LU', name:'Luxembourg',      mode:'click', maxZoom:3 },
    { id:'mh17', iso:'KH', name:'Cambodia',        mode:'click', maxZoom:3 },
    { id:'mh18', iso:'LA', name:'Laos',            mode:'click', maxZoom:3 },
    { id:'mh19', iso:'MY', name:'Malaysia',        mode:'click', maxZoom:3 },
    { id:'mh20', iso:'MN', name:'Mongolia',        mode:'click', maxZoom:3 }
  ]
};
