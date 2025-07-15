
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

export async function downloadUpdate(
  url: string,
  onProgress: (progress: number) => void
): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    console.error('Cannot download update on a non-native platform.');
    return;
  }
  
  const fileName = `update-${Date.now()}.apk`;

  try {
    onProgress(10); 

    const download = await Filesystem.downloadFile({
      path: fileName,
      url: url,
      directory: Directory.Cache,
    });
    
    onProgress(100);

    if (!download.path) {
        throw new Error('File download failed, path is missing.');
    }

    console.log('Update downloaded to:', download.path);
    alert(`Update downloaded. You may need to manually open the file from your device's "Downloads" or "Files" app to install it. Path: ${download.path}`);

  } catch (error) {
    console.error('Error downloading or installing update:', error);
    throw error;
  }
}
