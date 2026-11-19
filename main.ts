// gta6-meme-x-01 entry program (Node 22, standard library only).
//
// The entry itself is a public post on X: a GTA 6 meme whose first picture
// shows make.fun's ghost mascot. This program has exactly one job for the
// grader: hand over the address of that post. It reads POST.json from the
// repository root and writes the same bytes to POST.json in the output
// directory, where the house gate picks it up and reads the post from X.
//
// The run is deterministic: no clock, no randomness, no network, and the
// output bytes are the input bytes, so two runs always agree.
//
// Local run (the grader sets both variables to /bot and /output):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const repoDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const postFile = "POST.json";

const raw = readFileSync(join(repoDir, postFile));

// Fail loudly on a malformed hand-over file instead of passing it on: the
// gate wants a JSON object whose "url" names the post, so anything else is
// a broken entry and an early exit 1 beats a silent invalid copy.
let parsed: unknown;
try {
  parsed = JSON.parse(raw.toString("utf8"));
} catch {
  console.error("POST.json is not valid JSON");
  process.exit(1);
}
const url = (parsed as { url?: unknown } | null)?.url;
if (typeof url !== "string" || url.length === 0) {
  console.error('POST.json must be an object with a non-empty "url" string');
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, postFile), raw);
