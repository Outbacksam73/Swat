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
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border ${voiceEnabled ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300" : "border-slate-700 bg-slate-800 text-slat[...]`,