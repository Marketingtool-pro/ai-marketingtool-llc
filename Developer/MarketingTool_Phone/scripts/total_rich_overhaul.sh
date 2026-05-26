#!/bin/bash
set -euo pipefail

# Portable: derives PROJECT_ROOT from the script's location, takes SOURCE_ROOT
# as $1 or env var. No hard-coded paths to one developer's machine.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${PROJECT_ROOT:-$(cd "$SCRIPT_DIR/.." && pwd)}"
DEST_TOOLS="${DEST_TOOLS:-$PROJECT_ROOT/src/assets/images/tool-icons-v2}"
DEST_SOCIAL="${DEST_SOCIAL:-$PROJECT_ROOT/src/assets/images/social-icons}"

mkdir -p "$DEST_TOOLS"
mkdir -p "$DEST_SOCIAL"

# Root source path. Pass as the first argument or set SOURCE_ROOT in the environment.
SOURCE_ROOT="${SOURCE_ROOT:-${1:-}}"
if [ -z "$SOURCE_ROOT" ]; then
    echo "Usage: SOURCE_ROOT=/path/to/source-root $0" >&2
    echo "   or: $0 /path/to/source-root" >&2
    exit 1
fi
if [ ! -d "$SOURCE_ROOT" ]; then
    echo "SOURCE_ROOT does not exist or is not a directory: $SOURCE_ROOT" >&2
    exit 1
fi

# Pick image tool: prefer ImageMagick (cross-platform), fall back to macOS sips.
if command -v magick >/dev/null 2>&1; then
    IMAGE_TOOL="magick"
elif command -v convert >/dev/null 2>&1; then
    IMAGE_TOOL="convert"
elif command -v sips >/dev/null 2>&1; then
    IMAGE_TOOL="sips"
else
    echo "No supported image conversion tool found. Install ImageMagick ('magick' or 'convert') or use macOS 'sips'." >&2
    exit 1
fi

resize_to_png() {
    local src="$1"
    local dest="$2"
    case "$IMAGE_TOOL" in
        magick)  magick "$src" -resize 128x128 "$dest" ;;
        convert) convert "$src" -resize 128x128 "$dest" ;;
        sips)    sips -s format png -z 128 128 "$src" --out "$dest" > /dev/null ;;
    esac
}

rich_compress() {
    local src="$1"
    local dest="$2"
    if [ -f "$src" ]; then
        echo "Processing $(basename "$dest")..."
        resize_to_png "$src" "$dest"
    else
        echo "Warning: Source file not found: $src (skipping $(basename "$dest"))" >&2
    fi
}

# 1. PLATFORM & CORE UI ICONS (The 7 Platforms)
rich_compress "$SOURCE_ROOT/3d-seo-marketing-icons_Njk4NjhlY2U1M2QwMGUwMDMzZGI0MzY3/3D Seo & Marketing Icons/PNG/2 SEM.png" "$DEST_TOOLS/google-3d.png"
rich_compress "$SOURCE_ROOT/3d-seo-marketing-icons_Njk4NjhlY2U1M2QwMGUwMDMzZGI0MzY3/3D Seo & Marketing Icons/PNG/27 Advertisement.png" "$DEST_TOOLS/meta-3d.png"
rich_compress "$SOURCE_ROOT/3d-seo-marketing-icons_Njk4NjhlY2U1M2QwMGUwMDMzZGI0MzY3/3D Seo & Marketing Icons/PNG/22 Promotions.png" "$DEST_TOOLS/social-media-3d.png"
rich_compress "$SOURCE_ROOT/3d-seo-marketing-icons_Njk4NjhlY2U1M2QwMGUwMDMzZGI0MzY3/3D Seo & Marketing Icons/PNG/1 SEO.png" "$DEST_TOOLS/seo-3d.png"
rich_compress "$SOURCE_ROOT/3d-seo-marketing-icons_Njk4NjhlY2U1M2QwMGUwMDMzZGI0MzY3/3D Seo & Marketing Icons/PNG/11 Analytics.png" "$DEST_TOOLS/analytics-3d.png"
rich_compress "$SOURCE_ROOT/3d-seo-marketing-icons_Njk4NjhlY2U1M2QwMGUwMDMzZGI0MzY3/3D Seo & Marketing Icons/PNG/18 Landing Page.png" "$DEST_TOOLS/ecommerce-3d.png"
rich_compress "$SOURCE_ROOT/3d-artificial-intelligence_Njk4NjhlY2U1M2QwMGUwMDMzZGI0MzY3/PNG/1 a.png" "$DEST_TOOLS/ai-3d.png"
rich_compress "$SOURCE_ROOT/3d-artificial-intelligence_Njk4NjhlY2U1M2QwMGUwMDMzZGI0MzY3/PNG/14 a.png" "$DEST_TOOLS/ai-brain.png"
rich_compress "$SOURCE_ROOT/business-3d-icons_Njk4NjhlY2U1M2QwMGUwMDMzZGI0MzY3/Rendered PNG/Business Achievement.png" "$DEST_TOOLS/trophy.png"

