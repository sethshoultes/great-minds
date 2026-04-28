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
  const [pluginFilter, setPluginFilter] = useStateA(() => localStorage.getItem("gm_plugin") || "great-minds");

  const allPersonas = useMemoA(() => window.PERSONAS.filter(p => p.tier !== "founder"), []);
  const personas = useMemoA(
    () => pluginFilter === "all" ? allPersonas : allPersonas.filter(p => p.plugin === pluginFilter),
    [pluginFilter, allPersonas]
  );

  useEffectA(() => { localStorage.setItem("gm_plugin", pluginFilter); }, [pluginFilter]);

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
        <button
          className="brand"
          onClick={() => { setView("org"); setPluginFilter("all"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          aria-label="Home"
        >
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
        </button>
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
          <span className="count">{personas.length} minds · 0 meetings</span>
        </div>
      </header>

      {view === "org" && (
        <DisciplineStrip
          plugins={window.PLUGINS}
          personas={allPersonas}
          active={pluginFilter}
          onChange={setPluginFilter}
        />
      )}

      <main className="main">
        {view === "org" && <TeamView personas={personas} pluginFilter={pluginFilter} onOpen={setActive} />}
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

// ——— DISCIPLINE FILTER STRIP ———
function DisciplineStrip({ plugins, personas, active, onChange }) {
  const counts = useMemoA(() => {
    const c = { all: personas.length };
    plugins.forEach(p => { c[p.id] = personas.filter(x => x.plugin === p.id).length; });
    return c;
  }, [plugins, personas]);

  return (
    <div className="discipline-strip">
      <div className="discipline-strip-inner">
        {plugins.map(p => (
          <button
            key={p.id}
            className={`discipline-pill ${active === p.id ? "is-active" : ""}`}
            onClick={() => onChange(p.id)}
            style={{ '--accent': p.accent }}
          >
            {p.label} <span className="discipline-count">{counts[p.id] || 0}</span>
          </button>
        ))}
        <button
          className={`discipline-pill ${active === "all" ? "is-active" : ""}`}
          onClick={() => onChange("all")}
          style={{ '--accent': "#E9A23B" }}
        >
          All <span className="discipline-count">{counts.all}</span>
        </button>
      </div>
    </div>
  );
}

// ——— TEAM VIEW (hero + roster) ———
function TeamView({ personas, pluginFilter, onOpen }) {
  const isAll = pluginFilter === "all";
  const isMinds = pluginFilter === "great-minds";
  const activePlugin = window.PLUGINS.find(p => p.id === pluginFilter);
  const totalMinds = personas.length;
  const disciplineCount = window.PLUGINS.length;

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
          Ninety personas across nine disciplines. Click any portrait to read their philosophy and test their voice. Convene them in the boardroom. Compare two minds on the same question.
        </p>
      </section>

      {isAll && <ConstellationOverview personas={personas} onOpen={onOpen} />}
      {isMinds && <OrgChart personas={personas.filter(p => p.plugin === "great-minds" || p.tier === "founder")} onOpen={onOpen} />}
      {!isAll && !isMinds && <PluginRoster personas={personas.filter(p => p.tier !== "founder")} onOpen={onOpen} />}
    </div>
  );
}

// ——— CONSTELLATION OVERVIEW (all plugins, sectioned) ———
function ConstellationOverview({ personas, onOpen }) {
  return (
    <div className="constellation">
      {window.PLUGINS.map(plugin => {
        const group = personas.filter(p => p.plugin === plugin.id && p.tier !== "founder");
        if (group.length === 0) return null;
        return (
          <section key={plugin.id} className="constellation-section" style={{ '--accent': plugin.accent }}>
            <div className="constellation-section-head">
              <div className="constellation-section-eyebrow">{plugin.label.toUpperCase()} <span className="constellation-section-count">· {group.length}</span></div>
              <div className="constellation-section-rule" />
            </div>
            <div className="plugin-roster-grid">
              {group.map(p => (
                <PersonaNode key={p.id} persona={p} onOpen={onOpen} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ——— FLAT PLUGIN ROSTER (non-minds disciplines) ———
function PluginRoster({ personas, onOpen }) {
  return (
    <div className="plugin-roster">
      <div className="plugin-roster-grid">
        {personas.map(p => (
          <PersonaNode key={p.id} persona={p} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
