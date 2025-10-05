// src/pages/ChallengeDetailPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, SkipForward, RefreshCcw, ChevronRight } from 'react-feather';

const ChallengeDetailPage = () => {
  // Example state for visualizer array & target - you can replace with dynamic data or props
  const [array] = useState([2, 7, 11, 15]);
  const [target] = useState(9);

  return (
    <div className="bg-gray-50 font-sans min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <i className="text-indigo-600 h-6 w-6" />
                <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  ArrayVisualizer
                </span>
              </div>
            </div>
            <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
              <Link to="/" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium">Home</Link>
              <Link to="/challenges" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium">Challenges</Link>
              <Link to="/visualizer" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium">Visualizer</Link>
              <Link to="/learn" className="text-gray-500 hover:text-gray-700 inline-flex items-center px-1 pt-1 text-sm font-medium">Learn</Link>
            </div>
            <div className="flex items-center">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Column - Problem Statement */}
          <section className="lg:col-span-2">
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Two Sum Problem</h1>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Medium</span>
              </div>
              <article className="prose max-w-none text-gray-700">
                <h3>Problem Statement</h3>
                <p>
                  Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.
                </p>
                <p>
                  You may assume that each input would have exactly one solution, and you may not use the same element twice.
                </p>
                <p>
                  You can return the answer in any order.
                </p>

                <h3>Examples</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">Input:</p>
                    <p className="font-mono text-sm">nums = [2,7,11,15], target = 9</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Output:</p>
                    <p className="font-mono text-sm">[0,1]</p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">Input:</p>
                    <p className="font-mono text-sm">nums = [3,2,4], target = 6</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Output:</p>
                    <p className="font-mono text-sm">[1,2]</p>
                  </div>
                </div>

                <h3>Constraints</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><code>2 ≤ nums.length ≤ 10<sup>4</sup></code></li>
                  <li><code>-10<sup>9</sup> ≤ nums[i] ≤ 10<sup>9</sup></code></li>
                  <li><code>-10<sup>9</sup> ≤ target ≤ 10<sup>9</sup></code></li>
                  <li>Only one valid answer exists.</li>
                </ul>

                <h3>Concept Explanation</h3>
                <p>
                  The Two Sum problem is a classic algorithmic challenge testing arrays and hash tables understanding. The goal is to find two numbers that add up to a specific target.
                </p>
                <p>Two main approaches:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li><strong>Brute Force:</strong> Check every possible pair, O(n^2) time.</li>
                  <li><strong>Hash Table:</strong> Store elements in a hash table during iteration, check complements in O(1), total O(n) time.</li>
                </ol>
              </article>
            </div>

            {/* Visualizer */}
            <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Interactive Visualizer</h2>
              <div className="mb-6">
                <div className="flex justify-center space-x-2 mb-6">
                  {array.map((num, idx) => (
                    <div key={idx} className="array-cell bg-indigo-100 text-indigo-800 w-12 h-12 rounded flex items-center justify-center font-medium">
                      {num}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-100 px-4 py-2 rounded-lg">
                    <span className="font-medium">Target:</span>
                    <span className="ml-2 font-mono">{target}</span>
                  </div>
                </div>
                <div className="flex justify-center space-x-4">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 flex items-center">
                    <Play className="w-4 h-4 mr-1" />
                    Start
                  </button>
                  <button className="bg-white hover:bg-gray-50 text-indigo-600 px-4 py-2 rounded-md text-sm font-medium border border-indigo-600 transition duration-300 flex items-center">
                    <SkipForward className="w-4 h-4 mr-1" />
                    Next Step
                  </button>
                  <button className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md text-sm font-medium border border-gray-300 transition duration-300 flex items-center">
                    <RefreshCcw className="w-4 h-4 mr-1" />
                    Reset
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
                  <span className="text-sm font-medium">Current Step: Checking element at index 0 (value: 2)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Looking for complement: 7 (9 - 2)</span>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column - Code Editor */}
          <aside className="lg:col-span-1">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button className="w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm tab-active">
                    Solution
                  </button>
                  <button className="w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                    Test Cases
                  </button>
                </nav>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md" defaultValue="JavaScript">
                    <option>JavaScript</option>
                    <option>Python</option>
                    <option>Java</option>
                    <option>C++</option>
                  </select>
                </div>
                <div className="code-editor p-4 rounded-lg mb-4 font-mono bg-gray-900 text-white">
                  <pre className="text-sm">
                    {`function twoSum(nums, target) {
  const numMap = {};
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (numMap[complement] !== undefined) {
      return [numMap[complement], i];
    }
    
    numMap[nums[i]] = i;
  }
  
  return [];
}`}
                  </pre>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Complexity Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                      <span className="text-sm">Time Complexity: O(n)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Space Complexity: O(n)</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">
                    Run Code
                  </button>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">
                    Submit Solution
                  </button>
                </div>
              </div>
            </div>

            {/* Related Challenges */}
            <div className="bg-white shadow-sm rounded-lg p-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Related Challenges</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="#" className="flex items-center text-indigo-600 hover:text-indigo-800">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Three Sum
                  </Link>
                </li>
                <li>
                  <Link to="#" className="flex items-center text-indigo-600 hover:text-indigo-800">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Four Sum
                  </Link>
                </li>
                <li>
                  <Link to="#" className="flex items-center text-indigo-600 hover:text-indigo-800">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Subarray Sum Equals K
                  </Link>
                </li>
                <li>
                  <Link to="#" className="flex items-center text-indigo-600 hover:text-indigo-800">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Two Sum II - Sorted Array
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-300 hover:text-white">Features</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white">Pricing</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white">Challenges</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-300 hover:text-white">Documentation</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white">Tutorials</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="#" className="text-gray-300 hover:text-white">About</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white">Careers</Link></li>
                <li><Link to="#" className="text-gray-300 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">Connect</h3>
              <div className="flex space-x-4">
                <Link to="#" className="text-gray-400 hover:text-white">
                  <i data-feather="github" className="w-5 h-5"></i>
                </Link>
                <Link to="#" className="text-gray-400 hover:text-white">
                  <i data-feather="twitter" className="w-5 h-5"></i>
                </Link>
                <Link to="#" className="text-gray-400 hover:text-white">
                  <i data-feather="linkedin" className="w-5 h-5"></i>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2023 ArrayVisualizer. All rights reserved.</p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
              <Link to="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChallengeDetailPage;
