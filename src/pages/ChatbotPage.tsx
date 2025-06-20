import React, { useState, useRef, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Wrench, Bot } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

const formSchema = z.object({
  message: z.string().min(1, { message: "Message cannot be empty" }),
});

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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

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

  // Enhanced scroll logic: only scroll if user is near bottom or new message is from assistant
  useEffect(() => {
    if (!chatContainerRef.current) return;
    const container = chatContainerRef.current;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    // Find last message
    const lastMsg = messages[messages.length - 1];
    // Only scroll if user is near bottom or last message is from assistant/system
    if (isNearBottom || (lastMsg && lastMsg.role !== 'user')) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userMessage: Message = {
      role: 'user',
      content: values.message,
      timestamp: new Date(),
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    form.reset();
    
    setLoading(true);
    
    try {
      // Get conversation history (excluding system message, last 10 exchanges)
      const conversationHistory = messages
        .filter(m => m.role !== 'system')
        .slice(-20) // Last 20 messages (10 user + 10 AI responses)
        .concat([userMessage]);
      
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

  return (
    <div className="flex flex-col min-h-screen">
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
          <Card className="max-w-3xl mx-auto h-[600px] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600">AI remembers your last 10 conversations</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearHistory}
                className="text-xs"
              >
                Clear History
              </Button>
            </div>
            <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className={`h-8 w-8 ${message.role === 'user' ? 'ml-2' : 'mr-2'}`}>
                      {message.role === 'user' ? (
                        <>
                          <AvatarFallback>U</AvatarFallback>
                        </>
                      ) : (
                        <>
                          <AvatarFallback className="bg-quickfix-blue">
                            <Bot className="h-4 w-4 text-white" />
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    
                    <div 
                      className={`rounded-lg p-3 ${
                        message.role === 'user' 
                          ? 'bg-quickfix-blue text-white' 
                          : message.role === 'system' 
                            ? 'bg-gradient-to-r from-quickfix-light-blue to-white text-gray-800 border border-quickfix-blue/20' 
                            : 'bg-gray-50 text-gray-800 border border-gray-200'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
              
              {loading && (
                <div className="flex justify-start">
                  <div className="flex max-w-[80%] flex-row">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback className="bg-quickfix-blue">
                        <Bot className="h-4 w-4 text-white" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-gray-50 text-gray-800 border border-gray-200">
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
            </div>
            
            <div className="p-4 border-t bg-gray-50">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input 
                            placeholder="Describe your vehicle issue... (e.g., 'My car won't start')" 
                            {...field} 
                            disabled={loading}
                            className="border-quickfix-blue/30 focus:border-quickfix-blue"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={loading} className="bg-quickfix-blue hover:bg-quickfix-blue/90">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </Form>
            </div>
          </Card>
          
          <div className="max-w-3xl mx-auto mt-8 bg-gradient-to-r from-quickfix-light-blue to-white rounded-lg p-6 border border-quickfix-blue/20">
            <h2 className="text-xl font-semibold mb-4 text-quickfix-dark">💡 Tips for Better Diagnosis</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2 text-quickfix-blue">🔍 Be Specific About:</h3>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• Strange noises (when they occur)</li>
                  <li>• Warning lights on dashboard</li>
                  <li>• When the problem happens</li>
                  <li>• How long it's been happening</li>
                </ul>
              </div>
              <div>
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
              <Button asChild className="bg-quickfix-orange hover:bg-quickfix-orange/90">
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
