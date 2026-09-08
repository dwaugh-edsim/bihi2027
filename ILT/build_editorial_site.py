import os
import json
import html

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))
os.makedirs(OUTPUT_DIR, exist_ok=True)


LESSONS = [
    {
        "id": 1,
        "filename": "lesson-01-career-exploration.html",
        "image": "images/pic01.jpg",
        "school": "Junior High Pilot Exemplar",
        "title": "Career & Lifestyle Exploration",
        "subtitle": "Navigating Personal Identity, Economic Realities & Digital Portfolios",
        "category": "Career & Life Planning",
        "duration": "5–8 hours",
        "duration_bucket": "medium",
        "grade_level": "Grade 7–8",
        "summary": "A guided career and lifestyle planning unit where students use digital self-assessment tools to analyze personal traits, lifestyle goals, education pathways, and future employment opportunities, synthesizing their findings into a permanent personal Google Sites website.",
        "rationale": "Adolescent learners frequently encounter a disconnect between abstract coursework and authentic adult independence. By anchoring inquiry in personal aspirations, cost-of-living calculations, and digital literacy, students build self-awareness and tangible long-term motivation.",
        "outcomes": [
            "ELA / FLA: Learners will create oral, written, and visual communication forms for a range of audiences and purposes.",
            "Career Education: Learners will analyze the relationships between personal interests, career choices, and economic sustainability."
        ],
        "cross_curricular": ["English Language Arts", "French Language Arts", "Mathematics (Personal Finance)", "Technology Education"],
        "competencies": ["Personal Career Development", "Communication", "Critical Thinking"],
        "continuum_skills": [
            {"en": "Plan", "fr": "Planifier"},
            {"en": "Investigate", "fr": "Examiner"},
            {"en": "Communicate", "fr": "Communiquer"}
        ],
        "essential_questions": [
            "What career pathway is best aligned with my personality, values, and core aptitudes?",
            "What educational, training, and financial investments are required to reach my desired career goals?",
            "What realistic lifestyle and cost-of-living standard will this career afford me in Atlantic Canada?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Digital Self-Assessment & Aptitude Mapping",
                "desc": "Guided exploration using validated interest inventories (myBlueprint, Career Cruising) to identify personal strengths, working styles, and matching career clusters."
            },
            {
                "title": "Lifestyle Economics & Monthly Budgeting",
                "desc": "Direct instruction on entry-level compensation vs. median wages, post-secondary tuition, housing expenses, vehicle ownership, and basic taxation."
            },
            {
                "title": "Digital Portfolio Architecture with Google Sites",
                "desc": "Instruction on information hierarchy, clean typography, multi-page site navigation, and digital privacy considerations."
            }
        ],
        "pacing": [
            {"phase": "Phase 1: Self-Discovery & Inventories", "duration": "1–2 Hours", "details": "Students complete interest inventories, identify 3 target careers, and map required educational pathways."},
            {"phase": "Phase 2: Economic Modeling & Budgeting", "duration": "2–3 Hours", "details": "Students model entry-level salaries against typical rental, vehicle, groceries, and savings costs in Nova Scotia."},
            {"phase": "Phase 3: Digital Synthesis (Google Sites)", "duration": "2–3 Hours", "details": "Students build and refine their Google Sites portfolio, integrating infographics, reflection journals, and career timelines."},
            {"phase": "Phase 4: Small-Group Walkthrough & Peer Review", "duration": "1 Hour", "details": "Structured small-group walkthroughs and rubric-guided peer feedback rounds."}
        ],
        "engagement": {
            "cognitive": "Synthesizing complex labor market data, evaluating subjective lifestyle trade-offs, and calculating multi-year personal budgets.",
            "social": "Structured peer review triads where learners critique site navigation clarity and challenge financial assumptions constructively.",
            "physical": "Interactive movement between computer stations, self-directed research pacing, and presentation posturing."
        },
        "assessment": {
            "formative": "Weekly teacher-student conferencing check-ins during research blocks; interim wireframe checklist reviews.",
            "peer": "Draft portfolio peer-review rubric focusing on narrative clarity, visual balance, and completeness of financial research.",
            "summative": "Multi-dimensional rubric assessing career research depth, economic feasibility analysis, and site communication design."
        },
        "sharing": "Students published customized Google Sites to serve as living digital archives for high school transition planning. Final presentations were conducted in rotating small groups to foster intimate dialogue and authentic questioning without the pressure of full-class lecturing.",
        "reflection": "Strong intrinsic motivation was observed when students realized the direct connection between lifestyle choices and career salaries. For future iterations, the teaching team recommends integrating live virtual interviews with industry professionals and local community college alumni.",
        "toolkit": [
            "Chromebooks / Laptops with internet access",
            "Google Workspace accounts (Google Sites, Docs, Sheets)",
            "Provincial career exploration portals (myBlueprint)",
            "Provincial cost-of-living and student loan data sheets"
        ]
    },
    {
        "id": 2,
        "filename": "lesson-02-skill-rotation.html",
        "image": "images/pic02.jpg",
        "school": "Junior High Pilot Exemplar",
        "title": "Multi-Module Skill Rotation & School Design Challenge",
        "subtitle": "A Year-Long Interdisciplinary Journey Across Continuum Competencies",
        "category": "Multi-Unit Rotation & Design Challenge",
        "duration": "Over 16 hours (Year-long, 1 hr/wk)",
        "duration_bucket": "extended",
        "grade_level": "Grade 7–9",
        "summary": "A school-wide year-long rotating modular program where students rotated through specialized teacher-led modules: Mental & Physical Coping Strategies, Nova Scotia Continuum Skill Deconstruction, Space Race Astro-Egg Drop Challenge, Growth Mindset in Personal Role Models, and the Sky's the Limit School Design Challenge.",
        "rationale": "Rather than treating Integrated Learning Time as unstructured study hall, Junior High Pilot Exemplar built a coherent pedagogical continuum. Grounded in Trevor MacKenzie's guided inquiry framework, it systematically moves students from structured skill fluency toward complex architectural and civic design autonomy.",
        "outcomes": [
            "Healthy Living: Learners will analyze relationships between health behaviours and physical, mental, emotional, social, and spiritual health.",
            "Healthy Living: Learners will analyze how life skills influence holistic wellness (Growth Mindset).",
            "Technology Education: Learners will construct a solution to an engineering design challenge (Astro-Egg Drop).",
            "ELA / FLA: Learners will plan and create oral, written, and visual communication forms for a range of audiences and purposes (Build a School Project)."
        ],
        "cross_curricular": ["Healthy Living", "Technology Education", "Science", "Mathematics", "Visual Arts", "ELA / FLA", "Social Studies", "Family Studies"],
        "competencies": ["Citizenship", "Communication", "Critical Thinking", "Creativity & Innovation", "Personal Career Development"],
        "continuum_skills": [
            {"en": "Construct", "fr": "Construire"},
            {"en": "Create", "fr": "Créer"},
            {"en": "Implement", "fr": "Mettre en oeuvre"},
            {"en": "Select", "fr": "Sélectionner"},
            {"en": "Plan", "fr": "Planifier"},
            {"en": "Evaluate", "fr": "Évaluer"},
            {"en": "Apply", "fr": "Mettre en application"},
            {"en": "Question", "fr": "Mettre en question"},
            {"en": "Analyse", "fr": "Analyser"},
            {"en": "Formulate", "fr": "Formuler"},
            {"en": "Reflect", "fr": "Réfléchir"},
            {"en": "Test", "fr": "Tester / Mettre à l'essai"},
            {"en": "Classify", "fr": "Classer"},
            {"en": "Compare", "fr": "Comparer"},
            {"en": "Investigate", "fr": "Examiner"},
            {"en": "Communicate", "fr": "Communiquer"},
            {"en": "Problem Solve", "fr": "Trouver une solution"}
        ],
        "essential_questions": [
            "For what purpose are we investigating integrated learning in our classrooms?",
            "What is our operational understanding of the continuum skills outlined by the renewed Nova Scotia curriculum?",
            "What engineering trade-offs and structural failures emerge during mechanical prototyping?",
            "How can we identify personal cognitive strengths and weaknesses to collaborate dynamically in multi-disciplinary teams?",
            "If you were tasked with architecting the new Eastern Shore high school, how would you configure the curriculum, finances, environmental plant, and school culture?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Continuum Skill Deconstruction & Self-Auditing",
                "desc": "Explicit dissection of curriculum verbs (Analyse vs. Evaluate vs. Formulate) using provincial sample lessons so learners understand the cognitive levels demanded."
            },
            {
                "title": "Guided Inquiry Foundations (Trevor MacKenzie Model)",
                "desc": "Moving learners from structured teacher-guided inquiry toward independent hypothesis generation and project planning."
            },
            {
                "title": "Architectural Systems & Spatial Blueprinting",
                "desc": "Examining international educational facilities, zoning requirements, accessible design principles, and collaborative space acoustics."
            }
        ],
        "pacing": [
            {"phase": "Module 1: Coping & Skill Decoding (Weeks 1–8)", "duration": "8 Hours", "details": "Focus on emotional regulation, metacognition, and mastering the language of the provincial skill continuum."},
            {"phase": "Module 2: Astro-Egg Space Race (Weeks 9–16)", "duration": "8 Hours", "details": "Hands-on structural prototyping, aerodynamic decelerators, kinetic energy dampeners, and live drop testing."},
            {"phase": "Module 3: Growth Mindset & Biography (Weeks 17–24)", "duration": "8 Hours", "details": "Investigating historic and modern figures who overcame systemic failure; personal vulnerability journals."},
            {"phase": "Module 4: Sky's The Limit School Design (Weeks 25–32)", "duration": "8 Hours", "details": "Culminating civic capstone: architectural drafting, pedagogical modeling, budget simulations, and public expo."}
        ],
        "engagement": {
            "cognitive": "Continuous progression from basic self-reflection to complex architectural system modeling and fiscal trade-off analysis.",
            "social": "Cohort-wide rotations where students interacted with different specialist teachers and constantly recalibrated team dynamics.",
            "physical": "Kinetic testing sessions during the Astro-Egg drop challenge, scale modeling, and physical exhibition floor curation."
        },
        "assessment": {
            "formative": "Weekly observational rubrics anchored directly to provincial skill descriptors; self-assessment reflection logs.",
            "peer": "Testing feedback protocols during mechanical drop trials; design critique roundtables.",
            "summative": "Capstone evaluation during the student-led school expo featuring defense presentations before faculty panels."
        },
        "sharing": "Multi-stage public showcases: mechanical drop trials were conducted in front of peers, and the final 'Sky's the Limit' school blueprints were exhibited in an all-school student-led symposium.",
        "reflection": "Pilot educators noted that 6–8 week blocks sometimes lost focus toward the end. For the upcoming year, they planned to streamline into 4-week high-impact modules, calibrate skills collaboratively among teachers prior to school launch, and permit iterative curriculum tweaks mid-year.",
        "toolkit": [
            "Prototyping materials: balsa wood, recycled cardstock, fabric, parachutes, adhesives, testing weights",
            "Blueprint grid paper, architectural drafting software / SketchUp",
            "Trevor MacKenzie inquiry planning scaffolds",
            "Provincial curriculum skill continuum guides"
        ]
    },
    {
        "id": 3,
        "filename": "lesson-03-future-cities.html",
        "image": "images/pic03.jpg",
        "school": "Junior High Pilot Exemplar",
        "title": "Future Cities & Sustainable Urban Planning",
        "subtitle": "Engineering Resilient Metropolises for Climate Adaptation",
        "category": "STEM & Urban Planning",
        "duration": "13–16 hours",
        "duration_bucket": "extended",
        "grade_level": "Grade 7–8",
        "summary": "An interdisciplinary engineering and environmental design challenge where students examine how climate change, population density, renewable energy technologies, and cultural values dictate sustainable urban development, fabricating functional models for an all-school exposition.",
        "rationale": "As coastal communities face severe weather volatility and shifting energy grids, junior high students need holistic opportunities to connect environmental science with civil engineering, geographic GIS principles, and civic governance.",
        "outcomes": [
            "Technology Education 7/8: Construct a solution to an authentic design challenge utilizing the technological design process.",
            "Science 8: Climate Change — evaluate human impacts on global climate and design mitigation and adaptation solutions."
        ],
        "cross_curricular": ["Technology Education", "Science", "Social Studies", "Mathematics"],
        "competencies": ["Communication", "Critical Thinking", "Technological Fluency", "Creativity & Innovation"],
        "continuum_skills": [
            {"en": "Construct", "fr": "Construire"},
            {"en": "Create", "fr": "Créer"},
            {"en": "Select", "fr": "Sélectionner"},
            {"en": "Plan", "fr": "Planifier"},
            {"en": "Apply", "fr": "Mettre en application"},
            {"en": "Question", "fr": "Mettre en question"},
            {"en": "Analyse", "fr": "Analyser"},
            {"en": "Reflect", "fr": "Réfléchir"},
            {"en": "Compare", "fr": "Comparer"},
            {"en": "Investigate", "fr": "Examiner"},
            {"en": "Communicate", "fr": "Communiquer"},
            {"en": "Problem Solve", "fr": "Trouver une solution"}
        ],
        "essential_questions": [
            "What fundamental infrastructure defines a functioning, humane city?",
            "What does environmental, economic, and social sustainability mean in practice?",
            "Why is geographical topography and ecological proximity decisive when planning municipal water, energy, and transit grids?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Urban Zoning, Utilities & Renewable Grids",
                "desc": "Examining circular economies, solar/wind/tidal micro-grids, greywater treatment, and high-density residential zoning."
            },
            {
                "title": "Climate Vulnerability & Coastal Engineering",
                "desc": "Analyzing sea-level rise models, storm surge barriers, urban heat island mitigation, and permeable pavements."
            },
            {
                "title": "Iterative Scale Prototyping & Spatial Layout",
                "desc": "Translating 2D site maps into dimensional scale physical models using diverse structural media."
            }
        ],
        "pacing": [
            {"phase": "Phase 1: Urban Systems Research", "duration": "3–4 Hours", "details": "Investigating modern city case studies (Copenhagen, Curitiba, Singapore) and identifying environmental failure points."},
            {"phase": "Phase 2: Master Site Planning", "duration": "3–4 Hours", "details": "Drafting municipal charters, energy budgets, transit networks, and zoning blueprints."},
            {"phase": "Phase 3: Model Fabrication", "duration": "4–5 Hours", "details": "Constructing physical or high-fidelity digital models incorporating working mechanical or electrical elements."},
            {"phase": "Phase 4: School Expo & Evaluation", "duration": "3 Hours", "details": "Hosting multi-day cross-grade gallery walkthroughs with interactive peer exit review slips."}
        ],
        "engagement": {
            "cognitive": "Complex systems-level thinking balancing resource scarcity, population expansion, and environmental preservation.",
            "social": "Collaborative design charrettes, peer compromise on conflicting municipal priorities, and public presentation to touring classes.",
            "physical": "Hands-on model construction utilizing cutting tools, recycled composites, papier-mâché, LED circuits, and spatial installation."
        },
        "assessment": {
            "formative": "Google Forms milestone tracking, weekly engineering exit slips, and teacher observation checklists.",
            "peer": "Touring student exit tickets assessing technological ingenuity and realistic ecological planning.",
            "summative": "Comprehensive project rubric evaluating research depth, design innovation, structural execution, and oral presentation."
        },
        "sharing": "During the final 3 weeks of the term, students transformed their classrooms into a Future Cities Expo. A scheduled rotation enabled classes throughout Junior High Pilot Exemplar to complete interactive walkthroughs, interview the student architects, and evaluate innovations using rubric exit slips.",
        "reflection": "The faculty observed that back-loading hands-on building into the final month caused anxiety for students who were eager to prototype earlier. In future iterations, tactile modeling will begin in week two to parallel theoretical research and allow continuous formative assessment throughout the year.",
        "toolkit": [
            "Scale modeling supplies: foam board, recycled cardboard, timber dowels, craft wire, non-toxic adhesives",
            "Electronics: basic LEDs, coin batteries, copper tape for urban lighting circuits",
            "Digital mapping tools & climate projection datasets",
            "Structured Google Forms exit slips for visiting classes"
        ]
    },
    {
        "id": 4,
        "filename": "lesson-04-community-action.html",
        "image": "images/pic04.jpg",
        "school": "Junior High Pilot Exemplar",
        "title": "Community Action, Upcycling & Multicultural Rotations",
        "subtitle": "Homeroom Anchoring Meets Specialized Interdisciplinary Challenges",
        "category": "Community Action & Maker Challenges",
        "duration": "Over 16 hours (3–5 week blocks)",
        "duration_bucket": "extended",
        "grade_level": "Grade 7–8",
        "summary": "A dynamic rotational curriculum organized into 3-to-5-week thematic blocks. Students remained anchored in homerooms while specialist educators rotated through, facilitating deep dives into local homelessness alleviation, positive civic leadership, cultural heritage fairs, and cardboard engineering.",
        "rationale": "By keeping adolescent students anchored in their supportive homeroom peer groups while cycling enthusiastic teachers through diverse thematic modules, the school balanced social-emotional security with diverse intellectual challenges.",
        "outcomes": [
            "Cross-curricular outcomes spanning ELA (persuasive discourse), Social Studies (civic structures & poverty), Visual Arts / Family Studies (upcycled craft), and Mathematics (materials optimization)."
        ],
        "cross_curricular": ["Social Studies", "Visual Arts", "English Language Arts", "Healthy Living", "Mathematics"],
        "competencies": ["Communication", "Critical Thinking", "Creativity & Innovation", "Citizenship"],
        "continuum_skills": [
            {"en": "Construct", "fr": "Construire"},
            {"en": "Create", "fr": "Créer"},
            {"en": "Problem Solve", "fr": "Trouver une solution"}
        ],
        "essential_questions": [
            "How does homelessness manifest in our municipal community, and what systemic barriers prevent long-term housing security?",
            "What distinguishes an effective, empathetic community leader, and how can youth advocate for tangible civic equity?",
            "How can discarded post-consumer waste be re-engineered into functional, aesthetic solutions through upcycling?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Community Demographics & Social Justice Inquiry",
                "desc": "Investigating local food bank statistics, shelter capacities, and municipal zoning policies impacting affordable housing."
            },
            {
                "title": "Cardboard Engineering & Mechanical Fasteners",
                "desc": "Instruction on corrugation grain, slotted joints, brad fasteners, and load-bearing folded structures without relying solely on tape."
            },
            {
                "title": "World Geography & Cultural Storytelling",
                "desc": "Examining cultural traditions, diaspora narratives, and authentic representations for the school-wide Multicultural Fair."
            }
        ],
        "pacing": [
            {"phase": "Block 1: Homelessness & Civic Advocacy", "duration": "4–5 Hours", "details": "Community needs analysis, empathy interviews, service project proposals, and local shelter support initiatives."},
            {"phase": "Block 2: Global Cardboard Challenge", "duration": "4–5 Hours", "details": "Prototyping games, furniture, and functional kinetic devices from 100% recycled corrugated packaging."},
            {"phase": "Block 3: Multicultural Heritage Fair", "duration": "4–5 Hours", "details": "Researching family origins, culinary traditions, indigenous treaties, and presenting interactive cultural exhibits."},
            {"phase": "Block 4: Showcase & Synthesis", "duration": "2–3 Hours", "details": "Cross-school exhibition of upcycled machines and community action presentations."}
        ],
        "engagement": {
            "cognitive": "Grappling with socioeconomic inequality, analyzing supply chain waste, and reverse-engineering mechanical linkages.",
            "social": "Deepening homeroom solidarity while collaborating on community fundraising and shared maker builds.",
            "physical": "Tactile manipulation of corrugated cardboard, box cutters with safety guides, score-folding, and building life-sized interactive arcade games."
        },
        "assessment": {
            "formative": "Regular teacher-student conferences in homerooms, reflective journaling, and design sketch reviews.",
            "peer": "Playtesting feedback protocols during the Cardboard Challenge arcade trials.",
            "summative": "Authentic performance assessment during public fairs evaluated against rubrics for empathy, craftsmanship, and research depth."
        },
        "sharing": "Celebrated through public exhibitions including an all-school Multicultural Fair and an interactive Cardboard Challenge arcade where peer classes played student-engineered games.",
        "reflection": "Pilot teachers recognized that having teachers move between homerooms created logistical bottlenecks with materials. Recommendations for future cycles included curating benchmark exemplars beforehand, building a shared digital repository of student work, and piloting student movement between specialized studio spaces.",
        "toolkit": [
            "Corrugated cardboard sheets, safe cardboard saws (Makedo), brass brads, PVA adhesive",
            "Municipal census data, local non-profit reports",
            "Cultural artifact display boards, multimedia projection tools"
        ]
    },
    {
        "id": 5,
        "filename": "lesson-05-teamwork-towers.html",
        "image": "images/pic05.jpg",
        "school": "Junior High Pilot Exemplar",
        "title": "Teamwork Towers & Upcycled Structural Engineering",
        "subtitle": "High-Velocity Engineering, Persuasive Discourse & Stress-Testing",
        "category": "Engineering & Team Collaboration",
        "duration": "1–4 hours (Focused Sprint)",
        "duration_bucket": "short",
        "grade_level": "Grade 7–8",
        "summary": "A high-energy, rapid-iteration structural design sprint where student teams repurpose upcycled materials (empty bottles, sticks, paper, twine) into the tallest, most cost-effective, and highest load-bearing free-standing tower or bridge, culminating in public stress-testing to failure.",
        "rationale": "Students need low-stakes, high-impact sandboxes to practice resilience in the face of physical failure. Teamwork Towers strips away lengthy theoretical lecturing and immediately immerses learners in tangible physics, rapid iteration, and consensus-building.",
        "outcomes": [
            "Science & Technology Education: Apply the engineering design cycle to build structures capable of withstanding specified external forces.",
            "General Competencies: Develop transferable collaborative communication, distributed leadership, and digital/technical literacy."
        ],
        "cross_curricular": ["Science", "Technology Education", "Mathematics (Geometry & Ratios)", "English Language Arts"],
        "competencies": ["Communication", "Technological Fluency", "Creativity & Innovation", "Critical Thinking"],
        "continuum_skills": [
            {"en": "Construct", "fr": "Construire"},
            {"en": "Create", "fr": "Créer"},
            {"en": "Select", "fr": "Sélectionner"},
            {"en": "Plan", "fr": "Planifier"},
            {"en": "Evaluate", "fr": "Évaluer"},
            {"en": "Apply", "fr": "Mettre en application"},
            {"en": "Question", "fr": "Mettre en question"},
            {"en": "Formulate", "fr": "Formuler"},
            {"en": "Test", "fr": "Tester / Mettre à l'essai"},
            {"en": "Investigate", "fr": "Examiner"},
            {"en": "Communicate", "fr": "Communiquer"},
            {"en": "Problem Solve", "fr": "Trouver une solution"}
        ],
        "essential_questions": [
            "What defines structural efficiency: total height, aesthetic symmetry, or load-to-mass ratio?",
            "How do team members navigate sharp disagreements under strict time and resource constraints?",
            "What can catastrophic structural failure teach an engineer that initial success hides?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Truss Geometry & Center of Gravity",
                "desc": "Examining why equilateral triangles maintain rigidity under shear stress and how wide foundation bases lower the center of mass."
            },
            {
                "title": "Persuasive Technical Dialogue & Consensus",
                "desc": "Protocols for articulating design proposals using evidence and testing prototypes rather than shouting over teammates."
            }
        ],
        "pacing": [
            {"phase": "Sprint 1: Constraint Briefing & Co-Creation", "duration": "30 Mins", "details": "Co-creating success criteria (minimum height, allowable materials list, penalty costs for excess adhesive)."},
            {"phase": "Sprint 2: Team Prototyping & Iteration", "duration": "90 Mins", "details": "Fast-paced fabrication; testing preliminary stability against lateral fan winds and baseline test weights."},
            {"phase": "Sprint 3: Stress-Testing Showcase", "duration": "45 Mins", "details": "Live public loading: placing standardized weights until catastrophic structural buckling occurs."},
            {"phase": "Sprint 4: Post-Mortem Debrief", "duration": "35 Mins", "details": "Analyzing high-speed video replays of tower collapses to diagnose structural failure points."}
        ],
        "engagement": {
            "cognitive": "Real-time physics intuition, force vector balancing, and calculating cost-efficiency indices.",
            "social": "Strength-based team role assignment (Structural Architect, Resource Manager, Testing Specialist, Quality Assessor).",
            "physical": "Intense manual construction, delicate balancing of counterweights, and measuring deflection under load."
        },
        "assessment": {
            "formative": "Socratic prompting by educators circulating through team pits ('What force is causing this joint to bow? How can you reinforce it?').",
            "peer": "Post-challenge peer evaluations regarding reliability, communication transparency, and shared labor.",
            "summative": "Structural performance index scoring (Height x Load Supported / Total Material Mass)."
        },
        "sharing": "Demonstrated live in front of the assembled grade cohort with calibrated digital scales and weights. High-stakes live testing generated immense peer excitement and collective analysis of mechanical physics in real time.",
        "reflection": "The instructional team found that isolated 1-hour weekly classes disrupted project momentum. They recommended grouping sessions into linked 2-week continuous workshop blocks, allowing students to design on day one and build/test without tearing down materials mid-stride.",
        "toolkit": [
            "Upcycled materials: pop bottles, cardboard rolls, popsicle sticks, wooden skewers, newspapers",
            "Fasteners: masking tape (rationed to 2 meters per team), hot glue guns, elastic bands",
            "Testing equipment: metric weights, hanging loading buckets, digital calipers, stopwatches"
        ]
    },
    {
        "id": 6,
        "filename": "lesson-06-personal-project.html",
        "image": "images/pic06.jpg",
        "school": "Junior High Pilot Exemplar",
        "title": "Choose Your Own Adventure Personal Project",
        "subtitle": "Radical Student Autonomy, Passion Inquiries & Tailored Mentorship",
        "category": "Inquiry & Passion-Based Learning",
        "duration": "5–8 hours",
        "duration_bucket": "medium",
        "grade_level": "Grade 7",
        "summary": "A purely student-centered inquiry model where learners formulate authentic driving questions and produce original passion artifacts ranging from hand-laminated hockey sticks and athletic training regimens to Ukraine humanitarian campaigns, brass instrument mastery, fantasy novels, and pastel art.",
        "rationale": "When adolescents possess genuine agency over their learning targets, disengagement evaporates. By providing rigorous scaffolding around self-management, project planning, and communication, Pilot teachers proved that student autonomy yields profound academic excellence.",
        "outcomes": [
            "ELA 7: Learners will create oral, written, and visual communication forms for a range of audiences and purposes.",
            "ELA 7: Learners will implement speaking and writing strategies for effective communication in relation to audience and purpose.",
            "Healthy Living 7: Learners will analyze how life skills and personal passions influence physical, mental, emotional, social, and spiritual health."
        ],
        "cross_curricular": ["English Language Arts", "Healthy Living", "Visual Arts", "Music", "Physical Education", "Social Studies"],
        "competencies": ["Communication", "Personal Career Development", "Creativity & Innovation", "Critical Thinking"],
        "continuum_skills": [
            {"en": "Create", "fr": "Créer"},
            {"en": "Plan", "fr": "Planifier"},
            {"en": "Communicate", "fr": "Communiquer"}
        ],
        "essential_questions": [
            "What topic, skill, or global challenge am I intrinsically passionate enough to pursue independently?",
            "How do I decompose an ambitious, open-ended goal into manageable weekly milestones?",
            "How do I demonstrate mastery of my learning to an authentic audience who may know nothing about my craft?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Formulating High-Leverage Driving Questions",
                "desc": "Converting simplistic Google-searchable queries ('How is a hockey stick made?') into rigorous inquiry challenges ('How does carbon fiber layering vs. ash wood affect puck velocity?')."
            },
            {
                "title": "Project Management & Milestone Checklists",
                "desc": "Using digital Kanban boards and planning calendars to establish deadlines, source materials, and mitigate project risks."
            }
        ],
        "pacing": [
            {"phase": "Stage 1: Proposal & Pitch Defense", "duration": "1–2 Hours", "details": "Students pitch project plans, required materials, and success criteria to teacher coaches for approval."},
            {"phase": "Stage 2: Deep Inquiry & Studio Fabrication", "duration": "3–4 Hours", "details": "Independent reading, physical crafting, musical rehearsal, or digital composition supported by one-on-one teacher check-ins."},
            {"phase": "Stage 3: Peer Critique Circles", "duration": "1 Hour", "details": "Mid-point gallery walks where students review works-in-progress and provide constructive advice."},
            {"phase": "Stage 4: Passion Symposium", "duration": "1–2 Hours", "details": "Classroom showcase featuring live performances, artifact demonstrations, and multimedia presentations."}
        ],
        "engagement": {
            "cognitive": "Deep domain-specific problem solving tailored to each student's chosen discipline (musical notation, athletic physiology, geopolitical history).",
            "social": "Empathetic peer coaching circles and sharing unique personal identities with classmates.",
            "physical": "Directly tailored: physical conditioning routines, wood carving and lamination, instrumental technique, or expressive painting."
        },
        "assessment": {
            "formative": "Individual coaching dialogues at the start of each block; weekly progress self-ratings against the student's initial proposal.",
            "peer": "Constructive 'Warm & Cool' feedback protocols during mid-point peer review sessions.",
            "summative": "Comprehensive mastery rubric assessing self-direction, depth of inquiry, craftsmanship of artifact, and clarity of final presentation."
        },
        "sharing": "Students presented finished artifacts directly to classmates during an interactive symposium. Displays included custom physical sporting goods, musical recitals, geopolitical informational pamphlets, and illustrated book readings.",
        "reflection": "Educators noted that student pride was exceptionally high because products were self-chosen. For upcoming iterations, adding structured mid-point benchmark deadlines will help students with time-management challenges avoid last-minute rushes.",
        "toolkit": [
            "Inquiry proposal templates and Kanban planning sheets",
            "Maker supplies, art media, instrument access, athletic facilities based on individual student requests",
            "Digital documentation tools (camera phones, audio recorders, digital journals)"
        ]
    },
    {
        "id": 7,
        "filename": "lesson-07-competency-recovery.html",
        "image": "images/pic07.jpg",
        "school": "Junior High Pilot Exemplar",
        "title": "Collaborative Competency Recovery & Academic Discourse",
        "subtitle": "Rebuilding Interpersonal Stamina Through Debate, Beaver Math & Kinetic Breaks",
        "category": "Cross-Curricular Competency Recovery",
        "duration": "Over 16 hours (Full Year Continuum)",
        "duration_bucket": "extended",
        "grade_level": "Grade 7–9",
        "summary": "A holistic instructional intervention engineered to repair collaboration gaps, social communication anxiety, and problem-solving stamina through structured debate protocols and the Beaver Computing Challenge, interleaved with scheduled physical gym movement breaks.",
        "rationale": "Following significant disruptions to adolescent schooling, students exhibited marked deficits in working collaboratively without teacher intervention. Educators recognized that students cannot simply be told to 'group up'; collaborative discourse requires explicit scaffolding, safe debate frameworks, and physical endorphin resets.",
        "outcomes": [
            "Atlantic Canada Competencies: Explicit mastery of Collaboration, Communication, Critical Thinking, and Technological Fluency across all subject areas."
        ],
        "cross_curricular": ["English Language Arts", "Mathematics / Computer Science", "Social Studies", "Physical Education"],
        "competencies": ["Communication", "Critical Thinking", "Technological Fluency", "Creativity & Innovation", "Collaboration"],
        "continuum_skills": [
            {"en": "Communicate", "fr": "Communiquer"},
            {"en": "Problem Solve", "fr": "Trouver une solution"}
        ],
        "essential_questions": [
            "How do we disagree respectfully and build evidence-based counter-arguments during high-stakes debate?",
            "How do we decompose complex, intimidating logic puzzles into solvable mathematical components?",
            "How does physical movement influence cognitive focus and emotional regulation during academic strain?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Silent Debate Gallery Protocol & Argument Toolkit",
                "desc": "Facilitating a 7-station silent debate gallery (Grades, School Start Time, AI Tools, Video Games as Sports, Voting Age, Social Media, Homework Ban) using the 4-part toolkit (Claim, Reason, Evidence, Example) and structured rebuttal formula ('They say..., but... because...')."
            },
            {
                "title": "Parliamentary Debate Structure & Refutation Protocols",
                "desc": "Teaching the anatomy of an argument (Claim, Evidence, Warrant, Impact) and polite refutation etiquette ('While my opponent claims X, the empirical data demonstrates Y')."
            },
            {
                "title": "Algorithmic Thinking via Beaver Computing Challenge",
                "desc": "Deconstructing non-standard logic and pattern recognition problems into sequential decision trees."
            },
            {
                "title": "Collaborative Norm Setting & Active Listening",
                "desc": "Training students to paraphrase a partner's viewpoint before stating their own counter-perspective."
            }
        ],
        "pacing": [
            {"phase": "Phase 1: Norms & Silent Debate Protocol", "duration": "3–4 Hours", "details": "Establishing silent debate rules, practicing Claim-Reason-Evidence-Example chains, and running 7-station rotation rounds using the interactive timer."},
            {"phase": "Phase 2: Parliamentary Debate Tournament", "duration": "5–6 Hours", "details": "Researching controversial contemporary topics, drafting argument briefs, and holding timed tournament rounds."},
            {"phase": "Phase 3: Beaver Computational Challenge", "duration": "4–5 Hours", "details": "Collaborative problem-solving rounds on computer science concepts, pattern recognition, and optimization."},
            {"phase": "Phase 4: Synthesis & Grade-Level Finals", "duration": "3 Hours", "details": "School-wide showcase debates held in the auditorium and grade-wide mathematics relays."}
        ],
        "engagement": {
            "cognitive": "Synthesizing research under time limits, rapid written and verbal rebuttal, and algorithmic pattern deconstruction.",
            "social": "Silent station rotations with multi-colored written responses; partner reliance during formal debate rounds.",
            "physical": "Gallery movement around station sheets with scheduled gym movement breaks integrated to release tension and refresh focus."
        },
        "assessment": {
            "formative": "Self-assessment rubrics, Google Forms exit slips, station sheet argument tracking, and teacher coaching during debate preparation.",
            "peer": "Peer scoring ballots evaluating debate delivery, written rebuttal strength, evidence reliability, and respectful refutation.",
            "summative": "Graduation competency tracking rubrics measuring growth in collaborative resilience and verbal/written articulation."
        },
        "sharing": "Students presented formal debate rounds before entire grade-level assemblies in the auditorium, defending policy positions with peer judges and faculty adjudicators.",
        "reflection": "The structured silent debate protocol and parliamentary framework combined with intentional physical gym breaks transformed the school's collaborative culture. Students who previously refused to speak in groups developed confidence through silent written iterations before stepping into spoken debate roles.",
        "toolkit": [
            '<a href="timer.html" target="_blank" style="font-weight: 700; color: #f56a6a;">Interactive 7-Station Rotation Timer (timer.html)</a> — Full-screen timer with 3-minute round countdowns, round counter, audio chimes, keyboard shortcuts (Space, R, M, F), and rotation overlays.',
            '<a href="silent-debate-ilt.pptx" style="font-weight: 700; color: #f56a6a;">Silent Debate 16:9 Presentation Deck (silent-debate-ilt.pptx)</a> — 17-slide master deck including station cards (Stations 1–7 plus Spares A–C), argument toolkit rules, rebuttal formula, and exit reflection prompts.',
            'Rendered Station Cards & Slide Preview Gallery (<code>render/slide01.png</code> through <code>render/slide17.png</code>) for quick printing or digital projection.',
            'Debate timer apps, parliamentary bell, podiums',
            'Beaver Computing Challenge past competition archives',
            'Gymnasium equipment for structured movement intervals (dodgeball, circuit training, cooperative games)',
            'Google Slides & paper reflection rubrics'
        ]
    },
    {
        "id": 8,
        "filename": "lesson-08-improving-communities.html",
        "image": "images/pic08.jpg",
        "school": "Junior High Pilot Exemplar",
        "title": "Improving Our Communities Civic Challenge",
        "subtitle": "Human-Centered Design, Social Innovation & Public Website Publishing",
        "category": "Civic Innovation & Digital Media",
        "duration": "5–8 hours",
        "duration_bucket": "medium",
        "grade_level": "Grade 7",
        "summary": "A civic entrepreneurship challenge where students conduct audits to identify unmet community needs, design viable product or service solutions (addressing demographics, funding, logistics, locations), and pitch their proposals via student-built Google Sites.",
        "rationale": "Civics should not be an abstract lecture about government branches. By empowering adolescents to solve concrete problems in their own streets and parks, students develop authentic civic ownership, analytical research skills, and digital communication competencies.",
        "outcomes": [
            "ELA 7: 7.ENG187.O.2 & 7.ENG187.O.3 — Create oral, written, and visual communication forms for real audiences.",
            "Social Studies 7: 7.SOST187.O.6 — Investigate empowerment and citizen action within local and municipal communities."
        ],
        "cross_curricular": ["English Language Arts", "Social Studies (Citizenship)", "Technology Education", "Mathematics (Budgeting)"],
        "competencies": ["Citizenship", "Communication", "Critical Thinking", "Creativity & Innovation"],
        "continuum_skills": [
            {"en": "Communicate", "fr": "Communiquer"},
            {"en": "Problem Solve", "fr": "Trouver une solution"}
        ],
        "essential_questions": [
            "How can we identify invisible or neglected needs within our local community?",
            "How do we create measurable, positive change that is economically and logistically sustainable?",
            "How do we build a persuasive digital platform to mobilize citizens and municipal leaders to back our cause?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Community Auditing & Empathy Mapping",
                "desc": "Techniques for observing municipal deficits (transit gaps, youth recreational deserts, elder loneliness) without bias."
            },
            {
                "title": "Web Architecture & Persuasive Copywriting with Google Sites",
                "desc": "Structuring landing pages, writing compelling calls-to-action, embedding maps, and optimizing mobile visual readability."
            },
            {
                "title": "Advanced Digital Search & Civic Fact-Checking",
                "desc": "Using search operators (site:.ca, filetype:pdf) to find municipal bylaws, transit schedules, and municipal budget reports."
            }
        ],
        "pacing": [
            {"phase": "Phase 1: Community Needs Discovery", "duration": "1–2 Hours", "details": "Needs assessment brainstorming, stakeholder interviews, and selecting a single actionable community challenge."},
            {"phase": "Phase 2: Solution Architecture & Budgeting", "duration": "2–3 Hours", "details": "Modeling the product/service, calculating costs, identifying municipal locations, and planning launch logistics."},
            {"phase": "Phase 3: Digital Platform Development", "duration": "2 Hours", "details": "Authoring multi-page Google Sites with project missions, demographic charts, and interactive feedback forms."},
            {"phase": "Phase 4: Civic Pitch Showcase", "duration": "1–2 Hours", "details": "Pitch presentations delivered to peers and faculty acting as community review boards."}
        ],
        "engagement": {
            "cognitive": "Complex municipal problem solving, regulatory feasibility checks, and budget allocation.",
            "social": "Team negotiation, partner selection, and reciprocal pitch critiques across the whole classroom.",
            "physical": "Interactive pitch walkabouts, station rotations, and visual website layout drafting."
        },
        "assessment": {
            "formative": "Google Forms check-ins, small-group teacher conferences, and iterative website draft feedback.",
            "peer": "Peer review rubrics evaluating site navigation clarity, persuasive strength, and realistic implementation.",
            "summative": "Rubric evaluating civic relevance, research depth, financial feasibility, and visual communication quality."
        },
        "sharing": "Students published live Google Sites and presented them via projector in classroom pitch showcases, answering audience questions regarding implementation feasibility.",
        "reflection": "Educators highlighted extraordinary student pride and civic maturity. For future iterations, the team intends to invite local HRM town counselors and community leaders to serve as external adjudicators for the student pitches.",
        "toolkit": [
            "Google Sites, Google Forms, Google Slides",
            "Local municipal planning maps and transit route datasets",
            "Municipal budget summary spreadsheets",
            "Pitch evaluation rubrics"
        ]
    },
    {
        "id": 9,
        "filename": "lesson-09-bridge-engineering.html",
        "image": "images/pic09.jpg",
        "school": "Junior High Pilot Exemplar",
        "title": "Bridge Engineering & Structural Mechanics",
        "subtitle": "Connecting Science Theory to Hands-On Prototyping & Destructive Testing",
        "category": "Physics & Engineering",
        "duration": "5–8 hours",
        "duration_bucket": "medium",
        "grade_level": "Grade 7",
        "summary": "An interdisciplinary pairing between Grade 7 Science Engineering Structures and maker time in ILT. Students explore compression, tension, shear, torsion, and triangular trusses, constructing and destructively load-testing bridge spans.",
        "rationale": "Science curricula frequently suffer from time shortages that limit hands-on fabrication. By utilizing Integrated Learning Time as an authentic extension of science class, students bridge the gap between textbook equations and physical structural reality.",
        "outcomes": [
            "Science 7: 7.SC187IM.O.7 — Engineering structures: Learners will construct a structure in response to a design challenge.",
            "Mathematics 7: Geometric measurement, scale ratios, and proportional reasoning."
        ],
        "cross_curricular": ["Science 7", "Technology Education", "Mathematics 7"],
        "competencies": ["Critical Thinking", "Creativity & Innovation", "Collaboration"],
        "continuum_skills": [
            {"en": "Construct", "fr": "Construire"},
            {"en": "Apply", "fr": "Mettre en application"}
        ],
        "essential_questions": [
            "Why are triangular trusses universally employed in heavy-load bridge architecture?",
            "How do internal structural forces (tension vs. compression) interact with external environmental loads?",
            "How do engineers optimize structural efficiency to maximize load capacity while minimizing self-weight?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Triangulation & Truss Mechanics",
                "desc": "Experimental exploration of polygon rigidity: comparing square frame collapse against triangular truss stability."
            },
            {
                "title": "Material Joints & Mechanical Fasteners",
                "desc": "Examining joint failure modes: tensile pull-out, gusset plate reinforcement, and the chemistry of glue curing."
            }
        ],
        "pacing": [
            {"phase": "Phase 1: Engineering Blueprinting", "duration": "1 Hour", "details": "Drafting 1:1 scale structural blueprints on grid paper conforming to strict span, height, and width constraints."},
            {"phase": "Phase 2: Jigs & Component Fabrication", "duration": "2–3 Hours", "details": "Pinning wooden members over wax paper templates and assembling identical left and right truss chords."},
            {"phase": "Phase 3: Cross-Bracing & Final Assembly", "duration": "2 Hours", "details": "Joining side trusses with transverse cross-bracing and roadbed installation."},
            {"phase": "Phase 4: Destructive Load Testing", "duration": "1–2 Hours", "details": "Suspending test buckets from the bridge centerline and adding incremental ballast until catastrophic failure."}
        ],
        "engagement": {
            "cognitive": "Spatial visualization, structural physics calculation, and diagnosing material shear stress points.",
            "social": "Coordinated teamwork in groups of 3–4 requiring division of labor (blueprint cutter, gluer, quality controller).",
            "physical": "Fine motor craftsmanship, precision cutting, applying clamps, and physical load testing."
        },
        "assessment": {
            "formative": "Real-time verbal coaching during fabrication; blueprint alignment checks before adhesive application.",
            "peer": "Team-to-team dimensional compliance checks to ensure bridges meet minimum span requirements.",
            "summative": "Structural Efficiency Ratio = Total Mass Held (g) / Self-Mass of Bridge (g), combined with design logbook marks."
        },
        "sharing": "Destructive testing was held in front of the entire class. The dramatic spectacle of watching bridges withstand hundreds of times their own weight before buckling generated immense peer enthusiasm and empirical learning.",
        "reflection": "The teachers reflected that hot-glue guns were problematic: hot glue cured too quickly for precise adjustments and yielded flexible, rubbery joints that bowed under load. For future cohorts, the team will allocate more construction time and transition to high-strength aliphatic wood glue.",
        "toolkit": [
            "Balsa wood or basswood strips (1/8\" x 1/8\"), craft sticks",
            "Aliphatic wood glue, wax paper, gridded drafting templates, pins/cardboard assembly boards",
            "Testing rig: central loading block, S-hook, bucket, calibrated weights or sand, digital scale"
        ]
    },
    {
        "id": 10,
        "filename": "lesson-10-teacher-passion.html",
        "image": "images/pic10.jpg",
        "school": "Junior High Pilot Exemplar",
        "title": "Teacher Passion Rotation & Student Guided Inquiry",
        "subtitle": "From Educator Inspiration to Autonomous Passion Projects",
        "category": "Multi-Phase Inquiry & Skill Workshops",
        "duration": "13–16 hours (Two-Phase Model)",
        "duration_bucket": "extended",
        "grade_level": "Grade 7",
        "summary": "A two-phase hybrid model where Phase 1 features an 8-week rotation of 1-hour teacher-led workshops sharing personal passions (coding, Muay Thai, sustainable fashion, architecture, art), leading into Phase 2 where students pursue guided inquiry passion projects presented in multimodal formats.",
        "rationale": "Before expecting junior high students to independently drive passion projects, they must first witness authentic passion modeled by adults. Phase 1 ignites curiosity and demystifies expert skills; Phase 2 transfers ownership directly to the students.",
        "outcomes": [
            "ELA 7: Learners will create oral, written, and visual communication forms for a range of audiences and purposes.",
            "ELA 7: Learners will implement speaking and writing strategies for effective communication in relation to audience and purpose."
        ],
        "cross_curricular": ["English Language Arts", "Physical Education", "Visual Arts", "Technology Education", "Science"],
        "competencies": ["Communication", "Critical Thinking", "Technological Fluency", "Creativity & Innovation"],
        "continuum_skills": [
            {"en": "Investigate", "fr": "Examiner"},
            {"en": "Communicate", "fr": "Communiquer"}
        ],
        "essential_questions": [
            "What topics, crafts, or disciplines ignite my intrinsic curiosity outside standard textbooks?",
            "What is the difference between open-ended research questions and closed factual lookups?",
            "How can I package complex specialized knowledge into an engaging workshop for my peers?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Open vs. Closed Inquiry Questioning",
                "desc": "Training students to refine Google-answerable questions into rich, investigative questions that sustain multi-week projects."
            },
            {
                "title": "Digital Source Evaluation & Academic Credibility",
                "desc": "Navigating online information, evaluating source bias, cross-referencing claims, and practicing proper ethical attribution."
            }
        ],
        "pacing": [
            {"phase": "Phase 1: Teacher Passion Rotation", "duration": "8 Weeks (8 Hours)", "details": "Students rotate through 8 distinct 1-hour educator-led workshops (coding, martial arts, textiles, mechanics)."},
            {"phase": "Phase 2: Student Topic Proposal", "duration": "1–2 Hours", "details": "Students brainstorm, evaluate personal interests, draft inquiry proposals, and undergo facilitator review."},
            {"phase": "Phase 3: Scaffolded Research & Creation", "duration": "4–5 Hours", "details": "Decomposed work periods focusing on research, drafting, artifact creation, and script writing."},
            {"phase": "Phase 4: Multi-Format Presentation Symposium", "duration": "2–3 Hours", "details": "Presentations delivered via Google Slides, live demonstrations, interactive peer workshops, or videos."}
        ],
        "engagement": {
            "cognitive": "Deep domain-specific literature research, differentiating credible facts from internet disinformation.",
            "social": "Collaborative peer sharing, giving feedback at milestone check-ins, and leading peer workshops.",
            "physical": "Varies by topic: martial arts physical drills, physical garment stitching, mechanical fabrication, or artistic painting."
        },
        "assessment": {
            "formative": "Facilitator feedback provided at the conclusion of each decomposed project milestone; no punitive grades.",
            "peer": "Audience question-and-answer feedback forms completed by classmates during presentations.",
            "summative": "Process-based portfolio assessment tracking self-regulation, research rigor, and audience communication quality."
        },
        "sharing": "Students shared with classes in flexible formats matched to their comfort level: large-group presentations, small-group roundtables, student-guided peer workshops, recorded video screenings, or physical demonstrations.",
        "reflection": "The school reflected that while student engagement was stellar, future iterations must provide more explicit assessment structures to help students maximize learning gains. They also recommended grouping students by inquiry domain so facilitators with matching subject expertise can mentor them.",
        "toolkit": [
            "Teacher workshop kits (Muay Thai pads, micro:bits for coding, sewing needles/fabric, drawing media)",
            "Guided inquiry milestone journals & planning templates",
            "Presentation tech: projectors, webcams, student Chromebooks"
        ]
    },
    {
        "id": 11,
        "filename": "lesson-11-fluid-power.html",
        "image": "images/pic11.jpg",
        "school": "Junior High Pilot Exemplar",
        "title": "Fluid Power Challenge: Hydraulic vs. Pneumatic Lifts",
        "subtitle": "Applied Fluid Dynamics, Mechanical Advantage & Competitive Engineering",
        "category": "Applied Physics & Pneumatics",
        "duration": "5–8 hours",
        "duration_bucket": "medium",
        "grade_level": "Grade 8",
        "summary": "An applied mechanical engineering competition where students design, construct, and calibrate a fluid-powered mechanical lift. Utilizing syringes, tubing, and mechanical linkages, teams evaluate pneumatic vs. hydraulic systems to construct a device capable of lifting a standard building brick.",
        "rationale": "Fluid dynamics can feel abstract when taught solely through 2D diagrams. By challenging middle-schoolers to physically lift a 2.5 kg brick using plastic syringes and water pressure, Pascal's principle becomes an intuitive, unforgettable reality.",
        "outcomes": [
            "Science 8: Hydraulics and Fluid Dynamics Unit — calculate mechanical advantage and analyze transmission of pressure in fluids.",
            "Technology Education: Inventions & Innovations Unit — design, construct, evaluate, and modify an operational mechanical mechanism."
        ],
        "cross_curricular": ["Science 8", "Technology Education", "Mathematics 8"],
        "competencies": ["Communication", "Critical Thinking", "Technological Fluency", "Creativity & Innovation"],
        "continuum_skills": [
            {"en": "Construct", "fr": "Construire"},
            {"en": "Create", "fr": "Créer"},
            {"en": "Select", "fr": "Sélectionner"},
            {"en": "Plan", "fr": "Planifier"},
            {"en": "Evaluate", "fr": "Évaluer"},
            {"en": "Apply", "fr": "Mettre en application"},
            {"en": "Question", "fr": "Mettre en question"},
            {"en": "Analyse", "fr": "Analyser"},
            {"en": "Formulate", "fr": "Formuler"},
            {"en": "Test", "fr": "Tester / Mettre à l'essai"},
            {"en": "Investigate", "fr": "Examiner"},
            {"en": "Problem Solve", "fr": "Trouver une solution"},
            {"en": "Redesign & Modify", "fr": "Modifier et reconcevoir"}
        ],
        "essential_questions": [
            "What fundamental physical principles distinguish pneumatic systems from hydraulic systems?",
            "Why is an incompressible fluid mechanically superior when engineering heavy lifting mechanisms?",
            "How does fluid viscosity, temperature, and cylinder bore diameter govern force output and stroke speed?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Pascal's Principle & Cylinder Diameter Ratios",
                "desc": "Examining how pressure applied to an enclosed fluid is transmitted undiminished and how differential syringe diameters create mechanical advantage."
            },
            {
                "title": "Fluid Viscosity, Compressibility & Thermal Effects",
                "desc": "Testing air vs. water vs. oil in closed syringe systems to observe force transmission delays and pressure loss."
            }
        ],
        "pacing": [
            {"phase": "Phase 1: Fluid Physics Lab", "duration": "1–2 Hours", "details": "Hands-on syringe pairing experiments comparing compressible air springiness against water rigidity."},
            {"phase": "Phase 2: Linkage & Lever Design", "duration": "2 Hours", "details": "Constructing scissor lifts, single-arm crane jibs, or four-bar linkages using craft wood and pivot pins."},
            {"phase": "Phase 3: Hydraulic Integration & Purging", "duration": "2 Hours", "details": "Mounting cylinders, sealing connections with cable ties, purging air bubbles, and testing empty articulation."},
            {"phase": "Phase 4: Brick Lift Challenge Trials", "duration": "1–2 Hours", "details": "Classroom competition: lifting standard bricks to specified heights with stability and speed scoring."}
        ],
        "engagement": {
            "cognitive": "Calculating mechanical force multipliers, isolating mechanical leverage failure from hydraulic seal failure.",
            "social": "Team engineering roles (Lead Fabricator, Fluidics Specialist, Safety Officer, Systems Tester).",
            "physical": "Fine motor syringe filling, bleeding fluid bubbles, cutting wooden linkages, and balancing load platforms."
        },
        "assessment": {
            "formative": "Verbal formative feedback during testing trials; troubleshooting air leaks and mechanical bind points.",
            "peer": "Reciprocal team evaluations of linkage sturdiness and fluid seal reliability.",
            "summative": "Performance trials score (successful vertical brick displacement, stability under load, structural mass)."
        },
        "sharing": "Conducted as an authentic engineering competition where teams tested their fluid mechanisms publicly before their peers, measuring lift height, cycle time, and mechanical stability.",
        "reflection": "The teacher noted that working with liquids and mechanical fabrication in a standard classroom requires smaller class sizes or additional staff support to ensure safe fluid cleanup and manage tool usage effectively.",
        "toolkit": [
            "Plastic medical syringes (10 mL, 20 mL, 60 mL with Luer-lock tips)",
            "Flexible vinyl tubing (matching syringe nozzles), zip-ties, plastic barbed T-connectors",
            "Standard clay building bricks (approx. 2.3–2.5 kg)",
            "Craft timber strips, corrugated plastic sheets, pivot screws, nuts, hot glue, drill bits"
        ]
    }
]

