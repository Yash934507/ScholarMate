import { Link, useLocation } from "wouter"
import { GraduationCap, Menu, X } from "lucide-react"
import { useState } from "react"
import { buttonVariants } from "./ui/button"

export function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [location] = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary font-semibold text-xl">
            <GraduationCap className="h-6 w-6 text-accent" />
            <span>ScholarMate</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Home
            </Link>
            <Link 
              href="/discover" 
              className={`text-sm font-medium transition-colors hover:text-primary ${location.startsWith('/discover') ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Discover
            </Link>
          </nav>
          
          <div className="hidden md:flex">
            <Link href="/discover" className={buttonVariants({ className: "bg-accent text-accent-foreground hover:bg-accent/90" })}>
              Find Scholarships
            </Link>
          </div>

          <button className="md:hidden p-2 text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {isOpen && (
        <div className="md:hidden border-b bg-background px-4 py-4 space-y-4">
          <Link 
            href="/" 
            className="block text-sm font-medium text-foreground"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/discover" 
            className="block text-sm font-medium text-foreground"
            onClick={() => setIsOpen(false)}
          >
            Discover
          </Link>
          <Link 
            href="/discover" 
            onClick={() => setIsOpen(false)}
            className={buttonVariants({ className: "w-full bg-accent text-accent-foreground hover:bg-accent/90" })}
          >
            Find Scholarships
          </Link>
        </div>
      )}

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-card py-12 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-primary font-semibold text-xl">
            <GraduationCap className="h-6 w-6 text-accent" />
            <span>ScholarMate</span>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            Empowering Indian students with access to education funding.
          </p>
        </div>
      </footer>
    </div>
  )
}
