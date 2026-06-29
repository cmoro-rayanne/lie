import { useState } from "react";

const tips = [
    {
        number: "01",
        title: "Be Clear & Specific",
        desc: "State your task upfront. Provide context, details, and break complex requests into smaller steps.",
        icon: "🎯",
    },
    {
        number: "02",
        title: "Use Examples",
        desc: "Show Claude what good output looks like. An example of format or style removes ambiguity instantly.",
        icon: "📋",
    },
    {
        number: "03",
        title: "Encourage Thinking",
        desc: 'Ask Claude to "think step-by-step" on complex tasks. Structured reasoning leads to better answers.',
        icon: "🧠",
    },
    {
        number: "04",
        title: "Iterate & Refine",
        desc: "If the first response misses, give targeted feedback. Say what to adjust and why — not just "make it better."",
        icon: "🔄",
    },
    {
        number: "05",
        title: "Leverage Knowledge",
        desc: "Claude knows a lot across many fields. Give context on how you'll use the information for tighter answers.",
        icon: "📚",
    },
    {
        number: "06",
        title: "Use Role-Playing",
        desc: "Ask Claude to adopt a role or perspective. It unlocks more nuanced, expert-level responses.",
        icon: "🎭",
    },
];

const taskCategories = [
    {
        label: "Content Creation",
        tip: "Specify your audience, define the tone, and give Claude an output structure. A 200-word product description with a call-to-action lands far better than "write a product description."",
    },
    {
        label: "Document Q&A",
        tip: "Refer to documents by name, ask targeted questions, and request citations. This keeps Claude's answers grounded in your actual source material.",
    },
    {
        label: "Data Analysis",
        tip: "Define the exact output format — executive summary, KPI table, trend list, recommendations. Claude structures its analysis around what you'll actually use.",
    },
    {
        label: "Brainstorming",
        tip: "Give Claude parameters: how many ideas, what type, what criteria to sort by. A constrained brainstorm is more useful than an open-ended one.",
    },
];

const comparison = {
    bad: {
        label: "Too vague",
        prompt: "Help me create a marketing strategy.",
        why: "No audience, no product, no output format — Claude has to guess everything.",
    },
    good: {
        label: "Specific & structured",
        prompt:
            "As a senior marketing consultant, develop a strategy for our eco-friendly smartphone accessory line targeting environmentally conscious millennials. Include: market analysis, target persona, marketing mix (4Ps), content strategy, and 5 KPIs to track. Use bullet points and headers.",
        why: "Role assigned, audience named, structure requested, depth specified.",
    },
};

const troubleshooting = [
    {
        title: "Allow uncertainty",
        desc: 'Tell Claude it can say "I don\'t know." Honest gaps are more useful than confident hallucinations.',
    },
    {
        title: "Break down complex tasks",
        desc: "If a task is large and Claude is missing steps, split it across multiple messages and work through them one at a time.",
    },
    {
        title: "Include all context",
        desc: "Claude doesn't retain memory between conversations. Restate the relevant background in each new session.",
    },
];

