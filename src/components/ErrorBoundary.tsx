
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    console.log("Error caught in ErrorBoundary:", error.message);
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
    
    // Log more details about the error
    if (error.message.includes('NOT_FOUND')) {
      console.error("NOT_FOUND error detected. Current path:", window.location.pathname);
    }
  }

  handleReloadAtHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // For NOT_FOUND errors, immediately redirect to home
      if (this.state.error?.message?.includes('NOT_FOUND') || 
          this.state.error?.message?.includes('404')) {
        console.log("Redirecting from 404 error to home page...");
        return <Navigate to="/" replace />;
      }
      
      // For other errors, show a fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="mb-4">Please try refreshing the page or navigate back to home.</p>
          <button 
            onClick={this.handleReloadAtHome} 
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
