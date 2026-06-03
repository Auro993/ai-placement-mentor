import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';

export default function Register() {
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    name: '', 
    skills: '', 
    careerGoal: '' 
  });
  const { register, isLoading } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate skills
    if (!form.skills.trim()) {
      error('Please enter at least one skill');
      return;
    }
    
    try {
      await register({ 
        ...form, 
        skills: form.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
      }, navigate);
      
      // Show success message
      success('Account created successfully! Please login to continue.');
      
      // ✅ Redirect to Login page (not dashboard)
      navigate('/login');
      
    } catch (err) {
      error('Registration failed. Please try again.');
      console.error(err);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F] p-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="glass-card w-full max-w-md p-8"
      >
        <h2 className="text-3xl font-bold gradient-text text-center mb-6">Get Started</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-white/70">Full Name</label>
            <input 
              type="text" 
              placeholder="John Doe" 
              value={form.name} 
              onChange={e => setForm({ ...form, name: e.target.value })} 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-white/70">Email</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={form.email} 
              onChange={e => setForm({ ...form, email: e.target.value })} 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-white/70">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={form.password} 
              onChange={e => setForm({ ...form, password: e.target.value })} 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white" 
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-white/70">
              Skills (comma separated)
            </label>
            <input 
              type="text" 
              placeholder="React, Java, Python, Spring Boot" 
              value={form.skills} 
              onChange={e => setForm({ ...form, skills: e.target.value })} 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white" 
              required 
            />
            <p className="text-white/40 text-xs mt-1">Example: React, Java, Python, SQL</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-white/70">Career Goal</label>
            <select 
              value={form.careerGoal} 
              onChange={e => setForm({ ...form, careerGoal: e.target.value })} 
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
              required
            >
              <option value="" className="bg-[#0A0A0F]">Select Career Goal</option>
              <option className="bg-[#0A0A0F]">Frontend Developer</option>
              <option className="bg-[#0A0A0F]">Backend Developer</option>
              <option className="bg-[#0A0A0F]">Full Stack Developer</option>
              <option className="bg-[#0A0A0F]">Data Scientist</option>
              <option className="bg-[#0A0A0F]">DevOps Engineer</option>
              <option className="bg-[#0A0A0F]">AI/ML Engineer</option>
              <option className="bg-[#0A0A0F]">Cloud Architect</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full btn-primary py-3 mt-4"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        
        <p className="text-center mt-6 text-white/60">
          Already have an account? <Link to="/login" className="text-cyan-400 hover:underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}