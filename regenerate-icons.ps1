# PowerShell script to regenerate all icons from tabu.png
# This script requires ImageMagick to be installed
# You can install it via: winget install ImageMagick.ImageMagick

# Verify ImageMagick is installed
try {
    magick -version
} catch {
    Write-Host "ImageMagick is not installed. Please install it first."
    Write-Host "You can install it via: winget install ImageMagick.ImageMagick"
    exit
}

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$sourcePath = Join-Path $projectRoot "public\tabu.png"

# Check if source image exists
if (-not (Test-Path $sourcePath)) {
    Write-Host "Source image not found at: $sourcePath"
    exit
}

Write-Host "Generating icons from $sourcePath..."

# Define the icon sizes to generate
$webpSizes = @(48, 72, 96, 128, 192, 256, 512)

# Create the icons directory if it doesn't exist
$iconsDir = Join-Path $projectRoot "public\icons"
if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir -Force
}

# Generate the WebP icons
foreach ($size in $webpSizes) {
    $outputPath = Join-Path $iconsDir "icon-$size.webp"
    Write-Host "Generating: $outputPath"
    magick convert $sourcePath -resize ${size}x${size} $outputPath
}

# Generate favicon.ico (multiple sizes in one file)
$faviconPath = Join-Path $projectRoot "src\app\favicon.ico"
Write-Host "Generating favicon: $faviconPath"
magick convert $sourcePath -resize 16x16 -resize 32x32 -resize 48x48 -colors 256 $faviconPath

# Generate apple-touch-icon.png
$appleTouchIconPath = Join-Path $projectRoot "public\apple-touch-icon.png"
Write-Host "Generating Apple touch icon: $appleTouchIconPath"
magick convert $sourcePath -resize 192x192 $appleTouchIconPath

# Generate assets/icon.png if the directory exists
$assetsDir = Join-Path $projectRoot "assets"
if (Test-Path $assetsDir) {
    $assetIconPath = Join-Path $assetsDir "icon.png"
    Write-Host "Generating asset icon: $assetIconPath"
    magick convert $sourcePath -resize 1024x1024 $assetIconPath
}

# Copy to project icons folder if it exists
$projectIconsDir = Join-Path $projectRoot "icons"
if (Test-Path $projectIconsDir) {
    Write-Host "Copying icons to project icons folder..."
    foreach ($size in $webpSizes) {
        $sourcePath = Join-Path $iconsDir "icon-$size.webp"
        $targetPath = Join-Path $projectIconsDir "icon-$size.webp"
        Copy-Item -Path $sourcePath -Destination $targetPath -Force
    }
}

Write-Host "All icons have been generated successfully!"
