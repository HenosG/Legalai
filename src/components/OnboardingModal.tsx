// src/components/OnboardingModal.tsx
import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const PREDEFINED_INDUSTRIES = [
  { label: "Web Development & Engineering", value: "web_development" },
  { label: "Digital Marketing Agency", value: "digital_marketing" },
  { label: "UI/UX & Graphic Design", value: "ui_ux_design" },
  { label: "Legal Services & Consulting", value: "legal_services" },
  { label: "Plumbing & HVAC Contracting", value: "plumbing_hvac" },
  { label: "Electrical Contracting", value: "electrical" },
  { label: "Real Estate Agency & Brokerage", value: "real_estate" },
  { label: "Accounting & Bookkeeping", value: "accounting" },
  { label: "Freelance Writing & Copywriting", value: "copywriting" },
  { label: "Photography & Videography", value: "media_production" },
  { label: "IT Support & Managed Services", value: "it_support" },
  { label: "Business Management Consulting", value: "business_consulting" },
  { label: "Fitness Coaching & Personal Training", value: "fitness_coaching" },
  { label: "Residential & Commercial Cleaning", value: "cleaning_services" },
  { label: "Landscaping & Lawn Care", value: "landscaping" },
  { label: "Interior Design & Architecture", value: "interior_design" },
  { label: "Event Planning & Production", value: "event_planning" },
  { label: "E-Commerce & Retail Brand", value: "ecommerce" },
  { label: "Cybersecurity Consulting", value: "cybersecurity" },
  { label: "Custom / Other Market", value: "custom" },
];

