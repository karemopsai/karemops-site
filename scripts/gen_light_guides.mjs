// node scripts/gen_light_guides.mjs → guides/<slug>.html for every guide in scripts/light-guides.json
// Light "Swiss editorial" landing pages (2026-10-24), matching the light lead-magnet guides:
// off-white paper, Meta blue #0866FF as the only accent, Inter + Instrument Serif italic emphasis.
// EN / العربية toggle (Modern Standard Arabic). The email gate posts to the same Apps Script
// as every other guide page; if the visitor reads in Arabic, the guide opens with #ar.
// Guide data comes from Karemops/output/lebanese-launch/data (guides.mjs, guides-ar.mjs, *-guide.json).
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://www.karemopsai.com";
const DATE_EN = "24 Oct 2026";
const DATE_AR = "24 أكتوبر 2026";
const guides = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/light-guides.json"), "utf8"));
// Legacy guides (English only, restyled 2026-10-24): one JSON each in scripts/legacy-guides/.
// They keep their existing guide URL so links already sent in DMs keep working; PDF-only ones get an HTML guide.
const LEGACY_HREF = {
  "claude-starter-pack": "claude-starter-pack-guide.html", humanizer: "humanizer-guide.html",
  "infinite-content": "infinite-content-guide.html", "claude-skill-builder": "build-your-first-skill-guide.html",
  "llm-council": "llm-council-guide.html", "finance-agents": "finance-agents-guide.html",
  "truth-prompt": "truth-prompt-guide.html", "content-agent-dashboard": "content-agent-dashboard-guide.html",
  "employee-context": "employee-context-guide.html", "md-file-builder": "md-file-builder-guide.html",
  "higgs-field-claude": "higgs-field-claude-guide.html", morning: "morning-guide.html",
  headroom: "headroom-guide.html", "fable-5": "fable-5-playbook-guide.html",
  "6-agent-stack": "6-subagent-stack-guide.html", "meta-ads-mcp": "meta-ads-mcp-guide.html",
  "shopify-toolkit": "shopify-ai-toolkit-guide.html", "courses-roadmap": "anthropic-courses-guide.html",
  routines: "routines-guide.html", "first-skill": "first-skill-guide.html", "skills-setup": "skills-setup-guide.html",
  "infinite-leads": "infinite-leads-guide.html", "5-platforms": "5-platforms-guide.html",
  "sid-carousels": "sid-carousels-guide.html", "resume-stack": "resume-stack-guide.html",
};
const LEGACY_DIR = path.join(ROOT, "scripts/legacy-guides");
if (fs.existsSync(LEGACY_DIR)) for (const file of fs.readdirSync(LEGACY_DIR).filter((x) => x.endsWith(".json")).sort()) {
  const g = JSON.parse(fs.readFileSync(path.join(LEGACY_DIR, file), "utf8"));
  if (!LEGACY_HREF[g.slug]) throw new Error("no guide file mapped for legacy slug " + g.slug);
  g.legacy = true; g.guideFile = LEGACY_HREF[g.slug]; g.steps ||= []; g.prompts ||= []; g.what ||= []; g.prereqs ||= []; g.credit ||= [];
  guides.push(g);
}
const ONLY = process.argv[2]; // optional: "legacy" to build only legacy pages
// original dark first-skill.html (saved from git) = source of the email-gate script and footer icons.
// guides/first-skill.html itself is now a generated light page, so never read the template from there.
const tpl = fs.readFileSync(path.join(ROOT, "scripts/gate-template-first-skill.html"), "utf8");

