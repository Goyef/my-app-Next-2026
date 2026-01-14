import path from "path";
import dotenv from "dotenv";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// Load .env files (root `.env.local` first, then `lib/.env`) so DATABASE_URL is available at runtime
const rootEnv = path.resolve(process.cwd(), ".env.local");
const libEnv = path.resolve(process.cwd(), "lib/.env");
dotenv.config({ path: rootEnv });
dotenv.config({ path: libEnv });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let connectionString = process.env.DATABASE_URL;

// Remove surrounding quotes if present (single or double)
if (connectionString) {
  connectionString = connectionString.replace(/^['"]|['"]$/g, "");
}

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;