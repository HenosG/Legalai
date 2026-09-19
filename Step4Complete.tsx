// src/components/onboarding/Step4Complete.tsx
import { useState, useEffect } from "react";

interface Step4Props {
  data: any;
  onComplete: () => void;
}

export default function Step4Complete({ data, onComplete }: Step4Props) {
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    // Trigger AI generation
    const completeOnboarding = async () => {
      try {
        const response = await fetch("/api/onboarding/complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed");

        // Wait 2 seconds for effect
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsGenerating(false);
      } catch (error) {
        console.error("Complete error:", error);
        alert("Something went wrong. Please try again.");
      }
    };

    completeOnboarding();
  }, []);

  if (isGenerating) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Generating your personalized workspace...
        </h3>
        <p className="text-gray-600">
          Creating custom templates, pipelines, and workflows for your {data.industry} business.
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Welcome to RelunoOS, {data.businessName}!
      </h3>
      
      <p className="text-gray-600 mb-6">
        Your workspace is ready. We've created:
      </p>

      <ul className="text-left max-w-md mx-auto space-y-2 mb-8">
        <li className="flex items-center text-gray-700">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Custom proposal templates for {data.industry}
        </li>
        <li className="flex items-center text-gray-700">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          CRM pipeline configured for your business type
        </li>
        <li className="flex items-center text-gray-700">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Invoice templates with industry-specific line items
        </li>
      </ul>

      <button
        onClick={onComplete}
        className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
      >
        Go to Dashboard
      </button>
    </div>
  );
}