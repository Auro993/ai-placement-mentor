import { useState } from 'react';
import { 
  FiLinkedin, 
  FiSend, 
  FiCopy, 
  FiRefreshCw,
  FiCheckCircle,
  FiZap,
  FiCpu,
  FiShare2,
  FiEdit3
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AI_SERVICE = 'http://localhost:5001';

export default function LinkedInStudio() {
  const { user } = useAuth();
  const { success, error } = useToast();
  
  const [topic, setTopic] = useState('');
  const [postType, setPostType] = useState('achievement');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const postTypes = [
    { value: 'achievement', label: '🏆 Achievement', icon: '🎉' },
    { value: 'project', label: '💻 Project Launch', icon: '🚀' },
    { value: 'learning', label: '📚 Learning Journey', icon: '📖' },
    { value: 'tip', label: '💡 Tip/Advice', icon: '💡' },
    { value: 'question', label: '❓ Question', icon: '🤔' },
  ];
  
  const generatePost = async () => {
    if (!topic.trim()) {
      error('Please enter a topic');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const response = await fetch(`${AI_SERVICE}/api/linkedin/generate-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic,
          postType: postType,
          userName: user?.name || 'Professional',
          tone: 'professional'
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.post) {
        setGeneratedPost(data.post);
        success('LinkedIn post generated!');
      } else {
        setGeneratedPost(generateFallbackPost());
      }
    } catch (err) {
      console.error('Error:', err);
      setGeneratedPost(generateFallbackPost());
      error('Using fallback generator');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const generateFallbackPost = () => {
    const templates = {
      achievement: `🎉 Excited to share a milestone! I've achieved ${topic}. Grateful for the journey and looking forward to what's next! #Achievement #Growth`,
      project: `🚀 I'm thrilled to announce the launch of ${topic}! After weeks of hard work, it's finally here. Check it out and let me know your thoughts! #Launch #Innovation`,
      learning: `📚 Just completed ${topic}! The learning never stops. What are you learning these days? #ContinuousLearning #Growth`,
      tip: `💡 Here's a tip I learned about ${topic}: Always keep iterating and improving. Small daily progress adds up to massive results! #Tip #Success`,
      question: `🤔 Question for my network: What's your approach to ${topic}? I'd love to hear your insights and experiences! #Discussion #Community`,
    };
    return templates[postType as keyof typeof templates] || templates.achievement;
  };
  
  const copyToClipboard = async () => {
    if (!generatedPost) return;
    await navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };
  
  const openLinkedIn = () => {
    if (!generatedPost) return;
    const encodedText = encodeURIComponent(generatedPost);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?text=${encodedText}`, '_blank');
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-4">
          <FiLinkedin className="text-cyan-400" />
          <span className="text-sm text-cyan-400">AI-Powered Content Studio</span>
        </div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          LinkedIn Studio
        </h1>
        <p className="text-white/60">Generate engaging LinkedIn posts with AI</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Input */}
        <div className="space-y-5">
          {/* Post Type Selection */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3">Post Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {postTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setPostType(type.value)}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    postType === type.value
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Topic Input */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3">What's your topic?</h3>
            <textarea
              placeholder="e.g., Completed AWS Certification, Launched my portfolio, Learned React Hooks..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-cyan-500 outline-none text-white"
            />
          </div>
          
          {/* Generate Button */}
          <button
            onClick={generatePost}
            disabled={isGenerating || !topic.trim()}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? <FiRefreshCw className="animate-spin" /> : <FiZap />}
            {isGenerating ? 'AI is writing...' : 'Generate Post'}
          </button>
        </div>
        
        {/* Right Column - Output */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <FiCpu className="text-cyan-400" /> Generated Post
            </h3>
            {generatedPost && (
              <div className="flex gap-2">
                <button onClick={copyToClipboard} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors" title="Copy">
                  {copied ? <FiCheckCircle className="text-green-400" /> : <FiCopy className="text-gray-400" />}
                </button>
                <button onClick={openLinkedIn} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors" title="Post to LinkedIn">
                  <FiShare2 className="text-cyan-400" />
                </button>
              </div>
            )}
          </div>
          
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400 mb-3"></div>
              <p className="text-gray-400 text-sm">AI is crafting your post...</p>
            </div>
          ) : generatedPost ? (
            <div className="relative">
              <div className="bg-gradient-to-r from-cyan-600/5 to-purple-600/5 rounded-xl p-4 border border-cyan-500/20">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{user?.name || 'Professional'}</p>
                    <p className="text-xs text-gray-500">Just now · 🌍</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{generatedPost}</p>
                <div className="flex gap-4 mt-3 pt-2 text-gray-500 text-xs">
                  <span>❤️ Like</span>
                  <span>💬 Comment</span>
                  <span>🔄 Repost</span>
                  <span>📤 Send</span>
                </div>
              </div>
              <button
                onClick={openLinkedIn}
                className="mt-3 w-full btn-secondary py-2 flex items-center justify-center gap-2 text-sm"
              >
                <FiEdit3 /> Edit & Post to LinkedIn
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FiLinkedin className="text-5xl text-gray-600 mb-3" />
              <p className="text-gray-500">Select post type, enter a topic, and generate your post</p>
              <p className="text-xs text-gray-600 mt-2">AI will create an engaging LinkedIn post for you</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Tips */}
      <div className="mt-6 p-4 bg-gray-900/30 rounded-xl text-center">
        <p className="text-xs text-gray-500">
          💡 Tip: Be specific about your achievement. Include skills, technologies, and results for better engagement!
        </p>
      </div>
    </div>
  );
}