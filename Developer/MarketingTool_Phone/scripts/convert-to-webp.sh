#!/bin/bash
# Convert all PNG / JPG in assets/images/ to WebP, then update source refs.
# Safety: only deletes original after verifying the .webp exists and is non-empty.
#
# PNG  → lossless WebP (preserves alpha channel)
# JPG  → lossy WebP, q=80 (good visual fidelity, big size win)

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMG_DIR="$ROOT/assets/images"
SRC_DIR="$ROOT/src"

if [ ! -d "$IMG_DIR" ]; then
  echo "❌ $IMG_DIR not found"
  exit 1
fi

before=$(du -sh "$IMG_DIR" | awk '{print $1}')
png_count=$(find "$IMG_DIR" -type f -name '*.png' | wc -l | tr -d ' ')
jpg_count=$(find "$IMG_DIR" -type f -name '*.jpg' | wc -l | tr -d ' ')
echo "📊 Before: $before across $png_count PNG + $jpg_count JPG"

convert_one() {
  local in="$1"
  local out="${in%.*}.webp"
  local ext="${in##*.}"

  if [ -f "$out" ]; then
    return 0   # already converted
  fi

  if [ "$ext" = "png" ]; then
    cwebp -quiet -lossless -z 9 "$in" -o "$out"
  else
    cwebp -quiet -q 80 -m 6 "$in" -o "$out"
  fi

  # Sanity: WebP must exist and be non-empty before we delete the original.
  if [ -s "$out" ]; then
    rm "$in"
  else
    echo "⚠️  conversion failed for $in — keeping original"
    rm -f "$out"
    return 1
  fi
}
export -f convert_one

# Convert PNG + JPG in parallel (8 workers)
find "$IMG_DIR" -type f \( -name '*.png' -o -name '*.jpg' \) -print0 \
  | xargs -0 -P 8 -I {} bash -c 'convert_one "$@"' _ {}

after=$(du -sh "$IMG_DIR" | awk '{print $1}')
webp_count=$(find "$IMG_DIR" -type f -name '*.webp' | wc -l | tr -d ' ')
echo "✅ After:  $after across $webp_count WebP"

# Update source references: .png / .jpg → .webp
# Only inside paths that point at assets/images/ (avoid touching non-asset filenames).
echo "🔧 Updating source refs in $SRC_DIR …"
# macOS sed needs '' after -i
SED_INPLACE=(-i '')
if sed --version >/dev/null 2>&1; then
  SED_INPLACE=(-i)   # GNU sed
fi

# Match: 'something/assets/images/...path.png' → '...path.webp'
find "$SRC_DIR" -type f \( -name '*.ts' -o -name '*.tsx' -o -name '*.js' -o -name '*.jsx' \) -print0 \
  | xargs -0 sed "${SED_INPLACE[@]}" -E 's#(assets/images/[^"'"'"']+)\.(png|jpg)#\1.webp#g'

# Also update top-level files that reference the icon directly
for f in "$ROOT/app.json" "$ROOT/app.config.js"; do
  [ -f "$f" ] || continue
  sed "${SED_INPLACE[@]}" -E 's#(assets/[^"'"'"']+)\.(png|jpg)#\1.webp#g' "$f"
done

remaining=$(grep -rE "assets/images/[^\"']+\.(png|jpg)" "$SRC_DIR" 2>/dev/null | wc -l | tr -d ' ')
echo "🔍 Remaining .png/.jpg refs into assets/images/ in src/: $remaining (should be 0)"

echo "🎉 Done. Diff:"
echo "   Images: $before → $after"
echo "   Files:  $((png_count + jpg_count)) PNG/JPG → $webp_count WebP"
