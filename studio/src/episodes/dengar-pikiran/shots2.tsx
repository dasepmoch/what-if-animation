import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, lerp, easeOut, easeIn, easeInOut, backOut, rnd, settle, camV, LEG_LEN, toWorld, walkPose, FloatLabel,
  Kitchen, KitchenIsland, KITCHEN, stand, Classroom, CLS, SchoolDesk, Kid, KIDS, Bedroom, BEDROOM, bedSit, BedDuvet, CAL, Rooftop,
  Schematic, SCH, SchLabel, CountUp, DrawOn, Arrow, Foreground, Glow, Dust, Sparkle, FocusRings, DizzyStars, Tabletop, WallCalendar, ShotProps, FONT,
} from '../../engine';
import { PIP, MOM, MO, CYAN, RED, INK, Thought, Ripples, Swarm, Scribble, PicBike, PicCard, PicHeart, PicLie, SourceChip, HeadIcon } from './parts';
import { InsertArm, Medal } from '../gravitasi/parts';
import { K_PIP, K_MOM, Cupboard, headOf } from './shots1';

const P = (p: Partial<Pose>): Pose => ({ ...basePose, ...p });
const C_PIP = { x: 1260, y: 760 - LEG_LEN * 0.95 + 120, scale: 0.95 };

// ================= 3: the fun part =================
// S15: medium on the roof at dusk: Pip throws his arms up, grinning; sparkles
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: { x: 960, y: 820 - LEG_LEN * 0.95, scale: 0.95, yaw: 0.2, look: 0.2, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } } },
    { f: 3, p: { squash: 0.08, armL: { a: -30, b: -20 }, armR: { a: 30, b: 20 } }, ease: easeOut },
    { f: 7, p: { squash: -0.04, armL: { a: -150, b: 10 }, armR: { a: 150, b: -10 } }, ease: easeOut },
    { f: 11, p: { squash: 0, armL: { a: -140, b: 14 }, armR: { a: 140, b: -14 } } },
  ]);
  const h = headOf(pip);
  return (
    <g transform={camV(960, kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.8], [len, 1.9]]))}>
      <Rooftop t={t + 300} sunX={1080} sunY={600} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <ellipse cx={960} cy={822} rx={80} ry={11} fill="#000" opacity={0.35} />
      <Sparkle x={h.x + 170} y={h.y - 80} t={t - 6} s={1.2} />
      <Sparkle x={h.x - 190} y={h.y - 20} t={t - 10} s={0.9} />
      <Sparkle x={h.x + 60} y={h.y - 220} t={t - 14} s={0.8} />
    </g>
  );
};

