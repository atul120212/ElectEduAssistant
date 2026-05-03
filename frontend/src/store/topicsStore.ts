import { create } from 'zustand';
import api from '../services/api';

export interface Topic {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  keywords: string[];
  content?: string;
}

interface TopicsState {
  topics: Topic[];
  selectedTopic: Topic | null;
  isLoading: boolean;
  error: string | null;
  
  loadTopics: (category?: string, difficulty?: string, search?: string) => Promise<void>;
  loadTopicDetails: (id: string) => Promise<void>;
}

export const useTopicsStore = create<TopicsState>((set) => ({
  topics: [],
  selectedTopic: null,
  isLoading: false,
  error: null,

  loadTopics: async (category, difficulty, search) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (difficulty) params.append('difficulty', difficulty);
      if (search) params.append('search', search);
      
      const response = await api.get(`/topics?${params.toString()}`);
      
      set({ 
        topics: response.data.data.topics,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to load topics',
        isLoading: false 
      });
    }
  },

  loadTopicDetails: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/topics/${id}`);
      set({ 
        selectedTopic: response.data.data.topic,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to load topic details',
        isLoading: false 
      });
    }
  },
}));
