import test from "node:test"
import assert from "node:assert/strict"
import { mockScholarships } from "./mock-data.ts"
import {
  comparisonFieldsFor,
  hasDifference,
  toggleSelection,
} from "./comparison-data.ts"

test("builds every requested comparison field without inventing missing source data", () => {
  const fields = comparisonFieldsFor(mockScholarships[0])
  assert.deepEqual(fields.map((field) => field.label), [
    "Scholarship name",
    "Provider",
    "Education level",
    "Eligible courses",
    "State",
    "Income criteria",
    "Academic criteria",
    "Benefits",
    "Required documents",
    "Deadline",
    "Application method",
    "Official source",
    "Last verified date",
  ])
  assert.equal(fields.find((field) => field.key === "requiredDocuments")?.isMissing, true)
  assert.equal(fields.find((field) => field.key === "lastVerifiedDate")?.isMissing, true)
})

test("caps comparison selection at three and detects differences neutrally", () => {
  assert.deepEqual(toggleSelection([1, 2], 3), [1, 2, 3])
  assert.deepEqual(toggleSelection([1, 2, 3], 4), [1, 2, 3])
  assert.deepEqual(toggleSelection([1, 2, 3], 2), [1, 3])
  assert.equal(hasDifference(mockScholarships.slice(0, 2), "provider"), true)
})