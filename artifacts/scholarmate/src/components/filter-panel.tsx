import { NativeSelect } from "@/components/ui/native-select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface FilterState {
  state: string;
  courseLevel: string;
  providerType: string;
  casteCategory: string;
  gender: string;
  maxIncome: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  className?: string;
}

export function FilterPanel({ filters, onFilterChange, onReset, className = "" }: FilterPanelProps) {
  return (
    <div className={`space-y-6 ${className}`} data-testid="filter-panel">
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Input 
          id="state"
          placeholder="e.g. Maharashtra" 
          value={filters.state}
          onChange={(e) => onFilterChange({ state: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="courseLevel">Course Level</Label>
        <NativeSelect 
          id="courseLevel"
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
        <Label htmlFor="providerType">Provider Type</Label>
        <NativeSelect 
          id="providerType"
          value={filters.providerType}
          onChange={(e) => onFilterChange({ providerType: e.target.value })}
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
          onChange={(e) => onFilterChange({ casteCategory: e.target.value })}
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
          onChange={(e) => onFilterChange({ gender: e.target.value })}
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
          onChange={(e) => onFilterChange({ maxIncome: e.target.value })}
        />
      </div>

      <Button variant="outline" className="w-full" onClick={onReset}>
        Clear Filters
      </Button>
    </div>
  );
}