# ---------------------------------------------------------------------------
# PROPOSED ILT PROJECTS
# Ten pilot-ready, medium-to-long-term project designs (1–2 hours per week)
# authored for this repository. They follow the same documentation schema as
# the piloted exemplars above, but describe forward-looking designs rather
# than retrospective reports.
# ---------------------------------------------------------------------------

PROPOSALS = [
    {
        "id": 1,
        "filename": "proposal-01-cold-case-forensics.html",
        "image": "images/prop01.jpg",
        "school": "Pilot-Ready Proposal",
        "title": "Cold Case Junior High: Forensics & Mock Trial",
        "subtitle": "A Term-Long Fictional Crime Investigation Culminating in a Public Mock Trial",
        "category": "Forensic Science & Civic Procedure",
        "duration": "10–13 hours (One term, 1 hr/wk)",
        "duration_bucket": "extended",
        "grade_level": "Grades 8–9 (ages 13–15)",
        "weekly": "1–2 hours per week across a 10–13 week term",
        "summary": "Students inherit a staged, fictional 'cold case' left behind by a departing detective: a mock crime scene, ambiguous physical evidence, and conflicting witness statements. Across a term they process the scene, run forensic lab rotations, weigh competing hypotheses, build a formal case file, and finally prosecute and defend the accused in a full mock trial before a real jury of invited adults.",
        "rationale": "Crime-scene drama is one of the strongest hooks available for early adolescence, and it is secretly a rigorous scientific method unit in disguise. Every forensic technique — fingerprint dusting, chromatography, fibre comparison, data timelines — demands controlled procedure, precise observation, and honest treatment of inconclusive results. Splitting the class into prosecution and defence teams forces students to argue from evidence rather than intuition, building disciplinary literacy and civic understanding of how justice systems actually operate.",
        "outcomes": [
            "Science 8: Learners will investigate the physical and chemical properties of materials and apply controlled scientific methods to gather and interpret evidence.",
            "ELA: Learners will implement speaking and writing strategies for persuasive communication in relation to audience, purpose, and formal register.",
            "Social Studies: Learners will analyse the roles, rights, and responsibilities of citizens within the justice system."
        ],
        "cross_curricular": ["Science 8", "ELA / FLA", "Social Studies / Citizenship", "Mathematics (Data & Statistics)"],
        "competencies": ["Critical Thinking", "Communication", "Citizenship"],
        "continuum_skills": [
            {"en": "Investigate", "fr": "Examiner"},
            {"en": "Analyse", "fr": "Analyser"},
            {"en": "Test", "fr": "Tester / Mettre à l'essai"},
            {"en": "Evaluate", "fr": "Évaluer"},
            {"en": "Formulate", "fr": "Formuler"},
            {"en": "Communicate", "fr": "Communiquer"}
        ],
        "essential_questions": [
            "What makes evidence reliable — and what makes a conclusion scientifically justified rather than merely convenient?",
            "How does the burden of proof protect a fair trial, and what happens when it fails?",
            "Can the same facts honestly support two opposing stories, and how do we decide between them?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Evidence Types & Chain of Custody",
                "desc": "Direct instruction on physical, trace, digital, and testimonial evidence, plus why documentation discipline (labels, logs, bags) determines whether evidence is admissible."
            },
            {
                "title": "Forensic Lab Techniques Bootcamp",
                "desc": "Hands-on stations for fingerprint lifting and classification, paper chromatography of 'ransom note' inks, fibre and hair microscopy, and blood-drop pattern sketching (using simulated evidence)."
            },
            {
                "title": "Trial Roles, Objections & Courtroom Register",
                "desc": "Scripted practice of opening statements, direct and cross-examination questioning, common objections (leading, hearsay, speculation), and formal address of the bench."
            }
        ],
        "pacing": [
            {"phase": "Phase 1: Scene Processing & First Impressions", "duration": "1–2 Hours", "details": "Teams document the staged scene photographically and on sketch maps, bag labelled evidence, and record initial hypotheses in case journals."},
            {"phase": "Phase 2: Forensic Lab Rotations", "duration": "3–4 Hours", "details": "Weekly lab stations analyse fingerprints, inks, fibres, and digital 'phone records'; each rotation ends with an evidence-entry journal update and reliability rating."},
            {"phase": "Phase 3: Case File Construction & Team Assignments", "duration": "3–4 Hours", "details": "Class is split into prosecution, defence, and court officers; each team sequences its strongest evidence, drafts witness examinations, and anticipates the opposition's argument."},
            {"phase": "Phase 4: The Mock Trial & Verdict", "duration": "2–3 Hours", "details": "A formal trial before an invited adult jury (staff, parents, community members) with deliberation, verdict, and a debrief separating the fiction's outcome from the quality of each team's method."}
        ],
        "engagement": {
            "cognitive": "Weighing conflicting evidence, rating the reliability of each exhibit, and constructing arguments that survive cross-examination.",
            "social": "Interdependent team roles (lead detective, lab analyst, court counsel, witness) and formal adversarial dialogue during trial preparation.",
            "physical": "Kneeling and moving through the staged scene, manipulating lab equipment, and standing to deliver examinations in the trial."
        },
        "assessment": {
            "formative": "Evidence journal conferencing after each lab rotation; teacher checklists for lab procedure and documentation quality.",
            "peer": "Moot-court rehearsal where partner teams cross-examine each other's arguments before the real trial and offer structured critique.",
            "summative": "Case-file rubric (evidence organisation, method rigour, citation of exhibits) plus a trial-performance rubric for use of evidence, courtroom register, and responsiveness."
        },
        "sharing": "The mock trial is the public product: an invited jury of adults hears the case, deliberates, and delivers a verdict, followed by a discussion with the jury about what persuaded them.",
        "reflection": "The case must be written so that evidence is genuinely ambiguous — neither side should hold a slam-dunk. Teachers should recruit a guest with legal or policing experience for the trial day if possible, and plan the scene setup as a reusable kit  Full-class check (28 students): run four forensic lab squads of four; each squad certifies its exhibits and delegates one member as the trial witness, while the remaining twelve students form two prosecution and two defence counsel teams of three. Every student owns named exhibits or a speaking role.",
        "toolkit": [
            "Staged evidence kit (fingerprint ink strips, 'ink' pens for chromatography, fibres, sealed evidence bags and labels)",
            "Case journals (duotangs) and photo documentation tools",
            "Trial role scripts and simplified rules-of-evidence handout",
            "Optional guest juror recruitment letter to families and community members"
        ]
    },
    {
        "id": 2,
        "filename": "proposal-02-podcast-studio.html",
        "image": "images/prop02.jpg",
        "school": "Pilot-Ready Proposal",
        "title": "Soundwaves: Narrative Podcast Studio",
        "subtitle": "Scripting, Interviewing & Sound Design for a Published Podcast Season",
        "category": "Audio Storytelling & Digital Media",
        "duration": "10–12 hours (One term, 1 hr/wk)",
        "duration_bucket": "extended",
        "grade_level": "Grades 8–9 (ages 13–15)",
        "weekly": "1–2 hours per week across a 10–12 week term",
        "summary": "A working audio production studio for one term. Student teams deconstruct great narrative podcasts, pitch a three-episode season on a topic they care about — local history, a community issue, a science explainer — then write scripts, record interviews and narration, design soundscapes, and publish a finished season with a launch listening party.",
        "rationale": "Podcasts occupy a sweet spot for junior high media production: the bar for recording hardware is low (a phone and a quiet closet will do), but the bar for writing, structure, and vocal delivery is genuinely high. Because audio hides the speaker, it is a remarkably safe medium for anxious or self-conscious adolescents while still demanding the full arc of narrative craft — hook, tension, evidence, and resolution.",
        "outcomes": [
            "ELA: Learners will plan and create oral and written texts for an authentic audience, implementing speaking strategies for effective communication.",
            "Music: Learners will analyse and apply the elements of sound — dynamics, texture, and atmosphere — to shape listener emotion.",
            "Social Studies / ELA: Learners will investigate and represent perspectives on a local topic using primary-source interviews."
        ],
        "cross_curricular": ["ELA / FLA", "Music", "Social Studies", "Technology Education"],
        "competencies": ["Communication", "Creativity & Innovation", "Technological Fluency"],
        "continuum_skills": [
            {"en": "Create", "fr": "Créer"},
            {"en": "Plan", "fr": "Planifier"},
            {"en": "Investigate", "fr": "Examiner"},
            {"en": "Formulate", "fr": "Formuler"},
            {"en": "Communicate", "fr": "Communiquer"},
            {"en": "Reflect", "fr": "Réfléchir"}
        ],
        "essential_questions": [
            "What makes a story worth listening to, and what holds a listener through ten minutes of audio?",
            "Whose voices are missing from the stories our community tells about itself?",
            "How do sound, silence, and pacing create meaning that words alone cannot?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Podcast Deconstruction Lab",
                "desc": "Guided listening of 3–4 minute excerpts with a storyboard transcript: students mark hooks, scene changes, music cues, and interview questions that produced surprising answers."
            },
            {
                "title": "Interview Craft & Consent",
                "desc": "Question design (open vs. closed, follow-up ladders), active listening, recording etiquette, and media consent forms for interviewees."
            },
            {
                "title": "Editing & Sound Design Basics",
                "desc": "Multitrack editing in a free tool: cutting filler words, layering ambient sound and music beds, gain staging, and exporting at publishable quality."
            }
        ],
        "pacing": [
            {"phase": "Phase 1: Listen & Pitch", "duration": "1–2 Hours", "details": "Deconstruction lab, team formation, and a one-page season pitch: topic, host voice, episode arcs, and target listener."},
            {"phase": "Phase 2: Script & Storyboard", "duration": "2–3 Hours", "details": "Episode outlines and narration scripts; interview question sets peer-reviewed against the 'surprise test' (could we have guessed the answer?)."},
            {"phase": "Phase 3: Record", "duration": "2–3 Hours", "details": "Studio and field recording: narration takes, in-school and community interviews, and ambience capture; note-taking on retakes needed."},
            {"phase": "Phase 4: Edit, Mix & Publish", "duration": "3 Hours", "details": "Multitrack assembly, music and ambience layering, rough-cut peer listening with feedback forms, final mix, episode artwork, and publishing."},
            {"phase": "Phase 5: Season Launch", "duration": "1 Hour", "details": "A listening-party premiere for invited guests with episode liner notes and a live Q&A with the production teams."}
        ],
        "engagement": {
            "cognitive": "Structuring multi-episode narratives, drafting and revising scripts for the ear rather than the eye, and editing for pacing.",
            "social": "Real interviews with community members; interdependent production roles (host, writer, editor, sound designer).",
            "physical": "Field recording walks, posture and breath work for narration, and hands-on mixing sessions."
        },
        "assessment": {
            "formative": "Script conferences at the outline stage; teacher spot-checks of raw takes with one 'keep, kill, recapture' note per session.",
            "peer": "Rough-cut listening circles using a structured feedback form focused on clarity, pacing, and audio balance.",
            "summative": "Season rubric covering narrative structure, interview quality, technical audio standard, and fit to the pitched premise."
        },
        "sharing": "The finished season is published to the school website (and a podcast platform where board policy permits), premiered at a listening party, and pitched to the community members who gave the interviews.",
        "reflection": "Budget one full session purely for retakes — first-time producers almost always under-record. Set a hard runtime cap per episode (5–7 minutes) to force editing discipline, and secure interview consent forms before recording begins  Full-class check (28 students): seven production crews of four each own one episode across the season, rotating the writer, host, editor, and sound-designer roles internally, so every student holds a named credit in the published catalogue.",
        "toolkit": [
            "Smartphones or school tablets with an external lav or USB microphone",
            "Free multitrack editor (Audacity, GarageBand, or Chrome-compatible audio tools)",
            "Quiet recording spaces and improvised vocal booths (foam, blankets, closets)",
            "Media consent forms and episode planning templates"
        ]
    },
    {
        "id": 3,
        "filename": "proposal-03-escape-room-lab.html",
        "image": "images/prop03.jpg",
        "school": "Pilot-Ready Proposal",
        "title": "Break Open the Curriculum: Escape Room Design Lab",
        "subtitle": "Puzzle Engineering, Curriculum Mapping & Live Hosting for Real Players",
        "category": "Game-Based Learning & Puzzle Engineering",
        "duration": "10–13 hours (One term, 1 hr/wk)",
        "duration_bucket": "extended",
        "grade_level": "Grades 8–9 (ages 13–15)",
        "weekly": "1–2 hours per week across a 10–13 week term",
        "summary": "Students first play, then reverse-engineer, then build: teams design and construct a physical escape-room experience that teaches a specific curriculum outcome — a fractions vault, a photosynthesis chain, a Confederation-era locked desk — and then host it live for other classes, iterating on the escape-rate and hint-request data their real players generate.",
        "rationale": "Designing a puzzle that teaches is far harder — and far richer — than solving one. To build an escape room, students must decompose a curriculum outcome into its prerequisite knowledge, sequence it into a solvable chain, and calibrate difficulty for players who know less than they do. Hosting real audiences then supplies honest, quantified feedback: escape rates, time-on-puzzle, and hint economics become data the designers genuinely want to analyse.",
        "outcomes": [
            "Mathematics: Learners will apply logical reasoning, measurement, and data management to construct and evaluate problem sequences.",
            "ELA: Learners will create precise instructional and narrative texts (clues, signs, room story) for a defined audience.",
            "Technology Education: Learners will design, construct, and evaluate a mechanism or system in response to a design challenge."
        ],
        "cross_curricular": ["Mathematics", "ELA / FLA", "Technology Education", "Science or Social Studies (puzzle content)"],
        "competencies": ["Critical Thinking", "Creativity & Innovation", "Technological Fluency", "Collaboration"],
        "continuum_skills": [
            {"en": "Create", "fr": "Créer"},
            {"en": "Construct", "fr": "Construire"},
            {"en": "Plan", "fr": "Planifier"},
            {"en": "Test", "fr": "Tester / Mettre à l'essai"},
            {"en": "Evaluate", "fr": "Évaluer"},
            {"en": "Problem Solve", "fr": "Trouver une solution"},
            {"en": "Communicate", "fr": "Communiquer"}
        ],
        "essential_questions": [
            "What makes a puzzle hard but fair, and who decides?",
            "How can a hint teach without telling?",
            "What does struggling well look like — and how do we design for it?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Anatomy of a Puzzle Chain",
                "desc": "Deconstructing a demo room into locks, triggers, red herrings, and flows; mapping how each solved artifact feeds the next step."
            },
            {
                "title": "Curriculum Mapping for Puzzle Designers",
                "desc": "Choosing one teachable outcome and decomposing it into the exact facts, procedures, or relationships a player must use to escape."
            },
            {
                "title": "Props, Locks & Low-Tech Mechanisms",
                "desc": "Practical build techniques: combination and keyed padlocks, invisible-ink and UV reveals, envelope cascades, and simple makey-makey or magnet triggers."
            }
        ],
        "pacing": [
            {"phase": "Phase 1: Play & Deconstruct", "duration": "1–2 Hours", "details": "Teams run a teacher-built demo room, then dissect it: which puzzles taught, which merely obstructed, and why."},
            {"phase": "Phase 2: Design & Curriculum Map", "duration": "2–3 Hours", "details": "Each team picks a target outcome and audience grade, drafts a full puzzle-flow diagram, and writes the room's story frame."},
            {"phase": "Phase 3: Build & Wire", "duration": "3–4 Hours", "details": "Physical construction of props, clues, locks, and reveals; internal alpha-test with the design log tracking every fix."},
            {"phase": "Phase 4: Pilot & Iterate", "duration": "2 Hours", "details": "A classmate pilot group plays while designers silently log stall points and hint requests; teams revise puzzles and re-time the run."},
            {"phase": "Phase 5: Host Week", "duration": "2 Hours", "details": "Live hosting of invited classes as game masters; teams collect escape-rate and hint data and present what their players taught them."}
        ],
        "engagement": {
            "cognitive": "Decomposing curriculum content into puzzle mechanics and reasoning from player behaviour data to targeted design fixes.",
            "social": "Team design negotiation plus live game-mastering, which demands calm, generous communication with younger or struggling players.",
            "physical": "Full-size room construction, prop fabrication, and moving between stations during host week."
        },
        "assessment": {
            "formative": "Design-log conferencing during build phases; alpha-test checklists verifying every puzzle chain is solvable as built.",
            "peer": "Pilot-session structured observation: peer players record time-on-puzzle and complete hint tickets that drive revision.",
            "summative": "Design rubric covering curriculum alignment, puzzle-chain logic, build quality, and hosting professionalism, alongside the team's data-informed revision narrative."
        },
        "sharing": "Live hosting for real classes is the audience moment, capped by a data story in which each team presents what their players' behaviour revealed and how they responded.",
        "reflection": "Constrain rooms to one curriculum outcome each — teams that try to teach everything build rooms that teach nothing. Borrow locks from staff families rather than purchasing, and schedule host week with feeder elementary classes early,  Full-class check (28 students): seven puzzle teams of four each build one section of a single connected room (or seven mini-rooms), while a rotating games-master bench and a two-person data crew staff host week — no designer watches from the sidelines.",
        "toolkit": [
            "Combination and keyed padlocks, small lockable boxes and cash boxes",
            "UV pen and flashlight, envelopes, cardstock, and craft consumables",
            "Puzzle-flow planning templates and design logs",
            "Optional: Makey-Makey kits or magnet-reed triggers for one electronic reveal"
        ]
    },
    {
        "id": 4,
        "filename": "proposal-04-cardboard-arcade.html",
        "image": "images/prop04.jpg",
        "school": "Pilot-Ready Proposal",
        "title": "Cardboard Arcade & Micro-Economy",
        "subtitle": "Upcycled Game Invention, Token Economics & a Live Carnival for Feeder Schools",
        "category": "Upcycled Invention & Enterprise",
        "duration": "10–12 hours (One term, 1 hr/wk)",
        "duration_bucket": "extended",
        "grade_level": "Grades 8–9 (ages 13–15)",
        "weekly": "1–2 hours per week across a 10–12 week term",
        "summary": "A one-day cardboard challenge stretched into a full economic cycle: teams invent and iterate upcycled arcade games, design a class currency, price and market their games, then operate a carnival for feeder elementary students — and afterwards crunch the numbers on revenue, costs, and play-per-token to decide how to reinvest their proceeds in a community cause.",
        "rationale": "The cardboard challenge format already has proven pull; the micro-economy layer turns it into a term-long study of incentives. Pricing a game forces cost accounting, playtesting against younger customers forces empathy and iteration, and the token ledger makes abstract math consequential — a mispriced game is visibly unplayed within minutes. Ending with a donation decision adds an authentic citizenship outcome to a project students already love.",
        "outcomes": [
            "Mathematics: Learners will collect, represent, and analyse data on cost, revenue, and usage to make and justify economic decisions.",
            "Social Studies: Learners will examine how economic systems allocate scarce resources and how consumers respond to price and marketing.",
            "ELA: Learners will create persuasive media texts (posters, announcements, signage) for a specific audience.",
            "Visual Arts: Learners will apply principles of design to create an attractive, functional game environment."
        ],
        "cross_curricular": ["Mathematics", "Social Studies / Citizenship", "ELA / FLA", "Visual Arts"],
        "competencies": ["Creativity & Innovation", "Critical Thinking", "Citizenship"],
        "continuum_skills": [
            {"en": "Construct", "fr": "Construire"},
            {"en": "Create", "fr": "Créer"},
            {"en": "Plan", "fr": "Planifier"},
            {"en": "Evaluate", "fr": "Évaluer"},
            {"en": "Compare", "fr": "Comparer"},
            {"en": "Problem Solve", "fr": "Trouver une solution"},
            {"en": "Communicate", "fr": "Communiquer"}
        ],
        "essential_questions": [
            "What makes a game irresistible to play twice?",
            "What is the true cost of the materials we throw away?",
            "How does price change behaviour — for the seller and the buyer?"
        ],
        "scaffolding_lessons": [
            {
                "title": "The Six Archetypes & the Remix Rule",
                "desc": "Carnival games reduce to six mechanic families — toss, roll, launch, race, reaction, and reveal. Teams pick one archetype, copy its proven skeleton, then apply the remix rule: change exactly one variable (projectile, target, scoring, distance, or add a jackpot/bet) rather than inventing from zero. The Starter Idea Bank below seeds this lesson."
            },
            {
                "title": "Prototype Sprint & Playtest Protocols",
                "desc": "Rapid paper-prototyping of game mechanics, then structured playtesting: what to observe, how to record funnel data (plays, replays, quits), and why the second play matters most."
            },
            {
                "title": "Unit Economics of a Carnival Game",
                "desc": "Direct instruction on cost per play, token pricing, break-even token counts, and simple revenue projections — modelled with a worked example before teams set prices."
            },
            {
                "title": "Marketing & the Token Economy",
                "desc": "Naming, poster design, and 'barker pitch' practice, plus co-designing the class currency: denominations, anti-counterfeit marks, and prize-tier budgeting."
            }
        ],
        "pacing": [
            {"phase": "Phase 1: Prototype & Playtest", "duration": "2 Hours", "details": "Rough cardboard prototypes built and stress-tested in class; teams record what made testers replay or walk away."},
            {"phase": "Phase 2: Build Iterations", "duration": "3 Hours", "details": "Second and third builds incorporating playtest findings; durability standards set for a crowd of younger users."},
            {"phase": "Phase 3: Brand, Price & Mint", "duration": "2 Hours", "details": "Game names, posters, and carnival signage; each team sets a token price from its cost sheet; the class mints and distributes its currency."},
            {"phase": "Phase 4: Carnival Operations", "duration": "2 Hours", "details": "Live carnival for feeder elementary classes: operation, token collection, and mid-event tweaks; staffed shifts for all roles."},
            {"phase": "Phase 5: Ledger Debrief & Reinvestment Vote", "duration": "1–2 Hours", "details": "Teams close their ledgers, chart revenue vs. projection, present play-per-token findings, and vote on donating proceeds as a class."}
        ],
        "engagement": {
            "cognitive": "Cost modelling, pricing decisions against real demand, and post-event data analysis comparing projections to outcomes.",
            "social": "Serving younger customers, running staffed shifts, and negotiating the class-wide donation decision.",
            "physical": "Large-scale cardboard construction and an on-your-feet carnival day."
        },
        "assessment": {
            "formative": "Build-phase conferencing against durability and safety checklists; token ledger spot-checks during carnival setup.",
            "peer": "Structured playtest feedback forms from classmates at prototype and iteration stages.",
            "summative": "Enterprise rubric covering game quality, economic reasoning in the ledger and pricing, marketing effectiveness, and the accuracy of the final data debrief."
        },
        "sharing": "The carnival itself is a public event with real customers, and the closing ledger presentations to an invited audience determine a real donation chosen by student vote.",
        "reflection": "Collect cardboard for two weeks before launch — volume matters. Cap token prices from below (not above) to keep the young-customer experience joyful, and pre-book the feeder elementary classes early since the confirmed date drives the whole build calendar.",
        "toolkit": [
            "Recovered cardboard (boxes, tubes) collected in advance, plus cutting mats and safety knives",
            "Tape, hot glue, paints, and decoration consumables",
            "Class currency blanks or token-stamping materials",
            "Ledger and cost-sheet templates; donation decision framework"
        ],
        "idea_bank_intro": "Building a game people love from scrap is genuinely hard — so nobody starts from a blank table. Every classic carnival game runs on one of six mechanic skeletons; teams copy a skeleton, then remix one variable (new projectile, moving target, jackpot slot, head-to-head betting, or a timer). Each idea below lists what it is built from and the replay psychology that makes customers line up twice.",
        "idea_bank": [
            {"game": "Milk-Jug Ladder Toss", "mechanic": "Toss", "materials": "Beanbags sewn from old socks and rice; gallon jugs mounted at three depths on a cardboard back wall", "hook": "Visible scoring ladder — the deep jug is a 5-token near-miss machine"},
            {"game": "Ring-a-Ding Bottles", "mechanic": "Toss", "materials": "Rings made from masking-tape-wrapped cardboard tubes; a crate of recovered glass or plastic bottles", "hook": "Classic one-more-try near miss; resets in seconds"},
            {"game": "Capsule Cornhole", "mechanic": "Toss", "materials": "Scrap plywood or double-layer cardboard board with themed cut holes; sock-and-rice bags", "hook": "Hard mode: an operator wiggles the board on a hinge"},
            {"game": "Gutter Bowling", "mechanic": "Roll", "materials": "Taped plastic-wrap ball; bottle or paper-cup pins; cardboard lane with one deliberate wobble bump", "hook": "The strike chase — near-strikes are more compelling than spares"},
            {"game": "Plinko Paradise", "mechanic": "Roll", "materials": "Bottle-cap puck down a peg board (push pins or golf tees through cardboard); token-valued slots below", "hook": "Jackpot slot variance — players pay again to beat the odds"},
            {"game": "Ramp Racers", "mechanic": "Race", "materials": "CD-wheel cars raced down parallel cardboard ramps; lanes sized for fair starts", "hook": "Players bet a token on their lane before every heat"},
            {"game": "Catapult Alley", "mechanic": "Launch", "materials": "Spoon-and-rubber-band lever catapults firing pom-poms or cork pellets at bucket clusters", "hook": "Progressive distance tiers; players self-select their risk level"},
            {"game": "Cup-Pyramid Blaster", "mechanic": "Launch", "materials": "Balloon-pouch slingshots on a cardboard frame firing wet sponges or paper balls at recovered-cup pyramids", "hook": "Demolition satisfaction; the reset itself is a mini-game"},
            {"game": "Stomp Air Cannon", "mechanic": "Launch", "materials": "2L bottle + balloon-diaphragm stomp launcher firing air puffs at light towers", "hook": "The wow factor — invisible force knocking things over draws a crowd"},
            {"game": "Marble Run Derby", "mechanic": "Race", "materials": "Marbles down towel-tube and box-lid tracks with parallel lanes", "hook": "Betting on lanes; the photo-finish argument is part of the fun"},
            {"game": "Bottle Flip Rally", "mechanic": "Reaction", "materials": "Recovered bottles and tape-ring target zones of increasing size", "hook": "Progressive difficulty ladder; self-imposed 'one more flip' loop"},
            {"game": "Whack-a-Cap", "mechanic": "Reaction", "materials": "Caps pushed up from behind through cardboard tubes by the operator; soft mallets (cardboard and tape)", "hook": "Head-to-head duel format — operator versus player, spectators referee"},
            {"game": "Coin Slide Shuffleboard", "mechanic": "Roll", "materials": "Wooden disks or large buttons slid up a smooth board into taped scoring zones", "hook": "Risk ladder: push harder for the 5-token zone and risk sliding off"},
            {"game": "Ladder Toss Classic", "mechanic": "Toss", "materials": "Bolos made from retired tennis balls and pantyhose; cardboard rung ladder", "hook": "Rung values (1/2/5) create instant trash-talk and rematches"},
            {"game": "Mystery Feel-Boxes", "mechanic": "Reveal", "materials": "Boxes with fabric sleeve holes hiding odd recovered objects to identify by touch", "hook": "Curiosity plus gross-out; correct guesses pay out, wrong guesses become legend"},
            {"game": "Fortune Cup Pyramid", "mechanic": "Reveal", "materials": "Cup pyramid with prize notes hidden under select cups", "hook": "Choice-under-uncertainty — players discuss 'reads' like it is strategy"}
        ],
        "class_scaling_intro": "A class of 28 is not an obstacle for this project — it is the minimum viable carnival. The design assumes seven teams of exactly four, which is also the free-rider ceiling: below five members, every contribution stays visible. The levers below keep all 28 students legitimately busy from prototype week to the ledger debrief.",
        "class_scaling_levers": [
            {"lever": "Team Grid: 7 × 4", "how": "28 divides into seven teams of four with no remainder. Each team drafts a different mechanic archetype (toss, roll, launch, race, reaction, reveal, plus one designer's-choice hybrid), which guarantees carnival variety and prevents four clones of ring toss."},
            {"lever": "Role Cards with Rubric Teeth", "how": "Each team carries four named roles: Build Lead (fabrication and durability), Ledger Keeper (cost sheets, pricing, token math), Brand Lead (name, poster, barker pitch), and Game-Master (operations plan, staffing, queue design). Each role's deliverable is assessed individually — accountability lives in the role, not the group grade."},
            {"lever": "Workshop Logistics", "how": "Seven simultaneous builds hit tool bottlenecks fast: run two or three numbered glue/cutting stations with a checkout system, a materials depot staffed by a rotating storekeeper crew, and intra-team parallel work streams (build, cost math, marketing draft, playtest) so no student ever waits idle on a glue gun."},
            {"lever": "Throughput Rules for Carnival Day", "how": "Target sub-60-second play cycles — a booth with a three-minute cycle and a queue is where engagement dies. Run two booth shifts plus a floater crew; stage head-to-head booths so the queue becomes the audience; and give launch games backstops and lane spacing for a room of 60 kids."},
            {"lever": "Data at Scale", "how": "Every class playtest session yields 28 tester data points per round — enough for real play-per-token, revenue-per-booth, and queue-time statistics in the Phase 5 debrief. The economics analysis is stronger because the class is bigger, not despite it."}
        ]
    },
    {
        "id": 5,
        "filename": "proposal-05-sprout-microgreens.html",
        "image": "images/prop05.jpg",
        "school": "Pilot-Ready Proposal",
        "title": "SPROUT: Microgreens & School Food Security Enterprise",
        "subtitle": "Controlled-Environment Growing, Cost Modelling & a Community Food Donation Program",
        "category": "Applied Botany & Social Enterprise",
        "duration": "12–16 hours (Full term, 1 hr/wk + daily check rota)",
        "duration_bucket": "extended",
        "grade_level": "Grades 8–9 (ages 13–15)",
        "weekly": "1–2 hours per week plus a 5-minute daily class check rota",
        "summary": "The school becomes a small controlled-environment farm. Students run two full grow cycles of microgreens under LED lights — the second as a designed experiment varying light or density — log growth and yield data, model cost per tray, interview a local food-security organization, then harvest, prepare recipe cards, and deliver a donation with a data-backed proposal for scaling up to a permanent vertical farm rack.",
        "rationale": "Food is the rare topic that connects photosynthesis, statistics, household budgets, and justice in a single experience students can taste. Microgreens are ideal for a school context because the 7–14 day crop cycle means every two-week ILT block contains a complete sow-grow-harvest arc, delivering repeated cycles of authentic data collection. Anchoring the project in local food insecurity converts a biology unit into an act of measurable community care.",
        "outcomes": [
            "Science 7/8: Learners will investigate photosynthesis and the factors affecting plant growth, controlling variables in a designed experiment.",
            "Mathematics: Learners will model rates and costs, and represent growth and yield data to support conclusions.",
            "Healthy Living: Learners will analyse food security, nutrition, and the factors that influence access to healthy food in their community."
        ],
        "cross_curricular": ["Science 7/8", "Mathematics", "Healthy Living", "Social Studies / Citizenship", "ELA / FLA (proposal & recipe writing)"],
        "competencies": ["Critical Thinking", "Citizenship", "Personal Career Development"],
        "continuum_skills": [
            {"en": "Plan", "fr": "Planifier"},
            {"en": "Investigate", "fr": "Examiner"},
            {"en": "Test", "fr": "Tester / Mettre à l'essai"},
            {"en": "Analyse", "fr": "Analyser"},
            {"en": "Apply", "fr": "Mettre en application"},
            {"en": "Reflect", "fr": "Réfléchir"},
            {"en": "Communicate", "fr": "Communiquer"}
        ],
        "essential_questions": [
            "Why does food insecurity persist in a region surrounded by farmland?",
            "What growing conditions maximize edible yield per square metre — and per dollar?",
            "When is growing your own food actually cheaper, and for whom?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Photosynthesis, Variables & the Grow Rack",
                "desc": "Direct instruction on germination and photosynthesis, plus the controlled-environment basics: light distance, watering regimes, and why the rack is a variable laboratory."
            },
            {
                "title": "Data Logging & Yield Mathematics",
                "desc": "Setting up the shared spreadsheet: germination counts, tray weights, harvest mass, and cost-per-tray formulas covering seed, medium, power, and labour time."
            },
            {
                "title": "Food Security Close-Up",
                "desc": "Local and national food-insecurity data, interview preparation for a community food organization, and what 'food desert' and 'food bank reliance' actually mean."
            }
        ],
        "pacing": [
            {"phase": "Phase 1: Setup & Grow Cycle A", "duration": "2 Hours", "details": "Rack assembly, baseline sow of two or three crops, and establishment of the daily check rota and data-logging routine."},
            {"phase": "Phase 2: Grow Cycle A Harvest & Analysis", "duration": "2 Hours", "details": "Weekly data checks culminate in harvest, tasting, yield calculations, and a troubleshooting review of what Cycle B should change."},
            {"phase": "Phase 3: Grow Cycle B — Designed Experiment", "duration": "3 Hours", "details": "Teams vary one factor (light height, seed density, or watering) across replicate trays, log daily, and harvest to a formal comparison of results."},
            {"phase": "Phase 4: Economics & Community Connection", "duration": "2–3 Hours", "details": "Cost-per-tray modelling, interview with a local food-security organization, and recipe-card drafting for the donation bundle."},
            {"phase": "Phase 5: Harvest Donation & Vertical Farm Proposal", "duration": "2 Hours", "details": "Final harvest delivered with recipe cards and a data story; student delegation presents the scale-up proposal to administration or the school advisory council."}
        ],
        "engagement": {
            "cognitive": "Designing a controlled experiment, maintaining a multi-week data set, and building an honest cost model including labour.",
            "social": "Shared daily responsibility through the check rota and a real interview with a community food organization.",
            "physical": "Hands-on sowing, watering, harvesting, and rack maintenance on a daily basis."
        },
        "assessment": {
            "formative": "Data-log checks on the rota cycle; brief weekly stand-ups where each team reports tray status and one observation.",
            "peer": "Cross-team review of Cycle B experimental designs for fairness (single variable, replicates, controls) before sowing.",
            "summative": "Experiment report rubric (method, data quality, conclusion) plus the scale-up proposal's use of evidence and costing."
        },
        "sharing": "Harvest donations delivered in person to a community food organization with student-prepared recipe cards, and the vertical-farm scale-up proposal formally presented to school administration or the advisory council.",
        "reflection": "Microgreens forgive beginners, but water does not — assign named daily owners for the rota or trays will silently dry out on weekends. Price the scale-up proposal against real quotes so the pitch to administration is concrete, and start Cycle A immediately;  Full-class check (28 students): seven grow teams of four each run replicate trays for the Cycle B experiment, the daily rota gives every student a named tray duty, and the harvest market staffs seven stations so nobody spectates at the donation.",
        "toolkit": [
            "Wire shelving unit, LED shop lights with timers, and trays with domes",
            "Microgreen seed (pea shoots, radish, sunflower), growing medium, and spray bottles",
            "Shared spreadsheet template for growth, yield, and cost data",
            "Contact with a local food bank or community food organization; recipe-card templates"
        ]
    },
    {
        "id": 6,
        "filename": "proposal-06-oral-history-documentaries.html",
        "image": "images/prop06.jpg",
        "school": "Pilot-Ready Proposal",
        "title": "Voices of Our Community: Oral History Documentaries",
        "subtitle": "Primary-Source Research, Interview Craft & a Public Documentary Premiere",
        "category": "Documentary Media & Local Heritage",
        "duration": "12 hours (One term, 1 hr/wk)",
        "duration_bucket": "extended",
        "grade_level": "Grades 8–9 (ages 13–15)",
        "weekly": "1–2 hours per week across a 12 week term",
        "summary": "Students become the archivists of their own community. After studying primary sources and local change over time, each team researches a neighbourhood theme — the fishery, the rink, the church suppers, the highway — interviews two or three elders or long-time residents on camera, and edits a five-minute mini-documentary that is premiered publicly and donated to the local library or historical society archive.",
        "rationale": "Adolescents rarely hear adults over thirty describe the world they grew up in, and communities lose those stories daily. Oral history work gives students an authentic research purpose where their age is an advantage rather than a limitation: a genuine need exists, and they are the ones with the time and technology to fill it. The final transfer of the films to a public archive makes the audience real and the responsibility permanent.",
        "outcomes": [
            "Social Studies: Learners will investigate change over time in their community using primary sources and evaluate the perspective of each source.",
            "ELA: Learners will formulate effective interview questions and construct an oral and visual narrative for an authentic audience.",
            "Visual Arts / Technology Education: Learners will apply composition, sequencing, and editing techniques to produce a media text."
        ],
        "cross_curricular": ["Social Studies", "ELA / FLA", "Visual Arts", "Technology Education"],
        "competencies": ["Communication", "Citizenship", "Technological Fluency"],
        "continuum_skills": [
            {"en": "Investigate", "fr": "Examiner"},
            {"en": "Formulate", "fr": "Formuler"},
            {"en": "Comprehend", "fr": "Comprendre (Dégager le sens)"},
            {"en": "Create", "fr": "Créer"},
            {"en": "Communicate", "fr": "Communiquer"},
            {"en": "Reflect", "fr": "Réfléchir"}
        ],
        "essential_questions": [
            "What can a primary voice tell us that a textbook never can?",
            "How do we honour and represent a story that is not ours?",
            "What will our harbour, street, or town look like in fifty years — and who gets to decide?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Primary vs. Secondary Sources & Local Change",
                "desc": "Comparing a textbook account of the community against maps, photos, and a short elder interview; establishing why perspective and proximity shape sources."
            },
            {
                "title": "Interview Craft & Ethics",
                "desc": "Question laddering, follow-up silence, consent and release forms, and the ethics of editing someone else's words."
            },
            {
                "title": "Camera, Sound & Editing Basics",
                "desc": "Framing and eyeline for seated interviews, external audio recording, B-roll planning, and a free-editor workflow for assembling story-first cuts."
            }
        ],
        "pacing": [
            {"phase": "Phase 1: Heritage Scouting", "duration": "2 Hours", "details": "Local change-over-time inquiry; teams select a theme, map potential interviewees, and draft a story premise and treatment."},
            {"phase": "Phase 2: Interview Preparation", "duration": "2 Hours", "details": "Research dossiers per interviewee, question set design, release-form collection, and mock interviews with peer critique."},
            {"phase": "Phase 3: Recording", "duration": "3 Hours", "details": "On-location or in-school interview sessions with B-roll capture; teams log highlights immediately after each session."},
            {"phase": "Phase 4: Edit & Caption", "duration": "3 Hours", "details": "Story-first assembly, B-roll layering, titles and captioning, with a rough-cut feedback screening partway through."},
            {"phase": "Phase 5: Premiere & Archive Donation", "duration": "2 Hours", "details": "A public premiere for families and interviewees, followed by formal donation of the films to the library or historical society."}
        ],
        "engagement": {
            "cognitive": "Synthesizing multiple interviews and sources into an honest five-minute narrative and evaluating conflicting memories respectfully.",
            "social": "Real intergenerational interviews, hosting elders at the premiere, and collaborative edit-room decision-making.",
            "physical": "Location scouting walks, tripod and equipment handling, and B-roll capture around the community."
        },
        "assessment": {
            "formative": "Treatment and question-set conferences before any camera rolls; post-interview logging checks.",
            "peer": "Rough-cut screening with a structured feedback form focused on story clarity, fairness to the interviewee, and technical quality.",
            "summative": "Documentary rubric covering research grounding, interview quality, editorial fairness, and technical craft; individual reflection on what the student's thinking about the community changed."
        },
        "sharing": "A public premiere with interviewees as guests of honour, and formal donation of the finished documentaries to the local library or historical society with signed releases.",
        "reflection": "Recruit interviewees through a letter home — grandparents and parish halls fill a roster fast, and the personal connection raises the stakes. Build editing time generously; students consistently underestimate it, and the story only emerges in the cut.  Full-class check (28 students): seven film crews of four — director, interviewer, camera, editor — cover fourteen community voices across themed strands, and the premiere is run by a student production team so every crew takes a bow.",
        "toolkit": [
            "Tablets or smartphones on tripods with an external clip-on microphone",
            "Free video editor (iMovie, Clipchamp, or CapCut where permitted)",
            "Interview release forms and research dossier templates",
            "Partnership contact at the local library, museum, or historical society"
        ]
    },
    {
        "id": 7,
        "filename": "proposal-07-learning-game-studio.html",
        "image": "images/prop07.jpg",
        "school": "Pilot-Ready Proposal",
        "title": "Player One: Learning Game Design Studio",
        "subtitle": "Designing Tabletop & Digital Games That Teach — Tested by Real Buddy Classrooms",
        "category": "Systems Thinking & Game Design",
        "duration": "10–12 hours (One term, 1 hr/wk)",
        "duration_bucket": "extended",
        "grade_level": "Grades 8–9 (ages 13–15)",
        "weekly": "1–2 hours per week across a 10–12 week term",
        "summary": "A working design studio with a real client: younger students. Teams analyse what makes mentor games teach, choose one specific curriculum outcome, and build a tabletop or Scratch game to teach it — then run multiple playtest rounds with the actual grade 4–6 audience, revising rules and balance between sessions, and closing with a buddy-classroom games arcade.",
        "rationale": "Teaching a system to someone younger is the fastest route to mastering it yourself, and game design is secretly systems thinking wearing a costume: every rule is a hypothesis about behaviour, every playtest an experiment. Building for a named, younger client gives reluctant writers a reason to care about rules documents and gives math-strong students a stage beyond worksheets — probability, balance, and fairness stop being abstract the moment a nine-year-old finds the degenerate winning strategy.",
        "outcomes": [
            "Mathematics: Learners will apply probability, fairness reasoning, and data from playtests to balance a game system.",
            "ELA: Learners will write clear, precise procedural and instructional texts (rulebooks, cards, tutorials) for a younger audience.",
            "Technology Education / Visual Arts: Learners will design, prototype, and refine a product that meets a client's needs."
        ],
        "cross_curricular": ["Mathematics", "ELA / FLA", "Visual Arts", "Technology Education", "Elementary curriculum (game content)"],
        "competencies": ["Creativity & Innovation", "Critical Thinking", "Communication"],
        "continuum_skills": [
            {"en": "Create", "fr": "Créer"},
            {"en": "Plan", "fr": "Planifier"},
            {"en": "Test", "fr": "Tester / Mettre à l'essai"},
            {"en": "Evaluate", "fr": "Évaluer"},
            {"en": "Analyse", "fr": "Analyser"},
            {"en": "Compare", "fr": "Comparer"},
            {"en": "Communicate", "fr": "Communiquer"}
        ],
        "essential_questions": [
            "What is the difference between fun and easy?",
            "How does a single rule teach an entire system?",
            "Who is our player — and what do they already know?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Deconstructing Mentor Games",
                "desc": "Playing and dissecting proven learning games to isolate the mechanics that teach: matching, racing, trading, set-collection, and hidden information."
            },
            {
                "title": "Rules That Teach",
                "desc": "Procedural writing workshop: front-loading, examples, diagrams, and the 'stranger test' — can someone who has never seen the game learn it from the rulebook alone?"
            },
            {
                "title": "Probability & Balance Labs",
                "desc": "Dice and card probability mini-labs, then applying expected value to tune costs, movement, and win conditions before playtesting."
            }
        ],
        "pacing": [
            {"phase": "Phase 1: Mentor Games & Client Brief", "duration": "1–2 Hours", "details": "Mentor-game deconstruction, buddy-class survey of what they are learning and what they love, and team design briefs."},
            {"phase": "Phase 2: Paper Prototype", "duration": "2 Hours", "details": "Hand-drawn minimum viable game: core loop, win condition, and first rulebook draft built for the stranger test."},
            {"phase": "Phase 3: Playtest Round 1 & Revision", "duration": "2 Hours", "details": "Classmate playtests with structured feedback forms; teams revise rules, components, and pacing."},
            {"phase": "Phase 4: Final Production or Digital Build", "duration": "3 Hours", "details": "Polished tabletop components or a Scratch/Blocks digital build; rulebook v2 tested by a classmate using the rulebook alone."},
            {"phase": "Phase 5: Buddy Classroom Arcade", "duration": "2 Hours", "details": "Games arcade hosted for buddy classes; designers observe, teach, and collect final feedback to present."}
        ],
        "engagement": {
            "cognitive": "Systems decomposition, probability tuning, and translating playtest observations into specific design changes.",
            "social": "Client-style interaction with younger students and shared authorship within the design team.",
            "physical": "Fabricating components, play-acting game loops at full table scale, and hosting the arcade."
        },
        "assessment": {
            "formative": "Design-brief and rulebook conferences keyed to the stranger test; playtest observation logs.",
            "peer": "Structured playtest feedback forms (fun rating, confusion points, teaching check) from classmates and buddy students.",
            "summative": "Game rubric covering curriculum alignment, rulebook clarity, balance evidence, and finish quality, plus the team's revision narrative linking feedback to changes."
        },
        "sharing": "The buddy-classroom arcade is the real-client showcase: younger students play the finished games, and designers close the loop by presenting what the playtests taught them.",
        "reflection": "Broker a specific ask from the buddy teacher (one outcome, one class period) before design begins — vague briefs produce vague games. Paper first, always: teams that start in Scratch spend their hours on sprites instead of systems.  Full-class check (28 students): seven design studios of four each ship one game to the buddy arcade, splitting designer, rules-writer, component-maker, and playtest-lead roles, and the arcade floor plan guarantees every student a hosting shift.",
        "toolkit": [
            "Cardstock, dice, meeples, and generic component bins for rapid tabletop prototyping",
            "Scratch or another block-based game environment for the digital pathway",
            "Structured playtest feedback forms (kid-friendly icon versions for buddy classes)",
            "Rulebook template with the stranger-test checklist"
        ]
    },
    {
        "id": 8,
        "filename": "proposal-08-sustainable-fashion.html",
        "image": "images/prop08.jpg",
        "school": "Pilot-Ready Proposal",
        "title": "REWORN: Sustainable Fashion Lab & Slow-Fashion Runway",
        "subtitle": "Textile Skills, Fast-Fashion Inquiry & a Runway Show with Garment Resumés",
        "category": "Textiles, Sustainability & Advocacy",
        "duration": "10–12 hours (One term, 1 hr/wk)",
        "duration_bucket": "extended",
        "grade_level": "Grades 8–9 (ages 13–15)",
        "weekly": "1–2 hours per week across a 10–12 week term",
        "summary": "Part textile atelier, part consumer-advocacy campaign. Students investigate the lifecycle and hidden costs of a fast-fashion t-shirt, learn sewing and visible-mending skills, transform thrifted or damaged garments into reworn pieces, and stage a slow-fashion runway show where every garment walks with a resumé: where it was made, its water and labour cost, and the repairs it received.",
        "rationale": "Adolescents are the primary targets of fast fashion, which makes them the perfect audience for interrogating it — the topic is already personal. The project converts abstract global-supply-chain learning into a garment the student can hold, and textile skills into a visible act of resistance. The runway format rewards craft and research equally: no garment walks without its resumé, so the argument and the artifact are inseparable.",
        "outcomes": [
            "Family Studies (Textile Art & Design): Learners will demonstrate hand- and machine-sewing techniques and apply them to alter or repair textile items.",
            "Social Studies: Learners will analyse the global economic and environmental impacts of consumer choices in the clothing industry.",
            "Mathematics: Learners will interpret and represent data on textile consumption, waste, and cost-per-wear.",
            "Healthy Living: Learners will examine identity, self-image, and the influence of marketing on consumer behaviour."
        ],
        "cross_curricular": ["Family Studies (Textile Art & Design)", "Social Studies / Citizenship", "Mathematics", "Visual Arts", "Healthy Living", "ELA / FLA (campaign writing)"],
        "competencies": ["Creativity & Innovation", "Citizenship", "Critical Thinking"],
        "continuum_skills": [
            {"en": "Create", "fr": "Créer"},
            {"en": "Construct", "fr": "Construire"},
            {"en": "Select", "fr": "Sélectionner"},
            {"en": "Compare", "fr": "Comparer"},
            {"en": "Analyse", "fr": "Analyser"},
            {"en": "Communicate", "fr": "Communiquer"},
            {"en": "Reflect", "fr": "Réfléchir"}
        ],
        "essential_questions": [
            "Who made my clothes, and what did producing them cost them — and the planet?",
            "Can repair be an act of protest?",
            "What is the real price of an $8 t-shirt, and who pays the difference?"
        ],
        "scaffolding_lessons": [
            {
                "title": "The Lifecycle of a T-Shirt",
                "desc": "Tracing cotton from field to landfill: water footprint, dyes, shipping, labour conditions, and the surge in textile waste — anchored in the students' own clothing tags."
            },
            {
                "title": "Sewing & Visible Mending Labs",
                "desc": "Progressive skill stations: threading and basic stitches, buttons and hems, patching, sashiko-style visible mending, and safe machine use where available."
            },
            {
                "title": "Cost-per-Wear & Runway Production Basics",
                "desc": "Consumer math on cost-per-wear versus price, then the staging craft: music selection, walk order, script writing, and presenting a garment to an audience."
            }
        ],
        "pacing": [
            {"phase": "Phase 1: Fast-Fashion Inquiry", "duration": "2 Hours", "details": "Lifecycle research and clothing-tag audit of the class's own wardrobes; teams select thrifted or donated base garments and set transformation goals."},
            {"phase": "Phase 2: Skill Labs", "duration": "3 Hours", "details": "Rotating sewing and mending stations with practice swatches; each student certifies on the skills their garment plan requires."},
            {"phase": "Phase 3: Transformation Studio", "duration": "3–4 Hours", "details": "Garment rebuilding and mending with design conferencing; parallel work on garment resumés documenting origin, costs, and repairs."},
            {"phase": "Phase 4: Runway Production", "duration": "2 Hours", "details": "Show production: music, staging, walk order, emcee script, and rehearsal with peer coaching on presentation."},
            {"phase": "Phase 5: Slow-Fashion Runway", "duration": "1 Hour", "details": "Public runway show for the school and families; every garment presented with its resumé, followed by a repair-pledge drive."}
        ],
        "engagement": {
            "cognitive": "Tracing global supply chains, computing cost-per-wear, and writing honest garment resumés from research evidence.",
            "social": "Collaborative studio culture with shared equipment, coaching circles on the runway, and a joint advocacy pledge campaign.",
            "physical": "Hands-on textile manipulation throughout, plus the kinaesthetic craft of runway movement and staging."
        },
        "assessment": {
            "formative": "Skill certification checklists at each station; design conferences during the transformation studio.",
            "peer": "Studio critique rounds where classmates review garment progress and resumé drafts against a claims-evidence checklist.",
            "summative": "Runway rubric combining garment craft quality, resumé accuracy and research depth, and presentation delivery."
        },
        "sharing": "A public slow-fashion runway show for the school and families, with every garment presented alongside its resumé, capped by a school-wide repair-pledge campaign the students run themselves.",
        "reflection": "Source garments through a community donation drive two weeks ahead and check sewing-machine availability early — if the school has only a few machines, schedule machine time in stations while hand-menders work alongside. Rehearse the walk:  Full-class check (28 students): craft pairs rotate through stations (machine time, hand-mending, decoration, resumé research) so machines are never a bottleneck, and the runway runs entirely on student crews — staging, emcee, music, photography.",
        "toolkit": [
            "Thrifted or donated garments sourced via a community drive",
            "Sewing kits (needles, thread, buttons), patches, and fabric markers; machines where available",
            "Garment resumé research template (origin, water and labour cost, repairs log)",
            "Runway staging kit: music system, simple runway or marked floor path, spotlight or lamp"
        ]
    },
    {
        "id": 9,
        "filename": "proposal-09-trailblazers-bioblitz.html",
        "image": "images/prop09.jpg",
        "school": "Pilot-Ready Proposal",
        "title": "Trailblazers: Nature Trail, Outdoor Classroom & Community BioBlitz",
        "subtitle": "Ecological Survey, Place-Based Design & a Public Citizen-Science Event",
        "category": "Ecology, Mapping & Place-Based Design",
        "duration": "12–14 hours (One term or fall/spring split, 1–2 hrs/wk)",
        "duration_bucket": "extended",
        "grade_level": "Grades 8–9 (ages 13–15)",
        "weekly": "1–2 hours per week, weather-permitting, across a term",
        "summary": "Students adopt a nearby green space and turn it into a living classroom. They run baseline species surveys with iNaturalist, map and design an interpretive trail, research and install weatherproof interpretive signage, and finish by leading a public Community BioBlitz where families, younger students, and neighbours add to the site's species record under student leadership.",
        "rationale": "Learning ecology indoors is like learning to swim on paper: the species, cycles, and interdependencies only become real when students can kneel beside them. A trail within walking distance makes field science routine instead of a rare field-trip event, and the signage install gives the class a permanent, visible legacy. The public BioBlitz then flips students from data collectors to community science leaders — the strongest possible identity shift for a young naturalist.",
        "outcomes": [
            "Science 7/8: Learners will investigate interactions within ecosystems and classify organisms to document local biodiversity.",
            "Mathematics: Learners will apply scale, measurement, and biodiversity indices to map and analyse a natural site.",
            "Social Studies: Learners will examine the concept of place, including Indigenous presence and stewardship, in their local context.",
            "ELA / FLA: Learners will create interpretive texts that inform and engage a general public audience.",
            "Healthy Living: Learners will demonstrate the benefits and skills of outdoor physical activity."
        ],
        "cross_curricular": ["Science 7/8", "Mathematics", "Social Studies / Citizenship", "ELA / FLA", "Visual Arts (sign design)", "Healthy Living"],
        "competencies": ["Citizenship", "Critical Thinking", "Communication", "Personal Career Development"],
        "continuum_skills": [
            {"en": "Investigate", "fr": "Examiner"},
            {"en": "Classify", "fr": "Classer"},
            {"en": "Compare", "fr": "Comparer"},
            {"en": "Plan", "fr": "Planifier"},
            {"en": "Construct", "fr": "Construire"},
            {"en": "Apply", "fr": "Mettre en application"},
            {"en": "Communicate", "fr": "Communiquer"}
        ],
        "essential_questions": [
            "Who shares this space with us — and who was here long before us?",
            "How many species live within 400 metres of our school, and how would we ever know?",
            "How do we invite a community to care about a place?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Species ID & iNaturalist Bootcamp",
                "desc": "Field guides and app practice on the schoolyard itself: photo protocols, identification basics, and how community science observations become research data."
            },
            {
                "title": "Scale Mapping & Biodiversity Indices",
                "desc": "Pacing, trundle wheels, and scaled site maps; then richness, abundance, and simple diversity index calculations from the class survey data."
            },
            {
                "title": "Place, Stewardship & Interpretive Writing",
                "desc": "Working respectfully with Mi'kmaq seasonal knowledge and local history resources (in consultation with the school's Indigenous education leads), plus the craft of writing for standing readers."
            }
        ],
        "pacing": [
            {"phase": "Phase 1: Site Adoption & Baseline BioBlitz", "duration": "2 Hours", "details": "Permission and site walk with the municipality or landowner; first structured species survey and photo-documentation pass."},
            {"phase": "Phase 2: Data, ID & Mapping", "duration": "2 Hours", "details": "Identification sprints in class, iNaturalist record cleanup, scaled site mapping, and biodiversity index calculations."},
            {"phase": "Phase 3: Trail Design & Interpretive Themes", "duration": "3 Hours", "details": "Route selection with low-impact guidelines, station planning, and drafting of interpretive sign copy with art direction."},
            {"phase": "Phase 4: Sign Build & Install", "duration": "2–3 Hours", "details": "Weatherproof sign production and installation (with permission), plus a walking dress rehearsal of the full guided tour."},
            {"phase": "Phase 5: Community BioBlitz Day", "duration": "2 Hours", "details": "Students lead the public event: guided trail walks, station talks, and mentored species logging that adds community records to the site's dataset."}
        ],
        "engagement": {
            "cognitive": "Species identification, biodiversity data analysis, and distilling complex ecology into concise public signage.",
            "social": "Mentoring community members at the BioBlitz and collaborating with municipal and Indigenous education partners.",
            "physical": "Sustained outdoor fieldwork: walking survey routes, kneeling observation, and hands-on sign installation."
        },
        "assessment": {
            "formative": "Field-log checks after each site visit; identification accuracy spot-checks during ID sprints.",
            "peer": "Sign-copy review exchange where teams test each other's interpretive text on a 'standing reader' for clarity and time-on-sign.",
            "summative": "Project rubric covering survey data quality, map accuracy, interpretive sign craft, and BioBlitz leadership performance."
        },
        "sharing": "The Community BioBlitz is the public event: families and neighbours walk the student-designed trail, hear student station talks, and contribute species records, all uploaded to iNaturalist under the class project.",
        "reflection": "Secure landowner permission before any route is drawn, and build a bad-weather backup session for every outdoor one — a full term of 1-hour blocks gives only eight or nine viable field days in a Nova Scotia spring. Splitting the project across fall and spring  Full-class check (28 students): seven field squads of four rotate the navigator, recorder, photographer, and ID-lead roles across survey routes; sign crews of four own individual stations, and the BioBlitz gives every student a guided-walk leadership post.",
        "toolkit": [
            "iNaturalist (or Merlin Bird ID) on school or family devices",
            "Measuring wheels or trundle wheels, clipboards, and scaled mapping templates",
            "Weatherproof sign blanks, post mounts, and outdoor-rated markers or printed lamination",
            "Municipal/landowner permission and Indigenous education consultation before design begins"
        ]
    },
    {
        "id": 10,
        "filename": "proposal-10-sports-analytics.html",
        "image": "images/prop10.jpg",
        "school": "Pilot-Ready Proposal",
        "title": "Sports by the Numbers: Analytics, Media & Fantasy League",
        "subtitle": "A Term-Long Fantasy League Powered by Real Data, Biomechanics Labs & a Student Sports Desk",
        "category": "Statistics, Biomechanics & Sports Media",
        "duration": "12–14 hours (Weekly league cycles across a term, 1–2 hrs/wk)",
        "duration_bucket": "extended",
        "grade_level": "Grades 8–9 (ages 13–15)",
        "weekly": "1–2 hours per week in recurring league cycles across a term",
        "summary": "The class becomes a sports network running a term-long fantasy or simulation league built on real league statistics. Students draft teams, manage rosters through weekly stat cycles, publish analytics briefs and a sports-desk broadcast, and run a biomechanics lab testing one performance question — free-throw angle, shot power, sprint start — turning the numbers they trade in all term into physics they can measure.",
        "rationale": "For a significant share of students — often exactly the ones who disengage from data units — sports statistics are already a language they speak fluently. A recurring league gives every single week a fresh, self-updating dataset, so data literacy is practiced in cycles rather than crammed into one unit. Pairing the league with a hands-on biomechanics lab closes the loop between the numbers students argue about and the physical reality that produces them.",
        "outcomes": [
            "Mathematics: Learners will collect, organize, and interpret statistical data — central tendency, distribution, and probability — to support roster and prediction decisions.",
            "Science: Learners will investigate forces and motion by designing and conducting a biomechanics investigation of a sports skill.",
            "ELA: Learners will create journalistic media texts (briefs, broadcasts) that communicate analysis clearly and fairly.",
            "Healthy Living: Learners will analyse how training, technique, and performance data connect in sport."
        ],
        "cross_curricular": ["Mathematics", "Science", "ELA / FLA", "Healthy Living", "Technology Education (spreadsheets & media tools)"],
        "competencies": ["Critical Thinking", "Communication", "Personal Career Development"],
        "continuum_skills": [
            {"en": "Analyse", "fr": "Analyser"},
            {"en": "Compare", "fr": "Comparer"},
            {"en": "Test", "fr": "Tester / Mettre à l'essai"},
            {"en": "Evaluate", "fr": "Évaluer"},
            {"en": "Formulate", "fr": "Formuler"},
            {"en": "Perform", "fr": "Exécuter"},
            {"en": "Communicate", "fr": "Communiquer"}
        ],
        "essential_questions": [
            "Can a number tell the whole story of a game — and what gets lost?",
            "What does 'clutch' actually measure, if anything?",
            "How does data change the way athletes train and fans watch?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Stats Bootcamp: Averages, Distributions & What They Hide",
                "desc": "Central tendency and spread taught through real box scores, including why a single number (average, streak) can mislead and which stat to check next."
            },
            {
                "title": "Spreadsheet League Operations",
                "desc": "Building the league workbook: live formulas for scoring, sortable standings, and charts — the maintenance skill behind every weekly cycle."
            },
            {
                "title": "Biomechanics of a Skill & Broadcast Basics",
                "desc": "Measuring a sports skill (release angle, step timing) with phone slow-motion and simple tools; plus segment structure, teleprompter technique, and fair-comment norms for the sports desk."
            }
        ],
        "pacing": [
            {"phase": "Phase 1: Draft Day & Stats Bootcamp", "duration": "2 Hours", "details": "League rules and scoring co-designed, live draft with a draft-prep stat sheet, and the stats bootcamp to level the analytics playing field."},
            {"phase": "Phase 2: Weekly League Cycles", "duration": "4–6 Hours (recurring)", "details": "Recurring weekly rhythm: roster moves, stat updates in the shared workbook, one analytics brief per team, and rotating sports-desk segments."},
            {"phase": "Phase 3: Biomechanics Lab", "duration": "2–3 Hours", "details": "Teams pose a performance question, measure it with slow-motion video and simple instruments, and compare findings against league assumptions."},
            {"phase": "Phase 4: Media Production Cycle", "duration": "2 Hours", "details": "Producing a full broadcast episode: scripted segments, on-camera analysis, and a prediction segment that commits each desk to falsifiable calls."},
            {"phase": "Phase 5: Championship & Analytics Awards", "duration": "1–2 Hours", "details": "League championship day with live standings, plus analytics awards for best brief, best prediction record, and best lab."}
        ],
        "engagement": {
            "cognitive": "Weekly statistical reasoning on live data, spreadsheet modelling, and falsifiable prediction-writing in the media segments.",
            "social": "League negotiation and rivalry, rotating broadcast desks, and team strategy arguments settled by evidence.",
            "physical": "The biomechanics lab itself — performing and measuring real sport skills — plus movement breaks built into league weeks."
        },
        "assessment": {
            "formative": "Weekly workbook checks and brief conferences; teacher scoring audits of one roster decision per cycle.",
            "peer": "Desk-rehearsal critique where peer desks challenge each prediction for its statistical basis before broadcast.",
            "summative": "Portfolio rubric covering analytics briefs (data quality and reasoning), lab report rigour, broadcast communication, and the team's prediction-vs-outcome record."
        },
        "sharing": "Weekly student-produced broadcasts to the school and a championship-day analytics fair where desks present their season data, lab findings, and prediction records to an invited audience.",
        "reflection": "Use a live league (NHL, NBA, or a school-league simulation) so data updates without teacher effort — the recurring rhythm is the entire engine of the project. Insist that every broadcast prediction is falsifiable and scored, because  Full-class check (28 students): seven desk franchises of four — analyst, trader, broadcaster, stats-keeper — run the league, with commissioner and technical-crew roles rotating weekly so every desk publishes every cycle.",
        "toolkit": [
            "Free league statistics sources and a shared spreadsheet league workbook (scoring formulas and standings pre-built)",
            "Phones with slow-motion video for the biomechanics lab, plus measuring tape and markers",
            "Broadcast kit: mic, phone or tablet camera, free editor, and a segment-script template",
            "Prediction ledger for scoring every on-air call"
        ]
    },
]

