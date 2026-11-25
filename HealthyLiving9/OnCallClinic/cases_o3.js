/* ============================================================================
   ON-CALL: ROOM 8 CLINIC - Outcome 3: Triage, MSI & Insurance (12 Cases)
   Aligned 1-to-1 with 56_HL9_O3_Clinic_Navigator_Launch_Deck.html.
   Includes 4 written-evidence prompts saved to profile.writtenEvidence.
   Zero em/en dashes. Grade 9 Nova Scotia / Dartmouth context.
   ============================================================================ */
window.ONCALL_CASES = window.ONCALL_CASES || [];
window.ONCALL_CHALLENGES = window.ONCALL_CHALLENGES || [];

window.ONCALL_CASES.push(
  {
    id:"o3_01", dept:"o3", tier:1, patient:"Maya, 14",
    complaint:"Fever 38.6 C and sore throat at 9:00 PM",
    vitals:"Alert, drinking fluids | No rash, no stiff neck | No family doctor",
    quote:"I have had this fever for two days and feel worse tonight. My parents are asking if we should drive to the Dartmouth General ER.",
    q:"What is the best first step for Maya tonight?",
    opts:[
      "Drive straight to the Dartmouth General ER so a doctor checks her tonight",
      "Call 811 to speak with a Registered Nurse for free 24/7 advice",
      "Wait until noon tomorrow and try walking into a Dartmouth clinic",
      "Call 911 so paramedics can check her fever at the house"
    ],
    ans:1,
    pearl:"Maya has no emergency red flags, so 811 is the right first door. Remember: Dartmouth walk-in clinics are overrun and usually fill up right after opening, so showing up at noon rarely works."
  },
  {
    id:"o3_02", dept:"o3", tier:1, patient:"Devon, 15",
    complaint:"Worst headache of his life + stiff neck",
    vitals:"Temp 39.2 C | Rash does not fade when pressed with a glass",
    quote:"My neck hurts to bend and this rash just appeared on my chest. Should we call 811 first or wait to see how I feel in an hour?",
    q:"What is the safest immediate action?",
    opts:[
      "Call 811 and wait on hold for a nurse to call back with advice",
      "Give pain medicine and check if the headache improves in an hour",
      "Call 911 or go to the nearest emergency room immediately",
      "Book a morning spot at a Dartmouth walk-in clinic instead"
    ],
    ans:2,
    pearl:"Severe headache + stiff neck + a non-fading rash are classic emergency warning signs. Never wait on hold or shop for ER wait times during a true emergency: 911 or nearest ER always comes first."
  },
  {
    id:"o3_03", dept:"o3", tier:1, patient:"Sam, 15",
    complaint:"Out of asthma inhaler + painful cold sore",
    vitals:"Breathing normal right now | Local pharmacy open until 10:00 PM",
    quote:"My regular inhaler ran out and I do not have a family doctor. Dartmouth walk-ins are packed. Can a pharmacist actually help with this?",
    q:"How does a Nova Scotia pharmacist handle this visit?",
    opts:[
      "They cannot assess or renew anything without a doctor's new fax",
      "They can assess and renew it, and the assessment is free under MSI",
      "They can only help if Sam pays a private clinic fee up front",
      "They will send Sam straight to the Dartmouth General ER"
    ],
    ans:1,
    pearl:"NS pharmacists can renew many regular prescriptions and assess common conditions (UTI, pink eye, cold sores, tick bites) with no appointment. MSI covers the assessment, though you pay for the medication."
  }
);

