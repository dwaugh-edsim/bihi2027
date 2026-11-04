# CentennialJP - Case 55 (English main + Japanese support)

The bilingual build of **Case 55: The Centennial Outbreak**, the HL8
(Healthy Living 8) communicable-disease investigation simulation.

**2026-11 policy (Dave):** the page flipped from 100% Japanese to roughly
60% English / 40% Japanese. **English is the primary language everywhere.**
Japanese survives only as support: a smaller, muted gloss line under the
English title, character quotes and roles, image captions, task prompt, tab
paragraphs, list items, and word-bank definitions. Students read English and
**answer in English** - the Japanese-aware text gate and the Japanese keyword
checks from the old all-Japanese build are gone.

日本語版のページ: `/bihi2027/HealthyLiving8/Unit%202%20-%20Communicable%20Disease/CentennialJP/index.html`

## Files

| File | What it is |
|---|---|
| `index.html` | The English simulation engine + the Japanese gloss layer. Generated; do not hand-edit. |
| `case55_data.js` | The English story content, regenerated from `../Centennial/case55_data.js` with exactly two mechanical changes (see below). Generated; do not hand-edit - edit the English file and rebuild. |
| `case55_data_ja.js` | The old Japanese translation, now declaring `window.CASE55_JA`. It is ONLY a gloss source: the renderer looks up the same data paths in it and inserts support lines. Edit it only to fix Japanese wording. |
| *(in private repo)* | Teacher dashboard: `bihipri-27/HealthyLiving8-priv/Unit 2 - Communicable Disease/CentennialJP/dashboard.html` (still shows Japanese labels next to student answers). |
| `HL8_Centennial_Case55_Intro_Deck.html` | Projector walkthrough deck - **still 100% Japanese**; it has not been flipped yet. |

**Images are not copied here.** All artwork lives once in `../Centennial/assets/`.

## How the gloss layer works

`index.html` is the English engine plus a small renderer: after each station
or tab renders, it parses the Japanese tab HTML at the same station/tab path,
pairs top-level blocks by tag (P/H*/LI/BLOCKQUOTE, list items pairwise,
containers recursively), and appends a `<div class="ja-gloss">` line under
each English block. Character quotes, roles, image captions, the task prompt
(`#taskPromptJa`) and word-bank definitions gloss the same way, from the
parallel data paths.

Drift is fail-safe: if a Japanese block is missing or the tag sequence no
longer matches, that gloss silently disappears - the page never shows wrong
or orphaned Japanese. `verify_centennial_jp.py` flags the drift so it gets
fixed at the source.

## The two mechanical changes in case55_data.js

1. Every asset path is repointed `assets/` -> `../Centennial/assets/`.
2. `meta.taskName` stays **`HL8-Centennial-Case55-Sim-JP`** (the English file
   says `...-Sim`). The Vault keys saved assignments on email + task name, so
   JP-folder students keep their own server rows and the private dashboard
   can filter to them. **Do not change this** - existing saved work would
   orphan.

Otherwise the file is byte-identical to the English data, and the verifier
asserts exactly that, so content can never drift between the two folders.
Edit content in `../Centennial/case55_data.js` only, then rebuild.

## Rebuilding after the English sim changes

```
python ../bihipri-27/tools-priv/build_centennial_jp_index.py
python ../bihipri-27/tools-priv/verify_centennial_jp.py
```

The index script starts from a fresh English `index.html`, applies every
patch (each asserted to apply exactly once), regenerates `case55_data.js`
from the English data, and converts the declaration in `case55_data_ja.js`.
It is idempotent.

Bump `?v=` on both script tags (patch 9-ish in the build script) when the
data files change, so Chromebooks pick up the new content.

## Verifying a change

1. Open `index.html?selftest=1` on a non-school machine (the school host
   blocks test mode). All assertions must pass, including "Japanese support
   gloss rendered at least one line".
2. Run `python ../bihipri-27/tools-priv/verify_centennial_jp.py`.
3. Open the page normally and click through a station: every English prose
   block should have a muted Japanese line under it.

## Fonts and text rules

`Noto Sans JP` sits after the Latin fonts in every font stack, so English
keeps Inter / Roboto Slab and Japanese glosses fall through to Noto Sans JP.
House rules that still hold: **no em dashes or en dashes** in any
student-facing string, and no Simplified-Chinese characters in the Japanese
(the verifier checks both).

## The intro deck

`HL8_Centennial_Case55_Intro_Deck.html` is still the 100% Japanese deck from
the old build and does NOT match the English option strings the sim now
offers. Rebuild or retire it before next classroom use - the verifier warns
about it. The old deck build script (`build_centennial_jp_deck.py`) still
translates the English deck by exact-string replacement if a full-JP deck is
ever wanted again.

## History

The original all-Japanese build (Japanese chrome, Japanese character-count
gate, Japanese keyword checks, 157-patch build) is in git history before the
2026-11 bilingual flip. Restore it from there if a class ever needs a
full-Japanese sim again.
