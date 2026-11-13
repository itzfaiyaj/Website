import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useMe } from "../lib/auth";

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-24 font-mono text-xs uppercase tracking-[0.2em] text-mute">
      <Loader2 className="h-4 w-4 animate-spin text-lime" /> {label}…
    </div>
  );
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { me, loading } = useMe();
  const loc = useLocation();
  if (loading) return <Spinner />;
  if (!me) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { me, loading } = useMe();
  if (loading) return <Spinner />;
  if (me?.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export function ErrorNote({ message }: { message: string }) {
  return <p className="rounded-xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral">{message}</p>;
}

export function Empty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/15 px-6 py-14 text-center">
      <p className="font-display text-base font-bold">{title}</p>
      {hint && <p className="mx-auto mt-2 max-w-md text-sm text-mute">{hint}</p>}
    </div>
  );
}
