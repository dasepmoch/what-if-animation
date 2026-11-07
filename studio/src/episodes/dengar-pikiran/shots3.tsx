import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, lerp, easeOut, easeIn, easeInOut, backOut, rnd, settle, camV, LEG_LEN, toWorld, walkPose,
  Classroom, SchoolDesk, Stairwell, hipGround, SW, Bedroom, BEDROOM, bedSit, BedDuvet, WINDOW, Foreground, Glow, FocusRings, ShotProps, FONT,
} from '../../engine';
import { PIP, SUIT, SIS, CYAN, RED, INK, Thought, Ripples, Swarm, Scribble, PicWindow, PicWords, PicPipFace } from './parts';
import { headOf } from './shots1';

const P = (p: Partial<Pose>): Pose => ({ ...basePose, ...p });
const C_PIP = { x: 1260, y: 760 - LEG_LEN * 0.95 + 120, scale: 0.95 };

// ================= 5: someone notices =================
// S37: wide, class: the swarm freezes and greys; one clean bubble glides in through the noise, cold and clear
export const S37: React.FC<ShotProps> = ({ t, len }) => {
  const pip = P({ ...C_PIP, yaw: -0.2, look: -0.6, headTilt: -6, armL: { a: 30, b: 50 }, armR: { a: 30, b: 50 } });
  const h = headOf(pip);
  const glide = easeOut(clamp((t - 4) / 20));
  return (
    <g transform={camV(kf(t, [[0, 960], [len, 1060]]), kf(t, [[0, 480], [len, 430]]), kf(t, [[0, 1.15], [len, 1.4]]))}>
      <Classroom t={t + 1000} id="c37" />
      <Swarm cx={960} cy={360} w={1400} h={700} t={60} n={30} grow={20} seed={32} tone="grey" jitter={0} size={0.8} o={0.55} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'tired'], [10, 'shock']]) }} rimId="rimL" shadow={0} />
      <SchoolDesk x={1260} />
      <Thought x={lerp(300, h.x - 230, glide)} y={lerp(160, h.y - 230, glide)} w={240} h={160} t={t - 2} seed={41} tone="cold">
        <path d="M -70 0 L 70 0" stroke="#3A4A66" strokeWidth={10} strokeLinecap="round" />
      </Thought>
    </g>
  );
};

// S38: extreme close-up: Pip's eyes snap clear; focus rings; the noise falls silent
export const S38: React.FC<ShotProps> = ({ t, len }) => {
  const pip = P({ ...C_PIP, yaw: -0.25, look: -0.8 });
  const h = headOf(pip);
  return (
    <g transform={camV(h.x - 10, h.y + 40, kf(t, [[0, 6.0], [len, 6.6]]))}>
      <rect x={-500} y={-500} width={3000} height={3000} fill="#0E0C1A" />
      <Glow x={h.x - 200} y={h.y - 80} r={260} kind="cool" o={0.55} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'shock']]), glint: 1, glintColor: '#DDE6F2' }} rimId="rimBlueL" shadow={0} />
      <g transform={`translate(${h.x} ${h.y}) scale(0.4) translate(${-h.x} ${-h.y})`}>
        <FocusRings x={h.x} y={h.y} t={t - 2} r0={60} color="#DDE6F2" />
      </g>
    </g>
  );
};

