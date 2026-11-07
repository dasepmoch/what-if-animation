import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, lerp, easeOut, easeIn, easeInOut, backOut, rnd, settle, camV, LOOKS, LEG_LEN, joints, toWorld,
  Classroom, CLS, stand, Bedroom, BEDROOM, BedDuvet, CAL, LAMP, Stairwell, SW, Schematic, SCH, SchLabel, CountUp, DrawOn, Arrow,
  Foreground, Glow, Dust, Sparkle, FocusRings, Tag, Gauge, ShotProps, FONT, UI,
} from '../../engine';
import { PIP, CYAN, RED, arc, SpeedLines, Puff, Medal, Bone, Astronaut } from './parts';

const MO = LOOKS.mo;
const P = (p: Partial<Pose>): Pose => ({ ...basePose, ...p });

// ================= 3: class =================
const C_STAND = stand(CLS, 0.64, 0.3);
const Chalk: React.FC = () => (
  <g fontFamily={FONT.hand} fill="#E9F0E6" opacity={0.92}>
    <text x={740} y={290} textAnchor="middle" fontSize={64} fontWeight={700}>OLAHRAGA</text>
    <text x={740} y={370} textAnchor="middle" fontSize={46}>lompat tinggi</text>
    <path d="M 560 400 L 920 400" stroke="#E9F0E6" strokeWidth={4} />
    <text x={600} y={470} fontSize={40}>1. ?</text>
  </g>
);

// S18: wide: PE in the classroom: one jump and Pip's hand slaps the ceiling; the class looks up
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const lift = arc(t, 4, 34, 330);
  const pose = poseAt(t, [
    { f: 0, p: { ...C_STAND, yaw: -0.2, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } } },
    { f: 3, p: { squash: 0.14, armL: { a: -40, b: -20 }, armR: { a: -40, b: -20 } }, ease: easeOut },
    { f: 7, p: { squash: -0.1, armL: { a: 30, b: -10 }, armR: { a: 172, b: 0 }, legL: { a: 10, b: 40 }, legR: { a: -10, b: 30 } }, ease: easeOut },
    { f: 36, p: { squash: 0.1, armR: { a: 60, b: -10 }, legL: { a: 5, b: 0 }, legR: { a: -5, b: 0 } } },
    { f: 40, p: { squash: 0 } },
  ]);
  const ceil = CLS.P(0.64, 0, 0.3);
  return (
    <g transform={camV(kf(t, [[0, 980], [len, 990]]), kf(t, [[0, 440], [len, 400]]), kf(t, [[0, 1.13], [len, 1.18]]))}>
      <Classroom t={t + 30} id="c18" board={<Chalk />} laugh={t > 20 ? 0.4 : 0} />
      <Hero look={PIP} pose={{ ...pose, y: pose.y - lift, ...faceAt(t, [[0, 'cool'], [12, 'happy']]), glint: t > 4 && t < 38 ? 1 : 0, glintColor: CYAN }} rimId="rimL" shadow={0} />
      {t > 18 && t < 26 ? <circle cx={ceil.x + 70} cy={ceil.y + 20} r={30 + (t - 18) * 6} fill="none" stroke="#FFF3DC" strokeWidth={5} opacity={1 - (t - 18) / 8} /> : null}
      <Puff x={C_STAND.x} y={C_STAND.y + LEG_LEN * C_STAND.scale} t={t - 4} s={1.3} />
    </g>
  );
};

// S19: medium: landed; a medal, the board fills in "1. KAMU"
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...C_STAND, yaw: 0.1, squash: 0.08, armL: { a: 30, b: -10 }, armR: { a: 30, b: -10 } } },
    { f: 5, p: { squash: 0, armL: { a: 150, b: 20 }, armR: { a: 150, b: 20 } }, ease: easeOut },
    { f: 10, p: { armL: { a: 140, b: 26 }, armR: { a: 140, b: 26 } } },
  ]);
  const chest = toWorld(pose, { x: 0, y: -60 });
  return (
    <g transform={camV(C_STAND.x - 20, kf(t, [[0, C_STAND.y - 120], [len, C_STAND.y - 130]]), kf(t, [[0, 2.05], [len, 2.18]]))}>
      <Classroom t={t + 70} id="c19" laugh={0.8} board={
        <g>
          <Chalk />
          <text x={660} y={470} fontFamily={FONT.hand} fontSize={44} fontWeight={700} fill="#FFE27A" opacity={clamp((t - 6) / 4)}>KAMU!</text>
        </g>
      } />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0.4} />
      <Medal x={chest.x} y={chest.y + 70} s={1.2} t={t - 3} />
      <Sparkle x={chest.x + 90} y={chest.y - 120} t={t - 8} s={1} />
      <Sparkle x={chest.x - 110} y={chest.y - 200} t={t - 13} s={0.8} />
    </g>
  );
};