// S16: medium, kitchen: mum hides a wrapped present behind her back, all innocence. Her thought: a bike
const Present: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-60} y={-60} width={120} height={100} fill="#3E8C86" stroke={INK} strokeWidth={4} />
    <rect x={-10} y={-60} width={20} height={100} fill="#FFE27A" />
    <path d="M 0 -60 Q -40 -100 -20 -66 M 0 -60 Q 40 -100 20 -66" stroke="#FFE27A" strokeWidth={10} fill="none" />
  </g>
);
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const mom = P({ ...K_MOM, yaw: -0.5, look: -0.6, armL: { a: -20, b: 30 }, armR: { a: -24, b: 34 }, headTilt: 6 });
  const h = headOf(mom);
  return (
    <g transform={camV(h.x - 60, h.y + 20, kf(t, [[0, 1.9], [len, 2.05]]))}>
      <Kitchen t={t + 400} id="k16" veil={0.42} />
      <Cupboard />
      <Present x={mom.x + 70} y={mom.y + 10} s={0.8} />
      <Hero look={MOM} pose={{ ...mom, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
      <KitchenIsland />
      <Thought x={h.x - 60} y={h.y - 230} w={300} h={210} t={t - 4} from={{ x: h.x - 20, y: h.y - 80 }} seed={16}>
        <PicBike />
      </Thought>
    </g>
  );
};

// S17: insert: the calendar on the fridge; today's date, and a circled birthday a whole month away; a "-30 HARI" tag
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camV(960, 1240, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <rect x={-300} y={-300} width={2600} height={2600} fill="#3A3F4A" />
    <Glow x={700} y={500} r={900} o={0.35} />
    <WallCalendar x={960} y={880} w={760} crossed={0} />
    <g opacity={0}>
      <circle cx={1180} cy={1290} r={56} fill="none" stroke={RED} strokeWidth={10} />
      <text x={1180} y={1390} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={56} fill={RED}>ULTAH!</text>
    </g>
    <g transform={`translate(${960} ${1560}) scale(${backOut(clamp((t - 8) / 7))})`}>
      <rect x={-200} y={-56} width={400} height={112} rx={56} fill="#1A1626" opacity={0.85} />
      <text x={0} y={22} textAnchor="middle" fontFamily={FONT.ui} fontSize={64} fill={CYAN}>-30 HARI</text>
    </g>
  </g>
);

// S18: insert, top-down: cards on the table; Mo's hand guards his card; his thought shows it: the seven of hearts
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camV(960, 960, kf(t, [[0, 1.0], [len, 1.07]]))}>
    <Tabletop edge={1800} />
    {[[700, 1100, -12], [880, 1140, 6], [1060, 1120, 16]].map(([x, y, r], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
        <rect x={-80} y={-110} width={160} height={220} rx={14} fill="#2E3A6A" stroke="#F6EFE3" strokeWidth={6} />
        <path d="M -60 -90 L 60 90 M 60 -90 L -60 90" stroke="#4A5A8A" strokeWidth={6} />
      </g>
    ))}
    <g transform="translate(1300 520) rotate(170)">
      <rect x={-80} y={-110} width={160} height={220} rx={14} fill="#2E3A6A" stroke="#F6EFE3" strokeWidth={6} />
    </g>
    <InsertArm from={{ x: 1500, y: -400 }} x={1300} y={420} ang={170} s={5} look={MO} w={150} rim="rimL" />
    <Thought x={700} y={500} w={360} h={260} t={t - 4} seed={18} from={{ x: 1120, y: 380 }}>
      <PicCard />
    </Thought>
    <InsertArm from={{ x: 300, y: 2200 }} x={760} y={1300} ang={20} s={5} look={PIP} w={150} rim="rimR" point />
  </g>
);

// S19: medium two-shot: Pip slaps down the seven of hearts; Mo throws his cards up
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: { ...C_PIP, x: 1180, yaw: -0.5, look: -0.5, armR: { a: 20, b: -10 }, armL: { a: 20, b: -10 } } },
    { f: 3, p: { armL: { a: 120, b: 30 } }, ease: easeOut },
    { f: 6, p: { armL: { a: 70, b: 10 } }, ease: easeIn },
  ]);
  const mo = poseAt(t, [
    { f: 0, p: { x: 760, y: C_PIP.y, scale: 0.95, yaw: 0.5, look: 0.5, armL: { a: 50, b: 60 }, armR: { a: 50, b: 60 } } },
    { f: 7, p: { armL: { a: -150, b: 10 }, armR: { a: 150, b: -10 }, squash: -0.05 }, ease: easeOut },
  ]);
  const fly = clamp((t - 7) / 14);
  return (
    <g transform={camV(970, kf(t, [[0, 520], [len, 510]]), kf(t, [[0, 1.75], [len, 1.82]]))}>
      <Classroom t={t + 500} id="c19" />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'neutral'], [7, 'shock']]) }} rimId="rimR" shadow={0} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'smug']]) }} rimId="rimL" shadow={0} />
      <SchoolDesk x={970} />
      <g transform={`translate(${960} ${742}) scale(${backOut(clamp((t - 5) / 4))})`}>
        <rect x={-50} y={-70} width={100} height={140} rx={10} fill="#FFFFFF" stroke={INK} strokeWidth={4} transform="rotate(-80)" />
        <path d="M 0 -6 C -26 -30 -38 10 0 28 C 38 10 26 -30 0 -6 Z" fill="#D23A4A" />
      </g>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={760 + (i - 1.5) * 80 * fly} y={430 - Math.sin(fly * Math.PI) * 180 - i * 20 * fly} width={60} height={84} rx={8} fill="#2E3A6A" stroke="#F6EFE3" strokeWidth={4}
          transform={`rotate(${(i - 1.5) * 50 * fly} ${790 + (i - 1.5) * 80 * fly} ${470})`} opacity={t > 7 ? 1 : 0} />
      ))}
    </g>
  );
};

