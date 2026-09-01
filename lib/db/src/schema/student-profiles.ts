import {
  date,
  integer,
  numeric,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const studentProfilesTable = pgTable("student_profiles", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  fullName: text("full_name").notNull().default(""),
  email: text("email").notNull(),
  phone: text("phone"),
  state: text("state"),
  city: text("city"),
  college: text("college"),
  university: text("university"),
  course: text("course"),
  educationLevel: text("education_level"),
  academicPercentage: numeric("academic_percentage", {
    precision: 5,
    scale: 2,
    mode: "number",
  }),
  annualFamilyIncome: integer("annual_family_income"),
  dateOfBirth: date("date_of_birth", { mode: "string" }),
  gender: text("gender"),
  category: text("category"),
  disabilityStatus: text("disability_status"),
  minorityCommunity: text("minority_community"),
  otherAttributes: jsonb("other_attributes")
    .$type<Record<string, string | number | boolean | null>>()
    .notNull()
    .default({}),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertStudentProfileSchema = createInsertSchema(
  studentProfilesTable,
).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertStudentProfile = z.infer<typeof insertStudentProfileSchema>;
export type StudentProfile = typeof studentProfilesTable.$inferSelect;