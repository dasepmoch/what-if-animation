"""Step 2: the voice. Local OmniVoice (default) or ElevenLabs text-to-speech with character/word timestamps,
then the pauses tightened to the genre's pace.

python <skill>/scripts/voice.py <slug> [--force]
Reads  src/episodes/<slug>/episode.json  (script, voice, gaps)
Writes public/<slug>/voice_raw.wav (or mp3), public/<slug>/voice.wav (tightened),
       src/episodes/<slug>/words.json (word timings after tightening, used by plan.py)
       and out/<slug>/words_raw.json. Prints credits or offline status.
The engine is only called when the text or voice settings change (cached by a hash), so re-running to retune the
gaps is free.

episode.json "voice" (all optional):
  Local OmniVoice (default):
    {"provider": "omnivoice", "language": "English", "speed": 1.0, "num_step": 32,
     "instruct": "male, energetic narrator", "ref_audio": "refs/voice.wav"}
  ElevenLabs:
    {"provider": "elevenlabs", "id": "TX3LPaxmHKxFdv7VOQHJ", "model": "eleven_multilingual_v2",
     "settings": {"stability": 0.4, "similarity_boost": 0.8, "style": 0.35, "use_speaker_boost": true}}

episode.json "gaps" (seconds, all optional): {"word": 0.12, "comma": 0.2, "sentence": 0.3, "question": 0.45,
  "pairs": {"anything|One": 0.6}}  -> every pause longer than its limit is cut to the limit, from its middle.
"""
import os, pathlib, sys

# Ensure scripts folder is on sys.path so wi can be imported
scripts_dir = pathlib.Path(__file__).resolve().parent
if str(scripts_dir) not in sys.path:
    sys.path.insert(0, str(scripts_dir))

TTS_ENGINE_DIR = os.environ.get('TTS_ENGINE_DIR', os.path.expanduser('~/Documents/VIDEOS-PROJECT/TTS-ENGINE'))
tts_venv_python = pathlib.Path(TTS_ENGINE_DIR) / '.venv' / 'bin' / 'python'

# Auto re-exec under TTS-ENGINE venv if available and not already running inside it
if tts_venv_python.exists() and os.environ.get('VIRTUAL_ENV') != str(tts_venv_python.parent.parent):
    try:
        import numpy, omnivoice  # noqa: F401
    except ImportError:
        env = dict(os.environ)
        env['TTS_ENGINE_DIR'] = str(TTS_ENGINE_DIR)
        env['VIRTUAL_ENV'] = str(tts_venv_python.parent.parent)
        env['PATH'] = str(tts_venv_python.parent) + ':' + env.get('PATH', '')
        os.execve(str(tts_venv_python), [str(tts_venv_python), *sys.argv], env)

import base64, hashlib, json, platform, re, time

import numpy as np

from wi import SR, api, spent_since, decode, ep_dir, load_episode, load_json, log_cost, out_dir, pub_dir, save_json, write_wav

slug = sys.argv[1]
force = '--force' in sys.argv
ep = load_episode(slug)

V_raw = ep.get('voice', {})
provider = V_raw.get('provider')
if not provider:
    # If explicit elevenlabs voice ID or settings provided without provider, keep elevenlabs, else omnivoice
    provider = 'elevenlabs' if ('id' in V_raw or 'model' in V_raw or 'settings' in V_raw) else 'omnivoice'

if provider == 'elevenlabs':
    V = {'provider': 'elevenlabs', 'id': 'TX3LPaxmHKxFdv7VOQHJ', 'model': 'eleven_multilingual_v2', 'settings': {'stability': 0.4, 'similarity_boost': 0.8, 'style': 0.35, 'use_speaker_boost': True}}
    V.update(V_raw)
else:
    V = {'provider': 'omnivoice', 'language': 'Indonesian', 'speed': 1.0, 'num_step': 32, 'model': 'k2-fsa/OmniVoice'}
    V.update(V_raw)

text = ' '.join(b['text'].strip() for b in ep['script'])
sig = hashlib.sha1(json.dumps([text, V], sort_keys=True).encode()).hexdigest()[:12]
raw_audio = pub_dir(slug) / ('voice_raw.mp3' if provider == 'elevenlabs' else 'voice_raw.wav')
if not raw_audio.exists():
    for alt in [pub_dir(slug) / 'voice_raw.wav', pub_dir(slug) / 'voice_raw.mp3']:
        if alt.exists():
            raw_audio = alt
            break

raw_words = out_dir(slug) / 'words_raw.json'
meta = load_json(out_dir(slug) / 'voice_meta.json', {})


def parse_script_tokens(script_items):
    tokens = []
    for item in script_items:
        t = item.get('text', '').strip()
        for tok in t.split():
            m = re.search(r"([^\w\s'’-]+)$", tok)
            p = m.group(1) if m else ''
            w = tok[:m.start()] if m else tok
            w = re.sub(r"^[^\w'’-]+", '', w)
            if w:
                tokens.append({'w': w, 'p': p})
    return tokens


