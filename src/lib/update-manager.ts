
'use client';

import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import packageInfo from '../../package.json';

const GITHUB_REPO = 'Arnold-Dsouza/TABU';

export interface UpdateInfo {
  isUpdateAvailable: boolean;
  currentVersion: string;
  latestVersion: string | null;
  downloadUrl: string | null;
}

export async function checkForUpdates(): Promise<UpdateInfo> {
  const currentVersion = packageInfo.version;

  if (!Capacitor.isNativePlatform()) {
    console.log('Not a native platform, skipping update check.');
    return { isUpdateAvailable: false, currentVersion, latestVersion: null, downloadUrl: null };
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`Could not fetch releases from GitHub. Status: ${response.statusText}`);
    }
    const release = await response.json();
    
    // GitHub API can return a draft release as 'latest' if it's the most recent.
    // We should only consider published releases.
    if (release.draft) {
      console.log('Latest release is a draft, skipping update.');
      return { isUpdateAvailable: false, currentVersion, latestVersion: null, downloadUrl: null };
    }
    
    const latestVersion = release.tag_name.replace('v', '');
    
    if (!latestVersion) {
        throw new Error('Could not parse latest version from the release tag.');
    }

    const apkAsset = release.assets?.find((asset: any) => asset.name.endsWith('.apk'));
    
    if (!apkAsset) {
      throw new Error('The latest release does not contain a downloadable APK file.');
    }

    // Simple string comparison for versions. For more complex scenarios, a semver library is better.
    const isUpdateAvailable = latestVersion > currentVersion;
    
    return {
      isUpdateAvailable,
      currentVersion,
      latestVersion,
      downloadUrl: isUpdateAvailable ? apkAsset.browser_download_url : null,
    };
  } catch (error) {
    console.error('Error checking for updates:', error);
    throw error;
  }
}

// Show a persistent notification during download
function showDownloadNotification(progress: number): void {
  // Remove any existing notification
  const existingNotification = document.getElementById('download-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create new notification
  const notification = document.createElement('div');
  notification.id = 'download-notification';
  notification.className = 'fixed top-4 right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg z-[9998] max-w-sm';
  notification.innerHTML = `
    <div class="flex items-center space-x-3">
      <div class="flex-shrink-0">
        <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        </svg>
      </div>
      <div class="flex-1">
        <p class="text-sm font-medium">Downloading Update...</p>
        <div class="w-full bg-primary-foreground/20 rounded-full h-2 mt-1">
          <div class="bg-primary-foreground h-2 rounded-full transition-all duration-300" style="width: ${progress}%"></div>
        </div>
        <p class="text-xs mt-1 opacity-90">${progress}% complete</p>
      </div>
    </div>
  `;

  document.body.appendChild(notification);

  // Auto-remove after completion
  if (progress >= 100) {
    setTimeout(() => {
      if (document.getElementById('download-notification')) {
        notification.remove();
      }
    }, 2000);
  }
}

export async function downloadUpdate(
  url: string,
  onProgress: (progress: number) => void
): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    console.error('Cannot download update on a non-native platform.');
    return;
  }
  
  const fileName = `TABU-v${packageInfo.version}-update.apk`;

  try {
    // Show initial notification
    showDownloadNotification(0);
    onProgress(10);

    // Download to External Documents directory for easier access
    const download = await Filesystem.downloadFile({
      path: fileName,
      url: url,
      directory: Directory.Documents,
    });
    
    // Update progress
    showDownloadNotification(90);
    onProgress(90);

    if (!download.path) {
        throw new Error('File download failed, path is missing.');
    }

    // Get the actual file URI for opening
    const fileUri = await Filesystem.getUri({
      directory: Directory.Documents,
      path: fileName
    });

    // Complete download
    showDownloadNotification(100);
    onProgress(100);

    console.log('Update downloaded to:', download.path);
    console.log('File URI:', fileUri.uri);

    // Show completion notification briefly, then show action dialog
    setTimeout(async () => {
      const userChoice = await showUpdateDownloadedDialog(fileName, fileUri.uri);
      
      if (userChoice === 'install') {
        await openFileForInstallation(fileUri.uri);
      } else if (userChoice === 'locate') {
        await showFileLocation(fileName);
      } else if (userChoice === 'share') {
        await shareUpdateFile(fileUri.uri, fileName);
      }
      // 'later' option doesn't need any action - just creates the persistent badge
      if (userChoice === 'later') {
        createPersistentUpdateBadge(fileName);
      }
    }, 1500);

  } catch (error) {
    // Remove download notification on error
    const notification = document.getElementById('download-notification');
    if (notification) {
      notification.remove();
    }
    console.error('Error downloading update:', error);
    throw error;
  }
}

