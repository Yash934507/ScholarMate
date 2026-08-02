import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, scholarshipProvidersTable } from "@workspace/db";
import { AdminCreateProviderBody } from "@workspace/api-zod";

const router: IRouter = Router();

function toProviderResponse(row: typeof scholarshipProvidersTable.$inferSelect) {
  return {
    id: row.id,
    name: row.name,
    providerType: row.providerType,
    websiteUrl: row.websiteUrl ?? null,
    description: row.description ?? null,
    logoUrl: row.logoUrl ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

// GET /admin/providers
router.get("/admin/providers", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(scholarshipProvidersTable)
    .orderBy(scholarshipProvidersTable.name);
  res.json({ providers: rows.map(toProviderResponse) });
});

// POST /admin/providers
router.post("/admin/providers", async (req, res): Promise<void> => {
  const parsed = AdminCreateProviderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(scholarshipProvidersTable)
    .where(eq(scholarshipProvidersTable.name, parsed.data.name));
  if (existing) {
    res.status(409).json({ error: "A provider with this name already exists" });
    return;
  }

  const [row] = await db
    .insert(scholarshipProvidersTable)
    .values(parsed.data)
    .returning();

  res.status(201).json(toProviderResponse(row));
});

export default router;
