import { Link } from "wouter"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CalendarDays, ExternalLink, IndianRupee, ShieldCheck } from "lucide-react"
import type { Scholarship } from "@workspace/api-client-react"

function formatCurrency(amount: number | null | undefined) {
  if (amount == null) return "Varies"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatBenefit(scholarship: Scholarship) {
  if (scholarship.amountMin != null && scholarship.amountMax != null && scholarship.amountMin !== scholarship.amountMax) {
    return `${formatCurrency(scholarship.amountMin)} – ${formatCurrency(scholarship.amountMax)}`
  }
  return formatCurrency(scholarship.amountMax ?? scholarship.amountMin)
}

function formatDate(date: string | null | undefined) {
  if (!date) return "Check official website"
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`))
}

export function DiscoveryScholarshipCard({ scholarship }: { scholarship: Scholarship }) {
  return (
    <Card className="overflow-hidden border-border/70 transition-shadow hover:shadow-md" data-testid={`discovery-card-${scholarship.id}`}>
      <CardHeader className="space-y-3 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {scholarship.categories.length > 0 ? (
            scholarship.categories.map((category) => (
              <Badge key={category.id} variant="secondary">{category.name}</Badge>
            ))
          ) : (
            <Badge variant="outline">Scholarship</Badge>
          )}
          <Badge variant="outline">{scholarship.courseLevel === "Any" ? "All education levels" : scholarship.courseLevel}</Badge>
          {scholarship.state !== "National" && <Badge variant="outline">{scholarship.state}</Badge>}
        </div>
        <div>
          <h2 className="text-xl font-bold leading-tight">
            <Link href={`/scholarships/${scholarship.id}`} className="hover:text-primary transition-colors">
              {scholarship.title}
            </Link>
          </h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground">{scholarship.providerName}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-5">
        <p className="text-sm leading-6 text-foreground/80 line-clamp-2">{scholarship.eligibilitySummary}</p>
        <div className="grid gap-3 rounded-lg bg-muted/35 p-4 sm:grid-cols-2">
          <div className="flex gap-2">
            <IndianRupee className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Benefit</p>
              <p className="text-sm font-semibold">{formatBenefit(scholarship)}</p>
              <p className="text-xs capitalize text-muted-foreground">{scholarship.frequency.replace("_", " ")}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Deadline</p>
              <p className="text-sm font-semibold">{formatDate(scholarship.deadline)}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          {scholarship.primarySourceUrl ? (
            <a
              href={scholarship.primarySourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Source: {scholarship.primarySourceName ?? "Official source"}
            </a>
          ) : (
            <span>Source unavailable</span>
          )}
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified {formatDate(scholarship.lastVerifiedDate)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-muted/10 px-6 py-4">
        <Link href={`/scholarships/${scholarship.id}`} className={buttonVariants({ className: "w-full sm:w-auto sm:ml-auto" })} data-testid={`button-view-details-${scholarship.id}`}>
          View Details
        </Link>
      </CardFooter>
    </Card>
  )
}