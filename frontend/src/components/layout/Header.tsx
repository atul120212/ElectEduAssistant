import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, BookOpen, Calendar, HelpCircle, MessageSquare } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🏛️</span>
            <span className="inline-block font-bold sm:text-xl text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              ElectionEdu
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link to="/chat" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </Link>
            <Link to="/timeline" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Calendar className="w-4 h-4 mr-2" />
              Timeline
            </Link>
            <Link to="/topics" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <BookOpen className="w-4 h-4 mr-2" />
              Topics
            </Link>
            <Link to="/quiz" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="w-4 h-4 mr-2" />
              Quiz
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Link to="/profile" className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors">
              <User className="w-5 h-5" />
            </Link>
            <button className="md:hidden p-2">
              <Menu className="w-6 h-6" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
