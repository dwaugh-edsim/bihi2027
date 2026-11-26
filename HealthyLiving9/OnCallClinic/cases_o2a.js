/* ============================================================================
   ON-CALL: ROOM 8 CLINIC - O2A Wing: Media, Myths & Fine Print (18 cases)
   New clinic wing aligned with HL9 O2A (Myth Trials, The Fine Print,
   Nobody Told Me, PSA media literacy, Hook Machine tech design).
   10 multiple-choice cases + 8 interactive challenges (tiers 1-4, 1 boss).
   Two extra sleep-math sliders (dept:sleep) apply the Class 1 formulas.
   Zero em/en dashes. Grade 9 Nova Scotia / Dartmouth curriculum.
   ============================================================================ */
window.ONCALL_CASES = window.ONCALL_CASES || [];
window.ONCALL_CHALLENGES = window.ONCALL_CHALLENGES || [];

window.ONCALL_CASES.push(
  {
    id:"oa01", dept:"o2a", tier:1, patient:"Kayla, 14",
    complaint:"Energy drink ad promises A+ focus",
    vitals:"Poster: DRINK FOCUS MAX - Now with BRAIN VITAMINS! (tiny text: not a health product)",
    quote:"The corner store poster says this drink gives you laser focus for exams. My friend bought three. Is the poster right?",
    q:"What should Kayla notice about this ad first?",
    opts:[
      "Big claims in ads are backed by law, so the drink must work",
      "Marketing claims on posters are not medical proof, and the tiny disclaimer ('not a health product') quietly cancels the big claim",
      "The word VITAMINS means Health Canada approved it as medicine",
      "Store posters are peer-reviewed before printing"
    ],
    ans:1,
    pearl:"Ads are built to sell, not to inform. The Fine Print habit: look for the tiny qualifier text. In Canada, food and drinks are not approved health products, so a tiny 'not a health product' line means the big claim is marketing, not medicine."
  },
  {
    id:"oa02", dept:"o2a", tier:1, patient:"Devin, 15",
    complaint:"Favourite influencer keeps posting a sports drink link",
    vitals:"Post caption has no hashtag and starts with 'I could not believe this actually works...'",
    quote:"This fitness influencer I follow keeps raving about this sports drink. My friend says she would tell us if she was being paid. Would she?",
    q:"What is the accurate answer about influencer posts?",
    opts:[
      "Paid influencers must always announce it clearly, so no hashtag means it is definitely unpaid",
      "In Canada, ads must be identifiable as ads: undisclosed paid posts can break the rules, so treat unnamed-brand praise with suspicion",
      "Influencers are health professionals, so their drink claims are medically reviewed",
      "Only TV ads have disclosure rules; social media is unregulated everywhere"
    ],
    ans:1,
    pearl:"In Canada (Competition Bureau and ASC rules), advertising must be recognizable as advertising. If an influencer praises a product with no disclosure of payment or partnership, that is a red flag, not proof of honesty."
  },
  {
    id:"oa03", dept:"o2a", tier:1, patient:"Mia, 14",
    complaint:"Detox tea advertised as a 7-day miracle",
    vitals:"Testimonials only, no studies mentioned | Price: 45 dollars",
    quote:"The ad says the tea flushes toxins out of your body in 7 days. There are like 50 before-and-after photos. That is a lot of proof, right?",
    q:"What is wrong with this 'proof'?",
    opts:[
      "Testimonial photos are personal stories, not controlled evidence, and 'detox' is a marketing word: your liver and kidneys already remove waste",
      "Fifty photos equals fifty scientific studies",
      "Before-and-after photos cannot be edited or cherry-picked, so they are reliable",
      "The word 'miracle' means Health Canada tested the tea"
    ],
    ans:1,
    pearl:"Testimonials are stories, not science: photos can be posed, edited, or cherry-picked. No food or tea 'detoxes' you: the liver and kidneys do that job. A product selling solutions to a fake problem is a classic Fine Print trap."
  },
  {
    id:"oa04", dept:"o2a", tier:2, patient:"Jordan, 15",
    complaint:"Three hours gone - the app never stops",
    vitals:"Pull-to-refresh feed | Random notifications | Intended 20-minute session",
    quote:"I opened the app to check one message and suddenly it is midnight. It feels like the app WANTS me to keep scrolling. Is that my imagination?",
    q:"What design feature is most responsible for Jordan's lost 3 hours?",
    opts:[
      "The pull-to-refresh slot machine effect: variable, unpredictable rewards keep you pulling for the next surprise",
      "The app uses too few ads, so scrolling feels relaxing",
      "Phones lose their clock at night, which confuses users",
      "Nothing: apps have no design techniques that affect attention"
    ],
    ans:0,
    pearl:"Hook Machine design: unpredictable rewards (likes, new posts) arrive on a variable schedule, exactly like a slot machine. Pull-to-refresh, autoplay, and infinite scroll are deliberately engineered to make stopping feel unnatural."
  },
  {
    id:"oa05", dept:"o2a", tier:2, patient:"Ava, 14",
    complaint:"Autoplay ate her whole evening",
    vitals:"Streaming service countdown ring: next episode in 5, 4, 3...",
    quote:"I meant to watch ONE episode. The next one started before I even found the remote. How come the app does not just stop?",
    q:"Which Hook Machine technique is autoplay designed around?",
    opts:[
      "Removing the natural stopping cue so the default choice becomes keep watching instead of stop",
      "Making buttons bigger so viewers can leave faster",
      "Improving video quality so strongly that viewers fall asleep",
      "Sending a reminder when the viewer has watched too long"
    ],
    ans:0,
    pearl:"Autoplay deletes the moment of choice. In Hook Machine language, the stopping cue is engineered away, so continuing is automatic and quitting takes effort. Design your own rules: turn off autoplay and put the remote across the room."
  },
  {
    id:"oa06", dept:"o2a", tier:2, patient:"Ruben, 15",
    complaint:"Researching a health claim for his PSA project",
    vitals:"Search results: personal blog (2026), no author | Health Canada page, reviewed and dated | Grade 8 wiki page",
    quote:"For my PSA I need to check whether melatonin is safe for teens. Three sites came up. Which do I actually trust?",
    q:"What is the most credible source chain for a health claim?",
    opts:[
      "The personal blog, because it posted most recently",
      "The Health Canada page, because it is an official body, is dated, is reviewed, and cites evidence",
      "The Grade 8 wiki page, because it is written by students for students",
      "All three sources carry equal authority so averaging them is best"
    ],
    ans:1,
    pearl:"Source triage in order: official health bodies and peer-reviewed evidence first, then reputable news with named authors, then everyone else. Check three things: WHO wrote it, WHEN it was dated, and WHAT evidence backs it."
  },
  {
    id:"oa07", dept:"o2a", tier:3, patient:"PSA Planning Desk (Ibrahim, 15)",
    complaint:"Which persuasion technique is this PSA using?",
    vitals:"Scene: a real ER nurse tearfully describing a vaping patient she treated",
    quote:"In my PSA, a real nurse cries while telling one patient's story. My partner says it is logos because a nurse is professional. Is he right?",
    q:"What is this technique, correctly named?",
    opts:[
      "Logos, because any professional speaker automatically counts as logical evidence",
      "Ethos plus pathos: the nurse's credibility (ethos) and the emotional story (pathos), though the PSA still needs facts (logos)",
      "Pathos only, and credibility never matters in persuasion",
      "Kairos, because tears mean the timing of the ad"
    ],
    ans:1,
    pearl:"Persuasion has three classic tools: ethos (credibility of the speaker), pathos (emotion), and logos (facts and logic). A nurse's story leans on ethos + pathos; a strong PSA still adds logos - real numbers and evidence - so emotion does not carry it alone."
  },
  {
    id:"oa08", dept:"o2a", tier:3, patient:"Chloe, 15",
    complaint:"Nobody told her the vape ads were missing some facts",
    vitals:"Ad shows friends laughing on a beach with sleek vape sticks | Caption: 'Heavy on flavour, light on everything else'",
    quote:"The ads make it look like everyone vapes and it is just flavour and good times. What did nobody put in the ad?",
    opts:[
      "Nicotine's effects on the developing teen brain and heart, plus the fact most teens actually do NOT vape",
      "The name of the photographer",
      "Proof that the flavours are sugar-free",
      "The exact beach where commercials are filmed"
    ],
    ans:0,
    pearl:"Ads show the upsell, never the invoice. Vape ads omit nicotine's effects on teen brains and use normalization (everyone is doing it) even though the majority of Nova Scotia teens do not vape. Nobody Told Me training: ask what the ad leaves out."
  },
  {
    id:"oa09", dept:"o2a", tier:4, patient:"The Settings Audit (Mr. Rhys, 14)",
    complaint:"Brand-new phone, default settings untouched",
    vitals:"Location: ON for all apps | Personalized ads: ON | Screen-time limits: none | Auto-play videos: ON",
    quote:"I just got this phone. It tracks everywhere I go, decides which ads I see, and autoplay is on. Did I choose all this?",
    q:"What is the most accurate takeaway?",
    opts:[
      "Default settings are designed mainly for the user's wellbeing",
      "Defaults are chosen to benefit the platform (data, attention, ad revenue); auditing and changing them is a core digital self-defense skill",
      "Changing defaults voids the phone entirely",
      "Personalized ads do not use any personal data"
    ],
    ans:1,
    pearl:"Hook Machine economics: your data and attention are the product. Privacy and attention settings default to the platform's advantage, not yours. The addiction-by-design countermeasure is a deliberate audit: location, tracking, autoplay, notifications, and time limits."
  },
  {
    id:"oa10", dept:"o2a", tier:4, patient:"PSA Judging Panel",
    complaint:"Two PSA drafts, one to fund",
    vitals:"Draft A: shocking invented statistic + guilt-tripping | Draft B: cited Nova Scotia data + real student stories + clear action step",
    quote:"You are on the judging panel. Draft A is more shocking, Draft B is more accurate. Which gets funded and why?",
    q:"What is the strongest reason to fund Draft B?",
    opts:[
      "A credible PSA with cited local data and a clear action step persuades durably, while a false shocking statistic destroys trust the moment it is fact-checked",
      "Draft A is better because any attention is good attention",
      "Shocking invented statistics are fine if they point the right way",
      "The panel should fund whichever PSA costs less to produce"
    ],
    ans:0,
    pearl:"A credible PSA wins on accuracy plus action: cite real sources, use authentic local voices, and tell the audience exactly what to do. One invented statistic can discredit the whole campaign - and your peers will fact-check it."
  }
);

