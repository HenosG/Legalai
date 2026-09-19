// src/components/onboarding/ProgressBar.tsx
interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
  }
  
  export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
    const percentage = (currentStep / totalSteps) * 100;
  
    return (
      <div className="w-full bg-gray-100 h-2">
        <div
          className="bg-indigo-600 h-2 transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
        <div className="px-8 pt-4 pb-2 flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>Step {currentStep} of {totalSteps}</span>
          <span>{Math.round(percentage)}% Completed</span>
        </div>
      </div>
    );
  }