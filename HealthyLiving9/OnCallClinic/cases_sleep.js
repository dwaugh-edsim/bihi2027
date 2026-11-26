/* ============================================================================
   ON-CALL: ROOM 8 CLINIC - Sleep & Screen Science Case Bank (40 Cases)
   Grounded in HL9 CO1 (Unit 1 Sleep Clinic, Telemetry Audit, Hook Machine).
   Tiers: 1 (Intern), 2 (Resident), 3 (Attending), 4 (Chief of Medicine)
   Zero em/en dashes. Grade 9 medically accurate clinical scenarios.
   ============================================================================ */
window.ONCALL_CASES = window.ONCALL_CASES || [];
window.ONCALL_CASES.push(
  /* ---------------- TIER 1: INTERN (10 cases) ---------------- */
  { id:"slp01", dept:"sleep", tier:1, patient:"Jaden, 14", complaint:"Exhausted every morning in Period 1",
    vitals:"Sleeps 5.5 hours on school nights | Scrolls phone in bed",
    quote:"I get 5.5 hours of sleep a night. Isn't that plenty for a Grade 9 student?",
    q:"What is the Canadian 24-Hour Movement Guideline for sleep in youth ages 14 to 17?",
    opts:[
      "8 to 10 hours of uninterrupted sleep each night on a regular schedule",
      "6 to 7 hours of sleep per night, matching the standard adult minimum",
      "7 to 8 hours on school nights, plus 11 to 12 hours on weekends",
      "10 to 12 hours per night until high school graduation is completed"
    ],
    ans:0, pearl:"Canadian 24-Hour Movement Guidelines recommend 8 to 10 hours of uninterrupted sleep per night for ages 14 to 17, with consistent bed and wake times, to support brain development, memory, mood, and recovery." },

  { id:"slp02", dept:"sleep", tier:1, patient:"Mia, 15", complaint:"Can't fall asleep until 1:30 AM",
    vitals:"Bright phone screen held 15 cm from eyes until 1 AM",
    quote:"I lie in the dark watching videos until I get sleepy, yet my brain feels wide awake.",
    q:"Which hormone is delayed when bright blue-wavelength screen light hits the eyes at night?",
    opts:[
      "Melatonin, which signals to the brain that biological night has begun",
      "Cortisol, which normally rises after sunset to calm the nervous system",
      "Serotonin, which shuts down dreaming during the first sleep cycle",
      "Dopamine, which slows heart rate and drops core body temperature"
    ],
    ans:0, pearl:"Blue-wavelength light stimulates light-sensitive cells in the retina that tell the brain's master clock it is still daytime, suppressing and delaying melatonin release." },

  { id:"slp03", dept:"sleep", tier:1, patient:"Caleb, 14", complaint:"Energy drink at 7:00 PM for gaming",
    vitals:"Still staring at ceiling at midnight | Heart racing",
    quote:"I drank a big energy drink at 7 PM so I wouldn't fall asleep during my match. Why am I still wired at midnight?",
    q:"Why does a 7:00 PM energy drink still interfere with sleep five hours later?",
    opts:[
      "Caffeine blocks sleepiness receptors and stays half-active for 5 to 6 hours",
      "Sugar from the drink raises blood glucose for up to 8 hours after consumption",
      "Caffeine speeds up melatonin breakdown in the liver until sunrise the next day",
      "Carbonated energy drinks delay stomach emptying so alertness peaks at midnight"
    ],
    ans:0, pearl:"Caffeine blocks adenosine (your natural sleep-pressure chemical) and has a half-life of roughly 5 to 6 hours, meaning about half the dose is still active at midnight. Cut caffeine by early afternoon." },

  { id:"slp04", dept:"sleep", tier:1, patient:"Zoe, 15", complaint:"'I just can't stop scrolling' on short-video apps",
    vitals:"Avg 3.5 hrs/night on short-form video",
    quote:"I tell myself 'just two more videos' and suddenly it's 1:45 AM. Is it just bad willpower?",
    q:"What app design mechanic is most responsible for keeping users scrolling past bedtime?",
    opts:[
      "Infinite scroll paired with unpredictable variable rewards that reinforce checking",
      "Short video lengths that force the brain to finish a full story arc before stopping",
      "High-definition screen brightness that increases eye strain until users lose track",
      "Background audio loops that keep the auditory cortex alert between silent clips"
    ],
    ans:0, pearl:"Infinite scroll removes natural stopping cues (like the end of a page or episode), while variable-reward algorithms keep the brain's dopamine loop chasing the next unpredictable hit." },

  { id:"slp05", dept:"sleep", tier:1, patient:"Noah, 14", complaint:"Phone buzzing on pillow all night",
    vitals:"Wakes up 6 times per night to group-chat notifications",
    quote:"Even when I'm in bed for 9 hours, I wake up feeling like I only slept 4.",
    q:"What is the most effective clinical fix for notification-fragmented sleep?",
    opts:[
      "Charge the phone outside the bedroom and use a separate bedside alarm clock",
      "Switch the phone to vibrate-only under the pillow so audio tones cannot wake you",
      "Turn screen brightness down to minimum so checking texts takes less visual effort",
      "Go to bed 90 minutes earlier to offset the minutes spent answering night messages"
    ],
    ans:0, pearl:"Even brief micro-awakenings from buzzes or vibration shred continuous deep and REM sleep cycles. Charging your phone outside the bedroom protects uninterrupted rest." },

  { id:"slp06", dept:"sleep", tier:1, patient:"Aria, 15", complaint:"Snapping at friends & failing math quiz",
    vitals:"Slept 4 hours before test | Irritable, unfocused",
    quote:"Does losing sleep only make your body tired, or does it mess with your emotions and memory too?",
    q:"Which pattern best describes how acute sleep loss affects a teenager's daily functioning?",
    opts:[
      "It impairs physical recovery, weakens memory and focus, and worsens mood control",
      "It mainly slows physical reaction time while leaving academic memory mostly intact",
      "It reduces concentration in morning classes but does not affect social or mood control",
      "It causes short-term irritability without changing how the brain stores new learning"
    ],
    ans:0, pearl:"Sleep supports physical, cognitive, and emotional health together. Losing sleep impairs memory consolidation in the hippocampus and makes the amygdala overreact to everyday stress." },

  { id:"slp07", dept:"sleep", tier:1, patient:"Liam, 14", complaint:"Sleep debt math",
    vitals:"Needs 9 hrs/night | Gets 6.5 hrs Mon-Fri",
    quote:"I only miss 2.5 hours a night on school nights. That's barely anything, right?",
    q:"How much cumulative sleep debt builds up across those five school nights by Friday morning?",
    opts:[
      "12.5 hours of cumulative debt, equal to more than a full lost night of sleep",
      "5.0 hours of cumulative debt, since the brain adapts after the first two nights",
      "2.5 hours of cumulative debt, because only the most recent night carries over",
      "7.5 hours of cumulative debt, since light sleep stages recover during class"
    ],
    ans:0, pearl:"2.5 hours missed x 5 school nights = 12.5 hours of sleep debt. Chronic weekday sleep restriction compounds across the week and cannot be erased in a single morning." },

  { id:"slp08", dept:"sleep", tier:1, patient:"Chloe, 15", complaint:"Best wind-down routine",
    vitals:"Takes 90 minutes to fall asleep after gaming",
    quote:"What should I do in the last 30-60 minutes before bed instead of competitive gaming?",
    q:"Which pre-bed routine best prepares the nervous system for falling asleep on time?",
    opts:[
      "Dim the lights, put screens away, and do a calm offline activity like reading",
      "Switch from competitive matches to casual social media scrolling in a dark room",
      "Do 20 minutes of vigorous high-intensity interval exercise to burn excess energy",
      "Study flash cards under bright desk lighting until your eyes feel heavy enough"
    ],
    ans:0, pearl:"A predictable 30 to 60 minute low-light, screen-free buffer lowers heart rate and stress hormones so melatonin can rise naturally." },

  { id:"slp09", dept:"sleep", tier:1, patient:"Ethan, 14", complaint:"Why teens feel awake later than parents",
    vitals:"Naturally sleepy at 11 PM, struggles at 6:30 AM",
    quote:"My parents fall asleep at 9:30 PM, and they think I'm lazy because I'm wide awake at 10:30 PM!",
    q:"What biological sleep change normally occurs during puberty?",
    opts:[
      "The circadian clock shifts 1 to 2 hours later, delaying evening melatonin",
      "Total nightly sleep need drops by 2 hours compared with younger children",
      "Evening cortisol levels stay permanently elevated until the teen turns eighteen",
      "Deep sleep stages become shorter, making it harder to stay asleep past 10 PM"
    ],
    ans:0, pearl:"Puberty triggers a biological circadian phase delay of about 1 to 2 hours, so teens feel sleepy later and wake later. Protecting evening light hygiene helps prevent pushing that clock even further back." },

  { id:"slp10", dept:"sleep", tier:1, patient:"Priya, 15", complaint:"Physical activity and sleep",
    vitals:"Sits indoors 10+ hours/day | Restless at night",
    quote:"Does getting daytime outdoor movement actually help you sleep better at night?",
    q:"How do daytime outdoor movement and sunlight affect nighttime sleep quality?",
    opts:[
      "They anchor the circadian clock and build stronger sleep drive for bedtime",
      "They raise evening adrenaline levels, which delays sleep onset by about an hour",
      "They reduce the total number of hours of sleep a teen needs each school night",
      "They only improve sleep quality if the workout takes place right before bedtime"
    ],
    ans:0, pearl:"Morning and daytime natural light anchors your circadian rhythm, while daytime physical activity builds healthy sleep pressure (adenosine) that deepens nighttime sleep." },

  /* ---------------- TIER 2: RESIDENT (10 cases) ---------------- */
  { id:"slp11", dept:"sleep", tier:2, patient:"Owen, 15", complaint:"Weekend 'catch-up' crash",
    vitals:"Sleeps 6h Mon-Fri, then 3 AM to 1 PM Sat-Sun",
    quote:"I sleep until 1 PM on Saturday and Sunday to pay off my school-week sleep debt. Why do I feel hungover every Monday?",
    q:"What phenomenon explains Monday exhaustion after shifting weekend sleep by 4 or more hours?",
    opts:[
      "Social jetlag, where late weekend sleep shifts the internal body clock",
      "REM rebound toxicity, where sleeping past 10 hours causes daytime brain fog",
      "Circadian burnout, where catching up on debt permanently slows morning alertness",
      "Sleep inertia overload, where extra weekend sleep weakens weekday sleep pressure"
    ],
    ans:0, pearl:"Sleeping until 1 PM shifts your biological clock several hours later, creating social jetlag equivalent to flying across multiple time zones before Monday's early alarm." },

  { id:"slp12", dept:"sleep", tier:2, patient:"Sofia, 14", complaint:"Night Shift / Warm-colour filter myth",
    vitals:"Uses amber screen filter | Scrolls dramatic group chats until 1 AM",
    quote:"I turned on Night Shift / blue-light filter on my phone, so scrolling in bed until 1 AM won't hurt my sleep anymore, right?",
    q:"Why does Sofia still struggle to fall asleep even with a warm-colour screen filter enabled?",
    opts:[
      "Interactive chats trigger emotional arousal while cutting into sleep hours",
      "Warm amber filters still emit enough ultraviolet wavelengths to block melatonin fully",
      "Screen filters only reduce light intensity on tablets and laptops, not on phones",
      "Dimming screen colours forces the eyes to strain harder, raising body temperature"
    ],
    ans:0, pearl:"Blue light is only part of the problem. Interactive messaging, social drama, and lost clock hours keep the brain alert regardless of screen tint." },

  { id:"slp13", dept:"sleep", tier:2, patient:"Devon, 15", complaint:"All-nighter before a big Citizenship exam",
    vitals:"Zero sleep | Studied 10 PM to 6 AM",
    quote:"If I stay up all night cramming, won't I remember more facts than if I sleep 8 hours?",
    q:"Why does pulling an all-nighter typically produce worse exam recall than sleeping?",
    opts:[
      "Sleep is when the brain consolidates short-term study notes into durable memory",
      "Reading late at night uses visual memory pathways that fade within two hours",
      "Studying past midnight triggers stress hormones that block only math and logic facts",
      "Staying awake prevents the brain from reading exam questions at normal speed only"
    ],
    ans:0, pearl:"During sleep, the hippocampus transfers fragile short-term cramming into stable long-term memory. Skipping sleep skips the brain's 'Save' button and wrecks next-day focus." },

  { id:"slp14", dept:"sleep", tier:2, patient:"Hannah, 15", complaint:"Late 2-hour after-school nap",
    vitals:"Naps 4:30 PM to 6:30 PM | Wide awake at 1 AM",
    quote:"I crash for two hours after school every day, and then I can't fall asleep at bedtime!",
    q:"Why is a two-hour nap from 4:30 PM to 6:30 PM sabotaging Hannah's bedtime?",
    opts:[
      "It drains sleep pressure too close to evening, delaying nighttime sleep",
      "It resets the morning sunlight clock so the brain believes sunset has not occurred",
      "It triggers a spike in digestive hormones after dinner that prevents deep sleep",
      "It reduces the brain's ability to enter REM sleep for the following twelve hours"
    ],
    ans:0, pearl:"Long late-afternoon naps burn off accumulated adenosine (sleep pressure) right before night, trapping you in a cycle of late bedtimes and exhausted afternoons. If napping, keep it brief (around 20 minutes) and early." },

  { id:"slp15", dept:"sleep", tier:2, patient:"Lucas, 14", complaint:"Autoplay & streak anxiety",
    vitals:"Checks app at 11:55 PM just to keep a 240-day streak alive",
    quote:"I wasn't even enjoying the app, I just panicked about losing my streak!",
    q:"Which persuasive-design principle is driving Lucas to open the app at 11:55 PM?",
    opts:[
      "Loss aversion and obligation streaks designed to enforce daily return visits",
      "FOMO news-cycle alerts designed to prioritize breaking stories before midnight",
      "Algorithmic autoplay queues that keep videos playing after the phone is locked",
      "Screen-time wellness reminders that prompt users to finish daily goals early"
    ],
    ans:0, pearl:"Streaks exploit loss aversion and social guilt, turning an optional app into a nightly chore. Recognizing the persuasive-tech mechanic makes it much easier to break." },

  { id:"slp16", dept:"sleep", tier:2, patient:"Tessa, 15", complaint:"Sleep & immune system crossover",
    vitals:"Sleeps 5h/night during exam week | Catches every cold going around",
    quote:"Is it just bad luck that I always get sick during weeks when I barely sleep?",
    q:"How does sleeping only 5 hours a night increase vulnerability to circulating cold viruses?",
    opts:[
      "Sleep loss weakens immune-cell effectiveness and antibody response to viruses",
      "Staying up late dries out nasal passages so airborne viruses multiply twice as fast",
      "Sleep deprivation lowers body temperature enough for dormant bacteria to become active",
      "Short sleep only increases allergy symptoms without changing actual viral infection risk"
    ],
    ans:0, pearl:"Sleep deprivation impairs T-cell function and antibody production. Studies show people sleeping under 6 hours are significantly more likely to catch a cold virus after exposure." },

  { id:"slp17", dept:"sleep", tier:2, patient:"Ben, 14", complaint:"Bedroom environment audit",
    vitals:"Room is 24 C, hallway light shining in, TV on all night",
    quote:"I'm in bed by 10 PM, why do I toss and turn all night?",
    q:"Which bedroom setup best supports continuous, restorative nighttime sleep?",
    opts:[
      "A cool room around 18 to 19 C that is dark and quiet or uses steady low noise",
      "A warm room around 24 C with soft hallway light and a familiar TV show playing",
      "A cool room around 18 C with a dim looping podcast to keep racing thoughts busy",
      "A warm room around 22 C with blackout curtains and low-volume music all night"
    ],
    ans:0, pearl:"Core body temperature must drop slightly to initiate and maintain deep sleep. Cool (~18 to 19 C), dark, quiet rooms (or steady non-dialogue white noise) protect full sleep cycles." },

  { id:"slp18", dept:"sleep", tier:2, patient:"Kira, 15", complaint:"Sleepy driving / bike safety",
    vitals:"Up 20 hours straight after sleepover | Riding e-bike home",
    quote:"I didn't drink any alcohol, I'm just really tired. My reaction time is still safe, right?",
    q:"How does being awake for 18 to 20 hours straight compare to alcohol impairment?",
    opts:[
      "It slows reaction time and judgment similarly to a 0.05% to 0.08% blood-alcohol level",
      "It causes mild drowsiness that clears up quickly once cold outdoor air hits the face",
      "It slows visual focus slightly, though steering and braking reflexes remain near normal",
      "It only becomes comparable to alcohol impairment after 36 to 48 hours without sleep"
    ],
    ans:0, pearl:"Being awake 18 to 20 hours produces reflex slowing and microsleeps comparable to legal alcohol impairment, making drowsy biking or driving a serious personal safety risk." },

  { id:"slp19", dept:"sleep", tier:2, patient:"Marcus, 15", complaint:"Athletic injury & recovery",
    vitals:"Plays rep soccer | Sleeps 6 hrs/night | Repeated hamstring pulls",
    quote:"I train hard every day - why do I keep getting injured and recovering slowly?",
    q:"Why are youth athletes who sleep under 8 hours at noticeably higher risk for sports injuries?",
    opts:[
      "Deep sleep drives growth-hormone tissue repair, and short sleep impairs coordination",
      "Sleeping 6 hours depletes muscle glycogen stores faster than a post-practice meal",
      "Short sleep mainly raises resting heart rate without affecting tendon or muscle healing",
      "Athletes need extra light sleep before games to stretch tight hamstring fibres overnight"
    ],
    ans:0, pearl:"Deep (slow-wave) sleep releases growth hormone for muscle and tissue repair, while well-rested brains maintain sharper balance and reaction time. Youth athletes sleeping under 8 hours show markedly higher injury rates." },

  { id:"slp20", dept:"sleep", tier:2, patient:"Nadia, 14", complaint:"Red notification badges",
    vitals:"Telemetry audit: 180 phone pickups per day",
    quote:"Why did my phone pickups drop in half the day I turned off red notification badges and non-human alerts?",
    q:"Why does disabling red notification badges and non-urgent alerts sharply reduce phone pickups?",
    opts:[
      "Removing external triggers breaks automatic checking loops and restores control",
      "Turning off badges puts apps into low-power mode so new messages arrive only hourly",
      "Red badges trigger blue-light eye fatigue that makes users check their screen for relief",
      "Silencing alerts clears recent search history so apps stop recommending new content"
    ],
    ans:0, pearl:"Attention engineering relies on constant visual and audio triggers (like red dots and buzzes) to pull you back in. Silencing non-human alerts puts you back in charge of when to check." },

  /* ---------------- TIER 3: ATTENDING (10 cases) ---------------- */
  { id:"slp21", dept:"sleep", tier:3, patient:"Eli, 15", complaint:"REM vs. Deep Sleep roles",
    vitals:"Sleep clinic cycle chart",
    quote:"If I wake up 2 hours early on a school day, do I lose all sleep stages equally?",
    q:"When a student cuts off the final 2 hours of sleep on a school morning, which stage is lost most?",
    opts:[
      "REM sleep, which concentrates in late morning cycles and supports mood and memory",
      "Deep slow-wave sleep, which occurs primarily during the last two hours before waking",
      "Stage 1 transitional dozing, while deep and REM stages finish during the first four hours",
      "All sleep stages equally, because every 90-minute cycle keeps the exact same stage ratio"
    ],
    ans:0, pearl:"Deep (slow-wave) sleep dominates the first half of the night, whereas REM sleep lengthens dramatically in the final hours. Cutting mornings short disproportionately strips REM sleep, hitting mood regulation and learning." },

  { id:"slp22", dept:"sleep", tier:3, patient:"Grace, 15", complaint:"Melatonin gummy overuse",
    vitals:"Taking 10 mg melatonin gummies every night without medical advice",
    quote:"Melatonin is natural, so taking a huge 10 mg dose every night is totally harmless, right?",
    q:"What is the strongest evidence-based concern about taking nightly 10 mg OTC melatonin gummies?",
    opts:[
      "It is an inconsistently dosed hormone that causes grogginess without fixing habits",
      "It acts as a heavy sedative that permanently stops the brain from entering deep sleep",
      "It builds lethal liver toxicity in teenagers whenever taken for more than three nights",
      "It works only for adults over 25 because teen brains cannot absorb oral melatonin"
    ],
    ans:0, pearl:"Melatonin is a timing hormone, not candy. High doses can cause morning grogginess and vivid dreams, OTC supplement strength is inconsistently regulated, and pills cannot fix late-night screen habits. Consult a doctor or pharmacist before using it." },

  { id:"slp23", dept:"sleep", tier:3, patient:"Omar, 15", complaint:"'Revenge bedtime procrastination'",
    vitals:"Stays up 11 PM-1 AM scrolling even when exhausted",
    quote:"I'm exhausted all day, yet at 11 PM I refuse to go to sleep because it feels like the only quiet time that's mine.",
    q:"Which strategy best addresses the root cause of revenge bedtime procrastination?",
    opts:[
      "Schedule 20 to 30 minutes of guilt-free offline leisure earlier in the evening",
      "Set a stricter 10:00 PM phone lockout without changing daytime workload or breaks",
      "Stay awake until 1:00 AM on Fridays only so weekday evenings stay purely for study",
      "Replace late-night scrolling with watching longer shows so bedtime feels more relaxing"
    ],
    ans:0, pearl:"Revenge bedtime procrastination happens when days feel packed with obligations and zero personal autonomy. Carving out real downtime earlier in the evening keeps bedtime from feeling like a punishment." },

  { id:"slp24", dept:"sleep", tier:3, patient:"Sienna, 14", complaint:"24-Hour Audit: Sedentary vs. Sleep trade-off",
    vitals:"4.5h recreational screen time | 15 min physical activity | 6.5h sleep",
    quote:"The Canadian 24-Hour Movement Guidelines look at sleep, movement, and screen time together. Why?",
    q:"What is the core principle behind combining sleep, movement, and screen time in one 24-hour model?",
    opts:[
      "Because daily hours are finite, excess screen time directly crowds out movement and sleep",
      "Because screen time and exercise burn identical calories, they can safely trade places",
      "Because hitting 60 minutes of sports cancels out the health effects of short weekday sleep",
      "Because sedentary sitting harms health only when a student also skips morning breakfast"
    ],
    ans:0, pearl:"Every day has a fixed 24-hour budget. When recreational screen time expands to 4 or 5 hours, it inevitably displaces both physical activity and sleep, creating a domino effect across all dimensions of health." },

  { id:"slp25", dept:"sleep", tier:3, patient:"Riya, 15", complaint:"Algorithmic outrage & anxiety before bed",
    vitals:"Heart rate elevated after reading argument threads at 11:30 PM",
    quote:"Why does my feed keep showing me stressful, angry posts late at night?",
    q:"Why do social-media feeds frequently surface stressful or anger-inducing posts late at night?",
    opts:[
      "Algorithms optimize watch-time, and high-arousal emotions hold attention longer",
      "Platforms intentionally switch to serious debate topics after 10 PM for older teen users",
      "Users search for more negative news at night, which locks out calming posts permanently",
      "Algorithmic feeds randomize post order at night, making stressful threads appear by chance"
    ],
    ans:0, pearl:"Engagement algorithms maximize retention and clicks, not user calm. Outrage and anxiety keep people scrolling longer while triggering cortisol and adrenaline right when the nervous system needs to wind down." },

  { id:"slp26", dept:"sleep", tier:3, patient:"Caleb, 15", complaint:"Caffeine 'crash' illusion",
    vitals:"2 iced coffees + 1 energy drink/day | Feels tired anyway",
    quote:"Why do I feel even MORE exhausted once my energy drink wears off?",
    q:"What physiological mechanism causes the sharp fatigue crash once caffeine wears off?",
    opts:[
      "Adenosine keeps building behind blocked receptors and floods the brain as caffeine clears",
      "Caffeine rapidly burns through stored brain glucose, leaving neurons starved for energy",
      "Energy drinks trigger a sudden midday surge of melatonin once blood sugar drops back",
      "Caffeine temporarily shrinks blood vessels so the brain receives less oxygen for six hours"
    ],
    ans:0, pearl:"Caffeine does not erase sleepiness; it temporarily plugs adenosine receptors. Adenosine keeps piling up behind the dam and hits all at once when the caffeine wears off." },

  { id:"slp27", dept:"sleep", tier:3, patient:"Mina, 15", complaint:"Can't sleep after 25 minutes in bed",
    vitals:"Staring at clock, getting more anxious every minute",
    quote:"When I can't fall asleep, I lie there getting furious at the clock for 2 hours.",
    q:"What does cognitive-behavioural sleep therapy (CBT-I) recommend when awake and anxious in bed?",
    opts:[
      "Turn the clock away, get up in dim light for a calm screen-free activity, and return drowsy",
      "Stay strictly under the covers with eyes closed so the body still logs light resting minutes",
      "Keep checking the clock every ten minutes to calculate how many sleep cycles remain",
      "Turn on bright overhead lighting and catch up on schoolwork until exhaustion sets in"
    ],
    ans:0, pearl:"Lying awake frustrated trains your brain to associate bed with stress (conditioned arousal). Stepping out calmly in dim light without screens until sleepy rebuilds the link between bed and sleep." },

  { id:"slp28", dept:"sleep", tier:3, patient:"Alex, 15", complaint:"Energy drinks + high sugar + teen heart",
    vitals:"Drank two 500 mL energy drinks (320 mg caffeine) before track meet",
    quote:"I'm shaky, dizzy, and my heart is pounding fast during warm-up.",
    q:"What is Health Canada's evidence-based caffeine guidance for adolescents?",
    opts:[
      "Cap caffeine near 2.5 mg/kg daily, about 100-150 mg, and skip energy drinks in sports",
      "Cap caffeine at 400 mg per day, the same daily safety ceiling recommended for healthy adults",
      "Allow up to 300 mg before athletic events as long as equal water is consumed alongside",
      "Avoid coffee completely while permitting one 500 mL energy drink before intense cardio"
    ],
    ans:0, pearl:"Health Canada recommends teens stay at or below 2.5 mg/kg/day (about 100 to 150 mg for most Grade 9 students) and advises against caffeinated energy drinks during physical activity due to heart-rate spikes and palpitations." },

  { id:"slp29", dept:"sleep", tier:3, patient:"Jordan, 14", complaint:"Morning sunlight reset",
    vitals:"Wakes up groggy in dark bedroom with blackout curtains shut",
    quote:"What is the fastest free biological signal to tell my brain 'morning has started'?",
    q:"Which morning habit most powerfully anchors the circadian clock and sets up earlier sleep that night?",
    opts:[
      "Getting 10 to 15 minutes of bright natural outdoor or window light shortly after waking",
      "Drinking a large glass of ice-cold water in a dim bedroom before getting out of bed",
      "Scrolling bright social-media feeds under the covers for 30 minutes to wake the eyes",
      "Taking a hot shower in a dimly lit bathroom followed by a high-protein breakfast"
    ],
    ans:0, pearl:"Bright morning daylight shuts off lingering melatonin and starts a roughly 14 to 16 hour biological countdown so melatonin releases on schedule that evening." },

  { id:"slp30", dept:"sleep", tier:3, patient:"Sam, 15", complaint:"Snooze button trap",
    vitals:"Sets 6 alarms from 6:15 AM to 7:00 AM",
    quote:"Doesn't hitting snooze 5 times give me 45 minutes of extra rest?",
    q:"Why does hitting snooze five times from 6:15 AM to 7:00 AM leave Sam feeling groggier?",
    opts:[
      "Repeated alarms fragment final sleep cycles and worsen grogginess; set one alarm",
      "Snoozing forces the brain straight into deep slow-wave sleep during every nine-minute gap",
      "Multiple alarms lower morning blood pressure too slowly for the brain to clear melatonin",
      "Each alarm cancels out the prior 90-minute REM cycle stored earlier during the night"
    ],
    ans:0, pearl:"Setting one alarm for 7:00 AM gives you 45 minutes of continuous, higher-quality morning sleep instead of five fragmented cortisol jolts that intensify grogginess (sleep inertia)." },

  /* ---------------- TIER 4: CHIEF OF MEDICINE (10 cases) ---------------- */
  { id:"slp31", dept:"sleep", tier:4, patient:"Sleep Clinic Case: Persistent Snoring & Daytime Crashes", complaint:"Sleeps 9.5 hours/night but still falls asleep in class",
    vitals:"Loud nightly snoring, gasping pauses reported by sibling, dry mouth",
    quote:"I follow every sleep-hygiene rule and sleep 9.5 hours, yet I'm still exhausted every single day!",
    q:"What is the Chief of Medicine's highest-priority clinical next step for this patient?",
    opts:[
      "Refer for medical evaluation of possible sleep apnea or an underlying medical cause",
      "Extend nightly sleep duration to 11 hours to compensate for delayed teen circadian timing",
      "Recommend a 5 mg nightly melatonin supplement to deepen slow-wave sleep architecture",
      "Prescribe a strict 30-day digital detox even though screen hygiene is already well managed"
    ],
    ans:0, pearl:"When 9+ hours of solid sleep hygiene still leaves severe daytime sleepiness alongside loud snoring and gasping pauses, evaluate for obstructive sleep apnea or medical causes like low iron rather than assuming bad habits." },

  { id:"slp32", dept:"sleep", tier:4, patient:"Mental Health & Sleep Bidirectional Loop", complaint:"2 weeks of insomnia + persistent hopelessness",
    vitals:"CO1 + CO11 crossover",
    quote:"I can't tell if my bad sleep is making me feel depressed, or if feeling overwhelmed is ruining my sleep.",
    q:"How do clinical guidelines frame the relationship between persistent insomnia and low mood?",
    opts:[
      "As a two-way loop where both worsen each other, needing sleep care and support",
      "As a one-way sequence where fixing bedtime hygiene alone resolves clinical depression first",
      "As two separate systems that should be treated months apart so symptoms do not overlap",
      "As a temporary exam-season phase that typically clears without involving trusted adults"
    ],
    ans:0, pearl:"Sleep and mental health form a two-way (bidirectional) loop. Persistent insomnia paired with hopelessness warrants both supportive sleep habits and real help from a family doctor, counsellor, 811, or Kids Help Phone." },

  { id:"slp33", dept:"sleep", tier:4, boss:true, patient:"Grayscale & Friction Engineering", complaint:"Student redesigning their own phone environment",
    vitals:"Hook Machine counter-strategy",
    quote:"Willpower fails at 11 PM when I'm tired. How do I beat trillion-dollar app design?",
    q:"Which behavioural-design strategy most reliably counters persuasive apps late at night?",
    opts:[
      "Add friction via outside charging, grayscale, and timers so healthy choices default",
      "Keep the phone on the nightstand with sound on to practice resisting notifications nightly",
      "Rely on a mental promise each evening to stop scrolling after exactly ten minutes",
      "Switch from short-video apps to messaging apps so total screen time stays under two hours"
    ],
    ans:0, pearl:"Environment beats midnight willpower. Adding friction to high-hook apps and charging the phone outside the bedroom changes the default behaviour when prefrontal self-control is tired." },

  { id:"slp34", dept:"sleep", tier:4, patient:"Vaping Nicotine & Sleep", complaint:"Uses vape pen at night 'to relax'",
    vitals:"CO1 + CO10 crossover | Wakes up restless at 3 AM",
    quote:"I thought vaping helped me unwind before bed, so why is my sleep way worse now?",
    q:"Why does evening nicotine vaping feel briefly calming yet fragment sleep by 3:00 AM?",
    opts:[
      "Nicotine is a stimulant that disrupts deep sleep; the calm feeling is only withdrawal relief",
      "Nicotine acts as a mild sedative at bedtime that wears off abruptly after four hours",
      "Vape flavourings irritate the airways at night while nicotine itself has no effect on sleep",
      "Nicotine lengthens REM cycles early in the night, leaving less time for morning rest"
    ],
    ans:0, pearl:"Nicotine is a central nervous system stimulant that raises heart rate and fragments deep sleep. The brief sense of relaxation comes from relieving withdrawal, which then rebounds again overnight." },

  { id:"slp35", dept:"sleep", tier:4, patient:"Cannabis & REM Suppression", complaint:"Using cannabis to fall asleep every night",
    vitals:"CO1 + CO10 crossover | Vivid nightmares whenever skipping a night",
    quote:"Weed knocks me out fast, so it must be great for teen sleep quality, right?",
    q:"What does sleep-laboratory research show about nightly THC use for sleep in adolescents?",
    opts:[
      "THC suppresses REM sleep, builds tolerance, causes rebound insomnia, and risks teen brains",
      "THC increases restorative deep and REM stages equally when used only right before bedtime",
      "THC improves sleep architecture long term, with vivid dreams signaling complete recovery",
      "THC shortens sleep latency without altering sleep stages, memory consolidation, or mood"
    ],
    ans:0, pearl:"Chemical sedation is not restorative sleep. THC suppresses REM sleep (harming mood and memory), builds tolerance, triggers rebound insomnia and vivid dreams when stopped, and carries risks for developing teen brains." },

  { id:"slp36", dept:"sleep", tier:4, patient:"School Start-Time Policy Debate", complaint:"Why medical associations study later high-school start times",
    vitals:"Public health epidemiology",
    quote:"Why did the Canadian Paediatric Society and American Academy of Pediatrics point to teen circadian biology in school-start studies?",
    q:"What is the primary biological argument cited in pediatric statements on later high-school start times?",
    opts:[
      "Puberty shifts melatonin release later, so very early bells collide with biological night and REM",
      "Adolescents require 11 to 12 hours of sleep nightly, making any morning schedule unworkable",
      "Teen brains cannot consolidate new academic information during the first three hours after waking",
      "Early school buses prevent students from getting evening exercise, which lowers sleep drive"
    ],
    ans:0, pearl:"Because puberty shifts circadian timing later, very early start times cut directly into biological night and morning REM sleep. Both supportive policy and personal evening light hygiene matter." },

  { id:"slp37", dept:"sleep", tier:4, patient:"Chronotype & Consistency Rule", complaint:"Fixing a 2 AM sleep schedule before Monday",
    vitals:"Summer break ended; school starts in 5 days",
    quote:"I've been sleeping 2 AM to 11 AM all summer. Should I stay up 24 hours straight Sunday night to reset?",
    q:"What is the most effective circadian-reset protocol over the five days before school starts?",
    opts:[
      "Shift wake and bedtimes earlier by 15 to 30 minutes daily with bright morning daylight",
      "Pull one 24-hour all-nighter on Sunday to force immediate sleepiness by 9:30 PM Monday",
      "Keep waking at 11 AM until Saturday, then jump straight to a 6:30 AM alarm on Sunday",
      "Take a 90-minute afternoon nap each day so going to bed at 10 PM feels less stressful"
    ],
    ans:0, pearl:"The circadian pacemaker shifts cleanly at roughly 15 to 30 minutes per day when anchored by consistent wake times, bright morning sunlight, and dim evenings. All-nighter shocks usually backfire." },

  { id:"slp38", dept:"sleep", tier:4, patient:"Telemetry Audit: Active vs. Passive Screen Use", complaint:"Comparing 45 min of homework vs. 45 min of infinite-scroll feeds",
    vitals:"Screen-time quality check",
    quote:"My screen-time report says 3 hours total, but half was typing a Geography slide deck. Is all screen time identical?",
    q:"How do digital-health researchers evaluate screen time beyond a raw daily minute total?",
    opts:[
      "By weighing content, timing near bed, and which healthy habits the screen use displaces",
      "By counting only handheld phone minutes while excluding laptops and desktop monitors",
      "By treating every minute of screen exposure as equally harmful regardless of task or hour",
      "By focusing strictly on screen brightness rather than app design, interactivity, or timing"
    ],
    ans:0, pearl:"Health literacy looks past raw totals: ask WHAT you are doing (active creation vs. passive infinite scroll), WHEN (daytime vs. pre-bed), and WHAT it is crowding out (sleep, movement, real-world connection)." },

  { id:"slp39", dept:"sleep", tier:4, patient:"Exam-Week Recovery Plan", complaint:"Student slept 5 hours last night before a tough day",
    vitals:"Needs to get through today safely without wrecking tonight",
    quote:"I already messed up and only slept 5 hours last night. What's the smartest damage-control move today?",
    q:"Which single-day recovery plan best protects both today's focus and tonight's sleep?",
    opts:[
      "Get morning light, hydrate, limit any nap to 20 min early, skip late caffeine, sleep on time",
      "Use two energy drinks after 3 PM to finish homework, then sleep in two extra hours tomorrow",
      "Take a 90-minute nap at 5:30 PM to repay the lost cycle, then push bedtime back to midnight",
      "Skip outdoor breaks to conserve energy and go to bed three hours earlier than usual tonight"
    ],
    ans:0, pearl:"One rough night happens. Protecting tonight's sleep pressure (by avoiding late caffeine and long late naps) prevents a single bad night from turning into a week-long crash spiral." },

  { id:"slp40", dept:"sleep", tier:4, patient:"Microsleeps & Attention Lapses", complaint:"Blanking out for 4 seconds while reading",
    vitals:"Chronic 5.5h sleep for 2 weeks",
    quote:"I swear my eyes were open in class, yet I completely lost 5 seconds of what the teacher said!",
    q:"What neurological phenomenon best explains a 4-to-5-second blank-out with eyes still open?",
    opts:[
      "A microsleep, where sleep-deprived brain regions briefly shut down despite open eyes",
      "A brief drop in blood sugar that temporarily pauses auditory processing in the ear",
      "Normal daydreaming triggered whenever classroom lectures exceed twenty continuous minutes",
      "Eye-muscle fatigue from screen glare that blocks visual signals without affecting alertness"
    ],
    ans:0, pearl:"Microsleeps are involuntary 2 to 10 second sleep episodes where a sleep-deprived brain briefly switches off even with open eyes. They cause missed information in class and are potentially fatal while biking or driving." }
);
