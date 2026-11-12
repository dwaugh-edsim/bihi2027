// flags_60.js - 60 flag items: 20 easy / 20 medium / 20 hard.
// Each item: { id, iso, name, o:[4 country-name options], a } where `a` is the correct name.
// Flag image is served from local assets (assets/flags/<iso>.svg), NOT emoji -
// Windows Chrome renders flag emoji as letter pairs, so SVG keeps teacher + student
// screens identical. Hard-tier options deliberately include lookalike flags
// (Romania/Chad, Monaco/Indonesia/Poland, Australia/New Zealand, Norway/Iceland...).
// Loader tags type:'flag', diff from tier, pts by tier (easy 100 / medium 200 / hard 300),
// shuffles `o` per round. A flag item can also be served as flag-map (answer by clicking
// the country on the context map) - that is a hard-tier presentation choice at load time.
window.GEO_FLAGS = {

  easy: [
    { id:'fe01', iso:'CA', name:'Canada',          o:['Canada','USA','United Kingdom','Australia'], a:'Canada' },
    { id:'fe02', iso:'US', name:'USA',             o:['USA','Canada','United Kingdom','Mexico'], a:'USA' },
    { id:'fe03', iso:'GB', name:'United Kingdom',  o:['United Kingdom','Ireland','France','USA'], a:'United Kingdom' },
    { id:'fe04', iso:'FR', name:'France',          o:['France','Italy','Spain','Germany'], a:'France' },
    { id:'fe05', iso:'IT', name:'Italy',           o:['Italy','Greece','France','Spain'], a:'Italy' },
    { id:'fe06', iso:'DE', name:'Germany',         o:['Germany','Austria','Netherlands','Poland'], a:'Germany' },
    { id:'fe07', iso:'ES', name:'Spain',           o:['Spain','Portugal','Mexico','Italy'], a:'Spain' },
    { id:'fe08', iso:'JP', name:'Japan',           o:['Japan','China','South Korea','USA'], a:'Japan' },
    { id:'fe09', iso:'CN', name:'China',           o:['China','Japan','Mongolia','Vietnam'], a:'China' },
    { id:'fe10', iso:'BR', name:'Brazil',          o:['Brazil','Argentina','Colombia','Portugal'], a:'Brazil' },
    { id:'fe11', iso:'AU', name:'Australia',       o:['Australia','New Zealand','United Kingdom','South Africa'], a:'Australia' },
    { id:'fe12', iso:'MX', name:'Mexico',          o:['Mexico','Spain','USA','Colombia'], a:'Mexico' },
    { id:'fe13', iso:'IN', name:'India',           o:['India','Pakistan','Bangladesh','Sri Lanka'], a:'India' },
    { id:'fe14', iso:'RU', name:'Russia',          o:['Russia','Ukraine','Kazakhstan','Mongolia'], a:'Russia' },
    { id:'fe15', iso:'EG', name:'Egypt',           o:['Egypt','Morocco','Saudi Arabia','Sudan'], a:'Egypt' },
    { id:'fe16', iso:'SE', name:'Sweden',          o:['Sweden','Norway','Finland','Denmark'], a:'Sweden' },
    { id:'fe17', iso:'NO', name:'Norway',          o:['Norway','Sweden','Iceland','Denmark'], a:'Norway' },
    { id:'fe18', iso:'NL', name:'Netherlands',     o:['Netherlands','Belgium','Germany','Luxembourg'], a:'Netherlands' },
    { id:'fe19', iso:'IE', name:'Ireland',         o:['Ireland','United Kingdom','France','USA'], a:'Ireland' },
    { id:'fe20', iso:'PT', name:'Portugal',        o:['Portugal','Spain','Brazil','Italy'], a:'Portugal' },
    { id:'fe21', iso:'JP', name:'Japan',           o:['Japan','South Korea','Bangladesh','Palau'], a:'Japan' },
    { id:'fe22', iso:'JM', name:'Jamaica',         o:['Jamaica','Brazil','South Africa','Bahamas'], a:'Jamaica' },
    { id:'fe23', iso:'CU', name:'Cuba',            o:['Cuba','USA','Puerto Rico','Chile'], a:'Cuba' },
    { id:'fe24', iso:'DK', name:'Denmark',         o:['Denmark','Switzerland','Norway','Sweden'], a:'Denmark' },
    { id:'fe25', iso:'FI', name:'Finland',         o:['Finland','Sweden','Iceland','Greece'], a:'Finland' },
    { id:'fe26', iso:'BE', name:'Belgium',         o:['Belgium','Germany','France','Romania'], a:'Belgium' }
  ],

  medium: [
    { id:'fm01', iso:'PL', name:'Poland',          o:['Poland','Indonesia','Monaco','Germany'], a:'Poland' },
    { id:'fm02', iso:'GR', name:'Greece',          o:['Greece','Italy','Turkey','Cyprus'], a:'Greece' },
    { id:'fm03', iso:'TR', name:'Turkey',          o:['Turkey','Greece','Iran','Egypt'], a:'Turkey' },
    { id:'fm04', iso:'UA', name:'Ukraine',         o:['Ukraine','Poland','Russia','Romania'], a:'Ukraine' },
    { id:'fm05', iso:'AR', name:'Argentina',       o:['Argentina','Uruguay','Chile','Brazil'], a:'Argentina' },
    { id:'fm06', iso:'CL', name:'Chile',           o:['Chile','Argentina','Peru','Bolivia'], a:'Chile' },
    { id:'fm07', iso:'PE', name:'Peru',            o:['Peru','Bolivia','Ecuador','Chile'], a:'Peru' },
    { id:'fm08', iso:'CO', name:'Colombia',        o:['Colombia','Venezuela','Ecuador','Brazil'], a:'Colombia' },
    { id:'fm09', iso:'ZA', name:'South Africa',    o:['South Africa','Lesotho','Eswatini','Namibia'], a:'South Africa' },
    { id:'fm10', iso:'NG', name:'Nigeria',         o:['Nigeria','Niger','Ghana','Cameroon'], a:'Nigeria' },
    { id:'fm11', iso:'KE', name:'Kenya',           o:['Kenya','Tanzania','Uganda','Ethiopia'], a:'Kenya' },
    { id:'fm12', iso:'MA', name:'Morocco',         o:['Morocco','Algeria','Tunisia','Spain'], a:'Morocco' },
    { id:'fm13', iso:'TH', name:'Thailand',        o:['Thailand','Myanmar','Laos','Cambodia'], a:'Thailand' },
    { id:'fm14', iso:'VN', name:'Vietnam',         o:['Vietnam','Thailand','Laos','China'], a:'Vietnam' },
    { id:'fm15', iso:'ID', name:'Indonesia',       o:['Indonesia','Monaco','Poland','Malaysia'], a:'Indonesia' },
    { id:'fm16', iso:'KR', name:'South Korea',     o:['South Korea','North Korea','Japan','China'], a:'South Korea' },
    { id:'fm17', iso:'SA', name:'Saudi Arabia',    o:['Saudi Arabia','Qatar','United Arab Emirates','Yemen'], a:'Saudi Arabia' },
    { id:'fm18', iso:'AE', name:'United Arab Emirates', o:['United Arab Emirates','Saudi Arabia','Qatar','Oman'], a:'United Arab Emirates' },
    { id:'fm19', iso:'NZ', name:'New Zealand',     o:['New Zealand','Australia','United Kingdom','Fiji'], a:'New Zealand' },
    { id:'fm20', iso:'CH', name:'Switzerland',     o:['Switzerland','Austria','Sweden','Denmark'], a:'Switzerland' },
    { id:'fm21', iso:'PH', name:'Philippines',     o:['Philippines','Czechia','Cuba','Malaysia'], a:'Philippines' },
    { id:'fm22', iso:'MY', name:'Malaysia',        o:['Malaysia','USA','Liberia','Thailand'], a:'Malaysia' },
    { id:'fm23', iso:'SG', name:'Singapore',       o:['Singapore','Indonesia','Turkey','Tunisia'], a:'Singapore' },
    { id:'fm24', iso:'PK', name:'Pakistan',        o:['Pakistan','Turkey','Saudi Arabia','Algeria'], a:'Pakistan' },
    { id:'fm25', iso:'GH', name:'Ghana',           o:['Ghana','Senegal','Cameroon','Ethiopia'], a:'Ghana' },
    { id:'fm26', iso:'ET', name:'Ethiopia',        o:['Ethiopia','Ghana','Kenya','Bolivia'], a:'Ethiopia' },
    { id:'fm27', iso:'NP', name:'Nepal',           o:['Nepal','Bhutan','India','Sri Lanka'], a:'Nepal' }
  ],

  hard: [
    { id:'fh01', iso:'EE', name:'Estonia',         o:['Estonia','Latvia','Lithuania','Russia'], a:'Estonia' },
    { id:'fh02', iso:'LV', name:'Latvia',          o:['Latvia','Estonia','Lithuania','Austria'], a:'Latvia' },
    { id:'fh03', iso:'LT', name:'Lithuania',       o:['Lithuania','Latvia','Poland','Belarus'], a:'Lithuania' },
    { id:'fh04', iso:'BG', name:'Bulgaria',        o:['Bulgaria','Russia','Romania','Greece'], a:'Bulgaria' },
    { id:'fh05', iso:'HR', name:'Croatia',         o:['Croatia','Slovenia','Serbia','Slovakia'], a:'Croatia' },
    { id:'fh06', iso:'SI', name:'Slovenia',        o:['Slovenia','Slovakia','Croatia','Austria'], a:'Slovenia' },
    { id:'fh07', iso:'SK', name:'Slovakia',        o:['Slovakia','Slovenia','Czechia','Poland'], a:'Slovakia' },
    { id:'fh08', iso:'CZ', name:'Czechia',         o:['Czechia','Slovakia','Poland','Austria'], a:'Czechia' },
    { id:'fh09', iso:'HU', name:'Hungary',         o:['Hungary','Romania','Austria','Serbia'], a:'Hungary' },
    { id:'fh10', iso:'AT', name:'Austria',         o:['Austria','Latvia','Germany','Hungary'], a:'Austria' },
    { id:'fh11', iso:'BE', name:'Belgium',         o:['Belgium','Germany','Netherlands','France'], a:'Belgium' },
    { id:'fh12', iso:'LU', name:'Luxembourg',      o:['Luxembourg','Netherlands','Belgium','France'], a:'Luxembourg' },
    { id:'fh13', iso:'DK', name:'Denmark',         o:['Denmark','Switzerland','Sweden','Norway'], a:'Denmark' },
    { id:'fh14', iso:'RO', name:'Romania',         o:['Romania','Chad','Andorra','Moldova'], a:'Romania' },
    { id:'fh15', iso:'MC', name:'Monaco',          o:['Monaco','Indonesia','Poland','Singapore'], a:'Monaco' },
    { id:'fh16', iso:'CI', name:'Ivory Coast',     o:['Ivory Coast','Ireland','Italy','Niger'], a:'Ivory Coast' },
    { id:'fh17', iso:'IS', name:'Iceland',         o:['Iceland','Norway','Denmark','Sweden'], a:'Iceland' },
    { id:'fh18', iso:'KH', name:'Cambodia',        o:['Cambodia','Thailand','Laos','Myanmar'], a:'Cambodia' },
    { id:'fh19', iso:'MN', name:'Mongolia',        o:['Mongolia','China','Russia','Kazakhstan'], a:'Mongolia' },
    { id:'fh20', iso:'QA', name:'Qatar',           o:['Qatar','Bahrain','Indonesia','Poland'], a:'Qatar' },
    { id:'fh21', iso:'UY', name:'Uruguay',         o:['Uruguay','Argentina','Greece','Israel'], a:'Uruguay' },
    { id:'fh22', iso:'EC', name:'Ecuador',         o:['Ecuador','Colombia','Venezuela','Bolivia'], a:'Ecuador' },
    { id:'fh23', iso:'KZ', name:'Kazakhstan',      o:['Kazakhstan','Ukraine','Uzbekistan','Mongolia'], a:'Kazakhstan' },
    { id:'fh24', iso:'BD', name:'Bangladesh',      o:['Bangladesh','Japan','Pakistan','Palau'], a:'Bangladesh' },
    { id:'fh25', iso:'NO', name:'Norway',          o:['Norway','Iceland','Denmark','Finland'], a:'Norway' },
    { id:'fh26', iso:'JO', name:'Jordan',          o:['Jordan','Sudan','Kuwait','United Arab Emirates'], a:'Jordan' },
    { id:'fh27', iso:'BT', name:'Bhutan',          o:['Bhutan','Nepal','Sri Lanka','Mongolia'], a:'Bhutan' }
  ]
};
