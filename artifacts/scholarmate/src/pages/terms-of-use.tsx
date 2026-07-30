export default function TermsOfUse() {
  return (
    <div className="bg-background min-h-screen pb-20 pt-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl p-6 mb-10 text-center">
          <p className="font-bold text-amber-800 dark:text-amber-400 mb-2">Important Disclaimer</p>
          <p className="text-amber-700/90 dark:text-amber-500/90 text-sm">
            ScholarMate provides scholarship information for reference purposes only. We do not guarantee the accuracy, completeness, or timeliness of any scholarship listing. Always verify information on the official source.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Table of contents (Sticky on desktop) */}
          <div className="md:w-1/4 hidden md:block">
            <div className="sticky top-24">
              <h3 className="font-bold text-lg mb-4">Contents</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#acceptance" className="hover:text-primary transition-colors">1. Acceptance of Terms</a></li>
                <li><a href="#use" className="hover:text-primary transition-colors">2. Use of the Platform</a></li>
                <li><a href="#disclaimer" className="hover:text-primary transition-colors">3. Disclaimer of Accuracy</a></li>
                <li><a href="#ip" className="hover:text-primary transition-colors">4. Intellectual Property</a></li>
                <li><a href="#accounts" className="hover:text-primary transition-colors">5. User Accounts</a></li>
                <li><a href="#prohibited" className="hover:text-primary transition-colors">6. Prohibited Activities</a></li>
                <li><a href="#limitation" className="hover:text-primary transition-colors">7. Limitation of Liability</a></li>
                <li><a href="#governing" className="hover:text-primary transition-colors">8. Governing Law</a></li>
                <li><a href="#changes" className="hover:text-primary transition-colors">9. Changes to Terms</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">10. Contact</a></li>
              </ul>
            </div>
          </div>

          {/* Main content */}
          <div className="md:w-3/4 prose prose-slate dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-2">Terms of Use</h1>
            <p className="text-muted-foreground mb-8">Last updated: July 2025</p>

            <section id="acceptance" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using ScholarMate ("Platform", "we", "our", "us"), you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please do not use our Platform.</p>
            </section>

            <section id="use" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">2. Use of the Platform</h2>
              <p>ScholarMate is an independent information aggregator designed to help students discover educational funding opportunities. The Platform is provided free of charge for personal, non-commercial use by students and their families.</p>
            </section>

            <section id="disclaimer" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">3. Disclaimer of Accuracy</h2>
              <p>While we strive to keep our scholarship database accurate and up-to-date, scholarship providers frequently change their criteria, deadlines, and award amounts without notice. ScholarMate makes no warranties regarding the accuracy, completeness, or reliability of any information found on the Platform.</p>
              <p>Users are solely responsible for verifying all details on the official scholarship provider's website before preparing or submitting any application.</p>
            </section>

            <section id="ip" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">4. Intellectual Property</h2>
              <p>The design, structure, code, and non-public data of ScholarMate are the intellectual property of ScholarMate. Scholarship names, provider logos, and scheme descriptions belong to their respective owners and are used here under fair use principles for informational purposes only.</p>
            </section>

            <section id="accounts" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">5. User Accounts</h2>
              <p>If you create an account on ScholarMate, you are responsible for maintaining the security of your account credentials. You agree to notify us immediately of any unauthorized access to your account.</p>
            </section>

            <section id="prohibited" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">6. Prohibited Activities</h2>
              <p>Users may not scrape, crawl, or otherwise automate data extraction from the Platform. Users may not use ScholarMate's data to construct a competing commercial service or charge others for access to this publicly aggregated information.</p>
            </section>

            <section id="limitation" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
              <p>ScholarMate, its founders, and contributors shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the Platform, or for any missed deadlines or rejected scholarship applications.</p>
            </section>

            <section id="governing" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">8. Governing Law</h2>
              <p>These terms shall be governed by and construed in accordance with the laws of India, with jurisdiction exclusively in the courts of Mumbai, Maharashtra.</p>
            </section>

            <section id="changes" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
              <p>We reserve the right to modify these Terms of Use at any time. Continued use of the Platform after such changes constitutes acceptance of the new terms.</p>
            </section>

            <section id="contact" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">10. Contact</h2>
              <p>For any questions regarding these Terms of Use, please contact us at legal@scholarmate.in.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
