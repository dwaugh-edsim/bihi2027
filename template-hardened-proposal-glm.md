# Template Hardening Proposal — GLM review

**Author:** GLM (independent third review, after Gemini and MiniMax)
**Date:** 2026-09-20
**Scope:**
- `Student_System/templates/_TEMPLATE_GAS_Assignment.html` (identical copy at `Student_System/_TEMPLATE_GAS_Assignment.html`)
- `Student_System/templates/_TEMPLATE_Display_Dashboard.html` (same hack also in `templates/strongly_typed_display_template.html`)

**Backend contract verified against:** `api.js` (V6.0 client), `Code.gs` (V6.0.1 server, live).

This is the third independent review of the same problem. Where Gemini and MiniMax and I
agree, I say so in one line and don't re-derive it — read their docs for the full CSS and
step-by-step code. My value-add is **four findings the other two missed or got wrong**,
plus corrections to their proposed fixes that would themselves cause data loss.

---

## TL;DR

Confirmed: a fresh assignment page is fully editable with no login. Every keystroke goes to
`localStorage` under an anonymous `_draft` key that (a) the Chromebook wipes at logout and
(b) even the template's own recovery banner refuses to show (`templates/_TEMPLATE_GAS_Assignment.html:1418`
skips keys ending in `_draft`). The "Local Saved" pill confirms the kid's worst assumption.
All three reviews agree the fix is a hard login gate plus deleting the anonymous draft path.

But a login gate alone is **not enough**, because the template has two more loss paths that
only activate *after* login — and one of the proposed fixes (Gemini's "adopt on-screen work
on login") would make the worst one institutional:

1. **Cross-student contamination** — switching students never clears the form. Student B can
   inherit, autosave, and cloud-submit Student A's answers under B's PIN. *(Missed by both.)*
2. **Blind cloud-clobbers-local** — on login, cloud data overwrites the form unconditionally,
   even when the local draft is newer (typed during a Wi-Fi outage). One refresh during an
   internet blip eats the newest work. *(Missed by both.)*
3. **The gate must be real `disabled` attributes, not CSS.** Both prior proposals lock with
   `pointer-events: none` / blur — a student can still Tab to a field and type. *(Both wrong.)*
4. **The dashboard leaks real PINs on the projector** — the search box matches PINs and the
   dossier modal prints raw JSON that embeds each student's PIN. A kid can harvest a
   classmate's PIN from the front of the room and submit/overwrite as them. Also, the
   template contains a hardcoded real-student name/PIN hack (`'BEU'`/Blessing→Kossi) that is
   committed to a public GitHub Pages repo. *(Privacy angle raised by Gemini; the PIN-leak and
   repo-hygiene angle missed.)*

Also verified: **no server changes are required for any of this.** `Code.gs` already stores a
per-task server timestamp (`_tasks[taskName].updated`, Code.gs:943-948) — enough to build
newer-wins conflict resolution purely client-side.

---

## Part A — Assignment template findings

### A1. Anonymous editing trap — CRITICAL *(consensus: all three reviews)*

The chain, with evidence:

- Fields render enabled; `oninput="handleInput()"` everywhere (lines 930-945).
- `handleInput()` saves every keystroke to `localStorage` under `draftKey(pin)` where the
  not-logged-in pill `---` maps to the shared anonymous key `gas_draft_<SLUG>_draft`
  (lines 881, 1060-1075).
- The pill flips to `⚪ Local Saved (10:42:31)` (line 1070). To a 14-year-old that reads as
  "my work is safe." On these Chromebooks it is a countdown to deletion — `api.js` itself
  documents "CHROMEBOOK REALITY: localStorage is wiped on logout" (api.js:485-488).
- Cloud autosave silently no-ops without a PIN (lines 1079-1082), and so do the
  lid-close/visibility flushes (lines 1464-1478).
- The recovery banner scan explicitly skips `_draft` keys (line 1418), so the anonymous
  draft is unrecoverable even by the page that wrote it. Zero recovery paths, one green-ish
  reassurance light.

**Fix (consensus, restated for completeness):**
- Full-viewport login gate shown whenever no valid session; "Log in to start" opens the
  existing login modal. Closing the login modal without logging in re-shows the gate
  (MiniMax P1-3 — correct, keep it).
- Delete the anonymous restore branch at init (lines 1456-1461) and stop writing the
  `_draft` key entirely (gate makes it unreachable anyway).
- The gate does not need the network: `validateStudent()` runs against the local roster JS,
  and `loadCloudWorkForStudent()` already degrades gracefully offline. A dead Wi-Fi day
  still works after login; only cloud *restore* is unavailable.
- Teacher testing path survives: demo PINs TST/WAU/DEV/MRW pass the gate (api.js:130-138).
  Mention "Teacher testing: PIN TST" in the gate's small print.

### A2. Switch Student contaminates the next student — CRITICAL *(unique to this review)*

`performLogin()` → `loadCloudWorkForStudent()` (lines 1129-1143, 1204-1254) never clears the
form. Sequence that loses or corrupts real work:

1. Student A is logged in (or — pre-gate — A typed anonymously). A walks away; the tab,
   and its `sessionStorage` login, stays alive.
2. Student B sits down and clicks **🔑 Switch Student / Login**, logs in as B.
3. `loadCloudWorkForStudent` looks up B's local draft — B is new, there is none, so nothing
   is restored (lines 1207-1210 no-op).
4. B's cloud record is empty, so `targetData` is null and the function stops at
   `showToast('Ready! Local draft active for B.')` (line 1249).
5. **The form still displays A's answers.** Four seconds later the debounced autosave
   submits them, and B's Google Sheet row now contains A's work. When A logs back in on a
   different device, A's answers come back empty (B's row got a copy; A's own last save was
   whatever preceded the switch).

