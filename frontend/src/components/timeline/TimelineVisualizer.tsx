import React, { useEffect } from 'react';
import { useTimelineStore } from '../../store/timelineStore';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Bell, Loader2 } from 'lucide-react';

export const TimelineVisualizer: React.FC<{ country: string }> = ({ country }) => {
  const { events, isLoading, error, loadTimeline } = useTimelineStore();

  useEffect(() => {
    loadTimeline(country);
  }, [country, loadTimeline]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64" role="status" aria-live="polite">
        <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden="true" />
        <span className="sr-only">Loading timeline...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-4 border border-destructive/20 rounded-xl bg-destructive/5">
        <p>{error}</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center p-8 border rounded-xl bg-muted/20">
        <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold">No upcoming events found</h3>
        <p className="text-muted-foreground">Check back later for updates on the election timeline.</p>
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-primary/20 ml-3 md:ml-6 space-y-8 py-4">
      {events.map((event, index) => {
        const isPast = new Date(event.eventDate) < new Date();
        
        return (
          <div key={event.id || index} className="relative pl-8 md:pl-12">
            <div 
              className={`absolute -left-[11px] top-1 h-5 w-5 rounded-full border-4 border-background flex items-center justify-center
                ${isPast ? 'bg-muted-foreground' : 'bg-primary'}`}
            ></div>
            
            <div className={`p-4 md:p-6 rounded-xl border shadow-sm transition-all hover:shadow-md
              ${isPast ? 'bg-muted/50 opacity-70' : 'bg-card'}`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-sm font-semibold px-2 py-1 rounded-full 
                      ${isPast ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                      {format(new Date(event.eventDate), 'MMM d, yyyy')}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      {event.eventType.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  {event.description && (
                    <p className="text-muted-foreground">{event.description}</p>
                  )}
                </div>
                
                {!isPast && (
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors w-full md:w-auto mt-2 md:mt-0">
                    <Bell className="w-4 h-4" />
                    <span>Remind Me</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
