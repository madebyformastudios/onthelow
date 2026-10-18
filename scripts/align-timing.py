"""Aligns the script text in voiceover.md to whisper.cpp word timestamps -> timing.json.

  ffmpeg -i public/voice/<ep>.wav -ar 16000 -ac 1 /tmp/vo16.wav
  whisper-cli -m <model> -f /tmp/vo16.wav -ml 1 -sow -ojf -of episodes/<ep>/vo-words -np
  python3 scripts/align-timing.py a-part-1 voice/a-part-1.wav 105.84

The script text (not whisper's spelling, e.g. "$50,000") is what ends up in timing.json; whisper only supplies times.
"""
import difflib, json, re, subprocess, sys

ep, audio, audio_len = sys.argv[1], sys.argv[2], float(sys.argv[3])
IDS = ["hook", "title", "p1", "p2", "rule", "d2a", "d2b", "d2c", "d3", "temptation", "end"]
norm = lambda w: re.sub(r"[^a-z0-9]", "", w.lower())

md = open(f"episodes/{ep}/voiceover.md").read()
body = md.split("## Per beat")[1].split("## Volledige tekst")[0]
texts = re.findall(r"\*\*[\d:]+-[\d:]+ · .+?\*\*\n\n(.+?)\n", body)
assert len(texts) == len(IDS)

script = [(i, w) for i, t in enumerate(texts) for w in t.split()]
sn = [norm(w) for _, w in script]

wh = [x for x in json.load(open(f"episodes/{ep}/vo-words.json"))["transcription"] if x["text"].strip()]
wn = [norm(x["text"]) for x in wh]
ws = [x["offsets"]["from"] / 1000 for x in wh]
we = [x["offsets"]["to"] / 1000 for x in wh]

start = [None] * len(script)
end = [None] * len(script)
ops = difflib.SequenceMatcher(None, sn, wn, autojunk=False).get_opcodes()
for k, (tag, i1, i2, j1, j2) in enumerate(ops):
    if tag == "equal":
        for d in range(i2 - i1):
            start[i1 + d], end[i1 + d] = ws[j1 + d], we[j1 + d]
        continue
    t0 = ws[j1] if j1 < j2 else (we[j1 - 1] if j1 > 0 else 0.0)
    t1 = we[j2 - 1] if j1 < j2 else (ws[j1] if j1 < len(ws) else audio_len)
    wts = [len(script[i][1]) + 2 for i in range(i1, i2)]
    tot, t = sum(wts) or 1, t0
    for d, i in enumerate(range(i1, i2)):
        dur = (t1 - t0) * wts[d] / tot
        start[i], end[i] = t, t + dur
        t += dur

# whisper starts a word at the end of the previous one, so a word after a pause begins too early.
# Snap such starts forward to where speech actually resumes (ffmpeg silencedetect), and cut ends back to it.
log = subprocess.run(["ffmpeg", "-hide_banner", "-i", f"public/{audio}", "-af", "silencedetect=noise=-38dB:d=0.12", "-f", "null", "-"],
                     capture_output=True, text=True).stderr
ss = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", log)]
se = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", log)]
gaps = list(zip(ss, se))
snapped = 0
for i in range(len(script)):
    for a_, b_ in gaps:
        if a_ - 0.02 <= start[i] < b_ - 0.03:
            start[i], snapped = b_, snapped + 1
            end[i] = max(end[i], start[i] + 0.1)
            break
for i in range(len(script) - 1):
    end[i] = max(start[i] + 0.05, min(end[i], start[i + 1]))
end[-1] = min(end[-1], audio_len)

beats, cursor = [], 0.0
for b, id_ in enumerate(IDS):
    idx = [i for i, (bi, _) in enumerate(script) if bi == b]
    b_end = audio_len + 0.6 if b == len(IDS) - 1 else max(end[idx[-1]], start[idx[-1] + 1] - 0.15)
    beats.append({
        "id": id_, "start": round(cursor, 3), "end": round(b_end, 3),
        "words": [{"w": script[i][1], "start": round(start[i], 3), "end": round(end[i], 3)} for i in idx],
    })
    cursor = b_end

json.dump({"estimated": False, "audio": audio, "duration": round(cursor, 3), "beats": beats},
          open(f"episodes/{ep}/timing.json", "w"), indent=1)
unmatched = sum(1 for tag, i1, i2, j1, j2 in ops if tag != "equal" for _ in range(i2 - i1))
print(f"{ep}: {cursor:.1f} s, {unmatched}/{len(script)} script words interpolated, {snapped} starts snapped to speech onset")
