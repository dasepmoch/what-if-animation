import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, lerp, easeOut, easeIn, easeInOut, backOut, rnd, settle, camV, LOOKS, LEG_LEN, joints, toWorld, reachAngle, walkPose,
  Kitchen, KitchenIsland, KITCHEN, stand, Stairwell, hipGround, stepTop, SW, Rooftop, Schematic, SCH, SchLabel, CountUp, Arrow, DrawOn, Bedroom, BEDROOM,
  Foreground, Glow, Dust, Sparkle, Dial, FloatLabel, Tag, WallClock, WallFrame, ShotProps, FONT, UI,
} from '../../engine';
import { PIP, CYAN, RED, arc, SpeedLines, Puff, RoofBlocks, PTitle, CookieJar, Shelf, Scale } from './parts';

const MO = LOOKS.mo;
const P = (p: Partial<Pose>): Pose => ({ ...basePose, ...p });

// ================= 1a: the kitchen =================
const K_STAND = stand(KITCHEN, 0.42, 0.4);
const SHELF = { x0: 1040, x1: 1250, y: 372 };
const JAR = { x: 1150, y: 372 };

const KitchenHigh: React.FC<{ t: number; id: string; jar?: boolean }> = ({ t, id, jar = true }) => (
  <g>
    <Kitchen t={t} id={id} veil={0.42} />
    <Shelf x0={SHELF.x0} x1={SHELF.x1} y={SHELF.y} />
    {jar ? <CookieJar x={JAR.x} y={JAR.y} s={0.75} /> : null}
    <Glow x={JAR.x} y={JAR.y - 50} r={170} o={0.5} />
  </g>
);

// S1: wide, portrait: the jar on the top shelf, way out of reach; Pip on tiptoe
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const aim = reachAngle(P({ ...K_STAND, yaw: 0.45 }), { x: JAR.x, y: JAR.y - 40 });
  const hop = Math.max(0, Math.sin(t / 3.2)) * (t > 8 ? 10 : 0);
  const pose = poseAt(t, [
    { f: 0, p: { ...K_STAND, yaw: 0.45, look: 0.7, headTilt: -10, armR: { a: 30, b: -10 } } },
    { f: 6, p: { armR: { a: aim - 4, b: -2 }, tilt: 6, squash: -0.04 }, ease: easeOut },
    { f: 40, p: { armR: { a: aim + 2, b: -2 }, tilt: 8 } },
  ]);
  return (
    <g transform={camV(kf(t, [[0, 1010], [len, 1030]]), kf(t, [[0, 520], [len, 490]]), kf(t, [[0, 1.4], [len, 1.48]]))}>
      <KitchenHigh t={t + 30} id="k1" />
      <Hero look={PIP} pose={{ ...pose, y: pose.y - hop, ...faceAt(t, [[0, 'neutral'], [14, 'worried']]) }} rimId="rimR" shadow={0} />
      <KitchenIsland />
      <Foreground blur={10}>
        <path d="M 500 1400 Q 540 1060 660 980 Q 620 1150 700 1400 Z" fill="#0E1610" />
        <path d="M 560 1400 Q 660 1100 800 1060 Q 720 1200 760 1400 Z" fill="#0C130E" />
      </Foreground>
    </g>
  );
};

// S2: medium, low: crouch, then launch straight up and out of the top of frame
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const lift = t < 6 ? 0 : easeOut(clamp((t - 6) / 12)) * 900;
  const pose = poseAt(t, [
    { f: 0, p: { ...K_STAND, yaw: 0.3, look: 0.4, headTilt: -8, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } } },
    { f: 4, p: { squash: 0.16, armL: { a: -45, b: -20 }, armR: { a: -45, b: -20 }, tilt: 4 }, ease: easeOut },
    { f: 7, p: { squash: -0.12, armL: { a: 165, b: 6 }, armR: { a: 170, b: 6 }, tilt: 0, legL: { a: 8, b: 30 }, legR: { a: -8, b: 30 } }, ease: easeOut },
    { f: 16, p: { squash: 0, legL: { a: 20, b: 50 }, legR: { a: -10, b: 40 } } },
  ]);
  const cy = kf(t, [[0, 560], [8, 560], [20, 380]], easeOut);
  return (
    <g transform={camV(K_STAND.x + 20, cy, kf(t, [[0, 2.1], [len, 2.2]]))}>
      <KitchenHigh t={t + 60} id="k2" />
      {t > 6 ? <SpeedLines x={K_STAND.x} y={K_STAND.y - lift + 220} w={200} h={420} t={t} o={0.6 * clamp(1 - (t - 14) / 10)} /> : null}
      <Hero look={PIP} pose={{ ...pose, y: pose.y - lift, ...faceAt(t, [[0, 'neutral'], [5, 'cool']]), glint: t > 5 ? 1 : 0, glintColor: CYAN }} rimId="rimR" shadow={0} />
      <KitchenIsland />
      <Puff x={K_STAND.x} y={K_STAND.y + 120} t={t - 6} s={1.2} />
    </g>
  );
};

