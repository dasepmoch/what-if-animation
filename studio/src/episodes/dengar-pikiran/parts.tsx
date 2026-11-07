import React from 'react';
import { LOOKS, clamp, lerp, backOut, easeOut, rnd, FONT, UI, Glow, HudChip, LookDef } from '../../engine';

// The power's grammar: a thought you hear shows as a pale bubble with a PICTURE inside (never the words the narrator
// says), linked to its owner's head by three dots, and cyan rings ripple round your head when you hear it.
export const PIP = LOOKS.pipHood;
export const MO = LOOKS.mo;
export const MOM = LOOKS.mom;
export const SIS = LOOKS.sis;
export const SUIT = LOOKS.suit;
export const CYAN = '#7FE3FF';
export const RED = '#FF4A5A';
export const INK = '#1A1230';

/** The cloud outline of a bubble, w x h centred on 0,0. */
const cloudPath = (w: number, h: number, seed = 1) => {
  const n = 11;
  let d = '';
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = 1 + (rnd(seed, i) - 0.5) * 0.08;
    const x = Math.cos(a) * (w / 2) * r;
    const y = Math.sin(a) * (h / 2) * r;
    if (i === 0) d += `M ${x.toFixed(1)} ${y.toFixed(1)}`;
    else {
      const am = ((i - 0.5) / n) * Math.PI * 2;
      const cx = Math.cos(am) * (w / 2) * 1.2;
      const cy = Math.sin(am) * (h / 2) * 1.22;
      d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  }
  return d + ' Z';
};

/**
 * A thought bubble at (x, y), size w x h, popping in at t = 0, tied to `from` (a head) by three dots.
 * `tone`: 'pale' (heard), 'red' (a scream), 'cold' (the man in the suit), 'grey' (lost in the noise).
 */
export const Thought: React.FC<{
  x: number; y: number; w?: number; h?: number; t: number; from?: { x: number; y: number }; children?: React.ReactNode;
  tone?: 'pale' | 'red' | 'cold' | 'grey'; seed?: number; o?: number; jitter?: number;
}> = ({ x, y, w = 360, h = 250, t, from, children, tone = 'pale', seed = 1, o = 1, jitter = 0 }) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 7));
  const bob = Math.sin((t + seed * 9) / 9) * 6;
  const jx = jitter ? Math.sin(t * 2.7 + seed) * jitter : 0;
  const jy = jitter ? Math.cos(t * 3.1 + seed) * jitter * 0.6 : 0;
  const fill = { pale: '#F6EFE3', red: '#FFD9D9', cold: '#DDE6F2', grey: '#8C8A98' }[tone];
  const edge = { pale: CYAN, red: RED, cold: '#9FB6D6', grey: '#5A5868' }[tone];
  const bx = x + jx;
  const by = y + bob + jy;
  return (
    <g opacity={o}>
      {from
        ? [0.22, 0.48, 0.72].map((k, i) => {
            const p = clamp((t - i * 1.5) / 4);
            const cx = lerp(from.x, bx - (bx - from.x) * 0.18, k);
            const cy = lerp(from.y, by + h * 0.42, k);
            return <circle key={i} cx={cx} cy={cy} r={(9 + i * 7) * backOut(p) * (w / 360)} fill={fill} stroke={edge} strokeWidth={3} />;
          })
        : null}
      <g transform={`translate(${bx} ${by}) scale(${s})`}>
        <ellipse cx={0} cy={0} rx={w * 0.62} ry={h * 0.66} fill={edge} opacity={tone === 'grey' ? 0 : 0.16} filter="url(#blur16)" />
        <path d={cloudPath(w, h, seed)} fill={fill} stroke={edge} strokeWidth={5} />
        <path d={cloudPath(w * 0.9, h * 0.86, seed + 3)} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={tone === 'grey' ? 0.15 : 0.5} transform={`translate(${-w * 0.03} ${-h * 0.05})`} />
        <g transform={`scale(${w / 360})`}>{children}</g>
      </g>
    </g>
  );
};

