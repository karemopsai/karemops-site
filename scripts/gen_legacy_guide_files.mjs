// node scripts/gen_legacy_guide_files.mjs → re-renders every guide in scripts/legacy-guides/*.json in the light style,
// writing to the SAME lead-magnets/ file the old dark guide used (so links already sent keep working).
// PDF-only guides (infinite-leads, 5-platforms, sid-carousels, resume-stack) get a new HTML file; their PDFs stay.
// Renderer: the lead-magnet-guide skill (~/.claude/skills/lead-magnet-guide/scripts/build-guide.mjs).
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { renderGuide } = await import(path.join(os.homedir(), ".claude/skills/lead-magnet-guide/scripts/build-guide.mjs"));
// keep in sync with LEGACY_HREF in gen_light_guides.mjs
const src = fs.readFileSync(path.join(ROOT, "scripts/gen_light_guides.mjs"), "utf8");
const map = Object.fromEntries([...src.matchAll(/"?([\w-]+)"?: "([\w-]+-guide\.html)"/g)].map((m) => [m[1], m[2]]));

const dir = path.join(ROOT, "scripts/legacy-guides");
let n = 0;
for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort()) {
  const g = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
  const out = map[g.slug];
  if (!out) throw new Error("no guide file mapped for " + g.slug);
  g.legacy = true;
  fs.writeFileSync(path.join(ROOT, "lead-magnets", out), renderGuide(g, null));
  n++;
}
console.log("rendered", n, "legacy guides in the light style");