// S3: close-up at the top shelf: Pip floats there hugging the jar, smug, drifting down slowly
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const y = 560 + Math.sin(t / 7) * 6 + t * 0.9;
  const pose = poseAt(t, [
    { f: 0, p: { x: 1110, y, yaw: 0.25, look: -0.3, armL: { a: 70, b: 70 }, armR: { a: 64, b: 76 }, legL: { a: 18, b: 34 }, legR: { a: -14, b: 40 }, scale: 0.95 } },
  ]);
  const face = faceAt(t, [[0, 'happy'], [10, 'smug']]);
  return (
    <g transform={camV(1110, kf(t, [[0, 470], [len, 500]]), kf(t, [[0, 2.7], [len, 2.85]]))}>
      <KitchenHigh t={t + 90} id="k3" jar={false} />
      <Hero look={PIP} pose={{ ...pose, ...face }} rimId="rimR" shadow={0} />
      <CookieJar x={1112} y={y - 30} s={0.5} rot={-6} />
      <Sparkle x={1170} y={y - 140} t={t - 4} s={0.8} />
      <Sparkle x={1040} y={y - 60} t={t - 12} s={0.5} />
      {Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} cx={1090 + rnd(8, i) * 50} cy={y + 10 + ((t * (1.2 + i * 0.3) + i * 30) % 160)} r={2.5} fill="#C98A4A" />
      ))}
    </g>
  );
};

// ================= 1b: the stairwell, two floors =================
const UPPER = -70; // the upper floor's slab, above the set's landing (420)
const UpperFloor: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {/* the wall of the upper floor, continuing the stairwell up */}
    <rect x={-600} y={-1200} width={3200} height={1200} fill="#2F2838" />
    {/* the second flight, up to the right from the landing */}
    {(() => {
      let d = `M 420 ${SW.top}`;
      for (let i = 0; i < 7; i++) d += ` L ${420 + i * 80} ${SW.top - (i + 1) * 70} L ${420 + (i + 1) * 80} ${SW.top - (i + 1) * 70}`;
      d += ` L 980 ${UPPER + 40} L 420 ${SW.top + 60} Z`;
      return <path d={d} fill="#3B3040" stroke="#221C28" strokeWidth={4} />;
    })()}
    <path d={`M 420 ${SW.top - 120} L 980 ${UPPER - 120}`} stroke="#5A4A3A" strokeWidth={10} strokeLinecap="round" />
    {/* the upper slab and its landing, a classroom door with its sign, a notice board */}
    <rect x={900} y={UPPER} width={1700} height={46} fill="#2A2230" />
    <rect x={900} y={UPPER} width={1700} height={3} fill="#FFB46A" opacity={0.5} />
    <rect x={1180} y={UPPER - 330} width={190} height={330} fill="#1A1420" />
    <rect x={1192} y={UPPER - 318} width={166} height={318} fill="#5A3E34" />
    <rect x={1300} y={UPPER - 250} width={34} height={70} fill="#FFC27A" opacity={0.7} />
    <circle cx={1340} cy={UPPER - 150} r={7} fill="#E9C46A" />
    <rect x={1200} y={UPPER - 390} width={150} height={44} rx={6} fill="#1E3A34" />
    <text x={1275} y={UPPER - 358} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#F6EFE3">KELAS 2B</text>
    <rect x={1460} y={UPPER - 300} width={200} height={140} fill="#7A5A3A" />
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={1474 + (i % 2) * 92} y={UPPER - 288 + Math.floor(i / 2) * 64} width={80} height={52} fill={['#F6EFE3', '#9BD3A8', '#FFD27A', '#F2A0A0'][i]} transform={`rotate(${(i * 7) % 9 - 4} ${1514 + (i % 2) * 92} ${UPPER - 262 + Math.floor(i / 2) * 64})`} />
    ))}
    <WallClock x={1060} y={UPPER - 300} r={40} t={t} />
    <path d={`M 1000 ${UPPER - 420} L 1000 ${UPPER - 380}`} stroke="#120C18" strokeWidth={4} />
    <circle cx={1000} cy={UPPER - 368} r={16} fill="#FFE2B0" />
    <Glow x={1000} y={UPPER - 360} r={240} o={0.55} />
    <Glow x={1290} y={UPPER - 220} r={200} o={0.25} />
  </g>
);