/** Cyan rings rippling out from a head (the power switching on). `inward` runs them the other way. */
export const Ripples: React.FC<{ x: number; y: number; t: number; r0?: number; n?: number; color?: string; o?: number; inward?: boolean; period?: number }> = ({
  x, y, t, r0 = 90, n = 3, color = CYAN, o = 1, inward = false, period = 18,
}) => {
  if (t < 0) return null;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        let p = ((t + (i * period) / n) % period) / period;
        if (inward) p = 1 - p;
        return <circle key={i} cx={x} cy={y} r={r0 * (1 + p * 1.6)} fill="none" stroke={color} strokeWidth={6 * (1 - p) + 1.5} opacity={o * Math.sin(p * Math.PI) * 0.85} />;
      })}
    </g>
  );
};

/** A swarm of thought bubbles (the noise): n bubbles round (cx, cy) inside a w x h area, crowding in over `grow` frames. */
export const Swarm: React.FC<{ cx: number; cy: number; w: number; h: number; t: number; n?: number; grow?: number; seed?: number; tone?: 'pale' | 'grey' | 'red'; jitter?: number; o?: number; size?: number }> = ({
  cx, cy, w, h, t, n = 24, grow = 30, seed = 3, tone = 'pale', jitter = 4, o = 1, size = 1,
}) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const at = (i / n) * grow;
      const bw = (150 + rnd(seed, i) * 170) * size;
      const x = cx + (rnd(seed + 1, i) - 0.5) * w;
      const y = cy + (rnd(seed + 2, i) - 0.5) * h;
      const tn = tone === 'pale' && rnd(seed + 5, i) > 0.82 ? 'red' : tone;
      return (
        <Thought key={i} x={x} y={y} w={bw} h={bw * 0.66} t={t - at} seed={seed * 7 + i} tone={tn} jitter={jitter} o={o}>
          <Scribble seed={seed * 11 + i} />
        </Thought>
      );
    })}
  </g>
);

/** Two or three lines of unreadable handwriting: a thought you can't make out. */
export const Scribble: React.FC<{ seed: number; color?: string }> = ({ seed, color = '#4A4458' }) => (
  <g stroke={color} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.75}>
    {[-40, 0, 40].slice(0, 2 + Math.round(rnd(seed, 9))).map((yy, j) => {
      let d = `M ${-110 + rnd(seed, j) * 20} ${yy}`;
      for (let k = 1; k < 9; k++) d += ` Q ${-110 + k * 26 - 13} ${yy + (k % 2 ? -14 : 14) * (0.6 + rnd(seed + j, k) * 0.6)} ${-110 + k * 26} ${yy}`;
      return <path key={j} d={d} />;
    })}
  </g>
);

// ---------------------------------------------------------------- pictures inside thoughts (drawn ~ 260 x 160 round 0,0)
/** The upper kitchen cupboard, open, the cookie jar inside. */
export const PicCupboard: React.FC = () => (
  <g>
    <rect x={-110} y={-80} width={220} height={150} rx={8} fill="#8A5A3A" stroke={INK} strokeWidth={6} />
    <rect x={-96} y={-66} width={192} height={122} fill="#3A2420" />
    <path d="M -110 -80 L -170 -60 L -170 90 L -110 70 Z" fill="#A06A44" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <circle cx={-150} cy={10} r={7} fill="#E9C46A" />
    <path d="M -40 50 Q -46 0 -36 -36 L 36 -36 Q 46 0 40 50 Z" fill="#BFD8E6" opacity={0.6} stroke="#F6EFE3" strokeWidth={4} />
    {[[-16, 30], [14, 26], [-4, 4], [18, -6], [-20, -12]].map(([cx, cy], i) => (
      <ellipse key={i} cx={cx} cy={cy} rx={16} ry={10} fill="#C98A4A" stroke="#7A4A24" strokeWidth={2} />
    ))}
    <rect x={-44} y={-50} width={88} height={16} rx={6} fill="#C9A26A" stroke={INK} strokeWidth={4} />
    <path d="M 70 -90 L 86 -112 M 94 -76 L 118 -88 M 96 -50 L 122 -48" stroke="#FFE27A" strokeWidth={7} strokeLinecap="round" />
  </g>
);

/** A big chalky number. */
export const PicNumber: React.FC<{ text: string; color?: string }> = ({ text, color = INK }) => (
  <text x={0} y={46} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={150} fill={color}>
    {text}
  </text>
);

