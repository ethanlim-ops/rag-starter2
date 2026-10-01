import React, { useState } from 'react';
import { FULL_ROUTE_STOPS_147 } from '../../data/transitData';

interface FullRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  busNumber: string;
  destination: string;
}

export const FullRouteModal: React.FC<FullRouteModalProps> = ({
  isOpen,
  onClose,
  busNumber,
  destination,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  if (!isOpen) return null;

  const filteredStops = FULL_ROUTE_STOPS_147.filter(
    (stop) =>
      stop.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      stop.road.toLowerCase().includes(filterQuery.toLowerCase()) ||
      stop.code.includes(filterQuery) ||
      (stop.mrt && stop.mrt.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-card rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl border border-border-subtle overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-surface-container-low border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-11 bg-primary text-white rounded-xl flex items-center justify-center font-service-number text-xl font-bold">
              {busNumber}
            </div>
            <div>
              <h3 className="font-headline-md text-lg font-bold text-text-primary">
                Full Route: To {destination}
              </h3>
              <p className="text-xs text-text-muted">
                {FULL_ROUTE_STOPS_147.length} total stops • Via Chinatown & Buona Vista
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-white/80 transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Search inside Route */}
        <div className="p-4 border-b border-border-subtle bg-surface-container-lowest">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search stop name, road, stop code or MRT..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs md:text-sm rounded-lg border border-border-subtle bg-surface-bright focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Stops List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredStops.map((stop) => {
            const isUserStop = stop.isCurrent;
            return (
              <div
                key={stop.code}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                  isUserStop
                    ? 'bg-primary-fixed/30 border-2 border-primary shadow-xs'
                    : stop.stage?.startsWith('Departed')
                    ? 'bg-slate-50/60 border-slate-200 opacity-65'
                    : 'bg-white border-border-subtle hover:border-primary/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono font-bold text-xs w-6 text-center ${
                      isUserStop ? 'text-primary' : 'text-text-muted'
                    }`}
                  >
                    {stop.seq}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text-primary text-sm">{stop.name}</span>
                      {stop.mrt && (
                        <span className="px-1.5 py-0.5 bg-slate-800 text-white text-[10px] font-bold rounded">
                          {stop.mrt}
                        </span>
                      )}
                      {isUserStop && (
                        <span className="px-1.5 py-0.5 bg-primary text-white text-[9px] font-bold rounded uppercase">
                          Your Stop
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-text-muted font-mono mt-0.5">
                      Stop {stop.code} • {stop.road}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                      isUserStop
                        ? 'bg-load-seats-available text-white'
                        : stop.stage?.startsWith('Departed')
                        ? 'text-slate-400 bg-slate-100'
                        : 'text-primary bg-primary-fixed/40'
                    }`}
                  >
                    {stop.stage}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-surface-container-low border-t border-border-subtle flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-transit-purple-deep"
          >
            Close Route Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
