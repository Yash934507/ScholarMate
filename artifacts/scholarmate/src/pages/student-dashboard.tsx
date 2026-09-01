import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@clerk/react"
import { Link } from "wouter"
import {
  AlertCircle,
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Eye,
  FileCheck2,
  GraduationCap,
  MapPin,
  Pencil,
  Search,
  Sparkles,
  Target,
  UserCircle,
} from "lucide-react"
import {
  getGetStudentProfileQueryKey,
  useGetStudentProfile,
  type StudentProfile,
} from "@workspace/api-client-react"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  APPLICATION_STATUSES,
  dashboardApplications,
  dashboardScholarships,
  deadlineLabel,
  formatDeadline,
  recentScholarships,
  type ApplicationStatus,
  type DashboardApplication,
  type DashboardScholarship,
} from "@/lib/dashboard-data"

const STATUS_STORAGE_PREFIX = "scholarmate:dashboard-statuses:"

function formatCount(value: number) {
  return new Intl.NumberFormat("en-IN").format(value)
}

function statusClass(status: ApplicationStatus) {
  switch (status) {
    case "Approved":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
    case "Rejected":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
    case "Under Review":
      return "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300"
    case "Applied":
      return "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
    case "Planning to Apply":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300"
    case "Closed":
      return "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
    default:
      return "border-primary/20 bg-primary/5 text-primary"
  }
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "SM"
}

function profileCompletion(profile: StudentProfile | undefined) {
  if (!profile) return 0
  const fields = [
    profile.fullName,
    profile.phone,
    profile.state,
    profile.city,
    profile.college,
    profile.university,
    profile.course,
    profile.educationLevel,
    profile.academicPercentage,
    profile.annualFamilyIncome,
    profile.category,
  ]
  return Math.round((fields.filter((value) => value !== null && value !== undefined && value !== "").length / fields.length) * 100)
}

