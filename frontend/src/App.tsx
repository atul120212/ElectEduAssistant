import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Chat } from './pages/Chat';

import { Timeline } from './pages/Timeline';
import { Quiz } from './pages/Quiz';
import { Topics } from './pages/Topics';

// Placeholder components for other routes
const Profile = () => <div className="p-8 text-center"><h1 className="text-2xl font-bold">Profile (Coming Soon)</h1></div>;

const App: React.FC = () => {
  return (
    <Router>
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/topics" element={<Topics />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
