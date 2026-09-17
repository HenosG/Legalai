// src/components/OnboardingFlow.tsx
// Design system: matches Index.tsx and Dashboard.tsx exactly —
// DM Serif Display + DM Sans, light surface, zinc-900 text, blue-600 accent.
//
// A 12-step flow designed to feel like a thoughtful intake conversation
// rather than a gate to click through. Each step either makes the person
// feel understood (their situation, their stakes) or makes Reluno feel
// more credible (security, scope, what happens next). The final step is
// a short branded loading sequence that "builds" their workspace based
// on what they told us — a small moment of payoff before they arrive.

import { useState, useEffect } from "react";
import { ArrowRight, Check, Scale, Building2, FileWarning, ShieldCheck } from "lucide-react";

interface OnboardingFlowProps {
  onComplete: () => void;
}

type UseCase = "saas" | "freelance" | "legal" | "everyday" | "";
type LegalSituation =
  | "contract_review" | "dispute" | "divorce" | "tenant"
  | "starting_business" | "just_exploring" | "";
type Urgency = "urgent" | "soon" | "planning" | "";
type Stakes = "personal" | "business" | "both" | "";
type DocVolume = "1-2" | "3-10" | "10+" | "";
type Familiarity = "first_time" | "some_experience" | "very_familiar" | "";

const useCaseOptions: { id: UseCase; label: string; desc: string; icon: any }[] = [
  { id: "saas",       label: "Software entrepreneur",     desc: "Contracts, vendor terms, and incorporation documents.",   icon: Building2 },
  { id: "freelance",  label: "Freelancer or consultant",  desc: "Client agreements, scope letters, and invoicing disputes.", icon: FileWarning },
  { id: "legal",      label: "Legal professional",        desc: "Document review, drafting, and case management at scale.", icon: Scale },
  { id: "everyday",   label: "Personal legal matter",     desc: "Tenant rights, family law, or a dispute you're handling yourself.", icon: ShieldCheck },
];

const situationOptions: { id: LegalSituation; label: string }[] = [
  { id: "contract_review",   label: "Reviewing a contract before I sign" },
  { id: "dispute",           label: "In a dispute with someone" },
  { id: "divorce",           label: "Going through a separation or divorce" },
  { id: "tenant",            label: "A landlord or tenant issue" },
  { id: "starting_business", label: "Setting up a new business" },
  { id: "just_exploring",    label: "Just exploring, nothing urgent" },
];

const urgencyOptions: { id: Urgency; label: string; desc: string }[] = [
  { id: "urgent",   label: "This week",       desc: "There's a deadline or something time-sensitive." },
  { id: "soon",     label: "Next few weeks",  desc: "Important, but I have some room to breathe." },
  { id: "planning", label: "No fixed timeline", desc: "I'm getting ahead of something before it's a problem." },
];

const stakesOptions: { id: Stakes; label: string }[] = [
  { id: "personal", label: "Personal — affects me or my family" },
  { id: "business", label: "Business — affects my company" },
  { id: "both",     label: "Both, in some way" },
];

const docVolumeOptions: { id: DocVolume; label: string }[] = [
  { id: "1-2",  label: "Just one or two documents" },
  { id: "3-10", label: "A handful, maybe 3–10" },
  { id: "10+",  label: "A larger volume — 10 or more" },
];

const familiarityOptions: { id: Familiarity; label: string; desc: string }[] = [
  { id: "first_time",       label: "First time dealing with something like this", desc: "We'll explain things in plain language, no jargon assumed." },
  { id: "some_experience",  label: "I've handled something similar before",        desc: "We'll keep explanations brief and skip the basics." },
  { id: "very_familiar",    label: "I'm very comfortable with legal matters",       desc: "We'll surface technical detail and citations by default." },
];

// Loading sequence copy — written in Reluno's voice, references what the
// person actually told us so it reads as assembled-for-you, not generic.
const buildLoadingSteps = (useCase: UseCase, situation: LegalSituation) => {
  const useCaseLabel =
    useCase === "legal" ? "practice" :
    useCase === "saas" ? "business" :
    useCase === "freelance" ? "client work" : "matter";

  return [
    "Setting up your workspace",
    `Calibrating for your ${useCaseLabel}`,
    situation === "divorce" ? "Loading family law resources" :
    situation === "tenant" ? "Loading landlord-tenant resources" :
    situation === "dispute" ? "Loading dispute resolution tools" :
    "Loading relevant practice areas",
    "Securing your document vault",
    "Finalizing your dashboard",
  ];
};

