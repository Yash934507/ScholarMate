import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ icon, title, description, actionLabel, onAction, className = "" }: EmptyStateProps) {
  return (
    <div className={`text-center py-20 bg-card rounded-xl border border-dashed ${className}`} data-testid="empty-state">
      <div className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
