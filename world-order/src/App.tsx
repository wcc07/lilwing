import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, BookOpen, ChartNoAxesCombined, Check, ChevronDown, CircleHelp,
  Clock3, Crown, Factory, Flag, Handshake, Heart, Landmark, Menu, Save,
  Shield, Swords, Users, X
} from "lucide-react";

type NationId = "usa" | "ussr" | "china" | "uk";
type MetricKey = "economy" | "happiness" | "stability" | "military" | "diplomacy" | "technology";

type Nation = {
  id: NationId; name: string; flag: string; government: string; economyType: string;
  population: number; gdp: number; economy: number; happiness: number; stability: number;
  military: number; diplomacy: number; technology: number; description: string;
};

type Choice = { id: string; icon: string; title: string; description: string; effects: Partial<Record<MetricKey, number>>; result: string };

const nations: Record<NationId, Nation> = {
  usa: {
    id: "usa", name: "United States", flag: "🇺🇸", government: "Federal presidential republic",
    economyType: "Mixed market economy", population: 131, gdp: 1.3, economy: 72, happiness: 66,
    stability: 76, military: 82, diplomacy: 78, technology: 74,
    description: "An industrial giant with vast resources, growing global responsibilities, and a debate over how deeply to engage with the world."
  },
  ussr: {
    id: "ussr", name: "Soviet Union", flag: "☭", government: "One-party communist state",
    economyType: "State-directed planned economy", population: 170, gdp: 0.4, economy: 43, happiness: 54,
    stability: 70, military: 78, diplomacy: 65, technology: 58,
    description: "A centralized state mobilizing industry and security institutions while managing internal pressures and a changing international environment."
  },
  china: {
    id: "china", name: "China", flag: "🇨🇳", government: "Republic under Nationalist leadership",
    economyType: "Predominantly agrarian economy", population: 500, gdp: 0.1, economy: 25, happiness: 48,
    stability: 35, military: 42, diplomacy: 50, technology: 22,
    description: "A populous country facing internal fragmentation, external pressure, and a consequential struggle over its political future."
  },
  uk: {
    id: "uk", name: "United Kingdom", flag: "🇬🇧", government: "Parliamentary constitutional monarchy",
    economyType: "Industrial and financial economy", population: 48, gdp: 0.3, economy: 69, happiness: 65,
    stability: 82, military: 74, diplomacy: 85, technology: 71,
    description: "An established global power balancing its international commitments, economic resilience, and the costs of maintaining influence."
  }
};

const yearOptions = [
  { year: 1939, label: "1939 · A world on the brink" },
  { year: 1945, label: "1945 · Build the postwar order" },
  { year: 1991, label: "1991 · The Cold War ends" },
  { year: 2020, label: "2020 · A changing world order" }
];

const metricInfo: { key: MetricKey; label: string; icon: typeof Factory; hint: string }[] = [
  { key: "economy", label: "Economic development", icon: Factory, hint: "Industrial capacity, productivity, and resources." },
  { key: "happiness", label: "Public happiness", icon: Heart, hint: "Public wellbeing and confidence in the government." },
  { key: "stability", label: "Political stability", icon: Landmark, hint: "Institutional strength and risk of internal unrest." },
  { key: "military", label: "Military strength", icon: Swords, hint: "Readiness, capability, and deterrence." },
  { key: "diplomacy", label: "Diplomatic influence", icon: Handshake, hint: "Ability to build coalitions and shape negotiations." },
  { key: "technology", label: "Technology", icon: ChartNoAxesCombined, hint: "Scientific, technical, and industrial sophistication." }
];

