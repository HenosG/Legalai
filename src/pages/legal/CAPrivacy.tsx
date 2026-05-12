import PageLayout from "@/components/PageLayout";

const CAPrivacy = () => {
  return (
    <PageLayout>
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              CA Privacy Notice – California Residents
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Under CCPA/CPRA, California users have specific rights.
            </p>
            <p className="text-sm text-muted-foreground mb-12">
              <strong>Effective Date:</strong> December 20, 2025
            </p>

            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-8">
                This notice applies to California residents under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA). It supplements our Privacy Policy.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">1. Categories of Personal Information Collected</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
                <li><strong>Identifiers:</strong> Name, email address, IP address, account credentials</li>
                <li><strong>Commercial information:</strong> Queries submitted, documents generated, subscription history</li>
                <li><strong>Internet activity:</strong> Browsing history, interactions with our Services, device information</li>
                <li><strong>Inferences:</strong> Preferences and characteristics derived from your use of our AI tools</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">2. Sources of Collection</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
                <li><strong>Directly from you:</strong> Account creation, queries, form submissions</li>
                <li><strong>Automatically:</strong> Cookies, analytics tools, server logs</li>
                <li><strong>Third parties:</strong> Google OAuth, payment processors</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">3. Business Purposes for Collection</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
                <li>Provide and improve our Services</li>
                <li>Personalize your experience</li>
                <li>Communicate with you about your account and updates</li>
                <li>Comply with legal obligations</li>
                <li>Protect against fraud and security threats</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">4. Your California Rights</h2>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
                <li><strong>Right to Know:</strong> Request the categories and specific pieces of personal information we have collected about you</li>
                <li><strong>Right to Delete:</strong> Request deletion of your personal information, subject to certain exceptions</li>
                <li><strong>Right to Correct:</strong> Request correction of inaccurate personal information</li>
                <li><strong>Right to Opt-Out of Sale:</strong> We do not sell personal information</li>
                <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your rights</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">5. How to Exercise Your Rights</h2>
              <p className="text-muted-foreground mb-8">
                To submit a request, email support@reluno.com or use our online request portal. We will verify your identity before processing requests. We respond within 45 days, with a possible 45-day extension for complex requests.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">6. Sale of Personal Information</h2>
              <p className="text-muted-foreground mb-8">
                We do not sell personal information as defined by CCPA/CPRA.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">7. Data Retention</h2>
              <p className="text-muted-foreground mb-8">
                We retain data as long as necessary for the purposes described in our Privacy Policy, or as required by legal obligations.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">8. Contact</h2>
              <p className="text-muted-foreground mb-8">
                For questions about this notice or to exercise your rights: support@reluno.com
              </p>

              <div className="bg-muted/30 border border-border rounded-xl p-6 mt-12">
                <p className="text-sm text-muted-foreground">
                  <strong>Disclaimer:</strong> This notice is for informational purposes. It does not create legal obligations beyond CCPA/CPRA.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default CAPrivacy;
