import React from 'react';
import { defineEpisode, Timeline, PORTRAIT, Word } from '../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as A from './shots1';
import * as B from './shots2';
import * as C from './shots3';
import { listen, noise } from './parts';

const shots: Record<string, React.FC<any>> = {};
for (const m of [A, B, C]) for (const [k, v] of Object.entries(m)) if (/^S\d+[A-Z]?$/.test(k)) shots[k] = v as React.FC<any>;

// no captions over the title card (its own title is on screen) or the 186.000 counter
const TL = timeline as Timeline;
const hideOn = (ids: string[]) => TL.segments.filter((s) => ids.includes(s.shot)).map((s) => [s.a, s.b] as [number, number]);

export const dengarPikiran = defineEpisode('DengarPikiran', {
  timeline: TL,
  shots,
  looks: { listen, noise },
  size: PORTRAIT,
  captions: { words: words as Word[], hide: hideOn(['S12']), accent: ['nyata', 'pikiran', 'pikirannya'] },
});
