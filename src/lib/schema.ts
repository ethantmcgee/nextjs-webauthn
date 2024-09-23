import {
    pgTable,
    pgEnum,
    bigserial,
    bigint,
    text,
    varchar,
    timestamp,
    jsonb,
    unique,
    primaryKey, boolean,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable(
    'users',
    {
        id: bigserial('id', { mode: 'bigint' }).primaryKey(),
        email: varchar('email', { length: 255 }).notNull().unique(),
        password: varchar('password', { length: 255 }).notNull().unique(),
        salt: varchar('salt', { length: 255 }).notNull().unique(),
        lastSignIn: timestamp('last_sign_in').defaultNow().notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().notNull(),
    }
);

export const usersRelations = relations(users, ({ many }) => ({
    twoFactors: many(twoFactors),
    groups: many(groups),
    roles: many(roles),
    permissions: many(permissions),
    employers: many(employers),
}));

export const twoFactorType = pgEnum('twoFactorType', ['totp', 'phone', 'email', 'passkey']);

export const twoFactors = pgTable(
    'two_factors',
    {
        id: bigserial('id', { mode: 'bigint' }).primaryKey(),
        userId: bigint('user_id', { mode: 'bigint' }).references(() => users.id),
        name: varchar('name', { length: 255 }).notNull(),
        type: twoFactorType('type').notNull(),
        // totp two factor
        totpSecret: varchar('totp_secret', { length: 50 }).unique(),
        // phone two factor
        phone: varchar('phone', { length: 50 }),
        // email two factor
        email: varchar('email', { length: 255 }),
        // passkey two factor
        passKeyExternalId: text('pass_key_external_id').notNull().unique(),
        passKeyPublicKey: jsonb('pass_key_public_key').notNull().unique(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at').defaultNow().notNull(),
    },
    (t) => ({
        unq: unique().on(t.userId, t.name),
    })
);

export const twoFactorRelations = relations(twoFactors, ({ one }) => ({
    user: one(users, {
        fields: [twoFactors.userId],
        references: [users.id],
    }),
}));

export const groups = pgTable(
    'groups',
    {
        id: bigserial('id', {mode: 'bigint'}).primaryKey(),
        name: varchar('name', { length: 255 }).notNull().unique(),
        requiresTwoFactor: boolean('requires_two_factor').default(false),
        requiresPasskeyTwoFactor: boolean('requires_passkey_two_factor').default(false),
    }
);

export const groupRelations = relations(groups, ({ many }) => ({
    users: many(users),
    roles: many(roles),
    permissions: many(permissions),
    employers: many(employers),
}));

export const roles = pgTable(
    'roles',
    {
        id: bigserial('id', {mode: 'bigint'}).primaryKey(),
        name: varchar('name', { length: 255 }).notNull().unique(),
        requiresTwoFactor: boolean('requires_two_factor').default(false),
        requiresPasskeyTwoFactor: boolean('requires_passkey_two_factor').default(false),
    }
);

export const roleRelations = relations(roles, ({ many }) => ({
    users: many(users),
    groups: many(groups),
    permissions: many(permissions),
}));

export const permissions = pgTable(
    'permissions',
    {
        id: bigserial('id', {mode: 'bigint'}).primaryKey(),
        name: varchar('name', { length: 255 }).notNull().unique(),
        requiresTwoFactor: boolean('requires_two_factor').default(false),
        requiresPasskeyTwoFactor: boolean('requires_passkey_two_factor').default(false),
    }
);

export const permissionRelations = relations(permissions, ({ many }) => ({
    users: many(users),
    groups: many(groups),
    roles: many(roles),
}));

export const employers = pgTable(
    'employers',
    {
        id: bigserial('id', {mode: 'bigint'}).primaryKey(),
        name: varchar('name', { length: 255 }).notNull().unique(),
        requiresTwoFactor: boolean('requires_two_factor').default(false),
        requiresPasskeyTwoFactor: boolean('requires_passkey_two_factor').default(false),
    }
);

export const employerRelations = relations(permissions, ({ many }) => ({
    users: many(users),
}));

export const userGroups = pgTable(
    'user_groups',
    {
        userId: bigint('user_id', { mode: 'bigint' }).notNull().references(() => users.id),
        groupId: bigint('group_id', { mode: 'bigint' }).notNull().references(() => groups.id),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.userId, t.groupId] }),
    }),
);

