/* Country Profile Project 2026-27 - topic gallery data.
   Citizenship 9, Term 2 project.
   Flags: local circle-flags SVGs (hatscripts/circle-flags, MIT).
   Each topic: region, issue, three research questions,
   one "start here" source pointer. */

const TOPICS = [
  { id: 1,  country: "Australia",     iso: "au", region: "Oceania", issue: "Climate Change & Wildfires",
    qs: "What has changed about Australian fire seasons? What did the 2019-20 bushfire royal commission recommend, and what was actually done? Who opposes climate policy there, and why?",
    src: "Start: Australian Government Climate Change reports + the 2020 Royal Commission into National Natural Disaster Arrangements." },
  { id: 2,  country: "Brazil",        iso: "br", region: "Americas", issue: "Amazon Deforestation",
    qs: "What laws exist against deforestation and how are they enforced? Why do poor local farmers clear land, not just big companies? What did deforestation numbers do between 2019 and 2025, and which policies moved them?",
    src: "Start: INPE (Brazil's space agency) deforestation data + Reuters explainers on Amazon policy." },
  { id: 3,  country: "India",         iso: "in", region: "Asia", issue: "Air Pollution & Public Health",
    qs: "What causes Delhi's air crisis? What has the government actually done (odd-even schemes, AQI alerts, clean-air programs)? What does living in that air do to a person's health over 10 years?",
    src: "Start: live AQI maps (IQAir) + Lancet studies on air pollution deaths in India." },
  { id: 4,  country: "China",         iso: "cn", region: "Asia", issue: "Surveillance & Human Rights (Xinjiang)",
    qs: "What surveillance technology is used and how? What evidence exists about the treatment of Uyghurs? How have other countries responded, and what did China say in reply?",
    src: "Start: UN OHCHR 2022 Xinjiang assessment + BBC/Reuters investigations." },
  { id: 5,  country: "Ethiopia",      iso: "et", region: "Africa", issue: "Food Security & Conflict",
    qs: "How did the Tigray conflict turn into a hunger crisis? What role does climate (drought) play alongside war? What aid exists and what blocks it?",
    src: "Start: UN OCHA Ethiopia situation reports + World Food Programme pages." },
  { id: 6,  country: "Afghanistan",   iso: "af", region: "Asia", issue: "Women's Rights & Education",
    qs: "What rules has the Taliban imposed on girls' education since 2021? How have Afghan women resisted inside the country? What has the international response actually changed?",
    src: "Start: UNESCO reports on girls' education in Afghanistan + BBC coverage of women's protests." },
  { id: 7,  country: "Germany",       iso: "de", region: "Europe", issue: "Energy Transition (Energiewende)",
    qs: "Why did Germany shut down its nuclear plants? What did the switch to renewables cost, and what unintended problems appeared (energy prices, gas dependence)? What can Canada learn from it?",
    src: "Start: Clean Energy Wire (CLEW) factsheets + IEA Germany country data." },
  { id: 8,  country: "South Africa",  iso: "za", region: "Africa", issue: "Income Inequality & Poverty",
    qs: "Why is South Africa one of the most unequal countries on Earth? What do social grants actually do for families? What is load-shedding, and how does it deepen poverty?",
    src: "Start: World Bank South Africa poverty overview + IMF Article IV reports." },
  { id: 9,  country: "Philippines",   iso: "ph", region: "Asia", issue: "Natural Disasters & Climate Resilience",
    qs: "Why does the Philippines get hit by so many typhoons? What does its disaster agency do differently since Typhoon Haiyan (2013)? What has actually improved and what has not?",
    src: "Start: NDRRMC (Philippine disaster agency) reports + UNDRR case studies." },
  { id: 10, country: "United Kingdom", iso: "gb", region: "Europe", issue: "Refugee & Immigration Policy",
    qs: "What is the Rwanda deportation scheme and what happened to it? How many refugees does the UK actually accept? How do its policies compare with Canada's refugee system?",
    src: "Start: UK Home Office statistics + UNHCR commentary on UK asylum policy." },
  { id: 11, country: "Haiti",         iso: "ht", region: "Americas", issue: "Political Instability & Aid",
    qs: "How did the 2021 assassination and gang control collapse everyday life? Why has foreign aid not fixed it? What is the Kenya-led police mission and how is it going?",
    src: "Start: UN OCHA Haiti reports + IOM situation reports." },
  { id: 12, country: "Ukraine",       iso: "ua", region: "Europe", issue: "Conflict & International Relations",
    qs: "What has the war done to civilians since 2022? What has Canada given Ukraine, and why Canada specifically? What happens to grain, energy and refugees far from the battlefield?",
    src: "Start: UNHCR Ukraine data + Global Affairs Canada Ukraine support pages." },
  { id: 13, country: "Russia",        iso: "ru", region: "Europe", issue: "Freedom of Expression",
    qs: "What happens to Russians who criticize the war? How does the state control news and the internet? What do journalists in exile do, and who reads them?",
    src: "Start: Reporters Without Borders Russia profile + BBC News Russian coverage." },
  { id: 14, country: "Myanmar",       iso: "mm", region: "Asia", issue: "Rohingya Refugee Crisis",
    qs: "What happened to the Rohingya in 2017 and after? Why has repatriation to Myanmar failed? What is life like in the Cox's Bazar camps, and whose problem is it now?",
    src: "Start: UNHCR Myanmar situation reports + International Court of Justice Rohingya case." },
  { id: 15, country: "Japan",         iso: "jp", region: "Asia", issue: "Aging Population & Social Policy",
    qs: "What happens to a country where more people are over 80 than under 15? What has Japan tried (robots, immigration, retirement changes)? Which of those could ever work in Canada?",
    src: "Start: Japan Statistics Bureau data + OECD Japan policy reviews." },
  { id: 16, country: "Bangladesh",    iso: "bd", region: "Asia", issue: "Textile Industry & Labour Rights",
    qs: "What changed after the Rana Plaza collapse (2013)? Who checks garment factories now, and does it work? What is the Accord and what did brands actually sign?",
    src: "Start: ILO Bangladesh reports + Clean Clothes Campaign." },
  { id: 17, country: "Somalia",       iso: "so", region: "Africa", issue: "Food Security & Drought",
    qs: "How many droughts has Somalia faced in one decade? Why does famine follow politics, not just rain? How do clan structures shape who gets help?",
    src: "Start: FEWS NET Somalia food security outlook + UN OCHA reports." },
  { id: 18, country: "Saudi Arabia",  iso: "sa", region: "Middle East", issue: "Women's Rights & Social Change",
    qs: "What changed for women since 2018 (driving, guardianship rules)? What still restricts them, and what happened to the activists who campaigned for those changes? Is Vision 2030 reform real?",
    src: "Start: Amnesty International Saudi Arabia reports + Human Rights Watch women's rights pages." },
  { id: 19, country: "Mexico",        iso: "mx", region: "Americas", issue: "Drug Cartels & Public Safety",
    qs: "Why did cartels get so powerful? What has the government tried, and what are the results? How does US demand and gun flow shape the violence?",
    src: "Start: International Crisis Group Mexico reports + UNODC data." },
  { id: 20, country: "Nigeria",       iso: "ng", region: "Africa", issue: "Oil Production & Environmental Damage",
    qs: "What has oil done to the Niger Delta's land and water? Who profits from Nigerian oil and who does not? What did cleanup programs actually deliver?",
    src: "Start: UNEP Ogoniland assessment + Amnesty International Nigeria pages." },
  { id: 21, country: "Yemen",         iso: "ye", region: "Middle East", issue: "Humanitarian Crisis & Conflict",
    qs: "Who is fighting in Yemen and who supplies them? Why did the war create one of the world's worst hunger crises? What has a truce changed, and what has it not?",
    src: "Start: UNDP Yemen data + ACLED conflict tracker." },
  { id: 22, country: "Pakistan",      iso: "pk", region: "Asia", issue: "Flooding & Climate Impacts",
    qs: "What did the 2022 floods actually destroy (numbers)? Why is Pakistan hit so hard while producing so few emissions? What is Pakistan asking wealthy countries to pay for?",
    src: "Start: World Bank Pakistan climate assessment + UN Pakistan flood response reports." },
  { id: 23, country: "Turkey",        iso: "tr", region: "Europe/Asia", issue: "Earthquake Preparedness & Response",
    qs: "Why did the 2023 earthquakes kill so many? What did building-code amnesty laws have to do with it? What has changed in construction enforcement since?",
    src: "Start: Turkish disaster agency AFAD reports + NYT/AP investigations on building codes." },
  { id: 24, country: "Indonesia",     iso: "id", region: "Asia", issue: "Palm Oil & Deforestation",
    qs: "What products in your house contain palm oil? What has certification (RSPO) actually protected? Who benefits from palm oil jobs and who loses forest?",
    src: "Start: WRI Global Forest Watch Indonesia data + CIFOR research." },
  { id: 25, country: "Kenya",         iso: "ke", region: "Africa", issue: "Wildlife Conservation & Tourism",
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
    qs: "How does an oil-rich country run out of food and medicine? Where did 7 million Venezuelans go? What did host countries in Latin America do differently than expected?",
    src: "Start: R4V (UNHCR/IOM) Venezuela refugee data + World Bank Venezuela briefs." },
  { id: 30, country: "Colombia",      iso: "co", region: "Americas", issue: "Peace Process & the Drug Trade",
    qs: "What did the 2016 peace deal with FARC actually promise? Why does coca farming keep growing after peace? What does the 2016 Nobel-winning deal teach other conflicts?",
    src: "Start: Kroc Institute peace accord monitoring reports + UNODC coca surveys." },
  { id: 31, country: "North Korea",   iso: "kp", region: "Asia", issue: "Nuclear Weapons & Isolation",
    qs: "How did North Korea build nuclear weapons despite sanctions? What do sanctions actually do to ordinary North Koreans? What have talks with South Korea and the US achieved?",
    src: "Start: UN Panel of Experts reports (38 North) + IAEA North Korea pages." },
  { id: 32, country: "Syria",         iso: "sy", region: "Middle East", issue: "Civil War, Refugees & Rebuilding",
    qs: "Where did 6 million Syrian refugees go, and who is going home now after 2024's change of government? What does rebuilding a shattered country cost and who pays? What happened to the people who stayed?",
    src: "Start: UNHCR Syria regional updates + UN OCHA Syria reports." },
  { id: 33, country: "South Sudan",   iso: "ss", region: "Africa", issue: "Civil Conflict & Food Insecurity",
    qs: "Why did the world's newest country (2011) fall into civil war? How does oil money feed the fighting? What do UN peacekeepers actually do there?",
    src: "Start: UNMISS (UN Mission in South Sudan) reports + World Food Programme data." },
  { id: 34, country: "Cuba",          iso: "cu", region: "Americas", issue: "Sanctions & Everyday Life",
    qs: "What does the US embargo actually block, 60 years in? How do fuel shortages, blackouts and food rationing connect to it and to government choices? Why did so many Cubans leave in 2022-24?",
    src: "Start: UN General Assembly embargo votes + Reuters/Cuba studies reports." },
  { id: 35, country: "Finland",       iso: "fi", region: "Europe", issue: "Education System & Play-Based Learning",
    qs: "What do Finnish schools do differently (later start, no standardized grind, play)? Does the PISA evidence prove the model works, and is it slipping? What could a Nova Scotia school actually borrow?",
    src: "Start: OECD PISA Finland results + Finnish National Agency for Education pages." },
  { id: 36, country: "Taiwan",        iso: "tw", region: "Asia", issue: "Semiconductors & Geopolitics",
    qs: "Why does your phone depend on one island? What happens to the world economy if Taiwan is blockaded? What is Canada's role in chip supply and in the Taiwan dispute?",
    src: "Start: Semiconductor Industry Association data + CBC/AP coverage of Canada-IndoPacific strategy." },
  { id: 37, country: "Greenland",     iso: "gl", region: "Arctic", issue: "Arctic Shipping & Sovereignty",
    qs: "Why are world powers suddenly interested in Greenland? What does melting sea ice do to shipping routes Canada also wants? What do Greenlanders themselves want: independence, protection, or both?",
    src: "Start: Arctic Council reports + CBC North coverage + Danish Arctic strategy documents." },
  { id: 38, country: "Vanuatu",       iso: "vu", region: "Oceania", issue: "Climate Justice at the World Court",
    qs: "How did island students your age start a legal case at the International Court of Justice? What did the ICJ tell countries they must do about climate harm? What could that ruling mean for Canada's emissions?",
    src: "Start: ICJ 2025 climate advisory opinion + Pacific Islands Forum statements + Vanuatu ICJ initiative site." },
  { id: 39, country: "Panama",        iso: "pa", region: "Americas", issue: "Canal Drought & Global Trade",
    qs: "How does a drought in Panama raise prices in Canada? What did the canal cut ship numbers to in 2023-24, and what is Panama building in response? Who wins and loses when global shipping reroutes?",
    src: "Start: Panama Canal Authority (ACP) announcements + Reuters shipping coverage." }
];