Note this survives the login gate — the gate only kills the *anonymous* variant. The
shared-cart tab-left-open variant is the everyday one.

**Fix — make identity changes atomic: flush → clear → adopt:**

```javascript
function isIdentityChange(newStudent) {
    const cur = (document.getElementById('authStudentPin')?.innerText || '').trim().toUpperCase();
    return cur && cur !== '---' && newStudent.pin.toUpperCase() !== cur;
}

async function performLogin() {
    /* ...existing validation... */
    const student = auth.student || { first_name: auth.name, pin: auth.pin, homeroom: cls };

    if (isIdentityChange(student)) {
        const curData = collectData();
        // Any edits on screen belong to the OUTGOING student — flush them under their PIN first.
        if (countCompleted(curData) > 0) await submitWork(false);   // cloud + draft under old pin
        clearFormData();                                            // then wipe every field
    }
    updateAuthDisplay(student);
    closeLoginModal();
    loadCloudWorkForStudent(student.homeroom || cls, student.pin, student.first_name);
}

function clearFormData() {
    document.getElementById('metaAuditors').value = '';
    document.getElementById('metaPartner').value = '';
    const d = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    document.getElementById('metaDate').value = d;
    document.getElementById('metaSection').value = String(ASSIGNMENT.defaultClass);
    for (const f of ALL_FIELDS) {
        if (f.type === 'chips') setChips(f.id, []);
        else { const el = document.getElementById(`f_${f.id}`); if (el) el.value = ''; }
    }
    updateProgress(collectData());
}
```

Because the form is empty when B's (empty) cloud record fails to restore, "Ready! Local
draft active" now means exactly what it says.

### A3. Login blindly lets cloud clobber newer local work — HIGH *(unique to this review)*

`loadCloudWorkForStudent` restores the local draft (lines 1207-1210), then overwrites it
with cloud data unconditionally (line 1234-1236) and stamps the cloud copy into
`localStorage`. There is no timestamp comparison anywhere.

