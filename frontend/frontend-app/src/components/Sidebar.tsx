import { NavLink } from 'react-router-dom';
import { 
  FiMessageSquare, 
  FiGrid, 
  FiUpload, 
  FiMic, 
  FiUser, 
  FiSettings,
  FiBookOpen,
  FiBriefcase,
  FiCode,
  FiMail,
  FiBarChart2,
  FiStar,
  FiAward,
  FiGithub,
  FiLinkedin,
  FiFolder
} from 'react-icons/fi';

export default function Sidebar() {
  
  const handleUpgradeClick = () => {
    alert("Premium features coming soon! 🚀");
  };
  
  // Main navigation items
  const mainNavItems = [
    { path: '/dashboard', icon: FiGrid, label: 'Dashboard' },
    { path: '/chat', icon: FiMessageSquare, label: 'AI Mentor Chat' },
    { path: '/interview', icon: FiMic, label: 'Interview Practice' },
    { path: '/resume', icon: FiUpload, label: 'Resume Analyzer' },
    { path: '/roadmap', icon: FiBookOpen, label: 'Roadmap' },
    { path: '/companies', icon: FiBriefcase, label: 'Company Prep' },
    { path: '/coding', icon: FiCode, label: 'Coding Practice' },
    { path: '/github-insights', icon: FiGithub, label: 'GitHub Insights' },
    { path: '/linkedin-studio', icon: FiLinkedin, label: 'LinkedIn Studio' },
    { path: '/progress', icon: FiBarChart2, label: 'Progress & Analytics' },
    { path: '/portfolio-builder', icon: FiFolder, label: 'Portfolio Builder' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
  ];
  
  return (
    <aside className="w-72 bg-[#0D0D12] border-r border-white/10 flex flex-col h-screen overflow-y-auto">
      
      {/* Logo Section - Styled Text */}
      <div className="p-2 border-b border-white/10">
        <div className="flex items-center gap-0">
          <img
            src="/logo.png"
            alt="JobGenie Logo"
            className="w-20 h-20 rounded-xl object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              JobGenie
            </h1>
            <p className="text-gray-400 text-sm tracking-wide uppercase">
              AI Placement Mentor
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="p-3 space-y-0.5">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border-l-2 border-cyan-500' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon size={18} />
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* Upgrade to Pro - WITH ALERT */}
      <div className="p-4 mt-4 border-t border-white/10">
        <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 rounded-xl p-3 border border-cyan-500/20">
          <div className="flex items-center gap-2 mb-1">
            <FiAward className="text-yellow-500 text-sm" />
            <h3 className="font-semibold text-white text-xs">Upgrade to Pro</h3>
          </div>
          <p className="text-[10px] text-gray-400 leading-relaxed mb-2">
            Unlock advanced features and AI feedback.
          </p>
          <button 
            onClick={handleUpgradeClick}
            className="w-full py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600 text-white text-[10px] font-medium hover:from-cyan-500 hover:to-purple-500 transition-all"
          >
            Upgrade Now →
          </button>
        </div>
      </div>
      
      {/* Profile Section */}
      <div className="p-3 border-t border-white/10 mt-auto">
        <NavLink
          to="/profile"
          className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
              isActive 
                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`
          }
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center">
            <FiUser size={15} />
          </div>
          <div>
            <p className="text-sm font-medium">My Profile</p>
            <p className="text-[10px] text-gray-500">View and edit profile</p>
          </div>
        </NavLink>
      </div>
      
    </aside>
  );
}