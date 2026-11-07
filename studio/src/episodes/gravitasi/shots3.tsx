import React from 'react';
import {
  Hero, Pose, basePose, limbSpread, poseAt, faceAt, kf, clamp, lerp, easeOut, easeIn, easeInOut, backOut, rnd, settle, camV, LOOKS, LEG_LEN, joints, toWorld, reachAngle, walkPose,
  Bedroom, BEDROOM, Rooftop, Foreground, Glow, Dust, Sparkle, ShotProps, FONT, UI, Phone,
} from '../../engine';
import { PIP, CYAN, RED, arc, SpeedLines, Puff, RoofBlocks, PhoneVideo, Dossier, Wind, GChip, InsertArm } from './parts';

const MO = LOOKS.mo;
const SIS = LOOKS.sis;
const SUIT = LOOKS.suit;
const P = (p: Partial<Pose>): Pose => ({ ...basePose, ...p });
const DECK = 820; // feet on the rooftop deck

// ================= 5: someone notices =================
// S35: medium: Mo films on his phone; behind him, small against the sun, Pip leaps between roofs
export const S35: React.FC<ShotProps> = ({ t, len }) => {
  const mo = P({ x: 640, y: 794 - LEG_LEN * 0.95, scale: 0.95, yaw: 0.6, look: 0.7, armR: { a: 100, b: 10 }, armL: { a: 20, b: -20 }, headTilt: -4 });
  const hand = toWorld(mo, joints(mo).armR.end);
  const u = (t % 40) / 40;
  const pip = P({ x: lerp(880, 1180, u), y: 560 - Math.sin(u * Math.PI) * 220, scale: 0.42, yaw: 0.7, legL: { a: 60, b: -10 }, legR: { a: -50, b: 40 }, armL: { a: 150, b: 10 }, armR: { a: 120, b: 20 } });
  return (
    <g transform={camV(kf(t, [[0, 860], [len, 880]]), 560, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <Rooftop t={t + 400} sunX={1060} sunY={520} />
      <RoofBlocks gx0={940} gx1={1140} yL={820} yR={840} t={t} />
      <Hero look={PIP} pose={{ ...pip, expr: 'happy', blink: 0 }} rimId="rimR" shadow={0} />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={0.4} />
      <Phone x={hand.x + 14} y={hand.y - 30} w={62} rot={4} on={1} caller="REC" f={t} />
      <circle cx={hand.x + 30} cy={hand.y - 104} r={7} fill={RED} opacity={Math.floor(t / 8) % 2 ? 1 : 0.3} />
    </g>
  );
};

// S36: macro insert: the video, the counter racing to a million overnight
export const S36: React.FC<ShotProps> = ({ t, len }) => {
  const views = 1_000_000 * easeOut(clamp(t / Math.max(20, len * 0.85)));
  return (
    <g transform={camV(960, 900, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <rect x={-200} y={-400} width={2400} height={2800} fill="#0C0A16" />
      <Glow x={960} y={900} r={900} kind="cool" o={0.4} />
      <g filter="url(#blur16)" opacity={0.5}>
        <circle cx={1320} cy={260} r={90} fill="#F6EFE3" />
        <rect x={400} y={1500} width={1200} height={600} fill="#2A2234" />
      </g>
      <InsertArm from={{ x: 1600, y: 2300 }} x={1120} y={1450} ang={-30} s={6} look={PIP} w={170} />
      <PhoneVideo x={960} y={900} w={520} t={t} views={views} rot={-4} />
      <InsertArm from={{ x: 300, y: 2300 }} x={720} y={1420} ang={34} s={6} look={PIP} w={170} rim="rimL" />
    </g>
  );
};

// S37: medium: next day. Three knocks shake the bedroom door; Pip turns, in the foreground
const DOOR = { x: 80, y: 660 };
export const S37: React.FC<ShotProps> = ({ t, len }) => {
  const knocks = [6, 12, 18];
  const sh = knocks.reduce((a, k) => a + settle(t - k, 5, 3, 3), 0);
  return (
    <g transform={camV(kf(t, [[0, 120], [len, 100]]), 640, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <g transform={`translate(${sh} 0)`}>
        <Bedroom t={t + 500} id="b37" veil={0.5} clock="07:30" crossed={22} />
      </g>
      {/* the hall light under the door: a pair of feet stand in it */}
      <path d={`M -60 1010 L 160 990 L 190 1030 L -40 1060 Z`} fill="#FFC27A" opacity={0.25} />
      <rect x={10} y={1000} width={36} height={14} fill="#0A0A10" opacity={0.8} />
      <rect x={70} y={996} width={36} height={14} fill="#0A0A10" opacity={0.8} />
      {knocks.map((k) => (t > k && t < k + 6 ? <circle key={k} cx={DOOR.x} cy={DOOR.y} r={20 + (t - k) * 14} fill="none" stroke="#FFF3DC" strokeWidth={4} opacity={1 - (t - k) / 6} /> : null))}
      <Foreground blur={16}>
        <g transform="translate(420 900)">
          <path d="M -140 600 Q -150 140 0 120 Q 150 140 140 600 Z" fill="#14121C" />
          <circle cx={0} cy={0} r={150} fill="#1A1724" />
          <path d="M -120 -40 Q -110 -150 0 -150 Q 110 -150 120 -40" stroke="#FFB46A" strokeWidth={6} fill="none" opacity={0.35} />
        </g>
      </Foreground>
    </g>
  );
};

// a doorway seen straight on, the hall blazing behind it
const Doorway: React.FC<{ t: number; open?: number }> = ({ t, open = 1 }) => (
  <g>
    <rect x={-400} y={-600} width={2800} height={2600} fill="#1A1626" />
    <defs>
      <linearGradient id="hall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFE2B0" />
        <stop offset="100%" stopColor="#E89A5A" />
      </linearGradient>
    </defs>
    <rect x={700} y={120} width={520} height={980} fill="url(#hall)" />
    <path d={`M 700 1100 L 1220 1100 L 1560 1700 L 360 1700 Z`} fill="#FFC27A" opacity={0.22} />
    <rect x={680} y={100} width={20} height={1000} fill="#0E0A14" />
    <rect x={1220} y={100} width={20} height={1000} fill="#0E0A14" />
    <rect x={680} y={100} width={560} height={20} fill="#0E0A14" />
    {/* the door itself, swung open toward us on the left */}
    <path d={`M 700 120 L ${700 - 300 * open} 60 L ${700 - 300 * open} 1160 L 700 1100 Z`} fill="#2A2034" stroke="#0E0A14" strokeWidth={6} />
    <rect x={-400} y={1100} width={2800} height={900} fill="#221C2C" />
    <Glow x={960} y={500} r={600} o={0.4} />
  </g>
);

// S38: low angle, POV from the bed: the man in the suit fills the doorway
export const S38: React.FC<ShotProps> = ({ t, len }) => {
  const pose = P({ x: 960, y: 1100 - LEG_LEN * 1.25, scale: 1.25, yaw: -0.1, look: -0.1, armL: { a: 8, b: -4 }, armR: { a: 8, b: -4 } });
  return (
    <g transform={camV(960, kf(t, [[0, 760], [len, 730]]), kf(t, [[0, 1.2], [len, 1.3]]))}>
      <Doorway t={t} open={easeOut(clamp(t / 8))} />
      <g opacity={clamp((t - 2) / 4)}>
        <Hero look={SUIT} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimL" shadow={0.6} />
      </g>
      <rect x={-400} y={-600} width={2800} height={2600} fill="#000" opacity={0.15} />
    </g>
  );
};

// S39: medium close: he opens a folder: your photo, your name, a red 10%
export const S39: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 1100 - LEG_LEN * 1.25, scale: 1.25, yaw: -0.2, look: -0.2, armL: { a: 30, b: 70 }, armR: { a: 34, b: 74 } } },
    { f: 8, p: { armL: { a: 44, b: 80 }, armR: { a: 48, b: 84 }, headTilt: -4 }, ease: easeOut },
  ]);
  const chest = toWorld(pose, { x: 0, y: -40 });
  return (
    <g transform={camV(960, kf(t, [[0, 640], [len, 650]]), kf(t, [[0, 2.0], [len, 2.15]]))}>
      <Doorway t={t + 20} />
      <Hero look={SUIT} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [Math.round(len * 0.55), 'smug']]) }} rimId="rimL" shadow={0} />
      <Dossier x={chest.x} y={chest.y + 30} s={0.95} t={t - len * 0.62 + 10} rot={-3} />
    </g>
  );
};

