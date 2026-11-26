/* Country Profile Project 2026-27 - topic gallery data.
   Citizenship 9, Term 2 project.
   Flags: local circle-flags SVGs (hatscripts/circle-flags, MIT).
   Each topic: region, issue, three research questions,
   one "start here" source pointer. */

const TOPICS = [
  { id: 1,  country: "Australia",     iso: "au", region: "Oceania", issue: "Climate Change & Wildfires",
    tnc: "BHP & Glencore: multinational mining giants operating huge coal mines in Australia, sitting at the centre of debates over Australia's climate policy and fossil-fuel exports.",
    qs: "What has changed about Australian fire seasons? What did the 2019-20 bushfire royal commission recommend, and what was actually done? Who opposes climate policy there, and why?",
    src: "Start: Australian Government Climate Change reports + the 2020 Royal Commission into National Natural Disaster Arrangements." },
  { id: 2,  country: "Brazil",        iso: "br", region: "Americas", issue: "Amazon Deforestation",
    tnc: "JBS & Cargill: the world's largest meatpacker (JBS) and major global soy trader (Cargill) have repeatedly faced investigations over cattle and soy linked to cleared Amazon forest.",
    qs: "What laws exist against deforestation and how are they enforced? Why do poor local farmers clear land, not just big companies? What did deforestation numbers do between 2019 and 2025, and which policies moved them?",
    src: "Start: INPE (Brazil's space agency) deforestation data + Reuters explainers on Amazon policy." },
  { id: 3,  country: "India",         iso: "in", region: "Asia", issue: "Air Pollution & Public Health",
    qs: "What causes Delhi's air crisis? What has the government actually done (odd-even schemes, AQI alerts, clean-air programs)? What does living in that air do to a person's health over 10 years?",
    src: "Start: live AQI maps (IQAir) + Lancet studies on air pollution deaths in India." },
  { id: 4,  country: "China",         iso: "cn", region: "Asia", issue: "Surveillance & Human Rights (Xinjiang)",
    tnc: "Hikvision & global fashion/solar supply chains (Shein, Zara/Inditex, Nike): Hikvision builds surveillance cameras (restricted in Canada and the US), while global brands face forced-labour audits including Canada's Supply Chains Act (Bill S-211).",
    qs: "What surveillance technology is used and how? What evidence exists about the treatment of Uyghurs? How have other countries responded, and what did China say in reply?",
    src: "Start: UN OHCHR 2022 Xinjiang assessment + BBC/Reuters investigations." },
  { id: 5,  country: "Ethiopia",      iso: "et", region: "Africa", issue: "Food Security & Conflict",
    qs: "How did the Tigray conflict turn into a hunger crisis? What role does climate (drought) play alongside war? What aid exists and what blocks it?",
    src: "Start: UN OCHA Ethiopia situation reports + World Food Programme pages." },
  { id: 6,  country: "Afghanistan",   iso: "af", region: "Asia", issue: "Women's Rights & Education",
    qs: "What rules has the Taliban imposed on girls' education since 2021? How have Afghan women resisted inside the country? What has the international response actually changed?",
    src: "Start: UNESCO reports on girls' education in Afghanistan + BBC coverage of women's protests." },
  { id: 7,  country: "Germany",       iso: "de", region: "Europe", issue: "Energy Transition (Energiewende)",
    tnc: "Gazprom, Siemens Energy & Volkswagen: cutting off Russian gas giant Gazprom after 2022 spiked energy costs for German manufacturers like Volkswagen and BASF while accelerating wind and solar buildout.",
    qs: "Why did Germany shut down its nuclear plants? What did the switch to renewables cost, and what unintended problems appeared (energy prices, gas dependence)? What can Canada learn from it?",
    src: "Start: Clean Energy Wire (CLEW) factsheets + IEA Germany country data." },
  { id: 8,  country: "South Africa",  iso: "za", region: "Africa", issue: "Income Inequality & Poverty",
    tnc: "Anglo American & Glencore: multinational mining corporations whose platinum, gold, and coal operations sit at the centre of South Africa's wage gap, labour disputes, and power-grid (load-shedding) struggles.",
    qs: "Why is South Africa one of the most unequal countries on Earth? What do social grants actually do for families? What is load-shedding, and how does it deepen poverty?",
    src: "Start: World Bank South Africa poverty overview + IMF Article IV reports." },
  { id: 9,  country: "Philippines",   iso: "ph", region: "Asia", issue: "Natural Disasters & Climate Resilience",
    tnc: "Shell, ExxonMobil, Chevron & BP: the Philippines Commission on Human Rights held a landmark 2022 inquiry ('Carbon Majors') examining whether global fossil-fuel companies share legal responsibility for worsening typhoon harm.",
    qs: "Why does the Philippines get hit by so many typhoons? What does its disaster agency do differently since Typhoon Haiyan (2013)? What has actually improved and what has not?",
    src: "Start: NDRRMC (Philippine disaster agency) reports + UNDRR case studies." },
  { id: 10, country: "United Kingdom", iso: "gb", region: "Europe", issue: "Refugee & Immigration Policy",
    qs: "What is the Rwanda deportation scheme and what happened to it? How many refugees does the UK actually accept? How do its policies compare with Canada's refugee system?",
    src: "Start: UK Home Office statistics + UNHCR commentary on UK asylum policy." },
  { id: 11, country: "Haiti",         iso: "ht", region: "Americas", issue: "Political Instability & Aid",
    qs: "How did the 2021 assassination and gang control collapse everyday life? Why has foreign aid not fixed it? What is the Kenya-led police mission and how is it going?",
    src: "Start: UN OCHA Haiti reports + IOM situation reports." },
  { id: 12, country: "Ukraine",       iso: "ua", region: "Europe", issue: "Conflict & International Relations",
    tnc: "Cargill, Bunge & SpaceX (Starlink): global grain traders saw Black Sea wheat exports disrupted (raising world food prices), while SpaceX's Starlink satellites became critical communications infrastructure during the war.",
    qs: "What has the war done to civilians since 2022? What has Canada given Ukraine, and why Canada specifically? What happens to grain, energy and refugees far from the battlefield?",
    src: "Start: UNHCR Ukraine data + Global Affairs Canada Ukraine support pages." },
  { id: 13, country: "Russia",        iso: "ru", region: "Europe", issue: "Freedom of Expression",
    tnc: "Meta (Instagram/Facebook), Alphabet (YouTube) & Telegram: Russia banned or throttled major global tech platforms to control war news, turning apps like Telegram and VPNs into key channels for independent reporting.",
    qs: "What happens to Russians who criticize the war? How does the state control news and the internet? What do journalists in exile do, and who reads them?",
    src: "Start: Reporters Without Borders Russia profile + BBC News Russian coverage." },
  { id: 14, country: "Myanmar",       iso: "mm", region: "Asia", issue: "Rohingya Refugee Crisis",
    tnc: "Meta (Facebook): UN investigators found Facebook played a major role in spreading anti-Rohingya hate speech in Myanmar, while oil giants Chevron and TotalEnergies faced pressure to exit the country.",
    qs: "What happened to the Rohingya in 2017 and after? Why has repatriation to Myanmar failed? What is life like in the Cox's Bazar camps, and whose problem is it now?",
    src: "Start: UNHCR Myanmar situation reports + International Court of Justice Rohingya case." },
  { id: 15, country: "Japan",         iso: "jp", region: "Asia", issue: "Aging Population & Social Policy",
    tnc: "Toyota & SoftBank: major Japanese multinationals investing in factory automation, elder-care robotics, and older-worker policies to keep operating as Japan's working-age population shrinks.",
    qs: "What happens to a country where more people are over 80 than under 15? What has Japan tried (robots, immigration, retirement changes)? Which of those could ever work in Canada?",
    src: "Start: Japan Statistics Bureau data + OECD Japan policy reviews." },
  { id: 16, country: "Bangladesh",    iso: "bd", region: "Asia", issue: "Textile Industry & Labour Rights",
    tnc: "Loblaw (Joe Fresh), H&M, Primark & Zara (Inditex): Canadian giant Loblaw had Joe Fresh clothing made inside the Rana Plaza factory when it collapsed in 2013, pushing global brands to sign the legally binding Bangladesh Accord on factory safety.",
    qs: "What changed after the Rana Plaza collapse (2013)? Who checks garment factories now, and does it work? What is the Accord and what did brands actually sign?",
    src: "Start: ILO Bangladesh reports + Clean Clothes Campaign." },
  { id: 17, country: "Somalia",       iso: "so", region: "Africa", issue: "Food Security & Drought",
    qs: "How many droughts has Somalia faced in one decade? Why does famine follow politics, not just rain? How do clan structures shape who gets help?",
    src: "Start: FEWS NET Somalia food security outlook + UN OCHA reports." },
  { id: 18, country: "Saudi Arabia",  iso: "sa", region: "Middle East", issue: "Women's Rights & Social Change",
    tnc: "Saudi Aramco & Uber: state oil giant Aramco funds Vision 2030 reforms, while ride-hailing TNC Uber (backed by Saudi Arabia's sovereign wealth fund) expanded rapidly as women gained the right to drive and enter the workforce.",
    qs: "What changed for women since 2018 (driving, guardianship rules)? What still restricts them, and what happened to the activists who campaigned for those changes? Is Vision 2030 reform real?",
    src: "Start: Amnesty International Saudi Arabia reports + Human Rights Watch women's rights pages." },
  { id: 19, country: "Mexico",        iso: "mx", region: "Americas", issue: "Drug Cartels & Public Safety",
    tnc: "US firearm manufacturers (Smith & Wesson, Glock, Barrett): Mexico's government sued major gunmakers in US courts, arguing cross-border gun trafficking fuels cartel violence.",
    qs: "Why did cartels get so powerful? What has the government tried, and what are the results? How does US demand and gun flow shape the violence?",
    src: "Start: International Crisis Group Mexico reports + UNODC data." },
  { id: 20, country: "Nigeria",       iso: "ng", region: "Africa", issue: "Oil Production & Environmental Damage",
    tnc: "Shell, Chevron & ExxonMobil: Shell operated for decades in Nigeria's Niger Delta (Ogoniland), facing landmark court rulings in the UK and Netherlands over oil spills and cleanup obligations.",
    qs: "What has oil done to the Niger Delta's land and water? Who profits from Nigerian oil and who does not? What did cleanup programs actually deliver?",
    src: "Start: UNEP Ogoniland assessment + Amnesty International Nigeria pages." },
  { id: 21, country: "Yemen",         iso: "ye", region: "Middle East", issue: "Humanitarian Crisis & Conflict",
    tnc: "General Dynamics Land Systems (Canada), Lockheed Martin & BAE Systems: global defence contractors supply weapons and armoured vehicles used in the Yemen war, sparking major debate in Canada over arms exports.",
    qs: "Who is fighting in Yemen and who supplies them? Why did the war create one of the world's worst hunger crises? What has a truce changed, and what has it not?",
    src: "Start: UNDP Yemen data + ACLED conflict tracker." },
  { id: 22, country: "Pakistan",      iso: "pk", region: "Asia", issue: "Flooding & Climate Impacts",
    qs: "What did the 2022 floods actually destroy (numbers)? Why is Pakistan hit so hard while producing so few emissions? What is Pakistan asking wealthy countries to pay for?",
    src: "Start: World Bank Pakistan climate assessment + UN Pakistan flood response reports." },
  { id: 23, country: "Turkey",        iso: "tr", region: "Europe/Asia", issue: "Earthquake Preparedness & Response",
    qs: "Why did the 2023 earthquakes kill so many? What did building-code amnesty laws have to do with it? What has changed in construction enforcement since?",
    src: "Start: Turkish disaster agency AFAD reports + NYT/AP investigations on building codes." },
  { id: 24, country: "Indonesia",     iso: "id", region: "Asia", issue: "Palm Oil & Deforestation",
    tnc: "Nestle, Unilever, Procter & Gamble & PepsiCo: everyday grocery and soap brands in Canadian homes buy massive volumes of Indonesian palm oil and rely on RSPO sustainability labels.",
    qs: "What products in your house contain palm oil? What has certification (RSPO) actually protected? Who benefits from palm oil jobs and who loses forest?",
    src: "Start: WRI Global Forest Watch Indonesia data + CIFOR research." },
  { id: 25, country: "Kenya",         iso: "ke", region: "Africa", issue: "Wildlife Conservation & Tourism",
    tnc: "International hotel & airline chains (Marriott, British Airways, TUI): global tourism operators bring vital currency to Kenya, raising the question of how much revenue stays with local community conservancies.",
    qs: "Do safari tourists pay for conservation or disturb it? What community conservancies actually work? What happened when tourism stopped in 2020?",
    src: "Start: Kenya Wildlife Service reports + Northern Rangelands Trust data." },
  { id: 26, country: "Egypt",         iso: "eg", region: "Africa", issue: "Water Security & the Nile Dispute",
    qs: "Why does Ethiopia's Grand Renaissance Dam frighten Egypt? What does 'water security' mean for a country that farms in a desert? How close have the dispute talks come to agreement?",
    src: "Start: UN mediation briefings + International Crisis Group Nile reports." },
  { id: 27, country: "France",        iso: "fr", region: "Europe", issue: "Social Protests & Inequality",
    qs: "Why do the French protest more than most countries? What did the pension reform fight reveal about who pays and who benefits? When does protest actually change policy?",
    src: "Start: Reuters/AP explainers on French pension reform + OECD France data." },
  { id: 28, country: "New Zealand",   iso: "nz", region: "Oceania", issue: "Indigenous Rights & Reconciliation",
    qs: "What is the Treaty of Waitangi and what does it promise? How do Maori language and co-governance work today? Which parts of New Zealand's path could Canada copy, and which could it not?",
    src: "Start: NZ History (nzhistory.govt.nz) Treaty pages + Waitangi Tribunal summaries." },
  { id: 29, country: "Venezuela",     iso: "ve", region: "Americas", issue: "Economic Collapse & Migration",
    tnc: "Chevron & ExxonMobil: multinational oil companies operated in Venezuela before nationalization and US sanctions, and Chevron remains one of the few foreign firms pumping Venezuelan oil under a special licence.",
    qs: "How does an oil-rich country run out of food and medicine? Where did 7 million Venezuelans go? What did host countries in Latin America do differently than expected?",
    src: "Start: R4V (UNHCR/IOM) Venezuela refugee data + World Bank Venezuela briefs." },
  { id: 30, country: "Colombia",      iso: "co", region: "Americas", issue: "Peace Process & the Drug Trade",
    tnc: "Chiquita Brands: in a landmark 2024 US court verdict, banana giant Chiquita was held liable for paying armed paramilitary groups during Colombia's civil conflict.",
    qs: "What did the 2016 peace deal with FARC actually promise? Why does coca farming keep growing after peace? What does the 2016 Nobel-winning deal teach other conflicts?",
    src: "Start: Kroc Institute peace accord monitoring reports + UNODC coca surveys." },
  { id: 31, country: "North Korea",   iso: "kp", region: "Asia", issue: "Nuclear Weapons & Isolation",
    qs: "How did North Korea build nuclear weapons despite sanctions? What do sanctions actually do to ordinary North Koreans? What have talks with South Korea and the US achieved?",
    src: "Start: UN Panel of Experts reports (38 North) + IAEA North Korea pages." },
  { id: 32, country: "Syria",         iso: "sy", region: "Middle East", issue: "Civil War, Refugees & Rebuilding",
    qs: "Where did 6 million Syrian refugees go, and who is going home now after 2024's change of government? What does rebuilding a shattered country cost and who pays? What happened to the people who stayed?",
    src: "Start: UNHCR Syria regional updates + UN OCHA Syria reports." },
  { id: 33, country: "South Sudan",   iso: "ss", region: "Africa", issue: "Civil Conflict & Food Insecurity",
    tnc: "CNPC (China) & Petronas (Malaysia): foreign state-backed oil companies operate South Sudan's oilfields, generating revenues that political factions fight to control.",
    qs: "Why did the world's newest country (2011) fall into civil war? How does oil money feed the fighting? What do UN peacekeepers actually do there?",
    src: "Start: UNMISS (UN Mission in South Sudan) reports + World Food Programme data." },
  { id: 34, country: "Cuba",          iso: "cu", region: "Americas", issue: "Sanctions & Everyday Life",
    tnc: "Sherritt International (Canada) & Melia Hotels (Spain): Canadian mining TNC Sherritt is one of Cuba's largest foreign investors (nickel and cobalt), caught directly between Canadian trade law and US embargo penalties.",
    qs: "What does the US embargo actually block, 60 years in? How do fuel shortages, blackouts and food rationing connect to it and to government choices? Why did so many Cubans leave in 2022-24?",
    src: "Start: UN General Assembly embargo votes + Reuters/Cuba studies reports." },
  { id: 35, country: "Finland",       iso: "fi", region: "Europe", issue: "Education System & Play-Based Learning",
    qs: "What do Finnish schools do differently (later start, no standardized grind, play)? Does the PISA evidence prove the model works, and is it slipping? What could a Nova Scotia school actually borrow?",
    src: "Start: OECD PISA Finland results + Finnish National Agency for Education pages." },
  { id: 36, country: "Taiwan",        iso: "tw", region: "Asia", issue: "Semiconductors & Geopolitics",
    tnc: "TSMC, Apple & Nvidia: Taiwan's TSMC manufactures most of the world's advanced microchips for Apple iPhones, Nvidia AI servers, and vehicles sold in Canada.",
    qs: "Why does your phone depend on one island? What happens to the world economy if Taiwan is blockaded? What is Canada's role in chip supply and in the Taiwan dispute?",
    src: "Start: Semiconductor Industry Association data + CBC/AP coverage of Canada-IndoPacific strategy." },
  { id: 37, country: "Greenland",     iso: "gl", region: "Arctic", issue: "Arctic Shipping & Sovereignty",
    tnc: "Maersk & global mining companies: Danish shipping giant Maersk tests newly ice-free Arctic routes, while international mining TNCs compete for Greenland's rare-earth minerals used in EVs and wind turbines.",
    qs: "Why are world powers suddenly interested in Greenland? What does melting sea ice do to shipping routes Canada also wants? What do Greenlanders themselves want: independence, protection, or both?",
    src: "Start: Arctic Council reports + CBC North coverage + Danish Arctic strategy documents." },
  { id: 38, country: "Vanuatu",       iso: "vu", region: "Oceania", issue: "Climate Justice at the World Court",
    qs: "How did island students your age start a legal case at the International Court of Justice? What did the ICJ tell countries they must do about climate harm? What could that ruling mean for Canada's emissions?",
    src: "Start: ICJ 2025 climate advisory opinion + Pacific Islands Forum statements + Vanuatu ICJ initiative site." },
  { id: 39, country: "Panama",        iso: "pa", region: "Americas", issue: "Canal Drought & Global Trade",
    tnc: "Maersk, MSC & Hapag-Lloyd: the world's largest container shipping lines reroute ships around South America or Africa when canal water drops, raising freight costs on goods headed to Canadian stores.",
    qs: "How does a drought in Panama raise prices in Canada? What did the canal cut ship numbers to in 2023-24, and what is Panama building in response? Who wins and loses when global shipping reroutes?",
    src: "Start: Panama Canal Authority (ACP) announcements + Reuters shipping coverage." },
  { id: 40, country: "DR Congo",      iso: "cd", region: "Africa", issue: "Cobalt Mining & Battery Supply Chains",
    tnc: "Glencore, Apple & Tesla: over 70% of the world's cobalt (needed for phone and EV batteries) comes from the Democratic Republic of the Congo, where global miners and tech/auto brands face intense scrutiny over artisanal mining and child labour.",
    qs: "Why does your phone or an electric car battery depend on the DRC? What has the Congolese government done to regulate cobalt mines and stop child labour, and what has failed? How do global tech companies trace (or miss) where their cobalt comes from?",
    src: "Start: Amnesty International DRC cobalt reports + International Labour Organization (ILO) & Reuters mining coverage." },
  { id: 41, country: "Chile",         iso: "cl", region: "Americas", issue: "Lithium Mining & Indigenous Water Rights",
    tnc: "SQM, Albemarle & Tesla: giant lithium producers pump brine from Chile's Atacama Desert to supply global EV battery makers like Tesla, sparking clashes over drying water tables and Indigenous Atacameño rights.",
    qs: "How does lithium mining in the Atacama Desert affect local water and Indigenous communities? What did Chile's National Lithium Strategy (2023) actually change about state control and environmental rules? Is green energy fair if its raw materials harm desert ecosystems?",
    src: "Start: Reuters coverage of Chile's National Lithium Strategy + Natural Resources Defense Council (NRDC) & Amnesty reports on Atacama water." },
  { id: 42, country: "Sudan",         iso: "sd", region: "Africa", issue: "Conflict, Displacement & Food Crisis",
    map: "images/maps/sd-map.png",
    mapNote: "Northeast Africa: borders Egypt, Libya, Chad, Central African Republic, South Sudan, Ethiopia, and Eritrea along the Red Sea and Nile River. Capital: Khartoum.",
    mapCredit: "Wikimedia Commons (CC BY-SA 3.0) - Orthographic locator map of Sudan",
    qs: "How did the civil war that began in April 2023 between the Sudanese Armed Forces (SAF) and the Rapid Support Forces (RSF) trigger one of the world's worst hunger and displacement crises? What have Sudan's rival authorities done (or blocked) regarding humanitarian food aid and farming? How have neighbouring countries and UN agencies responded, and why is aid still falling short?",
    src: "Start: UN OCHA Sudan situation reports + World Food Programme (WFP) Sudan emergency page + UNHCR Sudan displacement data." },
  { id: 43, country: "Nepal",         iso: "np", region: "Asia", issue: "Mountain Climbing & Sherpa Worker Safety",
    tnc: "International expedition outfitters & global outdoor gear brands (e.g. Madison Mountaineering, Seven Summit Treks, The North Face): foreign climbing clients pay $40,000-$100,000+ per Everest expedition while Sherpa high-altitude workers carry loads through the Khumbu Icefall for a fraction of the fee.",
    map: "images/maps/np-map.png",
    mapNote: "South Asia (Himalayas): landlocked between China (Tibet) to the north and India to the south, east, and west. Home to Mount Everest, Lhotse, and Annapurna. Capital: Kathmandu.",
    mapCredit: "Wikimedia Commons (CC BY-SA 3.0) - Orthographic locator map of Nepal",
    qs: "Why do Sherpa high-altitude workers face far higher death and injury risks on peaks like Everest, Annapurna, and Lhotse than foreign clients? What rules has Nepal's government set for climbing permits, insurance, rescue coverage, and worker safety, and are they enforced? Why do many Sherpas keep taking the work despite the danger, and what fairer standards are workers asking for?",
    src: "Start: The Himalayan Database + International Labour Organization (ILO) Nepal + BBC/National Geographic reporting on Sherpa safety and Everest permit rules." }
];

