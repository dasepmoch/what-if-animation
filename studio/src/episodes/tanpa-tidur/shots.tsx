import React from 'react';
import {
  Hero,
  poseAt,
  kf,
  clamp,
  lerp,
  easeOut,
  easeIn,
  backOut,
  faceAt,
  LOOKS,
  camT,
  TitleCard,
  Study,
  Desk,
  Rooftop,
  Bedroom,
  Schematic,
  SCH,
  Glow,
  Sparkle,
  FocusRings,
  Tag,
  AlarmClock,
  LaptopBack,
  OpenBook,
  BookTower,
  PaperStack,
  WallCalendar,
  WallClock,
  ShotProps,
  FONT,
  C,
} from '../../engine';

const PIP = LOOKS.pipHood;
const SIS = LOOKS.sis;
const SUIT = LOOKS.suit;

// ---------- S1: Jam 3 pagi, Pip di kamar menatap laptop ----------
export const S1: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    {
      f: 0,
      p: {
        x: 960,
        y: 720,
        yaw: 0.35,
        armL: { a: 30 + Math.sin(t * 1.6) * 6, b: 0 },
        armR: { a: 45 + Math.cos(t * 1.6) * 6, b: -10 },
        look: 0.4,
      },
    },
  ]);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 0.95], [60, 1.0]]))}>
      <Bedroom t={t} id="s1" veil={0.5} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'smug']]) }} shadow={0.4} rimId="rimR" />
      <Desk x0={580} x1={1340} y={710} />
      <LaptopBack x={960} y={700} w={190} glow={1} />
      <Glow x={960} y={640} r={220} kind="cool" o={0.45} />
      <AlarmClock x={650} y={680} text="03:00" s={0.85} on={1} />
    </g>
  );
};

// ---------- S2: Close-up menatap layar laptop bercahaya ----------
export const S2: React.FC<ShotProps> = ({ t }) => {
  const flicker = 0.85 + Math.sin(t * 2.5) * 0.15;
  return (
    <g transform={camT(960, 480, kf(t, [[0, 1.35], [29, 1.45]]))}>
      <Study t={t} id="s2" veil={0.7} />
      <Hero
        look={PIP}
        pose={{
          ...poseAt(t, [{ f: 0, p: { x: 960, y: 700, yaw: 0.1, armL: { a: 40, b: 0 }, armR: { a: 40, b: 0 }, look: 0.1 } }]),
          ...faceAt(t, [[0, 'cool']]),
        }}
        shadow={0}
      />
      {/* Intense cool monitor illumination */}
      <rect x={760} y={480} width={400} height={260} rx={8} fill="#24B2FF" opacity={0.25 * flicker} />
      <Glow x={960} y={540} r={280} kind="cool" o={0.6 * flicker} />
      {/* Code / Data matrix reflection lines */}
      {[0, 1, 2, 3, 4].map((i) => {
        const y = 460 + i * 28 + ((t * 8) % 140);
        return (
          <line
            key={i}
            x1={860}
            y1={y}
            x2={1060 - i * 20}
            y2={y}
            stroke="#A3E5FF"
            strokeWidth={4}
            opacity={0.45}
            strokeDasharray="12 8"
          />
        );
      })}
    </g>
  );
};

// ---------- S3: Segar bugar, senyum percaya diri ----------
export const S3: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 700, yaw: 0, armL: { a: -40, b: 20 }, armR: { a: 40, b: -20 }, look: 0 } },
    { f: 15, p: { armL: { a: -55, b: 35 }, armR: { a: 55, b: -35 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.05], [34, 1.1]]))}>
      <Bedroom t={t} id="s3" veil={0.35} />
      <Glow x={960} y={500} r={260} kind="warm" o={0.35} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} shadow={0.3} rimId="rimL" />
      <Sparkle x={820} y={400} t={t} s={1.3} />
      <Sparkle x={1100} y={360} t={t + 6} s={1.5} />
      <Sparkle x={960} y={320} t={t + 12} s={1.1} />
    </g>
  );
};

