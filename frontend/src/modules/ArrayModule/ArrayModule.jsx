import React, { useState } from 'react';
import ArrayVisualizer from './ArrayVisualizer';
import ArrayControls from './ArrayControls';
import StepInstructions from './StepInstructions';
import DrawingCanvas from '../../components/DrawingCanvas'; // adjust path if needed

const ArrayModule = () => {
  const [array, setArray] = useState([10, 20, 30]);
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [canvasSavedImage, setCanvasSavedImage] = useState(null);

  // Teaching steps history
  const [steps, setSteps] = useState([
    { text: "Welcome! Use the controls to perform array operations.", snapshot: [10, 20, 30] }
  ]);
  const [currentStep, setCurrentStep] = useState(0);

  // -----------------------------
  // Array Operations
  // -----------------------------
  const handleInsert = (value, index) => {
    let newArray = [...array];
    if (index !== undefined && index >= 0 && index <= newArray.length) {
      newArray.splice(index, 0, value);
      setHighlightIndex(index);
      addStep(`Inserted ${value} at index ${index}`, newArray);
    } else {
      newArray.push(value);
      setHighlightIndex(newArray.length - 1);
      addStep(`Inserted ${value} at the end`, newArray);
    }
    setArray(newArray);
  };

  const handleDelete = (index) => {
    let newArray = [...array];
    if (index !== undefined && index >= 0 && index < newArray.length) {
      const deleted = newArray.splice(index, 1);
      setHighlightIndex(null);
      addStep(`Deleted ${deleted} from index ${index}`, newArray);
      setArray(newArray);
    } else {
      addStep('Invalid index for deletion', newArray);
    }
  };

  const handleSearch = (value) => {
    const index = array.indexOf(value);
    if (index !== -1) {
      setHighlightIndex(index);
      addStep(`Value ${value} found at index ${index}`, array);
    } else {
      setHighlightIndex(null);
      addStep(`Value ${value} not found`, array);
    }
  };

  const handleReverse = () => {
    const newArray = [...array].reverse();
    setArray(newArray);
    setHighlightIndex(null);
    addStep("Reversed the array", newArray);
  };

  const handleUpdate = (index, value) => {
    if (index >= 0 && index < array.length) {
      const newArray = [...array];
      newArray[index] = value;
      setArray(newArray);
      setHighlightIndex(index);
      addStep(`Updated index ${index} with value ${value}`, newArray);
    } else {
      addStep(`Invalid index for update`, array);
    }
  };

  const handleSplit = (start, end) => {
    const subArray = array.slice(start, end);
    addStep(`Split array from index ${start} to ${end}: [${subArray.join(', ')}]`, array);
  };

  const handleSort = (ascending = true) => {
    const newArray = [...array].sort((a, b) => ascending ? a - b : b - a);
    setArray(newArray);
    setHighlightIndex(null);
    addStep(`Sorted array in ${ascending ? "ascending" : "descending"} order`, newArray);
  };

  // -----------------------------
  // Canvas Doodle Save
  // -----------------------------
  const handleCanvasSave = (imageData) => {
    setCanvasSavedImage(imageData);
    addStep('Canvas doodle saved!', array);
  };

  // -----------------------------
  // Step Management (Teaching Flow)
  // -----------------------------
  const addStep = (text, snapshot) => {
    const newStep = { text, snapshot: [...snapshot] };
    const updatedSteps = [...steps, newStep];
    setSteps(updatedSteps);
    setCurrentStep(updatedSteps.length - 1);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setArray(steps[currentStep + 1].snapshot);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setArray(steps[currentStep - 1].snapshot);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 text-gray-700">
      <h1 className="text-2xl font-bold text-gray-800">VisualVerse - Arrays Module</h1>

      {/* Array Visualizer */}
      <ArrayVisualizer array={array} highlightIndex={highlightIndex} />

      {/* Controls */}
      <ArrayControls 
        onInsert={handleInsert} 
        onDelete={handleDelete} 
        onSearch={handleSearch}
        onReverse={handleReverse}
        onUpdate={handleUpdate}
        onSplit={handleSplit}
        onSort={handleSort}
      />

      {/* Doodle Canvas */}
      <div>
        <h2 className="text-lg font-semibold mb-2 text-gray-800">Annotate / Doodle</h2>
        <DrawingCanvas width={800} height={300} onSave={handleCanvasSave} />
        {canvasSavedImage && (
          <div className="mt-2">
            <span className="text-sm text-green-700">Saved doodle preview:</span>
            <img
              src={canvasSavedImage}
              alt="Saved doodle"
              className="mt-1 border border-gray-300 rounded-md max-w-full"
            />
          </div>
        )}
      </div>

      {/* Step Instructions */}
      <StepInstructions step={steps[currentStep]?.text} />

      {/* Step Navigation */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePrevStep}
          disabled={currentStep === 0}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={handleNextStep}
          disabled={currentStep === steps.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ArrayModule;
