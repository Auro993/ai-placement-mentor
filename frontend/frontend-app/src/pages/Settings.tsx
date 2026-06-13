import { useState } from 'react';
import { 
  FiBell, 
  FiLock, 
  FiRefreshCw,
  FiLogOut,
  FiTrash2
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Settings() {
  const { logout } = useAuth();
  const { success, error } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    interviewReminders: true,
    weeklyReport: false,
    marketing: false
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      error('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    try {
      success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      logout();
      success('Account deleted');
    }
  };
  
  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    success(`${key} notification ${!notifications[key] ? 'enabled' : 'disabled'}`);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-white/60">Manage your account preferences</p>
      </div>
      
      <div className="space-y-6">
        {/* Notification Settings */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiBell className="text-cyan-400" /> Notifications
          </h2>
          <div className="space-y-3">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-800">
                <span className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <button
                  onClick={() => toggleNotification(key as keyof typeof notifications)}
                  className={`w-12 h-6 rounded-full transition-all ${value ? 'bg-cyan-500' : 'bg-gray-700'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-all transform ${value ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Change Password */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <FiLock className="text-cyan-400" /> Change Password
          </h2>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white"
            />
            <input
              type="password"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white"
            />
            <button
              onClick={handleChangePassword}
              disabled={isLoading}
              className="btn-secondary py-2 px-6 disabled:opacity-50"
            >
              Update Password
            </button>
          </div>
        </div>
        
        {/* Danger Zone */}
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-red-400 mb-4 flex items-center gap-2">
            <FiTrash2 /> Delete Account
          </h2>
          <p className="text-gray-400 text-sm mb-4">Once you delete your account, there is no going back. All your data will be permanently removed.</p>
          <button
            onClick={handleDeleteAccount}
            className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Delete Account
          </button>
        </div>
        
        {/* Logout */}
        <button
          onClick={logout}
          className="w-full py-3 rounded-xl bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
}