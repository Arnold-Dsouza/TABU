# Build TABU Android APK
Write-Host "Building TABU Android APK..." -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Building web application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to build web application" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Step 2: Syncing with Android project..." -ForegroundColor Yellow
npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to sync with Android" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Step 3: Building Android APK..." -ForegroundColor Yellow
Set-Location android
.\gradlew assembleDebug
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to build APK" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "SUCCESS! APK built successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Your APK is located at:" -ForegroundColor Cyan
Write-Host "android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
