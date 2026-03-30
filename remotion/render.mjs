/**
 * Render all Remotion compositions to MP4.
 * Run from the remotion/ directory: node render.mjs
 *
 * Requires: npm install (in remotion/)
 * Outputs to: ../public/videos/
 */

import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(__dirname, '../public/videos');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const compositions = [
  { id: 'HeroVideo', output: 'hero-main.mp4' },
  { id: 'DisciplineIntro-Trap', output: 'intro-trap.mp4' },
  { id: 'DisciplineIntro-SportingClays', output: 'intro-sporting-clays.mp4' },
  { id: 'DisciplineIntro-Rifle', output: 'intro-rifle.mp4' },
  { id: 'DisciplineIntro-Handgun', output: 'intro-handgun.mp4' },
  { id: 'DisciplineIntro-Archery', output: 'intro-archery.mp4' },
  { id: 'DisciplineIntro-Fishing', output: 'intro-fishing.mp4' },
];

async function main() {
  console.log('Bundling Remotion project...');
  const bundleLocation = await bundle({
    entryPoint: path.resolve(__dirname, 'src/index.ts'),
  });

  for (const comp of compositions) {
    const outputPath = path.join(outputDir, comp.output);
    console.log(`Rendering ${comp.id} -> ${comp.output}...`);

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: comp.id,
    });

    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: 'h264',
      outputLocation: outputPath,
    });

    console.log(`  Done: ${outputPath}`);
  }

  console.log('All compositions rendered!');
}

main().catch((err) => {
  console.error('Render failed:', err);
  process.exit(1);
});
