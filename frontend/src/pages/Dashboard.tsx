import { useState, useMemo } from "react";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// ─── Mock Data (replace with real API calls) ────────────────────────────────

const LINKS = [
    { nano_id: "a1b2c", redirect_url: "https://github.com/yourusername/awesome-project", created_at: "2026-05-10", clicks: 4821, unique: 3102 },
    { nano_id: "d4e5f", redirect_url: "https://docs.google.com/spreadsheets/campaign-q2", created_at: "2026-05-18", clicks: 3244, unique: 2891 },
    { nano_id: "g7h8i", redirect_url: "https://figma.com/file/design-system-v3", created_at: "2026-05-22", clicks: 2109, unique: 1744 },
    { nano_id: "j1k2l", redirect_url: "https://notion.so/roadmap-2026-planning-board", created_at: "2026-06-01", clicks: 1876, unique: 1543 },
    { nano_id: "m3n4o", redirect_url: "https://twitter.com/launch-announcement", created_at: "2026-06-08", clicks: 987, unique: 812 },
    { nano_id: "p5q6r", redirect_url: "https://producthunt.com/posts/snip-ly", created_at: "2026-06-12", clicks: 654, unique: 611 },
];

const generateTimeSeries = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date("2026-06-18");
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString("en", { month: "short", day: "numeric" });
        const base = Math.floor(Math.random() * 400) + 150;
        days.push({
            date: label,
            clicks: base,
            unique: Math.floor(base * (0.6 + Math.random() * 0.25)),
        });
    }
    return days;
};

const TIME_SERIES = generateTimeSeries();

const COUNTRIES = [
    { country: "India", clicks: 4821, flag: "🇮🇳" },
    { country: "United States", clicks: 3102, flag: "🇺🇸" },
    { country: "United Kingdom", clicks: 1744, flag: "🇬🇧" },
    { country: "Germany", clicks: 1203, flag: "🇩🇪" },
    { country: "Canada", clicks: 987, flag: "🇨🇦" },
    { country: "Singapore", clicks: 654, flag: "🇸🇬" },
    { country: "Australia", clicks: 532, flag: "🇦🇺" },
    { country: "France", clicks: 411, flag: "🇫🇷" },
];
const TOTAL_COUNTRY_CLICKS = COUNTRIES.reduce((s, c) => s + c.clicks, 0);

const BROWSERS = [
    { name: "Chrome", value: 58, color: "#6c47ff" },
    { name: "Safari", value: 22, color: "#00d4aa" },
    { name: "Firefox", value: 10, color: "#ff6b6b" },
    { name: "Edge", value: 7, color: "#f5a623" },
    { name: "Other", value: 3, color: "#3a3a4a" },
];

const DEVICES = [
    { name: "Mobile", value: 61, color: "#6c47ff" },
    { name: "Desktop", value: 29, color: "#00d4aa" },
    { name: "Tablet", value: 10, color: "#f5a623" },
];

const VENDORS = [
    { name: "Apple", clicks: 5230 },
    { name: "Samsung", clicks: 3890 },
    { name: "Xiaomi", clicks: 1540 },
    { name: "OnePlus", clicks: 980 },
    { name: "Google", clicks: 760 },
    { name: "Huawei", clicks: 540 },
];

const HOURLY = Array.from({ length: 24 }, (_, h) => ({
    hour: `${h.toString().padStart(2, "0")}:00`,
    clicks: Math.floor(Math.sin((h - 6) / 3) * 300 + 350 + Math.random() * 80),
}));

const RECENT_EVENTS = [
    { country: "🇮🇳", region: "Maharashtra", browser: "Chrome", device: "Samsung Galaxy", time: "2s ago", nano_id: "a1b2c" },
    { country: "🇺🇸", region: "California", browser: "Safari", device: "iPhone 15", time: "8s ago", nano_id: "d4e5f" },
    { country: "🇬🇧", region: "London", browser: "Firefox", device: "MacBook Pro", time: "15s ago", nano_id: "g7h8i" },
    { country: "🇩🇪", region: "Berlin", browser: "Chrome", device: "Pixel 7", time: "23s ago", nano_id: "a1b2c" },
    { country: "🇸🇬", region: "Central", browser: "Safari", device: "iPad Pro", time: "41s ago", nano_id: "j1k2l" },
    { country: "🇨🇦", region: "Ontario", browser: "Edge", device: "Surface Pro", time: "1m ago", nano_id: "m3n4o" },
    { country: "🇫🇷", region: "Île-de-France", browser: "Chrome", device: "OnePlus 11", time: "2m ago", nano_id: "d4e5f" },
    { country: "🇦🇺", region: "NSW", browser: "Chrome", device: "Xiaomi 13", time: "3m ago", nano_id: "p5q6r" },
];

