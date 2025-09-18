const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
require('dotenv').config();

const sampleChallenges = [
  {
    title: 'Binary Tree Structure',
    prompt: 'Draw the structure for a binary tree with 3 levels',
    description: 'Create a visual representation of a binary tree data structure. Show the root node, left and right children, and demonstrate the hierarchical relationship between nodes.',
    category: 'trees',
    difficulty: 'beginner',
    tags: ['binary-tree', 'data-structure', 'visualization'],
    points: 10,
    timeLimit: 15
  },
  {
    title: 'Linked List Traversal',
    prompt: 'Visualize a singly linked list with 5 nodes and show the traversal process',
    description: 'Draw a singly linked list containing 5 nodes with values 1, 2, 3, 4, 5. Show how the traversal works by connecting nodes with arrows and highlighting the current position during iteration.',
    category: 'data-structures',
    difficulty: 'beginner',
    tags: ['linked-list', 'traversal', 'pointers'],
    points: 15,
    timeLimit: 20
  },
  {
    title: 'Bubble Sort Animation',
    prompt: 'Create a step-by-step visualization of bubble sort algorithm',
    description: 'Show the bubble sort algorithm in action with an array of 6 elements. Illustrate each pass, highlighting the elements being compared and showing how larger elements "bubble up" to their correct positions.',
    category: 'sorting',
    difficulty: 'beginner',
    tags: ['bubble-sort', 'algorithm', 'comparison'],
    points: 20,
    timeLimit: 25
  },
  {
    title: 'Graph DFS Traversal',
    prompt: 'Draw a graph and show the Depth-First Search traversal path',
    description: 'Create an undirected graph with 6 vertices and show the DFS traversal. Use different colors to indicate visited nodes and the current path being explored.',
    category: 'graphs',
    difficulty: 'intermediate',
    tags: ['graph', 'dfs', 'traversal', 'recursion'],
    points: 25,
    timeLimit: 30
  },
  {
    title: 'Stack Operations',
    prompt: 'Visualize stack operations: push, pop, and peek',
    description: 'Show a stack data structure and demonstrate the three main operations: push (adding elements), pop (removing elements), and peek (viewing the top element). Use a visual representation that clearly shows the LIFO principle.',
    category: 'data-structures',
    difficulty: 'beginner',
    tags: ['stack', 'lifo', 'operations'],
    points: 15,
    timeLimit: 15
  },
  {
    title: 'Binary Search Process',
    prompt: 'Illustrate binary search algorithm on a sorted array',
    description: 'Show binary search working on a sorted array of 8 elements. Highlight the middle element in each step, show the search space reduction, and demonstrate how the algorithm narrows down to find the target value.',
    category: 'searching',
    difficulty: 'intermediate',
    tags: ['binary-search', 'algorithm', 'divide-conquer'],
    points: 25,
    timeLimit: 20
  },
  {
    title: 'Queue Implementation',
    prompt: 'Draw a circular queue with enqueue and dequeue operations',
    description: 'Create a visual representation of a circular queue with 6 slots. Show how elements are added (enqueue) and removed (dequeue) in a circular manner, maintaining the FIFO principle.',
    category: 'data-structures',
    difficulty: 'intermediate',
    tags: ['queue', 'circular', 'fifo', 'operations'],
    points: 20,
    timeLimit: 25
  },
  {
    title: 'Merge Sort Visualization',
    prompt: 'Show the divide-and-conquer process of merge sort',
    description: 'Illustrate the merge sort algorithm step by step. Show how the array is divided into smaller subarrays, then merged back together in sorted order. Use different colors to distinguish the divide and merge phases.',
    category: 'sorting',
    difficulty: 'intermediate',
    tags: ['merge-sort', 'divide-conquer', 'recursion'],
    points: 30,
    timeLimit: 35
  },
  {
    title: 'Hash Table Collision',
    prompt: 'Draw a hash table showing collision resolution using chaining',
    description: 'Create a hash table with 5 buckets and show how collisions are handled using chaining (linked lists). Demonstrate inserting multiple elements that hash to the same bucket.',
    category: 'data-structures',
    difficulty: 'intermediate',
    tags: ['hash-table', 'collision', 'chaining'],
    points: 25,
    timeLimit: 25
  },
  {
    title: 'Dynamic Programming - Fibonacci',
    prompt: 'Visualize the dynamic programming approach to calculating Fibonacci numbers',
    description: 'Show the dynamic programming solution for Fibonacci sequence. Illustrate the memoization table, how previously calculated values are reused, and the bottom-up approach to avoid redundant calculations.',
    category: 'dynamic-programming',
    difficulty: 'intermediate',
    tags: ['dynamic-programming', 'fibonacci', 'memoization'],
    points: 30,
    timeLimit: 30
  },
  {
    title: 'AVL Tree Rotation',
    prompt: 'Draw an AVL tree and show the rotation process to maintain balance',
    description: 'Create an AVL tree and demonstrate a rotation operation to maintain the height balance property. Show the tree before and after rotation, highlighting the nodes involved in the rotation.',
    category: 'trees',
    difficulty: 'advanced',
    tags: ['avl-tree', 'rotation', 'self-balancing'],
    points: 40,
    timeLimit: 40
  },
  {
    title: 'Dijkstra\'s Algorithm',
    prompt: 'Visualize Dijkstra\'s shortest path algorithm on a weighted graph',
    description: 'Show Dijkstra\'s algorithm finding the shortest path from a source vertex to all other vertices in a weighted graph. Use different colors to show visited nodes, current distances, and the final shortest paths.',
    category: 'algorithms',
    difficulty: 'advanced',
    tags: ['dijkstra', 'shortest-path', 'weighted-graph'],
    points: 45,
    timeLimit: 45
  },
  {
    title: 'String Matching - KMP',
    prompt: 'Illustrate the Knuth-Morris-Pratt string matching algorithm',
    description: 'Show the KMP algorithm in action, matching a pattern string within a text string. Demonstrate the failure function construction and how it helps avoid unnecessary comparisons.',
    category: 'strings',
    difficulty: 'advanced',
    tags: ['kmp', 'string-matching', 'pattern'],
    points: 40,
    timeLimit: 35
  },
  {
    title: 'Heap Data Structure',
    prompt: 'Draw a max heap and show heapify operations',
    description: 'Create a max heap with 7 elements and demonstrate the heapify operation. Show how the heap property is maintained when inserting new elements or extracting the maximum value.',
    category: 'data-structures',
    difficulty: 'intermediate',
    tags: ['heap', 'max-heap', 'heapify'],
    points: 30,
    timeLimit: 30
  },
  {
    title: 'Quick Sort Partition',
    prompt: 'Show the partition process in quick sort algorithm',
    description: 'Illustrate the partition step of quick sort algorithm. Show how a pivot element is chosen and how the array is partitioned around it, with elements smaller than pivot on the left and larger on the right.',
    category: 'sorting',
    difficulty: 'intermediate',
    tags: ['quick-sort', 'partition', 'pivot'],
    points: 35,
    timeLimit: 30
  }
];

const seedChallenges = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing challenges
    await Challenge.deleteMany({});
    console.log('🗑️  Cleared existing challenges');

    // Insert sample challenges
    const challenges = await Challenge.insertMany(sampleChallenges);
    console.log(`✅ Inserted ${challenges.length} challenges`);

    // Display summary
    console.log('\n📊 Challenge Summary:');
    const difficultyCounts = {};
    const categoryCounts = {};
    
    challenges.forEach(challenge => {
      difficultyCounts[challenge.difficulty] = (difficultyCounts[challenge.difficulty] || 0) + 1;
      categoryCounts[challenge.category] = (categoryCounts[challenge.category] || 0) + 1;
    });

    console.log('\nBy Difficulty:');
    Object.entries(difficultyCounts).forEach(([difficulty, count]) => {
      console.log(`  ${difficulty}: ${count} challenges`);
    });

    console.log('\nBy Category:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} challenges`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
seedChallenges();
