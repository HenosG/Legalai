// src/components/onboarding/Step2Industry.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { industrySchema } from "@/lib/validations";

const industries = [
  { id: "web_design", name: "Web Design/Development", icon: "🎨" },
  { id: "plumbing", name: "Plumbing/Home Services", icon: "🔧" },
  { id: "marketing", name: "Marketing Agency", icon: "📈" },
  { id: "legal", name: "Legal/Consulting", icon: "⚖️" },
  { id: "photography", name: "Photography/Creative", icon: "📸" },
  { id: "coaching", name: "Coaching/Consulting", icon: "🎯" },
];

const businessTypes = [
  { id: "freelancer", name: "Solo Freelancer" },
  { id: "agency", name: "Small Agency (2–15 people)" },
  { id: "llc", name: "LLC/Corporation" },
];

interface Step2Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
}

export default function Step2Industry({ data, onNext, onBack }: Step2Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(industrySchema),
    defaultValues: {
      industry: data.industry || "web_design",
      businessType: data.businessType || "freelancer",
    },
  });

  // Watch current selections for dynamic styling
  const selectedIndustry = watch("industry");
  const selectedBusinessType = watch("businessType");

  const onSubmit = async (values: any) => {
    try {
      const response = await fetch("/api/onboarding/step2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Failed to save");
      onNext(values);
    } catch (error) {
      console.error("Step 2 error:", error);
      alert("Failed to save. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        What type of business do you run?
      </h2>
      <p className="text-gray-600 mb-6">
        This helps us customize your workspace with industry-specific templates.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Industry Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Industry
          </label>
          <div className="grid grid-cols-2 gap-3">
            {industries.map((ind) => {
              const isSelected = selectedIndustry === ind.id;
              return (
                <label
                  key={ind.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    {...register("industry")}
                    type="radio"
                    value={ind.id}
                    className="hidden"
                  />
                  <div className="text-2xl mb-2">{ind.icon}</div>
                  <div className="text-sm font-medium text-gray-900">
                    {ind.name}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Business Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Business Type
          </label>
          <div className="space-y-2">
            {businessTypes.map((type) => {
              const isSelected = selectedBusinessType === type.id;
              return (
                <label
                  key={type.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    {...register("businessType")}
                    type="radio"
                    value={type.id}
                    className="h-4 w-4 text-indigo-600"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">
                    {type.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
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
            {isSubmitting ? "Saving..." : "Continue"}
          </button>
        </div>
      </form>
    </div>
  );
}