// S20: close-up: Mo, jaw on the floor
const MO_STAND = stand(CLS, 0.3, 0.42);
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [{ f: 0, p: { ...MO_STAND, yaw: 0.45, look: 0.7, headTilt: -6 } }, { f: 6, p: { headTilt: -14, squash: -0.03 }, ease: easeOut }]);
  const head = toWorld(pose, { x: 0, y: -176 });
  return (
    <g transform={camV(head.x + 10, head.y + 60, kf(t, [[0, 3.4], [len, 3.7]]))}>
      <Classroom t={t + 110} id="c20" laugh={0.6} />
      <Hero look={MO} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [4, 'shock']]) }} rimId="rimR" shadow={0} />
      <FocusRings x={head.x} y={head.y} t={t - 4} r0={40} />
    </g>
  );
};

// ================= 3: bed =================
const FLOAT_BED = BEDROOM.P(0.22, 0.79, 0.24);
// S21: wide: bedtime, Pip asleep, floating cross-legged over the bed, the duvet sliding off
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const y = FLOAT_BED.y - 170 + Math.sin(t / 14) * 10;
  const pose = poseAt(t, [{ f: 0, p: { x: FLOAT_BED.x, y, scale: 0.78, yaw: 0.3, headTilt: 14, tilt: 6, armL: { a: 40, b: 50 }, armR: { a: 34, b: 56 }, legL: { a: 70, b: -110 }, legR: { a: 76, b: -116 } } }]);
  return (
    <g transform={camV(kf(t, [[0, FLOAT_BED.x + 180], [len, FLOAT_BED.x + 160]]), 560, kf(t, [[0, 1.55], [len, 1.62]]))}>
      <Bedroom t={t + 40} id="b21" veil={0.48} clock="23:41" crossed={3} />
      <Hero look={PIP} pose={{ ...pose, expr: 'happy', blink: 1 }} rimId="rimBlue" shadow={0} />
      <ellipse cx={FLOAT_BED.x} cy={FLOAT_BED.y + 6} rx={90} ry={14} fill="#000" opacity={0.25} />
      <Zzz x={FLOAT_BED.x + 70} y={y - 260} t={t} />
      <Foreground blur={10}>
        <path d="M 1300 1500 Q 1330 1100 1420 1000 L 1600 1000 L 1600 1500 Z" fill="#0A0A14" />
      </Foreground>
    </g>
  );
};

export const Zzz: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const p = ((t + i * 14) % 42) / 42;
      return (
        <text key={i} x={x + p * 60 * s + i * 10} y={y - p * 140 * s} fontFamily={FONT.title} fontWeight={800} fontSize={(30 + i * 10) * s} fill="#CFE0FF" opacity={Math.sin(p * Math.PI)} stroke="#141830" strokeWidth={5} paintOrder="stroke">
          z
        </text>
      );
    })}
  </g>
);

// S22: close-up: asleep in mid-air, moonlight on one side, bobbing
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const y = FLOAT_BED.y - 170 + Math.sin(t / 14) * 10;
  const pose = P({ x: FLOAT_BED.x, y, scale: 0.78, yaw: 0.3, headTilt: 14 + Math.sin(t / 20) * 3, tilt: 6, armL: { a: 40, b: 50 }, armR: { a: 34, b: 56 }, legL: { a: 70, b: -110 }, legR: { a: 76, b: -116 } });
  const head = toWorld(pose, { x: 0, y: -176 });
  return (
    <g transform={camV(head.x, head.y + 70, kf(t, [[0, 3.0], [len, 3.25]]))}>
      <Bedroom t={t + 80} id="b22" veil={0.5} clock="23:41" crossed={3} />
      <Hero look={PIP} pose={{ ...pose, expr: 'happy', blink: 1 }} rimId="rimBlue" shadow={0} />
      <Glow x={head.x + 160} y={head.y - 80} r={260} kind="cool" o={0.35} />
      <Zzz x={head.x + 60} y={head.y - 70} t={t} s={0.6} />
    </g>
  );
};