const FLOOR0 = SW.top + SW.h * SW.n; // 910, the bottom of the flight
const BOT_X = 1560;

// S4: medium: Pip runs in at the foot of the stairs, out of breath, the clock says 06:59
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 1760], [12, BOT_X]], easeOut);
  const run = t < 12 ? walkPose(x, t * 0.9, FLOOR0 - LEG_LEN * 0.9 + 0, 0.9, { yaw: -0.6, tilt: -10 }, -1) : null;
  const still = poseAt(t, [
    { f: 12, p: { x: BOT_X, y: FLOOR0 - LEG_LEN * 0.9, scale: 0.9, yaw: -0.55, facing: -1, tilt: -4, look: -0.6, headTilt: -8, armL: { a: 20, b: -30 }, armR: { a: 14, b: -20 } } },
    { f: 16, p: { tilt: 2, squash: 0.03 } },
    { f: 22, p: { tilt: -2, squash: 0 } },
  ]);
  const pose = run ?? still;
  const pant = t > 12 ? Math.sin(t / 2.2) * 2 : 0;
  return (
    <g transform={camV(kf(t, [[0, 1560], [len, 1540]]), 700, kf(t, [[0, 2.05], [len, 2.15]]))}>
      <Stairwell t={t + 20} id="sw4" />
      <Hero look={PIP} pose={{ ...pose, y: pose.y + pant, ...faceAt(t, [[0, 'worried']]) }} rimId="rimL" shadow={0.5} />
      <g transform="translate(1690 470)">
        <rect x={-92} y={-40} width={184} height={80} rx={12} fill="#0B0816" opacity={0.85} />
        <text y={20} textAnchor="middle" fontFamily={FONT.ui} fontSize={52} fill={RED} opacity={Math.floor(t / 6) % 2 ? 1 : 0.55}>06:59</text>
      </g>
      <Foreground blur={10}>
        <rect x={1800} y={300} width={120} height={900} fill="#0C0A12" />
      </Foreground>
    </g>
  );
};

// S5: extreme wide, portrait: the stairwell climbs two floors above Pip
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const pose = P({ x: BOT_X - 60, y: FLOOR0 - LEG_LEN * 0.9, scale: 0.9, yaw: -0.35, facing: -1, look: -0.5, headTilt: -14, armL: { a: 14, b: -8 }, armR: { a: 18, b: -8 } });
  return (
    <g transform={camV(kf(t, [[0, 1080], [len, 1060]]), kf(t, [[0, 420], [len, 380]]), kf(t, [[0, 1.0], [len, 1.04]]))}>
      <UpperFloor t={t} />
      <Stairwell t={t + 40} id="sw5" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [12, 'cool']]) }} rimId="rimL" shadow={0.5} />
      <Dust t={t} seed={5} x0={500} y0={-300} w={1100} h={1100} n={50} o={0.5} />
    </g>
  );
};

