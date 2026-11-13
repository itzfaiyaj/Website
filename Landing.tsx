import {
  ArrowRight,
  Binary,
  Code2,
  Database,
  FileText,
  Globe,
  ListChecks,
  Menu,
  MessageSquare,
  Network,
  PlayCircle,
  Presentation,
  Terminal,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../components/Logo";
import { SITE } from "../config/site";
import { useMe } from "../lib/auth";

const CHAPTERS = [
  { n: "01", title: "ICT: World & Bangladesh Perspective", tag: "Foundations", icon: Globe },
  { n: "02", title: "Communication Systems & Computer Networking", tag: "Networks", icon: Network },
  { n: "03", title: "Number Systems & Digital Devices", tag: "Binary · Logic gates", icon: Binary },
  { n: "04", title: "Web Design & HTML", tag: "Build pages", icon: Code2 },
  { n: "05", title: "Programming Language", tag: "C language", icon: Terminal },
  { n: "06", title: "Database Management System", tag: "Tables · SQL", icon: Database },
];

const TICKER = ["BINARY", "HTML", "C PROGRAMMING", "DBMS", "NETWORKING", "LOGIC GATES", "BOOLEAN ALGEBRA", "CSS", "SQL", "TOPOLOGY", "ASCII", "UNICODE"];

function PublicNav() {
  const { me } = useMe();
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#syllabus", label: "Syllabus" },
    { href: "#inside", label: "What you get" },
    { href: "#how", label: "How it works" },
  ];
  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-ink-900/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        <Link to="/">
          <Logo />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="font-mono text-xs uppercase tracking-[0.18em] text-mute transition hover:text-lime">
              {l.label}
            </a>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          {me ? (
            <Link to="/dashboard" className="btn-primary btn-sm">
              Open classroom <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-ghost btn-sm">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary btn-sm">
                Join now
              </Link>
            </>
          )}
        </div>
        <button className="btn-ghost btn-sm !px-3 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      {open && (
        <div className="space-y-1 border-t border-white/10 px-5 pb-5 pt-3 md:hidden">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 font-mono text-xs uppercase tracking-[0.18em] text-mute hover:bg-white/5 hover:text-lime">
              {l.label}
            </a>
          ))}
          <div className="grid grid-cols-2 gap-3 pt-3">
            {me ? (
              <Link to="/dashboard" className="btn-primary col-span-2">
                Open classroom
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary">
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function Terminal3() {
  const line = (d: number) => ({ animationDelay: `${d}ms` });
  return (
    <div className="relative">
      <div className="absolute -right-2 -top-6 z-10 hidden animate-float rounded-xl border border-aqua/40 bg-ink-900 px-3 py-2 font-mono text-xs text-aqua shadow-lg sm:block">
        AND · OR · NOT
      </div>
      <div className="absolute -bottom-6 -left-3 z-10 hidden animate-float rounded-xl border border-amber/40 bg-ink-900 px-3 py-2 font-mono text-xs text-amber shadow-lg [animation-delay:1.5s] sm:block">
        0xFF = 255
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-800/95 shadow-[8px_8px_0_0_#C8FF3E] sm:shadow-[12px_12px_0_0_#C8FF3E]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <i className="h-2.5 w-2.5 rounded-full bg-coral" />
          <i className="h-2.5 w-2.5 rounded-full bg-amber" />
          <i className="h-2.5 w-2.5 rounded-full bg-lime" />
          <span className="ml-3 font-mono text-[11px] text-mute">classroom.sh</span>
        </div>
        <div className="relative p-5 font-mono text-[12px] leading-7 sm:text-[13px]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 animate-scan bg-gradient-to-b from-transparent via-lime/[0.06] to-transparent" />
          <p className="animate-rise text-mute" style={line(100)}>
            <span className="text-lime">$</span> ict start --course hsc
          </p>
          <p className="animate-rise" style={line(500)}>
            <span className="text-lime">✔</span> chapter_03 · number systems
          </p>
          <p className="animate-rise pl-5 text-aqua" style={line(900)}>
            1011₂ → 8+0+2+1 = 11₁₀
          </p>
          <p className="animate-rise" style={line(1300)}>
            <span className="text-lime">✔</span> chapter_04 · web design
          </p>
          <p className="animate-rise break-all pl-5 text-amber" style={line(1700)}>
            {"<h1>Hello, HSC!</h1>"}
          </p>
          <p className="animate-rise" style={line(2100)}>
            <span className="text-lime">✔</span> chapter_06 · database
          </p>
          <p className="animate-rise break-all pl-5 text-aqua" style={line(2500)}>
            SELECT * FROM students WHERE gpa = 5;
          </p>
          <p className="animate-rise mt-1 text-mute" style={line(2900)}>
            <span className="text-lime">$</span> <span className="inline-block h-4 w-2 translate-y-0.5 animate-blink bg-lime" />
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const { me } = useMe();
  const cta = me ? "/dashboard" : "/register";

  return (
    <div className="relative overflow-x-hidden">
      <PublicNav />

      {/* HERO */}
      <header className="relative isolate">
        <div className="grid-bg absolute inset-0 -z-10" />
        <div className="absolute -right-32 -top-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-aqua/20 blur-[110px]" />
        <div className="absolute -left-40 top-40 -z-10 h-[26rem] w-[26rem] rounded-full bg-lime/10 blur-[110px]" />

        <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-24">
          <div>
            <span className="chip">
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-lime" /> {SITE.course} · Full course · Chapter-wise
            </span>
            <h1 className="h-display mt-6 text-[2.5rem] sm:text-6xl xl:text-7xl">
              Crack HSC ICT,
              <br />
              <span className="relative inline-block text-lime">
                byte
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 10" fill="none" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 7c40-6 100-6 196-1" stroke="#35E8D4" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </span>{" "}
              by byte.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-mute">
              Private video classes, chapter-wise notes, MCQ practice, slides and PDFs — all inside one members-only classroom, taught by{" "}
              <span className="text-bone">{SITE.instructor}</span>.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to={cta} className="btn-primary !px-7 !py-4 text-base">
                {me ? "Open classroom" : "Join the classroom"} <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#syllabus" className="btn-ghost !px-7 !py-4 text-base">
                See the syllabus
              </a>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
              {[
                [PlayCircle, "Video classes"],
                [FileText, "Notes & PDFs"],
                [ListChecks, "MCQ practice"],
                [MessageSquare, "Ask doubts"],
              ].map(([Icon, label]) => {
                const I = Icon as typeof PlayCircle;
                return (
                  <li key={label as string} className="flex items-center gap-2">
                    <I className="h-4 w-4 text-aqua" /> {label as string}
                  </li>
                );
              })}
            </ul>
          </div>
          <Terminal3 />
        </div>
      </header>

      {/* TICKER */}
      <div className="overflow-hidden border-y border-white/10 bg-lime py-3.5 text-ink-900" aria-hidden>
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-sm font-bold tracking-wider">
          {[...TICKER, ...TICKER].map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              {t} <span className="text-ink-900/40">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* SYLLABUS */}
      <section id="syllabus" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-24">
        <p className="eyebrow">The syllabus</p>
        <h2 className="h-display mt-3 max-w-2xl text-3xl sm:text-5xl">Six chapters. One clear path.</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CHAPTERS.map((c) => (
            <article key={c.n} className="card-hover group relative overflow-hidden p-6">
              <span className="absolute -right-3 -top-6 font-display text-[7rem] font-black leading-none text-white/[0.04] transition group-hover:text-lime/10">
                {c.n}
              </span>
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-lime/30 bg-lime/10 text-lime">
                <c.icon className="h-5 w-5" />
              </span>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-aqua">Chapter {c.n}</p>
              <h3 className="mt-2 font-display text-lg font-bold leading-snug">{c.title}</h3>
              <p className="mt-3 text-sm text-mute">{c.tag}</p>
            </article>
          ))}
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section id="inside" className="mx-auto max-w-7xl scroll-mt-20 px-5 pb-24">
        <p className="eyebrow">Inside the classroom</p>
        <h2 className="h-display mt-3 max-w-2xl text-3xl sm:text-5xl">Everything for the exam, in one place.</h2>
        <div className="mt-12 grid gap-5 md:grid-cols-6">
          <div className="card relative overflow-hidden p-7 md:col-span-4">
            <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-aqua/20 blur-3xl" />
            <PlayCircle className="h-8 w-8 text-aqua" />
            <h3 className="h-display mt-5 text-2xl">Class videos, in order</h3>
            <p className="mt-3 max-w-md text-mute">Each chapter is a module of lessons. Watch in sequence, mark classes complete, and always know what to watch next.</p>
          </div>
          <div className="card p-7 md:col-span-2">
            <ListChecks className="h-8 w-8 text-lime" />
            <h3 className="h-display mt-5 text-xl">MCQ practice</h3>
            <p className="mt-3 text-sm text-mute">Instant scoring with an explanation for every answer.</p>
          </div>
          <div className="card p-7 md:col-span-2">
            <FileText className="h-8 w-8 text-amber" />
            <h3 className="h-display mt-5 text-xl">Notes & PDFs</h3>
            <p className="mt-3 text-sm text-mute">Read online or download for offline revision.</p>
          </div>
          <div className="card p-7 md:col-span-2">
            <Presentation className="h-8 w-8 text-aqua" />
            <h3 className="h-display mt-5 text-xl">Slides & images</h3>
            <p className="mt-3 text-sm text-mute">Diagrams and slide decks tied to the right class.</p>
          </div>
          <div className="card p-7 md:col-span-2">
            <TrendingUp className="h-8 w-8 text-lime" />
            <h3 className="h-display mt-5 text-xl">Track progress</h3>
            <p className="mt-3 text-sm text-mute">A live progress ring across all six chapters.</p>
          </div>
          <div className="card flex flex-col justify-between gap-6 p-7 md:col-span-6 md:flex-row md:items-center">
            <div>
              <MessageSquare className="h-8 w-8 text-amber" />
              <h3 className="h-display mt-5 text-2xl">Stuck? Comment right under the class.</h3>
              <p className="mt-2 max-w-xl text-mute">Every class and every material has its own discussion, so doubts get answered where they come up.</p>
            </div>
            <Link to={cta} className="btn-primary shrink-0">
              Start learning <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative scroll-mt-20 border-y border-white/10 bg-ink-950/60 py-24">
        <div className="mx-auto max-w-7xl px-5">
          <p className="eyebrow">How it works</p>
          <h2 className="h-display mt-3 text-3xl sm:text-5xl">Three steps to class.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              ["01", "Register", "Create your free student account with your email."],
              ["02", "Open your classes", "Pick up at chapter one, or jump straight to the one you need."],
              ["03", "Learn & revise", "Watch, read, practise MCQs and ask questions in the comments."],
            ].map(([n, t, d]) => (
              <div key={n} className="relative rounded-2xl border border-white/10 p-7">
                <span className="font-display text-5xl font-black text-lime">{n}</span>
                <h3 className="mt-4 font-display text-lg font-bold">{t}</h3>
                <p className="mt-2 text-sm text-mute">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-lime/30 bg-gradient-to-br from-ink-700 to-ink-800 p-8 text-center sm:p-16">
          <div className="grid-bg absolute inset-0 opacity-70" />
          <div className="relative">
            <h2 className="h-display mx-auto max-w-2xl text-3xl sm:text-5xl">
              Ready to turn ICT into your <span className="text-lime">easiest</span> subject?
            </h2>
            <Link to={cta} className="btn-primary mt-9 !px-8 !py-4 text-base">
              {me ? "Open classroom" : "Create free account"} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo />
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
            © {new Date().getFullYear()} {SITE.name} · {SITE.course}
          </p>
        </div>
      </footer>
    </div>
  );
}