// ================= 4: the turn =================
// S23: low, medium: the lamp dies, red; Pip's eyes snap open in mid-air
export const S23: React.FC<ShotProps> = ({ t, len }) => {
  const y = FLOAT_BED.y - 170;
  const pose = poseAt(t, [
    { f: 0, p: { x: FLOAT_BED.x, y, scale: 0.78, yaw: 0.3, headTilt: 14, tilt: 6, armL: { a: 40, b: 50 }, armR: { a: 34, b: 56 }, legL: { a: 70, b: -110 }, legR: { a: 76, b: -116 } } },
    { f: 6, p: { headTilt: 0, tilt: 0, armL: { a: 60, b: -20 }, armR: { a: 64, b: -20 }, legL: { a: 20, b: 10 }, legR: { a: -10, b: 20 } }, ease: easeOut },
  ]);
  const lamp = t < 3 ? 1 : t < 5 ? 0.2 : t < 6 ? 0.8 : 0;
  return (
    <g transform={camV(FLOAT_BED.x + 30, kf(t, [[0, y - 40], [len, y - 60]]), kf(t, [[0, 2.0], [len, 2.15]]))}>
      <Bedroom t={t + 120} id="b23" veil={0.56} lamp={lamp} clock="03:00" crossed={3} />
      <rect x={-400} y={-600} width={2800} height={2400} fill="#3A0010" opacity={0.35 * clamp(t / 6)} style={{ mixBlendMode: 'multiply' }} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [5, 'shock'], [14, 'worried']]), blink: t < 4 ? 1 : 0 }} rimId="rimRed" shadow={0} />
      <Glow x={FLOAT_BED.x} y={y - 120} r={300} kind="red" o={0.35 * clamp(t / 6)} />
    </g>
  );
};

