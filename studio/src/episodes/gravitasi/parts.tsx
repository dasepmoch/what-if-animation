import React from 'react';
import { clamp, kf, lerp, rnd, easeOut, backOut, FONT, C, LOOKS, Glow, UI, SCH } from '../../engine';

// Pieces for "Gimana kalau gravitasimu cuma 10%?" (portrait, 1080 x 1920). Everything is a pure function of t.

export const PIP = LOOKS.pipHood;
export const CYAN = '#7FE3FF';
export const RED = '#FF4A5A';

/** A jump arc: 0 on the ground, peak `h` at the middle, over `dur` frames from t0. Returns the lift (positive up). */
export const arc = (t: number, t0: number, dur: number, h: number) => {
  const u = clamp((t - t0) / dur);
  return 4 * h * u * (1 - u);
};

/** Speed streaks around a moving body: vertical by default (a fast rise or fall). */
export const SpeedLines: React.FC<{ x: number; y: number; w: number; h: number; t: number; n?: number; o?: number; angle?: number; color?: string; seed?: number }> = ({
  x, y, w, h, t, n = 14, o = 0.55, angle = 0, color = '#FFF3DC', seed = 3,
}) => (
  <g transform={`rotate(${angle} ${x} ${y})`} opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const lx = x - w / 2 + rnd(seed, i) * w;
      const len = h * (0.25 + rnd(seed + 1, i) * 0.45);
      const ly = y - h / 2 + ((rnd(seed + 2, i) * h + t * 60) % h);
      return <line key={i} x1={lx} y1={ly} x2={lx} y2={ly + len} stroke={color} strokeWidth={2 + rnd(seed + 3, i) * 4} strokeLinecap="round" opacity={0.4 + rnd(seed + 4, i) * 0.6} />;
    })}
  </g>
);

/** A dust puff that bursts out at a take-off or a landing, from t = 0 over 16 frames. */
export const Puff: React.FC<{ x: number; y: number; t: number; s?: number; color?: string }> = ({ x, y, t, s = 1, color = '#CDB8A8' }) => {
  if (t < 0 || t > 18) return null;
  const k = easeOut(t / 18);
  return (
    <g opacity={(1 - k) * 0.7}>
      {[-1, -0.55, 0.55, 1].map((d, i) => (
        <circle key={i} cx={x + d * 90 * s * k} cy={y - 10 * s - 18 * s * k * Math.abs(d)} r={(16 + 18 * k) * s} fill={color} />
      ))}
    </g>
  );
};

/** The power's readout, inside the picture: "G 10%" with a down arrow, in the mono face. */
export const GChip: React.FC<{ x: number; y: number; t: number; s?: number; value?: string; red?: number }> = ({ x, y, t, s = 1, value = '10%', red = 0 }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 7));
  const col = red > 0.5 ? RED : CYAN;
  return (
    <g transform={`translate(${x} ${y}) scale(${k * s})`}>
      <rect x={-170} y={-50} width={340} height={100} rx={50} fill={UI.pill} opacity={0.7} />
      <rect x={-170} y={-50} width={340} height={100} rx={50} fill="none" stroke={col} strokeWidth={4} opacity={0.9} />
      <path d="M -118 -22 L -118 14 M -134 0 L -118 18 L -102 0" stroke={col} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x={24} y={18} textAnchor="middle" fontFamily={FONT.ui} fontSize={50} fill={UI.text} letterSpacing={4}>
        G <tspan fill={col}>{value}</tspan>
      </text>
    </g>
  );
};

