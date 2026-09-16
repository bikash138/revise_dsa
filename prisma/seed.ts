import { loadEnvConfig } from "@next/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { z } from "zod";

import { PrismaClient } from "../src/generated/prisma/client";
import { PREDEFINED_PATTERNS } from "./seed-data/patterns";
import { PREDEFINED_PLATFORMS } from "./seed-data/platforms";
import { PREDEFINED_TOPICS } from "./seed-data/topics";

loadEnvConfig(process.cwd());

const databaseUrl = z
  .url()
  .refine(
    (value) =>
      value.startsWith("postgresql://") || value.startsWith("postgres://"),
  )
  .safeParse(process.env.DATABASE_URL);

if (!databaseUrl.success) {
  console.error("Database seed failed: DATABASE_URL is missing or invalid.");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: databaseUrl.data });
const prisma = new PrismaClient({ adapter });

async function main() {
  const [platforms, topics, patterns] = await Promise.all([
    prisma.platform.createMany({
      data: [...PREDEFINED_PLATFORMS],
      skipDuplicates: true,
    }),
    prisma.topic.createMany({
      data: PREDEFINED_TOPICS.map((name) => ({ name })),
      skipDuplicates: true,
    }),
    prisma.pattern.createMany({
      data: PREDEFINED_PATTERNS.map((name) => ({ name })),
      skipDuplicates: true,
    }),
  ]);

  console.log(
    `Created ${platforms.count} platforms, ${topics.count} topics, and ${patterns.count} patterns.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error("Database seed failed.");

    if (error instanceof Error) {
      console.error(`Reason: ${error.message}`);
    }

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
