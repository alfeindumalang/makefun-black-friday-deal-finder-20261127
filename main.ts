// DealSleuth — the program that hands this entry in.
//
// It copies the site (app/) and its screenshots (screenshots/) from this
// repository into the output directory, then writes dossier.json with
// buildDossier from the kit's vendored library. The grader runs it twice
// and both runs must write byte for byte the same output, so nothing here
// depends on the clock, the network, or anything outside this directory.
//
//   MAKEFUN_OUTPUT_DIR=out node main.ts
//
// With no MAKEFUN_OUTPUT_DIR set, the output goes to /output. Node's
// standard library only; vendor/makefun-frontend.ts stays exactly as the
// kit shipped it, because the scorer rebuilds the dossier with its own
// copy and compares the two byte for byte.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The repository root is the directory this file lives in.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));

// Where the handed-in files go.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The scorer's own caps, as this competition's kit states them. The text
// cap shapes the dossier's bytes; the others refuse an entry the scorer
// would refuse, so the program checks them up front instead of writing a
// doomed output.
const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

// Start from a clean output directory so no stale file from an earlier
// run can ride along.
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

// Both folders must exist: a missing one is a build failure, not a
// half-written output.
for (const folder of ['app', 'screenshots']) {
  if (!existsSync(join(repoRoot, folder))) {
    throw new Error(`missing ${folder}/ in ${repoRoot}`);
  }
}

cpSync(join(repoRoot, 'app'), join(outDir, 'app'), { recursive: true });
cpSync(join(repoRoot, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });

// The dossier is the summary the judge reads: the screenshots, the first
// load's files and bytes, and the site's source.
writeFileSync(join(outDir, 'dossier.json'), buildDossier(outDir, CAPS));
console.log(`DealSleuth handed in to ${outDir}`);
