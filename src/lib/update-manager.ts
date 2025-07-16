
'use client';

import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Browser } from '@capacitor/browser';
import packageInfo from '../../package.json';

const GITHUB_REPO = 'Arnold-Dsouza/TABU';

// Semantic version comparison function
function compareVersions(version1: string, version2: string): number {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);
  
  const maxLength = Math.max(v1Parts.length, v2Parts.length);
  
  for (let i = 0; i < maxLength; i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;
    
    if (v1Part > v2Part) return 1;
    if (v1Part < v2Part) return -1;
  }
  
  return 0;
}

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

    // Proper semantic version comparison
    const isUpdateAvailable = compareVersions(latestVersion, currentVersion) > 0;
    
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

export async function downloadUpdate(
  url: string,
  onProgress: (progress: number) => void,
  version?: string
): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    console.error('Cannot download update on a non-native platform.');
    return;
  }
  
  const fileName = `tabu-v${version || 'latest'}.apk`;

  try {
    onProgress(10); 

    const download = await Filesystem.downloadFile({
      path: fileName,
      url: url,
      directory: Directory.Documents,
    });
    
    onProgress(90);

    if (!download.path) {
        throw new Error('File download failed, path is missing.');
    }

    console.log('Update downloaded to:', download.path);
    onProgress(100);

    // Simple success message - let user handle installation manually
    alert(`✅ Update downloaded successfully!\n\nFile: ${fileName}\nLocation: Downloads folder\n\nTo install: Open your Downloads folder and tap the APK file.`);

  } catch (error) {
    console.error('Error downloading update:', error);
    throw error;
  }
}
