# GLM Testing Results — Sept 21, 2026 (evening session)

Pre-class verification of the student assignment pages before the Grade 8
classes (803, 802) run them tomorrow. Testing: live login (test account),
form render, autosave, cloud write verification, restore paths, and the
login "select your class" removal.

---

## Test accounts

| PIN | Behaviour |
|-----|-----------|
| `TST` | Demo/teacher override — valid for ANY name + ANY class, skips the roster |
| `WAU` / `DEV` / `MRW` | same demo behaviour |

Recipe used for 803: Class `803`, name anything (e.g. `TestRun`), PIN `TST`.
⚠️ Demo saves DO land in the real class ledger (identifiable: name `TestRun` /
`ZTest803`, task = the assignment, pin `TST`). There is no ledger delete
action in the GAS — rows are inert and get overwritten by the next TST save.

## Login change (tonight): "select your class" removed for students

- The server roster (V6.3 `resolve_student`) already resolves a student's
  homeroom from their 3-letter PIN — PINs are unique school-wide.
- **HL8 page (done tonight):** the CLASS dropdown is now hidden unless the
  typed PIN is a demo PIN (`TST/WAU/DEV/MRW`) — teacher tests still pick a
  class; kids never see it.
- `performLogin` passes an empty class for real kids; `validateStudent`
  ignores the passed class whenever the server confirms the PIN.
- **Not yet swept** (same dropdown still present, mechanical change, listed
  for next session): `24_HL9_Class2_Operation_Addictive_By_Design.html`,
  `HL9_Class1_10_Station_Audit_Template.html` (+ Unit 1 + Day1 copies),
  `18_Cit9_Real_Issues_Dossier.html` (both copies), both `_TEMPLATE_GAS_Assignment.html`.

## Findings

### F1 — CRITICAL, FIXED: form never rendered at all (HL8 + HL9 Class 2 + templates)
`renderPage()` crashed on `document.getElementById('claimClassSelect')` — an
element that no longer exists in the HTML (left over from an old "claim"
modal). The TypeError aborted the build before `#assignmentForm` was filled:
**zero form fields on the live deployed page.** This is why testing was
requested — the page would have been an empty shell for 803/802 tomorrow.
Fix: guard the optional element. Applied to HL8, HL9 Class 2
(`24_HL9_Class2_...`), and both `_TEMPLATE_GAS_Assignment.html` copies.
Verified: 60/60 fields + 3 section cards render after the fix.

### F2 — FIXED: saves filed under the wrong class
The save POST reads `className` from the top form's `metaSection` select,
which stayed on its default (`801`) after a login — a kid resolving to 803
would save into 801's ledger. Fix (HL8): after login, `metaSection` is forced
to the login-resolved homeroom, and `restoreFormData` no longer overwrites it
from stale saved `data.section`. Verified in captured POST: 803 login →
`"className":"803"`.

### F3 — ROOT-CAUSED: `get_class_progress` serves a cached read (minutes behind)

Probe (save marker `F3PROBE-1790019476842` at 19:38Z, then timed reads):

| read path | +0s | +3 min | +8 min |
|---|---|---|---|
| `action=login` (per-student load) | **HAS marker** | (transient GAS error page) | **HAS marker** |
| `action=get_class_progress&className=803` | no | no | **still no** |

Conclusion: **writes land instantly and are immediately readable via the
per-student `login` action** — the write path is healthy. The class-level
`get_class_progress` aggregate is served from a cache that runs minutes
behind (TTL unknown, ≥8 min observed). This is the root cause of tonight's
"Chelsea shows not-started" report and the opening slide's stale numbers.
(the +3 min transient error page is the usual Apps Script flake — retries cover it.)

**GAS-side fix (for the teacher, next time in the Apps Script editor):** in
the `get_class_progress` branch of `doGet`, find the CacheService use (the
pii-harden log added `skip-cache` to `resolve_student` for exactly this
reason) and honour the same bypass — e.g. `if (e.parameter.cache === '0')`
skip the cache lookup — then the opening slide can request fresh reads when
the teacher hits 🔄. Alternatively shorten that cache TTL to 30–60 s.

### F4 — resilience note (per teacher reminder)
Chromebooks keep `localStorage` drafts (`gas_draft_<slug>_<pin>`) — the page
restores them on login and offers draft recovery for anonymous work. So even
when a cloud save/refresh fails, student work is not lost locally; the
teacher's point: local storage is a real data layer in all of these tests
(restore tests must distinguish local-draft vs cloud restore).

