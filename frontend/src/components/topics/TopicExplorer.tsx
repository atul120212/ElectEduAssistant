import React, { useEffect, useState } from 'react';
import { useTopicsStore } from '../../store/topicsStore';
import { Loader2, Search, BookOpen, Clock, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export const TopicExplorer: React.FC = () => {
  const { topics, isLoading, error, loadTopics } = useTopicsStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');

  useEffect(() => {
    loadTopics(category, difficulty, search);
  }, [category, difficulty, search, loadTopics]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Filters */}
      <div className="w-full md:w-64 space-y-6 shrink-0">
        <div>
          <h3 className="font-semibold mb-3">Search</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border bg-background text-sm"
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Categories</h3>
          <div className="space-y-2">
            {['', 'Voter Registration', 'Eligibility', 'Voting Methods', 'Electoral Systems'].map((cat) => (
              <button
                key={cat || 'all'}
                onClick={() => setCategory(cat)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                  category === cat ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted"
                )}
              >
                {cat || 'All Categories'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Difficulty</h3>
          <div className="space-y-2">
            {['', 'beginner', 'intermediate', 'advanced'].map((diff) => (
              <button
                key={diff || 'all'}
                onClick={() => setDifficulty(diff)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors capitalize",
                  difficulty === diff ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted"
                )}
              >
                {diff || 'All Levels'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-destructive p-4 border border-destructive/20 rounded-xl bg-destructive/5">
            <p>{error}</p>
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center p-12 border rounded-xl bg-muted/20">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No topics found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((topic) => (
              <div 
                key={topic.id}
                className="group p-5 rounded-xl border bg-card hover:shadow-md hover:border-primary/50 transition-all flex flex-col h-full cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={cn(
                    "text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize",
                    topic.difficulty === 'beginner' ? "bg-success/10 text-success" :
                    topic.difficulty === 'intermediate' ? "bg-warning/10 text-warning" :
                    "bg-destructive/10 text-destructive"
                  )}>
                    {topic.difficulty}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    5 min read
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {topic.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 flex-1">
                  Learn about {topic.title.toLowerCase()} and how it impacts the electoral process.
                </p>
                
                <div className="mt-auto flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{topic.category}</span>
                  <span className="text-primary font-medium flex items-center group-hover:translate-x-1 transition-transform">
                    Read more <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
