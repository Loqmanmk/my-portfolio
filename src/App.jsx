import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { INFO } from "./data";
import emailjs from "@emailjs/browser";
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, increment } from "firebase/firestore";

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

/* ─── Reusable: Animated Card ────── */
function RevealCard({ children, className = "", delay = 0, style = {} }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(32px)",
      transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─── Tag ─────────────────────────────────────────────────── */
function Tag({ label, color }) {
  return <span className={`tag tag-${color}`}>{label}</span>;
}

function translatedList(t, key) {
  const value = t(key, { returnObjects: true });
  return Array.isArray(value) ? value : [];
}

/* ─── Section Header ──────────────────────────────────────── */
function SectionLabel({ label, title, accent, sub }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="mb-16" style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : "translateY(24px)",
      transition: "opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1)",
    }}>
      <span className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
        style={{ color: "var(--accent)", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
        {label}
      </span>
      <h2 className="font-display font-black tracking-tight leading-none mb-3"
        style={{ fontSize: "clamp(2.4rem,5vw,3.4rem)", color: "var(--text)" }}>
        {title} <span style={{ color: "var(--accent)" }}>{accent}</span>
      </h2>
      {sub && <p className="text-base mt-3 max-w-xl" style={{ color: "var(--muted)" }}>{sub}</p>}
    </div>
  );
}

/* ─── LANGUAGE SWITCHER ──────────────────────────────────── */
function LangSwitcher() {
  const { i18n } = useTranslation();
  const langs = [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "de", label: "Deutsch" },
    { code: "ar", label: "العربية" },
    { code: "es", label: "Español" },
  ];
  const current = i18n.resolvedLanguage || i18n.language || "en";
  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    document.documentElement.setAttribute("lang", code);
    document.documentElement.setAttribute("dir", code === "ar" ? "rtl" : "ltr");
  };

  return (
    <label className="language-select-wrap">
      <span className="sr-only">Language</span>
      <select
        value={langs.some((lang) => lang.code === current) ? current : "en"}
        onChange={(e) => changeLanguage(e.target.value)}
        className="language-select"
        aria-label="Select language"
      >
        {langs.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </label>
  );
}

