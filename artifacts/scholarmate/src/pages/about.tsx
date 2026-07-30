import { Card, CardContent } from "@/components/ui/card"
import { Building, BookOpen, Link as LinkIcon } from "lucide-react"

export default function AboutScholarMate() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Helping every Indian student find the scholarship they deserve
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            We believe that financial constraints should never stand in the way of a student's education.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-4 text-lg text-muted-foreground">
            <p>
              ScholarMate was born in Mumbai out of a simple observation: there are thousands of scholarships available for Indian students, but millions of students never apply because the information is scattered, confusing, and hard to verify.
            </p>
            <p>
              Particularly in Maharashtra, schemes like MahaDBT offer incredible support for first-generation students, yet the complexity of the criteria often discourages them. We set out to change that.
            </p>
            <p>
              Our platform brings together data from government schemes, university grants, and private foundations into one clear, searchable, and easy-to-understand portal.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-10 text-center">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-border/60 shadow-sm bg-card">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Curate</h3>
                <p className="text-muted-foreground">
                  We collect and verify scholarship information from hundreds of reliable sources across India.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm bg-card">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Building className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Clarify</h3>
                <p className="text-muted-foreground">
                  We explain complex eligibility criteria and application processes in plain, accessible language.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm bg-card">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <LinkIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Connect</h3>
                <p className="text-muted-foreground">
                  We link you directly to the official government and institutional portals to submit your application securely.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Data Sources</h2>
          <p className="text-center text-muted-foreground mb-8">
            We monitor and aggregate public information from India's top scholarship portals:
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <span className="px-6 py-3 bg-muted rounded-full font-medium text-foreground">MahaDBT</span>
            <span className="px-6 py-3 bg-muted rounded-full font-medium text-foreground">National Scholarship Portal (NSP)</span>
            <span className="px-6 py-3 bg-muted rounded-full font-medium text-foreground">Buddy4Study</span>
            <span className="px-6 py-3 bg-muted rounded-full font-medium text-foreground">University Notice Boards</span>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-10 text-center">Built by students, for students</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { name: "Rahul S.", role: "Founder & Developer" },
              { name: "Priya M.", role: "Data Research Lead" },
              { name: "Amit K.", role: "Student Outreach" }
            ].map((member, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto flex items-center justify-center text-primary font-bold text-2xl">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{member.name}</h4>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold text-amber-800 dark:text-amber-400 mb-4">Important Notice</h3>
            <p className="text-amber-700/90 dark:text-amber-500/90">
              ScholarMate is an independent information platform. We are not affiliated with any government body, university, or scholarship provider. All scholarship details are for reference only.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
