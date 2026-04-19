// Main app shell
const { useState: useStateA, useEffect: useEffectA, useMemo: useMemoA } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark"
}/*EDITMODE-END*/;

function App() {
  const [view, setView] = useStateA(() => localStorage.getItem("gm_view") || "org");
  const [active, setActive] = useStateA(null);
  const [theme, setTheme] = useStateA(TWEAK_DEFAULTS.theme);
  const [tweakMode, setTweakMode] = useStateA(false);

  const personas = window.PERSONAS;

  useEffectA(() => { localStorage.setItem("gm_view", view); }, [view]);

  // Tweak mode integration
  useEffectA(() => {
    const onMsg = (e) => {
      if (e.data?.type === "__activate_edit_mode") setTweakMode(true);
      if (e.data?.type === "__deactivate_edit_mode") setTweakMode(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  useEffectA(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setThemeAndPersist = (t) => {
    setTheme(t);
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { theme: t } }, "*");
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <svg viewBox="0 0 32 32" width="22" height="22" aria-hidden>
              <circle cx="16" cy="16" r="15" fill="none" stroke="currentColor" strokeWidth="1.2" />
              <path d="M10 20 L16 10 L22 20 Z" fill="currentColor" opacity="0.9" />
            </svg>
          </div>
          <div className="brand-text">
            <div className="brand-name">Great Minds</div>
            <div className="brand-sub">persona testbed · v0.1</div>
          </div>
        </div>
        <nav className="tabs">
          <button className={`tab ${view === "org" ? "is-active" : ""}`} onClick={() => setView("org")}>
            <Icon.org width="14" height="14" /> <span>Team</span>
          </button>
          <button className={`tab ${view === "boardroom" ? "is-active" : ""}`} onClick={() => setView("boardroom")}>
            <Icon.board width="14" height="14" /> <span>Boardroom</span>
          </button>
          <button className={`tab ${view === "compare" ? "is-active" : ""}`} onClick={() => setView("compare")}>
            <Icon.compare width="14" height="14" /> <span>Compare</span>
          </button>
        </nav>
        <div className="topbar-right">
          <span className="count">14 minds · 0 meetings</span>
        </div>
      </header>

      <main className="main">
        {view === "org" && <TeamView personas={personas} onOpen={setActive} />}
        {view === "boardroom" && <Boardroom personas={personas} />}
        {view === "compare" && <Compare personas={personas} />}
      </main>

      {active && <PersonaDrawer persona={active} onClose={() => setActive(null)} />}

      {tweakMode && (
        <div className="tweaks-panel">
          <div className="tweaks-head">
            <Icon.theme width="14" height="14" />
            <span>Tweaks</span>
          </div>
          <div className="tweaks-row">
            <label>Theme</label>
            <div className="tweaks-seg">
              {["dark", "editorial", "light"].map(t => (
                <button
                  key={t}
                  className={theme === t ? "is-active" : ""}
                  onClick={() => setThemeAndPersist(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ——— TEAM VIEW (hero + org chart) ———
function TeamView({ personas, onOpen }) {
  return (
    <div className="team-view">
      <section className="hero">
        <div className="eyebrow">THE TEAM</div>
        <h1 className="hero-title">
          <span className="hero-num">14</span>
          <span className="hero-word">minds.</span>
          <span className="hero-num">0</span>
          <span className="hero-word">meetings.</span>
        </h1>
        <p className="hero-sub">
          Every project runs the same five-phase pipeline. They have different values, different instincts, and different views of what makes something great. <em>That disagreement is load-bearing.</em>
        </p>
        <div className="hero-meta">
          <div className="meta-item"><span className="meta-num">01</span> Click any portrait → read the philosophy, test the voice.</div>
          <div className="meta-item"><span className="meta-num">02</span> <strong>Boardroom</strong> → submit a PRD, get reactions in parallel.</div>
          <div className="meta-item"><span className="meta-num">03</span> <strong>Compare</strong> → same question, two minds, see the gap.</div>
        </div>
      </section>

      <OrgChart personas={personas} onOpen={onOpen} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
