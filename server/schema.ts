import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  html: text('html').notNull(),
  published: integer('published', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

export const appointments = sqliteTable('appointments', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  contact: text('contact').notNull(),
  date: text('date').notNull(),
  time: text('time').notNull(),
  modality: text('modality').notNull(),
  createdAt: integer('created_at').notNull(),
});
