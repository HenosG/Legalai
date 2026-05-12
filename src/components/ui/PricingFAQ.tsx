import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    q: "Is this actually legal advice?",
    a: "No. Reluno is an AI-powered legal assistant. We provide information, document drafts, and analysis, but we aren't a law firm. Think of us as a super-powered paralegal in your pocket.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Of course. No 'send us a handwritten letter' nonsense. You can cancel with two clicks in your dashboard. You'll keep access until the end of your billing cycle.",
  },
  {
    q: "Is my data secure?",
    a: "Your privacy is our priority. We use industry-standard AES-256 encryption. Your documents are stored in a private, secure vault, and we never sell your data to third parties.",
  },
  {
    q: "What happens if I hit my 5-query limit?",
    a: "You'll get a friendly nudge to upgrade to the Starter plan. Don't worry—we won't cut you off mid-sentence, but you'll need to upgrade to start a new query.",
  },
  {
    q: "Does the AI understand my local laws?",
    a: "Reluno is trained on a vast library of legal principles across many jurisdictions. However, laws vary by zip code, so we always recommend a final review by a professional for high-stakes matters.",
  },
  {
    q: "What is the AI Document Analyzer?",
    a: "Available on the Pro plan, this tool allows you to upload PDFs (contracts, leases, terms) and get an instant summary of risks, hidden clauses, and key deadlines.",
  },
  {
    q: "Can I export my documents?",
    a: "Yes. Pro users can export AI-generated drafts directly to professional PDF or Word formats, ready for printing or sharing.",
  },
  {
    q: "Do you offer a free trial for the paid plans?",
    a: "We offer a Free tier so you can test our AI. While we don't offer trials for the Starter or Pro plans, our monthly subscription allows you to try all features for 30 days with no long-term commitment.",
  },
  {
    q: "Who is Reluno for?",
    a: "Freelancers, small business owners, and individuals who want to understand their legal rights and draft documents without the $300/hr attorney price tag.",
  },
];

const PricingFAQ = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-20">
      <div className="text-center mb-10">
        <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-3 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-muted-foreground">
          Everything you need to know before getting started.
        </p>
      </div>

      <div className="max-w-[800px] mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border/60">
              <AccordionTrigger className="text-left text-[15px] font-semibold hover:text-primary transition-colors hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-3">
            Still have questions?
          </p>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80 font-medium"
            onClick={() => navigate("/contact")}
          >
            Contact Support →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingFAQ;
