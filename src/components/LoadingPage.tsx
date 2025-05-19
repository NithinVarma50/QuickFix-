
import React, { useEffect, useState } from 'react';
import { Van } from 'lucide-react';

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
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center overflow-hidden">
      {/* QuickFix Logo */}
      <h1 className="text-6xl font-bold font-heading mb-16 text-quickfix-blue dark:text-white">QUICKFIX</h1>
      
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
          {/* Custom QuickFix Van */}
          <div className="relative w-36 h-20 animate-[van-bounce_0.5s_infinite]">
            <svg width="144" height="80" viewBox="0 0 144 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Van body */}
              <rect x="15" y="15" width="105" height="40" fill="#1A1F2C" rx="5" />
              <rect x="15" y="35" width="105" height="20" fill="#1A1F2C" rx="2" />
              
              {/* Van front/hood */}
              <path d="M120 15H130C132 15 135 17 135 20L130 55H120V15Z" fill="#1A1F2C" />
              
              {/* Windows */}
              <rect x="30" y="20" width="30" height="15" fill="#9b87f5" rx="2" />
              <rect x="70" y="20" width="30" height="15" fill="#9b87f5" rx="2" />
              
              {/* Details */}
              <rect x="120" y="30" width="10" height="10" fill="#9b87f5" />
              
              {/* Wheels */}
              <circle cx="40" cy="55" r="10" fill="#333333" />
              <circle cx="40" cy="55" r="5" fill="#666666" />
              <circle cx="100" cy="55" r="10" fill="#333333" />
              <circle cx="100" cy="55" r="5" fill="#666666" />
              
              {/* Logo */}
              <text x="50" y="47" fontSize="14" fontWeight="bold" fill="#ffffff">QuickFix</text>
              
              {/* Headlight */}
              <rect x="130" y="30" width="5" height="5" fill="#FFFF00" />
              
              {/* Motion lines */}
              <line x1="10" y1="45" x2="5" y2="45" stroke="#6E59A5" strokeWidth="2" />
              <line x1="15" y1="40" x2="10" y2="40" stroke="#6E59A5" strokeWidth="2" />
              <line x1="12" y1="50" x2="7" y2="50" stroke="#6E59A5" strokeWidth="2" />
            </svg>
            
            {/* Shadow effect */}
            <div className="absolute -bottom-1 left-10 w-24 h-3 bg-black/20 rounded-full blur-sm"></div>
            
            {/* Dust effect */}
            <div className="absolute bottom-0 left-0 flex">
              <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse mx-1 opacity-70"></div>
              <div className="w-1 h-1 bg-gray-200 rounded-full animate-pulse mx-1 opacity-50"></div>
              <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse mx-1 opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-gray-500 mt-4 animate-pulse">Loading...</p>
    </div>
  );
};

export default LoadingPage;
