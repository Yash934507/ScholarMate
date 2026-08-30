export type EligibilityStatus =
  | "potentially_eligible"
  | "does_not_meet"
  | "needs_verification"

export type CriterionResult = "match" | "unmet" | "unknown"

export interface StudentEligibilityProfile {
  state?: string
  course?: string
  educationLevel?: string
  academicPercentage?: number
  annualFamilyIncome?: number
  category?: string
  gender?: string
  disabilityStatus?: "yes" | "no" | "prefer_not_to_say"
  age?: number
  otherAttributes?: Record<string, string | number | boolean | undefined>
}

export interface PublishedCriterion {
  criteriaType: string
  operator: string
  value: string
  isMandatory?: boolean
  displayOrder?: number
}

export interface EligibilityScholarship {
  state?: string | null
  courseLevel?: string | null
  courseStream?: string | null
  genderEligibility?: string | null
  eligibilityCriteria?: PublishedCriterion[]
}

export interface CriterionEvaluation {
  criterion: PublishedCriterion
  result: CriterionResult
  label: string
  explanation: string
}

export interface EligibilityEvaluation {
  status: EligibilityStatus
  matches: CriterionEvaluation[]
  unmet: CriterionEvaluation[]
  unknown: CriterionEvaluation[]
  explanation: string
}

const normalize = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")

function parseNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function publishedValues(value: string) {
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed)) return parsed.map(normalize)
  } catch {
    // Plain text values are the normal database representation.
  }
  return value
    .split(/[,|]/)
    .map(normalize)
    .filter(Boolean)
}

function valueMatches(input: unknown, published: string, allowContains = false) {
  const normalizedInput = normalize(input)
  const values = publishedValues(published)
  if (!normalizedInput) return false
  if (values.includes("any") || values.includes("all")) return true
  return values.some((value) =>
    allowContains
      ? normalizedInput === value || normalizedInput.includes(value) || value.includes(normalizedInput)
      : normalizedInput === value,
  )
}

function criterionLabel(type: string) {
  const labels: Record<string, string> = {
    state: "State requirement",
    course_level: "Education level",
    course: "Course requirement",
    course_stream: "Course requirement",
    min_percentage: "Academic percentage",
    max_income: "Family income",
    caste_category: "Category",
    gender: "Gender",
    disability: "Disability status",
    age_limit: "Age requirement",
    minority: "Minority status",
    custom: "Additional eligibility requirement",
  }
  return labels[type] ?? "Published eligibility requirement"
}

function unknown(criterion: PublishedCriterion, explanation: string): CriterionEvaluation {
  return {
    criterion,
    result: "unknown",
    label: criterionLabel(criterion.criteriaType),
    explanation,
  }
}

function evaluateCriterion(
  criterion: PublishedCriterion,
  profile: StudentEligibilityProfile,
): CriterionEvaluation {
  const type = normalize(criterion.criteriaType).replace(/ /g, "_")
  const operator = normalize(criterion.operator).replace(/ /g, "_")
  const published = criterion.value
  const label = criterionLabel(criterion.criteriaType)

  if (type === "max_income") {
    const income = parseNumber(profile.annualFamilyIncome)
    const maximum = parseNumber(published)
    if (income === null || maximum === null) return unknown(criterion, "Enter a valid annual family income to compare with the published limit.")
    const matched = operator === "gte" ? income >= maximum : income <= maximum
    return {
      criterion,
      result: matched ? "match" : "unmet",
      label,
      explanation: matched
        ? `Your income of ₹${income.toLocaleString("en-IN")} is within the published limit of ₹${maximum.toLocaleString("en-IN")}.`
        : `Your income of ₹${income.toLocaleString("en-IN")} is above the published limit of ₹${maximum.toLocaleString("en-IN")}.`,
    }
  }

  if (type === "min_percentage") {
    const percentage = parseNumber(profile.academicPercentage)
    const minimum = parseNumber(published)
    if (percentage === null || minimum === null) return unknown(criterion, "Enter your academic percentage to compare with the published minimum.")
    const matched = operator === "lte" ? percentage <= minimum : percentage >= minimum
    return {
      criterion,
      result: matched ? "match" : "unmet",
      label,
      explanation: matched
        ? `Your academic percentage of ${percentage}% meets the published minimum of ${minimum}%.`
        : `Your academic percentage of ${percentage}% is below the published minimum of ${minimum}%.`,
    }
  }

  if (type === "state") {
    if (!profile.state) return unknown(criterion, "Enter your state to compare with the published state requirement.")
    const matched = valueMatches(profile.state, published)
    return {
      criterion,
      result: matched ? "match" : "unmet",
      label,
      explanation: matched
        ? `Your state appears to match the published requirement (${published}).`
        : `This scholarship is published for ${published}; your state is ${profile.state}.`,
    }
  }

  if (type === "course_level") {
    if (!profile.educationLevel) return unknown(criterion, "Enter your education level to compare with the published requirement.")
    const matched = valueMatches(profile.educationLevel, published)
    return {
      criterion,
      result: matched ? "match" : "unmet",
      label,
      explanation: matched
        ? `Your education level appears to match (${published}).`
        : `This scholarship is published for ${published}; your level is ${profile.educationLevel}.`,
    }
  }

  if (type === "course" || type === "course_stream") {
    if (!profile.course) return unknown(criterion, "Enter your course or stream to compare with the published requirement.")
    const matched = valueMatches(profile.course, published, true)
    return {
      criterion,
      result: matched ? "match" : "unmet",
      label,
      explanation: matched
        ? `Your course appears to match the published course requirement (${published}).`
        : `The published course requirement is ${published}; your course is ${profile.course}.`,
    }
  }

  if (type === "caste_category") {
    if (!profile.category) return unknown(criterion, "This scholarship has a category requirement; select your category to compare it.")
    const matched = valueMatches(profile.category, published)
    return {
      criterion,
      result: matched ? "match" : "unmet",
      label,
      explanation: matched
        ? `Your category appears to match the published requirement (${published}).`
        : `This scholarship is published for ${published}; your category is ${profile.category}.`,
    }
  }

  if (type === "gender") {
    if (!profile.gender) return unknown(criterion, "Gender was not entered for this gender-specific published criterion.")
    const matched = valueMatches(profile.gender, published)
    return {
      criterion,
      result: matched ? "match" : "unmet",
      label,
      explanation: matched
        ? `Your gender appears to match the published requirement (${published}).`
        : `This scholarship is published for ${published}; the entered gender is ${profile.gender}.`,
    }
  }

  if (type === "disability") {
    if (!profile.disabilityStatus || profile.disabilityStatus === "prefer_not_to_say") {
      return unknown(criterion, "Disability status was not used because it was not provided.")
    }
    const disabilityValue = profile.disabilityStatus === "yes" ? "yes" : "no"
    const matched = valueMatches(disabilityValue, published)
    return {
      criterion,
      result: matched ? "match" : "unmet",
      label,
      explanation: matched
        ? `Your disability status appears to match the published requirement (${published}).`
        : `The published disability requirement is ${published}.`,
    }
  }

  if (type === "age_limit") {
    const age = parseNumber(profile.age)
    const maximum = parseNumber(published)
    if (age === null || maximum === null) return unknown(criterion, "Enter your age to compare with this published age requirement.")
    const matched = operator === "gte" ? age >= maximum : operator === "equals" ? age === maximum : age <= maximum
    return {
      criterion,
      result: matched ? "match" : "unmet",
      label,
      explanation: matched
        ? `Your age appears to meet the published requirement of ${published}.`
        : `Your age does not meet the published requirement of ${published}.`,
    }
  }

  if (type === "minority") {
    const input = profile.otherAttributes?.minority
    if (input === undefined || input === "") return unknown(criterion, "This scholarship has a minority-status requirement that was not provided.")
    const matched = valueMatches(input, published)
    return {
      criterion,
      result: matched ? "match" : "unmet",
      label,
      explanation: matched ? "Your entered minority status appears to match the published requirement." : "Your entered minority status does not match the published requirement.",
    }
  }

  const otherValue = profile.otherAttributes?.[criterion.criteriaType] ?? profile.otherAttributes?.custom
  if (otherValue === undefined || otherValue === "") {
    return unknown(criterion, `The published requirement “${published}” needs additional information or official verification.`)
  }
  const matched = valueMatches(otherValue, published, true)
  return {
    criterion,
    result: matched ? "match" : "unmet",
    label,
    explanation: matched
      ? "The entered additional information appears to match the published requirement."
      : `The entered additional information does not match “${published}”.`,
  }
}

