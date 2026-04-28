#!/usr/bin/env node
// Extract personas from constellation plugin agents/*.md files into a JS data array.
// Usage: node scripts/extract-personas.js > generated-personas.js
const fs = require("fs");
const path = require("path");

const SRC = "/tmp/constellation-plugins";

const PLUGINS = {
  "great-authors-plugin":     { plugin: "great-authors",     label: "Authors",     accent: "#E8DCC8", role: "Author" },
  "great-filmmakers-plugin":  { plugin: "great-filmmakers",  label: "Filmmakers",  accent: "#C75A5A", role: "Filmmaker" },
  "great-publishers-plugin":  { plugin: "great-publishers",  label: "Publishers",  accent: "#9B7EBD", role: "Publisher" },
  "great-marketers-plugin":   { plugin: "great-marketers",   label: "Marketers",   accent: "#D87FB8", role: "Marketer" },
  "great-engineers-plugin":   { plugin: "great-engineers",   label: "Engineers",   accent: "#6BA3C7", role: "Engineer" },
  "great-designers-plugin":   { plugin: "great-designers",   label: "Designers",   accent: "#3EB489", role: "Designer" },
  "great-operators-plugin":   { plugin: "great-operators",   label: "Operators",   accent: "#E9C23B", role: "Operator" },
  "great-counsels-plugin":    { plugin: "great-counsels",    label: "Counsels",    accent: "#A8A29E", role: "Counsel" },
  "great-researchers-plugin": { plugin: "great-researchers", label: "Researchers", accent: "#5EBDC0", role: "Researcher" },
};

const COLOR_MAP = {
  red: "#C75A5A", orange: "#E9A23B", yellow: "#E9C23B", green: "#3EB489",
  blue: "#6BA3C7", cyan: "#5EBDC0", purple: "#9B7EBD", pink: "#D87FB8",
  gray: "#A8A29E", grey: "#A8A29E", white: "#E8DCC8", black: "#2A2A2A",
  "matrix-green": "#3EB489",
};

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: text };
  const fmRaw = m[1];
  const body = m[2];
  const fm = {};
  // Crude YAML: name: x, model: x, color: x, description: "..."
  const nameM = fmRaw.match(/^name:\s*(.+)$/m);
  const colorM = fmRaw.match(/^color:\s*(.+)$/m);
  const descM = fmRaw.match(/^description:\s*"([\s\S]*?)"\s*$/m) || fmRaw.match(/^description:\s*'([\s\S]*?)'\s*$/m);
  if (nameM) fm.name = nameM[1].trim();
  if (colorM) fm.color = colorM[1].trim();
  if (descM) fm.description = descM[1].replace(/\\n/g, "\n").replace(/\\"/g, '"');
  return { fm, body };
}

function titleCase(s) {
  return s.split(/[-\s]+/).map(w => w[0]?.toUpperCase() + w.slice(1)).join(" ");
}

function displayNameFromFilename(filename, suffixes) {
  let base = filename.replace(/\.md$/, "");
  for (const s of suffixes) {
    base = base.replace(new RegExp(`-${s}$`), "");
  }
  // Special handling for compound surnames
  base = base.replace(/^dhh$/, "DHH").replace(/^rbg$/i, "RBG");
  if (base === "DHH") return "DHH";
  if (base.toUpperCase() === "RBG") return "Ruth Bader Ginsburg";
  return titleCase(base);
}

function extractTagline(description) {
  if (!description) return "";
  const firstLine = description.split(/\n/)[0];
  const m = firstLine.match(/^Use this agent (?:for|when) (.+?)(?:\.|,)/i);
  if (m) return m[1].charAt(0).toUpperCase() + m[1].slice(1) + ".";
  return firstLine.length > 140 ? firstLine.slice(0, 137) + "…" : firstLine;
}

function extractDoesNot(description) {
  if (!description) return "";
  const m = description.match(/Do NOT use (?:for|when):?\s*([\s\S]+?)(?:\n\n|Examples:|$)/i);
  if (!m) return "";
  return m[1].trim().replace(/\s+/g, " ").slice(0, 240);
}

