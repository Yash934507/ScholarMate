import { Link } from "wouter"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { LayoutDashboard, Clock, CheckCircle2, XCircle, Search, FileText } from "lucide-react"

export default function ApplicationTracker() {
  const isDemoMode = true; // Showing mock UI as per instructions

  const columns = [
    { id: 'interested', title: "Interested", count: 1, icon: <Search className="w-4 h-4" />, color: "text-blue-500" },
    { id: 'applied', title: "Applied", count: 2, icon: <FileText className="w-4 h-4" />, color: "text-amber-500" },
    { id: 'under_review', title: "Under Review", count: 1, icon: <Clock className="w-4 h-4" />, color: "text-purple-500" },
    { id: 'awarded', title: "Awarded", count: 1, icon: <CheckCircle2 className="w-4 h-4" />, color: "text-green-500" },
    { id: 'rejected', title: "Not Selected", count: 0, icon: <XCircle className="w-4 h-4" />, color: "text-red-500" },
  ]

  const mockApps = [
    { id: 1, title: "HDFC ECS", provider: "HDFC Bank", deadline: "15 Aug 2025", status: "interested" },
    { id: 2, title: "MahaDBT Rajarshi Shahu", provider: "Govt of Maharashtra", deadline: "31 Oct 2025", status: "applied", dateApplied: "12 May 2025" },
    { id: 3, title: "CSSS Scholarship", provider: "Ministry of Education", deadline: "30 Nov 2025", status: "applied", dateApplied: "20 Jun 2025" },
    { id: 4, title: "Tata Capital Pankh", provider: "Tata Capital", deadline: "Closed", status: "under_review", dateApplied: "15 Apr 2025" },
    { id: 5, title: "Inspire Scholarship", provider: "DST", deadline: "Closed", status: "awarded", amount: "₹80,000", dateApplied: "10 Jan 2025" },
  ]

  return (
    <div className="bg-background min-h-screen pb-20">
      <div className="bg-primary text-primary-foreground py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Application Tracker</h1>
          <p className="text-primary-foreground/80 text-lg">
            Keep all your scholarship applications organized in one place.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        
        {/* GATE STATE */}
        <div className="max-w-2xl mx-auto bg-card rounded-2xl border shadow-sm p-10 text-center mb-20 relative overflow-hidden">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <LayoutDashboard className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Track your applications like a pro</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Create a free account to use the Kanban-style tracker. Move scholarships from "Interested" to "Awarded" and never lose track of a submission.
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

        {/* PREVIEW STATE */}
        {isDemoMode && (
          <div className="opacity-80">
            <div className="flex items-center gap-2 mb-8">
              <div className="h-px bg-border flex-1"></div>
              <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-4">Preview of Tracker View</span>
              <div className="h-px bg-border flex-1"></div>
            </div>

            <div className="flex overflow-x-auto pb-8 -mx-4 px-4 snap-x">
              <div className="flex gap-6 min-w-max">
                {columns.map(col => (
                  <div key={col.id} className="w-[320px] shrink-0 snap-start">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center gap-2 font-semibold">
                        <span className={col.color}>{col.icon}</span>
                        {col.title}
                      </div>
                      <span className="bg-muted text-muted-foreground text-xs font-bold px-2 py-1 rounded-full">
                        {col.count}
                      </span>
                    </div>
                    
                    <div className="bg-muted/30 rounded-xl p-3 min-h-[400px] border border-border/50 space-y-3">
                      {mockApps.filter(app => app.status === col.id).map(app => (
                        <Card key={app.id} className="cursor-grab hover:border-primary/50 transition-colors shadow-sm">
                          <CardContent className="p-4">
                            <h4 className="font-bold text-[15px] leading-tight mb-1">{app.title}</h4>
                            <p className="text-xs text-muted-foreground mb-3">{app.provider}</p>
                            
                            <div className="flex flex-col gap-2 mb-3">
                              {app.dateApplied && (
                                <div className="text-xs flex justify-between bg-muted/50 p-1.5 rounded">
                                  <span className="text-muted-foreground">Applied:</span>
                                  <span className="font-medium">{app.dateApplied}</span>
                                </div>
                              )}
                              {col.id === 'interested' && (
                                <div className="text-xs flex justify-between bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-500 p-1.5 rounded">
                                  <span>Deadline:</span>
                                  <span className="font-medium">{app.deadline}</span>
                                </div>
                              )}
                              {app.amount && (
                                <div className="text-xs flex justify-between bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-500 p-1.5 rounded">
                                  <span>Amount:</span>
                                  <span className="font-medium">{app.amount}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <select className="text-xs w-full bg-background border border-input rounded px-2 py-1.5 outline-none">
                                <option disabled>Move to...</option>
                                {columns.filter(c => c.id !== col.id).map(c => (
                                  <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                              </select>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {col.count === 0 && (
                        <div className="h-24 flex items-center justify-center text-sm text-muted-foreground/50 border-2 border-dashed border-border/50 rounded-lg">
                          Drop scholarships here
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