// S20: medium: a classmate swears it's true, hand on heart; over him, the thought: JUJUR, crossed out
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const kid = { x: 900, y: 760 };
  return (
    <g transform={camV(900, kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.9], [len, 2.0]]))}>
      <Classroom t={t + 600} id="c20" />
      <Kid x={kid.x} y={kid.y} s={1.25} look={KIDS[1]} turn={1} laugh={0.3} t={t} />
      <Thought x={kid.x + 40} y={kid.y - 470} w={280} h={180} t={t - 4} seed={20} from={{ x: kid.x + 20, y: kid.y - 260 }} tone="red">
        <PicLie />
      </Thought>
      <Ripples x={kid.x - 360} y={kid.y - 220} t={t} r0={40} o={0.4} />
    </g>
  );
};

// S21: over Pip's shoulder: a classmate glances back, looks away fast; a little heart floats up from her
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const kid = { x: 860, y: 760 };
  return (
    <g transform={camV(960, kf(t, [[0, 560], [len, 550]]), kf(t, [[0, 1.75], [len, 1.85]]))}>
      <Classroom t={t + 650} id="c21" />
      <Kid x={kid.x} y={kid.y} s={1.0} look={KIDS[0]} turn={t < 10 ? 1 : 0} t={t} />
      <Thought x={kid.x + 40} y={kid.y - 420} w={240} h={180} t={t - 6} seed={21} from={{ x: kid.x, y: kid.y - 230 }}>
        <PicHeart beat={t} />
      </Thought>
      <Foreground blur={16}>
        <g transform="translate(1190 980)">
          <path d="M -280 800 Q -300 200 -40 160 Q 220 140 260 800 Z" fill="#14121C" />
          <circle cx={-20} cy={0} r={220} fill="#1A1724" />
          <path d="M -200 -60 Q -180 -210 -20 -210 Q 140 -210 170 -60" stroke="#FFB46A" strokeWidth={8} fill="none" opacity={0.3} />
        </g>
      </Foreground>
    </g>
  );
};

// S22: medium: the board: RANKING, "1. KAMU"; Pip with a medal, the class applauding
const RankBoard: React.FC<{ t: number }> = ({ t }) => (
  <g fontFamily={FONT.hand} fill="#E9F0E6" opacity={0.92}>
    <text x={740} y={290} textAnchor="middle" fontSize={64} fontWeight={700}>RANKING</text>
    <path d="M 560 320 L 920 320" stroke="#E9F0E6" strokeWidth={4} />
    <text x={600} y={400} fontSize={56} fontWeight={700} fill="#FFE27A" opacity={clamp((t - 4) / 4)}>1. KAMU</text>
    <text x={600} y={470} fontSize={44} opacity={0.6}>2. ...</text>
  </g>
);
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: { ...C_PIP, yaw: -0.1, look: -0.3, armL: { a: 30, b: -10 }, armR: { a: 30, b: -10 } } },
    { f: 4, p: { armL: { a: -150, b: 20 }, armR: { a: 30, b: -10 } }, ease: easeOut },
  ]);
  const chest = toWorld(pip, { x: 0, y: -60 });
  return (
    <g transform={camV(kf(t, [[0, 1000], [len, 1040]]), 470, kf(t, [[0, 1.3], [len, 1.4]]))}>
      <Classroom t={t + 700} id="c22" laugh={0.6} board={<RankBoard t={t} />} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
      <SchoolDesk x={1260} />
      <Medal x={chest.x} y={chest.y + 70} s={1.1} t={t - 3} />
    </g>
  );
};

// S23: close-up: shut book on the desk, Pip leans back, the shades drop: no studying
export const S23: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: { ...C_PIP, yaw: -0.3, look: -0.2, tilt: -6, armL: { a: 150, b: 120 }, armR: { a: 20, b: -10 } } },
    { f: 8, p: { tilt: -10 } },
  ]);
  const h = headOf(pip);
  return (
    <g transform={camV(h.x - 10, h.y + 100, kf(t, [[0, 4.6], [len, 4.9]]))}>
      <Classroom t={t + 760} id="c23" />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'cool']]), glasses: easeOut(clamp((t - 3) / 6)) }} rimId="rimL" shadow={0} />
      <Sparkle x={h.x + 60} y={h.y - 10} t={t - 9} s={0.6} />
    </g>
  );
};

