import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  FileText,
  HelpCircle,
  Loader2,
  LockKeyhole,
  Mail,
  MessageSquareText,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type ContactTopic =
  | ""
  | "product"
  | "pricing"
  | "support"
  | "security"
  | "partnership"
  | "general";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  teamSize: string;
  topic: ContactTopic;
  message: string;
  consent: boolean;
};

const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  teamSize: "",
  topic: "",
  message: "",
  consent: false,
};

const topicOptions: {
  value: Exclude<ContactTopic, "">;
  label: string;
}[] = [
  { value: "product", label: "Product question" },
  { value: "pricing", label: "Pricing and plans" },
  { value: "support", label: "Account support" },
  { value: "security", label: "Security or privacy" },
  { value: "partnership", label: "Partnership or integration" },
  { value: "general", label: "General question" },
];

const contactTopics = [
  {
    icon: HelpCircle,
    title: "Product and pricing",
    description:
      "Questions about the RelunoOS workflow, plans, team fit, or getting started.",
  },
  {
    icon: MessageSquareText,
    title: "Account support",
    description:
      "Need help with your workspace, account access, billing, or a product issue?",
  },
  {
    icon: ShieldCheck,
    title: "Security and privacy",
    description:
      "Report a security concern or ask about how RelunoOS handles data.",
  },
];

const helpfulLinks = [
  {
    icon: FileText,
    title: "View pricing",
    description: "Compare plans, workflow capacity, and payment platform fees.",
    href: "/pricing",
  },
  {
    icon: LockKeyhole,
    title: "Security & Privacy",
    description: "Learn how RelunoOS approaches security, privacy, and trust.",
    href: "/security",
  },
  {
    icon: Sparkles,
    title: "Explore the platform",
    description:
      "See how RelunoOS connects inquiry, proposal, project, and payment.",
    href: "/platform",
  },
];

function FieldLabel({
  htmlFor,
  children,
  optional = false,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="flex items-center gap-2 text-xs font-bold text-zinc-800"
    >
      {children}
      {optional && (
        <span className="font-medium text-zinc-400">(optional)</span>
      )}
    </label>
  );
}

