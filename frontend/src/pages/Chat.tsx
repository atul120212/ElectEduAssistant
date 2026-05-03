import React, { useEffect } from 'react';
import { ChatInterface } from '../components/chat/ChatInterface';
import { useChatStore } from '../store/chatStore';

export const Chat: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6 pt-4 text-center">Chat with the Assistant</h1>
      <ChatInterface />
    </div>
  );
};
