// canada_trivia.js - 77 Canadian geography and history items (added 2026-11-19).
// Ages 13-15. Same item model as trivia_extra.js: { id, q, o:[4 options], a, topic }.
// Every item carries topic:'canada' so it joins the Canada Pass topic and flows
// into mixed rounds. No em/en dashes anywhere (Room 8 projector rule). IDs use the
// cn-prefix (cne/cnm/cnh) so they never collide with e/m/h (trivia_90.js) or x
// (trivia_extra.js) items.
(function () {
  'use strict';

  var CANADA = {
    easy: [
      { id:'cne01', q:'Which ocean lies to the east of Canada?', o:['Atlantic Ocean','Pacific Ocean','Arctic Ocean','Indian Ocean'], a:'Atlantic Ocean', topic:'canada' },
      { id:'cne02', q:'Which ocean lies along Canada\u2019s northern coast?', o:['Arctic Ocean','Atlantic Ocean','Pacific Ocean','Indian Ocean'], a:'Arctic Ocean', topic:'canada' },
      { id:'cne03', q:'Which ocean lies off the west coast of British Columbia?', o:['Pacific Ocean','Atlantic Ocean','Arctic Ocean','Southern Ocean'], a:'Pacific Ocean', topic:'canada' },
      { id:'cne04', q:'Which Canadian city has the most people?', o:['Toronto','Montreal','Vancouver','Calgary'], a:'Toronto', topic:'canada' },
      { id:'cne05', q:'What is the capital city of Nova Scotia?', o:['Halifax','Sydney','Truro','Yarmouth'], a:'Halifax', topic:'canada' },
      { id:'cne06', q:'The Cabot Trail, one of the world\u2019s great scenic drives, loops around which island?', o:['Cape Breton Island','Vancouver Island','Prince Edward Island','Baffin Island'], a:'Cape Breton Island', topic:'canada' },
      { id:'cne07', q:'The Bay of Fundy, between Nova Scotia and New Brunswick, is famous for the world\u2019s highest what?', o:['tides','waves','sand dunes','cliffs'], a:'tides', topic:'canada' },
      { id:'cne08', q:'The Confederation Bridge connects Prince Edward Island to which province?', o:['New Brunswick','Nova Scotia','Quebec','Manitoba'], a:'New Brunswick', topic:'canada' },
      { id:'cne09', q:'Which of these provinces is NOT one of the Prairie provinces?', o:['British Columbia','Alberta','Saskatchewan','Manitoba'], a:'British Columbia', topic:'canada' },
      { id:'cne10', q:'What is Canada\u2019s national winter sport?', o:['Ice hockey','Curling','Skiing','Lacrosse'], a:'Ice hockey', topic:'canada' },
      { id:'cne11', q:'What is the nickname of Canada\u2019s one-dollar coin, which shows a swimming loon?', o:['the loonie','the mapleback','the beaver buck','the voyageur'], a:'the loonie', topic:'canada' },
      { id:'cne12', q:'Which Canadian hero, having lost a leg to cancer, began the cross-country Marathon of Hope in 1980?', o:['Terry Fox','Rick Hansen','Wayne Gretzky','David Suzuki'], a:'Terry Fox', topic:'canada' },
      { id:'cne13', q:'In which year did Canada become a country, with the passing of the British North America Act?', o:['1867','1763','1901','1949'], a:'1867', topic:'canada' },
      { id:'cne14', q:'Who was Canada\u2019s first Prime Minister?', o:['Sir John A. Macdonald','Sir Wilfrid Laurier','George-\u00C9tienne Cartier','William Lyon Mackenzie King'], a:'Sir John A. Macdonald', topic:'canada' },
      { id:'cne15', q:'What is the title of Canada\u2019s national anthem?', o:['O Canada','The Maple Leaf Forever','God Save the King','Four Strong Winds'], a:'O Canada', topic:'canada' },
      { id:'cne16', q:'How many points does the maple leaf on the Canadian flag have?', o:['11','7','10','13'], a:'11', topic:'canada' },
      { id:'cne17', q:'Which province has the largest population?', o:['Ontario','Quebec','British Columbia','Alberta'], a:'Ontario', topic:'canada' },
      { id:'cne18', q:'Where does Canada rank among the world\u2019s countries by land area?', o:['2nd largest','1st largest','3rd largest','4th largest'], a:'2nd largest', topic:'canada' },
      { id:'cne19', q:'At L\u2019Anse aux Meadows, archaeologists found evidence of Vikings who arrived around 1000 AD. In which province is it?', o:['Newfoundland and Labrador','Nova Scotia','Nunavut','British Columbia'], a:'Newfoundland and Labrador', topic:'canada' },
      { id:'cne20', q:'The famous 1890s Klondike Gold Rush drew tens of thousands of miners to which territory?', o:['Yukon','British Columbia','the Northwest Territories','Alberta'], a:'Yukon', topic:'canada' },
      { id:'cne21', q:'In the 1800s, what secret network helped people escape slavery in the United States to freedom in Canada?', o:['the Underground Railroad','the Freedom Trail','the North Star Line','the Midnight Express'], a:'the Underground Railroad', topic:'canada' },
      { id:'cne22', q:'The CN Tower, the world\u2019s tallest tower when it was built in 1976, stands in which city?', o:['Toronto','Montreal','Vancouver','Edmonton'], a:'Toronto', topic:'canada' },
      { id:'cne23', q:'What is the capital city of Ontario?', o:['Toronto','Ottawa','Hamilton','London'], a:'Toronto', topic:'canada' },
      { id:'cne24', q:'What is the capital city of Quebec?', o:['Quebec City','Montreal','Gatineau','Sherbrooke'], a:'Quebec City', topic:'canada' },

    ],
    medium: [
      { id:'cnm01', q:'What is the capital city of Alberta?', o:['Edmonton','Calgary','Red Deer','Lethbridge'], a:'Edmonton', topic:'canada' },
      { id:'cnm02', q:'What is the capital city of Saskatchewan?', o:['Regina','Saskatoon','Moose Jaw','Prince Albert'], a:'Regina', topic:'canada' },
      { id:'cnm03', q:'What is the capital city of Manitoba?', o:['Winnipeg','Brandon','Churchill','Steinbach'], a:'Winnipeg', topic:'canada' },
      { id:'cnm04', q:'What is the capital city of New Brunswick?', o:['Fredericton','Moncton','Saint John','Bathurst'], a:'Fredericton', topic:'canada' },
      { id:'cnm05', q:'What is the capital city of Newfoundland and Labrador?', o:['St. John\u2019s','Corner Brook','Gander','Happy Valley-Goose Bay'], a:'St. John\u2019s', topic:'canada' },
      { id:'cnm06', q:'What is the capital city of Yukon?', o:['Whitehorse','Dawson City','Watson Lake','Mayo'], a:'Whitehorse', topic:'canada' },
      { id:'cnm07', q:'What is the capital city of the Northwest Territories?', o:['Yellowknife','Inuvik','Hay River','Fort Smith'], a:'Yellowknife', topic:'canada' },
      { id:'cnm08', q:'What is the capital city of Nunavut?', o:['Iqaluit','Rankin Inlet','Cambridge Bay','Arviat'], a:'Iqaluit', topic:'canada' },
      { id:'cnm09', q:'Which pair of provinces is completely landlocked, with no ocean coastline?', o:['Alberta and Saskatchewan','Alberta and Manitoba','Saskatchewan and Manitoba','Manitoba and Ontario'], a:'Alberta and Saskatchewan', topic:'canada' },
      { id:'cnm10', q:'Which river, flowing north to the Arctic Ocean, is Canada\u2019s longest river?', o:['the Mackenzie River','the St. Lawrence River','the Fraser River','the Yukon River'], a:'the Mackenzie River', topic:'canada' },
      { id:'cnm11', q:'The Group of Seven, famous in the 1920s for painting rugged Canadian landscapes, were what?', o:['painters','hockey players','architects','explorers'], a:'painters', topic:'canada' },
      { id:'cnm12', q:'In December 1917, a wartime ship collision caused the largest human-made explosion the world had yet seen, in which city?', o:['Halifax','Saint John','St. John\u2019s','Quebec City'], a:'Halifax', topic:'canada' },
      { id:'cnm13', q:'Which First World War battle of April 1917 is remembered as the moment Canada fought together as one nation for the first time?', o:['Vimy Ridge','the Battle of the Somme','the Battle of Gettysburg','the D-Day landings'], a:'Vimy Ridge', topic:'canada' },
      { id:'cnm14', q:'Which beach did Canadian soldiers storm on D-Day, June 6, 1944?', o:['Juno Beach','Omaha Beach','Utah Beach','Sword Beach'], a:'Juno Beach', topic:'canada' },
      { id:'cnm15', q:'In 1814, during the War of 1812, British troops burned which American government building in Washington?', o:['the White House','Independence Hall','the Liberty Bell','Monticello'], a:'the White House', topic:'canada' },
      { id:'cnm16', q:'Which French explorer was the first European to sail into the Gulf of St. Lawrence, in 1534?', o:['Jacques Cartier','Samuel de Champlain','John Cabot','Henry Hudson'], a:'Jacques Cartier', topic:'canada' },
      { id:'cnm17', q:'Which city did Samuel de Champlain found in 1608, making it one of the oldest European settlements in North America?', o:['Quebec City','Montreal','Trois-Rivi\u00E8res','Halifax'], a:'Quebec City', topic:'canada' },
      { id:'cnm18', q:'Which national park, in the Rocky Mountains of Alberta, was Canada\u2019s first, created in 1885?', o:['Banff','Jasper','Yoho','Algonquin'], a:'Banff', topic:'canada' },
      { id:'cnm19', q:'Which railway was completed in 1885, linking British Columbia with the rest of Canada?', o:['the Canadian Pacific Railway','the Intercolonial Railway','the Grand Trunk Railway','the Union Pacific Railway'], a:'the Canadian Pacific Railway', topic:'canada' },
      { id:'cnm20', q:'Which province joined Canada last, in 1949?', o:['Newfoundland','Prince Edward Island','British Columbia','Saskatchewan'], a:'Newfoundland', topic:'canada' },
      { id:'cnm21', q:'How many time zones does Canada span?', o:['6','4','5','7'], a:'6', topic:'canada' },
      { id:'cnm22', q:'Which province keeps its own time zone, half an hour ahead of Atlantic Time?', o:['Newfoundland','Nova Scotia','Prince Edward Island','Quebec'], a:'Newfoundland', topic:'canada' },
      { id:'cnm23', q:'Which province produces about three-quarters of the world\u2019s maple syrup?', o:['Quebec','Ontario','New Brunswick','Nova Scotia'], a:'Quebec', topic:'canada' },
      { id:'cnm24', q:'The famous Nova Scotia racing schooner Bluenose appears on which Canadian coin?', o:['the dime (10 cents)','the nickel (5 cents)','the quarter (25 cents)','the toonie ($2)'], a:'the dime (10 cents)', topic:'canada' },
      { id:'cnm25', q:'Which Canadian doctor wrote the poem In Flanders Fields in 1915?', o:['John McCrae','Laura Secord','Pauline Johnson','Emily Carr'], a:'John McCrae', topic:'canada' },
      { id:'cnm26', q:'The name Canada comes from kanata, an Indigenous (St. Lawrence Iroquoian) word meaning what?', o:['village','big river','north land','golden land'], a:'village', topic:'canada' },
      { id:'cnm27', q:'Which Great Lake is the only one that touches no Canadian territory?', o:['Lake Michigan','Lake Erie','Lake Huron','Lake Ontario'], a:'Lake Michigan', topic:'canada' },
      { id:'cnm28', q:'Which Great Lake is the largest in the world by surface area?', o:['Lake Superior','Lake Huron','Lake Michigan','Lake Erie'], a:'Lake Superior', topic:'canada' },
      { id:'cnm29', q:'Which river carries water from the Great Lakes to the Atlantic Ocean?', o:['the St. Lawrence River','the Mackenzie River','the Fraser River','the Nelson River'], a:'the St. Lawrence River', topic:'canada' },
      { id:'cnm30', q:'Which city, known as the Birthplace of Confederation, hosted the 1864 conference that started Canada on the road to nationhood?', o:['Charlottetown','Halifax','Quebec City','Ottawa'], a:'Charlottetown', topic:'canada' },
      { id:'cnm31', q:'Much of the border between western Canada and the United States follows which line of latitude?', o:['the 49th parallel','the 45th parallel','the 55th parallel','the 60th parallel'], a:'the 49th parallel', topic:'canada' },
      { id:'cnm32', q:'The vast rocky region of ancient rock, forests and lakes that covers about half of Canada is called what?', o:['the Canadian Shield','the Great Plains','the Cordillera','the Arctic Lowlands'], a:'the Canadian Shield', topic:'canada' },
      { id:'cnm33', q:'What do we call ground that stays frozen all year round in Canada\u2019s North?', o:['permafrost','tundra','taiga','a glacier'], a:'permafrost', topic:'canada' },
      { id:'cnm34', q:'Which sport is Canada\u2019s official national SUMMER sport (hockey is the winter one)?', o:['lacrosse','soccer','curling','rowing'], a:'lacrosse', topic:'canada' },
      { id:'cnm35', q:'What is the capital city of British Columbia?', o:['Victoria','Vancouver','Kelowna','Kamloops'], a:'Victoria', topic:'canada' },
      { id:'cnm36', q:'What is the capital city of Prince Edward Island?', o:['Charlottetown','Summerside','Stratford','Cornwall'], a:'Charlottetown', topic:'canada' },

    ],
    hard: [
      { id:'cnh01', q:'Mount Logan, Canada\u2019s highest mountain at almost 6,000 metres, stands in which territory?', o:['Yukon','the Northwest Territories','Nunavut','British Columbia'], a:'Yukon', topic:'canada' },
      { id:'cnh02', q:'Great Bear Lake, the largest lake entirely inside Canada, lies mostly in which territory?', o:['the Northwest Territories','Nunavut','Yukon','Manitoba'], a:'the Northwest Territories', topic:'canada' },
      { id:'cnh03', q:'Which lake, in the Northwest Territories, is Canada\u2019s deepest at over 600 metres?', o:['Great Slave Lake','Great Bear Lake','Lake Superior','Lake Winnipeg'], a:'Great Slave Lake', topic:'canada' },
      { id:'cnh04', q:'In 2022, Canada and which country agreed to split tiny Hans Island in the Arctic, ending a 50-year friendly dispute?', o:['Denmark','Norway','Iceland','Russia'], a:'Denmark', topic:'canada' },
      { id:'cnh05', q:'Canada\u2019s coldest temperature ever recorded (-63\u00B0C in 1947) was measured at Snag, in which territory?', o:['Yukon','the Northwest Territories','Nunavut','northern Manitoba'], a:'Yukon', topic:'canada' },
      { id:'cnh06', q:'Which Canadian territory, carved out of the Northwest Territories, was created in 1999?', o:['Nunavut','Yukon','Labrador','the Northwest Territories'], a:'Nunavut', topic:'canada' },
      { id:'cnh07', q:'Which group of women won the 1929 Persons Case, confirming that women could be appointed to the Senate?', o:['the Famous Five','the Group of Seven','the Big Five','the Famous Six'], a:'the Famous Five', topic:'canada' },
      { id:'cnh08', q:'In which year were Canadian women first allowed to vote in federal elections?', o:['1918','1901','1921','1945'], a:'1918', topic:'canada' },
      { id:'cnh09', q:'Which M\u00E9tis leader was executed in 1885 after leading the North-West Resistance on the Prairies?', o:['Louis Riel','Gabriel Dumont','Big Bear','Sir John A. Macdonald'], a:'Louis Riel', topic:'canada' },
      { id:'cnh10', q:'Which young mother walked through the woods in June 1813 to warn British troops of an American attack near Beaver Dams?', o:['Laura Secord','Molly Brant','Emily Stowe','Susanna Moodie'], a:'Laura Secord', topic:'canada' },
      { id:'cnh11', q:'In which year did Canada gain full control of its own constitution, adding the Charter of Rights and Freedoms?', o:['1982','1867','1931','1965'], a:'1982', topic:'canada' },
      { id:'cnh12', q:'What does Canada\u2019s national motto, A Mari Usque Ad Mare, mean?', o:['From sea to sea','Strong and free','Peace, order, and good government','One land, many peoples'], a:'From sea to sea', topic:'canada' },
      { id:'cnh13', q:'Which Halifax waterfront gateway welcomed over a million immigrants arriving by ship between 1928 and 1971?', o:['Pier 21','Peggy\u2019s Cove','the Halifax Citadel','the Maritime Museum'], a:'Pier 21', topic:'canada' },
      { id:'cnh14', q:'On September 11, 2001, 38 airliners landed unexpectedly at which Newfoundland town, whose residents welcomed about 7,000 stranded passengers?', o:['Gander','St. John\u2019s','Corner Brook','Happy Valley-Goose Bay'], a:'Gander', topic:'canada' },
      { id:'cnh15', q:'People from Nova Scotia carry a nickname taken from a famous racing schooner. What is it?', o:['Bluenose','Foghorn','Saltshaker','Icebreaker'], a:'Bluenose', topic:'canada' },
      { id:'cnh16', q:'Which British Columbia archipelago was officially renamed from the Queen Charlotte Islands in 2010, returning to its Haida name?', o:['Haida Gwaii','Vancouver Island','the Gulf Islands','the Discovery Islands'], a:'Haida Gwaii', topic:'canada' },
      { id:'cnh17', q:'Which highway, running through all ten provinces, is often called the longest national highway in the world?', o:['the Trans-Canada Highway','the Yellowhead Route','the MacDonald-Cartier Freeway','the Great Trail'], a:'the Trans-Canada Highway', topic:'canada' },
      { id:'cnh18', q:'Who was Canada\u2019s first (and so far only) female Prime Minister?', o:['Kim Campbell','Jeanne Sauv\u00E9','Adrienne Clarkson','Agnes Macphail'], a:'Kim Campbell', topic:'canada' },
      { id:'cnh19', q:'The 1759 Battle of the Plains of Abraham, where British forces defeated the French, took place just outside which city?', o:['Quebec City','Montreal','Louisbourg','Halifax'], a:'Quebec City', topic:'canada' },
      { id:'cnh20', q:'Wasaga Beach on Georgian Bay, often called the world\u2019s longest freshwater beach, is in which province?', o:['Ontario','British Columbia','Quebec','Manitoba'], a:'Ontario', topic:'canada' },
      { id:'cnh21', q:'Which body of water separates Cape Breton Island from mainland Nova Scotia?', o:['the Strait of Canso','the Northumberland Strait','the Cabot Strait','the Minas Basin'], a:'the Strait of Canso', topic:'canada' },
      { id:'cnh22', q:'Which narrow strip of land connects peninsular Nova Scotia to New Brunswick?', o:['the Chignecto Isthmus','the Strait of Canso','the Minas Basin','the Cabot Trail'], a:'the Chignecto Isthmus', topic:'canada' },
    ]
  };

  window.GEO_TRIVIA = window.GEO_TRIVIA || { easy: [], medium: [], hard: [] };
  ['easy', 'medium', 'hard'].forEach(function (tier) {
    var list = CANADA[tier] || [];
    for (var i = 0; i < list.length; i++) window.GEO_TRIVIA[tier].push(list[i]);
  });
})();
