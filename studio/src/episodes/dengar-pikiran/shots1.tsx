import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, lerp, easeOut, easeIn, easeInOut, backOut, rnd, settle, camV, LEG_LEN, joints, toWorld, reachAngle, walkPose,
  Kitchen, KitchenIsland, KITCHEN, islandTop, stand, Classroom, CLS, SchoolDesk, Stairwell, hipGround, SW, Rooftop, Schematic, SCH, SchLabel, DrawOn,
  Foreground, Glow, Dust, Sparkle, FocusRings, Plate, Paper, Tabletop, ShotProps, FONT,
} from '../../engine';
import { PIP, MOM, MO, SUIT, CYAN, RED, INK, Thought, Ripples, PicCupboard, PicNumber, PicPipFace, PTitle, HeadIcon } from './parts';
import { InsertArm, CookieJar } from '../gravitasi/parts';

const P = (p: Partial<Pose>): Pose => ({ ...basePose, ...p });
export const headOf = (pose: Pose) => toWorld(pose, { x: 0, y: -176 });

// ================= 1a: the kitchen =================
export const K_PIP = stand(KITCHEN, 0.3, 0.4);
export const K_MOM = stand(KITCHEN, 0.66, 0.4);
const CUP = { x: 1190, y: 300 }; // the upper cupboard over the counter, right
export const Cupboard: React.FC<{ open?: number; jar?: boolean }> = ({ open = 0, jar = true }) => (
  <g>
    <rect x={CUP.x - 120} y={CUP.y - 110} width={240} height={170} fill="#5A3E30" stroke="#20161A" strokeWidth={5} />
    <rect x={CUP.x - 108} y={CUP.y - 98} width={216} height={146} fill="#24181A" />
    {jar ? <CookieJar x={CUP.x} y={CUP.y + 44} s={0.62} /> : null}
    {/* two doors; the right one swings open toward us */}
    <rect x={CUP.x - 118} y={CUP.y - 108} width={118} height={166} fill="#6E4C38" stroke="#20161A" strokeWidth={4} />
    <path d={`M ${CUP.x} ${CUP.y - 108} L ${CUP.x + 118 * (1 - open) + 60 * open} ${CUP.y - 108 - 16 * open} L ${CUP.x + 118 * (1 - open) + 60 * open} ${CUP.y + 58 + 16 * open} L ${CUP.x} ${CUP.y + 58} Z`}
      fill={open > 0.5 ? '#80583E' : '#6E4C38'} stroke="#20161A" strokeWidth={4} transform={`translate(${118 * open} 0)`} />
    <circle cx={CUP.x - 16} cy={CUP.y - 20} r={6} fill="#E9C46A" />
    <rect x={CUP.x - 120} y={CUP.y + 58} width={240} height={6} fill="#FFB46A" opacity={0.4} />
  </g>
);
const KitchenSet: React.FC<{ t: number; id: string; open?: number; jar?: boolean; red?: number }> = ({ t, id, open = 0, jar = true, red = 0 }) => (
  <g>
    <Kitchen t={t} id={id} veil={0.42} red={red} />
    <Cupboard open={open} jar={jar} />
  </g>
);
const plateAt = islandTop(0.5, 0.5);

// S1: wide: mum behind the island with an empty plate, palms up: all gone. Pip on a stool side, hopeful
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const mom = poseAt(t, [
    { f: 0, p: { ...K_MOM, yaw: -0.45, look: -0.6, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } } },
    { f: 8, p: { armL: { a: -50, b: 60 }, armR: { a: 50, b: -60 }, headTilt: 8 }, ease: easeOut },
  ]);
  const pip = P({ ...K_PIP, yaw: 0.5, look: 0.7, armL: { a: 14, b: -10 }, armR: { a: 40, b: 30 } });
  return (
    <g transform={camV(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 560], [len, 545]]), kf(t, [[0, 1.33], [len, 1.4]]))}>
      <KitchenSet t={t + 20} id="k1" />
      <Hero look={MOM} pose={{ ...mom, ...faceAt(t, [[0, 'neutral'], [8, 'happy']]) }} rimId="rimL" shadow={0} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy'], [12, 'worried']]) }} rimId="rimR" shadow={0} />
      <KitchenIsland />
      <Plate x={plateAt.x} y={plateAt.y} s={0.9} />
      {[0, 1, 2].map((i) => <circle key={i} cx={plateAt.x - 30 + i * 26} cy={plateAt.y - 6} r={4} fill="#C98A4A" />)}
      <Foreground blur={10}>
        <path d="M 1500 1500 Q 1460 1050 1560 960 L 1800 960 L 1800 1500 Z" fill="#0E1610" />
      </Foreground>
    </g>
  );
};

