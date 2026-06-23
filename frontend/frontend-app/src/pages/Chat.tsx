import { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import ChatBubble from '../components/ChatBubble';
import LoaderAnimation from '../components/LoaderAnimation';
import { FiSend, FiCpu, FiMessageSquare, FiPlus, FiTrash2, FiChevronLeft, FiEdit2, FiCheck, FiX, FiDownload, FiCopy } from 'react-icons/fi';

export default function Chat() {
  const { currentSessionId, sessions, sendMessage, createNewSession, switchSession, deleteSession, isLoading, renameSession } = useChat();
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentSession = sessions.find(s => s.id === currentSessionId);
  
  // Handle window resize for mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowHistory(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isLoading]);
  
  // Set title when session changes
  useEffect(() => {
    if (currentSession) {
      setNewTitle(currentSession.title);
    }
  }, [currentSession]);
  
  // Handle send message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const message = input;
    setInput('');
    await sendMessage(message);
  };
  
  // Handle new chat
  const handleNewChat = () => {
    createNewSession();
    if (isMobile) setShowHistory(false);
  };
  
  // Handle switch chat
  const handleSwitchChat = (id: string) => {
    switchSession(id);
    setIsEditingTitle(false);
    if (isMobile) setShowHistory(false);
  };
  
  // Handle rename chat
  const handleRenameChat = () => {
    if (!currentSession) return;
    const trimmedTitle = newTitle.trim() || 'New Chat';
    renameSession(currentSession.id, trimmedTitle);
    setIsEditingTitle(false);
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };
  
  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Copy messages to clipboard
  const copyChat = () => {
    if (!currentSession) return;
    const text = currentSession.messages.map(m => 
      `${m.role === 'user' ? '👤 User' : '🤖 AI Mentor'}: ${m.content}`
    ).join('\n\n');
    navigator.clipboard.writeText(text);
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 transition-all duration-300';
    toast.textContent = '✅ Chat copied to clipboard!';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  // Download chat as text file
  const downloadChat = () => {
    if (!currentSession) return;
    const text = currentSession.messages.map(m => 
      `[${new Date(m.timestamp).toLocaleString()}] ${m.role.toUpperCase()}: ${m.content}`
    ).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Chat_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Get current session messages count
  const getMessageCount = () => {
    return currentSession?.messages.length || 0;
  };
  
  return (
    <div className="flex h-full gap-0 relative">
      {/* Chat History Sidebar */}
      <div 
        className={`bg-[#0D0D12] border-r border-white/10 flex flex-col transition-all duration-300 overflow-hidden ${
          showHistory ? 'w-72' : 'w-0'
        } ${isMobile ? 'absolute top-0 left-0 h-full z-20 shadow-2xl' : 'relative'}`}
      >
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-white">Chats</h3>
          <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-white">
            <FiChevronLeft size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {sessions.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8">
              <p>No chats yet</p>
              <p className="text-xs mt-1">Start a new conversation</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSwitchChat(session.id)}
                className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  currentSessionId === session.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border-l-2 border-cyan-500'
                    : 'hover:bg-white/5 text-gray-300'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className={`text-sm truncate ${
                    currentSessionId === session.id ? 'text-cyan-400 font-medium' : 'text-gray-300'
                  }`}>
                    {session.title}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span>{formatDate(session.updatedAt || session.createdAt)}</span>
                    <span>·</span>
                    <span>{session.messages.length} msgs</span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (sessions.length > 1 && confirm('Delete this chat?')) {
                      deleteSession(session.id);
                    } else if (sessions.length === 1) {
                      alert('Cannot delete the last chat. Create a new one first.');
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
        
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl py-2 text-sm font-medium transition-all"
          >
            <FiPlus size={16} /> New Chat
          </button>
        </div>
      </div>
      
      {/* Mobile overlay */}
      {isMobile && showHistory && (
        <div 
          className="fixed inset-0 bg-black/50 z-10"
          onClick={() => setShowHistory(false)}
        />
      )}
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-[#0D0D12]/50 backdrop-blur-sm">
          {/* Chat History Toggle Button */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-lg transition-all bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            <FiMessageSquare size={20} />
          </button>
          
          {/* Chat Title with Edit */}
          <div className="flex-1 flex items-center gap-2 min-w-0">
            {isEditingTitle ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-transparent border-b border-cyan-400 text-white text-sm font-semibold outline-none px-1 focus:border-cyan-300 flex-1 min-w-0"
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleRenameChat();
                    }
                  }}
                />
                <button
                  onClick={handleRenameChat}
                  className="p-1 text-green-400 hover:text-green-300 transition-colors flex-shrink-0"
                  title="Save"
                >
                  <FiCheck size={16} />
                </button>
                <button
                  onClick={() => {
                    setIsEditingTitle(false);
                    setNewTitle(currentSession?.title || 'New Chat');
                  }}
                  className="p-1 text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                  title="Cancel"
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-sm font-semibold text-white truncate">
                  {currentSession?.title || 'New Chat'}
                </h2>
                {currentSession && (
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="p-1 text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0"
                    title="Rename chat"
                  >
                    <FiEdit2 size={14} />
                  </button>
                )}
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Copy Chat Button */}
            {currentSession && currentSession.messages.length > 0 && (
              <button
                onClick={copyChat}
                className="p-2 text-gray-400 hover:text-cyan-400 transition-colors hidden sm:block"
                title="Copy chat"
              >
                <FiCopy size={16} />
              </button>
            )}
            
            {/* Download Chat Button */}
            {currentSession && currentSession.messages.length > 0 && (
              <button
                onClick={downloadChat}
                className="p-2 text-gray-400 hover:text-cyan-400 transition-colors hidden sm:block"
                title="Download chat"
              >
                <FiDownload size={16} />
              </button>
            )}
            
            <p className="text-xs text-gray-500 hidden sm:block">
              {getMessageCount()} msgs
            </p>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 bg-gradient-to-b from-[#0D0D12] to-[#1a1a2e]">
          {currentSession?.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                <FiCpu size={32} className="text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Hi! I'm your AI Placement Mentor</h3>
              <p className="text-gray-400 max-w-md">
                Ask me anything about resume building, interview tips, or career advice!
              </p>
            </div>
          ) : (
            currentSession?.messages.map(msg => (
              <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
            ))
          )}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <FiCpu size={16} className="text-white" />
              </div>
              <div className="glass-card px-5 py-3">
                <LoaderAnimation />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-[#0D0D12]/50 backdrop-blur-sm">
          <div className="glass-card p-2 flex gap-2 max-w-4xl mx-auto">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyPress={handleKeyPress} 
              placeholder="Ask me anything about your placement journey..." 
              className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder-gray-500 text-sm" 
            />
            <button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()} 
              className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center"
            >
              <FiSend />
            </button>
          </div>
          <p className="text-center text-xs text-gray-600 mt-2">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}