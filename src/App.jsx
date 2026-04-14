import { useState, useEffect, useRef } from "react";
import { INFO, SKILLS, EXPERIENCES, PROJECTS, EDUCATION, LANGUAGES } from "./data";
import emailjs from "@emailjs/browser";

/* ─── Hook: Scroll Reveal ─────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(e.target); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Reusable: Animated Card (wraps useReveal safely) ────── */
function RevealCard({ children, className = "", delay = 0, style = {} }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(32px)",
        transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Tag ─────────────────────────────────────────────────── */
function Tag({ label, color }) {
  return <span className={`tag tag-${color}`}>{label}</span>;
}

/* ─── Section Header ──────────────────────────────────────── */
function SectionLabel({ label, title, accent, sub }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className="mb-16"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
        transition: "opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1)",
      }}
    >
      <span
        className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
        style={{ color: "var(--accent)", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}
      >
        {label}
      </span>
      <h2
        className="font-display font-black tracking-tight leading-none mb-3"
        style={{ fontSize: "clamp(2.4rem,5vw,3.4rem)", color: "var(--text)" }}
      >
        {title} <span style={{ color: "var(--accent)" }}>{accent}</span>
      </h2>
      {sub && <p className="text-base mt-3 max-w-xl" style={{ color: "var(--muted)" }}>{sub}</p>}
    </div>
  );
}

