import { Send, Trash2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { api, fmtDate, useApi } from "../lib/api";
import { useMe } from "../lib/auth";
import type { CommentItem } from "../lib/types";
import { ErrorNote } from "./Guards";

export default function Comments({ kind, target }: { kind: "lesson" | "material"; target: string }) {
  const { me } = useMe();
  const { data, reload } = useApi<{ items: CommentItem[] }>(`/comments?kind=${kind}&target=${target}`);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    setError("");
    try {
      await api("/comments", { body: { kind, target, text } });
      setText("");
      reload();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this comment?")) return;
    await api(`/comments/${id}`, { method: "DELETE" }).catch(() => {});
    reload();
  }

  const items = data?.items ?? [];

  return (
    <section className="card p-5 sm:p-6">
      <h2 className="font-display text-lg font-bold">
        Discussion <span className="ml-1 font-mono text-sm text-aqua">{items.length}</span>
      </h2>

      <form onSubmit={submit} className="mt-5 space-y-3">
        {error && <ErrorNote message={error} />}
        <textarea
          className="input min-h-[96px] resize-y"
          placeholder="Ask a question or share a tip…"
          maxLength={1000}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] text-mute">{text.length}/1000</span>
          <button className="btn-primary btn-sm" disabled={busy || !text.trim()}>
            <Send className="h-3.5 w-3.5" /> Post
          </button>
        </div>
      </form>

      <ul className="mt-6 space-y-4">
        {items.map((c) => (
          <li key={c._id} className="flex gap-3">
            <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg font-display text-xs font-bold ${c.isAdmin ? "bg-lime text-ink-900" : "bg-ink-600 text-bone"}`}>
              {c.userName[0]?.toUpperCase()}
            </span>
            <div className="min-w-0 flex-1 rounded-xl border border-white/10 bg-ink-900/60 px-4 py-3">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="text-sm font-semibold">{c.userName}</span>
                {c.isAdmin && <span className="rounded bg-lime/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-lime">Instructor</span>}
                <span className="font-mono text-[10px] text-mute">{fmtDate(c.createdAt)}</span>
                {(me?.id === c.userId || me?.role === "admin") && (
                  <button onClick={() => remove(c._id)} aria-label="Delete comment" className="ml-auto text-mute hover:text-coral">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-bone/90">{c.text}</p>
            </div>
          </li>
        ))}
        {data && items.length === 0 && <li className="text-sm text-mute">No comments yet. Be the first to ask something.</li>}
      </ul>
    </section>
  );
}
