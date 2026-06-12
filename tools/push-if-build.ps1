# tools/push-if-build.ps1
# Build Next.js sur la branche courante.
# Si le build passe : merge dans production + push -> Coolify redeploy.
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

# 4. Merge dans production + push (Coolify)
Write-Host "`n=== MERGE production ===" -ForegroundColor Cyan
git checkout production
git merge $sourceBranch --no-edit
git push origin production

# 5. Retour sur la branche de dev
git checkout $sourceBranch

Write-Host "`n[OK] Build OK, production mise a jour. Coolify va redeploy." -ForegroundColor Green
