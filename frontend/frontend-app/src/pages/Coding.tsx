import { useState } from 'react';
import { 
  FiCode, 
  FiSearch, 
  FiFilter, 
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiStar,
  FiExternalLink,
  FiBookOpen,
  FiBarChart2
} from 'react-icons/fi';

interface Problem {
  id: number;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
  solved: boolean;
  acceptance: number;
  submissions: number;
}

export default function Coding() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');
  
  const problems: Problem[] = [
    { id: 1, title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays', solved: true, acceptance: 85, submissions: 1250 },
    { id: 2, title: 'Reverse Linked List', difficulty: 'Easy', topic: 'Linked List', solved: true, acceptance: 78, submissions: 980 },
    { id: 3, title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stack', solved: false, acceptance: 82, submissions: 2100 },
    { id: 4, title: 'Merge Two Sorted Lists', difficulty: 'Easy', topic: 'Linked List', solved: false, acceptance: 75, submissions: 1450 },
    { id: 5, title: 'Maximum Subarray', difficulty: 'Medium', topic: 'Arrays', solved: false, acceptance: 68, submissions: 3200 },
    { id: 6, title: 'Container With Most Water', difficulty: 'Medium', topic: 'Arrays', solved: false, acceptance: 65, submissions: 1800 },
    { id: 7, title: 'Longest Substring Without Repeating', difficulty: 'Medium', topic: 'Strings', solved: false, acceptance: 62, submissions: 2800 },
    { id: 8, title: 'LRU Cache', difficulty: 'Hard', topic: 'Design', solved: false, acceptance: 45, submissions: 950 },
    { id: 9, title: 'Find Median from Data Stream', difficulty: 'Hard', topic: 'Heap', solved: false, acceptance: 48, submissions: 720 },
    { id: 10, title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Arrays', solved: false, acceptance: 52, submissions: 2100 },
    { id: 11, title: 'Climbing Stairs', difficulty: 'Easy', topic: 'DP', solved: false, acceptance: 80, submissions: 3100 },
    { id: 12, title: 'Coin Change', difficulty: 'Medium', topic: 'DP', solved: false, acceptance: 58, submissions: 1650 },
  ];

  const topics = ['All', 'Arrays', 'Strings', 'Linked List', 'Stack', 'DP', 'Heap', 'Design'];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  
  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || problem.difficulty === selectedDifficulty;
    const matchesTopic = selectedTopic === 'All' || problem.topic === selectedTopic;
    return matchesSearch && matchesDifficulty && matchesTopic;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/10';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10';
      case 'Hard': return 'text-red-400 bg-red-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const solvedCount = problems.filter(p => p.solved).length;
  const totalProblems = problems.length;
  const progress = (solvedCount / totalProblems) * 100;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Coding Practice
        </h1>
        <p className="text-white/60">Practice DSA problems and track your progress.</p>
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
          <div>
            <p className="text-2xl font-bold text-white">{solvedCount}</p>
            <p className="text-xs text-gray-500">Solved</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{totalProblems - solvedCount}</p>
            <p className="text-xs text-gray-500">Remaining</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-cyan-400">{Math.round(progress)}%</p>
            <p className="text-xs text-gray-500">Completion</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-900/50 border border-gray-700 focus:border-cyan-500 outline-none text-white"
            />
          </div>
        </div>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="px-4 py-2 rounded-xl bg-gray-900/50 border border-gray-700 focus:border-cyan-500 outline-none text-white"
        >
          {topics.map(topic => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="px-4 py-2 rounded-xl bg-gray-900/50 border border-gray-700 focus:border-cyan-500 outline-none text-white"
        >
          {difficulties.map(diff => (
            <option key={diff} value={diff}>{diff}</option>
          ))}
        </select>
      </div>

      {/* Problems Table */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Title</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Topic</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Difficulty</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Acceptance</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Submissions</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.map((problem) => (
                <tr key={problem.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    {problem.solved ? (
                      <FiCheckCircle className="text-green-400 text-xl" />
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-600" />
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-medium">{problem.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400 text-sm">{problem.topic}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400 text-sm">{problem.acceptance}%</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400 text-sm">{problem.submissions.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1">
                      Solve <FiExternalLink size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendations */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <FiStar className="text-yellow-400" />
            <h3 className="font-semibold text-white">Recommended for You</h3>
          </div>
          <ul className="space-y-2">
            <li className="text-gray-300 text-sm flex items-center justify-between">
              <span>🔹 Valid Parentheses</span>
              <span className="text-green-400 text-xs">Easy</span>
            </li>
            <li className="text-gray-300 text-sm flex items-center justify-between">
              <span>🔹 Maximum Subarray</span>
              <span className="text-yellow-400 text-xs">Medium</span>
            </li>
            <li className="text-gray-300 text-sm flex items-center justify-between">
              <span>🔹 LRU Cache</span>
              <span className="text-red-400 text-xs">Hard</span>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <FiTrendingUp className="text-cyan-400" />
            <h3 className="font-semibold text-white">Topics to Focus</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-sm">Dynamic Programming (40% done)</span>
            <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm">Graphs (25% done)</span>
            <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm">Arrays (75% done)</span>
          </div>
        </div>
      </div>
    </div>
  );
}