/** Two buildings with an alley between them, seen side on: the left roof (yL), the right roof (yR). Covers the set's deck. */
export const RoofBlocks: React.FC<{ gx0: number; gx1: number; yL: number; yR: number; t: number; red?: number; deep?: number }> = ({ gx0, gx1, yL, yR, t, red = 0, deep = 2200 }) => {
  const wall = red > 0.5 ? '#1A0A14' : '#1C1626';
  const wallR = red > 0.5 ? '#16070F' : '#181322';
  return (
    <g>
      {/* the alley: a deep dark slot with a few lit windows and a sliver of street far below */}
      <rect x={gx0} y={Math.min(yL, yR) + 20} width={gx1 - gx0} height={deep} fill="#0A0710" />
      <rect x={gx0} y={Math.min(yL, yR) + deep - 160} width={gx1 - gx0} height={160} fill="#3A2630" opacity={0.6} />
      {Array.from({ length: 6 }).map((_, i) => (
        <circle key={`car${i}`} cx={gx0 + 30 + ((t * (2 + i) + i * 90) % Math.max(60, gx1 - gx0 - 60))} cy={Math.min(yL, yR) + deep - 70} r={5} fill={i % 2 ? '#FF6A5A' : '#FFE2B0'} opacity={0.8} />
      ))}
      {/* left building */}
      <rect x={-900} y={yL} width={gx0 + 900} height={deep} fill={wall} />
      <rect x={gx0 - 26} y={yL + 30} width={26} height={deep} fill="#120D18" opacity={0.8} />
      {Array.from({ length: 5 }).map((_, c) =>
        Array.from({ length: 14 }).map((__, rr) => {
          const q = rnd(71, c * 17 + rr);
          return q > 0.5 ? <rect key={`wl${c}-${rr}`} x={gx0 - 80 - c * 70} y={yL + 90 + rr * 110} width={34} height={56} fill={q > 0.9 ? '#9FC0FF' : '#FFC27A'} opacity={(0.25 + q * 0.5) * (1 - red * 0.5)} /> : null;
        }),
      )}
      <rect x={-900} y={yL - 30} width={gx0 + 900} height={34} fill="#2B2230" />
      <rect x={-900} y={yL - 30} width={gx0 + 900} height={3} fill="#FFB46A" opacity={0.5 * (1 - red)} />
      {/* right building */}
      <rect x={gx1} y={yR} width={2400} height={deep} fill={wallR} />
      <rect x={gx1} y={yR + 30} width={22} height={deep} fill="#2A2034" opacity={0.7} />
      {Array.from({ length: 5 }).map((_, c) =>
        Array.from({ length: 14 }).map((__, rr) => {
          const q = rnd(73, c * 13 + rr);
          return q > 0.55 ? <rect key={`wr${c}-${rr}`} x={gx1 + 50 + c * 70} y={yR + 90 + rr * 110} width={34} height={56} fill="#FFC27A" opacity={(0.2 + q * 0.5) * (1 - red * 0.5)} /> : null;
        }),
      )}
      <rect x={gx1} y={yR - 30} width={2400} height={34} fill="#2B2230" />
      <rect x={gx1} y={yR - 30} width={2400} height={3} fill="#FFB46A" opacity={0.5 * (1 - red)} />
      {/* clutter: a vent and a pipe on the left roof, a water tank on the right */}
      <rect x={gx0 - 380} y={yL - 110} width={120} height={80} rx={6} fill="#3A3444" />
      <rect x={gx0 - 380} y={yL - 110} width={120} height={3} fill="#FFB46A" opacity={0.5} />
      <rect x={gx0 - 200} y={yL - 90} width={18} height={60} fill="#3A3444" />
      <g fill="#2A2040">
        <rect x={gx1 + 210} y={yR - 260} width={130} height={100} rx={6} />
        <path d={`M ${gx1 + 200} ${yR - 258} L ${gx1 + 275} ${yR - 300} L ${gx1 + 350} ${yR - 258} Z`} />
        <path d={`M ${gx1 + 220} ${yR - 160} L ${gx1 + 214} ${yR - 30} M ${gx1 + 330} ${yR - 160} L ${gx1 + 336} ${yR - 30}`} stroke="#2A2040" strokeWidth={9} />
      </g>
    </g>
  );
};