/* Render the gallery. No claimed-topics data this year: claims happen
   through Google Classroom so nothing student-identifying lives here. */
let _topicState = {
  region: "All",
  shown: TOPICS.slice(),
  activeId: null,
  lastFocus: null
};

function _esc(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderTopics() {
  const grid = document.getElementById("topic-grid");
  if (!grid) return;
  const regions = ["All", ...[...new Set(TOPICS.map(t => t.region))].sort()];
  const filterBox = document.getElementById("topic-filter");
  const clearBtn = document.getElementById("topic-clear");
  const countBox = document.getElementById("topic-count");
  const pillBar = document.getElementById("region-pills");

  function buildPills() {
    if (!pillBar) return;
    pillBar.innerHTML = regions.map(r => {
      const n = r === "All" ? TOPICS.length : TOPICS.filter(t => t.region === r).length;
      const active = _topicState.region === r ? " active" : "";
      return `<button type="button" class="region-pill${active}" data-region="${_esc(r)}" aria-pressed="${_topicState.region === r}">${_esc(r)} <span class="pill-n">${n}</span></button>`;
    }).join("");
    pillBar.querySelectorAll(".region-pill").forEach(btn => {
      btn.addEventListener("click", () => {
        _topicState.region = btn.getAttribute("data-region");
        buildPills();
        draw();
      });
    });
  }

  function cardHTML(t) {
    const tncBadge = t.tnc ? `<span class="topic-tnc-pill" title="Includes a Transnational Corporation (TNC) link">TNC</span>` : "";
    const rank = typeof window.getBidRankForTopic === "function" ? window.getBidRankForTopic(t.id) : 0;
    const rankBadge = rank ? `<span class="topic-rank-pill">#${rank} Pick</span>` : "";
    const pickedCls = rank ? " is-picked" : "";
    return `<article class="topic-card${pickedCls}" data-region="${_esc(t.region)}" tabindex="0" role="button"
      aria-label="${_esc(t.country)}: ${_esc(t.issue)}"
      onclick="openTopic(${t.id})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openTopic(${t.id});}">
      <div class="topic-thumb">
        <img class="thumb-img" src="images/topics/${_esc(t.iso)}.jpg" alt="${_esc(t.country)} - ${_esc(t.issue)}" loading="lazy">
        <img class="flag" src="images/flags/${_esc(t.iso)}.svg" alt="Flag of ${_esc(t.country)}" loading="lazy">
        <div class="topic-badges">${rankBadge}${tncBadge}<span class="topic-region">${_esc(t.region)}</span></div>
      </div>
      <div class="topic-body">
        <h4>${_esc(t.country)}</h4>
        <p class="topic-issue">${_esc(t.issue)}</p>
        <span class="topic-more">Open full briefing &rarr;</span>
      </div>
    </article>`;
  }

  function draw() {
    const q = (filterBox.value || "").trim().toLowerCase();
    if (clearBtn) clearBtn.hidden = !q;
    const shown = TOPICS.filter(t => {
      const regionMatch = _topicState.region === "All" || t.region === _topicState.region;
      if (!regionMatch) return false;
      if (!q) return true;
      const blob = (t.country + " " + t.issue + " " + t.region + " " + t.qs + " " + t.src + " " + (t.tnc ? "tnc " + t.tnc : "")).toLowerCase();
      return blob.includes(q);
    });
    _topicState.shown = shown;

    if (shown.length === 0) {
      grid.innerHTML = `<div class="topic-empty">
        <p>No countries match <strong>${_esc(filterBox.value.trim() || _topicState.region)}</strong>.</p>
        <button type="button" class="btn ghost" onclick="resetTopicFilters()">Reset filters</button>
      </div>`;
    } else {
      grid.innerHTML = shown.map(cardHTML).join("");
    }
    countBox.textContent = shown.length + " of " + TOPICS.length + " countries";
  }

  window.refreshTopicCards = draw;
  window.resetTopicFilters = function () {
    _topicState.region = "All";
    filterBox.value = "";
    buildPills();
    draw();
    filterBox.focus();
  };

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      filterBox.value = "";
      draw();
      filterBox.focus();
    });
  }

  filterBox.addEventListener("input", draw);
  buildPills();
  draw();
}

