# Auto-Update System for TABU App

This document explains how the auto-update system works and how to release new versions.

## How It Works

### 1. **Automatic Update Checking**
- The app automatically checks for updates 5 seconds after startup (only on mobile)
- Users can manually check for updates via the "Update App" option in the user menu
- Update notifications appear with a pulsing indicator

### 2. **Version Management**
- Uses semantic versioning (major.minor.patch)
- Proper version comparison prevents false update notifications
- Only creates releases when the version number actually changes

### 3. **Release Process**
- GitHub Actions automatically builds and releases APK when you push to main
- APK files are named with version numbers (e.g., `tabu-v1.0.4.apk`)
- Releases include installation instructions

## How to Release a New Version

### Method 1: Using the Version Bump Script (Recommended)

#### On Windows:
```bash
# For patch version (1.0.3 → 1.0.4)
bump-version.bat patch

# For minor version (1.0.3 → 1.1.0) 
bump-version.bat minor

# For major version (1.0.3 → 2.0.0)
bump-version.bat major

# Then push to trigger the build
git push origin main --tags
```

#### On Linux/Mac:
```bash
# Make script executable first
chmod +x bump-version.sh

# Then bump version
./bump-version.sh patch
git push origin main --tags
```

### Method 2: Manual Version Bump

1. **Update package.json version:**
   ```json
   {
     "version": "1.0.4"
   }
   ```

2. **Commit and tag:**
   ```bash
   git add package.json
   git commit -m "chore: bump version to 1.0.4"
   git tag "v1.0.4"
   git push origin main --tags
   ```

3. **GitHub Actions will automatically:**
   - Build the APK
   - Create a GitHub release
   - Upload the APK file

## For Users: How to Update

### Automatic Updates
- Users will see an update notification when they open the app
- They can download and install the update directly from the app

### Manual Updates
- Users can check for updates anytime via the menu
- Download APK from GitHub releases page
- Enable "Install from unknown sources" in Android settings
- Install the downloaded APK

## Troubleshooting

### No Release Created
- Check if the version in package.json was actually changed
- Ensure you pushed the tags: `git push origin main --tags`
- Check GitHub Actions logs for build errors

### Update Not Detected
- Ensure the new version number is higher than the current one
- Check that the GitHub release contains an APK file
- Verify the GitHub repository name in `src/lib/update-manager.ts`

### Build Failures
- Check that all environment variables are set in GitHub Actions
- Ensure Android build.gradle files are valid
- Check for any dependency conflicts

## Technical Details

### Files Involved
- `src/lib/update-manager.ts` - Core update logic
- `src/components/app-update-dialog.tsx` - Update UI
- `src/components/auto-update-checker.tsx` - Automatic checking
- `.github/workflows/build-android.yml` - Build automation
- `package.json` - Version source

### Repository Configuration
- Repository: `Arnold-Dsouza/TABU`
- Branch: `main`
- Release tags: `v1.0.0`, `v1.0.1`, etc.

The system is designed to be zero-maintenance once set up. Users will automatically get notified of updates, and developers just need to bump the version number to trigger a new release.
