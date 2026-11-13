import { NavLink, Outlet } from "react-router-dom";
import { PageHead } from "../../components/AppLayout";

const tabs = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/curriculum", label: "Chapters & classes" },
  { to: "/admin/materials", label: "Materials" },
  { to: "/admin/students", label: "Students" },
];

export default function AdminLayout() {
  return (
    <>
      <PageHead eyebrow="Instructor studio" title="Manage your course" />
      <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `shrink-0 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                isActive ? "border-lime bg-lime text-ink-900" : "border-white/15 text-mute hover:border-lime/50 hover:text-lime"
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </>
  );
}
