/* ============================================================================
   ON-CALL: ROOM 8 CLINIC - O3 Expansion Bank (20 new cases)
   Nova Scotia medical system focus: triage doors, walk-in reality, MSI coverage,
   pharmacists, crisis lines, travel insurance. Brand-new scenarios, same
   curriculum outcomes (HL9 O3 / Theme 03 Accessing Health Resources).
   14 multiple-choice cases + 6 interactive challenges (tiers 1-4, 1 boss).
   Zero em/en dashes. Grade 9 Nova Scotia / Dartmouth curriculum.
   ============================================================================ */
window.ONCALL_CASES = window.ONCALL_CASES || [];
window.ONCALL_CHALLENGES = window.ONCALL_CHALLENGES || [];

window.ONCALL_CASES.push(
  {
    id:"o3x01", dept:"o3", tier:1, patient:"Jada, 15",
    complaint:"Needs a clinic note for soccer tryouts tomorrow",
    vitals:"Sore throat 2 days, no fever | Dartmouth walk-in clinics",
    quote:"Tryouts are tomorrow morning and I need a note. My aunt says just walk into any Dartmouth clinic around noon and you get seen fast.",
    q:"What is the smartest walk-in clinic strategy in Dartmouth?",
    opts:[
      "Arrive well before opening (or right at opening) because Dartmouth walk-ins usually fill up right away",
      "Show up at noon because midday is always the quietest time",
      "Walk in at 4:00 PM because clinics save spots for after-school students",
      "Go to the Emergency Room instead since walk-ins never have space"
    ],
    ans:0,
    pearl:"Dartmouth walk-in clinics are overrun and typically fill up shortly after opening. Arriving early (or checking hours and line policies first) is the realistic strategy, and calling 811 first helps you pick the right door."
  },
  {
    id:"o3x02", dept:"o3", tier:1, patient:"Marcus, 14",
    complaint:"Red, goopy eye since this morning",
    vitals:"One eye red with discharge | No fever | No contact lenses",
    quote:"My eye is crusty and red. We have no family doctor and every walk-in near us is packed. Is there anywhere else I can get this looked at today?",
    q:"Where can Marcus get pink eye assessed without a doctor's appointment?",
    opts:[
      "Nowhere: only an ER doctor can assess an eye problem",
      "A Nova Scotia pharmacist can assess pink eye as a minor ailment, and the assessment is covered by MSI",
      "He must wait 2 weeks for a walk-in appointment slot to open",
      "He needs a referral to an eye specialist before anyone can look at it"
    ],
    ans:1,
    pearl:"NS pharmacists can assess and treat common minor ailments like pink eye, cold sores, and uncomplicated UTIs with no appointment. MSI covers the assessment; you only pay for the medication."
  },
  {
    id:"o3x03", dept:"o3", tier:1, patient:"Priya, 15",
    complaint:"Forgot her MSI card at home before a clinic visit",
    vitals:"Cut finger from gym class | Walking normally | Clinic desk asking for health card",
    quote:"I left my health card in my other jacket. The clinic desk is asking for it. Am I going to be turned away and not treated?",
    q:"What happens if a student forgets their MSI card?",
    opts:[
      "Clinics must refuse to treat anyone without the physical card, no exceptions",
      "You can still be seen by giving your name and date of birth, then provide the number later",
      "You must pay the full visit cost in cash before being seen without a card",
      "You have to go home and come back another day with the card"
    ],
    ans:1,
    pearl:"Urgent care is never refused over a forgotten health card. Clinics can look you up or bill later once you provide your MSI number, so lack of a card is not a reason to skip care."
  },
  {
    id:"o3x04", dept:"o3", tier:1, patient:"Tyler, 14",
    complaint:"Family missed a specialist appointment - no bus fare to the next one",
    vitals:"No medical emergency | Looking for help with transportation",
    quote:"We missed my little brother's appointment because we had no way to get across the city. Is there a phone number that helps with rides and community support stuff?",
    q:"Which Nova Scotia service fits this situation best?",
    opts:[
      "811, because nurses book free taxi rides to appointments",
      "911, because paramedics provide non-emergency medical transport",
      "211, because it connects people to community and social services like transport help",
      "311, because the city schedules personal rides for medical appointments"
    ],
    ans:2,
    pearl:"211 is Nova Scotia's community services line: it connects people to supports like transportation programs, food security, and housing help. 811 is health advice, 911 is emergencies, 311 is municipal services."
  },
  {
    id:"o3x05", dept:"o3", tier:2, patient:"Aisha, 15",
    complaint:"No family doctor - repeat prescription and a rash question",
    vitals:"Established medication | New mild rash on forearm",
    quote:"We moved to Dartmouth in July and nobody in my family has a family doctor. Where should we start looking for ongoing care?",
    q:"What is a realistic first step for a family with no doctor in Nova Scotia?",
    opts:[
      "Register with the provincial patient registry (Patient Connect NS) and use pharmacist renewals or virtual care in the meantime",
      "There is nothing to do: Nova Scotia no longer accepts new patients",
      "Visit the ER once a month until a doctor adopts the family",
      "Only families with young children can join a waiting list"
    ],
    ans:0,
    pearl:"Nova Scotians without a family doctor can join the provincial Patient Connect NS registry, and use bridges in the meantime: pharmacist renewals and minor ailment care, VirtualCareNS where offered, 811, and walk-in clinics."
  },
  {
    id:"o3x06", dept:"o3", tier:2, patient:"Grandpa Joe, 68 (family consult)",
    complaint:"Asked whether the ambulance ride after his fall was free",
    vitals:"Treated and released | Bill arriving in the mail",
    quote:"My grandson says health care in Canada is free, so why is there a bill for my ambulance trip to the hospital?",
    q:"What is accurate about ambulance costs in Nova Scotia?",
    opts:[
      "Ambulance transport is fully free for everyone in Nova Scotia",
      "Nova Scotia charges a per-trip ambulance fee, and MSI does not cover it, which is why extra insurance matters",
      "Ambulance rides are free only for people under age 19",
      "The ambulance is free only if the hospital admits you overnight"
    ],
    ans:1,
    pearl:"Nova Scotia charges a fee for an ambulance trip, and basic MSI does not cover it. Seniors' Pharmacare and some workplace benefits can offset it, which is a real-life example of why private or supplemental insurance exists."
  },
  {
    id:"o3x07", dept:"o3", tier:2, patient:"Noah, 15",
    complaint:"Wrist injury at 10:00 PM - which ER is even open?",
    vitals:"Swollen wrist, able to wait | Rural community nearby shows an ER on a poster",
    quote:"The closest ER poster says 'limited hours'. My dad wants to drive there right now, but it is late. Is that a problem?",
    q:"What should Noah's family check before driving to a rural ER at night?",
    opts:[
      "Nothing: every Nova Scotia ER is open 24/7 by law",
      "Whether the ER is actually open, because many NS emergency departments have limited or temporary hours, and yourhealthns.ca shows live status",
      "Only the distance, because hours never change",
      "Whether they packed snacks, since hours do not matter"
    ],
    ans:1,
    pearl:"Many Nova Scotia emergency departments have limited or temporary closures. Before driving, check yourhealthns.ca for live ER status and wait times, or call 811 for advice on the right open door."
  },
  {
    id:"o3x08", dept:"o3", tier:2, patient:"Bree, 14",
    complaint:"Friend in crisis at 1:00 AM - phone is almost dead",
    vitals:"Friend is texting about not wanting to be here | No trusted adult awake",
    quote:"My friend is really struggling tonight and my phone battery is at 3 percent. I know there is a crisis line but I forget the number. Help!",
    q:"Which number can Bree call or text for 24/7 suicide crisis support in Canada?",
    opts:[
      "988, the national suicide crisis line (call or text), or Kids Help Phone (text CONNECT to 686868)",
      "311, which routes crisis calls to city hall security",
      "211, which only runs on weekdays from 9 to 5",
      "811, because nurses provide mental health therapy over the phone"
    ],
    ans:0,
    pearl:"988 is Canada's 24/7 suicide crisis line (call or text). Kids Help Phone also texts 24/7 (CONNECT to 686868). If danger is immediate, call 911 and wake a trusted adult. Never handle a crisis alone."
  },
  {
    id:"o3x09", dept:"o3", tier:3, patient:"Mrs. Chen (parent of Kira, 16)",
    complaint:"New acne prescription costs 40 dollars at the pharmacy desk",
    vitals:"Prescription in hand | Family has no workplace drug plan",
    quote:"I thought prescriptions were covered in Canada. The pharmacist wants 40 dollars for my daughter's acne medication. Is that normal?",
    q:"Why is there a charge at the pharmacy counter?",
    opts:[
      "The pharmacist is billing them illegally and they should refuse to pay",
      "MSI pays doctors and hospitals, but outpatient prescriptions are paid by the family, private insurance, or drug programs like Pharmacare",
      "Prescription costs are a mistake that only happens in Dartmouth pharmacies",
      "MSI covers prescriptions but only for children under 10"
    ],
    ans:1,
    pearl:"Canada's Medicare covers doctor and hospital services, not most drugs you take home. Prescriptions are paid out of pocket, by workplace benefits, or by programs such as Nova Scotia Pharmacare for those who qualify."
  },
  {
    id:"o3x10", dept:"o3", tier:3, patient:"Devon, 15",
    complaint:"Needs braces - dental office asked about insurance",
    vitals:"Turned 15 in March | Orthodontist quote: thousands of dollars",
    quote:"My mom says my checkups were free when I was little. Why is the braces quote so huge? Does MSI help?",
    q:"What is accurate about MSI dental coverage and braces?",
    opts:[
      "MSI covers braces for all teens until age 19",
      "MSI basic dental for youth ends after the month you turn 15, and orthodontics like braces were never part of it",
      "MSI covers braces only if you have straight A grades",
      "Families never pay for braces anywhere in Canada"
    ],
    ans:1,
    pearl:"Nova Scotia's Children's Oral Health Program covers basic dental only until the end of the month a child turns 15. Braces and adult dental are private-pay or covered by workplace benefits, which is exactly why families buy supplemental insurance."
  },
  {
    id:"o3x11", dept:"o3", tier:3, patient:"Sam's dad, Mr. Peters",
    complaint:"Sore throat and ear pain - comparing two ERs online",
    vitals:"Sam: alert, drinking fluids, temp 38.2 C | Two ERs within 20 minutes",
    quote:"I keep refreshing yourhealthns.ca. One ER shows a 5-hour wait, the other shows 45 minutes. Should I pick my care by whichever line is shortest?",
    q:"What is the smart way to use live ER wait times?",
    opts:[
      "Always pick the shortest line regardless of how sick the person is",
      "Wait times are useful for non-emergency decisions (like a stable sprain at midnight), but true emergencies go to the nearest ER or 911 without delay",
      "The website is wrong because all ERs always have identical waits",
      "Wait times only update once per week so they cannot be trusted at all"
    ],
    ans:1,
    pearl:"Live ER wait lists help you choose between doors when the problem is stable and non-urgent. But if there are red-flag symptoms (trouble breathing, chest pain, stiff neck, non-fading rash, confusion), 911 or the nearest ER comes first - never shop around in an emergency."
  },
  {
    id:"o3x12", dept:"o3", tier:4, patient:"The Cormack family",
    complaint:"Planning a March break trip to Florida - insurance question",
    vitals:"Family of 4, 10-day US trip booked | No travel insurance yet",
    quote:"We are driving to Maine and flying to Orlando in March. My uncle says you do not need insurance for the USA because Nova Scotia covers you. Is he right?",
    q:"What should the Cormacks do about health coverage in the United States?",
    opts:[
      "Rely on MSI, because it pays US hospital bills automatically",
      "Buy travel medical insurance before the trip, because MSI pays almost nothing for out-of-country care and US hospital bills can reach tens of thousands of dollars",
      "Only insure the adults, because kids are treated free in US hospitals",
      "Skip insurance but carry their MSI cards as proof of Canadian coverage"
    ],
    ans:1,
    pearl:"MSI covers only a tiny portion of out-of-country costs, and a single US ER visit can cost thousands of dollars. Travel medical insurance is essential for trips outside Canada - this is a core Outcome 3 lesson about knowing what your coverage actually covers."
  },
  {
    id:"o3x13", dept:"o3", tier:4, patient:"Rashida, 15",
    complaint:"Mom wants to demand antibiotics from the walk-in doctor",
    vitals:"Runny nose, mild cough, day 3 | Temp 37.4 C | Mom insists on medicine",
    quote:"My mom is frustrated after waiting 2 hours at the walk-in. She says if the doctor will not prescribe antibiotics we wasted the whole trip. How do I explain the visit was still worthwhile?",
    q:"What is the best explanation for Rashida's mom?",
    opts:[
      "The doctor was wrong: antibiotics would cure a common cold faster",
      "Antibiotics do not treat viruses, and a proper assessment rules out anything serious, confirms home care, and prevents unnecessary resistance from the whole waiting room",
      "The family should demand a refund because no prescription was issued",
      "Walk-in visits are only worthwhile when you leave with a prescription"
    ],
    ans:1,
    pearl:"A clinical assessment is valuable even with no prescription: it rules out strep, flu, or complications, and gives a clear home-care plan. Pressuring doctors for antibiotics for viral illness drives superbug resistance - a key O3 navigation skill is understanding, not demanding."
  },
  {
    id:"o3x14", dept:"o3", tier:4, patient:"Mr. Francis, vice-principal",
    complaint:"Student disclosed food insecurity and missed medical appointments",
    vitals:"Grade 9 student | Falling asleep in class | Attendance gaps",
    quote:"A student just told me there is not always food at home and no way to get to appointments. As a school, what door do we open first?",
    q:"Which school-connected Nova Scotia resource fits this situation?",
    opts:[
      "SchoolsPlus, which wraps community supports, health navigation, and family help around students and families",
      "There are no school-based support programs in Nova Scotia",
      "The school must phone 911 for non-medical family problems",
      "The student should be told to call 811 during class time instead"
    ],
    ans:0,
    pearl:"SchoolsPlus is Nova Scotia's school-based program that connects students and families to community supports: health navigation, food security help, and mental health services. Knowing your school's support doors is real-world health navigation."
  }
);

