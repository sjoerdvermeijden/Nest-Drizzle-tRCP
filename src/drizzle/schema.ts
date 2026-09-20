import { integer, serial, text, pgTable, uuid } from 'drizzle-orm/pg-core';
import { defineRelations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(), // auto-incrementing primary key field
  email: text('email').unique(),
  role_id: integer('role_id'),
});

export const user_role = pgTable('user_role', {
  id: serial('id').primaryKey(), // auto-incrementing primary key field
  name: text('name'),
});

export const usersRelations = defineRelations({ users, user_role }, (r) => ({
  users: {
    user_role: r.one.user_role({
      from: r.users.role_id,
      to: r.user_role.id,
    }),
  },
}));