// ================= 4: the turn =================
// S24: low, medium: the light dies to red; thoughts begin to crowd in round Pip, his smile goes
export const S24: React.FC<ShotProps> = ({ t, len }) => {
  const pip = P({ ...C_PIP, yaw: -0.2, look: 0.2, headTilt: 4, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } });
  const h = headOf(pip);
  return (
    <g transform={camV(h.x, kf(t, [[0, h.y + 140], [len, h.y + 110]]), kf(t, [[0, 1.9], [len, 2.1]]))}>
      <Classroom t={t + 800} id="c24" />
      <rect x={-500} y={-500} width={3000} height={3000} fill="#4A0A14" opacity={0.45 * clamp(t / 6)} />
      <Swarm cx={h.x} cy={h.y - 120} w={900} h={700} t={t - 4} n={14} grow={len} seed={24} tone="pale" jitter={3} size={0.7} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy'], [6, 'worried']]) }} rimId="rimRed" shadow={0} />
      <SchoolDesk x={1260} />
    </g>
  );
};

// S25: schematic: one head; its thoughts tick past; the counter runs to 6,200 a day
export const S25: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camV(960, 940, kf(t, [[0, 1.02], [len, 1.08]]))}>
    <Schematic t={t + 40} id="sch25" />
    <HeadIcon x={960} y={1120} t={t} s={2.6} color={SCH.line} lit={0.6} />
    {Array.from({ length: 9 }).map((_, i) => {
      const p = ((t * 1.4 + i * 9) % 80) / 80;
      return (
        <Thought key={i} x={960 + Math.sin(i * 2.1) * 260 * p} y={1000 - p * 600} w={110} h={72} t={(t + i * 9) % 80} seed={50 + i} o={Math.sin(p * Math.PI)}>
          <Scribble seed={i} />
        </Thought>
      );
    })}
    <CountUp x={960} y={520} t={t - 2} to={6200} dur={Math.max(16, len - 14)} size={150} color={CYAN} format={(v) => Math.round(v).toLocaleString('id-ID')} />
    <SchLabel x={960} y={600} t={t - 6} text="PIKIRAN / HARI" size={46} color={SCH.dim} />
  </g>
);

// S26: close-up: "Itu nyata." Pip in the dark, red rim; the source chip
export const S26: React.FC<ShotProps> = ({ t, len }) => {
  const pip = P({ ...C_PIP, yaw: -0.15, look: 0.05 });
  const h = headOf(pip);
  return (
    <g transform={camV(h.x, h.y + 110, kf(t, [[0, 4.2], [len, 4.5]]))}>
      <rect x={-500} y={-500} width={3000} height={3000} fill="#0C0812" />
      <Glow x={h.x + 260} y={h.y - 120} r={360} kind="red" o={0.6} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'worried']]) }} rimId="rimRed" shadow={0} />
      <g transform={`translate(${h.x} ${h.y + 200}) scale(0.4) translate(${-h.x} ${-h.y - 200})`}><SourceChip x={h.x} y={h.y + 200} t={t - 3} text="Tseng & Poppenk, Nature Comm. 2020" w={720} /></g>
    </g>
  );
};

// S27: schematic: a class: 30 heads pop in, row by row
const GRID = Array.from({ length: 30 }).map((_, i) => ({ x: 960 + ((i % 5) - 2) * 170, y: 640 + Math.floor(i / 5) * 150 }));
export const S27: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camV(960, 1000, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <Schematic t={t + 80} id="sch27" />
    {GRID.map((g, i) => <HeadIcon key={i} x={g.x} y={g.y} t={t - i * 0.6} s={0.95} color={SCH.line} />)}
    <CountUp x={960} y={470} t={t} to={30} dur={20} size={130} color="#FFE27A" />
    <SchLabel x={960} y={1610} t={t - 8} text="SATU KELAS" size={52} color={SCH.dim} />
  </g>
);

// S28: schematic: every head throws off its thoughts; the counter races to 186,000
export const S28: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camV(960, 1000, kf(t, [[0, 1.05], [len, 0.98]]))}>
    <Schematic t={t + 120} id="sch28" />
    {GRID.map((g, i) => <HeadIcon key={i} x={g.x} y={g.y} t={6} s={0.95} color={CYAN} lit={0.5} />)}
    <Swarm cx={960} cy={1000} w={900} h={900} t={t} n={26} grow={len * 0.8} seed={28} size={0.55} jitter={2} />
    <g transform="translate(0 0)">
      <rect x={560} y={330} width={800} height={190} rx={30} fill="#0C1424" opacity={0.85} />
      <CountUp x={960} y={470} t={t} to={186000} dur={Math.max(18, len - 6)} size={130} color={RED} format={(v) => Math.round(v).toLocaleString('id-ID')} />
    </g>
  </g>
);

