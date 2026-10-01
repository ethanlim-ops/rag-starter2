import React, { useState, useEffect } from 'react';
import { fetchApiHealth, HealthCheckResponse } from '../../services/ltaApi';

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
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState(false);

  const checkHealth = async () => {
    setIsLoadingHealth(true);
    try {
      const data = await fetchApiHealth();
      setHealthData(data);
    } catch {
      // Ignore error
    } finally {
      setIsLoadingHealth(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-card rounded-2xl w-full max-w-lg shadow-2xl border border-border-subtle overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 bg-surface-container-low border-b border-border-subtle flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">tune</span>
            </div>
            <div>
              <h3 className="font-headline-md text-base font-bold text-text-primary">
                App & API Diagnostics
              </h3>
              <p className="text-xs text-text-muted">Telemetry, refresh & LTA DataMall v3</p>
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
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          {/* LTA API Status & Health Card */}
          <div className="bg-surface-container-low p-4 rounded-xl border border-border-subtle space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-load-seats-available animate-pulse"></span>
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                  /api/health Monitor
                </span>
              </div>
              <button
                onClick={checkHealth}
                disabled={isLoadingHealth}
                className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span className={`material-symbols-outlined text-xs ${isLoadingHealth ? 'animate-spin' : ''}`}>
                  refresh
                </span>
                <span>{isLoadingHealth ? 'Checking...' : 'Check Health'}</span>
              </button>
            </div>

            {healthData && (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">API Health Status:</span>
                  <span className="font-bold text-load-seats-available uppercase font-mono">
                    {healthData.status} (200 OK)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">LTA_ACCOUNT_KEY Configured:</span>
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      healthData.ltaApiKeyConfigured
                        ? 'bg-load-seats-available text-white'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {healthData.ltaApiKeyConfigured ? 'YES (Live Production)' : 'NO (Fallback Active)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Server Uptime:</span>
                  <span className="font-mono text-text-primary">{healthData.uptimeSeconds}s</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-border-subtle text-[11px] text-text-muted font-mono leading-relaxed">
                  {healthData.message}
                </div>
              </div>
            )}

            {/* Quick Test Links */}
            <div className="pt-2 border-t border-border-subtle/80 flex items-center gap-3 text-[11px]">
              <a
                href="/api/health"
                target="_blank"
                rel="noreferrer"
                className="text-primary font-bold hover:underline flex items-center gap-1"
              >
                <span>Open /api/health</span>
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
              <span className="text-text-muted">•</span>
              <a
                href="/api/bus-arrival?BusStopCode=83139&ServiceNo=15"
                target="_blank"
                rel="noreferrer"
                className="text-primary font-bold hover:underline flex items-center gap-1"
              >
                <span>Test /api/bus-arrival?BusStopCode=83139</span>
                <span className="material-symbols-outlined text-xs">open_in_new</span>
              </a>
            </div>
          </div>

          {/* Refresh Interval */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-primary uppercase tracking-wider block">
              Auto-Refresh Telemetry Frequency (LTA v3 is 20s)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[15, 20, 30].map((interval) => (
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
                  {interval}s {interval === 20 ? '(LTA Default)' : ''}
                </button>
              ))}
            </div>
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
        <div className="p-4 bg-surface-container-low border-t border-border-subtle flex justify-end shrink-0">
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
