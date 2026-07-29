import { Link } from "wouter"
import { useGetScholarshipStats, useListScholarships } from "@workspace/api-client-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowRight, BookOpen, GraduationCap, MapPin, IndianRupee, Library, Building } from "lucide-react"

function formatCurrency(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return "Varies / As per scheme"
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "Check official website"
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr))
}

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetScholarshipStats()
  const { data: featuredData, isLoading: featuredLoading } = useListScholarships({ limit: 6 })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <Badge className="mb-6 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 border-primary-foreground/20">
            Empowering India's Future
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-4xl mb-6">
            Your Pathway to <span className="text-accent">Higher Education</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mb-10">
            Navigate India's scholarship ecosystem with confidence. Discover government schemes, university grants, and private funding tailored to your profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/discover" 
              className={buttonVariants({ size: "lg", className: "bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-8 text-lg w-full sm:w-auto" })}
            >
              Find Scholarships
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground w-full sm:w-auto bg-transparent">
              How it works
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                <BookOpen className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">
                {statsLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : stats?.totalScholarships || 0}
              </h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Schemes</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">
                {statsLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : stats?.totalStates || 0}
              </h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">States Covered</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                <Library className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">
                {statsLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : stats?.providerTypes?.find(p => p.providerType === 'govt')?.count || 0}
              </h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Govt Schemes</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                <Building className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">
                {statsLoading ? <Skeleton className="h-8 w-16 mx-auto" /> : stats?.providerTypes?.find(p => p.providerType === 'private')?.count || 0}
              </h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Private Funds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">Featured Opportunities</h2>
              <p className="text-muted-foreground text-lg">
                Explore currently open scholarships offering significant support for your studies.
              </p>
            </div>
            <Link href="/discover" className="mt-6 md:mt-0">
              <Button variant="ghost" className="group">
                View all scholarships
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="h-[300px]">
                  <CardHeader><Skeleton className="h-6 w-2/3" /><Skeleton className="h-4 w-1/3" /></CardHeader>
                  <CardContent><Skeleton className="h-20 w-full" /></CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredData?.scholarships.map((scholarship) => (
                <Card key={scholarship.id} className="flex flex-col hover:shadow-md transition-shadow duration-300 border-border/60">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <Badge variant="secondary" className="capitalize shrink-0">
                        {scholarship.providerType === 'govt' ? 'Government' : scholarship.providerType}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground flex items-center shrink-0">
                        <MapPin className="h-3 w-3 mr-1" /> {scholarship.state}
                      </span>
                    </div>
                    <CardTitle className="text-xl line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {scholarship.title}
                    </CardTitle>
                    <CardDescription className="text-sm font-medium text-primary/80">
                      {scholarship.providerName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-4 flex-1">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center text-sm">
                        <div className="w-8 flex justify-center mr-2"><IndianRupee className="h-4 w-4 text-muted-foreground" /></div>
                        <span className="font-semibold text-foreground mr-1">{formatCurrency(scholarship.amount)}</span>
                        <span className="text-muted-foreground text-xs">{scholarship.frequency ? `(${scholarship.frequency})` : ''}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-8 flex justify-center mr-2"><GraduationCap className="h-4 w-4 text-muted-foreground" /></div>
                        <span className="text-muted-foreground">{scholarship.courseLevel} Level</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t flex justify-between items-center bg-muted/20">
                    <div className="text-xs text-muted-foreground">
                      <span className="block font-medium text-foreground mb-0.5">Deadline</span>
                      {formatDate(scholarship.deadline)}
                    </div>
                    <Link href={`/scholarships/${scholarship.id}`} className={buttonVariants({ variant: "outline", size: "sm", className: "border-primary/20 hover:bg-primary/5" })}>
                      Details
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
