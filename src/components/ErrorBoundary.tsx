
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // If the error is related to routing or 404
      if (this.state.error?.message?.includes('NOT_FOUND') || 
          this.state.error?.message?.includes('404')) {
        return <Navigate to="/" replace />;
      }
      
      // For other errors, show a fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="mb-4">Please try refreshing the page or navigate back to home.</p>
          <button 
            onClick={() => window.location.href = '/'} 
            className="px-4 py-2 bg-quickfix-blue text-white rounded hover:bg-quickfix-blue/90"
          >
            Go to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