// S24: schematic: a bone stays strong because it carries load
export const S24: React.FC<ShotProps> = ({ t, len }) => {
  const load = clamp((t - 10) / 10);
  return (
    <g transform={camV(960, 560, kf(t, [[0, 1.1], [len, 1.16]]))}>
      <Schematic t={t} id="sch24" />
      <SchLabel x={960} y={-60} t={t - 2} text="TULANG" size={56} />
      {[0, 1, 2].map((i) => (
        <g key={i} opacity={load} transform={`translate(${860 + i * 100} ${80 + Math.sin(t / 4 + i) * 6 * load})`}>
          <path d="M 0 0 L 0 90 M -24 64 L 0 96 L 24 64" stroke={SCH.live} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
      <SchLabel x={1250} y={150} t={t - 12} text="BEBAN" size={44} color={SCH.live} />
      <Bone x={960} y={600} s={1.2} t={t} draw={clamp(t / 12)} density={0.75 + 0.25 * load} />
      <Glow x={960} y={600} r={420 * load + 1} kind="warm" o={0.25 * load} />
      <SchLabel x={960} y={1110} t={t - 20} text="= KUAT" size={64} color={SCH.live} />
    </g>
  );
};

// S25: schematic: in orbit, no load: astronauts lose 1 to 1.5% of their bone density
export const S25: React.FC<ShotProps> = ({ t, len }) => {
  const dens = 1 - 0.35 * clamp((t - 16) / Math.max(20, len - 20));
  return (
    <g transform={camV(960, 560, kf(t, [[0, 1.08], [len, 1.16]]))}>
      <Schematic t={t} id="sch25" />
      {/* the Earth's limb at the bottom, a station's truss across the top */}
      <path d="M -200 1500 Q 960 1080 2120 1500" fill="#14304A" stroke={SCH.dim} strokeWidth={4} />
      <path d="M -200 1500 Q 960 1110 2120 1500" fill="none" stroke="#5AB0FF" strokeWidth={10} opacity={0.35} />
      <DrawOn d="M 520 -120 L 1400 -120 M 600 -160 L 600 -80 M 1320 -160 L 1320 -80 M 700 -150 L 900 -150 L 900 -90 L 700 -90 Z M 1020 -150 L 1220 -150 L 1220 -90 L 1020 -90 Z" t={t} dur={14} color={SCH.dim} width={4} />
      <Astronaut x={760} y={420} s={1.25} t={t} draw={clamp(t / 8)} />
      <SchLabel x={760} y={160} t={t - 4} text="ASTRONAUT" size={40} color={SCH.dim} />
      <Bone x={1190} y={520} s={0.68} t={t} draw={clamp((t - 6) / 12)} density={dens} />
      <g opacity={clamp((t - 20) / 6)}>
        <rect x={560} y={860} width={800} height={150} rx={30} fill={UI.pill} opacity={0.75} />
        <text x={960} y={960} textAnchor="middle" fontFamily={FONT.ui} fontSize={78} fill={SCH.live}>-1% s/d -1,5%</text>
      </g>
    </g>
  );
};

// S26: schematic: every month. Bars for months 1 to 6, each shorter by about 1.25%
export const S26: React.FC<ShotProps> = ({ t, len }) => {
  const base = 1120;
  return (
    <g transform={camV(960, 640, kf(t, [[0, 1.12], [len, 1.18]]))}>
      <Schematic t={t} id="sch26" />
      <SchLabel x={960} y={150} t={t - 1} text="KEPADATAN TULANG" size={46} color={SCH.dim} />
      {Array.from({ length: 6 }).map((_, i) => {
        const k = clamp((t - 3 - i * 4) / 5);
        const h = 820 * (1 - 0.0125 * (i + 1)) - (i + 1) * 30; // exaggerated drop for legibility, labelled per month
        return (
          <g key={i} opacity={k}>
            <rect x={560 + i * 140} y={base - h * easeOut(k)} width={96} height={h * easeOut(k)} rx={10} fill={i === 5 ? SCH.live : '#3E6A9A'} />
            <text x={608 + i * 140} y={base + 56} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.dim}>B{i + 1}</text>
          </g>
        );
      })}
      <path d={`M 520 ${base} L 1420 ${base}`} stroke={SCH.dim} strokeWidth={4} />
      <Arrow x0={600} y0={230} x1={1320} y1={380} t={t - 10} color={SCH.live} />
      <SchLabel x={960} y={1290} t={t - 14} text="SETIAP BULAN" size={64} color={SCH.live} />
    </g>
  );
};

// S27: close-up: "That's real." Pip in the dark, red rim; the source in a chip
export const S27: React.FC<ShotProps> = ({ t, len }) => {
  const pose = P({ x: 960, y: 760, scale: 1, yaw: -0.15, look: -0.1, armL: { a: 8, b: -4 }, armR: { a: 8, b: -4 } });
  return (
    <g transform={camV(960, kf(t, [[0, 600], [len, 590]]), kf(t, [[0, 3.0], [len, 3.4]]))}>
      <rect x={-400} y={-400} width={2800} height={2400} fill="#0A0610" />
      <Glow x={960} y={590} r={420} kind="red" o={0.45} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried']]) }} rimId="rimRed" shadow={0} />
      <g transform="translate(960 790)" opacity={clamp((t - 4) / 5)}>
        <rect x={-110} y={-24} width={220} height={48} rx={24} fill={UI.pill} opacity={0.8} />
        <text y={10} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill={UI.text} letterSpacing={3}>SUMBER: NASA</text>
      </g>
    </g>
  );
};

// S28: schematic: and your load is now a tenth
export const S28: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeInOut(clamp((t - 4) / 20));
  const pct = Math.round(100 - 90 * k);
  return (
    <g transform={camV(960, 560, 1.12)}>
      <Schematic t={t} id="sch28" />
      <SchLabel x={960} y={160} t={t - 1} text="BEBAN DI TULANGMU" size={46} color={SCH.dim} />
      <g transform="translate(960 640)">
        <rect x={-130} y={-380} width={260} height={760} rx={40} fill="#ffffff" opacity={0.08} />
        <rect x={-130} y={-380 + 760 * (1 - pct / 100)} width={260} height={760 * pct / 100} rx={40} fill={pct < 30 ? RED : SCH.live} />
        <text y={520} textAnchor="middle" fontFamily={FONT.ui} fontSize={110} fill={pct < 30 ? RED : SCH.live}>{pct}%</text>
      </g>
    </g>
  );
};

// an x-ray of the rig: bones along the limbs, a spine, a skull, ribs. `fade` dims them.
const XRay: React.FC<{ pose: Pose; fade?: number; t: number }> = ({ pose, fade = 0, t }) => {
  const j = joints(pose);
  const w = (p: { x: number; y: number }) => toWorld(pose, p);
  const bone = (a: { x: number; y: number }, b: { x: number; y: number }, k: number) => {
    const A = w(a);
    const B = w(b);
    return (
      <g key={k}>
        <path d={`M ${A.x} ${A.y} L ${B.x} ${B.y}`} stroke="#DFF6FF" strokeWidth={16 * pose.scale} strokeLinecap="round" opacity={0.95 - fade * 0.6} />
        <circle cx={A.x} cy={A.y} r={12 * pose.scale} fill="#DFF6FF" opacity={0.95 - fade * 0.6} />
      </g>
    );
  };
  const limbs = [j.armL, j.armR, j.legL, j.legR];
  const flick = 0.85 + 0.15 * Math.sin(t * 1.7);
  return (
    <g style={{ filter: `drop-shadow(0 0 ${14 * (1 - fade)}px ${CYAN})` }} opacity={flick}>
      {limbs.map((l, i) => (
        <g key={i}>
          {bone(l.root, l.mid, i * 2)}
          {bone(l.mid, l.end, i * 2 + 1)}
        </g>
      ))}
      {bone({ x: 0, y: -2 }, { x: 0, y: -118 }, 20)}
      {[0, 1, 2, 3].map((r) => {
        const a = w({ x: -34, y: -96 + r * 18 });
        const b = w({ x: 34, y: -96 + r * 18 });
        const c = w({ x: 0, y: -84 + r * 18 });
        return <path key={`r${r}`} d={`M ${a.x} ${a.y} Q ${c.x} ${c.y + 12} ${b.x} ${b.y}`} stroke="#DFF6FF" strokeWidth={8 * pose.scale} fill="none" opacity={0.85 - fade * 0.6} />;
      })}
      {(() => {
        const h = w(j.head);
        return <circle cx={h.x} cy={h.y} r={52 * pose.scale} fill="none" stroke="#DFF6FF" strokeWidth={12 * pose.scale} opacity={0.95 - fade * 0.5} />;
      })()}
    </g>
  );
};

// S29: schematic x-ray: the body doesn't know it's a superpower
export const S29: React.FC<ShotProps> = ({ t, len }) => {
  const pose = P({ x: 960, y: 760 + Math.sin(t / 12) * 8, scale: 1.55, yaw: 0, armL: { a: 22, b: -6 }, armR: { a: 22, b: -6 }, legL: { a: 6, b: 0 }, legR: { a: -6, b: 0 } });
  return (
    <g transform={camV(960, kf(t, [[0, 620], [len, 600]]), kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Schematic t={t} id="sch29" />
      <g opacity={0.35}>
        <Hero look={LOOKS.pipInk} pose={pose} rimId="rimBlue" shadow={0} />
      </g>
      <XRay pose={pose} t={t} fade={clamp((t - 20) / 30) * 0.4} />
      {/* a scan line sweeping down */}
      <rect x={400} y={((t * 18) % 1500) - 200} width={1120} height={8} fill={CYAN} opacity={0.5} />
    </g>
  );
};

// S30: macro on the x-ray thigh bone: holes open in it; it only knows the load is gone
export const S30: React.FC<ShotProps> = ({ t, len }) => {
  const dens = 1 - 0.55 * easeInOut(clamp((t - 2) / Math.max(18, len - 6)));
  return (
    <g transform={camV(960, 560, kf(t, [[0, 1.2], [len, 1.4]]))}>
      <Schematic t={t} id="sch30" />
      <Bone x={960} y={560} s={1.5} t={t} density={dens} color={CYAN} />
      <g transform="translate(960 1180)">
        <rect x={-210} y={-50} width={420} height={100} rx={50} fill={UI.pill} opacity={0.75} />
        <text y={20} textAnchor="middle" fontFamily={FONT.ui} fontSize={54} fill={RED}>{`${Math.round(dens * 100)}%`}</text>
      </g>
    </g>
  );
};

// ================= 4b: the cost on screen =================
// S31: insert: the calendar: three weeks crossed off
export const S31: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camV(CAL.x, CAL.y + 10, kf(t, [[0, 6.6], [len, 7.2]]))}>
    <Bedroom t={t + 160} id="b31" veil={0.3} crossed={t > 6 ? 21 : 20} clock="07:10" />
    <Glow x={CAL.x} y={CAL.y} r={80} o={0.35} />
  </g>
);

// S32: medium: an ordinary landing on the stair landing
const LAND_X = 250;
export const S32: React.FC<ShotProps> = ({ t, len }) => {
  const drop = 520 * (1 - easeIn(clamp(t / 10)));
  const pose = poseAt(t, [
    { f: 0, p: { x: LAND_X, y: SW.top - LEG_LEN * 0.9, scale: 0.9, yaw: 0.35, armL: { a: 120, b: 10 }, armR: { a: 110, b: 10 }, legL: { a: 14, b: 30 }, legR: { a: -10, b: 26 } } },
    { f: 10, p: { squash: 0.16, armL: { a: 40, b: -20 }, armR: { a: 40, b: -20 }, legL: { a: 5, b: 0 }, legR: { a: -5, b: 0 } }, ease: easeOut },
    { f: 15, p: { squash: 0, tilt: 4 } },
  ]);
  return (
    <g transform={camV(LAND_X + 60, kf(t, [[0, SW.top - 200], [len, SW.top - 180]]), 2.2)}>
      <Stairwell t={t + 300} id="sw32" />
      <Hero look={PIP} pose={{ ...pose, y: pose.y - drop, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={t > 9 ? 0.5 : 0} />
      <Puff x={LAND_X} y={SW.top} t={t - 10} s={0.8} />
    </g>
  );
};

// S33: macro: the ankle, in x-ray: crack
export const S33: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(${Math.sin(t * 2.9) * 10 * clamp(1 - t / 10)} 0) ${camV(960, 700, 1.0)}`}>
    <rect x={-400} y={-400} width={2800} height={2400} fill="#0E0A14" />
    {/* the leg and shoe, huge, landing on the boards */}
    <rect x={-400} y={1300} width={2800} height={800} fill="#2A2230" />
    {Array.from({ length: 6 }).map((_, i) => (
      <path key={i} d={`M ${-400 + i * 480} 1300 L ${-400 + i * 480 - 200} 2100`} stroke="#1E1824" strokeWidth={6} />
    ))}
    <path d="M 900 -400 L 940 1100" stroke={PIP.line} strokeWidth={300} strokeLinecap="round" />
    <path d="M 900 -400 L 940 1100" stroke={PIP.limb} strokeWidth={262} strokeLinecap="round" />
    <ellipse cx={1010} cy={1220} rx={300} ry={140} fill={PIP.shoe} stroke={PIP.line} strokeWidth={16} />
    {/* the x-ray window over the ankle */}
    <g opacity={clamp((t - 1) / 3)}>
      <rect x={640} y={420} width={600} height={760} rx={30} fill="#06121E" opacity={0.92} stroke={CYAN} strokeWidth={5} />
      <g transform="translate(940 780)" style={{ filter: `drop-shadow(0 0 12px ${CYAN})` }}>
        <path d="M -60 -360 L -50 120 Q -90 200 -40 240 L 60 240 Q 110 200 60 120 L 70 -360" stroke="#DFF6FF" strokeWidth={10} fill="#DFF6FF" fillOpacity={0.15} />
        <path d="M -120 250 Q -60 320 120 300 Q 200 290 220 330" stroke="#DFF6FF" strokeWidth={10} fill="none" />
        <path d={`M -50 40 L -10 10 L -26 -20 L 20 -50 L 4 -80 L 62 -110`} stroke={RED} strokeWidth={10} fill="none" strokeLinejoin="round" strokeDasharray={260} strokeDashoffset={260 * (1 - clamp((t - 2) / 4))} style={{ filter: `drop-shadow(0 0 14px ${RED})` }} />
      </g>
    </g>
  </g>
);

// S34: close-up, low: Pip's face. The boards under him are fine.
export const S34: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: LAND_X + 40, y: SW.top - LEG_LEN * 0.9, scale: 0.9, yaw: 0.25, look: 0.2, headTilt: 16, tilt: 10, squash: 0.06, armL: { a: 30, b: -40 }, armR: { a: 36, b: -50 } } },
    { f: 8, p: { headTilt: 22, tilt: 14 } },
  ]);
  const head = toWorld(pose, { x: 0, y: -176 });
  return (
    <g transform={camV(head.x + 20, head.y + 110, kf(t, [[0, 3.2], [len, 3.5]]))}>
      <Stairwell t={t + 330} id="sw34" />
      <rect x={-400} y={-600} width={2800} height={2400} fill="#2A0010" opacity={0.25} style={{ mixBlendMode: 'multiply' }} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [10, 'worried']]) }} rimId="rimRed" shadow={0} />
    </g>
  );
};
