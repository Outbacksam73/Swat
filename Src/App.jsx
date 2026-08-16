import React, { useState, useEffect, useMemo } from "react";
import { 
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend 
} from "recharts";
import { 
  Menu, X, Radio, Trash2, Code, Volume2, ShieldAlert, CheckCircle2, CreditCard, Download 
} from "lucide-react";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScanningTowers, setIsScanningTowers] = useState(false);
  const [towerLogs, setTowerLogs] = useState([]);
  const [customApis, setCustomApis] = useState([]);
  const [apiName, setApiName] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [statusMessage, setStatusMessage] = useState("System Operational");
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const PAYPAL_LINK = "https://paypal.me/yourname";

  // Capture PWA Install Event for Android/Chrome
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setDeferredPrompt(null);
    } else {
      alert("To install on iOS: Tap Share -> 'Add to Home Screen'. On Android: Tap Chrome Menu -> 'Install App'.");
    }
  };

  const [chartData, setChartData] = useState([
    { day: "Day 1", detected: 12, trapped: 8, purged: 5 },
    { day: "Day 5", detected: 18, trapped: 14, purged: 10 },
    { day: "Day 10", detected: 8, trapped: 6, purged: 6 },
    { day: "Day 15", detected: 25, trapped: 20, purged: 18 },
    { day: "Day 20", detected: 14, trapped: 10, purged: 8 },
    { day: "Day 25", detected: 30, trapped: 25, purged: 22 },
    { day: "Day 30", detected: 10, trapped: 9, purged: 9 },
  ]);

  const speak = (text) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handlePurge = () => {
    setLoading(true);
    setStatusMessage("Purging active threats...");
    speak("Initiating threat purge protocol.");
    setTimeout(() => {
      setChartData((prev) => prev.map((item) => ({ ...item, purged: item.detected })));
      setLoading(false);
      setStatusMessage("Purge completed successfully.");
      speak("Purge complete. System is secure.");
    }, 1500);
  };

  const handleTowerScan = () => {
    setIsScanningTowers(true);
    setStatusMessage("Scanning local cell towers...");
    speak("Scanning for cell tower signals.");
    setTimeout(() => {
      setTowerLogs([
        { id: "TWR-8092", signal: "-65 dBm", status: "Verified" },
        { id: "TWR-4110", signal: "-82 dBm", status: "Anomalous" },
      ]);
      setIsScanningTowers(false);
      setStatusMessage("Cell tower scan completed.");
      speak("Tower scan complete.");
    }, 2000);
  };

  const handleAddApi = (e) => {
    e.preventDefault();
    if (!apiName || !apiEndpoint) return;
    setCustomApis([...customApis, { id: Date.now(), name: apiName, endpoint: apiEndpoint }]);
    setApiName("");
    setApiEndpoint("");
    speak(`Custom API ${apiName} generated.`);
  };

  const MemoizedChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
        <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} interval={1} stroke="#ffffff15" />
        <YAxis tick={{ fill: "#64748b", fontSize: 11 }} stroke="#ffffff15" allowDecimals={false} />
        <Tooltip contentStyle={{ background: "#0a0e17", border: "1px solid #ffffff15", borderRadius: 12, color: "#e2e8f0" }} />
        <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
        <Line type="monotone" dataKey="detected" name="Detected" stroke="#fb7185" strokeWidth={2} dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="trapped" name="Trapped" stroke="#22d3ee" strokeWidth={2} dot={false} isAnimationActive={false} />
        <Line type="monotone" dataKey="purged" name="Purged" stroke="#34d399" strokeWidth={2} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  ), [chartData]);

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 p-4 sm:p-6 font-sans">
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-cyan-400 h-6 w-6" />
          <h1 className="text-xl font-bold tracking-wide">SWAT Security Console</h1>
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <button 
            onClick={handleInstallApp}
            className="flex items-center gap-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <Download className="h-4 w-4" /> Install App
          </button>
          <a 
            href={PAYPAL_LINK} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
          >
            <CreditCard className="h-4 w-4" /> Pay via PayPal
          </a>
          <button 
            onClick={() => setVoiceEnabled(!voiceEnabled)} 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border ${voiceEnabled ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300" : "border-slate-700 bg-slate-800 text-slate-400"}`}
          >
            <Volume2 className="h-4 w-4" /> Voice {voiceEnabled ? "ON" : "OFF"}
          </button>
        </div>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden p-2 rounded-lg border border-white/10 bg-white/5">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {mobileMenuOpen && (
        <div className="sm:hidden mb-6 p-4 rounded-xl bg-slate-900 border border-white/10 space-y-3">
          <button 
            onClick={handleInstallApp}
            className="w-full flex items-center justify-center gap-2 p-2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-sm font-semibold"
          >
            <Download className="h-4 w-4" /> Install App to Phone
          </button>
          <a 
            href={PAYPAL_LINK} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 p-2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-sm font-semibold"
          >
            <CreditCard className="h-4 w-4" /> Pay via PayPal
          </a>
        </div>
      )}

      <div className="mb-6 p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-sm flex-wrap gap-2">
        <span className="flex items-center gap-2 text-slate-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Status: {statusMessage}
        </span>
        <button 
          onClick={handlePurge} 
          disabled={loading}
          className="flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 px-3 py-1 rounded-lg text-xs font-semibold transition"
        >
          <Trash2 className="h-3.5 w-3.5" /> {loading ? "Purging..." : "Purge System"}
        </button>
      </div>

      <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-5 sm:p-6 mb-6">
        <p className="mb-5 text-sm font-medium text-slate-200">Threat Activity · Last 30 Days</p>
        {loading ? <p className="py-20 text-center text-sm text-slate-500">Updating timeline...</p> : <div className="h-72 w-full">{MemoizedChart}</div>}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium text-slate-200 flex items-center gap-2">
              <Radio className="h-4 w-4 text-cyan-400" /> Cell Tower Scanner
            </h2>
            <button onClick={handleTowerScan} disabled={isScanningTowers} className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-lg text-xs font-semibold">
              {isScanningTowers ? "Scanning..." : "Scan Towers"}
            </button>
          </div>
          <div className="space-y-2">
            {towerLogs.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No active tower scans recorded.</p>
            ) : (
              towerLogs.map((tower) => (
                <div key={tower.id} className="flex justify-between p-2 rounded bg-white/5 text-xs">
                  <span>{tower.id}</span>
                  <span className="text-slate-400">{tower.signal}</span>
                  <span className="text-cyan-400">{tower.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
          <h2 className="text-sm font-medium text-slate-200 flex items-center gap-2 mb-4">
            <Code className="h-4 w-4 text-emerald-400" /> Custom API Builder
          </h2>
          <form onSubmit={handleAddApi} className="flex flex-col gap-2 mb-4">
            <input type="text" placeholder="API Name" value={apiName} onChange={(e) => setApiName(e.target.value)} className="bg-slate-900 border border-white/10 rounded px-3 py-1.5 text-xs text-slate-200" />
            <input type="text" placeholder="Endpoint URL" value={apiEndpoint} onChange={(e) => setApiEndpoint(e.target.value)} className="bg-slate-900 border border-white/10 rounded px-3 py-1.5 text-xs text-slate-200" />
            <button type="submit" className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 py-1.5 rounded text-xs font-semibold">
              Build Endpoint
            </button>
          </form>
          <div className="space-y-1">
            {customApis.map((api) => (
              <div key={api.id} className="p-2 rounded bg-white/5 text-xs flex justify-between">
                <span className="font-semibold text-slate-300">{api.name}</span>
                <span className="text-slate-500 font-mono">{api.endpoint}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
