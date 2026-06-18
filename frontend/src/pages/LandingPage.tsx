import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["Features", "Analytics", "Pricing", "Docs"];

const FEATURES = [
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
        ),
        title: "Smart Short Links",
        desc: "Generate branded, memorable URLs in milliseconds. Custom slugs, expiry dates, and password protection built in.",
    },
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
        ),
        title: "Real-Time Analytics",
        desc: "Track every click with millisecond precision. Geo, device, referrer, UTM — all in one live dashboard.",
    },
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
        ),
        title: "Global CDN",
        desc: "Sub-50ms redirects from 180+ PoPs worldwide. Your links never sleep, never slow down.",
    },
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M9 9h6M9 12h6M9 15h4" />
            </svg>
        ),
        title: "API-First Design",
        desc: "Full REST & GraphQL APIs. Webhooks, SDKs in 8 languages, and Zapier/Make integrations out of the box.",
    },
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
        ),
        title: "Enterprise Security",
        desc: "SOC 2 Type II certified. SSO, SAML, role-based access, audit logs, and custom data residency.",
    },
    {
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
        title: "Team Workspaces",
        desc: "Collaborate with unlimited teammates. Shared link libraries, permission tiers, and activity feeds.",
    },
];

const STATS = [
    { value: "2.4B+", label: "Links shortened" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "180+", label: "Countries tracked" },
    { value: "< 50ms", label: "Global redirect" },
];

const PLANS = [
    {
        name: "Starter",
        price: "$0",
        period: "forever",
        features: ["1,000 links/mo", "Basic analytics", "QR codes", "API access"],
        cta: "Get started free",
        highlight: false,
    },
    {
        name: "Pro",
        price: "$19",
        period: "per month",
        features: ["Unlimited links", "Real-time analytics", "Custom domains", "Team of 5", "Priority support"],
        cta: "Start free trial",
        highlight: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "contact us",
        features: ["Everything in Pro", "SSO / SAML", "SLA guarantee", "Dedicated infra", "White-labeling"],
        cta: "Talk to sales",
        highlight: false,
    },
];

const TESTIMONIALS = [
    {
        quote: "snip.ly cut our campaign tracking setup from days to minutes. The analytics are genuinely world-class.",
        author: "Priya Mehta",
        role: "Head of Growth, Razorpay",
        initials: "PM",
    },
    {
        quote: "We handle 40M redirects a month and haven't seen a single hiccup. The uptime is not marketing — it's real.",
        author: "James Okonkwo",
        role: "Platform Engineer, Shopify",
        initials: "JO",
    },
    {
        quote: "Finally a URL tool that doesn't look like it was designed in 2009. Our team actually enjoys using it.",
        author: "Sara Lindqvist",
        role: "Design Lead, Linear",
        initials: "SL",
    },
];

