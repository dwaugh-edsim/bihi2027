/* ============================================================================
   ON-CALL: ROOM 8 CLINIC - Expansion Bank: 60 Multiple-Choice Cases
   15 per core wing (infectious, repro, sleep, nav), Tiers 1-4.
   Grade 9 Nova Scotia / Dartmouth curriculum. Zero em/en dashes.
   ============================================================================ */
window.ONCALL_CASES = window.ONCALL_CASES || [];

window.ONCALL_CASES.push(
  /* ==================== INFECTIOUS DISEASE (15) ==================== */
  { id:"inf41", dept:"infectious", tier:1, patient:"Liam, 14", complaint:"Walked in tall grass in Dartmouth woods",
    vitals:"Small dark tick attached on calf | Found 6 hours after hike",
    quote:"I found a tick on my leg from Shubie Park. Should I burn it off with a match or coat it in Vaseline?",
    q:"What is the right way to remove a tick in Nova Scotia?",
    opts:[
      "Grasp it close to the skin with fine tweezers and pull straight up steadily, then wash the spot",
      "Cover the tick in petroleum jelly or nail polish so it suffocates and backs out",
      "Touch the tick with a hot match tip so it lets go on its own",
      "Squeeze the tick's swollen belly firmly with fingers and twist it sideways"
    ],
    ans:0, pearl:"Never burn, coat, or squeeze a tick's body (that pushes germs into the bite). Pull straight up near the skin with fine tweezers, wash well, and check with an NS pharmacist if a blacklegged tick was attached 24+ hours." },

  { id:"inf42", dept:"infectious", tier:1, patient:"Chloe, 15", complaint:"Leftover antibiotics from last winter",
    vitals:"Runny nose, sneezing, mild sore throat | Day 2",
    quote:"I found half a bottle of amoxicillin from my brother's ear infection last year. Can I take it to knock out this cold fast?",
    q:"Why is taking leftover antibiotics for a cold a double mistake?",
    opts:[
      "Colds are viral so antibiotics will not help, and taking leftover partial doses breeds antibiotic resistance",
      "Amoxicillin only works on colds if you take double the dose on Day 1",
      "Leftover antibiotics work fine on colds, but only if they belong to a family member",
      "Antibiotics cure colds in 24 hours, so saving half a bottle is smart planning"
    ],
    ans:0, pearl:"Antibiotics only fight bacteria, never cold viruses. Taking leftover or shared antibiotics exposes normal bacteria to weak doses, driving drug-resistant superbugs." },

  { id:"inf43", dept:"infectious", tier:1, patient:"Owen, 14", complaint:"Coughing in homeroom",
    vitals:"Dry cough | No fever | Sitting in a 4-desk pod",
    quote:"I always cough into my palm so I don't cough into the air. Isn't that the cleanest move?",
    q:"Why do health guidelines teach coughing into your elbow instead of your hand?",
    opts:[
      "Hands immediately touch desks, door handles, and phones, turning them into contaminated fomites",
      "Coughing into your elbow kills viruses instantly with body heat",
      "Coughing into your hand sends droplets farther across the room than an uncovered cough",
      "Germs cannot survive on skin, so palms only spread dust"
    ],
    ans:0, pearl:"Your palm is a germ shuttle to every shared handle, tablet, and pencil. Trapping droplets in your upper sleeve/elbow keeps hands cleaner between washes." },

  { id:"inf44", dept:"infectious", tier:1, patient:"Priya, 15", complaint:"Annual flu shot debate",
    vitals:"Pharmacy walk-in vaccine clinic | Healthy teen",
    quote:"My cousin says she got the flu FROM the flu shot last year. Can the injected flu shot actually give you influenza?",
    q:"What is the accurate medical answer?",
    opts:[
      "No: the injected flu shot uses inactivated virus pieces, so it cannot cause influenza infection",
      "Yes: the flu shot injects a full live flu virus to force a mild case of flu",
      "Yes: about half of people who get the flu shot develop contagious influenza for a week",
      "No: the flu shot is actually an antibiotic that blocks flu bacteria"
    ],
    ans:0, pearl:"The injected flu vaccine contains no live virus. A sore arm or mild 1-day fatigue means your immune system is building protection, not that you caught the flu." },

  { id:"inf45", dept:"infectious", tier:2, patient:"Noah, 15", complaint:"Stepped on a rusty nail in the garage",
    vitals:"Deep puncture on heel | Last tetanus shot was at age 4",
    quote:"I washed the cut with soap and water. Do I really need a clinic visit for a tiny nail puncture?",
    q:"What is the smart clinical move for a deep puncture when tetanus shots are over 10 years old?",
    opts:[
      "Get assessed promptly for a tetanus booster because tetanus bacteria thrive in deep, low-oxygen wounds",
      "Skip a booster because soap and water always kill tetanus spores deep inside tissue",
      "Wait two weeks and only see a doctor if your jaw feels stiff",
      "Take an over-the-counter allergy pill to neutralize the rust"
    ],
    ans:0, pearl:"Tetanus is caused by bacteria found in soil and dust (not rust itself) that grow in deep puncture wounds. Routine boosters every 10 years (or after a dirty wound if 5+ years) prevent it." },

  { id:"inf46", dept:"infectious", tier:2, patient:"Hannah, 14", complaint:"Chicken salad left in locker",
    vitals:"Packed at 7:30 AM without ice pack | Eaten at 1:30 PM",
    quote:"The chicken sandwich smelled totally fine after six hours in my warm locker. Does a normal smell prove food is safe?",
    q:"What is the accurate food-safety rule?",
    opts:[
      "No: food-poisoning bacteria like Salmonella multiply fast in the 4 C to 60 C danger zone without changing smell or taste",
      "Yes: harmful bacteria always turn meat sour or green before they can make you sick",
      "Yes: cooked chicken cannot grow bacteria once it has been baked once",
      "No: only raw seafood can cause food poisoning at room temperature"
    ],
    ans:0, pearl:"Pathogens do not always cause spoilage odours. Perishable foods left in the 4 C to 60 C danger zone for more than 2 hours should be tossed, not taste-tested." },

  { id:"inf47", dept:"infectious", tier:2, patient:"Caleb, 15", complaint:"Woke up with a bat in the bedroom",
    vitals:"No obvious bite mark | Slept deeply all night",
    quote:"We opened the window and shooed a bat out of my bedroom this morning. I don't see a bite, so I'm totally fine, right?",
    q:"Why does Nova Scotia Public Health treat a bat in a sleeping room seriously?",
    opts:[
      "Bat teeth are tiny and bites can go unnoticed during sleep; call 811 or Public Health to assess rabies risk immediately",
      "Bats in Nova Scotia never carry rabies, so only raccoons require assessment",
      "Rabies is easily cured with antibiotics once symptoms start",
      "You only need medical advice if the bat drew visible blood"
    ],
    ans:0, pearl:"Rabies is nearly 100% fatal once symptoms appear, but 100% preventable with timely post-exposure vaccine. Because bat bites can be invisible, contact 811/Public Health right away." },

  { id:"inf48", dept:"infectious", tier:2, patient:"Zara, 14", complaint:"Stomach bug vs. food poisoning",
    vitals:"Vomiting started 30 hours after classmate was sick",
    quote:"If a classmate has norovirus, why can't I just use lots of alcohol hand sanitizer before eating my fries?",
    q:"Why does alcohol gel fail against norovirus?",
    opts:[
      "Norovirus has a tough non-enveloped protein shell that resists alcohol; soap and running water physically rinse it off",
      "Alcohol gel only works if you use hot water with it",
      "Norovirus is a bacterium that feeds on alcohol gel",
      "Hand sanitizer only works on surfaces, never on human skin"
    ],
    ans:0, pearl:"Alcohol dissolves fatty envelopes on viruses like flu, but norovirus has a hard protein shell. Twenty seconds of soap and running water lifts and rinses it away." },

  { id:"inf49", dept:"infectious", tier:3, patient:"Devon, 15", complaint:"Finished feeling better on Day 4 of strep",
    vitals:"Prescribed 10-day antibiotic course for Group A Strep",
    quote:"My throat feels 100% normal on Day 4 of my 10-day strep prescription. Can I stop now and save the rest?",
    q:"Why must you finish the full prescribed antibiotic course for strep throat?",
    opts:[
      "Stopping early leaves the toughest bacteria alive to rebound, spread, or trigger complications like rheumatic fever",
      "The first four days only numb the throat and contain no actual antibiotic",
      "Stopping early turns bacterial strep into a viral cold",
      "Saving the extra pills is safe as long as you keep them in the fridge"
    ],
    ans:0, pearl:"Feeling better means bacterial numbers dropped, not hit zero. Finishing the full course wipes out remaining strep bacteria and prevents relapse and resistance." },

  { id:"inf50", dept:"infectious", tier:3, patient:"Amina, 14", complaint:"Immunocompromised sibling at home",
    vitals:"Younger brother on chemotherapy | Classmate skips vaccines",
    quote:"My little brother can't get live vaccines during chemo. How does our school's vaccination rate actually protect him?",
    q:"How does community immunity (herd immunity) protect people who cannot be vaccinated?",
    opts:[
      "High vaccination rates break transmission chains so the germ rarely reaches vulnerable people",
      "Vaccinated classmates pass antibodies directly through the air to unvaccinated students",
      "Community immunity only protects people who have already caught the disease once",
      "Vaccines only protect the person who gets the shot and never affect spread"
    ],
    ans:0, pearl:"When most people around a vulnerable person are immune, germs hit dead ends and cannot easily spread into their home or classroom." },

  { id:"inf51", dept:"infectious", tier:3, patient:"Lucas, 15", complaint:"Bull's-eye rash after camping",
    vitals:"Expanding red ring on thigh | Mild fatigue | 9 days post-hike",
    quote:"This red ring on my leg isn't itchy or painful, so it's probably just a spider bite. Should I ignore it?",
    q:"What does an expanding red ring after outdoor time in Nova Scotia point to?",
    opts:[
      "Possible early Lyme disease (a bacterial infection from blacklegged ticks) that responds best to early antibiotics",
      "A harmless mosquito allergy that always clears on its own with ice",
      "A fungal ringworm rash that can only be caught from gym mats",
      "A viral rash that antibiotics cannot help"
    ],
    ans:0, pearl:"Nova Scotia is a high-risk area for Lyme disease. Early assessment and antibiotics clear the bacteria before it can cause joint, nerve, or heart complications." },

  { id:"inf52", dept:"infectious", tier:3, patient:"Talia, 15", complaint:"Viral vs. bacterial sinus symptoms",
    vitals:"Stuffy nose & facial pressure for 3 days | Mild fever",
    quote:"My mucus turned greenish-yellow on Day 3 of my cold. Does green snot automatically mean I need antibiotics?",
    q:"What does greenish-yellow mucus on Day 3 of a cold actually mean?",
    opts:[
      "Normal immune white blood cells fighting a viral cold; colour alone does not prove a bacterial infection",
      "Proof of a severe bacterial infection that always needs immediate antibiotics",
      "An allergic reaction to dairy products",
      "A sign that the cold has turned into pneumonia"
    ],
    ans:0, pearl:"Mucus colour changes naturally as white blood cells respond to ordinary viral colds. Doctors look at duration (often 10+ days) and worsening fever/pain, not colour alone." },

  { id:"inf53", dept:"infectious", tier:4, patient:"Regional Health Desk", complaint:"Measles exposure in a waiting room",
    vitals:"Confirmed measles case left clinic at 1:00 PM",
    quote:"The measles patient left the waiting room an hour ago. Can an unvaccinated person still catch measles walking in at 2:00 PM?",
    q:"Why is measles uniquely dangerous in shared indoor spaces?",
    opts:[
      "Measles is airborne and can linger in indoor air for up to 2 hours after an infected person leaves",
      "Measles only spreads through shared water bottles, never through air",
      "Measles is a bacterial infection that dies within 30 seconds outside the body",
      "Unvaccinated people can only catch measles if they shake hands with the patient"
    ],
    ans:0, pearl:"Measles is one of the most contagious airborne viruses on earth, lingering up to 2 hours in air. Two doses of MMR vaccine provide ~97% protection." },

  { id:"inf54", dept:"infectious", tier:4, patient:"School Outbreak Review", complaint:"Incubation period vs. contagious window",
    vitals:"Flu spreading across Grade 9 pod",
    quote:"Can someone spread influenza or COVID-19 before they even realize they are sick?",
    q:"What is pre-symptomatic transmission?",
    opts:[
      "Shedding enough virus to infect others 1 to 2 days before your own symptoms appear",
      "Catching a virus twice in the same week",
      "Only being contagious after your fever has been gone for a week",
      "Spreading a bacterial infection through cooked food"
    ],
    ans:0, pearl:"Many respiratory viruses shed before symptoms start, which is why baseline habits (vaccines, handwashing, ventilation, staying home when unwell) matter so much." },

  { id:"inf55", dept:"infectious", tier:4, patient:"Microbiology Audit", complaint:"How superbugs evolve",
    vitals:"MRSA / resistant bacteria briefing",
    quote:"When people say 'antibiotic resistance,' does that mean the human body becomes immune to antibiotics?",
    q:"What actually becomes resistant during antibiotic resistance?",
    opts:[
      "The bacteria evolve ways to survive the drug, making future infections much harder to treat",
      "Your stomach stops absorbing antibiotic pills after you take them twice",
      "Viruses mutate into antibiotics inside the bloodstream",
      "Your immune system forgets how to fight colds"
    ],
    ans:0, pearl:"It is the bacteria, not the human body, that become resistant. Smart antibiotic stewardship protects life-saving medicines for everyone." },

  /* ==================== SEXUAL & REPRODUCTIVE HEALTH (15) ==================== */
  { id:"rep41", dept:"repro", tier:1, patient:"Sam, 15", complaint:"Consent and alcohol",
    vitals:"Post-party conversation | Youth wellness drop-in",
    quote:"If someone is heavily drunk or passed out and doesn't say 'no,' can they legally give consent in Canada?",
    q:"What is the clear Canadian legal and health rule?",
    opts:[
      "No: an intoxicated or incapacitated person cannot legally give consent, even if they do not say no",
      "Yes: consent is valid as long as the person agreed earlier in the evening before drinking",
      "Yes: only if both people have been drinking the same amount",
      "No: unless they are already in a long-term relationship"
    ],
    ans:0, pearl:"Under Canadian law, anyone incapacitated by alcohol or drugs cannot consent. Consent must be active, sober enough to choose freely, and ongoing." },

  { id:"rep42", dept:"repro", tier:1, patient:"Maya, 15", complaint:"HPV vaccine eligibility",
    vitals:"Grade 9 clinic review | Asking for her brother",
    quote:"My brother thinks the HPV vaccine is only for girls because of cervical cancer. Is that true?",
    q:"Who benefits from the free Nova Scotia school HPV vaccine?",
    opts:[
      "All genders: HPV causes genital warts and multiple cancers (throat, anal, penile, cervical) and spreads between partners",
      "Only girls, because boys cannot carry or spread HPV",
      "Only adults over age 25 who already had a positive STI test",
      "Only people who are allergic to latex condoms"
    ],
    ans:0, pearl:"HPV affects all genders. Free school-based vaccination protects against the highest-risk cancer-causing and wart-causing HPV strains before exposure." },

  { id:"rep43", dept:"repro", tier:1, patient:"Jordan, 15", complaint:"Birth control pill vs. STIs",
    vitals:"Youth Health Centre | Starting oral contraception",
    quote:"Now that I'm on the birth control pill every day, we don't need condoms anymore, right?",
    q:"What is the key protection gap with hormonal birth control?",
    opts:[
      "The pill prevents pregnancy when taken properly, but provides zero protection against STIs; condoms are needed for STI protection",
      "The pill blocks bacterial STIs like chlamydia, just not viral ones",
      "The pill protects against both pregnancy and all STIs automatically",
      "Condoms should never be used while taking the birth control pill"
    ],
    ans:0, pearl:"Dual protection (hormonal/IUD method + condoms) is the gold standard: hormonal methods prevent pregnancy, while barrier methods reduce STI transmission." },

  { id:"rep44", dept:"repro", tier:1, patient:"Alex, 14", complaint:"Private photo pressure",
    vitals:"Receiving repeated DMs from a crush",
    quote:"Someone I like keeps saying 'if you really trusted me, you'd send a photo.' What kind of behaviour is that?",
    q:"How do healthy-relationship frameworks classify that line?",
    opts:[
      "Coercion and boundary pressure: real trust respects a 'no' the first time without guilt trips",
      "Normal flirting that shows strong commitment",
      "Safe as long as the app claims messages disappear after 10 seconds",
      "Healthy communication as long as they send one first"
    ],
    ans:0, pearl:"Guilt trips ('if you trusted me...') are classic coercion, not consent. And disappearing apps never stop screenshots or second-phone photos." },

  { id:"rep45", dept:"repro", tier:2, patient:"Nadia, 15", complaint:"Wallet condom check",
    vitals:"Condom kept in back-pocket wallet for 8 months",
    quote:"I've kept a backup condom in my back-pocket wallet since last summer so I'm always prepared. Smart?",
    q:"Why is a back-pocket wallet a bad place to store condoms?",
    opts:[
      "Body heat and friction weaken latex over time, making it far more likely to tear; store flat in a cool, dry spot",
      "Wallet leather makes the expiry date unreadable, though the latex stays strong",
      "Condoms never expire or weaken as long as the foil wrapper looks closed",
      "Storing condoms in a freezer is the only safe way to keep them"
    ],
    ans:0, pearl:"Heat, friction, and sharp objects (keys/wallet edges) create microscopic weak spots in latex. Check the expiry date and store in a cool, dry pouch or drawer." },

  { id:"rep46", dept:"repro", tier:2, patient:"Ethan, 15", complaint:"Testing the morning after",
    vitals:"Unprotected sex 18 hours ago | Wants STI test today",
    quote:"I had unprotected sex last night and want an STI urine test today so I know 100% I'm clear right away.",
    q:"What is the 'window period' issue with testing 18 hours after exposure?",
    opts:[
      "Most STIs need days to weeks before tests can detect them; testing too early can give a false negative, so follow-up timing matters",
      "STI tests are 100% accurate within 2 hours of exposure",
      "Urine tests only work if you have visible symptoms",
      "You only ever need to test once a year no matter what happens"
    ],
    ans:0, pearl:"Testing right away can miss a brand-new infection during the window period (often 1 to 2 weeks for chlamydia/gonorrhea, longer for blood-borne STIs). A nurse can map out the right test date." },

  { id:"rep47", dept:"repro", tier:2, patient:"Sienna, 16", complaint:"NS pharmacist contraception access",
    vitals:"Lives in Dartmouth | No family doctor",
    quote:"I don't have a family doctor and walk-ins are impossible. Can a Nova Scotia pharmacist actually prescribe birth control?",
    q:"What can a Nova Scotia pharmacist do for contraception?",
    opts:[
      "Assess and prescribe hormonal contraception (pill, patch, ring, shot) and provide emergency contraception without a doctor's visit",
      "Only sell condoms; all hormonal contraception requires a hospital OB-GYN",
      "Only renew an existing pill prescription if you bring a signed parent note",
      "Only prescribe birth control to patients over age 21"
    ],
    ans:0, pearl:"Nova Scotia pharmacists can assess and prescribe contraception directly (MSI covers the assessment), making access much faster for youth without a family doctor." },

  { id:"rep48", dept:"repro", tier:2, patient:"Marcus, 15", complaint:"Healthy vs. controlling dating habits",
    vitals:"Friend's partner demands phone passcode and live location 24/7",
    quote:"My friend says her boyfriend checks her Snap Map and reads her DMs every night 'because he cares so much.' Is that normal?",
    q:"What is the accurate healthy-relationship assessment?",
    opts:[
      "Digital monitoring and demanding passcodes are controlling red flags, not signs of healthy love",
      "Sharing all passwords and 24/7 location tracking is required for healthy trust",
      "It only becomes unhealthy if someone yells in person",
      "Checking DMs is fine as long as both partners are in Grade 9"
    ],
    ans:0, pearl:"Healthy relationships include privacy, independence, and trust. Digital surveillance, jealousy framed as 'care,' and isolating someone from friends are early warning signs of control." },

  { id:"rep49", dept:"repro", tier:3, patient:"Avery, 16", complaint:"Understanding U=U for HIV",
    vitals:"Health literacy Q&A | Clinic bulletin board",
    quote:"I saw a poster saying 'U=U' in the Youth Health Centre. What does that actually mean?",
    q:"What does U=U stand for in modern HIV medicine?",
    opts:[
      "Undetectable = Untransmittable: a person living with HIV on daily medication who keeps an undetectable viral load cannot pass HIV sexually",
      "Untested = Untreatable: HIV cannot be managed once diagnosed",
      "Urgent = Unprotected: a reminder to take PEP within 72 hours",
      "Universal = Unvaccinated: a campaign for the HIV vaccine"
    ],
    ans:0, pearl:"Modern antiretroviral therapy suppresses HIV to undetectable levels, allowing people to live long, healthy lives with zero sexual transmission (U=U)." },

  { id:"rep50", dept:"repro", tier:3, patient:"Kayla, 15", complaint:"Emergency contraception options",
    vitals:"Condom broke 4 days (96 hours) ago",
    quote:"It has been 4 days since a condom broke. Is it too late for any emergency contraception?",
    q:"What accurate options still exist at Day 4 (96 hours)?",
    opts:[
      "Prescription ulipristal (ella) works up to 5 days, and a copper IUD placed within 7 days is the most effective option",
      "Nothing works past 24 hours, so you can only wait for a missed period",
      "Taking three packs of regular birth control pills at once is the safest option",
      "Standard over-the-counter Plan B is still at peak 99% effectiveness on Day 5"
    ],
    ans:0, pearl:"Sooner is always better, but Day 4 is NOT too late: ulipristal works up to 5 days and a copper IUD works up to 7 days (and provides ongoing contraception)." },

  { id:"rep51", dept:"repro", tier:3, patient:"Devon, 15", complaint:"LARC methods explained",
    vitals:"Comparing typical-use effectiveness",
    quote:"Why do clinics say IUDs and arm implants have over 99% real-world effectiveness while pills average around 91%?",
    q:"Why is the real-world gap so big between IUDs/implants and daily pills?",
    opts:[
      "IUDs and implants remove human-memory errors (missed pills, late refills), so typical use matches perfect use",
      "Daily pills only work on weekdays",
      "IUDs contain antibiotics that block sperm",
      "Pills lose half their strength if you drink water with them"
    ],
    ans:0, pearl:"Long-Acting Reversible Contraceptives (LARCs) work automatically for years without daily remembering, eliminating typical-use missed-dose gaps." },

  { id:"rep52", dept:"repro", tier:3, patient:"Rory, 15", complaint:"Confidential youth care in NS",
    vitals:"15yo wants STI test without telling parents",
    quote:"I'm 15 and want a confidential STI check at a Nova Scotia youth clinic. Do they automatically call my parents?",
    q:"How does youth medical confidentiality work in Nova Scotia?",
    opts:[
      "If a youth can understand the care and choices (mature minor), routine STI testing and contraception stay confidential",
      "Clinics must legally phone a parent before any teen under 18 can give a urine sample",
      "Confidentiality only applies if you pay cash instead of using your MSI card",
      "Nurses share all routine clinic results with the school principal"
    ],
    ans:0, pearl:"Nova Scotia recognizes mature minors for routine sexual health care. Confidentiality is only broken for serious safety exceptions (abuse or immediate risk of severe harm)." },

  { id:"rep53", dept:"repro", tier:4, patient:"Tessa, 16", complaint:"Sexting image already leaked",
    vitals:"Panicking in guidance office | Photo posted online",
    quote:"Someone shared a private picture of my friend without permission. Is there any real way to get it taken down?",
    q:"Which Canadian resource specializes in helping youth get intimate images removed online?",
    opts:[
      "NeedHelpNow.ca (run by the Canadian Centre for Child Protection) plus reporting non-consensual sharing to platforms and trusted adults/police",
      "Deleting your own social media account automatically erases the image from everyone else's phone",
      "Paying the person who posted it to remove it quietly",
      "Waiting a month because platforms automatically delete all reposted photos"
    ],
    ans:0, pearl:"Sharing an intimate image without consent is a crime in Canada. NeedHelpNow.ca walks youth step-by-step through takedown tools, platform reports, and emotional support." },

  { id:"rep54", dept:"repro", tier:4, patient:"Omar, 16", complaint:"Herpes (HSV) stigma vs. reality",
    vitals:"Positive HSV-1 swab | Feeling devastated",
    quote:"My swab came back positive for HSV-1. Does that mean my life and future relationships are ruined?",
    q:"What is the accurate, stigma-free clinical perspective on HSV?",
    opts:[
      "HSV is very common (most adults carry HSV-1); antiviral medicine and avoiding contact during outbreaks make it very manageable",
      "HSV is rare and fatal if not cured with penicillin within 7 days",
      "Anyone with HSV-1 can never kiss or date safely again",
      "HSV only spreads through shared drinking glasses, never skin-to-skin contact"
    ],
    ans:0, pearl:"Stigma causes more distress than the virus itself. HSV is common and manageable with antivirals, honest communication, and barrier/outbreak precautions." },

  { id:"rep55", dept:"repro", tier:4, patient:"Clinic Ethics Review", complaint:"Partner notification after positive STI",
    vitals:"Positive gonorrhea test | Embarrassed to tell ex-partner",
    quote:"If I'm too awkward to text my past partner myself after a positive STI test, what safe option exists?",
    q:"How can public health help with partner notification?",
    opts:[
      "Public Health nurses can notify past partners confidentially without revealing your name, so they still get tested and treated",
      "Skip telling them because gonorrhea clears up on its own in most people",
      "Post a vague hint on social media instead",
      "Give them half of your own antibiotic pills"
    ],
    ans:0, pearl:"Anonymous partner notification through Public Health protects partners from silent complications (like PID) and stops reinfection while protecting your privacy." },

  /* ==================== SLEEP & SCREEN SCIENCE (15) ==================== */
  { id:"slp41", dept:"sleep", tier:1, patient:"Jaden, 14", complaint:"Can't fall asleep before 11:30 PM",
    vitals:"Goes to bed at 9:30 PM, stares at ceiling | Feels wired",
    quote:"My parents say I'm just being lazy because I'm wide awake at 10:30 PM and dead tired at 7 AM. Is it actually biology?",
    q:"What happens to the brain's circadian clock during puberty?",
    opts:[
      "A natural biological phase delay shifts melatonin release roughly 1 to 2 hours later in teens",
      "Teens stop producing melatonin altogether until age 20",
      "Teens only need 5 hours of sleep because their brains grow faster",
      "Waking up tired is only caused by eating breakfast too late"
    ],
    ans:0, pearl:"Teen circadian phase delay is real biology, not laziness. Because school starts early, protecting a steady bedtime and cutting late screens is extra important." },

  { id:"slp42", dept:"sleep", tier:1, patient:"Mia, 14", complaint:"Phone under the pillow",
    vitals:"Wakes up to check Snap streaks at 1:30 AM and 3:15 AM",
    quote:"I only look at my phone for 30 seconds when it buzzes at night and go right back to sleep. Does that really hurt my sleep?",
    q:"Why do brief overnight phone checks wreck sleep quality?",
    opts:[
      "They fragment continuous sleep cycles, cutting into Deep and REM sleep and spiking brain alertness",
      "As long as each check is under 2 minutes, your sleep cycle resumes right where it paused",
      "Vibration mode has zero effect on the sleeping brain",
      "Checking messages at 2 AM actually deepens REM sleep"
    ],
    ans:0, pearl:"Fragmented sleep leaves you foggy even if you spent 8 hours in bed. Parking the phone outside the bedroom (or on Do Not Disturb across the room) protects whole cycles." },

  { id:"slp43", dept:"sleep", tier:1, patient:"Leo, 15", complaint:"Hot bedroom trouble",
    vitals:"Bedroom at 24 C with heavy duvet | Tossing and turning",
    quote:"I keep my bedroom super warm and toasty at night, yet I toss and turn for an hour. Why?",
    q:"What bedroom temperature helps the body initiate sleep?",
    opts:[
      "A cool room (around 18 to 19 C), because your core body temperature needs to drop slightly to trigger sleep",
      "A hot room (25 C+) so your muscles stay warm all night",
      "Temperature has zero effect on falling asleep",
      "Freezing cold (5 C) with bright overhead lights"
    ],
    ans:0, pearl:"A natural drop in core body temperature signals the brain it is time for sleep. Cool, dark, and quiet bedrooms speed up sleep onset." },

  { id:"slp44", dept:"sleep", tier:1, patient:"Grace, 14", complaint:"All-nighter before Science test",
    vitals:"Planning to study from 11 PM to 5 AM with energy drinks",
    quote:"I didn't study all week, so I'm pulling an all-nighter tonight to cram every single note. Good strategy?",
    q:"What happens to memory when you pull an all-nighter?",
    opts:[
      "Skipping sleep blocks memory consolidation in the hippocampus, hurting recall and problem-solving far more than an extra hour of cramming helps",
      "Cramming all night locks facts into permanent memory twice as fast",
      "Energy drinks replace REM sleep for 24 hours",
      "Sleep only helps physical sports, not academic tests"
    ],
    ans:0, pearl:"Sleep is literally when the brain saves and organizes what you studied. Getting a solid night's sleep beats an all-nighter on test performance." },

  { id:"slp45", dept:"sleep", tier:2, patient:"Eli, 15", complaint:"Hook Machine endless scroll",
    vitals:"Meant to watch 1 TikTok at 10 PM; still scrolling at 12:40 AM",
    quote:"Why is it SO hard to put my phone down at night even when I'm exhausted and want to sleep?",
    q:"What design mechanism keeps apps pulling you into 'just one more video'?",
    opts:[
      "Variable-reward algorithms, autoplay, and infinite scroll trigger dopamine anticipation loops that override fatigue signals",
      "Phones release mild caffeine vapour through the screen",
      "Autoplay shuts off melatonin only during daylight hours",
      "Teens lack the ability to feel tired before 1 AM"
    ],
    ans:0, pearl:"Apps are engineered like slot machines (variable rewards + zero stopping cues). Setting a physical stopping cue (charging the phone in the kitchen at 10 PM) beats willpower." },

  { id:"slp46", dept:"sleep", tier:2, patient:"Nora, 15", complaint:"Soccer knee injury risk",
    vitals:"Averaging 6 hours of sleep during tournament week",
    quote:"Does getting 6 hours of sleep instead of 8+ actually affect sports injuries, or just make me feel grumpy?",
    q:"What does sports-medicine research show about teen athletes sleeping under 8 hours?",
    opts:[
      "Significantly higher injury rates, slower reaction time, and weaker muscle tissue repair (less Deep sleep growth hormone)",
      "Zero effect on injury risk as long as you stretch for 5 minutes",
      "Less sleep actually speeds up sprint reaction times",
      "Athletes only need extra sleep after an injury happens"
    ],
    ans:0, pearl:"Teen athletes sleeping under 8 hours face roughly 1.7x higher injury risk. Deep sleep is when growth hormone repairs muscles and tendons." },

  { id:"slp47", dept:"sleep", tier:2, patient:"Samir, 14", complaint:"4:30 PM two-hour nap",
    vitals:"Takes a 2-hour nap after school, then cannot sleep at 11 PM",
    quote:"I'm exhausted after school so I crash from 4:30 to 6:30 PM, then I'm wide awake until 1 AM. What's happening?",
    q:"How does a long late-afternoon nap ruin bedtime?",
    opts:[
      "It clears out the adenosine (sleep pressure) your brain built all day, leaving too little sleep drive at bedtime",
      "Naps permanently stop melatonin production for 48 hours",
      "Afternoon naps only hurt sleep if you dream during them",
      "Long naps increase adenosine and make bedtime earlier"
    ],
    ans:0, pearl:"Adenosine builds up like a sleep-hunger meter all day. A 2-hour evening nap empties that meter; if you must nap, keep it to 20 minutes before 3 PM." },

  { id:"slp48", dept:"sleep", tier:2, patient:"Becca, 15", complaint:"Morning daylight reset",
    vitals:"Wakes up in dark room, rides bus staring at phone",
    quote:"What is one free 10-minute morning habit that actually makes it easier to fall asleep earlier that night?",
    q:"How does bright morning outdoor light help tonight's bedtime?",
    opts:[
      "Morning sunlight shuts off lingering melatonin and starts a ~14 to 16 hour countdown timer for tonight's melatonin release",
      "Sunlight directly adds Vitamin C to your brain's sleep center",
      "Bright morning light delays bedtime by 3 hours",
      "Indoor bedroom lamps are just as strong as outdoor daylight"
    ],
    ans:0, pearl:"Outdoor morning light (even on cloudy Nova Scotia mornings) is far brighter than indoor bulbs and anchors your circadian clock so you feel sleepy on time at night." },

  { id:"slp49", dept:"sleep", tier:3, patient:"Owen, 15", complaint:"High-dose melatonin gummies",
    vitals:"Taking 10 mg melatonin gummies at midnight when he can't sleep",
    quote:"I pop 10 mg of melatonin gummies at midnight whenever I'm still scrolling. Is more melatonin better?",
    q:"What is the evidence-based truth about over-the-counter melatonin?",
    opts:[
      "Melatonin is a timing signal (not a heavy sedative); high late doses can cause morning grogginess and shift your clock the wrong way",
      "10 mg of melatonin knocks you out instantly like general anesthesia",
      "Melatonin gummies are regulated as prescription sleep medicine in Canada",
      "Taking melatonin cancels out the effect of a 9 PM energy drink"
    ],
    ans:0, pearl:"Melatonin tells your clock 'night has started' rather than forcing sleep. Always check with a doctor or pharmacist before using supplements instead of fixing light/screen habits." },

  { id:"slp50", dept:"sleep", tier:3, patient:"Aisha, 15", complaint:"Sunday night insomnia",
    vitals:"Sleeps 2 AM to 12:30 PM Sat/Sun | Can't sleep at 10 PM Sunday",
    quote:"Every Sunday night I lie awake staring at the wall until 1 AM, even though I'm stressed about Monday morning.",
    q:"What is the clinical name for shifting your schedule 3+ hours later every weekend?",
    opts:[
      "Social jetlag: your body clock shifts west like flying across three time zones, then crashes on Monday morning",
      "Chronic sleep apnea triggered by Sunday dinner",
      "REM rebound syndrome",
      "Circadian immunity"
    ],
    ans:0, pearl:"Keeping weekend wake times within ~1 to 1.5 hours of school days prevents social jetlag and stops the brutal Sunday-night / Monday-morning crash." },

  { id:"slp51", dept:"sleep", tier:3, patient:"Tyler, 15", complaint:"Two energy drinks before gaming",
    vitals:"320 mg caffeine total | Heart racing, hands shaky, anxious",
    quote:"I drank two large energy drinks during a gaming tournament. Now my heart is pounding and I feel panicky. Why?",
    q:"What is Health Canada's daily caffeine limit for teens (ages 13 to 18)?",
    opts:[
      "About 2.5 mg per kg of body weight (~100 to 150 mg/day max); 320 mg causes jitters, anxiety, racing heart, and severe sleep loss",
      "Up to 600 mg per day as long as the cans say 'sugar-free'",
      "There is no caffeine limit for teens once they turn 14",
      "Caffeine only affects heart rate if mixed with milk"
    ],
    ans:0, pearl:"One big energy drink can exceed a teen's entire daily caffeine guideline. High doses mimic panic attacks, raise heart rate, and wreck sleep for 10+ hours." },

  { id:"slp52", dept:"sleep", tier:3, patient:"Kira, 14", complaint:"Night Shift / blue-light filter myth",
    vitals:"Uses warm screen tint while texting drama until 12:30 AM",
    quote:"I turned on Night Shift mode so my screen looks orange. Now scrolling in bed until midnight won't affect my sleep, right?",
    q:"Why does Night Shift mode NOT make midnight scrolling harmless?",
    opts:[
      "Emotional/social engagement keeps your brain aroused (cortisol/dopamine), and you still lose actual hours of sleep",
      "Orange screen light actually doubles caffeine levels",
      "Night Shift only works on laptops, not phones",
      "Blue light filters make you fall asleep while holding the phone"
    ],
    ans:0, pearl:"Warm tints slightly cut blue light, but active texting, gaming, and endless video feeds still keep the brain alert and steal sleep time." },

  { id:"slp53", dept:"sleep", tier:4, patient:"Sleep Lab Review", complaint:"Deep sleep vs. REM sleep",
    vitals:"Polysomnography stage breakdown",
    quote:"If you cut an 8.5-hour night down to 5.5 hours by staying up late, which sleep stage gets chopped the hardest?",
    q:"Why does cutting off the last 2 to 3 hours of sleep hit mood and memory especially hard?",
    opts:[
      "REM sleep concentrates heavily in the final hours of the night, so short nights disproportionately wipe out emotional regulation and memory consolidation",
      "All sleep stages happen equally in the first 60 minutes only",
      "Deep sleep only happens in the last 30 minutes before your alarm",
      "The brain skips directly to REM the instant your head hits the pillow"
    ],
    ans:0, pearl:"Early-night cycles are rich in Deep (physical repair) sleep; late-night cycles are rich in REM (memory, learning, emotional stability). Cutting 2 hours can slash REM in half." },

  { id:"slp54", dept:"sleep", tier:4, patient:"Traffic & Safety Desk", complaint:"Drowsy biking/driving impairment",
    vitals:"Awake for 18+ hours straight",
    quote:"How does staying awake for 18 to 20 hours affect reaction time and judgment compared to alcohol?",
    q:"What does sleep-deprivation research show about 18 to 20 hours awake?",
    opts:[
      "Reaction time and judgment drop to levels comparable to a 0.05% to 0.08% blood alcohol concentration (impaired)",
      "Sleep deprivation only makes you yawn; reaction time stays completely normal",
      "Opening a window or playing loud music fully restores alert reaction time",
      "Teens are immune to drowsy microsleeps"
    ],
    ans:0, pearl:"Severe sleep loss causes involuntary 'microsleeps' and alcohol-like reaction delays. No playlist or cold air substitutes for actual sleep." },

  { id:"slp55", dept:"sleep", tier:4, patient:"Mood & Brain Clinic", complaint:"Sleep loss and amygdala reactivity",
    vitals:"5 hours/night all week | Snapping at friends, feeling overwhelmed",
    quote:"Everything feels 10 times more stressful and I'm snapping at everyone when I sleep 5 hours a night. Why?",
    q:"What happens in the sleep-deprived brain's emotional wiring?",
    opts:[
      "The emotional alarm center (amygdala) becomes ~60% more reactive while the prefrontal cortex's calming brake weakens",
      "Sleep loss shrinks the amygdala so you feel zero emotions",
      "Short sleep only affects physical stamina, never anxiety or mood",
      "Snapping at friends is caused purely by low sugar"
    ],
    ans:0, pearl:"Sleep acts as overnight emotional first aid. Protecting 8 to 10 hours strengthens prefrontal self-control and lowers anxiety reactivity." },

  /* ==================== NAVIGATION, BOUNDARIES, MSI & INSURANCE (15) ==================== */
  { id:"nav41", dept:"nav", tier:1, patient:"Mila, 14", complaint:"Need mental health crisis support tonight",
    vitals:"Feeling overwhelmed and unsafe at 10:30 PM",
    quote:"What is the free, 24/7 three-digit number across Canada you can CALL OR TEXT during a mental health or suicide crisis?",
    q:"Pick the accurate Canadian crisis number:",
    opts:[
      "988 (Suicide Crisis Helpline - free, confidential, 24/7 call or text)",
      "411 (Directory Assistance)",
      "311 (Municipal non-emergency services)",
      "511 (Nova Scotia road conditions)"
    ],
    ans:0, pearl:"988 connects you 24/7 by call or text to trained responders across Canada. Youth can also text CONNECT to 686868 (Kids Help Phone) or call 911 in immediate danger." },

  { id:"nav42", dept:"nav", tier:1, patient:"Carter, 15", complaint:"Pink eye on a Saturday morning",
    vitals:"Red itchy eye, sticky lashes | Vision normal, no severe pain",
    quote:"My eye is red and gunky today. Walk-in clinics in Dartmouth are already full. Where is the fastest smart place to go?",
    q:"What is the smartest Nova Scotia care door for uncomplicated pink eye?",
    opts:[
      "A Nova Scotia pharmacy: pharmacists can assess pink eye and prescribe drops with no appointment (assessment covered by MSI)",
      "Call 911 for an ambulance to Dartmouth General ER",
      "Wait 3 weeks to see if it spreads to both eyes",
      "Borrow someone else's leftover ear drops"
    ],
    ans:0, pearl:"NS pharmacists assess and prescribe for uncomplicated pink eye, UTIs, cold sores, strep, and more - saving hours in an ER waiting room." },

  { id:"nav43", dept:"nav", tier:1, patient:"Sora, 15", complaint:"Need community resources & rides",
    vitals:"Family needs free food bank / transit / local support info",
    quote:"Which free, confidential 24/7 Nova Scotia number connects people to community, social, food, and health supports?",
    q:"Which 3-digit number handles community and social supports in Nova Scotia?",
    opts:[
      "211 Nova Scotia (phone, text, or ns.211.ca)",
      "811 (strictly for surgical bookings)",
      "911 (emergency paramedics only)",
      "611 (cell phone carrier support)"
    ],
    ans:0, pearl:"211 Nova Scotia connects residents to local community programs, food supports, transportation, and free counselling directories 24/7." },

  { id:"nav44", dept:"nav", tier:1, patient:"Ben, 14", complaint:"Offered a flavoured vape in the washroom",
    vitals:"Peer pressure moment | Wants a smooth exit",
    quote:"Someone hands me a mango vape and says 'relax, it's just flavoured water vapour.' What's the truth?",
    q:"What is actually inside most flavoured disposable vapes?",
    opts:[
      "High-dose nicotine salts (often equal to a pack+ of cigarettes), ultrafine aerosol particles, and flavouring chemicals that irritate developing lungs",
      "Pure distilled water vapour and harmless food colouring",
      "Zero nicotine as long as it tastes like fruit or mint",
      "Vitamin E vapour that clears out asthma"
    ],
    ans:0, pearl:"Vape aerosol is NOT harmless water vapour. High-concentration nicotine salts wire addiction rapidly into the developing teen brain." },

  { id:"nav45", dept:"nav", tier:2, patient:"Tessa, 15", complaint:"MSI coverage check",
    vitals:"Moving into Grade 10 | Checking what MSI pays",
    quote:"Which of these four items IS covered by Nova Scotia's public MSI health card?",
    q:"Pick the item covered by MSI:",
    opts:[
      "Emergency room stitches, hospital stays, and medically necessary doctor visits",
      "Braces and orthodontic retainers at age 15",
      "Prescription eyeglasses and contact lenses for teens",
      "Retail antibiotic prescriptions picked up at Shoppers Drug Mart"
    ],
    ans:0, pearl:"MSI covers medically necessary hospital and physician services (and basic dental only until the end of the month you turn 15). Prescriptions, glasses, braces, and physio need private benefits or Pharmacare." },

  { id:"nav46", dept:"nav", tier:2, patient:"Aiden, 15", complaint:"Over-the-counter double-dosing trap",
    vitals:"Took cold/flu combo liquid + extra Tylenol",
    quote:"I took a multi-symptom cold syrup AND two extra-strength acetaminophen pills for my headache. Any problem with that?",
    q:"Why must you always check the 'Active Ingredients' box on OTC cold medicines?",
    opts:[
      "Multi-symptom cold meds often already contain acetaminophen, so adding Tylenol risks accidental liver-damaging overdose",
      "Cold syrups only contain sugar and flavouring",
      "Acetaminophen and Tylenol are completely unrelated drugs",
      "OTC medicines sold without a prescription cannot cause overdose"
    ],
    ans:0, pearl:"Always read active ingredients. Stacking two products containing acetaminophen (Tylenol) can quickly exceed the safe daily liver limit." },

  { id:"nav47", dept:"nav", tier:2, patient:"Zoe, 15", complaint:"Good Samaritan Drug Overdose Act",
    vitals:"Friend unresponsive after taking unknown pill at party",
    quote:"Everyone is scared to call 911 because there are drugs in the room and they think police will arrest the caller for possession.",
    q:"What legal protection exists in Canada when calling 911 for an overdose?",
    opts:[
      "The Good Samaritan Drug Overdose Act protects the caller and people at the scene from simple possession charges so nobody hesitates to save a life",
      "There is no legal protection; callers are automatically charged",
      "Protection only applies to adults over age 21",
      "It only applies if you drive the person yourself instead of calling 911"
    ],
    ans:0, pearl:"Never hesitate to call 911 in an overdose. The Good Samaritan Drug Overdose Act exists specifically so fear of simple possession charges never costs a life." },

  { id:"nav48", dept:"nav", tier:2, patient:"Liam, 15", complaint:"Ambulance bill surprise",
    vitals:"Non-emergency sprained finger | Thinking of calling 911 for a ride",
    quote:"Is an ambulance ride completely $0 free for everyone in Nova Scotia?",
    q:"What is the truth about ambulances in Nova Scotia?",
    opts:[
      "Ambulances are for real emergencies (call 911 without hesitation when needed), and NS charges an ambulance fee unless covered by private insurance or exemptions",
      "Ambulances are $0 free taxis for any clinic visit",
      "Ambulances cost $10,000 in Nova Scotia",
      "Calling 911 is only allowed if a doctor approves it first"
    ],
    ans:0, pearl:"In a real emergency, ALWAYS call 911 immediately regardless of cost. For minor stable injuries, getting a ride or calling 811 keeps ambulances free for life-threatening calls." },

  { id:"nav49", dept:"nav", tier:3, patient:"Maya, 15", complaint:"Family road trip to Florida",
    vitals:"Broken ankle at beach | No travel medical insurance",
    quote:"Wait - if I break my ankle in Florida with NO travel insurance, won't the US hospital turn me away at the door?",
    q:"What actually happens at a US Emergency Room under US law (EMTALA)?",
    opts:[
      "The ER must medically stabilize you regardless of insurance, and THEN bills you thousands of dollars (MSI covers almost none of it)",
      "The ER sends the full bill directly to Nova Scotia MSI at $0 cost to you",
      "US hospitals treat Canadian tourists for free under a border treaty",
      "US ERs refuse all non-citizens even in life-threatening emergencies"
    ],
    ans:0, pearl:"EMTALA guarantees stabilizing emergency care in US ERs, NOT free care. Without travel medical insurance, a broken bone or infection in the US can leave a family with a $5,000-$30,000+ USD bill." },

  { id:"nav50", dept:"nav", tier:3, patient:"Noah, 15", complaint:"Checking ER wait times online",
    vitals:"Stable wrist sprain at 7 PM | Checking yourhealthns.ca",
    quote:"On yourhealthns.ca, one rural ER shows a 15-minute wait, while Dartmouth General shows 4 hours. What MUST you check before driving there?",
    q:"What critical detail on yourhealthns.ca can save a wasted drive?",
    opts:[
      "Check whether that ER is open 24/7 or has limited hours/temporary closure, and only travel if the injury is stable with a sober driver",
      "Never check hours because every hospital ER in Nova Scotia is open 24/7",
      "Always drive to the farthest ER even during chest pain or severe bleeding",
      "You must pay a booking fee on yourhealthns.ca before arriving"
    ],
    ans:0, pearl:"Many smaller NS emergency departments have limited hours or temporary closures. Never shop for wait times in a true emergency (call 911/nearest ER), and always verify hours for stable injuries." },

  { id:"nav51", dept:"nav", tier:3, patient:"Priya, 15", complaint:"Public vs. private mental health care in NS",
    vitals:"Looking for ongoing anxiety counselling",
    quote:"Does EVERY mental health service in Nova Scotia cost $150+ per hour out of pocket?",
    q:"What is the honest picture of mental health care in Nova Scotia?",
    opts:[
      "Public clinics (NS Health, IWK, School Youth Health Centres) are free under MSI though wait lists can be long; private therapists are faster but cost money or private benefits",
      "All counselling in Nova Scotia is 100% private and costs $200/hour",
      "Public mental health clinics have zero wait times and see everyone the same afternoon",
      "Teens cannot access public mental health intake without a family doctor"
    ],
    ans:0, pearl:"NS Health Mental Health & Addictions central intake (1-855-922-1122), IWK, and School Youth Health Centres are free with no referral needed, though wait lists exist; private benefits help pay for faster private counselling." },

  { id:"nav52", dept:"nav", tier:3, patient:"Chloe, 14", complaint:"Spotting health misinformation online",
    vitals:"TikTok influencer selling 'detox drops' that cure acne & anxiety",
    quote:"This creator has 2 million followers and says doctors are hiding a $49 detox drop that cures everything. Red flags?",
    q:"Which combination is the clearest sign of unreliable health info online?",
    opts:[
      "Miracle 'cures everything' claims, 'doctors don't want you to know,' emotional testimonials, and an affiliate shop link with no peer-reviewed evidence",
      "Links to Health Canada, IWK, or Nova Scotia Health guidelines",
      "Clear explanation of both benefits and side effects",
      "Advice to check with a pharmacist or nurse practitioner"
    ],
    ans:0, pearl:"Follower count is not medical credentials. Check who pays the creator, whether they sell a miracle fix, and verify claims against trusted public health sources (811, Health Canada, IWK, CPS)." },

  { id:"nav53", dept:"nav", tier:4, patient:"Jordan, 16", complaint:"Turning 16 & MSI dental cutoff",
    vitals:"Turned 15 in October | Needs filling in December",
    quote:"My 15th birthday was in October. It is now December and I need a cavity filled. Does Nova Scotia's Children's Oral Health Program still cover it?",
    q:"When exactly does MSI basic children's dental coverage end in Nova Scotia?",
    opts:[
      "At the end of the month you turn 15 (so October 31), meaning December's filling is no longer covered by MSI",
      "On your 18th birthday",
      "At the end of Grade 12",
      "MSI covers basic dental for life in Nova Scotia"
    ],
    ans:0, pearl:"In Nova Scotia, MSI's Children's Oral Health Program covers basic dental until the end of the month a youth turns 15. After that, families use private benefits, the Canadian Dental Care Plan (if eligible), or out-of-pocket pay." },

  { id:"nav54", dept:"nav", tier:4, patient:"Emergency Bystander Desk", complaint:"Naloxone kit basics",
    vitals:"Unresponsive person, pinpoint pupils, blue lips, slow breathing",
    quote:"If you think someone might be having an opioid overdose, could giving them naloxone hurt them if it turns out NOT to be opioids?",
    q:"What is the safety rule for naloxone (Narcan)?",
    opts:[
      "Naloxone temporarily reverses opioid overdoses and is harmless if opioids are not present; always call 911 too because naloxone wears off in 30 to 90 minutes",
      "Naloxone is dangerous if given to someone who only drank alcohol",
      "Once naloxone wakes someone up, you do not need to call 911",
      "Naloxone requires a doctor's prescription to carry in Nova Scotia"
    ],
    ans:0, pearl:"Free take-home naloxone kits are available at NS pharmacies. Naloxone cannot harm someone who didn't take opioids, and 911 is still essential because opioids can outlast naloxone." },

  { id:"nav55", dept:"nav", tier:4, patient:"Advocacy Clinic", complaint:"Assertive vs. passive vs. aggressive boundaries",
    vitals:"Friend keeps pressuring you to skip class and vape",
    quote:"Which response is an example of clear, assertive communication (neither passive nor aggressive)?",
    q:"Pick the assertive boundary statement:",
    opts:[
      "'No thanks, I'm heading to class - catch you at lunch.' (calm, direct, no apology or insult)",
      "'Uh, maybe later I guess, if you really want me to...' (passive)",
      "'You're an idiot for even asking me that, get lost!' (aggressive)",
      "Say nothing, stare at the floor, and walk into the washroom with them"
    ],
    ans:0, pearl:"Assertive boundaries are short, calm, and firm: you protect your own values without escalating conflict or giving in to pressure." }
);
