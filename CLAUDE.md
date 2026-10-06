# CLAUDE.md — Nostalgia-Free Classics

## Project overview

**Nostalgia-Free Classics** is a video game review site that re-evaluates older games on their own merits today, without leaning on nostalgia. The site owner (admin) writes and publishes review articles through a WYSIWYG editor. Readers can browse and read reviews and leave comments, but cannot create or edit articles.

Tone of the site: honest, slightly irreverent, critical. Visual style: early-2000s web (think fan sites, GameFAQs-era portals, beveled buttons, pixel type, arcade screens) rendered as a modern, accessible dark UI.

## Tech stack

- **Framework:** Next.js (App Router, `app/` directory)
- **Language:** JavaScript only (`.js` / `.jsx`). **Do not use TypeScript** and do not add `.ts`/`.tsx` files or type annotations. Use JSDoc comments where types help readability.
- **Styling:** Tailwind CSS. Theme tokens live in `tailwind.config.js`; avoid hard-coded hex values in components.
- **Database / ORM:** Prisma with PostgreSQL (SQLite is fine for local dev via `DATABASE_URL`).
- **Auth:** Auth.js (NextAuth v5) with a role field on the user (`ADMIN` or `READER`).
- **WYSIWYG editor:** Tiptap (`@tiptap/react` + StarterKit, Image, Link extensions). Store content as Tiptap JSON; render to HTML on the server.
- **Sanitization:** Sanitize all rendered rich text and all comment input (e.g. `isomorphic-dompurify`).
- **Image uploads:** Store locally in `public/uploads` during development; keep the upload logic behind a single helper (`lib/storage.js`) so it can later swap to S3/Vercel Blob/Cloudinary.

When adding a dependency, prefer well-maintained, widely used packages and explain why it was added.

## Commands

```bash
npm run dev          # start dev server
npm run build        # production build
npm run lint         # ESLint
npx prisma migrate dev --name <name>   # create/apply a migration
npx prisma studio    # browse the database
npx prisma db seed   # seed admin user + sample articles
```

Run `npm run lint` and `npm run build` before considering a task done.

## Folder structure

```
app/
  layout.jsx               # global shell: sticky top nav header, main, footer
  page.jsx                 # home: latest reviews, top-scored, "random classic"
  reviews/
    page.jsx               # paginated list of all reviews (filter by score/platform)
    [slug]/page.jsx        # single review + comments
  admin/
    layout.jsx             # admin-only guard
    page.jsx               # dashboard: list of articles (drafts + published)
    new/page.jsx           # create article (Tiptap editor)
    [id]/edit/page.jsx     # edit article
  login/page.jsx
  api/
    auth/[...nextauth]/route.js
    upload/route.js        # admin-only image upload
components/
  ui/                      # retro-styled primitives (Button, Panel, Badge, etc.)
  editor/                  # Tiptap editor + toolbar
  reviews/                 # ReviewCard, ScoreBadge, ReviewMeta
  comments/                # CommentList, CommentForm
lib/
  prisma.js                # Prisma client singleton
  auth.js                  # Auth.js config + helpers (getSession, requireAdmin)
  storage.js               # image upload abstraction
  sanitize.js
  format.js                # date and score formatting
prisma/
  schema.prisma
  seed.js
```

Default to **Server Components**. Only add `"use client"` where interactivity requires it (editor, comment form, filters).

Use **Server Actions** for mutations (create/update/delete article, post/delete comment). Every server action must re-check authorization on the server; never trust the client.

## Data model

### Article (required fields from the owner)

| Field            | Type      | Notes                                                    |
|------------------|-----------|----------------------------------------------------------|
| title            | String    | Required                                                 |
| author           | Relation  | → User (the admin who wrote it)                          |
| datePosted       | DateTime  | Set when status first becomes `PUBLISHED`                |
| dateUpdated      | DateTime  | Auto-updated on every save (`@updatedAt`)                 |
| gameReleaseDate  | DateTime  | Original release date of the game                        |
| score            | Decimal   | 0–10, one decimal place allowed (e.g. 7.5). Validate on server |

### Article (supporting fields)

