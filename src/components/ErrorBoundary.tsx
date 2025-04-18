import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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
    // Update state so the next render will show the fallback UI.
    console.error('Error caught in getDerivedStateFromError:', error);
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error with more details
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
    
    this.setState({
      errorInfo
    });
  }

  clearLocalStorage = () => {
    localStorage.clear();
    alert('Local storage cleared!');
  };

  goToDiagnostic = () => {
    window.location.href = '/diagnostic';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Enhanced error UI with more debugging options
      return this.props.fallback || (
        <div className="p-6 bg-red-50 border border-red-200 rounded-md m-4 max-w-2xl mx-auto my-12">
          <h2 className="text-xl font-bold text-red-700 mb-2">Application Error</h2>
          <p className="text-red-600 mb-4">
            The application encountered an error and couldn't continue.
          </p>
          
          <details className="text-sm text-red-600 whitespace-pre-wrap mb-4" open>
            <summary className="cursor-pointer font-medium mb-2">Error details</summary>
            <div className="bg-white p-3 rounded border border-red-200">
              <p className="font-semibold">{this.state.error?.toString()}</p>
              <pre className="bg-red-100 p-2 rounded overflow-auto text-xs mt-2 max-h-40">
                {this.state.errorInfo?.componentStack}
              </pre>
            </div>
          </details>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reload page
            </button>
            <button 
              onClick={this.clearLocalStorage}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Clear local storage
            </button>
            <button 
              onClick={this.goToDiagnostic}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Go to diagnostic page
            </button>
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <p>URL: {window.location.href}</p>
            <p>Time: {new Date().toLocaleString()}</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 