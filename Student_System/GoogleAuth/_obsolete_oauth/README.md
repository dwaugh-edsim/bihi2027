# ⚠️ OBSOLETE — do not paste these anywhere

These are the **superseded Google-OAuth (GIS) path**, from before we learned that
`console.cloud.google.com` is disabled for `@gnspes.ca` accounts, so no OAuth Client ID
can be created. They still *run* (that's the trap), but they authenticate via a Google
ID token and a client ID we can never mint — **they are not the live system.**

- `Code.gs` — the abandoned OAuth backend. Its `doGet` answers
  `{"message":"Room 8 New Assignments backend","version":"GA-0.1.0-…"}`. **If you see
  that JSON anywhere, you've pasted THIS file by mistake.**
- `signin_test.html` — the abandoned test page for the above.

## The live files are in `../no_gcp/`

| Paste this… | …into | Identity of the *right* file |
|---|---|---|
| `no_gcp/identity.gs` | Identity Apps Script project | `R8-ID-0.3.x`, has `bounceOut_` |
| `no_gcp/vault.gs` | Vault Apps Script project | `R8-VAULT-0.2.x` |
| `no_gcp/assignment_pages.html` | GitHub Pages (not pasted) | `IDENTITY_URL` / `VAULT_URL` |

Quick sanity check after pasting `identity.gs`: open `<IDENTITY_URL>?action=probe` — it
must report **`"version":"R8-ID-0.3.x"`**. If it says `GA-0.1.0` (or `R8-ID-0.1.x`), the
wrong file is deployed.