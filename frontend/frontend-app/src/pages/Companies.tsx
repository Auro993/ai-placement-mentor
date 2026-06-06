import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiBriefcase, 
  FiStar, 
  FiTrendingUp, 
  FiUsers,
  FiTarget,
  FiAward,
  FiSearch,
  FiBookOpen,
  FiVideo,
  FiFileText,
  FiExternalLink,
  FiCheckCircle
} from 'react-icons/fi';

interface Company {
  id: number;
  name: string;
  logo: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questions: number;
  avgPackage: string;
  tags: string[];
  color: string;
}

export default function Companies() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  
  const companies: Company[] = [
    { id: 1, name: 'Google', logo: 'G', difficulty: 'Hard', questions: 250, avgPackage: '45 LPA', tags: ['DSA', 'System Design', 'Coding'], color: 'from-blue-500 to-cyan-500' },
    { id: 2, name: 'Microsoft', logo: 'M', difficulty: 'Hard', questions: 200, avgPackage: '40 LPA', tags: ['DSA', 'System Design', 'Coding'], color: 'from-blue-600 to-purple-600' },
    { id: 3, name: 'Amazon', logo: 'A', difficulty: 'Hard', questions: 300, avgPackage: '42 LPA', tags: ['DSA', 'Leadership', 'Coding'], color: 'from-orange-500 to-yellow-500' },
    { id: 4, name: 'Meta', logo: 'M', difficulty: 'Hard', questions: 220, avgPackage: '48 LPA', tags: ['DSA', 'System Design', 'Coding'], color: 'from-blue-500 to-indigo-500' },
    { id: 5, name: 'Apple', logo: 'A', difficulty: 'Hard', questions: 180, avgPackage: '44 LPA', tags: ['DSA', 'System Design', 'Product'], color: 'from-gray-500 to-gray-700' },
    { id: 6, name: 'Netflix', logo: 'N', difficulty: 'Hard', questions: 150, avgPackage: '50 LPA', tags: ['System Design', 'Coding'], color: 'from-red-500 to-red-700' },
    { id: 7, name: 'Flipkart', logo: 'F', difficulty: 'Medium', questions: 120, avgPackage: '28 LPA', tags: ['DSA', 'Coding'], color: 'from-yellow-500 to-orange-500' },
    { id: 8, name: 'Uber', logo: 'U', difficulty: 'Hard', questions: 160, avgPackage: '38 LPA', tags: ['DSA', 'System Design'], color: 'from-green-500 to-teal-500' },
    { id: 9, name: 'Adobe', logo: 'A', difficulty: 'Medium', questions: 130, avgPackage: '32 LPA', tags: ['DSA', 'Coding'], color: 'from-red-500 to-pink-500' },
    { id: 10, name: 'TCS', logo: 'T', difficulty: 'Easy', questions: 80, avgPackage: '12 LPA', tags: ['Aptitude', 'Coding'], color: 'from-blue-500 to-cyan-500' },
    { id: 11, name: 'Infosys', logo: 'I', difficulty: 'Easy', questions: 70, avgPackage: '10 LPA', tags: ['Aptitude', 'Coding'], color: 'from-blue-600 to-blue-800' },
    { id: 12, name: 'Walmart', logo: 'W', difficulty: 'Medium', questions: 100, avgPackage: '25 LPA', tags: ['DSA', 'System Design'], color: 'from-blue-500 to-green-500' },
  ];

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'All' || company.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'Hard': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Company Preparation
        </h1>
        <p className="text-white/60">Company-specific interview preparation guides, questions, and resources</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-900/50 border border-gray-700 focus:border-cyan-500 outline-none text-white"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {difficulties.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedDifficulty === diff
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-cyan-400">{companies.length}</p>
          <p className="text-xs text-gray-500">Companies</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-cyan-400">2,500+</p>
          <p className="text-xs text-gray-500">Total Questions</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-cyan-400">₹12-50 LPA</p>
          <p className="text-xs text-gray-500">Salary Range</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-cyan-400">85%</p>
          <p className="text-xs text-gray-500">Success Rate</p>
        </div>
      </div>

      {/* Companies Grid - Only companies, no resource buttons */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCompanies.map((company) => (
          <Link key={company.id} to={`/companies/${company.id}`}>
            <div className="group bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 hover:transform hover:scale-[1.02] cursor-pointer">
              <div className={`h-2 bg-gradient-to-r ${company.color}`} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${company.color} flex items-center justify-center text-white font-bold text-lg`}>
                      {company.logo}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{company.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(company.difficulty)}`}>
                          {company.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">{company.questions} questions</span>
                      </div>
                    </div>
                  </div>
                  <FiBriefcase className="text-gray-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                
                <div className="mb-3">
                  <p className="text-cyan-400 text-sm font-semibold">{company.avgPackage}</p>
                  <p className="text-xs text-gray-500">Average Package</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {company.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="w-full py-2 rounded-lg bg-gray-800 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-colors flex items-center justify-center gap-2">
                  Start Preparation <FiExternalLink size={14} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}