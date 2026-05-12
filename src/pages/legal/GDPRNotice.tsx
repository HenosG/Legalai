import PageLayout from "@/components/PageLayout";

const GDPRNotice = () => {
  return (
    <PageLayout>
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              GDPR Notice – EU Data Protection
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Reluno Legal AI complies with GDPR for EU users.
            </p>
            <p className="text-sm text-muted-foreground mb-12">
              <strong>Effective Date:</strong> December 20, 2025
            </p>

            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground mb-8">
                Reluno Legal AI ("we") complies with the General Data Protection Regulation (GDPR) for users in the European Union. This notice supplements our Privacy Policy and explains your rights and our obligations under GDPR.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">1. Data Controller</h2>
              <p className="text-muted-foreground mb-8">
                Reluno Legal AI is the data controller for your personal data. Contact: dpo@reluno.com.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">2. Lawful Basis for Processing</h2>
              <p className="text-muted-foreground mb-4">We process data based on:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
                <li><strong>Consent:</strong> When you create an account or opt in to communications</li>
                <li><strong>Contract:</strong> To provide the Services you requested</li>
                <li><strong>Legitimate interests:</strong> To improve our platform and ensure security</li>
              </ul>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">3. Your Rights</h2>
              <p className="text-muted-foreground mb-4">Under GDPR, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-8">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your data (right to be forgotten)</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Object:</strong> Object to processing based on legitimate interests</li>
                <li><strong>Withdraw consent:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-muted-foreground mb-8">
                To exercise these rights, email support@reluno.com. We respond within 30 days.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">4. Data Transfers</h2>
              <p className="text-muted-foreground mb-8">
                Data may be transferred outside the EU. We use standard contractual clauses and other safeguards to ensure adequate protection.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">5. Data Retention</h2>
              <p className="text-muted-foreground mb-8">
                We retain personal data only as long as necessary for the purposes described in our Privacy Policy, or as required by law.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">6. Data Protection Officer</h2>
              <p className="text-muted-foreground mb-8">
                Our Data Protection Officer can be reached at dpo@reluno.com.
              </p>

              <h2 className="font-display text-2xl font-bold text-foreground mt-12 mb-4">7. Complaints</h2>
              <p className="text-muted-foreground mb-8">
                If you believe we have violated GDPR, you may contact your local supervisory authority or our DPO.
              </p>

              <div className="bg-muted/30 border border-border rounded-xl p-6 mt-12">
                <p className="text-sm text-muted-foreground">
                  <strong>Disclaimer:</strong> This notice is for informational purposes. It does not create legal obligations beyond GDPR.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default GDPRNotice;
