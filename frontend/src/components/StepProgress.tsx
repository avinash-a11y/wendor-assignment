import React from 'react';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface StepProgressProps {
  currentStep: number;
  steps: Step[];
}

export function StepProgress({ currentStep, steps }: StepProgressProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      {/* Progress Bar */}
      <div className="relative">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200">
          <div 
            className="h-full bg-blue-600 transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
        
        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center">
                {/* Step Circle */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                  ${isCompleted 
                    ? 'bg-green-600 text-white' 
                    : isActive 
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100' 
                    : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-lg">{step.icon}</span>
                  )}
                </div>
                
                {/* Step Content */}
                <div className="mt-4 text-center max-w-32">
                  <h3 className={`text-sm font-semibold ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 leading-tight">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