def align_script_with_whisper(script_tokens, whisper_chunks, total_dur):
    w_items = []
    for c in whisper_chunks:
        raw_text = c.get('text', '').strip()
        if not raw_text:
            continue
        ts = c.get('timestamp') or (0.0, None)
        s = ts[0] if ts[0] is not None else 0.0
        e = ts[1] if ts[1] is not None else min(total_dur, s + 0.35)

        parts = raw_text.split()
        chunk_dur = max(0.08, e - s)
        part_dur = chunk_dur / max(1, len(parts))
        for idx, part in enumerate(parts):
            p_s = round(s + idx * part_dur, 3)
            p_e = round(s + (idx + 1) * part_dur, 3)
            m = re.search(r"([^\w\s'’-]+)$", part)
            p = m.group(1) if m else ''
            w = part[:m.start()] if m else part
            w = re.sub(r"^[^\w'’-]+", '', w)
            if w:
                w_items.append({'w': w, 's': p_s, 'e': p_e, 'p': p})

    if not script_tokens:
        return w_items

    out = []
    wi = 0
    norm = lambda s: re.sub(r"[^\w']", '', s.lower().replace('’', "'"))
    for sw in script_tokens:
        target = norm(sw['w'])
        matched_idx = None
        for j in range(wi, min(wi + 6, len(w_items))):
            if norm(w_items[j]['w']) == target:
                matched_idx = j
                break

        if matched_idx is not None:
            item = w_items[matched_idx]
            out.append({
                'w': sw['w'],
                's': item['s'],
                'e': max(item['e'], item['s'] + 0.05),
                'p': sw['p'] or item['p']
            })
            wi = matched_idx + 1
        else:
            prev_e = out[-1]['e'] if out else 0.0
            next_s = w_items[wi]['s'] if wi < len(w_items) else min(total_dur, prev_e + 0.4)
            dur = max(0.12, (next_s - prev_e) * 0.75)
            s_val = round(prev_e + 0.02, 3)
            out.append({
                'w': sw['w'],
                's': s_val,
                'e': round(min(total_dur, s_val + dur), 3),
                'p': sw['p']
            })
    return out


if provider == 'narrator':
    # The fixed What If narrator (scripts/narrator.py) runs on the Mac and leaves voice_raw.wav + words_raw.json.
    raw_audio = pub_dir(slug) / 'voice_raw.wav'
    if not raw_audio.exists() or not raw_words.exists():
        raise SystemExit('provider "narrator": run scripts/narrator.py on the Mac first, then put voice_raw.wav in '
                         f'public/{slug}/ and words_raw.json in out/{slug}/.')
    print('Narrator take found (scripts/narrator.py): tightening it.')
elif force or meta.get('sig') != sig or not raw_audio.exists() or not raw_words.exists():
    t0 = time.time()
    if provider == 'elevenlabs':
        print(f'{len(text)} characters to ElevenLabs (voice {V["id"]})')
        res = json.loads(api(f'/v1/text-to-speech/{V["id"]}/with-timestamps?output_format=mp3_44100_128', {'text': text, 'model_id': V['model'], 'voice_settings': V['settings']}))
        raw_audio = pub_dir(slug) / 'voice_raw.mp3'
        raw_audio.write_bytes(base64.b64decode(res['audio_base64']))
        al = res['alignment']
        words, cur = [], None
        for ch, s, e in zip(al['characters'], al['character_start_times_seconds'], al['character_end_times_seconds']):
            if re.match(r"[\w'’]", ch):
                if cur is None:
                    cur = {'w': '', 's': s, 'e': e, 'p': ''}
                cur['w'] += ch
                cur['e'] = e
            else:
                if cur is not None:
                    words.append(cur)
                    cur = None
                if words and ch.strip():
                    words[-1]['p'] += ch
        if cur:
            words.append(cur)
        for w in words:
            w['s'], w['e'] = round(w['s'], 3), round(w['e'], 3)
        save_json(raw_words, words)
        save_json(out_dir(slug) / 'voice_meta.json', {'sig': sig, 'chars': len(text), 'provider': 'elevenlabs'})
        used, n = spent_since(t0, expect=1)
        log_cost(slug, 'voice', used, f'{len(text)} characters' + ('' if n else '; not in the history yet, check the usage page'))
    else:
        # OmniVoice local synthesis
        try:
            from omnivoice.models.omnivoice import OmniVoice
            import soundfile as sf
            import torch
            from transformers import pipeline
        except ImportError as err:
            raise SystemExit(
                f"OmniVoice or PyTorch not found ({err}). Ensure TTS_ENGINE_DIR is set to your TTS-ENGINE folder "
                f"(current: {TTS_ENGINE_DIR}) or activate its virtualenv."
            )

        device = V.get('device')
        if not device:
            device = 'mps' if sys.platform == 'darwin' and (platform.processor() == 'arm' or 'arm64' in platform.machine()) else 'cpu'

        model_name = V.get('model', 'k2-fsa/OmniVoice')
        print(f"Loading local OmniVoice ({model_name}) on {device}...")
        model = OmniVoice.from_pretrained(model_name, device_map=device, dtype=torch.float16)

        gen_kwargs = {
            'text': text,
            'language': V.get('language', 'Indonesian'),
            'speed': float(V.get('speed', 1.0)),
            'num_step': int(V.get('num_step', 32)),
        }
        if V.get('instruct'):
            gen_kwargs['instruct'] = V['instruct']
        if V.get('ref_audio'):
            gen_kwargs['ref_audio'] = V['ref_audio']
        if V.get('ref_text'):
            gen_kwargs['ref_text'] = V['ref_text']
        if V.get('duration'):
            gen_kwargs['duration'] = float(V['duration'])

        print(f"Synthesizing {len(text)} characters with OmniVoice ({gen_kwargs['language']})...")
        audios = model.generate(**gen_kwargs)
        raw_audio = pub_dir(slug) / 'voice_raw.wav'
        sf.write(str(raw_audio), audios[0], model.sampling_rate)
        total_dur = len(audios[0]) / model.sampling_rate

        # Release OmniVoice model memory before running Whisper
        del model
        if device == 'mps':
            torch.mps.empty_cache()

        print(f"Aligning word timestamps using Whisper large-v3-turbo on {device}...")
        pipe = pipeline('automatic-speech-recognition', model='openai/whisper-large-v3-turbo', device=device, return_timestamps='word')
        lang_name = V.get('language', 'Indonesian').lower()
        lang_code = {'english': 'en', 'indonesian': 'id'}.get(lang_name, lang_name if len(lang_name) == 2 else None)
        pipe_kwargs = {'generate_kwargs': {'language': lang_code}} if lang_code else {}
        whisper_res = pipe(str(raw_audio), **pipe_kwargs)
        chunks = whisper_res.get('chunks', [])

        del pipe
        if device == 'mps':
            torch.mps.empty_cache()

        script_tokens = parse_script_tokens(ep['script'])
        words = align_script_with_whisper(script_tokens, chunks, total_dur)
        save_json(raw_words, words)
        save_json(out_dir(slug) / 'voice_meta.json', {'sig': sig, 'chars': len(text), 'provider': 'omnivoice'})
        log_cost(slug, 'voice', 0, f'{len(text)} characters via local OmniVoice (offline)')