// S2: close-up: Pip. Cyan rings ripple out from his head; his eyes light up: he can hear it
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: { ...K_PIP, yaw: 0.5, look: 0.7, headTilt: 0 } },
    { f: 6, p: { headTilt: -10, look: 0.9 }, ease: easeOut },
  ]);
  const h = headOf(pip);
  return (
    <g transform={camV(h.x + 20, h.y + 90, kf(t, [[0, 5.0], [len, 5.6]]))}>
      <KitchenSet t={t + 60} id="k2" />
      <Glow x={h.x} y={h.y} r={260} kind="cool" o={0.35 * clamp(t / 6)} />
      <Ripples x={h.x} y={h.y} t={t - 2} r0={70} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [5, 'shock']]), glint: t > 4 ? 1 : 0, glintColor: CYAN }} rimId="rimR" shadow={0} />
    </g>
  );
};

// S3: medium: mum, still smiling, glances up at the cupboard; the thought over her head shows the jar in it
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const mom = poseAt(t, [
    { f: 0, p: { ...K_MOM, yaw: -0.4, look: -0.4, armL: { a: 20, b: -10 }, armR: { a: 24, b: -14 } } },
    { f: 6, p: { look: 0.5, headTilt: -8, yaw: -0.2 }, ease: easeOut },
  ]);
  const h = headOf(mom);
  return (
    <g transform={camV(kf(t, [[0, h.x + 60], [len, h.x + 80]]), h.y - 40, kf(t, [[0, 2.15], [len, 2.3]]))}>
      <KitchenSet t={t + 100} id="k3" />
      <Hero look={MOM} pose={{ ...mom, ...faceAt(t, [[0, 'happy'], [6, 'smug']]) }} rimId="rimL" shadow={0} />
      <KitchenIsland />
      <Thought x={h.x + 60} y={h.y - 215} w={300} h={210} t={t - 4} from={{ x: h.x + 20, y: h.y - 70 }} seed={3}>
        <PicCupboard />
      </Thought>
    </g>
  );
};

// S4: medium, low: Pip at the open cupboard, the jar in his arms, smug; mum turns, caught
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: { x: CUP.x - 40, y: K_PIP.y, scale: K_PIP.scale, yaw: 0.2, look: -0.4, armL: { a: 70, b: 70 }, armR: { a: 64, b: 76 } } },
    { f: 6, p: { squash: 0.05 } },
    { f: 9, p: { squash: 0, headTilt: 6 } },
  ]);
  const j = toWorld(pip, { x: 0, y: -120 });
  return (
    <g transform={camV(CUP.x - 80, kf(t, [[0, 500], [len, 520]]), kf(t, [[0, 1.95], [len, 2.05]]))}>
      <KitchenSet t={t + 140} id="k4" open={1} jar={false} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy'], [5, 'smug']]) }} rimId="rimR" shadow={0} />
      <CookieJar x={j.x + 6} y={j.y + 40} s={0.55} rot={-8} />
      <Sparkle x={j.x + 80} y={j.y - 120} t={t - 3} s={0.9} />
      <Sparkle x={j.x - 90} y={j.y - 40} t={t - 8} s={0.6} />
      <KitchenIsland />
    </g>
  );
};

// ================= 1b: the classroom test =================
const C_PIP = { x: 1260, y: 760 - LEG_LEN * 0.95 + 120, scale: 0.95 }; // standing behind his desk, the desk hides his legs
const TestBoard: React.FC = () => (
  <g fontFamily={FONT.hand} fill="#E9F0E6" opacity={0.92}>
    <text x={740} y={280} textAnchor="middle" fontSize={62} fontWeight={700}>ULANGAN</text>
    <text x={740} y={350} textAnchor="middle" fontSize={50}>MATEMATIKA</text>
    <path d="M 560 380 L 920 380" stroke="#E9F0E6" strokeWidth={4} />
    <text x={740} y={460} textAnchor="middle" fontSize={60}>48 : 4 = ?</text>
  </g>
);