// S6: wide, tracking: jump one, from the floor up to the landing
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const u = clamp((t - 4) / 16);
  const x = lerp(BOT_X - 60, 360, easeInOut(u));
  const ground = lerp(FLOOR0, SW.top, u);
  const y = ground - LEG_LEN * 0.9 - arc(t, 4, 16, 260);
  const pose = poseAt(t, [
    { f: 0, p: { x, y, scale: 0.9, yaw: -0.5, facing: -1, look: -0.4, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } } },
    { f: 3, p: { squash: 0.14, armL: { a: -40, b: -20 }, armR: { a: -40, b: -20 } }, ease: easeOut },
    { f: 6, p: { squash: -0.1, armL: { a: -160, b: 10 }, armR: { a: -150, b: 10 }, legL: { a: -40, b: 60 }, legR: { a: 30, b: 50 }, tilt: -16 }, ease: easeOut },
    { f: 18, p: { squash: 0, legL: { a: -10, b: 20 }, legR: { a: 10, b: 20 }, tilt: -4 } },
    { f: 21, p: { squash: 0.12, armL: { a: -60, b: -20 }, armR: { a: -50, b: -20 } } },
    { f: 25, p: { squash: 0, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } } },
  ]);
  return (
    <g transform={camV(lerp(1280, 700, easeInOut(u)), lerp(660, 380, easeInOut(u)), 1.42)}>
      <UpperFloor t={t} />
      <Stairwell t={t + 60} id="sw6" />
      {t > 4 && t < 20 ? <SpeedLines x={x + 120} y={y + 40} w={200} h={260} t={t} angle={-62} o={0.45} /> : null}
      <Hero look={PIP} pose={{ ...pose, x, y, ...faceAt(t, [[0, 'cool']]), glint: t > 3 && t < 22 ? 1 : 0, glintColor: CYAN }} rimId="rimL" shadow={0.4} />
      <Puff x={BOT_X - 60} y={FLOOR0} t={t - 4} />
      <Puff x={360} y={SW.top} t={t - 20} s={0.8} />
    </g>
  );
};

// S7: low angle from the landing: jump two, up past the camera to the upper floor
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const u = clamp((t - 3) / 15);
  const x = lerp(380, 1120, easeInOut(u));
  const ground = lerp(SW.top, UPPER, u);
  const y = ground - LEG_LEN * 0.9 - arc(t, 3, 15, 220);
  const pose = poseAt(t, [
    { f: 0, p: { x, y, scale: 0.9, yaw: 0.5, facing: 1, look: 0.5, squash: 0.12, armL: { a: 40, b: -20 }, armR: { a: 40, b: -20 } } },
    { f: 4, p: { squash: -0.12, armL: { a: 160, b: 10 }, armR: { a: 150, b: 10 }, legL: { a: 40, b: 60 }, legR: { a: -30, b: 50 }, tilt: 14 }, ease: easeOut },
    { f: 16, p: { squash: 0, legL: { a: 10, b: 20 }, legR: { a: -10, b: 20 }, tilt: 4 } },
    { f: 19, p: { squash: 0.14 } },
    { f: 23, p: { squash: 0, armL: { a: 14, b: -8 }, armR: { a: 14, b: -8 }, tilt: 0 } },
  ]);
  return (
    <g transform={`${camV(lerp(560, 1060, easeInOut(u)), lerp(330, -120, easeInOut(u)), 1.7)} rotate(${-4} 800 200)`}>
      <UpperFloor t={t} />
      <Stairwell t={t + 80} id="sw7" />
      {t > 3 && t < 18 ? <SpeedLines x={x - 100} y={y + 60} w={180} h={260} t={t} angle={56} o={0.45} /> : null}
      <Hero look={PIP} pose={{ ...pose, x, y, ...faceAt(t, [[0, 'cool']]), glint: t < 20 ? 1 : 0, glintColor: CYAN }} rimId="rimR" shadow={0.4} />
      <Puff x={1120} y={UPPER} t={t - 18} s={0.8} />
      <Foreground blur={16}>
        <path d={`M 150 ${SW.top + 300} L 520 ${SW.top + 40} L 600 ${SW.top + 80} L 260 ${SW.top + 420} Z`} fill="#0A080E" />
      </Foreground>
    </g>
  );
};

// S8: medium on the upper floor: Pip lands at the classroom door, the shades drop on, first one there
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 1100, y: UPPER - LEG_LEN * 0.9, scale: 0.9, yaw: 0.25, squash: 0.1, armL: { a: 30, b: -20 }, armR: { a: 30, b: -20 } } },
    { f: 4, p: { squash: 0, armL: { a: 14, b: -8 }, armR: { a: 60, b: 90 }, tilt: -3 }, ease: easeOut },
    { f: 9, p: { armR: { a: 50, b: 100 } } },
  ]);
  return (
    <g transform={camV(1180, kf(t, [[0, UPPER - 230], [len, UPPER - 240]]), kf(t, [[0, 2.3], [len, 2.45]]))}>
      <UpperFloor t={t} />
      <Stairwell t={t + 100} id="sw8" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'cool'], [8, 'smug']]), glasses: clamp((t - 5) / 6) }} rimId="rimR" shadow={0.4} />
      <Sparkle x={1150} y={UPPER - 330} t={t - 10} s={0.7} />
    </g>
  );
};

