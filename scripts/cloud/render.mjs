// render the episode (or a frame range), run from the studio folder (Mac or cloud sandbox): node render.mjs <Id> <out.mp4> [from-to] [scale]
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(path.resolve('package.json'));
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');
import fsx from 'node:fs';
// Chrome: $BX if set, else the cloud sandbox's Playwright shell if present, else Remotion's own download (Mac).
const CLOUD_BX = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const BX = process.env.BX || (fsx.existsSync(CLOUD_BX) ? CLOUD_BX : undefined);
const [id, out, range, sc] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public') });
const composition = await selectComposition({ serveUrl, id, browserExecutable: BX });
const frameRange = range && range !== 'all' ? range.split('-').map(Number) : null;
const t0 = Date.now(); let last = 0;
await renderMedia({ serveUrl, composition, codec: 'h264', outputLocation: out, browserExecutable: BX, frameRange, scale: Number(sc || 1), concurrency: 2,
  crf: 18, x264Preset: 'veryfast', imageFormat: 'jpeg', jpegQuality: 92,
  onProgress: ({ progress }) => { const p = Math.floor(progress * 20); if (p > last) { last = p; console.log(`${(progress * 100).toFixed(0)}% ${((Date.now() - t0) / 1000).toFixed(0)}s`); } } });
console.log('done', ((Date.now() - t0) / 1000).toFixed(0), 's');
