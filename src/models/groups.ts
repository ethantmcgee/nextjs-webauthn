import { groups } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

export type NewGroup = typeof groups.$inferInsert;
export type Group = typeof groups.$inferSelect;

export const listGroups = async () => {
    return (await db.query.groups.findMany());
};

export const getGroup = async (id: bigint) => {
    return (await db.select().from(groups).where(eq(groups.id, id)))[0];
};

export const insertGroup = async (group: NewGroup) => {
    return (await db.insert(groups).values(group).returning())[0];
};

export const updateGroup = async (group: Group) => {
    return (await db.update(groups).set(group).where(eq(groups.id, group.id)).returning())[0];
};

export const deleteGroup = async (group: Group) => {
    return (await db.delete(groups).where(eq(groups.id, group.id)).returning())[0];
};