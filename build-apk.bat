@echo off
echo Building TABU Android APK...
echo.

echo Step 1: Building web application...
call npm run build
if %errorlevel% neq 0 (
    echo Error: Failed to build web application
    pause
    exit /b 1
)

echo Step 2: Syncing with Android project...
call npx cap sync android
if %errorlevel% neq 0 (
    echo Error: Failed to sync with Android
    pause
    exit /b 1
)

echo Step 3: Building Android APK...
cd android
call gradlew assembleDebug
if %errorlevel% neq 0 (
    echo Error: Failed to build APK
    pause
    exit /b 1
)

echo.
echo SUCCESS! APK built successfully!
echo.
echo Your APK is located at:
echo android\app\build\outputs\apk\debug\app-debug.apk
echo.
pause