// ---------- S4: Jam 5 subuh, meja belajar, tumpukan buku ----------
export const S4: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 720, yaw: 0.2, armL: { a: 20, b: 10 }, armR: { a: 35, b: -15 }, look: 0.3 } },
    { f: 30, p: { yaw: -0.15, look: -0.2 } },
    { f: 55, p: { yaw: 0.2, look: 0.3 } },
  ]);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 0.95], [55, 1.0]]))}>
      <Study t={t} id="s4" veil={0.4} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} shadow={0.3} />
      <Desk x0={540} x1={1380} y={710} />
      <BookTower x={1240} y={700} n={6} s={0.9} />
      <OpenBook x={960} y={700} w={230} turn={Math.sin(t * 0.5) > 0 ? 0.3 : 0} cover="#8A3B3B" />
      <AlarmClock x={630} y={680} text="05:00" s={0.85} on={1} />
    </g>
  );
};

// ---------- S5: Macro insert, top-down buku tebal ----------
export const S5: React.FC<ShotProps> = ({ t }) => {
  const scanX = lerp(680, 1240, clamp(t / 22));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.1], [25, 1.15]]))}>
      {/* Wood desk surface */}
      <rect x={400} y={150} width={1120} height={780} fill="#4E332A" />
      {/* Thick book open */}
      <rect x={600} y={260} width={720} height={520} rx={12} fill="#EDE6D6" stroke="#2B1810" strokeWidth={8} />
      <line x1={960} y1={260} x2={960} y2={780} stroke="#9C8B7A" strokeWidth={5} />
      {/* Book title and lines of text */}
      <text x={640} y={320} fontFamily={FONT.title} fontSize={28} fill="#2B1810" fontWeight="bold">
        BAB V: NEUROSAINS LANJUTAN
      </text>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <React.Fragment key={i}>
          <line x1={640} y1={360 + i * 36} x2={920} y2={360 + i * 36} stroke="#6E5D4E" strokeWidth={4} />
          <line x1={1000} y1={360 + i * 36} x2={1280} y2={360 + i * 36} stroke="#6E5D4E" strokeWidth={4} />
        </React.Fragment>
      ))}
      {/* Animated glowing highlight speed line */}
      <rect x={640} y={426} width={scanX - 640} height={20} fill="#FFDF00" opacity={0.4} rx={3} />
      <Sparkle x={scanX} y={436} t={t} s={1.1} />
    </g>
  );
};

// ---------- S6: Pip menutup buku dengan puas ----------
export const S6: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 710, yaw: 0, armL: { a: 25, b: 0 }, armR: { a: 30, b: 0 }, look: 0 } },
    { f: 12, p: { armL: { a: -35, b: 50 }, armR: { a: 35, b: -50 } }, ease: backOut },
  ]);
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [40, 1.05]]))}>
      <Study t={t} id="s6" veil={0.3} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'smug']]) }} shadow={0.3} />
      <Desk x0={560} x1={1360} y={710} />
      <Tag x={960} y={320} t={t} text="100% PAHAM" />
      <Sparkle x={860} y={340} t={t} s={1.2} />
      <Sparkle x={1060} y={340} t={t + 4} s={1.2} />
    </g>
  );
};

// ---------- S7: Jam 6 pagi, menatap luar jendela ----------
export const S7: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 720, yaw: 0.6, armL: { a: 15, b: 0 }, armR: { a: -15, b: 0 }, look: 0.7 } },
  ]);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 0.95], [45, 1.0]]))}>
      <Bedroom t={t} id="s7" veil={0.25} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} shadow={0.35} />
      <AlarmClock x={640} y={680} text="06:00" s={0.85} on={1} />
    </g>
  );
};

