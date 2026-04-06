import { pgTable, uuid, text, numeric, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const transactionTypeEnum = pgEnum('transaction_type', ['income', 'expense']);

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: transactionTypeEnum('type').notNull(),
  icon: text('icon'),
  userId: uuid('user_id').notNull(), // Sẽ liên kết với auth.users của Supabase
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().notNull(), // Liên kết với auth.users.id
  email: text('email').notNull(),
  fullName: text('full_name'),
  phone: text('phone'),
  birthday: text('birthday'),
  address: text('address'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  phone: text('phone'),
  email: text('email'),
  userId: uuid('user_id').notNull(), // Liên kết với auth.users
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  type: transactionTypeEnum('type').notNull(),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade' }),
  contactId: uuid('contact_id').references(() => contacts.id, { onDelete: 'set null' }),
  note: text('note'),
  date: timestamp('date').defaultNow().notNull(),
  userId: uuid('user_id').notNull(), // Liên kết với auth.users
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
