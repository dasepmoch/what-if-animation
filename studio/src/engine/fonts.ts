import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';
import { STUDIO } from '../studio.config';

// Three faces: a heavy display face for the title card and captions, a mono for on-screen readouts (timers, labels,
// chips), and a handwriting face for chalk and notes. They ship as local files in public/fonts/ (the same Google
// faces), so renders work offline, on the Mac and in a cloud sandbox where fonts.gstatic.com is blocked.
// A local title face from studio.config.ts (your brand font) still overrides the title face.

for (const w of ['600', '700', '800']) loadFont({ family: 'Bricolage Grotesque', url: staticFile(`fonts/brico-${w}.woff2`), weight: w });
loadFont({ family: 'Fragment Mono', url: staticFile('fonts/mono-400.woff2'), weight: '400' });
loadFont({ family: 'Kalam', url: staticFile('fonts/kalam-400.woff2'), weight: '400' });
loadFont({ family: 'Kalam', url: staticFile('fonts/kalam-700.woff2'), weight: '700' });
if (STUDIO.titleFont) loadFont({ family: STUDIO.titleFont.family, url: staticFile(STUDIO.titleFont.file), weight: STUDIO.titleFont.weight });

export const FONT = {
  title: STUDIO.titleFont ? STUDIO.titleFont.family : 'Bricolage Grotesque',
  ui: 'Fragment Mono',
  hand: 'Kalam',
};
