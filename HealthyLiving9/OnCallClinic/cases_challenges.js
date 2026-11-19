/* ============================================================================
   ON-CALL: ROOM 8 CLINIC - Interactive Clinical Challenges Bank (20 Cases)
   Challenge types:
     - "rx"     : Multi-select clinical orders (pick ALL correct, avoid traps)
     - "triage" : Sort 3 patients/items into exact clinical buckets
     - "order"  : Click 4 steps into exact chronological/protocol order (1..4)
     - "slider" : Set the clinical dial to the accurate number (with tolerance)
   Zero em/en dashes. Grade 9 Nova Scotia curriculum.
   ============================================================================ */
window.ONCALL_CHALLENGES = [
  /* ---------------- INFECTIOUS DISEASE (5 challenges) ---------------- */
  { id:"ch_inf1", kind:"rx", dept:"infectious", tier:1, patient:"School Outbreak Desk",
    complaint:"Norovirus classroom cleanup orders", vitals:"Stomach virus confirmed | 18 cases in West Wing",
    quote:"The custodian and vice-principal are waiting for your signed cleanup and handwashing orders.",
    q:"Select ALL 2 correct clinical orders (leave the 2 ineffective ones unchecked):",
    items:[
      { t:"Disinfect taps, fountains, and handles with chlorine bleach solution", ok:true },
      { t:"Require 20-second soap and running-water handwashing before lunch", ok:true },
      { t:"Switch all washrooms to alcohol hand-sanitizer gel only", ok:false },
      { t:"Prescribe preventive penicillin tablets to exposed classrooms", ok:false }
    ],
    pearl:"Norovirus resists alcohol gel and antibiotics (it is a virus). Chlorine bleach plus 20-second soap-and-water washing breaks the chain." },

  { id:"ch_inf2", kind:"triage", dept:"infectious", tier:2, patient:"Walk-In Triage Board",
    complaint:"3 patients waiting - match each to the right treatment", vitals:"Busy Tuesday afternoon clinic",
    quote:"Sort these three infectious-disease patients into the right treatment bucket before rounds.",
    q:"Assign each patient to the accurate clinical bucket:",
    buckets:["Antibiotics (Bacterial)","Supportive Care (Viral)","911 / ER Immediately"],
    rows:[
      { t:"14yo with confirmed rapid-swab Group A Strep throat", ans:0 },
      { t:"15yo with 2-day runny nose, mild cough, normal breathing", ans:1 },
      { t:"15yo with high fever, stiff neck, confusion, and purple spots", ans:2 }
    ],
    pearl:"Confirmed strep is bacterial (antibiotics), routine colds are viral (rest/fluids), and fever + stiff neck + purple rash is a 911 meningitis emergency." },

  { id:"ch_inf3", kind:"order", dept:"infectious", tier:2, patient:"Epidemiology Board",
    complaint:"Trace the 4-step fomite chain of infection", vitals:"Classroom tablet outbreak",
    quote:"Click these four events in exact chronological order (1 to 4) to show how a fomite spreads a stomach virus.",
    q:"Build the 4-step transmission chain in order:",
    steps:[
      "A student who returned to school too early touches a shared classroom tablet",
      "Tough virus particles survive on the plastic screen as a contaminated fomite",
      "A healthy classmate uses the same tablet and skips soap before eating lunch",
      "The classmate eats a sandwich, carrying the virus into the mouth portal of entry"
    ],
    pearl:"Hands act as a shuttle between fomites and open portals of entry. Soap and water before eating snaps Link 3." },

  { id:"ch_inf4", kind:"slider", dept:"infectious", tier:3, patient:"Marcus, 14 (Follow-Up)",
    complaint:"Return-to-school clearance timer", vitals:"Last vomited at 8:00 PM | No fever",
    quote:"I feel totally fine today! How many FULL symptom-free hours does Nova Scotia Public Health say I must stay home after GI symptoms stop?",
    q:"Set the clinical dial to the required symptom-free exclusion hours:",
    min:6, max:72, step:6, unit:"hours", target:48, tol:6,
    pearl:"Nova Scotia Public Health recommends staying home for 48 full hours AFTER vomiting and diarrhea stop because norovirus keeps shedding." },

  { id:"ch_inf5", kind:"slider", dept:"infectious", tier:4, patient:"Regional Immunization Desk",
    complaint:"Measles herd-immunity threshold", vitals:"Airborne virus | High contagiousness (R0 12-18)",
    quote:"Because measles lingers in indoor air for up to 2 hours, roughly what percentage of a community needs immunity to stop outbreaks?",
    q:"Set the dial to the approximate measles herd-immunity threshold:",
    min:50, max:100, step:5, unit:"%", target:95, tol:5,
    pearl:"Airborne measles is so contagious that communities need about 95% immunity coverage to maintain herd immunity." },

  /* ---------------- SEXUAL & REPRODUCTIVE HEALTH (5 challenges) ---------------- */
  { id:"ch_rep1", kind:"triage", dept:"repro", tier:1, patient:"Youth Health Clinic Desk",
    complaint:"Classify 3 STIs by treatment category", vitals:"Lab & prevention review",
    quote:"Match each infection to whether it is bacterial (curable with antibiotics) or viral (managed / vaccine-preventable).",
    q:"Sort all 3 infections into the right category:",
    buckets:["Bacterial (Curable with Antibiotics)","Viral (Managed / Vaccine-Preventable)"],
    rows:[
      { t:"Chlamydia (often asymptomatic; urine/swab test)", ans:0 },
      { t:"HPV (preventable with school-based vaccine)", ans:1 },
      { t:"Syphilis (painless sore that can vanish untreated)", ans:0 }
    ],
    pearl:"Chlamydia, gonorrhea, and syphilis are bacterial and curable with antibiotics. HPV, HSV, HIV, and Hep B are viral." },

  { id:"ch_rep2", kind:"rx", dept:"repro", tier:2, patient:"Jordan, 15",
    complaint:"Post-positive chlamydia care plan", vitals:"Urine test positive | Prescribed antibiotics",
    quote:"I picked up my antibiotics from the pharmacy. What else do I actually need to do so this doesn't come right back?",
    q:"Select ALL 3 correct clinical steps (leave the 1 unsafe option unchecked):",
    items:[
      { t:"Finish the full prescribed antibiotic course exactly as directed", ok:true },
      { t:"Make sure current sexual partner(s) get tested and treated too", ok:true },
      { t:"Pause sexual contact for 7 days until both partners finish treatment", ok:true },
      { t:"Share half of your own pill bottle with your partner to save a trip", ok:false }
    ],
    pearl:"Never split one prescription between two people (neither gets a full cure). Both partners need full treatment plus a 7-day pause to prevent reinfection." },

  { id:"ch_rep3", kind:"slider", dept:"repro", tier:2, patient:"Maya, 15 (Pharmacy Counter)",
    complaint:"Standard emergency contraception window", vitals:"Condom slipped | Asking about levonorgestrel (Plan B)",
    quote:"How many hours is the standard labelled best-effectiveness window for over-the-counter levonorgestrel (Plan B)?",
    q:"Set the dial to the labelled window in hours (sooner is always better):",
    min:12, max:168, step:12, unit:"hours", target:72, tol:12,
    pearl:"Levonorgestrel (Plan B) is labelled for up to 72 hours (3 days), though ulipristal (ella) works to 5 days and a copper IUD up to 7 days." },

  { id:"ch_rep4", kind:"rx", dept:"repro", tier:3, patient:"Sam, 15",
    complaint:"Condom reliability audit", vitals:"Barrier protection consult",
    quote:"Which habits actually KEEP a latex condom strong and reliable in real life?",
    q:"Select ALL 2 safe practices (avoid the 2 latex-damaging mistakes):",
    items:[
      { t:"Check the expiry date and store flat in a cool, dry spot", ok:true },
      { t:"Pair latex condoms with water-based or silicone-based lubricant", ok:true },
      { t:"Layer two condoms together for extra strength", ok:false },
      { t:"Use baby oil or petroleum jelly with latex condoms", ok:false }
    ],
    pearl:"Double-layering causes friction tears, and oil-based products dissolve latex. Cool storage + water/silicone lube protects the barrier." },

  { id:"ch_rep5", kind:"slider", dept:"repro", tier:4, patient:"Nadia, 16",
    complaint:"Home pregnancy test timing", vitals:"Condom broke 48 hours ago | Negative test today",
    quote:"If you do not know when your next period is due, how many DAYS after unprotected sex should you wait for an accurate home pregnancy test?",
    q:"Set the dial to the reliable wait time in days:",
    min:3, max:35, step:1, unit:"days", target:21, tol:3,
    pearl:"Testing at 48 hours is far too early for hCG hormone levels to rise. Wait until a missed period or 21 days (3 weeks) after exposure." },

  /* ---------------- SLEEP & SCREEN SCIENCE (5 challenges) ---------------- */
  { id:"ch_slp1", kind:"slider", dept:"sleep", tier:1, patient:"Jaden, 14",
    complaint:"Canadian teen sleep guideline", vitals:"Currently sleeping 5.5 hours on school nights",
    quote:"What is the MINIMUM number of hours of sleep per night recommended for a 14-to-17-year-old?",
    q:"Set the sleep dial to the recommended minimum hours:",
    min:4, max:12, step:1, unit:"hours", target:8, tol:1,
    pearl:"Canadian 24-Hour Movement Guidelines recommend 8 to 10 uninterrupted hours of sleep per night for ages 14-17." },

  { id:"ch_slp2", kind:"rx", dept:"sleep", tier:1, patient:"Noah, 14",
    complaint:"Bedroom sleep-hygiene rescue plan", vitals:"Wakes up 6x/night | Room hot & bright",
    quote:"Build a realistic bedroom reset plan that actually fixes my broken sleep.",
    q:"Select ALL 3 evidence-based sleep upgrades (avoid the 1 sleep killer):",
    items:[
      { t:"Park the phone outside the bedroom and use a basic alarm clock", ok:true },
      { t:"Keep the bedroom cool (~18-19 C) and dark", ok:true },
      { t:"Stop screens 30-60 minutes before bed with a calm offline wind-down", ok:true },
      { t:"Take a 2-hour nap at 5:30 PM every afternoon to catch up", ok:false }
    ],
    pearl:"Parking the phone, cooling/darkening the room, and winding down offline rebuild continuous deep and REM sleep. Long late naps drain bedtime sleep drive." },

  { id:"ch_slp3", kind:"order", dept:"sleep", tier:2, patient:"Circadian Lab",
    complaint:"Order the evening-to-morning sleep cycle", vitals:"24-hour biological clock",
    quote:"Click these four biological steps into the right sequence from evening wind-down to morning wake-up.",
    q:"Put the circadian sequence in order (1 to 4):",
    steps:[
      "Dim evening lighting allows the brain to release melatonin on schedule",
      "Early-night cycles focus heavily on Deep (Slow-Wave) physical tissue repair",
      "Final-hours cycles shift toward REM sleep for memory and emotional reset",
      "Bright natural morning sunlight shuts off melatonin and starts the daytime clock"
    ],
    pearl:"Protecting both ends of the night matters: Deep sleep repairs the body early, REM consolidates memory late, and morning light resets the timer." },

  { id:"ch_slp4", kind:"triage", dept:"sleep", tier:3, patient:"Hook Machine Audit",
    complaint:"Classify 3 evening habits by sleep impact", vitals:"Digital health clinic",
    quote:"Sort these three teen habits into whether they HELP sleep, HURT via blue light/arousal, or HURT via chemical stimulation.",
    q:"Match each habit to its primary mechanism:",
    buckets:["Supports Circadian Rhythm","Cognitive Arousal / Light Delay","Chemical Sleep-Drive Blocker"],
    rows:[
      { t:"Drinking a 500 mL caffeinated energy drink at 7:00 PM", ans:2 },
      { t:"Getting 15 minutes of outdoor morning daylight at 8:00 AM", ans:0 },
      { t:"Reading heated group-chat drama in bed at 11:45 PM", ans:1 }
    ],
    pearl:"Caffeine chemically plugs adenosine receptors for hours, late drama spikes arousal/light delay, and morning sunlight anchors your biological clock." },

  { id:"ch_slp5", kind:"slider", dept:"sleep", tier:4, patient:"Caleb, 15",
    complaint:"Caffeine half-life calculation", vitals:"Drank 160 mg energy drink at 6:00 PM",
    quote:"Caffeine has roughly a 5-to-6-hour half-life in most teens. About how many HOURS after drinking it is HALF that caffeine still active in your brain?",
    q:"Set the dial to caffeine's approximate half-life in hours:",
    min:1, max:12, step:1, unit:"hours", target:5, tol:1,
    pearl:"With a ~5-6 hour half-life, half of a 6:00 PM energy drink is still blocking sleep receptors at 11:00 PM to midnight." },

  /* ---------------- HEALTH NAVIGATION & BOUNDARIES (5 challenges) ---------------- */
  { id:"ch_nav1", kind:"triage", dept:"nav", tier:1, patient:"Nova Scotia Care Navigator",
    complaint:"Route 3 Halifax residents to the right door", vitals:"NS Health System Triage",
    quote:"Match each Halifax teen to the smartest Nova Scotia health service.",
    q:"Assign each case to the right NS service:",
    buckets:["911 / Emergency Room","811 (Free 24/7 RN Line)","NS Pharmacist / Clinic"],
    rows:[
      { t:"Sudden wheezing and swelling lips after eating an unmarked cookie", ans:0 },
      { t:"Unsure at 9 PM whether a 38 C fever can wait until tomorrow", ans:1 },
      { t:"Needs assessment for uncomplicated pink eye or birth control", ans:2 }
    ],
    pearl:"Using 911 for true emergencies, 811 for 24/7 nurse triage, and NS pharmacists for minor ailments gets you faster care and protects the ER." },

  { id:"ch_nav2", kind:"order", dept:"nav", tier:2, patient:"Emergency Bystander Drill",
    complaint:"Anaphylaxis (severe allergic reaction) response", vitals:"Classmate wheezing + hives | EpiPen in backpack",
    quote:"Seconds count! Put these four anaphylaxis response steps in the exact right order.",
    q:"Build the 4-step emergency sequence (1 to 4):",
    steps:[
      "Recognize severe allergy signs (wheezing, swelling, dizziness) and grab the EpiPen",
      "Inject epinephrine immediately into the outer mid-thigh (even through clothing)",
      "Call 911 immediately and keep the person lying flat (or seated if breathing is easier)",
      "Stay with them and monitor breathing in case a second dose is needed before EMS arrives"
    ],
    pearl:"Epinephrine ALWAYS comes first in anaphylaxis - never wait for antihistamine pills to kick in - followed immediately by 911." },

  { id:"ch_nav3", kind:"rx", dept:"nav", tier:3, patient:"Online Safety Desk",
    complaint:"Sextortion emergency protocol", vitals:"Account threatening to leak private image unless paid",
    quote:"A friend is panicking because an online account is demanding $200 or they will share a private photo. What steps protect them?",
    q:"Select ALL 3 safe steps (leave the 1 dangerous trap unchecked):",
    items:[
      { t:"Stop replying immediately, screenshot evidence, and block the account", ok:true },
      { t:"Tell a trusted adult right away so you are not handling it alone", ok:true },
      { t:"Report via Cybertip.ca and use NeedHelpNow.ca for image-removal support", ok:true },
      { t:"Send a small payment once to convince them to delete the file", ok:false }
    ],
    pearl:"Paying sextortionists almost always leads to more demands. Preserve evidence, cut contact, get adult support, and use NeedHelpNow.ca." },

  { id:"ch_nav4", kind:"order", dept:"nav", tier:3, patient:"Party Safety Protocol",
    complaint:"Friend unresponsive from alcohol poisoning", vitals:"Cold skin, slow breathing, will not wake",
    quote:"Put these four life-saving bystander steps in exact order.",
    q:"Sequence the emergency response (1 to 4):",
    steps:[
      "Try waking them loudly and check if their breathing is slow or irregular",
      "Call 911 immediately and give the exact street address clearly",
      "Roll them onto their side into the recovery position to protect their airway",
      "Stay beside them until paramedics arrive and tell EMS honestly what was consumed"
    ],
    pearl:"Never leave an intoxicated person alone to 'sleep it off' on their back. 911 + recovery position saves lives." },

  { id:"ch_nav5", kind:"rx", dept:"nav", tier:4, patient:"Clinic Self-Advocacy Check",
    complaint:"First solo clinic appointment prep", vitals:"15yo seeing a nurse practitioner alone",
    quote:"Which habits help a teen get accurate, safe care when visiting a clinic or pharmacist independently?",
    q:"Select ALL 3 strong self-advocacy habits (leave the 1 risky habit unchecked):",
    items:[
      { t:"Write down 2-3 main symptoms or questions in phone notes beforehand", ok:true },
      { t:"Check active ingredients on OTC meds to avoid accidental double-dosing", ok:true },
      { t:"Ask 'what warning signs mean I should come back or go to the ER?'", ok:true },
      { t:"Stop prescribed medication early without asking if an influencer suggests a detox tea", ok:false }
    ],
    pearl:"Bringing written questions, reading active ingredients, and asking about red-flag return signs are core lifelong health-literacy skills." }
];
