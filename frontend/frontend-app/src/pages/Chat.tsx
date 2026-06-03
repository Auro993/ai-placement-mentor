import { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import ChatBubble from '../components/ChatBubble';
import LoaderAnimation from '../components/LoaderAnimation';
import { FiSend, FiCpu } from 'react-icons/fi';

export default function Chat() {
  const { currentSessionId, sessions, sendMessage, isLoading } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentSession = sessions.find(s => s.id === currentSessionId);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages, isLoading]);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const message = input;
    setInput('');
    await sendMessage(message);
  };
  
  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto">
      <div className="flex-1 overflow-y-auto space-y-5 pb-6">
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
      
      <div className="glass-card p-2 flex gap-2 mt-4">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyPress={e => e.key === 'Enter' && handleSend()} 
          placeholder="Ask me anything about your placement journey..." 
          className="flex-1 bg-transparent px-4 py-3 outline-none" 
        />
        <button 
          onClick={handleSend} 
          disabled={isLoading || !input.trim()} 
          className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 disabled:opacity-50 transition-all"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
}