function implicitCriteria(scholarship: EligibilityScholarship): PublishedCriterion[] {
  const criteria: PublishedCriterion[] = []
  if (scholarship.state && normalize(scholarship.state) !== "national") {
    criteria.push({ criteriaType: "state", operator: "equals", value: scholarship.state })
  }
  if (scholarship.courseLevel && normalize(scholarship.courseLevel) !== "any") {
    criteria.push({ criteriaType: "course_level", operator: "equals", value: scholarship.courseLevel })
  }
  if (scholarship.courseStream && normalize(scholarship.courseStream) !== "any") {
    criteria.push({ criteriaType: "course_stream", operator: "equals", value: scholarship.courseStream })
  }
  if (scholarship.genderEligibility && normalize(scholarship.genderEligibility) !== "any") {
    criteria.push({ criteriaType: "gender", operator: "equals", value: scholarship.genderEligibility })
  }
  return criteria
}

export function getRelevantCriterionTypes(scholarships: EligibilityScholarship[]) {
  const criteria = scholarships.flatMap((scholarship) => [
    ...implicitCriteria(scholarship),
    ...(scholarship.eligibilityCriteria ?? []),
  ])
  return new Set(criteria.map((criterion) => normalize(criterion.criteriaType).replace(/ /g, "_")))
}

export function evaluateScholarship(
  scholarship: EligibilityScholarship,
  profile: StudentEligibilityProfile,
): EligibilityEvaluation {
  const criteria = [
    ...implicitCriteria(scholarship),
    ...(scholarship.eligibilityCriteria ?? []).slice().sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
  ]
  const evaluations: CriterionEvaluation[] = criteria.length > 0
    ? criteria.map((criterion) => evaluateCriterion(criterion, profile))
    : [
        unknown(
          { criteriaType: "custom", operator: "unknown", value: "published criteria unavailable" },
          "No structured published criteria are available for this scholarship; verify the official requirements.",
        ),
      ]
  const matches = evaluations.filter((evaluation) => evaluation.result === "match")
  const unmet = evaluations.filter((evaluation) => evaluation.result === "unmet")
  const unknownCriteria = evaluations.filter((evaluation) => evaluation.result === "unknown")

  let status: EligibilityStatus
  let explanation: string
  if (unmet.length > 0) {
    status = "does_not_meet"
    explanation = "At least one published criterion does not match the information entered."
  } else if (unknownCriteria.length > 0) {
    status = "needs_verification"
    explanation = "No published criterion was contradicted, but one or more requirements could not be verified from the information entered."
  } else {
    status = "potentially_eligible"
    explanation = "All published criteria that could be checked matched the information entered."
  }

  return { status, matches, unmet, unknown: unknownCriteria, explanation }
}