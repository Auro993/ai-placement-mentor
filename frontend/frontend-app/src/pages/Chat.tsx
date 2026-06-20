import { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import ChatBubble from '../components/ChatBubble';
import LoaderAnimation from '../components/LoaderAnimation';
import { FiSend, FiCpu, FiMessageSquare, FiPlus, FiTrash2, FiChevronLeft, FiEdit2, FiCheck, FiX } from 'react-icons/fi';

export default function Chat() {
  const { currentSessionId, sessions, sendMessage, createNewSession, switchSession, deleteSession, isLoading } = useChat();
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentSession = sessions.find(s => s.id === currentSessionId);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isLoading]);
  
  useEffect(() => {
    if (currentSession) {
      setNewTitle(currentSession.title);
    }
  }, [currentSession]);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const message = input;
    setInput('');
    await sendMessage(message);
  };
  
  const handleNewChat = () => {
    createNewSession();
  };
  
  const handleSwitchChat = (id: string) => {
    switchSession(id);
    setIsEditingTitle(false);
  };
  
  const handleRenameChat = () => {
    if (!currentSession) return;
    // Update the session title in localStorage/context
    const updatedSessions = sessions.map(session => 
      session.id === currentSessionId 
        ? { ...session, title: newTitle.trim() || 'New Chat' }
        : session
    );
    // Update via context (assuming there's a method or we directly modify)
    // Since we don't have a rename function in context, we'll use localStorage directly
    localStorage.setItem('chatSessions', JSON.stringify(updatedSessions));
    // Refresh the sessions by triggering a re-render
    window.dispatchEvent(new Event('storage'));
    // Force update by reloading the page (or use a state update)
    setIsEditingTitle(false);
    // Reload the page to reflect changes
    window.location.reload();
  };
  
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
  
  return (
    <div className="flex h-full gap-0 relative">
      {/* Chat History Sidebar (Inside Chat) */}
      <div className={`bg-[#0D0D12] border-r border-white/10 flex flex-col transition-all duration-300 overflow-hidden ${
        showHistory ? 'w-72' : 'w-0'
      }`}>
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-sm font-semibold text-white">Chats</h3>
          <button onClick={() => setShowHistory(false)} className="text-gray-400 hover:text-white">
            <FiChevronLeft size={18} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {sessions.map((session) => (
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
                <div className="text-xs text-gray-500">
                  {formatDate(session.createdAt)} · {session.messages.length} msgs
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          ))}
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
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          {/* Chat History Toggle Button */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 rounded-lg transition-all bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            <FiMessageSquare size={20} />
          </button>
          
          {/* Chat Title with Edit */}
          <div className="flex-1 flex items-center gap-2">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-transparent border-b border-cyan-400 text-white text-sm font-semibold outline-none px-1 focus:border-cyan-300"
                  autoFocus
                />
                <button
                  onClick={handleRenameChat}
                  className="p-1 text-green-400 hover:text-green-300 transition-colors"
                >
                  <FiCheck size={16} />
                </button>
                <button
                  onClick={() => {
                    setIsEditingTitle(false);
                    setNewTitle(currentSession?.title || 'New Chat');
                  }}
                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                >
                  <FiX size={16} />
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-sm font-semibold text-white truncate">
                  {currentSession?.title || 'New Chat'}
                </h2>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="p-1 text-gray-400 hover:text-cyan-400 transition-colors"
                  title="Rename chat"
                >
                  <FiEdit2 size={14} />
                </button>
              </>
            )}
          </div>
          
          <p className="text-xs text-gray-500 hidden sm:block">
            {currentSession?.messages.length || 0} messages
          </p>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
          {currentSession?.messages.map(msg => (
            <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                <FiCpu size={16} />
              </div>
              <div className="glass-card px-5 py-3">
                <LoaderAnimation />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="p-4 border-t border-white/10">
          <div className="glass-card p-2 flex gap-2 max-w-4xl mx-auto">
            <input 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              onKeyPress={e => e.key === 'Enter' && handleSend()} 
              placeholder="Ask me anything about your placement journey..." 
              className="flex-1 bg-transparent px-4 py-3 outline-none text-white placeholder-gray-500" 
            />
            <button 
              onClick={handleSend} 
              disabled={isLoading || !input.trim()} 
              className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-cyan-500/25"
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