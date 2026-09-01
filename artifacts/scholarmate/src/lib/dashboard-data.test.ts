import test from "node:test"
import assert from "node:assert/strict"
import {
  APPLICATION_STATUSES,
  dashboardApplications,
  deadlineLabel,
  formatDeadline,
} from "./dashboard-data.ts"

test("exposes the complete personal application status list", () => {
  assert.deepEqual(APPLICATION_STATUSES, [
    "Saved",
    "Planning to Apply",
    "Applied",
    "Under Review",
    "Approved",
    "Rejected",
    "Closed",
  ])
})

test("sample tracker data covers the dashboard's status interaction", () => {
  const statuses = new Set(dashboardApplications.map((application) => application.status))
  assert.ok(statuses.has("Saved"))
  assert.ok(statuses.has("Applied"))
  assert.ok(statuses.has("Under Review"))
  assert.ok(statuses.has("Approved"))
  assert.equal(deadlineLabel(1), "Due tomorrow")
  assert.match(formatDeadline(10), /\d{4}/)
})