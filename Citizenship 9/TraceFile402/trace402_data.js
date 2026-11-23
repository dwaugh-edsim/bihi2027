/* ============================================================================
   TRACE FILE 402: THE $14 HOODIE - Citizenship 9 Investigation Sim
   Course: Citizenship 9 (CIT9) - Outcome U6A: Global Citizenship
   Bridge lesson: Made in Bangladesh -> Rights Primer (UN, UDHR, Charter) ->
   Veto Trap -> Country Profile Project.
   House rules: no em/en dashes; plain Grade 9 prose; no answer leaks.
   ============================================================================ */

var TRACE402 = {
  meta: {
    title: "TRACE FILE 402: THE $14 HOODIE",
    subtitle: "A Halifax-to-Dhaka human rights and supply-chain investigation",
    hud: "TRACE FILE 402 // CITIZENSHIP 9",
    taskName: "CIT9-TraceFile402-Sim",
    outcomeLabel: "Learning Outcome // Citizenship 9 (U6A: Global Citizenship)",
    outcome: "Learners will evaluate the consequences of action and inaction as twenty-first century global citizens.",
    defaultTabLabels: { dispatch: "1. Story", evidence: "2. Evidence", toolkit: "3. Rights & Words" }
  },

  characters: {
    elena: { name: "Elena Vance", role: "Senior Producer, Halifax Newsroom", img: "assets/char_elena.jpg" },
    nadia: { name: "Nadia Rahman", role: "Garment Worker, Dhaka (Tier-2)", img: "assets/char_nadia.jpg" },
    tariq: { name: "Tariq Hassan", role: "Factory Manager, Dhaka (Tier-1)", img: "assets/char_tariq.jpg" },
    david: { name: "David Chen", role: "PR Director, NorthStar Apparel (Toronto)", img: "assets/char_david.jpg" },
    amira: { name: "Amira Osei", role: "Human Rights Lawyer", img: "assets/char_amira.jpg" }
  },

  glossary: {
    "tier-1 factory": "The official, approved factory that a clothing brand directly hires and sends safety inspectors to check.",
    "tier-2 factory": "A second, cheaper, uninspected workshop that a Tier-1 factory secretly passes extra work to behind the brand's back.",
    "supply chain": "Every step it takes to make and move a product: cotton farm -> factory -> cargo ship -> mall store.",
    "subcontracting": "Passing part of an order to another workshop. In this case, an approved Tier-1 factory secretly passes overflow work to a cheaper, uninspected Tier-2 shop.",
    "plausible deniability": "Setting up a system so a brand can truthfully say 'we did not officially know' about an unsafe Tier-2 shop, while still profiting from cheap prices.",
    "human rights": "Basic rights every person has simply because they are human, not earned as a reward and not a gift from a government.",
    "udhr": "The Universal Declaration of Human Rights (1948): 30 rules adopted by the UN saying what every human being on Earth is owed.",
    "declaration": "A formal written promise of shared goals. Unlike a law or court order, a declaration has no police force and cannot arrest anyone.",
    "charter": "The Canadian Charter of Rights and Freedoms (1982): part of Canada's Constitution. Canadian judges can enforce it and cancel laws that break it.",
    "reasonable limits": "Section 1 of the Charter: rights in Canada are not unlimited. A government can limit a right only if it can prove the limit is fair and necessary in a free, democratic society.",
    "notwithstanding": "Section 33 of the Charter: a rule that lets Parliament or a provincial government temporarily override sections 2, 7, or 15 for up to 5 years.",
    "veto": "A single 'NO' vote held by five permanent UN Security Council countries (USA, UK, France, Russia, China) that stops a binding UN action completely."
  },

  stations: [
    /* ---------------- S0 BRIEFING ---------------- */
    {
      id: "s0", nav: "BRIEFING", navSub: "The $14 Hoodie", title: "Halifax Newsroom: The $14 Hoodie Leak",
      kicker: "Stop 0 // Assignment Desk", day: 0,
      imgs: [{ src: "assets/s0_hoodie_leak.jpg", cap: "A $14 NorthStar Apparel hoodie from a Halifax mall beside a leaked factory photo from Dhaka." }],
      chars: [
        { key: "elena", quote: "You're an investigative journalist on our Halifax news desk, and you just got a scoop. A shopper bought this $14 NorthStar hoodie with a green '100% Ethically Audited' tag. Then a worker in Bangladesh sent us a secret photo showing the exact same hoodies stacked inside a cracked, padlocked building that is NOT on NorthStar's official factory list. Follow the trail." }
      ],
      words: ["tier-1 factory", "tier-2 factory", "supply chain", "subcontracting"],
      tabs: {
        dispatch: `<p><strong>Your role:</strong> You are a junior investigative journalist on a Halifax TV news desk.</p>
<p><strong>The scoop:</strong> Canadian clothing brand <strong>NorthStar Apparel</strong> sells a $14 hoodie in Halifax malls. Its green hangtag promises <em>"100% Ethically Audited Factories"</em> (meaning safety inspectors checked the factories).</p>
<p>Last night, a worker in <strong>Dhaka, Bangladesh</strong> sent an encrypted photo. It shows boxes of NorthStar hoodies inside an unmarked concrete building with a <strong>cracked support pillar</strong> and a <strong>padlocked fire exit</strong>.</p>`,
        evidence: `<p><strong>What is on your desk right now:</strong></p>
<ul><li><strong>Item A (The Hoodie):</strong> One $14 NorthStar hoodie bought in Halifax. The tag says <em>Made in Bangladesh</em>.</li>
<li><strong>Item B (Tier-1 List):</strong> NorthStar's public list of approved Dhaka factories. These official, inspected factories are called <strong>Tier-1 factories</strong>.</li>
<li><strong>Item C (The Leaked Photo):</strong> NorthStar hoodies being sewn inside a <em>different, uninspected</em> building that is <strong>not</strong> on the list. Secret overflow shops like this are called <strong>Tier-2 factories</strong>.</li></ul>`,
        toolkit: `<p><strong>Tier-1 vs. Tier-2 (know this before you start!):</strong></p>
<ul><li><strong>Tier-1 factory:</strong> The official, approved factory that NorthStar hires and inspects.</li>
<li><strong>Tier-2 factory:</strong> A secret, cheaper, uninspected workshop down the alley where extra work gets quietly sent.</li></ul>
<p><strong>How the sim works:</strong> Read all 3 middle tabs on each stop, then complete your <strong>Investigator Log</strong> on the right. Click any picture to zoom, or click <strong>Read this tab</strong> to hear it read aloud. Your work saves automatically.</p>`
      },
      task: "Read all 3 tabs, pick your class section on the right, then click READY to open Trace File 402.",
      fields: [
        { type: "section", label: "Your class section" },
        { type: "ack", label: "READY: OPEN TRACE FILE 402" }
      ]
    },

    /* ---------------- S1 PAPER TRAIL ---------------- */
    {
      id: "s1", nav: "STOP 1", navSub: "Paper Trail", title: "Halifax to Dhaka: The Cost Squeeze & Subcontracting",
      kicker: "Stop 1 // Follow the Money", day: 1,
      imgs: [{ src: "assets/s1_supply_chain.jpg", cap: "40-foot ocean containers cross from South Asia to Halifax for pennies per shirt, while rush orders push factories to subcontract." }],
      chars: [
        { key: "david", quote: "NorthStar inspects every approved Tier-1 factory on our official list. If Tariq secretly moved our order to a Tier-2 building without telling us, he broke our contract. We never approved it." },
        { key: "tariq", quote: "NorthStar demanded 40,000 hoodies in three weeks at a price that barely covers thread and electricity. If I say no, they move the order to another country. So yes, I subcontracted the extra work down the alley to a cheaper Tier-2 shop. Nobody from Toronto ever asks how we hit the deadline." }
      ],
      words: ["tier-1 factory", "tier-2 factory", "subcontracting", "plausible deniability"],
      tabs: {
        dispatch: `<p>Before visiting the secret Tier-2 workshop, you check the shipping numbers and interview two people:</p>
<ul><li><strong>David Chen (Toronto):</strong> PR (public relations) Director for NorthStar Apparel. His job is to protect the brand's image.</li>
<li><strong>Tariq Hassan (Dhaka):</strong> Manager of the official, inspected <strong>Tier-1 factory</strong> that NorthStar hired.</li></ul>
<p>Both men admit the hoodies were sewn in an uninspected <strong>Tier-2</strong> building down the alley. They completely disagree on who is to blame.</p>`,
        evidence: `<p><strong>Cost ledger (why brands make clothes overseas):</strong></p>
<ul><li><strong>Ocean shipping (Dhaka to Halifax):</strong> 60,000 shirts fit in one 40-foot cargo container (~$6,200 CAD) = just <strong>$0.10 CAD per shirt</strong>.</li>
<li><strong>Cost in Bangladesh:</strong> ~$0.17 CAD labour + $0.10 ocean shipping = <strong>$0.27 CAD per shirt</strong>.</li>
<li><strong>Cost in Canada:</strong> ~$4.13 CAD labour ($16.50/hr) + $0.05 local truck = <strong>$4.18 CAD per shirt</strong>.</li>
<li><strong>The inspection blind spot:</strong> NorthStar's safety auditor <em>only</em> checked Tariq's clean Tier-1 factory. They never checked the secret Tier-2 workshop down the alley.</li></ul>`,
        toolkit: `<p><strong>How Subcontracting creates Plausible Deniability:</strong></p>
<p><strong>Subcontracting</strong> means Tariq's official Tier-1 factory secretly passes overflow work to an uninspected Tier-2 shop. Because NorthStar sets impossible prices and deadlines - and only inspects Tier-1 - NorthStar gets cheap hoodies while staying officially "unaware" of Tier-2.</p>
<p>That shield is called <strong>plausible deniability</strong>: <em>"We can point to our clean Tier-1 audit and truthfully say we never officially knew about Tier-2."</em></p>`
      },
      task: "Make your Stop 1 call on the right, then explain it in 1-2 sentences using a clue from David, Tariq, or the cost numbers.",
      fields: [
        {
          type: "choice", f: "judgments.s1.choice", label: "Why does secret Tier-2 subcontracting shield NorthStar Apparel?",
          options: [
            "Ocean container shipping costs more per hoodie than Canadian factory labour",
            "NorthStar can point to its clean Tier-1 audit and claim it never officially knew about Tier-2",
            "Tier-2 workshops are already inspected by Canadian safety officers every month",
            "Tariq's Tier-1 factory charges NorthStar more than a Canadian plant would"
          ],
          correct: "NorthStar can point to its clean Tier-1 audit and claim it never officially knew about Tier-2",
          teachMap: {
            "Ocean container shipping costs more per hoodie than Canadian factory labour": { msg: "Elena Vance: Check the Evidence tab math - ocean shipping is only $0.10 CAD per shirt, far less than $4.13 Canadian labour." },
            "Tier-2 workshops are already inspected by Canadian safety officers every month": { msg: "Elena Vance: Check the blind spot in Tab 2 - NorthStar's auditor ONLY checked Tariq's Tier-1 plant, never Tier-2." },
            "Tariq's Tier-1 factory charges NorthStar more than a Canadian plant would": { msg: "Elena Vance: Check the ledger - Bangladesh is ~$0.27/shirt vs. $4.18 in Canada. Look at how plausible deniability works in Tab 3." }
          }
        },
        { type: "text", f: "judgments.s1.why", label: "Explain in 1-2 sentences using a clue from Tariq, David, or the cost ledger:", rows: 2, placeholder: "Tariq explained that... while David claimed..." }
      ]
    },

    /* ---------------- S2 INSIDE TIER-2 ---------------- */
    {
      id: "s2", nav: "STOP 2", navSub: "Inside Tier-2", title: "Inside the Tier-2 Workshop: Witness Testimony",
      kicker: "Stop 2 // Ground Evidence", day: 2,
      imgs: [{ src: "assets/s2_tier2_floor.jpg", cap: "Inside the uninspected Tier-2 workshop: long rows of machines, a cracked concrete pillar, and a padlocked exit." }],
      chars: [
        { key: "nadia", quote: "We work 12-hour shifts, six days a week, for about $0.68 Canadian an hour. When workers asked about the crack in the fourth-floor pillar, the supervisor told us to stop talking or lose our jobs. They padlock the stairwell door at night so nobody takes fabric home." }
      ],
      words: ["human rights"],
      tabs: {
        dispatch: `<p>Next, you speak privately with <strong>Nadia Rahman</strong>, a 21-year-old sewing worker inside the unmarked <strong>Tier-2 workshop</strong> (the uninspected building where the NorthStar hoodies were actually sewn).</p>
<p>Nadia's testimony mirrors real conditions uncovered by CBC reporters in the <em>Made in Bangladesh</em> documentary.</p>`,
        evidence: `<p><strong>Four specific red flags from Nadia's Tier-2 building:</strong></p>
<ul><li><strong>1. Physical danger (life-or-death):</strong> A visible crack runs through a concrete support pillar, and bosses padlock the fire-exit stairwell during shifts.</li>
<li><strong>2. Wages &amp; hours:</strong> ~$0.68 CAD per hour, mandatory 12-hour shifts, six days a week during rush orders.</li>
<li><strong>3. Silencing workers:</strong> Anyone who complains about safety or tries to form a union is threatened with being fired.</li>
<li><strong>4. Young workers (child labour):</strong> Two 14-year-old helpers trim loose threads on the floor instead of going to school.</li></ul>`,
        toolkit: `<p><strong>Why journalists log specific facts:</strong> Saying "the factory is bad" is too vague. You must separate <strong>immediate physical dangers</strong> (things that could kill workers today in a fire or collapse) from <strong>other rights violations</strong> (low pay, threats, kids missing school) so our lawyer can match each one to a written rule in Stop 3.</p>`
      },
      task: "Pick the most immediate life-or-death hazard, then list TWO other specific red flags from Tab 2.",
      fields: [
        {
          type: "choice", f: "judgments.s2.top", label: "Which red flag poses the most immediate danger to workers' lives right now?",
          options: [
            "Mandatory overtime during rush-order weeks",
            "The $0.68 CAD hourly wage paid to sewing operators",
            "The cracked concrete support pillar and padlocked fire exit",
            "Two 14-year-old helpers missing school to trim threads"
          ],
          correct: "The cracked concrete support pillar and padlocked fire exit",
          teachMap: {
            "Mandatory overtime during rush-order weeks": { msg: "Elena Vance: Long hours are a serious rights issue, but look for the hazard that could kill workers instantly if a fire or collapse happens." },
            "The $0.68 CAD hourly wage paid to sewing operators": { msg: "Elena Vance: Low pay is unfair, but which physical hazard puts workers' lives in immediate danger right now?" },
            "Two 14-year-old helpers missing school to trim threads": { msg: "Elena Vance: Child labour is a major red flag (save it for your written box below!), but which hazard threatens everyone's life right this minute?" }
          }
        },
        { type: "text", f: "judgments.s2.flags", label: "List TWO other specific red flags from Nadia's evidence tab (wages, voice, or youth):", rows: 2, placeholder: "1) ... 2) ..." }
      ]
    },

    /* ---------------- S3 TOOLKIT A: UDHR ---------------- */
    {
      id: "s3", nav: "STOP 3", navSub: "UN & UDHR", title: "Toolkit A: The World's Standard (UN & UDHR 1948)",
      kicker: "Stop 3 // International Human Rights", day: 3,
      imgs: [{ src: "assets/s3_udhr_assembly.jpg", cap: "The United Nations General Assembly: 193 member countries, founded in 1945 after WWII." }],
      chars: [
        { key: "amira", quote: "You have solid evidence. Now let's name the rules being broken. In 1948, after World War II, the United Nations adopted the Universal Declaration of Human Rights - 30 articles saying what every human being on Earth is owed. Let's match Nadia's facts to the exact articles." }
      ],
      words: ["human rights", "udhr", "declaration"],
      tabs: {
        dispatch: `<p>Human rights lawyer <strong>Amira Osei</strong> opens Document #1 in your toolkit: the <strong>Universal Declaration of Human Rights (UDHR, 1948)</strong>.</p>
<p><strong>What is the UN?</strong> The <strong>United Nations</strong> was founded in 1945 (right after WWII, with Canada as a founding member). Today <strong>193 countries</strong> belong to it. Its job in three phrases: <strong>keep peace, protect rights, deliver aid</strong>.</p>`,
        evidence: `<p><strong>Key UDHR Articles in plain English (use this list for the 4 questions on the right!):</strong></p>
<ul><li><strong>Articles 1 &amp; 2:</strong> Everyone is born free and equal, with no discrimination.</li>
<li><strong>Article 3:</strong> Right to <strong>life, liberty, and security of person</strong> (being physically safe from harm or death).</li>
<li><strong>Article 19:</strong> Freedom of <strong>opinion and expression</strong> (speaking up about problems without being punished).</li>
<li><strong>Articles 23 &amp; 24:</strong> Right to <strong>safe working conditions, fair pay, rest, and reasonable hours</strong>, plus the right to join a union.</li>
<li><strong>Article 26:</strong> Right to <strong>education</strong> (free schooling for youth - this is why child labour breaks Article 26).</li></ul>`,
        toolkit: `<p><strong>Important limit of the UDHR:</strong> The UDHR is a <strong>declaration</strong> (a shared promise), <em>not</em> a binding law with police. There is no "UN Police Force" that can walk into a Dhaka factory and arrest an owner. Instead, it is the <strong>global standard</strong> countries and journalists use to call out abuses.</p>`
      },
      task: "Use the UDHR list in Tab 2 to match each of Nadia's 4 factory clues to the exact UDHR article.",
      fields: [
        {
          type: "choice", f: "matches.udhr_safety", label: "1. Padlocked fire exit and cracked concrete column breaks which UDHR article most directly?",
          options: [
            "Article 19 (Freedom of opinion and expression)",
            "Article 3 (Life, liberty, and security of person)",
            "Article 26 (Right to education)"
          ],
          correct: "Article 3 (Life, liberty, and security of person)",
          teachMap: {
            "Article 19 (Freedom of opinion and expression)": { msg: "Amira Osei: Article 19 is about speaking up. Check Tab 2 for the article that protects life and physical security." },
            "Article 26 (Right to education)": { msg: "Amira Osei: Article 26 covers schooling. Look at Tab 2 for the article about life and physical safety." }
          }
        },
        {
          type: "choice", f: "matches.udhr_voice", label: "2. Threatening to fire workers who speak up about safety breaks which UDHR article?",
          options: [
            "Article 26 (Right to education)",
            "Article 14 (Right to seek asylum)",
            "Article 19 (Freedom of opinion and expression)"
          ],
          correct: "Article 19 (Freedom of opinion and expression)",
          teachMap: {
            "Article 26 (Right to education)": { msg: "Amira Osei: Check Tab 2 - which article protects speaking up without fear?" },
            "Article 14 (Right to seek asylum)": { msg: "Amira Osei: Asylum is about fleeing persecution across borders. Check Tab 2 for freedom of opinion and expression." }
          }
        },
        {
          type: "choice", f: "matches.udhr_work", label: "3. Paying $0.68/hr for mandatory 12-hour shifts breaks which UDHR articles?",
          options: [
            "Articles 23 & 24 (Safe work, fair pay, reasonable hours)",
            "Article 5 (No torture)",
            "Article 26 (Right to education)"
          ],
          correct: "Articles 23 & 24 (Safe work, fair pay, reasonable hours)",
          teachMap: {
            "Article 5 (No torture)": { msg: "Amira Osei: Check Tab 2 - which pair of articles specifically covers fair pay, rest, and reasonable hours?" },
            "Article 26 (Right to education)": { msg: "Amira Osei: Article 26 is about school. Look at Tab 2 for fair pay and working hours." }
          }
        },
        {
          type: "choice", f: "matches.udhr_youth", label: "4. Fourteen-year-olds trimming threads on the factory floor instead of going to school breaks which article?",
          options: [
            "Article 19 (Freedom of opinion)",
            "Article 26 (Right to education)",
            "Article 3 (Life and security)"
          ],
          correct: "Article 26 (Right to education)",
          teachMap: {
            "Article 19 (Freedom of opinion)": { msg: "Amira Osei: Check Tab 2 - which article specifically covers school and child labour?" },
            "Article 3 (Life and security)": { msg: "Amira Osei: Check Tab 2 - the question focuses on 14-year-olds missing school." }
          }
        }
      ]
    },

    /* ---------------- S4 TOOLKIT B: CHARTER ---------------- */
    {
      id: "s4", nav: "STOP 4", navSub: "Burnside Test", title: "Toolkit B: The Burnside Test (Canadian Charter 1982)",
      kicker: "Stop 4 // Promise vs. Teeth", day: 4,
      imgs: [{ src: "assets/s4_burnside_charter.jpg", cap: "What happens if Nadia's workshop is moved to Burnside Industrial Park in Halifax? Canadian law and the Charter have court-enforced teeth." }],
      chars: [
        { key: "amira", quote: "Try a thought experiment: pick up Nadia's Tier-2 factory and drop it in Burnside Industrial Park in Halifax tomorrow morning. Within hours, safety inspectors shut it down and Canadian courts enforce the law. That is the difference between a declaration and a constitution." }
      ],
      words: ["charter", "reasonable limits", "notwithstanding"],
      tabs: {
        dispatch: `<p><strong>Why is this called the Burnside Test?</strong> Burnside Industrial Park is right across the harbour in Dartmouth/Halifax. Imagine picking up Nadia's unsafe Dhaka workshop and dropping it in Burnside tomorrow morning.</p>
<p>In Canada, safety inspectors would shut it down within hours, and our highest law - the <strong>Canadian Charter of Rights and Freedoms (1982)</strong> - sits inside Canada's Constitution. Judges can <strong>strike down (cancel)</strong> any Canadian government law that breaks it.</p>`,
        evidence: `<p><strong>Five Canadian Charter sections to know:</strong></p>
<ul><li><strong>Section 2 (Fundamental Freedoms):</strong> protects free expression, peaceful protest, and association (including forming or joining a union).</li>
<li><strong>Section 7 (Life, Liberty &amp; Security):</strong> government cannot take away your physical safety or freedom unfairly.</li>
<li><strong>Section 15 (Equality):</strong> equal protection under the law with no discrimination.</li>
<li><strong>Section 1 (Reasonable Limits):</strong> rights in Canada are not 100% unlimited - a government can limit a right if it proves the limit is fair in a free, democratic society.</li>
<li><strong>Section 33 (Notwithstanding Clause):</strong> lets a Canadian government temporarily override sections 2, 7, or 15 for up to 5 years.</li></ul>`,
        toolkit: `<p><strong>Promise vs. Teeth (the key difference):</strong></p>
<ul><li><strong>UDHR (Global):</strong> applies to every human on Earth, but has <strong>no court or police of its own</strong>. Its power is public pressure.</li>
<li><strong>Charter + Canadian Law (Canada only):</strong> backed by <strong>real courts, judges, inspectors, fines, and shutdown orders</strong> - <em>but only inside Canada's borders</em>. A Canadian court has no legal power (jurisdiction) inside Bangladesh.</li></ul>`
      },
      task: "Compare the UDHR and Canada's Charter on the right, then explain why a Canadian court cannot shut down a factory in Dhaka.",
      fields: [
        {
          type: "choice", f: "judgments.s4.section", label: "If a Canadian government tried to ban workers from speaking out or forming a union, which Charter section protects them?",
          options: [
            "Section 33 (Notwithstanding clause)",
            "Section 1 (Reasonable limits)",
            "Section 2 (Fundamental freedoms: expression and association)"
          ],
          correct: "Section 2 (Fundamental freedoms: expression and association)",
          teachMap: {
            "Section 33 (Notwithstanding clause)": { msg: "Amira Osei: Section 33 lets a government override rights temporarily. Check Tab 2 for the section that protects expression and unions." },
            "Section 1 (Reasonable limits)": { msg: "Amira Osei: Section 1 allows justified limits on rights. Look at Tab 2 for the section protecting expression and association." }
          }
        },
        {
          type: "choice", f: "judgments.s4.teeth", label: "What is the biggest practical difference between the UDHR and Canada's Charter?",
          options: [
            "The UDHR only applies to Canada, while the Charter applies to all 193 UN countries",
            "Canadian courts can enforce the Charter and strike down laws; the UDHR is a global standard with no police or court of its own",
            "The Charter cannot ever be limited or overridden under any circumstances"
          ],
          correct: "Canadian courts can enforce the Charter and strike down laws; the UDHR is a global standard with no police or court of its own",
          teachMap: {
            "The UDHR only applies to Canada, while the Charter applies to all 193 UN countries": { msg: "Amira Osei: Flipped! The UDHR is global (193 UN countries), while the Charter applies inside Canada." },
            "The Charter cannot ever be limited or overridden under any circumstances": { msg: "Amira Osei: Check Tab 2 - Section 1 (Reasonable Limits) and Section 33 (Notwithstanding) both allow limits. Compare 'Promise vs. Teeth' in Tab 3." }
          }
        },
        { type: "text", f: "judgments.s4.why", label: "In 1-2 sentences, why can't a Canadian court simply walk into Dhaka and shut down Nadia's Tier-2 factory?", rows: 2, placeholder: "Canadian courts and the Charter only have power inside..." }
      ]
    },

    /* ---------------- S5 ENFORCEMENT GAP ---------------- */
    {
      id: "s5", nav: "STOP 5", navSub: "UN & Action", title: "The Enforcement Gap: Why Didn't the UN Stop It?",
      kicker: "Stop 5 // Action vs. Inaction", day: 5,
      imgs: [{ src: "assets/s5_enforcement_gap.jpg", cap: "The UN Security Council: five permanent members hold a veto, while the 193-country General Assembly can only pass recommendations." }],
      chars: [
        { key: "amira", quote: "Students always ask: if 193 countries signed on to the UN, why didn't the UN stop unsafe factories? Look at the two rooms in New York. The General Assembly has 193 votes, but cannot force action. The Security Council CAN make binding orders - except five powerful countries each hold a single-vote VETO." }
      ],
      words: ["veto", "declaration"],
      tabs: {
        dispatch: `<p>Here is the core question of Global Citizenship (Outcome <strong>U6A</strong>): <strong>if a local government does not enforce safety rules and the UN cannot send police, what actually forces change?</strong></p>
<p><strong>Real-world history (Rana Plaza, 2013):</strong> In Bangladesh, an 8-storey garment building with visible cracks collapsed and killed over 1,100 workers. That tragedy forced the world to test what actually works when inaction fails.</p>`,
        evidence: `<p><strong>Two UN rooms (why the UN gets stuck):</strong></p>
<ul><li><strong>UN General Assembly (193 countries):</strong> one country, one vote - like a global town hall. It passes recommendations, but <strong>cannot force</strong> a country to obey.</li>
<li><strong>UN Security Council (15 countries):</strong> the only UN room with binding power (sanctions or peacekeepers) - <strong>but 5 permanent countries (USA, UK, France, Russia, China)</strong> can each block any action with a single <strong>veto ("no" vote)</strong>.</li></ul>
<p><strong>What actually forced brands to act after Rana Plaza:</strong> (1) journalists exposing brand logos in the rubble, (2) the legally binding <strong>Bangladesh Safety Accord</strong> signed by 200+ brands, (3) shopper pressure, and (4) new supply-chain laws in countries like Canada.</p>`,
        toolkit: `<p><strong>How to solve the 4-step chain on the right:</strong> Put the 4 sentences in order from <strong>Step 1 (what starts the problem in Toronto)</strong> -> <strong>Step 2 (what Tier-1 does in Dhaka)</strong> -> <strong>Step 3 (why neither Canadian courts nor UN police step in)</strong> -> <strong>Step 4 (what finally forces change)</strong>.</p>`
      },
      task: "Number the 4 steps from 1 (start) to 4 (result), then choose the strongest pressure tool on Western brands.",
      fields: [
        {
          type: "order", f: "responses.chain", label: "Number these 4 steps from 1 (start) to 4 (result) to show how the global enforcement gap works:",
          items: [
            { k: "c", t: "UDHR rights are broken, but neither Canadian courts nor UN police can raid the building" },
            { k: "a", t: "Canadian brand demands ultra-cheap hoodies on a tight deadline" },
            { k: "d", t: "Change only begins when media, binding brand accords, or laws force accountability" },
            { k: "b", t: "Tier-1 factory secretly subcontracts overflow to an uninspected Tier-2 shop" }
          ],
          expectOrder: { a: 1, b: 2, c: 3, d: 4 },
          stepHints: {
            "1": "Start at the beginning: what pressure triggers the whole chain from Toronto?",
            "2": "Once the tight, cheap order arrives in Dhaka, what does the Tier-1 manager do next?",
            "3": "Inside the hidden Tier-2 shop, why doesn't a Canadian court or UN police force step in?",
            "4": "Finish with what actually forces accountability at the end of the chain."
          }
        },
        {
          type: "choice", f: "judgments.s5.tool", label: "When a local government won't enforce safety rules, which pressure tool has the strongest real teeth on Western brands?",
          options: [
            "Passing a non-binding speech with no inspection or follow-up",
            "Legally binding safety accords and domestic laws that hold Western brands financially responsible for their whole supply chain",
            "Hoping factories voluntarily double their prices without any outside pressure"
          ],
          correct: "Legally binding safety accords and domestic laws that hold Western brands financially responsible for their whole supply chain",
          teachMap: {
            "Passing a non-binding speech with no inspection or follow-up": { msg: "Amira Osei: Non-binding speeches have no legal teeth. Check Tab 2 for what actually moved brands after Rana Plaza." },
            "Hoping factories voluntarily double their prices without any outside pressure": { msg: "Amira Osei: Remember Tariq in Stop 1 - if a factory raises prices alone, brands just move the order. Look at Tab 2 for binding pressure tools." }
          }
        }
      ]
    },

    /* ---------------- S6 BROADCAST VERDICT (COMMIT) ---------------- */
    {
      id: "s6", nav: "STOP 6", navSub: "Your Verdict", title: "6:00 PM Broadcast: File Your Final Verdict",
      kicker: "Stop 6 // Final Report (Commit Gate)", day: 6,
      imgs: [{ src: "assets/s6_broadcast_desk.jpg", cap: "The Halifax newsroom studio at 6:00 PM: time to deliver your evidence-backed verdict on air." }],
      chars: [
        { key: "elena", quote: "Cameras roll in five minutes. Give Halifax viewers a sharp, evidence-backed verdict: name the human rights broken, say who holds the most responsibility, and evaluate BOTH an intended and an unintended consequence of taking action." }
      ],
      words: ["udhr", "plausible deniability"],
      tabs: {
        dispatch: `<p>This is your final investigative report for the 6:00 PM Halifax broadcast.</p>
<p>There is <strong>no single "right" opinion</strong> on Question 1 - what matters is backing up your choice with a real fact from the case, a UDHR article number, a realistic action, and a thoughtful look at both good and bad side effects.</p>`,
        evidence: `<p><strong>Quick cheat-sheet of your evidence (use these in boxes 2, 3, and 4!):</strong></p>
<ul><li><strong>Cost math:</strong> $0.17 labour + $0.10 shipping = $0.27/shirt in Bangladesh vs. $4.18 in Canada.</li>
<li><strong>Tier-2 facts:</strong> $0.68/hr, 12-hr shifts, cracked pillar, padlocked fire exit, firing threats, 14-year-olds working instead of school.</li>
<li><strong>UDHR Articles:</strong> Art. 3 (safety/life), Art. 19 (speaking up), Art. 23-24 (fair pay &amp; hours), Art. 26 (education).</li></ul>`,
        toolkit: `<p><strong>Intended vs. Unintended Consequences (Outcome U6A):</strong></p>
<ul><li><strong>Intended consequence:</strong> the positive result you are <em>trying</em> to make happen (example: forcing brands to pay for safe buildings).</li>
<li><strong>Unintended consequence:</strong> an accidental side effect you <em>didn't</em> want (example: if brands suddenly boycott a country overnight, thousands of workers like Nadia could lose their only income).</li></ul>`
      },
      task: "Fill in all 4 verdict boxes on the right, then click COMMIT MY BROADCAST VERDICT to unlock Case Closed.",
      fields: [
        {
          type: "choice", f: "responses.verdict_resp", label: "1. Who holds the MOST responsibility for fixing unsafe Tier-2 conditions?",
          options: [
            "Western clothing brands (they set the prices, deadlines, and profit most)",
            "Local factory owners and governments (they run the buildings and enforce local laws)",
            "Canadian shoppers (our demand for $14 hoodies drives the race to the bottom)",
            "Shared responsibility across brands, governments, and shoppers"
          ]
        },
        { type: "text", f: "responses.verdict_evidence", label: "2. Support your choice above with ONE specific fact from the case AND ONE UDHR article number:", rows: 2, placeholder: "I chose ___ because in this case ___ which breaks UDHR Article..." },
        { type: "text", f: "responses.verdict_action", label: "3. Propose ONE realistic action Canadians, brands, or governments should take:", rows: 2, placeholder: "One realistic action is..." },
        { type: "text", f: "responses.verdict_conseq", label: "4. Evaluate consequences (U6A): name ONE intended consequence AND ONE possible unintended consequence of your action:", rows: 3, placeholder: "Intended: ... Unintended: ..." },
        { type: "commit", label: "COMMIT MY BROADCAST VERDICT" }
      ],
      commitStation: true
    },

    /* ---------------- S7 CASE CLOSED ---------------- */
    {
      id: "s7", nav: "CASE CLOSED", navSub: "Aftermath & File", title: "Case Closed: Real-World Aftermath & Your File",
      kicker: "Debrief // Unlocked after commit", day: 6,
      locked: true,
      imgs: [{ src: "assets/s6_broadcast_desk.jpg", cap: "Broadcast complete. Compare your case file with what happened in the real world after Rana Plaza." }],
      chars: [
        { key: "elena", quote: "Great broadcast. Open Tab 3 (Your File) to review your entire investigation log, then check Tab 4 to see how this launches you into our UN Veto Trap and the Country Profile Project." }
      ],
      words: ["udhr", "charter", "veto"],
      tabLabels: { dispatch: "1. Real-World Aftermath", evidence: "2. Promise vs. Teeth Recap", yourfile: "3. Your File", toolkit: "4. Next Up: Veto & Project" },
      tabs: {
        dispatch: `<p><strong>What actually happened in the real world after the 2013 Rana Plaza collapse?</strong></p>
<ul><li><strong>The Bangladesh Accord (now the International Accord):</strong> Over 200 global brands signed a legally binding safety agreement funding independent structural and fire inspections in thousands of factories.</li>
<li><strong>Canada's 2024 Supply Chains Act (Bill S-211):</strong> Large Canadian companies must now publish annual public reports on what they are doing to prevent forced and child labour in their supply chains.</li>
<li><strong>The ongoing gap:</strong> Critics note that reporting laws still have weaker teeth than direct legal liability, and wages remain far below a living wage. Global citizenship is ongoing work.</li></ul>`,
        evidence: `<p><strong>Your Rights Toolkit (keep this for your Country Profile Project!):</strong></p>
<ul><li><strong>UN (1945):</strong> 193 members. General Assembly = world opinion; Security Council = binding power, but 5 permanent members hold a <strong>veto</strong>.</li>
<li><strong>UDHR (1948):</strong> 30 articles - the global human-rights standard (Art. 1, 2, 3, 5, 14, 19, 23-24, 26). Power = pressure, not police.</li>
<li><strong>Canadian Charter (1982):</strong> Canada's highest law (s.2, s.7, s.15, plus s.1 reasonable limits &amp; s.33 notwithstanding). Power = real courts.</li></ul>`,
        yourfile: "@review",
        toolkit: `<p><strong>Coming up next in Citizenship 9:</strong></p>
<ul><li><strong>Next class:</strong> <em>The UN Security Council Veto Trap</em> - step inside the council chamber and test why global inaction happens.</li>
<li><strong>Then:</strong> <a href="../Country-Profile-Project/index.html" style="color:var(--teal)">Country Profile Project</a> - pick 1 of 39 countries, audit its promises vs. actions using the exact UDHR + Charter lens you just practiced!</li></ul>`
      },
      task: "Review Your File in Tab 3, then add one optional closing reflection.",
      fields: [
        { type: "text", f: "responses.selfcheck", label: "Optional: Which country or global human-rights issue are you most curious to investigate next?", rows: 2, placeholder: "I want to investigate...", optional: true }
      ]
    }
  ],

  key: [
    { st: "STOP 1", label: "Why subcontracting shields brands", f: "judgments.s1.choice", whyF: "judgments.s1.why", answer: "NorthStar can point to its clean Tier-1 audit and claim it never officially knew about Tier-2", note: "Plausible deniability lets brands keep low prices while staying officially unaware of Tier-2 shortcuts." },
    { st: "STOP 2", label: "Most immediate physical danger", f: "judgments.s2.top", whyF: "judgments.s2.flags", answer: "The cracked concrete support pillar and padlocked fire exit", note: "Structural cracks and locked exits mirror the exact hazards that made the 2013 Rana Plaza collapse deadly." },
    { st: "STOP 3", label: "UDHR: Locked exit & cracked pillar", f: "matches.udhr_safety", answer: "Article 3 (Life, liberty, and security of person)" },
    { st: "STOP 3", label: "UDHR: Silencing worker complaints", f: "matches.udhr_voice", answer: "Article 19 (Freedom of opinion and expression)" },
    { st: "STOP 3", label: "UDHR: $0.68/hr & 12-hr shifts", f: "matches.udhr_work", answer: "Articles 23 & 24 (Safe work, fair pay, reasonable hours)" },
    { st: "STOP 3", label: "UDHR: 14-year-olds on floor", f: "matches.udhr_youth", answer: "Article 26 (Right to education)" },
    { st: "STOP 4", label: "Charter: Worker voice & unions", f: "judgments.s4.section", answer: "Section 2 (Fundamental freedoms: expression and association)" },
    { st: "STOP 4", label: "UDHR vs. Charter difference", f: "judgments.s4.teeth", whyF: "judgments.s4.why", answer: "Canadian courts can enforce the Charter and strike down laws; the UDHR is a global standard with no police or court of its own" },
    { st: "STOP 5", label: "4-step enforcement gap chain", f: "responses.chain", order: { a: 1, b: 2, c: 3, d: 4 }, orderText: "1. Cheap rush order -> 2. Secret Tier-2 subcontracting -> 3. Enforcement gap -> 4. Media, accords, or laws force accountability" },
    { st: "STOP 5", label: "Strongest real-world pressure tool", f: "judgments.s5.tool", answer: "Legally binding safety accords and domestic laws that hold Western brands financially responsible for their whole supply chain" }
  ],

  callbacks: {}
};

window.TRACE402 = TRACE402;
window.CASE55 = TRACE402;
