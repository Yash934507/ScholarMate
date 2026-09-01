import { useEffect, useMemo, useState } from "react"
import { Link } from "wouter"
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  ExternalLink,
  FileText,
  Info,
  Plus,
  Search,
  ShieldCheck,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { mockScholarships, type MockScholarship } from "@/lib/mock-data"
import {
  comparisonFieldsFor,
  hasDifference,
  toggleSelection,
  type ComparisonField,
  type ComparisonFieldKey,
} from "@/lib/comparison-data"

const comparisonSections: { label: string; keys: ComparisonFieldKey[] }[] = [
  {
    label: "At a glance",
    keys: ["name", "provider", "educationLevel", "eligibleCourses", "state"],
  },
  {
    label: "Eligibility & benefits",
    keys: ["incomeCriteria", "academicCriteria", "benefits", "requiredDocuments"],
  },
  {
    label: "Application details",
    keys: ["deadline", "applicationMethod", "officialSource", "lastVerifiedDate"],
  },
]

function fieldMap(scholarship: MockScholarship) {
  return new Map(comparisonFieldsFor(scholarship).map((field) => [field.key, field]))
}

function fieldIsDifferent(selected: MockScholarship[], key: ComparisonFieldKey) {
  return selected.length > 1 && hasDifference(selected, key)
}

function FieldValue({ field }: { field: ComparisonField }) {
  if (field.link) {
    return (
      <a href={field.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
        {field.value} <ExternalLink className="h-3.5 w-3.5" />
      </a>
    )
  }
  return <span className={field.isMissing ? "text-muted-foreground italic" : "text-foreground"}>{field.value}</span>
}

function CompareHeader({ scholarship, onRemove }: { scholarship: MockScholarship; onRemove: () => void }) {
  return (
    <div className="relative min-w-[210px] p-4 sm:min-w-[245px]">
      <button onClick={onRemove} aria-label={`Remove ${scholarship.title}`} className="absolute right-3 top-3 rounded-full border bg-background p-1.5 text-muted-foreground transition-colors hover:border-destructive/30 hover:text-destructive">
        <X className="h-4 w-4" />
      </button>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div>
      <h3 className="pr-5 text-sm font-bold leading-5 text-foreground">{scholarship.title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{scholarship.providerName}</p>
      <Link href={`/scholarships/${scholarship.id}`} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">View details <ArrowRight className="h-3 w-3" /></Link>
    </div>
  )
}

function DifferenceMark() {
  return <Badge variant="outline" className="ml-2 border-amber-200 bg-amber-50 text-[10px] font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">Differs</Badge>
}

export default function CompareScholarships() {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    document.title = "Compare Scholarships | ScholarMate"
  }, [])

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return mockScholarships
      .filter((scholarship) => !query || scholarship.title.toLowerCase().includes(query) || scholarship.providerName.toLowerCase().includes(query))
      .slice(0, 10)
  }, [searchQuery])
  const selectedScholarships = selectedIds.map((id) => mockScholarships.find((scholarship) => scholarship.id === id)).filter((scholarship): scholarship is MockScholarship => Boolean(scholarship))
  const canAdd = selectedIds.length < 3
  const selectionMessage = selectedIds.length === 3 ? "Maximum of 3 scholarships selected" : "Add scholarship to compare"

  const selectScholarship = (id: number) => {
    setSelectedIds((current) => toggleSelection(current, id, 3))
    if (!selectedIds.includes(id)) {
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8fb] pb-20 dark:bg-background">
      <section className="border-b bg-primary py-10 text-primary-foreground md:py-14">
        <div className="container mx-auto max-w-6xl px-4 md:px-8">
          <Link href="/discover" className="mb-6 inline-flex items-center text-sm font-medium text-primary-foreground/70 transition-colors hover:text-primary-foreground"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Discover</Link>
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/65">Make an informed choice</p>
              <h1 className="text-3xl font-bold md:text-4xl">Compare scholarships</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-primary-foreground/75">Put up to three opportunities side by side and see how their published details differ.</p>
            </div>
            <Badge variant="outline" className="w-fit border-primary-foreground/20 bg-white/10 px-3 py-1.5 text-primary-foreground"><ShieldCheck className="mr-2 h-3.5 w-3.5" /> Neutral comparison</Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl space-y-6 px-4 py-8 md:px-8">
        <Card className="border-border/70 shadow-sm">
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div><p className="text-sm font-semibold text-foreground">Your comparison</p><p className="mt-1 text-xs text-muted-foreground">Select 2 or 3 scholarships to unlock the side-by-side view.</p></div>
            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" disabled={!canAdd} className="w-full justify-between gap-3 sm:w-[310px]"><span className="flex min-w-0 items-center gap-2"><Plus className="h-4 w-4 shrink-0 text-accent" /><span className="truncate">{selectionMessage}</span></span><ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" /></Button>
              </PopoverTrigger>
              <PopoverContent className="w-[min(90vw,360px)] p-0" align="end">
                <div className="border-b p-3"><div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search name or provider…" className="pl-9" /></div></div>
                <ScrollArea className="h-[280px]"><div className="space-y-1 p-2">{searchResults.map((scholarship) => { const isSelected = selectedIds.includes(scholarship.id); return <button key={scholarship.id} onClick={() => selectScholarship(scholarship.id)} className={`flex w-full items-start justify-between gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted ${isSelected ? "bg-primary/5" : ""}`}><span className="min-w-0"><span className="block text-sm font-medium leading-5">{scholarship.title}</span><span className="mt-1 block text-xs text-muted-foreground">{scholarship.providerName}</span></span>{isSelected && <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />}</button> })}{searchResults.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No scholarships found.</p>}</div></ScrollArea>
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        {selectedScholarships.length === 0 ? (
          <EmptyComparisonState onSelect={() => setIsSearchOpen(true)} />
        ) : selectedScholarships.length === 1 ? (
          <OneSelectedState scholarship={selectedScholarships[0]} onSelect={() => setIsSearchOpen(true)} onRemove={() => setSelectedIds([])} />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Info className="h-4 w-4 text-primary" /> Highlighted rows contain different published values.</div>
              <span className="text-xs font-medium text-muted-foreground">{selectedScholarships.length} of 3 selected</span>
            </div>
            <ComparisonTable selected={selectedScholarships} onRemove={(id) => setSelectedIds((current) => toggleSelection(current, id, 3))} />
            <MobileComparison selected={selectedScholarships} onRemove={(id) => setSelectedIds((current) => toggleSelection(current, id, 3))} />
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><p className="text-xs leading-5">Comparison details reflect the available scholarship record. Confirm requirements, documents, deadlines, and application instructions on each official source before applying.</p></div>
          </>
        )}
      </div>
    </div>
  )
}