/* ─── NAVBAR ──────────────────────────────────────────────── */
function Navbar({ dark, toggleDark }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = ["About", "Skills", "Experience", "Projects", "Education", "Community", "Contact"];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const go = (id) => {
    setOpen(false);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? (dark ? "rgba(6,6,8,0.92)" : "rgba(250,250,254,0.92)") : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-display text-lg font-black tracking-tight"
          style={{ color: "var(--accent)" }}
        >
          LM<span style={{ color: "var(--accent2)" }}>.</span>
        </button>

        <ul className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <li key={l}>
              <button
                onClick={() => go(l)}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: "var(--muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
              >
                {l}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDark}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            title="Toggle theme"
          >
            <span style={{ fontSize: 15 }}>{dark ? "☀" : "☾"}</span>
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden w-9 h-9 flex flex-col justify-center items-center gap-1.5"
          >
            <span className="block w-5 h-0.5 transition-all" style={{ background: "var(--muted)", transform: open ? "rotate(45deg) translateY(5px)" : "none" }} />
            <span className="block w-5 h-0.5" style={{ background: "var(--muted)", opacity: open ? 0 : 1 }} />
            <span className="block w-5 h-0.5 transition-all" style={{ background: "var(--muted)", transform: open ? "rotate(-45deg) translateY(-5px)" : "none" }} />
          </button>
        </div>
      </div>

      {open && (
        <div
          className="lg:hidden px-6 pb-6 flex flex-col gap-4"
          style={{ background: dark ? "rgba(6,6,8,0.97)" : "rgba(250,250,254,0.97)", borderTop: "1px solid var(--border)" }}
        >
          {links.map((l) => (
            <button key={l} onClick={() => go(l)} className="text-left text-sm font-medium py-2" style={{ color: "var(--muted)" }}>
              {l}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ─── HERO ────────────────────────────────────────────────── */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 120); return () => clearTimeout(t); }, []);

  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Ambient orbs */}
      <div className="orb" style={{ width: 700, height: 700, background: "radial-gradient(circle,rgba(139,92,246,0.18),transparent)", top: "-15%", left: "-15%" }} />
      <div className="orb" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(34,211,238,0.12),transparent)", bottom: "0", right: "-5%", animation: "float 8s ease-in-out infinite" }} />
      <div className="orb" style={{ width: 300, height: 300, background: "radial-gradient(circle,rgba(232,121,249,0.1),transparent)", top: "40%", left: "55%" }} />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%,black 0%,transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center gap-16 md:gap-20">

        {/* ── Photo ── */}
        <div
          className="flex-shrink-0"
          style={{
              marginLeft: "60px",
              opacity: loaded ? 1 : 0,
            transform: loaded ? "none" : "translateY(20px)",
            transition: "opacity 1s ease, transform 1s ease",
            animation: loaded ? "float 6s ease-in-out infinite" : "none",
          }}
        >
          <div className="relative">
            {/* Spinning rings */}
            <div
              className="absolute rounded-full"
              style={{
                inset: -20,
                border: "1px solid transparent",
                borderTop: "1px solid rgba(139,92,246,0.7)",
                borderRight: "1px solid rgba(34,211,238,0.4)",
                animation: "spin 12s linear infinite",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                inset: -38,
                border: "1px dashed rgba(232,121,249,0.2)",
                animation: "spinR 20s linear infinite",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                inset: -56,
                border: "1px solid rgba(139,92,246,0.08)",
                animation: "spin 35s linear infinite",
              }}
            />

            {/* Photo */}
            <div
              className="relative rounded-full overflow-hidden"
              style={{
                width: 240,
                height: 240,
                padding: 3,
                background: "linear-gradient(135deg,#8b5cf6,#22d3ee,#e879f9)",
              }}
            >
              <img
                src="/me_pro.png"
                alt="Loqman Makouri"
                className="w-full h-full rounded-full object-cover"
                style={{ objectPosition: "center top" }}
              />
            </div>

            {/* Status dot */}
            <div
              className="absolute rounded-full border-4"
              style={{
                width: 20,
                height: 20,
                bottom: 14,
                right: 14,
                background: "#34d399",
                borderColor: "var(--bg)",
                boxShadow: "0 0 14px #34d399",
                animation: "glowDot 2s ease-in-out infinite",
              }}
            />

            {/* Floating badges */}
            <div
              className="absolute hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
              style={{
                left: -90, top: 20,
                background: "var(--card)", border: "1px solid var(--border)", color: "var(--accent2)",
                whiteSpace: "nowrap", animation: "float 5s ease-in-out infinite",
              }}
            >
              ⚡ Full Stack Dev
            </div>

          </div>
        </div>

        {/* ── Content ── */}
        <div
          className="flex-1 text-center md:text-left"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "none" : "translateY(24px)",
            transition: "opacity 1s ease .2s, transform 1s ease .2s",
          }}
        >
          {/* Available pill */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-7"
            style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: "var(--green)" }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "var(--green)", boxShadow: "0 0 8px var(--green)", animation: "glowDot 2s infinite" }}
            />
            Available for internships
          </div>

          {/* Name */}
          <h1
            className="font-display font-black leading-none tracking-tighter mb-4"
            style={{ fontSize: "clamp(3.2rem, 8vw, 5.8rem)" }}
          >
            <span
              style={{
                background: "linear-gradient(135deg,var(--text) 30%,var(--accent))",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}
            >
              Loqman
            </span>
            <br />
            <span style={{ color: "var(--text)" }}>Makouri</span>
          </h1>

          <p className="text-lg font-semibold mb-2" style={{ color: "var(--accent2)" }}>
            {INFO.sub}
          </p>
          <p className="text-sm leading-relaxed max-w-xl mb-8 mx-auto md:mx-0" style={{ color: "var(--muted)" }}>
            {INFO.bio}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-8">
            <a href={`mailto:${INFO.email}`} className="btn-glow">
              ✉ Get in Touch
            </a>
            <a href="https://github.com/Loqmanmk" target="_blank" rel="noreferrer" className="btn-outline">
              ⌥ GitHub
            </a>
            <a href="https://linkedin.com/in/loqman-makouri-11871138b" target="_blank" rel="noreferrer" className="btn-outline">
              in LinkedIn
            </a>
            <button
              onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              className="btn-outline"
            >
              📨 Business Inquiry
            </button>
          </div>

          {/* Info row */}
          <div className="flex flex-wrap gap-5 justify-center md:justify-start text-sm" style={{ color: "var(--dim)" }}>
            {[["📍", INFO.location], ["📞", INFO.phone], ["🌐", "4 Languages"]].map(([icon, text]) => (
              <span key={text} className="flex items-center gap-1.5">{icon} {text}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ animation: "float 3s ease-in-out infinite" }}
      >
        <span className="text-xs tracking-widest uppercase" style={{ color: "var(--dim)" }}>scroll</span>
        <div className="w-px h-10" style={{ background: "linear-gradient(to bottom,var(--accent),transparent)" }} />
      </div>

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg);  } }
        @keyframes spinR { to { transform: rotate(-360deg); } }
        @keyframes float { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-12px) } }
        @keyframes glowDot { 0%,100%{ opacity:.7 } 50%{ opacity:1 } }
        @keyframes glow { 0%,100%{ opacity:.6 } 50%{ opacity:1 } }
      `}</style>
    </section>
  );
}

/* ─── SKILLS ──────────────────────────────────────────────── */
function SkillCard({ skill, delay }) {
  return (
    <RevealCard className="glass-card p-6" delay={delay}>
      <div className="text-3xl mb-4">{skill.icon}</div>
      <h3 className="font-bold text-sm mb-3" style={{ color: "var(--text)" }}>{skill.title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {skill.tags.map((t) => <Tag key={t} label={t} color={skill.color} />)}
      </div>
    </RevealCard>
  );
}

function Skills() {
  return (
    <section id="skills" className="relative">
      <div className="section-wrap">
        <SectionLabel label="What I build" title="Technical" accent="Skills" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SKILLS.map((s, i) => <SkillCard key={s.title} skill={s} delay={i * 60} />)}
        </div>
      </div>
    </section>
  );
}

/* ─── EXPERIENCE ──────────────────────────────────────────── */
function ExpCard({ exp, delay }) {
  return (
    <RevealCard delay={delay}>
      <div className="relative pl-8">
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
          style={{ background: "linear-gradient(to bottom,var(--accent),var(--accent2))" }}
        />
        <div
          className="absolute left-0 w-4 h-4 rounded-full top-7 -translate-x-1.5"
          style={{ background: "var(--accent)", boxShadow: "0 0 16px var(--accent)", border: "2px solid var(--bg)" }}
        />
        <div className="glass-card p-7">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <span className="tag tag-g text-xs mb-2 inline-block">{exp.type}</span>
              <h3 className="font-bold text-lg" style={{ color: "var(--text)" }}>{exp.title}</h3>
              <p className="font-semibold text-sm mt-1" style={{ color: "var(--accent2)" }}>{exp.org}</p>
            </div>
            <span
              className="text-xs px-3 py-1 rounded-full whitespace-nowrap"
              style={{ background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }}
            >
              {exp.period}
            </span>
          </div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted)" }}>{exp.desc}</p>
          <div className="flex flex-wrap gap-2">
            {exp.tags.map((t) => <Tag key={t.l} label={t.l} color={t.c} />)}
          </div>
        </div>
      </div>
    </RevealCard>
  );
}

function Experience() {
  return (
    <section id="experience" className="relative">
      <div className="orb" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(34,211,238,0.07),transparent)", left: "-5%", top: "20%" }} />
      <div className="section-wrap">
        <SectionLabel label="Professional journey" title="Work" accent="Experience" />
        <div className="flex flex-col gap-10">
          {EXPERIENCES.map((e, i) => <ExpCard key={e.title} exp={e} delay={i * 100} />)}
        </div>
      </div>
    </section>
  );
}

/* ─── PROJECTS ────────────────────────────────────────────── */
function ProjectCard({ project, delay }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <RevealCard
      className="glass-card p-6 cursor-pointer"
      delay={delay}
      style={{ cursor: "pointer" }}
    >
      <div onClick={() => setExpanded((v) => !v)}>
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-black" style={{ color: "var(--accent)", opacity: .5 }}>{project.num}</span>
          <span className="tag tag-v">{project.cat}</span>
        </div>
        <h3 className="font-bold text-base mb-2" style={{ color: "var(--text)" }}>{project.name}</h3>
        <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--muted)" }}>{project.desc}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.map((t) => <Tag key={t.l} label={t.l} color={t.c} />)}
        </div>
        <div className="flex items-center gap-1 text-xs transition-colors" style={{ color: "var(--dim)" }}>
          <span style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform .2s", display: "inline-block" }}>▶</span>
          <span>{expanded ? "Collapse" : "Read more"}</span>
        </div>
        {expanded && (
          <div
            className="mt-4 pt-4 text-xs leading-relaxed"
            style={{ borderTop: "1px solid var(--border)", color: "var(--accent2)" }}
          >
            Built with: {project.tags.map((t) => t.l).join(", ")} · Click to collapse
          </div>
        )}
      </div>
    </RevealCard>
  );
}

function Projects() {
  const cats = ["All", ...Array.from(new Set(PROJECTS.map((p) => p.cat)))];
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? PROJECTS : PROJECTS.filter((p) => p.cat === cat);

  return (
    <section id="projects" className="relative">
      <div className="orb" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(232,121,249,0.07),transparent)", right: "-5%", top: "10%" }} />
      <div className="section-wrap">
        <SectionLabel
          label="Things I've built"
          title="Featured"
          accent="Projects"
          sub="A selection of projects spanning healthcare, gov-tech, AI, mobile and web platforms."
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200"
              style={{
                background: cat === c ? "var(--accent)" : "var(--surface)",
                color: cat === c ? "#fff" : "var(--muted)",
                border: `1px solid ${cat === c ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => <ProjectCard key={p.num} project={p} delay={i * 60} />)}
        </div>
      </div>
    </section>
  );
}

