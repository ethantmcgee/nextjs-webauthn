import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const listUsers = async () => {
    return (await db.query.users.findMany());
};

export const getUser = async (id: bigint) => {
    return (await db.select().from(users).where(eq(users.id, id)))[0];
};

export const insertUser = async (user: NewUser) => {
    return (await db.insert(users).values(user).returning())[0];
};

export const updateUser = async (user: User) => {
    return (await db.update(users).set(user).where(eq(users.id, user.id)).returning())[0];
};

export const deleteUser = async (user: User) => {
    return (await db.delete(users).where(eq(users.id, user.id)).returning())[0];
};