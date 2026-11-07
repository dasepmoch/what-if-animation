// portrait-aware stills (Mac or cloud sandbox), run from the studio folder — usage: node stills.mjs <slug|Id> [shots...] [--scale s] [--frames a b] [--id CompId]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(path.resolve('package.json'));
const { bundle } = require('@remotion/bundler');
const { renderStill, selectComposition } = require('@remotion/renderer');
import fsx from 'node:fs';
// Chrome: $BX if set, else the cloud sandbox's Playwright shell if present, else Remotion's own download (Mac).
const CLOUD_BX = '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
const BX = process.env.BX || (fsx.existsSync(CLOUD_BX) ? CLOUD_BX : undefined);
const args = process.argv.slice(2);
const slug = args[0];
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const scale = Number(opt('--scale', 0.5));
const framesAt = args.indexOf('--frames');
const skip = new Set(); ['--scale', '--id'].forEach((k) => { const i = args.indexOf(k); if (i >= 0) { skip.add(i); skip.add(i + 1); } });
const rest = args.slice(1).filter((a, i) => !skip.has(i + 1) && a !== '--frames');
const epPath = path.resolve('src/episodes', slug, 'episode.json');
const ep = fs.existsSync(epPath) ? JSON.parse(fs.readFileSync(epPath, 'utf8')) : { id: opt('--id', slug) };
const tlPath = path.resolve('src/episodes', slug, 'timeline.json');
const tl = fs.existsSync(tlPath) ? JSON.parse(fs.readFileSync(tlPath, 'utf8')) : null;
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts'), publicDir: path.resolve('public') });
const common = { serveUrl, browserExecutable: BX, chromiumOptions: BX ? { gl: 'swangle' } : {} };
if (framesAt >= 0) {
  const outDir = path.resolve('out', slug, 'frames'); fs.mkdirSync(outDir, { recursive: true });
  const composition = await selectComposition({ ...common, id: ep.id });
  for (const fr of rest.map(Number)) {
    await renderStill({ ...common, composition, frame: fr, output: path.join(outDir, `f${String(fr).padStart(4, '0')}.png`), overwrite: true, scale });
    process.stdout.write(`${fr} `);
  }
} else {
  const outDir = path.resolve('out', slug, 'board'); fs.mkdirSync(outDir, { recursive: true });
  const composition = await selectComposition({ ...common, id: `${ep.id}Board` });
  const ids = tl ? tl.shots.map((s) => s.id) : Array.from({ length: composition.durationInFrames }, (_, i) => `F${i}`);
  const want = rest.length ? rest : ids;
  for (const id of want) {
    const i = ids.indexOf(id);
    if (i < 0) throw new Error(`No shot ${id}`);
    await renderStill({ ...common, composition, frame: i, output: path.join(outDir, `${id}.png`), overwrite: true, scale });
    process.stdout.write(`${id} `);
  }
}
console.log('\ndone');
