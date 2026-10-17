"""
Builds web-ready images from the raw files in ./Assets into ./public/assets.

Run from the project root:  python scripts/process_images.py
Requires Pillow (pip install Pillow).

Each source photo is exported as WebP at several widths so the browser can
pick the right size (see `srcset` in the components). To add a new event or
team member, add an entry to EVENTS or TEAM below, run the script, then add
the matching record to src/data/events.ts or src/data/team.ts.
"""
from pathlib import Path
import json
import shutil
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "Assets"
OUT = ROOT / "public" / "assets"

# (source path, output name, crop box in source pixels or None)
# SASVerse photos carry a "GPS Map Camera" stamp across the bottom third;
# the crops keep the subject and leave the stamp out.
EVENTS = {
    "initial-commit": [
        ("Events/Initial Commit/Photos/wmremove-transformed(3).jpeg", "group", None),
        ("Events/Initial Commit/Photos/wmremove-transformed(1).jpeg", "opening-address", None),
        ("Events/Initial Commit/Photos/wmremove-transformed(2).jpeg", "session", None),
    ],
    "sasverse": [
        ("Events/SASvers/Photo/WhatsApp Image 2026-10-09 at 6.59.41 PM (1).jpeg", "overview", (0, 0, 1230, 820)),
        ("Events/SASvers/Photo/WhatsApp Image 2026-10-09 at 6.59.41 PM (2).jpeg", "sas-studio", (180, 0, 1410, 820)),
        ("Events/SASvers/Photo/WhatsApp Image 2026-10-09 at 6.59.41 PM.jpeg", "session", (0, 0, 1230, 820)),
    ],
}
EVENT_WIDTHS = (640, 1280, 1920)

# (source file, output slug, focus x, focus y, crop scale 0-1)
TEAM = [
    ("Dr Praveen Kumar Loharkar_Faculty Sponsor.jpg", "praveen-kumar-loharkar", 0.5, 0.42, 1.0),
    ("Mohammad Saad Nathani_Chair.jpeg", "mohammad-saad-nathani", 0.42, 0.52, 0.62),
    ("Shashwat Jain_Vice Chair.dng", "shashwat-jain", 0.5, 0.42, 0.78),
    ("RESHMA PATIL_Secretary.jpg", "reshma-patil", 0.5, 0.45, 1.0),
    ("Pranav Mundhra_Treasurer.jpg", "pranav-mundhra", 0.5, 0.45, 1.0),
    ("Riddhima Sharma_Membership Chair.jpg", "riddhima-sharma", 0.45, 0.5, 0.9),
    ("Aditya Agrawal_Web Master.jpeg", "aditya-agrawal", 0.5, 0.45, 1.0),
    ("Anushka Sharma_Executive Advisor.jpg", "anushka-sharma", 0.5, 0.42, 0.85),
]
TEAM_WIDTHS = (400, 800)

MANIFEST = {}


def load(path: Path) -> Image.Image:
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)
    return im.convert("RGB")


def save_widths(im: Image.Image, dest: Path, widths, quality=78):
    """Saves <name>-<width>.webp for each width, never upscaling, and records
    the result in MANIFEST so components can build srcset and avoid layout shift."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    targets = sorted({min(w, im.width) for w in widths})
    for w in targets:
        copy = im if w == im.width else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        copy.save(dest.with_name(f"{dest.name}-{w}.webp"), "WEBP", quality=quality, method=6)
    key = "assets/" + dest.relative_to(OUT).as_posix()
    MANIFEST[key] = {"widths": targets, "width": im.width, "height": im.height}
    return targets


def focus_crop(im: Image.Image, fx: float, fy: float, scale: float, ratio=4 / 5):
    w, h = im.size
    ch = min(h, w / ratio) * scale
    cw = ch * ratio
    left = min(max(fx * w - cw / 2, 0), w - cw)
    top = min(max(fy * h - ch / 2, 0), h - ch)
    return im.crop((round(left), round(top), round(left + cw), round(top + ch)))


def main():
    for sub in ("events", "team"):
        shutil.rmtree(OUT / sub, ignore_errors=True)
    for slug, photos in EVENTS.items():
        for src, name, box in photos:
            im = load(SRC / src)
            if box:
                im = im.crop(box)
            sizes = save_widths(im, OUT / "events" / slug / name, EVENT_WIDTHS)
            print(f"events/{slug}/{name}", im.size, sizes)

    for src, slug, fx, fy, scale in TEAM:
        im = focus_crop(load(SRC / "office bearers" / src), fx, fy, scale)
        save_widths(im, OUT / "team" / slug, TEAM_WIDTHS, quality=80)
        print(f"team/{slug}", im.size)

    logo = Image.open(SRC / "Logo" / "acm.png").convert("RGBA")
    logo = logo.crop(logo.getbbox())
    (OUT / "brand").mkdir(parents=True, exist_ok=True)
    for w in (256, 512):
        l = logo.resize((w, round(logo.height * w / logo.width)), Image.LANCZOS)
        l.save(OUT / "brand" / f"acm-chapter-logo-{w}.webp", "WEBP", quality=90)
        l.save(OUT / "brand" / f"acm-chapter-logo-{w}.png", optimize=True)

    # Social share image (1200x630) from the Initial Commit group photo.
    og = load(SRC / EVENTS["initial-commit"][0][0])
    og = ImageOps.fit(og, (1200, 630), Image.LANCZOS, centering=(0.5, 0.62))
    og.save(ROOT / "public" / "og-image.jpg", "JPEG", quality=82, optimize=True, progressive=True)
    manifest = ROOT / "src" / "data" / "image-manifest.json"
    manifest.parent.mkdir(parents=True, exist_ok=True)
    manifest.write_text(json.dumps(MANIFEST, indent=2) + "\n")
    print("wrote", manifest.relative_to(ROOT))


if __name__ == "__main__":
    main()