function ScholarshipMiniCard({ scholarship, saved = false }: { scholarship: DashboardScholarship; saved?: boolean }) {
  return (
    <Card className="group h-full overflow-hidden border-border/70 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <CardContent className="flex h-full flex-col p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            scholarship.tone === "amber" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
              : scholarship.tone === "teal" ? "bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300"
                : scholarship.tone === "purple" ? "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300"
                  : "bg-primary/10 text-primary"
          }`}>
            <GraduationCap className="h-5 w-5" />
          </span>
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
            {scholarship.match}% match
          </Badge>
        </div>
        <div className="mb-1 text-xs font-medium text-muted-foreground">{scholarship.provider}</div>
        <h3 className="line-clamp-2 min-h-12 text-[15px] font-bold leading-6 text-foreground group-hover:text-primary">{scholarship.title}</h3>
        <div className="mt-4 grid grid-cols-2 gap-2 border-y border-border/60 py-3 text-xs">
          <div><span className="block text-muted-foreground">Award</span><span className="mt-1 block font-semibold text-foreground">{scholarship.amount}</span></div>
          <div><span className="block text-muted-foreground">Deadline</span><span className="mt-1 block font-semibold text-amber-700 dark:text-amber-400">{deadlineLabel(scholarship.deadlineInDays)}</span></div>
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{scholarship.location}</span>
          <Link href={`/scholarships/${scholarship.id}`} className={buttonVariants({ variant: saved ? "outline" : "default", size: "sm", className: "gap-1.5" })}>
            {saved ? "View" : "Explore"} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusSelect({ value, onChange }: { value: ApplicationStatus; onChange: (value: ApplicationStatus) => void }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as ApplicationStatus)}
      aria-label={`Update application status from ${value}`}
      className={`h-9 max-w-[170px] rounded-lg border px-2.5 text-xs font-semibold outline-none transition-colors focus:ring-2 focus:ring-primary/20 ${statusClass(value)}`}
    >
      {APPLICATION_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
    </select>
  )
}

function ApplicationRow({ application, status, onStatusChange }: { application: DashboardApplication; status: ApplicationStatus; onStatusChange: (status: ApplicationStatus) => void }) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/60 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileCheck2 className="h-4 w-4" /></div>
        <div className="min-w-0">
          <Link href={`/scholarships/${application.id}`} className="line-clamp-1 text-sm font-semibold hover:text-primary">{application.title}</Link>
          <p className="mt-1 text-xs text-muted-foreground">{application.provider} · {application.updated}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="hidden text-xs text-muted-foreground md:inline">Self-reported</span>
        <StatusSelect value={status} onChange={onStatusChange} />
      </div>
    </div>
  )
}

export default function StudentDashboard() {
  const { userId } = useAuth()
  const profileQuery = useGetStudentProfile({ query: { queryKey: getGetStudentProfileQueryKey(), retry: false } })
  const profile = profileQuery.data
  const displayName = profile?.fullName || "Scholar"
  const [statusOverrides, setStatusOverrides] = useState<Record<number, ApplicationStatus>>({})
  const [statusReady, setStatusReady] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")

  useEffect(() => {
    if (!userId) return
    try {
      const stored = window.localStorage.getItem(`${STATUS_STORAGE_PREFIX}${userId}`)
      setStatusOverrides(stored ? JSON.parse(stored) as Record<number, ApplicationStatus> : {})
    } catch {
      setStatusOverrides({})
    }
    setStatusReady(true)
  }, [userId])

  useEffect(() => {
    if (!userId || !statusReady) return
    window.localStorage.setItem(`${STATUS_STORAGE_PREFIX}${userId}`, JSON.stringify(statusOverrides))
  }, [statusOverrides, statusReady, userId])

  const applications = useMemo(
    () => dashboardApplications.map((application) => ({ ...application, status: statusOverrides[application.id] ?? application.status })),
    [statusOverrides],
  )
  const counts = useMemo(() => ({
    saved: applications.filter((application) => application.status === "Saved").length,
    applied: applications.filter((application) => ["Applied", "Under Review", "Approved"].includes(application.status)).length,
    deadlines: dashboardScholarships.filter((scholarship) => scholarship.deadlineInDays <= 30).length,
    approved: applications.filter((application) => application.status === "Approved").length,
  }), [applications])
  const completion = profileCompletion(profile)

  const updateStatus = (id: number, status: ApplicationStatus) => {
    setStatusOverrides((current) => ({ ...current, [id]: status }))
    setStatusMessage("Status updated on your personal tracker.")
    window.setTimeout(() => setStatusMessage(""), 3000)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f7f8fb] pb-16 dark:bg-background">
      <div className="border-b bg-background">
        <div className="container mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-5 md:px-8">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary"><Sparkles className="h-3.5 w-3.5" /> Student workspace</div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Good morning, {displayName.split(" ")[0]}.</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your scholarship search, organized around what matters next.</p>
          </div>
          <Link href="/discover" className={buttonVariants({ className: "hidden gap-2 sm:inline-flex" })}><Search className="h-4 w-4" /> Find scholarships</Link>
        </div>
      </div>

      <div className="container mx-auto max-w-[1440px] space-y-6 px-4 py-6 md:px-8 md:py-8">
        <Card className="overflow-hidden border-0 bg-primary text-primary-foreground shadow-lg shadow-primary/10">
          <CardContent className="p-0">
            <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-xl font-bold ring-1 ring-white/20">{initials(displayName)}</div>
                <div>
                  <p className="text-sm text-primary-foreground/70">Student profile</p>
                  <h2 className="mt-1 text-xl font-bold">{displayName}</h2>
                  <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-primary-foreground/75">
                    <span>{profile?.educationLevel || "Undergraduate student"}</span>
                    {profile?.course && <><span className="text-primary-foreground/40">·</span><span>{profile.course}</span></>}
                    {profile?.city && <><span className="text-primary-foreground/40">·</span><span>{profile.city}</span></>}
                  </p>
                </div>
              </div>
              <div className="flex w-full max-w-sm items-center gap-4 rounded-xl bg-white/10 p-4 md:w-auto">
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-white/20 text-lg font-bold"><span>{completion}%</span><span className="absolute inset-[-4px] rounded-full border-4 border-accent border-l-transparent -rotate-45" /></div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">Profile strength</p>
                  <p className="mt-1 text-xs text-primary-foreground/70">Complete your profile for sharper matches.</p>
                  <Progress value={completion} className="mt-3 h-1.5 bg-white/20 [&>div]:bg-accent" />
                </div>
                <Link href="/profile" aria-label="Edit profile" className="rounded-lg p-2 text-primary-foreground/75 hover:bg-white/10 hover:text-white"><Pencil className="h-4 w-4" /></Link>
              </div>
            </div>
            <div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">
              <Stat label="Saved" value={counts.saved} icon={<Bookmark className="h-4 w-4" />} />
              <Stat label="In progress" value={counts.applied} icon={<BriefcaseBusiness className="h-4 w-4" />} />
              <Stat label="Deadlines soon" value={counts.deadlines} icon={<Clock3 className="h-4 w-4" />} />
              <Stat label="Approved" value={counts.approved} icon={<CheckCircle2 className="h-4 w-4" />} />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <main className="min-w-0 space-y-6">
            <SectionHeading eyebrow="Curated for you" title="Recommended scholarships" description="High-fit opportunities based on your profile and study goals." actionLabel="Browse all" actionHref="/discover" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {dashboardScholarships.slice(0, 3).map((scholarship) => <ScholarshipMiniCard key={scholarship.id} scholarship={scholarship} />)}
            </div>

            <SectionHeading eyebrow="Your shortlist" title="Saved scholarships" description="Keep the opportunities you want to revisit close at hand." actionLabel="View saved" actionHref="/saved" />
            <Card className="border-border/70 shadow-sm">
              <CardContent className="divide-y divide-border/60 p-2">
                {dashboardScholarships.slice(0, 3).map((scholarship) => (
                  <div key={scholarship.id} className="flex items-center gap-3 p-3 sm:p-4">
                    <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex"><Bookmark className="h-4 w-4 fill-current" /></div>
                    <div className="min-w-0 flex-1"><Link href={`/scholarships/${scholarship.id}`} className="line-clamp-1 text-sm font-semibold hover:text-primary">{scholarship.title}</Link><p className="mt-1 text-xs text-muted-foreground">{scholarship.provider} · {scholarship.amount}</p></div>
                    <div className="hidden text-right sm:block"><p className="text-xs text-muted-foreground">Deadline</p><p className="mt-1 text-xs font-semibold text-amber-700 dark:text-amber-400">{formatDeadline(scholarship.deadlineInDays)}</p></div>
                    <Link href={`/scholarships/${scholarship.id}`} aria-label={`View ${scholarship.title}`} className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-primary"><ChevronRight className="h-4 w-4" /></Link>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary">Keep moving</p><h2 className="text-xl font-bold tracking-tight">Application tracking</h2><p className="mt-1 text-sm text-muted-foreground">Update statuses yourself as your applications progress.</p></div>
              <Link href="/tracker" className="text-sm font-semibold text-primary hover:underline">Open full tracker <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link>
            </div>
            <Card className="border-border/70 shadow-sm">
              <CardHeader className="border-b border-border/60 pb-4"><div className="flex items-center justify-between gap-3"><CardTitle className="text-base">Your application list</CardTitle><Badge variant="outline" className="font-normal">{applications.length} sample records</Badge></div><CardDescription>Statuses are private, self-reported notes. Changing a status does not submit anything to a scholarship provider.</CardDescription></CardHeader>
              <CardContent className="px-4 pb-2 pt-1 sm:px-6">
                {applications.map((application) => <ApplicationRow key={application.id} application={application} status={application.status} onStatusChange={(status) => updateStatus(application.id, status)} />)}
                {statusMessage && <div role="status" className="mb-3 flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"><Check className="h-3.5 w-3.5" />{statusMessage}</div>}
              </CardContent>
            </Card>
          </main>

          <aside className="space-y-6">
            <Card className="border-border/70 shadow-sm">
              <CardHeader className="pb-3"><div className="flex items-center justify-between"><div><p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary">Don't miss out</p><CardTitle className="text-lg">Upcoming deadlines</CardTitle></div><Clock3 className="h-5 w-5 text-amber-600" /></div><CardDescription>Prioritize these opportunities first.</CardDescription></CardHeader>
              <CardContent className="space-y-1">
                {dashboardScholarships.filter((scholarship) => scholarship.deadlineInDays <= 31).map((scholarship) => (
                  <Link key={scholarship.id} href={`/scholarships/${scholarship.id}`} className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted">
                    <div className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg ${scholarship.deadlineInDays <= 10 ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"}`}><span className="text-base font-bold leading-none">{dateFromDays(scholarship.deadlineInDays, "day")}</span><span className="mt-1 text-[9px] font-bold uppercase">{dateFromDays(scholarship.deadlineInDays, "month")}</span></div>
                    <div className="min-w-0 flex-1"><p className="line-clamp-1 text-sm font-semibold">{scholarship.title}</p><p className="mt-1 text-xs text-muted-foreground">{deadlineLabel(scholarship.deadlineInDays)} · {scholarship.provider}</p></div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/70 shadow-sm">
              <CardHeader className="pb-3"><div className="flex items-center justify-between"><CardTitle className="text-lg">Recently viewed</CardTitle><Eye className="h-5 w-5 text-muted-foreground" /></div></CardHeader>
              <CardContent className="space-y-1">
                {recentScholarships.map((scholarship) => <Link key={scholarship.id} href={`/scholarships/${scholarship.id}`} className="flex items-center gap-3 rounded-xl p-3 hover:bg-muted"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"><Eye className="h-4 w-4" /></div><div className="min-w-0 flex-1"><p className="line-clamp-1 text-sm font-semibold">{scholarship.title}</p><p className="mt-1 text-xs text-muted-foreground">{scholarship.viewed}</p></div><ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" /></Link>)}
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-white shadow-sm dark:from-amber-950/30 dark:to-card">
              <CardContent className="p-6"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"><Target className="h-5 w-5" /></div><h3 className="text-lg font-bold">Not sure where you qualify?</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Answer a few questions to understand which criteria you may meet before you apply.</p><Link href="/eligibility" className={buttonVariants({ className: "mt-5 w-full justify-between bg-amber-700 text-white hover:bg-amber-800" })}>Check eligibility <ArrowRight className="h-4 w-4" /></Link></CardContent>
            </Card>

            <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><p className="text-xs leading-5">ScholarMate helps you organize your search. Always confirm requirements and submit through the official provider.</p></div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function dateFromDays(days: number, part: "day" | "month") {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return part === "day" ? date.getDate() : date.toLocaleDateString("en-IN", { month: "short" })
}

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return <div className="flex items-center gap-3 border-r border-white/10 px-5 py-4 last:border-0 md:px-7"><span className="hidden text-primary-foreground/60 sm:block">{icon}</span><div><p className="text-xl font-bold">{formatCount(value)}</p><p className="text-[10px] font-semibold uppercase tracking-wider text-primary-foreground/60">{label}</p></div></div>
}

function SectionHeading({ eyebrow, title, description, actionLabel, actionHref }: { eyebrow: string; title: string; description: string; actionLabel: string; actionHref: string }) {
  return <div className="flex items-end justify-between gap-4"><div><p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary">{eyebrow}</p><h2 className="text-xl font-bold tracking-tight">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p></div><Link href={actionHref} className="hidden shrink-0 text-sm font-semibold text-primary hover:underline sm:block">{actionLabel} <ArrowRight className="ml-1 inline h-3.5 w-3.5" /></Link></div>
}