## Test log (times ADT / UTC-3)

### HL9 Operation Addictive by Design (`HealthyLiving9/24_HL9_Class2_...`) — PASS
- 19:5x — Live page loads; **form renders (19+ fields pre-login, 0/24)** —
  this is the page that would have been blank before tonight's
  `claimClassSelect` crash guard.
- Login TST/901 ("AppTest") OK. Filled 3 fields → progress 0/24 → 3/24 ✓.
- Autosave → verified server-side via `action=login` read: stamp
  `ZTEST-APP 19:56:47` present ✓.
- Reload + re-login → restore verified: progress 3/24, stamp field back ✓.

### HL8 localStorage draft layer — PASS
- `gas_draft_…_systems_audit_TST` in localStorage, `savedAt` updates on every
  successful save (observed at the exact F3-probe save time). So even when a
  cloud round-trip fails, the Chromebook holds the latest work per PIN and
  re-offers it at next login (Restore & Sync banner / silent restore).
- Note: the draft/cloud restore merges the SAVED `data.section` back into the
  form's class field — after tonight's fix the login-resolved homeroom wins
  over it, so cross-class test residue can't misroute new saves.

### HL9 Sleep Clinic (`HealthyLiving9/HL9_Class1_10_Station_Audit_Template.html`) — PASS
- 19:4x — Live page loads (TASK_NAME matches ledger: "HL9 Sleep Clinic 10-Station Audit").
- Login TST/901 OK (demo fallback name "Teacher Demo" — page's name placeholder
  differs from HL8's, cosmetic).
- Filled stations 1–3 (hrs/risk/notes): progress counter 0/10 → 3/10 ✓.
- Autosave (4s debounce → `submit_profile`, no-cors) → **verified server-side**
  via `action=login` read: stamps + risk values present ✓.
- Reload + re-login → cloud restore verified: s1_hrs 6.5, s1_risk CRITICAL,
  s1_notes stamp, progress 3/10 ✓.
- Note: TST/901 row carries old smoke-test residue keys (`test`, `foo`) — inert.
- Note: autosave uses no-cors POST → invisible to network probes; verify via
  `action=login` reads (that's the authoritative per-student read).

- 15:0x — Live HL8 page loads; login modal OK; page advertises PIN TST.
- 15:1x — Login 803/TestRun/TST → OK ("Restored your cloud work" — prior
  smoke-test data exists for this pin).
- 15:2x — **F1 reproduced locally** (0 fields); root-caused `claimClassSelect`;
  guarded; 60 fields + 3 sections render; progress denominator 0/60.
- 15:5x — Dropdown removal implemented + reveal logic verified
  (hidden for real pins, shown for TST) + login OK.
- 16:0x — Fill field → autosave fires "✓ Saved!" but marker NOT in ledger
  (see F3). Manual Cloud Submit → `submitted_successfully` (V6.2.1), still
  not visible in per-class reads → F3 open.
- 16:1x — Class routing fix verified via captured POST (`"className":"803"`).

## Verdict for tomorrow (803 + 802)

| Page | Render | Login (no class pick for kids) | Autosave | Server write | Restore |
|---|---|---|---|---|---|
| HL8 5-Dimension Systems Audit | ✅ (after F1 fix) | ✅ | ✅ | ✅ accepted | ✅ |
| HL9 Sleep Clinic 10-Station Audit | ✅ | dropdown still present | ✅ | ✅ | ✅ |
| HL9 Operation Addictive by Design | ✅ (after F1 fix) | dropdown still present | ✅ | ✅ | ✅ |

**Ready for class**, with one caveat: the opening slide / dashboard progress
numbers lag real saves by a few minutes because the GAS caches
`get_class_progress` (F3). Kids' work is never lost — local drafts cover
failed round-trips, and the per-student read path (`action=login`) is
instant. Applying the F3 GAS snippet (skip-cache / shorter TTL) closes the gap.

## Left for a future session

1. Dropdown sweep on the remaining pages (HL9 ×3 copies, Cit9 dossier ×2,
   templates) — mechanical, same pattern as HL8.
2. GAS: honour `cache=0` / shorten TTL in the `get_class_progress` branch.
3. Ledger cleanup action in the GAS (no delete exists; TST rows are inert).

---

## Addendum (Sept 21, late night — dropdown sweep DONE + live V6.3.0 checks)

### Dropdown sweep — all 8 remaining files done (item 1 above: closed)

Same pattern as HL8: `loginClassRow` is hidden unless the typed PIN is a demo
pin (TST/WAU/DEV/MRW), `performLogin` passes an empty class for real kids, the
login-resolved homeroom forces the save class after login, and the restore
paths no longer overwrite the class from saved data.

- `HealthyLiving9/24_HL9_Class2_Operation_Addictive_By_Design.html`
- `HL9_Class1_10_Station_Audit_Template.html` ×3 (HealthyLiving9, `Unit 1 - Sleep`,
  Day1_Deliverables — the three were byte-identical; edited one, mirrored two)
- `18_Cit9_Real_Issues_Dossier.html` ×2 (Citizenship 9 + Student_System — drifted
  versions, edited separately)
- `_TEMPLATE_GAS_Assignment.html` ×2 (Student_System + templates — identical)

Two latent bugs found & fixed during the sweep (Cit9 dossier only):

- **Student_System copy:** `buildDossierPayload()` returned bare `name` / `pin` /
  `cls` identifiers that are not declared anywhere in that page → every save
  would have thrown ReferenceError and silently died. Now reads the login-owned
  fields (`docStudentName` / `authStudentPin` / `docStudentClass`), same as the
  older copy. This page would have crashed on first save — worth a quick live
  test before the Cit9 classes use it.
- **Citizenship 9 copy:** the restore block iterated `.options` on
  `docStudentClass`, which is a text *input* (no `.options`) → restore would
  crash mid-way. Block removed along with the class-restore fix.

Also note: on all pages the F2-style fix (login-resolved homeroom wins) now
matches HL8, so cross-class residue in old saved drafts can't misroute saves.

### Live GAS checks after the teacher's V6.3.0 paste (~22:00–22:30Z)

- `get_health` → `V6.3.0-2026-09-21` ✓ · `get_class_log` reads fine ✓
- `resolve_student` is live: `TST` → `demo:true, className:DEMO` ✓,
  bogus pin → `valid:false` ✓
- ⚠️ **`get_roster_meta` → `loaded:false`** — `ROSTER_PRIVATE` is NOT loaded
  server-side, so every real PIN returns `valid:false` and all pages are still
  running on the public-roster fallback (which still carries PINs). Push it via
  the gated `set_roster` action (payload lives on the private-data machine),
  then re-check `get_roster_meta` → `loaded:true`.
- ⚠️ **F3 NOT fixed by the deploy (yet):** fresh TST save to 803
  (marker `F3RETEST-1790028459`, ~22:27Z) is visible **instantly** via
  `action=login` but still absent from `get_class_progress&className=803`
  (+10 s and later). Saves also still answer "submitted_successfully
  (V6.2.1)". Combined with `deployedAt: 18:30Z` in get_health, the served
  script still looks like the earlier mixed variant — i.e. the repo Code.gs
  paste didn't take (not saved, or the deployment wasn't bumped to a new
  version). In the editor: confirm Code.gs is saved, then **Deploy → Manage
  deployments → ✏️ edit the existing Web app deployment → Version: New
  version → Deploy** (keeps the same URL — never create a new deployment),
  then re-run the marker probe. Once the repo copy is truly live,
  `get_class_progress` reads the sheet directly (no cache) and F3 + item 2
  above close together.

---

## Addendum 2 (Sept 21 night — full smoke tests: ALL PASS + 1 more Cit9 fix)

### Smoke test matrix (login → dropdown checks → fill marker → save → server
read-back → logout → re-login → cloud restore), run in a real browser over
localhost against the live GAS. Demo saves land in the real ledger as inert
TST rows (names `ZSmoke-Add`, `ZSmoke-Sleep`, `ZSmoke-Tmpl`, `ZSmoke-CitA`,
`ZSmoke-CitB`).