// S40: over Pip's shoulder: the man pulls out a tape measure. Not to help. To measure.
export const S40: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 1060, y: 1100 - LEG_LEN * 1.1, scale: 1.1, yaw: -0.35, look: -0.4, armL: { a: 10, b: -4 }, armR: { a: 50, b: 40 } } },
    { f: 10, p: { armR: { a: 72, b: 30 } }, ease: easeOut },
  ]);
  const hand = toWorld(pose, joints(pose).armR.end);
  const ext = easeOut(clamp((t - 10) / 18)) * 380;
  return (
    <g transform={camV(kf(t, [[0, 940], [len, 960]]), 720, kf(t, [[0, 1.45], [len, 1.6]]))}>
      <Doorway t={t + 40} />
      <Hero look={SUIT} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimL" shadow={0.5} />
      {/* the tape measure: a case in his hand, the blade sliding out toward Pip */}
      <g transform={`translate(${hand.x} ${hand.y})`}>
        <rect x={-34} y={-30} width={68} height={60} rx={12} fill="#E9C46A" stroke="#6A4A1A" strokeWidth={4} />
        <rect x={-34 - ext} y={-8} width={ext} height={18} fill="#F2D27A" stroke="#8A6A2A" strokeWidth={2} />
        {Array.from({ length: Math.floor(ext / 24) }).map((_, i) => (
          <path key={i} d={`M ${-40 - i * 24} -8 L ${-40 - i * 24} ${i % 4 === 0 ? 6 : 0}`} stroke="#3A2A10" strokeWidth={2} />
        ))}
      </g>
      <Foreground blur={16}>
        <g transform="translate(560 1060)">
          <path d="M -260 800 Q -280 200 -40 160 Q 200 140 240 800 Z" fill="#14121C" />
          <circle cx={-20} cy={20} r={210} fill="#1A1724" />
          <path d="M -200 -40 Q -180 -190 -20 -190 Q 140 -190 170 -40" stroke="#FFB46A" strokeWidth={8} fill="none" opacity={0.3} />
        </g>
      </Foreground>
    </g>
  );
};