/** Pip's own face, sketched (a stranger thinking about you). */
export const PicPipFace: React.FC<{ red?: boolean }> = ({ red = false }) => (
  <g>
    <circle cx={0} cy={0} r={78} fill="#F2D2B8" stroke={red ? RED : INK} strokeWidth={6} />
    <path d="M -96 30 Q -110 -96 0 -100 Q 110 -96 96 30 Q 80 -60 0 -64 Q -80 -60 -96 30 Z" fill="#2E2B3D" stroke={INK} strokeWidth={5} />
    <ellipse cx={-26} cy={4} rx={9} ry={12} fill={INK} />
    <ellipse cx={26} cy={4} rx={9} ry={12} fill={INK} />
    <path d="M -22 40 Q 0 50 22 40" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
    {/* a pencil circle round it, like a target */}
    <path d="M -118 -6 A 120 104 0 1 1 -104 52" stroke={red ? RED : '#C24A3A'} strokeWidth={7} fill="none" strokeLinecap="round" />
  </g>
);

/** A bicycle with a bow on it (the birthday present). */
export const PicBike: React.FC = () => (
  <g stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx={-80} cy={30} r={52} />
    <circle cx={80} cy={30} r={52} />
    <path d="M -80 30 L -20 -40 L 50 -40 L 80 30 M -20 -40 L 6 30 L 50 -40 M 6 30 L -80 30" stroke="#D9534F" strokeWidth={10} />
    <path d="M 50 -40 L 44 -70 L 70 -74 M -30 -54 L -4 -54" />
    <path d="M -6 -66 Q -40 -110 -10 -100 Q 0 -92 -6 -66 Q 28 -110 40 -86 Q 30 -72 -6 -66" fill="#FFE27A" stroke="#C9A23A" strokeWidth={5} />
  </g>
);

/** A playing card face (the card Mo is holding: the seven of hearts). */
export const PicCard: React.FC = () => (
  <g transform="rotate(-6)">
    <rect x={-70} y={-96} width={140} height={192} rx={14} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
    <text x={-46} y={-52} fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#D23A4A">7</text>
    <path d="M 0 -6 C -50 -50 -70 20 0 56 C 70 20 50 -50 0 -6 Z" fill="#D23A4A" />
  </g>
);

/** A heart. */
export const PicHeart: React.FC<{ beat?: number }> = ({ beat = 0 }) => (
  <g transform={`scale(${1 + 0.08 * Math.max(0, Math.sin(beat / 4))})`}>
    <path d="M 0 -20 C -70 -90 -130 10 0 80 C 130 10 70 -90 0 -20 Z" fill="#FF6B8A" stroke={INK} strokeWidth={7} />
    <path d="M -50 -40 Q -70 -10 -50 14" stroke="#FFFFFF" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.7} />
  </g>
);

/** A cross: a lie. */
export const PicLie: React.FC = () => (
  <g>
    <rect x={-100} y={-50} width={200} height={100} rx={18} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
    <text x={0} y={18} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={56} fill={INK}>JUJUR</text>
    <path d="M -110 -64 L 110 64 M 110 -64 L -110 64" stroke={RED} strokeWidth={16} strokeLinecap="round" />
  </g>
);

/** A night window with a figure outside it (what the sister sees). */
export const PicWindow: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g>
    <rect x={-100} y={-90} width={200} height={180} fill="#1E2546" stroke={INK} strokeWidth={8} />
    <circle cx={50} cy={-50} r={20} fill="#F6EFE3" />
    <path d="M 0 -90 L 0 90 M -100 0 L 100 0" stroke={INK} strokeWidth={8} />
    <g transform={`translate(${-30 + Math.sin(t / 10) * 4} 0)`}>
      <circle cx={0} cy={-6} r={30} fill="#06060C" />
      <path d="M -50 90 Q -54 30 0 22 Q 54 30 50 90 Z" fill="#06060C" />
      <circle cx={-10} cy={-8} r={4} fill={RED} />
      <circle cx={10} cy={-8} r={4} fill={RED} />
    </g>
  </g>
);

