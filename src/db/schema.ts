import { mysqlTable, varchar, text, timestamp, int, boolean, json, index, decimal } from 'drizzle-orm/mysql-core';

// Entity translations for multilingual content
export const entityTranslations = mysqlTable('entity_translations', {
  id: int('id').primaryKey().autoincrement(),
  entityType: varchar('entity_type', { length: 50 }).notNull(), // 'page', 'announcement', 'menu_entry', 'menu_section', etc.
  entityId: int('entity_id').notNull(),
  language: varchar('language', { length: 10 }).notNull().default('it'), // 'it', 'en', etc.
  field: varchar('field', { length: 100 }).notNull(), // 'title', 'content', 'description', etc.
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  entityIdx: index('entity_idx').on(table.entityType, table.entityId),
  languageIdx: index('language_idx').on(table.language),
}));

// Pages with markdown content
export const pages = mysqlTable('pages', {
  id: int('id').primaryKey().autoincrement(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  template: varchar('template', { length: 100 }), // Optional template override
  published: boolean('published').default(false),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// Announcements
export const announcements = mysqlTable('announcements', {
  id: int('id').primaryKey().autoincrement(),
  category: varchar('category', { length: 100 }), // Optional category
  price: decimal('price', { precision: 10, scale: 2 }), // Optional price
  images: json('images'), // Array of image URLs
  contactInfo: json('contact_info'), // Contact information (email, phone, etc.)
  published: boolean('published').default(false),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// Menu sections
export const menuSections = mysqlTable('menu_sections', {
  id: int('id').primaryKey().autoincrement(),
  order: int('order').default(0),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// Menu entries
export const menuEntries = mysqlTable('menu_entries', {
  id: int('id').primaryKey().autoincrement(),
  sectionId: int('section_id'), // Optional: link to menu_sections
  parentId: int('parent_id'), // Optional: for nested menus
  link: varchar('link', { length: 500 }), // URL or page slug
  order: int('order').default(0),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// Contact configuration
export const contactConfiguration = mysqlTable('contact_configuration', {
  id: int('id').primaryKey().autoincrement(),
  contactType: varchar('contact_type', { length: 50 }).notNull(), // 'email', 'phone', 'social_facebook', 'social_twitter', etc.
  contactInfo: varchar('contact_info', { length: 500 }).notNull(), // The actual contact value
  order: int('order').default(0),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
});

// Contact form submissions (for storing contact form messages)
export const contactSubmissions = mysqlTable('contact_submissions', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  message: text('message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Type exports
export type EntityTranslation = typeof entityTranslations.$inferSelect;
export type NewEntityTranslation = typeof entityTranslations.$inferInsert;
export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;
export type MenuSection = typeof menuSections.$inferSelect;
export type NewMenuSection = typeof menuSections.$inferInsert;
export type MenuEntry = typeof menuEntries.$inferSelect;
export type NewMenuEntry = typeof menuEntries.$inferInsert;
export type ContactConfiguration = typeof contactConfiguration.$inferSelect;
export type NewContactConfiguration = typeof contactConfiguration.$inferInsert;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;
