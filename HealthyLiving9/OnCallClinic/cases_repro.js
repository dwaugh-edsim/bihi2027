/* ============================================================================
   ON-CALL: ROOM 8 CLINIC - Sexual & Reproductive Health Case Bank (40 Cases)
   Exam-room clinical scenarios grounded in Grade 9 Nova Scotia Health curriculum.
   Tiers: 1 (Intern), 2 (Resident), 3 (Attending), 4 (Chief of Medicine)
   Zero em/en dashes. Respectful, factual, Grade 9 Nova Scotia curriculum.
   ============================================================================ */
window.ONCALL_CASES = window.ONCALL_CASES || [];
window.ONCALL_CASES.push(
  /* ---------------- TIER 1: INTERN (10 cases) ---------------- */
  { id:"rep01", dept:"repro", tier:1, patient:"Alex, 15", complaint:"Routine STI check-in",
    vitals:"Walk-in youth clinic | No physical symptoms",
    quote:"My new partner feels totally fine and has no rash or irritation. Is it reasonable to skip an STI test?",
    q:"What is the accurate clinical advice?",
    opts:[
      "No: many common STIs show no visible symptoms, so testing is the only reliable check.",
      "Yes: most STIs produce a visible rash or soreness within a few days of exposure.",
      "No: bacterial STIs are always visible, while only viral STIs stay hidden without symptoms.",
      "Yes: a person can only pass an STI to a partner while active symptoms are present."
    ],
    ans:0, pearl:"Many STIs (especially chlamydia and gonorrhea) are completely asymptomatic. Relying on looking or feeling healthy misses most infections; confidential testing is the only reliable check." },
  { id:"rep02", dept:"repro", tier:1, patient:"Jordan, 14", complaint:"Public washroom exposure worry",
    vitals:"School health centre | Anxious, afebrile",
    quote:"I sat on a damp toilet seat at a busy rink washroom. Should I get tested for chlamydia or herpes?",
    q:"What do you tell Jordan?",
    opts:[
      "No: STI germs survive poorly on hard surfaces and spread through intimate sexual contact.",
      "Yes: bacterial STIs can survive for hours on plastic seats and enter through dry skin.",
      "Yes: public washrooms are a common source of chlamydia when seats are not disinfected.",
      "No: toilet seats only transmit viral STIs like herpes, never bacterial infections."
    ],
    ans:0, pearl:"STIs spread through sexual fluid exchange or intimate skin-to-skin contact, not toilet seats. Pathogens cannot survive long on cold, dry plastic." },
  { id:"rep03", dept:"repro", tier:1, patient:"Taylor, 15", complaint:"Contraception follow-up",
    vitals:"3 months on daily combined pill | BP normal",
    quote:"I take my birth control pill at 8 p.m. sharp every night. Can my partner and I stop using condoms now?",
    q:"What is the right clinical answer?",
    opts:[
      "No: hormonal birth control prevents pregnancy only, so condoms are still needed for STIs.",
      "Yes: daily hormones thicken cervical mucus enough to block both pregnancy and common STIs.",
      "No: the pill reduces bacterial STI risk significantly, but it does not block viral STIs.",
      "Yes: taking the pill at the exact same time daily provides reliable protection against both."
    ],
    ans:0, pearl:"Hormonal methods (pill, patch, ring, IUD, implant) prevent pregnancy only. External or internal condoms are the barrier that reduces STI transmission." },
  { id:"rep04", dept:"repro", tier:1, patient:"Sam, 15", complaint:"Barrier protection consult",
    vitals:"Youth Health Centre | Requesting supplies",
    quote:"Can I grab extra condoms? After a recent scare, I plan to wear two at once for double protection.",
    q:"What is the clinical guidance?",
    opts:[
      "Avoid doubling: friction between two condoms increases tearing, so use one condom properly.",
      "Doubling helps: layering two latex condoms cuts breakage risk in half during longer activity.",
      "Doubling works safely as long as both condoms are lubricated and within their expiry dates.",
      "Skip two external condoms, but layering an external and an internal condom together is safer."
    ],
    ans:0, pearl:"Never layer two condoms (two external condoms or an external plus internal condom together). Latex-on-latex friction increases breakage; one properly fitted condom is safer." },
  { id:"rep05", dept:"repro", tier:1, patient:"Casey, 15", complaint:"Relationship boundaries check-in",
    vitals:"School wellness drop-in | Seeking advice",
    quote:"During a hookup, one person froze up and stayed completely quiet without saying stop. Does silence count as consent?",
    q:"What is the clear legal and health standard in Canada?",
    opts:[
      "No: consent must be active and ongoing, so freezing or staying silent is never consent.",
      "Yes: silence counts as implied consent unless the person verbally says stop or pulls away.",
      "Yes: staying quiet counts as consent if the partner agreed to the same activity earlier.",
      "No: silence is unclear, so checking in is only required when partners are not dating."
    ],
    ans:0, pearl:"Freezing is a common human stress response. Under Canadian law and healthy-relationship standards, consent must be active, voluntary, and ongoing; absence of 'no' is never 'yes.'" },
  { id:"rep06", dept:"repro", tier:1, patient:"Morgan, 14", complaint:"STI risk assessment",
    vitals:"Youth clinic intake | General questions",
    quote:"My partner and I stick to oral sex to stay safe from STIs. Do we still need to think about STI risk?",
    q:"What is the accurate clinical answer?",
    opts:[
      "Yes: STIs such as herpes, gonorrhea, chlamydia, syphilis, and HPV can spread via oral sex.",
      "No: digestive enzymes in saliva neutralize STI pathogens before they can cause an infection.",
      "Yes: oral sex only transmits herpes cold sores, while bacterial STIs require intercourse.",
      "No: oral transmission only occurs if one partner has an open cut or bleeding gums."
    ],
    ans:0, pearl:"Oral sex carries real STI risk for both viral and bacterial infections. Barriers like condoms or dental dams reduce fluid and skin-to-skin exposure." },
  { id:"rep07", dept:"repro", tier:1, patient:"Riley, 15", complaint:"Confidentiality inquiry",
    vitals:"Halifax Youth Health Centre | Arrived alone",
    quote:"I walked in after school without telling my parents. Do you legally have to call them before testing me?",
    q:"What is the Nova Scotia healthcare rule?",
    opts:[
      "No: youth in Nova Scotia can access confidential STI testing without parental permission.",
      "Yes: patients under 16 must bring a parent or guardian to sign clinic consent forms.",
      "No: testing is private, but clinics must still notify parents if a result comes back positive.",
      "Yes: confidential youth testing is only available after turning 16 with a health card."
    ],
    ans:0, pearl:"In Nova Scotia, a mature minor who understands the care can access confidential STI testing, treatment, and contraception at Youth Health Centres, clinics, or doctors without parental permission." },
  { id:"rep08", dept:"repro", tier:1, patient:"Drew, 15", complaint:"Immunization record review",
    vitals:"Grade 9 vaccine catch-up clinic",
    quote:"My school vaccine form lists HPV and Hepatitis B shots. Are there really vaccines that protect against STIs?",
    q:"What is the accurate clinical answer?",
    opts:[
      "Yes: safe, effective vaccines protect against HPV and Hepatitis B and are offered in schools.",
      "No: vaccines only target airborne infections, so no vaccines exist for sexually transmitted germs.",
      "Yes: routine teen vaccines protect against chlamydia, gonorrhea, and herpes in a single shot.",
      "No: STI pathogens mutate too quickly for standard childhood or school vaccines to provide protection."
    ],
    ans:0, pearl:"HPV and Hepatitis B vaccines protect against two major viral STIs and their long-term cancer and liver risks, and both are offered free in Nova Scotia school immunization programs." },
  { id:"rep09", dept:"repro", tier:1, patient:"Jamie, 15", complaint:"Contraception options consult",
    vitals:"Walk-in clinic | Currently using no barrier",
    quote:"My partner and I rely on pulling out before ejaculation. How dependable is that for preventing pregnancy?",
    q:"What is the accurate clinical assessment?",
    opts:[
      "Unreliable: pre-ejaculate can carry sperm and timing fails often, causing high pregnancy rates.",
      "Very reliable: pulling out prevents sperm entry and matches condom effectiveness over a year.",
      "Reliable for pregnancy prevention, though clinics discourage it solely because of STI risk.",
      "Dependable for most teens as long as the partner urinates immediately before sexual activity."
    ],
    ans:0, pearl:"Withdrawal has a high typical-use failure rate (about 1 in 5 couples per year) because pre-ejaculate can contain sperm and timing is hard to control, plus it offers zero STI protection." },
  { id:"rep10", dept:"repro", tier:1, patient:"Quinn, 15", complaint:"Positive lab result follow-up",
    vitals:"Urine screen positive for chlamydia",
    quote:"I just got the call that my chlamydia test was positive. Am I stuck with this infection for life?",
    q:"What is the right clinical reassurance?",
    opts:[
      "No: chlamydia, gonorrhea, and syphilis are bacterial STIs curable with prescribed antibiotics.",
      "Yes: once contracted, all STIs remain dormant in the body and can only be managed long-term.",
      "No: chlamydia is curable with antibiotics, while gonorrhea is a viral infection managed for life.",
      "Yes: antibiotics relieve the symptoms of bacterial STIs, but they cannot fully clear the infection."
    ],
    ans:0, pearl:"Bacterial STIs (chlamydia, gonorrhea, syphilis) are curable with prescribed antibiotics; viral STIs (herpes, HIV, HPV) are manageable with treatment and vaccines where available." },

  /* ---------------- TIER 2: RESIDENT (10 cases) ---------------- */
  { id:"rep11", dept:"repro", tier:2, patient:"Avery, 15", complaint:"Menstrual cycle question",
    vitals:"Youth clinic drop-in | Day 3 of period",
    quote:"We had unprotected sex on Day 3 of my period. Is pregnancy completely off the table during bleeding?",
    q:"What is the accurate medical answer?",
    opts:[
      "No: sperm survive up to 5 days, so short cycles or early ovulation can cause pregnancy.",
      "Yes: menstrual bleeding flushes out the uterine lining and prevents sperm from reaching an egg.",
      "Yes: ovulation always occurs exactly two weeks after bleeding stops, making periods completely safe.",
      "No: pregnancy during a period is only possible if the bleeding lasts longer than ten days."
    ],
    ans:0, pearl:"Pregnancy during a period is less likely, not impossible, because sperm live up to 5 days inside the body and ovulation timing varies, especially in teens." },
  { id:"rep12", dept:"repro", tier:2, patient:"Skylar, 15", complaint:"Barrier reliability question",
    vitals:"Routine sexual health consult",
    quote:"The condom box says 98% effective, yet the clinic chart lists real-life protection much lower. Why the gap?",
    q:"What explains the difference in those numbers?",
    opts:[
      "98% reflects perfect use; typical real-world use is around 85-87% due to slips or missed use.",
      "98% reflects typical real-world use; perfect laboratory use is closer to 99.9% per year.",
      "98% measures protection per single act of sex rather than over a full year of use.",
      "98% only applies to thicker extra-strength condoms, while standard brands average around 70%."
    ],
    ans:0, pearl:"Perfect use (98%) vs. typical use (~85-87%) over a year is why checking expiry dates, leaving space at the tip, and using a condom from start to finish every time matters." },
  { id:"rep13", dept:"repro", tier:2, patient:"Devon, 16", complaint:"New relationship screening",
    vitals:"Walk-in clinic | Exclusive for 2 months",
    quote:"My partner and I agreed to be exclusive two months ago and neither of us feels sick. Should we still test?",
    q:"What is the accurate clinical advice?",
    opts:[
      "Testing still matters because either partner could carry a silent STI from before this relationship.",
      "Testing is unnecessary once a couple becomes exclusive and neither partner has any physical symptoms.",
      "Testing is only recommended for exclusive couples if one partner had more than three past partners.",
      "Testing can wait a year because most bacterial STIs clear naturally in a monogamous relationship."
    ],
    ans:0, pearl:"Because STIs can sit silent for months or years, getting tested at the start of an exclusive relationship gives both partners a true baseline and protects both of them." },
  { id:"rep14", dept:"repro", tier:2, patient:"Kendra, 15", complaint:"HIV treatment question",
    vitals:"Youth clinic Q&A | Family health concern",
    quote:"My older cousin was just diagnosed with HIV. Does an HIV diagnosis still usually lead to fatal AIDS today?",
    q:"What is the current medical reality?",
    opts:[
      "No: daily antiretroviral therapy lets people with HIV live long lives and become untransmittable.",
      "Yes: current medications slow the virus for a few years, but most cases still progress.",
      "No: modern multi-week antibiotic courses now cure HIV completely when started within the first year.",
      "Yes: HIV remains fatal for most patients unless they qualify for an experimental bone marrow transplant."
    ],
    ans:0, pearl:"With modern daily antiretroviral therapy (ART), viral load can become undetectable, meaning the person stays healthy, lives a normal lifespan, and cannot pass HIV sexually (U=U: Undetectable = Untransmittable)." },
  { id:"rep15", dept:"repro", tier:2, patient:"Owen, 15", complaint:"Party incident debrief",
    vitals:"School wellness room | Seeking clarity",
    quote:"At a party, someone was slurring words and stumbling. If they nod along while heavily drunk, is that valid consent?",
    q:"What is the Canadian legal and health standard?",
    opts:[
      "No: an incapacitated person cannot legally consent, so proceeding with sexual activity is sexual assault.",
      "Yes: a drunk person can still legally consent as long as they remain awake and responsive.",
      "Yes: consent remains valid if both people consumed roughly the same amount of alcohol together.",
      "No: alcohol invalidates consent only when the person later has no memory of the evening."
    ],
    ans:0, pearl:"Intoxication that impairs judgment or awareness removes the legal capacity to consent. Clear, sober, voluntary, and enthusiastic consent is required." },
  { id:"rep16", dept:"repro", tier:2, patient:"Maya, 15", complaint:"Urgent pharmacy consult",
    vitals:"Condom broke ~24 hours ago | Walk-in",
    quote:"A condom broke last night about 24 hours ago. Did I already miss the window for emergency contraception?",
    q:"What is the accurate guidance?",
    opts:[
      "No: emergency pills work up to 3-5 days after sex, and a copper IUD works up to 7 days.",
      "Yes: emergency contraception must be taken within 12 hours of unprotected sex to remain effective.",
      "No: the pill remains equally effective on Day 5 as on Day 1, so waiting does not matter.",
      "Yes: after 24 hours, a clinic prescription for an abortion pill is the only remaining option."
    ],
    ans:0, pearl:"Sooner is always better: levonorgestrel (Plan B) works best ASAP up to 72 hours (some effect to 5 days), ulipristal (ella) up to 5 days, and a copper IUD up to 7 days." },
  { id:"rep17", dept:"repro", tier:2, patient:"Lucas, 15", complaint:"Post-exposure lab review",
    vitals:"Negative STI panel taken 3 days post-exposure",
    quote:"I got tested three days after a condom broke and everything came back negative. Am I completely in the clear?",
    q:"What should the clinician explain about test timing?",
    opts:[
      "Not yet: many STIs take 1 to 3 weeks or longer to show up, so re-testing is needed.",
      "Yes: modern urine and blood assays detect every common bacterial and viral STI within 48 hours.",
      "Not yet: bacterial STIs are fully ruled out at 3 days, so only HIV needs a repeat test.",
      "Yes: a negative lab test at 3 days is final unless you develop noticeable symptoms later."
    ],
    ans:0, pearl:"Testing too early can produce a false negative because the germ or antibodies have not reached detectable levels yet. Follow clinic guidance on re-testing after the window period." },
  { id:"rep18", dept:"repro", tier:2, patient:"Chloe, 15", complaint:"Personal safety discussion",
    vitals:"Youth wellness consult | Community safety",
    quote:"I only really worry about sexual assault when walking past strangers at night. Does that match who commits most assaults?",
    q:"What does Canadian data show?",
    opts:[
      "No: the vast majority of sexual assaults are committed by someone the victim already knows.",
      "Yes: roughly three-quarters of reported assaults in Canada involve strangers in public outdoor areas.",
      "No: incidents are split almost evenly between complete strangers and people the victim knows well.",
      "Yes: acquaintance assaults are rare among youth and mostly occur in adult workplace settings."
    ],
    ans:0, pearl:"Canadian data consistently shows most sexual assaults are committed by a partner, friend, or acquaintance. That shifts focus toward boundaries, consent, red flags, and bystander support." },
  { id:"rep19", dept:"repro", tier:2, patient:"Noah, 15", complaint:"Chlamydia treatment counseling",
    vitals:"Prescribed 7-day oral antibiotic course",
    quote:"I just picked up my chlamydia antibiotics. Can I skip the awkward talk with my partner since I'm taking my pills?",
    q:"What should you advise Noah about his partner?",
    opts:[
      "No: an untreated partner can suffer silent complications and immediately re-infect you after treatment.",
      "Yes: completing your full antibiotic course builds immunity that protects you from being re-infected.",
      "Only tell them if they develop burning or discharge, since asymptomatic partners cannot pass it back.",
      "Yes: waiting 7 days after finishing your antibiotics prevents transmission even without partner treatment."
    ],
    ans:0, pearl:"Untreated partners cause ping-pong reinfection and risk Pelvic Inflammatory Disease (PID) or fertility damage. Both partners need treatment plus a 7-day pause from sexual contact." },
  { id:"rep20", dept:"repro", tier:2, patient:"Priya, 15", complaint:"Starting contraception consult",
    vitals:"Healthy weight | Considering pill vs. IUD",
    quote:"I want to start birth control, but my friends warned me that every method automatically causes major weight gain.",
    q:"What does clinical research show?",
    opts:[
      "Pills and IUDs show little proven weight gain, though the Depo shot is linked for some.",
      "Every hormonal contraceptive slows metabolism and causes at least 10 to 15 pounds of gain.",
      "Clinical trials confirm that no form of hormonal contraception has any effect on body weight.",
      "Combined estrogen pills cause permanent weight gain, whereas injections and implants never do."
    ],
    ans:0, pearl:"Evidence separates generalizations from specifics: most modern pills and IUDs are not linked to significant weight gain, while the Depo-Provera injection is associated with weight gain in some users." },

  /* ---------------- TIER 3: ATTENDING (10 cases) ---------------- */
  { id:"rep21", dept:"repro", tier:3, patient:"Sienna, 15", complaint:"Emergency contraception consult",
    vitals:"Community pharmacy counter | Seeking facts",
    quote:"I'm thinking about taking Plan B after a condom slip, but I heard it works the same way as an abortion pill.",
    q:"What is the exact medical mechanism?",
    opts:[
      "No: it delays or prevents ovulation before fertilization and cannot end an existing pregnancy.",
      "Yes: both medications contain the same hormone blend that terminates an early implanted pregnancy.",
      "No: it works by blocking implantation after fertilization, which makes it effective for three weeks.",
      "Yes: emergency contraception acts as a lower-dose abortion pill only when taken after Day 3."
    ],
    ans:0, pearl:"Emergency contraception prevents pregnancy before it starts, mainly by delaying ovulation. It does not end or harm an already established pregnancy." },
  { id:"rep22", dept:"repro", tier:3, patient:"Eli, 16", complaint:"Condom breakage follow-up",
    vitals:"Reports 2 torn condoms this month",
    quote:"Two condoms tore on me this month. I keep spares in my back-pocket wallet and use baby oil as lube. What's going wrong?",
    q:"What is the clinical assessment of Eli's setup?",
    opts:[
      "Both fail: wallet heat degrades latex and oil-based lube weakens it; use water or silicone lube.",
      "Wallet storage is fine if unopened, but oil-based baby oil breaks down latex within minutes.",
      "Baby oil is safe with modern latex, but body heat in a back-pocket wallet ruins the seal.",
      "Both are safe short-term as long as the condom is within its printed expiry date."
    ],
    ans:0, pearl:"Heat and friction weaken latex in wallets, and oil-based lubricants (baby oil, Vaseline, lotion) dissolve latex within minutes. Store cool and flat, and pair latex with water- or silicone-based lube." },
  { id:"rep23", dept:"repro", tier:3, patient:"Hannah, 15", complaint:"Asymptomatic screening consult",
    vitals:"No pain, no discharge | Routine visit",
    quote:"If someone has chlamydia with zero symptoms and feels totally normal, why do clinics push so hard to treat it?",
    q:"What is the serious long-term risk of silent bacterial STIs?",
    opts:[
      "Untreated infection can spread upward, causing Pelvic Inflammatory Disease, chronic pain, or infertility.",
      "Silent chlamydia stays harmlessly localized until the immune system clears it within six months.",
      "Untreated chlamydia only causes complications if the person develops a high fever or visible sores.",
      "Silent bacterial infections gradually mutate into viral herpes if antibiotics are delayed past a year."
    ],
    ans:0, pearl:"Silent infections still cause inflammation and scarring in the reproductive tract. A quick, painless urine test and simple antibiotics prevent lifelong harm like PID or infertility." },
  { id:"rep24", dept:"repro", tier:3, patient:"Ethan, 16", complaint:"STI treatment comparison",
    vitals:"Clinic education review | Lab counseling",
    quote:"I'm sorting out which STIs antibiotics can cure. Which pair on this clinic chart are BOTH viral infections?",
    q:"Pick the accurate viral pair:",
    opts:[
      "Herpes simplex virus (HSV) and HPV",
      "Chlamydia and hepatitis B virus (HBV)",
      "Syphilis and herpes simplex virus (HSV)",
      "Gonorrhea and chlamydia trachomatis"
    ],
    ans:0, pearl:"Chlamydia, gonorrhea, and syphilis are bacterial (curable with antibiotics). HSV, HPV, HIV, and Hepatitis B are viral (managed with antivirals or prevented by vaccines)." },
  { id:"rep25", dept:"repro", tier:3, patient:"Zoe, 15", complaint:"Boundary communication consult",
    vitals:"School health drop-in | Peer question",
    quote:"If a partner enthusiastically says yes at the start, then feels uncomfortable five minutes in, what is the rule?",
    q:"What is the clear standard on ongoing consent?",
    opts:[
      "Consent can be withdrawn at any moment, and the other person must stop immediately.",
      "Once verbal consent is clearly given at the start, it legally covers that entire encounter.",
      "Consent can be withdrawn, but only if the person explains their reason clearly out loud.",
      "Changing your mind mid-way only applies legally if the partner becomes physically aggressive."
    ],
    ans:0, pearl:"Consent is ongoing and revocable at any second. Stopping immediately when a partner pauses, hesitates, or says stop is non-negotiable." },
  { id:"rep26", dept:"repro", tier:3, patient:"Mina, 15", complaint:"Contraception comparison",
    vitals:"Comparing daily pill vs. IUD or implant",
    quote:"Your wall chart shows IUDs and arm implants over 99% effective in typical use while the daily pill is ~91%. Why?",
    q:"What explains that difference?",
    opts:[
      "They remove daily remembering errors, so real-world typical use closely matches perfect use.",
      "They deliver ten times more synthetic estrogen than oral pills to stop ovulation permanently.",
      "They physically seal the cervix completely, blocking both sperm and bacterial STIs at once.",
      "They remain unaffected by body weight, whereas oral pills lose most effectiveness after three months."
    ],
    ans:0, pearl:"Long-Acting Reversible Contraceptives (LARCs) work for 3 to 10 years and eliminate missed-pill human error, though condoms are still needed for STI protection." },
  { id:"rep27", dept:"repro", tier:3, patient:"Ben, 16", complaint:"Condom protection limits",
    vitals:"STI counseling | Consistent condom user",
    quote:"I use a condom from start to finish every single time. Does that bring my risk of herpes or HPV down to 0%?",
    q:"What is the accurate clinical answer?",
    opts:[
      "No: condoms greatly reduce risk, but HSV and HPV can spread via uncovered skin-to-skin contact.",
      "Yes: perfect latex condom use blocks 100% of fluid and skin contact for every STI.",
      "No: condoms only reduce bacterial STI risk and provide almost no protection against viral STIs.",
      "Yes: risk drops to zero as long as neither partner has visible blisters or warts present."
    ],
    ans:0, pearl:"Condoms provide major protection, and combining them with HPV vaccination, regular testing, and honest communication lowers risk even further." },
  { id:"rep28", dept:"repro", tier:3, patient:"Tessa, 15", complaint:"First STI screening anxiety",
    vitals:"Youth Health Centre | Nervous in waiting room",
    quote:"I've put off getting checked for chlamydia and gonorrhea because I heard the test is a painful clinic procedure.",
    q:"How do you reassure Tessa accurately?",
    opts:[
      "Routine screening is usually just a quick, painless urine sample or a simple self-swab.",
      "Routine screening requires a brief pelvic exam under local numbing at a hospital outpatient clinic.",
      "Routine screening requires drawing several blood tubes and waiting two weeks for lab results.",
      "Routine screening uses a clinic swab that only a physician can collect, though it is brief."
    ],
    ans:0, pearl:"Fear of the test stops many teens from going; in reality, most routine chlamydia and gonorrhea checks are a fast, painless urine cup or private self-swab." },
  { id:"rep29", dept:"repro", tier:3, patient:"Omar, 15", complaint:"Gonorrhea treatment update",
    vitals:"Clinic treatment room | Positive swab",
    quote:"Why am I getting a specific nurse-given antibiotic injection for gonorrhea instead of the older oral pills?",
    q:"What is the medical reason for this change?",
    opts:[
      "Gonorrhea bacteria evolved resistance to older oral antibiotics, so updated targeted therapy is required.",
      "Gonorrhea shifted from a bacterial to a viral strain that no longer responds to oral pills.",
      "Oral antibiotics still cure gonorrhea equally well, but injections simply clear symptoms a day faster.",
      "Older oral pills were recalled due to allergic reactions, not because of antibiotic resistance."
    ],
    ans:0, pearl:"Antimicrobial resistance hits sexual health too: drug-resistant gonorrhea is a real global concern requiring exact, up-to-date antibiotic treatment." },
  { id:"rep30", dept:"repro", tier:3, patient:"Grace, 15", complaint:"Legal age of consent inquiry",
    vitals:"Youth clinic Q&A | Canadian law",
    quote:"I know Canada's general age of consent is 16. How does the close-in-age rule work for 14- and 15-year-olds?",
    q:"What is the accurate Canadian legal standard?",
    opts:[
      "They can consent with a peer less than 5 years older, with no trust or authority role.",
      "They can consent with a peer up to 2 years older, regardless of coaching or work roles.",
      "They can consent with any partner under age 21 as long as parents know about the relationship.",
      "They cannot legally consent with anyone under Canadian law until turning 16, even another 15-year-old."
    ],
    ans:0, pearl:"Canadian close-in-age rules protect peer relationships (less than 5 years older for 14- and 15-year-olds) while strictly forbidding exploitation or anyone in a position of trust or authority (coach, teacher, boss)." },

  /* ---------------- TIER 4: CHIEF OF MEDICINE (10 cases) ---------------- */
  { id:"rep31", dept:"repro", tier:4, patient:"Nadia, 16", complaint:"Missed birth control pills",
    vitals:"Week 1 of combined pill pack | 2 missed doses",
    quote:"I forgot my Saturday and Sunday pills in Week 1 and had unprotected sex last night. What should I do right now?",
    q:"What is the safest clinical action?",
    opts:[
      "Take the latest missed pill now, use backup condoms for 7 days, and consider emergency contraception.",
      "Take both missed pills plus today's pill together tonight, then continue the pack without backup.",
      "Discard the current pack, wait for withdrawal bleeding to finish, and start a fresh pack.",
      "Resume the schedule with today's pill only, since missing two pills rarely changes ovulation risk."
    ],
    ans:0, pearl:"Missing 2 or more combined pills (especially in Week 1) raises ovulation risk: take the most recent missed pill ASAP, use 7 days of backup barriers, and check emergency contraception options for recent unprotected sex." },
  { id:"rep32", dept:"repro", tier:4, patient:"Caleb, 16", complaint:"Emergency contraception selection",
    vitals:"Community pharmacy | Asking for partner (~82 kg)",
    quote:"My partner weighs about 82 kg and needs emergency contraception after a broken condom. Is standard Plan B still best?",
    q:"What is the accurate pharmacy guidance?",
    opts:[
      "No: efficacy drops above ~75 kg; ulipristal or a copper IUD stays much more effective.",
      "Yes: over-the-counter levonorgestrel maintains the same clinical effectiveness across all body weights.",
      "No: above 75 kg, patients should simply take a double dose of standard Plan B immediately.",
      "Yes: body weight only affects prescription copper IUD placement, not oral emergency contraception pills."
    ],
    ans:0, pearl:"Levonorgestrel (Plan B) loses effectiveness above roughly 75 kg (165 lb). Asking a pharmacist or clinic for ulipristal (ella) or a copper IUD provides much stronger protection." },
  { id:"rep33", dept:"repro", tier:4, patient:"Layla, 15", complaint:"Contraception access without a doctor",
    vitals:"Halifax walk-in inquiry | No family physician",
    quote:"I've been on the family doctor waitlist for a year. Can a Nova Scotia pharmacist prescribe birth control directly?",
    q:"What is the current Nova Scotia healthcare reality?",
    opts:[
      "Yes: Nova Scotia pharmacists can assess patients and prescribe hormonal contraception directly.",
      "No: pharmacists can only renew an existing birth control prescription originally written by a doctor.",
      "Yes: pharmacists can prescribe contraception, but only for patients aged 18 or older with insurance.",
      "No: patients without a family doctor must visit a hospital emergency room for birth control."
    ],
    ans:0, pearl:"Nova Scotia expanded pharmacist prescribing so people without a family doctor can get timely assessment and prescriptions for hormonal contraception, emergency contraception, and common health needs." },
  { id:"rep34", dept:"repro", tier:4, boss:true, patient:"Marcus, 16", complaint:"HIV prevention medications",
    vitals:"Sexual health clinic | Reading lobby poster",
    quote:"I saw both 'PrEP' and 'PEP' on the clinic wall poster. How do those two HIV prevention medications differ?",
    q:"Match the two HIV prevention medications accurately:",
    opts:[
      "PrEP is taken before exposure to prevent HIV; PEP starts within 72 hours after exposure.",
      "PEP is taken daily before exposure to prevent HIV; PrEP starts within 72 hours after.",
      "PrEP is a two-dose HIV vaccine series; PEP is a single antibiotic pill after exposure.",
      "PrEP treats active HIV infection long-term; PEP is only used when HIV progresses to AIDS."
    ],
    ans:0, pearl:"Pre-Exposure Prophylaxis (PrEP) prevents HIV infection ahead of time; Post-Exposure Prophylaxis (PEP) is a 28-day emergency medication course started within 72 hours after a possible exposure." },
  { id:"rep35", dept:"repro", tier:4, patient:"Dylan, 15", complaint:"Urgent online extortion report",
    vitals:"School wellness office | Distressed",
    quote:"I sent a private photo and now the account wants gift cards tonight or they'll message my school. Should I pay?",
    q:"What is the urgent, evidence-based safety protocol?",
    opts:[
      "Never pay: stop replying, screenshot evidence, block the account, tell a trusted adult, use NeedHelpNow.ca.",
      "Pay a small amount once while requesting deletion, then deactivate all your social media accounts.",
      "Delete the chat thread and factory-reset your phone immediately so the image cannot be traced.",
      "Keep messaging the account politely to buy time while you try to figure out their identity."
    ],
    ans:0, pearl:"Paying sextortionists almost never stops them; they demand more. Stop replying, preserve screenshots as evidence, block, tell a trusted adult, and use NeedHelpNow.ca / Cybertip.ca for image removal support." },
  { id:"rep36", dept:"repro", tier:4, patient:"Claire, 15", complaint:"Active lip cold sore consult",
    vitals:"Tingling blister on lower lip (HSV-1)",
    quote:"I have a normal lip cold sore today. Since it's just on my mouth, is oral sex still completely safe tonight?",
    q:"What is the accurate clinical call?",
    opts:[
      "No: oral HSV-1 can transmit to a partner's genitals during oral sex; avoid contact until healed.",
      "Yes: HSV-1 only infects mouth and lip tissue, while genital herpes is strictly caused by HSV-2.",
      "No: lip cold sores only spread to genitals if the blister is actively bleeding during contact.",
      "Yes: applying antiviral lip cream right before oral sex blocks transmission of HSV-1 completely."
    ],
    ans:0, pearl:"HSV-1 (oral cold sores) is very common and manageable, but it can easily cause genital herpes via oral sex, especially during active tingling or blisters. Avoid kissing and oral sex until fully healed." },
  { id:"rep37", dept:"repro", tier:4, patient:"Liam, 16", complaint:"Home pregnancy test timing",
    vitals:"Partner had negative urine test 48h post-exposure",
    quote:"My partner took a home pregnancy test two days after a broken condom and it was negative. Can we stop worrying?",
    q:"Why is a Day-2 pregnancy test unreliable?",
    opts:[
      "Pregnancy hormone hCG is not detectable until roughly 2-3 weeks after sex; re-test at 21 days.",
      "Home urine tests miss early hCG at 48 hours, so a clinic blood test is final on Day 2.",
      "Fertilization takes 48 hours, meaning a urine test becomes 99% accurate by Day 4 after sex.",
      "Negative results at 48 hours are only unreliable if the test was taken later in the afternoon."
    ],
    ans:0, pearl:"Implantation and hCG hormone buildup take time. For a reliable result, test on the first day of a missed period or 21 days after the unprotected sex." },
  { id:"rep38", dept:"repro", tier:4, patient:"Sofia, 15", complaint:"Contraception planning visit",
    vitals:"Youth Health Centre | Starting new method",
    quote:"The nurse recommended a 'dual protection' plan before I leave today. What does that strategy actually involve?",
    q:"Define dual protection accurately:",
    opts:[
      "Pairing a highly effective pregnancy method like an IUD or pill with a condom for STIs.",
      "Using two barrier methods together, such as an external condom combined with spermicidal gel.",
      "Combining daily birth control pills with emergency contraception kept on hand after each encounter.",
      "Switching between condoms and withdrawal depending on which week of the menstrual cycle occurs."
    ],
    ans:0, pearl:"Dual protection pairs top-tier pregnancy prevention (IUD, implant, pill, patch, ring) with barrier STI protection (condoms), covering what neither method covers alone." },
  { id:"rep39", dept:"repro", tier:4, patient:"Mateo, 16", complaint:"Resolved painless genital sore",
    vitals:"Sore healed spontaneously after 3 weeks",
    quote:"I had a painless sore last month that vanished completely on its own without treatment. Does that mean it's gone?",
    q:"What is the accurate clinical assessment?",
    opts:[
      "No: primary syphilis sores heal on their own while bacteria remain active; test and treat.",
      "Yes: if a painless sore heals cleanly without antibiotics, the immune system cleared the infection.",
      "No: a vanishing painless sore is usually herpes, which cannot be treated with standard antibiotics.",
      "Yes: infectious syphilis sores are always intensely painful and persist until treated with penicillin."
    ],
    ans:0, pearl:"Syphilis rates have risen sharply across Canada. Primary syphilis chancres are painless and vanish on their own in 3 to 6 weeks while the bacteria stay in the bloodstream and progress to stage 2. Only a blood test and antibiotics clear it." },
  { id:"rep40", dept:"repro", tier:4, patient:"Amira, 15", complaint:"Clinic privacy limits",
    vitals:"Youth Health Centre | First solo visit",
    quote:"Before I share personal details, are there any exceptions where a confidential clinic visit must involve someone else?",
    q:"What is the honest, legally accurate answer?",
    opts:[
      "Routine care stays private; exceptions are immediate serious harm risk or suspected abuse of a minor.",
      "Clinic confidentiality is absolute, with zero legal exceptions even in a life-threatening safety crisis.",
      "Routine visits stay private, but nurses must inform parents whenever a minor receives a prescription.",
      "Confidentiality protects STI testing only; mental health or relationship safety concerns are always shared."
    ],
    ans:0, pearl:"Honesty builds trust: routine youth sexual health care, STI tests, and contraception stay confidential. Safety-reporting laws exist strictly to protect youth from suspected abuse or immediate risk of serious harm to self or others." }
);
