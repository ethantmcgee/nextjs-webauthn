import "@/lib/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/lib/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        connectionString: process.env.POSTGRES_URL!,
    },
    verbose: true,
    strict: true,
});