// ---------- S8: Seluruh kota masih terlelap seperti orang mati ----------
export const S8: React.FC<ShotProps> = ({ t }) => {
  return (
    <g transform={camT(960, 540, kf(t, [[0, 0.9], [106, 0.98]]))}>
      <Rooftop t={t} />
      {/* Night sleeping city silhouette backdrop */}
      <rect x={-200} y={500} width={2320} height={600} fill="#11131A" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const bx = 100 + i * 230;
        const bh = 180 + ((i * 47) % 140);
        return (
          <rect key={i} x={bx} y={700 - bh} width={180} height={bh} fill="#0A0C12" stroke="#161A24" strokeWidth={3} />
        );
      })}
      {/* All dark windows */}
      {Array.from({ length: 24 }).map((_, i) => {
        const wx = 140 + (i % 8) * 230 + ((i % 2) * 40);
        const wy = 560 + Math.floor(i / 8) * 50;
        return <rect key={i} x={wx} y={wy} width={24} height={32} fill="#141822" opacity={0.6} rx={2} />;
      })}
      {/* Cool misty night air */}
      <ellipse cx={960} cy={760} rx={700} ry={80} fill="#1A2838" opacity={0.25} />
    </g>
  );
};

// ---------- S9: TITLE CARD: Gimana kalau gak pernah butuh tidur? ----------
export const S9: React.FC<ShotProps> = ({ t }) => {
  const shake = t < 12 ? Math.sin(t * 2.2) * 8 * Math.exp(-t / 6) : 0;
  return (
    <g transform={`translate(${shake} 0)`}>
      <g transform={camT(960, 540, kf(t, [[0, 0.95], [10, 1.05], [135, 1.08]]))}>
        <Rooftop t={t} />
        <TitleCard
          lines={['GIMANA KALAU KAMU GAK', 'PERNAH BUTUH TIDUR?']}
          accent="TIDUR"
          t={t}
        />
        {t > 10 && t < 30 && <FocusRings x={960} y={540} t={t} />}
      </g>
    </g>
  );
};

// ---------- S10: 8 jam ekstra, jam berputar cepat ----------
export const S10: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 720, yaw: 0, armL: { a: -30, b: 30 }, armR: { a: 30, b: -30 }, look: 0 } },
    { f: 40, p: { armL: { a: -50, b: 45 }, armR: { a: 50, b: -45 } } },
  ]);
  const rot = t * 24;
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [75, 1.05]]))}>
      <Study t={t} id="s10" veil={0.3} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'cool']]) }} shadow={0.3} />
      {/* Giant spinning clock dial */}
      <g transform="translate(960 300)">
        <circle cx={0} cy={0} r={110} fill="#1D2433" stroke="#486581" strokeWidth={8} />
        <line x1={0} y1={0} x2={0} y2={-70} stroke="#FFD166" strokeWidth={6} strokeLinecap="round" transform={`rotate(${rot})`} />
        <line x1={0} y1={0} x2={0} y2={-50} stroke="#F4F1EA" strokeWidth={8} strokeLinecap="round" transform={`rotate(${rot / 12})`} />
        <circle cx={0} cy={0} r={12} fill="#FFD166" />
      </g>
      <Tag x={960} y={450} t={t} text="+8 JAM EKSTRA SETIAP HARI" />
    </g>
  );
};

// ---------- S11: Diagram sepertiga waktu hidup manusia ----------
export const S11: React.FC<ShotProps> = ({ t }) => {
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Schematic t={t} id="s11" />
      <text x={960} y={260} fontFamily={FONT.title} fontSize={46} fill={SCH.live} textAnchor="middle" fontWeight="bold">
        SEPERTIGA HIDUP MANUSIA
      </text>
      {/* 24-hour timeline bar */}
      <rect x={460} y={360} width={1000} height={100} rx={16} fill="#1F2937" stroke="#374151" strokeWidth={6} />
      {/* Awake portion: 16 hours */}
      <rect x={460} y={360} width={666} height={100} rx={16} fill="#3B82F6" />
      <text x={790} y={424} fontFamily={FONT.ui} fontSize={32} fill="#FFFFFF" textAnchor="middle" fontWeight="bold">
        AKTIF (16 JAM)
      </text>
      {/* Sleep portion: 8 hours */}
      <rect x={1126} y={360} width={334} height={100} rx={16} fill="#EF4444" opacity={0.85} />
      <text x={1290} y={424} fontFamily={FONT.ui} fontSize={32} fill="#FFFFFF" textAnchor="middle" fontWeight="bold">
        TIDUR (8 JAM)
      </text>
      {/* Cross out sleep and turn to gold */}
      {t > 15 && (
        <>
          <line x1={1136} y1={370} x2={1450} y2={450} stroke="#FFD700" strokeWidth={10} strokeLinecap="round" />
          <line x1={1136} y1={450} x2={1450} y2={370} stroke="#FFD700" strokeWidth={10} strokeLinecap="round" />
          <text x={960} y={560} fontFamily={FONT.title} fontSize={48} fill="#FFD700" textAnchor="middle" fontWeight="bold">
            +25 TAHUN WAKTU TAMBAHAN
          </text>
        </>
      )}
    </g>
  );
};

