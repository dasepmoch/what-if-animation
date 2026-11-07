---
name: what-if-animation
description: Make a "What If" animated episode from one topic line ("What if you could rewind 10 seconds?"), in the dusk-lit stick-figure style of the What If channels that broke out on YouTube in October 2026. House standard: Indonesian, portrait 9:16 Shorts, 1-2 min (aim ~1.5 min), the locked narrator voice and animated captions. Writes the script on the seven-beat What If formula, voices it with local neural TTS (OmniVoice + Whisper word timestamps, Indonesian default) or ElevenLabs, lays out a shot list at the genre's pace, renders a storyboard of stills and self-checks it before animating, animates every frame in code (Remotion and SVG, with an original cast on one rig, rooms in perspective and light from lamps and windows), mixes and syncs the sound, and masters a finished episode to -14 LUFS. Use when someone asks for a What If episode, animation or cartoon, "make a what if video about X", a stick-figure explainer in this style, or to run the free What If skill.
---

# What If animation

One topic line in, a finished episode out (house standard below: Indonesian, portrait, about 1.5 minutes). Every frame is SVG that Claude writes (rendered by
Remotion); the voice is synthesized with local OmniVoice (with word timestamps via Whisper) or ElevenLabs, and sound comes from the included sound library. Two examples ship in `studio/src/episodes/`, both ready to
render: `rewind` ("What if you could rewind 10 seconds?", the proof clip: shots played backwards as the power) and
`copy-paste` ("What if you could copy and paste anything?", the skill's first full run: a new kitchen set, a
schematic for the science beat, a cliffhanger blackout). Read the one closest to your topic before you start.

| File | What's in it |
|---|---|
| `references/formula.md` | The seven-beat What If formula, the 15-25 s shape, script rules, choosing a topic |
| `references/look.md` | The measured look, pace, shot vocabulary, and the storyboard and motion checklists |
| `references/kit.md` | The building blocks: engine, cast, sets, room kit, light, UI, looks, and how to add each |
| `references/sound.md` | Writing sound events, prompts, levels, costs |
| `references/traps.md` | Everything that cost time on the two example episodes |
| `TOPICS.md` | Episodes already made and the topic backlog (read before choosing; update with each episode) |
| `studio/src/episodes/gravitasi` | The portrait (9:16 Shorts) example with the locked narrator and animated captions |
| `studio/` | The Remotion project: copy it once, then every episode lives in it |
| `scripts/` | voice, narrator, subtitles, plan, stills, board, sfx, mixcheck, motiongrid, master (Python 3.9+ and Node) |
| `scripts/cloud/` | Portrait-aware stills, render and contact-sheet helpers (Mac or cloud sandbox) |

## Autopilot: no topic given

The person may just say "bikin video What If", "bikin short", "bikin 3 episode" with no topic. Then the agent does
everything itself, without asking what it should be about or how long it should be:

1. **Pick the topic.** Read `TOPICS.md`. Take the best idea from the backlog (or invent a better one) that follows
   "Choosing a topic" in `references/formula.md`: an everyday power with clear rules, a hidden cost from real science,
   a power family not used in the last two episodes, and never a power already in Done. Search YouTube for the premise;
   if a What If channel already has that exact title, change the power or the rule.
2. **Write it** on the seven-beat formula in the house style below (Indonesian, ~90 s, 240-270 words, short punchy
   lines), with every number worked out and sourced in `science` before voicing.
3. **Run the whole pipeline** (steps 1-8) without stopping for approval of the topic or script. Say in one line which
   topic was chosen and why. Self-check the storyboard and send it, then keep going unless the person stops you.
4. **Keep the list going.** In the same commit as the episode, move the topic to Done in `TOPICS.md` and top the
   backlog back up to at least 10 fresh ideas, so the next run (by any agent) has topics ready.
5. **Several episodes** ("bikin 3", "lanjut terus"): do them one after another, each a different power family.

A topic or length the person does give always wins.

## House standard (the channel's defaults; any agent using this repo follows them)

