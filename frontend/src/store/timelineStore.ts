import { create } from 'zustand';
import api from '../services/api';

export interface TimelineEvent {
  id: string;
  country: string;
  state: string | null;
  title: string;
  description: string | null;
  eventDate: string;
  eventType: string;
}

interface TimelineState {
  events: TimelineEvent[];
  upcomingDeadlines: TimelineEvent[];
  isLoading: boolean;
  error: string | null;
  
  loadTimeline: (country: string, state?: string, year?: number) => Promise<void>;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  events: [],
  upcomingDeadlines: [],
  isLoading: false,
  error: null,

  loadTimeline: async (country, state, year) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (state) params.append('state', state);
      if (year) params.append('year', year.toString());
      
      const response = await api.get(`/timeline/${country}?${params.toString()}`);
      
      set({ 
        events: response.data.data.events,
        upcomingDeadlines: response.data.data.upcomingDeadlines,
        isLoading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to load timeline',
        isLoading: false 
      });
    }
  },
}));
