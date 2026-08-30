import { useEffect, useMemo, useState } from "react"
import { useLocation, useSearch } from "wouter"
import { Filter, Search as SearchIcon, SlidersHorizontal, X } from "lucide-react"
import {
  useListCategories,
  useListProviders,
  useListScholarships,
  type ListScholarshipsParams,
} from "@workspace/api-client-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NativeSelect } from "@/components/ui/native-select"
import { SearchBar } from "@/components/search-bar"
import { FilterPanel, type FilterState } from "@/components/filter-panel"
import { LoadingGrid } from "@/components/loading-state"
import { EmptyState } from "@/components/empty-state"
import { ErrorState } from "@/components/error-state"
import { DiscoveryScholarshipCard } from "@/components/discovery-scholarship-card"

const PAGE_SIZE = 6

const emptyFilters: FilterState = {
  state: "",
  courseLevel: "",
  courseStream: "",
  categoryId: "",
  providerId: "",
  maxFamilyIncome: "",
  academicPercentage: "",
  deadlineWithinDays: "",
}

function readFilters(params: URLSearchParams): FilterState {
  return {
    state: params.get("state") ?? "",
    courseLevel: params.get("courseLevel") ?? "",
    courseStream: params.get("courseStream") ?? "",
    categoryId: params.get("categoryId") ?? "",
    providerId: params.get("providerId") ?? "",
    maxFamilyIncome: params.get("maxFamilyIncome") ?? "",
    academicPercentage: params.get("academicPercentage") ?? "",
    deadlineWithinDays: params.get("deadlineWithinDays") ?? "",
  }
}

function toNumber(value: string) {
  return value.trim() ? Number(value) : undefined
}

function formatProviderType(type: string) {
  return { govt: "Government", ngo: "NGO", private: "Private", university: "University" }[type] ?? type
}

