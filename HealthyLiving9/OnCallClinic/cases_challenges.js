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
    pearl:"Bringing written questions, reading active ingredients, and asking about red-flag return signs are core lifelong health-literacy skills." },

  /* ============ WAVE 2: ESC / MATCH / MYTH / CHART (24 cases) ============ */

  /* ---- ESCALATE OR SEND HOME (6) ---- */
  { id:"ch_inf6", kind:"esc", dept:"infectious", tier:2, patient:"Triage Desk: Sore Throat",
    complaint:"14yo, rapid-swab positive Group A Strep", vitals:"Temp 38.2 C | Drinking fluids | No breathing trouble",
    quote:"The swab came back positive for strep throat. Does she need the Emergency Room tonight?",
    q:"Make the escalation call, then file the reason:",
    decision:"home",
    reasons:[
      { t:"Confirmed strep is bacterial: an NS pharmacist can assess and prescribe antibiotics, so home care works", ok:true },
      { t:"Admit to the ER immediately: all sore throats are emergencies", ok:false },
      { t:"Send home and forbid all fluids for 48 hours", ok:false }
    ],
    pearl:"Strep is bacterial and curable. Nova Scotia pharmacists assess and prescribe for minor ailments like strep using MSI, so the ER is for emergencies, not confirmed strep." },

  { id:"ch_inf7", kind:"esc", dept:"infectious", tier:3, patient:"Triage Desk: Rash and Fever",
    complaint:"15yo, high fever, stiff neck, confusion", vitals:"Purple spots spreading | Started this morning",
    quote:"His forehead feels burning hot, his neck is stiff, he is confused, and purple spots are spreading. Should we wait for morning?",
    q:"Make the escalation call, then file the reason:",
    decision:"admit",
    reasons:[
      { t:"Fever plus stiff neck, confusion, and purple spots are 911 emergency signs (possible meningitis)", ok:true },
      { t:"Send home: purple spots are a normal cold rash", ok:false },
      { t:"Send home: confusion in a fever just means bad sleep", ok:false }
    ],
    pearl:"Fever with a stiff neck, confusion, and purple spreading spots is a 911-now emergency (possible meningococcal infection). Waiting is the dangerous call." },

  { id:"ch_rep6", kind:"esc", dept:"repro", tier:2, patient:"Lab Desk: Positive Test",
    complaint:"15yo, chlamydia urine test positive", vitals:"No symptoms | Prescribed antibiotics picked up",
    quote:"I feel totally fine, but my test came back positive. Do I need to be admitted somewhere for treatment?",
    q:"Make the escalation call, then file the reason:",
    decision:"home",
    reasons:[
      { t:"Chlamydia is bacterial: finishing the prescribed antibiotics at home cures it, and partners need testing too", ok:true },
      { t:"Admit: only hospital antibiotics work on chlamydia", ok:false },
      { t:"Send home and just ignore it: symptom-free means cleared", ok:false }
    ],
    pearl:"Chlamydia is usually silent and bacterial: prescribed antibiotics cure it at home, partners get tested and treated, and admission is never required." },

  { id:"ch_nav6", kind:"esc", dept:"nav", tier:2, patient:"Party Follow-Up Desk",
    complaint:"Friend passed out after drinking", vitals:"Slow breathing | Cold skin | Cannot be woken",
    quote:"My friend drank way too much and now he will not wake up. Someone says coffee and a cold shower will fix him. Call or not?",
    q:"Make the escalation call, then file the reason:",
    decision:"admit",
    reasons:[
      { t:"911 now and the recovery position: passing out with slow breathing is alcohol poisoning, and coffee cannot sober him up", ok:true },
      { t:"Send him home to sleep it off: sleep is the best cure", ok:false },
      { t:"Wait one hour: blood alcohol starts dropping right after passing out", ok:false }
    ],
    pearl:"Blood alcohol keeps rising after a person passes out. Cold skin, slow breathing, inability to wake = 911 and the recovery position. The Good Samaritan Act protects the caller." },

  { id:"ch_nav7", kind:"esc", dept:"nav", tier:3, patient:"Crisis Walk-In Desk",
    complaint:"15yo tells you a friend talks about not wanting to be alive", vitals:"Safety concern | After school today",
    quote:"My friend keeps saying nothing matters anymore. She made me promise not to tell anyone. What do I do?",
    q:"Make the escalation call, then file the reason:",
    decision:"admit",
    reasons:[
      { t:"Never keep a safety secret: tell a trusted adult now, and 988 (call or text) is free and 24/7", ok:true },
      { t:"Keep the promise: telling would end the friendship", ok:false },
      { t:"Send her home to sleep on it: feelings like this pass by morning", ok:false }
    ],
    pearl:"988 (Suicide Crisis Helpline, call or text) and Kids Help Phone are free and 24/7. Safety secrets are the one promise you must break; involve a trusted adult, or 911 if danger is immediate." },

  { id:"ch_slp6", kind:"esc", dept:"sleep", tier:3, patient:"Follow-Up Desk: Exhausted Teen",
    complaint:"15yo, 5.5 hours sleep on school nights for months", vitals:"Falling grades | No safety concerns | Vital signs normal",
    quote:"I am crushed tired every day and my marks are dropping. Should I go to the Emergency Room about this?",
    q:"Make the escalation call, then file the reason:",
    decision:"home",
    reasons:[
      { t:"Home care works: a screen-free 30 to 60 minute wind-down buffer and steady bed times rebuild sleep", ok:true },
      { t:"Admit: chronic tiredness is always an ER problem", ok:false },
      { t:"Send home and ban all sleep until marks improve", ok:false }
    ],
    pearl:"Chronic short sleep is a habit problem, not an emergency: a 30 to 60 minute low-light screen-free buffer, steady schedules, and morning light rebuild it. The ER cannot prescribe sleep." },

  /* ---- MATCH THE PAIRS (6) ---- */
  { id:"ch_inf8", kind:"match", dept:"infectious", tier:1, patient:"Supply Cabinet Desk",
    complaint:"Match each cleaner to the job it actually does", vitals:"Cleanup-day review",
    quote:"Three bottles, three jobs. Match each cleaner to where it belongs before the custodian starts.",
    q:"Match each cleaner to its correct job:",
    pairs:[
      { left:"Chlorine bleach solution", right:"Destroys tough virus shells on surfaces" },
      { left:"Soap and 20 seconds of running water", right:"Lifts germs off skin and rinses them away" },
      { left:"Alcohol hand-sanitizer gel", right:"Kills many germs but fails on norovirus shells" }
    ],
    pearl:"Bleach breaks hard shells on surfaces, soap lifts germs off skin so water rinses them away, and alcohol gel fails against norovirus." },

  { id:"ch_inf9", kind:"match", dept:"infectious", tier:2, patient:"Micro Lab Desk",
    complaint:"Match each clue to the germ type it points to", vitals:"Three active patient charts",
    quote:"Three charts, three pattern clues. File each under the germ type the evidence points to.",
    q:"Match each clue to its germ type:",
    pairs:[
      { left:"Red, hot, swollen scrape", right:"Bacteria" },
      { left:"Spotty rash with slight fever", right:"Virus" },
      { left:"White patches on tonsils, no cough", right:"Bacteria" }
    ],
    pearl:"Red-hot-swollen at a wound and white patches without a cough read bacterial (strep); a spotty rash with fever reads viral." },

  { id:"ch_rep7", kind:"match", dept:"repro", tier:1, patient:"Lab Result Desk",
    complaint:"Match each infection to its care reality", vitals:"Testing and treatment review",
    quote:"Three lab results, three different care paths. File each infection with what its treatment actually looks like.",
    q:"Match each infection to its care reality:",
    pairs:[
      { left:"Chlamydia", right:"Bacterial: cured with prescribed antibiotics" },
      { left:"HPV", right:"Viral: vaccine-preventable (free in NS schools)" },
      { left:"HIV (on treatment)", right:"Viral: modern medicine makes it untransmittable (U=U)" }
    ],
    pearl:"Chlamydia is bacterial and curable, HPV is vaccine-preventable through the free NS school program, and treated HIV becomes undetectable and untransmittable (U=U)." },

  { id:"ch_slp7", kind:"match", dept:"sleep", tier:1, patient:"Sleep Lab Desk",
    complaint:"Match each evening habit to what it does to sleep", vitals:"Screen-time and substances review",
    quote:"Three habits from three patient logs. Match each one to the sleep science it triggers.",
    q:"Match each habit to its sleep effect:",
    pairs:[
      { left:"Energy drink at 7 PM", right:"Caffeine blocks adenosine for 5 to 6 hours" },
      { left:"Phone in bed with lights off", right:"Blue light delays melatonin release" },
      { left:"Buzzing phone under the pillow", right:"Micro-awakenings shred deep and REM sleep" }
    ],
    pearl:"Caffeine blocks adenosine for about 5 to 6 hours, blue-wavelength light delays melatonin, and overnight buzzes shred sleep continuity even without full wake-ups." },

  { id:"ch_nav8", kind:"match", dept:"nav", tier:1, patient:"Front Desk: Who Do I Call?",
    complaint:"Match each situation to the right NS service", vitals:"Three patients waiting for a number",
    quote:"Three patients, three different needs. Give each one the right number to call.",
    q:"Match each need to the right service:",
    pairs:[
      { left:"Free nurse advice at 9 PM tonight", right:"811 (Telecare NS)" },
      { left:"Thoughts of suicide, right now", right:"988 (Suicide Crisis Helpline)" },
      { left:"Chest pain and trouble breathing", right:"911 (life-threatening emergency)" }
    ],
    pearl:"811 is the free 24/7 Telecare nurse line, 988 is the Suicide Crisis Helpline (call or text), and 911 is for life- or limb-threatening emergencies." },

  { id:"ch_slp8", kind:"match", dept:"sleep", tier:2, patient:"Circadian Chart Desk",
    complaint:"Match each log finding to the clock science", vitals:"Three sleep logs, three explanations",
    quote:"Three weekend logs from three patients. Match each finding to the circadian science behind it.",
    q:"Match each finding to its science:",
    pairs:[
      { left:"Slept until 1 PM both weekend days", right:"Social jetlag shifts the body clock later" },
      { left:"Long nap at 6 PM", right:"Burns off adenosine right before bedtime" },
      { left:"Bright morning light and a walk", right:"Anchors the circadian rhythm earlier" }
    ],
    pearl:"Oversleeping till early afternoon creates social jetlag, evening naps burn the sleep pressure (adenosine) that night needs, and morning daylight anchors the clock earlier." },

  /* ---- MYTH BUST - TRUE OR FALSE (6) ---- */
  { id:"ch_inf10", kind:"myth", dept:"infectious", tier:2, patient:"Myth Clinic: Germ Edition",
    complaint:"3 circulating myths, call each one", vitals:"Myth Trials format",
    quote:"Three germ myths are going around the school group chats. Call each one true or false.",
    q:"Call all three myths TRUE or FALSE:",
    myths:[
      { t:"Alcohol hand sanitizer kills norovirus, so gel dispensers stop stomach-bug outbreaks", ans:false },
      { t:"Soap does not need to kill germs because it lifts them off skin so water rinses them away", ans:true },
      { t:"A person who feels better can stop shedding virus right away", ans:false }
    ],
    pearl:"Norovirus shrugs off alcohol gel; soap lifts germs so water rinses them; and shedding continues up to 48 hours after symptoms stop." },

  { id:"ch_rep8", kind:"myth", dept:"repro", tier:2, patient:"Myth Clinic: STI Edition",
    complaint:"3 myths about STIs, call each one", vitals:"Myth Trials format",
    quote:"Three STI myths from the internet. Call each one true or false.",
    q:"Call all three myths TRUE or FALSE:",
    myths:[
      { t:"You can tell who has an STI just by looking at them", ans:false },
      { t:"Many STIs, especially chlamydia, show no symptoms at all", ans:true },
      { t:"Toilet seats are a common way STIs spread", ans:false }
    ],
    pearl:"Most STIs are silent (asymptomatic), so testing is the only reliable check, and pathogens do not survive on cold dry plastic like a toilet seat." },

  { id:"ch_slp9", kind:"myth", dept:"sleep", tier:2, patient:"Myth Clinic: Sleep Edition",
    complaint:"3 sleep myths, call each one", vitals:"Myth Trials format",
    quote:"Three sleep myths from the team group chat. Call each one true or false.",
    q:"Call all three myths TRUE or FALSE:",
    myths:[
      { t:"Sleeping in until 1 PM on weekends fully pays back the week's sleep debt", ans:false },
      { t:"About half the caffeine from a late-day energy drink is still active at midnight", ans:true },
      { t:"Blue light filters make late-night scrolling harmless", ans:false }
    ],
    pearl:"Chronic weekday debt compounds and one morning cannot erase it; caffeine's 5 to 6 hour half-life keeps half a dose active at midnight; and interaction and lost clock hours keep the brain alert regardless of screen tint." },

  { id:"ch_nav9", kind:"myth", dept:"nav", tier:2, patient:"Myth Clinic: Help Edition",
    complaint:"3 myths about getting help, call each one", vitals:"Myth Trials format",
    quote:"Three myths about health services in Nova Scotia. Call each one true or false.",
    q:"Call all three myths TRUE or FALSE:",
    myths:[
      { t:"Calling 811 for nurse advice costs money", ans:false },
      { t:"Nova Scotia pharmacists can assess and prescribe for minor ailments like strep throat", ans:true },
      { t:"The Good Samaritan Drug Overdose Act only protects the person who overdosed", ans:false }
    ],
    pearl:"811 is free 24/7, NS pharmacists assess and prescribe for dozens of minor ailments using MSI, and the Good Samaritan Act protects the caller and everyone at the scene." },

  { id:"ch_inf11", kind:"myth", dept:"infectious", tier:3, patient:"Myth Clinic: Outbreak Edition",
    complaint:"3 outbreak myths, call each one", vitals:"Myth Trials format",
    quote:"Three myths from the outbreak debrief. Call each one true or false.",
    q:"Call all three myths TRUE or FALSE:",
    myths:[
      { t:"A vaccine trains your immune system BEFORE you ever meet the germ", ans:true },
      { t:"Antibiotics speed up recovery from a cold virus", ans:false },
      { t:"Herd immunity for measles needs about 95 percent community coverage", ans:true }
    ],
    pearl:"Vaccines train immune memory in advance, antibiotics do nothing for cold viruses, and measles needs about 95 percent coverage because it is airborne and intensely contagious." },

  { id:"ch_rep9", kind:"myth", dept:"repro", tier:3, patient:"Myth Clinic: Relationships Edition",
    complaint:"3 consent and protection myths, call each one", vitals:"Myth Trials format",
    quote:"Three myths about consent and protection. Call each one true or false.",
    q:"Call all three myths TRUE or FALSE:",
    myths:[
      { t:"Consent must be active, voluntary, and ongoing, and it can be taken back", ans:true },
      { t:"Two condoms together give double the protection", ans:false },
      { t:"Nova Scotia pharmacists can provide contraception and emergency contraception directly", ans:true }
    ],
    pearl:"Consent is active, voluntary, ongoing and revocable; layered condoms increase latex friction and breakage; and NS pharmacists prescribe hormonal contraception and provide emergency contraception directly." },

  /* ---- READ THE CHART (6) ---- */
  { id:"ch_inf12", kind:"chart", dept:"infectious", tier:3, patient:"Epidemiology Chart Review",
    complaint:"Attack-rate table: which source is the culprit?", vitals:"Two classrooms, one shared feature",
    quote:"Here are the two classroom attack rates from the outbreak week. Read the chart and call the interpretation.",
    q:"What does this table prove?",
    table:{ head:["Group","Sick","Exposed","Attack rate"], rows:[
      ["Room 210 (drank from west fountain)","14","20","70%"],
      ["Room 214 (no fountain access)","2","18","11%"]
    ]},
    opts:[
      "The west fountain is the likely source: exposure multiplies the attack rate roughly six-fold",
      "Room 210 got sick from being a larger class",
      "The numbers prove teachers spread it",
      "Attack rates show the illness is not contagious"
    ],
    ans:0,
    pearl:"A 70% attack rate with fountain exposure versus 11% without is classic point-source evidence: the shared exposure, not class size, tracks with getting sick." },

  { id:"ch_inf13", kind:"chart", dept:"infectious", tier:4, patient:"Onset-Time Chart Review",
    complaint:"Onset table: one source or person to person?", vitals:"Cake sale day | Nine cases logged",
    quote:"The food-poisoning cases all ate one item at one event. Read the onset table and call the pattern.",
    q:"What does this onset table prove?",
    table:{ head:["Case","Ate item at","Felt sick at","Gap"], rows:[
      ["1","12:00 PM","7:30 PM","7.5 h"],
      ["2","12:00 PM","8:00 PM","8 h"],
      ["3","12:00 PM","6:30 PM","6.5 h"]
    ]},
    opts:[
      "A point source: everyone ate the same food at the same time and fell ill within the same incubation window",
      "Person-to-person spread chaining across three days",
      "The illness cannot be from food because gaps differ",
      "The 12:00 PM event is unrelated to the sickness"
    ],
    ans:0,
    pearl:"One shared meal plus clustered incubation gaps (6.5 to 8 hours) is the signature of a point-source outbreak; person-to-person spread produces a widening staircase instead." },

  { id:"ch_rep10", kind:"chart", dept:"repro", tier:3, patient:"Screening Chart Review",
    complaint:"Test table: which check finds which infection?", vitals:"Youth clinic testing menu",
    quote:"Here is the clinic's testing menu. Read the chart and match the call to the right test for a symptom-free chlamydia check.",
    q:"Which row is the right call for a symptom-free chlamydia check?",
    table:{ head:["Test","What it needs","Finds"], rows:[
      ["Urine or swab test","A quick sample, no symptoms needed","Chlamydia and gonorrhea"],
      ["Blood test","A blood draw","HIV, syphilis, hepatitis"],
      ["Visual exam","Looking at the skin","Not a reliable STI check"]
    ]},
    opts:[
      "Urine or swab test: chlamydia is usually silent, so testing, not looking, is the reliable check",
      "Visual exam: no symptoms means no infection",
      "Blood test: chlamydia lives in the bloodstream",
      "No test: symptom-free teens cannot carry infections"
    ],
    ans:0,
    pearl:"Chlamydia screening is a urine or swab test and works with zero symptoms; most infections are silent, so visual checks miss almost everything." },

  { id:"ch_slp10", kind:"chart", dept:"sleep", tier:3, patient:"Sleep-Log Chart Review",
    complaint:"Sleep log: name the damaging pattern", vitals:"Five school nights logged",
    quote:"Here is Maya's week from her sleep log. Read the chart and call the pattern that is hurting her.",
    q:"What does this sleep log show?",
    table:{ head:["Night","Lights out","Asleep (approx)","Screens in bed"], rows:[
      ["Mon","11:30 PM","12:20 AM","Yes, 50 min"],
      ["Wed","11:45 PM","12:30 AM","Yes, 45 min"],
      ["Fri","12:15 AM","1:05 AM","Yes, 50 min"]
    ]},
    opts:[
      "In-bed scrolling delays sleep onset, cutting total sleep to well under the 8 to 10 hour guideline for a 6:45 AM wake-up",
      "The log shows a healthy sleep routine",
      "The problem is the bedtime alone, not the screens",
      "The data proves Maya needs later school start times only"
    ],
    ans:0,
    pearl:"Roughly 50 minutes of in-bed scrolling delays sleep onset night after night; with a 6:45 AM alarm that lands total sleep far below the 8 to 10 hour teen guideline, and weekday debt compounds." },

  { id:"ch_nav10", kind:"chart", dept:"nav", tier:3, patient:"Service-Hours Chart Review",
    complaint:"Hours table: which service fits the moment?", vitals:"Sunday, 9:40 PM | Non-emergency",
    quote:"A patient twisted an ankle, it is Sunday 9:40 PM, nothing is life-threatening. Read the hours chart and pick the right pathway.",
    q:"Which service fits this moment?",
    table:{ head:["Service","Hours","Best for"], rows:[
      ["811 Telecare NS","24/7","Free nurse advice, decide care level"],
      ["Pharmacy Primary Care Clinic","Daytime mostly","Minor ailments, prescriptions"],
      ["Emergency Department","24/7","Life- or limb-threatening only"]
    ]},
    opts:[
      "811: a free 24/7 nurse can triage a non-emergency injury tonight and point to the right daytime care",
      "Emergency Department: every injury belongs in the ER",
      "Pharmacy clinic: it is the only option with a phone",
      "Wait a week: minor injuries self-resolve always"
    ],
    ans:0,
    pearl:"811 runs 24/7 with a Registered Nurse on the line, which is exactly what a scary-but-not-dangerous injury needs at 9:40 PM; the ER is for emergencies, and daytime pharmacies are closed." },

  { id:"ch_rep11", kind:"chart", dept:"repro", tier:4, patient:"Immunization Chart Review",
    complaint:"Vaccine table: what does NS offer free at school?", vitals:"Grade 9 records check",
    quote:"Here is the school immunization program chart. Read it and call which statement the table supports.",
    q:"What does this table support?",
    table:{ head:["Vaccine","Protects against","NS school program"], rows:[
      ["HPV vaccine","HPV strains linked to cancers","Offered free"],
      ["Hepatitis B vaccine","Liver-disease virus","Offered free"],
      ["Routine flu shot","Seasonal influenza","Not part of the school program"]
    ]},
    opts:[
      "Both HPV and Hepatitis B vaccines are offered free through the NS school program because they prevent viral STIs and their long-term liver and cancer risks",
      "The flu shot is the only school-offered vaccine",
      "HPV vaccine is only for students who travel",
      "Hepatitis B vaccine must be bought privately in NS"
    ],
    ans:0,
    pearl:"HPV and Hepatitis B vaccines are both offered free in Nova Scotia school immunization programs; they guard against viral STIs and their long-term cancer and liver consequences." },
];
