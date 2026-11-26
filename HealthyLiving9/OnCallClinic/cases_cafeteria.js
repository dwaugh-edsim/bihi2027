/* ============================================================================
   ON-CALL: ROOM 8 CLINIC - Hospital Cafeteria Moonlighting Shift (22 cases)
   Comedy crossover importing the HL8 CafeteriaRush food database (90 real
   Canadian nutrition facts foods). "Administration has reassigned you to
   the hospital cafeteria for one shift. Do no harm. Serve good trays."
   16 multiple-choice label-literacy cases + 6 BUILD-THE-TRAY challenges
   (kind:"cafe"), tiers 1-4, one Tier 4 BOSS tray rush.
   Zero em/en dashes. Grade 9 Nova Scotia curriculum, fueling framing only.
   ============================================================================ */
window.ONCALL_CASES = window.ONCALL_CASES || [];
window.ONCALL_CHALLENGES = window.ONCALL_CHALLENGES || [];

window.ONCALL_CASES.push(
  {
    id:"cf01", dept:"cafe", tier:1, patient:"Line 1: Confused Intern with a soup can",
    complaint:"Holding a can upside down near the soup kettle",
    vitals:"Cafeteria label audit | 12:05 PM lunch rush",
    quote:"Doc, this soup label says 5% DV sodium. Administration said that means... a lot? I did not want to argue.",
    q:"What does 5% DV or less mean on a Canadian Nutrition Facts label?",
    opts:[
      "A little of that nutrient",
      "A lot of that nutrient",
      "Zero calories guaranteed",
      "Not approved for sale in Canada"
    ],
    ans:0,
    pearl:"The cafeteria code: 5% DV or less is a little, 15% DV or more is a lot. Low sodium soup passes the line check."
  },
  {
    id:"cf02", dept:"cafe", tier:1, patient:"Line 2: Night Nurse squinting at a noodle cup",
    complaint:"Instant ramen for a 3 AM break",
    vitals:"Label shows 36% DV sodium per (half) package",
    quote:"This little ramen cup says 15% DV or more of sodium. The chef says that is basically nothing. Is he right?",
    q:"What does 15% DV or more mean?",
    opts:[
      "A little of that nutrient",
      "A lot of that nutrient",
      "Always safe for teens",
      "Half a serving of fibre"
    ],
    ans:1,
    pearl:"15% DV or more is a lot. Great for fibre and iron; a red alert for sodium, sugar, and saturated fat. The chef is wrong and the ramen cup is 72% DV sodium if you eat the whole thing."
  },
  {
    id:"cf03", dept:"cafe", tier:1, patient:"Chef Baton, Head of Kitchen Operations",
    complaint:"Defending the 'special of the day' ingredient list",
    vitals:"Special: rolled oats, glucose-fructose, brown sugar, honey, corn syrup",
    quote:"My Honey Crunch Oat Special lists sugar FOUR times! My sous-chef says that is suspicious. I say variety is spice.",
    q:"What label trick is the chef accidentally using?",
    opts:[
      "Whole-grain illusion",
      "Sugar splitting",
      "Serving-size halving",
      "Protein hype"
    ],
    ans:1,
    pearl:"Sugar splitting: by using four different sugar names (glucose-fructose, brown sugar, honey, corn syrup), sugar never appears as the #1 ingredient, even though combined it rules the recipe."
  },
  {
    id:"cf04", dept:"cafe", tier:1, patient:"Sleepy Resident at the vending machine, 3 AM",
    complaint:"Convinced 'calories' is a bad word",
    vitals:"In front of the vending machine | Third consecutive night shift",
    quote:"Everything here lists calories like it is a crime. What even IS a calorie, and do I need them to get through this shift?",
    q:"What is a calorie on a food label?",
    opts:[
      "A type of unhealthy fat",
      "A unit of energy your body uses to think, move, and grow",
      "The grams of sugar in the item",
      "A vitamin supplement measurement"
    ],
    ans:1,
    pearl:"Calories are fuel/energy. Growing teens and night-shift doctors both need enough real fuel. The goal is steady energy from whole foods, not fear of numbers."
  },
  {
    id:"cf05", dept:"cafe", tier:1, patient:"Physiotherapist stretching in the tray line",
    complaint:"Wants slow-burn energy for an afternoon of sessions",
    vitals:"Confused by 'carbs are bad' chatter in the staff room",
    quote:"Ambulatory patients keep telling me carbs are the enemy. My grandmother's oats saved every harvest in this province. Help me settle it.",
    q:"What is the main job of carbohydrates in your body?",
    opts:[
      "Building bone enamel",
      "Primary fuel for your brain and muscles",
      "Replacing water during sports",
      "Storing vitamin D"
    ],
    ans:1,
    pearl:"Complex carbs (whole grains, fruit, beans) are the primary fuel for your brain and muscles. Ditching them does not help a working body; choosing slow-burn whole grains does."
  },
  {
    id:"cf06", dept:"cafe", tier:1, patient:"Orderly Hank, moving gurneys since the 80s",
    complaint:"Wondering what protein actually does",
    vitals:"Carries trays and patients with equal ease",
    quote:"I eat protein because my arms are famous. But what is it actually FOR? Nobody in this hospital has explained it in 40 years.",
    q:"What is the main job of protein in your body?",
    opts:[
      "An instant sugar rush",
      "Building and repairing muscles, tissues, and immune cells",
      "Hydrating you faster than water",
      "Lowering your fibre intake"
    ],
    ans:1,
    pearl:"Protein repairs muscles, builds tissue and immune cells, and keeps you full between shifts. Hank's famous arms knew the science before anyone explained it."
  },
  {
    id:"cf07", dept:"cafe", tier:2, patient:"Line 4: Cardiac Wing Patient with a chip bag",
    complaint:"Bag lists 10% DV sodium per serving",
    vitals:"Entire bag = 2 servings | Patient intends to eat ALL of it",
    quote:"My daughter says this bag is only 10% DV sodium, so it is heart-smart. But I am planning to eat the whole bag during the game.",
    q:"How much sodium is the patient actually about to eat?",
    opts:[
      "5% DV",
      "10% DV",
      "20% DV",
      "40% DV"
    ],
    ans:2,
    pearl:"Always check the serving size first: the bag holds 2 servings, so eating ALL of it doubles every number, 20% DV sodium, 2x calories, 2x everything."
  },
  {
    id:"cf08", dept:"cafe", tier:2, patient:"The Vending Machine Lobbyist (visiting rep)",
    complaint:"Promoting MULTIGRAIN cereal bars to the cafeteria",
    vitals:"Front of box: MULTIGRAIN in giant letters | First ingredient: enriched white wheat flour",
    quote:"My bars say MULTIGRAIN right on the front! Multigrain means whole grain, right? That is what my marketing team thinks.",
    q:"Is this product actually a whole grain?",
    opts:[
      "Yes, multigrain always means whole grain",
      "No, multigrain just means multiple grains (often refined white flours); look for 'whole grain' as the first ingredient",
      "Only if it has 15% DV sugar or more",
      "Only if it is also nut-free"
    ],
    ans:1,
    pearl:"'Multigrain' only means several grains were used, usually refined white flour. The cafeteria rule: 'whole grain' (or '100% whole wheat') must be the FIRST ingredient to count."
  },
  {
    id:"cf09", dept:"cafe", tier:2, patient:"Peds Ward Lunch Tray, submitted by Nurse Okafor",
    complaint:"Choosing between whole apple and apple juice box",
    vitals:"Picky 8-year-old consumers | Both options 'count as fruit'",
    quote:"The supplier says 100% pure apple juice is exactly as healthy as an apple because it comes from apples. The peds ward disagrees. Judge.",
    q:"Why is a whole apple the better everyday choice?",
    opts:[
      "Juice has no calories but apples do",
      "Whole apples keep the fibre, which slows sugar absorption; juicing removes fibre and concentrates free sugars",
      "Apples contain 20 grams of protein",
      "Juice has 80% DV sodium and apples do not"
    ],
    ans:1,
    pearl:"Juicing strips the fibre and concentrates free sugars, so the sugar hits fast without the slow-down. Whole fruit beats fruit juice for the everyday line-up."
  },
  {
    id:"cf10", dept:"cafe", tier:2, patient:"Locum Surgeon demanding 'brain fuel' tray",
    complaint:"Asking why fats are on the menu at all",
    vitals:"Scheduled for a 6-hour procedure | Hearing 'fat is bad' from a patient's TikTok",
    quote:"I am about to be elbow-deep in surgery for 6 hours. Someone online told me to fear ALL fats. What is the actual science?",
    q:"Why does your body need healthy unsaturated fats?",
    opts:[
      "It does not need any fat at all",
      "They support brain function, hormones, and absorption of vitamins A, D, E, and K",
      "They raise sodium levels",
      "They replace whole grains in the diet"
    ],
    ans:1,
    pearl:"Unsaturated fats (salmon, avocado, olive oil, seeds, nuts) are essential fuel for a teen brain and let the body absorb vitamins A, D, E, and K. Limit saturated and trans fats, never all fats."
  },
  {
    id:"cf11", dept:"cafe", tier:2, patient:"Head Surgeon's Tray Inspection (Burns Unit)",
    complaint:"Checking the Canada's Food Guide plate proportions",
    vitals:"New caf tray design under review",
    quote:"The kitchen's new signature tray is one giant slice of meat loaf, a lake of gravy, and three peas in a decorative arc. Does that follow the plate?",
    q:"What proportions does Canada's Food Guide recommend?",
    opts:[
      "1/2 protein, 1/4 grains, 1/4 vegetables",
      "1/2 vegetables & fruit, 1/4 whole grains, 1/4 protein, with water as the drink of choice",
      "1/2 dairy, 1/2 meat",
      "Equal thirds of snacks, drinks, and mains"
    ],
    ans:1,
    pearl:"Canada's Food Guide plate: half vegetables and fruit, a quarter whole grains, a quarter protein, and water as the drink of choice. The meat-loaf lake fails inspection."
  },
  {
    id:"cf12", dept:"cafe", tier:2, patient:"Ailing Filbert the Cafeteria Mascot (a man in a walnut suit)",
    complaint:"Asking about fibre",
    vitals:"Digestion moving slowly | 3 PM slump daily",
    quote:"I ate nothing but white bread and chowder for a week and now nothing is... moving. What nutrient did I skip?",
    q:"Which nutrient keeps digestion healthy, keeps you full, and slows blood sugar spikes?",
    opts:[
      "Sodium",
      "Fibre",
      "Caffeine",
      "Saturated fat"
    ],
    ans:1,
    pearl:"Fibre (whole grains, beans, lentils, veggies, whole fruit) keeps digestion moving, holds hunger off, and slows sugar absorption. Filbert needs beans, not chowder."
  },
  {
    id:"cf13", dept:"cafe", tier:3, patient:"Night Resident with zero-s sugar energy drink",
    complaint:"Defending zero-sugar status",
    vitals:"180 mg caffeine | 'But it says ZERO SUGAR on the can'",
    quote:"It says zero sugar, doc. ZERO. Sugar is the whole problem, so this is basically a health drink for my overnight shift.",
    q:"Why is a zero-sugar 180 mg caffeine drink still a red flag?",
    opts:[
      "Zero sugar means zero energy, so it is useless",
      "180 mg caffeine exceeds safe teen limits and disrupts sleep and heart rate, no matter the sugar count",
      "It contains too much fibre",
      "It contains peanuts"
    ],
    ans:1,
    pearl:"Removing sugar does not detox a high-caffeine drink. Teens are extra sensitive to caffeine's effects on sleep, heart rate, and blood pressure, and caffeine wrecks the very sleep a night shift depends on."
  },
  {
    id:"cf14", dept:"cafe", tier:3, patient:"The CEO's Executive Green Smoothie Order",
    complaint:"Sweetened matcha latte in a tall glass, glowing green",
    vitals:"Bright green | First ingredient of the mix: sugar",
    quote:"The CEO swears it is healthy because it is green and says 'matcha' twice on the cup. Audit the claim, doctor.",
    q:"Why might the sweetened green drink still be a trap?",
    opts:[
      "Green tea always contains too much fibre",
      "Sweetened matcha powder often lists sugar as the #1 ingredient and adds caffeine on top",
      "Milk always contributes 80% DV sodium",
      "It is never gluten-free, so it is unsafe"
    ],
    ans:1,
    pearl:"Natural colours and botanical buzzwords are marketing, not evidence. If sugar is the first ingredient of the mix, the leafy look is a costume, and the caffeine hits sleep on top of that."
  },
  {
    id:"cf15", dept:"cafe", tier:3, patient:"Pre-Op Chef Duval, ordering crash-diet supplies",
    complaint:"Planning a juice cleanse before a beach trip",
    vitals:"Anaesthetic consult tomorrow | Skipping meals for 4 days",
    quote:"My clinic is in 2 weeks and I want to lose weight fast, so I am doing a juice cleanse plus no breakfast. My aneasthetist sent me to you.",
    q:"Why do extreme crash diets or skipped meals backfire?",
    opts:[
      "They slow the metabolism, drain focus and mood, and harm growth and recovery",
      "They double your protein automatically",
      "They are recommended by the food guide",
      "They add fibre for athletes"
    ],
    ans:0,
    pearl:"Extreme restriction slows metabolism, drains focus and mood, and starves the repair systems an aneasthetic consult and a growing teen both depend on. Consistent balanced fueling wins."
  },
  {
    id:"cf16", dept:"cafe", tier:4, patient:"BOSS: The Menu Board Audit (Administration)",
    complaint:"Final moonlighting audit of the cafeteria's own menu claims",
    vitals:"Tier 4 double-points boss case | Quiet hour before the dinner rush",
    quote:"Administration wants ONE question answered to renew the kitchen's contract: which statement would you sign your licence on?",
    q:"Which statement is bullet-proof and signable?",
    opts:[
      "Ingredients are listed by weight, heaviest first; 5% DV or less is a little and 15% or more is a lot; whole grains must be the first ingredient to count; and the Food Guide plate is half veg and fruit",
      "Multigrain products are automatically whole grain, so all cafeteria bread passes",
      "Calories should be minimized at every meal regardless of fuel needs",
      "Pure fruit juice equals whole fruit because both grow on trees"
    ],
    ans:0,
    pearl:"The signable cafeteria doctrine: ingredients by weight, 5%/15% DV rule, whole grain first, half-plate veg. Any chef who recites it can keep the kitchen. Anything else returns to Health Canada remedial training."
  }
);

