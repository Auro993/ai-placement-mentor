import { useState } from 'react';
import { 
  FiGithub, 
  FiStar, 
  FiUsers, 
  FiGitBranch,
  FiCalendar,
  FiAward,
  FiTrendingUp,
  FiRefreshCw,
  FiExternalLink,
  FiCode,
  FiFolder,
  FiCpu
} from 'react-icons/fi';
import { useToast } from '../context/ToastContext';

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  location: string;
  company: string;
  followers: number;
  following: number;
  public_repos: number;
  created_at: string;
  html_url: string;
}

interface Repository {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  html_url: string;
}

export default function GitHubInsights() {
  const { success, error } = useToast();
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [insights, setInsights] = useState<string>('');
  
  const fetchGitHubData = async () => {
    if (!username.trim()) {
      error('Please enter a GitHub username');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Fetch user data
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!userResponse.ok) throw new Error('User not found');
      const userData = await userResponse.json();
      setUser(userData);
      
      // Fetch repositories
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20`);
      const reposData = await reposResponse.json();
      setRepos(reposData);
      
      // Calculate insights
      const totalStars = reposData.reduce((acc: number, repo: any) => acc + repo.stargazers_count, 0);
      const totalForks = reposData.reduce((acc: number, repo: any) => acc + repo.forks_count, 0);
      const languages = [...new Set(reposData.map((repo: any) => repo.language).filter(Boolean))];
      
      const insightsText = `
📊 GitHub Profile Analysis for ${userData.name || username}

📈 Stats:
• Total Repositories: ${userData.public_repos}
• Total Stars Earned: ⭐ ${totalStars}
• Total Forks: 🔱 ${totalForks}
• Followers: 👥 ${userData.followers}
• Languages Used: ${languages.slice(0, 5).join(', ')}

💡 Recommendations:
${userData.public_repos < 10 ? '• Create more repositories to showcase your work' : '• Great job! You have a good number of repositories'}
${totalStars < 10 ? '• Engage with open source to earn stars' : '• Excellent! Your projects are getting attention'}
${!userData.bio ? '• Add a bio to tell recruiters about yourself' : '• Good! Your profile has a bio'}
${!userData.location ? '• Add your location for better discoverability' : ''}
      `;
      setInsights(insightsText);
      
      success(`Loaded ${userData.name || username}'s GitHub profile`);
      
    } catch (err) {
      error('GitHub user not found. Check the username and try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const calculateScore = () => {
    if (!user) return 0;
    let score = 50;
    score += Math.min(user.public_repos * 2, 20);
    score += Math.min(user.followers / 5, 15);
    score += user.bio ? 5 : 0;
    score += user.location ? 5 : 0;
    score += user.company ? 5 : 0;
    return Math.min(score, 100);
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-4">
          <FiGithub className="text-cyan-400" />
          <span className="text-sm text-cyan-400">GitHub Profile Analyzer</span>
        </div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          GitHub Insights
        </h1>
        <p className="text-white/60">Analyze any GitHub profile and get AI-powered recommendations</p>
      </div>
      
      {/* Search Input */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Enter GitHub username (e.g., octocat, google)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && fetchGitHubData()}
          className="flex-1 px-4 py-3 rounded-xl bg-gray-900/50 border border-gray-800 focus:border-cyan-500 outline-none text-white"
        />
        <button
          onClick={fetchGitHubData}
          disabled={isLoading}
          className="btn-primary py-3 px-6 flex items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? <FiRefreshCw className="animate-spin" /> : <FiGithub />}
          {isLoading ? 'Fetching...' : 'Analyze'}
        </button>
      </div>
      
      {user && (
        <>
          {/* Profile Card */}
          <div className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/30 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-4">
              <img src={user.avatar_url} alt={user.name} className="w-20 h-20 rounded-full border-2 border-cyan-400" />
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-bold text-white">{user.name || user.login}</h2>
                  <span className="text-sm text-gray-400">@{user.login}</span>
                  <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300">
                    <FiExternalLink size={16} />
                  </a>
                </div>
                {user.bio && <p className="text-gray-400 mt-1">{user.bio}</p>}
                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                  {user.location && <span>📍 {user.location}</span>}
                  {user.company && <span>💼 {user.company}</span>}
                  <span>📅 Joined {new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
              <FiFolder className="text-cyan-400 text-xl mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{user.public_repos}</p>
              <p className="text-xs text-gray-500">Repositories</p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
              <FiUsers className="text-cyan-400 text-xl mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{user.followers}</p>
              <p className="text-xs text-gray-500">Followers</p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
              <FiStar className="text-cyan-400 text-xl mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{repos.reduce((acc, r) => acc + r.stargazers_count, 0)}</p>
              <p className="text-xs text-gray-500">Total Stars</p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${getScoreColor(calculateScore())}`}>{calculateScore()}</div>
              <p className="text-xs text-gray-500">GitHub Score</p>
            </div>
          </div>
          
          {/* Top Repositories */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <FiCode className="text-cyan-400" /> Top Repositories
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {repos.slice(0, 5).map((repo) => (
                <div key={repo.id} className="p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-all">
                  <div className="flex items-center justify-between">
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="font-medium text-cyan-400 hover:underline flex items-center gap-1">
                      {repo.name} <FiExternalLink size={12} />
                    </a>
                    <div className="flex gap-3 text-xs text-gray-500">
                      <span>⭐ {repo.stargazers_count}</span>
                      <span>🔱 {repo.forks_count}</span>
                    </div>
                  </div>
                  {repo.description && <p className="text-sm text-gray-400 mt-1">{repo.description.slice(0, 100)}</p>}
                  {repo.language && <span className="text-xs text-gray-500 mt-1 inline-block">📘 {repo.language}</span>}
                </div>
              ))}
            </div>
          </div>
          
          {/* AI Insights */}
          {insights && (
            <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/30 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <FiCpu className="text-cyan-400" />
                <h3 className="font-semibold text-white">AI Recommendations</h3>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-gray-300 font-sans leading-relaxed">{insights}</pre>
            </div>
          )}
        </>
      )}
      
      {!user && !isLoading && (
        <div className="text-center py-12 text-gray-500">
          <FiGithub className="text-5xl mx-auto mb-3 opacity-30" />
          <p>Enter a GitHub username to analyze their profile</p>
        </div>
      )}
    </div>
  );
}