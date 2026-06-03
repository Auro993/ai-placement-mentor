import { useState, useRef, useEffect } from 'react';
import { 
  FiClock, FiCheckCircle, FiMic, FiSquare, 
  FiRefreshCw, FiTrendingUp, FiThumbsUp, FiThumbsDown,
  FiVolume2, FiHeadphones, FiRadio, FiZap, FiAward,
  FiBarChart2, FiStar, FiTarget, FiBookOpen, FiCpu
} from 'react-icons/fi';
import { useToast } from '../context/ToastContext';
import { aiService } from '../services/aiService';

const API_BASE = 'http://localhost:8080/api';

export default function MockInterview() {
  const { success, error } = useToast();
  
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [isActive, setIsActive] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Frontend Developer');
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputMethod, setInputMethod] = useState<'typing' | 'voice'>('typing');
  const [showWarning, setShowWarning] = useState(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const [questions, setQuestions] = useState<string[]>([
    "Tell me about yourself and why you're interested in this role.",
    "Describe a challenging frontend project you worked on.",
    "How do you optimize website performance?",
    "Explain the difference between let, const, and var.",
    "Where do you see yourself in 5 years?"
  ]);
  
  const roles = [
    'Software Engineer', 'Data Scientist', 'Frontend Developer', 
    'Backend Developer', 'Full Stack Developer', 'DevOps Engineer',
    'Product Manager', 'AI/ML Engineer'
  ];
  
  const generateAIQuestion = async () => {
    setIsGenerating(true);
    try {
      const data = await aiService.generateInterviewQuestion(selectedRole);
      const newQuestion = data.question || "Tell me about a challenging project you worked on.";
      const newQuestions = [...questions];
      newQuestions[currentQ] = newQuestion;
      setQuestions(newQuestions);
      success(`✨ New AI-generated question loaded!`);
    } catch (err) {
      error('Failed to generate question');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        await convertAudioToText(audioBlob);
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      success('Recording started! Speak your answer.');
    } catch (err) {
      error('Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsTranscribing(true);
      success('Recording stopped! Transcribing...');
    }
  };

  const convertAudioToText = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');

    try {
      const response = await fetch(`http://localhost:5001/api/interview/speech-to-text`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.text) {
        setAnswer(data.text);
        success('Voice transcribed successfully!');
      } else {
        error(data.error || 'Could not transcribe audio');
      }
    } catch (err) {
      error('Speech to text failed. Please type your answer.');
    } finally {
      setIsTranscribing(false);
    }
  };
  
  const startTimer = () => { 
    setIsActive(true);
    setShowWarning(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 30 && prev > 10 && !showWarning) {
          setShowWarning(true);
          success("⏰ 30 seconds remaining!");
        }
        
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsActive(false);
          if (answer.trim()) {
            submitAnswer();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const submitAnswer = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsActive(false);
    
    if (!answer.trim()) {
      error('Please provide an answer');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const analysis = await aiService.analyzeInterviewAnswer(
        questions[currentQ], answer, selectedRole
      );
      
      setAiAnalysis(analysis);
      setFeedback(analysis.feedback);
      success(`🎯 Score: ${analysis.score}/100`);
    } catch (err) {
      error('Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  const nextQuestion = () => {
    setFeedback(null);
    setAiAnalysis(null);
    setAnswer('');
    setAudioURL(null);
    setTimeLeft(120);
    setIsActive(false);
    
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setFeedback("🎉 Congratulations! You've completed all questions!");
      setCurrentQ(0);
    }
  };
  
  const getTimerColor = () => {
    if (timeLeft <= 10) return "text-red-500";
    if (timeLeft <= 30) return "text-yellow-400";
    return "text-cyan-400";
  };
  
  return (
    <div className="max-w-6xl mx-auto text-white">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 mb-4">
          <FiCpu className="text-cyan-400" size={16} />
          <span className="text-sm text-cyan-400 font-medium">AI-Powered Mock Interview</span>
        </div>
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          🎤 AI Mock Interview
        </h1>
        <p className="text-gray-400">Practice with AI-powered feedback. Choose voice or typing. Get real-time scoring!</p>
      </div>
      
      {/* Role Selector & Controls - FIXED LAYOUT (close together) */}
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <div className="flex gap-3 items-center">
          <div className="px-3 py-1.5 rounded-lg bg-gray-800/50 text-sm text-gray-300 border border-gray-700">
            <FiTarget className="inline mr-1 text-cyan-400" size={14} />
            Select Role
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-900/80 border border-gray-700 focus:border-cyan-500 outline-none text-white font-medium"
          >
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={generateAIQuestion}
          disabled={isGenerating}
          className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white py-2 px-5 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105 disabled:opacity-50 shadow-lg shadow-cyan-500/30"
        >
          <FiRefreshCw className={isGenerating ? 'animate-spin' : ''} />
          {isGenerating ? 'Generating...' : '✨ Generate AI Question'}
        </button>
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Question Card */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{currentQ + 1}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-300">Question {currentQ + 1}/{questions.length}</h3>
              </div>
              {isActive && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${timeLeft <= 10 ? 'bg-red-500/30 border border-red-500/50 animate-pulse' : timeLeft <= 30 ? 'bg-yellow-500/20 border border-yellow-500/30' : 'bg-cyan-500/20 border border-cyan-500/30'}`}>
                  <FiClock className={getTimerColor()} />
                  <span className={`font-mono text-xl font-bold ${getTimerColor()}`}>
                    {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                  </span>
                </div>
              )}
            </div>
            <p className="text-lg leading-relaxed text-gray-200 mb-6">{questions[currentQ]}</p>
            
            {!isActive && !feedback && (
              <button onClick={startTimer} className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white py-2.5 px-8 rounded-xl flex items-center gap-2 mx-auto transition-all">
                <FiZap /> Start Answering
              </button>
            )}
          </div>
          
          {/* Answer Input Area */}
          {isActive && (
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <div className="flex gap-3 mb-5">
                <button
                  onClick={() => setInputMethod('typing')}
                  className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 font-medium ${
                    inputMethod === 'typing' 
                      ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  ⌨️ Type Answer
                </button>
                <button
                  onClick={() => setInputMethod('voice')}
                  className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 font-medium ${
                    inputMethod === 'voice' 
                      ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  🎙️ Voice Answer
                </button>
              </div>
              
              {inputMethod === 'typing' && (
                <textarea 
                  value={answer} 
                  onChange={e => setAnswer(e.target.value)} 
                  placeholder="Type your answer here... Be specific and use the STAR method!"
                  rows={6} 
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/80 border border-gray-700 focus:border-cyan-500 outline-none text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              )}
              
              {inputMethod === 'voice' && (
                <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-6 text-center border-2 border-cyan-500/30">
                  <FiHeadphones className="text-5xl text-cyan-400 mx-auto mb-3" />
                  <p className="text-gray-400 mb-5">Click the button below and speak your answer clearly</p>
                  
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3 px-8 rounded-xl flex items-center gap-3 mx-auto transition-all transform hover:scale-105 shadow-lg"
                    >
                      <FiMic className="text-2xl" /> Start Recording
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="bg-gradient-to-r from-red-600 to-pink-700 text-white py-3 px-8 rounded-xl flex items-center gap-3 mx-auto transition-all transform hover:scale-105"
                    >
                      <FiSquare className="text-2xl" /> Stop Recording
                    </button>
                  )}
                  
                  {audioURL && (
                    <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                      <audio controls src={audioURL} className="mx-auto w-full max-w-xs" />
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex gap-3 mt-5">
                <button 
                  onClick={submitAnswer}
                  disabled={isLoading || !answer.trim()}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 text-lg font-medium transition-all"
                >
                  {isLoading ? <FiRefreshCw className="animate-spin" /> : <FiZap />}
                  {isLoading ? 'AI Analyzing...' : 'Submit for AI Analysis'}
                </button>
              </div>
            </div>
          )}
          
          {/* AI Feedback Panel */}
          {feedback && aiAnalysis && (
            <div className="bg-gray-900/50 backdrop-blur-sm border-2 border-green-500/30 rounded-2xl p-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <FiCheckCircle className="text-green-400 text-xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-400">AI Analysis</h4>
                    <p className="text-xs text-gray-500">Powered by Gemini AI</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${aiAnalysis.score >= 80 ? 'text-green-400' : aiAnalysis.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {aiAnalysis.score}/100
                  </div>
                  <div className="text-xs text-gray-500">Score</div>
                </div>
              </div>
              
              <div className="mb-4 p-4 bg-gray-800/50 rounded-xl">
                <h4 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2">
                  <FiBookOpen size={16} /> Feedback
                </h4>
                <p className="text-gray-300 leading-relaxed">{aiAnalysis.feedback}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-green-500/10 rounded-xl border border-green-500/20">
                  <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                    <FiThumbsUp /> Strengths
                  </h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    {aiAnalysis.strengths?.map((s: string, i: number) => (
                      <li key={i}>✓ {s}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                  <h4 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                    <FiThumbsDown /> Improvements
                  </h4>
                  <ul className="space-y-1 text-gray-300 text-sm">
                    {aiAnalysis.improvements?.map((imp: string, i: number) => (
                      <li key={i}>• {imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={nextQuestion} 
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {currentQ < questions.length - 1 ? "Next Question →" : "🎉 Complete Interview"}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Tips Sidebar */}
        <div className="space-y-6">
          {/* AI Interview Tips */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
                <FiTrendingUp className="text-white" size={16} />
              </div>
              <h3 className="font-semibold text-white">💡 AI Interview Tips</h3>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2 text-gray-300">
                <span className="text-cyan-400">⭐</span>
                <span>Use the <span className="text-white">STAR method</span> - Situation, Task, Action, Result</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <span className="text-cyan-400">📊</span>
                <span>Be <span className="text-white">specific</span> with examples and metrics</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <span className="text-cyan-400">🎯</span>
                <span><span className="text-white">Quantify achievements</span> (e.g., "Improved by 30%")</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <span className="text-cyan-400">⏱️</span>
                <span>Keep answers <span className="text-white">concise</span> - 1-2 minutes optimal</span>
              </li>
            </ul>
          </div>
          
          {/* Voice Recording Tips */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <FiRadio className="text-cyan-400" size={18} />
              <h3 className="font-semibold text-white">🎤 Voice Recording Tips</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• 🎙️ Speak clearly at a moderate pace</li>
              <li>• 🔇 Ensure quiet environment</li>
              <li>• 📝 Review transcribed text before submitting</li>
              <li>• 🎯 Practice multiple times for best results</li>
            </ul>
          </div>
          
          {/* Score Breakdown */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <FiBarChart2 className="text-cyan-400" size={18} />
              <h3 className="font-semibold text-white">📊 Score Breakdown</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Content & Relevance</span>
                  <span className="text-cyan-400">40%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1.5 rounded-full w-2/5"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">STAR Method</span>
                  <span className="text-cyan-400">25%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1.5 rounded-full w-1/4"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Keywords & Metrics</span>
                  <span className="text-cyan-400">20%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1.5 rounded-full w-1/5"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Clarity & Conciseness</span>
                  <span className="text-cyan-400">15%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-1.5 rounded-full w-[15%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}