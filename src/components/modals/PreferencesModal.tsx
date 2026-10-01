import React from 'react';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshInterval: number;
  onSetRefreshInterval: (interval: number) => void;
  soundAlertsEnabled: boolean;
  onToggleSoundAlerts: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  refreshInterval,
  onSetRefreshInterval,
  soundAlertsEnabled,
  onToggleSoundAlerts,
  highContrast,
  onToggleHighContrast,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-card rounded-2xl w-full max-w-md shadow-2xl border border-border-subtle overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-surface-container-low border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">tune</span>
            </div>
            <div>
              <h3 className="font-headline-md text-base font-bold text-text-primary">
                App & Display Preferences
              </h3>
              <p className="text-xs text-text-muted">Telemetry & update behavior</p>
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
        <div className="p-5 space-y-5">
          {/* Refresh Interval */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-primary uppercase tracking-wider block">
              Auto-Refresh Telemetry Frequency
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[15, 30, 60].map((interval) => (
                <button
                  key={interval}
                  type="button"
                  onClick={() => onSetRefreshInterval(interval)}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    refreshInterval === interval
                      ? 'border-primary bg-primary text-white shadow-2xs'
                      : 'border-border-subtle bg-white text-text-primary hover:bg-slate-50'
                  }`}
                >
                  {interval}s
                </button>
              ))}
            </div>
            <p className="text-[11px] text-text-muted">
              Higher frequencies synchronize faster with LTA Datamall live feeds.
            </p>
          </div>

          {/* Sound Alerts */}
          <div className="flex items-center justify-between py-2 border-t border-border-subtle">
            <div>
              <div className="text-xs font-bold text-text-primary">Arrival Chime Alerts</div>
              <p className="text-[11px] text-text-muted">Play synth chime when bus is approaching</p>
            </div>
            <button
              onClick={onToggleSoundAlerts}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                soundAlertsEnabled ? 'bg-primary' : 'bg-slate-200'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  soundAlertsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between py-2 border-t border-border-subtle">
            <div>
              <div className="text-xs font-bold text-text-primary">High-Contrast Text</div>
              <p className="text-[11px] text-text-muted">Enhanced legibility under bright outdoor sunlight</p>
            </div>
            <button
              onClick={onToggleHighContrast}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                highContrast ? 'bg-primary' : 'bg-slate-200'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  highContrast ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-container-low border-t border-border-subtle flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-transit-purple-deep"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
