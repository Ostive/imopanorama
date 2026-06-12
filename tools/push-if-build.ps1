# tools/push-if-build.ps1
# Build Next.js — si le build passe, commit tout et push.
# Usage: .\tools\push-if-build.ps1 [-Message "commit message"]

param(
    [string]$Message = "chore: build-verified push"
)

$ErrorActionPreference = "Stop"

Write-Host "`n=== BUILD ===" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[ABORT] Build failed — nothing pushed." -ForegroundColor Red
    exit 1
}

Write-Host "`n=== GIT ===" -ForegroundColor Cyan
git add .
git status --short

$staged = git diff --cached --name-only
if (-not $staged) {
    Write-Host "`n[SKIP] Nothing to commit." -ForegroundColor Yellow
    exit 0
}

git commit -m $Message
git push

Write-Host "`n[OK] Build passed and pushed." -ForegroundColor Green
