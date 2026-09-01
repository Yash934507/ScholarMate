import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const appSource = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../components/layout.tsx", import.meta.url), "utf8");

test("uses Clerk email/password sign-in and sign-up routes", () => {
  assert.match(appSource, /<SignIn routing="path" path=\{`\$\{basePath\}\/sign-in`\}/);
  assert.match(appSource, /<SignUp routing="path" path=\{`\$\{basePath\}\/sign-up`\}/);
  assert.match(appSource, /path="\/sign-in\/\*\?"/);
  assert.match(appSource, /path="\/sign-up\/\*\?"/);
});

test("keeps logout in Clerk rather than an application password/session endpoint", () => {
  assert.match(layoutSource, /useClerk/);
  assert.match(layoutSource, /signOut\(\{ redirectUrl: "\/" \}\)/);
  assert.doesNotMatch(layoutSource, /fetch\(.*logout/i);
});