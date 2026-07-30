import { useState } from "react"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, X, ArrowLeft, Check, AlertCircle } from "lucide-react"

import { mockScholarships } from "@/lib/mock-data"

export default function CompareScholarships() {
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Local filtering for the search dropdown
  const searchResults = mockScholarships.filter(s => {
    if (!searchQuery) return true;
    return s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
           s.providerName.toLowerCase().includes(searchQuery.toLowerCase());
  }).slice(0, 10);
  
  // Selected scholarships for comparison
  const selectedScholarships = mockScholarships.filter(s => selectedIds.includes(s.id))

  const toggleScholarship = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id))
    } else {
      if (selectedIds.length >= 4) return // Max 4
      setSelectedIds(prev => [...prev, id])
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  // Find max amount to highlight
  const amounts = selectedScholarships.map(s => s.amount || 0)
  const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 0

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "Varies"
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
  }

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return "Varies"
    return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr))
  }

  const formatProviderType = (type: string) => {
    switch(type) {
      case 'govt': return 'Government';
      case 'university': return 'University';
      case 'ngo': return 'NGO';
      case 'private': return 'Private';
      default: return type;
    }
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="bg-primary text-primary-foreground py-10 border-b border-primary-foreground/10">
        <div className="container mx-auto px-4">
          <Link href="/discover" className="inline-flex items-center text-primary-foreground/70 hover:text-primary-foreground mb-4 transition-colors text-sm font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Discover
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Compare Scholarships</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl">
            Select up to 4 scholarships to compare their eligibility criteria and award amounts side-by-side.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-2xl mb-12">
          <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal h-14 text-lg border-2" disabled={selectedIds.length >= 4}>
                <Plus className="mr-2 h-5 w-5 text-accent" />
                {selectedIds.length >= 4 
                  ? "Maximum of 4 scholarships selected" 
                  : "Add scholarship to compare..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name or provider..." 
                    className="pl-9 h-10" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <ScrollArea className="h-[300px]">
                {searchResults.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">No scholarships found.</div>
                ) : (
                  <div className="p-2 space-y-1">
                    {searchResults.map(s => (
                      <div 
                        key={s.id} 
                        className={`flex items-start justify-between p-3 rounded-md cursor-pointer hover:bg-muted transition-colors ${selectedIds.includes(s.id) ? 'bg-primary/5' : ''}`}
                        onClick={() => toggleScholarship(s.id)}
                      >
                        <div>
                          <div className="font-medium text-sm leading-tight mb-1">{s.title}</div>
                          <div className="text-xs text-muted-foreground">{s.providerName}</div>
                        </div>
                        {selectedIds.includes(s.id) && <Check className="h-4 w-4 text-primary shrink-0 ml-2" />}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
          <p className="text-sm text-muted-foreground mt-2">
            Selected: {selectedIds.length}/4
          </p>
        </div>

        {/* Comparison Table */}
        {selectedIds.length < 2 ? (
          <div className="bg-card border border-dashed rounded-xl py-24 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-medium mb-2">Select scholarships to compare</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You need to select at least 2 scholarships to see them side-by-side. Use the search bar above to add them.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-8">
            <div className="min-w-[800px]">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="w-48 p-4 text-left font-medium text-muted-foreground border-b border-r bg-muted/10 align-bottom">
                      Features
                    </th>
                    {selectedScholarships.map(s => (
                      <th key={s.id} className="p-4 border-b border-r last:border-r-0 min-w-[250px] max-w-[300px] align-top bg-card relative">
                        <button 
                          onClick={() => toggleScholarship(s.id)}
                          className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors bg-background rounded-full p-1 shadow-sm border"
                          title="Remove from comparison"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="pr-8 pt-4">
                          <h3 className="font-bold text-lg leading-tight mb-2 text-foreground text-left">{s.title}</h3>
                          <Link href={`/scholarships/${s.id}`} className="text-sm text-primary hover:underline block text-left">
                            View Details
                          </Link>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-card">
                  {/* Provider */}
                  <tr>
                    <td className="p-4 font-semibold text-sm border-b border-r bg-muted/10">Provider</td>
                    {selectedScholarships.map(s => (
                      <td key={s.id} className="p-4 text-sm border-b border-r last:border-r-0">
                        {s.providerName}
                      </td>
                    ))}
                  </tr>

                  {/* Type */}
                  <tr>
                    <td className="p-4 font-semibold text-sm border-b border-r bg-muted/10">Type</td>
                    {selectedScholarships.map(s => (
                      <td key={s.id} className="p-4 text-sm border-b border-r last:border-r-0">
                        <span className="inline-flex px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                          {formatProviderType(s.providerType)}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Amount */}
                  <tr>
                    <td className="p-4 font-semibold text-sm border-b border-r bg-muted/10">Award Amount</td>
                    {selectedScholarships.map(s => {
                      const isHighest = s.amount === maxAmount && maxAmount > 0;
                      return (
                        <td key={s.id} className={`p-4 border-b border-r last:border-r-0 transition-colors ${isHighest ? 'bg-amber-50 dark:bg-amber-950/30' : ''}`}>
                          <div className={`font-bold text-lg ${isHighest ? 'text-amber-700 dark:text-amber-500' : ''}`}>
                            {formatCurrency(s.amount)}
                          </div>
                          {s.frequency && <div className="text-xs text-muted-foreground capitalize mt-1">{s.frequency}</div>}
                        </td>
                      )
                    })}
                  </tr>

                  {/* Deadline */}
                  <tr>
                    <td className="p-4 font-semibold text-sm border-b border-r bg-muted/10">Deadline</td>
                    {selectedScholarships.map(s => (
                      <td key={s.id} className="p-4 text-sm font-medium border-b border-r last:border-r-0">
                        {formatDate(s.deadline)}
                      </td>
                    ))}
                  </tr>

                  {/* Spacer / Section Header */}
                  <tr>
                    <td colSpan={selectedScholarships.length + 1} className="p-3 bg-muted/30 border-b text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Eligibility Criteria
                    </td>
                  </tr>

                  {/* State */}
                  <tr>
                    <td className="p-4 font-semibold text-sm border-b border-r bg-muted/10">State Limit</td>
                    {selectedScholarships.map(s => (
                      <td key={s.id} className="p-4 text-sm border-b border-r last:border-r-0">
                        {s.state}
                      </td>
                    ))}
                  </tr>

                  {/* Course Level */}
                  <tr>
                    <td className="p-4 font-semibold text-sm border-b border-r bg-muted/10">Education Level</td>
                    {selectedScholarships.map(s => (
                      <td key={s.id} className="p-4 text-sm border-b border-r last:border-r-0">
                        <span className="inline-flex px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium">
                          {s.courseLevel}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Categories */}
                  <tr>
                    <td className="p-4 font-semibold text-sm border-b border-r bg-muted/10">Eligible Castes</td>
                    {selectedScholarships.map(s => (
                      <td key={s.id} className="p-4 text-sm border-b border-r last:border-r-0">
                        <div className="flex flex-wrap gap-1">
                          {s.casteCategories.includes("All") ? (
                            <span className="text-muted-foreground">Open to all categories</span>
                          ) : (
                            s.casteCategories.map(c => (
                               <span key={c} className="inline-flex px-2 py-0.5 border rounded text-xs bg-background">
                                 {c}
                               </span>
                             ))
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Income */}
                  <tr>
                    <td className="p-4 font-semibold text-sm border-b border-r bg-muted/10">Income Limit</td>
                    {selectedScholarships.map(s => (
                      <td key={s.id} className="p-4 text-sm border-b border-r last:border-r-0">
                        {s.maxAnnualIncome ? `Up to ${formatCurrency(s.maxAnnualIncome)}/yr` : 'No limit specified'}
                      </td>
                    ))}
                  </tr>

                  {/* Percentage */}
                  <tr>
                    <td className="p-4 font-semibold text-sm border-b border-r bg-muted/10">Min. Percentage</td>
                    {selectedScholarships.map(s => (
                      <td key={s.id} className="p-4 text-sm border-b border-r last:border-r-0">
                        {s.minPercentage ? `${s.minPercentage}%` : 'Not specified'}
                      </td>
                    ))}
                  </tr>

                  {/* Actions */}
                  <tr>
                    <td className="p-4 border-r bg-muted/10"></td>
                    {selectedScholarships.map(s => (
                      <td key={s.id} className="p-4 border-r last:border-r-0 align-bottom">
                        <a 
                          href={s.applicationUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-full flex items-center justify-center bg-accent text-accent-foreground hover:bg-accent/90 py-2.5 rounded-md font-medium text-sm transition-colors"
                        >
                          Apply Now
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <p>Eligibility criteria are indicative. The scholarship provider makes final determinations based on full official guidelines.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
