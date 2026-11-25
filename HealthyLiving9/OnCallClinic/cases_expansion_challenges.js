/* ============================================================================
   ON-CALL: ROOM 8 CLINIC - Expansion Bank: 40 Interactive Challenges
   5 of EACH interactive type: rx, triage, order, slider, esc, match, myth, chart
   Spread across all 4 core wings (infectious, repro, sleep, nav), Tiers 1-4.
   Grade 9 Nova Scotia / Dartmouth curriculum. Zero em/en dashes.
   ============================================================================ */
window.ONCALL_CHALLENGES = (window.ONCALL_CHALLENGES || []).concat([

  /* ==================== 5 RX (MULTI-SELECT ORDERS) ==================== */
  { id:"ch_exp_rx1", kind:"rx", dept:"infectious", tier:1, patient:"Tick-Safety Desk",
    complaint:"Post-hike Lyme prevention checklist", vitals:"Returning from Shubie Park trail",
    quote:"Sign the smart post-hike habits that actually lower Lyme disease risk in Nova Scotia.",
    q:"Select ALL 3 evidence-based steps (leave the 1 myth unchecked):",
    items:[
      { t:"Do a full-body tick check (hairline, behind knees, waistband) and shower within 2 hours", ok:true },
      { t:"Tumble-dry hiking clothes on high heat for 10+ minutes to kill hidden ticks", ok:true },
      { t:"Use fine tweezers to pull any attached tick straight up close to the skin", ok:true },
      { t:"Coat attached ticks in Vaseline or nail polish so they back out", ok:false }
    ],
    pearl:"Quick tick checks, high-heat dryer cycles, and straight-up tweezer removal prevent Lyme transmission. Never suffocate or burn an attached tick." },

  { id:"ch_exp_rx2", kind:"rx", dept:"repro", tier:2, patient:"Youth Clinic Intake",
    complaint:"Smart STI prevention & care habits", vitals:"Routine Grade 9 consult",
    quote:"Check off every habit that genuinely reduces STI risk or protects partners.",
    q:"Select ALL 3 accurate practices (avoid the 1 false shortcut):",
    items:[
      { t:"Use external or internal condoms consistently with water- or silicone-based lube", ok:true },
      { t:"Get free school HPV and Hepatitis B vaccines", ok:true },
      { t:"Get confidential STI testing before new partners or after unprotected contact", ok:true },
      { t:"Skip testing if both partners look and feel completely healthy", ok:false }
    ],
    pearl:"Many STIs have zero visible symptoms. Barriers, vaccines, and confidential testing work together to protect health." },

  { id:"ch_exp_rx3", kind:"rx", dept:"sleep", tier:2, patient:"Exam-Week Recovery Desk",
    complaint:"Pre-exam sleep & focus orders", vitals:"Big Science exam tomorrow morning",
    quote:"Sign the orders that will actually maximize memory recall tomorrow morning.",
    q:"Select ALL 3 helpful orders (leave the 1 trap unchecked):",
    items:[
      { t:"Stop caffeine by early afternoon (at least 6 to 8 hours before bed)", ok:true },
      { t:"End screen scrolling 45 minutes before bed and charge the phone outside reach", ok:true },
      { t:"Aim for 8 to 9 hours of uninterrupted sleep so the brain consolidates notes", ok:true },
      { t:"Pull an all-nighter with two energy drinks to review notes until 6 AM", ok:false }
    ],
    pearl:"Memory consolidation happens during sleep. Cutting late caffeine and screens and getting a full night beats all-night cramming." },

  { id:"ch_exp_rx4", kind:"rx", dept:"nav", tier:3, patient:"US Road-Trip Prep Desk",
    complaint:"Crossing into Maine for a hockey tournament", vitals:"Weekend trip | 3 days in Bangor",
    quote:"Sign every smart medical prep step before crossing the US border.",
    q:"Select ALL 3 smart travel steps (leave the 1 risky assumption unchecked):",
    items:[
      { t:"Buy travel medical insurance covering emergencies before leaving Canada", ok:true },
      { t:"Save the travel insurer's 24/7 assistance phone number in your phone and wallet", ok:true },
      { t:"Keep every itemized clinic/pharmacy receipt if care is needed", ok:true },
      { t:"Rely on your Nova Scotia MSI card to cover any US urgent care or ER bills", ok:false }
    ],
    pearl:"Your NS health card stops paying at the border. Buy travel medical insurance, call their 24/7 line first, and save every itemized receipt." },

  { id:"ch_exp_rx5", kind:"rx", dept:"nav", tier:3, patient:"Overdose Bystander Desk",
    complaint:"Suspected opioid overdose response", vitals:"Unresponsive friend | Slow breathing | Blue lips",
    quote:"Select every life-saving action to take immediately.",
    q:"Select ALL 3 safe emergency actions (leave the 1 dangerous myth unchecked):",
    items:[
      { t:"Call 911 immediately (protected by the Good Samaritan Drug Overdose Act)", ok:true },
      { t:"Administer naloxone (Narcan) if available and monitor breathing", ok:true },
      { t:"Place the person in the recovery position if breathing, and stay until EMS arrives", ok:true },
      { t:"Put them in a cold shower and let them sleep it off without calling 911", ok:false }
    ],
    pearl:"911 + naloxone + recovery position saves lives. Cold showers never reverse an overdose and waste precious minutes." },

  /* ==================== 5 TRIAGE (BUCKET SORTING) ==================== */
  { id:"ch_exp_tri1", kind:"triage", dept:"infectious", tier:1, patient:"Germ Lab Triage",
    complaint:"Sort 3 common illnesses by germ type", vitals:"Clinic microbiology review",
    quote:"Knowing whether an illness is viral, bacterial, or fungal decides which treatment works.",
    q:"Sort each condition into the right germ bucket:",
    buckets:["Viral (No Antibiotics)","Bacterial (Antibiotics Can Cure)","Fungal (Antifungal Cream)"],
    rows:[
      { t:"Athlete's foot (itchy peeling skin between toes from locker room)", ans:2 },
      { t:"Common cold with runny nose and mild cough", ans:0 },
      { t:"Confirmed Group A Strep throat or early Lyme disease", ans:1 }
    ],
    pearl:"Antibiotics only kill bacteria (strep, Lyme); colds are viral (supportive care); athlete's foot is fungal (antifungal cream)." },

  { id:"ch_exp_tri2", kind:"triage", dept:"repro", tier:2, patient:"Contraception Protection Board",
    complaint:"Sort 3 methods by what they actually protect against", vitals:"Youth clinic chart",
    quote:"Patients often mix up pregnancy prevention with STI prevention. Sort these three accurately.",
    q:"Match each method to its real protection level:",
    buckets:["Pregnancy Only (No STI Protection)","Both Pregnancy & STI Protection","Neither (Unreliable)"],
    rows:[
      { t:"External latex condom used properly from start to finish", ans:1 },
      { t:"Daily birth control pill or hormonal IUD alone", ans:0 },
      { t:"Withdrawal ('pulling out') method", ans:2 }
    ],
    pearl:"Hormonal methods/IUDs prevent pregnancy only; condoms protect against both; withdrawal has a high failure rate and zero STI protection." },

  { id:"ch_exp_tri3", kind:"triage", dept:"sleep", tier:2, patient:"Sleep Stage Board",
    complaint:"Match 3 nighttime jobs to the sleep stage", vitals:"Neuroscience lab",
    quote:"Each phase of sleep has a different biological job. Sort these three functions.",
    q:"Assign each job to the right stage or signal:",
    buckets:["Melatonin (Evening Signal)","Deep Sleep (Early Night)","REM Sleep (Late Night)"],
    rows:[
      { t:"Physical tissue repair, immune boost, and growth hormone release", ans:1 },
      { t:"Memory consolidation, learning, and emotional reset", ans:2 },
      { t:"Darkness hormone that tells your body clock night has begun", ans:0 }
    ],
    pearl:"Melatonin opens the sleep gate, Deep sleep rebuilds the body early in the night, and REM sleep locks in memory and mood late in the night." },

  { id:"ch_exp_tri4", kind:"triage", dept:"nav", tier:2, patient:"Nova Scotia Bill Sorter",
    complaint:"Who pays for these 3 real-life visits?", vitals:"MSI vs. Private Insurance vs. US Bill",
    quote:"Sort each bill into who actually pays for it for a 16-year-old in Dartmouth.",
    q:"Assign each cost to the accurate payer:",
    buckets:["NS MSI ($0 at the door)","Private Insurance / Out of Pocket","Huge US Bill (Unless Travel Insured)"],
    rows:[
      { t:"Broken collarbone X-ray and cast at the IWK Emergency Room", ans:0 },
      { t:"Cavity filling and prescription antibiotics at age 16", ans:1 },
      { t:"ER visit for a bad infection on a weekend trip in Maine", ans:2 }
    ],
    pearl:"MSI covers NS hospital/ER care; age 16 dental and retail prescriptions require private benefits/out-of-pocket; US care requires travel medical insurance." },

  { id:"ch_exp_tri5", kind:"triage", dept:"nav", tier:3, patient:"Helpline Switchboard",
    complaint:"Route 3 teens to the exact right NS number", vitals:"24/7 Youth Resource Desk",
    quote:"Match each teen to the best free Nova Scotia number.",
    q:"Sort all 3 callers to the right number:",
    buckets:["811 (Telecare RN)","988 / 686868 (Mental Health)","211 (Community Supports)"],
    rows:[
      { t:"Teen feeling hopeless and unsafe late at night", ans:1 },
      { t:"Parent unsure if a 38.7 C fever needs a clinic tomorrow", ans:0 },
      { t:"Family looking for free local food, transit, or youth programs", ans:2 }
    ],
    pearl:"811 = free 24/7 nurse advice; 988 (call/text) or 686868 (Kids Help Phone text) = mental health crisis; 211 = local community supports." },

  /* ==================== 5 ORDER (4-STEP SEQUENCES) ==================== */
  { id:"ch_exp_ord1", kind:"order", dept:"infectious", tier:1, patient:"Handwashing Lab",
    complaint:"Proper 20-second handwashing sequence", vitals:"Preventing norovirus & flu",
    quote:"Put these four handwashing steps in the exact order that actually removes germs.",
    q:"Sequence the 4 handwashing steps (1 to 4):",
    steps:[
      "Wet hands with clean running water and apply soap",
      "Lather palms, backs of hands, between fingers, and thumbs for at least 20 seconds",
      "Rinse thoroughly under clean running water so lifted germs wash down the drain",
      "Dry hands completely with a clean towel or air dryer"
    ],
    pearl:"Soap lifts germs off skin oils, 20 seconds of friction reaches hidden spots, running water rinses them away, and drying stops wet hands from picking up new germs." },

  { id:"ch_exp_ord2", kind:"order", dept:"infectious", tier:2, patient:"Tick Removal Station",
    complaint:"Safe Nova Scotia tick-bite protocol", vitals:"Blacklegged tick found after hike",
    quote:"Put these four tick-removal and follow-up steps in the right order.",
    q:"Build the 4-step tick protocol (1 to 4):",
    steps:[
      "Grasp the tick as close to the skin as possible with clean fine-tipped tweezers",
      "Pull straight upward with steady, even pressure without twisting or squeezing",
      "Wash the bite area and your hands thoroughly with soap and water",
      "Note the date/spot (or take a photo) and check with an NS pharmacist if attached 24+ hours"
    ],
    pearl:"Clean straight-up removal plus noting the date helps a pharmacist decide if preventive single-dose antibiotic treatment is needed." },

  { id:"ch_exp_ord3", kind:"order", dept:"repro", tier:2, patient:"Emergency Contraception Timeline",
    complaint:"Broken condom action plan", vitals:"Just happened 2 hours ago",
    quote:"Put these four smart follow-up steps in chronological order.",
    q:"Sequence the response steps (1 to 4):",
    steps:[
      "Stay calm and check timing (sooner is always more effective for emergency contraception)",
      "Visit a Nova Scotia pharmacy or youth clinic promptly for Plan B, ulipristal, or copper IUD info",
      "Plan a confidential STI test after the appropriate window period (usually 1 to 2 weeks)",
      "Take a home pregnancy test if a period is missed or 21 days after the event"
    ],
    pearl:"Acting early maximizes emergency contraception effectiveness, while waiting for the proper window ensures accurate STI and pregnancy tests." },

  { id:"ch_exp_ord4", kind:"order", dept:"sleep", tier:2, patient:"Evening Wind-Down Protocol",
    complaint:"Rebuilding a broken teen sleep routine", vitals:"Currently falling asleep at 1:30 AM",
    quote:"Put this evening-to-morning sleep reset in chronological order.",
    q:"Sequence the 4 sleep-hygiene steps (1 to 4):",
    steps:[
      "Cut off caffeinated drinks by early afternoon so adenosine receptors stay clear",
      "Dim lights and park the phone outside reach 45 minutes before target bedtime",
      "Sleep in a cool, dark bedroom (~18 to 19 C) with uninterrupted cycles",
      "Get 10 to 15 minutes of bright outdoor daylight soon after waking to anchor tomorrow's clock"
    ],
    pearl:"Good sleep starts in the morning (daylight anchor), continues in the afternoon (caffeine cutoff), and finishes with a dark, screen-free wind-down." },

  { id:"ch_exp_ord5", kind:"order", dept:"nav", tier:3, patient:"US Travel Medical Drill",
    complaint:"Bad ear infection during a Maine weekend", vitals:"Family HAS travel medical insurance",
    quote:"Put these four travel-insurance steps in the exact order that avoids denied claims.",
    q:"Sequence the 4 border-care steps (1 to 4):",
    steps:[
      "Confirm no life-threatening emergency (if emergency, call 911 first)",
      "Call your travel insurer's 24/7 assistance line BEFORE visiting a clinic so they approve coverage",
      "Go to the approved clinic/urgent care they direct you to and get treated",
      "Collect and save every itemized bill and pharmacy receipt to submit your claim"
    ],
    pearl:"Calling the 24/7 travel insurance line first prevents out-of-network billing surprises and keeps your claim eligible." },

  /* ==================== 5 SLIDER (CLINICAL DIAL) ==================== */
  { id:"ch_exp_sld1", kind:"slider", dept:"infectious", tier:1, patient:"Sink-Side Hygiene Audit",
    complaint:"Minimum soap-and-water handwashing time", vitals:"Public Health Canada standard",
    quote:"How many SECONDS should you scrub with soap and water to reliably lift germs off your hands?",
    q:"Set the dial to the minimum recommended scrubbing time in seconds:",
    min:5, max:60, step:5, unit:"seconds", target:20, tol:5,
    pearl:"At least 20 seconds of thorough soap lathering (about humming 'Happy Birthday' twice) is needed to lift germs from palms, thumbs, and between fingers." },

  { id:"ch_exp_sld2", kind:"slider", dept:"infectious", tier:2, patient:"Nova Scotia Tick Desk",
    complaint:"Lyme transmission attachment window", vitals:"Blacklegged tick found on leg",
    quote:"Roughly how many HOURS does a blacklegged tick usually need to stay attached before it transmits Lyme bacteria?",
    q:"Set the dial to the typical minimum attachment hours for Lyme transmission:",
    min:6, max:72, step:6, unit:"hours", target:24, tol:6,
    pearl:"Blacklegged ticks typically need to be attached for 24 to 36+ hours to transmit Lyme bacteria - which is why doing a daily tick check after hiking works so well." },

  { id:"ch_exp_sld3", kind:"slider", dept:"repro", tier:3, patient:"Pharmacy Emergency Desk",
    complaint:"Copper IUD emergency contraception window", vitals:"Most effective emergency method",
    quote:"Up to how many DAYS after unprotected sex can a copper IUD be inserted for emergency contraception?",
    q:"Set the dial to the maximum window in days:",
    min:1, max:14, step:1, unit:"days", target:7, tol:1,
    pearl:"A copper IUD inserted within 7 days is over 99% effective as emergency contraception (regardless of body weight) and provides ongoing contraception." },

  { id:"ch_exp_sld4", kind:"slider", dept:"sleep", tier:2, patient:"Bedroom Climate Lab",
    complaint:"Ideal bedroom sleep temperature", vitals:"Insomnia & tossing/turning consult",
    quote:"Around what bedroom temperature in degrees Celsius helps the body cool down smoothly for deep sleep?",
    q:"Set the thermostat dial to the recommended bedroom temperature:",
    min:10, max:28, step:1, unit:"C", target:18, tol:2,
    pearl:"Most sleep scientists recommend a cool bedroom around 18 to 19 C (65 F) so your core body temperature can dip naturally." },

  { id:"ch_exp_sld5", kind:"slider", dept:"nav", tier:2, patient:"NS MSI Dental Desk",
    complaint:"Children's Oral Health Program age limit", vitals:"Nova Scotia MSI dental coverage",
    quote:"Basic dental coverage under Nova Scotia MSI ends at the end of the month you turn what AGE?",
    q:"Set the dial to the MSI basic dental cutoff age:",
    min:10, max:25, step:1, unit:"years old", target:15, tol:0,
    pearl:"Nova Scotia MSI covers basic dental only until the end of the month a youth turns 15. After that, families rely on private benefits, CDCP, or out-of-pocket pay." },

  /* ==================== 5 ESC (ESCALATE NOW vs SEND HOME) ==================== */
  { id:"ch_exp_esc1", kind:"esc", dept:"infectious", tier:2, patient:"Triage Desk: Sudden Hives & Wheezing",
    complaint:"14yo ate unmarked brownie at lunch", vitals:"Swelling lips | Wheezing | Feeling dizzy",
    quote:"Her lips are puffing up and she's wheezing after one bite of a brownie. Should we watch her in the office for 20 minutes?",
    q:"Make the escalation call, then file the reason:",
    decision:"admit",
    reasons:[
      { t:"Anaphylaxis emergency: inject EpiPen immediately into outer mid-thigh and call 911 now", ok:true },
      { t:"Send home with an antihistamine pill and wait to see if wheezing fades", ok:false },
      { t:"Have her drink two glasses of water to wash away the allergen", ok:false }
    ],
    pearl:"Swelling lips + wheezing + dizziness is life-threatening anaphylaxis. Epinephrine first, 911 immediately - never wait on antihistamines." },

  { id:"ch_exp_esc2", kind:"esc", dept:"infectious", tier:1, patient:"Triage Desk: 2-Day Common Cold",
    complaint:"15yo with runny nose, mild cough, 37.6 C", vitals:"Breathing comfortably | Drinking water | Alert",
    quote:"I've had a stuffy nose and mild cough for two days. Do I need to go to the Dartmouth General ER tonight?",
    q:"Make the escalation call, then file the reason:",
    decision:"home",
    reasons:[
      { t:"Routine viral cold with no red flags: rest, fluids, and supportive home care (or call 811 if unsure)", ok:true },
      { t:"Escalate to ER immediately so they can give IV antibiotics for a cold", ok:false },
      { t:"Call 911 whenever a teen has a cough for more than 24 hours", ok:false }
    ],
    pearl:"Uncomplicated colds are viral and resolve with rest and fluids. Keep the ER clear for breathing trouble, high persistent fever, or severe symptoms." },

  { id:"ch_exp_esc3", kind:"esc", dept:"repro", tier:3, patient:"Triage Desk: Severe Lower-Belly Pain",
    complaint:"16yo, sharp one-sided pelvic pain + dizziness", vitals:"Missed period 2 weeks ago | Pale, lightheaded",
    quote:"I missed my period two weeks ago and suddenly have sharp pain on one side of my lower belly and feel faint. Wait for a walk-in tomorrow?",
    q:"Make the escalation call, then file the reason:",
    decision:"admit",
    reasons:[
      { t:"Sudden severe one-sided pelvic pain + dizziness after a missed period can be an ectopic pregnancy - urgent ER/911 now", ok:true },
      { t:"Send home with a heating pad and take a pregnancy test next week", ok:false },
      { t:"Book a routine pharmacy visit for tomorrow afternoon", ok:false }
    ],
    pearl:"Severe one-sided pelvic pain with dizziness or fainting can signal a ruptured ectopic pregnancy or ovarian torsion - always an immediate ER emergency." },

  { id:"ch_exp_esc4", kind:"esc", dept:"nav", tier:2, patient:"Triage Desk: Uncomplicated UTI",
    complaint:"15yo, burning when peeing, frequent trips", vitals:"No fever | No back/flank pain | No vomiting",
    quote:"It burns when I pee, though I have no fever and no back pain. Should I sit in the ER for 5 hours tonight?",
    q:"Make the escalation call, then file the reason:",
    decision:"home",
    reasons:[
      { t:"No kidney/emergency red flags: a Nova Scotia pharmacist can assess and prescribe for an uncomplicated UTI (MSI covers assessment)", ok:true },
      { t:"Every urinary symptom requires an ambulance ride to the ER", ok:false },
      { t:"Ignore it completely because UTIs always disappear without treatment", ok:false }
    ],
    pearl:"Uncomplicated UTIs can be assessed directly at NS pharmacies. Escalate to ER/urgent care if fever, chills, vomiting, or flank/back pain develop." },

  { id:"ch_exp_esc5", kind:"esc", dept:"sleep", tier:3, patient:"Triage Desk: 3-Energy-Drink Chest Tightness",
    complaint:"15yo drank 3 energy drinks in 2 hours", vitals:"Heart racing 145 bpm | Chest tightness | Short of breath",
    quote:"I pounded three energy drinks before a late tournament and now my chest feels tight and my heart won't slow down. Just lie down?",
    q:"Make the escalation call, then file the reason:",
    decision:"admit",
    reasons:[
      { t:"Chest tightness, shortness of breath, and a racing heart after heavy stimulant intake require urgent ER/911 evaluation", ok:true },
      { t:"Send home to drink cold water and go straight to sleep", ok:false },
      { t:"Tell them to run two laps to burn off the caffeine", ok:false }
    ],
    pearl:"Chest tightness, faintness, or shortness of breath with a racing heart is ALWAYS an urgent medical call - never try to 'sleep off' chest symptoms." },

  /* ==================== 5 MATCH (MATCH THE PAIRS) ==================== */
  { id:"ch_exp_mat1", kind:"match", dept:"infectious", tier:1, patient:"Vaccine Protection Board",
    complaint:"Match each vaccine to what it prevents", vitals:"Nova Scotia immunization schedule",
    quote:"Match each routine vaccine to the disease it guards against.",
    q:"Match each vaccine to its target:",
    pairs:[
      { left:"MMR vaccine", right:"Measles, mumps, and rubella (airborne viruses)" },
      { left:"Tetanus booster (Tdap)", right:"Deep-wound bacterial toxin from soil/dust" },
      { left:"Annual flu shot", right:"Seasonal influenza strains (inactivated virus)" }
    ],
    pearl:"Vaccines train immune memory safely ahead of time against both viral (MMR, flu) and bacterial-toxin (tetanus) threats." },

  { id:"ch_exp_mat2", kind:"match", dept:"repro", tier:2, patient:"Youth Resource Matcher",
    complaint:"Match each youth concern to the best resource", vitals:"Nova Scotia & Canadian supports",
    quote:"Match each situation to the exact free, confidential support designed for it.",
    q:"Match each need to the right resource:",
    pairs:[
      { left:"Private photo shared online without consent", right:"NeedHelpNow.ca (takedown & support)" },
      { left:"Needs birth control or emergency contraception", right:"Nova Scotia Pharmacist / Youth Health Centre" },
      { left:"Confidential STI test with zero symptoms", right:"School Youth Health Centre / STI Clinic" }
    ],
    pearl:"Knowing the exact confidential door ahead of time lowers panic and gets teens fast, judgment-free help." },

  { id:"ch_exp_mat3", kind:"match", dept:"sleep", tier:2, patient:"Brain Chemistry Matcher",
    complaint:"Match each brain chemical to its sleep role", vitals:"Circadian & sleep-drive science",
    quote:"Three key chemicals run your sleep-wake cycle. Match each one to its job.",
    q:"Match each chemical to what it does:",
    pairs:[
      { left:"Adenosine", right:"Builds up sleep pressure the longer you stay awake" },
      { left:"Melatonin", right:"Darkness hormone that signals biological night" },
      { left:"Caffeine", right:"Plugs adenosine receptors so you mask tiredness" }
    ],
    pearl:"Adenosine builds sleep hunger, melatonin signals timing, and caffeine temporarily blocks the adenosine sensor without removing fatigue." },

  { id:"ch_exp_mat4", kind:"match", dept:"nav", tier:2, patient:"Care-Door Matcher",
    complaint:"Match each Dartmouth problem to the right door", vitals:"HL9 Outcome 3 Triage",
    quote:"Match each real-life situation to the smartest Nova Scotia care pathway.",
    q:"Match each problem to its best door:",
    pairs:[
      { left:"Ran out of regular asthma inhaler at 7 PM", right:"NS Pharmacist (can assess & renew)" },
      { left:"Stable swollen ankle, checking 24/7 ER waits", right:"yourhealthns.ca (verify live waits & hours)" },
      { left:"Severe chest pain or sudden trouble breathing", right:"911 / Nearest Emergency Room immediately" }
    ],
    pearl:"Matching the problem to the right door gets you faster care and keeps emergency rooms open for true emergencies." },

  { id:"ch_exp_mat5", kind:"match", dept:"nav", tier:3, patient:"Insurance Reality Matcher",
    complaint:"Match each healthcare term to its real meaning", vitals:"Canada vs. US health coverage",
    quote:"Match each coverage term to what it actually means for a Nova Scotia family.",
    q:"Match each term to its definition:",
    pairs:[
      { left:"Nova Scotia MSI", right:"Public plan covering NS hospitals, doctors, and dental until end of month turning 15" },
      { left:"Workplace private benefits", right:"Covers gaps like prescriptions, 15+ dental, glasses, and physio" },
      { left:"Travel medical insurance", right:"Protects you from massive hospital bills when visiting the US" }
    ],
    pearl:"Public MSI, private workplace benefits, and travel medical insurance each cover a different piece of the healthcare puzzle." },

  /* ==================== 5 MYTH (TRUE OR FALSE) ==================== */
  { id:"ch_exp_myt1", kind:"myth", dept:"infectious", tier:1, patient:"Myth Clinic: Food & Ticks",
    complaint:"3 everyday germ myths, call each one", vitals:"Myth Trials format",
    quote:"Call each statement TRUE or FALSE based on real public health science.",
    q:"Call all three statements TRUE or FALSE:",
    myths:[
      { t:"If chicken left in a warm locker smells normal, it is guaranteed safe to eat", ans:false },
      { t:"Pulling a tick straight up with fine tweezers is safer than burning it with a match", ans:true },
      { t:"Green mucus on Day 2 of a cold proves you need antibiotics right away", ans:false }
    ],
    pearl:"Pathogens don't always smell bad, tweezers beat matches/Vaseline for ticks, and mucus colour alone never proves a bacterial infection." },

  { id:"ch_exp_myt2", kind:"myth", dept:"repro", tier:2, patient:"Myth Clinic: Protection & Testing",
    complaint:"3 protection myths, call each one", vitals:"Myth Trials format",
    quote:"Three common teen claims about protection and testing. Call each one TRUE or FALSE.",
    q:"Call all three statements TRUE or FALSE:",
    myths:[
      { t:"The birth control pill protects against both pregnancy and bacterial STIs", ans:false },
      { t:"In Nova Scotia, a 15-year-old can access routine STI testing confidentially", ans:true },
      { t:"Keeping a condom in a tight back-pocket wallet for a year keeps it just as strong", ans:false }
    ],
    pearl:"Pills do not block STIs, mature minors can access confidential youth care in NS, and wallet heat/friction weakens latex." },

  { id:"ch_exp_myt3", kind:"myth", dept:"sleep", tier:1, patient:"Myth Clinic: Teen Sleep",
    complaint:"3 teen sleep claims, call each one", vitals:"Myth Trials format",
    quote:"Three claims from the school hallway about sleep. Call each one TRUE or FALSE.",
    q:"Call all three statements TRUE or FALSE:",
    myths:[
      { t:"Teenagers experience a natural biological shift that pushes melatonin release later at night", ans:true },
      { t:"Pulling an all-nighter helps your brain lock in more exam facts than sleeping 8 hours", ans:false },
      { t:"Getting bright outdoor light in the morning helps anchor your body clock earlier", ans:true }
    ],
    pearl:"Teen circadian delay is biological, sleep is essential for memory consolidation, and morning outdoor daylight resets the 24-hour clock." },

  { id:"ch_exp_myt4", kind:"myth", dept:"nav", tier:2, patient:"Myth Clinic: MSI & Border Care",
    complaint:"3 healthcare cost myths, call each one", vitals:"Myth Trials format",
    quote:"Three things people constantly get wrong about Canadian and US healthcare. Call each one TRUE or FALSE.",
    q:"Call all three statements TRUE or FALSE:",
    myths:[
      { t:"If you forget your physical MSI card at a Nova Scotia ER, they will refuse to treat you", ans:false },
      { t:"Nova Scotia MSI covers basic dental only until the end of the month you turn 15", ans:true },
      { t:"Your Nova Scotia health card pays the full bill if you break your wrist in Maine", ans:false }
    ],
    pearl:"You are never refused urgent NS care for a forgotten card, MSI dental ends after the month you turn 15, and MSI does not cover US hospital bills." },

  { id:"ch_exp_myt5", kind:"myth", dept:"nav", tier:3, patient:"Myth Clinic: Vaping & Safety",
    complaint:"3 teen safety claims, call each one", vitals:"Myth Trials format",
    quote:"Three claims teens hear about vaping and emergencies. Call each one TRUE or FALSE.",
    q:"Call all three statements TRUE or FALSE:",
    myths:[
      { t:"Fruit-flavoured disposable vapes are just harmless flavoured water vapour", ans:false },
      { t:"Giving naloxone to someone who did NOT take opioids will seriously harm them", ans:false },
      { t:"Calling or texting 988 connects you to free 24/7 crisis support anywhere in Canada", ans:true }
    ],
    pearl:"Vapes deliver nicotine salts and lung-irritating aerosols, naloxone is safe even if opioids aren't present, and 988 is free 24/7 across Canada." },

  /* ==================== 5 CHART (READ THE DATA TABLE) ==================== */
  { id:"ch_exp_cht1", kind:"chart", dept:"infectious", tier:2, patient:"Antibiotic Prescribing Audit",
    complaint:"Clinic table: who actually needs antibiotics?", vitals:"Four afternoon patients",
    quote:"Review this clinic table and identify which patient genuinely needs an antibiotic prescription.",
    q:"Based on the table, which patient requires antibiotics?",
    table:{ head:["Patient","Test / Finding","Cause"], rows:[
      ["Patient A","Runny nose, mild cough, 2 days","Rhinovirus (Viral)"],
      ["Patient B","Rapid-swab positive Group A Strep","Streptococcus (Bacterial)"],
      ["Patient C","Vomiting & diarrhea, school outbreak","Norovirus (Viral)"]
    ]},
    opts:[
      "Patient B only: confirmed Group A Strep is bacterial, while rhinovirus and norovirus are viral",
      "Patients A and C because viruses need stronger antibiotics",
      "All three patients should receive antibiotics just in case",
      "None of the three patients need antibiotics"
    ],
    ans:0, pearl:"Antibiotics only target bacteria (Patient B). Prescribing them for viral colds or norovirus gives zero benefit and fuels resistance." },

  { id:"ch_exp_cht2", kind:"chart", dept:"repro", tier:3, patient:"Contraception Effectiveness Chart",
    complaint:"Perfect use vs. typical use comparison", vitals:"Youth Health Centre wall chart",
    quote:"Study the gap between perfect use and typical real-world use in this table.",
    q:"What is the main takeaway from this effectiveness chart?",
    table:{ head:["Method","Perfect Use","Typical Use"], rows:[
      ["Hormonal IUD / Implant","99%+","99%+"],
      ["Daily Birth Control Pill","99%","~91%"],
      ["External Condom","98%","~87%"],
      ["Withdrawal","96%","~78%"]
    ]},
    opts:[
      "Methods requiring daily or in-the-moment memory have bigger real-world failure gaps than IUDs/implants, and condoms are still needed for STIs",
      "Withdrawal is just as reliable in real life as an IUD",
      "Daily pills have zero gap between perfect use and typical use",
      "Condoms should never be paired with hormonal methods"
    ],
    ans:0, pearl:"Human memory explains the typical-use gap. Pairing a reliable pregnancy method with condoms gives strong dual protection." },

  { id:"ch_exp_cht3", kind:"chart", dept:"sleep", tier:3, patient:"Caffeine Decay Chart",
    complaint:"Tracking a 6:00 PM energy drink (160 mg)", vitals:"5-hour caffeine half-life",
    quote:"Look at how much caffeine stays active in the brain hours after a 6:00 PM energy drink.",
    q:"What does this caffeine decay table show at 11:00 PM bedtime?",
    table:{ head:["Time","Hours Later","Active Caffeine Left"], rows:[
      ["6:00 PM","0 hours","160 mg (100%)"],
      ["11:00 PM","5 hours","80 mg (50%)"],
      ["4:00 AM","10 hours","40 mg (25%)"]
    ]},
    opts:[
      "Half the drink (80 mg, like a cup of coffee) is still blocking sleep receptors at 11:00 PM, and a quarter remains at 4:00 AM",
      "All caffeine is completely gone from the brain by 9:00 PM",
      "Caffeine levels increase after midnight",
      "Drinking it at 6:00 PM only affects sleep for the first 30 minutes"
    ],
    ans:0, pearl:"Because caffeine's half-life is ~5 to 6 hours, evening energy drinks keep blocking adenosine well into the early morning hours." },

  { id:"ch_exp_cht4", kind:"chart", dept:"nav", tier:3, patient:"MSI vs. Out-of-Pocket Table",
    complaint:"Comparing 3 bills for a 16-year-old in Dartmouth", vitals:"Coverage breakdown",
    quote:"Read this Nova Scotia billing chart for a 16-year-old whose family has no workplace benefits.",
    q:"Which statement accurately matches the billing table?",
    table:{ head:["Service","MSI Pays","Family Pays (No Private Plan)"], rows:[
      ["ER X-ray & cast (Dartmouth General)","100%","$0"],
      ["Cavity filling (age 16)","0% (ended after turning 15)","$180 - $300"],
      ["Antibiotic prescription at pharmacy","0% (retail drugs)","$25 - $60"]
    ]},
    opts:[
      "MSI covers hospital/ER care fully, but after age 15 dental and retail prescriptions create real bills without private benefits or Pharmacare",
      "MSI pays 100% of every dental and pharmacy bill for teens",
      "Families must pay cash for ER X-rays at Dartmouth General",
      "Dental coverage lasts until age 25 under MSI"
    ],
    ans:0, pearl:"Understanding what MSI covers vs. does not cover explains why workplace benefits and public programs like Pharmacare/CDCP matter so much." },

  { id:"ch_exp_cht5", kind:"chart", dept:"nav", tier:4, patient:"ER Wait & Hours Comparison",
    complaint:"Choosing safely on yourhealthns.ca at 9:30 PM", vitals:"Stable sprained ankle | Sober driver available",
    quote:"Read this live yourhealthns.ca snapshot for a stable swollen ankle at 9:30 PM.",
    q:"Which option is the smartest, safest move based on the table?",
    table:{ head:["Facility","Drive","Status at 9:30 PM","Posted Wait"], rows:[
      ["Dartmouth General ER","10 min","Open 24/7","4.5 hours"],
      ["Rural Site A ER","35 min","CLOSED (8 AM - 8 PM)","N/A"],
      ["Regional Site B ER","40 min","Open 24/7","45 min"]
    ]},
    opts:[
      "Regional Site B ER: it is confirmed open 24/7 with a much shorter wait, and the injury is stable with a sober driver",
      "Drive to Rural Site A ER because it has no wait listed",
      "Call 911 so an ambulance skips the line for a sprained ankle",
      "Wait at Rural Site A's locked doors until 8:00 AM"
    ],
    ans:0, pearl:"Always verify 24/7 open status (never drive to a closed limited-hours ER), and only travel for shorter waits when the problem is stable and you have a safe driver." }
]);
