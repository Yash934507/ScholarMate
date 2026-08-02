import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { scholarshipsTable } from "./scholarships";

export const eligibilityCriteriaTable = pgTable("eligibility_criteria", {
  id: serial("id").primaryKey(),
  scholarshipId: integer("scholarship_id")
    .notNull()
    .references(() => scholarshipsTable.id, { onDelete: "cascade" }),
  // caste_category | gender | max_income | min_percentage | course_level | state | age_limit | disability | minority | custom
  criteriaType: text("criteria_type").notNull(),
  // equals | not_equals | lte | gte | in | between
  operator: text("operator").notNull(),
  // Scalar value or JSON-encoded array, depending on criteriaType/operator
  value: text("value").notNull(),
  isMandatory: boolean("is_mandatory").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertEligibilityCriteriaSchema = createInsertSchema(
  eligibilityCriteriaTable,
).omit({ id: true, createdAt: true, updatedAt: true });

export type InsertEligibilityCriteria = z.infer<
  typeof insertEligibilityCriteriaSchema
>;
export type EligibilityCriteria = typeof eligibilityCriteriaTable.$inferSelect;
