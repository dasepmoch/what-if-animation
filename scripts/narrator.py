"""The What If narrator: one fixed voice for every episode (racikan "whatif-narator-v1").

Runs on the Mac, inside the TTS-ENGINE venv (OmniVoice on Apple Silicon + Whisper):

    cd ~/Documents/claude/TTS-ENGINE
    .venv/bin/python <skill>/scripts/narrator.py <episode.json> <out_dir> [--takes 2] [--beats 3,5] [--new-anchor]

Why this and not voice.py's single take: OmniVoice's voice design (instruct) is only trained on Chinese and English,
so every call drifts to a slightly different speaker. Voice cloning is its stable mode. So the recipe is:

1. ANCHOR (once, ever): design a voice with the instruct below, a few seeds, keep the take Whisper hears most
   cleanly, and save it as a clone prompt in TTS-ENGINE/refs/ (whatif-narator.wav/.txt/.pt/.json). Every later
   episode clones that same reference, so the narrator never changes. Delete the refs only to start a new voice.
2. EPISODE: each script beat is generated separately with the clone prompt and fixed seeds, `--takes` takes per beat;
   Whisper scores every take (character error rate against the script) and the cleanest one wins.
3. ASSEMBLY: trim each beat, level them to the same loudness, join them with fixed beat gaps, resample to 44.1 kHz,
   and write voice_raw.wav + words_raw.json (word timings from Whisper, matched to the script's own words).
   voice.py (provider "narrator") then tightens the pauses inside the beats exactly like every other episode.

Takes are cached by (text, recipe, seed), so re-running after a script edit only regenerates the beats that changed.

LOCK (biar suaranya sama persis tiap generate): the first anchor run writes refs/whatif-narator.lock.json with the
recipe's fingerprint, the sha256 of the anchor wav + clone prompt, and the exact model snapshots used. Every later
run checks all of it and stops if anything differs (recipe edited, refs touched, model updated) instead of quietly
producing a different voice. Models load from the pinned local snapshots with HF offline, every seed is fixed, and
--new-anchor archives the old refs to refs/archive-<time>/ rather than deleting them.
"""
import argparse, gc, hashlib, json, os, pathlib, re, sys, time

import numpy as np

os.environ.setdefault('HF_HUB_OFFLINE', '1')  # never pull a newer model mid-series

RECIPE = {
    'name': 'whatif-narator-v1',
    'language': 'Indonesian',
    'instruct': 'male, young adult, moderate pitch',
    'anchor_text': 'Bayangkan kalau besok pagi, satu hal di hidupmu berubah total. Kedengarannya seru. '
                   'Tapi tunggu sampai kamu tahu harganya.',
    'anchor_seeds': [7, 21, 42, 77],
    'num_step': 32,
    'guidance_scale': 2.0,
    't_shift': 0.1,
    'speed': 1.05,
    'beat_gap': 0.42,
    'question_gap': 0.5,
    'target_rms_db': -20.0,
    'seed_base': 1000,
}
# The exact model weights the narrator was made with. Loaded from the local HF cache; a different snapshot = stop.
MODELS = {
    'omnivoice': ('k2-fsa/OmniVoice', 'c5fdb5ccb189668d56333f77ba2629f4cd7535f4'),
    'whisper': ('openai/whisper-large-v3-turbo', '41f01f3fe87f28c78e2fbf8b568835947dd65ed9'),
}

ap = argparse.ArgumentParser()
ap.add_argument('episode')
ap.add_argument('out')
ap.add_argument('--takes', type=int, default=2)
ap.add_argument('--beats', default='', help='comma list of beat numbers (1-based) to force-regenerate')
ap.add_argument('--new-anchor', action='store_true')
ap.add_argument('--device', default=None)
args = ap.parse_args()

ENGINE = pathlib.Path(os.environ.get('TTS_ENGINE_DIR', pathlib.Path.cwd()))
if not (ENGINE / 'omnivoice').is_dir():
    sys.exit(f'Run this from the TTS-ENGINE folder (or set TTS_ENGINE_DIR); {ENGINE} has no omnivoice/.')
