import { pgTable, integer, primaryKey } from "drizzle-orm/pg-core";
import { scholarshipsTable } from "./scholarships";
import { scholarshipCategoriesTable } from "./scholarship-categories";

export const scholarshipCategoryLinksTable = pgTable(
  "scholarship_category_links",
  {
    scholarshipId: integer("scholarship_id")
      .notNull()
      .references(() => scholarshipsTable.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => scholarshipCategoriesTable.id, {
        onDelete: "restrict",
      }),
  },
  (t) => [primaryKey({ columns: [t.scholarshipId, t.categoryId] })],
);

export type ScholarshipCategoryLink =
  typeof scholarshipCategoryLinksTable.$inferSelect;
