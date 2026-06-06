import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiStar, 
  FiTrendingUp, 
  FiTarget,
  FiBookOpen,
  FiVideo,
  FiFileText,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiAward,
  FiBarChart2,
  FiMic,
  FiCode,
  FiYoutube,
  FiExternalLink,
  FiX
} from 'react-icons/fi';
import { useState } from 'react';

interface CompanyData {
  id: number;
  name: string;
  logo: string;
  difficulty: string;
  description: string;
  questions: { topic: string; count: number }[];
  topics: string[];
  salary: { min: string; max: string; avg: string };
  process: string[];
  tips: string[];
  videoLinks: { title: string; url: string }[];
  experienceLinks: { title: string; url: string; author: string }[];
}

const companyData: Record<number, CompanyData> = {
  1: {
    id: 1,
    name: 'Google',
    logo: 'G',
    difficulty: 'Hard',
    description: 'Google is known for its rigorous interview process focusing on DSA, System Design, and Leadership principles.',
    questions: [
      { topic: 'Arrays & Strings', count: 45 },
      { topic: 'Dynamic Programming', count: 30 },
      { topic: 'Graphs', count: 25 },
      { topic: 'System Design', count: 20 },
    ],
    topics: ['DSA', 'System Design', 'Leadership', 'Coding'],
    salary: { min: '35 LPA', max: '55 LPA', avg: '45 LPA' },
    process: ['Resume Screening', 'Online Assessment', 'Technical Round 1', 'Technical Round 2', 'System Design', 'Hiring Committee'],
    tips: [
      'Focus on problem-solving speed',
      'Practice LeetCode medium/hard problems',
      'Prepare for System Design questions',
      'Review Google\'s leadership principles'
    ],
    videoLinks: [
      { title: 'Complete Google Interview Preparation', url: 'https://youtube.com/watch?v=example1' },
      { title: 'Google SWE Interview Experience', url: 'https://youtube.com/watch?v=example2' },
      { title: 'System Design for Google', url: 'https://youtube.com/watch?v=example3' },
    ],
    experienceLinks: [
      { title: 'How I cracked Google SWE', url: 'https://leetcode.com/discuss/interview-experience/123456/google-swe', author: 'Rahul Sharma' },
      { title: 'Google Interview Experience 2024', url: 'https://leetcode.com/discuss/interview-experience/123457/google-2024', author: 'Priya Patel' },
      { title: 'From Zero to Google', url: 'https://leetcode.com/discuss/interview-experience/123458/google-zero-to-hero', author: 'Amit Kumar' },
    ]
  },
  2: {
    id: 2,
    name: 'Microsoft',
    logo: 'M',
    difficulty: 'Hard',
    description: 'Microsoft focuses on problem-solving, system design, and cultural fit.',
    questions: [
      { topic: 'Arrays & Strings', count: 40 },
      { topic: 'Trees & Graphs', count: 35 },
      { topic: 'System Design', count: 25 },
      { topic: 'OOP', count: 20 },
    ],
    topics: ['DSA', 'System Design', 'OOP', 'Coding'],
    salary: { min: '30 LPA', max: '50 LPA', avg: '40 LPA' },
    process: ['Resume Screening', 'Online Assessment', 'Technical Round 1', 'Technical Round 2', 'Hiring Manager', 'Final Round'],
    tips: [
      'Focus on problem-solving approach',
      'Practice system design questions',
      'Be ready to explain your thought process',
      'Review Microsoft\'s culture and values'
    ],
    videoLinks: [
      { title: 'Microsoft Interview Preparation', url: 'https://youtube.com/watch?v=example4' },
      { title: 'Microsoft System Design Questions', url: 'https://youtube.com/watch?v=example5' },
    ],
    experienceLinks: [
      { title: 'Microsoft Interview Experience', url: 'https://leetcode.com/discuss/interview-experience/123459/microsoft-sde', author: 'Sneha Reddy' },
      { title: 'Cracking Microsoft SWE', url: 'https://leetcode.com/discuss/interview-experience/123460/microsoft-swe', author: 'Vikram Singh' },
    ]
  },
  3: {
    id: 3,
    name: 'Amazon',
    logo: 'A',
    difficulty: 'Hard',
    description: 'Amazon interview focuses on Leadership Principles, DSA, and System Design.',
    questions: [
      { topic: 'Arrays & Strings', count: 50 },
      { topic: 'Trees & Graphs', count: 40 },
      { topic: 'System Design', count: 30 },
      { topic: 'Leadership Principles', count: 20 },
    ],
    topics: ['DSA', 'System Design', 'Leadership', 'Coding'],
    salary: { min: '32 LPA', max: '52 LPA', avg: '42 LPA' },
    process: ['Resume Screening', 'Online Assessment', 'Technical Round', 'System Design', 'Bar Raiser', 'Hiring Committee'],
    tips: [
      'Master Amazon Leadership Principles',
      'Practice problem-solving under time pressure',
      'Prepare for behavioral questions with STAR method',
      'Review system design concepts'
    ],
    videoLinks: [
      { title: 'Amazon Interview Masterclass', url: 'https://youtube.com/watch?v=example6' },
      { title: 'Amazon Leadership Principles Explained', url: 'https://youtube.com/watch?v=example7' },
    ],
    experienceLinks: [
      { title: 'Amazon SDE Interview Experience', url: 'https://leetcode.com/discuss/interview-experience/123461/amazon-sde', author: 'Neha Gupta' },
      { title: 'How I prepared for Amazon', url: 'https://leetcode.com/discuss/interview-experience/123462/amazon-preparation', author: 'Rajesh Kumar' },
    ]
  }
};

