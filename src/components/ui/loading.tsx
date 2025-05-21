import React from 'react';

const LoadingPage = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="w-full max-w-md relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="loading-progress h-full bg-gray-200 relative">
            <div className="absolute loading-van">
              <div className="van-body">
                <div className="van-cabin"></div>
                <div className="van-text">QuickFix</div>
              </div>
              <div className="van-wheels">
                <div className="wheel"></div>
                <div className="wheel"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;