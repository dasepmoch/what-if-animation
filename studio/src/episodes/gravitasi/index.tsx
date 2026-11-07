import React from 'react';
import { defineEpisode, Timeline, PORTRAIT, LookDef, clamp, Word } from '../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as A from './shots1';
import * as B from './shots2';
import * as C from './shots3';
import { GChip, CYAN } from './parts';

// The power's look: whenever Pip jumps, a cool lift in the grade and the G 10% chip at the top of the frame.
const g10: LookDef = {
  grade: (lv) => `saturate(${1 + 0.18 * lv}) contrast(${1 + 0.06 * lv})`,
  Overlay: ({ f, p }) => (
    <g>
      <GChip x={540} y={250} t={Math.min(20, p * 60 + 2)} s={0.9} />
      {[90, 990].map((x, i) => (
        <rect key={i} x={x - 3} y={((f * 70 + i * 500) % 2400) - 400} width={6} height={260} rx={3} fill={CYAN} opacity={0.35} />
      ))}
    </g>
  ),
};

// the title card shot: its own big title is on screen, so no captions over it
const TITLE_FRAMES = (timeline as Timeline).segments.filter((s) => s.shot === 'S12').map((s) => [s.a, s.b] as [number, number]);

const shots: Record<string, React.FC<any>> = {};
for (const m of [A, B, C]) for (const [k, v] of Object.entries(m)) if (/^S\d+[A-Z]?$/.test(k)) shots[k] = v as React.FC<any>;

export const gravitasi = defineEpisode('Gravitasi', {
  timeline: timeline as Timeline,
  shots,
  looks: { g10 },
  size: PORTRAIT,
  // animated captions from the narrator's word timings; hidden over the title card
  captions: { words: words as Word[], hide: TITLE_FRAMES },
});
