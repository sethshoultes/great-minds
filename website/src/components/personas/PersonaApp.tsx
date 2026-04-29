"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import type { CSSProperties } from "react";
import { PERSONAS, PLUGINS } from "@/lib/personas/data";
import type { Persona } from "@/lib/personas/types";

declare global {
  interface Window {
    turnstile?: {
      render: (selector: string | HTMLElement, opts: Record<string, unknown>) => string;
      execute: (widgetId?: string, opts?: Record<string, unknown>) => void;
      reset: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string | undefined;
    };
  }
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

// ——— CHAT API ———
async function claudeComplete({
  messages,
  system,
  model,
  max_tokens,
}: {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  system?: string;
  model?: string;
  max_tokens?: number;
}) {
  const turnstileToken = TURNSTILE_SITE_KEY && typeof window !== "undefined"
    ? (window as unknown as { __turnstileToken?: string }).__turnstileToken
    : undefined;
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ messages, system, model, max_tokens, turnstileToken }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`chat failed ${res.status}: ${detail}`);
  }
  const data = await res.json();
  return data.text || "";
}

function buildSystemPrompt(p: Persona) {
  const phil = p.philosophy.map((x) => `- ${x}`).join("\n");
  return `${p.personaPrompt}

Your guiding principles:
${phil}

What you do NOT do: ${p.doesNot}

Stay in character at all times. If asked something outside your domain, redirect toward what you do care about. Use your own voice — analogies, cadence, signature phrases. Don't narrate that you're an AI or a persona.`;
}

