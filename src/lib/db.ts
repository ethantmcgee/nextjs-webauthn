import "@/lib/config";
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { users } from "./schema";
import * as schema from "./schema";

// for migrations
const migrationClient = postgres(process.env.POSTGRES_URL!, { max: 1 });

// for query purposes
const queryClient = postgres(process.env.POSTGRES_URL!);
export const db = drizzle(queryClient, { schema });

export type NewUser = typeof users.$inferInsert;

export const insertUser = async (user: NewUser) => {
    return db.insert(users).values(user).returning();
};

export const getUsers = async () => {
    return (await db.query.users.findMany());
};