// S39: low angle up the stairs: at the top, the man in the suit, still; the landing light behind him
const TOP_X = 560;
const suitTop = P({ x: TOP_X, y: hipGround(TOP_X), scale: 1.05, yaw: 0.3, look: 0.5, armL: { a: 6, b: -4 }, armR: { a: 6, b: -4 } });
export const S39: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camV(kf(t, [[0, 820], [len, 760]]), kf(t, [[0, 520], [len, 480]]), kf(t, [[0, 1.35], [len, 1.5]]))}>
    <Stairwell t={t + 300} id="s39" />
    <Glow x={TOP_X - 60} y={hipGround(TOP_X) - 260} r={360} o={0.5} />
    <Hero look={SUIT} pose={{ ...suitTop, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimL" shadow={0} />
    <Foreground blur={10}>
      <path d="M 1100 1500 Q 1140 1050 1240 980 L 1600 980 L 1600 1500 Z" fill="#0A0810" />
    </Foreground>
  </g>
);

// S40: the same man, the same stairs: a flash of the first meeting (desaturated), cut against now
export const S40: React.FC<ShotProps> = ({ t, len }) => {
  const k = t < len / 2 ? 0 : 1;
  const suit = k === 0 ? walkPose(820, 2, hipGround, 1.05, { yaw: 0.5 }, 1) : suitTop;
  const h = headOf(suit);
  return (
    <g transform={camV(h.x + 20, h.y + 120, 2.2)}>
      <g style={{ filter: k === 0 ? 'grayscale(1) contrast(1.2) brightness(0.8)' : undefined }}>
        <Stairwell t={300} id="s40" />
        <Hero look={SUIT} pose={{ ...suit, expr: 'neutral', blink: 0 }} rimId={k === 0 ? 'rimRed' : 'rimL'} shadow={0} />
        {k === 0 ? <circle cx={h.x} cy={h.y} r={74} fill="#05040A" opacity={0.92} /> : null}
      </g>
      {k === 0 ? <rect x={-500} y={-500} width={3000} height={3000} fill="#FFFFFF" opacity={0.06} /> : null}
    </g>
  );
};

// S41: extreme close-up: his mouth, closed. He doesn't blink
export const S41: React.FC<ShotProps> = ({ t, len }) => {
  const h = headOf(suitTop);
  return (
    <g transform={camV(h.x + 10, h.y + 30, kf(t, [[0, 4.2], [len, 4.6]]))}>
      <Stairwell t={340} id="s41" />
      <Glow x={h.x - 160} y={h.y - 160} r={300} o={0.5} />
      <Hero look={SUIT} pose={{ ...suitTop, expr: 'neutral', blink: 0 }} rimId="rimL" shadow={0} />
    </g>
  );
};

// S42: over Pip's shoulder: the man, and his thought, aimed at Pip: KAMI TAHU.
export const S42: React.FC<ShotProps> = ({ t, len }) => {
  const h = headOf(suitTop);
  return (
    <g transform={camV(kf(t, [[0, 700], [len, 680]]), kf(t, [[0, 420], [len, 400]]), kf(t, [[0, 1.55], [len, 1.7]]))}>
      <Stairwell t={t + 360} id="s42" />
      <Glow x={TOP_X - 60} y={hipGround(TOP_X) - 260} r={360} o={0.5} />
      <Hero look={SUIT} pose={{ ...suitTop, ...faceAt(t, [[0, 'neutral'], [Math.round(len * 0.6), 'smug']]) }} rimId="rimL" shadow={0} />
      <Thought x={h.x + 260} y={h.y - 220} w={400} h={260} t={t - 6} seed={42} tone="cold" from={{ x: h.x + 50, y: h.y - 60 }}>
        <PicWords lines={['KAMI', 'TAHU.']} size={78} color="#2A3550" />
      </Thought>
      <Foreground blur={16}>
        <g transform="translate(1010 930)">
          <path d="M -260 800 Q -280 200 -40 160 Q 200 140 240 800 Z" fill="#14121C" />
          <circle cx={-20} cy={20} r={210} fill="#1A1724" />
          <path d="M -200 -40 Q -180 -190 -20 -190 Q 140 -190 170 -40" stroke="#FFB46A" strokeWidth={8} fill="none" opacity={0.3} />
        </g>
      </Foreground>
    </g>
  );
};

// ================= 6: the sister =================
const SIS_SIT = bedSit(0.22);
const sisPose = (t: number) => P({ x: SIS_SIT.x, y: SIS_SIT.y, scale: SIS_SIT.scale * 0.8, yaw: 0.4, look: 0.6, headTilt: -4, armL: { a: 40, b: 50 }, armR: { a: 40, b: 50 } });
// S43: wide, her room at night: little sister in bed, the lamp on; Pip in the doorway on the right; she waves: fine
export const S43: React.FC<ShotProps> = ({ t, len }) => {
  const sis = poseAt(t, [
    { f: 0, p: sisPose(t) },
    { f: 6, p: { armR: { a: 140, b: 20 } }, ease: easeOut },
    { f: 10, p: { armR: { a: 130, b: 30 } } },
  ]);
  const door = BEDROOM.P(0.98, 0.5, 0.75);
  const pip = P({ x: 1190, y: 870 - LEG_LEN * 1.1, scale: 1.1, yaw: -0.6, look: -0.7, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 } });
  return (
    <g transform={camV(kf(t, [[0, 860], [len, 840]]), 580, kf(t, [[0, 1.3], [len, 1.36]]))}>
      <Bedroom t={t + 60} id="b43" veil={0.45} clock="21:40" crossed={0} duvet={false} />
      <Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <BedDuvet knees={0.6} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimL" shadow={0} />
    </g>
  );
};