window.ONCALL_CHALLENGES.push(
  {
    id:"oa11", dept:"o2a", tier:1, kind:"myth",
    patient:"Myth Trials: Social Media Science",
    complaint:"3 viral claims, call each one",
    vitals:"Myth Trials format | O2A media unit",
    quote:"Three claims blowing up on your feed right now. Call each one TRUE or FALSE.",
    q:"Call all three statements TRUE or FALSE:",
    myths:[
      { t:"A post with 2 million views must be more accurate than a post with 200 views", ans:false },
      { t:"Health Canada and provincial health pages are more reliable sources than anonymous meme accounts", ans:true },
      { t:"If a health story is shared by a celebrity, that counts as medical evidence", ans:false }
    ],
    pearl:"Virality measures entertainment, not accuracy. Views and celebrity shares are popularity signals; official health bodies and cited evidence are accuracy signals. Never confuse the two."
  },
  {
    id:"oa12", dept:"o2a", tier:1, kind:"myth",
    patient:"Myth Trials: Screens & Sleep",
    complaint:"3 screen-time myths, call each one",
    vitals:"Myth Trials format | O2A + Sleep units",
    quote:"Your group chat is arguing about phones at night. Call each claim TRUE or FALSE.",
    q:"Call all three statements TRUE or FALSE:",
    myths:[
      { t:"Blue light at night can delay your sleep drive by confusing your body clock, even if the phone is 'just one video'", ans:true },
      { t:"Your brain instantly falls asleep the moment you stop scrolling, so late scrolling costs no sleep time", ans:false },
      { t:"Putting your phone to charge outside the bedroom weakens the Hook Machine cycle", ans:true }
    ],
    pearl:"Late scrolling delays sleep twice: light shifts your body clock, and the Hook Machine loop steals the wind-down time. Charging the phone outside the bedroom is the single most effective environmental fix."
  },
  {
    id:"oa13", dept:"o2a", tier:2, kind:"triage",
    patient:"Claim Triage Board",
    complaint:"Sort 3 health ad claims into the right bucket",
    vitals:"Buckets: Evidence-backed | Omitted costs (Fine Print) | Normalization tactic",
    quote:"Three ad claims just crossed the Room 8 media desk. Sort each claim by what is really going on.",
    q:"Sort each claim into the correct bucket:",
    buckets:["Evidence-backed claim","Fine Print omission","Normalization tactic (everyone does it)"],
    rows:[
      { t:"Canada's Food Guide recommends making water your drink of choice", ans:0 },
      { t:"A gym-membership ad showing only the 5-dollar first month, with the 59-dollar monthly rate in 6-point text", ans:1 },
      { t:"A vape ad featuring a whole friend group vaping, with the caption ' everybody's switching' ", ans:2 }
    ],
    pearl:"Three honest ad categories: real cited recommendations, omissions hiding in the fine print, and normalization (pretending everyone does it so you feel behind). Triage the tactic before you trust the claim."
  },
  {
    id:"oa14", dept:"o2a", tier:2, kind:"chart",
    patient:"The Fine Print Audit Table",
    complaint:"Compare two subscription plans line by line",
    vitals:"Column A: 5-dollar sticker | Column B: 12-dollar sticker",
    quote:"Study the table. One plan looks cheaper until you read every row. Choose the claim that matches the table.",
    q:"Which statement is supported by this table?",
    table:{ head:["Line item","Plan A sticker: 5 dollars","Plan B sticker: 12 dollars"],
      rows:[
        ["Intro period","First month only","None - flat rate"],
        ["Real monthly rate (month 2+)","19.99","12.00"],
        ["Cancel anytime","Yes, but 25-dollar exit fee","Yes, free"]
      ]},
    opts:[
      "Plan A is cheaper overall because its sticker price is lower",
      "Plan B costs less from month 2 onward and exits free, while Plan A's true cost is sticker price plus a tripled monthly rate and an exit fee",
      "Both plans cost exactly the same over a year",
      "The table proves subscription plans never have hidden fees"
    ],
    ans:1,
    pearl:"Fine Print math: a low sticker price plus a short intro period, a higher real rate, and an exit fee can cost more than an honest flat price. Always compute the YEARLY total and the exit cost before signing anything."
  },
  {
    id:"oa15", dept:"o2a", tier:2, kind:"rx",
    patient:"Credibility Lab",
    complaint:"What makes a health claim trustworthy?",
    vitals:"Evaluating a website for your PSA sources",
    quote:"Sign every genuine credibility marker (leave the 1 fake marker unchecked).",
    q:"Select ALL 3 real credibility markers:",
    items:[
      { t:"A named author and a review date, so you can check recency", ok:true },
      { t:"Citations to studies or official bodies like Health Canada", ok:true },
      { t:"A statement of who funds the site, so you can spot conflicts of interest", ok:true },
      { t:"A sleek professional design, which guarantees accuracy", ok:false }
    ],
    pearl:"Real credibility markers: named author, date, cited evidence, and funding disclosure. A polished design proves nothing - professional-looking sites are exactly how misinformation spreads."
  },
  {
    id:"oa16", dept:"o2a", tier:2, kind:"order",
    patient:"Misinformation Chain Board",
    complaint:"Trace the 4 steps of a viral false health claim",
    vitals:"Anonymous meme account | 40,000 shares overnight",
    quote:"Click these four events in the exact order (1 to 4) to show how a false claim goes from one sketchy post to your grandmother's feed.",
    q:"Build the misinformation chain in order:",
    steps:[
      "An anonymous account posts an invented statistic with a scary headline and no source",
      "Viewers share it instantly because it triggers fear, before anyone checks the source",
      "Algorithms amplify the engagement, pushing the post into thousands more feeds",
      "Family members now see it repeatedly, so repetition makes it feel true (illusory truth effect)"
    ],
    pearl:"Misinformation spreads in a chain: unverified claim, emotional share, algorithmic amplification, then repetition breeds false familiarity. Breaking the chain at step 2, a 10-second source check before sharing, is the media-immunity skill."
  },
  {
    id:"oa17", dept:"o2a", tier:3, kind:"match",
    patient:"Ad Technique Matching Board",
    complaint:"Match each persuasion trick to its real example",
    vitals:"Techniques used across energy drinks, vapes, and subscription apps",
    quote:"The advertising industry has standard moves. Match each technique on the left to the example that shows it.",
    q:"Match technique to example:",
    pairs:[
      { left:"Ethos (credibility)", right:"An ad puts an actor in a white lab coat beside words like clinically inspired" },
      { left:"Fear appeal", right:"A supplement ad warns you will fall behind classmates without their focus pills" },
      { left:"Normalization (everyone does it)", right:"A vape ad framed as the whole friend group's habit, captioned 'everybody's switching'" },
      { left:"Sunk-cost free trial", right:"An app reminds you that your 7 free days expire today so you subscribe without even opening it" }
    ],
    pearl:"Recognize the moves: fake credibility (props and lab coats), fear of missing out and falling behind, and sunk-cost urgency traps. Naming a technique when you see it is the fastest way to break its power."
  },
  {
    id:"oa18", dept:"o2a", tier:4, kind:"mc_custom", boss:true,
    patient:"BOSS: Chief Editor, Fine Print Division",
    complaint:"The gym contract, the influencer, and the sleep app",
    vitals:"Tier 4 double-points boss case | O2A comprehensive review",
    quote:"Final board review. Situation A: a gym contract with a 9.99-dollar sticker, a 39.99-dollar rate on page 4, and a 50-dollar exit fee. Situation B: an influencer 'just sharing' an unlabelled product and refusing to say if she is paid. Situation C: a sleep app that promises to fix your body clock with a 10-minute nightly quiz you must open right before bed. Which full analysis is best?",
    q:"Pick the most complete, accurate analysis:",
    opts:[
      "A is a fine-print trap (compute the yearly total and exit fee), B is a likely undisclosed ad (treat as marketing not advice), C is a Hook Machine loop pretending to be sleep hygiene",
      "A is a great deal because the sticker price is lowest, B is honest because she promised she is unpaid, C is medical therapy",
      "A, B, and C are all fine because buying things is a personal choice",
      "Only C is problematic, since apps before bed are always exercises"
    ],
    ans:0,
    pearl:"Full media literacy in one case: read the whole contract (fine print math), demand ad disclosure (influencer rules), and recognize an app that DRAGS you to your phone at bedtime as anti-sleep design. Tier 4 editors audit all three moves at once."
  }
);