window.ONCALL_CHALLENGES.push(
  {
    id:"cfT1", dept:"cafe", tier:1, kind:"cafe",
    patient:"3 AM Munchies Run (Intern on Pager Duty)",
    complaint:"Build a balanced late-night tray",
    vitals:"Kitchen rules: 1 veg or fruit, 1 protein, 1 whole grain, water, no junk traps",
    quote:"The kitchen is dark, the pager is loud, and the vending glass glows. Administration's order form needs one balanced tray. Choose wisely, doctor. The nacho cheese machine is watching.",
    q:"Build a tray with at least 1 veg/fruit, 1 protein, 1 whole grain, tap water, and NO trap foods:",
    brief:"Pick a balanced late-night tray: 1 veg/fruit + 1 protein + 1 whole grain + tap water. Skip the trap foods.",
    foodIds:[ "v_apple","v_carrots","v_broccoli","p_greek","p_eggs","g_oats","g_ww_bun","d_water","s_muffin","s_fries","v_caesar","v_fruitcup" ],
    spec:"1 veg/fruit + 1 protein + 1 whole grain + water + zero trap items",
    checks:{ minVeg:1, minPro:1, minGrain:1, needWater:true, noTraps:true },
    pearl:"A 3 AM tray still follows the plate: produce, protein, whole grain, water. Traps like the bacon Caesar (890 mg sodium), fries, and syrupy fruit cups wear cafeteria costumes."
  },
  {
    id:"cfT2", dept:"cafe", tier:2, kind:"cafe",
    patient:"The Attending's Pre-Rounds Brain Fuel",
    complaint:"Steady energy tray before teaching rounds",
    vitals:"Kitchen rules: 20g+ protein, 6g+ fibre, under 25% DV sugar, water, zero caffeine",
    quote:"Dr. Firestone lectures non-stop until 1 PM and refuses to waste a second on a sugar crash. She wants slow-burn fuel and a water bottle. The granola bar is eyeing you hopefully.",
    q:"Build a tray with at least 20g protein, 6g fibre, under 25% DV sugar, tap water, and zero caffeine:",
    brief:"Slow-burn teaching-rounds tray: 20g+ protein, 6g+ fibre, max 25% DV sugar, tap water, no caffeine.",
    foodIds:[ "m_salmon_poke","m_stirfry","m_burrito_bowl","p_salmon","p_eggs","g_oats","g_barley","v_avocado","v_berries","s_granola","d_water","d_chocmilk" ],
    spec:"20g+ protein, 6g+ fibre, < 25% DV sugar, water, 0 caffeine",
    checks:{ minProG:20, minFibG:6, maxSugDv:25, maxCaf:0, needWater:true },
    pearl:"Salmon poke bowls deliver 29g protein and 8g fibre with only 4% DV sugar: sustained rounds fuel. The chocolate milk (34% DV sugar) and the granola bar illusion are crash-and-burn options."
  },
  {
    id:"cfT3", dept:"cafe", tier:2, kind:"cafe",
    patient:"Paediatric Ward Allergy Alert",
    complaint:"Nut-free tray for the peds ward picnic",
    vitals:"Kitchen rules: every single item must be NUT-FREE, 18g+ protein, under 30% DV sodium",
    quote:"The peds ward is doing a picnic and one chart has a serious peanut allergy. Admin's rule: IF IT IS NOT LABELLED NUT-FREE IT DOES NOT BOARD THE TRAY. And the peanut butter cup is sitting right there, grinning.",
    q:"Build a tray where EVERY item is nut-free, with 18g+ protein, under 30% DV sodium, plus water:",
    brief:"Peanut-alert tray: every item tagged nut-free, 18g+ protein, under 30% DV sodium, water.",
    foodIds:[ "p_peanut","p_almonds","s_trailmix","p_chicken","p_eggs","p_greek","g_ww_pasta","v_snap","s_chips","d_water","m_salmon_poke","v_apple" ],
    spec:"100% nut-free items, 18g+ protein, < 30% DV sodium, water",
    checks:{ reqTag:"nut-free", minProG:18, maxSodDv:30, needWater:true },
    pearl:"Serious allergies mean every item on the tray gets checked, not just the obvious ones: almond packs and peanut dip cups fail instantly, and 'may contain' items need a second look. Nut-free trail mix and grilled chicken pass safely."
  },
  {
    id:"cfT4", dept:"cafe", tier:3, kind:"cafe",
    patient:"The Budget Boss Lunch Rush",
    complaint:"Feed the ER break room for 4.25 dollars or less",
    vitals:"Kitchen rules: balanced 4-zone tray, under $4.25, under 25% DV sugar",
    quote:"The break-room cashier slips you a five and whispers: 'Four twenty-five, doctor. Balanced. With vegetables. If you go over I eat your stethoscope.'",
    q:"Build a balanced tray (veg/fruit + protein + grain + water) for under $4.25 and under 25% DV sugar:",
    brief:"Break-room tray: veg/fruit + protein + grain + water, under $4.25 total, under 25% DV sugar.",
    foodIds:[ "v_apple","v_carrots","p_blackbeans","p_eggs","g_brownrice","g_oats","d_water","p_salmon","m_salmon_poke","m_burrito_bowl","s_fries","s_muffin" ],
    spec:"veg/fruit + protein + grain + water, total under $4.25, under 25% DV sugar",
    checks:{ minVeg:1, minPro:1, minGrain:1, needWater:true, maxBudget:4.25, maxSugDv:25 },
    pearl:"The cheapest balanced trio in the house: carrots ($0.90) + black beans ($0.95) + brown rice ($0.90) + free tap water = $2.75. Real fuel does not require a steak budget."
  },
  {
    id:"cfT5", dept:"cafe", tier:3, kind:"cafe",
    patient:"Cardiac Wing: The Heart-Smart Order",
    complaint:"Low-sodium tray for the post-MI wing",
    vitals:"Kitchen rules: under 15% DV sodium TOTAL, 18g+ protein, 6g+ fibre, water",
    quote:"The cardiac wing dietician's order is written in red pen: FIFTEEN PERCENT. That is the sodium ceiling for the whole tray. The chips and the caesar laugh. The lentil stew waits patiently.",
    q:"Build a tray under 15% DV total sodium, with 18g+ protein, 6g+ fibre, and water:",
    brief:"Heart-smart tray: under 15% DV sodium TOTAL, 18g+ protein, 6g+ fibre, tap water.",
    foodIds:[ "p_salmon","p_eggs","p_greek","g_ww_pasta","g_oats","v_snap","v_avocado","v_berries","m_lentil_stew","s_chips","s_cheese","d_water" ],
    spec:"< 15% DV total sodium, 18g+ protein, 6g+ fibre, water",
    checks:{ maxSodDv:15, minProG:18, minFibG:6, needWater:true },
    pearl:"Sodium hides in processed foods: a full chip bag alone is 20% DV. Low-sodium combos like salmon poke (14%) plus zero-sodium grains can carry a whole tray without breaking the ceiling."
  },
  {
    id:"cfT6", dept:"cafe", tier:4, kind:"cafe", boss:true,
    patient:"BOSS: The Overnight Delivery Failed",
    complaint:"Invent a plant-powered tray after the delivery truck stalled",
    vitals:"Tier 4 double-points boss tray | Kitchen rules: 1 veg, 22g+ protein, 8g+ fibre, under 18% DV sugar, water, no traps",
    quote:"It is 11 PM. The delivery truck carrying ALL the poultry and fish skidded into a snowbank in Burnside. You have until midnight to invent a plant-powered tray for the hungry overnight staff, and Administration is live-tweeting your every move. DOCTOR. YOUR TRAY.",
    q:"BOSS TRAY RUSH: build a tray with at least 1 veg, 22g+ protein, 8g+ fibre, under 18% DV sugar, water, and no trap foods:",
    brief:"Snowbank curveball: the meat truck never came. All-plant tray: 1 veg, 22g+ protein, 8g+ fibre, under 18% DV sugar, water, zero traps.",
    foodIds:[ "p_tofu","p_lentils","p_blackbeans","p_hummus","p_chickpeas","m_curry","m_lentil_stew","m_stirfry","m_burrito_bowl","v_avocado","v_broccoli","v_berries","g_barley","g_quinoa","g_brownrice","d_water","s_fries","v_caesar" ],
    spec:"1 veg, 22g+ protein, 8g+ fibre, < 18% DV sugar, water, no traps",
    checks:{ minVeg:1, minProG:22, minFibG:8, maxSugDv:18, needWater:true, noTraps:true },
    pearl:"Plant proteins rule the overnight shift: tofu and broccoli stir-fry (19g protein, 7g fibre) plus black beans (11g protein, 11g fibre) storms past every target for pennies. No truck required."
  }
);
