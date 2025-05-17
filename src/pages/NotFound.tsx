
import React, { useEffect } from "react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AlertTriangle, ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Log the error for debugging
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Report to an analytics service if needed
    // This could be useful to track which routes users are trying to access
  }, [location.pathname]);

  // If the URL includes specific error messages, redirect to home
  if (location.pathname.includes('NOT_FOUND') || location.search.includes('NOT_FOUND')) {
    console.log("Detected NOT_FOUND in URL, redirecting to home...");
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="container px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-quickfix-light-orange flex items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-quickfix-orange" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-quickfix-dark">
              404
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Oops! The page you're looking for doesn't exist.
            </p>
            
            <Button asChild className="bg-quickfix-blue hover:bg-quickfix-blue/90">
              <Link to="/" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home Page
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