sys.path.insert(0, str(ENGINE))  # the script lives outside TTS-ENGINE, so put its omnivoice package on the path
REFS = ENGINE / 'refs'
REFS.mkdir(exist_ok=True)
OUT = pathlib.Path(args.out)
TAKES = OUT / 'takes'
TAKES.mkdir(parents=True, exist_ok=True)
LOG = open(OUT / 'narrator.log', 'a', encoding='utf-8')


def log(*a):
    s = ' '.join(str(x) for x in a)
    print(s, flush=True)
    LOG.write(time.strftime('%H:%M:%S ') + s + '\n')
    LOG.flush()


import torch
import soundfile as sf
from omnivoice import OmniVoice, VoiceClonePrompt, OmniVoiceGenerationConfig
import random


def snapshot(key):
    repo, rev = MODELS[key]
    hub = pathlib.Path(os.environ.get('HF_HUB_CACHE', pathlib.Path.home() / '.cache/huggingface/hub'))
    p = hub / ('models--' + repo.replace('/', '--')) / 'snapshots' / rev
    if not p.is_dir():
        sys.exit(f'Pinned {repo} snapshot {rev} not found at {p}. Download exactly that revision '
                 f'(HF_HUB_OFFLINE=0 huggingface-cli download {repo} --revision {rev}); do not use a newer one.')
    return str(p)


def seed_all(seed):
    random.seed(seed)
    np.random.seed(seed % (2 ** 32))
    torch.manual_seed(seed)  # also seeds MPS / CUDA


def load_omnivoice():
    return OmniVoice.from_pretrained(snapshot('omnivoice'), device_map=device, dtype=torch.float16)


def sha(p):
    return hashlib.sha256(pathlib.Path(p).read_bytes()).hexdigest()


def recipe_fp():
    return hashlib.sha256(json.dumps(RECIPE, sort_keys=True).encode()).hexdigest()[:16]

device = args.device or ('mps' if torch.backends.mps.is_available() else 'cpu')
ep = json.loads(pathlib.Path(args.episode).read_text(encoding='utf-8'))
beats = [b['text'].strip() for b in ep['script']]
force = {int(x) - 1 for x in args.beats.split(',') if x.strip()}


def norm_text(s):
    s = s.lower().replace('’', "'")
    s = re.sub(r'[^\w\s]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()


def cer(ref, hyp):
    a, b = norm_text(ref).replace(' ', ''), norm_text(hyp).replace(' ', '')
    if not a:
        return 1.0
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i] + [0] * len(b)
        for j, cb in enumerate(b, 1):
            cur[j] = min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb))
        prev = cur
    return prev[-1] / len(a)


def cfg():
    return OmniVoiceGenerationConfig(num_step=RECIPE['num_step'], guidance_scale=RECIPE['guidance_scale'], t_shift=RECIPE['t_shift'])


def take_key(text, seed, kind):
    h = hashlib.sha1(json.dumps([text, seed, kind, {k: RECIPE[k] for k in ('name', 'num_step', 'guidance_scale', 't_shift', 'speed', 'language')}]).encode()).hexdigest()[:10]
    return h


# ------------------------------------------------------------------ phase 1: generate (OmniVoice only in memory)
anchor_pt = REFS / 'whatif-narator.pt'
LOCK = REFS / 'whatif-narator.lock.json'
if args.new_anchor and anchor_pt.exists():
    import shutil
    arch = REFS / ('archive-' + time.strftime('%Y%m%d-%H%M%S'))
    arch.mkdir()
    for q in REFS.glob('whatif-narator*'):
        shutil.move(str(q), arch / q.name)
    log(f'--new-anchor: old narrator archived to {arch}')
need_anchor = not anchor_pt.exists()
if not need_anchor:
    if not LOCK.exists():
        sys.exit(f'{anchor_pt} exists but {LOCK} is missing: the narrator is not locked. Restore the lock file '
                 '(or archive the refs and run --new-anchor to make a new, locked narrator).')
    lk = json.loads(LOCK.read_text(encoding='utf-8'))
    bad = []
    if lk['recipe_fp'] != recipe_fp():
        bad.append(f"RECIPE changed (lock {lk['recipe_fp']} vs now {recipe_fp()}); undo the edit, the recipe is fixed")
    for name, h in lk['files'].items():
        if not (REFS / name).exists() or sha(REFS / name) != h:
            bad.append(f'refs/{name} differs from the locked file')
    if lk['models'] != {k: v[1] for k, v in MODELS.items()}:
        bad.append(f"model snapshots differ: lock {lk['models']}")
    if bad:
        sys.exit('NARRATOR LOCK FAILED, nothing generated:\n - ' + '\n - '.join(bad))
    log(f"narrator lock OK ({RECIPE['name']}, recipe {recipe_fp()}, anchor seed {lk['anchor_seed']})")
