/* ============================================================================
   CASE 55: CENTENNIAL OUTBREAK - story/field data for the sim.
   Edit CONTENT here; the engine lives in index.html.
   Audience: Grade 8 (~12-13). Short sentences, plain words, terms glossed inline.
   House rule for this unit: no em dashes / en dashes in student-facing strings.
   Images are local: assets/<name>.png (generated with the Qwen engine, 2026-11-04).

   Design rules (2026-11-04 review, AUTHORING-STANDARD Gate C):
   - CHRONOLOGICAL ROLL-OUT: The story unfolds day by day (Mon -> Fri). Evidence
     arrives when it happens, mirroring a real investigation.
   - EVIDENCE stations hand out facts. APPLICATION stations only point back to where
     the facts are; they never restate the conclusion they assess.
   - Character quotes are testimony, never the investigator's conclusion.
   - The answer key below (`key`) is used ONLY by the S8 "Your file" review.
   Field options: `optional:true` = not needed for the station's check mark.
   ============================================================================ */

var CASE55 = {
  meta: {
    title: "CASE 55: CENTENNIAL OUTBREAK",
    subtitle: "An outbreak investigation at Centennial Junior High",
    hud: "OUTBREAK HUD // CASE 55",
    taskName: "HL8-Centennial-Case55-Sim"
  },

  characters: {
    vp:      { name: "Vice-Principal Priya Raman", role: "In charge of the outbreak response", img: "assets/char_vp_raman.png" },
    jayden:  { name: "Jayden", role: "Grade 8, West Wing", img: "assets/char_jayden.png" },
    sophie:  { name: "Sophie", role: "Grade 7, duck trader", img: "assets/char_sophie.png" },
    marcus:  { name: "Marcus", role: "Grade 9, weakened immune system", img: "assets/char_marcus.png" },
    nurse:   { name: "School Nurse", role: "Explains the science", img: null },
    boudreau:{ name: "Mr. Boudreau", role: "Custodian", img: null }
  },

  glossary: {
    outbreak: "When many more people get the same sickness than normal, in one place, at the same time.",
    symptom: "A sign of sickness that you can feel or see, like vomiting, a cough, or a fever.",
    pathogen: "Any germ that can make you sick. Viruses and bacteria are both pathogens.",
    virus: "A tiny germ that cannot live on its own. It has to get inside your body's cells to make copies of itself.",
    bacteria: "Tiny living cells. Most are harmless or helpful, but some make you sick.",
    contagious: "Able to pass a sickness to other people.",
    fomite: "An object that carries germs from one person to another, like a doorknob, a keyboard, or a toy.",
    incubation: "The waiting time between when a germ gets into your body and when you start to feel sick.",
    immune: "Your immune system is your body's defence team. It finds and fights germs.",
    antibiotic: "A medicine that kills bacteria.",
    vaccine: "A shot that trains your immune system to recognize a germ before you ever meet it.",
    hypothesis: "A smart guess based on the evidence you have so far."
  },

  stations: [
    /* ---------------- S0 BRIEFING (Sunday) ---------------- */
    {
      id: "s0", nav: "BRIEFING", title: "Sunday Night: Your new assignment",
      kicker: "The dispatch", day: 0,
      imgs: [{ src: "assets/case55_cover.png", cap: "Centennial Junior High, a school with 400 students." }],
      chars: [ { key: "vp", quote: "Welcome to Centennial Junior High. Starting tomorrow, you are our school health investigator. It is usually a quiet job. Just keep an eye on the daily sick list and let me know if you spot a pattern." } ],
      words: ["outbreak", "symptom"],
      tabs: {
        dispatch: `<p>You have been assigned to Centennial Junior High as the <strong>school health investigator</strong> for the week.</p>
<p>Your job is to watch the evidence as it comes in each day. If many students get sick at the same time, it could be an <strong>outbreak</strong>. If that happens, you will need to figure out what is causing it and write a plan to stop it.</p>`,
        evidence: `<p><strong>Centennial Junior High</strong> has 400 students in Grades 7, 8, and 9.</p>
<ul><li>Grade 7s are in the East Wing.</li>
<li>Grade 8s are in the West Wing.</li>
<li>Grade 9s are in the North Wing.</li>
<li>Everyone shares the cafeteria and the computer lab.</li></ul>`,
        toolkit: `<p><strong>How this works:</strong> each station is a new day of the week. You will get new evidence in the middle of the screen. The <strong>Investigation Log</strong> on the right tells you what to do and is where you type your answers.</p>
<p>Use the tabs (Dispatch, Evidence, Toolkit) to see all the information for that day. Click any picture to make it bigger. The <strong>Read to me</strong> button reads the station out loud.</p>
<p>Everything you type <strong>saves to the server by itself</strong>, so you can close the tab and finish later.</p>`
      },
      task: "Pick your class section. Then press READY to start your week.",
      fields: [
        { type: "section", label: "Your class section" },
        { type: "ack", label: "READY: START THE WEEK" }
      ]
    },

    /* ---------------- S1 MONDAY ---------------- */
    {
      id: "s1", nav: "MONDAY", title: "Monday: The first reports",
      kicker: "3 students sick", day: 1,
      imgs: [{ src: "assets/s1_evidence_board.png", cap: "The office evidence board. You start tracking the sick students." }],
      chars: [ { key: "vp", quote: "Three students from the Grade 8 West Wing went home sick today. That is a bit high, but it happens. What do you think is going on?" } ],
      words: ["symptom", "hypothesis"],
      tabs: {
        dispatch: `<p><strong>Monday's Report:</strong> 3 students went home sick.</p>
<p>All 3 students are in the <strong>Grade 8 West Wing</strong>.</p>`,
        evidence: `<p><strong>Symptoms:</strong> the students who went home complained of sudden stomach cramps and throwing up (vomiting).</p>`,
        toolkit: `<p><strong>Detective tip:</strong> scientists start by making a <strong>hypothesis</strong>. That is a smart guess based on the evidence you have so far. It is okay if your first guess is wrong! Real detectives change their minds when they get new evidence.</p>`
      },
      task: "Based on the tiny bit of evidence you have, make your first guess. What is making students sick?",
      fields: [
        { type: "choice", f: "judgments.s0.guess", label: "First guess: what do you think is making students sick?",
          options: ["A virus that attacks the lungs, like the flu", "A virus that attacks the stomach", "Bacteria in bad cafeteria food", "Something in the school's tap water", "I have no idea yet"] }
      ]
    },

    /* ---------------- S2 TUESDAY ---------------- */
    {
      id: "s2", nav: "TUESDAY", title: "Tuesday: It's spreading",
      kicker: "7 students sick", day: 2,
      imgs: [],
      chars: [
        { key: "vp", quote: "Seven students out today. Four more from the Grade 8 West Wing, but now we have some sick students who were working in the cafeteria lunch line, too." },
        { key: "sophie", quote: "Everyone is trading these little resin ducks at the lockers! Grade 7s, 8s, and 9s all do it, mostly right before we go into the cafeteria for lunch. I traded mine with three people today." }
      ],
      words: ["symptom", "outbreak"],
      tabs: {
        dispatch: `<p><strong>Tuesday's Report:</strong> 7 students went home sick.</p>
<ul><li>4 more from the Grade 8 West Wing.</li>
<li>The first students from the cafeteria lunch line.</li></ul>`,
        evidence: `<p>The school nurse gathered symptom data from all the sick students so far:</p>
<ul><li><strong>88%</strong> have sudden stomach cramps, vomiting, and watery diarrhea.</li>
<li><strong>45%</strong> have a mild fever and a headache.</li>
<li><strong>Fewer than 5%</strong> have a cough, a sore throat, or a stuffy nose.</li>
<li>The students from Monday are already starting to feel better after just <strong>24 hours</strong>.</li></ul>`,
        toolkit: `<p><strong>Detective tip:</strong> a germ that attacks the <strong>lungs and airways</strong> (the respiratory system) usually causes coughing, sneezing, and a sore throat. A germ that attacks the <strong>stomach and gut</strong> (the digestive system) usually causes cramps, vomiting, and diarrhea.</p>`
      },
      task: "Look at the symptom data on the Evidence tab. Decide which body system the germ is attacking, and back it up with a number.",
      fields: [
        { type: "choice", f: "judgments.s1.choice", label: "Which body system is the germ attacking?", options: ["The stomach and gut (digestive system)", "The lungs and airways (respiratory system)", "Not sure yet"] },
        { type: "text", f: "judgments.s1.why", label: "Give one clue from the evidence that proves your pick. Include a number.", rows: 2, placeholder: "One clue is that ___% of sick students have..." }
      ]
    },

    /* ---------------- S3 WEDNESDAY ---------------- */
    {
      id: "s3", nav: "WEDNESDAY", title: "Wednesday: Jumping wings",
      kicker: "18 students sick", day: 3,
      imgs: [
        { src: "assets/s2_fountain_ducks.png", cap: "Left: the west-wing fountain cleanup. Right: resin ducks traded at the lockers." },
        { src: "assets/s3_entry_gates.png", cap: "The four doorways germs use to get inside your body." }
      ],
      chars: [
        { key: "jayden", quote: "This afternoon, a kid threw up right beside the west-wing water fountain. Mr. Boudreau mopped it up fast, but he just used warm water and floor soap." },
        { key: "nurse", quote: "Germs can't soak through healthy skin. But your hands are like a delivery truck. You touch a shared keyboard, then you touch your mouth, and the germ has made the trip." }
      ],
      words: ["pathogen", "virus", "bacteria", "fomite"],
      tabs: {
        dispatch: `<p><strong>Wednesday's Report:</strong> 18 students went home sick.</p>
<p>The sickness has jumped to the <strong>Grade 7 East Wing</strong>, even though it is far away from the Grade 8 rooms.</p>
<p><strong>2:00 PM:</strong> A student threw up beside the Grade 8 hallway drinking fountain. Throwing up sprays tiny drops onto taps and tiles. The mess was mopped up with <strong>plain warm water and floor soap</strong>.</p>`,
        evidence: `<p><strong>How germs get in.</strong> A germ needs a <strong>doorway</strong> into your body. There are four:</p>
<ul><li><strong>Mouth:</strong> swallowing germs on food, chewed pens, or dirty fingers.</li>
<li><strong>Nose:</strong> breathing in tiny drops after someone coughs or sneezes.</li>
<li><strong>Eyes:</strong> rubbing your eyes with fingers that touched shared things.</li>
<li><strong>Cuts or scrapes:</strong> germs slip in through broken skin.</li></ul>
<p>Some germs stay alive for days on hard plastic and metal. An object that carries germs is called a <strong>fomite</strong> (say it: FOE-might).</p>`,
        toolkit: `<p><strong>Two kinds of germs:</strong></p>
<ul><li><strong>Viruses</strong> are much smaller than bacteria. They cause colds, the flu, and most stomach bugs.</li>
<li><strong>Bacteria</strong> are tiny living cells. Some cause strep throat, some kinds of food poisoning, and infected cuts.</li></ul>`
      },
      task: "Read about entry gates on the Evidence tab. For each school moment, choose the entry gate and the type of germ. Then explain how hands get germs inside you.",
      fields: [
        { type: "pair", f: "matches.a1", label: "1. Trading resin ducks with a sick classmate, then eating a snack without washing your hands.",
          selects: [ { key: "gate", label: "Entry gate", options: ["Mouth", "Nose", "Eyes", "Cut or scrape"] }, { key: "germ", label: "Germ type", options: ["Virus", "Bacteria"] } ] },
        { type: "pair", f: "matches.a2", label: "2. Walking up a crowded stairwell right after three people with colds sneeze.",
          selects: [ { key: "gate", label: "Entry gate", options: ["Mouth", "Nose", "Eyes", "Cut or scrape"] }, { key: "germ", label: "Germ type", options: ["Virus", "Bacteria"] } ] },
        { type: "pair", f: "matches.a3", label: "3. Rubbing your itchy eyes after typing on a keyboard that a classmate with a cold just used.",
          selects: [ { key: "gate", label: "Entry gate", options: ["Mouth", "Nose", "Eyes", "Cut or scrape"] }, { key: "germ", label: "Germ type", options: ["Virus", "Bacteria"] } ] },
        { type: "pair", f: "matches.a4", label: "4. Sliding across a dirty gym floor with an uncovered scrape on your knee, which gets red and swollen.",
          selects: [ { key: "gate", label: "Entry gate", options: ["Mouth", "Nose", "Eyes", "Cut or scrape"] }, { key: "germ", label: "Germ type", options: ["Virus", "Bacteria"] } ] },
        { type: "text", f: "responses.q5", label: "Healthy skin blocks germs. So how do your hands get germs inside your body? Explain it in two steps.", rows: 3, placeholder: "Step 1: My hands... Step 2: Then I..." }
      ]
    },

    /* ---------------- S4 THURSDAY ---------------- */
    {
      id: "s4", nav: "THURSDAY", title: "Thursday: All three grades",
      kicker: "34 students sick", day: 4,
      imgs: [
        { src: "assets/s4a_soap_sanitizer.png", cap: "Left: soap and running water rinse germs down the drain. Right: alcohol gel doesn't work well on every germ." },
        { src: "assets/s4b_vaccine_shield.png", cap: "Vaccines train your immune system. Antibiotics work on bacteria only." }
      ],
      chars: [
        { key: "vp", quote: "Thirty-four out today! All three grades are hit. Parents are calling clinics asking for antibiotics to cure their kids. The town tested our tap water and it's clean. Oh, and 21 of the sick kids bring lunch from home." },
        { key: "marcus", quote: "My cancer treatment means my immune system can't fight germs the way yours can. A bug that keeps you home for a day could put me in the hospital. I need everyone else to help protect me." }
      ],
      words: ["immune", "vaccine", "antibiotic"],
      tabs: {
        dispatch: `<p><strong>Thursday's Report:</strong> 34 students went home sick.</p>
<ul><li>All three grades (7, 8, and 9) now have sick students.</li>
<li>The Grade 8 West Wing has its biggest jump yet.</li>
<li>The town tested the school's tap water. <strong>It is clean.</strong></li>
<li><strong>21 of the sick students</strong> bring lunch from home and never buy cafeteria food.</li></ul>`,
        evidence: `<p><strong>Soap vs sanitizer:</strong> Scrubbing with soap for <strong>20 seconds</strong> under running water lifts germs off your skin and rinses them down the drain. Alcohol hand sanitizer kills many germs (like flu) by breaking their soft, fatty outer coat. But some tough stomach viruses have a <strong>hard protein shell with no fatty coat</strong>, so alcohol gel <strong>does not work well</strong> on them.</p>
<p><strong>Vaccines vs antibiotics:</strong> A <strong>vaccine</strong> trains your immune system to recognize a germ <strong>before</strong> you meet it. An <strong>antibiotic</strong> is a medicine that kills <strong>bacteria</strong> after you are sick. Antibiotics do <strong>nothing to viruses</strong>. Using them when you don't need them creates "superbugs."</p>`,
        toolkit: `<p><strong>The human firewall:</strong> when about 90 to 95% of a school is vaccinated against a germ, that germ hits dead ends. It has trouble reaching people like Marcus who can't fight back.</p>
<p><strong>Detective tip:</strong> look back at the timeline. Which clue was already happening when the cafeteria line and the Grade 7 wing got sick? Which clue touches all three grades?</p>`
      },
      task: "All three grades are sick. Decide what spread it the most. Then use the Evidence tab to fill the table and answer the soap question.",
      fields: [
        { type: "choice", f: "judgments.s2.top", label: "Which clue spread the sickness to all three grades the most?", options: ["The fountain spill", "The resin ducks", "Both about the same"] },
        { type: "text", f: "judgments.s2.why", label: "Why? Use one clue about WHEN or WHERE from the week so far.", rows: 2, placeholder: "I think ___ because on ___ day..." },
        { type: "grid", f: "partB", label: "Vaccines vs antibiotics", cols: ["Vaccines (shots)", "Antibiotics (medicine)"],
          rows: [ { k: "does", label: "What does it do?" }, { k: "when", label: "Before or after you are sick?" }, { k: "which", label: "Which germs does it work on?" }, { k: "others", label: "How does it affect other people?" } ] },
        { type: "text", f: "responses.q6", label: "Give TWO reasons washing with soap and running water works when hand sanitizer fails on a tough stomach virus.", rows: 3, placeholder: "Reason 1: Soap... Reason 2: The virus's shell..." }
      ]
    },

    /* ---------------- S5 FRIDAY AM ---------------- */
    {
      id: "s5", nav: "FRIDAY AM", title: "Friday 9:00 AM: The lab results",
      kicker: "55 students sick", day: 5,
      imgs: [{ src: "assets/s5_suspects.png", cap: "Two of the suspects: influenza and norovirus." }],
      chars: [ { key: "vp", quote: "Fifty-five students are home sick. That is 1 in 7 kids! The health lab has narrowed it down to three suspects. You need to tell me which one it is." } ],
      words: ["incubation", "contagious", "bacteria"],
      tabs: {
        dispatch: `<p><strong>Friday's Report:</strong> 55 students are home sick.</p>
<p>The health lab has three suspects. Each file tells you how that germ behaves. Find the one that matches <strong>all</strong> the evidence from the week.</p>`,
        evidence: `<p><strong>Suspect A: Influenza (the flu), a virus.</strong> Attacks the lungs. High fever, dry cough, sore throat. Lasts about 5 to 7 days. Spreads through drops from coughs. Soap and sanitizer both kill it easily.</p>
<p><strong>Suspect B: Norovirus (a stomach bug), a virus.</strong> Attacks the stomach and gut. You feel sick 12 to 48 hours after the germ gets in. Sudden cramps, vomiting, diarrhea. Most feel better in 24 to 48 hours. Stays alive for days on hard plastic and metal taps. People are still contagious for <strong>48 hours after</strong> they feel better. Alcohol gel does not work well on it. Mopping with plain soap and water just spreads it around; a <strong>bleach cleaner</strong> is needed to kill it.</p>
<p><strong>Suspect C: Salmonella (food poisoning), a bacteria.</strong> Comes from bad food like undercooked chicken. Cramps, diarrhea, fever. Lasts about 4 to 7 days. It only makes sick the people who ate the same food. It rarely spreads from student to student.</p>`,
        toolkit: `<p><strong>How to decide:</strong> check the evidence one piece at a time. Do the symptoms match? Does how long it lasts match? Does it fit the fact that many sick students never ate cafeteria food? A suspect that fails even one strong test can be ruled out.</p>`
      },
      task: "Name the culprit. Then give one clue that points TO your culprit, and one clue that rules OUT a different suspect.",
      fields: [
        { type: "choice", f: "responses.c1_name", label: "Which germ caused Case 55?", options: ["Suspect A: Influenza (the flu)", "Suspect B: Norovirus (a stomach bug)", "Suspect C: Salmonella (food poisoning)"] },
        { type: "text", f: "responses.c1_clue1", label: "Clue 1: evidence that points TO your culprit.", rows: 2, placeholder: "The evidence shows ___, and this suspect..." },
        { type: "text", f: "responses.c1_clue2", label: "Clue 2: name a suspect you ruled OUT, and the evidence that rules it out.", rows: 2, placeholder: "It can't be ___ because..." }
      ]
    },

    /* ---------------- S6 FRIDAY NOON ---------------- */
    {
      id: "s6", nav: "FRIDAY NOON", title: "Friday 12:00 PM: Solve the spread",
      kicker: "Putting it together", day: 5,
      imgs: [{ src: "assets/s6_spread_map.png", cap: "The spread map: routes from the west-wing fountain and ducks passed hand to hand." }],
      chars: [
        { key: "boudreau", quote: "On Wednesday, I mopped that spill with what I had on my cart: warm water and floor soap. Then I wiped the fountain taps with the same cloth." },
        { key: "jayden", quote: "I drank from that fountain yesterday morning. By last night, I was throwing up." },
        { key: "sophie", quote: "We're all still trading ducks. Nobody washes their hands before lunch because the line for the sinks is way too long." }
      ],
      words: ["fomite", "incubation", "antibiotic"],
      tabs: {
        dispatch: `<p>Now connect your clues into a chain, the way a real investigator would. You already have everything you need from the week.</p>`,
        evidence: `<p>Read the new statements from Mr. Boudreau, Jayden, and Sophie above. Look closely at the times and actions they describe.</p>`,
        toolkit: `<p><strong>Detective tip:</strong> a strong explanation is a chain where each step leads to the next. Use the words "so" or "then" to join your steps. Example from a different case: <em>"A student with lice wore the class's shared headphones, then the lice crawled onto the headphones, so the next student who wore them got lice too."</em></p>`
      },
      task: "Put the steps of the duck chain in order. Then explain the fountain spill, the antibiotics problem, and how to protect Marcus.",
      fields: [
        { type: "order", f: "responses.chain", label: "Number the steps of the duck chain from 1 (first) to 5 (last).",
          items: [
            { k: "a", t: "That student walks into the cafeteria without washing their hands." },
            { k: "b", t: "A student who is getting sick handles a duck." },
            { k: "c", t: "They eat a sandwich, and the virus gets in through the mouth." },
            { k: "d", t: "The duck is traded to a student in a different grade." },
            { k: "e", t: "Tiny bits of virus stay alive on the hard plastic duck." }
          ] },
        { type: "text", f: "responses.c2", label: "Explain how the fountain spill spread the virus to kids who never saw it happen. Use Mr. Boudreau's and Jayden's statements.", rows: 3, placeholder: "The mop... then... so..." },
        { type: "text", f: "responses.c3a", label: "Why won't penicillin (an antibiotic) cure these sick students?", rows: 2, placeholder: "Penicillin won't work because..." },
        { type: "text", f: "responses.c3b", label: "Name one thing classmates should do to keep Marcus safe, and explain why.", rows: 2, placeholder: "Classmates should ___ because..." }
      ]
    },

    /* ---------------- S7 FRIDAY 3:15 PM ---------------- */
    {
      id: "s7", nav: "FRIDAY 3:15", title: "Friday 3:15 PM: The Monday Plan",
      kicker: "Three rules for Monday", day: 5,
      imgs: [{ src: "assets/s7_monday_plan.png", cap: "Monday reset: cleaning, handwashing, and duck trading." }],
      chars: [
        { key: "vp", quote: "It's 3:15. I need three clear rules for Monday morning before the doors open. Tell me exactly what people have to do, and why it will stop this germ." },
        { key: "marcus", quote: "I'm counting on your plan. I can't fight this one alone." }
      ],
      words: ["contagious", "fomite"],
      tabs: {
        dispatch: `<p>Vice-Principal Raman needs <strong>3 clear rules for Monday</strong> so that no more students get sick:</p>
<ul><li><strong>Rule 1:</strong> when sick students are allowed to come back</li>
<li><strong>Rule 2:</strong> cleaning the fountains, taps, desks, and handles</li>
<li><strong>Rule 3:</strong> the resin ducks and handwashing before lunch</li></ul>`,
        evidence: `<p><strong>Where to find your reasons:</strong> look back at:</p>
<ul><li><strong>Thursday:</strong> soap and water vs sanitizer</li>
<li><strong>Friday AM:</strong> the norovirus suspect file (how long people stay contagious, what kills it on surfaces)</li></ul>`,
        toolkit: `<p><strong>What a strong rule looks like:</strong> it says <strong>who</strong> does it, <strong>what</strong> they do, and <strong>when</strong>. A strong reason names the germ fact that makes the rule work.</p>
<p><em>Example from a lice outbreak:</em> Rule: "Students do not share hats or headphones until Friday." Why: "Lice crawl from head to head on shared things, so keeping things separate stops them."</p>
<p><strong>Bonus:</strong> outbreak detectives have a two-word nickname for the very first person who brings a sickness into a school or community.</p>`
      },
      task: "Write your 3 Monday rules (what to do and why), try the bonus, then COMMIT your plan. After you commit, your answers lock and the verdict unlocks.",
      fields: [
        { type: "text", f: "responses.rule1_what", label: "Rule 1 (coming back to school): what must people do?", rows: 2, placeholder: "Students who were sick must..." },
        { type: "text", f: "responses.rule1_why", label: "Rule 1: why does it stop this germ?", rows: 2, placeholder: "This works because the germ..." },
        { type: "text", f: "responses.rule2_what", label: "Rule 2 (cleaning): what must people do?", rows: 2, placeholder: "Custodians must..." },
        { type: "text", f: "responses.rule2_why", label: "Rule 2: why does it stop this germ?", rows: 2, placeholder: "This works because..." },
        { type: "text", f: "responses.rule3_what", label: "Rule 3 (ducks and handwashing): what must people do?", rows: 2, placeholder: "Students must..." },
        { type: "text", f: "responses.rule3_why", label: "Rule 3: why does it stop this germ?", rows: 2, placeholder: "This works because..." },
        { type: "text", f: "responses.bonus", label: "Bonus: the two-word nickname for the first person who brings a sickness in", rows: 1, placeholder: "two words...", optional: true },
        { type: "commit", label: "COMMIT MY MONDAY PLAN" }
      ],
      commitStation: true
    },

    /* ---------------- S8 CASE CLOSED ---------------- */
    {
      id: "s8", nav: "CASE CLOSED", title: "Case Closed: The verdict",
      kicker: "Debrief", day: 5,
      locked: true,
      imgs: [{ src: "assets/s8_verdict.png", cap: "Case 55 closed." }],
      chars: [ { key: "vp", quote: "Case 55 is closed. Compare your work with the health unit's findings. Every investigator misses something the first time. The good ones notice what they missed." } ],
      words: ["incubation", "fomite", "contagious"],
      tabLabels: { dispatch: "Verdict", evidence: "Health unit's plan", yourfile: "Your file", toolkit: "Sources" },
      tabs: {
        dispatch: `<p><strong>Verdict: Norovirus</strong>, a stomach virus. Not the flu, and not food poisoning.</p>
<ul><li><strong>Not the flu:</strong> 88% had stomach symptoms and fewer than 5% had a cough. The flu also lasts 5 to 7 days, not 1 to 2.</li>
<li><strong>Not Salmonella:</strong> 21 sick students never ate cafeteria food, and the numbers kept climbing all week instead of one spike after one bad meal.</li>
<li><strong>Norovirus fits everything:</strong> stomach symptoms, quick recovery, survives for days on plastic ducks and metal taps, and spreads from person to person.</li></ul>
<p><strong>How it spread:</strong> the ducks were <strong>fomites</strong>. They carried the virus between all three grades all week, right before lunch. That is how it reached the cafeteria line on Tuesday and Grade 7 on Wednesday. Wednesday's spill made things worse in the Grade 8 West Wing: plain soap spread the virus around, and the same cloth wiped the taps. Jayden drank there Thursday morning and was sick that night (fitting the 12 to 48 hour incubation).</p>
<p><strong>Penicillin fails</strong> because antibiotics only kill bacteria, and norovirus is a virus.</p>
<p><strong>Bonus answer:</strong> "<strong>patient zero</strong>" (or "index case").</p>`,
        evidence: `<p><strong>Centennial's Monday Game Plan (the health unit's version):</strong></p>
<ul><li><strong>Rule 1, the 48-hour rule:</strong> students stay home until 48 full hours after their last time vomiting, because people are still contagious after they feel better. This protects classmates like Marcus.</li>
<li><strong>Rule 2, bleach on surfaces:</strong> custodians clean taps, fountains, desks, and door handles with a bleach cleaner. Plain soap and alcohol gel leave norovirus alive.</li>
<li><strong>Rule 3, duck pause and real handwashing:</strong> pause the duck trading, and everyone scrubs with soap and running water for 20 seconds before lunch, because alcohol gel does not work well on norovirus.</li></ul>`,
        yourfile: "@review",
        toolkit: `<p><strong>Sources:</strong> Public Health Agency of Canada, Nova Scotia Health and 811, Immunize Canada, and From the Ground Up Grade 8 Health.</p>
<p><strong>Coming up next class:</strong> what happens when antibiotics stop working? In 1945, Alexander Fleming warned that misusing antibiotics would create superbugs. He was right.</p>`
      },
      task: "Read the verdict and open the Your file tab to check your answers. Then answer the two debrief questions.",
      fields: [
        { type: "text", f: "responses.debrief_evidence", label: "Look at your first guess in Your file. Which piece of evidence changed your mind, or proved you right?", rows: 2, placeholder: "My first guess was ___. The evidence that ___ was...", optional: true },
        { type: "text", f: "responses.selfcheck", label: "Name one thing you would add to or change in your Monday plan now, and why.", rows: 2, placeholder: "I would add ___ because...", optional: true }
      ]
    }
  ],

  key: [
    { st: "MONDAY",     label: "Your first guess", f: "judgments.s0.guess", noKey: true, note: "A first guess is never marked. What matters is whether the evidence changed it." },
    { st: "TUESDAY",    label: "Body system under attack", f: "judgments.s1.choice", answer: "The stomach and gut (digestive system)", note: "88% had stomach symptoms; fewer than 5% had a cough." },
    { st: "WEDNESDAY",  label: "1. Ducks, then a snack", f: "matches.a1", pair: { gate: "Mouth", germ: "Virus" } },
    { st: "WEDNESDAY",  label: "2. Sneezes in the stairwell", f: "matches.a2", pair: { gate: "Nose", germ: "Virus" } },
    { st: "WEDNESDAY",  label: "3. Rubbing eyes after the keyboard", f: "matches.a3", pair: { gate: "Eyes", germ: "Virus" } },
    { st: "WEDNESDAY",  label: "4. Scrape on the gym floor", f: "matches.a4", pair: { gate: "Cut or scrape", germ: "Bacteria" }, note: "Red, swollen scrapes are usually infected by bacteria." },
    { st: "THURSDAY",   label: "Biggest spreader across grades", f: "judgments.s2.top", answer: "The resin ducks", note: "Ducks moved between all three grades all week. The cafeteria line (Tuesday) and Grade 7 (Wednesday morning) were hit before the spill." },
    { st: "FRIDAY AM",  label: "The culprit", f: "responses.c1_name", answer: "Suspect B: Norovirus (a stomach bug)" },
    { st: "FRIDAY NOON",label: "The duck chain", f: "responses.chain", order: { b: 1, e: 2, d: 3, a: 4, c: 5 }, note: "Sick hands, virus survives on the duck, traded to another grade, no handwashing, mouth." }
  ]
};

window.CASE55 = CASE55;