function getScenario(year: number, nation: Nation): { kicker: string; title: string; body: string; choices: Choice[] } {
  if (year === 1939) return {
    kicker: "EUROPEAN SECURITY CRISIS",
    title: "The international order is under strain",
    body: `${nation.description} Intelligence and diplomatic reports suggest that a regional crisis could redraw the balance of power. Your cabinet is divided: some favor restraint, while others argue that failing to act now may make future threats harder to manage.`,
    choices: [
      { id: "talk", icon: "🤝", title: "Open diplomatic talks", description: "Seek a negotiated settlement and clarify the rival's intentions.", effects: { diplomacy: 5, stability: 2 }, result: "Your diplomats establish a channel for talks. The crisis is not resolved, but communication improves and allies welcome the attempt to reduce uncertainty." },
      { id: "defense", icon: "🛡️", title: "Strengthen defensive readiness", description: "Reassure allies and improve the country's ability to deter aggression.", effects: { military: 5, diplomacy: 1, economy: -2 }, result: "Readiness improves and allies feel reassured. However, the spending comes at a cost, and rival officials publicly question your intentions." },
      { id: "intel", icon: "🕵️", title: "Gather intelligence", description: "Invest in information before making an irreversible commitment.", effects: { stability: 2, diplomacy: 1, technology: 2 }, result: "Your intelligence services deliver a more nuanced picture. Some uncertainty remains, but your cabinet has more time and better information before choosing its next move." }
    ]
  };
  if (year === 1945) return {
    kicker: "POSTWAR SETTLEMENT",
    title: "A new international order must be built",
    body: `${nation.description} War has transformed global power. Your government must decide how to shape the peace, manage reconstruction, and respond to allies who may become competitors.`,
    choices: [
      { id: "institutions", icon: "🌐", title: "Invest in international institutions", description: "Build rules and forums to manage disputes peacefully.", effects: { diplomacy: 6, stability: 2, economy: -1 }, result: "Your country gains diplomatic credibility and helps create channels for future cooperation. Institutions cannot eliminate rivalry, but they can make bargaining easier." },
      { id: "rebuild", icon: "🏗️", title: "Prioritize reconstruction", description: "Direct resources toward recovery and productive capacity.", effects: { economy: 6, happiness: 3, military: -1 }, result: "Reconstruction improves economic prospects and public confidence. Some security officials worry that resources for immediate military readiness are being stretched." },
      { id: "power", icon: "⚖️", title: "Secure a favorable balance of power", description: "Consolidate alliances and protect strategic interests.", effects: { military: 3, diplomacy: 3, stability: -1 }, result: "Your strategic position improves, though rival powers become more attentive to your ambitions and may seek counterbalancing partnerships." }
    ]
  };
  if (year === 1991) return {
    kicker: "A WORLD IN TRANSITION",
    title: "The balance of power is shifting",
    body: `${nation.description} A major geopolitical era is ending. Leaders must decide whether to pursue cooperation, secure advantages, or prepare for a less predictable future.`,
    choices: [
      { id: "cooperate", icon: "🕊️", title: "Pursue a cooperative settlement", description: "Reduce tensions and create durable diplomatic commitments.", effects: { diplomacy: 6, stability: 3, military: -1 }, result: "Relations improve and new diplomatic channels open. The long-term success of the settlement will depend on whether all sides believe the commitments will endure." },
      { id: "reform", icon: "📈", title: "Modernize the economy", description: "Invest in productivity, trade, and technological development.", effects: { economy: 5, technology: 4, happiness: 2 }, result: "Your modernization program begins to improve the country's long-run prospects, although the transition creates winners and losers at home." },
      { id: "influence", icon: "🧭", title: "Expand regional influence", description: "Strengthen partnerships and preserve strategic options.", effects: { diplomacy: 3, military: 2, stability: -1 }, result: "Your government gains new leverage, but neighboring countries begin to reassess their own security and alliances." }
    ]
  };
  return {
    kicker: "GLOBAL SYSTEM UNDER PRESSURE",
    title: "Domestic resilience meets strategic rivalry",
    body: `${nation.description} Public health, economic disruption, and strategic competition are testing governments around the world. Your administration must balance immediate domestic needs with long-term national influence.`,
    choices: [
      { id: "welfare", icon: "💗", title: "Support households and businesses", description: "Use public resources to cushion the economic shock.", effects: { happiness: 6, stability: 2, economy: -2 }, result: "Households receive support and public confidence rises. The policy costs money now, so your government will need to manage the fiscal trade-off." },
      { id: "alliances", icon: "🤝", title: "Coordinate with allies", description: "Share information and align responses to common risks.", effects: { diplomacy: 5, technology: 2 }, result: "Coordination improves and partners share more information. Cooperation strengthens your response, though partners do not always agree on priorities." },
      { id: "industry", icon: "🏭", title: "Build strategic capacity", description: "Invest in supply chains, research, and domestic resilience.", effects: { economy: 3, technology: 5, happiness: 1 }, result: "Strategic industries receive support and future resilience improves. The benefits will take time, and the government must choose which sectors to prioritize." }
    ]
  };
}

