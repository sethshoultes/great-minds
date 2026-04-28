// Detail drawer, Boardroom, Compare views
const { useState: useState2, useEffect: useEffect2, useRef: useRef2, useMemo: useMemo2 } = React;

// ——— DETAIL DRAWER ———
function PersonaDrawer({ persona, onClose }) {
  useEffect2(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!persona) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()} style={{ '--accent': persona.color }}>
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
                {persona.philosophy.map((p, i) => (
                  <li key={i}><Icon.quote width="12" height="12" /> {p}</li>
                ))}
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

// ——— BOARDROOM (multi-persona PRD reactions) ———
function Boardroom({ personas }) {
  const [selected, setSelected] = useState2(["steve-jobs", "elon-musk", "warren-buffett", "shonda-rhimes"]);
  const [prd, setPrd] = useState2("");
  const [reactions, setReactions] = useState2({}); // { id: { status, text } }
  const [running, setRunning] = useState2(false);

  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const run = async () => {
    if (!prd.trim() || selected.length === 0 || running) return;
    setRunning(true);
    const init = {};
    selected.forEach(id => { init[id] = { status: "pending", text: "" }; });
    setReactions(init);

    // Run in parallel
    await Promise.all(selected.map(async (id) => {
      const p = personas.find(x => x.id === id);
      setReactions(prev => ({ ...prev, [id]: { status: "thinking", text: "" } }));
      try {
        const sys = buildSystemPrompt(p);
        const resp = await window.claude.complete({
          messages: [{ role: "user", content: `${sys}\n\n---\nA founder has submitted this PRD / idea for the board to react to:\n\n"""\n${prd}\n"""\n\nRespond as ${p.name} in 3–5 short punchy paragraphs. Start with a one-line verdict. Stay 100% in character. Push back, challenge, or approve — whatever ${p.name} would actually do.` }],
        });
        setReactions(prev => ({ ...prev, [id]: { status: "done", text: resp } }));
      } catch (e) {
        setReactions(prev => ({ ...prev, [id]: { status: "error", text: "[voice unreachable]" } }));
      }
    }));
    setRunning(false);
  };

  const byTier = {
    board: personas.filter(p => p.tier === "board"),
    director: personas.filter(p => p.tier === "director"),
    sub: personas.filter(p => p.tier === "sub"),
    specialist: personas.filter(p => p.tier === "specialist"),
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
        <p className="boardroom-sub">Paste an idea, strategy, or product brief. Pick who you want in the room. They'll each respond in character, in parallel.</p>
      </div>

      <div className="boardroom-grid">
        <div className="boardroom-col">
          <div className="boardroom-step">
            <div className="step-num">01</div>
            <div className="step-label">Your brief</div>
          </div>
          <textarea
            className="boardroom-textarea"
            placeholder="Paste your PRD, pitch, or product brief here…"
            value={prd}
            onChange={(e) => setPrd(e.target.value)}
            rows={10}
          />
          <div className="boardroom-examples">
            <div className="boardroom-examples-label">or try:</div>
            <div className="boardroom-examples-list">
              {examples.map((ex, i) => (
                <button key={i} className="boardroom-example" onClick={() => setPrd(ex)}>
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <div className="boardroom-step" style={{ marginTop: 32 }}>
            <div className="step-num">02</div>
            <div className="step-label">Who's in the room · <span className="muted">{selected.length} selected</span></div>
          </div>
          <div className="boardroom-picker">
            {["board", "director", "sub", "specialist"].filter(t => byTier[t].length > 0).map(tier => (
              <div key={tier} className="picker-tier">
                <div className="picker-tier-label">{tier === "board" ? "Board" : tier === "director" ? "Directors" : tier === "sub" ? "Sub-agents" : "Specialists"}</div>
                <div className="picker-tier-grid">
                  {byTier[tier].map(p => (
                    <button
                      key={p.id}
                      className={`picker-chip ${selected.includes(p.id) ? "is-selected" : ""}`}
                      onClick={() => toggle(p.id)}
                      style={{ '--accent': p.color }}
                    >
                      <Portrait persona={p} size={28} ring={false} />
                      <span>{p.name.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button
            className="boardroom-run"
            onClick={run}
            disabled={running || !prd.trim() || selected.length === 0}
          >
            {running ? "Minds convening…" : `Convene the board →`}
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
            {selected.map(id => {
              const p = personas.find(x => x.id === id);
              const r = reactions[id];
              if (!r) return null;
              return (
                <div key={id} className="reaction" style={{ '--accent': p.color }}>
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

// ——— COMPARE (side-by-side, same prompt) ———
function Compare({ personas }) {
  const [leftId, setLeftId] = useState2("steve-jobs");
  const [rightId, setRightId] = useState2("elon-musk");
  const [prompt, setPrompt] = useState2("");
  const [answers, setAnswers] = useState2({ left: null, right: null });
  const [running, setRunning] = useState2(false);
  const [debate, setDebate] = useState2([]); // [{ round, side, status, text }]
  const [debating, setDebating] = useState2(false);
  const [synthesis, setSynthesis] = useState2(null); // string | "thinking" | null

  const left = personas.find(p => p.id === leftId) || personas[0];
  const right = personas.find(p => p.id === rightId) || personas[1] || personas[0];
  useEffect2(() => {
    if (!personas.find(p => p.id === leftId) && personas[0]) setLeftId(personas[0].id);
    if (!personas.find(p => p.id === rightId) && personas[1]) setRightId(personas[1].id);
  }, [personas]);
  if (!left || !right) return <div className="compare"><p style={{padding: 40, color: "var(--ink-dim)"}}>Need at least two personas to compare. Switch the discipline pill.</p></div>;
  const marcus = personas.find(p => p.id === "marcus-aurelius");

  const resetDebate = () => { setDebate([]); setSynthesis(null); };

  const buildExport = () => {
    const lines = [];
    const ts = new Date().toISOString();
    lines.push(`# Great Minds — Compare Thread`);
    lines.push(``);
    lines.push(`_Exported ${ts}_`);
    lines.push(``);
    lines.push(`## Question`);
    lines.push(``);
    lines.push(prompt || "_(no prompt)_");
    lines.push(``);
    lines.push(`## Initial Responses`);
    lines.push(``);
    if (answers.left && answers.left !== "thinking") {
      lines.push(`### ${left.name} · ${left.role}`);
      lines.push(``);
      lines.push(answers.left);
      lines.push(``);
    }
    if (answers.right && answers.right !== "thinking") {
      lines.push(`### ${right.name} · ${right.role}`);
      lines.push(``);
      lines.push(answers.right);
      lines.push(``);
    }
    if (debate.length > 0) {
      lines.push(`## Debate`);
      lines.push(``);
      [1, 2].forEach(r => {
        const turns = debate.filter(t => t.round === r && t.status === "done");
        if (turns.length === 0) return;
        lines.push(`### Round ${r} · ${turns[0].label}`);
        lines.push(``);
        turns.forEach(t => {
          const p = t.side === "left" ? left : right;
          lines.push(`**${p.name}:**`);
          lines.push(``);
          lines.push(t.text);
          lines.push(``);
        });
      });
    }
    if (synthesis && synthesis !== "thinking" && marcus) {
      lines.push(`## Stoic Synthesis — ${marcus.name}`);
      lines.push(``);
      lines.push(synthesis);
      lines.push(``);
    }
    return lines.join("\n");
  };

  const [copied, setCopied] = useState2(false);
  const copyExport = async () => {
    try {
      await navigator.clipboard.writeText(buildExport());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };
  const downloadExport = () => {
    const md = buildExport();
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    a.href = url;
    a.download = `great-minds-${left.id}-vs-${right.id}-${stamp}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const canExport = (answers.left && answers.left !== "thinking") || (answers.right && answers.right !== "thinking");

  const ask = async () => {
    if (!prompt.trim() || running) return;
    setRunning(true);
    resetDebate();
    setAnswers({ left: "thinking", right: "thinking" });
    const run = async (side, p) => {
      try {
        const sys = buildSystemPrompt(p);
        const resp = await window.claude.complete({
          messages: [{ role: "user", content: `${sys}\n\n---\n${prompt}\n\n---\nRespond in character as ${p.name}. 3–5 short paragraphs. 100% in voice.` }],
        });
        setAnswers(prev => ({ ...prev, [side]: resp }));
      } catch {
        setAnswers(prev => ({ ...prev, [side]: "[voice unreachable]" }));
      }
    };
    await Promise.all([run("left", left), run("right", right)]);
    setRunning(false);
  };

  const startDebate = async () => {
    if (debating) return;
    if (!answers.left || !answers.right) return;
    if (answers.left === "thinking" || answers.right === "thinking") return;
    setDebating(true);
    setSynthesis(null);

    const rounds = [
      { label: "rebuttal", instr: "Challenge the weakest point in their answer. Be direct, stay in character. 2 short paragraphs." },
      { label: "closing", instr: "Final position. Acknowledge what (if anything) they got right, then land your conclusion. 2 short paragraphs." },
    ];

    const transcript = [
      { who: left.name, text: answers.left },
      { who: right.name, text: answers.right },
    ];

    const allTurns = [];

    for (let r = 0; r < rounds.length; r++) {
      const { label, instr } = rounds[r];

      const pending = [
        { round: r + 1, label, side: "left", status: "thinking", text: "" },
        { round: r + 1, label, side: "right", status: "thinking", text: "" },
      ];
      allTurns.push(...pending);
      setDebate([...allTurns]);

      const runSide = async (side, p, otherName) => {
        const sys = buildSystemPrompt(p);
        const history = transcript.map(t => `${t.who}: ${t.text}`).join("\n\n");
        const content = `${sys}\n\n---\nOriginal question:\n"""\n${prompt}\n"""\n\nDebate so far:\n\n${history}\n\n---\nYou are ${p.name}. Your opponent is ${otherName}. ${instr} Stay 100% in character. Do not restate their words — respond to them.`;
        try {
          const resp = await window.claude.complete({
            messages: [{ role: "user", content }],
          });
          return resp;
        } catch {
          return "[voice unreachable]";
        }
      };

      const [lResp, rResp] = await Promise.all([
        runSide("left", left, right.name),
        runSide("right", right, left.name),
      ]);

      const lIdx = allTurns.findIndex(t => t.round === r + 1 && t.side === "left");
      const rIdx = allTurns.findIndex(t => t.round === r + 1 && t.side === "right");
      allTurns[lIdx] = { ...allTurns[lIdx], status: "done", text: lResp };
      allTurns[rIdx] = { ...allTurns[rIdx], status: "done", text: rResp };
      setDebate([...allTurns]);

      transcript.push({ who: left.name, text: lResp });
      transcript.push({ who: right.name, text: rResp });
    }

    // Marcus synthesis
    if (marcus) {
      setSynthesis("thinking");
      try {
        const sys = buildSystemPrompt(marcus);
        const full = transcript.map(t => `${t.who}: ${t.text}`).join("\n\n");
        const content = `${sys}\n\n---\nTwo minds debated this question:\n"""\n${prompt}\n"""\n\nFull exchange:\n\n${full}\n\n---\nAs Marcus Aurelius, synthesize. 3 short paragraphs: (1) where they agreed in substance, (2) where the real disagreement lives, (3) the Stoic takeaway for the person who asked. Calm, measured, 100% in voice.`;
        const resp = await window.claude.complete({ messages: [{ role: "user", content }] });
        setSynthesis(resp);
      } catch {
        setSynthesis("[voice unreachable]");
      }
    }

    setDebating(false);
  };

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
        <textarea
          className="compare-textarea"
          placeholder="Ask them both the same thing…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />
        <button className="compare-run" onClick={ask} disabled={running || !prompt.trim()}>
          {running ? "Asking…" : "Ask both →"}
        </button>
      </div>

      <div className="compare-examples">
        {examples.map((e, i) => <button key={i} onClick={() => setPrompt(e)}>{e}</button>)}
      </div>

      <div className="compare-grid">
        {[{ side: "left", p: left, setId: setLeftId, id: leftId }, { side: "right", p: right, setId: setRightId, id: rightId }].map(({ side, p, setId, id }) => (
          <div key={side} className="compare-col" style={{ '--accent': p.color }}>
            <div className="compare-col-head">
              <Portrait persona={p} size={56} />
              <div className="compare-col-meta">
                <select value={id} onChange={(e) => setId(e.target.value)} className="compare-select">
                  {personas.map(x => <option key={x.id} value={x.id}>{x.name} · {x.role}</option>)}
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
            {debate.length === 0 && !debating && (
              <button className="debate-start" onClick={startDebate}>Start debate →</button>
            )}
            {debating && debate.length > 0 && <div className="debate-status">Debating… {debate.filter(t => t.status === "done").length}/4 turns</div>}
          </div>

          {[1, 2].map(r => {
            const turns = debate.filter(t => t.round === r);
            if (turns.length === 0) return null;
            const label = turns[0].label;
            return (
              <div key={r} className="debate-round">
                <div className="debate-round-head">
                  <span className="debate-round-num">ROUND {r}</span>
                  <span className="debate-round-label">· {label}</span>
                </div>
                <div className="compare-grid">
                  {turns.map(t => {
                    const p = t.side === "left" ? left : right;
                    return (
                      <div key={t.side} className="compare-col debate-turn" style={{ '--accent': p.color }}>
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
            <div className="synthesis" style={{ '--accent': marcus.color }}>
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

Object.assign(window, { PersonaDrawer, Boardroom, Compare });
