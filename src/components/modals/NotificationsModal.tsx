import React from 'react';
import { SERVICE_ALERTS } from '../../data/transitData';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBus?: (bus: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onSelectBus,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-card rounded-2xl w-full max-w-lg shadow-2xl border border-border-subtle overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-surface-container-low border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </div>
            <div>
              <h3 className="font-headline-md text-base font-bold text-text-primary">
                Transit Advisories & Road Works
              </h3>
              <p className="text-xs text-text-muted">Live LTA broadcast notices</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text-primary rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5 max-h-80 overflow-y-auto">
          {SERVICE_ALERTS.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border flex flex-col gap-2 ${
                alert.severity === 'warning'
                  ? 'bg-amber-50/70 border-amber-200'
                  : 'bg-surface-container-low/70 border-border-subtle'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`material-symbols-outlined text-base ${
                    alert.severity === 'warning' ? 'text-amber-600' : 'text-primary'
                  }`}
                >
                  {alert.severity === 'warning' ? 'warning' : 'info'}
                </span>
                <span className="text-xs font-bold text-text-primary">{alert.title}</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">{alert.description}</p>

              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-text-muted uppercase font-bold">
                  Affected Services:
                </span>
                {alert.impactedServices.map((srv) => (
                  <button
                    key={srv}
                    onClick={() => {
                      if (onSelectBus) {
                        onSelectBus(srv);
                        onClose();
                      }
                    }}
                    className="px-2 py-0.5 bg-white border border-border-subtle rounded text-[11px] font-bold font-mono text-primary hover:bg-primary-fixed"
                  >
                    {srv}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-container-low border-t border-border-subtle flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-transit-purple-deep"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
