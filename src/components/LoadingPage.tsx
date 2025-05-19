
import React, { useEffect, useState } from 'react';

const LoadingPage: React.FC = () => {
  const [vanPosition, setVanPosition] = useState(-100); // Start off-screen to the left

  useEffect(() => {
    // Calculate screen width to determine how far the van should move
    const screenWidth = window.innerWidth;
    const endPosition = screenWidth + 100; // End off-screen to the right
    
    const animationDuration = 3000; // 3 seconds for one full animation
    const startTime = Date.now();

    const animateVan = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      
      // Calculate new position based on elapsed time
      const progress = Math.min(elapsedTime / animationDuration, 1);
      const newPosition = -100 + progress * (endPosition + 100);
      
      setVanPosition(newPosition);
      
      // Continue animation until the van moves off-screen to the right
      if (progress < 1) {
        requestAnimationFrame(animateVan);
      } else {
        // Reset animation to create loop effect
        setVanPosition(-100);
        setTimeout(() => {
          requestAnimationFrame(animateVan);
        }, 500); // Brief pause before restarting
      }
    };
    
    requestAnimationFrame(animateVan);

    return () => {
      // Clean-up logic if needed
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* QuickFix Logo */}
      <h1 className="text-6xl font-bold font-heading mb-16">QUICKFIX</h1>
      
      {/* Road with dashed lines */}
      <div className="w-full h-10 bg-gray-300 relative mb-8">
        {/* Dashed line on the road */}
        <div className="absolute top-1/2 left-0 right-0 h-1 transform -translate-y-1/2">
          <div className="w-full h-full flex items-center">
            {Array(10).fill(0).map((_, index) => (
              <div 
                key={index} 
                className="h-1 w-12 bg-white mx-6"
              />
            ))}
          </div>
        </div>
        
        {/* Moving Van */}
        <div 
          className="absolute top-0 transform -translate-y-full"
          style={{ 
            left: `${vanPosition}px`,
            transition: 'left 0.1s linear'
          }}
        >
          <div className="relative w-24 h-14">
            {/* Van SVG */}
            <svg width="96" height="56" viewBox="0 0 96 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="8" width="70" height="30" fill="#FFD333" />
              <path d="M80 8H90L85 38H80V8Z" fill="#FFD333" />
              <path d="M10 8H0L5 38H10V8Z" fill="#FFD333" />
              <rect x="5" y="30" width="80" height="8" fill="#FFD333" />
              <rect x="65" y="15" width="15" height="15" fill="#444444" />
              <circle cx="20" cy="38" r="8" fill="#444444" />
              <circle cx="20" cy="38" r="3" fill="#888888" />
              <circle cx="70" cy="38" r="8" fill="#444444" />
              <circle cx="70" cy="38" r="3" fill="#888888" />
              <rect x="30" y="18" width="20" height="10" fill="#000000" />
              <text x="33" y="26" fontSize="8" fill="black" fontWeight="bold">QuickFix</text>
            </svg>
            
            {/* Motion effects */}
            <div className="absolute -bottom-1 left-5 w-16 h-2 bg-black/10 rounded-full blur-sm animate-pulse"></div>
          </div>
        </div>
      </div>
      
      <p className="text-gray-500 mt-4 animate-pulse">Loading...</p>
    </div>
  );
};

export default LoadingPage;
