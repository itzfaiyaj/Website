# Future Tech Edu — HSC ICT learning platform

Members-only classroom: YouTube class videos organised by chapter, plus notes, MCQ sets, slides, PDFs and images, with comments on every class and material.

**Stack:** React 19 · TypeScript · Tailwind CSS 3 · Vite · Node · Express 5 · MongoDB · Mongoose · Better Auth

## Run it locally

You need Node 20+ and a MongoDB (local, or a free MongoDB Atlas cluster).

```bash
# 1. API
cd server
cp .env.example .env        # then edit: BETTER_AUTH_SECRET, MONGODB_URI, ADMIN_EMAIL
npm install
npm run dev                 # http://localhost:5000

# 2. Web app (second terminal)
cd client
npm install
npm run dev                 # http://localhost:5173  <- open this one
```

**Become the instructor:** register on the site using the exact email you put in `ADMIN_EMAIL`. That account automatically gets the admin role and a **Studio** tab. Everyone else is a student. Do this first after deploying, before anyone else can register that email.

The six HSC ICT chapters are created automatically on first start; rename or add more in *Studio → Chapters & classes*.

## Using the Studio

| Task | Where |
| --- | --- |
| Add a class video | Studio → Chapters & classes → *Add class video* (paste the YouTube link) |
| Upload notes / slides / PDF / image | Studio → Materials (pick type, chapter, optional class) |
| Create an MCQ set | Studio → Materials → type **MCQ** (questions, options, correct answer, explanation) |
| Delete any comment | Click the bin icon on it (instructors can delete all; students only their own) |
| See who registered | Studio → Students |

## Important: YouTube "Private" vs "Unlisted"

YouTube **Private** videos cannot play inside any website, even for logged-in invited viewers — the embed shows "Video unavailable". Upload your classes as **Unlisted**. Unlisted videos are not searchable or on your channel page; only people with the link can watch, and the link is only ever shown to signed-in students inside this site.

(Unlisted still means anyone who copies the link from the page could share it. If you need hard protection, you would need a paid video host with signed URLs.)

## Production

```bash
cd client && npm run build
cd ../server && npm run build
NODE_ENV=production node dist/index.js
```

Express serves the built React app from `client/dist`, so one process and one domain handle everything. Set `BETTER_AUTH_URL` and `CLIENT_URL` to your real https domain. Uploaded files are stored in `server/uploads` — back this folder up, and on hosts with ephemeral disks (Render/Heroku free tiers) mount a persistent volume or move uploads to S3/R2.

## Project layout

```
server/src
  auth.ts            Better Auth + MongoDB, role field, admin by ADMIN_EMAIL
  models.ts          Chapter, Lesson, Material, Comment, Progress
  routes/content.ts      curriculum, lessons, progress, chapter/lesson admin
  routes/materials.ts    library, protected file serving, uploads (multer)
  routes/community.ts    comments, admin stats, student list
client/src
  pages/             Landing, Auth, Dashboard, Classes, Lesson, Library, Material, admin/*
  components/        AppLayout (sidebar + mobile tab bar), Comments, McqPlayer, ...
  index.css, tailwind.config.js   the design system (palette, fonts, buttons, cards)
```

## Design notes

Palette: deep circuit-green `#08130F`, acid lime `#C8FF3E`, aqua `#35E8D4`, amber `#FFB224`, coral for errors — no purple, violet or pink. Fonts: **Unbounded** (wide display), **Instrument Sans** (body), **Martian Mono** (labels), with **Hind Siliguri** as the Bangla fallback. Change `src/config/site.ts` to set your name and brand.

## Security notes

- Files are never served from a public folder; `/api/files/*` requires a signed-in session.
- Role is set server-side and cannot be chosen at sign-up.
- Only PDF, image, PPT(X) and DOC(X) uploads are accepted (25 MB max); SVG is excluded on purpose.
- Auth and comment endpoints are rate-limited.
- Email verification and password reset are **not** enabled yet. Add an email provider and turn on Better Auth's `emailVerification` / `sendResetPassword` before a large public launch.
