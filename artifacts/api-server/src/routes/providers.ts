import { Router, type IRouter } from "express";
import { db, scholarshipProvidersTable } from "@workspace/db";

const router: IRouter = Router();

// GET /providers — public, read-only, used to populate discovery filters
router.get("/providers", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(scholarshipProvidersTable)
    .orderBy(scholarshipProvidersTable.name);
  res.json({
    providers: rows.map((row) => ({
      id: row.id,
      name: row.name,
      providerType: row.providerType,
      websiteUrl: row.websiteUrl ?? null,
      description: row.description ?? null,
      logoUrl: row.logoUrl ?? null,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    })),
  });
});

export default router;
