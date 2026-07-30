import { Link } from "wouter";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { IndianRupee, GraduationCap, MapPin } from "lucide-react";
import type { MockScholarship } from "@/lib/mock-data";

interface ScholarshipCardProps {
  scholarship: MockScholarship;
  className?: string;
  isCompact?: boolean;
}

function formatCurrency(amount: number | null | undefined) {
  if (amount === null || amount === undefined) return "Varies";
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "Check website";
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(dateStr));
}

function formatProviderType(type: string) {
  switch(type) {
    case 'govt': return 'Government';
    case 'university': return 'University';
    case 'ngo': return 'NGO';
    case 'private': return 'Private';
    default: return type;
  }
}

export function ScholarshipCard({ scholarship, className = "", isCompact = false }: ScholarshipCardProps) {
  if (isCompact) {
    return (
      <Card className={`overflow-hidden hover:shadow-md transition-shadow group border-border/60 ${className}`} data-testid={`scholarship-card-${scholarship.id}`}>
        <div className="flex flex-col md:flex-row">
          <div className="p-6 md:w-3/4 flex flex-col border-b md:border-b-0 md:border-r border-border/50">
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="bg-muted text-muted-foreground border-transparent capitalize">
                {formatProviderType(scholarship.providerType)}
              </Badge>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                {scholarship.courseLevel}
              </Badge>
              {scholarship.state !== "National" && (
                <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">
                  {scholarship.state}
                </Badge>
              )}
            </div>
            <Link href={`/scholarships/${scholarship.id}`} className="inline-block group-hover:text-primary transition-colors cursor-pointer mb-2">
              <h3 className="text-xl font-bold">{scholarship.title}</h3>
            </Link>
            <p className="text-sm font-medium text-muted-foreground mb-4">
              {scholarship.providerName}
            </p>
            <p className="text-sm text-foreground/80 line-clamp-2 mt-auto">
              {scholarship.description}
            </p>
          </div>
          
          <div className="p-6 md:w-1/4 flex flex-col justify-between bg-muted/10">
            <div className="space-y-4 mb-6">
              <div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-1">Award</span>
                <div className="font-semibold text-lg flex flex-col">
                  <span>{formatCurrency(scholarship.amount)}</span>
                  {scholarship.frequency && (
                    <span className="text-xs text-muted-foreground capitalize font-normal">{scholarship.frequency}</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider block mb-1">Deadline</span>
                <div className="font-medium text-sm">
                  {formatDate(scholarship.deadline)}
                </div>
              </div>
            </div>
            
            <Link href={`/scholarships/${scholarship.id}`} className={buttonVariants({ className: "w-full mt-auto" })}>
              View Details
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  // Standard card variant (e.g. for Home grid)
  return (
    <Card className={`flex flex-col hover:shadow-xl transition-shadow duration-300 border-border/60 ${className}`} data-testid={`scholarship-card-${scholarship.id}`}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4 mb-3">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-transparent shadow-none capitalize">
            {formatProviderType(scholarship.providerType)}
          </Badge>
          <span className="text-xs font-bold text-muted-foreground uppercase flex items-center bg-muted px-2 py-1 rounded">
            <MapPin className="h-3 w-3 mr-1" /> {scholarship.state}
          </span>
        </div>
        <CardTitle className="text-xl line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          <Link href={`/scholarships/${scholarship.id}`}>{scholarship.title}</Link>
        </CardTitle>
        <CardDescription className="text-sm font-medium text-foreground/70">
          {scholarship.providerName}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6 flex-1">
        <div className="bg-muted/30 p-4 rounded-xl space-y-3">
          <div className="flex items-center text-sm">
            <div className="w-8 flex justify-center shrink-0"><IndianRupee className="h-5 w-5 text-primary" /></div>
            <span className="font-bold text-foreground text-base">{formatCurrency(scholarship.amount)}</span>
            {scholarship.frequency && <span className="text-muted-foreground text-xs ml-1 capitalize">({scholarship.frequency})</span>}
          </div>
          <div className="flex items-center text-sm">
            <div className="w-8 flex justify-center shrink-0"><GraduationCap className="h-5 w-5 text-primary" /></div>
            <span className="font-medium text-foreground">{scholarship.courseLevel} Level</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-6 flex justify-between items-center px-6">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Deadline</span>
          <span className="font-semibold text-sm">{formatDate(scholarship.deadline)}</span>
        </div>
        <Link href={`/scholarships/${scholarship.id}`} className={buttonVariants({ className: "bg-accent text-accent-foreground hover:bg-accent/90" })}>
          Details
        </Link>
      </CardFooter>
    </Card>
  );
}
