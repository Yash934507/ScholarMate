import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  placeholder?: string;
  size?: "large" | "compact";
  className?: string;
}

export function SearchBar({ value, onChange, onSubmit, placeholder = "Search...", size = "compact", className = "" }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  if (size === "large") {
    return (
      <div className={`w-full max-w-3xl bg-background/10 backdrop-blur-md p-2 rounded-2xl border border-primary-foreground/20 shadow-2xl ${className}`} data-testid="search-bar-large">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-6 w-6 text-primary-foreground/50" />
            <Input 
              placeholder={placeholder}
              className="pl-12 h-14 bg-background text-foreground text-lg border-transparent rounded-xl focus-visible:ring-accent"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
          <Button type="submit" size="lg" className="h-14 px-8 text-lg rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
            Search
          </Button>
        </form>
      </div>
    );
  }

  // Compact size
  return (
    <div className={className} data-testid="search-bar-compact">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder={placeholder}
          className="pl-9"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button type="submit" className="hidden" aria-hidden="true" />
      </form>
    </div>
  );
}
