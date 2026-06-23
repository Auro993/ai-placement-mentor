import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

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
  updatedAt: Date;  // Added for tracking last update
}

interface ChatContextType {
  sessions: ChatSession[];
  currentSessionId: string | null;
  sendMessage: (content: string) => Promise<void>;
  createNewSession: () => void;
  switchSession: (id: string) => void;
  deleteSession: (id: string) => void;
  isLoading: boolean;
  renameSession: (id: string, newTitle: string) => void; // Added rename
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};

const API_BASE = 'http://localhost:8080/api';

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('chatSessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert string dates back to Date objects
        return parsed.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        }));
      }
    } catch (err) {
      console.error('Error loading sessions:', err);
    }
    
    // Default session if nothing saved
    return [{
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{ 
        id: 'welcome-' + Date.now(), 
        role: 'assistant', 
        content: "Hi! I'm your AI Placement Mentor. Ask me anything about resume building, interview tips, or career advice!", 
        timestamp: new Date() 
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    }];
  });
  
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem('chatCurrentSessionId');
      return saved || null;
    } catch {
      return null;
    }
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (isInitialized || sessions.length > 0) {
      try {
        localStorage.setItem('chatSessions', JSON.stringify(sessions));
        console.log('✅ Sessions saved to localStorage:', sessions.length);
      } catch (err) {
        console.error('Error saving sessions:', err);
      }
    }
  }, [sessions, isInitialized]);

  // Save current session ID
  useEffect(() => {
    if (currentSessionId) {
      try {
        localStorage.setItem('chatCurrentSessionId', currentSessionId);
      } catch (err) {
        console.error('Error saving current session ID:', err);
      }
    }
  }, [currentSessionId]);

  // Set initialized after first render
  useEffect(() => {
    setIsInitialized(true);
    
    // If no current session but sessions exist, set first one
    if (!currentSessionId && sessions.length > 0) {
      setCurrentSessionId(sessions[0].id);
    }
  }, []);

  const sendMessage = async (content: string) => {
    if (!currentSessionId) {
      // Create new session if none exists
      createNewSession();
      return;
    }
    
    const userMessage: Message = { 
      id: 'user-' + Date.now(), 
      role: 'user', 
      content, 
      timestamp: new Date() 
    };
    
    // Add user message to UI
    setSessions(prev => {
      const updated = prev.map(session => 
        session.id === currentSessionId 
          ? { 
              ...session, 
              messages: [...session.messages, userMessage],
              updatedAt: new Date()
            }
          : session
      );
      return updated;
    });
    
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
          history: chatHistory.map(m => ({ role: m.role, content: m.content }))
        }),
      });
      
      let data;
      try {
        data = await response.json();
      } catch {
        data = { response: "I'm here to help with your placement preparation!" };
      }
      
      const assistantMessage: Message = { 
        id: 'assistant-' + Date.now(), 
        role: 'assistant', 
        content: data.response || data.aiResponse || "I'm here to help with your placement preparation!", 
        timestamp: new Date() 
      };
      
      setSessions(prev => {
        const updated = prev.map(session => 
          session.id === currentSessionId 
            ? { 
                ...session, 
                messages: [...session.messages, assistantMessage],
                updatedAt: new Date()
              }
            : session
        );
        return updated;
      });
      
    } catch (error) {
      console.error('Chat error:', error);
      const fallbackMessage: Message = {
        id: 'error-' + Date.now(),
        role: 'assistant',
        content: "I'm having trouble connecting. Please try again.",
        timestamp: new Date()
      };
      setSessions(prev => {
        const updated = prev.map(session => 
          session.id === currentSessionId 
            ? { 
                ...session, 
                messages: [...session.messages, fallbackMessage],
                updatedAt: new Date()
              }
            : session
        );
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: 'session-' + Date.now(),
      title: 'New Chat',
      messages: [{ 
        id: 'welcome-' + Date.now(), 
        role: 'assistant', 
        content: "Hi! I'm your AI Placement Mentor. How can I help you today?", 
        timestamp: new Date() 
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setSessions(prev => {
      const updated = [newSession, ...prev];
      return updated;
    });
    setCurrentSessionId(newSession.id);
  };

  const switchSession = (id: string) => {
    setCurrentSessionId(id);
  };
  
  const deleteSession = (id: string) => {
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== id);
      
      // If we deleted the current session, switch to another
      if (currentSessionId === id && updated.length > 0) {
        setCurrentSessionId(updated[0].id);
      } else if (updated.length === 0) {
        // If no sessions left, create a new one
        const newSession: ChatSession = {
          id: 'session-' + Date.now(),
          title: 'New Chat',
          messages: [{ 
            id: 'welcome-' + Date.now(), 
            role: 'assistant', 
            content: "Hi! I'm your AI Placement Mentor. How can I help you today?", 
            timestamp: new Date() 
          }],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        updated.push(newSession);
        setCurrentSessionId(newSession.id);
      }
      
      return updated;
    });
  };

  const renameSession = (id: string, newTitle: string) => {
    setSessions(prev => {
      const updated = prev.map(session => 
        session.id === id 
          ? { ...session, title: newTitle.trim() || 'New Chat' }
          : session
      );
      return updated;
    });
  };

  return (
    <ChatContext.Provider value={{ 
      sessions, 
      currentSessionId, 
      sendMessage, 
      createNewSession, 
      switchSession, 
      deleteSession, 
      isLoading,
      renameSession
    }}>
      {children}
    </ChatContext.Provider>
  );
};