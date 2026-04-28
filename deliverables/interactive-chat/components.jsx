// Shared UI components for Great Minds Interactive
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ——— SVG ICONS ———
const Icon = {
  chat: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  board: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 4v16"/></svg>,
  compare: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><rect x="3" y="5" width="8" height="14" rx="1"/><rect x="13" y="5" width="8" height="14" rx="1"/></svg>,
  org: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><circle cx="12" cy="5" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M12 7v4m0 0H5v5m7-5h7v5"/></svg>,
  close: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><path d="M18 6L6 18M6 6l12 12"/></svg>,
  send: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><path d="M4 20l16-8L4 4v6l10 2-10 2v6z"/></svg>,
  quote: (props) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>,
  sparkle: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><path d="M12 3v3m0 12v3m9-9h-3m-12 0H3m14.5-6.5l-2 2m-9 9l-2 2m13 0l-2-2m-9-9l-2-2"/></svg>,
  theme: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.2 4.2l1.4 1.4m12.8 12.8l1.4 1.4M1 12h2m18 0h2M4.2 19.8l1.4-1.4m12.8-12.8l1.4-1.4"/></svg>,
  copy: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg>,
  check: (props) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}><path d="M5 12l5 5L20 7"/></svg>,
};

// ——— PORTRAIT ———
function Portrait({ persona, size = 56, className = "", ring = true }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef(null);
  useEffect(() => { setLoaded(false); setFailed(false); }, [persona?.id]);
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete) {
      if (img.naturalWidth > 0) setLoaded(true);
      else setFailed(true);
    }
  }, [persona?.id, persona?.portrait]);
  const initials = persona.name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("");
  const showImg = persona.portrait && !failed;
  return (
    <div
      className={"portrait " + className}
      style={{
        width: size, height: size,
        boxShadow: ring ? `0 0 0 1px ${persona.color}33, inset 0 0 0 1px rgba(255,255,255,0.04)` : "none",
        background: !showImg || !loaded ? `radial-gradient(circle at 30% 30%, ${persona.color}33, ${persona.color}0d 70%)` : undefined,
      }}
    >
      {showImg && (
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

// ——— PERSONA CARD (grid tile) ———
function PersonaCard({ persona, onOpen, selectable, selected, onToggleSelect, compact }) {
  return (
    <button
      className={`persona-card ${selected ? "is-selected" : ""} ${compact ? "compact" : ""}`}
      onClick={() => selectable ? onToggleSelect?.(persona.id) : onOpen?.(persona)}
      style={{ '--accent': persona.color }}
    >
      <div className="persona-card-head">
        <Portrait persona={persona} size={compact ? 44 : 64} />
        <div className="persona-card-head-text">
          <div className="persona-card-role">{persona.role}</div>
          <div className="persona-card-name">{persona.name}</div>
          <div className="persona-card-title">{persona.title}</div>
        </div>
        {selectable && (
          <div className="persona-card-check" aria-hidden>
            {selected ? <Icon.check width="14" height="14" /> : null}
          </div>
        )}
      </div>
      {!compact && (
        <div className="persona-card-tagline">{persona.tagline}</div>
      )}
      <div className="persona-card-tierbar" />
    </button>
  );
}

// ——— ORG CHART ———
function OrgChart({ personas, onOpen }) {
  const board = personas.filter(p => p.tier === "board");
  const directors = personas.filter(p => p.tier === "director");
  const subsByDirector = {
    "steve-jobs": personas.filter(p => p.reportsTo === "steve-jobs"),
    "elon-musk": personas.filter(p => p.reportsTo === "elon-musk"),
  };

  return (
    <div className="org-wrap">
      <div className="org-row">
        <div className="org-label">BOARD OF DIRECTORS</div>
        <div className="org-row-inner">
          {board.map(p => <PersonaNode key={p.id} persona={p} onOpen={onOpen} />)}
        </div>
      </div>

      <div className="org-connector" />

      <div className="org-row">
        <div className="org-label">DIRECTORS</div>
        <div className="org-row-inner">
          {directors.map(p => <PersonaNode key={p.id} persona={p} onOpen={onOpen} />)}
        </div>
      </div>

      <div className="org-connector" />

      <div className="org-row org-subs">
        <div className="org-label">SUB-AGENTS</div>
        <div className="org-subs-grid">
          <div className="org-subs-group">
            <div className="org-subs-heading">
              <span className="org-subs-parent">under Steve</span>
            </div>
            <div className="org-row-inner">
              {subsByDirector["steve-jobs"].map(p => <PersonaNode key={p.id} persona={p} onOpen={onOpen} small />)}
            </div>
          </div>
          <div className="org-subs-group">
            <div className="org-subs-heading">
              <span className="org-subs-parent">under Elon</span>
            </div>
            <div className="org-row-inner">
              {subsByDirector["elon-musk"].map(p => <PersonaNode key={p.id} persona={p} onOpen={onOpen} small />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonaNode({ persona, onOpen, big, small }) {
  const size = big ? 96 : small ? 64 : 80;
  return (
    <button
      className={`org-node ${big ? "big" : ""} ${small ? "small" : ""}`}
      onClick={() => onOpen?.(persona)}
      style={{ '--accent': persona.color }}
    >
      <Portrait persona={persona} size={size} />
      <div className="org-node-name">{persona.name}</div>
      <div className="org-node-role">{persona.title || persona.role}</div>
    </button>
  );
}

// ——— CHAT (single persona) ———
function ChatPanel({ persona, embedded }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => { setMessages([]); setInput(""); }, [persona?.id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const send = async (text) => {
    const t = (text ?? input).trim();
    if (!t || loading) return;
    const next = [...messages, { role: "user", content: t }];
    setMessages(next);
    setInput("");
    setLoading(true);

    const system = buildSystemPrompt(persona);
    const history = next.map(m => ({ role: m.role, content: m.content }));
    try {
      const resp = await window.claude.complete({
        messages: [{ role: "user", content: `${system}\n\n---\nConversation so far:\n${history.map(m => `${m.role === 'user' ? 'User' : persona.name}: ${m.content}`).join("\n\n")}\n\n---\nRespond in character as ${persona.name}. Keep it punchy — usually 2-5 short paragraphs. Stay 100% in voice.` }],
      });
      setMessages([...next, { role: "assistant", content: resp }]);
    } catch (e) {
      setMessages([...next, { role: "assistant", content: "[offline — voice couldn't reach through]" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`chat ${embedded ? "embedded" : ""}`}>
      <div className="chat-scroll" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="chat-empty">
            <div className="chat-empty-label">Try asking</div>
            <div className="chat-prompt-list">
              {persona.samplePrompts.map((p, i) => (
                <button key={i} className="chat-prompt" onClick={() => send(p)} style={{ '--accent': persona.color }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg msg-${m.role}`}>
            {m.role === "assistant" && <Portrait persona={persona} size={32} ring={false} />}
            <div className="msg-body" style={{ '--accent': persona.color }}>
              {m.role === "assistant" && <div className="msg-name">{persona.name}</div>}
              <div className="msg-content">{m.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="msg msg-assistant">
            <Portrait persona={persona} size={32} ring={false} />
            <div className="msg-body" style={{ '--accent': persona.color }}>
              <div className="msg-name">{persona.name}</div>
              <div className="msg-content"><span className="dot-typing"><i/><i/><i/></span></div>
            </div>
          </div>
        )}
      </div>
      <form
        className="chat-input"
        onSubmit={(e) => { e.preventDefault(); send(); }}
        style={{ '--accent': persona.color }}
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

function buildSystemPrompt(persona) {
  const phil = persona.philosophy.map(p => `- ${p}`).join("\n");
  return `${persona.personaPrompt}

Your guiding principles:
${phil}

What you do NOT do: ${persona.doesNot}

Stay in character at all times. If asked something outside your domain, redirect toward what you do care about. Use your own voice — analogies, cadence, signature phrases. Don't narrate that you're an AI or a persona.`;
}

Object.assign(window, {
  Icon, Portrait, PersonaCard, OrgChart, PersonaNode, ChatPanel, buildSystemPrompt,
});