function pickRandomTopic() {
  const pool = _topicState.shown.length ? _topicState.shown : TOPICS;
  const choices = pool.length > 1 ? pool.filter(t => t.id !== _topicState.activeId) : pool;
  const pick = choices[Math.floor(Math.random() * choices.length)];
  if (pick) openTopic(pick.id);
}

function openTopic(id) {
  const t = TOPICS.find(x => x.id === id);
  if (!t) return;
  const screen = document.getElementById("topic-modal");
  if (!screen.classList.contains("open")) {
    _topicState.lastFocus = document.activeElement;
  }
  _topicState.activeId = t.id;

  const list = _topicState.shown.some(x => x.id === t.id) ? _topicState.shown : TOPICS;
  const idx = list.findIndex(x => x.id === t.id);

  const heroImg = document.getElementById("modal-hero-img");
  if (heroImg) {
    heroImg.src = "images/topics/" + t.iso + ".jpg";
    heroImg.alt = t.country + " - " + t.issue;
  }
  document.getElementById("modal-flag").src = "images/flags/" + t.iso + ".svg";
  document.getElementById("modal-flag").alt = "Flag of " + t.country;
  document.getElementById("modal-title").textContent = t.country;
  document.getElementById("modal-issue").textContent = t.issue;
  const regionEl = document.getElementById("modal-region");
  if (regionEl) regionEl.textContent = t.region;
  const posEl = document.getElementById("modal-pos");
  if (posEl) posEl.textContent = (idx + 1) + " of " + list.length;

  const qs = t.qs.split(/\?\s+/).map(s => s.trim().replace(/\?+$/, "")).filter(Boolean);
  document.getElementById("modal-qs").innerHTML =
    qs.map((s, qi) =>
      '<li class="cs-q-card"><span class="cs-q-num">Q' + (qi + 1) + '</span><span>' + _esc(s) + '?</span></li>'
    ).join("");

  const tncWrap = document.getElementById("modal-tnc-wrap");
  const tncEl = document.getElementById("modal-tnc");
  const tncBadge = document.getElementById("modal-tnc-badge");
  if (tncWrap && tncEl) {
    if (t.tnc) {
      tncEl.textContent = t.tnc;
      tncWrap.hidden = false;
      if (tncBadge) tncBadge.hidden = false;
    } else {
      tncEl.textContent = "";
      tncWrap.hidden = true;
      if (tncBadge) tncBadge.hidden = true;
    }
  }
  document.getElementById("modal-src").textContent = t.src;

  const mapCardWrap = document.getElementById("modal-map-wrap");
  if (mapCardWrap) {
    const osmLink = document.getElementById("modal-osm-link");
    if (osmLink) osmLink.href = "https://www.openstreetmap.org/search?query=" + encodeURIComponent(t.country);
    const mapImg = document.getElementById("modal-map-img");
    const mapNote = document.getElementById("modal-map-note");
    const mapCredit = document.getElementById("modal-map-credit");
    if (t.map && mapImg) {
      mapImg.src = t.map;
      mapImg.alt = "Locator map of " + t.country;
      mapImg.hidden = false;
      if (mapNote) { mapNote.textContent = t.mapNote || ""; mapNote.hidden = !t.mapNote; }
      if (mapCredit) { mapCredit.textContent = t.mapCredit || ""; mapCredit.hidden = !t.mapCredit; }
    } else if (mapImg) {
      mapImg.hidden = true;
      if (mapNote) { mapNote.textContent = "Open the interactive world map below to check " + t.country + "'s continent, neighbours, and capital for Slide 2."; mapNote.hidden = false; }
      if (mapCredit) { mapCredit.hidden = true; }
    }
  }

  const mapEl = document.getElementById("modal-slide-map");
  if (mapEl) {
    mapEl.innerHTML =
      '<div><strong>Slide 3 (The Issue):</strong> Scale ' + _esc(t.issue) + ' to ' + _esc(t.country) + ' with 1-2 real numbers.</div>' +
      '<div><strong>Slide 4 (Core - Action/Inaction):</strong> What has ' + _esc(t.country) + '\'s government actually DONE (laws, spending, treaties, enforcement)?</div>' +
      '<div><strong>Slide 5 (Consequences):</strong> Intended vs. unintended effects, short vs. long term, and who carries the cost.</div>' +
      '<div><strong>Slide 6 (Canada + Why Care):</strong> Compare Canada\'s record on ' + _esc(t.issue) + (t.tnc ? ' and connect the TNC link back to Canadian life.' : ' and explain why Canadians should care.') + '</div>';
  }

  const claimNote = document.getElementById("modal-claim-note");
  if (claimNote) claimNote.textContent = "";
  if (typeof window.syncModalBidButtons === "function") window.syncModalBidButtons(t.id);

  screen.classList.add("open");
  screen.scrollTop = 0;
  document.body.style.overflow = "hidden";
  const closeBtn = screen.querySelector(".modal-close");
  if (closeBtn) closeBtn.focus();
}

