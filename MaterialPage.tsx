import { ChevronLeft, Download } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Comments from "../components/Comments";
import { ErrorNote, Spinner } from "../components/Guards";
import McqPlayer from "../components/McqPlayer";
import { fileUrl, fmtDate, fmtSize, useApi } from "../lib/api";
import { TYPE_META } from "../lib/materialMeta";
import type { MaterialFull } from "../lib/types";

export default function MaterialPage() {
  const { id } = useParams();
  const { data: m, loading, error } = useApi<MaterialFull>(`/materials/${id}`);

  if (loading) return <Spinner />;
  if (error || !m) return <ErrorNote message={error ?? "Material not found"} />;

  const meta = TYPE_META[m.type];
  const f = m.file;
  const isPdf = f?.stored.toLowerCase().endsWith(".pdf");
  const isImg = !!f && /\.(png|jpe?g|webp|gif)$/i.test(f.stored);

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/library" className="mb-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-mute hover:text-lime">
        <ChevronLeft className="h-3.5 w-3.5" /> Library
      </Link>

      <div className="mb-8">
        <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] ${meta.tint} ${meta.text}`}>
          <meta.icon className="h-3.5 w-3.5" /> {meta.label}
        </span>
        <h1 className="h-display mt-4 text-2xl sm:text-4xl">{m.title}</h1>
        <p className="mt-3 font-mono text-xs text-mute">
          {m.chapter?.title}
          {m.lesson && (
            <>
              {" · "}
              <Link to={`/lesson/${m.lesson._id}`} className="text-aqua hover:underline">
                {m.lesson.title}
              </Link>
            </>
          )}
          {" · "}
          {fmtDate(m.createdAt)}
        </p>
        {m.description && <p className="mt-4 max-w-2xl text-bone/85">{m.description}</p>}
      </div>

      <div className="space-y-8">
        {m.type === "mcq" && m.mcq && <McqPlayer questions={m.mcq} />}

        {m.type === "note" && m.body && (
          <article className="card whitespace-pre-wrap break-words p-6 leading-[1.85] text-bone/90 sm:p-8">{m.body}</article>
        )}

        {f && isImg && (
          <a href={fileUrl(f.stored)} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-2xl border border-white/10 bg-ink-950">
            <img src={fileUrl(f.stored)} alt={m.title} className="mx-auto max-h-[80vh] w-auto max-w-full" />
          </a>
        )}

        {f && isPdf && (
          <iframe src={fileUrl(f.stored)} title={m.title} className="h-[75vh] w-full rounded-2xl border border-white/10 bg-ink-950" />
        )}

        {f && (
          <div className="card flex flex-wrap items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{f.original}</p>
              <p className="font-mono text-[11px] text-mute">{fmtSize(f.size)}</p>
            </div>
            <a href={fileUrl(f.stored, true)} className="btn-primary btn-sm">
              <Download className="h-3.5 w-3.5" /> Download
            </a>
          </div>
        )}

        <Comments kind="material" target={m._id} />
      </div>
    </div>
  );
}
