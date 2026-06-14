import { useParams } from 'react-router-dom';
import { 
  FiGithub, 
  FiLinkedin, 
  FiTwitter, 
  FiGlobe, 
  FiMail, 
  FiPhone, 
  FiMapPin,
  FiExternalLink,
  FiStar,
  FiAward,
  FiBriefcase,
  FiBookOpen,
  FiCode
} from 'react-icons/fi';
import { useEffect, useState } from 'react';

interface PortfolioData {
  personalInfo: {
    fullName: string;
    title: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    avatar: string;
  };
  skills: { name: string; level: number }[];
  projects: { title: string; description: string; technologies: string[]; liveLink: string; githubLink: string }[];
  experiences: { company: string; role: string; duration: string; description: string }[];
  educations: { institution: string; degree: string; year: string }[];
  socialLinks: { github: string; linkedin: string; twitter: string; website: string };
  template: string;
}

export default function PortfolioView() {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In production, fetch from backend
    const saved = localStorage.getItem('portfolio_data');
    if (saved) {
      setPortfolio(JSON.parse(saved));
    }
    setLoading(false);
  }, [username]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }
  
  if (!portfolio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Portfolio Not Found</h1>
          <p className="text-gray-400">The portfolio you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }
  
  const { personalInfo, skills, projects, experiences, educations, socialLinks, template } = portfolio;
  
  return (
    <div className={`min-h-screen ${template === 'modern' ? 'bg-gradient-to-br from-gray-900 to-gray-800' : template === 'minimal' ? 'bg-white' : 'bg-black'}`}>
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section - Professional Design */}
        <div className="text-center mb-16">
          {personalInfo.avatar && (
            <img src={personalInfo.avatar} alt={personalInfo.fullName} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-cyan-400 shadow-lg" />
          )}
          <div className="inline-block px-4 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm mb-4">
            Portfolio
          </div>
          <h1 className="text-5xl font-bold text-white mb-2">{personalInfo.fullName}</h1>
          <p className="text-xl text-cyan-400 mb-4">{personalInfo.title}</p>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg">{personalInfo.bio}</p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-6">
            {personalInfo.email && (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                  <FiMail size={14} />
                </div>
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                  <FiPhone size={14} />
                </div>
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                  <FiMapPin size={14} />
                </div>
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-center gap-4 mt-6">
            {socialLinks.github && (
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-cyan-500/20 transition-all">
                <FiGithub className="text-gray-400 hover:text-cyan-400" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-cyan-500/20 transition-all">
                <FiLinkedin className="text-gray-400 hover:text-cyan-400" />
              </a>
            )}
            {socialLinks.twitter && (
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-cyan-500/20 transition-all">
                <FiTwitter className="text-gray-400 hover:text-cyan-400" />
              </a>
            )}
            {socialLinks.website && (
              <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-cyan-500/20 transition-all">
                <FiGlobe className="text-gray-400 hover:text-cyan-400" />
              </a>
            )}
          </div>
        </div>
        
        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <div className="bg-white/5 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
                <FiCode className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Technical Skills</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {skills.map((skill, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">{skill.name}</span>
                    <span className="text-cyan-400">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <div className="bg-white/5 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
                <FiBriefcase className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Featured Projects</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project, idx) => (
                <div key={idx} className="bg-gray-800/30 rounded-xl p-5 hover:bg-gray-800/50 transition-all">
                  <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies.map((tech, tidx) => (
                      <span key={tidx} className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">{tech}</span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-sm flex items-center gap-1 hover:underline">
                        GitHub <FiExternalLink size={12} />
                      </a>
                    )}
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-sm flex items-center gap-1 hover:underline">
                        Live Demo <FiExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Experience Section */}
        {experiences && experiences.length > 0 && (
          <div className="bg-white/5 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
                <FiAward className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Work Experience</h2>
            </div>
            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <div key={idx} className="border-l-2 border-cyan-400 pl-5">
                  <h3 className="text-lg font-semibold text-white">{exp.role} at {exp.company}</h3>
                  <p className="text-gray-400 text-sm mb-2">{exp.duration}</p>
                  <p className="text-gray-300 text-sm">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Education Section */}
        {educations && educations.length > 0 && (
          <div className="bg-white/5 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
                <FiBookOpen className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Education</h2>
            </div>
            <div className="space-y-4">
              {educations.map((edu, idx) => (
                <div key={idx} className="border-l-2 border-cyan-400 pl-5">
                  <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                  <p className="text-gray-400 text-sm">{edu.institution} | {edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="text-center mt-12 pt-6 border-t border-white/10">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} {personalInfo.fullName}. All rights reserved.</p>
          <p className="text-gray-600 text-xs mt-1">Powered by JobGenie</p>
        </div>
      </div>
    </div>
  );
}