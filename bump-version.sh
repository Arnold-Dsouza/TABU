#!/bin/bash

# Version bump script for TABU app
# Usage: ./bump-version.sh [major|minor|patch]

if [ $# -eq 0 ]; then
    echo "Usage: $0 [major|minor|patch]"
    echo "Example: $0 patch"
    exit 1
fi

TYPE=$1

if [[ "$TYPE" != "major" && "$TYPE" != "minor" && "$TYPE" != "patch" ]]; then
    echo "Error: Version type must be 'major', 'minor', or 'patch'"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed"
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Error: Not in a git repository"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "Error: You have uncommitted changes. Please commit or stash them first."
    exit 1
fi

echo "Bumping $TYPE version..."

# Bump version in package.json
npm version $TYPE --no-git-tag-version

# Get the new version
NEW_VERSION=$(node -p "require('./package.json').version")

echo "Version bumped to: $NEW_VERSION"

# Update version in Android build.gradle if it exists
if [ -f "android/app/build.gradle" ]; then
    echo "Updating Android version..."
    # Update versionName
    sed -i.bak "s/versionName \".*\"/versionName \"$NEW_VERSION\"/" android/app/build.gradle
    rm -f android/app/build.gradle.bak
    echo "Android version updated"
fi

# Commit the changes
git add package.json package-lock.json
if [ -f "android/app/build.gradle" ]; then
    git add android/app/build.gradle
fi

git commit -m "chore: bump version to $NEW_VERSION"

# Create and push tag
git tag "v$NEW_VERSION"

echo "Changes committed and tagged as v$NEW_VERSION"
echo ""
echo "To trigger the release build, run:"
echo "  git push origin main --tags"
echo ""
echo "This will:"
echo "  1. Push your changes to GitHub"
echo "  2. Trigger the GitHub Actions workflow"
echo "  3. Build and release the APK automatically"