// reuse the live page's gate script (same endpoint + logic) and social icons
const gateScript = tpl.slice(tpl.lastIndexOf("<script>"), tpl.lastIndexOf("</script>") + 9);
const socials = tpl.match(/<div class="kf-socials">[\s\S]*?<\/div>/)[0];
if (!gateScript.includes("SIGNUP_ENDPOINT") || !socials) throw new Error("template anchors missing");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const plain = (h) => String(h).replace(/<[^>]+>/g, "");
const attr = (s) => plain(s).replace(/"/g, "&quot;");
let BI = true; // false for English-only guides: no toggle, no Arabic spans
const t = (en, ar) => (BI ? `<span class="l-en">${en}</span><span class="l-ar">${ar ?? en}</span>` : en);

const CSS = `
:root{--canvas:#F2F4F8;--paper:#FAFAF8;--white:#FFFFFF;--ink:#0B1220;--muted:#5A6478;--line:#E2E6EE;
--blue:#0866FF;--blue-soft:#EAF2FF;--blue-line:#C9DCFF;--code:#F3F6FB;
--sans:'Inter',-apple-system,'Segoe UI',sans-serif;--serif:'Instrument Serif','Times New Roman',serif;
--mono:'JetBrains Mono','SF Mono',Menlo,monospace;--arab:'IBM Plex Sans Arabic','Inter',sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:var(--paper);color:var(--ink);font-family:var(--sans);-webkit-font-smoothing:antialiased}
a{color:var(--blue)}
.container{max-width:760px;margin:0 auto;padding:22px max(20px,env(safe-area-inset-left)) 0 max(20px,env(safe-area-inset-right))}
.nav{display:flex;justify-content:space-between;align-items:center;padding:6px 0 26px}
.wordmark{font-weight:800;font-size:17px;letter-spacing:-.01em;color:var(--ink);text-decoration:none}.wordmark i{font-style:normal;color:var(--blue)}
.navr{display:flex;gap:10px;align-items:center}
.back{font-size:13px;font-weight:600;color:var(--muted);text-decoration:none}.back:hover{color:var(--blue)}
.lang{display:flex;gap:2px;padding:3px;border-radius:999px;background:var(--white);border:1px solid var(--line)}
.lang button{border:0;background:transparent;color:var(--muted);font:600 12.5px var(--sans),var(--arab);padding:6px 12px;border-radius:999px;cursor:pointer}
.lang button[aria-pressed="true"]{background:var(--blue);color:#fff}
button:focus-visible,a:focus-visible,input:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.eyebrow{font-size:11.5px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--blue);margin-bottom:14px}
h1{font-weight:800;font-size:clamp(34px,6vw,52px);line-height:1.04;letter-spacing:-.03em;text-wrap:balance}
.em{font-family:var(--serif);font-style:italic;font-weight:400;color:var(--blue);letter-spacing:0;font-size:1.1em}
.meta{display:flex;gap:10px;align-items:center;flex-wrap:wrap;color:var(--muted);font-size:13px;margin:18px 0 0}
.meta .dot{width:3px;height:3px;border-radius:50%;background:var(--muted)}
.lede{font-size:18px;line-height:1.6;color:var(--muted);margin:18px 0 0;max-width:62ch}
.stage{margin:30px 0 0;border-radius:16px;padding:28px;background-color:var(--blue-soft);
background-image:radial-gradient(rgba(8,102,255,.22) 1.2px,transparent 1.3px);background-size:16px 16px;border:1px solid var(--blue-line)}
.win{background:var(--white);border-radius:12px;border:1px solid var(--line);box-shadow:0 10px 30px rgba(8,102,255,.12),0 2px 6px rgba(11,18,32,.05);overflow:hidden;direction:ltr}
.win .bar{display:flex;align-items:center;gap:6px;padding:10px 14px;border-bottom:1px solid var(--line);font-size:11px;color:var(--muted)}
.win .bar i{width:9px;height:9px;border-radius:50%;background:var(--line);display:inline-block}
.win .bar span{margin-left:8px;font-weight:600}
.win pre{font-family:var(--mono);font-size:13.5px;line-height:1.7;padding:18px 20px;white-space:pre-wrap;word-break:break-word;color:var(--ink);text-align:left}
.win pre .p{color:var(--blue);font-weight:700}
.caret{display:inline-block;width:8px;height:15px;background:var(--blue);vertical-align:-2px;margin-left:2px}
@media (prefers-reduced-motion:no-preference){.caret{animation:blink 1.1s steps(1) infinite}@keyframes blink{50%{opacity:0}}}
.section{margin-top:40px}
h2{font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:14px}
.what p{font-size:16px;line-height:1.7;margin-bottom:12px}
.inside{list-style:none;border-top:1px solid var(--line)}
.inside li{display:grid;grid-template-columns:48px 1fr;gap:4px;padding:14px 0;border-bottom:1px solid var(--line);font-size:15.5px;line-height:1.5}
.inside .n{font-weight:800;color:var(--blue);font-size:15px;font-variant-numeric:tabular-nums}
.callout{margin-top:22px;background:var(--blue-soft);border:1px solid var(--blue-line);border-radius:10px;padding:14px 18px;font-size:14px;line-height:1.6}
.callout strong{color:var(--blue);margin-inline-end:4px}
.gate{margin-top:40px;background:var(--white);border:1px solid var(--line);border-radius:16px;padding:28px;box-shadow:0 12px 40px rgba(11,18,32,.06)}
.gate .lock{width:40px;height:40px;border-radius:10px;background:var(--blue-soft);display:grid;place-items:center;font-size:18px;margin-bottom:14px}
.gate h3{font-size:22px;font-weight:800;letter-spacing:-.02em;margin-bottom:6px}
.gate p{color:var(--muted);font-size:14.5px;line-height:1.6;margin-bottom:16px}
#gate-form{display:flex;gap:10px;flex-wrap:wrap}
#gate-form input{flex:1 1 220px;min-width:0;font:15px var(--sans);padding:13px 14px;border:1px solid var(--line);border-radius:10px;background:var(--paper);color:var(--ink)}
#gate-form button,#gate-form .gate-open-btn{text-decoration:none;display:inline-block;flex:0 0 auto;font:700 15px var(--sans),var(--arab);padding:13px 20px;border:0;border-radius:10px;background:var(--blue);color:#fff;cursor:pointer}
#gate-form button:hover{filter:brightness(1.08)}
.cta{margin-top:24px;background:var(--blue);color:#fff;border-radius:16px;padding:28px}
.cta .k{font-size:11px;letter-spacing:.12em;text-transform:uppercase;opacity:.8;margin-bottom:8px}
.cta h3{font-size:24px;font-weight:800;letter-spacing:-.02em;line-height:1.2;margin-bottom:8px}
.cta p{opacity:.92;font-size:15px;line-height:1.6}
.pills{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 18px}
.pill{font-size:12px;font-weight:600;padding:5px 10px;border-radius:999px;background:rgba(255,255,255,.16)}
.book{display:inline-block;background:#fff;color:var(--blue);font-weight:800;font-size:15px;padding:12px 20px;border-radius:10px;text-decoration:none}
.fine{display:block;margin-top:10px;font-size:12.5px;opacity:.8}
footer{max-width:760px;margin:56px auto 0;padding:28px 20px 36px;border-top:1px solid var(--line);text-align:center}
.kf-brand{display:flex;align-items:center;justify-content:center;gap:10px;font-size:12px;color:var(--muted);letter-spacing:.05em}
.kf-brand img{width:24px;height:24px;border-radius:50%;object-fit:cover}
.kf-contact{margin-top:16px;font-size:14px}.kf-contact a{font-weight:600;text-decoration:none}
.kf-socials{display:flex;justify-content:center;gap:12px;margin-top:18px}
.kf-socials a{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;border:1px solid var(--line);color:var(--muted);background:var(--white)}
.kf-socials a:hover{color:var(--blue);border-color:var(--blue-line)}
.kf-socials svg{width:17px;height:17px}
html[data-lang="en"] .l-ar,html[data-lang="ar"] .l-en{display:none !important}
html[data-lang="ar"] body{font-family:var(--arab)}
html[data-lang="ar"] h1{letter-spacing:0;line-height:1.3}
html[data-lang="ar"] .em{font-family:var(--arab);font-style:normal;font-weight:700;font-size:1em}
html[data-lang="ar"] .eyebrow,html[data-lang="ar"] h2,html[data-lang="ar"] .cta .k{letter-spacing:0}
html[data-lang="ar"] .lede,html[data-lang="ar"] .what p,html[data-lang="ar"] .inside li{line-height:1.85}
.ltr{direction:ltr;unicode-bidi:isolate;display:inline-block}`;

// The Club (design system v3, 2026-11-09). Only guides with "style": "club" in light-guides.json use it;
// every other page renders exactly as before. Appended after CSS so it overrides the v2 rules.
const CLUB_CSS = `
:root{--canvas:#E7E0D2;--paper:#FBF7EF;--ink:#1A1714;--navy:#0E1A33;--muted:#4A4438;--subtle:#7A7262;--line:#E4DACA;
--code:#F6F0E4;--cream:#F2EAD9;--brass:#B08D57;--serif:'Cormorant Garamond',Georgia,serif;
--repp:repeating-linear-gradient(135deg,#0E1A33 0 11px,#0866FF 11px 17px,#0E1A33 17px 28px,#FBF7EF 28px 30px)}
.repp{height:8px;background:var(--repp)}
.wordmark{color:var(--navy)}
.nav{border-bottom:1px solid var(--brass);padding:6px 0 16px;margin-bottom:30px}
.lang{background:var(--paper);border-color:var(--line)}
.eyebrow{font-weight:700;letter-spacing:.16em;font-size:11px}
h1{font-family:var(--serif);font-weight:600;font-size:clamp(40px,7vw,62px);line-height:1;letter-spacing:-.01em;color:var(--navy)}
.em{font-family:var(--serif);font-style:italic;font-weight:600;font-size:1em}
.meta .dot{background:var(--brass)}
.stage{border-radius:0;padding:30px;background:var(--cream);background-image:none;border:1px solid var(--line);outline:1px solid var(--brass);outline-offset:6px;margin:36px 6px 0}
.win{border-radius:12px;border:0;box-shadow:0 14px 34px rgba(14,26,51,.16),0 2px 6px rgba(14,26,51,.08)}
.win .bar{background:var(--navy);color:var(--paper);border-bottom:0}
.win .bar i{background:rgba(251,247,239,.28)}
h2{font-family:var(--serif);font-weight:600;font-size:32px;letter-spacing:-.01em;text-transform:none;color:var(--navy);line-height:1.1}
.inside{border-top:1px solid var(--brass)}
.inside .n{font-family:var(--serif);font-weight:600;font-size:22px;line-height:1.1}
.callout{background:var(--cream);border:0;border-top:1.5px solid var(--brass);border-radius:0}
.gate{border-radius:0;border:1px solid var(--line);border-top:1.5px solid var(--brass);box-shadow:none}
.gate .lock{border-radius:0;background:var(--cream)}
.gate h3,.cta h3{font-family:var(--serif);font-weight:600;font-size:30px;letter-spacing:-.01em;line-height:1.1}
.gate h3{color:var(--navy)}
#gate-form input{border-radius:999px;padding:13px 18px;background:#fff}
#gate-form button,#gate-form .gate-open-btn{border-radius:999px;padding:13px 22px}
#gate-form button:hover{filter:none;background:#1E7AFF}
.cta{background:var(--navy);border-radius:0;position:relative;overflow:hidden;padding:36px 28px 28px}
.cta::before{content:"";position:absolute;left:0;right:0;top:0;height:8px;background:var(--repp)}
.cta .k{color:#4D92FF;opacity:1;font-weight:700;letter-spacing:.16em}
.pill{border-radius:999px;background:transparent;border:1px solid rgba(176,141,87,.7)}
.book{background:var(--blue);color:#fff;border-radius:999px}
.book:hover{background:#1E7AFF}
footer{border-top:1px solid var(--brass)}
.kf-crest{display:block;margin:0 auto 14px;width:40px;height:50px}
.kf-socials a{border-color:var(--line);background:var(--paper)}
html[data-lang="ar"] h1,html[data-lang="ar"] h2,html[data-lang="ar"] .gate h3,html[data-lang="ar"] .cta h3,html[data-lang="ar"] .inside .n{font-family:var(--arab);font-weight:700}
html[data-lang="ar"] h1{font-size:clamp(32px,6vw,48px);line-height:1.3}
html[data-lang="ar"] h2{font-size:26px}html[data-lang="ar"] .gate h3,html[data-lang="ar"] .cta h3{font-size:24px;line-height:1.35}`;
const CREST = `<svg class="kf-crest" viewBox="0 0 120 150" aria-label="Karemops crest"><ellipse cx="60" cy="75" rx="57" ry="72" fill="none" stroke="#B08D57" stroke-width="3"/><ellipse cx="60" cy="75" rx="49" ry="64" fill="none" stroke="#B08D57" stroke-width="1.4"/><text x="60" y="98" text-anchor="middle" style="font:600 68px 'Cormorant Garamond',Georgia,serif;fill:#0866FF">K</text></svg>`;

function hero(g) {
  const si = typeof g.hero === "number" ? g.hero - 1 : g.hero === "prompt" && g.prompts.length ? -1 : g.steps.findIndex((s) => s.code && s.code.trim().length >= 6 && s.code.length < 400);
  const src = si >= 0 ? g.steps[si] : g.prompts[0] || { code: "" };
  const code = (src.code || "").split("\n").slice(0, 5).join("\n");
  const isCmd = /^(\/|npx |git |mkdir|export|https?:|claude|Shift|npm |pip |node )/.test(code.trim());
  const body = esc(code).split("\n").map((l, i) => (i === 0 && isCmd ? `<span class="p">&gt;</span> ${l}` : l)).join("\n");
  return { label: isCmd ? "Claude Code" : "Prompt", body };
}

const LANG_SCRIPT = `<script>
(function(){
  var root=document.documentElement;
  function set(l){root.dataset.lang=l;root.lang=l;root.dir=l==="ar"?"rtl":"ltr";
    document.querySelectorAll(".lang button").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.l===l)});
    try{localStorage.setItem("karemops-guide-lang",l)}catch(e){}
    if(window.GUIDE){GUIDE.href=GUIDE.base+(l==="ar"?"#ar":"")}
    var e=document.getElementById("gate-email");if(e)e.placeholder=l==="ar"?"بريدك الإلكتروني":"your@email.com";}
  var saved=null;try{saved=localStorage.getItem("karemops-guide-lang")}catch(e){}
  window.__setLang=set;
  set(location.hash==="#ar"?"ar":location.hash==="#en"?"en":(saved||"en"));
  document.querySelector(".lang").addEventListener("click",function(e){var b=e.target.closest("button");if(b)set(b.dataset.l)});
})();
</script>`;

for (const g of guides) {
  if (ONLY === "legacy" && !g.legacy) continue;
  BI = !!g.ar;
  const CLUB = g.style === "club";
  const a = g.ar || { what: [], steps: [], prompts: [] };
  const titleEn = plain(g.title).replace(/\.$/, "");
  const href = `${BASE}/lead-magnets/${g.guideFile || g.slug + "-guide.html"}`;
  const h = hero(g);
  const insideEn = [...g.steps.map((s) => s.h), ...(g.prompts.length ? [`${g.prompts.length} copy-paste prompts: ${g.prompts.map((p) => p.h).join(", ")}`] : [])];
  const insideAr = !BI ? [] : [...a.steps.map((s) => s.h), ...(g.prompts.length ? [`${g.prompts.length} أوامر جاهزة للنسخ: ${a.prompts.join("، ")}`] : [])];
  // a step can carry its own label (e.g. "+1" for a bonus step); the prompts line takes the next number
  const insideN = [...g.steps.map((s, i) => s.num ?? String(i + 1).padStart(2, "0")), String(g.steps.filter((s) => !s.num).length + 1).padStart(2, "0")];
  // gate script: same endpoint + logic, guide title/href swapped, href follows the chosen language
  let gs = gateScript.replace(/const GUIDE = \{[\s\S]*?\};/, `const L = (en, ar) => document.documentElement.dataset.lang === "ar" ? ar : en;\n  const GUIDE = window.GUIDE = {\n    title: ${JSON.stringify(titleEn)},\n    base: ${JSON.stringify(href)},\n    href: ${JSON.stringify(href)} + (document.documentElement.dataset.lang === "ar" ? "#ar" : "")\n  };`);
  if (gs === gateScript) throw new Error("GUIDE anchor missing in gate script");
  // localize the post-submit messages and drop the em dashes from them
  const swaps = [
    [`"You're already in — grab the guide"`, `L("You're already in. Grab the guide", "أنت مسجّل بالفعل. افتح الدليل")`],
    ["`We've got you (${savedEmail}). Click to open.`", "L(`We've got you (${savedEmail}). Click to open.`, `معنا بريدك (${savedEmail}). اضغط لفتح الدليل.`)"],
    ['`<button type="submit" id="gate-submit">Open the guide →</button>`', '`<button type="submit" id="gate-submit">${L("Open the guide →", "افتح الدليل ←")}</button>`'],
    ["'Sending…'", `L("Sending…", "جارٍ الإرسال…")`],
    ["'Sent ✓'", `L("Sent ✓", "تم ✓")`],
    [`"You're in — grab the guide"`, `L("You're in. Grab the guide", "تم التسجيل. افتح الدليل")`],
    ["`Sent to ${email}. Click to open.`", "L(`Sent to ${email}. Click to open.`, `أُرسل إلى ${email}. اضغط لفتح الدليل.`)"],
    ['`<button type="submit">Open the guide →</button>`', '`<button type="submit">${L("Open the guide →", "افتح الدليل ←")}</button>`'],
  ];
  for (const [a1, b1] of swaps) { if (!gs.includes(a1)) throw new Error("gate text anchor missing: " + a1); gs = gs.split(a1).join(b1); }
  // DM link (?via=dm, sent by ManyChat after someone follows + comments): no email form, straight to the guide.
  // Remembered in sessionStorage so the page stays open (no form) if they come back to it in the same tab.
  // Bio / site / search visitors (no param) keep the email gate exactly as before.
  const dmAnchor = "  if (savedEmail) {";
  if (!gs.includes(dmAnchor)) throw new Error("savedEmail anchor missing in gate script");
  gs = gs.replace(dmAnchor, `  let DM = false, dmUrl = false;
  try { dmUrl = new URLSearchParams(location.search).get('via') === 'dm'; } catch (e) { /* ignore */ }
  try { if (dmUrl) sessionStorage.setItem('karemops_via', 'dm'); DM = dmUrl || sessionStorage.getItem('karemops_via') === 'dm'; } catch (e) { DM = dmUrl; }
  if (DM) {
    gate.classList.add('gate-open');
    const lk = gate.querySelector('.lock'); if (lk) lk.textContent = '🔓';
    gateTitle.textContent = L("Your guide is open", "الدليل مفتوح لك");
    gateCopy.textContent = L("Thanks for the follow. No email needed, it's yours.", "شكرًا على المتابعة. لا حاجة لبريدك، الدليل لك.");
    gateForm.innerHTML = \`<a id="gate-submit" class="gate-open-btn" href="\${GUIDE.href}">\${L("Open the guide →", "افتح الدليل ←")}</a>\`;
    if (dmUrl) location.replace(GUIDE.href);
  } else if (savedEmail) {`);
  const html = `<!DOCTYPE html>
<html lang="en" data-lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(titleEn)} | Karemops.ai</title>
<meta name="description" content="${attr(g.lead)}" />
<meta property="og:title" content="${attr(titleEn)} | Karemops.ai" />
<meta property="og:description" content="${attr(g.lead)}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${BASE}/guides/${g.slug}.html" />
<meta property="og:image" content="${BASE}/lead-magnets/banner.jpg" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800${CLUB ? "&family=Cormorant+Garamond:ital,wght@0,600;1,600" : "&family=Instrument+Serif:ital@0;1"}&family=JetBrains+Mono:wght@400;500&family=IBM+Plex+Sans+Arabic:wght@400;500;700&display=swap" rel="stylesheet">
<style>${CSS}${CLUB ? CLUB_CSS : ""}</style>
</head>
<body>
${CLUB ? `<div class="repp"></div>\n` : ""}<div class="container">
  <nav class="nav">
    <a href="${BASE}/" class="wordmark">karemops<i>.ai</i></a>
    <div class="navr">
      ${BI ? `<div class="lang" role="group" aria-label="Language"><button type="button" data-l="en" aria-pressed="true">EN</button><button type="button" data-l="ar" aria-pressed="false">العربية</button></div>` : ""}
      <a href="${BASE}/" class="back">${t("All guides", "كل الأدلة")}</a>
    </div>
  </nav>

  <div class="eyebrow">${g.legacy ? "Free field guide" : t(`Field guide · No. ${String(g.number).padStart(2, "0")} · Comment ${g.kw}`, `دليل عملي · رقم ${String(g.number).padStart(2, "0")} · اكتب ${g.kw}`)}</div>
  <h1>${t(g.title, a.title)}</h1>
  <p class="meta">${t("By Karem AlMoayyad", "إعداد كريم المؤيد")}<span class="dot"></span>${t(g.date_en || DATE_EN, g.date_ar || DATE_AR)}<span class="dot"></span>${BI ? t("Free guide · EN + Arabic", "دليل مجاني · عربي وإنجليزي") : "Free guide"}</p>
  <p class="lede">${t(g.lead, a.lead)}</p>

  <div class="stage"><div class="win"><div class="bar"><i></i><i></i><i></i><span>${h.label}</span></div><pre>${h.body}<span class="caret"></span></pre></div></div>

  <div class="section what">
    <h2>${t("What this is", "ما هذا")}</h2>
    ${g.what.map((p, i) => `<p>${t(p, a.what[i])}</p>`).join("\n    ")}
  </div>

  <div class="section">
    <h2>${t("What's inside", "في هذا الدليل")}</h2>
    <ul class="inside">${insideEn.map((x, i) => `<li class="l-en"><span class="n">${insideN[i]}</span><span>${x}</span></li>`).join("")}${insideAr.map((x, i) => `<li class="l-ar"><span class="n">${insideN[i]}</span><span>${x}</span></li>`).join("")}</ul>
    <div class="callout"><strong>${t("Heads up:", "تنبيه:")}</strong> ${t(g.warn, a.warn)}</div>
  </div>

  <div class="gate" id="gate">
    <div class="lock">🔒</div>
    <h3 id="gate-title">${t("Get the full guide free", "احصل على الدليل كاملًا مجانًا")}</h3>
    <p id="gate-copy">${BI ? t("Drop your email and the guide opens right away, in English or Arabic. No spam.", "اكتب بريدك الإلكتروني ويفتح الدليل فورًا، بالعربية أو الإنجليزية. بدون رسائل مزعجة.") : "Drop your email and the guide opens right away. No spam."}</p>
    <form id="gate-form">
      <input type="email" id="gate-email" placeholder="your@email.com" autocomplete="email" required aria-label="Email">
      <button type="submit" id="gate-submit">${t("Open the guide →", "افتح الدليل ←")}</button>
    </form>
  </div>

  <div class="cta" id="work">
    <div class="k">${t("Work with Karemops", "اعمل مع Karemops")}</div>
    <h3>${t("Want this built for your business?", "تريد أن نبني هذا لعملك؟")}</h3>
    <p>${t("Book a free 30-minute call. I'll show you where AI saves you time and money, and you leave with the plan whether we work together or not.", "احجز مكالمة مجانية مدتها 30 دقيقة. أريك أين يوفّر لك الذكاء الاصطناعي الوقت والمال، وتخرج بالخطة سواء عملنا معًا أم لا.")}</p>
    <div class="pills"><span class="pill">${t("60+ hrs saved / mo", "توفير أكثر من 60 ساعة شهريًا")}</span><span class="pill">${t("Live in 30 days", "جاهز خلال 30 يومًا")}</span></div>
    <a href="${BASE}/find-your-leaks.html" class="book">${t("Find your leaks →", "اكتشف أين تخسر ←")}</a>
    <span class="fine">${t("No pitch. Worst case, you keep the roadmap.", "بدون عرض بيع. في أسوأ الأحوال تحتفظ بالخطة.")}</span>
  </div>
</div>

<footer>
  ${CLUB ? CREST : ""}<div class="kf-brand"><img src="/avatar.jpg" alt="Karem" /><span>KAREMOPS.AI · KAREM ALMOAYYAD</span></div>
  <div class="kf-contact">${t("Contact", "تواصل")}: <a href="mailto:Karem@karemopsai.com" class="ltr">Karem@karemopsai.com</a></div>
  ${socials}
</footer>

${BI ? LANG_SCRIPT : ""}
${gs}
</body>
</html>
`;
  if (/[—–]/.test(html.replace(socials, "").replace(gs, ""))) console.warn("WARNING: dash in", g.slug);
  fs.writeFileSync(path.join(ROOT, "guides", `${g.slug}.html`), html);
}
console.log("built", guides.length, "light landing pages");
