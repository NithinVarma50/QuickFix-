
import React, { useState, useRef, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { toast } from "sonner";
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
      content: 'Welcome to QuickFix AI Assistant! Describe your vehicle issue, and I\'ll help diagnose the problem.',
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
      toast.error("Error communicating with AI assistant", {
        description: error.message || "Please try again later",
      });
      
      // Add error message to chat
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I encountered a problem processing your request. Please try again later.",
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
            <h1 className="text-3xl md:text-4xl font-bold mb-4 font-heading">AI Vehicle Diagnostics</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Describe your vehicle issue to our AI assistant for a preliminary diagnosis before booking a service.
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
                          <AvatarFallback>AI</AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    
                    <div 
                      className={`rounded-lg p-3 ${
                        message.role === 'user' 
                          ? 'bg-quickfix-blue text-white' 
                          : message.role === 'system' 
                            ? 'bg-quickfix-light-blue text-gray-800 border border-gray-200' 
                            : 'bg-gray-100 text-gray-800'
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
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-gray-100 text-gray-800">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input 
                            placeholder="Describe your vehicle issue..." 
                            {...field} 
                            disabled={loading}
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
          
          <div className="max-w-3xl mx-auto mt-8 bg-quickfix-light-blue rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">How to Get the Best Diagnosis</h2>
            <ul className="space-y-3 list-disc pl-5">
              <li>Be specific about the symptoms (noises, vibrations, leaks, etc.)</li>
              <li>Mention when the problem occurs (e.g., when starting, at high speeds)</li>
              <li>Include your vehicle make, model, and year</li>
              <li>Describe any warning lights or error codes</li>
              <li>Mention any recent repairs or maintenance</li>
            </ul>
            <div className="mt-6 text-center">
              <Button asChild className="bg-quickfix-orange hover:bg-quickfix-orange/90">
                <Link to="/booking">Book a Professional Mechanic</Link>
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
