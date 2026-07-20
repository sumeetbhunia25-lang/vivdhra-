import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] py-16 px-4 flex flex-col items-center justify-center text-center bg-stone-50/50 rounded-3xl border border-stone-200/60 max-w-2xl mx-auto my-8 animate-fade-in shadow-2xs">
          <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-6 border border-amber-100/80 shadow-3xs">
            <AlertTriangle className="w-6 h-6" />
          </div>
          
          <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-[#c2a46c] font-bold">
            Notice of Interruption
          </span>
          
          <h2 className="serif-header text-2xl md:text-3xl font-light text-stone-900 mt-2 mb-4">
            Something went sideways
          </h2>
          
          <p className="text-stone-500 text-xs md:text-sm font-sans font-light max-w-md mx-auto leading-relaxed mb-8">
            An unexpected glitch occurred in this component of the atelier. Rest assured, your cart and preferences are preserved safely.
          </p>

          {this.state.error && (
            <div className="w-full max-w-md bg-stone-100/80 border border-stone-200/50 rounded-xl p-3 mb-8 text-left font-mono text-[10px] text-stone-600 overflow-x-auto max-h-[120px]">
              <div className="font-semibold text-stone-700 mb-1">Details:</div>
              {this.state.error.toString()}
            </div>
          )}

          <div className="flex flex-wrap gap-3.5 justify-center">
            <button
              onClick={this.handleReset}
              className="px-5 py-2 bg-[#1c1917] hover:bg-[#3c3734] text-white text-xs uppercase tracking-widest font-outfit font-medium rounded-lg transition-all cursor-pointer shadow-3xs inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
            <button
              onClick={this.handleReload}
              className="px-5 py-2 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200/80 text-xs uppercase tracking-widest font-outfit font-medium rounded-lg transition-all cursor-pointer shadow-3xs inline-flex items-center gap-2"
            >
              <Home className="w-3.5 h-3.5" />
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
