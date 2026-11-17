# Case 55: Outbreak at Centennial - Apps Script Deployment Guide

This folder holds the single-file Google Apps Script server (`Code.gs`) for **Centennial Junior High: Case 55: Outbreak at Centennial**.
All student UI and the standalone client engine live PII-free in `bihi2027/HealthyLiving8/Unit%202%20-%20Communicable%20Disease/Centennial/digital-outbreak/`.

## Live Deployed Web App URL

- **Exec URL:** `https://script.google.com/macros/s/AKfycbxIr11bV0iBWBluZHESIqBXuZlxaXl-am7A_yIWV0oYGHHTW2UZSo3l0pqTYTOW8eba/exec`
- **Health Probe:** `https://script.google.com/macros/s/AKfycbxIr11bV0iBWBluZHESIqBXuZlxaXl-am7A_yIWV0oYGHHTW2UZSo3l0pqTYTOW8eba/exec?action=get_health`

Deployed 2026-11-17 and smoke-tested live: health reports `R8-OUTBREAK-1.0.0` / engine `1.0.0`;
teacher PIN gate, HMAC student join, lcd/god/player polls, reveal_control, and a full
Test-Mode bot game to GAME_OVER all PASS. Script Properties on this project: `R8_IDENTITY_KEY`,
`TEACHER_PIN` (secrets live server-side only - never in git).
NOTE: the currently deployed build is an older engine snapshot; re-paste the repo `Code.gs`
(with the anti-tell LCD night checkmarks + death-slide masking) at the next deploy.

## Single-File Update / Redeploy Steps (No Separate `Engine.gs` Needed!)

`OutbreakEngine`, `StoryEngine` and `StoryContent` are bundled directly inside `Code.gs` between the `@@OUTBREAK_BUNDLE_*@@` markers, so you only ever paste **one file**. After editing the public engine files in `bihi2027/HealthyLiving8/Unit%202%20-%20Communicable%20Disease/Centennial/digital-outbreak/`, regenerate with `python3 tools-priv/bundle_outbreak_gas.py` (verify with `--check`) before pasting:

1. Open your **Room 8 Case 55: Outbreak at Centennial** project at `https://script.google.com`.
2. Replace `Code.gs` with the full contents of `Code.gs` from this folder (and delete any extra `Engine.gs` tab if present).
3. Click **Deploy -> Manage deployments -> Pencil (Edit) -> Version: New version -> Deploy** (keeps the exact same `/exec` URL).
4. Open `<EXEC_URL>?action=get_health` and verify `"serverVersion": "R8-OUTBREAK-1.0.0"` and `"engineVersion": "1.0.0"`.

## Script Properties (Already Configured)

- `R8_IDENTITY_KEY` : *(same secret string used in Room 8 Identity & Vault)*
- `TEACHER_PIN` : *(your Room 8 teacher PIN - the only PIN property accepted; legacy fallbacks were removed in 2.0.0)*
