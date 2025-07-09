import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { H3, Lead } from './ui/typography';

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
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleGoBack = () => {
    window.history.back();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl shadow-strong max-w-2xl w-full border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <H3 className="text-xl text-white">Đã xảy ra lỗi</H3>
                  <Lead className="text-white/80">Chúng tôi đang khắc phục vấn đề này</Lead>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                
                <div className="space-y-2">
                  <H3 className="text-lg">Oops! Có gì đó không ổn</H3>
                  <Lead className="text-gray-600 dark:text-gray-400">
                    Chúng tôi đã ghi nhận lỗi này và sẽ khắc phục sớm nhất có thể.
                  </Lead>
                </div>

                {/* Error Details (Development Only) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                    <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Chi tiết lỗi (Development)
                    </summary>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Error:</strong> {this.state.error.message}
                      </div>
                      <div>
                        <strong>Stack:</strong>
                        <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-x-auto">
                          {this.state.error.stack}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs overflow-x-auto">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={this.handleRetry}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-medium hover:shadow-strong active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Thử lại</span>
                </button>
                
                <button
                  onClick={this.handleGoBack}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại</span>
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200"
                >
                  <Home className="w-4 h-4" />
                  <span>Trang chủ</span>
                </button>
              </div>

              {/* Contact Support */}
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Vẫn gặp vấn đề?{' '}
                  <a 
                    href="mailto:support@avengerhub.com" 
                    className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    Liên hệ hỗ trợ
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Modern Error Fallback Component
export const ModernErrorFallback: React.FC<{ error?: Error; resetErrorBoundary?: () => void }> = ({ 
  error, 
  resetErrorBoundary 
}) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl shadow-strong max-w-2xl w-full border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-white/20 backdrop-blur-sm">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <H3 className="text-xl text-white">Đã xảy ra lỗi</H3>
            <Lead className="text-white/80">Chúng tôi đang khắc phục vấn đề này</Lead>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          
          <div className="space-y-2">
            <H3 className="text-lg">Oops! Có gì đó không ổn</H3>
            <Lead className="text-gray-600 dark:text-gray-400">
              Chúng tôi đã ghi nhận lỗi này và sẽ khắc phục sớm nhất có thể.
            </Lead>
          </div>

          {error && (
            <details className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
              <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chi tiết lỗi
              </summary>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {error.message}
              </div>
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {resetErrorBoundary && (
            <button
              onClick={resetErrorBoundary}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-medium hover:shadow-strong active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Thử lại</span>
            </button>
          )}
          
          <button
            onClick={() => window.history.back()}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300/50 dark:border-gray-600/50 bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200"
          >
            <Home className="w-4 h-4" />
            <span>Trang chủ</span>
          </button>
        </div>

        {/* Contact Support */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Vẫn gặp vấn đề?{' '}
            <a 
              href="mailto:support@avengerhub.com" 
              className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              Liên hệ hỗ trợ
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default ErrorBoundary; 