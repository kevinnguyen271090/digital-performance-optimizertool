import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log error to external service (Sentry, LogRocket, etc.)
    this.logErrorToService(error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // TODO: Integrate with error tracking service
    // Example: Sentry.captureException(error, { extra: errorInfo });
    console.error('Error logged to service:', {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Đã xảy ra lỗi
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Rất tiếc, đã xảy ra lỗi không mong muốn. Vui lòng thử lại.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
                <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                  Chi tiết lỗi (Development):
                </h3>
                <pre className="text-xs text-red-700 dark:text-red-300 overflow-auto">
                  {this.state.error.message}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleReload}
                className="w-full bg-accent text-white hover:bg-accent/90 px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Tải lại trang</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Về trang chủ</span>
              </button>
            </div>

            <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
              <p>Nếu lỗi vẫn tiếp tục, vui lòng liên hệ hỗ trợ kỹ thuật.</p>
              <p className="mt-1">Error ID: {this.state.error?.name}-{Date.now()}</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 