// S44: close-up: she's smiling, but the thought over her is red and shaking, and shows a window
export const S44: React.FC<ShotProps> = ({ t, len }) => {
  const sis = P({ ...sisPose(t), look: 0.7 });
  const h = headOf(sis);
  return (
    <g transform={camV(h.x + 90, h.y - 70, kf(t, [[0, 2.6], [len, 2.8]]))}>
      <Bedroom t={t + 120} id="b44" veil={0.5} clock="21:41" crossed={0} duvet={false} />
      <Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'happy'], [Math.round(len * 0.7), 'worried']]) }} rimId="rimR" shadow={0} />
      <BedDuvet knees={0.6} />
      <Thought x={h.x + 150} y={h.y - 190} w={270} h={210} t={t - 3} seed={44} tone="red" from={{ x: h.x + 30, y: h.y - 50 }} jitter={4}>
        <PicWindow t={t} />
      </Thought>
      <Ripples x={h.x + 150} y={h.y - 190} t={t} r0={120} color={RED} o={0.6} period={10} />
    </g>
  );
};

// S45: insert: the window. Moonlight. Something dark at the edge of the glass, then gone
export const S45: React.FC<ShotProps> = ({ t, len }) => {
  const shape = clamp(1 - Math.abs(t - len * 0.5) / (len * 0.35));
  const cx = (WINDOW.x0 + WINDOW.x1) / 2;
  const cy = (WINDOW.y0 + WINDOW.y1) / 2;
  return (
    <g transform={camV(cx, cy, kf(t, [[0, 3.6], [len, 4.0]]))}>
      <Bedroom t={t + 160} id="b45" veil={0.5} clock="21:41" duvet={false} />
      <g opacity={shape}>
        <circle cx={WINDOW.x0 + 40} cy={cy - 20} r={34} fill="#05040A" />
        <path d={`M ${WINDOW.x0} ${WINDOW.y1} Q ${WINDOW.x0 + 6} ${cy + 20} ${WINDOW.x0 + 40} ${cy + 16} Q ${WINDOW.x0 + 80} ${cy + 20} ${WINDOW.x0 + 84} ${WINDOW.y1} Z`} fill="#05040A" />
        <circle cx={WINDOW.x0 + 30} cy={cy - 24} r={4} fill={RED} />
        <circle cx={WINDOW.x0 + 50} cy={cy - 24} r={4} fill={RED} />
      </g>
    </g>
  );
};

// ================= 7: the cliffhanger =================
// S46: wide, the dark hall into her room: Pip runs, the door bursts open toward camera
export const S46: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 1700], [len, 1100]], (v) => v);
  const pip = walkPose(x, t * 1.1, 900 - LEG_LEN * 1.1, 1.1, { yaw: -0.7, tilt: -14 }, -1);
  return (
    <g transform={camV(kf(t, [[0, 1420], [len, 1200]]), 560, 1.6)}>
      <Bedroom t={t + 200} id="b46" veil={0.62} clock="21:42" lamp={0} duvet={false} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'shock']]) }} rimId="rimBlueL" shadow={0} />
      <Foreground blur={10}>
        <rect x={1840} y={200} width={200} height={1300} fill="#0A0A14" />
      </Foreground>
    </g>
  );
};

