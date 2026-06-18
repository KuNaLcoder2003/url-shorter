import { useState } from "react";

type AuthMode = "signin" | "signup";

interface FormState {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function AuthPage() {
    const [mode, setMode] = useState<AuthMode>("signin");
    const [form, setForm] = useState<FormState>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((r) => setTimeout(r, 1500));
        setLoading(false);
    };

    const isSignup = mode === "signup";

    return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden font-mono">

            {/* Ambient grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            {/* Glow blobs */}
            <div className="absolute top-[-120px] left-[-80px] w-[420px] h-[420px] rounded-full bg-[#6c47ff] opacity-[0.12] blur-[90px] pointer-events-none" />
            <div className="absolute bottom-[-80px] right-[-60px] w-[320px] h-[320px] rounded-full bg-[#00d4aa] opacity-[0.10] blur-[70px] pointer-events-none" />

            <div className="relative w-full max-w-[440px]">

                {/* Logo */}
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[#6c47ff] flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M2 8H14M10 4L14 8L10 12" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <span className="text-white text-xl font-bold tracking-tight">
                            snip<span className="text-[#6c47ff]">.</span>ly
                        </span>
                    </div>
                    <p className="text-[#888] text-xs tracking-widest uppercase">
                        URL Intelligence Platform
                    </p>
                </div>

                {/* Card */}
                <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(108,71,255,0.08)]">

                    {/* Toggle */}
                    <div className="flex border-b border-[#1e1e2e]">
                        {(["signin", "signup"] as AuthMode[]).map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`flex-1 py-4 text-sm font-medium tracking-wider uppercase transition-all duration-300 relative ${mode === m
                                    ? "text-white"
                                    : "text-[#555] hover:text-[#999]"
                                    }`}
                            >
                                {m === "signin" ? "Sign In" : "Sign Up"}
                                {mode === m && (
                                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#6c47ff]" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Form */}
                    <div className="p-8">
                        <div className="space-y-4">

                            {/* Name field — signup only */}
                            <div
                                className="overflow-hidden transition-all duration-500"
                                style={{ maxHeight: isSignup ? "80px" : "0", opacity: isSignup ? 1 : 0 }}
                            >
                                <label className="block text-[11px] text-[#555] tracking-widest uppercase mb-1.5">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Ada Lovelace"
                                    className="w-full bg-[#0d0d14] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#6c47ff] focus:ring-1 focus:ring-[#6c47ff]/30 transition-all"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-[11px] text-[#555] tracking-widest uppercase mb-1.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full bg-[#0d0d14] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#6c47ff] focus:ring-1 focus:ring-[#6c47ff]/30 transition-all"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-[11px] text-[#555] tracking-widest uppercase mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full bg-[#0d0d14] border border-[#1e1e2e] rounded-lg px-4 py-3 pr-12 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#6c47ff] focus:ring-1 focus:ring-[#6c47ff]/30 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((p) => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444] hover:text-[#888] transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />
                                            </svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password — signup only */}
                            <div
                                className="overflow-hidden transition-all duration-500"
                                style={{ maxHeight: isSignup ? "80px" : "0", opacity: isSignup ? 1 : 0 }}
                            >
                                <label className="block text-[11px] text-[#555] tracking-widest uppercase mb-1.5">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-[#0d0d14] border border-[#1e1e2e] rounded-lg px-4 py-3 text-sm text-white placeholder-[#333] focus:outline-none focus:border-[#6c47ff] focus:ring-1 focus:ring-[#6c47ff]/30 transition-all"
                                />
                            </div>

                            {/* Forgot password */}
                            {!isSignup && (
                                <div className="text-right">
                                    <button className="text-xs text-[#555] hover:text-[#6c47ff] transition-colors">
                                        Forgot password?
                                    </button>
                                </div>
                            )}

                            {/* Submit */}
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full mt-2 py-3.5 rounded-lg bg-[#6c47ff] hover:bg-[#7c57ff] active:scale-[0.98] text-white text-sm font-semibold tracking-wide transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                        </svg>
                                        {isSignup ? "Creating account…" : "Signing in…"}
                                    </>
                                ) : (
                                    isSignup ? "Create Account →" : "Sign In →"
                                )}
                            </button>

                            {/* Divider */}
                            <div className="flex items-center gap-3 my-1">
                                <div className="flex-1 h-px bg-[#1e1e2e]" />
                                <span className="text-[#333] text-xs">or</span>
                                <div className="flex-1 h-px bg-[#1e1e2e]" />
                            </div>

                            {/* GitHub OAuth */}
                            <button className="w-full py-3 rounded-lg border border-[#1e1e2e] bg-[#0d0d14] hover:border-[#2e2e42] hover:bg-[#141420] text-[#888] hover:text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2.5">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                                </svg>
                                Continue with GitHub
                            </button>
                        </div>

                        {/* Footer switch */}
                        <p className="text-center text-xs text-[#444] mt-6">
                            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                            <button
                                onClick={() => setMode(isSignup ? "signin" : "signup")}
                                className="text-[#6c47ff] hover:text-[#8c67ff] transition-colors font-medium"
                            >
                                {isSignup ? "Sign in" : "Sign up"}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Stats strip */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                    {[
                        { value: "2.4B+", label: "Links shortened" },
                        { value: "99.9%", label: "Uptime SLA" },
                        { value: "180+", label: "Countries tracked" },
                    ].map((s) => (
                        <div key={s.label} className="text-center">
                            <p className="text-white text-sm font-bold tracking-tight">{s.value}</p>
                            <p className="text-[#444] text-[10px] tracking-wider uppercase mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}