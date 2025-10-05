import React, { useState } from "react";
import "./ArrayFlashcards.css"; // optional flip animation

// Flashcards data with code snippets
const flashcardsData = [
  {
    id: 1,
    front: "What is an Array?",
    back: {
      explanation: "An array is a collection of elements stored in contiguous memory locations.",
      code: "let arr = [10, 20, 30];"
    }
  },
  {
    id: 2,
    front: "Array Traversal",
    back: {
      explanation: "Visiting each element of an array one by one.",
      code: "for (let i = 0; i < arr.length; i++) {\n  console.log(arr[i]);\n}"
    }
  },
  {
    id: 3,
    front: "Array Insertion",
    back: {
      explanation: "Adding an element at a specific index using splice.",
      code: "arr.splice(2, 0, 50); // Insert 50 at index 2"
    }
  },
  {
    id: 4,
    front: "Array Deletion",
    back: {
      explanation: "Removing an element from a specific index.",
      code: "arr.splice(1, 1); // Deletes element at index 1"
    }
  },
  {
    id: 5,
    front: "Array Searching",
    back: {
      explanation: "Finding the position of a value in the array.",
      code: "let index = arr.indexOf(30);\nconsole.log(index);"
    }
  },
  {
    id: 6,
    front: "Array Updating",
    back: {
      explanation: "Changing an existing value at a given index.",
      code: "arr[2] = 100; // Update element at index 2"
    }
  },
  {
    id: 7,
    front: "Array Reversing",
    back: {
      explanation: "Reversing the order of elements in an array.",
      code: "arr.reverse();"
    }
  },
  {
    id: 8,
    front: "Array Splitting",
    back: {
      explanation: "Extracting a portion of an array.",
      code: "let part = arr.slice(0, 2); // First 2 elements"
    }
  },
  {
    id: 9,
    front: "Array Concatenation",
    back: {
      explanation: "Joining two arrays together.",
      code: "let arr3 = arr1.concat(arr2);"
    }
  },
  {
    id: 10,
    front: "Array Rotation",
    back: {
      explanation: "Shifting array elements left or right.",
      code: "arr.unshift(arr.pop()); // Rotate right by 1"
    }
  },
  {
    id: 11,
    front: "Array Sorting",
    back: {
      explanation: "Arranging array elements in ascending order.",
      code: "arr.sort((a, b) => a - b);"
    }
  },
  {
    id: 12,
    front: "Multi-dimensional Arrays",
    back: {
      explanation: "An array of arrays, useful for matrices.",
      code: "let matrix = [[1,2,3],[4,5,6]];\nconsole.log(matrix[1][2]); // 6"
    }
  }
];

const ArrayFlashcards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => setFlipped(!flipped);

  const nextCard = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcardsData.length);
  };

  const prevCard = () => {
    setFlipped(false);
    setCurrentIndex((prev) =>
      prev === 0 ? flashcardsData.length - 1 : prev - 1
    );
  };

  const card = flashcardsData[currentIndex];

  return (
    <div className="flashcards-container">
      <h2 className="title">Learn Array Concepts</h2>

      <div
        className={`flashcard ${flipped ? "flipped" : ""}`}
        onClick={handleFlip}
      >
        {/* Front side */}
        <div className="front">
          <h3>{card.front}</h3>
          <p className="note">(Click to flip and see explanation)</p>
        </div>

        {/* Back side */}
        <div className="back">
          <h3>{card.front} - Explanation</h3>
          <p>{card.back.explanation}</p>
          <pre>
            <code>{card.back.code}</code>
          </pre>
        </div>
      </div>

      <div className="navigation">
        <button onClick={prevCard}>⬅ Previous</button>
        <span>
          {currentIndex + 1} / {flashcardsData.length}
        </span>
        <button onClick={nextCard}>Next ➡</button>
      </div>
    </div>
  );
};

export default ArrayFlashcards;