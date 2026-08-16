import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Code2,
  Menu,
  Radio,
  Radar,
  ShieldAlert,
  Signal,
  Trash2,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const INITIAL_CHART_DATA = [
  { day: "01", detected: 12, trapped: 8, purged: 5 },
  { day: "05", detected: 18, trapped: 14, purged: 10 },
  { day: "10", detected: 8, trapped: 6, purged: 6 },
  { day: "15", detected: 25, trapped: 20, purged: 18 },
  { day: "20", detected: 14, trapped: 10, purged: 8 },
  { day: "25", detected: 30, trapped: 25, purged: 22 },
  { day: "30", detected: 10, trapped: 9, purged: 9 },
];

const TOWER_RESULTS = [
  { id: "TWR-8092", signal: "-65 dBm", strength: 84, status: "Verified" },
  { id: "TWR-4110", signal: "-82 dBm", strength: 56, status: "Anomalous" },
  { id: "TWR-2397", signal: "-91 dBm", strength: 38, status: "Observed" },
];

const PAYMENT_PAGE = "/ONE=TIME=PAYMENT.html";

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <p>Day {label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey}>
          <span style={{ backgroundColor: entry.color }} />
          {entry.name}
          <strong>{entry.value}</strong>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScanningTowers, setIsScanningTowers] = useState(false);
  const [towerLogs, setTowerLogs] = useState([]);
  const [customApis, setCustomApis] = useState([]);
  const [apiName, setApiName] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [apiError, setApiError] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [statusMessage, setStatusMessage] = useState("System operational");
  const [chartData, setChartData] = useState(INITIAL_CHART_DATA);
  const purgeTimer = useRef(null);
  const scanTimer = useRef(null);

  useEffect(() => {
    return () => {
      window.clearTimeout(purgeTimer.current);
      window.clearTimeout(scanTimer.current);
      window.speechSynthesis?.cancel();
    };
  }, []);

  const speak = (text) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const handlePurge = () => {
    if (loading) return;
    setLoading(true);
    setStatusMessage("Purging active threats");
    speak("Initiating threat purge protocol.");

    purgeTimer.current = window.setTimeout(() => {
      setChartData((current) =>
        current.map((item) => ({ ...item, trapped: item.detected, purged: item.detected })),
      );
      setLoading(false);
      setStatusMessage("Purge completed — perimeter secure");
      speak("Purge complete. System is secure.");
    }, 1500);
  };

  const handleTowerScan = () => {
    if (isScanningTowers) return;
    setIsScanningTowers(true);
    setTowerLogs([]);
    setStatusMessage("Scanning simulated local signals");
    speak("Scanning for tower signals.");

    scanTimer.current = window.setTimeout(() => {
      setTowerLogs(TOWER_RESULTS);
      setIsScanningTowers(false);
      setStatusMessage("Signal scan completed");
      speak("Tower scan complete. Three signals logged.");
    }, 1900);
  };

  const handleAddApi = (event) => {
    event.preventDefault();
    const name = apiName.trim();
    const endpoint = apiEndpoint.trim();

    if (!name || !endpoint) {
      setApiError("Enter both an API name and endpoint path.");
      return;
    }

    if (!endpoint.startsWith("/") && !/^https?:\/\//i.test(endpoint)) {
      setApiError("Use a relative path or a complete http(s) URL.");
      return;
    }

    setCustomApis((current) => [
      { id: `${Date.now()}-${name}`, name, endpoint },
      ...current,
    ]);
    setApiName("");
    setApiEndpoint("");
    setApiError("");
    setStatusMessage(`${name} endpoint staged`);
    speak(`Custom API ${name} generated.`);
  };

  const totals = useMemo(
    () =>
      chartData.reduce(
        (summary, item) => ({
          detected: summary.detected + item.detected,
          trapped: summary.trapped + item.trapped,
          purged: summary.purged + item.purged,
        }),
        { detected: 0, trapped: 0, purged: 0 },
      ),
    [chartData],
  );

  const chart = useMemo(
    () => (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 6, left: -24, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#9fcad113" strokeDasharray="3 7" />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#66858d", fontSize: 11 }}
            tickMargin={14}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#66858d", fontSize: 11 }}
            allowDecimals={false}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#7ce7e355", strokeDasharray: "4 4" }} />
          <Line type="monotone" dataKey="detected" name="Detected" stroke="#ff6464" strokeWidth={2.4} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="trapped" name="Trapped" stroke="#6fe7e0" strokeWidth={2.4} dot={false} activeDot={{ r: 4 }} />
          <Line type="monotone" dataKey="purged" name="Purged" stroke="#b8f26d" strokeWidth={2.4} dot={false} activeDot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    ),
    [chartData],
  );

  const toggleVoice = () => {
    setVoiceEnabled((enabled) => !enabled);
    setMobileMenuOpen(false);
  };

  return (
    <div className="console-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <header className="topbar">
        <a className="brand" href="#top" aria-label="SWAT console home">
          <span className="brand-mark"><ShieldAlert /></span>
          <span><strong>SWAT</strong><small>Security Console</small></span>
        </a>

        <div className="desktop-actions">
          <span className="connection-pill"><span /> Encrypted session</span>
          <a className="button button-payment" href={PAYMENT_PAGE} target="_blank" rel="noreferrer">
            <CircleDollarSign /> Support project
          </a>
          <button className={`button button-voice ${voiceEnabled ? "is-active" : ""}`} onClick={toggleVoice} type="button">
            {voiceEnabled ? <Volume2 /> : <VolumeX />} Voice {voiceEnabled ? "on" : "off"}
          </button>
        </div>

        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <span className="connection-pill"><span /> Encrypted session</span>
          <a className="button button-payment" href={PAYMENT_PAGE} target="_blank" rel="noreferrer">
            <CircleDollarSign /> Support project
          </a>
          <button className="button button-voice" onClick={toggleVoice} type="button">
            {voiceEnabled ? <Volume2 /> : <VolumeX />} Voice announcements: {voiceEnabled ? "on" : "off"}
          </button>
        </div>
      )}

      <main id="top" className="dashboard">
        <section className="hero-panel">
          <div className="hero-copy">
            <span className="eyebrow"><Radar /> Defense telemetry / 30-day window</span>
            <h1>Perimeter<br /><em>under control.</em></h1>
            <p>Monitor simulated threat activity, inspect signal anomalies, and stage custom endpoints from one focused command surface.</p>
          </div>

          <div className="status-orbit" aria-label="Current security score 94 percent">
            <div className="orbit-ring orbit-ring-one" />
            <div className="orbit-ring orbit-ring-two" />
            <div className="score"><span>94</span><small>SECURE</small></div>
          </div>

          <div className="hero-metrics">
            <article><span>Threats logged</span><strong>{totals.detected}</strong><small>+8.4% this cycle</small></article>
            <article><span>Trap efficiency</span><strong>{Math.round((totals.trapped / totals.detected) * 100)}%</strong><small>Containment layer</small></article>
            <article><span>Threats purged</span><strong>{totals.purged}</strong><small>Verified events</small></article>
          </div>
        </section>

        <section className="status-strip" aria-live="polite">
          <div className="status-message">
            <span className={loading || isScanningTowers ? "status-icon is-busy" : "status-icon"}>
              {loading || isScanningTowers ? <Activity /> : <CheckCircle2 />}
            </span>
            <div><small>Operational status</small><strong>{statusMessage}</strong></div>
          </div>
          <div className="status-details"><span>NODE 08</span><span>LATENCY 12MS</span><span>UPTIME 99.98%</span></div>
          <button className="button button-danger" onClick={handlePurge} disabled={loading} type="button">
            <Trash2 /> {loading ? "Purging threats" : "Execute purge"}
          </button>
        </section>

        <section className="chart-panel panel">
          <div className="panel-heading">
            <div><span className="section-number">01</span><div><small>Live analysis</small><h2>Threat activity</h2></div></div>
            <div className="chart-legend">
              <span className="detected">Detected</span><span className="trapped">Trapped</span><span className="purged">Purged</span>
            </div>
          </div>
          <div className={`chart-frame ${loading ? "is-loading" : ""}`}>
            {chart}
            {loading && <div className="chart-loading"><Zap /><span>Recalculating defense telemetry</span></div>}
          </div>
          <div className="chart-footer"><span>JUL 01</span><span>30-DAY SIGNAL HISTORY</span><span>JUL 30</span></div>
        </section>

        <div className="utility-grid">
          <section className="panel utility-panel">
            <div className="panel-heading compact">
              <div><span className="section-number">02</span><div><small>Radio layer</small><h2>Signal scanner</h2></div></div>
              <Radio className="heading-icon" />
            </div>
            <p className="panel-intro">Run a simulated sweep of nearby tower signals and flag unusual readings.</p>
            <button className="scan-button" onClick={handleTowerScan} disabled={isScanningTowers} type="button">
              <span>{isScanningTowers ? <Activity /> : <Signal />}</span>
              <div><small>{isScanningTowers ? "Sweep in progress" : "Ready for sweep"}</small><strong>{isScanningTowers ? "Scanning spectrum…" : "Scan signal field"}</strong></div>
              <ChevronRight />
            </button>

            <div className="tower-list" aria-live="polite">
              {isScanningTowers ? (
                [0, 1, 2].map((item) => <div className="tower-skeleton" key={item}><span /><span /><span /></div>)
              ) : towerLogs.length === 0 ? (
                <div className="empty-state"><Radar /><strong>No scan recorded</strong><span>Start a sweep to populate signal telemetry.</span></div>
              ) : (
                towerLogs.map((tower) => (
                  <div className="tower-row" key={tower.id}>
                    <div><strong>{tower.id}</strong><span>{tower.signal}</span></div>
                    <div className="signal-meter"><span style={{ width: `${tower.strength}%` }} /></div>
                    <span className={`tower-status ${tower.status.toLowerCase()}`}>{tower.status}</span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="panel utility-panel api-panel">
            <div className="panel-heading compact">
              <div><span className="section-number">03</span><div><small>Integration lab</small><h2>Endpoint builder</h2></div></div>
              <Code2 className="heading-icon" />
            </div>
            <p className="panel-intro">Stage named routes for your security tools. Endpoints remain local to this session.</p>
            <form className="api-form" onSubmit={handleAddApi} noValidate>
              <label><span>API label</span><input value={apiName} onChange={(event) => setApiName(event.target.value)} placeholder="Tower webhook" /></label>
              <label><span>Endpoint</span><input value={apiEndpoint} onChange={(event) => setApiEndpoint(event.target.value)} placeholder="/api/v1/towers" /></label>
              {apiError && <p className="form-error" role="alert"><ShieldAlert /> {apiError}</p>}
              <button className="button button-primary" type="submit"><Code2 /> Stage endpoint</button>
            </form>

            <div className="api-list" aria-live="polite">
              {customApis.length === 0 ? (
                <div className="empty-state horizontal"><Code2 /><div><strong>No endpoints staged</strong><span>Your generated routes appear here.</span></div></div>
              ) : customApis.map((api) => (
                <div className="api-row" key={api.id}><span><Check />{api.name}</span><code>{api.endpoint}</code></div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer><span>SWAT / CYBER DEFENSE INTERFACE</span><span>SIMULATION ENVIRONMENT — 2026</span></footer>
    </div>
  );
}
