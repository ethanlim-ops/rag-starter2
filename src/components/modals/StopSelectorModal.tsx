import React, { useState } from 'react';
import { BUS_STOPS, BusStop } from '../../data/transitData';

interface StopSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStopCode: string;
  onSelectStop: (stop: BusStop) => void;
  onDetectGPS: () => void;
  isDetecting: boolean;
}

export const StopSelectorModal: React.FC<StopSelectorModalProps> = ({
  isOpen,
  onClose,
  currentStopCode,
  onSelectStop,
  onDetectGPS,
  isDetecting,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const stopsList = Object.values(BUS_STOPS).filter(
    (stop) =>
      stop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stop.code.includes(searchTerm) ||
      stop.road.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-surface-card rounded-2xl w-full max-w-lg shadow-2xl border border-border-subtle overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-surface-container-low border-b border-border-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">near_me</span>
            </div>
            <div>
              <h3 className="font-headline-md text-base font-bold text-text-primary">
                Select Singapore Bus Stop
              </h3>
              <p className="text-xs text-text-muted">Orchard / Dhoby Ghaut / Bras Basah Corridor</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-text-muted hover:text-text-primary rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* GPS Button */}
        <div className="p-4 bg-white border-b border-border-subtle">
          <button
            onClick={onDetectGPS}
            disabled={isDetecting}
            className="w-full py-2.5 px-4 bg-primary text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-transit-purple-deep active:scale-95 transition-all shadow-xs disabled:opacity-70"
          >
            <span className={`material-symbols-outlined text-lg ${isDetecting ? 'animate-spin' : ''}`}>
              {isDetecting ? 'refresh' : 'my_location'}
            </span>
            <span>{isDetecting ? 'Triangulating Nearest Stop...' : 'Detect Nearest Stop via GPS'}</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border-subtle bg-surface-container-lowest">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-lg">
              search
            </span>
            <input
              type="text"
              placeholder="Search stop name, road or code (e.g. 08031, Somerset)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs md:text-sm rounded-lg border border-border-subtle bg-surface-bright focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Stop Items */}
        <div className="max-h-72 overflow-y-auto p-4 space-y-2.5">
          {stopsList.map((stop) => {
            const isSelected = stop.code === currentStopCode;
            return (
              <button
                key={stop.code}
                onClick={() => {
                  onSelectStop(stop);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-xl border text-left flex items-start justify-between transition-all ${
                  isSelected
                    ? 'border-2 border-primary bg-primary-fixed/20 shadow-xs'
                    : 'border-border-subtle bg-white hover:bg-surface-container-low hover:border-primary/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text-primary text-sm">{stop.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-surface-container font-mono rounded text-primary font-bold">
                      {stop.code}
                    </span>
                    {isSelected && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-primary text-white font-bold rounded uppercase">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-text-muted mt-1">
                    {stop.landmark} • {stop.road}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] text-load-seats-available font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">directions_walk</span>
                      {stop.distanceMeters}m away (~{stop.walkTimeMins} mins walk)
                    </span>
                    <span className="text-[11px] text-text-muted">• {stop.busesAtStop.length} services</span>
                  </div>
                </div>

                <div className="flex gap-1">
                  {stop.mrtLines.map((mrt) => (
                    <span
                      key={mrt.code}
                      className="px-1.5 py-0.5 text-[10px] font-bold rounded"
                      style={{ backgroundColor: mrt.bg, color: mrt.text }}
                    >
                      {mrt.code}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
