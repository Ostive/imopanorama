# tools/push-if-build.ps1
# Flow: development -> main -> production
# Build Next.js sur la branche courante (dev).
# Si le build passe : push dev, merge dans main, merge dans production -> Coolify redeploy.
# Usage: .\tools\push-if-build.ps1 [-Message "commit message"]

param(
    [string]$Message = ""
)

$ErrorActionPreference = "Stop"
$sourceBranch = git rev-parse --abbrev-ref HEAD

# 1. Commit les changements en cours si necessaire
$staged = git status --porcelain
if ($staged) {
    if ($Message -eq "") {
        $Message = Read-Host "Message de commit"
    }
    Write-Host "`n=== COMMIT ($sourceBranch) ===" -ForegroundColor Cyan
    git add .
    git commit -m $Message
}

# 2. Build
Write-Host "`n=== BUILD ===" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[ABORT] Build failed - rien n a ete pousse." -ForegroundColor Red
    exit 1
}

# 3. Push la branche de dev
Write-Host "`n=== PUSH $sourceBranch ===" -ForegroundColor Cyan
git push origin $sourceBranch

# 4. Merge dans main + push
Write-Host "`n=== MERGE main ===" -ForegroundColor Cyan
git checkout main
git merge $sourceBranch --no-edit
git push origin main

# 5. Merge dans production + push (Coolify redeploy)
Write-Host "`n=== MERGE production ===" -ForegroundColor Cyan
git checkout production
git merge main --no-edit
git push origin production

# 6. Retour sur la branche de dev
git checkout $sourceBranch

Write-Host "`n[OK] Build OK - $sourceBranch -> main -> production. Coolify va redeploy." -ForegroundColor Green
