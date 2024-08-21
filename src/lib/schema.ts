import {
    pgTable,
    serial,
    text,
    timestamp,
    uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable(
    "users",
    {
        id: serial("id").primaryKey(),
        email: text("email").notNull(),
        createdAt: timestamp("createdAt").defaultNow().notNull(),
        updatedAt: timestamp("updatedAt").defaultNow().notNull(),
    },
    (users) => {
        return {
            uniqueIdx: uniqueIndex("unique_email_idx").on(users.email),
        };
    }
);