| Page | Dropdown hidden for kid pins / shown for TST | Login | Save → server | Logout wipe | Re-login restore |
|---|---|---|---|---|---|
| HL9 Op Addictive (24_HL9_Class2) | ✅ / ✅ | ✅ 902 | ✅ SMK-ADD marker + cert modal | ✅ | ✅ marker back, 1/24 |
| HL9 Sleep Clinic template | ✅ / ✅ | ✅ 902 | ✅ SMK-SLP marker | ✅ | ✅ marker back |
| _TEMPLATE_GAS_Assignment | ✅ / ✅ | ✅ 902 | ✅ SMK-TPL marker | ✅ | ✅ marker back |
| Cit9 dossier (Citizenship 9 copy) | ✅ / ✅ | ✅ 902 | ✅ SMK-CITA marker | ✅ (session clear + reload) | ✅ marker back |
| Cit9 dossier (Student_System copy) | ✅ / ✅ | ✅ 902 | ✅ SMK-CITB marker, className 902 | ✅ | ✅ marker back |

Byte-identical copies (Sleep ×2 mirrors, template mirror) inherit the PASS.

**New fix found by the smoke test (both Cit9 copies):** the demo-pin branch of
`performLogin` returned before the fieldset-unlock lines, so after a TST login
the whole `workFieldset` stayed `disabled` and the red gate banner stayed up —
a teacher demo could log in but couldn't type a thing (and couldn't have been
smoke-tested at all). Demo branch now unlocks the fieldset, hides the banner,
and enables the reset button, same as real logins.