// S5: wide: the test. Rows of heads down, the board says it all; Pip at his desk at the right
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const pip = P({ ...C_PIP, yaw: -0.3, look: -0.5, headTilt: 10, armL: { a: 30, b: 60 }, armR: { a: 34, b: 64 } });
  return (
    <g transform={camV(kf(t, [[0, 960], [len, 980]]), 470, kf(t, [[0, 1.12], [len, 1.17]]))}>
      <Classroom t={t + 30} id="c5" board={<TestBoard />} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'worried']]) }} rimId="rimL" shadow={0} />
      <SchoolDesk x={1260} />
    </g>
  );
};

// S6: insert, top-down: the paper. Blank. His pencil hovers, taps, hovers
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const tap = Math.max(0, Math.sin(t / 3)) * 20;
  return (
    <g transform={camV(960, kf(t, [[0, 940], [len, 920]]), kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Tabletop edge={1700} />
      <Paper x={900} y={900} w={760} rot={-4} done={false} fill={0} />
      <text x={640} y={820} fontFamily={FONT.hand} fontSize={70} fill="#2A2440" transform="rotate(-4 900 900)">48 : 4 =</text>
      <rect x={950} y={762} width={150} height={80} fill="none" stroke="#2A2440" strokeWidth={4} strokeDasharray="10 8" transform="rotate(-4 900 900)" />
      <g transform={`translate(${1150} ${880 - tap}) rotate(-38)`}>
        <rect x={-14} y={-260} width={28} height={260} fill="#E9C46A" stroke="#6A4A1A" strokeWidth={4} />
        <path d="M -14 0 L 14 0 L 0 34 Z" fill="#F2D2B8" stroke="#6A4A1A" strokeWidth={4} />
      </g>
      <InsertArm from={{ x: 1700, y: 1700 }} x={1260} y={1100 - tap} ang={-40} s={5} look={PIP} w={150} />
    </g>
  );
};

// S7: medium: Mo at the next desk, writing fast and sure; his thought: 12
const C_MO = { x: 700, y: 760 - LEG_LEN * 0.95 + 120, scale: 0.95 };
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const write = Math.sin(t * 1.3) * 6;
  const mo = P({ ...C_MO, yaw: 0.3, look: 0.3, headTilt: 14, armL: { a: 30, b: 60 }, armR: { a: 40 + write, b: 70 } });
  const h = headOf(mo);
  return (
    <g transform={camV(kf(t, [[0, 820], [len, 840]]), 470, kf(t, [[0, 1.9], [len, 2.0]]))}>
      <Classroom t={t + 70} id="c7" board={<TestBoard />} />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'cool']]) }} rimId="rimR" shadow={0} />
      <SchoolDesk x={700} />
      <Thought x={h.x + 170} y={h.y - 220} w={300} h={210} t={t - 3} from={{ x: h.x + 40, y: h.y - 60 }} seed={7}>
        <PicNumber text="12" />
      </Thought>
      <Ripples x={1260} y={300} t={t} r0={60} o={0.5} />
    </g>
  );
};

// S8: insert, top-down: 12 in the box, then a red 100 circled on top
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const draw = clamp((t - 6) / 8);
  return (
    <g transform={camV(960, 900, kf(t, [[0, 1.08], [len, 1.16]]))}>
      <Tabletop edge={1700} />
      <Paper x={900} y={900} w={760} rot={-4} done={false} fill={0} />
      <g transform="rotate(-4 900 900)">
        <text x={640} y={820} fontFamily={FONT.hand} fontSize={70} fill="#2A2440">48 : 4 =</text>
        <text x={970} y={830} fontFamily={FONT.hand} fontWeight={700} fontSize={84} fill="#2A2440">12</text>
        <g opacity={t > 5 ? 1 : 0}>
          <text x={1060} y={640} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={150 * backOut(clamp((t - 5) / 6))} fill="#D23A3A">100</text>
          <path d={`M 940 600 A 140 100 0 1 1 ${940 + 280 * draw} ${600 + 20 * draw}`} stroke="#D23A3A" strokeWidth={9} fill="none" strokeLinecap="round" opacity={draw > 0 ? 1 : 0} />
        </g>
      </g>
      <Sparkle x={1240} y={520} t={t - 9} s={1.3} />
    </g>
  );
};

