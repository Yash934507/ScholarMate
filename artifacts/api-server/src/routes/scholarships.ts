import { Router, type IRouter } from "express";
import { ilike, and, eq, lte, or, sql } from "drizzle-orm";
import { db, scholarshipsTable } from "@workspace/db";
import {
  ListScholarshipsQueryParams,
  GetScholarshipParams,
  ListScholarshipsResponse,
  GetScholarshipResponse,
  GetScholarshipStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

/** Parse the comma-separated casteCategories string into an array */
function parseCasteCategories(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Map a DB row to the API response shape */
function toScholarshipResponse(row: typeof scholarshipsTable.$inferSelect) {
  return {
    id: row.id,
    title: row.title,
    providerName: row.providerName,
    providerType: row.providerType,
    description: row.description,
    amount: row.amount ?? null,
    frequency: row.frequency ?? null,
    sourceName: row.sourceName,
    sourceUrl: row.sourceUrl,
    applicationUrl: row.applicationUrl,
    deadline: row.deadline ?? null,
    isActive: row.isActive,
    state: row.state,
    courseLevel: row.courseLevel,
    casteCategories: parseCasteCategories(row.casteCategories),
    gender: row.gender,
    maxAnnualIncome: row.maxAnnualIncome ?? null,
    minPercentage: row.minPercentage ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

// GET /scholarships/stats  — must come BEFORE /:id to avoid shadowing
router.get("/scholarships/stats", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(scholarshipsTable)
    .where(eq(scholarshipsTable.isActive, true));

  const totalScholarships = rows.length;
  const stateSet = new Set(rows.map((r) => r.state));
  const totalStates = stateSet.size;

  const providerTypeMap = new Map<string, number>();
  const courseLevelMap = new Map<string, number>();

  for (const row of rows) {
    providerTypeMap.set(
      row.providerType,
      (providerTypeMap.get(row.providerType) ?? 0) + 1,
    );
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

  const {
    search,
    state,
    providerType,
    courseLevel,
    casteCategory,
    gender,
    maxIncome,
    isActive,
    page,
    limit,
  } = parsed.data;

  const conditions = [];

  // Default: only active scholarships unless explicitly overridden
  const activeFilter = isActive !== undefined ? isActive : true;
  conditions.push(eq(scholarshipsTable.isActive, activeFilter));

  if (search) {
    conditions.push(
      or(
        ilike(scholarshipsTable.title, `%${search}%`),
        ilike(scholarshipsTable.description, `%${search}%`),
        ilike(scholarshipsTable.providerName, `%${search}%`),
      ),
    );
  }

  if (state) {
    conditions.push(
      or(
        eq(scholarshipsTable.state, state),
        eq(scholarshipsTable.state, "National"),
      ),
    );
  }

  if (providerType) {
    conditions.push(eq(scholarshipsTable.providerType, providerType));
  }

  if (courseLevel) {
    conditions.push(
      or(
        eq(scholarshipsTable.courseLevel, courseLevel),
        eq(scholarshipsTable.courseLevel, "Any"),
      ),
    );
  }

  if (gender && gender !== "any") {
    conditions.push(
      or(
        eq(scholarshipsTable.gender, gender),
        eq(scholarshipsTable.gender, "any"),
      ),
    );
  }

  if (maxIncome !== undefined) {
    conditions.push(
      or(
        sql`${scholarshipsTable.maxAnnualIncome} IS NULL`,
        lte(scholarshipsTable.maxAnnualIncome, maxIncome),
      ),
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const allRows = await db
    .select()
    .from(scholarshipsTable)
    .where(where)
    .orderBy(scholarshipsTable.createdAt);

  // In-memory caste filter (stored as CSV, hard to SQL-filter cleanly)
  const filtered =
    casteCategory
      ? allRows.filter((r) => {
          const cats = parseCasteCategories(r.casteCategories);
          return cats.includes("All") || cats.includes(casteCategory);
        })
      : allRows;

  const total = filtered.length;
  const offset = (page - 1) * limit;
  const pageRows = filtered.slice(offset, offset + limit);

  res.json(
    ListScholarshipsResponse.parse({
      scholarships: pageRows.map(toScholarshipResponse),
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

  res.json(GetScholarshipResponse.parse(toScholarshipResponse(row)));
});

export default router;
