import { Router, type IRouter } from "express";
import { ilike, and, eq, or } from "drizzle-orm";
import {
  db,
  scholarshipsTable,
  scholarshipProvidersTable,
  scholarshipSourcesTable,
  eligibilityCriteriaTable,
  requiredDocumentsTable,
} from "@workspace/db";
import {
  ListScholarshipsQueryParams,
  GetScholarshipParams,
  ListScholarshipsResponse,
  GetScholarshipResponse,
  GetScholarshipStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

/** Map a DB row + its provider to the public API response shape */
function toScholarshipResponse(
  row: typeof scholarshipsTable.$inferSelect,
  provider: typeof scholarshipProvidersTable.$inferSelect,
) {
  return {
    id: row.id,
    providerId: row.providerId,
    providerName: provider.name,
    providerType: provider.providerType,
    title: row.title,
    slug: row.slug,
    description: row.description,
    eligibilitySummary: row.eligibilitySummary,
    amountMin: row.amountMin ?? null,
    amountMax: row.amountMax ?? null,
    frequency: row.frequency,
    coverageType: row.coverageType ?? null,
    applicationMethod: row.applicationMethod,
    applicationUrl: row.applicationUrl,
    deadline: row.deadline ?? null,
    status: row.status,
    state: row.state,
    courseLevel: row.courseLevel,
    genderEligibility: row.genderEligibility,
    lastVerifiedDate: row.lastVerifiedDate,
    dataStatus: row.dataStatus,
    verificationStatus: row.verificationStatus,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

// GET /scholarships/stats  — must come BEFORE /:id to avoid shadowing
router.get("/scholarships/stats", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(scholarshipsTable)
    .where(eq(scholarshipsTable.status, "active"));
  const providers = await db.select().from(scholarshipProvidersTable);
  const providerMap = new Map(providers.map((p) => [p.id, p]));

  const totalScholarships = rows.length;
  const stateSet = new Set(rows.map((r) => r.state));
  const totalStates = stateSet.size;

  const providerTypeMap = new Map<string, number>();
  const courseLevelMap = new Map<string, number>();

  for (const row of rows) {
    const providerType = providerMap.get(row.providerId)?.providerType ?? "unknown";
    providerTypeMap.set(providerType, (providerTypeMap.get(providerType) ?? 0) + 1);
    courseLevelMap.set(
      row.courseLevel,
      (courseLevelMap.get(row.courseLevel) ?? 0) + 1,
    );
  }

  const providerTypes = Array.from(providerTypeMap.entries()).map(
    ([providerType, count]) => ({ providerType, count }),
  );
  const courseLevels = Array.from(courseLevelMap.entries()).map(
    ([courseLevel, count]) => ({ courseLevel, count }),
  );

  res.json(
    GetScholarshipStatsResponse.parse({
      totalScholarships,
      totalStates,
      providerTypes,
      courseLevels,
    }),
  );
});

// GET /scholarships
router.get("/scholarships", async (req, res): Promise<void> => {
  const parsed = ListScholarshipsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { search, state, providerType, courseLevel, gender, page, limit } =
    parsed.data;

  const conditions = [eq(scholarshipsTable.status, "active")];

  if (search) {
    conditions.push(
      or(
        ilike(scholarshipsTable.title, `%${search}%`),
        ilike(scholarshipsTable.description, `%${search}%`),
      )!,
    );
  }

  if (state) {
    conditions.push(
      or(
        eq(scholarshipsTable.state, state),
        eq(scholarshipsTable.state, "National"),
      )!,
    );
  }

  if (courseLevel) {
    conditions.push(
      or(
        eq(scholarshipsTable.courseLevel, courseLevel),
        eq(scholarshipsTable.courseLevel, "Any"),
      )!,
    );
  }

  if (gender && gender !== "any") {
    conditions.push(
      or(
        eq(scholarshipsTable.genderEligibility, gender),
        eq(scholarshipsTable.genderEligibility, "any"),
      )!,
    );
  }

  const where = and(...conditions);

  const allRows = await db
    .select()
    .from(scholarshipsTable)
    .where(where)
    .orderBy(scholarshipsTable.createdAt);

  const providers = await db.select().from(scholarshipProvidersTable);
  const providerMap = new Map(providers.map((p) => [p.id, p]));

  // In-memory providerType filter (requires join, simplest done in memory here)
  const filtered = providerType
    ? allRows.filter((r) => providerMap.get(r.providerId)?.providerType === providerType)
    : allRows;

  const total = filtered.length;
  const offset = (page - 1) * limit;
  const pageRows = filtered.slice(offset, offset + limit);

  res.json(
    ListScholarshipsResponse.parse({
      scholarships: pageRows
        .map((row) => {
          const provider = providerMap.get(row.providerId);
          if (!provider) return null;
          return toScholarshipResponse(row, provider);
        })
        .filter((x): x is NonNullable<typeof x> => x !== null),
      total,
      page,
      limit,
    }),
  );
});

// GET /scholarships/:id
router.get("/scholarships/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetScholarshipParams.safeParse({ id: raw });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select()
    .from(scholarshipsTable)
    .where(eq(scholarshipsTable.id, params.data.id));

  if (!row) {
    res.status(404).json({ error: "Scholarship not found" });
    return;
  }

  const [provider] = await db
    .select()
    .from(scholarshipProvidersTable)
    .where(eq(scholarshipProvidersTable.id, row.providerId));
  if (!provider) {
    res.status(404).json({ error: "Scholarship not found" });
    return;
  }

  const [sources, eligibilityCriteria, requiredDocuments] = await Promise.all([
    db
      .select()
      .from(scholarshipSourcesTable)
      .where(eq(scholarshipSourcesTable.scholarshipId, row.id)),
    db
      .select()
      .from(eligibilityCriteriaTable)
      .where(eq(eligibilityCriteriaTable.scholarshipId, row.id)),
    db
      .select()
      .from(requiredDocumentsTable)
      .where(eq(requiredDocumentsTable.scholarshipId, row.id)),
  ]);

  res.json(
    GetScholarshipResponse.parse({
      ...toScholarshipResponse(row, provider),
      sources: sources.map((s) => ({
        id: s.id,
        scholarshipId: s.scholarshipId,
        sourceName: s.sourceName,
        sourceUrl: s.sourceUrl,
        sourceType: s.sourceType,
        sourceRole: s.sourceRole,
        lastCheckedAt: s.lastCheckedAt ? s.lastCheckedAt.toISOString() : null,
      })),
      eligibilityCriteria: eligibilityCriteria.map((c) => ({
        id: c.id,
        scholarshipId: c.scholarshipId,
        criteriaType: c.criteriaType,
        operator: c.operator,
        value: c.value,
        isMandatory: c.isMandatory,
        displayOrder: c.displayOrder,
      })),
      requiredDocuments: requiredDocuments.map((d) => ({
        id: d.id,
        scholarshipId: d.scholarshipId,
        documentName: d.documentName,
        documentDescription: d.documentDescription ?? null,
        isMandatory: d.isMandatory,
        displayOrder: d.displayOrder,
      })),
    }),
  );
});

export default router;
