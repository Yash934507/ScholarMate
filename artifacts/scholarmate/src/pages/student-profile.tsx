import { useEffect, useState } from "react"
import { Link } from "wouter"
import {
  getGetStudentProfileQueryKey,
  useGetStudentProfile,
  useUpdateStudentProfile,
  type StudentProfile,
  type StudentProfileInput,
} from "@workspace/api-client-react"
import { ArrowLeft, CheckCircle2, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQueryClient } from "@tanstack/react-query"

type ProfileForm = {
  fullName: string
  phone: string
  state: string
  city: string
  college: string
  university: string
  course: string
  educationLevel: string
  academicPercentage: string
  annualFamilyIncome: string
  dateOfBirth: string
  gender: string
  category: string
  disabilityStatus: string
  minorityCommunity: string
}

const emptyForm: ProfileForm = {
  fullName: "",
  phone: "",
  state: "",
  city: "",
  college: "",
  university: "",
  course: "",
  educationLevel: "",
  academicPercentage: "",
  annualFamilyIncome: "",
  dateOfBirth: "",
  gender: "",
  category: "",
  disabilityStatus: "",
  minorityCommunity: "",
}

function profileToForm(profile: StudentProfile): ProfileForm {
  return {
    fullName: profile.fullName ?? "",
    phone: profile.phone ?? "",
    state: profile.state ?? "",
    city: profile.city ?? "",
    college: profile.college ?? "",
    university: profile.university ?? "",
    course: profile.course ?? "",
    educationLevel: profile.educationLevel ?? "",
    academicPercentage: profile.academicPercentage == null ? "" : String(profile.academicPercentage),
    annualFamilyIncome: profile.annualFamilyIncome == null ? "" : String(profile.annualFamilyIncome),
    dateOfBirth: profile.dateOfBirth ?? "",
    gender: profile.gender ?? "",
    category: profile.category ?? "",
    disabilityStatus: profile.disabilityStatus ?? "",
    minorityCommunity: profile.minorityCommunity ?? "",
  }
}

function nullable(value: string): string | null {
  const trimmed = value.trim()
  return trimmed === "" ? null : trimmed
}

