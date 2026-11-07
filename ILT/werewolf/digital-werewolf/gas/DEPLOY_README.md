# Digital Werewolf - Apps Script Deployment Guide

This folder holds the single-file Google Apps Script server (`Code.gs`) for **Moonhollow Harbour: Digital Werewolf**.
All student UI and the standalone client engine live PII-free in `bihi2027/ILT/werewolf/digital-werewolf/`.

## Live Deployed Web App URL

- **Exec URL:** `https://script.google.com/macros/s/AKfycbz6RDat46u0UG6ATRiXIc8IGtRj19s1yUoByTvhm3lZg7o1Yf-8RpDYXaY9kDCIECY2ZA/exec`
- **Health Probe:** `https://script.google.com/macros/s/AKfycbz6RDat46u0UG6ATRiXIc8IGtRj19s1yUoByTvhm3lZg7o1Yf-8RpDYXaY9kDCIECY2ZA/exec?action=get_health`

## Single-File Update / Redeploy Steps (No Separate `Engine.gs` Needed!)

`WerewolfEngine`, `StoryEngine` and `StoryContent` are bundled directly inside `Code.gs` between the `@@WEREWOLF_BUNDLE_*@@` markers, so you only ever paste **one file**. After editing the public engine files in `bihi2027/ILT/werewolf/digital-werewolf/`, regenerate with `python3 tools-priv/bundle_werewolf_gas.py` (verify with `--check`) before pasting:

1. Open your **Room 8 Digital Werewolf** project at `https://script.google.com`.
2. Replace `Code.gs` with the full contents of `Code.gs` from this folder (and delete any extra `Engine.gs` tab if present).
3. Click **Deploy -> Manage deployments -> Pencil (Edit) -> Version: New version -> Deploy** (keeps the exact same `/exec` URL).
4. Open `<EXEC_URL>?action=get_health` and verify `"serverVersion": "R8-WEREWOLF-1.1.0"` and `"engineVersion": "1.0.0"`.

## Script Properties (Already Configured)

- `R8_IDENTITY_KEY` : *(same secret string used in Room 8 Identity & Vault)*
- `TEACHER_PIN` : *(your Room 8 teacher PIN - the only PIN property accepted; legacy fallbacks were removed in 2.0.0)*
