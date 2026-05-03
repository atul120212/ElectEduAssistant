import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, BookOpen, Calendar, HelpCircle, MessageSquare } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" role="banner">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2" aria-label="ElectionEdu Home">
            <span className="text-2xl" aria-hidden="true">🏛️</span>
            <span className="inline-block font-bold sm:text-xl text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              ElectionEdu
            </span>
          </Link>
          <nav className="hidden md:flex gap-6" aria-label="Main Navigation">
            <Link to="/chat" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm p-1">
              <MessageSquare className="w-4 h-4 mr-2" aria-hidden="true" />
              Chat
            </Link>
            <Link to="/timeline" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm p-1">
              <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
              Timeline
            </Link>
            <Link to="/topics" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm p-1">
              <BookOpen className="w-4 h-4 mr-2" aria-hidden="true" />
              Topics
            </Link>
            <Link to="/quiz" className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm p-1">
              <HelpCircle className="w-4 h-4 mr-2" aria-hidden="true" />
              Quiz
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2" aria-label="User Actions">
            <Link to="/profile" className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="User Profile">
              <User className="w-5 h-5" aria-hidden="true" />
            </Link>
            <button className="md:hidden p-2" aria-label="Open Mobile Menu" aria-expanded="false">
              <Menu className="w-6 h-6" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
