import React, { useState } from 'react';
import { useQuizStore } from '../../store/quizStore';
import { Loader2, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '../../utils/cn';

export const QuizInterface: React.FC = () => {
  const { 
    quizId, questions, currentQuestionIndex, userAnswers, 
    isGenerating, isSubmitting, results, error,
    generateQuiz, answerQuestion, nextQuestion, prevQuestion, submitQuiz, resetQuiz
  } = useQuizStore();

  const [topic, setTopic] = useState('Voter Registration');
  const [difficulty, setDifficulty] = useState('medium');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    generateQuiz(topic, difficulty, 5);
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <h2 className="text-xl font-medium">Generating your customized quiz...</h2>
        <p className="text-muted-foreground">Claude is crafting questions on {topic}</p>
      </div>
    );
  }

  if (results) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-card rounded-xl border shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Quiz Results</h2>
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 border-primary/20 bg-primary/10 mb-4 text-4xl font-bold text-primary">
            {results.score}%
          </div>
          <p className="text-lg text-muted-foreground">
            You got {results.correctAnswers} out of {results.totalQuestions} questions right.
          </p>
        </div>

        <div className="space-y-6 mt-8">
          <h3 className="text-xl font-bold">Feedback</h3>
          {results.feedback.map((item: any, idx: number) => (
            <div key={idx} className={cn(
              "p-4 rounded-lg border",
              item.isCorrect ? "bg-success/10 border-success/20" : "bg-destructive/10 border-destructive/20"
            )}>
              <div className="flex gap-3">
                {item.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-success shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-destructive shrink-0" />
                )}
                <div>
                  <h4 className="font-medium mb-1">Question {idx + 1}</h4>
                  <p className="text-sm">{item.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button 
            onClick={resetQuiz}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Take Another Quiz
          </button>
        </div>
      </div>
    );
  }

  if (!quizId || questions.length === 0) {
    return (
      <div className="max-w-md mx-auto p-6 bg-card rounded-xl border shadow-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Test Your Knowledge</h2>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Topic</label>
            <select 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 rounded-lg border bg-background"
            >
              <option value="Voter Registration">Voter Registration</option>
              <option value="Electoral College">Electoral College</option>
              <option value="Voting Methods">Voting Methods</option>
              <option value="Ballot Initiatives">Ballot Initiatives</option>
              <option value="Campaign Finance">Campaign Finance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Difficulty</label>
            <div className="grid grid-cols-3 gap-2">
              {['easy', 'medium', 'hard'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={cn(
                    "py-2 rounded-md border text-sm font-medium capitalize transition-colors",
                    difficulty === level 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-background hover:bg-muted"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors mt-4"
          >
            Generate Quiz
          </button>
        </form>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const currentAnswer = userAnswers.find(a => a.questionIndex === currentQuestionIndex)?.selectedOption;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-xl border shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
        <div className="flex gap-1">
          {questions.map((_, idx) => (
            <div 
              key={idx}
              className={cn(
                "w-8 h-2 rounded-full",
                idx === currentQuestionIndex ? "bg-primary" : 
                userAnswers.some(a => a.questionIndex === idx) ? "bg-primary/40" : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      <h3 className="text-xl font-bold mb-6">{currentQ.question}</h3>

      <div className="space-y-3 mb-8">
        {currentQ.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => answerQuestion(currentQuestionIndex, idx)}
            className={cn(
              "w-full p-4 text-left rounded-lg border transition-all duration-200",
              currentAnswer === idx 
                ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary" 
                : "border-border hover:border-primary/50 hover:bg-muted/50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-5 h-5 rounded-full border flex items-center justify-center shrink-0",
                currentAnswer === idx ? "border-primary bg-primary" : "border-muted-foreground/30"
              )}>
                {currentAnswer === idx && <div className="w-2 h-2 rounded-full bg-background" />}
              </div>
              <span>{option}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center pt-6 border-t">
        <button
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium disabled:opacity-50 hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>

        {isLastQuestion ? (
          <button
            onClick={submitQuiz}
            disabled={userAnswers.length !== questions.length || isSubmitting}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50 hover:bg-primary/90 transition-colors"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Quiz"}
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
