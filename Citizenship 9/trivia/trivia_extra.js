// trivia_extra.js - extra country-trivia items: capitals, oceans and seas,
// Africa / South Asia, Canada + Nova Scotia, and map-skills.
// Same item model as trivia_90.js: { id, q, o:[4 options], a, topic? }.
// `a` may be a city, a body of water, or a country. The loader resolves a country
// when it can; otherwise the item simply carries no flag and is never offered as a
// click-on-map or Combo item. `topic` is 'facts' unless marked 'culture'.
// IDs use the x-prefix so they never collide with the e/m/h items in trivia_90.js.
(function () {
  'use strict';

  var EXTRA = {
    easy: [
      { id:'xc01', q:'What is the capital city of Canada?', o:['Ottawa','Toronto','Vancouver','Montreal'], a:'Ottawa' },
      { id:'xc02', q:'What is the capital city of France?', o:['Paris','Lyon','Marseille','Nice'], a:'Paris' },
      { id:'xc03', q:'What is the capital city of Japan?', o:['Tokyo','Osaka','Kyoto','Nagoya'], a:'Tokyo' },
      { id:'xc04', q:'What is the capital city of the United Kingdom?', o:['London','Manchester','Edinburgh','Birmingham'], a:'London' },
      { id:'xc05', q:'What is the capital city of Australia?', o:['Canberra','Sydney','Melbourne','Perth'], a:'Canberra' },
      { id:'xc06', q:'What is the capital city of the United States?', o:['Washington, D.C.','New York City','Los Angeles','Chicago'], a:'Washington, D.C.' },
      { id:'xc07', q:'What is the capital city of Brazil?', o:['Bras\u00EDlia','Rio de Janeiro','S\u00E3o Paulo','Salvador'], a:'Bras\u00EDlia' },
      { id:'xc08', q:'What is the capital city of China?', o:['Beijing','Shanghai','Hong Kong','Guangzhou'], a:'Beijing' },
      { id:'xc09', q:'What is the capital city of India?', o:['New Delhi','Mumbai','Kolkata','Bengaluru'], a:'New Delhi' },
      { id:'xc10', q:'What is the capital city of Egypt?', o:['Cairo','Alexandria','Giza','Luxor'], a:'Cairo' },
      { id:'xc11', q:'What is the capital city of Italy?', o:['Rome','Milan','Venice','Naples'], a:'Rome' },
      { id:'xc12', q:'What is the capital city of Spain?', o:['Madrid','Barcelona','Seville','Valencia'], a:'Madrid' },
      { id:'xc13', q:'What is the capital city of Germany?', o:['Berlin','Munich','Hamburg','Frankfurt'], a:'Berlin' },
      { id:'xc14', q:'What is the capital city of Mexico?', o:['Mexico City','Guadalajara','Canc\u00FAn','Monterrey'], a:'Mexico City' },
      { id:'xc15', q:'What is the capital city of South Korea?', o:['Seoul','Busan','Incheon','Daegu'], a:'Seoul' },
      { id:'xo01', q:'Which is the largest ocean on Earth?', o:['Pacific Ocean','Atlantic Ocean','Indian Ocean','Arctic Ocean'], a:'Pacific Ocean' },
      { id:'xo02', q:'Which ocean lies between North America and Europe?', o:['Atlantic Ocean','Pacific Ocean','Indian Ocean','Arctic Ocean'], a:'Atlantic Ocean' },
      { id:'xo03', q:'Which is the smallest ocean on Earth?', o:['Arctic Ocean','Indian Ocean','Southern Ocean','Atlantic Ocean'], a:'Arctic Ocean' },
      { id:'xo04', q:'Which ocean surrounds Antarctica?', o:['Southern Ocean','Atlantic Ocean','Indian Ocean','Pacific Ocean'], a:'Southern Ocean' },
      { id:'xs01', q:'Which country is the only one that is also a continent?', o:['Australia','Antarctica','Brazil','Egypt'], a:'Australia' },
      { id:'xs02', q:'Which country is the only one whose national flag is not rectangular?', o:['Nepal','Switzerland','Vatican City','Japan'], a:'Nepal' },
      { id:'xs03', q:'Which country is the only one located in all four hemispheres?', o:['Kiribati','Fiji','Indonesia','Madagascar'], a:'Kiribati' },
      { id:'xs04', q:'Which country is the only one that lies entirely within South Africa?', o:['Lesotho','Eswatini','Botswana','Namibia'], a:'Lesotho' }
    ],

    medium: [
      { id:'xc16', q:'What is the capital city of Argentina?', o:['Buenos Aires','Santiago','Lima','Montevideo'], a:'Buenos Aires' },
      { id:'xc17', q:'What is the capital city of Sweden?', o:['Stockholm','Oslo','Copenhagen','Helsinki'], a:'Stockholm' },
      { id:'xc18', q:'What is the capital city of Norway?', o:['Oslo','Bergen','Stockholm','Reykjav\u00EDk'], a:'Oslo' },
      { id:'xc19', q:'What is the capital city of the Netherlands?', o:['Amsterdam','Rotterdam','The Hague','Utrecht'], a:'Amsterdam' },
      { id:'xc20', q:'What is the capital city of Turkey?', o:['Ankara','Istanbul','Izmir','Antalya'], a:'Ankara' },
      { id:'xc21', q:'What is the capital city of Saudi Arabia?', o:['Riyadh','Jeddah','Mecca','Dammam'], a:'Riyadh' },
      { id:'xc22', q:'What is the capital city of Nigeria?', o:['Abuja','Lagos','Kano','Ibadan'], a:'Abuja' },
      { id:'xc23', q:'What is the capital city of Kenya?', o:['Nairobi','Mombasa','Kampala','Dar es Salaam'], a:'Nairobi' },
      { id:'xc24', q:'Which city is the administrative capital of South Africa?', o:['Pretoria','Cape Town','Johannesburg','Durban'], a:'Pretoria' },
      { id:'xc25', q:'What is the capital city of Russia?', o:['Moscow','Saint Petersburg','Sochi','Kazan'], a:'Moscow' },
      { id:'xc26', q:'What is the capital city of Thailand?', o:['Bangkok','Phuket','Chiang Mai','Pattaya'], a:'Bangkok' },
      { id:'xc27', q:'What is the capital city of Vietnam?', o:['Hanoi','Ho Chi Minh City','Da Nang','Hu\u1EBF'], a:'Hanoi' },
      { id:'xc28', q:'What is the capital city of Pakistan?', o:['Islamabad','Karachi','Lahore','Peshawar'], a:'Islamabad' },
      { id:'xc29', q:'What is the capital city of New Zealand?', o:['Wellington','Auckland','Christchurch','Queenstown'], a:'Wellington' },
      { id:'xc30', q:'What is the capital city of Ireland?', o:['Dublin','Cork','Galway','Belfast'], a:'Dublin' },
      { id:'xo05', q:'Which sea separates Europe from Africa?', o:['Mediterranean Sea','Red Sea','Black Sea','Baltic Sea'], a:'Mediterranean Sea' },
      { id:'xo06', q:'Which ocean lies between Africa and Asia?', o:['Indian Ocean','Atlantic Ocean','Pacific Ocean','Southern Ocean'], a:'Indian Ocean' },
      { id:'xo07', q:'The Gulf of Mexico is part of which ocean?', o:['Atlantic Ocean','Pacific Ocean','Indian Ocean','Arctic Ocean'], a:'Atlantic Ocean' },
      { id:'xo08', q:'Which sea lies between Japan and South Korea?', o:['Sea of Japan','South China Sea','Mediterranean Sea','Caribbean Sea'], a:'Sea of Japan' },
      { id:'xo09', q:'Which canal connects the Mediterranean Sea to the Red Sea?', o:['Suez Canal','Panama Canal','Kiel Canal','Erie Canal'], a:'Suez Canal' },
      { id:'xs05', q:'Which country has coastlines on both the Red Sea and the Persian Gulf?', o:['Saudi Arabia','Egypt','Jordan','Yemen'], a:'Saudi Arabia' },
      { id:'xs06', q:'Which country is made up of two main islands separated by the Cook Strait?', o:['New Zealand','Fiji','Japan','Philippines'], a:'New Zealand' },
      { id:'xs07', q:'The Bering Strait separates Russia from which country?', o:['USA','Canada','Japan','Denmark'], a:'USA' },
      { id:'xa01', q:'The ancient stone ruins of Great Zimbabwe gave which modern country its name?', o:['Zimbabwe','Zambia','Botswana','Mozambique'], a:'Zimbabwe' },
      { id:'xa02', q:'Which country is the largest in Africa by land area?', o:['Algeria','Libya','Egypt','Sudan'], a:'Algeria' },
      { id:'xa03', q:'Which African country is known as the "Pearl of Africa" and is home to mountain gorillas?', o:['Uganda','Kenya','Tanzania','Rwanda'], a:'Uganda' },
      { id:'xa04', q:'Which country is home to the Virunga mountain gorillas and a capital at Kigali?', o:['Rwanda','Uganda','Kenya','Ethiopia'], a:'Rwanda' },
      { id:'xa05', q:'The ancient Nubian pyramids of Mero\u00EB are in which modern country?', o:['Sudan','Egypt','Ethiopia','Libya'], a:'Sudan' },
      { id:'xa06', q:'The Maldives are a chain of coral islands in which ocean?', o:['Indian Ocean','Pacific Ocean','Atlantic Ocean','Southern Ocean'], a:'Indian Ocean' },
      { id:'xa07', q:'Which South Asian country has the largest population in the world?', o:['India','China','Pakistan','Bangladesh'], a:'India' },
      { id:'xa08', q:'Which country is home to the Indus River and the port city of Karachi?', o:['Pakistan','India','Bangladesh','Iran'], a:'Pakistan' },
      { id:'xa09', q:'The island country of Sri Lanka sits off the southern coast of which country?', o:['India','Maldives','Bangladesh','Myanmar'], a:'India' },
      { id:'xa10', q:'Which country\u2019s national football team is known as the "Indomitable Lions"?', o:['Cameroon','Nigeria','Ghana','Senegal'], a:'Cameroon' },
      { id:'xa11', q:'Marathon runner Eliud Kipchoge is from which country?', o:['Kenya','Ethiopia','Uganda','Morocco'], a:'Kenya' },
      { id:'xa12', q:'Which country is home to most of the Sundarbans, the world\u2019s largest mangrove forest?', o:['Bangladesh','India','Nepal','Sri Lanka'], a:'Bangladesh' },
      { id:'xn01', q:'Which province is home to Peggy\u2019s Cove and the Bay of Fundy?', o:['Nova Scotia','New Brunswick','Prince Edward Island','Newfoundland and Labrador'], a:'Nova Scotia' },
      { id:'xn02', q:'Which Canadian province has Victoria as its capital?', o:['British Columbia','Alberta','Ontario','Manitoba'], a:'British Columbia' },
      { id:'xn03', q:'The Canadian Rockies run mainly through British Columbia and which other province?', o:['Alberta','Saskatchewan','Manitoba','Yukon'], a:'Alberta' },
      { id:'xn04', q:'Which province is Canada\u2019s largest by land area?', o:['Quebec','Ontario','British Columbia','Newfoundland and Labrador'], a:'Quebec' },
      { id:'xn05', q:'Which province is home to Canada\u2019s capital city, Ottawa?', o:['Ontario','Quebec','Manitoba','Saskatchewan'], a:'Ontario' },
      { id:'xn06', q:'The Great Lakes form part of the border between Canada and which country?', o:['USA','Mexico','Russia','Denmark'], a:'USA' },
      { id:'xn07', q:'Signal Hill and Cape Spear, Canada\u2019s easternmost point, are in which province?', o:['Newfoundland and Labrador','Nova Scotia','New Brunswick','Prince Edward Island'], a:'Newfoundland and Labrador' },
      { id:'xn08', q:'The Halifax Citadel and the province\u2019s Titanic connection belong to which province?', o:['Nova Scotia','New Brunswick','Newfoundland and Labrador','Prince Edward Island'], a:'Nova Scotia' }
    ],

    hard: [
      { id:'xc31', q:'What is the capital city of Kazakhstan?', o:['Astana','Almaty','Tashkent','Bishkek'], a:'Astana' },
      { id:'xc32', q:'What is the capital city of Uzbekistan?', o:['Tashkent','Samarkand','Bukhara','Almaty'], a:'Tashkent' },
      { id:'xc33', q:'What is the capital city of Myanmar (Burma)?', o:['Naypyidaw','Yangon','Mandalay','Bangkok'], a:'Naypyidaw' },
      { id:'xc34', q:'What is the capital city of Malaysia?', o:['Kuala Lumpur','Singapore','Jakarta','Penang'], a:'Kuala Lumpur' },
      { id:'xc35', q:'What is the capital city of the Philippines?', o:['Manila','Cebu','Davao','Quezon City'], a:'Manila' },
      { id:'xc36', q:'What is the capital city of Peru?', o:['Lima','Cusco','Bogot\u00E1','Quito'], a:'Lima' },
      { id:'xc37', q:'What is the capital city of Chile?', o:['Santiago','Valpara\u00EDso','Lima','Buenos Aires'], a:'Santiago' },
      { id:'xc38', q:'What is the capital city of Colombia?', o:['Bogot\u00E1','Medell\u00EDn','Lima','Caracas'], a:'Bogot\u00E1' },
      { id:'xc39', q:'What is the capital city of Ethiopia?', o:['Addis Ababa','Nairobi','Khartoum','Mogadishu'], a:'Addis Ababa' },
      { id:'xc40', q:'What is the capital city of Ghana?', o:['Accra','Lagos','Abuja','Dakar'], a:'Accra' },
      { id:'xc41', q:'What is the capital city of Morocco?', o:['Rabat','Casablanca','Marrakesh','Algiers'], a:'Rabat' },
      { id:'xc42', q:'What is the capital city of Poland?', o:['Warsaw','Krak\u00F3w','Prague','Budapest'], a:'Warsaw' },
      { id:'xc43', q:'What is the capital city of Portugal?', o:['Lisbon','Porto','Madrid','Barcelona'], a:'Lisbon' },
      { id:'xc44', q:'What is the capital city of Greece?', o:['Athens','Thessaloniki','Rome','Istanbul'], a:'Athens' },
      { id:'xc45', q:'What is the capital city of Ukraine?', o:['Kyiv','Lviv','Warsaw','Minsk'], a:'Kyiv' },
      { id:'xo10', q:'Which is the deepest ocean trench on Earth?', o:['Mariana Trench','Tonga Trench','Philippine Trench','Kermadec Trench'], a:'Mariana Trench' },
      { id:'xo11', q:'Which channel separates South America from Antarctica?', o:['Drake Passage','Bering Strait','Strait of Malacca','Florida Strait'], a:'Drake Passage' },
      { id:'xo12', q:'Which strait separates Africa from Europe?', o:['Strait of Gibraltar','Strait of Malacca','Bering Strait','Bosphorus'], a:'Strait of Gibraltar' },
      { id:'xo13', q:'Which sea is bordered by the Philippines, Malaysia, and Vietnam?', o:['South China Sea','Mediterranean Sea','Caribbean Sea','Arabian Sea'], a:'South China Sea' },
      { id:'xs08', q:'Which country is the only double-landlocked country in Europe?', o:['Liechtenstein','Luxembourg','Switzerland','Austria'], a:'Liechtenstein' },
      { id:'xs09', q:'Which country is home to the canal that links the Caribbean Sea and the Pacific Ocean?', o:['Panama','Costa Rica','Nicaragua','Guatemala'], a:'Panama' },
      { id:'xs10', q:'Which country is the only one in the world to border both the Caspian Sea and the Persian Gulf?', o:['Iran','Turkmenistan','Iraq','Azerbaijan'], a:'Iran' },
      { id:'xn09', q:'Which Canadian territory is the largest and most populous?', o:['Nunavut','Northwest Territories','Yukon','Alberta'], a:'Nunavut' }
    ]
  };

  window.GEO_TRIVIA = window.GEO_TRIVIA || { easy: [], medium: [], hard: [] };
  ['easy', 'medium', 'hard'].forEach(function (tier) {
    var list = EXTRA[tier] || [];
    for (var i = 0; i < list.length; i++) window.GEO_TRIVIA[tier].push(list[i]);
  });
})();
