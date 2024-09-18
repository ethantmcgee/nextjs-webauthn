import { twoFactors } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";

export type NewTwoFactor = typeof twoFactors.$inferInsert;
export type TwoFactor = typeof twoFactors.$inferSelect;

export const listTwoFactors = async () => {
    return (await db.query.twoFactors.findMany());
};

export const getTwoFactor = async (id: bigint) => {
    return (await db.select().from(twoFactors).where(eq(twoFactors.id, id)))[0];
};

export const getTwoFactorByPassKeyExternalId = async (externalId: string) => {
    return (await db.select().from(twoFactors).where(eq(twoFactors.passKeyExternalId, externalId)))[0];
};

export const insertTwoFactor = async (twoFactor: NewTwoFactor) => {
    return (await db.insert(twoFactors).values(twoFactor).returning())[0];
};

export const updateTwoFactor = async (twoFactor: TwoFactor) => {
    return (await db.update(twoFactors).set(twoFactor).where(eq(twoFactors.id, twoFactor.id)).returning())[0];
};

export const deleteTwoFactor = async (twoFactor: TwoFactor) => {
    return (await db.delete(twoFactors).where(eq(twoFactors.id, twoFactor.id)).returning())[0];
};