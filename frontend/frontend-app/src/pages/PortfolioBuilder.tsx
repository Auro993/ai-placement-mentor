import { useState } from 'react';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiGithub, 
  FiLinkedin, 
  FiTwitter,
  FiGlobe,
  FiPlus,
  FiTrash2,
  FiSave,
  FiEye,
  FiCheckCircle,
  FiAlertCircle,
  FiBriefcase,
  FiBookOpen,
  FiCode,
  FiAward,
  FiArrowRight,
  FiArrowLeft
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  liveLink: string;
  githubLink: string;
}

interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

interface Skill {
  id: string;
  name: string;
  level: number;
}

export default function PortfolioBuilder() {
  const { user } = useAuth();
  const { success, error } = useToast();
  
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [template, setTemplate] = useState('modern');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Validation function
  const validateStep = (stepNum: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (stepNum === 1) {
      if (!personalInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!personalInfo.title.trim()) newErrors.title = 'Professional title is required';
      if (!personalInfo.bio.trim()) newErrors.bio = 'Bio is required';
      if (!personalInfo.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(personalInfo.email)) newErrors.email = 'Valid email is required';
    }
    
    if (stepNum === 2) {
      if (skills.length === 0) newErrors.skills = 'Add at least one skill';
      if (projects.length === 0 || projects.every(p => !p.title.trim())) newErrors.projects = 'Add at least one project';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      error('Please fill all required fields');
    }
  };
  
  // Portfolio Data
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.name || '',
    title: '',
    bio: '',
    email: user?.email || '',
    phone: '',
    location: '',
    avatar: '',
  });
  
  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: '', level: 50 }
  ]);
  
  const [projects, setProjects] = useState<Project[]>([
    { id: '1', title: '', description: '', technologies: [], liveLink: '', githubLink: '' }
  ]);
  
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  
  const [socialLinks, setSocialLinks] = useState({
    github: '',
    linkedin: '',
    twitter: '',
    website: ''
  });
  
  const templates = [
    { id: 'modern', name: 'Modern', color: 'from-cyan-500 to-purple-600', preview: 'Clean gradient design', bg: 'bg-gradient-to-br from-gray-900 to-gray-800' },
    { id: 'minimal', name: 'Minimal', color: 'from-gray-500 to-gray-700', preview: 'Simple and elegant', bg: 'bg-white' },
    { id: 'dark', name: 'Dark Theme', color: 'from-blue-500 to-indigo-600', preview: 'Professional dark theme', bg: 'bg-black' },
  ];
  
  const addProject = () => {
    setProjects([...projects, { id: Date.now().toString(), title: '', description: '', technologies: [], liveLink: '', githubLink: '' }]);
  };
  
  const updateProject = (id: string, field: string, value: any) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };
  
  const removeProject = (id: string) => {
    if (projects.length > 1) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };
  
  const addSkill = () => {
    setSkills([...skills, { id: Date.now().toString(), name: '', level: 50 }]);
  };
  
  const updateSkill = (id: string, field: string, value: any) => {
    setSkills(skills.map(s => s.id === id ? { ...s, [field]: value } : s));
  };
  
  const removeSkill = (id: string) => {
    if (skills.length > 1) {
      setSkills(skills.filter(s => s.id !== id));
    }
  };
  
  const addExperience = () => {
    setExperiences([...experiences, { id: Date.now().toString(), company: '', role: '', duration: '', description: '' }]);
  };
  
  const updateExperience = (id: string, field: string, value: any) => {
    setExperiences(experiences.map(e => e.id === id ? { ...e, [field]: value } : e));
  };
  
  const removeExperience = (id: string) => {
    setExperiences(experiences.filter(e => e.id !== id));
  };
  
  const addEducation = () => {
    setEducations([...educations, { id: Date.now().toString(), institution: '', degree: '', year: '' }]);
  };
  
  const updateEducation = (id: string, field: string, value: any) => {
    setEducations(educations.map(e => e.id === id ? { ...e, [field]: value } : e));
  };
  
  const removeEducation = (id: string) => {
    setEducations(educations.filter(e => e.id !== id));
  };
  
  const generatePortfolio = async () => {
    if (!validateStep(step)) {
      error('Please fill all required fields');
      return;
    }
    
    setIsGenerating(true);
    
    const portfolioData = {
      personalInfo,
      skills: skills.filter(s => s.name.trim()),
      projects: projects.filter(p => p.title.trim()),
      experiences,
      educations,
      socialLinks,
      template,
      username: user?.email?.split('@')[0] || 'user'
    };
    
    localStorage.setItem('portfolio_data', JSON.stringify(portfolioData));
    
    setTimeout(() => {
      const url = `${window.location.origin}/portfolio/${user?.email?.split('@')[0] || 'user'}`;
      setGeneratedUrl(url);
      success('Portfolio generated successfully!');
      setIsGenerating(false);
      setStep(4);
    }, 2000);
  };
  
  const copyUrl = () => {
    navigator.clipboard.writeText(generatedUrl);
    success('URL copied to clipboard!');
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Portfolio Website Builder
        </h1>
        <p className="text-white/60">Create your professional portfolio website in minutes</p>
      </div>
      
      {/* Steps */}
      <div className="flex justify-between mb-10">
        {[
          { num: 1, label: 'Personal Info', required: true },
          { num: 2, label: 'Portfolio Content', required: true },
          { num: 3, label: 'Template', required: true },
          { num: 4, label: 'Done!', required: false },
        ].map((s) => (
          <div key={s.num} className="flex-1 text-center">
            <div className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold transition-all ${
              step >= s.num 
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' 
                : 'bg-gray-800 text-gray-500'
            }`}>
              {step > s.num ? <FiCheckCircle /> : s.num}
            </div>
            <p className={`text-xs mt-2 ${step >= s.num ? 'text-cyan-400' : 'text-gray-500'}`}>
              {s.label} {s.required && <span className="text-red-400">*</span>}
            </p>
          </div>
        ))}
      </div>
      
      {/* Step 1: Personal Info */}
      {step === 1 && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full Name <span className="text-red-400">*</span></label>
              <input type="text" value={personalInfo.fullName} onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })} className={`w-full px-4 py-2 rounded-xl bg-gray-800/50 border ${errors.fullName ? 'border-red-500' : 'border-gray-700'} focus:border-cyan-500 outline-none text-white`} />
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Professional Title <span className="text-red-400">*</span></label>
              <input type="text" value={personalInfo.title} onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })} placeholder="e.g., Software Engineer" className={`w-full px-4 py-2 rounded-xl bg-gray-800/50 border ${errors.title ? 'border-red-500' : 'border-gray-700'} focus:border-cyan-500 outline-none text-white`} />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Bio / About Me <span className="text-red-400">*</span></label>
              <textarea rows={3} value={personalInfo.bio} onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })} placeholder="Tell us about yourself, your experience, and what you're passionate about..." className={`w-full px-4 py-2 rounded-xl bg-gray-800/50 border ${errors.bio ? 'border-red-500' : 'border-gray-700'} focus:border-cyan-500 outline-none text-white`} />
              {errors.bio && <p className="text-red-400 text-xs mt-1">{errors.bio}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email <span className="text-red-400">*</span></label>
              <input type="email" value={personalInfo.email} onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })} className={`w-full px-4 py-2 rounded-xl bg-gray-800/50 border ${errors.email ? 'border-red-500' : 'border-gray-700'} focus:border-cyan-500 outline-none text-white`} />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone (Optional)</label>
              <input type="tel" value={personalInfo.phone} onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Location (Optional)</label>
              <input type="text" value={personalInfo.location} onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })} placeholder="Mumbai, India" className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Profile Picture URL (Optional)</label>
              <input type="url" value={personalInfo.avatar} onChange={(e) => setPersonalInfo({ ...personalInfo, avatar: e.target.value })} placeholder="https://your-image.jpg" className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" />
            </div>
          </div>
          
          <div className="flex justify-end mt-8">
            <button onClick={handleNext} className="btn-primary py-2 px-6 flex items-center gap-2">
              Next <FiArrowRight />
            </button>
          </div>
        </div>
      )}
      
      {/* Step 2: Portfolio Content */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Skills */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Technical Skills <span className="text-red-400 text-sm">*</span></h3>
              <button onClick={addSkill} className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"><FiPlus /> Add Skill</button>
            </div>
            {errors.skills && <p className="text-red-400 text-sm mb-3">{errors.skills}</p>}
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-3">
                  <input type="text" value={skill.name} onChange={(e) => updateSkill(skill.id, 'name', e.target.value)} placeholder="Skill name (e.g., React, Python)" className="flex-1 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" />
                  <input type="range" min="0" max="100" value={skill.level} onChange={(e) => updateSkill(skill.id, 'level', parseInt(e.target.value))} className="w-32" />
                  <span className="text-cyan-400 text-sm w-12">{skill.level}%</span>
                  {skills.length > 1 && <button onClick={() => removeSkill(skill.id)} className="text-red-400"><FiTrash2 /></button>}
                </div>
              ))}
            </div>
          </div>
          
          {/* Projects */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Projects <span className="text-red-400 text-sm">*</span></h3>
              <button onClick={addProject} className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"><FiPlus /> Add Project</button>
            </div>
            {errors.projects && <p className="text-red-400 text-sm mb-3">{errors.projects}</p>}
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="p-4 bg-gray-800/30 rounded-lg relative">
                  {projects.length > 1 && <button onClick={() => removeProject(project.id)} className="absolute top-2 right-2 text-red-400"><FiTrash2 size={16} /></button>}
                  <div className="grid gap-3">
                    <input type="text" placeholder="Project Title *" value={project.title} onChange={(e) => updateProject(project.id, 'title', e.target.value)} className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" />
                    <textarea placeholder="Project Description" value={project.description} onChange={(e) => updateProject(project.id, 'description', e.target.value)} rows={2} className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" />
                    <input type="text" placeholder="Technologies (comma separated)" value={project.technologies.join(', ')} onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(',').map(s => s.trim()))} className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" />
                    <div className="flex gap-3">
                      <input type="url" placeholder="GitHub Link" value={project.githubLink} onChange={(e) => updateProject(project.id, 'githubLink', e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" />
                      <input type="url" placeholder="Live Demo Link" value={project.liveLink} onChange={(e) => updateProject(project.id, 'liveLink', e.target.value)} className="flex-1 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Experience (Optional) */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Work Experience (Optional)</h3>
              <button onClick={addExperience} className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"><FiPlus /> Add Experience</button>
            </div>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="p-4 bg-gray-800/30 rounded-lg relative">
                  {experiences.length > 0 && <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-red-400"><FiTrash2 size={16} /></button>}
                  <div className="grid md:grid-cols-2 gap-3">
                    <input type="text" placeholder="Company" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" />
                    <input type="text" placeholder="Role" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" />
                    <input type="text" placeholder="Duration (e.g., 2022-2024)" value={exp.duration} onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)} className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" />
                    <textarea placeholder="Description" value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} rows={2} className="md:col-span-2 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Education (Optional) */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Education (Optional)</h3>
              <button onClick={addEducation} className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"><FiPlus /> Add Education</button>
            </div>
            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id} className="p-4 bg-gray-800/30 rounded-lg relative">
                  {educations.length > 0 && <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-red-400"><FiTrash2 size={16} /></button>}
                  <div className="grid md:grid-cols-2 gap-3">
                    <input type="text" placeholder="Institution" value={edu.institution} onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)} className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" />
                    <input type="text" placeholder="Degree" value={edu.degree} onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)} className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" />
                    <input type="text" placeholder="Year" value={edu.year} onChange={(e) => updateEducation(edu.id, 'year', e.target.value)} className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Social Links */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Social Links (Optional)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2"><FiGithub className="text-cyan-400" /><input type="url" placeholder="GitHub URL" value={socialLinks.github} onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })} className="flex-1 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" /></div>
              <div className="flex items-center gap-2"><FiLinkedin className="text-cyan-400" /><input type="url" placeholder="LinkedIn URL" value={socialLinks.linkedin} onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })} className="flex-1 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" /></div>
              <div className="flex items-center gap-2"><FiTwitter className="text-cyan-400" /><input type="url" placeholder="Twitter URL" value={socialLinks.twitter} onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })} className="flex-1 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" /></div>
              <div className="flex items-center gap-2"><FiGlobe className="text-cyan-400" /><input type="url" placeholder="Personal Website" value={socialLinks.website} onChange={(e) => setSocialLinks({ ...socialLinks, website: e.target.value })} className="flex-1 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white" /></div>
            </div>
          </div>
          
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="btn-secondary py-2 px-6 flex items-center gap-2"><FiArrowLeft /> Back</button>
            <button onClick={handleNext} className="btn-primary py-2 px-6 flex items-center gap-2">Next <FiArrowRight /></button>
          </div>
        </div>
      )}
      
      {/* Step 3: Choose Template */}
      {step === 3 && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
          <h2 className="text-xl font-semibold text-white mb-6">Choose Your Template</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {templates.map((t) => (
              <div
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className={`cursor-pointer rounded-xl p-6 border-2 transition-all ${
                  template === t.id ? 'border-cyan-500 bg-cyan-500/10' : 'border-gray-700 hover:border-gray-500'
                }`}
              >
                <div className={`h-32 rounded-lg bg-gradient-to-r ${t.color} mb-4 flex items-center justify-center`}>
                  <span className="text-white text-lg font-bold">Preview</span>
                </div>
                <h3 className="font-semibold text-white">{t.name}</h3>
                <p className="text-sm text-gray-400">{t.preview}</p>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-8">
            <button onClick={() => setStep(2)} className="btn-secondary py-2 px-6 flex items-center gap-2"><FiArrowLeft /> Back</button>
            <button onClick={generatePortfolio} disabled={isGenerating} className="btn-primary py-2 px-6 flex items-center gap-2 disabled:opacity-50">
              {isGenerating ? <FiSave className="animate-spin" /> : <FiEye />}
              {isGenerating ? 'Generating...' : 'Generate Portfolio'}
            </button>
          </div>
        </div>
      )}
      
      {/* Step 4: Done */}
      {step === 4 && (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="text-green-400 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Portfolio Generated!</h2>
          <p className="text-gray-400 mb-6">Your portfolio website is ready to share with the world</p>
          
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-400 mb-2">Your portfolio URL:</p>
            <div className="flex items-center gap-2">
              <input type="text" value={generatedUrl} readOnly className="flex-1 px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-cyan-400" />
              <button onClick={copyUrl} className="btn-secondary py-2 px-4">Copy</button>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <a href={generatedUrl} target="_blank" rel="noopener noreferrer" className="btn-primary py-2 px-6 flex items-center gap-2">
              <FiEye /> View Portfolio
            </a>
            <button onClick={() => { setStep(1); setGeneratedUrl(''); setPersonalInfo({ fullName: user?.name || '', title: '', bio: '', email: user?.email || '', phone: '', location: '', avatar: '' }); setSkills([{ id: '1', name: '', level: 50 }]); setProjects([{ id: '1', title: '', description: '', technologies: [], liveLink: '', githubLink: '' }]); setExperiences([]); setEducations([]); }} className="btn-secondary py-2 px-6">
              Create Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}