import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, scholarshipCategoriesTable } from "@workspace/db";
import { AdminCreateCategoryBody } from "@workspace/api-zod";

const router: IRouter = Router();

function toCategoryResponse(
  row: typeof scholarshipCategoriesTable.$inferSelect,
) {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? null,
    icon: row.icon ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

// GET /admin/categories
router.get("/admin/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(scholarshipCategoriesTable)
    .orderBy(scholarshipCategoriesTable.name);
  res.json({ categories: rows.map(toCategoryResponse) });
});

// POST /admin/categories
router.post("/admin/categories", async (req, res): Promise<void> => {
  const parsed = AdminCreateCategoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(scholarshipCategoriesTable)
    .where(eq(scholarshipCategoriesTable.name, parsed.data.name));
  if (existing) {
    res.status(409).json({ error: "A category with this name already exists" });
    return;
  }

  const [row] = await db
    .insert(scholarshipCategoriesTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(toCategoryResponse(row));
});

export default router;
