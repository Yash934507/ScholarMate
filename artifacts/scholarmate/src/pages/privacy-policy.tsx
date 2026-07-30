export default function PrivacyPolicy() {
  return (
    <div className="bg-background min-h-screen pb-20 pt-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Table of contents (Sticky on desktop) */}
          <div className="md:w-1/4 hidden md:block">
            <div className="sticky top-24">
              <h3 className="font-bold text-lg mb-4">Contents</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#introduction" className="hover:text-primary transition-colors">1. Introduction</a></li>
                <li><a href="#information-we-collect" className="hover:text-primary transition-colors">2. Information We Collect</a></li>
                <li><a href="#how-we-use" className="hover:text-primary transition-colors">3. How We Use Your Information</a></li>
                <li><a href="#data-storage" className="hover:text-primary transition-colors">4. Data Storage and Security</a></li>
                <li><a href="#cookies" className="hover:text-primary transition-colors">5. Cookies and Tracking</a></li>
                <li><a href="#sharing" className="hover:text-primary transition-colors">6. Sharing of Information</a></li>
                <li><a href="#your-rights" className="hover:text-primary transition-colors">7. Your Rights</a></li>
                <li><a href="#changes" className="hover:text-primary transition-colors">8. Changes to This Policy</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">9. Contact Us</a></li>
              </ul>
            </div>
          </div>

          {/* Main content */}
          <div className="md:w-3/4 prose prose-slate dark:prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: July 2025</p>

            <section id="introduction" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p>Welcome to ScholarMate. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>
              <p>When you visit our website and use our services, you trust us with your personal information. We take your privacy very seriously. In this privacy notice, we describe our privacy policy.</p>
            </section>

            <section id="information-we-collect" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
              <p>We collect personal information that you voluntarily provide to us when you register on the platform, express an interest in obtaining information about us or our products and services, when you participate in activities on the platform, or otherwise when you contact us.</p>
              <p>The personal information that we collect depends on the context of your interactions with us and the platform, the choices you make, and the products and features you use. This may include your name, email address, educational background, state of residence, and other profile details.</p>
            </section>

            <section id="how-we-use" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
              <p>We use personal information collected via our platform for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>
              <p>We use the information we collect or receive to facilitate account creation and logon process, to send administrative information to you, to fulfill and manage your requests, and to deliver targeted scholarship recommendations.</p>
            </section>

            <section id="data-storage" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">4. Data Storage and Security</h2>
              <p>We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.</p>
              <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law.</p>
            </section>

            <section id="cookies" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">5. Cookies and Tracking</h2>
              <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.</p>
            </section>

            <section id="sharing" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">6. Sharing of Information</h2>
              <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>
              <p>We do not sell your personal information to third parties. We may share your data with third-party service providers who perform services for us or on our behalf and require access to such information to do that work.</p>
            </section>

            <section id="your-rights" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">7. Your Rights</h2>
              <p>In some regions, you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; and (iv) if applicable, to data portability.</p>
            </section>

            <section id="changes" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">8. Changes to This Policy</h2>
              <p>We may update this privacy notice from time to time. The updated version will be indicated by an updated "Revised" date and the updated version will be effective as soon as it is accessible.</p>
              <p>If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information.</p>
            </section>

            <section id="contact" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
              <p>If you have questions or comments about this notice, you may email us at privacy@scholarmate.in or by post to our registered office address in Mumbai, Maharashtra.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
