# App Icons Setup

## Steps to use your TABU logo:

1. Save your TABU logo image as `icon.png` in this `resources` folder
2. Make sure the image is at least 1024x1024 pixels for best quality
3. The image should be square and preferably have a transparent background
4. Run the command: `npx @capacitor/assets generate`

This will automatically generate all the required icon sizes for Android and iOS from your logo.

## Current logo file needed:
- `resources/icon.png` (your TABU logo - 1024x1024px recommended)

After adding the icon.png file, the assets generator will create:
- Android icons in various sizes (mipmap-* folders)
- iOS icons 
- Splash screens (if splash.png is also provided)
