import {
    pgTable,
    bigserial,
    bigint,
    text,
    varchar,
    timestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable(
    "users",
    {
        id: bigserial("id", { mode: 'bigint' }).primaryKey(),
        email: varchar("email", { length: 255 }).notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    }
);

export const passkey = pgTable(
    "passkeys",
    {
        id: bigserial("id", { mode: 'bigint' }).primaryKey(),
        userId: bigint("user_id", { mode: 'bigint' }).references(() => users.id),
        name: varchar("name", { length: 255 }).notNull(),
        externalId: text("external_id").notNull().unique(),
        publicKey: text("public_key").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at").defaultNow().notNull(),
    }
);
