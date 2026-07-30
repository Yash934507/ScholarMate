import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Link } from "wouter"
import { ArrowLeft, Save } from "lucide-react"

export default function StudentProfile() {
  return (
    <div className="bg-muted/20 min-h-screen pb-20">
      <div className="bg-primary text-primary-foreground py-8 border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/dashboard" className="inline-flex items-center text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors text-sm font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-primary-foreground/80 mt-2">Update your details to get accurate scholarship recommendations.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl py-8">
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic details about you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" defaultValue="Priya Sharma" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="priya.s@example.com" disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+91 9876543210" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input id="dob" type="date" defaultValue="2003-05-15" />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select defaultValue="female">
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <div className="space-y-2">
                  <Label>State of Residence</Label>
                  <Select defaultValue="maharashtra">
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City / District</Label>
                  <Input id="city" defaultValue="Mumbai" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Academic Details</CardTitle>
              <CardDescription>Your current educational status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Current Education Level</Label>
                  <Select defaultValue="ug">
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="school">School (11th/12th)</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="ug">Undergraduate (UG)</SelectItem>
                      <SelectItem value="pg">Postgraduate (PG)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course">Course / Field of Study</Label>
                  <Input id="course" defaultValue="B.Sc. Computer Science" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="institution">Institution Name</Label>
                  <Input id="institution" defaultValue="St. Xavier's College" />
                </div>
                <div className="space-y-2">
                  <Label>Year of Study</Label>
                  <Select defaultValue="2">
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1st Year</SelectItem>
                      <SelectItem value="2">2nd Year</SelectItem>
                      <SelectItem value="3">3rd Year</SelectItem>
                      <SelectItem value="4">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="percentage">Last Exam Percentage / CGPA</Label>
                  <Input id="percentage" type="number" step="0.01" defaultValue="82.5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-amber-200 dark:border-amber-900/50">
            <CardHeader className="bg-amber-50/50 dark:bg-amber-950/10 border-b border-amber-100 dark:border-amber-900/30">
              <CardTitle className="text-amber-800 dark:text-amber-400">Background Details</CardTitle>
              <CardDescription>Crucial for determining eligibility for government schemes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div className="space-y-4">
                <Label className="text-base">Caste Category</Label>
                <RadioGroup defaultValue="general" className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="general" id="c-general" />
                    <Label htmlFor="c-general" className="font-normal cursor-pointer">General / Open</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="obc" id="c-obc" />
                    <Label htmlFor="c-obc" className="font-normal cursor-pointer">OBC</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="sc" id="c-sc" />
                    <Label htmlFor="c-sc" className="font-normal cursor-pointer">SC</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="st" id="c-st" />
                    <Label htmlFor="c-st" className="font-normal cursor-pointer">ST</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="ews" id="c-ews" />
                    <Label htmlFor="c-ews" className="font-normal cursor-pointer">EWS</Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-md p-3">
                    <RadioGroupItem value="vjnt" id="c-vjnt" />
                    <Label htmlFor="c-vjnt" className="font-normal cursor-pointer">VJ / NT</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4">
                <Label className="text-base">Annual Family Income</Label>
                <RadioGroup defaultValue="1to2.5" className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="below1" id="i-below1" />
                    <Label htmlFor="i-below1" className="font-normal cursor-pointer">Below ₹1,00,000</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="1to2.5" id="i-1to2.5" />
                    <Label htmlFor="i-1to2.5" className="font-normal cursor-pointer">₹1,00,001 – ₹2,50,000</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="2.5to5" id="i-2.5to5" />
                    <Label htmlFor="i-2.5to5" className="font-normal cursor-pointer">₹2,50,001 – ₹5,00,000</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="5to8" id="i-5to8" />
                    <Label htmlFor="i-5to8" className="font-normal cursor-pointer">₹5,00,001 – ₹8,00,000</Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="above8" id="i-above8" />
                    <Label htmlFor="i-above8" className="font-normal cursor-pointer">Above ₹8,00,000</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-start space-x-3 p-4 border rounded-lg bg-muted/30">
                  <Checkbox id="disability" className="mt-1" />
                  <div>
                    <Label htmlFor="disability" className="font-medium cursor-pointer">I have a disability (PwD)</Label>
                    <p className="text-sm text-muted-foreground mt-1">Check this if you possess a valid disability certificate.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 border rounded-lg bg-muted/30">
                  <Checkbox id="minority" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="minority" className="font-medium cursor-pointer">I belong to a minority community</Label>
                    <p className="text-sm text-muted-foreground mt-1 mb-3">Such as Muslim, Christian, Sikh, Buddhist, Jain, Parsi.</p>
                    <Select disabled>
                      <SelectTrigger className="max-w-xs bg-background">
                        <SelectValue placeholder="Select community" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="muslim">Muslim</SelectItem>
                        <SelectItem value="christian">Christian</SelectItem>
                        <SelectItem value="sikh">Sikh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Manage how we communicate with you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive alerts for deadlines and new matching scholarships.</p>
                </div>
                <Switch defaultChecked />
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <Label>Reminder Timing</Label>
                <Select defaultValue="7days">
                  <SelectTrigger className="max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">7 days before deadline</SelectItem>
                    <SelectItem value="3days">3 days before deadline</SelectItem>
                    <SelectItem value="1day">1 day before deadline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="sticky bottom-4 bg-background/80 backdrop-blur-md p-4 rounded-xl border shadow-lg flex justify-end gap-4 z-10">
            <Button variant="outline" type="button">Cancel</Button>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
