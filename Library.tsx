import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { PageHead } from "../components/AppLayout";
import { Empty, ErrorNote, Spinner } from "../components/Guards";
import MaterialCard from "../components/MaterialCard";
import { useApi } from "../lib/api";
import { TYPE_META, TYPE_ORDER } from "../lib/materialMeta";
import type { Chapter, MaterialItem, MaterialType } from "../lib/types";

export default function Library() {
  const [type, setType] = useState<MaterialType | "">("");
  const [chapter, setChapter] = useState("");
  const [q, setQ] = useState("");
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (chapter) params.set("chapter", chapter);
  if (debounced) params.set("q", debounced);

  const cur = useApi<{ chapters: Chapter[] }>("/curriculum");
  const { data, loading, error } = useApi<{ items: MaterialItem[] }>(`/materials?${params}`);

  return (
    <>
      <PageHead eyebrow="Library" title="Notes, MCQs, slides & more" />

      <div className="mb-6 grid gap-3 md:grid-cols-[1fr_260px]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
          <input className="input pl-11" placeholder="Search materials…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="input" value={chapter} onChange={(e) => setChapter(e.target.value)}>
          <option value="">All chapters</option>
          {cur.data?.chapters.map((c, i) => (
            <option key={c._id} value={c._id}>
              {i + 1}. {c.title}
            </option>
          ))}
        </select>
      </div>

      <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {[{ key: "" as const, label: "All" }, ...TYPE_ORDER.map((t) => ({ key: t, label: TYPE_META[t].plural }))].map((t) => (
          <button
            key={t.key || "all"}
            onClick={() => setType(t.key)}
            className={`shrink-0 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition ${
              type === t.key ? "border-lime bg-lime text-ink-900" : "border-white/15 text-mute hover:border-lime/50 hover:text-lime"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorNote message={error} />
      ) : data && data.items.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((m) => (
            <MaterialCard key={m._id} m={m} />
          ))}
        </div>
      ) : (
        <Empty title="Nothing here yet" hint="Try another filter, or check back soon — new materials are added often." />
      )}
    </>
  );
}