function useInView(ref: React.RefObject<Element>, threshold = 0.15) {
    const [inView, setInView] = useState(false);
    useEffect(() => {
        if (!ref.current) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
        obs.observe(ref.current);
        return () => obs.disconnect();
    }, [ref, threshold]);
    return inView;
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
    const ref = useRef<HTMLDivElement>(null!);
    const inView = useInView(ref);
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(28px)",
                transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

export default function LandingPage() {
    const [url, setUrl] = useState("");
    const [shortened, setShortened] = useState("");
    const [shortening, setShortening] = useState(false);
    const [copied, setCopied] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleShorten = async () => {
        if (!url.trim()) return;
        setShortening(true);
        await new Promise((r) => setTimeout(r, 1200));
        const slug = Math.random().toString(36).slice(2, 7);
        setShortened(`snip.ly/${slug}`);
        setShortening(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shortened);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white font-mono overflow-x-hidden">

            {/* ── Ambient background ── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div
                    className="absolute inset-0 opacity-[0.032]"
                    style={{
                        backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
                <div className="absolute top-[-160px] left-[-100px] w-[600px] h-[600px] rounded-full bg-[#6c47ff] opacity-[0.10] blur-[120px]" />
                <div className="absolute top-[40%] right-[-80px] w-[400px] h-[400px] rounded-full bg-[#00d4aa] opacity-[0.07] blur-[100px]" />
                <div className="absolute bottom-[-100px] left-[30%] w-[500px] h-[300px] rounded-full bg-[#6c47ff] opacity-[0.06] blur-[90px]" />
            </div>

            {/* ── Navbar ── */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0a0a0f]/90 backdrop-blur-md border-b border-[#1e1e2e]" : ""
                    }`}
            >
                <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-[#6c47ff] flex items-center justify-center">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <path d="M2 8H14M10 4L14 8L10 12" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-white text-lg font-bold tracking-tight">
                            snip<span className="text-[#6c47ff]">.</span>ly
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map((l) => (
                            <a key={l} href="#" className="text-[#666] hover:text-white text-xs tracking-widest uppercase transition-colors">
                                {l}
                            </a>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <a href="#" className="text-[#666] hover:text-white text-xs tracking-widest uppercase transition-colors">
                            Sign in
                        </a>
                        <a
                            href="#"
                            className="px-4 py-2 rounded-lg bg-[#6c47ff] hover:bg-[#7c57ff] text-white text-xs font-semibold tracking-wider transition-colors"
                        >
                            Get started →
                        </a>
                    </div>

                    <button
                        className="md:hidden text-[#666] hover:text-white"
                        onClick={() => setMobileOpen((p) => !p)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                            {mobileOpen ? (
                                <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                            ) : (
                                <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
                            )}
                        </svg>
                    </button>
                </nav>

                {mobileOpen && (
                    <div className="md:hidden bg-[#111118] border-b border-[#1e1e2e] px-6 py-4 flex flex-col gap-4">
                        {NAV_LINKS.map((l) => (
                            <a key={l} href="#" className="text-[#888] text-xs tracking-widest uppercase">{l}</a>
                        ))}
                        <a href="#" className="px-4 py-2.5 rounded-lg bg-[#6c47ff] text-white text-xs font-semibold tracking-wider text-center">
                            Get started →
                        </a>
                    </div>
                )}
            </header>

            {/* ── Hero ── */}
            <section className="relative z-10 pt-40 pb-28 px-6 text-center max-w-4xl mx-auto">
                <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#6c47ff]/30 bg-[#6c47ff]/10 mb-8"
                    style={{ animation: "fadeDown 0.6s ease both" }}
                >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6c47ff] animate-pulse" />
                    <span className="text-[#9b7fff] text-[11px] tracking-widest uppercase font-semibold">
                        New — AI-powered link insights
                    </span>
                </div>

                <h1
                    className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6"
                    style={{ animation: "fadeDown 0.6s ease 0.1s both" }}
                >
                    Short links.
                    <br />
                    <span className="text-[#6c47ff]">Deep analytics.</span>
                </h1>

                <p
                    className="text-[#777] text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-12"
                    style={{ animation: "fadeDown 0.6s ease 0.2s both" }}
                >
                    Shorten any URL in seconds. Track every click, device, and location in real-time.
                    Built for developers, growth teams, and everyone in between.
                </p>

                {/* URL shortener widget */}
                <div
                    className="max-w-2xl mx-auto"
                    style={{ animation: "fadeDown 0.6s ease 0.3s both" }}
                >
                    <div className="flex gap-2 bg-[#111118] border border-[#1e1e2e] rounded-xl p-2 focus-within:border-[#6c47ff]/50 transition-colors">
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleShorten()}
                            placeholder="Paste your long URL here…"
                            className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-[#333] outline-none"
                        />
                        <button
                            onClick={handleShorten}
                            disabled={shortening || !url.trim()}
                            className="px-5 py-2.5 rounded-lg bg-[#6c47ff] hover:bg-[#7c57ff] text-white text-xs font-semibold tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
                        >
                            {shortening ? (
                                <>
                                    <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
                                    </svg>
                                    Shortening…
                                </>
                            ) : "Shorten →"}
                        </button>
                    </div>

                    {shortened && (
                        <div className="mt-3 flex items-center justify-between bg-[#111118] border border-[#00d4aa]/30 rounded-xl px-4 py-3">
                            <span className="text-[#00d4aa] text-sm font-semibold">{shortened}</span>
                            <button
                                onClick={handleCopy}
                                className="text-[11px] tracking-widest uppercase text-[#555] hover:text-[#00d4aa] transition-colors flex items-center gap-1.5"
                            >
                                {copied ? (
                                    <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg> Copied!</>
                                ) : (
                                    <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg> Copy</>
                                )}
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-[#333] text-[11px] tracking-wider mt-4" style={{ animation: "fadeDown 0.6s ease 0.4s both" }}>
                    No credit card required · Free forever plan · 30-day trial on Pro
                </p>
            </section>

            {/* ── Stats strip ── */}
            <section className="relative z-10 border-y border-[#1e1e2e] bg-[#0d0d14]">
                <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {STATS.map((s, i) => (
                        <FadeIn key={s.label} delay={i * 80} className="text-center">
                            <p className="text-2xl md:text-3xl font-black text-white tracking-tight">{s.value}</p>
                            <p className="text-[#444] text-[10px] tracking-widest uppercase mt-1">{s.label}</p>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* ── Analytics preview ── */}
            <section className="relative z-10 py-28 px-6 max-w-6xl mx-auto">
                <FadeIn className="text-center mb-16">
                    <p className="text-[11px] text-[#6c47ff] tracking-widest uppercase mb-3">Analytics</p>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
                        Know every click.<br /><span className="text-[#555]">Down to the millisecond.</span>
                    </h2>
                    <p className="text-[#555] max-w-md mx-auto text-sm leading-relaxed">
                        Real-time dashboards, geographic heatmaps, device breakdowns, and UTM attribution — all in one place.
                    </p>
                </FadeIn>

                {/* Mock dashboard */}
                <FadeIn delay={150}>
                    <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden shadow-[0_40px_120px_rgba(108,71,255,0.12)]">
                        {/* Dashboard header */}
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1e1e2e]">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                            </div>
                            <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-md px-3 py-1 text-[#444] text-[11px]">
                                app.snip.ly/dashboard
                            </div>
                            <div className="w-16" />
                        </div>
                        {/* Dashboard body */}
                        <div className="p-5 grid grid-cols-3 gap-4">
                            {/* Metric cards */}
                            {[
                                { label: "Total clicks", val: "1,284,033", change: "+12.4%" },
                                { label: "Unique visitors", val: "948,201", change: "+8.1%" },
                                { label: "Avg. redirect", val: "43ms", change: "−2ms" },
                            ].map((m) => (
                                <div key={m.label} className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4">
                                    <p className="text-[#444] text-[10px] tracking-widest uppercase mb-2">{m.label}</p>
                                    <p className="text-white text-xl font-black tracking-tight">{m.val}</p>
                                    <p className="text-[#00d4aa] text-[11px] mt-1">{m.change} this week</p>
                                </div>
                            ))}
                            {/* Fake sparkline */}
                            <div className="col-span-3 bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4">
                                <p className="text-[#444] text-[10px] tracking-widest uppercase mb-3">Clicks over time</p>
                                <svg viewBox="0 0 600 80" className="w-full" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6c47ff" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#6c47ff" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,60 C40,55 80,30 120,40 C160,50 200,20 240,25 C280,30 320,10 360,15 C400,20 440,5 480,8 C520,11 560,3 600,5 L600,80 L0,80 Z" fill="url(#cg)" />
                                    <path d="M0,60 C40,55 80,30 120,40 C160,50 200,20 240,25 C280,30 320,10 360,15 C400,20 440,5 480,8 C520,11 560,3 600,5" fill="none" stroke="#6c47ff" strokeWidth="2" />
                                </svg>
                            </div>
                            {/* Top countries */}
                            <div className="col-span-2 bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4">
                                <p className="text-[#444] text-[10px] tracking-widest uppercase mb-3">Top countries</p>
                                {[["🇮🇳 India", 38], ["🇺🇸 United States", 27], ["🇬🇧 United Kingdom", 14], ["🇩🇪 Germany", 9]].map(([name, pct]) => (
                                    <div key={String(name)} className="flex items-center gap-3 mb-2">
                                        <span className="text-[#777] text-[11px] w-32">{name}</span>
                                        <div className="flex-1 bg-[#1e1e2e] rounded-full h-1.5">
                                            <div className="bg-[#6c47ff] h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="text-[#444] text-[10px] w-8 text-right">{pct}%</span>
                                    </div>
                                ))}
                            </div>
                            {/* Device split */}
                            <div className="bg-[#0d0d14] border border-[#1e1e2e] rounded-xl p-4 flex flex-col justify-center">
                                <p className="text-[#444] text-[10px] tracking-widest uppercase mb-4">Device split</p>
                                <svg viewBox="0 0 80 80" className="w-20 h-20 mx-auto mb-3">
                                    <circle cx="40" cy="40" r="28" fill="none" stroke="#1e1e2e" strokeWidth="12" />
                                    <circle cx="40" cy="40" r="28" fill="none" stroke="#6c47ff" strokeWidth="12" strokeDasharray="105 71" strokeDashoffset="21" strokeLinecap="round" />
                                    <circle cx="40" cy="40" r="28" fill="none" stroke="#00d4aa" strokeWidth="12" strokeDasharray="49 127" strokeDashoffset="-84" strokeLinecap="round" />
                                </svg>
                                <div className="flex flex-col gap-1 text-[11px]">
                                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#6c47ff]" />Mobile 60%</div>
                                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00d4aa]" />Desktop 28%</div>
                                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#444]" />Tablet 12%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </section>

            {/* ── Features ── */}
            <section className="relative z-10 py-24 px-6 bg-[#0d0d14] border-y border-[#1e1e2e]">
                <div className="max-w-5xl mx-auto">
                    <FadeIn className="text-center mb-16">
                        <p className="text-[11px] text-[#6c47ff] tracking-widest uppercase mb-3">Features</p>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                            Everything you need.<br /><span className="text-[#555]">Nothing you don't.</span>
                        </h2>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-4">
                        {FEATURES.map((f, i) => (
                            <FadeIn key={f.title} delay={i * 60}>
                                <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-5 hover:border-[#6c47ff]/40 transition-colors group h-full">
                                    <div className="w-9 h-9 rounded-lg bg-[#6c47ff]/10 border border-[#6c47ff]/20 flex items-center justify-center text-[#6c47ff] mb-4 group-hover:bg-[#6c47ff]/20 transition-colors">
                                        {f.icon}
                                    </div>
                                    <h3 className="text-white text-sm font-bold mb-2">{f.title}</h3>
                                    <p className="text-[#555] text-xs leading-relaxed">{f.desc}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className="relative z-10 py-28 px-6">
                <div className="max-w-5xl mx-auto">
                    <FadeIn className="text-center mb-16">
                        <p className="text-[11px] text-[#6c47ff] tracking-widest uppercase mb-3">Testimonials</p>
                        <h2 className="text-3xl md:text-4xl font-black tracking-tight">
                            Trusted by teams<br /><span className="text-[#555]">shipping at scale.</span>
                        </h2>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-4">
                        {TESTIMONIALS.map((t, i) => (
                            <FadeIn key={t.author} delay={i * 80}>
                                <div className="bg-[#111118] border border-[#1e1e2e] rounded-xl p-6 h-full flex flex-col">
                                    <div className="flex mb-4">
                                        {[...Array(5)].map((_, s) => (
                                            <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="#6c47ff" className="mr-0.5">
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-[#888] text-xs leading-relaxed flex-1 mb-5">"{t.quote}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#6c47ff]/20 border border-[#6c47ff]/30 flex items-center justify-center text-[#9b7fff] text-[10px] font-bold">
                                            {t.initials}
                                        </div>
                                        <div>
                                            <p className="text-white text-xs font-semibold">{t.author}</p>
                                            <p className="text-[#444] text-[10px]">{t.role}</p>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Pricing ── */}
            <section className="relative z-10 py-24 px-6 bg-[#0d0d14] border-y border-[#1e1e2e]">
                <div className="max-w-4xl mx-auto">
                    <FadeIn className="text-center mb-16">
                        <p className="text-[11px] text-[#6c47ff] tracking-widest uppercase mb-3">Pricing</p>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight">
                            Simple pricing.<br /><span className="text-[#555]">Scale as you grow.</span>
                        </h2>
                    </FadeIn>

                    <div className="grid md:grid-cols-3 gap-4">
                        {PLANS.map((p, i) => (
                            <FadeIn key={p.name} delay={i * 80}>
                                <div
                                    className={`rounded-xl p-6 h-full flex flex-col border transition-colors ${p.highlight
                                        ? "bg-[#6c47ff]/10 border-[#6c47ff]/50 shadow-[0_0_40px_rgba(108,71,255,0.15)]"
                                        : "bg-[#111118] border-[#1e1e2e]"
                                        }`}
                                >
                                    {p.highlight && (
                                        <span className="self-start px-2.5 py-1 rounded-md bg-[#6c47ff] text-white text-[10px] font-bold tracking-widest uppercase mb-4">
                                            Most popular
                                        </span>
                                    )}
                                    <p className="text-[#777] text-[11px] tracking-widest uppercase mb-2">{p.name}</p>
                                    <div className="flex items-baseline gap-1 mb-1">
                                        <span className="text-white text-4xl font-black">{p.price}</span>
                                    </div>
                                    <p className="text-[#444] text-[11px] mb-6">{p.period}</p>

                                    <ul className="space-y-2.5 flex-1 mb-6">
                                        {p.features.map((f) => (
                                            <li key={f} className="flex items-center gap-2 text-[#888] text-xs">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6c47ff" strokeWidth="2.5" strokeLinecap="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        className={`w-full py-3 rounded-lg text-xs font-semibold tracking-wider transition-all ${p.highlight
                                            ? "bg-[#6c47ff] hover:bg-[#7c57ff] text-white"
                                            : "border border-[#1e1e2e] hover:border-[#6c47ff]/40 text-[#777] hover:text-white"
                                            }`}
                                    >
                                        {p.cta} →
                                    </button>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative z-10 py-32 px-6 text-center">
                <FadeIn>
                    <p className="text-[11px] text-[#6c47ff] tracking-widest uppercase mb-4">Get started</p>
                    <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
                        Your links.<br />
                        <span className="text-[#6c47ff]">Your data.</span><br />
                        Your edge.
                    </h2>
                    <p className="text-[#555] max-w-md mx-auto text-sm mb-10 leading-relaxed">
                        Join 50,000+ marketers, developers, and growth teams who trust snip.ly to power their link infrastructure.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a href="#" className="px-8 py-3.5 rounded-xl bg-[#6c47ff] hover:bg-[#7c57ff] text-white text-sm font-semibold tracking-wide transition-colors">
                            Start for free →
                        </a>
                        <a href="#" className="px-8 py-3.5 rounded-xl border border-[#1e1e2e] hover:border-[#6c47ff]/40 text-[#777] hover:text-white text-sm font-semibold tracking-wide transition-colors">
                            View demo
                        </a>
                    </div>
                </FadeIn>
            </section>

            {/* ── Footer ── */}
            <footer className="relative z-10 border-t border-[#1e1e2e] py-10 px-6">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-[#6c47ff] flex items-center justify-center">
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                                <path d="M2 8H14M10 4L14 8L10 12" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-white text-sm font-bold tracking-tight">snip<span className="text-[#6c47ff]">.</span>ly</span>
                    </div>

                    <div className="flex items-center gap-6">
                        {["Privacy", "Terms", "Docs", "Status", "Blog"].map((l) => (
                            <a key={l} href="#" className="text-[#444] hover:text-[#888] text-[11px] tracking-widest uppercase transition-colors">
                                {l}
                            </a>
                        ))}
                    </div>

                    <p className="text-[#333] text-[11px]">© 2026 snip.ly · All rights reserved</p>
                </div>
            </footer>

            <style>{`
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}