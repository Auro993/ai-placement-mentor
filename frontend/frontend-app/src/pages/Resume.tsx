import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  FiUploadCloud, 
  FiFile, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiList, 
  FiTrash2, 
  FiDownload,
  FiEdit3,
  FiCode,
  FiMail,
  FiTarget,
  FiZap,
  FiBarChart2,
  FiRefreshCw,
  FiSave,
  FiPrinter,
  FiAlertTriangle,
  FiInfo,
  FiCpu,
  FiCopy
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:8080/api';
const AI_SERVICE = 'http://localhost:5001';

interface ResumeItem {
  id: number;
  fileName: string;
  filePath: string;
  uploadedAt: string;
  type?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface KeywordMatch {
  keyword: string;
  found: boolean;
  count: number;
  type: string;
}

interface KeywordAnalysis {
  hardSkillsMatch: KeywordMatch[];
  softSkillsMatch: KeywordMatch[];
  keywordDensity: Record<string, number>;
  totalHardSkills: number;
  foundHardSkills: number;
}

interface FormattingAnalysis {
  issues: string[];
  warnings: string[];
  hasTables: boolean;
  hasColumns: boolean;
}

interface SectionAnalysis {
  foundSections: string[];
  missingSections: string[];
  hasProperHeadings: boolean;
  summaryAnalysis: string;
  sectionContent: Record<string, string>;
}

interface ContentQualityAnalysis {
  jobTitleMatch: boolean;
  yearsOfExperience: number;
  spellingIssues: string[];
  hasAchievements: boolean;
  hasActionVerbs: boolean;
  suggestions: string[];
}

interface ATSDetection {
  detectedATS: string[];
  platformTips: string[];
  hasPDF: boolean;
  hasStandardFont: boolean;
  hasNoGraphics: boolean;
  hasStandardSections: boolean;
}

interface AdvancedAnalysisData {
  finalScore: number;
  keywordAnalysis: KeywordAnalysis;
  formattingAnalysis: FormattingAnalysis;
  sectionAnalysis: SectionAnalysis;
  contentQualityAnalysis: ContentQualityAnalysis;
  atsDetection: ATSDetection;
}

interface BasicAnalysisData {
  atsScore: number;
  foundKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  totalKeywords: number;
  message: string;
}

export default function Resume() {
  const { user } = useAuth();
  const { success, error } = useToast();
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [analysisData, setAnalysisData] = useState<BasicAnalysisData | null>(null);
  const [advancedAnalysis, setAdvancedAnalysis] = useState<AdvancedAnalysisData | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [useAdvancedMode, setUseAdvancedMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'builder' | 'latex' | 'cover'>('upload');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  // Cover Letter AI states
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);
  const [coverLetter, setCoverLetter] = useState({
    company: '',
    position: '',
    skills: '',
    tone: 'professional',
    generatedLetter: ''
  });
  
  // Resume Builder state
  const [builderForm, setBuilderForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    summary: '',
    experience: '',
    education: '',
    skills: ''
  });
  
  // LaTeX Editor state
  const [latexContent, setLatexContent] = useState(`\\documentclass{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{hyperref}
\\usepackage{enumitem}

\\begin{document}

\\title{\\textbf{Your Name}}
\\author{Your Email \\cdot Your Phone}
\\date{}
\\maketitle

\\section*{Summary}
Your professional summary here...

\\section*{Experience}
\\begin{itemize}
    \\item \\textbf{Job Title} at \\textbf{Company Name} \\hfill Dates
    \\begin{itemize}
        \\item Achievement 1
        \\item Achievement 2
    \\end{itemize}
\\end{itemize}

\\section*{Education}
\\begin{itemize}
    \\item \\textbf{Degree} in Field \\hfill Year
    \\item University Name
\\end{itemize}

\\section*{Skills}
\\begin{itemize}
    \\item Skill 1, Skill 2, Skill 3
\\end{itemize}

\\end{document}`);

