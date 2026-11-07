import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { FONT } from './fonts';

// Animated Shorts captions from words.json (the narrator's word timings after voice.py tightened the pauses).
// Words are grouped into short chunks (max 3 words / ~16 letters, broken at punctuation and pauses). A chunk pops in
// with a spring, the word being spoken turns yellow, grows and lifts, words not yet spoken wait dimmed, and numbers or
// words listed in `accent` are drawn in the accent colour. Same chunking as scripts/subtitles.py (the .srt export),
// so the burned-in captions and the uploaded subtitles always agree.

export type Word = { w: string; s: number; e: number; p?: string };
export type Chunk = { words: Word[]; s: number; e: number };

export type CaptionStyle = {
  y?: number; // vertical centre as a fraction of the frame height (0.64 keeps clear of the Shorts UI in the bottom 20%)
  size?: number; // font px
  maxWords?: number;
  maxChars?: number;
  gap?: number; // a pause longer than this (s) starts a new chunk
  color?: string;
  active?: string; // the word being spoken
  accentColor?: string; // numbers and accent words
  stroke?: string;
  upper?: boolean;
};

export const CAPTION_DEFAULT: Required<CaptionStyle> = {
  y: 0.64,
  size: 96,
  maxWords: 3,
  maxChars: 16,
  gap: 0.28,
  color: '#FFFFFF',
  active: '#FFE27A',
  accentColor: '#FF6B6B',
  stroke: '#0E0C1E',
  upper: true,
};

/** Group words into caption chunks. Keep in sync with scripts/subtitles.py. */
export const chunkWords = (words: Word[], st: Partial<CaptionStyle> = {}): Chunk[] => {
  const { maxWords, maxChars, gap } = { ...CAPTION_DEFAULT, ...st };
  const out: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) out.push({ words: cur, s: cur[0].s, e: cur[cur.length - 1].e });
    cur = [];
  };
  words.forEach((w, i) => {
    const chars = cur.reduce((n, x) => n + x.w.length + 1, 0) + w.w.length;
    if (cur.length && (cur.length >= maxWords || chars > maxChars)) flush();
    cur.push(w);
    const next = words[i + 1];
    if (/[.?!,;:…]/.test(w.p ?? '') || !next || next.s - w.e > gap) flush();
  });
  return out;
};

// Indonesian number words get the accent colour too, like digits do
const NUM_WORDS = new Set('nol satu dua tiga empat lima enam tujuh delapan sembilan sepuluh sebelas belas puluh ratus seratus ribu seribu juta miliar triliun persen setengah separuh kali lipat'.split(' '));

const outline = (c: string, r: number) => {
  const sh: string[] = [];
  for (let a = 0; a < 16; a++) sh.push(`${(Math.cos((a / 16) * Math.PI * 2) * r).toFixed(1)}px ${(Math.sin((a / 16) * Math.PI * 2) * r).toFixed(1)}px 0 ${c}`);
  return sh.join(',') + `, 0 ${r * 1.6}px ${r * 1.2}px rgba(0,0,0,0.55)`;
};

export type CaptionsProps = {
  words: Word[];
  style?: CaptionStyle;
  accent?: string[]; // words to always colour as accent (case-insensitive)
  hide?: [number, number][]; // frame ranges with no captions (e.g. the title card)
  delay?: number; // seconds of audio before words.json time 0 (if the voice starts late)
};

export const Captions: React.FC<CaptionsProps> = ({ words, style, accent = [], hide = [], delay = 0 }) => {
  const f = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const S = { ...CAPTION_DEFAULT, ...style };
  const chunks = React.useMemo(() => chunkWords(words, S), [words]);
  if (hide.some(([a, b]) => f >= a && f < b)) return null;
  const t = f / fps - delay;
  // a chunk stays up until the next one starts (max 0.5 s after its last word), so there's no flicker between lines
  const idx = chunks.findIndex((c, i) => {
    const end = Math.min(chunks[i + 1]?.s ?? Infinity, c.e + 0.5);
    return t >= c.s - 0.05 && t < end;
  });
  if (idx < 0) return null;
  const c = chunks[idx];
  const cf = Math.round((c.s - 0.05 + delay) * fps); // chunk's first frame
  const pop = spring({ frame: f - cf, fps, config: { damping: 11, stiffness: 220, mass: 0.6 } });
  const acc = new Set(accent.map((a) => a.toLowerCase()));
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div
        style={{
          position: 'absolute',
          left: 60,
          right: 60,
          top: height * S.y,
          transform: `translate(0, -50%) scale(${interpolate(pop, [0, 1], [0.55, 1])}) rotate(${interpolate(pop, [0, 1], [-4, 0])}deg)`,
          opacity: interpolate(pop, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }),
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'baseline',
          columnGap: S.size * 0.34,
          rowGap: S.size * 0.05,
          fontFamily: FONT.title,
          fontWeight: 800,
          fontSize: S.size,
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
          textAlign: 'center',
        }}
      >
        {c.words.map((w, i) => {
          const wf = Math.round((w.s + delay) * fps);
          const on = t >= w.s;
          const speaking = t >= w.s && t < Math.max(w.e, (c.words[i + 1]?.s ?? w.e));
          const hit = spring({ frame: f - wf, fps, config: { damping: 9, stiffness: 260, mass: 0.5 } });
          const lw = w.w.toLowerCase();
          const isAcc = /\d/.test(w.w) || NUM_WORDS.has(lw) || acc.has(lw);
          const col = isAcc ? S.accentColor : speaking ? S.active : S.color;
          const grow = on ? interpolate(hit, [0, 1], [1.18, speaking ? 1.07 : 1]) : 1;
          const lift = speaking ? -S.size * 0.06 * hit : 0;
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                transformOrigin: '50% 80%',
                color: col,
                opacity: on ? 1 : 0.55,
                transform: `translateY(${lift}px) scale(${grow})`,
                textShadow: outline(S.stroke, S.size * 0.075),
              }}
            >
              {S.upper ? w.w.toUpperCase() : w.w}
              {/[?!]/.test(w.p ?? '') ? w.p : ''}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