- **Language and title:** Indonesian. Title "GIMANA KALAU ..." (three lines in portrait: a small line, then two big lines).
- **Format:** portrait 9:16, 1080x1920, for Shorts. 16:9 only when asked.
- **Length (default, no need to be told):** when someone asks for a "short", "Shorts", "portrait" or just "a What If
  video" without a length, make it **about 90 seconds (1.5 min), never over 2 minutes**, and don't ask how long. That
  is **240 to 270 words** for ~90 s (the locked narrator speaks about 2.8 words a second after voice.py; up to about 330 words for the full 2 min). Measured on dengar-pikiran: 207 words gave 74.8 s, 251 words about 90 s. Only a length the
  person states overrides this. Check the final duration in `report.json`: 80-120 s is on target. Short punchy sentences (3-6 words), all seven
  beats in full (cold open with 3 demos, title, fun with real numbers, the turn with one checked fact and "Itu nyata.",
  the consequence on screen, the suit, the sister, a cliffhanger question). About 45-50 shots, 30+ cuts a minute.
- **Voice:** always the locked narrator in `narrator/` (approved by the channel owner on 7 Nov 2026, anchor seed 77).
  Never design a new voice, never use instruct-only OmniVoice or ElevenLabs for an episode unless the owner asks.
- **Captions:** every episode has the animated captions burned in and ships an `.srt` (step 6 and step 8).
- **Portrait framing:** `camV(cx, cy, zoom)`; room sets fill the tall frame from zoom about 1.15. Wides 1.15-1.4,
  mediums 1.9-2.4, close-ups 3-4.5, inserts in world units around (960, 960) at zoom 1. Use the height (jumps, falls,
  stacked floors, sky). Title and readouts in the upper middle, captions at about 64% height, everything clear of the
  bottom 20% and the right edge (Shorts UI). Shot ids with a letter suffix (S16B) need the regex `/^S\d+[A-Z]?$/`.
- **Order of work:** everything that doesn't need the voice first (script, science, shots, storyboard, a silent
  half-scale animatic), so the only wait is the narrator run. Show the storyboard before animating.
- **Hand-over:** `<slug>-final.mp4`, `<slug>.srt` and `storyboard.jpg`; keep the episode's files in
  `src/episodes/<slug>/` and commit them.

## Rules

