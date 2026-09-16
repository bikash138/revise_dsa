# Revise DSA

A Next.js App Router project configured with TypeScript, Tailwind CSS, shadcn/ui, Prisma ORM, PostgreSQL, and Better Auth.

## Local setup

1. Copy `.env.example` to `.env.local` and set a real PostgreSQL connection string, a random Better Auth secret, and your Google OAuth client ID and client secret. This workspace already has ignored local environment files configured.

   Server environment variables are validated with Zod. The application fails during startup or build when a required value is missing, malformed, or still contains a documented placeholder.

2. Install dependencies. The postinstall script generates Prisma Client:

   ```bash
   pnpm install
   ```

3. Apply the checked-in Better Auth database migration:

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
