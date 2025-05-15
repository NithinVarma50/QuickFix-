import React from 'react';
import { MessageCircle } from 'lucide-react';

const Chatbot: React.FC = () => {
  const openChat = () => {
    // Logic to open chatbot window or redirect to chat service
    alert('Chatbot opened!');
  };

  return (
    <div
      className="fixed bottom-4 right-4 bg-quickfix-blue text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-quickfix-blue/90 transition"
      onClick={openChat}
    >
      <MessageCircle className="h-6 w-6" />
    </div>
  );
};

export default Chatbot;
