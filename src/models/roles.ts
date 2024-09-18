import { roles } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

export type NewRole = typeof roles.$inferInsert;
export type Role = typeof roles.$inferSelect;

export const listRoles = async () => {
    return (await db.query.roles.findMany());
};

export const getRole = async (id: bigint) => {
    return (await db.select().from(roles).where(eq(roles.id, id)))[0];
};

export const insertRole = async (role: NewRole) => {
    return (await db.insert(roles).values(role).returning())[0];
};

export const updateRole = async (role: Role) => {
    return (await db.update(roles).set(role).where(eq(roles.id, role.id)).returning())[0];
};

export const deleteRole = async (role: Role) => {
    return (await db.delete(roles).where(eq(roles.id, role.id)).returning())[0];
};