Verdict: **all 8 swept files ready for class** on the page side. Server-side
caveats from Addendum 1 still stand (redeploy didn't take; ROSTER_PRIVATE not
loaded).

---

## Addendum 3 (Sept 21, very late — F3 CLOSED: the "stale cache" never existed)

**Correction to the original F3 section and to Addenda 1–2. The teacher's
V6.3.0 upload was live all along, and `get_class_progress` was never cached.
No 6.3.1 is needed.**

The real mechanism: **demo pins never write to class tabs.** `Code.gs` doPost
routes TST/WAU/DEV/MRW to the hidden `DEMO` tab regardless of the posted
className ("Demo PIN routing", ~line 925) — by design, so teacher test rows
can't pollute class ledgers. Every F3 probe used pin TST, so:

- `action=login` (same demo routing → DEMO tab) showed the marker instantly ✓
- `get_class_progress&className=803` reads tab `803` only → marker was
  *impossible* to see at any freshness ✗

Proof: `get_class_progress&className=DEMO` returns every probe marker
(`F3RETEST…`, `F3NEWURL…`, `SMK-ADD…`, `SMK-LO…`) the moment it is requested —
the read path is live. Corroboration: `get_health` on both deployment URLs
reports `version` AND `deployedAt` matching the repo's own constants
(`V6.3.0-2026-09-21` / `2026-09-21T18:30:00Z`) exactly. Both URLs serve the
repo's `Code.gs`.

What actually bit "Chelsea shows not-started": **F2** — the old class
dropdown left `metaSection` on its default, filing her work under the wrong
class tab while the slide read her real one. Fixed everywhere now (dropdown
removed for kids; login-resolved homeroom forces the save class; restore can't
overwrite it). Remaining lag sources are client-side only: the opening slide
re-reads every 3 min and on 🔄.

Teacher sanity check from the console: demo saves are visible via
`get_class_progress&className=DEMO`. Real student saves merge into their class
tab instantly — no redeploy or TTL work remains. Left-for-future item 2 is
closed (was never broken).

Standing server item (unchanged): `get_roster_meta` → `loaded:false`. Push
`ROSTER_PRIVATE` via the gated `set_roster` from the private-data machine;
until then pages validate kid PINs via the public-roster fallback (which
still carries PINs).

---

## Addendum 4 (Tier 2 pairing built + tested on Op Addictive)

`24_HL9_Class2_Operation_Addictive_By_Design.html` now does real
two-Chromebook pair work — split-section, merge-on-read, **no GAS changes**
(role/teamWith live in each kid's savedData; partner reads use the existing
`login` action):

- Role buttons are honest now: Solo (whole project) / I'm Partner 1 (Step 1 +
  Engines 1-2 + Pitch) / I'm Partner 2 (Engines 3-4 + Reflection). Step 1 is
  the TEAM CHOICE and Partner 1 owns it, so the two halves can't disagree.
- Co-Designer is now a PIN field: pairing validates the PIN (server roster /
  client fallback), rejects self/invalid, and shows a status chip.
- Once paired, the partner's sections render READ-ONLY on your page
  ("🤝 <Name>'s answers · synced Xs ago 🔄"), refreshed by a 60s poll +
  manual refresh button. Neither kid can type into the other's fields.
- Role + teamWith persist in savedData; survive reload/re-login. Both-same-role
  conflicts are flagged in the status chip.
- 📋 Copy for Docs assembles the WHOLE team dossier: your half + partner's
  synced half (tagged "by <name>").
- Two-tab live test (TST as Partner 1 ↔ WAU as Partner 2, DEMO tab): pairing,
  both-direction mirrors, team export, and reload-restore all PASS; server
  rows confirmed carrying `role` + `teamWith`.

Follow-up ideas (not built): HL9 dashboard grouping by teamWith; extending
pairing to the Sleep Clinic (it also says "work in pairs").

