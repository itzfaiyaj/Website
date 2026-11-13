import { Plus, Trash2, Upload } from "lucide-react";
import { useState, type FormEvent } from "react";
import { ErrorNote, Spinner } from "../../components/Guards";
import { api, fmtDate, useApi } from "../../lib/api";
import { TYPE_META, TYPE_ORDER } from "../../lib/materialMeta";
import type { Chapter, MaterialItem, MaterialType } from "../../lib/types";

interface Q {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}
const blankQ = (): Q => ({ question: "", options: ["", "", "", ""], answer: 0, explanation: "" });

const ACCEPT: Record<MaterialType, string> = {
  note: ".pdf,.doc,.docx",
  mcq: "",
  slide: ".pdf,.ppt,.pptx",
  pdf: ".pdf",
  image: "image/png,image/jpeg,image/webp,image/gif",
};

export default function Materials() {
  const cur = useApi<{ chapters: Chapter[] }>("/curriculum");
  const list = useApi<{ items: MaterialItem[] }>("/materials");

  const [type, setType] = useState<MaterialType>("note");
  const [title, setTitle] = useState("");
  const [chapter, setChapter] = useState("");
  const [lesson, setLesson] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [qs, setQs] = useState<Q[]>([blankQ()]);
  const [fileKey, setFileKey] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const chapters = cur.data?.chapters ?? [];
  const lessons = chapters.find((c) => c._id === chapter)?.lessons ?? [];

  const setQ = (i: number, patch: Partial<Q>) => setQs((a) => a.map((q, j) => (j === i ? { ...q, ...patch } : q)));
  const setOpt = (i: number, k: number, v: string) => setQ(i, { options: qs[i].options.map((o, j) => (j === k ? v : o)) });

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!chapter) return setError("Choose a chapter first");
    const fd = new FormData();
    fd.set("type", type);
    fd.set("title", title);
    fd.set("chapter", chapter);
    if (lesson) fd.set("lesson", lesson);
    fd.set("description", description);
    if (type === "note") fd.set("body", body);
    if (type === "mcq") {
      // drop blank options, remap the correct answer index so it still points at the same option
      const clean = qs.map((q) => {
        const kept = q.options.map((o, idx) => ({ o: o.trim(), idx })).filter((x) => x.o);
        return { question: q.question, explanation: q.explanation, options: kept.map((x) => x.o), answer: Math.max(0, kept.findIndex((x) => x.idx === q.answer)) };
      });
      fd.set("mcq", JSON.stringify(clean));
    }
    if (file) fd.set("file", file);

    setBusy(true);
    try {
      await api("/materials", { body: fd });
      setTitle("");
      setDescription("");
      setBody("");
      setFile(null);
      setFileKey((k) => k + 1);
      setQs([blankQ()]);
      list.reload();
      cur.reload();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(m: MaterialItem) {
    if (!confirm(`Delete “${m.title}”?`)) return;
    await api(`/materials/${m._id}`, { method: "DELETE" }).catch((e: Error) => alert(e.message));
    list.reload();
  }

  if (cur.loading) return <Spinner />;

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <form onSubmit={submit} className="card space-y-5 p-5 sm:p-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold">
          <Upload className="h-4 w-4 text-lime" /> Add material
        </h2>
        {error && <ErrorNote message={error} />}

        <div>
          <span className="label">Type</span>
          <div className="flex flex-wrap gap-2">
            {TYPE_ORDER.map((t) => {
              const m = TYPE_META[t];
              return (
                <button
                  type="button"
                  key={t}
                  onClick={() => {
                    setType(t);
                    setFile(null);
                    setFileKey((k) => k + 1);
                  }}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition ${type === t ? `${m.tint} ${m.text}` : "border-white/15 text-mute hover:text-bone"}`}
                >
                  <m.icon className="h-4 w-4" /> {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="label">Title</label>
          <input className="input" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Number system short notes" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Chapter</label>
            <select
              className="input"
              value={chapter}
              onChange={(e) => {
                setChapter(e.target.value);
                setLesson("");
              }}
            >
              <option value="">Select…</option>
              {chapters.map((c, i) => (
                <option key={c._id} value={c._id}>
                  {i + 1}. {c.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Class (optional)</label>
            <select className="input" value={lesson} onChange={(e) => setLesson(e.target.value)} disabled={!chapter}>
              <option value="">Whole chapter</option>
              {lessons.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="label">Description (optional)</label>
          <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {type === "note" && (
          <div>
            <label className="label">Write the note (or attach a file below)</label>
            <textarea className="input min-h-[160px]" value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
        )}

        {type !== "mcq" && (
          <div>
            <label className="label">
              File {type === "note" ? "(optional)" : ""} · max 25 MB
            </label>
            <input
              key={fileKey}
              type="file"
              accept={ACCEPT[type]}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="input file:mr-4 file:rounded-lg file:border-0 file:bg-lime file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-ink-900"
            />
          </div>
        )}

        {type === "mcq" && (
          <div className="space-y-5">
            {qs.map((q, i) => (
              <div key={i} className="space-y-3 rounded-xl border border-white/10 bg-ink-900/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-aqua">Question {i + 1}</span>
                  {qs.length > 1 && (
                    <button type="button" onClick={() => setQs((a) => a.filter((_, j) => j !== i))} className="text-mute hover:text-coral" aria-label="Remove question">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <textarea className="input min-h-[64px]" placeholder="Question" value={q.question} onChange={(e) => setQ(i, { question: e.target.value })} />
                {q.options.map((o, k) => (
                  <div key={k} className="flex items-center gap-3">
                    <input type="radio" name={`ans-${i}`} checked={q.answer === k} onChange={() => setQ(i, { answer: k })} className="h-4 w-4 accent-[#C8FF3E]" aria-label={`Correct answer ${k + 1}`} />
                    <input className="input" placeholder={`Option ${String.fromCharCode(65 + k)}`} value={o} onChange={(e) => setOpt(i, k, e.target.value)} />
                  </div>
                ))}
                <input className="input" placeholder="Explanation shown after checking (optional)" value={q.explanation} onChange={(e) => setQ(i, { explanation: e.target.value })} />
                <p className="font-mono text-[10px] text-mute">Select the radio button next to the correct option. Leave unused options blank.</p>
              </div>
            ))}
            <button type="button" onClick={() => setQs((a) => [...a, blankQ()])} className="btn-ghost btn-sm">
              <Plus className="h-3.5 w-3.5" /> Add question
            </button>
          </div>
        )}

        <button className="btn-primary w-full" disabled={busy}>
          {busy ? "Uploading…" : "Publish material"}
        </button>
      </form>

      <div className="min-w-0">
        <h2 className="mb-4 font-display text-lg font-bold">
          Published <span className="font-mono text-sm text-aqua">{list.data?.items.length ?? 0}</span>
        </h2>
        <div className="space-y-3">
          {list.data?.items.map((m) => {
            const meta = TYPE_META[m.type];
            return (
              <div key={m._id} className="card flex items-center gap-3 p-3.5">
                <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border ${meta.tint} ${meta.text}`}>
                  <meta.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{m.title}</p>
                  <p className="truncate font-mono text-[11px] text-mute">
                    {meta.label} · {m.chapter?.title} · {fmtDate(m.createdAt)}
                  </p>
                </div>
                <button onClick={() => remove(m)} aria-label="Delete" className="text-mute hover:text-coral">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
          {list.data && list.data.items.length === 0 && <p className="rounded-xl border border-dashed border-white/15 p-6 text-sm text-mute">Nothing published yet.</p>}
        </div>
      </div>
    </div>
  );
}
