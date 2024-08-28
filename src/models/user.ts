import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const listUsers = async () => {
    return (await db.query.users.findMany());
};

export const getUser = async (id: number) => {
    return db.select().from(users).where(eq(users.id, id));
};

export const insertUser = async (user: NewUser) => {
    return db.insert(users).values(user).returning();
};

export const updateUser = async (user: User) => {
    return db.update(users).set(user).where(eq(users.id, user.id)).returning();
};

export const deleteUser = async (user: User) => {
    return db.delete(users).where(eq(users.id, user.id)).returning();
};