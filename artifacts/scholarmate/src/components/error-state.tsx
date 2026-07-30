import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ title, description, onRetry, className = "" }: ErrorStateProps) {
  return (
    <div className={`text-center py-20 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900 ${className}`} data-testid="error-state">
      <div className="h-12 w-12 text-amber-500 mx-auto mb-4 flex items-center justify-center">
        <AlertTriangle className="h-10 w-10" />
      </div>
      <h3 className="text-xl font-medium mb-2 text-amber-800 dark:text-amber-400">{title}</h3>
      <p className="text-amber-700/80 dark:text-amber-500/80 mb-6 max-w-md mx-auto">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-900/50">
          Try Again
        </Button>
      )}
    </div>
  );
}
