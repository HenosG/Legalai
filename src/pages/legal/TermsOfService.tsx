import PageLayout from "@/components/PageLayout";

const TermsOfService = () => {
  return (
    <PageLayout>
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Terms of Service – Using Reluno Legal AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              By using our platform, you agree to these terms. Please read carefully.
            </p>
            <p className="text-sm text-muted-foreground mb-12">
              <strong>Effective Date:</strong> December 20, 2025
            </p>

            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-8">
                These Terms of Service ("Terms") govern your access to and use of Reluno Legal AI, including our website, mobile app, and AI-powered legal helper services (collectively, the "Services"). By accessing or using the Services, you agree to be bound by these Terms. If you do not agree, do not use the Services.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">1. Eligibility</h2>
              <p className="text-muted-foreground mb-8">
                You must be at least 18 years old to use the Services. By using the Services, you represent that you meet this requirement.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">2. Account Registration</h2>
              <p className="text-muted-foreground mb-8">
                To use certain features, you must create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">3. Services Description</h2>
              <p className="text-muted-foreground mb-8">
                Reluno Legal AI provides informational AI tools for legal questions, document generation, claim tracking, workflow automation, and analytics. These are general tools only—not legal advice, representation, or a substitute for licensed attorneys.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">4. User Conduct</h2>
              <p className="text-muted-foreground mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
                <li>Use the Services for illegal purposes</li>
                <li>Submit false or harmful content</li>
                <li>Attempt to reverse-engineer or interfere with the Services</li>
                <li>Violate any laws or third-party rights</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">5. Intellectual Property</h2>
              <p className="text-muted-foreground mb-8">
                All content, AI models, and materials are owned by Reluno Legal AI or licensed to us. You may not copy or distribute without permission.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">6. Disclaimers & Limitation of Liability</h2>
              <p className="text-muted-foreground mb-8">
                The Services are provided "as is" without warranties. We disclaim all warranties, express or implied. In no event shall Reluno be liable for any indirect, incidental, or consequential damages. Our total liability shall not exceed the amount you paid in the last 12 months.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">7. Subscriptions and Billing</h2>
              <p className="text-muted-foreground mb-8">
                Paid subscriptions auto-renew unless cancelled. You can cancel anytime from your account settings. Refunds are provided according to our refund policy.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">8. Termination</h2>
              <p className="text-muted-foreground mb-8">
                We may terminate or suspend your account for violation of these Terms.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">9. Governing Law</h2>
              <p className="text-muted-foreground mb-8">
                These Terms are governed by the laws of Canada. Disputes shall be resolved through arbitration in Toronto.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground mb-8">
                We may update these Terms. Continued use constitutes acceptance.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">11. Contact</h2>
              <p className="text-muted-foreground mb-8">
                For questions, email support@reluno.com.
              </p>

              <div className="bg-muted/30 border border-border rounded-xl p-6 mt-12">
                <p className="text-sm text-muted-foreground">
                  <strong>Disclaimer:</strong> These Terms are for informational purposes. They do not create attorney-client relationships.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default TermsOfService;
