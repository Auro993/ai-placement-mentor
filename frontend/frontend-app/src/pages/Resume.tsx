import { useState, useEffect, useRef } from 'react';
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
  FiCopy,
  FiPlus,
  FiX,
  FiGithub,
  FiLinkedin,
  FiMapPin,
  FiBriefcase,
  FiBookOpen,
  FiTool,
  FiFolder,
  FiAward,
  FiGlobe,
  FiEye,
  FiEdit2,
  FiFileText
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

// Enhanced Resume Builder Interfaces
interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
  gpa: string;
  location: string;
}

interface Project {
  id: string;
  title: string;
  techStack: string[];
  description: string[];
  link: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

interface Language {
  id: string;
  name: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
}

interface ResumeBuilderData {
  personalInfo: {
    fullName: string;
    professionalTitle: string;
    email: string;
    phone: string;
    github: string;
    linkedin: string;
    location: string;
    portfolio: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  template: string;
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
  
  // Enhanced Resume Builder state
  const [resumeData, setResumeData] = useState<ResumeBuilderData>({
    personalInfo: {
      fullName: '',
      professionalTitle: '',
      email: '',
      phone: '',
      github: '',
      linkedin: '',
      location: '',
      portfolio: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    template: 'modern'
  });

  // NEW: Preview/Show Created Resume state
  const [showCreatedResume, setShowCreatedResume] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);

  // Modal states for adding/editing
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Temporary form states for modals
  const [tempExperience, setTempExperience] = useState<Experience>({
    id: '',
    jobTitle: '',
    company: '',
    startDate: '',
    endDate: '',
    location: '',
    description: ['']
  });
  const [tempEducation, setTempEducation] = useState<Education>({
    id: '',
    degree: '',
    institution: '',
    startDate: '',
    endDate: '',
    gpa: '',
    location: ''
  });
  const [tempProject, setTempProject] = useState<Project>({
    id: '',
    title: '',
    techStack: [],
    description: [''],
    link: ''
  });
  const [tempCertification, setTempCertification] = useState<Certification>({
    id: '',
    name: '',
    issuer: '',
    date: ''
  });
  const [tempLanguage, setTempLanguage] = useState<Language>({
    id: '',
    name: '',
    proficiency: 'Fluent'
  });
  const [newSkill, setNewSkill] = useState('');

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

  // Enhanced Resume Builder Functions
  const addExperience = () => {
    if (editingId) {
      setResumeData(prev => ({
        ...prev,
        experience: prev.experience.map(exp => 
          exp.id === editingId ? { ...tempExperience, id: editingId } : exp
        )
      }));
      success('Experience updated successfully!');
    } else {
      const newExp = { ...tempExperience, id: Date.now().toString() };
      setResumeData(prev => ({
        ...prev,
        experience: [...prev.experience, newExp]
      }));
      success('Experience added successfully!');
    }
    setShowExperienceModal(false);
    setEditingId(null);
    resetTempExperience();
  };

  const editExperience = (id: string) => {
    const exp = resumeData.experience.find(e => e.id === id);
    if (exp) {
      setTempExperience(exp);
      setEditingId(id);
      setShowExperienceModal(true);
    }
  };

  const deleteExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(e => e.id !== id)
    }));
    success('Experience deleted');
  };

  const resetTempExperience = () => {
    setTempExperience({
      id: '',
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      location: '',
      description: ['']
    });
  };

  const addEducation = () => {
    if (editingId) {
      setResumeData(prev => ({
        ...prev,
        education: prev.education.map(edu => 
          edu.id === editingId ? { ...tempEducation, id: editingId } : edu
        )
      }));
      success('Education updated successfully!');
    } else {
      const newEdu = { ...tempEducation, id: Date.now().toString() };
      setResumeData(prev => ({
        ...prev,
        education: [...prev.education, newEdu]
      }));
      success('Education added successfully!');
    }
    setShowEducationModal(false);
    setEditingId(null);
    setTempEducation({
      id: '',
      degree: '',
      institution: '',
      startDate: '',
      endDate: '',
      gpa: '',
      location: ''
    });
  };

  const editEducation = (id: string) => {
    const edu = resumeData.education.find(e => e.id === id);
    if (edu) {
      setTempEducation(edu);
      setEditingId(id);
      setShowEducationModal(true);
    }
  };

  const deleteEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(e => e.id !== id)
    }));
    success('Education deleted');
  };

  const addProject = () => {
    if (editingId) {
      setResumeData(prev => ({
        ...prev,
        projects: prev.projects.map(proj => 
          proj.id === editingId ? { ...tempProject, id: editingId } : proj
        )
      }));
      success('Project updated successfully!');
    } else {
      const newProj = { ...tempProject, id: Date.now().toString() };
      setResumeData(prev => ({
        ...prev,
        projects: [...prev.projects, newProj]
      }));
      success('Project added successfully!');
    }
    setShowProjectModal(false);
    setEditingId(null);
    setTempProject({
      id: '',
      title: '',
      techStack: [],
      description: [''],
      link: ''
    });
  };

  const editProject = (id: string) => {
    const proj = resumeData.projects.find(p => p.id === id);
    if (proj) {
      setTempProject(proj);
      setEditingId(id);
      setShowProjectModal(true);
    }
  };

  const deleteProject = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
    success('Project deleted');
  };

  const addSkill = () => {
    if (newSkill.trim() && !resumeData.skills.includes(newSkill.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addCertification = () => {
    if (editingId) {
      setResumeData(prev => ({
        ...prev,
        certifications: prev.certifications.map(cert => 
          cert.id === editingId ? { ...tempCertification, id: editingId } : cert
        )
      }));
      success('Certification updated successfully!');
    } else {
      const newCert = { ...tempCertification, id: Date.now().toString() };
      setResumeData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCert]
      }));
      success('Certification added successfully!');
    }
    setShowCertificationModal(false);
    setEditingId(null);
    setTempCertification({
      id: '',
      name: '',
      issuer: '',
      date: ''
    });
  };

  const deleteCertification = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id)
    }));
    success('Certification deleted');
  };

  const addLanguage = () => {
    if (editingId) {
      setResumeData(prev => ({
        ...prev,
        languages: prev.languages.map(lang => 
          lang.id === editingId ? { ...tempLanguage, id: editingId } : lang
        )
      }));
      success('Language updated successfully!');
    } else {
      const newLang = { ...tempLanguage, id: Date.now().toString() };
      setResumeData(prev => ({
        ...prev,
        languages: [...prev.languages, newLang]
      }));
      success('Language added successfully!');
    }
    setShowLanguageModal(false);
    setEditingId(null);
    setTempLanguage({
      id: '',
      name: '',
      proficiency: 'Fluent'
    });
  };

  const deleteLanguage = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l.id !== id)
    }));
    success('Language deleted');
  };

  // NEW: Create Resume function
  const createResume = () => {
    // Validate required fields
    if (!selectedTemplate) {
      error('Please select a template');
      return;
    }
    if (!resumeData.personalInfo.fullName) {
      error('Please enter your full name');
      return;
    }
    if (!resumeData.personalInfo.email) {
      error('Please enter your email');
      return;
    }

    // Show the created resume
    setShowCreatedResume(true);
    success('Resume created successfully! 🎉');
  };

  // NEW: Download PDF function - simple version
  const downloadPDF = () => {
    // For now, use browser print to PDF
    // In production, use html2canvas + jsPDF or backend PDF generation
    window.print();
    success('Print dialog opened. Choose "Save as PDF" to download.');
  };

  // Save built resume
  const saveBuiltResume = async () => {
    if (!selectedTemplate) {
      error('Please select a template');
      return;
    }
    
    if (!resumeData.personalInfo.fullName) {
      error('Please enter your full name');
      return;
    }
    
    const content = JSON.stringify(resumeData);
    
    try {
      const response = await fetch(`${API_BASE}/resume/builder/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: selectedTemplate,
          fileName: resumeData.personalInfo.fullName.replace(/\s/g, '_') + '_resume',
          content: content
        }),
      });
      
      if (response.ok) {
        success('Resume saved successfully!');
        await fetchResumes();
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
            onClick={() => {
              setActiveTab(tab.id as any);
              setShowCreatedResume(false);
            }}
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

      <div className={`grid ${showCreatedResume ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-6`}>
        {/* Main Content Area */}
        <div className={showCreatedResume ? 'lg:col-span-1' : 'lg:col-span-2'}>
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

          {/* ENHANCED RESUME BUILDER TAB WITH CREATE FEATURE */}
          {activeTab === 'builder' && (
            <>
              {!showCreatedResume ? (
                // Show Builder Form
                <div className="space-y-6">
                  {/* Template Selection */}
                  <div className="glass-card p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <FiEdit3 className="text-cyan-400" /> 
                      Resume Builder
                    </h2>
                    <p className="text-white/60 text-sm mb-6">Fill in your details to create a professional resume</p>
                    
                    <label className="block text-sm font-medium mb-3 text-white/70">Select Template</label>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                      {templates.length > 0 ? templates.map((template) => (
                        <div 
                          key={template.id} 
                          onClick={() => {
                            setSelectedTemplate(template.id);
                            setResumeData(prev => ({ ...prev, template: template.id }));
                          }} 
                          className={`p-3 rounded-lg cursor-pointer transition-all text-center ${
                            selectedTemplate === template.id 
                              ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-2 border-cyan-500' 
                              : 'bg-white/5 hover:bg-white/10 border border-white/10'
                          }`}
                        >
                          <div className="w-12 h-12 rounded-full mx-auto mb-2" style={{ backgroundColor: template.color }} />
                          <p className="font-medium text-sm">{template.name}</p>
                          <p className="text-xs text-white/40">{template.description}</p>
                        </div>
                      )) : (
                        ['Modern', 'Professional', 'Creative', 'Technical', 'Executive'].map((name, i) => (
                          <div 
                            key={i}
                            onClick={() => setSelectedTemplate(name.toLowerCase())}
                            className={`p-3 rounded-lg cursor-pointer transition-all text-center ${
                              selectedTemplate === name.toLowerCase() 
                                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-2 border-cyan-500' 
                                : 'bg-white/5 hover:bg-white/10 border border-white/10'
                            }`}
                          >
                            <div className="w-12 h-12 rounded-full mx-auto mb-2" style={{ backgroundColor: ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'][i] }} />
                            <p className="font-medium text-sm">{name}</p>
                            <p className="text-xs text-white/40">{['Clean & modern', 'Corporate style', 'Bold & creative', 'Tech-focused', 'Executive'][i]}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FiEdit2 className="text-cyan-400" /> Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 text-white/70">Full Name *</label>
                        <input 
                          type="text" 
                          placeholder="John Doe"
                          value={resumeData.personalInfo.fullName}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                          }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-white/70">Professional Title</label>
                        <input 
                          type="text" 
                          placeholder="Software Engineer"
                          value={resumeData.personalInfo.professionalTitle}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, professionalTitle: e.target.value }
                          }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-white/70">Email *</label>
                        <input 
                          type="email" 
                          placeholder="john@email.com"
                          value={resumeData.personalInfo.email}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, email: e.target.value }
                          }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-white/70">Phone</label>
                        <input 
                          type="text" 
                          placeholder="+1234567890"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, phone: e.target.value }
                          }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-white/70 flex items-center gap-1">
                          <FiGithub className="text-cyan-400" /> GitHub
                        </label>
                        <input 
                          type="text" 
                          placeholder="https://github.com/username"
                          value={resumeData.personalInfo.github}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, github: e.target.value }
                          }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-white/70 flex items-center gap-1">
                          <FiLinkedin className="text-cyan-400" /> LinkedIn
                        </label>
                        <input 
                          type="text" 
                          placeholder="https://linkedin.com/in/username"
                          value={resumeData.personalInfo.linkedin}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                          }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-white/70 flex items-center gap-1">
                          <FiMapPin className="text-cyan-400" /> Location
                        </label>
                        <input 
                          type="text" 
                          placeholder="San Francisco, CA"
                          value={resumeData.personalInfo.location}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, location: e.target.value }
                          }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-white/70">Portfolio</label>
                        <input 
                          type="text" 
                          placeholder="https://portfolio.com"
                          value={resumeData.personalInfo.portfolio}
                          onChange={(e) => setResumeData(prev => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, portfolio: e.target.value }
                          }))}
                          className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Summary */}
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FiBriefcase className="text-cyan-400" /> Professional Summary
                    </h3>
                    <textarea
                      placeholder="Write a compelling professional summary highlighting your experience, skills, and career goals..."
                      rows={4}
                      value={resumeData.summary}
                      onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                    />
                    <p className="text-xs text-white/40 mt-1">Tip: Keep it concise (2-3 sentences) and highlight your key strengths</p>
                  </div>

                  {/* Experience */}
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FiBriefcase className="text-cyan-400" /> Experience
                      </h3>
                      <button 
                        onClick={() => {
                          setEditingId(null);
                          resetTempExperience();
                          setShowExperienceModal(true);
                        }}
                        className="btn-secondary py-1.5 px-4 flex items-center gap-2 text-sm"
                      >
                        <FiPlus /> Add Experience
                      </button>
                    </div>
                    
                    {resumeData.experience.length === 0 ? (
                      <p className="text-white/40 text-center py-4">No experience added yet. Click "Add Experience" to get started.</p>
                    ) : (
                      <div className="space-y-4">
                        {resumeData.experience.map((exp) => (
                          <div key={exp.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{exp.jobTitle}</h4>
                                <p className="text-cyan-400 text-sm">{exp.company}</p>
                                <p className="text-xs text-white/40">{exp.startDate} - {exp.endDate || 'Present'} • {exp.location}</p>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => editExperience(exp.id)} className="p-1 hover:text-cyan-400 transition-colors"><FiEdit2 size={16} /></button>
                                <button onClick={() => deleteExperience(exp.id)} className="p-1 hover:text-red-400 transition-colors"><FiTrash2 size={16} /></button>
                              </div>
                            </div>
                            <ul className="mt-2 space-y-1 text-sm text-white/70">
                              {exp.description.map((item, i) => <li key={i}>• {item}</li>)}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Education */}
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FiBookOpen className="text-cyan-400" /> Education
                      </h3>
                      <button 
                        onClick={() => {
                          setEditingId(null);
                          setTempEducation({ id: '', degree: '', institution: '', startDate: '', endDate: '', gpa: '', location: '' });
                          setShowEducationModal(true);
                        }}
                        className="btn-secondary py-1.5 px-4 flex items-center gap-2 text-sm"
                      >
                        <FiPlus /> Add Education
                      </button>
                    </div>
                    
                    {resumeData.education.length === 0 ? (
                      <p className="text-white/40 text-center py-4">No education added yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {resumeData.education.map((edu) => (
                          <div key={edu.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{edu.degree}</h4>
                                <p className="text-cyan-400 text-sm">{edu.institution}</p>
                                <p className="text-xs text-white/40">{edu.startDate} - {edu.endDate || 'Present'} • {edu.location}</p>
                                {edu.gpa && <p className="text-xs text-white/40">GPA: {edu.gpa}</p>}
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => editEducation(edu.id)} className="p-1 hover:text-cyan-400 transition-colors"><FiEdit2 size={16} /></button>
                                <button onClick={() => deleteEducation(edu.id)} className="p-1 hover:text-red-400 transition-colors"><FiTrash2 size={16} /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FiTool className="text-cyan-400" /> Skills
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {resumeData.skills.map((skill) => (
                        <span key={skill} className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm flex items-center gap-1">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors"><FiX size={14} /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a skill..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                        className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                      />
                      <button onClick={addSkill} className="btn-secondary px-4 py-2 flex items-center gap-2"><FiPlus /> Add</button>
                    </div>
                  </div>

                  {/* Projects */}
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FiFolder className="text-cyan-400" /> Projects
                      </h3>
                      <button 
                        onClick={() => {
                          setEditingId(null);
                          setTempProject({ id: '', title: '', techStack: [], description: [''], link: '' });
                          setShowProjectModal(true);
                        }}
                        className="btn-secondary py-1.5 px-4 flex items-center gap-2 text-sm"
                      >
                        <FiPlus /> Add Project
                      </button>
                    </div>
                    
                    {resumeData.projects.length === 0 ? (
                      <p className="text-white/40 text-center py-4">No projects added yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {resumeData.projects.map((proj) => (
                          <div key={proj.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{proj.title}</h4>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {proj.techStack.map((tech) => (
                                    <span key={tech} className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs">{tech}</span>
                                  ))}
                                </div>
                                <ul className="mt-2 space-y-1 text-sm text-white/70">
                                  {proj.description.map((item, i) => <li key={i}>• {item}</li>)}
                                </ul>
                                {proj.link && (
                                  <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-sm hover:underline">View Project →</a>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => editProject(proj.id)} className="p-1 hover:text-cyan-400 transition-colors"><FiEdit2 size={16} /></button>
                                <button onClick={() => deleteProject(proj.id)} className="p-1 hover:text-red-400 transition-colors"><FiTrash2 size={16} /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Certifications */}
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FiAward className="text-cyan-400" /> Certifications
                      </h3>
                      <button 
                        onClick={() => {
                          setEditingId(null);
                          setTempCertification({ id: '', name: '', issuer: '', date: '' });
                          setShowCertificationModal(true);
                        }}
                        className="btn-secondary py-1.5 px-4 flex items-center gap-2 text-sm"
                      >
                        <FiPlus /> Add Certification
                      </button>
                    </div>
                    
                    {resumeData.certifications.length === 0 ? (
                      <p className="text-white/40 text-center py-4">No certifications added yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {resumeData.certifications.map((cert) => (
                          <div key={cert.id} className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center gap-3">
                            <div>
                              <p className="font-medium text-sm">{cert.name}</p>
                              <p className="text-xs text-white/40">{cert.issuer} • {cert.date}</p>
                            </div>
                            <button onClick={() => deleteCertification(cert.id)} className="p-1 hover:text-red-400 transition-colors"><FiX size={14} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Languages */}
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FiGlobe className="text-cyan-400" /> Languages
                      </h3>
                      <button 
                        onClick={() => {
                          setEditingId(null);
                          setTempLanguage({ id: '', name: '', proficiency: 'Fluent' });
                          setShowLanguageModal(true);
                        }}
                        className="btn-secondary py-1.5 px-4 flex items-center gap-2 text-sm"
                      >
                        <FiPlus /> Add Language
                      </button>
                    </div>
                    
                    {resumeData.languages.length === 0 ? (
                      <p className="text-white/40 text-center py-4">No languages added yet.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {resumeData.languages.map((lang) => (
                          <div key={lang.id} className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center gap-3">
                            <div>
                              <p className="font-medium text-sm">{lang.name}</p>
                              <p className="text-xs text-white/40">{lang.proficiency}</p>
                            </div>
                            <button onClick={() => deleteLanguage(lang.id)} className="p-1 hover:text-red-400 transition-colors"><FiX size={14} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CREATE RESUME BUTTON */}
                  <div className="glass-card p-6">
                    <div className="flex flex-wrap gap-4">
                      <button 
                        onClick={createResume}
                        disabled={!selectedTemplate || !resumeData.personalInfo.fullName || !resumeData.personalInfo.email}
                        className="flex-1 btn-primary py-3 px-6 flex items-center justify-center gap-2 text-lg disabled:opacity-50"
                      >
                        <FiFileText className="text-xl" />
                        ✨ Create Resume
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('Are you sure you want to clear all data?')) {
                            setResumeData({
                              personalInfo: {
                                fullName: '',
                                professionalTitle: '',
                                email: '',
                                phone: '',
                                github: '',
                                linkedin: '',
                                location: '',
                                portfolio: ''
                              },
                              summary: '',
                              experience: [],
                              education: [],
                              skills: [],
                              projects: [],
                              certifications: [],
                              languages: [],
                              template: 'modern'
                            });
                            setSelectedTemplate(null);
                            success('Form cleared');
                          }
                        }}
                        className="btn-secondary py-3 px-6 flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-400"
                      >
                        <FiX /> Clear All
                      </button>
                    </div>
                    <p className="text-xs text-white/40 mt-3 text-center">
                      Required: Template, Full Name, and Email
                    </p>
                  </div>
                </div>
              ) : (
                // SHOW CREATED RESUME
                <div className="space-y-6">
                  {/* Resume Preview Header */}
                  <div className="glass-card p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                          <FiFileText className="text-cyan-400" />
                          Your Resume is Ready! 🎉
                        </h2>
                        <p className="text-white/60 text-sm">
                          Review your resume below and download as PDF
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => setShowCreatedResume(false)}
                          className="btn-secondary py-2 px-4 flex items-center gap-2"
                        >
                          <FiEdit3 /> Edit Resume
                        </button>
                        <button 
                          onClick={saveBuiltResume}
                          className="btn-secondary py-2 px-4 flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 border-green-500/30 text-green-400"
                        >
                          <FiSave /> Save
                        </button>
                        <button 
                          onClick={downloadPDF}
                          className="btn-primary py-2 px-6 flex items-center gap-2"
                        >
                          <FiDownload /> Download PDF
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Resume Display */}
                  <div 
                    ref={resumeRef}
                    className="bg-white text-gray-900 rounded-2xl p-8 shadow-2xl"
                    style={{ maxWidth: '210mm', margin: '0 auto' }}
                  >
                    {/* Template Header */}
                    <div className="text-center border-b-2 border-gray-200 pb-6 mb-6">
                      <h1 className="text-4xl font-bold">{resumeData.personalInfo.fullName || 'Your Name'}</h1>
                      <p className="text-xl text-gray-600 mt-1">{resumeData.personalInfo.professionalTitle || 'Professional Title'}</p>
                      <div className="flex flex-wrap justify-center gap-4 mt-3 text-sm text-gray-500">
                        {resumeData.personalInfo.email && <span>📧 {resumeData.personalInfo.email}</span>}
                        {resumeData.personalInfo.phone && <span>📱 {resumeData.personalInfo.phone}</span>}
                        {resumeData.personalInfo.location && <span>📍 {resumeData.personalInfo.location}</span>}
                      </div>
                      <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm">
                        {resumeData.personalInfo.github && (
                          <a href={resumeData.personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline flex items-center gap-1">
                            <FiGithub /> GitHub
                          </a>
                        )}
                        {resumeData.personalInfo.linkedin && (
                          <a href={resumeData.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline flex items-center gap-1">
                            <FiLinkedin /> LinkedIn
                          </a>
                        )}
                        {resumeData.personalInfo.portfolio && (
                          <a href={resumeData.personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="text-cyan-600 hover:underline flex items-center gap-1">
                            🌐 Portfolio
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Summary */}
                    {resumeData.summary && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-1 mb-2">PROFESSIONAL SUMMARY</h3>
                        <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
                      </div>
                    )}

                    {/* Experience */}
                    {resumeData.experience.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-1 mb-3">EXPERIENCE</h3>
                        {resumeData.experience.map((exp) => (
                          <div key={exp.id} className="mb-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-800">{exp.jobTitle}</h4>
                                <p className="text-cyan-600 font-medium">{exp.company}</p>
                              </div>
                              <p className="text-sm text-gray-500 whitespace-nowrap">{exp.startDate} - {exp.endDate || 'Present'}</p>
                            </div>
                            {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-700">
                              {exp.description.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Education */}
                    {resumeData.education.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-1 mb-3">EDUCATION</h3>
                        {resumeData.education.map((edu) => (
                          <div key={edu.id} className="mb-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-800">{edu.degree}</h4>
                                <p className="text-cyan-600">{edu.institution}</p>
                              </div>
                              <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate || 'Present'}</p>
                            </div>
                            {edu.location && <p className="text-sm text-gray-500">{edu.location}</p>}
                            {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Skills */}
                    {resumeData.skills.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-1 mb-3">SKILLS</h3>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.map((skill) => (
                            <span key={skill} className="px-3 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {resumeData.projects.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-1 mb-3">PROJECTS</h3>
                        {resumeData.projects.map((proj) => (
                          <div key={proj.id} className="mb-3">
                            <h4 className="font-semibold text-gray-800">{proj.title}</h4>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {proj.techStack.map((tech) => (
                                <span key={tech} className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                  {tech}
                                </span>
                              ))}
                            </div>
                            <ul className="list-disc pl-5 mt-1 space-y-1 text-gray-700">
                              {proj.description.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                            {proj.link && (
                              <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-cyan-600 text-sm hover:underline">
                                🔗 View Project
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Certifications */}
                    {resumeData.certifications.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-1 mb-3">CERTIFICATIONS</h3>
                        <div className="flex flex-wrap gap-3">
                          {resumeData.certifications.map((cert) => (
                            <div key={cert.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                              <p className="font-medium text-gray-800">{cert.name}</p>
                              <p className="text-sm text-gray-500">{cert.issuer} • {cert.date}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {resumeData.languages.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-gray-200 pb-1 mb-3">LANGUAGES</h3>
                        <div className="flex flex-wrap gap-3">
                          {resumeData.languages.map((lang) => (
                            <div key={lang.id} className="bg-gray-50 rounded-lg px-4 py-2 border border-gray-200">
                              <span className="font-medium text-gray-800">{lang.name}</span>
                              <span className="text-sm text-gray-500 ml-2">({lang.proficiency})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="text-center text-xs text-gray-400 border-t-2 border-gray-200 pt-4 mt-4">
                      Created with JobGenie · AI Placement Mentor
                    </div>
                  </div>

                  {/* Bottom Actions */}
                  <div className="glass-card p-6">
                    <div className="flex flex-wrap gap-4 justify-center">
                      <button 
                        onClick={() => setShowCreatedResume(false)}
                        className="btn-secondary py-2.5 px-6 flex items-center gap-2"
                      >
                        <FiEdit3 /> Back to Edit
                      </button>
                      <button 
                        onClick={saveBuiltResume}
                        className="btn-secondary py-2.5 px-6 flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 border-green-500/30 text-green-400"
                      >
                        <FiSave /> Save to Profile
                      </button>
                      <button 
                        onClick={downloadPDF}
                        className="btn-primary py-2.5 px-8 flex items-center gap-2 text-lg"
                      >
                        <FiDownload className="text-xl" />
                        Download PDF
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('Print this resume?')) {
                            window.print();
                          }
                        }}
                        className="btn-secondary py-2.5 px-6 flex items-center gap-2"
                      >
                        <FiPrinter /> Print
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* LaTeX Editor Tab */}
          {activeTab === 'latex' && (
            <div className="glass-card p-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><FiCode className="text-cyan-400" /> LaTeX Editor</h2>
              <textarea value={latexContent} onChange={(e) => setLatexContent(e.target.value)} className="w-full h-96 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white font-mono text-sm" />
              <div className="flex gap-3 mt-4"><button onClick={saveLatexContent} className="btn-primary py-2 px-6 flex items-center gap-2"><FiSave /> Save LaTeX</button><button className="btn-secondary py-2 px-6 flex items-center gap-2"><FiPrinter /> Compile PDF</button></div>
            </div>
          )}

          {/* AI Cover Letter Tab */}
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

        {/* Sidebar - Only show when not viewing created resume */}
        {!showCreatedResume && (
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
              <ul className="space-y-2 text-white/60 text-sm">
                <li>• Use standard section headings (Experience, Education, Skills)</li>
                <li>• Avoid tables, columns, and graphics for ATS</li>
                <li>• Save as PDF before submitting</li>
                <li>• Tailor your resume for each application</li>
                <li>• Include keywords from job description</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* All Modals - Keep existing */}
      {/* Experience Modal */}
      <AnimatePresence>
        {showExperienceModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowExperienceModal(false);
              setEditingId(null);
              resetTempExperience();
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiBriefcase className="text-cyan-400" />
                {editingId ? 'Edit Experience' : 'Add Experience'}
              </h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white/70">Job Title *</label>
                    <input 
                      type="text" 
                      placeholder="Software Engineer"
                      value={tempExperience.jobTitle}
                      onChange={(e) => setTempExperience({ ...tempExperience, jobTitle: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white/70">Company *</label>
                    <input 
                      type="text" 
                      placeholder="Google"
                      value={tempExperience.company}
                      onChange={(e) => setTempExperience({ ...tempExperience, company: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white/70">Start Date *</label>
                    <input 
                      type="text" 
                      placeholder="Jan 2020"
                      value={tempExperience.startDate}
                      onChange={(e) => setTempExperience({ ...tempExperience, startDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white/70">End Date</label>
                    <input 
                      type="text" 
                      placeholder="Present"
                      value={tempExperience.endDate}
                      onChange={(e) => setTempExperience({ ...tempExperience, endDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white/70">Location</label>
                    <input 
                      type="text" 
                      placeholder="San Francisco, CA"
                      value={tempExperience.location}
                      onChange={(e) => setTempExperience({ ...tempExperience, location: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-white/70">Description</label>
                  {tempExperience.description.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        placeholder={`Achievement ${index + 1}`}
                        value={item}
                        onChange={(e) => {
                          const newDesc = [...tempExperience.description];
                          newDesc[index] = e.target.value;
                          setTempExperience({ ...tempExperience, description: newDesc });
                        }}
                        className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                      />
                      <button 
                        onClick={() => {
                          const newDesc = tempExperience.description.filter((_, i) => i !== index);
                          setTempExperience({ ...tempExperience, description: newDesc });
                        }}
                        className="p-2 hover:text-red-400 transition-colors"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setTempExperience({ 
                      ...tempExperience, 
                      description: [...tempExperience.description, ''] 
                    })}
                    className="text-cyan-400 text-sm hover:underline flex items-center gap-1"
                  >
                    <FiPlus /> Add achievement
                  </button>
                </div>
                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={addExperience}
                    disabled={!tempExperience.jobTitle || !tempExperience.company || !tempExperience.startDate}
                    className="flex-1 btn-primary py-2 disabled:opacity-50"
                  >
                    {editingId ? 'Update' : 'Add'} Experience
                  </button>
                  <button 
                    onClick={() => {
                      setShowExperienceModal(false);
                      setEditingId(null);
                      resetTempExperience();
                    }}
                    className="flex-1 btn-secondary py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Education Modal */}
      <AnimatePresence>
        {showEducationModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowEducationModal(false);
              setEditingId(null);
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiBookOpen className="text-cyan-400" />
                {editingId ? 'Edit Education' : 'Add Education'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-white/70">Degree *</label>
                  <input 
                    type="text" 
                    placeholder="Master of Science in Computer Science"
                    value={tempEducation.degree}
                    onChange={(e) => setTempEducation({ ...tempEducation, degree: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-white/70">Institution *</label>
                  <input 
                    type="text" 
                    placeholder="Stanford University"
                    value={tempEducation.institution}
                    onChange={(e) => setTempEducation({ ...tempEducation, institution: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white/70">Start Date *</label>
                    <input 
                      type="text" 
                      placeholder="Sep 2018"
                      value={tempEducation.startDate}
                      onChange={(e) => setTempEducation({ ...tempEducation, startDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white/70">End Date</label>
                    <input 
                      type="text" 
                      placeholder="Jun 2020"
                      value={tempEducation.endDate}
                      onChange={(e) => setTempEducation({ ...tempEducation, endDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-white/70">GPA</label>
                    <input 
                      type="text" 
                      placeholder="3.9/4.0"
                      value={tempEducation.gpa}
                      onChange={(e) => setTempEducation({ ...tempEducation, gpa: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-white/70">Location</label>
                  <input 
                    type="text" 
                    placeholder="Stanford, CA"
                    value={tempEducation.location}
                    onChange={(e) => setTempEducation({ ...tempEducation, location: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={addEducation}
                    disabled={!tempEducation.degree || !tempEducation.institution || !tempEducation.startDate}
                    className="flex-1 btn-primary py-2 disabled:opacity-50"
                  >
                    {editingId ? 'Update' : 'Add'} Education
                  </button>
                  <button 
                    onClick={() => {
                      setShowEducationModal(false);
                      setEditingId(null);
                    }}
                    className="flex-1 btn-secondary py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Modal */}
      <AnimatePresence>
        {showProjectModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowProjectModal(false);
              setEditingId(null);
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiFolder className="text-cyan-400" />
                {editingId ? 'Edit Project' : 'Add Project'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-white/70">Project Title *</label>
                  <input 
                    type="text" 
                    placeholder="E-Commerce Platform"
                    value={tempProject.title}
                    onChange={(e) => setTempProject({ ...tempProject, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-white/70">Tech Stack (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="React, Node.js, MongoDB"
                    value={tempProject.techStack.join(', ')}
                    onChange={(e) => setTempProject({ 
                      ...tempProject, 
                      techStack: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-white/70">Description</label>
                  {tempProject.description.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        placeholder={`Point ${index + 1}`}
                        value={item}
                        onChange={(e) => {
                          const newDesc = [...tempProject.description];
                          newDesc[index] = e.target.value;
                          setTempProject({ ...tempProject, description: newDesc });
                        }}
                        className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                      />
                      <button 
                        onClick={() => {
                          const newDesc = tempProject.description.filter((_, i) => i !== index);
                          setTempProject({ ...tempProject, description: newDesc });
                        }}
                        className="p-2 hover:text-red-400 transition-colors"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setTempProject({ 
                      ...tempProject, 
                      description: [...tempProject.description, ''] 
                    })}
                    className="text-cyan-400 text-sm hover:underline flex items-center gap-1"
                  >
                    <FiPlus /> Add point
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-white/70">Project Link</label>
                  <input 
                    type="text" 
                    placeholder="https://github.com/username/project"
                    value={tempProject.link}
                    onChange={(e) => setTempProject({ ...tempProject, link: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={addProject}
                    disabled={!tempProject.title}
                    className="flex-1 btn-primary py-2 disabled:opacity-50"
                  >
                    {editingId ? 'Update' : 'Add'} Project
                  </button>
                  <button 
                    onClick={() => {
                      setShowProjectModal(false);
                      setEditingId(null);
                    }}
                    className="flex-1 btn-secondary py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Certification Modal */}
      <AnimatePresence>
        {showCertificationModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowCertificationModal(false);
              setEditingId(null);
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiAward className="text-cyan-400" />
                {editingId ? 'Edit Certification' : 'Add Certification'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-white/70">Certification Name *</label>
                  <input 
                    type="text" 
                    placeholder="AWS Certified Solutions Architect"
                    value={tempCertification.name}
                    onChange={(e) => setTempCertification({ ...tempCertification, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-white/70">Issuer *</label>
                  <input 
                    type="text" 
                    placeholder="Amazon Web Services"
                    value={tempCertification.issuer}
                    onChange={(e) => setTempCertification({ ...tempCertification, issuer: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-white/70">Date</label>
                  <input 
                    type="text" 
                    placeholder="June 2023"
                    value={tempCertification.date}
                    onChange={(e) => setTempCertification({ ...tempCertification, date: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={addCertification}
                    disabled={!tempCertification.name || !tempCertification.issuer}
                    className="flex-1 btn-primary py-2 disabled:opacity-50"
                  >
                    {editingId ? 'Update' : 'Add'} Certification
                  </button>
                  <button 
                    onClick={() => {
                      setShowCertificationModal(false);
                      setEditingId(null);
                    }}
                    className="flex-1 btn-secondary py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Language Modal */}
      <AnimatePresence>
        {showLanguageModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowLanguageModal(false);
              setEditingId(null);
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FiGlobe className="text-cyan-400" />
                {editingId ? 'Edit Language' : 'Add Language'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-white/70">Language *</label>
                  <input 
                    type="text" 
                    placeholder="English"
                    value={tempLanguage.name}
                    onChange={(e) => setTempLanguage({ ...tempLanguage, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-white/70">Proficiency</label>
                  <select 
                    value={tempLanguage.proficiency}
                    onChange={(e) => setTempLanguage({ ...tempLanguage, proficiency: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white"
                  >
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Professional">Professional</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                  </select>
                </div>
                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={addLanguage}
                    disabled={!tempLanguage.name}
                    className="flex-1 btn-primary py-2 disabled:opacity-50"
                  >
                    {editingId ? 'Update' : 'Add'} Language
                  </button>
                  <button 
                    onClick={() => {
                      setShowLanguageModal(false);
                      setEditingId(null);
                    }}
                    className="flex-1 btn-secondary py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}