/** The portrait title card: a small line, then two big lines, centred on x = cx. Pops on line by line. */
export const PTitle: React.FC<{ t: number; cx: number; y: number; lines: string[]; accent?: string; size?: number }> = ({ t, cx, y, lines, accent = '10%', size = 132 }) => {
  const pop = (d: number) => backOut(clamp((t - d) / 9));
  const pulse = t >= 30 && t < 44 ? 1 + 0.16 * Math.sin(((t - 30) / 14) * Math.PI) : 1;
  return (
    <g>
      <g transform={`translate(${cx} ${y}) scale(${pop(2)})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={size * 0.46} letterSpacing={6} fill="#F6EFE3" stroke="#1A1230" strokeWidth={9} paintOrder="stroke">
          {lines[0]}
        </text>
      </g>
      {lines.slice(1).map((ln, i) => (
        <g key={i} transform={`translate(${cx} ${y + size * (0.98 + i * 1.02)}) scale(${pop(5 + i * 3)})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={C.orange} stroke="#1A1230" strokeWidth={14} paintOrder="stroke" style={{ filter: 'drop-shadow(0 0 22px rgba(255,138,61,0.55))' }}>
            {ln.split(' ').map((w, j) => (
              <tspan key={j} fill={w.includes(accent) ? '#FFE27A' : undefined} style={w.includes(accent) ? { fontSize: size * 1.12 * pulse } : undefined}>
                {(j ? ' ' : '') + w}
              </tspan>
            ))}
          </text>
        </g>
      ))}
    </g>
  );
};

