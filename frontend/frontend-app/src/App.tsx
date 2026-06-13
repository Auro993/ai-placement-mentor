import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './layouts/MainLayout';
import Roadmap from './pages/Roadmap';
import Companies from './pages/Companies';
import Coding from './pages/Coding';
import CoverLetter from './pages/CoverLetter';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import GitHubInsights from './pages/GitHubInsights';
import LinkedInStudio from './pages/LinkedInStudio';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Resume from './pages/Resume';
import MockInterview from './pages/MockInterview';
import Profile from './pages/Profile';
import CompanyDetails from './pages/CompanyDetails';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes - Require Authentication */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/resume" element={<Resume />} />
                <Route path="/interview" element={<MockInterview />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/companies/:id" element={<CompanyDetails />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/coding" element={<Coding />} />
                <Route path="/cover-letter" element={<CoverLetter />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/github-insights" element={<GitHubInsights />} />
                <Route path="/linkedin-studio" element={<LinkedInStudio />} />
              </Route>
            </Route>
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;