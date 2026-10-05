import { defineConfig } from "prisma/config";
import "dotenv/config";

const datasourceUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!datasourceUrl) {
  throw new Error(
    "Missing DATABASE_URL (or DIRECT_URL). Set it in Render → Environment.",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js",
  },
  datasource: {
    url: datasourceUrl,
  },
});
