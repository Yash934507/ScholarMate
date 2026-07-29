import { useParams, Link } from "wouter"
import { useGetScholarship, getGetScholarshipQueryKey } from "@workspace/api-client-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft, ExternalLink, AlertTriangle, Calendar, IndianRupee, 
  MapPin, GraduationCap, Building, User, Users, Percent, Briefcase
} from "lucide-react"

function formatCurrency(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return "Varies / As per scheme"
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "Check official website"
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr))
}

function formatProviderType(type: string) {
  switch(type) {
    case 'govt': return 'Government';
    case 'university': return 'University/College';
    case 'ngo': return 'NGO';
    case 'private': return 'Private';
    default: return type;
  }
}

export default function ScholarshipDetail() {
  const params = useParams()
  const id = parseInt(params.id || "0")

  const { data: scholarship, isLoading } = useGetScholarship(id, {
    query: { enabled: !!id, queryKey: getGetScholarshipQueryKey(id) }
  })

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Skeleton className="h-6 w-24 mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (!scholarship) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Scholarship Not Found</h2>
        <p className="text-muted-foreground mb-8">The scholarship you are looking for does not exist or has been removed.</p>
        <Link href="/discover" className={buttonVariants({ variant: "default" })}>
          Browse All Scholarships
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-primary text-primary-foreground py-12 lg:py-16 border-b border-primary-foreground/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <Link href="/discover" className="inline-flex items-center text-primary-foreground/70 hover:text-primary-foreground mb-8 transition-colors text-sm font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Discover
          </Link>
          
          <div className="flex flex-wrap gap-3 mb-6">
            <Badge className="bg-accent text-accent-foreground hover:bg-accent/90 border-transparent">
              {formatProviderType(scholarship.providerType)}
            </Badge>
            {scholarship.state !== "National" && (
              <Badge variant="outline" className="text-primary-foreground border-primary-foreground/30">
                <MapPin className="h-3 w-3 mr-1" /> {scholarship.state}
              </Badge>
            )}
            {!scholarship.isActive && (
              <Badge variant="destructive">Inactive</Badge>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{scholarship.title}</h1>
          <div className="flex items-center gap-2 text-primary-foreground/80 text-lg">
            <Building className="h-5 w-5" />
            <span>{scholarship.providerName}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-sm border-border/60">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-foreground">About the Scholarship</h2>
                <div className="prose prose-slate dark:prose-invert max-w-none text-foreground/90 whitespace-pre-line leading-relaxed">
                  {scholarship.description}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-border/60">
              <CardContent className="p-8 space-y-8">
                <h2 className="text-2xl font-bold text-foreground">Eligibility Criteria</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-foreground">Course Level</span>
                    </div>
                    <p className="text-foreground/80 pl-7">{scholarship.courseLevel}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-foreground">Caste Categories</span>
                    </div>
                    <p className="text-foreground/80 pl-7">
                      {scholarship.casteCategories.join(", ")}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <User className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-foreground">Gender Requirement</span>
                    </div>
                    <p className="text-foreground/80 pl-7 capitalize">{scholarship.gender}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-foreground">Family Income Limit</span>
                    </div>
                    <p className="text-foreground/80 pl-7">
                      {scholarship.maxAnnualIncome ? `Up to ${formatCurrency(scholarship.maxAnnualIncome)} per year` : 'No specific limit'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Percent className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-foreground">Minimum Academic %</span>
                    </div>
                    <p className="text-foreground/80 pl-7">
                      {scholarship.minPercentage ? `${scholarship.minPercentage}%` : 'Not specified'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl p-6 flex gap-4">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500 shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-1">Disclaimer</h4>
                <p className="text-amber-700/90 dark:text-amber-500/90 text-sm">
                  These eligibility details are indicative only. Please verify current criteria, required documents, and application processes on the official source website before applying.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-md border-border/60 sticky top-24">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider block mb-1">Award Amount</span>
                    <div className="text-3xl font-bold text-foreground flex items-baseline gap-1">
                      {formatCurrency(scholarship.amount)}
                    </div>
                    {scholarship.frequency && (
                      <span className="text-sm text-muted-foreground capitalize mt-1 block">{scholarship.frequency}</span>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider block mb-1">Application Deadline</span>
                    <div className="flex items-center gap-2 text-lg font-medium text-foreground">
                      <Calendar className="h-5 w-5 text-primary" />
                      {formatDate(scholarship.deadline)}
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <a href={scholarship.applicationUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ size: "lg", className: "w-full text-lg h-14 bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm flex items-center justify-center" })}>
                      Apply Now <ExternalLink className="ml-2 h-5 w-5" />
                    </a>
                    
                    <a href={scholarship.sourceUrl} target="_blank" rel="noopener noreferrer" className="block text-center text-sm text-primary hover:underline font-medium">
                      View Official Notification
                    </a>
                  </div>

                  <div className="mt-6 pt-6 border-t text-xs text-muted-foreground text-center">
                    Source: {scholarship.sourceName} <br/>
                    Last updated: {formatDate(scholarship.updatedAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
