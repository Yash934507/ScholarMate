import {
  pgTable,
  text,
  serial,
  boolean,
  integer,
  date,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { scholarshipProvidersTable } from "./scholarship-providers";

export const scholarshipsTable = pgTable("scholarships", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id")
    .notNull()
    .references(() => scholarshipProvidersTable.id, { onDelete: "restrict" }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  // Short plain-language overview shown on cards
  eligibilitySummary: text("eligibility_summary").notNull(),
  amountMin: integer("amount_min"),
  amountMax: integer("amount_max"),
  // one_time | annual | monthly
  frequency: text("frequency").notNull(),
  coverageType: text("coverage_type"),
  // online_portal | offline_form | email | in_person
  applicationMethod: text("application_method").notNull(),
  applicationUrl: text("application_url").notNull(),
  deadline: date("deadline", { mode: "string" }),
  // draft | active | expired | closed | archived
  status: text("status").notNull().default("draft"),
  // Target state, e.g. "Maharashtra" or "National"
  state: text("state").notNull().default("National"),
  // School | Diploma | UG | PG | PhD | Any
  courseLevel: text("course_level").notNull().default("Any"),
  // Specific course/stream, e.g. "B.Tech", "MBBS", "B.Com", "Arts" | "Any"
  courseStream: text("course_stream").notNull().default("Any"),
  // any | male | female | other
  genderEligibility: text("gender_eligibility").notNull().default("any"),
  lastVerifiedDate: date("last_verified_date", { mode: "string" }).notNull(),
  // draft | pending_review | published | expired | archived
  dataStatus: text("data_status").notNull().default("draft"),
  // unverified | verified | disputed | needs_update
  verificationStatus: text("verification_status")
    .notNull()
    .default("unverified"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertScholarshipSchema = createInsertSchema(
  scholarshipsTable,
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertScholarship = z.infer<typeof insertScholarshipSchema>;
export type Scholarship = typeof scholarshipsTable.$inferSelect;

// Kept for backwards compatibility with legacy boolean isActive checks
export function isScholarshipActive(row: Scholarship): boolean {
  return row.status === "active";
}