  useEffect(() => {
    fetchResumes();
    fetchTemplates();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await fetch(`${API_BASE}/resume/all`);
      if (response.ok) {
        const data = await response.json();
        setResumes(data);
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`${API_BASE}/resume/templates`);
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (err) {
      console.error('Error fetching templates:', err);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      setUploadedFile(file);
      await handleUpload(file);
    } else {
      error('Please upload a PDF file');
    }
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadStatus('idle');
    setShowResults(false);
    setAtsScore(null);
    setAnalysisData(null);
    setAdvancedAnalysis(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${API_BASE}/resume/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      setUploadStatus('success');
      success('Resume uploaded successfully!');
      await fetchResumes();
      
    } catch (err) {
      setUploadStatus('error');
      error('Failed to upload resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const analyzeResume = async () => {
    if (!targetRole) {
      error('Please enter your target role');
      return;
    }
    
    if (resumes.length === 0 && !uploadedFile) {
      error('Please upload a resume first');
      return;
    }
    
    setAnalyzing(true);
    setShowResults(false);
    setUseAdvancedMode(false);
    
    try {
      const response = await fetch(`${API_BASE}/resume/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAtsScore(data.atsScore);
        setAnalysisData(data);
        setShowResults(true);
        success(`Basic analysis complete! Your ATS score is ${data.atsScore}/100`);
      } else {
        error(data.error || 'Analysis failed');
      }
    } catch (err) {
      error('Failed to analyze resume');
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeResumeAdvanced = async () => {
    if (!targetRole) {
      error('Please enter your target role');
      return;
    }
    
    if (resumes.length === 0 && !uploadedFile) {
      error('Please upload a resume first');
      return;
    }
    
    setAnalyzing(true);
    setShowResults(false);
    setUseAdvancedMode(true);
    
    try {
      const response = await fetch(`${API_BASE}/resume/analyze-advanced`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetRole, jobDescription }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAtsScore(data.finalScore);
        setAdvancedAnalysis(data);
        setShowResults(true);
        success(`Advanced analysis complete! Your score is ${data.finalScore}/100`);
      } else {
        error(data.error || 'Advanced analysis failed');
      }
    } catch (err) {
      error('Failed to analyze resume');
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const deleteResume = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/resume/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        success('Resume deleted successfully');
        await fetchResumes();
        if (resumes.length === 1) {
          setShowResults(false);
          setAtsScore(null);
          setAnalysisData(null);
          setAdvancedAnalysis(null);
        }
      } else {
        throw new Error('Delete failed');
      }
    } catch (err) {
      error('Failed to delete resume');
    }
  };

  const downloadResume = async (id: number, fileName: string) => {
    try {
      const response = await fetch(`${API_BASE}/resume/download/${id}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        success('Download started');
      } else {
        throw new Error('Download failed');
      }
    } catch (err) {
      error('Failed to download resume');
    }
  };

  const saveBuiltResume = async () => {
    if (!selectedTemplate) {
      error('Please select a template');
      return;
    }
    
    if (!builderForm.fullName) {
      error('Please enter your full name');
      return;
    }
    
    const content = JSON.stringify(builderForm);
    
    try {
      const response = await fetch(`${API_BASE}/resume/builder/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate,
          fileName: builderForm.fullName.replace(/\s/g, '_') + '_resume',
          content: content
        }),
      });
      
      if (response.ok) {
        success('Resume saved successfully!');
        await fetchResumes();
        setBuilderForm({
          fullName: '',
          email: '',
          phone: '',
          summary: '',
          experience: '',
          education: '',
          skills: ''
        });
        setSelectedTemplate(null);
      } else {
        throw new Error('Save failed');
      }
    } catch (err) {
      error('Failed to save resume');
    }
  };

  const saveLatexContent = async () => {
    try {
      const response = await fetch(`${API_BASE}/resume/latex/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: latexContent,
          fileName: 'latex_resume'
        }),
      });
      
      if (response.ok) {
        success('LaTeX document saved successfully!');
        await fetchResumes();
      } else {
        throw new Error('Save failed');
      }
    } catch (err) {
      error('Failed to save LaTeX document');
    }
  };

