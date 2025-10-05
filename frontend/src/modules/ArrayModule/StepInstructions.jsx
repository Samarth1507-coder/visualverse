import React from 'react';

const StepInstructions = ({ steps = [], currentStep }) => {
  if (!steps.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-4">
        <h2 className="text-lg font-semibold mb-2">Step Instructions</h2>
        <p className="text-sm text-gray-500">No steps yet. Try performing an operation!</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-4">
      <h2 className="text-lg font-semibold mb-3">Step Instructions</h2>

      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-md text-sm border transition-all ${
              idx === currentStep
                ? 'bg-blue-50 border-blue-400 text-blue-800 font-medium shadow-sm'
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            <span className="font-semibold mr-2">Step {idx + 1}:</span>
            {s}
          </div>
        ))}
      </div>

      {/* Step navigation */}
      <div className="flex justify-between mt-3">
        <button
          disabled={currentStep <= 0}
          onClick={() => window.dispatchEvent(new CustomEvent('step-change', { detail: currentStep - 1 }))}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 transition"
        >
          ⬅ Prev
        </button>
        <button
          disabled={currentStep >= steps.length - 1}
          onClick={() => window.dispatchEvent(new CustomEvent('step-change', { detail: currentStep + 1 }))}
          className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-300 transition"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default StepInstructions;
