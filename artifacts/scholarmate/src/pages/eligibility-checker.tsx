import { useMemo, useState } from "react"
import { useQueries } from "@tanstack/react-query"
import { Link } from "wouter"
import { ArrowLeft, CheckCircle2, CircleAlert, CircleHelp, Loader2, ShieldCheck, XCircle } from "lucide-react"
import {
  getGetScholarshipQueryOptions,
  useListScholarships,
  type Scholarship,
  type ScholarshipDetail,
} from "@workspace/api-client-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import {
  evaluateScholarship,
  getRelevantCriterionTypes,
  type EligibilityScholarship,
  type EligibilityEvaluation,
  type StudentEligibilityProfile,
} from "@/lib/eligibility-engine"

const DISCLAIMER =
  "This result is a preliminary indication based on the information entered and the published criteria available in ScholarMate. Verify the latest requirements on the official scholarship provider website before applying."

const statusCopy = {
  potentially_eligible: {
    label: "Potentially Eligible",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300",
    icon: CheckCircle2,
  },
  does_not_meet: {
    label: "Does Not Meet Published Criteria",
    className: "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300",
    icon: XCircle,
  },
  needs_verification: {
    label: "Needs Verification",
    className: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300",
    icon: CircleHelp,
  },
} as const

type FormState = {
  state: string
  course: string
  educationLevel: string
  academicPercentage: string
  annualFamilyIncome: string
  category: string
  gender: string
  disabilityStatus: "yes" | "no" | "prefer_not_to_say" | ""
  age: string
  otherAttributes: Record<string, string>
}

const initialForm: FormState = {
  state: "",
  course: "",
  educationLevel: "",
  academicPercentage: "",
  annualFamilyIncome: "",
  category: "",
  gender: "",
  disabilityStatus: "",
  age: "",
  otherAttributes: {},
}

function asNumber(value: string) {
  if (!value.trim()) return undefined
  const number = Number(value)
  return Number.isFinite(number) ? number : undefined
}

function toEngineProfile(form: FormState): StudentEligibilityProfile {
  return {
    state: form.state || undefined,
    course: form.course || undefined,
    educationLevel: form.educationLevel || undefined,
    academicPercentage: asNumber(form.academicPercentage),
    annualFamilyIncome: asNumber(form.annualFamilyIncome),
    category: form.category || undefined,
    gender: form.gender || undefined,
    disabilityStatus: form.disabilityStatus || undefined,
    age: asNumber(form.age),
    otherAttributes: form.otherAttributes,
  }
}

function toEngineScholarship(scholarship: Scholarship, detail?: ScholarshipDetail): EligibilityScholarship {
  return {
    state: scholarship.state,
    courseLevel: scholarship.courseLevel,
    courseStream: scholarship.courseStream,
    genderEligibility: scholarship.genderEligibility,
    eligibilityCriteria: detail?.eligibilityCriteria ?? [],
  }
}

