import test from "node:test";
import assert from "node:assert/strict";
import { resolveAuthenticatedUserId } from "./requireAuth.ts";

test("uses the Clerk session claim when it is present", () => {
  assert.equal(
    resolveAuthenticatedUserId({
      userId: "fallback-user",
      sessionClaims: { userId: "session-user" },
    }),
    "session-user",
  );
});

test("falls back to Clerk auth userId", () => {
  assert.equal(
    resolveAuthenticatedUserId({ userId: "clerk-user", sessionClaims: {} }),
    "clerk-user",
  );
});

test("rejects requests without a Clerk user id", () => {
  assert.equal(resolveAuthenticatedUserId({ userId: null }), null);
});