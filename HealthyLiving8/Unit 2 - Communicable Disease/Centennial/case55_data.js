/* ============================================================================
   CASE 55: CENTENNIAL OUTBREAK - story/field data for the sim.
   Edit CONTENT here; the engine lives in index.html.
   Audience: Grade 8 (~12-13). Short sentences, plain words, terms glossed inline.
   House rule for this unit: no em dashes / en dashes in student-facing strings.
   Images are local: assets/<name>.png (generated with the Qwen engine, 2026-11-04).

   Design rules (2026-11-04 review, AUTHORING-STANDARD Gate C):
   - CHRONOLOGICAL ROLL-OUT: The story unfolds day by day (Sun night -> Mon -> Fri).
     Evidence arrives when it happens, mirroring a real investigation.
   - EVIDENCE stations hand out facts. APPLICATION stations only point back to where
     the facts are; they never restate the conclusion they assess.
   - Character quotes are testimony, never the investigator's conclusion.
   - The answer key below (`key`) is used ONLY by the S8 "Your file" review and the
     PIN-gated teacher dashboard.
   Field options: `optional:true` = not needed for the station's check mark.
   ============================================================================ */

var CASE55 = {
  meta: {
    title: "CASE 55: CENTENNIAL OUTBREAK",
    subtitle: "An outbreak investigation at Centennial Junior High",
    hud: "OUTBREAK HUD // CASE 55",
    taskName: "HL8-Centennial-Case55-Sim",
    outcomeLabel: "Learning Outcome // Healthy Living 8",
    outcome: "Learners will analyse the relationships between health behaviours and physical, mental, emotional, social, and spiritual health.",
    defaultTabLabels: { dispatch: "1. Story", evidence: "2. Evidence", toolkit: "3. Science & Words" }
  },

  characters: {
    vp:      { name: "Vice-Principal Priya Raman", role: "In charge of the outbreak response", img: "assets/char_vp_raman.png" },
    jayden:  { name: "Jayden", role: "Grade 8, West Wing", img: "assets/char_jayden.png" },
    sophie:  { name: "Sophie", role: "Grade 7, duck trader", img: "assets/char_sophie.png" },
    marcus:  { name: "Marcus", role: "Grade 9, weakened immune system", img: "assets/char_marcus.png" },
    nurse:   { name: "Nurse Chen", role: "School public-health nurse", img: "assets/char_nurse.png" },
    boudreau:{ name: "Mr. Boudreau", role: "Head custodian", img: "assets/char_boudreau.png" }
  },

  glossary: {
    outbreak: "When many more people than normal get the same sickness in one place at the same time.",
    symptom: "A sign of sickness you can feel or see, like vomiting, a cough, or a fever.",
    pathogen: "Any germ that can make you sick. Viruses and bacteria are both pathogens.",
    virus: "A tiny germ that can't live alone; it must get inside your body's cells to copy itself.",
    bacteria: "Tiny single-celled living things; most are harmless, some make you sick.",
    contagious: "Able to pass sickness from person to person.",
    fomite: "A non-living object that carries germs between people, like a doorknob, keyboard, or plastic toy.",
    incubation: "The wait between a germ getting into your body and you feeling sick.",
    immune: "Your body's defence team; it finds and fights germs.",
    antibiotic: "A medicine (like penicillin) that kills bacteria. It does nothing to viruses.",
    vaccine: "A shot that trains your immune system to recognize a germ before you meet it.",
    hypothesis: "A smart first guess based on the clues you have.",
    shed: "To keep giving off germs that other people can catch, even after you feel better."
  },

  stations: [
    /* ---------------- S0 BRIEFING (Monday 8:15 AM) ---------------- */
    {
      id: "s0", nav: "BRIEFING", navSub: "Health Office shift", title: "Monday 8:15 AM: Welcome to the Health Office",
      kicker: "Before the morning bell", day: 0,
      imgs: [{ src: "assets/s0_normal_school.png", cap: "A bright, ordinary morning outside Centennial Junior High (400 students in Grades 7, 8, and 9)." }],
      chars: [ { key: "vp", quote: "Morning! You're this week's school Health Officer. Usually a quiet job: ice packs, bandages, and checking the absence slip with Nurse Chen. Should be an easy week!" } ],
      words: ["outbreak", "symptom"],
      tabs: {
        dispatch: `<p>You are Centennial Junior High's <strong>Health Officer</strong> for the week.</p>
<p>Most weeks your biggest job is ice packs for jammed fingers and bandages for scraped knees. Still, Nurse Chen asks every Health Officer to watch the sick list in case an <strong>outbreak</strong> ever starts.</p>`,
        evidence: `<p><strong>Building facts for Centennial Junior High (400 students total):</strong></p>
<ul><li><strong>Grade 7</strong> classes are in the <strong>East Wing</strong>.</li>
<li><strong>Grade 8</strong> classes are in the <strong>West Wing</strong>.</li>
<li><strong>Grade 9</strong> classes are in the <strong>North Wing</strong>.</li>
<li>All grades cross paths in <strong>hallways</strong>, the <strong>cafeteria lunch line</strong>, and the <strong>computer lab</strong>.</li></ul>`,
        toolkit: `<p><strong>How to play:</strong> each station on the left is a new day. Read the three middle tabs, then record your calls in the <strong>Health Officer Log</strong> on the right. Click a picture to zoom; use <strong>Read this tab</strong> to hear a page aloud. Everything you type <strong>saves to the server automatically</strong>, so you can close and continue later on any computer.</p>`
      },
      task: "Read the three tabs to learn Centennial's layout, pick your class section, then press READY to start Day 1.",
      fields: [
        { type: "section", label: "Your class section" },
        { type: "ack", label: "READY: OPEN THE HEALTH OFFICE" }
      ]
    },

    /* ---------------- S1 MONDAY (Day 1) ---------------- */
    {
      id: "s1", nav: "MONDAY", navSub: "3 out in West Wing", title: "Monday: Scraped knees, ice packs, and 3 kids home",
      kicker: "Day 1 // A totally normal Monday?", day: 1,
      imgs: [
        { src: "assets/s0_normal_school.png", cap: "Centennial on Monday: a normal week." },
        { src: "assets/s1_normal_office.png", cap: "Your Health Officer desk: bandages, ice pack, absence clipboard." }
      ],
      chars: [ { key: "vp", quote: "Pretty normal Monday: two knee scrapes, one bumped elbow. The only odd thing: three Grade 8 West Wing kids went home throwing up before lunch. Read today's clues, make a first guess, and back it up with evidence." } ],
      words: ["symptom", "hypothesis"],
      tabs: {
        dispatch: `<p><strong>Monday's Health Office Log:</strong></p>
<ul><li><strong>Gym class visits:</strong> 2 scraped knees (bandaged) and 1 sore wrist (ice pack).</li>
<li><strong>Sent home sick:</strong> <strong>3 students</strong> (of 400), all in the <strong>Grade 8 West Wing</strong>.</li></ul>`,
        evidence: `<p><strong>What those 3 students reported before going home:</strong></p>
<ul><li>All 3 felt fine at the 8:30 bell, then suddenly got <strong>stomach cramps</strong> and <strong>vomited</strong> between 10:30 and 11:15 AM (<strong>before</strong> lunch opened).</li>
<li><strong>0 of the 3</strong> had cough, sore throat, or stuffy nose.</li>
<li>Two sick students have lockers beside the <strong>West Wing fountain</strong>; all 3 were showing off mini <strong>resin ducks</strong> before homeroom.</li>
<li>Grade 7 (East) and Grade 9 (North) had <strong>0 sick walk-ins</strong> today.</li></ul>`,
        toolkit: `<p><strong>Tip:</strong> scientists write down a <strong>hypothesis</strong> (a smart first guess from early clues) and <strong>justify it with evidence</strong>. Your Monday guess is never marked wrong if you back it up with a fact from today's tabs.</p>`
      },
      task: "Read Tabs 1 and 2. Pick your Monday hypothesis, then justify it with one fact from today's slides.",
      fields: [
        { type: "choice", f: "judgments.s0.guess", label: "Monday hypothesis: what is your first guess?",
          options: ["A virus that attacks the stomach", "A virus that attacks the lungs, like the flu", "Bacteria from food", "Something in the West Wing drinking water", "Too early to name one cause yet (watch Tuesday's log)"],
          teachMap: {
            "A virus that attacks the stomach": { ok: true, msg: "Nurse Chen: Smart early call! Stomach cramps + vomiting, zero cough = stomach bug. Justify with a Monday fact below." },
            "A virus that attacks the lungs, like the flu": { ok: true, msg: "Nurse Chen: Logged! Watch for coughs tomorrow - all 3 kids today had stomach cramps, zero cough. Explain below." },
            "Bacteria from food": { ok: true, msg: "Nurse Chen: Good hypothesis to test! All 3 threw up before Monday lunch opened - watch cafeteria clues tomorrow. Justify below." },
            "Something in the West Wing drinking water": { ok: true, msg: "Nurse Chen: Interesting angle - two sick kids have lockers by the West Wing fountain! Water can be tested this week. Explain below." },
            "Too early to name one cause yet (watch Tuesday's log)": { ok: true, msg: "Nurse Chen: Fair caution with only 3 of 400 out so far! Explain the clues you DO see on Monday's tabs below." }
          }
        },
        { type: "text", f: "judgments.s0.why", label: "Justify your guess with one fact from today's Story or Evidence tabs.", rows: 3, placeholder: "Based on Monday's evidence, I picked this because..." }
      ]
    },

    /* ---------------- S2 TUESDAY ---------------- */
    {
      id: "s2", nav: "TUESDAY", navSub: "7 out & duck craze", title: "Tuesday: Seven out, and a locker craze",
      kicker: "Day 2 // 7 students out sick", day: 2,
      imgs: [
        { src: "assets/s2_tuesday_cafeteria.png", cap: "Right before lunch: all grades trade tiny resin ducks at the lockers outside the cafeteria." },
        { src: "assets/s1_evidence_board.png", cap: "Nurse Chen's symptom board and floor plan by Tuesday afternoon." }
      ],
      chars: [
        { key: "vp", quote: "Seven kids in total have gone home sick since Monday: four new today, two in Grade 8 West Wing and two from the cafeteria lunch line. Nurse Chen made you a symptom chart." },
        { key: "sophie", quote: "See these tiny resin ducks? Grades 7, 8, and 9 have traded them at the lockers since Monday, right before lunch. I traded mine with three people today!" }
      ],
      words: ["symptom", "outbreak"],
      tabs: {
        dispatch: `<p><strong>Tuesday's Attendance Report:</strong> <strong>7 students</strong> in total have gone home sick since Monday (3 on Monday + 4 new today). Every daily number in this log is a running total, so each day's jump shows that day's new cases.</p>
<ul><li>2 of today's 4 new cases are in the <strong>Grade 8 West Wing</strong>.</li>
<li>The other 2 new cases are the first sick kids from the <strong>cafeteria lunch line</strong>.</li>
<li>All grades have been trading mini <strong>resin ducks</strong> hand to hand at the lockers right before lunch.</li></ul>`,
        evidence: `<p><strong>Nurse Chen's Symptom Log (all sick students):</strong></p>
<ul><li><strong>88%</strong> have sudden stomach cramps, vomiting, and watery diarrhea.</li>
<li><strong>45%</strong> have a mild fever and a headache.</li>
<li><strong>Fewer than 5%</strong> have cough, sore throat, or stuffy nose.</li>
<li><strong>Surprise clue:</strong> two of Monday's sick students already feel better after just <strong>24 to 48 hours</strong>.</li></ul>`,
        toolkit: `<p><strong>Tip:</strong> a lung/airway (respiratory) germ causes cough and sore throat; a stomach/gut (digestive) germ causes cramps, vomiting, and diarrhea.</p>`
      },
      task: "Check the numbers on Tab 2. Pick which body system the germ is attacking, then justify it with a number from the log.",
      fields: [
        { type: "choice", f: "judgments.s1.choice", label: "Which body system is this germ attacking?",
          options: ["The stomach and gut (digestive system)", "The lungs and airways (respiratory system)"],
          correct: "The stomach and gut (digestive system)",
          teachMap: {
            "The stomach and gut (digestive system)": { ok: true, msg: "Nurse Chen: Spot on! Vomiting, cramps, diarrhea = digestive system. Now cite a Tab 2 number below." },
            "The lungs and airways (respiratory system)": { ok: false, msg: "Nurse Chen: Re-check Tab 2! Under 5% have a cough, but 88% have cramps, vomiting, diarrhea. Cough = lungs; vomiting/diarrhea = stomach. Try switching!" }
          }
        },
        { type: "text", f: "judgments.s1.why", label: "Justify with a number from Tuesday's Tab 2 log.", rows: 2, placeholder: "The evidence shows ___% of sick students have...",
          mustMatch: "\\b(88|45|5|24|48|7|seven|eighty[- ]?eight|forty[- ]?five|five)\\b", mustHint: "Nurse Chen: cite an exact Tab 2 number (88% stomach symptoms, 45% fever, under 5% cough, or 24-48 hours recovery)!" }
      ]
    },

    /* ---------------- S3 WEDNESDAY ---------------- */
    {
      id: "s3", nav: "WEDNESDAY", navSub: "18 out & hall spill", title: "Wednesday: Jumping wings and a hallway spill",
      kicker: "Day 3 // 18 students out sick", day: 3,
      imgs: [
        { src: "assets/s2_fountain_ducks.png", cap: "Left: Wednesday's fountain cleanup in the Grade 8 hall. Right: ducks traded hand to hand." },
        { src: "assets/s3_entry_gates.png", cap: "The four entry gates past your body's outer wall: mouth, nose, eyes, broken skin." }
      ],
      chars: [
        { key: "jayden", quote: "The kids who saw it told everyone: at 2:00, a kid threw up beside the Grade 8 West Wing fountain. Mr. Boudreau mopped fast with warm water and his regular pink floral floor soap." },
        { key: "nurse", quote: "Germs can't soak through healthy skin on your palms. But hands are a delivery truck: they pick germs off surfaces and carry them to a doorway into your body." }
      ],
      words: ["pathogen", "virus", "bacteria", "fomite"],
      tabs: {
        dispatch: `<p><strong>Wednesday's Attendance Report:</strong> <strong>18 students</strong> in total have gone home sick since Monday (7 + 11 new today)!</p>
<ul><li>Morning: the sickness jumped to the <strong>Grade 7 East Wing</strong>, far from Grade 8.</li>
<li><strong>2:00 PM incident:</strong> a student threw up beside the <strong>Grade 8 West Wing fountain</strong>, spraying microscopic drops onto taps and tiles. It was mopped with <strong>plain warm water and Mr. Boudreau's regular pink floral floor soap</strong>.</li></ul>`,
        evidence: `<p><strong>The 4 Entry Gates into your body:</strong></p>
<ul><li><strong>Mouth:</strong> swallowing germs on food, snacks, pens, or dirty fingers.</li>
<li><strong>Nose:</strong> breathing in droplets after someone coughs or sneezes nearby.</li>
<li><strong>Eyes:</strong> rubbing eyes with fingers that touched a shared surface.</li>
<li><strong>Cuts or scrapes:</strong> germs slipping past broken skin (gym scrape, hangnail).</li></ul>
<p>Some germs survive for <strong>days</strong> on hard plastic and metal taps. A non-living object that carries germs person to person is a <strong>fomite</strong> (FOE-might).</p>`,
        toolkit: `<p><strong>Viruses vs bacteria:</strong> <strong>viruses</strong> are tiny genetic packages that hijack your cells (colds, flu, COVID-19, and the stomach bugs that sweep fast through a whole school). <strong>Bacteria</strong> are living single cells (strep throat, some food poisoning like Salmonella, and infected skin cuts). A cut or scrape that gets infected turns red, hot, swollen, and sore because bacteria are growing in the wound.</p>
<p><strong>The skin paradox:</strong> unbroken skin blocks germs like a brick wall, yet people touch their eyes, nose, mouth, or food <strong>over 20 times an hour</strong>.</p>`
      },
      task: "Read Tabs 2 and 3. Match each school moment to its gate and germ type, then explain the two steps of how hands get germs inside you.",
      fields: [
        { type: "pair", f: "matches.a1", label: "1. Trading resin ducks with a classmate who has a stomach bug, then eating a snack without washing your hands.",
          expect: { gate: "Mouth", germ: "Virus" },
          teachGate: "Eating a snack with unwashed fingers carries germs straight into the Mouth gate.",
          teachGerm: "Check Tab 3: fast-moving school stomach bugs carried on shared plastic are caused by a Virus.",
          selects: [ { key: "gate", label: "Entry gate", options: ["Mouth", "Nose", "Eyes", "Cut or scrape"] }, { key: "germ", label: "Germ type", options: ["Virus", "Bacteria"] } ] },
        { type: "pair", f: "matches.a2", label: "2. Walking up a crowded stairwell right after three people with colds sneeze.",
          expect: { gate: "Nose", germ: "Virus" },
          teachGate: "Sneezes spray tiny droplets into the air that you breathe in through your Nose.",
          teachGerm: "Check Tab 3: common colds are caused by a Virus, not bacteria.",
          selects: [ { key: "gate", label: "Entry gate", options: ["Mouth", "Nose", "Eyes", "Cut or scrape"] }, { key: "germ", label: "Germ type", options: ["Virus", "Bacteria"] } ] },
        { type: "pair", f: "matches.a3", label: "3. Rubbing your itchy eyes after typing on a keyboard that a classmate with a cold just used.",
          expect: { gate: "Eyes", germ: "Virus" },
          teachGate: "Rubbing itchy Eyes lets germs on your fingertips enter through the wet surface of the eye.",
          teachGerm: "That classmate had a cold, and colds are caused by a Virus.",
          selects: [ { key: "gate", label: "Entry gate", options: ["Mouth", "Nose", "Eyes", "Cut or scrape"] }, { key: "germ", label: "Germ type", options: ["Virus", "Bacteria"] } ] },
        { type: "pair", f: "matches.a4", label: "4. Sliding across a dirty gym floor with an uncovered knee scrape, which turns red, hot, and swollen.",
          expect: { gate: "Cut or scrape", germ: "Bacteria" },
          teachGate: "An uncovered knee scrape is broken skin: that is the Cut or scrape gate.",
          teachGerm: "Key science clue on Tab 3: a skin cut that turns red, hot, and swollen is infected by Bacteria, not a virus!",
          selects: [ { key: "gate", label: "Entry gate", options: ["Mouth", "Nose", "Eyes", "Cut or scrape"] }, { key: "germ", label: "Germ type", options: ["Virus", "Bacteria"] } ] },
        { type: "text", f: "responses.q5", label: "Healthy skin blocks germs. In two steps, explain how unwashed hands still get germs inside you.", rows: 3, placeholder: "Step 1: My hands pick up... Step 2: I touch...",
          mustMatch: "(mouth|nose|eye|eyes|face|food|snack|cut|gate|doorway)", mustHint: "Nurse Chen tip: make sure Step 2 names an entry gate (like touching your mouth, nose, eyes, or food)!" }
      ]
    },

    /* ---------------- S4 THURSDAY ---------------- */
    {
      id: "s4", nav: "THURSDAY", navSub: "34 out & lab tests", title: "Thursday: All three grades, water tests, and tools",
      kicker: "Day 4 // 34 students out sick", day: 4,
      imgs: [
        { src: "assets/s4a_soap_sanitizer.png", cap: "Left: 20 seconds of soap + water rinses tough viruses down the drain. Right: alcohol gel struggles against them." },
        { src: "assets/s4b_vaccine_shield.png", cap: "Vaccines train your immune system early. Antibiotics only kill bacteria. Healthy classmates shield vulnerable peers." }
      ],
      chars: [
        { key: "vp", quote: "Thirty-four out today across all three grades, with a big jump in Grade 8 West Wing. Parents are asking doctors for penicillin. But two tests came back good: town tap water is clean, and 21 of the 34 sick kids bring lunch from home." },
        { key: "marcus", quote: "My cancer treatment weakens my immune system, so a stomach bug could put me in hospital. There's no shot for school stomach bugs, so everyone else's habits are my shield." }
      ],
      words: ["immune", "vaccine", "antibiotic"],
      tabs: {
        dispatch: `<p><strong>Thursday's Attendance Report:</strong> <strong>34 students</strong> in total have gone home sick since Monday (Mon 3 -> Tue 7 -> Wed 18 -> Thu 34, so 16 new today).</p>
<ul><li>All three grades (<strong>7, 8, 9</strong>) and the <strong>computer lab</strong> now have cases.</li>
<li><strong>Grade 8 West Wing</strong> had its biggest single-day jump today (the day after Wednesday's spill).</li>
<li><strong>Town water lab test:</strong> Centennial's tap water is <strong>100% clean</strong>.</li>
<li><strong>Cafeteria check:</strong> <strong>21 of the 34 sick students</strong> bring lunch from home and never eat cafeteria food.</li></ul>`,
        evidence: `<p><strong>Soap and water vs sanitizer:</strong> Scrubbing with soap for 20 seconds <strong>lifts germs and grease off your skin</strong>, and the <strong>running water rinses them down the drain</strong>. Soap and water work on tough germs because they <em>remove</em> germs instead of needing to kill them. Alcohol sanitizer (60-70%) has to <em>kill</em> the germ: it dissolves the soft fatty coat of flu/COVID viruses when hands look clean. Stomach viruses have a <strong>hard protein shell with no fatty coat</strong>, and greasy or dirty fingers also block alcohol, so sanitizer fails on them.</p>
<p><strong>Vaccines vs antibiotics:</strong> a <strong>vaccine</strong> shows your immune system a harmless germ piece <strong>before</strong> you're sick, so your white blood cells build <strong>antibodies</strong> (germ-fighting proteins) ahead of time. Each vaccine is made for <strong>one specific germ</strong> (the measles shot only stops measles), and there are vaccines for both viruses and bacteria. An <strong>antibiotic</strong> (penicillin) is taken <strong>after</strong> a <strong>bacterial</strong> infection has already started. It fights <strong>bacteria only</strong> and does <strong>nothing to viruses</strong>. <strong>Overuse</strong> can breed <strong>superbugs</strong>: bacteria that no longer die from the medicine and can then spread to other people.</p>`,
        toolkit: `<p><strong>The human firewall:</strong> when 90-95% of a school is vaccinated (e.g. measles), germs hit dead ends before reaching vulnerable classmates like Marcus (<strong>community protection</strong>). With no stomach-bug vaccine, staying home while contagious and soap-scrubbing are his only firewall.</p>
<p><strong>Timeline check:</strong> cafeteria-line kids got sick Tuesday and Grade 7s Wednesday morning, <em>before</em> Wednesday afternoon's fountain spill!</p>`
      },
      task: "Check Tabs 1 and 3, justify both choices with slide evidence, then use Tab 2 for the table and soap question.",
      fields: [
        { type: "choice", f: "judgments.s1.pattern", label: "Running totals so far: 3, 7, 18, 34. Look at how many NEW cases each day adds. What pattern do you see?",
          options: ["The sickness is spreading person to person, and speeding up each day", "About the same number of new students get sick each day", "The outbreak is already slowing down"],
          correct: "The sickness is spreading person to person, and speeding up each day",
          teachMap: {
            "The sickness is spreading person to person, and speeding up each day": { ok: true, msg: "Nurse Chen: Exactly! Jumps keep growing (+4, +11, +16) - classic person-to-person acceleration." },
            "About the same number of new students get sick each day": { ok: false, msg: "Nurse Chen: Check the math: 3->7 (+4), 7->18 (+11), 18->34 (+16). Each jump is bigger than the last! Try another option." },
            "The outbreak is already slowing down": { ok: false, msg: "Nurse Chen: 3 -> 7 -> 18 -> 34 - nearly twice as many out each day! It's speeding up, not slowing down." }
          }
        },
        { type: "text", f: "judgments.s1.pattern_why", label: "Justify your pattern using daily numbers (or water/lunch facts) on Tab 1.", rows: 2, placeholder: "The evidence shows this pattern because from Monday to Thursday..." },
        { type: "choice", f: "judgments.s2.top", label: "Which clue spread the germ across all three grades (7, 8, 9) the most?",
          options: ["The Wednesday afternoon fountain spill", "The all-week resin duck trading before lunch", "Both spread it across grades equally"],
          correct: "The all-week resin duck trading before lunch",
          teachMap: {
            "The all-week resin duck trading before lunch": { ok: true, msg: "Nurse Chen: Nailed it! Ducks were traded across Grades 7-9 from Monday, before Wednesday's spill even happened." },
            "The Wednesday afternoon fountain spill": { ok: false, msg: "Nurse Chen: Check the timeline! Cafeteria-line kids got sick Tuesday and Grade 7s Wednesday morning, BEFORE Wednesday's 2:00 PM spill (which was in Grade 8). What moved across all 3 grades since Monday?" },
            "Both spread it across grades equally": { ok: false, msg: "Nurse Chen: WHERE/WHEN: the spill was 2:00 PM Wednesday in Grade 8 (Thursday's Grade 8 spike), but Grade 7s were ALREADY sick Wednesday morning! Which clue crossed all 3 grades from Monday?" }
          }
        },
        { type: "text", f: "judgments.s2.why", label: "Justify using WHEN or WHERE from Tabs 1 and 3.", rows: 2, placeholder: "I picked ___ because on Tuesday/Wednesday..." },
        { type: "grid", f: "partB", label: "Compare: Vaccines vs Antibiotics", cols: ["Vaccines (shots)", "Antibiotics (medicine)"],
          rows: [ { k: "does", label: "What does it do?" }, { k: "when", label: "Before or after you get sick?" }, { k: "which", label: "Which germs does it fight?" }, { k: "others", label: "Effect on others / overuse risk?" } ] },
        { type: "text", f: "responses.q6", label: "TWO reasons soap and running water work when sanitizer fails on a stomach virus.", rows: 3, placeholder: "Reason 1 (sanitizer can't break): ... Reason 2 (soap + water do): ..." }
      ]
    },

    /* ---------------- S5 FRIDAY AM ---------------- */
    {
      id: "s5", nav: "FRIDAY AM", navSub: "55 out: 3 suspects", title: "Friday 9:00 AM: Three suspects on the lab table",
      kicker: "Day 5 Morning // 55 students out sick (14% of school)", day: 5,
      imgs: [{ src: "assets/s5_suspects.png", cap: "Three suspect files: Influenza (lung virus), Norovirus (armored stomach virus), Salmonella (foodborne bacteria)." }],
      chars: [ { key: "vp", quote: "Fifty-five kids are out this morning: nearly 1 in 7 in the building! Public Health sent three suspect files. Compare all three against our week's clues and name the culprit." } ],
      words: ["incubation", "contagious", "shed", "bacteria"],
      tabs: {
        dispatch: `<p><strong>Friday Morning Report:</strong> <strong>55 of 400 students</strong> have gone home sick in total since Monday, 21 of them new today (by location: Gr8 West 18, Gr7 East 12, cafeteria line 9, Gr9 North 8, computer lab 5, other 3).</p>
<p>Public Health narrowed it to <strong>three suspects</strong> on Tab 2. Only one fits <strong>every</strong> clue from Monday to Friday.</p>`,
        evidence: `<p><strong>Suspect A: Influenza (the flu), a respiratory virus.</strong> Attacks lungs/throat. Incubation 1-4 days. High fever, dry cough, sore throat, aches, stuffy nose. Lasts <strong>5-7 days</strong>. Spreads in breath droplets. Fragile coat: killed by soap/sanitizer.</p>
<p><strong>Suspect B: Norovirus (stomach bug), a digestive virus.</strong> Attacks stomach/gut. Incubation <strong>12-48h</strong>. Sudden cramps, vomiting, diarrhea, mild fever; cough rare. Recover in <strong>24-48h</strong>. Dose: just <strong>18 virus particles</strong>. Survives days on plastic and taps. Still <strong>sheds</strong> (keeps giving off virus that others can catch) for <strong>48h after</strong> symptoms stop. Hard protein shell: alcohol gel fails, and plain soap on a surface only wipes the virus around instead of killing it. <strong>Bleach</strong> (a strong disinfectant that breaks the shell apart) is what kills it on surfaces. Only trained adults, like custodians, handle bleach.</p>
<p><strong>Suspect C: Salmonella (food poisoning), a digestive bacteria.</strong> From contaminated food (undercooked poultry/eggs). Incubation 6h-3 days. Cramps, diarrhea, fever, sometimes vomiting. Lasts <strong>4-7 days</strong>. Sickens people who ate the same meal; rarely spreads fast student to student.</p>`,
        toolkit: `<p><strong>Rule suspects out by:</strong> <strong>symptoms</strong> (88% stomach, under 5% cough), <strong>recovery speed</strong> (24-48 hours vs a week), and <strong>who got sick</strong> (21 of the 34 sick kids checked on Thursday bring lunch from home; cases climbed all week, not one bad meal).</p>`
      },
      task: "Your call: name the culprit germ, give one clue pointing TO it, and one clue ruling OUT another suspect.",
      fields: [
        { type: "choice", f: "responses.c1_name", label: "Which germ caused Case 55?",
          options: ["Suspect A: Influenza (the flu)", "Suspect B: Norovirus (stomach virus)", "Suspect C: Salmonella (food-poisoning bacteria)"],
          correct: "Suspect B: Norovirus (stomach virus)",
          teachMap: {
            "Suspect B: Norovirus (stomach virus)": { ok: true, msg: "Nurse Chen: Bullseye! Norovirus matches 88% stomach symptoms, fast 24-48h recovery, survival on ducks, and why plain-soap mopping failed. Write your two proof clues below!" },
            "Suspect A: Influenza (the flu)": { ok: false, msg: "Nurse Chen: Compare Suspect A with Tuesday's chart! Flu attacks lungs (cough, sore throat), lasts 5-7 days. At Centennial, under 5% had cough, 88% had vomiting/diarrhea, recovery 24-48h. Check the other suspects!" },
            "Suspect C: Salmonella (food-poisoning bacteria)": { ok: false, msg: "Nurse Chen: Good check of a stomach germ! But: (1) 21 of the 34 sick students checked bring lunch from home, and (2) Salmonella lasts 4-7 days and rarely spreads fast from student to student. Which stomach germ fits a 24-48h recovery?" }
          }
        },
        { type: "text", f: "responses.c1_clue1", label: "Clue 1: one fact or number that points TO your culprit.", rows: 2, placeholder: "The evidence shows ___, which matches..." },
        { type: "text", f: "responses.c1_clue2", label: "Clue 2: name a suspect you ruled OUT and the evidence that rules it out.", rows: 2, placeholder: "It cannot be Suspect ___ because..." }
      ]
    },

    /* ---------------- S6 FRIDAY NOON ---------------- */
    {
      id: "s6", nav: "FRIDAY NOON", navSub: "Trace the 2 chains", title: "Friday 12:00 PM: Reconstruct the chain",
      kicker: "Day 5 Midday // Witness follow-up", day: 5,
      imgs: [{ src: "assets/s6_spread_map.png", cap: "Both pathways: fountain-tap contact in the West Wing and ducks traded before lunch." }],
      chars: [
        { key: "boudreau", quote: "I cleaned Wednesday's fountain spill with only warm water and my regular pink floral floor soap, then wiped the fountain's metal tap with that same cloth. I did not know soap alone would not kill the virus." },
        { key: "jayden", quote: "I wasn't near Wednesday's spill when it happened, but I drank from that fountain at about 8:45 Thursday morning, right after the first bell. By 10:00 Thursday night, I was throwing up." },
        { key: "sophie", quote: "Kids still trade ducks in the lunch line, and almost nobody washes with soap first - the bathroom line is busy." }
      ],
      words: ["fomite", "incubation", "antibiotic"],
      tabs: {
        dispatch: `<p>You know <em>what</em> hit Centennial. Now prove <em>how</em> both pathways worked, why parents' antibiotic requests won't help, and how classmates protect Marcus.</p>`,
        evidence: `<p><strong>Review the witness quotes:</strong> what Mr. Boudreau used on the floor then the <strong>fountain tap</strong>; the number of hours between Jayden drinking Thursday morning and getting sick Thursday night (count them, then compare with the culprit's incubation time); and that parents want <strong>penicillin</strong> while <strong>Marcus</strong> has a weak immune system.</p>`,
        toolkit: `<p><strong>Write a cause-and-effect chain</strong> using <em>"first, then, so."</em> Example (head lice): "First, a student with lice wore shared headphones. Then lice clung to the ear pads. So the next student got lice too."</p>`
      },
      task: "Number the 5 duck-chain steps 1 to 5, then explain the fountain pathway, the penicillin problem, and protecting Marcus.",
      fields: [
        { type: "order", f: "responses.chain", label: "Number the 5 duck-chain steps 1 (first) to 5 (last). Follow the virus from one person's hands to another person's mouth:",
          expectOrder: { b: "1", e: "2", d: "3", a: "4", c: "5" },
          stepHints: {
            "1": "Step 1: germs first reach the toy when a student with virus on their hands picks up a resin duck.",
            "2": "Step 2: tough virus particles stay alive on the hard plastic duck (a fomite).",
            "3": "Step 3: the duck is traded to a classmate from another grade at the lockers, after the virus is already living on it.",
            "4": "Step 4: that classmate walks into the cafeteria without washing hands with soap.",
            "5": "Step 5: they pick up a sandwich, and the virus enters through the mouth gate."
          },
          items: [
            { k: "a", t: "That classmate walks straight into the cafeteria without washing hands with soap." },
            { k: "b", t: "A student who still has virus on their hands picks up a plastic resin duck." },
            { k: "c", t: "They pick up a sandwich, and the virus enters through the mouth gate." },
            { k: "d", t: "Next, the duck is traded to a classmate from another grade at the lockers." },
            { k: "e", t: "Tough virus particles stay alive on the hard plastic, so the duck becomes a fomite." }
          ] },
        { type: "text", f: "responses.c2", label: "How did Wednesday's fountain spill make Jayden sick Thursday night when he wasn't at the spill? Use Boudreau's and Jayden's clues.", rows: 3, placeholder: "Plain soap did not... Then Mr. Boudreau wiped... So when Jayden..." },
        { type: "text", f: "responses.c3a", label: "Why won't penicillin (an antibiotic) cure the 55 sick students?", rows: 2, placeholder: "Penicillin won't cure them because...",
          mustMatch: "(virus|viruses|viral|bacteria|bacterial)", mustHint: "Nurse Chen tip: connect BOTH words in your answer: antibiotics only kill bacteria, and Norovirus is a virus!" },
        { type: "text", f: "responses.c3b", label: "Name one habit classmates must follow to protect Marcus, and why it keeps him safe.", rows: 2, placeholder: "Classmates must ___ because..." }
      ]
    },

    /* ---------------- S7 FRIDAY 3:15 PM ---------------- */
    {
      id: "s7", nav: "FRIDAY 3:15", navSub: "Monday Game Plan", title: "Friday 3:15 PM: Your Monday Morning Game Plan",
      kicker: "Final Briefing // Before the buses leave", day: 5,
      imgs: [{ src: "assets/s7_monday_plan.png", cap: "Breaking every link in the chain before Monday's bell." }],
      chars: [
        { key: "vp", quote: "Buses leave in ten minutes. Give me three clear Monday-morning rules. For each: WHO does WHAT, and WHY it stops this germ." },
        { key: "marcus", quote: "I want to be in class on Monday. Make sure the plan actually stops this bug." }
      ],
      words: ["contagious", "fomite"],
      tabs: {
        dispatch: `<p>VP Raman needs <strong>3 clear Monday-morning rules</strong> so the outbreak stops instead of hitting 100 students:</p>
<ul><li><strong>Rule 1:</strong> when recovering students may return to school</li>
<li><strong>Rule 2:</strong> how custodians clean fountains, taps, desks, and handles</li>
<li><strong>Rule 3:</strong> what students do about resin ducks and handwashing before eating</li></ul>`,
        evidence: `<p><strong>Double-check a fact?</strong> Click back to earlier days before you commit: <strong>Thursday Tab 2</strong> (why soap + water beat sanitizer) and <strong>Friday AM Tab 2</strong> (hours of shedding after feeling better; which cleaner kills it on surfaces).</p>`,
        toolkit: `<p><strong>Each rule needs:</strong> <strong>WHAT people do</strong> (exact hours, cleaner, or seconds) and <strong>WHY it stops this virus</strong>. Model (head lice): What - "pause sharing hats and headphones." Why - "lice crawl on shared fabric and plastic, so pausing cuts their bridge."</p>
<p><strong>Bonus challenge:</strong> detectives have a famous two-word nickname for the first person who brings an illness into a school. Hint: the first word is what a doctor calls someone who is sick, and the second word is the number that comes before one.</p>`
      },
      task: "Write all 3 Monday rules (WHAT and WHY), test them on the school, then COMMIT to open Case Closed.",
      fields: [
        { type: "text", f: "responses.rule1_what", label: "Rule 1 (returning after sickness): what must sick/recovering students do?", rows: 2, placeholder: "Students who threw up or had diarrhea must stay home until..." },
        { type: "text", f: "responses.rule1_why", label: "Rule 1: why does that rule stop this virus?", rows: 2, placeholder: "This stops the spread because recovering people still..." },
        { type: "text", f: "responses.rule2_what", label: "Rule 2 (cleaning): what must custodians use on taps, fountains, desks, handles?", rows: 2, placeholder: "Custodians must disinfect surfaces using..." },
        { type: "text", f: "responses.rule2_why", label: "Rule 2: why does that rule stop this virus?", rows: 2, placeholder: "This works because plain soap and alcohol..." },
        { type: "text", f: "responses.rule3_what", label: "Rule 3 (ducks + handwashing): what must students do before lunch?", rows: 2, placeholder: "Students must pause ___ and wash hands with ___ for..." },
        { type: "text", f: "responses.rule3_why", label: "Rule 3: why does that rule stop this virus?", rows: 2, placeholder: "This breaks the chain because..." },
        { type: "text", f: "responses.bonus", label: "Optional Bonus: two-word detective nickname for the very first case in an outbreak", rows: 1, placeholder: "two words...", optional: true },
        { type: "commit", label: "COMMIT MY MONDAY PLAN" }
      ],
      commitStation: true
    },

    /* ---------------- S8 CASE CLOSED ---------------- */
    {
      id: "s8", nav: "CASE CLOSED", navSub: "Official Verdict", title: "Case Closed: Public Health Verdict & Your File",
      kicker: "Debrief // Unlocked after commit", day: 5,
      locked: true,
      imgs: [{ src: "assets/s8_verdict.png", cap: "Case 55 closed: Norovirus confirmed, Monday protocol active, cases drop to zero by Wednesday." }],
      chars: [ { key: "vp", quote: "Case 55 is closed! Public Health confirmed Norovirus, and with our Monday rules, new cases dropped to zero by mid-week. Open Tab 3 (Your File) to compare your log with the official findings." } ],
      words: ["incubation", "fomite", "contagious"],
      tabLabels: { dispatch: "1. Official Verdict", evidence: "2. Health Unit Plan", yourfile: "3. Your File", toolkit: "4. Sources & Next Class" },
      tabs: {
        dispatch: `<p><strong>Official Culprit: Suspect B, Norovirus</strong> (a stomach virus), not Influenza and not Salmonella.</p>
<ul><li><strong>Why not Influenza:</strong> 88% vomiting/diarrhea, under 5% cough (digestive, not lungs); flu lasts 5-7 days, not 24-48h.</li>
<li><strong>Why not Salmonella:</strong> 21 of the 34 sick kids checked on Thursday brought lunch from home, town water clean, recovery 1-2 days (not 4-7), cases accelerated person to person (3->7->18->34->55).</li>
<li><strong>Both pathways:</strong> resin ducks were <strong>fomites</strong> carrying norovirus across Grades 7-9 before lunch (mouth gate). Then Wednesday's spill caused Thursday's West Wing spike: plain soap didn't kill norovirus and the same cloth wiped the tap Jayden used Thursday AM (fits the 12-48h incubation).</li>
<li><strong>Why penicillin fails:</strong> antibiotics only kill living bacteria; norovirus is a virus.</li>
<li><strong>Bonus answer:</strong> <strong>Patient Zero</strong> (also called the <strong>index case</strong>).</li></ul>`,
        evidence: `<p><strong>Public Health's Monday Morning Game Plan:</strong></p>
<ul><li><strong>Rule 1 (48-Hour Stay-Home Rule):</strong> anyone with vomiting/diarrhea stays home until <strong>48 full hours after</strong> symptoms stop - recovering people still shed norovirus. This shields classmates like Marcus.</li>
<li><strong>Rule 2 (Bleach Disinfection):</strong> custodians disinfect fountains, taps, desks, keyboards, and handles with <strong>bleach</strong> (clean cloths), because plain soap and alcohol wipes leave norovirus shells alive.</li>
<li><strong>Rule 3 (Duck Pause + 20-Second Soap Wash):</strong> pause duck trading (ducks are fomites) and wash hands with <strong>soap and water for 20 seconds</strong> before eating, because sanitizer works poorly on norovirus.</li></ul>`,
        yourfile: "@review",
        toolkit: `<p><strong>Sources:</strong> Public Health Agency of Canada (Norovirus &amp; Hand Hygiene), Nova Scotia Health &amp; 811 (School GI Outbreak &amp; 48-Hour Exclusion), Immunize Canada, <em>From the Ground Up</em> (Gr 8 Health).</p>
<p><strong>Class 3 (The Superbug Threat):</strong> what happens when bacteria evolve to beat antibiotics? In 1945, penicillin's discoverer Alexander Fleming warned that misuse breeds superbugs - and he was right.</p>`
      },
      task: "Open Tab 3 (Your File) to compare your log with the official findings, then do the two debrief reflections below.",
      fields: [
        { type: "text", f: "responses.debrief_evidence", label: "Which week evidence confirmed your Monday guess or made you change your mind?", rows: 2, placeholder: "On Monday I guessed ___, and the clue that ___ was...", optional: true },
        { type: "text", f: "responses.selfcheck", label: "Compare your 3 rules (Tab 3) with the Health Unit Plan (Tab 2). One detail you nailed or would sharpen?", rows: 2, placeholder: "One detail I nailed / would sharpen is...", optional: true }
      ]
    }
  ],

  key: [
    { st: "MONDAY",      label: "Monday first guess", f: "judgments.s0.guess", whyF: "judgments.s0.why", noKey: true, note: "A first hypothesis is never marked wrong when backed by Monday's evidence; officers update as clues arrive." },
    { st: "TUESDAY",     label: "Body system under attack", f: "judgments.s1.choice", whyF: "judgments.s1.why", answer: "The stomach and gut (digestive system)", note: "88% had stomach cramps, vomiting, and diarrhea; fewer than 5% had a cough." },
    { st: "WEDNESDAY",   label: "1. Ducks, then eating a snack", f: "matches.a1", pair: { gate: "Mouth", germ: "Virus" } },
    { st: "WEDNESDAY",   label: "2. Sneezes in the stairwell", f: "matches.a2", pair: { gate: "Nose", germ: "Virus" } },
    { st: "WEDNESDAY",   label: "3. Rubbing eyes after keyboard", f: "matches.a3", pair: { gate: "Eyes", germ: "Virus" } },
    { st: "WEDNESDAY",   label: "4. Infected gym-floor knee scrape", f: "matches.a4", pair: { gate: "Cut or scrape", germ: "Bacteria" }, note: "Red, hot, swollen scrapes are bacterial infections entering broken skin." },
    { st: "THURSDAY",    label: "Pattern in daily numbers (3, 7, 18, 34)", f: "judgments.s1.pattern", whyF: "judgments.s1.pattern_why", answer: "The sickness is spreading person to person, and speeding up each day", note: "Daily jumps grew (+4, +11, +16, +21 Friday); tap water + home lunches ruled out one source." },
    { st: "THURSDAY",    label: "Main spreader across all 3 grades", f: "judgments.s2.top", whyF: "judgments.s2.why", answer: "The all-week resin duck trading before lunch", note: "Ducks moved across Grades 7-9 from Monday; cafeteria and Grade 7 cases appeared before Wednesday afternoon's spill." },
    { st: "FRIDAY AM",   label: "Culprit pathogen", f: "responses.c1_name", whyF: "responses.c1_clue1", answer: "Suspect B: Norovirus (stomach virus)" },
    { st: "FRIDAY NOON", label: "5-step resin-duck chain", f: "responses.chain", order: { b: 1, e: 2, d: 3, a: 4, c: 5 },
      orderText: "1. Sick hands hold duck -> 2. Virus survives on plastic fomite -> 3. Traded to another grade -> 4. No soap wash before cafeteria -> 5. Sandwich carries virus into mouth" }
  ],

  /* Dynamic sim callbacks reacting to the student's own Monday hypothesis */
  callbacks: {
    s2: {
      who: "nurse",
      byGuess: {
        "A virus that attacks the stomach": "Yesterday you guessed a stomach virus, and Tuesday's chart agrees: 88% have stomach cramps and vomiting! Now verify the body system and watch how it travels.",
        "A virus that attacks the lungs, like the flu": "Yesterday you guessed a lung virus like the flu. Check Tuesday's chart: under 5% have a cough, but 88% are throwing up! Does a lung virus still fit?",
        "Bacteria from food": "Yesterday you wondered about food bacteria. Cafeteria-line kids are out today, so keep watching who actually eats cafeteria food!",
        "Something in the West Wing drinking water": "Yesterday you flagged the West Wing water. A sample went to the town lab today (results Thursday). Meanwhile, check today's symptom numbers!",
        "Too early to name one cause yet (watch Tuesday's log)": "Yesterday you waited for more clues. Four more cases today plus our symptom percentages: time to lock in which body system is under attack!"
      }
    },
    s4: {
      who: "vp",
      byGuess: {
        "A virus that attacks the stomach": "Your Monday stomach-virus hunch is looking sharper: today's clean water test and 21 home-lunch cases ruled out tap water and a bad cafeteria meal!",
        "A virus that attacks the lungs, like the flu": "Remember your Monday flu guess? Tuesday's stomach chart plus today's jump across all grades means we're chasing a tough stomach germ, not a lung virus.",
        "Bacteria from food": "Remember suspecting food bacteria on Monday? Check Tab 1: 21 of the 34 sick students bring lunch from home and never touch cafeteria food!",
        "Something in the West Wing drinking water": "Remember suspecting the West Wing water? The town lab just reported 100% clean - pipes aren't the culprit!",
        "Too early to name one cause yet (watch Tuesday's log)": "Holding off on Monday paid off: today's lab checks ruled out tap water and cafeteria food, pointing to person-to-person surface spread!"
      }
    }
  }
};

window.CASE55 = CASE55;
