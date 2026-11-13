import { Search } from "lucide-react";
import { useState } from "react";
import { ErrorNote, Spinner } from "../../components/Guards";
import { fmtDate, useApi } from "../../lib/api";

interface Row {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function Students() {
  const { data, loading, error } = useApi<{ items: Row[] }>("/admin/students");
  const [q, setQ] = useState("");

  if (loading) return <Spinner />;
  if (error) return <ErrorNote message={error} />;

  const rows = (data?.items ?? []).filter((r) => `${r.name} ${r.email}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <>
      <div className="relative mb-5 max-w-md">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
        <input className="input pl-11" placeholder="Search by name or email…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="border-b border-white/10 font-mono text-[11px] uppercase tracking-widest text-mute">
              <tr>
                <th className="px-5 py-4 font-medium">Name</th>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Role</th>
                <th className="px-5 py-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-3.5 font-medium">{r.name}</td>
                  <td className="px-5 py-3.5 text-mute">{r.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${r.role === "admin" ? "bg-lime/15 text-lime" : "bg-aqua/10 text-aqua"}`}>{r.role}</span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-mute">{fmtDate(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <p className="p-8 text-center text-sm text-mute">No students found.</p>}
      </div>
    </>
  );
}
