import PublicPageTemplate from "@/components/public/PublicPageTemplate";

export default function Status() {
  return (
    <PublicPageTemplate
      eyebrow="SYSTEM STATUS"
      title="RelunoOS system status."
      description="Service availability, scheduled maintenance, and operational updates for the RelunoOS platform."
      primaryCtaLabel="Contact support"
      primaryCtaHref="/support"
      secondaryCtaLabel="Back to home"
      secondaryCtaHref="/"
    />
  );
}