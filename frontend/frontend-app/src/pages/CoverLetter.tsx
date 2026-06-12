import { useState } from 'react';
import { 
  FiMail, 
  FiSend, 
  FiCopy, 
  FiDownload,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiBriefcase,
  FiFileText,
  FiStar,
  FiZap,
  FiCpu
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AI_SERVICE_URL = 'http://localhost:5001';

export default function CoverLetter() {
  const { user } = useAuth();
  const { success, error } = useToast();
  
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    skills: '',
    experience: '',
    achievements: '',
    tone: 'professional' // professional, enthusiastic, concise
  });
  
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const tones = [
    { value: 'professional', label: 'Professional', icon: '💼' },
    { value: 'enthusiastic', label: 'Enthusiastic', icon: '🎉' },
    { value: 'concise', label: 'Concise', icon: '📝' },
    { value: 'creative', label: 'Creative', icon: '🎨' },
  ];
  
  const generateCoverLetter = async () => {
    if (!formData.companyName || !formData.jobTitle) {
      error('Please enter company name and job title');
      return;
    }
    
    setIsGenerating(true);
    setGeneratedLetter('');
    
    try {
      const response = await fetch(`${AI_SERVICE_URL}/api/cover-letter/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: user?.name || 'Candidate',
          companyName: formData.companyName,
          jobTitle: formData.jobTitle,
          skills: formData.skills,
          experience: formData.experience,
          achievements: formData.achievements,
          tone: formData.tone
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.coverLetter) {
        setGeneratedLetter(data.coverLetter);
        success('Cover letter generated successfully!');
      } else {
        // Fallback generated letter
        setGeneratedLetter(generateFallbackLetter());
      }
    } catch (err) {
      console.error('Error generating cover letter:', err);
      setGeneratedLetter(generateFallbackLetter());
      error('Using fallback generator. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const generateFallbackLetter = () => {
    const date = new Date().toLocaleDateString();
    return `
${date}

Hiring Manager
${formData.companyName || '[Company Name]'}

Subject: Application for ${formData.jobTitle || '[Position]'} position

Dear Hiring Manager,

I am writing to express my strong interest in the ${formData.jobTitle || '[Position]'} position at ${formData.companyName || '[Company Name]'}.

${formData.skills ? `With my expertise in ${formData.skills}, ` : ''}I am confident that I would be a valuable addition to your team. ${formData.experience ? `I have ${formData.experience} of experience in this field. ` : ''}${formData.achievements ? `My key achievements include ${formData.achievements}. ` : ''}

Throughout my career, I have developed strong problem-solving abilities and excellent communication skills. I am particularly drawn to ${formData.companyName || 'your company'} because of your innovative approach and industry leadership.

I look forward to the opportunity to discuss how my skills and experience align with ${formData.companyName || 'your company'}'s goals.

Sincerely,
${user?.name || 'Your Name'}
    `;
  };
  
  const copyToClipboard = async () => {
    if (!generatedLetter) return;
    await navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    success('Cover letter copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };
  
  const downloadAsText = () => {
    if (!generatedLetter) return;
    const blob = new Blob([generatedLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover_letter_${formData.companyName || 'job'}_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    success('Cover letter downloaded!');
  };
  
  const saveToProfile = async () => {
    if (!generatedLetter) {
      error('Please generate a cover letter first');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8080/api/resume/cover-letter/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: formData.companyName,
          position: formData.jobTitle,
          content: generatedLetter
        }),
      });
      
      if (response.ok) {
        success('Cover letter saved to your profile!');
      } else {
        error('Failed to save cover letter');
      }
    } catch (err) {
      error('Failed to save cover letter');
    }
  };
  
  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Cover Letter Generator
        </h1>
        <p className="text-white/60">AI-powered cover letter generator tailored to your profile and target company</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Input Form */}
        <div className="space-y-5">
          {/* Company & Job Info */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <FiBriefcase className="text-cyan-400" /> Job Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Company Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Google, Microsoft, Amazon"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Job Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Software Engineer, Data Scientist"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white"
                />
              </div>
            </div>
          </div>
          
          {/* Skills & Experience */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <FiUser className="text-cyan-400" /> Your Profile
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Key Skills (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g., React, Java, Python, AWS, System Design"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Years of Experience</label>
                <input
                  type="text"
                  placeholder="e.g., 3+ years, Fresher, 5 years"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Key Achievements</label>
                <textarea
                  placeholder="e.g., Improved performance by 40%, Led team of 5, Published research paper"
                  rows={3}
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white"
                />
              </div>
            </div>
          </div>
          
          {/* Tone Selection */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <FiStar className="text-cyan-400" /> Writing Tone
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {tones.map((tone) => (
                <button
                  key={tone.value}
                  onClick={() => setFormData({ ...formData, tone: tone.value })}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    formData.tone === tone.value
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {tone.icon} {tone.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Generate Button */}
          <button
            onClick={generateCoverLetter}
            disabled={isGenerating || !formData.companyName || !formData.jobTitle}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? <FiRefreshCw className="animate-spin" /> : <FiZap />}
            {isGenerating ? 'AI is writing your cover letter...' : 'Generate Cover Letter'}
          </button>
        </div>
        
        {/* Right Column - Generated Letter */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <FiMail className="text-cyan-400" /> Generated Cover Letter
            </h3>
            <div className="flex gap-2">
              {generatedLetter && (
                <>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <FiCheckCircle className="text-green-400" /> : <FiCopy className="text-gray-400" />}
                  </button>
                  <button
                    onClick={downloadAsText}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    title="Download as text"
                  >
                    <FiDownload className="text-gray-400" />
                  </button>
                </>
              )}
            </div>
          </div>
          
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mb-4"></div>
              <p className="text-gray-400">AI is crafting your personalized cover letter...</p>
              <p className="text-xs text-gray-500 mt-2">This may take a few seconds</p>
            </div>
          ) : generatedLetter ? (
            <div className="relative">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-300 leading-relaxed bg-gray-800/30 rounded-lg p-4 max-h-96 overflow-y-auto">
                {generatedLetter}
              </pre>
              <button
                onClick={saveToProfile}
                className="mt-4 w-full btn-secondary py-2 flex items-center justify-center gap-2"
              >
                <FiFileText /> Save to Profile
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FiCpu className="text-5xl text-cyan-400 mb-4" />
              <p className="text-gray-400">Fill in your details and click "Generate Cover Letter"</p>
              <p className="text-xs text-gray-500 mt-2">AI will create a personalized cover letter for your target company</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-cyan-600/10 to-purple-600/10 border border-cyan-500/30 rounded-xl p-4">
        <h4 className="font-semibold text-white text-sm mb-2">💡 Pro Tips</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Be specific about your achievements (add numbers when possible)</li>
          <li>• Research the company culture to choose the right tone</li>
          <li>• Customize the generated letter before sending</li>
          <li>• Save successful letters to your profile for future reference</li>
        </ul>
      </div>
    </div>
  );
}