// ================= 6: the sister =================
const PIP_X = 900;
// S41: wide, the rooftop at dusk: Pip and his little sister walk out, hand in hand; he limps a little
export const S41: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 520], [len, 860]], (v) => v);
  const limp = Math.abs(Math.sin(t * 0.3)) * 6;
  const pip = walkPose(x, t * 0.6, DECK - LEG_LEN * 0.9, 0.9, { yaw: 0.45, look: -0.3, armL: { a: 22, b: -10 } }, 1);
  const sis = walkPose(x - 130, t * 0.75 + 1, DECK - LEG_LEN * 0.6, 0.6, { yaw: 0.4, look: 0.5, armR: { a: 40, b: -10 } }, 1);
  return (
    <g transform={camV(kf(t, [[0, 760], [len, 820]]), 560, kf(t, [[0, 1.15], [len, 1.2]]))}>
      <Rooftop t={t + 600} sunX={1180} sunY={600} />
      <Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'happy']]), sway: Math.sin(t / 5) * 6 }} rimId="rimR" shadow={0.5} />
      <Hero look={PIP} pose={{ ...pip, y: pip.y + limp, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.5} />
      <Glow x={x - 70} y={DECK - 160} r={50} o={0.25} />
    </g>
  );
};

// S42: medium: the wind hits; the lights swing, scraps fly, both lean into it
export const S42: React.FC<ShotProps> = ({ t, len }) => {
  const gust = 0.5 + 0.5 * Math.sin(t / 6);
  const pip = P({ x: PIP_X, y: DECK - LEG_LEN * 0.9, scale: 0.9, yaw: -0.4, look: -0.6, tilt: -12 - gust * 6, armL: { a: 60, b: -20 }, armR: { a: 30, b: -10 }, headTilt: -8 });
  const sis = P({ x: PIP_X - 140, y: DECK - LEG_LEN * 0.6, scale: 0.6, yaw: 0.3, look: 0.6, tilt: -16 - gust * 6, armR: { a: 60, b: -10 } });
  return (
    <g transform={`${camV(PIP_X - 60, 620, kf(t, [[0, 2.0], [len, 2.1]]))} rotate(${Math.sin(t / 4) * 0.8} 900 600)`}>
      <Rooftop t={t * 3 + 700} sunX={1180} sunY={600} />
      <Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'worried']]), sway: 18 + gust * 14 }} rimId="rimR" shadow={0.5} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'worried']]), sway: 20 + gust * 16 }} rimId="rimR" shadow={0.5} />
      <Wind t={t} x0={500} y0={250} w={900} h={700} o={0.6} />
      {Array.from({ length: 6 }).map((_, i) => {
        const p = ((t * (1.4 + i * 0.2) + i * 37) % 70) / 70;
        return <rect key={i} x={1400 - p * 1000} y={360 + i * 70 + Math.sin(p * 9 + i) * 40} width={26} height={16} fill={i % 2 ? '#C9A46A' : '#6A8A5A'} transform={`rotate(${p * 720} ${1400 - p * 1000} ${360 + i * 70})`} />;
      })}
    </g>
  );
};

