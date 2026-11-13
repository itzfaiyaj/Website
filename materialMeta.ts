import { FileText, Image as ImageIcon, ListChecks, Presentation, StickyNote, type LucideIcon } from "lucide-react";
import type { MaterialType } from "./types";

export const TYPE_META: Record<MaterialType, { label: string; plural: string; icon: LucideIcon; text: string; tint: string }> = {
  note: { label: "Note", plural: "Notes", icon: StickyNote, text: "text-amber", tint: "bg-amber/10 border-amber/30" },
  mcq: { label: "MCQ", plural: "MCQ sets", icon: ListChecks, text: "text-lime", tint: "bg-lime/10 border-lime/30" },
  slide: { label: "Slides", plural: "Slides", icon: Presentation, text: "text-aqua", tint: "bg-aqua/10 border-aqua/30" },
  pdf: { label: "PDF", plural: "PDFs", icon: FileText, text: "text-coral", tint: "bg-coral/10 border-coral/30" },
  image: { label: "Image", plural: "Images", icon: ImageIcon, text: "text-bone", tint: "bg-bone/10 border-bone/30" },
};

export const TYPE_ORDER: MaterialType[] = ["note", "mcq", "slide", "pdf", "image"];