/* ─── EDUCATION ───────────────────────────────────────────── */
function EduCard({ item, delay }) {
  return (
    <RevealCard className="glass-card p-5 flex gap-4 items-start" delay={delay}>
      <span className="text-2xl flex-shrink-0">{item.icon}</span>
      <div>
        <p className="font-bold text-sm" style={{ color: "var(--text)" }}>{item.degree}</p>
        <p className="text-xs font-semibold mt-1" style={{ color: "var(--accent2)" }}>{item.school}</p>
        <p className="text-xs mt-1" style={{ color: "var(--dim)" }}>{item.period}{item.note ? ` · ${item.note}` : ""}</p>
      </div>
    </RevealCard>
  );
}

function LangCard({ lang, delay }) {
  return (
    <RevealCard className="glass-card p-5 text-center" delay={delay}>
      <div className="text-3xl mb-2">{lang.flag}</div>
      <p className="font-bold text-sm" style={{ color: "var(--text)" }}>{lang.name}</p>
      <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{lang.level}</p>
    </RevealCard>
  );
}

function Education() {
  return (
    <section id="education" className="relative">
      <div className="section-wrap">
        <SectionLabel label="Academic background" title="Education &" accent="Languages" />
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-5" style={{ color: "var(--dim)" }}>Degrees</h3>
            <div className="flex flex-col gap-4">
              {EDUCATION.map((e, i) => <EduCard key={e.degree} item={e} delay={i * 80} />)}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-5" style={{ color: "var(--dim)" }}>Languages spoken</h3>
            <div className="grid grid-cols-2 gap-4">
              {LANGUAGES.map((l, i) => <LangCard key={l.name} lang={l} delay={i * 80} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── COMMUNITY ───────────────────────────────────────────── */
function Community() {
  const [liked, setLiked] = useState(() => localStorage.getItem("lm_liked") === "true");
  const [likes, setLikes] = useState(() => parseInt(localStorage.getItem("lm_likes") || "47", 10));
  const [comments, setComments] = useState(() => {
    try { return JSON.parse(localStorage.getItem("lm_comments") || "[]"); }
    catch { return []; }
  });
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [emoji, setEmoji] = useState("👋");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const emojis = ["👋", "🔥", "💯", "🚀", "⭐", "🎯", "💡", "🤝", "😍", "🙌"];

  const toggleLike = () => {
    const next = !liked;
    const count = next ? likes + 1 : likes - 1;
    setLiked(next);
    setLikes(count);
    localStorage.setItem("lm_liked", String(next));
    localStorage.setItem("lm_likes", String(count));
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    const newC = {
      id: Date.now(),
      name: name.trim(),
      msg: msg.trim(),
      emoji,
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    };
    const updated = [newC, ...comments].slice(0, 50);
    setComments(updated);
    localStorage.setItem("lm_comments", JSON.stringify(updated));
    setName(""); setMsg(""); setEmoji("👋");
    setSending(false); setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <section id="community" className="relative">
      <div className="orb" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(139,92,246,0.09),transparent)", left: "50%", top: "0" }} />
      <div className="section-wrap">
        <SectionLabel
          label="Visitor space"
          title="Community"
          accent="Wall"
          sub="Like this portfolio, drop a comment, or just say hi — your message stays for future visitors."
        />

        {/* Like block */}
        <RevealCard className="glass-card p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-bold text-xl mb-1" style={{ color: "var(--text)" }}>Enjoyed this portfolio?</h3>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Show some love with a like — it really means a lot 🙏</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-black" style={{ color: "var(--accent)" }}>{likes}</div>
              <div className="text-xs mt-1" style={{ color: "var(--dim)" }}>likes</div>
            </div>
            <button
              onClick={toggleLike}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 active:scale-90"
              style={{
                background: liked ? "linear-gradient(135deg,#8b5cf6,#ec4899)" : "var(--surface)",
                border: `2px solid ${liked ? "transparent" : "var(--border)"}`,
                boxShadow: liked ? "0 8px 30px rgba(139,92,246,0.45)" : "none",
                transform: liked ? "scale(1.08)" : "scale(1)",
              }}
            >
              {liked ? "❤️" : "🤍"}
            </button>
          </div>
        </RevealCard>

        {/* Comments grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <RevealCard>
            <h3 className="font-bold text-lg mb-5" style={{ color: "var(--text)" }}>Leave a message</h3>
            <form onSubmit={submitComment} className="flex flex-col gap-4">
              <input
                className="field"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
              />
              <textarea
                className="field"
                placeholder="Your message…"
                rows={4}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                maxLength={300}
                style={{ resize: "none" }}
              />
              <div>
                <p className="text-xs mb-2" style={{ color: "var(--dim)" }}>Pick an emoji reaction</p>
                <div className="flex flex-wrap gap-2">
                  {emojis.map((em) => (
                    <button
                      type="button"
                      key={em}
                      onClick={() => setEmoji(em)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all duration-200"
                      style={{
                        background: emoji === em ? "rgba(139,92,246,0.2)" : "var(--surface)",
                        border: `1px solid ${emoji === em ? "var(--accent)" : "var(--border)"}`,
                        transform: emoji === em ? "scale(1.18)" : "scale(1)",
                      }}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="btn-glow justify-center"
                disabled={sending || !name.trim() || !msg.trim()}
              >
                {sending ? "Posting…" : done ? "✓ Posted!" : "Post message →"}
              </button>
            </form>
          </RevealCard>

          {/* Comments list */}
          <RevealCard delay={100}>
            <h3 className="font-bold text-lg mb-5" style={{ color: "var(--text)" }}>
              Messages{" "}
              <span className="text-sm font-normal ml-1" style={{ color: "var(--dim)" }}>({comments.length})</span>
            </h3>
            {comments.length === 0 ? (
              <div className="glass-card p-8 text-center" style={{ color: "var(--dim)" }}>
                <div className="text-4xl mb-3">💬</div>
                <p className="text-sm">Be the first to leave a message!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 overflow-y-auto pr-1" style={{ maxHeight: 380 }}>
                {comments.map((c) => (
                  <div key={c.id} className="glass-card p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                      >
                        {c.emoji}
                      </div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: "var(--text)" }}>{c.name}</p>
                        <p className="text-xs" style={{ color: "var(--dim)" }}>{c.date}</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{c.msg}</p>
                  </div>
                ))}
              </div>
            )}
          </RevealCard>
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ─────────────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({ name: "", company: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [aiReply, setAiReply] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

        const submit = async (e) => {
            e.preventDefault();
            if (!form.name || !form.email || !form.message) return;

            const lastSubmit = localStorage.getItem("lastSubmitTime");
            const now = Date.now();

            if (lastSubmit && now - lastSubmit < 30000) {
                alert("Please wait 30 seconds before sending again.");
                return;
            }

            localStorage.setItem("lastSubmitTime", now);

            setStatus("loading");
            try {
                await emailjs.send(
                    process.env.REACT_APP_EMAILJS_SERVICE_ID,
                    process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
                    {
                        name:    form.name,
                        email:   form.email,
                        company: form.company || "N/A",
                        subject: form.subject || "General Inquiry",
                        message: form.message,
                    },
                    process.env.REACT_APP_EMAILJS_PUBLIC_KEY
                );
                const subject = form.subject || "General inquiry";
                const company = form.company ? ` from ${form.company}` : "";
                const reply = `Dear ${form.name},\n\nThank you${company} for reaching out through my portfolio! I've received your message regarding "${subject}" and truly appreciate you taking the time to write.\n\nI'll review your message carefully and get back to you as soon as possible — usually within 24 to 48 hours.\n\nBest regards,\nLoqman Makouri\n📧 loqmanmakouri66@gmail.com`;
                setAiReply(reply);
                setStatus("success");
            } catch {
                setStatus("error");
            }
        };

  const contactItems = [
    { icon: "✉", label: "Email",    val: INFO.email,    href: `mailto:${INFO.email}` },
    { icon: "📞", label: "Phone",   val: INFO.phone,    href: `tel:${INFO.phone.replace(/\s/g, "")}` },
    { icon: "📍", label: "Location",val: INFO.location, href: null },
    { icon: "💼", label: "LinkedIn",val: "loqman-makouri", href: INFO.linkedin },
  ];

  return (
    <section id="contact" className="relative pb-20">
      <div className="orb" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(139,92,246,0.09),transparent)", right: "-10%", bottom: "0" }} />
      <div className="section-wrap">
        <SectionLabel
          label="Work with me"
          title="Business"
          accent="Contact"
          sub="Have a project, job offer, or collaboration in mind? Send a message — I reply promptly."
        />

        <div className="grid md:grid-cols-5 gap-8">
          {/* Info column */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {contactItems.map((item, i) => (
              <RevealCard key={item.label} className="glass-card p-5 flex items-center gap-4" delay={i * 80}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--dim)" }}>{item.label}</p>
                  {item.href
                    ? <a href={item.href} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline" style={{ color: "var(--accent2)" }}>{item.val}</a>
                    : <p className="text-sm font-medium" style={{ color: "var(--text)" }}>{item.val}</p>}
                </div>
              </RevealCard>
            ))}

            <RevealCard className="glass-card p-5" delay={400}>
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--dim)" }}>Social profiles</p>
              <div className="flex gap-3">
                <a href="https://github.com/Loqmanmk" target="_blank" rel="noreferrer" className="btn-outline text-xs py-2 px-4">⌥ GitHub</a>
                <a href="https://linkedin.com/in/loqman-makouri-11871138b" target="_blank" rel="noreferrer" className="btn-outline text-xs py-2 px-4">in LinkedIn</a>
              </div>
            </RevealCard>
          </div>

          {/* Form column */}
          <RevealCard className="md:col-span-3" delay={100}>
            <div className="glass-card p-7">
              {status === "success" ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="font-bold text-xl mb-2" style={{ color: "var(--text)" }}>Message received!</h3>
                  <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>Here is your confirmation — Loqman will reply within 24–48h:</p>
                  <div
                    className="p-5 rounded-xl text-sm text-left leading-relaxed"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)", whiteSpace: "pre-line" }}
                  >
                    {aiReply}
                  </div>
                  <button
                    onClick={() => { setStatus("idle"); setForm({ name: "", company: "", email: "", subject: "", message: "" }); }}
                    className="btn-glow mt-6 mx-auto"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--dim)" }}>Full name *</label>
                      <input className="field" placeholder="John Doe" value={form.name} onChange={update("name")} required />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--dim)" }}>Company</label>
                      <input className="field" placeholder="Acme Corp" value={form.company} onChange={update("company")} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--dim)" }}>Email address *</label>
                    <input className="field" type="email" placeholder="you@company.com" value={form.email} onChange={update("email")} required />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--dim)" }}>Subject</label>
                    <select className="field" value={form.subject} onChange={update("subject")}>
                      <option value="">Select a topic…</option>
                      <option>Job Opportunity</option>
                      <option>Internship Offer</option>
                      <option>Project Collaboration</option>
                      <option>Freelance Work</option>
                      <option>General Inquiry</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--dim)" }}>Message *</label>
                    <textarea
                      className="field"
                      rows={5}
                      placeholder="Tell me about your project, opportunity, or question…"
                      value={form.message}
                      onChange={update("message")}
                      required
                      style={{ resize: "none" }}
                    />
                  </div>
                  {status === "error" && (
                    <p className="text-xs" style={{ color: "#f87171" }}>Something went wrong. Please email directly at {INFO.email}</p>
                  )}
                  <button type="submit" className="btn-glow justify-center" disabled={status === "loading"}>
                    {status === "loading"
                      ? <span className="flex items-center gap-2"><span style={{ animation: "spin .8s linear infinite", display: "inline-block" }}>⟳</span> Sending…</span>
                      : "Send Message →"}
                  </button>
                  <p className="text-xs text-center" style={{ color: "var(--dim)" }}>
                    ✨ You'll receive a personalized confirmation instantly
                  </p>
                </form>
              )}
            </div>
          </RevealCard>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ──────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)" }}>
      <div
        className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm"
        style={{ color: "var(--dim)" }}
      >
        <div className="flex items-center gap-3">
          <span className="font-display font-black" style={{ color: "var(--accent)" }}>LM.</span>
          <span>© 2026 Loqman Makouri — Oujda, Morocco</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "var(--green)", boxShadow: "0 0 8px var(--green)", animation: "glowDot 2s infinite" }}
          />
          <span>Open to opportunities</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── CURSOR GLOW ─────────────────────────────────────────── */
function CursorGlow() {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  useEffect(() => {
    const h = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return (
    <div
      className="cursor-glow hidden lg:block"
      style={{ left: pos.x, top: pos.y }}
    />
  );
}

/* ─── APP ─────────────────────────────────────────────────── */
export default function App() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark);
  }, [dark]);

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <CursorGlow />
      <Navbar dark={dark} toggleDark={() => setDark((d) => !d)} />
      <Hero />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Community />
      <Contact />
      <Footer />
    </div>
  );
}