// ---------- S12: Waktu sekarang milikmu seutuhnya ----------
export const S12: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 700, yaw: 0, armL: { a: -30, b: 20 }, armR: { a: 30, b: -20 }, look: 0 } },
  ]);
  return (
    <g transform={camT(960, 500, kf(t, [[0, 1.1], [74, 1.15]]))}>
      <Study t={t} id="s12" veil={0.25} />
      <Glow x={960} y={480} r={320} kind="warm" o={0.45} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'cool']]) }} shadow={0.3} rimId="rimL" />
      <Sparkle x={840} y={380} t={t} s={1.4} />
      <Sparkle x={1080} y={380} t={t + 6} s={1.4} />
    </g>
  );
};

// ---------- S13: Menguasai 3 bahasa baru ----------
export const S13: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 720, yaw: 0, armL: { a: -40, b: 30 }, armR: { a: 40, b: -30 }, look: 0 } },
  ]);
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [62, 1.05]]))}>
      <Study t={t} id="s13" veil={0.3} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} shadow={0.3} />
      {/* Speech bubbles */}
      <Tag x={680} y={340} t={t} text="🇫🇷 Bonjour!" />
      <Tag x={960} y={260} t={t} text="🇯🇵 こんにちは!" />
      <Tag x={1240} y={340} t={t} text="🇪🇸 ¡Hola!" />
      <Sparkle x={680} y={300} t={t} s={1.2} />
      <Sparkle x={1240} y={300} t={t + 5} s={1.2} />
    </g>
  );
};

// ---------- S14: Ratusan proyek selesai tanpa lelah ----------
export const S14: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 720, yaw: 0, armL: { a: 35 + Math.sin(t * 3) * 12, b: 0 }, armR: { a: 45 + Math.cos(t * 3) * 12, b: 0 }, look: 0 } },
  ]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 0.95], [69, 1.0]]))}>
      <Study t={t} id="s14" veil={0.3} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'smug']]) }} shadow={0.3} />
      <Desk x0={500} x1={1420} y={710} />
      <PaperStack x={640} y={700} n={8} w={200} />
      <PaperStack x={1280} y={700} n={9} w={200} />
      <Tag x={960} y={340} t={t} text="100+ PROYEK SELESAI" />
    </g>
  );
};

// ---------- S15: The Turn: Lampu berkedip, bayangan merah ----------
export const S15: React.FC<ShotProps> = ({ t }) => {
  const flicker = Math.sin(t * 1.8) > 0 ? 0.35 : 0.85;
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 710, yaw: 0.1, armL: { a: 15, b: 0 }, armR: { a: 20, b: 0 }, look: 0 } },
    { f: 30, p: { yaw: 0, armL: { a: 5, b: 0 }, armR: { a: 5, b: 0 } } },
  ]);
  return (
    <g transform={camT(960, 500, kf(t, [[0, 1.05], [62, 1.15]]))}>
      <Bedroom t={t} id="s15" veil={0.6 * flicker} />
      <rect x={-200} y={-200} width={2320} height={1500} fill="#3A0808" opacity={0.4} />
      <Glow x={960} y={500} r={280} kind="red" o={0.5} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried']]) }} shadow={0.5} rimId="rimR" />
    </g>
  );
};

