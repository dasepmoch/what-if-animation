"""Export an episode's subtitles as .srt from words.json, chunked exactly like the burned-in captions
(src/engine/captions.tsx chunkWords: max 3 words / 16 letters, break at punctuation and pauses > 0.28 s).

    python3 scripts/subtitles.py <words.json> <out.srt> [--delay 0.0] [--max-words 3] [--max-chars 16] [--gap 0.28]

Upload the .srt to YouTube alongside the video (the burned-in captions are what viewers see on Shorts; the .srt
gives YouTube searchable, toggleable text with the same timing).
"""
import argparse, json, re

ap = argparse.ArgumentParser()
ap.add_argument('words')
ap.add_argument('out')
ap.add_argument('--delay', type=float, default=0.0)
ap.add_argument('--max-words', type=int, default=3)
ap.add_argument('--max-chars', type=int, default=16)
ap.add_argument('--gap', type=float, default=0.28)
a = ap.parse_args()

words = json.load(open(a.words, encoding='utf-8'))
chunks, cur = [], []


def flush():
    global cur
    if cur:
        chunks.append(cur)
    cur = []


for i, w in enumerate(words):
    chars = sum(len(x['w']) + 1 for x in cur) + len(w['w'])
    if cur and (len(cur) >= a.max_words or chars > a.max_chars):
        flush()
    cur.append(w)
    nxt = words[i + 1] if i + 1 < len(words) else None
    if re.search(r'[.?!,;:…]', w.get('p', '')) or nxt is None or nxt['s'] - w['e'] > a.gap:
        flush()


def ts(t):
    ms = max(0, int(round(t * 1000)))
    return f'{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}'


lines = []
for i, c in enumerate(chunks):
    s = c[0]['s'] - 0.05
    nxt = chunks[i + 1][0]['s'] - 0.05 if i + 1 < len(chunks) else float('inf')
    e = min(nxt, c[-1]['e'] + 0.5)
    text = ' '.join(x['w'] + x.get('p', '') for x in c)
    lines.append(f'{i + 1}\n{ts(s + a.delay)} --> {ts(e + a.delay)}\n{text}\n')
open(a.out, 'w', encoding='utf-8').write('\n'.join(lines))
print(f'{len(chunks)} subtitles -> {a.out}')