# ---------------------------------------------------------------------------
# ONE-DAY ILT ACTIVITIES
# Ten quick-deploy drama games and teambuilding activities designed for a
# single ILT block (45–90 min). Grade 7–9, minimal or no resources required.
# Ideal for first-week community building, transition days, or substitute
# teacher days.
# ---------------------------------------------------------------------------

ONE_DAY_ACTIVITIES = [
    {
        "id": 1,
        "filename": "oneday-01-human-knot.html",
        "image": "images/oneday01.jpg",
        "school": "1-Day Activity",
        "title": "Human Knot & Untangle Challenge",
        "subtitle": "Physical Problem Solving, Communication & Collaborative Strategy",
        "category": "Teambuilding & Problem Solving",
        "duration": "45–60 minutes",
        "duration_bucket": "one_day",
        "grade_level": "Grade 7–9",
        "resources": "None",
        "summary": "Students form circles of 8–12, reach across to grab two different hands, and must untangle their human knot into a clean circle without releasing grips. Progressive rounds add constraints — silence, blindfolds for one member, time pressure — to deepen communication strategy and leadership emergence.",
        "rationale": "The Human Knot is a deceptively simple constraint that forces adolescents to negotiate physical proximity, verbal direction-giving, spatial reasoning, and patience simultaneously. It exposes natural leadership dynamics and rewards collaborative problem solving over individual heroics — precisely the social-emotional competencies junior high students need to practise in low-stakes environments.",
        "outcomes": [
            "Healthy Living: Learners will demonstrate interpersonal skills that contribute to positive relationships and group dynamics.",
            "ELA / FLA: Learners will use oral communication strategies to give and follow multi-step spatial directions clearly."
        ],
        "cross_curricular": ["Healthy Living", "ELA / FLA", "Physical Education"],
        "competencies": ["Communication", "Critical Thinking", "Citizenship"],
        "continuum_skills": [
            {"en": "Communicate", "fr": "Communiquer"},
            {"en": "Problem Solve", "fr": "Trouver une solution"},
            {"en": "Plan", "fr": "Planifier"}
        ],
        "essential_questions": [
            "What communication strategies help a group solve a physical puzzle when no single person can see the full picture?",
            "How does removing one communication channel (e.g. voice) force the group to develop alternative strategies?",
            "What leadership behaviours emerge naturally under time pressure, and are they always the most effective?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Warm-Up: Name & Action Circle",
                "desc": "Each student says their name and performs a unique physical action; the whole group mirrors it. Builds names, comfort with movement, and group rhythm."
            },
            {
                "title": "Debrief Protocol: What Worked / What Shifted",
                "desc": "After each round, a structured 3-minute partner debrief: What strategy worked? What did you change? What would you try next time?"
            }
        ],
        "pacing": [
            {"phase": "Warm-Up: Name & Action Circle", "duration": "5–8 min", "details": "Students stand in a circle; each shares name + action; group echoes. Builds names, comfort, group energy."},
            {"phase": "Round 1: Basic Human Knot", "duration": "10–12 min", "details": "Groups of 8–12. Reach across, grab two different hands. Untangle into a circle. Full verbal communication allowed."},
            {"phase": "Debrief 1", "duration": "3 min", "details": "Partner debrief: What strategies emerged? Who gave directions? Who followed?"},
            {"phase": "Round 2: Silent Knot", "duration": "10–12 min", "details": "Same task, no talking. Only gestures, eye contact, and gentle physical guidance allowed."},
            {"phase": "Debrief 2", "duration": "3 min", "details": "Whole-group discussion: How did removing voice change leadership and strategy?"},
            {"phase": "Round 3: Timed Challenge or Blindfold Variation", "duration": "10–12 min", "details": "Competitive: fastest untangle wins. Or: one member per group is blindfolded and must be guided by touch only."},
            {"phase": "Final Reflection", "duration": "5–8 min", "details": "Written or verbal: What did I learn about how I communicate under pressure? Connection to broader collaboration skills."}
        ],
        "engagement": {
            "cognitive": "Spatial reasoning and sequential planning — students must mentally model the knot's topology and predict which moves will create or resolve tangles.",
            "social": "Negotiating physical proximity, turn-taking in direction-giving, and managing frustration when strategies fail.",
            "physical": "Continuous standing, stepping over/under arms, rotating, and balancing while maintaining hand grips."
        },
        "assessment": {
            "formative": "Teacher observation of communication behaviours: who directs, who listens, who adapts strategy mid-round.",
            "peer": "Partner debrief after each round with structured prompts about strategy shifts.",
            "summative": "Optional written reflection (exit ticket): Describe one communication strategy your group used and how it evolved across rounds."
        },
        "sharing": "Groups demonstrate their untangling process to the class after the timed round, narrating the strategy they used and the moment it clicked.",
        "reflection": "This activity works best with groups of 8–12. Larger groups become frustratingly slow; smaller groups solve too quickly. Teachers should circulate and coach groups that get stuck by asking guiding questions rather than giving solutions. Having one adult join a struggling group can model collaborative language.",
        "toolkit": [
            "Open floor space (gymnasium, cleared classroom, or outdoor area)",
            "Optional: blindfolds (scarves or bandanas) for advanced rounds",
            "Timer (phone or classroom clock) for competitive rounds",
            "Exit ticket templates for written reflection"
        ]
    },
    {
        "id": 2,
        "filename": "oneday-02-freeze-frame.html",
        "image": "images/oneday02.jpg",
        "school": "1-Day Activity",
        "title": "Freeze Frame Tableaux",
        "subtitle": "Visual Storytelling, Body Language & Interpretive Drama",
        "category": "Drama & Visual Storytelling",
        "duration": "60–75 minutes",
        "duration_bucket": "one_day",
        "grade_level": "Grade 7–9",
        "resources": "None",
        "summary": "Students create frozen, silent 'photographs' using their bodies to represent concepts, emotions, historical moments, or story scenes. Groups sculpt tableaux, the audience interprets them, and progressive rounds add complexity — thought-tracking (speaking inner monologue while frozen), transition sequences between two tableaux, and audience-directed reshaping.",
        "rationale": "Tableaux work removes the anxiety of memorised lines and puts the focus on physical expression, spatial composition, and collaborative meaning-making. For reluctant performers, freezing is far less threatening than speaking, yet it demands the same interpretive depth. It is also a powerful cross-curricular tool: any subject's key concept can be 'frozen' and debated.",
        "outcomes": [
            "ELA / FLA: Learners will use visual and dramatic forms to communicate ideas and represent perspectives for a range of audiences.",
            "Visual Arts: Learners will explore composition, focal point, and gesture to convey meaning through physical arrangement."
        ],
        "cross_curricular": ["ELA / FLA", "Visual Arts", "Social Studies", "Healthy Living"],
        "competencies": ["Communication", "Creativity & Innovation", "Critical Thinking"],
        "continuum_skills": [
            {"en": "Create", "fr": "Créer"},
            {"en": "Communicate", "fr": "Communiquer"},
            {"en": "Reflect", "fr": "Réfléchir"}
        ],
        "essential_questions": [
            "How can a single frozen image tell a complete story without words?",
            "What choices about level, proximity, and facial expression change the audience's interpretation of a scene?",
            "Whose perspective is centred in our tableau, and whose is missing?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Sculptor & Clay Warm-Up",
                "desc": "In pairs, one student is the 'clay' and the other 'sculpts' them into a shape representing a given emotion. Swap roles. Builds comfort with gentle physical direction."
            },
            {
                "title": "Levels & Focus Mini-Lesson",
                "desc": "Brief instruction on high/mid/low body levels, eye-line focus, and how spatial relationships between bodies create implied narrative tension."
            }
        ],
        "pacing": [
            {"phase": "Warm-Up: Sculptor & Clay", "duration": "8–10 min", "details": "Pairs take turns sculpting each other into emotion-statues. Teacher side-coaches on levels and facial expression."},
            {"phase": "Round 1: Single-Word Tableaux", "duration": "10–12 min", "details": "Groups of 4–5 receive a single word (Justice, Conflict, Discovery). 2 min to create a frozen image. Audience interprets before the group reveals their intent."},
            {"phase": "Gallery Walk & Interpretation", "duration": "5 min", "details": "Groups hold their freeze while the rest of the class walks around, observing from multiple angles. Written or verbal interpretation shared."},
            {"phase": "Round 2: Thought-Tracking", "duration": "12–15 min", "details": "Same tableaux, but the teacher taps each frozen figure on the shoulder — they speak one sentence of inner monologue in character."},
            {"phase": "Round 3: Transition Tableaux", "duration": "12–15 min", "details": "Groups create TWO tableaux showing 'before' and 'after' a key moment. On a signal, they transition between them in slow motion."},
            {"phase": "Whole-Class Debrief", "duration": "8–10 min", "details": "Discussion: What compositional choices were most powerful? How did thought-tracking change interpretation? Connection to narrative structure."}
        ],
        "engagement": {
            "cognitive": "Interpreting abstract concepts through physical metaphor; analysing compositional choices and their narrative implications.",
            "social": "Collaborative decision-making within tight time constraints; respectful physical contact and trust during sculpting.",
            "physical": "Sustained stillness (isometric hold), controlled slow-motion transitions, and deliberate use of levels and gesture."
        },
        "assessment": {
            "formative": "Teacher observation during creation: Are all group members contributing? Is the composition intentional or accidental?",
            "peer": "Audience interpretation — if the audience reads the intended meaning, the tableau communicates effectively.",
            "summative": "Optional: groups sketch their strongest tableau with annotations explaining compositional choices (level, focus, proximity)."
        },
        "sharing": "Each group presents their transition tableaux to the class with thought-tracking, creating a mini-performance that the audience interprets and discusses.",
        "reflection": "Tableaux work beautifully as a cross-curricular tool — freeze a moment from a novel study, a historical event, or a science concept. For anxious students, the 'frozen' aspect removes the pressure of improvised dialogue. Teachers should model the sculptor/clay warm-up first to establish norms around respectful physical contact.",
        "toolkit": [
            "Open floor space (cleared classroom or drama studio)",
            "Optional: prompt cards with single words or short scenarios",
            "Optional: background music for transitions (calm instrumental)",
            "Sketch paper for optional annotation activity"
        ]
    },
    {
        "id": 3,
        "filename": "oneday-03-zip-zap-zop.html",
        "image": "images/oneday03.jpg",
        "school": "1-Day Activity",
        "title": "Zip Zap Zop & Energy Circle Games",
        "subtitle": "Focus, Rhythm, Ensemble Awareness & Playful Risk-Taking",
        "category": "Drama Warm-ups & Focus Games",
        "duration": "45–60 minutes",
        "duration_bucket": "one_day",
        "grade_level": "Grade 7–9",
        "resources": "None",
        "summary": "A progressive sequence of classic drama circle games — Zip Zap Zop, Bippity Bippity Bop, Energy Pass, and Whoosh — that build ensemble focus, reaction speed, playful risk-taking, and group rhythm. Each game layers a new cognitive demand on top of the last, culminating in a high-energy, multi-rule combined game that demands total group concentration.",
        "rationale": "Circle games are the foundational grammar of ensemble drama. They train the neural pathways of focused attention, quick decision-making, and joyful failure — skills that transfer directly to classroom participation, collaborative projects, and social confidence. The progressive layering means every student enters at their comfort level and stretches incrementally.",
        "outcomes": [
            "Healthy Living: Learners will demonstrate focus, self-regulation, and resilience in response to rapid-fire social challenges.",
            "Drama / ELA: Learners will participate in ensemble activities that develop timing, projection, and physical responsiveness."
        ],
        "cross_curricular": ["Healthy Living", "Drama", "ELA / FLA", "Physical Education"],
        "competencies": ["Communication", "Personal Career Development", "Critical Thinking"],
        "continuum_skills": [
            {"en": "Communicate", "fr": "Communiquer"},
            {"en": "Apply", "fr": "Mettre en application"},
            {"en": "Reflect", "fr": "Réfléchir"}
        ],
        "essential_questions": [
            "What happens to group energy when everyone is fully focused versus when attention drifts?",
            "How does practising 'joyful failure' (celebrating mistakes) change your willingness to take risks?",
            "What cognitive skills are you training when you layer multiple rules simultaneously?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Establishing the Circle Contract",
                "desc": "Brief discussion: In circle games, mistakes are celebrated (group cheer or silly bow). This removes fear of failure and keeps energy high."
            },
            {
                "title": "Progressive Layering Principle",
                "desc": "Each game adds one new rule. Teacher demonstrates each layer before adding it, ensuring everyone succeeds before complexity increases."
            }
        ],
        "pacing": [
            {"phase": "Circle Formation & Contract", "duration": "3–5 min", "details": "Form a standing circle. Establish the 'celebrate mistakes' norm. Practice a group cheer for when someone gets out."},
            {"phase": "Game 1: Zip Zap Zop", "duration": "8–10 min", "details": "Pass energy around the circle: point and say ZIP (to neighbour), ZAP (skip one), ZOP (across circle). Speed increases."},
            {"phase": "Game 2: Bippity Bippity Bop", "duration": "8–10 min", "details": "Centre player points and says 'Bippity Bippity Bop' — target must say 'Bop' before the pointer finishes. Variations add group poses."},
            {"phase": "Game 3: Energy Pass / Whoosh", "duration": "8–10 min", "details": "Pass a clap around the circle with 'Whoosh'. 'Whoa' reverses direction. 'Zap' sends it across. 'Freakout' = everyone changes places."},
            {"phase": "Game 4: Combined Super-Game", "duration": "10–12 min", "details": "All rules from all games active simultaneously. Multiple energies circling at once. Ultimate focus challenge."},
            {"phase": "Cool-Down & Reflection", "duration": "5–8 min", "details": "Seated circle. Discussion: What was hardest? When did the group click? How does focus feel different from trying hard?"}
        ],
        "engagement": {
            "cognitive": "Rapid rule-switching, pattern recognition, and sustained divided attention across multiple simultaneous game streams.",
            "social": "Eye contact, shared rhythm, celebrating others' mistakes, and reading group energy levels.",
            "physical": "Standing, pointing, clapping, sudden direction changes, and occasional full-circle movement swaps."
        },
        "assessment": {
            "formative": "Teacher observes group focus trajectory: Does sustained attention increase across rounds? Do students self-correct?",
            "peer": "Natural peer feedback through the game mechanics — the circle provides instant feedback on timing and focus.",
            "summative": "Optional exit ticket: Name one focus strategy you used today that you could apply in a classroom discussion or group project."
        },
        "sharing": "The combined super-game IS the performance — the whole group either achieves flow state or dissolves into laughter, both of which are valuable.",
        "reflection": "These games scale effortlessly from 10 to 30 students. The key is progressive layering — never add a new rule until the group has achieved basic competence with the current one. Teachers should play IN the circle, not direct FROM outside, to model joyful failure and risk-taking.",
        "toolkit": [
            "Open floor space large enough for a standing circle of the full class",
            "No materials required",
            "Optional: music to signal transitions between games"
        ]
    },
    {
        "id": 4,
        "filename": "oneday-04-minefield-trust.html",
        "image": "images/oneday04.jpg",
        "school": "1-Day Activity",
        "title": "Minefield Trust Walk",
        "subtitle": "Blindfolded Navigation, Precise Communication & Trust Building",
        "category": "Teambuilding & Communication",
        "duration": "60–75 minutes",
        "duration_bucket": "one_day",
        "grade_level": "Grade 7–9",
        "resources": "Blindfolds (scarves/bandanas), scattered classroom objects",
        "summary": "Partners navigate a 'minefield' of scattered objects — one blindfolded, one guiding with voice only. Progressive rounds escalate: first close guidance, then distance guidance, then competing pairs navigating simultaneously with overlapping voice traffic. The activity builds precise directional language, active listening, and deep interpersonal trust.",
        "rationale": "Trust activities address a critical gap in adolescent social development: the ability to be genuinely vulnerable with peers. The Minefield forces students to practise micro-skills of precise communication (left vs. your left, step size estimation, emotional reassurance) that transfer directly to collaborative academic work, peer tutoring, and conflict resolution.",
        "outcomes": [
            "ELA / FLA: Learners will use precise spatial and directional language to guide a partner through a physical task.",
            "Healthy Living: Learners will identify and practise trust-building behaviours that strengthen peer relationships."
        ],
        "cross_curricular": ["ELA / FLA", "Healthy Living", "Physical Education"],
        "competencies": ["Communication", "Citizenship", "Personal Career Development"],
        "continuum_skills": [
            {"en": "Communicate", "fr": "Communiquer"},
            {"en": "Plan", "fr": "Planifier"},
            {"en": "Reflect", "fr": "Réfléchir"}
        ],
        "essential_questions": [
            "What makes verbal directions truly precise — and what assumptions do we make that cause miscommunication?",
            "How does being physically vulnerable (blindfolded) change what you need from a partner?",
            "What trust-building behaviours can you transfer from this activity to everyday classroom collaboration?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Directional Language Practice",
                "desc": "Quick partner exercise: describe how to navigate from the classroom door to a specific desk using ONLY directional words (no pointing). Highlights the gap between vague and precise instructions."
            },
            {
                "title": "Trust Continuum Discussion",
                "desc": "Brief class discussion: What does trust look like in a classroom? What builds it? What breaks it? Establishes emotional context for the activity."
            }
        ],
        "pacing": [
            {"phase": "Trust Continuum Discussion", "duration": "5–8 min", "details": "Whole-class seated discussion: What does trust look like? What behaviours build or break it? Setting emotional context."},
            {"phase": "Minefield Setup", "duration": "3–5 min", "details": "Scatter soft objects (backpacks, shoes, books, cones) across the floor. Define start and finish lines."},
            {"phase": "Round 1: Close Guidance", "duration": "10–12 min", "details": "Partner A blindfolded, Partner B walks beside them giving verbal directions through the minefield. Swap roles."},
            {"phase": "Debrief 1", "duration": "3 min", "details": "Quick partner check-in: What directions were clearest? What caused confusion?"},
            {"phase": "Round 2: Distance Guidance", "duration": "10–12 min", "details": "Guide must stand at the finish line and call directions from across the room. Blindfolded partner navigates alone."},
            {"phase": "Round 3: Voice Traffic Challenge", "duration": "10–12 min", "details": "Multiple pairs navigate simultaneously. Room is filled with competing voices. Pairs must develop strategies to be heard."},
            {"phase": "Final Reflection & Discussion", "duration": "8–10 min", "details": "Whole-class debrief: How did trust feel? What communication strategies worked under 'noise'? Written exit ticket option."}
        ],
        "engagement": {
            "cognitive": "Translating spatial awareness into precise verbal language; adapting communication strategy when environmental noise increases.",
            "social": "Building and maintaining trust through vocal tone, reassurance, and reliable direction-giving.",
            "physical": "Careful walking while blindfolded; heightened proprioceptive awareness and balance."
        },
        "assessment": {
            "formative": "Teacher observation: Are guides using precise directional language? Are blindfolded students communicating comfort/discomfort?",
            "peer": "Partner debrief after each round with structured prompts about clarity and trust.",
            "summative": "Exit ticket: Write three specific communication strategies you used or learned today, and one situation where you could apply them."
        },
        "sharing": "During Round 3, the whole class watches the final pair navigate through voice traffic, observing and then discussing the strategies that worked under pressure.",
        "reflection": "Some students may be uncomfortable with blindfolds — always offer the option of closing eyes instead, or sitting out to be an observer/safety monitor. Scatter soft objects only (nothing sharp or breakable). Teachers should walk the minefield themselves first to test difficulty level.",
        "toolkit": [
            "Blindfolds: scarves, bandanas, or sleep masks (one per pair)",
            "Soft scattered objects: backpacks, shoes, books, cushions, gym cones",
            "Open floor space (cleared classroom, gymnasium, or hallway)",
            "Exit ticket templates"
        ]
    },
    {
        "id": 5,
        "filename": "oneday-05-improv-workshop.html",
        "image": "images/oneday05.jpg",
        "school": "1-Day Activity",
        "title": "Improvised Scene Workshop",
        "subtitle": "Yes-And Thinking, Spontaneous Storytelling & Collaborative Performance",
        "category": "Drama & Improvisation",
        "duration": "60–90 minutes",
        "duration_bucket": "one_day",
        "grade_level": "Grade 7–9",
        "resources": "None",
        "summary": "A structured improv workshop building from low-risk warm-ups (Word Association, One-Word Story) through paired scenes (Yes-And, Gibberish Translator) to group performance games (Party Quirks, Scenes from a Hat). Every exercise reinforces the core improv principle: accept and build on your partner's offer rather than blocking it.",
        "rationale": "Improvisation trains the exact cognitive and social skills that standardised schooling often neglects: spontaneous idea generation, active listening, adaptive thinking, and the courage to contribute without certainty. The 'Yes-And' principle — accept your partner's reality and add to it — is a transferable life skill for collaboration, brainstorming, and empathetic communication.",
        "outcomes": [
            "ELA / FLA: Learners will create spontaneous oral texts that demonstrate narrative structure, character, and audience awareness.",
            "Healthy Living: Learners will demonstrate risk-taking, resilience, and supportive peer interaction in a performance context."
        ],
        "cross_curricular": ["ELA / FLA", "Drama", "Healthy Living"],
        "competencies": ["Communication", "Creativity & Innovation", "Personal Career Development"],
        "continuum_skills": [
            {"en": "Create", "fr": "Créer"},
            {"en": "Communicate", "fr": "Communiquer"},
            {"en": "Apply", "fr": "Mettre en application"}
        ],
        "essential_questions": [
            "What happens to a scene when you say 'Yes, and...' versus 'No, but...'?",
            "How does truly listening to your partner change the stories you create together?",
            "What does it feel like to perform without a script — and what skills does that build?"
        ],
        "scaffolding_lessons": [
            {
                "title": "The Yes-And Principle",
                "desc": "Demonstration: Teacher and volunteer improvise a short scene twice — once blocking every offer ('No, that's not...') and once accepting ('Yes, and...'). Class discusses the difference."
            },
            {
                "title": "Failure Bow",
                "desc": "When a scene dies or goes wrong, both performers take a theatrical bow and the audience cheers. This ritualises graceful failure and removes performance anxiety."
            }
        ],
        "pacing": [
            {"phase": "Warm-Up: Word Association Circle", "duration": "5 min", "details": "Standing circle. Say the first word that comes to mind when you hear the previous word. Speed increases. No thinking allowed."},
            {"phase": "One-Word Story", "duration": "8–10 min", "details": "Circle tells a story one word at a time. Each person adds exactly one word. Practice listening and building."},
            {"phase": "Yes-And Demo & Practice", "duration": "10 min", "details": "Teacher demonstrates Yes-And vs. blocking. Pairs practise: Partner A starts a scene, Partner B must say 'Yes, and...' to every offer."},
            {"phase": "Gibberish Translator", "duration": "10–12 min", "details": "Pairs: one speaks in made-up language with emotional expression, the other 'translates' for the audience. Builds physical expressiveness."},
            {"phase": "Party Quirks", "duration": "10–12 min", "details": "One student hosts a 'party'; each arriving guest has a secret character quirk. Host must guess the quirks through improvised conversation."},
            {"phase": "Scenes from a Hat / Audience Suggestions", "duration": "10–15 min", "details": "Volunteers perform 60-second scenes based on audience-suggested scenarios. Failure Bow after each scene."},
            {"phase": "Cool-Down & Reflection", "duration": "5–8 min", "details": "Seated discussion: Where else in life could 'Yes-And' thinking help you? When is it hardest to accept someone else's idea?"}
        ],
        "engagement": {
            "cognitive": "Rapid narrative construction, character inference, and adaptive thinking under time pressure.",
            "social": "Active listening, building on others' ideas, celebrating failure, and performing for peers.",
            "physical": "Standing, moving through space, using gesture and physical expression to convey character."
        },
        "assessment": {
            "formative": "Teacher observes: Are students accepting and building offers? Is physical expressiveness increasing across rounds?",
            "peer": "Audience appreciation (applause, laughter) provides natural feedback on scene effectiveness.",
            "summative": "Optional reflection: Describe a moment when you successfully used 'Yes-And' thinking today, and one situation outside drama where you could use it."
        },
        "sharing": "Scenes from a Hat serves as the culminating performance — audience-suggested, volunteer-performed, celebrated with the Failure Bow ritual.",
        "reflection": "Never force students to perform solo — all early exercises are in circles or pairs. Volunteers only for the later games. The Failure Bow ritual is essential: it must be established early so that 'dying on stage' is normalised and celebrated. Teachers should perform first and fail publicly to model the behaviour.",
        "toolkit": [
            "Open floor space with a defined 'stage' area",
            "Optional: a hat or container for audience suggestion slips",
            "No materials required for any core exercise"
        ]
    },
    {
        "id": 6,
        "filename": "oneday-06-debate-walk.html",
        "image": "images/oneday06.jpg",
        "school": "1-Day Activity",
        "title": "The Great Debate Walk",
        "subtitle": "Opinion Spectrum, Kinesthetic Argumentation & Perspective-Taking",
        "category": "Discussion & Movement",
        "duration": "60–75 minutes",
        "duration_bucket": "one_day",
        "grade_level": "Grade 7–9",
        "resources": "None",
        "summary": "Students physically move to positions along a classroom spectrum (Strongly Agree → Strongly Disagree) in response to provocative but age-appropriate statements. After each move, students must justify their position to a neighbour who disagrees, then may shift positions. Progressive rounds add complexity: devil's advocate roles, silent positioning, and student-generated statements.",
        "rationale": "Kinesthetic argumentation removes the intimidation of formal debate and hand-raising. When students literally 'take a stand,' they commit to a position physically before articulating it verbally, which lowers the cognitive barrier to participation. The format naturally surfaces diverse perspectives and teaches students that changing your mind based on evidence is a strength, not a weakness.",
        "outcomes": [
            "ELA / FLA: Learners will formulate and articulate opinions supported by reasoning, and respond respectfully to opposing viewpoints.",
            "Social Studies: Learners will examine multiple perspectives on civic and social issues and evaluate the strength of different arguments."
        ],
        "cross_curricular": ["ELA / FLA", "Social Studies", "Healthy Living", "Citizenship"],
        "competencies": ["Communication", "Critical Thinking", "Citizenship"],
        "continuum_skills": [
            {"en": "Communicate", "fr": "Communiquer"},
            {"en": "Evaluate", "fr": "Évaluer"},
            {"en": "Formulate", "fr": "Formuler"}
        ],
        "essential_questions": [
            "Is changing your position after hearing a compelling argument a sign of weakness or intellectual strength?",
            "How does physically 'standing' for a belief change how strongly you feel about it?",
            "What makes an argument persuasive versus merely loud?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Ground Rules for Respectful Disagreement",
                "desc": "Establish norms: critique the argument, not the person. Use sentence starters like 'I see it differently because...' and 'That's a fair point, but I still think...'"
            },
            {
                "title": "Evidence vs. Opinion Mini-Lesson",
                "desc": "Brief distinction: opinions are preferences; arguments are opinions supported by reasoning or evidence. Today we practise moving from opinion to argument."
            }
        ],
        "pacing": [
            {"phase": "Ground Rules & Setup", "duration": "5–8 min", "details": "Establish respectful disagreement norms. Designate one wall as 'Strongly Agree' and the opposite as 'Strongly Disagree.'"},
            {"phase": "Round 1: Low-Stakes Warm-Up", "duration": "8–10 min", "details": "Fun statements: 'Pizza is the greatest food ever invented.' Students move, then justify to a neighbour with a different position."},
            {"phase": "Round 2: Meaningful Statements", "duration": "12–15 min", "details": "Age-appropriate debate topics: 'Students should choose their own learning topics.' Students justify, then may shift after hearing arguments."},
            {"phase": "Round 3: Devil's Advocate", "duration": "10–12 min", "details": "Students must argue FOR the position opposite to their actual belief. Builds empathy and perspective-taking."},
            {"phase": "Round 4: Student-Generated Statements", "duration": "10–12 min", "details": "Students write their own statements on slips of paper. Teacher selects and reads them. Authors observe how the class responds to their idea."},
            {"phase": "Reflection & Transfer", "duration": "5–8 min", "details": "Discussion: When did someone change your mind? What made their argument persuasive? How can you use these skills in written arguments?"}
        ],
        "engagement": {
            "cognitive": "Rapid argument formulation, evaluating evidence quality, and perspective-taking through devil's advocate roles.",
            "social": "Cross-opinion pair discussions, active listening to opposing views, and practising respectful disagreement protocols.",
            "physical": "Continuous standing and walking to positions along the spectrum; physical commitment to a stance before verbal articulation."
        },
        "assessment": {
            "formative": "Teacher monitors quality of justifications: Are students moving beyond 'because I like it' to reasoned arguments?",
            "peer": "Natural peer assessment — students whose arguments cause others to shift positions receive visible, kinesthetic feedback.",
            "summative": "Optional: students write a short persuasive paragraph on one of the day's topics, using at least one argument they heard from an opponent."
        },
        "sharing": "The devil's advocate round is the most powerful — students share their 'opposing argument' with the full group and discuss how it felt to argue against their own belief.",
        "reflection": "Choose statements carefully — avoid topics that could target individual students' identities or lived experiences. The best statements are genuinely debatable with reasonable positions on both sides. If a statement causes an overwhelming consensus (everyone on one side), it's not a good debate topic — swap it.",
        "toolkit": [
            "Open classroom with clear wall-to-wall spectrum space",
            "Prepared statement cards (5–8 age-appropriate debatable statements)",
            "Blank slips of paper for student-generated statements",
            "Sentence starter anchor chart (optional)"
        ]
    },
    {
        "id": 7,
        "filename": "oneday-07-silent-lineup.html",
        "image": "images/oneday07.jpg",
        "school": "1-Day Activity",
        "title": "Silent Line-Up Challenges",
        "subtitle": "Non-Verbal Communication, Group Coordination & Creative Problem Solving",
        "category": "Teambuilding & Non-Verbal Communication",
        "duration": "45–60 minutes",
        "duration_bucket": "one_day",
        "grade_level": "Grade 7–9",
        "resources": "None",
        "summary": "Students must arrange themselves in order (birthday, height, alphabetical by middle name, shoe size) without speaking, using only gestures, facial expressions, and creative non-verbal strategies. Progressive rounds increase difficulty: eyes closed, arranged on a narrow 'balance beam' line (tape on floor), or sorting into complex categories simultaneously.",
        "rationale": "Removing speech forces students to discover how much communication is non-verbal — a critical insight for adolescents developing social awareness. The task is simple enough that everyone can participate, but the constraint makes it genuinely challenging and often hilarious. It reveals natural leaders, creative problem-solvers, and the power of patient observation.",
        "outcomes": [
            "Healthy Living: Learners will identify and practise non-verbal communication skills that contribute to effective group interaction.",
            "ELA / FLA: Learners will recognise that communication extends beyond words to include gesture, expression, proximity, and body language."
        ],
        "cross_curricular": ["Healthy Living", "ELA / FLA", "Mathematics (Ordering & Sequencing)"],
        "competencies": ["Communication", "Critical Thinking", "Citizenship"],
        "continuum_skills": [
            {"en": "Communicate", "fr": "Communiquer"},
            {"en": "Problem Solve", "fr": "Trouver une solution"},
            {"en": "Classify", "fr": "Classer"}
        ],
        "essential_questions": [
            "How much information can you communicate without any words at all?",
            "What creative strategies emerge when your primary communication tool (speech) is removed?",
            "What does this activity reveal about how we typically communicate — and what we take for granted?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Non-Verbal Communication Intro",
                "desc": "Brief demonstration: Teacher acts out a simple instruction using only gestures. Class discusses what body language signals they read and how."
            },
            {
                "title": "The Rules of Silence",
                "desc": "Establish the silence contract: no whispering, mouthing words, writing, or phone use. Only gestures, pointing, facial expressions, and spatial movement."
            }
        ],
        "pacing": [
            {"phase": "Introduction & Silence Contract", "duration": "3–5 min", "details": "Explain the activity. Establish silence rules. Practice: try to communicate your birthday month using only fingers."},
            {"phase": "Round 1: Birthday Line-Up", "duration": "8–10 min", "details": "Arrange yourselves in calendar order by birthday (Jan 1 → Dec 31) without speaking. Timer runs. Verify by going down the line."},
            {"phase": "Debrief 1", "duration": "3 min", "details": "Break silence. Discuss: What strategies emerged? How did you communicate months vs. days?"},
            {"phase": "Round 2: Alphabetical by Middle Name", "duration": "8–10 min", "details": "Harder — how do you gesture letters? Students develop air-writing, finger-spelling, or creative charades."},
            {"phase": "Round 3: Balance Beam Sort", "duration": "10–12 min", "details": "Lay tape on the floor as a narrow beam. Students stand on it and must re-sort by height WITHOUT stepping off the tape. Physical coordination challenge."},
            {"phase": "Round 4: Eyes-Closed Challenge (Optional)", "duration": "8–10 min", "details": "Eyes closed, arrange by shoe size using only touch (tapping feet, guiding by shoulder). Ultimate trust challenge."},
            {"phase": "Final Reflection", "duration": "5–8 min", "details": "Discussion: What percentage of communication is non-verbal? How did leadership emerge differently without voice?"}
        ],
        "engagement": {
            "cognitive": "Pattern recognition, sequential reasoning, and inventing communication systems under constraint.",
            "social": "Patience, reading subtle cues, guiding without speaking, and managing group coordination non-verbally.",
            "physical": "Standing, moving along a line, balancing (beam round), and using fine motor gesture and facial expression."
        },
        "assessment": {
            "formative": "Teacher observes: Do students maintain silence? What creative strategies emerge? How does the group self-organise?",
            "peer": "The verification step (reading down the line) provides instant collective feedback on accuracy.",
            "summative": "Exit ticket: Describe one non-verbal communication strategy you invented or observed today. Where in daily life do you already use non-verbal communication?"
        },
        "sharing": "The balance beam round serves as the culminating spectacle — watching peers negotiate physical rearrangement on a narrow line without speaking is inherently entertaining and discussion-worthy.",
        "reflection": "This activity is excellent for the first week of school — it builds community without requiring students to know each other's names yet. The birthday round is the easiest and most natural starting point. Avoid the eyes-closed round if the group hasn't established sufficient trust and safety norms.",
        "toolkit": [
            "Open floor space for line formation",
            "Painter's tape or masking tape for the 'balance beam' line",
            "Timer (phone or classroom clock)",
            "No other materials required"
        ]
    },
    {
        "id": 8,
        "filename": "oneday-08-storytelling-relay.html",
        "image": "images/oneday08.jpg",
        "school": "1-Day Activity",
        "title": "Storytelling Relay & Radio Play",
        "subtitle": "Collaborative Narrative, Vocal Expression & Ensemble Performance",
        "category": "Drama & Narrative",
        "duration": "60–90 minutes",
        "duration_bucket": "one_day",
        "grade_level": "Grade 7–9",
        "resources": "None",
        "summary": "Teams build stories collaboratively through relay formats — one sentence at a time, conducted storytelling (teacher points to next narrator), and genre-switch challenges. The session culminates in each group performing a 2-minute 'radio play' (voices and sound effects only, no visuals) for the class, using only their voices, bodies, and found sounds.",
        "rationale": "Oral storytelling is humanity's oldest art form and adolescents are naturally drawn to narrative. The relay format distributes creative risk across the group — no single student is responsible for the whole story — while the radio play format lets students perform without the vulnerability of being 'on stage.' It trains narrative structure, vocal range, and ensemble timing simultaneously.",
        "outcomes": [
            "ELA / FLA: Learners will construct collaborative oral narratives demonstrating setting, character, conflict, and resolution.",
            "Music / Drama: Learners will use vocal dynamics, sound effects, and timing to create atmosphere and emotional impact through audio performance."
        ],
        "cross_curricular": ["ELA / FLA", "Drama", "Music"],
        "competencies": ["Communication", "Creativity & Innovation", "Critical Thinking"],
        "continuum_skills": [
            {"en": "Create", "fr": "Créer"},
            {"en": "Communicate", "fr": "Communiquer"},
            {"en": "Plan", "fr": "Planifier"}
        ],
        "essential_questions": [
            "What makes a story compelling to LISTEN to (versus read)?",
            "How do voice, sound, silence, and pacing create mood without any visual information?",
            "What happens to a story when you must build on a teammate's unexpected contribution?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Story Arc Refresher",
                "desc": "Quick visual reminder of narrative structure: Hook → Rising Action → Climax → Resolution. The relay must hit these beats."
            },
            {
                "title": "Vocal Toolbox Demo",
                "desc": "Teacher demonstrates: volume, pace, pitch, pause, accent, and found-sound effects (clapping, stomping, whistling, table-tapping). Students practice each tool briefly."
            }
        ],
        "pacing": [
            {"phase": "Vocal Toolbox Warm-Up", "duration": "5–8 min", "details": "Teacher demonstrates vocal tools. Students practise: whisper a sentence, shout it, say it slowly, say it fast, add an accent. Found-sound brainstorm."},
            {"phase": "Round 1: One-Sentence Relay", "duration": "10 min", "details": "Standing circle. Teacher gives an opening line. Each student adds one sentence. Story must reach a conclusion by the end of the circle."},
            {"phase": "Round 2: Conducted Storytelling", "duration": "10 min", "details": "Teacher 'conducts' by pointing at random narrators. The narrator must continue the story mid-sentence. Keeps everyone alert."},
            {"phase": "Round 3: Genre Switch", "duration": "8–10 min", "details": "Story continues but teacher calls genre changes: 'Horror!' 'Romance!' 'Documentary!' Students must shift tone, vocabulary, and pacing instantly."},
            {"phase": "Radio Play Preparation", "duration": "12–15 min", "details": "Groups of 4–5 prepare a 2-minute radio play. Assign roles: narrator, characters, sound-effects crew. Rehearse once."},
            {"phase": "Radio Play Performances", "duration": "10–15 min", "details": "Each group performs their radio play. Audience closes eyes to simulate 'radio listening.' Brief applause and one positive comment per group."},
            {"phase": "Reflection", "duration": "5 min", "details": "Discussion: Which vocal tools were most effective? What was different about telling vs. writing a story?"}
        ],
        "engagement": {
            "cognitive": "Real-time narrative construction, genre awareness, and adapting story elements to match tonal shifts.",
            "social": "Building on teammates' contributions, distributing creative roles, and performing for a supportive audience.",
            "physical": "Vocal projection, body percussion for sound effects, and physical storytelling gestures."
        },
        "assessment": {
            "formative": "Teacher listens for narrative coherence, genre-appropriate vocabulary, and use of vocal dynamics during relay rounds.",
            "peer": "Audience feedback after radio plays: one specific positive comment per group ('The storm sound effects were so realistic').",
            "summative": "Optional: students write a brief 'director's notes' for their radio play explaining the vocal and sound choices they made and why."
        },
        "sharing": "The radio play performances are the culminating sharing event — audiences close their eyes to simulate authentic radio listening, which heightens focus on vocal and sound craft.",
        "reflection": "The relay rounds MUST precede the radio play — they warm up collaborative storytelling muscles so the final performance has material to work with. If groups struggle with radio play preparation, suggest they adapt one of the relay stories from the earlier rounds rather than starting from scratch.",
        "toolkit": [
            "Open classroom space (desks cleared for performance area)",
            "No materials required — all sound effects are vocal or body percussion",
            "Optional: timer for 2-minute radio play performances",
            "Optional: 'genre cards' for the genre-switch round"
        ]
    },
    {
        "id": 9,
        "filename": "oneday-09-status-power.html",
        "image": "images/oneday09.jpg",
        "school": "1-Day Activity",
        "title": "Status & Power Workshop",
        "subtitle": "Social Dynamics, Body Language Awareness & Character Exploration",
        "category": "Drama & Social Awareness",
        "duration": "60–75 minutes",
        "duration_bucket": "one_day",
        "grade_level": "Grade 7–9",
        "resources": "None (optional: playing cards)",
        "summary": "Students explore the concept of social 'status' — high-status (confident, space-owning) vs. low-status (small, apologetic) body language — through progressive drama exercises. Starting with status walks, moving to paired status scenes, and culminating in a 'status party' where each student is assigned a secret status level (1–10) and must act accordingly while the audience guesses their number.",
        "rationale": "Understanding status dynamics gives adolescents conscious control over their body language and social interactions. By making status visible and playable, students develop empathy for how physical presence affects social hierarchies — and gain tools to modulate their own status in interviews, presentations, conflict resolution, and peer interactions.",
        "outcomes": [
            "Drama / ELA: Learners will use body language, spatial relationships, and vocal modulation to portray character status and social dynamics.",
            "Healthy Living: Learners will analyse how non-verbal behaviours influence social perception and interpersonal relationships."
        ],
        "cross_curricular": ["Drama", "ELA / FLA", "Healthy Living", "Social Studies"],
        "competencies": ["Communication", "Critical Thinking", "Personal Career Development"],
        "continuum_skills": [
            {"en": "Create", "fr": "Créer"},
            {"en": "Analyse", "fr": "Analyser"},
            {"en": "Communicate", "fr": "Communiquer"}
        ],
        "essential_questions": [
            "What specific body language signals communicate power, confidence, or authority — and can they be learned?",
            "How does status affect who gets heard in a conversation, a classroom, or a society?",
            "When is it useful to raise or lower your status deliberately, and when might it be harmful?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Status Spectrum Introduction",
                "desc": "Teacher demonstrates extreme high-status (owns the room, slow movements, direct eye contact) and extreme low-status (small, fidgety, avoids eye contact). Class identifies specific physical signals."
            },
            {
                "title": "Status Is Not Personality",
                "desc": "Important distinction: status is a performable behaviour, not a fixed trait. A shy person can play high-status; a confident person can play low-status. This is about the SKILL of modulating presence."
            }
        ],
        "pacing": [
            {"phase": "Status Spectrum Demo", "duration": "5–8 min", "details": "Teacher demonstrates high-status (10) and low-status (1) walks. Class identifies specific physical signals: eye contact, pace, posture, gesture size, voice volume."},
            {"phase": "Status Walk Exercise", "duration": "10 min", "details": "Students walk around the room. Teacher calls numbers 1–10; students adjust their body language to match. Practice the full spectrum."},
            {"phase": "Status Pair Scenes", "duration": "12–15 min", "details": "Pairs receive scenario cards (job interview, teacher-student meeting, two friends). Each is assigned a status number. Improvise a 60-second scene staying in status."},
            {"phase": "Status Switch", "duration": "8–10 min", "details": "Same pairs, same scenario, but status numbers swap. Discussion: How did it feel? How did the scene change?"},
            {"phase": "Status Party", "duration": "12–15 min", "details": "Each student draws a secret card (1–10). All attend a 'party' and must behave at their status level. Audience watches and guesses each person's number."},
            {"phase": "Debrief & Real-World Connection", "duration": "8–10 min", "details": "Discussion: When do you play high or low status in real life? When might you want to change your status deliberately (presentations, conflicts, interviews)?"}
        ],
        "engagement": {
            "cognitive": "Analysing micro-behaviours that signal social status; predicting how status dynamics affect scene outcomes.",
            "social": "Practising unfamiliar social registers; developing empathy for how body language affects perception.",
            "physical": "Full-body engagement: posture, gait, gesture size, eye contact patterns, and spatial relationships."
        },
        "assessment": {
            "formative": "Teacher observes: Can students physically embody different status levels? Can they articulate the specific signals they're using?",
            "peer": "Status Party audience guessing provides direct feedback on whether a student's physical choices are readable.",
            "summative": "Reflection journal: Describe one situation where you could deliberately raise or lower your status to communicate more effectively."
        },
        "sharing": "The Status Party is the culminating performance — each student's secret number is revealed after the audience guesses, generating discussion about which signals were most readable.",
        "reflection": "Frame this activity carefully: status is a SKILL, not a judgement. Avoid language that equates high-status with 'good' or low-status with 'bad.' Both are useful in different contexts. This activity can be powerful for students who struggle with social confidence, as it gives them explicit tools rather than vague advice like 'be more confident.'",
        "toolkit": [
            "Open floor space for walking and scene work",
            "Optional: playing cards (Ace = 1, 10 = 10) for the Status Party",
            "Scenario cards for paired scenes",
            "No other materials required"
        ]
    },
    {
        "id": 10,
        "filename": "oneday-10-mission-impossible.html",
        "image": "images/oneday10.jpg",
        "school": "1-Day Activity",
        "title": "Mission Impossible Team Challenge",
        "subtitle": "Multi-Stage Strategy, Role Delegation & Timed Collaboration",
        "category": "Teambuilding & Strategy",
        "duration": "60–90 minutes",
        "duration_bucket": "one_day",
        "grade_level": "Grade 7–9",
        "resources": "Minimal (paper, tape, markers)",
        "summary": "Teams of 5–6 receive a sealed 'mission briefing' containing 4–5 linked micro-challenges that must be completed in sequence within a strict time limit. Challenges are designed to require different skill types (logic, physical coordination, creativity, memory) so every team member's strengths are needed. Teams must delegate roles, manage time, and adapt strategy on the fly.",
        "rationale": "Multi-stage timed challenges simulate authentic collaborative pressure — the kind students will face in group projects, workplace teams, and civic participation. By designing challenges that require different skill types, the activity ensures that no single personality dominates and that every student experiences being both leader and follower within the same hour.",
        "outcomes": [
            "ELA / FLA: Learners will use oral communication to plan, delegate, and adapt strategy within time constraints.",
            "Technology Education: Learners will apply a systematic design process (plan, execute, evaluate, modify) to solve multi-step challenges."
        ],
        "cross_curricular": ["ELA / FLA", "Technology Education", "Mathematics", "Healthy Living"],
        "competencies": ["Critical Thinking", "Communication", "Creativity & Innovation"],
        "continuum_skills": [
            {"en": "Plan", "fr": "Planifier"},
            {"en": "Problem Solve", "fr": "Trouver une solution"},
            {"en": "Communicate", "fr": "Communiquer"}
        ],
        "essential_questions": [
            "How does a team decide who does what when every member has different strengths?",
            "What happens to decision-making quality when you add time pressure — and how can you protect against it?",
            "What's the difference between a group of individuals working alongside each other and a true team?"
        ],
        "scaffolding_lessons": [
            {
                "title": "Quick Strengths Inventory",
                "desc": "Before missions begin, each team member writes one thing they're good at (logic, drawing, memory, building, explaining) on a sticky note. Team reviews its collective strengths before opening the briefing."
            },
            {
                "title": "Time Management Briefing",
                "desc": "Quick discussion: If you have 5 challenges and 30 minutes, how do you allocate time? What if one challenge takes longer than expected? Introduce the concept of time buffers."
            }
        ],
        "pacing": [
            {"phase": "Team Formation & Strengths Inventory", "duration": "5–8 min", "details": "Form teams of 5–6. Each member identifies one personal strength. Teams discuss collective strengths and potential role assignments."},
            {"phase": "Mission Briefing Distribution", "duration": "3 min", "details": "Each team receives a sealed envelope containing 4–5 challenge cards. Teams may open and read all challenges before the timer starts."},
            {"phase": "Strategy & Planning Window", "duration": "5 min", "details": "Timer NOT running. Teams read all challenges, discuss strategy, assign roles, and plan time allocation. This is their competitive advantage."},
            {"phase": "Mission Execution", "duration": "25–35 min", "details": "Timer starts. Teams complete challenges in sequence. Each completed challenge unlocks a clue or code needed for the final challenge."},
            {"phase": "Mission Debrief", "duration": "5 min", "details": "Teams report: Which challenges were hardest? Where did strategy break down? What would you change?"},
            {"phase": "Whole-Class Reflection", "duration": "5–8 min", "details": "Discussion: What made the best teams effective? Was it speed, strategy, or communication? How does this connect to group projects in class?"}
        ],
        "engagement": {
            "cognitive": "Multi-step planning, logical sequencing, pattern recognition, and real-time strategy adaptation.",
            "social": "Role delegation based on strengths, managing competing opinions under pressure, and supporting struggling teammates.",
            "physical": "Varies by challenge design: could include building, moving across the room, physical puzzles, or relay-style tasks."
        },
        "assessment": {
            "formative": "Teacher circulates and observes: Is the team using its planning window? Are roles distributed or is one person dominating?",
            "peer": "Team debrief is inherently peer-assessment — teams self-evaluate their collaboration effectiveness.",
            "summative": "Optional: each student writes a brief 'After-Action Report' — what went well, what they'd change, and one collaboration insight."
        },
        "sharing": "Teams present their mission debrief to the class — highlighting one moment where their team either clicked or broke down, and what they learned from it.",
        "reflection": "The PLANNING WINDOW before the timer starts is the most important design element. Teams that skip planning and dive in always perform worse — this is a teachable moment. Design challenges to require genuinely different skills: one logic puzzle, one physical task, one creative/drawing task, one memory challenge, and one that requires the whole team.",
        "toolkit": [
            "Mission briefing envelopes with 4–5 challenge cards per team (teacher-prepared)",
            "Paper, markers, tape, scissors (basic craft supplies for challenges)",
            "Timer visible to all teams",
            "Optional: combination locks or coded envelopes for sequential unlocking"
        ]
    }
]

