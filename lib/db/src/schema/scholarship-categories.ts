import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const scholarshipCategoriesTable = pgTable("scholarship_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertScholarshipCategorySchema = createInsertSchema(
  scholarshipCategoriesTable,
).omit({ id: true, createdAt: true });

export type InsertScholarshipCategory = z.infer<
  typeof insertScholarshipCategorySchema
>;
export type ScholarshipCategory = typeof scholarshipCategoriesTable.$inferSelect;
