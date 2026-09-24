# bihipri-27 â€” Private Repo Migration Checklist

**Created:** 2026-09-23
**Purpose:** As part of splitting `bihi2027` (public) from `bihipri-27` (private), here's what should live where, what needs `git rm` from the public repo, and what needs git-history scrubbing.

---

## TL;DR

The public `bihi2027` repo should hold:
- Student-facing assignment pages (`Citizenship 9/`, `HealthyLiving8/`, `HealthyLiving9/`)
- Sanitized rosters (first-name + last-initial)
- The Google-auth pipe (`Student_System/Room8v2/`, `Student_System/GoogleAuth/`)
- Generic teaching utilities that don't reference specific students

Everything else â€” full class lists, agent coordination, audit reports, full-ledger JSON, planning docs â€” should move to `bihipri-27`.

**Two distinct operations are needed:**
1. **`git mv` (or copy + git rm)** for files that should keep their history in bihipri-27 but be removed from bihi2027's working tree
2. **`git filter-repo`** for files whose content is now sanitized in working tree but still leaks the original data in git history (this is the heavy hammer â€” coordinate with all clone-holders first)

---

## Already sanitized in working tree (history still leaks)

These were edited to remove student PII from the current file, but `git log` still shows the originals. Run `git filter-repo` on the listed paths once bihipri-27 is set up to receive the originals.

| Path | What was sanitized | History action |
|---|---|---|
| `data/sheets/sheet_801.csv` â€¦ `sheet_903.csv` | Dropped `GNSPES Email` column + redacted 271 emails embedded in JSON submission data (408 emails total gone) | `git filter-repo --path data/sheets/` |
| `sub_folder/SUB_FOLDER_CLASS_LISTS.md` | 218 student names â†’ first-name + last-initial; in-text refs ("Daya Modayur" etc.) sanitized | `git filter-repo --path sub_folder/SUB_FOLDER_CLASS_LISTS.md` |
| `sub_folder/sub_folder_class_lists.html` | Same 218 student names sanitized in JS data structure | `git filter-repo --path sub_folder/sub_folder_class_lists.html` |
| `Homeroom_902/902_Class_Clipboard_10Day_Cycle.html` | Names were already first-name + last-initial (no PII change needed) | No history action |
| `Homeroom_902/902_Friday_Master_Slide_Deck.html` | 27-student roster sanitized to first-name + last-initial | `git filter-repo --path Homeroom_902/902_Friday_Master_Slide_Deck.html` |
| `Homeroom_902/902_Today_Schedule_Deck.html` | No student data; clean | No history action |
| `AGENTS.md` | 6 G9 student names (in line 31-34 entry) â†’ first-name + last-initial | `git filter-repo --path AGENTS.md` |
| `Student_System/piiiharden.md` | "Zana Shala" code example + 6 G9 student names â†’ sanitized | `git filter-repo --path Student_System/piiiharden.md` |
| `tools/backfill_g9_emails.ps1` | Comment with full name example â†’ generic "Firstname vs full hyphenated name" | Optional (comment only) |

---

## Should be removed from bihi2027 entirely (move to bihipri-27)

These were replaced with a redaction placeholder, not sanitized. Move the original files to bihipri-27, then `git rm` from bihi2027. The redaction notes in each file already explain why.

| Path | What was there | Action |
|---|---|---|
| `audit/ledger_801.json` â€¦ `audit/ledger_903.json` | 7 per-class student ledgers (each ~70-310KB) â€” full names, @gnspes.ca emails, 3-letter PINs, submission data. Should never have been committed. | `git rm audit/ledger_*.json`, `git filter-repo --path audit/` |

> **The data is preserved in `Private_Student_Data/backup-2026-09-22/{HR}-{CIT,HL}.json`** (gitignored, properly private). The audit/ledgers were duplicates of that data, accidentally committed during an evaluation process.

---

## Whole folders that should move to bihipri-27 (no sanitization needed)

These are agent-coordination / planning docs that never belonged in a public repo. `git mv` them to bihipri-27.

| Path | Why move | Notes |
|---|---|---|
| `audit/*.md` (10 files) | Agent behavior audits, code-architecture reviews, planning candidate plans. Not student-facing. | Move as-is; the only PII leakage in this folder was the `ledger_*.json` files (now redacted). MD files mostly clean. |
| `system-maintenance/` (5 files) | Agent delegation docs, hardening proposals. | Move as-is. |
| `tools/_*.ps1` (my diagnostic scripts) | Created today by Mavis to find leaks. | Either move to bihipri-27 (so future agents can re-run them) or delete â€” they're session artifacts, not durable tools. |
| `tools/clean_map.py`, `tools/clean_roster_homerooms.py`, `tools/plot_ns_pins.py`, etc. | Working scripts that may reference student data. | Move to bihipri-27; or sanitize in place if they're genuinely useful. |
| `curriculum-planning/` | Teacher-only planning docs. | Move to bihipri-27; or to a more secure location (these are planning-grade, not student-facing). |
| `inbox/` | Already gitignored, not tracked. | No action needed. |
| `html5-templates/` (375 files, vendored templates) | Low risk (just HTML/CSS themes). Could stay public or move. | Your call â€” leaving public means GitHub Pages can serve them; moving means cleaner repo. |

---

## What stays in bihi2027 (public, by design)