// ——— ICONS ———
type IconProps = React.SVGProps<SVGSVGElement>;
const Icon = {
  chat: (p: IconProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  board: (p: IconProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 4v16"/></svg>,
  compare: (p: IconProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><rect x="3" y="5" width="8" height="14" rx="1"/><rect x="13" y="5" width="8" height="14" rx="1"/></svg>,
  org: (p: IconProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M12 7v4m0 0H5v5m7-5h7v5"/></svg>,
  close: (p: IconProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M18 6L6 18M6 6l12 12"/></svg>,
  send: (p: IconProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M4 20l16-8L4 4v6l10 2-10 2v6z"/></svg>,
  quote: (p: IconProps) => <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>,
  sparkle: (p: IconProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...p}><path d="M12 3v3m0 12v3m9-9h-3m-12 0H3m14.5-6.5l-2 2m-9 9l-2 2m13 0l-2-2m-9-9l-2-2"/></svg>,
};

// ——— PORTRAIT ———
function Portrait({ persona, size = 56, ring = true }: { persona: Persona; size?: number; ring?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => { setLoaded(false); setFailed(false); }, [persona?.id]);
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete) {
      if (img.naturalWidth > 0) setLoaded(true);
      else setFailed(true);
    }
  }, [persona?.id, persona?.portrait]);
  const initials = persona.name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("");
  const showImg = persona.portrait && !failed;
  return (
    <div
      className="portrait"
      style={{
        width: size, height: size,
        boxShadow: ring ? `0 0 0 1px ${persona.color}33, inset 0 0 0 1px rgba(255,255,255,0.04)` : "none",
        background: !showImg || !loaded ? `radial-gradient(circle at 30% 30%, ${persona.color}33, ${persona.color}0d 70%)` : undefined,
      }}
    >
      {showImg && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={persona.portrait}
          alt={persona.name}
          loading={persona.plugin === "great-minds" ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
      {(!showImg || !loaded) && (
        <div
          className="portrait-fallback"
          style={{
            color: persona.color,
            fontSize: Math.max(11, size * 0.32),
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}

// ——— PERSONA NODE (org chart tile) ———
function PersonaNode({ persona, onOpen, big, small }: { persona: Persona; onOpen?: (p: Persona) => void; big?: boolean; small?: boolean }) {
  const size = big ? 96 : small ? 64 : 80;
  return (
    <button
      className={`org-node ${big ? "big" : ""} ${small ? "small" : ""}`}
      onClick={() => onOpen?.(persona)}
      style={{ ["--accent" as string]: persona.color } as CSSProperties}
    >
      <Portrait persona={persona} size={size} />
      <div className="org-node-name">{persona.name}</div>
      <div className="org-node-role">{persona.title || persona.role}</div>
    </button>
  );
}

// ——— ORG CHART (Minds-only) ———
function OrgChart({ personas, onOpen }: { personas: Persona[]; onOpen: (p: Persona) => void }) {
  const board = personas.filter((p) => p.tier === "board");
  const directors = personas.filter((p) => p.tier === "director");
  const subsByDirector: Record<string, Persona[]> = {
    "steve-jobs": personas.filter((p) => p.reportsTo === "steve-jobs"),
    "elon-musk": personas.filter((p) => p.reportsTo === "elon-musk"),
  };
  return (
    <div className="org-wrap">
      <div className="org-row">
        <div className="org-label">BOARD OF DIRECTORS</div>
        <div className="org-row-inner">{board.map((p) => <PersonaNode key={p.id} persona={p} onOpen={onOpen} />)}</div>
      </div>
      <div className="org-connector" />
      <div className="org-row">
        <div className="org-label">DIRECTORS</div>
        <div className="org-row-inner">{directors.map((p) => <PersonaNode key={p.id} persona={p} onOpen={onOpen} />)}</div>
      </div>
      <div className="org-connector" />
      <div className="org-row org-subs">
        <div className="org-label">SUB-AGENTS</div>
        <div className="org-subs-grid">
          <div className="org-subs-group">
            <div className="org-subs-heading"><span className="org-subs-parent">under Steve</span></div>
            <div className="org-row-inner">{subsByDirector["steve-jobs"].map((p) => <PersonaNode key={p.id} persona={p} onOpen={onOpen} small />)}</div>
          </div>
          <div className="org-subs-group">
            <div className="org-subs-heading"><span className="org-subs-parent">under Elon</span></div>
            <div className="org-row-inner">{subsByDirector["elon-musk"].map((p) => <PersonaNode key={p.id} persona={p} onOpen={onOpen} small />)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ——— CHAT PANEL ———
function ChatPanel({ persona, embedded }: { persona: Persona; embedded?: boolean }) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMessages([]); setInput(""); }, [persona?.id]);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const send = useCallback(async (text?: string) => {
    const t = (text ?? input).trim();
    if (!t || loading) return;
    const next = [...messages, { role: "user" as const, content: t }];
    setMessages(next);
    setInput("");
    setLoading(true);
    const system = buildSystemPrompt(persona);
    const history = next.map((m) => `${m.role === "user" ? "User" : persona.name}: ${m.content}`).join("\n\n");
    try {
      const resp = await claudeComplete({
        messages: [{ role: "user", content: `${system}\n\n---\nConversation so far:\n${history}\n\n---\nRespond in character as ${persona.name}. Keep it punchy — usually 2-5 short paragraphs. Stay 100% in voice.` }],
      });
      setMessages([...next, { role: "assistant", content: resp }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "[offline — voice couldn't reach through]" }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, persona]);

  return (
    <div className={`chat ${embedded ? "embedded" : ""}`}>
      <div className="chat-scroll" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="chat-empty">
            <div className="chat-empty-label">Try asking</div>
            <div className="chat-prompt-list">
              {persona.samplePrompts.map((p, i) => (
                <button key={i} className="chat-prompt" onClick={() => send(p)} style={{ ["--accent" as string]: persona.color } as CSSProperties}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg msg-${m.role}`}>
            {m.role === "assistant" && <Portrait persona={persona} size={32} ring={false} />}
            <div className="msg-body" style={{ ["--accent" as string]: persona.color } as CSSProperties}>
              {m.role === "assistant" && <div className="msg-name">{persona.name}</div>}
              <div className="msg-content">{m.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="msg msg-assistant">
            <Portrait persona={persona} size={32} ring={false} />
            <div className="msg-body" style={{ ["--accent" as string]: persona.color } as CSSProperties}>
              <div className="msg-name">{persona.name}</div>
              <div className="msg-content"><span className="dot-typing"><i/><i/><i/></span></div>
            </div>
          </div>
        )}
      </div>
      <form
        className="chat-input"
        onSubmit={(e) => { e.preventDefault(); void send(); }}
        style={{ ["--accent" as string]: persona.color } as CSSProperties}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${persona.name.split(" ")[0]} anything…`}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()} aria-label="Send">
          <Icon.send width="16" height="16" />
        </button>
      </form>
    </div>
  );
}

// ——— DRAWER ———
function PersonaDrawer({ persona, onClose }: { persona: Persona | null; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  if (!persona) return null;
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()} style={{ ["--accent" as string]: persona.color } as CSSProperties}>
        <button className="drawer-close" onClick={onClose} aria-label="Close">
          <Icon.close width="18" height="18" />
        </button>
        <div className="drawer-grid">
          <div className="drawer-left">
            <div className="drawer-portrait-wrap">
              <Portrait persona={persona} size={180} />
              <div className="drawer-portrait-glow" />
            </div>
            <div className="drawer-role">{persona.role.toUpperCase()}</div>
            <h2 className="drawer-name">{persona.name}</h2>
            <div className="drawer-title">{persona.title}</div>
            <div className="drawer-tagline">{persona.tagline}</div>
            {persona.bio && (
              <div className="drawer-section">
                <div className="drawer-heading">Background</div>
                <p className="drawer-bio">{persona.bio}</p>
              </div>
            )}
            <div className="drawer-section">
              <div className="drawer-heading">Philosophy</div>
              <ul className="drawer-phil">
                {persona.philosophy.map((p, i) => (<li key={i}><Icon.quote width="12" height="12" /> {p}</li>))}
              </ul>
            </div>
            <div className="drawer-section">
              <div className="drawer-heading">Does not</div>
              <div className="drawer-donot">{persona.doesNot}</div>
            </div>
          </div>
          <div className="drawer-right">
            <div className="drawer-chat-heading">
              <Icon.chat width="14" height="14" />
              <span>Test the voice</span>
            </div>
            <ChatPanel persona={persona} embedded />
          </div>
        </div>
      </div>
    </div>
  );
}

// ——— BOARDROOM ———
function Boardroom({ personas }: { personas: Persona[] }) {
  const initialIds = personas.filter((p) => ["steve-jobs", "elon-musk", "warren-buffett", "shonda-rhimes"].includes(p.id)).map((p) => p.id);
  const [selected, setSelected] = useState<string[]>(initialIds.length ? initialIds : personas.slice(0, Math.min(4, personas.length)).map((p) => p.id));
  const [prd, setPrd] = useState("");
  const [reactions, setReactions] = useState<Record<string, { status: string; text: string }>>({});
  const [running, setRunning] = useState(false);

  const toggle = (id: string) => setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);

  const run = async () => {
    if (!prd.trim() || selected.length === 0 || running) return;
    setRunning(true);
    const init: Record<string, { status: string; text: string }> = {};
    selected.forEach((id) => { init[id] = { status: "pending", text: "" }; });
    setReactions(init);
    await Promise.all(selected.map(async (id) => {
      const p = personas.find((x) => x.id === id);
      if (!p) return;
      setReactions((prev) => ({ ...prev, [id]: { status: "thinking", text: "" } }));
      try {
        const sys = buildSystemPrompt(p);
        const resp = await claudeComplete({
          messages: [{ role: "user", content: `${sys}\n\n---\nA founder has submitted this PRD / idea for the board to react to:\n\n"""\n${prd}\n"""\n\nRespond as ${p.name} in 3–5 short punchy paragraphs. Start with a one-line verdict. Stay 100% in character. Push back, challenge, or approve — whatever ${p.name} would actually do.` }],
        });
        setReactions((prev) => ({ ...prev, [id]: { status: "done", text: resp } }));
      } catch {
        setReactions((prev) => ({ ...prev, [id]: { status: "error", text: "[voice unreachable]" } }));
      }
    }));
    setRunning(false);
  };

  const byTier: Record<string, Persona[]> = {
    board: personas.filter((p) => p.tier === "board"),
    director: personas.filter((p) => p.tier === "director"),
    sub: personas.filter((p) => p.tier === "sub"),
    specialist: personas.filter((p) => p.tier === "specialist"),
  };

  const examples = [
    "We want to build a browser extension that auto-responds to negative Google reviews for small business owners. $29/mo. Launch in 6 weeks.",
    "Pivot our B2B analytics tool into a consumer app that gamifies personal finance. Gen Z audience. Equity-funded.",
    "Replace our entire customer support team with an AI agent. Keep pricing the same. Roll out next quarter.",
  ];

  return (
    <div className="boardroom">
      <div className="boardroom-head">
        <div className="eyebrow">SESSION · 01</div>
        <h2 className="boardroom-title">Submit a PRD. Let the minds react.</h2>
        <p className="boardroom-sub">Paste an idea, strategy, or product brief. Pick who you want in the room. They&apos;ll each respond in character, in parallel.</p>
      </div>
      <div className="boardroom-grid">
        <div className="boardroom-col">
          <div className="boardroom-step">
            <div className="step-num">01</div>
            <div className="step-label">Your brief</div>
          </div>
          <textarea className="boardroom-textarea" placeholder="Paste your PRD, pitch, or product brief here…" value={prd} onChange={(e) => setPrd(e.target.value)} rows={10} />
          <div className="boardroom-examples">
            <div className="boardroom-examples-label">or try:</div>
            <div className="boardroom-examples-list">
              {examples.map((ex, i) => (
                <button key={i} className="boardroom-example" onClick={() => setPrd(ex)}>{ex}</button>
              ))}
            </div>
          </div>
          <div className="boardroom-step" style={{ marginTop: 32 }}>
            <div className="step-num">02</div>
            <div className="step-label">Who&apos;s in the room · <span className="muted">{selected.length} selected</span></div>
          </div>
          <div className="boardroom-picker">
            {(["board", "director", "sub", "specialist"] as const).filter((t) => byTier[t].length > 0).map((tier) => (
              <div key={tier} className="picker-tier">
                <div className="picker-tier-label">{tier === "board" ? "Board" : tier === "director" ? "Directors" : tier === "sub" ? "Sub-agents" : "Specialists"}</div>
                <div className="picker-tier-grid">
                  {byTier[tier].map((p) => (
                    <button
                      key={p.id}
                      className={`picker-chip ${selected.includes(p.id) ? "is-selected" : ""}`}
                      onClick={() => toggle(p.id)}
                      style={{ ["--accent" as string]: p.color } as CSSProperties}
                    >
                      <Portrait persona={p} size={28} ring={false} />
                      <span>{p.name.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button className="boardroom-run" onClick={run} disabled={running || !prd.trim() || selected.length === 0}>
            {running ? "Minds convening…" : "Convene the board →"}
          </button>
        </div>
        <div className="boardroom-col boardroom-out">
          <div className="boardroom-step">
            <div className="step-num">03</div>
            <div className="step-label">Reactions</div>
          </div>
          {Object.keys(reactions).length === 0 && (
            <div className="boardroom-empty">
              <div className="boardroom-empty-inner">
                <Icon.sparkle width="20" height="20" />
                <div>Awaiting the brief.</div>
                <div className="muted">Each persona responds in parallel, in character.</div>
              </div>
            </div>
          )}
          <div className="reactions">
            {selected.map((id) => {
              const p = personas.find((x) => x.id === id);
              const r = reactions[id];
              if (!p || !r) return null;
              return (
                <div key={id} className="reaction" style={{ ["--accent" as string]: p.color } as CSSProperties}>
                  <div className="reaction-head">
                    <Portrait persona={p} size={40} />
                    <div>
                      <div className="reaction-name">{p.name}</div>
                      <div className="reaction-role">{p.title}</div>
                    </div>
                    <div className={`reaction-status status-${r.status}`}>
                      {r.status === "thinking" ? "thinking…" : r.status === "done" ? "responded" : r.status === "error" ? "offline" : "queued"}
                    </div>
                  </div>
                  <div className="reaction-body">
                    {r.status === "thinking" ? <span className="dot-typing"><i/><i/><i/></span> : r.text}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ——— COMPARE ———
type DebateTurn = { round: number; label: string; side: "left" | "right"; status: "thinking" | "done"; text: string };

function Compare({ personas }: { personas: Persona[] }) {
  const [leftId, setLeftId] = useState("steve-jobs");
  const [rightId, setRightId] = useState("elon-musk");
  const [prompt, setPrompt] = useState("");
  const [answers, setAnswers] = useState<{ left: string | null; right: string | null }>({ left: null, right: null });
  const [running, setRunning] = useState(false);
  const [debate, setDebate] = useState<DebateTurn[]>([]);
  const [debating, setDebating] = useState(false);
  const [synthesis, setSynthesis] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const left = personas.find((p) => p.id === leftId) || personas[0];
  const right = personas.find((p) => p.id === rightId) || personas[1] || personas[0];

  useEffect(() => {
    if (!personas.find((p) => p.id === leftId) && personas[0]) setLeftId(personas[0].id);
    if (!personas.find((p) => p.id === rightId) && personas[1]) setRightId(personas[1].id);
  }, [personas, leftId, rightId]);

  if (!left || !right) {
    return <div className="compare"><p style={{ padding: 40, color: "var(--ink-dim)" }}>Need at least two personas to compare. Switch the discipline pill.</p></div>;
  }

  const marcus = personas.find((p) => p.id === "marcus-aurelius");
  const resetDebate = () => { setDebate([]); setSynthesis(null); };

  const ask = async () => {
    if (!prompt.trim() || running) return;
    setRunning(true);
    resetDebate();
    setAnswers({ left: "thinking", right: "thinking" });
    const runOne = async (side: "left" | "right", p: Persona) => {
      try {
        const sys = buildSystemPrompt(p);
        const resp = await claudeComplete({
          messages: [{ role: "user", content: `${sys}\n\n---\n${prompt}\n\n---\nRespond in character as ${p.name}. 3–5 short paragraphs. 100% in voice.` }],
        });
        setAnswers((prev) => ({ ...prev, [side]: resp }));
      } catch {
        setAnswers((prev) => ({ ...prev, [side]: "[voice unreachable]" }));
      }
    };
    await Promise.all([runOne("left", left), runOne("right", right)]);
    setRunning(false);
  };

  const startDebate = async () => {
    if (debating || !answers.left || !answers.right) return;
    if (answers.left === "thinking" || answers.right === "thinking") return;
    setDebating(true);
    setSynthesis(null);

    const rounds = [
      { label: "rebuttal", instr: "Challenge the weakest point in their answer. Be direct, stay in character. 2 short paragraphs." },
      { label: "closing", instr: "Final position. Acknowledge what (if anything) they got right, then land your conclusion. 2 short paragraphs." },
    ];
    const transcript = [{ who: left.name, text: answers.left }, { who: right.name, text: answers.right }];
    const allTurns: DebateTurn[] = [];

    for (let r = 0; r < rounds.length; r++) {
      const { label, instr } = rounds[r];
      const pending: DebateTurn[] = [
        { round: r + 1, label, side: "left", status: "thinking", text: "" },
        { round: r + 1, label, side: "right", status: "thinking", text: "" },
      ];
      allTurns.push(...pending);
      setDebate([...allTurns]);
      const runSide = async (side: "left" | "right", p: Persona, otherName: string) => {
        const sys = buildSystemPrompt(p);
        const history = transcript.map((t) => `${t.who}: ${t.text}`).join("\n\n");
        const content = `${sys}\n\n---\nOriginal question:\n"""\n${prompt}\n"""\n\nDebate so far:\n\n${history}\n\n---\nYou are ${p.name}. Your opponent is ${otherName}. ${instr} Stay 100% in character. Do not restate their words — respond to them.`;
        try {
          return await claudeComplete({ messages: [{ role: "user", content }] });
        } catch { return "[voice unreachable]"; }
      };
      const [lResp, rResp] = await Promise.all([runSide("left", left, right.name), runSide("right", right, left.name)]);
      const lIdx = allTurns.findIndex((t) => t.round === r + 1 && t.side === "left");
      const rIdx = allTurns.findIndex((t) => t.round === r + 1 && t.side === "right");
      allTurns[lIdx] = { ...allTurns[lIdx], status: "done", text: lResp };
      allTurns[rIdx] = { ...allTurns[rIdx], status: "done", text: rResp };
      setDebate([...allTurns]);
      transcript.push({ who: left.name, text: lResp });
      transcript.push({ who: right.name, text: rResp });
    }

    if (marcus) {
      setSynthesis("thinking");
      try {
        const sys = buildSystemPrompt(marcus);
        const full = transcript.map((t) => `${t.who}: ${t.text}`).join("\n\n");
        const content = `${sys}\n\n---\nTwo minds debated this question:\n"""\n${prompt}\n"""\n\nFull exchange:\n\n${full}\n\n---\nAs Marcus Aurelius, synthesize. 3 short paragraphs: (1) where they agreed in substance, (2) where the real disagreement lives, (3) the Stoic takeaway for the person who asked. Calm, measured, 100% in voice.`;
        const resp = await claudeComplete({ messages: [{ role: "user", content }] });
        setSynthesis(resp);
      } catch { setSynthesis("[voice unreachable]"); }
    }
    setDebating(false);
  };

  const buildExport = () => {
    const lines: string[] = [];
    const ts = new Date().toISOString();
    lines.push(`# Great Minds — Compare Thread`, "", `_Exported ${ts}_`, "", `## Question`, "", prompt || "_(no prompt)_", "", `## Initial Responses`, "");
    if (answers.left && answers.left !== "thinking") lines.push(`### ${left.name} · ${left.role}`, "", answers.left, "");
    if (answers.right && answers.right !== "thinking") lines.push(`### ${right.name} · ${right.role}`, "", answers.right, "");
    if (debate.length > 0) {
      lines.push(`## Debate`, "");
      [1, 2].forEach((r) => {
        const turns = debate.filter((t) => t.round === r && t.status === "done");
        if (turns.length === 0) return;
        lines.push(`### Round ${r} · ${turns[0].label}`, "");
        turns.forEach((t) => {
          const p = t.side === "left" ? left : right;
          lines.push(`**${p.name}:**`, "", t.text, "");
        });
      });
    }
    if (synthesis && synthesis !== "thinking" && marcus) {
      lines.push(`## Stoic Synthesis — ${marcus.name}`, "", synthesis, "");
    }
    return lines.join("\n");
  };

  const copyExport = async () => {
    try { await navigator.clipboard.writeText(buildExport()); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };
  const downloadExport = () => {
    const md = buildExport();
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    a.href = url; a.download = `great-minds-${left.id}-vs-${right.id}-${stamp}.md`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const canExport = (answers.left && answers.left !== "thinking") || (answers.right && answers.right !== "thinking");
  const examples = [
    "Should I raise a seed round or bootstrap?",
    "Review my homepage: one hero, three feature cards, testimonial, pricing.",
    "What's the one thing I should cut from my product?",
  ];

  return (
    <div className="compare">
      <div className="compare-head">
        <div className="eyebrow">A/B MINDS</div>
        <h2 className="compare-title">Same question. Two minds. See the gap.</h2>
      </div>
      <div className="compare-prompt-row">
        <textarea className="compare-textarea" placeholder="Ask them both the same thing…" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} />
        <button className="compare-run" onClick={ask} disabled={running || !prompt.trim()}>
          {running ? "Asking…" : "Ask both →"}
        </button>
      </div>
      <div className="compare-examples">
        {examples.map((e, i) => <button key={i} onClick={() => setPrompt(e)}>{e}</button>)}
      </div>
      <div className="compare-grid">
        {([{ side: "left" as const, p: left, setId: setLeftId, id: leftId }, { side: "right" as const, p: right, setId: setRightId, id: rightId }]).map(({ side, p, setId, id }) => (
          <div key={side} className="compare-col" style={{ ["--accent" as string]: p.color } as CSSProperties}>
            <div className="compare-col-head">
              <Portrait persona={p} size={56} />
              <div className="compare-col-meta">
                <select value={id} onChange={(e) => setId(e.target.value)} className="compare-select">
                  {personas.map((x) => <option key={x.id} value={x.id}>{x.name} · {x.role}</option>)}
                </select>
                <div className="compare-col-tag">{p.tagline}</div>
              </div>
            </div>
            <div className="compare-col-body">
              {!answers[side] && <div className="compare-col-empty">Awaiting prompt…</div>}
              {answers[side] === "thinking" && <span className="dot-typing"><i/><i/><i/></span>}
              {answers[side] && answers[side] !== "thinking" && <div className="compare-col-text">{answers[side]}</div>}
            </div>
          </div>
        ))}
      </div>
      {canExport && (
        <div className="export-bar">
          <button className="export-btn" onClick={copyExport}>{copied ? "Copied ✓" : "Copy as Markdown"}</button>
          <button className="export-btn" onClick={downloadExport}>Download .md</button>
        </div>
      )}
      {answers.left && answers.right && answers.left !== "thinking" && answers.right !== "thinking" && (
        <div className="debate">
          <div className="debate-head">
            <div className="eyebrow">THE DEBATE</div>
            <h3 className="debate-title">Let them argue it out.</h3>
            <p className="debate-sub">Two rounds of rebuttal &amp; closing, then a Stoic synthesis from Marcus Aurelius.</p>
            {debate.length === 0 && !debating && (<button className="debate-start" onClick={startDebate}>Start debate →</button>)}
            {debating && debate.length > 0 && <div className="debate-status">Debating… {debate.filter((t) => t.status === "done").length}/4 turns</div>}
          </div>
          {[1, 2].map((r) => {
            const turns = debate.filter((t) => t.round === r);
            if (turns.length === 0) return null;
            const label = turns[0].label;
            return (
              <div key={r} className="debate-round">
                <div className="debate-round-head">
                  <span className="debate-round-num">ROUND {r}</span>
                  <span className="debate-round-label">· {label}</span>
                </div>
                <div className="compare-grid">
                  {turns.map((t) => {
                    const p = t.side === "left" ? left : right;
                    return (
                      <div key={t.side} className="compare-col debate-turn" style={{ ["--accent" as string]: p.color } as CSSProperties}>
                        <div className="compare-col-head">
                          <Portrait persona={p} size={40} />
                          <div className="compare-col-meta">
                            <div className="debate-turn-name">{p.name}</div>
                            <div className="compare-col-tag">{t.label}</div>
                          </div>
                        </div>
                        <div className="compare-col-body">
                          {t.status === "thinking" && <span className="dot-typing"><i/><i/><i/></span>}
                          {t.status === "done" && <div className="compare-col-text">{t.text}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {synthesis && marcus && (
            <div className="synthesis" style={{ ["--accent" as string]: marcus.color } as CSSProperties}>
              <div className="synthesis-head">
                <Portrait persona={marcus} size={48} />
                <div>
                  <div className="synthesis-label">STOIC SYNTHESIS</div>
                  <div className="synthesis-name">{marcus.name}</div>
                </div>
              </div>
              <div className="synthesis-body">
                {synthesis === "thinking" ? <span className="dot-typing"><i/><i/><i/></span> : <div className="compare-col-text">{synthesis}</div>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ——— DISCIPLINE STRIP ———
function DisciplineStrip({ active, onChange, personas }: { active: string; onChange: (id: string) => void; personas: Persona[] }) {
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: personas.length };
    PLUGINS.forEach((p) => { c[p.id] = personas.filter((x) => x.plugin === p.id).length; });
    return c;
  }, [personas]);

  return (
    <div className="discipline-strip">
      <div className="discipline-strip-inner">
        {PLUGINS.map((p) => (
          <button
            key={p.id}
            className={`discipline-pill ${active === p.id ? "is-active" : ""}`}
            onClick={() => onChange(p.id)}
            style={{ ["--accent" as string]: p.accent } as CSSProperties}
          >
            {p.label} <span className="discipline-count">{counts[p.id] || 0}</span>
          </button>
        ))}
        <button
          className={`discipline-pill ${active === "all" ? "is-active" : ""}`}
          onClick={() => onChange("all")}
          style={{ ["--accent" as string]: "#E9A23B" } as CSSProperties}
        >
          All <span className="discipline-count">{counts.all}</span>
        </button>
      </div>
    </div>
  );
}

// ——— CONSTELLATION + ROSTER ———
function ConstellationOverview({ personas, onOpen }: { personas: Persona[]; onOpen: (p: Persona) => void }) {
  return (
    <div className="constellation">
      {PLUGINS.map((plugin) => {
        const group = personas.filter((p) => p.plugin === plugin.id && p.tier !== "founder");
        if (group.length === 0) return null;
        return (
          <section key={plugin.id} className="constellation-section" style={{ ["--accent" as string]: plugin.accent } as CSSProperties}>
            <div className="constellation-section-head">
              <div className="constellation-section-eyebrow">{plugin.label.toUpperCase()} <span className="constellation-section-count">· {group.length}</span></div>
              <div className="constellation-section-rule" />
            </div>
            <div className="plugin-roster-grid">
              {group.map((p) => (<PersonaNode key={p.id} persona={p} onOpen={onOpen} />))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function PluginRoster({ personas, onOpen }: { personas: Persona[]; onOpen: (p: Persona) => void }) {
  return (
    <div className="plugin-roster">
      <div className="plugin-roster-grid">
        {personas.map((p) => (<PersonaNode key={p.id} persona={p} onOpen={onOpen} />))}
      </div>
    </div>
  );
}

// ——— TEAM VIEW ———
function TeamView({ personas, pluginFilter, onOpen }: { personas: Persona[]; pluginFilter: string; onOpen: (p: Persona) => void }) {
  const isAll = pluginFilter === "all";
  const isMinds = pluginFilter === "great-minds";
  const activePlugin = PLUGINS.find((p) => p.id === pluginFilter);
  const totalMinds = personas.length;
  const disciplineCount = PLUGINS.length;
  return (
    <div className="team-view">
      <section className="hero">
        <div className="eyebrow">{activePlugin ? activePlugin.label.toUpperCase() : "THE CONSTELLATION"}</div>
        <h1 className="hero-title">
          <span className="hero-num">{totalMinds}</span>
          <span className="hero-word">{totalMinds === 1 ? "mind." : "minds."}</span>
          {isAll && <>
            <span className="hero-num">{disciplineCount}</span>
            <span className="hero-word">disciplines.</span>
          </>}
        </h1>
        <p className="hero-sub">
          {totalMinds} personas across {disciplineCount} disciplines. Click any portrait to read their philosophy and test their voice. Convene them in the boardroom. Compare two minds on the same question.
        </p>
      </section>
      {isAll && <ConstellationOverview personas={personas} onOpen={onOpen} />}
      {isMinds && <OrgChart personas={personas.filter((p) => p.plugin === "great-minds")} onOpen={onOpen} />}
      {!isAll && !isMinds && <PluginRoster personas={personas.filter((p) => p.tier !== "founder")} onOpen={onOpen} />}
    </div>
  );
}

// ——— TURNSTILE LOADER ———
function useTurnstile() {
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    if (document.querySelector('script[src*="turnstile"]')) return;
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true; s.defer = true;
    document.head.appendChild(s);
  }, []);
}

function TurnstileGate() {
  const [ready, setReady] = useState(false);
  useTurnstile();
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    const tick = setInterval(() => {
      if (window.turnstile) {
        clearInterval(tick);
        try {
          window.turnstile.render("#turnstile-host", {
            sitekey: TURNSTILE_SITE_KEY,
            size: "invisible",
            callback: (token: string) => {
              (window as unknown as { __turnstileToken?: string }).__turnstileToken = token;
              setReady(true);
            },
          });
          window.turnstile.execute();
        } catch {}
      }
    }, 200);
    return () => clearInterval(tick);
  }, []);
  if (!TURNSTILE_SITE_KEY) return null;
  return <div id="turnstile-host" style={{ position: "fixed", bottom: 8, right: 8, zIndex: 1, opacity: ready ? 0 : 0 }} />;
}

// ——— APP SHELL ———
export default function PersonaApp() {
  const [view, setView] = useState<"org" | "boardroom" | "compare">("org");
  const [active, setActive] = useState<Persona | null>(null);
  const [pluginFilter, setPluginFilter] = useState<string>("great-minds");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("gm_view") : null;
    if (stored === "org" || stored === "boardroom" || stored === "compare") setView(stored);
    const storedFilter = typeof window !== "undefined" ? localStorage.getItem("gm_plugin") : null;
    if (storedFilter) setPluginFilter(storedFilter);
  }, []);
  useEffect(() => { if (typeof window !== "undefined") localStorage.setItem("gm_view", view); }, [view]);
  useEffect(() => { if (typeof window !== "undefined") localStorage.setItem("gm_plugin", pluginFilter); }, [pluginFilter]);

  const allPersonas = useMemo(() => PERSONAS.filter((p) => p.tier !== "founder"), []);
  const personas = useMemo(
    () => pluginFilter === "all" ? allPersonas : allPersonas.filter((p) => p.plugin === pluginFilter),
    [pluginFilter, allPersonas],
  );

  return (
    <div className="app gm-personas-app" data-theme="dark">
      <header className="topbar topbar-subnav">
        <nav className="tabs">
          <button className={`tab ${view === "org" ? "is-active" : ""}`} onClick={() => setView("org")}><Icon.org width="14" height="14" /> <span>Team</span></button>
          <button className={`tab ${view === "boardroom" ? "is-active" : ""}`} onClick={() => setView("boardroom")}><Icon.board width="14" height="14" /> <span>Boardroom</span></button>
          <button className={`tab ${view === "compare" ? "is-active" : ""}`} onClick={() => setView("compare")}><Icon.compare width="14" height="14" /> <span>Compare</span></button>
        </nav>
      </header>
      {view === "org" && (
        <DisciplineStrip personas={allPersonas} active={pluginFilter} onChange={setPluginFilter} />
      )}
      <main className="main">
        {view === "org" && <TeamView personas={personas} pluginFilter={pluginFilter} onOpen={setActive} />}
        {view === "boardroom" && <Boardroom personas={personas} />}
        {view === "compare" && <Compare personas={personas} />}
      </main>
      {active && <PersonaDrawer persona={active} onClose={() => setActive(null)} />}
      <TurnstileGate />
    </div>
  );
}
