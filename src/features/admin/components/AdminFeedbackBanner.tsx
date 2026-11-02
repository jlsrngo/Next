import React from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export interface AdminFeedbackState {
  type: 'success' | 'error';
  message: string;
}

export interface AdminFeedbackBannerProps {
  feedback: AdminFeedbackState | null;
  onDismiss: () => void;
}

function AdminFeedbackBannerComponent({ feedback, onDismiss }: AdminFeedbackBannerProps) {
  if (!feedback) return null;

  return (
    <div
      role="alert"
      className={`border px-4 py-3 font-mono text-xs flex items-center justify-between transition-all ${
        feedback.type === 'success'
          ? 'border-line bg-bg-raised text-ink'
          : 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400'
      }`}
    >
      <div className="flex items-center gap-2">
        {feedback.type === 'success' ? (
          <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
        ) : (
          <AlertTriangle size={14} className="text-red-500 shrink-0" />
        )}
        <span>{feedback.message}</span>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-faint hover:text-ink transition-colors"
        aria-label="Dismiss feedback notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export const AdminFeedbackBanner = React.memo(AdminFeedbackBannerComponent);
export default AdminFeedbackBanner;
