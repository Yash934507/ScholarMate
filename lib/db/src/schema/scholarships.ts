import {
  pgTable,
  text,
  serial,
  boolean,
  integer,
  real,
  date,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const scholarshipsTable = pgTable("scholarships", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  providerName: text("provider_name").notNull(),
  // govt | ngo | private | university
  providerType: text("provider_type").notNull(),
  description: text("description").notNull(),
  // Award amount in INR; null = varies / fully funded
  amount: integer("amount"),
  // one-time | monthly | annual
  frequency: text("frequency"),
  sourceName: text("source_name").notNull(),
  sourceUrl: text("source_url").notNull(),
  applicationUrl: text("application_url").notNull(),
  deadline: date("deadline", { mode: "string" }),
  isActive: boolean("is_active").notNull().default(true),
  // Target state, e.g. "Maharashtra" or "National"
  state: text("state").notNull(),
  // School | Diploma | UG | PG | PhD | Any
  courseLevel: text("course_level").notNull(),
  // Stored as comma-separated string, e.g. "OBC,SC,ST" or "All"
  casteCategories: text("caste_categories").notNull().default("All"),
  // any | male | female
  gender: text("gender").notNull().default("any"),
  // Max annual family income in INR
  maxAnnualIncome: integer("max_annual_income"),
  // Minimum academic percentage
  minPercentage: real("min_percentage"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertScholarshipSchema = createInsertSchema(scholarshipsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertScholarship = z.infer<typeof insertScholarshipSchema>;
export type Scholarship = typeof scholarshipsTable.$inferSelect;
