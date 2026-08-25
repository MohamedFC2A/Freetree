import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((r) => r.unregister());
        });
      }
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-[#FFE600] p-4 font-sans select-none text-black">
          <div className="neo-box-lg max-w-lg w-full bg-white p-6 border-4 border-black text-center space-y-4 shadow-[8px_8px_0px_#000]">
            <div className="w-14 h-14 bg-[#FF5376] text-white border-3 border-black neo-box-sm mx-auto flex items-center justify-center text-2xl shadow-[3px_3px_0px_#000]">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-black m-0 leading-tight">
                حدث خطأ غير متوقع أثناء التشغيل
              </h2>
              <p className="text-xs sm:text-sm font-bold text-gray-700 mt-1">
                يمكنك إعادة تحديث الصفحة ومسح الكاش التالف للمتابعة بسلاسة.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-2.5 bg-[#FFFDF0] border-2 border-black font-mono text-xs text-left text-red-600 overflow-x-auto">
                {this.state.error.message}
              </div>
            )}

            <button
              type="button"
              onClick={this.handleReset}
              className="w-full neo-btn bg-[#00FF66] hover:bg-[#00e05a] text-black py-3 px-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#000]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة تحميل الصفحة وتصفير الكاش</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
