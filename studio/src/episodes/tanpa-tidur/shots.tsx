import React from 'react';
import {
  Hero,
  poseAt,
  kf,
  clamp,
  faceAt,
  LOOKS,
  camT,
  TitleCard,
  Study,
  Desk,
  Rooftop,
  Glow,
  ShotProps,
  FONT,
} from '../../engine';
import { Bedroom } from '../../engine/sets/bedroom';
import { Schematic, SCH } from '../../engine/sets/schematic';

const PIP = LOOKS.pipHood;
const SIS = LOOKS.sis;
const SUIT = LOOKS.suit;

// ---------- S1: Jam 3 pagi, Pip di kamar menatap laptop ----------
export const S1: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 720, yaw: 0.3, armL: { a: 25, b: 0 }, armR: { a: 45, b: -10 }, look: 0.4 } },
    { f: 60, p: { armR: { a: 55, b: -5 } } },
  ]);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 0.95], [60, 1.0]]))}>
      <Study t={t} id="s1" veil={0.45} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} shadow={0.4} rimId="rimR" />
      <Desk x0={580} x1={1340} y={710} />
      {/* Laptop screen glow */}
      <rect x={880} y={630} width={140} height={85} rx={4} fill="#62C2FF" opacity={0.85} />
      <Glow x={950} y={670} r={180} kind="cool" o={0.3} />
      {/* 03:00 Digital clock */}
      <text x={650} y={660} fontFamily={FONT.ui} fontSize={28} fill="#38EF7D" opacity={0.85}>03:00</text>
    </g>
  );
};

// ---------- S2: Close-up cahaya layar menatap laptop ----------
export const S2: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 960, y: 780, yaw: 0.1 } }]);
  return (
    <g transform={camT(960, 480, 1.6)}>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#0D111E" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [15, 'happy']]) }} shadow={0} />
      <Glow x={960} y={540} r={280} kind="cool" o={0.45} />
    </g>
  );
};

// ---------- S3: Close-up Pip segar bugar ----------
export const S3: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 960, y: 760, yaw: 0, armL: { a: 20, b: 0 }, armR: { a: 20, b: 0 } } }]);
  return (
    <g transform={camT(960, 460, 1.7)}>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#141829" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} shadow={0} />
      <Glow x={960} y={380} r={200} kind="warm" o={0.25} />
    </g>
  );
};

// ---------- S4: Jam 5 subuh, meja belajar penuh buku ----------
export const S4: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 710, yaw: 0.2, armL: { a: 30, b: 0 }, armR: { a: 50, b: 10 } } },
    { f: 55, p: { armR: { a: 60, b: 5 } } },
  ]);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Study t={t} id="s4" veil={0.35} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} shadow={0.4} />
      <Desk x0={560} x1={1360} y={700} />
      {/* 05:00 Digital clock */}
      <text x={640} y={660} fontFamily={FONT.ui} fontSize={28} fill="#38EF7D" opacity={0.85}>05:00</text>
      {/* Stack of books */}
      <rect x={1120} y={640} width={120} height={20} fill="#B24939" rx={2} />
      <rect x={1110} y={660} width={135} height={20} fill="#2A5C8A" rx={2} />
      <rect x={1105} y={680} width={145} height={20} fill="#4E8C4A" rx={2} />
    </g>
  );
};

// ---------- S5: Macro top-down buku tebal dibaca ----------
export const S5: React.FC<ShotProps> = ({ t }) => {
  const flip = clamp(t / 20);
  return (
    <g transform={camT(960, 540, 1.2)}>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#18151D" />
      {/* Open book */}
      <rect x={660} y={340} width={300} height={400} fill="#F4EFE6" rx={6} />
      <rect x={960} y={340} width={300} height={400} fill="#E9E2D5" rx={6} />
      <line x1={960} y1={340} x2={960} y2={740} stroke="#44392E" strokeWidth={5} />
      {/* Lines of text */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <React.Fragment key={i}>
          <line x1={700} y1={390 + i * 45} x2={920} y2={390 + i * 45} stroke="#3A3226" strokeWidth={6} opacity={0.7} />
          <line x1={1000} y1={390 + i * 45} x2={1220} y2={390 + i * 45} stroke="#3A3226" strokeWidth={6} opacity={0.7} />
        </React.Fragment>
      ))}
      {/* Flipping page indicator */}
      <path d={`M 960 340 Q ${960 + 120 * (1 - flip)} 540 960 740`} stroke="#2B2217" strokeWidth={3} fill="none" opacity={0.4} />
    </g>
  );
};