- **Original characters only.** Pip (the hero, look B) and Mo (his friend) are ours, and so are the sister, mum and
  the suit on the rig. Never a channel's own hero, and nothing that resembles a famous cartoon character: check every
  new look on the cast sheet (Mo's first hat was dropped for drifting toward one).
- **Original stories.** The formula is shared; the episode isn't anyone else's. Don't remake a channel's title.
- **Never claim the viral channels are made with Claude** or any other tool. Nobody has said how they're made.
- **Keys by name only.** `ELEVENLABS_API_KEY` (optional, only needed if explicitly using ElevenLabs provider or generating brand-new sound effects not in `library/sfx/`). Never print, paste or hardcode a key.
- **Report credits & offline runs:** With local OmniVoice, voice generation is 100% offline (0 credits). If ElevenLabs is used, the scripts log credits to `out/<slug>/costs.json` and `master.py` totals them in `report.json`. Say the number when you hand the episode over.
- **Storyboard before animation.** No video render until the stills pass the self-check (step 5) and, when the person
  is in the loop, they've seen the board.
- **Every fact is real.** A number in the script is worked out and sourced in the episode's `science` field first.

## Setup (once per machine)

Needs Node 18+, ffmpeg and ffprobe on the PATH, Python 3.9+ with `numpy` and `Pillow`, and the local TTS engine (OmniVoice in `~/Documents/claude/TTS-ENGINE`, or set `TTS_ENGINE_DIR`). ElevenLabs key is optional.

```bash
cp -r <skill>/studio ./what-if-studio && cd what-if-studio && npm install
```

Everything below runs from that studio folder; `<skill>` is this skill's folder. To work offline or in your own
brand face, put a display font in `public/fonts/` and set `titleFont` in `src/studio.config.ts`. The default faces
(Bricolage Grotesque, Fragment Mono, Kalam) ship as local files in `public/fonts/`, so renders work offline. To update
an existing studio to a newer engine, copy `<skill>/studio/src/engine` over its `src/engine` (and `public/fonts/`).

**Format.** Portrait 9:16 (1080x1920) for Shorts is the default: `defineEpisode(id, { ..., size: PORTRAIT })` and
`camV(cx, cy, zoom)` instead of `camT` (see `gravitasi`). Landscape 16:9 only when asked.

## The pipeline

Work through the steps in order. Each ends on something you look at before the next.

### 1. Script

Read `references/formula.md`. Search YouTube for the premise first: if a What If channel already has that exact
episode, change the power or the rule. From the topic line, decide the power's word, its rule, three escalating
demos and the turn (one real fact with a number). Write `src/episodes/<slug>/episode.json` with `id` (PascalCase,
the composition name), `slug`, `topic`, `title` (two lines), `script` (one entry per beat) and `science` (each fact:
the claim, the working, the source). 240 to 270 words for the house ~1.5 minute episode (160 to 180 for a 1-minute one, 45 to 65 for a 15-25 s teaser). Read it aloud at pace: every line must be a picture.

### 2. Voice: the locked narrator `whatif-narator-v1` (default)

Every episode uses the same narrator, and it must sound identical each time. `scripts/narrator.py` does that: one
anchor voice, designed once and approved, ships in this repo's `narrator/` folder (`whatif-narator.{wav,txt,pt,json}`
+ `lock.json`). On a machine whose `TTS-ENGINE/refs/` is empty, narrator.py installs those exact files there first,
so every machine and every agent gets the same narrator; it never designs a new one by itself. And
every episode **clones** it (OmniVoice's instruct-only voice drifts between calls). Each beat is generated with fixed
seeds (`1000 + 17*beat + take`, 2 takes), num_step 32, guidance 2.0, t_shift 0.1, speed 1.05; Whisper keeps the
take with the lowest character error rate; beats are trimmed, levelled to -20 dB RMS and joined with 0.42 s gaps
(0.5 s after a question).

```bash
cd ~/Documents/claude/TTS-ENGINE && mkdir -p <studio>/out/<slug>/voice && \
  .venv/bin/python <skill>/scripts/narrator.py <studio>/src/episodes/<slug>/episode.json <studio>/out/<slug>/voice
```

**The lock.** Models load from pinned local snapshots (OmniVoice `c5fdb5cc...`, Whisper large-v3-turbo `41f01f3f...`)
with `HF_HUB_OFFLINE=1`. The first anchor run writes `refs/whatif-narator.lock.json` (recipe fingerprint, sha256 of
the anchor files, model snapshots); every later run checks it and stops with `NARRATOR LOCK FAILED` if anything
differs. Never edit `RECIPE`, never delete the lock, don't `git pull`/`uv sync` the TTS engine mid-series. Only
`--new-anchor` makes a new narrator (it archives the old refs), and only when the person asks for a new voice. The
Same text + same seed gives bit-identical audio on the
reference setup (Apple Silicon MPS, fp16, torch 2.8.0, verified also from a fresh refs folder installed from the repo).
On a different GPU or torch version it is still the same cloned narrator, but the samples can differ slightly; use
the reference setup for episodes. Setting up the engine on a new machine: clone k2-fsa/OmniVoice, `uv sync`, download
the two pinned model revisions above, keep torch 2.8.0.

Then: any beat with CER > 0.1 in `narrator_report.json` → re-run with `--beats N --takes 4`. Copy `voice_raw.wav` to
`public/<slug>/`, `words_raw.json` + `narrator_report.json` to `out/<slug>/`, set `"voice": {"provider": "narrator"}`
and run `python <skill>/scripts/voice.py <slug>` (it only tightens the pauses and writes `words.json`).

#### Alternative: one-shot OmniVoice / ElevenLabs (The Golden TTS Standard)

```bash
python <skill>/scripts/voice.py <slug>
```

Synthesizes the episode's voice using the local **OmniVoice** engine (`~/Documents/claude/TTS-ENGINE`), running on Apple Silicon GPU (`mps`, `float16`) with word timestamps aligned via Whisper (`openai/whisper-large-v3-turbo`).

#### 🏆 Golden Standard Configuration (The `putar-balik` Rule)
To achieve the crisp, punchy, energetic cadence seen in the gold-standard proof episode:
1. **Model & Voice Config in `episode.json`:**
   - **Provider:** `"omnivoice"` (100% offline, Apple Silicon MPS)
   - **Language:** `"Indonesian"`
   - **Speed:** `1.0` (optimal natural tempo)
   - **Diffusion Steps:** `32` (`num_step: 32` for pristine acoustic fidelity)
   - **Instruct:** `"male, young adult, moderate pitch"` (strict OmniVoice vocabulary)

```json
"voice": {
  "provider": "omnivoice",
  "language": "Indonesian",
  "speed": 1.0,
  "num_step": 32,
  "instruct": "male, young adult, moderate pitch"
}
```

2. **The Script Cadence Rule (CRITICAL for Gold Quality):**
   - **Short, punchy sentences (3 to 6 words each).** Never use long compound clauses.
   - Put a period after every discrete action beat (e.g. *"Kopi tumpah dari meja. Putar balik. Kamu tangkap. Salah langkah di tangga. Putar balik. Kucingmu selamat."*).
   - This guarantees that the neural model articulates every syllable with full projection, prevents robotic monotone drift, and creates the snappy *What If* suspense rhythm.

3. **Gaps & Safe Tightening (Zero Clipped Syllables):**
   - Default gaps: `"word": 0.12`, `"comma": 0.20`, `"sentence": 0.28`, `"question": 0.40`.
   - Safe padding of `PAD = 0.08s` (80 ms) is enforced in `scripts/voice.py` so cuts never touch word boundaries or slice trailing syllables.
   - For fast power cut points, specify `gaps.pairs` in `episode.json` (e.g. `"meja|Putar": 0.2`, `"balik|Kamu": 0.45`).

4. **Mastering Loudness Target:**
   - Integrated Loudness: **-14.0 LUFS (±0.5)**
   - True Peak: **≤ -1.0 dBTP** (mastered via ffmpeg two-pass loudnorm in `scripts/master.py`).

### 3. Shot list

Design one shot per picture in the script (usually 9 to 14), varying the size and angle every cut (wide, insert,
medium, close-up, over the shoulder, high, low; see `references/look.md`). Add to `episode.json`:

- `shots`: `{ "id": "S1", "size": "medium", "set": "kitchen", "key": 14, "note": "what we see" }` (`key` is the
  frame of the shot's own clock the storyboard shows)
- `edit`: `{ "shot": "S1", "at": "cookie" }` per cut, cued on the word it lands on (`plan.py` lists the cue forms;
  `reverse`, `from`, `to` and `look` for powers that bend a shot's clock)
- `fx`: one-frame flashes and shakes, `{ "at": "S3+2", "kind": "flash" }`

```bash
python <skill>/scripts/plan.py <slug>
```

It writes `timeline.json` and `out/<slug>/shotlist.md` and prints the pace. Aim for 27+ cuts a minute in the
opening and no static shot over about 3 s; fix what it flags before drawing anything.

### 4. Storyboard

Read `references/kit.md` for the building blocks. Write `src/episodes/<slug>/shots.tsx`, one component per shot,
each a pure function of its clock `t` (copy the patterns in the two examples' `shots.tsx`), and `index.tsx` (the
episode and its power look), then add the episode to `src/episodes/index.ts`. At this step each shot only needs to
be right at its `key` frame. When a topic needs a place the library lacks, build it with the room kit and add it to
`src/engine/sets/` (and to the skill's copy) so the next episode has it, as the copy-paste run did with the kitchen
and the schematic. A new character or costume: add the look, then check it on the cast sheet
(`npx remotion still src/index.ts Cast out/cast.png`).

```bash
npx tsc --noEmit
node <skill>/scripts/stills.mjs <slug>
python <skill>/scripts/board.py <slug>
```

`out/<slug>/storyboard.jpg`: one captioned still per shot.

### 5. Self-check the stills

Look at the storyboard, then open every still in `out/<slug>/board/` at full size, and run the storyboard checklist
in `references/look.md` honestly, shot by shot. Write down what fails, fix it, re-render just those shots
(`stills.mjs <slug> S3 S7`), rebuild the sheet and look again. Repeat until it passes. Check `references/traps.md`
for the failure you're seeing before inventing a fix. If the person is in the loop, show them the board now and
take their notes before animating.

### 6. Animate

Bring each shot to life from its key pose: `poseAt` keys with anticipation, holds and overshoot, `faceAt` for
expressions, camera moves with `kf`, the power's look, the `fx`. Then render a draft and check the motion:

```bash
python <skill>/scripts/master.py <slug>
python <skill>/scripts/motiongrid.py <slug> S2 S5
node <skill>/scripts/stills.mjs <slug> --frames 120 240
```

Read the grids like a flipbook against the motion checklist in `references/look.md`; fix and re-render until it
reads.

**Animated captions.** Every episode gets burned-in Shorts captions from `words.json` (`studio/src/engine/captions.tsx`):

```tsx
import words from './words.json';
const TITLE_FRAMES = (timeline as Timeline).segments.filter((s) => s.shot === 'S12').map((s) => [s.a, s.b] as [number, number]);
export const ep = defineEpisode('Id', { timeline: timeline as Timeline, shots, size: PORTRAIT,
  captions: { words: words as Word[], hide: TITLE_FRAMES, accent: ['nyata'] } });
```

Chunks of max 3 words / 16 letters (broken at punctuation and pauses > 0.28 s) pop in with a spring; the spoken word
turns yellow, grows and lifts; words still to come wait dimmed; digits, Indonesian number words and the `accent`
list are red. Default height `y: 0.64` of the frame (clear of the Shorts UI in the bottom 20% and the title/readouts
up top). Hide them over the title card; move them for the whole episode with `style: { y }` if a prop sits behind.

### 7. Sound

Read `references/sound.md`. Add `sound` to `episode.json`: the clips (prompt and length), one event per visible
action cued to its shot, ambiences per location, the music bed and the levels. Check what the library already has,
then generate:

```bash
python <skill>/scripts/sfx.py <slug> --dry
python <skill>/scripts/sfx.py <slug>
```

It prints the credits it used and sets the stem volumes in `timeline.json`. Then check that every word stays clear:

```bash
python <skill>/scripts/mixcheck.py <slug>
```

It lists the moments, while a word is being spoken, where effects or music come within 3 dB of the voice. A hit that
illustrates a word lands in the pause just after it, never on it; a bed (a hum, a drone) under a key line comes down;
if most of the stem crowds the voice, lower `sfx_lu`. Re-run sfx.py and the check until only deliberate overlaps
remain (a title boom, a turn).

### 8. Master and hand over

```bash
python <skill>/scripts/master.py <slug>
```

Renders, brings the mix to -14 LUFS with peaks under -1 dBTP, and writes `out/<slug>/report.json` (length, loudness,
pace, credits). Export the subtitles for the upload, chunked exactly like the burned-in captions:

```bash
python <skill>/scripts/subtitles.py src/episodes/<slug>/words.json out/<slug>/<slug>.srt
```

Watch the final file once through with sound. Hand over `out/<slug>/<slug>-final.mp4`, `out/<slug>/<slug>.srt` and
`out/<slug>/storyboard.jpg`, with the length, credits used (0 for local OmniVoice), and anything you'd still improve.

## Where an episode lives

| Path | What |
|---|---|
| `src/episodes/<slug>/episode.json` | Everything you write: script, science, shots, edit, fx, sound |
| `src/episodes/<slug>/shots.tsx`, `index.tsx` | The drawing: one component per shot, the power's look |
| `src/episodes/<slug>/words.json`, `timeline.json` | Written by voice.py and plan.py (sfx.py adds the volumes) |
| `public/<slug>/` | voice.wav, sfx.wav, music.wav |
| `out/<slug>/voice/` | narrator.py's takes, narrator.log, narrator_report.json |
| `narrator/whatif-narator.*` | The approved, locked narrator (anchor wav/txt/pt, recipe json, lock.json); never edit |
| `TTS-ENGINE/refs/whatif-narator.*` | The engine's working copy, installed from `narrator/` by narrator.py |
| `out/<slug>/` | board stills, storyboard.jpg, shotlist.md, motion grids, renders, costs.json, report.json |
| `library/sfx/` | Every generated sound clip, shared by all episodes |