def render_sidebar(active_page="index.html"):
    categories = {}
    for l in LESSONS:
        c = l["category"]
        if c not in categories:
            categories[c] = []
        categories[c].append(l)

    category_items = []
    for c_name, c_lessons in sorted(categories.items()):
        sub_links = "".join([f'<li><a href="{l["filename"]}">{html.escape(l["title"])}</a></li>' for l in c_lessons])
        category_items.append(f'''<li>
  <span class="opener">{html.escape(c_name)} ({len(c_lessons)})</span>
  <ul>
    {sub_links}
  </ul>
</li>''')

    all_lesson_links = "".join([f'<li class="{"active" if active_page == l["filename"] else ""}"><a href="{l["filename"]}"><strong>#{l["id"]}</strong> {html.escape(l["title"])}</a></li>' for l in LESSONS])
    all_proposal_links = "".join([f'<li class="{"active" if active_page == p["filename"] else ""}"><a href="{p["filename"]}"><strong>P{p["id"]}</strong> {html.escape(p["title"])}</a></li>' for p in PROPOSALS])
    all_oneday_links = "".join([f'<li class="{"active" if active_page == a["filename"] else ""}"><a href="{a["filename"]}"><strong>D{a["id"]}</strong> {html.escape(a["title"])}</a></li>' for a in ONE_DAY_ACTIVITIES])

    sidebar_html = f'''<!-- Sidebar -->
<div id="sidebar">
  <div class="inner">
    <section id="search" class="alt">
      <form method="get" action="index.html#matrix">
        <input type="text" name="query" id="sidebar-query" placeholder="Search lessons, schools, skills..." />
      </form>
    </section>
    <nav id="menu">
      <header class="major">
        <h2>Curriculum Menu</h2>
      </header>
      <ul>
        <li class="{"active" if active_page == "index.html" else ""}"><a href="index.html">Repository Homepage</a></li>
        <li><a href="index.html#matrix">Comparative Matrix</a></li>
        <li>
          <span class="opener">All 11 Lesson Exemplars</span>
          <ul>
            {all_lesson_links}
          </ul>
        </li>
        <li><a href="index.html#proposals">Proposal Hub — 10 New Designs</a></li>
        <li>
          <span class="opener">All 10 Project Proposals</span>
          <ul>
            {all_proposal_links}
          </ul>
        </li>
        <li><a href="index.html#one-day">1-Day Activities — Drama & Teambuilding</a></li>
        <li>
          <span class="opener">All 10 One-Day Activities</span>
          <ul>
            {all_oneday_links}
          </ul>
        </li>
        <li>
          <span class="opener">Browse by Category</span>
          <ul>
            {"".join(category_items)}
          </ul>
        </li>
      </ul>
    </nav>
    <section>
      <header class="major">
        <h2>Program Spotlights</h2>
      </header>
      <div class="mini-posts">
        <article>
          <a href="lesson-03-future-cities.html" class="image"><img src="images/pic03.jpg" alt="Future Cities" /></a>
          <p><strong>Pilot Exemplar</strong>: Future Cities & Sustainable Urban Planning (13–16h, STEM & Climate Resilience).</p>
        </article>
      </div>
    </section>
    <section>
      <header class="major">
        <h2>Nova Scotia Junior High ILT</h2>
      </header>
      <p>Integrated Learning Time (ILT) empowers junior high schools to implement cross-curricular inquiry, build provincial continuum skills, and foster student agency.</p>
      <ul class="contact">
        <li class="icon solid fa-school">Nova Scotia Public Schools</li>
        <li class="icon solid fa-book">Nova Scotia Renewed Curriculum Framework</li>
        <li class="icon solid fa-map-marker-alt">Nova Scotia, Canada</li>
      </ul>
    </section>
    <footer id="footer">
      <p class="copyright">&copy; Nova Scotia Junior High ILT Repository. Template: <a href="https://html5up.net">HTML5 UP Editorial</a>.</p>
    </footer>
  </div>
</div>'''
    return sidebar_html