// ---------- S16: Aturan mutlak tubuh manusia ----------
export const S16: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 720, yaw: 0, armL: { a: -30, b: 70 }, armR: { a: 30, b: -70 }, look: 0 } },
  ]);
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.1], [67, 1.18]]))}>
      <Bedroom t={t} id="s16" veil={0.65} />
      <Glow x={960} y={440} r={240} kind="red" o={0.6} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]) }} shadow={0.5} />
    </g>
  );
};

// ---------- S17: Schematic: Sistem glimfatik otak bekerja ----------
export const S17: React.FC<ShotProps> = ({ t }) => {
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Schematic t={t} id="s17" />
      <text x={960} y={240} fontFamily={FONT.title} fontSize={44} fill={SCH.glow} textAnchor="middle" fontWeight="bold">
        SISTEM GLIMFATIK OTAK
      </text>
      {/* Brain anatomical outline */}
      <path
        d="M 720 540 Q 700 380 840 340 Q 960 300 1080 340 Q 1220 380 1200 540 Q 1200 660 1080 700 Q 960 720 840 700 Q 720 660 720 540 Z"
        fill="#1E2838"
        stroke="#486581"
        strokeWidth={8}
      />
      {/* Cerebrospinal Fluid (CSF) Flow channels */}
      {[0, 1, 2, 3].map((i) => {
        const offset = ((t * 6 + i * 40) % 180);
        return (
          <path
            key={i}
            d={`M 800 ${420 + i * 60} Q 960 ${400 + i * 60} 1120 ${420 + i * 60}`}
            stroke="#38EF7D"
            strokeWidth={6}
            fill="none"
            strokeDasharray="20 15"
            strokeDashoffset={-offset}
          />
        );
      })}
      <text x={960} y={620} fontFamily={FONT.ui} fontSize={30} fill="#38EF7D" textAnchor="middle">
        ALIRAN CAIRAN SEREBROSPINAL (CSF)
      </text>
    </g>
  );
};

// ---------- S18: Macro insert: Sel menyusut 60% membilas racun ----------
export const S18: React.FC<ShotProps> = ({ t }) => {
  const shrink = lerp(1.0, 0.4, clamp(t / 60)); // shrinks by 60%!
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Schematic t={t} id="s18" />
      <text x={960} y={230} fontFamily={FONT.title} fontSize={40} fill="#38EF7D" textAnchor="middle" fontWeight="bold">
        SAAT TIDUR: SEL MENYUSUT -60%
      </text>
      {/* Shrinking interstitial brain cells */}
      {[-180, 0, 180].map((dx, i) => (
        <circle
          key={i}
          cx={960 + dx}
          cy={500}
          r={110 * shrink}
          fill="#2C3B50"
          stroke="#5B7898"
          strokeWidth={6}
        />
      ))}
      {/* Rushing fluid washing away waste */}
      <path
        d="M 500 660 L 1420 660"
        stroke="#62C2FF"
        strokeWidth={16}
        strokeDasharray="40 25"
        strokeDashoffset={-t * 14}
        strokeLinecap="round"
      />
      <text x={960} y={740} fontFamily={FONT.ui} fontSize={32} fill="#A3E5FF" textAnchor="middle">
        MEMBILAS RACUN METABOLIK
      </text>
    </g>
  );
};

