import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface ChatContextType {
  sessions: ChatSession[];
  currentSessionId: string | null;
  sendMessage: (content: string) => Promise<void>;
  createNewSession: () => void;
  switchSession: (id: string) => void;
  deleteSession: (id: string) => void;
  isLoading: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};

const API_BASE = 'http://localhost:8080/api';

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('chatSessions');
    if (saved) return JSON.parse(saved);
    return [{
      id: '1',
      title: 'New Chat',
      messages: [{ id: 'welcome', role: 'assistant', content: "Hi! I'm your AI Placement Mentor. Ask me anything about resume building, interview tips, or career advice!", timestamp: new Date() }],
      createdAt: new Date()
    }];
  });
  const [currentSessionId, setCurrentSessionId] = useState<string | null>('1');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    if (!currentSessionId) return;
    
    const userMessage: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content, 
      timestamp: new Date() 
    };
    
    // Add user message to UI
    setSessions(prev => prev.map(session => 
      session.id === currentSessionId 
        ? { ...session, messages: [...session.messages, userMessage] }
        : session
    ));
    
    setIsLoading(true);
    
    try {
      // Get current session messages for context
      const currentSession = sessions.find(s => s.id === currentSessionId);
      const chatHistory = currentSession?.messages || [];
      
      // Send message with history
      const response = await fetch(`${API_BASE}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: content,
          history: chatHistory 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      const data = await response.json();
      
      const assistantMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: data.aiResponse || "I'm here to help with your placement preparation!", 
        timestamp: new Date() 
      };
      
      setSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { ...session, messages: [...session.messages, assistantMessage] }
          : session
      ));
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting. Please try again.",
        timestamp: new Date()
      };
      setSessions(prev => prev.map(session => 
        session.id === currentSessionId 
          ? { ...session, messages: [...session.messages, fallbackMessage] }
          : session
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{ id: 'welcome', role: 'assistant', content: "Hi! I'm your AI Placement Mentor. How can I help you today?", timestamp: new Date() }],
      createdAt: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const switchSession = (id: string) => setCurrentSessionId(id);
  
  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      const remaining = sessions.filter(s => s.id !== id);
      setCurrentSessionId(remaining[0]?.id || null);
    }
  };

  return (
    <ChatContext.Provider value={{ sessions, currentSessionId, sendMessage, createNewSession, switchSession, deleteSession, isLoading }}>
      {children}
    </ChatContext.Provider>
  );
};