function ComparisonTable({ selected, onRemove }: { selected: MockScholarship[]; onRemove: (id: number) => void }) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse">
          <thead><tr className="border-b bg-muted/25"><th className="sticky left-0 z-10 w-48 min-w-48 border-r bg-muted/25 p-4 text-left align-top text-xs font-semibold uppercase tracking-wider text-muted-foreground">Details</th>{selected.map((scholarship) => <th key={scholarship.id} className="border-r p-0 text-left align-top last:border-r-0"><CompareHeader scholarship={scholarship} onRemove={() => onRemove(scholarship.id)} /></th>)}</tr></thead>
          <tbody>{comparisonSections.map((section) => <SectionRows key={section.label} section={section} selected={selected} />)}</tbody>
        </table>
      </div>
    </div>
  )
}

function SectionRows({ section, selected }: { section: { label: string; keys: ComparisonFieldKey[] }; selected: MockScholarship[] }) {
  return <>{<tr><th colSpan={selected.length + 1} className="border-y bg-muted/35 px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{section.label}</th></tr>}{section.keys.map((key) => { const different = fieldIsDifferent(selected, key); return <tr key={key} className={different ? "bg-amber-50/45 dark:bg-amber-950/10" : ""}><th scope="row" className={`sticky left-0 z-[1] border-r border-b p-4 text-left align-top text-sm font-semibold ${different ? "border-l-2 border-l-amber-400 bg-amber-50/80 dark:bg-amber-950/30" : "bg-card"}`}>{fieldMap(selected[0]).get(key)?.label}{different && <DifferenceMark />}</th>{selected.map((scholarship) => { const field = fieldMap(scholarship).get(key)!; return <td key={scholarship.id} className={`border-b border-r p-4 align-top text-sm leading-6 last:border-r-0 ${different ? "bg-amber-50/30 dark:bg-amber-950/10" : ""}`}><FieldValue field={field} /></td> })}</tr> })}</>
}

function MobileComparison({ selected, onRemove }: { selected: MockScholarship[]; onRemove: (id: number) => void }) {
  return <div className="space-y-4 md:hidden">{selected.map((scholarship) => { const fields = fieldMap(scholarship); return <Card key={scholarship.id} className="overflow-hidden border-border/70 shadow-sm"><div className="border-b bg-muted/25"><CompareHeader scholarship={scholarship} onRemove={() => onRemove(scholarship.id)} /></div><CardContent className="p-0">{comparisonSections.map((section) => <div key={section.label}><div className="border-b bg-muted/20 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{section.label}</div>{section.keys.map((key) => { const field = fields.get(key)!; const different = fieldIsDifferent(selected, key); return <div key={key} className={`grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-3 border-b p-4 last:border-0 ${different ? "border-l-2 border-l-amber-400 bg-amber-50/50 dark:bg-amber-950/15" : ""}`}><div className="text-xs font-semibold leading-5 text-muted-foreground">{field.label}{different && <DifferenceMark />}</div><div className="text-sm leading-6"><FieldValue field={field} /></div></div> })}</div>)}</CardContent></Card> })}</div>
}

function EmptyComparisonState({ onSelect }: { onSelect: () => void }) {
  return <Card className="border-dashed border-border/80 shadow-none"><CardContent className="flex flex-col items-center px-6 py-20 text-center"><div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Search className="h-7 w-7" /></div><h2 className="text-xl font-bold">Start your comparison</h2><p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">Choose scholarships from the selector above to compare their eligibility, benefits, documents, deadlines, and official sources.</p><Button onClick={onSelect} className="mt-6 gap-2">Choose scholarships <ArrowRight className="h-4 w-4" /></Button></CardContent></Card>
}

function OneSelectedState({ scholarship, onSelect, onRemove }: { scholarship: MockScholarship; onSelect: () => void; onRemove: () => void }) {
  return <Card className="border-dashed border-border/80 shadow-none"><CardContent className="flex flex-col items-center px-6 py-14 text-center"><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">1 scholarship selected</p><h2 className="mt-2 max-w-lg text-xl font-bold">{scholarship.title}</h2><p className="mt-1 text-sm text-muted-foreground">{scholarship.providerName}</p><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button onClick={onSelect} className="gap-2">Add another scholarship <Plus className="h-4 w-4" /></Button><Button variant="outline" onClick={onRemove}>Remove selection</Button></div></CardContent></Card>
}