#!/usr/bin/env node
// Generate persona portraits via OpenAI gpt-image-1 in the Great Minds amber/black low-poly style.
// Reads .env.local for OPENAI_API_KEY.
// Usage:
//   node scripts/generate-portraits.js                  # all missing portraits
//   node scripts/generate-portraits.js id1 id2 id3      # specific persona ids
//   DRY_RUN=1 node scripts/generate-portraits.js id1    # print prompt only

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const ENV_FILE = path.join(ROOT, ".env.local");
const PORTRAITS_DIR = path.join(ROOT, "portraits");
const TMP_DIR = path.join(ROOT, ".portrait-tmp");

if (fs.existsSync(ENV_FILE)) {
  for (const line of fs.readFileSync(ENV_FILE, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2];
  }
}
const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error("Missing OPENAI_API_KEY"); process.exit(1); }

fs.mkdirSync(PORTRAITS_DIR, { recursive: true });
fs.mkdirSync(TMP_DIR, { recursive: true });

// Load personas data (no DOM, just eval).
function loadPersonas() {
  const win = {};
  const ctx = { window: win };
  const wrap = (file) => {
    const txt = fs.readFileSync(path.join(ROOT, file), "utf8");
    new Function("window", txt)(win);
  };
  wrap("generated-personas.js");
  wrap("personas.js");
  return win.PERSONAS;
}

const STYLE = `Low-poly geometric portrait, faceted polygonal triangles forming the face, head, and shoulders. Monochromatic warm amber and gold tones (#E9A23B family) on a pitch-black background. Strong rim light from upper left, deep shadows. Photorealistic likeness underneath the polygon stylization — recognizable as the specific real person. Square 1:1 framing, head and upper shoulders only, centered. No text, no logos, no border. Editorial, dignified, slightly heroic.`;

function promptFor(p) {
  const era = p.plugin === "great-authors" || p.plugin === "great-filmmakers" || p.plugin === "great-counsels" ? "in their best-known era" : "modern professional attire";
  return `A portrait of ${p.name}, the ${p.role.toLowerCase()} (${p.title.toLowerCase()}), ${era}. ${STYLE}`;
}

async function generate(p) {
  const body = {
    model: "gpt-image-1",
    prompt: promptFor(p),
    size: "1024x1024",
    n: 1,
    quality: "medium",
  };
  if (process.env.DRY_RUN) {
    console.log("DRY:", p.id, "\n", body.prompt, "\n");
    return null;
  }
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errText.slice(0, 400)}`);
  }
  const json = await res.json();
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error("No image data in response");
  const pngPath = path.join(TMP_DIR, `${p.id}.png`);
  fs.writeFileSync(pngPath, Buffer.from(b64, "base64"));
  const webpPath = path.join(PORTRAITS_DIR, `${p.id}.webp`);
  execSync(`cwebp -q 85 "${pngPath}" -o "${webpPath}"`, { stdio: "pipe" });
  fs.unlinkSync(pngPath);
  return webpPath;
}

(async () => {
  const personas = loadPersonas();
  const idArgs = process.argv.slice(2);
  const targets = idArgs.length
    ? personas.filter(p => idArgs.includes(p.id))
    : personas.filter(p => p.tier === "specialist" && !fs.existsSync(path.join(PORTRAITS_DIR, `${p.id}.webp`)));

  if (targets.length === 0) { console.log("No targets."); process.exit(0); }

  console.log(`Generating ${targets.length} portrait(s)…`);
  let okCount = 0;
  for (const p of targets) {
    process.stdout.write(`  ${p.id}  …  `);
    const t0 = Date.now();
    try {
      const out = await generate(p);
      const dt = ((Date.now() - t0) / 1000).toFixed(1);
      console.log(out ? `✓ ${dt}s → ${path.relative(ROOT, out)}` : "(dry run)");
      okCount++;
    } catch (e) {
      console.log(`✗ ${e.message}`);
    }
  }
  console.log(`Done. ${okCount}/${targets.length} succeeded.`);
})();
