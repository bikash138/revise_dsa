# Revise DSA

A personal DSA practice tracker that schedules question revisions after 3, 5,
7, 15, and 30 days and records the result, mistakes, and confidence after each
attempt. It uses Next.js App Router, TypeScript, shadcn/ui, Prisma, PostgreSQL,
and Google authentication through Better Auth.

## Local setup

1. Copy `.env.example` to `.env.local` and set a real PostgreSQL connection string, a random Better Auth secret, and your Google OAuth client ID and client secret. This workspace already has ignored local environment files configured.

   Server environment variables are validated with Zod. The application fails during startup or build when a required value is missing, malformed, or still contains a documented placeholder.

2. Install dependencies. The postinstall script generates Prisma Client:

   ```bash
   pnpm install
   ```

3. Apply all checked-in database migrations:

   ```bash
   pnpm db:migrate
   ```

4. Seed the predefined platforms, topics, and patterns:

   ```bash
   pnpm db:seed
   ```

   Platforms, topics, and patterns are global predefined data and do not depend
   on an application user existing first.

5. Start the development server:

   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Useful commands

```bash
pnpm lint          # Run ESLint
pnpm build         # Create a production build
pnpm db:check      # Verify PostgreSQL connectivity with a test query
pnpm db:generate   # Regenerate Prisma Client
pnpm db:migrate    # Apply/create development migrations
pnpm db:deploy     # Apply pending migrations in production
pnpm db:seed       # Insert predefined platforms, topics, and patterns
pnpm db:studio     # Open Prisma Studio
```

The predefined values live in `prisma/seed-data`. Add a platform, topic, or
pattern to its corresponding file and rerun `pnpm db:seed`. The seed is safe to
rerun and skips data that already exists.

Better Auth is mounted at `/api/auth/*` and configured for Google sign-in only. The browser client is exported from `src/lib/auth-client.ts`.

In Google Cloud Console, create an OAuth client for a web application and add this local authorized redirect URI:

```text
http://localhost:3000/api/auth/callback/google
```

For production, add `https://your-domain.com/api/auth/callback/google` and set `BETTER_AUTH_URL` to the same production origin.

## Server-side application layer

Mutations are grouped by domain under `src/actions/questions` and
`src/actions/revision`. Each domain contains:

- `*.validation.ts` for its Zod input schemas.
- `*.repo.ts` for Prisma database calls only.
- `*.actions.ts` for exported async Server Actions containing authentication,
  validation, and business logic. Each repository instance remains private to
  its action module.

Question actions create, update, archive, restore, and delete questions.
Revision actions complete, edit, and reopen revision attempts.

- `src/lib/dsa` contains the fixed revision schedule and confidence rules.
- `src/queries` contains server-only reads for the dashboard, question list,
  question details, and form options.

The global platform, topic, and pattern options use the Next.js `use cache`
directive with the built-in `hours` cache profile. Authentication runs before
entering the cached function, so session headers are never included in the
shared cache. The first request reads the options from PostgreSQL; subsequent
requests can reuse the cached result until Next.js revalidates it.

Every action validates its input, derives the user ID from the Better Auth
session, and checks ownership in the database. Client-provided user IDs are
never accepted. Question mutations rely on PostgreSQL foreign keys to validate
platform, topic, and pattern IDs instead of issuing three preliminary lookup
queries.

Creating a question also creates five revision records scheduled 3, 5, 7, 15,
and 30 days after `firstSolvedOn`. Revision dates and the dashboard's current
day are calculated using the `Asia/Kolkata` timezone. Confidence starts at
`NEW` and is recalculated whenever a revision is completed, edited, or reopened:

- Latest result `COULD_NOT_SOLVE`: `NEEDS_PRACTICE`
- Two latest results `SOLVED_INDEPENDENTLY`: `STRONG`
- Any other completed progress: `IMPROVING`
- No completed revisions: `NEW`

Server Actions accept plain serializable objects and return a shared
`ActionResult<T>` shape with either `data` or a safe error message and optional
field errors. The `runServerAction` utility performs Zod parsing, formats
validation errors, catches expected and unexpected failures, maps Prisma
errors, and constructs the final result shape. Action files therefore contain
only their domain workflow. Reads remain normal server-only functions rather
than Server Actions.

## Frontend application

Authenticated pages live under `/dashboard` and share one responsive navigation
layout. The current routes are:

- `/dashboard` for progress totals, due revisions, and recently added questions.
- `/dashboard/questions` for searching and filtering active or archived questions.
- `/dashboard/questions/new` for adding a question and its five revision dates.
- `/dashboard/questions/[questionId]` for question details and revision attempts.
- `/dashboard/questions/[questionId]/edit` for updating question metadata.
- `/dashboard/revisions` for due, upcoming, and completed revision queues.

App Router pages load authenticated data directly through the server-only read
functions in `src/queries`; no application-data Route Handlers or client query
cache are used. Interactive components call the validated Server Actions
directly. React transition state provides button loaders and inline action
errors, while route-level `loading.tsx` files provide navigation skeletons.
Successful mutations revalidate the dashboard, question, and revision paths and
refresh the current Server Component tree.

The only API Route Handler is Better Auth's required `/api/auth/*` endpoint.
Sign-out uses a confirmation Alert Dialog and a Server Action. Better Auth's
`nextCookies` integration forwards the cleared session cookie from that action.