// Show a dialog with installation options
async function showUpdateDownloadedDialog(fileName: string, fileUri: string): Promise<'install' | 'locate' | 'later'> {
  return new Promise((resolve) => {
    const dialog = document.createElement('div');
    dialog.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4';
    dialog.innerHTML = `
      <div class="bg-background border rounded-lg p-6 max-w-sm w-full space-y-4">
        <div class="text-center">
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold mb-2">Update Downloaded!</h3>
          <p class="text-sm text-muted-foreground mb-4">
            The update has been saved to your Documents folder as:<br>
            <span class="font-mono text-xs">${fileName}</span>
          </p>
        </div>
        
        <div class="space-y-2">
          <button id="install-btn" class="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            📱 Install Now
          </button>
          <button id="locate-btn" class="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            📂 Open File Manager
          </button>
          <button id="share-btn" class="w-full bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            📤 Share File
          </button>
          <button id="later-btn" class="w-full bg-muted text-muted-foreground hover:bg-muted/80 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            ⏰ Install Later
          </button>
        </div>
        
        <div class="text-xs text-muted-foreground text-center">
          💡 You may need to enable "Install from unknown sources" in your device settings
        </div>
      </div>
    `;

    document.body.appendChild(dialog);

    const installBtn = dialog.querySelector('#install-btn');
    const locateBtn = dialog.querySelector('#locate-btn');
    const laterBtn = dialog.querySelector('#later-btn');

    const cleanup = () => {
      document.body.removeChild(dialog);
    };

    installBtn?.addEventListener('click', () => {
      cleanup();
      resolve('install');
    });

    locateBtn?.addEventListener('click', () => {
      cleanup();
      resolve('locate');
    });

    laterBtn?.addEventListener('click', () => {
      cleanup();
      resolve('later');
    });

    // Auto-close after 30 seconds
    setTimeout(() => {
      if (document.body.contains(dialog)) {
        cleanup();
        resolve('later');
      }
    }, 30000);
  });
}