export const userGroupRelations = relations(userGroups, ({ one }) => ({
    user: one(users, {
        fields: [userGroups.userId],
        references: [users.id],
    }),
    group: one(groups, {
        fields: [userGroups.groupId],
        references: [groups.id],
    }),
}));

export const userRoles = pgTable(
    'user_roles',
    {
        userId: bigint('user_id', { mode: 'bigint' }).notNull().references(() => users.id),
        roleId: bigint('role_id', { mode: 'bigint' }).notNull().references(() => roles.id),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.userId, t.roleId] }),
    }),
);

export const userRoleRelations = relations(userRoles, ({ one }) => ({
    user: one(users, {
        fields: [userRoles.userId],
        references: [users.id],
    }),
    role: one(roles, {
        fields: [userRoles.roleId],
        references: [roles.id],
    }),
}));

export const userPermissions = pgTable(
    'user_permissions',
    {
        userId: bigint('user_id', { mode: 'bigint' }).notNull().references(() => users.id),
        permissionId: bigint('permission_id', { mode: 'bigint' }).notNull().references(() => permissions.id),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.userId, t.permissionId] }),
    }),
);

export const userPermissionRelations = relations(userPermissions, ({ one }) => ({
    user: one(users, {
        fields: [userPermissions.userId],
        references: [users.id],
    }),
    permission: one(permissions, {
        fields: [userPermissions.permissionId],
        references: [permissions.id],
    }),
}));

export const groupRoles = pgTable(
    'group_roles',
    {
        groupId: bigint('group_id', { mode: 'bigint' }).notNull().references(() => groups.id),
        roleId: bigint('role_id', { mode: 'bigint' }).notNull().references(() => roles.id),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.groupId, t.roleId] }),
    }),
);

export const groupRoleRelations = relations(groupRoles, ({ one }) => ({
    group: one(groups, {
        fields: [groupRoles.groupId],
        references: [groups.id],
    }),
    role: one(roles, {
        fields: [groupRoles.roleId],
        references: [roles.id],
    }),
}));

export const groupPermissions = pgTable(
    'group_permissions',
    {
        groupId: bigint('group_id', { mode: 'bigint' }).notNull().references(() => groups.id),
        permissionId: bigint('permission_id', { mode: 'bigint' }).notNull().references(() => permissions.id),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.groupId, t.permissionId] }),
    }),
);

export const groupPermissionRelations = relations(groupPermissions, ({ one }) => ({
    group: one(groups, {
        fields: [groupPermissions.groupId],
        references: [groups.id],
    }),
    permission: one(permissions, {
        fields: [groupPermissions.permissionId],
        references: [permissions.id],
    }),
}));

export const rolePermissions = pgTable(
    'role_permissions',
    {
        roleId: bigint('role_id', { mode: 'bigint' }).notNull().references(() => roles.id),
        permissionId: bigint('permission_id', { mode: 'bigint' }).notNull().references(() => permissions.id),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.roleId, t.permissionId] }),
    }),
);

export const rolePermissionRelations = relations(rolePermissions, ({ one }) => ({
    role: one(roles, {
        fields: [rolePermissions.roleId],
        references: [roles.id],
    }),
    permission: one(permissions, {
        fields: [rolePermissions.permissionId],
        references: [permissions.id],
    }),
}));

export const userEmployers = pgTable(
    'user_employers',
    {
        userId: bigint('user_id', { mode: 'bigint' }).notNull().references(() => users.id),
        employerId: bigint('employer_id', { mode: 'bigint' }).notNull().references(() => employers.id),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.userId, t.employerId] }),
    }),
);

export const userEmployerRelations = relations(userEmployers, ({ one }) => ({
    user: one(users, {
        fields: [userEmployers.userId],
        references: [users.id],
    }),
    employer: one(employers, {
        fields: [userEmployers.employerId],
        references: [employers.id],
    }),
}));

export const groupEmployers = pgTable(
    'group_employers',
    {
        groupId: bigint('user_group_id', { mode: 'bigint' }).notNull().references(() => groups.id),
        employerId: bigint('employer_id', { mode: 'bigint' }).notNull().references(() => employers.id),
    },
    (t) => ({
        pk: primaryKey({ columns: [t.groupId, t.employerId] }),
    }),
);

export const groupEmployerRelations = relations(groupEmployers, ({ one }) => ({
    group: one(groups, {
        fields: [groupEmployers.groupId],
        references: [groups.id],
    }),
    employer: one(employers, {
        fields: [groupEmployers.employerId],
        references: [employers.id],
    }),
}));