export const APPLICATION_STATUSES = [
  "Saved",
  "Planning to Apply",
  "Applied",
  "Under Review",
  "Approved",
  "Rejected",
  "Closed",
] as const

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number]

export type DashboardScholarship = {
  id: number
  title: string
  provider: string
  amount: string
  level: string
  location: string
  deadlineInDays: number
  match: number
  tone: "navy" | "amber" | "teal" | "purple"
}

export type DashboardApplication = DashboardScholarship & {
  status: ApplicationStatus
  updated: string
}

export const dashboardScholarships: DashboardScholarship[] = [
  {
    id: 201,
    title: "MahaDBT Rajarshi Shahu Maharaj Scholarship",
    provider: "Government of Maharashtra",
    amount: "Tuition fee support",
    level: "UG",
    location: "Maharashtra",
    deadlineInDays: 18,
    match: 96,
    tone: "navy",
  },
  {
    id: 202,
    title: "Kotak Kanya Scholarship",
    provider: "Kotak Education Foundation",
    amount: "Up to ₹1,50,000",
    level: "UG",
    location: "All India",
    deadlineInDays: 31,
    match: 91,
    tone: "amber",
  },
  {
    id: 203,
    title: "HDFC Bank Parivartan ECS Scholarship",
    provider: "HDFC Bank",
    amount: "Up to ₹75,000",
    level: "UG",
    location: "All India",
    deadlineInDays: 9,
    match: 87,
    tone: "teal",
  },
  {
    id: 204,
    title: "Tata Capital Pankh Scholarship",
    provider: "Tata Capital",
    amount: "Up to ₹50,000",
    level: "UG",
    location: "All India",
    deadlineInDays: 46,
    match: 84,
    tone: "purple",
  },
  {
    id: 205,
    title: "Central Sector Scheme of Scholarship",
    provider: "Ministry of Education",
    amount: "Up to ₹20,000 / year",
    level: "UG",
    location: "All India",
    deadlineInDays: 63,
    match: 82,
    tone: "navy",
  },
  {
    id: 206,
    title: "L&T Build India Scholarship",
    provider: "Larsen & Toubro",
    amount: "Academic fee support",
    level: "UG",
    location: "All India",
    deadlineInDays: 76,
    match: 78,
    tone: "amber",
  },
]

export const dashboardApplications: DashboardApplication[] = [
  { ...dashboardScholarships[0], status: "Planning to Apply", updated: "Updated yesterday" },
  { ...dashboardScholarships[2], status: "Applied", updated: "Updated 4 days ago" },
  { ...dashboardScholarships[3], status: "Under Review", updated: "Updated 1 week ago" },
  { ...dashboardScholarships[4], status: "Approved", updated: "Updated 2 weeks ago" },
  { ...dashboardScholarships[1], status: "Saved", updated: "Saved 2 weeks ago" },
  { ...dashboardScholarships[5], status: "Closed", updated: "Closed last month" },
]

export const recentScholarships = [
  { ...dashboardScholarships[3], viewed: "Today, 10:42 AM" },
  { ...dashboardScholarships[1], viewed: "Yesterday" },
  { ...dashboardScholarships[4], viewed: "3 days ago" },
]

export function dateFromToday(days: number): Date {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + days)
  return date
}

export function formatDeadline(days: number): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(dateFromToday(days))
}

export function deadlineLabel(days: number): string {
  if (days === 0) return "Due today"
  if (days === 1) return "Due tomorrow"
  return `${days} days left`
}
