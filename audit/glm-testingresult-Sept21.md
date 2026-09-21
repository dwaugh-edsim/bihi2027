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

## Open questions / next steps

1. F3: unique-marker save + timed re-reads; if reads never update, escalate —
   it would mean `submit_profile` and `get_class_progress` touch different
   stores (GAS source needed).
2. Sweep the class-dropdown removal across the remaining assignment pages.
3. Verify HL9 Sleep Clinic + HL9 Operation Addictive By Design end-to-end
   (same method).
4. Optional UX: "ledger updated X min ago" already shipped on the opening
   slide; consider the same for assignment pages.
