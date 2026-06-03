import { useState, useEffect } from 'react';
import { 
  FiCheckCircle, 
  FiClock, 
  FiCalendar, 
  FiTarget, 
  FiAward,
  FiBookOpen,
  FiCode,
  FiBriefcase,
  FiUsers,
  FiStar,
  FiTrendingUp,
  FiZap,
  FiArrowRight,
  FiArrowLeft,
  FiDownload,
  FiShare2,
  FiCpu,
  FiAlertCircle,
  FiChevronRight,
  FiYoutube,
  FiLink,
  FiThumbsUp
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

interface Question {
  id: number;
  text: string;
  options: string[];
  icon: any;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  hours: number;
  resources?: { type: string; title: string; url: string; }[];
}

interface WeekPlan {
  week: number;
  title: string;
  tasks: Task[];
  hours: number;
  completed: boolean;
}

interface AIResource {
  topic: string;
  resources: { type: string; title: string; url: string; description: string; }[];
}

interface SkillAnalysis {
  skill: string;
  percentage: number;
  status: string;
}

export default function Roadmap() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [weeks, setWeeks] = useState<WeekPlan[]>([]);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const [aiResources, setAiResources] = useState<AIResource[]>([]);
  const [skillAnalysis, setSkillAnalysis] = useState<SkillAnalysis[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  
  // 12 Questions
  const questions: Question[] = [
    { id: 1, text: "What's your target role?", icon: FiTarget, options: ["Software Engineer", "Data Scientist", "Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer"] },
    { id: 2, text: "What's your current experience level?", icon: FiAward, options: ["Fresher (0-1 year)", "Intermediate (1-3 years)", "Experienced (3+ years)"] },
    { id: 3, text: "Rate your DSA knowledge?", icon: FiCode, options: ["Beginner", "Basic", "Intermediate", "Advanced"] },
    { id: 4, text: "Which languages do you know?", icon: FiCode, options: ["Java", "Python", "JavaScript", "C++", "Multiple"] },
    { id: 5, text: "How many projects have you built?", icon: FiBriefcase, options: ["0", "1-2", "3-5", "5+"] },
    { id: 6, text: "LeetCode problems solved?", icon: FiStar, options: ["0", "1-50", "51-150", "150+"] },
    { id: 7, text: "System Design knowledge?", icon: FiTrendingUp, options: ["None", "Basic", "Intermediate", "Advanced"] },
    { id: 8, text: "Hours you can dedicate daily?", icon: FiClock, options: ["1-2 hrs", "3-4 hrs", "5-6 hrs", "7+ hrs"] },
    { id: 9, text: "When do you want to start applying?", icon: FiCalendar, options: ["1 month", "3 months", "6 months", "1 year"] },
    { id: 10, text: "Your learning style?", icon: FiBookOpen, options: ["Videos", "Reading", "Coding", "Mixed"] },
    { id: 11, text: "Target company type?", icon: FiUsers, options: ["FAANG", "Product based", "Service based", "Startups"] },
    { id: 12, text: "Your weakest area?", icon: FiAlertCircle, options: ["DSA", "System Design", "Behavioral", "Communication"] },
  ];
  
  // Generate roadmap by calling AI service
  const generateRoadmapWithAI = async () => {
    setLoadingAI(true);
    
    try {
      const response = await fetch('http://localhost:5001/api/roadmap/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      
      const data = await response.json();
      console.log("AI Response:", data);
      
      // Convert AI response to weeks format
      if (data.weeks && data.weeks.length > 0) {
        const aiWeeks: WeekPlan[] = data.weeks.map((week: any) => ({
          week: week.week,
          title: week.title,
          tasks: week.tasks.map((task: any, idx: number) => ({
            id: `w${week.week}t${idx + 1}`,
            title: task.title,
            description: task.description || `Complete ${task.title} for Week ${week.week}`,
            completed: false,
            hours: task.hours || 2,
            resources: []
          })),
          hours: week.totalHours || week.tasks.reduce((sum: number, t: any) => sum + (t.hours || 2), 0),
          completed: false
        }));
        setWeeks(aiWeeks);
      } else {
        // Fallback weeks
        generateFallbackWeeks();
      }
      
      // Set AI resources
      if (data.resources && data.resources.length > 0) {
        setAiResources(data.resources);
      } else {
        setFallbackResources();
      }
      
      // Set skill analysis
      if (data.skillAnalysis && data.skillAnalysis.length > 0) {
        setSkillAnalysis(data.skillAnalysis);
      }
      
    } catch (error) {
      console.error("AI service error:", error);
      generateFallbackWeeks();
      setFallbackResources();
    } finally {
      setLoadingAI(false);
      setShowRoadmap(true);
    }
  };
  
  const generateFallbackWeeks = () => {
    const timeline = answers[9] || '3 months';
    let totalWeeks = 12;
    if (timeline === '1 month') totalWeeks = 4;
    else if (timeline === '3 months') totalWeeks = 12;
    else if (timeline === '6 months') totalWeeks = 24;
    else totalWeeks = 48;
    
    const weeklyPlan: WeekPlan[] = [];
    const role = answers[1] || 'Software Engineer';
    const weakArea = answers[12] || 'DSA';
    
    const weekTitles = [
      'DSA Fundamentals',
      'Advanced DSA',
      'Dynamic Programming',
      'System Design Basics',
      `${role} - Core Concepts`,
      'Project Building',
      `Focus on ${weakArea}`,
      'Resume & LinkedIn',
      'Mock Interviews',
      'Company Specific Prep',
      'Final Revision',
      'Application & Interviews'
    ];
    
    const weekTasks = [
      ['Arrays & Strings', 'Hashing & Maps', 'Two Pointer Technique', 'Basic Recursion'],
      ['Stacks & Queues', 'Linked Lists', 'Trees (Binary, BST)', 'Graph Basics'],
      ['DP Patterns', 'Memoization', 'Tabulation', 'Common DP Problems'],
      ['HLD Fundamentals', 'Database Design', 'API Design', 'Caching Strategies'],
      [`${role} Fundamentals`, 'Best Practices', 'Common Libraries', 'Interview Questions'],
      ['Project Planning', 'Building MVP', 'Testing & Debugging', 'Deployment'],
      [`${weakArea} Deep Dive`, 'Practice Problems', 'Mock Sessions', 'Review & Improve'],
      ['Resume Optimization', 'LinkedIn Profile', 'GitHub Portfolio', 'Cover Letter'],
      ['Technical Mock', 'HR Mock', 'System Design Mock', 'Feedback Implementation'],
      ['Company Research', 'Previous Year Questions', 'Company Culture', 'Referral Network'],
      ['All Topics Revision', 'Weak Areas Review', 'Practice Tests', 'Time Management'],
      ['Job Applications', 'Interview Scheduling', 'Offer Negotiation', 'Decision Making']
    ];
    
    const weekHours = [10, 12, 14, 10, 10, 15, 12, 6, 8, 8, 10, 8];
    
    for (let i = 1; i <= Math.min(totalWeeks, 12); i++) {
      const tasks: Task[] = weekTasks[i-1].map((task, idx) => ({
        id: `w${i}t${idx + 1}`,
        title: task,
        description: `Complete ${task.toLowerCase()} for Week ${i}`,
        completed: false,
        hours: Math.ceil(weekHours[i-1] / 4)
      }));
      
      weeklyPlan.push({
        week: i,
        title: weekTitles[i-1],
        tasks,
        hours: weekHours[i-1],
        completed: false
      });
    }
    
    setWeeks(weeklyPlan);
  };
  
  const setFallbackResources = () => {
    const weakArea = answers[12] || 'Interview Preparation';
    setAiResources([
      {
        topic: "DSA Fundamentals",
        resources: [
          { type: "YouTube", title: "Complete DSA Course by NeetCode", url: "https://youtube.com/playlist?list=PLot-Xpze53leF0FeHz2X0aG3zd0mr1AW_", description: "Comprehensive DSA playlist" },
          { type: "YouTube", title: "Striver's DSA Sheet", url: "https://youtube.com/c/takeUforward", description: "Best for interview preparation" },
          { type: "Article", title: "LeetCode Patterns", url: "https://leetcode.com/discuss/study-guide", description: "Common problem patterns" }
        ]
      },
      {
        topic: "System Design",
        resources: [
          { type: "YouTube", title: "System Design Interview by Gaurav Sen", url: "https://youtube.com/playlist?list=PLMCXHnjXnTnv5GyP7Zn6NJuPix6it7r3R", description: "Complete system design course" }
        ]
      },
      {
        topic: weakArea,
        resources: [
          { type: "YouTube", title: `${weakArea} Tips by takeUforward`, url: "https://youtube.com/c/takeUforward", description: `Master ${weakArea} with these videos` }
        ]
      }
    ]);
  };
  
  const handleAnswer = (option: string) => {
    const newAnswers = { ...answers, [questions[step].id]: option };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      generateRoadmapWithAI();
    }
  };
  
  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };
  
  const resetQuiz = () => {
    setStep(0);
    setAnswers({});
    setShowRoadmap(false);
    setWeeks([]);
    setAiResources([]);
    setSkillAnalysis([]);
    localStorage.removeItem('roadmap_progress');
  };
  
  const toggleTask = (weekIndex: number, taskId: string) => {
    const newWeeks = [...weeks];
    const week = newWeeks[weekIndex];
    const task = week.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      week.completed = week.tasks.every(t => t.completed);
      setWeeks(newWeeks);
      localStorage.setItem('roadmap_progress', JSON.stringify(newWeeks));
    }
  };
  
  const toggleWeek = (week: number) => {
    setExpandedWeek(expandedWeek === week ? null : week);
  };
  
  const calculateProgress = () => {
    if (weeks.length === 0) return 0;
    const totalTasks = weeks.reduce((acc, week) => acc + week.tasks.length, 0);
    const completedTasks = weeks.reduce((acc, week) => 
      acc + week.tasks.filter(t => t.completed).length, 0);
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };
  
  const getWeeksCompleted = () => weeks.filter(w => w.completed).length;
  
  const exportPDF = () => {
    const printContent = document.getElementById('roadmap-content');
    if (!printContent) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${user?.name || 'User'}_Placement_Roadmap</title>
            <meta charset="UTF-8">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; max-width: 1000px; margin: 0 auto; background: white; color: #333; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #06b6d4; padding-bottom: 20px; }
              .header h1 { color: #06b6d4; font-size: 28px; margin-bottom: 5px; }
              .header p { color: #666; font-size: 14px; }
              .summary { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 25px; }
              .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-top: 10px; }
              .summary-card { text-align: center; }
              .summary-card .value { font-size: 24px; font-weight: bold; color: #06b6d4; }
              .summary-card .label { font-size: 12px; color: #666; }
              .progress-bar-container { background: #e0e0e0; border-radius: 10px; height: 20px; margin: 20px 0; }
              .progress-bar { background: linear-gradient(90deg, #06b6d4, #8b5cf6); border-radius: 10px; height: 20px; width: 0%; }
              .week { margin-bottom: 20px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
              .week-header { background: #f0f0f0; padding: 12px 15px; font-weight: bold; }
              .week-header span { color: #06b6d4; }
              .task-list { padding: 10px 15px; }
              .task { padding: 8px 0; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 10px; }
              .task-checkbox { width: 18px; height: 18px; }
              .task-title { flex: 1; }
              .task-hours { color: #888; font-size: 12px; }
              .completed { text-decoration: line-through; color: #888; }
              .resources { margin-top: 30px; background: #f8f9fa; padding: 20px; border-radius: 8px; }
              .resources h3 { color: #06b6d4; margin-bottom: 15px; }
              .resource-item { margin-bottom: 15px; padding: 10px; background: white; border-radius: 6px; }
              .resource-title { font-weight: bold; color: #333; }
              .resource-url { color: #06b6d4; font-size: 12px; word-break: break-all; }
              .footer { margin-top: 40px; text-align: center; color: #888; font-size: 11px; border-top: 1px solid #ddd; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🗺️ Placement Roadmap</h1>
              <p>Generated by JobGenie - AI Placement Mentor</p>
              <p>Date: ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="summary">
              <h3>📊 Your Profile Summary</h3>
              <div class="summary-grid">
                <div class="summary-card"><div class="value">${answers[1] || 'Software Engineer'}</div><div class="label">Target Role</div></div>
                <div class="summary-card"><div class="value">${answers[2] || 'Fresher'}</div><div class="label">Experience</div></div>
                <div class="summary-card"><div class="value">${answers[8] || '3-4 hrs'}</div><div class="label">Daily Hours</div></div>
                <div class="summary-card"><div class="value">${answers[9] || '3 months'}</div><div class="label">Timeline</div></div>
              </div>
            </div>
            <div class="progress-bar-container"><div class="progress-bar" style="width: ${calculateProgress()}%"></div></div>
            <h2>📅 Weekly Plan</h2>
            ${weeks.map(week => `
              <div class="week">
                <div class="week-header"><span>Week ${week.week}</span> - ${week.title}<span style="float: right;">${week.tasks.filter(t => t.completed).length}/${week.tasks.length} tasks</span></div>
                <div class="task-list">${week.tasks.map(task => `<div class="task"><div class="task-checkbox">${task.completed ? '✓' : '○'}</div><div class="task-title ${task.completed ? 'completed' : ''}">${task.title}</div><div class="task-hours">~${task.hours} hrs</div></div>`).join('')}</div>
              </div>
            `).join('')}
            <div class="resources"><h3>🤖 AI Recommended Resources</h3>
              ${aiResources.map(resource => `<div><h4 style="color:#06b6d4;">📚 ${resource.topic}</h4>${resource.resources.map(r => `<div class="resource-item"><div class="resource-title">${r.type}: ${r.title}</div><div class="resource-url">🔗 ${r.url}</div><div style="font-size:12px;color:#666;">${r.description}</div></div>`).join('')}</div>`).join('')}
            </div>
            <div class="footer"><p>Generated by JobGenie - Your AI Placement Mentor</p><p>Keep practicing and stay consistent! 🎯</p></div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };
  
  // Questionnaire View
  if (!showRoadmap) {
    const currentQ = questions[step];
    if (!currentQ) return <div className="text-center py-20 text-white">Loading...</div>;
    
    const ProgressIcon = currentQ.icon;
    const progressPercent = ((step + 1) / questions.length) * 100;
    
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Roadmap</h1>
          <p className="text-gray-400">Answer {questions.length} questions to get your personalized placement roadmap</p>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Question {step + 1} of {questions.length}</span>
            <span>{Math.round(progressPercent)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-gradient-to-r from-cyan-500 to-purple-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
              <ProgressIcon className="text-cyan-400 text-2xl" />
            </div>
            <h2 className="text-xl font-semibold text-white">{currentQ.text}</h2>
          </div>
          
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className="w-full text-left px-5 py-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-cyan-500/50 hover:bg-gray-800 transition-all group"
              >
                <span className="text-gray-300 group-hover:text-white">{option}</span>
                <FiArrowRight className="float-right mt-1 text-gray-500 group-hover:text-cyan-400" />
              </button>
            ))}
          </div>
          
          <div className="flex justify-between mt-8">
            {step > 0 && (
              <button onClick={handleBack} className="flex items-center gap-2 text-gray-400 hover:text-white">
                <FiArrowLeft /> Back
              </button>
            )}
            <span className="text-sm text-gray-500">{questions.length - step - 1} questions remaining</span>
          </div>
        </div>
      </div>
    );
  }
  
  // Roadmap View
  const progress = calculateProgress();
  const weeksCompleted = getWeeksCompleted();
  
  return (
    <div className="max-w-5xl mx-auto">
      {loadingAI && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
            <p className="text-white">AI is creating your personalized roadmap...</p>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Personalized Roadmap</h1>
          <p className="text-gray-400">Based on your answers: {answers[1]} · {answers[2]} · {answers[8]}/day</p>
        </div>
        <div className="flex gap-3">
          <button onClick={resetQuiz} className="px-4 py-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white text-sm transition-colors">
            Start Over
          </button>
          <button onClick={exportPDF} className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm flex items-center gap-2">
            <FiDownload size={14} /> Export PDF
          </button>
        </div>
      </div>
      
      <div id="roadmap-content">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-cyan-400">{Math.round(progress)}%</p>
            <p className="text-xs text-gray-500">Overall Progress</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{weeksCompleted}/{weeks.length}</p>
            <p className="text-xs text-gray-500">Weeks Completed</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{answers[8]}</p>
            <p className="text-xs text-gray-500">Daily Hours</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-white">{answers[9]}</p>
            <p className="text-xs text-gray-500">Target Timeline</p>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div className="bg-gradient-to-r from-cyan-500 to-purple-600 h-3 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div className="space-y-3">
          {weeks.map((week, idx) => (
            <div key={week.week} className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
              <button onClick={() => toggleWeek(week.week)} className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${week.completed ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                    {week.completed ? <FiCheckCircle size={16} /> : week.week}
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-white">Week {week.week}: {week.title}</h3>
                    <p className="text-xs text-gray-500">{week.hours} hours estimated</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{week.tasks.filter(t => t.completed).length}/{week.tasks.length} tasks</span>
                  <FiChevronRight className={`text-gray-500 transition-transform ${expandedWeek === week.week ? 'rotate-90' : ''}`} />
                </div>
              </button>
              
              {expandedWeek === week.week && (
                <div className="p-4 pt-0 border-t border-gray-800">
                  <div className="space-y-2 mt-3">
                    {week.tasks.map((task) => (
                      <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/30">
                        <input type="checkbox" checked={task.completed} onChange={() => toggleTask(idx, task.id)} className="w-4 h-4 rounded border-gray-600 accent-cyan-500" />
                        <div className="flex-1">
                          <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-300'}`}>{task.title}</span>
                          {task.description && <p className="text-xs text-gray-500">{task.description}</p>}
                        </div>
                        <span className="text-xs text-gray-500">~{task.hours} hrs</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* AI Resources Section */}
        <div className="mt-8 bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/30 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <FiCpu className="text-cyan-400 text-xl" />
            <h3 className="font-semibold text-white text-lg">🤖 AI Recommended Resources</h3>
          </div>
          
          {aiResources.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {aiResources.map((resource, idx) => (
                <div key={idx} className="bg-gray-800/30 rounded-lg p-4">
                  <h4 className="font-semibold text-cyan-400 mb-2">{resource.topic}</h4>
                  <div className="space-y-2">
                    {resource.resources.map((r, ridx) => (
                      <div key={ridx} className="text-sm">
                        <div className="flex items-center gap-2">
                          {r.type === 'YouTube' ? <FiYoutube className="text-red-400" /> : <FiLink className="text-cyan-400" />}
                          <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-cyan-400 transition-colors">{r.title}</a>
                        </div>
                        <p className="text-xs text-gray-400 ml-6">{r.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm">AI resources will appear here based on your profile and weak areas.</p>
          )}
        </div>
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-500">
        💡 Tip: Check off tasks as you complete them. Your progress is saved automatically!
      </div>
    </div>
  );
}