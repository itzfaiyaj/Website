import { Info, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ErrorNote, Spinner } from "../../components/Guards";
import { api, useApi } from "../../lib/api";
import type { Chapter, Lesson } from "../../lib/types";

function ChapterForm({ initial, onDone, onCancel }: { initial?: Chapter; onDone: () => void; onCancel?: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (initial) await api(`/chapters/${initial._id}`, { method: "PUT", body: { title, description } });
      else await api("/chapters", { body: { title, description } });
      if (!initial) {
        setTitle("");
        setDescription("");
      }
      onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {error && <ErrorNote message={error} />}
      <input className="input" required placeholder="Chapter title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="input min-h-[70px]" placeholder="Short description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="flex gap-2">
        <button className="btn-primary btn-sm" disabled={busy}>
          {initial ? "Save chapter" : "Add chapter"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost btn-sm">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function LessonForm({ chapterId, initial, onDone, onCancel }: { chapterId: string; initial?: Lesson; onDone: () => void; onCancel: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [video, setVideo] = useState(initial ? `https://youtu.be/${initial.youtubeId}` : "");
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = { chapter: chapterId, title, video, duration, description };
      if (initial) await api(`/lessons/${initial._id}`, { method: "PUT", body });
      else await api("/lessons", { body });
      onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-lime/25 bg-ink-900/70 p-4">
      {error && <ErrorNote message={error} />}
      <input className="input" required placeholder="Class title, e.g. Binary to decimal conversion" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="grid gap-3 sm:grid-cols-[1fr_140px]">
        <input className="input" required placeholder="YouTube link" value={video} onChange={(e) => setVideo(e.target.value)} />
        <input className="input" placeholder="Length, e.g. 42 min" value={duration} onChange={(e) => setDuration(e.target.value)} />
      </div>
      <textarea className="input min-h-[70px]" placeholder="What this class covers (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="flex gap-2">
        <button className="btn-primary btn-sm" disabled={busy}>
          {initial ? "Save class" : "Add class"}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost btn-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function Curriculum() {
  const { data, loading, error, reload } = useApi<{ chapters: Chapter[] }>("/curriculum");
  const [editChapter, setEditChapter] = useState<string | null>(null);
  const [addLessonTo, setAddLessonTo] = useState<string | null>(null);
  const [editLesson, setEditLesson] = useState<string | null>(null);

  async function del(path: string, msg: string) {
    if (!confirm(msg)) return;
    await api(path, { method: "DELETE" }).catch((e: Error) => alert(e.message));
    reload();
  }
  const done = () => {
    setEditChapter(null);
    setAddLessonTo(null);
    setEditLesson(null);
    reload();
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorNote message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex gap-3 rounded-xl border border-amber/30 bg-amber/10 p-4 text-sm text-amber">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          YouTube <b>Private</b> videos cannot be played inside any website — they only play for invited Google accounts on youtube.com. Set your videos to <b>Unlisted</b>: only people who have the link (your registered students, through this site) can find them.
        </p>
      </div>

      {data?.chapters.map((c, i) => (
        <section key={c._id} className="card p-5">
          {editChapter === c._id ? (
            <ChapterForm initial={c} onDone={done} onCancel={() => setEditChapter(null)} />
          ) : (
            <div className="flex items-start gap-4">
              <span className="font-display text-3xl font-black text-lime/80">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold leading-snug">{c.title}</h3>
                {c.description && <p className="mt-1 text-sm text-mute">{c.description}</p>}
              </div>
              <button onClick={() => setEditChapter(c._id)} aria-label="Edit chapter" className="text-mute hover:text-lime">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => del(`/chapters/${c._id}`, `Delete “${c.title}” with all its classes, materials and comments?`)} aria-label="Delete chapter" className="text-mute hover:text-coral">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}

          <ul className="mt-5 space-y-2">
            {c.lessons.map((l) =>
              editLesson === l._id ? (
                <li key={l._id}>
                  <LessonForm chapterId={c._id} initial={l} onDone={done} onCancel={() => setEditLesson(null)} />
                </li>
              ) : (
                <li key={l._id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-ink-900/50 px-4 py-3">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{l.title}</span>
                    <span className="font-mono text-[11px] text-mute">
                      {l.youtubeId}
                      {l.duration && ` · ${l.duration}`}
                    </span>
                  </span>
                  <button onClick={() => setEditLesson(l._id)} aria-label="Edit class" className="text-mute hover:text-lime">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => del(`/lessons/${l._id}`, `Delete the class “${l.title}”?`)} aria-label="Delete class" className="text-mute hover:text-coral">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ),
            )}
          </ul>

          <div className="mt-4">
            {addLessonTo === c._id ? (
              <LessonForm chapterId={c._id} onDone={done} onCancel={() => setAddLessonTo(null)} />
            ) : (
              <button onClick={() => setAddLessonTo(c._id)} className="btn-ghost btn-sm">
                <Plus className="h-3.5 w-3.5" /> Add class video
              </button>
            )}
          </div>
        </section>
      ))}

      <section className="card p-5">
        <h3 className="mb-4 flex items-center gap-2 font-display font-bold">
          <X className="hidden" />
          <Plus className="h-4 w-4 text-lime" /> New chapter
        </h3>
        <ChapterForm onDone={reload} />
      </section>
    </div>
  );
}