export default function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const company = companyData[Number(id)];
  
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  
  if (!company) {
    return (
      <div className="text-center py-20">
        <p className="text-white text-xl">Company not found</p>
        <Link to="/companies" className="text-cyan-400 mt-4 inline-block">← Back to Companies</Link>
      </div>
    );
  }

  const startMockInterview = () => {
    navigate('/interview', { state: { company: company.name, role: company.name } });
  };

  const openPracticeQuestions = () => {
    navigate('/coding', { state: { company: company.name } });
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back Button */}
      <Link to="/companies" className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 mb-6 transition-colors">
        <FiArrowLeft /> Back to Companies
      </Link>
      
      {/* Company Header */}
      <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-2xl p-6 border border-cyan-500/30 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl">
            {company.logo}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{company.name}</h1>
            <p className="text-gray-400 mt-1">{company.description}</p>
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
          <FiTrendingUp className="text-cyan-400 text-xl mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{company.salary.avg}</p>
          <p className="text-xs text-gray-500">Average Package</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
          <FiTarget className="text-cyan-400 text-xl mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{company.difficulty}</p>
          <p className="text-xs text-gray-500">Difficulty Level</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
          <FiClock className="text-cyan-400 text-xl mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">3-4 weeks</p>
          <p className="text-xs text-gray-500">Prep Time</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
          <FiUsers className="text-cyan-400 text-xl mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">85%</p>
          <p className="text-xs text-gray-500">Success Rate</p>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Interview Process */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <FiCheckCircle className="text-cyan-400" /> Interview Process
            </h3>
            <div className="space-y-2">
              {company.process.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-gray-800/30">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center">{idx + 1}</span>
                  <span className="text-gray-300 text-sm">{step}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Important Topics */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <FiTarget className="text-cyan-400" /> Important Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {company.topics.map((topic, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm">
                  {topic}
                </span>
              ))}
            </div>
          </div>
          
          {/* Expert Tips */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <FiStar className="text-yellow-400" /> Expert Tips
            </h3>
            <ul className="space-y-2">
              {company.tips.map((tip, idx) => (
                <li key={idx} className="text-gray-300 text-sm flex items-start gap-2">
                  <span className="text-cyan-400">•</span> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Question Breakdown */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <FiBarChart2 className="text-cyan-400" /> Question Distribution
            </h3>
            <div className="space-y-3">
              {company.questions.map((q, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{q.topic}</span>
                    <span className="text-cyan-400">{q.count} questions</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${(q.count / 50) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Preparation Resources */}
          <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/30 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <FiBookOpen className="text-cyan-400" /> Preparation Resources
            </h3>
            <div className="space-y-3">
              {/* Video Tutorials Button */}
              <button 
                onClick={() => setShowVideoModal(true)}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors flex items-center gap-3 group"
              >
                <FiYoutube className="text-red-400 text-xl" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Video Tutorials</p>
                  <p className="text-xs text-gray-500">Topic-wise video guides for {company.name}</p>
                </div>
                <FiExternalLink className="text-gray-500 group-hover:text-cyan-400" />
              </button>
              
              {/* Interview Experiences Button */}
              <button 
                onClick={() => setShowExperienceModal(true)}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors flex items-center gap-3 group"
              >
                <FiFileText className="text-cyan-400 text-xl" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Interview Experiences</p>
                  <p className="text-xs text-gray-500">Real interview experiences from candidates</p>
                </div>
                <FiExternalLink className="text-gray-500 group-hover:text-cyan-400" />
              </button>
              
              {/* Practice Questions Button */}
              <button 
                onClick={openPracticeQuestions}
                className="w-full text-left px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors flex items-center gap-3 group"
              >
                <FiCode className="text-cyan-400 text-xl" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Practice Questions</p>
                  <p className="text-xs text-gray-500">Company-wise problem sets</p>
                </div>
                <FiExternalLink className="text-gray-500 group-hover:text-cyan-400" />
              </button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={startMockInterview}
              className="w-full btn-primary py-3 text-lg font-semibold flex items-center justify-center gap-2"
            >
              <FiMic size={20} /> Start Mock Interview
            </button>
          </div>
        </div>
      </div>

      {/* Video Tutorials Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full border border-cyan-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FiYoutube className="text-red-400" /> Video Tutorials for {company.name}
              </h3>
              <button onClick={() => setShowVideoModal(false)} className="text-gray-400 hover:text-white">
                <FiX size={24} />
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {company.videoLinks.map((video, idx) => (
                <a 
                  key={idx}
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                >
                  <span className="text-gray-300">{video.title}</span>
                  <FiExternalLink className="text-cyan-400" />
                </a>
              ))}
            </div>
            <button onClick={() => setShowVideoModal(false)} className="btn-secondary w-full mt-4 py-2">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Interview Experiences Modal - WITH WORKING LINKS */}
      {showExperienceModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full border border-cyan-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FiFileText className="text-cyan-400" /> Interview Experiences for {company.name}
              </h3>
              <button onClick={() => setShowExperienceModal(false)} className="text-gray-400 hover:text-white">
                <FiX size={24} />
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {company.experienceLinks.map((exp, idx) => (
                <a 
                  key={idx}
                  href={exp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <div>
                    <span className="text-gray-300">{exp.title}</span>
                    <p className="text-xs text-gray-500 mt-1">By {exp.author}</p>
                  </div>
                  <FiExternalLink className="text-cyan-400" />
                </a>
              ))}
            </div>
            <button onClick={() => setShowExperienceModal(false)} className="btn-secondary w-full mt-4 py-2">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}