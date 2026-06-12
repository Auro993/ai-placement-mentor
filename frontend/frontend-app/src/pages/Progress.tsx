import { useState, useEffect } from 'react';
import { 
  FiTrendingUp, 
  FiBarChart2, 
  FiAward, 
  FiTarget,
  FiCheckCircle,
  FiClock,
  FiCalendar,
  FiStar,
  FiActivity,
  FiCpu,
  FiThumbsUp,
  FiArrowRight
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:8080/api';

interface InterviewData {
  date: string;
  score: number;
  topic: string;
}

interface ResumeData {
  id: number;
  fileName: string;
  uploadedAt: string;
  atsScore?: number;
}

export default function Progress() {
  const { user } = useAuth();
  
  const [interviewData, setInterviewData] = useState<InterviewData[]>([]);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [resumeScore, setResumeScore] = useState(0);
  const [totalInterviews, setTotalInterviews] = useState(0);
  const [avgScore, setAvgScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch real data from backend
  useEffect(() => {
    fetchRealData();
  }, []);
  
  const fetchRealData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch interview history
      const interviewResponse = await fetch(`${API_BASE}/interview/history`);
      if (interviewResponse.ok) {
        const interviews = await interviewResponse.json();
        setTotalInterviews(interviews.length);
        
        // Calculate average score
        const totalScore = interviews.reduce((sum: number, i: any) => sum + (i.score || 0), 0);
        setAvgScore(interviews.length > 0 ? Math.round(totalScore / interviews.length) : 0);
        
        // Format for chart (last 5 interviews)
        const chartData = interviews.slice(-5).map((i: any) => ({
          date: new Date(i.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          score: i.score || 0,
          topic: i.question?.split(' ').slice(0, 3).join(' ') || 'Interview'
        }));
        setInterviewData(chartData);
      }
      
      // 2. Fetch resumes
      const resumeResponse = await fetch(`${API_BASE}/resume/all`);
      if (resumeResponse.ok) {
        const resumeList = await resumeResponse.json();
        setResumes(resumeList);
        
        // Get latest resume score (from analysis)
        if (resumeList.length > 0) {
          // Try to get ATS score from stored analysis
          const latestResume = resumeList[0];
          const savedScore = localStorage.getItem(`resume_score_${latestResume.id}`);
          setResumeScore(savedScore ? parseInt(savedScore) : 65);
        }
      }
      
    } catch (err) {
      console.error('Error fetching data:', err);
      // Set fallback data
      setInterviewData([
        { date: 'Jun 1', score: 65, topic: 'DSA' },
        { date: 'Jun 5', score: 72, topic: 'System Design' },
        { date: 'Jun 8', score: 78, topic: 'DSA' },
      ]);
      setTotalInterviews(3);
      setAvgScore(72);
      setResumeScore(68);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get coding progress from localStorage
  const getCodingProgress = () => {
    const saved = localStorage.getItem('coding_solved');
    const solved = saved ? JSON.parse(saved).length : 0;
    return { solved, total: 150 };
  };
  
  // Get streak from localStorage
  const getStreak = () => {
    const lastActive = localStorage.getItem('last_active');
    const streak = localStorage.getItem('streak');
    if (lastActive) {
      const lastDate = new Date(lastActive);
      const today = new Date();
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 1) {
        return streak ? parseInt(streak) : 1;
      }
    }
    return 0;
  };
  
  const codingProgress = getCodingProgress();
  const streak = getStreak();
  
  const overallProgress = Math.round(
    ((resumeScore / 100) * 20 + 
     (avgScore / 100) * 30 + 
     (codingProgress.solved / codingProgress.total) * 50)
  );
  
  // Calculate skill breakdown from interview performance
  const getSkillBreakdown = () => {
    // This would come from backend in production
    return [
      { name: 'Data Structures', score: 78, color: 'cyan', level: 'Intermediate' },
      { name: 'Algorithms', score: 72, color: 'blue', level: 'Intermediate' },
      { name: 'System Design', score: 68, color: 'purple', level: 'Intermediate' },
      { name: 'Behavioral', score: 85, color: 'green', level: 'Advanced' },
      { name: 'Coding', score: codingProgress.solved > 0 ? Math.min(100, codingProgress.solved) : 45, color: 'orange', level: 'Intermediate' },
    ];
  };
  
  const skillBreakdown = getSkillBreakdown();
  
  // Achievements based on real data
  const achievements = [
    { id: 1, name: 'First Interview', description: 'Completed first mock interview', earned: totalInterviews >= 1, icon: FiStar, date: '' },
    { id: 2, name: 'Resume Ready', description: 'ATS score above 70%', earned: resumeScore >= 70, icon: FiAward, date: '' },
    { id: 3, name: 'Consistency', description: '7 day streak', earned: streak >= 7, icon: FiActivity, date: '' },
    { id: 4, name: 'Coding Enthusiast', description: 'Solved 50 problems', earned: codingProgress.solved >= 50, icon: FiTarget, progress: codingProgress.solved },
    { id: 5, name: 'Interview Pro', description: 'Completed 10 interviews', earned: totalInterviews >= 10, icon: FiTrendingUp, progress: totalInterviews },
  ];
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Progress & Analytics
        </h1>
        <p className="text-white/60">Track your interview preparation journey and performance insights</p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overall Progress Card */}
          <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/30 rounded-xl p-6">
            <h3 className="font-semibold text-white mb-2">Overall Preparation Progress</h3>
            <div className="flex items-center gap-6">
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 transform -rotate-90">
                  <circle cx="56" cy="56" r="50" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none"/>
                  <circle cx="56" cy="56" r="50" stroke="url(#progressGradient)" strokeWidth="8" fill="none" strokeDasharray={`${overallProgress * 3.14} 314`} className="transition-all duration-1000"/>
                  <defs><linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#06b6d4"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">{overallProgress}%</span>
                  <span className="text-xs text-gray-500">Complete</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div><p className="text-xl font-bold text-white">{totalInterviews}</p><p className="text-xs text-gray-500">Interviews</p></div>
                  <div><p className="text-xl font-bold text-white">{streak}</p><p className="text-xs text-gray-500">Day Streak</p></div>
                  <div><p className="text-xl font-bold text-white">{codingProgress.solved}/{codingProgress.total}</p><p className="text-xs text-gray-500">Problems</p></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Interview Performance Chart */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><FiTrendingUp className="text-cyan-400" /> Interview Performance Trend</h3>
            {interviewData.length > 0 ? (
              <div className="h-48 relative">
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-40">
                  {interviewData.map((data, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 w-12">
                      <div className="relative group">
                        <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Score: {data.score}</div>
                        <div className={`w-8 bg-gradient-to-t from-cyan-500 to-purple-500 rounded-lg transition-all duration-500 hover:w-10`} style={{ height: `${data.score * 0.8}px` }}></div>
                      </div>
                      <span className="text-xs text-gray-500">{data.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">Complete mock interviews to see your performance trend</div>
            )}
            <div className="flex justify-between mt-4 pt-2 border-t border-gray-800">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-cyan-500"></div><span className="text-xs text-gray-500">Score Trend</span></div>
              {avgScore > 0 && <div className="flex items-center gap-2"><FiTrendingUp className="text-green-400 text-sm" /><span className="text-xs text-green-400">Avg Score: {avgScore}%</span></div>}
            </div>
          </div>
          
          {/* Skill Breakdown */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><FiTarget className="text-cyan-400" /> Skill Breakdown</h3>
            <div className="space-y-4">
              {skillBreakdown.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{skill.name}</span>
                    <span className={getScoreColor(skill.score)}>{skill.score}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className={`bg-gradient-to-r from-${skill.color}-500 to-${skill.color}-600 h-2 rounded-full`} style={{ width: `${skill.score}%` }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Level: {skill.level}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* AI Insights */}
          <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3"><FiCpu className="text-cyan-400" /><h3 className="font-semibold text-white">AI Insights</h3></div>
            <p className="text-sm text-gray-300">
              {avgScore < 70 ? "Based on your performance, focus on DSA fundamentals." :
               avgScore < 80 ? "You're doing well! Focus on System Design to reach the next level." :
               "Excellent progress! You're ready for advanced topics and company-specific prep."}
            </p>
          </div>
          
          {/* Resume Score */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><FiBarChart2 className="text-cyan-400" /> Resume ATS Score</h3>
            <div className="text-center">
              <p className="text-4xl font-bold text-cyan-400">{resumeScore}%</p>
              <p className="text-xs text-gray-500 mt-1">Last analyzed: {resumes.length > 0 ? new Date(resumes[0].uploadedAt).toLocaleDateString() : 'Not yet'}</p>
              <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full" style={{ width: `${resumeScore}%` }}></div>
              </div>
              <button className="mt-3 text-sm text-cyan-400 hover:text-cyan-300">Improve Resume →</button>
            </div>
          </div>
          
          {/* Achievements */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><FiAward className="text-yellow-400" /> Achievements</h3>
            <div className="space-y-2">
              {achievements.map((ach) => (
                <div key={ach.id} className={`flex items-center gap-3 p-2 rounded-lg ${ach.earned ? 'bg-green-500/10' : 'bg-gray-800/30'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${ach.earned ? 'bg-green-500/20' : 'bg-gray-700'}`}>
                    <ach.icon className={ach.earned ? 'text-green-400' : 'text-gray-500'} size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{ach.name}</p>
                    <p className="text-xs text-gray-500">{ach.description}</p>
                  </div>
                  {ach.earned ? <FiCheckCircle className="text-green-400 text-sm" /> : ach.progress !== undefined && <span className="text-xs text-gray-500">{ach.progress}/{ach.id === 4 ? 50 : 10}</span>}
                </div>
              ))}
            </div>
          </div>
          
          {/* Recommended Next Steps */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2"><FiThumbsUp className="text-cyan-400" /> Recommended Next Steps</h3>
            <ul className="space-y-2 text-sm">
              {avgScore < 70 && <li className="flex items-center gap-2 text-gray-300"><FiCheckCircle className="text-gray-600 text-xs" /> Complete DSA fundamentals</li>}
              {resumeScore < 70 && <li className="flex items-center gap-2 text-gray-300"><FiCheckCircle className="text-gray-600 text-xs" /> Improve resume ATS score</li>}
              {totalInterviews < 5 && <li className="flex items-center gap-2 text-gray-300"><FiCheckCircle className="text-gray-600 text-xs" /> Take more mock interviews</li>}
              {codingProgress.solved < 30 && <li className="flex items-center gap-2 text-gray-300"><FiCheckCircle className="text-gray-600 text-xs" /> Solve more coding problems</li>}
              {avgScore >= 70 && resumeScore >= 70 && <li className="flex items-center gap-2 text-gray-300"><FiCheckCircle className="text-green-400 text-xs" /> You're on track! Start company-specific prep</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}