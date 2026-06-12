import { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiCheckCircle,
  FiExternalLink,
  FiStar,
  FiAward,
  FiThumbsUp,
  FiFilter,
  FiGrid,
  FiList,
  FiTrendingUp
} from 'react-icons/fi';

interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  companies: string[];
  solved: boolean;
  leetcodeUrl: string;
}

// 150 Curated LeetCode Problems (Most asked in placements)
const allProblems: Problem[] = [
  // ============ ARRAYS (25 problems) ============
  { id: 1, title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays', companies: ['Google', 'Amazon', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/two-sum/' },
  { id: 2, title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', topic: 'Arrays', companies: ['Amazon', 'Microsoft', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
  { id: 3, title: 'Contains Duplicate', difficulty: 'Easy', topic: 'Arrays', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/' },
  { id: 4, title: 'Maximum Subarray', difficulty: 'Medium', topic: 'Arrays', companies: ['Google', 'Amazon', 'Microsoft'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/' },
  { id: 5, title: 'Product of Array Except Self', difficulty: 'Medium', topic: 'Arrays', companies: ['Amazon', 'Google', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/' },
  { id: 6, title: 'Container With Most Water', difficulty: 'Medium', topic: 'Arrays', companies: ['Google', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/' },
  { id: 7, title: '3Sum', difficulty: 'Medium', topic: 'Arrays', companies: ['Google', 'Amazon', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/3sum/' },
  { id: 8, title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', topic: 'Arrays', companies: ['Microsoft', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
  { id: 9, title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Arrays', companies: ['Google', 'Amazon', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/trapping-rain-water/' },
  { id: 10, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topic: 'Arrays', companies: ['Google', 'Amazon', 'Microsoft'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
  { id: 11, title: 'Merge Intervals', difficulty: 'Medium', topic: 'Arrays', companies: ['Google', 'Amazon', 'Microsoft'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/merge-intervals/' },
  { id: 12, title: 'Next Permutation', difficulty: 'Medium', topic: 'Arrays', companies: ['Google', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/next-permutation/' },
  { id: 13, title: 'Spiral Matrix', difficulty: 'Medium', topic: 'Arrays', companies: ['Google', 'Amazon', 'Microsoft'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/spiral-matrix/' },
  { id: 14, title: 'Rotate Image', difficulty: 'Medium', topic: 'Arrays', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/rotate-image/' },
  { id: 15, title: 'Set Matrix Zeroes', difficulty: 'Medium', topic: 'Arrays', companies: ['Amazon', 'Microsoft'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/set-matrix-zeroes/' },
  { id: 16, title: 'Subarray Sum Equals K', difficulty: 'Medium', topic: 'Arrays', companies: ['Google', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
  { id: 17, title: 'Longest Consecutive Sequence', difficulty: 'Medium', topic: 'Arrays', companies: ['Google', 'Amazon', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
  { id: 18, title: 'Jump Game', difficulty: 'Medium', topic: 'Arrays', companies: ['Google', 'Amazon', 'Microsoft'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/jump-game/' },
  { id: 19, title: 'Meeting Rooms II', difficulty: 'Medium', topic: 'Arrays', companies: ['Amazon', 'Google', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms-ii/' },
  { id: 20, title: 'Majority Element', difficulty: 'Easy', topic: 'Arrays', companies: ['Amazon', 'Google', 'Microsoft'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/majority-element/' },
  { id: 21, title: 'Move Zeroes', difficulty: 'Easy', topic: 'Arrays', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/move-zeroes/' },
  { id: 22, title: 'Plus One', difficulty: 'Easy', topic: 'Arrays', companies: ['Google', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/plus-one/' },
  { id: 23, title: 'Sort Colors', difficulty: 'Medium', topic: 'Arrays', companies: ['Amazon', 'Google', 'Microsoft'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/sort-colors/' },
  { id: 24, title: 'Find All Duplicates in Array', difficulty: 'Medium', topic: 'Arrays', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/find-all-duplicates-in-an-array/' },
  { id: 25, title: 'Max Chunks To Make Sorted', difficulty: 'Medium', topic: 'Arrays', companies: ['Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/max-chunks-to-make-sorted/' },

  // ============ STRINGS (20 problems) ============
  { id: 26, title: 'Valid Anagram', difficulty: 'Easy', topic: 'Strings', companies: ['Google', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/' },
  { id: 27, title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Strings', companies: ['Amazon', 'Google', 'Microsoft'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/' },
  { id: 28, title: 'Longest Substring Without Repeating', difficulty: 'Medium', topic: 'Strings', companies: ['Google', 'Amazon', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
  { id: 29, title: 'Longest Palindromic Substring', difficulty: 'Medium', topic: 'Strings', companies: ['Google', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/' },
  { id: 30, title: 'Group Anagrams', difficulty: 'Medium', topic: 'Strings', companies: ['Google', 'Amazon', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/group-anagrams/' },
  { id: 31, title: 'Valid Palindrome', difficulty: 'Easy', topic: 'Strings', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/' },
  { id: 32, title: 'String to Integer (atoi)', difficulty: 'Medium', topic: 'Strings', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/string-to-integer-atoi/' },
  { id: 33, title: 'Implement strStr()', difficulty: 'Easy', topic: 'Strings', companies: ['Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/implement-strstr/' },
  { id: 34, title: 'Reverse Words in a String', difficulty: 'Medium', topic: 'Strings', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/reverse-words-in-a-string/' },
  { id: 35, title: 'Simplify Path', difficulty: 'Medium', topic: 'Strings', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/simplify-path/' },
  { id: 36, title: 'Compare Version Numbers', difficulty: 'Medium', topic: 'Strings', companies: ['Amazon', 'Microsoft'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/compare-version-numbers/' },
  { id: 37, title: 'Zigzag Conversion', difficulty: 'Medium', topic: 'Strings', companies: ['Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/zigzag-conversion/' },
  { id: 38, title: 'Multiply Strings', difficulty: 'Medium', topic: 'Strings', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/multiply-strings/' },
  { id: 39, title: 'Integer to Roman', difficulty: 'Medium', topic: 'Strings', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/integer-to-roman/' },
  { id: 40, title: 'Roman to Integer', difficulty: 'Easy', topic: 'Strings', companies: ['Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/roman-to-integer/' },
  { id: 41, title: 'Length of Last Word', difficulty: 'Easy', topic: 'Strings', companies: ['Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/length-of-last-word/' },
  { id: 42, title: 'Isomorphic Strings', difficulty: 'Easy', topic: 'Strings', companies: ['Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/isomorphic-strings/' },
  { id: 43, title: 'Word Pattern', difficulty: 'Easy', topic: 'Strings', companies: ['Google', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/word-pattern/' },
  { id: 44, title: 'Repeated Substring Pattern', difficulty: 'Easy', topic: 'Strings', companies: ['Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/repeated-substring-pattern/' },
  { id: 45, title: 'Count and Say', difficulty: 'Medium', topic: 'Strings', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/count-and-say/' },

  // ============ LINKED LIST (15 problems) ============
  { id: 46, title: 'Reverse Linked List', difficulty: 'Easy', topic: 'Linked List', companies: ['Google', 'Amazon', 'Microsoft'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/' },
  { id: 47, title: 'Merge Two Sorted Lists', difficulty: 'Easy', topic: 'Linked List', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
  { id: 48, title: 'Linked List Cycle', difficulty: 'Easy', topic: 'Linked List', companies: ['Amazon', 'Google', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/' },
  { id: 49, title: 'Intersection of Two Linked Lists', difficulty: 'Easy', topic: 'Linked List', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/intersection-of-two-linked-lists/' },
  { id: 50, title: 'Remove Nth Node From End', difficulty: 'Medium', topic: 'Linked List', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
  { id: 51, title: 'Palindrome Linked List', difficulty: 'Easy', topic: 'Linked List', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/palindrome-linked-list/' },
  { id: 52, title: 'Add Two Numbers', difficulty: 'Medium', topic: 'Linked List', companies: ['Amazon', 'Google', 'Microsoft'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/add-two-numbers/' },
  { id: 53, title: 'Copy List with Random Pointer', difficulty: 'Medium', topic: 'Linked List', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
  { id: 54, title: 'Reorder List', difficulty: 'Medium', topic: 'Linked List', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/reorder-list/' },
  { id: 55, title: 'Rotate List', difficulty: 'Medium', topic: 'Linked List', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/rotate-list/' },
  { id: 56, title: 'Reverse Nodes in k-Group', difficulty: 'Hard', topic: 'Linked List', companies: ['Google', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/reverse-nodes-in-k-group/' },
  { id: 57, title: 'Merge k Sorted Lists', difficulty: 'Hard', topic: 'Linked List', companies: ['Google', 'Amazon', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
  { id: 58, title: 'Sort List', difficulty: 'Medium', topic: 'Linked List', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/sort-list/' },
  { id: 59, title: 'Middle of Linked List', difficulty: 'Easy', topic: 'Linked List', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/middle-of-the-linked-list/' },
  { id: 60, title: 'Delete Node in Linked List', difficulty: 'Medium', topic: 'Linked List', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/delete-node-in-a-linked-list/' },

  // ============ TREES (20 problems) ============
  { id: 61, title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', topic: 'Trees', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
  { id: 62, title: 'Invert Binary Tree', difficulty: 'Easy', topic: 'Trees', companies: ['Google', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/' },
  { id: 63, title: 'Same Tree', difficulty: 'Easy', topic: 'Trees', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/same-tree/' },
  { id: 64, title: 'Binary Tree Inorder Traversal', difficulty: 'Easy', topic: 'Trees', companies: ['Amazon', 'Google', 'Microsoft'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/binary-tree-inorder-traversal/' },
  { id: 65, title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', topic: 'Trees', companies: ['Amazon', 'Google', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
  { id: 66, title: 'Validate Binary Search Tree', difficulty: 'Medium', topic: 'Trees', companies: ['Amazon', 'Google', 'Microsoft'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/' },
  { id: 67, title: 'Lowest Common Ancestor of BST', difficulty: 'Medium', topic: 'Trees', companies: ['Amazon', 'Google', 'Microsoft'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
  { id: 68, title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', topic: 'Trees', companies: ['Google', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
  { id: 69, title: 'Construct Binary Tree from Preorder and Inorder', difficulty: 'Medium', topic: 'Trees', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
  { id: 70, title: 'Subtree of Another Tree', difficulty: 'Easy', topic: 'Trees', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/subtree-of-another-tree/' },
  { id: 71, title: 'Diameter of Binary Tree', difficulty: 'Easy', topic: 'Trees', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/diameter-of-binary-tree/' },
  { id: 72, title: 'Balanced Binary Tree', difficulty: 'Easy', topic: 'Trees', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/balanced-binary-tree/' },
  { id: 73, title: 'Binary Tree Right Side View', difficulty: 'Medium', topic: 'Trees', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/binary-tree-right-side-view/' },
  { id: 74, title: 'Kth Smallest Element in BST', difficulty: 'Medium', topic: 'Trees', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
  { id: 75, title: 'Flatten Binary Tree to Linked List', difficulty: 'Medium', topic: 'Trees', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/' },
  { id: 76, title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', topic: 'Trees', companies: ['Google', 'Amazon', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
  { id: 77, title: 'Path Sum', difficulty: 'Easy', topic: 'Trees', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/path-sum/' },
  { id: 78, title: 'Path Sum II', difficulty: 'Medium', topic: 'Trees', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/path-sum-ii/' },
  { id: 79, title: 'Sum Root to Leaf Numbers', difficulty: 'Medium', topic: 'Trees', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/sum-root-to-leaf-numbers/' },
  { id: 80, title: 'Binary Tree Zigzag Level Order', difficulty: 'Medium', topic: 'Trees', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/' },

  // ============ DYNAMIC PROGRAMMING (20 problems) ============
  { id: 81, title: 'Climbing Stairs', difficulty: 'Easy', topic: 'DP', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/' },
  { id: 82, title: 'House Robber', difficulty: 'Medium', topic: 'DP', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/house-robber/' },
  { id: 83, title: 'Coin Change', difficulty: 'Medium', topic: 'DP', companies: ['Amazon', 'Google', 'Microsoft'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/coin-change/' },
  { id: 84, title: 'Longest Increasing Subsequence', difficulty: 'Medium', topic: 'DP', companies: ['Amazon', 'Google', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
  { id: 85, title: 'Word Break', difficulty: 'Medium', topic: 'DP', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/word-break/' },
  { id: 86, title: 'Maximum Product Subarray', difficulty: 'Medium', topic: 'DP', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/maximum-product-subarray/' },
  { id: 87, title: 'Decode Ways', difficulty: 'Medium', topic: 'DP', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/decode-ways/' },
  { id: 88, title: 'Unique Paths', difficulty: 'Medium', topic: 'DP', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/unique-paths/' },
  { id: 89, title: 'Jump Game II', difficulty: 'Medium', topic: 'DP', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/jump-game-ii/' },
  { id: 90, title: 'Partition Equal Subset Sum', difficulty: 'Medium', topic: 'DP', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/partition-equal-subset-sum/' },
  { id: 91, title: 'Minimum Path Sum', difficulty: 'Medium', topic: 'DP', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/minimum-path-sum/' },
  { id: 92, title: 'Palindromic Substrings', difficulty: 'Medium', topic: 'DP', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/palindromic-substrings/' },
  { id: 93, title: 'Combination Sum IV', difficulty: 'Medium', topic: 'DP', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/combination-sum-iv/' },
  { id: 94, title: 'Target Sum', difficulty: 'Medium', topic: 'DP', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/target-sum/' },
  { id: 95, title: 'Perfect Squares', difficulty: 'Medium', topic: 'DP', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/perfect-squares/' },
  { id: 96, title: 'Best Time to Buy and Sell Stock IV', difficulty: 'Hard', topic: 'DP', companies: ['Google', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/' },
  { id: 97, title: 'Edit Distance', difficulty: 'Hard', topic: 'DP', companies: ['Google', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/edit-distance/' },
  { id: 98, title: 'Regular Expression Matching', difficulty: 'Hard', topic: 'DP', companies: ['Google', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/regular-expression-matching/' },
  { id: 99, title: 'Wildcard Matching', difficulty: 'Hard', topic: 'DP', companies: ['Google', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/wildcard-matching/' },
  { id: 100, title: 'Interleaving String', difficulty: 'Medium', topic: 'DP', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/interleaving-string/' },

  // ============ GRAPHS (15 problems) ============
  { id: 101, title: 'Number of Islands', difficulty: 'Medium', topic: 'Graphs', companies: ['Amazon', 'Google', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/number-of-islands/' },
  { id: 102, title: 'Clone Graph', difficulty: 'Medium', topic: 'Graphs', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/clone-graph/' },
  { id: 103, title: 'Course Schedule', difficulty: 'Medium', topic: 'Graphs', companies: ['Amazon', 'Google', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/course-schedule/' },
  { id: 104, title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', topic: 'Graphs', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
  { id: 105, title: 'Surrounded Regions', difficulty: 'Medium', topic: 'Graphs', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/surrounded-regions/' },
  { id: 106, title: 'Word Ladder', difficulty: 'Hard', topic: 'Graphs', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/word-ladder/' },
  { id: 107, title: 'Alien Dictionary', difficulty: 'Hard', topic: 'Graphs', companies: ['Google', 'Amazon', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/alien-dictionary/' },
  { id: 108, title: 'Graph Valid Tree', difficulty: 'Medium', topic: 'Graphs', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/graph-valid-tree/' },
  { id: 109, title: 'Find if Path Exists in Graph', difficulty: 'Easy', topic: 'Graphs', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/find-if-path-exists-in-graph/' },
  { id: 110, title: 'Minimum Height Trees', difficulty: 'Medium', topic: 'Graphs', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/minimum-height-trees/' },
  { id: 111, title: 'All Paths From Source to Target', difficulty: 'Medium', topic: 'Graphs', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/all-paths-from-source-to-target/' },
  { id: 112, title: 'Reconstruct Itinerary', difficulty: 'Hard', topic: 'Graphs', companies: ['Google', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/reconstruct-itinerary/' },
  { id: 113, title: 'Cheapest Flights Within K Stops', difficulty: 'Medium', topic: 'Graphs', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/' },
  { id: 114, title: 'Network Delay Time', difficulty: 'Medium', topic: 'Graphs', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/network-delay-time/' },
  { id: 115, title: 'Evaluate Division', difficulty: 'Medium', topic: 'Graphs', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/evaluate-division/' },

  // ============ HEAP (10 problems) ============
  { id: 116, title: 'Top K Frequent Elements', difficulty: 'Medium', topic: 'Heap', companies: ['Amazon', 'Google', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/top-k-frequent-elements/' },
  { id: 117, title: 'K Closest Points to Origin', difficulty: 'Medium', topic: 'Heap', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/k-closest-points-to-origin/' },
  { id: 118, title: 'Merge K Sorted Lists', difficulty: 'Hard', topic: 'Heap', companies: ['Google', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
  { id: 119, title: 'Find Median from Data Stream', difficulty: 'Hard', topic: 'Heap', companies: ['Google', 'Amazon', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/find-median-from-data-stream/' },
  { id: 120, title: 'Task Scheduler', difficulty: 'Medium', topic: 'Heap', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/task-scheduler/' },
  { id: 121, title: 'Reorganize String', difficulty: 'Medium', topic: 'Heap', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/reorganize-string/' },
  { id: 122, title: 'Kth Largest Element in Array', difficulty: 'Medium', topic: 'Heap', companies: ['Amazon', 'Google', 'Microsoft'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/kth-largest-element-in-an-array/' },
  { id: 123, title: 'Last Stone Weight', difficulty: 'Easy', topic: 'Heap', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/last-stone-weight/' },
  { id: 124, title: 'Kth Smallest Element in Sorted Matrix', difficulty: 'Medium', topic: 'Heap', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/' },
  { id: 125, title: 'Meeting Rooms II', difficulty: 'Medium', topic: 'Heap', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/meeting-rooms-ii/' },

  // ============ BACKTRACKING (10 problems) ============
  { id: 126, title: 'Subsets', difficulty: 'Medium', topic: 'Backtracking', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/subsets/' },
  { id: 127, title: 'Combination Sum', difficulty: 'Medium', topic: 'Backtracking', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/combination-sum/' },
  { id: 128, title: 'Permutations', difficulty: 'Medium', topic: 'Backtracking', companies: ['Amazon', 'Google', 'Microsoft'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/permutations/' },
  { id: 129, title: 'Generate Parentheses', difficulty: 'Medium', topic: 'Backtracking', companies: ['Amazon', 'Google', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/generate-parentheses/' },
  { id: 130, title: 'Letter Combinations of Phone', difficulty: 'Medium', topic: 'Backtracking', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' },
  { id: 131, title: 'Word Search', difficulty: 'Medium', topic: 'Backtracking', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/word-search/' },
  { id: 132, title: 'N-Queens', difficulty: 'Hard', topic: 'Backtracking', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/n-queens/' },
  { id: 133, title: 'Palindrome Partitioning', difficulty: 'Medium', topic: 'Backtracking', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/palindrome-partitioning/' },
  { id: 134, title: 'Restore IP Addresses', difficulty: 'Medium', topic: 'Backtracking', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/restore-ip-addresses/' },
  { id: 135, title: 'Sudoku Solver', difficulty: 'Hard', topic: 'Backtracking', companies: ['Google', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/sudoku-solver/' },

  // ============ SLIDING WINDOW (10 problems) ============
  { id: 136, title: 'Sliding Window Maximum', difficulty: 'Hard', topic: 'Sliding Window', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/sliding-window-maximum/' },
  { id: 137, title: 'Minimum Window Substring', difficulty: 'Hard', topic: 'Sliding Window', companies: ['Google', 'Amazon', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/' },
  { id: 138, title: 'Longest Substring with K Distinct', difficulty: 'Medium', topic: 'Sliding Window', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/' },
  { id: 139, title: 'Fruit Into Baskets', difficulty: 'Medium', topic: 'Sliding Window', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/fruit-into-baskets/' },
  { id: 140, title: 'Longest Repeating Character Replacement', difficulty: 'Medium', topic: 'Sliding Window', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
  { id: 141, title: 'Max Consecutive Ones III', difficulty: 'Medium', topic: 'Sliding Window', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/max-consecutive-ones-iii/' },
  { id: 142, title: 'Permutation in String', difficulty: 'Medium', topic: 'Sliding Window', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/permutation-in-string/' },
  { id: 143, title: 'Find All Anagrams in String', difficulty: 'Medium', topic: 'Sliding Window', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/' },
  { id: 144, title: 'Subarrays with K Different Integers', difficulty: 'Hard', topic: 'Sliding Window', companies: ['Google', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/subarrays-with-k-different-integers/' },
  { id: 145, title: 'Count Number of Nice Subarrays', difficulty: 'Medium', topic: 'Sliding Window', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/count-number-of-nice-subarrays/' },

  // ============ SYSTEM DESIGN (5 problems) ============
  { id: 146, title: 'Design Twitter', difficulty: 'Medium', topic: 'Design', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/design-twitter/' },
  { id: 147, title: 'LRU Cache', difficulty: 'Medium', topic: 'Design', companies: ['Amazon', 'Google', 'Meta'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/lru-cache/' },
  { id: 148, title: 'Min Stack', difficulty: 'Easy', topic: 'Design', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/min-stack/' },
  { id: 149, title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', topic: 'Design', companies: ['Google', 'Amazon'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
  { id: 150, title: 'Design HashMap', difficulty: 'Easy', topic: 'Design', companies: ['Amazon', 'Google'], solved: false, leetcodeUrl: 'https://leetcode.com/problems/design-hashmap/' },
];

export default function Coding() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [solvedProblems, setSolvedProblems] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Get unique values for filters
  const topics = ['All', ...new Set(allProblems.map(p => p.topic))];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const companies = ['All', ...new Set(allProblems.flatMap(p => p.companies))].sort();

  // Load solved problems from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('coding_solved');
    if (saved) {
      setSolvedProblems(JSON.parse(saved));
    }
  }, []);

  // Save solved problems
  const saveSolvedProblems = (newSolved: number[]) => {
    setSolvedProblems(newSolved);
    localStorage.setItem('coding_solved', JSON.stringify(newSolved));
  };

  const markAsSolved = (problemId: number) => {
    if (!solvedProblems.includes(problemId)) {
      const newSolved = [...solvedProblems, problemId];
      saveSolvedProblems(newSolved);
    }
  };

  const openProblem = (url: string, problemId: number) => {
    window.open(url, '_blank');
    markAsSolved(problemId);
  };

  // Filter problems
  const filteredProblems = allProblems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
    const matchesTopic = selectedTopic === 'All' || problem.topic === selectedTopic;
    const matchesCompany = selectedCompany === 'All' || problem.companies.includes(selectedCompany);
    return matchesSearch && matchesDifficulty && matchesTopic && matchesCompany;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'Hard': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const getCompanyColor = (company: string) => {
    const colors: Record<string, string> = {
      'Google': 'bg-blue-500/10 text-blue-400',
      'Amazon': 'bg-orange-500/10 text-orange-400',
      'Microsoft': 'bg-green-500/10 text-green-400',
      'Meta': 'bg-purple-500/10 text-purple-400',
    };
    return colors[company] || 'bg-gray-500/10 text-gray-400';
  };

  const solvedCount = solvedProblems.length;
  const totalProblems = allProblems.length;
  const progress = (solvedCount / totalProblems) * 100;

  // Topic-wise progress
  const getTopicProgress = () => {
    const topicsMap: Record<string, { solved: number; total: number }> = {};
    allProblems.forEach(p => {
      if (!topicsMap[p.topic]) {
        topicsMap[p.topic] = { solved: 0, total: 0 };
      }
      topicsMap[p.topic].total++;
      if (solvedProblems.includes(p.id)) {
        topicsMap[p.topic].solved++;
      }
    });
    return topicsMap;
  };

  const topicProgress = getTopicProgress();

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Coding Practice
        </h1>
        <p className="text-white/60">150 curated LeetCode problems • Most frequently asked in placements</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/30 rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-white">Your Progress</h3>
          <span className="text-cyan-400 text-sm">{solvedCount}/{totalProblems} Solved</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
          <div><p className="text-2xl font-bold text-white">{solvedCount}</p><p className="text-xs text-gray-500">Solved</p></div>
          <div><p className="text-2xl font-bold text-white">{totalProblems - solvedCount}</p><p className="text-xs text-gray-500">Remaining</p></div>
          <div><p className="text-2xl font-bold text-cyan-400">{Math.round(progress)}%</p><p className="text-xs text-gray-500">Completion</p></div>
        </div>
      </div>

      {/* Topic-wise Progress Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
        {Object.entries(topicProgress).slice(0, 10).map(([topic, data]) => (
          <div key={topic} className="bg-gray-900/50 border border-gray-800 rounded-lg p-3">
            <p className="text-xs text-gray-500">{topic}</p>
            <p className="text-sm font-semibold text-white">{data.solved}/{data.total}</p>
            <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
              <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1 rounded-full" style={{ width: `${(data.solved / data.total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Search problems..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-900/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" />
          </div>
        </div>
        <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} className="px-3 py-2 rounded-xl bg-gray-900/50 border border-gray-700 focus:border-cyan-500 outline-none text-white text-sm">
          {topics.map(topic => <option key={topic} value={topic}>{topic}</option>)}
        </select>
        <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className="px-3 py-2 rounded-xl bg-gray-900/50 border border-gray-700 focus:border-cyan-500 outline-none text-white text-sm">
          {difficulties.map(diff => <option key={diff} value={diff}>{diff}</option>)}
        </select>
        <select value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)} className="px-3 py-2 rounded-xl bg-gray-900/50 border border-gray-700 focus:border-cyan-500 outline-none text-white text-sm">
          {companies.map(company => <option key={company} value={company}>{company}</option>)}
        </select>
        <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="px-3 py-2 rounded-xl bg-gray-800 text-gray-400 hover:text-white">
          {viewMode === 'grid' ? <FiList /> : <FiGrid />}
        </button>
      </div>

      {/* Problems Table */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr><th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">Status</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">Title</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">Topic</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">Difficulty</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">Companies</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-400">Action</th></tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem) => {
                const isSolved = solvedProblems.includes(problem.id);
                return (
                  <tr key={problem.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-3">{isSolved ? <FiCheckCircle className="text-green-400 text-lg" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-600" />}</td>
                    <td className="px-4 py-3"><span className="text-white text-sm">{problem.title}</span></td>
                    <td className="px-4 py-3"><span className="text-gray-400 text-xs">{problem.topic}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty}</span></td>
                    <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{problem.companies.slice(0, 2).map(c => <span key={c} className={`text-xs px-1.5 py-0.5 rounded ${getCompanyColor(c)}`}>{c}</span>)}</div></td>
                    <td className="px-4 py-3"><button onClick={() => openProblem(problem.leetcodeUrl, problem.id)} className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1">{isSolved ? 'Review' : 'Solve'} <FiExternalLink size={12} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Achievements */}
      <div className="mt-6 text-center text-xs text-gray-500">💡 Click "Solve" to open on LeetCode. Progress saved automatically! {solvedCount >= 50 && <span className="text-cyan-400 ml-2">🏆 50+ problems solved! Great job!</span>}</div>
    </div>
  );
}