// S43: low insert on the deck: Pip's trainers rise off the boards; his sister's stay planted
export const S43: React.FC<ShotProps> = ({ t, len }) => {
  const lift = easeInOut(clamp((t - 4) / 24)) * 230;
  return (
    <g transform={camV(960, 1100, 1.0)}>
      <rect x={-200} y={-400} width={2400} height={1200} fill="#2A1E3A" />
      <g filter="url(#blur16)">
        <rect x={-200} y={-400} width={2400} height={900} fill="#E08A5E" opacity={0.6} />
        {Array.from({ length: 14 }).map((_, i) => (
          <circle key={i} cx={-100 + i * 170} cy={420 + rnd(3, i) * 200} r={20 + rnd(4, i) * 30} fill="#FFC27A" opacity={0.5} />
        ))}
      </g>
      <rect x={-200} y={700} width={2400} height={60} fill="#2B2230" />
      <rect x={-200} y={760} width={2400} height={1400} fill="#181220" />
      {Array.from({ length: 8 }).map((_, i) => (
        <path key={i} d={`M ${-200 + i * 330} 760 L ${-200 + i * 330 + (i * 330 - 1160) * 0.8} 2200`} stroke="#120C18" strokeWidth={6} />
      ))}
      <Wind t={t} x0={-100} y0={900} w={2200} h={600} o={0.35} n={14} />
      {/* Pip's legs: big, rising */}
      {[-1, 1].map((sd) => (
        <g key={sd} filter="url(#rimR)" transform={`translate(0 ${-lift * (sd > 0 ? 1 : 0.9)})`}>
          <path d={`M ${1180 + sd * 110} -400 L ${1190 + sd * 120} 1380`} stroke={PIP.line} strokeWidth={150} strokeLinecap="round" />
          <path d={`M ${1180 + sd * 110} -400 L ${1190 + sd * 120} 1380`} stroke={PIP.limb} strokeWidth={128} strokeLinecap="round" />
          <ellipse cx={1210 + sd * 130} cy={1440} rx={150} ry={74} fill={PIP.shoe} stroke={PIP.line} strokeWidth={12} />
        </g>
      ))}
      <ellipse cx={1210} cy={1560} rx={330 - lift * 0.5} ry={40} fill="#000" opacity={0.45 - lift / 800} />
      {/* her legs: small, braced */}
      {[-1, 1].map((sd) => (
        <g key={`s${sd}`} filter="url(#rimR)">
          <path d={`M ${600 + sd * 60} 700 L ${580 + sd * 90} 1450`} stroke={SIS.line} strokeWidth={96} strokeLinecap="round" />
          <path d={`M ${600 + sd * 60} 700 L ${580 + sd * 90} 1450`} stroke={SIS.limb} strokeWidth={80} strokeLinecap="round" />
          <ellipse cx={590 + sd * 100} cy={1500} rx={100} ry={48} fill={SIS.shoe} stroke={SIS.line} strokeWidth={10} />
        </g>
      ))}
      <ellipse cx={600} cy={1560} rx={260} ry={34} fill="#000" opacity={0.45} />
      <Puff x={1210} y={1520} t={t - 4} s={1.6} />
    </g>
  );
};

