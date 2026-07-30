import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Mail, Clock, AlertCircle } from "lucide-react"

export default function Contact() {
  return (
    <div className="bg-background min-h-screen pb-20 pt-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center">Get in touch</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email us</h3>
                  <p className="text-muted-foreground">help@scholarmate.in</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Response time</h3>
                  <p className="text-muted-foreground">We respond within 1-2 business days.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                  <AlertCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Report incorrect info</h3>
                  <p className="text-muted-foreground">Found wrong scholarship data? Let us know and we'll fix it within 24 hours.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left font-medium">Is ScholarMate free?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes, ScholarMate is completely free for all students. We don't charge any fees or commissions for browsing or finding scholarships.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left font-medium">How do I report incorrect scholarship information?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Please use the contact form on this page and select "Report Incorrect Info" as the subject. Provide a link to the scholarship on our site and the correct official source.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left font-medium">Can I submit a scholarship listing?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Absolutely! If you represent an organization or know of a scholarship we missed, use the contact form to suggest a scholarship. We review all submissions before adding them.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          {/* Right Column (Form) */}
          <div>
            <Card className="border-border/60 shadow-md">
              <CardContent className="p-8">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" placeholder="Enter your full name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" type="email" placeholder="Enter your email" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="report">Report Incorrect Info</SelectItem>
                        <SelectItem value="suggest">Suggest a Scholarship</SelectItem>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="How can we help you?" 
                      className="min-h-[150px]"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Send Message
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    This form is for informational inquiries only. For scholarship applications, please visit the official scholarship portal.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
