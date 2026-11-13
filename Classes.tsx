import { CheckCircle2, ChevronDown, Circle, Play } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHead } from "../components/AppLayout";
import { Empty, ErrorNote, Spinner } from "../components/Guards";
import { useApi } from "../lib/api";
import type { Chapter } from "../lib/types";

export default function Classes() {
  const cur = useApi<{ chapters: Chapter[] }>("/curriculum");
  const prog = useApi<{ completed: string[] }>("/progress");
  const [closed, setClosed] = useState<Record<string, boolean>>({});

  if (cur.loading) return <Spinner />;
  if (cur.error) return <ErrorNote message={cur.error} />;

  const done = new Set(prog.data?.completed ?? []);
  const chapters = cur.data?.chapters ?? [];

  return (
    <>
      <PageHead eyebrow="Video classes" title="All classes, chapter by chapter" />
      {chapters.length === 0 && <Empty title="No chapters yet" />}
      <div className="space-y-4">
        {chapters.map((c, i) => {
          const isClosed = closed[c._id];
          const d = c.lessons.filter((l) => done.has(l._id)).length;
          return (
            <section key={c._id} className="card overflow-hidden">
              <button onClick={() => setClosed((s) => ({ ...s, [c._id]: !s[c._id] }))} className="flex w-full items-center gap-4 p-5 text-left">
                <span className="font-display text-3xl font-black text-lime/80">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold leading-snug">{c.title}</span>
                  <span className="mt-1 block font-mono text-[11px] text-mute">
                    {d}/{c.lessons.length} done · {c.materialCount} materials
                  </span>
                </span>
                <ChevronDown className={`h-5 w-5 shrink-0 text-mute transition ${isClosed ? "-rotate-90" : ""}`} />
              </button>
              {!isClosed && (
                <ul className="border-t border-white/10">
                  {c.lessons.map((l, j) => (
                    <li key={l._id}>
                      <Link to={`/lesson/${l._id}`} className="group flex items-center gap-4 px-5 py-4 transition hover:bg-white/[0.04]">
                        {done.has(l._id) ? <CheckCircle2 className="h-5 w-5 shrink-0 text-lime" /> : <Circle className="h-5 w-5 shrink-0 text-mute/60" />}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium group-hover:text-lime">
                            {j + 1}. {l.title}
                          </span>
                          {l.duration && <span className="font-mono text-[11px] text-mute">{l.duration}</span>}
                        </span>
                        <Play className="h-4 w-4 shrink-0 text-aqua opacity-0 transition group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                  {c.lessons.length === 0 && <li className="px-5 py-5 text-sm text-mute">Classes for this chapter are coming soon.</li>}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
