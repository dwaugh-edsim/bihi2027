/* ============================================================================
   ON-CALL: ROOM 8 CLINIC (GRADE 8) - Unit 1: The Junction Case Bank (39 Cases)
   Scenario questions grounded in HL8 Unit 1 (Sam & Rae: Exhibits 1, 2 & 3).
   24 Scenario MC (Tiers 1-4, incl. 2 Boss Cases) + 12 Interactive Challenges
   + 3 Written Evidence Chart Notes (jun_w1, jun_w2, jun_w3).
   Zero em/en dashes. Plain, speakable Grade 8 Nova Scotia health language.
   ============================================================================ */
window.ONCALL_CASES = window.ONCALL_CASES || [];
window.ONCALL_CHALLENGES = window.ONCALL_CHALLENGES || [];

window.ONCALL_CASES.push(
  /* ---------------- TIER 1: INTERN (6 cases) ---------------- */
  {
    id:"jun01", dept:"junction", tier:1, patient:"Sam, 13",
    complaint:"Tight, hot chest during a 10:38 PM group chat",
    vitals:"HR 108 | Grade 8 Squad chat: 40 members | 30-second countdown",
    quote:"Jayden just leaked Rae's private screenshot and gave me 30 seconds to pick a table. My chest went tight and hot before I could even think of one logical word.",
    q:"Which part of the brain fired that instant alarm before Sam could think?",
    opts:[
      "The amygdala, the brain's fast automatic smoke detector",
      "The prefrontal cortex, the brain's slow deliberate strategist",
      "The cerebellum, which controls balance and posture",
      "The digestive reflex, which only activates after 10:30 PM"
    ],
    ans:0,
    pearl:"The amygdala is the brain's smoke detector: fast, involuntary, and built for tigers in the woods, not 10:38 PM group chats."
  },
  {
    id:"jun02", dept:"junction", tier:1, patient:"Nora, 13",
    complaint:"Impulsive late-night clapback regret",
    vitals:"Screenshot already forwarded | Sleep disrupted",
    quote:"Someone called me fake in our class chat at 10:45 PM. I typed back an angry paragraph in four seconds, and now everyone has a screenshot of my reply.",
    q:"Why does the Junction unit call an instant angry clapback 'feeding the fire'?",
    opts:[
      "It hands the decision to the alarm and starts a chain reaction that lasts longer than the original post",
      "It shuts down the amygdala permanently so you can fall asleep faster",
      "It forces the group chat to go silent and fixes the conflict by morning",
      "It proves to the prefrontal cortex that you won the argument"
    ],
    ans:0,
    pearl:"Clapping back in four seconds puts the amygdala in charge. Screenshots last much longer than the heat of the moment and keep the chain reaction going."
  },
  {
    id:"jun03", dept:"junction", tier:1, patient:"Sam, 13",
    complaint:"Choosing the Third Option at 10:39 PM",
    vitals:"Thumb hovering over keyboard | Charger on probation",
    quote:"Jayden says if I sit with Rae I'm radioactive, and if I walk past Rae I betray my best friend. Instead of typing back, I put my phone face down in the kitchen downstairs.",
    q:"Why did Sam's 'Third Option' actually work?",
    opts:[
      "It gave the prefrontal cortex about 30 seconds of quiet to boot up and take the keys back from the alarm",
      "It deleted Jayden's screenshot from all 40 phones automatically",
      "It convinced Mom to let Sam keep the phone charger in the bedroom",
      "It distracted Sam so the problem disappeared completely by Wednesday"
    ],
    ans:0,
    pearl:"A grounding pause does not erase the problem; it buys the ~30 seconds your prefrontal cortex (the strategist) needs to take over from the reflex."
  },
  {
    id:"jun04", dept:"junction", tier:1, patient:"Eli, 13",
    complaint:"Doomscrolling to 'calm down' after a fight",
    vitals:"Screen time 11:45 PM | Heart rate still elevated",
    quote:"I didn't reply to the drama chat, so I scrolled TikTok and checked who was typing for an hour to calm myself down. Why do I feel even more wired?",
    q:"How does the Junction Strategy Matrix classify 'scrolling to calm down'?",
    opts:[
      "Feeding the fire: staying glued to the phone keeps the alarm lit and steals recovery sleep",
      "Stopping the chain: scrolling cools the amygdala in under ten seconds",
      "Assertive boundary setting: checking who is typing protects your reputation",
      "Triage: it deals with the most urgent fire first"
    ],
    ans:0,
    pearl:"Both the angry clapback and scrolling to calm down feed the fire. Moving the device out of reach is what lets the alarm actually stand down."
  },
  {
    id:"jun05", dept:"junction", tier:1, patient:"Maya, 13",
    complaint:"Understanding a 'tipping point' week",
    vitals:"Fatigue | Dropped pencil triggered tears in Period 3",
    quote:"I barely slept all week, my partner missed three days of our project, and my mom is working double shifts. Then I broke my pencil and almost lost it. Why did a pencil break me?",
    q:"In Exhibit 2, what actually causes a stack to tip?",
    opts:[
      "One more small thing lands when there is zero capacity left to hold it up",
      "The last event is always the biggest and most dangerous problem in the stack",
      "Telling someone about your stress makes the stack heavier",
      "A stack only tips if you forget to do a 30-second breathing pause"
    ],
    ans:0,
    pearl:"A tipping point is arithmetic, not drama: a stack falls when one more weight lands on a system that has no spare capacity left."
  },
  {
    id:"jun06", dept:"junction", tier:1, patient:"Owen, 14",
    complaint:"Friend offered 'sleeping pills' from an older teen",
    vitals:"School wellness check-in | Alert, worried",
    quote:"My friend hasn't slept in days and got two unmarked 'sleeping pills' from someone at the mall. They look normal, so my friend says they are safe.",
    q:"What is the accurate health description of pills that did not come from a doctor or pharmacy?",
    opts:[
      "Unregulated: nobody tested them, nobody knows the dose, and they can be cut with fentanyl",
      "Safe as long as the friend has taken regular sleeping pills before",
      "Low-risk because you can easily see fentanyl powder on the outside of a pill",
      "Prescription-grade if the person who gave them out meant well"
    ],
    ans:0,
    pearl:"Unregulated street or friend-supplied pills are untested and can contain lethal amounts of fentanyl. You cannot tell what is inside a pill by looking at it."
  },

  /* ---------------- TIER 2: RESIDENT (6 cases) ---------------- */
  {
    id:"jun07", dept:"junction", tier:2, patient:"Sam, 13",
    complaint:"Five days of nonstop stress alarm",
    vitals:"Headache, jaw tension, stomach ache | Sleep poor since Tuesday",
    quote:"The group chat froze on Tuesday, my project partner disappeared Wednesday, and I saw an overdue mortgage letter Friday morning. My body feels wrecked even when I'm just sitting in math.",
    q:"What is the clinical term for the physical toll on the body when the stress alarm stays on for days?",
    opts:[
      "Allostatic load",
      "Fight-or-flight reflex",
      "Circadian rebound",
      "Passive avoidance"
    ],
    ans:0,
    pearl:"Allostatic load is the wear-and-tear cost the body pays when the stress alarm stays stuck ON for days instead of shutting off after a brief threat."
  },
  {
    id:"jun08", dept:"junction", tier:2, patient:"Sam, 13",
    complaint:"Setting a clear boundary at dinner",
    vitals:"Friday 6:00 PM | Home financial worry + homework load",
    quote:"I broke the silence at dinner and told my mom: 'I saw the letter on the laptop. I can help with Friday shifts, but I can't do Thursdays because those are my homework nights.'",
    q:"Which boundary style did Sam just use?",
    opts:[
      "Assertive: calm, honest about the limit, and clear about what can be done",
      "Passive: hiding the truth and saying yes to every shift anyway",
      "Aggressive: blaming Mom for the mortgage letter and storming out",
      "Avoidant: refusing to speak about home or school all month"
    ],
    ans:0,
    pearl:"An assertive boundary names the line clearly and calmly, once, without attacking or collapsing. Sam's 'one true sentence' halved the weight of the secret."
  },
  {
    id:"jun09", dept:"junction", tier:2, patient:"Tessa, 13",
    complaint:"Comparing Exhibit 1 vs. Exhibit 2 coping",
    vitals:"Chronic 5-day stressor | Used 30-second pause only",
    quote:"I put my phone in the kitchen and took a 30-second pause just like we practiced, but I never emailed my teacher about my missing partner and I never talked to my parents. Why am I still overwhelmed?",
    q:"Why is a 30-second grounding pause helpful, yet not enough on its own for a 5-day Stuck Alarm?",
    opts:[
      "The pause cools a 30-second reflex, but a 5-day stack also needs triage and communication to actually remove weight",
      "The 30-second pause only works on Tuesdays and fails on Fridays",
      "Grounding pauses make allostatic load worse unless you scroll your phone first",
      "You should skip the pause completely whenever more than one problem exists"
    ],
    ans:0,
    pearl:"Exhibit 1 stops an instant reflex; Exhibit 2 requires the Fire Marshal (triage, a clear plan with a teacher, and one true sentence to an adult) to reduce the ongoing load."
  },
  {
    id:"jun10", dept:"junction", tier:2, patient:"Jordan, 14",
    complaint:"Knowing which secret to keep vs. break",
    vitals:"Hallway locker talk | Peer dilemma",
    quote:"My best friend told me two things today: (1) they have a huge crush on someone in 803, and (2) they are meeting older strangers tonight for pills to help them sleep. They made me swear not to tell anyone either one.",
    q:"How does the Junction unit separate these two secrets?",
    opts:[
      "The crush is an everyday secret (keep private); the underpass pill plan is a heavy secret (break immediately to a trusted adult)",
      "Both are everyday secrets because a best friend asked you to swear silence",
      "Both are heavy secrets that must be announced in the group chat",
      "Keep both quiet tonight and only tell an adult next week if something goes wrong"
    ],
    ans:0,
    pearl:"Everyday secrets protect privacy or feelings (keep them). Heavy secrets hide immediate danger to someone's body, health, or safety (break them right away)."
  },
  {
    id:"jun11", dept:"junction", tier:2, patient:"Sam, 13",
    complaint:"Friday 7:41 AM email from Mr. Hallett",
    vitals:"Math project due Monday 8:00 AM | Partner absent since Wednesday",
    quote:"Mr. Hallett emailed asking if I'm on track for Monday and said he can be flexible if something is going on. Meanwhile the group chat is cold and home is stressful.",
    q:"Using the Fire Marshal triage rule, what is Sam's smartest move before lunch?",
    opts:[
      "Reply to Mr. Hallett in writing with what is done, what is at risk, and what help is needed, because it has the Monday deadline",
      "Ignore the email until Sunday night at 11:30 PM and send a panicked apology",
      "Spend lunch trying to argue with Jayden's squad to fix the group chat first",
      "Hide the email and hand in a half-finished project without saying anything"
    ],
    ans:0,
    pearl:"Triage puts out the fire with the closest real deadline first. A calm, specific reply to a teacher gets flexibility; a cold group chat can wait."
  },
  {
    id:"jun12", dept:"junction", tier:2, patient:"Chloe, 13",
    complaint:"Built a wall that worked too well",
    vitals:"Home check-in | No adults know about school stress",
    quote:"Months ago I told my parents to stay completely out of my school stuff. Now I'm drowning in stress and nobody at home has asked me a single question all week.",
    q:"What Junction lesson does this wall illustrate?",
    opts:[
      "Walls you build for privacy can isolate you when you actually need help, so you have to break the silence with one true sentence",
      "Parents who stop asking questions do not care about their kids",
      "Keeping every problem secret from family lowers allostatic load",
      "Never ask for privacy at home because all boundaries are unhealthy"
    ],
    ans:0,
    pearl:"Be careful what you build a wall against - sometimes it works too well. Sharing even one true sentence lets a trusted adult carry a corner of the load."
  },

  /* ---------------- TIER 3: ATTENDING (6 cases) ---------------- */
  {
    id:"jun13", dept:"junction", tier:3, patient:"Rae, 13",
    complaint:"The Loyalty Bind at the back bike racks",
    vitals:"Monday 3:15 PM | 3 days no sleep | Shaking hands",
    quote:"Rae grabs my sleeve and says: 'Swear you won't tell anyone I'm going to the underpass tonight for pills. If you go to a teacher or my parents, you're dead to me.'",
    q:"Why does the Junction unit call this exact moment 'The Loyalty Bind'?",
    opts:[
      "It forces a false choice between keeping a friend happy right now and keeping that friend alive and safe",
      "It proves that loyal friends never talk to guidance counsellors",
      "It means Rae is angry at Sam for sitting beside them in Homeroom",
      "It is a normal everyday secret that only feels heavy because of the cold weather"
    ],
    ans:0,
    pearl:"The Loyalty Bind is like watching smoke pour out of a window and promising not to call the fire department. Real loyalty protects people, not dangerous secrets."
  },
  {
    id:"jun14", dept:"junction", tier:3, patient:"Sam, 13",
    complaint:"First words to a panicking friend",
    vitals:"Bike racks | High emotional escalation | Bus bell in 5 min",
    quote:"Rae is crying and terrified about walking back into school after the leaked screenshot. I know I cannot keep the underpass secret, but I don't want Rae to bolt.",
    q:"Which response uses Active Listening BEFORE setting the safety boundary?",
    opts:[
      "'Rae, you haven't slept in three days and you're exhausted from facing this alone. I care too much to let you go there tonight - I'll walk with you to Guidance right now.'",
      "'You're being crazy and stupid. Hand over your phone or I'm texting your dad right now.'",
      "'You'll be fine, just get some sleep and stop being dramatic about a group chat.'",
      "'Fine, I swear I won't tell anyone, just text me when you get home safe.'"
    ],
    ans:0,
    pearl:"Active listening mirrors the real emotion without agreeing to the dangerous plan, lowering panic so the Supported Adult Bridge can actually work."
  },
  {
    id:"jun15", dept:"junction", tier:3, patient:"Devon, 14",
    complaint:"Passive Trap vs. Aggressive Snap",
    vitals:"Peer crisis debrief | School counsellor office",
    quote:"When my friend admitted they were taking unregulated pills, I froze and promised not to tell, then stared at my ceiling all night terrified. My other friend yelled at them and stormed off.",
    q:"What do the Passive Trap and the Aggressive Snap have in common in Exhibit 3?",
    opts:[
      "Both are alarm-driven reflexes that leave the friend alone in danger and let the fire spread",
      "Both count as assertive boundaries because they protect your own peace",
      "The Passive Trap keeps the friendship strong while the Aggressive Snap fixes the pill risk",
      "Both automatically bring a trusted adult into the room"
    ],
    ans:0,
    pearl:"Swearing silence (Passive Trap) and yelling/storming off (Aggressive Snap) are both reflex moves. The strategist pauses, listens, and builds a Supported Adult Bridge."
  },
  {
    id:"jun16", dept:"junction", tier:3, patient:"Liam, 13",
    complaint:"How a Supported Adult Bridge works",
    vitals:"3:15 PM before buses depart | Guidance & Coach still on site",
    quote:"My friend is furious that I won't keep their dangerous secret. If I have to tell a trusted adult, how do I do it without making them feel abandoned?",
    q:"What makes a 'Supported Adult Bridge' different from just reporting someone behind their back?",
    opts:[
      "You state the safety line calmly and offer to walk with them to Guidance, a coach, or a parent together so they are not facing it alone",
      "You post about it in the class group chat so everyone knows to watch out",
      "You wait until they give you written permission before telling any adult",
      "You tell them you are ending the friendship so the adult takes over"
    ],
    ans:0,
    pearl:"'I am not keeping this quiet, and you are not walking into this alone: I will walk with you to Guidance or Coach right now.' And if they still refuse to walk with you, you still tell the adult immediately."
  },
  {
    id:"jun17", dept:"junction", tier:3, patient:"Avery, 13",
    complaint:"Silent treatment in the cafeteria",
    vitals:"Wednesday & Thursday | 40 kids quiet in group chat",
    quote:"After I quietly sat beside my targeted friend in Homeroom, the squad didn't yell - they just went totally silent and turned their shoulders away. Should I write a long speech defending myself in the chat?",
    q:"What did Sam learn about handling a cold, silent group chat?",
    opts:[
      "Do not clap back or write defensive speeches: show up calmly, protect your energy, and let the chat thaw on its own",
      "Write a 10-paragraph message calling out every member of the squad",
      "Apologize to Jayden and stop sitting with your friend so the chat warms up",
      "Screenshot your friend's new messages to prove you belong in the squad"
    ],
    ans:0,
    pearl:"Silence was the squad's punishment, and refusing to feed it took away its fuel. By Monday, the shoulders stopped turning away and Sam kept both integrity and focus."
  },
  {
    id:"jun18", dept:"junction", tier:3, patient:"Priya, 14",
    complaint:"Choosing a 'trusted adult' in a crisis",
    vitals:"After-school safety planning | Nova Scotia youth options",
    quote:"I need to break a heavy secret about a friend who says they aren't going home tonight, and my own parents aren't answering their phone yet.",
    q:"Which option best matches the Junction definition of a trusted adult or immediate support?",
    opts:[
      "A school guidance counsellor, coach, teacher, principal, or calling/texting 988 or Kids Help Phone (text CONNECT to 686868)",
      "An older teenager in the group chat who promises to handle it privately",
      "Waiting until tomorrow morning's first period so you don't interrupt anyone",
      "Posting an anonymous poll on social media asking what to do"
    ],
    ans:0,
    pearl:"A trusted adult is someone whose job is to help, not just to tell you off. If a parent isn't reachable right away, go to school staff on site or contact 988 / Kids Help Phone / 911 for immediate danger."
  },

  /* ---------------- TIER 4: CHIEF OF MEDICINE (6 cases, incl. 2 BOSS CASES) ---------------- */
  {
    id:"jun19", dept:"junction", tier:4, patient:"Sam, 13",
    complaint:"Full-week stress physiology audit",
    vitals:"Tuesday 10:38 PM -> Monday 8:00 AM | Recovery check",
    quote:"By Monday morning my math project is handed in and I'm tired, but it feels like ordinary tired instead of that sick, chest-tight dread I had all week. What changed biologically?",
    q:"What explains the shift from Friday's breakdown feeling to Monday's 'ordinary tired'?",
    opts:[
      "Triage and sharing the load shut down the chronic stress alarm, dropping allostatic load back to normal recovery fatigue",
      "The amygdala stopped working permanently after Friday afternoon",
      "Sam's body built immunity to sleep deprivation over the weekend",
      "Ignoring the mortgage letter completely erased all stress hormones"
    ],
    ans:0,
    pearl:"Hard work causes ordinary tiredness; carrying unspoken fires alone keeps the alarm pinned ON (allostatic load). Putting out one fire at a time and sharing the weight lets the body recover."
  },
  {
    id:"jun20", dept:"junction", tier:4, patient:"Marcus, 14",
    complaint:"Why well-meaning friends still create fentanyl risk",
    vitals:"Harm-reduction consult | Street 'sleep' tablets",
    quote:"My friend swore the pills came from a cousin's friend who 'never sells bad stuff' and only meant to help me sleep. Why is intent not protection?",
    q:"What is the critical toxicology fact behind unregulated pills?",
    opts:[
      "Counterfeit pills are pressed without quality control; even a grain-sized hot spot of fentanyl can stop breathing regardless of the friend's intent",
      "Fentanyl only appears in illegal street powders, never in tablets that look like pharmacy pills",
      "Splitting an unregulated pill in half guarantees the dose is cut evenly in half",
      "A person who means well can taste or smell fentanyl before handing the pill over"
    ],
    ans:0,
    pearl:"Unregulated pills can have uneven 'hot spots' of fentanyl invisible to the naked eye. Good intentions from a friend cannot test a pill or prevent an overdose."
  },
  {
    id:"jun21", dept:"junction", tier:4, patient:"Kieran, 14",
    complaint:"Boundary script audit under pressure",
    vitals:"Group project + shift conflict + peer pressure",
    quote:"I tried setting a boundary by saying: 'Maybe I might not be able to do Thursday unless you really need me, sorry, I'm the worst, never mind I'll just do it.' Why did nothing change?",
    q:"Why did Kieran's boundary fail, and how does an assertive Junction script fix it?",
    opts:[
      "Apologizing and taking it back turns it passive; an assertive boundary states the limit clearly once, offers what IS possible, and stops over-explaining",
      "Kieran needed to yell louder so the other person felt guilty",
      "Boundaries only work if you send them in a 40-person group chat",
      "Never state what you CAN do - only say no and walk away forever"
    ],
    ans:0,
    pearl:"Over-apologizing and walking back your limit invites people to step right over it. Name the line once, calmly, state what you can do, and stop explaining."
  },
  {
    id:"jun22", dept:"junction", tier:4, patient:"Sienna, 13",
    complaint:"Friend refuses to walk to Guidance together",
    vitals:"3:20 PM | Friend threatening to run away tonight | Refusing help",
    quote:"I used Active Listening and offered to walk with my friend to Guidance, just like the Supported Adult Bridge. They yelled 'NO!' and walked away toward the street. What now?",
    q:"When a friend refuses the Supported Adult Bridge in an immediate safety crisis, what is the strategist's next step?",
    opts:[
      "Go straight to Guidance, the office, or a trusted adult yourself right now anyway - their safety still outweighs their anger",
      "Respect their refusal and keep the secret until tomorrow morning",
      "Chase them down and argue until they promise to change their mind",
      "Text the group chat asking if anyone else wants to deal with it"
    ],
    ans:0,
    pearl:"Walking together is Plan A because it reduces fear. If your friend refuses to come with you in a heavy-secret emergency, Plan B is still going to a trusted adult immediately."
  },
  {
    id:"jun23", dept:"junction", tier:4, boss:true, patient:"BOSS CASE: Friday 7:41 AM Meltdown",
    complaint:"4 simultaneous fires + 90 seconds to the bell",
    vitals:"BOSS CASE (2X PTS) | 5-day allostatic load | Deadline Monday 8 AM",
    quote:"Sam has 90 seconds before the bell: (1) 40-person chat is silent, (2) overdue mortgage email at home, (3) missing project partner + Mr. Hallett's email, (4) jaw clenched and chest tight.",
    q:"Pick the ONLY complete Fire Marshal sequence that handles the Tipping Point without feeding any fire:",
    opts:[
      "Take 30 seconds to boot the strategist -> email Mr. Hallett a clear plan before lunch (deadline fire) -> tell Mom one true sentence + clear shift boundary at dinner -> leave the cold chat alone",
      "Clap back in the group chat before the bell -> skip lunch to do the whole project in secret -> hide the mortgage email so Mom doesn't worry",
      "Put the phone in the kitchen for 30 seconds -> wait until Monday morning to see if the partner shows up -> stay quiet at home",
      "Tell Mr. Hallett every private family financial detail -> drop out of Homeroom -> scroll social media to lower heart rate"
    ],
    ans:0,
    pearl:"Boss Case cleared! 30-second boot -> triage the deadline fire in writing -> one true assertive sentence at home -> starve the cold group chat of fuel."
  },
  {
    id:"jun24", dept:"junction", tier:4, boss:true, patient:"BOSS CASE: 3:15 PM Bike Racks Crisis",
    complaint:"Heavy Secret + Loyalty Bind + Unregulated Pills",
    vitals:"BOSS CASE (2X PTS) | Immediate danger tonight at 11 PM | Friend panicking",
    quote:"Rae hasn't slept in 3 days, plans to meet older teens at the highway underpass tonight for 'sleeping pills,' and begs you to swear silence or 'you're dead to me.'",
    q:"Pick the ONLY complete Chief-of-Medicine response that breaks the Loyalty Bind safely:",
    opts:[
      "Pause 30 seconds -> mirror Rae's exhaustion without agreeing to the plan (Active Listening) -> state calmly that real friendship protects safety, not dangerous secrets -> offer to walk together to Guidance/Coach right now (and tell an adult even if Rae refuses)",
      "Promise not to tell an adult tonight, then secretly follow Rae to the underpass at 11 PM to make sure the pills look safe",
      "Snap at Rae for being reckless, take a photo of the messages, and send it to the Grade 8 group chat so everyone pressures Rae to go home",
      "Tell Rae 'you'll be fine, just sleep it off' and wait to check in at Homeroom tomorrow morning"
    ],
    ans:0,
    pearl:"Boss Case cleared! Keeping a friend alive beats keeping a promise of silence. Pause, listen actively, hold the safety line, and build the Supported Adult Bridge."
  }
);

