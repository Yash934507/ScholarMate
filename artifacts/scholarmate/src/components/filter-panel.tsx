import { NativeSelect } from "@/components/ui/native-select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Category, Provider } from "@workspace/api-client-react"

export interface FilterState {
  state: string;
  courseLevel: string;
  courseStream: string;
  categoryId: string;
  providerId: string;
  maxFamilyIncome: string;
  academicPercentage: string;
  deadlineWithinDays: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  categories: Category[];
  providers: Provider[];
  className?: string;
}

export function FilterPanel({ filters, onFilterChange, onReset, categories, providers, className = "" }: FilterPanelProps) {
  return (
    <div className={`space-y-5 ${className}`} data-testid="filter-panel">
      <div className="space-y-2">
        <Label htmlFor="filter-state">State</Label>
        <Input
          id="filter-state"
          placeholder="e.g. Maharashtra"
          value={filters.state}
          onChange={(e) => onFilterChange({ state: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-category">Category</Label>
        <NativeSelect id="filter-category" value={filters.categoryId} onChange={(e) => onFilterChange({ categoryId: e.target.value })}>
          <option value="">All categories</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </NativeSelect>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-provider">Provider</Label>
        <NativeSelect id="filter-provider" value={filters.providerId} onChange={(e) => onFilterChange({ providerId: e.target.value })}>
          <option value="">All providers</option>
          {providers.map((provider) => <option key={provider.id} value={provider.id}>{provider.name}</option>)}
        </NativeSelect>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-level">Education level</Label>
        <NativeSelect
          id="filter-level"
          value={filters.courseLevel}
          onChange={(e) => onFilterChange({ courseLevel: e.target.value })}
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
        <Label htmlFor="filter-course">Course or stream</Label>
        <Input id="filter-course" placeholder="e.g. B.Tech or MBBS" value={filters.courseStream} onChange={(e) => onFilterChange({ courseStream: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-income">Annual family income (₹)</Label>
        <Input id="filter-income" type="number" min="0" placeholder="e.g. 800000" value={filters.maxFamilyIncome} onChange={(e) => onFilterChange({ maxFamilyIncome: e.target.value })} />
        <p className="text-xs text-muted-foreground">Show scholarships whose income limit covers this amount.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-percentage">Academic percentage</Label>
        <Input id="filter-percentage" type="number" min="0" max="100" placeholder="e.g. 75" value={filters.academicPercentage} onChange={(e) => onFilterChange({ academicPercentage: e.target.value })} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="filter-deadline">Deadline within</Label>
        <NativeSelect id="filter-deadline" value={filters.deadlineWithinDays} onChange={(e) => onFilterChange({ deadlineWithinDays: e.target.value })}>
          <option value="">Any deadline</option>
          <option value="7">Next 7 days</option>
          <option value="30">Next 30 days</option>
          <option value="90">Next 90 days</option>
          <option value="365">Next year</option>
        </NativeSelect>
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={onReset} data-testid="button-clear-filters">
        Clear Filters
      </Button>
    </div>
  )
}