// ---------- S19: Limbah racun beta-amiloid menumpuk ----------
export const S19: React.FC<ShotProps> = ({ t }) => {
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Schematic t={t} id="s19" />
      <rect x={-200} y={-200} width={2320} height={1500} fill="#330005" opacity={0.45} />
      <text x={960} y={230} fontFamily={FONT.title} fontSize={42} fill="#FF4757" textAnchor="middle" fontWeight="bold">
        TANPA TIDUR: RACUN BETA-AMILOID MENUMPUK
      </text>
      {/* Plaque accumulation clumping around neurons */}
      {Array.from({ length: 18 }).map((_, i) => {
        const px = 620 + ((i * 73) % 680);
        const py = 360 + ((i * 47) % 280);
        const r = 24 + ((i * 13) % 26);
        return (
          <circle key={i} cx={px} cy={py} r={r} fill="#800010" stroke="#FF4757" strokeWidth={4} opacity={0.85} />
        );
      })}
      <text x={960} y={730} fontFamily={FONT.ui} fontSize={32} fill="#FFA2A2" textAnchor="middle" fontWeight="bold">
        MERUSAK MILIARAN NEURON SECARA PERMANEN
      </text>
    </g>
  );
};

// ---------- S20: Pip menatap tajam: Itu nyata ----------
export const S20: React.FC<ShotProps> = ({ t }) => {
  return (
    <g transform={camT(960, 480, kf(t, [[0, 1.3], [58, 1.4]]))}>
      <rect x={-200} y={-200} width={2320} height={1500} fill="#0A080D" />
      <Glow x={960} y={480} r={280} kind="red" o={0.65} />
      <Hero
        look={PIP}
        pose={{
          ...poseAt(t, [{ f: 0, p: { x: 960, y: 700, yaw: 0, armL: { a: 10, b: 0 }, armR: { a: 10, b: 0 }, look: 0 } }]),
          ...faceAt(t, [[0, 'shock']]),
        }}
        shadow={0.5}
      />
      <text x={960} y={320} fontFamily={FONT.title} fontSize={56} fill="#FF2E44" textAnchor="middle" fontWeight="bold">
        ITU NYATA.
      </text>
    </g>
  );
};

