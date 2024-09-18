import { permissions } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

export type NewPermission = typeof permissions.$inferInsert;
export type Permission = typeof permissions.$inferSelect;

export const listPermissions = async () => {
    return (await db.query.permissions.findMany());
};

export const getPermission = async (id: bigint) => {
    return (await db.select().from(permissions).where(eq(permissions.id, id)))[0];
};

export const insertPermission = async (permission: NewPermission) => {
    return (await db.insert(permissions).values(permission).returning())[0];
};

export const updatePermission = async (permission: Permission) => {
    return (await db.update(permissions).set(permission).where(eq(permissions.id, permission.id)).returning())[0];
};

export const deletePermission = async (permission: Permission) => {
    return (await db.delete(permissions).where(eq(permissions.id, permission.id)).returning())[0];
};