// S29: schematic: "Sehari." A clock face whips round once; the number holds
export const S29: React.FC<ShotProps> = ({ t, len }) => {
  const a = easeInOut(clamp(t / Math.max(8, len - 4))) * 360;
  return (
    <g transform={camV(960, 960, kf(t, [[0, 1.1], [len, 1.18]]))}>
      <Schematic t={t + 160} id="sch29" />
      <circle cx={960} cy={980} r={300} fill="none" stroke={SCH.line} strokeWidth={10} />
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d={`M ${960 + Math.sin((i / 12) * 6.283) * 260} ${980 - Math.cos((i / 12) * 6.283) * 260} L ${960 + Math.sin((i / 12) * 6.283) * 290} ${980 - Math.cos((i / 12) * 6.283) * 290}`} stroke={SCH.line} strokeWidth={8} />
      ))}
      <path d={`M 960 980 L ${960 + Math.sin((a / 180) * Math.PI) * 220} ${980 - Math.cos((a / 180) * Math.PI) * 220}`} stroke={RED} strokeWidth={14} strokeLinecap="round" />
      <circle cx={960} cy={980} r={18} fill={RED} />
      <SchLabel x={960} y={560} t={t - 2} text="24 JAM" size={80} color={CYAN} />
    </g>
  );
};

// S30: schematic: all those thoughts stream into one head: yours. It glows, then flares red
export const S30: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(10, len - 4));
  return (
    <g transform={camV(960, 960, kf(t, [[0, 1.0], [len, 1.25]]))}>
      <Schematic t={t + 200} id="sch30" />
      {Array.from({ length: 22 }).map((_, i) => {
        const a = i * 2.39996;
        const p = ((t * 1.6 + i * 7) % 40) / 40;
        const d = 900 * (1 - p);
        return (
          <Thought key={i} x={960 + Math.cos(a) * d} y={960 + Math.sin(a) * d} w={110 * (1 - p * 0.6)} h={72 * (1 - p * 0.6)} t={10} seed={60 + i} o={Math.min(1, p * 4) * (1 - p)}>
            <Scribble seed={i + 3} />
          </Thought>
        );
      })}
      <HeadIcon x={960} y={990} t={10} s={2.4} color={k > 0.6 ? RED : '#FFE27A'} lit={1} />
      <Glow x={960} y={960} r={300 + 200 * k} kind={k > 0.6 ? 'red' : 'cool'} o={0.5} />
    </g>
  );
};

// ================= 4b: the cost on screen =================
// S31: insert: the bedroom calendar, three days crossed off
export const S31: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camV(960, 900, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <rect x={-300} y={-300} width={2600} height={2600} fill="#2E3352" />
    <Glow x={1300} y={500} r={900} kind="cool" o={0.3} />
    <WallCalendar x={960} y={900} w={780} crossed={2} drawing={clamp((t - 3) / 8)} />
    <InsertArm from={{ x: 1800, y: 2000 }} x={1180} y={1110 - 30 * clamp((t - 3) / 8)} ang={-40} s={5} look={PIP} w={150} />
  </g>
);

// S32: wide, class: the room is full of thoughts, layer over layer; Pip at his desk, head down, everything shaking
export const S32: React.FC<ShotProps> = ({ t, len }) => {
  const pip = P({ ...C_PIP, yaw: -0.2, look: 0.1, headTilt: 22, tilt: 10, armL: { a: 40, b: 60 }, armR: { a: 40, b: 60 } });
  return (
    <g transform={camV(960, 480, kf(t, [[0, 1.15], [len, 1.22]]))}>
      <Classroom t={t + 900} id="c32" />
      <Swarm cx={960} cy={360} w={1400} h={700} t={t + 20} n={30} grow={20} seed={32} tone="grey" jitter={6} size={0.8} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'tired']]) }} rimId="rimL" shadow={0} />
      <SchoolDesk x={1260} />
    </g>
  );
};

