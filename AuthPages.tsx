import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ErrorNote } from "../components/Guards";
import { Logo } from "../components/Logo";
import { SITE } from "../config/site";
import { authClient, useMe } from "../lib/auth";

function Shell({ mode, children }: { mode: "login" | "register"; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Logo />
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-mute hover:text-lime">
            <ArrowLeft className="h-3.5 w-3.5" /> Home
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <p className="eyebrow">{mode === "login" ? "Welcome back" : "Join the classroom"}</p>
          <h1 className="h-display mt-3 text-3xl sm:text-4xl">
            {mode === "login" ? "Sign in to keep learning." : "Create your student account."}
          </h1>
          <div className="mt-8">{children}</div>
        </div>
      </div>

      {/* decorative panel */}
      <div className="relative hidden overflow-hidden border-l border-white/10 bg-ink-950 lg:block">
        <div className="grid-bg absolute inset-0" />
        <div className="absolute -right-24 top-10 h-96 w-96 rounded-full bg-aqua/20 blur-[100px]" />
        <div className="absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-lime/10 blur-[100px]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-mute">{SITE.course} · Full course</p>
          <div>
            <p className="font-display text-[7rem] font-black leading-none text-lime/90">1011</p>
            <p className="mt-2 font-mono text-sm text-aqua">= 8 + 0 + 2 + 1 = 11</p>
            <p className="h-display mt-10 max-w-sm text-3xl">Every chapter. Every class. One members-only classroom.</p>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute">{SITE.name}</p>
        </div>
      </div>
    </div>
  );
}

function PasswordField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        className="input pr-12"
        type={show ? "text" : "password"}
        required
        minLength={8}
        autoComplete="current-password"
        placeholder="At least 8 characters"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label="Toggle password" className="absolute right-3 top-1/2 -translate-y-1/2 text-mute hover:text-lime">
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function Login() {
  const { me } = useMe();
  const navigate = useNavigate();
  const loc = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (me) return <Navigate to="/dashboard" replace />;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await authClient.signIn.email({ email, password });
    setBusy(false);
    if (error) return setError(error.message ?? "Could not sign in");
    navigate((loc.state as { from?: string } | null)?.from ?? "/dashboard", { replace: true });
  }

  return (
    <Shell mode="login">
      <form onSubmit={submit} className="space-y-5">
        {error && <ErrorNote message={error} />}
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">Password</label>
          <PasswordField value={password} onChange={setPassword} />
        </div>
        <button className="btn-primary w-full" disabled={busy}>
          {busy ? "Signing in…" : "Sign in"} <ArrowRight className="h-4 w-4" />
        </button>
        <p className="text-center text-sm text-mute">
          New here?{" "}
          <Link to="/register" className="font-semibold text-lime hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </Shell>
  );
}

export function Register() {
  const { me } = useMe();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (me) return <Navigate to="/dashboard" replace />;

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await authClient.signUp.email({ name: name.trim(), email, password });
    setBusy(false);
    if (error) return setError(error.message ?? "Could not create the account");
    navigate("/dashboard", { replace: true });
  }

  return (
    <Shell mode="register">
      <form onSubmit={submit} className="space-y-5">
        {error && <ErrorNote message={error} />}
        <div>
          <label className="label">Full name</label>
          <input className="input" required minLength={2} autoComplete="name" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" required autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="label">Password</label>
          <PasswordField value={password} onChange={setPassword} />
        </div>
        <button className="btn-primary w-full" disabled={busy}>
          {busy ? "Creating…" : "Create account"} <ArrowRight className="h-4 w-4" />
        </button>
        <p className="text-center text-sm text-mute">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-lime hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </Shell>
  );
}
