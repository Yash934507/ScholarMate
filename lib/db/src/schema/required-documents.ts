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

export const requiredDocumentsTable = pgTable("required_documents", {
  id: serial("id").primaryKey(),
  scholarshipId: integer("scholarship_id")
    .notNull()
    .references(() => scholarshipsTable.id, { onDelete: "cascade" }),
  documentName: text("document_name").notNull(),
  documentDescription: text("document_description"),
  isMandatory: boolean("is_mandatory").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertRequiredDocumentSchema = createInsertSchema(
  requiredDocumentsTable,
).omit({ id: true, createdAt: true });

export type InsertRequiredDocument = z.infer<
  typeof insertRequiredDocumentSchema
>;
export type RequiredDocument = typeof requiredDocumentsTable.$inferSelect;