// ================= 1c: the stairwell stranger =================
const S_PIP_X = 980;
// S9: wide: Pip climbs; at the top, a tall dark figure starts down. Hat brim of shadow over his face
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const px = kf(t, [[0, 1340], [len, 1150]], (x) => x);
  const pip = walkPose(px, t * 0.55, hipGround, 0.9, { yaw: -0.6 }, -1);
  const sx = kf(t, [[0, 560], [len, 700]], (x) => x);
  const suit = walkPose(sx, t * 0.45 + 2, hipGround, 1.05, { yaw: 0.5 }, 1);
  return (
    <g transform={camV(kf(t, [[0, 960], [len, 940]]), 520, kf(t, [[0, 1.15], [len, 1.2]]))}>
      <Stairwell t={t + 30} id="s9" />
      <g style={{ filter: 'brightness(0.3)' }}>
        <Hero look={SUIT} pose={{ ...suit, expr: 'neutral', blink: 0 }} rimId="rimRed" shadow={0} />
      </g>
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// S10: medium: they pass on the stairs. The man's face stays in shadow; not a word. Pip glances up
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const sx = kf(t, [[0, 820], [len, 960]], (x) => x);
  const suit = walkPose(sx, t * 0.45 + 2, hipGround, 1.05, { yaw: 0.5, look: 0.2 }, 1);
  const pip = P({ x: 1030, y: hipGround(1030), scale: 0.9, yaw: -0.5, look: -0.7, headTilt: -10, armL: { a: 14, b: -10 }, armR: { a: 10, b: -8 } });
  return (
    <g transform={camV(kf(t, [[0, 960], [len, 990]]), 470, kf(t, [[0, 1.85], [len, 1.95]]))}>
      <Stairwell t={t + 70} id="s10" />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [8, 'worried']]) }} rimId="rimR" shadow={0} />
      <g>
        <Hero look={SUIT} pose={{ ...suit, expr: 'neutral', blink: 0 }} rimId="rimRed" shadow={0} />
        {/* his face is never seen: a shadow falls across it */}
        <circle cx={headOf(suit).x} cy={headOf(suit).y} r={70 * 1.05} fill="#05040A" opacity={0.92} />
      </g>
      <Foreground blur={10}>
        <rect x={200} y={300} width={60} height={1000} fill="#0A0810" />
      </Foreground>
    </g>
  );
};

// S11: close-up: Pip, looking back up the stairs. A cold thought drifts down to him: his own face, ringed
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: { x: 1030, y: hipGround(1030), scale: 0.9, yaw: -0.2, look: -0.6, headTilt: -14 } },
    { f: 8, p: { yaw: -0.5, look: -0.9 }, ease: easeOut },
  ]);
  const h = headOf(pip);
  return (
    <g transform={camV(h.x - 40, h.y - 20, kf(t, [[0, 3.6], [len, 4.0]]))}>
      <Stairwell t={t + 120} id="s11" />
      <Glow x={h.x - 260} y={h.y - 300} r={300} kind="cool" o={0.3} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'worried'], [10, 'shock']]), glint: 1, glintColor: CYAN }} rimId="rimR" shadow={0} />
      <Ripples x={h.x} y={h.y} t={t} r0={64} o={0.7} />
      <Thought x={h.x + 30} y={h.y - 175} w={200} h={160} t={t - 6} from={{ x: h.x - 320, y: h.y - 420 }} seed={11} tone="cold">
        <PicPipFace />
      </Thought>
    </g>
  );
};

