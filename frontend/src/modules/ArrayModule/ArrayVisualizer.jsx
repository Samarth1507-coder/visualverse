import React from 'react';

const ArrayVisualizer = ({ array, highlightIndex, highlightIndices = [] }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {array.map((value, idx) => {
        const isHighlighted = highlightIndex === idx || highlightIndices.includes(idx);

        return (
          <div
            key={idx}
            className={`
              w-16 h-16 flex items-center justify-center border rounded-md text-lg font-semibold
              transition-all duration-500
              ${isHighlighted ? 'bg-yellow-300 animate-pulse scale-110' : 'bg-white text-gray-700'}
            `}
          >
            {value}
          </div>
        );
      })}
    </div>
  );
};

export default ArrayVisualizer;
