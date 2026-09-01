import { Link, useLocation } from "wouter"
import { GraduationCap, Menu, X, Twitter, Linkedin, Instagram } from "lucide-react"
import { useState } from "react"
import { buttonVariants } from "./ui/button"
import { Show, useClerk } from "@clerk/react"

export function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [location] = useLocation()

  const closeMenu = () => setIsOpen(false)

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-primary font-bold text-xl hover:opacity-90 transition-opacity">
            <GraduationCap className="h-7 w-7 text-accent" />
            <span className="tracking-tight">ScholarMate</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 xl:gap-8">
            <Link 
              href="/" 
              className={`text-sm font-semibold transition-colors hover:text-primary ${location === '/' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Home
            </Link>
            <Link 
              href="/discover" 
              className={`text-sm font-semibold transition-colors hover:text-primary ${location.startsWith('/discover') ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Browse Scholarships
            </Link>
            <Link 
              href="/eligibility" 
              className={`text-sm font-semibold transition-colors hover:text-primary ${location.startsWith('/eligibility') ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Eligibility Checker
            </Link>
            <Link 
              href="/compare" 
              className={`text-sm font-semibold transition-colors hover:text-primary ${location.startsWith('/compare') ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Compare
            </Link>
            <Link 
              href="/about" 
              className={`text-sm font-semibold transition-colors hover:text-primary ${location.startsWith('/about') ? 'text-primary' : 'text-muted-foreground'}`}
            >
              About
            </Link>
          </nav>
          
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            <Show when="signed-out">
              <Link href="/sign-in" className={buttonVariants({ variant: "outline", className: "font-semibold border-primary/20 hover:bg-primary/5" })}>Login</Link>
              <Link href="/sign-up" className={buttonVariants({ className: "bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-sm" })}>Register</Link>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard" className={buttonVariants({ variant: "outline", className: "font-semibold border-primary/20 hover:bg-primary/5" })}>Dashboard</Link>
              <LogoutButton />
            </Show>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 text-foreground -mr-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden border-b bg-background absolute top-16 left-0 right-0 z-40 shadow-xl flex flex-col">
          <div className="p-4 flex flex-col space-y-4">
            <Link href="/" className="block px-2 py-2 text-lg font-semibold text-foreground border-b border-border/50" onClick={closeMenu}>
              Home
            </Link>
            <Link href="/discover" className="block px-2 py-2 text-lg font-semibold text-foreground border-b border-border/50" onClick={closeMenu}>
              Browse Scholarships
            </Link>
            <Link href="/eligibility" className="block px-2 py-2 text-lg font-semibold text-foreground border-b border-border/50" onClick={closeMenu}>
              Eligibility Checker
            </Link>
            <Link href="/compare" className="block px-2 py-2 text-lg font-semibold text-foreground border-b border-border/50" onClick={closeMenu}>
              Compare Scholarships
            </Link>
            <Link href="/about" className="block px-2 py-2 text-lg font-semibold text-foreground border-b border-border/50" onClick={closeMenu}>
              About ScholarMate
            </Link>
          </div>
          
          <div className="p-4 flex flex-col gap-3 mt-auto bg-muted/20">
            <Show when="signed-out">
              <Link href="/sign-in" onClick={closeMenu} className={buttonVariants({ variant: "outline", className: "w-full justify-center h-12 text-base" })}>Login</Link>
              <Link href="/sign-up" onClick={closeMenu} className={buttonVariants({ className: "w-full justify-center h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90" })}>Register Free Account</Link>
            </Show>
            <Show when="signed-in">
              <Link href="/dashboard" onClick={closeMenu} className={buttonVariants({ variant: "outline", className: "w-full justify-center h-12 text-base" })}>Dashboard</Link>
              <LogoutButton />
            </Show>
          </div>
        </div>
      )}

      {/* MAIN */}
      <main className="flex-1">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="border-t bg-card pt-16 pb-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
            
            {/* Col 1 */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 text-primary font-bold text-2xl mb-2">
                <GraduationCap className="h-8 w-8 text-accent" />
                <span>ScholarMate</span>
              </Link>
              <p className="text-muted-foreground leading-relaxed pr-4">
                Empowering India's scholars, one opportunity at a time. Finding funds for your education shouldn't be the hardest part of college.
              </p>
              <div className="flex gap-4 pt-2">
                <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Col 2 */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-foreground">Scholarships</h4>
              <ul className="space-y-3">
                <li><Link href="/discover" className="text-muted-foreground hover:text-primary transition-colors">Browse All</Link></li>
                <li><Link href="/discover?state=Maharashtra" className="text-muted-foreground hover:text-primary transition-colors">Browse by State</Link></li>
                <li><Link href="/discover?providerType=govt" className="text-muted-foreground hover:text-primary transition-colors">Browse by Category</Link></li>
                <li><Link href="/discover?sort=deadline" className="text-muted-foreground hover:text-primary transition-colors">Upcoming Deadlines</Link></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-foreground">For Students</h4>
              <ul className="space-y-3">
                <li><Link href="/eligibility" className="text-muted-foreground hover:text-primary transition-colors">Eligibility Checker</Link></li>
                <li><Link href="/compare" className="text-muted-foreground hover:text-primary transition-colors">Compare Scholarships</Link></li>
                <li><Link href="/saved" className="text-muted-foreground hover:text-primary transition-colors">Saved Scholarships</Link></li>
                <li><Link href="/tracker" className="text-muted-foreground hover:text-primary transition-colors">Application Tracker</Link></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <h4 className="font-bold text-lg mb-4 text-foreground">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Use</Link></li>
              </ul>
            </div>
            
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 ScholarMate. All rights reserved.</p>
            <p className="text-xs text-center md:text-right max-w-2xl opacity-80">
              Disclaimer: ScholarMate is an independent platform and is not affiliated with any government body. Information is provided for reference only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function LogoutButton() {
  const { signOut } = useClerk()
  return (
    <button
      type="button"
      onClick={() => signOut({ redirectUrl: "/" })}
      className={buttonVariants({ variant: "outline", className: "font-semibold border-primary/20 hover:bg-primary/5" })}
    >
      Log out
    </button>
  )
}
