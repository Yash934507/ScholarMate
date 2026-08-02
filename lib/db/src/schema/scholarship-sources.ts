import {
  pgTable,
  text,
  serial,
  integer,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { scholarshipsTable } from "./scholarships";

export const scholarshipSourcesTable = pgTable(
  "scholarship_sources",
  {
    id: serial("id").primaryKey(),
    scholarshipId: integer("scholarship_id")
      .notNull()
      .references(() => scholarshipsTable.id, { onDelete: "cascade" }),
    sourceName: text("source_name").notNull(),
    sourceUrl: text("source_url").notNull(),
    // official_government | institutional | ngo_direct | aggregator
    sourceType: text("source_type").notNull(),
    // official | information | application
    sourceRole: text("source_role").notNull(),
    lastCheckedAt: timestamp("last_checked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [unique().on(t.scholarshipId, t.sourceUrl)],
);

export const insertScholarshipSourceSchema = createInsertSchema(
  scholarshipSourcesTable,
).omit({ id: true, createdAt: true });

export type InsertScholarshipSource = z.infer<
  typeof insertScholarshipSourceSchema
>;
export type ScholarshipSource = typeof scholarshipSourcesTable.$inferSelect;

// Enforced in the application layer (not a DB constraint): at most one
// "official" and at most one "application" role per scholarship.
export const SINGLETON_SOURCE_ROLES = ["official", "application"] as const;