/* ---------------- SLEEP-MATH FORENSIC SLIDERS (Class 1 formulas) ---------------- */
window.ONCALL_CHALLENGES.push(
  {
    id:"oasm1", dept:"sleep", tier:3, kind:"slider",
    patient:"Sleep Debt Forensics Desk",
    complaint:"Compute the weekly sleep debt (Class 1 formula)",
    vitals:"Bedtime deficit: 45 minutes every school night | 5 school nights",
    quote:"The telemetry shows this student loses 45 minutes of sleep every school night. Use the compounding debt formula to set the DIAL to the TOTAL weekly deficit.",
    q:"Set the dial to the total weekly sleep debt in minutes:",
    min:60, max:420, step:15, unit:"minutes", target:225, tol:15,
    pearl:"Compounding Sleep Debt = deficit per school night x 5 nights. 45 minutes x 5 = 225 minutes, about 3.75 hours of lost restorative sleep every single week."
  },
  {
    id:"oasm2", dept:"sleep", tier:4, kind:"slider",
    patient:"Annual Sleep Loss Audit",
    complaint:"Convert a weekly deficit into full 24-hour days lost per year",
    vitals:"Weekly deficit: 3.15 hours (38 minutes per school night) | 52 weeks | 24-hour days",
    quote:"The audit ledger shows a 3.15-hour weekly deficit. Use the annual lost time formula: (weekly deficit x 52) / 24. Set the DIAL to how many FULL 24-hour days of sleep vanish every year.",
    q:"Set the dial to the annual loss in full 24-hour days:",
    min:0, max:15, step:0.2, unit:"days", target:6.8, tol:0.5,
    pearl:"Annual Lost Time = (3.15 x 52) / 24 = 163.8 / 24 = about 6.8 full 24-hour days of sleep lost every year. That is a solid week of school spent awake that should have been spent restoring the teen brain."
  }
);