Failure mode: student works through a Wi-Fi outage (debounced saves fail silently —
`submitWork`'s catch just flips the pill, lines 1302-1308), gets kicked offline mid-class,
refreshes or the tab reloads. Login returns the *old* cloud record, which overwrites the
newer on-device draft, which is then itself overwritten in `localStorage` (line 1236).
The newest work existed only locally and is now unrecoverable. `api.js` works very hard to
get data **to** the cloud (hashes, keepalive, no-cors, beacons); the template then throws
away newer local data on the way **back**.

**Fix — newer-wins using the server timestamp the backend already provides.** `Code.gs`
stores `mergedData._tasks[taskName] = { updated: now, summary, status, data }` (Code.gs:943-948),
and `login` returns the whole `savedData` blob — so `tObj.updated` is available at no cost:

```javascript
function draftSavedAt(data) { return Date.parse(data && data.savedAt) || 0; }

// inside loadCloudWorkForStudent, after targetData is resolved:
const cloudAt = Date.parse(tObj && tObj.updated) || 0;   // server clock, authoritative
const localObj = localDraft ? JSON.parse(localDraft) : null;
const localAt = draftSavedAt(localObj);

if (localAt > cloudAt + 30000 && countCompleted(localObj) > countCompleted(collectData())) {
    // Local is genuinely newer: keep it, push it up, don't let the cloud copy win.
    restoreFormData(localObj);
    showToast('Used the newer draft saved on this device.');
    submitWork(false);
    return;
}
restoreFormData(targetData);            // cloud newer (or tie): server wins
localStorage.setItem(draftKey(pin), JSON.stringify({ ...targetData, savedAt: new Date().toISOString() }));
```

…plus two small producers for `savedAt`:

- `handleInput()` and `submitWork()` success: store `{ ...data, savedAt: new Date().toISOString() }`.
- On a close tie (within 30s) or unparseable timestamps, cloud wins — server is source of
  truth, and the displaced local copy is at worst identical.

That closes A3 with zero `Code.gs` changes.

### A4. The gate must be real `disabled`, not CSS — implementation directive *(both prior proposals are bypassable)*

Gemini locks with `pointer-events: none` + blur; MiniMax with a `body.locked` CSS class.
Both leave the controls focusable: **Tab into a textarea and type — every keystroke works.**
Kids find this in under a minute ("the blur one? just press Tab"). A CSS lock is a
suggestion; the data-loss bug doesn't take suggestions.

**Fix — disable the controls for real, keep CSS only as decoration:**

- Wrap the editable region in `<fieldset id="workFieldset" disabled>` (style it
  `border:none; padding:0; margin:0; min-inline-size:0;` so the grid layout is unchanged).
  A single property flip arms/disarms every input, select, textarea, and chip button —
  disabled controls also drop out of Tab order.
- Leave the intro block and reference drawer outside the fieldset: students should be able
  to *read* the assignment while logging in.
- On unlock: `document.getElementById('workFieldset').disabled = false;`
- Keep the overlay/blur visual on top — it explains *why* to the student — but it is no
  longer load-bearing.

### A5. No logout; sessions inherit across students on a shared cart — HIGH

There is no way to log out, only "Switch Student". `sessionStorage` keeps the identity until
the tab dies, so on a cart Chromebook the next kid inherits the previous kid's identity
unless someone thinks to switch. Combined with A2 this is how wrong-name submissions happen
without any malice.

**Fix:**
- Add a **Log out** button (toolbar, next to Switch Student): clear the three
  `gas_<SLUG>_*` sessionStorage keys, `Session.clear()`, `clearFormData()`, re-disable the
  fieldset, show the gate.
- Optional (config flag, default off): idle auto-lock after N minutes — only if the teacher
  actually wants it; an unexpected mid-class lock would erode trust in the tool. The
  explicit button is the fix I'd ship.

### A6. Lid-close flush doesn't use the emergency beacon — HIGH *(consensus; Gemini and MiniMax agree)*

`pagehide`/`visibilitychange` call `async submitWork(false)` (lines 1464-1478). The primary
fetch does carry `keepalive: true` (api.js:449), which usually survives unload — but the
template never calls `StudentAPI.sendEmergencyBeacon()` (api.js:552-611), which exists
*precisely* for this and is fire-and-forget (`sendBeacon`, no response to await, hash-dedup
built in).

**Fix (accept Gemini's version):** dedicated `flushEmergencyBeacon()` that collects data,
builds the summary, and calls `sendEmergencyBeacon(ASSIGNMENT.taskName, data, summary, ASSIGNMENT.course)`;
wire it to `visibilitychange→hidden` and `pagehide`. Keep the debounced `submitWork` for
normal typing and the `online` handler.

### A7. Honest sync pill — HIGH *(consensus)*

Retire the `⚪ Local Saved (time)` string. Allowed states only (accept Gemini's
`updateSyncPill` implementation): `Cloud Synced (time)` / `Saving…` / `🔴 Offline — work
saved on device only, DO NOT close the lid` / `🔒 Not logged in`. The offline red state
matters most: offline-local is the one loss mode no code can fully prevent on these
devices, so it must at least be loud. Same for the JSON Backup button — it's the legitimate
escape hatch and deserves its toolbar spot (it already has one).

### A8. Reset is a one-click near-nuke — MEDIUM *(consensus; take MiniMax's variant)*

`resetForm()` needs one native `confirm()` (lines 1336-1341), removes only the current
PIN's draft, and reloads — the cloud copy survives and will silently restore on next login,
which will confuse the kid who "deleted" their work. Adopt MiniMax's version: Reset button
disabled until login; typed-PIN confirmation; keep it local-only but **say so** in the
dialog ("cloud copy is not deleted"). Disable it pre-login so it can't remove another
student's draft key on a shared device.

### A9. Recovery banner is arbitrary-order and pin-scraping — LOW

`foundDrafts[0]` (line 1427) is `localStorage` iteration order, not recency. With `savedAt`
stamps from A3, pick the max and say when it was saved ("Found work for A. MacPhee — saved
10:42"). Also worth adopting from A10: stop deriving auth state by scraping the
`authStudentPin` innerText for `'---'` in six places; one `state.student` variable with a
single `setAuthState()` that toggles gate, fieldset, Reset, and pill together. That
refactor is what makes A2/A3 safe to implement without missing a branch.

### A10. Roster-not-loaded is silent — MEDIUM *(applies to both templates)*

If `students_roster_data.js` 404s (exactly what happens when the header's copy-step-2 is
skipped or paths are wrong), the assignment shows "System Error: Official class roster not
loaded" only after a login attempt, and the dashboard renders zero students with no
explanation. Add a DOMContentLoaded banner when
`!(window.MASTER_ROSTER_DATA && window.MASTER_ROSTER_DATA.length)`: "⚠ Class roster failed
to load — check the `students_roster_data.js` `<script>` path." Cheap; kills the #1
"nothing works" support ticket.

### A11. Unsynced-work indicator — MEDIUM *(consensus: MiniMax P1-4, endorse)*

Failed debounced saves are currently invisible (pill flips for 2.8s, then normal typing
resumes). Add the persistent outbox pill: increment a counter on every failed/pending
cloud save, decrement on confirm, `online` forces a flush. Small, and it turns the
"silent Wi-Fi outage" scenario from A3/A7 into something the student can see and the
teacher can ask about ("does anyone have a ⚠ unsynced badge?").

---

## Part B — Display dashboard findings

### B1. The projector leaks usable PINs — HIGH *(privacy angle consensus w/ Gemini; PIN-leak mechanism unique)*

Two live leaks, and together they're worse than a privacy nit:

1. **Search matches PINs** (line 836): `s.pin.toLowerCase().includes(q)` — type two letters
   of a PIN and watch the grid narrow. Any student can read a classmate's PIN characters
   off the projector by bisecting the search box.
2. **Dossier modal prints raw submission JSON** (line 912): `<pre>${JSON.stringify(itemData)}</pre>`.
   The assignment payload embeds `pin` (`collectData()`, assignment template line 1009), so
   the full PIN is sitting in the modal output, along with `_requestId` and whatever else.

A harvested PIN + a name is a full login on any assignment page — the attacker can then
**submit or overwrite the victim's work**. This is a data-integrity hole, not just
etiquette. (The pages are public GitHub Pages; the "who would do that" defense failed the
day PIN lookup shipped on the login screen.)

**Fix:**
- Search: name only. Delete the PIN clause.
- Dossier: deep-scrub before display —

```javascript
function scrubForDisplay(obj) {
    if (Array.isArray(obj)) return obj.map(scrubForDisplay);
    if (obj && typeof obj === 'object') {
        const out = {};
        for (const [k, v] of Object.entries(obj)) {
            if (/^(pin|_requestId|email)$/i.test(k)) continue;
            out[k] = scrubForDisplay(v);
        }
        return out;
    }
    return obj;
}
```

  Show the scrubbed answers in readable label/value form (the teacher is the audience and
  legitimately wants content — Gemini's "field count only" version throws away too much),
  with the raw JSON available only behind an explicit "Details" expander, still scrubbed.

### B2. Hardcoded real-student hack in the template — HIGH *(unique to this review)*

`templates/_TEMPLATE_Display_Dashboard.html:744` (and `strongly_typed_display_template.html:744`):

```javascript
const fn = (pin === 'BEU' || s.first_name === 'Blessing') ? 'Kossi' : s.first_name;
```

This commits a real student's **actual PIN** (`BEU`) and name to a public repo, inside the
reusable template, so every future dashboard clone ships it. It violates the repo's own
convention (AGENTS.md: "Never commit real student data"), it's stale the moment the roster
changes, and it's exactly the kind of landmine a template must not contain. Delete the line;
render roster names as-is. If a one-off rename was ever genuinely needed, it belongs in a
per-deployment config override, not the template. Worth a roster-side check that `BEU` isn't
still an issued PIN.

### B3. taskName mismatch shows silent "Waiting" forever — MEDIUM *(Gemini saw it; wrong fix proposed)*

If `DASHBOARD_CONFIG.items[].id` doesn't exactly equal the assignment's `taskName`, the
sync matcher (lines 935-940) never fires and the student shows ⚪ Waiting despite having
submitted — which reads to the teacher as lost work. Real bug.

Gemini's fix is fuzzy `String.includes()` matching over `[id, taskName, label, short]` —
that trades silent negatives for silent false positives (`short: 'Survey'` matches a
`'Pre-Survey Reflection'` task; `item2` matches `item2-draft`). A dashboard that is
*confidently wrong* is worse than one that is visibly incomplete.

**Fix — deterministic aliasing plus visible orphans:**
- Allow an explicit alias per item: `{ id: 'survey', taskName: 'CIT9 Prior Course Survey', ... }`;
  match on `[id, taskName]` exact equality against `_tasks` keys (plus the existing
  `row.assignments` gradebook columns, exact match). Config stays honest, matching stays
  predictable.
- **Orphan detection:** after sync, collect each student's `_tasks` keys that matched no
  item and surface them in the dossier modal — "Also on file: CIT9 Rent Challenge (not in
  dashboard config)". The mismatch becomes visible on the projector instead of invisible
  in the Sheet. This converts the whole bug class from "data looks lost" to "config needs
  a line."

### B4. Sync failures are silent and staleness is invisible — MEDIUM *(consensus)*

`syncLiveCloud()`'s catch is `console.warn` (lines 948-950); on a projector that's a
no-op. Add: a "Last synced 10:42" stamp under the Sync button; a visible error banner on
failure with a retry; and the auto-poll toggle (Gemini's 45s version is fine — the stamp
matters more than the poll, because a poll that's been failing looks identical to fresh
data without it).

### B5. Teacher gate on the dashboard — MEDIUM *(consensus w/ MiniMax, with one note)*

MiniMax's sessionStorage-cached teacher-PIN gate is right. One addition: on failure, delay
and blur the input (or just a generic "Invalid PIN") so the projector isn't running a
3-letter-PIN brute-force oracle — the keyspace is 17,576 and a patient script could walk
it. Trivial to add, and it protects student rosters behind the gate too. The roster JS
loads before any gate currently, so also stub `window.MASTER_ROSTER_DATA = []` until
unlocked if we want the gate to be meaningful against View-Source; acceptable to just do
the input-throttle if that's overkill for Room 8's threat model — teacher's call.

### B6. `event` global in `switchModalTab` — LOW *(consensus w/ MiniMax P2-4)*

Pass the event/element explicitly. One-line fix, prevents a future delegated-handler
breakage.

---

## Where this review differs from the other two

| Topic | Gemini says | MiniMax says | GLM position |
|---|---|---|---|
| Locking the form | CSS `pointer-events` + blur | CSS `body.locked` class | **Both bypassable via Tab-focus.** Real `disabled` on a wrapping `<fieldset>`; CSS is decoration only (A4) |
| Work on screen at login | "Adopt on-screen work under the new PIN" | (not addressed) | **Wrong post-gate** — on-screen work belongs to the *previous* student. Flush under old PIN → clear → adopt new (A2) |
| Cloud vs local conflict | (not addressed) | (not addressed) | Newer-wins on `_tasks[taskName].updated` vs draft `savedAt`; no server change needed (A3) |
| Switch-student contamination | (not addressed) | (not addressed) | The biggest post-gate loss path; atomic flush→clear→adopt + explicit Log out (A2/A5) |
| beforeunload for anonymous work | (not addressed) | P0, warn on close | **Moot after the gate** — anonymous editing no longer exists. Skip the nag; the beacon + outbox cover the logged-in case |
| Dashboard task matching | Fuzzy `includes()` matching | (not addressed) | Deterministic `[id, taskName]` alias + visible "unmatched submissions" panel; fuzzy matching false-positives (B3) |
| Dossier modal content | Hide content, show field counts | (not addressed) | Show PIN-scrubbed answers (teacher audience), raw JSON behind expander (B1) |
| Dashboard PIN exposure | Privacy framing | P2, low | **High** — search-by-PIN + JSON-embedded PINs enable account takeover/overwrites (B1) |
| Dashboard teacher gate | (not addressed) | P2, simple gate | Endorse + throttle failed attempts (17k keyspace) (B5) |
| Reset guard | Type "RESET" prompt | Disabled-until-login + type your PIN | MiniMax's (PIN-typed, disabled pre-login, "cloud copy not deleted" wording) (A8) |

---

## Build order

**P0 — before any student touches a cloned assignment (~half a day)**
1. Login gate with real `<fieldset disabled>` + re-showing gate on modal close (A1, A4)
2. Delete anonymous draft write/restore paths (A1)
3. `performLogin`: flush→clear→adopt on identity change (A2) + `clearFormData()`
4. Newer-wins restore with `savedAt` / `tObj.updated` (A3)
5. Honest sync pill incl. red offline state (A7)
6. Beacon-based `pagehide`/`visibilitychange` flush (A6)

**P1 — same week**
7. Log out button (A5)
8. Reset: disabled-until-login + typed-PIN + "cloud copy not deleted" wording (A8)
9. Outbox/unsynced pill (A11)
10. Dashboard: remove PIN from search; scrub dossier output (B1); delete BEU/Kossi line from both display templates (B2)
11. Roster-not-loaded banner in both templates (A10)

**P2 — when convenient**
12. Recovery banner newest-first with saved time (A9); auth-state refactor to single `state.student` (A9)
13. Dashboard: taskName alias field + unmatched-submissions panel (B3); last-synced stamp + auto-poll + visible errors (B4); teacher gate with attempt throttle (B5); `event` global (B6)

**Retrofit map (the template fix alone reaches nobody):** the `gas_draft` engine is live in
`HL8_Prior_Course_Diagnostic.html`, `HL9_Prior_Course_Diagnostic.html`, and the template.
`CIT9_Current_Issues_Diagnostic.html`, `07_Prior_Course_Diagnostic_Interactive.html`,
`Places_Of_Significance_Studio.html`, and `HL9_Human_Skills_Advisor.html` call
`submitProfile` with their own page logic and need the gate retrofitted individually —
including the two CIT9 files currently in progress in the working tree
(`18_Cit9_Real_Issues_Dossier.html`, `Places_Of_Significance_Studio.html`), which should
adopt the gate *before* their next deployment, not after. Cleanest path: land P0 in the
template, then re-clone the live pages from it (their config blocks port over 1:1) rather
than patching each by hand.

**Repo hygiene:** `_TEMPLATE_GAS_Assignment.html` exists identically in `Student_System/`
and `Student_System/templates/` — pick `templates/` as canonical and make the other a
pointer or delete it, or every future hardening lands twice (this review's diff-check found
them identical *today*, which won't last).

---

## Validation checklist (clean Chrome profile, then a real cart Chromebook)

| # | Step | Expected |
|---|---|---|
| 1 | Open assignment, don't log in | Gate up; **Tab-key into fields types nothing**; Reset disabled; intro/reference still readable |
| 2 | Close login modal with ✕ | Gate re-appears; never an editable anonymous state |
| 3 | Log in with wrong PIN / right PIN | Wrong: toast + gate stays. Right: fieldset unlocks, cloud work loads, pill goes 🟢 |
| 4 | Log in as A, type, then Switch Student to B (B has no saved work) | A's work flushed under A's PIN; form is **blank** for B; no A content ever saves under B |
| 5 | As B, type, disconnect Wi-Fi (pill goes 🔴 offline), refresh | Local draft (newer) survives; no cloud clobber; reconnect → flushes, pill 🟢 |
| 6 | As B, type, close lid / kill tab, reopen, log in | Beacon flushed the last keystrokes pre-close; cloud restore matches |
| 7 | Reset while logged in | Requires typing PIN; reloads blank; next login restores cloud copy (dialog said it would) |
| 8 | Log out | Gate returns; Tab-typing impossible; next student must log in |
| 9 | Dashboard: search a known PIN | No result from PIN text; names still filter |
| 10 | Dashboard: open dossier | No `pin`/`_requestId`/`email` anywhere in output; answers readable |
| 11 | Dashboard: sync with Wi-Fi cut | Visible error banner; "Last synced" stamp stops advancing |
| 12 | Dashboard config: set one item's id to a non-existent task | Student shows Waiting **and** dossier lists the orphan task under "not in dashboard config" |
| 13 | Template copy with wrong roster `<script>` path | Both pages show the roster-failed banner instead of silently empty UI |

## Residual risk (say it out loud)

After all of this, one loss mode remains physically unfixable in-browser: a student who
works **offline, logged in**, and then closes the lid *before any successful save* — beacon
and debounced saves both need one network touch. The mitigations are the red offline pill,
the outbox badge, the JSON Backup button, and the teacher asking "check your pill" before
the bell. Everything else above eliminates its failure class entirely.
