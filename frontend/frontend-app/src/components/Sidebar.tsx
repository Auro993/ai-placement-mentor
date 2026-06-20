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
  FiFolder,
  FiChevronLeft,
  FiChevronRight,
  FiPlus
} from 'react-icons/fi';
import { useSidebar } from '../context/SidebarContext';
import { useChat } from '../context/ChatContext';

export default function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { sessions, currentSessionId, switchSession, createNewSession, deleteSession } = useChat();
  
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
    <>
      {/* Sidebar */}
      <aside 
        className={`bg-[#0D0D12] border-r border-white/10 flex flex-col h-screen transition-all duration-300 overflow-hidden ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Logo Section */}
        <div className={`p-2 border-b border-white/10 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-0'}`}>
            <img
              src="/logo.png"
              alt="JobGenie Logo"
              className={`${isCollapsed ? 'w-10 h-10' : 'w-20 h-20'} rounded-xl object-cover`}
            />
            {!isCollapsed && (
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  JobGenie
                </h1>
                <p className="text-gray-400 text-sm tracking-wide uppercase">
                  AI Placement Mentor
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Collapse Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute z-50 bg-[#0D0D12] border border-white/10 rounded-full p-1 hover:bg-cyan-500/20 transition-colors"
          style={{ 
            top: '50%', 
            transform: 'translateY(-50%)',
            left: isCollapsed ? '68px' : '280px' 
          }}
        >
          {isCollapsed ? <FiChevronRight className="text-cyan-400" /> : <FiChevronLeft className="text-cyan-400" />}
        </button>
        
        {/* New Chat Button */}
        <div className={`p-3 border-b border-white/10 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button 
            onClick={createNewSession}
            className={`flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl transition-all ${
              isCollapsed ? 'w-10 h-10 p-0' : 'w-full py-2 px-4 text-sm'
            }`}
          >
            <FiPlus size={isCollapsed ? 20 : 16} />
            {!isCollapsed && 'New Chat'}
          </button>
        </div>
        
        {/* Navigation Menu */}
        <nav className={`flex-1 p-2 space-y-0.5 overflow-y-auto ${isCollapsed ? 'items-center' : ''}`}>
          {mainNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border-l-2 border-cyan-500' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon size={isCollapsed ? 22 : 18} />
              {!isCollapsed && <span className="text-sm">{item.label}</span>}
            </NavLink>
          ))}
        </nav>
        
        {/* Profile Section */}
        <div className={`p-2 border-t border-white/10 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <NavLink
            to="/profile"
            className={({ isActive }) => 
              `flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <div className={`rounded-full bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center ${isCollapsed ? 'w-8 h-8' : 'w-8 h-8'}`}>
              <FiUser size={isCollapsed ? 16 : 15} />
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-sm font-medium">My Profile</p>
                <p className="text-[10px] text-gray-500">View and edit profile</p>
              </div>
            )}
          </NavLink>
        </div>
      </aside>
    </>
  );
}