import PublicPageTemplate from "@/components/public/PublicPageTemplate";

export default function AcceptableUse() {
  return (
    <PublicPageTemplate
      eyebrow="LEGAL"
      title="Acceptable Use Policy"
      description="Guidelines for responsible, safe, and permitted use of the RelunoOS platform."
      primaryCtaLabel="Contact us"
      primaryCtaHref="/contact"
      secondaryCtaLabel="Terms of service"
      secondaryCtaHref="/terms"
    />
  );
}