const TOTAL_STEPS = 12;

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [useCase, setUseCase] = useState<UseCase>("");
  const [situation, setSituation] = useState<LegalSituation>("");
  const [urgency, setUrgency] = useState<Urgency>("");
  const [stakes, setStakes] = useState<Stakes>("");
  const [docVolume, setDocVolume] = useState<DocVolume>("");
  const [familiarity, setFamiliarity] = useState<Familiarity>("");
  const [loadingIndex, setLoadingIndex] = useState(0);

  const isLoadingStep = step === TOTAL_STEPS;

  // Drive the branded loading sequence once the person reaches the final step
  useEffect(() => {
    if (!isLoadingStep) return;
    const loadingSteps = buildLoadingSteps(useCase, situation);
    let i = 0;
    setLoadingIndex(0);
    const interval = setInterval(() => {
      i += 1;
      if (i >= loadingSteps.length) {
        clearInterval(interval);
        setTimeout(onComplete, 550);
      } else {
        setLoadingIndex(i);
      }
    }, 650);
    return () => clearInterval(interval);
  }, [isLoadingStep]);

  const handleNext = () => {
    if (step < TOTAL_STEPS) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1 && !isLoadingStep) setStep((prev) => prev - 1);
  };

  const canContinue = (): boolean => {
    switch (step) {
      case 3: return !!useCase;
      case 5: return !!situation;
      case 6: return !!urgency;
      case 7: return !!stakes;
      case 9: return !!docVolume;
      case 10: return !!familiarity;
      default: return true;
    }
  };

  const loadingSteps = buildLoadingSteps(useCase, situation);

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
        .font-display { font-family: 'DM Serif Display', serif; }
        .onboard-wrap * { font-family: 'DM Sans', sans-serif; }
        .onboard-wrap h2 { font-family: 'DM Serif Display', serif; }

        @keyframes relunoFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .onboard-step-enter { animation: relunoFadeUp 0.35s ease forwards; }

        @keyframes relunoPulseRing {
          0%   { transform: scale(0.92); opacity: 0.55; }
          70%  { transform: scale(1.35); opacity: 0; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        .reluno-pulse-ring {
          animation: relunoPulseRing 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }

        @keyframes relunoCheckIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        .reluno-check-in { animation: relunoCheckIn 0.3s ease forwards; }
      `}</style>

      <div className="onboard-wrap w-full max-w-xl bg-white rounded-md border border-zinc-200 shadow-xl overflow-hidden">

        {/* ── Progress header ── */}
        {!isLoadingStep && (
          <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-zinc-100">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-[3px] rounded-full transition-all duration-300 ${
                    i + 1 === step ? "w-5 bg-blue-600" : i + 1 < step ? "w-5 bg-zinc-300" : "w-5 bg-zinc-100"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
              Step {step} of {TOTAL_STEPS - 1}
            </span>
          </div>
        )}

        <div className={isLoadingStep ? "px-8 py-16" : "px-8 py-10 min-h-[340px]"}>

          {/* ── Step 1 — Welcome ── */}
          {step === 1 && (
            <div key={step} className="onboard-step-enter">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-5">
                Welcome to Reluno
              </p>
              <h2 className="text-3xl leading-tight tracking-tight text-zinc-900 mb-4">
                Legal intelligence, set up around your situation.
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-md">
                Reluno gives you instant document analysis, case tracking, and AI-assisted drafting —
                the same infrastructure a Fortune 500 legal team relies on, built for individuals and
                small teams. We'll ask a few questions so your workspace reflects what you actually
                need, not a generic template.
              </p>
            </div>
          )}

          {/* ── Step 2 — What to expect ── */}
          {step === 2 && (
            <div key={step} className="onboard-step-enter">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-5">
                Before we start
              </p>
              <h2 className="text-3xl leading-tight tracking-tight text-zinc-900 mb-4">
                This will take about two minutes.
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-md mb-7">
                Nothing you tell us here is binding or shared outside your account. It simply shapes
                what shows up first — which practice areas, which document templates, and how much
                explanation we give alongside the answers.
              </p>
              <div className="space-y-3">
                {[
                  "Takes about two minutes",
                  "Nothing here is shared or sold",
                  "You can change any of this later in settings",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-zinc-600">
                    <div className="w-5 h-5 rounded-sm border border-zinc-200 flex items-center justify-center shrink-0">
                      <Check size={11} className="text-blue-600" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3 — Use case ── */}
          {step === 3 && (
            <div key={step} className="onboard-step-enter">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-5">
                Tell us about your work
              </p>
              <h2 className="text-3xl leading-tight tracking-tight text-zinc-900 mb-4">
                How will you use Reluno?
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-md mb-7">
                This determines which practice areas and document templates appear first in your
                workspace.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {useCaseOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setUseCase(opt.id)}
                      className={`text-left p-4 rounded-md border transition-all ${
                        useCase === opt.id
                          ? "border-blue-600 bg-blue-50/40"
                          : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon size={15} className={useCase === opt.id ? "text-blue-600" : "text-zinc-400"} />
                        {useCase === opt.id && <Check size={14} className="text-blue-600 shrink-0" />}
                      </div>
                      <p className="text-sm font-semibold text-zinc-900 mb-1">{opt.label}</p>
                      <p className="text-xs text-zinc-400 leading-relaxed">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 4 — Acknowledge their context (everyday users) ── */}
          {step === 4 && (
            <div key={step} className="onboard-step-enter">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-5">
                Good to know
              </p>
              <h2 className="text-3xl leading-tight tracking-tight text-zinc-900 mb-4">
                {useCase === "everyday"
                  ? "Legal situations are stressful. We've designed around that."
                  : "Built to keep up with how you actually work."}
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-md">
                {useCase === "everyday"
                  ? "Most people come to Reluno during a hard moment — a dispute, a divorce, a notice they didn't expect. Our job is to give you clear answers quickly, without making you feel like you need a law degree to understand your own situation."
                  : "Reluno is built to handle real workloads — multiple matters, recurring document types, and the back-and-forth that comes with actual client or vendor work, not just a single one-off question."}
              </p>
            </div>
          )}

          {/* ── Step 5 — Current situation ── */}
          {step === 5 && (
            <div key={step} className="onboard-step-enter">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-5">
                Your situation
              </p>
              <h2 className="text-3xl leading-tight tracking-tight text-zinc-900 mb-4">
                What brings you here today?
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-md mb-7">
                Pick whichever is closest — you'll be able to start other matters later.
              </p>
              <div className="space-y-2">
                {situationOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSituation(opt.id)}
                    className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-md border transition-all ${
                      situation === opt.id
                        ? "border-blue-600 bg-blue-50/40"
                        : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="text-sm font-medium text-zinc-800">{opt.label}</span>
                    {situation === opt.id && <Check size={14} className="text-blue-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 6 — Urgency ── */}
          {step === 6 && (
            <div key={step} className="onboard-step-enter">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-5">
                Timing
              </p>
              <h2 className="text-3xl leading-tight tracking-tight text-zinc-900 mb-4">
                How soon does this need attention?
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-md mb-7">
                We'll surface deadline tracking and reminders automatically if time is tight.
              </p>
              <div className="space-y-2">
                {urgencyOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setUrgency(opt.id)}
                    className={`w-full text-left px-4 py-3.5 rounded-md border transition-all ${
                      urgency === opt.id
                        ? "border-blue-600 bg-blue-50/40"
                        : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-zinc-900">{opt.label}</span>
                      {urgency === opt.id && <Check size={14} className="text-blue-600 shrink-0" />}
                    </div>
                    <p className="text-xs text-zinc-400">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 7 — Stakes ── */}
          {step === 7 && (
            <div key={step} className="onboard-step-enter">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-5">
                Context
              </p>
              <h2 className="text-3xl leading-tight tracking-tight text-zinc-900 mb-4">
                Who does this affect?
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-md mb-7">
                This helps us frame guidance appropriately — personal matters and business matters
                often call for a different tone and different document types.
              </p>
              <div className="space-y-2">
                {stakesOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setStakes(opt.id)}
                    className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-md border transition-all ${
                      stakes === opt.id
                        ? "border-blue-600 bg-blue-50/40"
                        : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="text-sm font-medium text-zinc-800">{opt.label}</span>
                    {stakes === opt.id && <Check size={14} className="text-blue-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 8 — Reassurance beat ── */}
          {step === 8 && (
            <div key={step} className="onboard-step-enter">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-5">
                Worth knowing
              </p>
              <h2 className="text-3xl leading-tight tracking-tight text-zinc-900 mb-4">
                You don't need to get this perfect.
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-md">
                Whatever you've told us so far is a starting point, not a commitment. You can open a
                different matter, switch practice areas, or ask Reluno something completely unrelated
                the moment you're inside. The goal of these questions is just to make your first few
                minutes feel relevant instead of generic.
              </p>
            </div>
          )}

          {/* ── Step 9 — Document volume ── */}
          {step === 9 && (
            <div key={step} className="onboard-step-enter">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-5">
                Scope
              </p>
              <h2 className="text-3xl leading-tight tracking-tight text-zinc-900 mb-4">
                How many documents are you working with?
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-md mb-7">
                This shapes whether we show you a single upload flow or a fuller document vault from
                the start.
              </p>
              <div className="space-y-2">
                {docVolumeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDocVolume(opt.id)}
                    className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-md border transition-all ${
                      docVolume === opt.id
                        ? "border-blue-600 bg-blue-50/40"
                        : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                    }`}
                  >
                    <span className="text-sm font-medium text-zinc-800">{opt.label}</span>
                    {docVolume === opt.id && <Check size={14} className="text-blue-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 10 — Familiarity ── */}
          {step === 10 && (
            <div key={step} className="onboard-step-enter">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-5">
                One last thing
              </p>
              <h2 className="text-3xl leading-tight tracking-tight text-zinc-900 mb-4">
                How familiar are you with matters like this?
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-md mb-7">
                There's no wrong answer — this just sets how much explanation Reluno gives by default.
              </p>
              <div className="space-y-2">
                {familiarityOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFamiliarity(opt.id)}
                    className={`w-full text-left px-4 py-3.5 rounded-md border transition-all ${
                      familiarity === opt.id
                        ? "border-blue-600 bg-blue-50/40"
                        : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-zinc-900">{opt.label}</span>
                      {familiarity === opt.id && <Check size={14} className="text-blue-600 shrink-0" />}
                    </div>
                    <p className="text-xs text-zinc-400">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 11 — Security & readiness ── */}
          {step === 11 && (
            <div key={step} className="onboard-step-enter">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-600 mb-5">
                You're ready
              </p>
              <h2 className="text-3xl leading-tight tracking-tight text-zinc-900 mb-4">
                Your documents stay yours.
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-md mb-8">
                Every file you upload is encrypted at rest and in transit, processed in an isolated
                environment, and never used to train external models.
              </p>
              <div className="space-y-3">
                {[
                  "AES-256 encryption at rest and in transit",
                  "SOC 2 Type II audited infrastructure",
                  "Zero data retention for model training",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-zinc-600">
                    <div className="w-5 h-5 rounded-sm border border-zinc-200 flex items-center justify-center shrink-0">
                      <Check size={11} className="text-blue-600" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 12 — Branded loading sequence ── */}
          {isLoadingStep && (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="relative w-16 h-16 flex items-center justify-center mb-8">
                <span className="reluno-pulse-ring absolute inset-0 rounded-full border-2 border-blue-200" />
                <span className="text-3xl font-bold text-blue-600" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  R
                </span>
              </div>

              <p className="text-sm font-medium text-zinc-700 mb-1 min-h-[20px] transition-all duration-200">
                {loadingSteps[loadingIndex]}
              </p>
              <p className="text-xs text-zinc-400">This will only take a moment</p>

              <div className="flex flex-col gap-2 mt-8 w-full max-w-[260px]">
                {loadingSteps.map((label, i) => (
                  <div key={label} className="flex items-center gap-2.5 text-left">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-200 ${
                      i < loadingIndex ? "bg-blue-600 border-blue-600" :
                      i === loadingIndex ? "border-blue-600" : "border-zinc-200"
                    }`}>
                      {i < loadingIndex && <Check size={9} className="text-white reluno-check-in" />}
                      {i === loadingIndex && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />}
                    </div>
                    <span className={`text-xs transition-colors duration-200 ${
                      i <= loadingIndex ? "text-zinc-600" : "text-zinc-300"
                    }`}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer actions ── */}
        {!isLoadingStep && (
          <div className="flex items-center justify-between px-8 py-6 border-t border-zinc-100 bg-zinc-50">
            <button
              onClick={handleBack}
              className={`text-xs font-semibold text-zinc-400 hover:text-zinc-700 transition-colors ${
                step === 1 ? "opacity-0 pointer-events-none" : ""
              }`}
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canContinue()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {step === TOTAL_STEPS - 1 ? "Build my workspace" : "Continue"}
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}