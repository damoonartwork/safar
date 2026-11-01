import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: '',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 text-center" dir="rtl">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-stone-200">
            <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 text-[#F26A51] rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#132238] mb-2">مشکلی در اجرای برنامه رخ داده است</h2>
            <p className="text-stone-600 text-sm mb-6 leading-relaxed">
              متأسفانه خطایی در بارگذاری یا پردازش رخ داد. لطفاً صفحه را بازآوری کنید یا لحظاتی بعد دوباره امتحان فرمایید.
            </p>
            <button
              onClick={this.handleReload}
              className="w-full py-3 px-6 bg-[#1FA3A3] hover:bg-[#188585] text-white font-medium rounded-xl transition duration-200 shadow-md active:scale-95"
            >
              بازآوری صفحه
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
