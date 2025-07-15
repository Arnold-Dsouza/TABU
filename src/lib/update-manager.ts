
'use client';

import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

// Manually specify the version from package.json
const currentVersion = '1.0.1'; 
const GITHUB_REPO = 'Arnold-Dsouza/TABU';

export interface UpdateInfo {
  isUpdateAvailable: boolean;
  currentVersion: string;
  latestVersion: string | null;
  downloadUrl: string | null;
}

export async function checkForUpdates(): Promise<UpdateInfo> {
  if (!Capacitor.isNativePlatform()) {
    console.log('Not a native platform, skipping update check.');
    return { isUpdateAvailable: false, currentVersion, latestVersion: null, downloadUrl: null };
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.statusText}`);
    }
    const release = await response.json();
    const latestVersion = release.tag_name.replace('v', '');
    const apkAsset = release.assets?.find((asset: any) => asset.name.endsWith('.apk'));
    
    if (!apkAsset) {
      throw new Error('No APK found in the latest release.');
    }

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
    const download = await Filesystem.downloadFile({
      path: fileName,
      url: url,
      directory: Directory.Cache, // Use Cache directory for temporary files
      progress: true,
      
      // The Filesystem plugin's 'progress' event is not standard, so we can't use it.
      // We will simulate progress or show an indeterminate loader.
      // For this example, we will just simulate it.
      // In a real app, you might use a native plugin that supports progress events.
    });

    // Simulate progress as the official plugin doesn't provide real-time feedback
    onProgress(25);
    // some delay
    await new Promise(res => setTimeout(res, 200));
    onProgress(50);
    await new Promise(res => setTimeout(res, 200));
    onProgress(75);
    await new Promise(res => setTimeout(res, 200));

    if (!download.path) {
        throw new Error('File download failed, path is missing.');
    }
    onProgress(100);

    // The file is downloaded, now we need a way to open it to trigger installation.
    // The official Capacitor Filesystem API doesn't have a method to "open" a file.
    // We can't trigger installation directly from web code due to security restrictions.
    // The recommended approach is to use a community plugin for opening files,
    // like `@capawesome/capacitor-file-opener`.
    // Since we've had trouble with plugins, for now, we will log the path
    // and rely on the user to find it if they are savvy.
    // THIS IS A LIMITATION we have to accept for now.
    console.log('Update downloaded to:', download.path);
    alert(`Update downloaded. You may need to manually open the file from your device's "Downloads" or "Files" app to install it. Path: ${download.path}`);

  } catch (error) {
    console.error('Error downloading or installing update:', error);
    throw error;
  }
}
