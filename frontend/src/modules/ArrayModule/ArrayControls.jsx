import React, { useState } from 'react';

const ArrayControls = ({ 
  onInsert, 
  onDelete, 
  onSearch, 
  onReverse, 
  onUpdate, 
  onSplit,
  onSort
}) => {
  const [value, setValue] = useState('');
  const [index, setIndex] = useState('');
  const [startIndex, setStartIndex] = useState('');
  const [endIndex, setEndIndex] = useState('');
  const [updateIndex, setUpdateIndex] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4 text-gray-700">
      
      {/* Insert / Delete / Search */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="number"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border border-gray-300 px-2 py-1 rounded-md w-24"
        />
        <input
          type="number"
          placeholder="Index (optional)"
          value={index}
          onChange={(e) => setIndex(e.target.value)}
          className="border border-gray-300 px-2 py-1 rounded-md w-28"
        />
        <button
          onClick={() => { onInsert(Number(value), index !== '' ? Number(index) : undefined); setValue(''); setIndex(''); }}
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Insert
        </button>
        <button
          onClick={() => { onDelete(index !== '' ? Number(index) : undefined); setIndex(''); }}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
        <button
          onClick={() => { onSearch(Number(value)); setValue(''); }}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Update */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="number"
          placeholder="Index"
          value={updateIndex}
          onChange={(e) => setUpdateIndex(e.target.value)}
          className="border border-gray-300 px-2 py-1 rounded-md w-24"
        />
        <input
          type="number"
          placeholder="New Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border border-gray-300 px-2 py-1 rounded-md w-24"
        />
        <button
          onClick={() => { onUpdate(Number(updateIndex), Number(value)); setUpdateIndex(''); setValue(''); }}
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
        >
          Update
        </button>
      </div>

      {/* Split */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="number"
          placeholder="Start Index"
          value={startIndex}
          onChange={(e) => setStartIndex(e.target.value)}
          className="border border-gray-300 px-2 py-1 rounded-md w-24"
        />
        <input
          type="number"
          placeholder="End Index"
          value={endIndex}
          onChange={(e) => setEndIndex(e.target.value)}
          className="border border-gray-300 px-2 py-1 rounded-md w-24"
        />
        <button
          onClick={() => { onSplit(Number(startIndex), Number(endIndex)); setStartIndex(''); setEndIndex(''); }}
          className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
        >
          Split
        </button>
      </div>

      {/* Reverse / Sort */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={onReverse}
          className="px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
        >
          Reverse
        </button>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border border-gray-300 px-2 py-1 rounded-md"
        >
          <option value="asc">Sort Asc</option>
          <option value="desc">Sort Desc</option>
        </select>
        <button
          onClick={() => onSort(sortOrder === 'asc')}
          className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Sort
        </button>
      </div>

    </div>
  );
};

export default ArrayControls;
