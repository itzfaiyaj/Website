import { Film, Layers, MessageSquare, Paperclip, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Spinner } from "../../components/Guards";
import { useApi } from "../../lib/api";

interface Stats {
  students: number;
  chapters: number;
  lessons: number;
  materials: number;
  comments: number;
}

export default function Overview() {
  const { data, loading } = useApi<Stats>("/admin/stats");
  if (loading || !data) return <Spinner />;

  const cards = [
    { label: "Students", value: data.students, icon: Users, color: "text-aqua" },
    { label: "Chapters", value: data.chapters, icon: Layers, color: "text-lime" },
    { label: "Classes", value: data.lessons, icon: Film, color: "text-amber" },
    { label: "Materials", value: data.materials, icon: Paperclip, color: "text-aqua" },
    { label: "Comments", value: data.comments, icon: MessageSquare, color: "text-lime" },
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <c.icon className={`h-5 w-5 ${c.color}`} />
            <p className="mt-4 font-display text-4xl font-black">{c.value}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link to="/admin/curriculum" className="card-hover p-6">
          <p className="font-display text-lg font-bold">Upload a class video</p>
          <p className="mt-2 text-sm text-mute">Add a YouTube link to any chapter. Use “Unlisted” visibility so it can play inside the website.</p>
        </Link>
        <Link to="/admin/materials" className="card-hover p-6">
          <p className="font-display text-lg font-bold">Add notes, MCQs, slides, PDFs</p>
          <p className="mt-2 text-sm text-mute">Attach materials to a chapter, or to a specific class.</p>
        </Link>
      </div>
    </>
  );
}
