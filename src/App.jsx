import { useEffect, useMemo, useState } from 'react'

const initialActivity = [42, 58, 46, 71, 64, 83, 69, 78, 54, 62, 49, 36]

const Icon = ({ name, size = 18 }) => {
  const paths = {
    shield: <><path d="M12 3 5 6v5c0 4.6 2.8 8.8 7 10 4.2-1.2 7-5.4 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></>,
    pulse: <path d="M3 12h4l2-6 4 12 2-6h6"/>,
    scan: <><path d="M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3"/><circle cx="12" cy="12" r="3"/></>,
    terminal: <><path d="m5 7 4 4-4 4M12 17h7"/><rect x="3" y="4" width="18" height="16" rx="2"/></>,
    volume: <><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a9 9 0 0 1 0 12"/></>,
    muted: <><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="m16 10 5 5m0-5-5 5"/></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13"/><path d="M10 11v5M14 11v5"/></>,
    tower: <><path d="M12 6v15M8 21h8M9.5 15h5M10.5 10h3"/><path d="M7 4a7 7 0 0 0 0 10M17 4a7 7 0 0 1 0 10M4 1a11 11 0 0 0 0 16M20 1a11 11 0 0 1 0 16"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    check: <path d="m5 12 4 4L19 6"/>,
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function ActivityChart({ data }) {
  const points = data.map((value, index) => `${(index / (data.length - 1)) * 100},${100 - value}`).join(' ')
  const area = `0,100 ${points} 100,100`

  return (
    <div className="chart" aria-label="Simulated network activity chart">
      <div className="chart-grid" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" role="img">
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d9ff43" stopOpacity=".28" />
            <stop offset="1" stopColor="#d9ff43" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#area-fill)" />
        <polyline points={points} fill="none" stroke="#d9ff43" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="chart-labels"><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>NOW</span></div>
    </div>
  )
}

export default function App() {
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isScanning, setIsScanning] = useState(false)
  const [isPurging, setIsPurging] = useState(false)
  const [activity, setActivity] = useState(initialActivity)
  const [status, setStatus] = useState('DEFENSES ACTIVE')
  const [lastScan, setLastScan] = useState('Not started')
  const [logs, setLogs] = useState([
    { time: '11:24:08', text: 'Core monitoring service connected', type: 'ok' },
    { time: '11:24:11', text: 'Local ruleset loaded', type: 'ok' },
    { time: '11:24:14', text: 'Demo console ready', type: 'info' },
  ])

  const threatCount = useMemo(() => Math.max(0, Math.round(activity.reduce((sum, item) => sum + item, 0) / 46)), [activity])

  useEffect(() => {
    document.title = 'SWAT — Security Console'
  }, [])

  const announce = (message) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(message))
  }

  const addLog = (text, type = 'info') => {
    const time = new Date().toLocaleTimeString('en-US', { hour12: false })
    setLogs((current) => [{ time, text, type }, ...current].slice(0, 6))
  }

  const runScan = () => {
    if (isScanning) return
    setIsScanning(true)
    setStatus('SCANNING LOCAL ENVIRONMENT')
    addLog('Simulated environment scan started')
    announce('Local environment scan started')

    window.setTimeout(() => {
      const next = initialActivity.map((value) => Math.max(20, value + Math.round(Math.random() * 18 - 9)))
      setActivity(next)
      setLastScan(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      setStatus('DEFENSES ACTIVE')
      setIsScanning(false)
      addLog('Scan complete — no critical events found', 'ok')
      announce('Scan complete. No critical events found')
    }, 1400)
  }

  const purgeThreats = () => {
    if (isPurging) return
    setIsPurging(true)
    setStatus('CLEARING SIMULATED EVENTS')
    addLog('Event clearance initiated', 'warn')

    window.setTimeout(() => {
      setActivity((current) => current.map((value) => Math.max(12, Math.round(value * 0.42))))
      setStatus('DEFENSES ACTIVE')
      setIsPurging(false)
      addLog('Simulated threat queue cleared', 'ok')
      announce('Threat queue cleared')
    }, 1100)
  }

  return (
    <div className="app-shell">
      <div className="noise" />
      <header className="topbar">
        <a className="brand" href="#overview" aria-label="SWAT dashboard home">
          <span className="brand-mark"><Icon name="shield" size={22} /></span>
          <span><strong>SWAT</strong><small>SECURITY CONSOLE</small></span>
        </a>
        <nav aria-label="Primary navigation">
          <a className="active" href="#overview">Overview</a>
          <a href="#activity">Activity</a>
          <a href="#systems">Systems</a>
        </nav>
        <button className="icon-button" onClick={() => setVoiceEnabled((enabled) => !enabled)} aria-label={voiceEnabled ? 'Disable voice alerts' : 'Enable voice alerts'}>
          <Icon name={voiceEnabled ? 'volume' : 'muted'} />
        </button>
      </header>

      <main id="overview">
        <section className="hero">
          <div>
            <p className="eyebrow"><span /> LOCAL DEFENSE NETWORK</p>
            <h1>System integrity.<br/><em>At a glance.</em></h1>
            <p className="hero-copy">A clear, responsive control surface for simulated security monitoring and incident-response demos.</p>
          </div>
          <div className="hero-status">
            <div className="radar"><span /><i /><b /></div>
            <p>CURRENT STATE</p>
            <strong>{status}</strong>
            <small>All core services responding</small>
          </div>
        </section>

        <section className="metrics" aria-label="System metrics">
          <article><span>01 / EVENTS</span><strong>{String(threatCount).padStart(2, '0')}</strong><p>simulated signals</p></article>
          <article><span>02 / UPTIME</span><strong>99.9<sup>%</sup></strong><p>console availability</p></article>
          <article><span>03 / NODES</span><strong>08</strong><p>services online</p></article>
          <article><span>04 / LAST SCAN</span><strong className="time-value">{lastScan}</strong><p>local browser time</p></article>
        </section>

        <section className="workspace" id="activity">
          <article className="panel activity-panel">
            <div className="panel-heading">
              <div><p className="panel-index">A—01</p><h2>Network activity</h2></div>
              <div className="legend"><span className="live-dot" /> SIMULATED LIVE FEED</div>
            </div>
            <ActivityChart data={activity} />
            <div className="panel-actions">
              <button className="primary-button" onClick={runScan} disabled={isScanning}><Icon name="scan" />{isScanning ? 'Scanning…' : 'Run system scan'}</button>
              <button className="secondary-button" onClick={purgeThreats} disabled={isPurging}><Icon name="trash" />{isPurging ? 'Clearing…' : 'Clear events'}</button>
            </div>
          </article>

          <aside className="panel log-panel" id="systems">
            <div className="panel-heading">
              <div><p className="panel-index">B—07</p><h2>Event stream</h2></div>
              <Icon name="terminal" />
            </div>
            <div className="log-list" aria-live="polite">
              {logs.map((log, index) => <div className="log-row" key={`${log.time}-${index}`}><time>{log.time}</time><span className={log.type} /><p>{log.text}</p></div>)}
            </div>
            <div className="system-card">
              <Icon name="tower" size={24} />
              <div><strong>LOCAL MONITOR</strong><p>Browser-based demonstration</p></div>
              <span className="system-ok"><Icon name="check" size={14} /> ONLINE</span>
            </div>
          </aside>
        </section>

        <section className="notice">
          <Icon name="plus" />
          <p><strong>Demonstration environment</strong>This interface visualizes generated sample data. It does not scan devices, networks, or cell towers.</p>
        </section>
      </main>

      <footer><span>SWAT / CONSOLE 1.0</span><span>SECURE BY DESIGN — TRANSPARENT BY DEFAULT</span><a href="/DONATE.html">Support the project ↗</a></footer>
    </div>
  )
}