// S47: wide: the bed, empty, the duvet thrown back; the window wide open, the curtain blowing in
export const S47: React.FC<ShotProps> = ({ t, len }) => {
  const sway = Math.sin(t / 6) * 30;
  return (
    <g transform={camV(kf(t, [[0, 880], [len, 960]]), 540, kf(t, [[0, 1.4], [len, 1.55]]))}>
      <Bedroom t={t + 240} id="b47" veil={0.55} clock="21:42" lamp={0} duvet={false} />
      <BedDuvet from={0.3} />
      {/* the open window: the pane swung in, the night and the cold air */}
      <polygon points={`${WINDOW.x1},${WINDOW.y0} ${WINDOW.x1 + 70},${WINDOW.y0 + 20} ${WINDOW.x1 + 70},${WINDOW.y1 + 10} ${WINDOW.x1},${WINDOW.y1}`} fill="#1E2546" stroke="#0A0A14" strokeWidth={5} opacity={0.9} />
      <path d={`M ${WINDOW.x0 - 10} ${WINDOW.y0 - 10} Q ${WINDOW.x0 - 50 + sway} ${(WINDOW.y0 + WINDOW.y1) / 2} ${WINDOW.x0 - 20 + sway * 1.6} ${WINDOW.y1 + 60} L ${WINDOW.x0 + 30} ${WINDOW.y1 + 40} Q ${WINDOW.x0 + 20 + sway * 0.5} ${(WINDOW.y0 + WINDOW.y1) / 2} ${WINDOW.x0 + 40} ${WINDOW.y0 - 10} Z`} fill="#C9B8D8" opacity={0.75} />
      <Glow x={WINDOW.moon.x} y={WINDOW.moon.y} r={300} kind="cool" o={0.5} />
    </g>
  );
};

// S48: close-up: Pip at the window, turning slowly toward camera; the rings now run INTO his head
export const S48: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: { x: 1180, y: 820 - LEG_LEN * 1.1, scale: 1.1, yaw: 0.8, look: 0.8 } },
    { f: Math.max(8, len - 16), p: { yaw: 0.05, look: 0 }, ease: easeInOut },
  ]);
  const h = headOf(pip);
  return (
    <g transform={camV(h.x, h.y + 100, kf(t, [[0, 4.2], [len, 4.8]]))}>
      <Bedroom t={t + 280} id="b48" veil={0.6} clock="21:42" lamp={0} duvet={false} />
      <Glow x={h.x + 260} y={h.y - 100} r={320} kind="cool" o={0.4} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'shock'], [Math.max(10, len - 12), 'worried']]) }} rimId="rimBlue" shadow={0} />
      <Ripples x={h.x} y={h.y} t={t} r0={70} color={RED} o={0.75} inward />
    </g>
  );
};

// S49: the last frame: black; one bubble rises into frame from below, from someone we never see: Pip's own face, ringed red
export const S49: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camV(960, 960, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <rect x={-500} y={-500} width={3000} height={3000} fill="#050409" />
    <Glow x={960} y={900} r={500} kind="red" o={0.25 * clamp(t / 10)} />
    <Thought x={960} y={kf(t, [[0, 1500], [Math.min(len, 30), 900]], easeOut)} w={520} h={400} t={t - 2} seed={49} tone="cold" from={{ x: 960, y: 2000 }}>
      <PicPipFace red />
    </Thought>
  </g>
);

// S42B: wide: he turns and climbs away, unhurried, into the light at the top; no footsteps
export const S42B: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, TOP_X], [len, TOP_X - 220]], (v) => v);
  const suit = walkPose(x, t * 0.4, hipGround, 1.05, { yaw: -0.6 }, -1);
  return (
    <g transform={camV(kf(t, [[0, 760], [len, 720]]), 520, kf(t, [[0, 1.3], [len, 1.36]]))}>
      <Stairwell t={t + 400} id="s42b" />
      <Glow x={TOP_X - 160} y={hipGround(TOP_X) - 260} r={420} o={0.6} />
      <Hero look={SUIT} pose={{ ...suit, expr: 'neutral', blink: 0 }} rimId="rimL" shadow={0} />
      <rect x={-500} y={-500} width={3000} height={3000} fill="#000" opacity={0.25 * clamp(t / len)} />
    </g>
  );
};

