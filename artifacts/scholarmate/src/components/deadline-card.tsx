import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Clock } from "lucide-react";
import type { MockScholarship } from "@/lib/mock-data";

interface DeadlineCardProps {
  scholarship: MockScholarship;
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "Check website";
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr));
}

function isUrgent(dateStr: string | null | undefined) {
  if (!dateStr) return false;
  const deadline = new Date(dateStr).getTime();
  // Using fixed current date 2026-07-30 as per requirements
  const now = new Date("2026-07-30T00:00:00Z").getTime();
  const daysDiff = (deadline - now) / (1000 * 3600 * 24);
  return daysDiff > 0 && daysDiff <= 30;
}

export function DeadlineCard({ scholarship }: DeadlineCardProps) {
  const urgent = isUrgent(scholarship.deadline);

  return (
    <Card className="w-[350px] shrink-0 border-none bg-background text-foreground shadow-lg" data-testid={`deadline-card-${scholarship.id}`}>
      <CardContent className="p-6">
        <div className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold mb-4 uppercase ${urgent ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400' : 'bg-primary/10 text-primary'}`}>
          <Clock className="w-3 h-3 mr-1" />
          Closes: {formatDate(scholarship.deadline)}
        </div>
        <h3 className="font-bold text-lg line-clamp-2 leading-tight mb-2 whitespace-normal">{scholarship.title}</h3>
        <p className="text-sm text-muted-foreground truncate mb-6">{scholarship.providerName}</p>
        <Link href={`/scholarships/${scholarship.id}`} className={buttonVariants({ variant: "outline", className: "w-full border-2 hover:bg-primary/5" })}>
          View Details
        </Link>
      </CardContent>
    </Card>
  );
}
