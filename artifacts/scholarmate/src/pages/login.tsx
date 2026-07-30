import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { GraduationCap, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Left Column - Branding */}
      <div className="hidden lg:flex w-1/2 bg-primary text-primary-foreground p-12 flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="relative z-10 max-w-md mx-auto space-y-8">
          <Link href="/" className="flex items-center gap-3 text-2xl font-bold">
            <GraduationCap className="h-10 w-10 text-accent" />
            <span>ScholarMate</span>
          </Link>
          
          <h2 className="text-4xl font-bold leading-tight">
            Welcome back to your scholarship journey
          </h2>
          
          <ul className="space-y-6 pt-6">
            <li className="flex items-start gap-3">
              <div className="bg-accent/20 p-2 rounded-full mt-1">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Save opportunities</h4>
                <p className="text-primary-foreground/80">Bookmark scholarships to review later</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-accent/20 p-2 rounded-full mt-1">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Track applications</h4>
                <p className="text-primary-foreground/80">Manage your submissions across platforms</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="bg-accent/20 p-2 rounded-full mt-1">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Never miss a deadline</h4>
                <p className="text-primary-foreground/80">Get timely reminders for saved scholarships</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex items-center justify-center gap-2 text-primary font-bold text-2xl mb-6">
              <GraduationCap className="h-8 w-8 text-accent" />
              <span>ScholarMate</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Log in to your account</h1>
            <p className="text-muted-foreground">Enter your details to access your dashboard.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input id="email" type="email" placeholder="student@example.com" required />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/login" className="text-sm text-primary hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  required 
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-medium leading-none cursor-pointer">
                Remember me for 30 days
              </Label>
            </div>

            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-lg">
              Log in
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button variant="outline" type="button" className="w-full h-12 text-base font-medium">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Continue with Google
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Register here &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
