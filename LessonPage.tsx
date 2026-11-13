import { CheckCircle2, ChevronLeft, ChevronRight, Circle, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Comments from "../components/Comments";
import { ErrorNote, Spinner } from "../components/Guards";
import MaterialCard from "../components/MaterialCard";
import { api, useApi } from "../lib/api";
import type { Lesson, MaterialItem } from "../lib/types";

interface Detail {
  lesson: Omit<Lesson, "chapter"> & { chapter: { _id: string; title: string } };
  materials: MaterialItem[];
  prev: { _id: string; title: string } | null;
  next: { _id: string; title: string } | null;
}

export default function LessonPage() {
  const { id } = useParams();
  const { data, loading, error } = useApi<Detail>(`/lessons/${id}`);
  const prog = useApi<{ completed: string[] }>("/progress");

  if (loading) return <Spinner />;
  if (error || !data) return <ErrorNote message={error ?? "Class not found"} />;

  const { lesson, materials, prev, next } = data;
  const done = prog.data?.completed.includes(lesson._id) ?? false;

  async function toggle() {
    await api(`/lessons/${lesson._id}/complete`, { method: "POST", body: {} });
    prog.reload();
  }

  return (
    <>
      <Link to="/classes" className="mb-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-mute hover:text-lime">
        <ChevronLeft className="h-3.5 w-3.5" /> {lesson.chapter?.title}
      </Link>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-ink-950 shadow-[4px_4px_0_0_#35E8D4] sm:shadow-[8px_8px_0_0_#35E8D4]">
            <iframe
              key={lesson.youtubeId}
              src={`https://www.youtube-nocookie.com/embed/${lesson.youtubeId}?rel=0&modestbranding=1`}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full"
            />
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="h-display text-xl sm:text-3xl">{lesson.title}</h1>
              {lesson.duration && <p className="mt-2 font-mono text-xs text-mute">{lesson.duration}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <a href={`https://www.youtube.com/watch?v=${lesson.youtubeId}`} target="_blank" rel="noreferrer" className="btn-ghost btn-sm">
                <ExternalLink className="h-3.5 w-3.5" /> Open on YouTube
              </a>
              <button onClick={toggle} className={done ? "btn-primary btn-sm" : "btn-ghost btn-sm"}>
                {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />} {done ? "Completed" : "Mark complete"}
              </button>
            </div>
          </div>

          {lesson.description && <p className="whitespace-pre-wrap leading-relaxed text-bone/85">{lesson.description}</p>}

          <div className="grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link to={`/lesson/${prev._id}`} className="card-hover flex items-center gap-3 p-4">
                <ChevronLeft className="h-5 w-5 shrink-0 text-aqua" />
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-mute">Previous</span>
                  <span className="block truncate text-sm font-semibold">{prev.title}</span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next && (
              <Link to={`/lesson/${next._id}`} className="card-hover flex items-center justify-end gap-3 p-4 text-right">
                <span className="min-w-0">
                  <span className="block font-mono text-[10px] uppercase tracking-widest text-mute">Next</span>
                  <span className="block truncate text-sm font-semibold">{next.title}</span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-lime" />
              </Link>
            )}
          </div>

          <Comments kind="lesson" target={lesson._id} />
        </div>

        <aside className="min-w-0">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-aqua">Materials for this class</h2>
          <div className="space-y-3">
            {materials.map((m) => (
              <MaterialCard key={m._id} m={m} compact />
            ))}
            {materials.length === 0 && <p className="rounded-xl border border-dashed border-white/15 p-5 text-sm text-mute">No materials attached to this class yet.</p>}
          </div>
        </aside>
      </div>
    </>
  );
}