// ================= 2: the title =================
// S12: the rooftop at dusk, Pip in the middle; faint thoughts rise from the lit city all round him
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const pip = P({ x: 960, y: 820 - LEG_LEN * 0.85, scale: 0.85, yaw: 0, look: 0, armL: { a: 14, b: -8 }, armR: { a: 14, b: -8 } });
  const h = headOf(pip);
  return (
    <g transform={camV(960, kf(t, [[0, 640], [len, 610]]), kf(t, [[0, 1.17], [len, 1.21]]))}>
      <Rooftop t={t + 120} sunX={960} sunY={660} />
      <Glow x={960} y={600} r={380} o={0.3} />
      {[[300, 560], [520, 420], [1420, 470], [1640, 600], [760, 330], [1220, 340]].map(([x, y], i) => (
        <Thought key={i} x={x} y={y - ((t * 0.8 + i * 20) % 60)} w={120} h={80} t={t - 6 - i * 3} seed={20 + i} o={0.55} />
      ))}
      <Ripples x={h.x} y={h.y} t={t} r0={70} o={0.8} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [16, 'shock']]), glint: 1, glintColor: CYAN }} rimId="rimR" shadow={0} />
      <ellipse cx={960} cy={822} rx={80} ry={11} fill="#000" opacity={0.35} />
      <PTitle t={t} cx={960} y={-60} lines={['GIMANA KALAU', 'KAMU BISA DENGAR', 'PIKIRAN ORANG?']} accent="PIKIRAN" size={74} />
    </g>
  );
};

// S13: schematic: the rule. Pip in the middle, a circle round him; everyone inside it lights up with a thought
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const rr = 380 * easeOut(clamp((t - 2) / 12));
  const people = Array.from({ length: 14 }).map((_, i) => {
    const a = i * 2.39996 + 0.3;
    const d = 160 + rnd(4, i) * 420;
    return { x: 960 + Math.cos(a) * d, y: 960 + Math.sin(a) * d * 1.1, in: d < 380 };
  });
  return (
    <g transform={camV(960, 940, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t} id="sch13" />
      <circle cx={960} cy={960} r={rr} fill={CYAN} opacity={0.06} />
      <circle cx={960} cy={960} r={rr} fill="none" stroke={CYAN} strokeWidth={5} strokeDasharray="18 14" />
      {people.map((p, i) => (
        <g key={i}>
          <HeadIcon x={p.x} y={p.y} t={t - i} s={0.9} color={p.in && rr > 300 ? CYAN : SCH.dim} lit={p.in ? clamp((t - 14) / 6) : 0} />
          {p.in ? <Thought x={p.x + 40} y={p.y - 110} w={90} h={60} t={t - 14 - i * 0.7} seed={30 + i} o={0.9} /> : null}
        </g>
      ))}
      <HeadIcon x={960} y={960} t={t} s={1.5} color="#FFE27A" lit={1} />
      <SchLabel x={960} y={1060} t={t - 4} text="KAMU" size={40} color="#FFE27A" />
    </g>
  );
};

// S14: schematic: an OFF switch. Flip it: nothing. Flip it again: nothing. A red cross.
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const flip = (k: number) => clamp((t - k) / 3) * (1 - clamp((t - k - 6) / 3));
  const pos = Math.max(flip(4), flip(16));
  return (
    <g transform={camV(960, 900, kf(t, [[0, 1.05], [len, 1.12]]))}>
      <Schematic t={t + 30} id="sch14" />
      <Ripples x={960} y={600} t={t} r0={80} o={0.8} />
      <HeadIcon x={960} y={640} t={1} s={1.6} color="#FFE27A" lit={1} />
      <g transform="translate(960 1060)">
        <rect x={-220} y={-90} width={440} height={180} rx={90} fill="#1C2C44" stroke={SCH.line} strokeWidth={6} />
        <circle cx={lerp(110, -110, pos)} cy={0} r={70} fill={pos > 0.5 ? '#7E8DA6' : CYAN} />
        <text x={-120} y={150} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill={SCH.dim}>OFF</text>
        <text x={120} y={150} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill={CYAN}>ON</text>
      </g>
      {t > 22 ? (
        <path d={`M 700 860 L ${700 + 520 * clamp((t - 22) / 4)} ${860 + 400 * clamp((t - 22) / 4)} M 1220 860 L ${1220 - 520 * clamp((t - 26) / 4)} ${860 + 400 * clamp((t - 26) / 4)}`}
          stroke={RED} strokeWidth={22} strokeLinecap="round" />
      ) : null}
    </g>
  );
};