// ================= 1c: roof to roof =================
const GX0 = 900;
const GX1 = 1160;
const YL = 820;
const YR = 860;
const ROOF_L = YL - 26; // feet on the left roof
const RoofScene: React.FC<{ t: number; red?: number; sunX?: number; sunY?: number }> = ({ t, red = 0, sunX = 1030, sunY = 560 }) => (
  <g>
    <Rooftop t={t} sunX={sunX} sunY={sunY} red={red} />
    <RoofBlocks gx0={GX0} gx1={GX1} yL={YL} yR={YR} t={t} red={red} />
  </g>
);

// S9: wide: Pip sprints across the left roof toward the gap
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 420], [len, 860]], (v) => v);
  const pose = walkPose(x, t * 0.95, ROOF_L - LEG_LEN * 0.9, 0.9, { yaw: 0.6, tilt: 10, look: 0.6 }, 1);
  return (
    <g transform={camV(kf(t, [[0, 760], [len, 860]]), 640, kf(t, [[0, 1.2], [len, 1.26]]))}>
      <RoofScene t={t + 40} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'cool']]) }} rimId="rimR" shadow={0.4} />
      <Foreground blur={10}>
        <rect x={180} y={680} width={120} height={900} fill="#0C0A12" />
        <path d="M 180 690 L 300 690" stroke="#FFB46A" strokeWidth={4} opacity={0.3} />
      </Foreground>
    </g>
  );
};

// S10: extreme wide, low: the leap over the alley, silhouetted against the sun
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const u = clamp((t - 2) / 26);
  const x = lerp(870, 1040, easeOut(u));
  const y = ROOF_L - LEG_LEN * 0.9 - easeOut(u) * 300;
  const pose = poseAt(t, [
    { f: 0, p: { x, y, scale: 0.9, yaw: 0.7, squash: 0.12, tilt: 12, armL: { a: -30, b: -10 }, armR: { a: -30, b: -10 } } },
    { f: 4, p: { squash: -0.08, legL: { a: 70, b: -10 }, legR: { a: -60, b: 40 }, armL: { a: 150, b: 10 }, armR: { a: 120, b: 20 }, tilt: 18 }, ease: easeOut },
    { f: 20, p: { squash: 0, legL: { a: 50, b: 20 }, legR: { a: -40, b: 50 }, tilt: 10 } },
  ]);
  return (
    <g transform={camV(1010, kf(t, [[0, 640], [len, 560]]), kf(t, [[0, 1.15], [len, 1.2]]))}>
      <RoofScene t={t + 60} sunX={1040} sunY={480} />
      {t > 2 && t < 22 ? <SpeedLines x={x - 100} y={y + 20} w={160} h={300} t={t} angle={70} o={0.4} /> : null}
      <Hero look={PIP} pose={{ ...pose, x, y, ...faceAt(t, [[0, 'cool'], [6, 'happy']]), glint: 1, glintColor: CYAN }} rimId="rimR" shadow={0} />
      <Puff x={880} y={ROOF_L + 10} t={t - 2} />
    </g>
  );
};

// S11: medium, above the gap: he should be coming down by now. He isn't. The alley yawns below
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const y = 470 + t * 0.6 + Math.sin(t / 9) * 6;
  const pose = poseAt(t, [
    { f: 0, p: { x: 1035, y, scale: 0.9, yaw: 0.2, look: 0.1, headTilt: 12, legL: { a: 18, b: 28 }, legR: { a: -12, b: 34 }, armL: { a: 70, b: -20 }, armR: { a: 76, b: -24 } } },
    { f: 14, p: { armL: { a: 84, b: -10 }, armR: { a: 66, b: -30 }, headTilt: 18, look: -0.2 } },
  ]);
  const secs = (t / 30 + 2.1).toFixed(1);
  return (
    <g transform={camV(1040, kf(t, [[0, 820], [len, 860]]), kf(t, [[0, 1.55], [len, 1.62]]))}>
      <RoofScene t={t + 90} sunX={1300} sunY={420} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [10, 'worried']]) }} rimId="rimR" shadow={0} />
      <Dial x={1230} y={300} p={((t / 30 + 2.1) % 6.4) / 6.4} readout={`${secs}s`} r={64} size={34} />
    </g>
  );
};

