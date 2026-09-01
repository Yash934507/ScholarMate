import { getAuth } from "@clerk/express";
import type { Request, RequestHandler } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function resolveAuthenticatedUserId(auth: {
  userId?: string | null;
  sessionClaims?: unknown;
}): string | null {
  const sessionUserId = (
    auth.sessionClaims as { userId?: string } | undefined
  )?.userId;
  return sessionUserId ?? auth.userId ?? null;
}

export function getAuthenticatedUserId(req: Request): string | null {
  return resolveAuthenticatedUserId(getAuth(req));
}

export const requireAuth: RequestHandler = (req, res, next) => {
  const userId = getAuthenticatedUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  req.userId = userId;
  next();
};