export default function Discover() {
  const searchString = useSearch()
  const [, setLocation] = useLocation()
  const params = useMemo(() => new URLSearchParams(searchString), [searchString])
  const filters = useMemo(() => readFilters(params), [params])
  const search = params.get("search") ?? ""
  const sortBy = (params.get("sortBy") as ListScholarshipsParams["sortBy"]) ?? "newest"
  const page = Math.max(1, Number(params.get("page") ?? "1"))
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const categoriesQuery = useListCategories()
  const providersQuery = useListProviders()
  const scholarshipsQuery = useListScholarships({
    search: search || undefined,
    categoryId: toNumber(filters.categoryId),
    state: filters.state || undefined,
    providerId: toNumber(filters.providerId),
    courseLevel: (filters.courseLevel || undefined) as ListScholarshipsParams["courseLevel"],
    courseStream: filters.courseStream || undefined,
    maxFamilyIncome: toNumber(filters.maxFamilyIncome),
    academicPercentage: toNumber(filters.academicPercentage),
    deadlineWithinDays: toNumber(filters.deadlineWithinDays),
    sortBy,
    page,
    limit: PAGE_SIZE,
  })

  useEffect(() => {
    document.title = "Discover Scholarships | ScholarMate"
    const description = "Search and filter verified scholarships by category, state, education level, course, income, percentage, deadline, and provider."
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement("meta")
      meta.setAttribute("name", "description")
      document.head.appendChild(meta)
    }
    meta.setAttribute("content", description)
  }, [])

  function updateUrl(next: Partial<FilterState> & { search?: string; sortBy?: string; page?: number }) {
    const nextParams = new URLSearchParams()
    const nextFilters = { ...filters, ...next }
    const nextSearch = next.search ?? search
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value) nextParams.set(key, String(value))
    })
    if (nextSearch) nextParams.set("search", nextSearch)
    if (next.sortBy && next.sortBy !== "newest") nextParams.set("sortBy", next.sortBy)
    const nextPage = next.page ?? 1
    if (nextPage > 1) nextParams.set("page", String(nextPage))
    setLocation(`/discover?${nextParams.toString()}`)
  }

  function clearFilters() {
    setLocation("/discover")
  }

  const results = scholarshipsQuery.data?.scholarships ?? []
  const total = scholarshipsQuery.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const categories = categoriesQuery.data?.categories ?? []
  const providers = providersQuery.data?.providers ?? []
  const hasActiveFilters = Boolean(
    search || Object.values(filters).some(Boolean) || sortBy !== "newest",
  )

  const activeChips = [
    search ? `Keyword: ${search}` : "",
    filters.categoryId ? categories.find((c) => String(c.id) === filters.categoryId)?.name ?? "Category" : "",
    filters.providerId ? providers.find((p) => String(p.id) === filters.providerId)?.name ?? "Provider" : "",
    filters.state,
    filters.courseLevel,
    filters.courseStream,
    filters.maxFamilyIncome ? `Income ≤ ₹${Number(filters.maxFamilyIncome).toLocaleString("en-IN")}` : "",
    filters.academicPercentage ? `${filters.academicPercentage}% minimum` : "",
    filters.deadlineWithinDays ? `Next ${filters.deadlineWithinDays} days` : "",
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="border-b bg-primary py-12 text-primary-foreground">
        <div className="container mx-auto px-4">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground/70">Scholarship directory</p>
          <h1 className="text-3xl font-bold md:text-4xl">Find scholarships that fit your goals</h1>
          <p className="mt-3 max-w-2xl text-base text-primary-foreground/80">
            Search the live scholarship catalogue and narrow results by education, course, income, deadline, and provider.
          </p>
          <div className="mt-7 max-w-3xl">
            <SearchBar
              value={search}
              onChange={(value) => updateUrl({ search: value })}
              placeholder="Search by scholarship name, provider, or keyword…"
              size="large"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-5 flex items-center justify-between lg:hidden">
          <p className="font-semibold">{scholarshipsQuery.isLoading ? "Searching…" : `${total} scholarships`}</p>
          <Button variant="outline" onClick={() => setMobileFiltersOpen((open) => !open)} className="gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className={`lg:w-72 lg:shrink-0 ${mobileFiltersOpen ? "block" : "hidden lg:block"}`}>
            <div className="rounded-xl border bg-card p-5 shadow-sm lg:sticky lg:top-24">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold"><Filter className="h-4 w-4" /> Filters</h2>
                {mobileFiltersOpen && <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)}><X className="h-4 w-4" /></Button>}
              </div>
              <FilterPanel
                filters={filters}
                categories={categories}
                providers={providers}
                onFilterChange={(change) => updateUrl(change)}
                onReset={clearFilters}
              />
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <div className="mb-5 rounded-xl border bg-muted/25 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">
                    {scholarshipsQuery.isLoading ? "Finding scholarships…" : `${total} scholarship${total === 1 ? "" : "s"} found`}
                  </p>
                  {hasActiveFilters && <p className="mt-1 text-xs text-muted-foreground">Filters are applied from the live catalogue.</p>}
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort-by" className="text-sm text-muted-foreground">Sort by</label>
                  <NativeSelect
                    id="sort-by"
                    className="h-9 w-auto min-w-40 bg-background text-sm"
                    value={sortBy}
                    onChange={(event) => updateUrl({ sortBy: event.target.value })}
                    data-testid="select-sort"
                  >
                    <option value="newest">Newest</option>
                    <option value="relevance">Relevance</option>
                    <option value="deadline_asc">Deadline soonest</option>
                    <option value="amount_desc">Highest benefit</option>
                  </NativeSelect>
                </div>
              </div>
              {activeChips.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 border-t pt-3">
                  {activeChips.map((chip) => <Badge key={chip} variant="secondary">{chip}</Badge>)}
                  <button type="button" onClick={clearFilters} className="text-xs font-medium text-primary hover:underline">Clear all</button>
                </div>
              )}
            </div>

            {scholarshipsQuery.isLoading ? (
              <LoadingGrid count={3} isCompact />
            ) : scholarshipsQuery.isError ? (
              <ErrorState title="Couldn’t load scholarships" description="The scholarship catalogue could not be reached. Please try again." onRetry={() => scholarshipsQuery.refetch()} />
            ) : results.length === 0 ? (
              <EmptyState
                icon={<SearchIcon className="h-12 w-12" />}
                title="No scholarships match those filters"
                description="Try removing a filter or searching with a broader keyword."
                actionLabel="Clear all filters"
                onAction={clearFilters}
              />
            ) : (
              <>
                <div className="space-y-5">
                  {results.map((scholarship) => <DiscoveryScholarshipCard key={scholarship.id} scholarship={scholarship} />)}
                </div>
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <Button variant="outline" disabled={page <= 1} onClick={() => updateUrl({ page: page - 1 })}>Previous</Button>
                    <span className="text-sm font-medium">Page {page} of {totalPages}</span>
                    <Button variant="outline" disabled={page >= totalPages} onClick={() => updateUrl({ page: page + 1 })}>Next</Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}