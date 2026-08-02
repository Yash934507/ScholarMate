import { useEffect, useState } from "react"
import { useLocation, useParams, Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { NativeSelect } from "@/components/ui/native-select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import {
  useAdminListProviders,
  useAdminCreateProvider,
  useAdminGetScholarship,
  useAdminCreateScholarship,
  useAdminUpdateScholarship,
  useAdminAddScholarshipSource,
  useAdminDeleteScholarshipSource,
  useAdminAddEligibilityCriteria,
  useAdminDeleteEligibilityCriteria,
  useAdminAddRequiredDocument,
  useAdminDeleteRequiredDocument,
} from "@workspace/api-client-react"

const emptyForm = {
  providerId: "",
  title: "",
  description: "",
  eligibilitySummary: "",
  amountMin: "",
  amountMax: "",
  frequency: "annual",
  coverageType: "",
  applicationMethod: "online_portal",
  applicationUrl: "",
  deadline: "",
  state: "National",
  courseLevel: "Any",
  genderEligibility: "any",
  lastVerifiedDate: new Date().toISOString().slice(0, 10),
}

export default function AdminScholarshipForm() {
  const { toast } = useToast()
  const [, setLocation] = useLocation()
  const params = useParams<{ id?: string }>()
  const isEdit = Boolean(params.id)
  const scholarshipId = params.id ? Number(params.id) : undefined

  const [form, setForm] = useState(emptyForm)
  const [newProviderOpen, setNewProviderOpen] = useState(false)
  const [newProviderName, setNewProviderName] = useState("")
  const [newProviderType, setNewProviderType] = useState("govt")

  const [pendingSource, setPendingSource] = useState({
    sourceName: "", sourceUrl: "", sourceType: "official_government", sourceRole: "official",
  })
  const [pendingCriteria, setPendingCriteria] = useState({
    criteriaType: "max_income", operator: "lte", value: "",
  })
  const [pendingDocument, setPendingDocument] = useState({ documentName: "" })

  const providersQuery = useAdminListProviders()
  const detailQuery = useAdminGetScholarship(scholarshipId ?? 0, {
    query: { enabled: isEdit } as any,
  })

  useEffect(() => {
    if (isEdit && detailQuery.data) {
      const d = detailQuery.data
      setForm({
        providerId: String(d.providerId),
        title: d.title,
        description: d.description,
        eligibilitySummary: d.eligibilitySummary,
        amountMin: d.amountMin != null ? String(d.amountMin) : "",
        amountMax: d.amountMax != null ? String(d.amountMax) : "",
        frequency: d.frequency,
        coverageType: d.coverageType ?? "",
        applicationMethod: d.applicationMethod,
        applicationUrl: d.applicationUrl,
        deadline: d.deadline ?? "",
        state: d.state,
        courseLevel: d.courseLevel,
        genderEligibility: d.genderEligibility,
        lastVerifiedDate: d.lastVerifiedDate,
      })
    }
  }, [isEdit, detailQuery.data])

  const [draftSources, setDraftSources] = useState<
    { sourceName: string; sourceUrl: string; sourceType: string; sourceRole: string }[]
  >([])

  const createProviderMutation = useAdminCreateProvider({
    mutation: {
      onSuccess: (provider) => {
        toast({ title: "Provider created" })
        providersQuery.refetch()
        setForm((f) => ({ ...f, providerId: String(provider.id) }))
        setNewProviderOpen(false)
        setNewProviderName("")
      },
      onError: (err: any) =>
        toast({ title: "Could not create provider", description: String(err?.message ?? err), variant: "destructive" }),
    },
  })

  const createMutation = useAdminCreateScholarship({
    mutation: {
      onSuccess: (created) => {
        toast({ title: "Scholarship created" })
        setLocation(`/admin/scholarships/${created.id}/edit`)
      },
      onError: (err: any) =>
        toast({ title: "Could not create scholarship", description: String(err?.message ?? err), variant: "destructive" }),
    },
  })

  const updateMutation = useAdminUpdateScholarship({
    mutation: {
      onSuccess: () => {
        toast({ title: "Changes saved" })
        detailQuery.refetch()
      },
      onError: (err: any) =>
        toast({ title: "Could not save changes", description: String(err?.message ?? err), variant: "destructive" }),
    },
  })

  const addSourceMutation = useAdminAddScholarshipSource({
    mutation: {
      onSuccess: () => { toast({ title: "Source added" }); detailQuery.refetch() },
      onError: (err: any) => toast({ title: "Could not add source", description: String(err?.message ?? err), variant: "destructive" }),
    },
  })
  const deleteSourceMutation = useAdminDeleteScholarshipSource({
    mutation: {
      onSuccess: () => { toast({ title: "Source removed" }); detailQuery.refetch() },
    },
  })
  const addCriteriaMutation = useAdminAddEligibilityCriteria({
    mutation: {
      onSuccess: () => { toast({ title: "Criterion added" }); detailQuery.refetch() },
      onError: (err: any) => toast({ title: "Could not add criterion", description: String(err?.message ?? err), variant: "destructive" }),
    },
  })
  const deleteCriteriaMutation = useAdminDeleteEligibilityCriteria({
    mutation: {
      onSuccess: () => { toast({ title: "Criterion removed" }); detailQuery.refetch() },
    },
  })
  const addDocumentMutation = useAdminAddRequiredDocument({
    mutation: {
      onSuccess: () => { toast({ title: "Document added" }); detailQuery.refetch() },
      onError: (err: any) => toast({ title: "Could not add document", description: String(err?.message ?? err), variant: "destructive" }),
    },
  })
  const deleteDocumentMutation = useAdminDeleteRequiredDocument({
    mutation: {
      onSuccess: () => { toast({ title: "Document removed" }); detailQuery.refetch() },
    },
  })

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.providerId) {
      toast({ title: "Select a provider first", variant: "destructive" })
      return
    }

    const basePayload = {
      providerId: Number(form.providerId),
      title: form.title,
      description: form.description,
      eligibilitySummary: form.eligibilitySummary,
      amountMin: form.amountMin ? Number(form.amountMin) : undefined,
      amountMax: form.amountMax ? Number(form.amountMax) : undefined,
      frequency: form.frequency as any,
      coverageType: form.coverageType || undefined,
      applicationMethod: form.applicationMethod as any,
      applicationUrl: form.applicationUrl,
      deadline: form.deadline || undefined,
      state: form.state,
      courseLevel: form.courseLevel as any,
      genderEligibility: form.genderEligibility as any,
      lastVerifiedDate: form.lastVerifiedDate,
    }

    if (isEdit && scholarshipId) {
      updateMutation.mutate({ id: scholarshipId, data: basePayload })
    } else {
      if (draftSources.length === 0 || !draftSources.some((s) => s.sourceRole === "official")) {
        toast({
          title: "At least one official source is required",
          description: "Add a source with role \"official\" below before creating the scholarship.",
          variant: "destructive",
        })
        return
      }
      createMutation.mutate({
        data: { ...basePayload, sources: draftSources as any },
      })
    }
  }

  const providers = providersQuery.data?.providers ?? []
  const detail = detailQuery.data

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="border-b bg-primary/5">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/admin/scholarships">
            <Button variant="ghost" size="icon" data-testid="button-back"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-primary">
              {isEdit ? "Edit Scholarship" : "New Scholarship"}
            </h1>
            {detail && (
              <div className="flex gap-2 mt-1">
                <Badge variant="outline">{detail.status}</Badge>
                <Badge variant="outline">{detail.verificationStatus}</Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="container mx-auto px-4 py-8 max-w-3xl space-y-8">
        <section className="space-y-4">
          <h2 className="font-semibold text-lg">Basic details</h2>

          <div>
            <Label htmlFor="provider">Provider</Label>
            <div className="flex gap-2">
              <NativeSelect
                id="provider"
                data-testid="select-provider"
                value={form.providerId}
                onChange={(e) => set("providerId", e.target.value)}
              >
                <option value="">Select a provider…</option>
                {providers.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.providerType})</option>
                ))}
              </NativeSelect>
              <Button type="button" variant="outline" onClick={() => setNewProviderOpen((o) => !o)} data-testid="button-toggle-new-provider">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {newProviderOpen && (
              <div className="mt-2 p-3 border rounded-md space-y-2 bg-muted/30">
                <Input
                  placeholder="Provider name"
                  value={newProviderName}
                  onChange={(e) => setNewProviderName(e.target.value)}
                  data-testid="input-new-provider-name"
                />
                <NativeSelect value={newProviderType} onChange={(e) => setNewProviderType(e.target.value)}>
                  <option value="govt">Government</option>
                  <option value="ngo">NGO</option>
                  <option value="private">Private</option>
                  <option value="university">University</option>
                </NativeSelect>
                <Button
                  type="button"
                  size="sm"
                  data-testid="button-create-provider"
                  onClick={() =>
                    createProviderMutation.mutate({ data: { name: newProviderName, providerType: newProviderType as any } })
                  }
                >
                  Create provider
                </Button>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" data-testid="input-title" value={form.title} onChange={(e) => set("title", e.target.value)} required minLength={5} />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" data-testid="input-description" value={form.description} onChange={(e) => set("description", e.target.value)} required minLength={20} rows={4} />
          </div>

          <div>
            <Label htmlFor="eligibilitySummary">Eligibility summary (short)</Label>
            <Textarea id="eligibilitySummary" data-testid="input-eligibility-summary" value={form.eligibilitySummary} onChange={(e) => set("eligibilitySummary", e.target.value)} required minLength={5} maxLength={280} rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amountMin">Amount min (INR)</Label>
              <Input id="amountMin" type="number" data-testid="input-amount-min" value={form.amountMin} onChange={(e) => set("amountMin", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="amountMax">Amount max (INR)</Label>
              <Input id="amountMax" type="number" data-testid="input-amount-max" value={form.amountMax} onChange={(e) => set("amountMax", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <NativeSelect id="frequency" data-testid="select-frequency" value={form.frequency} onChange={(e) => set("frequency", e.target.value)}>
                <option value="one_time">One-time</option>
                <option value="annual">Annual</option>
                <option value="monthly">Monthly</option>
              </NativeSelect>
            </div>
            <div>
              <Label htmlFor="applicationMethod">Application method</Label>
              <NativeSelect id="applicationMethod" data-testid="select-application-method" value={form.applicationMethod} onChange={(e) => set("applicationMethod", e.target.value)}>
                <option value="online_portal">Online portal</option>
                <option value="offline_form">Offline form</option>
                <option value="email">Email</option>
                <option value="in_person">In person</option>
              </NativeSelect>
            </div>
          </div>

          <div>
            <Label htmlFor="applicationUrl">Official application URL</Label>
            <Input id="applicationUrl" type="url" data-testid="input-application-url" value={form.applicationUrl} onChange={(e) => set("applicationUrl", e.target.value)} required placeholder="https://…" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" type="date" data-testid="input-deadline" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="lastVerifiedDate">Last verified date</Label>
              <Input id="lastVerifiedDate" type="date" data-testid="input-last-verified-date" value={form.lastVerifiedDate} onChange={(e) => set("lastVerifiedDate", e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" data-testid="input-state" value={form.state} onChange={(e) => set("state", e.target.value)} />
            </div>
            <div>
              <Label htmlFor="courseLevel">Course level</Label>
              <NativeSelect id="courseLevel" data-testid="select-course-level" value={form.courseLevel} onChange={(e) => set("courseLevel", e.target.value)}>
                {["School", "Diploma", "UG", "PG", "PhD", "Any"].map((c) => <option key={c} value={c}>{c}</option>)}
              </NativeSelect>
            </div>
            <div>
              <Label htmlFor="genderEligibility">Gender eligibility</Label>
              <NativeSelect id="genderEligibility" data-testid="select-gender" value={form.genderEligibility} onChange={(e) => set("genderEligibility", e.target.value)}>
                {["any", "male", "female", "other"].map((g) => <option key={g} value={g}>{g}</option>)}
              </NativeSelect>
            </div>
          </div>

          <Button type="submit" data-testid="button-save-scholarship" disabled={createMutation.isPending || updateMutation.isPending}>
            {isEdit ? "Save changes" : "Create scholarship"}
          </Button>
        </section>

        {/* Sources */}
        <section className="space-y-3 border-t pt-6">
          <h2 className="font-semibold text-lg">Sources</h2>
          <p className="text-sm text-muted-foreground">
            At most one "official" and one "application" source; "information" sources can repeat.
            {!isEdit && " A source with role \"official\" is required before creating."}
          </p>

          {(isEdit ? detail?.sources ?? [] : draftSources).map((s, i) => (
            <div key={isEdit ? (s as any).id : i} className="flex items-center justify-between border rounded-md p-3 text-sm" data-testid={`row-source-${i}`}>
              <div>
                <div className="font-medium">{s.sourceName} <Badge variant="outline" className="ml-2">{s.sourceRole}</Badge></div>
                <div className="text-muted-foreground break-all">{s.sourceUrl}</div>
              </div>
              <Button
                type="button" size="icon" variant="ghost"
                onClick={() => isEdit
                  ? deleteSourceMutation.mutate({ id: scholarshipId as number, sourceId: (s as any).id })
                  : setDraftSources((arr) => arr.filter((_, idx) => idx !== i))
                }
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-2 border rounded-md p-3 bg-muted/30">
            <Input placeholder="Source name" value={pendingSource.sourceName} data-testid="input-source-name"
              onChange={(e) => setPendingSource((p) => ({ ...p, sourceName: e.target.value }))} />
            <Input placeholder="https://…" value={pendingSource.sourceUrl} data-testid="input-source-url"
              onChange={(e) => setPendingSource((p) => ({ ...p, sourceUrl: e.target.value }))} />
            <NativeSelect value={pendingSource.sourceType} data-testid="select-source-type"
              onChange={(e) => setPendingSource((p) => ({ ...p, sourceType: e.target.value }))}>
              <option value="official_government">Official government</option>
              <option value="institutional">Institutional</option>
              <option value="ngo_direct">NGO direct</option>
              <option value="aggregator">Aggregator</option>
            </NativeSelect>
            <NativeSelect value={pendingSource.sourceRole} data-testid="select-source-role"
              onChange={(e) => setPendingSource((p) => ({ ...p, sourceRole: e.target.value }))}>
              <option value="official">Official</option>
              <option value="information">Information</option>
              <option value="application">Application</option>
            </NativeSelect>
            <Button
              type="button" className="col-span-2" data-testid="button-add-source"
              onClick={() => {
                if (!pendingSource.sourceName || !pendingSource.sourceUrl) return
                if (isEdit && scholarshipId) {
                  addSourceMutation.mutate({ id: scholarshipId, data: pendingSource as any })
                } else {
                  setDraftSources((arr) => [...arr, pendingSource])
                }
                setPendingSource({ sourceName: "", sourceUrl: "", sourceType: "official_government", sourceRole: "official" })
              }}
            >
              <Plus className="h-4 w-4 mr-1" /> Add source
            </Button>
          </div>
        </section>

        {/* Eligibility criteria — edit mode only */}
        {isEdit && (
          <section className="space-y-3 border-t pt-6">
            <h2 className="font-semibold text-lg">Eligibility criteria</h2>
            {(detail?.eligibilityCriteria ?? []).map((c) => (
              <div key={c.id} className="flex items-center justify-between border rounded-md p-3 text-sm">
                <span>{c.criteriaType} {c.operator} {c.value}</span>
                <Button type="button" size="icon" variant="ghost" onClick={() => deleteCriteriaMutation.mutate({ id: scholarshipId as number, criteriaId: c.id })}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-2 border rounded-md p-3 bg-muted/30">
              <NativeSelect value={pendingCriteria.criteriaType} onChange={(e) => setPendingCriteria((p) => ({ ...p, criteriaType: e.target.value }))}>
                {["caste_category", "gender", "max_income", "min_percentage", "course_level", "state", "age_limit", "disability", "minority", "custom"].map((c) => <option key={c} value={c}>{c}</option>)}
              </NativeSelect>
              <NativeSelect value={pendingCriteria.operator} onChange={(e) => setPendingCriteria((p) => ({ ...p, operator: e.target.value }))}>
                {["equals", "not_equals", "lte", "gte", "in", "between"].map((o) => <option key={o} value={o}>{o}</option>)}
              </NativeSelect>
              <Input placeholder="Value" value={pendingCriteria.value} onChange={(e) => setPendingCriteria((p) => ({ ...p, value: e.target.value }))} />
              <Button
                type="button" className="col-span-3" size="sm"
                onClick={() => {
                  if (!pendingCriteria.value) return
                  addCriteriaMutation.mutate({ id: scholarshipId as number, data: pendingCriteria as any })
                  setPendingCriteria({ criteriaType: "max_income", operator: "lte", value: "" })
                }}
              >
                <Plus className="h-4 w-4 mr-1" /> Add criterion
              </Button>
            </div>
          </section>
        )}

        {/* Required documents — edit mode only */}
        {isEdit && (
          <section className="space-y-3 border-t pt-6">
            <h2 className="font-semibold text-lg">Required documents</h2>
            {(detail?.requiredDocuments ?? []).map((d) => (
              <div key={d.id} className="flex items-center justify-between border rounded-md p-3 text-sm">
                <span>{d.documentName}</span>
                <Button type="button" size="icon" variant="ghost" onClick={() => deleteDocumentMutation.mutate({ id: scholarshipId as number, docId: d.id })}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2 border rounded-md p-3 bg-muted/30">
              <Input placeholder="Document name" value={pendingDocument.documentName} onChange={(e) => setPendingDocument({ documentName: e.target.value })} />
              <Button
                type="button"
                onClick={() => {
                  if (!pendingDocument.documentName) return
                  addDocumentMutation.mutate({ id: scholarshipId as number, data: pendingDocument })
                  setPendingDocument({ documentName: "" })
                }}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          </section>
        )}
      </form>
    </div>
  )
}
