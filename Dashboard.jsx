react.recharts.lucidereact
import React, { useState, useEffect, useMemo } from "react";
import { 
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip 
} from "recharts";
import { 
  ShieldAlert, Radio, Trash2, Terminal, Volume2, VolumeX, 
  Download, CreditCard, Menu, X, Cpu, Activity, Play, Plus, CheckCircle
} from "lucide-react";

export default function SwatConsole() {
  // --- STATE MANAGEMENT ---
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isPurging, setIsPurging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [statusText, setStatusText] = useState("SYSTEM DEFENSES ACTIVE");
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Replace this placeholder with your exact PayPal checkout or button link
  const PAYPAL_LINK = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=YOUR_BUTTON_ID";

  // Functional Utilities
  const [towerLogs, setTowerLogs] = useState([
    { id: "TOWER-ALPHA-01", freq: "850 MHz", status: "SECURE", latency: "12ms" },
    { id: "TOWER-BRAVO-09", freq: "1900 MHz", status: "MONITORED", latency: "24ms" }
  ]);

  const [customApis, setCustomApis] = useState([
    { id: 1, name: "Threat Sentinel Webhook", endpoint: "/api/v1/sentinel/stream" }
  ]);
  const [apiNameInput, setApiNameInput] = useState("");
  const [apiEndpointInput, setApiEndpointInput] = useState("");

  const [chartData, setChartData] = useState([
    { time: "00:00", threats: 14, trapped: 10, purged: 8 },
    { time: "04:00", threats: 22, trapped: 18, purged: 15 },
    { time: "08:00", threats: 35, trapped: 30, purged: 28 },
    { time: "12:00", threats: 19, trapped: 15, purged: 14 },
    { time: "16:00", threats: 42, trapped: 38, purged: 35 },
    { time: "20:00", threats: 28, trapped: 24, purged: 22 }
  ]);

  // Handle PWA Mobile Installation Event
  useEffect(() => {
    const handlePrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () => window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  // Voice Synthesizer
  const speak = (message) => {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.95;
    utterance.pitch = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Actions
  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setDeferredPrompt(null);
    } else {
      alert("Mobile Download: Tap your browser menu (Safari / Chrome) and select 'Add to Home Screen' or 'Install App'.");
    }
  };

  const handlePurge = () => {
    setIsPurging(true);
    setStatusText("PURGING ACTIVE THREATS...");
    speak("Initiating full threat purge sequence.");

    setTimeout(() => {
      setChartData((prev) => prev.map((item) => ({ ...item, threats: 0, trapped: 0, purged: item.threats })));
      setIsPurging(false);
      setStatusText("THREAT PURGE COMPLETE. SYSTEM SECURED.");
      speak("Purge operational complete. All threat signatures zeroed.");
    }, 1800);
  };

  const handleScanTowers = () => {
    setIsScanning(true);
    setStatusText("SCANNING CELL TOWER HARDWARE...");
    speak("Scanning nearby cell tower frequencies.");

    setTimeout(() => {
      const newTower = {
        id: `TOWER-NODE-0${towerLogs.length + 1}`,
        freq: "2100 MHz",
        status: "VERIFIED",
        latency: "18ms"
      };
      setTowerLogs((prev) => [newTower, ...prev]);
      setIsScanning(false);
      setStatusText("TOWER SCAN COMPLETED.");
      speak("Cell tower frequency scan finished. New node logged.");
    }, 2000);
  };

  const handleCreateApi = (e) => {
    e.preventDefault();
    if (!apiNameInput || !apiEndpointInput) return;
    const newEntry = { id: Date.now(), name: apiNameInput, endpoint: apiEndpointInput };
    setCustomApis((prev) => [newEntry, ...prev]);
    setApiNameInput("");
    setApiEndpointInput("");
    speak(`Custom API endpoint generated for ${apiNameInput}`);
  };

  // RAM-Optimized Chart Instance
  const MemoizedAreaChart = useMemo(() => (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorPurged" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="2 2" stroke="#ffffff0a" />
        <XAxis dataKey="time" tick={{ fill: "#64748b", fontSize: 10 }} stroke="#ffffff15" />
        <YAxis tick={{ fill: "#64748b", fontSize: 10 }} stroke="#ffffff15" />
        <Tooltip contentStyle={{ background: "#090d16", borderColor: "#ffffff15", borderRadius: "8px" }} />
        <Area type="monotone" dataKey="threats" stroke="#f43f5e" fillOpacity={1} fill="url(#colorThreats)" isAnimationActive={false} />
        <Area type="monotone" dataKey="purged" stroke="#10b981" fillOpacity={1} fill="url(#colorPurged)" isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  ), [chartData]);

  return (
    <div className="min-h-screen bg-[#05080f] text-slate-200 font-mono flex flex-col justify-between">
      {/* --- TOP NAVBAR --- */}
      <header className="border-b border-cyan-500/20 bg-[#090d16]/80 backdrop-blur px-4 py-3 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <ShieldAlert className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider text-slate-100 uppercase">SWAT Cyber Defense</h1>
            <p className="text-[10px] text-cyan-400/80">Command & Tactical Operations</p>
          </div>
        </div>

        {/* Desktop Quick Nav */}
        <div className="hidden md:flex items-center gap-3">
          <button 
            onClick={handleInstallApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition"
          >
            <Download className="h-3.5 w-3.5" /> Mobile App
          </button>
          <a 
            href={PAYPAL_LINK}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition"
          >
            <CreditCard className="h-3.5 w-3.5" /> Subscription Pass
          </a>
          <button 
            onClick={() => {
              const nextState = !voiceEnabled;
              setVoiceEnabled(nextState);
              speak(nextState ? "Voice synthesis active." : "");
            }}
            className={`p-1.5 rounded border transition ${voiceEnabled ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300" : "border-slate-800 bg-slate-900 text-slate-500"}`}
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
        </div>

        {/* Mobile Slide-Out Trigger */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="md:hidden p-2 rounded bg-slate-900 border border-slate-800 text-slate-300"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* --- MOBILE NAVIGATION DRAWER --- */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090d16] border-b border-cyan-500/20 p-4 space-y-3">
          <button 
            onClick={() => { handleInstallApp(); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold"
          >
            <Download className="h-4 w-4" /> Download / Install App
          </button>
          <a 
            href={PAYPAL_LINK} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold"
          >
            <CreditCard className="h-4 w-4" /> PayPal Access Pass
          </a>
          <button 
            onClick={() => { setVoiceEnabled(!voiceEnabled); setMobileMenuOpen(false); }}
            className="w-full flex items-center justify-center gap-2 p-2 rounded bg-slate-900 border border-slate-800 text-xs text-slate-300"
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4 text-cyan-400" /> : <VolumeX className="h-4 w-4 text-slate-500" />}
            Toggle Voice Announcements ({voiceEnabled ? "ON" : "OFF"})
          </button>
        </div>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <main className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full flex-grow">
        
        {/* Status Alert Terminal */}
        <div className="bg-[#090d16] border border-cyan-500/20 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Operational Console</span>
              <span className="text-xs font-bold text-cyan-300 tracking-wide">{statusText}</span>
            </div>
          </div>
          
          <button 
            onClick={handlePurge}
            disabled={isPurging}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold transition"
          >
            <Trash2 className="h-4 w-4" />
            {isPurging ? "PURGING..." : "EXECUTE PURGE"}
          </button>
        </div>

        {/* Real-time Threat Chart */}
        <div className="bg-[#090d16] border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" /> System Threat Timeline
            </h2>
            <div className="flex gap-4 text-[10px]">
              <span className="flex items-center gap-1 text-rose-400"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span> Detected</span>
              <span className="flex items-center gap-1 text-emerald-400"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Purged</span>
            </div>
          </div>
          <div className="h-64 w-full">{MemoizedAreaChart}</div>
        </div>

        {/* Feature Grid: Towers & Custom APIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Cell Tower Scanner Panel */}
          <div className="bg-[#090d16] border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                <Radio className="h-4 w-4 text-cyan-400" /> Cell Tower Radar
              </h3>
              <button 
                onClick={handleScanTowers}
                disabled={isScanning}
                className="px-3 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold"
              >
                {isScanning ? "Scanning..." : "Scan Signal"}
              </button>
            </div>

            <div className="space-y-2">
              {towerLogs.map((tower) => (
                <div key={tower.id} className="p-2.5 rounded bg-slate-900/50 border border-slate-800/80 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-slate-200">{tower.id}</p>
                    <p className="text-[10px] text-slate-500">{tower.freq}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">{tower.status}</span>
                    <p className="text-[10px] text-slate-500 mt-1">{tower.latency}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom API Builder Panel */}
          <div className="bg-[#090d16] border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
                <Terminal className="h-4 w-4 text-emerald-400" /> Custom API Generator
              </h3>
            </div>

            <form onSubmit={handleCreateApi} className="space-y-2">
              <input 
                type="text" 
                placeholder="API Identifier (e.g. Node Monitor)" 
                value={apiNameInput} 
                onChange={(e) => setApiNameInput(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <input 
                type="text" 
                placeholder="Endpoint Route (/api/v1/custom)" 
                value={apiEndpointInput} 
                onChange={(e) => setApiEndpointInput(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button 
                type="submit" 
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold"
              >
                <Plus className="h-3.5 w-3.5" /> Generate Endpoint
              </button>
            </form>

            <div className="space-y-2">
              {customApis.map((api) => (
                <div key={api.id} className="p-2 rounded bg-slate-900/50 border border-slate-800 flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">{api.name}</span>
                  <span className="text-[10px] text-cyan-400 font-mono">{api.endpoint}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="border-t border-slate-800/80 bg-[#090d16] px-4 py-3 text-center text-[10px] text-slate-500">
        SWAT Cyber Command Console &copy; 2026. All Rights Reserved.
      </footer>
    </div>
  );
}
