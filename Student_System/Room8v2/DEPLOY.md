# Deploying Room 8 v2

## One-time setup

### 1. The sheet
Create a new Google Sheet named **"Room 8 v2 — Master"**. Keep it separate from the old
Master Sheet — v2 is a parallel system.

### 2. The backend
- In the sheet: **Extensions → Apps Script**.
- Paste `backend.gs` over the default `Code.gs`.
- **Project Settings → Script Properties**, add:
  - `R8_IDENTITY_KEY` — a long random string. **Must be identical** to the same property
    in the Identity project, or every request fails with `bad_sig`.
  - `CLASS_LOG_PIN` — the teacher PIN. Gates every teacher write/read (fail-closed: if the
    property is unset, teacher actions refuse to run).
  - `LEGACY_SHEET_ID` — *(optional, for migration)* the old Master Sheet's spreadsheet ID
    (the long string in its URL between `/d/` and `/edit`). Required only for
    `bootstrap_roster_from_legacy` / `migrate_legacy_submissions`.
- Run **`setup()`** once from the editor (creates the six tabs).
- **Deploy → New deployment → Web app**:
  - **Execute as: Me**
  - **Who has access: Anyone**
- Copy the `/exec` URL.

### 3. The Identity app
Already deployed (see `../GoogleAuth/no_gcp/`). v2 reuses it unchanged.

### 4. Pages
Assignment pages live on GitHub Pages like every other page. Each one sets two constants
at the top: `IDENTITY_URL` and `BACKEND_URL`.

## The deploy-drift rule

**Saving a file changes nothing.** The `/exec` URL serves the *version* it was deployed
with. After every edit:

> **Deploy → Manage deployments → pencil → Version: New version → Deploy** (same URL).

The tell: every response carries a `version` string. Probe
`<backend>/?action=get_health` in an **incognito** window and read it.

## Troubleshooting — every Google error we've hit

| What you see | What it means | Fix |
|---|---|---|
| `{"version":"GA-0.1.0"}` / "Room 8 New Assignments backend" | You're talking to the **obsolete OAuth** app (`../GoogleAuth/_obsolete_oauth/`) — wrong file pasted, or wrong URL | Re-paste `backend.gs` / use the v2 `/exec` URL |
| **404 "Page Not Found — file does not exist"** | The **deployment ID itself is dead or unpublished** — or access is still *Only myself*, which Google hides behind this same page | **Deploy → New deployment** (don't edit), *Me* + *Anyone*, then copy the **Active** row's URL |
| **403 "Access Denied — You need access"** | The app exists but **Who has access** excludes the caller | Manage deployments → edit → *Anyone* → **Deploy** |
| Redirect to `gnspes.ca` ServiceLogin | The app is **domain-restricted** (*Anyone within GNSPES/SEPNE*) | For the Backend and Identity, use *Anyone* — the code enforces the domain and gives a friendlier switch-account page |
| Healthy JSON signed-in, 404 incognito | Access change was made in the dialog but **Deploy was never clicked** | Finish the deploy (new version) |
| `405` / placeholder URL in console errors | The **browser cached an old page** | Hard-refresh (Ctrl+Shift+R) |
| `bad_sig` on save | `R8_IDENTITY_KEY` differs between Identity and Backend (or is unset in one) | Make both properties identical |
| `missing_vault_url` | (pilot only) Identity app's `R8_VAULT_URL` unset | Set it to the Vault `/exec` URL |
| Bounce page shows as raw text | Old build served HTML through `ContentService` (no HTML mime type) | Redeploy `identity.gs` ≥ R8-ID-0.4.0 |

## Migrating from the old system (teacher data + prior work)

Both actions are teacher-PIN-gated and **dry-run by default** — nothing writes until you
post the same call with `dryRun:false`.

```bash
# 1. Seed the Roster (email -> name/homeroom/grade) from the old class tabs.
#    Review the preview + the studentsWithoutEmail list before committing.
curl -sL -X POST -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"action":"bootstrap_roster_from_legacy","teacherPin":"<PIN>","dryRun":true}' \
  "<BACKEND_URL>"

# 2. Copy prior work for specific assignments (HMAC shapes are converted automatically;
#    students without an email on file are reported, never guessed).
curl -sL -X POST -H "Content-Type: text/plain;charset=utf-8" \
  -d '{"action":"migrate_legacy_submissions","teacherPin":"<PIN>","dryRun":true,
       "tasks":[{"name":"HL9 Operation Addictive by Design (Class 2)","course":"HL9"},
                {"name":"Citizenship 9 — Real Issues Case File #1: The Rent We Pay","course":"CIT9"}]}' \
  "<BACKEND_URL>"
```

Matching rule: the old system keys students by **PIN**, v2 by **verified email**; the
bridge is the email column of the old class tabs (~80% coverage). Rows without an email
are **reported, never guessed** — when that student eventually signs in with Google, add
them to the roster and re-run the migration for their task.

## Teacher feedback + the GAS Station (R8-BE-0.5.0)

New backend actions (all PIN-gated): `get_overview` (classes/tasks with counts), `get_feedback`
(list, optional `section`/`task` filter), `set_feedback` (`{email, task, feedback}` — append-only
to the **Feedback** tab; latest row per student+task wins; empty text = clear). `load_assignment`,
`get_my_tasks` and `get_task_progress` now carry the student's latest feedback so the assignment
engine can show it.

**To deploy:** paste `backend.gs` into the v2 sheet's Apps Script → **Manage deployments →
edit → New version → Deploy** (same URL). The Feedback tab is created automatically on the
first call — no manual `setup()` needed.

**The Station:** open `gas_station.html` (or its Pages URL) → enter the teacher PIN → pick
class + assignment → click a student → read their saved answers → write feedback → **Save**.
The student sees the feedback card the next time they load that assignment. The PIN lives in
the tab's sessionStorage only — never in the file, never in git.

## Deleting dead deployments

**Manage deployments** can hold several rows; only the **Active** one answers, and the
others keep URLs that 404. Archive/delete anything that isn't Active — stale URLs have
cost more debugging time than any code bug in this project.

## The two URL families (don't mix them up)

| URL | App |
|---|---|
| `…/macros/s/<deploymentId>/exec` | A **web app** — this is what pages call |
| `…/a/macros/<domain>/s/<deploymentId>/exec` | Same, as seen for domain-restricted deployments |
| `…/macros/library/d/<scriptId>/<ver>` | The **library page** — never a web app URL |
| `…/macros/d/<scriptId>/edit` | The **editor** |

The `version` field in any JSON response is the only reliable tell of *which* code you're
talking to. Learn it, use it.
