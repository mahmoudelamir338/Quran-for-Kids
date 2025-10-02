# PowerShell script for deploying to GitHub Pages
# Usage: .\deploy-gh-pages.ps1

Write-Host "🔨 Building for GitHub Pages..." -ForegroundColor Cyan

# Set environment variable for GitHub Pages
$env:GITHUB_PAGES = "true"

# Build the project
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green

# Navigate to dist folder
Set-Location -Path "dist"

# Create .nojekyll file
Write-Host "📝 Creating .nojekyll file..." -ForegroundColor Cyan
New-Item -Path ".nojekyll" -ItemType File -Force | Out-Null

# Initialize git repository
Write-Host "📦 Initializing git repository..." -ForegroundColor Cyan
git init

# Add all files
git add -A

# Commit
git commit -m "🚀 Deploy to GitHub Pages"

# Push to gh-pages branch
Write-Host "🚀 Pushing to gh-pages branch..." -ForegroundColor Cyan
git push -f https://github.com/mahmoudelamir338/Quran-for-Kids.git main:gh-pages

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Push failed!" -ForegroundColor Red
    Set-Location -Path ".."
    exit 1
}

# Go back to root directory
Set-Location -Path ".."

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Your site will be available at: https://mahmoudelamir338.github.io/Quran-for-Kids/" -ForegroundColor Yellow
Write-Host "⏳ Please wait 1-2 minutes for GitHub Pages to update..." -ForegroundColor Yellow
Write-Host ""