// Pip held down by one hand: the sister's arm reaches up-right to the grip; Pip lies on the wind, his hand on it.
const rad = (d: number) => (d * Math.PI) / 180;
const held = (o: { sisX: number; sisLift?: number; sisS?: number; pipS?: number; spin: number; dirDeg: number; t: number; armA?: number }) => {
  const sisS = o.sisS ?? 0.7;
  const pipS = o.pipS ?? 0.9;
  const lift = o.sisLift ?? 0;
  const sis0 = P({ x: o.sisX, y: DECK - LEG_LEN * sisS - lift, scale: sisS, yaw: 0.35, look: 0.9, headTilt: -22, tilt: -6, legL: { a: -14 + lift * 0.2, b: lift * 0.6 }, legR: { a: 18, b: 0 } });
  const sh = toWorld(sis0, { x: 42 * limbSpread(0.35) + 0.35 * 6, y: -108 });
  const L = 120 * sisS * 0.96;
  const grip = { x: sh.x + Math.sin(rad(o.dirDeg)) * L, y: sh.y - Math.cos(rad(o.dirDeg)) * L };
  const ra = reachAngle(sis0, grip);
  const sis = { ...sis0, armR: { a: ra, b: 0 }, armL: { a: ra - 8, b: 4 } };
  const flutter = Math.sin(o.t / 3) * 6;
  const pip0 = P({ scale: pipS, yaw: 0.25, look: -0.6, spin: o.spin, headTilt: 10, armL: { a: o.armA ?? 125, b: 0 }, armR: { a: 40 + flutter, b: -30 }, legL: { a: 14 + flutter, b: 20 }, legR: { a: -10 - flutter, b: 34 } });
  const h = toWorld({ ...pip0, x: 0, y: 0 }, joints(pip0).armL.end);
  const pip = { ...pip0, x: grip.x - h.x, y: grip.y - h.y };
  return { sis, pip, grip };
};
const WindR: React.FC<{ t: number; x0: number; y0: number; w: number; h: number; o?: number }> = (p) => (
  <g transform={`translate(${2 * p.x0 + p.w} 0) scale(-1 1)`}>
    <Wind {...p} />
  </g>
);