/** Words in the bubble: only for the man in the suit, who means you to read them. */
export const PicWords: React.FC<{ lines: string[]; color?: string; size?: number }> = ({ lines, color = INK, size = 54 }) => (
  <g>
    {lines.map((ln, i) => (
      <text key={i} x={0} y={(i - (lines.length - 1) / 2) * size * 1.05 + size * 0.34} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={size} fill={color}>
        {ln}
      </text>
    ))}
  </g>
);

// ---------------------------------------------------------------- the power's look
/** While you hear: a cool lift in the grade, a HEAR chip and faint rings at the top of the frame. */
export const listen: LookDef = {
  grade: (lv) => `saturate(${1 + 0.15 * lv}) contrast(${1 + 0.05 * lv}) hue-rotate(${-6 * lv}deg)`,
  Overlay: ({ f, p }) => (
    <g>
      <HudChip x={60} y={250} f={f} label="DENGAR" icon="dot" />
      {[0, 1].map((i) => {
        const q = ((f + i * 12) % 24) / 24;
        return <circle key={i} cx={540} cy={-200} r={500 + q * 300} fill="none" stroke={CYAN} strokeWidth={4} opacity={0.18 * Math.sin(q * Math.PI)} />;
      })}
    </g>
  ),
};

/** The noise: everything shakes and the colour drains. */
export const noise: LookDef = {
  grade: (lv) => `saturate(${1 - 0.55 * lv}) contrast(${1 + 0.12 * lv})`,
  jitter: 5,
  Overlay: ({ f, lv }) => (
    <g opacity={0.5 * lv}>
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x={0} y={(rnd(f % 13, i) * 1920) | 0} width={1080} height={3 + rnd(i, f % 7) * 6} fill="#FFFFFF" opacity={0.12} />
      ))}
    </g>
  ),
};

/** The portrait title: small line, two big lines, the accent word in yellow and pulsing. */
export const PTitle: React.FC<{ t: number; cx: number; y: number; lines: string[]; accent?: string; size?: number }> = ({ t, cx, y, lines, accent = '', size = 112 }) => {
  const pop = (d: number) => backOut(clamp((t - d) / 9));
  const pulse = t >= 30 && t < 46 ? 1 + 0.12 * Math.sin(((t - 30) / 16) * Math.PI) : 1;
  return (
    <g>
      <g transform={`translate(${cx} ${y}) scale(${pop(2)})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={size * 0.46} letterSpacing={6} fill="#F6EFE3" stroke={INK} strokeWidth={9} paintOrder="stroke">
          {lines[0]}
        </text>
      </g>
      {lines.slice(1).map((ln, i) => (
        <g key={i} transform={`translate(${cx} ${y + size * (0.98 + i * 1.02)}) scale(${pop(5 + i * 3)})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill="#FF8A3D" stroke={INK} strokeWidth={14} paintOrder="stroke" style={{ filter: 'drop-shadow(0 0 22px rgba(127,227,255,0.45))' }}>
            {ln.split(' ').map((w, j) => (
              <tspan key={j} fill={accent && w.includes(accent) ? CYAN : undefined} style={accent && w.includes(accent) ? { fontSize: size * 1.06 * pulse } : undefined}>
                {(j ? ' ' : '') + w}
              </tspan>
            ))}
          </text>
        </g>
      ))}
    </g>
  );
};

/** A source chip (the turn's citation), mono, on a pill. */
export const SourceChip: React.FC<{ x: number; y: number; t: number; text: string; w?: number }> = ({ x, y, t, text, w = 560 }) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 7));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-w / 2} y={-34} width={w} height={68} rx={34} fill={UI.pill} opacity={0.8} />
      <text x={0} y={11} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#F6EFE3">{text}</text>
    </g>
  );
};

/** A little head icon for the schematic (a person, seen from the front). */
export const HeadIcon: React.FC<{ x: number; y: number; s?: number; t: number; color?: string; lit?: number }> = ({ x, y, s = 1, t, color = '#F6EFE3', lit = 0 }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 6)) * s;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      {lit > 0 ? <circle cx={0} cy={-10} r={70} fill={CYAN} opacity={0.18 * lit} /> : null}
      <circle cx={0} cy={-30} r={26} fill="none" stroke={color} strokeWidth={6} />
      <path d="M -40 40 Q -40 0 0 0 Q 40 0 40 40" fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};

export { Glow, easeOut };
