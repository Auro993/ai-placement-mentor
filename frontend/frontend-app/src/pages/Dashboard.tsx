import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiMessageSquare, 
  FiUpload, 
  FiMic, 
  FiBarChart2, 
  FiTrendingUp,
  FiCheckCircle,
  FiAward,
  FiCalendar,
  FiStar,
  FiZap,
  FiArrowRight,
  FiFileText,
  FiCpu,
  FiActivity,
  FiClock,
  FiThumbsUp,
  FiDatabase,
  FiCode
} from 'react-icons/fi';

export default function Dashboard() {
  const { user } = useAuth();
  const [chatMessage, setChatMessage] = useState('');
  
  const stats = [
    { label: 'Interviews Practiced', value: '24', change: '+12%', icon: FiMic, color: 'cyan' },
    { label: 'Average Score', value: '78%', change: '+8%', icon: FiActivity, color: 'purple' },
    { label: 'Skills Improved', value: '15', change: '+3', icon: FiTrendingUp, color: 'green' },
    { label: 'Day Streak', value: '7', change: 'Keep it up!', icon: FiStar, color: 'yellow' },
  ];
  
  const performanceData = [
    { label: 'Highest Score', value: '92%' },
    { label: 'Lowest Score', value: '45%' },
    { label: 'Total Questions', value: '156' },
  ];
  
  const recentInterviews = [
    { title: 'System Design Interview', level: 'Intermediate', time: '8 min ago', difficulty: 'medium' },
    { title: 'Frontend Developer Interview', level: 'Easy', time: '2 hours ago', difficulty: 'easy' },
    { title: 'Behavioral Interview', level: 'Easy', time: 'Yesterday', difficulty: 'easy' },
    { title: 'Backend Developer Interview', level: 'Hard', time: '2 days ago', difficulty: 'hard' },
  ];
  
  const skillsData = [
    { name: 'Problem Solving', percentage: 85, color: 'cyan' },
    { name: 'Database', percentage: 65, color: 'purple' },
    { name: 'Frontend', percentage: 82, color: 'orange' },
  ];
  
  const resumeData = [
    { label: 'ATS Score', percentage: 90, icon: FiFileText },
    { label: 'Skills Match', percentage: 82, icon: FiCheckCircle },
    { label: 'Keywords Found', percentage: 82, icon: FiTrendingUp },
    { label: 'Add More Achievements', percentage: 82, icon: FiAward },
  ];
  
  const quickQuestions = [
    "Give me a system design question",
    "How can I improve my DSA skills?",
    "Tips for cracking product based companies",
  ];
  
  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };
  
  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Handle chat message
      console.log('Message sent:', chatMessage);
      setChatMessage('');
    }
  };
  
  return (
    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-100px)] pb-6 pr-2">
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-cyan-600/15 to-purple-600/15 rounded-2xl p-6 border border-white/10">
        <h1 className="text-2xl font-bold text-white mb-1">
          Welcome back, {user?.name || 'Aditya'}! 🎉
        </h1>
        <p className="text-gray-400 text-sm">Your AI-powered placement preparation dashboard</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-8 h-8 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                <stat.icon className={`text-${stat.color}-400 text-sm`} />
              </div>
              <span className="text-xs text-green-400">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Performance Overview */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-4">Performance Overview</h3>
            <div className="grid grid-cols-3 gap-4">
              {performanceData.map((item, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl font-bold text-cyan-400">{item.value}</p>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* AI Mentor Assistant */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
                <FiCpu className="text-white text-sm" />
              </div>
              <h3 className="font-semibold text-white">AI Mentor Assistant</h3>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
              <p className="text-gray-300 text-sm">
                Hi {user?.name || 'Aditya'}! I'm your AI placement mentor. How can I help you today?
              </p>
            </div>
            
            <div className="space-y-2 mb-4">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  className="w-full text-left px-3 py-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 text-gray-300 text-sm transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-medium"
              >
                Send
              </button>
            </div>
          </div>
          
          {/* Recent Mock Interviews */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-4">Recent Mock Interviews</h3>
            <div className="space-y-3">
              {recentInterviews.map((interview, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                  <div>
                    <p className="text-sm text-white font-medium">{interview.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{interview.time}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(interview.difficulty)}`}>
                    {interview.level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Skills Assessment */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-4">Skills Assessment</h3>
            <div className="space-y-4">
              {skillsData.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{skill.name}</span>
                    <span className={`text-${skill.color}-400`}>{skill.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r from-${skill.color}-500 to-${skill.color}-600 h-2 rounded-full`}
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Resume Analyzer */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-4">Resume Analyzer</h3>
            <div className="space-y-3">
              {resumeData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <item.icon className="text-cyan-400 text-sm" />
                    <span className="text-sm text-gray-300">{item.label}</span>
                  </div>
                  <span className="text-sm text-cyan-400 font-semibold">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Today's Recommendation */}
          <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <FiZap className="text-cyan-400" size={16} />
              <h3 className="font-semibold text-white text-sm">Today's Recommendation</h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Focus on System Design and Database concepts. Practice 2-3 questions daily!
            </p>
            <button className="mt-3 text-cyan-400 text-sm flex items-center gap-1 hover:gap-2 transition-all">
              Start Practicing → <FiArrowRight size={14} />
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}