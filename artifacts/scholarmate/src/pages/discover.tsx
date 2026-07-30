import { useEffect, useState, useMemo } from "react"
import { useSearch, useLocation } from "wouter"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NativeSelect } from "@/components/ui/native-select"
import { Filter, X, Search as SearchIcon } from "lucide-react"

import { mockScholarships } from "@/lib/mock-data"
import { ScholarshipCard } from "@/components/scholarship-card"
import { SearchBar } from "@/components/search-bar"
import { FilterPanel } from "@/components/filter-panel"
import { LoadingGrid } from "@/components/loading-state"
import { EmptyState } from "@/components/empty-state"
import { ErrorState } from "@/components/error-state"

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
  
  const simulateError = params.get("simulateError") === "true";

  const [filters, setFilters] = useState(currentParams)
  const [isLoading, setIsLoading] = useState(true)

  // synchronize local state when URL changes
  useEffect(() => {
    setFilters(currentParams)
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchParams])

  const applyFilters = (newFilters: Partial<typeof currentParams>) => {
    const updated = { ...filters, ...newFilters, page: 1 } 
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

  // Client-side filtering logic
  const filteredData = mockScholarships.filter(s => {
    if (filters.search && !s.title.toLowerCase().includes(filters.search.toLowerCase()) && !s.providerName.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.state && s.state.toLowerCase() !== filters.state.toLowerCase()) return false;
    if (filters.providerType && s.providerType !== filters.providerType) return false;
    if (filters.courseLevel && s.courseLevel !== filters.courseLevel && s.courseLevel !== "Any") return false;
    if (filters.gender && s.gender !== "any" && filters.gender !== s.gender) return false;
    if (filters.maxIncome) {
      if (s.maxAnnualIncome !== null && s.maxAnnualIncome < parseInt(filters.maxIncome)) return false;
    }
    if (filters.casteCategory) {
      if (!s.casteCategories.includes("All") && !s.casteCategories.includes(filters.casteCategory)) return false;
    }
    return true;
  });

  const limit = 10;
  const total = filteredData.length;
  const paginatedData = filteredData.slice((filters.page - 1) * limit, filters.page * limit);

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
            <span className="font-medium text-lg">{total} Results</span>
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
              
              <div className="mb-6">
                 <SearchBar 
                   value={filters.search}
                   onChange={(val) => applyFilters({ search: val })}
                   placeholder="Keywords..."
                 />
              </div>

              <FilterPanel 
                filters={filters}
                onFilterChange={applyFilters}
                onReset={clearFilters}
              />
            </div>
          </aside>

          {/* Main List */}
          <main className="lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-muted/30 p-4 rounded-xl border">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-foreground">{total} Scholarships found</span>
                {/* Active Filter Chips */}
                {(currentParams.state || currentParams.courseLevel || currentParams.providerType) && (
                  <div className="flex flex-wrap gap-1 ml-2 border-l pl-2 border-border/50">
                    {currentParams.state && (
                      <Badge variant="secondary" className="gap-1 bg-background text-xs font-normal">
                        {currentParams.state} <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => applyFilters({ state: "" })} />
                      </Badge>
                    )}
                    {currentParams.courseLevel && (
                      <Badge variant="secondary" className="gap-1 bg-background text-xs font-normal">
                        {currentParams.courseLevel} <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => applyFilters({ courseLevel: "" })} />
                      </Badge>
                    )}
                    {currentParams.providerType && (
                      <Badge variant="secondary" className="gap-1 bg-background text-xs font-normal">
                        {formatProviderType(currentParams.providerType)} <X className="w-3 h-3 cursor-pointer hover:text-destructive" onClick={() => applyFilters({ providerType: "" })} />
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <NativeSelect className="h-9 text-sm" defaultValue="newest">
                  <option value="newest">Newest First</option>
                  <option value="deadline">Deadline (Soonest)</option>
                  <option value="amount">Amount (Highest)</option>
                </NativeSelect>
              </div>
            </div>

            {simulateError ? (
              <ErrorState 
                title="Failed to load scholarships"
                description="We encountered an issue while connecting to the database. Please try again."
                onRetry={() => {
                  const p = new URLSearchParams(searchParams);
                  p.delete("simulateError");
                  setLocation(`/discover?${p.toString()}`);
                }}
              />
            ) : isLoading ? (
              <LoadingGrid count={4} isCompact={true} />
            ) : total === 0 ? (
              <EmptyState 
                icon={<SearchIcon className="h-12 w-12" />}
                title="No scholarships found"
                description="Try adjusting your filters to see more results."
                actionLabel="Clear all filters"
                onAction={clearFilters}
              />
            ) : (
              <div className="space-y-6">
                {paginatedData.map((scholarship) => (
                  <ScholarshipCard key={scholarship.id} scholarship={scholarship} isCompact={true} />
                ))}

                {/* Pagination */}
                {total > limit && (
                  <div className="flex justify-center items-center gap-4 mt-10">
                    <Button 
                      variant="outline" 
                      disabled={currentParams.page <= 1}
                      onClick={() => handlePageChange(currentParams.page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm font-medium px-4">
                      Page {currentParams.page} of {Math.ceil(total / limit)}
                    </span>
                    <Button 
                      variant="outline" 
                      disabled={currentParams.page >= Math.ceil(total / limit)}
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
