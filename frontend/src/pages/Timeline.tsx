import React, { useState } from 'react';
import { TimelineVisualizer } from '../components/timeline/TimelineVisualizer';

export const Timeline: React.FC = () => {
  const [country, setCountry] = useState('US');

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Election Timeline</h1>
          <p className="text-muted-foreground">Key dates, deadlines, and milestones for upcoming elections.</p>
        </div>
        
        <select 
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="p-2 border rounded-md bg-card shadow-sm"
        >
          <option value="US">United States</option>
          <option value="IN">India</option>
          <option value="UK">United Kingdom</option>
          <option value="CA">Canada</option>
          <option value="AU">Australia</option>
        </select>
      </div>

      <TimelineVisualizer country={country} />
    </div>
  );
};