function clamp(value: number) { return Math.max(0, Math.min(100, value)); }

export default function App() {
  const [nationId, setNationId] = useState<NationId>("usa");
  const [startYear, setStartYear] = useState(1939);
  const [started, setStarted] = useState(false);
  const [currentYear, setCurrentYear] = useState(1939);
  const [metrics, setMetrics] = useState<Record<MetricKey, number>>({ economy: 72, happiness: 66, stability: 76, military: 82, diplomacy: 78, technology: 74 });
  const [eventLog, setEventLog] = useState<string[]>([]);
  const [latestResult, setLatestResult] = useState("");
  const [showTheory, setShowTheory] = useState(false);
  const [showMobileProfile, setShowMobileProfile] = useState(false);

  const nation = nations[nationId];
  const scenario = useMemo(() => getScenario(currentYear, nation), [currentYear, nation]);
  const campaignKey = "world-order-save-v1";

  useEffect(() => {
    if (started) {
      const save = { nationId, startYear, currentYear, metrics, eventLog, latestResult };
      localStorage.setItem(campaignKey, JSON.stringify(save));
    }
  }, [started, nationId, startYear, currentYear, metrics, eventLog, latestResult]);

  function beginCampaign() {
    setCurrentYear(startYear);
    const n = nations[nationId];
    setMetrics({ economy: n.economy, happiness: n.happiness, stability: n.stability, military: n.military, diplomacy: n.diplomacy, technology: n.technology });
    setEventLog([]);
    setLatestResult("");
    setShowTheory(false);
    setStarted(true);
  }

  function chooseOption(choice: Choice) {
    setMetrics(prev => {
      const next = { ...prev };
      (Object.keys(choice.effects) as MetricKey[]).forEach(key => {
        next[key] = clamp(next[key] + (choice.effects[key] ?? 0));
      });
      return next;
    });
    setLatestResult(choice.result);
    setEventLog(prev => [`${currentYear}: ${choice.title}`, ...prev].slice(0, 8));
    setShowTheory(false);
  }

  function advanceYear() {
    setCurrentYear(y => Math.min(2026, y + 1));
    setLatestResult("");
    setShowTheory(false);
  }

  function loadCampaign() {
    const raw = localStorage.getItem(campaignKey);
    if (!raw) { alert("No saved campaign found in this browser yet."); return; }
    try {
      const saved = JSON.parse(raw);
      setNationId(saved.nationId);
      setStartYear(saved.startYear);
      setCurrentYear(saved.currentYear);
      setMetrics(saved.metrics);
      setEventLog(saved.eventLog ?? []);
      setLatestResult(saved.latestResult ?? "");
      setStarted(true);
    } catch { alert("The saved campaign could not be loaded."); }
  }

  function resetCampaign() {
    if (!confirm("Start a new campaign? Your current browser save will be replaced.")) return;
    setStarted(false);
    setLatestResult("");
    setEventLog([]);
    setShowTheory(false);
  }

  const profilePanel = (
    <div className="profile-content">
      <div className="nation-heading">
        <div className="flag-tile">{nation.flag}</div>
        <div><div className="eyebrow">NATIONAL PROFILE</div><h2>{nation.name}</h2><p>{currentYear} campaign year</p></div>
      </div>
      <div className="profile-stat-grid">
        <div className="stat-card"><Users size={18}/><span>Population</span><strong>{(nation.population * (currentYear >= 2000 ? 2.5 : currentYear >= 1990 ? 2.1 : currentYear >= 1950 ? 1.5 : 1)).toFixed(0)}M</strong><small>Approx. era estimate</small></div>
        <div className="stat-card"><ChartNoAxesCombined size={18}/><span>Economic level</span><strong>{metrics.economy}<small className="out-of">/100</small></strong><small>Game index</small></div>
        <div className="stat-card"><Heart size={18}/><span>Public happiness</span><strong>{metrics.happiness}<small className="out-of">/100</small></strong><div className="meter pink"><i style={{width: `${metrics.happiness}%`}}/></div></div>
        <div className="stat-card"><Shield size={18}/><span>Political stability</span><strong>{metrics.stability}<small className="out-of">/100</small></strong><div className="meter green"><i style={{width: `${metrics.stability}%`}}/></div></div>
      </div>
      <div className="profile-facts">
        <div className="fact-row"><Landmark size={17}/><div><small>Type of government</small><strong>{currentYear >= 2026 && nationId === "china" ? "One-party socialist republic" : currentYear >= 2026 && nationId === "usa" ? "Federal presidential republic" : nation.government}</strong></div></div>
        <div className="fact-row"><Factory size={17}/><div><small>Economic structure</small><strong>{currentYear >= 2026 && nationId === "china" ? "State-guided mixed market economy" : nation.economyType}</strong></div></div>
      </div>
      <div className="section-label">NATIONAL POWER <span>0–100</span></div>
      {metricInfo.filter(m => m.key !== "happiness" && m.key !== "stability").map(item => {
        const Icon = item.icon;
        return <div className="power-row" key={item.key}><div className="power-label"><span><Icon size={15}/>{item.label}</span><b>{metrics[item.key]}</b></div><div className="meter"><i style={{width: `${metrics[item.key]}%`}}/></div></div>;
      })}
      <div className="profile-note"><CircleHelp size={15}/><span>Stats are simplified gameplay indices. Population and government descriptions are illustrative and should be refined with historically sourced data.</span></div>
    </div>
  );

  if (!started) return (
    <div className="setup-page">
      <header className="topbar"><div className="brand"><div className="brand-mark">🌐</div><div><strong>WORLD ORDER</strong><small>GEOPOLITICAL SIMULATION</small></div></div><span className="topbar-pill"><span className="status-dot"/> EARLY ACCESS · PROTOTYPE</span></header>
      <main className="setup-main">
        <div className="setup-copy"><div className="overline"><span/> A TEXT-DRIVEN STRATEGY GAME</div><h1>History isn't<br/>written <em>yet.</em></h1><p>Lead a nation through the defining crises of the modern world. Make the calls, navigate the consequences, and discover how your choices reshape the international order.</p><div className="feature-pills"><span>🌍 Alternate history</span><span>🤝 Diplomacy</span><span>⚖️ Strategic choices</span></div></div>
        <section className="setup-card">
          <div className="card-kicker">YOUR CAMPAIGN BEGINS</div><h2>Choose your nation</h2><p className="muted">Select a country and a moment in history.</p>
          <div className="nation-picker">
            {Object.values(nations).map(n => <button key={n.id} className={`nation-option ${nationId === n.id ? "selected" : ""}`} onClick={() => setNationId(n.id)}><span className="nation-flag">{n.flag}</span><span className="nation-option-name">{n.name}<small>{n.government}</small></span><span className="radio-dot">{nationId === n.id && <Check size={12}/>}</span></button>)}
          </div>
          <label className="field-label" htmlFor="start-year">STARTING YEAR</label><div className="select-wrap"><Clock3 size={17}/><select id="start-year" value={startYear} onChange={e => setStartYear(Number(e.target.value))}>{yearOptions.map(y => <option key={y.year} value={y.year}>{y.label}</option>)}</select><ChevronDown size={16}/></div>
          <div className="setup-preview"><span>{nation.flag}</span><div><small>YOU WILL LEAD</small><strong>{nation.name} · {startYear}</strong></div><span className="preview-tag">SOLO CAMPAIGN</span></div>
          <button className="primary-button" onClick={beginCampaign}>Begin your campaign <ArrowRight size={17}/></button>
          <button className="text-button" onClick={loadCampaign}><Save size={15}/> Load saved campaign</button>
        </section>
      </main>
      <footer className="footer"><span>WORLD ORDER <span className="footer-dot">•</span> v0.1.0</span><span>Inspired by history. Shaped by your decisions.</span></footer>
    </div>
  );

  return (
    <div className="game-shell">
      <header className="game-topbar"><div className="brand"><div className="brand-mark">🌐</div><div><strong>WORLD ORDER</strong><small>GEOPOLITICAL SIMULATION</small></div></div><div className="campaign-meta"><span className="live-dot"/> CAMPAIGN ACTIVE <i/> <span>YEAR {currentYear}</span></div><div className="top-actions"><button className="icon-button mobile-profile-button" aria-label="Toggle national profile" onClick={() => setShowMobileProfile(v => !v)}><Menu size={18}/></button><button className="subtle-button" onClick={() => { localStorage.setItem(campaignKey, JSON.stringify({nationId,startYear,currentYear,metrics,eventLog,latestResult})); alert("Campaign saved in this browser."); }}><Save size={15}/> Save</button><button className="subtle-button" onClick={resetCampaign}><X size={15}/> New game</button></div></header>
      <div className="game-layout">
        <aside className={`profile-sidebar ${showMobileProfile ? "mobile-open" : ""}`}><div className="sidebar-head"><span>YOUR NATION</span><button className="icon-button close-profile" aria-label="Close profile" onClick={() => setShowMobileProfile(false)}><X size={16}/></button></div>{profilePanel}</aside>
        <main className="story-column">
          <div className="timeline-row"><span className="timeline-badge"><Clock3 size={14}/> YEAR {currentYear}</span><span className="timeline-line"/><span className="era-label">{currentYear < 1945 ? "THE ROAD TO WAR" : currentYear < 1991 ? "THE POSTWAR ORDER" : currentYear < 2000 ? "A NEW WORLD ORDER" : "THE MODERN ERA"}</span></div>
          <div className="dispatch-label"><BookOpen size={15}/> INTELLIGENCE & DIPLOMATIC BRIEFING</div>
          <article className="story-card">
            <div className="story-meta"><span className="category-dot"/> {scenario.kicker}</div><h1>{scenario.title}</h1><p className="story-body">{scenario.body}</p>
            <div className="briefing-callout"><div className="callout-icon">📡</div><div><strong>FROM THE NATIONAL SECURITY COUNCIL</strong><p>Your next decision will influence national indicators, foreign perceptions, and the options available in future crises.</p></div></div>
            {!latestResult ? <>
              <div className="decision-heading"><div><span className="eyebrow">THE DECISION IS YOURS</span><h2>What will you do?</h2></div><span className="choice-count">{scenario.choices.length} OPTIONS</span></div>
              <div className="choice-list">{scenario.choices.map((c, i) => <button className="choice-card" key={c.id} onClick={() => chooseOption(c)}><span className="choice-emoji">{c.icon}</span><span className="choice-copy"><strong>{c.title}</strong><small>{c.description}</small></span><span className="choice-number">0{i+1}</span><ArrowRight className="choice-arrow" size={17}/></button>)}</div>
            </> : <div className="result-panel"><div className="result-heading"><span className="result-check"><Check size={17}/></span><div><span className="eyebrow">DECISION OUTCOME</span><h2>Your policy is in motion</h2></div></div><p>{latestResult}</p><div className="theory-toggle"><button onClick={() => setShowTheory(v => !v)}><CircleHelp size={16}/>{showTheory ? "Hide strategic assessment" : "Why does this matter strategically?"}<ChevronDown size={15}/></button>{showTheory && <div className="theory-content"><strong>Strategic assessment · bargaining and conflict</strong><p>States may fight even when a negotiated deal could leave both better off. Leaders can misread one another, hide information, or distrust promises about future power. A settlement is more durable when commitments are credible and both sides have reasons to comply.</p><p><b>Try this lens:</b> Did your choice reduce uncertainty, make a promise more credible, or change the balance of power in a way that could alarm another country?</p></div>}</div><button className="primary-button advance-button" onClick={advanceYear}>{currentYear >= 2026 ? "Campaign reached 2026" : `Advance to ${currentYear + 1}`} <ArrowRight size={17}/></button></div>}
          </article>
          <section className="event-log"><div className="event-log-head"><span><BookOpen size={15}/> CAMPAIGN JOURNAL</span><span>{eventLog.length} ENTRIES</span></div>{eventLog.length === 0 ? <p className="empty-log">Your decisions will appear here as your country's story unfolds.</p> : eventLog.map((event, i) => <div className="log-entry" key={`${event}-${i}`}><span className="log-bullet"/><span>{event}</span></div>)}</section>
          <div className="game-disclaimer">Prototype simulation · Scenarios and indices are illustrative, not historical forecasts or sourced datasets.</div>
        </main>
      </div>
    </div>
  );
}