/* Render the gallery. No claimed-topics data this year: claims happen
   through Google Classroom so nothing student-identifying lives here. */
function renderTopics() {
  const grid = document.getElementById("topic-grid");
  if (!grid) return;
  const regions = [...new Set(TOPICS.map(t => t.region))].sort();
  const filterBox = document.getElementById("topic-filter");
  const countBox = document.getElementById("topic-count");

  function cardHTML(t) {
    return `<article class="topic-card" data-region="${t.region}" tabindex="0"
      onclick="openTopic(${t.id})" onkeydown="if(event.key==='Enter')openTopic(${t.id})">
      <img class="flag" src="images/flags/${t.iso}.svg" alt="Flag of ${t.country}" loading="lazy">
      <h4>${t.country}</h4>
      <p class="topic-issue">${t.issue}</p>
      <span class="topic-region">${t.region}</span>
    </article>`;
  }

  function draw() {
    const q = (filterBox.value || "").trim().toLowerCase();
    const shown = TOPICS.filter(t =>
      !q || (t.country + " " + t.issue + " " + t.region + " " + t.qs).toLowerCase().includes(q));
    grid.innerHTML = shown.map(cardHTML).join("");
    countBox.textContent = shown.length + " of " + TOPICS.length + " topics shown";
  }

  filterBox.addEventListener("input", draw);
  draw();
}

function openTopic(id) {
  const t = TOPICS.find(x => x.id === id);
  if (!t) return;
  document.getElementById("modal-flag").src = "images/flags/" + t.iso + ".svg";
  document.getElementById("modal-flag").alt = "Flag of " + t.country;
  document.getElementById("modal-title").textContent = t.country;
  document.getElementById("modal-issue").textContent = t.issue;
  document.getElementById("modal-qs").innerHTML =
    t.qs.split("? ").map(s => "<li>" + s.trim().replace(/\?$/, "") + "?</li>").join("");
  document.getElementById("modal-src").textContent = t.src;
  document.getElementById("topic-modal").classList.add("open");
}

function closeTopic() {
  document.getElementById("topic-modal").classList.remove("open");
}
