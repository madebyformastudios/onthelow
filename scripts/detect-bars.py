"""Finds baked-in black bars at the top/bottom of Flow images -> src/shotBars.json (fractions of image height).
   python3 scripts/detect-bars.py public/shots"""
import glob, json, os, subprocess, sys

W, H = 64, 112
out = {}
for f in sorted(glob.glob(os.path.join(sys.argv[1], "*.jpg"))):
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", f, "-vf", f"scale={W}:{H}", "-pix_fmt", "gray", "-f", "rawvideo", "-"],
                         capture_output=True).stdout
    rows = [raw[y * W:(y + 1) * W] for y in range(H)]
    dark = [max(r) < 22 and sum(r) / W < 8 for r in rows]
    top = next((i for i, d in enumerate(dark) if not d), H)
    bot = next((i for i, d in enumerate(reversed(dark)) if not d), H)
    if top / H > 0.02 or bot / H > 0.02:
        out[os.path.splitext(os.path.basename(f))[0]] = {"top": round(top / H, 3), "bottom": round(bot / H, 3)}
json.dump(out, open("src/shotBars.json", "w"), indent=1)
print(out)
