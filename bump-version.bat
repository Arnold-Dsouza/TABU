@echo off
REM Version bump script for TABU app (Windows)
REM Usage: bump-version.bat [major|minor|patch]

if "%1"=="" (
    echo Usage: %0 [major^|minor^|patch]
    echo Example: %0 patch
    exit /b 1
)

set TYPE=%1

if not "%TYPE%"=="major" if not "%TYPE%"=="minor" if not "%TYPE%"=="patch" (
    echo Error: Version type must be 'major', 'minor', or 'patch'
    exit /b 1
)

REM Check if npm is available
where npm >nul 2>nul
if errorlevel 1 (
    echo Error: npm is not installed
    exit /b 1
)

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>nul
if errorlevel 1 (
    echo Error: Not in a git repository
    exit /b 1
)

REM Check for uncommitted changes
git diff-index --quiet HEAD -- >nul 2>nul
if errorlevel 1 (
    echo Error: You have uncommitted changes. Please commit or stash them first.
    exit /b 1
)

echo Bumping %TYPE% version...

REM Bump version in package.json
call npm version %TYPE% --no-git-tag-version

REM Get the new version
for /f "delims=" %%i in ('node -p "require('./package.json').version"') do set NEW_VERSION=%%i

echo Version bumped to: %NEW_VERSION%

REM Commit the changes
git add package.json package-lock.json
if exist "android\app\build.gradle" git add android\app\build.gradle

git commit -m "chore: bump version to %NEW_VERSION%"

REM Create and push tag
git tag "v%NEW_VERSION%"

echo Changes committed and tagged as v%NEW_VERSION%
echo.
echo To trigger the release build, run:
echo   git push origin main --tags
echo.
echo This will:
echo   1. Push your changes to GitHub
echo   2. Trigger the GitHub Actions workflow  
echo   3. Build and release the APK automatically
