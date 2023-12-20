import { relations } from "drizzle-orm";
import { datetime, mysqlTable, text, varchar } from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull(),
  createAt: datetime("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
});

export const userAccount = mysqlTable("user_account", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id),
  email: varchar("email", { length: 512 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
});

export const userAccountRelations = relations(userAccount, ({ one }) => ({
  user: one(user, {
    fields: [userAccount.userId],
    references: [user.id],
  }),
}));

export const userSession = mysqlTable("user_session", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id),
  expiresAt: datetime("expires_at"),
  createAt: datetime("created_at")
    .notNull()
    .$defaultFn(() => new Date()),
});

export const userSessionRelations = relations(userSession, ({ one }) => ({
  user: one(user, {
    fields: [userSession.userId],
    references: [user.id],
  }),
}));

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(userSession),
}));
