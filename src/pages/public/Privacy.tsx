import PublicPageTemplate from "@/components/public/PublicPageTemplate";

export default function Privacy() {
  return (
    <PublicPageTemplate
      eyebrow="LEGAL"
      title="Privacy Policy"
      description="Details about how RelunoOS collects, uses, protects, and processes personal and workspace data."
      primaryCtaLabel="Contact us"
      primaryCtaHref="/contact"
      secondaryCtaLabel="Terms of service"
      secondaryCtaHref="/terms"
    />
  );
}