# CentennialJP - Case 55 (Japanese version)

The Japanese-language build of **Case 55: The Centennial Outbreak**, the HL8
(Healthy Living 8) communicable-disease investigation simulation.

It is a complete sibling of `../Centennial/` - same structure, same engine, same
9 stations, same rubric. What changed is the language: the student-facing text
is in Japanese, with technical science vocabulary kept in English parentheses so
the student can still connect the words to their English science notes.

日本語版のページ: `/bihi2027/HealthyLiving8/Unit%202%20-%20Communicable%20Disease/CentennialJP/index.html`

## Files

| File | What it is |
|---|---|
| `index.html` | The simulation engine + Japanese UI. Same engine as the English build, with Japanese chrome and a Japanese-aware text-length gate (see below). |
| `case55_data.js` | All story content: station tabs, character quotes, choices, fields, glossary, and the answer key. This is the file you edit to change content. |
| `dashboard.html` | Teacher view. Reads submissions for the JP task from the Vault and scores them against the JP answer key. |
| `HL8_Centennial_Case55_Intro_Deck.html` | Projector walkthrough deck, in Japanese. |

**Images are not copied here.** The 20 exhibit images and 6 character portraits
live once in `../Centennial/assets/` and this build points at them with
`../Centennial/assets/...`. That is deliberate: the two versions can never show
different artwork, and the repo does not carry a second 40 MB of PNGs. If the
`Centennial` folder is ever moved or renamed, these relative paths break and
must be repointed.

## Two things to know before using it

### 1. The task name is different, on purpose

`meta.taskName` is **`HL8-Centennial-Case55-Sim-JP`**, not the English
`HL8-Centennial-Case55-Sim`.

The Vault keys each saved assignment on email + task name, so the Japanese
version writes to its own rows. A Japanese student working on the JP sim and an
English student working on the English sim never overwrite each other, and the
teacher dashboard can show one set or the other. The JP dashboard is filtered to
the JP task automatically because it reads the task name out of `case55_data.js`.

### 2. Japanese has no spaces, so the "justify your answer" gate had to be rebuilt

The engine measures a written answer with `wordCount()` and requires 4
"words" (3 for the Monday rules) before a station counts as done. A whitespace
split scores every Japanese sentence as **one** word, which would mean a
Japanese student could never finish a station, could never commit, and could
never reach the verdict.

The JP build replaces that with a character-based measure:

- Japanese characters (kana + kanji) are counted, **4 characters = 1 English
  word**.
- Real English words are still counted, so a bilingual answer works either way.
- The minimum stays 4 English-equivalent words, which is about **16 Japanese
  characters** for a justification and **12 characters** for a Monday rule.

The on-screen hint shows the same number the gate measures, in characters, so
the student never sees "words" for a Japanese answer.

The self-test asserts all of this. To run it, open the page with `?selftest=1`
on a non-school machine (the school host blocks the test mode).

## Fonts

`Noto Sans JP` was added to the Google Fonts link, and appended *after* the
existing Latin fonts in every font stack. Latin text (brand names, `SERVER OK`,
`Patient Zero`) keeps its Inter / Roboto Slab face; Japanese glyphs fall
through to Noto Sans JP. Read-aloud also asks for a `ja-JP` voice, so kanji is
not read by an English voice.

## Translation conventions

- Technical English is kept in parentheses on first use: アウトブレイク
  (outbreak), 媒介物 (fomite), 抗生物質 (antibiotic), ペニシリン (penicillin).
- School places: 西棟 / 東棟 / 北棟, 食堂, ホームルーム, 保健室.
- Characters keep their English names in the answer key because the key compares
  strings character for character. The student sees ジェイデン, ソフィ,
  マーカス, ナース・チェン, ブドロ先生, 副校長 プリヤ・ラマン.
- **No em dashes or en dashes** in any student-facing string (unit house rule).
  Japanese uses 「、」 and 「・」 instead.

## Verifying a change

1. Open `index.html?selftest=1` in Chrome. All 24 assertions must pass. They
   cover the 9 stations, the Japanese text-length gate, the Monday-justification
   gate, the order guard, the commit lock, and the JP answer key rendering.
2. Open the page normally and walk the week once. The review tab at the end
   shows the JP answer key next to the student's own answers.

## Rebuilding after the English sim moves

Both JP files are generated, so the two folders can be re-synced mechanically
instead of hand-patched:

```
python ../bihipri-27/tools-priv/build_centennial_jp_index.py \
    "../Centennial/index.html" "index.html"

python ../bihipri-27/tools-priv/build_centennial_jp_deck.py
```

The index script starts from a fresh English `index.html` and re-applies every
Japanese patch (106 of them, each asserted to apply exactly once). The deck
script translates the English deck by exact-string replacement, so CSS, JS,
classes and slide order stay byte-identical.

`case55_data.js` and `dashboard.html` are hand-edited, not generated. When the
English data file gains a field, port it by hand and keep the JP answer key
strings character-identical to the JP option strings.

## Relationship to the English build

Built from the English `Centennial` folder at commit `4de9aa8`. The English
sim is being extended in parallel (Nurse Chen coaching messages, `mustMatch`
number checks), so the two folders can drift. When the English engine gains a
feature, port it here rather than editing one side only: the JP `index.html`
is the English `index.html` plus the Japanese patches, and the JP
`case55_data.js` is the English `case55_data.js` translated.