window.ONCALL_CHALLENGES.push(
  {
    id:"o3_04", dept:"o3", tier:1, kind:"write", minWords:12,
    patient:"Written Note #1 - Triage",
    complaint:"38.6 C fever at 9:00 PM, no family doctor",
    vitals:"CO3 Outcome Evidence | Written Chart Note",
    quote:"A friend's parent says: 'Let's just go to the ER tonight, or walk into a Dartmouth clinic tomorrow afternoon.'",
    q:"In 1 to 2 complete sentences, explain why calling 811 tonight makes more sense than either the ER or showing up at a Dartmouth walk-in tomorrow afternoon.",
    pearl:"Strong answer: Maya has no emergency warning signs for the ER, and Dartmouth walk-in clinics are overrun and fill up early. Calling 811 gives free 24/7 Registered Nurse advice and a clear plan."
  },
  {
    id:"o3_05", dept:"o3", tier:2, kind:"triage",
    patient:"Triage Board - 5 Doors",
    complaint:"Match 4 Dartmouth situations to the right door",
    vitals:"yourhealthns.ca | 811 | Pharmacist | 911 / ER",
    quote:"Different problems need different doors so you do not waste hours in the wrong waiting room.",
    q:"Sort each situation to the best Nova Scotia door.",
    buckets:["811 / Pharmacist", "911 / ER", "211 / 988"],
    rows:[
      { t:"Painful burning when peeing, no fever or back pain", ans:0 },
      { t:"Sudden chest pain and trouble breathing", ans:1 },
      { t:"Need a ride across town to an appointment, or in crisis", ans:2 },
      { t:"Regular prescription inhaler ran out tonight", ans:0 }
    ],
    pearl:"Pharmacists handle minor ailments like uncomplicated UTIs and regular refills; 911/ER is for emergencies; 211 (rides/community) and 988 (crisis) handle support and mental health."
  },
  {
    id:"o3_06", dept:"o3", tier:2, kind:"mc_custom",
    patient:"Ari, 14",
    complaint:"Swollen ankle at 8:00 PM + forgot MSI card",
    vitals:"Can limp, no numbness | Dartmouth General ER wait: 4.5 hours",
    quote:"My ankle is swollen and needs an X-ray. Walk-ins are closed. Kentville ER (40 min drive, 24/7) shows a 30-minute wait, and I forgot my health card at home.",
    q:"Which statement is true about Ari's options tonight?",
    opts:[
      "Ari will be turned away at the ER desk without the physical MSI card",
      "Ari should never check other 24/7 ERs because you must use the closest one",
      "For a stable injury with a sober driver, a shorter-wait 24/7 ER works, and Ari is still seen without the card",
      "Ari should go to an ER marked 'limited hours' without checking if it is open"
    ],
    ans:2,
    pearl:"Urgent care is never refused for a forgotten MSI card (you can give your name/DOB and share the number later). For a stable injury with a car and sober driver, checking live waits and 24/7 hours on yourhealthns.ca can save hours."
  },
  {
    id:"o3_07", dept:"o3", tier:2, kind:"write", minWords:12,
    patient:"Written Note #2 - Walk-ins & Pharmacists",
    complaint:"Minor ailment or regular refill in Dartmouth",
    vitals:"CO3 Outcome Evidence | Written Chart Note",
    quote:"Your cousin thinks pharmacists only count pills and that everything at a pharmacy is free under MSI.",
    q:"In 1 to 2 sentences, explain what a Nova Scotia pharmacist can do without an appointment, and what is free vs. what you still pay for.",
    pearl:"Strong answer: NS pharmacists can assess common conditions and renew regular prescriptions without an appointment. MSI covers the assessment, but you still pay for the medication unless you have insurance or Pharmacare."
  },
  {
    id:"o3_08", dept:"o3", tier:2, kind:"match",
    patient:"Who Pays the Bill?",
    complaint:"Nova Scotia MSI vs. Private Insurance vs. US Bill",
    vitals:"Children's Oral Health Program | Workplace Benefits | Travel Insurance",
    quote:"Everyone says Canadian health care is 'free,' so why do jobs advertise health and dental benefits?",
    q:"Match each real-life bill on the left to who pays for it on the right.",
    pairs:[
      { left:"Stitches at Dartmouth General ER", right:"Covered by NS MSI ($0 at the door)" },
      { left:"Basic cavity filling at age 14", right:"Covered by MSI (until end of month turning 15)" },
      { left:"Antibiotic prescription or braces at 16", right:"Family private insurance or out of pocket" },
      { left:"Broken wrist in Maine (no travel insurance)", right:"Massive US hospital bill ($2,000-$10,000+ USD)" }
    ],
    pearl:"MSI covers doctors, hospitals, and basic dental until the end of the month you turn 15. Prescriptions, adult/15+ dental, braces, glasses, and physio are why Canadian families rely on workplace private insurance."
  },
  {
    id:"o3_09", dept:"o3", tier:3, kind:"mc_custom",
    patient:"Riley, 17",
    complaint:"Toothache + needs prescription antibiotics",
    vitals:"Turned 17 last month | Parents have no workplace benefits",
    quote:"When I was 14, my dental cleanings and fillings were covered by MSI. Now I am 17 and need a filling and antibiotics. Why am I getting a bill?",
    q:"Why does Riley have to pay for this dental work and prescription?",
    opts:[
      "MSI never covers dental care for anyone of any age in Nova Scotia",
      "MSI basic dental ends after the month you turn 15, and retail drugs are not covered by MSI",
      "MSI covers all dental until age 25, so the dentist made a billing mistake",
      "MSI only stops covering dental if you have never visited a family doctor"
    ],
    ans:1,
    pearl:"Nova Scotia's Children's Oral Health Program covers basic dental only until the end of the month a child turns 15. After that (and for pharmacy prescriptions), families rely on workplace benefits, Pharmacare, or out-of-pocket pay."
  },
  {
    id:"o3_10", dept:"o3", tier:3, kind:"write", minWords:12,
    patient:"Written Note #3 - Insurance in Canada",
    complaint:"Why families need private insurance in Canada",
    vitals:"CO3 Outcome Evidence | Written Chart Note",
    quote:"Someone says: 'In Canada healthcare is 100% free, so workplace health benefits are pointless.'",
    q:"In 1 to 2 sentences, explain why Canadian families still need private health insurance (give at least two specific things MSI does not cover, including the dental age rule).",
    pearl:"Strong answer: MSI covers doctors and hospitals, but it does not cover prescriptions, glasses, physio, or dental care once you pass the month you turn 15. Private workplace benefits help families pay those ongoing bills."
  },
  {
    id:"o3_11", dept:"o3", tier:3, kind:"mc_custom",
    patient:"Jamie, 14",
    complaint:"Ear infection on a weekend trip to Maine",
    vitals:"9:00 PM in Bangor, Maine | Family has travel medical insurance",
    quote:"My parent says, 'Just hand them your Nova Scotia health card at the urgent care desk so we do not have to pay.'",
    q:"What is the right move in the United States?",
    opts:[
      "Hand over the NS health card because US clinics bill Nova Scotia directly",
      "Wait two days in pain until the car gets back across the New Brunswick border",
      "Call the travel insurer's 24/7 line first, go where they direct, and keep every receipt",
      "Refuse treatment because US emergency rooms turn away uninsured Canadians"
    ],
    ans:2,
    pearl:"Your NS health card does not pay for care in the US (and US ERs will stabilize you, then send a huge bill). Always buy travel medical insurance, call their 24/7 line first, and keep every receipt to claim."
  },
  {
    id:"o3_12", dept:"o3", tier:3, kind:"write", minWords:12,
    patient:"Written Note #4 - Crossing the Border",
    complaint:"Medical care in the United States",
    vitals:"CO3 Outcome Evidence | Written Chart Note",
    quote:"Your family is planning a weekend road trip to Maine and assumes your NS health card covers emergencies there.",
    q:"In 1 to 2 sentences, explain what happens if you go to a US ER without travel insurance, and two steps to take if you DO have travel insurance.",
    pearl:"Strong answer: Without travel insurance, a US ER will stabilize you and then send a bill for thousands of dollars because MSI covers little or nothing abroad. With travel insurance, call their 24/7 line first and keep all itemized receipts."
  }
);
