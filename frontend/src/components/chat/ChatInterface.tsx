import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { Send, Loader2, RefreshCw, Copy, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const ChatInterface: React.FC = () => {
  const { messages, isLoading, error, sendMessage } = useChatStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    sendMessage(input);
    setInput('');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-4">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-6 mb-4 p-4 rounded-xl bg-card border shadow-sm">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-3xl">🏛️</span>
            </div>
            <h2 className="text-2xl font-bold">Election Process Education Assistant</h2>
            <p className="text-muted-foreground max-w-md">
              Ask me anything about voter registration, election processes, eligibility, or request a practice quiz!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-muted rounded-tl-sm'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}
                
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                    <div className="flex gap-2">
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="text-xs text-muted-foreground flex gap-1 items-center">
                          <AlertCircle className="w-3 h-3" />
                          <span>Sources included</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleCopy(msg.content)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-1"
                      title="Copy message"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-tl-sm p-4 flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex justify-center">
            <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="w-full px-4 py-4 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary shadow-sm pr-14"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-2 p-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 transition-opacity"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
};