plan = []  # (beat index, take index, seed, path)
for i, text in enumerate(beats):
    for k in range(args.takes):
        seed = RECIPE['seed_base'] + 17 * i + k
        p = TAKES / f'b{i + 1:02d}_t{k + 1}_{take_key(text, seed, "clone")}.wav'
        plan.append((i, k, seed, p))
todo = [x for x in plan if x[0] in force or not x[3].exists()]
anchor_cands = [REFS / f'whatif-narator-cand-{s}.wav' for s in RECIPE['anchor_seeds']]

if need_anchor or todo:
    log(f'Loading OmniVoice on {device} ...')
    t0 = time.time()
    model = load_omnivoice()
    SR_M = model.sampling_rate
    log(f'Model loaded in {time.time() - t0:.0f}s (sr {SR_M})')
    if need_anchor:
        for s, p in zip(RECIPE['anchor_seeds'], anchor_cands):
            seed_all(s)
            t1 = time.time()
            a = model.generate(text=RECIPE['anchor_text'], language=RECIPE['language'], instruct=RECIPE['instruct'], speed=RECIPE['speed'], generation_config=cfg())[0]
            sf.write(str(p), a, SR_M)
            log(f'anchor candidate seed {s}: {len(a) / SR_M:.2f}s in {time.time() - t1:.0f}s')
        # free and come back for the clone pass after the anchor is chosen (needs Whisper)
    if need_anchor:
        del model
        gc.collect()
        if device == 'mps':
            torch.mps.empty_cache()
        model = None
else:
    model = None

# ------------------------------------------------------------------ Whisper helper
_asr = None


def asr():
    global _asr
    if _asr is None:
        from transformers import pipeline
        log('Loading Whisper large-v3-turbo ...')
        _asr = pipeline('automatic-speech-recognition', model=snapshot('whisper'), device=device, return_timestamps='word')
    return _asr


def transcribe(path):
    r = asr()(str(path), generate_kwargs={'language': 'id', 'task': 'transcribe'})
    return r.get('text', ''), r.get('chunks', [])


def free_asr():
    global _asr
    _asr = None
    gc.collect()
    if device == 'mps':
        torch.mps.empty_cache()


# ------------------------------------------------------------------ anchor choice
if need_anchor:
    scores = []
    for s, p in zip(RECIPE['anchor_seeds'], anchor_cands):
        txt, _ = transcribe(p)
        x, sr = sf.read(str(p))
        dur = len(x) / sr
        wps = len(RECIPE['anchor_text'].split()) / dur
        c = cer(RECIPE['anchor_text'], txt)
        score = c + abs(wps - 2.6) * 0.03
        scores.append((score, s, p, c, dur, txt))
        log(f'anchor seed {s}: CER {c:.3f}, {dur:.2f}s, {wps:.2f} w/s | {txt.strip()}')
    scores.sort()
    best = scores[0]
    free_asr()
    import shutil
    shutil.copy(best[2], REFS / 'whatif-narator.wav')
    (REFS / 'whatif-narator.txt').write_text(RECIPE['anchor_text'], encoding='utf-8')
    log(f'Anchor chosen: seed {best[1]} (CER {best[3]:.3f})')
    model = load_omnivoice()
    SR_M = model.sampling_rate
    prompt = model.create_voice_clone_prompt(ref_audio=str(REFS / 'whatif-narator.wav'), ref_text=RECIPE['anchor_text'])
    prompt.save(str(anchor_pt))
    meta = dict(RECIPE, anchor_seed=best[1], anchor_cer=best[3], created=time.strftime('%Y-%m-%d %H:%M'),
                candidates=[{'seed': s, 'cer': round(c, 4), 'dur': round(d, 2), 'heard': t.strip()} for _, s, _, c, d, t in scores])
    (REFS / 'whatif-narator.json').write_text(json.dumps(meta, indent=1, ensure_ascii=False), encoding='utf-8')
    files = {n: sha(REFS / n) for n in ('whatif-narator.wav', 'whatif-narator.txt', 'whatif-narator.pt')}
    LOCK.write_text(json.dumps({'recipe': RECIPE['name'], 'recipe_fp': recipe_fp(), 'anchor_seed': best[1],
                                'models': {k: v[1] for k, v in MODELS.items()}, 'files': files,
                                'torch': torch.__version__, 'device': device, 'created': time.strftime('%Y-%m-%d %H:%M')},
                               indent=1), encoding='utf-8')
    log(f'Narrator LOCKED -> {LOCK}')