// ---------- S6: Pip menutup buku dengan puas ----------
export const S6: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 960, y: 730, yaw: 0, armL: { a: 20, b: 0 }, armR: { a: 30, b: -20 } } }]);
  return (
    <g transform={camT(960, 520, 1.15)}>
      <Study t={t} id="s6" veil={0.3} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} shadow={0.4} />
      <Desk x0={560} x1={1360} y={700} />
    </g>
  );
};

// ---------- S7: Jam 6 pagi menatap luar jendela ----------
export const S7: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 1180, y: 750, yaw: -0.4, armL: { a: 10, b: 0 }, armR: { a: 10, b: 0 } } }]);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Bedroom t={t} id="s7" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} shadow={0.5} />
    </g>
  );
};

// ---------- S8: Seluruh kota terlelap sunyi ----------
export const S8: React.FC<ShotProps> = ({ t }) => {
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [100, 1.05]]))}>
      <Rooftop t={t} clock={false} sunY={800} spin={0} red={0} crack={0} />
      <Glow x={960} y={400} r={350} kind="cool" o={0.25} />
    </g>
  );
};

// ---------- S9: TITLE CARD ROOFTOP ----------
export const S9: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 960, y: 780, yaw: 0, armL: { a: 20, b: 0 }, armR: { a: 20, b: 0 } } }]);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Rooftop t={t} clock={false} sunY={650} spin={0} red={0} crack={0} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} shadow={0.5} />
      <TitleCard t={t} lines={['GIMANA KALAU KAMU GAK', 'PERNAH BUTUH TIDUR?']} accent="TIDUR" accentT={30} />
    </g>
  );
};

// ---------- S10: 8 jam ekstra, jam berputar ----------
export const S10: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 960, y: 730, yaw: 0.1, armL: { a: 45, b: 10 }, armR: { a: 45, b: -10 } } }]);
  return (
    <g transform={camT(960, 520, 1.1)}>
      <Study t={t} id="s10" veil={0.2} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} shadow={0.4} />
      <Desk x0={560} x1={1360} y={700} />
      {/* Big glowing +8 HOURS */}
      <text x={960} y={420} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={82} fill="#FFE27A" stroke="#1F1A2E" strokeWidth={8} paintOrder="stroke">
        +8 JAM EKSTRA
      </text>
    </g>
  );
};

// ---------- S11: Schematic Sepertiga Hidup Manusia ----------
export const S11: React.FC<ShotProps> = ({ t }) => {
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Schematic t={t} id="sch11" />
      <circle cx={960} cy={540} r={220} fill="none" stroke={SCH.dim} strokeWidth={6} />
      {/* 1/3 pie segment (sleep) in orange */}
      <path d="M 960 540 L 960 320 A 220 220 0 0 1 1150 650 Z" fill={SCH.live} opacity={0.8} />
      <text x={960} y={240} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fill="#F6EFE3">
        1/3 HIDUP MANUSIA = TIDUR (33%)
      </text>
      <text x={1120} y={520} fontFamily={FONT.ui} fontSize={28} fill="#FFE3A8">
        SEKARANG MILIKMU
      </text>
    </g>
  );
};

// ---------- S12: Close up Pip sekarang milikmu seutuhnya ----------
export const S12: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 960, y: 760, yaw: 0, armL: { a: 15, b: 0 }, armR: { a: 15, b: 0 } } }]);
  return (
    <g transform={camT(960, 480, 1.5)}>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#141828" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} shadow={0} />
    </g>
  );
};

// ---------- S13: Menguasai 3 bahasa baru ----------
export const S13: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 960, y: 720, yaw: 0.2, armL: { a: 35, b: 0 }, armR: { a: 45, b: 0 } } }]);
  return (
    <g transform={camT(960, 520, 1.05)}>
      <Study t={t} id="s13" veil={0.15} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} shadow={0.4} />
      <Desk x0={560} x1={1360} y={700} />
      {/* Language tags */}
      {['ENGLISH', '日本語', 'DEUTSCH'].map((lang, idx) => (
        <g key={idx} transform={`translate(${720 + idx * 240} 380)`}>
          <rect x={-90} y={-30} width={180} height={60} rx={12} fill="#273859" stroke="#62C2FF" strokeWidth={3} />
          <text textAnchor="middle" y={10} fontFamily={FONT.ui} fontSize={26} fill="#F6EFE3">{lang}</text>
        </g>
      ))}
    </g>
  );
};