export default function PromptingGuide() {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#0f0f13", color: "#e8e6f0", minHeight: "100vh" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Syne:wght@700;800&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .display { font-family: 'Syne', sans-serif; }

        .hero-gradient {
          background: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(120, 80, 220, 0.28) 0%, transparent 70%);
        }

        .accent { color: #a78bfa; }
        .accent-bright { color: #c4b5fd; }

        .tag {
          display: inline-block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #a78bfa;
          background: rgba(167,139,250,0.10);
          border: 1px solid rgba(167,139,250,0.2);
          border-radius: 20px;
          padding: 4px 12px;
        }

        .btn-primary {
          background: #7c3aed;
          color: #fff;
          font-weight: 600;
          font-size: 15px;
          padding: 13px 28px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-primary:hover { background: #6d28d9; }

        .btn-ghost {
          background: transparent;
          color: #a78bfa;
          font-weight: 500;
          font-size: 15px;
          padding: 13px 28px;
          border-radius: 10px;
          border: 1px solid rgba(167,139,250,0.3);
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        .btn-ghost:hover { border-color: #a78bfa; background: rgba(167,139,250,0.07); }

        .card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 28px;
          transition: border-color 0.2s, background 0.2s;
        }
        .card:hover {
          border-color: rgba(167,139,250,0.25);
          background: rgba(255,255,255,0.06);
        }

        .tip-number {
          font-family: 'Syne', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: #5b21b6;
          letter-spacing: 0.1em;
        }

        .tab-btn {
          padding: 9px 18px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          transition: all 0.15s;
          color: #9ca3af;
          background: transparent;
        }
        .tab-btn.active {
          background: rgba(167,139,250,0.15);
          color: #c4b5fd;
        }
        .tab-btn:hover:not(.active) { color: #d1d5db; }

        .prompt-box {
          background: rgba(0,0,0,0.3);
          border-radius: 10px;
          padding: 20px;
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 13.5px;
          line-height: 1.7;
          color: #d4d0e8;
        }

        .bad-card {
          border: 1px solid rgba(239, 68, 68, 0.25);
          background: rgba(239, 68, 68, 0.04);
          border-radius: 14px;
          padding: 28px;
        }

        .good-card {
          border: 1px solid rgba(167,139,250,0.3);
          background: rgba(167,139,250,0.04);
          border-radius: 14px;
          padding: 28px;
        }

        .divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.06);
          margin: 0;
        }

        section { padding: 100px 24px; }

        .container { max-width: 1100px; margin: 0 auto; }

        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .grid-6 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

        @media (max-width: 768px) {
          .grid-2, .grid-3, .grid-6 { grid-template-columns: 1fr; }
          section { padding: 64px 20px; }
          .hero-title { font-size: 38px !important; }
          .hide-mobile { display: none; }
        }

        .footer-gradient {
          background: radial-gradient(ellipse 70% 80% at 50% 110%, rgba(109, 40, 217, 0.22) 0%, transparent 65%);
        }
      `}</style>

            {/* Nav */}
            <nav style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px" }}>
                <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 7, background: "linear-gradient(135deg,#7c3aed,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>✦</div>
                        <span className="display" style={{ fontWeight: 800, fontSize: 16, color: "#e8e6f0" }}>Claude Prompting Guide</span>
                    </div>
                    <div style={{ display: "flex", gap: 32 }} className="hide-mobile">
                        {["Tips", "Tasks", "Examples", "Troubleshooting"].map(l => (
                            <a key={l} href="#" style={{ fontSize: 14, color: "#9ca3af", textDecoration: "none", transition: "color 0.15s" }}
                                onMouseEnter={e => e.target.style.color = "#e8e6f0"}
                                onMouseLeave={e => e.target.style.color = "#9ca3af"}>
                                {l}
                            </a>
                        ))}
                    </div>
                    <a href="#" className="btn-primary" style={{ fontSize: 13, padding: "9px 18px" }}>Read the Guide</a>
                </div>
            </nav>

            {/* Hero */}
            <section className="hero-gradient" style={{ paddingTop: 120, paddingBottom: 120, textAlign: "center" }}>
                <div className="container">
                    <div style={{ marginBottom: 20 }}><span className="tag">Practical Prompting</span></div>
                    <h1 className="display hero-title" style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: 24 }}>
                        Get more from<br />
                        <span style={{ background: "linear-gradient(135deg, #c4b5fd, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            every prompt
                        </span>
                    </h1>
                    <p style={{ fontSize: 18, color: "#9ca3af", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 }}>
                        Six techniques that turn vague requests into precise, useful responses — with real before/after examples.
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                        <a href="#" className="btn-primary">Start reading →</a>
                        <a href="#" className="btn-ghost">See examples</a>
                    </div>
                    {/* Stat strip */}
                    <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 72, flexWrap: "wrap" }}>
                        {[["6", "Core techniques"], ["4", "Task categories"], ["10+", "Prompt examples"]].map(([n, l]) => (
                            <div key={l} style={{ textAlign: "center" }}>
                                <div className="display accent-bright" style={{ fontSize: 36, fontWeight: 800, lineHeight: 1 }}>{n}</div>
                                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 6 }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <hr className="divider" />

            {/* Core tips */}
            <section>
                <div className="container">
                    <div style={{ marginBottom: 56, textAlign: "center" }}>
                        <div style={{ marginBottom: 12 }}><span className="tag">Core techniques</span></div>
                        <h2 className="display" style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em" }}>Six things that always work</h2>
                        <p style={{ color: "#6b7280", marginTop: 14, fontSize: 16 }}>These principles apply regardless of what you're asking Claude to do.</p>
                    </div>
                    <div className="grid-6">
                        {tips.map(t => (
                            <div key={t.number} className="card">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                                    <span style={{ fontSize: 26 }}>{t.icon}</span>
                                    <span className="tip-number">{t.number}</span>
                                </div>
                                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, color: "#e8e6f0" }}>{t.title}</h3>
                                <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.65 }}>{t.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <hr className="divider" />

            {/* Task-specific */}
            <section>
                <div className="container">
                    <div style={{ marginBottom: 40 }}>
                        <div style={{ marginBottom: 12 }}><span className="tag">By use case</span></div>
                        <h2 className="display" style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em" }}>Tips by task type</h2>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
                        {taskCategories.map((t, i) => (
                            <button key={t.label} className={`tab-btn ${activeTab === i ? "active" : ""}`} onClick={() => setActiveTab(i)}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                    <div className="card" style={{ padding: 36 }}>
                        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }} className="display">{taskCategories[activeTab].label}</h3>
                        <p style={{ fontSize: 15.5, color: "#9ca3af", lineHeight: 1.75, maxWidth: 640 }}>{taskCategories[activeTab].tip}</p>
                    </div>
                </div>
            </section>

            <hr className="divider" />

            {/* Before/After */}
            <section>
                <div className="container">
                    <div style={{ marginBottom: 48, textAlign: "center" }}>
                        <div style={{ marginBottom: 12 }}><span className="tag">Before & after</span></div>
                        <h2 className="display" style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em" }}>See the difference</h2>
                        <p style={{ color: "#6b7280", marginTop: 14, fontSize: 16 }}>A small change in prompt quality makes a big change in output quality.</p>
                    </div>
                    <div className="grid-2">
                        {/* Bad */}
                        <div className="bad-card">
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
                                <span style={{ fontSize: 12, fontWeight: 600, color: "#ef4444", letterSpacing: "0.08em", textTransform: "uppercase" }}>{comparison.bad.label}</span>
                            </div>
                            <div className="prompt-box" style={{ marginBottom: 16 }}>"{comparison.bad.prompt}"</div>
                            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{comparison.bad.why}</p>
                        </div>
                        {/* Good */}
                        <div className="good-card">
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#a78bfa", display: "inline-block" }} />
                                <span style={{ fontSize: 12, fontWeight: 600, color: "#a78bfa", letterSpacing: "0.08em", textTransform: "uppercase" }}>{comparison.good.label}</span>
                            </div>
                            <div className="prompt-box" style={{ marginBottom: 16 }}>"{comparison.good.prompt}"</div>
                            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{comparison.good.why}</p>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="divider" />

            {/* Troubleshooting */}
            <section>
                <div className="container">
                    <div style={{ marginBottom: 48 }}>
                        <div style={{ marginBottom: 12 }}><span className="tag">When things go wrong</span></div>
                        <h2 className="display" style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em" }}>Troubleshooting</h2>
                    </div>
                    <div className="grid-3">
                        {troubleshooting.map((t, i) => (
                            <div key={i} className="card" style={{ display: "flex", gap: 16 }}>
                                <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, color: "#a78bfa", fontWeight: 700 }}>
                                    {i + 1}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{t.title}</h3>
                                    <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.65 }}>{t.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <hr className="divider" />

            {/* Footer CTA */}
            <section className="footer-gradient" style={{ textAlign: "center", paddingTop: 100, paddingBottom: 100 }}>
                <div className="container">
                    <h2 className="display" style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 16, lineHeight: 1.15 }}>
                        Start prompting<br />
                        <span style={{ background: "linear-gradient(135deg, #c4b5fd, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>smarter today</span>
                    </h2>
                    <p style={{ color: "#6b7280", fontSize: 16, marginBottom: 36, lineHeight: 1.6 }}>
                        Read the full guide. Your next conversation with Claude will be different.
                    </p>
                    <a href="#" className="btn-primary" style={{ fontSize: 16, padding: "15px 34px" }}>Read the full guide →</a>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 24px", textAlign: "center" }}>
                <p style={{ fontSize: 13, color: "#4b5563" }}>Claude Prompting Guide · Built for people who want better answers</p>
            </footer>
        </div>
    );
}
