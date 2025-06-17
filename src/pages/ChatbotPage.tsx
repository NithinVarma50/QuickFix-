
import React, { useState, useRef, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Wrench } from "lucide-react";
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
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    scrollToBottom();
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
      // Call the edge function
      const { data, error } = await supabase.functions.invoke('diagnose-vehicle', {
        body: {
          messages: [...messages.filter(m => m.role !== 'system'), userMessage]
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
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
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
                          <AvatarImage src="/lovable-uploads/7236feb8-e9ef-43d3-9100-9cdf7f9de7b0.png" />
                          <AvatarFallback>🤖</AvatarFallback>
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
                      <AvatarImage src="/lovable-uploads/7236feb8-e9ef-43d3-9100-9cdf7f9de7b0.png" />
                      <AvatarFallback>🤖</AvatarFallback>
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
