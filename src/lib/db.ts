import "@/lib/config";
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from "./schema";

// for query purposes
const queryClient = postgres(process.env.POSTGRES_URL!);
export const db = drizzle(queryClient, { schema });