// ================= 2: the title =================
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const y = 560 + Math.sin(t / 10) * 10;
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y, scale: 0.85, yaw: 0, armL: { a: -120, b: 10 }, armR: { a: 120, b: -10 }, legL: { a: 14, b: 10 }, legR: { a: -14, b: 10 }, squash: -0.03 } },
    { f: 12, p: { armL: { a: -130, b: 16 }, armR: { a: 130, b: -16 } } },
  ]);
  return (
    <g transform={camV(960, kf(t, [[0, 640], [len, 610]]), kf(t, [[0, 1.17], [len, 1.21]]))}>
      <Rooftop t={t + 120} sunX={960} sunY={660} />
      <Glow x={960} y={600} r={380} o={0.3} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]), glint: 1, glintColor: CYAN }} rimId="rimR" shadow={0} />
      <ellipse cx={960} cy={846} rx={90 - Math.sin(t / 10) * 6} ry={12} fill="#000" opacity={0.35} />
      <PTitle t={t} cx={960} y={-30} lines={['GIMANA KALAU', 'GRAVITASIMU', 'CUMA 10%?']} size={108} />
    </g>
  );
};

// ================= 3: the fun part =================
// S13: schematic: the rule. The world keeps 100%, only you drop to 10%
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const moP = P({ x: 760, y: 1000 - LEG_LEN * 0.8, scale: 0.8, yaw: 0.3, look: 0.6 });
  const pipY = 1000 - LEG_LEN * 0.8 - 160 - Math.sin(t / 9) * 14;
  const pipP = P({ x: 1170, y: pipY, scale: 0.8, yaw: -0.3, look: -0.5, armL: { a: 40, b: -10 }, armR: { a: 40, b: -10 }, legL: { a: 10, b: 20 }, legR: { a: -8, b: 24 } });
  return (
    <g transform={camV(965, 640, 1.12)}>
      <Schematic t={t} id="sch13" />
      <DrawOn d="M 520 1004 L 1420 1004" t={t} dur={8} color={SCH.dim} width={4} />
      <SchLabel x={760} y={150} t={t - 2} text="DUNIA" size={44} color={SCH.dim} />
      <SchLabel x={1170} y={150} t={t - 6} text="KAMU" size={44} color={CYAN} />
      <Hero look={MO} pose={{ ...moP, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimL" shadow={0.4} />
      <Hero look={PIP} pose={{ ...pipP, ...faceAt(t, [[0, 'smug']]) }} rimId="rimR" shadow={0} />
      <ellipse cx={1170} cy={1004} rx={60} ry={10} fill="#000" opacity={0.4} />
      {/* gravity arrows: big for the world, small for you */}
      <g opacity={clamp((t - 4) / 6)}>
        <path d="M 600 300 L 600 560 M 560 520 L 600 572 L 640 520" stroke={SCH.line} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 1330 330 L 1330 380 M 1314 368 L 1330 390 L 1346 368" stroke={CYAN} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <CountUp x={760} y={260} t={t - 4} to={100} dur={14} size={92} color={SCH.line} suffix="%" />
      <CountUp x={1170} y={260} t={t - 8} to={10} dur={14} size={92} color={CYAN} suffix="%" />
    </g>
  );
};

// a bathroom floor for the scale shots
const Tiles: React.FC<{ y0: number }> = ({ y0 }) => (
  <g>
    <rect x={-200} y={-400} width={2400} height={y0 + 400} fill="#3A3F4A" />
    <rect x={-200} y={y0} width={2400} height={2000} fill="#5A6070" />
    {Array.from({ length: 16 }).map((_, i) => (
      <path key={`v${i}`} d={`M ${-200 + i * 160} ${y0} L ${-200 + i * 160 + (i * 160 - 1160) * 0.6} ${y0 + 1600}`} stroke="#474C5A" strokeWidth={4} />
    ))}
    {Array.from({ length: 10 }).map((_, i) => (
      <path key={`h${i}`} d={`M -200 ${y0 + Math.pow(i, 1.6) * 30} L 2200 ${y0 + Math.pow(i, 1.6) * 30}`} stroke="#474C5A" strokeWidth={4} />
    ))}
    {Array.from({ length: 12 }).map((_, i) => (
      <rect key={`w${i}`} x={-200 + (i % 6) * 200 + (Math.floor(i / 6) % 2) * 100} y={y0 - 120 - Math.floor(i / 6) * 120} width={196} height={116} fill="#434856" />
    ))}
  </g>
);

// S14: macro insert, high: the scale reads 50.0 under Pip's feet
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const kg = t < 8 ? (50 + (rnd(4, t) - 0.5) * (8 - t) * 0.8).toFixed(1) : '50.0';
  return (
    <g transform={camV(960, kf(t, [[0, 980], [len, 1010]]), kf(t, [[0, 1.02], [len, 1.08]]))}>
      <Tiles y0={560} />
      <Glow x={960} y={640} r={700} o={0.25} />
      <Scale x={960} y={1300} s={2.1} kg={kg} />
      {/* legs and shoes on the scale */}
      {[-1, 1].map((sd) => (
        <g key={sd} filter="url(#rimR)">
          <path d={`M ${960 + sd * 230} -300 L ${960 + sd * 250} 1130`} stroke={PIP.line} strokeWidth={118} strokeLinecap="round" />
          <path d={`M ${960 + sd * 230} -300 L ${960 + sd * 250} 1130`} stroke={PIP.limb} strokeWidth={100} strokeLinecap="round" />
          <ellipse cx={960 + sd * 260} cy={1160} rx={110} ry={56} fill={PIP.shoe} stroke={PIP.line} strokeWidth={10} />
          <path d={`M ${960 + sd * 260 - 80} 1180 L ${960 + sd * 260 + 80} 1180`} stroke="#F6EFE3" strokeWidth={10} opacity={0.6} />
        </g>
      ))}
    </g>
  );
};

