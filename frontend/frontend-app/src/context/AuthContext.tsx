import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  skills: string[];
  careerGoal: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, navigate: (path: string) => void) => Promise<void>;
  register: (data: { email: string; password: string; name: string; skills: string[]; careerGoal: string }, navigate: (path: string) => void) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// ✅ Use environment variable for API URL
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string, navigate: (path: string) => void) => {
    setIsLoading(true);
    try {
      console.log("Logging in with:", email, password);
      
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      console.log("Login response status:", response.status);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }
      
      const data = await response.json();
      console.log("Login response data:", data);
      
      const userData: User = {
        id: data.id?.toString() || Date.now().toString(),
        email: data.email,
        name: data.name,
        skills: data.skills || [],
        careerGoal: data.careerGoal || '',
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { email: string; password: string; name: string; skills: string[]; careerGoal: string }, navigate: (path: string) => void) => {
    setIsLoading(true);
    try {
      console.log("Registering with:", data);
      
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          skills: data.skills.join(','),
          careerGoal: data.careerGoal
        }),
      });
      
      console.log("Register response status:", response.status);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }
      
      const result = await response.json();
      console.log("Register response data:", result);
      
      navigate('/login');
      
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};