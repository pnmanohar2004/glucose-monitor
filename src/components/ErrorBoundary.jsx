import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-6 text-red-500 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-xl h-full w-full min-h-[300px]">
          <AlertTriangle size={48} className="mb-4 text-red-400" />
          <h3 className="text-lg font-bold mb-2">Something went wrong.</h3>
          <p className="text-xs text-red-400 max-w-sm text-center">
             An error occurred while rendering this component. Check the console for more details.
          </p>
        </div>
      );
    }
    return this.props.children; 
  }
}

export default ErrorBoundary;