# ------------------------------------------------------------------ episode takes
if todo:
    if model is None:
        model = load_omnivoice()
        SR_M = model.sampling_rate
    prompt = VoiceClonePrompt.load(str(anchor_pt))
    for i, k, seed, p in todo:
        seed_all(seed)
        t1 = time.time()
        a = model.generate(text=beats[i], language=RECIPE['language'], voice_clone_prompt=prompt, speed=RECIPE['speed'], generation_config=cfg())[0]
        sf.write(str(p), a, SR_M)
        log(f'beat {i + 1} take {k + 1}: {len(a) / SR_M:.2f}s in {time.time() - t1:.0f}s')
if model is not None:
    del model
    gc.collect()
    if device == 'mps':
        torch.mps.empty_cache()

# ------------------------------------------------------------------ phase 2: score takes, align words
report = []
chosen = []
for i, text in enumerate(beats):
    cands = []
    for (bi, k, seed, p) in plan:
        if bi != i:
            continue
        cache = p.with_suffix('.asr.json')
        if cache.exists() and i not in force:
            d = json.loads(cache.read_text(encoding='utf-8'))
        else:
            txt, chunks = transcribe(p)
            d = {'text': txt, 'chunks': [{'text': c['text'], 'timestamp': list(c['timestamp'])} for c in chunks]}
            cache.write_text(json.dumps(d, ensure_ascii=False), encoding='utf-8')
        x, sr = sf.read(str(p))
        c = cer(text, d['text'])
        exp = len(text.split()) / 2.55
        cands.append({'take': k + 1, 'seed': seed, 'path': p, 'cer': c, 'dur': len(x) / sr, 'exp': exp, 'asr': d})
    cands.sort(key=lambda c: (round(c['cer'], 2), abs(c['dur'] - c['exp'])))
    best = cands[0]
    chosen.append(best)
    report.append({'beat': i + 1, 'text': text, 'chosen': best['take'],
                   'takes': [{'take': c['take'], 'seed': c['seed'], 'cer': round(c['cer'], 4), 'dur': round(c['dur'], 2), 'heard': c['asr']['text'].strip()} for c in cands]})
    log(f'beat {i + 1}: take {best["take"]} (CER {best["cer"]:.3f}) | {best["asr"]["text"].strip()}')
free_asr()


# ------------------------------------------------------------------ assembly
def trim(x, sr):
    fr = int(0.01 * sr)
    n = len(x) // fr
    e = np.array([np.sqrt(np.mean(x[j * fr:(j + 1) * fr] ** 2) + 1e-12) for j in range(n)])
    thr = e.max() * 10 ** (-40 / 20)
    on = np.where(e > thr)[0]
    if len(on) == 0:
        return x, 0.0
    a = max(0, on[0] * fr - int(0.04 * sr))
    b = min(len(x), (on[-1] + 1) * fr + int(0.08 * sr))
    return x[a:b], a / sr