/* ─── NAVBAR ──────────────────────────────────────────────── */
function Navbar({ dark, toggleDark }) {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const links = [
    { id: "about", label: t("nav.about") },
    { id: "skills", label: t("nav.skills") },
    { id: "experience", label: t("nav.experience") },
    { id: "projects", label: t("nav.projects") },
    { id: "education", label: t("nav.education") },
    { id: "community", label: t("nav.community") },
    { id: "contact", label: t("nav.contact") },
  ];

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const go = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500" style={{
      background: scrolled ? (dark ? "rgba(6,6,8,0.92)" : "rgba(250,250,254,0.92)") : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom: scrolled ? "1px solid var(--border)" : "none",
    }}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-display text-lg font-black tracking-tight" style={{ color: "var(--accent)" }}>
          LM<span style={{ color: "var(--accent2)" }}>.</span>
        </button>

        <ul className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <li key={l.id}>
              <button onClick={() => go(l.id)} className="text-sm font-medium transition-colors duration-200"
                style={{ color: "var(--muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}>
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <LangSwitcher />
          <button onClick={toggleDark}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }} title="Toggle theme">
            <span style={{ fontSize: 15 }}>{dark ? "☀" : "☾"}</span>
          </button>
          <button onClick={() => setOpen((v) => !v)} className="lg:hidden w-9 h-9 flex flex-col justify-center items-center gap-1.5">
            <span className="block w-5 h-0.5 transition-all" style={{ background: "var(--muted)", transform: open ? "rotate(45deg) translateY(5px)" : "none" }} />
            <span className="block w-5 h-0.5" style={{ background: "var(--muted)", opacity: open ? 0 : 1 }} />
            <span className="block w-5 h-0.5 transition-all" style={{ background: "var(--muted)", transform: open ? "rotate(-45deg) translateY(-5px)" : "none" }} />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden px-6 pb-6 flex flex-col gap-4"
          style={{ background: dark ? "rgba(6,6,8,0.97)" : "rgba(250,250,254,0.97)", borderTop: "1px solid var(--border)" }}>
          {links.map((l) => (
            <button key={l.id} onClick={() => go(l.id)} className="text-left text-sm font-medium py-2" style={{ color: "var(--muted)" }}>{l.label}</button>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ─── SPLASH SCREEN ───────────────────────────────────────── */
function SplashScreen({ onDone }) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 2600),
      setTimeout(() => onDone(), 3400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "#060608", opacity: phase === 3 ? 0 : 1, transition: phase === 3 ? "opacity 0.8s ease" : "none" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(139,92,246,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,0.07) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      <div style={{ position: "absolute", width: 400, height: 400, border: "1px solid rgba(139,92,246,0.2)", borderRadius: "50%", animation: "spin 8s linear infinite", borderTop: "2px solid rgba(139,92,246,0.8)" }} />
      <div style={{ position: "absolute", width: 550, height: 550, border: "1px dashed rgba(34,211,238,0.15)", borderRadius: "50%", animation: "spinR 12s linear infinite" }} />

      <div className="relative z-10 text-center px-6">
        <div className="font-display font-black mb-6 mx-auto flex items-center justify-center"
          style={{ fontSize: 56, width: 100, height: 100, borderRadius: 24, background: "linear-gradient(135deg,rgba(139,92,246,0.2),rgba(34,211,238,0.1))", border: "1px solid rgba(139,92,246,0.4)", color: "#a78bfa", opacity: phase >= 0 ? 1 : 0, transform: phase >= 0 ? "scale(1)" : "scale(0.5)", transition: "opacity 0.6s ease, transform 0.6s cubic-bezier(.16,1,.3,1)", boxShadow: "0 0 40px rgba(139,92,246,0.3)" }}>
          LM
        </div>

        <h1 className="font-display font-black tracking-tighter mb-2"
          style={{ fontSize: "clamp(2.5rem,8vw,5rem)", background: "linear-gradient(135deg,#fff 40%,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", opacity: phase >= 0 ? 1 : 0, transform: phase >= 0 ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.7s ease 0.1s, transform 0.7s cubic-bezier(.16,1,.3,1) 0.1s" }}>
          Loqman Makouri
        </h1>

        <div style={{ opacity: phase >= 1 ? 1 : 0, transform: phase >= 1 ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
          <p className="text-base font-semibold tracking-widest uppercase mb-4" style={{ color: "#22d3ee" }}>
            {t("splashRole")}
          </p>
          <div className="flex items-center justify-center gap-3">
            {translatedList(t, "splashTags").map((tag) => (
              <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", color: "#a78bfa" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {phase >= 2 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(139,92,246,0.5))" }} />
            <span className="text-xs tracking-widest uppercase" style={{ color: "rgba(139,92,246,0.6)" }}>{t("loading")}</span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(139,92,246,0.5))" }} />
          </div>
        )}

        {phase >= 2 && (
          <div className="mt-4 mx-auto rounded-full overflow-hidden" style={{ width: 200, height: 2, background: "rgba(255,255,255,0.06)" }}>
            <div className="h-full rounded-full" style={{ background: "linear-gradient(90deg,#8b5cf6,#22d3ee)", width: "100%", transition: "width 0.8s ease" }} />
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin  { to { transform: rotate(360deg);  } }
        @keyframes spinR { to { transform: rotate(-360deg); } }
      `}</style>
    </div>
  );
}

/* ─── HERO ────────────────────────────────────────────────── */
function Hero() {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const timer = setTimeout(() => setLoaded(true), 120); return () => clearTimeout(timer); }, []);

  return (
    <section id="about" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 w-full max-w-full">
      <div className="orb" style={{ width: 700, height: 700, background: "radial-gradient(circle,rgba(139,92,246,0.18),transparent)", top: "-15%", left: "-15%" }} />
      <div className="orb" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(34,211,238,0.12),transparent)", bottom: "0", right: "-5%", animation: "float 8s ease-in-out infinite" }} />
      <div className="orb" style={{ width: 300, height: 300, background: "radial-gradient(circle,rgba(232,121,249,0.1),transparent)", top: "40%", left: "55%" }} />

      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px)",
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%,black 0%,transparent 100%)",
      }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-10 md:gap-20 w-full">
        {/* Photo */}
        <div className="flex-shrink-0 flex justify-center w-full md:w-auto" style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? "none" : "translateY(20px)",
          transition: "opacity 1s ease, transform 1s ease",
          animation: loaded ? "float 6s ease-in-out infinite" : "none",
        }}>
          <div className="relative">
            <div className="absolute rounded-full" style={{ inset: -20, border: "1px solid transparent", borderTop: "1px solid rgba(139,92,246,0.7)", borderRight: "1px solid rgba(34,211,238,0.4)", animation: "spin 12s linear infinite" }} />
            <div className="absolute rounded-full" style={{ inset: -38, border: "1px dashed rgba(232,121,249,0.2)", animation: "spinR 20s linear infinite" }} />
            <div className="absolute rounded-full" style={{ inset: -56, border: "1px solid rgba(139,92,246,0.08)", animation: "spin 35s linear infinite" }} />

            <div className="relative rounded-full overflow-hidden" style={{ width: 240, height: 240, padding: 3, background: "linear-gradient(135deg,#8b5cf6,#22d3ee,#e879f9)" }}>
              <img src="/me_pro.png" alt="Loqman Makouri" className="w-full h-full rounded-full object-cover" style={{ objectPosition: "center top" }} />
            </div>

            <div className="absolute rounded-full border-4" style={{ width: 20, height: 20, bottom: 14, right: 14, background: "#34d399", borderColor: "var(--bg)", boxShadow: "0 0 14px #34d399", animation: "glowDot 2s ease-in-out infinite" }} />

            <div className="absolute hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
              style={{ left: -90, top: 20, background: "var(--card)", border: "1px solid var(--border)", color: "var(--accent2)", whiteSpace: "nowrap", animation: "float 5s ease-in-out infinite" }}>
              ⚡ {t("fullStackDev")}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-center md:text-left" style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? "none" : "translateY(24px)",
          transition: "opacity 1s ease .2s, transform 1s ease .2s",
        }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-7"
            style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)", color: "var(--green)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--green)", boxShadow: "0 0 8px var(--green)", animation: "glowDot 2s infinite" }} />
            {t("available")}
          </div>

          <h1 className="font-display font-black leading-none tracking-tighter mb-4" style={{ fontSize: "clamp(3.2rem, 8vw, 5.8rem)" }}>
            <span style={{ background: "linear-gradient(135deg,var(--text) 30%,var(--accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Loqman
            </span>
            <br />
            <span style={{ color: "var(--text)" }}>Makouri</span>
          </h1>

          <p className="text-lg font-semibold mb-2" style={{ color: "var(--accent2)" }}>{t("heroSub")}</p>
          <p className="text-sm leading-relaxed max-w-xl mb-8 mx-auto md:mx-0" style={{ color: "var(--muted)" }}>{t("heroBio")}</p>

          <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-8">
            <a href={`mailto:${INFO.email}`} className="btn-glow">✉ {t("getInTouch")}</a>
            <a href="https://github.com/Loqmanmk" target="_blank" rel="noreferrer" className="btn-outline">⌥ GitHub</a>
            <a href="https://linkedin.com/in/loqman-makouri-11871138b" target="_blank" rel="noreferrer" className="btn-outline">in LinkedIn</a>
            <button onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} className="btn-outline">
              📨 {t("businessInquiry")}
            </button>
          </div>

          <div className="flex flex-wrap gap-5 justify-center md:justify-start text-sm" style={{ color: "var(--dim)" }}>
            {[["📍", t("location")], ["📞", INFO.phone], ["🌐", t("languages")]].map(([icon, text]) => (
              <span key={text} className="flex items-center gap-1.5">{icon} {text}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ animation: "float 3s ease-in-out infinite" }}>
        <span className="text-xs tracking-widest uppercase" style={{ color: "var(--dim)" }}>{t("scroll")}</span>
        <div className="w-px h-10" style={{ background: "linear-gradient(to bottom,var(--accent),transparent)" }} />
      </div>

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg);  } }
        @keyframes spinR   { to { transform: rotate(-360deg); } }
        @keyframes float   { 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-12px) } }
        @keyframes glowDot { 0%,100%{ opacity:.7 } 50%{ opacity:1 } }
        @keyframes glow    { 0%,100%{ opacity:.6 } 50%{ opacity:1 } }
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
        {skill.tags.map((tag) => <Tag key={tag} label={tag} color={skill.color} />)}
      </div>
    </RevealCard>
  );
}

function Skills() {
  const { t } = useTranslation();
  const skills = translatedList(t, "skillsList");
  return (
    <section id="skills" className="relative">
      <div className="section-wrap">
        <SectionLabel label={t("whatIBuild")} title={t("technicalSkills")} accent="" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((s, i) => <SkillCard key={s.title} skill={s} delay={i * 60} />)}
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
        <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full" style={{ background: "linear-gradient(to bottom,var(--accent),var(--accent2))" }} />
        <div className="absolute left-0 w-4 h-4 rounded-full top-7 -translate-x-1.5" style={{ background: "var(--accent)", boxShadow: "0 0 16px var(--accent)", border: "2px solid var(--bg)" }} />
        <div className="glass-card p-7">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <span className="tag tag-g text-xs mb-2 inline-block">{exp.type}</span>
              <h3 className="font-bold text-lg" style={{ color: "var(--text)" }}>{exp.title}</h3>
              <p className="font-semibold text-sm mt-1" style={{ color: "var(--accent2)" }}>{exp.org}</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full whitespace-nowrap"
              style={{ background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--border)" }}>
              {exp.period}
            </span>
          </div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--muted)" }}>{exp.desc}</p>
          <div className="flex flex-wrap gap-2">
            {exp.tags.map((tag) => <Tag key={tag.l} label={tag.l} color={tag.c} />)}
          </div>
        </div>
      </div>
    </RevealCard>
  );
}

function Experience() {
  const { t } = useTranslation();
  const experiences = translatedList(t, "experienceList");
  return (
    <section id="experience" className="relative">
      <div className="orb" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(34,211,238,0.07),transparent)", left: "-5%", top: "20%" }} />
      <div className="section-wrap">
        <SectionLabel label={t("professionalJourney")} title={t("workExperience")} accent="" />
        <div className="flex flex-col gap-10">
          {experiences.map((e, i) => <ExpCard key={e.title} exp={e} delay={i * 100} />)}
        </div>
      </div>
    </section>
  );
}

/* ─── PROJECTS ────────────────────────────────────────────── */
function ProjectCard({ project, delay }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  return (
    <RevealCard className="glass-card p-6" delay={delay} style={{ cursor: "pointer" }}>
      <div onClick={() => setExpanded((v) => !v)}>
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs font-black" style={{ color: "var(--accent)", opacity: .5 }}>{project.num}</span>
          <span className="tag tag-v">{project.cat}</span>
        </div>
        <h3 className="font-bold text-base mb-2" style={{ color: "var(--text)" }}>{project.name}</h3>
        <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--muted)" }}>{project.desc}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.map((tag) => <Tag key={tag.l} label={tag.l} color={tag.c} />)}
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: "var(--dim)" }}>
          <span style={{ transform: expanded ? "rotate(90deg)" : "none", transition: "transform .2s", display: "inline-block" }}>▶</span>
          <span>{expanded ? t("collapse") : t("readMore")}</span>
        </div>
        {expanded && (
          <div className="mt-4 pt-4 text-xs leading-relaxed" style={{ borderTop: "1px solid var(--border)", color: "var(--accent2)" }}>
            {t("builtWith")}: {project.tags.map((tag) => tag.l).join(", ")}
          </div>
        )}
      </div>
    </RevealCard>
  );
}

function Projects() {
  const { t } = useTranslation();
  const projects = translatedList(t, "projectList");
  const allLabel = t("filterAll");
  const cats = [allLabel, ...Array.from(new Set(projects.map((p) => p.cat)))];
  const [cat, setCat] = useState(allLabel);
  useEffect(() => setCat(allLabel), [allLabel]);
  const filtered = cat === allLabel ? projects : projects.filter((p) => p.cat === cat);

  return (
    <section id="projects" className="relative">
      <div className="orb" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(232,121,249,0.07),transparent)", right: "-5%", top: "10%" }} />
      <div className="section-wrap">
        <SectionLabel label={t("thingsIBuilt")} title={t("featuredProjects")} accent="" sub={t("projectsSub")} />
        <div className="flex flex-wrap gap-2 mb-10">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className="px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200"
              style={{ background: cat === c ? "var(--accent)" : "var(--surface)", color: cat === c ? "#fff" : "var(--muted)", border: `1px solid ${cat === c ? "var(--accent)" : "var(--border)"}` }}>
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
  const { t } = useTranslation();
  const education = translatedList(t, "educationList");
  const languages = translatedList(t, "languageList");
  return (
    <section id="education" className="relative">
      <div className="section-wrap">
        <SectionLabel label={t("academicBackground")} title={t("education")} accent={t("languages")} />
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-5" style={{ color: "var(--dim)" }}>{t("degrees")}</h3>
            <div className="flex flex-col gap-4">
              {education.map((e, i) => <EduCard key={e.degree} item={e} delay={i * 80} />)}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest mb-5" style={{ color: "var(--dim)" }}>{t("languagesSpoken")}</h3>
            <div className="grid grid-cols-2 gap-4">
              {languages.map((l, i) => <LangCard key={l.name} lang={l} delay={i * 80} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── COMMUNITY ───────────────────────────────────────────── */
function Community() {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [emoji, setEmoji] = useState("👋");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const emojis = ["👋", "🔥", "💯", "🚀", "⭐", "🎯", "💡", "🤝", "😍", "🙌"];

  useEffect(() => {
    const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const ref = doc(db, "stats", "likes");
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) setLikes(snap.data().count || 0);
    });
    return () => unsub();
  }, []);

  const toggleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    await updateDoc(doc(db, "stats", "likes"), { count: increment(newLiked ? 1 : -1) });
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) return;
    setSending(true);
    await addDoc(collection(db, "comments"), {
      name: name.trim(), msg: msg.trim(), emoji,
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      createdAt: new Date(),
    });
    setName(""); setMsg(""); setEmoji("👋");
    setSending(false); setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <section id="community" className="relative">
      <div className="orb" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(139,92,246,0.09),transparent)", left: "50%", top: "0" }} />
      <div className="section-wrap">
        <SectionLabel label={t("visitorSpace")} title={t("communityWall")} accent="" sub={t("communitySub")} />

        <RevealCard className="glass-card p-8 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-bold text-xl mb-1" style={{ color: "var(--text)" }}>{t("enjoyedPortfolio")}</h3>
            <p className="text-sm" style={{ color: "var(--muted)" }}>{t("showLove")}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-black" style={{ color: "var(--accent)" }}>{likes}</div>
              <div className="text-xs mt-1" style={{ color: "var(--dim)" }}>{t("likes")}</div>
            </div>
            <button onClick={toggleLike}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 active:scale-90"
              style={{ background: liked ? "linear-gradient(135deg,#8b5cf6,#ec4899)" : "var(--surface)", border: `2px solid ${liked ? "transparent" : "var(--border)"}`, boxShadow: liked ? "0 8px 30px rgba(139,92,246,0.45)" : "none", transform: liked ? "scale(1.08)" : "scale(1)" }}>
              {liked ? "❤️" : "🤍"}
            </button>
          </div>
        </RevealCard>

        <div className="grid md:grid-cols-2 gap-8">
          <RevealCard>
            <h3 className="font-bold text-lg mb-5" style={{ color: "var(--text)" }}>{t("leaveMessage")}</h3>
            <form onSubmit={submitComment} className="flex flex-col gap-4">
              <input className="field" placeholder={t("yourName")} value={name} onChange={(e) => setName(e.target.value)} maxLength={40} />
              <textarea className="field" placeholder={t("yourMessage")} rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={300} style={{ resize: "none" }} />
              <div>
                <p className="text-xs mb-2" style={{ color: "var(--dim)" }}>{t("pickEmoji")}</p>
                <div className="flex flex-wrap gap-2">
                  {emojis.map((em) => (
                    <button type="button" key={em} onClick={() => setEmoji(em)}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                      style={{ background: emoji === em ? "rgba(139,92,246,0.2)" : "var(--surface)", border: `1px solid ${emoji === em ? "var(--accent)" : "var(--border)"}` }}>
                      {em}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="btn-glow justify-center" disabled={sending || !name.trim() || !msg.trim()}>
                {sending ? t("posting") : done ? t("posted") : t("postMessage")}
              </button>
            </form>
          </RevealCard>

          <RevealCard delay={100}>
            <h3 className="font-bold text-lg mb-5" style={{ color: "var(--text)" }}>
              {t("messages")} <span className="text-sm font-normal ml-1" style={{ color: "var(--dim)" }}>({comments.length})</span>
            </h3>
            {comments.length === 0 ? (
              <div className="glass-card p-8 text-center" style={{ color: "var(--dim)" }}>
                <div className="text-4xl mb-3">💬</div>
                <p className="text-sm">{t("beFirst")}</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 overflow-y-auto pr-1" style={{ maxHeight: 380 }}>
                {comments.map((c) => (
                  <div key={c.id} className="glass-card p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xl">{c.emoji}</div>
                      <div>
                        <p className="font-bold text-sm" style={{ color: "var(--text)" }}>{c.name}</p>
                        <p className="text-xs" style={{ color: "var(--dim)" }}>{c.date}</p>
                      </div>
                    </div>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>{c.msg}</p>
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
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", company: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [aiReply, setAiReply] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const lastSubmit = localStorage.getItem("lastSubmitTime");
    if (lastSubmit) {
      const remaining = Math.ceil((30000 - (Date.now() - parseInt(lastSubmit))) / 1000);
      if (remaining > 0) setCooldown(remaining);
    }
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => { if (c <= 1) { clearInterval(timer); return 0; } return c - 1; });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    if (cooldown > 0) return;
    localStorage.setItem("lastSubmitTime", Date.now());
    setCooldown(30);
    setStatus("loading");
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        { name: form.name, email: form.email, company: form.company || "N/A", subject: form.subject || "General Inquiry", message: form.message },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      const subj = form.subject || t("general");
      const comp = form.company ? ` ${t("fromCompany")} ${form.company}` : "";
      setAiReply(t("autoReply", { name: form.name, company: comp, subject: subj }));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  const contactItems = [
    { icon: "✉", label: t("emailLabel"),    val: INFO.email,       href: `mailto:${INFO.email}` },
    { icon: "📞", label: t("phoneLabel"),   val: INFO.phone,       href: `tel:${INFO.phone.replace(/\s/g, "")}` },
    { icon: "📍", label: t("locationLabel"),val: t("location"),    href: null },
    { icon: "💼", label: "LinkedIn",val: "loqman-makouri", href: "https://linkedin.com/in/loqman-makouri-11871138b" },
  ];

  return (
    <section id="contact" className="relative pb-20">
      <div className="orb" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(139,92,246,0.09),transparent)", right: "-10%", bottom: "0" }} />
      <div className="section-wrap">
        <SectionLabel label={t("workWithMe")} title={t("businessContact")} accent="" sub={t("contactSub")} />

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 flex flex-col gap-4">
            {contactItems.map((item, i) => (
              <RevealCard key={item.label} className="glass-card p-5 flex items-center gap-4" delay={i * 80}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.2)" }}>
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
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--dim)" }}>{t("socialProfiles")}</p>
              <div className="flex gap-3">
                <a href="https://github.com/Loqmanmk" target="_blank" rel="noreferrer" className="btn-outline text-xs py-2 px-4">⌥ GitHub</a>
                <a href="https://linkedin.com/in/loqman-makouri-11871138b" target="_blank" rel="noreferrer" className="btn-outline text-xs py-2 px-4">in LinkedIn</a>
              </div>
            </RevealCard>
          </div>

          <RevealCard className="md:col-span-3" delay={100}>
            <div className="glass-card p-7">
              {status === "success" ? (
                <div className="text-center py-8">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="font-bold text-xl mb-2" style={{ color: "var(--text)" }}>{t("messageReceived")}</h3>
                  <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>{t("confirmationMsg")}</p>
                  <div className="p-5 rounded-xl text-sm text-left leading-relaxed"
                    style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--muted)", whiteSpace: "pre-line" }}>
                    {aiReply}
                  </div>
                  <button onClick={() => { setStatus("idle"); setForm({ name: "", company: "", email: "", subject: "", message: "" }); }} className="btn-glow mt-6 mx-auto">
                    {t("sendAnother")}
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--dim)" }}>{t("fullName")} *</label>
                      <input className="field" placeholder="John Doe" value={form.name} onChange={update("name")} required />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--dim)" }}>{t("company")}</label>
                      <input className="field" placeholder="Acme Corp" value={form.company} onChange={update("company")} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--dim)" }}>{t("emailAddress")} *</label>
                    <input className="field" type="email" placeholder="you@company.com" value={form.email} onChange={update("email")} required />
                  </div>
                  <div>
                      <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--dim)" }}>{t("subject")}</label>
                    <select className="field" value={form.subject} onChange={update("subject")}>
                      <option value="">{t("selectTopic")}</option>
                      <option>{t("jobOpp")}</option>
                      <option>{t("internship")}</option>
                      <option>{t("collaboration")}</option>
                      <option>{t("freelance")}</option>
                      <option>{t("general")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--dim)" }}>{t("message")} *</label>
                    <textarea className="field" rows={5} placeholder={t("messagePlaceholder")} value={form.message} onChange={update("message")} required style={{ resize: "none" }} />
                  </div>
                  {status === "error" && (
                    <p className="text-xs" style={{ color: "#f87171" }}>{t("errorMsg")} {INFO.email}</p>
                  )}
                  <button type="submit" className="btn-glow justify-center" disabled={status === "loading" || cooldown > 0} style={{ opacity: cooldown > 0 ? 0.7 : 1 }}>
                    {status === "loading"
                      ? <span className="flex items-center gap-2"><span style={{ animation: "spin .8s linear infinite", display: "inline-block" }}>⟳</span> {t("sending")}</span>
                      : cooldown > 0
                      ? <span className="flex items-center gap-2"><span>⏳</span> {t("waitCooldown", { seconds: cooldown })}</span>
                      : t("sendMessage")}
                  </button>
                  {cooldown > 0 && (
                    <div className="flex items-center gap-3 p-4 rounded-xl text-sm" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0" style={{ background: "rgba(139,92,246,0.15)" }}>⏱</div>
                      <div className="flex-1">
                        <p className="font-semibold text-xs mb-1" style={{ color: "var(--accent)" }}>{t("messageSent")}</p>
                        <p className="text-xs" style={{ color: "var(--muted)" }}>{t("sendAgainIn", { seconds: cooldown })}</p>
                        <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                          <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(cooldown / 30) * 100}%`, background: "linear-gradient(90deg, var(--accent), var(--accent2))" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <p className="text-xs text-center" style={{ color: "var(--dim)" }}>{t("confirmation")}</p>
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
  const { t } = useTranslation();
  return (
    <footer style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm" style={{ color: "var(--dim)" }}>
        <div className="flex items-center gap-3">
          <span className="font-display font-black" style={{ color: "var(--accent)" }}>LM.</span>
          <span>© 2026 Loqman Makouri — Oujda, Morocco</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--green)", boxShadow: "0 0 8px var(--green)", animation: "glowDot 2s infinite" }} />
          <span>{t("openTo")}</span>
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
  return <div className="cursor-glow hidden lg:block" style={{ left: pos.x, top: pos.y }} />;
}

/* ─── APP ─────────────────────────────────────────────────── */
export default function App() {
  const { i18n } = useTranslation();
  const [dark, setDark] = useState(true);
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark);
  }, [dark]);

  useEffect(() => {
    const lang = i18n.resolvedLanguage || i18n.language || "en";
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }, [i18n.language, i18n.resolvedLanguage]);

  return (
    <>
      {splash && <SplashScreen onDone={() => setSplash(false)} />}
      <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh", opacity: splash ? 0 : 1, transition: "opacity 0.6s ease" }}>
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
    </>
  );
}