function extractPhilosophy(body) {
  // Try to find "Core principles" or "## Voice" section bullets, fallback to first 3 short paragraphs
  const sections = body.split(/\n##+\s+/);
  for (const sec of sections) {
    if (/^(Core principles|Principles|Voice and temperament|Your register)/i.test(sec)) {
      const bullets = sec.match(/^[-*]\s+\*\*([^*]+)\*\*\s*[—:-]?\s*(.+)/gm);
      if (bullets && bullets.length >= 2) {
        return bullets.slice(0, 4).map(b => {
          const m = b.match(/^[-*]\s+\*\*([^*]+)\*\*\s*[—:-]?\s*(.+)/);
          return m ? `${m[1].trim()} — ${m[2].trim().replace(/\s+/g, " ")}`.slice(0, 140) : b.slice(0, 140);
        });
      }
    }
  }
  // Fallback: first sentence of first 3 paragraphs after intro
  const paras = body.split(/\n\n+/).filter(p => p.trim() && !p.startsWith("#") && !p.startsWith("---")).slice(1, 5);
  return paras.slice(0, 3).map(p => {
    const sent = p.trim().split(/(?<=[.!?])\s+/)[0];
    return sent.length > 140 ? sent.slice(0, 137) + "…" : sent;
  }).filter(Boolean);
}

function buildPersonaPrompt(body, name) {
  // Strip leading H1 + return rest as the prompt content.
  const clean = body.replace(/^#\s+.+\n+/, "").trim();
  // Cap to keep payload reasonable
  return clean.length > 6000 ? clean.slice(0, 6000) : clean;
}

const SUFFIXES = ["persona", "engineer", "counsel", "designer", "operator", "marketer",
  "publisher", "editor", "creative", "narrative", "copywriter", "pioneer",
  "art-director", "strategist", "behavioral", "direct-response", "researcher"];

const all = [];

for (const [pluginDir, meta] of Object.entries(PLUGINS)) {
  const dir = path.join(SRC, pluginDir, "agents");
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".md") && !f.endsWith("-builder.md"));
  for (const file of files) {
    const text = fs.readFileSync(path.join(dir, file), "utf8");
    const { fm, body } = parseFrontmatter(text);
    if (!fm.name) continue;
    // Prefer full name from H1 like "# James Baldwin Persona — The Essayist"
    let name = displayNameFromFilename(file, SUFFIXES);
    const h1 = body.match(/^#\s+(.+?)$/m);
    if (h1) {
      const stripped = h1[1].replace(/\s*Persona.*$/i, "").replace(/\s*—.*$/, "").trim();
      if (stripped && stripped.split(" ").length >= 2 && stripped.length < 60) {
        name = stripped;
      }
    }
    const id = fm.name; // already kebab from frontmatter
    const colorHex = COLOR_MAP[fm.color] || meta.accent;
    const philosophy = extractPhilosophy(body);
    if (philosophy.length === 0) {
      philosophy.push(extractTagline(fm.description) || `${name} — specialist persona.`);
    }
    const persona = {
      id,
      name,
      plugin: meta.plugin,
      tier: "specialist",
      role: meta.role,
      title: meta.label.replace(/s$/, ""),
      tagline: extractTagline(fm.description) || `${meta.role} persona.`,
      color: colorHex,
      reportsTo: null,
      portrait: `portraits/${id}.webp`,
      philosophy: philosophy.slice(0, 4),
      personaPrompt: buildPersonaPrompt(body, name),
      samplePrompts: [
        `Channel ${name.split(" ")[0]} on this brief.`,
        `What would ${name.split(" ")[0]} do here?`,
        `Edit this through ${name.split(" ")[0]}'s lens.`,
      ],
      doesNot: extractDoesNot(fm.description) || "Speak outside their craft.",
    };
    all.push(persona);
  }
}

all.sort((a, b) => a.plugin.localeCompare(b.plugin) || a.name.localeCompare(b.name));

process.stdout.write("// AUTO-GENERATED constellation personas\n");
process.stdout.write("// Source: /tmp/constellation-plugins/*/agents/*.md\n");
process.stdout.write(`// Count: ${all.length}\n`);
process.stdout.write("window.CONSTELLATION_PERSONAS = ");
process.stdout.write(JSON.stringify(all, null, 2));
process.stdout.write(";\n");
process.stderr.write(`Extracted ${all.length} personas across ${Object.keys(PLUGINS).length} plugins.\n`);
