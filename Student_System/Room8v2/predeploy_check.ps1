# ============================================================================
#  Room 8 v2 - PRE-DEPLOY CHECK
#  Run this BEFORE pasting backend.gs into the Apps Script editor.
#  Catches version drift between this repo file and what is actually live.
#
#  Usage (from anywhere):
#    powershell -NoProfile -ExecutionPolicy Bypass -File .\predeploy_check.ps1
# ============================================================================
$ErrorActionPreference = 'Stop'

$BACKEND_URL = 'https://script.google.com/macros/s/AKfycbz73P9FG2HLIJMl9NY9iex9y1TIm1E8cRglvgrsNVAtrrtUJGXgtP3hwKanl_aWJHuMcw/exec'

$here = $PSScriptRoot
$backendGs = Join-Path $here 'backend.gs'
if (-not (Test-Path -LiteralPath $backendGs)) {
  Write-Host 'backend.gs not found next to this script.' -ForegroundColor Red
  exit 1
}

function Get-FirstMatch([string]$path, [string]$pattern) {
  $m = (Select-String -LiteralPath $path -Pattern $pattern | Select-Object -First 1)
  if ($m) { return $m.Matches[0].Groups[1].Value }
  return '(not found)'
}

$repoVer  = Get-FirstMatch $backendGs "var CONFIG_VERSION = '([^']+)'"
$repoDate = Get-FirstMatch $backendGs "var CONFIG_DEPLOYED = '([^']+)'"

Write-Host ''
Write-Host '=== REPO (this machine) ===' -ForegroundColor Cyan
Write-Host ('  CONFIG_VERSION  : ' + $repoVer)
Write-Host ('  CONFIG_DEPLOYED : ' + $repoDate)

Write-Host ''
Write-Host '=== LIVE deployment ===' -ForegroundColor Cyan
$live = $null
try {
  $live = Invoke-RestMethod -Uri ($BACKEND_URL + '?action=get_health') -TimeoutSec 60
  Write-Host ('  version  : ' + $live.version)
  Write-Host ('  deployed : ' + $live.deployedAt)
  Write-Host ('  staff    : ' + $live.staffCount + '   teacherSignInReady: ' + $live.teacherSignInReady)
  Write-Host ('  tabs     : ' + ($live.tabs | ConvertTo-Json -Compress))
} catch {
  Write-Host ('  UNREACHABLE: ' + $_.Exception.Message) -ForegroundColor Yellow
}

Write-Host ''
Write-Host '=== VERDICT ===' -ForegroundColor Cyan
if ($live -and $live.version -eq $repoVer) {
  Write-Host '  IN SYNC - live already matches this file. Nothing to deploy.' -ForegroundColor Green
} elseif ($live) {
  Write-Host '  DRIFT - live differs from this file.' -ForegroundColor Yellow
  Write-Host '  If the LIVE build holds changes this file lacks, DO NOT paste over it'
  Write-Host '  until they are reconciled - they would be lost.'
  Write-Host '  If this file is the one you mean to ship: paste + New version + Deploy.'
} else {
  Write-Host '  Could not read the live version - do not conclude anything from this run.' -ForegroundColor Yellow
}

$repoRoot = Split-Path (Split-Path $here -Parent) -Parent
Write-Host ''
Write-Host ('=== GIT (repo root: ' + $repoRoot + ') ===') -ForegroundColor Cyan
if (Test-Path -LiteralPath (Join-Path $repoRoot '.git')) {
  Push-Location $repoRoot
  try {
    $sb = git status -sb 2>&1 | Select-Object -First 1
    Write-Host ('  ' + $sb + '   (run: git fetch  to refresh ahead/behind)')
    Write-Host ('  HEAD: ' + (git log --oneline -1 2>&1))
  } finally { Pop-Location }
} else {
  Write-Host '  not a git checkout - skipping'
}
Write-Host ''