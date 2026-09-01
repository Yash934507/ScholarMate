import { Router, type IRouter } from "express";
import { clerkClient } from "@clerk/express";
import { eq } from "drizzle-orm";
import {
  db,
  studentProfilesTable,
  type StudentProfile,
} from "@workspace/db";
import {
  GetStudentProfileResponse,
  UpdateStudentProfileBody,
  UpdateStudentProfileResponse,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

function toProfileResponse(row: StudentProfile) {
  return {
    id: row.id,
    fullName: row.fullName,
    email: row.email,
    phone: row.phone ?? null,
    state: row.state ?? null,
    city: row.city ?? null,
    college: row.college ?? null,
    university: row.university ?? null,
    course: row.course ?? null,
    educationLevel: row.educationLevel ?? null,
    academicPercentage: row.academicPercentage ?? null,
    annualFamilyIncome: row.annualFamilyIncome ?? null,
    dateOfBirth: row.dateOfBirth ?? null,
    gender: row.gender ?? null,
    category: row.category ?? null,
    disabilityStatus: row.disabilityStatus ?? null,
    minorityCommunity: row.minorityCommunity ?? null,
    otherAttributes: row.otherAttributes,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function getClerkIdentity(userId: string) {
  const user = await clerkClient.users.getUser(userId);
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const email = user.emailAddresses.find(
    (address) => address.id === user.primaryEmailAddressId,
  )?.emailAddress;

  if (!email) {
    throw new Error("Authenticated Clerk user has no primary email address");
  }

  return { fullName, email };
}

async function loadOrCreateProfile(userId: string) {
  const [existing] = await db
    .select()
    .from(studentProfilesTable)
    .where(eq(studentProfilesTable.clerkUserId, userId));
  if (existing) return existing;

  const identity = await getClerkIdentity(userId);
  const [created] = await db
    .insert(studentProfilesTable)
    .values({
      clerkUserId: userId,
      fullName: identity.fullName,
      email: identity.email,
    })
    .returning();
  return created;
}

router.get(
  "/student/profile",
  requireAuth,
  async (req, res): Promise<void> => {
    const profile = await loadOrCreateProfile(req.userId!);
    res.json(GetStudentProfileResponse.parse(toProfileResponse(profile)));
  },
);

router.put(
  "/student/profile",
  requireAuth,
  async (req, res): Promise<void> => {
    const parsed = UpdateStudentProfileBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const existing = await loadOrCreateProfile(req.userId!);
    const [updated] = await db
      .update(studentProfilesTable)
      .set(parsed.data)
      .where(eq(studentProfilesTable.id, existing.id))
      .returning();

    res.json(UpdateStudentProfileResponse.parse(toProfileResponse(updated)));
  },
);

export default router;