// ─── Types ──────────────────────────────────────────────────────────────────
type Range = "7d" | "30d" | "90d";
type ActiveTab = "overview" | "links" | "geo" | "devices";

// ─── Sub-components ──────────────────────────────────────────────────────────

const PURPLE = "#6c47ff";
const TEAL = "#00d4aa";

function StatCard({
    label, value, sub, accent = false, delta
}: { label: string; value: string; sub?: string; accent?: boolean; delta?: string }) {
    return (
        <div className={`rounded-xl p-5 border transition-colors ${accent
            ? "bg-[#6c47ff]/10 border-[#6c47ff]/40"
            : "bg-[#111118] border-[#1e1e2e]"
            }`}>
            <p className="text-[#555] text-[10px] tracking-widest uppercase mb-2">{label}</p>
            <p className={`text-2xl font-black tracking-tight ${accent ? "text-[#9b7fff]" : "text-white"}`}>{value}</p>
            {delta && (
                <p className={`text-[11px] mt-1 ${delta.startsWith("+") ? "text-[#00d4aa]" : "text-[#ff6b6b]"}`}>
                    {delta} vs last period
                </p>
            )}
            {sub && <p className="text-[#444] text-[10px] mt-1">{sub}</p>}
        </div>
    );
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#1a1a28] border border-[#2e2e42] rounded-lg px-3 py-2.5 text-xs font-mono">
            <p className="text-[#888] mb-1">{label}</p>
            {payload.map((p: any) => (
                <p key={p.name} style={{ color: p.color }}>{p.name}: <span className="text-white font-bold">{p.value.toLocaleString()}</span></p>
            ))}
        </div>
    );
};

