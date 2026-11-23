/* ============================================================================
   TRACE FILE 402 JP: THE $14 HOODIE (Bilingual EN + Japanese Scaffolding)
   Course: Citizenship 9 (CIT9) - Outcome U6A: Global Citizenship
   Partial Japanese scaffolding the English so the student builds English
   curriculum vocabulary while fully understanding every stop, clue, and prompt.
   Images shared from ../TraceFile402/assets/ (no asset duplication).
   Separate Vault taskName: CIT9-TraceFile402-Sim-JP.
   ============================================================================ */

var TRACE402 = {
  meta: {
    title: "TRACE FILE 402: THE $14 HOODIE / 14ドルのパーカーの謎",
    subtitle: "Halifax-to-Dhaka human rights & supply-chain investigation (ハリファックス〜ダッカ 人権とサプライチェーン調査)",
    hud: "TRACE FILE 402 // CITIZENSHIP 9 (JP)",
    taskName: "CIT9-TraceFile402-Sim-JP",
    outcomeLabel: "Learning Outcome // Citizenship 9 (U6A: Global Citizenship / グローバル・シチズンシップ)",
    outcome: "Learners will evaluate the consequences of action and inaction as twenty-first century global citizens. (21世紀の地球市民として、行動すること・行動しないことの結果を評価する)",
    defaultTabLabels: { dispatch: "1. Story (ストーリー)", evidence: "2. Evidence (証拠)", toolkit: "3. Rights & Words (権利と用語)" }
  },

  characters: {
    elena: { name: "Elena Vance", role: "Senior Producer, Halifax Newsroom (報道プロデューサー)", img: "../TraceFile402/assets/char_elena.jpg" },
    nadia: { name: "Nadia Rahman", role: "Garment Worker, Dhaka Tier-2 (縫製工場の労働者)", img: "../TraceFile402/assets/char_nadia.jpg" },
    tariq: { name: "Tariq Hassan", role: "Factory Manager, Dhaka Tier-1 (一次工場の責任者)", img: "../TraceFile402/assets/char_tariq.jpg" },
    david: { name: "David Chen", role: "PR Director, NorthStar Apparel (ブランド広報部長)", img: "../TraceFile402/assets/char_david.jpg" },
    amira: { name: "Amira Osei", role: "Human Rights Lawyer (人権弁護士)", img: "../TraceFile402/assets/char_amira.jpg" }
  },

  glossary: {
    "supply chain (サプライチェーン)": "Every step from cotton field to factory to ship to store shelf. (原料から工場・船・お店に届くまでのすべての流れ)",
    "subcontracting (下請け / 再委託)": "When an approved Tier-1 factory secretly passes an order to an uninspected Tier-2 shop. (認定工場が注文の一部を無許可の安い工場へ秘密で回すこと)",
    "plausible deniability (もっともらしい否認)": "Setting things up so a brand can say 'we did not officially know' while still profiting. (「公式には知らなかった」と言い逃れできる仕組み)",
    "human rights (人権)": "Basic rights every person has simply because they are human. (すべての人が生まれながらに持つ基本的な権利)",
    "udhr (世界人権宣言 / 1948)": "Universal Declaration of Human Rights (30 articles): the UN's global human-rights standard. (国連が採択した30条の世界共通の人権基準)",
    "declaration (宣言)": "A formal statement of shared standards - NOT a binding court law with police. (共通の目標を示す文書。裁判所や警察による強制力はない)",
    "charter (カナダ権利自由憲章 / 1982)": "Canadian Charter of Rights and Freedoms: part of Canada's Constitution, enforced by Canadian courts. (カナダ憲法の一部。裁判所が法律を無効にできる強制力がある)",
    "reasonable limits (合理的な制限 / 第1条)": "Charter Section 1: rights are not absolute if a limit is justified in a free and democratic society. (自由で民主的な社会で正当化できる範囲の制限)",
    "notwithstanding (適用除外条項 / 第33条)": "Charter Section 33: lets a government override sections 2, 7, or 15 for up to 5 years. (議会が最長5年間、第2・7・15条を一時的に上書きできる規定)",
    "veto (拒否権)": "Power of 5 permanent UN Security Council members (USA, UK, France, Russia, China) to block action with one 'no' vote. (国連安保理の常任理事国5か国が1票で決議を止められる権限)"
  },

  stations: [
    /* ---------------- S0 BRIEFING ---------------- */
    {
      id: "s0", nav: "BRIEFING", navSub: "The $14 Hoodie (導入)", title: "Halifax Newsroom: The $14 Hoodie Leak (14ドルのパーカーの内部告発)",
      kicker: "Stop 0 // Assignment Desk (調査開始)", day: 0,
      imgs: [{ src: "../TraceFile402/assets/s0_hoodie_leak.jpg", cap: "A $14 NorthStar hoodie from Halifax beside a leaked factory photo from Dhaka. (ハリファックスの14ドルのパーカーとダッカの秘密工場の写真)" }],
      chars: [
        { key: "elena", quote: "A Halifax shopper bought this $14 hoodie with a '100% Ethically Audited' tag - then a worker in Bangladesh sent a photo of the same hoodies inside a cracked, padlocked building NOT on the brand's official list. Follow the trail. (「100%倫理的に監査済み」のタグが付いた14ドルのパーカーが、実は公式リストにない危険な工場で作られていたという写真が届きました。真相を追いましょう。)" }
      ],
      words: ["supply chain (サプライチェーン)", "subcontracting (下請け / 再委託)"],
      tabs: {
        dispatch: `<p>You are a junior investigator on a Halifax TV news desk. (あなたはハリファックスの報道局の若手調査員です。)</p>
<p><strong>The tip (情報提供):</strong> Canadian brand <strong>NorthStar Apparel</strong> sells a $14 hoodie promising <em>"100% Ethically Audited Factories."</em> (「100%倫理的に監査済み」と表示)</p>
<p>Last night, a leaked photo arrived from Dhaka, Bangladesh: NorthStar hoodies stacked inside an unmarked building with a <strong>cracked concrete pillar (ひび割れた柱)</strong> and a <strong>padlocked exit door (南京錠で施錠された非常口)</strong>.</p>`,
        evidence: `<p><strong>What sits on your desk right now (机の上の証拠):</strong></p>
<ul><li><strong>Item A:</strong> One $14 NorthStar hoodie bought in Halifax (<em>Made in Bangladesh</em>).</li>
<li><strong>Item B:</strong> NorthStar's official list of approved <strong>Tier-1 (一次・認定)</strong> factories in Dhaka.</li>
<li><strong>Item C:</strong> A leaked photo showing NorthStar labels inside a different building <strong>NOT</strong> on the official list. (公式リストに載っていない別の建物)</li></ul>`,
        toolkit: `<p><strong>How this works (進め方):</strong> Read the 3 middle tabs, then answer in the <strong>Investigator Log</strong> on the right. You can write your short answers in <strong>English, Japanese (日本語), or a mix</strong>! Your work saves automatically. (自動保存されます)</p>`
      },
      task: "Pick your class section, then click READY to open Trace File 402. (クラスを選んで開始ボタンを押してください)",
      fields: [
        { type: "section", label: "Your class section (クラス)" },
        { type: "ack", label: "READY: OPEN TRACE FILE 402 (調査を開始)" }
      ]
    },

    /* ---------------- S1 PAPER TRAIL ---------------- */
    {
      id: "s1", nav: "STOP 1", navSub: "Paper Trail (お金の流れ)", title: "Halifax to Dhaka: Cost Squeeze & Subcontracting (コスト圧迫と下請け)",
      kicker: "Stop 1 // Follow the Money", day: 1,
      imgs: [{ src: "../TraceFile402/assets/s1_supply_chain.jpg", cap: "Ocean containers cross from South Asia to Halifax for $0.10 per shirt, while rush orders push factories to subcontract. (海上輸送は1枚10セント。急ぎの注文が下請けを生む)" }],
      chars: [
        { key: "david", quote: "NorthStar inspects every approved Tier-1 factory. If a manager secretly moved our order to another building, they broke our contract. We did not authorize it. (認定工場はすべて監査している。別の建物へ回したなら契約違反で、当社は許可していない。)" },
        { key: "tariq", quote: "NorthStar demanded 40,000 hoodies in three weeks at a price that barely covers thread and electricity. If I say no, they move to another country. So I sent the overflow to a Tier-2 shop. Nobody from Toronto ever asks how we hit the deadline. (3週間で4万枚をギリギリの価格で要求された。断れば他国へ移る。だから裏の下請け工場に回した。トロントの本社はどうやって間に合わせたか決して聞かない。)" }
      ],
      words: ["subcontracting (下請け / 再委託)", "plausible deniability (もっともらしい否認)"],
      tabs: {
        dispatch: `<p>You check the shipping numbers and interview <strong>David Chen</strong> (NorthStar PR) and <strong>Tariq Hassan</strong> (approved Tier-1 factory manager in Dhaka).</p>
<p>Both agree the hoodies were sewn in an uninspected <strong>Tier-2 (二次・無許可)</strong> building, but they blame each other. (2人とも無許可の二次工場で作られたことは認めているが、責任の所在で対立している。)</p>`,
        evidence: `<p><strong>Cost ledger (コスト比較):</strong></p>
<ul><li><strong>Ocean freight (海上輸送):</strong> 60,000 shirts in one container (~$6,200 CAD) = <strong>$0.10 CAD per shirt</strong>.</li>
<li><strong>Bangladesh total:</strong> ~$0.17 labour (人件費) + $0.10 shipping = <strong>$0.27 CAD / shirt</strong>.</li>
<li><strong>Canada total:</strong> ~$4.13 labour ($16.50/hr) + $0.05 truck = <strong>$4.18 CAD / shirt</strong>.</li>
<li><strong>The blind spot (死角):</strong> NorthStar's auditor ONLY checked Tariq's clean Tier-1 plant, never the Tier-2 shop. (監査員は一次工場しか見ない)</li></ul>`,
        toolkit: `<p><strong>Key concept: Plausible deniability (もっともらしい否認).</strong> By demanding ultra-low prices and tight deadlines while only inspecting Tier-1, a brand gets cheap clothes AND can officially claim "we didn't know" about Tier-2. (安い価格と短い納期を押しつけつつ一次工場だけ監査することで、「知らなかった」と言い逃れできる仕組み)</p>`
      },
      task: "Choose how Tier-2 subcontracting shields NorthStar, then write 1-2 sentences (EN or JP OK).",
      fields: [
        {
          type: "choice", f: "judgments.s1.choice", label: "Why does secret Tier-2 subcontracting shield NorthStar Apparel? (秘密の二次下請けがブランドを守る理由は?)",
          options: [
            "Ocean container shipping costs more per hoodie than Canadian factory labour (海上輸送の方がカナダの人件費より高いから)",
            "NorthStar can point to its clean Tier-1 audit and claim it never officially knew about Tier-2 (一次工場の監査記録を示して「二次工場は知らなかった」と言えるから)",
            "Tier-2 workshops are already inspected by Canadian safety officers every month (二次工場も毎月カナダの監査を受けているから)",
            "Tariq's Tier-1 factory charges NorthStar more than a Canadian plant would (バングラデシュ工場の方がカナダより高いから)"
          ],
          correct: "NorthStar can point to its clean Tier-1 audit and claim it never officially knew about Tier-2 (一次工場の監査記録を示して「二次工場は知らなかった」と言えるから)",
          teachMap: {
            "Ocean container shipping costs more per hoodie than Canadian factory labour (海上輸送の方がカナダの人件費より高いから)": { msg: "Elena Vance: Check Tab 2 - ocean shipping is only $0.10 CAD vs. $4.13 Canadian labour. (証拠タブの数字を確認: 船は1枚10セントです)" },
            "Tier-2 workshops are already inspected by Canadian safety officers every month (二次工場も毎月カナダの監査を受けているから)": { msg: "Elena Vance: Check Tab 2 - NorthStar's auditor ONLY checked Tier-1, never Tier-2. (監査員は一次工場しか見ていません)" },
            "Tariq's Tier-1 factory charges NorthStar more than a Canadian plant would (バングラデシュ工場の方がカナダより高いから)": { msg: "Elena Vance: Bangladesh is $0.27 vs. $4.18 in Canada. Check 'Plausible deniability' in Tab 3! (タブ3の『もっともらしい否認』を確認)" }
          }
        },
        { type: "text", f: "judgments.s1.why", label: "Explain in 1-2 sentences using a clue from Tariq, David, or the cost ledger (英語でも日本語でもOK):", rows: 2, placeholder: "Tariq said... / David claimed... (タリクは...と言い、デビッドは...)" }
      ]
    },

    /* ---------------- S2 INSIDE TIER-2 ---------------- */
    {
      id: "s2", nav: "STOP 2", navSub: "Inside Tier-2 (工場内部)", title: "Inside the Tier-2 Workshop: Witness Testimony (二次工場の証言)",
      kicker: "Stop 2 // Ground Evidence", day: 2,
      imgs: [{ src: "../TraceFile402/assets/s2_tier2_floor.jpg", cap: "Inside the uninspected Tier-2 workshop: cracked concrete pillar and padlocked exit. (ひび割れた柱と施錠された非常口)" }],
      chars: [
        { key: "nadia", quote: "We work 12-hour shifts, six days a week, for $0.68 Canadian an hour. When workers asked about the crack in the fourth-floor pillar, the supervisor told us to stop talking or lose our jobs. They padlock the stairwell door at night. (時給0.68カナダドルで週6日・1日12時間働いている。柱のひびについて尋ねるとクビにすると脅され、夜は非常口に南京錠をかけられる。)" }
      ],
      words: ["human rights (人権)"],
      tabs: {
        dispatch: `<p>You interview <strong>Nadia Rahman</strong>, a 21-year-old sewing operator inside the unmarked Tier-2 building.</p>
<p>Her testimony mirrors what reporters found in <em>Made in Bangladesh</em>. (ドキュメンタリー『メイド・イン・バングラデシュ』で報じられた実態と同じ状況です。)</p>`,
        evidence: `<p><strong>Field notes from Nadia's building (現場メモ):</strong></p>
<ul><li><strong>Wages &amp; hours (賃金と労働時間):</strong> ~$0.68 CAD/hour, mandatory 12-hour shifts, 6 days/week.</li>
<li><strong>Physical safety (物理的な安全):</strong> visible <strong>crack in a concrete support pillar (柱のひび割れ)</strong>; <strong>fire-exit stairwell padlocked (非常口に南京錠)</strong>.</li>
<li><strong>Worker voice (発言の自由):</strong> workers who complain or try to form a union are threatened with firing (クビと脅される).</li>
<li><strong>Young workers (児童労働):</strong> two 14-year-old helpers trim threads instead of attending school (学校へ行けず14歳が働いている).</li></ul>`,
        toolkit: `<p><strong>Investigator skill:</strong> Record <strong>specific, verifiable facts (具体的な事実)</strong> so human-rights lawyers can match each fact to a written rule.</p>`
      },
      task: "Identify the most immediate life-threatening danger, then list TWO other red flags (EN or JP OK).",
      fields: [
        {
          type: "choice", f: "judgments.s2.top", label: "Which red flag poses the most immediate danger to workers' lives right now? (今すぐ命に関わる最も危険な問題は?)",
          options: [
            "Mandatory overtime during rush-order weeks (急ぎの注文時の残業)",
            "The $0.68 CAD hourly wage paid to sewing operators (時給0.68カナダドルの低賃金)",
            "The cracked concrete support pillar and padlocked fire exit (ひび割れた柱と南京錠で閉ざされた非常口)",
            "Two 14-year-old helpers missing school to trim threads (学校へ行かず働く14歳の子どもたち)"
          ],
          correct: "The cracked concrete support pillar and padlocked fire exit (ひび割れた柱と南京錠で閉ざされた非常口)",
          teachMap: {
            "Mandatory overtime during rush-order weeks (急ぎの注文時の残業)": { msg: "Elena Vance: Serious issue, but look for the physical hazard that could kill workers instantly in a fire or collapse. (火災や倒壊で今すぐ命を奪う危険はどれ?)" },
            "The $0.68 CAD hourly wage paid to sewing operators (時給0.68カナダドルの低賃金)": { msg: "Elena Vance: Unfair pay, yes - but which hazard threatens workers' lives right now? (今すぐ命に関わる物理的な危険はどれ?)" },
            "Two 14-year-old helpers missing school to trim threads (学校へ行かず働く14歳の子どもたち)": { msg: "Elena Vance: Great red flag for the written box below! For this question, pick the immediate physical life-or-death danger. (下の記述欄に書こう！ここは今すぐ命に関わる危険を選んで)" }
          }
        },
        { type: "text", f: "judgments.s2.flags", label: "List TWO other specific red flags from Nadia's evidence tab (他の問題点を2つ書こう / 英語でも日本語でもOK):", rows: 2, placeholder: "1) $0.68/hr & 12-hour shifts ... 2) ..." }
      ]
    },

    /* ---------------- S3 TOOLKIT A: UDHR ---------------- */
    {
      id: "s3", nav: "STOP 3", navSub: "UN & UDHR (世界人権宣言)", title: "Toolkit A: The World's Standard (UN & UDHR 1948 / 国連と世界人権宣言)",
      kicker: "Stop 3 // International Human Rights", day: 3,
      imgs: [{ src: "../TraceFile402/assets/s3_udhr_assembly.jpg", cap: "UN General Assembly: 193 member countries, founded in 1945 after WWII. (国連総会: 1945年設立、193か国)" }],
      chars: [
        { key: "amira", quote: "In 1948, after WWII, the UN adopted the Universal Declaration of Human Rights (UDHR) - 30 articles saying what every human is owed. Let's match Nadia's facts to the exact articles. (1948年、国連は世界人権宣言(全30条)を採択しました。ナディアの工場の事実を各条文に当てはめましょう。)" }
      ],
      words: ["human rights (人権)", "udhr (世界人権宣言 / 1948)", "declaration (宣言)"],
      tabs: {
        dispatch: `<p>Human rights lawyer <strong>Amira Osei</strong> opens Document 1: the <strong>Universal Declaration of Human Rights (UDHR / 世界人権宣言, 1948)</strong>.</p>
<p>Founded in 1945, the <strong>United Nations (国際連合)</strong> has <strong>193 member countries</strong>. Its job: <strong>keep peace (平和維持), protect rights (人権保護), deliver aid (人道支援)</strong>.</p>`,
        evidence: `<p><strong>Key UDHR Articles (主な条文):</strong></p>
<ul><li><strong>Article 1 &amp; 2:</strong> Born free and equal, no discrimination. (自由・平等・差別禁止)</li>
<li><strong>Article 3:</strong> Right to <strong>life, liberty, and security of person</strong>. (生命・自由・身体の安全)</li>
<li><strong>Article 19:</strong> Freedom of <strong>opinion and expression</strong>. (意見・表現の自由 / 声を上げる権利)</li>
<li><strong>Article 23 &amp; 24:</strong> Right to <strong>safe work, fair pay, rest, and reasonable hours</strong>, and to form a union. (安全な労働・公正な賃金・休息と適切な労働時間)</li>
<li><strong>Article 26:</strong> Right to <strong>education</strong> (why child labour breaks this). (教育を受ける権利)</li></ul>`,
        toolkit: `<p><strong>Honesty check (注意点):</strong> The UDHR is a <strong>declaration (宣言)</strong>, NOT a binding police law. There is no "UN Police Force" that can arrest a factory owner. Its power is setting the <strong>global standard (世界基準)</strong> to apply pressure.</p>`
      },
      task: "Match Nadia's factory evidence to the exact UDHR articles using Tab 2. (証拠タブを見て条文を合わせよう)",
      fields: [
        {
          type: "choice", f: "matches.udhr_safety", label: "1. Padlocked fire exit & cracked pillar breaks which UDHR article? (施錠された非常口とひび割れた柱)",
          options: [
            "Article 19 (Freedom of opinion and expression / 表現の自由)",
            "Article 3 (Life, liberty, and security of person / 生命と身体の安全)",
            "Article 26 (Right to education / 教育の権利)"
          ],
          correct: "Article 3 (Life, liberty, and security of person / 生命と身体の安全)",
          teachMap: {
            "Article 19 (Freedom of opinion and expression / 表現の自由)": { msg: "Amira Osei: Article 19 is about speaking up. Check Tab 2 for life and physical safety! (生命と安全は第何条?)" },
            "Article 26 (Right to education / 教育の権利)": { msg: "Amira Osei: Article 26 is about school. Check Tab 2 for life and physical safety! (生命と安全は第何条?)" }
          }
        },
        {
          type: "choice", f: "matches.udhr_voice", label: "2. Threatening to fire workers who speak up about safety? (安全について声を上げるとクビと脅す)",
          options: [
            "Article 26 (Right to education / 教育の権利)",
            "Article 14 (Right to seek asylum / 庇護を求める権利)",
            "Article 19 (Freedom of opinion and expression / 意見・表現の自由)"
          ],
          correct: "Article 19 (Freedom of opinion and expression / 意見・表現の自由)",
          teachMap: {
            "Article 26 (Right to education / 教育の権利)": { msg: "Amira Osei: Check Tab 2 - which article protects speaking up without fear? (自由に発言する権利は?)" },
            "Article 14 (Right to seek asylum / 庇護を求める権利)": { msg: "Amira Osei: Check Tab 2 - which article covers opinion and expression? (意見・表現の自由は?)" }
          }
        },
        {
          type: "choice", f: "matches.udhr_work", label: "3. Paying $0.68/hr for mandatory 12-hour shifts? (時給0.68ドルで12時間労働)",
          options: [
            "Articles 23 & 24 (Safe work, fair pay, reasonable hours / 公正な賃金・労働時間)",
            "Article 5 (No torture / 拷問の禁止)",
            "Article 26 (Right to education / 教育の権利)"
          ],
          correct: "Articles 23 & 24 (Safe work, fair pay, reasonable hours / 公正な賃金・労働時間)",
          teachMap: {
            "Article 5 (No torture / 拷問の禁止)": { msg: "Amira Osei: Check Tab 2 - which pair covers fair pay and reasonable hours? (賃金と労働時間は?)" },
            "Article 26 (Right to education / 教育の権利)": { msg: "Amira Osei: Article 26 is education. Check Tab 2 for work & pay! (労働と賃金は?)" }
          }
        },
        {
          type: "choice", f: "matches.udhr_youth", label: "4. 14-year-olds working on the floor instead of going to school? (学校へ行かず働く14歳)",
          options: [
            "Article 19 (Freedom of opinion / 表現の自由)",
            "Article 26 (Right to education / 教育を受ける権利)",
            "Article 3 (Life and security / 生命と安全)"
          ],
          correct: "Article 26 (Right to education / 教育を受ける権利)",
          teachMap: {
            "Article 19 (Freedom of opinion / 表現の自由)": { msg: "Amira Osei: Check Tab 2 - which article covers education and school? (教育は第何条?)" },
            "Article 3 (Life and security / 生命と安全)": { msg: "Amira Osei: Check Tab 2 - this clue is about missing school. (学校・教育は第何条?)" }
          }
        }
      ]
    },

    /* ---------------- S4 TOOLKIT B: CHARTER ---------------- */
    {
      id: "s4", nav: "STOP 4", navSub: "Burnside Test (カナダ憲章)", title: "Toolkit B: The Burnside Test (Canadian Charter 1982 / カナダ権利自由憲章)",
      kicker: "Stop 4 // Promise vs. Teeth (約束 vs 強制力)", day: 4,
      imgs: [{ src: "../TraceFile402/assets/s4_burnside_charter.jpg", cap: "If Nadia's workshop moved to Burnside in Halifax, Canadian inspectors and courts could shut it down immediately. (ハリファックスなら裁判所と監査官が即座に停止できる)" }],
      chars: [
        { key: "amira", quote: "Drop Nadia's factory in Burnside Industrial Park in Halifax tomorrow: safety inspectors shut it down and Canadian courts enforce the law. That is the difference between a declaration and a constitution. (もしこの工場がハリファックスにあれば、数時間で操業停止になり裁判所が法を執行する。それが『宣言』と『憲法』の違いです。)" }
      ],
      words: ["charter (カナダ権利自由憲章 / 1982)", "reasonable limits (合理的な制限 / 第1条)", "notwithstanding (適用除外条項 / 第33条)"],
      tabs: {
        dispatch: `<p>Now Amira compares the global <strong>UDHR</strong> with Canada's highest law: the <strong>Canadian Charter of Rights and Freedoms (1982 / カナダ権利自由憲章)</strong>.</p>
<p>The Charter is part of Canada's Constitution: Canadian judges can <strong>strike down laws (法律を無効にする)</strong> that break it.</p>`,
        evidence: `<p><strong>Five Charter sections to know (知っておくべき5つの条文):</strong></p>
<ul><li><strong>Section 2 (Fundamental Freedoms / 基本的自由):</strong> expression, peaceful assembly, association / unions (表現・集会・結社/労働組合).</li>
<li><strong>Section 7 (Life, Liberty &amp; Security / 生命・自由・安全):</strong> government cannot take away safety/liberty unfairly.</li>
<li><strong>Section 15 (Equality / 平等権):</strong> equal protection without discrimination.</li>
<li><strong>Section 1 (Reasonable Limits / 合理的な制限):</strong> rights can be limited if justified in a free &amp; democratic society.</li>
<li><strong>Section 33 (Notwithstanding Clause / 適用除外条項):</strong> government can temporarily override s.2, s.7, or s.15 for up to 5 years.</li></ul>`,
        toolkit: `<p><strong>Promise vs. Teeth (約束 vs 強制力):</strong></p>
<ul><li><strong>UDHR (Global):</strong> covers all humans, but has <strong>no court or police (裁判所・警察なし)</strong>. Power = moral pressure.</li>
<li><strong>Charter + Canadian Law (Canada):</strong> applies inside Canada, backed by <strong>real courts, inspectors, fines, and shutdowns (裁判所・罰金・停止命令)</strong>.</li></ul>`
      },
      task: "Compare the UDHR and the Canadian Charter (EN or JP OK for written answer).",
      fields: [
        {
          type: "choice", f: "judgments.s4.section", label: "Which Charter section protects workers' right to speak out or join a union? (発言や労働組合を守る憲章の条文は?)",
          options: [
            "Section 33 (Notwithstanding clause / 適用除外条項)",
            "Section 1 (Reasonable limits / 合理的な制限)",
            "Section 2 (Fundamental freedoms: expression & association / 基本的自由)"
          ],
          correct: "Section 2 (Fundamental freedoms: expression & association / 基本的自由)",
          teachMap: {
            "Section 33 (Notwithstanding clause / 適用除外条項)": { msg: "Amira Osei: Section 33 lets governments override rights. Check Tab 2 for expression and unions! (表現と結社は第何条?)" },
            "Section 1 (Reasonable limits / 合理的な制限)": { msg: "Amira Osei: Section 1 is about justified limits. Check Tab 2 for fundamental freedoms! (基本的自由は第何条?)" }
          }
        },
        {
          type: "choice", f: "judgments.s4.teeth", label: "What is the biggest practical difference between the UDHR and Canada's Charter? (UDHRとカナダ憲章の最大の違いは?)",
          options: [
            "The UDHR only applies to Canada, while the Charter applies to all 193 UN countries (UDHRはカナダのみ、憲章は世界193か国)",
            "Canadian courts can enforce the Charter and strike down laws; the UDHR is a global standard with no police or court of its own (カナダ憲章は裁判所が強制執行できるが、UDHRは世界基準で警察や裁判所がない)",
            "The Charter cannot ever be limited or overridden under any circumstances (憲章はいかなる場合も制限できない)"
          ],
          correct: "Canadian courts can enforce the Charter and strike down laws; the UDHR is a global standard with no police or court of its own (カナダ憲章は裁判所が強制執行できるが、UDHRは世界基準で警察や裁判所がない)",
          teachMap: {
            "The UDHR only applies to Canada, while the Charter applies to all 193 UN countries (UDHRはカナダのみ、憲章は世界193か国)": { msg: "Amira Osei: Flipped! UDHR is global; the Charter applies inside Canada. (逆です！UDHRが世界、憲章がカナダ国内です)" },
            "The Charter cannot ever be limited or overridden under any circumstances (憲章はいかなる場合も制限できない)": { msg: "Amira Osei: Check Tab 2 (s.1 & s.33 allow limits) and Tab 3 ('Promise vs. Teeth'). (第1条・33条とタブ3を確認)" }
          }
        },
        { type: "text", f: "judgments.s4.why", label: "Why can't a Canadian court simply walk into Dhaka and shut down Nadia's factory? (カナダの裁判所がダッカの工場を直接閉鎖できない理由は? 英語/日本語OK)", rows: 2, placeholder: "Canadian courts only have power inside Canada... (カナダの法律と裁判所はカナダ国内でしか...)" }
      ]
    },

    /* ---------------- S5 ENFORCEMENT GAP ---------------- */
    {
      id: "s5", nav: "STOP 5", navSub: "UN & Action (国連と行動)", title: "The Enforcement Gap: Why Didn't the UN Stop It? (なぜ国連は止められなかったのか)",
      kicker: "Stop 5 // Action vs. Inaction", day: 5,
      imgs: [{ src: "../TraceFile402/assets/s5_enforcement_gap.jpg", cap: "UN Security Council: 5 permanent members hold a VETO, while the General Assembly only passes recommendations. (安保理の5か国が拒否権を持つ)" }],
      chars: [
        { key: "amira", quote: "Look at the two UN rooms: the General Assembly (193 votes) cannot force action, while the Security Council CAN make binding orders - except 5 permanent members each hold a VETO. (総会は強制力がなく、安保理は強制力があるが常任理事国5か国が『拒否権』で1票でも止められるのです。)" }
      ],
      words: ["veto (拒否権)", "declaration (宣言)"],
      tabs: {
        dispatch: `<p>Hardest question in Global Citizenship (<strong>U6A</strong>): <strong>if a local government fails and the UN cannot send police, what actually forces change? (地元政府が動かず国連も警察を送れない時、何が現実を変えるのか?)</strong></p>
<p>After the 2013 <strong>Rana Plaza collapse (ラナ・プラザ崩落事故)</strong> in Bangladesh killed 1,100+ workers, the world tested what actually works.</p>`,
        evidence: `<p><strong>Two UN rooms + Real-world pressure tools (国連の2つの会議室と現実の圧力):</strong></p>
<ul><li><strong>UN General Assembly (国連総会 / 193):</strong> passes resolutions (決議), cannot force countries to obey.</li>
<li><strong>UN Security Council (安全保障理事会 / 15):</strong> binding power (制裁・平和維持軍), but <strong>5 permanent members (USA, UK, France, Russia, China)</strong> can block anything with 1 <strong>veto (拒否権)</strong>.</li>
<li><strong>What actually moved brands after Rana Plaza:</strong> (1) investigative media (報道), (2) the legally binding <strong>Bangladesh Safety Accord (法的拘束力のある安全協定)</strong>, (3) shopper pressure (消費者の圧力), (4) supply-chain laws in countries like Canada (国内法).</li></ul>`,
        toolkit: `<p><strong>Next class preview:</strong> You will play the <strong>UN Security Council Veto Trap</strong> simulation, then start your <strong>Country Profile Project</strong>.</p>`
      },
      task: "Order the 4-step chain (1 to 4), then choose the strongest real-world pressure tool. (1〜4の順に並べて、最も強い圧力ツールを選ぼう)",
      fields: [
        {
          type: "order", f: "responses.chain", label: "Number these 4 steps from 1 (start) to 4 (result) (原因から結果へ1〜4の番号を選ぼう):",
          items: [
            { k: "c", t: "UDHR rights are broken, but neither Canadian courts nor UN police can raid the building (人権が侵害されるが、カナダの裁判所も国連警察も入れない)" },
            { k: "a", t: "Canadian brand demands ultra-cheap hoodies on a tight deadline (カナダのブランドが激安・短納期で注文する)" },
            { k: "d", t: "Change only begins when media, binding brand accords, or laws force accountability (報道・法的拘束力のある協定・法律によってようやく変化が始まる)" },
            { k: "b", t: "Tier-1 factory secretly subcontracts overflow to an uninspected Tier-2 shop (一次工場が秘密で無許可の二次工場へ下請けに出す)" }
          ],
          expectOrder: { a: 1, b: 2, c: 3, d: 4 },
          stepHints: {
            "1": "Start at Step 1: what pressure starts the chain from Toronto? (最初: ブランドからの注文はどれ?)",
            "2": "Step 2: what does the Tier-1 factory do next? (2番目: 一次工場は何をした?)",
            "3": "Step 3: why can't Canadian courts or UN police step in? (3番目: 法的・国際的な空白はどれ?)",
            "4": "Step 4: finish with what finally forces accountability. (最後: 変化を起こす行動はどれ?)"
          }
        },
        {
          type: "choice", f: "judgments.s5.tool", label: "Which pressure tool has the strongest real teeth on Western brands? (欧米ブランドに対して最も実効性のある圧力は?)",
          options: [
            "Passing a non-binding speech with no inspection or follow-up (監査も強制力もないスピーチ)",
            "Legally binding safety accords and domestic laws that hold Western brands financially responsible (法的拘束力のある安全協定と、サプライチェーン責任を問う国内法)",
            "Hoping factories voluntarily double their prices without any outside pressure (工場が自主的に値上げすることを期待する)"
          ],
          correct: "Legally binding safety accords and domestic laws that hold Western brands financially responsible (法的拘束力のある安全協定と、サプライチェーン責任を問う国内法)",
          teachMap: {
            "Passing a non-binding speech with no inspection or follow-up (監査も強制力もないスピーチ)": { msg: "Amira Osei: Non-binding speeches have no teeth. Check Tab 2! (強制力のない宣言だけでは不十分です。タブ2を確認)" },
            "Hoping factories voluntarily double their prices without any outside pressure (工場が自主的に値上げすることを期待する)": { msg: "Amira Osei: Remember Tariq - if one factory raises prices alone, brands leave. Check Tab 2! (単独値上げでは注文が他国へ移ります。タブ2を確認)" }
          }
        }
      ]
    },

    /* ---------------- S6 BROADCAST VERDICT (COMMIT) ---------------- */
    {
      id: "s6", nav: "STOP 6", navSub: "Your Verdict (最終報告)", title: "6:00 PM Broadcast: File Your Final Verdict (最終レポート提出)",
      kicker: "Stop 6 // Final Report (Commit Gate)", day: 6,
      imgs: [{ src: "../TraceFile402/assets/s6_broadcast_desk.jpg", cap: "6:00 PM broadcast desk: deliver your evidence-backed verdict. (午後6時のニュースで最終結論を発表)" }],
      chars: [
        { key: "elena", quote: "Give viewers a sharp verdict: who holds the most responsibility, which UDHR article was broken, what action should be taken, and BOTH an intended and an unintended consequence. (誰の責任が一番大きいか、どのUDHR条文か、どんな行動をとるべきか、そして『意図した結果』と『意図しない結果』の両方を評価してください。)" }
      ],
      words: ["udhr (世界人権宣言 / 1948)", "plausible deniability (もっともらしい否認)"],
      tabs: {
        dispatch: `<p>This is your final investigative report for the 6:00 PM broadcast (最終レポート). You may write in <strong>English, Japanese, or a mix</strong>.</p>`,
        evidence: `<p><strong>Quick evidence checklist (証拠まとめ):</strong></p>
<ul><li><strong>Cost math:</strong> $0.27/shirt in Bangladesh vs. $4.18 in Canada.</li>
<li><strong>Tier-2 facts:</strong> $0.68/hr, 12-hr shifts, cracked pillar, padlocked exit, threats, 14-year-olds.</li>
<li><strong>Rights:</strong> UDHR (Art. 3, 19, 23-24, 26) vs. Charter (s.2, s.7, s.15).</li></ul>`,
        toolkit: `<p><strong>Outcome U6A tip (意図した結果 vs 意図しない結果):</strong> Example: if brands suddenly boycott a country, an <em>intended (意図した)</em> result is punishing unsafe owners, while an <em>unintended (意図しない)</em> result could be workers like Nadia losing their only income!</p>`
      },
      task: "Complete all 4 verdict entries (EN or JP OK), then click COMMIT MY BROADCAST VERDICT.",
      fields: [
        {
          type: "choice", f: "responses.verdict_resp", label: "1. Who holds the MOST responsibility? (最も責任が大きいのは誰?)",
          options: [
            "Western clothing brands (欧米の衣料ブランド: 価格と納期を決め利益を得ている)",
            "Local factory owners and governments (現地の工場経営者と政府: 建物と法律を管理している)",
            "Canadian shoppers (カナダの消費者: 14ドルの安さを求めている)",
            "Shared responsibility across brands, governments, and shoppers (ブランド・政府・消費者すべての共同責任)"
          ]
        },
        { type: "text", f: "responses.verdict_evidence", label: "2. Support your choice with ONE specific fact + ONE UDHR article number (事実1つ + UDHRの条文番号1つ / 英語・日本語OK):", rows: 2, placeholder: "Because of the locked exit (UDHR Article 3)... / 非常口が施錠されており(UDHR第3条)..." },
        { type: "text", f: "responses.verdict_action", label: "3. Propose ONE realistic action Canadians, brands, or governments should take (現実的な行動を1つ提案):", rows: 2, placeholder: "Brands should sign... / ブランドは安全協定に署名すべき..." },
        { type: "text", f: "responses.verdict_conseq", label: "4. Name ONE intended consequence AND ONE possible unintended consequence (意図した結果と、意図しない結果の2つ):", rows: 3, placeholder: "Intended (意図): ... Unintended (意図しない): ..." },
        { type: "commit", label: "COMMIT MY BROADCAST VERDICT (最終報告を提出)" }
      ],
      commitStation: true
    },

    /* ---------------- S7 CASE CLOSED ---------------- */
    {
      id: "s7", nav: "CASE CLOSED", navSub: "Aftermath & File (その後)", title: "Case Closed: Real-World Aftermath & Your File (調査完了)",
      kicker: "Debrief // Unlocked after commit", day: 6,
      locked: true,
      imgs: [{ src: "../TraceFile402/assets/s6_broadcast_desk.jpg", cap: "Broadcast complete. Compare with what happened after Rana Plaza. (調査完了)" }],
      chars: [
        { key: "elena", quote: "Great broadcast! Open Tab 3 (Your File) to review your entire log. (素晴らしい報告でした！タブ3で自分の記録を確認できます。)" }
      ],
      words: ["udhr (世界人権宣言 / 1948)", "charter (カナダ権利自由憲章 / 1982)", "veto (拒否権)"],
      tabLabels: { dispatch: "1. Aftermath (その後)", evidence: "2. Rights Recap (まとめ)", yourfile: "3. Your File (あなたの記録)", toolkit: "4. Next Up (次回)" },
      tabs: {
        dispatch: `<p><strong>What happened after the 2013 Rana Plaza collapse (ラナ・プラザ崩落後の変化):</strong></p>
<ul><li><strong>International Accord (国際安全協定):</strong> 200+ brands signed a legally binding safety agreement funding independent inspections.</li>
<li><strong>Canada's 2024 Supply Chains Act (Bill S-211 / カナダのサプライチェーン法):</strong> Large Canadian companies must publicly report how they prevent forced and child labour.</li>
<li><strong>Ongoing gap:</strong> Reporting laws still have weaker teeth than direct legal liability, and wages remain low.</li></ul>`,
        evidence: `<p><strong>Your Rights Toolkit (Country Profile Project用まとめ):</strong></p>
<ul><li><strong>UN (1945):</strong> 193 members. General Assembly (総会) = world opinion; Security Council (安保理) = binding power, 5 permanent members hold <strong>veto (拒否権)</strong>.</li>
<li><strong>UDHR (1948):</strong> 30 articles - global standard (pressure, not police).</li>
<li><strong>Canadian Charter (1982):</strong> Canada's highest law (s.2, s.7, s.15, s.1, s.33) - real courts.</li></ul>`,
        yourfile: "@review",
        toolkit: `<p><strong>Coming up next (今後の予定):</strong></p>
<ul><li><strong>Next class:</strong> <em>UN Security Council Veto Trap</em> simulation.</li>
<li><strong>Then:</strong> <a href="../Country-Profile-Project/index.html" style="color:var(--teal)">Country Profile Project</a> - investigate 1 of 39 countries using this exact UDHR + Charter lens!</li></ul>`
      },
      task: "Review Your File in Tab 3, then add one optional closing reflection.",
      fields: [
        { type: "text", f: "responses.selfcheck", label: "Optional: Which country or global human-rights issue do you want to investigate next? (任意: 次に調べたい国や人権問題は?)", rows: 2, placeholder: "I want to investigate...", optional: true }
      ]
    }
  ],

  key: [
    { st: "STOP 1", label: "Why subcontracting shields brands", f: "judgments.s1.choice", whyF: "judgments.s1.why", answer: "NorthStar can point to its clean Tier-1 audit and claim it never officially knew about Tier-2 (一次工場の監査記録を示して「二次工場は知らなかった」と言えるから)", note: "Plausible deniability (もっともらしい否認)" },
    { st: "STOP 2", label: "Most immediate physical danger", f: "judgments.s2.top", whyF: "judgments.s2.flags", answer: "The cracked concrete support pillar and padlocked fire exit (ひび割れた柱と南京錠で閉ざされた非常口)" },
    { st: "STOP 3", label: "UDHR: Locked exit & cracked pillar", f: "matches.udhr_safety", answer: "Article 3 (Life, liberty, and security of person / 生命と身体の安全)" },
    { st: "STOP 3", label: "UDHR: Silencing worker complaints", f: "matches.udhr_voice", answer: "Article 19 (Freedom of opinion and expression / 意見・表現の自由)" },
    { st: "STOP 3", label: "UDHR: $0.68/hr & 12-hr shifts", f: "matches.udhr_work", answer: "Articles 23 & 24 (Safe work, fair pay, reasonable hours / 公正な賃金・労働時間)" },
    { st: "STOP 3", label: "UDHR: 14-year-olds on floor", f: "matches.udhr_youth", answer: "Article 26 (Right to education / 教育を受ける権利)" },
    { st: "STOP 4", label: "Charter: Worker voice & unions", f: "judgments.s4.section", answer: "Section 2 (Fundamental freedoms: expression & association / 基本的自由)" },
    { st: "STOP 4", label: "UDHR vs. Charter difference", f: "judgments.s4.teeth", whyF: "judgments.s4.why", answer: "Canadian courts can enforce the Charter and strike down laws; the UDHR is a global standard with no police or court of its own (カナダ憲章は裁判所が強制執行できるが、UDHRは世界基準で警察や裁判所がない)" },
    { st: "STOP 5", label: "4-step enforcement gap chain", f: "responses.chain", order: { a: 1, b: 2, c: 3, d: 4 }, orderText: "1. Cheap rush order -> 2. Secret Tier-2 subcontracting -> 3. Enforcement gap -> 4. Media, accords, or laws force accountability" },
    { st: "STOP 5", label: "Strongest real-world pressure tool", f: "judgments.s5.tool", answer: "Legally binding safety accords and domestic laws that hold Western brands financially responsible (法的拘束力のある安全協定と、サプライチェーン責任を問う国内法)" }
  ],

  callbacks: {}
};

window.TRACE402 = TRACE402;
window.CASE55 = TRACE402;