/** A sleeve and a mitten coming into an insert from off frame (from), the hand at (x, y), angle `ang`, scale `s`. */
export const InsertArm: React.FC<{ from: { x: number; y: number }; x: number; y: number; ang: number; s?: number; look?: typeof PIP; w?: number; rim?: string; point?: boolean }> = ({
  from, x, y, ang, s = 4.6, look = PIP, w = 100, rim = 'rimR', point = false,
}) => {
  const mid = { x: lerp(from.x, x, 0.5) + (from.y - y) * 0.08, y: lerp(from.y, y, 0.5) };
  const d = `M ${x} ${y} Q ${mid.x} ${mid.y} ${from.x} ${from.y}`;
  return (
    <g filter={`url(#${rim})`}>
      <path d={d} stroke={look.line} strokeWidth={w + 18} fill="none" strokeLinecap="round" />
      <path d={d} stroke={look.limb} strokeWidth={w} fill="none" strokeLinecap="round" />
      <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${s})`}>
        {point ? <rect x={-4} y={10} width={8} height={24} rx={4} fill={look.hand} stroke={look.line} strokeWidth={2.4} /> : null}
        <path d="M -11 -2 Q -14 14 -6 18 L 7 18 Q 14 14 11 -2 Z" fill={look.hand} stroke={look.line} strokeWidth={2.6} strokeLinejoin="round" />
        <ellipse cx={-10} cy={6} rx={4.5} ry={7} fill={look.hand} stroke={look.line} strokeWidth={2.4} />
      </g>
    </g>
  );
};

/** A glass cookie jar with a cork lid and cookies inside. (x, y) is the bottom centre. */
export const CookieJar: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={60} ry={10} fill="#000" opacity={0.35} />
    <path d="M -54 0 Q -62 -60 -50 -110 L 50 -110 Q 62 -60 54 0 Z" fill="#BFD8E6" opacity={0.28} stroke="#E9F4FA" strokeWidth={3} />
    {[[-26, -22], [8, -18], [30, -30], [-14, -50], [18, -58], [-30, -68], [4, -82]].map(([cx, cy], i) => (
      <g key={i}>
        <ellipse cx={cx} cy={cy} rx={22} ry={13} fill="#C98A4A" stroke="#7A4A24" strokeWidth={2} transform={`rotate(${(i * 37) % 50 - 25} ${cx} ${cy})`} />
        <circle cx={cx - 6} cy={cy - 2} r={3} fill="#4A2A1A" />
        <circle cx={cx + 7} cy={cy + 3} r={2.6} fill="#4A2A1A" />
      </g>
    ))}
    <rect x={-44} y={-132} width={88} height={26} rx={6} fill="#B98A5A" stroke="#6A4A2A" strokeWidth={3} />
    <path d="M -40 -96 Q -46 -50 -38 -12" stroke="#FFFFFF" strokeWidth={6} opacity={0.5} fill="none" strokeLinecap="round" />
    <rect x={-30} y={-74} width={60} height={30} rx={4} fill="#F6EFE3" opacity={0.9} />
    <text x={0} y={-52} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={22} fill="#6A3A2A">KUE</text>
  </g>
);

/** A wall shelf (a plank on two brackets) at (x0..x1, y). */
export const Shelf: React.FC<{ x0: number; x1: number; y: number }> = ({ x0, x1, y }) => (
  <g>
    <rect x={x0} y={y} width={x1 - x0} height={16} fill="#6A4A3A" />
    <rect x={x0} y={y} width={x1 - x0} height={3} fill="#FFB46A" opacity={0.6} />
    <rect x={x0} y={y + 16} width={x1 - x0} height={10} fill="#000" opacity={0.25} />
    {[x0 + 30, x1 - 30].map((bx, i) => (
      <path key={i} d={`M ${bx} ${y + 16} L ${bx} ${y + 60} L ${bx + (i ? -36 : 36)} ${y + 16} Z`} fill="#3A2A26" />
    ))}
  </g>
);

/** A bathroom scale from the front-above, its display reading `kg`. */
export const Scale: React.FC<{ x: number; y: number; s?: number; kg: string; glow?: number }> = ({ x, y, s = 1, kg, glow = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={40} rx={230} ry={30} fill="#000" opacity={0.4} />
    <path d="M -210 30 L -180 -120 L 180 -120 L 210 30 Z" fill="#E8E4DC" />
    <path d="M -210 30 L 210 30 L 206 46 L -206 46 Z" fill="#B8B2A8" />
    <path d="M -180 -120 L 180 -120 L 186 -100 L -186 -100 Z" fill="#FFFFFF" opacity={0.5} />
    <rect x={-90} y={-104} width={180} height={64} rx={10} fill="#141820" />
    <rect x={-90} y={-104} width={180} height={64} rx={10} fill={CYAN} opacity={0.08 * glow} />
    <text x={0} y={-56} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill={CYAN} style={{ filter: `drop-shadow(0 0 10px ${CYAN})` }}>
      {kg}
    </text>
    <text x={68} y={-46} textAnchor="end" fontFamily={FONT.ui} fontSize={14} fill={CYAN} opacity={0.8}>KG</text>
  </g>
);

/** A long bone (a femur), drawn as an outline on the schematic, with a density fill 0..1 (porous when low). */
export const Bone: React.FC<{ x: number; y: number; s?: number; rot?: number; density?: number; t: number; draw?: number; color?: string; crack?: number }> = ({
  x, y, s = 1, rot = 0, density = 1, t, draw = 1, color = SCH.line, crack = 0,
}) => {
  const d = 'M -40 -330 C -90 -360 -100 -290 -60 -270 C -40 -260 -36 -240 -36 -220 L -30 220 C -30 250 -70 260 -76 290 C -84 340 -20 350 0 320 C 20 350 84 340 76 290 C 70 260 30 250 30 220 L 36 -220 C 36 -240 40 -260 60 -270 C 100 -290 90 -360 40 -330 C 20 -320 -20 -320 -40 -330 Z';
  const holes = Array.from({ length: 70 }).map((_, i) => ({ x: (rnd(91, i) - 0.5) * 56, y: -280 + rnd(92, i) * 580, r: 3 + rnd(93, i) * 7 }));
  const nh = Math.round((1 - density) * holes.length * 1.4);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <defs>
        <clipPath id={`bone${Math.round(x)}${Math.round(y)}`}>
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill="#E9F0F6" opacity={0.18 + 0.5 * density} />
      <g clipPath={`url(#bone${Math.round(x)}${Math.round(y)})`}>
        {holes.slice(0, Math.min(holes.length, nh)).map((h, i) => (
          <circle key={i} cx={h.x} cy={h.y} r={h.r} fill={SCH.ground} opacity={0.9} />
        ))}
      </g>
      <path d={d} fill="none" stroke={color} strokeWidth={5} strokeDasharray={2600} strokeDashoffset={2600 * (1 - clamp(draw))} strokeLinejoin="round" />
      {crack > 0 ? (
        <path d="M -34 60 L -8 40 L -16 20 L 14 0 L 4 -18 L 34 -40" stroke={RED} strokeWidth={7} fill="none" strokeLinejoin="round" strokeDasharray={160} strokeDashoffset={160 * (1 - clamp(crack))} style={{ filter: `drop-shadow(0 0 10px ${RED})` }} />
      ) : null}
    </g>
  );
};