# 2. GLASSIFY SOCIAL ICONS (Apply to Dashboard list)
GLASSIFY_SRC="$SOURCE_ROOT/glassify-social-media-icons_Njk4NjhlY2U1M2QwMGUwMDMzZGI0MzY3 (1)/Glassify - Social Media Icons/PNG"
rich_compress "$GLASSIFY_SRC/01_Facebook.png" "$DEST_SOCIAL/01_Facebook.png"
rich_compress "$GLASSIFY_SRC/02_Instagram.png" "$DEST_SOCIAL/02_Instagram.png"
rich_compress "$GLASSIFY_SRC/03_X.png" "$DEST_SOCIAL/03_X.png"
rich_compress "$GLASSIFY_SRC/04_LinkedIn.png" "$DEST_SOCIAL/04_LinkedIn.png"
rich_compress "$GLASSIFY_SRC/05_Youtube.png" "$DEST_SOCIAL/05_Youtube.png"
rich_compress "$GLASSIFY_SRC/06_WhatsApp.png" "$DEST_SOCIAL/06_WhatsApp.png"
rich_compress "$GLASSIFY_SRC/07_Reddit.png" "$DEST_SOCIAL/07_Reddit.png"
rich_compress "$GLASSIFY_SRC/09_Snapchat.png" "$DEST_SOCIAL/09_Snapchat.png"
rich_compress "$GLASSIFY_SRC/11_TikTok.png" "$DEST_SOCIAL/11_TikTok.png"
rich_compress "$GLASSIFY_SRC/24_Telegram.png" "$DEST_SOCIAL/24_Telegram.png"

# 3. ONBOARDING (The 4 Slaps)
rich_compress "$SOURCE_ROOT/3d-artificial-intelligence_Njk4NjhlY2U1M2QwMGUwMDMzZGI0MzY3/PNG/2 a.png" "$DEST_TOOLS/onboarding-1.png"
rich_compress "$SOURCE_ROOT/3d-marketing_Njk4NjhlY2U1M2QwMGUwMDMzZGI0MzY3/PNG/Icon-3.png" "$DEST_TOOLS/onboarding-2.png"
rich_compress "$SOURCE_ROOT/3d-seo-marketing-icons_Njk4NjhlY2U1M2QwMGUwMDMzZGI0MzY3/3D Seo & Marketing Icons/PNG/19 Marketing Strategy.png" "$DEST_TOOLS/onboarding-3.png"
rich_compress "$SOURCE_ROOT/business-3d-icons_Njk4NjhlY2U1M2QwMGUwMDMzZGI0MzY3/Rendered PNG/Rocket.png" "$DEST_TOOLS/onboarding-4.png"

# 4. REMAINING TOOL ICONS (Mass sync all premium assets)
echo "Syncing all remaining premium icons..."
find "$SOURCE_ROOT" -name "*.png" | while read -r file; do
    filename=$(basename "$file")
    new_filename=$(echo "$filename" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g; s/[^a-z0-9._-]//g')
    rich_compress "$file" "$DEST_TOOLS/$new_filename"
done

echo "TOTAL ICON OVERHAUL COMPLETE."
