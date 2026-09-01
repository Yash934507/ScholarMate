import type { MockScholarship } from "./mock-data"

export type ComparisonFieldKey =
  | "name"
  | "provider"
  | "educationLevel"
  | "eligibleCourses"
  | "state"
  | "incomeCriteria"
  | "academicCriteria"
  | "benefits"
  | "requiredDocuments"
  | "deadline"
  | "applicationMethod"
  | "officialSource"
  | "lastVerifiedDate"

export type ComparisonField = {
  key: ComparisonFieldKey
  label: string
  value: string
  link?: string
  isMissing?: boolean
}

function formatCurrency(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return "Amount not specified"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDate(date: string | null | undefined) {
  if (!date) return "Deadline not specified"
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export function comparisonFieldsFor(scholarship: MockScholarship): ComparisonField[] {
  const missing = (key: ComparisonFieldKey, label: string, value: string): ComparisonField => ({
    key,
    label,
    value,
    isMissing: true,
  })

  return [
    { key: "name", label: "Scholarship name", value: scholarship.title },
    { key: "provider", label: "Provider", value: scholarship.providerName },
    {
      key: "educationLevel",
      label: "Education level",
      value: scholarship.courseLevel === "Any" ? "All education levels" : scholarship.courseLevel,
    },
    {
      key: "eligibleCourses",
      label: "Eligible courses",
      value: scholarship.courseLevel === "Any"
        ? "Course list not specified"
        : `${scholarship.courseLevel} courses; specific course list not specified`,
      isMissing: true,
    },
    { key: "state", label: "State", value: scholarship.state },
    {
      key: "incomeCriteria",
      label: "Income criteria",
      value: scholarship.maxAnnualIncome
        ? `Annual family income up to ${formatCurrency(scholarship.maxAnnualIncome)}`
        : "No maximum income specified",
    },
    {
      key: "academicCriteria",
      label: "Academic criteria",
      value: scholarship.minPercentage
        ? `Minimum academic score: ${scholarship.minPercentage}%`
        : "No minimum percentage specified",
    },
    {
      key: "benefits",
      label: "Benefits",
      value: `${formatCurrency(scholarship.amount)} · ${scholarship.frequency}`,
    },
    missing("requiredDocuments", "Required documents", "Not listed in the current scholarship record"),
    { key: "deadline", label: "Deadline", value: formatDate(scholarship.deadline) },
    {
      key: "applicationMethod",
      label: "Application method",
      value: scholarship.applicationUrl ? "Online application link listed" : "Application method not specified",
      isMissing: !scholarship.applicationUrl,
    },
    {
      key: "officialSource",
      label: "Official source",
      value: scholarship.sourceName,
      link: scholarship.sourceUrl,
      isMissing: !scholarship.sourceUrl,
    },
    missing("lastVerifiedDate", "Last verified date", "Not listed in the current scholarship record"),
  ]
}

export function hasDifference(selected: MockScholarship[], key: ComparisonFieldKey) {
  const values = selected.map((scholarship) => comparisonFieldsFor(scholarship).find((field) => field.key === key)?.value ?? "")
  return new Set(values).size > 1
}

export function toggleSelection(selectedIds: number[], id: number, maximum = 3) {
  if (selectedIds.includes(id)) return selectedIds.filter((selectedId) => selectedId !== id)
  if (selectedIds.length >= maximum) return selectedIds
  return [...selectedIds, id]
}