window.ONCALL_CHALLENGES.push(
  /* ---------------- INTERACTIVE CHALLENGES (12) ---------------- */
  {
    id:"junc01", dept:"junction", tier:1, kind:"triage",
    patient:"Triage Board - Exhibit 1 Moves",
    complaint:"10:38 PM Group Chat Strategy Matrix",
    vitals:"Feeds the Fire vs. Stops the Chain",
    quote:"Two moves start a chain reaction. One move stops one.",
    q:"Sort each Exhibit 1 move into whether it FEEDS THE FIRE or STOPS THE CHAIN.",
    buckets:["Feeds the Fire", "Stops the Chain"],
    rows:[
      { t:"Firing back an angry clapback at 10:47 PM", ans:0 },
      { t:"Putting the phone face down in the kitchen downstairs", ans:1 },
      { t:"Scrolling the chat for an hour to 'calm down'", ans:0 },
      { t:"Taking a 30-second grounding pause before deciding", ans:1 }
    ],
    pearl:"Clapbacks and late-night scrolling keep the amygdala lit. Distance from the phone plus a 30-second pause hands the keys back to the strategist."
  },
  {
    id:"junc02", dept:"junction", tier:1, kind:"slider",
    patient:"Clinical Dial - Brain Boot Time",
    complaint:"Prefrontal Cortex vs. Amygdala Hand-off",
    vitals:"Exhibit 1 Brain Science | Seconds to boot up",
    quote:"The amygdala fires in milliseconds. The prefrontal cortex (the strategist) is deliberate and voluntary, but it needs time to warm up.",
    q:"Set the dial to about how many seconds the prefrontal cortex needs to boot up during a grounding pause.",
    min:5, max:120, step:5, target:30, tol:10, unit:"seconds",
    pearl:"About 30 seconds of quiet (a grounding pause) is all it takes for the prefrontal cortex to boot up and take deliberate control back from the alarm."
  },
  {
    id:"junc03", dept:"junction", tier:1, kind:"myth",
    patient:"Secret Audit - Everyday vs. Heavy",
    complaint:"When must a secret be broken?",
    vitals:"TRUE = Heavy Secret (Break Now) | FALSE = Everyday Secret (Keep Private)",
    quote:"Not all secrets carry the same weight. Some protect privacy; others hide danger.",
    q:"Mark TRUE if it is a HEAVY SECRET you must break to a trusted adult, or FALSE if it is an EVERYDAY SECRET to keep private.",
    myths:[
      { t:"A friend tells you who they have a crush on in 802.", ans:false },
      { t:"A friend says they are meeting strangers tonight for unmarked sleeping pills.", ans:true },
      { t:"A friend is embarrassed about getting 58% on a math quiz.", ans:false },
      { t:"A friend says they are not going home tonight and don't feel safe.", ans:true }
    ],
    pearl:"Everyday secrets protect feelings or privacy (keep them). Heavy secrets involve immediate danger to body, health, or safety (break them immediately)."
  },
  {
    id:"junc04", dept:"junction", tier:2, kind:"match",
    patient:"Brain & Stress Vocabulary Match",
    complaint:"Unit 1 Junction Core Glossary",
    vitals:"HL8 Outcome 1 | Key Terms",
    quote:"Knowing the right name for what your brain is doing makes it much easier to steer.",
    q:"Match each Junction term on the left to its exact job on the right.",
    pairs:[
      { left:"Amygdala", right:"The fast, automatic 'smoke detector' built for real threats" },
      { left:"Prefrontal cortex", right:"The slow 'strategist' that needs ~30 seconds to take control" },
      { left:"Allostatic load", right:"The running physical toll of keeping the alarm on for days" },
      { left:"Tipping point", right:"When one more thing lands on a stack with zero capacity left" }
    ],
    pearl:"Amygdala = smoke detector; Prefrontal cortex = strategist; Allostatic load = chronic alarm cost; Tipping point = full stack tipping over."
  },
  {
    id:"junc05", dept:"junction", tier:2, kind:"triage",
    patient:"Fire Marshal Triage - Friday Morning",
    complaint:"3 Fires Burning at Once (Exhibit 2)",
    vitals:"Deadline Fire | Home Weight | Cold Group Chat",
    quote:"You cannot put out three fires at the exact same second. Triage means picking the right move for each one.",
    q:"Assign each Friday fire to the right Fire Marshal action.",
    buckets:["Put Out First Today", "One True Sentence at Home", "Let It Wait / No Fuel"],
    rows:[
      { t:"Mr. Hallett's email about the Monday 8 AM math project", ans:0 },
      { t:"40-person group chat giving Sam the silent treatment", ans:2 },
      { t:"Mom working extra shifts and the overdue mortgage letter", ans:1 },
      { t:"Missing partner's unfinished section due Monday morning", ans:0 }
    ],
    pearl:"Deadline fires (Monday project + teacher email) come first; home stress gets one true assertive sentence; a cold group chat gets zero fuel."
  },
  {
    id:"junc06", dept:"junction", tier:2, kind:"order",
    patient:"Protocol Sequence - Exhibit 1 Pause",
    complaint:"Stopping a 10:38 PM Chain Reaction",
    vitals:"Order Steps 1 to 4",
    quote:"When the group chat blows up at night, the order of your moves determines whether you feed the fire or stop it.",
    q:"Put Sam's Exhibit 1 strategist sequence in order from Step 1 to Step 4.",
    steps:[
      "Notice the tight, hot chest as the amygdala alarm firing",
      "Stop typing and move the phone face down out of the bedroom",
      "Take 30 seconds of quiet so the prefrontal cortex boots up",
      "Show up calmly at school tomorrow and sit beside your friend without a speech"
    ],
    pearl:"Spot the alarm -> create physical distance from the phone -> wait 30 seconds for the strategist -> act calmly in real life."
  },
  {
    id:"junc07", dept:"junction", tier:2, kind:"match",
    patient:"Boundary Style Diagnostic",
    complaint:"4 Ways People Respond Under Pressure",
    vitals:"Passive | Aggressive | Assertive | Supported Adult Bridge",
    quote:"How you say your line changes whether people hear you or escalate.",
    q:"Match each real-life quote on the left to the communication style on the right.",
    pairs:[
      { left:"'Fine, I'll take every shift and won't say a word.'", right:"Passive (hides needs, carries everything alone)" },
      { left:"'You're crazy and stupid - leave me alone!'", right:"Aggressive (attacks the person, escalates conflict)" },
      { left:"'I can't do Thursday; here's what I can do by Monday.'", right:"Assertive (clear, calm limit + realistic plan)" },
      { left:"'I can't keep this secret, so I'll walk with you to Guidance.'", right:"Supported Adult Bridge (holds safety line together)" }
    ],
    pearl:"Assertive boundaries and the Supported Adult Bridge keep you calm, clear, and safe without collapsing or attacking."
  },
  {
    id:"junc08", dept:"junction", tier:3, kind:"rx",
    patient:"Chart Orders - Sam's Tipping Point",
    complaint:"Friday Recovery Plan (Select ALL Correct Orders)",
    vitals:"Allostatic load high | Multiple stressors stacked",
    quote:"Sam needs a realistic Friday plan that actually removes weight from the stack.",
    q:"Select ALL orders that belong in Sam's Friday Fire Marshal plan (skip traps).",
    items:[
      { t:"Email Mr. Hallett before lunch with what is done and what is at risk", ok:true },
      { t:"Share one true sentence with Mom plus a clear shift boundary", ok:true },
      { t:"Send a furious midnight clapback to Jayden's group chat", ok:false },
      { t:"Let the cold group chat thaw or freeze on its own without feeding it", ok:true },
      { t:"Hide the missing partner from the teacher and pull an all-nighter alone", ok:false }
    ],
    pearl:"A real triage plan removes weight: communicate early with the teacher, share one true sentence at home, and starve the chat drama."
  },
  {
    id:"junc09", dept:"junction", tier:3, kind:"order",
    patient:"Protocol Sequence - Exhibit 3 Crisis",
    complaint:"Breaking the Loyalty Bind Safely",
    vitals:"Order Steps 1 to 4 | Back Bike Racks 3:15 PM",
    quote:"Rae is shaking, exhausted, and about to meet strangers for unregulated pills.",
    q:"Put Sam's Exhibit 3 strategist protocol in order from Step 1 to Step 4.",
    steps:[
      "Take 30 seconds to calm your own alarm instead of snapping or swearing silence",
      "Use Active Listening to mirror Rae's exhaustion and fear without judging",
      "State the boundary calmly: real friendship protects safety, not dangerous secrets",
      "Offer the Supported Adult Bridge: walk together to Guidance or Coach right now"
    ],
    pearl:"Pause -> Active Listening -> Calm Safety Boundary -> Supported Adult Bridge. Every step lowers panic while keeping Rae safe."
  },
  {
    id:"junc10", dept:"junction", tier:3, kind:"myth",
    patient:"Myth Bust - Stress & Street Pills",
    complaint:"Fact-Check 4 Common Middle-School Claims",
    vitals:"TRUE or FALSE",
    quote:"Bad advice spreads fast in hallways and group chats. Check each claim carefully.",
    q:"Mark each statement TRUE or FALSE.",
    myths:[
      { t:"You can tell if a street pill has fentanyl by checking its colour and shape.", ans:false },
      { t:"Telling a trusted adult about a friend in immediate danger is loyalty, not betrayal.", ans:true },
      { t:"A 30-second grounding pause erases a 5-day allostatic load all by itself.", ans:false },
      { t:"Saying 'You'll be fine, stop stressing' is an effective example of Active Listening.", ans:false }
    ],
    pearl:"Fentanyl is invisible; breaking a heavy secret is real loyalty; a 5-day load needs triage + help; brush-offs are NOT active listening."
  },
  {
    id:"junc11", dept:"junction", tier:3, kind:"rx",
    patient:"Chart Orders - Supporting Rae",
    complaint:"What Helps at the Bike Racks (Select ALL Correct)",
    vitals:"High distress | Heavy secret disclosed",
    quote:"Choose every action that genuinely protects Rae without escalating the crisis.",
    q:"Select ALL clinically sound actions for supporting a friend in a Heavy Secret crisis.",
    items:[
      { t:"Mirror their real feelings calmly ('You haven't slept in days and you're exhausted')", ok:true },
      { t:"Refuse to promise silence when immediate physical safety is at risk", ok:true },
      { t:"Offer to walk with them to Guidance, a coach, or a parent so they aren't alone", ok:true },
      { t:"Swear to keep the secret for 24 hours to prove you are a loyal friend", ok:false },
      { t:"Yell at them for being reckless and walk away to cool off", ok:false }
    ],
    pearl:"Active listening + honest safety boundary + walking together to a trusted adult is the gold-standard response."
  },
  {
    id:"junc12", dept:"junction", tier:4, kind:"esc",
    patient:"Escalation Call - Highway Underpass Plan",
    complaint:"Friend taking unregulated pills + refusing to go home",
    vitals:"Immediate safety risk tonight at 11 PM | Unregulated supply",
    quote:"My friend says they got 'sleeping pills' from older teens they met online and are refusing to go home tonight. They begged me not to tell anyone.",
    q:"Decide: SEND HOME (handle privately) or ESCALATE NOW (trusted adult / emergency support), AND pick the clinical reason.",
    decision:"admit",
    reasons:[
      { t:"Heavy secret with immediate safety and fentanyl/overdose risk - break silence to a trusted adult or 988/911 right now.", ok:true },
      { t:"Everyday secret - keep your promise tonight and check in with them at school tomorrow.", ok:false },
      { t:"Low risk because the pills are only meant to help them sleep after a hard week.", ok:false }
    ],
    pearl:"Escalate immediately. Unregulated pills carry invisible fentanyl/overdose risk, and refusing to go home is an immediate safety emergency."
  },

  /* ---------------- WRITTEN EVIDENCE CHART NOTES (3) ---------------- */
  {
    id:"jun_w1", dept:"junction", tier:2, kind:"write", minWords:12,
    patient:"Junction Note #1 - Stuck Alarm vs. Fire Marshal",
    complaint:"Exhibit 1 strategy used on an Exhibit 2 week",
    vitals:"HL8 Unit 1 Evidence | Written Chart Note",
    quote:"Sam puts the phone in the kitchen and takes a 30-second pause on Friday, then changes nothing else.",
    q:"In 1 to 2 complete sentences, explain why a 30-second pause helps a little but is not enough for a 5-day Stuck Alarm, and name one Fire Marshal step Sam should add.",
    pearl:"Strong answer: The 30-second pause cools an instant amygdala reflex, but a 5-day allostatic load needs triage - like emailing Mr. Hallett a clear plan or sharing one true sentence at home to actually remove weight."
  },
  {
    id:"jun_w2", dept:"junction", tier:2, kind:"write", minWords:12,
    patient:"Junction Note #2 - Fire Marshal Triage",
    complaint:"3 fires lit on Friday morning",
    vitals:"HL8 Unit 1 Evidence | Written Chart Note",
    quote:"Mr. Hallett's email arrives (project due Monday, partner missing), while the group chat is frozen and home is stressful.",
    q:"In 1 to 2 complete sentences, name the ONE fire Sam should put out first today, explain why, and say what Sam should do about the cold group chat.",
    pearl:"Strong answer: Put out the math project fire first by replying to Mr. Hallett before lunch because it has a real Monday deadline, and leave the cold group chat alone so it gets zero fuel."
  },
  {
    id:"jun_w3", dept:"junction", tier:3, kind:"write", minWords:12,
    patient:"Junction Note #3 - Breaking a Heavy Secret",
    complaint:"Friend taking unregulated pills & demanding silence",
    vitals:"HL8 Unit 1 Evidence | Written Chart Note",
    quote:"Rae tells you about meeting older teens for unregulated 'sleeping pills' and says 'Swear you won't tell anyone or you're dead to me.'",
    q:"In 1 to 2 complete sentences, write what you would actually say to Rae (Active Listening + Supported Adult Bridge) and explain why telling a trusted adult is loyalty, not betrayal.",
    pearl:"Strong answer: 'You haven't slept in days and you're exhausted, but I care too much to let you take unregulated pills - I'll walk with you to Guidance right now.' Telling a trusted adult is loyalty because keeping a friend safe matters more than keeping a dangerous secret."
  }
);
