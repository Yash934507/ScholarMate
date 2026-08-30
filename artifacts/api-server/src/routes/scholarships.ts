import { Router, type IRouter } from "express";
import { ilike, and, eq, or, sql, inArray } from "drizzle-orm";
import {
  db,
  scholarshipsTable,
  scholarshipProvidersTable,
  scholarshipSourcesTable,
  eligibilityCriteriaTable,
  requiredDocumentsTable,
  scholarshipCategoriesTable,
  scholarshipCategoryLinksTable,
} from "@workspace/db";
import {
  ListScholarshipsQueryParams,
  GetScholarshipParams,
  ListScholarshipsResponse,
  GetScholarshipResponse,
  GetScholarshipStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

type CategorySummary = {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  createdAt: string;
};

/** Map a DB row + its provider + categories + primary source to the public API response shape */
function toScholarshipResponse(
  row: typeof scholarshipsTable.$inferSelect,
  provider: typeof scholarshipProvidersTable.$inferSelect,
  categories: CategorySummary[],
  primarySource: { name: string; url: string } | null,
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
    courseStream: row.courseStream,
    genderEligibility: row.genderEligibility,
    lastVerifiedDate: row.lastVerifiedDate,
    dataStatus: row.dataStatus,
    verificationStatus: row.verificationStatus,
    categories,
    primarySourceName: primarySource?.name ?? null,
    primarySourceUrl: primarySource?.url ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function pickPrimarySource(sources: (typeof scholarshipSourcesTable.$inferSelect)[]) {
  const byRole = (role: string) => sources.find((s) => s.sourceRole === role);
  const chosen = byRole("official") ?? byRole("application") ?? sources[0];
  return chosen ? { name: chosen.sourceName, url: chosen.sourceUrl } : null;
}

/** Batch-load categories + primary source for a page of scholarship rows. */
async function enrichRows(
  rows: (typeof scholarshipsTable.$inferSelect)[],
  providerMap: Map<number, typeof scholarshipProvidersTable.$inferSelect>,
) {
  const ids = rows.map((r) => r.id);
  if (ids.length === 0) return [];

  const [categoryLinkRows, sourceRows] = await Promise.all([
    db
      .select({
        scholarshipId: scholarshipCategoryLinksTable.scholarshipId,
        id: scholarshipCategoriesTable.id,
        name: scholarshipCategoriesTable.name,
        description: scholarshipCategoriesTable.description,
        icon: scholarshipCategoriesTable.icon,
        createdAt: scholarshipCategoriesTable.createdAt,
      })
      .from(scholarshipCategoryLinksTable)
      .innerJoin(
        scholarshipCategoriesTable,
        eq(scholarshipCategoryLinksTable.categoryId, scholarshipCategoriesTable.id),
      )
      .where(inArray(scholarshipCategoryLinksTable.scholarshipId, ids)),
    db
      .select()
      .from(scholarshipSourcesTable)
      .where(inArray(scholarshipSourcesTable.scholarshipId, ids)),
  ]);

  const categoriesByScholarship = new Map<number, CategorySummary[]>();
  for (const r of categoryLinkRows) {
    const list = categoriesByScholarship.get(r.scholarshipId) ?? [];
    list.push({
      id: r.id,
      name: r.name,
      description: r.description,
      icon: r.icon,
      createdAt: r.createdAt.toISOString(),
    });
    categoriesByScholarship.set(r.scholarshipId, list);
  }
  const sourcesByScholarship = new Map<number, typeof sourceRows>();
  for (const s of sourceRows) {
    const list = sourcesByScholarship.get(s.scholarshipId) ?? [];
    list.push(s);
    sourcesByScholarship.set(s.scholarshipId, list);
  }

  return rows
    .map((row) => {
      const provider = providerMap.get(row.providerId);
      if (!provider) return null;
      return toScholarshipResponse(
        row,
        provider,
        categoriesByScholarship.get(row.id) ?? [],
        pickPrimarySource(sourcesByScholarship.get(row.id) ?? []),
      );
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
}

// GET /categories is served from routes/categories.ts; kept here as a comment
// so both discovery-filter endpoints are easy to find from this file.

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

// GET /scholarships — database-driven search, filter, sort & paginate
router.get("/scholarships", async (req, res): Promise<void> => {
  const parsed = ListScholarshipsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const {
    search,
    categoryId,
    state,
    providerId,
    providerType,
    courseLevel,
    courseStream,
    gender,
    maxFamilyIncome,
    academicPercentage,
    deadlineWithinDays,
    sortBy,
    page,
    limit,
  } = parsed.data;

  const conditions = [eq(scholarshipsTable.status, "active")];

  if (search) {
    conditions.push(
      or(
        ilike(scholarshipsTable.title, `%${search}%`),
        ilike(scholarshipsTable.description, `%${search}%`),
        ilike(scholarshipsTable.eligibilitySummary, `%${search}%`),
        sql`EXISTS (
          SELECT 1 FROM ${scholarshipProvidersTable}
          WHERE ${scholarshipProvidersTable.id} = ${scholarshipsTable.providerId}
          AND ${scholarshipProvidersTable.name} ILIKE ${"%" + search + "%"}
        )`,
      )!,
    );
  }

  if (categoryId) {
    conditions.push(
      sql`EXISTS (
        SELECT 1 FROM ${scholarshipCategoryLinksTable}
        WHERE ${scholarshipCategoryLinksTable.scholarshipId} = ${scholarshipsTable.id}
        AND ${scholarshipCategoryLinksTable.categoryId} = ${categoryId}
      )`,
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

  if (providerId) {
    conditions.push(eq(scholarshipsTable.providerId, providerId));
  }

  if (providerType) {
    conditions.push(
      sql`EXISTS (
        SELECT 1 FROM ${scholarshipProvidersTable}
        WHERE ${scholarshipProvidersTable.id} = ${scholarshipsTable.providerId}
        AND ${scholarshipProvidersTable.providerType} = ${providerType}
      )`,
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

  if (courseStream) {
    conditions.push(
      or(
        eq(scholarshipsTable.courseStream, courseStream),
        eq(scholarshipsTable.courseStream, "Any"),
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

  // A scholarship is eligible on income if it has no max_income criterion,
  // or its threshold is at or above the student's stated family income.
  if (maxFamilyIncome !== undefined) {
    conditions.push(
      sql`NOT EXISTS (
        SELECT 1 FROM ${eligibilityCriteriaTable}
        WHERE ${eligibilityCriteriaTable.scholarshipId} = ${scholarshipsTable.id}
        AND ${eligibilityCriteriaTable.criteriaType} = 'max_income'
        AND (${eligibilityCriteriaTable.value})::numeric < ${maxFamilyIncome}
      )`,
    );
  }

  // A scholarship is eligible on percentage if it has no min_percentage
  // criterion, or its threshold is at or below the student's percentage.
  if (academicPercentage !== undefined) {
    conditions.push(
      sql`NOT EXISTS (
        SELECT 1 FROM ${eligibilityCriteriaTable}
        WHERE ${eligibilityCriteriaTable.scholarshipId} = ${scholarshipsTable.id}
        AND ${eligibilityCriteriaTable.criteriaType} = 'min_percentage'
        AND (${eligibilityCriteriaTable.value})::numeric > ${academicPercentage}
      )`,
    );
  }

  if (deadlineWithinDays !== undefined) {
    conditions.push(
      sql`${scholarshipsTable.deadline} IS NOT NULL
        AND ${scholarshipsTable.deadline} >= CURRENT_DATE
        AND ${scholarshipsTable.deadline} <= CURRENT_DATE + (${deadlineWithinDays} || ' days')::interval`,
    );
  }

  const where = and(...conditions);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(scholarshipsTable)
    .where(where);
  const total = count;

  let orderBy;
  switch (sortBy) {
    case "deadline_asc":
      orderBy = sql`COALESCE(${scholarshipsTable.deadline}, '9999-12-31') ASC`;
      break;
    case "amount_desc":
      orderBy = sql`COALESCE(${scholarshipsTable.amountMax}, -1) DESC`;
      break;
    case "relevance":
      orderBy = search
        ? sql`(CASE WHEN ${scholarshipsTable.title} ILIKE ${"%" + search + "%"} THEN 0 ELSE 1 END) ASC, ${scholarshipsTable.createdAt} DESC`
        : sql`${scholarshipsTable.createdAt} DESC`;
      break;
    case "newest":
    default:
      orderBy = sql`${scholarshipsTable.createdAt} DESC`;
      break;
  }

  const offset = (page - 1) * limit;
  const pageRows = await db
    .select()
    .from(scholarshipsTable)
    .where(where)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const providers = await db.select().from(scholarshipProvidersTable);
  const providerMap = new Map(providers.map((p) => [p.id, p]));

  const scholarships = await enrichRows(pageRows, providerMap);

  res.json(
    ListScholarshipsResponse.parse({
      scholarships,
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

  const [sources, eligibilityCriteria, requiredDocuments, categoryLinkRows] =
    await Promise.all([
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
      db
        .select({
          id: scholarshipCategoriesTable.id,
          name: scholarshipCategoriesTable.name,
          description: scholarshipCategoriesTable.description,
          icon: scholarshipCategoriesTable.icon,
          createdAt: scholarshipCategoriesTable.createdAt,
        })
        .from(scholarshipCategoryLinksTable)
        .innerJoin(
          scholarshipCategoriesTable,
          eq(scholarshipCategoryLinksTable.categoryId, scholarshipCategoriesTable.id),
        )
        .where(eq(scholarshipCategoryLinksTable.scholarshipId, row.id)),
    ]);

  const categories: CategorySummary[] = categoryLinkRows.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }));

  res.json(
    GetScholarshipResponse.parse({
      ...toScholarshipResponse(row, provider, categories, pickPrimarySource(sources)),
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