function DonutChart({ data, size = 120 }: { data: { name: string; value: number; color: string }[]; size?: number }) {
    return (
        <div className="flex items-center gap-6">
            <PieChart width={size} height={size}>
                <Pie data={data} cx={size / 2 - 4} cy={size / 2 - 4} innerRadius={size * 0.32} outerRadius={size * 0.46} dataKey="value" strokeWidth={0}>
                    {data.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
            </PieChart>
            <div className="flex flex-col gap-2">
                {data.map((d) => (
                    <div key={d.name} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                        <span className="text-[#888] text-[11px]">{d.name}</span>
                        <span className="text-white text-[11px] font-bold ml-auto pl-4">{d.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function Dashboard() {
    const [range, setRange] = useState<Range>("30d");
    const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
    const [selectedLink, setSelectedLink] = useState<string | null>(null);
    const [live, setLive] = useState(true);

    const filteredSeries = useMemo(() => {
        if (range === "7d") return TIME_SERIES.slice(-7);
        if (range === "90d") return TIME_SERIES;
        return TIME_SERIES.slice(-30);
    }, [range]);

    const totalClicks = filteredSeries.reduce((s, d) => s + d.clicks, 0);
    const totalUnique = filteredSeries.reduce((s, d) => s + d.unique, 0);
    const avgPerDay = Math.round(totalClicks / filteredSeries.length);

    const tabs: { id: ActiveTab; label: string }[] = [
        { id: "overview", label: "Overview" },
        { id: "links", label: "Links" },
        { id: "geo", label: "Geography" },
        { id: "devices", label: "Devices" },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-mono">
            {/* Grid bg */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]"
                style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
            <div className="fixed top-0 left-0 w-[500px] h-[400px] rounded-full bg-[#6c47ff] opacity-[0.07] blur-[120px] pointer-events-none z-0" />
            <div className="fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#00d4aa] opacity-[0.05] blur-[100px] pointer-events-none z-0" />

            <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-8">

                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#6c47ff] flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <path d="M2 8H14M10 4L14 8L10 12" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-white font-black text-lg tracking-tight">snip<span className="text-[#6c47ff]">.</span>ly</h1>
                            <p className="text-[#444] text-[10px] tracking-widest uppercase">Analytics Dashboard</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Live indicator */}
                        <button
                            onClick={() => setLive(p => !p)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[11px] transition-all ${live ? "border-[#00d4aa]/40 bg-[#00d4aa]/10 text-[#00d4aa]" : "border-[#1e1e2e] text-[#555]"}`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${live ? "bg-[#00d4aa] animate-pulse" : "bg-[#555]"}`} />
                            {live ? "Live" : "Paused"}
                        </button>

                        {/* Range selector */}
                        <div className="flex bg-[#111118] border border-[#1e1e2e] rounded-lg overflow-hidden">
                            {(["7d", "30d", "90d"] as Range[]).map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRange(r)}
                                    className={`px-4 py-1.5 text-[11px] font-semibold tracking-wider transition-all ${range === r ? "bg-[#6c47ff] text-white" : "text-[#555] hover:text-[#888]"}`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        <button className="px-4 py-1.5 rounded-lg border border-[#1e1e2e] text-[#555] hover:text-white text-[11px] tracking-wider transition-colors flex items-center gap-1.5">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                            Export
                        </button>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="flex gap-1 mb-8 bg-[#111118] border border-[#1e1e2e] rounded-xl p-1 w-fit">
                    {tabs.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setActiveTab(t.id)}
                            className={`px-5 py-2 rounded-lg text-[11px] font-semibold tracking-wider transition-all ${activeTab === t.id ? "bg-[#6c47ff] text-white" : "text-[#555] hover:text-[#888]"}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* ══════════════════════════════════════════
            TAB: OVERVIEW
        ══════════════════════════════════════════ */}
                {activeTab === "overview" && (
                    <div className="space-y-6">

                        {/* Stat cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Total Clicks" value={totalClicks.toLocaleString()} delta="+12.4%" accent />
                            <StatCard label="Unique Visitors" value={totalUnique.toLocaleString()} delta="+8.1%" />
                            <StatCard label="Avg / Day" value={avgPerDay.toLocaleString()} sub={`over ${filteredSeries.length} days`} />
                            <StatCard label="Active Links" value="6" sub="across all campaigns" />
                        </div>

                        {/* Click-over-time area chart */}
                        <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <p className="text-white font-bold text-sm">Click Volume</p>
                                    <p className="text-[#444] text-[11px]">Total vs unique visitors</p>
                                </div>
                                <div className="flex items-center gap-4 text-[11px]">
                                    <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 rounded bg-[#6c47ff] inline-block" />Clicks</span>
                                    <span className="flex items-center gap-1.5 text-[#555]"><span className="w-3 h-0.5 rounded bg-[#00d4aa] inline-block" />Unique</span>
                                </div>
                            </div>
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={filteredSeries} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={PURPLE} stopOpacity={0.25} />
                                            <stop offset="95%" stopColor={PURPLE} stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gu" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={TEAL} stopOpacity={0.2} />
                                            <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
                                    <XAxis dataKey="date" tick={{ fill: "#444", fontSize: 10 }} tickLine={false} axisLine={false} interval={range === "7d" ? 0 : 4} />
                                    <YAxis tick={{ fill: "#444", fontSize: 10 }} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="clicks" stroke={PURPLE} strokeWidth={2} fill="url(#gc)" name="Clicks" />
                                    <Area type="monotone" dataKey="unique" stroke={TEAL} strokeWidth={2} fill="url(#gu)" name="Unique" strokeDasharray="4 2" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Row: Hourly heatmap + Live feed */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Hourly bar */}
                            <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
                                <p className="text-white font-bold text-sm mb-1">Hourly Pattern</p>
                                <p className="text-[#444] text-[11px] mb-4">Clicks by hour of day (UTC)</p>
                                <ResponsiveContainer width="100%" height={150}>
                                    <BarChart data={HOURLY} margin={{ top: 0, right: 0, left: -28, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
                                        <XAxis dataKey="hour" tick={{ fill: "#333", fontSize: 9 }} tickLine={false} axisLine={false} interval={3} />
                                        <YAxis tick={{ fill: "#333", fontSize: 9 }} tickLine={false} axisLine={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="clicks" fill={PURPLE} radius={[2, 2, 0, 0]} name="Clicks" opacity={0.85} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Live event feed */}
                            <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-white font-bold text-sm">Live Feed</p>
                                        <p className="text-[#444] text-[11px]">Real-time click events</p>
                                    </div>
                                    <span className="flex items-center gap-1.5 text-[#00d4aa] text-[10px]">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#00d4aa] animate-pulse" /> live
                                    </span>
                                </div>
                                <div className="space-y-2.5">
                                    {RECENT_EVENTS.slice(0, 6).map((ev, i) => (
                                        <div key={i} className="flex items-center gap-3 py-1.5 border-b border-[#1a1a24] last:border-0">
                                            <span className="text-base">{ev.country}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-[11px] font-semibold truncate">{ev.device}</p>
                                                <p className="text-[#444] text-[10px]">{ev.region} · {ev.browser}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[#6c47ff] text-[10px] font-mono">/{ev.nano_id}</p>
                                                <p className="text-[#333] text-[10px]">{ev.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Row: Browsers + Devices + Vendors */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
                                <p className="text-white font-bold text-sm mb-4">Browsers</p>
                                <DonutChart data={BROWSERS} size={110} />
                            </div>
                            <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
                                <p className="text-white font-bold text-sm mb-4">Device Type</p>
                                <DonutChart data={DEVICES} size={110} />
                            </div>
                            <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
                                <p className="text-white font-bold text-sm mb-1">Device Vendors</p>
                                <p className="text-[#444] text-[11px] mb-4">Top manufacturers</p>
                                <div className="space-y-2.5">
                                    {VENDORS.map((v) => (
                                        <div key={v.name} className="flex items-center gap-2">
                                            <span className="text-[#888] text-[11px] w-16 flex-shrink-0">{v.name}</span>
                                            <div className="flex-1 bg-[#1e1e2e] rounded-full h-1.5">
                                                <div className="h-1.5 rounded-full bg-[#6c47ff]" style={{ width: `${(v.clicks / VENDORS[0].clicks) * 100}%` }} />
                                            </div>
                                            <span className="text-[#555] text-[10px] w-12 text-right">{v.clicks.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════
            TAB: LINKS
        ══════════════════════════════════════════ */}
                {activeTab === "links" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-[#555] text-[11px] tracking-wider">{LINKS.length} shortened links</p>
                            <button className="px-4 py-1.5 rounded-lg bg-[#6c47ff] text-white text-[11px] font-semibold tracking-wider hover:bg-[#7c57ff] transition-colors">
                                + New link
                            </button>
                        </div>

                        {LINKS.map((link) => {
                            const isOpen = selectedLink === link.nano_id;
                            const pct = Math.round((link.clicks / LINKS[0].clicks) * 100);
                            return (
                                <div key={link.nano_id}
                                    className={`bg-[#111118] border rounded-xl overflow-hidden transition-colors cursor-pointer ${isOpen ? "border-[#6c47ff]/50" : "border-[#1e1e2e] hover:border-[#2e2e42]"}`}
                                    onClick={() => setSelectedLink(isOpen ? null : link.nano_id)}
                                >
                                    <div className="p-5 flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-lg bg-[#6c47ff]/10 border border-[#6c47ff]/20 flex items-center justify-center text-[#6c47ff] flex-shrink-0">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[#6c47ff] font-bold text-sm">snip.ly/{link.nano_id}</span>
                                                <span className="text-[#333] text-[10px]">→</span>
                                                <span className="text-[#555] text-[11px] truncate">{link.redirect_url}</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-[10px] text-[#444]">
                                                <span>Created {link.created_at}</span>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-white font-black text-lg">{link.clicks.toLocaleString()}</p>
                                            <p className="text-[#444] text-[10px]">clicks</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-[#00d4aa] font-bold text-base">{link.unique.toLocaleString()}</p>
                                            <p className="text-[#444] text-[10px]">unique</p>
                                        </div>
                                        <svg
                                            className={`w-4 h-4 text-[#555] transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="h-0.5 bg-[#1e1e2e]">
                                        <div className="h-0.5 bg-[#6c47ff]" style={{ width: `${pct}%` }} />
                                    </div>

                                    {/* Expanded detail */}
                                    {isOpen && (
                                        <div className="px-5 pb-5 pt-4 border-t border-[#1e1e2e] grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { label: "CTR", value: `${(Math.random() * 5 + 2).toFixed(1)}%` },
                                                { label: "Avg/Day", value: Math.round(link.clicks / 30).toLocaleString() },
                                                { label: "Top Country", value: "India 🇮🇳" },
                                                { label: "Top Browser", value: "Chrome" },
                                            ].map((s) => (
                                                <div key={s.label} className="bg-[#0d0d14] rounded-lg p-3">
                                                    <p className="text-[#444] text-[10px] tracking-widest uppercase mb-1">{s.label}</p>
                                                    <p className="text-white font-bold text-sm">{s.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ══════════════════════════════════════════
            TAB: GEOGRAPHY
        ══════════════════════════════════════════ */}
                {activeTab === "geo" && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Country list */}
                            <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
                                <p className="text-white font-bold text-sm mb-1">Top Countries</p>
                                <p className="text-[#444] text-[11px] mb-5">By total click volume</p>
                                <div className="space-y-4">
                                    {COUNTRIES.map((c, i) => (
                                        <div key={c.country} className="flex items-center gap-3">
                                            <span className="text-[#555] text-[11px] w-4">{i + 1}</span>
                                            <span className="text-base">{c.flag}</span>
                                            <span className="text-[#888] text-[11px] flex-1">{c.country}</span>
                                            <div className="w-32 bg-[#1e1e2e] rounded-full h-1.5">
                                                <div className="h-1.5 rounded-full bg-[#6c47ff]" style={{ width: `${(c.clicks / COUNTRIES[0].clicks) * 100}%` }} />
                                            </div>
                                            <span className="text-white text-[11px] font-bold w-14 text-right">{c.clicks.toLocaleString()}</span>
                                            <span className="text-[#444] text-[10px] w-10 text-right">{Math.round((c.clicks / TOTAL_COUNTRY_CLICKS) * 100)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Country bar chart */}
                            <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
                                <p className="text-white font-bold text-sm mb-1">Distribution</p>
                                <p className="text-[#444] text-[11px] mb-4">Visual breakdown</p>
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={COUNTRIES} layout="vertical" margin={{ top: 0, right: 10, left: 60, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" horizontal={false} />
                                        <XAxis type="number" tick={{ fill: "#444", fontSize: 10 }} tickLine={false} axisLine={false} />
                                        <YAxis type="category" dataKey="country" tick={{ fill: "#888", fontSize: 11 }} tickLine={false} axisLine={false} width={60} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="clicks" fill={PURPLE} radius={[0, 4, 4, 0]} name="Clicks" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Region breakdown */}
                        <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
                            <p className="text-white font-bold text-sm mb-1">Recent Regions</p>
                            <p className="text-[#444] text-[11px] mb-4">Granular geographic data from analytics.region</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { region: "Maharashtra", country: "🇮🇳", clicks: 1240 },
                                    { region: "California", country: "🇺🇸", clicks: 980 },
                                    { region: "London", country: "🇬🇧", clicks: 760 },
                                    { region: "Berlin", country: "🇩🇪", clicks: 541 },
                                    { region: "Ontario", country: "🇨🇦", clicks: 432 },
                                    { region: "Central SG", country: "🇸🇬", clicks: 321 },
                                    { region: "Île-de-France", country: "🇫🇷", clicks: 287 },
                                    { region: "New South Wales", country: "🇦🇺", clicks: 211 },
                                ].map((r) => (
                                    <div key={r.region} className="bg-[#0d0d14] border border-[#1e1e2e] rounded-lg p-3">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <span>{r.country}</span>
                                            <span className="text-[#555] text-[10px] truncate">{r.region}</span>
                                        </div>
                                        <p className="text-white font-bold text-base">{r.clicks.toLocaleString()}</p>
                                        <p className="text-[#444] text-[10px]">clicks</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════
            TAB: DEVICES
        ══════════════════════════════════════════ */}
                {activeTab === "devices" && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
                                <p className="text-white font-bold text-sm mb-4">Device Type</p>
                                <DonutChart data={DEVICES} size={130} />
                            </div>
                            <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
                                <p className="text-white font-bold text-sm mb-4">Browser</p>
                                <DonutChart data={BROWSERS} size={130} />
                            </div>
                            <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
                                <p className="text-white font-bold text-sm mb-1">Vendors</p>
                                <p className="text-[#444] text-[11px] mb-4">device_vendor field</p>
                                <div className="space-y-3">
                                    {VENDORS.map((v) => (
                                        <div key={v.name} className="flex items-center gap-2">
                                            <span className="text-[#888] text-[11px] w-14">{v.name}</span>
                                            <div className="flex-1 bg-[#1e1e2e] rounded-full h-2">
                                                <div className="h-2 rounded-full" style={{ width: `${(v.clicks / VENDORS[0].clicks) * 100}%`, background: PURPLE }} />
                                            </div>
                                            <span className="text-[#555] text-[10px] w-12 text-right">{v.clicks.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Browser versions table */}
                        <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
                            <p className="text-white font-bold text-sm mb-1">Browser Versions</p>
                            <p className="text-[#444] text-[11px] mb-5">From browser_name · browser_version · browser_major</p>
                            <div className="space-y-1">
                                {[
                                    { name: "Chrome", version: "124", major: "124", pct: 34, clicks: 4821 },
                                    { name: "Chrome", version: "123", major: "123", pct: 24, clicks: 3401 },
                                    { name: "Safari", version: "17.4", major: "17", pct: 14, clicks: 1988 },
                                    { name: "Safari", version: "17.3", major: "17", pct: 8, clicks: 1135 },
                                    { name: "Firefox", version: "125.0", major: "125", pct: 7, clicks: 993 },
                                    { name: "Edge", version: "124.0", major: "124", pct: 7, clicks: 993 },
                                    { name: "Chrome", version: "122", major: "122", pct: 4, clicks: 568 },
                                    { name: "Other", version: "—", major: "—", pct: 2, clicks: 284 },
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center gap-4 py-2 border-b border-[#161622] last:border-0">
                                        <span className="text-[#555] text-[11px] w-4">{i + 1}</span>
                                        <span className="text-white text-[11px] font-semibold w-16">{row.name}</span>
                                        <span className="text-[#555] text-[11px] w-16">v{row.version}</span>
                                        <span className="text-[#333] text-[10px] flex-1">major: {row.major}</span>
                                        <div className="w-28 bg-[#1e1e2e] rounded-full h-1.5">
                                            <div className="h-1.5 rounded-full bg-[#6c47ff]" style={{ width: `${row.pct}%` }} />
                                        </div>
                                        <span className="text-[#888] text-[11px] w-10 text-right">{row.pct}%</span>
                                        <span className="text-white font-bold text-[11px] w-14 text-right">{row.clicks.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Device models */}
                        <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5">
                            <p className="text-white font-bold text-sm mb-1">Device Models</p>
                            <p className="text-[#444] text-[11px] mb-5">device_model field breakdown</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { model: "iPhone 15 Pro", vendor: "Apple", clicks: 1820 },
                                    { model: "Galaxy S24", vendor: "Samsung", clicks: 1340 },
                                    { model: "iPhone 14", vendor: "Apple", clicks: 1100 },
                                    { model: "MacBook Pro", vendor: "Apple", clicks: 980 },
                                    { model: "Pixel 7 Pro", vendor: "Google", clicks: 760 },
                                    { model: "Galaxy A54", vendor: "Samsung", clicks: 654 },
                                    { model: "iPad Pro M2", vendor: "Apple", clicks: 543 },
                                    { model: "Redmi Note 13", vendor: "Xiaomi", clicks: 432 },
                                ].map((d) => (
                                    <div key={d.model} className="bg-[#0d0d14] border border-[#1e1e2e] rounded-lg p-3 hover:border-[#6c47ff]/30 transition-colors">
                                        <p className="text-white text-[11px] font-semibold mb-0.5">{d.model}</p>
                                        <p className="text-[#444] text-[10px] mb-2">{d.vendor}</p>
                                        <p className="text-[#6c47ff] font-black text-base">{d.clicks.toLocaleString()}</p>
                                        <p className="text-[#333] text-[10px]">clicks</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer note */}
                <div className="mt-8 flex items-center justify-between border-t border-[#1e1e2e] pt-5">
                    <p className="text-[#2a2a3a] text-[10px] tracking-wider">
                        Schema: User → NanoIds → Analytics · All fields mapped
                    </p>
                    <p className="text-[#2a2a3a] text-[10px]">snip.ly dashboard v1.0 · {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
}