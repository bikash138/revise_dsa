import { CheckCircle2 } from "lucide-react";

import { SignInWithGoogle } from "@/components/sign-in-with-google";

const tools = [
  "Next.js 16 App Router",
  "shadcn/ui with Tailwind CSS",
  "Prisma ORM with PostgreSQL",
  "Better Auth with Google OAuth",
];

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-6 py-16">
      <section className="w-full max-w-2xl rounded-3xl border bg-card p-8 text-card-foreground shadow-sm sm:p-12">
        <div className="mb-8 space-y-3">
          <p className="text-sm font-medium text-muted-foreground">Revise DSA</p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Your full-stack starter is ready.
          </h1>
          <p className="max-w-xl text-muted-foreground">
            The application is configured with a modern UI layer, database ORM,
            and authentication foundation.
          </p>
        </div>

        <ul className="mb-8 grid gap-3 sm:grid-cols-2">
          {tools.map((tool) => (
            <li key={tool} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="size-4 text-emerald-600" />
              {tool}
            </li>
          ))}
        </ul>

        <SignInWithGoogle />
      </section>
    </main>
  );
}