function ContactPreview() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-white/15 to-white/[0.04] p-3 shadow-[0_30px_70px_rgba(0,0,0,0.25)] backdrop-blur-sm">
      <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/20 p-3">
        <div className="mb-3 flex items-center gap-1.5 px-2">
          <span className="h-2 w-2 rounded-full bg-red-300/80" />
          <span className="h-2 w-2 rounded-full bg-amber-200/80" />
          <span className="h-2 w-2 rounded-full bg-emerald-200/80" />
          <span className="ml-2 text-[10px] font-medium text-blue-100/60">
            RelunoOS support desk
          </span>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 shadow-2xl shadow-blue-950/10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
                <MessageSquareText size={18} />
              </div>

              <div>
                <p className="text-xs font-bold text-zinc-900">
                  New support request
                </p>
                <p className="mt-0.5 text-[10px] text-zinc-500">
                  Your message stays organized
                </p>
              </div>
            </div>

            <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#063ee2]">
              New
            </span>
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-400">
              Topic
            </p>

            <div className="mt-2 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-zinc-900">
                Product and pricing
              </p>

              <span className="rounded-full bg-blue-100 px-2 py-1 text-[9px] font-bold text-blue-700">
                Routed
              </span>
            </div>

            <p className="mt-3 text-xs leading-5 text-zinc-600">
              “I want to understand which RelunoOS plan fits a small
              client-service team.”
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3">
            <span className="text-[11px] font-semibold text-emerald-800">
              Ready for review
            </span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const updateField = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim().toLowerCase();
    const message = form.message.trim();

    if (!firstName || !lastName || !email || !form.topic || !message) {
      setError("Please complete all required fields before sending your message.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (message.length < 10) {
      setError("Please provide a little more detail in your message.");
      return;
    }

    if (!form.consent) {
      setError("Please confirm that RelunoOS may contact you about your request.");
      return;
    }

    const selectedTopic = topicOptions.find(
      (option) => option.value === form.topic
    );

    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          subject: selectedTopic?.label || null,
          message,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "We could not send your message right now. Please try again in a moment."
        );
      }

      setSuccessMessage(
        data?.message ||
          "Your message has been received. The RelunoOS team will review it shortly."
      );

      setSubmitted(true);
      setForm(initialFormState);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We could not send your message right now. Please try again in a moment."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#fafafa] text-zinc-900">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap");

        * {
          font-family: "DM Sans", sans-serif;
        }

        .hero-grid {
          background-color: #063ee2;
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .hero-stripes {
          background-image:
            repeating-linear-gradient(
              -45deg,
              rgba(255, 255, 255, 0.035) 0,
              rgba(255, 255, 255, 0.035) 1px,
              transparent 1px,
              transparent 15px
            );
        }

        @keyframes rise-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .rise-in {
          animation: rise-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .rise-in-delay-1 {
          animation-delay: 0.08s;
        }

        .rise-in-delay-2 {
          animation-delay: 0.16s;
        }

        .rise-in-delay-3 {
          animation-delay: 0.24s;
        }
      `}</style>

      <Navbar />

      <main>
        {/* Hero */}
        <section className="hero-grid relative isolate overflow-hidden border-b border-blue-700 pb-24 pt-36 text-white sm:pb-28 sm:pt-44">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0%,rgba(3,26,117,0.65)_70%,rgba(1,11,51,0.9)_100%)]" />
          <div className="hero-stripes pointer-events-none absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/25 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-6 sm:px-10">
            <div className="grid items-center gap-14 lg:grid-cols-[1.04fr_0.96fr] lg:gap-12">
              <div className="max-w-3xl">
                <div className="rise-in inline-flex items-center rounded-lg border border-blue-400/40 bg-blue-600/60 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100 backdrop-blur-md">
                  Contact RelunoOS
                </div>

                <h1 className="rise-in rise-in-delay-1 mt-7 text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
                  Let’s make client work easier to run.
                </h1>

                <p className="rise-in rise-in-delay-2 mt-7 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
                  Questions about RelunoOS, pricing, your account, or the
                  platform? Send us a message and we will help point you in the
                  right direction.
                </p>

                <div className="rise-in rise-in-delay-3 mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-blue-100/90">
                  <span className="inline-flex items-center gap-2">
                    <Check size={14} className="text-blue-200" />
                    Product, pricing, and account support
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Check size={14} className="text-blue-200" />
                    Security and privacy questions welcome
                  </span>
                </div>
              </div>

              <div className="rise-in rise-in-delay-2 relative mx-auto w-full max-w-xl lg:max-w-none">
                <div className="absolute -left-6 top-14 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
                    Contact type
                  </p>
                  <p className="mt-1 text-sm font-bold text-white">
                    Routed clearly
                  </p>
                </div>

                <div className="absolute -bottom-5 -right-4 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md xl:block">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-blue-100/65">
                    Workspace
                  </p>
                  <p className="mt-1 text-xs font-semibold text-white">
                    Support-ready
                  </p>
                </div>

                <ContactPreview />
              </div>
            </div>
          </div>
        </section>

        {/* Contact topics */}
        <section className="border-b border-zinc-100 bg-white py-7">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-6 sm:px-10 lg:flex-row lg:justify-between">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 lg:text-left">
              A clear path for every question
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs font-semibold text-zinc-600">
              {["Product", "Pricing", "Support", "Security", "Partnerships"].map(
                (item, index, items) => (
                  <div key={item} className="flex items-center gap-3">
                    <span>{item}</span>
                    {index !== items.length - 1 && (
                      <ArrowRight size={13} className="text-blue-600" />
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Contact form and support info */}
        <section className="border-b border-zinc-100 bg-[#fafafa] px-6 py-24 sm:px-10 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                  Send a message
                </p>

                <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                  Tell us what you need.
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-500">
                  Share a little context and your message will be routed to the
                  right RelunoOS conversation.
                </p>

                <div className="mt-10 rounded-3xl border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_rgba(6,62,226,0.06)] sm:p-8">
                  {submitted ? (
                    <div className="flex min-h-[520px] flex-col items-center justify-center text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <CheckCircle2 size={31} />
                      </div>

                      <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-600">
                        Message received
                      </p>

                      <h3 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-zinc-900">
                        Thanks for reaching out.
                      </h3>

                      <p className="mt-4 max-w-md text-sm leading-6 text-zinc-500">
                        {successMessage ||
                          "Your message has been received by the RelunoOS team. We will review it and route it appropriately."}
                      </p>

                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setSuccessMessage("");
                          setError("");
                        }}
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#063ee2] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                      >
                        Send another message
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <FieldLabel htmlFor="firstName">
                            First name
                          </FieldLabel>

                          <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            autoComplete="given-name"
                            value={form.firstName}
                            onChange={(event) =>
                              updateField("firstName", event.target.value)
                            }
                            placeholder="Enter your first name"
                            className="mt-2.5 h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-[#063ee2] focus:ring-4 focus:ring-blue-100"
                          />
                        </div>

                        <div>
                          <FieldLabel htmlFor="lastName">Last name</FieldLabel>

                          <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            autoComplete="family-name"
                            value={form.lastName}
                            onChange={(event) =>
                              updateField("lastName", event.target.value)
                            }
                            placeholder="Enter your last name"
                            className="mt-2.5 h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-[#063ee2] focus:ring-4 focus:ring-blue-100"
                          />
                        </div>
                      </div>

                      <div className="mt-5">
                        <FieldLabel htmlFor="email">Work email</FieldLabel>

                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={(event) =>
                            updateField("email", event.target.value)
                          }
                          placeholder="you@company.com"
                          className="mt-2.5 h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-[#063ee2] focus:ring-4 focus:ring-blue-100"
                        />
                      </div>

                      <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                          <FieldLabel htmlFor="company" optional>
                            Company or agency
                          </FieldLabel>

                          <input
                            id="company"
                            name="company"
                            type="text"
                            autoComplete="organization"
                            value={form.company}
                            onChange={(event) =>
                              updateField("company", event.target.value)
                            }
                            placeholder="Your company name"
                            className="mt-2.5 h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-[#063ee2] focus:ring-4 focus:ring-blue-100"
                          />
                        </div>

                        <div>
                          <FieldLabel htmlFor="teamSize" optional>
                            Team size
                          </FieldLabel>

                          <div className="relative mt-2.5">
                            <select
                              id="teamSize"
                              name="teamSize"
                              value={form.teamSize}
                              onChange={(event) =>
                                updateField("teamSize", event.target.value)
                              }
                              className="h-12 w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 pr-10 text-sm text-zinc-700 outline-none transition-all focus:border-[#063ee2] focus:ring-4 focus:ring-blue-100"
                            >
                              <option value="">Select team size</option>
                              <option value="1">Just me</option>
                              <option value="2-5">2–5 people</option>
                              <option value="6-10">6–10 people</option>
                              <option value="11-25">11–25 people</option>
                              <option value="26-50">26–50 people</option>
                              <option value="51+">51+ people</option>
                            </select>

                            <ChevronDown
                              size={16}
                              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-5">
                        <FieldLabel htmlFor="topic">
                          What can we help with?
                        </FieldLabel>

                        <div className="relative mt-2.5">
                          <select
                            id="topic"
                            name="topic"
                            value={form.topic}
                            onChange={(event) =>
                              updateField(
                                "topic",
                                event.target.value as ContactTopic
                              )
                            }
                            className="h-12 w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 pr-10 text-sm text-zinc-700 outline-none transition-all focus:border-[#063ee2] focus:ring-4 focus:ring-blue-100"
                          >
                            <option value="">Select a topic</option>
                            {topicOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>

                          <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
                          />
                        </div>
                      </div>

                      <div className="mt-5">
                        <FieldLabel htmlFor="message">Message</FieldLabel>

                        <textarea
                          id="message"
                          name="message"
                          rows={7}
                          value={form.message}
                          onChange={(event) =>
                            updateField("message", event.target.value)
                          }
                          placeholder="Tell us a little about your question, workspace, or what you want to accomplish."
                          className="mt-2.5 w-full resize-y rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm leading-6 text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-[#063ee2] focus:ring-4 focus:ring-blue-100"
                        />
                      </div>

                      <label className="mt-5 flex cursor-pointer items-start gap-3">
                        <input
                          type="checkbox"
                          checked={form.consent}
                          onChange={(event) =>
                            updateField("consent", event.target.checked)
                          }
                          className="mt-0.5 h-4 w-4 rounded border-zinc-300 text-[#063ee2] focus:ring-[#063ee2]"
                        />

                        <span className="text-xs leading-5 text-zinc-500">
                          I agree that RelunoOS may contact me about this
                          request. Please do not include passwords, payment-card
                          numbers, or other highly sensitive information.
                        </span>
                      </label>

                      {error && (
                        <div
                          role="alert"
                          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                        >
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#063ee2] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_24px_rgba(6,62,226,0.22)] transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Sending message
                          </>
                        ) : (
                          <>
                            Send message
                            <Send size={16} />
                          </>
                        )}
                      </button>

                      <p className="mt-4 text-center text-[11px] leading-5 text-zinc-400">
                        By sending this form, you acknowledge that you have read
                        our{" "}
                        <Link
                          to="/privacy"
                          className="font-semibold text-[#063ee2] hover:text-blue-800"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </p>
                    </form>
                  )}
                </div>
              </div>

              <aside className="lg:pt-20">
                {/* One card for all support paths */}
                <div className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-[0_20px_60px_rgba(6,62,226,0.05)]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                    Find the right path
                  </p>

                  <h2 className="mt-4 text-2xl font-bold tracking-[-0.035em] text-zinc-900">
                    We are here for the operational questions.
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-zinc-500">
                    Choose the closest topic in the form and we will route your
                    message to the right place.
                  </p>

                  <div className="mt-7 space-y-5">
                    {contactTopics.map((topic) => {
                      const Icon = topic.icon;

                      return (
                        <div
                          key={topic.title}
                          className="flex items-start gap-3.5"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
                            <Icon size={17} />
                          </div>

                          <div>
                            <h3 className="text-sm font-bold text-zinc-900">
                              {topic.title}
                            </h3>

                            <p className="mt-1.5 text-xs leading-5 text-zinc-500">
                              {topic.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-7 border-t border-zinc-100 pt-5">
                    <p className="text-xs leading-5 text-zinc-500">
                      Prefer email? Contact the RelunoOS team at{" "}
                      <a
                        href="mailto:support@relunoos.com"
                        className="font-bold text-[#063ee2] hover:text-blue-800"
                      >
                        support@relunoos.com
                      </a>
                      .
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl bg-gradient-to-br from-[#063ee2] via-blue-700 to-indigo-950 p-1">
                  <div className="rounded-[1.35rem] bg-white p-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#063ee2]">
                      <ClipboardList size={18} />
                    </div>

                    <h3 className="mt-5 text-lg font-bold tracking-tight text-zinc-900">
                      Looking for an answer first?
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      Explore pricing, platform details, and security information
                      before you send a message.
                    </p>

                    <div className="mt-5 space-y-2">
                      {helpfulLinks.map((item) => {
                        const Icon = item.icon;

                        return (
                          <Link
                            key={item.title}
                            to={item.href}
                            className="group flex items-center gap-3 rounded-xl border border-zinc-200 p-3 transition-all hover:border-blue-200 hover:bg-blue-50/50"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-50 text-[#063ee2] group-hover:bg-blue-100">
                              <Icon size={15} />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-zinc-900">
                                {item.title}
                              </p>

                              <p className="mt-0.5 text-[11px] leading-4 text-zinc-500">
                                {item.description}
                              </p>
                            </div>

                            <ArrowRight
                              size={14}
                              className="shrink-0 text-zinc-400 transition-transform group-hover:translate-x-1 group-hover:text-[#063ee2]"
                            />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Contact workflow explanation */}
        <section className="border-b border-zinc-100 bg-white px-6 py-24 sm:px-10 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#063ee2]">
                  Clear communication
                </p>

                <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] text-zinc-900 sm:text-5xl">
                  Your message starts with the right context.
                </h2>

                <p className="mt-6 max-w-xl text-base leading-7 text-zinc-500">
                  Contact requests are categorized by topic and stored securely
                  so product, account, pricing, and security questions can be
                  reviewed without getting lost.
                </p>
              </div>

              <div className="overflow-hidden rounded-3xl border border-zinc-200">
                <div className="grid grid-cols-[1.1fr_1fr_1fr] border-b border-zinc-200 bg-zinc-50">
                  <div className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Request type
                  </div>

                  <div className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                    Captured context
                  </div>

                  <div className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#063ee2]">
                    Next step
                  </div>
                </div>

                <div className="divide-y divide-zinc-200 bg-white text-xs text-zinc-700">
                  <div className="grid grid-cols-[1.1fr_1fr_1fr] px-5 py-4">
                    <span className="font-semibold text-zinc-900">
                      Product question
                    </span>
                    <span className="text-zinc-500">
                      Topic, name, email, and message
                    </span>
                    <span className="font-medium text-blue-600">
                      Product conversation
                    </span>
                  </div>

                  <div className="grid grid-cols-[1.1fr_1fr_1fr] px-5 py-4">
                    <span className="font-semibold text-zinc-900">
                      Account support
                    </span>
                    <span className="text-zinc-500">
                      Contact details and support context
                    </span>
                    <span className="font-medium text-blue-600">
                      Support follow-up
                    </span>
                  </div>

                  <div className="grid grid-cols-[1.1fr_1fr_1fr] px-5 py-4">
                    <span className="font-semibold text-zinc-900">
                      Security question
                    </span>
                    <span className="text-zinc-500">
                      Report category and description
                    </span>
                    <span className="font-medium text-blue-600">
                      Security review
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="hero-grid relative isolate overflow-hidden px-6 py-24 text-white sm:px-10 sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.13)_0%,rgba(3,26,117,0.68)_72%,rgba(1,11,51,0.92)_100%)]" />
          <div className="hero-stripes pointer-events-none absolute inset-0 opacity-40" />

          <div className="relative mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-blue-100">
              Explore on your terms
            </p>

            <h2 className="mt-5 text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl">
              See how RelunoOS fits your client workflow.
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-100">
              Start with the connected workflow, explore the platform, and
              upgrade only when your client operations need more capacity.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#063ee2] shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition-all hover:-translate-y-0.5 hover:bg-blue-50"
              >
                Start free
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
              >
                View pricing
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}