function ResultGroup({
  title,
  items,
  tone,
}: {
  title: string
  items: EligibilityEvaluation["matches"]
  tone: "match" | "unmet" | "unknown"
}) {
  if (items.length === 0) return null
  const Icon = tone === "match" ? CheckCircle2 : tone === "unmet" ? XCircle : CircleAlert
  const color = tone === "match" ? "text-emerald-700 dark:text-emerald-400" : tone === "unmet" ? "text-red-700 dark:text-red-400" : "text-amber-700 dark:text-amber-400"
  return (
    <div className="space-y-2">
      <h4 className={`text-sm font-semibold ${color}`}>{title}</h4>
      {items.map((item, index) => (
        <div key={`${item.criterion.criteriaType}-${index}`} className="flex gap-2 text-sm">
          <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${color}`} />
          <div>
            <p className="font-medium">{item.label}</p>
            <p className="text-muted-foreground">{item.explanation}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function EligibilityResultCard({
  scholarship,
  evaluation,
}: {
  scholarship: Scholarship
  evaluation: EligibilityEvaluation
}) {
  const copy = statusCopy[evaluation.status]
  const StatusIcon = copy.icon
  return (
    <Card className="overflow-hidden" data-testid={`eligibility-result-${scholarship.id}`}>
      <CardHeader className="space-y-3 pb-4">
        <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${copy.className}`}>
          <StatusIcon className="h-4 w-4" />
          {copy.label}
        </div>
        <div>
          <CardTitle className="text-xl">
            <Link href={`/scholarships/${scholarship.id}`} className="hover:text-primary">{scholarship.title}</Link>
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">{scholarship.providerName}</p>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{evaluation.explanation}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <ResultGroup title="Matching criteria" items={evaluation.matches} tone="match" />
        <ResultGroup title="Unmet criteria" items={evaluation.unmet} tone="unmet" />
        <ResultGroup title="Unknown or unverifiable criteria" items={evaluation.unknown} tone="unknown" />
        <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{DISCLAIMER}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function EligibilityChecker() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [submittedProfile, setSubmittedProfile] = useState<StudentEligibilityProfile | null>(null)
  const [formError, setFormError] = useState("")

  const scholarshipsQuery = useListScholarships({ page: 1, limit: 50, sortBy: "newest" })
  const detailQueries = useQueries({
    queries: (scholarshipsQuery.data?.scholarships ?? []).map((scholarship) =>
      getGetScholarshipQueryOptions(scholarship.id),
    ),
  })

  const detailsById = useMemo(() => {
    const map = new Map<number, ScholarshipDetail>()
    detailQueries.forEach((query) => {
      if (query.data) map.set(query.data.id, query.data)
    })
    return map
  }, [detailQueries])

  const scholarships = scholarshipsQuery.data?.scholarships ?? []
  const engineScholarships = scholarships.map((scholarship) =>
    toEngineScholarship(scholarship, detailsById.get(scholarship.id)),
  )
  const relevantTypes = getRelevantCriterionTypes(engineScholarships)
  const relevantOtherTypes = Array.from(relevantTypes).filter(
    (type) => !["state", "course_level", "course_stream", "course", "min_percentage", "max_income", "caste_category", "gender", "disability", "age_limit", "minority", "custom"].includes(type),
  )
  const hasCustom = relevantTypes.has("custom")
  const detailsLoading = scholarshipsQuery.isLoading || detailQueries.some((query) => query.isLoading)
  const evaluations = submittedProfile
    ? scholarships.map((scholarship) => ({
        scholarship,
        evaluation: evaluateScholarship(toEngineScholarship(scholarship, detailsById.get(scholarship.id)), submittedProfile),
      }))
    : []

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  function checkEligibility(event: React.FormEvent) {
    event.preventDefault()
    if (!form.state || !form.course || !form.educationLevel || !form.academicPercentage || !form.annualFamilyIncome) {
      setFormError("Enter your state, course, education level, academic percentage, and annual family income to run the preliminary check.")
      return
    }
    setFormError("")
    setSubmittedProfile(toEngineProfile(form))
  }

  function clearCheck() {
    setSubmittedProfile(null)
    setForm(initialForm)
    setFormError("")
  }

  return (
    <div className="min-h-screen bg-muted/10 pb-20">
      <section className="bg-primary py-8 text-primary-foreground">
        <div className="container mx-auto max-w-4xl px-4">
          <Link href="/" className="mb-4 inline-flex items-center text-sm font-medium text-primary-foreground/75 hover:text-primary-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back Home
          </Link>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">Preliminary check</p>
          <h1 className="text-3xl font-bold md:text-4xl">Check scholarship eligibility</h1>
          <p className="mt-2 max-w-2xl text-primary-foreground/80">Compare your information with the published rules available for each active scholarship. This is not a guarantee of eligibility.</p>
        </div>
      </section>

      <main className="container mx-auto max-w-4xl px-4 py-8">
        <Card className="mb-8 shadow-sm">
          <CardHeader>
            <CardTitle>Your information</CardTitle>
            <p className="text-sm text-muted-foreground">Required information is used for the preliminary comparison. Conditional questions appear only when a published scholarship criterion makes them relevant.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={checkEligibility} className="space-y-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="eligibility-state">State</Label>
                  <Input id="eligibility-state" value={form.state} onChange={(event) => update("state", event.target.value)} placeholder="e.g. Maharashtra" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eligibility-course">Course or stream</Label>
                  <Input id="eligibility-course" value={form.course} onChange={(event) => update("course", event.target.value)} placeholder="e.g. B.Tech Computer Science" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eligibility-level">Education level</Label>
                  <NativeSelect id="eligibility-level" value={form.educationLevel} onChange={(event) => update("educationLevel", event.target.value)} required>
                    <option value="">Select level</option>
                    <option value="School">School</option>
                    <option value="Diploma">Diploma</option>
                    <option value="UG">Undergraduate (UG)</option>
                    <option value="PG">Postgraduate (PG)</option>
                    <option value="PhD">PhD</option>
                  </NativeSelect>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eligibility-percentage">Academic percentage</Label>
                  <Input id="eligibility-percentage" type="number" min="0" max="100" step="0.01" value={form.academicPercentage} onChange={(event) => update("academicPercentage", event.target.value)} placeholder="e.g. 78" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eligibility-income">Annual family income (₹)</Label>
                  <Input id="eligibility-income" type="number" min="0" value={form.annualFamilyIncome} onChange={(event) => update("annualFamilyIncome", event.target.value)} placeholder="e.g. 500000" required />
                </div>
                {relevantTypes.has("caste_category") && (
                  <div className="space-y-2">
                    <Label htmlFor="eligibility-category">Category</Label>
                    <NativeSelect id="eligibility-category" value={form.category} onChange={(event) => update("category", event.target.value)}>
                      <option value="">Prefer not to say</option>
                      <option value="General">General / Open</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                      <option value="NT">NT / VJNT / SBC</option>
                      <option value="Minority">Minority</option>
                    </NativeSelect>
                  </div>
                )}
              </div>

              {(relevantTypes.has("gender") || relevantTypes.has("disability")) && (
                <div className="space-y-5 rounded-lg border bg-muted/25 p-4">
                  <div>
                    <h3 className="font-semibold">Conditional information</h3>
                    <p className="text-xs text-muted-foreground">These fields are shown only because at least one published scholarship criterion refers to them. They are used in memory for this check and are not saved.</p>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    {relevantTypes.has("gender") && (
                      <div className="space-y-2">
                        <Label htmlFor="eligibility-gender">Gender</Label>
                        <NativeSelect id="eligibility-gender" value={form.gender} onChange={(event) => update("gender", event.target.value)}>
                          <option value="">Prefer not to say</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </NativeSelect>
                      </div>
                    )}
                    {relevantTypes.has("disability") && (
                      <div className="space-y-2">
                        <Label htmlFor="eligibility-disability">Disability status</Label>
                        <NativeSelect id="eligibility-disability" value={form.disabilityStatus} onChange={(event) => update("disabilityStatus", event.target.value as FormState["disabilityStatus"])}>
                          <option value="">Prefer not to say</option>
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </NativeSelect>
                        <p className="text-xs text-muted-foreground">Optional and not stored by ScholarMate.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(relevantTypes.has("age_limit") || relevantTypes.has("minority") || hasCustom || relevantOtherTypes.length > 0) && (
                <div className="space-y-5 rounded-lg border bg-muted/25 p-4">
                  <div>
                    <h3 className="font-semibold">Other published requirements</h3>
                    <p className="text-xs text-muted-foreground">Only provide information relevant to the displayed requirements. Unclear or unsupported rules will remain marked for verification.</p>
                  </div>
                  {relevantTypes.has("age_limit") && (
                    <div className="max-w-sm space-y-2">
                      <Label htmlFor="eligibility-age">Age</Label>
                      <Input id="eligibility-age" type="number" min="0" value={form.age} onChange={(event) => update("age", event.target.value)} placeholder="e.g. 20" />
                    </div>
                  )}
                  {relevantTypes.has("minority") && (
                    <div className="max-w-sm space-y-2">
                      <Label htmlFor="eligibility-minority">Minority status</Label>
                      <NativeSelect id="eligibility-minority" value={form.otherAttributes.minority ?? ""} onChange={(event) => setForm((previous) => ({ ...previous, otherAttributes: { ...previous.otherAttributes, minority: event.target.value } }))}>
                        <option value="">Prefer not to say</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </NativeSelect>
                    </div>
                  )}
                  {hasCustom && (
                    <div className="space-y-2">
                      <Label htmlFor="eligibility-custom">Additional eligibility information</Label>
                      <Textarea id="eligibility-custom" value={form.otherAttributes.custom ?? ""} onChange={(event) => setForm((previous) => ({ ...previous, otherAttributes: { ...previous.otherAttributes, custom: event.target.value } }))} placeholder="Add information that may help compare a published custom requirement." />
                    </div>
                  )}
                  {relevantOtherTypes.map((type) => (
                    <div key={type} className="space-y-2">
                      <Label htmlFor={`eligibility-${type}`}>{type.replace(/_/g, " ")}</Label>
                      <Input id={`eligibility-${type}`} value={form.otherAttributes[type] ?? ""} onChange={(event) => setForm((previous) => ({ ...previous, otherAttributes: { ...previous.otherAttributes, [type]: event.target.value } }))} />
                    </div>
                  ))}
                </div>
              )}

              {formError && <p className="text-sm font-medium text-destructive" role="alert">{formError}</p>}
              <div className="flex flex-wrap gap-3">
                <Button type="submit" disabled={detailsLoading} data-testid="button-check-eligibility">
                  {detailsLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading criteria…</> : "Check my eligibility"}
                </Button>
                {submittedProfile && <Button type="button" variant="outline" onClick={clearCheck}>Start over</Button>}
              </div>
            </form>
          </CardContent>
        </Card>

        {scholarshipsQuery.isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            Unable to load the published scholarship criteria. Please try again later.
          </div>
        ) : submittedProfile ? (
          <section className="space-y-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Preliminary results</p>
              <h2 className="mt-1 text-2xl font-bold">What the published criteria indicate</h2>
              <p className="mt-2 text-sm text-muted-foreground">{evaluations.length} active scholarship{evaluations.length === 1 ? "" : "s"} checked. Results never guarantee final eligibility.</p>
            </div>
            {evaluations.length === 0 ? (
              <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">There are no active scholarships to evaluate right now.</div>
            ) : (
              evaluations.map(({ scholarship, evaluation }) => <EligibilityResultCard key={scholarship.id} scholarship={scholarship} evaluation={evaluation} />)
            )}
          </section>
        ) : (
          <div className="rounded-xl border border-dashed bg-card p-8 text-center">
            <CircleHelp className="mx-auto mb-3 h-8 w-8 text-primary" />
            <h2 className="font-semibold">Enter your details to see a preliminary comparison</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">ScholarMate will compare your answers with the published criteria for every active scholarship and explain matches, unmet rules, and anything that needs verification.</p>
          </div>
        )}
      </main>
    </div>
  )
}