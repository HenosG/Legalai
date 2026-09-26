import PublicPageTemplate from "@/components/public/PublicPageTemplate";

export default function Terms() {
  return (
    <PublicPageTemplate
      eyebrow="LEGAL"
      title="Terms of Service"
      description="The terms that govern use of the RelunoOS platform and connected services."
      primaryCtaLabel="Contact us"
      primaryCtaHref="/contact"
      secondaryCtaLabel="Privacy policy"
      secondaryCtaHref="/privacy"
    />
  );
}