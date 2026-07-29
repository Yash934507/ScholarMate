import { useEffect, useState, useMemo } from "react"
import { Link, useSearch, useLocation } from "wouter"
import { useListScholarships } from "@workspace/api-client-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { NativeSelect } from "@/components/ui/native-select"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter, X } from "lucide-react"

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

export default function Discover() {
  const searchParams = useSearch()
  const [, setLocation] = useLocation()
  
  const params = useMemo(() => new URLSearchParams(searchParams), [searchParams])
  
  const currentParams = {
    search: params.get("search") || "",
    state: params.get("state") || "",
    providerType: params.get("providerType") || "",
    courseLevel: params.get("courseLevel") || "",
    casteCategory: params.get("casteCategory") || "",
    gender: params.get("gender") || "",
    maxIncome: params.get("maxIncome") || "",
    page: parseInt(params.get("page") || "1"),
  }

  // local state for form so it doesn't stutter while typing
  const [filters, setFilters] = useState(currentParams)
  
  // synchronize local state when URL changes
  useEffect(() => {
    setFilters(currentParams)
  }, [searchParams])

  const { data, isLoading } = useListScholarships({
    ...currentParams,
    maxIncome: currentParams.maxIncome ? parseInt(currentParams.maxIncome) : undefined,
    providerType: currentParams.providerType as any || undefined,
    courseLevel: currentParams.courseLevel as any || undefined,
    casteCategory: currentParams.casteCategory as any || undefined,
    gender: currentParams.gender as any || undefined,
    state: currentParams.state || undefined,
    search: currentParams.search || undefined,
    limit: 10,
  })

  const applyFilters = (newFilters: Partial<typeof currentParams>) => {
    const updated = { ...filters, ...newFilters, page: 1 } // reset page on filter change
    setFilters(updated)
    
    const p = new URLSearchParams()
    Object.entries(updated).forEach(([k, v]) => {
      if (v) p.set(k, String(v))
    })
    setLocation(`/discover?${p.toString()}`)
  }

  const clearFilters = () => {
    setFilters({ ...currentParams, search: "", state: "", providerType: "", courseLevel: "", casteCategory: "", gender: "", maxIncome: "", page: 1 })
    setLocation("/discover")
  }

  const handlePageChange = (newPage: number) => {
    const p = new URLSearchParams(searchParams)
    p.set("page", String(newPage))
    setLocation(`/discover?${p.toString()}`)
  }

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const FiltersContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            id="search"
            placeholder="Keywords..." 
            className="pl-9"
            value={filters.search}
            onChange={(e) => applyFilters({ search: e.target.value })}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Input 
          id="state"
          placeholder="e.g. Maharashtra" 
          value={filters.state}
          onChange={(e) => applyFilters({ state: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="courseLevel">Course Level</Label>
        <NativeSelect 
          id="courseLevel"
          value={filters.courseLevel}
          onChange={(e) => applyFilters({ courseLevel: e.target.value })}
        >
          <option value="">All Levels</option>
          <option value="School">School</option>
          <option value="Diploma">Diploma</option>
          <option value="UG">Undergraduate (UG)</option>
          <option value="PG">Postgraduate (PG)</option>
          <option value="PhD">PhD</option>
          <option value="Any">Any</option>
        </NativeSelect>
      </div>

      <div className="space-y-2">
        <Label htmlFor="providerType">Provider Type</Label>
        <NativeSelect 
          id="providerType"
          value={filters.providerType}
          onChange={(e) => applyFilters({ providerType: e.target.value })}
        >
          <option value="">All Providers</option>
          <option value="govt">Government</option>
          <option value="ngo">NGO</option>
          <option value="private">Private</option>
          <option value="university">University/College</option>
        </NativeSelect>
      </div>

      <div className="space-y-2">
        <Label htmlFor="casteCategory">Caste Category</Label>
        <NativeSelect 
          id="casteCategory"
          value={filters.casteCategory}
          onChange={(e) => applyFilters({ casteCategory: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="General">General</option>
          <option value="OBC">OBC</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
          <option value="EWS">EWS</option>
          <option value="NT">NT</option>
          <option value="SBC">SBC</option>
          <option value="VJNT">VJNT</option>
          <option value="All">All</option>
        </NativeSelect>
      </div>

      <div className="space-y-2">
        <Label htmlFor="gender">Gender</Label>
        <NativeSelect 
          id="gender"
          value={filters.gender}
          onChange={(e) => applyFilters({ gender: e.target.value })}
        >
          <option value="">Any</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </NativeSelect>
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxIncome">Max Annual Income (₹)</Label>
        <Input 
          id="maxIncome"
          type="number"
          placeholder="e.g. 800000" 
          value={filters.maxIncome}
          onChange={(e) => applyFilters({ maxIncome: e.target.value })}
        />
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Clear Filters
      </Button>
    </div>
  )

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="bg-primary py-12 text-primary-foreground border-b border-primary-foreground/10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Scholarships</h1>
          <p className="text-primary-foreground/80 max-w-2xl text-lg">
            Find the right financial support for your education. Filter by state, category, and course level to see what you qualify for.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <span className="font-medium text-lg">{data?.total || 0} Results</span>
            <Button onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)} variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
          </div>

          {/* Sidebar */}
          <aside className={`lg:w-1/4 ${isMobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-card rounded-xl border shadow-sm p-6 lg:sticky lg:top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" /> Filters
                </h2>
                {isMobileFiltersOpen && (
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileFiltersOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
              <FiltersContent />
            </div>
          </aside>

          {/* Main List */}
          <main className="lg:w-3/4">
            <div className="hidden lg:flex justify-between items-center mb-6 bg-muted/30 p-4 rounded-xl border">
              <span className="font-medium text-foreground">{data?.total || 0} Scholarships found</span>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="flex flex-col sm:flex-row p-6 gap-6">
                    <div className="w-full sm:w-3/4 space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                    <div className="w-full sm:w-1/4 flex flex-col items-start sm:items-end space-y-4">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-10 w-full mt-auto" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : data?.scholarships.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-xl border border-dashed">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">No scholarships found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters to see more results.</p>
                <Button onClick={clearFilters}>Clear all filters</Button>
              </div>
            ) : (
              <div className="space-y-6">
                {data?.scholarships.map((scholarship) => (
                  <Card key={scholarship.id} className="overflow-hidden hover:shadow-md transition-shadow group border-border/60">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-6 md:w-3/4 flex flex-col border-b md:border-b-0 md:border-r border-border/50">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="bg-muted text-muted-foreground border-transparent">
                            {formatProviderType(scholarship.providerType)}
                          </Badge>
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                            {scholarship.courseLevel}
                          </Badge>
                          {scholarship.state !== "National" && (
                            <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">
                              {scholarship.state}
                            </Badge>
                          )}
                        </div>
                        <Link href={`/scholarships/${scholarship.id}`} className="inline-block group-hover:text-primary transition-colors cursor-pointer mb-2">
                          <h3 className="text-xl font-bold">{scholarship.title}</h3>
                        </Link>
                        <p className="text-sm font-medium text-muted-foreground mb-4">
                          {scholarship.providerName}
                        </p>
                        <p className="text-sm text-foreground/80 line-clamp-2 mt-auto">
                          {scholarship.description}
                        </p>
                      </div>
                      
                      <div className="p-6 md:w-1/4 flex flex-col justify-between bg-muted/10">
                        <div className="space-y-4 mb-6">
                          <div>
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-1">Award</span>
                            <div className="font-semibold text-lg flex flex-col">
                              <span>{formatCurrency(scholarship.amount)}</span>
                              {scholarship.frequency && (
                                <span className="text-xs text-muted-foreground capitalize font-normal">{scholarship.frequency}</span>
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-1">Deadline</span>
                            <div className="font-medium text-sm">
                              {formatDate(scholarship.deadline)}
                            </div>
                          </div>
                        </div>
                        
                        <Link href={`/scholarships/${scholarship.id}`} className={buttonVariants({ className: "w-full mt-auto" })}>
                          View Details
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}

                {/* Pagination */}
                {data && data.total > data.limit && (
                  <div className="flex justify-center items-center gap-4 mt-10">
                    <Button 
                      variant="outline" 
                      disabled={currentParams.page <= 1}
                      onClick={() => handlePageChange(currentParams.page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm font-medium px-4">
                      Page {currentParams.page} of {Math.ceil(data.total / data.limit)}
                    </span>
                    <Button 
                      variant="outline" 
                      disabled={currentParams.page >= Math.ceil(data.total / data.limit)}
                      onClick={() => handlePageChange(currentParams.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