export default function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { getToken, userId } = useAuth();

  // Form states
  const [businessName, setBusinessName] = useState("");
  const [businessSlug, setBusinessSlug] = useState("");
  
  // Industry & Custom fields
  const [industryChoice, setIndustryChoice] = useState("web_development");
  const [customIndustry, setCustomIndustry] = useState("");
  const [businessType, setBusinessType] = useState("Agency / LLC");
  const [agentName, setAgentName] = useState("Rulo");

  // Questionnaire state
  const [answers, setAnswers] = useState({
    projectValue: "$2,500 - $10,000",
    primaryGoal: "Landing clients faster & automating proposals",
  });

  // Dynamic loading messages cycling during AI generation step
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const aiLoadingMessages = [
    `Initializing ${agentName}, your dedicated AI operating partner...`,
    "Synthesizing high-converting proposal templates...",
    "Configuring customized sales pipeline stages...",
    "Structuring intelligent client intake & billing flows...",
    `Putting the finishing touches on your workspace with ${agentName}...`
  ];

  if (!isOpen) return null;

  const getApiUrl = (endpoint: string) => {
    const isLocalDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const backendBase = isLocalDev ? "http://localhost:5000" : "";
    return `${backendBase}${endpoint}`;
  };

  const handleNextStep = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!userId) {
        throw new Error("Your session has expired or is uninitialized. Please log in again.");
      }

      const token = await getToken();
      if (!token) {
        throw new Error("Unable to authenticate session. Please try logging out and back in.");
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const fetchOptions = (bodyData: any) => ({
        method: "POST",
        headers,
        credentials: "include" as RequestCredentials,
        body: JSON.stringify(bodyData),
      });

      if (currentStep === 1) {
        const res = await fetch(getApiUrl("/api/onboarding/step1"), fetchOptions({ businessName, businessSlug, currency: "USD", country: "US" }));
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to save business profile");
        
        setCurrentStep(2);
        setIsLoading(false);
      } else if (currentStep === 2) {
        const finalIndustry = industryChoice === "custom" ? customIndustry : industryChoice;
        if (industryChoice === "custom" && !customIndustry.trim()) {
          throw new Error("Please specify your custom industry/market.");
        }

        const res = await fetch(getApiUrl("/api/onboarding/step2"), fetchOptions({ 
          industry: finalIndustry, 
          businessType, 
          agentName: agentName.trim() || "Rulo" 
        }));
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to save industry details");
        
        setCurrentStep(3);
        setIsLoading(false);
      } else if (currentStep === 3) {
        const res = await fetch(getApiUrl("/api/onboarding/step3"), fetchOptions({ answers }));
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to save questionnaire");
        
        setCurrentStep(4);
        
        // Start cycling messages while AI generates
        const messageInterval = setInterval(() => {
          setLoadingMessageIndex((prev) => (prev + 1) % aiLoadingMessages.length);
        }, 2500);

        await triggerAICompletion(headers, messageInterval);
      }
    } catch (err: any) {
      console.error("❌ Onboarding Error:", err);
      setError(err.message || "An unexpected error occurred during onboarding.");
      setIsLoading(false);
    }
  };

  const triggerAICompletion = async (headers: Record<string, string>, interval: NodeJS.Timeout) => {
    try {
      const res = await fetch(getApiUrl("/api/onboarding/complete"), {
        method: "POST",
        headers,
        credentials: "include",
      });
      const data = await res.json();
      clearInterval(interval);

      if (!res.ok) throw new Error(data.error || "Failed to generate AI workspace assets");

      setTimeout(() => {
        setIsLoading(false);
        onComplete();
      }, 800);
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "AI generation failed");
      setIsLoading(false);
      setCurrentStep(3); // Allow retry
    }
  };

  const progress = Math.min((currentStep / 3) * 100, 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
        
        {/* Header & Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-900">
              {currentStep === 4 ? `${agentName} is building your workspace...` : `Welcome to RelunoOS (Step ${currentStep} of 3)`}
            </h2>
            <span className="text-sm font-medium text-indigo-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleNextStep}>
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Name</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    setBusinessSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                  }}
                  placeholder="e.g. Acme Studio"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Workspace URL Slug</label>
                <input
                  type="text"
                  required
                  value={businessSlug}
                  onChange={(e) => setBusinessSlug(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              {/* Expanded Industry Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Industry / Niche</label>
                <select
                  value={industryChoice}
                  onChange={(e) => setIndustryChoice(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none bg-white"
                >
                  {PREDEFINED_INDUSTRIES.map((ind) => (
                    <option key={ind.value} value={ind.value}>
                      {ind.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Custom Industry Input (Triggers if "custom" is selected) */}
              {industryChoice === "custom" && (
                <div className="animate-fadeIn">
                  <label className="block text-sm font-medium text-indigo-600">Type your specific market or business type</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Drone Cinematography, Specialty Bakery..."
                    value={customIndustry}
                    onChange={(e) => setCustomIndustry(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-indigo-500 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">Business Structure / Type</label>
                <input
                  type="text"
                  required
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  placeholder="e.g. Solo Freelancer, Agency, LLC"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Name Your AI Assistant</label>
                <input
                  type="text"
                  required
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="Default is Rulo"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">Your AI copilot will go by this name across your workspace.</p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Typical Project Budget</label>
                <input
                  type="text"
                  value={answers.projectValue}
                  onChange={(e) => setAnswers({ ...answers, projectValue: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Primary Goal with RelunoOS</label>
                <input
                  type="text"
                  value={answers.primaryGoal}
                  onChange={(e) => setAnswers({ ...answers, primaryGoal: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="py-10 text-center space-y-4">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
              <p className="text-sm font-medium text-gray-700 transition-all duration-300">
                {aiLoadingMessages[loadingMessageIndex]}
              </p>
              <p className="text-xs text-gray-400">This takes just a couple of seconds...</p>
            </div>
          )}

          {currentStep < 4 && (
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition disabled:opacity-50 shadow-md shadow-indigo-600/10"
              >
                {isLoading ? "Saving..." : currentStep === 3 ? `Launch & Build with ${agentName} ✨` : "Continue"}
              </button>
            </div>
          )}
        </form>

      </div>
    </div>
  );
}