/** A simple line astronaut, floating, for the schematic. */
export const Astronaut: React.FC<{ x: number; y: number; s?: number; t: number; draw?: number }> = ({ x, y, s = 1, t, draw = 1 }) => {
  const k = clamp(draw);
  return (
    <g transform={`translate(${x} ${y + Math.sin(t / 14) * 10}) rotate(${-12 + Math.sin(t / 22) * 6}) scale(${s})`} opacity={k} fill="none" stroke={SCH.line} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
      <rect x={-56} y={-40} width={112} height={130} rx={36} fill="#1A2840" />
      <circle cx={0} cy={-90} r={58} fill="#1A2840" />
      <path d="M -34 -96 Q 0 -126 34 -96 Q 34 -66 0 -60 Q -34 -66 -34 -96 Z" fill={SCH.live} stroke={SCH.live} opacity={0.85} />
      <rect x={-80} y={-26} width={26} height={90} rx={10} fill="#1A2840" />
      <path d="M -56 -10 Q -110 10 -120 60 M 56 -10 Q 110 -30 128 -70" />
      <path d="M -30 90 Q -40 150 -60 190 M 30 90 Q 50 140 80 170" />
      <rect x={-22} y={0} width={44} height={30} rx={6} />
    </g>
  );
};

/** A phone held upright, with a video playing: a thumbnail of a tiny figure mid-air and a view counter. */
export const PhoneVideo: React.FC<{ x: number; y: number; w?: number; t: number; views: number; rot?: number }> = ({ x, y, w = 420, t, views, rot = 0 }) => {
  const h = w * 2;
  const fy = -h * 0.12 - arcLift(t) * w * 0.35;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2 - 14} y={-h / 2 - 14} width={w + 28} height={h + 28} rx={w * 0.14} fill="#0E0D14" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.11} fill="#2A1E3A" />
      <defs>
        <linearGradient id="pvsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5A3A6E" />
          <stop offset="75%" stopColor="#F29A6A" />
        </linearGradient>
        <clipPath id="pvclip">
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.11} />
        </clipPath>
      </defs>
      <g clipPath="url(#pvclip)">
        <rect x={-w / 2} y={-h / 2} width={w} height={h * 0.62} fill="url(#pvsky)" />
        <circle cx={w * 0.12} cy={-h * 0.02} r={w * 0.16} fill="#FFD27A" opacity={0.9} />
        <path d={`M ${-w / 2} ${h * 0.12} L ${-w * 0.15} ${h * 0.12} L ${-w * 0.15} ${h / 2} L ${-w / 2} ${h / 2} Z M ${w * 0.12} ${h * 0.14} L ${w / 2} ${h * 0.14} L ${w / 2} ${h / 2} L ${w * 0.12} ${h / 2} Z`} fill="#1C1626" />
        {/* the tiny figure, mid-leap */}
        <g transform={`translate(${-w * 0.02} ${fy}) scale(${w / 200})`}>
          <circle cx={0} cy={-26} r={14} fill="#F6EFE3" />
          <path d="M 0 -12 L 0 14 M 0 -4 L -16 -16 M 0 -4 L 16 -18 M 0 14 L -12 30 M 0 14 L 14 28" stroke="#2E2B3D" strokeWidth={7} strokeLinecap="round" />
        </g>
        <rect x={-w / 2} y={h * 0.3} width={w} height={h * 0.2} fill="#0B0816" opacity={0.8} />
        <text x={-w / 2 + 26} y={h * 0.36} fontFamily={FONT.ui} fontSize={w * 0.075} fill="#F6EFE3">
          {Math.round(views).toLocaleString('id-ID')} x ditonton
        </text>
        <rect x={-w / 2 + 26} y={h * 0.39} width={(w - 52) * clamp((t % 90) / 90)} height={8} rx={4} fill={RED} />
        <rect x={-w / 2 + 26} y={h * 0.39} width={w - 52} height={8} rx={4} fill="#FFFFFF" opacity={0.2} />
        {/* hearts drifting up the right edge */}
        {Array.from({ length: 6 }).map((_, i) => {
          const p = ((t + i * 11) % 60) / 60;
          return <path key={i} transform={`translate(${w * 0.38 + Math.sin(p * 6 + i) * 10} ${h * 0.26 - p * h * 0.4}) scale(${0.9 + rnd(5, i) * 0.6})`} d="M 0 8 C -16 -4 -12 -18 0 -10 C 12 -18 16 -4 0 8 Z" fill={RED} opacity={1 - p} />;
        })}
      </g>
      <rect x={-w * 0.12} y={-h / 2 + 12} width={w * 0.24} height={14} rx={7} fill="#0E0D14" />
    </g>
  );
};
const arcLift = (t: number) => Math.abs(Math.sin((t / 40) * Math.PI));

