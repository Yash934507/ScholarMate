import { Link } from "wouter"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bookmark, IndianRupee, Clock, Search, MapPin, GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react"

export default function SavedScholarships() {
  // Using true to show both states for UI review as requested by instructions
  const isDemoMode = true; 

  const mockSaved = [
    {
      id: 101,
      title: "Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna",
      provider: "Government of Maharashtra",
      amount: "100% Tuition Fee",
      deadline: "2025-10-31",
      level: "UG",
      state: "Maharashtra"
    },
    {
      id: 102,
      title: "HDFC Bank Educational Crisis Scholarship",
      provider: "HDFC Bank",
      amount: "₹25,000",
      deadline: "2025-08-15",
      level: "Any",
      state: "National"
    },
    {
      id: 103,
      title: "Kotak Kanya Scholarship",
      provider: "Kotak Education Foundation",
      amount: "₹1,50,000",
      deadline: "2025-09-30",
      level: "UG",
      state: "National"
    }
  ]

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="bg-primary text-primary-foreground py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Saved Scholarships</h1>
          <p className="text-primary-foreground/80 text-lg">
            Manage the opportunities you've bookmarked.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        
        {/* GATE STATE - Logged Out */}
        <div className="max-w-2xl mx-auto bg-card rounded-2xl border shadow-sm p-10 text-center mb-20 relative overflow-hidden">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Save scholarships you want to apply to</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Create a free account to bookmark scholarships, track applications, and get deadline reminders straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className={buttonVariants({ size: "lg", className: "bg-accent text-accent-foreground hover:bg-accent/90 px-8" })}>
              Create Free Account
            </Link>
            <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg", className: "px-8" })}>
              Login
            </Link>
          </div>
        </div>

        {/* PREVIEW STATE - Logged In (Mock Data) */}
        {isDemoMode && (
          <div className="space-y-6 opacity-70">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-px bg-border flex-1"></div>
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-4">Preview of saved scholarships view</span>
              <div className="h-px bg-border flex-1"></div>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" className="bg-primary/10 text-primary hover:bg-primary/20">All</Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">Government</Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">Private</Button>
                <Button variant="ghost" size="sm" className="text-muted-foreground">NGO</Button>
              </div>
              <div className="flex gap-2 text-sm items-center">
                <span className="text-muted-foreground">Sort by:</span>
                <select className="bg-transparent border border-input rounded-md px-2 py-1 outline-none text-foreground">
                  <option>Deadline (Soonest)</option>
                  <option>Amount (Highest)</option>
                  <option>Recently Saved</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockSaved.map((scholarship) => (
                <Card key={scholarship.id} className="flex flex-col hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {scholarship.level}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          {scholarship.state}
                        </span>
                      </div>
                      <button className="text-muted-foreground hover:text-destructive transition-colors">
                        <Bookmark className="h-5 w-5 fill-primary text-primary" />
                      </button>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 leading-tight">{scholarship.title}</h3>
                    <p className="text-sm font-medium text-muted-foreground mb-6 flex-1">{scholarship.provider}</p>
                    
                    <div className="space-y-3 mb-6 bg-muted/30 p-4 rounded-lg">
                      <div className="flex items-center text-sm">
                        <IndianRupee className="h-4 w-4 mr-3 text-primary" />
                        <span className="font-medium">{scholarship.amount}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-3 text-amber-500" />
                        <span className="text-amber-700 dark:text-amber-500 font-medium">Closes: {scholarship.deadline}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-auto">
                      <Button className="w-full justify-between group">
                        Mark as Applied 
                        <CheckCircle2 className="h-4 w-4 text-primary-foreground/70 group-hover:text-primary-foreground transition-colors" />
                      </Button>
                      <Button variant="outline" className="w-full text-primary">View Details</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
