import React from 'react';
import { TopicExplorer } from '../components/topics/TopicExplorer';

export const Topics: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Knowledge Base</h1>
        <p className="text-muted-foreground">Explore comprehensive guides on election processes, voting methods, and civic duties.</p>
      </div>
      <TopicExplorer />
    </div>
  );
};