// S33: wide, bedroom at night: Pip in bed, eyes wide open at 03:12; thoughts drift in through the walls
export const S33: React.FC<ShotProps> = ({ t, len }) => {
  const sit = bedSit(0.2);
  const pip = P({ x: sit.x, y: sit.y, scale: sit.scale, yaw: 0.3, look: 0.2, headTilt: -4, armL: { a: 30, b: 40 }, armR: { a: 30, b: 40 } });
  return (
    <g transform={camV(kf(t, [[0, 780], [len, 760]]), 600, kf(t, [[0, 1.5], [len, 1.58]]))}>
      <Bedroom t={t + 40} id="b33" veil={0.5} clock="03:12" crossed={3} duvet={false} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'tired']]) }} rimId="rimBlue" shadow={0} />
      <BedDuvet knees={1} />
      {Array.from({ length: 10 }).map((_, i) => {
        const p = ((t * 0.7 + i * 13) % 90) / 90;
        const fromR = i % 2 === 0;
        return (
          <Thought key={i} x={fromR ? 1500 - p * 700 : 380 + p * 600} y={250 + rnd(33, i) * 160} w={150} h={100} t={20} seed={70 + i} o={Math.sin(p * Math.PI) * 0.85} tone="grey">
            <Scribble seed={i} />
          </Thought>
        );
      })}
    </g>
  );
};

// S34: close-up: Pip's own little thought tries to form and is crushed by the big grey ones
export const S34: React.FC<ShotProps> = ({ t, len }) => {
  const sit = bedSit(0.2);
  const pip = P({ x: sit.x, y: sit.y, scale: sit.scale, yaw: 0.2, look: -0.2, headTilt: -8 });
  const h = headOf(pip);
  const crush = clamp((t - 10) / 10);
  return (
    <g transform={camV(h.x + 40, h.y - 40, kf(t, [[0, 2.8], [len, 3.0]]))}>
      <Bedroom t={t + 80} id="b34" veil={0.55} clock="03:14" crossed={3} duvet={false} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'tired'], [12, 'dizzy']]) }} rimId="rimBlue" shadow={0} />
      <BedDuvet knees={1} />
      <Thought x={h.x + 100} y={h.y - 200} w={160 * (1 - crush * 0.8)} h={110 * (1 - crush * 0.8)} t={t - 2} seed={34} from={{ x: h.x + 20, y: h.y - 60 }}>
        <text x={0} y={22} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={70} fill={INK}>?</text>
      </Thought>
      <Thought x={h.x - 160 + 120 * crush} y={h.y - 260} w={300} h={200} t={t - 6} seed={35} tone="grey" jitter={5}><Scribble seed={1} /></Thought>
      <Thought x={h.x + 360 - 120 * crush} y={h.y - 230} w={300} h={200} t={t - 8} seed={36} tone="grey" jitter={5}><Scribble seed={2} /></Thought>
      <Thought x={h.x + 110} y={h.y - 400 + 110 * crush} w={320} h={200} t={t - 10} seed={37} tone="grey" jitter={5}><Scribble seed={3} /></Thought>
    </g>
  );
};

// S35: medium, kitchen, morning: mum talks to him over the island (her mouth moving), and a thought bubble talks over her
export const S35: React.FC<ShotProps> = ({ t, len }) => {
  const mom = P({ ...K_MOM, yaw: -0.5, look: -0.6, armL: { a: 20, b: -10 }, armR: { a: 50 + Math.sin(t / 3) * 14, b: 40 } });
  const h = headOf(mom);
  const talk = Math.floor(t / 3) % 2 === 0;
  return (
    <g transform={camV(h.x - 60, h.y + 40, kf(t, [[0, 1.95], [len, 2.05]]))}>
      <Kitchen t={t + 900} id="k35" veil={0.42} />
      <Cupboard />
      <Hero look={MOM} pose={{ ...mom, ...faceAt(t, [[0, talk ? 'happy' : 'neutral']]) }} rimId="rimL" shadow={0} />
      <KitchenIsland />
      <Thought x={h.x - 200} y={h.y - 230} w={280} h={190} t={t - 3} seed={38} from={{ x: h.x - 40, y: h.y - 70 }} jitter={2}><Scribble seed={9} /></Thought>
    </g>
  );
};

