import React from 'react';
import { QuizInterface } from '../components/quiz/QuizInterface';

export const Quiz: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Practice Quizzes</h1>
        <p className="text-muted-foreground">Test your knowledge of election processes and civic duties.</p>
      </div>
      <QuizInterface />
    </div>
  );
};
