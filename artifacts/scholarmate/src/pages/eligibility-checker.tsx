import { useState } from "react"
import { Link } from "wouter"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronRight, GraduationCap } from "lucide-react"

export default function EligibilityChecker() {
  const [step, setStep] = useState(1)
  
  // Mock state for form data (UI only)
  const [formData, setFormData] = useState({
    state: "",
    caste: "",
    gender: "",
    disability: false,
    level: "",
    course: "",
    percentage: "",
    income: ""
  })

  const updateData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleNext = () => setStep(s => Math.min(s + 1, 5))
  const handlePrev = () => setStep(s => Math.max(s - 1, 1))

  return (
    <div className="bg-muted/10 min-h-screen pb-20">
      <div className="bg-primary text-primary-foreground py-8 border-b border-primary-foreground/10">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link href="/" className="inline-flex items-center text-primary-foreground/70 hover:text-primary-foreground mb-4 transition-colors text-sm font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back Home
          </Link>
          <h1 className="text-3xl font-bold mb-2">Eligibility Checker</h1>
          <p className="text-primary-foreground/80">Find out which scholarships you qualify for in under 2 minutes.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl py-10">
        
        {/* Progress Bar */}
        {step < 5 && (
          <div className="mb-10">
            <div className="flex justify-between text-xs font-medium text-muted-foreground mb-3 px-1">
              <span className={step >= 1 ? "text-primary font-bold" : ""}>About You</span>
              <span className={step >= 2 ? "text-primary font-bold" : ""}>Education</span>
              <span className={step >= 3 ? "text-primary font-bold" : ""}>Income</span>
              <span className={step >= 4 ? "text-primary font-bold" : ""}>Review</span>
            </div>
            <div className="h-2 bg-border rounded-full flex overflow-hidden">
              <div className="h-full bg-accent transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }}></div>
            </div>
          </div>
        )}

        <Card className="shadow-md border-border/60">
          <CardContent className="p-6 sm:p-10">
            
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Let's start with the basics</h2>
                  <p className="text-muted-foreground">This helps us filter schemes specific to your demographic.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base">State of Residence</Label>
                    <Select value={formData.state} onValueChange={(v) => updateData('state', v)}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="other">Other States</SelectItem>
                        <SelectItem value="national">National (All India)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base">Caste Category</Label>
                    <Select value={formData.caste} onValueChange={(v) => updateData('caste', v)}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General / Open</SelectItem>
                        <SelectItem value="OBC">OBC</SelectItem>
                        <SelectItem value="SC">SC</SelectItem>
                        <SelectItem value="ST">ST</SelectItem>
                        <SelectItem value="EWS">EWS</SelectItem>
                        <SelectItem value="NT">NT / VJNT / SBC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base">Gender</Label>
                    <RadioGroup 
                      className="flex gap-4" 
                      value={formData.gender} 
                      onValueChange={(v) => updateData('gender', v)}
                    >
                      <div className="flex items-center space-x-2 border rounded-md px-4 py-3 flex-1 bg-card hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="Male" id="g-male" />
                        <Label htmlFor="g-male" className="cursor-pointer font-normal w-full">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md px-4 py-3 flex-1 bg-card hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="Female" id="g-female" />
                        <Label htmlFor="g-female" className="cursor-pointer font-normal w-full">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md px-4 py-3 flex-1 bg-card hover:bg-muted/50 cursor-pointer">
                        <RadioGroupItem value="Other" id="g-other" />
                        <Label htmlFor="g-other" className="cursor-pointer font-normal w-full">Other</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg bg-muted/30">
                    <Checkbox 
                      id="pwd" 
                      checked={formData.disability} 
                      onCheckedChange={(c) => updateData('disability', c === true)} 
                    />
                    <Label htmlFor="pwd" className="font-medium cursor-pointer leading-tight">
                      I have a disability (PwD)
                      <span className="block text-xs text-muted-foreground mt-1 font-normal">Many schemes offer special quotas for disabled students.</span>
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Your Education</h2>
                  <p className="text-muted-foreground">What and where are you currently studying?</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label className="text-base">Current Education Level</Label>
                    <Select value={formData.level} onValueChange={(v) => updateData('level', v)}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="School">School (11th/12th)</SelectItem>
                        <SelectItem value="Diploma">Diploma</SelectItem>
                        <SelectItem value="UG">Undergraduate (UG)</SelectItem>
                        <SelectItem value="PG">Postgraduate (PG)</SelectItem>
                        <SelectItem value="PhD">PhD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base">Course / Field of Study</Label>
                    <Input 
                      className="h-12 text-base" 
                      placeholder="e.g. B.Tech Computer Science, B.Com" 
                      value={formData.course}
                      onChange={(e) => updateData('course', e.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base">Last Exam Percentage / CGPA</Label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        className="h-12 text-base pr-8" 
                        placeholder="e.g. 85" 
                        value={formData.percentage}
                        onChange={(e) => updateData('percentage', e.target.value)}
                      />
                      <span className="absolute right-4 top-3.5 text-muted-foreground font-medium">%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Family Income</h2>
                  <p className="text-muted-foreground">Income limits are strict for most government scholarships.</p>
                </div>
                
                <div className="space-y-4">
                  <Label className="text-base mb-2 block">Annual Family Income Range</Label>
                  <RadioGroup 
                    className="space-y-3" 
                    value={formData.income} 
                    onValueChange={(v) => updateData('income', v)}
                  >
                    {[
                      { id: "inc-1", value: "below1", label: "Below ₹1,00,000" },
                      { id: "inc-2", value: "1to2.5", label: "₹1,00,001 – ₹2,50,000", badge: "MahaDBT cutoff" },
                      { id: "inc-3", value: "2.5to5", label: "₹2,50,001 – ₹5,00,000" },
                      { id: "inc-4", value: "5to8", label: "₹5,00,001 – ₹8,00,000", badge: "EWS cutoff" },
                      { id: "inc-5", value: "above8", label: "Above ₹8,00,000" },
                    ].map(inc => (
                      <div key={inc.id} className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer transition-colors ${formData.income === inc.value ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={inc.value} id={inc.id} />
                          <Label htmlFor={inc.id} className="cursor-pointer text-base font-medium">{inc.label}</Label>
                        </div>
                        {inc.badge && (
                          <span className="text-[10px] uppercase tracking-wider font-bold bg-muted text-muted-foreground px-2 py-1 rounded-full">
                            {inc.badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Review Details</h2>
                  <p className="text-muted-foreground">Verify your information before we check eligibility.</p>
                </div>
                
                <div className="bg-muted/30 border rounded-xl divide-y">
                  <div className="p-4 flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">State & Category</p>
                      <p className="font-semibold capitalize">{formData.state || "Not provided"} • {formData.caste || "Not provided"} • {formData.gender || "Not provided"}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Edit</Button>
                  </div>
                  <div className="p-4 flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Education</p>
                      <p className="font-semibold">{formData.level || "Not provided"} • {formData.course || "Not provided"} • {formData.percentage ? `${formData.percentage}%` : "Not provided"}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setStep(2)}>Edit</Button>
                  </div>
                  <div className="p-4 flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Income Range</p>
                      <p className="font-semibold">
                        {formData.income === 'below1' && "Below ₹1 Lakh"}
                        {formData.income === '1to2.5' && "₹1 Lakh - ₹2.5 Lakhs"}
                        {formData.income === '2.5to5' && "₹2.5 Lakhs - ₹5 Lakhs"}
                        {formData.income === '5to8' && "₹5 Lakhs - ₹8 Lakhs"}
                        {formData.income === 'above8' && "Above ₹8 Lakhs"}
                        {!formData.income && "Not provided"}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setStep(3)}>Edit</Button>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 text-sm text-amber-800 dark:text-amber-400">
                  <strong>Disclaimer:</strong> Results are preliminary based on the data provided. Always verify all criteria on the official source before applying.
                </div>
              </div>
            )}

            {/* STEP 5 - RESULTS (MOCK) */}
            {step === 5 && (
              <div className="space-y-8 animate-in zoom-in-95 duration-500">
                <div className="text-center pb-4 border-b">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">Great news!</h2>
                  <p className="text-xl text-muted-foreground">Based on your profile, you may be eligible for <strong>14 scholarships</strong>.</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Top Matches</h3>
                  
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-xl hover:border-primary/50 transition-colors bg-card">
                      <div className="flex-1">
                        <div className="flex gap-2 mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 uppercase">Likely Eligible</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground uppercase">UG Level</span>
                        </div>
                        <h4 className="font-bold text-lg leading-tight mb-1">
                          {i === 1 ? "Rajarshi Chhatrapati Shahu Maharaj Scheme" : i === 2 ? "HDFC Bank Educational Crisis Scholarship" : "Central Sector Scheme of Scholarships"}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {i === 1 ? "Government of Maharashtra" : i === 2 ? "HDFC Bank" : "Ministry of Education"}
                        </p>
                      </div>
                      <div className="sm:w-32 flex flex-col justify-center gap-2">
                        <span className="font-bold text-primary text-center">
                          {i === 1 ? "100% Tuition" : i === 2 ? "₹25,000" : "₹12,000/yr"}
                        </span>
                        <Button variant="outline" size="sm" className="w-full">View</Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-primary/5 rounded-xl p-6 text-center mt-8 border border-primary/20">
                  <GraduationCap className="w-10 h-10 text-primary mx-auto mb-3" />
                  <h3 className="font-bold text-lg mb-2">Don't lose your results</h3>
                  <p className="text-muted-foreground text-sm mb-4">Create a free account to save these matches, track deadlines, and get customized alerts.</p>
                  <Link href="/register" className={buttonVariants({ className: "w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90" })}>
                    Create Free Account
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 5 && (
              <div className="flex justify-between items-center pt-8 mt-8 border-t">
                <Button 
                  variant="outline" 
                  onClick={handlePrev} 
                  disabled={step === 1}
                  className="w-24"
                >
                  Back
                </Button>
                
                {step < 4 ? (
                  <Button onClick={handleNext} className="w-32 bg-primary text-primary-foreground hover:bg-primary/90">
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="w-auto bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-lg h-12">
                    Check My Eligibility
                  </Button>
                )}
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
