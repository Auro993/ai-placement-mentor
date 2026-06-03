import { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiSave,
  FiX,
  FiUpload,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiBookOpen,
  FiAward,
  FiFolder,
  FiTool,
  FiFile
} from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:8080/api';

// Unique interface names to avoid conflicts with Resume.tsx
interface ProfileSkill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface ProfileProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link: string;
}

interface ProfileEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  grade: string;
}

interface ProfileSocialLink {
  platform: string;
  url: string;
}

export default function Profile() {
  const { user } = useAuth();
  const { success, error } = useToast();
  
  const [profile, setProfile] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    jobStatus: 'Active',
    recruiterVisibility: false
  });
  
  const [skills, setSkills] = useState<ProfileSkill[]>([
    { id: '1', name: 'React', level: 'Advanced' },
    { id: '2', name: 'TypeScript', level: 'Intermediate' },
    { id: '3', name: 'Spring Boot', level: 'Intermediate' },
  ]);
  const [newSkill, setNewSkill] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  
  const [projects, setProjects] = useState<ProfileProject[]>([
    { id: '1', title: 'AI Placement Mentor', description: 'Full-stack AI-powered placement preparation platform', technologies: ['React', 'Spring Boot', 'MySQL'], link: '' }
  ]);
  
  const [education, setEducation] = useState<ProfileEducation[]>([
    { id: '1', institution: '', degree: '', field: '', startYear: '', endYear: '', grade: '' }
  ]);
  
  const [socialLinks, setSocialLinks] = useState<ProfileSocialLink[]>([
    { platform: 'GitHub', url: '' },
    { platform: 'LinkedIn', url: '' },
    { platform: 'Twitter', url: '' }
  ]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileStrength, setProfileStrength] = useState(20);
  const [joinedDate] = useState('May 2026');
  const [resumeCount, setResumeCount] = useState(1);
  const [plan] = useState('Free');
  
  useEffect(() => {
    calculateStrength();
  }, [profile, skills, projects, education]);
  
  const calculateStrength = () => {
    let strength = 0;
    if (profile.fullName) strength += 5;
    if (profile.email) strength += 5;
    if (profile.phone) strength += 5;
    if (profile.location) strength += 5;
    if (profile.bio && profile.bio.length > 50) strength += 10;
    else if (profile.bio && profile.bio.length > 20) strength += 5;
    strength += Math.min(20, skills.length * 4);
    strength += Math.min(20, projects.filter(p => p.title && p.description).length * 5);
    strength += Math.min(15, education.filter(e => e.institution && e.degree).length * 5);
    setProfileStrength(Math.min(100, strength));
  };
  
  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { id: Date.now().toString(), name: newSkill.trim(), level: newSkillLevel }]);
      setNewSkill('');
      success('Skill added successfully!');
    }
  };
  
  const removeSkill = (id: string) => {
    setSkills(skills.filter(s => s.id !== id));
  };
  
  const addProject = () => {
    setProjects([...projects, { id: Date.now().toString(), title: '', description: '', technologies: [], link: '' }]);
  };
  
  const updateProject = (id: string, field: string, value: any) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };
  
  const removeProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };
  
  const addEducation = () => {
    setEducation([...education, { id: Date.now().toString(), institution: '', degree: '', field: '', startYear: '', endYear: '', grade: '' }]);
  };
  
  const updateEducation = (id: string, field: string, value: string) => {
    setEducation(education.map(e => e.id === id ? { ...e, [field]: value } : e));
  };
  
  const removeEducation = (id: string) => {
    setEducation(education.filter(e => e.id !== id));
  };
  
  const saveProfile = async () => {
    try {
      success('Profile saved successfully!');
      setIsEditing(false);
    } catch (err) {
      error('Failed to save profile');
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Profile</h1>
        <p className="text-white/60">Complete your profile to attract recruiters and get better job matches</p>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                  <FiUser className="text-cyan-400 text-xl" />
                </div>
                <h2 className="text-xl font-semibold">Basic Information</h2>
              </div>
              <button onClick={() => setIsEditing(!isEditing)} className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2">
                <FiEdit2 size={16} />
                <span className="text-sm">{isEditing ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm text-white/50 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                  />
                ) : (
                  <p className="text-white text-lg">{profile.fullName || '—'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm text-white/50 mb-1">Email</label>
                <p className="text-white">{profile.email}</p>
              </div>
              
              <div>
                <label className="block text-sm text-white/50 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                  />
                ) : (
                  <p className="text-white">{profile.phone || '—'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm text-white/50 mb-1">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    placeholder="e.g., Mumbai, India"
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                  />
                ) : (
                  <p className="text-white">{profile.location || '—'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm text-white/50 mb-1">Job Status</label>
                {isEditing ? (
                  <select
                    value={profile.jobStatus}
                    onChange={(e) => setProfile({ ...profile, jobStatus: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                  >
                    <option>Actively Looking</option>
                    <option>Open to Opportunities</option>
                    <option>Not Looking</option>
                  </select>
                ) : (
                  <p className="text-white">{profile.jobStatus}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Bio Card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                <FiBookOpen className="text-cyan-400 text-xl" />
              </div>
              <h2 className="text-xl font-semibold">About Me</h2>
            </div>
            
            {isEditing ? (
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Tell recruiters about yourself, your experience, and career goals..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
              />
            ) : (
              <p className="text-white/70 leading-relaxed">{profile.bio || 'No bio added yet. Click edit to add one.'}</p>
            )}
          </div>
          
          {/* Education Card */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                  <FiAward className="text-cyan-400 text-xl" />
                </div>
                <h2 className="text-xl font-semibold">Education</h2>
              </div>
              {isEditing && (
                <button onClick={addEducation} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-sm">
                  <FiPlus /> Add
                </button>
              )}
            </div>
            
            {education.map((edu, idx) => (
              <div key={edu.id} className="mb-4 p-4 bg-white/5 rounded-xl relative">
                {isEditing && idx > 0 && (
                  <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-300">
                    <FiTrash2 size={16} />
                  </button>
                )}
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="College / University"
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                    disabled={!isEditing}
                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white disabled:opacity-50"
                  />
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    disabled={!isEditing}
                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white disabled:opacity-50"
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Skills Card */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                <FiTool className="text-cyan-400 text-xl" />
              </div>
              <h2 className="text-xl font-semibold">Skills</h2>
              <span className="text-sm text-white/40">({skills.length})</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <span>{skill.name}</span>
                  <span className="text-xs text-white/40">({skill.level})</span>
                  {isEditing && (
                    <button onClick={() => removeSkill(skill.id)} className="hover:text-red-400 ml-1">
                      <FiX size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {isEditing && (
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  placeholder="Type a skill (e.g., React, Python, AWS)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                />
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
                <button onClick={addSkill} className="btn-primary py-2 px-5 flex items-center gap-1">
                  <FiPlus /> Add
                </button>
              </div>
            )}
          </div>
          
          {/* Projects Card */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                  <FiFolder className="text-cyan-400 text-xl" />
                </div>
                <h2 className="text-xl font-semibold">Projects</h2>
              </div>
              {isEditing && (
                <button onClick={addProject} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-sm">
                  <FiPlus /> Add
                </button>
              )}
            </div>
            
            {projects.map((project) => (
              <div key={project.id} className="mb-4 p-4 bg-white/5 rounded-xl relative">
                {isEditing && (
                  <button onClick={() => removeProject(project.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-300">
                    <FiTrash2 size={16} />
                  </button>
                )}
                <input
                  type="text"
                  placeholder="Project Title"
                  value={project.title}
                  onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                  disabled={!isEditing}
                  className="w-full mb-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white disabled:opacity-50"
                />
                <textarea
                  placeholder="Project Description"
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  disabled={!isEditing}
                  rows={2}
                  className="w-full mb-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white disabled:opacity-50"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Profile Strength Card */}
          <div className="glass-card p-6 text-center">
            <h3 className="font-semibold mb-4">Profile Strength</h3>
            <div className="relative w-28 h-28 mx-auto mb-4">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle cx="56" cy="56" r="50" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none"/>
                <circle 
                  cx="56" cy="56" r="50" 
                  stroke="url(#strengthGradient)" 
                  strokeWidth="8" 
                  fill="none"
                  strokeDasharray={`${profileStrength * 3.14} 314`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="strengthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#06b6d4"/>
                    <stop offset="100%" stopColor="#a855f7"/>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{profileStrength}%</span>
                <span className="text-xs text-white/40">Complete</span>
              </div>
            </div>
            <p className="text-white/50 text-sm">Add more details to increase your profile strength</p>
          </div>
          
          {/* Statistics Card */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/60">Joined</span>
                <span className="text-white">{joinedDate}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/60">Resumes</span>
                <span className="text-white">{resumeCount}/2</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/60">Skills</span>
                <span className="text-white">{skills.length}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/60">Plan</span>
                <span className="text-cyan-400">{plan}</span>
              </div>
            </div>
          </div>
          
          {/* Recruiter Visibility Card */}
          <div className="glass-card p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Recruiter Visibility</h3>
              <button 
                onClick={() => setProfile({ ...profile, recruiterVisibility: !profile.recruiterVisibility })}
                className={`px-3 py-1 rounded-full text-xs ${profile.recruiterVisibility ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
              >
                {profile.recruiterVisibility ? 'Visible' : 'Hidden'}
              </button>
            </div>
            <p className="text-white/40 text-sm">
              {profile.recruiterVisibility 
                ? 'Recruiters can find you in talent search' 
                : 'Your profile is hidden from recruiters'}
            </p>
          </div>
          
          {/* Social Links Card */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Social Links</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FiGithub className="text-cyan-400 text-xl" />
                <input
                  type="url"
                  placeholder="GitHub URL"
                  value={socialLinks.find(s => s.platform === 'GitHub')?.url || ''}
                  onChange={(e) => setSocialLinks(socialLinks.map(s => s.platform === 'GitHub' ? { ...s, url: e.target.value } : s))}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <FiLinkedin className="text-cyan-400 text-xl" />
                <input
                  type="url"
                  placeholder="LinkedIn URL"
                  value={socialLinks.find(s => s.platform === 'LinkedIn')?.url || ''}
                  onChange={(e) => setSocialLinks(socialLinks.map(s => s.platform === 'LinkedIn' ? { ...s, url: e.target.value } : s))}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white text-sm"
                />
              </div>
              <div className="flex items-center gap-3">
                <FiTwitter className="text-cyan-400 text-xl" />
                <input
                  type="url"
                  placeholder="Twitter URL"
                  value={socialLinks.find(s => s.platform === 'Twitter')?.url || ''}
                  onChange={(e) => setSocialLinks(socialLinks.map(s => s.platform === 'Twitter' ? { ...s, url: e.target.value } : s))}
                  className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white text-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Save Button */}
          {isEditing && (
            <button onClick={saveProfile} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              <FiSave /> Save All Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}