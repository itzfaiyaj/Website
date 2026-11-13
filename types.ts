export type Role = "student" | "admin";
export type MaterialType = "note" | "mcq" | "slide" | "pdf" | "image";

export interface Me {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Lesson {
  _id: string;
  chapter: string;
  title: string;
  description: string;
  youtubeId: string;
  duration: string;
  order: number;
}

export interface Chapter {
  _id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  materialCount: number;
}

export interface McqQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface MaterialItem {
  _id: string;
  title: string;
  type: MaterialType;
  description: string;
  chapter?: { _id: string; title: string };
  lesson?: { _id: string; title: string };
  file?: { stored: string; original: string; mime: string; size: number };
  mcqCount?: number;
  createdAt: string;
}

export interface MaterialFull extends MaterialItem {
  body: string;
  mcq?: McqQuestion[];
}

export interface CommentItem {
  _id: string;
  userId: string;
  userName: string;
  isAdmin: boolean;
  text: string;
  createdAt: string;
}
