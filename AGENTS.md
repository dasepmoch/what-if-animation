# Instructions for any AI agent working in this repo

This repo makes "Gimana kalau..." / What If stick-figure episodes. Before doing anything, read `SKILL.md` and follow
it exactly; it is the single source of truth. The essentials:

- **Asked for a video with no topic?** Don't ask. Pick one yourself from `TOPICS.md` (SKILL.md, "Autopilot"), write
  the script, make the episode end to end, then update `TOPICS.md` in the same commit.
- **Default episode, no need to be told:** Indonesian, portrait 9:16 (1080x1920) for Shorts, about 90 seconds and
  never over 2 minutes (240-270 words), seven-beat formula, title "GIMANA KALAU ...".
- **Voice:** only the locked narrator in `narrator/`, through `scripts/narrator.py`. Never design a new voice, never
  edit `RECIPE`, never delete or regenerate `narrator/` unless the owner asks for a new narrator.
- **Captions:** every episode has the animated captions burned in and ships an `.srt` (`scripts/subtitles.py`).
- **Every fact is real** and sourced in the episode's `science` field before it is voiced.
- Improvements to the engine or scripts go into this repo; keep `SKILL.md` in step with them.
