#!/usr/bin/env node
// Generate a short biographical sketch (2-3 sentences) per persona via gpt-4o-mini.
// Reads .env.local for OPENAI_API_KEY. Writes/updates bios.json.
// Usage:
//   node scripts/generate-bios.js              # all missing
//   node scripts/generate-bios.js id1 id2      # specific ids
//   node scripts/generate-bios.js --force      # regen all

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const ENV_FILE = path.join(ROOT, ".env.local");
const BIOS_FILE = path.join(ROOT, "bios.json");
const BIOS_JS = path.join(ROOT, "bios.js");
const writeBios = (obj) => {
  fs.writeFileSync(BIOS_FILE, JSON.stringify(obj, null, 2));
  fs.writeFileSync(BIOS_JS, `// AUTO-GENERATED bios for personas.\nwindow.BIOS = ${JSON.stringify(obj, null, 2)};\n`);
};

if (fs.existsSync(ENV_FILE)) {
  for (const line of fs.readFileSync(ENV_FILE, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2];
  }
}
const KEY = process.env.OPENAI_API_KEY;
if (!KEY) { console.error("Missing OPENAI_API_KEY"); process.exit(1); }

function loadPersonas() {
  const win = {};
  const wrap = (file) => new Function("window", fs.readFileSync(path.join(ROOT, file), "utf8"))(win);
  wrap("generated-personas.js");
  wrap("personas.js");
  return win.PERSONAS;
}

const existing = fs.existsSync(BIOS_FILE) ? JSON.parse(fs.readFileSync(BIOS_FILE, "utf8")) : {};

async function genBio(p) {
  const sys = `You write concise biographical sketches for a persona testbed. 2-3 sentences, factual, no flowery prose. State who they are, what they're known for, and the era/domain. No quotes. No "channel X" framing. No second person. Just biography.`;
  const user = `Write a short biography of ${p.name}, who in this app channels the ${p.role.toLowerCase()} archetype (${p.title}). Their tagline here: "${p.tagline}". 2-3 sentences max.`;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: sys }, { role: "user", content: user }],
      temperature: 0.4,
      max_tokens: 180,
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const j = await res.json();
  return j.choices[0].message.content.trim();
}

(async () => {
  const personas = loadPersonas();
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const idArgs = args.filter(a => !a.startsWith("-"));
  const targets = idArgs.length
    ? personas.filter(p => idArgs.includes(p.id))
    : personas.filter(p => force || !existing[p.id]);

  if (targets.length === 0) { console.log("No targets."); process.exit(0); }

  console.log(`Generating ${targets.length} bio(s)…`);
  let ok = 0;
  for (const p of targets) {
    process.stdout.write(`  ${p.id} … `);
    try {
      const bio = await genBio(p);
      existing[p.id] = bio;
      writeBios(existing);
      console.log("✓");
      ok++;
    } catch (e) {
      console.log(`✗ ${e.message}`);
    }
  }
  console.log(`Done. ${ok}/${targets.length} succeeded. Saved → bios.json`);
})();
