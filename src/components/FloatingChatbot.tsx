
import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenChat = () => {
    // Immediately redirect to /chat and close the widget
    setIsOpen(false);
    navigate('/chat');
  };

  const toggleChatPreview = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <Card className="mb-4 p-4 w-80 bg-white shadow-lg border border-quickfix-blue/20 animate-fade-in">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-quickfix-blue flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-quickfix-dark">QuickFix AI</h3>
                  <p className="text-xs text-gray-500">Online now</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChatPreview}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-quickfix-light-blue to-white p-3 rounded-lg text-sm">
                <p className="text-quickfix-dark">
                  👋 Hi! I'm QuickFix AI. Having vehicle trouble? 
                </p>
                <p className="text-quickfix-dark mt-1">
                  Describe your issue and I'll help diagnose it!
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleOpenChat}
                  className="flex-1 bg-quickfix-blue hover:bg-quickfix-blue/90 text-sm py-2"
                >
                  💬 Start Chat
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                🚗 Car • 🏍️ Bike • 🔧 All Issues
              </div>
            </div>
          </Card>
        )}

        {/* Chat Toggle Button */}
        <Button
          onClick={toggleChatPreview}
          className="h-14 w-14 rounded-full bg-quickfix-blue hover:bg-quickfix-blue/90 shadow-lg transition-all duration-300 hover:scale-110"
        >
          <Bot className="h-6 w-6 text-white" />
        </Button>
      </div>
    </>
  );
};

export default FloatingChatbot;
