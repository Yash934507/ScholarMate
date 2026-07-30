import { useState } from "react"
import { Link, useLocation } from "wouter"
import { useGetScholarshipStats, useListScholarships } from "@workspace/api-client-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { 
  ArrowRight, BookOpen, GraduationCap, MapPin, IndianRupee, 
  Library, Building, Search, CheckCircle2, AlertCircle, Clock 
} from "lucide-react"

function formatCurrency(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return "Varies"
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "Check website"
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr))
}

function isUrgent(dateStr: string | null | undefined) {
  if (!dateStr) return false
  const deadline = new Date(dateStr).getTime()
  const now = new Date().getTime()
  const daysDiff = (deadline - now) / (1000 * 3600 * 24)
  return daysDiff > 0 && daysDiff <= 30
}

export default function Home() {
  const [, setLocation] = useLocation()
  const [searchQuery, setSearchQuery] = useState("")

  const { data: stats, isLoading: statsLoading } = useGetScholarshipStats()
  const { data: featuredData, isLoading: featuredLoading } = useListScholarships({ limit: 6 })
  const { data: deadlineData, isLoading: deadlineLoading } = useListScholarships({ limit: 10 })

  // Note: in a real app, deadlineData would be sorted by deadline and filtered by deadline != null on the backend.
  // For UI scaffolding, we take what we get and sort locally.
  const upcomingDeadlines = deadlineData?.scholarships
    .filter(s => s.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 4)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setLocation(`/discover?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <Badge className="mb-6 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 border-primary-foreground/20 py-1.5 px-4 text-sm font-medium">
            Empowering India's Future
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mb-6 leading-[1.1]">
            Your Pathway to <span className="text-accent">Higher Education</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mb-12">
            Navigate India's scholarship ecosystem with confidence. Discover government schemes, university grants, and private funding tailored to your profile.
          </p>
          
          {/* SEARCH BAR WIDGET */}
          <div className="w-full max-w-3xl bg-background/10 backdrop-blur-md p-2 rounded-2xl border border-primary-foreground/20 shadow-2xl mb-8">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 h-6 w-6 text-primary-foreground/50" />
                <Input 
                  placeholder="Search by name, provider, or keyword..." 
                  className="pl-12 h-14 bg-background text-foreground text-lg border-transparent rounded-xl focus-visible:ring-accent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 text-lg rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
                Search
              </Button>
            </form>
          </div>

          <div className="flex flex-wrap justify-center gap-2 items-center text-sm text-primary-foreground/80">
            <span>Quick search:</span>
            <Link href="/discover?state=Maharashtra" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 px-3 py-1 rounded-full transition-colors cursor-pointer">Maharashtra</Link>
            <Link href="/discover?providerType=govt" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 px-3 py-1 rounded-full transition-colors cursor-pointer">Government</Link>
            <Link href="/discover?courseLevel=UG" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 px-3 py-1 rounded-full transition-colors cursor-pointer">UG</Link>
            <Link href="/discover?gender=female" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 px-3 py-1 rounded-full transition-colors cursor-pointer">Girls</Link>
            <Link href="/discover?maxIncome=250000" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 px-3 py-1 rounded-full transition-colors cursor-pointer">Income ≤ ₹2.5L</Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-b border-border/50 relative -mt-6 rounded-t-3xl z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border/50">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-4xl font-bold text-primary mb-1">
                {statsLoading ? <Skeleton className="h-10 w-20 mx-auto" /> : stats?.totalScholarships || 0}
              </h3>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Schemes</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <h3 className="text-4xl font-bold text-primary mb-1">
                {statsLoading ? <Skeleton className="h-10 w-20 mx-auto" /> : stats?.totalStates || 0}
              </h3>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">States Covered</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <h3 className="text-4xl font-bold text-primary mb-1">
                {statsLoading ? <Skeleton className="h-10 w-20 mx-auto" /> : stats?.providerTypes?.find(p => p.providerType === 'govt')?.count || 0}
              </h3>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Govt Schemes</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <h3 className="text-4xl font-bold text-primary mb-1">
                {statsLoading ? <Skeleton className="h-10 w-20 mx-auto" /> : stats?.providerTypes?.find(p => p.providerType === 'private')?.count || 0}
              </h3>
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Private Funds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category & Education */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground text-lg">Find the right funding source that matches your requirements.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Link href="/discover?providerType=govt">
              <Card className="hover:border-accent hover:shadow-md transition-all cursor-pointer group bg-card h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Library className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-bold text-xl mb-1">Government</h3>
                  <p className="text-sm text-muted-foreground mb-4">State & Central schemes</p>
                  <div className="text-primary font-medium text-sm inline-flex items-center">
                    View all <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/discover?providerType=university">
              <Card className="hover:border-accent hover:shadow-md transition-all cursor-pointer group bg-card h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-bold text-xl mb-1">University</h3>
                  <p className="text-sm text-muted-foreground mb-4">Institutional grants</p>
                  <div className="text-primary font-medium text-sm inline-flex items-center">
                    View all <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/discover?providerType=ngo">
              <Card className="hover:border-accent hover:shadow-md transition-all cursor-pointer group bg-card h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-bold text-xl mb-1">NGO</h3>
                  <p className="text-sm text-muted-foreground mb-4">Non-profit foundations</p>
                  <div className="text-primary font-medium text-sm inline-flex items-center">
                    View all <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/discover?providerType=private">
              <Card className="hover:border-accent hover:shadow-md transition-all cursor-pointer group bg-card h-full">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Building className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="font-bold text-xl mb-1">Private</h3>
                  <p className="text-sm text-muted-foreground mb-4">Corporate CSR funds</p>
                  <div className="text-primary font-medium text-sm inline-flex items-center">
                    View all <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-center bg-card rounded-2xl p-8 border shadow-sm">
            <div className="w-full lg:w-1/3">
              <h3 className="text-2xl font-bold mb-2">Education Level</h3>
              <p className="text-muted-foreground mb-4 lg:mb-0">Filter scholarships by your current level of study.</p>
            </div>
            <div className="w-full lg:w-2/3 flex flex-wrap gap-3">
              {['School', 'Diploma', 'UG', 'PG', 'PhD', 'Any'].map(level => (
                <Link key={level} href={`/discover?courseLevel=${level}`} className="flex-1 min-w-[120px]">
                  <Button variant="outline" className="w-full h-12 text-base font-medium border-2 hover:border-primary hover:bg-primary/5">
                    {level}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">Featured Opportunities</h2>
              <p className="text-muted-foreground text-lg">
                Explore currently open scholarships offering significant support for your studies.
              </p>
            </div>
            <Link href="/discover" className="mt-6 md:mt-0">
              <Button variant="ghost" className="group text-primary font-semibold text-base">
                View all scholarships
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <Card key={i} className="h-[300px]">
                  <CardHeader><Skeleton className="h-6 w-2/3" /><Skeleton className="h-4 w-1/3" /></CardHeader>
                  <CardContent><Skeleton className="h-20 w-full" /></CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredData?.scholarships.slice(0, 3).map((scholarship) => (
                <Card key={scholarship.id} className="flex flex-col hover:shadow-xl transition-shadow duration-300 border-border/60">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent shadow-none capitalize">
                        {scholarship.providerType === 'govt' ? 'Government' : scholarship.providerType}
                      </Badge>
                      <span className="text-xs font-bold text-muted-foreground uppercase flex items-center bg-muted px-2 py-1 rounded">
                        <MapPin className="h-3 w-3 mr-1" /> {scholarship.state}
                      </span>
                    </div>
                    <CardTitle className="text-xl line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      <Link href={`/scholarships/${scholarship.id}`}>{scholarship.title}</Link>
                    </CardTitle>
                    <CardDescription className="text-sm font-medium text-foreground/70">
                      {scholarship.providerName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-6 flex-1">
                    <div className="bg-muted/30 p-4 rounded-xl space-y-3">
                      <div className="flex items-center text-sm">
                        <div className="w-8 flex justify-center shrink-0"><IndianRupee className="h-5 w-5 text-primary" /></div>
                        <span className="font-bold text-foreground text-base">{formatCurrency(scholarship.amount)}</span>
                        {scholarship.frequency && <span className="text-muted-foreground text-xs ml-1 capitalize">({scholarship.frequency})</span>}
                      </div>
                      <div className="flex items-center text-sm">
                        <div className="w-8 flex justify-center shrink-0"><GraduationCap className="h-5 w-5 text-primary" /></div>
                        <span className="font-medium text-foreground">{scholarship.courseLevel} Level</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 pb-6 flex justify-between items-center px-6">
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Deadline</span>
                      <span className="font-semibold text-sm">{formatDate(scholarship.deadline)}</span>
                    </div>
                    <Link href={`/scholarships/${scholarship.id}`} className={buttonVariants({ className: "bg-accent text-accent-foreground hover:bg-accent/90" })}>
                      Details
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Deadlines (Horizontal Scroll) */}
      <section className="py-20 bg-primary text-primary-foreground overflow-hidden">
        <div className="container mx-auto px-4 mb-8">
          <h2 className="text-3xl font-bold">Upcoming Deadlines</h2>
          <p className="text-primary-foreground/80 mt-2">Don't miss out. Apply before these schemes close.</p>
        </div>
        
        <div className="pl-4 md:pl-0 container mx-auto">
          <ScrollArea className="w-full whitespace-nowrap pb-6">
            <div className="flex w-max space-x-6 px-4 md:px-0">
              {upcomingDeadlines && upcomingDeadlines.length > 0 ? upcomingDeadlines.map(s => {
                const urgent = isUrgent(s.deadline);
                return (
                  <Card key={s.id} className="w-[350px] shrink-0 border-none bg-background text-foreground shadow-lg">
                    <CardContent className="p-6">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold mb-4 uppercase ${urgent ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' : 'bg-primary/10 text-primary'}`}>
                        <Clock className="w-3 h-3 mr-1" />
                        Closes: {formatDate(s.deadline)}
                      </div>
                      <h3 className="font-bold text-lg line-clamp-2 leading-tight mb-2 whitespace-normal">{s.title}</h3>
                      <p className="text-sm text-muted-foreground truncate mb-6">{s.providerName}</p>
                      <Link href={`/scholarships/${s.id}`} className={buttonVariants({ variant: "outline", className: "w-full border-2 hover:bg-primary/5" })}>
                        View Details
                      </Link>
                    </CardContent>
                  </Card>
                )
              }) : (
                <div className="text-primary-foreground/70 italic px-4">No upcoming deadlines found.</div>
              )}
            </div>
            <ScrollBar orientation="horizontal" className="bg-primary-foreground/10" />
          </ScrollArea>
        </div>
      </section>

      {/* How It Works & Why Us */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          
          <div className="mb-24">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How ScholarMate Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-border z-0"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-6 ring-8 ring-background">1</div>
                <h3 className="text-xl font-bold mb-3">Browse & Search</h3>
                <p className="text-muted-foreground">Search through verified scholarships from MahaDBT, NSP, and 50+ private foundations in one place.</p>
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-6 ring-8 ring-background">2</div>
                <h3 className="text-xl font-bold mb-3">Check Eligibility</h3>
                <p className="text-muted-foreground">Use our guided checker to see if you meet the specific criteria for state, caste, and income levels.</p>
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-2xl font-bold mb-6 ring-8 ring-background">3</div>
                <h3 className="text-xl font-bold mb-3">Apply Directly</h3>
                <p className="text-muted-foreground">We provide clear instructions and direct links to the official portals so you can submit securely.</p>
              </div>
            </div>
          </div>

          <div className="bg-muted/30 rounded-3xl p-10 md:p-16 border shadow-sm">
            <h2 className="text-3xl font-bold text-center mb-12">Why Use ScholarMate</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <h3 className="font-bold text-xl">Free & Independent</h3>
                </div>
                <p className="text-muted-foreground">No fees, no hidden commissions, and no sign-up required just to browse. Built to empower students.</p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <h3 className="font-bold text-xl">Verified Sources</h3>
                </div>
                <p className="text-muted-foreground">Every scholarship on our platform links directly to its official government or institutional portal.</p>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <h3 className="font-bold text-xl">Maharashtra Focus</h3>
                </div>
                <p className="text-muted-foreground">Deep coverage of MahaDBT schemes, regional grants, and Mumbai-area institutional scholarships.</p>
              </div>
            </div>
          </div>

          {/* Disclaimer Alert */}
          <div className="mt-16 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl p-6 flex gap-4 max-w-4xl mx-auto">
            <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-500 shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-800 dark:text-amber-400 mb-1">Important Disclaimer</h4>
              <p className="text-amber-700/90 dark:text-amber-500/90 text-sm">
                ScholarMate provides scholarship information for reference only. Eligibility criteria, deadlines, and amounts change frequently. Always verify all details on the official source before applying. We are not affiliated with any government body or scholarship provider.
              </p>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  )
}
