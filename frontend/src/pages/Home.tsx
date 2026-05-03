import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar, BookOpen, HelpCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex justify-center bg-gradient-to-b from-background to-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Understand Democracy. <br className="hidden sm:inline" />
                Empower Your Vote.
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl p-4">
                Your AI-powered guide to election processes, timelines, and civic participation. Non-partisan, accurate, and accessible to everyone.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-x-4"
            >
              <Link
                to="/chat"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Ask the Assistant
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                to="/topics"
                className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Explore Topics
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center bg-background">
        <div className="container px-4 md:px-6">
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <ul className="grid gap-6">
                <li>
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <MessageSquare className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">Interactive Chat</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Get real-time answers to your questions about voter registration, deadlines, and electoral processes.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">Election Timelines</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Visualize important milestones and set reminders so you never miss a deadline.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">Knowledge Base</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Explore categorized topics from beginner to advanced levels to understand democratic systems.
                    </p>
                  </div>
                </li>
                <li>
                  <div className="grid gap-1">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <HelpCircle className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold">Practice Quizzes</h3>
                    </div>
                    <p className="text-muted-foreground">
                      Test your knowledge with AI-generated quizzes and track your learning progress.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
              <div className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl">🗳️</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Election Countdown</h4>
                    <p className="text-sm text-muted-foreground">General Election</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-muted rounded p-2">
                    <div className="font-bold text-lg">14</div>
                    <div className="text-xs text-muted-foreground">Days</div>
                  </div>
                  <div className="bg-muted rounded p-2">
                    <div className="font-bold text-lg">08</div>
                    <div className="text-xs text-muted-foreground">Hrs</div>
                  </div>
                  <div className="bg-muted rounded p-2">
                    <div className="font-bold text-lg">45</div>
                    <div className="text-xs text-muted-foreground">Min</div>
                  </div>
                  <div className="bg-muted rounded p-2">
                    <div className="font-bold text-lg">12</div>
                    <div className="text-xs text-muted-foreground">Sec</div>
                  </div>
                </div>
                <div className="mt-4">
                  <Link to="/timeline" className="text-sm text-primary hover:underline block text-center">
                    View full timeline
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Official Resources Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center bg-muted/30" aria-labelledby="resources-title">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 id="resources-title" className="text-3xl font-bold tracking-tighter md:text-4xl">Official Voting Resources</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Direct access to official government portals for registration and information.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl pt-8">
              <a 
                href="https://vote.gov" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-start p-6 bg-card border rounded-xl hover:shadow-md transition-shadow group"
                aria-label="Visit Vote.gov (opens in new tab)"
              >
                <h4 className="font-bold text-lg group-hover:text-primary transition-colors">Vote.gov</h4>
                <p className="text-sm text-muted-foreground mt-2">Official guide to registration in all 50 states and territories.</p>
              </a>
              <a 
                href="https://www.usa.gov/voter-registration" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-start p-6 bg-card border rounded-xl hover:shadow-md transition-shadow group"
                aria-label="Visit USA.gov Voter Registration (opens in new tab)"
              >
                <h4 className="font-bold text-lg group-hover:text-primary transition-colors">USA.gov</h4>
                <p className="text-sm text-muted-foreground mt-2">Learn about voting rules, election day, and residency requirements.</p>
              </a>
              <a 
                href="https://www.fvap.gov" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-start p-6 bg-card border rounded-xl hover:shadow-md transition-shadow group"
                aria-label="Visit FVAP.gov for military and overseas voters (opens in new tab)"
              >
                <h4 className="font-bold text-lg group-hover:text-primary transition-colors">FVAP.gov</h4>
                <p className="text-sm text-muted-foreground mt-2">Special assistance for military members and overseas citizens.</p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