else:
    print('Voice unchanged since the last call: reusing it (cached).')

# ---------------------------------------------------------------- tighten the pauses
words = load_json(raw_words)
tighten_enabled = ep.get('voice', {}).get('tighten', True)
x = decode(raw_audio)

if not tighten_enabled:
    write_wav(pub_dir(slug) / 'voice.wav', x)
    save_json(ep_dir(slug) / 'words.json', words)
    print(f'Pause tightening skipped (voice.tighten=false). Preserved full {len(x) / SR:.2f} s natural audio.')
else:
    G = {'word': 0.12, 'comma': 0.2, 'sentence': 0.3, 'question': 0.45, 'pairs': {}}
    G.update(ep.get('gaps', {}))
    cuts = []

    def bare(w):
        return re.sub(r'[^\w]', '', w)

    PAD = 0.08  # 80ms safety padding so cuts never chop off word tails or onsets
    for a, b in zip(words, words[1:]):
        gap = b['s'] - a['e']
        key = bare(a['w']) + '|' + bare(b['w'])
        if key in G['pairs']:
            keep = G['pairs'][key]
        elif '?' in a['p'] or '!' in a['p']:
            keep = G['question']
        elif '.' in a['p'] or ':' in a['p'] or ';' in a['p'] or '…' in a['p']:
            keep = G['sentence']
        elif ',' in a['p'] or '—' in a['p'] or '-' in a['p']:
            keep = G['comma']
        else:
            keep = G['word']
        if gap > keep:
            mid = (a['e'] + b['s']) / 2
            rm = gap - keep
            c_start = max(a['e'] + PAD, mid - rm / 2)
            c_end = min(b['s'] - PAD, mid + rm / 2)
            if c_end > c_start + 0.04:
                cuts.append((c_start, c_end))
    parts, last = [], 0.0
    for s, e in cuts:
        parts.append(x[int(last * SR):int(s * SR)])
        last = e
    parts.append(x[int(last * SR):])
    fade = int(0.004 * SR)  # a 4 ms fade either side of each join, so no click
    for i, part in enumerate(parts):
        part = part.copy()
        if i > 0 and len(part) > fade:
            part[:fade] *= np.linspace(0, 1, fade)
        if i < len(parts) - 1 and len(part) > fade:
            part[-fade:] *= np.linspace(1, 0, fade)
        parts[i] = part
    y = np.concatenate(parts)
    write_wav(pub_dir(slug) / 'voice.wav', y)

    def shift(t):
        return t - sum(min(e, t) - s for s, e in cuts if t > s)

    out = [{'w': w['w'], 's': round(shift(w['s']), 3), 'e': round(shift(w['e']), 3), 'p': w.get('p', '')} for w in words]
    save_json(ep_dir(slug) / 'words.json', out)
    print(f'Tightened {len(cuts)} pauses, removed {sum(e - s for s, e in cuts):.2f} s: {len(x) / SR:.2f} s -> {len(y) / SR:.2f} s')
    print(' '.join(f"{w['w']}@{w['s']}" for w in out))