def build_index():
    sidebar = render_sidebar(active_page="index.html")

    posts = []
    for l in LESSONS:
        skills_labels = ", ".join([s["en"] for s in l["continuum_skills"][:3]])
        post_html = f'''<article>
  <a href="{l["filename"]}" class="image"><img src="{l["image"]}" alt="{html.escape(l["title"])}" /></a>
  <h3><a href="{l["filename"]}">{html.escape(l["title"])}</a></h3>
  <p>{html.escape(l["summary"][:175])}...</p>
  <ul class="actions">
    <li><a href="{l["filename"]}" class="button">Read Full Plan</a></li>
  </ul>
</article>'''
        posts.append(post_html)

    proposal_posts = []
    for p in PROPOSALS:
        proposal_html = f'''<article>
  <a href="{p["filename"]}" class="image"><img src="{p["image"]}" alt="{html.escape(p["title"])}" /></a>
  <h3><a href="{p["filename"]}">{html.escape(p["title"])}</a></h3>
  <p>{html.escape(p["summary"][:175])}...</p>
  <ul class="actions">
    <li><a href="{p["filename"]}" class="button">Read Full Proposal</a></li>
  </ul>
</article>'''
        proposal_posts.append(proposal_html)

    oneday_posts = []
    for d in ONE_DAY_ACTIVITIES:
        oneday_html = f'''<article>
  <a href="{d["filename"]}" class="image"><img src="{d["image"]}" alt="{html.escape(d["title"])}" /></a>
  <h3><a href="{d["filename"]}">{html.escape(d["title"])}</a></h3>
  <p>{html.escape(d["summary"][:175])}...</p>
  <ul class="actions">
    <li><a href="{d["filename"]}" class="button">View Activity</a></li>
  </ul>
</article>'''
        oneday_posts.append(oneday_html)

    index_html = f'''<!DOCTYPE HTML>
<html>
	<head>
		<title>Nova Scotia Junior High Integrated Learning Time (ILT) Repository</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
		<link rel="stylesheet" href="assets/css/main.css" />
	</head>
	<body class="is-preload">
		<div id="wrapper">
			<div id="main">
				<div class="inner">
					<header id="header">
						<a href="index.html" class="logo"><strong>Nova Scotia Junior High</strong> · ILT Repository</a>
					</header>
					<section id="banner">
						<div class="content">
							<header>
								<h1>Integrated Learning Time<br />Curriculum Showcase</h1>
							</header>
							<p>Integrated Learning Time (ILT) provides junior high students with protected blocks for interdisciplinary inquiry, student-led creation, and cross-curricular competency mastery.</p>
							<ul class="actions">
								<li><a href="#exemplars" class="button big">Browse All 11 Exemplars</a></li>
								<li><a href="#proposals" class="button big">Explore 10 Proposals</a></li>
				<li><a href="#one-day" class="button big">1-Day Activities</a></li>
			</ul>
		</div>
	</section>
	<section id="exemplars">
		<header class="major"><h2>All 11 ILT Lesson Exemplars</h2></header>
		<div class="posts">{"".join(posts)}</div>
	</section>
	<section id="proposals">
		<header class="major"><h2>Project Proposals: 10 New Designs</h2></header>
		<div class="posts">{"".join(proposal_posts)}</div>
	</section>
	<section id="one-day">
		<header class="major"><h2>1-Day Activities: Drama &amp; Teambuilding</h2></header>
		<p>Ten quick-deploy <strong>drama games and teambuilding activities</strong> designed for a single ILT block (45–90 minutes). Grade 7–9, minimal or no resources required. Ideal for first-week community building, transition days, or substitute teacher days.</p>
		<div class="posts">{"".join(oneday_posts)}</div>
	</section>
			</div>
		</div>
		{sidebar}
	</div>
	<script src="assets/js/jquery.min.js"></script>
	<script src="assets/js/browser.min.js"></script>
	<script src="assets/js/breakpoints.min.js"></script>
	<script src="assets/js/util.js"></script>
	<script src="assets/js/main.js"></script>
</body>
</html>'''

    with open(os.path.join(OUTPUT_DIR, "index.html"), "w", encoding="utf-8") as f:
        f.write(index_html)
    print("Generated index.html")

