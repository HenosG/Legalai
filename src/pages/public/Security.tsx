import PublicPageTemplate from "@/components/public/PublicPageTemplate";

export default function Security() {
  return (
    <PublicPageTemplate
      eyebrow="SECURITY & PRIVACY"
      title="Your client operations deserve thoughtful safeguards."
      description="Learn how RelunoOS approaches authentication, workspace access, connected providers, and client operations data."
      primaryCtaLabel="Contact us"
      primaryCtaHref="/contact"
      secondaryCtaLabel="Read privacy policy"
      secondaryCtaHref="/privacy"
    />
  );
}