`id`, `slug` (unique, generated from title), `content` (Tiptap JSON), `excerpt`, `coverImage`, `gameTitle`, `platform`, `status` (`DRAFT` | `PUBLISHED`), `comments`.

### Suggested Prisma schema

```prisma
enum Role {
  ADMIN
  READER
}

enum ArticleStatus {
  DRAFT
  PUBLISHED
}

model User {
  id        String    @id @default(cuid())
  name      String?
  email     String    @unique
  image     String?
  role      Role      @default(READER)
  articles  Article[]
  comments  Comment[]
  createdAt DateTime  @default(now())
  // + Auth.js Account / Session relations
}

model Article {
  id              String        @id @default(cuid())
  title           String
  slug            String        @unique
  excerpt         String?
  content         Json
  coverImage      String?
  gameTitle       String
  platform        String?
  gameReleaseDate DateTime
  score           Decimal       @db.Decimal(3, 1)
  status          ArticleStatus @default(DRAFT)
  datePosted      DateTime?
  dateUpdated     DateTime      @updatedAt
  createdAt       DateTime      @default(now())
  authorId        String
  author          User          @relation(fields: [authorId], references: [id])
  comments        Comment[]
}

model Comment {
  id        String   @id @default(cuid())
  body      String
  createdAt DateTime @default(now())
  hidden    Boolean  @default(false)
  articleId String
  article   Article  @relation(fields: [articleId], references: [id], onDelete: Cascade)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
}
```

Note: if switching to SQLite for local dev, `@db.Decimal` is not supported; use `Float` and round to one decimal in `lib/format.js`.

## Roles and permissions

| Action                        | Guest | READER | ADMIN |
|-------------------------------|:-----:|:------:|:-----:|
| Read published reviews        | ✅    | ✅     | ✅    |
| Read comments                 | ✅    | ✅     | ✅    |
| Post a comment                | ❌    | ✅     | ✅    |
| Delete own comment            | ❌    | ✅     | ✅    |
| Create / edit / delete articles | ❌  | ❌     | ✅    |
| View drafts                   | ❌    | ❌     | ✅    |
| Hide / delete any comment     | ❌    | ❌     | ✅    |
| Upload images                 | ❌    | ❌     | ✅    |

Rules:
- Readers sign in (OAuth, e.g. Google/GitHub) only to comment. New users are always `READER`.
- Admin role is assigned via the seed script or directly in the DB, never through the UI.
- Protect `/admin/*` with a server-side check in `app/admin/layout.jsx` and in every admin server action/route handler (`requireAdmin()` from `lib/auth.js`). Middleware alone is not sufficient.
- Comments: plain text only (no HTML), max 2,000 characters, trimmed, sanitized. Add basic rate limiting (e.g. one comment per 30 seconds per user).

## Design system: early-2000s, purple + teal

The goal is "2003 fan site" charm with modern readability and accessibility. It should feel retro, not broken.

### Colour tokens (`tailwind.config.js`)

```js
colors: {
  grape: {   // primary purple
    50:  '#f5f0ff',
    100: '#e6d9ff',
    300: '#b48cff',
    500: '#7b3fe4',
    700: '#4f1fa3',
    900: '#2a0f5c',
  },
  teal: {    // primary teal
    50:  '#e8fffb',
    100: '#c2fff4',
    300: '#4fe3cf',
    500: '#14b8a6',
    700: '#0f766e',
    900: '#083d3a',
  },
  ink:   '#0b0820',   // near-black page background option
  paper: '#f4f1fa',   // light content panels
}
```

Purple is the dominant brand colour (page glow, cards, panel title bars). Teal is the accent (links, hover states, score highlights, buttons). Ensure text meets WCAG AA contrast.

### Visual vocabulary

