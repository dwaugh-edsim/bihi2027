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
    "supply chain": "Every step it takes to turn raw materials into a product on a store shelf, from cotton field to factory to container ship to mall.",
    "subcontracting": "When an approved factory (Tier-1) secretly passes part of an order to a cheaper, uninspected factory (Tier-2).",
    "plausible deniability": "Setting things up so a company can truthfully say 'we did not officially know' while still profiting from the shortcut.",
    "human rights": "Basic rights every person has simply because they are human, not earned as a reward and not a gift from a government.",
    "udhr": "The Universal Declaration of Human Rights (1948): 30 articles adopted by the UN as the world's shared human-rights standard.",
    "declaration": "A formal statement of shared standards. Unlike a law or court order, a declaration cannot by itself send police or strike down laws.",
    "charter": "The Canadian Charter of Rights and Freedoms (1982): part of Canada's Constitution. Canadian courts can enforce it and strike down laws that break it.",
    "reasonable limits": "Section 1 of the Charter: rights in Canada are not absolute, and governments can limit them if the limit is justified in a free and democratic society.",
    "notwithstanding": "Section 33 of the Charter: lets Parliament or a provincial legislature override sections 2, 7, or 15 for up to five years at a time.",
    "veto": "The power held by five permanent UN Security Council members (USA, UK, France, Russia, China) to block a binding action with a single 'no' vote."
  },

  stations: [
    /* ---------------- S0 BRIEFING ---------------- */
    {
      id: "s0", nav: "BRIEFING", navSub: "The $14 Hoodie", title: "Halifax Newsroom: The $14 Hoodie Leak",
      kicker: "Stop 0 // Assignment Desk", day: 0,
      imgs: [{ src: "assets/s0_hoodie_leak.jpg", cap: "A $14 NorthStar Apparel hoodie from a Halifax mall beside a leaked factory photo from Dhaka." }],
      chars: [
        { key: "elena", quote: "You just watched how clothes travel from Dhaka to Halifax. Today you are on the investigative desk. A Halifax shopper bought this $14 hoodie with a green '100% Ethically Audited' tag - then a worker in Bangladesh sent us a photo of the same hoodies stacked inside a cracked, padlocked building that is NOT on the brand's official list. Follow the trail." }
      ],
      words: ["supply chain", "subcontracting"],
      tabs: {
        dispatch: `<p>You are a junior investigator on a Halifax television news desk.</p>
<p><strong>The tip:</strong> Canadian brand <strong>NorthStar Apparel</strong> sells a $14 hoodie in Halifax malls with a bright green hangtag promising <em>"100% Ethically Audited Factories."</em></p>
<p>Last night, an encrypted photo arrived from Dhaka, Bangladesh. It shows boxes of NorthStar hoodies inside an unmarked concrete building with a cracked support column and a padlocked exit door.</p>`,
        evidence: `<p><strong>What sits on your desk right now:</strong></p>
<ul><li><strong>Item A:</strong> One $14 NorthStar hoodie bought in Halifax, tag reading <em>Made in Bangladesh</em>.</li>
<li><strong>Item B:</strong> NorthStar's public list of approved Dhaka factories (called <strong>Tier-1</strong> suppliers).</li>
<li><strong>Item C:</strong> A leaked photo showing NorthStar labels inside a different building that does <strong>not</strong> appear on NorthStar's public list.</li></ul>`,
        toolkit: `<p><strong>How this investigation works:</strong> each stop on the left unlocks the next part of the trail. Read the three middle tabs, then record your calls in the <strong>Investigator Log</strong> on the right. Click any image to zoom, or press <strong>Read this tab</strong> to hear the page aloud. Your work saves automatically.</p>`
      },
      task: "Read the three tabs, pick your class section, then press READY to open Trace File 402.",
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
        { key: "david", quote: "NorthStar inspects every approved Tier-1 factory on our list. If a manager secretly moved our order to another building without telling us, they broke our contract. We did not authorize it." },
        { key: "tariq", quote: "NorthStar demanded 40,000 hoodies in three weeks at a price that barely covers thread and electricity. If I say no, they move the order to another country. So yes, I sent the overflow down the alley to a Tier-2 shop. Nobody from Toronto ever asks how we hit the deadline." }
      ],
      words: ["subcontracting", "plausible deniability"],
      tabs: {
        dispatch: `<p>Before you enter the hidden Tier-2 workshop, you check the shipping numbers and interview both <strong>David Chen</strong> (NorthStar PR in Toronto) and <strong>Tariq Hassan</strong> (the approved Tier-1 factory manager in Dhaka).</p>
<p>Both men agree on one fact: the hoodies were sewn in an uninspected Tier-2 building. They completely disagree on who is to blame.</p>`,
        evidence: `<p><strong>Numbers from the shipping manifest &amp; cost ledger:</strong></p>
<ul><li><strong>Ocean freight (Dhaka to Halifax):</strong> 60,000 shirts fit in one 40-foot container (~$6,200 CAD) = <strong>$0.10 CAD per shirt</strong>.</li>
<li><strong>Bangladesh per-shirt estimate:</strong> ~$0.17 CAD labour + $0.10 ocean shipping = <strong>$0.27 CAD</strong>.</li>
<li><strong>Canada per-shirt estimate:</strong> ~$4.13 CAD labour ($16.50/hr) + $0.05 local truck = <strong>$4.18 CAD</strong>.</li>
<li><strong>The blind spot:</strong> NorthStar's safety auditor only checked Tariq's clean Tier-1 plant, never the Tier-2 shop down the alley.</li></ul>`,
        toolkit: `<p><strong>Key concept: Plausible deniability.</strong> When a buyer sets impossible prices and deadlines, then only inspects Tier-1, the buyer gets cheap clothes while staying officially "unaware" of Tier-2. As investigators say: <em>"If you don't want to know the answer, don't ask the question."</em></p>`
      },
      task: "Make your Stop 1 call on how subcontracting shields Western brands, then justify it with one clue.",
      fields: [
        {
          type: "choice", f: "judgments.s1.choice", label: "Why does secret Tier-2 subcontracting shield NorthStar Apparel?",
          options: [
            "NorthStar can point to its clean Tier-1 audit and claim it never officially knew about Tier-2",
            "Shipping across the ocean is more expensive than Canadian labour",
            "Tier-2 factories are inspected by Canadian courts every month",
            "Customers in Halifax only buy hoodies made in Nova Scotia"
          ]
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
        dispatch: `<p>You speak privately with <strong>Nadia Rahman</strong>, a 21-year-old sewing operator inside the unmarked Tier-2 building where the NorthStar hoodies were found.</p>
<p>Think back to the <em>CBC Fifth Estate: Made in Bangladesh</em> documentary you watched: Nadia's story mirrors the exact conditions reporters uncovered in real garment factories.</p>`,
        evidence: `<p><strong>Field notes from Nadia's Tier-2 building:</strong></p>
<ul><li><strong>Wages &amp; hours:</strong> ~$0.68 CAD/hour, mandatory 12-hour shifts, six days a week during rush orders.</li>
<li><strong>Physical safety:</strong> visible crack in a concrete support column; fire-exit stairwell padlocked during shifts.</li>
<li><strong>Worker voice:</strong> workers who complain about safety or try to organize a union are threatened with firing.</li>
<li><strong>Young workers:</strong> two 14-year-old helpers trim loose threads on the floor instead of attending school.</li></ul>`,
        toolkit: `<p><strong>Connecting your Viewing Guide:</strong> A newsroom never just says "conditions are bad." Investigators document <strong>specific, verifiable facts</strong> (wages, hours, exits, threats) so human-rights lawyers can match each fact to a written rule.</p>`
      },
      task: "Log the specific human-rights red flags from Nadia's building before meeting our human-rights lawyer.",
      fields: [
        {
          type: "choice", f: "judgments.s2.top", label: "Which red flag poses the most immediate danger to workers' lives right now?",
          options: [
            "The cracked concrete support pillar and padlocked fire exit",
            "The colour of the fabric bolts stacked near the machines",
            "The shipping time from Dhaka to Halifax",
            "The font size on the hoodie hangtag"
          ]
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
        dispatch: `<p>Human rights lawyer <strong>Amira Osei</strong> opens the first document in your legal toolkit: the <strong>Universal Declaration of Human Rights (UDHR, 1948)</strong>.</p>
<p>Founded in 1945 (with Canada as a founding member), the <strong>United Nations</strong> now has <strong>193 member countries</strong>. Its job in three verbs: <strong>keep peace, protect rights, deliver aid</strong>.</p>`,
        evidence: `<p><strong>Key UDHR Articles in plain words:</strong></p>
<ul><li><strong>Article 1 &amp; 2:</strong> Born free and equal in dignity and rights, with no discrimination.</li>
<li><strong>Article 3:</strong> Right to <strong>life, liberty, and security of person</strong> (being physically safe).</li>
<li><strong>Article 19:</strong> Freedom of <strong>opinion and expression</strong> (speaking up without fear).</li>
<li><strong>Article 23 &amp; 24:</strong> Right to <strong>safe working conditions, fair pay, rest, and reasonable hours</strong>, and to form a union.</li>
<li><strong>Article 26:</strong> Right to <strong>education</strong> (free in the early years - why child labour breaks this article).</li></ul>`,
        toolkit: `<p><strong>Honesty check on the UDHR:</strong> The UDHR is a <strong>declaration</strong>, not a binding police law. There is no "UN Police Force" that can walk into a Dhaka factory and arrest an owner. Instead, it is the <strong>global standard</strong> the world uses to measure countries and apply pressure.</p>`
      },
      task: "Use Amira's UDHR list to match Nadia's factory evidence to the exact UDHR articles.",
      fields: [
        {
          type: "choice", f: "matches.udhr_safety", label: "1. Padlocked fire exit and cracked concrete column breaks which UDHR article most directly?",
          options: [
            "Article 3 (Life, liberty, and security of person)",
            "Article 19 (Freedom of opinion and expression)",
            "Article 26 (Right to education)"
          ]
        },
        {
          type: "choice", f: "matches.udhr_voice", label: "2. Threatening to fire workers who speak up about safety breaks which UDHR article?",
          options: [
            "Article 19 (Freedom of opinion and expression)",
            "Article 26 (Right to education)",
            "Article 14 (Right to seek asylum)"
          ]
        },
        {
          type: "choice", f: "matches.udhr_work", label: "3. Paying $0.68/hr for mandatory 12-hour shifts breaks which UDHR articles?",
          options: [
            "Articles 23 & 24 (Safe work, fair pay, reasonable hours)",
            "Article 5 (No torture)",
            "Article 26 (Right to education)"
          ]
        },
        {
          type: "choice", f: "matches.udhr_youth", label: "4. Fourteen-year-olds trimming threads on the factory floor instead of going to school breaks which article?",
          options: [
            "Article 26 (Right to education)",
            "Article 19 (Freedom of opinion)",
            "Article 3 (Life and security)"
          ]
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
        dispatch: `<p>Now Amira compares the world's standard (<strong>UDHR</strong>) with Canada's highest law: the <strong>Canadian Charter of Rights and Freedoms (1982)</strong>.</p>
<p>Remember how Donald Marshall Jr.'s treaty case ran through Canada's courts? The Charter sits inside Canada's Constitution: any government law that breaks it can be <strong>struck down by judges</strong>.</p>`,
        evidence: `<p><strong>Five Charter sections to know:</strong></p>
<ul><li><strong>Section 2 (Fundamental Freedoms):</strong> expression, peaceful assembly, association (including joining unions).</li>
<li><strong>Section 7 (Life, Liberty &amp; Security):</strong> government cannot take away your safety or liberty unfairly.</li>
<li><strong>Section 15 (Equality):</strong> equal protection and treatment under the law without discrimination.</li>
<li><strong>Section 1 (Reasonable Limits):</strong> rights are not absolute; limits must be justified in a free and democratic society.</li>
<li><strong>Section 33 (Notwithstanding Clause):</strong> a government can temporarily override sections 2, 7, or 15 for up to 5 years.</li></ul>`,
        toolkit: `<p><strong>Same idea, different teeth:</strong></p>
<ul><li><strong>UDHR (Global):</strong> applies to every human everywhere, but has <strong>no court of its own</strong>. Its power is pressure.</li>
<li><strong>Charter + Canadian Labour Law (Canada):</strong> applies inside Canada to government action, backed by <strong>real courts, inspectors, fines, and shutdown orders</strong>.</li></ul>`
      },
      task: "Apply the Burnside Test: compare the UDHR and the Canadian Charter on protection and enforcement.",
      fields: [
        {
          type: "choice", f: "judgments.s4.section", label: "If a Canadian government tried to ban workers from speaking out or forming a union, which Charter section protects them?",
          options: [
            "Section 2 (Fundamental freedoms: expression and association)",
            "Section 33 (Notwithstanding clause)",
            "Section 1 (Reasonable limits)"
          ]
        },
        {
          type: "choice", f: "judgments.s4.teeth", label: "What is the biggest practical difference between the UDHR and Canada's Charter?",
          options: [
            "Canadian courts can enforce the Charter and strike down laws; the UDHR is a global standard with no police or court of its own",
            "The UDHR only applies to Canada, while the Charter applies to all 193 UN countries",
            "The Charter cannot ever be limited or overridden under any circumstances"
          ]
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
        dispatch: `<p>Here is the hardest question in Global Citizenship (Outcome <strong>U6A</strong>): <strong>if a government fails to protect rights and the UN cannot send police, what actually forces change?</strong></p>
<p>After the real 2013 Rana Plaza factory collapse in Bangladesh killed over 1,100 garment workers, the world had to test what works when inaction fails.</p>`,
        evidence: `<p><strong>Two UN rooms + Real-world pressure tools:</strong></p>
<ul><li><strong>UN General Assembly (193 seats):</strong> one country, one vote. Passes resolutions (the world's official opinion), but cannot force a country to obey.</li>
<li><strong>UN Security Council (15 seats):</strong> binding power (sanctions, peacekeepers), but <strong>5 permanent members (USA, UK, France, Russia, China)</strong> can block any action with one <strong>veto</strong>.</li>
<li><strong>What actually moved brands after Rana Plaza:</strong> (1) investigative media exposing logos in the rubble, (2) the legally binding <strong>Bangladesh Safety Accord</strong> signed by 200+ brands, (3) public shopper pressure, and (4) new supply-chain transparency laws in countries like Canada.</li></ul>`,
        toolkit: `<p><strong>Preview of next class:</strong> Next class you will step inside the <strong>UN Security Council Veto Trap</strong> simulation to see firsthand how one country's self-interest can freeze global action - and then choose your own country for the <strong>Country Profile Project</strong>.</p>`
      },
      task: "Order the 4-step chain of how inaction happens - then choose the strongest real-world pressure tool.",
      fields: [
        {
          type: "order", f: "responses.chain", label: "Number these 4 steps from 1 (start) to 4 (result) to show how the global enforcement gap works:",
          items: [
            { k: "a", t: "Canadian brand demands ultra-cheap hoodies on a tight deadline" },
            { k: "b", t: "Tier-1 factory secretly subcontracts overflow to an uninspected Tier-2 shop" },
            { k: "c", t: "UDHR rights are broken, but neither Canadian courts nor UN police can raid the building" },
            { k: "d", t: "Change only begins when media, binding brand accords, or laws force accountability" }
          ]
        },
        {
          type: "choice", f: "judgments.s5.tool", label: "When a local government won't enforce safety rules, which pressure tool has the strongest real teeth on Western brands?",
          options: [
            "Legally binding safety accords and domestic laws that hold Western brands financially responsible for their whole supply chain",
            "Hoping factories voluntarily double their prices without any outside pressure",
            "Passing a non-binding speech with no inspection or follow-up"
          ]
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
        dispatch: `<p>This is your final investigative report for the 6:00 PM broadcast.</p>
<p>Every part of this verdict directly prepares you for your <strong>Country Profile Project</strong>: naming the rights standard, weighing responsibility, and evaluating <strong>intended and unintended consequences</strong> of action or inaction.</p>`,
        evidence: `<p><strong>Quick evidence checklist from your trail:</strong></p>
<ul><li><strong>Cost math:</strong> $0.17 labour + $0.10 ocean freight = $0.27/shirt in Bangladesh vs. $4.18 in Canada.</li>
<li><strong>Tier-2 facts:</strong> $0.68/hr, 12-hr shifts, cracked pillar, padlocked exit, threats to quiet workers, 14-year-olds on floor.</li>
<li><strong>Rights frameworks:</strong> UDHR (Art. 3, 19, 23-24, 26 = global standard) vs. Charter (s.2, s.7, s.15 = Canadian court teeth).</li></ul>`,
        toolkit: `<p><strong>Think like a global citizen (Outcome U6A):</strong> Every action has side effects. Example: if brands suddenly boycott a country overnight, an <em>intended</em> consequence might be punishing unsafe owners, while an <em>unintended</em> consequence could be thousands of workers like Nadia losing their only income. Weigh both!</p>`
      },
      task: "Complete all 4 verdict entries below, then click COMMIT MY BROADCAST VERDICT to unlock Case Closed.",
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