| Path | Why |
|---|---|
| `Citizenship 9/` | Student-facing assignment pages â€” the whole reason this repo is public (GitHub Pages serves them). |
| `HealthyLiving8/`, `HealthyLiving9/` | Same. |
| `Student_System/Room8v2/` | New v2 backend (identity, auto-section, autosave). Apps Script files. No per-student data in the working tree. |
| `Student_System/GoogleAuth/` | Identity + Vault apps script. Gitignored `Private_Student_Data/` holds the actual student-side state. |
| `Student_System/*.html` dashboards | These are the teacher's grading views. **Verify** they don't leak student data through their embedded JS data files (e.g., `cit9_dashboard_data.js`, `places_brainstorm_data.js`). I did not have time to audit these â€” they're a separate sweep. |
| `progress-redesign-preview.html`, `Class_Opening_Slide.html` | Already gitignored, not tracked. |
| `tools/download_sheets.py`, `find_*_gids.py`, `extract_all_gids.py`, `build_class_log_meetings.py`, `add_assignment_feedback_field.py` | Generic GAS utilities. Safe to stay public. |
| `tools/backfill_g9_emails.ps1` | Now sanitized (no full names in comments). Safe to stay public for the G8 run later. |

---

## Suggested bihipri-27 structure

```
bihipri-27/
â”œâ”€â”€ README.md                       (purpose, access, what lives here)
â”œâ”€â”€ AGENTS.md                       (mirror of public's, plus private-state notes)
â”œâ”€â”€ piiiharden.md                   (full, un-sanitized coordination log)
â”œâ”€â”€ Private_Student_Data/           (mirror of bihi2027's, properly private)
â”‚   â”œâ”€â”€ roster_full.json            (already there â€” 77 G9 emails + remaining 6 to fill)
â”‚   â”œâ”€â”€ roster_gas_payload.json
â”‚   â”œâ”€â”€ backup-2026-09-22/          (canonical pre-V6.3.4 snapshot)
â”‚   â””â”€â”€ ...
â”œâ”€â”€ audit/
â”‚   â”œâ”€â”€ ledger_801.json â€¦ ledger_903.json   (full, un-redacted)
â”‚   â”œâ”€â”€ Room8v2eval.md
â”‚   â”œâ”€â”€ finalplan-claude.md
â”‚   â”œâ”€â”€ plan-of-action-candidate1-*.md
â”‚   â”œâ”€â”€ GAS-audit-*.md
â”‚   â”œâ”€â”€ template-hardened-proposal-*.md
â”‚   â””â”€â”€ glm-testingresult-Sept21.md
â”œâ”€â”€ system-maintenance/             (delegation, resiliency docs)
â”œâ”€â”€ curriculum-planning/            (assessment weights, launch plans)
â”œâ”€â”€ sub_folder/                     (full, un-sanitized substitute teacher package)
â”œâ”€â”€ Homeroom_902/                   (full slide decks if you want them; sanitized ones can stay public)
â””â”€â”€ tools/
    â”œâ”€â”€ _*.ps1                      (diagnostic scripts)
    â”œâ”€â”€ clean_map.py, plot_ns_pins.py, etc.
    â””â”€â”€ mark_sleep_clinic.py, marks_md.py
```

---

## Operations checklist for you

```bash
# 1. Create bihipri-27 on GitHub (private, same account)
gh repo create bihipri-27 --private --source=. --remote=bihipri-27 --push

# 2. Move folders/files to bihipri-27 (one big push)
git remote add bihipri-27 git@github.com:dwaugh-edsim/bihipri-27.git
git push bihipri-27 --all

# On bihipri-27's side:
git checkout main
git rm -r audit/ledger_*.json          # remove redacted placeholders
# (Pull fresh copies from Private_Student_Data/backup-2026-09-22/)

# 3. From bihi2027, scrub the historical leaks
git filter-repo --path data/sheets/ --invert-paths
git filter-repo --path sub_folder/SUB_FOLDER_CLASS_LISTS.md --invert-paths
git filter-repo --path sub_folder/sub_folder_class_lists.html --invert-paths
git filter-repo --path Homeroom_902/902_Friday_Master_Slide_Deck.html --invert-paths
git filter-repo --path AGENTS.md --invert-paths
git filter-repo --path Student_System/piiiharden.md --invert-paths
git filter-repo --path audit/ --invert-paths    # entire audit/ folder

# 4. Force-push and notify any clones
git remote add origin git@github.com:dwaugh-edsim/bihi2027.git   # if not set
git push --force-with-lease
# Anyone with a stale clone must re-clone.
```

**Important:** the `git filter-repo` calls rewrite every commit's history. Any local clones will diverge from origin. Coordinate with both the home and school harnesses (per `AGENTS.md`'s "Two-machine reality" section) before force-pushing.

---

## Outstanding risks

These I didn't have time to fully audit â€” flagged for the next sweep:

- **`Student_System/cit9_dashboard_data.js`** and similar: dashboard data files may contain student names. Earlier grep was inconclusive (some matched, some didn't depending on which lists I searched against).
- **`Day1_Deliverables/`**: not audited this session. Grep saw "00_Homeroom_902_Day1_Checklist.html" match "902" patterns but I didn't open it.
- **`tools/check_maps.py`, `tools/check_sheet.py`, `tools/find_gids.py`**: working scripts; could contain student IDs/PNs in their config or hard-coded paths.

Recommend a second audit pass before you flip the repo to truly public-facing only.