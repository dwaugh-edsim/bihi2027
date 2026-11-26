/* ============================================================================
   ON-CALL: ROOM 8 CLINIC - Health Navigation, Boundaries & Help-Seeking (40 Cases)
   Grounded in HL9 CO3 (Health Literacy/System), CO4 (Communication/Say No),
   CO8 (Bystander), CO10 (Substances/Vaping), CO11 (Help-Seeking).
   Tiers: 1 (Intern), 2 (Resident), 3 (Attending), 4 (Chief of Medicine)
   Zero em/en dashes. Grade 9 Nova Scotia context.
   ============================================================================ */
window.ONCALL_CASES = window.ONCALL_CASES || [];
window.ONCALL_CASES.push(
  /* ---------------- TIER 1: INTERN (10 cases) ---------------- */
  { id:"nav01", dept:"nav", tier:1, patient:"Liam, 14", complaint:"Unsure if mild fever needs the ER",
    vitals:"Temp 38.0 C, drinking fluids, alert | 9:00 PM in Halifax",
    quote:"I am not sure whether I should go to the Emergency Room tonight or wait until morning. Who can I call for free nurse advice in Nova Scotia?",
    q:"Which free 24/7 Nova Scotia phone line connects you to a Registered Nurse?",
    opts:[
      "Call 811 for Nova Scotia Telecare to get nurse triage advice",
      "Call 211 for community referrals to book a same-night ER spot",
      "Call 311 for municipal services to request a home nurse visit",
      "Call 911 for non-urgent symptom checks before visiting a clinic"
    ],
    ans:0, pearl:"811 is Nova Scotia's free 24/7 health advice line staffed by Registered Nurses who help you decide between home care, a clinic, or the ER. 211 connects to community and social services, 311 is municipal, and 911 is for emergencies." },
  { id:"nav02", dept:"nav", tier:1, patient:"Maya, 15", complaint:"Friend feeling overwhelmed and unsafe at 11 PM",
    vitals:"Mental health crisis support (CO11)",
    quote:"My friend texted me saying they do not want to be here anymore. They asked me not to tell anyone, and it is late at night.",
    q:"What is the safest immediate step when a friend expresses thoughts of suicide?",
    opts:[
      "Reach out to 988 or Kids Help Phone and involve a trusted adult or 911 if danger is immediate",
      "Respect their request for privacy tonight and check in with them first thing at school tomorrow",
      "Stay up texting them all night yourself so they do not feel betrayed by you telling an adult",
      "Wait until the school counsellor's office opens on Monday so a professional who knows them can help"
    ],
    ans:0, pearl:"988 (Suicide Crisis Helpline, call or text 24/7) and Kids Help Phone (text CONNECT to 686868 or call 1-800-668-6868) are free and 24/7. Never keep a safety secret: involve a trusted adult, or call 911 if someone is in immediate danger." },
  { id:"nav03", dept:"nav", tier:1, patient:"Noah, 15", complaint:"Offered a flavoured vape behind the rink",
    vitals:"Peer pressure scenario (CO4 / CO10)",
    quote:"Older kids said, 'Come on, it is just mango water vapour, there is barely anything in it.' I want to know what is actually inside.",
    q:"What is accurate about the contents of most flavoured disposable vapes?",
    opts:[
      "They deliver high-strength nicotine salts, flavouring chemicals, and ultrafine aerosol particles",
      "They heat flavoured distilled water with trace nicotine that clears from the lungs within hours",
      "They contain food-grade fruit vapour without nicotine unless the package is labelled tobacco flavour",
      "They release low-dose steam that avoids addictive effects as long as you do not inhale deeply"
    ],
    ans:0, pearl:"Most flavoured disposable vapes contain concentrated nicotine salts that rapidly hook developing teen brains, along with ultrafine aerosols, flavouring chemicals, and trace metals from heating coils." },
  { id:"nav04", dept:"nav", tier:1, patient:"Chloe, 14", complaint:"Saying no to skipping class",
    vitals:"CO4 Say No Lab Pack",
    quote:"My friend keeps pressuring me to skip fourth period and walk to the mall. I want to stay in class without turning it into a fight.",
    q:"Which refusal holds your boundary clearly and respectfully?",
    opts:[
      "'No thanks, I am staying for fourth period today. I will catch up with you after school.'",
      "'I guess I could come for ten minutes if you promise we will not get caught.'",
      "'Stop being so immature and trying to drag me down with your bad choices.'",
      "'Maybe next time, I think my teacher might be watching the hallway right now.'"
    ],
    ans:0, pearl:"Assertive communication is clear, calm, and firm: it states your decision without insulting the other person (aggressive), caving in (passive), or leaving the door open for more pressure." },
  { id:"nav05", dept:"nav", tier:1, patient:"Sam, 15", complaint:"Checking a viral health claim online",
    vitals:"CO3 Health Literacy",
    quote:"I found a post claiming a special lemon-ginger drink clears strep throat in two hours, with a link to buy their starter kit.",
    q:"Which sign most strongly marks this post as unreliable health information?",
    opts:[
      "It promises a fast miracle cure while selling a product with no public-health or clinical evidence",
      "It uses simple everyday language instead of medical terms that require a university degree to read",
      "It shares a personal story before mentioning that readers should check with a local pharmacist",
      "It appears on social media rather than inside a printed textbook or hospital waiting-room poster"
    ],
    ans:0, pearl:"Reliable health sources (Nova Scotia Health, Health Canada, IWK, PHAC) can use plain language and social media, but they explain evidence and limits honestly and never sell instant miracle cures." },
  { id:"nav06", dept:"nav", tier:1, patient:"Zoe, 14", complaint:"Emergency Room vs. walk-in triage",
    vitals:"Triage decision-making (CO3)",
    quote:"Sometimes it is hard to tell when a symptom needs 911 or the Emergency Room right away versus a clinic or pharmacist.",
    q:"Which situation always requires calling 911 or going to the Emergency Room immediately?",
    opts:[
      "Sudden trouble breathing, chest pain, severe swelling, or bleeding that will not stop",
      "A sore throat and low fever that started yesterday while still able to drink fluids normally",
      "A painful burning feeling when peeing with no fever and no back pain in an otherwise well teen",
      "A mild sprained ankle from gym class that is swollen but still allows you to bear some weight"
    ],
    ans:0, pearl:"Emergency rooms and 911 are for life- or limb-threatening emergencies like breathing trouble, chest pain, anaphylaxis, or uncontrolled bleeding. Minor ailments can be handled faster via 811, pharmacists, or clinics." },
  { id:"nav07", dept:"nav", tier:1, patient:"Ethan, 15", complaint:"Witnessing hallway harassment",
    vitals:"CO8 Bystander Intervention",
    quote:"I saw someone getting cornered and mocked at the lockers. I am not comfortable physically stepping between them, so I froze.",
    q:"Which bystander action helps safely without escalating physical conflict?",
    opts:[
      "Interrupt by asking the targeted student a random question, or quickly alert a nearby staff member",
      "Stand quietly near the edge of the crowd to see whether the targeted student can handle it alone",
      "Walk straight into the middle of the group and push the main person back to end it immediately",
      "Wait until the next day to bring it up in class so you do not draw attention in the hallway"
    ],
    ans:0, pearl:"Safe bystander intervention uses the 4 Ds: Direct, Distract (interrupt with a neutral question), Delegate (get a teacher or trusted adult), and Delay (check in with the student right afterward)." },
  { id:"nav08", dept:"nav", tier:1, patient:"Priya, 15", complaint:"School Youth Health Centre basics",
    vitals:"CO3 Navigating NS services",
    quote:"Our high school has a Youth Health Centre, and I am not sure what kinds of questions a teen can actually bring there.",
    q:"Which description accurately explains a Nova Scotia school-based Youth Health Centre?",
    opts:[
      "Free, confidential support for physical, mental, and sexual health plus community service referrals",
      "A first-aid room for gym injuries that requires written parent permission before any health conversation",
      "A walk-in clinic staffed only for sports physicals, vaccine records, and prescription refills during lunch",
      "A school office that logs every student visit directly with the vice-principal for attendance tracking"
    ],
    ans:0, pearl:"Nova Scotia's Youth Health Centres give teens free, non-judgmental, confidential health guidance and connect them to community services without needing a parent note just to talk." },
  { id:"nav09", dept:"nav", tier:1, patient:"Owen, 14", complaint:"Preparing for a walk-in clinic visit",
    vitals:"Halifax clinic intake (CO3)",
    quote:"I am going to a Nova Scotia walk-in clinic for the first time and want to make sure I bring the right public health coverage card.",
    q:"Which card covers medically necessary doctor and clinic visits in Nova Scotia?",
    opts:[
      "Your Nova Scotia MSI Health Card issued through Medical Services Insurance",
      "Your federal Social Insurance Number card issued for employment and tax filing",
      "Your school student identification card showing your current Nova Scotia address",
      "Your Nova Scotia provincial photo ID card issued by Access Nova Scotia"
    ],
    ans:0, pearl:"Your Nova Scotia MSI (Medical Services Insurance) card covers medically necessary doctor, clinic, and hospital visits. Keep the card or a clear photo of it handy whenever you seek care." },
  { id:"nav10", dept:"nav", tier:1, patient:"Avery, 15", complaint:"Handling repeat peer pressure",
    vitals:"CO4 Say No Lab Pack",
    quote:"When I say no once, my friend keeps pushing with 'Why not? Just try it one time!' I end up getting pulled into an argument.",
    q:"How does the 'Broken Record' refusal strategy stop repeat pressure?",
    opts:[
      "Calmly repeat your same short boundary each time without getting pulled into debating excuses",
      "Offer a detailed story about why you cannot do it today so they stop asking questions",
      "Raise your voice a little more each time until they realize you are serious about leaving",
      "Change the subject to a different risky activity so they forget what they originally asked"
    ],
    ans:0, pearl:"With the Broken Record technique ('No thanks, I am good' repeated calmly), you do not owe a debate to justify your boundary, which removes the fuel from repeat pressure." },

  /* ---------------- TIER 2: RESIDENT (10 cases) ---------------- */
  { id:"nav11", dept:"nav", tier:2, patient:"Marcus, 15", complaint:"Pharmacist scope in Nova Scotia",
    vitals:"Uncomplicated minor ailment | No family doctor",
    quote:"I do not have a family doctor and the walk-in clinic is already full. Someone told me Nova Scotia pharmacists can assess certain conditions directly.",
    q:"What are Nova Scotia pharmacists authorized to assess and prescribe for?",
    opts:[
      "Minor ailments like uncomplicated UTIs, pink eye, cold sores, allergies, birth control, and vaccines",
      "Only over-the-counter items and renewing existing prescriptions that a doctor originally wrote first",
      "Any injury or illness including X-rays, stitches, and controlled pain prescriptions without a doctor",
      "Only seasonal flu shots and travel vaccines unless you are already registered with a family physician"
    ],
    ans:0, pearl:"Nova Scotia pharmacists and Community Pharmacy Primary Care Clinics can assess and prescribe for dozens of common minor ailments, including strep throat assessment and contraception, using your MSI card." },
  { id:"nav12", dept:"nav", tier:2, patient:"Hannah, 15", complaint:"Friend passed out after heavy drinking",
    vitals:"CO8 + CO10 | Slow irregular breathing, cold clammy skin, will not wake",
    quote:"My friend drank way too much and passed out on the couch. Someone said to put him on his back with water and let him sleep it off.",
    q:"What is the correct emergency response for suspected alcohol poisoning?",
    opts:[
      "Call 911 right away, roll him onto his side, and stay with him until help arrives",
      "Put him in a cold shower and give him black coffee to bring his blood alcohol down",
      "Leave him flat on his back with pillows propped under his head and check him hourly",
      "Walk him around the room for twenty minutes until he sobers up enough to talk clearly"
    ],
    ans:0, pearl:"Blood alcohol keeps rising even after a person passes out. Cold showers, coffee, and walking do not sober someone up. Slow breathing, cold skin, or inability to wake requires 911 and the recovery position immediately." },
  { id:"nav13", dept:"nav", tier:2, patient:"Devon, 15", complaint:"Calling 911 during a suspected overdose",
    vitals:"Emergency law consult",
    quote:"If someone is overdosing at a party and a friend calls 911, will they get arrested for simple drug possession?",
    q:"What protection does Canada's Good Samaritan Drug Overdose Act provide?",
    opts:[
      "Protection from simple possession charges and related breach conditions for callers and people at the scene",
      "Complete immunity from all criminal charges, including outstanding warrants and drug trafficking, at the scene",
      "Protection only for the person experiencing the overdose, not for the friend who actually dialed 911",
      "Protection only if the call is placed by an adult over 18 or from a licensed public building"
    ],
    ans:0, pearl:"Canada's Good Samaritan Drug Overdose Act protects the caller, the person overdosing, and others at the scene from simple possession charges (and certain breach conditions) so fear of arrest never delays a 911 call." },
  { id:"nav14", dept:"nav", tier:2, patient:"Sofia, 14", complaint:"Partner demanding constant digital access",
    vitals:"CO4 + CO6 Healthy Relationships",
    quote:"My partner demands my phone passcode, checks my live location all day, and gets angry when I hang out with old friends. They say it proves they care.",
    q:"How should a health professional assess this pattern of behaviour?",
    opts:[
      "Digital monitoring and isolating you from friends are controlling red flags, not healthy love",
      "Sharing passcodes and live locations is a normal trust expectation once a couple becomes exclusive",
      "Jealousy over old friends usually fades on its own if you prove your loyalty by texting faster",
      "It only becomes unhealthy if the person starts yelling in public or causing physical harm"
    ],
    ans:0, pearl:"Healthy relationships respect privacy, friendships, and personal autonomy. Controlling passcodes, tracking location, and cutting off friends are serious warning signs to discuss with a trusted adult." },
  { id:"nav15", dept:"nav", tier:2, patient:"Lucas, 15", complaint:"Friend opens up about ongoing hopelessness",
    vitals:"CO11 Help-Seeking",
    quote:"My friend finally told me they have felt anxious and hopeless for over a month. I want to respond in a way that actually helps them.",
    q:"Which response best supports a friend who opens up about mental health?",
    opts:[
      "Validate how they feel and offer to connect with the school counsellor or Kids Help Phone",
      "Reassure them that everyone feels stressed in Grade 9 so they do not feel singled out",
      "Promise to keep everything completely between the two of you so they keep trusting you",
      "Give them a detailed daily workout and study schedule to fix their mood by next week"
    ],
    ans:0, pearl:"Listen without judgment, validate their feelings ('Thank you for telling me, you do not have to carry this alone'), and help bridge them to a qualified adult or support service without promising secrecy around safety." },
  { id:"nav16", dept:"nav", tier:2, patient:"Kira, 15", complaint:"Questions about oral nicotine pouches",
    vitals:"CO10 Substance Use",
    quote:"Since nicotine pouches like Zonnic or Zyn have no smoke or vapour, a friend said they are a safe, non-addictive way to stay focused.",
    q:"What is the medical reality of oral nicotine pouches for teenagers?",
    opts:[
      "They deliver concentrated nicotine through the gums, causing rapid addiction and heart-rate spikes",
      "They avoid addiction risk because nicotine only affects brain receptors when inhaled into the lungs",
      "They are approved by Health Canada as a teen study aid for caffeine-free focus during school exams",
      "They carry no cardiovascular or gum effects because the pouch stays tucked under the upper lip"
    ],
    ans:0, pearl:"Smoke-free does not mean harm-free. Concentrated nicotine absorbed through the gums causes gum irritation, heart-rate spikes, and rewires developing teen brain circuits for attention, impulse control, and addiction." },
  { id:"nav17", dept:"nav", tier:2, patient:"Tyler, 14", complaint:"Head impact during a hockey game",
    vitals:"CO7 Injury Prevention | Hit head on boards, dizzy with headache",
    quote:"I took a hard hit in the second period and feel dizzy with a headache. My coach asked if I can play the third since I did not black out.",
    q:"What is the medically required concussion decision here?",
    opts:[
      "Stop playing immediately for assessment; most concussions happen without blacking out",
      "Sit out for ten minutes with water and rest, then return if the dizziness mostly fades",
      "Finish the game because losing consciousness is the main clinical sign of a concussion",
      "Switch to lighter shifts and tighten your helmet strap so you avoid another hard collision"
    ],
    ans:0, pearl:"Over 90% of concussions happen with no loss of consciousness. 'When in doubt, sit them out': returning before the brain heals risks dangerous Second Impact Syndrome." },
  { id:"nav18", dept:"nav", tier:2, patient:"Nadia, 15", complaint:"Evaluating a wellness influencer's advice",
    vitals:"CO3 Health Literacy",
    quote:"An influencer with two million followers says prescribed asthma inhalers weaken your lungs and sells a $60 herbal tea to replace them.",
    q:"Which health-literacy evaluation best applies to this claim?",
    opts:[
      "Clear financial conflict and unsafe advice to stop prescribed meds; check with your doctor",
      "Try the tea alongside your inhaler for two weeks first to see whether your breathing improves",
      "A two-million-person audience suggests thousands of users have already tested the product safely",
      "Herbal products are natural, so stopping a prescription briefly to test them carries minimal medical risk"
    ],
    ans:0, pearl:"Follower count is not medical credentials, and 'natural' does not mean safe. Never stop a prescribed medication like an asthma inhaler based on social media; always check with your doctor or pharmacist." },
  { id:"nav19", dept:"nav", tier:2, patient:"Ben, 15", complaint:"Handling FOMO and ego bait",
    vitals:"CO4 Say No Lab Pack",
    quote:"When I turned down a risky hangout, someone laughed and said, 'Fine, stay home if you are scared, everyone cool is going.'",
    q:"Which refusal response keeps your boundaries intact without taking the bait?",
    opts:[
      "Use light humour like 'Guess I am uncool tonight, see you Monday' and walk away",
      "Stay and explain for ten minutes why you are actually brave so they stop teasing",
      "Go for half an hour just to show you are not scared, then quietly sneak out early",
      "Snap back by insulting their choices so the rest of the group backs off from you"
    ],
    ans:0, pearl:"Deflecting ego bait with calm humour and exiting ends peer pressure immediately without escalating conflict or letting someone else steer your choices." },
  { id:"nav20", dept:"nav", tier:2, patient:"Tessa, 15", complaint:"Understanding how substance use is classified",
    vitals:"CO10 Substance Use Continuum",
    quote:"In health class we talked about whether substance use is simply 'zero use' versus 'addiction,' or whether Canadian frameworks view it differently.",
    q:"How do Canadian public-health frameworks describe substance use?",
    opts:[
      "As a continuum from non-use and medical use to lower-risk, higher-risk, and disorder",
      "As two fixed categories: harmless recreational use versus permanent addiction caused by genetics",
      "As a model that excludes prescribed medications because they are regulated by licensed pharmacies",
      "As a straight one-way ladder where any single experiment automatically leads to a severe disorder"
    ],
    ans:0, pearl:"The substance use continuum (non-use, beneficial/medical, lower-risk, higher-risk, disorder) helps youth recognize early warning signs like using to cope with stress or hiding use, and seek support early." },

  /* ---------------- TIER 3: ATTENDING (10 cases) ---------------- */
  { id:"nav21", dept:"nav", tier:3, patient:"Omar, 15", complaint:"Uncertainty before giving nasal Naloxone",
    vitals:"CO8 + CO10 Harm Reduction | Unresponsive person, pinpoint pupils, slow breathing",
    quote:"I have a nasal Naloxone spray, but I am nervous: what happens if I give it to an unconscious person and it turns out not to be an opioid overdose?",
    q:"What is the clinical fact about administering nasal Naloxone in an emergency?",
    opts:[
      "It is harmless if no opioids are present, so give it and call 911 when opioids are suspected",
      "It can trigger severe heart-rate drops if no opioids are present, so confirm the substance first",
      "It reverses both opioid and alcohol overdoses, making it a substitute for calling 911 right away",
      "It should only be given by paramedics because incorrect timing can block emergency room treatments"
    ],
    ans:0, pearl:"Naloxone only binds to opioid receptors and cannot hurt someone who has not taken opioids. Free Take-Home Naloxone kits are available at Nova Scotia pharmacies; always call 911 too because Naloxone can wear off before the opioid does." },
  { id:"nav22", dept:"nav", tier:3, patient:"Grace, 15", complaint:"Why a large crowd froze during an incident",
    vitals:"CO8 Bystander Psychology",
    quote:"Twenty students watched someone get shoved in the courtyard and nobody moved. I do not understand why a bigger crowd made help less likely.",
    q:"What psychological barrier caused the crowd to freeze, and how do you break it?",
    opts:[
      "Diffusion of responsibility makes people assume others will act; assign one specific person a clear task",
      "Social conformity makes crowds agree with the aggressor; shout broadly to the whole group for help",
      "Cognitive overload makes witnesses forget school rules; wait until the crowd thins out before stepping in",
      "Emotional desensitization happens in groups; record the incident first so everyone feels accountable"
    ],
    ans:0, pearl:"The Bystander Effect happens through diffusion of responsibility: everyone assumes someone else will step up. Pointing to one specific person ('You in the red jacket, get Mr. Smith') shatters it immediately." },
  { id:"nav23", dept:"nav", tier:3, patient:"Eli, 15", complaint:"Comparing modern THC vapes to older cannabis",
    vitals:"CO10 Substance Science",
    quote:"Someone claimed cannabis was harmless in the 1970s, so today's THC vape carts and concentrates are basically the same thing.",
    q:"What is the key scientific difference affecting youth under 25 today?",
    opts:[
      "Modern concentrates can reach 70-90% THC, raising risks of anxiety, psychosis, dependence, and memory harm",
      "Vaping cannabis removes THC potency compared to smoking dried flower, making carts milder on teen brains",
      "The prefrontal cortex finishes wiring around age 15, so high-THC risks mainly affect younger children",
      "Modern cannabis mainly increases lung irritation while mental-health risks stay identical to 1970s flower"
    ],
    ans:0, pearl:"Dried cannabis decades ago averaged roughly 3-5% THC, whereas modern concentrates and vape carts can hit 70-90% THC. High-potency THC hits a still-developing brain (wiring until ~25) much harder." },
  { id:"nav24", dept:"nav", tier:3, patient:"Sienna, 15", complaint:"Teammate hiding frequent panic attacks",
    vitals:"CO5 + CO11 | Gender norms and help-seeking",
    quote:"My teammate told me, 'Guys are not supposed to talk about anxiety, you just push through it.' He has been skipping practice and looking exhausted.",
    q:"How do rigid gender norms measurably affect teen health outcomes?",
    opts:[
      "They create stigma that delays care, increases isolation or risky coping, and worsens health outcomes",
      "They mainly affect how teens talk with friends, without changing whether they visit clinics when needed",
      "They help athletes build short-term stress tolerance as long as they talk to someone after the season",
      "They only affect emotional health and have little connection to physical symptoms or substance use"
    ],
    ans:0, pearl:"Rigid 'suck it up' norms delay care, drive isolation, and increase unhealthy coping like substance use. Challenging those norms makes early help-seeking normal and protects both mental and physical health." },
  { id:"nav25", dept:"nav", tier:3, patient:"Riya, 14", complaint:"Accessing virtual primary care in Nova Scotia",
    vitals:"CO3 Navigating Care",
    quote:"My family moved here last year and does not have a family doctor yet. How can we book a free virtual doctor or nurse practitioner visit?",
    q:"Which official Nova Scotia Health pathway serves residents without a family doctor?",
    opts:[
      "VirtualCareNS via the YourHealthNS app or website, alongside the Need a Family Practice Registry",
      "Calling 811 to have a Telecare nurse directly prescribe medications and book specialist surgeries",
      "Registering at the IWK Emergency Department triage desk to be assigned a permanent family clinic",
      "Using a private out-of-province telehealth app and submitting the receipt to MSI for full reimbursement"
    ],
    ans:0, pearl:"VirtualCareNS (through YourHealthNS), the Need a Family Practice Registry, and Community Pharmacy Primary Care Clinics give Nova Scotians MSI-covered access even while waiting for a family doctor." },
  { id:"nav26", dept:"nav", tier:3, patient:"Caleb, 15", complaint:"Curfew arguments turning into shouting matches",
    vitals:"CO4 Conflict Resolution",
    quote:"Every time I tell my parent, 'You never trust me and you always ruin my weekend,' the conversation explodes and nothing changes.",
    q:"Which revision uses an effective 'I' statement to lower defensiveness?",
    opts:[
      "'I feel frustrated when curfew shifts last minute. Can we agree on a check-in plan?'",
      "'I feel like you never listen to my side because you always assume I will make bad choices.'",
      "'I will just stay home every weekend from now on since nothing I do ever seems good enough.'",
      "'I think you should trust me more at fifteen because all of my friends have later curfews.'"
    ],
    ans:0, pearl:"A true 'I' statement ('I feel [emotion] when [specific event] because [reason]; can we [request]?') avoids disguised 'you' accusations like 'I feel like you never...', which still trigger defensiveness." },
  { id:"nav27", dept:"nav", tier:3, patient:"Mina, 15", complaint:"Asked to cover for a friend skipping to get high",
    vitals:"CO10 Enabling vs. Supporting",
    quote:"My friend asks me to lie to their parents and cover for them whenever they skip class to vape or drink. I want to be loyal, not betray them.",
    q:"What distinguishes healthy support from enabling in this situation?",
    opts:[
      "Covering up consequences enables the habit; support sets honest boundaries and encourages help",
      "Covering once or twice builds trust so they will eventually open up and quit on their own timeline",
      "True support means stepping back completely and cutting off contact until they decide to get help",
      "Lying to parents is supportive as long as you privately remind your friend to cut back after school"
    ],
    ans:0, pearl:"Shielding someone from the consequences of harmful substance use is enabling, not helping. Real support means being honest, refusing to lie for them, and helping connect them to a counsellor or trusted adult." },
  { id:"nav28", dept:"nav", tier:3, patient:"Alex, 15", complaint:"Private photo shared in a disappearing group chat",
    vitals:"CO7 Digital Safety",
    quote:"Someone dropped an embarrassing private photo of a classmate into a 10-second disappearing snap group. People say it vanishes so it is no big deal.",
    q:"What is the digital-safety and legal reality of 'disappearing' messages?",
    opts:[
      "Screenshots and second cameras prevent true deletion, and forwarding private images can be illegal",
      "Disappearing apps wipe server copies automatically, so viewing or forwarding within the group leaves no trace",
      "Only the original person who took the photo faces school or legal consequences, not people who forward it",
      "Privacy laws only apply when a photo is posted on a public profile rather than a closed friend group"
    ],
    ans:0, pearl:"Screenshots, screen recordings, and second phones mean nothing truly disappears online. Sharing non-consensual private images causes lasting harm and can carry serious legal consequences." },
  { id:"nav29", dept:"nav", tier:3, patient:"Jordan, 15", complaint:"Worried about transitioning to high school",
    vitals:"CO9 Protective Factors and Resilience",
    quote:"Starting high school next fall feels huge and overwhelming. I want to know what actually helps teens stay resilient through big transitions.",
    q:"Which set of habits represents research-backed protective factors for youth?",
    opts:[
      "At least one trusted adult, supportive peers, steady sleep and movement routines, and early help-seeking",
      "Keeping your schedule completely packed with activities so you never have quiet time to notice stress",
      "Handling worries privately for the first semester so you build independence before asking adults for help",
      "Staying up late online with middle-school friends every night to keep your old routine unchanged"
    ],
    ans:0, pearl:"Resilience is not toughing things out alone: it is built from connection (at least one trusted adult and supportive peers), healthy sleep and movement routines, and knowing how to ask for help early." },
  { id:"nav30", dept:"nav", tier:3, patient:"Sam, 15", complaint:"Combining cold syrup and extra pain relievers",
    vitals:"CO3 Medication Literacy | Cold syrup + 2 extra Tylenol every 4 hours",
    quote:"I took multi-symptom cold syrup plus two extra Tylenol pills every four hours for my fever. The pharmacist flagged it right away.",
    q:"What hidden medication risk did the pharmacist identify?",
    opts:[
      "Accidental double-dosing of acetaminophen already inside the cold syrup, which can cause serious liver damage",
      "Combining liquid syrup and solid tablets causes the two formulas to cancel each other out in the stomach",
      "Over-the-counter cold syrups contain strong prescription antibiotics that interact badly with regular painkillers",
      "Taking fever reducers every four hours lowers body temperature too quickly and masks bacterial infections"
    ],
    ans:0, pearl:"Always read the 'Active Ingredients' box on over-the-counter medicines. Many multi-symptom cold products already contain acetaminophen (Tylenol), and exceeding the daily limit risks severe liver injury." },

  /* ---------------- TIER 4: CHIEF OF MEDICINE (10 cases) ---------------- */
  { id:"nav31", dept:"nav", tier:4, patient:"Triage Desk: Urgent Mental Health in NS", complaint:"Teen in acute mental-health crisis at 10 PM in Halifax",
    vitals:"Immediate provincial crisis routing (CO3 + CO11)",
    quote:"A family in Halifax has a teen in acute mental-health crisis late at night and needs immediate provincial crisis support, not a routine waitlist.",
    q:"Which Nova Scotia pathway provides immediate 24/7 crisis response right now?",
    opts:[
      "Provincial Mental Health Crisis Line (1-888-429-8167), 988, IWK Emergency, or 911 if immediate danger",
      "Submitting a self-referral through VirtualCareNS to be matched with an online counsellor within 48 hours",
      "Booking a next-morning Community Pharmacy Primary Care Clinic slot for an urgent mental-health assessment",
      "Calling the school Youth Health Centre voicemail so the nurse can coordinate a morning crisis check-in"
    ],
    ans:0, pearl:"Save 1-888-429-8167 (NS Provincial Mental Health and Addictions Crisis Line) and 988. For youth in Halifax, the IWK Emergency Department also handles urgent pediatric mental-health crises, and 911 is for immediate physical danger." },
  { id:"nav32", dept:"nav", tier:4, patient:"Evaluating a Viral Health Headline", complaint:"Headline: 'Ice cream sales strongly linked to higher drowning rates'",
    vitals:"CO3 Critical Health Literacy",
    quote:"A viral infographic shows a real statistical chart where ice cream sales and drownings rise together, claiming ice cream makes swimming unsafe.",
    q:"Which critical-thinking error explains why this headline misleads readers?",
    opts:[
      "Confusing correlation with causation when a confounding variable like hot summer weather drives both trends",
      "Relying on an outdated sample size that measured coastal towns instead of including indoor swimming pools",
      "Using observational numbers without calculating the exact percentage increase in monthly ice cream calories",
      "Ignoring individual food allergies that could cause stomach cramps right after eating cold dairy snacks"
    ],
    ans:0, pearl:"Correlation does not prove causation. Always look for confounding variables (like hot weather driving both swimming and ice cream sales), who funded the study, and how large and representative the sample was." },
  { id:"nav33", dept:"nav", tier:4, patient:"Pre-Party Safety Planning", complaint:"Invited to an older teen's house party across town",
    vitals:"CO4 + CO7 Proactive Boundaries",
    quote:"I want to go to a house party where older teens might bring alcohol or vapes, and I want a solid plan before I even walk through the door.",
    q:"Which proactive safety plan best protects your autonomy if the party shifts?",
    opts:[
      "Set a code-word text with a trusted adult for a no-questions-asked ride, use a buddy, and watch your drink",
      "Decide your exact refusal lines ahead of time and rely on catching a ride home with whoever drove you",
      "Keep your phone on silent in a backpack so you stay relaxed, and leave only if other friends leave first",
      "Tell your parents you are at a different friend's house so they will not panic if you decide to leave early"
    ],
    ans:0, pearl:"An independent exit strategy (code-word ride with a parent or trusted adult), a reliable buddy system, and keeping your own drink in hand make walking away effortless if a situation turns unsafe." },
  { id:"nav34", dept:"nav", tier:4, patient:"Youth Vaping Quit Support", complaint:"15-year-old gets headaches and irritability on Day 2 of quitting",
    vitals:"CO10 + CO11 | Tried quitting cold turkey twice",
    quote:"I genuinely want to quit vaping, but by Day 2 I get headaches and snap at everyone, so I end up caving. What actually works for teens in Nova Scotia?",
    q:"Which evidence-based approach gives a teen the strongest chance of quitting?",
    opts:[
      "Combine free supports like Tobacco Free NS (811), Quash, or a nurse/pharmacist with a plan for Day 3-5 peaks",
      "Switch to flavoured oral nicotine pouches for two months so you avoid lung vapour while keeping nicotine steady",
      "Taper down slowly on your own without telling anyone so you avoid the embarrassment of a possible slip",
      "Wait until summer break to try cold turkey again since withdrawal symptoms usually worsen for several months"
    ],
    ans:0, pearl:"Nicotine withdrawal peaks quickly around days 3 to 5 and then fades. Combining trigger swaps with free youth supports (Tobacco Free Nova Scotia via 811, the Quash app, Youth Health Centre nurse, or doctor/pharmacist) boosts success." },
  { id:"nav35", dept:"nav", tier:4, patient:"Friend Discloses Sexual Assault", complaint:"Friend whispers they were hurt sexually at a party and looks terrified",
    vitals:"CO6 Trauma-Informed First Response",
    quote:"My friend just confided that someone hurt them sexually at a party last weekend. They are shaking and afraid nobody will believe them.",
    q:"What is the trauma-informed gold standard for your first response?",
    opts:[
      "Believe them, affirm it is not their fault, respect their pace, and offer confidential support",
      "Ask detailed questions about the timeline and what happened first so you can help them remember evidence",
      "Encourage them to confront the person right away with you present so they can take back control quickly",
      "Check in with two close mutual friends privately to figure out the best plan before calling any service"
    ],
    ans:0, pearl:"Start with 'I believe you. It is not your fault. You are not alone.' Never interrogate or blame clothing, alcohol, or freezing; respect their pace and offer confidential Halifax/NS resources like Avalon Sexual Assault Centre, IWK, or a trusted adult." },
  { id:"nav36", dept:"nav", tier:4, boss:true, patient:"Severe Allergic Reaction in the Cafeteria", complaint:"Classmate ate an unmarked cookie; hives, lip swelling, wheezing",
    vitals:"CO8 Emergency Triage | Carries EpiPen in backpack",
    quote:"My classmate is wheezing and says their throat feels tight right after eating a cookie. Someone suggested an antihistamine pill first to see if it settles.",
    q:"What is the immediate life-saving protocol for suspected anaphylaxis?",
    opts:[
      "Inject epinephrine into the outer thigh immediately and call 911; never delay for antihistamines",
      "Give an oral antihistamine first and monitor breathing for fifteen minutes before deciding on the EpiPen",
      "Use a rescue asthma inhaler first to open the airway, and save epinephrine only if they lose consciousness",
      "Have them sit upright, sip cold water slowly, and walk them to the main office to call their parents"
    ],
    ans:0, pearl:"Epinephrine first into the outer thigh, then 911 immediately. Antihistamines are far too slow and never stop airway swelling or shock in anaphylaxis; inhalers do not treat the systemic reaction either." },
  { id:"nav37", dept:"nav", tier:4, patient:"Comparing Neighbourhood Health Rates", complaint:"Two Halifax neighbourhoods show sharply different asthma and ER rates",
    vitals:"CO3 + Community Health Equity",
    quote:"Public-health data shows two nearby communities have very different asthma and ER visit rates. Does personal willpower alone explain that gap?",
    q:"What are the Social Determinants of Health that help explain this difference?",
    opts:[
      "Upstream factors like housing quality, income, air quality, food access, and healthcare access alongside choices",
      "Inherited genetic differences between families living in different postal codes across the same municipality",
      "How closely residents follow daily exercise targets and read nutrition labels compared with other neighbourhoods",
      "Differences in how often local schools schedule physical education classes and annual wellness assemblies"
    ],
    ans:0, pearl:"Personal habits matter, AND upstream social conditions (housing quality, income, safe neighbourhoods, clean air, food security, and healthcare access) powerfully shape health outcomes across communities." },
  { id:"nav38", dept:"nav", tier:4, patient:"Ultimatum Over a Boundary", complaint:"Friend threatens to end the friendship if you refuse to shoplift",
    vitals:"CO4 Boundaries and Manipulation",
    quote:"Whenever I refuse to vape or shoplift with them, they say, 'Guess we are not really friends then.' I hate losing people I care about.",
    q:"What core boundary principle applies when friendship is used as leverage?",
    opts:[
      "Real friends respect your safety and your 'no'; using friendship to push risky choices is manipulation",
      "Strong friendships require meeting halfway on smaller risks so both people feel their loyalty is valued",
      "Apologizing briefly while refusing helps soften the tension so they do not feel judged for their choices",
      "Staying silent instead of saying no clearly keeps the friendship intact until they outgrow the phase"
    ],
    ans:0, pearl:"Healthy boundaries act as a filter: people who genuinely care about you respect your 'no' and your safety, whereas using guilt or threats to drop you is manipulation." },
  { id:"nav39", dept:"nav", tier:4, patient:"First Solo Clinic Appointment", complaint:"Freezing up and forgetting questions once the doctor walks in",
    vitals:"CO3 Health System Self-Advocacy",
    quote:"I am starting to see the doctor without my parent in the room, and I always blank out on my questions until after I leave the clinic.",
    q:"Which self-advocacy routine makes a short clinic visit most effective?",
    opts:[
      "Bring 2-3 written questions, ask for plain-language explanations, and confirm red-flag signs",
      "Let the doctor lead the entire appointment first and look up any confusing medical terms online afterward",
      "Save minor symptoms for a future visit so you do not take extra time away from the main complaint",
      "Memorize your full health history before entering so you appear confident and avoid reading off your phone"
    ],
    ans:0, pearl:"Bringing a 3-bullet note on your phone, asking 'Could you repeat that in plain words?', and asking 'What warning signs mean I should come back?' is a lifelong health-literacy skill." },
  { id:"nav40", dept:"nav", tier:4, patient:"Privacy Check on a Free Wellness App", complaint:"Tracking period and mood data in an unfamiliar free app",
    vitals:"CO3 + CO7 Digital Health Privacy",
    quote:"This free wellness app asks for my contacts and precise GPS location, and its terms mention sharing data with third-party ad partners.",
    q:"What is the smartest digital-health privacy decision before using the app?",
    opts:[
      "Check privacy terms, deny unnecessary GPS or contact access, and prefer trusted public-health tools",
      "Accept default permissions during setup so every feature works, then turn off location tracking later if needed",
      "Use the app freely as long as you sign up with a nickname instead of your full legal name and school email",
      "Assume free health apps listed in major app stores are already vetted under provincial hospital privacy laws"
    ],
    ans:0, pearl:"Most commercial wellness apps are not bound by hospital privacy rules. Protect sensitive health data by denying unnecessary permissions (like GPS or contacts) and sticking to reputable public-health or non-profit tools like YourHealthNS, MindShift CBT, or Kids Help Phone." }
);
