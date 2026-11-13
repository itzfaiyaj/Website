import { BookOpenCheck, LayoutDashboard, Library, LogOut, ShieldCheck, Video } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { authClient, useMe } from "../lib/auth";
import { Logo } from "./Logo";

export default function AppLayout() {
  const { me } = useMe();
  const navigate = useNavigate();
  const isAdmin = me?.role === "admin";

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/classes", label: "Classes", icon: Video },
    { to: "/library", label: "Library", icon: Library },
    ...(isAdmin ? [{ to: "/admin", label: "Studio", icon: ShieldCheck }] : []),
  ];

  async function signOut() {
    await authClient.signOut();
    navigate("/");
  }

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive ? "bg-lime text-ink-900 shadow-[3px_3px_0_0_#35E8D4]" : "text-mute hover:bg-white/5 hover:text-bone"
    }`;

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-white/10 bg-ink-950/80 p-5 backdrop-blur lg:flex">
        <Link to="/dashboard" className="mb-8 mt-1">
          <Logo />
        </Link>
        <nav className="flex flex-col gap-1.5">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === "/dashboard"} className={linkCls}>
              <l.icon className="h-[18px] w-[18px]" /> {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl border border-white/10 bg-ink-800/70 p-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-aqua font-display text-sm font-bold text-ink-900">
              {me?.name?.[0]?.toUpperCase() ?? "?"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{me?.name}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-mute">{isAdmin ? "Instructor" : "Student"}</p>
            </div>
          </div>
          <button onClick={signOut} className="btn-ghost btn-sm mt-4 w-full">
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-ink-950/85 px-4 py-3 backdrop-blur lg:hidden">
        <Link to="/dashboard">
          <Logo />
        </Link>
        <button onClick={signOut} aria-label="Sign out" className="btn-ghost btn-sm !px-3">
          <LogOut className="h-4 w-4" />
        </button>
      </header>

      <main className="px-4 pb-28 pt-6 sm:px-6 lg:pl-[17rem] lg:pr-8 lg:pb-12 lg:pt-8">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-3 bottom-3 z-30 flex justify-around rounded-2xl border border-white/10 bg-ink-950/90 p-1.5 shadow-[0_10px_40px_rgba(0,0,0,.5)] backdrop-blur lg:hidden">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/dashboard"}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-semibold uppercase tracking-wider transition ${
                isActive ? "bg-lime text-ink-900" : "text-mute"
              }`
            }
          >
            <l.icon className="h-5 w-5" /> {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function PageHead({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="eyebrow flex items-center gap-2">
          <BookOpenCheck className="h-3.5 w-3.5" /> {eyebrow}
        </p>
        <h1 className="h-display mt-3 text-2xl sm:text-4xl">{title}</h1>
      </div>
      {children}
    </div>
  );
}
