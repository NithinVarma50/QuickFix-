import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ErrorBoundary from "./components/ErrorBoundary";
import FloatingChatbot from "./components/FloatingChatbot";

import Index from "./pages/Index";
import BookingPage from "./pages/BookingPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import ChatbotPage from "./pages/ChatbotPage"; 
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";

// Configure the query client with better error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000,   // 10 minutes
    },
    mutations: {
      onError: (error) => {
        // This allows errors to propagate to the ErrorBoundary
        console.error('Mutation error:', error);
      }
    }
  },
});


import React, { useEffect } from 'react';

const App = () => {
  // Hide FloatingChatbot on /chat route
  const isChatPage = window.location.pathname === '/chat';

  // Fallback overlay logic
  useEffect(() => {
    // Create fallback overlay
    const fallback = document.createElement('div');
    fallback.id = 'global-fallback-overlay';
    fallback.style.position = 'fixed';
    fallback.style.top = '0';
    fallback.style.left = '0';
    fallback.style.width = '100vw';
    fallback.style.height = '100vh';
    fallback.style.background = 'white';
    fallback.style.zIndex = '99999';
    fallback.style.display = 'flex';
    fallback.style.flexDirection = 'column';
    fallback.style.alignItems = 'center';
    fallback.style.justifyContent = 'center';
    fallback.innerHTML = `
      <div style="font-size:2rem;color:#2563eb;font-weight:bold;margin-bottom:1rem;">QuickFix is waking up...</div>
      <div style="margin-bottom:1rem;">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="animate-spin">
          <circle cx="24" cy="24" r="20" stroke="#2563eb" stroke-width="4" stroke-dasharray="31.4 31.4"/>
        </svg>
      </div>
      <div style="color:#666;">If this stays blank, check your internet connection or open the browser console for errors.<br/>Try refreshing the page.</div>
    `;
    document.body.appendChild(fallback);
    // Remove fallback after React mounts
    return () => {
      const el = document.getElementById('global-fallback-overlay');
      if (el) el.remove();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ErrorBoundary>
            <AuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/chat" element={<ChatbotPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/404" element={<NotFound />} />
                {/* This route will catch all unmatched routes */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              {!isChatPage && <FloatingChatbot />}
            </AuthProvider>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
