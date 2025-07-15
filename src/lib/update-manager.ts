
'use client';

import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import * as semver from 'semver';
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
      cache: 'no-store' // Ensure we always get the latest release info
    });

    if (!response.ok) {
      throw new Error(`Could not fetch releases from GitHub. Status: ${response.statusText}`);
    }
    const release = await response.json();
    const latestVersion = semver.clean(release.tag_name);
    
    if (!latestVersion) {
        throw new Error('Could not parse latest version from the release tag.');
    }

    const apkAsset = release.assets?.find((asset: any) => asset.name.endsWith('.apk'));
    
    if (!apkAsset) {
      throw new Error('The latest release does not contain a downloadable APK file.');
    }

    const isUpdateAvailable = semver.gt(latestVersion, currentVersion);
    
    return {
      isUpdateAvailable,
      currentVersion,
      latestVersion,
      downloadUrl: isUpdateAvailable ? apkAsset.browser_download_url : null,
    };
  } catch (error) {
    console.error('Error checking for updates:', error);
    // Re-throw the error so the UI can catch it and display a message
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
    // Unfortunately, the official downloadFile plugin does not support progress events.
    // We will show an indeterminate progress or simulate it.
    // For a better UX, a native plugin with progress support would be needed.
    onProgress(10); // Initial progress

    const download = await Filesystem.downloadFile({
      path: fileName,
      url: url,
      directory: Directory.Cache,
    });
    
    onProgress(100); // Download complete

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