// S43B: from the hall: the lamp clicks off, the door swings shut, the strip of light narrows to nothing
export const S43B: React.FC<ShotProps> = ({ t, len }) => {
  const shut = easeInOut(clamp((t - 54) / 32));
  const gap = 520 * (1 - shut);
  return (
    <g transform={camV(960, 900, 1.0)}>
      <rect x={-500} y={-500} width={3000} height={3000} fill="#0C0A14" />
      <g>
        <clipPath id="door43b"><rect x={960 - gap / 2} y={300} width={Math.max(0, gap)} height={1200} /></clipPath>
        <g clipPath="url(#door43b)">
          <g transform="translate(960 900) scale(1.25) translate(-900 -560)">
            <Bedroom t={t + 300} id="b43b" veil={0.5} clock="21:41" lamp={t > 48 ? 0 : 1} duvet={false} />
            <Hero look={SIS} pose={{ ...sisPose(t), blink: 1, expr: 'happy' }} rimId="rimBlue" shadow={0} />
            <BedDuvet knees={0.6} />
          </g>
        </g>
      </g>
      <rect x={960 - gap / 2 - 30} y={300} width={30} height={1200} fill="#2A2034" />
      <rect x={960 + gap / 2} y={300} width={60} height={1200} fill="#3A2E46" />
      <path d={`M ${960 - gap / 2} 1500 L ${960 + gap / 2} 1500 L ${960 + gap} 1900 L ${960 - gap} 1900 Z`} fill="#FFC27A" opacity={0.12 * (1 - shut)} />
    </g>
  );
};

// S47B: the empty room: one thought hangs in the air where she was; cold, still; inside it, a small x
export const S47B: React.FC<ShotProps> = ({ t, len }) => {
  const p = bedSit(0.22);
  return (
    <g transform={camV(p.x + 60, p.y - 200, kf(t, [[0, 2.2], [len, 2.5]]))}>
      <Bedroom t={t + 260} id="b47b" veil={0.6} clock="21:42" lamp={0} duvet={false} />
      <BedDuvet from={0.3} />
      <Glow x={p.x + 60} y={p.y - 260} r={260} kind="cool" o={0.4} />
      <Thought x={p.x + 60} y={p.y - 260} w={240} h={170} t={t + 10} seed={47} tone="cold">
        <path d="M -40 -30 L 40 30 M 40 -30 L -40 30" stroke="#3A4A66" strokeWidth={12} strokeLinecap="round" />
      </Thought>
    </g>
  );
};

// S47C: extreme close on that thought: the x inside it opens into an eye, looking straight at us
export const S47C: React.FC<ShotProps> = ({ t, len }) => {
  const p = bedSit(0.22);
  const open = easeOut(clamp((t - 6) / 10));
  return (
    <g transform={camV(p.x + 60, p.y - 250, kf(t, [[0, 5.2], [len, 5.8]]))}>
      <Bedroom t={t + 300} id="b47c" veil={0.65} clock="21:42" lamp={0} duvet={false} />
      <Glow x={p.x + 60} y={p.y - 260} r={200} kind="red" o={0.35 * open} />
      <Thought x={p.x + 60} y={p.y - 260} w={240} h={170} t={30} seed={47} tone="cold" jitter={open * 1.5}>
        <g opacity={1 - open}><path d="M -40 -30 L 40 30 M 40 -30 L -40 30" stroke="#3A4A66" strokeWidth={12} strokeLinecap="round" /></g>
        <g opacity={open}>
          <path d={`M -80 0 Q 0 ${-60 * open} 80 0 Q 0 ${60 * open} -80 0 Z`} fill="#F6EFE3" stroke={INK} strokeWidth={8} />
          <circle cx={0} cy={0} r={26 * open} fill={INK} />
          <circle cx={8} cy={-8} r={7 * open} fill="#FFFFFF" />
        </g>
      </Thought>
    </g>
  );
};
