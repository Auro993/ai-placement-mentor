import { FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  user: any;
}

export default function Navbar({ user }: NavbarProps) {
  const { logout } = useAuth();
  
  return (
    <nav className="glass-card mx-4 mt-4 px-6 py-3 flex justify-end items-center">
      {/* REMOVED the logo section - it's already in sidebar */}
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
          <FiUser className="text-cyan-400" />
          <span className="text-sm font-medium">{user?.name || 'User'}</span>
        </div>
        <button onClick={logout} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
          <FiLogOut className="text-red-400" />
        </button>
      </div>
    </nav>
  );
}