def voiced_rms_db(x, sr):
    fr = int(0.02 * sr)
    e = np.array([np.sqrt(np.mean(x[j * fr:(j + 1) * fr] ** 2) + 1e-12) for j in range(len(x) // fr)])
    v = e[e > e.max() * 0.1]
    return 20 * np.log10(np.sqrt(np.mean(v ** 2)) + 1e-12)


def tokens(text):
    out = []
    for tok in text.split():
        m = re.search(r"([^\w\s'’-]+)$", tok)
        p = m.group(1) if m else ''
        w = tok[:m.start()] if m else tok
        w = re.sub(r"^[^\w'’-]+", '', w)
        if w:
            out.append({'w': w, 'p': p})
    return out


def align(script_tokens, chunks, total):
    items = []
    for c in chunks:
        raw = c.get('text', '').strip()
        if not raw:
            continue
        s, e = c['timestamp'][0] or 0.0, c['timestamp'][1]
        e = e if e is not None else min(total, s + 0.35)
        parts = raw.split()
        pd = max(0.08, e - s) / max(1, len(parts))
        for j, part in enumerate(parts):
            w = re.sub(r"[^\w'’-]", '', part)
            if w:
                items.append({'w': w, 's': s + j * pd, 'e': s + (j + 1) * pd})
    nrm = lambda s: re.sub(r"[^\w']", '', s.lower().replace('’', "'"))
    out, wi = [], 0
    for sw in script_tokens:
        hit = None
        for j in range(wi, min(wi + 6, len(items))):
            if nrm(items[j]['w']) == nrm(sw['w']):
                hit = j
                break
        if hit is not None:
            it = items[hit]
            out.append({'w': sw['w'], 's': it['s'], 'e': max(it['e'], it['s'] + 0.05), 'p': sw['p'], 'm': 1})
            wi = hit + 1
        else:
            out.append({'w': sw['w'], 's': None, 'e': None, 'p': sw['p'], 'm': 0})
    # fill unmatched words by spreading them between their matched neighbours
    k = 0
    while k < len(out):
        if out[k]['m']:
            k += 1
            continue
        j = k
        while j < len(out) and not out[j]['m']:
            j += 1
        a = out[k - 1]['e'] if k > 0 else 0.0
        b = out[j]['s'] if j < len(out) else total
        n = j - k
        span = max(0.12 * n, b - a)
        for q in range(n):
            out[k + q]['s'] = a + span * q / n + 0.01
            out[k + q]['e'] = a + span * (q + 1) / n - 0.01
        k = j
    for w in out:
        w.pop('m', None)
    return out


SR_OUT = 44100
pieces, words, cursor = [], [], 0.0
target = RECIPE['target_rms_db']
for i, c in enumerate(chosen):
    x, sr = sf.read(str(c['path']))
    if x.ndim > 1:
        x = x.mean(axis=1)
    x, off = trim(x.astype(np.float64), sr)
    x = x * 10 ** ((target - voiced_rms_db(x, sr)) / 20)
    dur = len(x) / sr
    ws = align(tokens(beats[i]), c['asr']['chunks'], dur + off)
    for w in ws:
        w['s'] = round(max(0.0, w['s'] - off) + cursor, 3)
        w['e'] = round(min(dur, max(0.0, w['e'] - off)) + cursor, 3)
    words += ws
    pieces.append((x, sr))
    gap = RECIPE['question_gap'] if beats[i].rstrip().endswith('?') else RECIPE['beat_gap']
    cursor += dur + (gap if i < len(chosen) - 1 else 0)

import torchaudio.functional as AF
out = []
for i, (x, sr) in enumerate(pieces):
    y = AF.resample(torch.from_numpy(x).float(), sr, SR_OUT).numpy()
    out.append(y)
    if i < len(pieces) - 1:
        gap = RECIPE['question_gap'] if beats[i].rstrip().endswith('?') else RECIPE['beat_gap']
        out.append(np.zeros(int(round(gap * SR_OUT))))
y = np.concatenate(out)
peak = np.abs(y).max()
if peak > 0.97:
    y = y * 0.97 / peak
sf.write(str(OUT / 'voice_raw.wav'), y, SR_OUT, subtype='PCM_16')
(OUT / 'words_raw.json').write_text(json.dumps(words, indent=1, ensure_ascii=False), encoding='utf-8')
(OUT / 'narrator_report.json').write_text(json.dumps({'recipe': RECIPE, 'duration': round(len(y) / SR_OUT, 2), 'beats': report}, indent=1, ensure_ascii=False), encoding='utf-8')
log(f'DONE voice_raw.wav {len(y) / SR_OUT:.2f}s, {len(words)} words')
