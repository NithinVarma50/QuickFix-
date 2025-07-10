
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { z } from "zod";
import { Wrench, Bot } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AIInputWithLoading } from "@/components/ui/ai-input-with-loading";

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
};

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'Hi there! 👋 I\'m QuickFix AI, your friendly vehicle diagnostic assistant.\n\nDescribe your vehicle issue and I\'ll help you understand what might be wrong, suggest safe checks you can do, and let you know if you need professional help.\n\nWhether it\'s your car or bike, I\'m here to help! 🚗🏍️',
      timestamp: new Date(),
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Load conversation history from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('quickfix-chat-history');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
        }));
        // Keep only the last 10 conversation exchanges (20 messages max: 10 user + 10 AI)
        const recentMessages = parsedMessages.slice(-20);
        setMessages(prev => {
          // Keep the system message and add recent history
          const systemMessage = prev[0];
          return [systemMessage, ...recentMessages];
        });
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    }
  }, []);

  // Save conversation history to localStorage whenever messages change
  useEffect(() => {
    // Only save non-system messages
    const messagesToSave = messages.filter(msg => msg.role !== 'system');
    if (messagesToSave.length > 0) {
      // Keep only the last 20 messages (10 conversations)
      const recentMessages = messagesToSave.slice(-20);
      localStorage.setItem('quickfix-chat-history', JSON.stringify(recentMessages));
    }
  }, [messages]);

  // Optimized scroll to bottom with smooth behavior
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  }, []);

  // Enhanced scroll logic with throttling
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages, scrollToBottom]);

  async function handleSubmit(messageContent: string) {
    const userMessage: Message = {
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    
    setLoading(true);
    
    try {

      // Get conversation history (excluding system message, last 10 exchanges)
      let conversationHistory = messages
        .filter(m => m.role !== 'system')
        .slice(-20) // Last 20 messages (10 user + 10 AI responses)
        .concat([userMessage]);

      // Defensive: ensure conversationHistory is always a non-empty array
      if (!Array.isArray(conversationHistory) || conversationHistory.length === 0) {
        conversationHistory = [userMessage];
      }

      // Log outgoing payload for debugging
      console.log('Sending to edge function:', conversationHistory);

      // Call the edge function with conversation history
      const { data, error } = await supabase.functions.invoke('diagnose-vehicle', {
        body: {
          messages: conversationHistory
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Add AI response to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content,
        timestamp: new Date(),
      }]);
    } catch (error: any) {
      console.error(error);
      toast.error("Error communicating with QuickFix AI", {
        description: error.message || "Please try again later",
      });
      
      // Add error message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I encountered a problem processing your request. Please try again later, or feel free to book a mechanic directly! 🔧",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }
  
  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Clear conversation history
  const clearHistory = () => {
    localStorage.removeItem('quickfix-chat-history');
    setMessages([{
      role: 'system',
      content: 'Hi there! 👋 I\'m QuickFix AI, your friendly vehicle diagnostic assistant.\n\nDescribe your vehicle issue and I\'ll help you understand what might be wrong, suggest safe checks you can do, and let you know if you need professional help.\n\nWhether it\'s your car or bike, I\'m here to help! 🚗🏍️',
      timestamp: new Date(),
    }]);
    toast.success("Chat history cleared!");
  };

  // Function to format AI response content with enhanced headings
  const formatAIContent = (content: string) => {
    // Split content by lines
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      // Check if line is a heading with emojis and key formatting
      if (line.match(/^(🔍|🛠️|⚠️|💰|🚨|📞|🤖|🔧|💡|ℹ️|✅|❌|🎯|📋)\s*\*\*(.+?)\*\*/) || 
          line.match(/^\*\*(🔍|🛠️|⚠️|💰|🚨|📞|🤖|🔧|💡|ℹ️|✅|❌|🎯|📋)(.+?)\*\*/)) {
        const cleanLine = line.replace(/\*\*/g, '').trim();
        return (
          <div key={index} className="font-bold text-gray-900 text-base mb-2 mt-3 first:mt-0 border-l-4 border-quickfix-blue pl-3 bg-gray-50/80 py-2 rounded-r-md">
            {cleanLine}
          </div>
        );
      }
      
      // Check for other bold headings
      if (line.match(/^\*\*(.+?)\*\*/) && line.trim().length < 50) {
        const cleanLine = line.replace(/\*\*/g, '').trim();
        return (
          <div key={index} className="font-semibold text-gray-800 text-sm mb-2 mt-2 first:mt-0">
            {cleanLine}
          </div>
        );
      }
      
      // Regular content lines
      if (line.trim()) {
        return (
          <div key={index} className="text-gray-700 leading-relaxed mb-1">
            {line}
          </div>
        );
      }
      
      // Empty lines for spacing
      return <div key={index} className="h-2"></div>;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-quickfix-light-blue/20 to-white">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-quickfix-blue text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-4">
              <Wrench className="h-8 w-8 mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold font-heading">QuickFix AI Assistant</h1>
            </div>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Your friendly vehicle diagnostic helper. Describe your issue and get instant guidance from our AI-powered assistant.
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-3xl mx-auto h-[600px] flex flex-col bg-white/70 backdrop-blur-lg border-quickfix-blue/20 shadow-xl">
            <div className="flex justify-between items-center p-4 border-b bg-white/50 backdrop-blur-sm rounded-t-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">AI remembers your last 10 conversations</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearHistory}
                className="text-xs border-quickfix-blue/30 text-quickfix-blue hover:bg-quickfix-blue/10 bg-white/80 backdrop-blur-sm"
              >
                Clear History
              </Button>
            </div>
            
            <ScrollArea 
              className="flex-grow bg-gradient-to-b from-white/30 to-white/20 backdrop-blur-sm"
              ref={scrollAreaRef}
            >
              <div className="p-6 space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index}
                    className={`flex transform transition-all duration-300 ease-out ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      transform: 'translateY(0)',
                      opacity: 1
                    }}
                  >
                    <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Avatar className={`h-8 w-8 flex-shrink-0 ${message.role === 'user' ? 'ml-2' : 'mr-2'}`}>
                        {message.role === 'user' ? (
                          <>
                            <AvatarFallback className="bg-quickfix-blue text-white font-semibold">U</AvatarFallback>
                          </>
                        ) : (
                          <>
                            <AvatarFallback className="bg-quickfix-blue text-white">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      
                      <div 
                        className={`rounded-3xl p-4 transition-all duration-200 hover:shadow-lg ${
                          message.role === 'user' 
                            ? 'bg-quickfix-blue text-white shadow-lg backdrop-blur-sm' 
                            : message.role === 'system' 
                              ? 'bg-white/80 backdrop-blur-lg text-gray-800 border border-quickfix-blue/20 shadow-lg' 
                              : 'bg-white/80 backdrop-blur-lg text-gray-800 border border-gray-200/50 shadow-lg'
                        }`}
                      >
                        <div className="leading-relaxed">
                          {message.role === 'assistant' ? 
                            formatAIContent(message.content) : 
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          }
                        </div>
                        <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="flex max-w-[80%] flex-row">
                      <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
                        <AvatarFallback className="bg-quickfix-blue text-white">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-3xl p-4 bg-white/80 backdrop-blur-lg text-gray-800 border border-gray-200/50 shadow-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-quickfix-blue animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-quickfix-blue animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 rounded-full bg-quickfix-blue animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          <span className="text-sm text-gray-600 ml-2">QuickFix AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="border-t bg-white/40 backdrop-blur-lg rounded-b-lg">
              <AIInputWithLoading
                placeholder="Describe your vehicle issue... (e.g., 'My car won't start')"
                onSubmit={handleSubmit}
                loadingDuration={2000}
                className="px-2"
              />
            </div>
          </Card>
          
          <div className="max-w-3xl mx-auto mt-8 bg-white/70 backdrop-blur-lg rounded-xl p-6 border border-quickfix-blue/20 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-quickfix-dark">💡 Tips for Better Diagnosis</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-quickfix-blue/10">
                <h3 className="font-medium mb-2 text-quickfix-blue">🔍 Be Specific About:</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Strange noises (when they occur)</li>
                  <li>• Warning lights on dashboard</li>
                  <li>• When the problem happens</li>
                  <li>• How long it's been happening</li>
                </ul>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-quickfix-blue/10">
                <h3 className="font-medium mb-2 text-quickfix-blue">🚗 Include Vehicle Info:</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Car or bike</li>
                  <li>• Make and model</li>
                  <li>• Approximate age</li>
                  <li>• Recent maintenance</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button asChild className="bg-quickfix-orange hover:bg-quickfix-orange/90 shadow-lg backdrop-blur-sm">
                <Link to="/booking">🔧 Book a QuickFix Mechanic</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChatbotPage;