// ---------- S14: Ratusan proyek selesai tanpa lelah ----------
export const S14: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 960, y: 720, yaw: 0, armL: { a: 60, b: 10 }, armR: { a: 60, b: -10 } } }]);
  return (
    <g transform={camT(960, 500, 1.1)}>
      <Study t={t} id="s14" veil={0.15} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} shadow={0.4} />
      <Desk x0={560} x1={1360} y={700} />
      <text x={960} y={360} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#5CFF95" stroke="#122E1A" strokeWidth={6} paintOrder="stroke">
        100% PRODUKTIF
      </text>
    </g>
  );
};

// ---------- S15: THE TURN: Lampu berkedip, bayangan merah ----------
export const S15: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 960, y: 770, yaw: 0, armL: { a: 20, b: 0 }, armR: { a: 20, b: 0 } } }]);
  return (
    <g transform={camT(960, 480, kf(t, [[0, 1.3], [60, 1.45]]))}>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#200B11" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried']]) }} shadow={0} />
      <Glow x={960} y={500} r={280} kind="red" o={0.4} />
    </g>
  );
};

// ---------- S16: Aturan mutlak tubuh manusia ----------
export const S16: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 960, y: 750, yaw: 0.1, armL: { a: 15, b: 0 }, armR: { a: 15, b: 0 } } }]);
  return (
    <g transform={camT(960, 520, 1.1)}>
      <Bedroom t={t} id="s16" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried']]) }} shadow={0.5} />
    </g>
  );
};

// ---------- S17: Schematic Sistem Glimfatik Otak ----------
export const S17: React.FC<ShotProps> = ({ t }) => {
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Schematic t={t} id="sch17" />
      {/* Brain contour */}
      <path d="M 800 480 Q 750 380 860 320 Q 960 280 1060 320 Q 1170 380 1120 480 Q 1160 580 1060 660 Q 960 700 860 660 Q 760 580 800 480 Z" fill="none" stroke={SCH.line} strokeWidth={5} />
      <text x={960} y={240} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#F6EFE3">
        SISTEM GLIMFATIK (GLYMPHATIC SYSTEM)
      </text>
      <text x={960} y={520} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill="#62C2FF">
        PEMBERSIHAN CAIRAN CSF
      </text>
    </g>
  );
};

// ---------- S18: Sel menyusut 60% ----------
export const S18: React.FC<ShotProps> = ({ t }) => {
  const shrink = kf(t, [[0, 1.0], [50, 0.4]]);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Schematic t={t} id="sch18" />
      <circle cx={960} cy={520} r={180 * shrink} fill={SCH.live} opacity={0.8} />
      <text x={960} y={260} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={64} fill="#FF8A3D">
        MENYUSUT -60%
      </text>
      <text x={960} y={800} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#E2DCD2">
        UNTUK MENYAPU RACUN METABOLIK
      </text>
    </g>
  );
};

// ---------- S19: Limbah racun beta-amiloid menumpuk ----------
export const S19: React.FC<ShotProps> = ({ t }) => {
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Schematic t={t} id="sch19" />
      {/* Toxic particles accumulating */}
      {[
        [840, 460], [920, 520], [1020, 480], [890, 600], [1060, 580],
        [800, 540], [1120, 500], [980, 420], [950, 640]
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={18} fill="#FF3344" />
      ))}
      <text x={960} y={260} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#FF5252">
        RACUN BETA-AMILOID MENUMPUK
      </text>
      <text x={960} y={760} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill="#F6EFE3">
        MERUSAK MILIARAN NEURON
      </text>
    </g>
  );
};

// ---------- S20: Extreme close-up: "Itu nyata." ----------
export const S20: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 960, y: 750, yaw: 0, armL: { a: 10, b: 0 }, armR: { a: 10, b: 0 } } }]);
  return (
    <g transform={camT(960, 460, 1.8)}>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#0A0D18" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried']]) }} shadow={0} />
      <text x={960} y={320} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3" stroke="#000" strokeWidth={6} paintOrder="stroke">
        ITU NYATA.
      </text>
    </g>
  );
};

