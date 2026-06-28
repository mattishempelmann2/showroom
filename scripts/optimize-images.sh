#!/usr/bin/env bash
#
# Optimize images in public/images for the web:
#   - cap the longest side at MAX px (only shrinks, never upscales)
#   - recompress JPEG/PNG at QUALITY
#   - strip metadata (EXIF, etc.)
#
# Runs in place (same filenames, so no code changes needed).
# Skips the unused "andere dateien" / "andre bilder" extras folders.
#
# Requires ImageMagick (`magick`). Usage: bash scripts/optimize-images.sh
set -euo pipefail

MAX=${MAX:-2048}
QUALITY=${QUALITY:-82}
DIR=${DIR:-public/images}

total_before=0
total_after=0

while IFS= read -r -d '' f; do
  before=$(stat -f%z "$f")
  magick mogrify -resize "${MAX}x${MAX}>" -quality "$QUALITY" -strip "$f"
  after=$(stat -f%z "$f")
  total_before=$((total_before + before))
  total_after=$((total_after + after))
  printf '%6.2f MB -> %6.2f MB  %s\n' \
    "$(echo "$before/1048576" | bc -l)" "$(echo "$after/1048576" | bc -l)" "$f"
done < <(find "$DIR" -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) \
           -not -path '*andere*' -not -path '*andre*' -print0)

printf '\nTOTAL: %6.2f MB -> %6.2f MB\n' \
  "$(echo "$total_before/1048576" | bc -l)" "$(echo "$total_after/1048576" | bc -l)"