// S15: medium: the number falls to 5.0, and Pip lifts off it
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 3) / 14));
  const kg = (50 - 45 * k).toFixed(1);
  const sp = stand(BEDROOM, 0.62, 0.62);
  const lift = easeInOut(clamp((t - 14) / 20)) * 70;
  const pose = poseAt(t, [
    { f: 0, p: { x: sp.x, y: sp.y, scale: sp.scale, yaw: 0.2, look: 0.2, headTilt: 14, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } } },
    { f: 16, p: { armL: { a: 60, b: -20 }, armR: { a: 70, b: -20 }, legL: { a: 10, b: 16 }, legR: { a: -8, b: 20 }, headTilt: 4 } },
  ]);
  const feet = sp.y + LEG_LEN * sp.scale;
  return (
    <g transform={camV(sp.x, kf(t, [[0, sp.y - 20], [len, sp.y - 40]]), kf(t, [[0, 2.3], [len, 2.42]]))}>
      <Bedroom t={t + 30} id="b15" veil={0.4} />
      <Scale x={sp.x} y={feet + 20} s={0.62} kg={kg} />
      <Hero look={PIP} pose={{ ...pose, y: pose.y - lift - 16, ...faceAt(t, [[0, 'neutral'], [8, 'shock'], [20, 'happy']]) }} rimId="rimR" shadow={0} />
      <Tag x={sp.x + 70} y={sp.y + 250} t={t - 6} text={`${kg} kg`} w={270} />
    </g>
  );
};

