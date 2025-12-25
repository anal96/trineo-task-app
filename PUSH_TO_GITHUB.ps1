# PowerShell script to help push to GitHub
# Run: .\PUSH_TO_GITHUB.ps1

Write-Host "=== Trineo Tasks - GitHub Push Helper ===" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
try {
    $gitVersion = git --version
    Write-Host "✅ Git found: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host "   Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Check if .git exists
if (Test-Path .git) {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
} else {
    Write-Host "📦 Initializing git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
}

Write-Host ""

# Check .gitignore
if (Test-Path .gitignore) {
    $gitignoreContent = Get-Content .gitignore -Raw
    if ($gitignoreContent -match "\.env") {
        Write-Host "✅ .gitignore properly configured (.env is ignored)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Warning: .env might not be in .gitignore!" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Warning: .gitignore not found!" -ForegroundColor Yellow
}

Write-Host ""

# Check if .env exists and warn
if (Test-Path .env) {
    $envTracked = git ls-files .env 2>$null
    if ($envTracked) {
        Write-Host "❌ WARNING: .env file is tracked by git!" -ForegroundColor Red
        Write-Host "   Run: git rm --cached .env" -ForegroundColor Yellow
    } else {
        Write-Host "✅ .env file exists but is properly ignored" -ForegroundColor Green
    }
} else {
    Write-Host "ℹ️  No .env file found (this is okay)" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Add files to git:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host ""
Write-Host "2. Create commit:" -ForegroundColor White
Write-Host "   git commit -m 'Initial commit: Trineo Tasks Mobile App'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Create repository on GitHub:" -ForegroundColor White
Write-Host "   - Go to: https://github.com/new" -ForegroundColor Gray
Write-Host "   - Create new repository" -ForegroundColor Gray
Write-Host "   - DO NOT initialize with README" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Connect and push:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git" -ForegroundColor Gray
Write-Host "   git branch -M main" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 See GITHUB_SETUP.md for detailed instructions" -ForegroundColor Cyan

