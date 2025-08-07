interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          진행률: {currentStep} / {totalSteps}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-500">시작</span>
        <span className="text-xs text-gray-500">완료</span>
      </div>
    </div>
  );
} 