  // AI Cover Letter Generation
  const generateAICoverLetter = async () => {
    if (!coverLetter.company || !coverLetter.position) {
      error('Please enter company name and position');
      return;
    }
    
    setIsGeneratingLetter(true);
    
    try {
      const response = await fetch(`${AI_SERVICE}/api/cover-letter/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: user?.name || 'Candidate',
          companyName: coverLetter.company,
          jobTitle: coverLetter.position,
          skills: coverLetter.skills,
          tone: coverLetter.tone
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.coverLetter) {
        setCoverLetter({ ...coverLetter, generatedLetter: data.coverLetter });
        success('AI cover letter generated successfully!');
      } else {
        setCoverLetter({ ...coverLetter, generatedLetter: generateFallbackLetter() });
      }
    } catch (err) {
      console.error('Error:', err);
      setCoverLetter({ ...coverLetter, generatedLetter: generateFallbackLetter() });
      error('Using fallback generator');
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const generateFallbackLetter = () => {
    return `
${new Date().toLocaleDateString()}

Hiring Manager
${coverLetter.company || '[Company Name]'}

Subject: Application for ${coverLetter.position || '[Position]'} position

Dear Hiring Manager,

I am writing to express my strong interest in the ${coverLetter.position || '[Position]'} position at ${coverLetter.company || '[Company Name]'}.

${coverLetter.skills ? `With my expertise in ${coverLetter.skills}, ` : ''}I am confident that I would be a valuable addition to your team. I have successfully delivered multiple projects and am passionate about continuous learning and innovation.

Throughout my career, I have developed strong problem-solving abilities and excellent communication skills. I am particularly drawn to ${coverLetter.company || 'your company'} because of your innovative approach and industry leadership.

I look forward to the opportunity to discuss how my skills and experience align with ${coverLetter.company || 'your company'}'s goals.

Sincerely,
${user?.name || 'Your Name'}
    `;
  };

  const copyToClipboard = async () => {
    if (!coverLetter.generatedLetter) return;
    await navigator.clipboard.writeText(coverLetter.generatedLetter);
    success('Copied to clipboard!');
  };

  const saveCoverLetter = async () => {
    if (!coverLetter.generatedLetter) {
      error('Please generate a cover letter first');
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/resume/cover-letter/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: coverLetter.company,
          position: coverLetter.position,
          content: coverLetter.generatedLetter
        }),
      });
      
      if (response.ok) {
        success('Cover letter saved successfully!');
        await fetchResumes();
      } else {
        throw new Error('Save failed');
      }
    } catch (err) {
      error('Failed to save cover letter');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'application/pdf': ['.pdf'] }, 
    maxFiles: 1,
    maxSize: 10485760
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Resume Toolkit</h1>
        <p className="text-white/60">Score your resume, get ATS optimization, and build professional resumes</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-2">
        {[
          { id: 'upload', label: '📄 Analyze Resume', icon: FiTarget },
          { id: 'builder', label: '🛠️ Resume Builder', icon: FiEdit3 },
          { id: 'latex', label: '📝 LaTeX Editor', icon: FiCode },
          { id: 'cover', label: '✉️ AI Cover Letter', icon: FiMail },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === tab.id 
                ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div className="glass-card p-8">
                <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>
                
                <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${isDragActive ? 'border-cyan-500 bg-cyan-500/10' : 'border-white/20 hover:border-cyan-500/50'}`}>
                  <input {...getInputProps()} />
                  <FiUploadCloud className="text-5xl text-cyan-400 mx-auto mb-4" />
                  <p className="text-lg font-medium">{isDragActive ? 'Drop your resume here' : 'Drop PDF here'}</p>
                  <p className="text-white/40 text-sm mt-1">OR CLICK TO BROWSE · MAX 10 MB</p>
                </div>

                {uploadedFile && (
                  <div className="mt-4 p-3 bg-white/5 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FiFile className="text-cyan-400" />
                      <div>
                        <p className="text-sm font-medium">{uploadedFile.name}</p>
                        <p className="text-xs text-white/40">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    {uploadStatus === 'success' && <FiCheckCircle className="text-green-400" />}
                    {uploadStatus === 'error' && <FiAlertCircle className="text-red-400" />}
                  </div>
                )}

                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2 text-white/70">Target Role</label>
                  <div className="flex gap-3 mb-3">
                    <input 
                      type="text" 
                      placeholder="e.g., Software Engineer, Data Scientist, Product Manager"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                    />
                  </div>
                  
                  <label className="block text-sm font-medium mb-2 text-white/70 mt-4">Job Description (Optional - for advanced analysis)</label>
                  <textarea
                    placeholder="Paste job description here for more accurate ATS score..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white text-sm"
                  />
                  
                  <div className="flex gap-3 mt-4">
                    <button 
                      onClick={analyzeResume}
                      disabled={analyzing || resumes.length === 0}
                      className="flex-1 btn-secondary py-2 px-4 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {analyzing && !useAdvancedMode ? <FiRefreshCw className="animate-spin" /> : <FiTarget />}
                      {analyzing && !useAdvancedMode ? 'Analyzing...' : 'Basic Analysis'}
                    </button>
                    <button 
                      onClick={analyzeResumeAdvanced}
                      disabled={analyzing || resumes.length === 0}
                      className="flex-1 btn-primary py-2 px-4 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {analyzing && useAdvancedMode ? <FiRefreshCw className="animate-spin" /> : <FiCpu />}
                      {analyzing && useAdvancedMode ? 'Analyzing...' : 'Advanced Analysis'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Panels */}
              <AnimatePresence>
                {showResults && !useAdvancedMode && analysisData && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">📊 Basic ATS Analysis</h2>
                      <span className="px-2 py-1 text-xs rounded-full bg-cyan-500/20 text-cyan-400">Keyword Matching</span>
                    </div>
                    
                    <div className="flex items-center gap-8 mb-6">
                      <div className="relative w-32 h-32">
                        <svg className="w-32 h-32 transform -rotate-90">
                          <circle cx="64" cy="64" r="58" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none"/>
                          <circle cx="64" cy="64" r="58" stroke="url(#gradient)" strokeWidth="8" fill="none" strokeDasharray={`${analysisData.atsScore * 3.64} 364`} className="transition-all duration-1000"/>
                          <defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#06b6d4"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center"><span className="text-3xl font-bold">{analysisData.atsScore}</span></div>
                      </div>
                      <div>
                        <p className="text-lg font-semibold">ATS Score</p>
                        <p className="text-white/60 text-sm">{analysisData.atsScore >= 80 ? '🎉 Excellent!' : analysisData.atsScore >= 60 ? '👍 Good!' : '⚠️ Needs improvement'}</p>
                        <p className="text-xs text-white/40 mt-1">Matched {analysisData.foundKeywords?.length || 0}/{analysisData.totalKeywords} keywords</p>
                      </div>
                    </div>

                    {analysisData.foundKeywords && analysisData.foundKeywords.length > 0 && (
                      <div className="mb-6"><h3 className="font-semibold mb-3 flex items-center gap-2"><FiCheckCircle className="text-green-400" /> Found Keywords ({analysisData.foundKeywords.length})</h3><div className="flex flex-wrap gap-2">{analysisData.foundKeywords.map((kw, i) => (<span key={i} className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">✓ {kw}</span>))}</div></div>
                    )}

                    {analysisData.missingKeywords && analysisData.missingKeywords.length > 0 && (
                      <div className="mb-6"><h3 className="font-semibold mb-3 flex items-center gap-2"><FiTarget className="text-red-400" /> Missing Keywords ({analysisData.missingKeywords.length})</h3><div className="flex flex-wrap gap-2">{analysisData.missingKeywords.map((kw, i) => (<span key={i} className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm">+ {kw}</span>))}</div></div>
                    )}

                    {analysisData.suggestions && analysisData.suggestions.length > 0 && (
                      <div><h3 className="font-semibold mb-3 flex items-center gap-2"><FiZap className="text-cyan-400" /> Suggestions for {targetRole}</h3><ul className="space-y-2 text-white/70 text-sm">{analysisData.suggestions.map((suggestion, i) => (<li key={i}>📌 {suggestion}</li>))}</ul></div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showResults && useAdvancedMode && advancedAnalysis && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="glass-card p-6"><div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold">📊 Comprehensive ATS Analysis</h2><span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400">Full Analysis</span></div>
                    <div className="flex items-center gap-8 mb-6"><div className="relative w-32 h-32"><svg className="w-32 h-32 transform -rotate-90"><circle cx="64" cy="64" r="58" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none"/><circle cx="64" cy="64" r="58" stroke="url(#gradient2)" strokeWidth="8" fill="none" strokeDasharray={`${advancedAnalysis.finalScore * 3.64} 364`} className="transition-all duration-1000"/><defs><linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#06b6d4"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs></svg><div className="absolute inset-0 flex items-center justify-center"><span className="text-3xl font-bold">{advancedAnalysis.finalScore}</span></div></div>
                    <div><p className="text-lg font-semibold">Overall ATS Score</p><p className="text-white/60 text-sm">{advancedAnalysis.finalScore >= 80 ? '🎉 Excellent!' : advancedAnalysis.finalScore >= 60 ? '👍 Good!' : '⚠️ Needs improvement'}</p><p className="text-xs text-white/40 mt-1">Based on keywords, formatting, sections, content, and ATS compatibility</p></div></div></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Resume Builder Tab */}
          {activeTab === 'builder' && (
            <div className="glass-card p-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FiEdit3 className="text-cyan-400" /> Resume Builder</h2>
              <div className="mb-6"><label className="block text-sm font-medium mb-2 text-white/70">Select Template</label><div className="grid grid-cols-3 gap-3">{templates.map((template) => (<div key={template.id} onClick={() => setSelectedTemplate(template.id)} className={`p-3 rounded-lg cursor-pointer transition-all text-center ${selectedTemplate === template.id ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500' : 'bg-white/5 hover:bg-white/10'}`}><div className="w-12 h-12 rounded-full mx-auto mb-2" style={{ backgroundColor: template.color }} /><p className="font-medium text-sm">{template.name}</p><p className="text-xs text-white/40">{template.description}</p></div>))}</div></div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <input type="text" placeholder="Full Name" value={builderForm.fullName} onChange={(e) => setBuilderForm({ ...builderForm, fullName: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white" />
                <input type="email" placeholder="Email" value={builderForm.email} onChange={(e) => setBuilderForm({ ...builderForm, email: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white" />
                <input type="text" placeholder="Phone" value={builderForm.phone} onChange={(e) => setBuilderForm({ ...builderForm, phone: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white" />
                <textarea placeholder="Professional Summary" rows={3} value={builderForm.summary} onChange={(e) => setBuilderForm({ ...builderForm, summary: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white" />
                <textarea placeholder="Experience" rows={4} value={builderForm.experience} onChange={(e) => setBuilderForm({ ...builderForm, experience: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white" />
                <textarea placeholder="Education" rows={2} value={builderForm.education} onChange={(e) => setBuilderForm({ ...builderForm, education: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white" />
                <textarea placeholder="Skills (comma separated)" rows={2} value={builderForm.skills} onChange={(e) => setBuilderForm({ ...builderForm, skills: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white" />
              </div>
              <button onClick={saveBuiltResume} disabled={!selectedTemplate || !builderForm.fullName} className="btn-primary w-full mt-6 py-2 flex items-center justify-center gap-2 disabled:opacity-50"><FiSave /> Save Resume</button>
            </div>
          )}

          {/* LaTeX Editor Tab */}
          {activeTab === 'latex' && (
            <div className="glass-card p-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FiCode className="text-cyan-400" /> LaTeX Editor</h2>
              <textarea value={latexContent} onChange={(e) => setLatexContent(e.target.value)} className="w-full h-96 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white font-mono text-sm" />
              <div className="flex gap-3 mt-4"><button onClick={saveLatexContent} className="btn-primary py-2 px-6 flex items-center gap-2"><FiSave /> Save LaTeX</button><button className="btn-secondary py-2 px-6 flex items-center gap-2"><FiPrinter /> Compile PDF</button></div>
            </div>
          )}

          {/* AI Cover Letter Tab - UPDATED WITH AI */}
          {activeTab === 'cover' && (
            <div className="glass-card p-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiMail className="text-cyan-400" />
                AI Cover Letter Generator
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Company Name *</label>
                  <input type="text" placeholder="e.g., Google, Microsoft, Amazon" value={coverLetter.company} onChange={(e) => setCoverLetter({ ...coverLetter, company: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Position *</label>
                  <input type="text" placeholder="e.g., Software Engineer, Data Scientist" value={coverLetter.position} onChange={(e) => setCoverLetter({ ...coverLetter, position: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Your Skills (comma separated)</label>
                  <textarea placeholder="React, Java, Python, Spring Boot, AWS" rows={2} value={coverLetter.skills} onChange={(e) => setCoverLetter({ ...coverLetter, skills: e.target.value })} className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">Writing Tone</label>
                  <div className="flex gap-2">
                    {['professional', 'enthusiastic', 'concise'].map((tone) => (
                      <button key={tone} onClick={() => setCoverLetter({ ...coverLetter, tone: tone as any })} className={`px-3 py-1.5 rounded-lg text-sm transition-all ${coverLetter.tone === tone ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}>
                        {tone.charAt(0).toUpperCase() + tone.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={generateAICoverLetter} disabled={!coverLetter.company || !coverLetter.position || isGeneratingLetter} className="btn-primary w-full py-2 flex items-center justify-center gap-2 disabled:opacity-50">
                  {isGeneratingLetter ? <FiRefreshCw className="animate-spin" /> : <FiZap />}
                  {isGeneratingLetter ? 'AI is writing...' : 'Generate Cover Letter with AI'}
                </button>

                {coverLetter.generatedLetter && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
                    <label className="block text-sm font-medium mb-2 text-white/70">Generated Cover Letter</label>
                    <textarea value={coverLetter.generatedLetter} onChange={(e) => setCoverLetter({ ...coverLetter, generatedLetter: e.target.value })} rows={14} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white/90 text-sm font-mono" />
                    <div className="flex gap-3 mt-3">
                      <button onClick={copyToClipboard} className="flex-1 btn-secondary py-2 flex items-center justify-center gap-2"><FiCopy /> Copy to Clipboard</button>
                      <button onClick={saveCoverLetter} className="flex-1 btn-primary py-2 flex items-center justify-center gap-2"><FiSave /> Save to Profile</button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><FiList className="text-cyan-400" /> Your Resumes ({resumes.length})</h3>
            {resumes.length > 0 ? (
              <div className="space-y-2 max-h-80 overflow-y-auto">{resumes.map((resume) => (<div key={resume.id} className="flex items-center justify-between p-2 bg-white/5 rounded-lg"><div className="flex items-center gap-2 flex-1 min-w-0"><FiFile className="text-cyan-400 shrink-0" /><div className="flex-1 min-w-0"><p className="text-sm truncate">{resume.fileName}</p><p className="text-xs text-white/40">{new Date(resume.uploadedAt).toLocaleDateString()}</p></div></div><div className="flex gap-1"><button onClick={() => downloadResume(resume.id, resume.fileName)} className="p-1 hover:text-cyan-400 transition-colors" title="Download"><FiDownload size={14} /></button><button onClick={() => deleteResume(resume.id)} className="p-1 hover:text-red-400 transition-colors" title="Delete"><FiTrash2 size={14} /></button></div></div>))}</div>
            ) : (<p className="text-white/40 text-sm text-center py-4">No resumes uploaded yet</p>)}
          </div>

          <div className="glass-card p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><FiBarChart2 className="text-cyan-400" /> Progress</h3>
            {atsScore ? (<div><div className="flex justify-between text-sm mb-1"><span>Latest ATS Score</span><span className="text-cyan-400">{atsScore}%</span></div><div className="w-full bg-white/10 rounded-full h-2"><div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all" style={{ width: `${atsScore}%` }} /></div><p className="text-xs text-white/40 mt-2">Total uploads: {resumes.length}</p></div>) : (<p className="text-white/40 text-sm text-center py-2">Upload and analyze a resume to track your progress</p>)}
          </div>

          <div className="glass-card p-5">
            <h3 className="font-semibold mb-3">💡 Pro Tips</h3>
            <ul className="space-y-2 text-white/60 text-sm"><li>• Use standard section headings (Experience, Education, Skills)</li><li>• Avoid tables, columns, and graphics for ATS</li><li>• Save as PDF before submitting</li><li>• Tailor your resume for each application</li><li>• Include keywords from job description</li></ul>
          </div>
        </div>
      </div>
    </div>
  );
}