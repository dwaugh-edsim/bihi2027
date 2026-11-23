// history_trivia.js - Canada at War, 20th-century conflict, and United Nations items (added 2026-11-23).
// Sources: Citizenship 9 Canada at War & Home Front Field Guide, Trace File 402 Rights Primer, and common Grade 9 history.
// Same item model as canada_trivia.js: { id, topic, q, o:[4 options], a }. topic is 'canada' (Canadian war and home front),
// 'culture' (20th-century world history) or 'facts' (UN and global bodies). IDs use the hs-prefix (hse/hsm/hsh) so they never collide.
// No em/en dashes anywhere (Room 8 projector rule). One item per line so tools-priv/trivia_bank_lint.py can parse it.
(function () {
  'use strict';

  var HISTORY = {
    easy: [
      { id:'hse01', topic:'culture', q:'World War I ended with an armistice in which year?', o:['1918','1914','1920','1925'], a:'1918' },
      { id:'hse02', topic:'canada', q:'On which date does Canada hold Remembrance Day each year?', o:['November 11','May 8','June 6','December 6'], a:'November 11' },
      { id:'hse03', topic:'canada', q:'Which flower do Canadians wear to remember soldiers who died in war?', o:['the poppy','the rose','the tulip','the daisy'], a:'the poppy' },
      { id:'hse04', topic:'canada', q:'Which famous 1917 battle in France is remembered as a defining moment for the Canadian Corps?', o:['Vimy Ridge','Dieppe','Juno Beach','Hong Kong'], a:'Vimy Ridge' },
      { id:'hse05', topic:'canada', q:'What name is given to the 1917 disaster in Halifax, when a ship loaded with explosives blew up in the harbour?', o:['the Halifax Explosion','the Great Halifax Fire','the Saxby Gale','the Citadel Blast'], a:'the Halifax Explosion' },
      { id:'hse06', topic:'canada', q:'Which Nova Scotia city was the Convoy Capital of World War II, where merchant ships gathered in Bedford Basin?', o:['Halifax','Sydney','Yarmouth','Truro'], a:'Halifax' },
      { id:'hse07', topic:'facts', q:'In which year was the United Nations founded, right after World War II?', o:['1945','1919','1939','1960'], a:'1945' },
      { id:'hse08', topic:'facts', q:'About how many countries belong to the United Nations today?', o:['193','50','100','250'], a:'193' },
      { id:'hse09', topic:'facts', q:'What colour are the helmets worn by United Nations peacekeepers?', o:['blue','green','white','red'], a:'blue' },
      { id:'hse10', topic:'culture', q:'Which two Japanese cities were hit by atomic bombs in August 1945?', o:['Hiroshima and Nagasaki','Tokyo and Osaka','Kyoto and Kobe','Nagoya and Sapporo'], a:'Hiroshima and Nagasaki' },
      { id:'hse11', topic:'culture', q:'During the Holocaust, Nazi Germany murdered about six million people from which group?', o:['Jewish people','Polish soldiers','Catholic priests','Russian workers'], a:'Jewish people' },
      { id:'hse12', topic:'canada', q:'From 1950 to 1953, about 26,000 Canadians served in which war, fought in the mountains of Asia?', o:['the Korean War','the Boer War','the Vietnam War','the Gulf War'], a:'the Korean War' },
      { id:'hse13', topic:'culture', q:'The Cold War was a tense rivalry between the United States and which other superpower?', o:['the Soviet Union','Nazi Germany','Imperial Japan','Italy'], a:'the Soviet Union' },
      { id:'hse14', topic:'culture', q:'At what time on November 11, 1918, did the World War I armistice take effect?', o:['11:00 AM','12:00 noon','6:00 AM','midnight'], a:'11:00 AM' },
      { id:'hse15', topic:'canada', q:'Which Canadian doctor wrote the famous war poem In Flanders Fields?', o:['John McCrae','Robert Service','Stephen Leacock','Alexander Graham Bell'], a:'John McCrae' },
      { id:'hse16', topic:'culture', q:'In World War I, soldiers on the Western Front lived and fought in long ditches called what?', o:['trenches','bunkers','tunnels','fortresses'], a:'trenches' },
      { id:'hse17', topic:'canada', q:'In World War II, Canadian ships helped guard convoys crossing which ocean to Britain?', o:['Atlantic Ocean','Pacific Ocean','Indian Ocean','Arctic Ocean'], a:'Atlantic Ocean' },
      { id:'hse18', topic:'facts', q:'The United Nations agency called UNICEF works mainly to help which group of people?', o:['children','soldiers','farmers','pilots'], a:'children' },
    ],
    medium: [
      { id:'hsm01', topic:'culture', q:'Which country invaded Poland in September 1939, starting World War II in Europe?', o:['Germany','Italy','the Soviet Union','Japan'], a:'Germany' },
      { id:'hsm02', topic:'culture', q:'The 1914 assassination of Archduke Franz Ferdinand, which set off World War I, took place in which city?', o:['Sarajevo','Vienna','Berlin','Belgrade'], a:'Sarajevo' },
      { id:'hsm03', topic:'culture', q:'In World War I, Germany fought alongside which empire as part of the Central Powers?', o:['Austria-Hungary','Great Britain','Russia','Belgium'], a:'Austria-Hungary' },
      { id:'hsm04', topic:'canada', q:'Chlorine poison gas was first used against Canadian soldiers at which 1915 battle?', o:['Second Battle of Ypres','Battle of the Somme','Battle of Vimy Ridge','Battle of Passchendaele'], a:'Second Battle of Ypres' },
      { id:'hsm05', topic:'canada', q:'Which munitions ship exploded in Halifax Harbour on December 6, 1917?', o:['Mont-Blanc','Imo','Bluenose','Titanic'], a:'Mont-Blanc' },
      { id:'hsm06', topic:'canada', q:'Which railway telegraph operator stayed at his post to warn trains away from Halifax after the 1917 explosion?', o:['Vince Coleman','Joseph Howe','Samuel Cunard','Alexander Graham Bell'], a:'Vince Coleman' },
      { id:'hsm07', topic:'canada', q:'Which American city rushed relief trains through a blizzard to Halifax after the 1917 explosion?', o:['Boston','New York','Philadelphia','Portland'], a:'Boston' },
      { id:'hsm08', topic:'canada', q:'About how many Canadians were killed in World War I?', o:['about 66,000','about 6,000','about 660,000','about 2 million'], a:'about 66,000' },
      { id:'hsm09', topic:'canada', q:'About how many Canadians were killed in World War II?', o:['about 45,000','about 4,500','about 450,000','about 1 million'], a:'about 45,000' },
      { id:'hsm10', topic:'canada', q:'In December 1941, Canadian soldiers defended Hong Kong against an invasion by which country?', o:['Japan','Germany','Italy','China'], a:'Japan' },
      { id:'hsm11', topic:'canada', q:'In 1942, Canada used the War Measures Act to move more than 22,000 mostly Canadian-born people away from the BC coast. Which community was targeted?', o:['Japanese Canadians','German Canadians','Italian Canadians','Ukrainian Canadians'], a:'Japanese Canadians' },
      { id:'hsm12', topic:'culture', q:'Adolf Hitler used German anger over which 1919 peace treaty to rise to power?', o:['the Treaty of Versailles','the Treaty of Paris','the Treaty of Utrecht','the Treaty of Ghent'], a:'the Treaty of Versailles' },
      { id:'hsm13', topic:'culture', q:'The surprise attack on Pearl Harbor on December 7, 1941, took place in which US state?', o:['Hawaii','California','Alaska','Florida'], a:'Hawaii' },
      { id:'hsm14', topic:'culture', q:'Which country dropped the atomic bombs on Hiroshima and Nagasaki in 1945?', o:['the United States','Canada','Great Britain','the Soviet Union'], a:'the United States' },
      { id:'hsm15', topic:'canada', q:'The uranium used in the first atomic bombs came partly from Great Bear Lake in which Canadian territory?', o:['the Northwest Territories','Yukon','Nunavut','Labrador'], a:'the Northwest Territories' },
      { id:'hsm16', topic:'facts', q:'Which United Nations body is the only one that can pass binding orders, such as sanctions or sending peacekeepers?', o:['the Security Council','the General Assembly','the Secretariat','the World Health Assembly'], a:'the Security Council' },
      { id:'hsm17', topic:'facts', q:'How many permanent members, each holding a veto, does the UN Security Council have?', o:['5','3','10','15'], a:'5' },
      { id:'hsm18', topic:'facts', q:'Which of these countries is NOT a permanent member of the UN Security Council?', o:['Germany','France','China','Russia'], a:'Germany' },
      { id:'hsm19', topic:'culture', q:'North Korea and South Korea are divided near which line of latitude?', o:['the 38th parallel','the 49th parallel','the 17th parallel','the 60th parallel'], a:'the 38th parallel' },
      { id:'hsm20', topic:'canada', q:'Canadians held Hill 677 against huge odds at which April 1951 battle in the Korean War?', o:['Kapyong','Inchon','Pusan','Panmunjom'], a:'Kapyong' },
      { id:'hsm21', topic:'culture', q:'After the September 11, 2001 attacks, NATO invoked which Article for the first time, meaning an attack on one is an attack on all?', o:['Article 5','Article 1','Article 9','Article 15'], a:'Article 5' },
      { id:'hsm22', topic:'canada', q:'Canada\u2019s soldiers in the war in Afghanistan were based mainly in which province?', o:['Kandahar','Kabul','Helmand','Herat'], a:'Kandahar' },
      { id:'hsm23', topic:'canada', q:'Which Canadian general commanded the UN force in Rwanda in 1994 and begged the world to send help?', o:['Rom\u00E9o Dallaire','Rick Hillier','Lewis MacKenzie','Arthur Currie'], a:'Rom\u00E9o Dallaire' },
      { id:'hsm24', topic:'facts', q:'In 1956, Lester B. Pearson proposed the first UN peacekeeping force to end which crisis over Egypt\u2019s canal?', o:['the Suez Crisis','the Cuban Missile Crisis','the Berlin Airlift','the Gulf War'], a:'the Suez Crisis' },
      { id:'hsm25', topic:'canada', q:'Canadian peacekeepers in Cyprus patrolled a buffer zone known as what?', o:['the Green Line','the Maginot Line','the Iron Curtain','the Siegfried Line'], a:'the Green Line' },
      { id:'hsm26', topic:'culture', q:'In which year was the Berlin Wall built, splitting the city between East and West?', o:['1961','1945','1975','1989'], a:'1961' },
      { id:'hsm27', topic:'canada', q:'What was the name of Canada\u2019s all-Black World War I unit, formed in 1916 and based in Pictou and Halifax?', o:['No. 2 Construction Battalion','the Black Watch','the Royal 22nd Regiment','the Nova Scotia Highlanders'], a:'No. 2 Construction Battalion' },
      { id:'hsm28', topic:'facts', q:'How many articles (rights) are in the Universal Declaration of Human Rights?', o:['30','10','50','193'], a:'30' },
      { id:'hsm29', topic:'facts', q:'How many countries sit on the UN Security Council in total?', o:['15','5','10','193'], a:'15' },
      { id:'hsm30', topic:'facts', q:'Which Bangladesh garment factory building collapsed in 2013, killing more than 1,100 workers?', o:['Rana Plaza','Tazreen Fashions','Triangle Shirtwaist','Bhopal Plant'], a:'Rana Plaza' },
      { id:'hsm31', topic:'canada', q:'On D-Day, June 6, 1944, Canadian troops landed on which beach in Normandy, France?', o:['Juno Beach','Omaha Beach','Utah Beach','Gold Beach'], a:'Juno Beach' },
      { id:'hsm32', topic:'canada', q:'In which year did Canada\u2019s Parliament vote on its own to declare war on Germany, separate from Britain?', o:['1939','1914','1941','1945'], a:'1939' },
      { id:'hsm33', topic:'facts', q:'Which Canadian diplomat won the 1957 Nobel Peace Prize for the idea of UN peacekeepers?', o:['Lester B. Pearson','Pierre Trudeau','John Diefenbaker','Louis St. Laurent'], a:'Lester B. Pearson' },
    ],
    hard: [
      { id:'hsh01', topic:'canada', q:'Which Anishinaabe soldier from Parry Island became one of Canada\u2019s most decorated snipers and scouts in World War I?', o:['Francis Pegahmagabow','Tommy Prince','Joseph Brant','Louis Riel'], a:'Francis Pegahmagabow' },
      { id:'hsh02', topic:'canada', q:'Tommy Prince, with 11 medals, was one of Canada\u2019s most decorated Indigenous soldiers. He served in World War II and which later war?', o:['the Korean War','the Vietnam War','the Boer War','the Gulf War'], a:'the Korean War' },
      { id:'hsh03', topic:'canada', q:'Although many served in the world wars, First Nations veterans were denied the federal vote until which year?', o:['1960','1918','1945','1982'], a:'1960' },
      { id:'hsh04', topic:'canada', q:'In 2022, the Prime Minister apologized in which Nova Scotia town for anti-Black racism faced by No. 2 Construction Battalion?', o:['Truro','Pictou','Halifax','Sydney'], a:'Truro' },
      { id:'hsh05', topic:'canada', q:'In 1942 a German U-boat sank which passenger ferry in the Cabot Strait, killing 137 people?', o:['SS Caribou','SS Imo','SS Mont-Blanc','SS Nova Scotian'], a:'SS Caribou' },
      { id:'hsh06', topic:'canada', q:'After victory in Europe in May 1945, which Canadian city saw riots, with shops smashed along Barrington Street?', o:['Halifax','Montreal','Toronto','Vancouver'], a:'Halifax' },
      { id:'hsh07', topic:'canada', q:'In July 1945, a fire at Halifax Harbour\u2019s Magazine Hill set off depth charges and torpedoes for 24 hours. What is this event called?', o:['the Bedford Magazine Explosion','the Halifax Explosion','the Dartmouth Blast','the Citadel Fire'], a:'the Bedford Magazine Explosion' },
      { id:'hsh08', topic:'canada', q:'At Kapyong in 1951, a Canadian battalion called artillery fire onto its own position to hold the ridge. Which regiment was it?', o:['Princess Patricia\u2019s Canadian Light Infantry','Royal 22e R\u00E9giment','the Black Watch','the Canadian Grenadier Guards'], a:'Princess Patricia\u2019s Canadian Light Infantry' },
      { id:'hsh09', topic:'canada', q:'At the 1993 Medak Pocket battle in Croatia, Canadian peacekeepers fought their biggest battle since which earlier war?', o:['the Korean War','World War II','the Gulf War','the Afghanistan War'], a:'the Korean War' },
      { id:'hsh10', topic:'canada', q:'Which Nova Scotia town was home to Private Nathan Smith, killed at Tarnak Farm in Afghanistan in 2002?', o:['Tatamagouche','Antigonish','Amherst','Digby'], a:'Tatamagouche' },
      { id:'hsh11', topic:'canada', q:'How many Canadian soldiers were killed in the war in Afghanistan?', o:['158','58','258','1,580'], a:'158' },
      { id:'hsh12', topic:'culture', q:'About how many people were murdered during the 100 days of the 1994 genocide in Rwanda?', o:['about 800,000','about 8,000','about 80,000','about 8 million'], a:'about 800,000' },
      { id:'hsh13', topic:'canada', q:'Even after the UN ordered him to leave Rwanda, General Dallaire stayed and helped save roughly how many people?', o:['about 32,000','about 320','about 3,200','about 320,000'], a:'about 32,000' },
      { id:'hsh14', topic:'facts', q:'In which year was NATO founded, with Canada as a founding member?', o:['1949','1939','1955','1961'], a:'1949' },
      { id:'hsh15', topic:'facts', q:'In which city did the UN General Assembly adopt the Universal Declaration of Human Rights in 1948?', o:['Paris','New York','Geneva','London'], a:'Paris' },
      { id:'hsh16', topic:'facts', q:'Which Canadian lawyer wrote the first draft of the Universal Declaration of Human Rights?', o:['John Peters Humphrey','Lester B. Pearson','Tommy Douglas','Pierre Trudeau'], a:'John Peters Humphrey' },
      { id:'hsh17', topic:'canada', q:'About how many Canadians defended Hong Kong in December 1941 before being killed or captured?', o:['nearly 2,000','about 200','about 20,000','about 200,000'], a:'nearly 2,000' },
      { id:'hsh18', topic:'canada', q:'In the Battle of the Atlantic, convoys were most at risk in a mid-ocean stretch beyond aircraft range. What was it called?', o:['the air gap','the U-boat line','the Maginot Line','the neutral strait'], a:'the air gap' },
      { id:'hsh19', topic:'culture', q:'Canadian soldiers at Passchendaele in 1917 are remembered for fighting through what terrible conditions?', o:['deep mud','desert heat','blizzards','dense jungle'], a:'deep mud' },
      { id:'hsh20', topic:'culture', q:'In 1956, Britain, France, and which other country invaded Egypt during the Suez Crisis?', o:['Israel','Jordan','Turkey','Italy'], a:'Israel' },
      { id:'hsh21', topic:'culture', q:'In 1962, a Cold War crisis nearly caused nuclear war over Soviet missiles placed in which country?', o:['Cuba','Mexico','Brazil','Venezuela'], a:'Cuba' },
      { id:'hsh22', topic:'culture', q:'The Nazi camp at Auschwitz-Birkenau, now a memorial and museum, is located in which country today?', o:['Poland','Germany','Austria','Hungary'], a:'Poland' },
    ]
  };

  window.GEO_TRIVIA = window.GEO_TRIVIA || { easy: [], medium: [], hard: [] };
  ['easy', 'medium', 'hard'].forEach(function (tier) {
    var list = HISTORY[tier] || [];
    for (var i = 0; i < list.length; i++) window.GEO_TRIVIA[tier].push(list[i]);
  });
})();