def build_detail_pages(items, kind="lesson"):
    is_proposal = kind == "proposal"
    is_oneday = kind == "oneday"
    total = len(items)
    for idx, l in enumerate(items):
        prev_l = items[idx - 1] if idx > 0 else None
        next_l = items[idx + 1] if idx < total - 1 else None

        sidebar = render_sidebar(active_page=l["filename"])

        if is_proposal:
            chip_label = f'{l["category"]} · Proposal #{l["id"]}'
            prov_left_title = "Status"
            prov_left_value = "Pilot-Ready Proposal"
            prov_left_sub = f"<strong>Best Fit:</strong> {html.escape(l['grade_level'])}<br /><strong>Weekly Commitment:</strong> {html.escape(l['weekly'])}"
            reflection_heading = "Design Notes &amp; Anticipated Iterations"
        elif is_oneday:
            chip_label = f'{l["category"]} · 1-Day Activity #{l["id"]}'
            prov_left_title = "Activity Type"
            prov_left_value = "1-Day Drama / Teambuilding"
            prov_left_sub = f"<strong>Grade Level:</strong> {html.escape(l['grade_level'])}<br /><strong>Resources:</strong> {html.escape(l.get('resources', 'None'))}"
            reflection_heading = "Facilitation Tips &amp; Adaptations"
        else:
            chip_label = f'{l["category"]} · Lesson Exemplar #{l["id"]}'
            prov_left_title = "Curriculum Model"
            prov_left_value = l["school"]
            prov_left_sub = f"<strong>Target Grade Level:</strong> {html.escape(l['grade_level'])}"
            reflection_heading = "Teacher Retrospective &amp; Next-Year Iterations"

        # Essential questions
        eq_items = "".join([f'<li><blockquote>"{html.escape(q)}"</blockquote></li>' for q in l["essential_questions"]])

        # Outcomes
        outcomes_items = "".join([f'<li>{html.escape(o)}</li>' for o in l["outcomes"]])

        # Scaffolding lessons
        scaffold_items = "".join([f'''<div class="box" style="margin-bottom: 1.25rem;">
  <h4>{html.escape(s["title"])}</h4>
  <p>{html.escape(s["desc"])}</p>
</div>''' for s in l["scaffolding_lessons"]])

        # Optional starter idea bank (proposals that seed team brainstorming)
        if l.get("idea_bank"):
            bank_rows = "".join([f'''<tr>
  <td><strong>{html.escape(i["game"])}</strong></td>
  <td>{html.escape(i["mechanic"])}</td>
  <td>{html.escape(i["materials"])}</td>
  <td>{html.escape(i["hook"])}</td>
</tr>''' for i in l["idea_bank"]])
            idea_bank_html = f'''<!-- Starter Idea Bank -->
									<h2>Starter Idea Bank: Remix, Don&rsquo;t Invent</h2>
									<p>{html.escape(l["idea_bank_intro"])}</p>
									<div class="table-wrapper">
										<table>
											<thead>
												<tr>
													<th>Game Idea</th>
													<th>Mechanic</th>
													<th>Made From</th>
													<th>Why Kids Replay It</th>
												</tr>
											</thead>
											<tbody>
												{bank_rows}
											</tbody>
										</table>
									</div>

									<hr class="major" />

'''
        else:
            idea_bank_html = ""

        # Optional full-class scaling section (proposals planning for ~28 students)
        if l.get("class_scaling_levers"):
            lever_rows = "".join([f'''<tr>
  <td><strong>{html.escape(x["lever"])}</strong></td>
  <td>{html.escape(x["how"])}</td>
</tr>''' for x in l["class_scaling_levers"]])
            class_scaling_html = f'''<!-- Class Scaling -->
									<h2>Scaling to a Full Class: 28 Students, Everyone On</h2>
									<p>{html.escape(l["class_scaling_intro"])}</p>
									<div class="table-wrapper">
										<table>
											<thead>
												<tr>
													<th>Design Lever</th>
													<th>How It Works</th>
												</tr>
											</thead>
											<tbody>
												{lever_rows}
											</tbody>
										</table>
									</div>

									<hr class="major" />

'''
        else:
            class_scaling_html = ""

        # Pacing rows
        pacing_rows = "".join([f'''<tr>
  <td><strong>{html.escape(p["phase"])}</strong></td>
  <td><span style="font-weight: 600; color: #f56a6a;">{html.escape(p["duration"])}</span></td>
  <td>{html.escape(p["details"])}</td>
</tr>''' for p in l["pacing"]])

        # Continuum skills badges
        skills_badges = " ".join([f'<span class="button small" style="margin: 0.2rem 0.2rem 0.2rem 0; text-transform: none; cursor: default;">{html.escape(s["en"])} <small style="opacity: 0.7;">({html.escape(s["fr"])})</small></span>' for s in l["continuum_skills"]])

        # Competencies badges
        comp_badges = " ".join([f'<span class="button small alt" style="margin: 0.2rem 0.2rem 0.2rem 0; text-transform: none; cursor: default;">{html.escape(c)}</span>' for c in l["competencies"]])

        # Cross-curricular
        cross_list = ", ".join(l["cross_curricular"])

        # Toolkit items
        toolkit_items = "".join([f'<li>{t if ("<a " in t or "<code>" in t) else html.escape(t)}</li>' for t in l["toolkit"]])


        # Prev / Next actions
        nav_actions = []
        if prev_l:
            nav_actions.append(f'<li><a href="{prev_l["filename"]}" class="button">&larr; Previous: {html.escape(prev_l["title"])}</a></li>')
        else:
            nav_actions.append('<li><a href="index.html" class="button">&larr; Back to Hub</a></li>')

        if next_l:
            nav_actions.append(f'<li><a href="{next_l["filename"]}" class="button primary">Next: {html.escape(next_l["title"])} &rarr;</a></li>')
        else:
            nav_actions.append('<li><a href="index.html" class="button primary">Back to Hub &rarr;</a></li>')

        page_html = f'''<!DOCTYPE HTML>
<!--
	Editorial by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
-->
<html>
	<head>
		<title>{html.escape(l["title"])} | Nova Scotia ILT</title>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
		<link rel="stylesheet" href="assets/css/main.css" />
	</head>
	<body class="is-preload">

		<!-- Wrapper -->
			<div id="wrapper">

				<!-- Main -->
					<div id="main">
						<div class="inner">

							<!-- Header -->
								<header id="header">
									<a href="index.html" class="logo"><strong>Nova Scotia Junior High</strong> · Integrated Learning Time Repository</a>
									<ul class="icons">
										<li><a href="index.html" class="button small">Back to All Exemplars</a></li>
									</ul>
								</header>

							<!-- Content -->
								<section>
									<header class="main">
										<p style="font-size: 0.9rem; font-weight: 700; color: #f56a6a; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.5rem;">{html.escape(chip_label)}</p>
										<h1>{html.escape(l["title"])}</h1>
										<h3 style="color: #7f888f; font-weight: 400; margin-top: -0.5rem; margin-bottom: 1.5rem;">{html.escape(l["subtitle"])}</h3>
									</header>

									<!-- Institutional Provenance Banner -->
									<div class="box" style="border-left: 5px solid #f56a6a; background: #fafafa; padding: 1.5rem; margin-bottom: 2rem;">
										<div class="row gtr-50">
											<div class="col-6 col-12-medium">
												<h4 style="margin-bottom: 0.25rem; color: #3d4449;">{prov_left_title}</h4>
												<p style="font-size: 1.15rem; font-weight: 700; color: #f56a6a; margin-bottom: 0.5rem;">{html.escape(prov_left_value)}</p>
												<p style="margin-bottom: 0; font-size: 0.9rem;">{prov_left_sub}</p>
											</div>
											<div class="col-6 col-12-medium">
												<h4 style="margin-bottom: 0.25rem; color: #3d4449;">Facilitation Structure</h4>
												<p style="margin-bottom: 0.25rem; font-size: 0.95rem;"><strong>Recommended Duration:</strong> {html.escape(l["duration"])}</p>
												<p style="margin-bottom: 0; font-size: 0.95rem;"><strong>Inquiry Framework:</strong> {html.escape(l["category"])}</p>
											</div>
										</div>
									</div>

									<span class="image main"><img src="{l["image"]}" alt="{html.escape(l["title"])}" /></span>

									<!-- Pedagogical Rationale -->
									<h2>Pedagogical Rationale & Purpose</h2>
									<p>{html.escape(l["rationale"])}</p>
									<p>{html.escape(l["summary"])}</p>

									<hr class="major" />

									<!-- Essential Questions -->
									<h2>Essential Questions & Driving Inquiries</h2>
									<p>These core framing questions anchor student curiosity and guide research throughout the project arc:</p>
									<ul style="list-style: none; padding-left: 0;">
										{eq_items}
									</ul>

									<hr class="major" />

									<!-- Curriculum Outcomes -->
									<h2>Targeted Curriculum Outcomes & Cross-Curricular Integration</h2>
									<p>Explicit provincial curriculum outcomes central to unit design:</p>
									<ul>
										{outcomes_items}
									</ul>
									<p><strong>Integrated Subject Areas:</strong> {html.escape(cross_list)}</p>

									<hr class="major" />

									<!-- Continuum Skills & Competencies -->
									<h2>Nova Scotia Continuum Skills & Graduation Competencies</h2>
									<div class="row">
										<div class="col-6 col-12-medium">
											<h4>Continuum Skills Developed</h4>
											<div>{skills_badges}</div>
										</div>
										<div class="col-6 col-12-medium">
											<h4>Atlantic Canada Competencies</h4>
											<div>{comp_badges}</div>
										</div>
									</div>

									<hr class="major" />

									<!-- Scaffolding Lessons -->
									<h2>Instructional Scaffolding: Explicit Skill Mini-Lessons</h2>
									<p>To prepare students for open-ended problem solving, teachers deliver direct mini-lessons in key foundational techniques:</p>
									{scaffold_items}

									<hr class="major" />

									{idea_bank_html}
									{class_scaling_html}
									<!-- Pacing Timeline -->
									<h2>Structural Pacing & Phase Breakdown</h2>
									<div class="table-wrapper">
										<table>
											<thead>
												<tr>
													<th>Phase / Stage</th>
													<th>Duration</th>
													<th>Instructional Activities & Milestones</th>
												</tr>
											</thead>
											<tbody>
												{pacing_rows}
											</tbody>
										</table>
									</div>

									<hr class="major" />

									<!-- Student Engagement Triad -->
									<h2>Active Student Engagement Dimensions</h2>
									<p>How this learning experience deliberately engages the whole adolescent learner:</p>
									<div class="row">
										<div class="col-4 col-12-medium">
											<div class="box">
												<h4>Cognitive Active</h4>
												<p style="font-size: 0.9rem;">{html.escape(l["engagement"]["cognitive"])}</p>
											</div>
										</div>
										<div class="col-4 col-12-medium">
											<div class="box">
												<h4>Socially Active</h4>
												<p style="font-size: 0.9rem;">{html.escape(l["engagement"]["social"])}</p>
											</div>
										</div>
										<div class="col-4 col-12-medium">
											<div class="box">
												<h4>Physically Active</h4>
												<p style="font-size: 0.9rem;">{html.escape(l["engagement"]["physical"])}</p>
											</div>
										</div>
									</div>

									<hr class="major" />

									<!-- Assessment & Audience -->
									<h2>Assessment Strategy & Public Demonstration</h2>
									<div class="box">
										<div class="row gtr-50">
											<div class="col-6 col-12-medium">
												<h4>Formative & Peer Assessment</h4>
												<p style="font-size: 0.9rem;"><strong>Formative Checkpoints:</strong> {html.escape(l["assessment"]["formative"])}</p>
												<p style="font-size: 0.9rem;"><strong>Peer Feedback:</strong> {html.escape(l["assessment"]["peer"])}</p>
											</div>
											<div class="col-6 col-12-medium">
												<h4>Summative & Public Sharing</h4>
												<p style="font-size: 0.9rem;"><strong>Summative Criteria:</strong> {html.escape(l["assessment"]["summative"])}</p>
												<p style="font-size: 0.9rem;"><strong>Audience Sharing:</strong> {html.escape(l["sharing"])}</p>
											</div>
										</div>
									</div>

									<hr class="major" />

									<!-- Teacher Reflection -->
										<div class="box" style="background: #fff8f5; border: 1px solid #f56a6a; border-radius: 4px;">
											<h3 style="color: #f56a6a; margin-bottom: 0.75rem;">{reflection_heading}</h3>
										<p style="font-size: 0.95rem; line-height: 1.7; color: #3d4449; margin-bottom: 0;"><em>"{html.escape(l["reflection"])}"</em></p>
									</div>

									<hr class="major" />

									<!-- Implementation Toolkit -->
									<h2>Implementation Toolkit & Resources</h2>
									<ul>
										{toolkit_items}
									</ul>

									<hr class="major" />

									<!-- Navigation Actions -->
									<ul class="actions fit">
										{"".join(nav_actions)}
									</ul>

								</section>

						</div>
					</div>

					{sidebar}

			</div>

		<!-- Scripts -->
			<script src="assets/js/jquery.min.js"></script>
			<script src="assets/js/browser.min.js"></script>
			<script src="assets/js/breakpoints.min.js"></script>
			<script src="assets/js/util.js"></script>
			<script src="assets/js/main.js"></script>

	</body>
</html>'''

        out_file = os.path.join(OUTPUT_DIR, l["filename"])
        with open(out_file, "w", encoding="utf-8") as f:
            f.write(page_html)
        print(f"Generated {l['filename']}")

def build_lesson_pages():
    build_detail_pages(LESSONS, "lesson")

def build_proposal_pages():
    build_detail_pages(PROPOSALS, "proposal")

def build_oneday_pages():
    build_detail_pages(ONE_DAY_ACTIVITIES, "oneday")

if __name__ == "__main__":
    build_index()
    build_lesson_pages()
    build_proposal_pages()
    build_oneday_pages()
    print("Completed building Editorial ILT website.")
