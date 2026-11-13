import { ArrowRight, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHead } from "../components/AppLayout";
import { Empty, Spinner } from "../components/Guards";
import MaterialCard from "../components/MaterialCard";
import { useApi } from "../lib/api";
import { useMe } from "../lib/auth";
import type { Chapter, MaterialItem } from "../lib/types";

function Ring({ pct }: { pct: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-36 w-36 shrink-0">
      <svg viewBox="0 0 120 120" className="-rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#14302A" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="#C8FF3E"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-display text-3xl font-black">{pct}%</p>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">complete</p>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { me } = useMe();
  const cur = useApi<{ chapters: Chapter[] }>("/curriculum");
  const prog = useApi<{ completed: string[] }>("/progress");
  const lib = useApi<{ items: MaterialItem[] }>("/materials");

  if (cur.loading || prog.loading) return <Spinner />;

  const chapters = cur.data?.chapters ?? [];
  const done = new Set(prog.data?.completed ?? []);
  const all = chapters.flatMap((c) => c.lessons);
  const total = all.length;
  const doneCount = all.filter((l) => done.has(l._id)).length;
  const pct = total ? Math.round((doneCount / total) * 100) : 0;
  const next = all.find((l) => !done.has(l._id));

  return (
    <>
      <PageHead eyebrow="Dashboard" title={`Hello, ${me?.name?.split(" ")[0] ?? "student"} 👋`} />

      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <div className="card flex items-center gap-6 p-6">
          <Ring pct={pct} />
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-aqua">Your progress</p>
            <p className="mt-2 font-display text-xl font-bold">
              {doneCount} of {total} classes
            </p>
            <p className="mt-1 text-sm text-mute">{total === 0 ? "Classes will appear here soon." : pct === 100 ? "Course complete. Revise with MCQs!" : "Keep the streak going."}</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-lime/30 bg-gradient-to-br from-ink-700 to-ink-800 p-6">
          <div className="grid-bg absolute inset-0 opacity-60" />
          <div className="relative">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-lime">Up next</p>
            {next ? (
              <>
                <h2 className="mt-3 font-display text-xl font-bold leading-snug sm:text-2xl">{next.title}</h2>
                <Link to={`/lesson/${next._id}`} className="btn-primary mt-6">
                  <PlayCircle className="h-4 w-4" /> Watch now
                </Link>
              </>
            ) : (
              <>
                <h2 className="mt-3 font-display text-xl font-bold leading-snug sm:text-2xl">
                  {total ? "You've watched every class." : "No classes uploaded yet."}
                </h2>
                <Link to="/library" className="btn-ghost mt-6">
                  Browse the library
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <h2 className="mb-4 mt-12 font-display text-lg font-bold">Chapters</h2>
      {chapters.length === 0 ? (
        <Empty title="No chapters yet" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {chapters.map((c, i) => {
            const d = c.lessons.filter((l) => done.has(l._id)).length;
            const p = c.lessons.length ? (d / c.lessons.length) * 100 : 0;
            return (
              <Link to="/classes" key={c._id} className="card-hover p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-aqua">Chapter {String(i + 1).padStart(2, "0")}</p>
                <p className="mt-2 min-h-[2.75rem] font-semibold leading-snug">{c.title}</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink-600">
                  <div className="h-full rounded-full bg-lime transition-all" style={{ width: `${p}%` }} />
                </div>
                <p className="mt-2 font-mono text-[11px] text-mute">
                  {d}/{c.lessons.length} classes · {c.materialCount} materials
                </p>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mb-4 mt-12 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold">Latest materials</h2>
        <Link to="/library" className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-lime hover:underline">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {(lib.data?.items ?? []).slice(0, 4).map((m) => (
          <MaterialCard key={m._id} m={m} />
        ))}
      </div>
      {lib.data && lib.data.items.length === 0 && <Empty title="No materials yet" hint="Notes, MCQs, slides and PDFs will show up here." />}
    </>
  );
}
