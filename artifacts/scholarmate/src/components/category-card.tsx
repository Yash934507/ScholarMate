import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
}

export function CategoryCard({ icon, label, description, href }: CategoryCardProps) {
  return (
    <Link href={href} data-testid={`category-card-${label.toLowerCase()}`}>
      <Card className="hover:border-accent hover:shadow-md transition-all cursor-pointer group bg-card h-full">
        <CardContent className="p-6 text-center">
          <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            {icon}
          </div>
          <h3 className="font-bold text-xl mb-1">{label}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <div className="text-primary font-medium text-sm inline-flex items-center">
            View all <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