- **Layout:** modern dark "arcade" shell. Sticky top bar (logo, primary nav, account; admin links appear for admins; disclosure menu on mobile) with a teal/purple stripe underneath. Centred `max-w-6xl` container (`.container-page`). No sidebars in the shell: highlights live on the home page (featured review hero, card grid, "HI-SCORES" leaderboard, random classic). Review pages use a hero header, a reading panel, and a sticky "At a glance" aside that stacks on mobile.
- **Surfaces:** ink-dark page with a faint purple grid and scanlines. Browsing UI sits on dark cards (`.surface`, `.card-interactive`). Long-form reading, comments and admin forms sit on light "window" panels (`.panel`) with a purple gradient title bar (`.title-bar`).
- **Cards:** 16:9 cover art (or the generated `TitleScreen` fallback: game name in pixel type over a starfield) with the score badge overlapping the cover's bottom edge. The whole card is clickable via the title link.
- **Filters:** link-based chips (`.chip`, active = `aria-current`), so filtering works without JavaScript.
- **Buttons:** beveled look using light top/left and dark bottom/right borders; pressed state inverts the bevel.
- **Typography:** Verdana / Tahoma / Trebuchet MS stack for body; a pixel or chunky display font for headings (e.g. "Press Start 2P" or "VT323" via `next/font/google`), used sparingly.
- **Details:** small pixel icons, dotted dividers, stripe-bar section rules, "NEW!" badges on recent reviews, 88×31-style badges in the footer, visitor-counter-style stat in the footer (decorative only), VT323 "eyebrow" labels, staggered fade-up reveals on cards.
- **Score badge:** large retro numeral in a teal box with a glow; colour shifts by score range.
- **Avoid:** actual `<marquee>`/`<blink>` tags, auto-playing audio, layout tables, or anything that hurts accessibility. Fake the vibe with CSS.
- Respect `prefers-reduced-motion` for any animation.

Put reusable retro styles in `components/ui/` and/or `@layer components` in `globals.css` (e.g. `.panel`, `.btn-bevel`, `.title-bar`) rather than repeating long class strings.

## Admin editor requirements

- Tiptap editor with toolbar: headings (H2/H3), bold, italic, underline, links, bullet/numbered lists, blockquote, image upload, horizontal rule.
- Form fields alongside the editor for: title, game title, platform, game release date (date input), score (number input, step 0.5 or 0.1, min 0, max 10), excerpt, cover image.
- Slug auto-generated from title, editable before first publish.
- "Save Draft" and "Publish" buttons. Publishing sets `datePosted` if it isn't set; later edits only change `dateUpdated`.
- Preview mode that renders the article exactly as readers will see it.
- Warn before leaving the page with unsaved changes.

## Review page requirements

- Show: title, author, date posted, "Updated on" (only if meaningfully different from date posted), game title, platform, game release date, score badge, cover image, content, comments.
- Generate metadata (`generateMetadata`) with title, description from excerpt, and Open Graph image from the cover.
- Use `generateStaticParams` + revalidation (`revalidatePath`) after publish/edit so pages are fast but stay current.

## Coding conventions

- Functional components, named exports for components except Next.js route files (which use default exports).
- Component files in PascalCase (`ReviewCard.jsx`); utilities in camelCase.
- Keep components small; extract anything reused twice.
- Validate all form input on the server (e.g. with `zod`) even if also validated on the client.
- Dates: store in UTC, format for display with `Intl.DateTimeFormat` in `lib/format.js`.
- No secrets in client code. Environment variables go in `.env.local`; keep `.env.example` up to date.
- Accessibility: semantic HTML, labelled inputs, visible focus states (teal outline), alt text required for article images.

## Environment variables (`.env.example`)

```
DATABASE_URL=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
ADMIN_EMAIL=          # used by seed script to create the admin user
```

## Build order (suggested)

1. Scaffold Next.js (JS, App Router, Tailwind, ESLint) and set up Tailwind theme tokens + fonts.
2. Build the retro layout shell and `components/ui` primitives.
3. Prisma schema, migration, seed script with admin user and 3 sample reviews.
4. Public pages: home, reviews list, review detail (read-only).
5. Auth.js with roles; admin guard.
6. Admin dashboard and Tiptap editor; create/edit/publish flow; image upload.
7. Comments (post, delete own, admin hide/delete, rate limiting).
8. SEO metadata, sitemap, RSS feed, polish.

## Things to ask before doing

- Before changing the data schema beyond what's listed above.
- Before adding a new third-party service (hosting, storage, analytics, email).
- Before introducing TypeScript, a component library, or a different CSS approach.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
