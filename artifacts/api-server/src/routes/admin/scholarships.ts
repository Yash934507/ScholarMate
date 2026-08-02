import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import {
  db,
  scholarshipsTable,
  scholarshipProvidersTable,
  scholarshipSourcesTable,
  eligibilityCriteriaTable,
  requiredDocumentsTable,
} from "@workspace/db";
import {
  AdminCreateScholarshipBody,
  AdminUpdateScholarshipBody,
  AdminVerifyScholarshipBody,
  AdminSetScholarshipStatusBody,
  AdminAddScholarshipSourceBody,
  AdminAddEligibilityCriteriaBody,
  AdminAddRequiredDocumentBody,
  AdminListScholarshipsQueryParams,
  GetScholarshipParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

/** Slugify a title into a URL-safe, unique-ish string. */
function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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

function toSourceResponse(row: typeof scholarshipSourcesTable.$inferSelect) {
  return {
    id: row.id,
    scholarshipId: row.scholarshipId,
    sourceName: row.sourceName,
    sourceUrl: row.sourceUrl,
    sourceType: row.sourceType,
    sourceRole: row.sourceRole,
    lastCheckedAt: row.lastCheckedAt ? row.lastCheckedAt.toISOString() : null,
  };
}

function toCriteriaResponse(
  row: typeof eligibilityCriteriaTable.$inferSelect,
) {
  return {
    id: row.id,
    scholarshipId: row.scholarshipId,
    criteriaType: row.criteriaType,
    operator: row.operator,
    value: row.value,
    isMandatory: row.isMandatory,
    displayOrder: row.displayOrder,
  };
}

function toDocumentResponse(row: typeof requiredDocumentsTable.$inferSelect) {
  return {
    id: row.id,
    scholarshipId: row.scholarshipId,
    documentName: row.documentName,
    documentDescription: row.documentDescription ?? null,
    isMandatory: row.isMandatory,
    displayOrder: row.displayOrder,
  };
}

async function loadScholarshipDetail(id: number) {
  const [row] = await db
    .select()
    .from(scholarshipsTable)
    .where(eq(scholarshipsTable.id, id));
  if (!row) return null;

  const [provider] = await db
    .select()
    .from(scholarshipProvidersTable)
    .where(eq(scholarshipProvidersTable.id, row.providerId));
  if (!provider) return null;

  const [sources, eligibilityCriteria, requiredDocuments] = await Promise.all([
    db
      .select()
      .from(scholarshipSourcesTable)
      .where(eq(scholarshipSourcesTable.scholarshipId, id)),
    db
      .select()
      .from(eligibilityCriteriaTable)
      .where(eq(eligibilityCriteriaTable.scholarshipId, id)),
    db
      .select()
      .from(requiredDocumentsTable)
      .where(eq(requiredDocumentsTable.scholarshipId, id)),
  ]);

  return {
    ...toScholarshipResponse(row, provider),
    sources: sources.map(toSourceResponse),
    eligibilityCriteria: eligibilityCriteria.map(toCriteriaResponse),
    requiredDocuments: requiredDocuments.map(toDocumentResponse),
  };
}

/** At most one "official" and one "application" source role per scholarship. */
async function assertSourceRoleAvailable(
  scholarshipId: number,
  role: string,
  excludeSourceId?: number,
) {
  if (role !== "official" && role !== "application") return true;
  const existing = await db
    .select()
    .from(scholarshipSourcesTable)
    .where(
      and(
        eq(scholarshipSourcesTable.scholarshipId, scholarshipId),
        eq(scholarshipSourcesTable.sourceRole, role),
      ),
    );
  return existing.every((s) => s.id === excludeSourceId);
}

// GET /admin/scholarships
router.get("/admin/scholarships", async (req, res): Promise<void> => {
  const parsed = AdminListScholarshipsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const conditions = [];
  if (parsed.data.dataStatus) {
    conditions.push(eq(scholarshipsTable.dataStatus, parsed.data.dataStatus));
  }
  if (parsed.data.verificationStatus) {
    conditions.push(
      eq(scholarshipsTable.verificationStatus, parsed.data.verificationStatus),
    );
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const rows = await db
    .select()
    .from(scholarshipsTable)
    .where(where)
    .orderBy(scholarshipsTable.createdAt);

  const providers = await db.select().from(scholarshipProvidersTable);
  const providerMap = new Map(providers.map((p) => [p.id, p]));

  const scholarships = rows
    .map((row) => {
      const provider = providerMap.get(row.providerId);
      if (!provider) return null;
      return toScholarshipResponse(row, provider);
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  res.json({ scholarships, total: scholarships.length });
});

// POST /admin/scholarships
router.post("/admin/scholarships", async (req, res): Promise<void> => {
  const parsed = AdminCreateScholarshipBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const body = parsed.data;

  const hasOfficialSource = body.sources.some((s) => s.sourceRole === "official");
  if (!hasOfficialSource) {
    res
      .status(400)
      .json({ error: "At least one source with role \"official\" is required" });
    return;
  }
  const officialCount = body.sources.filter((s) => s.sourceRole === "official").length;
  const applicationCount = body.sources.filter(
    (s) => s.sourceRole === "application",
  ).length;
  if (officialCount > 1 || applicationCount > 1) {
    res.status(400).json({
      error: "Only one source with role \"official\" and one with role \"application\" are allowed",
    });
    return;
  }

  const [provider] = await db
    .select()
    .from(scholarshipProvidersTable)
    .where(eq(scholarshipProvidersTable.id, body.providerId));
  if (!provider) {
    res.status(400).json({ error: "Unknown providerId" });
    return;
  }

  // Duplicate detection: same title (case-insensitive) for the same provider
  const existingForProvider = await db
    .select()
    .from(scholarshipsTable)
    .where(eq(scholarshipsTable.providerId, body.providerId));
  const duplicate = existingForProvider.find(
    (s) => s.title.trim().toLowerCase() === body.title.trim().toLowerCase(),
  );
  if (duplicate) {
    res.status(409).json({
      error: `A scholarship titled "${body.title}" already exists for this provider`,
    });
    return;
  }

  const baseSlug = slugify(body.title);
  let slug = baseSlug;
  let suffix = 1;
  // Ensure slug uniqueness
  while (
    (
      await db
        .select()
        .from(scholarshipsTable)
        .where(eq(scholarshipsTable.slug, slug))
    ).length > 0
  ) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const [row] = await db
    .insert(scholarshipsTable)
    .values({
      providerId: body.providerId,
      title: body.title,
      slug,
      description: body.description,
      eligibilitySummary: body.eligibilitySummary,
      amountMin: body.amountMin,
      amountMax: body.amountMax,
      frequency: body.frequency,
      coverageType: body.coverageType,
      applicationMethod: body.applicationMethod,
      applicationUrl: body.applicationUrl,
      deadline: body.deadline,
      state: body.state,
      courseLevel: body.courseLevel,
      genderEligibility: body.genderEligibility,
      lastVerifiedDate: body.lastVerifiedDate,
    })
    .returning();

  await db.insert(scholarshipSourcesTable).values(
    body.sources.map((s) => ({
      scholarshipId: row.id,
      sourceName: s.sourceName,
      sourceUrl: s.sourceUrl,
      sourceType: s.sourceType,
      sourceRole: s.sourceRole,
    })),
  );

  if (body.eligibilityCriteria && body.eligibilityCriteria.length > 0) {
    await db.insert(eligibilityCriteriaTable).values(
      body.eligibilityCriteria.map((c) => ({
        scholarshipId: row.id,
        criteriaType: c.criteriaType,
        operator: c.operator,
        value: c.value,
        isMandatory: c.isMandatory,
        displayOrder: c.displayOrder,
      })),
    );
  }

  if (body.requiredDocuments && body.requiredDocuments.length > 0) {
    await db.insert(requiredDocumentsTable).values(
      body.requiredDocuments.map((d) => ({
        scholarshipId: row.id,
        documentName: d.documentName,
        documentDescription: d.documentDescription,
        isMandatory: d.isMandatory,
        displayOrder: d.displayOrder,
      })),
    );
  }

  const detail = await loadScholarshipDetail(row.id);
  res.status(201).json(detail);
});

// GET /admin/scholarships/:id
router.get("/admin/scholarships/:id", async (req, res): Promise<void> => {
  const params = GetScholarshipParams.safeParse({ id: req.params.id });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const detail = await loadScholarshipDetail(params.data.id);
  if (!detail) {
    res.status(404).json({ error: "Scholarship not found" });
    return;
  }
  res.json(detail);
});

// PATCH /admin/scholarships/:id
router.patch("/admin/scholarships/:id", async (req, res): Promise<void> => {
  const params = GetScholarshipParams.safeParse({ id: req.params.id });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = AdminUpdateScholarshipBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db
    .select()
    .from(scholarshipsTable)
    .where(eq(scholarshipsTable.id, params.data.id));
  if (!existing) {
    res.status(404).json({ error: "Scholarship not found" });
    return;
  }

  if (parsed.data.providerId !== undefined) {
    const [provider] = await db
      .select()
      .from(scholarshipProvidersTable)
      .where(eq(scholarshipProvidersTable.id, parsed.data.providerId));
    if (!provider) {
      res.status(400).json({ error: "Unknown providerId" });
      return;
    }
  }

  await db
    .update(scholarshipsTable)
    .set(parsed.data)
    .where(eq(scholarshipsTable.id, params.data.id));

  const detail = await loadScholarshipDetail(params.data.id);
  res.json(detail);
});

// DELETE /admin/scholarships/:id
router.delete("/admin/scholarships/:id", async (req, res): Promise<void> => {
  const params = GetScholarshipParams.safeParse({ id: req.params.id });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const deleted = await db
    .delete(scholarshipsTable)
    .where(eq(scholarshipsTable.id, params.data.id))
    .returning();
  if (deleted.length === 0) {
    res.status(404).json({ error: "Scholarship not found" });
    return;
  }
  res.status(204).send();
});

// PATCH /admin/scholarships/:id/verify
router.patch(
  "/admin/scholarships/:id/verify",
  async (req, res): Promise<void> => {
    const params = GetScholarshipParams.safeParse({ id: req.params.id });
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = AdminVerifyScholarshipBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [existing] = await db
      .select()
      .from(scholarshipsTable)
      .where(eq(scholarshipsTable.id, params.data.id));
    if (!existing) {
      res.status(404).json({ error: "Scholarship not found" });
      return;
    }

    if (parsed.data.verificationStatus === "verified") {
      const officialSources = await db
        .select()
        .from(scholarshipSourcesTable)
        .where(
          and(
            eq(scholarshipSourcesTable.scholarshipId, params.data.id),
            eq(scholarshipSourcesTable.sourceRole, "official"),
          ),
        );
      if (officialSources.length === 0) {
        res.status(400).json({
          error:
            "Cannot mark as verified: scholarship has no source with role \"official\"",
        });
        return;
      }
    }

    await db
      .update(scholarshipsTable)
      .set({
        verificationStatus: parsed.data.verificationStatus,
        lastVerifiedDate:
          parsed.data.lastVerifiedDate ??
          new Date().toISOString().slice(0, 10),
      })
      .where(eq(scholarshipsTable.id, params.data.id));

    const detail = await loadScholarshipDetail(params.data.id);
    res.json(detail);
  },
);

// PATCH /admin/scholarships/:id/status
router.patch(
  "/admin/scholarships/:id/status",
  async (req, res): Promise<void> => {
    const params = GetScholarshipParams.safeParse({ id: req.params.id });
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = AdminSetScholarshipStatusBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const updated = await db
      .update(scholarshipsTable)
      .set({ status: parsed.data.status })
      .where(eq(scholarshipsTable.id, params.data.id))
      .returning();
    if (updated.length === 0) {
      res.status(404).json({ error: "Scholarship not found" });
      return;
    }

    const detail = await loadScholarshipDetail(params.data.id);
    res.json(detail);
  },
);

// POST /admin/scholarships/:id/sources
router.post(
  "/admin/scholarships/:id/sources",
  async (req, res): Promise<void> => {
    const params = GetScholarshipParams.safeParse({ id: req.params.id });
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = AdminAddScholarshipSourceBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [scholarship] = await db
      .select()
      .from(scholarshipsTable)
      .where(eq(scholarshipsTable.id, params.data.id));
    if (!scholarship) {
      res.status(404).json({ error: "Scholarship not found" });
      return;
    }

    const roleAvailable = await assertSourceRoleAvailable(
      params.data.id,
      parsed.data.sourceRole,
    );
    if (!roleAvailable) {
      res.status(409).json({
        error: `A source with role "${parsed.data.sourceRole}" already exists for this scholarship`,
      });
      return;
    }

    const duplicateUrl = await db
      .select()
      .from(scholarshipSourcesTable)
      .where(
        and(
          eq(scholarshipSourcesTable.scholarshipId, params.data.id),
          eq(scholarshipSourcesTable.sourceUrl, parsed.data.sourceUrl),
        ),
      );
    if (duplicateUrl.length > 0) {
      res.status(409).json({ error: "This source URL is already attached" });
      return;
    }

    const [row] = await db
      .insert(scholarshipSourcesTable)
      .values({ ...parsed.data, scholarshipId: params.data.id })
      .returning();

    res.status(201).json(toSourceResponse(row));
  },
);

// DELETE /admin/scholarships/:id/sources/:sourceId
router.delete(
  "/admin/scholarships/:id/sources/:sourceId",
  async (req, res): Promise<void> => {
    const scholarshipId = Number(req.params.id);
    const sourceId = Number(req.params.sourceId);
    const deleted = await db
      .delete(scholarshipSourcesTable)
      .where(
        and(
          eq(scholarshipSourcesTable.id, sourceId),
          eq(scholarshipSourcesTable.scholarshipId, scholarshipId),
        ),
      )
      .returning();
    if (deleted.length === 0) {
      res.status(404).json({ error: "Source not found" });
      return;
    }
    res.status(204).send();
  },
);

// POST /admin/scholarships/:id/eligibility-criteria
router.post(
  "/admin/scholarships/:id/eligibility-criteria",
  async (req, res): Promise<void> => {
    const params = GetScholarshipParams.safeParse({ id: req.params.id });
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = AdminAddEligibilityCriteriaBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [scholarship] = await db
      .select()
      .from(scholarshipsTable)
      .where(eq(scholarshipsTable.id, params.data.id));
    if (!scholarship) {
      res.status(404).json({ error: "Scholarship not found" });
      return;
    }

    const [row] = await db
      .insert(eligibilityCriteriaTable)
      .values({ ...parsed.data, scholarshipId: params.data.id })
      .returning();

    res.status(201).json(toCriteriaResponse(row));
  },
);

// DELETE /admin/scholarships/:id/eligibility-criteria/:criteriaId
router.delete(
  "/admin/scholarships/:id/eligibility-criteria/:criteriaId",
  async (req, res): Promise<void> => {
    const scholarshipId = Number(req.params.id);
    const criteriaId = Number(req.params.criteriaId);
    const deleted = await db
      .delete(eligibilityCriteriaTable)
      .where(
        and(
          eq(eligibilityCriteriaTable.id, criteriaId),
          eq(eligibilityCriteriaTable.scholarshipId, scholarshipId),
        ),
      )
      .returning();
    if (deleted.length === 0) {
      res.status(404).json({ error: "Criterion not found" });
      return;
    }
    res.status(204).send();
  },
);

// POST /admin/scholarships/:id/documents
router.post(
  "/admin/scholarships/:id/documents",
  async (req, res): Promise<void> => {
    const params = GetScholarshipParams.safeParse({ id: req.params.id });
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }
    const parsed = AdminAddRequiredDocumentBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const [scholarship] = await db
      .select()
      .from(scholarshipsTable)
      .where(eq(scholarshipsTable.id, params.data.id));
    if (!scholarship) {
      res.status(404).json({ error: "Scholarship not found" });
      return;
    }

    const [row] = await db
      .insert(requiredDocumentsTable)
      .values({ ...parsed.data, scholarshipId: params.data.id })
      .returning();

    res.status(201).json(toDocumentResponse(row));
  },
);

// DELETE /admin/scholarships/:id/documents/:docId
router.delete(
  "/admin/scholarships/:id/documents/:docId",
  async (req, res): Promise<void> => {
    const scholarshipId = Number(req.params.id);
    const docId = Number(req.params.docId);
    const deleted = await db
      .delete(requiredDocumentsTable)
      .where(
        and(
          eq(requiredDocumentsTable.id, docId),
          eq(requiredDocumentsTable.scholarshipId, scholarshipId),
        ),
      )
      .returning();
    if (deleted.length === 0) {
      res.status(404).json({ error: "Document not found" });
      return;
    }
    res.status(204).send();
  },
);

export default router;
