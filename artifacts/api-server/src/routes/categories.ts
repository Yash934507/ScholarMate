import { Router, type IRouter } from "express";
import { db, scholarshipCategoriesTable } from "@workspace/db";

const router: IRouter = Router();

// GET /categories — public, read-only, used to populate discovery filters
router.get("/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(scholarshipCategoriesTable)
    .orderBy(scholarshipCategoriesTable.name);
  res.json({
    categories: rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description ?? null,
      icon: row.icon ?? null,
      createdAt: row.createdAt.toISOString(),
    })),
  });
});

export default router;
