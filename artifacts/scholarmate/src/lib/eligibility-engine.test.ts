import assert from "node:assert/strict"
import test from "node:test"
import { evaluateScholarship, getRelevantCriterionTypes } from "./eligibility-engine.ts"

const scholarship = {
  state: "Maharashtra",
  courseLevel: "UG",
  courseStream: "B.Tech",
  eligibilityCriteria: [
    { criteriaType: "max_income", operator: "lte", value: "800000" },
    { criteriaType: "min_percentage", operator: "gte", value: "70" },
  ],
}

const matchingProfile = {
  state: "Maharashtra",
  course: "B.Tech Computer Science",
  educationLevel: "UG",
  academicPercentage: 82,
  annualFamilyIncome: 500000,
}

test("classifies a profile matching all published rules as potentially eligible", () => {
  const result = evaluateScholarship(scholarship, matchingProfile)
  assert.equal(result.status, "potentially_eligible")
  assert.equal(result.matches.length, 5)
  assert.equal(result.unmet.length, 0)
  assert.equal(result.unknown.length, 0)
})

test("reports unmet income and education criteria without claiming ineligibility beyond published rules", () => {
  const result = evaluateScholarship(scholarship, {
    ...matchingProfile,
    annualFamilyIncome: 900000,
    educationLevel: "PG",
  })
  assert.equal(result.status, "does_not_meet")
  assert.equal(result.unmet.length, 2)
  assert.match(result.explanation, /published criterion/i)
})

test("classifies missing optional information as needs verification", () => {
  const result = evaluateScholarship(
    {
      eligibilityCriteria: [{ criteriaType: "gender", operator: "equals", value: "female" }],
    },
    matchingProfile,
  )
  assert.equal(result.status, "needs_verification")
  assert.equal(result.unknown.length, 1)
  assert.equal(result.unmet.length, 0)
})

test("handles category and disability criteria only when those answers are supplied", () => {
  const criteria = [
    { criteriaType: "caste_category", operator: "equals", value: "OBC" },
    { criteriaType: "disability", operator: "equals", value: "yes" },
  ]
  const missing = evaluateScholarship({ eligibilityCriteria: criteria }, matchingProfile)
  assert.equal(missing.status, "needs_verification")
  assert.equal(missing.unknown.length, 2)

  const matched = evaluateScholarship({ eligibilityCriteria: criteria }, {
    ...matchingProfile,
    category: "OBC",
    disabilityStatus: "yes",
  })
  assert.equal(matched.status, "potentially_eligible")
  assert.equal(matched.matches.length, 2)
})

test("supports additional attributes and unknown custom rules", () => {
  const criterion = { criteriaType: "custom", operator: "equals", value: "hostel resident" }
  const unknown = evaluateScholarship({ eligibilityCriteria: [criterion] }, matchingProfile)
  assert.equal(unknown.status, "needs_verification")

  const matched = evaluateScholarship(
    { eligibilityCriteria: [criterion] },
    { ...matchingProfile, otherAttributes: { custom: "hostel resident" } },
  )
  assert.equal(matched.status, "potentially_eligible")
})

test("exposes only criteria that make conditional profile fields relevant", () => {
  const types = getRelevantCriterionTypes([
    scholarship,
    { eligibilityCriteria: [{ criteriaType: "gender", operator: "equals", value: "female" }] },
  ])
  assert.equal(types.has("gender"), true)
  assert.equal(types.has("disability"), false)
  assert.equal(types.has("course_stream"), true)
})