// ---------- S21: Halusinasi mulai merayap di dinding ----------
export const S21: React.FC<ShotProps> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 720, yaw: 0.3, armL: { a: 30, b: 20 }, armR: { a: -30, b: -20 }, look: 0.4 } },
  ]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 0.95], [64, 1.0]]))}>
      <Bedroom t={t} id="s21" veil={0.7} />
      <WallCalendar x={1320} y={420} w={260} crossed={28} rot={-4} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried']]) }} shadow={0.5} />
      {/* Shadow tendrils creeping */}
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M ${400 + i * 160} 900 Q ${480 + i * 160 + Math.sin(t * 0.3 + i) * 30} 700 ${560 + i * 140} 600`}
          stroke="#050308"
          strokeWidth={28}
          strokeLinecap="round"
          fill="none"
          opacity={0.7}
        />
      ))}
    </g>
  );
};

// ---------- S22: Over the shoulder, jendela ke seberang jalan ----------
export const S22: React.FC<ShotProps> = ({ t }) => {
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [31, 1.05]]))}>
      <Study t={t} id="s22" veil={0.75} />
      {/* Window blinds casting shadows */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <line key={i} x1={500} y1={250 + i * 60} x2={1420} y2={250 + i * 60} stroke="#0A0B10" strokeWidth={18} />
      ))}
      <Hero
        look={PIP}
        pose={{
          ...poseAt(t, [{ f: 0, p: { x: 800, y: 720, yaw: 0.8, armL: { a: 15, b: 0 }, armR: { a: 20, b: 0 }, look: 0.9 } }]),
          ...faceAt(t, [[0, 'worried']]),
        }}
        shadow={0.5}
      />
    </g>
  );
};

// ---------- S23: Mobil hitam dan pria berjas mencatat ----------
export const S23: React.FC<ShotProps> = ({ t }) => {
  return (
    <g transform={camT(960, 540, kf(t, [[0, 0.95], [113, 1.0]]))}>
      {/* Dark wet street at night */}
      <rect x={-200} y={-200} width={2320} height={1500} fill="#090B10" />
      <rect x={-200} y={640} width={2320} height={500} fill="#141720" />
      {/* Streetlight cone */}
      <polygon points="1200,0 800,1000 1600,1000" fill="#FFF2C6" opacity={0.12} />
      {/* Black sedan parked */}
      <path
        d="M 500 740 L 620 660 L 980 660 L 1100 740 L 1140 770 L 460 770 Z"
        fill="#040508"
        stroke="#1A202C"
        strokeWidth={6}
      />
      {/* Headlights beams */}
      <polygon points="460,750 -100,700 -100,820" fill="#FFFBEA" opacity={0.25} />
      {/* Agent in suit standing with glowing clipboard */}
      <Hero
        look={SUIT}
        pose={{
          ...poseAt(t, [{ f: 0, p: { x: 1260, y: 720, yaw: -0.3, armL: { a: 35, b: 30 }, armR: { a: 40, b: -20 }, look: -0.5 } }]),
          ...faceAt(t, [[0, 'neutral']]),
        }}
        shadow={0.4}
      />
      {/* Glowing green tablet in hand */}
      <rect x={1210} y={660} width={40} height={60} rx={4} fill="#38EF7D" opacity={0.8} />
      <Glow x={1230} y={690} r={80} kind="cool" o={0.5} />
    </g>
  );
};

// ---------- S24: Adik perempuan kaget di pintu ----------
export const S24: React.FC<ShotProps> = ({ t }) => {
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [57, 1.05]]))}>
      {/* Doorway from bright hall */}
      <rect x={-200} y={-200} width={2320} height={1500} fill="#0F1118" />
      <rect x={820} y={260} width={280} height={620} fill="#FFEAA7" opacity={0.3} />
      <rect x={800} y={240} width={320} height={660} stroke="#3E2723" strokeWidth={16} fill="none" />
      <Hero
        look={SIS}
        pose={{
          ...poseAt(t, [{ f: 0, p: { x: 960, y: 740, yaw: 0, armL: { a: -20, b: 40 }, armR: { a: 20, b: -40 }, look: 0 } }]),
          ...faceAt(t, [[0, 'shock']]),
        }}
        shadow={0.3}
      />
    </g>
  );
};

// ---------- S25: Pip berdiri mematung di sudut gelap ----------
export const S25: React.FC<ShotProps> = ({ t }) => {
  return (
    <g transform={camT(960, 560, kf(t, [[0, 0.95], [75, 1.0]]))}>
      <Bedroom t={t} id="s25" veil={0.85} />
      {/* Deep corner shadow */}
      <polygon points="400,0 750,0 850,1100 300,1100" fill="#020204" opacity={0.9} />
      {/* Pip completely motionless, face turned to wall */}
      <Hero
        look={PIP}
        pose={{
          ...poseAt(t, [{ f: 0, p: { x: 600, y: 720, yaw: 0.95, armL: { a: 5, b: 0 }, armR: { a: 5, b: 0 }, look: 0.95 } }]),
          ...faceAt(t, [[0, 'neutral']]),
        }}
        shadow={0.7}
      />
    </g>
  );
};

// ---------- S26: Extreme push-in, cliffhanger ----------
export const S26: React.FC<ShotProps> = ({ t }) => {
  const zoom = lerp(1.1, 2.6, easeIn(clamp(t / 112)));
  return (
    <g transform={camT(960, 460, zoom)}>
      <rect x={-200} y={-200} width={2320} height={1500} fill="#080305" />
      <Glow x={960} y={460} r={320} kind="red" o={0.75} />
      <Hero
        look={PIP}
        pose={{
          ...poseAt(t, [{ f: 0, p: { x: 960, y: 680, yaw: 0, armL: { a: 0, b: 0 }, armR: { a: 0, b: 0 }, look: 0 } }]),
          ...faceAt(t, [[0, 'shock']]),
        }}
        shadow={0.5}
      />
      {t > 30 && (
        <text
          x={960}
          y={260}
          fontFamily={FONT.title}
          fontSize={40}
          fill="#FF2233"
          textAnchor="middle"
          fontWeight="bold"
        >
          BERAPA LAMA OTAKMU BERTAHAN?
        </text>
      )}
    </g>
  );
};
