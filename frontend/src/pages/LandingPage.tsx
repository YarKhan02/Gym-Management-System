import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import "@/components/landing/landing.css";

const DataCore = lazy(() => import("@/components/three/BodyBuilder"));
const PipelineDiagram = lazy(() => import("@/components/three/PipelineDiagram"));

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};
const container: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

const RIBBON = [
  "MEMBERS MANAGED: 12,847",
  "SESSIONS TODAY: 3,291",
  "REVENUE TRACKED: $2.4M",
  "WORKFLOWS ACTIVE: 847",
  "UPTIME: 99.97%",
  "CLASSES SCHEDULED: 184",
];

function Wave() {
  const [t, setT] = useState(0);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      setT((v) => v + 0.02);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  const points: string[] = [];
  for (let x = 0; x <= 800; x += 8) {
    const y = 100 + Math.sin(x * 0.02 + t) * 30 + Math.sin(x * 0.05 + t * 1.3) * 12;
    points.push(`${x},${y}`);
  }
  const hue = Math.sin(t * 0.5) > 0 ? "#00F5C4" : "#FFD166";
  return (
    <svg viewBox="0 0 800 200" preserveAspectRatio="none">
      <defs>
        <linearGradient id="wg" x1="0" x2="1">
          <stop offset="0%" stopColor="#00F5C4" />
          <stop offset="100%" stopColor={hue} />
        </linearGradient>
      </defs>
      <polyline points={points.join(" ")} fill="none" stroke="url(#wg)" strokeWidth="2" />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke="#00F5C4"
        strokeWidth="6"
        opacity="0.15"
      />
    </svg>
  );
}

