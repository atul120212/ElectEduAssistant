import { render, screen } from '@testing-library/react';
import { TimelineVisualizer } from './TimelineVisualizer';
import { useTimelineStore } from '../../store/timelineStore';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the store
vi.mock('../../store/timelineStore', () => ({
  useTimelineStore: vi.fn(),
}));

describe('TimelineVisualizer', () => {
  const mockLoadTimeline = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', () => {
    (useTimelineStore as any).mockReturnValue({
      events: [],
      isLoading: true,
      error: null,
      loadTimeline: mockLoadTimeline,
    });

    render(<TimelineVisualizer country="US" />);
    expect(screen.getByRole('status')).toBeDefined(); // Loader2 has no explicit role but we can find it
  });

  it('renders events correctly', () => {
    const mockEvents = [
      {
        id: '1',
        title: 'Registration Deadline',
        eventDate: '2026-10-01T00:00:00Z',
        eventType: 'registration',
        description: 'Last day to register for general election',
      },
    ];

    (useTimelineStore as any).mockReturnValue({
      events: mockEvents,
      isLoading: false,
      error: null,
      loadTimeline: mockLoadTimeline,
    });

    render(<TimelineVisualizer country="US" />);
    expect(screen.getByText('Registration Deadline')).toBeDefined();
    expect(screen.getByText('Last day to register for general election')).toBeDefined();
  });

  it('renders empty state', () => {
    (useTimelineStore as any).mockReturnValue({
      events: [],
      isLoading: false,
      error: null,
      loadTimeline: mockLoadTimeline,
    });

    render(<TimelineVisualizer country="US" />);
    expect(screen.getByText('No upcoming events found')).toBeDefined();
  });
});
