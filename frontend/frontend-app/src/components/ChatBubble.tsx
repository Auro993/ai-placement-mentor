import ReactMarkdown from 'react-markdown';
import { FiUser, FiCpu } from 'react-icons/fi';

interface ChatBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  return (
    <div className={`flex gap-4 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center shrink-0">
          <FiCpu size={16} />
        </div>
      )}
      <div className={`max-w-[80%] ${role === 'user' ? 'order-1' : ''}`}>
        <div className={`px-5 py-3 rounded-2xl ${role === 'user' ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'glass-card'}`}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
      {role === 'user' && (
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
          <FiUser size={16} />
        </div>
      )}
    </div>
  );
}