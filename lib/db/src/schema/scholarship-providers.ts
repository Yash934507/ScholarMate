import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const scholarshipProvidersTable = pgTable("scholarship_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  // govt | ngo | private | university
  providerType: text("provider_type").notNull(),
  websiteUrl: text("website_url"),
  description: text("description"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertScholarshipProviderSchema = createInsertSchema(
  scholarshipProvidersTable,
).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertScholarshipProvider = z.infer<
  typeof insertScholarshipProviderSchema
>;
export type ScholarshipProvider = typeof scholarshipProvidersTable.$inferSelect;
