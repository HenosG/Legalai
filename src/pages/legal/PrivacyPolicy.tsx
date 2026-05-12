import PageLayout from "@/components/PageLayout";

const PrivacyPolicy = () => {
  return (
    <PageLayout>
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Privacy Policy – Protecting Your Data
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Your privacy is our top priority at Reluno Legal AI. This policy explains how we collect, use, share, and protect your personal information when you use our services.
            </p>
            <p className="text-sm text-muted-foreground mb-12">
              <strong>Effective Date:</strong> December 20, 2025
            </p>

            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-8">
                Reluno Legal AI ("we," "us," or "our") is committed to protecting your privacy and ensuring the security of your personal data. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our website (relunolegal.ai), use our mobile app, or interact with our AI-powered legal helper platform (collectively, the "Services"). By using our Services, you agree to the practices described in this policy. If you do not agree, please do not use our Services.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">We collect information in the following ways:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
                <li><strong>Information You Provide:</strong> When you create an account, ask a legal question, generate a document, or contact support, we collect personal information such as your name, email address, phone number, and any details you share in queries or documents.</li>
                <li><strong>Automatically Collected Information:</strong> We use cookies, web beacons, and similar technologies to collect device information (IP address, browser type, operating system), usage data (pages visited, time spent), and interaction data (queries asked, documents generated).</li>
                <li><strong>Third-Party Data:</strong> If you log in with Google or other services, we may receive limited information from those providers.</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
                <li>Provide and improve our Services (e.g., answer queries, generate documents)</li>
                <li>Personalize your experience (e.g., remember your case history)</li>
                <li>Communicate with you (e.g., send reminders or updates)</li>
                <li>Analyze usage to improve the platform</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">3. How We Share Your Information</h2>
              <p className="text-muted-foreground mb-4">We do not sell your personal information. We share data only:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
                <li>With service providers (e.g., Supabase for storage, Stripe for payments) under strict contracts</li>
                <li>To comply with legal requirements (e.g., court orders)</li>
                <li>To protect our rights or safety</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">4. Your Rights & Choices</h2>
              <p className="text-muted-foreground mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
                <li>Access, correct, or delete your data</li>
                <li>Opt out of certain data collection (e.g., cookies)</li>
                <li>Request portability of your data</li>
              </ul>
              <p className="text-muted-foreground mb-8">To exercise these rights, contact support@reluno.com.</p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">5. Security</h2>
              <p className="text-muted-foreground mb-8">
                We use industry-standard security (encryption, access controls) to protect your data. However, no system is 100% secure—use at your own risk.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">6. Children's Privacy</h2>
              <p className="text-muted-foreground mb-8">
                Our Services are not intended for children under 13. We do not knowingly collect data from children.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">7. Changes to This Policy</h2>
              <p className="text-muted-foreground mb-8">
                We may update this policy. Changes will be posted here with the effective date. Continued use constitutes acceptance.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">8. Contact Us</h2>
              <p className="text-muted-foreground mb-8">
                For privacy questions, email privacy@reluno.com.
              </p>

              <div className="bg-muted/30 border border-border rounded-xl p-6 mt-12">
                <p className="text-sm text-muted-foreground">
                  <strong>Disclaimer:</strong> This policy is for informational purposes. It does not create legal obligations beyond applicable law.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default PrivacyPolicy;
