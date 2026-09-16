import { loadEnvConfig } from "@next/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { z } from "zod";

import { PrismaClient } from "../src/generated/prisma/client";

loadEnvConfig(process.cwd());

const databaseUrl = z
  .url()
  .refine(
    (value) =>
      value.startsWith("postgresql://") || value.startsWith("postgres://"),
  )
  .safeParse(process.env.DATABASE_URL);

if (!databaseUrl.success) {
  console.error("Database check failed: DATABASE_URL is missing or invalid.");
  process.exit(1);
}

const adapter = new PrismaPg({
  connectionString: databaseUrl.data,
  connectionTimeoutMillis: 10_000,
});

const prisma = new PrismaClient({ adapter });

async function checkDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database check passed.");
  } catch (error) {
    console.error("Database check failed: unable to execute a test query.");

    if (error instanceof Error) {
      console.error(`Reason: ${error.message}`);
    }

    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

void checkDatabase();
