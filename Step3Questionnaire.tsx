// src/components/onboarding/Step3Questionnaire.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

interface Step3Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

// Comprehensive industry-specific questions mapping
const industryQuestions: Record<string, Array<{ key: string; label: string; type: string; options?: string[] }>> = {
  web_design: [
    { key: "avg_project_value", label: "What is your average project value?", type: "text" },
    { key: "hosting_retainer", label: "Do you offer hosting retainers?", type: "boolean" },
    { key: "tech_stacks", label: "What tech stacks do you specialize in?", type: "text" },
    { key: "project_timeline", label: "What is your typical project timeline?", type: "text" },
    { key: "pricing_model", label: "Do you charge hourly or flat-rate?", type: "select", options: ["Hourly", "Flat-rate", "Hybrid"] },
  ],
  plumbing: [
    { key: "service_call_fee", label: "What is your average service call fee?", type: "text" },
    { key: "emergency_dispatch", label: "Do you offer emergency dispatch?", type: "boolean" },
    { key: "pricing_model", label: "What is your typical pricing model?", type: "select", options: ["Hourly", "Flat-rate", "Per-job"] },
    { key: "equipment_sales", label: "Do you sell equipment/installations?", type: "boolean" },
    { key: "monthly_revenue", label: "What is your average monthly revenue?", type: "text" },
  ],
  marketing: [
    { key: "avg_monthly_retainer", label: "What is your average monthly retainer?", type: "text" },
    { key: "project_work", label: "Do you offer project-based work?", type: "boolean" },
    { key: "services", label: "What services do you specialize in?", type: "text" },
    { key: "client_load", label: "How many clients do you typically manage at once?", type: "text" },
    { key: "performance_fees", label: "Do you charge performance-based fees?", type: "boolean" },
  ],
  legal: [
    { key: "hourly_rate", label: "What is your standard hourly rate?", type: "text" },
    { key: "retainer_fee", label: "Do you require an upfront retainer?", type: "boolean" },
    { key: "practice_areas", label: "What are your primary practice areas?", type: "text" },
  ],
  photography: [
    { key: "avg_session_fee", label: "What is your average session fee?", type: "text" },
    { key: "print_sales", label: "Do you sell prints or digital packages?", type: "select", options: ["Digital Only", "Prints & Digital", "Packages"] },
  ],
  coaching: [
    { key: "package_price", label: "What is the average price of your coaching package?", type: "text" },
    { key: "session_length", label: "What is your standard session length?", type: "select", options: ["30 Minutes", "45 Minutes", "60 Minutes", "90 Minutes"] },
  ]
};

export default function Step3Questionnaire({ data, onNext, onBack }: Step3Props) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: data.questionnaireAnswers || {},
  });

  // Load questions based on industry selected in Step 2
  useEffect(() => {
    const industryQuestionsList = industryQuestions[data.industry] || industryQuestions["web_design"];
    setQuestions(industryQuestionsList);
  }, [data.industry]);

  const onSubmit = async (answers: any) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/onboarding/step3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      
      if (!response.ok) throw new Error("Failed to save");
      
      // Move to completion step (which triggers AI generation)
      onNext({ questionnaireAnswers: answers });
    } catch (error) {
      console.error("Step 3 error:", error);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Let's personalize your workspace
      </h2>
      <p className="text-gray-600 mb-6">
        Answer a few questions so we can configure templates specific to your business.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {questions.map((question) => (
          <div key={question.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {question.label}
            </label>

            {question.type === "text" && (
              <input
                {...register(question.key, { required: "This field is required" })}
                type="text"
                placeholder="Your answer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            )}

            {question.type === "boolean" && (
              <div className="flex gap-6 mt-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    {...register(question.key, { required: "Please select an option" })}
                    type="radio"
                    value="Yes"
                    className="h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    {...register(question.key, { required: "Please select an option" })}
                    type="radio"
                    value="No"
                    className="h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            )}

            {question.type === "select" && (
              <select
                {...register(question.key, { required: "Please select an option" })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              >
                <option value="">Select...</option>
                {question.options!.map((opt: string) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {errors[question.key] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[question.key]?.message as string}
              </p>
            )}
          </div>
        ))}

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Generating..." : "Complete Setup"}
          </button>
        </div>
      </form>
    </div>
  );
}