import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-[#2E9E5B] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-[#E5484D] shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-[#F0B429] shrink-0" />,
          info: <Info className="w-5 h-5 text-[#1B2A55] shrink-0" />,
        };

        const borders = {
          success: 'border-l-4 border-l-[#2E9E5B]',
          error: 'border-l-4 border-l-[#E5484D]',
          warning: 'border-l-4 border-l-[#F0B429]',
          info: 'border-l-4 border-l-[#1B2A55]',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-xl border border-slate-100 ${borders[toast.type] || borders.info} flex items-start gap-3 animate-slide-up transition-all`}
          >
            {icons[toast.type] || icons.info}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-[#1B2A55]">{toast.title}</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
