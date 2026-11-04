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
    outbreak: "When many more people get the same sickness than normal, in one place, at the same time.",
    symptom: "A sign of sickness that you can feel or see, like vomiting, a cough, or a fever.",
    pathogen: "Any germ that can make you sick. Viruses and bacteria are both pathogens.",
    virus: "A tiny germ that cannot live on its own. It has to get inside your body's cells to make copies of itself.",
    bacteria: "Tiny single-celled living things. Most are harmless or helpful, but some make you sick.",
    contagious: "Able to pass a sickness from one person to other people.",
    fomite: "A non-living object that carries germs from one person to another, like a doorknob, a keyboard, or a plastic toy.",
    incubation: "The waiting time between when a germ gets into your body and when you start to feel sick.",
    immune: "Your immune system is your body's defence team. It finds and fights germs.",
    antibiotic: "A medicine (like penicillin) that kills bacteria. It does nothing to viruses.",
    vaccine: "A shot that trains your immune system to recognize a germ before you ever meet it.",
    hypothesis: "A smart first guess based on the clues you have so far."
  },

  stations: [
    /* ---------------- S0 BRIEFING (Monday 8:15 AM) ---------------- */
    {
      id: "s0", nav: "BRIEFING", title: "Monday 8:15 AM: Welcome to the Health Office",
      kicker: "Before the morning bell", day: 0,
      imgs: [{ src: "assets/s0_normal_school.png", cap: "A bright, ordinary morning outside Centennial Junior High (400 students in Grades 7, 8, and 9)." }],
      chars: [ { key: "vp", quote: "Morning! Thanks for taking this week's shift as our school Health Officer. Honestly, it is usually a pretty quiet job: mostly ice packs for gym-class boo-boos, bandages for scraped knees, and checking the morning absence slip with Nurse Chen. Should be an easy week!" } ],
      words: ["outbreak", "symptom"],
      tabs: {
        dispatch: `<p>You are Centennial Junior High's <strong>Health Officer</strong> for the week.</p>
<p>Most weeks, your biggest job is handing out ice packs for jammed fingers in floor hockey, putting bandages on scraped knees from gym class, and logging the daily absence sheet. Still, Nurse Chen asks every Health Officer to watch the sick list just in case an <strong>outbreak</strong> ever starts.</p>`,
        evidence: `<p><strong>Building facts for Centennial Junior High (400 students total):</strong></p>
<ul><li><strong>Grade 7</strong> classes are in the <strong>East Wing</strong>.</li>
<li><strong>Grade 8</strong> classes are in the <strong>West Wing</strong>.</li>
<li><strong>Grade 9</strong> classes are in the <strong>North Wing</strong>.</li>
<li>All three grades cross paths in the <strong>hallways</strong>, the <strong>cafeteria lunch line</strong>, and the <strong>computer lab</strong>.</li></ul>`,
        toolkit: `<p><strong>How to play:</strong> each station on the left is a new day in your week as Health Officer. Read all three tabs in the middle (<strong>1. Story</strong>, <strong>2. Evidence</strong>, and <strong>3. Science &amp; Words</strong>), then record your calls in the <strong>Health Officer Log</strong> on the right.</p>
<p>Click any picture to zoom in. Use <strong>Read this tab</strong> at the top right if you want a page read out loud. Everything you type <strong>saves to the server automatically</strong>, so you can close the tab and continue later on any computer.</p>`
      },
      task: "Read all three tabs so you know how Centennial is laid out. Then pick your class section and press READY to start Day 1 in the Health Office.",
      fields: [
        { type: "section", label: "Your class section" },
        { type: "ack", label: "READY: OPEN THE HEALTH OFFICE" }
      ]
    },

    /* ---------------- S1 MONDAY (Day 1) ---------------- */
    {
      id: "s1", nav: "MONDAY", title: "Monday: Scraped knees, ice packs, and 3 kids home",
      kicker: "Day 1 // A totally normal Monday?", day: 1,
      imgs: [
        { src: "assets/s0_normal_school.png", cap: "Centennial Junior High on Monday: classes humming along like any normal week." },
        { src: "assets/s1_normal_office.png", cap: "Your Health Officer desk on Monday morning: bandages, a gym-class ice pack, and today's absence clipboard." }
      ],
      chars: [ { key: "vp", quote: "Pretty normal Monday so far: two gym-class knee scrapes and one bumped elbow. The only thing on the absence slip is three Grade 8 kids from the West Wing who went home throwing up before lunch. Read today's clues, make a first guess, and back it up with evidence from the log." } ],
      words: ["symptom", "hypothesis"],
      tabs: {
        dispatch: `<p><strong>Monday's Health Office Log:</strong></p>
<ul><li><strong>Gym class visits:</strong> 2 scraped knees (cleaned and bandaged) and 1 sore wrist (ice pack).</li>
<li><strong>Sent home sick:</strong> <strong>3 students</strong> (out of 400 in the school), all with lockers and homerooms in the <strong>Grade 8 West Wing</strong>.</li></ul>`,
        evidence: `<p><strong>What those 3 students reported before going home:</strong></p>
<ul><li>All 3 felt fine at the 8:30 AM bell, then suddenly got <strong>stomach cramps</strong> and started <strong>throwing up (vomiting)</strong> between 10:30 and 11:15 AM (<strong>before</strong> the cafeteria opened for lunch).</li>
<li><strong>0 of the 3</strong> had a cough, sore throat, or stuffy nose.</li>
<li>Two of the sick students have lockers beside the <strong>West Wing drinking fountain</strong>, and all 3 were showing off mini plastic <strong>resin ducks</strong> before homeroom.</li>
<li>Grade 7 (East Wing) and Grade 9 (North Wing) had <strong>0 sick walk-ins</strong> today.</li></ul>`,
        toolkit: `<p><strong>Health Officer tip:</strong> when scientists spot even a small cluster, they write down a <strong>hypothesis</strong> (a smart first guess based on early clues) and <strong>justify it with evidence</strong>. Your Monday guess is never marked wrong as long as you back it up with a real fact from today's tabs.</p>`
      },
      task: "Read Tab 1 (Story) and Tab 2 (Evidence). Pick your Monday hypothesis, then justify your answer using at least one specific fact from today's slides.",
      fields: [
        { type: "choice", f: "judgments.s0.guess", label: "Monday hypothesis: what is your first guess?",
          options: ["A virus that attacks the stomach", "A virus that attacks the lungs, like the flu", "Bacteria from food", "Something in the West Wing drinking water", "Too early to name one cause yet (watch Tuesday's log)"],
          teachMap: {
            "A virus that attacks the stomach": { ok: true, msg: " Nurse Chen: Smart early call! Sudden stomach cramps and vomiting with zero cough fit a stomach bug. Now justify why using a Monday fact below." },
            "A virus that attacks the lungs, like the flu": { ok: true, msg: "Nurse Chen: Logged! Keep an eye on whether coughing shows up tomorrow, since all 3 kids today had stomach cramps and zero cough. Explain your thinking below." },
            "Bacteria from food": { ok: true, msg: "Nurse Chen: Good hypothesis to test! Notice the 3 students threw up before Monday lunch opened, so let's watch cafeteria clues tomorrow. Justify your guess below." },
            "Something in the West Wing drinking water": { ok: true, msg: "Nurse Chen: Interesting angle, since two of the sick kids have lockers right by the West Wing fountain! Public Health can test the water this week. Explain why below." },
            "Too early to name one cause yet (watch Tuesday's log)": { ok: true, msg: "Nurse Chen: Fair caution with only 3 of 400 students out so far! Explain what clues you DO see on Monday's tabs right below." }
          }
        },
        { type: "text", f: "judgments.s0.why", label: "Justify your Monday guess using at least one fact from today's Story or Evidence tabs.", rows: 3, placeholder: "Based on Monday's evidence, I picked this because..." }
      ]
    },

    /* ---------------- S2 TUESDAY ---------------- */
    {
      id: "s2", nav: "TUESDAY", title: "Tuesday: Seven out, and a locker craze",
      kicker: "Day 2 // 7 students out sick", day: 2,
      imgs: [
        { src: "assets/s2_tuesday_cafeteria.png", cap: "Right before lunch: students from all grades trade tiny plastic resin ducks at the lockers outside the cafeteria." },
        { src: "assets/s1_evidence_board.png", cap: "Nurse Chen's symptom board and school floor plan by Tuesday afternoon." }
      ],
      chars: [
        { key: "vp", quote: "Seven students are out sick today: four more in the Grade 8 West Wing, plus the first sick students from the cafeteria lunch line. Nurse Chen pulled together a symptom chart for you." },
        { key: "sophie", quote: "Have you seen these tiny resin ducks? Grade 7s, 8s, and 9s have been trading them at the lockers since Monday, mostly right before we walk into the cafeteria to eat lunch. I traded mine with three people today!" }
      ],
      words: ["symptom", "outbreak"],
      tabs: {
        dispatch: `<p><strong>Tuesday's Attendance Report:</strong> <strong>7 students</strong> are home sick today (up from 3 on Monday).</p>
<ul><li>4 more students from the <strong>Grade 8 West Wing</strong>.</li>
<li>The first sick students who hang out in the <strong>cafeteria lunch line</strong>.</li>
<li>Students across Grades 7, 8, and 9 have been trading miniature plastic <strong>resin ducks</strong> hand to hand at the lockers right before lunch.</li></ul>`,
        evidence: `<p><strong>Nurse Chen's Symptom Log (across all sick students):</strong></p>
<ul><li><strong>88%</strong> have sudden stomach cramps, vomiting, and watery diarrhea.</li>
<li><strong>45%</strong> have a mild fever and a headache.</li>
<li><strong>Fewer than 5%</strong> have a cough, a sore throat, or a stuffy nose.</li>
<li><strong>Surprise clue:</strong> two of Monday's sick students already called to say they are starting to feel better after just <strong>24 to 48 hours</strong>.</li></ul>`,
        toolkit: `<p><strong>Health Officer tip:</strong> a germ that attacks the <strong>lungs and airways</strong> (the respiratory system) mainly causes coughing, sneezing, and a sore throat. A germ that attacks the <strong>stomach and gut</strong> (the digestive system) mainly causes cramps, vomiting, and diarrhea.</p>`
      },
      task: "Check Nurse Chen's numbers on Tab 2 (Evidence). Pick which body system the germ is attacking, then justify your answer using a number from the log.",
      fields: [
        { type: "choice", f: "judgments.s1.choice", label: "Which body system is this germ attacking?",
          options: ["The stomach and gut (digestive system)", "The lungs and airways (respiratory system)"],
          correct: "The stomach and gut (digestive system)",
          teachMap: {
            "The stomach and gut (digestive system)": { ok: true, msg: "Nurse Chen: Spot on! Vomiting, stomach cramps, and diarrhea are classic digestive-system symptoms. Now cite a number from Tab 2 below." },
            "The lungs and airways (respiratory system)": { ok: false, msg: "Nurse Chen: Re-check Tab 2 (Evidence)! Fewer than 5% of sick students have a cough or sore throat, while 88% have stomach cramps, vomiting, and diarrhea. Coughing = lungs; vomiting and diarrhea = stomach and gut. Try switching your answer!" }
          }
        },
        { type: "text", f: "judgments.s1.why", label: "Justify your choice using a number from Tuesday's symptom log on Tab 2.", rows: 2, placeholder: "The evidence shows ___% of sick students have...",
          mustMatch: "(88|45|5|24|48|seven|percent|%)", mustHint: "Nurse Chen tip: include a real number from Tab 2 (such as 88% or under 5%) to prove your choice!" }
      ]
    },

    /* ---------------- S3 WEDNESDAY ---------------- */
    {
      id: "s3", nav: "WEDNESDAY", title: "Wednesday: Jumping wings and a hallway spill",
      kicker: "Day 3 // 18 students out sick", day: 3,
      imgs: [
        { src: "assets/s2_fountain_ducks.png", cap: "Left: Wednesday afternoon's fountain cleanup in the Grade 8 hall. Right: resin ducks traded hand to hand." },
        { src: "assets/s3_entry_gates.png", cap: "The four entry gates germs use to get past your body's outer wall: mouth, nose, eyes, and broken skin." }
      ],
      chars: [
        { key: "jayden", quote: "At 2:00 this afternoon, a kid threw up right beside the Grade 8 West Wing drinking fountain. Mr. Boudreau mopped it up fast, using warm water and regular floor soap." },
        { key: "nurse", quote: "Germs cannot soak through healthy unbroken skin on your palms. Your hands act like a delivery truck: they pick germs up off a surface, and then carry them to a doorway into your body." }
      ],
      words: ["pathogen", "virus", "bacteria", "fomite"],
      tabs: {
        dispatch: `<p><strong>Wednesday's Attendance Report:</strong> <strong>18 students</strong> are home sick today!</p>
<ul><li>Morning: the sickness has jumped across the building to the <strong>Grade 7 East Wing</strong>, even though Grade 7 classrooms are far from Grade 8.</li>
<li><strong>2:00 PM incident:</strong> a student suddenly threw up beside the <strong>Grade 8 West Wing drinking fountain</strong>. Throwing up sprays microscopic drops onto nearby taps and floor tiles. It was mopped up with <strong>plain warm water and regular floor soap</strong>.</li></ul>`,
        evidence: `<p><strong>The 4 Entry Gates into your body:</strong></p>
<ul><li><strong>Mouth:</strong> swallowing germs on food, snacks, chewed pens, or unwashed fingers.</li>
<li><strong>Nose:</strong> breathing in tiny drops floating in the air after someone coughs or sneezes nearby.</li>
<li><strong>Eyes:</strong> rubbing itchy or tired eyes with fingers that touched a shared surface.</li>
<li><strong>Cuts or scrapes:</strong> germs slipping past broken skin, like an uncovered gym scrape or hangnail.</li></ul>
<p>Some germs survive for <strong>days</strong> on hard plastic and metal taps. A non-living object that carries germs from person to person is called a <strong>fomite</strong> (say it: FOE-might).</p>`,
        toolkit: `<p><strong>Viruses vs bacteria (Class 1 refresher):</strong></p>
<ul><li><strong>Viruses</strong> are tiny genetic packages that hijack your cells. They cause colds, the flu, COVID-19, and most fast-moving school stomach bugs.</li>
<li><strong>Bacteria</strong> are living single cells. Some cause strep throat, certain food poisonings (like Salmonella), and red, swollen infected skin cuts.</li></ul>
<p><strong>The skin paradox:</strong> unbroken skin blocks germs like a brick wall, yet people touch their eyes, nose, mouth, or food <strong>over 20 times an hour</strong> without noticing.</p>`
      },
      task: "Read Tab 2 and Tab 3 first. Match each school moment to its entry gate and germ type, then explain the two steps of how hands get germs inside your body.",
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
        { type: "text", f: "responses.q5", label: "Healthy skin blocks germs. In two clear steps, explain how unwashed hands still get germs inside your body.", rows: 3, placeholder: "Step 1: My hands pick up... Step 2: Then I touch...",
          mustMatch: "(mouth|nose|eye|eyes|face|food|snack|cut|gate|doorway)", mustHint: "Nurse Chen tip: make sure Step 2 names an entry gate (like touching your mouth, nose, eyes, or food)!" }
      ]
    },

    /* ---------------- S4 THURSDAY ---------------- */
    {
      id: "s4", nav: "THURSDAY", title: "Thursday: All three grades, water tests, and tools",
      kicker: "Day 4 // 34 students out sick", day: 4,
      imgs: [
        { src: "assets/s4a_soap_sanitizer.png", cap: "Left: 20 seconds with soap and running water rinses tough viruses down the drain. Right: alcohol gel struggles against tough shell viruses." },
        { src: "assets/s4b_vaccine_shield.png", cap: "Vaccines train your immune system ahead of time. Antibiotics only kill bacteria. Healthy classmates shield vulnerable peers." }
      ],
      chars: [
        { key: "vp", quote: "Thirty-four kids out today across Grades 7, 8, and 9, with a huge jump in the Grade 8 West Wing! Worried parents are asking doctors for penicillin. Good news on two tests, though: town tap water is clean, and 21 of the sick kids bring lunch from home." },
        { key: "marcus", quote: "My cancer treatment weakens my immune system. A stomach bug that keeps you home for a day could put me in the hospital. Since there is no shot for school stomach bugs, everyone else's habits are my shield." }
      ],
      words: ["immune", "vaccine", "antibiotic"],
      tabs: {
        dispatch: `<p><strong>Thursday's Attendance Report:</strong> <strong>34 students</strong> are home sick (Mon 3 -> Tue 7 -> Wed 18 -> Thu 34).</p>
<ul><li>All three grades (<strong>7, 8, and 9</strong>) and the <strong>computer lab</strong> now have cases.</li>
<li>The <strong>Grade 8 West Wing</strong> had its biggest single-day jump today (the day after Wednesday's fountain spill).</li>
<li><strong>Town water lab test:</strong> Centennial's tap water is <strong>100% clean</strong>.</li>
<li><strong>Cafeteria check:</strong> <strong>21 of the sick students</strong> bring lunch from home and never eat cafeteria food.</li></ul>`,
        evidence: `<p><strong>Soap and water vs hand sanitizer:</strong> Scrubbing with soap for <strong>20 seconds</strong> under running water loosens oil, grime, and germs off skin and physically rinses them down the drain. Alcohol hand sanitizer (60-70%) destroys flu and COVID viruses by dissolving their soft fatty outer coat, when hands look clean. However, tough stomach viruses have a <strong>hard protein shell with no fatty coat</strong>, and greasy fingers also block alcohol, so sanitizer works poorly on them.</p>
<p><strong>Vaccines vs antibiotics:</strong> A <strong>vaccine</strong> shows your immune system a harmless piece of a germ <strong>before</strong> you get sick so white blood cells build antibodies ahead of time (for specific viruses or bacteria). An <strong>antibiotic</strong> (like penicillin) is medicine taken <strong>after</strong> you have a <strong>bacterial</strong> infection. Antibiotics do <strong>nothing at all to viruses</strong>, and overusing them trains surviving bacteria into drug-resistant superbugs.</p>`,
        toolkit: `<p><strong>The human firewall:</strong> when 90 to 95% of a school is vaccinated against a disease like measles, germs hit dead ends before reaching vulnerable classmates like Marcus (<strong>community protection</strong>). When no routine vaccine exists, staying home while contagious and scrubbing with real soap are the only firewall Marcus has.</p>
<p><strong>Timeline check:</strong> notice WHEN things happened. Cafeteria-line kids got sick Tuesday and Grade 7s got sick Wednesday morning, <em>before</em> Wednesday afternoon's fountain spill!</p>`
      },
      task: "Check the numbers and timeline on Tab 1 and Tab 3, justify both choices using slide evidence, then study Tab 2 to fill the table and soap question.",
      fields: [
        { type: "choice", f: "judgments.s1.pattern", label: "Look at the daily numbers so far: 3, 7, 18, 34. What pattern do you see?",
          options: ["The sickness is spreading person to person, and speeding up each day", "About the same number of new students get sick each day", "The outbreak is already slowing down"],
          correct: "The sickness is spreading person to person, and speeding up each day",
          teachMap: {
            "The sickness is spreading person to person, and speeding up each day": { ok: true, msg: "Nurse Chen: Exactly! The daily jumps keep growing (+4, then +11, then +16), classic person-to-person acceleration." },
            "About the same number of new students get sick each day": { ok: false, msg: "Nurse Chen: Check the math between days: Mon 3 to Tue 7 (+4), Tue 7 to Wed 18 (+11), Wed 18 to Thu 34 (+16). Each jump is much bigger than the day before! Try another option." },
            "The outbreak is already slowing down": { ok: false, msg: "Nurse Chen: Look at the numbers again: 3 -> 7 -> 18 -> 34. Almost twice as many students are out each day! That means it is speeding up, not slowing down." }
          }
        },
        { type: "text", f: "judgments.s1.pattern_why", label: "Justify your pattern choice using the daily numbers (or water and lunch facts) on Tab 1.", rows: 2, placeholder: "The evidence shows this pattern because from Monday to Thursday..." },
        { type: "choice", f: "judgments.s2.top", label: "Which clue did MORE to carry the germ across all three grades (7, 8, and 9)?",
          options: ["The Wednesday afternoon fountain spill", "The all-week resin duck trading before lunch", "Both spread it across grades equally"],
          correct: "The all-week resin duck trading before lunch",
          teachMap: {
            "The all-week resin duck trading before lunch": { ok: true, msg: "Nurse Chen: Nailed it! Resin ducks were traded hand to hand across Grades 7, 8, and 9 starting Monday, before Wednesday's West Wing spill even happened." },
            "The Wednesday afternoon fountain spill": { ok: false, msg: "Nurse Chen: Check the timeline on Tab 3! Cafeteria-line kids got sick on Tuesday and Grade 7s got sick Wednesday morning, BEFORE Wednesday's 2:00 PM fountain spill! Plus that fountain is in the Grade 8 wing. What moved across all three grades since Monday?" },
            "Both spread it across grades equally": { ok: false, msg: "Nurse Chen: Look closely at WHERE and WHEN: the fountain spill was at 2:00 PM Wednesday inside the Grade 8 West Wing (causing Thursday's Grade 8 spike), while Grade 7s were ALREADY sick Wednesday morning! Which clue crossed all 3 grades from Monday on?" }
          }
        },
        { type: "text", f: "judgments.s2.why", label: "Justify your pick using WHEN or WHERE from the timeline on Tab 1 and Tab 3.", rows: 2, placeholder: "I picked ___ because on Tuesday/Wednesday..." },
        { type: "grid", f: "partB", label: "Compare: Vaccines vs Antibiotics (short phrases are great)", cols: ["Vaccines (shots)", "Antibiotics (medicine)"],
          rows: [ { k: "does", label: "What does it do?" }, { k: "when", label: "Before or after you get sick?" }, { k: "which", label: "Which germs does it fight?" }, { k: "others", label: "Effect on others / overuse risk?" } ] },
        { type: "text", f: "responses.q6", label: "Give TWO reasons washing with soap and running water works when alcohol sanitizer fails on a tough stomach virus.", rows: 3, placeholder: "Reason 1 (what sanitizer can't break): ... Reason 2 (what soap + water do): ..." }
      ]
    },

    /* ---------------- S5 FRIDAY AM ---------------- */
    {
      id: "s5", nav: "FRIDAY AM", title: "Friday 9:00 AM: Three suspects on the lab table",
      kicker: "Day 5 Morning // 55 students out sick (14% of school)", day: 5,
      imgs: [{ src: "assets/s5_suspects.png", cap: "Three lab suspect files: Influenza (lung virus), Norovirus (armored stomach virus), and Salmonella (foodborne bacteria)." }],
      chars: [ { key: "vp", quote: "Fifty-five students are home sick this morning: nearly 1 in every 7 kids in the building! Public Health sent over three suspect files. Compare all three against our week's clues and name our culprit." } ],
      words: ["incubation", "contagious", "bacteria"],
      tabs: {
        dispatch: `<p><strong>Friday Morning Report:</strong> <strong>55 of 400 students</strong> are out sick (Grade 8 West: 18, Grade 7 East: 12, Cafeteria line: 9, Grade 9 North: 8, Computer lab: 5, Other spots: 3).</p>
<p>Public Health's lab has narrowed the outbreak down to <strong>three suspects</strong> on Tab 2. Only one fits <strong>every</strong> piece of evidence from Monday to Friday.</p>`,
        evidence: `<p><strong>Suspect A: Influenza (the flu), a respiratory virus.</strong> Attacks lungs and throat. Incubation: 1 to 4 days. High fever, dry cough, sore throat, body aches, stuffy nose. Lasts <strong>5 to 7 days</strong>. Spreads mainly in breath droplets. Fragile outer coat: easily destroyed by soap or alcohol hand sanitizer.</p>
<p><strong>Suspect B: Norovirus (stomach bug), a digestive virus.</strong> Attacks stomach and gut. Incubation: <strong>12 to 48 hours</strong>. Sudden stomach cramps, vomiting, watery diarrhea, mild fever; cough is rare. Most recover in <strong>24 to 48 hours</strong>. Tiny dose: just <strong>18 virus particles</strong> can infect you! Survives for days on hard plastic and metal taps. Recovering people still shed virus for <strong>48 hours after</strong> symptoms stop. Hard protein shell: alcohol gel works poorly, and mopping with plain soap and water spreads it around; surfaces need a <strong>bleach disinfectant</strong>.</p>
<p><strong>Suspect C: Salmonella (food poisoning), a digestive bacteria.</strong> Comes from contaminated food like undercooked poultry or eggs. Incubation: 6 hours to 3 days. Stomach cramps, diarrhea, fever, sometimes vomiting. Lasts <strong>4 to 7 days</strong>. Sickens people who ate the same contaminated meal; rarely spreads fast from student to student across hallways.</p>`,
        toolkit: `<p><strong>How Health Officers rule suspects out:</strong></p>
<ul><li>Check <strong>symptoms</strong> (Tuesday's log: 88% stomach, under 5% cough).</li>
<li>Check <strong>recovery speed</strong> (24 to 48 hours vs nearly a full week).</li>
<li>Check <strong>who got sick</strong> (Thursday's check: 21 sick students bring lunch from home and never ate cafeteria food, and cases climbed day after day instead of one bad meal).</li></ul>`
      },
      task: "Your call as Health Officer: name the culprit germ, give one clue pointing TO your pick, and give one clue that rules OUT one of the other suspects.",
      fields: [
        { type: "choice", f: "responses.c1_name", label: "Which germ caused Case 55?",
          options: ["Suspect A: Influenza (the flu)", "Suspect B: Norovirus (stomach virus)", "Suspect C: Salmonella (food-poisoning bacteria)"],
          correct: "Suspect B: Norovirus (stomach virus)",
          teachMap: {
            "Suspect B: Norovirus (stomach virus)": { ok: true, msg: "Nurse Chen: Bullseye! Norovirus matches the 88% stomach symptoms, the fast 24 to 48 hour recovery, survival on plastic ducks, and why plain soap mopping failed. Now write your two proof clues below!" },
            "Suspect A: Influenza (the flu)": { ok: false, msg: "Nurse Chen: Compare Suspect A with Tuesday's chart! Influenza attacks the lungs (cough, sore throat) and lasts 5 to 7 days. At Centennial, under 5% had a cough, 88% had vomiting/diarrhea, and kids recovered in 24 to 48 hours. Check the other suspects!" },
            "Suspect C: Salmonella (food-poisoning bacteria)": { ok: false, msg: "Nurse Chen: Good thought checking a stomach germ! However, check two facts: (1) on Thursday, 21 sick students brought lunch from home and never ate cafeteria food, and (2) Salmonella lasts 4 to 7 days and rarely spreads fast on plastic toys. Which stomach germ fits a 24 to 48 hour recovery?" }
          }
        },
        { type: "text", f: "responses.c1_clue1", label: "Clue 1: one piece of evidence (with a fact or number) that points TO your culprit.", rows: 2, placeholder: "The evidence shows ___, which matches..." },
        { type: "text", f: "responses.c1_clue2", label: "Clue 2: name a suspect you ruled OUT, and give the evidence that proves it cannot be that germ.", rows: 2, placeholder: "It cannot be Suspect ___ because..." }
      ]
    },

    /* ---------------- S6 FRIDAY NOON ---------------- */
    {
      id: "s6", nav: "FRIDAY NOON", title: "Friday 12:00 PM: Reconstruct the chain",
      kicker: "Day 5 Midday // Witness follow-up", day: 5,
      imgs: [{ src: "assets/s6_spread_map.png", cap: "Tracing both pathways: fountain tap contact in the West Wing and plastic ducks traded before lunch." }],
      chars: [
        { key: "boudreau", quote: "When I cleaned Wednesday's spill by the fountain, I only had warm water and regular floor soap on my cart. Then I wiped down the fountain's metal push-tap with that same cloth." },
        { key: "jayden", quote: "I wasn't near Wednesday's spill when it happened, but I drank from that fountain Thursday morning. By Thursday night, I was throwing up." },
        { key: "sophie", quote: "Kids are still trading ducks out of their pockets right in the lunch line, and almost nobody washes with soap first because the bathroom line is busy." }
      ],
      words: ["fomite", "incubation", "antibiotic"],
      tabs: {
        dispatch: `<p>You know <em>what</em> hit Centennial. Now prove <em>how</em> both pathways worked, why parents' antibiotic requests won't help, and how classmates protect Marcus.</p>`,
        evidence: `<p><strong>Review the three witness quotes above:</strong></p>
<ul><li>Look at what Mr. Boudreau used on the floor and then on the <strong>fountain tap</strong>.</li>
<li>Look at the hours between Jayden using that fountain (Thursday morning) and getting sick (Thursday night), and compare that to your culprit's incubation time on Friday AM.</li>
<li>Remember: parents are asking clinics for <strong>penicillin</strong> (an antibiotic), and <strong>Marcus</strong> has a weakened immune system from cancer care.</li></ul>`,
        toolkit: `<p><strong>How to write a clear cause-and-effect chain:</strong> link each step with words like <em>"first," "then,"</em> and <em>"so."</em></p>
<p><em>Model from a different case (head lice):</em> "First, a student with lice wore shared class headphones. Then lice clung to the ear pads instead of dying. So the next student who put those headphones on got lice too."</p>`
      },
      task: "Number the 5 steps of the resin-duck chain in order (each number 1 to 5 used once). Then explain the fountain pathway, the penicillin problem, and protecting Marcus.",
      fields: [
        { type: "order", f: "responses.chain", label: "Number the 5 steps of the resin-duck chain from 1 (happens first) to 5 (happens last):",
          expectOrder: { b: "1", e: "2", d: "3", a: "4", c: "5" },
          stepHints: {
            "1": "Step 1 must be how germs first reach the toy: a student who still has virus on their hands holds and trades a plastic resin duck.",
            "2": "Step 2 happens on the toy itself: tough virus particles stay alive on the hard plastic duck (acting as a fomite).",
            "3": "Step 3 is how the duck crosses grades: the duck is handed to a classmate from another grade at the lockers.",
            "4": "Step 4 happens on the way to eat: that classmate walks straight into the cafeteria without washing hands with soap.",
            "5": "Step 5 is how the germ finally enters the body: they pick up a sandwich, and the virus enters through the mouth gate."
          },
          items: [
            { k: "a", t: "That classmate walks straight into the cafeteria without washing hands with soap." },
            { k: "b", t: "A student who still has virus on their hands holds and trades a plastic resin duck." },
            { k: "c", t: "They pick up a sandwich, and the virus enters through the mouth gate." },
            { k: "d", t: "The duck is handed to a classmate from another grade at the lockers." },
            { k: "e", t: "Tough virus particles stay alive on the hard plastic duck (acting as a fomite)." }
          ] },
        { type: "text", f: "responses.c2", label: "How did Wednesday's fountain spill make students like Jayden sick on Thursday night, even though Jayden wasn't at the spill? Use Mr. Boudreau's and Jayden's clues.", rows: 3, placeholder: "Plain soap did not... Then Mr. Boudreau wiped... So when Jayden..." },
        { type: "text", f: "responses.c3a", label: "Why won't penicillin (an antibiotic) cure the 55 sick students?", rows: 2, placeholder: "Penicillin won't cure them because...",
          mustMatch: "(virus|viruses|viral|bacteria|bacterial)", mustHint: "Nurse Chen tip: connect BOTH words in your answer: antibiotics only kill bacteria, and Norovirus is a virus!" },
        { type: "text", f: "responses.c3b", label: "Name one specific habit classmates must follow to protect Marcus, and explain why it keeps him safe.", rows: 2, placeholder: "Classmates must ___ because..." }
      ]
    },

    /* ---------------- S7 FRIDAY 3:15 PM ---------------- */
    {
      id: "s7", nav: "FRIDAY 3:15", title: "Friday 3:15 PM: Your Monday Morning Game Plan",
      kicker: "Final Briefing // Before the buses leave", day: 5,
      imgs: [{ src: "assets/s7_monday_plan.png", cap: "Breaking every link in the chain before Monday's morning bell." }],
      chars: [
        { key: "vp", quote: "Buses roll in ten minutes. Give me three crystal-clear rules for Monday morning. For each rule, tell me WHO does WHAT, and the science reason WHY it stops this germ." },
        { key: "marcus", quote: "I want to be in class on Monday. Make sure the plan actually stops this bug." }
      ],
      words: ["contagious", "fomite"],
      tabs: {
        dispatch: `<p>Vice-Principal Raman needs <strong>3 clear school rules for Monday morning</strong> so the outbreak stops instead of hitting 100 students:</p>
<ul><li><strong>Rule 1:</strong> when recovering students are allowed to return to school</li>
<li><strong>Rule 2:</strong> how custodians must clean fountains, taps, desks, and door handles</li>
<li><strong>Rule 3:</strong> what students must do about resin ducks and washing hands before eating</li></ul>`,
        evidence: `<p><strong>Need to double-check a science fact?</strong> You can click back to earlier days on the left at any time before you commit:</p>
<ul><li><strong>Thursday (Tab 2):</strong> why soap + water work when sanitizer fails</li>
<li><strong>Friday AM (Tab 2):</strong> how many hours people keep shedding the germ after they feel better, and what cleaner destroys it on surfaces</li></ul>`,
        toolkit: `<p><strong>Checklist for full marks on each rule:</strong></p>
<ul><li><strong>What people must do:</strong> be specific (include exact hours, exact cleaner, or seconds of scrubbing).</li>
<li><strong>Why it stops the germ:</strong> connect your rule to how this specific virus survives or spreads.</li></ul>
<p><em>Model from a different case (head lice):</em> What: "Students pause sharing hats, helmets, and headphones all week." Why: "Lice crawl from head to head on shared fabric and plastic, so pausing sharing cuts off their bridge."</p>
<p><strong>Bonus challenge:</strong> outbreak detectives have a famous two-word nickname for the very first person who brings an illness into a group or school.</p>`
      },
      task: "Write all 3 Monday rules (both WHAT and WHY), click TEST MY DRAFT RULES ON THE SCHOOL to see how Marcus, Mr. Boudreau, and Sophie react, then press COMMIT MY MONDAY PLAN to open Case Closed.",
      fields: [
        { type: "text", f: "responses.rule1_what", label: "Rule 1 (returning after being sick): what must sick or recovering students do?", rows: 2, placeholder: "Students who threw up or had diarrhea must stay home until..." },
        { type: "text", f: "responses.rule1_why", label: "Rule 1: why does that rule stop this virus?", rows: 2, placeholder: "This stops the spread because recovering people still..." },
        { type: "text", f: "responses.rule2_what", label: "Rule 2 (cleaning surfaces): what must custodians use and do on taps, fountains, desks, and handles?", rows: 2, placeholder: "Custodians must disinfect surfaces using..." },
        { type: "text", f: "responses.rule2_why", label: "Rule 2: why does that rule stop this virus?", rows: 2, placeholder: "This works because plain soap and alcohol..." },
        { type: "text", f: "responses.rule3_what", label: "Rule 3 (resin ducks + lunch handwashing): what must students do before lunch?", rows: 2, placeholder: "Students must pause ___ and wash hands with ___ for..." },
        { type: "text", f: "responses.rule3_why", label: "Rule 3: why does that rule stop this virus?", rows: 2, placeholder: "This breaks the chain because..." },
        { type: "text", f: "responses.bonus", label: "Optional Bonus: two-word detective nickname for the very first case in an outbreak", rows: 1, placeholder: "two words...", optional: true },
        { type: "commit", label: "COMMIT MY MONDAY PLAN" }
      ],
      commitStation: true
    },

    /* ---------------- S8 CASE CLOSED ---------------- */
    {
      id: "s8", nav: "CASE CLOSED", title: "Case Closed: Public Health Verdict & Your File",
      kicker: "Debrief // Unlocked after commit", day: 5,
      locked: true,
      imgs: [{ src: "assets/s8_verdict.png", cap: "Case 55 closed: Norovirus confirmed, Monday protocol active, new cases drop to zero by Wednesday." }],
      chars: [ { key: "vp", quote: "Case 55 is closed! For a Health Officer who signed up to hand out ice packs for gym-class scraped knees, you just saved our school week. Public Health confirmed Norovirus, and with our Monday rules in place, new cases dropped to zero by mid-week. Open Tab 3 (Your File) to compare your log with the official findings." } ],
      words: ["incubation", "fomite", "contagious"],
      tabLabels: { dispatch: "1. Official Verdict", evidence: "2. Health Unit Plan", yourfile: "3. Your File", toolkit: "4. Sources & Next Class" },
      tabs: {
        dispatch: `<p><strong>Official Culprit: Suspect B, Norovirus</strong> (a stomach virus), not Influenza and not Salmonella.</p>
<ul><li><strong>Why Influenza is ruled out:</strong> 88% had vomiting/diarrhea and under 5% had a cough, pointing to the digestive system, not the lungs. Flu also lasts 5 to 7 days rather than 24 to 48 hours.</li>
<li><strong>Why Salmonella is ruled out:</strong> 21 of the 55 sick students brought lunch from home and never ate cafeteria food, town water was clean, recovery took 1 to 2 days (not 4 to 7), and cases accelerated person to person all week (3 -> 7 -> 18 -> 34 -> 55).</li>
<li><strong>How both pathways worked:</strong> plastic resin ducks acted as <strong>fomites</strong> carrying norovirus across Grades 7, 8, and 9 right before lunch (mouth gate). Then Wednesday's fountain spill caused Thursday's West Wing spike because plain floor soap did not kill norovirus and the same cloth wiped the tap Jayden used Thursday morning (fitting the 12 to 48 hour incubation).</li>
<li><strong>Why penicillin fails:</strong> antibiotics only kill living bacteria; norovirus is a virus.</li>
<li><strong>Bonus answer:</strong> <strong>Patient Zero</strong> (also called the <strong>index case</strong>).</li></ul>`,
        evidence: `<p><strong>Public Health's Monday Morning Game Plan:</strong></p>
<ul><li><strong>Rule 1 (48-Hour Stay-Home Rule):</strong> anyone with vomiting or diarrhea stays home until <strong>48 full hours after</strong> symptoms completely stop, because recovering people still shed active norovirus. This shields classmates like Marcus.</li>
<li><strong>Rule 2 (Bleach Disinfection):</strong> custodians disinfect drinking fountains, taps, desks, keyboards, and door handles with a <strong>bleach solution</strong> (using clean cloths), because plain soap and alcohol wipes leave tough norovirus shells alive.</li>
<li><strong>Rule 3 (Duck Pause + 20-Second Soap Wash):</strong> pause resin-duck trading until the outbreak ends (ducks are fomites), and wash hands with <strong>soap and running water for 20 seconds</strong> before eating because alcohol hand sanitizer works poorly on norovirus.</li></ul>`,
        yourfile: "@review",
        toolkit: `<p><strong>Verified Public Health Sources:</strong> Public Health Agency of Canada (Norovirus Fact Sheet &amp; Hand Hygiene), Nova Scotia Health &amp; 811 (School GI Outbreak &amp; 48-Hour Exclusion Guidelines), Immunize Canada, and <em>From the Ground Up</em> (Grade 8 Health).</p>
<p><strong>Coming in Class 3 (The Superbug Threat):</strong> what happens when bacteria evolve to beat our antibiotics? In 1945, penicillin discoverer Alexander Fleming warned the world that misusing antibiotics would breed resistant superbugs, and his warning came true.</p>`
      },
      task: "Open Tab 3 (Your File) to inspect your results and read your Monday Plan alongside Public Health's version. Then complete the two quick debrief reflections below.",
      fields: [
        { type: "text", f: "responses.debrief_evidence", label: "Check your Monday first guess in Tab 3 (Your File). Which piece of evidence during the week confirmed your guess or made you change your mind?", rows: 2, placeholder: "On Monday I guessed ___, and the clue that ___ was...", optional: true },
        { type: "text", f: "responses.selfcheck", label: "Compare your 3 Monday rules in Tab 3 with Tab 2 (Health Unit Plan). What is one detail you nailed, or one detail you would sharpen?", rows: 2, placeholder: "One detail I nailed / would sharpen is...", optional: true }
      ]
    }
  ],

  key: [
    { st: "MONDAY",      label: "Monday first guess", f: "judgments.s0.guess", whyF: "judgments.s0.why", noKey: true, note: "A first hypothesis is never marked wrong when backed by Monday's evidence. Health Officers update their thinking as clues arrive." },
    { st: "TUESDAY",     label: "Body system under attack", f: "judgments.s1.choice", whyF: "judgments.s1.why", answer: "The stomach and gut (digestive system)", note: "88% had stomach cramps, vomiting, and diarrhea; fewer than 5% had a cough." },
    { st: "WEDNESDAY",   label: "1. Ducks, then eating a snack", f: "matches.a1", pair: { gate: "Mouth", germ: "Virus" } },
    { st: "WEDNESDAY",   label: "2. Sneezes in the stairwell", f: "matches.a2", pair: { gate: "Nose", germ: "Virus" } },
    { st: "WEDNESDAY",   label: "3. Rubbing eyes after keyboard", f: "matches.a3", pair: { gate: "Eyes", germ: "Virus" } },
    { st: "WEDNESDAY",   label: "4. Infected gym-floor knee scrape", f: "matches.a4", pair: { gate: "Cut or scrape", germ: "Bacteria" }, note: "Red, hot, swollen skin scrapes are bacterial infections entering broken skin." },
    { st: "THURSDAY",    label: "Pattern in daily numbers (3, 7, 18, 34)", f: "judgments.s1.pattern", whyF: "judgments.s1.pattern_why", answer: "The sickness is spreading person to person, and speeding up each day", note: "Daily jumps grew larger (+4, +11, +16, then +21 on Friday), and tap water + home lunches ruled out a single source." },
    { st: "THURSDAY",    label: "Main spreader across all 3 grades", f: "judgments.s2.top", whyF: "judgments.s2.why", answer: "The all-week resin duck trading before lunch", note: "Ducks moved across Grades 7, 8, and 9 from Monday on; cafeteria and Grade 7 cases appeared before Wednesday afternoon's spill." },
    { st: "FRIDAY AM",   label: "Culprit pathogen", f: "responses.c1_name", whyF: "responses.c1_clue1", answer: "Suspect B: Norovirus (stomach virus)" },
    { st: "FRIDAY NOON", label: "5-step resin-duck chain", f: "responses.chain", order: { b: 1, e: 2, d: 3, a: 4, c: 5 },
      orderText: "1. Sick hands hold duck -> 2. Virus survives on plastic fomite -> 3. Traded to another grade -> 4. No soap wash before cafeteria -> 5. Sandwich carries virus into mouth" }
  ],

  /* Dynamic sim callbacks reacting to the student's own Monday hypothesis */
  callbacks: {
    s2: {
      who: "nurse",
      byGuess: {
        "A virus that attacks the stomach": "Yesterday you hypothesized a stomach virus right away, and look at Tuesday's chart: 88% have stomach cramps and vomiting! Now verify the body system and watch how it is travelling.",
        "A virus that attacks the lungs, like the flu": "Yesterday you guessed a lung virus like the flu. Check Tuesday's chart closely: fewer than 5% have a cough, while 88% are throwing up! Does a lung virus still fit?",
        "Bacteria from food": "Yesterday you wondered about bacteria in food. Today we do see cafeteria-line kids out sick, so keep watching who actually eats cafeteria food this week!",
        "Something in the West Wing drinking water": "Yesterday you flagged the West Wing drinking water. Public Health pulled a water sample for the town lab today (results arrive Thursday). Meanwhile, check today's symptom numbers!",
        "Too early to name one cause yet (watch Tuesday's log)": "Yesterday you waited for more clues before naming one cause. Four more cases arrived today plus our symptom percentages: time to lock in which body system is under attack!"
      }
    },
    s4: {
      who: "vp",
      byGuess: {
        "A virus that attacks the stomach": "Your Monday stomach-virus hunch is looking sharper every day: today's clean water test and 21 home-lunch cases just ruled out tap water and a bad cafeteria meal!",
        "A virus that attacks the lungs, like the flu": "Remember your Monday flu guess? Between Tuesday's stomach chart and today's jump across all three grades, we are definitely chasing a tough stomach germ, not a lung virus.",
        "Bacteria from food": "Remember how you suspected food bacteria on Monday? Check Tab 1: 21 of our sick students bring lunch from home and never touch cafeteria food!",
        "Something in the West Wing drinking water": "Remember how you suspected the West Wing water on Monday? Our town water lab report just came back 100% clean, so pipes aren't the culprit!",
        "Too early to name one cause yet (watch Tuesday's log)": "Holding off on Monday paid off: today's lab checks just ruled out both town tap water and cafeteria food, pointing straight at person-to-person surface spread!"
      }
    }
  }
};

window.CASE55 = CASE55;