function stepTopic(delta) {
  if (_topicState.activeId == null) return;
  const list = _topicState.shown.some(x => x.id === _topicState.activeId) ? _topicState.shown : TOPICS;
  if (!list.length) return;
  const idx = list.findIndex(x => x.id === _topicState.activeId);
  const next = list[(idx + delta + list.length) % list.length];
  if (next) openTopic(next.id);
}

function copyTopicClaim() {
  const t = TOPICS.find(x => x.id === _topicState.activeId);
  if (!t) return;
  const line = t.country + " - " + t.issue + " - [Name 1] & [Name 2]";
  const note = document.getElementById("modal-claim-note");
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(line).then(() => {
      if (note) {
        note.textContent = "Copied: " + line;
        setTimeout(() => { note.textContent = ""; }, 3500);
      }
    }).catch(() => {
      if (note) note.textContent = line;
    });
  } else if (note) {
    note.textContent = line;
  }
}

function closeTopic() {
  const modal = document.getElementById("topic-modal");
  if (!modal.classList.contains("open")) return;
  modal.classList.remove("open");
  document.body.style.overflow = "";
  _topicState.activeId = null;
  if (_topicState.lastFocus && typeof _topicState.lastFocus.focus === "function") {
    _topicState.lastFocus.focus();
  }
}
