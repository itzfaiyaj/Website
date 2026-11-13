import { Link } from "react-router-dom";
import { fmtDate } from "../lib/api";
import { TYPE_META } from "../lib/materialMeta";
import type { MaterialItem } from "../lib/types";

export default function MaterialCard({ m, compact = false }: { m: MaterialItem; compact?: boolean }) {
  const meta = TYPE_META[m.type];
  return (
    <Link to={`/material/${m._id}`} className="card-hover flex gap-4 p-4">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border ${meta.tint} ${meta.text}`}>
        <meta.icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${meta.text}`}>
          {meta.label}
          {m.type === "mcq" && m.mcqCount ? ` · ${m.mcqCount} Q` : ""}
        </p>
        <p className="mt-1 truncate font-semibold">{m.title}</p>
        {!compact && (
          <p className="mt-1 truncate text-xs text-mute">
            {m.chapter?.title ?? "—"} · {fmtDate(m.createdAt)}
          </p>
        )}
      </div>
    </Link>
  );
}