export default function LandingPage() {
  const reduced = useReducedMotion();
  const ribbonItems = [...RIBBON, ...RIBBON];

  return (
    <div className="landing-root">
      <nav className="landing-nav">
        <div className="landing-logo">
          <div className="liquid-logo" />
          <span>GYM.OS</span>
        </div>
        <Link to="/login" className="btn-outline">
          [ LOG IN ]
        </Link>
      </nav>

      {/* HERO */}
      <section className="hero">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={item} className="hero-headline">
            <span>YOUR GYM</span>
            <span>RUNS ON</span>
            <span style={{ color: "var(--accent-primary)" }}>INTELLIGENCE.</span>
          </motion.h1>
          <motion.p variants={item} className="hero-sub">
            Automate every workflow. Command every metric. Own every member journey.
          </motion.p>
          <motion.div variants={item}>
            <Link to="/login" className="btn-filled">
              LOG IN TO DASHBOARD →
            </Link>
          </motion.div>
        </motion.div>
        <motion.div
          className="hero-canvas"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Suspense fallback={null}>{!reduced && <DataCore />}</Suspense>
        </motion.div>
      </section>

      {/* RIBBON */}
      <div className="ribbon" aria-hidden>
        <div className="ribbon-track">
          {ribbonItems.map((t, i) => (
            <span key={i} className="ribbon-item">
              [ {t} ] <span className="ribbon-sep">··</span>
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="section">
        <div className="mono center" style={{ textAlign: "center" }}>
          [ THE COMMAND GRID ]
        </div>
        <h2 className="section-title center">EVERY SYSTEM. ONE COMMAND CENTER.</h2>

        <motion.div
          className="grid-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={container}
        >
          <motion.div variants={item} className="card col-8">
            <div className="mono">[ MODULE 01 — MEMBERS ]</div>
            <h3>Know Every Member Before They Walk In</h3>
            <p>
              Real-time member profiles, attendance streaks, spending patterns, and churn risk
              scores — all surfaced automatically.
            </p>
            <div className="radar">
              <div className="radar-sweep" />
            </div>
          </motion.div>

          <motion.div variants={item} className="card col-4">
            <div className="mono">[ MODULE 02 — SCHEDULE ]</div>
            <h3>Schedule That Thinks Ahead</h3>
            <p>Predictive class filling, waitlist automation, and trainer conflict detection.</p>
            <div className="sched">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className={[2, 5, 8, 11, 14, 17, 20, 23].includes(i) ? "on" : ""} />
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} className="card col-4">
            <div className="mono">[ MODULE 03 — REVENUE ]</div>
            <h3>Every Dollar, Accounted For</h3>
            <p>Membership billing, POS, and commission tracking in one automated pipeline.</p>
            <div className="bars">
              {[40, 65, 30, 80, 55, 95, 70, 88].map((h, i) => (
                <div key={i} style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} className="card col-8">
            <div className="mono">[ MODULE 04 — AUTOMATION ]</div>
            <h3>Build Workflows. Not Busywork.</h3>
            <p>
              Design automated pipelines for onboarding, retention, renewals, and staff tasks — no
              code required.
            </p>
            <div className="nodes">
              <span>MEMBER</span>
              <span>TRIGGER</span>
              <span>ACTION</span>
              <span>NOTIFY</span>
            </div>
          </motion.div>

          <motion.div variants={item} className="card col-12">
            <div className="mono">[ MODULE 05 — ANALYTICS ]</div>
            <h3 style={{ fontSize: 32 }}>THE GYM'S NERVOUS SYSTEM — LIVE</h3>
            <p>
              Full operational visibility across every location, trainer, and revenue stream —
              updated in real time.
            </p>
            <div className="wave-wrap">
              <Wave />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* PLATFORM REVEAL */}
      <section className="platform">
        <div className="mono">[ PLATFORM ARCHITECTURE ]</div>
        <h2 className="section-title center" style={{ marginTop: 16 }}>
          BUILT DIFFERENT.
          <br />
          BUILT FOR SCALE.
        </h2>
        <div className="platform-canvas">
          <Suspense fallback={null}>{!reduced && <PipelineDiagram />}</Suspense>
        </div>
        <div className="stats">
          <div className="stat">
            <div className="stat-value">10×</div>
            <div className="stat-label">Faster Workflows</div>
          </div>
          <div className="stat">
            <div className="stat-value">&lt;2ms</div>
            <div className="stat-label">Response Time</div>
          </div>
          <div className="stat">
            <div className="stat-value">99.97%</div>
            <div className="stat-label">Uptime</div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {/* <section className="section">
        <div className="mono center" style={{ textAlign: "center" }}>
          [ OPERATORS ]
        </div>
        <h2 className="section-title center">SHIPPED. SCALED. TRUSTED.</h2>
        <div className="testi-grid">
          {[
            {
              q: "We cut 14 hours of admin work per week. The automation alone paid for itself.",
              n: "James R.",
              r: "CrossFit Owner",
              i: "JR",
            },
            {
              q: "Finally a system that doesn't feel like it was built in 2009.",
              n: "Priya M.",
              r: "Boutique Studio Founder",
              i: "PM",
            },
            {
              q: "The member intelligence feature changed how we run retention campaigns entirely.",
              n: "Carlos T.",
              r: "Multi-Location Director",
              i: "CT",
            },
          ].map((t) => (
            <div key={t.n} className="testi">
              <p>"{t.q}"</p>
              <div className="testi-who">
                <div className="mono-circle">{t.i}</div>
                <div>
                  <div style={{ fontWeight: 600 }}>{t.n}</div>
                  <div className="testi-meta">{t.r}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* FINAL CTA */}
      <section className="final">
        <div className="final-content">
          <div className="mono">[ READY TO OPERATE? ]</div>
          <h2>
            YOUR DASHBOARD
            <br />
            IS WAITING.
          </h2>
          <p>Log in to access your gym's command center.</p>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ display: "inline-block" }}>
            <Link to="/login" className="btn-filled btn-hero">
              ACCESS DASHBOARD →
            </Link>
          </motion.div>
          <small>NO REGISTRATION REQUIRED — EXISTING ACCOUNTS ONLY</small>
        </div>
      </section>

      <footer className="footer">[ GYM.OS ] · BUILT FOR PERFORMANCE · © 2026</footer>
    </div>
  );
}