/** Wind streaks across the frame, moving right to left. */
export const Wind: React.FC<{ t: number; x0: number; y0: number; w: number; h: number; n?: number; o?: number }> = ({ t, x0, y0, w, h, n = 22, o = 0.5 }) => (
  <g opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const len = 120 + rnd(31, i) * 260;
      const x = x0 + w - ((t * (34 + rnd(32, i) * 30) + rnd(33, i) * w * 2) % (w + len * 2)) + len;
      const y = y0 + rnd(34, i) * h;
      return <path key={i} d={`M ${x} ${y} q ${-len / 2} ${-14} ${-len} ${0}`} stroke="#F6EFE3" strokeWidth={2 + rnd(35, i) * 3} fill="none" strokeLinecap="round" opacity={0.3 + rnd(36, i) * 0.5} />;
    })}
  </g>
);

/** A folder with a clipped photo of Pip and a red "10%" stamp. */
export const Dossier: React.FC<{ x: number; y: number; s?: number; t: number; rot?: number }> = ({ x, y, s = 1, t, rot = 0 }) => {
  const st = backOut(clamp((t - 10) / 6));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-170} y={-120} width={340} height={240} rx={8} fill="#C9A46A" />
      <rect x={-160} y={-112} width={320} height={226} rx={6} fill="#EFE6D2" />
      <rect x={-140} y={-92} width={110} height={130} fill="#2A2034" />
      <circle cx={-85} cy={-40} r={30} fill="#F6EFE3" />
      <path d="M -125 38 Q -85 -6 -45 38 Z" fill="#2E2B3D" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={0} y={-80 + i * 30} width={130 - i * 20} height={10} rx={5} fill="#8A8070" opacity={0.6} />
      ))}
      <text x={-140} y={92} fontFamily={FONT.ui} fontSize={22} fill="#4A4038">SUBJEK: G-10</text>
      <g transform={`translate(70 60) rotate(-14) scale(${st})`} opacity={st > 0 ? 0.92 : 0}>
        <rect x={-74} y={-34} width={148} height={68} rx={8} fill="none" stroke={RED} strokeWidth={6} />
        <text y={20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill={RED}>10%</text>
      </g>
    </g>
  );
};

/** A medal on a ribbon. */
export const Medal: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const k = backOut(clamp(t / 8));
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k}) rotate(${Math.sin(t / 5) * 6})`}>
      <path d="M -22 -70 L -8 0 L 8 0 L 22 -70" stroke="#C93A4A" strokeWidth={16} fill="none" />
      <circle cx={0} cy={22} r={30} fill="#F2C24A" stroke="#B8862A" strokeWidth={5} />
      <text y={34} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#8A5A1A">1</text>
      <Glow x={0} y={22} r={70} o={0.5} />
    </g>
  );
};

export { kf, lerp, clamp, easeOut, backOut, rnd };