// ---------- S21: Halusinasi bayangan merayap di dinding ----------
export const S21: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 1050, y: 760, yaw: -0.3, armL: { a: 25, b: 10 }, armR: { a: 25, b: 10 } } }]);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Bedroom t={t} id="s21" />
      {/* Creeping shadow figures */}
      <path d={`M 500 700 Q ${520 + Math.sin(t * 0.2) * 20} 500 560 380 Q 600 500 620 700 Z`} fill="#070911" opacity={0.8} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock']]) }} shadow={0.5} />
    </g>
  );
};

// ---------- S22: Melihat ke bawah jendela ----------
export const S22: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 1200, y: 750, yaw: -0.5, armL: { a: 10, b: 0 }, armR: { a: 10, b: 0 } } }]);
  return (
    <g transform={camT(960, 540, 1.1)}>
      <Bedroom t={t} id="s22" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried']]) }} shadow={0.4} />
    </g>
  );
};

// ---------- S23: Mobil hitam dan pria berjas di jalan ----------
export const S23: React.FC<ShotProps> = ({ t }) => {
  const suitPose = poseAt(t, [{ f: 0, p: { x: 1240, y: 720, yaw: -0.4, armL: { a: 10, b: 0 }, armR: { a: 30, b: -20 } } }]);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#111520" />
      {/* Street line */}
      <rect x={0} y={720} width={1920} height={360} fill="#1E2333" />
      {/* Black car */}
      <rect x={600} y={640} width={440} height={120} rx={16} fill="#06080E" stroke="#252F47" strokeWidth={3} />
      <circle cx={700} cy={760} r={42} fill="#0A0E18" stroke="#3D4B6E" strokeWidth={5} />
      <circle cx={940} cy={760} r={42} fill="#0A0E18" stroke="#3D4B6E" strokeWidth={5} />
      {/* Man in suit watching */}
      <Hero look={SUIT} pose={{ ...suitPose, ...faceAt(t, [[0, 'neutral']]) }} shadow={0.4} />
    </g>
  );
};

// ---------- S24: Adik perempuan menatap dari pintu ----------
export const S24: React.FC<ShotProps> = ({ t }) => {
  const sisPose = poseAt(t, [{ f: 0, p: { x: 620, y: 760, yaw: 0.4, armL: { a: 10, b: 0 }, armR: { a: 10, b: 0 } } }]);
  return (
    <g transform={camT(960, 540, 1.1)}>
      <Bedroom t={t} id="s24" />
      {/* Sister standing at doorway */}
      <Hero look={SIS} pose={{ ...sisPose, ...faceAt(t, [[0, 'worried']]) }} shadow={0.4} />
    </g>
  );
};

// ---------- S25: Pip berdiri di sudut gelap tak berkedip ----------
export const S25: React.FC<ShotProps> = ({ t }) => {
  const pipPose = poseAt(t, [{ f: 0, p: { x: 1280, y: 760, yaw: -0.3, armL: { a: 5, b: 0 }, armR: { a: 5, b: 0 } } }]);
  const sisPose = poseAt(t, [{ f: 0, p: { x: 580, y: 760, scale: 0.8, yaw: 0.4 } }]);
  return (
    <g transform={camT(960, 540, 1.05)}>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#070912" />
      <Hero look={PIP} pose={{ ...pipPose, ...faceAt(t, [[0, 'neutral']]) }} shadow={0} />
      {/* Sister in background */}
      <Hero look={SIS} pose={{ ...sisPose, ...faceAt(t, [[0, 'worried']]) }} shadow={0} />
    </g>
  );
};

// ---------- S26: Extreme close-up mata Pip terbuka lebar, cliffhanger ----------
export const S26: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 960, y: 750, yaw: 0, armL: { a: 5, b: 0 }, armR: { a: 5, b: 0 } } }]);
  return (
    <g transform={camT(960, 480, kf(t, [[0, 1.8], [110, 2.2]]))}>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#05070D" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]) }} shadow={0} />
      <Glow x={960} y={440} r={160} kind="red" o={0.5} />
      <text x={960} y={300} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#FF4455" stroke="#000" strokeWidth={6} paintOrder="stroke">
        BERAPA LAMA KAMU BERTAHAN?
      </text>
    </g>
  );
};