window.ONCALL_CHALLENGES.push(
  {
    id:"o3x15", dept:"o3", tier:1, kind:"triage",
    patient:"Front Desk - Five Doors Sorting Board",
    complaint:"Match 4 walk-in situations to the right Nova Scotia door",
    vitals:"Doors: Pharmacist | 811 | 911 / ER | 211 / 988",
    quote:"Room 8's front desk just got four messages at once. Sort each one to the right door before anyone wastes hours in the wrong waiting room.",
    q:"Sort each situation to the best Nova Scotia door:",
    buckets:["Pharmacist / Walk-in","811 Phone Advice","911 / ER","211 / 988 Support"],
    rows:[
      { t:"Cold sore appeared before the weekend dance", ans:0 },
      { t:"Fever 38.4 C, no red flags, parents unsure what to do tonight", ans:1 },
      { t:"Crushing chest pain and shortness of breath", ans:2 },
      { t:"Friend texting that they feel hopeless and alone", ans:3 }
    ],
    pearl:"Pharmacists treat minor ailments, 811 gives free 24/7 nurse advice, 911/ER handles emergencies, and 211/988 handle community supports and crisis support. Matching the door to the problem is the core O3 skill."
  },
  {
    id:"o3x16", dept:"o3", tier:2, kind:"order",
    patient:"Walk-In Clinic Protocol Board",
    complaint:"Put the 4 visit steps in the smartest order",
    vitals:"Dartmouth clinic opens at 8:30 AM | Note needed for soccer",
    quote:"Jada has never been to a walk-in alone before. Click these four steps in the smartest order (1 to 4).",
    q:"Build the walk-in visit plan in order:",
    steps:[
      "Check the clinic's hours and arrive before opening, since Dartmouth walk-ins fill up fast",
      "Sign in at the desk, giving name, date of birth, and MSI number (or providing it later if the card was forgotten)",
      "Describe symptoms briefly and honestly when called in, and ask questions before leaving",
      "Get the visit note or prescription, and ask when to seek further care if things change"
    ],
    pearl:"A successful walk-in visit is a sequence: plan ahead (hours and early arrival), register properly, communicate clearly, and leave with a plan. Skipping the planning step is why people waste whole afternoons in the wrong line."
  },
  {
    id:"o3x17", dept:"o3", tier:2, kind:"rx",
    patient:"Travel Insurance Desk",
    complaint:"March break checklist for a US trip",
    vitals:"Family of 4 | 10 days in Florida | Departure in 3 weeks",
    quote:"Sign off every essential item on the family's out-of-country travel checklist (leave the 1 useless habit unchecked).",
    q:"Select ALL 3 essential items:",
    items:[
      { t:"Buy travel medical insurance for every family member before departure", ok:true },
      { t:"Pack prescription medications in original labeled containers with enough supply", ok:true },
      { t:"Save 811, travel insurer numbers, and proof-of-coverage documents in the phone", ok:true },
      { t:"Rely on the MSI card alone because it pays US hospital bills in full", ok:false }
    ],
    pearl:"Travel insurance, documented medications, and insurer contact info are the essentials. An MSI card pays almost nothing for US care - carrying it as your only plan can leave a family with a five-figure hospital bill."
  },
  {
    id:"o3x18", dept:"o3", tier:2, kind:"slider",
    patient:"Dental Coverage Dial",
    complaint:"Set the age when MSI youth dental coverage ends",
    vitals:"Children's Oral Health Program review",
    quote:"My little brother gets free dental checkups. Set the dial to the age when Nova Scotia's basic youth dental coverage STOPS (the end of the month he turns this age).",
    q:"Set the dial to the last covered age:",
    min:10, max:20, step:1, unit:"years old", target:15, tol:0,
    pearl:"Nova Scotia's Children's Oral Health Program covers basic dental only until the end of the month a child turns 15. After that, cleanings, fillings, and braces move to private insurance or out-of-pocket family costs."
  },
  {
    id:"o3x19", dept:"o3", tier:3, kind:"match",
    patient:"The Phone Number Matching Board",
    complaint:"Match each Nova Scotia number to its job",
    vitals:"811 | 911 | 211 | 988",
    quote:"Four numbers, four totally different jobs. Match each number on the left to what it actually does on the right.",
    q:"Match each service number to its function:",
    pairs:[
      { left:"811", right:"Free 24/7 Registered Nurse health advice" },
      { left:"911", right:"Life-threatening emergencies (ambulance, fire, police)" },
      { left:"211", right:"Community and social services (food, transport, housing help)" },
      { left:"988", right:"24/7 suicide crisis support (call or text)" }
    ],
    pearl:"Memorize the four doors: 811 nurses, 911 emergencies, 211 community supports, 988 crisis support. Dialing the wrong one wastes critical time - dialing the right one can save a life."
  },
  {
    id:"o3x20", dept:"o3", tier:4, kind:"mc_custom", boss:true,
    patient:"BOSS: Night-Float Hospital Administrator",
    complaint:"Four charts, one decision each - the chief is watching",
    vitals:"Tier 4 double-points boss case | Nova Scotia system review",
    quote:"One night, four situations cross the admin desk: A) severe belly pain with vomiting blood, B) simple prescription refill needed before a trip, C) a teen saying goodbye and giving away possessions, D) a family asking about rides to a food bank. Which pairing of doors is correct for A and C?",
    q:"Pick the correct door pairing for situations A and C:",
    opts:[
      "A: nearest ER / 911 right away. C: 988 or Kids Help Phone plus a trusted adult, and 911 if danger is immediate",
      "A: call 811 and wait for a callback. C: respect privacy and check in at school next week",
      "A: pharmacist assessment in the morning. C: 211 for a community referral only",
      "A: 211 for transport to the hospital. C: 311 for municipal crisis support"
    ],
    ans:0,
    pearl:"Vomiting blood is an immediate 911/ER emergency. A goodbye message plus giving away possessions is a suicide-warning emergency: act now with 988, a trusted adult, and 911 if needed. The highest O3 skill is recognizing which situations cannot wait."
  }
);
