import { Link } from "wouter"
import { useClerk } from "@clerk/react"
import { getGetStudentProfileQueryKey, useGetStudentProfile } from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { 
  LayoutDashboard, UserCircle, Bookmark, FileText, Settings, 
  LogOut, ChevronRight, AlertCircle, Bell 
} from "lucide-react"

export default function StudentDashboard() {
  const { signOut } = useClerk()
  const queryClient = useQueryClient()
  const profileQuery = useGetStudentProfile({
    query: { queryKey: getGetStudentProfileQueryKey(), retry: false },
  })
  const profile = profileQuery.data
  const completedFields = [
    profile?.fullName,
    profile?.state,
    profile?.city,
    profile?.college,
    profile?.university,
    profile?.course,
    profile?.educationLevel,
    profile?.academicPercentage,
    profile?.annualFamilyIncome,
    profile?.category,
  ].filter((value) => value !== null && value !== undefined && value !== "").length
  const isComplete = Math.round((completedFields / 10) * 100)

  return (
    <div className="bg-muted/20 min-h-[calc(100vh-64px)] flex flex-col md:flex-row">
      {/* Sidebar Nav */}
      <aside className="w-full md:w-64 bg-card border-r border-border/60 shrink-0">
        <div className="p-6 hidden md:block">
            <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mb-4">
              {(profile?.fullName ?? "S").slice(0, 1).toUpperCase()}
          </div>
          <h2 className="font-bold text-lg">{profile?.fullName || "Student"}</h2>
          <p className="text-sm text-muted-foreground">{profile?.educationLevel || "Student"}{profile?.city ? ` • ${profile.city}` : ""}</p>
        </div>
        
        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible border-b md:border-b-0 p-2 md:p-4 gap-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-lg font-medium whitespace-nowrap">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-lg font-medium transition-colors whitespace-nowrap">
            <UserCircle className="w-5 h-5" />
            My Profile
          </Link>
          <Link href="/saved" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-lg font-medium transition-colors whitespace-nowrap">
            <Bookmark className="w-5 h-5" />
            Saved (8)
          </Link>
          <Link href="/tracker" className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-lg font-medium transition-colors whitespace-nowrap">
            <FileText className="w-5 h-5" />
            Applications (3)
          </Link>
          <div className="hidden md:block my-4 border-t border-border/50"></div>
          <button className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-lg font-medium transition-colors whitespace-nowrap text-left">
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <button onClick={() => { queryClient.clear(); void signOut({ redirectUrl: "/" }) }} className="flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg font-medium transition-colors whitespace-nowrap text-left">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome back, {profile?.fullName?.split(" ")[0] || "student"}!</h1>
          <p className="text-muted-foreground">Here's an overview of your scholarship journey.</p>
        </div>

        {/* Profile Completion Alert */}
        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 mb-8 shadow-sm">
          <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full shrink-0 flex items-center justify-center bg-white dark:bg-background border-4 border-amber-200 dark:border-amber-800">
              <span className="font-bold text-amber-700 dark:text-amber-500">{isComplete}%</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-bold text-amber-800 dark:text-amber-400 mb-1">Complete your profile to unlock better matches</h3>
              <p className="text-sm text-amber-700/80 dark:text-amber-500/80 mb-3">Add your family income and 12th percentage to see 40+ more personalized scholarships.</p>
              <Progress value={isComplete} className="h-2 bg-amber-200 dark:bg-amber-900 [&>div]:bg-amber-500" />
            </div>
            <div className="shrink-0 w-full md:w-auto">
              <Link href="/profile" className={buttonVariants({ variant: "outline", className: "w-full border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900" })}>
                Complete Profile
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">8</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Saved</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent mb-1">3</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Applied</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-500 mb-1">2</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Deadlines</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-1">1</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Awarded</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upcoming Deadlines */}
          <div className="space-y-4">
            <div className="flex justify-between items-end mb-2">
              <h3 className="text-xl font-bold">Upcoming Deadlines</h3>
              <Link href="/saved" className="text-sm text-primary font-medium hover:underline">View all</Link>
            </div>
            
            <Card className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex gap-4">
                <div className="bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400 rounded-lg p-3 text-center shrink-0 min-w-[70px]">
                  <span className="block text-2xl font-bold leading-none">15</span>
                  <span className="block text-xs font-medium uppercase mt-1">Aug</span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground line-clamp-1">HDFC ECS Scholarship</h4>
                  <p className="text-sm text-muted-foreground mb-2">HDFC Bank</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 uppercase">
                    3 Days Left
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex gap-4">
                <div className="bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 rounded-lg p-3 text-center shrink-0 min-w-[70px]">
                  <span className="block text-2xl font-bold leading-none">30</span>
                  <span className="block text-xs font-medium uppercase mt-1">Sep</span>
                </div>
                <div>
                  <h4 className="font-bold text-foreground line-clamp-1">Kotak Kanya Scholarship</h4>
                  <p className="text-sm text-muted-foreground mb-2">Kotak Education Foundation</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground uppercase">
                    Saved
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-2">Recent Activity</h3>
            <Card className="shadow-sm">
              <CardContent className="p-0">
                <div className="divide-y divide-border/50">
                  <div className="p-4 flex gap-4 items-center">
                    <div className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 p-2 rounded-full">
                      <Bookmark className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Saved Kotak Kanya Scholarship</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <div className="p-4 flex gap-4 items-center">
                    <div className="bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300 p-2 rounded-full">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Marked MahaDBT as Applied</p>
                      <p className="text-xs text-muted-foreground">1 week ago</p>
                    </div>
                  </div>
                  <div className="p-4 flex gap-4 items-center">
                    <div className="bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300 p-2 rounded-full">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Added reminder for HDFC ECS</p>
                      <p className="text-xs text-muted-foreground">2 weeks ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-12">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-xl font-bold">Recommended for you</h3>
              <p className="text-sm text-muted-foreground">Based on your state and course level.</p>
            </div>
            <Link href="/discover" className="text-sm text-primary font-medium hover:underline">Browse all</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
            <div className="absolute inset-0 z-10 bg-background/50 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-xl border border-border">
              <AlertCircle className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="font-medium text-foreground mb-4">Recommendations available after profile completion</p>
              <Link href="/profile" className={buttonVariants({ variant: "default" })}>
                Complete Profile Now
              </Link>
            </div>

            {/* Mock blurred cards underneath */}
            {[1, 2].map(i => (
              <Card key={i} className="shadow-sm opacity-50">
                <CardContent className="p-5">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
                  <div className="flex justify-between">
                    <div className="h-8 bg-muted rounded w-20"></div>
                    <div className="h-8 bg-muted rounded w-24"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </main>
    </div>
  )
}
