#!/usr/bin/env python3
"""Re-encode oversized images in public/ in place, filenames unchanged.

Anything over THRESHOLD bytes is capped at MAX_W wide and re-saved with sane
quality. Run after adding screenshots:

    python3 scripts/optimize-assets.py [--dry-run]

Videos are NOT handled here -- they need ffmpeg. See the note printed at the end.
"""
import os, sys
from PIL import Image

ROOT = "public"
THRESHOLD = 120 * 1024      # only touch images above this
MAX_W = 1200                # cap width
JPEG_Q, WEBP_Q = 82, 80
SKIP = {"recording.webp"}   # animated; handled separately

def optimize(path, dry=False):
    before = os.path.getsize(path)
    if before <= THRESHOLD or os.path.basename(path) in SKIP:
        return None
    try:
        im = Image.open(path)
    except Exception as e:
        print(f"  skip (unreadable) {path}: {e}")
        return None
    fmt = (im.format or "").upper()
    # MPO is a multi-frame JPEG from phone cameras; frame 0 is the real photo.
    # Genuinely animated formats are left to the webp path.
    if getattr(im, "n_frames", 1) > 1 and fmt != "MPO":
        return None
    if fmt == "MPO":
        im.seek(0)
    w, h = im.size
    if w > MAX_W:
        im = im.resize((MAX_W, round(h * MAX_W / w)), Image.LANCZOS)
    if dry:
        return (before, before, w, im.size[0])

    if fmt == "PNG":
        # flatten palette-friendly PNGs; keep alpha when present
        if im.mode not in ("RGBA", "RGB", "P"):
            im = im.convert("RGBA" if "A" in im.getbands() else "RGB")
        im.save(path, "PNG", optimize=True)
    elif fmt in ("JPEG", "MPO"):
        im.convert("RGB").save(path, "JPEG", quality=JPEG_Q, optimize=True, progressive=True)
    elif fmt == "WEBP":
        im.save(path, "WEBP", quality=WEBP_Q, method=6)
    else:
        return None
    return (before, os.path.getsize(path), w, im.size[0])

def main():
    dry = "--dry-run" in sys.argv
    saved = touched = 0
    for dp, _, files in os.walk(ROOT):
        for f in sorted(files):
            if not f.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                continue
            p = os.path.join(dp, f)
            r = optimize(p, dry)
            if not r:
                continue
            b, a, w0, w1 = r
            touched += 1
            saved += b - a
            print(f"  {b/1e6:6.2f} -> {a/1e6:5.2f} MB  {w0:>5}px -> {w1:<5}px  {p}")
    print(f"\n{touched} images, saved {saved/1e6:.1f} MB{' (dry run)' if dry else ''}")

if __name__ == "__main__":
    main()