// S16: schematic, the camera climbs: a normal jump (0.5 m) next to Pip's (5 m)
const M = 260; // world units per metre on this schematic
const GROUND16 = 1500;
const JumpChart: React.FC<{ t: number; len: number; big: boolean }> = ({ t, len, big }) => {
  const normalLift = arc(t % 24, 2, 18, 0.5 * M);
  const lift = big ? 5 * M * easeOut(clamp((t - 2) / 26)) + (t > 28 ? Math.sin((t - 28) / 7) * 8 : 0) : 0;
  const cy = big ? kf(t, [[0, GROUND16 - 380], [24, GROUND16 - 1000]], easeInOut) : kf(t, [[0, GROUND16 - 360], [len, GROUND16 - 400]]);
  const ghost = P({ x: 760, y: GROUND16 - LEG_LEN * 0.75 - normalLift, scale: 0.75, yaw: 0.2, armL: { a: 120, b: 10 }, armR: { a: 120, b: 10 } });
  const pip = P({ x: 1160, y: GROUND16 - LEG_LEN * 0.75 - lift, scale: 0.75, yaw: -0.2, armL: { a: big ? 160 : 14, b: 6 }, armR: { a: big ? 160 : 14, b: 6 }, legL: { a: big ? 20 : 5, b: big ? 40 : 0 }, legR: { a: big ? -14 : -5, b: big ? 40 : 0 }, squash: !big ? 0 : t < 2 ? 0.12 : 0 });
  return (
    <g transform={camV(980, cy, 1.18)}>
      <Schematic t={t + (big ? 60 : 0)} id={big ? 'sch16b' : 'sch16'} />
      <rect x={-400} y={GROUND16} width={2800} height={800} fill={SCH.ground} />
      <path d={`M 400 ${GROUND16} L 1560 ${GROUND16}`} stroke={SCH.dim} strokeWidth={5} />
      <path d={`M 560 ${GROUND16} L 560 ${GROUND16 - 5.4 * M}`} stroke={SCH.dim} strokeWidth={4} />
      {Array.from({ length: 11 }).map((_, i) => (
        <g key={i}>
          <path d={`M 540 ${GROUND16 - i * 0.5 * M} L ${i % 2 ? 560 : 590} ${GROUND16 - i * 0.5 * M}`} stroke={SCH.dim} strokeWidth={4} />
          {i % 2 === 0 ? <text x={520} y={GROUND16 - i * 0.5 * M + 12} textAnchor="end" fontFamily={FONT.ui} fontSize={34} fill={SCH.dim}>{i / 2} m</text> : null}
        </g>
      ))}
      <path d={`M 690 ${GROUND16 - 0.5 * M} L 830 ${GROUND16 - 0.5 * M}`} stroke={SCH.line} strokeWidth={4} strokeDasharray="10 8" />
      <SchLabel x={930} y={GROUND16 - 0.5 * M + 12} t={big ? 30 : t - 4} text="0,5 m" size={40} />
      <Hero look={LOOKS.pipInk} pose={{ ...ghost, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimL" shadow={0} />
      {big ? <path d={`M 1060 ${GROUND16 - 5 * M} L 1260 ${GROUND16 - 5 * M}`} stroke={CYAN} strokeWidth={5} strokeDasharray="12 10" opacity={clamp((t - 6) / 8)} /> : null}
      {big ? <SchLabel x={1340} y={GROUND16 - 5 * M + 20} t={t - 20} text="5 m" size={64} color={CYAN} /> : null}
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, big ? [[0, 'cool'], [18, 'happy']] : [[0, 'smug']]), glint: big ? 1 : 0, glintColor: CYAN }} rimId="rimR" shadow={0} />
      {big && t > 2 && t < 18 ? <SpeedLines x={1160} y={pip.y + 240} w={160} h={320} t={t} o={0.5} /> : null}
    </g>
  );
};
// S16: schematic: a normal jump, half a metre (Pip waits beside it)
export const S16: React.FC<ShotProps> = ({ t, len }) => <JumpChart t={t} len={len} big={false} />;
// S16B: schematic, the camera climbs: Pip's jump, five metres
export const S16B: React.FC<ShotProps> = ({ t, len }) => <JumpChart t={t} len={len} big />;

// S17: wide, in the sky over the city: six seconds of hang time, lying back on the air
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const y = 380 + Math.sin(t / 12) * 12;
  const pose = poseAt(t, [
    { f: 0, p: { x: 1000, y, scale: 1.0, yaw: 0.4, spin: -62, armL: { a: 150, b: 60 }, armR: { a: 160, b: 70 }, legL: { a: 30, b: 10 }, legR: { a: 12, b: 40 } } },
    { f: 30, p: { spin: -70 } },
  ]);
  const s = Math.min(6.4, t / 30 * 1.9 + 0.3);
  return (
    <g transform={camV(960, kf(t, [[0, 420], [len, 400]]), kf(t, [[0, 1.6], [len, 1.66]]))}>
      <Rooftop t={t + 200} sunX={1180} sunY={720} low={300} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [20, 'smug']]), blink: t > 10 && t < 30 ? 1 : 0 }} rimId="rimR" shadow={0} />
      <Dial x={960} y={-60} p={s / 6.4} readout={`${s.toFixed(1)} s`} r={78} size={38} />
    </g>
  );
};