// S44: medium, portrait: Pip lifts off and lies on the wind; only her small hand holds him down
export const S44: React.FC<ShotProps> = ({ t, len }) => {
  const { sis, pip, grip } = held({ sisX: 760, spin: -92 + Math.sin(t / 7) * 4, dirDeg: 24, t });
  return (
    <g transform={camV(900, kf(t, [[0, 600], [len, 580]]), kf(t, [[0, 1.85], [len, 1.95]]))}>
      <Rooftop t={t * 2.5 + 900} sunX={1150} sunY={560} red={0.15} />
      <WindR t={t} x0={400} y0={200} w={1000} h={700} o={0.5} />
      <Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'worried']]), sway: 22 }} rimId="rimR" shadow={0.5} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'worried']]), sway: 24 }} rimId="rimR" shadow={0} />
      <Glow x={grip.x} y={grip.y} r={50} o={0.55} />
    </g>
  );
};

// ================= 7: the cliffhanger =================
// S45: the readout, huge: 10%... 9%
export const S45: React.FC<ShotProps> = ({ t, len }) => {
  const flip = Math.round(len * 0.55);
  const glitch = t > flip - 3 && t < flip + 3;
  const val = t < flip ? '10%' : '9%';
  return (
    <g transform={camV(960, 540, 1.0)}>
      <rect x={-200} y={-500} width={2400} height={2400} fill="#120814" />
      <Glow x={960} y={540} r={700} kind="red" o={0.3 + (t > flip ? 0.2 : 0)} />
      <g transform={`translate(${glitch ? Math.sin(t * 7) * 18 : 0} 0)`}>
        <GChip x={960} y={540} t={t + 8} s={2.6} value={val} red={t > flip ? 1 : 0} />
      </g>
      {glitch ? <rect x={-200} y={480 + (t % 3) * 30} width={2400} height={14} fill={RED} opacity={0.6} /> : null}
    </g>
  );
};

// S46: wide: higher now; she's up on her toes, the grip slides to fingertips. 8%
export const S46: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeInOut(clamp(t / Math.max(20, len)));
  const { sis, pip, grip } = held({ sisX: 760, sisLift: 14 * k, spin: -112 + Math.sin(t / 6) * 5, dirDeg: 12, t, armA: 140 });
  return (
    <g transform={camV(880, kf(t, [[0, 560], [len, 520]]), kf(t, [[0, 1.45], [len, 1.5]]))}>
      <Rooftop t={t * 2.5 + 1000} sunX={1150} sunY={600} red={0.35} />
      <WindR t={t} x0={300} y0={0} w={1200} h={900} o={0.5} />
      <Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'worried']]), sway: 24 }} rimId="rimR" shadow={0.4} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'shock']]), sway: 26 }} rimId="rimRed" shadow={0} />
      <Glow x={grip.x} y={grip.y} r={40} kind="red" o={0.5} />
      <GChip x={880} y={-20} t={t} s={1.0} value="8%" red={1} />
    </g>
  );
};

// S47: extreme wide, pulling up and away: two small figures on a red roof, one on the wind, one holding on
export const S47: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeInOut(clamp(t / Math.max(30, len)));
  const { sis, pip } = held({ sisX: 940, sisLift: 14, spin: -118 + Math.sin(t / 6) * 5, dirDeg: 8, t, armA: 146, sisS: 0.5, pipS: 0.64 });
  return (
    <g transform={camV(960, lerp(620, 520, k), lerp(1.25, 1.02, k))}>
      <Rooftop t={t * 2 + 1100} sunX={1150} sunY={lerp(600, 700, k)} red={lerp(0.4, 1, k)} lightsOut={k} />
      <Hero look={SIS} pose={{ ...sis, expr: 'worried', blink: 0 }} rimId="rimRed" shadow={0.4} />
      <Hero look={PIP} pose={{ ...pip, expr: 'worried', blink: 0 }} rimId="rimRed" shadow={0} />
      <WindR t={t} x0={300} y0={0} w={1300} h={900} o={0.35} />
    </g>
  );
};
