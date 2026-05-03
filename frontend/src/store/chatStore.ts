import { create } from 'zustand';
import api from '../services/api';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  
  setActiveConversation: (id: string | null) => void;
  sendMessage: (message: string) => Promise<void>;
  loadConversations: (userId: string) => Promise<void>;
  loadConversationDetails: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  isLoading: false,
  error: null,

  setActiveConversation: (id) => set({ activeConversationId: id }),

  clearError: () => set({ error: null }),

  sendMessage: async (messageText: string) => {
    set({ isLoading: true, error: null });
    const { activeConversationId, messages } = get();
    
    // Optimistic UI update
    const tempId = Date.now().toString();
    const newUserMessage: Message = {
      id: tempId,
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };
    
    set({ messages: [...messages, newUserMessage] });

    try {
      const response = await api.post('/chat/message', {
        message: messageText,
        conversationId: activeConversationId,
      });

      const { response: aiResponseText, conversationId, sources, messageId } = response.data.data;

      const newAssistantMessage: Message = {
        id: messageId || (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponseText,
        sources,
        timestamp: new Date().toISOString(),
      };

      set((state) => ({
        activeConversationId: conversationId,
        messages: [...state.messages, newAssistantMessage],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to send message',
        isLoading: false,
        // Remove the optimistic message if failed
        messages: messages,
      });
    }
  },

  loadConversations: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/chat/conversations/${userId}`);
      set({ conversations: response.data.data.conversations, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to load conversations',
        isLoading: false 
      });
    }
  },

  loadConversationDetails: async (id: string) => {
    set({ isLoading: true, error: null, activeConversationId: id });
    try {
      const response = await api.get(`/chat/conversation/${id}`);
      const conversation = response.data.data.conversation;
      set({ 
        messages: conversation.messages,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to load conversation details',
        isLoading: false 
      });
    }
  },
}));