// S36: close-up: Pip, dizzy: her voice and her thought land on top of each other; two mums, out of register
export const S36: React.FC<ShotProps> = ({ t, len }) => {
  const pip = P({ ...K_PIP, yaw: 0.4, look: 0.6, headTilt: 8 });
  const h = headOf(pip);
  const split = 14 + Math.sin(t / 2.5) * 10;
  return (
    <g transform={camV(h.x + 30, h.y + 90, kf(t, [[0, 5.0], [len, 5.4]]))}>
      <Kitchen t={t + 950} id="k36" veil={0.5} />
      <g opacity={0.5} transform={`translate(${-split} 0)`}>
        <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'dizzy']]) }} rimId="rimR" shadow={0} />
      </g>
      <g opacity={0.8} transform={`translate(${split} 0)`}>
        <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'dizzy']]) }} rimId="rimR" shadow={0} />
      </g>
      <DizzyStars x={h.x} y={h.y - 90} t={t} rx={90} ry={30} />
      <Ripples x={h.x} y={h.y} t={t} r0={60} color={RED} o={0.6} inward />
    </g>
  );
};

// S23B: wide, class: life as a game with cheats: Pip strolls between the desks; +100s float off every head he passes
export const S23B: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 1340], [len, 1120]], (v) => v);
  const pip = walkPose(x, t * 0.5, C_PIP.y + 30, 0.95, { yaw: -0.5, look: -0.3 }, -1);
  return (
    <g transform={camV(kf(t, [[0, 1060], [len, 1000]]), 470, kf(t, [[0, 1.3], [len, 1.36]]))}>
      <Classroom t={t + 780} id="c23b" laugh={0.3} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'cool']]), glasses: 1 }} rimId="rimL" shadow={0} />
      {[0, 1, 2, 3].map((i) => <FloatLabel key={i} x={760 + i * 150} y={560 - (i % 2) * 40} t={t - 3 - i * 6} text="+100" color={i % 2 ? CYAN : '#FFE27A'} size={64} />)}
      <g transform="translate(980 150)">
        <rect x={-210} y={-44} width={420} height={88} rx={44} fill="#1A1626" opacity={0.85} />
        <text x={0} y={18} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} fill={CYAN}>CHEAT: ON</text>
      </g>
    </g>
  );
};

// S36B: close-up: Pip claps both hands over his ears (drawn as insert arms over the head); the thoughts keep coming
export const S36B: React.FC<ShotProps> = ({ t, len }) => {
  const pip = P({ ...K_PIP, yaw: 0.05, look: 0, headTilt: 6, squash: 0.03 });
  const h = headOf(pip);
  const press = easeOut(clamp(t / 5));
  return (
    <g transform={camV(h.x, h.y + 10, kf(t, [[0, 6.0], [len, 6.4]]))}>
      <Kitchen t={t + 980} id="k36b" veil={0.55} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [8, 'tired']]), blink: t > 6 ? 1 : 0 }} rimId="rimR" shadow={0} />
      <InsertArm from={{ x: h.x - 300, y: h.y + 500 }} x={h.x - 70 - 20 * (1 - press)} y={h.y} ang={60} s={1.6} look={PIP} w={40} rim="rimL" />
      <InsertArm from={{ x: h.x + 300, y: h.y + 500 }} x={h.x + 70 + 20 * (1 - press)} y={h.y} ang={-60} s={1.6} look={PIP} w={40} />
      <Swarm cx={h.x} cy={h.y - 190} w={300} h={120} t={t + 10} n={8} grow={14} seed={36} tone="grey" jitter={3} size={0.3} o={0.9} />
    </g>
  );
};

// S36C: schematic: the head in outline; the thoughts aren't outside it, they're INSIDE it, crowding
export const S36C: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camV(960, 960, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <Schematic t={t + 220} id="sch36c" />
    <path d="M 700 1500 Q 640 1100 760 900 Q 640 700 760 560 Q 900 400 1080 460 Q 1300 520 1280 760 Q 1340 860 1280 900 Q 1300 1000 1240 1060 L 1240 1180 Q 1200 1260 1100 1240 L 1100 1500" fill="none" stroke={SCH.line} strokeWidth={10} strokeLinejoin="round" />
    <Swarm cx={980} cy={820} w={380} h={420} t={t} n={14} grow={len * 0.7} seed={63} size={0.42} jitter={2} />
    <SchLabel x={960} y={1660} t={t - 4} text="DARI DALAM" size={56} color={RED} />
  </g>
);
