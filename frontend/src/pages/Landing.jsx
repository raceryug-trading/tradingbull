import { Link } from "react-router-dom";
import { Activity, TrendingUp, LineChart, Radio, ShieldCheck, ArrowRight } from "lucide-react";
import { BRAND } from "../config";
import MarketTicker from "../components/MarketTicker";

export default function Landing() {
  return (
    <div>
      <MarketTicker />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-mono-t text-[10px] uppercase tracking-[0.3em] text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Institutional-Grade Trading Course
              </div>
              <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-gray-100">
                Trade the Markets<br />
                <span className="text-emerald-400">Like a Professional.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-gray-400 leading-relaxed">
                Structured video lessons + weekly live market breakdowns on YouTube — accessed
                through a private student dashboard. No sign-ups. Access is issued by your instructor.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  data-testid="hero-start-learning-btn"
                  className="group inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-3 font-bold uppercase tracking-widest text-sm text-[#0A0D14] hover:bg-emerald-400 transition-all"
                >
                  Access Trading Desk
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href={`https://wa.me/${(BRAND.whatsappNumber || "").replace(/[^\d]/g, "")}?text=${encodeURIComponent(BRAND.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="hero-whatsapp-btn"
                  className="inline-flex items-center gap-2 rounded-md border border-[#232D42] bg-[#111622] px-5 py-3 font-bold uppercase tracking-widest text-sm text-gray-100 hover:border-emerald-400 transition-colors"
                >
                  Ask on WhatsApp
                </a>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
                <Stat label="Modules" value="03+" />
                <Stat label="Live / week" value="1×" />
                <Stat label="Access" value="24/7" />
              </div>
            </div>

            {/* Right visual — mock terminal */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-emerald-500/10 blur-2xl -z-10" />
              <div className="rounded-lg border border-[#232D42] bg-[#111622] p-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#232D42] pb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-emerald-400" />
                    <span className="font-mono-t text-[10px] uppercase tracking-widest text-gray-400">
                      NIFTY-50 / 15M
                    </span>
                  </div>
                  <span className="font-mono-t text-[10px] text-emerald-400">+0.78%</span>
                </div>
                <MockChart />
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <MiniStat label="O" value="22,412" tone="text" />
                  <MiniStat label="H" value="22,489" tone="up" />
                  <MiniStat label="L" value="22,388" tone="down" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y border-[#232D42] bg-[#0A0D14]/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-gray-100">
            What You Get Inside
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <Feature
              icon={LineChart}
              title="Recorded Modules"
              text="Basics → Technical Analysis → Options. YouTube-embedded videos, watch anytime."
            />
            <Feature
              icon={Radio}
              title="Live YouTube Sessions"
              text="Weekly live market breakdowns embedded inside the site. No hunting for links."
            />
            <Feature
              icon={ShieldCheck}
              title="Private Access"
              text="No public sign-up. Instructor issues each student a personal username & password."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-lg border border-emerald-500/30 bg-gradient-to-br from-[#111622] to-[#0A0D14] p-8 sm:p-12 text-center">
          <TrendingUp className="mx-auto h-8 w-8 text-emerald-400" />
          <h3 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-gray-100">
            Ready to Level Up?
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-400">
            Contact your instructor on WhatsApp to get your access credentials.
          </p>
          <Link
            to="/login"
            data-testid="cta-login-btn"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-3 font-bold uppercase tracking-widest text-sm text-[#0A0D14] hover:bg-emerald-400"
          >
            Log In to Portal <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

const Stat = ({ label, value }) => (
  <div className="rounded border border-[#232D42] bg-[#111622] p-3">
    <div className="font-display text-xl font-bold text-emerald-400">{value}</div>
    <div className="mt-0.5 font-mono-t text-[9px] uppercase tracking-widest text-gray-500">{label}</div>
  </div>
);

const MiniStat = ({ label, value, tone }) => (
  <div className="rounded bg-[#0A0D14] p-1.5">
    <div className="font-mono-t text-[9px] uppercase tracking-widest text-gray-500">{label}</div>
    <div className={`font-mono-t text-xs ${tone === "up" ? "text-emerald-400" : tone === "down" ? "text-red-400" : "text-gray-200"}`}>
      {value}
    </div>
  </div>
);

const Feature = ({ icon: Icon, title, text }) => (
  <div className="card-lift rounded-lg border border-[#232D42] bg-[#111622] p-6">
    <Icon className="h-6 w-6 text-emerald-400" />
    <h4 className="mt-3 font-display text-lg font-bold uppercase tracking-wide text-gray-100">
      {title}
    </h4>
    <p className="mt-2 text-sm text-gray-400 leading-relaxed">{text}</p>
  </div>
);

const MockChart = () => {
  // Simple SVG mock candles
  const candles = [
    { x: 10, o: 60, h: 50, l: 70, c: 55, up: true },
    { x: 30, o: 55, h: 45, l: 62, c: 50, up: true },
    { x: 50, o: 50, h: 42, l: 58, c: 47, up: true },
    { x: 70, o: 47, h: 48, l: 55, c: 52, up: false },
    { x: 90, o: 52, h: 40, l: 55, c: 45, up: true },
    { x: 110, o: 45, h: 38, l: 50, c: 42, up: true },
    { x: 130, o: 42, h: 44, l: 48, c: 46, up: false },
    { x: 150, o: 46, h: 30, l: 50, c: 34, up: true },
    { x: 170, o: 34, h: 25, l: 40, c: 28, up: true },
    { x: 190, o: 28, h: 20, l: 34, c: 23, up: true },
    { x: 210, o: 23, h: 26, l: 30, c: 28, up: false },
    { x: 230, o: 28, h: 18, l: 32, c: 22, up: true },
    { x: 250, o: 22, h: 15, l: 28, c: 18, up: true },
  ];
  return (
    <svg viewBox="0 0 270 90" className="mt-2 w-full h-40">
      {[15, 30, 45, 60, 75].map((y) => (
        <line key={y} x1="0" y1={y} x2="270" y2={y} stroke="#232D42" strokeDasharray="2 3" strokeWidth="0.5" />
      ))}
      {candles.map((c, i) => (
        <g key={i}>
          <line x1={c.x} y1={c.h} x2={c.x} y2={c.l} stroke={c.up ? "#10B981" : "#EF4444"} strokeWidth="1" />
          <rect
            x={c.x - 4}
            y={c.up ? c.c : c.o}
            width="8"
            height={Math.abs(c.c - c.o)}
            fill={c.up ? "#10B981" : "#EF4444"}
          />
        </g>
      ))}
    </svg>
  );
};