// Try to open the APK file for installation
async function openFileForInstallation(fileUri: string): Promise<void> {
  try {
    // Method 1: Try to open with file:// protocol (works on some devices)
    if (fileUri.startsWith('file://')) {
      window.open(fileUri, '_system');
      return;
    }

    // Method 2: Try content:// URI if available
    if (fileUri.includes('content://')) {
      window.open(fileUri, '_system');
      return;
    }

    // Method 3: For Android, try to construct a proper file URI
    if (Capacitor.getPlatform() === 'android') {
      // Convert to a file URI that Android can handle
      const androidFileUri = fileUri.replace(/^capacitor:\/\//, 'file://');
      window.open(androidFileUri, '_system');
      return;
    }

    // Method 4: Fallback - try the original URI
    window.open(fileUri, '_blank');
    
  } catch (error) {
    console.error('Could not open file for installation:', error);
    
    // Ultimate fallback: show detailed instructions with multiple options
    showAdvancedInstallationInstructions();
  }
}

// Try to share the update file
async function shareUpdateFile(fileUri: string, fileName: string): Promise<void> {
  try {
    // Method 1: Try Web Share API if available
    if (navigator.share) {
      // For file sharing, we need to convert to a blob or use alternative method
      await navigator.share({
        title: 'TABU App Update',
        text: `Install the latest TABU app update: ${fileName}`,
        url: fileUri
      });
      return;
    }

    // Method 2: Create a shareable message with instructions
    const shareText = `
📱 TABU App Update Ready!

File: ${fileName}
Location: Documents folder

To install:
1. Open Files app
2. Go to Documents folder  
3. Tap "${fileName}"
4. Enable "Install from unknown sources" if prompted
5. Install the update

📂 File saved in Documents folder on this device.
    `.trim();

    // Method 3: Try to copy to clipboard
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      alert('📋 Installation instructions copied to clipboard!\n\nYou can now paste and share these instructions with others.');
      return;
    }

    // Method 4: Fallback - show the shareable text
    alert(shareText + '\n\n💡 You can copy this text to share with others.');

  } catch (error) {
    console.error('Could not share file:', error);
    
    // Ultimate fallback
    alert(`📤 Share the update file:\n\nFile location: Documents folder\nFile name: ${fileName}\n\n💡 You can manually send this file to others via file manager or messaging apps.`);
  }
}
function showAdvancedInstallationInstructions(): void {
  const message = `
📱 Multiple Installation Options:

🔥 METHOD 1 - Direct Install:
1. Open your "Files" or "My Files" app
2. Go to Documents folder
3. Look for "TABU-v...update.apk"
4. Tap the file to install

📂 METHOD 2 - Downloads Folder:
1. Open "Downloads" app
2. Look for the TABU APK file
3. Tap to install

⚙️ METHOD 3 - Settings:
1. Go to Settings > Apps & notifications
2. Tap "Install unknown apps" 
3. Enable for your file manager
4. Then try installing the APK

🔍 METHOD 4 - Search:
1. Use your device's search function
2. Search for "TABU" or ".apk"
3. Find and tap the update file

💡 IMPORTANT: 
- Enable "Install from unknown sources" in Android settings
- The file is named: TABU-v${packageInfo.version}-update.apk
- File location: Documents folder

❓ Still having trouble? Try restarting your device and looking in Downloads folder.
  `;
  
  alert(message);
}

// Show file location instructions
async function showFileLocation(fileName: string): Promise<void> {
  const message = `
📂 The update file has been saved to:

📱 Location: Documents folder
📄 File name: ${fileName}

To install:
1. Open your device's "Files" or "My Files" app
2. Navigate to Documents folder
3. Tap on "${fileName}"
4. Follow the installation prompts

💡 Make sure "Install from unknown sources" is enabled in your Android settings.
  `;
  
  alert(message);
  
  // Also create a persistent notification badge
  createPersistentUpdateBadge(fileName);
}

// Create a persistent notification that user can tap anytime
function createPersistentUpdateBadge(fileName: string): void {
  // Remove any existing badge
  const existingBadge = document.getElementById('update-ready-badge');
  if (existingBadge) {
    existingBadge.remove();
  }

  const badge = document.createElement('div');
  badge.id = 'update-ready-badge';
  badge.className = 'fixed bottom-4 right-4 bg-green-600 text-white p-3 rounded-full shadow-lg z-[9999] cursor-pointer hover:bg-green-700 transition-colors';
  badge.innerHTML = `
    <div class="flex items-center space-x-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
      </svg>
      <span class="text-xs font-medium hidden sm:block">Update Ready</span>
    </div>
  `;

  badge.onclick = () => {
    showInstallationInstructions();
  };

  document.body.appendChild(badge);

  // Auto-hide after 2 minutes, but user can bring it back
  setTimeout(() => {
    if (badge && document.body.contains(badge)) {
      badge.style.opacity = '0.7';
      badge.style.transform = 'scale(0.8)';
    }
  }, 120000);
}

// Show installation instructions as fallback
function showInstallationInstructions(): void {
  const message = `
📱 Installation Instructions:

1. Go to your device's "Files" or "Downloads" app
2. Look for the TABU update file (ends with .apk)
3. Tap on the file to install
4. If prompted, enable "Install from unknown sources"
5. Follow the installation wizard

📂 The file is saved in your Documents folder.

💡 If you can't find the file, try looking in Downloads or use your file manager's search function.
  `;
  
  alert(message);
}
