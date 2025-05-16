import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
};
const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'system',
    content: 'Hello! I can help with vehicle issues. What would you like to know?',
    timestamp: new Date()
  }]);
  const [loading, setLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };
  const handleSend = async () => {
    if (!chatInput.trim()) return;
    const userMessage: Message = {
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('diagnose-vehicle', {
        body: {
          messages: [...messages.filter(m => m.role !== 'system'), userMessage]
        }
      });
      if (error) {
        throw error;
      }
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content,
        timestamp: new Date()
      }]);
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I encountered a problem processing your request. Please try again later.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };
  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Render a collapsed version if not expanded
  if (!isExpanded) {
    return <div className="fixed bottom-4 right-4 z-50">
        
      </div>;
  }
  return <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 md:w-96 h-[500px] shadow-lg flex flex-col">
        <div className="bg-quickfix-blue text-white p-3 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="/lovable-uploads/7236feb8-e9ef-43d3-9100-9cdf7f9de7b0.png" />
              <AvatarFallback>QF</AvatarFallback>
            </Avatar>
            <span className="font-medium">QuickFix Assistant</span>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleExpand} className="p-1 hover:bg-blue-700 text-white">
            &times;
          </Button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.filter(m => m.role !== 'system').map((message, index) => <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className={`h-8 w-8 ${message.role === 'user' ? 'ml-2' : 'mr-2'}`}>
                  {message.role === 'user' ? <>
                      <AvatarFallback>U</AvatarFallback>
                    </> : <>
                      <AvatarImage src="/lovable-uploads/7236feb8-e9ef-43d3-9100-9cdf7f9de7b0.png" />
                      <AvatarFallback>AI</AvatarFallback>
                    </>}
                </Avatar>
                
                <div className={`rounded-lg p-3 ${message.role === 'user' ? 'bg-quickfix-blue text-white' : 'bg-gray-100 text-gray-800'}`}>
                  <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>)}
          
          {loading && <div className="flex justify-start">
              <div className="flex max-w-[80%] flex-row">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="/lovable-uploads/7236feb8-e9ef-43d3-9100-9cdf7f9de7b0.png" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="rounded-lg p-3 bg-gray-100 text-gray-800">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{
                  animationDelay: '0ms'
                }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{
                  animationDelay: '150ms'
                }}></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{
                  animationDelay: '300ms'
                }}></div>
                  </div>
                </div>
              </div>
            </div>}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-3 border-t flex">
          <Input placeholder="Ask about vehicle issues..." value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={handleKeyDown} disabled={loading} className="flex-grow" />
          <Button onClick={handleSend} disabled={loading} className="ml-2 bg-quickfix-blue hover:bg-quickfix-blue/90">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-2 text-center text-xs text-gray-500 border-t">
          <Link to="/chat" className="hover:underline">
            Open full chat experience
          </Link>
        </div>
      </Card>
    </div>;
};
export default Chatbot;