function numberOrNull(value: string): number | null {
  const trimmed = value.trim()
  if (trimmed === "") return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

export default function StudentProfile() {
  const queryClient = useQueryClient()
  const profileQuery = useGetStudentProfile({ query: { queryKey: getGetStudentProfileQueryKey(), retry: false } })
  const updateMutation = useUpdateStudentProfile({
    mutation: {
      onSuccess: (profile) => {
        queryClient.setQueryData(getGetStudentProfileQueryKey(), profile)
        setForm(profileToForm(profile))
        setSaved(true)
        window.setTimeout(() => setSaved(false), 2500)
      },
    },
  })
  const [form, setForm] = useState<ProfileForm>(emptyForm)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profileQuery.data) setForm(profileToForm(profileQuery.data))
  }, [profileQuery.data])

  const setField = (field: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data: StudentProfileInput = {
      fullName: form.fullName.trim(),
      phone: nullable(form.phone),
      state: nullable(form.state),
      city: nullable(form.city),
      college: nullable(form.college),
      university: nullable(form.university),
      course: nullable(form.course),
      educationLevel: nullable(form.educationLevel),
      academicPercentage: numberOrNull(form.academicPercentage),
      annualFamilyIncome: numberOrNull(form.annualFamilyIncome),
      dateOfBirth: nullable(form.dateOfBirth),
      gender: nullable(form.gender),
      category: nullable(form.category),
      disabilityStatus: nullable(form.disabilityStatus),
      minorityCommunity: nullable(form.minorityCommunity),
    }
    updateMutation.mutate({ data })
  }

  if (profileQuery.isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center gap-2 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /> Loading your profile…</div>
  }

  if (profileQuery.isError) {
    return <div className="container mx-auto max-w-3xl px-4 py-20 text-center"><h1 className="text-2xl font-bold">We couldn’t load your profile</h1><p className="mt-2 text-muted-foreground">Please refresh and try again.</p></div>
  }

  return (
    <div className="bg-muted/20 min-h-screen pb-20">
      <div className="bg-primary text-primary-foreground py-8 border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/dashboard" className="inline-flex items-center text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors text-sm font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-primary-foreground/80 mt-2">Keep your details current for more accurate scholarship matches.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-8">
        <form className="space-y-8" onSubmit={submit}>
          <Card className="shadow-sm">
            <CardHeader><CardTitle>Personal information</CardTitle><CardDescription>Your email is managed securely by Clerk and cannot be edited here.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Full name" id="fullName" value={form.fullName} onChange={(value) => setField("fullName", value)} required />
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" value={profileQuery.data?.email ?? ""} disabled className="bg-muted" />
                </div>
                <Field label="Phone number (optional)" id="phone" type="tel" value={form.phone} onChange={(value) => setField("phone", value)} />
                <Field label="Date of birth (optional)" id="dateOfBirth" type="date" value={form.dateOfBirth} onChange={(value) => setField("dateOfBirth", value)} />
                <SelectField label="Gender (optional)" value={form.gender} onChange={(value) => setField("gender", value)} items={[["female", "Female"], ["male", "Male"], ["other", "Other"], ["prefer_not_to_say", "Prefer not to say"]]} />
                <SelectField label="Caste category (optional)" value={form.category} onChange={(value) => setField("category", value)} items={[["general", "General / Open"], ["obc", "OBC"], ["sc", "SC"], ["st", "ST"], ["ews", "EWS"], ["vjnt", "VJ / NT"]]} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                <SelectField label="State of residence" value={form.state} onChange={(value) => setField("state", value)} items={[["Maharashtra", "Maharashtra"], ["Karnataka", "Karnataka"], ["Delhi", "Delhi"], ["Gujarat", "Gujarat"], ["Other", "Other state"]]} />
                <Field label="City / district" id="city" value={form.city} onChange={(value) => setField("city", value)} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader><CardTitle>Academic details</CardTitle><CardDescription>Tell us where and what you are studying.</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectField label="Education level" value={form.educationLevel} onChange={(value) => setField("educationLevel", value)} items={[["School", "School (11th / 12th)"], ["Diploma", "Diploma"], ["UG", "Undergraduate (UG)"], ["PG", "Postgraduate (PG)"], ["PhD", "PhD"]]} />
                <Field label="Course / field of study" id="course" value={form.course} onChange={(value) => setField("course", value)} />
                <Field label="College" id="college" value={form.college} onChange={(value) => setField("college", value)} />
                <Field label="University" id="university" value={form.university} onChange={(value) => setField("university", value)} />
                <Field label="Academic percentage" id="academicPercentage" type="number" min="0" max="100" step="0.01" value={form.academicPercentage} onChange={(value) => setField("academicPercentage", value)} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-amber-200 dark:border-amber-900/50">
            <CardHeader className="bg-amber-50/50 dark:bg-amber-950/10 border-b border-amber-100 dark:border-amber-900/30"><CardTitle className="text-amber-800 dark:text-amber-400">Eligibility details</CardTitle><CardDescription>These details help you compare scholarships. They are not a guarantee of eligibility.</CardDescription></CardHeader>
            <CardContent className="space-y-7 pt-6">
              <div className="space-y-3">
                <Label>Annual family income</Label>
                <SelectField label="" value={form.annualFamilyIncome} onChange={(value) => setField("annualFamilyIncome", value)} items={[["100000", "Below ₹1,00,000"], ["250000", "₹1,00,001 – ₹2,50,000"], ["500000", "₹2,50,001 – ₹5,00,000"], ["800000", "₹5,00,001 – ₹8,00,000"], ["800001", "Above ₹8,00,000"]]} />
              </div>
              <div className="space-y-3">
                <Label>Disability status</Label>
                <RadioGroup value={form.disabilityStatus} onValueChange={(value) => setField("disabilityStatus", value)} className="flex flex-wrap gap-4">
                  <RadioOption value="yes" id="disability-yes" label="Yes" />
                  <RadioOption value="no" id="disability-no" label="No" />
                  <RadioOption value="prefer_not_to_say" id="disability-prefer" label="Prefer not to say" />
                </RadioGroup>
              </div>
              <Field label="Minority community (optional)" id="minorityCommunity" placeholder="e.g. Muslim, Christian, Sikh, Buddhist, Jain, Parsi" value={form.minorityCommunity} onChange={(value) => setField("minorityCommunity", value)} />
            </CardContent>
          </Card>

          <div className="sticky bottom-4 bg-background/90 backdrop-blur-md p-4 rounded-xl border shadow-lg flex items-center justify-between gap-4 z-10">
            <div className="text-sm text-muted-foreground">{saved && <span className="inline-flex items-center gap-2 text-green-700"><CheckCircle2 className="h-4 w-4" /> Profile saved</span>}{updateMutation.isError && <span className="text-destructive">Couldn’t save your profile. Check the fields and try again.</span>}</div>
            <Button disabled={updateMutation.isPending || form.fullName.trim().length === 0} className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
              {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, id, value, onChange, type = "text", placeholder, required, min, max, step }: { label: string; id: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; required?: boolean; min?: string; max?: string; step?: string }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}{required && <span className="text-destructive"> *</span>}</Label><Input id={id} type={type} value={value} placeholder={placeholder} required={required} min={min} max={max} step={step} onChange={(event) => onChange(event.target.value)} /></div>
}

function SelectField({ label, value, onChange, items }: { label: string; value: string; onChange: (value: string) => void; items: string[][] }) {
  return <div className="space-y-2">{label && <Label>{label}</Label>}<Select value={value || undefined} onValueChange={onChange}><SelectTrigger><SelectValue placeholder={label ? `Select ${label.toLowerCase()}` : "Select an income range"} /></SelectTrigger><SelectContent>{items.map(([itemValue, itemLabel]) => <SelectItem key={itemValue} value={itemValue}>{itemLabel}</SelectItem>)}</SelectContent></Select></div>
}

function RadioOption({ value, id, label }: { value: string; id: string; label: string }) {
  return <div className="flex items-center gap-2"><RadioGroupItem value={value} id={id} /><Label htmlFor={id} className="font-normal cursor-pointer">{label}</Label></div>
}