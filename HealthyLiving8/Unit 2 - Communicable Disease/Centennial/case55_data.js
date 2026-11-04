/* ============================================================================
   CASE 55: CENTENNIAL OUTBREAK - story/field data for the sim.
   Edit CONTENT here; the engine lives in index.html.
   Audience: Grade 8 (~12-13). Short sentences, plain words, terms glossed inline.
   House rule for this unit: no em dashes / en dashes in student-facing strings.
   Images are local: assets/<name>.png (generated with the Qwen engine, 2026-11-04).
   ============================================================================ */

var CASE55 = {
  meta: {
    title: "CASE 55: CENTENNIAL OUTBREAK",
    subtitle: "An outbreak investigation at Centennial Junior High",
    hud: "OUTBREAK HUD // CASE 55",
    taskName: "HL8-Centennial-Case55-Sim"
  },

  /* Dossier characters. img = portrait asset; quote = what they say at that station. */
  characters: {
    vp:      { name: "Vice-Principal Priya Raman", role: "Incident lead, Centennial Junior High", img: "assets/char_vp_raman.png" },
    jayden:  { name: "Jayden", role: "Grade 8, West Wing", img: "assets/char_jayden.png" },
    sophie:  { name: "Sophie", role: "Grade 7, duck trader", img: "assets/char_sophie.png" },
    marcus:  { name: "Marcus", role: "Grade 9, weakened immune system", img: "assets/char_marcus.png" },
    nurse:   { name: "School Nurse", role: "Toolkit briefings", img: null },
    boudreau:{ name: "Mr. Boudreau", role: "Custodian", img: null }
  },

  stations: [
    /* ---------------- S0 BRIEFING ---------------- */
    {
      id: "s0", nav: "BRIEFING", title: "Friday, 3:15 PM at Centennial Junior High",
      kicker: "The dispatch",
      imgs: [{ src: "assets/case55_cover.png", cap: "Centennial Junior High, Friday afternoon. The main office is swamped." }],
      chars: [ { key: "vp", quote: "Friday, 3:15 PM. Fifty-five of our four hundred kids are home sick and the phones won't stop. I need a Monday-morning plan before doors open. You're the investigator - read the board, talk to my people, bring me something I can act on." } ],
      tabs: {
        dispatch: `<p>You are the <strong>outbreak investigator</strong> called in to Centennial Junior High. Vice-Principal Raman needs a plan for Monday morning.</p>
<p>Your job: read the evidence as it comes in, make calls, and defend a Monday plan. Work through the stations on the left. Everything you type <strong>saves automatically to the server</strong>, so you can close the tab and come back anytime - on any computer.</p>`,
        evidence: `<p><strong>Sick students home each day:</strong> Mon 3, Tue 7, Wed 18, Thu 34, <strong>Fri 55</strong> - that's about <strong>1 in 7 students</strong> (14% of the school).</p>
<p>Worried parents are calling clinics asking for <strong>antibiotics</strong> (like penicillin). One student in the building is getting <strong>cancer treatment</strong>, so their immune system is weak.</p>
<p>The principal needs answers and a <strong>Monday Morning Game Plan</strong>.</p>`,
        toolkit: `<p><strong>How to play:</strong> click a station on the left to ride the sidewalk. Answer in the <strong>Investigation Log</strong> on the right. Your answers save by themselves. You can go back to any station you've visited.</p>`
      },
      task: "Read the briefing, meet VP Raman, then press READY to start the investigation.",
      fields: [ { type: "ack", label: "READY - START THE INVESTIGATION" } ]
    },

    /* ---------------- S1 EVIDENCE BOARD ---------------- */
    {
      id: "s1", nav: "STATION 01", title: "The Evidence Board: symptoms and map",
      kicker: "Where and how it hit",
      imgs: [{ src: "assets/s1_evidence_board.png", cap: "The office evidence board: symptom log, floor plan, hotspots, and the Mon-Fri surge." }],
      chars: [ { key: "vp", quote: "Stomach, not lungs - under five percent have a cough. And it started in the Grade 8 west wing on Monday. Watch the map." } ],
      tabs: {
        dispatch: `<p><strong>Symptom profile (55 sick students):</strong></p>
<ul><li><strong>88%</strong> sudden stomach cramps, vomiting, watery diarrhea.</li>
<li><strong>45%</strong> mild low fever and headache.</li>
<li><strong>Under 5%</strong> cough, sore throat, or stuffy nose.</li>
<li>Most start feeling better after <strong>24 to 48 hours</strong>.</li></ul>`,
        evidence: `<p><strong>Where sick students clustered:</strong></p>
<ul><li><strong>Grade 8 West Wing: 18 cases</strong> - ground zero on Monday.</li>
<li><strong>Grade 7 East: 12</strong> and <strong>Grade 9 North: 8</strong> - separate wings, hit hard by Wednesday.</li>
<li>Shared zones: <strong>cafeteria lunch line: 9</strong>, <strong>computer lab: 5</strong>.</li></ul>`,
        toolkit: `<p>Think: a <strong>lung</strong> virus (like the flu) gives cough and fever. A <strong>stomach</strong> virus gives vomiting and diarrhea. Which one fits this board?</p>`
      },
      task: "Look at the symptoms and the map. Then make your first call: which body system is under attack?",
      fields: [
        { type: "choice", f: "judgments.s1.choice", label: "Which body system is under attack?", options: ["Stomach (gastrointestinal)", "Lungs (respiratory)", "Not sure yet"] },
        { type: "text", f: "judgments.s1.why", label: "Give one clue from the board that proves your pick.", rows: 2, placeholder: "Example: most kids have..." }
      ]
    },

    /* ---------------- S2 TWO CLUES ---------------- */
    {
      id: "s2", nav: "STATION 02", title: "Two strange clues: the fountain and the ducks",
      kicker: "What happened Wednesday",
      imgs: [{ src: "assets/s2_fountain_ducks.png", cap: "Left: the west-wing fountain cleanup. Right: resin ducks traded at the lockers before lunch." }],
      chars: [
        { key: "jayden", quote: "Wednesday I was at the west-wing fountain when a kid threw up right beside it. Mr. Boudreau mopped fast, but with just warm water and floor soap." },
        { key: "sophie", quote: "Everyone's been trading these little resin ducks at the lockers all week - right before we go in for lunch. I traded mine to three people on Thursday." }
      ],
      tabs: {
        dispatch: `<p><strong>Clue 1 - the water fountain spill:</strong> a student suddenly threw up near the Grade 8 hallway drinking fountain. Throwing up launches tiny <strong>droplets</strong> into the air and onto taps and tiles. It was mopped with <strong>plain warm water and regular floor soap</strong> - not bleach.</p>
<p><strong>Clue 2 - the resin duck craze:</strong> all week, students in Grades 7, 8, and 9 have traded tiny plastic <strong>resin ducks</strong> hand to hand at the lockers, right before walking into the cafeteria to eat lunch.</p>`,
        evidence: `<p>A stomach virus can live on hard plastic and metal taps for <strong>days</strong>. Hands and objects carry it from place to place.</p>`,
        toolkit: `<p>Hold both clues in your head. They explain how one germ jumped across all three grades.</p>`
      },
      task: "Two clues, one outbreak. Which clue is the bigger spreader across all three grades - and why?",
      fields: [
        { type: "choice", f: "judgments.s2.top", label: "Which clue spreads it across all three grades the most?", options: ["The fountain spill", "The resin ducks", "Both about the same"] },
        { type: "text", f: "judgments.s2.why", label: "Why? Use evidence.", rows: 2, placeholder: "Think about droplets, taps, hands, and ducks..." }
      ]
    },

    /* ---------------- S3 TOOLKIT A ---------------- */
    {
      id: "s3", nav: "STATION 03", title: "Toolkit A: how germs get into your body",
      kicker: "The 4 entry gates + the hand trick",
      imgs: [{ src: "assets/s3_entry_gates.png", cap: "The four doorways germs use: mouth, nose, eyes, and cuts or scrapes - plus hands picking up germs from a keyboard." }],
      chars: [ { key: "nurse", quote: "Germs can't soak through healthy skin, but your hands are a delivery truck. Touch a shared keyboard, then your mouth - that's the trip." } ],
      tabs: {
        dispatch: `<p>Germs need a <strong>doorway</strong> into your body. There are four:</p>
<ul><li><strong>Mouth</strong> - swallowing germs on food, snacks, chewed pens, or dirty fingers.</li>
<li><strong>Nose</strong> - breathing in tiny droplets after someone coughs or sneezes.</li>
<li><strong>Eyes</strong> - rubbing eyes with fingers that touched shared surfaces.</li>
<li><strong>Cuts or scrapes</strong> - germs slip past broken skin (scrapes, hangnails, bug bites).</li></ul>`,
        evidence: `<p><strong>Match each school moment</strong> (below) to its entry gate and germ type. Viruses cause colds, flu, and stomach bugs. Bacteria are living cells that cause strep throat, food poisoning, and infected scrapes.</p>`,
        toolkit: `<p><strong>The skin paradox:</strong> healthy skin is a locked wall - germs cannot soak through it. But teens touch shared surfaces dozens of times an hour, and touch their eyes, nose, mouth, or food over 20 times an hour without noticing. That's how hands make us sick.</p>`
      },
      task: "Match the four school moments to an entry gate and a germ type. Then explain the two steps of how hands get germs inside you.",
      fields: [
        { type: "pair", f: "matches.a1", label: "1. Trading resin ducks, then eating a snack without washing hands.",
          selects: [ { key: "gate", label: "Entry gate", options: ["Mouth", "Nose", "Eyes", "Cut or scrape"] }, { key: "germ", label: "Germ type", options: ["Virus", "Bacteria"] } ] },
        { type: "pair", f: "matches.a2", label: "2. Walking up a crowded stairwell right after three people sneeze.",
          selects: [ { key: "gate", label: "Entry gate", options: ["Mouth", "Nose", "Eyes", "Cut or scrape"] }, { key: "germ", label: "Germ type", options: ["Virus", "Bacteria"] } ] },
        { type: "pair", f: "matches.a3", label: "3. Rubbing itchy eyes after typing on a shared classroom keyboard.",
          selects: [ { key: "gate", label: "Entry gate", options: ["Mouth", "Nose", "Eyes", "Cut or scrape"] }, { key: "germ", label: "Germ type", options: ["Virus", "Bacteria"] } ] },
        { type: "pair", f: "matches.a4", label: "4. Sliding across the gym floor with an uncovered scrape on your knee.",
          selects: [ { key: "gate", label: "Entry gate", options: ["Mouth", "Nose", "Eyes", "Cut or scrape"] }, { key: "germ", label: "Germ type", options: ["Virus", "Bacteria"] } ] },
        { type: "text", f: "responses.q5", label: "In two steps, explain how your hands pick up germs and get them inside your body.", rows: 3, placeholder: "Step 1... Step 2..." }
      ]
    },

    /* ---------------- S4 TOOLKIT B ---------------- */
    {
      id: "s4", nav: "STATION 04", title: "Toolkit B: soap vs sanitizer, vaccines vs antibiotics, and the shield",
      kicker: "Choosing the right weapon",
      imgs: [
        { src: "assets/s4a_soap_sanitizer.png", cap: "Left: soap and running water wash tough stomach viruses down the drain. Right: alcohol gel bounces off them." },
        { src: "assets/s4b_vaccine_shield.png", cap: "Vaccines train your defenses early. Antibiotics break bacteria only. A healthy community shields those who can't fight alone." }
      ],
      chars: [ { key: "nurse", quote: "Alcohol gel won't kill a stomach bug - soap and running water wash the tough shells down the drain. Antibiotics fight bacteria only, never viruses. And Marcus can't fight this alone - our habits are his shield." },
              { key: "marcus", quote: "(Marcus is in Grade 9. Cancer treatment has weakened his immune system, so he needs the rest of us to block germs for him.)" } ],
      tabs: {
        dispatch: `<p><strong>Soap and water vs hand sanitizer:</strong> soap lifts grease and grime and 20 seconds of running water physically washes tough virus shells down the drain. Alcohol sanitizer (60-70%) works on flu and COVID when hands look clean, but it <strong>fails on norovirus</strong> - stomach viruses have a rock-hard protein shell with no fatty coat for alcohol to dissolve.</p>`,
        evidence: `<p><strong>Vaccines vs antibiotics:</strong> a vaccine shows your body a harmless piece of a germ so your white blood cells build antibodies and memory <strong>ahead of time</strong> - it can target specific viruses or bacteria and high vaccination rates build community protection. An antibiotic is medicine that kills <strong>bacteria</strong> after you're sick - it does <strong>nothing to viruses</strong>, and overusing it breeds resistant superbugs.</p>`,
        toolkit: `<p><strong>The human firewall:</strong> when 90-95% of a school is immunized, germs hit dead ends before reaching someone who can't be vaccinated. But there's <strong>no routine shot for stomach bugs</strong> - so for Marcus, everyday habits (staying home when sick, real soap handwashing) are the only shield.</p>`
      },
      task: "Fill the compare table for vaccines vs antibiotics. Then give two reasons soap and water beat sanitizer on a stomach virus.",
      fields: [
        { type: "grid", f: "partB", label: "Vaccines vs antibiotics", cols: ["Vaccines (shots)", "Antibiotics (medicine)"],
          rows: [ { k: "does", label: "What does it do?" }, { k: "when", label: "When do you get it?" }, { k: "which", label: "Which germs does it fight?" }, { k: "others", label: "How does it affect others?" } ] },
        { type: "text", f: "responses.q6", label: "Give TWO reasons washing with soap and running water works when hand sanitizer fails on a stomach bug.", rows: 3, placeholder: "Reason 1... Reason 2..." }
      ]
    },

    /* ---------------- S5 SUSPECT FILES ---------------- */
    {
      id: "s5", nav: "STATION 05", title: "Suspect files: flu vs norovirus",
      kicker: "Name the culprit - solo",
      imgs: [{ src: "assets/s5_suspects.png", cap: "Suspect A: influenza (fragile lung virus). Suspect B: norovirus (armored stomach virus) on a duck and a clock." }],
      chars: [],
      tabs: {
        dispatch: `<p>Two viruses are on the lab's suspect list. Compare them, then go back to the Station 01 symptom board.</p>`,
        evidence: `<p><strong>Suspect A - Influenza (the flu):</strong> a lung/airway virus. High fever, dry cough, sore throat, body aches, stuffy nose. Lasts 5-7 days. Spreads by breath droplets. Fragile outer coat - killed by regular soap or sanitizer.</p>
<p><strong>Suspect B - Norovirus (stomach bug):</strong> a gut virus. Sudden cramps, vomiting, watery diarrhea; cough is rare; lasts 24-48 hours. Only <strong>18 virus particles</strong> can infect you. Survives days on hard plastic and taps. People still spread it for <strong>48 hours after</strong> symptoms stop. Plain soap and alcohol gel won't kill it - surfaces need <strong>bleach</strong>.</p>`,
        toolkit: `<p>Match the Station 01 board (88% stomach, under 5% cough, 24-48 hour recovery) to one suspect. This is solo work - your call.</p>`
      },
      task: "Name the culprit virus, then give TWO clues from the evidence that prove it.",
      fields: [
        { type: "choice", f: "responses.c1_name", label: "Which virus caused Case 55?", options: ["Influenza (the flu)", "Norovirus (stomach bug)"] },
        { type: "text", f: "responses.c1_clue1", label: "Clue 1 that proves it", rows: 2, placeholder: "From the symptom board or map..." },
        { type: "text", f: "responses.c1_clue2", label: "Clue 2 that proves it", rows: 2, placeholder: "Another clue..." }
      ]
    },

    /* ---------------- S6 SOLVE THE SPREAD ---------------- */
    {
      id: "s6", nav: "STATION 06", title: "Solve the spread: spill + ducks + antibiotics",
      kicker: "Put the clues together",
      imgs: [{ src: "assets/s6_spread_map.png", cap: "The spread map: glowing routes from the west-wing fountain along hallways to every grade, with ducks passed hand to hand." }],
      chars: [
        { key: "boudreau", quote: "I mopped with what we had - warm water and floor soap. I didn't know it needed bleach." },
        { key: "jayden", quote: "I felt fine Wednesday morning, then suddenly sick at the fountain." },
        { key: "sophie", quote: "The ducks go pocket to hand to mouth at lunch - that's how it jumped grades." }
      ],
      tabs: {
        dispatch: `<p>Now explain the whole chain: how did <strong>both</strong> the fountain spill and the resin ducks spread one virus across Grades 7, 8, and 9?</p>`,
        evidence: `<p>The fountain spill put droplets on taps and tiles; the plain-soap mop didn't kill the virus, so the next hands that touched those taps picked it up. The ducks acted as <strong>contaminated objects</strong> - not living bug vectors - carrying virus pocket to hand right before lunch, when hands go to mouths.</p>`,
        toolkit: `<p><strong>Antibiotics:</strong> parents asked for penicillin, but antibiotics kill bacteria only. Case 55 is a virus, so antibiotics do nothing. <strong>Protecting Marcus:</strong> stay home until fully past the contagious window, and scrub with real soap - that keeps the virus out of his classroom.</p>`
      },
      task: "Answer all three: the spread, the antibiotics, and protecting Marcus.",
      fields: [
        { type: "text", f: "responses.c2", label: "How did BOTH the fountain spill and the resin ducks spread the virus across grades?", rows: 3, placeholder: "Spill -> ... Ducks -> ..." },
        { type: "text", f: "responses.c3a", label: "Why won't antibiotics (like penicillin) cure these sick students?", rows: 2, placeholder: "Because..." },
        { type: "text", f: "responses.c3b", label: "What should classmates do to keep Marcus (weak immune system) safe?", rows: 2, placeholder: "They should..." }
      ]
    },

    /* ---------------- S7 MONDAY PLAN ---------------- */
    {
      id: "s7", nav: "STATION 07", title: "The Monday Morning Game Plan",
      kicker: "Three rules for Monday",
      imgs: [{ src: "assets/s7_monday_plan.png", cap: "Monday reset: bleach on fountains and handles, 20-second soap washes, and a pause on duck trading." }],
      chars: [
        { key: "vp", quote: "Give me three rules for Monday. What do people do, and why does it stop this thing?" },
        { key: "marcus", quote: "(Marcus is counting on the plan - he can't fight this one alone.)" }
      ],
      tabs: {
        dispatch: `<p>VP Raman needs <strong>3 clear rules for Monday morning</strong> so more kids don't get sick. For each rule: write <strong>what people must do</strong> and <strong>why it helps stop the stomach virus</strong>.</p>
<ul><li><strong>Rule 1 - the 48-hour stay-home rule</strong></li>
<li><strong>Rule 2 - cleaning desks, taps, and hallways</strong></li>
<li><strong>Rule 3 - resin duck pause + lunch handwashing</strong></li></ul>`,
        evidence: `<p>Recovering kids still shed active virus for <strong>48 full hours after</strong> symptoms stop. Wednesday's plain-soap mop left live virus by the fountain - surfaces need <strong>bleach</strong>. Resin ducks carried virus pocket to hand before lunch, so a <strong>20-second soap wash</strong> is the fix.</p>`,
        toolkit: `<p><strong>Bonus:</strong> outbreak detectives have a two-word nickname for the very first person who brings an illness into a school or community.</p>`
      },
      task: "Write your 3 Monday rules (what + why), the bonus nickname, then COMMIT your plan. Committing unlocks the verdict.",
      fields: [
        { type: "text", f: "responses.rule1_what", label: "Rule 1 - what people must do (48-hour stay-home)", rows: 2 },
        { type: "text", f: "responses.rule1_why", label: "Rule 1 - why it stops the virus", rows: 2 },
        { type: "text", f: "responses.rule2_what", label: "Rule 2 - what people must do (cleaning)", rows: 2 },
        { type: "text", f: "responses.rule2_why", label: "Rule 2 - why it stops the virus", rows: 2 },
        { type: "text", f: "responses.rule3_what", label: "Rule 3 - what people must do (duck pause + handwashing)", rows: 2 },
        { type: "text", f: "responses.rule3_why", label: "Rule 3 - why it stops the virus", rows: 2 },
        { type: "text", f: "responses.bonus", label: "Bonus: the two-word nickname for the first case", rows: 1, placeholder: "two words..." },
        { type: "commit", label: "COMMIT MY MONDAY PLAN" }
      ],
      commitStation: true
    },

    /* ---------------- S8 CASE CLOSED ---------------- */
    {
      id: "s8", nav: "STATION 08", title: "Case Closed: the verdict",
      kicker: "Debrief - unlocked after you commit",
      locked: true,
      imgs: [{ src: "assets/s8_verdict.png", cap: "Case 55 closed. The file, the stamp, and the checklist." }],
      chars: [ { key: "vp", quote: "Case 55 is closed. Norovirus. Your plan matches the health unit's. Well done, detective." } ],
      tabs: {
        dispatch: `<p><strong>Verdict: Norovirus</strong> (the stomach bug), not the flu.</p>
<ul><li>88% vomiting/diarrhea and under 5% cough points to the gut, not the lungs.</li>
<li>Fast 24-48 hour recovery and the 3-to-55 jump fit norovirus.</li>
<li>Penicillin fails because it only fights bacteria - this is a virus.</li></ul>
<p><strong>Bonus answer:</strong> "<strong>patient zero</strong>" (also called the index case) - the first person who brought the illness in.</p>`,
        evidence: `<p><strong>Centennial's Monday Game Plan (the health unit's version):</strong></p>
<ul><li><strong>48-hour stay-home rule:</strong> stay home 48 full hours after symptoms stop, because recovering kids still shed virus. This protects classmates like Marcus.</li>
<li><strong>Bleach on surfaces:</strong> custodians disinfect taps, desks, and handles with bleach, because plain soap and alcohol gel leave norovirus alive.</li>
<li><strong>Duck pause + 20-second soap wash:</strong> pause trading resin ducks (they're contaminated objects), and wash hands with soap and water before lunch.</li></ul>`,
        toolkit: `<p><strong>Sources:</strong> Public Health Agency of Canada (norovirus + handwashing), Nova Scotia Health &amp; 811 (school outbreak + 48-hour exclusion), Immunize Canada and From the Ground Up Gr 8 Health (vaccines + community protection).</p>
<p><strong>Next class (Class 3):</strong> what happens when antibiotics stop working? In 1945, penicillin's inventor Alexander Fleming warned that misusing antibiotics breeds superbugs - and he was right.</p>`
      },
      task: "Compare your Monday plan to the verdict. Anything you'd change?",
      fields: [
        { type: "text", f: "responses.selfcheck", label: "Optional: what would you change in your plan now?", rows: 2 }
      ]
    }
  ]
};

window.CASE55 = CASE55;
